import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateClusterAnalogy } from "./generator";
import { ANA_CP006_QLS } from "./question-language.en";

const directory = dirname(fileURLToPath(import.meta.url));
const outputPath = join(directory, "ana-cp-006-runtime-review.md");
const reviewSeeds = [0, 7, 13, 22, 31, 39] as const;
const lines: string[] = [
  "# ANA-CP-006 English Runtime Review",
  "",
  "- QLs: 48",
  "- Samples per QL: 6",
  "- Total samples: 288",
  "- Publication status: runtime proof only",
  "",
];

for (const ql of ANA_CP006_QLS) {
  lines.push(`## ${ql.qlId} — ${ql.title}`, "");
  for (const seed of reviewSeeds) {
    const question = generateClusterAnalogy(ql.qlId, seed);
    lines.push(
      `### Seed ${seed} · ${question.difficulty} (score ${question.difficultyScore}) · ${question.layout}`,
      "",
      question.stem,
      "",
      ...question.options.map((option, index) => {
        const value = Array.isArray(option.value) ? `${option.value[0]} : ${option.value[1]}` : option.value;
        return `${String.fromCharCode(65 + index)}. ${value}${index === question.correctIndex ? " **✓**" : ""}${option.errorLabel ? `  _(${option.errorLabel})_` : ""}`;
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
      `**Context:** \`${JSON.stringify(question.context)}\``,
      "",
      "---",
      "",
    );
  }
}

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outputPath}`);
