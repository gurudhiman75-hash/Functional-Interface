import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ANA_CP004_QLS } from "./question-language.en";
import { generateSetAnalogy } from "./generator";

const here = dirname(fileURLToPath(import.meta.url));
const output = join(here, "ana-cp-004-runtime-review.md");
const lines: string[] = [
  "# ANA-CP-004 Runtime Review",
  "",
  "Two deterministic samples per QL. Review table/grid readability, options, correctness, ambiguity and explanation quality.",
  "",
];

function optionText(value: number | readonly [number, number, number]): string {
  return Array.isArray(value) ? `(${value.join(", ")})` : String(value);
}

for (const ql of ANA_CP004_QLS) {
  lines.push(`## ${ql.qlId} — ${ql.ruleId}`, "");
  for (const seed of [0, 1]) {
    const question = generateSetAnalogy(ql.qlId, seed);
    lines.push(`### Sample ${seed + 1}`, "", `**Question:** ${question.stem}`, "");
    question.options.forEach((option, index) => {
      const marker = index === question.correctIndex ? " **✓**" : "";
      lines.push(`${String.fromCharCode(65 + index)}. ${optionText(option.value)}${marker}`);
    });
    lines.push(
      "",
      `**Rule:** ${question.explanation.ruleStatement}`,
      `**Source:** ${question.explanation.sourceDemonstration}`,
      `**Target:** ${question.explanation.targetApplication}`,
      `**Conclusion:** ${question.explanation.conclusion}`,
      `**Trap rejection:** ${question.explanation.closestTrapRejection}`,
      "",
    );
  }
}

writeFileSync(output, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${output}`);
