import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateNumCp011Wave01Human } from "./runtime-human.ts";
import { NUM_CP011_WAVE01_PROTOTYPE_IDS } from "./types.ts";

const titles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-CP011-PROT-001": "Prime valuation in n!",
  "NUM-CP011-PROT-002": "Prime valuation in a factorial ratio",
  "NUM-CP011-PROT-003": "Highest prime power dividing n!",
  "NUM-CP011-PROT-004": "Highest composite power dividing n!",
  "NUM-CP011-PROT-005": "Trailing zeroes of n! in base 10",
  "NUM-CP011-PROT-006": "Trailing zeroes of n! in another base",
  "NUM-CP011-PROT-007": "Least n reaching a prime-valuation target",
  "NUM-CP011-PROT-008": "Least n reaching a trailing-zero target",
});

const seeds = [31, 62, 93] as const;
const lines: string[] = [
  "# ExamTree — NUM-CP-011 Wave 01 Review",
  "",
  "**Checkpoint:** Factorials, Prime Valuations and Trailing Zeroes",
  "",
  "**Status:** ID-free discovery; Question Studio / Question Bank / test / public release remain OFF",
  "",
  `**Temporary prototypes:** ${NUM_CP011_WAVE01_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${NUM_CP011_WAVE01_PROTOTYPE_IDS.length * seeds.length}`,
  "",
  "---",
  "",
];

for (const prototypeId of NUM_CP011_WAVE01_PROTOTYPE_IDS) {
  lines.push(`## ${prototypeId} — ${titles[prototypeId] ?? prototypeId}`, "");
  seeds.forEach((seed, sampleIndex) => {
    const q = generateNumCp011Wave01Human(prototypeId, seed);
    lines.push(`### Q${sampleIndex + 1}`, "");
    lines.push(`**Difficulty:** ${q.difficulty}`, "");
    lines.push(q.stem, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.value}`));
    lines.push("");
    lines.push(`**Correct answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`, "");
    lines.push("**Explanation:**", "");
    lines.push(q.explanation.coreConcept, "");
    lines.push(q.explanation.strategy, "");
    q.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
    lines.push("", `**Final answer:** ${q.explanation.finalAnswer}`, "", "---", "");
  });
}

const output = resolve(process.cwd(), "dist/quant-v4/num-cp011-wave01-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE01_REVIEW_EXPORT",
  prototypes: NUM_CP011_WAVE01_PROTOTYPE_IDS.length,
  questions: NUM_CP011_WAVE01_PROTOTYPE_IDS.length * seeds.length,
  output,
}, null, 2));
