import { auditNsHcf001Batch } from "./library";
import { NS_HCF_001_PIPELINES } from "./pipeline";
import type { NsHcf001AuditReport, NsHcf001CanonicalProblemId, NsHcf001QuestionPackage } from "./types";

export function generateNsHcf001AuditBatch(input: { canonicalProblemId: NsHcf001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_HCF_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsHcf001QuestionPackage[] = [];
  let generationFailures = 0;
  let index = 0;
  while (outputs.length < input.count && index < input.count * 20) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-HCF-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
    } catch {
      generationFailures += 1;
    }
    index += 1;
  }
  if (outputs.length !== input.count) {
    throw new Error(`${input.canonicalProblemId} generated ${outputs.length} accepted outputs out of ${input.count} requested.`);
  }
  return { outputs, report: auditNsHcf001Batch(outputs, generationFailures) as NsHcf001AuditReport };
}

export function generateNsHcf001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_HCF_001_PIPELINES).reduce<Record<string, NsHcf001AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsHcf001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsHcf001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsHcf001BatchRealism = auditNsHcf001Batch;
