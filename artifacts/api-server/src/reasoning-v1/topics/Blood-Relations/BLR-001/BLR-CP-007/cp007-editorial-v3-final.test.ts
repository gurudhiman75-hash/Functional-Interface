import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV3FinalTelemetry,
  generateBlrCp007EditorialV3FinalBank,
  generateBlrCp007EditorialV3FinalQuestion,
} from "./cp007-editorial-v3-final";
import { BLR_CP007_V3_PROTOTYPE_PLANS } from "./cp007-editorial-v3-scenarios";

const bank = generateBlrCp007EditorialV3FinalBank();
const telemetry = buildBlrCp007EditorialV3FinalTelemetry(bank);

assert.equal(bank.length, 168);
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
assert((telemetry.keyStyleCounts.SYMBOL ?? 0) >= 115);
assert((telemetry.keyStyleCounts.LETTER ?? 0) >= 28);
assert((telemetry.keyStyleCounts.NEUTRAL_WORD ?? 0) <= 16);
assert(Math.abs((telemetry.targetGenderClassCounts.MALE ?? 0) - (telemetry.targetGenderClassCounts.FEMALE ?? 0)) <= 4);
assert((telemetry.targetGenderClassCounts.FEMALE ?? 0) >= 55);
assert((telemetry.targetGenderClassCounts.NEUTRAL ?? 0) >= 16);

const ids = new Set<string>();
const fingerprints = new Set<string>();
let wrongOptions = 0;
let shared = 0;
let standalone = 0;

for (const question of bank) {
  assert(!ids.has(question.itemId));
  assert(!fingerprints.has(question.metadata.semanticFingerprint));
  ids.add(question.itemId);
  fingerprints.add(question.metadata.semanticFingerprint);
  assert.deepEqual(generateBlrCp007EditorialV3FinalQuestion(question.sourcePrototypeId, question.seed), question);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(new Set(question.codeKey.map((entry) => entry.token)).size, question.codeKey.length);
  assert.equal(new Set(question.codeKey.map((entry) => entry.relationId)).size, question.codeKey.length);
  assert(!/^Therefore\b/i.test(question.explanation.conclusion));
  assert.equal(question.metadata.studentVisibleDiagnosticCodes, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);

  if (question.delivery.mode === "SHARED_SET") shared += 1;
  else standalone += 1;

  question.options.forEach((option, index) => {
    assert.equal(option.graphValidity, "VALID");
    assert.equal(question.explanation.optionAnalysis[index]!.explanation, option.studentExplanation);
    assert(!/\b(?:WRONG_|CLAIM_|BROKEN_CHAIN|TOKENS_SWAPPED)\b/.test(option.studentExplanation));
    if (!option.isCorrectAnswerForTask) {
      wrongOptions += 1;
      assert(option.failureCode);
    }
  });

  if (question.qlId === "BLR-QL-033") {
    assert(/statement order/i.test(question.stem));
    assert(!/first and third blanks/i.test(question.stem));
    assert(!/through .* (?:mother|father|husband|wife|brother|sister)/i.test(question.stem));
    assert.notEqual(question.metadata.difficulty, "EASY");
  }

  if (question.qlId === "BLR-QL-034") {
    assert.equal(question.metadata.allCandidatesMeaningful, true);
    assert.equal(question.metadata.shortcutResistant, true);
    assert.equal(question.query.kind, "MISSING_PERSON");
    if (question.query.kind === "MISSING_PERSON") {
      const clues = question.query.completeStatements.filter((_, index) => index !== question.query.blankStatementIndex);
      const people = new Set(clues.flatMap((statement) => [statement.leftId, statement.rightId]));
      for (const candidate of ["P", "Q", "R", "S"]) assert(people.has(candidate));
    }
  }

  if (question.qlId === "BLR-QL-035") {
    question.options.forEach((option) => {
      assert(/actual relation|written claim matches|statement is invalid/i.test(option.studentExplanation));
    });
  }
}

assert.equal(wrongOptions, 504);
assert.equal(shared, 84);
assert.equal(standalone, 84);

for (const plan of BLR_CP007_V3_PROTOTYPE_PLANS) {
  const questions = bank.filter((question) => question.sourcePrototypeId === plan.prototypeId);
  assert.equal(questions.length, 8);
  assert.equal(new Set(questions.map((question) => question.metadata.semanticScenarioFingerprint)).size, 8);
  const setQuestions = questions.filter((question) => question.delivery.mode === "SHARED_SET");
  assert.equal(setQuestions.length, 4);
  assert.equal(new Set(setQuestions.map((question) => JSON.stringify(question.codeKey))).size, 1);
}

console.log(JSON.stringify({
  ...telemetry,
  wrongOptions,
  shared,
  standalone,
  verdict: "BLR-CP-007 EDITORIAL V3 SEMANTIC REMODEL PASSED EXECUTABLE REVIEW GATES; HUMAN APPROVAL REQUIRED",
}, null, 2));
