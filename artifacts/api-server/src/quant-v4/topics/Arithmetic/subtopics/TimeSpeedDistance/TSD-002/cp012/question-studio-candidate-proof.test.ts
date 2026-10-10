import { TSD_CP012_PROVISIONAL_QL_IDS } from "./ql-allocation";
import {
  TSD_CP012_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  previewTsdCp012StudioCandidate,
} from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 Studio candidate proof failed: ${message}`);
}
function wrongPathKey(question: ReturnType<typeof previewTsdCp012StudioCandidate>["questions"][number]): string {
  return question.internalOptionAudit
    .filter((entry) => !entry.isCorrect)
    .map((entry) => `${entry.misconceptionId}|${entry.wrongWorking?.calculation ?? ""}`)
    .sort()
    .join("||");
}

assert(TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE === 270, "expected 270 reviewed combinations per locale");
assert(TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS === 810, "expected 810 reviewed multilingual combinations");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.productOwnerApprovalStatus === "NOT_APPROVED", "product-owner approval must remain absent");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "Studio must remain unregistered");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.productionSelectorVisible === false, "production selector must remain hidden");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "route must remain unmounted");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "persistence must remain disabled");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "Question Bank must remain read-locked");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "test eligibility must remain disabled");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "public publishing must remain disabled");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.distractorStatus === "MISCONCEPTION_BACKED_REVIEW_CANDIDATE_NOT_FROZEN", "misconception distractors must remain explicitly unfrozen");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.optionPolicy === "FOUR_UNIQUE_MISCONCEPTION_BACKED_REVIEW_OPTIONS_NOT_FROZEN", "misconception-backed option policy missing");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.variationPolicy === "TARGET_EXHAUSTIVE_REVIEWED_SEMANTIC_SCALE_BANDS_NO_BLIND_RANDOMIZATION", "safe semantic expansion policy missing");
assert(JSON.stringify(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.supportedDifficulties) === JSON.stringify(["EASY", "MEDIUM"]), "Studio must advertise only reviewed difficulty bands");

const previews = new Map<string, ReturnType<typeof previewTsdCp012StudioCandidate>>();
for (const language of ["en", "hi", "pa"] as const) {
  const preview = previewTsdCp012StudioCandidate({ language, count: 270, seed: `cp012-full-${language}` });
  previews.set(language, preview);
  assert(preview.questions.length === 270, `${language}: expected 270 Studio questions`);
  assert(preview.availableCombinationsUnderFilters === 270, `${language}: availability mismatch`);
  assert(new Set(preview.questions.map((question) => question.familyId)).size === 270, `${language}: duplicate family IDs`);
  assert(new Set(preview.questions.map((question) => question.stem)).size === 270, `${language}: duplicate learner stems`);
  assert(new Set(preview.questions.map((question) => question.questionId)).size === 270, `${language}: duplicate question IDs`);

  for (const question of preview.questions) {
    assert(question.options.length === 4, `${language}/${question.familyId}: expected four options`);
    assert(new Set(question.options).size === 4, `${language}/${question.familyId}: duplicate option`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${language}/${question.familyId}: invalid correct index`);
    assert(question.internalOptionAudit.length === 4, `${language}/${question.familyId}: option audit must contain four rows`);
    assert(question.internalOptionAudit.filter((entry) => entry.isCorrect).length === 1, `${language}/${question.familyId}: option audit must contain exactly one correct row`);
    assert(question.internalOptionAudit[question.correctIndex]?.isCorrect === true, `${language}/${question.familyId}: correct index and option audit disagree`);

    const wrongs = question.internalOptionAudit.filter((entry) => !entry.isCorrect);
    assert(wrongs.length === 3, `${language}/${question.familyId}: expected three audited distractors`);
    assert(wrongs.every((entry) => Boolean(entry.misconceptionId && entry.wrongWorking?.calculation)), `${language}/${question.familyId}: distractor missing misconception provenance`);
    assert(new Set(wrongs.map((entry) => `${entry.misconceptionId}|${entry.wrongWorking?.calculation}`)).size === 3, `${language}/${question.familyId}: distractor reasoning paths are not distinct`);
    assert(wrongs.every((entry) => !/answer\s*[+\-*/]|answer\s*(?:times|divided)|scaled|alter final arithmetic|add one to the answer|subtract one from the answer/i.test(entry.wrongWorking?.calculation ?? "")), `${language}/${question.familyId}: generic answer-offset/scaling filler leaked into distractors`);
    assert(wrongs.every((entry) => !question.stem.includes(entry.wrongWorking?.calculation ?? "__never__")), `${language}/${question.familyId}: internal wrong working leaked into learner stem`);

    assert(question.validation.exactSolverOrSourceExtensionBacked, `${language}/${question.familyId}: exact source flag missing`);
    assert(question.validation.independentVerifierAccepted, `${language}/${question.familyId}: verifier flag missing`);
    assert(question.validation.fourUniqueOptions, `${language}/${question.familyId}: option validation flag missing`);
    assert(question.validation.misconceptionBackedDistractors, `${language}/${question.familyId}: misconception-backed validation flag missing`);
    assert(question.validation.distractorsFrozen === false, `${language}/${question.familyId}: distractor review lock missing`);
    assert(question.reviewStatus === "REVIEW_CANDIDATE_NOT_APPROVED", `${language}/${question.familyId}: review lock missing`);
    assert(question.persistenceAllowed === false, `${language}/${question.familyId}: persistence escaped lock`);
    assert(question.publiclyPublishable === false, `${language}/${question.familyId}: publication escaped lock`);
  }

  for (const qlId of TSD_CP012_PROVISIONAL_QL_IDS) {
    const byQl = preview.questions.filter((question) => question.qlId === qlId);
    assert(byQl.length === 24 || byQl.length === 26, `${language}/${qlId}: expected 24 or 26 target-exhaustive reviewed families, found ${byQl.length}`);
  }
  const setQuestions = preview.questions.filter((question) => question.solution.kind === "SET");
  assert(setQuestions.length === 12, `${language}: expected 12 complete-set review questions`);
  assert(setQuestions.every((question) => question.optionModel === "MISCONCEPTION_BACKED_COMPLETE_SET_REVIEW"), `${language}: set-valued answer escaped misconception-backed set option model`);
  const routeQuestions = preview.questions.filter((question) => question.solution.kind === "SCALAR" && question.solution.unit === "INDEX");
  assert(routeQuestions.length >= 3, `${language}: finite route-choice questions missing`);
  assert(routeQuestions.every((question) => question.optionModel === "FINITE_ROUTE_CHOICE"), `${language}: route index escaped finite-route option model`);
  const scalarQuestions = preview.questions.filter((question) => question.solution.kind === "SCALAR" && question.solution.unit !== "INDEX");
  assert(scalarQuestions.every((question) => question.optionModel === "MISCONCEPTION_BACKED_SCALAR_REVIEW"), `${language}: scalar answer escaped misconception-backed option model`);
}

const english = previews.get("en")!;
for (const language of ["hi", "pa"] as const) {
  const localized = previews.get(language)!;
  const localizedByFamily = new Map(localized.questions.map((question) => [question.familyId, question]));
  for (const englishQuestion of english.questions) {
    const translated = localizedByFamily.get(englishQuestion.familyId);
    assert(translated, `${language}/${englishQuestion.familyId}: localized Studio family missing`);
    assert(wrongPathKey(translated) === wrongPathKey(englishQuestion), `${language}/${englishQuestion.familyId}: misconception identities/workings drifted across locales`);
  }
}

const deterministicA = previewTsdCp012StudioCandidate({ language: "en", count: 40, seed: "same-seed" });
const deterministicB = previewTsdCp012StudioCandidate({ language: "en", count: 40, seed: "same-seed" });
assert(JSON.stringify(deterministicA.questions.map((question) => [question.familyId, question.options, question.correctIndex, wrongPathKey(question)])) === JSON.stringify(deterministicB.questions.map((question) => [question.familyId, question.options, question.correctIndex, wrongPathKey(question)])), "same seed must be deterministic");

console.log("TSD-CP-012 LOCKED QUESTION STUDIO MISCONCEPTION DISTRACTOR PROOF: PASS");
console.log(JSON.stringify({
  combinationsPerLocale: 270,
  multilingualCombinations: 810,
  languages: 3,
  optionsPerQuestion: 4,
  wrongPathsPerQuestion: 3,
  misconceptionBackedDistractors: true,
  semanticScaleExpansion: true,
  blindRandomization: false,
  targetExhaustive: true,
  distractorsFrozen: false,
  registrationStatus: TSD_CP012_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus,
  persistenceAllowed: TSD_CP012_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed,
  testEligible: TSD_CP012_STUDIO_CANDIDATE_PACKAGE.testEligible,
  publiclyPublishable: TSD_CP012_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable,
}, null, 2));
