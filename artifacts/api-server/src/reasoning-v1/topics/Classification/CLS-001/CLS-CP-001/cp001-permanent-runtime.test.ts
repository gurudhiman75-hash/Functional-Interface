import assert from "node:assert/strict";
import {
  CLS_CP001_PERMANENT_CONTRACTS,
  getClsCp001PermanentContract,
} from "./cp001-permanent-contracts";
import { generateClsCp001EnglishQuestion } from "./cp001-runtime";
import {
  generateClsCp001Prototype,
  independentlyVerifyClsCp001Question,
} from "./runtime";

assert.equal(CLS_CP001_PERMANENT_CONTRACTS.length, 2);
assert.deepEqual(CLS_CP001_PERMANENT_CONTRACTS.map((contract) => contract.qlId), [
  "CLS-QL-001",
  "CLS-QL-002",
]);
assert.equal(getClsCp001PermanentContract("CLS-QL-001").task, "FIND_OUTLIER");
assert.equal(getClsCp001PermanentContract("CLS-QL-002").task, "SELECT_CLASS_MEMBER");

const seenQuestions = new Set<string>();
const answerPositions = new Map<string, number[]>([
  ["CLS-QL-001", [0, 0, 0, 0]],
  ["CLS-QL-002", [0, 0, 0, 0]],
]);
const sourcePrototypeCoverage = new Map<string, Set<string>>([
  ["CLS-QL-001", new Set()],
  ["CLS-QL-002", new Set()],
]);
const difficultyCoverage = new Map<string, Set<string>>([
  ["CLS-QL-001", new Set()],
  ["CLS-QL-002", new Set()],
]);

for (const contract of CLS_CP001_PERMANENT_CONTRACTS) {
  for (let seed = 0; seed < 600; seed += 1) {
    const question = generateClsCp001EnglishQuestion(contract.qlId, seed);
    const replay = generateClsCp001EnglishQuestion(contract.qlId, seed);
    assert.deepEqual(question, replay, `${contract.qlId}/${seed} is not deterministic`);

    assert.equal(question.qlId, contract.qlId);
    assert.equal(question.permanentQlId, contract.qlId);
    assert.equal(question.seed, seed);
    assert.equal(question.chapterId, "CLS-001");
    assert.equal(question.checkpointId, "CLS-CP-001");
    assert.equal(question.task, contract.task);
    assert.equal(question.metadata.solveContractId, contract.solveContractId);
    assert.equal(question.metadata.runtimeVersion, "cls-cp001-runtime-v1");
    assert.equal(question.metadata.locale, "en-IN");
    assert.ok(contract.allowedPrototypeIds.includes(question.metadata.sourcePrototypeId));
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.lifecycle.permanentQlId, contract.qlId);
    assert.equal(question.lifecycle.reviewStatus, "FROZEN_RUNTIME_PROOF");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.ok(!("prototypeId" in question));

    const source = generateClsCp001Prototype(
      question.metadata.sourcePrototypeId,
      question.metadata.sourcePrototypeSeed,
    );
    assert.equal(source.task, question.task);
    assert.equal(source.intendedClassId, question.intendedClassId);
    assert.equal(source.correctIndex, question.correctIndex);
    assert.deepEqual(source.givens, question.givens);
    assert.deepEqual(source.options, question.options);
    assert.equal(source.answer, question.answer);
    assert.deepEqual(source.ambiguityAudit, question.ambiguityAudit);
    assert.deepEqual(source.difficultyFeatures, question.difficultyFeatures);

    const independent = independentlyVerifyClsCp001Question(source);
    assert.equal(independent.correctIndex, question.correctIndex);
    assert.equal(independent.classId, question.intendedClassId);
    assert.equal(independent.audit.result, "UNIQUE");

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    if (question.task === "FIND_OUTLIER") assert.equal(question.givens.length, 0);
    else assert.equal(question.givens.length, 3);

    const fingerprint = JSON.stringify({
      qlId: question.qlId,
      stem: question.stem,
      givens: question.givens,
      options: question.options,
    });
    assert.ok(!seenQuestions.has(fingerprint), `${contract.qlId}/${seed} collided with an earlier permanent question`);
    seenQuestions.add(fingerprint);

    answerPositions.get(contract.qlId)![question.correctIndex] += 1;
    sourcePrototypeCoverage.get(contract.qlId)!.add(question.metadata.sourcePrototypeId);
    difficultyCoverage.get(contract.qlId)!.add(question.difficulty);
  }

  const positions = answerPositions.get(contract.qlId)!;
  assert.deepEqual(positions.map((count) => count > 0), [true, true, true, true]);
  assert.ok(Math.max(...positions) / Math.min(...positions) < 1.4, `${contract.qlId} answer positions are imbalanced: ${positions}`);
  assert.deepEqual(
    sourcePrototypeCoverage.get(contract.qlId),
    new Set(contract.allowedPrototypeIds),
    `${contract.qlId} did not exercise every frozen source control`,
  );
}

assert.equal(seenQuestions.size, 1200);
assert.ok(difficultyCoverage.get("CLS-QL-001")!.has("EASY"));
assert.ok(difficultyCoverage.get("CLS-QL-001")!.has("MEDIUM"));
assert.ok(difficultyCoverage.get("CLS-QL-001")!.has("HARD"));
assert.ok(difficultyCoverage.get("CLS-QL-002")!.size >= 2);
assert.throws(() => generateClsCp001EnglishQuestion("CLS-QL-001", -1));
assert.throws(() => generateClsCp001EnglishQuestion("CLS-QL-002", Number.MAX_SAFE_INTEGER));

console.log("CLS-CP-001 permanent English runtime audit passed.", {
  qls: CLS_CP001_PERMANENT_CONTRACTS.length,
  generatedQuestions: seenQuestions.size,
  answerPositions: Object.fromEntries(answerPositions),
  sourcePrototypeCoverage: Object.fromEntries(
    [...sourcePrototypeCoverage].map(([qlId, values]) => [qlId, [...values].sort()]),
  ),
  difficultyCoverage: Object.fromEntries(
    [...difficultyCoverage].map(([qlId, values]) => [qlId, [...values].sort()]),
  ),
});
