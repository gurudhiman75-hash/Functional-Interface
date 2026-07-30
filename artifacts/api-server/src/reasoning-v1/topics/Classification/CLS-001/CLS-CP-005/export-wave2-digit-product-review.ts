import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateClsCp005Wave2DigitProductQuestion } from "./wave2-digit-product-runtime";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp005-wave2-digit-product-review");
const questions = Array.from({ length: 24 }, (_, index) =>
  generateClsCp005Wave2DigitProductQuestion(30_000 + index * 37, index % 4 === 0 ? 5 : 4));

const markdown = [
  "# CLS-CP-005 Wave 2 Supplement — First-Number Digit Product",
  "",
  `Questions: ${questions.length}`,
  "Temporary prototypes: 1",
  "New source-backed rules: 1",
  "Complete ambiguity registry: Wave 1 rules plus digit-product rule",
  "Permanent QLs: 0",
  "Equivalent-set admission: pending separate naturalness audit",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  "Rule: multiply the two digits of the first number to obtain the second number.",
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    "**Options:**",
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### Check the Options",
    "",
    ...question.evidenceByOption.map((evidence, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${evidence}`),
    "",
    "### Explanation",
    "",
    ...question.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    `**Shortcut:** ${question.explanation.examSpeedShortcut[0]}`,
    "",
    `**Common trap:** ${question.explanation.commonTrapWarning[0]}`,
    "",
    "<details>",
    "<summary>Reviewer metadata</summary>",
    "",
    `- Seed: ${question.seed}`,
    `- Intended rule: ${question.intendedRuleId}`,
    `- Complete rule count: ${question.ambiguityAudit.completeRuleCount}`,
    `- Competing supports: ${question.ambiguityAudit.candidateSupports.length}`,
    `- Ambiguity result: ${question.ambiguityAudit.result}`,
    `- Runtime: ${question.metadata.runtimeVersion}`,
    `- Equivalent-set admission: ${question.metadata.equivalentSetAdmission}`,
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "cls-cp005-wave2-digit-product-review.json"), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp005-wave2-digit-product-review.md"), `${markdown}\n`, "utf8");

console.log("CLS-CP-005 Wave 2 digit-product review written.", {
  outputDir,
  questions: questions.length,
  rulesInAmbiguityRegistry: questions[0]?.ambiguityAudit.completeRuleCount,
  optionCounts: [...new Set(questions.map((question) => question.options.length))].sort(),
  permanentQls: 0,
});
