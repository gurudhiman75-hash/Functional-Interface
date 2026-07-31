import assert from "node:assert/strict";
import {
  CLS_CP005_SOURCE_GAP_RULE_IDS,
} from "./source-gap-registry";
import {
  auditClsCp005Wave2PresentationQuality,
  generateClsCp005Wave2QualityQuestion,
} from "./wave2-quality-runtime";
import {
  CLS_CP005_WAVE2_PROTOTYPES,
  CLS_CP005_WAVE2_VALID_COUNTS,
} from "./wave2-runtime";

const fingerprints = new Set<string>();
const ruleCoverage = new Set<string>();
const taskCoverage = new Set<string>();
const arityCoverage = new Set<number>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositions = [0, 0, 0, 0, 0];
const prototypeCounts = new Map<string, number>();
const stemCounts = new Map<string, Map<string, number>>();
let total = 0;
let maximumSourceAttempt = 0;
let maximumQualityAttempt = 0;
let maximumAnswerMaximumRatio = 0;
let maximumAnswerTotalRatio = 0;
let optionExplanations = 0;
let referenceExplanations = 0;

for (const [ruleId, count] of Object.entries(CLS_CP005_WAVE2_VALID_COUNTS)) {
  assert.ok(count >= 8, `${ruleId} has only ${count} governed valid tuples`);
}

for (const prototype of CLS_CP005_WAVE2_PROTOTYPES) {
  const sampleCount = prototype.task === "FIND_ODD_NUMBER_TUPLE"
    ? 12
    : prototype.arity === 2
      ? 80
      : prototype.arity === 3
        ? 36
        : 16;
  const counts = new Map<string, number>();
  stemCounts.set(prototype.prototypeId, counts);

  for (let seed = 0; seed < sampleCount; seed += 1) {
    const optionCount = seed % 3 === 0 ? 5 : 4;
    const question = generateClsCp005Wave2QualityQuestion(prototype.prototypeId, seed, optionCount);
    const replay = generateClsCp005Wave2QualityQuestion(prototype.prototypeId, seed, optionCount);
    assert.deepEqual(question, replay, `${prototype.prototypeId}/${seed} is not deterministic`);

    assert.equal(question.checkpointId, "CLS-CP-005");
    assert.equal(question.wave, "SOURCE_GAP_WAVE_2");
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

    assert.equal(question.expandedAmbiguityAudit.result, "EXPANDED_UNIQUE");
    assert.equal(question.expandedAmbiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.expandedAmbiguityAudit.intendedRuleSupported, true);
    assert.deepEqual(question.expandedAmbiguityAudit.expandedAnswerIndexes, [question.correctIndex]);

    if (question.task === "SELECT_EQUIVALENT_NUMBER_SET") {
      assert.ok(question.referenceTuple !== null);
      assert.equal(question.referenceTuple!.length, question.arity);
      assert.ok(question.explanation.stepByStep[0]!.includes("establishes the reference rule"));
      referenceExplanations += 1;
    } else {
      assert.equal(question.referenceTuple, null);
    }

    const orderedKeys = question.tuples.map((tuple) => tuple.join(","));
    const unorderedKeys = question.tuples.map((tuple) => [...tuple].sort((left, right) => left - right).join(","));
    assert.equal(new Set(orderedKeys).size, optionCount);
    assert.equal(new Set(unorderedKeys).size, optionCount);
    for (const tuple of question.tuples) {
      assert.equal(tuple.length, question.arity);
      assert.equal(new Set(tuple).size, tuple.length);
    }

    const presentation = auditClsCp005Wave2PresentationQuality(question);
    assert.equal(presentation.result, "PASS", `${prototype.prototypeId}/${seed}: ${presentation.reasons.join("; ")}`);
    assert.deepEqual(question.presentationQualityAudit, presentation);
    assert.ok(presentation.maximumValueRatio <= 20);
    assert.ok(presentation.tupleTotalRatio <= 16);
    assert.ok(presentation.answerMaximumRatio <= 4);
    assert.ok(presentation.answerTotalRatio <= 4);
    maximumAnswerMaximumRatio = Math.max(maximumAnswerMaximumRatio, presentation.answerMaximumRatio);
    maximumAnswerTotalRatio = Math.max(maximumAnswerTotalRatio, presentation.answerTotalRatio);

    for (const [optionIndex, evidence] of question.evidenceByOption.entries()) {
      const tuplePrefix = `${question.options[optionIndex]}: `;
      assert.ok(evidence.startsWith(tuplePrefix));
      const mathStart = evidence.indexOf("\\(");
      assert.ok(mathStart > tuplePrefix.length, `${prototype.prototypeId}/${seed}/${optionIndex} has no prose before math`);
      const prose = evidence.slice(tuplePrefix.length, mathStart).trim();
      assert.match(prose, /^[A-Z0-9].*[.!?]$/);
      assert.ok(prose.split(/\s+/).length >= 5, `${prototype.prototypeId}/${seed}/${optionIndex} has thin prose: ${prose}`);
      const shouldMatch = question.task === "SELECT_EQUIVALENT_NUMBER_SET"
        ? optionIndex === question.correctIndex
        : optionIndex !== question.correctIndex;
      assert.equal(evidence.includes("✅ Matches rule."), shouldMatch);
      assert.equal(evidence.includes("❌ Fails rule."), !shouldMatch);
      assert.equal((evidence.match(/\\\(/g) ?? []).length, (evidence.match(/\\\)/g) ?? []).length);
      optionExplanations += 1;
    }

    assert.equal(question.explanation.coreConcept.length, 1);
    assert.equal(question.explanation.stepByStep.length, 3);
    assert.equal(question.explanation.examSpeedShortcut.length, 1);
    assert.equal(question.explanation.commonTrapWarning.length, 1);
    assert.match(question.explanation.examSpeedShortcut[0]!, /^(Apply|Check|Cube|Divide|Multiply|Recover|Sort|Subtract|Take|Test)/);
    assert.ok(!/[²³×≠−]/u.test(question.explanation.coreConcept[0]!));

    assert.equal(question.metadata.runtimeVersion, "cls-cp005-source-gap-wave2-v1");
    assert.equal(question.metadata.editorialVersion, "cls-cp005-option-explanations-v3-simple-teacher");
    assert.equal(question.metadata.sourceGapRegistryVersion, "cls-cp005-source-gap-registry-v1");
    assert.equal(question.metadata.qualityVersion, "cls-cp005-wave2-answer-aware-v2");
    assert.equal(question.metadata.sourceSaturationStatus, "WAVE_2_EXECUTABLE__FINAL_GAP_AUDIT_OPEN");
    assert.equal(question.metadata.locale, "en-IN");
    assert.equal(question.metadata.optionCount, optionCount);
    assert.ok(Number.isSafeInteger(question.metadata.sourceAttempt));
    assert.ok(Number.isSafeInteger(question.metadata.sourcePrototypeSeed));
    maximumSourceAttempt = Math.max(maximumSourceAttempt, question.metadata.sourceAttempt);
    maximumQualityAttempt = Math.max(maximumQualityAttempt, Math.floor((question.metadata.sourcePrototypeSeed - seed) / 10_007));

    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.lifecycle.permanentQlId, null);
    assert.equal(question.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);

    const learnerText = [
      question.stem,
      ...question.options,
      ...question.evidenceByOption,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(!/CLS-|W2-PROT|PAIR_[A-Z_]+|TRIPLE_[A-Z_]+|QUADRUPLE_[A-Z_]+|source-gap registry/i.test(learnerText));
    assert.ok(!/(undefined|null|NaN|Infinity)/.test(learnerText));

    fingerprints.add(JSON.stringify({
      prototypeId: question.prototypeId,
      stem: question.stem,
      referenceTuple: question.referenceTuple,
      tuples: question.tuples,
      answer: question.answer,
    }));
    counts.set(question.stem, (counts.get(question.stem) ?? 0) + 1);
    prototypeCounts.set(prototype.prototypeId, (prototypeCounts.get(prototype.prototypeId) ?? 0) + 1);
    ruleCoverage.add(question.intendedRuleId);
    taskCoverage.add(question.task);
    arityCoverage.add(question.arity);
    difficultyCoverage.add(question.difficulty);
    optionCountCoverage.add(optionCount);
    answerPositions[question.correctIndex] += 1;
    total += 1;
  }
}

assert.equal(prototypeCounts.size, CLS_CP005_WAVE2_PROTOTYPES.length);
assert.deepEqual([...CLS_CP005_SOURCE_GAP_RULE_IDS].filter((ruleId) => !ruleCoverage.has(ruleId)), []);
assert.deepEqual(taskCoverage, new Set(["FIND_ODD_NUMBER_TUPLE", "SELECT_EQUIVALENT_NUMBER_SET"]));
assert.deepEqual(arityCoverage, new Set([2, 3, 4]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.ok(answerPositions.every((count) => count > 0));
assert.equal(fingerprints.size, total);
for (const [prototypeId, counts] of stemCounts) {
  assert.ok(counts.size >= 4, `${prototypeId} has only ${counts.size} stem forms`);
  const totalForPrototype = [...counts.values()].reduce((sum, count) => sum + count, 0);
  assert.ok(Math.max(...counts.values()) <= Math.ceil(totalForPrototype * 0.45), `${prototypeId} has a dominant stem`);
}
assert.ok(maximumSourceAttempt < 1800);
assert.ok(maximumQualityAttempt < 240);
assert.throws(() => generateClsCp005Wave2QualityQuestion("CLS-CP005-W2-PROT-999" as never, 0));
assert.throws(() => generateClsCp005Wave2QualityQuestion("CLS-CP005-W2-PROT-001", -1));

console.log("CLS-CP-005 answer-aware source-gap Wave 2 audit passed.", {
  generated: total,
  uniqueVisibleQuestions: fingerprints.size,
  prototypes: prototypeCounts.size,
  rules: ruleCoverage.size,
  tasks: [...taskCoverage].sort(),
  arities: [...arityCoverage].sort(),
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositions,
  optionExplanations,
  referenceExplanations,
  maximumSourceAttempt,
  maximumQualityAttempt,
  maximumAnswerMaximumRatio,
  maximumAnswerTotalRatio,
  governedValidCounts: CLS_CP005_WAVE2_VALID_COUNTS,
});
