import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES } from "./wave5-prototypes";
import { GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE } from "./wave5-source-evidence";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-gap-remediation-wave5-review");
mkdirSync(outputDirectory, { recursive: true });
const questions = GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES.flatMap((prototype) =>
  ["a", "b", "c"].map((suffix) => prototype.generate(`wave5-${suffix}`)),
);

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave5-review.json"), `${jsonStringify({
  status: "SOURCE_GAP_REMEDIATION_WAVE5_REVIEW_CANDIDATE",
  authorityRevision: 3,
  rendererContract: "EXAMTREE_GEOMETRY_SVG_V2",
  sourceAudit: "GEO-SOURCE-SATURATION-AUDIT-V1",
  baselineTemporaryPrototypeCount: 38,
  wave1TemporaryPrototypeCount: 4,
  wave2TemporaryPrototypeCount: 3,
  wave3TemporaryPrototypeCount: 4,
  wave4TemporaryPrototypeCount: 2,
  wave5TemporaryPrototypeCount: 2,
  currentTemporaryPrototypeCount: 53,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  questionCount: questions.length,
  sourceEvidence: GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE,
  questions,
})}\n`, "utf8");

const markdown = [
  "# ExamTree Geometry — Source Gap Remediation Wave 5 Review",
  "",
  "**Scope:** GEO-CP-014 congruence + parallel synthesis.",
  "**Status:** review candidate only; not frozen or production eligible.",
  "**Current temporary prototypes:** 53  ",
  "**Permanent QLs:** 0  ",
  "**Frozen solve modes:** 0",
  "",
  "## Source evidence",
  ...GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE.map((source) => `- **${source.id}** — ${source.exam}, ${source.heldOn}: ${source.support}`),
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
    `- theorem trace: ${question.theoremTrace.join(" → ")}`,
    `- verifier: ${question.independentVerifierResult.passed ? "PASS" : "FAIL"}`,
    `- clue minimality: ${question.minimalityProof.passed ? "PASS" : "FAIL"}`,
    `- diagram fingerprint: ${question.diagramFingerprint}`,
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave5-review.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_GEO_GAP_REMEDIATION_WAVE5_REVIEW", prototypeCount: 2, questionCount: questions.length, outputDirectory }));
