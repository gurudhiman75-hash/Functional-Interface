import { auditNsLastdig001Batch, getNsLastdig001ActiveCanonicalProblemIds } from "./library";
import { generateNsLastdig001Batch } from "./pipeline";
import type { NsLastdig001CanonicalProblemId } from "./types";

export function generateNsLastdig001CoverageAudit(input: { canonicalProblemId: NsLastdig001CanonicalProblemId; count: number; seed?: string }) {
  return auditNsLastdig001Batch(generateNsLastdig001Batch(input.canonicalProblemId, input.count, input.seed ?? "ns-lastdig-001-coverage"));
}

export function generateNsLastdig001FullCoverageAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-lastdig-001-full";
  return Object.fromEntries(
    getNsLastdig001ActiveCanonicalProblemIds().map((cpId) => [cpId, generateNsLastdig001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed })]),
  );
}
