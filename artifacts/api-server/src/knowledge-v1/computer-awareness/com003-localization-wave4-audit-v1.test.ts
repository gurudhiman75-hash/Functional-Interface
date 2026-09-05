import { strict as assert } from "node:assert";

import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import { COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave2-freeze-v1";
import { COM003_LOCALIZATION_WAVE3_AUTHORITY_V2 } from "./com003-localization-wave3-v2";
import {
  COM003_HINDI_LOCALIZATION_WAVE4_V1,
  COM003_LOCALIZATION_WAVE4_AUTHORITY_V1,
  COM003_PUNJABI_LOCALIZATION_WAVE4_V1,
} from "./com003-localization-wave4-v1";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

const WAVE4_QL_IDS = ["COM-003-QL-015", "COM-003-QL-016", "COM-003-QL-017", "COM-003-QL-018", "COM-003-QL-019"];
const sourceById = new Map(COM003_ENGLISH_REVIEW_CORPUS_V4.map((question) => [question.questionId, question]));
function normalized(value: string) { return value.trim().replace(/\s+/g, " ").toLowerCase(); }
function isProtectedTechnical(value: string) { return /^(?:F2|F5|Shift\+F5|Ctrl\+[A-Z1]|Alt\+H, O, W)$/.test(value.trim()); }
function answerLeaks(stem: string, answer: string) {
  if (isProtectedTechnical(answer)) return stem.includes(answer);
  return normalized(stem).includes(normalized(answer));
}

function audit(language: "hi" | "pa", corpus: readonly Com003LocalizedQuestionV1[]) {
  const issues: string[] = [];
  const expectedScript = language === "hi" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
  if (corpus.length !== 60) issues.push(`COUNT:${language}:${corpus.length}`);
  if (new Set(corpus.map((item) => item.localizationId)).size !== 60) issues.push(`DUPLICATE_LOCALIZATION_ID:${language}`);
  if (new Set(corpus.map((item) => normalized(item.stem))).size !== 60) issues.push(`DUPLICATE_STEM_GLOBAL:${language}`);
  for (const qlId of WAVE4_QL_IDS) {
    const items = corpus.filter((item) => item.qlId === qlId);
    if (items.length !== 12) issues.push(`QL_COUNT:${language}:${qlId}:${items.length}`);
    if (new Set(items.map((item) => normalized(item.stem))).size !== 12) issues.push(`QL_STEM_DIVERSITY:${language}:${qlId}`);
    if (new Set(items.map((item) => normalized(item.explanation))).size < 8) issues.push(`QL_EXPLANATION_DIVERSITY:${language}:${qlId}`);
  }
  for (const localized of corpus) {
    const source = sourceById.get(localized.sourceQuestionId);
    if (!source) { issues.push(`MISSING_SOURCE:${language}:${localized.sourceQuestionId}`); continue; }
    if (!WAVE4_QL_IDS.includes(localized.qlId)) issues.push(`OUT_OF_SCOPE_QL:${language}:${localized.localizationId}`);
    if (!expectedScript.test(localized.stem)) issues.push(`TARGET_SCRIPT_MISSING_STEM:${language}:${localized.localizationId}`);
    if (!expectedScript.test(localized.explanation)) issues.push(`TARGET_SCRIPT_MISSING_EXPLANATION:${language}:${localized.localizationId}`);
    if (normalized(localized.stem) === normalized(source.stem)) issues.push(`ENGLISH_STEM_COPY:${language}:${localized.localizationId}`);
    if (normalized(localized.explanation) === normalized(source.explanation)) issues.push(`ENGLISH_EXPLANATION_COPY:${language}:${localized.localizationId}`);
    if (/TODO|TBD|AWAITING|TRANSLATE|PLACEHOLDER/i.test(`${localized.stem} ${localized.options.join(" ")} ${localized.explanation}`)) issues.push(`PLACEHOLDER_TEXT:${language}:${localized.localizationId}`);
    if (localized.options.length !== 4) issues.push(`OPTION_COUNT:${language}:${localized.localizationId}`);
    if (new Set(localized.options.map(normalized)).size !== 4) issues.push(`OPTION_COLLISION:${language}:${localized.localizationId}`);
    if (localized.correctIndex !== source.correctIndex) issues.push(`CORRECT_INDEX_DRIFT:${language}:${localized.localizationId}`);
    if (localized.canonicalAnswer !== localized.options[localized.correctIndex]) issues.push(`CANONICAL_POSITION:${language}:${localized.localizationId}`);
    if (localized.qlId !== source.qlId) issues.push(`QL_DRIFT:${language}:${localized.localizationId}`);
    if (localized.cpId !== source.cpId) issues.push(`CP_DRIFT:${language}:${localized.localizationId}`);
    if (localized.surfaceMode !== source.surfaceMode) issues.push(`SURFACE_DRIFT:${language}:${localized.localizationId}`);
    if (localized.targetFactId !== source.targetFactId) issues.push(`TARGET_FACT_DRIFT:${language}:${localized.localizationId}`);
    if (JSON.stringify(localized.sourceFactIds) !== JSON.stringify(source.sourceFactIds)) issues.push(`SOURCE_FACT_DRIFT:${language}:${localized.localizationId}`);
    if (JSON.stringify(localized.sourceIds) !== JSON.stringify(source.sourceIds)) issues.push(`SOURCE_ID_DRIFT:${language}:${localized.localizationId}`);
    if (localized.versionScoped !== source.versionScoped) issues.push(`VERSION_SCOPE_FLAG_DRIFT:${language}:${localized.localizationId}`);
    if (localized.solverAuthority !== source.solverAuthority) issues.push(`SOLVER_AUTHORITY_DRIFT:${language}:${localized.localizationId}`);
    source.options.forEach((sourceOption, optionIndex) => {
      const localizedOption = localized.options[optionIndex]!;
      if (isProtectedTechnical(sourceOption)) {
        if (localizedOption !== sourceOption) issues.push(`PROTECTED_TOKEN_DRIFT:${language}:${localized.localizationId}:${sourceOption}:${localizedOption}`);
      } else if (!expectedScript.test(localizedOption)) issues.push(`TARGET_SCRIPT_MISSING_OPTION:${language}:${localized.localizationId}:${optionIndex}:${localizedOption}`);
    });
    if (source.versionScoped && /SHORTCUT/i.test(source.surfaceMode) && !/Windows desktop/i.test(localized.stem)) issues.push(`WINDOWS_DESKTOP_CONTEXT_LOST:${language}:${localized.localizationId}`);
    if (answerLeaks(localized.stem, localized.canonicalAnswer)) issues.push(`ANSWER_LEAK:${language}:${localized.localizationId}`);
    if (localized.explanation.length < 60) issues.push(`EXPLANATION_TOO_SHORT:${language}:${localized.localizationId}`);
    if (!normalized(localized.explanation).includes(normalized(localized.canonicalAnswer))) issues.push(`EXPLANATION_OMITS_ANSWER:${language}:${localized.localizationId}`);
    if (!localized.sourceEnglishFrozen || !localized.localizationReviewOnly || localized.localizationFrozen || localized.runtimeRegistered || localized.productionReleased) issues.push(`LIFECYCLE_DRIFT:${language}:${localized.localizationId}`);
  }
  return issues;
}

assert.equal(COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1.governance.waveLocalizationFrozen, true);
assert.equal(COM003_LOCALIZATION_WAVE3_AUTHORITY_V2.totalLocalizedQuestionCount, 120);
const issues = [...audit("hi", COM003_HINDI_LOCALIZATION_WAVE4_V1), ...audit("pa", COM003_PUNJABI_LOCALIZATION_WAVE4_V1)];
assert.equal(COM003_LOCALIZATION_WAVE4_AUTHORITY_V1.englishSourceQuestionCount, 60);
assert.equal(COM003_LOCALIZATION_WAVE4_AUTHORITY_V1.hindiQuestionCount, 60);
assert.equal(COM003_LOCALIZATION_WAVE4_AUTHORITY_V1.punjabiQuestionCount, 60);
assert.equal(COM003_LOCALIZATION_WAVE4_AUTHORITY_V1.totalLocalizedQuestionCount, 120);
assert.equal(COM003_LOCALIZATION_WAVE4_AUTHORITY_V1.localizationFrozen, false);
assert.equal(COM003_LOCALIZATION_WAVE4_AUTHORITY_V1.questionStudioRegistrationAuthorized, false);
if (issues.length) console.error("[COM003-LOCALIZATION-WAVE4-V1-FAILURES]", JSON.stringify(issues, null, 2));
assert.equal(issues.length, 0, issues.join("\n"));
console.log("[COM003-LOCALIZATION-WAVE4-AUDIT-V1]", { valid: true, qlCount: WAVE4_QL_IDS.length, hindi: 60, punjabi: 60, total: 120, issues: 0, localizationFrozen: false, runtimeRegistered: false });
