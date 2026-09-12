import assert from "node:assert/strict";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001QuestionStudioBatch, listIntCp001QuestionStudioPackages } from "./cp001-question-studio-integration-v1";
import { INT_CP002_FINAL_QL_IDS } from "./cp002-final-registry";
import { generateIntCp002EnglishFrozenQuestion } from "./cp002-english-frozen-runtime";
import { generateIntCp002LocalizedFrozenQuestionV2 } from "./cp002-multilingual-frozen-runtime-v2";
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
const CP001_SEEDS = 12;
const CP002_SEEDS = 40;
const CP004_SEEDS = 40;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => typeof nested === "bigint" ? `${nested}n` : nested);
}
function firstPackage(list: readonly any[]) {
  assert.equal(list.length, 1, "Expected one Interest Question Studio package descriptor.");
  return list[0];
}
function qls(pkg: any): readonly string[] {
  const ids = pkg.permanentQlIds ?? pkg.qlIds;
  assert.ok(Array.isArray(ids), "Package is missing QL ownership.");
  return ids.map(String);
}
function langs(pkg: any): readonly string[] {
  assert.ok(Array.isArray(pkg.supportedLanguages), "Package is missing language coverage.");
  return pkg.supportedLanguages.map(String).sort();
}
function assertClosed(question: any, label: string) {
  for (const field of ["questionBankWritable", "testEligible", "mockTestEligible", "publiclyPublishable", "automaticStudentPublication"] as const) {
    if (field in question) assert.notEqual(question[field], true, `${label}: ${field} opened unexpectedly.`);
  }
}
function optionValueKeys(question: any) {
  return (question.optionAudit ?? []).map((option: any) => stable(option.value));
}

let cp001Questions = 0;
for (const qlId of INT_CP001_FINAL_QL_IDS) for (const language of LANGUAGES) for (let index = 0; index < CP001_SEEDS; index += 1) {
  const seed = `INT-001-TRILINGUAL-V2:CP001:${qlId}:${language}:${index}`;
  const request = { qlId, language, seed, count: 1 } as const;
  const first = await generateIntCp001QuestionStudioBatch(request);
  const second = await generateIntCp001QuestionStudioBatch(request);
  assert.equal(stable(first), stable(second), `${qlId}/${language}: CP001 generation is nondeterministic.`);
  const question: any = first.questions[0];
  assert.equal(question.qlId, qlId);
  assert.equal(question.permanentQlId, qlId);
  assert.equal(question.questionLanguageId, `${qlId}:${language}`);
  assert.equal(question.traceability?.permanentQlId, qlId);
  assertClosed(question, `${qlId}/${language}`);
  cp001Questions += 1;
}

let cp002LocalizedQuestions = 0;
let cp002ParityChecks = 0;
for (const qlId of INT_CP002_FINAL_QL_IDS) for (const language of ["hi", "pa"] as const) for (let index = 0; index < CP002_SEEDS; index += 1) {
  const seed = `INT-001-TRILINGUAL-V2:CP002:${qlId}:${language}:${index}`;
  const english = generateIntCp002EnglishFrozenQuestion(qlId, seed);
  const first = generateIntCp002LocalizedFrozenQuestionV2(qlId, seed, language);
  const second = generateIntCp002LocalizedFrozenQuestionV2(qlId, seed, language);
  assert.equal(stable(first), stable(second), `${qlId}/${language}: localization is nondeterministic.`);
  assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint);
  assert.equal(stable(first.internalProvenance.sourceState), stable(english.internalProvenance.sourceState));
  assert.equal(stable(first.solution), stable(english.solution));
  assert.equal(first.correctIndex, english.correctIndex);
  assert.deepEqual(optionValueKeys(first), optionValueKeys(english));
  assert.equal(first.qlId, qlId);
  assert.equal(first.permanentQlId, qlId);
  assert.equal(first.questionLanguageId, `${qlId}:${language}`);
  assert.equal(first.localization.mathematicalStateChanged, false);
  assert.equal(first.localization.optionValuesChanged, false);
  assert.equal(first.localization.correctIndexChanged, false);
  cp002ParityChecks += 11;

  assert.equal(first.options.length, 4);
  assert.equal(new Set(first.options).size, 4);
  assert.equal(first.options[first.correctIndex], first.correctAnswer);
  assert.ok((language === "hi" ? /[ऀ-ॿ]/u : /[਀-੿]/u).test(first.stem), `${qlId}/${language}: target script missing.`);
  assert.ok(!/\b(?:find|interest|principal|rate|year|years|deposit|deposits|invest|borrows?|lends?|amount|simple|unknown|commercial|days?|repayment|period|combined|first|second)\b/iu.test(first.stem), `${qlId}/${language}: English prose survived localization.`);
  const working = Object.freeze((first.explanation.workedSteps ?? []).map(String));
  assert.ok(working.length >= 3 && working.length <= 6, `${qlId}/${language}: expected 3-6 numerical working lines.`);
  assert.ok(working.every((line) => /[0-9०-९੦-੯]/u.test(line) && /[=×÷+−^/]|\\(?:frac|times)/u.test(line)), `${qlId}/${language}: non-calculation working line survived.`);
  assertInterestDirectCalculationExplanation(qlId, language, [...working, first.explanation.conclusion]);
  assertClosed(first, `${qlId}/${language}`);
  cp002LocalizedQuestions += 1;
}

let cp004EnglishQuestions = 0;
let cp004ParityChecks = 0;
for (const qlId of INT_CP004_QL_IDS) for (let index = 0; index < CP004_SEEDS; index += 1) {
  const seed = `INT-001-TRILINGUAL-V2:CP004:${qlId}:en:${index}`;
  const itemSeed = `${seed}:0:${qlId}`;
  const source = generateIntCp004EnglishFrozenV2Question(qlId, itemSeed);
  const first = previewIntCp004QuestionStudioReview({ qlId, language: "en", seed, count: 1 });
  const second = previewIntCp004QuestionStudioReview({ qlId, language: "en", seed, count: 1 });
  assert.equal(stable(first), stable(second), `${qlId}/en: CP004 output is nondeterministic.`);
  const question: any = first.questions[0];
  assert.equal(question.qlId, qlId);
  assert.equal(question.permanentQlId, qlId);
  assert.equal(question.questionLanguageId, `${qlId}:en`);
  assert.deepEqual(question.options, source.options.map((option) => option.text));
  assert.equal(question.correctIndex, source.correctIndex);
  assert.equal(question.answer, source.correctAnswer);
  assert.equal(question.traceability?.sourceFreezeId, "INT-CP-004-EN-v2-frozen");
  assert.equal(source.permanentIdentityFrozen, true);
  assert.equal(source.learnerContentFrozen, true);
  cp004ParityChecks += 9;
  const lines = Object.freeze((question.explanation?.steps ?? []).map(String));
  assertInterestDirectCalculationExplanation(qlId, "en", lines);
  assertClosed(question, `${qlId}/en`);
  cp004EnglishQuestions += 1;
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
for (const pkg of packages) assert.deepEqual(langs(pkg), [...LANGUAGES].sort(), `${pkg.checkpointId ?? pkg.name}: package is not trilingual.`);
const allQlIds = packages.flatMap(qls);
assert.equal(allQlIds.length, 133);
assert.equal(new Set(allQlIds).size, 133);
assert.equal(allQlIds.length * LANGUAGES.length, 399);

console.log(JSON.stringify({
  version: "INT-001-FINAL-TRILINGUAL-CLOSURE-v2",
  permanentQlCount: new Set(allQlIds).size,
  supportedLanguages: LANGUAGES,
  qlLanguageSurfaceCount: 399,
  packageCount: packages.length,
  cp001: { questions: cp001Questions, implicitOwnershipCases: 0 },
  cp002: { localizedQuestions: cp002LocalizedQuestions, semanticParityChecks: cp002ParityChecks, explanationStyle: "DIRECT_CALCULATION_ONLY" },
  cp004English: { questions: cp004EnglishQuestions, frozenParityChecks: cp004ParityChecks, sourceFreeze: "INT-CP-004-EN-v2-frozen" },
  policy: { allPermanentQlsTrilingual: true, explicitPermanentQlOwnershipRequired: true, localizationMathematicsImmutable: true, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false },
}, null, 2));
console.log("PASS_INT_001_FINAL_TRILINGUAL_CLOSURE_V2_AUDIT");