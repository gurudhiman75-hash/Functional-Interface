import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_FINAL_AUTHORITY_AUDIT_VERSION,
  blrCp003QlIdForAuthority,
  normalizeBlrCp003Authority,
  type BlrCp003PermanentAuthority,
  type BlrCp003PermanentQlId,
  type BlrCp003SourceAuthority,
} from "./cp003-final-authority-audit";
import { generateBlrCp003V8EditorialBaselineApprovedRecords } from "./cp003-v8-editorial-baseline-approved";
import { generateBlrCp003V9Wave01StructuralStagingApprovedRecords } from "./cp003-v9-wave01-structural-staging-approved";
import { generateBlrCp003V9Wave02StructuralStagingApprovedRecords } from "./cp003-v9-wave02-structural-staging-approved";

export const BLR_CP003_FINAL_APPROVED_BANK_VERSION =
  "BLR_CP003_FINAL_APPROVED_BANK_V1" as const;
export const BLR_CP003_FINAL_APPROVAL_DATE = "2026-08-01" as const;
export const BLR_CP003_FINAL_APPROVAL_SCOPE =
  "ENGLISH_DISCOVERY_FREEZE" as const;

export type BlrCp003FinalSourceBank =
  | "V8_EDITORIAL_BASELINE"
  | "V9_WAVE01_STRUCTURAL_STAGING"
  | "V9_WAVE02_STRUCTURAL_STAGING";

export type BlrCp003FinalDifficultyTier =
  | "FOUNDATIONAL_MULTI_STEP"
  | "STANDARD_EXAM"
  | "ADVANCED_EXCLUSION";

type V8Record = ReturnType<
  typeof generateBlrCp003V8EditorialBaselineApprovedRecords
>[number];
type Wave01Record = ReturnType<
  typeof generateBlrCp003V9Wave01StructuralStagingApprovedRecords
>[number];
type Wave02Record = ReturnType<
  typeof generateBlrCp003V9Wave02StructuralStagingApprovedRecords
>[number];
type SourceRecord = V8Record | Wave01Record | Wave02Record;

export interface BlrCp003FinalApprovedRecord {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  qlId: BlrCp003PermanentQlId;
  permanentQlId: BlrCp003PermanentQlId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  finalAuthority: BlrCp003PermanentAuthority;
  originalAuthority: BlrCp003SourceAuthority;
  sourceBank: BlrCp003FinalSourceBank;
  sourcePrototypeId: string;
  scenarioId: string;
  topologyId: string;
  seed: number;
  sourceItemId: string;
  itemId: string;
  sharedPrompt: string;
  stem: string;
  answerType: SourceRecord["answerType"];
  answerSemanticKey: string;
  options: SourceRecord["options"];
  correctIndex: number;
  evidencePaths: SourceRecord["evidencePaths"];
  proceduralLogic: SourceRecord["proceduralLogic"];
  editorial: SourceRecord["editorial"];
  metadata: {
    runtimeVersion: "blr-cp003-final-approved-bank-v1";
    finalApprovedBankVersion: typeof BLR_CP003_FINAL_APPROVED_BANK_VERSION;
    finalAuthorityAuditVersion: typeof BLR_CP003_FINAL_AUTHORITY_AUDIT_VERSION;
    finalApprovalDate: typeof BLR_CP003_FINAL_APPROVAL_DATE;
    finalApprovalScope: typeof BLR_CP003_FINAL_APPROVAL_SCOPE;
    approvedBy: "PROJECT_OWNER";
    approvalDirective: "FINISH_CP";
    sourceApprovalPreserved: true;
    humanReviewApproved: true;
    structuralSaturationApproved: true;
    finalDiscoveryFreezeApproved: true;
    productionStagingApproved: false;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
    nativeSvgFamilyTree: true;
    asciiFallbackRetained: true;
    difficultyTier: BlrCp003FinalDifficultyTier;
    sourceSemanticFingerprint: string;
    semanticFingerprint: string;
  };
}

function positiveModulo(value: number, modulus: number): number {
  return ((Math.trunc(value) % modulus) + modulus) % modulus;
}

function difficultyTier(record: SourceRecord): BlrCp003FinalDifficultyTier {
  const longestPath = Math.max(
    0,
    ...record.evidencePaths.map((path) => path.personIds.length),
  );
  const pathCount = record.evidencePaths.length;
  const nodeCount = record.proceduralLogic.nodes.length;
  const negativeWeight =
    "negativeClueCount" in record.metadata
      ? Number(record.metadata.negativeClueCount)
      : 0;
  const score = longestPath + pathCount + Math.floor(nodeCount / 4) + negativeWeight;
  if (score >= 12) return "ADVANCED_EXCLUSION";
  if (score >= 8) return "STANDARD_EXAM";
  return "FOUNDATIONAL_MULTI_STEP";
}

function approveFinalRecord(
  sourceBank: BlrCp003FinalSourceBank,
  record: SourceRecord,
): BlrCp003FinalApprovedRecord {
  const originalAuthority = record.provisionalAuthority as BlrCp003SourceAuthority;
  const finalAuthority = normalizeBlrCp003Authority(originalAuthority);
  const qlId = blrCp003QlIdForAuthority(originalAuthority);
  const sourceSemanticFingerprint = record.metadata.semanticFingerprint;
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    qlId,
    permanentQlId: qlId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    finalAuthority,
    originalAuthority,
    sourceBank,
    sourcePrototypeId: record.prototypeId,
    scenarioId: record.scenarioId,
    topologyId: record.topologyId,
    seed: record.seed,
    sourceItemId: record.itemId,
    itemId: record.itemId,
    sharedPrompt: record.sharedPrompt,
    stem: record.stem,
    answerType: record.answerType,
    answerSemanticKey: record.answerSemanticKey,
    options: record.options,
    correctIndex: record.correctIndex,
    evidencePaths: record.evidencePaths,
    proceduralLogic: record.proceduralLogic,
    editorial: record.editorial,
    metadata: {
      runtimeVersion: "blr-cp003-final-approved-bank-v1",
      finalApprovedBankVersion: BLR_CP003_FINAL_APPROVED_BANK_VERSION,
      finalAuthorityAuditVersion: BLR_CP003_FINAL_AUTHORITY_AUDIT_VERSION,
      finalApprovalDate: BLR_CP003_FINAL_APPROVAL_DATE,
      finalApprovalScope: BLR_CP003_FINAL_APPROVAL_SCOPE,
      approvedBy: "PROJECT_OWNER",
      approvalDirective: "FINISH_CP",
      sourceApprovalPreserved: true,
      humanReviewApproved: true,
      structuralSaturationApproved: true,
      finalDiscoveryFreezeApproved: true,
      productionStagingApproved: false,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      nativeSvgFamilyTree: true,
      asciiFallbackRetained: true,
      difficultyTier: difficultyTier(record),
      sourceSemanticFingerprint,
      semanticFingerprint: stableHash([
        sourceSemanticFingerprint,
        BLR_CP003_FINAL_APPROVED_BANK_VERSION,
        BLR_CP003_FINAL_AUTHORITY_AUDIT_VERSION,
        sourceBank,
        finalAuthority,
        qlId,
        BLR_CP003_FINAL_APPROVAL_DATE,
        "FINISH_CP",
      ]),
    },
  };
}

export function generateBlrCp003FinalApprovedBank(): readonly BlrCp003FinalApprovedRecord[] {
  const records = [
    ...generateBlrCp003V8EditorialBaselineApprovedRecords().map((record) =>
      approveFinalRecord("V8_EDITORIAL_BASELINE", record),
    ),
    ...generateBlrCp003V9Wave01StructuralStagingApprovedRecords().map(
      (record) => approveFinalRecord("V9_WAVE01_STRUCTURAL_STAGING", record),
    ),
    ...generateBlrCp003V9Wave02StructuralStagingApprovedRecords().map(
      (record) => approveFinalRecord("V9_WAVE02_STRUCTURAL_STAGING", record),
    ),
  ];

  const itemIds = new Set<string>();
  const fingerprints = new Set<string>();
  for (const record of records) {
    if (itemIds.has(record.itemId)) {
      throw new Error(`Duplicate final CP-003 item id ${record.itemId}.`);
    }
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(
        `Duplicate final CP-003 semantic fingerprint ${record.metadata.semanticFingerprint}.`,
      );
    }
    itemIds.add(record.itemId);
    fingerprints.add(record.metadata.semanticFingerprint);
    if (
      record.prototypeOnly ||
      !record.reviewOnly ||
      record.publiclyPublishable ||
      record.questionStudioVisible ||
      record.questionBankEligible ||
      record.mockTestEligible ||
      !record.metadata.humanReviewApproved ||
      !record.metadata.structuralSaturationApproved ||
      !record.metadata.finalDiscoveryFreezeApproved ||
      record.metadata.productionStagingApproved
    ) {
      throw new Error(`Final CP-003 release boundary failed for ${record.itemId}.`);
    }
  }
  return records;
}

export function blrCp003FinalGroupKey(
  record: Pick<
    BlrCp003FinalApprovedRecord,
    "sourceBank" | "scenarioId" | "seed"
  >,
): string {
  return `${record.sourceBank}::${record.scenarioId}::${record.seed}`;
}

function normalizeLearnerText(value: string): string {
  return value.toLocaleLowerCase("en-IN").replace(/\s+/g, " ").trim();
}

export function buildBlrCp003FinalBankTelemetry(
  records: readonly BlrCp003FinalApprovedRecord[] =
    generateBlrCp003FinalApprovedBank(),
) {
  const countBy = (values: readonly string[]) => {
    const counts: Record<string, number> = {};
    for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  };
  const normalizedStems = records.map((record) =>
    normalizeLearnerText(record.stem),
  );
  const normalizedQuestionSignatures = records.map((record) =>
    normalizeLearnerText(`${record.sharedPrompt}\n${record.stem}`),
  );
  const uniqueStemCount = new Set(normalizedStems).size;
  const uniqueQuestionSignatureCount = new Set(
    normalizedQuestionSignatures,
  ).size;
  const groups = new Set(records.map(blrCp003FinalGroupKey));
  const difficultyCounts = countBy(
    records.map((record) => record.metadata.difficultyTier),
  );
  return {
    recordCount: records.length,
    groupCount: groups.size,
    topologyCount: new Set(records.map((record) => record.topologyId)).size,
    prototypeCount: new Set(records.map((record) => record.sourcePrototypeId)).size,
    authorityCount: new Set(records.map((record) => record.finalAuthority)).size,
    permanentQlCount: new Set(records.map((record) => record.permanentQlId)).size,
    answerPositions: [0, 1, 2, 3].map(
      (position) => records.filter((record) => record.correctIndex === position).length,
    ),
    sourceBankCounts: countBy(records.map((record) => record.sourceBank)),
    authorityCounts: countBy(records.map((record) => record.finalAuthority)),
    difficultyCounts,
    uniqueStemCount,
    stemUniquenessRatio: uniqueStemCount / records.length,
    uniqueQuestionSignatureCount,
    questionSignatureUniquenessRatio:
      uniqueQuestionSignatureCount / records.length,
    unresolvedStatusRecordCount: records.filter(
      (record) =>
        record.originalAuthority ===
        "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
    ).length,
    deterministicProbeItemId:
      records[positiveModulo(137, records.length)]?.itemId ?? null,
  } as const;
}
