import { strict as assert } from "node:assert";
import {
  blrCp007LocalizedOptionCodePart,
  blrCp007LocalizedQuestionText,
  blrCp007SemanticParityIsExact,
  generateBlrCp007MultilingualReviewBundle,
  type GeneratedBlrCp007LocalizedQuestion,
} from "./localization/cp007-localizer";

const bundle = generateBlrCp007MultilingualReviewBundle();
const hindiPattern = /[\u0900-\u097f]/u;
const punjabiPattern = /[\u0a00-\u0a7f]/u;
const placeholderPattern = /\b(?:TODO|TBD|TRANSLATE|PLACEHOLDER)\b|\{\{[^}]+\}\}/i;
const englishBoilerplatePattern = /\b(?:Which|Choose|Conclusion|means|correct|incorrect|father|mother|son|daughter|brother|sister|husband|wife|grandfather|grandmother|grandchild|uncle|aunt|nephew|niece|candidate|relation|statement|option)\b/i;

function qlCounts(bank: readonly { qlId: string }[]): Record<string, number> {
  return bank.reduce<Record<string, number>>((counts, question) => {
    counts[question.qlId] = (counts[question.qlId] ?? 0) + 1;
    return counts;
  }, {});
}

function difficultyCounts(
  bank: readonly { metadata: { difficulty: string } }[],
): Record<string, number> {
  return bank.reduce<Record<string, number>>((counts, question) => {
    counts[question.metadata.difficulty] = (counts[question.metadata.difficulty] ?? 0) + 1;
    return counts;
  }, {});
}

function learnerFields(question: GeneratedBlrCp007LocalizedQuestion): readonly string[] {
  return [
    question.sharedPrompt,
    question.stem,
    ...question.options.map((option) => option.studentExplanation),
    ...question.decodedStatements,
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    question.explanation.commonTrap ?? "",
    ...question.explanation.optionAnalysis.map((analysis) => analysis.explanation),
    question.explanation.familyTree.title,
    question.explanation.familyTree.accessibleSummary,
    question.explanation.diagramProof.title,
    question.explanation.diagramProof.description,
    ...question.explanation.diagramProof.legend,
    ...question.explanation.diagramProof.edges.map((edge) => edge.label),
  ];
}

function assertLocaleCompleteness(
  bank: readonly GeneratedBlrCp007LocalizedQuestion[],
  locale: "hi-IN" | "pa-IN",
  scriptPattern: RegExp,
): void {
  assert.equal(bank.length, 168);
  assert.equal(new Set(bank.map((question) => question.itemId)).size, 168);
  assert.equal(new Set(bank.map((question) => question.metadata.canonicalItemId)).size, 168);

  for (const question of bank) {
    assert.equal(question.locale, locale);
    assert.equal(question.metadata.locale, locale);
    assert.equal(question.metadata.canonicalLocale, "en-IN");
    assert.equal(question.metadata.localizationStatus, "EXECUTABLE_REVIEW_REQUIRED");
    assert.deepEqual(question.metadata.activeEditorialBlockers, ["HINDI_PUNJABI_HUMAN_REVIEW_PENDING"]);
    assert.deepEqual(question.v4ReviewProof.activeEditorialBlockers, ["HINDI_PUNJABI_HUMAN_REVIEW_PENDING"]);
    assert.equal(question.v4ReviewProof.humanReviewRequired, true);
    assert.equal(question.reviewProof.reviewStatus, "LOCALIZED_REVIEW_REQUIRED");
    assert.equal(question.localisationProof.semanticParity, "EXECUTABLE_PROVED");
    assert.equal(question.localisationProof.humanLanguageReviewRequired, true);
    assert.equal(question.localisationProof.productDeliveryUnlocked, false);
    assert.equal(question.englishFreezeProof.authority, "BLR_CP007_ENGLISH_FROZEN");
    assert.equal(question.englishFreezeProof.localisationUnlocked, true);
    assert.equal(question.englishFreezeProof.productDeliveryUnlocked, false);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);

    for (const field of learnerFields(question)) {
      assert(scriptPattern.test(field), `${locale}/${question.itemId} lacks target script: ${field}`);
      assert(!placeholderPattern.test(field), `${locale}/${question.itemId} contains placeholder text`);
      assert(!englishBoilerplatePattern.test(field), `${locale}/${question.itemId} contains English boilerplate: ${field}`);
    }

    if (question.qlId === "BLR-QL-035") {
      for (const option of question.options) {
        assert(scriptPattern.test(option.text), `${locale}/${question.itemId} validity option was not localized`);
      }
    }
  }
}

assert.equal(bundle.english.length, 168);
assert.equal(bundle.hindi.length, 168);
assert.equal(bundle.punjabi.length, 168);
assert.equal(blrCp007SemanticParityIsExact(bundle.hindi), true);
assert.equal(blrCp007SemanticParityIsExact(bundle.punjabi), true);
assert.deepEqual(qlCounts(bundle.english), {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.deepEqual(qlCounts(bundle.hindi), qlCounts(bundle.english));
assert.deepEqual(qlCounts(bundle.punjabi), qlCounts(bundle.english));
assert.deepEqual(difficultyCounts(bundle.hindi), difficultyCounts(bundle.english));
assert.deepEqual(difficultyCounts(bundle.punjabi), difficultyCounts(bundle.english));

assertLocaleCompleteness(bundle.hindi, "hi-IN", hindiPattern);
assertLocaleCompleteness(bundle.punjabi, "pa-IN", punjabiPattern);

for (let questionIndex = 0; questionIndex < bundle.english.length; questionIndex += 1) {
  const english = bundle.english[questionIndex]!;
  const hindi = bundle.hindi[questionIndex]!;
  const punjabi = bundle.punjabi[questionIndex]!;

  assert.equal(hindi.itemId, english.itemId);
  assert.equal(punjabi.itemId, english.itemId);
  assert.equal(hindi.correctIndex, english.correctIndex);
  assert.equal(punjabi.correctIndex, english.correctIndex);
  assert.equal(hindi.options.length, english.options.length);
  assert.equal(punjabi.options.length, english.options.length);
  assert.equal(hindi.answer.slice(0, 2), english.answer.slice(0, 2));
  assert.equal(punjabi.answer.slice(0, 2), english.answer.slice(0, 2));

  for (let optionIndex = 0; optionIndex < english.options.length; optionIndex += 1) {
    const englishOption = english.options[optionIndex]!;
    const hindiOption = hindi.options[optionIndex]!;
    const punjabiOption = punjabi.options[optionIndex]!;
    const englishCode = blrCp007LocalizedOptionCodePart(englishOption.text);

    if (english.qlId === "BLR-QL-035") {
      assert.equal(blrCp007LocalizedOptionCodePart(hindiOption.text), englishCode);
      assert.equal(blrCp007LocalizedOptionCodePart(punjabiOption.text), englishCode);
    } else {
      assert.equal(hindiOption.text, englishOption.text);
      assert.equal(punjabiOption.text, englishOption.text);
    }

    assert.equal(hindiOption.semanticKey, englishOption.semanticKey);
    assert.equal(punjabiOption.semanticKey, englishOption.semanticKey);
    assert.equal(hindiOption.isCorrectAnswerForTask, englishOption.isCorrectAnswerForTask);
    assert.equal(punjabiOption.isCorrectAnswerForTask, englishOption.isCorrectAnswerForTask);
  }
}

const hindiText = bundle.hindi.map(blrCp007LocalizedQuestionText).join("\n");
const punjabiText = bundle.punjabi.map(blrCp007LocalizedQuestionText).join("\n");
const crossScriptHindiCount = (hindiText.match(/[\u0a00-\u0a7f]/gu) ?? []).length;
const crossScriptPunjabiCount = (punjabiText.match(/[\u0900-\u097f]/gu) ?? []).length;
assert.equal(crossScriptHindiCount, 0);
assert.equal(crossScriptPunjabiCount, 0);

const targetRelationCount = new Set(
  bundle.english.map((question) => question.reviewProof.targetRelation).filter(Boolean),
).size;
assert.equal(targetRelationCount, 27);

console.log(JSON.stringify({
  englishCount: bundle.english.length,
  hindiCount: bundle.hindi.length,
  punjabiCount: bundle.punjabi.length,
  localizedQuestionCount: bundle.hindi.length + bundle.punjabi.length,
  qlCounts: qlCounts(bundle.english),
  difficultyCounts: difficultyCounts(bundle.english),
  targetRelationCount,
  hindiSemanticParity: blrCp007SemanticParityIsExact(bundle.hindi),
  punjabiSemanticParity: blrCp007SemanticParityIsExact(bundle.punjabi),
  hindiScriptCompleteCount: bundle.hindi.filter((question) => learnerFields(question).every((field) => hindiPattern.test(field))).length,
  punjabiScriptCompleteCount: bundle.punjabi.filter((question) => learnerFields(question).every((field) => punjabiPattern.test(field))).length,
  placeholderCount: [...bundle.hindi, ...bundle.punjabi].filter((question) => placeholderPattern.test(blrCp007LocalizedQuestionText(question))).length,
  crossScriptHindiCount,
  crossScriptPunjabiCount,
  productDeliveryEnabledCount: [...bundle.hindi, ...bundle.punjabi].filter((question) =>
    question.publiclyPublishable
    || question.questionStudioVisible
    || question.questionBankEligible
    || question.mockTestEligible).length,
  humanReviewPendingCount: [...bundle.hindi, ...bundle.punjabi].filter((question) => question.v4ReviewProof.humanReviewRequired).length,
  verdict: "BLR_CP007_HI_PA_EXECUTABLE_PARITY_PROVED__HUMAN_LANGUAGE_REVIEW_REQUIRED",
}, null, 2));
