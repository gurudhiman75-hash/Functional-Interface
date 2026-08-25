import { TSD_CP010_STUDIO_CANDIDATE_PACKAGE, previewTsdCp010StudioCandidate } from "./question-studio-candidate-adapter";
import { TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 Studio candidate proof failed: ${message}`);
}

assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.sourceStatus === "MULTILINGUAL_REVIEW_CANDIDATE", "candidate source status changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "candidate must not be registered");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioStagingStatus === "DISABLED_PENDING_PRODUCT_OWNER_APPROVAL", "candidate staging must remain disabled");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "candidate route must remain unmounted");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.productionSelectorVisible === false, "candidate must not appear in production selector");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "candidate persistence must remain disabled");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "Question Bank write lock lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "test lock lost");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "public lock lost");

let total = 0;
for (const language of ["en", "hi", "pa"] as const) {
  const all = previewTsdCp010StudioCandidate({ language, count: 60, seed: `proof-${language}` });
  assert(all.availableItemsUnderFilters === 60, `${language}: expected 60 candidate review items`);
  assert(all.questions.length === 60, `${language}: expected 60 returned candidate items`);
  assert(new Set(all.questions.map((q) => q.familyId)).size === 60, `${language}: duplicate family item`);
  for (const question of all.questions) {
    assert(question.options.length === 4, `${language}/${question.familyId}: option count is not four`);
    assert(new Set(question.options).size === 4, `${language}/${question.familyId}: options are not unique`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${language}/${question.familyId}: invalid correct index`);
    assert(question.options[question.correctIndex] === question.answer, `${language}/${question.familyId}: correct option does not match answer`);
    assert(question.validation.independentVerifierAccepted, `${language}/${question.familyId}: verifier flag lost`);
    assert(question.persistenceAllowed === false, `${language}/${question.familyId}: persistence unexpectedly enabled`);
    assert(question.questionBankStatus === "NOT_STORED", `${language}/${question.familyId}: bank status changed`);
    assert(question.testEligibility === "INELIGIBLE", `${language}/${question.familyId}: test status changed`);
    assert(question.publiclyPublishable === false, `${language}/${question.familyId}: public status changed`);
  }
  for (const qlId of TSD_CP010_PERMANENT_QL_IDS) {
    const filtered = previewTsdCp010StudioCandidate({ language, qlId, count: 6, seed: `${language}-${qlId}` });
    assert(filtered.availableItemsUnderFilters === 6, `${language}/${qlId}: expected six family items`);
    assert(filtered.questions.every((q) => q.qlId === qlId), `${language}/${qlId}: QL filter leaked`);
  }
  total += all.questions.length;
}
assert(total === 180, `expected 180 multilingual candidate items, got ${total}`);

console.log("TSD-CP-010 LOCKED QUESTION STUDIO CANDIDATE PROOF: PASS");
console.log(JSON.stringify({
  itemsPerLocale: 60,
  multilingualItems: total,
  qlCount: TSD_CP010_PERMANENT_QL_IDS.length,
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS",
  registration: "NOT_REGISTERED",
  routeMounted: false,
  persistenceAllowed: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
