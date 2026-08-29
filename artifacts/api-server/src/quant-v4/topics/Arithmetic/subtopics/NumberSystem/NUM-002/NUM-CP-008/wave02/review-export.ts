import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP008_WAVE02_PROTOTYPE_IDS, type NumCp008Wave02PrototypeId } from "./types.ts";
import { generateNumCp008Wave02ReviewFinal } from "./runtime-review-final.ts";

const REVIEW_SEEDS: Readonly<Record<NumCp008Wave02PrototypeId, readonly [number, number, number]>> = Object.freeze({
  "NUM-CP008-PROT-009": [10, 11, 12],
  "NUM-CP008-PROT-010": [10, 11, 12],
  "NUM-CP008-PROT-011": [10, 11, 12],
  "NUM-CP008-PROT-012": [10, 11, 12],
  "NUM-CP008-PROT-013": [10, 11, 12],
  "NUM-CP008-PROT-014": [10, 11, 12],
  "NUM-CP008-PROT-015": [73, 74, 75],
  "NUM-CP008-PROT-016": [10, 11, 12],
});

const rows = NUM_CP008_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
  REVIEW_SEEDS[prototypeId].map((seed) => generateNumCp008Wave02ReviewFinal(prototypeId, seed))
);
if (rows.length !== 24) throw new Error(`Expected 24 review questions, got ${rows.length}`);

for (const prototypeId of NUM_CP008_WAVE02_PROTOTYPE_IDS) {
  const sample = rows.filter((row) => row.temporaryPrototypeId === prototypeId);
  if (sample.length !== 3) throw new Error(`${prototypeId}: expected three review rows`);
  if (new Set(sample.map((row) => row.difficulty)).size < 2) throw new Error(`${prototypeId}: review pack lacks difficulty breadth`);
}

const extrema = rows.filter((row) => row.temporaryPrototypeId === "NUM-CP008-PROT-009");
const directions = new Set(extrema.map((row) => String((row.hiddenState as Record<string, unknown>).direction)));
if (!directions.has("LEAST") || !directions.has("GREATEST")) throw new Error("P009 review pack must contain both extremum directions");

const triple = rows.find((row) => row.temporaryPrototypeId === "NUM-CP008-PROT-015" && row.seed === 73);
if (!triple) throw new Error("Missing P015 seed 73 review edge");
const tripleConstraints = (triple.hiddenState as Record<string, unknown>).constraints;
if (!Array.isArray(tripleConstraints)) throw new Error("P015 constraints missing");
const moduli = tripleConstraints.map((entry) => Number((entry as Record<string, unknown>).modulus));
const gcd = (a: number, b: number) => {
  let x = Math.abs(a); let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
};
if (!moduli.some((a, i) => moduli.some((b, j) => i < j && gcd(a, b) > 1))) {
  throw new Error("P015 review pack must contain a compatible non-coprime triple system");
}

const outDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "num-002-cp008-wave02-review.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");

const md: string[] = [
  "# NUM-CP-008 Wave 02 — Bounded / Inverse / Structured Discovery Review",
  "",
  "Discovery evidence only. Permanent QLs and all product-delivery gates remain closed.",
  "",
  "The retained sample spans difficulty bands and includes both bounded-extremum directions plus a compatible non-coprime three-congruence system.",
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

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE02_REVIEW_EXPORT_V2",
  questions: rows.length,
  prototypes: NUM_CP008_WAVE02_PROTOTYPE_IDS.length,
  seedsPerPrototype: 3,
  difficultyBreadthPerPrototype: true,
  bothBoundedExtremumDirections: true,
  compatibleNonCoprimeTripleReviewEdge: true,
}, null, 2));
