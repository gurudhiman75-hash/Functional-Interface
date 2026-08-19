import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES } from "./wave2-prototypes";
import { GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE } from "./wave2-source-evidence";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-gap-remediation-wave2-review");
mkdirSync(outputDirectory, { recursive: true });

const questions = GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES.flatMap((prototype) =>
  Array.from({ length: 3 }, (_, index) => prototype.generate(`geo-gap-wave2-review:${prototype.temporaryPrototypeId}:${index}`)),
);

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave2-review.json"), `${jsonStringify({
  status: "SOURCE_GAP_REMEDIATION_WAVE2_REVIEW_CANDIDATE",
  authorityRevision: 3,
  rendererContract: "EXAMTREE_GEOMETRY_SVG_V2",
  sourceAudit: "GEO-SOURCE-SATURATION-AUDIT-V1",
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  temporaryPrototypeCount: GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES.length,
  questionCount: questions.length,
  sourceEvidence: GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE,
  questions,
})}\n`, "utf8");

const markdown = [
  "# ExamTree Geometry — Source Gap Remediation Wave 2 Review",
  "",
  "**Authority:** Composite Geometry Revision 3  ",
  "**Renderer:** EXAMTREE_GEOMETRY_SVG_V2",
  "",
  "**Status:** temporary executable source remediation; source saturation remains open.",
  "",
  "**Permanent QLs:** 0  ",
  "**Frozen solve modes:** 0  ",
  "**Question Studio / Question Bank / test / public:** locked",
  "",
  "## Source evidence",
  "",
  ...GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE.flatMap((source) => [
    `- **${source.id}** — ${source.exam}, ${source.heldOn}: ${source.support}`,
  ]),
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

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave2-review.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED_GEO_GAP_REMEDIATION_WAVE2_REVIEW",
  temporaryPrototypeCount: GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES.length,
  questionCount: questions.length,
  outputDirectory,
}));
