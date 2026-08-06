import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP006_PROTOTYPES } from "./alphabet-domain";
import { generateClsCp006QualityQuestion } from "./quality-runtime";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp006-review",
);
const rows = CLS_CP006_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  ([4, 5] as const).flatMap((optionCount) =>
    Array.from({ length: 4 }, (_, offset) =>
      generateClsCp006QualityQuestion(
        prototype.prototypeId,
        prototypeIndex * 1_000 + optionCount * 100 + offset * 17,
        optionCount,
      ),
    ),
  ),
);

const markdown = [
  "# CLS-CP-006 Alphabet and Letter-Pair Discovery Review",
  "",
  `Questions: ${rows.length}`,
  `Temporary prototypes: ${CLS_CP006_PROTOTYPES.length}`,
  "Permanent QLs: 0",
  "Locale: en-IN discovery only",
  "Presentation: teacher-style option-by-option reasoning with explicit match/fail conclusions",
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
    "### 📝 Step-by-Step Solution",
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
    `- Answer object: ${question.optionKind}`,
    `- Intended rule: ${question.intendedRuleId}`,
    `- Intended value: ${question.intendedRuleValue}`,
    `- Audit: ${question.ambiguityAudit.result}`,
    `- Candidate supports: \`${JSON.stringify(question.ambiguityAudit.candidateSupports)}\``,
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
  path.join(outputDir, "cls-cp006-alphabet-discovery-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp006-alphabet-discovery-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-006 teacher-style discovery review written.", {
  outputDir,
  questions: rows.length,
  prototypes: new Set(rows.map((question) => question.prototypeId)).size,
  rules: new Set(rows.map((question) => question.intendedRuleId)).size,
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
  permanentQlCount: 0,
});
