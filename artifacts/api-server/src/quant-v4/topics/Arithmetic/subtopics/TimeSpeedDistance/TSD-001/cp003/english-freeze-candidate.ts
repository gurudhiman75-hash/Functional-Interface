import { finalAuthorityByKey } from "../final-authority-registry";
import { generateTsdEnglishFrozenRecords } from "../english-frozen";
import {
  cp003PermanentQlForAuthority,
  type TsdCp003PermanentQlAllocation,
} from "./ql-allocation";
import {
  generateCp003PostOverlapReviewRows,
  type TsdCp003PostOverlapReviewRow,
} from "./post-overlap-review";
import { stableCp003Stringify } from "./runtime";

export const TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY = "TSD_CP003_ENGLISH_FREEZE_CANDIDATE" as const;
export const TSD_CP003_ENGLISH_FREEZE_CANDIDATE_PREPARED_AT = "2026-08-11" as const;

export type TsdCp003AuthorityQlKind = "NEW_CP003_PERMANENT_QL" | "EXISTING_PRIOR_AUTHORITY_QL";

export interface TsdCp003EnglishFreezeCandidateMetadata {
  readonly authority: typeof TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY;
  readonly preparedAt: typeof TSD_CP003_ENGLISH_FREEZE_CANDIDATE_PREPARED_AT;
  readonly candidateStatus: "READY_FOR_PRODUCT_OWNER_FREEZE_APPROVAL";
  readonly learnerCorpusChanged: false;
  readonly sourceEnglishFreezeStatus: "UNFROZEN";
  readonly localisationUnlocked: false;
  readonly questionStudioUnlocked: false;
  readonly questionBankUnlocked: false;
  readonly testDeliveryUnlocked: false;
  readonly publicDeliveryUnlocked: false;
}

export type TsdCp003EnglishFreezeCandidateRecord = TsdCp003PostOverlapReviewRow & {
  readonly authorityPermanentQlId: `TSD-QL-${string}`;
  readonly authorityQlKind: TsdCp003AuthorityQlKind;
  readonly freezeCandidate: TsdCp003EnglishFreezeCandidateMetadata;
};

const FREEZE_CANDIDATE_METADATA: TsdCp003EnglishFreezeCandidateMetadata = Object.freeze({
  authority: TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY,
  preparedAt: TSD_CP003_ENGLISH_FREEZE_CANDIDATE_PREPARED_AT,
  candidateStatus: "READY_FOR_PRODUCT_OWNER_FREEZE_APPROVAL",
  learnerCorpusChanged: false,
  sourceEnglishFreezeStatus: "UNFROZEN",
  localisationUnlocked: false,
  questionStudioUnlocked: false,
  questionBankUnlocked: false,
  testDeliveryUnlocked: false,
  publicDeliveryUnlocked: false,
});

function priorAuthorityPermanentQl(authorityKey: string): `TSD-QL-${string}` {
  const authority = finalAuthorityByKey(authorityKey);
  const aliases = [...new Set(authority.legacyReviewQlAliases)];
  if (aliases.length !== 1) {
    throw new Error(`${authorityKey}: CP-003 representation extension requires exactly one existing authority QL, received ${aliases.join(", ") || "none"}`);
  }
  return aliases[0];
}

function qlForRow(row: TsdCp003PostOverlapReviewRow): {
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly kind: TsdCp003AuthorityQlKind;
  readonly allocation: TsdCp003PermanentQlAllocation | null;
} {
  if (row.authorityOwnerCheckpointId === "TSD-CP-003") {
    const allocation = cp003PermanentQlForAuthority(row.authorityKey);
    return Object.freeze({
      permanentQlId: allocation.permanentQlId,
      kind: "NEW_CP003_PERMANENT_QL" as const,
      allocation,
    });
  }

  return Object.freeze({
    permanentQlId: priorAuthorityPermanentQl(row.authorityKey),
    kind: "EXISTING_PRIOR_AUTHORITY_QL" as const,
    allocation: null,
  });
}

function wrapFreezeCandidate(row: TsdCp003PostOverlapReviewRow): TsdCp003EnglishFreezeCandidateRecord {
  const ql = qlForRow(row);
  return Object.freeze({
    ...row,
    authorityPermanentQlId: ql.permanentQlId,
    authorityQlKind: ql.kind,
    freezeCandidate: FREEZE_CANDIDATE_METADATA,
  });
}

function candidateLearnerProjection(row: TsdCp003EnglishFreezeCandidateRecord): TsdCp003PostOverlapReviewRow {
  const {
    authorityPermanentQlId: _authorityPermanentQlId,
    authorityQlKind: _authorityQlKind,
    freezeCandidate: _freezeCandidate,
    ...source
  } = row;
  return source;
}

export function generateCp003EnglishFreezeCandidateRecords(): readonly TsdCp003EnglishFreezeCandidateRecord[] {
  return Object.freeze(generateCp003PostOverlapReviewRows(3).map(wrapFreezeCandidate));
}

export function cp003FreezeCandidateLearnerCorpusIsUnchanged(): boolean {
  const source = generateCp003PostOverlapReviewRows(3);
  const candidate = generateCp003EnglishFreezeCandidateRecords();
  return stableCp003Stringify(source) === stableCp003Stringify(candidate.map(candidateLearnerProjection));
}

export function priorFrozenEnglishCorpusRemainsIntact(): boolean {
  const prior = generateTsdEnglishFrozenRecords();
  return prior.length === 153
    && prior.filter((row) => row.checkpointId === "TSD-CP-001").length === 80
    && prior.filter((row) => row.checkpointId === "TSD-CP-002").length === 73
    && prior.every((row) => row.lifecycle.englishFreezeStatus === "FROZEN");
}
