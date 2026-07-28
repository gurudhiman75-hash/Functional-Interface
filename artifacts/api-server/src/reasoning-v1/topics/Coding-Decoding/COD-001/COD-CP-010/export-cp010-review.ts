import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateCp010Question } from "./cp010-runtime";

const outputDirectory = process.argv[2] ?? "cod-cp010-review-output";
mkdirSync(outputDirectory, { recursive: true });

const questions = Array.from({ length: 40 }, (_, index) =>
  generateCp010Question("COD-QL-199", index),
);

writeFileSync(
  join(outputDirectory, "COD-CP-010-English-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-010 — English Runtime Review Pack",
  "",
  "Status: review-only; not visible in Question Studio; not publicly publishable.",
  "",
];

questions.forEach((question, index) => {
  const correct = question.options[question.correctIndex]!;
  markdown.push(
    `## ${index + 1}. ${question.qlId} — Seed ${question.seed}`,
    "",
    `- Solve contract: \`${question.metadata.solveContractId}\``,
    `- Domain: \`${question.metadata.domain}\``,
    `- Endpoint signature: \`${question.metadata.endpointSignature}\``,
    `- Action: \`${question.metadata.actionKind}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Renderer: \`${question.renderer}\``,
    "",
    "### Mapping table",
    "",
    "| Source | Code |",
    "|---|---|",
    ...question.structuredPrompt.mappingRows.map(
      (row) => `| ${row.sourceToken} | ${row.codeToken} |`,
    ),
    "",
    "### Conditions",
    "",
    ...question.structuredPrompt.conditions.map(
      (condition, conditionIndex) => `${conditionIndex + 1}. ${condition.description}`,
    ),
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
    `**Reference Aid:** ${question.explanation.referenceAid.join(" | ")}`,
    "",
    `**Quick Method:** ${question.explanation.quickMethod}`,
    "",
    `**Rule:** ${question.explanation.ruleStatement}`,
    "",
    ...question.explanation.sourceDemonstration.map((line) => `- ${line}`),
    ...question.explanation.targetApplication.map((line) => `- ${line}`),
    "",
    `**Conclusion:** ${question.explanation.conclusion}`,
    "",
    `**Trap Alert:** ${question.explanation.commonTrapAlert}`,
    "",
    "---",
    "",
  );
});

writeFileSync(
  join(outputDirectory, "COD-CP-010-English-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);
