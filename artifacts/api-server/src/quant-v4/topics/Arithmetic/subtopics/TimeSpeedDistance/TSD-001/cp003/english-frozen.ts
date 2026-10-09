import {
  TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY,
  generateCp003EnglishFreezeCandidateRecords,
  priorFrozenEnglishCorpusRemainsIntact,
  type TsdCp003EnglishFreezeCandidateRecord,
} from "./english-freeze-candidate";
import { stableCp003Stringify } from "./runtime";

export const TSD_CP003_ENGLISH_FREEZE_AUTHORITY = "TSD_CP003_ENGLISH_FROZEN" as const;
export const TSD_CP003_ENGLISH_FREEZE_APPROVED_AT = "2026-08-11" as const;
export const TSD_CP003_ENGLISH_FREEZE_APPROVED_BY = "PRODUCT_OWNER" as const;

export interface TsdCp003FrozenLifecycle {
  readonly reviewStatus: "EDITORIAL_APPROVED";
  readonly englishDecision: "APPROVED";
  readonly englishFreezeStatus: "FROZEN";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export interface TsdCp003EnglishFreezeProof {
  readonly authority: typeof TSD_CP003_ENGLISH_FREEZE_AUTHORITY;
  readonly approvedBy: typeof TSD_CP003_ENGLISH_FREEZE_APPROVED_BY;
  readonly approvedAt: typeof TSD_CP003_ENGLISH_FREEZE_APPROVED_AT;
  readonly sourceAuthority: typeof TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY;
  readonly learnerCorpusChanged: false;
  readonly priorFrozenCorpusChanged: false;
  readonly localisationUnlocked: true;
  readonly questionStudioUnlocked: false;
  readonly questionBankUnlocked: false;
  readonly testDeliveryUnlocked: false;
  readonly publicDeliveryUnlocked: false;
}

export type TsdCp003EnglishFrozenRecord = Omit<
  TsdCp003EnglishFreezeCandidateRecord,
  "permanentQlId" | "lifecycle" | "freezeCandidate"
> & {
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly lifecycle: TsdCp003FrozenLifecycle;
  readonly englishFreezeProof: TsdCp003EnglishFreezeProof;
};

const FROZEN_LIFECYCLE: TsdCp003FrozenLifecycle = Object.freeze({
  reviewStatus: "EDITORIAL_APPROVED",
  englishDecision: "APPROVED",
  englishFreezeStatus: "FROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});

const FREEZE_PROOF: TsdCp003EnglishFreezeProof = Object.freeze({
  authority: TSD_CP003_ENGLISH_FREEZE_AUTHORITY,
  approvedBy: TSD_CP003_ENGLISH_FREEZE_APPROVED_BY,
  approvedAt: TSD_CP003_ENGLISH_FREEZE_APPROVED_AT,
  sourceAuthority: TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY,
  learnerCorpusChanged: false,
  priorFrozenCorpusChanged: false,
  localisationUnlocked: true,
  questionStudioUnlocked: false,
  questionBankUnlocked: false,
  testDeliveryUnlocked: false,
  publicDeliveryUnlocked: false,
});

function freezeRecord(row: TsdCp003EnglishFreezeCandidateRecord): TsdCp003EnglishFrozenRecord {
  const {
    permanentQlId: _sourcePermanentQlId,
    lifecycle: _sourceLifecycle,
    freezeCandidate: _freezeCandidate,
    ...learnerAndOwnership
  } = row;

  return Object.freeze({
    ...learnerAndOwnership,
    permanentQlId: row.authorityPermanentQlId,
    lifecycle: FROZEN_LIFECYCLE,
    englishFreezeProof: FREEZE_PROOF,
  });
}

function candidateLearnerProjection(row: TsdCp003EnglishFreezeCandidateRecord): unknown {
  const {
    permanentQlId: _sourcePermanentQlId,
    lifecycle: _sourceLifecycle,
    freezeCandidate: _freezeCandidate,
    ...projection
  } = row;
  return projection;
}

function frozenLearnerProjection(row: TsdCp003EnglishFrozenRecord): unknown {
  const {
    permanentQlId: _permanentQlId,
    lifecycle: _lifecycle,
    englishFreezeProof: _englishFreezeProof,
    ...projection
  } = row;
  return projection;
}

export function generateCp003EnglishFrozenRecords(): readonly TsdCp003EnglishFrozenRecord[] {
  if (!priorFrozenEnglishCorpusRemainsIntact()) {
    throw new Error("Previously frozen CP-001/002 English corpus changed before CP-003 freeze");
  }
  return Object.freeze(generateCp003EnglishFreezeCandidateRecords().map(freezeRecord));
}

export function cp003FrozenLearnerCorpusIsUnchanged(): boolean {
  const candidate = generateCp003EnglishFreezeCandidateRecords();
  const frozen = generateCp003EnglishFrozenRecords();
  return stableCp003Stringify(candidate.map(candidateLearnerProjection))
    === stableCp003Stringify(frozen.map(frozenLearnerProjection));
}
