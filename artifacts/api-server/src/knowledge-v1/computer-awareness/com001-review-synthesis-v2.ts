import { deterministicPick } from "../deterministic";
import { generateCom001HumanReviewV2Candidate } from "./com001-human-review-remediation-v2";
import { generateCom001Ql009ExamConventionV2 } from "./com001-ql009-exam-convention-v2";
import { generateCom001ReviewQuestion, listCom001ReviewQlIds } from "./com001-review-synthesis";

export type Com001ReviewV2Mode =
  | "UNCHANGED_V1"
  | "GRAMMAR_REMEDIATION"
  | "BACKUP_EXAM_REMEDIATION"
  | "CAPACITY_EXAM_1024"
  | "CAPACITY_STANDARD_EXPLICIT";

export type Com001ReviewV2Question = ReturnType<typeof generateCom001HumanReviewV2Candidate> & {
  reviewV2Mode: Com001ReviewV2Mode;
  capacityConvention?: "TRADITIONAL_EXAM_1024" | "SI_IEC_EXPLICIT";
};

const QL009_MODE_POOL = [
  "CAPACITY_EXAM_1024",
  "CAPACITY_EXAM_1024",
  "CAPACITY_EXAM_1024",
  "CAPACITY_STANDARD_EXPLICIT",
] as const;

function generateQl009V2(seed: string): Com001ReviewV2Question {
  const mode = deterministicPick(QL009_MODE_POOL, `${seed}:v2-capacity-mode`);
  if (mode === "CAPACITY_EXAM_1024") {
    return {
      ...generateCom001Ql009ExamConventionV2(seed),
      reviewV2Mode: mode,
      capacityConvention: "TRADITIONAL_EXAM_1024",
    };
  }

  const v1 = generateCom001ReviewQuestion({
    qlId: "COM-001-QL-009",
    seed,
  });
  return {
    ...v1,
    questionId: `${v1.questionId}-V2CANDIDATE`,
    humanReviewV2: {
      status: "UNCHANGED_FROM_V1",
      reason: "Retains explicit SI/IEC standards-mode coverage alongside the separately tagged traditional exam convention.",
    },
    reviewV2Mode: mode,
    capacityConvention: "SI_IEC_EXPLICIT",
  };
}

export function listCom001ReviewV2QlIds() {
  return listCom001ReviewQlIds();
}

export function generateCom001ReviewQuestionV2(input: { qlId: string; seed: string }): Com001ReviewV2Question {
  if (!input.seed.trim()) throw new Error("COM-001 V2 review generation requires an explicit seed");
  if (!listCom001ReviewV2QlIds().includes(input.qlId)) {
    throw new Error(`COM-001 V2 review QL ${input.qlId} is not allocated`);
  }
  if (input.qlId === "COM-001-QL-009") return generateQl009V2(input.seed);

  const question = generateCom001HumanReviewV2Candidate(input);
  const reviewV2Mode: Com001ReviewV2Mode = input.qlId === "COM-001-QL-002" || input.qlId === "COM-001-QL-003"
    ? "GRAMMAR_REMEDIATION"
    : input.qlId === "COM-001-QL-007"
      ? "BACKUP_EXAM_REMEDIATION"
      : "UNCHANGED_V1";

  return {
    ...question,
    reviewV2Mode,
  };
}

export function generateCom001ReviewBatchV2(qlId: string, count: number, seed: string) {
  if (!Number.isInteger(count) || count <= 0 || count > 100) {
    throw new Error("COM-001 V2 review batch count must be between 1 and 100");
  }
  return Array.from({ length: count }, (_, index) =>
    generateCom001ReviewQuestionV2({ qlId, seed: `${seed}:${index}` }),
  );
}
