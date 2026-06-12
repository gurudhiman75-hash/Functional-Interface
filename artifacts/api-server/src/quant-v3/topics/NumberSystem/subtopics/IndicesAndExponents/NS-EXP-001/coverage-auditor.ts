import { auditNsExp001Batch, getNsExp001ActiveCanonicalProblemIds } from "./library";
import { generateNsExp001Batch } from "./pipeline";
import type { NsExp001CanonicalProblemId } from "./types";

export function generateNsExp001CoverageAudit(input: { canonicalProblemId: NsExp001CanonicalProblemId; count: number; seed?: string }) {
  return auditNsExp001Batch(generateNsExp001Batch(input.canonicalProblemId, input.count, input.seed ?? "ns-exp-001-coverage"));
}

export function generateNsExp001FullCoverageAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-exp-001-full";
  return Object.fromEntries(
    getNsExp001ActiveCanonicalProblemIds().map((cpId) => [cpId, generateNsExp001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed })]),
  );
}
