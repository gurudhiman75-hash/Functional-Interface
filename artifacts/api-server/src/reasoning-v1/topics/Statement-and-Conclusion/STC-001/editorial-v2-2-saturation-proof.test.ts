import assert from "node:assert/strict";
import { assertStcV22TemplateContract } from "./editorial-v2-2-saturation-helpers.ts";
import { generateStcV22Question, STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL } from "./editorial-v2-2-generator.ts";
import { STC_V22_TEMPLATES_BY_QL } from "./editorial-v2-2-templates.ts";
import {
  STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
  STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewStc001V22QuestionStudioReview,
} from "./question-studio-review-v2-2.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";
import {
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry.ts";

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly StcLocale[];
const ANSWERS = ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const;

for (const qlId of STC_QL_IDS) {
  const templates = STC_V22_TEMPLATES_BY_QL[qlId];
  assert.equal(templates.length, 8, `${qlId}: eight variableized templates required`);
  assert.equal(new Set(templates.map((template) => template.surfaceArchetype)).size, 8, `${qlId}: eight distinct surface archetypes required`);
  const canonicalCounts = Object.fromEntries(ANSWERS.map((answer) => [answer, templates.filter((template) => template.answerClass === answer).length]));
  assert.deepEqual(canonicalCounts, { ONLY_I: 2, ONLY_II: 2, BOTH: 2, NEITHER: 2 }, `${qlId}: canonical template answer balance must remain 2/2/2/2`);
  templates.forEach(assertStcV22TemplateContract);

  const generated = Array.from({ length: STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL }, (_, seed) =>
    generateStcV22Question({ qlId, locale: "en-IN", seed }),
  );
  assert.equal(new Set(generated.map((question) => `${question.templateId}|${question.variantIndex}`)).size, 2048, `${qlId}: scheduler must cover 2048 unique template/variant pairs`);
  assert.equal(new Set(generated.map((question) => question.scenarioId)).size, 2048, `${qlId}: scenario IDs must be unique across one semantic cycle`);
  assert.equal(new Set(generated.map((question) => `${question.stem}\n${question.conclusions.join("\n")}`)).size, 2048, `${qlId}: learner surfaces must be genuinely unique, not metadata-only variants`);

  const answerCounts = Object.fromEntries(ANSWERS.map((answer) => [answer, generated.filter((question) => question.answerClass === answer).length]));
  assert.deepEqual(answerCounts, { ONLY_I: 512, ONLY_II: 512, BOTH: 512, NEITHER: 512 }, `${qlId}: 2048-cycle answer distribution must be exactly balanced`);

  const answerSequence = generated.slice(0, 128).map((question) => question.answerClass);
  assert.notDeepEqual(answerSequence.slice(0, 4), answerSequence.slice(4, 8), `${qlId}: old four-seed answer cycle must not recur`);
  assert.notDeepEqual(answerSequence.slice(0, 8), answerSequence.slice(8, 16), `${qlId}: answer sequence must not repeat every eight seeds`);
  for (let residue = 0; residue < 4; residue += 1) {
    assert.ok(new Set(answerSequence.filter((_, index) => index % 4 === residue)).size >= 3, `${qlId}: seed modulo 4 must not reveal answer class`);
  }

  for (let seed = 0; seed < STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL; seed += 1) {
    const en = generated[seed]!;
    assert.doesNotMatch([en.stem, ...en.conclusions, en.explanation].join("\n"), /\{[abcd]\}/u, `${qlId}/${seed}: unresolved template placeholder`);
    assert.equal(en.metadata.saturationReady, true);
    assert.equal(en.metadata.semanticSurfaceCapacityPerQl, 2048);
    assert.equal(en.metadata.questionBankWritable, false);
    assert.equal(en.metadata.testEligible, false);
    assert.equal(en.metadata.mockEligible, false);
    assert.equal(en.metadata.publicEligible, false);
    assert.equal(en.metadata.automaticPublication, false);

    for (const locale of LOCALES.slice(1)) {
      const localized = generateStcV22Question({ qlId, locale, seed });
      assert.equal(localized.templateId, en.templateId, `${qlId}/${seed}/${locale}: template parity drift`);
      assert.equal(localized.variantIndex, en.variantIndex, `${qlId}/${seed}/${locale}: variant parity drift`);
      assert.equal(localized.answerClass, en.answerClass, `${qlId}/${seed}/${locale}: answer parity drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: correct-index parity drift`);
      assert.equal(localized.surfaceArchetype, en.surfaceArchetype, `${qlId}/${seed}/${locale}: surface parity drift`);
      assert.equal(localized.metadata.conclusionsReversed, en.metadata.conclusionsReversed, `${qlId}/${seed}/${locale}: conclusion-order parity drift`);
      assert.doesNotMatch([localized.stem, ...localized.conclusions, localized.explanation].join("\n"), /\{[abcd]\}/u, `${qlId}/${seed}/${locale}: unresolved template placeholder`);
      assert.notEqual(localized.stem, en.stem, `${qlId}/${seed}/${locale}: localized stem must not fall back to English`);
    }
  }
}

const ql005Sample = Array.from({ length: 512 }, (_, seed) => generateStcV22Question({ qlId: "STC-QL-005", locale: "en-IN", seed }));
const ql005Surface = ql005Sample.map((question) => question.stem).join("\n");
assert.doesNotMatch(ql005Surface, /older than|younger than|taller than|shorter than|ranked ahead|ranked behind/u, "QL005 must remain metric interpretation, not Ranking/Order person chains");
assert.match(ql005Surface, /rate|score|survey|weight|absolute/u, "QL005 should visibly exercise metric comparison language");

assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.currentGenerationReady, true);
assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.semanticSurfaceCapacityPerQl, 2048);
assert.ok(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.semanticSurfaceCapacityPerQl >= STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.minimumDistinctQuestionsPerQlForGenerationReady);
assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

const direct = previewStc001V22QuestionStudioReview({ qlId: "STC-QL-004", locale: "pa-IN", seed: 777 });
const shared = previewReasoningV1QuestionStudioReview({ packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID, qlId: "STC-QL-004", locale: "pa-IN", seed: 777 });
assert.equal(shared.question.scenarioId, direct.question.scenarioId);
assert.equal(shared.question.answerClass, direct.question.answerClass);
assert.equal(shared.generationReady, true);

const stcPackages = listReasoningV1QuestionStudioReviewPackages().filter((entry) => entry.chapterId === "STC-001");
assert.equal(stcPackages[0]!.packageId, STC_001_V22_QUESTION_STUDIO_PACKAGE_ID, "V2.2 must be the active STC review package");
assert.ok(stcPackages.some((entry) => entry.packageId === "STC-001-V2-EDITORIAL-REVIEW"), "V2.1 audit snapshot must remain available");
assert.ok(stcPackages.some((entry) => entry.packageId === "STC-001-V1-FROZEN-REVIEW"), "V1 audit snapshot must remain available");
assert.throws(
  () => persistReasoningV1QuestionStudioReview({ packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID, qlId: "STC-QL-001", locale: "en-IN", seed: 0 }),
  /generation-ready inside Question Studio review.*delivery remains locked/i,
);

console.log("PASS_STC_001_V2_2_SATURATION questions_per_ql=2048 locales=3 qls=6");
