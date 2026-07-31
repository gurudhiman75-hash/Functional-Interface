import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
} from "./cp006-english-contracts";
import { generateClsCp006EnglishQuestion } from "./cp006-english-runtime";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp006-permanent-review",
);
const qlIds = [
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
] as const;
const rows = qlIds.flatMap((qlId) =>
  Array.from({ length: 40 }, (_, seed) =>
    generateClsCp006EnglishQuestion(
      qlId,
      seed,
      seed % 3 === 0 ? 5 : 4,
    ),
  ),
);

const markdown = [
  "# CLS-CP-006 Permanent English Runtime Review",
  "",
  `Questions: ${rows.length}`,
  `Permanent QLs: ${qlIds.join(", ")}`,
  "Locale: en-IN",
  "Status: frozen English runtime proof",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.qlId} · ${question.metadata.sourcePrototypeId} · ${question.difficulty}`,
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
    `- QL: ${question.qlId}`,
    `- Solve contract: ${question.metadata.solveContractId}`,
    `- Source prototype: ${question.metadata.sourcePrototypeId}`,
    `- Source seed: ${question.metadata.sourcePrototypeSeed}`,
    `- Rule: ${question.intendedRuleId}`,
    `- Rule value: ${question.intendedRuleValue}`,
    `- Complete-registry audit: ${question.ambiguityAudit.result}`,
    `- Compatible supports: \`${JSON.stringify(question.ambiguityAudit.candidateSupports)}\``,
    `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
    `- Lifecycle: ${question.lifecycle.reviewStatus}`,
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp006-permanent-english-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp006-permanent-english-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-006 permanent English review written.", {
  outputDir,
  questions: rows.length,
  qls: [...new Set(rows.map((question) => question.qlId))],
  sources: new Set(rows.map((question) => question.metadata.sourcePrototypeId)).size,
  rules: new Set(rows.map((question) => question.intendedRuleId)).size,
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
});
