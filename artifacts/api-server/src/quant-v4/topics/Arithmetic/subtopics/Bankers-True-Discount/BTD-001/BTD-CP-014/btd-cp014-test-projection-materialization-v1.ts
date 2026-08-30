import { createHash } from "node:crypto";

import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY,
  BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
  buildBtdCp013ScoredTestProjectionReadinessV1,
} from "../BTD-CP-013/btd-cp013-scored-test-projection-readiness-v1";

export const BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION =
  "BTD-001-CP014-TEST-PROJECTION-MATERIALIZATION-v1" as const;

export const BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY = Object.freeze({
  status: "TEST_PROJECTION_MATERIALIZATION_AUTHORIZED" as const,
  readinessAuthority: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
  sourceQuestionBankImmutable: true as const,
  multilingualProjectionModel: "EN_BASE_WITH_APPROVED_HI_PA_TRANSLATIONS" as const,
  testProjectionMaterializationApproved: true as const,
  materializedQuestionStatus: "approved" as const,
  materializedQuestionPublished: false as const,
  testEligibilityApprovalGranted: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  contentMutationAuthorized: true as const,
});

export const BTD_CP014_PROJECTION_LANGUAGES = ["en", "hi", "pa"] as const;
export type BtdCp014ProjectionLanguage = typeof BTD_CP014_PROJECTION_LANGUAGES[number];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function canonicalUuid(value: string, label: string): string {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!UUID_RE.test(normalized)) {
    throw new Error(`BTD-001 CP014 requires a canonical ${label} UUID.`);
  }
  return normalized;
}

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

function canonicalTaxonomyNodeIds(primaryTaxonomyNodeId: string, taxonomyNodeIds: readonly string[]) {
  const primary = canonicalUuid(primaryTaxonomyNodeId, "primary-taxonomy-node");
  const normalized = [...new Set([primary, ...taxonomyNodeIds.map((id) => canonicalUuid(id, "taxonomy-node"))])].sort();
  return Object.freeze(normalized);
}

function assertCp013Authority() {
  const source = BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY;
  if (source.testProjectionMaterializationApproved) {
    throw new Error("BTD-001 CP013 unexpectedly authorized materialization itself.");
  }
  if (source.testEligible || source.mockTestEligible || source.publiclyPublishable) {
    throw new Error("BTD-001 CP013 source unexpectedly crossed its delivery boundary.");
  }
}

export type BtdCp014TestProjectionRequest = Readonly<{
  qlId: BtdPermanentQlId;
  seed: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  taxonomyNodeIds?: readonly string[];
}>;

export function buildBtdCp014TestProjectionMaterializationPlanV1(
  request: BtdCp014TestProjectionRequest,
) {
  assertCp013Authority();
  const examVersionId = canonicalUuid(request.examVersionId, "exam-version");
  const primaryTaxonomyNodeId = canonicalUuid(request.primaryTaxonomyNodeId, "primary-taxonomy-node");
  const taxonomyNodeIds = canonicalTaxonomyNodeIds(
    primaryTaxonomyNodeId,
    request.taxonomyNodeIds ?? [primaryTaxonomyNodeId],
  );
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("BTD-001 CP014 requires the reviewed source seed.");

  const sources = Object.fromEntries(
    BTD_CP014_PROJECTION_LANGUAGES.map((language) => {
      const readiness = buildBtdCp013ScoredTestProjectionReadinessV1(
        request.qlId,
        seed,
        language,
        examVersionId,
        primaryTaxonomyNodeId,
      );
      return [language, readiness];
    }),
  ) as Record<BtdCp014ProjectionLanguage, ReturnType<typeof buildBtdCp013ScoredTestProjectionReadinessV1>>;

  const sourceAdmissionKeys = Object.freeze({
    en: sources.en.sourceQuestionBankAdmissionKey,
    hi: sources.hi.sourceQuestionBankAdmissionKey,
    pa: sources.pa.sourceQuestionBankAdmissionKey,
  });
  const sourcePayloadFingerprints = Object.freeze({
    en: sources.en.sourceBankPayloadFingerprint,
    hi: sources.hi.sourceBankPayloadFingerprint,
    pa: sources.pa.sourceBankPayloadFingerprint,
  });
  const sourceProjectionKeys = Object.freeze({
    en: sources.en.projectionKey,
    hi: sources.hi.projectionKey,
    pa: sources.pa.projectionKey,
  });

  const projectionBundleKey = `BTD-TEST-BUNDLE-${sha256({
    qlId: request.qlId,
    sourceAdmissionKeys,
    sourceProjectionKeys,
    examVersionId,
    primaryTaxonomyNodeId,
    taxonomyNodeIds,
  }).slice(0, 40)}`;

  const projectionDocument = {
    schemaVersion: "BTD-MULTILINGUAL-TEST-PROJECTION-v1" as const,
    packageId: "BTD-001" as const,
    chapterId: "BTD-001" as const,
    qlId: request.qlId,
    sourceSeed: seed,
    projectionBundleKey,
    examVersionId,
    primaryTaxonomyNodeId,
    taxonomyNodeIds,
    baseLanguage: "en" as const,
    translationLanguages: Object.freeze(["hi", "pa"] as const),
    sourceAdmissionKeys,
    sourcePayloadFingerprints,
    sourceProjectionKeys,
    sourceLearnerPayloads: Object.freeze({
      en: sources.en.sourceBankPayload,
      hi: sources.hi.sourceBankPayload,
      pa: sources.pa.sourceBankPayload,
    }),
    materializedQuestionStatus: "approved" as const,
    publishDuringMaterialization: false as const,
  };

  return deepFreeze({
    checkpointId: "BTD-CP-014" as const,
    materializationVersion: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
    readinessAuthority: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
    projectionBundleKey,
    qlId: request.qlId,
    seed,
    examVersionId,
    primaryTaxonomyNodeId,
    taxonomyNodeIds,
    sources,
    projectionDocument,
    lifecycle: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  });
}
