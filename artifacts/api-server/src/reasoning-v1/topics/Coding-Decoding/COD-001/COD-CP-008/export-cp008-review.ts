import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { COD_CP008_PERMANENT_CONTRACTS } from "./cp008-permanent-contracts";
import { generateCp008Question } from "./cp008-runtime";

const outputDirectory = process.argv[2] ?? "cod-cp008-review-output";
mkdirSync(outputDirectory, { recursive: true });

const questions = COD_CP008_PERMANENT_CONTRACTS.flatMap((contract) =>
  Array.from({ length: 10 }, (_, index) => generateCp008Question(contract.qlId, index + 1)),
);

writeFileSync(
  join(outputDirectory, "COD-CP-008-English-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-008 — English Runtime Review Pack",
  "",
  "Status: review-only; not visible in Question Studio; not publicly publishable.",
  "",
];

questions.forEach((question, index) => {
  const correct = question.options[question.correctIndex]!;
  markdown.push(
    `## ${index + 1}. ${question.qlId} — Seed ${question.seed}`,
    "",
    `- Rule: \`${question.ruleId}\``,
    `- Solve contract: \`${question.metadata.solveContractId}\``,
    `- Task: \`${question.structuredPrompt.taskKind}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Renderer: \`${question.renderer}\``,
    `- Topology: \`${question.metadata.topology}\``,
    "",
    "### Question",
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option.value}${option.isCorrect ? " **✓**" : ""}`,
    ),
    "",
    `**Correct answer:** ${correct.value}`,
    "",
    "### Explanation",
    "",
    `**Reference Aid:** ${question.explanation.referenceAid?.join(" | ") ?? ""}`,
    "",
    `**Quick Method:** ${question.explanation.quickMethod ?? ""}`,
    "",
    `**Rule:** ${question.explanation.ruleStatement}`,
    "",
    ...question.explanation.sourceDemonstration.map((line) => `- ${line}`),
    ...question.explanation.targetApplication.map((line) => `- ${line}`),
    "",
    `**Conclusion:** ${question.explanation.conclusion}`,
    "",
    `**Trap Alert:** ${question.explanation.commonTrapAlert ?? ""}`,
    "",
    "---",
    "",
  );
});

writeFileSync(
  join(outputDirectory, "COD-CP-008-English-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);
