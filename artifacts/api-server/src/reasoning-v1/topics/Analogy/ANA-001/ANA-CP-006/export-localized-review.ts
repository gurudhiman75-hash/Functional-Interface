import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateLocalizedClusterAnalogy,
  type ClusterLocale,
} from "./localized-runtime";
import { ANA_CP006_QLS } from "./question-language.en";

const directory = dirname(fileURLToPath(import.meta.url));
const locales: readonly ClusterLocale[] = ["hi-IN", "pa-IN"];
const reviewSeeds = [2, 7, 13, 19] as const;

for (const locale of locales) {
  const label = locale === "hi-IN" ? "Hindi" : "Punjabi";
  const filename = locale === "hi-IN"
    ? "ana-cp-006-hindi-runtime-review.md"
    : "ana-cp-006-punjabi-runtime-review.md";
  const lines: string[] = [
    `# ANA-CP-006 ${label} Runtime Review`,
    "",
    "- QLs: 48",
    "- Samples per QL: 4",
    "- Total samples: 192",
    "- Publication status: runtime proof only",
    "",
  ];

  for (const ql of ANA_CP006_QLS) {
    lines.push(`## ${ql.qlId} — ${ql.title}`, "");
    for (const seed of reviewSeeds) {
      const question = generateLocalizedClusterAnalogy(ql.qlId, locale, seed);
      lines.push(
        `### Seed ${seed} · ${question.difficulty} (score ${question.difficultyScore}) · ${question.layout}`,
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
