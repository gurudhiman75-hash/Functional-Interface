import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getMenCp007PrototypeIds } from "./prototype-registry";
import { generateMenCp007Prototype } from "./runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/men-002-cp007-review");
mkdirSync(outputDirectory, { recursive: true });

const questions = getMenCp007PrototypeIds().flatMap((prototypeId) =>
  [0, 1, 2].map((sampleIndex) =>
    generateMenCp007Prototype(
      prototypeId,
      `men-002-cp007-review:${prototypeId}:${sampleIndex}`,
    ),
  ),
);

const jsonPath = resolve(outputDirectory, "men-cp-007-prototype-review.json");
writeFileSync(
  jsonPath,
  JSON.stringify(questions, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const markdown = [
  "# MEN-CP-007 Prototype Foundation Review",
  "",
  "> Discovery-only English review. These are temporary prototypes, not permanent QLs or publishable Question Bank items.",
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId}`,
    "",
    `- Seed: \`${question.seed}\``,
    `- Solve mode: \`${question.solveMode}\``,
    `- Target: \`${question.target}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Independent verification: ${question.verification.valid ? "PASS" : "FAIL"} — ${question.verification.method}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    ...question.options.map((option) => `- ${option.label}. ${option.display}`),
    "",
    `**Reviewer answer:** ${question.answer}`,
    "",
    "### 📌 Core Concept",
    "",
    question.explanation.keyRule,
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...question.explanation.steps.flatMap((step, stepIndex) => [
      `${stepIndex + 1}. **${step.title}**`,
      `   ${step.body}`,
      ...(step.equation ? [`   ${step.equation}`] : []),
      "",
    ]),
    "### ⚡ Exam Speed Shortcut",
    "",
    question.explanation.shortcut,
    "",
    "### ⚠️ Common Traps & Distractors",
    "",
    ...question.explanation.traps.map((trap) => `- ${trap}`),
    "",
    "---",
    "",
  ]),
].join("\n");

const markdownPath = resolve(outputDirectory, "men-cp-007-prototype-review.md");
mkdirSync(dirname(markdownPath), { recursive: true });
writeFileSync(markdownPath, markdown, "utf8");

console.log(`Generated ${questions.length} MEN-CP-007 discovery review questions in ${outputDirectory}.`);
