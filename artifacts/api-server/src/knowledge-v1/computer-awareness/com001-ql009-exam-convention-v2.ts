import { deterministicPick, deterministicShuffle } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { Com001HumanReviewV2Candidate } from "./com001-human-review-remediation-v2";

export type Com001ExamCapacityRelationV2 = {
  factId: string;
  label: string;
  answer: string;
  relationText: string;
  sourceIds: string[];
  evidenceClass: "SSC_PYQ" | "STATE_EXAM_PYQ" | "STANDARD";
};

/**
 * Review-candidate authority only.
 *
 * These relations intentionally model traditional competitive-exam usage
 * separately from strict SI/IEC prefix semantics. They are not yet promoted
 * into the canonical COM-001 fact corpus.
 */
export const COM001_EXAM_CAPACITY_RELATIONS_V2: Com001ExamCapacityRelationV2[] = [
  {
    factId: "com001-exam-byte-bits",
    label: "1 byte",
    answer: "8 bits",
    relationText: "1 byte = 8 bits",
    sourceIds: ["NIST-CSRC-BYTE"],
    evidenceClass: "STANDARD",
  },
  {
    factId: "com001-exam-kb-bytes",
    label: "1 KB",
    answer: "1,024 bytes",
    relationText: "1 KB = 1,024 bytes",
    sourceIds: ["UPSSSC-JA-2025-STORAGE-UNITS"],
    evidenceClass: "STATE_EXAM_PYQ",
  },
  {
    factId: "com001-exam-mb-kb",
    label: "1 MB",
    answer: "1,024 KB",
    relationText: "1 MB = 1,024 KB",
    sourceIds: ["SSC-CHSL-2023-MB-1024KB"],
    evidenceClass: "SSC_PYQ",
  },
  {
    factId: "com001-exam-gb-mb",
    label: "1 GB",
    answer: "1,024 MB",
    relationText: "1 GB = 1,024 MB",
    sourceIds: ["UPSSSC-JA-2025-STORAGE-UNITS"],
    evidenceClass: "STATE_EXAM_PYQ",
  },
  {
    factId: "com001-exam-tb-gb",
    label: "1 TB",
    answer: "1,024 GB",
    relationText: "1 TB = 1,024 GB",
    sourceIds: ["UPSSSC-JA-2025-STORAGE-UNITS"],
    evidenceClass: "STATE_EXAM_PYQ",
  },
];

const WRONG_ANSWERS: Record<string, string[]> = {
  "1 byte": ["4 bits", "16 bits", "32 bits"],
  "1 KB": ["1,000 bytes", "512 bytes", "2,048 bytes"],
  "1 MB": ["1,000 KB", "1,024 bytes", "1,024 MB"],
  "1 GB": ["1,000 MB", "1,024 KB", "1,024 GB"],
  "1 TB": ["1,000 GB", "1,024 MB", "1,024 TB"],
};

function stemFor(fact: Com001ExamCapacityRelationV2, seed: string) {
  if (fact.label === "1 byte") {
    return deterministicPick(
      [
        "How many bits are there in one byte?",
        "One byte is equal to how many bits?",
      ],
      `${seed}:stem`,
    );
  }
  if (fact.label === "1 MB") {
    return deterministicPick(
      [
        "In the traditional 1024-based convention used in basic computer-awareness exams, 1 MB equals how many KB?",
        "Using the traditional competitive-exam memory-unit convention, 1 MB consists of 1024 ______.",
      ],
      `${seed}:stem`,
    );
  }
  return `Using the traditional 1024-based convention common in basic computer-awareness exams, ${fact.label} equals:`;
}

function answerForStem(fact: Com001ExamCapacityRelationV2, stem: string) {
  if (stem.endsWith("1024 ______.")) return "KB";
  return fact.answer;
}

function wrongAnswersFor(fact: Com001ExamCapacityRelationV2, stem: string) {
  if (stem.endsWith("1024 ______.")) return ["GB", "TB", "bytes"];
  return WRONG_ANSWERS[fact.label] ?? [];
}

export function generateCom001Ql009ExamConventionV2(seed: string): Com001HumanReviewV2Candidate {
  const fact = deterministicPick(COM001_EXAM_CAPACITY_RELATIONS_V2, `${seed}:fact`);
  const stem = stemFor(fact, seed);
  const canonicalAnswer = answerForStem(fact, stem);
  const wrong = wrongAnswersFor(fact, stem);
  if (wrong.length !== 3) throw new Error(`QL-009 V2 distractors missing for ${fact.label}`);

  const records = deterministicShuffle(
    [
      { text: canonicalAnswer, correct: true },
      ...wrong.map((text) => ({ text, correct: false })),
    ],
    `${seed}:options`,
  );
  const options = records.map((entry) => entry.text);
  const correctIndex = records.findIndex((entry) => entry.correct);
  const explanation = fact.label === "1 byte"
    ? "One byte contains 8 bits. Therefore, 8 bits is the correct answer."
    : `${fact.relationText} under the traditional 1024-based convention commonly used in competitive-exam computer-awareness questions. This exam convention is kept separate from strict SI/IEC prefix definitions.`;

  assertKnowledgeQuestionValid({
    stem,
    explanation,
    options,
    correctIndex,
    canonicalAnswer,
  });

  return {
    questionId: `COM001-V2CANDIDATE-COM-001-QL-009-${seed}`,
    qlId: "COM-001-QL-009",
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: fact.sourceIds,
    sourceFactIds: [fact.factId],
    solverAuthority: "EXAM_CONVENTION_CAPACITY_RELATION",
    reviewOnly: true,
    runtimeRegistered: false,
    humanReviewV2: {
      status: "REMEDIATED_CANDIDATE",
      reason: "Adds explicit 1024-based competitive-exam convention while preserving a separate standards authority for SI/IEC semantics.",
    },
  };
}
