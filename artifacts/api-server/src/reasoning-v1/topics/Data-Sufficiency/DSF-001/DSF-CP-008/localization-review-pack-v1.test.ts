import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { DSF_CP002_DOMAINS } from "../DSF-CP-002/question-studio-integration-v1.ts";
import { DSF_CP003_ANSWER_PROFILES } from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import {
  DSF_CP008_LOCALIZATION_AUTHORITY,
  DSF_CP008_LOCALIZED_LANGUAGES,
  generateDsfLocalizedExamProfileBatch,
  type DsfLocalizedExamProfileQuestion,
  type DsfLocalizedLanguage,
} from "./localization-review-v1.ts";

interface ReviewItem {
  reviewId: string;
  language: DsfLocalizedLanguage;
  purpose: "SOLVE_MODE" | "PROFILE_SEMANTIC";
  question: DsfLocalizedExamProfileQuestion;
}

const items: ReviewItem[] = [];

for (const language of DSF_CP008_LOCALIZED_LANGUAGES) {
  for (const domain of DSF_CP002_DOMAINS) {
    for (const solveMode of domain.solveModes) {
      const question = generateDsfLocalizedExamProfileBatch({
        language,
        seed: `cp008-review-mode:${language}:${solveMode}`,
        count: 1,
        solveMode,
        answerProfile: "GENERIC_DS_STANDARD_5_EN",
      }).questions[0]!;
      items.push({
        reviewId: `DSF-CP008-${language.toUpperCase()}-MODE-${String(items.length + 1).padStart(3, "0")}`,
        language,
        purpose: "SOLVE_MODE",
        question,
      });
    }
  }

  for (const profile of DSF_CP003_ANSWER_PROFILES) {
    for (const semanticClass of profile.representedSemanticClasses) {
      const question = generateDsfLocalizedExamProfileBatch({
        language,
        seed: `cp008-review-profile:${language}:${profile.id}:${semanticClass}`,
        count: 1,
        semanticClass,
        answerProfile: profile.id,
      }).questions[0]!;
      items.push({
        reviewId: `DSF-CP008-${language.toUpperCase()}-PROFILE-${String(items.length + 1).padStart(3, "0")}`,
        language,
        purpose: "PROFILE_SEMANTIC",
        question,
      });
    }
  }
}

assert.equal(items.length, 62, "CP-008 human review pack must contain 31 Hindi + 31 Punjabi questions");
assert.equal(items.filter((item) => item.language === "hi").length, 31);
assert.equal(items.filter((item) => item.language === "pa").length, 31);
for (const domain of DSF_CP002_DOMAINS) {
  for (const solveMode of domain.solveModes) {
    assert.ok(items.some((item) => item.language === "hi" && item.question.solveModeId === solveMode));
    assert.ok(items.some((item) => item.language === "pa" && item.question.solveModeId === solveMode));
  }
}
for (const profile of DSF_CP003_ANSWER_PROFILES) {
  assert.ok(items.some((item) => item.language === "hi" && item.question.answerProfile === profile.id));
  assert.ok(items.some((item) => item.language === "pa" && item.question.answerProfile === profile.id));
}

function countBy(values: readonly string[]) {
  const out: Record<string, number> = {};
  for (const value of values) out[value] = (out[value] ?? 0) + 1;
  return out;
}

const summary = {
  authority: DSF_CP008_LOCALIZATION_AUTHORITY,
  reviewPackId: "DSF-CP008-HI-PA-REVIEW-62-2026-08-23",
  questionCount: items.length,
  languageCounts: countBy(items.map((item) => item.language)),
  profileCounts: countBy(items.map((item) => item.question.answerProfile)),
  domainCounts: countBy(items.map((item) => item.question.domain)),
  solveModeCounts: countBy(items.map((item) => item.question.solveModeId)),
  semanticClassCounts: countBy(items.map((item) => item.question.canonicalAnswer)),
  purposeCounts: countBy(items.map((item) => item.purpose)),
  permanentQlIds: ["DSF-QL-001"],
  nextAvailableQlId: "DSF-QL-002",
  humanLanguageReviewRequired: true,
  localizedDownstreamLocked: true,
};

const outputDir = resolve(process.cwd(), process.env.DSF_CP008_REVIEW_DIR || "dist/reasoning-v1/dsf-cp008-localization-review");
mkdirSync(outputDir, { recursive: true });

const payload = {
  summary,
  questions: items.map((item, index) => ({
    number: index + 1,
    reviewId: item.reviewId,
    language: item.language,
    locale: item.question.locale,
    purpose: item.purpose,
    questionId: item.question.questionId,
    canonicalEnglishProfileQuestionId: item.question.canonicalEnglishProfileQuestionId,
    sourceQuestionId: item.question.sourceQuestionId,
    qlId: item.question.qlId,
    domain: item.question.domain,
    sourceChapterId: item.question.sourceChapterId,
    solveModeId: item.question.solveModeId,
    difficulty: item.question.difficulty,
    answerProfile: item.question.answerProfile,
    examFamily: item.question.examFamily,
    canonicalAnswer: item.question.canonicalAnswer,
    stem: item.question.stem,
    questionPrompt: item.question.questionPrompt,
    statements: item.question.statements,
    options: item.question.options,
    correctIndex: item.question.correctIndex,
    explanation: item.question.explanation,
    localization: item.question.localization,
  })),
};

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const cards = items.map((item, index) => {
  const q = item.question;
  const statementI = q.language === "hi" ? "कथन I" : "ਕਥਨ I";
  const statementII = q.language === "hi" ? "कथन II" : "ਕਥਨ II";
  const solutionLabel = q.language === "hi" ? "समाधान" : "ਹੱਲ";
  const answerLabel = q.language === "hi" ? "उत्तर" : "ਉੱਤਰ";
  const options = q.options.map((option) => `<li class="${option.isCorrect ? "correct" : ""}"><strong>${option.key}.</strong> ${escapeHtml(option.value)}</li>`).join("");
  const steps = q.explanation.steps.map((step) => `<p>${escapeHtml(step)}</p>`).join("");
  return `<article class="question">
    <div class="meta"><span>#${index + 1}</span><span>${escapeHtml(item.reviewId)}</span><span>${q.language === "hi" ? "Hindi" : "Punjabi"}</span><span>${escapeHtml(item.purpose)}</span><span>${escapeHtml(q.domain)}</span><span>${escapeHtml(q.solveModeId)}</span><span>${escapeHtml(q.answerProfile)}</span><span>${escapeHtml(q.canonicalAnswer)}</span></div>
    <h2>${escapeHtml(q.stem)}</h2>
    <div class="statements"><p><strong>${statementI}:</strong> ${escapeHtml(q.statements[0].text)}</p><p><strong>${statementII}:</strong> ${escapeHtml(q.statements[1].text)}</p></div>
    <ol class="options" type="A">${options}</ol>
    <div class="answer"><strong>${answerLabel}:</strong> ${escapeHtml(q.options[q.correctIndex]!.value)}</div>
    <section class="solution"><h3>${solutionLabel}</h3>${steps}</section>
    <details><summary>Parity metadata</summary><pre>${escapeHtml(JSON.stringify({
      questionId: q.questionId,
      canonicalEnglishProfileQuestionId: q.canonicalEnglishProfileQuestionId,
      semanticClass: q.canonicalAnswer,
      correctIndex: q.correctIndex,
      localization: q.localization,
    }, null, 2))}</pre></details>
  </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DSF CP-008 Hindi/Punjabi Localization Review</title>
<style>
body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;margin:0;background:#f6f7f9;color:#111827}main{max-width:1100px;margin:auto;padding:32px}.summary,.question{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:20px}.meta{display:flex;flex-wrap:wrap;gap:7px;font-size:12px;color:#4b5563}.meta span{border:1px solid #d1d5db;border-radius:999px;padding:4px 8px}.question h2{font-size:18px;line-height:1.65}.statements,.solution{border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;line-height:1.65}.options{line-height:1.65}.options li{padding:7px 10px;margin:5px 0;border:1px solid #e5e7eb;border-radius:8px}.options li.correct{border-color:#16a34a;background:#f0fdf4}.answer{margin:12px 0;padding:10px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px}.solution p{margin:7px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f9fafb;padding:10px;border-radius:8px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #e5e7eb;padding:7px;text-align:left}
</style></head><body><main>
<section class="summary"><h1>DSF-CP-008 Hindi/Punjabi Localization Review Pack</h1><p><strong>62 questions:</strong> 31 Hindi + 31 Punjabi. This pack is for human language/editorial review only. Semantic parity is executable-proved; localized Question Bank/test/mock/publication gates remain locked.</p><pre>${escapeHtml(JSON.stringify(summary, null, 2))}</pre></section>
${cards}
</main></body></html>`;

writeFileSync(resolve(outputDir, "dsf-cp008-hi-pa-localization-review.json"), JSON.stringify(payload, null, 2), "utf8");
writeFileSync(resolve(outputDir, "dsf-cp008-hi-pa-localization-review.html"), html, "utf8");

console.log(JSON.stringify({
  status: "PASS_DSF_CP008_HUMAN_REVIEW_PACK",
  ...summary,
  outputDir,
}, null, 2));
