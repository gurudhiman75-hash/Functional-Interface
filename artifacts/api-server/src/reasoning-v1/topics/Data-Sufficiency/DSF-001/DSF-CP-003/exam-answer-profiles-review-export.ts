import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { SufficiencyClass } from "../foundation/index.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  DSF_CP003_EXAM_PROFILE_AUTHORITY,
  generateDsfExamProfileBatch,
  type DsfExamAnswerProfileId,
  type DsfExamProfileQuestion,
} from "./exam-answer-profiles-v1.ts";

const REVIEW_PROFILES = [
  "BANKING_STANDARD_5_EN",
  "BANKING_BOB_2015_5_EN",
  "SSC_CGL_TIER2_2023_4_EN",
  "SSC_CGL_TIER2_2024_4_EN",
] as const satisfies readonly DsfExamAnswerProfileId[];

const MODE_MATRIX = [
  { domain: "NUMBER_SYSTEM", solveMode: "DSF-SM-NUM-MISSING-DIGIT" },
  { domain: "NUMBER_SYSTEM", solveMode: "DSF-SM-NUM-DIGIT-PARITY" },
  { domain: "RATIO_PROPORTION", solveMode: "DSF-SM-RAP-RATIO-AB" },
  { domain: "RATIO_PROPORTION", solveMode: "DSF-SM-RAP-GREATER-QUANTITY" },
  { domain: "PERCENTAGE", solveMode: "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE" },
  { domain: "PERCENTAGE", solveMode: "DSF-SM-PCT-FINAL-DIRECTION" },
  { domain: "ALGEBRA", solveMode: "DSF-SM-ALG-SINGLE-VARIABLE-X" },
  { domain: "ALGEBRA", solveMode: "DSF-SM-ALG-LINEAR-SYSTEM-X" },
] as const;

function questionsForProfile(profileId: (typeof REVIEW_PROFILES)[number]): DsfExamProfileQuestion[] {
  const profile = DSF_CP003_ANSWER_PROFILES.find((entry) => entry.id === profileId)!;
  return Array.from({ length: 10 }, (_, index) => {
    const mode = MODE_MATRIX[index % MODE_MATRIX.length]!;
    const semanticClass = profile.representedSemanticClasses[index % profile.representedSemanticClasses.length]!;
    return generateDsfExamProfileBatch({
      answerProfile: profileId,
      domain: mode.domain,
      solveMode: mode.solveMode,
      semanticClass,
      count: 1,
      seed: `dsf-cp003-review:${profileId}:${index}`,
    }).questions[0]!;
  });
}

const questions = REVIEW_PROFILES.flatMap(questionsForProfile);

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function profileLabel(profileId: DsfExamAnswerProfileId): string {
  return DSF_CP003_ANSWER_PROFILES.find((entry) => entry.id === profileId)?.label ?? profileId;
}

function renderQuestion(question: DsfExamProfileQuestion, ordinal: number): string {
  return `
  <article class="question">
    <header>
      <div><strong>Q${ordinal}</strong> · ${escapeHtml(question.domainLabel)} · ${escapeHtml(question.solveModeId)} · ${escapeHtml(question.difficulty)}</div>
      <span class="badge">${escapeHtml(question.answerProfile)}</span>
    </header>
    <div class="meta">${escapeHtml(question.examFamily)} · ${escapeHtml(question.profileEvidenceLevel)} · ${escapeHtml(question.canonicalAnswer)}</div>
    <p class="stem">${escapeHtml(question.stem)}</p>
    <div class="statement"><strong>Statement I:</strong> ${escapeHtml(question.statements[0].text)}</div>
    <div class="statement"><strong>Statement II:</strong> ${escapeHtml(question.statements[1].text)}</div>
    <ol type="A" class="options">${question.options.map((option) => `<li class="${option.isCorrect ? "correct" : ""}">${escapeHtml(option.value)}${option.isCorrect ? " ✓" : ""}</li>`).join("")}</ol>
    <section class="solution">
      <h3>Solution</h3>
      ${question.explanation.steps.map((step) => `<p>${escapeHtml(step)}</p>`).join("")}
    </section>
    <details>
      <summary>Profile diagnostics</summary>
      <div class="grid">
        <div><strong>Profile</strong><br>${escapeHtml(profileLabel(question.answerProfile))}</div>
        <div><strong>Option count</strong><br>${question.options.length}</div>
        <div><strong>Represented classes</strong><br>${escapeHtml(question.profileRepresentedSemanticClasses.join(", "))}</div>
        <div><strong>Omitted classes</strong><br>${escapeHtml(question.profileOmittedSemanticClasses.join(", ") || "none")}</div>
        <div><strong>Source-pattern IDs</strong><br>${escapeHtml(question.profileSourcePatternIds.join(", ") || "internal canonical")}</div>
        <div><strong>Source question ID</strong><br>${escapeHtml(question.sourceQuestionId)}</div>
        <div><strong>Profile question ID</strong><br>${escapeHtml(question.questionId)}</div>
        <div><strong>Semantic preservation</strong><br>${question.validation.semanticTruthPreserved ? "PASS" : "FAIL"}</div>
      </div>
    </details>
  </article>`;
}

const profileCounts = Object.fromEntries(REVIEW_PROFILES.map((profileId) => [
  profileId,
  questions.filter((question) => question.answerProfile === profileId).length,
]));
const classCounts = Object.fromEntries([
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
  "EACH_STATEMENT_ALONE",
  "BOTH_TOGETHER_ONLY",
  "INSUFFICIENT_EVEN_TOGETHER",
].map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass as SufficiencyClass).length,
]));
const solveModes = [...new Set(questions.map((question) => question.solveModeId))].sort();
const domains = [...new Set(questions.map((question) => question.domain))].sort();

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ExamTree DSF CP-003 Exam Profile Review</title>
<style>
body{font-family:system-ui,sans-serif;background:#f5f5f5;color:#171717;margin:0}.wrap{max-width:980px;margin:auto;padding:24px 14px 60px}.top,.question{background:white;border:1px solid #ddd;border-radius:12px;padding:18px;margin:14px 0}.question header{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-bottom:1px solid #eee;padding-bottom:10px}.badge,.summary span{display:inline-block;border:1px solid #ccc;border-radius:999px;padding:4px 8px;font-size:12px}.meta{font-size:12px;color:#666;margin-top:10px}.stem{font-size:17px;line-height:1.5}.statement{padding:9px 11px;margin:7px 0;background:#fafafa;border-left:3px solid #777}.options{line-height:1.55}.options li{padding:4px 7px;margin:3px 0}.correct{font-weight:700;background:#f2f2f2;border-radius:6px}.solution{border-top:1px solid #eee;margin-top:14px;padding-top:10px;line-height:1.5}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin-top:10px}.grid>div{border:1px solid #ddd;border-radius:7px;padding:8px;font-size:12px}.summary{display:flex;gap:7px;flex-wrap:wrap}.note{color:#555;line-height:1.5}</style>
</head><body><main class="wrap">
<section class="top">
<h1>Data Sufficiency · CP-003 Banking + SSC Answer Profile Review</h1>
<p class="note">Human-review artifact for exam-profile rendering only. CP-001 semantic truth remains frozen. SSC four-option profiles exclude unrepresentable semantic classes instead of relabelling them. Punjab-specific rendering remains disabled. Question Bank, tests, mocks and public publication remain locked.</p>
<div class="summary">
<span>Questions: ${questions.length}</span><span>Profiles: ${REVIEW_PROFILES.length}</span><span>Domains: ${domains.length}</span><span>Solve modes: ${solveModes.length}</span>
${REVIEW_PROFILES.map((profileId) => `<span>${escapeHtml(profileId)}: ${profileCounts[profileId]}</span>`).join("")}
</div></section>
${questions.map((question, index) => renderQuestion(question, index + 1)).join("\n")}
</main></body></html>`;

const outputDirectory = resolve(process.cwd(), "dist/reasoning-v1/dsf");
mkdirSync(outputDirectory, { recursive: true });
const htmlPath = resolve(outputDirectory, "dsf-cp003-exam-answer-profiles-review.html");
const jsonPath = resolve(outputDirectory, "dsf-cp003-exam-answer-profiles-review.json");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, JSON.stringify({
  packageId: "DSF-001",
  profileCheckpointId: "DSF-CP-003",
  authority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
  reviewProfiles: REVIEW_PROFILES,
  profileCounts,
  classCounts,
  domains,
  solveModes,
  punjabSpecificProfileEnabled: false,
  downstreamLocked: true,
  questions,
}, null, 2), "utf8");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_003_EXAM_PROFILE_REVIEW_EXPORT",
  htmlPath,
  jsonPath,
  questions: questions.length,
  profileCounts,
  classCounts,
  domains,
  solveModes,
}, null, 2));
