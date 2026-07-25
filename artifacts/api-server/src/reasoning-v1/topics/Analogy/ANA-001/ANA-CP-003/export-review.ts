import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ANA_CP003_QLS } from "./question-language.en";
import { generateNumericAnalogy } from "./generator";

function formatOption(value: number | readonly [number, number]): string {
  return Array.isArray(value) ? `${value[0]} : ${value[1]}` : String(value);
}

const lines: string[] = [
  "# ANA-CP-003 Numeric Analogy Runtime Review",
  "",
  "Two exact TypeScript-runtime samples per QL. Review stems, option quality, ambiguity, answer and explanation.",
  "",
];

for (const ql of ANA_CP003_QLS) {
  lines.push(`## ${ql.qlId} — ${ql.title}`, "");
  for (const seed of [11, 29]) {
    const generated = generateNumericAnalogy(ql.qlId, seed);
    lines.push(`### Seed ${seed}`, "", `**Question:** ${generated.stem}`, "", "**Options:**");
    generated.options.forEach((option, index) => {
      lines.push(`${index + 1}. ${formatOption(option.value)}${index === generated.correctIndex ? "  ← correct" : ""}`);
    });
    lines.push(
      "",
      `**Rule:** ${generated.explanation.ruleStatement}`,
      "",
      `**Source step:** ${generated.explanation.sourceDemonstration}`,
      "",
      `**Target step:** ${generated.explanation.targetApplication}`,
      "",
      `**Conclusion:** ${generated.explanation.conclusion}`,
      "",
      `**Trap rejection:** ${generated.explanation.closestTrapRejection}`,
      "",
      "**Decision:** ☐ Approve  ☐ Revise",
      "",
      "**Reviewer notes:**",
      "",
      "---",
      "",
    );
  }
}

const output = join(import.meta.dirname, "ana-cp-003-runtime-review.md");
writeFileSync(output, lines.join("\n"), "utf8");
console.log(`Wrote ${output} with ${ANA_CP003_QLS.length * 2} generated questions.`);
