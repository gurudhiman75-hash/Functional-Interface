import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP008_WAVE01_PROTOTYPE_IDS, type NumCp008Wave01PrototypeId } from "./types.ts";
import { generateNumCp008Wave01ReviewFinal } from "./runtime-review-final.ts";

const REVIEW_SEEDS: Readonly<Record<NumCp008Wave01PrototypeId, readonly [number, number, number]>> = Object.freeze({
  "NUM-CP008-PROT-001": [10, 11, 37],
  "NUM-CP008-PROT-002": [11, 37, 73],
  "NUM-CP008-PROT-003": [11, 17, 37],
  "NUM-CP008-PROT-004": [11, 37, 73],
  "NUM-CP008-PROT-005": [11, 37, 73],
  "NUM-CP008-PROT-006": [11, 37, 73],
  "NUM-CP008-PROT-007": [10, 11, 37],
  "NUM-CP008-PROT-008": [11, 37, 73],
});

const rows = NUM_CP008_WAVE01_PROTOTYPE_IDS.flatMap((prototypeId) =>
  REVIEW_SEEDS[prototypeId].map((seed) => generateNumCp008Wave01ReviewFinal(prototypeId, seed))
);

if (rows.length !== 24) throw new Error(`Expected 24 review questions, got ${rows.length}`);
if (new Set(rows.map((row) => `${row.temporaryPrototypeId}:${row.seed}`)).size !== rows.length) {
  throw new Error("Duplicate review identity");
}

const p001Edge = rows.find((row) => row.temporaryPrototypeId === "NUM-CP008-PROT-001" && row.seed === 10);
if (!p001Edge || Number((p001Edge.hiddenState as Record<string, unknown>).raw) >= 0 || Number((p001Edge.hiddenState as Record<string, unknown>).residue) !== 0) {
  throw new Error("Review pack must contain the negative raw / residue-zero normalization edge");
}
const p003Edge = rows.find((row) => row.temporaryPrototypeId === "NUM-CP008-PROT-003" && row.seed === 17);
if (!p003Edge || Number((p003Edge.hiddenState as Record<string, unknown>).exponent) !== 0) {
  throw new Error("Review pack must contain exponent-zero power remainder");
}
const p007Edge = rows.find((row) => row.temporaryPrototypeId === "NUM-CP008-PROT-007" && row.seed === 10);
if (!p007Edge || Number((p007Edge.hiddenState as Record<string, unknown>).gcd) <= 1) {
  throw new Error("Review pack must contain compatible non-coprime CRT");
}

const outDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outDir, { recursive: true });

const jsonPath = resolve(outDir, "num-002-cp008-wave01-review.json");
writeFileSync(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

function csv(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const csvLines = [
  ["prototypeId", "seed", "difficulty", "answerSemantic", "representation", "stem", "options", "answer", "coreConcept", "strategy", "steps", "hiddenState"].map(csv).join(","),
  ...rows.map((row) => [
    row.temporaryPrototypeId,
    row.seed,
    row.difficulty,
    row.answerSemantic,
    row.representation,
    row.stem,
    row.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}`).join(" | "),
    row.canonicalAnswer,
    row.explanation.coreConcept,
    row.explanation.strategy,
    row.explanation.steps.join(" | "),
    row.hiddenState,
  ].map(csv).join(",")),
];
writeFileSync(resolve(outDir, "num-002-cp008-wave01-review.csv"), `${csvLines.join("\n")}\n`, "utf8");

const markdown: string[] = [
  "# NUM-CP-008 Wave 01 — English Discovery Review",
  "",
  "**Status:** discovery evidence only; no permanent QLs or delivery activation.",
  "",
  `Questions: ${rows.length} (8 temporary prototypes × 3 deterministic, outcome-stratified states)`,
  "",
  "Required review edges: negative raw + zero residue, exponent zero, compatible non-coprime CRT.",
  "",
];
for (const row of rows) {
  markdown.push(`## ${row.temporaryPrototypeId} · seed ${row.seed} · ${row.difficulty}`);
  markdown.push("");
  markdown.push(`**Question:** ${row.stem}`);
  markdown.push("");
  row.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`));
  markdown.push("");
  markdown.push(`**Answer:** ${row.canonicalAnswer}`);
  markdown.push("");
  markdown.push(`**Concept:** ${row.explanation.coreConcept}`);
  markdown.push("");
  markdown.push(`**Strategy:** ${row.explanation.strategy}`);
  markdown.push("");
  markdown.push("**Working:**");
  row.explanation.steps.forEach((step, index) => markdown.push(`${index + 1}. ${step}`));
  markdown.push("");
  markdown.push(`**State:** \`${JSON.stringify(row.hiddenState)}\``);
  markdown.push("");
}
writeFileSync(resolve(outDir, "num-002-cp008-wave01-review.md"), `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE01_REVIEW_EXPORT_V2",
  questions: rows.length,
  prototypes: NUM_CP008_WAVE01_PROTOTYPE_IDS.length,
  seedsPerPrototype: 3,
  reviewEdgeCoverage: {
    negativeRawAndZeroResidue: true,
    exponentZero: true,
    compatibleNonCoprimeCrt: true,
  },
  jsonPath,
  csvPath: resolve(outDir, "num-002-cp008-wave01-review.csv"),
  markdownPath: resolve(outDir, "num-002-cp008-wave01-review.md"),
}, null, 2));
