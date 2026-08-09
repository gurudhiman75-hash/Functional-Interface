import { runProbabilityPackagePipeline } from "../../shared/pipeline";
import { buildProbabilityMockPolicy } from "../../shared/exam-readiness-remodeler";
import type { ProbabilityGenerationInput, ProbabilityQuestion } from "../../shared/types";
import { PRB_001_LIBRARIES } from "./library";

export const PRB_001_PACKAGE_ID = "PRB-001" as const;
export const PRB_001_CP_IDS = ["PRB-CP-001", "PRB-CP-002", "PRB-CP-003", "PRB-CP-004", "PRB-CP-005"] as const;
export type Prb001CanonicalProblemId = (typeof PRB_001_CP_IDS)[number];

export function getPrb001ActiveCanonicalProblemIds(): readonly Prb001CanonicalProblemId[] {
  return PRB_001_CP_IDS;
}

export function listPrb001QuestionEntries() {
  return PRB_001_LIBRARIES.registry.map((entry) => ({ ...entry }));
}

function applyMockPolicy(question: ProbabilityQuestion): ProbabilityQuestion {
  const entry = PRB_001_LIBRARIES.registry.find((item) => item.qlId === question.questionLanguageId);
  if (!entry) throw new Error(`Missing PRB-001 registry entry ${question.questionLanguageId}`);
  const mockPolicy = buildProbabilityMockPolicy(entry);
  const testEligibility = mockPolicy.eligible ? "ELIGIBLE_WITH_FAMILY_LIMIT" : "LEARNING_ONLY";
  return {
    ...question,
    parameters: {
      ...question.parameters,
      mockPolicy,
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: mockPolicy.eligible ? "WRITABLE" : "NOT_STORED",
      testEligibility,
    },
    traceability: {
      ...question.traceability,
      mockPolicy,
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: mockPolicy.eligible ? "WRITABLE" : "NOT_STORED",
      testEligibility,
      effectiveDifficulty: mockPolicy.effectiveDifficulty,
      freezeStatus: "ENGLISH_MOCK_READY",
    },
  };
}

export function runPrb001Pipeline(
  cpId: Prb001CanonicalProblemId = PRB_001_CP_IDS[0],
  input: ProbabilityGenerationInput = {},
): ProbabilityQuestion {
  return applyMockPolicy(runProbabilityPackagePipeline(PRB_001_LIBRARIES, cpId, input));
}
