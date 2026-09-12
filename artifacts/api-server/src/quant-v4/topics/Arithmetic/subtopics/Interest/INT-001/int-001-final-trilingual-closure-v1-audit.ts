import assert from "node:assert/strict";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001QuestionStudioBatch, listIntCp001QuestionStudioPackages } from "./cp001-question-studio-integration-v1";
import { INT_CP002_FINAL_QL_IDS } from "./cp002-final-registry";
import { generateIntCp002EnglishFrozenQuestion } from "./cp002-english-frozen-runtime";
import { generateIntCp002LocalizedFrozenQuestionV1 } from "./cp002-multilingual-frozen-runtime-v1";
import { listIntCp002QuestionStudioPackages } from "./cp002-question-studio-integration-v1";
import { listIntCp003QuestionStudioPackages } from "./cp003-question-studio-integration-v1";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE, previewIntCp004QuestionStudioReview } from "./cp004-question-studio-review-adapter";
import { listIntCp005QuestionStudioPackages } from "./cp005-question-studio-integration-v1";
import { listIntCp006QuestionStudioPackages } from "./cp006-question-studio-integration-v1";
import { INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE } from "./cp007-question-studio-review-adapter";
import { listIntCp008QuestionStudioPackages } from "./cp008-question-studio-integration-v1";
import { listIntCp009QuestionStudioPackages } from "./cp009-question-studio-integration-v2";
import { listIntCp010QuestionStudioPackages } from "./cp010-question-studio-integration-v1";
import { listInt001Wave06QuestionStudioPackages } from "./int-001-wave06-question-studio-integration-v1";
import { assertInterestDirectCalculationExplanation } from "./interest-direct-calculation-explanation-policy-v1";

const LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
const CP001_SEEDS_PER_QL_LANGUAGE = 12;
const CP002_SEEDS_PER_QL_LOCALE = 40;
const CP004_ENGLISH_SEEDS_PER_QL = 40;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => typeof nested === "bigint" ? `${nested}n` : nested);
}
function optionValueKeys(question: any): readonly string[] {
  return Object.freeze((question.optionAudit ?? []).map((option: any) => stable(option.value)));
}
function firstPackage(list: readonly any[]) {
  assert.equal(list.length, 1, "Interest Question Studio integration must expose exactly one package descriptor per surface.");
  return list[0];
}
function packageLanguages(pkg: any): readonly string[] {
  assert.ok(Array.isArray(pkg.supportedLanguages), "Question Studio package is missing supportedLanguages.");
  return Object.freeze(pkg.supportedLanguages.map(String).sort());
}
function packageQls(pkg: any): readonly string[] {
  const ids = pkg.permanentQlIds ?? pkg.qlIds;
  assert.ok(Array.isArray(ids), "Question Studio package is missing permanent QL ownership.");
  return Object.freeze(ids.map(String));
}
function lifecycleClosed(question: any, label: string) {
  for (const field of ["questionBankWritable", "testEligible", "mockTestEligible", "publiclyPublishable", "automaticStudentPublication"] as const) {
    if (field in question) assert.notEqual(question[field], true, `${label}: ${field} unexpectedly opened.`);
  }
  if (question.questionBankStatus !== undefined) assert.equal(question.questionBankStatus, "NOT_STORED", `${label}: Question Bank status drifted.`);
  if (question.testEligibility !== undefined) assert.equal(question.testEligibility, "INELIGIBLE", `${label}: test eligibility drifted.`);
}

let cp001Questions = 0;
let cp001DeterministicChecks = 0;
let cp001ExplicitOwnershipChecks = 0;
for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (const language of LANGUAGES) {
    for (let index = 0; index < CP001_SEEDS_PER_QL_LANGUAGE; index += 1) {
      const seed = `INT-001-FINAL-TRILINGUAL:CP001:${qlId}:${language}:${index}`;
      const request = { qlId, language, seed, count: 1 } as const;
      const first = await generateIntCp001QuestionStudioBatch(request);
      const second = await generateIntCp001QuestionStudioBatch(request);
      assert.equal(stable(first), stable(second), `${qlId}/${language}/${index}: CP001 generation is nondeterministic.`);
      cp001DeterministicChecks += 1;
      assert.equal(first.questions.length, 1);
      const question: any = first.questions[0];
      assert.equal(question.qlId, qlId, `${qlId}/${language}: CP001 qlId is not explicit.`);
      assert.equal(question.permanentQlId, qlId, `${qlId}/${language}: CP001 permanentQlId is missing.`);
      assert.equal(question.questionLanguageId, `${qlId}:${language}`, `${qlId}/${language}: CP001 questionLanguageId is not normalized.`);
      assert.equal(question.traceability?.permanentQlId, qlId, `${qlId}/${language}: CP001 traceability is missing permanent QL ownership.`);
      assert.equal(question.language, language);
      lifecycleClosed(question, `${qlId}/${language}`);
      cp001ExplicitOwnershipChecks += 4;
      cp001Questions += 1;
    }
  }
}

let cp002LocalizedQuestions = 0;
let cp002DeterministicChecks = 0;
let cp002SemanticParityChecks = 0;
let cp002LanguageChecks = 0;
let cp002ExplanationChecks = 0;
for (const qlId of INT_CP002_FINAL_QL_IDS) {
  for (const language of ["hi", "pa"] as const) {
    for (let index = 0; index < CP002_SEEDS_PER_QL_LOCALE; index += 1) {
      const seed = `INT-001-FINAL-TRILINGUAL:CP002:${qlId}:${language}:${index}`;
      const english = generateIntCp002EnglishFrozenQuestion(qlId, seed);
      const first = generateIntCp002LocalizedFrozenQuestionV1(qlId, seed, language);
      const second = generateIntCp002LocalizedFrozenQuestionV1(qlId, seed, language);
      assert.equal(stable(first), stable(second), `${qlId}/${language}/${index}: CP002 localization is nondeterministic.`);
      cp002DeterministicChecks += 1;

      assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint, `${qlId}/${language}: mathematical fingerprint drift.`);
      assert.equal(stable(first.internalProvenance.sourceState), stable(english.internalProvenance.sourceState), `${qlId}/${language}: source state drift.`);
      assert.equal(stable(first.solution), stable(english.solution), `${qlId}/${language}: solution drift.`);
      assert.equal(first.correctIndex, english.correctIndex, `${qlId}/${language}: correct index drift.`);
      assert.deepEqual(optionValueKeys(first), optionValueKeys(english), `${qlId}/${language}: option values drift.`);
      assert.equal(first.qlId, qlId);
      assert.equal(first.permanentQlId, qlId);
      assert.equal(first.localization.canonicalQlId, qlId);
      assert.equal(first.localization.canonicalSeed, seed);
      assert.equal(first.localization.mathematicalStateChanged, false);
      assert.equal(first.localization.optionValuesChanged, false);
      assert.equal(first.localization.correctIndexChanged, false);
      cp002SemanticParityChecks += 11;

      assert.equal(first.language, language);
      assert.equal(first.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(first.questionLanguageId, `${qlId}:${language}`);
      assert.ok((language === "hi" ? /[ऀ-ॿ]/u : /[਀-੿]/u).test(first.stem), `${qlId}/${language}: target script missing.`);
      assert.ok(!/\b(?:find|interest|principal|rate|year|years|deposit|deposits|invest|borrows?|lends?|amount|simple|unknown|commercial|days?|repayment|period|combined|first|second)\b/iu.test(first.stem), `${qlId}/${language}: English financial prose survived localization.`);
      cp002LanguageChecks += 5;

      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options).size, 4);
      assert.equal(first.options[first.correctIndex], first.correctAnswer);
      const lines = Object.freeze([...(first.explanation.workedSteps ?? []), first.explanation.conclusion].filter(Boolean).map(String));
      assertInterestDirectCalculationExplanation(qlId, language, lines);
      assert.ok(lines.length >= 4 && lines.length <= 7, `${qlId}/${language}: localized explanation length drifted.`);
      assert.ok(lines.slice(0, -1).every((line) => /[0-9०-९੦-੯]/u.test(line) && /[=×÷+−/]|\\(?:frac|times)/u.test(line)), `${qlId}/${language}: non-calculation working line found.`);
      cp002ExplanationChecks += 6;
      lifecycleClosed(first, `${qlId}/${language}`);
      cp002LocalizedQuestions += 1;
    }
  }
}

let cp004EnglishQuestions = 0;
let cp004EnglishDeterministicChecks = 0;
let cp004EnglishParityChecks = 0;
let cp004EnglishExplanationChecks = 0;
for (const qlId of INT_CP004_QL_IDS) {
  for (let index = 0; index < CP004_ENGLISH_SEEDS_PER_QL; index += 1) {
    const seed = `INT-001-FINAL-TRILINGUAL:CP004:${qlId}:en:${index}`;
    const itemSeed = `${seed}:0:${qlId}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, itemSeed);
    const first = previewIntCp004QuestionStudioReview({ qlId, language: "en", seed, count: 1 });
    const second = previewIntCp004QuestionStudioReview({ qlId, language: "en", seed, count: 1 });
    assert.equal(stable(first), stable(second), `${qlId}/en/${index}: CP004 English Question Studio output is nondeterministic.`);
    cp004EnglishDeterministicChecks += 1;
    assert.equal(first.questions.length, 1);
    const question: any = first.questions[0];
    const sourceOptions = source.options.map((option) => option.text);
    assert.equal(question.qlId, qlId);
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.questionLanguageId, `${qlId}:en`);
    assert.deepEqual(question.options, sourceOptions, `${qlId}/en: approved frozen option display drift.`);
    assert.equal(question.correctIndex, source.correctIndex);
    assert.equal(question.answer, source.correctAnswer);
    assert.equal(question.traceability?.sourceFreezeId, "INT-CP-004-EN-v2-frozen");
    assert.equal(source.permanentIdentityFrozen, true);
    assert.equal(source.learnerContentFrozen, true);
    cp004EnglishParityChecks += 9;
    const lines = Object.freeze((question.explanation?.steps ?? []).map(String));
    assertInterestDirectCalculationExplanation(qlId, "en", lines);
    assert.ok(lines.length > 0, `${qlId}/en: direct calculation explanation is empty.`);
    cp004EnglishExplanationChecks += 2;
    lifecycleClosed(question, `${qlId}/en`);
    cp004EnglishQuestions += 1;
  }
}

const packages = [
  firstPackage(listIntCp001QuestionStudioPackages()),
  firstPackage(listIntCp002QuestionStudioPackages()),
  firstPackage(listIntCp003QuestionStudioPackages()),
  INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE,
  firstPackage(listIntCp005QuestionStudioPackages()),
  firstPackage(listIntCp006QuestionStudioPackages()),
  INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  firstPackage(listIntCp008QuestionStudioPackages()),
  firstPackage(listIntCp009QuestionStudioPackages()),
  firstPackage(listIntCp010QuestionStudioPackages()),
  firstPackage(listInt001Wave06QuestionStudioPackages()),
];
const allQlIds = packages.flatMap(packageQls);
let packageLanguageChecks = 0;
for (const pkg of packages) {
  assert.deepEqual(packageLanguages(pkg), [...LANGUAGES].sort(), `${pkg.checkpointId ?? pkg.canonicalProblemId ?? pkg.name}: package is not trilingual.`);
  packageLanguageChecks += 1;
}
assert.equal(allQlIds.length, 133, "Interest package ownership must expose exactly 133 permanent QLs.");
assert.equal(new Set(allQlIds).size, 133, "Interest package ownership has duplicate QLs.");
const qlLanguageSurfaceCount = allQlIds.length * LANGUAGES.length;
assert.equal(qlLanguageSurfaceCount, 399, "Interest must expose all 399 permanent QL-language surfaces.");

console.log(JSON.stringify({
  version: "INT-001-FINAL-TRILINGUAL-CLOSURE-v1",
  permanentQlCount: new Set(allQlIds).size,
  supportedLanguages: LANGUAGES,
  qlLanguageSurfaceCount,
  packageCount: packages.length,
  packageLanguageChecks,
  cp001: {
    qlCount: INT_CP001_FINAL_QL_IDS.length,
    seedsPerQlLanguage: CP001_SEEDS_PER_QL_LANGUAGE,
    questions: cp001Questions,
    deterministicChecks: cp001DeterministicChecks,
    explicitOwnershipChecks: cp001ExplicitOwnershipChecks,
    implicitOwnershipCases: 0,
  },
  cp002: {
    qlCount: INT_CP002_FINAL_QL_IDS.length,
    localizedLanguages: ["hi", "pa"],
    seedsPerQlLocale: CP002_SEEDS_PER_QL_LOCALE,
    localizedQuestions: cp002LocalizedQuestions,
    deterministicChecks: cp002DeterministicChecks,
    semanticParityChecks: cp002SemanticParityChecks,
    languageChecks: cp002LanguageChecks,
    explanationChecks: cp002ExplanationChecks,
  },
  cp004English: {
    qlCount: INT_CP004_QL_IDS.length,
    seedsPerQl: CP004_ENGLISH_SEEDS_PER_QL,
    questions: cp004EnglishQuestions,
    deterministicChecks: cp004EnglishDeterministicChecks,
    frozenParityChecks: cp004EnglishParityChecks,
    directCalculationChecks: cp004EnglishExplanationChecks,
    sourceFreeze: "INT-CP-004-EN-v2-frozen",
  },
  policy: {
    allPermanentQlsTrilingual: true,
    explicitPermanentQlOwnershipRequired: true,
    localizationMathematicsImmutable: true,
    directCalculationExplanationsRequired: true,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  },
}, null, 2));
console.log("PASS_INT_001_FINAL_TRILINGUAL_CLOSURE_V1_AUDIT");