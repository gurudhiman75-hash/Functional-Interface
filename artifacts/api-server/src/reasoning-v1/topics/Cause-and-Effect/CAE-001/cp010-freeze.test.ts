import assert from "node:assert/strict";
import { CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW } from "./reviewed-editorial-review-pack.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

for (const qlId of CAE_PROVISIONAL_QL_IDS) {
  const causalStates = new Set<string>();
  const itemVariants = new Set<string>();
  const difficulties = new Set<string>();
  const projections = new Set<string>();
  const families = new Set<string>();

  for (let seed = 0; seed < 240; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    causalStates.add(question.causalStateId);
    itemVariants.add(question.itemVariantId);
    difficulties.add(question.difficulty);
    projections.add(question.projectionId);
    families.add(question.scenarioFamilyId);

    assert.equal(question.chapterId, "CAE-001");
    assert.equal(question.qlId, qlId);
    assert.ok(question.stem.trim().length > 0, `${qlId}/${seed}: empty stem`);
    assert.ok(question.explanation.trim().length > 0, `${qlId}/${seed}: empty explanation`);
    assert.ok(question.options.length >= 4, `${qlId}/${seed}: too few options`);
    assert.equal(new Set(question.options).size, question.options.length, `${qlId}/${seed}: duplicate option text`);
    assert.equal(question.optionMetadata.length, question.options.length, `${qlId}/${seed}: option metadata mismatch`);
    assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1, `${qlId}/${seed}: exactly one correct option required`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `${qlId}/${seed}: invalid correct index`);
    assert.equal(question.optionMetadata[question.correctIndex]!.isCorrect, true, `${qlId}/${seed}: correctIndex must point to semantic answer`);
    assert.equal(question.optionMetadata[question.correctIndex]!.id, question.answerId, `${qlId}/${seed}: answerId mismatch`);
    assert.ok(question.itemVariantId.includes(question.causalStateId), `${qlId}/${seed}: item identity must retain causal-state identity`);
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.mockEligible, false);
    assert.equal(question.metadata.publicEligible, false);
  }

  assert.ok(causalStates.size >= 10, `${qlId}: fewer than ten reviewed causal states (${causalStates.size})`);
  assert.ok(itemVariants.size >= causalStates.size, `${qlId}: item-variant diversity regressed`);
  assert.ok(projections.size >= 1);
  assert.ok(families.size >= 1);

  const pack = CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW[qlId];
  assert.equal(pack.length, 10, `${qlId}: editorial pack must contain ten items`);
  assert.equal(new Set(pack.map((entry) => entry.question.causalStateId)).size, 10, `${qlId}: editorial pack must contain ten distinct causal states`);
  assert.ok(new Set(pack.map((entry) => entry.question.scenarioFamilyId)).size >= 1);
}

// Reviewed source/editorial additions must be visible in their owned QLs.
const ql3 = Array.from({ length: 120 }, (_, seed) => generateReviewedCaeQuestion({ qlId: "CAE-QL-003", locale: "en-IN", seed }));
const ql4 = Array.from({ length: 120 }, (_, seed) => generateReviewedCaeQuestion({ qlId: "CAE-QL-004", locale: "en-IN", seed }));
const ql6 = Array.from({ length: 120 }, (_, seed) => generateReviewedCaeQuestion({ qlId: "CAE-QL-006", locale: "en-IN", seed }));
const ql7 = Array.from({ length: 120 }, (_, seed) => generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed }));
const ql8 = Array.from({ length: 120 }, (_, seed) => generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "en-IN", seed }));
const ql9 = Array.from({ length: 120 }, (_, seed) => generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed }));

assert.ok(ql3.some((q) => q.projectionId === "CAE-PLAN-PROBABLE-CAUSE-COMBINATION"));
assert.ok(ql3.some((q) => q.projectionId !== "CAE-PLAN-PROBABLE-CAUSE-COMBINATION"));
assert.ok(ql4.some((q) => q.projectionId === "CAE-PLAN-PROBABLE-EFFECT-COMBINATION"));
assert.ok(ql4.some((q) => q.causalStructure.startsWith("EFFECT_THREE:")));
assert.ok(ql4.some((q) => q.projectionId !== "CAE-PLAN-PROBABLE-EFFECT-COMBINATION"));
assert.ok(ql6.some((q) => q.projectionId === "CAE-PLAN-CAUSAL-DISTANCE" && q.causalStructure.startsWith("IMMEDIATE:")));
assert.ok(ql6.some((q) => q.projectionId === "CAE-PLAN-CAUSAL-DISTANCE" && q.causalStructure.startsWith("REMOTE:")));
assert.ok(ql6.some((q) => q.projectionId !== "CAE-PLAN-CAUSAL-DISTANCE"));
assert.ok(ql7.some((q) => q.answerId === "CORRELATION_ONLY"));
assert.ok(ql7.some((q) => q.answerId === "COMMON_CAUSE"));
assert.ok(new Set(ql8.map((q) => q.causalStructure.split(":")[1])).size >= 6, "CP008 learner-operation breadth regressed");
assert.ok(new Set(ql9.map((q) => q.causalStructure.split(":")[1])).size >= 6, "CP009 integrated-operation breadth regressed");

// Semantic parity: locale can change text only, not state, answer, order or difficulty.
for (const qlId of CAE_PROVISIONAL_QL_IDS) {
  for (let seed = 0; seed < 48; seed += 1) {
    const en = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    for (const locale of LOCALES) {
      const localized = generateReviewedCaeQuestion({ qlId, locale, seed });
      assert.equal(localized.causalStateId, en.causalStateId, `${qlId}/${seed}/${locale}: causal-state drift`);
      assert.equal(localized.answerId, en.answerId, `${qlId}/${seed}/${locale}: answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: option-order drift`);
      assert.equal(localized.difficulty, en.difficulty, `${qlId}/${seed}/${locale}: difficulty drift`);
      assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${qlId}/${seed}/${locale}: semantic-option drift`);
    }
  }
}
