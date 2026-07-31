import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP007_PROTOTYPES } from "./cluster-domain";
import { generateClsCp007QualityQuestion } from "./quality-runtime-final";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp007-review",
);
const rows = CLS_CP007_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  ([4, 5] as const).flatMap((optionCount) =>
    Array.from({ length: 2 }, (_, offset) =>
      generateClsCp007QualityQuestion(
        prototype.prototypeId,
        prototypeIndex * 1_000 + optionCount * 100 + offset * 37,
        optionCount,
      ),
    ),
  ),
);

const markdown = [
  "# CLS-CP-007 Letter-Cluster Classification Discovery Review",
  "",
  `Questions: ${rows.length}`,
  `Temporary prototypes: ${CLS_CP007_PROTOTYPES.length}`,
  "Permanent QLs: 0",
  "Locale: en-IN discovery only",
  "Presentation: source-shaped close distractors with explicit match/fail conclusions",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} · ${question.difficulty} · ${question.clusterLength} letters · ${question.options.length} options`,
    "",
    `**Question:** ${question.stem}`,
    "",
    "**Options:**",
    "",
    ...question.options.map(
      (option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`,
    ),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### 📌 Core Concept",
    "",
    question.explanation.coreConcept.join(" "),
    "",
    "### 📝 Check the Options",
    "",
    ...question.explanation.stepByStep.map(
      (step, stepIndex) => `${stepIndex + 1}. ${step}`,
    ),
    "",
    "### ⚡ Exam Speed Shortcut",
    "",
    question.explanation.examSpeedShortcut.join(" "),
    "",
    "### ⚠️ Common Trap",
    "",
    question.explanation.commonTrapWarning.join(" "),
    "",
    "<details>",
    "<summary>Reviewer metadata</summary>",
    "",
    `- Seed: ${question.seed}`,
    `- Task: ${question.task}`,
    `- Cluster length: ${question.clusterLength}`,
    `- Intended rule: ${question.intendedRuleId}`,
    `- Intended value: ${question.intendedRuleValue}`,
    `- Audit: ${question.ambiguityAudit.result}`,
    `- Candidate supports: \`${JSON.stringify(question.ambiguityAudit.candidateSupports)}\``,
    `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
    `- Quality diagnostics: \`${JSON.stringify(question.qualityDiagnostics)}\``,
    `- Permanent QL: ${question.lifecycle.permanentQlId}`,
    `- Source saturation: ${question.metadata.sourceSaturationStatus}`,
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp007-letter-cluster-discovery-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp007-letter-cluster-discovery-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-007 source-shaped discovery review written.", {
  outputDir,
  questions: rows.length,
  prototypes: new Set(rows.map((question) => question.prototypeId)).size,
  rules: new Set(rows.map((question) => question.intendedRuleId)).size,
  lengths: [...new Set(rows.map((question) => question.clusterLength))].sort(),
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
  maximumCommonGroupAttempt: Math.max(
    ...rows.map((question) => question.qualityDiagnostics.commonGroupAttempt),
  ),
  maximumOutlierAttempt: Math.max(
    ...rows.map((question) => question.qualityDiagnostics.outlierAttempt),
  ),
  permanentQlCount: 0,
});
