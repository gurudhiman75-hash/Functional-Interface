import assert from "node:assert/strict";
import { independentlyVerifyClsCp007Question } from "./audit";
import {
  CLS_CP007_DOMAIN,
  CLS_CP007_PROTOTYPES,
  CLS_CP007_RULE_IDS,
  clsCp007LetterPosition,
} from "./cluster-domain";
import { generateClsCp007Question } from "./runtime";

const QUESTIONS_PER_PROTOTYPE = 30;
const fingerprints = new Set<string>();
const prototypeCoverage = new Map<string, number>();
const ruleCoverage = new Set<string>();
const lengthCoverage = new Set<number>();
const taskCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositions = [0, 0, 0, 0, 0];
const stemForms = new Map<string, Set<string>>();
let sameAnswerMultiRuleQuestions = 0;
let maximumSourceAttempts = 0;

assert.ok(CLS_CP007_DOMAIN.length >= 30_000, `CP-007 domain is too small: ${CLS_CP007_DOMAIN.length}`);

for (const prototype of CLS_CP007_PROTOTYPES) {
  const stems = new Set<string>();
  stemForms.set(prototype.prototypeId, stems);
  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const optionCount = seed % 3 === 0 ? 5 : 4;
    const question = generateClsCp007Question(prototype.prototypeId, seed, optionCount);
    const replay = generateClsCp007Question(prototype.prototypeId, seed, optionCount);
    assert.deepEqual(question, replay, `${prototype.prototypeId}/${seed} is not deterministic`);

    assert.equal(question.checkpointId, "CLS-CP-007");
    assert.equal(question.prototypeId, prototype.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.task, prototype.task);
    assert.ok(prototype.allowedRuleIds.includes(question.intendedRuleId));
    assert.ok(prototype.allowedLengths.includes(question.clusterLength));
    assert.equal(question.options.length, optionCount);
    assert.equal(question.items.length, optionCount);
    assert.equal(new Set(question.options).size, optionCount);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.evidenceByOption.length, optionCount);
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
    if (question.ambiguityAudit.candidateSupports.length > 1) {
      sameAnswerMultiRuleQuestions += 1;
    }

    const independent = independentlyVerifyClsCp007Question(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);
    assert.equal(independent.intendedRuleSupported, true);

    for (const [index, item] of question.items.entries()) {
      assert.equal(item.kind, "LETTER_CLUSTER");
      assert.equal(item.letters.length, question.clusterLength);
      assert.match(question.options[index]!, /^[A-Z]{3,5}$/);
      for (const letter of item.letters) {
        assert.ok(clsCp007LetterPosition(letter) >= 1);
      }
      assert.ok(
        question.evidenceByOption[index]!.includes(question.options[index]!),
        `${prototype.prototypeId}/${seed} evidence does not name option ${index + 1}`,
      );
    }

    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.metadata.datasetVersion, "CLS-CP007-LETTER-CLUSTER-DOMAIN-v1");
    assert.equal(question.metadata.runtimeVersion, "cls-cp007-discovery-v1");
    assert.equal(question.metadata.locale, "en-IN");
    assert.equal(question.metadata.optionCount, optionCount);
    assert.equal(
      question.metadata.sourceSaturationStatus,
      "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN",
    );
    assert.equal(question.lifecycle.permanentQlId, null);
    assert.equal(question.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);

    assert.ok(question.stem.length >= 45 && question.stem.length <= 170);
    assert.equal(question.explanation.coreConcept.length, 1);
    assert.equal(question.explanation.stepByStep.length, optionCount + 1);
    assert.equal(question.explanation.examSpeedShortcut.length, 1);
    assert.equal(question.explanation.commonTrapWarning.length, 1);
    assert.match(
      question.explanation.examSpeedShortcut[0]!,
      /^(Add|Check|Compare|Label|Mark|Subtract|Use|Write)/,
    );

    const learnerText = [
      question.stem,
      ...question.options,
      question.answer,
      ...question.evidenceByOption,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(
      !/CLS-|PROT-|CLUSTER_[A-Z_]+|dataset version|candidate rule|source prototype/i.test(
        learnerText,
      ),
    );
    assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));
    assert.ok(!/what comes next|complete the series|in a certain code|is related to/i.test(question.stem));

    fingerprints.add(
      JSON.stringify({
        prototypeId: question.prototypeId,
        stem: question.stem,
        options: question.options,
        answer: question.answer,
      }),
    );
    stems.add(question.stem);
    prototypeCoverage.set(
      prototype.prototypeId,
      (prototypeCoverage.get(prototype.prototypeId) ?? 0) + 1,
    );
    ruleCoverage.add(question.intendedRuleId);
    lengthCoverage.add(question.clusterLength);
    taskCoverage.add(question.task);
    difficultyCoverage.add(question.difficulty);
    optionCountCoverage.add(optionCount);
    answerPositions[question.correctIndex] += 1;
    maximumSourceAttempts = Math.max(
      maximumSourceAttempts,
      Math.floor((question.metadata.sourcePrototypeSeed - seed) / 10_007),
    );
  }
}

assert.equal(prototypeCoverage.size, CLS_CP007_PROTOTYPES.length);
assert.ok(
  [...prototypeCoverage.values()].every((count) => count === QUESTIONS_PER_PROTOTYPE),
);
assert.deepEqual(
  [...CLS_CP007_RULE_IDS].filter((ruleId) => !ruleCoverage.has(ruleId)),
  [],
);
assert.deepEqual(lengthCoverage, new Set([3, 4, 5]));
assert.deepEqual(taskCoverage, new Set(["FIND_ODD_LETTER_CLUSTER"]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(
  fingerprints.size >= 320,
  `CLS-CP-007 diversity is too low: ${fingerprints.size}/${CLS_CP007_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE}`,
);
for (const [prototypeId, stems] of stemForms) {
  assert.ok(stems.size >= 4, `${prototypeId} has only ${stems.size} stem forms`);
}
assert.ok(
  maximumSourceAttempts < 2_000,
  `CLS-CP-007 generation required ${maximumSourceAttempts} attempts`,
);
assert.throws(() => generateClsCp007Question("CLS-CP007-PROT-999" as never, 0));
assert.throws(() => generateClsCp007Question("CLS-CP007-PROT-001", -1));

console.log("CLS-CP-007 letter-cluster discovery audit passed.", {
  domainSize: CLS_CP007_DOMAIN.length,
  generated: CLS_CP007_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE,
  uniqueVisibleQuestions: fingerprints.size,
  prototypes: prototypeCoverage.size,
  rules: ruleCoverage.size,
  lengths: [...lengthCoverage].sort(),
  tasks: [...taskCoverage].sort(),
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositions,
  sameAnswerMultiRuleQuestions,
  maximumSourceAttempts,
});
