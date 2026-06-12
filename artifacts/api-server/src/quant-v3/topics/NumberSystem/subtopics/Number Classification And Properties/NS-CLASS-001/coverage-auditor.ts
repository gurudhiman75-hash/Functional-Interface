import { auditNsClass001Batch, getNsClass001ActiveCanonicalProblemIds } from "./library";
import { generateNsClass001Batch } from "./pipeline";
import type { NsClass001CanonicalProblemId } from "./types";

export function generateNsClass001CoverageAudit(input: { canonicalProblemId: NsClass001CanonicalProblemId; count: number; seed?: string }) {
  return auditNsClass001Batch(generateNsClass001Batch(input.canonicalProblemId, input.count, input.seed ?? "ns-class-001-coverage"));
}

export function generateNsClass001FullCoverageAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-class-001-full";
  return Object.fromEntries(
    getNsClass001ActiveCanonicalProblemIds().map((cpId) => [cpId, generateNsClass001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed })]),
  );
}
