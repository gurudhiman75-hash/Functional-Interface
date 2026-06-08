import { auditNsPf001Batch } from "./library";
import { NS_PF_001_PIPELINES } from "./pipeline";
import type { NsPf001AuditReport, NsPf001CanonicalProblemId, NsPf001QuestionPackage } from "./types";

export function generateNsPf001AuditBatch(input: { canonicalProblemId: NsPf001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_PF_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsPf001QuestionPackage[] = [];
  let generationFailures = 0;

  let index = 0;
  while (outputs.length < input.count && index < input.count * 20) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-PF-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
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
    report: auditNsPf001Batch(outputs, generationFailures) as NsPf001AuditReport,
  };
}

export function generateNsPf001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_PF_001_PIPELINES).reduce<Record<string, NsPf001AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsPf001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsPf001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsPf001BatchRealism = auditNsPf001Batch;
