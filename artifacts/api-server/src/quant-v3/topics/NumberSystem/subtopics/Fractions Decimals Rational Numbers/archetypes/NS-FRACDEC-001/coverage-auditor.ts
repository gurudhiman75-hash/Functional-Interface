import { auditNsFracdec001Batch, getNsFracdec001ActiveCanonicalProblemIds } from "./library";
import { generateNsFracdec001Batch } from "./pipeline";
import type { NsFracdec001CanonicalProblemId } from "./types";

export function generateNsFracdec001CoverageAudit(input: { canonicalProblemId: NsFracdec001CanonicalProblemId; count: number; seed?: string }) {
  return auditNsFracdec001Batch(generateNsFracdec001Batch(input.canonicalProblemId, input.count, input.seed ?? "ns-fracdec-001-coverage"));
}

export function generateNsFracdec001FullCoverageAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-fracdec-001-full";
  return Object.fromEntries(
    getNsFracdec001ActiveCanonicalProblemIds().map((cpId) => [cpId, generateNsFracdec001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed })]),
  );
}
