import { auditNsPrm001Batch } from "./library";
import { NS_PRM_001_PIPELINES } from "./pipeline";
import type { NsPrm001AuditReport, NsPrm001CanonicalProblemId, NsPrm001QuestionPackage } from "./types";

export function generateNsPrm001AuditBatch(input: { canonicalProblemId: NsPrm001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_PRM_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsPrm001QuestionPackage[] = [];
  let generationFailures = 0;

  let index = 0;
  while (outputs.length < input.count && index < input.count * 20) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-PRM-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
    } catch {
      generationFailures += 1;
    }
    index += 1;
  }

  if (outputs.length !== input.count) {
    throw new Error(`${input.canonicalProblemId} generated ${outputs.length} accepted outputs out of ${input.count} requested.`);
  }

  return {
    outputs,
    report: auditNsPrm001Batch(outputs, generationFailures) as NsPrm001AuditReport,
  };
}

export function generateNsPrm001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_PRM_001_PIPELINES).reduce<Record<string, NsPrm001AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsPrm001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsPrm001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsPrm001BatchRealism = auditNsPrm001Batch;
