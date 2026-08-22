import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateNumCp010Wave02 } from "./runtime.ts";
import { NUM_CP010_WAVE02_PROTOTYPE_IDS } from "./types.ts";

const titles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-CP010-PROT-009": "Recover digit from place value",
  "NUM-CP010-PROT-010": "Recover decimal position from place value",
  "NUM-CP010-PROT-011": "Chained carry addition",
  "NUM-CP010-PROT-012": "Chained borrow subtraction",
  "NUM-CP010-PROT-013": "Least/greatest number under digit relations",
  "NUM-CP010-PROT-014": "Complete valid digit set",
  "NUM-CP010-PROT-015": "Bounded digit occurrence",
  "NUM-CP010-PROT-016": "Five-digit palindrome reconstruction",
  "NUM-CP010-PROT-017": "Exact number of digits",
});

const seeds = [7, 18, 29] as const;
const lines: string[] = [
  "# ExamTree — NUM-CP-010 Wave 02 Review",
  "",
  "**Checkpoint:** Digit Structure, Place Value and Number Reconstruction",
  "",
  "**Status:** stacked ID-free discovery; no Question Studio / Question Bank / test / public release",
  "",
  `**Temporary Wave 02 prototypes:** ${NUM_CP010_WAVE02_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${NUM_CP010_WAVE02_PROTOTYPE_IDS.length * seeds.length}`,
  "",
  "---",
  "",
];

for (const prototypeId of NUM_CP010_WAVE02_PROTOTYPE_IDS) {
  lines.push(`## ${prototypeId} — ${titles[prototypeId] ?? prototypeId}`, "");
  seeds.forEach((seed, sampleIndex) => {
    const q = generateNumCp010Wave02(prototypeId, seed);
    lines.push(`### Q${sampleIndex + 1}`, "");
    lines.push(`**Difficulty:** ${q.difficulty}`, "");
    lines.push(q.stem, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.value}`));
    lines.push("");
    lines.push(`**Correct answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`, "");
    lines.push("**Explanation:**", "");
    lines.push(`- ${q.explanation.coreConcept}`);
    lines.push(`- ${q.explanation.strategy}`);
    q.explanation.steps.forEach((step) => lines.push(`- ${step}`));
    lines.push("", `**Final answer:** ${q.canonicalAnswer}`, "", "---", "");
  });
}

const output = resolve(process.cwd(), "dist/quant-v4/num-cp010-wave02-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_WAVE02_REVIEW_EXPORT",
  prototypes: NUM_CP010_WAVE02_PROTOTYPE_IDS.length,
  questions: NUM_CP010_WAVE02_PROTOTYPE_IDS.length * seeds.length,
  output,
}, null, 2));
