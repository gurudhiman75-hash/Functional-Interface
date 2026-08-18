import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PHASE3_TEMPORARY_PROTOTYPES } from "./phase3-registry";

const stringify = (value: unknown) => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-phase3-review");
mkdirSync(outputDirectory, { recursive: true });
const questions = GEO_PHASE3_TEMPORARY_PROTOTYPES.flatMap((prototype) =>
  Array.from({ length: 3 }, (_, index) => prototype.generate(`geo-phase3-review:${prototype.temporaryPrototypeId}:${index}`)),
);
writeFileSync(resolve(outputDirectory, "geometry-phase3-review.json"), `${stringify({
  status: "DISCOVERY_REVIEW_CANDIDATE_PHASE3_WAVE1",
  sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN",
  permanentQlCount: 0,
  temporaryPrototypeCount: GEO_PHASE3_TEMPORARY_PROTOTYPES.length,
  questionCount: questions.length,
  questions,
})}\n`, "utf8");
const markdown = [
  "# ExamTree Geometry — Phase 3 Temporary Prototype Review",
  "",
  "**Scope:** GEO-CP-007 right triangles, GEO-CP-008 quadrilaterals, GEO-CP-009 polygons.",
  "",
  "**Status:** executable discovery Wave 1; external source saturation remains open.",
  "",
  "**Permanent QLs:** 0",
  "",
  ...questions.flatMap((q, index) => [
    `## ${index + 1}. ${q.temporaryPrototypeId}`,
    "", `**CP:** ${q.cpId}  `, `**Solve mode:** ${q.solveMode}  `, `**Seed:** ${q.seed}`, "",
    q.stem, "", ...q.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`), "",
    `**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.answer}`, "", "### Explanation", "", ...q.explanation.lines, "",
    "### Reviewer evidence", "",
    `- theorem trace: ${q.theoremTrace.join(" → ")}`,
    `- proof events: ${q.proofEvents.map((event) => event.kind).join(", ") || "none required"}`,
    `- clue minimality: ${q.minimalityProof.passed ? "PASS" : "FAIL"}`,
    `- independent verifier: ${q.independentVerifierResult.oracle} — ${q.independentVerifierResult.passed ? "PASS" : "FAIL"}`,
    `- misconception IDs: ${q.optionAnalysis.filter((option) => !option.correct).map((option) => option.misconceptionId).join(", ")}`,
    `- canonical fingerprint: ${q.canonicalGeometryFingerprint}`,
    q.stemSvg ? "- semantic SVG: present in JSON evidence" : "- semantic SVG: not required",
    "", "---", "",
  ]),
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-phase3-review.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_GEO_PHASE3_REVIEW", temporaryPrototypeCount: GEO_PHASE3_TEMPORARY_PROTOTYPES.length, questionCount: questions.length, outputDirectory }));
