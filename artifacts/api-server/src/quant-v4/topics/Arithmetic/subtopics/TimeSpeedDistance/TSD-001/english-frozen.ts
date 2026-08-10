import {
  generateCanonicalReviewRecords,
  type TsdCanonicalReviewRecord,
} from "./canonical-review-schema";

export const TSD_001_ENGLISH_FREEZE_AUTHORITY = "TSD_001_ENGLISH_FROZEN" as const;
export const TSD_001_ENGLISH_FREEZE_APPROVED_AT = "2026-08-10" as const;
export const TSD_001_ENGLISH_FREEZE_APPROVED_BY = "PRODUCT_OWNER" as const;

export interface TsdEnglishFrozenLifecycle {
  readonly reviewStatus: "EDITORIAL_APPROVED";
  readonly englishDecision: "APPROVED";
  readonly englishFreezeStatus: "FROZEN";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export interface TsdEnglishFreezeProof {
  readonly authority: typeof TSD_001_ENGLISH_FREEZE_AUTHORITY;
  readonly approvedBy: typeof TSD_001_ENGLISH_FREEZE_APPROVED_BY;
  readonly approvedAt: typeof TSD_001_ENGLISH_FREEZE_APPROVED_AT;
  readonly sourceAuthority: "TSD_001_ENGLISH_FREEZE_CANDIDATE";
  readonly learnerCorpusChanged: false;
  readonly localisationUnlocked: true;
  readonly questionStudioUnlocked: false;
  readonly questionBankUnlocked: false;
  readonly testDeliveryUnlocked: false;
  readonly publicDeliveryUnlocked: false;
}

export type TsdEnglishFrozenRecord = Omit<TsdCanonicalReviewRecord, "lifecycle"> & {
  readonly lifecycle: TsdEnglishFrozenLifecycle;
  readonly englishFreezeProof: TsdEnglishFreezeProof;
};

const FROZEN_LIFECYCLE: TsdEnglishFrozenLifecycle = Object.freeze({
  reviewStatus: "EDITORIAL_APPROVED",
  englishDecision: "APPROVED",
  englishFreezeStatus: "FROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});

const FREEZE_PROOF: TsdEnglishFreezeProof = Object.freeze({
  authority: TSD_001_ENGLISH_FREEZE_AUTHORITY,
  approvedBy: TSD_001_ENGLISH_FREEZE_APPROVED_BY,
  approvedAt: TSD_001_ENGLISH_FREEZE_APPROVED_AT,
  sourceAuthority: "TSD_001_ENGLISH_FREEZE_CANDIDATE",
  learnerCorpusChanged: false,
  localisationUnlocked: true,
  questionStudioUnlocked: false,
  questionBankUnlocked: false,
  testDeliveryUnlocked: false,
  publicDeliveryUnlocked: false,
});

function freezeRecord(record: TsdCanonicalReviewRecord): TsdEnglishFrozenRecord {
  return Object.freeze({
    ...record,
    lifecycle: FROZEN_LIFECYCLE,
    englishFreezeProof: FREEZE_PROOF,
  });
}

function learnerProjection(record: TsdCanonicalReviewRecord | TsdEnglishFrozenRecord): unknown {
  const { lifecycle: _lifecycle, ...rest } = record;
  const candidate = { ...rest } as Record<string, unknown>;
  delete candidate.englishFreezeProof;
  return candidate;
}

export function generateTsdEnglishFrozenRecords(): readonly TsdEnglishFrozenRecord[] {
  return Object.freeze(generateCanonicalReviewRecords().map(freezeRecord));
}

export function frozenLearnerCorpusIsUnchanged(): boolean {
  const source = generateCanonicalReviewRecords();
  const frozen = generateTsdEnglishFrozenRecords();
  return JSON.stringify(source.map(learnerProjection)) === JSON.stringify(frozen.map(learnerProjection));
}
