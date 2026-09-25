import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP004_PROFILE_BY_AUTHORITY_ID, type SifCp004ComparisonKind } from "./cp004-comparison-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const letter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);

function renderQuestion(question: GeneratedSifQuestion, index: number): string {
  const profile = SIF_CP004_PROFILE_BY_AUTHORITY_ID[question.scenarioId];
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`, `**Comparison family:** ${profile.kind}`, `**Controlled trap:** ${profile.trap}`, `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`), "",
    `**Answer:** ${letter(question)}. ${question.options[question.correctIndex]}`, "", `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp004ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP004");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP004", locale: "en-IN", seed: 40_000 });
  const kinds = ["MORE_LESS", "RANKING", "TIME_ORDER", "AGE", "CHANGE", "SIZE", "MEASURED_QUALITY", "FREQUENCY"] as const satisfies readonly SifCp004ComparisonKind[];
  const kindRows = kinds.map((kind) => `| ${kind} | ${authorities.filter((entry) => SIF_CP004_PROFILE_BY_AUTHORITY_ID[entry.id]?.kind === kind).length} | ${review.questions.filter((entry) => SIF_CP004_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.kind === kind).length} |`);
  const domainRows = [...new Set(authorities.map((entry) => entry.domain))].sort().map((domain) => `| ${domain} | ${authorities.filter((entry) => entry.domain === domain).length} |`);
  const paritySeeds = [40_000, 40_001, 40_002, 40_007, 40_008, 40_009];
  const parity = paritySeeds.flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP004", locale, seed })));
  return [
    "# SIF-CP004 — Comparison and Relationship Inference — Review V1", "",
    "**Status:** Human review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference", "**Runtime:** Structured comparison fact → supported/unsupported inference → answer → language", "**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked", "",
    "## Review focus", "",
    "- more/less, higher/lower, order, age, change, size, frequency and explicitly measured quality;",
    "- no invented difference size, converse ranking, cause, absolute age or unreported measure;",
    "- temporal order stays separate from cause and effect;",
    "- natural exam-grade situations with clear comparison scope;",
    "- Easy/Medium separation, clear explanations and English/Hindi/Punjabi answer parity.", "",
    `**Authority pool:** ${authorities.length} distinct comparison scenarios`,
    `**Review coverage:** ${new Set(review.questions.map((entry) => entry.scenarioId)).size} distinct scenarios shown; no repeats`,
    `**Difficulty balance:** ${review.questions.filter((entry) => entry.difficulty === "EASY").length} Easy / ${review.questions.filter((entry) => entry.difficulty === "MEDIUM").length} Medium`,
    `**Answer positions:** I ${review.questions.filter((entry) => entry.answerClass === "ONLY_I").length} / II ${review.questions.filter((entry) => entry.answerClass === "ONLY_II").length}`, `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Comparison-family coverage", "", "| Family | Authorities | Review questions |", "|---|---:|---:|", ...kindRows, "",
    "## Context coverage", "", "| Context domain | Authorities |", "|---|---:|", ...domainRows, "",
    ...review.questions.map(renderQuestion),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp004-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp004ReviewMarkdown(), "utf8");
}
