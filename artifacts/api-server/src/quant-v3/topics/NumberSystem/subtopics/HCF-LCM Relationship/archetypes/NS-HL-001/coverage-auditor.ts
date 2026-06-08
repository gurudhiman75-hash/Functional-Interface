import { auditNsHl001Batch } from "./library";
import { NS_HL_001_PIPELINES } from "./pipeline";
import type { NsHl001AuditReport, NsHl001CanonicalProblemId, NsHl001QuestionPackage } from "./types";

export function generateNsHl001AuditBatch(input: { canonicalProblemId: NsHl001CanonicalProblemId; count: number; seed?: string }) {
  const run = NS_HL_001_PIPELINES[input.canonicalProblemId];
  const outputs: NsHl001QuestionPackage[] = [];
  let generationFailures = 0;
  let index = 0;
  while (outputs.length < input.count && index < input.count * 20) {
    try {
      outputs.push(run({ seed: `${input.seed ?? "NS-HL-001-AUDIT"}:${input.canonicalProblemId}:${index}` }));
    } catch {
      generationFailures += 1;
    }
    index += 1;
  }
  if (outputs.length !== input.count) throw new Error(`${input.canonicalProblemId} generated ${outputs.length} accepted outputs out of ${input.count} requested.`);
  return { outputs, report: auditNsHl001Batch(outputs, generationFailures) as NsHl001AuditReport };
}

export function generateNsHl001FullAudit(input: { countPerCp: number; seed?: string } = { countPerCp: 1000 }) {
  return Object.keys(NS_HL_001_PIPELINES).reduce<Record<string, NsHl001AuditReport>>((reports, canonicalProblemId) => {
    reports[canonicalProblemId] = generateNsHl001AuditBatch({
      canonicalProblemId: canonicalProblemId as NsHl001CanonicalProblemId,
      count: input.countPerCp,
      seed: input.seed,
    }).report;
    return reports;
  }, {});
}

export const auditNsHl001BatchRealism = auditNsHl001Batch;
