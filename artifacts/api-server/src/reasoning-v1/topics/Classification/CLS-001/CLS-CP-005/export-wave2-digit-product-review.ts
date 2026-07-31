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
  `Complete ambiguity registry: ${questions[0]?.metadata.completeRuleCount} rules`,
  "Permanent QLs: 0",
  "Equivalent-set admission: pending separate naturalness audit",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  "Rule: multiply the two digits of the first number to obtain the second number.",
  "",
  "Every question is independently re-solved against all Wave 1 rules, all generic Wave 2 source-gap rules and the digit-product rule itself. States with another defensible answer or an obvious answer-scale giveaway are rejected.",
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
    `- Supporting rules: ${question.ambiguityAudit.candidateSupports.length}`,
    `- Expanded ambiguity result: ${question.expandedAmbiguityAudit.result}`,
    `- Answer-to-common maximum ratio: ${question.presentationQualityAudit.answerMaximumRatio.toFixed(2)}`,
    `- Answer-to-common total ratio: ${question.presentationQualityAudit.answerTotalRatio.toFixed(2)}`,
    `- Internal source attempt: ${question.metadata.sourceAttempt}`,
    `- Runtime: ${question.metadata.runtimeVersion}`,
    `- Expanded verifier: ${question.metadata.sourceGapAuditVersion}`,
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

console.log("CLS-CP-005 expanded-registry digit-product review written.", {
  outputDir,
  questions: questions.length,
  rulesInAmbiguityRegistry: questions[0]?.ambiguityAudit.completeRuleCount,
  optionCounts: [...new Set(questions.map((question) => question.options.length))].sort(),
  maximumSourceAttempt: Math.max(...questions.map((question) => question.metadata.sourceAttempt)),
  maximumAnswerMaximumRatio: Math.max(...questions.map((question) => question.presentationQualityAudit.answerMaximumRatio)),
  maximumAnswerTotalRatio: Math.max(...questions.map((question) => question.presentationQualityAudit.answerTotalRatio)),
  permanentQls: 0,
});
