import assert from "node:assert/strict";
import {
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
} from "./cp007-english-contracts";
import {
  generateClsCp007LocalizedClusterQuestion,
  generateClsCp007LocalizedPairQuestion,
  type ClsCp007LocalizedLocale,
} from "./cp007-localized-runtime";
import type { ClsCp007PrototypeId } from "./types";

const PROTOTYPES: readonly ClsCp007PrototypeId[] = [
  "CLS-CP007-PROT-001",
  "CLS-CP007-PROT-002",
  "CLS-CP007-PROT-003",
  "CLS-CP007-PROT-004",
  "CLS-CP007-PROT-005",
  "CLS-CP007-PROT-006",
  "CLS-CP007-PROT-007",
  "CLS-CP007-PROT-008",
  "CLS-CP007-PROT-009",
  "CLS-CP007-PROT-010",
  "CLS-CP007-PROT-011",
  "CLS-CP007-PROT-012",
  "CLS-CP007-PROT-013",
];
const LOCALES: readonly ClsCp007LocalizedLocale[] = ["hi-IN", "pa-IN"];
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ENGLISH_INSTRUCTION = /\b(which|choose|select|identify|letter|cluster|position|common|rule|odd|different|therefore|follows|following)\b/i;

function assertNativeText(locale: ClsCp007LocalizedLocale, lines: readonly string[], context: string): void {
  const text = lines.join("\n");
  assert.ok((locale === "hi-IN" ? DEVANAGARI : GURMUKHI).test(text), `${context}: native script missing`);
  assert.ok(!ENGLISH_INSTRUCTION.test(text), `${context}: English instructional leakage`);
}

let singleQuestions = 0;
let pairQuestions = 0;
const difficulties = new Set<string>();
const exercisedRules = new Set<string>();

for (const prototypeId of PROTOTYPES) {
  for (let seed = 0; seed < 60; seed += 1) {
    const optionCount = seed % 4 === 0 ? 5 : 4;
    const english = generateClsCp007PermanentClusterQuestion(prototypeId, seed, optionCount);
    for (const locale of LOCALES) {
      const localized = generateClsCp007LocalizedClusterQuestion(locale, prototypeId, seed, optionCount);
      const replay = generateClsCp007LocalizedClusterQuestion(locale, prototypeId, seed, optionCount);

      assert.deepEqual(localized, replay, `${prototypeId}/${locale}/${seed}: non-deterministic replay`);
      assert.equal(localized.permanentQlId, "CLS-QL-012");
      assert.equal(localized.prototypeId, english.prototypeId);
      assert.deepEqual(localized.items, english.items);
      assert.deepEqual(localized.options, english.options);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.answer, english.answer);
      assert.equal(localized.intendedRuleId, english.intendedRuleId);
      assert.equal(localized.intendedRuleValue, english.intendedRuleValue);
      assert.deepEqual(localized.ambiguityAudit, english.ambiguityAudit);
      assert.equal(localized.difficulty, english.difficulty);
      assert.deepEqual(localized.difficultyFeatures, english.difficultyFeatures);
      assert.equal(localized.metadata.locale, locale);
      assert.equal(localized.metadata.runtimeVersion, "cls-cp007-multilingual-review-v1");
      assert.equal(localized.metadata.canonicalRuntimeVersion, "cls-cp007-permanent-english-v1");
      assert.equal(localized.metadata.localizationStatus, "EXECUTABLE_REVIEW_REQUIRED");
      assert.equal(localized.lifecycle.reviewStatus, "LOCALIZED_REVIEW_REQUIRED");
      assert.equal(localized.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(localized.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.questionStudioVisible, false);
      assert.equal(localized.explanation.examSpeedShortcut.length, 0);
      assert.equal(localized.explanation.commonTrapWarning.length, 0);
      assertNativeText(locale, [localized.stem, ...localized.explanation.coreConcept, ...localized.explanation.stepByStep], `${prototypeId}/${locale}/${seed}`);

      difficulties.add(localized.difficulty);
      exercisedRules.add(localized.intendedRuleId);
      singleQuestions += 1;
    }
  }
}

for (let seed = 0; seed < 400; seed += 1) {
  const optionCount = seed % 3 === 0 ? 5 : 4;
  const english = generateClsCp007PermanentClusterPairQuestion(seed, optionCount);
  for (const locale of LOCALES) {
    const localized = generateClsCp007LocalizedPairQuestion(locale, seed, optionCount);
    const replay = generateClsCp007LocalizedPairQuestion(locale, seed, optionCount);

    assert.deepEqual(localized, replay, `PAIR/${locale}/${seed}: non-deterministic replay`);
    assert.equal(localized.permanentQlId, "CLS-QL-013");
    assert.deepEqual(localized.items, english.items);
    assert.deepEqual(localized.options, english.options);
    assert.equal(localized.correctIndex, english.correctIndex);
    assert.equal(localized.answer, english.answer);
    assert.equal(localized.intendedRuleId, english.intendedRuleId);
    assert.equal(localized.intendedRuleValue, english.intendedRuleValue);
    assert.deepEqual(localized.ambiguityAudit, english.ambiguityAudit);
    assert.equal(localized.difficulty, english.difficulty);
    assert.equal(localized.metadata.locale, locale);
    assert.equal(localized.metadata.runtimeVersion, "cls-cp007-multilingual-review-v1");
    assert.equal(localized.metadata.canonicalRuntimeVersion, "cls-cp007-permanent-english-v1");
    assert.equal(localized.metadata.localizationStatus, "EXECUTABLE_REVIEW_REQUIRED");
    assert.equal(localized.lifecycle.reviewStatus, "LOCALIZED_REVIEW_REQUIRED");
    assert.equal(localized.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(localized.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
    assert.equal(localized.questionStudioVisible, false);
    assert.equal(localized.explanation.examSpeedShortcut.length, 0);
    assert.equal(localized.explanation.commonTrapWarning.length, 0);
    assertNativeText(locale, [localized.stem, ...localized.explanation.coreConcept, ...localized.explanation.stepByStep], `PAIR/${locale}/${seed}`);

    difficulties.add(localized.difficulty);
    pairQuestions += 1;
  }
}

assert.equal(singleQuestions, PROTOTYPES.length * 60 * LOCALES.length);
assert.equal(pairQuestions, 400 * LOCALES.length);
assert.equal(exercisedRules.size, 13, `Expected all 13 single-cluster rules, exercised ${exercisedRules.size}`);
assert.ok(difficulties.has("EASY"));
assert.ok(difficulties.has("MEDIUM"));
assert.ok(difficulties.has("HARD"));

console.log("CLS-CP-007 Hindi/Punjabi review-runtime audit passed.", {
  singleQuestions,
  pairQuestions,
  total: singleQuestions + pairQuestions,
  prototypes: PROTOTYPES.length,
  singleRules: exercisedRules.size,
  difficulties: [...difficulties].sort(),
  mathematicalStateChanges: 0,
  downstreamPromotion: false,
});
