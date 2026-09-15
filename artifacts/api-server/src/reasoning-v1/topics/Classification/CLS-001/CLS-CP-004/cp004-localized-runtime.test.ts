import assert from "node:assert/strict";
import { CLS_CP004_ENGLISH_QL_ID } from "./cp004-english-contract";
import { generateClsCp004EnglishQuestion } from "./cp004-english-runtime";
import {
  generateClsCp004LocalizedQuestion,
  type ClsCp004TranslatedLocale,
} from "./cp004-localized-runtime";
import { CLS_CP004_RULE_IDS } from "./number-domain";

const locales: readonly ClsCp004TranslatedLocale[] = ["hi-IN", "pa-IN"];
const ruleCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const englishLeak = /\b(?:which|number|numbers|different|others|common|property|follows|follow|divisible|digits|digit|perfect|square|cube|prime|composite|triangular|answer|therefore|choose|select|find|rule|same|odd|even)\b/i;
let checked = 0;

for (let seed = 0; seed < 2000; seed += 1) {
  const english = generateClsCp004EnglishQuestion(CLS_CP004_ENGLISH_QL_ID, seed);
  for (const locale of locales) {
    const question = generateClsCp004LocalizedQuestion(locale, seed);
    const replay = generateClsCp004LocalizedQuestion(locale, seed);
    assert.deepEqual(question, replay, `${locale}/${seed} is not deterministic`);

    assert.equal(question.qlId, english.qlId, `${locale}/${seed} QL drift`);
    assert.equal(question.permanentQlId, english.permanentQlId, `${locale}/${seed} permanent QL drift`);
    assert.equal(question.prototypeId, english.prototypeId, `${locale}/${seed} prototype drift`);
    assert.equal(question.intendedRuleId, english.intendedRuleId, `${locale}/${seed} rule drift`);
    assert.equal(question.intendedRuleValue, english.intendedRuleValue, `${locale}/${seed} rule-value drift`);
    assert.deepEqual(question.numbers, english.numbers, `${locale}/${seed} number-state drift`);
    assert.deepEqual(question.options, english.options, `${locale}/${seed} option drift`);
    assert.equal(question.correctIndex, english.correctIndex, `${locale}/${seed} answer-position drift`);
    assert.equal(question.answer, english.answer, `${locale}/${seed} answer drift`);
    assert.equal(question.difficulty, english.difficulty, `${locale}/${seed} difficulty drift`);
    assert.deepEqual(question.difficultyFeatures, english.difficultyFeatures, `${locale}/${seed} difficulty-feature drift`);
    assert.deepEqual(question.ambiguityAudit, english.ambiguityAudit, `${locale}/${seed} ambiguity-proof drift`);

    assert.equal(question.metadata.locale, locale);
    assert.equal(question.metadata.runtimeVersion, "cls-cp004-multilingual-review-v1");
    assert.equal(question.metadata.canonicalRuntimeVersion, "cls-cp004-english-runtime-v2");
    assert.equal(question.metadata.canonicalLocale, "en-IN");
    assert.equal(question.metadata.localizationStatus, "EXECUTABLE_REVIEW_REQUIRED");
    assert.equal(question.lifecycle.reviewStatus, "LOCALIZED_REVIEW_REQUIRED");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.reviewOnly, true);

    assert.equal(question.explanation.examSpeedShortcut.length, 0, `${locale}/${seed} forced shortcut leaked`);
    assert.equal(question.explanation.commonTrapWarning.length, 0, `${locale}/${seed} forced trap boilerplate leaked`);
    assert.equal(question.explanation.stepByStep.length, 3, `${locale}/${seed} expected three clear steps`);
    assert.ok(question.explanation.stepByStep.at(-1)?.includes(question.answer), `${locale}/${seed} conclusion omits answer`);
    assert.equal(question.evidenceByOption.length, question.options.length, `${locale}/${seed} evidence count mismatch`);

    const learnerText = [
      question.stem,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
      ...question.evidenceByOption,
    ].join("\n");
    assert.ok(!englishLeak.test(learnerText), `${locale}/${seed} English instructional leakage: ${learnerText}`);
    assert.ok(!/CLS-|PROT-|DIVISIBLE_BY_|PERFECT_SQUARE_STATUS|NEAR_POWER_CLASS|undefined|null|NaN|Infinity/i.test(learnerText), `${locale}/${seed} internal leakage`);
    if (locale === "hi-IN") assert.ok(/[\u0900-\u097F]/.test(learnerText), `${seed} Hindi script missing`);
    if (locale === "pa-IN") assert.ok(/[\u0A00-\u0A7F]/.test(learnerText), `${seed} Punjabi script missing`);

    ruleCoverage.add(question.intendedRuleId);
    difficultyCoverage.add(question.difficulty);
    optionCountCoverage.add(question.options.length);
    checked += 1;
  }
}

assert.equal(ruleCoverage.size, CLS_CP004_RULE_IDS.length, `rule coverage ${ruleCoverage.size}/${CLS_CP004_RULE_IDS.length}`);
assert.deepEqual([...CLS_CP004_RULE_IDS].filter((ruleId) => !ruleCoverage.has(ruleId)), []);
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));

console.log("CLS-CP-004 Hindi/Punjabi review runtime audit passed.", {
  checked,
  locales,
  rules: ruleCoverage.size,
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
});
