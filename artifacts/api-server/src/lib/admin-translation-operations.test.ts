import assert from "node:assert/strict";
import test from "node:test";

import {
  TranslationOperationsError,
  assertTranslationTransition,
  evaluateTranslationQuality,
  languageCodesFromSettings,
  normalizeTranslationDraft,
  resolveRequestedLanguage,
} from "./admin-translation-operations";

const source = {
  stem: "A shopkeeper increases ₹500 by 20%. What is the new value?",
  explanation: "Increase = 20% of ₹500 = ₹100, so the value is ₹600.",
  options: [
    { key: "A", text: "₹550", sortOrder: 1 },
    { key: "B", text: "₹580", sortOrder: 2 },
    { key: "C", text: "₹600", sortOrder: 3 },
    { key: "D", text: "₹620", sortOrder: 4 },
  ],
};

const target = {
  stem: "ਇੱਕ ਦੁਕਾਨਦਾਰ ₹500 ਵਿੱਚ 20% ਵਾਧਾ ਕਰਦਾ ਹੈ। ਨਵਾਂ ਮੁੱਲ ਕੀ ਹੈ?",
  explanation: "ਵਾਧਾ = ₹500 ਦਾ 20% = ₹100, ਇਸ ਲਈ ਨਵਾਂ ਮੁੱਲ ₹600 ਹੈ।",
  options: [
    { key: "A", text: "₹550", sortOrder: 1 },
    { key: "B", text: "₹580", sortOrder: 2 },
    { key: "C", text: "₹600", sortOrder: 3 },
    { key: "D", text: "₹620", sortOrder: 4 },
  ],
};

test("high quality Punjabi translations are approvable", () => {
  const result = evaluateTranslationQuality({ source, target, languageCode: "pa" });
  assert.equal(result.errorCount, 0);
  assert.equal(result.approvable, true);
  assert.ok(result.score >= 90);
});

test("quality gate blocks missing values, option drift and copied source", () => {
  const result = evaluateTranslationQuality({
    source,
    languageCode: "hi",
    target: {
      stem: source.stem,
      explanation: "बाद में translate",
      options: [
        { key: "A", text: "550", sortOrder: 2 },
        { key: "B", text: "580", sortOrder: 1 },
      ],
    },
  });
  assert.equal(result.approvable, false);
  assert.ok(result.issues.some((issue) => issue.code === "SOURCE_STEM_COPIED"));
  assert.ok(result.issues.some((issue) => issue.code === "OPTION_COUNT_MISMATCH"));
  assert.ok(result.issues.some((issue) => issue.code === "PROTECTED_TOKEN_MISSING"));
});

test("terminology rules are enforced", () => {
  const result = evaluateTranslationQuality({
    source,
    target: { ...target, stem: `${target.stem} गलतशब्द` },
    languageCode: "pa",
    terms: [{ sourceText: "shopkeeper", preferredText: "ਦੁਕਾਨਦਾਰ", forbiddenVariants: ["गलतशब्द"] }],
  });
  assert.equal(result.approvable, false);
  assert.ok(result.issues.some((issue) => issue.code === "FORBIDDEN_TERM_USED"));
});

test("translation payload normalization requires complete auditable input", () => {
  assert.deepEqual(normalizeTranslationDraft({
    ...target,
    reason: "Initial Punjabi translation",
  }), {
    ...target,
    reason: "Initial Punjabi translation",
  });
  assert.throws(
    () => normalizeTranslationDraft({ ...target, reason: "x" }),
    (error) => error instanceof TranslationOperationsError && error.code === "TRANSLATION_REASON_REQUIRED",
  );
});

test("translation lifecycle prevents unsafe approvals", () => {
  assert.doesNotThrow(() => assertTranslationTransition("draft", "in_review"));
  assert.doesNotThrow(() => assertTranslationTransition("in_review", "approved"));
  assert.throws(
    () => assertTranslationTransition("draft", "approved"),
    (error) => error instanceof TranslationOperationsError && error.code === "TRANSLATION_TRANSITION_NOT_ALLOWED",
  );
});

test("test language contracts support legacy and bilingual settings", () => {
  assert.deepEqual(languageCodesFromSettings({ languageCode: "HI" }), ["hi"]);
  assert.deepEqual(languageCodesFromSettings({ languageCodes: ["en", "hi", "hi", "pa"] }), ["en", "hi", "pa"]);
  assert.deepEqual(resolveRequestedLanguage({ settings: { languageCodes: ["en", "pa"] }, requested: "pa" }), {
    requestedLanguage: "pa",
    availableLanguages: ["en", "pa"],
  });
  assert.throws(
    () => resolveRequestedLanguage({ settings: { languageCodes: ["en", "hi"] }, requested: "pa" }),
    (error) => error instanceof TranslationOperationsError && error.code === "TEST_LANGUAGE_UNAVAILABLE",
  );
});
