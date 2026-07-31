import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP007_PROTOTYPES } from "./cluster-domain";
import {
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
  type GeneratedClsCp007PermanentQuestion,
} from "./cp007-english-contracts";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp007-permanent-review",
);

const singleRows = CLS_CP007_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  ([4, 5] as const).flatMap((optionCount) =>
    Array.from({ length: 2 }, (_, offset) =>
      generateClsCp007PermanentClusterQuestion(
        prototype.prototypeId,
        prototypeIndex * 1_000 + optionCount * 100 + offset * 37,
        optionCount,
      ),
    ),
  ),
);
const pairRows = ([4, 5] as const).flatMap((optionCount) =>
  Array.from({ length: 12 }, (_, seed) =>
    generateClsCp007PermanentClusterPairQuestion(
      seed * 37 + optionCount * 1_000,
      optionCount,
    ),
  ),
);
const rows: readonly GeneratedClsCp007PermanentQuestion[] = [...singleRows, ...pairRows];

const markdown = [
  "# CLS-CP-007 Permanent English Review",
  "",
  `Questions: ${rows.length}`,
  `CLS-QL-012 questions: ${singleRows.length}`,
  `CLS-QL-013 questions: ${pairRows.length}`,
  "Locale: en-IN",
  "Review status: FROZEN_ENGLISH_RUNTIME_PROOF",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.permanentQlId} · ${question.difficulty} · ${question.options.length} options`,
    "",
    `**Solve contract:** ${question.solveContract}`,
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
    `- Permanent QL: ${question.lifecycle.permanentQlId}`,
    `- Runtime: ${question.metadata.runtimeVersion}`,
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
  path.join(outputDir, "cls-cp007-permanent-english-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp007-permanent-english-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-007 permanent English review written.", {
  outputDir,
  questions: rows.length,
  qls: [...new Set(rows.map((question) => question.permanentQlId))],
  qlCounts: {
    "CLS-QL-012": singleRows.length,
    "CLS-QL-013": pairRows.length,
  },
  singlePrototypes: new Set(singleRows.map((question) => question.prototypeId)).size,
  singleRules: new Set(singleRows.map((question) => question.intendedRuleId)).size,
  singleLengths: [...new Set(singleRows.map((question) => question.clusterLength))].sort(),
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
});
