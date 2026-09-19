import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import { generateSifQuestion } from "./generator.ts";
import type { GeneratedSifQuestion, SifLocale } from "./types.ts";

const answerLetter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);

function renderQuestion(question: GeneratedSifQuestion, index: number): string {
  return [
    `## Q${index + 1} · ${question.scenarioId}`,
    "",
    `**Difficulty:** ${question.difficulty}`,
    `**Context:** ${question.domain}`,
    `**Format:** ${question.format}`,
    "",
    `**Instruction:** ${question.instruction}`,
    "",
    `**Statement:** ${question.statement}`,
    "",
    `**Inference I:** ${question.inferences[0]}`,
    `**Inference II:** ${question.inferences[1]}`,
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${answerLetter(question)}. ${question.options[question.correctIndex]}`,
    "",
    `**Explanation:** ${question.explanation}`,
    "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`,
    "",
    "---",
    "",
  ].join("\n");
}

export function buildSifCp001ReviewMarkdown(): string {
  const review = buildSifCpReviewPack({ cpId: "SIF-CP001", locale: "en-IN", seed: 17_001 });
  const authorities = listSifAuthorities("SIF-CP001");
  const exposedScenarios = new Set(review.questions.map((entry) => entry.scenarioId));
  const nonNumericAuthorities = authorities.filter((entry) => !/\d/.test(entry.statement["en-IN"])).length;
  const domainCounts = [...new Set(authorities.map((entry) => entry.domain))]
    .sort()
    .map((domain) => `| ${domain} | ${authorities.filter((entry) => entry.domain === domain).length} |`);
  const paritySeeds = [17_001, 17_075, 17_149];
  const parity: GeneratedSifQuestion[] = paritySeeds.flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP001", locale, seed })));
  return [
    "# SIF-CP001 — Direct Fact-Based Inference — Review V1",
    "",
    "**Status:** Human review candidate; not frozen",
    "**Chapter:** SIF-001 — Statement & Inference",
    "**Runtime:** Structured facts → support classification → answer → language",
    "**Delivery:** Review only; Question Bank and learner delivery remain locked",
    "",
    "## Review focus",
    "",
    "- natural SSC/Banking/Punjab-state exam wording;",
    "- direct fact connection without outside knowledge;",
    "- meaningful variation across education, banking, transport, workplace, business, administration and everyday contexts;",
    "- balanced valid-inference position;",
    "- simple explanations that identify the supporting fact and reject the unsupported extension;",
    "- English/Hindi/Punjabi answer parity.",
    "",
    `**Authority pool:** ${authorities.length} independently authored scenarios`,
    `**Non-numeric scenarios:** ${nonNumericAuthorities}`,
    `**Review coverage:** ${exposedScenarios.size} distinct scenarios shown; ${review.questions.length - exposedScenarios.size} repeated scenarios`,
    `**Answer classes:** ${[...new Set(review.questions.map((entry) => entry.answerClass))].join(", ")}`,
    `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`,
    "",
    "## Authority-pool coverage",
    "",
    "| Context domain | Authorities |",
    "|---|---:|",
    ...domainCounts,
    "",
    ...review.questions.flatMap((question, index) => [renderQuestion(question, index)]),
    "# Multilingual parity spot-check",
    "",
    ...parity.map((question) => [
      `## ${question.scenarioId} · ${question.locale}`,
      "",
      `**Statement:** ${question.statement}`,
      "",
      `**Inference I:** ${question.inferences[0]}`,
      `**Inference II:** ${question.inferences[1]}`,
      "",
      `**Answer class:** ${question.answerClass}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
      "---",
      "",
    ].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp001-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp001ReviewMarkdown(), "utf8");
}
