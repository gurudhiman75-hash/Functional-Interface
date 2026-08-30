import { createHash } from "node:crypto";

import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY,
  BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
  buildBtdCp012QuestionBankAdmissionPreviewV1,
  type BtdCp012Language,
} from "../BTD-CP-012/btd-cp012-question-bank-admission-v1";

export const BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION =
  "BTD-001-CP013-SCORED-TEST-PROJECTION-READINESS-v1" as const;

export const BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY = Object.freeze({
  status: "READY_FOR_EXPLICIT_TEST_PROJECTION_MATERIALIZATION_APPROVAL" as const,
  sourceQuestionBankAuthority: BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
  sourceQuestionBankAcceptanceAuthority: BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  sourceQuestionBankAdmissionRequired: true as const,
  sourceQuestionBankAcceptanceMode: "BANK_ONLY" as const,
  examScopedProjectionRequired: true as const,
  canonicalExamVersionRequired: true as const,
  canonicalTaxonomyBindingRequired: true as const,
  platformTestPublicLifecycleDecoupled: true as const,
  blueprintTestEligibilityFilterRequired: true as const,
  testProjectionMaterializationApproved: false as const,
  testEligibilityApprovalGranted: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  contentMutationAuthorized: false as const,
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type JsonRecord = Record<string, unknown>;

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : canonicalJson(value))
    .digest("hex");
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

function canonicalUuid(value: string, label: string): string {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!UUID_RE.test(normalized)) {
    throw new Error(`BTD-001 CP013 requires a canonical ${label} UUID.`);
  }
  return normalized;
}

function assertCp012SourceBoundary() {
  const source = BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY;
  if (!source.questionBankAdmissionApproved || !source.questionBankWritable) {
    throw new Error("BTD-001 CP013 requires CP012 Question Bank admission authority.");
  }
  if (source.questionBankAcceptanceMode !== "BANK_ONLY") {
    throw new Error("BTD-001 CP013 requires the CP012 BANK_ONLY source boundary.");
  }
  if (source.testEligible || source.mockTestEligible || source.publiclyPublishable) {
    throw new Error("BTD-001 CP012 source unexpectedly crossed its delivery boundary.");
  }
}

export function btdCp013SourceBankPayload(source: Readonly<Record<string, any>>) {
  return Object.freeze({
    packageId: source.packageId,
    qlId: source.qlId,
    cpId: source.cpId,
    language: source.language,
    locale: source.locale,
    difficulty: source.difficulty,
    stem: source.stem,
    options: source.options,
    correctIndex: source.correctIndex,
    answer: source.answer,
    packageExplanation: source.packageExplanation,
    semanticSignature: source.semanticSignature,
    answerSemantic: source.answerSemantic,
    frozenContentFingerprint: source.frozenContentFingerprint,
    frozenChapterFingerprint: source.frozenChapterFingerprint,
    freezeVersion: source.freezeVersion,
    questionBankAdmissionKey: source.questionBankAdmissionKey,
    questionBankAdmissionPayloadFingerprint: source.questionBankAdmissionPayloadFingerprint,
  });
}

export function buildBtdCp013ScoredTestProjectionReadinessV1(
  qlId: BtdPermanentQlId,
  seed: string,
  language: BtdCp012Language,
  examVersionId: string,
  taxonomyNodeId: string,
) {
  assertCp012SourceBoundary();
  const canonicalExamVersionId = canonicalUuid(examVersionId, "exam-version");
  const canonicalTaxonomyNodeId = canonicalUuid(taxonomyNodeId, "taxonomy-node");
  const source = buildBtdCp012QuestionBankAdmissionPreviewV1(qlId, seed, language) as Readonly<Record<string, any>>;
  const sourceBankPayload = btdCp013SourceBankPayload(source);
  const sourceBankPayloadFingerprint = sha256(sourceBankPayload);
  const sourceAdmissionKey = String(source.questionBankAdmissionKey ?? "");
  if (!sourceAdmissionKey.startsWith("BTD-QB-")) {
    throw new Error(`${qlId}:${language}: missing certified CP012 Question Bank admission key.`);
  }

  const projectionKey = `BTD-TEST-${sha256({
    sourceAdmissionKey,
    examVersionId: canonicalExamVersionId,
    taxonomyNodeId: canonicalTaxonomyNodeId,
  }).slice(0, 40)}`;

  const projectionContract: JsonRecord = {
    schemaVersion: "BTD-SCORED-TEST-PROJECTION-READINESS-v1",
    packageId: "BTD-001",
    chapterId: "BTD-001",
    sourceQuestionBankAdmissionKey: sourceAdmissionKey,
    sourceQuestionBankPayloadFingerprint: sourceBankPayloadFingerprint,
    examVersionId: canonicalExamVersionId,
    primaryTaxonomyNodeId: canonicalTaxonomyNodeId,
    taxonomyNodeIds: [canonicalTaxonomyNodeId],
    language: source.language,
    qlId: source.qlId,
    cpId: source.cpId,
    difficulty: source.difficulty,
    projectedQuestionStatus: "published",
    projectedQuestionVersionExamScoped: true,
    blueprintConsumableWhenTestEligibilityGranted: true,
    sourceContentMutationAllowed: false,
  };

  return deepFreeze({
    checkpointId: "BTD-CP-013" as const,
    readinessVersion: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
    sourceQuestionBankVersion: BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
    sourceQuestionBankAcceptanceAuthority: BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    qlId: source.qlId,
    language: source.language,
    sourceQuestionBankAdmissionKey: sourceAdmissionKey,
    sourceQuestionBankAdmissionPayloadFingerprint:
      source.questionBankAdmissionPayloadFingerprint,
    sourceBankPayload,
    sourceBankPayloadFingerprint,
    examVersionId: canonicalExamVersionId,
    primaryTaxonomyNodeId: canonicalTaxonomyNodeId,
    taxonomyNodeIds: Object.freeze([canonicalTaxonomyNodeId]),
    projectionKey,
    projectionContract: Object.freeze(projectionContract),
    lifecycle: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY,
  });
}
