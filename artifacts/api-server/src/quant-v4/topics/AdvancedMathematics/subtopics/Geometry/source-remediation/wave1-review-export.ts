import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES } from "./wave1-prototypes";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-gap-remediation-wave1-review");
mkdirSync(outputDirectory, { recursive: true });

const questions = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES.flatMap((prototype) =>
  Array.from({ length: 3 }, (_, index) => prototype.generate(`geo-gap-wave1-review:${prototype.temporaryPrototypeId}:${index}`)),
);

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave1-review.json"), `${jsonStringify({
  status: "SOURCE_GAP_REMEDIATION_WAVE1_REVIEW_CANDIDATE",
  authorityRevision: 3,
  sourceAudit: "GEO-SOURCE-SATURATION-AUDIT-V1",
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  temporaryPrototypeCount: GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES.length,
  questionCount: questions.length,
  questions,
})}\n`, "utf8");

const markdown = [
  "# ExamTree Geometry — Source Gap Remediation Wave 1 Review",
  "",
  "**Authority:** Composite Geometry Revision 3",
  "",
  "**Status:** temporary executable remediation after Source Saturation Audit V1; source saturation remains open.",
  "",
  "**Permanent QLs:** 0  ",
  "**Frozen solve modes:** 0  ",
  "**Question Studio / Question Bank / test / public:** locked",
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.temporaryPrototypeId}`,
    "",
    `**Checkpoint:** ${question.cpId}  `,
    `**Source gap:** ${question.sourceGapId}  `,
    `**Diagram disposition:** ${question.diagramDisposition}  `,
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
    `- source evidence IDs: ${question.sourceEvidenceIds.join(", ")}`,
    `- theorem trace: ${question.theoremTrace.join(" → ")}`,
    `- clue minimality: ${question.minimalityProof.passed ? "PASS" : "FAIL"}`,
    `- independent verifier: ${question.independentVerifierResult.oracle} — ${question.independentVerifierResult.passed ? "PASS" : "FAIL"}`,
    `- diagram fingerprint: ${question.diagramFingerprint ?? "NO_DIAGRAM"}`,
    `- misconception IDs: ${question.optionAnalysis.filter((option) => !option.correct).map((option) => option.misconceptionId).join(", ")}`,
    `- canonical fingerprint: ${question.canonicalGeometryFingerprint}`,
    "",
    "---",
    "",
  ]),
].join("\n");

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave1-review.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED_GEO_GAP_REMEDIATION_WAVE1_REVIEW",
  temporaryPrototypeCount: GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES.length,
  questionCount: questions.length,
  outputDirectory,
}));
