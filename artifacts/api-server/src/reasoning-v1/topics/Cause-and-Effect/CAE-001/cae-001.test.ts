import assert from "node:assert/strict";
import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
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
const minimumSemanticInstances: Readonly<Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], number>> = {
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
/** Single-state plans here are intentionally stable: competing explanations are hard and correlation checks are medium. */
const minimumPedagogicallyAppropriateDifficultyStates: Readonly<Record<(typeof CAE_PROVISIONAL_QL_IDS)[number], number>> = {
  "CAE-QL-001": 2,
  "CAE-QL-002": 2,
  "CAE-QL-003": 2,
  "CAE-QL-004": 2,
  "CAE-QL-005": 1,
  "CAE-QL-006": 2,
  "CAE-QL-007": 1,
  "CAE-QL-008": 2,
  "CAE-QL-009": 2,
};

assert.deepEqual(validateCaeEngineAuthorities(), []);
assert.equal(CAE_001_SCENARIO_FAMILIES.length, 9);
assert.equal(CAE_001_CAUSAL_WORLDS.length, 27);
assert.equal(CAE_001_PROJECTION_AUTHORITIES.length, 9);
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
const candidateSetsByTarget = new Map<string, Set<string>>();
const candidateOccurrencesByTarget = new Map<string, number>();
const optionOrdersBySemanticInstance = new Map<string, Set<string>>();
let targetRelativeCandidateChecks = 0;

for (const qlId of CAE_PROVISIONAL_QL_IDS) {
  const answerPositions = new Set<number>();
  const semanticInstances = new Set<string>();
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
    semanticInstances.add(en.semanticInstanceId);
    structures.add(en.causalStructure);
    families.add(en.scenarioFamilyId);
    variants.add(`${en.scenarioFamilyId}/${en.scenarioVariantId}`);
    difficulties.add(en.difficulty);
    en.distractorMechanisms.forEach((mechanism) => mechanisms.add(mechanism));
    optionOrdersBySemanticInstance.set(en.semanticInstanceId, (optionOrdersBySemanticInstance.get(en.semanticInstanceId) ?? new Set<string>()).add(en.optionMetadata.map((option) => option.id).join("|")));
    if (en.candidateComparisons.length > 0) {
      const candidateTarget = en.candidateComparisons[0]!.candidateId.split(":candidate:")[0]!;
      const candidateKey = `${qlId}/${en.scenarioFamilyId}/${en.scenarioVariantId}/${candidateTarget}`;
      const candidateSet = en.candidateComparisons.map((candidate) => candidate.candidateId).sort().join("|");
      candidateSetsByTarget.set(candidateKey, (candidateSetsByTarget.get(candidateKey) ?? new Set<string>()).add(candidateSet));
      candidateOccurrencesByTarget.set(candidateKey, (candidateOccurrencesByTarget.get(candidateKey) ?? 0) + 1);
      targetRelativeCandidateChecks += en.candidateComparisons.length;
    }

    for (const locale of LOCALES) {
      const localized = generateCaeQuestion({ qlId, locale, seed });
      assert.equal(localized.semanticInstanceId, en.semanticInstanceId, `${qlId}/${seed}/${locale}: semantic state drift`);
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
  assert.ok(semanticInstances.size >= minimumSemanticInstances[qlId], `${qlId}: semantic saturation is too low (${semanticInstances.size})`);
  assert.ok(structures.size >= 2, `${qlId}: only one causal structure was generated`);
  assert.ok(families.size >= 2, `${qlId}: only one scenario family was generated`);
  assert.ok(variants.size >= 6, `${qlId}: only a small fixed set of variants was generated`);
  assert.ok(mechanisms.size >= 2, `${qlId}: distractors do not vary by error mechanism`);
  assert.ok(difficulties.size >= minimumPedagogicallyAppropriateDifficultyStates[qlId], `${qlId}: generated state does not provide its pedagogically appropriate difficulty distribution`);
  report[qlId] = { semanticInstances: semanticInstances.size, structures: structures.size, families: families.size, variants: variants.size, difficultyStates: difficulties.size, distractorMechanisms: mechanisms.size };
  families.forEach((value) => allFamilies.add(value));
  structures.forEach((value) => allStructures.add(value));
  difficulties.forEach((value) => allDifficulties.add(value));
  mechanisms.forEach((value) => allMechanisms.add(value));
}

assert.deepEqual([...allDifficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(allFamilies.size >= 8, "saturation must cover nearly all scenario families");
assert.ok(allStructures.size >= 12, "saturation must cover multiple causal structures, not option permutations");
assert.ok(allMechanisms.size >= 7, "saturation must cover multiple distractor mechanisms");
assert.ok(targetRelativeCandidateChecks > 1_000, "saturation must exercise target-relative distractor validation at scale");
const repeatedCandidateTargets = [...candidateOccurrencesByTarget.entries()].filter(([, occurrences]) => occurrences >= 3);
assert.ok(repeatedCandidateTargets.length >= 20, "saturation must revisit scenario-local candidate targets");
for (const [candidateKey] of repeatedCandidateTargets) assert.ok((candidateSetsByTarget.get(candidateKey)?.size ?? 0) >= 2, `${candidateKey}: seeded generation must vary the valid misconception mix for the same family, variant, and target`);
const permutedSemanticInstances = [...optionOrdersBySemanticInstance.values()].filter((orders) => orders.size >= 2).length;
assert.ok(permutedSemanticInstances >= 12, "semantic diversity must be counted independently from option permutation");

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

console.log("CAE_001_SATURATION", JSON.stringify({ seedsPerPlan: SEED_COUNT, before: { authoredWorlds: 7, fixedProjections: 12, semanticInstanceVariation: "not measured; projection selection plus option shuffling" }, after: { scenarioFamilies: allFamilies.size, causalStructures: allStructures.size, difficultyStates: [...allDifficulties].sort(), distractorMechanisms: [...allMechanisms].sort(), targetRelativeCandidateChecks, repeatedCandidateTargets: repeatedCandidateTargets.length, candidateTargetsWithMultipleValidMixes: repeatedCandidateTargets.filter(([key]) => (candidateSetsByTarget.get(key)?.size ?? 0) >= 2).length, semanticInstancesWithOptionPermutation: permutedSemanticInstances, byQl: report } }, null, 2));
console.log("PASS_CAE_001_GENERATIVE_CAUSAL_STATE_V3");
