import assert from "node:assert/strict";
import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { CAE_001_EDITORIAL_REALNESS_REVIEW, renderCae001EditorialRealnessReview } from "./editorial-review-pack.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES } from "./causal-world-authorities.ts";
import {
  assertCae001QuestionStudioPersistenceAllowed,
  CAE_001_QUESTION_STUDIO_PACKAGE_ID,
  CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewCae001QuestionStudioReview,
} from "./question-studio-review.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeLocale } from "./types.ts";
import { validateCaeEngineAuthorities, validateGeneratedCaeQuestion, validateGeneratedCaeStructure } from "./validator.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const SEED_COUNT = 240;
const TARGET_APPLICABILITY_QL_IDS = new Set(["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-009"]);
const minimumCausalStates: Readonly<Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], number>> = {
  "CAE-QL-001": 18,
  "CAE-QL-002": 12,
  "CAE-QL-003": 24,
  "CAE-QL-004": 18,
  "CAE-QL-005": 12,
  "CAE-QL-006": 12,
  "CAE-QL-007": 18,
  "CAE-QL-008": 12,
  "CAE-QL-009": 18,
};
/** Bands are only required where the causal state makes them pedagogically meaningful. */
const minimumPedagogicallyAppropriateDifficultyStates: Readonly<Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], number>> = {
  "CAE-QL-001": 1,
  "CAE-QL-002": 1,
  "CAE-QL-003": 2,
  "CAE-QL-004": 2,
  "CAE-QL-005": 1,
  "CAE-QL-006": 1,
  "CAE-QL-007": 1,
  "CAE-QL-008": 1,
  "CAE-QL-009": 2,
};

assert.deepEqual(validateCaeEngineAuthorities(), []);
assert.equal(CAE_001_SCENARIO_FAMILIES.length, 9);
assert.equal(CAE_001_CAUSAL_WORLDS.length, 27);
assert.equal(CAE_001_PROJECTION_AUTHORITIES.length, 9);
const fogVariant = CAE_001_SCENARIO_FAMILIES.find((family) => family.id === "CAE-FAM-OPERATIONS-CHAIN")!.variants.find((variant) => variant.id === "fog")!;
const fogBaggageVehicle = fogVariant.semanticCandidateEvents.find((candidate) => candidate.id === "fog-baggage-vehicle")!;
assert.equal(
  fogBaggageVehicle.applicability.find((rule) => rule.applicableProjectionKinds.includes("PROBABLE_CAUSE") && rule.eligibleTargetSemanticSlots.includes("bridge") && rule.eligibleReferenceSemanticSlots.includes("cause") && rule.eligibleRelations.includes("CAUSE_OF_TARGET"))?.editorialPlausibility,
  "CLEAR_REJECT",
  "the baggage-loading vehicle cannot be classified as a credible cause of falling runway visibility",
);
for (const qlId of CAE_PROVISIONAL_QL_IDS) {
  const samples = CAE_001_EDITORIAL_REALNESS_REVIEW[qlId];
  assert.equal(samples.length, 10, `${qlId}: editorial realness pack must contain ten samples.`);
  assert.ok(new Set(samples.map((sample) => sample.question.scenarioFamilyId)).size >= 2, `${qlId}: editorial review pack must expose multiple families.`);
  const allAvailableDifficulties = new Set<number>();
  for (let seed = 0; seed < SEED_COUNT; seed += 1) allAvailableDifficulties.add(["EASY", "MEDIUM", "HARD"].indexOf(generateCaeQuestion({ qlId, locale: "en-IN", seed }).difficulty));
  assert.deepEqual(new Set(samples.map((sample) => ["EASY", "MEDIUM", "HARD"].indexOf(sample.question.difficulty))), allAvailableDifficulties, `${qlId}: editorial pack must show every available difficulty.`);
}
assert.ok(renderCae001EditorialRealnessReview().includes("CAE-CP-009"), "editorial realness pack must render all current checkpoints.");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlAllocationStatus, "PROVISIONAL_PENDING_SOURCE_SATURATION");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.provisionalQlCount, 9);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.scenarioFamilyCount, 9);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.canonicalScenarioVariantCount, 27);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

const allFamilies = new Set<string>();
const allStructures = new Set<string>();
const allDifficulties = new Set<string>();
const allMechanisms = new Set<string>();
const report: Record<string, Readonly<Record<string, number>>> = {};
const candidateSetsByCausalState = new Map<string, Set<string>>();
const candidateOccurrencesByCausalState = new Map<string, number>();
const itemVariantsByCausalState = new Map<string, Set<string>>();
const generatedCausalStatesByQl = new Map<string, Set<string>>();
const generatedFamiliesByQl = new Map<string, Set<string>>();
const targetApplicabilityStates = new Map<string, Set<string>>();
let targetApplicabilityChecks = 0;
let targetRelativeCandidateChecks = 0;

for (const qlId of CAE_PROVISIONAL_QL_IDS) {
  const answerPositions = new Set<number>();
  const causalStates = new Set<string>();
  const itemVariants = new Set<string>();
  const structures = new Set<string>();
  const families = new Set<string>();
  const variants = new Set<string>();
  const difficulties = new Set<string>();
  const mechanisms = new Set<string>();
  for (let seed = 0; seed < SEED_COUNT; seed += 1) {
    const en = generateCaeQuestion({ qlId, locale: "en-IN", seed });
    assert.deepEqual(generateCaeQuestion({ qlId, locale: "en-IN", seed }), en, `${qlId}/${seed}: generation must replay exactly`);
    assert.equal(en.options.length, 4, `${qlId}/${seed}: default review profile must have four options`);
    assert.equal(new Set(en.options).size, en.options.length, `${qlId}/${seed}: options must be unique`);
    assert.equal(en.optionMetadata.filter((option) => option.isCorrect).length, 1, `${qlId}/${seed}: exactly one answer is required`);
    assert.equal(en.options[en.correctIndex], en.optionMetadata[en.correctIndex]!.text);
    assert.deepEqual(validateGeneratedCaeQuestion(en), [], `${qlId}/${seed}: rendered item must preserve target-relative distractor validity`);
    assert.deepEqual(validateGeneratedCaeStructure(CAE_001_CAUSAL_WORLDS.find((world) => world.id === en.causalWorldId)!, en.visibleContext.visibleNodeIds), [], `${qlId}/${seed}: visible structure must be unambiguous`);
    assert.equal(en.visibleContext.backdrop, null, `${qlId}/${seed}: neutral backdrop must remain optional rather than automatically rendered`);
    assert.equal(/\bSetting:|\bपरिवेश:|\bਪ੍ਰਸੰਗ:/u.test(en.stem), false, `${qlId}/${seed}: normal exam form must not add a setting line`);
    answerPositions.add(en.correctIndex);
    causalStates.add(en.causalStateId);
    itemVariants.add(en.itemVariantId);
    structures.add(en.causalStructure);
    families.add(en.scenarioFamilyId);
    variants.add(`${en.scenarioFamilyId}/${en.scenarioVariantId}`);
    difficulties.add(en.difficulty);
    en.distractorMechanisms.forEach((mechanism) => mechanisms.add(mechanism));
    itemVariantsByCausalState.set(en.causalStateId, (itemVariantsByCausalState.get(en.causalStateId) ?? new Set<string>()).add(en.itemVariantId));
    if (en.candidateComparisons.length > 0) {
      const candidateSet = en.candidateComparisons.map((candidate) => candidate.candidateId).sort().join("|");
      candidateSetsByCausalState.set(en.causalStateId, (candidateSetsByCausalState.get(en.causalStateId) ?? new Set<string>()).add(candidateSet));
      candidateOccurrencesByCausalState.set(en.causalStateId, (candidateOccurrencesByCausalState.get(en.causalStateId) ?? 0) + 1);
      assert.ok(en.candidateComparisons.every((candidate) => candidate.source === "CANONICAL_WORLD" || candidate.source === "VARIANT_AUTHORED"), `${qlId}/${seed}: candidates must come from the causal world or a scenario-authored semantic authority`);
      if (en.checkpointId === "CAE-CP-005") assert.ok(en.candidateComparisons.filter((candidate) => candidate.editorialPlausibility === "CREDIBLE_ALTERNATIVE").length >= 2, `${qlId}/${seed}: CP-005 needs two credible alternatives`);
      if (TARGET_APPLICABILITY_QL_IDS.has(qlId)) {
        targetApplicabilityStates.set(qlId, (targetApplicabilityStates.get(qlId) ?? new Set<string>()).add(en.causalStateId));
        for (const candidate of en.candidateComparisons) {
          const authority = candidate.applicability;
          assert.ok(authority.applicableProjectionKinds.includes(candidate.projectionKind), `${qlId}/${seed}/${candidate.candidateId}: candidate is not authorised for this projection`);
          assert.ok(authority.eligibleTargetSemanticSlots.includes(candidate.targetSemanticSlot), `${qlId}/${seed}/${candidate.candidateId}: candidate is not authorised for this target slot`);
          assert.ok(authority.eligibleReferenceSemanticSlots.includes(candidate.referenceSemanticSlot), `${qlId}/${seed}/${candidate.candidateId}: candidate is not authorised for this reference slot`);
          assert.ok(authority.eligibleRelations.includes(candidate.expectedRelation), `${qlId}/${seed}/${candidate.candidateId}: candidate is not authorised for this causal relation`);
          assert.equal(authority.editorialPlausibility, candidate.editorialPlausibility, `${qlId}/${seed}/${candidate.candidateId}: credibility must belong to the exact target/reference applicability rule`);
          assert.ok(!authority.eligibleTargetSemanticSlots.some((slot) => slot === "*" || slot === "ANY"), `${qlId}/${seed}/${candidate.candidateId}: generic target membership is not an authority`);
          assert.ok(!authority.eligibleReferenceSemanticSlots.some((slot) => slot === "*" || slot === "ANY"), `${qlId}/${seed}/${candidate.candidateId}: generic reference membership is not an authority`);
          targetApplicabilityChecks += 1;
        }
        if (en.difficulty !== "EASY") assert.ok(en.candidateComparisons.filter((candidate) => candidate.editorialPlausibility === "CREDIBLE_ALTERNATIVE").length >= 2, `${qlId}/${seed}: medium/hard target-specific items need two initially credible alternatives`);
      }
      targetRelativeCandidateChecks += en.candidateComparisons.length;
    }

    for (const locale of LOCALES) {
      const localized = generateCaeQuestion({ qlId, locale, seed });
      assert.equal(localized.causalStateId, en.causalStateId, `${qlId}/${seed}/${locale}: causal state drift`);
      assert.equal(localized.itemVariantId, en.itemVariantId, `${qlId}/${seed}/${locale}: item presentation drift`);
      assert.equal(localized.answerId, en.answerId, `${qlId}/${seed}/${locale}: answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: option order drift`);
      assert.equal(localized.difficulty, en.difficulty, `${qlId}/${seed}/${locale}: difficulty drift`);
      assert.deepEqual(localized.causalTrace, en.causalTrace, `${qlId}/${seed}/${locale}: causal trace drift`);
      assert.deepEqual(localized.visibleContext.visibleNodeIds, en.visibleContext.visibleNodeIds, `${qlId}/${seed}/${locale}: learner-visible state drift`);
      for (const hiddenId of localized.visibleContext.hiddenNodeIds) {
        const hidden = CAE_001_CAUSAL_WORLDS.find((world) => world.id === localized.causalWorldId)!.nodes.find((node) => node.id === hiddenId)!;
        assert.ok(!localized.stem.includes(hidden.text[locale]), `${qlId}/${seed}/${locale}: hidden canonical event leaked into stem`);
      }
      if (locale !== "en-IN") assert.equal(/[A-Za-z]{3,}/.test(localized.explanation), false, `${qlId}/${seed}/${locale}: English explanation fragment leaked`);
      if (locale !== "en-IN") assert.equal(/[A-Za-z]{3,}/.test(`${localized.stem}\n${localized.options.join("\n")}`), false, `${qlId}/${seed}/${locale}: English renderer fragment leaked`);
    }
  }
  assert.equal(answerPositions.size, 4, `${qlId}: answer position must vary across all four positions`);
  assert.ok(causalStates.size >= minimumCausalStates[qlId], `${qlId}: causal-state saturation is too low (${causalStates.size})`);
  assert.ok(itemVariants.size >= causalStates.size, `${qlId}: item variants must not collapse causal states.`);
  assert.ok(structures.size >= 2, `${qlId}: only one causal structure was generated`);
  assert.ok(families.size >= 2, `${qlId}: only one scenario family was generated`);
  assert.ok(variants.size >= 6, `${qlId}: only a small fixed set of variants was generated`);
  assert.ok(mechanisms.size >= 2, `${qlId}: distractors do not vary by error mechanism`);
  assert.ok(difficulties.size >= minimumPedagogicallyAppropriateDifficultyStates[qlId], `${qlId}: generated state does not provide its pedagogically appropriate difficulty distribution`);
  generatedCausalStatesByQl.set(qlId, causalStates);
  generatedFamiliesByQl.set(qlId, families);
  report[qlId] = { causalStates: causalStates.size, itemVariants: itemVariants.size, structures: structures.size, families: families.size, variants: variants.size, difficultyStates: difficulties.size, distractorMechanisms: mechanisms.size };
  families.forEach((value) => allFamilies.add(value));
  structures.forEach((value) => allStructures.add(value));
  difficulties.forEach((value) => allDifficulties.add(value));
  mechanisms.forEach((value) => allMechanisms.add(value));
}

for (const qlId of TARGET_APPLICABILITY_QL_IDS) {
  assert.deepEqual(targetApplicabilityStates.get(qlId), generatedCausalStatesByQl.get(qlId), `${qlId}: target-applicability QA must exercise every saturated candidate-producing causal state`);
}
assert.ok(targetApplicabilityChecks > 1_000, "target-applicability QA must validate target/reference/relation authority at scale");
assert.ok((report["CAE-QL-004"]?.families ?? 0) >= 4, "probable-effect saturation must retain branching/common-cause family coverage");
assert.ok(generatedFamiliesByQl.get("CAE-QL-004")?.has("CAE-FAM-SHARED-PRESSURE"), "probable-effect saturation must retain the branching common-cause family");

assert.deepEqual([...allDifficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(allFamilies.size >= 8, "saturation must cover nearly all scenario families");
assert.ok(allStructures.size >= 12, "saturation must cover multiple causal structures, not option permutations");
assert.ok(allMechanisms.size >= 7, "saturation must cover multiple distractor mechanisms");
assert.ok(targetRelativeCandidateChecks > 1_000, "saturation must exercise target-relative distractor validation at scale");
const repeatedCandidateStates = [...candidateOccurrencesByCausalState.entries()].filter(([, occurrences]) => occurrences >= 3);
assert.ok(repeatedCandidateStates.length >= 20, "saturation must revisit scenario-local candidate states");
const causalStatesWithMultipleValidMixes = repeatedCandidateStates.filter(([causalState]) => (candidateSetsByCausalState.get(causalState)?.size ?? 0) >= 2).length;
assert.ok(causalStatesWithMultipleValidMixes >= 20, "seeded generation must vary valid misconception mixes for repeated causal states where the pool permits it");
const causalStatesWithMultipleItemVariants = [...itemVariantsByCausalState.values()].filter((variants) => variants.size >= 2).length;
assert.ok(causalStatesWithMultipleItemVariants >= 40, "item variation must be reported separately from causal-state diversity");

const fiveWay = generateCaeQuestion({ qlId: "CAE-QL-002", locale: "en-IN", seed: 41, questionProfile: "FIVE_WAY" });
assert.equal(fiveWay.options.length, 5);
assert.equal(fiveWay.questionProfile, "FIVE_WAY");
assert.equal(fiveWay.optionMetadata.filter((option) => option.isCorrect).length, 1);

const preview = previewCae001QuestionStudioReview({ qlId: "CAE-QL-009", locale: "pa-IN", seed: 73 });
assert.equal(preview.packageId, CAE_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(preview.lifecycleStatus, "REVIEW_ONLY");
assert.equal(preview.question.metadata.reviewOnly, true);
assert.ok(listReasoningV1QuestionStudioReviewPackages().some((entry) => entry.packageId === CAE_001_QUESTION_STUDIO_PACKAGE_ID));
assert.ok(listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === CAE_001_QUESTION_STUDIO_PACKAGE_ID));
const sharedPreview = previewReasoningV1QuestionStudioReview({ packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID, qlId: "CAE-QL-008", locale: "hi-IN", seed: 41 });
assert.ok("question" in sharedPreview, "CAE-001 shared preview must expose one generated question");
if (!("question" in sharedPreview)) throw new Error("CAE-001 shared preview shape mismatch.");
assert.equal(sharedPreview.question.metadata.reviewOnly, true);
assert.throws(() => assertCae001QuestionStudioPersistenceAllowed(), /review only.*delivery remain locked/i);
assert.throws(() => persistReasoningV1QuestionStudioReview({ packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID, qlId: "CAE-QL-001", locale: "en-IN", seed: 11 }), /review only.*delivery remain locked/i);

console.log("CAE_001_SATURATION", JSON.stringify({ seedsPerPlan: SEED_COUNT, before: { authoredWorlds: 7, fixedProjections: 12, causalStateVariation: "not measured; fixed projections plus option shuffling" }, after: { scenarioFamilies: allFamilies.size, causalStructures: allStructures.size, difficultyStates: [...allDifficulties].sort(), distractorMechanisms: [...allMechanisms].sort(), targetRelativeCandidateChecks, targetApplicabilityChecks, targetApplicabilityCausalStates: Object.fromEntries([...targetApplicabilityStates].map(([qlId, states]) => [qlId, states.size])), repeatedCandidateStates: repeatedCandidateStates.length, causalStatesWithMultipleValidMixes, causalStatesWithMultipleItemVariants, byQl: report } }, null, 2));
console.log("PASS_CAE_001_GENERATIVE_CAUSAL_STATE_V3");
