import {
  prepareSea002Cp006QuestionBankCandidate,
  SEA002_CP006_QUESTION_BANK_READINESS,
  SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
} from "./question-bank-readiness.ts";
import {
  generateSea002Cp006QuestionStudioBatch as generateSourceBatch,
  isSea002Cp006QuestionStudioRequest as isSea002Cp006SourceQuestionStudioRequest,
  listSea002Cp006QuestionStudioPackages as listSourcePackages,
  type Sea002Cp006QuestionStudioRequest,
} from "./question-studio-integration.ts";
import {
  generateSea002Cp008QuestionStudioBatchV1,
  isSea002Cp008QuestionStudioRequest,
  listSea002Cp008QuestionStudioPackagesV1,
} from "../cp008/question-studio-integration-v1.ts";
import type { Sea002Cp008QuestionStudioRequest } from "../cp008/question-studio-preintegration-v1.ts";

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

export type Sea002CumulativeQuestionStudioRequest =
  | Sea002Cp006QuestionStudioRequest
  | Sea002Cp008QuestionStudioRequest;

export function isSea002Cp006QuestionStudioRequest(
  request: Sea002CumulativeQuestionStudioRequest,
): boolean {
  return isSea002Cp008QuestionStudioRequest(request)
    || isSea002Cp006SourceQuestionStudioRequest(request);
}

export function listSea002Cp006QuestionBankAcceptedPackages() {
  const source = listSourcePackages()[0]!;
  const square = listSea002Cp008QuestionStudioPackagesV1()[0]!;
  return [Object.freeze({
    ...source,
    name: "SEA-002 Seating Arrangement — Parallel Rows + Square Seating",
    label: "Seating Arrangement — Parallel Rows + Square Seating",
    subtopic: "Seating Arrangement",
    cpIds: Object.freeze([...source.cpIds, ...square.cpIds]),
    canonicalProblems: Object.freeze([
      ...source.canonicalProblems,
      ...square.canonicalProblems,
    ]),
    permanentQlCount: source.permanentQlCount + square.permanentQlCount,
    permanentQlIds: Object.freeze([
      ...source.permanentQlIds,
      ...square.permanentQlIds,
    ]),
    supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
    supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE_CHECKPOINT_SCOPED",
    supportedRuntimeModes: Object.freeze([
      source.runtimeMode,
      square.runtimeMode,
    ]),
    reviewOnly: false,
    reviewStatus: "CHECKPOINT_SCOPED_FROZEN_AUTHORITIES",
    questionBankAcceptanceCheckpointId: "SEA-CP-006-BANK-ACCEPTANCE",
    questionBankReadinessAuthority: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
    questionBankAcceptanceAuthority: SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    questionBankAcceptanceActive: true,
    questionBankStatus: "CHECKPOINT_SCOPED",
    questionBankWritable: true,
    questionBankAcceptanceMode: "CP006_BANK_ONLY_CP008_NOT_STORED",
    manualApprovalRequired: true,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    productionStaging: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    checkpointCapabilities: Object.freeze({
      "SEA-CP-006": Object.freeze({
        questionStudioActive: true,
        questionBankStatus: "READY_FOR_STORAGE",
        questionBankWritable: true,
        questionBankAcceptanceMode: "BANK_ONLY",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
      }),
      "SEA-CP-008": Object.freeze({
        questionStudioActive: true,
        productOwnerApprovalStatus: "APPROVED",
        freezeStatus: "FROZEN",
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        productionStaging: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        releaseId: square.releaseId,
      }),
    }),
  })];
}

export async function generateSea002Cp006QuestionBankAcceptedBatch(
  request: Sea002CumulativeQuestionStudioRequest = {},
) {
  if (isSea002Cp008QuestionStudioRequest(request)) {
    return generateSea002Cp008QuestionStudioBatchV1(request);
  }

  const source = await generateSourceBatch(request as Sea002Cp006QuestionStudioRequest);
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
