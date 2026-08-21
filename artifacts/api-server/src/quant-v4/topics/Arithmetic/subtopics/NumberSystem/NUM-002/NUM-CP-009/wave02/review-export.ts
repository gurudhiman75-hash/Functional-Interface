import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp009Wave02 } from "./runtime.ts";
import { NUM_CP009_WAVE02_PROTOTYPE_IDS } from "./types.ts";

const reviewSeeds = [8, 41, 97] as const;
const rows = NUM_CP009_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
  reviewSeeds.map((seed) => generateNumCp009Wave02(prototypeId, seed)),
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp009-wave02");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "review.json"), `${JSON.stringify({
  status: "NUM_CP009_WAVE02_REVIEW_CANDIDATE",
  questionCount: rows.length,
  rows,
}, null, 2)}\n`, "utf8");

const markdown = [
  "# NUM-CP-009 Wave 02 — English Review Candidate",
  "",
  "Temporary discovery prototypes only. Permanent QL allocation and delivery gates remain closed.",
  "",
  ...rows.flatMap((row) => [
    `## ${row.temporaryPrototypeId} · seed ${row.seed} · ${row.difficulty}`,
    "",
    row.stem,
    "",
    ...row.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}`),
    "",
    `**Correct:** ${String.fromCharCode(65 + row.correctIndex)}. ${row.canonicalAnswer}`,
    "",
    `**Concept:** ${row.explanation.coreConcept}`,
    "",
    `**How to solve:** ${row.explanation.strategy}`,
    "",
    ...row.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    `**Answer:** ${row.explanation.finalAnswer}`,
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(resolve(outputDirectory, "review.md"), `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP009_WAVE02_REVIEW_EXPORT",
  prototypes: NUM_CP009_WAVE02_PROTOTYPE_IDS.length,
  samplesPerPrototype: reviewSeeds.length,
  questionCount: rows.length,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-185",
}, null, 2));
