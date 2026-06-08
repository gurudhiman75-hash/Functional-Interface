import { auditNsFac001Batch } from "./library";
import { NS_FAC_001_PIPELINES } from "./pipeline";
import type { NsFac001AuditReport, NsFac001CanonicalProblemId, NsFac001QuestionPackage } from "./types";

export function generateNsFac001AuditBatch(input: { canonicalProblemId: NsFac001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_FAC_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsFac001QuestionPackage[] = [];
  let generationFailures = 0;
  let index = 0;
  while (outputs.length < input.count && index < input.count * 20) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-FAC-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
    } catch {
      generationFailures += 1;
    }
    index += 1;
  }
  if (outputs.length !== input.count) {
    throw new Error(`${input.canonicalProblemId} generated ${outputs.length} accepted outputs out of ${input.count} requested.`);
  }
  return { outputs, report: auditNsFac001Batch(outputs, generationFailures) as NsFac001AuditReport };
}

export function generateNsFac001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_FAC_001_PIPELINES).reduce<Record<string, NsFac001AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsFac001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsFac001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsFac001BatchRealism = auditNsFac001Batch;
