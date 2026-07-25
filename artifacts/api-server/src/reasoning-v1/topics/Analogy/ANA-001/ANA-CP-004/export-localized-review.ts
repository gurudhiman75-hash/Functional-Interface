import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ANA_CP004_QLS } from "./question-language.en";
import { generateLocalizedSetAnalogy } from "./localized-runtime";

const here = dirname(fileURLToPath(import.meta.url));
const locales = [
  { id: "hi-IN" as const, title: "Hindi", file: "ana-cp-004-hindi-runtime-review.md" },
  { id: "pa-IN" as const, title: "Punjabi", file: "ana-cp-004-punjabi-runtime-review.md" },
];

function optionText(value: number | readonly [number, number, number]): string {
  return Array.isArray(value) ? `(${value.join(", ")})` : String(value);
}

for (const locale of locales) {
  const lines: string[] = [
    `# ANA-CP-004 ${locale.title} Runtime Review`,
    "",
    "Three deterministic samples per QL. Review layout readability, missing-position clarity, terminology, arithmetic, options and explanation naturalness.",
    "",
  ];
  for (const ql of ANA_CP004_QLS) {
    lines.push(`## ${ql.qlId} — ${ql.ruleId}`, "");
    for (const seed of [0, 5, 11]) {
      const q = generateLocalizedSetAnalogy(ql.qlId, locale.id, seed);
      lines.push(
        `### Seed ${seed}`,
        "",
        `**Difficulty:** ${q.difficulty}`,
        `**Layout:** ${q.layout}`,
        `**Missing position:** ${q.missingPosition ?? "N/A"}`,
        "",
        `**Question:**\n\n${q.stem}`,
        "",
      );
      q.options.forEach((option, index) => {
        const marker = index === q.correctIndex ? " **✓**" : "";
        lines.push(`${String.fromCharCode(65 + index)}. ${optionText(option.value)}${marker}`);
      });
      lines.push(
        "",
        `**Rule:** ${q.explanation.ruleStatement}`,
        `**Source:** ${q.explanation.sourceDemonstration}`,
        `**Target:** ${q.explanation.targetApplication}`,
        `**Conclusion:** ${q.explanation.conclusion}`,
        `**Trap rejection:** ${q.explanation.closestTrapRejection}`,
        "",
      );
    }
  }
  const output = join(here, locale.file);
  writeFileSync(output, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${output}`);
}
