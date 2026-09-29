import type { Sea001QlId } from "./ql-registry.ts";
import {
  sea001DeliveryRoleForRuntimeQuery,
  sea001QlForRuntimeQuery,
} from "./ql-registry.ts";
import {
  assessSea001DifficultyV1,
  type Sea001DifficultyAssessmentV1,
} from "./difficulty-v1.ts";

export interface Sea001EnglishReviewInput {
  checkpointId: "SEA-CP-001" | "SEA-CP-002" | "SEA-CP-003" | "SEA-CP-004" | "SEA-CP-005";
  caseletId: string;
  setupText: string;
  clueTexts: readonly string[];
  checkpointSkillCoverage: readonly string[];
  seatCount: number;
  child: {
    queryContractId: string;
    answerType: string;
    text: string;
    explanation: string;
    options: readonly {
      display: string;
      isCorrect: boolean;
      misconceptionId?: string;
      recomputation: Readonly<Record<string, unknown>>;
    }[];
    answerIndex: number;
  };
}

export interface Sea001EnglishReviewRecordV1 {
  authority: "SEA_001_ENGLISH_REVIEW_V1";
  caseletId: string;
  checkpointId: Sea001EnglishReviewInput["checkpointId"];
  qlId: Sea001QlId;
  deliveryRole: "MOCK_AUTHENTIC_BASELINE" | "PRACTICE_VARIANT_WITHIN_QL";
  stem: string;
  explanation: string;
  options: readonly string[];
  correctIndex: number;
  difficulty: Sea001DifficultyAssessmentV1;
  diagramPolicy: "EXPLANATION_ONLY";
  reviewStatus: "MANUAL_REVIEW_REQUIRED";
}

export function projectSea001EnglishReviewV1(
  input: Sea001EnglishReviewInput,
): Sea001EnglishReviewRecordV1 {
  const qlId = sea001QlForRuntimeQuery(input.child.queryContractId);
  const difficulty = assessSea001DifficultyV1({
    checkpointId: input.checkpointId,
    queryContractId: input.child.queryContractId,
    seatCount: input.seatCount,
    clueCount: input.clueTexts.length,
    checkpointSkillCoverage: input.checkpointSkillCoverage,
    answerType: input.child.answerType,
  });

  return Object.freeze({
    authority: "SEA_001_ENGLISH_REVIEW_V1",
    caseletId: input.caseletId,
    checkpointId: input.checkpointId,
    qlId,
    deliveryRole: sea001DeliveryRoleForRuntimeQuery(input.child.queryContractId),
    stem: input.child.text,
    explanation: input.child.explanation,
    options: Object.freeze(input.child.options.map((option) => option.display)),
    correctIndex: input.child.answerIndex,
    difficulty,
    diagramPolicy: "EXPLANATION_ONLY",
    reviewStatus: "MANUAL_REVIEW_REQUIRED",
  });
}

export const SEA_001_ENGLISH_REVIEW_V1 = Object.freeze({
  authorityId: "SEA_001_ENGLISH_REVIEW_V1",
  qlAuthority: "SEA_001_PERMANENT_QL_REGISTRY_V1",
  difficultyAuthority: "SEA_001_STRUCTURAL_DIFFICULTY_V1",
  diagramPolicy: "EXPLANATION_ONLY",
  reviewStatus: "MANUAL_REVIEW_REQUIRED",
  englishFreezePermitted: false,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
});
