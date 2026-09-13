import { writeFileSync } from "node:fs";
import { generateLpCp04BatchV3, LP_CP04_COUNTERFACTUAL_V3 } from "./lp-cp04-counterfactual-v3.ts";

const seed = process.argv[2] || "lp-cp04-human-review-v3";
const count = Math.min(12, Math.max(1, Number(process.argv[3] || 9)));
const caselets = generateLpCp04BatchV3(seed, count);

const lines: string[] = [
  "# LP CP04 Counterfactual / Additional-Condition Review Pack V3",
  "",
  `Authority: ${LP_CP04_COUNTERFACTUAL_V3.authorityId}`,
  `Status: ${LP_CP04_COUNTERFACTUAL_V3.status}`,
  "Permanent QL: UNALLOCATED",
  `Seed: ${seed}`,
  `Caselets: ${caselets.length}`,
  "",
  "> Review purpose: inspect exam-realness, mixed-parent structural difficulty, usefulness of the temporary condition, option plausibility and explanation clarity before any permanent QL allocation.",
  "",
];

caselets.forEach((caselet: any, index) => {
  const child = caselet.counterfactualChild;
  const setupOnly = caselet.scenario.split("\n\n")[0]!;
  const topology = caselet.parentTopology ?? "LP-001_GROUPING";
  lines.push(`## Caselet ${index + 1} — ${caselet.difficultyBand}`);
  lines.push("");
  lines.push(`**Parent topology:** ${topology}`);
  lines.push("");
  lines.push(setupOnly);
  lines.push("");
  lines.push("### Original clues");
  lines.push("");
  caselet.clues.forEach((clue: any) => lines.push(`- ${clue.text}`));
  lines.push("");
  lines.push("### Question");
  lines.push("");
  lines.push(child.stem);
  lines.push("");
  child.options.forEach((option: string, optionIndex: number) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  lines.push("");
  lines.push(`**Correct option:** ${String.fromCharCode(65 + child.correctIndex)} — ${child.answer}`);
  lines.push(`**Original valid states:** ${child.parentStateCount}`);
  lines.push(`**After additional condition:** ${child.conditionedStateCount}`);
  lines.push("");
  lines.push("### Explanation");
  lines.push("");
  lines.push(child.explanation.summary);
  lines.push("");
  child.explanation.lines.forEach((line: string) => { lines.push(line); lines.push(""); });
});

const output = lines.join("\n");
const outputPath = process.argv[4] || "lp-cp04-counterfactual-review-v3.md";
writeFileSync(outputPath, output, "utf8");
console.log(output);
