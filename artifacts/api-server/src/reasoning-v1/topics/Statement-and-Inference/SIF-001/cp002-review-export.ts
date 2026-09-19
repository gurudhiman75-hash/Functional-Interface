import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import { generateSifQuestion } from "./generator.ts";
import { solveSifScenario } from "./solver.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const letter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);

function renderQuestion(question: GeneratedSifQuestion, index: number): string {
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`, `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`), "",
    `**Answer:** ${letter(question)}. ${question.options[question.correctIndex]}`, "", `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp002ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP002");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP002", locale: "en-IN", seed: 9_000 });
  const stateOrder = ["ONLY_I", "ONLY_II", "BOTH", "NEITHER", "EITHER"] as const;
  const stateRows = stateOrder.map((state) => `| ${state} | ${authorities.filter((entry) => solveSifScenario(entry) === state).length} | ${review.questions.filter((entry) => entry.answerClass === state).length} |`);
  const paritySeeds = [9_005, 9_006, 9_007, 9_008, 9_009];
  const parity = paritySeeds.flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP002", locale, seed })));
  return [
    "# SIF-CP002 — Two-Inference Evaluation — Review V1", "",
    "**Status:** Human review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference", "**Delivery:** Review only; Question Bank and learner delivery remain locked", "",
    "## Review focus", "",
    "- independent evaluation of Inference I and Inference II;", "- equal authority coverage of all five answer states;", "- no conversion of ‘some’ into ‘most’ or a one-day fact into a permanent claim;", "- clear handling of both/neither/either answer logic;", "- natural English, Hindi and Punjabi wording;", "- simple evidence-led explanations.", "",
    `**Authority pool:** ${authorities.length} distinct scenarios`, `**Review coverage:** ${new Set(review.questions.map((entry) => entry.scenarioId)).size} distinct scenarios shown; ${review.questions.length - new Set(review.questions.map((entry) => entry.scenarioId)).size} repeated scenarios`, `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Five-state balance", "", "| Answer state | Authorities | Review questions |", "|---|---:|---:|", ...stateRows, "",
    ...review.questions.map(renderQuestion),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp002-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp002ReviewMarkdown(), "utf8");
}
