import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateNumCp011Wave03 } from "./runtime.ts";
import { NUM_CP011_WAVE03_PROTOTYPE_IDS } from "./types.ts";

const titles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-CP011-PROT-012": "Trailing zeroes of a factorial ratio",
  "NUM-CP011-PROT-013": "Trailing zeroes of a structured product",
});

const seeds = [9, 20, 31, 42] as const;
const lines: string[] = [
  "# ExamTree — NUM-CP-011 Wave 03 Review",
  "",
  "**Checkpoint:** Factorials, Prime Valuations and Trailing Zeroes",
  "",
  "**Status:** compound-zero and edge-convention discovery only",
  "",
  `**Temporary prototypes:** ${NUM_CP011_WAVE03_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${NUM_CP011_WAVE03_PROTOTYPE_IDS.length * seeds.length}`,
  "",
  "---",
  "",
];

for (const prototypeId of NUM_CP011_WAVE03_PROTOTYPE_IDS) {
  lines.push(`## ${prototypeId} — ${titles[prototypeId] ?? prototypeId}`, "");
  seeds.forEach((seed, sampleIndex) => {
    const q = generateNumCp011Wave03(prototypeId, seed);
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

const output = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/num-cp011-wave03-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE03_REVIEW_EXPORT",
  prototypes: NUM_CP011_WAVE03_PROTOTYPE_IDS.length,
  questions: NUM_CP011_WAVE03_PROTOTYPE_IDS.length * seeds.length,
  output,
}, null, 2));
