import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { UNIFORM_DIGIT_PROTOTYPE_CONTRACTS } from "./uniform-digit-contracts";
import { generateUniformDigitPrototypeQuestion } from "./uniform-digit-generator";

const outputDirectory = process.argv[2] ?? "cod-cp007-uniform-digit-review-output";
mkdirSync(outputDirectory, { recursive: true });

const questions = UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.flatMap((contract) =>
  Array.from({ length: 5 }, (_, index) => generateUniformDigitPrototypeQuestion(contract.prototypeId, index + 1)),
);

writeFileSync(
  join(outputDirectory, "COD-CP-007-uniform-digit-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-007 Uniform Modular Digit Translation — Prototype Review",
  "",
  "Status: non-permanent English prototype; not publishable; no Question Studio exposure.",
  "",
];

questions.forEach((question, index) => {
  const correct = question.options[question.correctIndex]!;
  markdown.push(
    `## ${index + 1}. ${question.prototypeId} — Seed ${question.seed}`,
    "",
    `- Task: \`${question.structuredPrompt.taskKind}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Renderer: \`${question.renderer}\``,
    `- Shift: \`+${question.metadata.shift} mod 10\``,
    `- Leading zero in source: \`${question.metadata.leadingZeroInSource}\``,
    `- Leading zero in code: \`${question.metadata.leadingZeroInCode}\``,
    `- Wrap count: \`${question.metadata.wrapCount}\``,
    "",
    "### Question",
    "",
    question.stem,
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option.value}${option.isCorrect ? " **✓**" : ""}`),
    "",
    `**Correct answer:** ${correct.value}`,
    "",
    "### Explanation",
    "",
    `**Reference Aid:** ${question.explanation.referenceAid?.join(" ") ?? ""}`,
    "",
    `**Quick Method:** ${question.explanation.quickMethod ?? ""}`,
    "",
    `**Rule:** ${question.explanation.ruleStatement}`,
    "",
    ...question.explanation.sourceDemonstration.map((line) => `- ${line}`),
    "",
    ...question.explanation.targetApplication.map((line) => `- ${line}`),
    "",
    `**Conclusion:** ${question.explanation.conclusion}`,
    "",
    `**Common Trap Alert:** ${question.explanation.commonTrapAlert ?? ""}`,
    "",
    "---",
    "",
  );
});

writeFileSync(
  join(outputDirectory, "COD-CP-007-uniform-digit-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

writeFileSync(
  join(outputDirectory, "COD-CP-007-uniform-digit-summary.json"),
  `${JSON.stringify({
    checkpointId: "COD-CP-007",
    family: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
    prototypeContracts: UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.length,
    questions: questions.length,
    permanentQlIdsAllocated: 0,
    publiclyPublishable: false,
  }, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify({ outputDirectory, files: 3, questions: questions.length }, null, 2));
