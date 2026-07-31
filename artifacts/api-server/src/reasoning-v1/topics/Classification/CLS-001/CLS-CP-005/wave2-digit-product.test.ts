import assert from "node:assert/strict";
import { CLS_CP005_EXPANDED_RULE_COUNT } from "./source-gap-expanded-audit";
import {
  CLS_CP005_WAVE2_RULE_ID,
  CLS_CP005_WAVE2_VERSION,
  generateClsCp005Wave2DigitProductQuestion,
} from "./wave2-digit-product-runtime";

const fingerprints = new Set<string>();
const stems = new Map<string, number>();
const answerPositions = [0, 0, 0, 0, 0];
let generated = 0;
let explanations = 0;
let maximumSourceAttempt = 0;
let maximumAnswerMaximumRatio = 0;
let maximumAnswerTotalRatio = 0;

assert.equal(CLS_CP005_EXPANDED_RULE_COUNT, 35);

for (let seed = 0; seed < 240; seed += 1) {
  const optionCount = seed % 3 === 0 ? 5 : 4;
  const question = generateClsCp005Wave2DigitProductQuestion(seed, optionCount);
  const replay = generateClsCp005Wave2DigitProductQuestion(seed, optionCount);
  assert.deepEqual(question, replay, `seed ${seed} is not deterministic`);

  assert.equal(question.wave, "SOURCE_GAP_WAVE_2");
  assert.equal(question.permanentQlId, null);
  assert.equal(question.intendedRuleId, CLS_CP005_WAVE2_RULE_ID);
  assert.equal(question.intendedRuleValue, "DIGIT_PRODUCT");
  assert.equal(question.metadata.runtimeVersion, CLS_CP005_WAVE2_VERSION);
  assert.equal(question.metadata.completeRuleCount, CLS_CP005_EXPANDED_RULE_COUNT);
  assert.equal(question.metadata.sourceGapAuditVersion, "cls-cp005-expanded-source-gap-v2-digit-product");
  assert.equal(question.metadata.equivalentSetAdmission, "NOT_ADMITTED_PENDING_NATURALNESS_AUDIT");
  assert.equal(question.options.length, optionCount);
  assert.equal(new Set(question.options).size, optionCount);
  assert.equal(question.options[question.correctIndex], question.answer);

  assert.equal(question.expandedAmbiguityAudit.result, "EXPANDED_UNIQUE");
  assert.equal(question.expandedAmbiguityAudit.answerIndex, question.correctIndex);
  assert.equal(question.expandedAmbiguityAudit.intendedRuleSupported, true);
  assert.deepEqual(question.expandedAmbiguityAudit.expandedAnswerIndexes, [question.correctIndex]);
  assert.equal(question.expandedAmbiguityAudit.completeRuleCount, CLS_CP005_EXPANDED_RULE_COUNT);
  assert.ok(question.expandedAmbiguityAudit.supports.length >= 1);
  assert.ok(question.expandedAmbiguityAudit.supports.every((support) => support.answerIndex === question.correctIndex));
  assert.ok(question.expandedAmbiguityAudit.supports.some((support) => support.ruleId === CLS_CP005_WAVE2_RULE_ID));

  assert.equal(question.ambiguityAudit.result, "EXPANDED_UNIQUE");
  assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
  assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
  assert.equal(question.ambiguityAudit.completeRuleCount, CLS_CP005_EXPANDED_RULE_COUNT);
  assert.ok(question.ambiguityAudit.candidateSupports.every((support) => support.answerIndex === question.correctIndex));

  assert.equal(question.presentationQualityAudit.result, "PASS");
  assert.ok(question.presentationQualityAudit.maximumValueRatio <= 20);
  assert.ok(question.presentationQualityAudit.tupleTotalRatio <= 16);
  assert.ok(question.presentationQualityAudit.answerMaximumRatio <= 4);
  assert.ok(question.presentationQualityAudit.answerTotalRatio <= 4);
  maximumAnswerMaximumRatio = Math.max(maximumAnswerMaximumRatio, question.presentationQualityAudit.answerMaximumRatio);
  maximumAnswerTotalRatio = Math.max(maximumAnswerTotalRatio, question.presentationQualityAudit.answerTotalRatio);
  maximumSourceAttempt = Math.max(maximumSourceAttempt, question.metadata.sourceAttempt);

  assert.equal(question.evidenceByOption.length, optionCount);
  for (const [index, evidence] of question.evidenceByOption.entries()) {
    const shouldMatch = index !== question.correctIndex;
    assert.ok(evidence.includes("Multiplying the two digits"));
    assert.equal(evidence.includes("✅ Matches rule."), shouldMatch);
    assert.equal(evidence.includes("❌ Fails rule."), !shouldMatch);
    assert.equal((evidence.match(/\\\(/g) ?? []).length, 1);
    assert.equal((evidence.match(/\\\)/g) ?? []).length, 1);
    const tuplePrefix = `${question.options[index]}: `;
    const mathStart = evidence.indexOf("\\(");
    assert.ok(evidence.startsWith(tuplePrefix));
    assert.ok(mathStart > tuplePrefix.length);
    assert.ok(evidence.slice(tuplePrefix.length, mathStart).trim().split(/\s+/).length >= 8);
    explanations += 1;
  }

  const answerPair = question.pairs[question.correctIndex]!;
  const answerProduct = Math.floor(answerPair[0] / 10) * (answerPair[0] % 10);
  assert.notEqual(answerProduct, answerPair[1]);
  for (const [index, pair] of question.pairs.entries()) {
    if (index === question.correctIndex) continue;
    assert.equal(Math.floor(pair[0] / 10) * (pair[0] % 10), pair[1]);
  }

  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY");
  assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);

  fingerprints.add(JSON.stringify({ stem: question.stem, options: question.options, answer: question.answer }));
  stems.set(question.stem, (stems.get(question.stem) ?? 0) + 1);
  answerPositions[question.correctIndex] += 1;
  generated += 1;
}

assert.ok(fingerprints.size >= 220, `insufficient diversity: ${fingerprints.size}/240`);
assert.ok(stems.size >= 5);
assert.ok(Math.max(...stems.values()) <= Math.ceil(generated * 0.45));
assert.ok(answerPositions.slice(0, 4).every((count) => count > 0));
assert.ok(answerPositions[4] > 0);
assert.ok(maximumSourceAttempt < 2400);
assert.throws(() => generateClsCp005Wave2DigitProductQuestion(-1));

console.log("CLS-CP-005 expanded-registry digit-product discovery audit passed.", {
  generated,
  uniqueVisibleQuestions: fingerprints.size,
  completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
  stems: stems.size,
  answerPositions,
  explanations,
  maximumSourceAttempt,
  maximumAnswerMaximumRatio,
  maximumAnswerTotalRatio,
  permanentQls: 0,
});
