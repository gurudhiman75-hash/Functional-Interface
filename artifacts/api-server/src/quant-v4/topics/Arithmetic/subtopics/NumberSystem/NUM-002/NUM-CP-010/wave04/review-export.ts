import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateNumCp010Wave04 } from "./runtime.ts";

const seeds = [7, 18, 29] as const;
const lines: string[] = [
  "# ExamTree — NUM-CP-010 Wave 04 Saturation Review",
  "",
  "**Prototype:** P026 — bounded occurrence of digit 0",
  "",
  "**Purpose:** prove the leading-zero exclusion branch before final merge/split.",
  "",
  "---",
  "",
];

for (const [index, seed] of seeds.entries()) {
  const q = generateNumCp010Wave04("NUM-CP010-PROT-026", seed);
  lines.push(`## Q${index + 1}`, "", q.stem, "");
  q.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.value}`));
  lines.push("", `**Correct answer:** ${q.canonicalAnswer}`, "", "**Explanation:**", "");
  lines.push(`- ${q.explanation.coreConcept}`, `- ${q.explanation.strategy}`);
  q.explanation.steps.forEach((step) => lines.push(`- ${step}`));
  lines.push("", `**Final answer:** ${q.canonicalAnswer}`, "", "---", "");
}

const output = resolve(process.cwd(), "dist/quant-v4/num-cp010-wave04-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS_NUM_CP010_WAVE04_REVIEW_EXPORT", questions: seeds.length, output }, null, 2));
