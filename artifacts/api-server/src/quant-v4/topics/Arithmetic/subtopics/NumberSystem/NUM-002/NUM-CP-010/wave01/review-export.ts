import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateNumCp010Wave01 } from "./runtime.ts";
import { NUM_CP010_WAVE01_PROTOTYPE_IDS } from "./types.ts";

const titles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-CP010-PROT-001": "Place value of a digit",
  "NUM-CP010-PROT-002": "Missing digit from digit sum",
  "NUM-CP010-PROT-003": "Two-digit reversal reconstruction",
  "NUM-CP010-PROT-004": "Three-digit reversal reconstruction",
  "NUM-CP010-PROT-005": "Missing digit in addition",
  "NUM-CP010-PROT-006": "Missing digit in subtraction",
  "NUM-CP010-PROT-007": "Palindrome reconstruction",
  "NUM-CP010-PROT-008": "Consecutive-digit reconstruction",
});

const seeds = [7, 18, 29] as const;
const lines: string[] = [
  "# ExamTree — NUM-CP-010 Wave 01 Review",
  "",
  "**Checkpoint:** Digit Structure, Place Value and Number Reconstruction",
  "",
  "**Status:** ID-free discovery; no Question Studio / Question Bank / test / public release",
  "",
  `**Temporary prototypes:** ${NUM_CP010_WAVE01_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${NUM_CP010_WAVE01_PROTOTYPE_IDS.length * seeds.length}`,
  "",
  "---",
  "",
];

for (const prototypeId of NUM_CP010_WAVE01_PROTOTYPE_IDS) {
  lines.push(`## ${prototypeId} — ${titles[prototypeId] ?? prototypeId}`, "");
  seeds.forEach((seed, sampleIndex) => {
    const q = generateNumCp010Wave01(prototypeId, seed);
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

const output = resolve(process.cwd(), "dist/quant-v4/num-cp010-wave01-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_WAVE01_REVIEW_EXPORT",
  prototypes: NUM_CP010_WAVE01_PROTOTYPE_IDS.length,
  questions: NUM_CP010_WAVE01_PROTOTYPE_IDS.length * seeds.length,
  output,
}, null, 2));
