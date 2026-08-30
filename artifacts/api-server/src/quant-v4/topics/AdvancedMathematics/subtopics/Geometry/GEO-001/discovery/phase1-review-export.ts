import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PHASE1_TEMPORARY_PROTOTYPES } from "./phase1-registry";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-phase1-review");
mkdirSync(outputDirectory, { recursive: true });
const questions = GEO_PHASE1_TEMPORARY_PROTOTYPES.flatMap((prototype) =>
  Array.from({ length: 3 }, (_, index) => prototype.generate(`geo-phase1-review:${prototype.temporaryPrototypeId}:${index}`)),
);

writeFileSync(resolve(outputDirectory, "geometry-phase1-review.json"), `${jsonStringify({
  status: "DISCOVERY_REVIEW_CANDIDATE_WAVE1",
  sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN",
  permanentQlCount: 0,
  questionCount: questions.length,
  questions,
})}\n`, "utf8");

const markdown = [
  "# ExamTree Geometry — Phase 1 Temporary Prototype Review",
  "",
  "**Status:** executable discovery Wave 1; external source audit remains open.",
  "",
  "**Permanent QLs:** 0",
  "",
  "**Question Studio / Question Bank / test / public:** locked",
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.temporaryPrototypeId}`,
    "",
    `**CP:** ${question.cpId}  `,
    `**Solve mode:** ${question.solveMode}  `,
    `**Seed:** ${question.seed}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### Explanation",
    "",
    ...question.explanation.lines,
    "",
    "### Reviewer evidence",
    "",
    `- theorem trace: ${question.theoremTrace.join(" → ")}`,
    `- clue minimality: ${question.minimalityProof.passed ? "PASS" : "FAIL"}`,
    `- independent verifier: ${question.independentVerifierResult.oracle} — ${question.independentVerifierResult.passed ? "PASS" : "FAIL"}`,
    `- misconception IDs: ${question.optionAnalysis.filter((option) => !option.correct).map((option) => option.misconceptionId).join(", ")}`,
    `- canonical fingerprint: ${question.canonicalGeometryFingerprint}`,
    question.stemSvg ? "- semantic SVG: present in JSON evidence" : "- semantic SVG: not required for this prototype",
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-phase1-review.md"), `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "EXPORTED_GEO_PHASE1_REVIEW",
  temporaryPrototypeCount: GEO_PHASE1_TEMPORARY_PROTOTYPES.length,
  questionCount: questions.length,
  outputDirectory,
}));
