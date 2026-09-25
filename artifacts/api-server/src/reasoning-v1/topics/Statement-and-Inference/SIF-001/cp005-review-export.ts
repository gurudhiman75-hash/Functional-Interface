import { writeFileSync } from "node:fs";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP005_PROFILE_BY_AUTHORITY_ID, type SifCp005ReasonKind } from "./cp005-suggestive-reason-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import type { GeneratedSifQuestion } from "./types.ts";

const letter = (question: GeneratedSifQuestion) => String.fromCharCode(65 + question.correctIndex);

function renderQuestion(question: GeneratedSifQuestion, index: number): string {
  const profile = SIF_CP005_PROFILE_BY_AUTHORITY_ID[question.scenarioId];
  return [
    `## Q${index + 1} · ${question.scenarioId}`, "",
    `**Difficulty:** ${question.difficulty}`, `**Context:** ${question.domain}`, `**Evidence pattern:** ${profile.kind}`, `**Controlled overreach:** ${profile.trap}`, `**Answer state:** ${question.answerClass}`, "",
    `**Instruction:** ${question.instruction}`, "", `**Statement:** ${question.statement}`, "",
    `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`), "",
    `**Answer:** ${letter(question)}. ${question.options[question.correctIndex]}`, "", `**Explanation:** ${question.explanation}`, "",
    `**Validation:** ${question.validation.every((gate) => gate.passed) ? "10/10 gates passed" : "FAILED"}`, "", "---", "",
  ].join("\n");
}

export function buildSifCp005ReviewMarkdown(): string {
  const authorities = listSifAuthorities("SIF-CP005");
  const review = buildSifCpReviewPack({ cpId: "SIF-CP005", locale: "en-IN", seed: 50_000 });
  const kinds = ["DEMAND_SIGNAL", "CONVERGING_CLUES", "LOCALIZED_PATTERN", "CONTROLLED_CHANGE", "OPERATIONAL_EVIDENCE", "RESOURCE_PRESSURE", "SERVICE_PATTERN", "ALTERNATIVE_CAUSE_LIMIT"] as const satisfies readonly SifCp005ReasonKind[];
  const kindRows = kinds.map((kind) => `| ${kind} | ${authorities.filter((entry) => SIF_CP005_PROFILE_BY_AUTHORITY_ID[entry.id]?.kind === kind).length} | ${review.questions.filter((entry) => SIF_CP005_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.kind === kind).length} |`);
  const domainRows = [...new Set(authorities.map((entry) => entry.domain))].sort().map((domain) => `| ${domain} | ${authorities.filter((entry) => entry.domain === domain).length} |`);
  const paritySeeds = [50_000, 50_001, 50_002, 50_007, 50_008, 50_009];
  const parity = paritySeeds.flatMap((seed) => (["en-IN", "hi-IN", "pa-IN"] as const).map((locale) => generateSifQuestion({ cpId: "SIF-CP005", locale, seed })));
  return [
    "# SIF-CP005 — Cause/Reason Suggestive Inference — Review V1", "",
    "**Status:** Human review candidate; not frozen", "**Chapter:** SIF-001 — Statement & Inference", "**Runtime:** Structured evidence → degree of support → answer → language", "**Difficulty contract:** Medium only, per approved blueprint", "**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked", "",
    "## Review focus", "",
    "- judge whether surrounding evidence supports a likely contributing reason;",
    "- do not treat sequence alone as proof of cause; look for corroborating, localized, comparative or operational evidence;",
    "- use cautious inference language and reject sole-cause, certainty, motive and scope overclaims;",
    "- keep purpose/intention questions in CP006 and formal cause/effect pairs in CAE-001;",
    "- natural situations, concise statements and evidence-led explanations in English, Hindi and Punjabi.", "",
    `**Authority pool:** ${authorities.length} distinct scenarios`,
    `**Review coverage:** ${new Set(review.questions.map((entry) => entry.scenarioId)).size} distinct scenarios; three from each evidence pattern`,
    `**Difficulty balance:** ${review.questions.filter((entry) => entry.difficulty === "EASY").length} Easy / ${review.questions.filter((entry) => entry.difficulty === "MEDIUM").length} Medium / ${review.questions.filter((entry) => entry.difficulty === "HARD").length} Hard`,
    `**Answer positions:** I ${review.questions.filter((entry) => entry.answerClass === "ONLY_I").length} / II ${review.questions.filter((entry) => entry.answerClass === "ONLY_II").length}`,
    `**Automated gates:** ${review.questions.every((entry) => entry.validation.every((gate) => gate.passed)) ? "PASS" : "FAIL"}`, "",
    "## Evidence-pattern coverage", "", "| Evidence pattern | Authorities | Review questions |", "|---|---:|---:|", ...kindRows, "",
    "## Context coverage", "", "| Context domain | Authorities |", "|---|---:|", ...domainRows, "",
    ...review.questions.map(renderQuestion),
    "# Multilingual parity spot-check", "",
    ...parity.map((question) => [`## ${question.scenarioId} · ${question.locale}`, "", `**Statement:** ${question.statement}`, "", `**Inference I:** ${question.inferences[0]}`, `**Inference II:** ${question.inferences[1]}`, "", `**Answer state:** ${question.answerClass}`, "", `**Explanation:** ${question.explanation}`, "", "---", ""].join("\n")),
  ].join("\n");
}

if (process.argv[1]?.includes("cp005-review-export")) {
  const outputPath = process.argv[2];
  if (!outputPath) throw new Error("Output path is required.");
  writeFileSync(outputPath, buildSifCp005ReviewMarkdown(), "utf8");
}
