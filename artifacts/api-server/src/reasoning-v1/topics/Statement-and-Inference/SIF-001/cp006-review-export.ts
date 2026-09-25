import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP006_PROFILE_BY_AUTHORITY_ID } from "./cp006-purpose-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const answerLetter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);
function render(question: GeneratedSifQuestion, index: number): string {
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`,
    `**Purpose family:** ${SIF_CP006_PROFILE_BY_AUTHORITY_ID[question.scenarioId].family}`,
    `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`), "",
    `**Answer:** ${answerLetter(question)}. ${question.options[question.correctIndex]}`, "",
    `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp006ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP006");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP006", locale: "en-IN", seed: 60_000 });
  const families = [...new Set(authorities.map((entry) => SIF_CP006_PROFILE_BY_AUTHORITY_ID[entry.id].family))];
  const familyRows = families.map((family) => `| ${family} | ${authorities.filter((entry) => SIF_CP006_PROFILE_BY_AUTHORITY_ID[entry.id].family === family).length} | ${review.questions.filter((entry) => SIF_CP006_PROFILE_BY_AUTHORITY_ID[entry.scenarioId].family === family).length} |`);
  const domains = [...new Set(authorities.map((entry) => entry.domain))].sort();
  const parity = [60_000, 60_001, 60_006, 60_007].flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP006", locale, seed })));
  return [
    "# SIF-CP006 — Intention / Purpose Inference — Review V1", "",
    "**Status:** Human review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference",
    "**Difficulty:** Medium only", "**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked", "",
    "## Review focus", "",
    "- infer the likely practical purpose of a stated action from the action and its surrounding need;",
    "- keep the inference proportionate: likely purpose does not establish success, exclusivity or a hidden motive;",
    "- reject unsupported claims about blame, concealment or deliberate earlier neglect;",
    "- keep CP006 distinct from CP005 contributing-cause inference, formal Cause & Effect, and advice about what should be done;",
    "- review concise, exam-style English, Hindi and Punjabi wording.", "",
    `**Authority pool:** ${authorities.length} scenarios across ${families.length} purpose families and ${domains.length} context domains`,
    `**Review sample:** ${review.questions.length} distinct scenarios; three from each family`,
    `**Answer positions:** I ${review.questions.filter((entry) => entry.answerClass === "ONLY_I").length} / II ${review.questions.filter((entry) => entry.answerClass === "ONLY_II").length}`,
    `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Purpose-family coverage", "", "| Family | Authorities | Review questions |", "|---|---:|---:|", ...familyRows, "",
    "## Context-domain coverage", "", ...domains.map((domain) => `- ${domain}`), "",
    ...review.questions.map(render),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp006-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp006ReviewMarkdown(), "utf8");
}
