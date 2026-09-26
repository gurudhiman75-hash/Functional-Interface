import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP011_PROFILE_BY_AUTHORITY_ID } from "./cp011-multiple-factor-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const letter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);
function render(question: GeneratedSifQuestion, index: number): string {
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`,
    `**Multiple-factor family:** ${SIF_CP011_PROFILE_BY_AUTHORITY_ID[question.scenarioId].family}`,
    `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`), "",
    `**Answer:** ${letter(question)}. ${question.options[question.correctIndex]}`, "",
    `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp011ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP011");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP011", locale: "en-IN", seed: 91_032 });
  const families = [...new Set(authorities.map((entry) => SIF_CP011_PROFILE_BY_AUTHORITY_ID[entry.id].family))];
  const familyRows = families.map((family) => `| ${family} | ${authorities.filter((entry) => SIF_CP011_PROFILE_BY_AUTHORITY_ID[entry.id].family === family).length} | ${review.questions.filter((entry) => SIF_CP011_PROFILE_BY_AUTHORITY_ID[entry.scenarioId].family === family).length} |`);
  const parity = [91_008, 91_009, 91_013, 91_019].flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP011", locale, seed })));
  return [
    "# SIF-CP011 — Multiple-Factor Inference — Review V1", "",
    "**Status:** Human-review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference",
    "**Difficulty:** Medium to Hard", "**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked", "",
    "## Review focus", "",
    "- read multi-factor relationships in if/then, only-if, unless, provided-that and whenever statements;",
    "- track necessary and sufficient conditions without reversing a one-way rule;",
    "- distinguish the condition that is required from a condition that is sufficient;",
    "- avoid inferring a condition from its outcome unless the rule permits that direction.", "",
    `**Authority pool:** ${authorities.length} trilingual scenarios across ${families.length} multiple-factor families`,
    `**Review sample:** ${review.questions.length} distinct scenarios; three from each family`,
    `**Difficulty mix:** ${review.effectiveDistribution.MEDIUM} Medium; Easy ${review.effectiveDistribution.EASY}; Hard ${review.effectiveDistribution.HARD}`,
    `**Answer positions:** I ${review.questions.filter((entry) => entry.answerClass === "ONLY_I").length} / II ${review.questions.filter((entry) => entry.answerClass === "ONLY_II").length}`,
    `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Conditional-family coverage", "", "| Family | Authorities | Review questions |", "|---|---:|---:|", ...familyRows, "",
    ...review.questions.map(render),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp011-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp011ReviewMarkdown(), "utf8");
}