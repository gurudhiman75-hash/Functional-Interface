import {
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS,
  previewTsdCp010StudioCandidate,
} from "./question-studio-candidate-adapter-exam-real";
import { TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 Studio candidate proof failed: ${message}`);
}

const EXPECTED_QL_CAPACITY = Object.freeze({
  "TSD-QL-115": 52,
  "TSD-QL-116": 72,
  "TSD-QL-117": 36,
  "TSD-QL-118": 36,
  "TSD-QL-119": 36,
  "TSD-QL-120": 36,
  "TSD-QL-121": 71,
  "TSD-QL-122": 72,
  "TSD-QL-123": 24,
  "TSD-QL-124": 36,
} as const);

const capacity = TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE;
assert(capacity === 471, `expected locked capacity 471 per locale, got ${capacity}`);
assert(TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS === 1413, "expected locked multilingual capacity 1413");
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
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.duplicateStemPolicy === "DROP_DUPLICATE_RENDERED_STEM", "duplicate-stem policy lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.stemAuthoringPolicy === "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE", "official-paper stem policy lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.stemNarrativePolicy === "RESULT_CAPABILITY_HANDICAP_FIRST_LOW_NARRATIVE", "V3 narrative policy lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.representationPolicy === "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE", "V3 representation policy lost");

let total = 0;
for (const language of ["en", "hi", "pa"] as const) {
  const all = previewTsdCp010StudioCandidate({ language, count: 471, seed: `proof-${language}` });
  assert(all.availableCombinationsUnderFilters === 471, `${language}: expected 471 compatible combinations`);
  assert(all.questions.length === 471, `${language}: expected 471 returned combinations`);
  assert(new Set(all.questions.map((q) => `${q.familyId}:${q.caseId}`)).size === 471, `${language}: duplicate family-case key`);
  assert(new Set(all.questions.map((q) => q.stem)).size === 471, `${language}: learner stems are not all unique`);
  assert(new Set(all.questions.map((q) => q.questionId)).size === 471, `${language}: question IDs are not unique`);

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
    assert(question.validation.examRealStem, `${language}/${question.familyId}/${question.caseId}: exam-real stem flag lost`);
    assert(question.validation.officialPaperRepresentationV3, `${language}/${question.familyId}/${question.caseId}: V3 official-paper flag lost`);
    assert(question.validation.rawSpeedDrillAvoidedWhereRaceRepresentationExists, `${language}/${question.familyId}/${question.caseId}: V3 raw-speed guard lost`);
    assert(question.persistenceAllowed === false, `${language}/${question.familyId}: persistence unexpectedly enabled`);
    assert(question.questionBankStatus === "NOT_STORED", `${language}/${question.familyId}: bank status changed`);
    assert(question.testEligibility === "INELIGIBLE", `${language}/${question.familyId}: test status changed`);
    assert(question.publiclyPublishable === false, `${language}/${question.familyId}: public status changed`);
  }

  assert(familyCounts.size === 60, `${language}: expected all 60 human-authored families to be represented`);
  const counts = [...familyCounts.values()];
  assert(Math.min(...counts) === 2, `${language}: expected minimum two compatible cases per family`);
  assert(Math.max(...counts) === 12, `${language}: expected maximum twelve compatible cases per family`);

  for (const qlId of TSD_CP010_PERMANENT_QL_IDS) {
    const filtered = previewTsdCp010StudioCandidate({ language, qlId, count: 1, seed: `${language}-${qlId}` });
    const expected = EXPECTED_QL_CAPACITY[qlId];
    assert(filtered.availableCombinationsUnderFilters === expected, `${language}/${qlId}: expected capacity ${expected}, got ${filtered.availableCombinationsUnderFilters}`);
    assert(filtered.questions.every((q) => q.qlId === qlId), `${language}/${qlId}: QL filter leaked`);
  }
  total += all.questions.length;
}
assert(total === 1413, `expected 1413 multilingual candidate combinations, got ${total}`);

console.log("TSD-CP-010 LOCKED OFFICIAL-PAPER V3 QUESTION STUDIO CANDIDATE PROOF: PASS");
console.log(JSON.stringify({
  combinationsPerLocale: 471,
  multilingualCombinations: total,
  humanFamiliesPerLocale: 60,
  minimumCompatibleCasesPerFamily: 2,
  maximumCompatibleCasesPerFamily: 12,
  qlCapacity: EXPECTED_QL_CAPACITY,
  stemAuthoringPolicy: "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE",
  stemNarrativePolicy: "RESULT_CAPABILITY_HANDICAP_FIRST_LOW_NARRATIVE",
  representationPolicy: "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE",
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS",
  variationPolicy: "HUMAN_FAMILY_X_SEMANTICALLY_COMPATIBLE_EXECUTABLE_CASE",
  numericRebindingPolicy: "OCCURRENCE_AWARE_EQUAL_SOURCE_VALUE_SAFE",
  duplicateStemPolicy: "DROP_DUPLICATE_RENDERED_STEM",
  registration: "NOT_REGISTERED",
  routeMounted: false,
  persistenceAllowed: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
