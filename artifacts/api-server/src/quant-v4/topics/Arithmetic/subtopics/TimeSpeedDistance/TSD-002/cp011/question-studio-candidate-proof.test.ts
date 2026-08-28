import { TSD_CP011_PROVISIONAL_QL_IDS } from "./ql-allocation";
import {
  TSD_CP011_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  previewTsdCp011StudioCandidate,
} from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 Studio candidate proof failed: ${message}`);
}

assert(TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE === 42, "expected 42 reviewed combinations per locale");
assert(TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS === 126, "expected 126 reviewed multilingual combinations");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "Studio must remain unregistered");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.productionSelectorVisible === false, "production selector must remain hidden");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "route must remain unmounted");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "persistence must remain disabled");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "Question Bank must remain read-locked");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "test eligibility must remain disabled");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "public publishing must remain disabled");

for (const language of ["en", "hi", "pa"] as const) {
  const preview = previewTsdCp011StudioCandidate({ language, count: 42, seed: `cp011-full-${language}` });
  assert(preview.questions.length === 42, `${language}: expected 42 Studio questions`);
  assert(preview.availableCombinationsUnderFilters === 42, `${language}: availability mismatch`);
  assert(new Set(preview.questions.map((q) => q.familyId)).size === 42, `${language}: duplicate family IDs`);
  assert(new Set(preview.questions.map((q) => q.stem)).size === 42, `${language}: duplicate learner stems`);
  assert(new Set(preview.questions.map((q) => q.questionId)).size === 42, `${language}: duplicate question IDs`);
  for (const question of preview.questions) {
    assert(question.options.length === 4, `${language}/${question.familyId}: expected four options`);
    assert(new Set(question.options).size === 4, `${language}/${question.familyId}: duplicate option`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${language}/${question.familyId}: invalid correct index`);
    assert(question.validation.exactSolverBacked, `${language}/${question.familyId}: exact solver flag missing`);
    assert(question.validation.independentVerifierAccepted, `${language}/${question.familyId}: verifier flag missing`);
    assert(question.validation.fourUniqueOptions, `${language}/${question.familyId}: option validation flag missing`);
    assert(question.reviewStatus === "REVIEW_CANDIDATE_NOT_APPROVED", `${language}/${question.familyId}: review lock missing`);
    assert(question.persistenceAllowed === false, `${language}/${question.familyId}: persistence escaped lock`);
    assert(question.publiclyPublishable === false, `${language}/${question.familyId}: publication escaped lock`);
  }
  for (const qlId of TSD_CP011_PROVISIONAL_QL_IDS) {
    const byQl = preview.questions.filter((q) => q.qlId === qlId);
    assert(byQl.length === 6, `${language}/${qlId}: expected six reviewed families`);
  }
}

const deterministicA = previewTsdCp011StudioCandidate({ language: "en", count: 10, seed: "same-seed" });
const deterministicB = previewTsdCp011StudioCandidate({ language: "en", count: 10, seed: "same-seed" });
assert(JSON.stringify(deterministicA.questions.map((q) => [q.familyId, q.options, q.correctIndex])) === JSON.stringify(deterministicB.questions.map((q) => [q.familyId, q.options, q.correctIndex])), "same seed must be deterministic");

console.log("TSD-CP-011 LOCKED QUESTION STUDIO REVIEW CANDIDATE PROOF: PASS");
console.log(JSON.stringify({
  combinationsPerLocale: 42,
  multilingualCombinations: 126,
  languages: 3,
  optionsPerQuestion: 4,
  registrationStatus: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus,
  persistenceAllowed: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed,
  testEligible: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.testEligible,
  publiclyPublishable: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable,
}, null, 2));
