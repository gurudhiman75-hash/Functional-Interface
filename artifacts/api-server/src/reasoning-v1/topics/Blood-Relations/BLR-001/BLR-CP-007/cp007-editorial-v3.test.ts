import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV3Telemetry,
  generateBlrCp007EditorialV3Bank,
  generateBlrCp007EditorialV3Question,
} from "./cp007-editorial-v3";
import { BLR_CP007_V3_PROTOTYPE_PLANS } from "./cp007-editorial-v3-scenarios";

const bank = generateBlrCp007EditorialV3Bank();
const telemetry = buildBlrCp007EditorialV3Telemetry(bank);

assert.equal(bank.length, 168);
assert.equal(telemetry.recordCount, 168);
assert.equal(telemetry.prototypeCount, 21);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.equal(telemetry.optionAnalysisCount, 672);
assert.equal(telemetry.uniqueQuestionSignatureCount, 168);
assert.equal(telemetry.semanticScenarioCount, 168);
assert.equal(telemetry.minimumSemanticScenariosPerPrototype, 8);
assert.deepEqual(telemetry.answerPositions, [42, 42, 42, 42]);
assert.deepEqual(telemetry.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.equal(telemetry.invalidGraphOptions, 0);
assert.equal(telemetry.validWrongGraphOptions, 504);
assert.equal(telemetry.duplicateCodeMeaningQuestions, 0);
assert.equal(telemetry.ql033DeepConstructionQuestions, 24);
assert.equal(telemetry.ql034MeaningfulCandidateQuestions, 32);
assert.equal(telemetry.ql034ShortcutFailures, 0);
assert.equal(telemetry.thereforePrefixDuplications, 0);
assert.equal(telemetry.studentVisibleDiagnosticCodes, 0);
assert.equal(telemetry.humanReviewRequired, true);

const symbolCount = telemetry.keyStyleCounts.SYMBOL ?? 0;
const letterCount = telemetry.keyStyleCounts.LETTER ?? 0;
const wordCount = telemetry.keyStyleCounts.NEUTRAL_WORD ?? 0;
assert(symbolCount >= 115 && symbolCount <= 130, `Symbol count ${symbolCount}`);
assert(letterCount >= 28 && letterCount <= 40, `Letter count ${letterCount}`);
assert(wordCount >= 8 && wordCount <= 16, `Word count ${wordCount}`);

const maleTargets = telemetry.targetGenderClassCounts.MALE ?? 0;
const femaleTargets = telemetry.targetGenderClassCounts.FEMALE ?? 0;
const neutralTargets = telemetry.targetGenderClassCounts.NEUTRAL ?? 0;
assert(Math.abs(maleTargets - femaleTargets) <= 4, `Target imbalance ${maleTargets}/${femaleTargets}`);
assert(femaleTargets >= 55, `Female target coverage ${femaleTargets}`);
assert(neutralTargets >= 16, `Neutral target coverage ${neutralTargets}`);

const ids = new Set<string>();
const fingerprints = new Set<string>();
let wrongOptions = 0;
let ql033 = 0;
let ql034 = 0;
let sharedSetQuestions = 0;
let standaloneQuestions = 0;
let visibleDiagnosticCodes = 0;

for (const question of bank) {
  assert(!ids.has(question.itemId), `${question.itemId}: duplicate item ID`);
  assert(!fingerprints.has(question.metadata.semanticFingerprint), `${question.itemId}: duplicate fingerprint`);
  ids.add(question.itemId);
  fingerprints.add(question.metadata.semanticFingerprint);
  assert.deepEqual(
    generateBlrCp007EditorialV3Question(question.sourcePrototypeId, question.seed),
    question,
    `${question.itemId}: deterministic replay`,
  );
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.explanation.optionAnalysis.length, 4);
  assert(!/^Therefore\b/i.test(question.explanation.conclusion), `${question.itemId}: duplicated therefore risk`);
  assert.equal(question.metadata.studentVisibleDiagnosticCodes, false);
  assert.equal(question.metadata.uniqueTokenMeanings, true);
  assert.equal(new Set(question.codeKey.map((entry) => entry.token)).size, question.codeKey.length);
  assert.equal(new Set(question.codeKey.map((entry) => entry.relationId)).size, question.codeKey.length);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);

  if (question.delivery.mode === "SHARED_SET") {
    sharedSetQuestions += 1;
    assert(question.delivery.setId);
    assert.equal(question.delivery.itemCount, 4);
  } else {
    standaloneQuestions += 1;
  }

  question.options.forEach((option, index) => {
    assert.equal(option.graphValidity, "VALID", `${question.itemId}: invalid option graph ${index}`);
    if (!option.isCorrectAnswerForTask) {
      wrongOptions += 1;
      assert(option.failureCode);
      assert(option.studentExplanation.length >= 20);
    }
    const analysis = question.explanation.optionAnalysis[index]!;
    assert.equal(analysis.optionText, option.text);
    assert.equal(analysis.explanation, option.studentExplanation);
    if (/\b(?:WRONG_|CLAIM_|BROKEN_CHAIN|TOKENS_SWAPPED)\b/.test(option.studentExplanation)) {
      visibleDiagnosticCodes += 1;
    }
  });

  if (question.qlId === "BLR-QL-033") {
    ql033 += 1;
    assert(!/first and third blanks/i.test(question.stem));
    assert(!/through .* (?:mother|father|husband|wife|brother|sister)/i.test(question.stem));
    assert(/statement order/i.test(question.stem));
    assert(question.metadata.difficulty !== "EASY");
  }

  if (question.qlId === "BLR-QL-034") {
    ql034 += 1;
    assert.equal(question.metadata.allCandidatesMeaningful, true);
    assert.equal(question.metadata.shortcutResistant, true);
    assert(/Candidates: P, Q, R, S/.test(question.stem));
    assert.equal(question.query.kind, "MISSING_PERSON");
    if (question.query.kind === "MISSING_PERSON") {
      const clueStatements = question.query.completeStatements.filter((_, index) => index !== question.query.blankStatementIndex);
      const cluePeople = new Set(clueStatements.flatMap((value) => [value.leftId, value.rightId]));
      for (const candidate of ["P", "Q", "R", "S"]) {
        assert(cluePeople.has(candidate), `${question.itemId}: ${candidate} absent from clues`);
      }
    }
  }

  if (question.qlId === "BLR-QL-035") {
    for (const option of question.options) {
      assert(/actual relation|written claim matches|statement is invalid/i.test(option.studentExplanation));
    }
  }
}

assert.equal(wrongOptions, 504);
assert.equal(ql033, 24);
assert.equal(ql034, 32);
assert.equal(sharedSetQuestions, 84);
assert.equal(standaloneQuestions, 84);
assert.equal(visibleDiagnosticCodes, 0);

for (const plan of BLR_CP007_V3_PROTOTYPE_PLANS) {
  const questions = bank.filter((question) => question.sourcePrototypeId === plan.prototypeId);
  assert.equal(questions.length, 8);
  assert.equal(new Set(questions.map((question) => question.metadata.semanticScenarioFingerprint)).size, 8);
  const shared = questions.filter((question) => question.delivery.mode === "SHARED_SET");
  assert.equal(shared.length, 4);
  const sharedKeys = new Set(shared.map((question) => JSON.stringify(question.codeKey)));
  assert.equal(sharedKeys.size, 1, `${plan.prototypeId}: shared-set code key drift`);
}

console.log(JSON.stringify({
  ...telemetry,
  wrongOptions,
  ql033,
  ql034,
  sharedSetQuestions,
  standaloneQuestions,
  visibleDiagnosticCodes,
  verdict: "BLR-CP-007 EDITORIAL V3 SEMANTIC REMODEL PASSED EXECUTABLE REVIEW GATES; HUMAN APPROVAL REQUIRED",
}, null, 2));
