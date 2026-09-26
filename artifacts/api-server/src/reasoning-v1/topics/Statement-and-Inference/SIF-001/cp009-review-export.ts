import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP009_PROFILE_BY_AUTHORITY_ID } from "./cp009-data-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const letter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);
function render(question: GeneratedSifQuestion, index: number): string {
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`,
    `**Data family:** ${SIF_CP009_PROFILE_BY_AUTHORITY_ID[question.scenarioId].family}`,
    `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`), "",
    `**Answer:** ${letter(question)}. ${question.options[question.correctIndex]}`, "",
    `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp009ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP009");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP009", locale: "en-IN", seed: 90_000 });
  const families = [...new Set(authorities.map((entry) => SIF_CP009_PROFILE_BY_AUTHORITY_ID[entry.id].family))];
  const familyRows = families.map((family) => `| ${family} | ${authorities.filter((entry) => SIF_CP009_PROFILE_BY_AUTHORITY_ID[entry.id].family === family).length} | ${review.questions.filter((entry) => SIF_CP009_PROFILE_BY_AUTHORITY_ID[entry.scenarioId].family === family).length} |`);
  const parity = [90_000, 90_001, 90_005, 90_011].flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP009", locale, seed })));
  return [
    "# SIF-CP009 — Data-Supported Verbal Inference — Review V1", "",
    "**Status:** Human-review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference",
    "**Difficulty:** Medium", "**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked", "",
    "## Review focus", "",
    "- read percentages, counts, ratios, changes, ranks, frequencies and part-whole figures stated in prose;",
    "- make direct comparisons without turning the task into lengthy arithmetic or data interpretation;",
    "- keep conclusions within the stated period, group and measure; distinguish raw counts from rates;",
    "- avoid unsupported causes, projections and claims about unreported people or outcomes.", "",
    `**Authority pool:** ${authorities.length} trilingual scenarios across ${families.length} numerical-reasoning families`,
    `**Review sample:** ${review.questions.length} distinct scenarios; three from each family`,
    `**Difficulty mix:** ${review.effectiveDistribution.MEDIUM} Medium; Easy ${review.effectiveDistribution.EASY}; Hard ${review.effectiveDistribution.HARD}`,
    `**Answer positions:** I ${review.questions.filter((entry) => entry.answerClass === "ONLY_I").length} / II ${review.questions.filter((entry) => entry.answerClass === "ONLY_II").length}`,
    `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Data-family coverage", "", "| Family | Authorities | Review questions |", "|---|---:|---:|", ...familyRows, "",
    ...review.questions.map(render),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp009-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp009ReviewMarkdown(), "utf8");
}