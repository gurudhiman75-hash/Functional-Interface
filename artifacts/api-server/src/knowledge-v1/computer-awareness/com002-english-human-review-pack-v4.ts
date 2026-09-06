import {
  COM002_ENGLISH_GENERATOR_VERSION_V4,
  generateCom002ReviewQuestionV4,
} from "./com002-review-synthesis-v4";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);

const seeds = qlIds.flatMap((qlId) =>
  (["A", "B"] as const).map((suffix) => `human-review-wave1:${qlId}:${suffix}`),
);

/**
 * Exact learner-facing V4 English pack printed by canonical Content Engine run
 * #452. It is materialized from the deterministic review seed family so the
 * reviewed questions cannot drift from the generator while awaiting approval.
 *
 * Automated execution success is evidence only; it is NOT human approval.
 */
export const COM002_ENGLISH_HUMAN_REVIEW_PACK_V4 = Object.freeze({
  packId: "COM-002-ENGLISH-HUMAN-REVIEW-PACK-V4" as const,
  chapterId: "COM-002" as const,
  status: "EXECUTED_GREEN_AWAITING_EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
  generatorVersion: COM002_ENGLISH_GENERATOR_VERSION_V4,
  language: "en" as const,
  qlCount: 13,
  questionsPerQl: 2,
  questionCount: 26,
  seedFamily: "human-review-wave1:COM-002-QL-001..013:{A|B}" as const,
  executionEvidence: Object.freeze({
    featureHeadSha: "0d56440c0c99e3250465472beb507b596a3b5e73" as const,
    pullRequestNumber: 1019,
    pullRequestMergeSha: "5bc0ef69374cdf5eab33c77cf3a0b818fdba797b" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 452,
    workflowRunId: 33090114122,
    workflowJobId: 98580358004,
    conclusion: "SUCCESS" as const,
    executedOn: "2026-08-27" as const,
    englishV4CorpusQuestions: 520,
    englishV4SamplerQuestions: 26,
    localizationV3ParityQuestions: 1040,
    localizationV3SamplerQuestions: 26,
    preBankCandidateQuestions: 390,
  }),
  explicitApprovalVerified: false,
  approvalSource: null,
  approvedOn: null,
  questions: Object.freeze(
    seeds.map((seed) => {
      const qlId = seed.split(":")[1];
      return Object.freeze({
        seed,
        question: generateCom002ReviewQuestionV4({ qlId, seed }),
      });
    }),
  ),
});
