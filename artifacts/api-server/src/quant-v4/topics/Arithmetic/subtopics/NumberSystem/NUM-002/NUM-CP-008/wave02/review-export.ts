import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP008_WAVE02_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave02 } from "./runtime.ts";

const REVIEW_SEEDS = [10, 37, 73] as const;
const rows = NUM_CP008_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) => REVIEW_SEEDS.map((seed) => generateNumCp008Wave02(prototypeId, seed)));
if (rows.length !== 24) throw new Error(`Expected 24 review questions, got ${rows.length}`);

const outDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "num-002-cp008-wave02-review.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");

const md: string[] = [
  "# NUM-CP-008 Wave 02 — Bounded / Inverse / Structured Discovery Review",
  "",
  "Discovery evidence only. Permanent QLs and all product-delivery gates remain closed.",
  "",
];
for (const row of rows) {
  md.push(`## ${row.temporaryPrototypeId} · seed ${row.seed} · ${row.difficulty}`, "", `**Question:** ${row.stem}`, "");
  row.options.forEach((option, index) => md.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`));
  md.push("", `**Answer:** ${row.canonicalAnswer}`, "", `**Concept:** ${row.explanation.coreConcept}`, "", `**Strategy:** ${row.explanation.strategy}`, "", "**Working:**");
  row.explanation.steps.forEach((step, index) => md.push(`${index + 1}. ${step}`));
  md.push("", `**State:** \`${JSON.stringify(row.hiddenState)}\``, "", "---", "");
}
writeFileSync(resolve(outDir, "num-002-cp008-wave02-review.md"), `${md.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ status: "PASS_NUM_CP008_WAVE02_REVIEW_EXPORT", questions: rows.length, prototypes: NUM_CP008_WAVE02_PROTOTYPE_IDS.length, seedsPerPrototype: REVIEW_SEEDS.length }, null, 2));
