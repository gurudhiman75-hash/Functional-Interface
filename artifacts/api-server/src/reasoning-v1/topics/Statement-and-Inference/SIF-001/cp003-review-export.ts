import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP003_PROFILE_BY_AUTHORITY_ID, type SifCp003QuantifierKind } from "./cp003-quantifier-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const letter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);

function renderQuestion(question: GeneratedSifQuestion, index: number): string {
  const profile = SIF_CP003_PROFILE_BY_AUTHORITY_ID[question.scenarioId];
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`, `**Quantifier:** ${profile.quantifier}`, `**Controlled trap:** ${profile.trap}`, `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`), "",
    `**Answer:** ${letter(question)}. ${question.options[question.correctIndex]}`, "", `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp003ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP003");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP003", locale: "en-IN", seed: 30_000 });
  const kinds = ["ALL", "SOME", "NONE", "MANY", "MOST", "FEW", "ONLY", "AT_LEAST", "NOT_ALL", "SEVERAL"] as const satisfies readonly SifCp003QuantifierKind[];
  const kindRows = kinds.map((kind) => `| ${kind} | ${authorities.filter((entry) => SIF_CP003_PROFILE_BY_AUTHORITY_ID[entry.id]?.quantifier === kind).length} | ${review.questions.filter((entry) => SIF_CP003_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.quantifier === kind).length} |`);
  const domainRows = [...new Set(authorities.map((entry) => entry.domain))].sort().map((domain) => `| ${domain} | ${authorities.filter((entry) => entry.domain === domain).length} |`);
  const answerRows = ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const;
  const paritySeeds = [30_000, 30_001, 30_002, 30_007, 30_008, 30_009];
  const parity = paritySeeds.flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP003", locale, seed })));
  return [
    "# SIF-CP003 — Quantifier-Based Inference — Review V1", "",
    "**Status:** Human review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference", "**Runtime:** Structured quantifier fact → valid/controlled-invalid inference → answer → language", "**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked", "",
    "## Review focus", "",
    "- correct interpretation of all, some, none, many, most, a few, only, at least, not all and several;",
    "- no illicit conversion from some to all, many to most, most to all, at least to exactly, or only to its converse;",
    "- natural exam-grade contexts rather than abstract letter-set exercises;",
    "- visible Easy/Medium/Hard separation;",
    "- simple evidence-led explanations in English, Hindi and Punjabi;",
    "- logic and answer identity fixed before language rendering.", "",
    `**Authority pool:** ${authorities.length} distinct scenarios`,
    `**Review coverage:** ${new Set(review.questions.map((entry) => entry.scenarioId)).size} distinct scenarios shown; no repeats`,
    `**Difficulty balance:** ${review.questions.filter((entry) => entry.difficulty === "EASY").length} Easy / ${review.questions.filter((entry) => entry.difficulty === "MEDIUM").length} Medium / ${review.questions.filter((entry) => entry.difficulty === "HARD").length} Hard`,
    `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Quantifier coverage", "", "| Quantifier family | Authorities | Review questions |", "|---|---:|---:|", ...kindRows, "",
    "## Context coverage", "", "| Context domain | Authorities |", "|---|---:|", ...domainRows, "",
    "## Review answer-state coverage", "", "| Answer state | Questions |", "|---|---:|", ...answerRows.map((state) => `| ${state} | ${review.questions.filter((entry) => entry.answerClass === state).length} |`), "",
    ...review.questions.map(renderQuestion),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp003-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp003ReviewMarkdown(), "utf8");
}
