import assert from "node:assert/strict";
import {
  CLS_CP004_ENGLISH_CONTRACT,
  CLS_CP004_ENGLISH_QL_ID,
  CLS_CP004_ENGLISH_SOLVE_CONTRACT_ID,
} from "./cp004-english-contract";
import { generateClsCp004EnglishQuestion } from "./cp004-english-runtime";
import { CLS_CP004_RULE_IDS } from "./number-domain";
import { independentlyVerifyClsCp004Question } from "./runtime";

assert.equal(CLS_CP004_ENGLISH_QL_ID, "CLS-QL-007");
assert.equal(CLS_CP004_ENGLISH_SOLVE_CONTRACT_ID, "CP004-FIND-NUMBER-PROPERTY-OUTLIER");
assert.equal(CLS_CP004_ENGLISH_CONTRACT.allowedPrototypeIds.length, 13);

const GENERATED_COUNT = 2000;
const fingerprints = new Set<string>();
const prototypeCoverage = new Set<string>();
const ruleCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositions = [0, 0, 0, 0, 0];

for (let seed = 0; seed < GENERATED_COUNT; seed += 1) {
  const question = generateClsCp004EnglishQuestion(CLS_CP004_ENGLISH_QL_ID, seed);
  const replay = generateClsCp004EnglishQuestion(CLS_CP004_ENGLISH_QL_ID, seed);
  assert.deepEqual(question, replay, `${seed} is not deterministic`);
  assert.equal(question.qlId, CLS_CP004_ENGLISH_QL_ID);
  assert.equal(question.permanentQlId, CLS_CP004_ENGLISH_QL_ID);
  assert.equal(question.task, "FIND_NUMBER_PROPERTY_OUTLIER");
  assert.ok(CLS_CP004_ENGLISH_CONTRACT.allowedPrototypeIds.includes(question.metadata.sourcePrototypeId));
  assert.equal(question.metadata.solveContractId, CLS_CP004_ENGLISH_SOLVE_CONTRACT_ID);
  assert.equal(question.metadata.runtimeVersion, "cls-cp004-english-runtime-v2");
  assert.equal(question.metadata.sourceSaturationStatus, "ENGLISH_SOURCE_SATURATED");
  assert.equal(question.metadata.locale, "en-IN");
  assert.ok(question.options.length === 4 || question.options.length === 5);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(new Set(question.options).size, question.options.length);
  assert.equal(question.ambiguityAudit.result, "UNIQUE");
  assert.equal(question.ambiguityAudit.outlierIndex, question.correctIndex);
  assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
  assert.equal(question.lifecycle.reviewStatus, "FROZEN_ENGLISH_RUNTIME_PROOF");
  assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.reviewOnly, true);

  const independent = independentlyVerifyClsCp004Question(question);
  assert.equal(independent.result, "UNIQUE");
  assert.equal(independent.outlierIndex, question.correctIndex);
  assert.equal(independent.intendedRuleSupported, true);

  const learnerText = [
    question.stem,
    ...question.options,
    question.answer,
    ...question.explanation.coreConcept,
    ...question.explanation.stepByStep,
    ...question.explanation.examSpeedShortcut,
    ...question.explanation.commonTrapWarning,
  ].join("\n");
  assert.ok(!/CLS-|PROT-|DIVISIBLE_BY_|PERFECT_SQUARE_STATUS|NEAR_POWER_CLASS|dataset version|polynomial/i.test(learnerText));
  assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));

  fingerprints.add(JSON.stringify({ stem: question.stem, numbers: question.numbers, answer: question.answer }));
  prototypeCoverage.add(question.metadata.sourcePrototypeId);
  ruleCoverage.add(question.intendedRuleId);
  difficultyCoverage.add(question.difficulty);
  optionCountCoverage.add(question.options.length);
  answerPositions[question.correctIndex] += 1;
}

assert.equal(prototypeCoverage.size, 13);
assert.equal(ruleCoverage.size, CLS_CP004_RULE_IDS.length);
assert.deepEqual([...CLS_CP004_RULE_IDS].filter((ruleId) => !ruleCoverage.has(ruleId)), []);
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(fingerprints.size >= 1850, `CP004 English diversity is too low: ${fingerprints.size}/${GENERATED_COUNT}`);
assert.throws(() => generateClsCp004EnglishQuestion("CLS-QL-999" as never, 0));
assert.throws(() => generateClsCp004EnglishQuestion(CLS_CP004_ENGLISH_QL_ID, -1));

console.log("CLS-CP-004 English runtime freeze audit passed.", {
  generated: GENERATED_COUNT,
  uniqueVisibleQuestions: fingerprints.size,
  qlId: CLS_CP004_ENGLISH_QL_ID,
  prototypes: prototypeCoverage.size,
  rules: ruleCoverage.size,
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositions,
});
