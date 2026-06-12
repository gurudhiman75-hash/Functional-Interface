import { auditNsDigit001Batch, getNsDigit001ActiveCanonicalProblemIds } from "./library";
import { generateNsDigit001Batch } from "./pipeline";
import type { NsDigit001CanonicalProblemId } from "./types";

export function generateNsDigit001CoverageAudit(input: { canonicalProblemId: NsDigit001CanonicalProblemId; count: number; seed?: string }) {
  return auditNsDigit001Batch(generateNsDigit001Batch(input.canonicalProblemId, input.count, input.seed ?? "ns-digit-001-coverage"));
}

export function generateNsDigit001FullCoverageAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-digit-001-full";
  return Object.fromEntries(
    getNsDigit001ActiveCanonicalProblemIds().map((cpId) => [cpId, generateNsDigit001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed })]),
  );
}
