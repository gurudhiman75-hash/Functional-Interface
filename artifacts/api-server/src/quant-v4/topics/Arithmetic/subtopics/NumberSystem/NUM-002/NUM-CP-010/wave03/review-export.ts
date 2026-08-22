import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateNumCp010Wave03 } from "./runtime.ts";
import { NUM_CP010_WAVE03_PROTOTYPE_IDS } from "./types.ts";

const titles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-CP010-PROT-018": "Classify number of digit solutions",
  "NUM-CP010-PROT-019": "Complete set of valid numbers",
  "NUM-CP010-PROT-020": "Two unknown digits in addition",
  "NUM-CP010-PROT-021": "Missing digit in multiplication",
  "NUM-CP010-PROT-022": "Repeated decimal block reconstruction",
  "NUM-CP010-PROT-023": "Reversal when a trailing zero becomes leading zero",
  "NUM-CP010-PROT-024": "Consecutive decreasing digits",
  "NUM-CP010-PROT-025": "Digital root",
});

const seeds = [7, 18, 29] as const;
const lines: string[] = [
  "# ExamTree — NUM-CP-010 Wave 03 Review",
  "",
  "**Checkpoint:** Digit Structure, Place Value and Number Reconstruction",
  "",
  "**Status:** stacked ID-free discovery; no Question Studio / Question Bank / test / public release",
  "",
  `**Temporary Wave 03 prototypes:** ${NUM_CP010_WAVE03_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${NUM_CP010_WAVE03_PROTOTYPE_IDS.length * seeds.length}`,
  "",
  "---",
  "",
];

for (const prototypeId of NUM_CP010_WAVE03_PROTOTYPE_IDS) {
  lines.push(`## ${prototypeId} — ${titles[prototypeId] ?? prototypeId}`, "");
  seeds.forEach((seed, sampleIndex) => {
    const q = generateNumCp010Wave03(prototypeId, seed);
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

const output = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/num-cp010-wave03-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_WAVE03_REVIEW_EXPORT",
  prototypes: NUM_CP010_WAVE03_PROTOTYPE_IDS.length,
  questions: NUM_CP010_WAVE03_PROTOTYPE_IDS.length * seeds.length,
  output,
}, null, 2));
