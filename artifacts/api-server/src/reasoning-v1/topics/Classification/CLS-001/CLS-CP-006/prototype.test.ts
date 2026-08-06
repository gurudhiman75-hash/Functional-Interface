import assert from "node:assert/strict";
import { independentlyVerifyClsCp006Question } from "./audit";
import {
  CLS_CP006_PROTOTYPES,
  CLS_CP006_RULE_IDS,
  clsCp006LetterPosition,
} from "./alphabet-domain";
import { generateClsCp006Question } from "./runtime";

const QUESTIONS_PER_PROTOTYPE = 60;
const fingerprints = new Set<string>();
const prototypeCoverage = new Map<string, number>();
const ruleCoverage = new Set<string>();
const taskCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositions = [0, 0, 0, 0, 0];
const stemForms = new Map<string, Set<string>>();
let sameAnswerMultiRuleQuestions = 0;
let maximumSourceAttempts = 0;

for (const prototype of CLS_CP006_PROTOTYPES) {
  const stems = new Set<string>();
  stemForms.set(prototype.prototypeId, stems);
  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const optionCount = seed % 3 === 0 ? 5 : 4;
    const question = generateClsCp006Question(prototype.prototypeId, seed, optionCount);
    const replay = generateClsCp006Question(prototype.prototypeId, seed, optionCount);
    assert.deepEqual(question, replay, `${prototype.prototypeId}/${seed} is not deterministic`);

    assert.equal(question.checkpointId, "CLS-CP-006");
    assert.equal(question.prototypeId, prototype.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.task, prototype.task);
    assert.equal(question.optionKind, prototype.optionKind);
    assert.ok(prototype.allowedRuleIds.includes(question.intendedRuleId));
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

    const independent = independentlyVerifyClsCp006Question(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);
    assert.equal(independent.intendedRuleSupported, true);

    for (const item of question.items) {
      assert.equal(item.kind, question.optionKind);
      for (const letter of item.letters) {
        assert.ok(clsCp006LetterPosition(letter) >= 1);
      }
      if (item.kind === "LETTER_PAIR") {
        assert.notEqual(item.letters[0], item.letters[1]);
      }
    }

    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.metadata.datasetVersion, "CLS-CP006-ALPHABET-DOMAIN-v1");
    assert.equal(question.metadata.runtimeVersion, "cls-cp006-discovery-v1");
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

    assert.ok(question.stem.length >= 35 && question.stem.length <= 150);
    assert.equal(question.explanation.coreConcept.length, 1);
    assert.equal(question.explanation.stepByStep.length, optionCount + 1);
    assert.equal(question.explanation.examSpeedShortcut.length, 1);
    assert.equal(question.explanation.commonTrapWarning.length, 1);
    assert.match(
      question.explanation.examSpeedShortcut[0]!,
      /^(Add|Check|Label|Mark|Subtract|Use|Write)/,
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
      !/CLS-|PROT-|LETTER_[A-Z_]+|PAIR_[A-Z_]+|dataset version|candidate rule/i.test(
        learnerText,
      ),
    );
    assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));

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

assert.equal(prototypeCoverage.size, CLS_CP006_PROTOTYPES.length);
assert.ok(
  [...prototypeCoverage.values()].every((count) => count === QUESTIONS_PER_PROTOTYPE),
);
assert.deepEqual(
  [...CLS_CP006_RULE_IDS].filter((ruleId) => !ruleCoverage.has(ruleId)),
  [],
);
assert.deepEqual(
  taskCoverage,
  new Set(["FIND_ODD_LETTER", "FIND_ODD_LETTER_PAIR"]),
);
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(
  fingerprints.size >= 300,
  `CLS-CP-006 diversity is too low: ${fingerprints.size}/480`,
);
for (const [prototypeId, stems] of stemForms) {
  assert.ok(stems.size >= 4, `${prototypeId} has only ${stems.size} stem forms`);
}
assert.ok(
  maximumSourceAttempts < 1_000,
  `CLS-CP-006 generation required ${maximumSourceAttempts} attempts`,
);
assert.throws(() => generateClsCp006Question("CLS-CP006-PROT-999" as never, 0));
assert.throws(() => generateClsCp006Question("CLS-CP006-PROT-001", -1));

console.log("CLS-CP-006 alphabet and letter-pair discovery audit passed.", {
  generated: CLS_CP006_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE,
  uniqueVisibleQuestions: fingerprints.size,
  prototypes: prototypeCoverage.size,
  rules: ruleCoverage.size,
  tasks: [...taskCoverage].sort(),
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositions,
  sameAnswerMultiRuleQuestions,
  maximumSourceAttempts,
});
