import { SER_CP007_TEMPLATE_PROBES_V71 } from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import type { SerCp007EditorialQuestion } from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

const counts = new Map<string, number>();
const sources = new Map<string, Set<string>>();

for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
  for (let seed = 1; seed <= 24; seed += 1) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    const opener = question.stem.split("\n")[0]?.trim() ?? "";
    counts.set(opener, (counts.get(opener) ?? 0) + 1);
    if (!sources.has(opener)) sources.set(opener, new Set());
    sources.get(opener)!.add(`${probe.temporaryTemplateId}:${question.taskKind}`);
  }
}

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_STEM_OPENER_AUDIT",
      templates: SER_CP007_TEMPLATE_PROBES_V71.length,
      seedsPerTemplate: 24,
      generatedQuestions: SER_CP007_TEMPLATE_PROBES_V71.length * 24,
      uniqueOpeners: counts.size,
      openers: [...counts]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([opener, count]) => ({
          opener,
          count,
          sources: [...(sources.get(opener) ?? [])].sort(),
        })),
    },
    null,
    2,
  ),
);
