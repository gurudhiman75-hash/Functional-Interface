import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateNumCp011Wave04 } from "./runtime.ts";
import { NUM_CP011_WAVE04_PROTOTYPE_IDS } from "./types.ts";

const titles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-CP011-PROT-014": "Statement / claim evaluation",
  "NUM-CP011-PROT-015": "Data sufficiency over valuation thresholds",
});

const seeds = [10, 21, 32, 43, 54] as const;
const lines: string[] = [
  "# ExamTree — NUM-CP-011 Wave 04 Review",
  "",
  "**Checkpoint:** Factorials, Prime Valuations and Trailing Zeroes",
  "",
  "**Status:** final representation and saturation discovery; no permanent QL allocation yet",
  "",
  `**Temporary prototypes:** ${NUM_CP011_WAVE04_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${NUM_CP011_WAVE04_PROTOTYPE_IDS.length * seeds.length}`,
  "",
  "---",
  "",
];

for (const prototypeId of NUM_CP011_WAVE04_PROTOTYPE_IDS) {
  lines.push(`## ${prototypeId} — ${titles[prototypeId] ?? prototypeId}`, "");
  seeds.forEach((seed, sampleIndex) => {
    const q = generateNumCp011Wave04(prototypeId, seed);
    lines.push(`### Q${sampleIndex + 1}`, "");
    lines.push(`**Difficulty:** ${q.difficulty}`, "");
    lines.push(q.stem, "");
    q.statements.forEach((statement) => lines.push(`- ${statement}`));
    lines.push("");
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

const output = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/num-cp011-wave04-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE04_REVIEW_EXPORT",
  prototypes: NUM_CP011_WAVE04_PROTOTYPE_IDS.length,
  questions: NUM_CP011_WAVE04_PROTOTYPE_IDS.length * seeds.length,
  output,
}, null, 2));
