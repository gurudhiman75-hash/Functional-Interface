import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ANA_CP003_QLS } from "./question-language.en";
import { generateLocalizedNumericAnalogy } from "./localized-runtime";

const here = dirname(fileURLToPath(import.meta.url));
const locales = [
  { id: "hi-IN" as const, title: "Hindi", file: "ana-cp-003-hindi-runtime-review.md" },
  { id: "pa-IN" as const, title: "Punjabi", file: "ana-cp-003-punjabi-runtime-review.md" },
];

function optionText(value: number | readonly [number, number]): string {
  return Array.isArray(value) ? `${value[0]} : ${value[1]}` : String(value);
}

for (const locale of locales) {
  const lines: string[] = [
    `# ANA-CP-003 ${locale.title} Runtime Review`,
    "",
    "Two deterministic samples per QL. Review stems, options, correctness, arithmetic steps, terminology and naturalness.",
    "",
  ];
  for (const ql of ANA_CP003_QLS) {
    lines.push(`## ${ql.qlId} — ${ql.ruleId}`, "");
    for (const seed of [0, 1]) {
      const q = generateLocalizedNumericAnalogy(ql.qlId, locale.id, seed);
      lines.push(`### Sample ${seed + 1}`, "", `**Question:** ${q.stem}`, "");
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
  writeFileSync(join(here, locale.file), `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${locale.file}`);
}
