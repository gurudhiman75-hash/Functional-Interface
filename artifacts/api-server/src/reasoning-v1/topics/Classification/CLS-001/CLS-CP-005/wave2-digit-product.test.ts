import assert from "node:assert/strict";
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

for (let seed = 0; seed < 240; seed += 1) {
  const optionCount = seed % 3 === 0 ? 5 : 4;
  const question = generateClsCp005Wave2DigitProductQuestion(seed, optionCount);
  const replay = generateClsCp005Wave2DigitProductQuestion(seed, optionCount);
  assert.deepEqual(question, replay, `seed ${seed} is not deterministic`);
  assert.equal(question.permanentQlId, null);
  assert.equal(question.intendedRuleId, CLS_CP005_WAVE2_RULE_ID);
  assert.equal(question.metadata.runtimeVersion, CLS_CP005_WAVE2_VERSION);
  assert.equal(question.metadata.equivalentSetAdmission, "NOT_ADMITTED_PENDING_NATURALNESS_AUDIT");
  assert.equal(question.options.length, optionCount);
  assert.equal(new Set(question.options).size, optionCount);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(question.ambiguityAudit.result, "UNIQUE");
  assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
  assert.equal(question.ambiguityAudit.completeRuleCount, 19);
  assert.ok(question.ambiguityAudit.candidateSupports.length >= 1);
  assert.ok(question.ambiguityAudit.candidateSupports.every((support) => support.answerIndex === question.correctIndex));
  assert.equal(question.evidenceByOption.length, optionCount);

  for (const [index, evidence] of question.evidenceByOption.entries()) {
    const shouldMatch = index !== question.correctIndex;
    assert.ok(evidence.includes("Multiplying the two digits"));
    assert.equal(evidence.includes("✅ Matches rule."), shouldMatch);
    assert.equal(evidence.includes("❌ Fails rule."), !shouldMatch);
    assert.equal((evidence.match(/\\\(/g) ?? []).length, 1);
    assert.equal((evidence.match(/\\\)/g) ?? []).length, 1);
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
assert.throws(() => generateClsCp005Wave2DigitProductQuestion(-1));

console.log("CLS-CP-005 Wave 2 digit-product discovery audit passed.", {
  generated,
  uniqueVisibleQuestions: fingerprints.size,
  completeRuleCount: 19,
  stems: stems.size,
  answerPositions,
  explanations,
  permanentQls: 0,
});
