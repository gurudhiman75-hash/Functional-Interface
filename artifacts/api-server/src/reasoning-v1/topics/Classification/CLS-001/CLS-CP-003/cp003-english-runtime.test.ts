import assert from "node:assert/strict";
import {
  CLS_CP003_ENGLISH_CONTRACTS,
  CLS_CP003_ENGLISH_QL_IDS,
} from "./cp003-english-contracts";
import { generateClsCp003EnglishQuestion } from "./cp003-english-runtime";
import {
  auditClsCp003DisplayedWords,
  independentlyVerifyClsCp003Question,
} from "./runtime";

assert.deepEqual(CLS_CP003_ENGLISH_QL_IDS, ["CLS-QL-005", "CLS-QL-006"]);
assert.equal(CLS_CP003_ENGLISH_CONTRACTS.length, 2);

const prototypeCoverage = new Map<string, number>();
const qlCoverage = new Map<string, number>();
const optionCounts = new Set<number>();
const difficulties = new Set<string>();
const answerPositions = [0, 0, 0, 0, 0];
const fingerprints = new Set<string>();

for (const qlId of CLS_CP003_ENGLISH_QL_IDS) {
  const contract = CLS_CP003_ENGLISH_CONTRACTS.find((candidate) => candidate.qlId === qlId)!;
  for (let seed = 0; seed < 400; seed += 1) {
    const question = generateClsCp003EnglishQuestion(qlId, seed);
    const replay = generateClsCp003EnglishQuestion(qlId, seed);
    assert.deepEqual(question, replay, `${qlId}/${seed} is not deterministic`);
    assert.equal(question.qlId, qlId);
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.task, contract.task);
    assert.ok(contract.allowedPrototypeIds.includes(question.metadata.sourcePrototypeId));
    assert.equal(question.metadata.solveContractId, contract.solveContractId);
    assert.equal(question.metadata.runtimeVersion, "cls-cp003-english-runtime-v2");
    assert.equal(question.metadata.sourceSaturationStatus, "ENGLISH_SOURCE_SATURATED");
    assert.equal(question.metadata.locale, "en-IN");
    assert.ok(question.options.length === 4 || question.options.length === 5);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.outlierIndex, question.correctIndex);
    assert.equal(question.lifecycle.reviewStatus, "FROZEN_ENGLISH_RUNTIME_PROOF");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.reviewOnly, true);

    if (qlId === "CLS-QL-006") {
      assert.equal(question.task, "RESOLVE_JUMBLES_AND_FIND_OUTLIER");
      assert.equal(auditClsCp003DisplayedWords(question.options).result, "NO_VALID_RULE");
    } else {
      assert.equal(question.task, "FIND_WORD_STRUCTURE_OUTLIER");
    }

    const independent = independentlyVerifyClsCp003Question(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.outlierIndex, question.correctIndex);

    const learnerText = [
      question.stem,
      ...question.options,
      question.answer,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(!/CLS-|PROT-|WORD_LENGTH|VOWEL_COUNT|PRIMARY_AFFIX|dataset version|candidate rule/i.test(learnerText));
    assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));

    fingerprints.add(JSON.stringify({ qlId, stem: question.stem, options: question.options, answer: question.answer }));
    qlCoverage.set(qlId, (qlCoverage.get(qlId) ?? 0) + 1);
    prototypeCoverage.set(question.metadata.sourcePrototypeId, (prototypeCoverage.get(question.metadata.sourcePrototypeId) ?? 0) + 1);
    optionCounts.add(question.options.length);
    difficulties.add(question.difficulty);
    answerPositions[question.correctIndex] += 1;
  }
}

assert.deepEqual([...qlCoverage.values()], [400, 400]);
assert.equal(prototypeCoverage.size, 7);
assert.deepEqual(optionCounts, new Set([4, 5]));
assert.deepEqual(difficulties, new Set(["EASY", "MEDIUM", "HARD"]));
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(fingerprints.size >= 760, `CP003 English diversity is too low: ${fingerprints.size}/800`);
assert.throws(() => generateClsCp003EnglishQuestion("CLS-QL-999" as never, 0));
assert.throws(() => generateClsCp003EnglishQuestion("CLS-QL-005", -1));

console.log("CLS-CP-003 English runtime freeze audit passed.", {
  generated: 800,
  uniqueVisibleQuestions: fingerprints.size,
  qls: qlCoverage.size,
  prototypes: prototypeCoverage.size,
  optionCounts: [...optionCounts].sort(),
  difficulties: [...difficulties].sort(),
  answerPositions,
});
