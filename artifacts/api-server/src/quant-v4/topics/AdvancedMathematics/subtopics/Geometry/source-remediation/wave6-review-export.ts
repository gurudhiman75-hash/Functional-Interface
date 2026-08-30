import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES } from "./wave6-prototypes";
import { GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE } from "./wave6-source-evidence";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-gap-remediation-wave6-review");
mkdirSync(outputDirectory, { recursive: true });
const questions = GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES.flatMap((prototype) =>
  ["a", "b", "c"].map((suffix) => prototype.generate(`wave6-${suffix}`)),
);

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave6-review.json"), `${jsonStringify({
  status: "SOURCE_GAP_REMEDIATION_WAVE6_REVIEW_CANDIDATE",
  authorityRevision: 3,
  solutionDiagramDimensionPolicySha256: "be0d398452b934b98adeaea0319722b74f1046ea810da612ab080d8c26011dcb",
  rendererContract: "EXAMTREE_GEOMETRY_SVG_V2",
  sourceAudit: "GEO-SOURCE-SATURATION-AUDIT-V1",
  baselineTemporaryPrototypeCount: 38,
  wave1TemporaryPrototypeCount: 4,
  wave2TemporaryPrototypeCount: 3,
  wave3TemporaryPrototypeCount: 4,
  wave4TemporaryPrototypeCount: 2,
  wave5TemporaryPrototypeCount: 2,
  wave6TemporaryPrototypeCount: 4,
  currentTemporaryPrototypeCount: 57,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  questionCount: questions.length,
  stemFigureCount: questions.filter((question) => Boolean(question.stemSvg)).length,
  solutionFigureCount: questions.length,
  sourceEvidence: GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE,
  questions,
})}\n`, "utf8");

const markdown = [
  "# ExamTree Geometry — Source Gap Remediation Wave 6 Review",
  "",
  "**Scope:** GEO-CP-006 residual perpendicular-bisector, centroid inverse and midpoint-converse gaps.",
  "**Status:** review candidate only; not frozen or production eligible.",
  "**Representation:** 3 REQUIRED_BOTH prototypes + 1 REQUIRED_SOLUTION_DIAGRAM prototype under the Revision-3 solution-diagram dimension policy.",
  "**Current temporary prototypes:** 57  ",
  "**Permanent QLs:** 0  ",
  "**Frozen solve modes:** 0",
  "",
  "## Source evidence",
  ...GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE.map((source) => `- **${source.id}** — ${source.exam}, ${source.heldOn}: ${source.support}`),
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.temporaryPrototypeId}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    ...question.explanation.lines,
    "",
    `- diagram disposition: ${question.diagramDisposition}`,
    `- theorem trace: ${question.theoremTrace.join(" → ")}`,
    `- verifier: ${question.independentVerifierResult.passed ? "PASS" : "FAIL"}`,
    `- clue minimality: ${question.minimalityProof.passed ? "PASS" : "FAIL"}`,
    `- stem diagram fingerprint: ${question.diagramFingerprint ?? "NO_STEM_DIAGRAM"}`,
    `- solution diagram fingerprint: ${question.solutionDiagramFingerprint}`,
    "",
    "---",
    "",
  ]),
].join("\n");

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave6-review.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED_GEO_GAP_REMEDIATION_WAVE6_REVIEW",
  prototypeCount: 4,
  questionCount: questions.length,
  stemFigureCount: questions.filter((question) => Boolean(question.stemSvg)).length,
  solutionFigureCount: questions.length,
  outputDirectory,
}));
