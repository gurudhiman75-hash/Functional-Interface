import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PHASE2_TEMPORARY_PROTOTYPES } from "./phase2-registry";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-phase2-review");
mkdirSync(outputDirectory, { recursive: true });
const questions = GEO_PHASE2_TEMPORARY_PROTOTYPES.flatMap((prototype) =>
  Array.from({ length: 3 }, (_, index) => prototype.generate(`geo-phase2-review:${prototype.temporaryPrototypeId}:${index}`)),
);

writeFileSync(resolve(outputDirectory, "geometry-phase2-review.json"), `${jsonStringify({
  status: "DISCOVERY_REVIEW_CANDIDATE_PHASE2_WAVE1",
  sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN",
  permanentQlCount: 0,
  temporaryPrototypeCount: GEO_PHASE2_TEMPORARY_PROTOTYPES.length,
  questionCount: questions.length,
  questions,
})}\n`, "utf8");

const markdown = [
  "# ExamTree Geometry — Phase 2 Temporary Prototype Review",
  "",
  "**Scope:** GEO-CP-004 congruence, GEO-CP-005 similarity, GEO-CP-006 triangle centres/bisectors/midpoints.",
  "",
  "**Status:** executable discovery Wave 1 for these checkpoints; external source saturation remains open.",
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
    `- proof events: ${question.proofEvents.map((event) => event.kind).join(", ")}`,
    `- clue minimality: ${question.minimalityProof.passed ? "PASS" : "FAIL"}`,
    `- independent verifier: ${question.independentVerifierResult.oracle} — ${question.independentVerifierResult.passed ? "PASS" : "FAIL"}`,
    `- misconception IDs: ${question.optionAnalysis.filter((option) => !option.correct).map((option) => option.misconceptionId).join(", ")}`,
    `- canonical fingerprint: ${question.canonicalGeometryFingerprint}`,
    question.stemSvg ? "- semantic SVG: present in JSON evidence" : "- semantic SVG: not required",
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-phase2-review.md"), `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "EXPORTED_GEO_PHASE2_REVIEW",
  temporaryPrototypeCount: GEO_PHASE2_TEMPORARY_PROTOTYPES.length,
  questionCount: questions.length,
  outputDirectory,
}));
