import { strict as assert } from "node:assert";

import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import {
  COM003_HINDI_LOCALIZATION_WAVE1_V2,
  COM003_LOCALIZATION_WAVE1_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_WAVE1_V2,
} from "./com003-localization-wave1-v2";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

const sourceById = new Map(COM003_ENGLISH_REVIEW_CORPUS_V4.map((question) => [question.questionId, question]));

function normalized(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function canonicalLeaksIntoStem(stem: string, answer: string) {
  const simpleTechnical = /^(?:Microsoft (?:Word|Excel|PowerPoint)|Copy|Cut|Paste|Undo|Redo|Save|Print|Find|Replace|Bold|Italic|Underline|Font|Ctrl\+[A-Z]|\.[a-z0-9]+)$/i;
  if (!simpleTechnical.test(answer)) return false;
  const haystack = ` ${normalized(stem).replace(/[^\p{L}\p{N}+$.-]+/gu, " ")} `;
  const needle = ` ${normalized(answer).replace(/[^\p{L}\p{N}+$.-]+/gu, " ")} `;
  return haystack.includes(needle);
}

function audit(language: "hi" | "pa", corpus: readonly Com003LocalizedQuestionV1[]) {
  const issues: string[] = [];
  const expectedScript = language === "hi" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
  const qlIds = ["COM-003-QL-001", "COM-003-QL-002", "COM-003-QL-003", "COM-003-QL-004"];

  if (corpus.length !== 48) issues.push(`COUNT:${language}:${corpus.length}`);
  if (new Set(corpus.map((item) => item.localizationId)).size !== corpus.length) issues.push(`DUPLICATE_LOCALIZATION_ID:${language}`);
  if (new Set(corpus.map((item) => normalized(item.stem))).size !== corpus.length) issues.push(`DUPLICATE_STEM_GLOBAL:${language}`);

  for (const qlId of qlIds) {
    const questions = corpus.filter((item) => item.qlId === qlId);
    if (questions.length !== 12) issues.push(`QL_COUNT:${language}:${qlId}:${questions.length}`);
    if (new Set(questions.map((item) => normalized(item.stem))).size !== 12) issues.push(`QL_STEM_DIVERSITY:${language}:${qlId}`);
    if (new Set(questions.map((item) => normalized(item.explanation))).size < 6) issues.push(`QL_EXPLANATION_DIVERSITY:${language}:${qlId}`);
  }

  for (const localized of corpus) {
    const source = sourceById.get(localized.sourceQuestionId);
    if (!source) {
      issues.push(`MISSING_SOURCE:${language}:${localized.sourceQuestionId}`);
      continue;
    }
    if (!expectedScript.test(localized.stem)) issues.push(`TARGET_SCRIPT_MISSING_STEM:${language}:${localized.localizationId}`);
    if (!expectedScript.test(localized.explanation)) issues.push(`TARGET_SCRIPT_MISSING_EXPLANATION:${language}:${localized.localizationId}`);
    if (normalized(localized.stem) === normalized(source.stem)) issues.push(`ENGLISH_STEM_COPY:${language}:${localized.localizationId}`);
    if (normalized(localized.explanation) === normalized(source.explanation)) issues.push(`ENGLISH_EXPLANATION_COPY:${language}:${localized.localizationId}`);
    if (localized.options.length !== 4) issues.push(`OPTION_COUNT:${language}:${localized.localizationId}`);
    if (new Set(localized.options.map(normalized)).size !== 4) issues.push(`OPTION_COLLISION:${language}:${localized.localizationId}`);
    if (localized.correctIndex !== source.correctIndex) issues.push(`CORRECT_INDEX_DRIFT:${language}:${localized.localizationId}`);
    if (localized.canonicalAnswer !== localized.options[localized.correctIndex]) issues.push(`CANONICAL_POSITION:${language}:${localized.localizationId}`);
    if (localized.qlId !== source.qlId) issues.push(`QL_DRIFT:${language}:${localized.localizationId}`);
    if (localized.surfaceMode !== source.surfaceMode) issues.push(`SURFACE_DRIFT:${language}:${localized.localizationId}`);
    if (localized.targetFactId !== source.targetFactId) issues.push(`TARGET_FACT_DRIFT:${language}:${localized.localizationId}`);
    if (JSON.stringify(localized.sourceFactIds) !== JSON.stringify(source.sourceFactIds)) issues.push(`SOURCE_FACT_DRIFT:${language}:${localized.localizationId}`);
    if (JSON.stringify(localized.sourceIds) !== JSON.stringify(source.sourceIds)) issues.push(`SOURCE_ID_DRIFT:${language}:${localized.localizationId}`);
    if (localized.versionScoped !== source.versionScoped) issues.push(`VERSION_SCOPE_FLAG_DRIFT:${language}:${localized.localizationId}`);
    if (source.versionScoped && /SHORTCUT|FORMATTING_SHORTCUT/i.test(source.surfaceMode) && !/Windows desktop/i.test(localized.stem)) {
      issues.push(`WINDOWS_DESKTOP_CONTEXT_LOST:${language}:${localized.localizationId}`);
    }
    if (canonicalLeaksIntoStem(localized.stem, localized.canonicalAnswer)) issues.push(`ANSWER_LEAK:${language}:${localized.localizationId}`);
    if (localized.explanation.length < 35) issues.push(`EXPLANATION_TOO_SHORT:${language}:${localized.localizationId}`);
    if (!normalized(localized.explanation).includes(normalized(localized.canonicalAnswer))) issues.push(`EXPLANATION_OMITS_ANSWER:${language}:${localized.localizationId}`);
    if (!localized.sourceEnglishFrozen || !localized.localizationReviewOnly || localized.localizationFrozen || localized.runtimeRegistered || localized.productionReleased) {
      issues.push(`LIFECYCLE_DRIFT:${language}:${localized.localizationId}`);
    }
  }
  return issues;
}

const hindiIssues = audit("hi", COM003_HINDI_LOCALIZATION_WAVE1_V2);
const punjabiIssues = audit("pa", COM003_PUNJABI_LOCALIZATION_WAVE1_V2);
const issues = [...hindiIssues, ...punjabiIssues];

if (issues.length) console.log("[COM003-LOCALIZATION-WAVE1-V2-FAILURES]", JSON.stringify(issues, null, 2));
assert.equal(COM003_LOCALIZATION_WAVE1_AUTHORITY_V2.englishSourceQuestionCount, 48);
assert.equal(COM003_LOCALIZATION_WAVE1_AUTHORITY_V2.hindiQuestionCount, 48);
assert.equal(COM003_LOCALIZATION_WAVE1_AUTHORITY_V2.punjabiQuestionCount, 48);
assert.equal(COM003_LOCALIZATION_WAVE1_AUTHORITY_V2.totalLocalizedQuestionCount, 96);
assert.equal(COM003_LOCALIZATION_WAVE1_AUTHORITY_V2.localizationFrozen, false);
assert.equal(COM003_LOCALIZATION_WAVE1_AUTHORITY_V2.questionStudioRegistrationAuthorized, false);
assert.equal(issues.length, 0, issues.join("\n"));

console.log("[COM003-LOCALIZATION-WAVE1-AUDIT-V2]", {
  valid: true,
  hindi: COM003_HINDI_LOCALIZATION_WAVE1_V2.length,
  punjabi: COM003_PUNJABI_LOCALIZATION_WAVE1_V2.length,
  total: COM003_LOCALIZATION_WAVE1_AUTHORITY_V2.totalLocalizedQuestionCount,
  issues: 0,
  localizationFrozen: false,
  runtimeRegistered: false,
});
