import { deterministicPick } from "../deterministic";
import { generateCom001HumanReviewV2Candidate } from "./com001-human-review-remediation-v2";
import { generateCom001Ql009ExamConventionV2 } from "./com001-ql009-exam-convention-v2";
import {
  generateCom001Ql001RelationalV2,
  generateCom001Ql002RelationalV2,
  generateCom001Ql003RelationalV2,
  generateCom001Ql004RelationalV2,
  generateCom001Ql005RelationalV2,
} from "./com001-relational-surfaces-v2";
import { generateCom001ReviewQuestion, listCom001ReviewQlIds } from "./com001-review-synthesis";
import type { Com001ReviewQuestion } from "./com001-review-types";

export type Com001ReviewV2Mode =
  | "RELATIONAL_SURFACE_EXPANSION"
  | "UNCHANGED_V1"
  | "BACKUP_EXAM_REMEDIATION"
  | "CAPACITY_EXAM_1024"
  | "CAPACITY_STANDARD_EXPLICIT";

export type Com001ReviewV2Question = Com001ReviewQuestion & {
  humanReviewV2: {
    status: "REMEDIATED_CANDIDATE" | "UNCHANGED_FROM_V1" | "BLOCKED_PENDING_MODEL";
    reason: string;
  };
  reviewV2Mode: Com001ReviewV2Mode;
  relationalSurfaceMode?: string;
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

  const v1 = generateCom001ReviewQuestion({ qlId: "COM-001-QL-009", seed });
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

function relationalQuestionV2(
  qlId: string,
  seed: string,
): Com001ReviewV2Question | undefined {
  const generators: Record<string, (seed: string) => { question: Com001ReviewQuestion; surfaceMode: string }> = {
    "COM-001-QL-001": generateCom001Ql001RelationalV2,
    "COM-001-QL-002": generateCom001Ql002RelationalV2,
    "COM-001-QL-003": generateCom001Ql003RelationalV2,
    "COM-001-QL-004": generateCom001Ql004RelationalV2,
    "COM-001-QL-005": generateCom001Ql005RelationalV2,
  };
  const generator = generators[qlId];
  if (!generator) return undefined;
  const generated = generator(seed);
  return {
    ...generated.question,
    questionId: `${generated.question.questionId}-V2CANDIDATE`,
    humanReviewV2: {
      status: "REMEDIATED_CANDIDATE",
      reason: "Expands the frozen QL into both forward and inverse/correct-match surfaces required by its learner-task contract.",
    },
    reviewV2Mode: "RELATIONAL_SURFACE_EXPANSION",
    relationalSurfaceMode: generated.surfaceMode,
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

  const relational = relationalQuestionV2(input.qlId, input.seed);
  if (relational) return relational;

  const question = generateCom001HumanReviewV2Candidate(input);
  return {
    ...question,
    reviewV2Mode: input.qlId === "COM-001-QL-007"
      ? "BACKUP_EXAM_REMEDIATION"
      : "UNCHANGED_V1",
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
