import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP007_PROFILE_BY_AUTHORITY_ID } from "./cp007-negative-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const letter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);
function render(question: GeneratedSifQuestion, index: number): string {
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`,
    `**Wording family:** ${SIF_CP007_PROFILE_BY_AUTHORITY_ID[question.scenarioId].family}`,
    `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`), "",
    `**Answer:** ${letter(question)}. ${question.options[question.correctIndex]}`, "",
    `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp007ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP007");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP007", locale: "en-IN", seed: 70_000 });
  const families = [...new Set(authorities.map((entry) => SIF_CP007_PROFILE_BY_AUTHORITY_ID[entry.id].family))];
  const familyRows = families.map((family) => `| ${family} | ${authorities.filter((entry) => SIF_CP007_PROFILE_BY_AUTHORITY_ID[entry.id].family === family).length} | ${review.questions.filter((entry) => SIF_CP007_PROFILE_BY_AUTHORITY_ID[entry.scenarioId].family === family).length} |`);
  const difficulty = `**Difficulty mix:** ${review.effectiveDistribution.MEDIUM} Medium / ${review.effectiveDistribution.HARD} Hard`;
  const positions = `**Answer positions:** I ${review.questions.filter((entry) => entry.answerClass === "ONLY_I").length} / II ${review.questions.filter((entry) => entry.answerClass === "ONLY_II").length}`;
  const parity = [70_000, 70_001, 70_005, 70_011].flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP007", locale, seed })));
  return [
    "# SIF-CP007 — Negative and Restrictive Statements — Review V1", "",
    "**Status:** Human review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference",
    "**Difficulty scope:** Medium to Hard", "**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked", "",
    "## Review focus", "",
    "- interpret negative quantifiers and restrictive words within their stated scope;",
    "- distinguish ‘not every’ from ‘none’, and retain the correct direction of ‘only’ and ‘unless’;",
    "- distinguish inability from unwillingness, and missing records from proof that an event did not occur;",
    "- keep exceptions limited to the named group and treat ‘neither’, ‘not necessarily’ and ‘no longer’ precisely;",
    "- use only the supplied facts; do not turn the task into assumption, conclusion, advice or cause/effect reasoning.", "",
    `**Authority pool:** ${authorities.length} trilingual scenarios across ${families.length} wording families`,
    `**Review sample:** ${review.questions.length} distinct scenarios; three from each family`, difficulty, positions,
    `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Wording-family coverage", "", "| Family | Authorities | Review questions |", "|---|---:|---:|", ...familyRows, "",
    ...review.questions.map(render),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp007-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp007ReviewMarkdown(), "utf8");
}
