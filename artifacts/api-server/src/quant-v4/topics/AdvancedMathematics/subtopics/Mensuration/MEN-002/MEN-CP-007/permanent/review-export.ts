import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MEN_CP_007_FROZEN_QLS } from "../final-freeze/registry";
import { generateMenCp007PermanentQuestion } from "./runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/men-002-cp007-permanent-english-review");
mkdirSync(outputDirectory, { recursive: true });

const questions = MEN_CP_007_FROZEN_QLS.flatMap((definition) =>
  [0, 1, 2].map((sampleIndex) =>
    generateMenCp007PermanentQuestion(
      definition.qlId,
      `men-cp007-permanent-review:${definition.qlId}:${sampleIndex}`,
      "en",
    ),
  ),
);

writeFileSync(
  resolve(outputDirectory, "men-cp-007-permanent-english-review.json"),
  JSON.stringify(questions, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const markdown = [
  "# MEN-CP-007 Permanent English Review",
  "",
  "> Inactive implementation-proof review. Permanent identities are frozen, but every product and publication surface remains disabled.",
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.qlId} — ${question.templateId}`,
    "",
    `- Canonical solve mode: \`${question.canonicalSolveMode}\``,
    `- Source prototype: \`${question.sourcePrototypeId}\``,
    `- Source solve mode: \`${question.sourceSolveMode}\``,
    `- Source wave: \`${question.sourceWaveId}\``,
    `- Seed: \`${question.seed}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Target: \`${question.target}\``,
    `- Independent verification: ${question.verification.valid ? "PASS" : "FAIL"} — ${question.verification.method}`,
    `- Lifecycle: ${question.maturity}; active=${question.active}; Question Studio=${question.questionStudioDiscoverable}; publishable=${question.publiclyPublishable}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    ...question.options.map((option) => `- ${option.label}. ${option.display}`),
    "",
    `**Reviewer answer:** ${question.answer}`,
    "",
    "### 📌 Core Concept & Formula",
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
    "### ⚠️ Common Traps & Distractor Analysis",
    "",
    ...question.explanation.traps.map((trap) => `- ${trap}`),
    "",
    "---",
    "",
  ]),
].join("\n");

writeFileSync(
  resolve(outputDirectory, "men-cp-007-permanent-english-review.md"),
  markdown,
  "utf8",
);

console.log(`Generated ${questions.length} MEN-CP-007 permanent English review questions in ${outputDirectory}.`);
