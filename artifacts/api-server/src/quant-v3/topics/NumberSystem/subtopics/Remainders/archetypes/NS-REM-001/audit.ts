import { auditNsRem001Batch } from "./library";
import { NS_REM_001_PIPELINES } from "./pipeline";
import type { NsRem001AuditReport, NsRem001CanonicalProblemId, NsRem001QuestionPackage } from "./types";

export function generateNsRem001AuditBatch(input: { canonicalProblemId: NsRem001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_REM_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsRem001QuestionPackage[] = [];
  let generationFailures = 0;

  for (let index = 0; index < input.count; index += 1) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-REM-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
    } catch {
      generationFailures += 1;
    }
  }

  return {
    outputs,
    report: auditNsRem001Batch(outputs, generationFailures) as NsRem001AuditReport,
  };
}

export function generateNsRem001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  const reports = Object.keys(NS_REM_001_PIPELINES).reduce<Record<string, NsRem001AuditReport>>((accumulator, canonicalProblemId) => {
    accumulator[canonicalProblemId] = generateNsRem001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsRem001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return accumulator;
  }, {});

  return reports;
}
