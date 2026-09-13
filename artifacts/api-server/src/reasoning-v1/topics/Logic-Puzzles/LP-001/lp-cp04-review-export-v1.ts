import { writeFileSync } from "node:fs";
import { generateLpCp04Batch, LP_CP04_COUNTERFACTUAL_V1 } from "./lp-cp04-counterfactual-v1.ts";

const seed = process.argv[2] || "lp-cp04-human-review-v1";
const count = Math.min(12, Math.max(1, Number(process.argv[3] || 8)));
const caselets = generateLpCp04Batch(seed, count);

const lines: string[] = [
  "# LP CP04 Counterfactual / Additional-Condition Review Pack V1",
  "",
  `Authority: ${LP_CP04_COUNTERFACTUAL_V1.authorityId}`,
  `Status: ${LP_CP04_COUNTERFACTUAL_V1.status}`,
  `Permanent QL: UNALLOCATED`,
  `Seed: ${seed}`,
  `Caselets: ${caselets.length}`,
  "",
  "> Review purpose: inspect exam-realness, usefulness of the temporary condition, option plausibility and explanation clarity before any permanent QL allocation.",
  "",
];

caselets.forEach((caselet, index) => {
  const child = caselet.counterfactualChild;
  lines.push(`## Caselet ${index + 1} — ${caselet.difficultyBand}`);
  lines.push("");
  lines.push(caselet.scenario);
  lines.push("");
  lines.push("### Original clues");
  lines.push("");
  caselet.clues.forEach((clue) => lines.push(`- ${clue.text}`));
  lines.push("");
  lines.push(`### Question`);
  lines.push("");
  lines.push(child.stem);
  lines.push("");
  child.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  lines.push("");
  lines.push(`**Correct option:** ${String.fromCharCode(65 + child.correctIndex)} — ${child.answer}`);
  lines.push(`**Conditioned valid states:** ${child.conditionedStateCount}`);
  lines.push("");
  lines.push("### Explanation");
  lines.push("");
  lines.push(child.explanation.summary);
  lines.push("");
  child.explanation.lines.forEach((line) => { lines.push(line); lines.push(""); });
});

const output = lines.join("\n");
const outputPath = process.argv[4] || "lp-cp04-counterfactual-review-v1.md";
writeFileSync(outputPath, output, "utf8");
console.log(output);
