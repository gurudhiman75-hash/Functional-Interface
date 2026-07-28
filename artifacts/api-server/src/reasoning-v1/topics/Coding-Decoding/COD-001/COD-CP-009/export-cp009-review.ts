import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { COD_CP009_PERMANENT_CONTRACTS } from "./cp009-permanent-contracts";
import { generateCp009Question } from "./cp009-runtime";

const outputDirectory = process.argv[2] ?? "cod-cp009-review-output";
mkdirSync(outputDirectory, { recursive: true });

const questions = COD_CP009_PERMANENT_CONTRACTS.flatMap((contract) =>
  [1, 2].map((seed) => generateCp009Question(contract.qlId, seed)),
);

writeFileSync(
  join(outputDirectory, "COD-CP-009-English-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

function optionDisplay(option: unknown): string {
  if (option === null || typeof option !== "object") return String(option);
  const record = option as Record<string, unknown>;
  for (const key of ["value", "canonicalValue", "answer", "text", "label"] as const) {
    if (key in record) return String(record[key]);
  }
  for (const key of ["members", "tokens", "words"] as const) {
    const value = record[key];
    if (Array.isArray(value)) return value.join(", ");
  }
  return JSON.stringify(option);
}

const markdown: string[] = [
  "# COD-CP-009 — English Runtime Review Pack",
  "",
  "Status: review-only; not visible in Question Studio; not publicly publishable.",
  "",
  `Permanent range: COD-QL-175..198 (${COD_CP009_PERMANENT_CONTRACTS.length} QLs).`,
  "",
];

questions.forEach((question, index) => {
  const correct = question.options[question.correctIndex]!;
  markdown.push(
    `## ${index + 1}. ${question.qlId} — Seed ${question.seed}`,
    "",
    `- Solve contract: \`${question.metadata.solveContractId}\``,
    `- Source prototype: \`${question.metadata.sourcePrototypeId}\``,
    `- Topology: \`${question.topologyKind}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Answer type: \`${question.answerType}\``,
    "",
    "### Question",
    "",
    question.stem,
    "",
    "```json",
    JSON.stringify(question.structuredPrompt, null, 2),
    "```",
    "",
    ...question.options.map((option, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${optionDisplay(option)}${optionIndex === question.correctIndex ? " **✓**" : ""}`,
    ),
    "",
    `**Correct answer:** ${optionDisplay(correct)}`,
    "",
    "### Explanation trace",
    "",
    "```json",
    JSON.stringify(question.explanation, null, 2),
    "```",
    "",
    "---",
    "",
  );
});

writeFileSync(
  join(outputDirectory, "COD-CP-009-English-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);
