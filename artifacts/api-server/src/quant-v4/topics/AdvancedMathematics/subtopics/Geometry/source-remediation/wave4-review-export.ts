import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES } from "./wave4-prototypes";
import { GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE } from "./wave4-source-evidence";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-gap-remediation-wave4-review");
mkdirSync(outputDirectory, { recursive: true });

const seeds = ["wave4-a", "wave4-b", "wave4-c"] as const;
const questions = GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES.flatMap((prototype) => seeds.map((seed) => prototype.generate(seed)));

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave4-review.json"), `${jsonStringify({
  status: "SOURCE_GAP_REMEDIATION_WAVE4_REVIEW_CANDIDATE",
  authorityRevision: 3,
  sourceAudit: "GEO-SOURCE-SATURATION-AUDIT-V1",
  scope: "GEO-CP-005 perimeter-ratio similarity linear scale",
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  baselineTemporaryPrototypeCount: 38,
  wave1TemporaryPrototypeCount: 4,
  wave2TemporaryPrototypeCount: 3,
  wave3TemporaryPrototypeCount: 4,
  wave4TemporaryPrototypeCount: GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES.length,
  currentTemporaryPrototypeCount: 51,
  diagramPolicy: "NO_DIAGRAM for both Wave-4 archetypes because all correspondence and metric evidence is unambiguous in prose",
  questionCount: questions.length,
  sourceEvidence: GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE,
  questions,
})}\n`, "utf8");

const markdown = [
  "# ExamTree Geometry — Source Gap Remediation Wave 4 Review",
  "",
  "**Authority:** Composite Geometry Revision 3",
  "",
  "**Scope:** GEO-CP-005 perimeter-ratio similarity linear scale.",
  "",
  "**Diagram policy:** NO_DIAGRAM. The correspondence and all numeric evidence are explicit in prose, so a triangle sketch would be redundant rather than semantic evidence.",
  "",
  "**Status:** temporary executable source remediation; source saturation remains open.",
  "",
  "**Current temporary prototypes:** 51  ",
  "**Permanent QLs:** 0  ",
  "**Frozen solve modes:** 0  ",
  "**Question Studio / Question Bank / test / public:** locked",
  "",
  "## Source evidence",
  "",
  ...GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE.map((source) => `- **${source.id}** — ${source.exam}, ${source.heldOn}: ${source.support}`),
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

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave4-review.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED_GEO_GAP_REMEDIATION_WAVE4_REVIEW",
  temporaryPrototypeCount: GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES.length,
  questionCount: questions.length,
  outputDirectory,
}));
