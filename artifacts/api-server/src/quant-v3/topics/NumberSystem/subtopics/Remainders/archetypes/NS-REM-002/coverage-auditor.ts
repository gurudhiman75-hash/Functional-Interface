import { auditNsRem002Batch } from "./library";
import { NS_REM_002_PIPELINES } from "./pipeline";
import type { NsRem002AuditReport, NsRem002CanonicalProblemId, NsRem002QuestionPackage } from "./types";

export function generateNsRem002AuditBatch(input: { canonicalProblemId: NsRem002CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_REM_002_PIPELINES[input.canonicalProblemId];
  const outputs: NsRem002QuestionPackage[] = [];
  let generationFailures = 0;

  let index = 0;
  while (outputs.length < input.count && index < input.count * 10) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-REM-002-AUDIT"}:${input.canonicalProblemId}:${index}` }));
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
    report: auditNsRem002Batch(outputs, generationFailures) as NsRem002AuditReport,
  };
}

export function generateNsRem002FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_REM_002_PIPELINES).reduce<Record<string, NsRem002AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsRem002AuditBatch({
      canonicalProblemId: canonicalProblemId as NsRem002CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsRem002BatchRealism = auditNsRem002Batch;
