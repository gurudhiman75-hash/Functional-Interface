import { auditNsTrail001Batch, getNsTrail001ActiveCanonicalProblemIds } from "./library";
import { generateNsTrail001Batch } from "./pipeline";
import type { NsTrail001AuditReport, NsTrail001CanonicalProblemId } from "./types";

export function generateNsTrail001CoverageAudit(input: { canonicalProblemId: NsTrail001CanonicalProblemId; count: number; seed?: string }): NsTrail001AuditReport {
  const seed = input.seed ?? "ns-trail-001-coverage-audit";
  return auditNsTrail001Batch(generateNsTrail001Batch(input.canonicalProblemId, input.count, seed));
}

export function generateNsTrail001FullAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-trail-001-full-audit";
  return Object.fromEntries(
    getNsTrail001ActiveCanonicalProblemIds().map((cpId) => [
      cpId,
      generateNsTrail001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed }),
    ]),
  ) as Record<NsTrail001CanonicalProblemId, NsTrail001AuditReport>;
}
