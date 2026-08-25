import {
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS,
  previewTsdCp010StudioCandidate,
} from "./question-studio-candidate-adapter-final";
import { TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 Studio candidate proof failed: ${message}`);
}

const capacity = TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE;
assert(capacity >= 400, `expected at least 400 compatible combinations per locale, got ${capacity}`);
assert(TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS === capacity * 3, "multilingual capacity arithmetic mismatch");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.sourceStatus === "MULTILINGUAL_REVIEW_CANDIDATE", "candidate source status changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "candidate must not be registered");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioStagingStatus === "DISABLED_PENDING_PRODUCT_OWNER_APPROVAL", "candidate staging must remain disabled");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "candidate route must remain unmounted");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.productionSelectorVisible === false, "candidate must not appear in production selector");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "candidate persistence must remain disabled");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "Question Bank write lock lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "test lock lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "public lock lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.numericRebindingPolicy === "OCCURRENCE_AWARE_EQUAL_SOURCE_VALUE_SAFE", "occurrence-safe rebinding policy lost");

const perQlCapacity: Record<string, number> = {};
let total = 0;
let globalMinFamilyCapacity = Number.POSITIVE_INFINITY;
let globalMaxFamilyCapacity = 0;

for (const language of ["en", "hi", "pa"] as const) {
  const all = previewTsdCp010StudioCandidate({ language, count: capacity, seed: `proof-${language}` });
  assert(all.availableCombinationsUnderFilters === capacity, `${language}: expected ${capacity} compatible combinations`);
  assert(all.questions.length === capacity, `${language}: expected ${capacity} returned combinations`);
  assert(new Set(all.questions.map((q) => `${q.familyId}:${q.caseId}`)).size === capacity, `${language}: duplicate family-case key`);
  assert(new Set(all.questions.map((q) => q.stem)).size === capacity, `${language}: learner stems are not all unique`);
  assert(new Set(all.questions.map((q) => q.questionId)).size === capacity, `${language}: question IDs are not unique`);

  const familyCounts = new Map<string, number>();
  for (const question of all.questions) {
    familyCounts.set(question.familyId, (familyCounts.get(question.familyId) ?? 0) + 1);
    assert(question.options.length === 4, `${language}/${question.familyId}/${question.caseId}: option count is not four`);
    assert(new Set(question.options).size === 4, `${language}/${question.familyId}/${question.caseId}: options are not unique`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${language}/${question.familyId}/${question.caseId}: invalid correct index`);
    assert(question.options[question.correctIndex] === question.answer, `${language}/${question.familyId}/${question.caseId}: correct option does not match answer`);
    assert(question.validation.independentVerifierAccepted, `${language}/${question.familyId}/${question.caseId}: verifier flag lost`);
    assert(question.validation.semanticShapeCompatible, `${language}/${question.familyId}/${question.caseId}: semantic compatibility flag lost`);
    assert(question.validation.occurrenceAwareRebinding, `${language}/${question.familyId}/${question.caseId}: occurrence-aware rebinding flag lost`);
    assert(question.persistenceAllowed === false, `${language}/${question.familyId}: persistence unexpectedly enabled`);
    assert(question.questionBankStatus === "NOT_STORED", `${language}/${question.familyId}: bank status changed`);
    assert(question.testEligibility === "INELIGIBLE", `${language}/${question.familyId}: test status changed`);
    assert(question.publiclyPublishable === false, `${language}/${question.familyId}: public status changed`);
  }

  assert(familyCounts.size === 60, `${language}: expected all 60 human-authored families to be represented`);
  const counts = [...familyCounts.values()];
  const minFamilyCapacity = Math.min(...counts);
  const maxFamilyCapacity = Math.max(...counts);
  assert(minFamilyCapacity >= 1, `${language}: a represented family has no compatible case`);
  assert(maxFamilyCapacity <= 12, `${language}: family capacity exceeds executable case pool`);
  globalMinFamilyCapacity = Math.min(globalMinFamilyCapacity, minFamilyCapacity);
  globalMaxFamilyCapacity = Math.max(globalMaxFamilyCapacity, maxFamilyCapacity);

  for (const qlId of TSD_CP010_PERMANENT_QL_IDS) {
    const filtered = previewTsdCp010StudioCandidate({ language, qlId, count: 1, seed: `${language}-${qlId}` });
    assert(filtered.availableCombinationsUnderFilters > 0, `${language}/${qlId}: QL has zero compatible combinations`);
    assert(filtered.questions.every((q) => q.qlId === qlId), `${language}/${qlId}: QL filter leaked`);
    if (language === "en") perQlCapacity[qlId] = filtered.availableCombinationsUnderFilters;
    else assert(filtered.availableCombinationsUnderFilters === perQlCapacity[qlId], `${language}/${qlId}: multilingual QL capacity mismatch`);
  }
  total += all.questions.length;
}
assert(total === capacity * 3, `expected ${capacity * 3} multilingual candidate combinations, got ${total}`);

console.log("TSD-CP-010 LOCKED QUESTION STUDIO CANDIDATE PROOF: PASS");
console.log(JSON.stringify({
  combinationsPerLocale: capacity,
  multilingualCombinations: total,
  humanFamiliesPerLocale: 60,
  minimumCompatibleCasesPerFamily: globalMinFamilyCapacity,
  maximumCompatibleCasesPerFamily: globalMaxFamilyCapacity,
  qlCapacity: perQlCapacity,
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS",
  variationPolicy: "HUMAN_FAMILY_X_SEMANTICALLY_COMPATIBLE_EXECUTABLE_CASE",
  numericRebindingPolicy: "OCCURRENCE_AWARE_EQUAL_SOURCE_VALUE_SAFE",
  registration: "NOT_REGISTERED",
  routeMounted: false,
  persistenceAllowed: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
