import { generateBlrCp003CompetitiveSvgReviewBundle } from "./cp003-competitive-svg-review";
import {
  BLR_CP003_MERGE_SPLIT_MATRIX_V1,
  cp003ProvisionalAuthorities,
  type BlrCp003ProvisionalNewAuthority,
} from "./cp003-merge-split-audit";

export const BLR_CP003_FINAL_FREEZE_READINESS_VERSION =
  "BLR_CP003_FINAL_FREEZE_READINESS_V1" as const;

export const BLR_CP003_MIN_ACTIVE_RECORDS_PER_AUTHORITY = 4 as const;

export interface BlrCp003AuthorityReadiness {
  authority: BlrCp003ProvisionalNewAuthority;
  sourcePrototypeIds: readonly string[];
  activeRecordCount: number;
  rejectedRecordCount: number;
  activeRecordsByPrototype: Readonly<Record<string, number>>;
  rejectedRecordsByPrototype: Readonly<Record<string, number>>;
  rejectionReasons: readonly string[];
  sourcePrototypeIdsWithoutActiveRecords: readonly string[];
  learnerEvidenceReady: boolean;
}

function increment(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function sourcePrototypeIdsFor(
  authority: BlrCp003ProvisionalNewAuthority,
): string[] {
  return BLR_CP003_MERGE_SPLIT_MATRIX_V1.flatMap((entry) =>
    entry.decision === "PROVISIONAL_NEW" &&
    entry.provisionalAuthority === authority
      ? [entry.prototypeId]
      : [],
  );
}

function countsFor(
  prototypeIds: readonly string[],
  counts: ReadonlyMap<string, number>,
): Readonly<Record<string, number>> {
  return Object.fromEntries(
    prototypeIds.map((prototypeId) => [prototypeId, counts.get(prototypeId) ?? 0]),
  );
}

export function buildBlrCp003FinalFreezeReadiness() {
  const bundle = generateBlrCp003CompetitiveSvgReviewBundle();
  const activeCounts = new Map<string, number>();
  const rejectedCounts = new Map<string, number>();
  const rejectionReasons = new Map<string, Set<string>>();

  for (const record of bundle.selected) increment(activeCounts, record.prototypeId);
  for (const record of bundle.rejected) {
    increment(rejectedCounts, record.prototypeId);
    const reasons = rejectionReasons.get(record.prototypeId) ?? new Set<string>();
    for (const reason of record.audit.rejectionReasons) reasons.add(reason);
    rejectionReasons.set(record.prototypeId, reasons);
  }

  const authorities: BlrCp003AuthorityReadiness[] =
    cp003ProvisionalAuthorities().map((authority) => {
      const sourcePrototypeIds = sourcePrototypeIdsFor(authority);
      const activeRecordsByPrototype = countsFor(sourcePrototypeIds, activeCounts);
      const rejectedRecordsByPrototype = countsFor(sourcePrototypeIds, rejectedCounts);
      const activeRecordCount = sourcePrototypeIds.reduce(
        (total, prototypeId) =>
          total + (activeRecordsByPrototype[prototypeId] ?? 0),
        0,
      );
      const rejectedRecordCount = sourcePrototypeIds.reduce(
        (total, prototypeId) =>
          total + (rejectedRecordsByPrototype[prototypeId] ?? 0),
        0,
      );
      const sourcePrototypeIdsWithoutActiveRecords = sourcePrototypeIds.filter(
        (prototypeId) => activeRecordsByPrototype[prototypeId] === 0,
      );
      const authorityRejectionReasons = [
        ...new Set(
          sourcePrototypeIds.flatMap((prototypeId) => [
            ...(rejectionReasons.get(prototypeId) ?? []),
          ]),
        ),
      ].sort();

      return {
        authority,
        sourcePrototypeIds,
        activeRecordCount,
        rejectedRecordCount,
        activeRecordsByPrototype,
        rejectedRecordsByPrototype,
        rejectionReasons: authorityRejectionReasons,
        sourcePrototypeIdsWithoutActiveRecords,
        learnerEvidenceReady:
          activeRecordCount >= BLR_CP003_MIN_ACTIVE_RECORDS_PER_AUTHORITY,
      };
    });

  const learnerSupportedAuthorities = authorities
    .filter((entry) => entry.learnerEvidenceReady)
    .map((entry) => entry.authority);
  const blockedAuthorities = authorities
    .filter((entry) => !entry.learnerEvidenceReady)
    .map((entry) => entry.authority);

  return {
    version: BLR_CP003_FINAL_FREEZE_READINESS_VERSION,
    humanReviewApproved: true,
    acceptedPolishValidated: true,
    postHumanSourceGapConfirmed: true,
    activeLearnerReviewRecordCount: bundle.selected.length,
    rejectedSourceRecordCount: bundle.rejected.length,
    sourceRecordCount: bundle.sourceRecordCount,
    provisionalAuthorityCount: authorities.length,
    authorities,
    learnerSupportedAuthorities,
    blockedAuthorities,
    finalDiscoveryFreezeReady: blockedAuthorities.length === 0,
    permanentQlIds: [] as const,
    nextAvailableChapterQlId: "BLR-QL-009" as const,
    releaseLock: {
      englishReviewOnly: true,
      questionStudioAllowed: false,
      questionBankWriteAllowed: false,
      mockTestAllowed: false,
      localisationAllowed: false,
      publicPublicationAllowed: false,
      mergeAllowed: false,
    },
  } as const;
}

export const BLR_CP003_FINAL_FREEZE_READINESS =
  buildBlrCp003FinalFreezeReadiness();
