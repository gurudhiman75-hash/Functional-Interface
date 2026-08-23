import {
  prepareSea002Cp006QuestionBankCandidate,
  SEA002_CP006_QUESTION_BANK_READINESS,
  SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
} from "./question-bank-readiness.ts";
import {
  generateSea002Cp006QuestionStudioBatch as generateSourceBatch,
  isSea002Cp006QuestionStudioRequest,
  listSea002Cp006QuestionStudioPackages as listSourcePackages,
  type Sea002Cp006QuestionStudioRequest,
} from "./question-studio-integration.ts";

export const SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY =
  "SEA002_CP006_QUESTION_BANK_ACCEPTANCE_V1" as const;

export const SEA002_CP006_QUESTION_BANK_ACCEPTANCE = Object.freeze({
  authorityId: SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  readinessAuthorityId: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
  packageId: SEA002_CP006_QUESTION_BANK_READINESS.packageId,
  checkpointId: SEA002_CP006_QUESTION_BANK_READINESS.checkpointId,
  permanentQlIds: SEA002_CP006_QUESTION_BANK_READINESS.permanentQlIds,
  supportedLanguages: SEA002_CP006_QUESTION_BANK_READINESS.supportedLanguages,
  englishFreezeFingerprint: SEA002_CP006_QUESTION_BANK_READINESS.englishFreezeFingerprint,
  localizedFreezeFingerprint: SEA002_CP006_QUESTION_BANK_READINESS.localizedFreezeFingerprint,
  status: "QUESTION_BANK_ACCEPTANCE_ENABLED" as const,
  questionBank: Object.freeze({
    statusBeforeAcceptance: "READY_FOR_STORAGE" as const,
    writable: true as const,
    acceptanceMode: "BANK_ONLY" as const,
    manualGenerationApprovalRequired: true as const,
    acceptedQuestionStatus: "approved" as const,
    idempotentByGenerationItem: true as const,
    solvedArrangementDiagramPreserved: true as const,
  }),
  downstreamLifecycle: Object.freeze({
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  }),
  sourceContract: Object.freeze({
    sourceGeneratorReopened: false as const,
    sourceQuestionBankWritable: false as const,
    sourceQuestionBankStatus: "NOT_STORED" as const,
    frozenContentRewritten: false as const,
  }),
  nextGate: "TEST_AND_PUBLICATION_LIFECYCLE_ACTIVATION_REQUIRES_SEPARATE_CHECKPOINT" as const,
});

export { isSea002Cp006QuestionStudioRequest };

export function listSea002Cp006QuestionBankAcceptedPackages() {
  const source = listSourcePackages()[0]!;
  return [Object.freeze({
    ...source,
    label: "Seating Arrangement — Two Parallel Rows Facing Each Other · Question Bank acceptance",
    reviewOnly: false,
    reviewStatus: "QUESTION_STUDIO_REVIEW_WITH_BANK_ACCEPTANCE",
    questionBankAcceptanceCheckpointId: "SEA-CP-006-BANK-ACCEPTANCE",
    questionBankReadinessAuthority: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
    questionBankAcceptanceAuthority: SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    questionBankAcceptanceActive: true,
    questionBankStatus: "READY_FOR_STORAGE",
    questionBankWritable: true,
    questionBankAcceptanceMode: "BANK_ONLY",
    manualApprovalRequired: true,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    productionStaging: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  })];
}

export async function generateSea002Cp006QuestionBankAcceptedBatch(
  request: Sea002Cp006QuestionStudioRequest = {},
) {
  const source = await generateSourceBatch(request);
  const questions = Object.freeze(
    source.questions.map((question) => {
      const ready = prepareSea002Cp006QuestionBankCandidate(question);
      return Object.freeze({
        ...ready,
        questionBankReadinessAuthority: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
        questionBankAcceptanceAuthority: SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
        questionBankAcceptanceActive: true as const,
      });
    }),
  );

  const generationContext = Object.freeze({
    ...source.generationContext,
    lifecycleStatus: "QUESTION_STUDIO_REVIEW_WITH_BANK_ACCEPTANCE" as const,
    questionBankReadinessAuthority: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
    questionBankAcceptanceAuthority: SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    questionBankAcceptanceActive: true as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    manualApprovalRequired: true as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  });

  return Object.freeze({
    generationContext,
    questionPackages: questions,
    questions,
  });
}
