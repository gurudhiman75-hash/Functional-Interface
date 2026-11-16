import assert from "node:assert/strict";
import test from "node:test";

import {
  TranslationOperationsError,
  assertTranslationTransition,
  evaluateTranslationQuality,
  languageCodesFromSettings,
  normalizeTranslationDraft,
  isUnclassifiedEnglishBankOnlySource,
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

test("linked AI drafts preserve canonicibility preserves source language and approval", () => {
  const source = {
    examVersionId: null,
    questionStatus: "approved",
    approvedVersionId: "version-1",
    questionVersionId: "version-1",
    sourceLanguage: "en",
    bankAcceptanceMode: "BANK_ONLY",
  };
  assert.equal(isUnclassifiedEnglishBankOnlySource(source), true);
  for (const invalid of [
    { sourceLanguage: "pa" },
    { sourceLanguage: "hi" },
    { sourceLanguage: null },
    { questionStatus: "draft" },
    { approvedVersionId: "different-version" },
    { bankAcceptanceMode: null },
    { examVersionId: "exam-1" },
  ]) {
    assert.equal(isUnclassifiedEnglishBankOnlySource({ ...source, ...invalid }), false);
  }
});

test("localized LaTeX math labels are not treated as immutable runtime placeholders", () => {
  const source={
    stem:String.raw`A mixture contains \\(20\\,\\text{kg}\\) coffee and chicory in ratio \\(2:3\\). {studentId}`,
    explanation:String.raw`Use \\(\\frac{\\text{coffee}}{\\text{chicory}}=\\frac{2}{3}\\) to calculate \\(20\\,\\text{kg}\\).`,
    options:[{key:"A",text:"20 kg",sortOrder:1},{key:"B",text:"10 kg",sortOrder:2}],
  };
  const target={
    stem:String.raw`कॉफी और चिकोरी में \\(20\\,\\text{किग्रा}\\) मिश्रण है, अनुपात \\(2:3\\) है। {studentId}`,
    explanation:String.raw`\\(\\frac{\\text{कॉफी}}{\\text{चिकोरी}}=\\frac{2}{3}\\) से \\(20\\,\\text{किग्रा}\\) की गणना करें।`,
    options:[{key:"A",text:"20 किग्रा",sortOrder:1},{key:"B",text:"10 किग्रा",sortOrder:2}],
  };
  assert.equal(evaluateTranslationQuality({source,target,languageCode:"hi"}).approvable,true);
  const missingPlaceholder={...target,stem:target.stem.replace("{studentId}","")};
  assert.ok(evaluateTranslationQuality({source,target:missingPlaceholder,languageCode:"hi"})
    .issues.some(issue=>issue.code==="PROTECTED_TOKEN_MISSING"));
  const changedNumber={...target,stem:target.stem.replace("20","21")};
  assert.ok(evaluateTranslationQuality({source,target:changedNumber,languageCode:"hi"})
    .issues.some(issue=>issue.code==="PROTECTED_TOKEN_MISSING"));
});
