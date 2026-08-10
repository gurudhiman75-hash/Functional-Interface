import { exactCaseletContentFingerprint, type AuditCaselet } from "../saturation/corpus.ts";

export type Sea001ManualReviewDecision = "PENDING" | "ACCEPT" | "REWRITE" | "REJECT";

export interface Sea001ManualReviewEntry {
  readonly caseletId: string;
  readonly checkpointId: AuditCaselet["checkpointId"];
  readonly blueprintAuthorityId: string;
  readonly contentFingerprint: string;
  readonly decision: Sea001ManualReviewDecision;
  readonly reviewerId?: string;
  readonly reviewedAt?: string;
  readonly notes: string;
}

export interface Sea001ManualReviewAudit {
  readonly expectedCaselets: number;
  readonly ledgerEntries: number;
  readonly matchedEntries: number;
  readonly missingEntries: readonly string[];
  readonly staleEntries: readonly string[];
  readonly duplicateEntryCount: number;
  readonly contentMismatchCount: number;
  readonly checkpointDistribution: Readonly<Record<string, number>>;
  readonly pendingCount: number;
  readonly acceptCount: number;
  readonly rewriteCount: number;
  readonly rejectCount: number;
  readonly unsignedDecisionCount: number;
  readonly complete: boolean;
  readonly freezeEligible: boolean;
}

function countByCheckpoint(caselets: readonly AuditCaselet[]): Readonly<Record<string, number>> {
  const counts = new Map<string, number>();
  for (const caselet of caselets) counts.set(caselet.checkpointId, (counts.get(caselet.checkpointId) ?? 0) + 1);
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

export function buildPendingSea001ManualReviewLedger(
  reviewCorpus: readonly AuditCaselet[],
): readonly Sea001ManualReviewEntry[] {
  return reviewCorpus.map((caselet) => ({
    caseletId: caselet.caseletId,
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    contentFingerprint: exactCaseletContentFingerprint(caselet),
    decision: "PENDING",
    notes: "",
  }));
}

export function auditSea001ManualReviewLedger(
  reviewCorpus: readonly AuditCaselet[],
  entries: readonly Sea001ManualReviewEntry[],
): Sea001ManualReviewAudit {
  const expectedById = new Map(reviewCorpus.map((caselet) => [caselet.caseletId, caselet]));
  const entriesById = new Map<string, Sea001ManualReviewEntry[]>();
  for (const entry of entries) {
    const bucket = entriesById.get(entry.caseletId) ?? [];
    bucket.push(entry);
    entriesById.set(entry.caseletId, bucket);
  }

  const missingEntries = [...expectedById.keys()].filter((caseletId) => !entriesById.has(caseletId)).sort();
  const staleEntries = [...entriesById.keys()].filter((caseletId) => !expectedById.has(caseletId)).sort();
  const duplicateEntryCount = [...entriesById.values()].reduce((sum, bucket) => sum + Math.max(0, bucket.length - 1), 0);
  let contentMismatchCount = 0;
  let matchedEntries = 0;
  let pendingCount = 0;
  let acceptCount = 0;
  let rewriteCount = 0;
  let rejectCount = 0;
  let unsignedDecisionCount = 0;

  for (const [caseletId, caselet] of expectedById) {
    const bucket = entriesById.get(caseletId);
    if (!bucket || bucket.length !== 1) continue;
    const entry = bucket[0];
    if (!entry) continue;
    matchedEntries += 1;
    if (entry.checkpointId !== caselet.checkpointId
      || entry.blueprintAuthorityId !== caselet.blueprintAuthorityId
      || entry.contentFingerprint !== exactCaseletContentFingerprint(caselet)) {
      contentMismatchCount += 1;
    }
    if (entry.decision === "PENDING") pendingCount += 1;
    if (entry.decision === "ACCEPT") acceptCount += 1;
    if (entry.decision === "REWRITE") rewriteCount += 1;
    if (entry.decision === "REJECT") rejectCount += 1;
    if (entry.decision !== "PENDING" && (!entry.reviewerId?.trim() || !entry.reviewedAt?.trim())) unsignedDecisionCount += 1;
  }

  const checkpointDistribution = countByCheckpoint(reviewCorpus);
  const balanced = ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"]
    .every((checkpointId) => checkpointDistribution[checkpointId] === 20);
  const complete = reviewCorpus.length === 100
    && entries.length === 100
    && matchedEntries === 100
    && balanced
    && missingEntries.length === 0
    && staleEntries.length === 0
    && duplicateEntryCount === 0
    && contentMismatchCount === 0
    && pendingCount === 0
    && unsignedDecisionCount === 0;
  const freezeEligible = complete && rewriteCount === 0 && rejectCount === 0 && acceptCount === 100;

  return {
    expectedCaselets: reviewCorpus.length,
    ledgerEntries: entries.length,
    matchedEntries,
    missingEntries,
    staleEntries,
    duplicateEntryCount,
    contentMismatchCount,
    checkpointDistribution,
    pendingCount,
    acceptCount,
    rewriteCount,
    rejectCount,
    unsignedDecisionCount,
    complete,
    freezeEligible,
  };
}

export function assertSea001ManualEnglishReviewComplete(
  audit: Sea001ManualReviewAudit,
): void {
  if (!audit.freezeEligible) {
    throw new Error(
      `SEA-001 English review is not freeze-eligible: pending=${audit.pendingCount}, rewrite=${audit.rewriteCount}, reject=${audit.rejectCount}, unsigned=${audit.unsignedDecisionCount}, mismatches=${audit.contentMismatchCount}`,
    );
  }
}
