import { auditNsLcm001Batch } from "./library";
import { NS_LCM_001_PIPELINES } from "./pipeline";
import type { NsLcm001AuditReport, NsLcm001CanonicalProblemId, NsLcm001QuestionPackage } from "./types";

export function generateNsLcm001AuditBatch(input: { canonicalProblemId: NsLcm001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_LCM_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsLcm001QuestionPackage[] = [];
  let generationFailures = 0;
  let index = 0;
  while (outputs.length < input.count && index < input.count * 20) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-LCM-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
    } catch {
      generationFailures += 1;
    }
    index += 1;
  }
  if (outputs.length !== input.count) {
    throw new Error(`${input.canonicalProblemId} generated ${outputs.length} accepted outputs out of ${input.count} requested.`);
  }
  return { outputs, report: auditNsLcm001Batch(outputs, generationFailures) as NsLcm001AuditReport };
}

export function generateNsLcm001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_LCM_001_PIPELINES).reduce<Record<string, NsLcm001AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsLcm001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsLcm001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsLcm001BatchRealism = auditNsLcm001Batch;
