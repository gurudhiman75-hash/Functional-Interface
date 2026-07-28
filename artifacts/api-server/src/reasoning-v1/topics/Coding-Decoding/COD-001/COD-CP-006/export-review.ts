import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCodCp006Question } from "./generator";
import { COD_CP006_QUESTION_LOGICS } from "./question-language.en";
import type { GeneratedCodCp006Question } from "./types";

const outputDir = resolve(process.argv[2] ?? "cod-cp006-review-output");
mkdirSync(outputDir, { recursive: true });

const questions: GeneratedCodCp006Question[] = [];
for (let seed = 1; seed <= 5; seed += 1) {
  for (const logic of COD_CP006_QUESTION_LOGICS) {
    questions.push(generateCodCp006Question(logic.qlId, seed));
  }
}

writeFileSync(
  resolve(outputDir, "cod-cp006-seeds1-5.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
);

const seedOne = questions.filter((question) => question.seed === 1);
const markdown = [
  "# COD-001 / COD-CP-006 — Seed 1 Editorial Review",
  "",
  `Questions: ${seedOne.length}`,
  "",
];

for (const question of seedOne) {
  markdown.push(
    `## ${question.qlId} — ${question.ruleId}`,
    "",
    `- Context: \`${JSON.stringify(question.ruleContext)}\``,
    `- Task: \`${question.structuredPrompt.taskKind}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Renderer: \`${question.renderer}\``,
    `- Stage-order normalization: \`${question.metadata.stageOrderNormalized}\``,
    "",
    `**Stem:** ${question.stem}`,
    "",
    "**Evidence:**",
    ...question.structuredPrompt.evidence.map((pair) => `- ${pair.source} → ${pair.code}`),
    "",
    "**Options:**",
    ...question.options.map((option, index) =>
      `${index + 1}. ${option.value}${option.isCorrect ? " ✓" : ""}${option.errorLabel ? ` — ${option.errorLabel}` : ""}`,
    ),
    "",
    `**Rule:** ${question.explanation.ruleStatement}`,
    ...(question.explanation.referenceAid?.length ? ["", "**Reference aid:**", ...question.explanation.referenceAid.map((line) => `- ${line}`)] : []),
    ...(question.explanation.quickMethod ? ["", `**Quick method:** ${question.explanation.quickMethod}`] : []),
    "",
    ...question.explanation.sourceDemonstration.map((line) => `**Check:** ${line}`),
    ...question.explanation.targetApplication.map((line) => `**Application:** ${line}`),
    `**Conclusion:** ${question.explanation.conclusion}`,
    question.explanation.commonTrapAlert
      ? `**Common Trap Alert:** ${question.explanation.commonTrapAlert}`
      : "",
    "",
  );
}

writeFileSync(resolve(outputDir, "cod-cp006-seed1-review.md"), markdown.join("\n"));

const summary = {
  checkpoint: "COD-CP-006",
  qls: COD_CP006_QUESTION_LOGICS.length,
  seeds: 5,
  renderedQuestions: questions.length,
  qlRange: ["COD-QL-137", "COD-QL-168"],
  ruleIds: [...new Set(questions.map((question) => question.ruleId))],
  taskKinds: [...new Set(questions.map((question) => question.structuredPrompt.taskKind))],
  answerTypes: [...new Set(questions.map((question) => question.answerType))],
  stageOrderNormalized: questions.filter((question) => question.metadata.stageOrderNormalized).length,
  difficulties: Object.fromEntries(
    [...new Set(questions.map((question) => question.difficulty))].map((difficulty) => [
      difficulty,
      questions.filter((question) => question.difficulty === difficulty).length,
    ]),
  ),
};

writeFileSync(resolve(outputDir, "cod-cp006-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ outputDir, ...summary }, null, 2));
