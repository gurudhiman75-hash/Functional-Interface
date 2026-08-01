import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getMenCp008Wave01Definition, getMenCp008Wave01PrototypeIds } from "./registry";
import { generateMenCp008Wave01Prototype } from "./runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/men-002-cp008-gap-wave-01-review");
mkdirSync(outputDirectory, { recursive: true });

const questions = getMenCp008Wave01PrototypeIds().flatMap((prototypeId) =>
  [0, 1, 2].map((sampleIndex) => ({
    definition: getMenCp008Wave01Definition(prototypeId),
    question: generateMenCp008Wave01Prototype(
      prototypeId,
      `men-002-cp008-wave01-review:${prototypeId}:${sampleIndex}`,
    ),
  })),
);

writeFileSync(
  resolve(outputDirectory, "men-cp-008-gap-wave-01-review.json"),
  JSON.stringify(questions, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const markdown = [
  "# MEN-CP-008 Gap Wave 01 Review",
  "",
  "> Non-QL English executable discovery. All questions remain unallocated, unpublished and product-ineligible.",
  "",
  ...questions.flatMap(({ definition, question }, index) => [
    `## ${index + 1}. ${question.prototypeId}`,
    "",
    `- Solve mode: \`${question.solveMode}\``,
    `- Target: \`${question.target}\``,
    `- Shape: \`${question.state.shape}\``,
    `- Pi policy: \`${question.piPolicy}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Provisional disposition: \`${definition.disposition}\``,
    `- Seed: \`${question.seed}\``,
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

writeFileSync(resolve(outputDirectory, "men-cp-008-gap-wave-01-review.md"), markdown, "utf8");

if (questions.length !== 48) {
  throw new Error(`Expected 48 Wave-01 review questions; found ${questions.length}.`);
}

console.log(`Generated ${questions.length} MEN-CP-008 Gap Wave 01 review questions in ${outputDirectory}.`);
