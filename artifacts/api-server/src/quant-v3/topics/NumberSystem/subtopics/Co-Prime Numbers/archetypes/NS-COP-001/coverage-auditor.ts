import { auditNsCop001Batch } from "./library";
import { NS_COP_001_PIPELINES } from "./pipeline";
import type { NsCop001AuditReport, NsCop001CanonicalProblemId, NsCop001QuestionPackage } from "./types";

export function generateNsCop001AuditBatch(input: { canonicalProblemId: NsCop001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_COP_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsCop001QuestionPackage[] = [];
  let generationFailures = 0;
  let index = 0;
  while (outputs.length < input.count && index < input.count * 20) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-COP-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
    } catch {
      generationFailures += 1;
    }
    index += 1;
  }
  if (outputs.length !== input.count) throw new Error(`${input.canonicalProblemId} generated ${outputs.length} accepted outputs out of ${input.count} requested.`);
  return { outputs, report: auditNsCop001Batch(outputs, generationFailures) as NsCop001AuditReport };
}

export function generateNsCop001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_COP_001_PIPELINES).reduce<Record<string, NsCop001AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsCop001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsCop001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsCop001BatchRealism = auditNsCop001Batch;
