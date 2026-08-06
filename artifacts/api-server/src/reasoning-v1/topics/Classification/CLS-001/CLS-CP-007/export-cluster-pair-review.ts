import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateClsCp007PairQuestion } from "./cluster-pair-runtime";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp007-cluster-pair-review",
);
const rows = ([4, 5] as const).flatMap((optionCount) =>
  Array.from({ length: 12 }, (_, seed) =>
    generateClsCp007PairQuestion(seed * 37 + optionCount * 1_000, optionCount),
  ),
);

const markdown = [
  "# CLS-CP-007 Complete Cluster-Pair Classification Review",
  "",
  `Questions: ${rows.length}`,
  "Temporary task: FIND_ODD_LETTER_CLUSTER_PAIR",
  "Temporary source prototypes: 1",
  "Permanent QLs: 0",
  "Locale: en-IN discovery only",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.difficulty} · ${question.options.length} options`,
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
    `- Intended rule: ${question.intendedRuleId}`,
    `- Candidate supports: \`${JSON.stringify(question.ambiguityAudit.candidateSupports)}\``,
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
  path.join(outputDir, "cls-cp007-cluster-pair-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp007-cluster-pair-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-007 cluster-pair review written.", {
  outputDir,
  questions: rows.length,
  task: "FIND_ODD_LETTER_CLUSTER_PAIR",
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
  permanentQlCount: 0,
});
