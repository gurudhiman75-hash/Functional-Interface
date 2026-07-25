import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateLocalizedAlphabetAnalogy, type AlphabetLocale } from "./localized-runtime";
import { ANA_CP005_QLS } from "./question-language.en";

const directory = dirname(fileURLToPath(import.meta.url));
const locales: readonly AlphabetLocale[] = ["hi-IN", "pa-IN"];

for (const locale of locales) {
  const label = locale === "hi-IN" ? "Hindi" : "Punjabi";
  const filename = locale === "hi-IN"
    ? "ana-cp-005-hindi-runtime-review.md"
    : "ana-cp-005-punjabi-runtime-review.md";
  const lines: string[] = [`# ANA-CP-005 ${label} Runtime Review`, ""];

  for (const ql of ANA_CP005_QLS) {
    lines.push(`## ${ql.qlId} — ${ql.title}`, "");
    for (const seed of [2, 13, 27, 44]) {
      const question = generateLocalizedAlphabetAnalogy(ql.qlId, locale, seed);
      lines.push(
        `### Seed ${seed} · ${question.difficulty} · ${question.layout}`,
        "",
        question.stem,
        "",
        ...question.options.map((option, index) => {
          const value = Array.isArray(option.value) ? `${option.value[0]} : ${option.value[1]}` : option.value;
          return `${String.fromCharCode(65 + index)}. ${value}${index === question.correctIndex ? " **✓**" : ""}`;
        }),
        "",
        `**Rule:** ${question.explanation.ruleStatement}`,
        "",
        `**Source:** ${question.explanation.sourceDemonstration}`,
        "",
        `**Target:** ${question.explanation.targetApplication}`,
        "",
        `**Conclusion:** ${question.explanation.conclusion}`,
        "",
        `**Trap note:** ${question.explanation.closestTrapRejection}`,
        "",
        "---",
        "",
      );
    }
  }

  const outputPath = join(directory, filename);
  writeFileSync(outputPath, lines.join("\n"), "utf8");
  console.log(`Wrote ${outputPath}`);
}
