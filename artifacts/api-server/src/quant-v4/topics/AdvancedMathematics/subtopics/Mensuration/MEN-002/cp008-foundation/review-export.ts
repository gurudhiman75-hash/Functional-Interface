import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getMenCp008Definition, getMenCp008PrototypeIds } from "./registry";
import { generateMenCp008Prototype } from "./runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/men-002-cp008-foundation-review");
mkdirSync(outputDirectory, { recursive: true });

const questions = getMenCp008PrototypeIds().flatMap((prototypeId) =>
  [0, 1, 2].map((sampleIndex) => ({
    disposition: getMenCp008Definition(prototypeId).disposition,
    question: generateMenCp008Prototype(
      prototypeId,
      `men-002-cp008-review:${prototypeId}:${sampleIndex}`,
    ),
  })),
);

writeFileSync(
  resolve(outputDirectory, "men-cp-008-foundation-review.json"),
  JSON.stringify(questions, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const markdown = [
  "# MEN-CP-008 Prototype Foundation Review",
  "",
  "> Discovery-only English review. These are temporary prototypes, not permanent QLs or publishable questions.",
  "",
  ...questions.flatMap(({ disposition, question }, index) => [
    `## ${index + 1}. ${question.prototypeId}`,
    "",
    `- Seed: \`${question.seed}\``,
    `- Solve mode: \`${question.solveMode}\``,
    `- Target: \`${question.target}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Pi policy: \`${question.piPolicy}\``,
    `- Provisional disposition: \`${disposition}\``,
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

writeFileSync(
  resolve(outputDirectory, "men-cp-008-foundation-review.md"),
  markdown,
  "utf8",
);

console.log(`Generated ${questions.length} MEN-CP-008 foundation review questions in ${outputDirectory}.`);
