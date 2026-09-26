import assert from 'node:assert/strict';

import {
  RNK_BANKING_FIVE_OPTION_ADAPTER_VERSION,
  adaptRnkQuestionForBankingFiveOptions,
} from './rnk-001-banking-five-option-adapter-v1';

const objectQuestion = {
  permanentRuntimeFingerprint: 'canonical-object-question',
  permanentProfile: { permanentQlId: 'RNK-QL-001' },
  stem: 'Example',
  options: [
    { label: '11', answerKey: '11', misconceptionId: 'A', explanation: 'x' },
    { label: '12', answerKey: '12', misconceptionId: 'CORRECT', explanation: 'y' },
    { label: '13', answerKey: '13', misconceptionId: 'B', explanation: 'z' },
    { label: '14', answerKey: '14', misconceptionId: 'C', explanation: 'q' },
  ],
  correctIndex: 1,
  answer: '12',
  mathematicalFingerprint: 'math-object',
  lifecycle: { questionStudio: 'DISABLED' },
};

for (const locale of ['en-IN', 'hi-IN', 'pa-IN'] as const) {
  const delivered = adaptRnkQuestionForBankingFiveOptions(objectQuestion, locale);
  assert.equal(delivered.options.length, 5);
  assert.deepEqual(delivered.options.slice(0, 4), objectQuestion.options);
  assert.equal(delivered.correctIndex, objectQuestion.correctIndex);
  assert.equal(delivered.answer, objectQuestion.answer);
  assert.equal(delivered.mathematicalFingerprint, objectQuestion.mathematicalFingerprint);
  assert.deepEqual(delivered.lifecycle, objectQuestion.lifecycle);
  assert.equal(delivered.bankingFiveOptionDelivery.version, RNK_BANKING_FIVE_OPTION_ADAPTER_VERSION);
  assert.equal(delivered.bankingFiveOptionDelivery.sourceOptionCount, 4);
  assert.equal(delivered.bankingFiveOptionDelivery.deliveredOptionCount, 5);
  assert.equal(delivered.bankingFiveOptionDelivery.fifthOptionKind, 'NONE_OF_THESE_KNOWN_FALSE');
  assert.equal(delivered.bankingFiveOptionDelivery.deliveredCorrectIndex, 1);
  assert.equal(delivered.bankingFiveOptionDelivery.correctAnswerMoved, false);
  assert.equal(delivered.bankingFiveOptionDelivery.canonicalOptionsMutated, false);
  assert.equal(delivered.bankingFiveOptionDelivery.mathematicalAuthorityChanged, false);
  assert.equal(delivered.bankingFiveOptionDelivery.newQlAllocated, false);
  assert.equal(delivered.bankingFiveOptionDelivery.questionStudioActivationGranted, false);
  assert.equal((delivered.options[4] as Record<string, any>).answerKey, '__RNK_DELIVERY_NONE_OF_THESE__');
  assert.equal((delivered.options[4] as Record<string, any>).misconceptionId, 'DELIVERY_NONE_OF_THESE_FALSE');
}

const en = adaptRnkQuestionForBankingFiveOptions(objectQuestion, 'en-IN');
const hi = adaptRnkQuestionForBankingFiveOptions(objectQuestion, 'hi-IN');
const pa = adaptRnkQuestionForBankingFiveOptions(objectQuestion, 'pa-IN');
assert.equal(en.options[4].label, 'None of these');
assert.equal(hi.options[4].label, 'इनमें से कोई नहीं');
assert.equal(pa.options[4].label, 'ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ');

const primitiveQuestion = {
  stem: 'Primitive options',
  options: ['A', 'B', 'C', 'D'],
  answerIndex: 2,
  answer: 'C',
  mathematicalFingerprint: 'math-primitive',
};
const primitive = adaptRnkQuestionForBankingFiveOptions(primitiveQuestion, 'en-IN');
assert.deepEqual(primitive.options, ['A', 'B', 'C', 'D', 'None of these']);
assert.equal(primitive.answerIndex, 2);
assert.equal(primitive.answer, 'C');
assert.equal(primitive.mathematicalFingerprint, 'math-primitive');

assert.throws(
  () => adaptRnkQuestionForBankingFiveOptions({ ...objectQuestion, options: objectQuestion.options.slice(0, 3) }, 'en-IN'),
  /exactly four canonical options/u,
);
assert.throws(
  () => adaptRnkQuestionForBankingFiveOptions({ ...objectQuestion, correctIndex: 4 }, 'en-IN'),
  /correct index 0\.\.3/u,
);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_BANKING_FIVE_OPTION_ADAPTER_VERSION,
  locales: ['en-IN', 'hi-IN', 'pa-IN'],
  fifthOption: {
    en: en.options[4].label,
    hi: hi.options[4].label,
    pa: pa.options[4].label,
  },
  canonicalCorrectIndexPreserved: true,
  mathematicalAuthorityChanged: false,
  newQlAllocated: false,
}, null, 2));
