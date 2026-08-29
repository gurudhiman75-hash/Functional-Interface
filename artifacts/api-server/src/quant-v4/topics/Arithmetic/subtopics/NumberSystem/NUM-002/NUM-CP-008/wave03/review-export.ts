import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP008_WAVE03_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave03 } from "./runtime.ts";

const reviewSeeds = [1, 62, 120] as const;
const rows = NUM_CP008_WAVE03_PROTOTYPE_IDS.flatMap((prototypeId) => reviewSeeds.map((seed) => generateNumCp008Wave03(prototypeId, seed)));

const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "num-002-cp008-wave03-review.json"), JSON.stringify(rows, null, 2));

const markdown: string[] = [
  "# NUM-CP-008 Wave 03 English Review Pack",
  "",
  `Questions: ${rows.length}`,
  "",
];

for (const q of rows) {
  markdown.push(`## ${q.temporaryPrototypeId} — seed ${q.seed} — ${q.difficulty}`);
  markdown.push("");
  markdown.push(q.stem);
  markdown.push("");
  q.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " **[correct]**" : ""}`));
  markdown.push("");
  markdown.push(`**Concept:** ${q.explanation.coreConcept}`);
  markdown.push("");
  markdown.push(`**Strategy:** ${q.explanation.strategy}`);
  markdown.push("");
  q.explanation.steps.forEach((step, index) => markdown.push(`${index + 1}. ${step}`));
  markdown.push("");
  markdown.push(`**Answer:** ${q.explanation.finalAnswer}`);
  markdown.push("");
}

writeFileSync(join(outDir, "num-002-cp008-wave03-review.md"), `${markdown.join("\n")}\n`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE03_REVIEW_EXPORT",
  questions: rows.length,
  prototypes: NUM_CP008_WAVE03_PROTOTYPE_IDS.length,
  seedsPerPrototype: reviewSeeds.length,
  json: "dist/quant-v4/num-002-cp008-wave03-review.json",
  markdown: "dist/quant-v4/num-002-cp008-wave03-review.md",
}, null, 2));
