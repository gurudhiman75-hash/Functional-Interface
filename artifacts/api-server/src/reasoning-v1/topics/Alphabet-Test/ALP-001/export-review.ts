import { writeFileSync } from "node:fs";
import { ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpLocale } from "./types";

const locale = (process.argv[2] ?? "en-IN") as AlpLocale;
const samplesPerQl = Number.parseInt(process.argv[3] ?? "3", 10);
const outputPath = process.argv[4] ?? `alp-001-cp001-cp005-${locale}-review.md`;
const lines: string[] = [`# ALP-001 CP-001–CP-005 Review — ${locale}`, ""];

for (const ql of ALP_001_QLS) {
  lines.push(`## ${ql.qlId} — ${ql.solveMode}`, "");
  for (let seed = 0; seed < samplesPerQl; seed += 1) {
    const question = generateAlp001Question(ql.qlId, seed, locale);
    lines.push(`### Seed ${seed} · ${question.difficulty} · ${question.renderer}`, "", question.stem, "");
    question.options.forEach((option, index) => lines.push(`${index + 1}. ${option.value}${index === question.correctIndex ? "  **✓**" : ""}`));
    lines.push("", `**Rule:** ${question.explanation.ruleStatement}`);
    question.explanation.steps.forEach((step, index) => lines.push(`- Step ${index + 1}: ${step}`));
    lines.push(`- ${question.explanation.conclusion}`, `- Trap: ${question.explanation.closestTrapRejection}`, "");
  }
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
