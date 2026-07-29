import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateClsCp003DiscoveryQuestion } from "./discovery-runtime";
import { CLS_CP003_PROTOTYPES } from "./word-dataset.en";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp003-review");
const rows = CLS_CP003_PROTOTYPES.flatMap((prototype) =>
  ([4, 5] as const).flatMap((optionCount) =>
    Array.from({ length: 8 }, (_, seed) =>
      generateClsCp003DiscoveryQuestion(prototype.prototypeId, seed, optionCount),
    ),
  ),
);

const markdown = [
  "# CLS-CP-003 Lexical and Word-Structure Discovery Review",
  "",
  `Questions: ${rows.length}`,
  `Temporary prototypes: ${CLS_CP003_PROTOTYPES.length}`,
  "Permanent QLs: 0",
  "Locale: en-IN discovery only",
  "Jumbled-word surface shortcuts: rejected",
  "Source saturation: open; uploaded-book search must be retried",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} · ${question.difficulty} · ${question.options.length} options`,
    "",
    `**Question:** ${question.stem}`,
    "",
    "**Options:**",
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### 📌 Core Concept",
    "",
    question.explanation.coreConcept.join(" "),
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...question.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
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
    `- Generation profile: ${question.generationProfile}`,
    `- Intended rule: ${question.intendedRuleId}`,
    `- Intended value: ${question.intendedRuleValue}`,
    `- Canonical words: ${question.canonicalWords.join(", ")}`,
    `- Audit: ${question.ambiguityAudit.result}`,
    `- Candidate rule count: ${question.ambiguityAudit.candidateSupports.length}`,
    `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
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
  path.join(outputDir, "cls-cp003-word-structure-discovery-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp003-word-structure-discovery-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-003 discovery review written.", {
  outputDir,
  questions: rows.length,
  prototypes: new Set(rows.map((question) => question.prototypeId)).size,
  tasks: [...new Set(rows.map((question) => question.task))].sort(),
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
  permanentQlCount: 0,
  jumbledSurfaceShortcutPolicy: "NO_DIRECT_STRUCTURAL_OUTLIER",
});