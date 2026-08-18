import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP008_WAVE03_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave03Reviewed } from "./runtime-review-final.ts";

const reviewSeeds = [1, 62, 120] as const;
const rows = NUM_CP008_WAVE03_PROTOTYPE_IDS.flatMap((prototypeId) => reviewSeeds.map((seed) => generateNumCp008Wave03Reviewed(prototypeId, seed)));

const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "num-002-cp008-wave03-review-final.json"), JSON.stringify(rows, null, 2));

const markdown: string[] = ["# NUM-CP-008 Wave 03 Final English Review Pack", "", `Questions: ${rows.length}`, ""];
for (const q of rows) {
  markdown.push(`## ${q.temporaryPrototypeId} — seed ${q.seed} — ${q.difficulty}`, "", q.stem, "");
  q.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " **[correct]**" : ""}`));
  markdown.push("", `**Concept:** ${q.explanation.coreConcept}`, "", `**Strategy:** ${q.explanation.strategy}`, "");
  q.explanation.steps.forEach((step, index) => markdown.push(`${index + 1}. ${step}`));
  markdown.push("", `**Answer:** ${q.explanation.finalAnswer}`, "");
}
writeFileSync(join(outDir, "num-002-cp008-wave03-review-final.md"), `${markdown.join("\n")}\n`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE03_FINAL_REVIEW_EXPORT",
  questions: rows.length,
  prototypes: NUM_CP008_WAVE03_PROTOTYPE_IDS.length,
  seedsPerPrototype: reviewSeeds.length,
}, null, 2));
