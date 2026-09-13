import { writeFileSync } from "node:fs";
import { generateLpCp04PermanentBatch, LP_CP04_ENGLISH_FREEZE_V1 } from "./lp-cp04-permanent-freeze-v1.ts";

const seed = process.argv[2] || "lp-cp04-human-review-v3";
const count = Math.min(12, Math.max(1, Number(process.argv[3] || 9)));
const caselets = generateLpCp04PermanentBatch(seed, count);

const lines: string[] = [
  "# LP CP04 Counterfactual / Additional-Condition Review Pack V3",
  "",
  `Authority: ${LP_CP04_ENGLISH_FREEZE_V1.authorityId}`,
  "Status: ENGLISH FROZEN — REVIEW ONLY",
  "Permanent QL: LP-QL-047",
  `Seed: ${seed}`,
  `Caselets: ${caselets.length}`,
  "",
  "> Review purpose: inspect the frozen English counterfactual/additional-condition family across Easy, Medium and Hard. Production remains blocked until localization and source-governance gates are separately completed.",
  "",
];

caselets.forEach((caselet: any, index) => {
  const child = caselet.counterfactualChild;
  const setupOnly = caselet.scenario.split("\n\n")[0]!;
  const topology = caselet.parentTopology ?? "LP-001_GROUPING";
  lines.push(`## Caselet ${index + 1} — ${caselet.difficultyBand}`);
  lines.push("");
  lines.push(`**Parent topology:** ${topology}`);
  lines.push(`**QL:** ${child.qlId}`);
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
