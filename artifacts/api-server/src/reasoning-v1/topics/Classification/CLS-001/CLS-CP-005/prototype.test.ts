import assert from "node:assert/strict";
import { independentlyVerifyClsCp005Question } from "./audit";
import {
  auditClsCp005PresentationQuality,
  generateClsCp005QualityQuestion,
} from "./quality-runtime";
import {
  CLS_CP005_PROTOTYPES,
  CLS_CP005_RULE_IDS,
} from "./relation-registry";

const QUESTIONS_PER_PROTOTYPE = 60;
const fingerprints = new Set<string>();
const prototypeCoverage = new Map<string, number>();
const ruleCoverage = new Set<string>();
const taskCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositions = [0, 0, 0, 0, 0];
const stemCounts = new Map<string, Map<string, number>>();
let maximumSourceAttempts = 0;
let maximumAnswerMaximumRatio = 0;
let maximumAnswerTotalRatio = 0;
let expandedRuleSupportQuestions = 0;

for (const prototype of CLS_CP005_PROTOTYPES) {
  const counts = new Map<string, number>();
  stemCounts.set(prototype.prototypeId, counts);
  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const optionCount = seed % 3 === 0 ? 5 : 4;
    const question = generateClsCp005QualityQuestion(prototype.prototypeId, seed, optionCount);
    const replay = generateClsCp005QualityQuestion(prototype.prototypeId, seed, optionCount);
    assert.deepEqual(question, replay, `${prototype.prototypeId}/${seed} is not deterministic`);

    assert.equal(question.checkpointId, "CLS-CP-005");
    assert.equal(question.prototypeId, prototype.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.task, prototype.task);
    assert.equal(question.arity, prototype.arity);
    assert.ok(prototype.allowedRuleIds.includes(question.intendedRuleId));
    assert.equal(question.options.length, optionCount);
    assert.equal(question.tuples.length, optionCount);
    assert.equal(new Set(question.options).size, optionCount);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.evidenceByOption.length, optionCount);
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.ambiguityAudit.intendedRuleSupported, true);

    assert.equal(question.expandedSourceGapAudit.result, "EXPANDED_UNIQUE");
    assert.equal(question.expandedSourceGapAudit.answerIndex, question.correctIndex);
    assert.equal(question.expandedSourceGapAudit.intendedRuleSupported, true);
    assert.deepEqual(question.expandedSourceGapAudit.expandedAnswerIndexes, [question.correctIndex]);
    if (question.expandedSourceGapAudit.newRuleSupports.length > 0) expandedRuleSupportQuestions += 1;

    if (question.task === "SELECT_EQUIVALENT_NUMBER_SET") {
      assert.ok(question.referenceTuple !== null);
      assert.equal(question.referenceTuple!.length, question.arity);
    } else {
      assert.equal(question.referenceTuple, null);
    }
    for (const tuple of question.tuples) {
      assert.equal(tuple.length, question.arity);
      assert.equal(new Set(tuple).size, tuple.length, `${prototype.prototypeId}/${seed} repeats a number inside ${tuple.join(",")}`);
    }

    const quality = auditClsCp005PresentationQuality(question);
    assert.equal(quality.result, "PASS", `${prototype.prototypeId}/${seed}: ${quality.reasons.join("; ")}`);
    assert.deepEqual(question.presentationQualityAudit, quality);
    assert.equal(new Set(quality.unorderedTupleKeys).size, optionCount);
    assert.ok(quality.maximumValueRatio <= 20);
    assert.ok(quality.tupleTotalRatio <= 16);
    assert.ok(quality.answerMaximumRatio <= 4);
    assert.ok(quality.answerTotalRatio <= 4);
    maximumAnswerMaximumRatio = Math.max(maximumAnswerMaximumRatio, quality.answerMaximumRatio);
    maximumAnswerTotalRatio = Math.max(maximumAnswerTotalRatio, quality.answerTotalRatio);

    const independent = independentlyVerifyClsCp005Question(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);
    assert.equal(independent.intendedRuleSupported, true);

    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.metadata.datasetVersion, "CLS-CP005-TUPLE-DOMAIN-v1");
    assert.equal(question.metadata.runtimeVersion, "cls-cp005-discovery-v1");
    assert.equal(question.metadata.qualityVersion, "cls-cp005-presentation-quality-v3-expanded-source-gap");
    assert.equal(question.metadata.sourceGapAuditVersion, "cls-cp005-expanded-source-gap-v1");
    assert.ok(Number.isSafeInteger(question.metadata.sourcePrototypeSeed));
    maximumSourceAttempts = Math.max(
      maximumSourceAttempts,
      Math.floor((question.metadata.sourcePrototypeSeed - seed) / 10_007),
    );
    assert.equal(question.metadata.locale, "en-IN");
    assert.equal(question.metadata.sourceSaturationStatus, "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN");
    assert.equal(question.lifecycle.permanentQlId, null);
    assert.equal(question.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);

    assert.ok(question.stem.length >= 25 && question.stem.length <= 150);
    assert.equal(question.explanation.coreConcept.length, 1);
    assert.ok(question.explanation.stepByStep.length >= 3);
    assert.equal(question.explanation.examSpeedShortcut.length, 1);
    assert.equal(question.explanation.commonTrapWarning.length, 1);
    assert.match(question.explanation.examSpeedShortcut[0]!, /^(Add|Check|Compare|Cube|Find|Keep|Multiply|Reduce|Reverse|Square|Subtract|Try|Write)/);

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
    assert.ok(!/CLS-|PROT-|PAIR_[A-Z_]+|TRIPLE_[A-Z_]+|candidate rule|dataset version/i.test(learnerText));
    assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));

    fingerprints.add(JSON.stringify({
      prototypeId: question.prototypeId,
      stem: question.stem,
      referenceTuple: question.referenceTuple,
      tuples: question.tuples,
      answer: question.answer,
    }));
    counts.set(question.stem, (counts.get(question.stem) ?? 0) + 1);
    prototypeCoverage.set(prototype.prototypeId, (prototypeCoverage.get(prototype.prototypeId) ?? 0) + 1);
    ruleCoverage.add(question.intendedRuleId);
    taskCoverage.add(question.task);
    difficultyCoverage.add(question.difficulty);
    optionCountCoverage.add(optionCount);
    answerPositions[question.correctIndex] += 1;
  }
}

assert.equal(prototypeCoverage.size, CLS_CP005_PROTOTYPES.length);
assert.ok([...prototypeCoverage.values()].every((count) => count === QUESTIONS_PER_PROTOTYPE));
assert.deepEqual([...CLS_CP005_RULE_IDS].filter((ruleId) => !ruleCoverage.has(ruleId)), []);
assert.deepEqual(taskCoverage, new Set([
  "FIND_ODD_NUMBER_PAIR",
  "FIND_ODD_NUMBER_TRIPLE",
  "SELECT_EQUIVALENT_NUMBER_SET",
]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(fingerprints.size >= 1050, `CLS-CP-005 diversity is too low: ${fingerprints.size}/1200`);
for (const [prototypeId, counts] of stemCounts) {
  assert.ok(counts.size >= 4, `${prototypeId} has only ${counts.size} stem forms`);
  assert.ok(
    Math.max(...counts.values()) <= Math.ceil(QUESTIONS_PER_PROTOTYPE * 0.45),
    `${prototypeId} has a dominant stem: ${JSON.stringify(Object.fromEntries(counts))}`,
  );
}
assert.ok(maximumSourceAttempts < 240);
assert.throws(() => generateClsCp005QualityQuestion("CLS-CP005-PROT-999" as never, 0));
assert.throws(() => generateClsCp005QualityQuestion("CLS-CP005-PROT-001", -1));

console.log("CLS-CP-005 expanded-rule-safe number-tuple quality audit passed.", {
  generated: CLS_CP005_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE,
  uniqueVisibleQuestions: fingerprints.size,
  prototypes: prototypeCoverage.size,
  rules: ruleCoverage.size,
  tasks: [...taskCoverage].sort(),
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositions,
  minimumStemForms: Math.min(...[...stemCounts.values()].map((counts) => counts.size)),
  maximumSourceAttempts,
  maximumAnswerMaximumRatio,
  maximumAnswerTotalRatio,
  expandedRuleSupportQuestions,
});
