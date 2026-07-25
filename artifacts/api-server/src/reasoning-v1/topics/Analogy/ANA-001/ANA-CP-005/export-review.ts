import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateAlphabetAnalogy } from "./generator";
import { ANA_CP005_QLS } from "./question-language.en";

const directory = dirname(fileURLToPath(import.meta.url));
const outputPath = join(directory, "ana-cp-005-runtime-review.md");
const lines: string[] = [
  "# ANA-CP-005 English Runtime Review",
  "",
  "Generated review samples for ANA-QL-141 through ANA-QL-160.",
  "",
];

for (const ql of ANA_CP005_QLS) {
  lines.push(`## ${ql.qlId} — ${ql.title}`, "");
  for (const seed of [0, 7, 19, 34, 51, 73]) {
    const question = generateAlphabetAnalogy(ql.qlId, seed);
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

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outputPath}`);
