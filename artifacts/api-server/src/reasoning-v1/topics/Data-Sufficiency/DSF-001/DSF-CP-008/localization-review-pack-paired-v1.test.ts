import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { DSF_CP002_DOMAINS } from "../DSF-CP-002/question-studio-integration-v1.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  generateDsfExamProfileBatch,
  type DsfExamProfileQuestion,
} from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import {
  DSF_CP008_LOCALIZATION_AUTHORITY,
  DSF_CP008_LOCALIZED_LANGUAGES,
  generateDsfLocalizedExamProfileBatch,
  type DsfLocalizedExamProfileQuestion,
  type DsfLocalizedLanguage,
} from "./localization-review-v1.ts";

interface PairedReviewItem {
  reviewId: string;
  language: DsfLocalizedLanguage;
  purpose: "SOLVE_MODE" | "PROFILE_SEMANTIC";
  english: DsfExamProfileQuestion;
  localized: DsfLocalizedExamProfileQuestion;
}

function pairedQuestion(
  language: DsfLocalizedLanguage,
  purpose: PairedReviewItem["purpose"],
  seed: string,
  filters: {
    solveMode?: (typeof DSF_CP002_DOMAINS)[number]["solveModes"][number];
    semanticClass?: DsfExamProfileQuestion["canonicalAnswer"];
    answerProfile: (typeof DSF_CP003_ANSWER_PROFILES)[number]["id"];
  },
  sequence: number,
): PairedReviewItem {
  const localized = generateDsfLocalizedExamProfileBatch({
    language,
    seed,
    count: 1,
    ...filters,
  }).questions[0]!;
  const english = generateDsfExamProfileBatch({
    language: "en",
    seed,
    count: 1,
    ...filters,
  }).questions[0]!;

  assert.equal(localized.canonicalEnglishProfileQuestionId, english.questionId);
  assert.equal(localized.sourceQuestionId, english.sourceQuestionId);
  assert.equal(localized.canonicalAnswer, english.canonicalAnswer);
  assert.equal(localized.correctIndex, english.correctIndex);
  assert.deepEqual(
    localized.options.map((option) => [option.key, option.semanticClass, option.isCorrect]),
    english.options.map((option) => [option.key, option.semanticClass, option.isCorrect]),
  );

  return {
    reviewId: `DSF-CP008-${language.toUpperCase()}-${purpose}-${String(sequence).padStart(3, "0")}`,
    language,
    purpose,
    english,
    localized,
  };
}

const items: PairedReviewItem[] = [];
let sequence = 0;

for (const language of DSF_CP008_LOCALIZED_LANGUAGES) {
  for (const domain of DSF_CP002_DOMAINS) {
    for (const solveMode of domain.solveModes) {
      sequence += 1;
      items.push(pairedQuestion(
        language,
        "SOLVE_MODE",
        `cp008-review-mode:${language}:${solveMode}`,
        { solveMode, answerProfile: "GENERIC_DS_STANDARD_5_EN" },
        sequence,
      ));
    }
  }

  for (const profile of DSF_CP003_ANSWER_PROFILES) {
    for (const semanticClass of profile.representedSemanticClasses) {
      sequence += 1;
      items.push(pairedQuestion(
        language,
        "PROFILE_SEMANTIC",
        `cp008-review-profile:${language}:${profile.id}:${semanticClass}`,
        { semanticClass, answerProfile: profile.id },
        sequence,
      ));
    }
  }
}

assert.equal(items.length, 62);
assert.equal(items.filter((item) => item.language === "hi").length, 31);
assert.equal(items.filter((item) => item.language === "pa").length, 31);

function countBy(values: readonly string[]) {
  const result: Record<string, number> = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return result;
}

const summary = {
  authority: DSF_CP008_LOCALIZATION_AUTHORITY,
  reviewPackId: "DSF-CP008-HI-PA-PAIRED-REVIEW-62-2026-08-23",
  questionCount: items.length,
  languageCounts: countBy(items.map((item) => item.language)),
  purposeCounts: countBy(items.map((item) => item.purpose)),
  profileCounts: countBy(items.map((item) => item.localized.answerProfile)),
  domainCounts: countBy(items.map((item) => item.localized.domain)),
  solveModeCounts: countBy(items.map((item) => item.localized.solveModeId)),
  semanticClassCounts: countBy(items.map((item) => item.localized.canonicalAnswer)),
  semanticParityExecutableProved: true,
  humanLanguageReviewRequired: true,
  localizedDownstreamLocked: true,
};

const outputDir = resolve(
  process.cwd(),
  process.env.DSF_CP008_REVIEW_DIR || "dist/reasoning-v1/dsf-cp008-localization-review",
);
mkdirSync(outputDir, { recursive: true });

function projection(question: DsfExamProfileQuestion | DsfLocalizedExamProfileQuestion) {
  return {
    questionId: question.questionId,
    stem: question.stem,
    questionPrompt: question.questionPrompt,
    statements: question.statements,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
    domain: question.domain,
    solveModeId: question.solveModeId,
    difficulty: question.difficulty,
    answerProfile: question.answerProfile,
  };
}

const payload = {
  summary,
  questions: items.map((item, index) => ({
    number: index + 1,
    reviewId: item.reviewId,
    language: item.language,
    locale: item.localized.locale,
    purpose: item.purpose,
    semanticLock: {
      canonicalEnglishProfileQuestionId: item.localized.canonicalEnglishProfileQuestionId,
      sourceQuestionId: item.localized.sourceQuestionId,
      canonicalAnswer: item.localized.canonicalAnswer,
      correctIndex: item.localized.correctIndex,
      optionSemanticOrder: item.localized.options.map((option) => option.semanticClass),
    },
    english: projection(item.english),
    localized: projection(item.localized),
    localization: item.localized.localization,
  })),
};

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function questionSurface(question: DsfExamProfileQuestion | DsfLocalizedExamProfileQuestion, localized: boolean) {
  const statementI = localized
    ? (question.locale === "hi-IN" ? "कथन I" : "ਕਥਨ I")
    : "Statement I";
  const statementII = localized
    ? (question.locale === "hi-IN" ? "कथन II" : "ਕਥਨ II")
    : "Statement II";
  const solution = localized
    ? (question.locale === "hi-IN" ? "समाधान" : "ਹੱਲ")
    : "Solution";
  const answer = localized
    ? (question.locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ")
    : "Answer";
  const options = question.options
    .map((option) => `<li class="${option.isCorrect ? "correct" : ""}"><strong>${option.key}.</strong> ${escapeHtml(option.value)}</li>`)
    .join("");
  const steps = question.explanation.steps.map((step) => `<p>${escapeHtml(step)}</p>`).join("");
  return `<section class="surface">
    <h3>${localized ? "Localized" : "Canonical English"}</h3>
    <p class="stem">${escapeHtml(question.stem)}</p>
    <div class="statements"><p><strong>${statementI}:</strong> ${escapeHtml(question.statements[0].text)}</p><p><strong>${statementII}:</strong> ${escapeHtml(question.statements[1].text)}</p></div>
    <ol class="options" type="A">${options}</ol>
    <div class="answer"><strong>${answer}:</strong> ${escapeHtml(question.options[question.correctIndex]!.value)}</div>
    <div class="solution"><h4>${solution}</h4>${steps}</div>
  </section>`;
}

const cards = items.map((item, index) => {
  const q = item.localized;
  return `<article class="question">
    <div class="meta"><span>#${index + 1}</span><span>${escapeHtml(item.reviewId)}</span><span>${item.language === "hi" ? "Hindi" : "Punjabi"}</span><span>${escapeHtml(item.purpose)}</span><span>${escapeHtml(q.domain)}</span><span>${escapeHtml(q.solveModeId)}</span><span>${escapeHtml(q.answerProfile)}</span><span>${escapeHtml(q.canonicalAnswer)}</span><span>correct ${q.options[q.correctIndex]!.key}</span></div>
    <div class="pair">${questionSurface(item.english, false)}${questionSurface(item.localized, true)}</div>
  </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DSF CP-008 Paired Hindi/Punjabi Review</title>
<style>
body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;margin:0;background:#f6f7f9;color:#111827}main{max-width:1500px;margin:auto;padding:28px}.summary,.question{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-bottom:20px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}.surface{border:1px solid #e5e7eb;border-radius:10px;padding:14px;min-width:0}.surface h3{margin-top:0}.stem{font-weight:600;line-height:1.65}.statements,.solution{border:1px solid #e5e7eb;border-radius:9px;padding:10px 13px;line-height:1.6}.options{line-height:1.55}.options li{padding:6px 9px;margin:5px 0;border:1px solid #e5e7eb;border-radius:7px}.options li.correct{border-color:#16a34a;background:#f0fdf4}.answer{margin:10px 0;padding:9px 11px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px}.meta{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;font-size:12px;color:#4b5563}.meta span{border:1px solid #d1d5db;border-radius:999px;padding:4px 8px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f9fafb;padding:10px;border-radius:8px}@media(max-width:900px){.pair{grid-template-columns:1fr}}
</style></head><body><main>
<section class="summary"><h1>DSF-CP-008 Hindi/Punjabi Paired Human Review</h1><p>Each localized item is shown beside its exact canonical English profile question. Canonical sufficiency class, option semantic order and correct index are executable-proved identical. Review language quality only; Hindi/Punjabi remain downstream locked.</p><pre>${escapeHtml(JSON.stringify(summary, null, 2))}</pre></section>
${cards}
</main></body></html>`;

writeFileSync(
  resolve(outputDir, "dsf-cp008-hi-pa-localization-paired-review.json"),
  JSON.stringify(payload, null, 2),
  "utf8",
);
writeFileSync(
  resolve(outputDir, "dsf-cp008-hi-pa-localization-paired-review.html"),
  html,
  "utf8",
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP008_PAIRED_HUMAN_REVIEW_PACK",
  ...summary,
  outputDir,
}, null, 2));
