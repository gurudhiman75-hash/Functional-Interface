import assert from "node:assert/strict";
import {
  CLS_CP002_PERMANENT_CONTRACT,
  CLS_CP002_QL_ID,
  CLS_CP002_SOLVE_CONTRACT_ID,
} from "./cp002-permanent-contract";
import { generateClsCp002EnglishQuestion } from "./cp002-permanent-runtime";
import {
  CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS,
  CLS_CP002_RELATIONS,
  CLS_CP002_PROTOTYPES,
} from "./relation-registry";
import { independentlyVerifyClsCp002Question } from "./runtime";

const GENERATED_COUNT = 1600;

assert.equal(CLS_CP002_QL_ID, "CLS-QL-004");
assert.equal(CLS_CP002_SOLVE_CONTRACT_ID, "CP002-FIND-ODD-SEMANTIC-RELATION-PAIR");
assert.equal(CLS_CP002_PERMANENT_CONTRACT.status, "FROZEN_MULTILINGUAL_RUNTIME_PROOF");
assert.equal(CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds.length, 5);
assert.deepEqual(
  CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds,
  CLS_CP002_PROTOTYPES.map((prototype) => prototype.prototypeId),
);

const fingerprints = new Set<string>();
const relationCoverage = new Set<string>();
const prototypeCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositions = [0, 0, 0, 0, 0];
let duplicateVisibleQuestionCount = 0;

for (let seed = 0; seed < GENERATED_COUNT; seed += 1) {
  const question = generateClsCp002EnglishQuestion(CLS_CP002_QL_ID, seed);
  const replay = generateClsCp002EnglishQuestion(CLS_CP002_QL_ID, seed);
  assert.deepEqual(question, replay, `${seed} is not deterministic`);

  assert.equal(question.qlId, CLS_CP002_QL_ID);
  assert.equal(question.permanentQlId, CLS_CP002_QL_ID);
  assert.equal(question.task, "FIND_ODD_PAIR");
  assert.equal(question.metadata.solveContractId, CLS_CP002_SOLVE_CONTRACT_ID);
  assert.equal(question.metadata.locale, "en-IN");
  assert.equal(question.metadata.runtimeVersion, "cls-cp002-permanent-runtime-v1");
  assert.ok(CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds.includes(question.metadata.sourcePrototypeId));
  assert.ok(question.options.length === 4 || question.options.length === 5);
  assert.equal(question.options.length, question.metadata.optionCount);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(new Set(question.options).size, question.options.length);
  assert.equal(question.ambiguityAudit.result, "UNIQUE");
  assert.equal(question.ambiguityAudit.winningRelationId, question.intendedRelationId);
  assert.equal(question.ambiguityAudit.winningOutlierIndex, question.correctIndex);
  assert.equal(question.lifecycle.reviewStatus, "FROZEN_MULTILINGUAL_RUNTIME_PROOF");
  assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.reviewOnly, true);

  if (question.generationProfile === "CATEGORY_SAFE_FALSE_PAIR") {
    assert.ok(CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS.includes(question.intendedRelationId as never));
  }

  const independent = independentlyVerifyClsCp002Question(question);
  assert.equal(independent.result, "UNIQUE");
  assert.equal(independent.winningRelationId, question.intendedRelationId);
  assert.equal(independent.winningOutlierIndex, question.correctIndex);

  const learnerText = [
    question.stem,
    ...question.options,
    question.intendedRelationLabel,
    ...question.explanation.coreConcept,
    ...question.explanation.stepByStep,
    ...question.explanation.examSpeedShortcut,
    ...question.explanation.commonTrapWarning,
  ].join("\n");
  assert.ok(!/CLS-|SEM_|LEX_|PAIR_CLASS_|prototype|quality rank|candidate relation|ontology/i.test(learnerText));
  assert.ok(!/follows pair of|pair of computer components|animals capable of flight|aquatic animals/i.test(learnerText));
  assert.ok(question.explanation.stepByStep.join(" ").includes(question.answer));

  const fingerprint = JSON.stringify({
    stem: question.stem,
    options: question.options,
    answer: question.answer,
    prototype: question.metadata.sourcePrototypeId,
  });
  if (fingerprints.has(fingerprint)) duplicateVisibleQuestionCount += 1;
  else fingerprints.add(fingerprint);

  relationCoverage.add(question.intendedRelationId);
  prototypeCoverage.add(question.metadata.sourcePrototypeId);
  difficultyCoverage.add(question.difficulty);
  optionCountCoverage.add(question.options.length);
  answerPositions[question.correctIndex] += 1;
}

assert.ok(
  fingerprints.size >= 1570,
  `Visible-question diversity is too low: ${fingerprints.size}/${GENERATED_COUNT} unique (${duplicateVisibleQuestionCount} duplicates)`,
);
assert.ok(duplicateVisibleQuestionCount <= 30);
const missingRelationIds = CLS_CP002_RELATIONS
  .map((relation) => relation.relationId)
  .filter((relationId) => !relationCoverage.has(relationId));
assert.equal(
  relationCoverage.size,
  CLS_CP002_RELATIONS.length,
  `Permanent runtime missed relations: ${missingRelationIds.join(", ")}`,
);
assert.equal(prototypeCoverage.size, CLS_CP002_PROTOTYPES.length);
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(answerPositions.map((count) => count > 0), [true, true, true, true, true]);
assert.ok(Math.max(...answerPositions.slice(0, 4)) / Math.min(...answerPositions.slice(0, 4)) < 1.45);
assert.ok(answerPositions[4]! > 40);

assert.throws(() => generateClsCp002EnglishQuestion(CLS_CP002_QL_ID, -1));
assert.throws(() => generateClsCp002EnglishQuestion("CLS-QL-999" as never, 0));

console.log("CLS-CP-002 frozen permanent runtime audit passed.", {
  qlId: CLS_CP002_QL_ID,
  generated: GENERATED_COUNT,
  uniqueVisibleQuestions: fingerprints.size,
  duplicateVisibleQuestionCount,
  relations: relationCoverage.size,
  prototypes: prototypeCoverage.size,
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositions,
});