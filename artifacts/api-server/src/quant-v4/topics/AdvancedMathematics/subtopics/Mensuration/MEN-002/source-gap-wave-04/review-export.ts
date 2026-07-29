import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  getMenCp007Wave04Prototype,
  getMenCp007Wave04PrototypeIds,
} from "./registry";
import { generateMenCp007Wave04Prototype } from "./runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/men-002-cp007-source-gap-wave-04-review");
mkdirSync(outputDirectory, { recursive: true });

const questions = getMenCp007Wave04PrototypeIds().flatMap((prototypeId) =>
  [0, 1, 2, 3].map((sampleIndex) => ({
    definition: getMenCp007Wave04Prototype(prototypeId),
    question: generateMenCp007Wave04Prototype(
      prototypeId,
      `men-002-cp007-wave04-review:${prototypeId}:${sampleIndex}`,
    ),
  })),
);

writeFileSync(
  resolve(outputDirectory, "men-cp-007-source-gap-wave-04-review.json"),
  JSON.stringify(questions, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const markdown = [
  "# MEN-CP-007 Source Gap Wave 04 Review",
  "",
  "> Source-backed discovery-only English review. These contracts are temporary, unallocated and ineligible for publication.",
  "",
  ...questions.flatMap(({ definition, question }, index) => [
    `## ${index + 1}. ${question.prototypeId}`,
    "",
    `- Seed: \`${question.seed}\``,
    `- Solve mode: \`${question.solveMode}\``,
    `- Target: \`${question.target}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Provisional disposition: \`${definition.disposition}\``,
    `- Source evidence: ${definition.sourceEvidence.join("; ")}`,
    `- Independent verification: ${question.verification.valid ? "PASS" : "FAIL"} — ${question.verification.method}`,
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
  resolve(outputDirectory, "men-cp-007-source-gap-wave-04-review.md"),
  markdown,
  "utf8",
);

console.log(`Generated ${questions.length} MEN-CP-007 source-gap review questions in ${outputDirectory}.`);
