import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP010_QUESTION_STUDIO_PACKAGE,
  BTD_CP010_QUESTION_STUDIO_VERSION,
  buildBtdCp010QuestionStudioPreview,
  generateBtdCp010QuestionStudioBatch,
  isBtdCp010QuestionStudioRequest,
  type BtdCp010Language,
  type BtdCp010QuestionStudioRequest,
} from "../BTD-CP-010/btd-cp010-multilingual-question-studio-v1";
import {
  BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY,
  BTD_CP011_QUESTION_BANK_READINESS_VERSION,
  buildBtdCp011QuestionBankReadinessCandidateV1,
} from "../BTD-CP-011/btd-cp011-question-bank-readiness-v1";

export const BTD_CP012_QUESTION_BANK_ADMISSION_VERSION =
  "BTD-001-CP012-QUESTION-BANK-ADMISSION-v1" as const;
export const BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY =
  "BTD-001-CP012-BANK-ONLY-AFTER-MANUAL-STUDIO-APPROVAL-v1" as const;

export const BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY = Object.freeze({
  status: "QUESTION_STUDIO_REVIEW_BANK_ONLY" as const,
  questionBankAdmissionApproved: true as const,
  readinessAuthority: BTD_CP011_QUESTION_BANK_READINESS_VERSION,
  requiresManualStudioReview: true as const,
  requiredGenerationItemStatus: "approved" as const,
  automaticAdmissionAllowed: false as const,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankWriteRouteEnabled: true as const,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  questionBankAcceptanceAuthority: BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  contentMutationAuthorized: false as const,
});

function assertCp011ReadinessAuthority() {
  if (!BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.admissionContractValidated) {
    throw new Error("BTD-001 CP012 requires the certified CP011 admission contract.");
  }
  if (BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.questionBankWritable) {
    throw new Error("BTD-001 CP011 readiness authority was expected to remain non-writable.");
  }
}

export const BTD_CP012_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...BTD_CP010_QUESTION_STUDIO_PACKAGE,
  checkpointId: "BTD-CP-012" as const,
  integrationAuthority: BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
  runtimeMode: BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.status,
  reviewStatus: "FROZEN_EN_HI_PA_BANK_ONLY_AFTER_MANUAL_APPROVAL" as const,
  manualApprovalRequired: true as const,
  questionBankAdmissionApproved: true as const,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  questionBankAcceptanceAuthority: BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  contentMutationAuthorized: false as const,
});

type AnyQuestion = Readonly<Record<string, any>>;

function bankOnlyQuestion(
  question: AnyQuestion,
  qlId: BtdPermanentQlId,
  seed: string,
  language: BtdCp010Language,
) {
  assertCp011ReadinessAuthority();
  const candidate = buildBtdCp011QuestionBankReadinessCandidateV1(qlId, seed, language);
  if (candidate.bankPayload.frozenContentFingerprint !== question.frozenContentFingerprint) {
    throw new Error(`${qlId}:${language}: CP012 source fingerprint drifted from CP011 readiness authority.`);
  }

  const lifecycle = {
    checkpointId: "BTD-CP-012" as const,
    integrationAuthority: BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
    runtimeMode: BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.status,
    reviewStatus: "FROZEN_EN_HI_PA_BANK_ONLY_AFTER_MANUAL_APPROVAL" as const,
    manualApprovalRequired: true as const,
    questionBankAdmissionApproved: true as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    questionBankAcceptanceAuthority: BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    questionBankAdmissionKey: candidate.admissionKey,
    questionBankAdmissionPayloadFingerprint: candidate.admissionPayloadFingerprint,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    contentMutationAuthorized: false as const,
  };

  return Object.freeze({
    ...question,
    sourceStudioQuestionId: question.questionId,
    questionId: candidate.admissionKey,
    ...lifecycle,
    generationMetadata: Object.freeze({
      ...(question.generationMetadata ?? {}),
      sourceStudioQuestionId: question.questionId,
      ...lifecycle,
    }),
  });
}

export function buildBtdCp012QuestionBankAdmissionPreviewV1(
  qlId: BtdPermanentQlId,
  seed: string,
  language: BtdCp010Language = "en",
  index = 0,
  count = 1,
) {
  const source = buildBtdCp010QuestionStudioPreview(qlId, seed, language, index, count);
  return bankOnlyQuestion(source, qlId, seed, language);
}

export function generateBtdCp012QuestionBankAdmissionBatchV1(
  request: BtdCp010QuestionStudioRequest = {},
) {
  assertCp011ReadinessAuthority();
  const source = generateBtdCp010QuestionStudioBatch(request) as Readonly<Record<string, any>>;
  const questions = Object.freeze(
    (source.questions as readonly AnyQuestion[]).map((question) => {
      const qlId = String(question.qlId) as BtdPermanentQlId;
      const language = String(question.language) as BtdCp010Language;
      const seed = String(question.seed);
      return bankOnlyQuestion(question, qlId, seed, language);
    }),
  );
  const lifecycle = {
    checkpointId: "BTD-CP-012" as const,
    integrationAuthority: BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
    runtimeMode: BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.status,
    reviewStatus: "FROZEN_EN_HI_PA_BANK_ONLY_AFTER_MANUAL_APPROVAL" as const,
    manualApprovalRequired: true as const,
    questionBankAdmissionApproved: true as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    questionBankAcceptanceAuthority: BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    contentMutationAuthorized: false as const,
  };

  return Object.freeze({
    ...source,
    integrationAuthority: BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
    sourceStudioVersion: BTD_CP010_QUESTION_STUDIO_VERSION,
    readinessAuthority: BTD_CP011_QUESTION_BANK_READINESS_VERSION,
    generationContext: Object.freeze({
      ...(source.generationContext ?? {}),
      ...lifecycle,
    }),
    questions,
    questionPackages: questions,
  });
}

export function isBtdCp012QuestionStudioRequest(
  request: BtdCp010QuestionStudioRequest = {},
) {
  return isBtdCp010QuestionStudioRequest(request);
}

export function listBtdCp012QuestionStudioPackages() {
  return Object.freeze([BTD_CP012_QUESTION_STUDIO_PACKAGE]);
}

export type BtdCp012Language = BtdCp010Language;
export type BtdCp012QuestionStudioRequest = BtdCp010QuestionStudioRequest;
