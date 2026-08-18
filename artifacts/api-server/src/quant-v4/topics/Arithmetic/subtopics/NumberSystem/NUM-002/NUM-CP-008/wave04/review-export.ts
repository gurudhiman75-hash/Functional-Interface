import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP008_WAVE04_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave04 } from "./runtime.ts";

const seeds = [1, 62, 120] as const;
const rows = NUM_CP008_WAVE04_PROTOTYPE_IDS.flatMap((prototypeId) =>
  seeds.map((seed) => generateNumCp008Wave04(prototypeId, seed)),
);

const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "num-002-cp008-wave04-review.json"), JSON.stringify(rows, null, 2));

const lines: string[] = ["# NUM-CP-008 Wave 04 Source-Gap Review", "", `Questions: ${rows.length}`, ""];
for (const q of rows) {
  lines.push(`## ${q.temporaryPrototypeId} - seed ${q.seed} - ${q.difficulty}`, "", q.stem, "");
  q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " [correct]" : ""}`));
  lines.push("", `Concept: ${q.explanation.coreConcept}`, "", `Strategy: ${q.explanation.strategy}`, "");
  q.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
  lines.push("", `Answer: ${q.explanation.finalAnswer}`, "");
}
writeFileSync(join(outDir, "num-002-cp008-wave04-review.md"), `${lines.join("\n")}\n`);

console.log(JSON.stringify({ status: "PASS_NUM_CP008_WAVE04_REVIEW_EXPORT", questions: rows.length }, null, 2));
