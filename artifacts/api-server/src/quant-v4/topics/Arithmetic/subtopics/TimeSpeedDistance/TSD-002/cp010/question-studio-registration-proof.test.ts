import { readFileSync } from "node:fs";
import { TSD_CP010_ENGLISH_FREEZE_APPROVAL } from "./english-freeze-registry";
import { TSD_CP010_LOCALIZATION_FREEZE_APPROVAL } from "./localization-freeze-registry";
import { previewTsdCp010StudioCandidate } from "./question-studio-candidate-adapter-exam-real";
import {
  TSD_CP010_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewTsdCp010QuestionStudioReview,
} from "./question-studio-review-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 Question Studio registration proof failed: ${message}`);
}

assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus === "FROZEN", "English freeze authority lost");
assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.hindi === "FROZEN" && TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.punjabi === "FROZEN", "native freeze authority lost");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.productOwnerApprovalStatus === "APPROVED", "registered adapter must bind approved content");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioRegistrationStatus === "REGISTERED_REVIEW_ONLY", "Studio review registration missing");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioStagingStatus === "REVIEW_QUEUE_ENABLED", "review queue staging is not enabled");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.productionSelectorVisible === true, "registered package is not visible in Question Studio selector");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.routeMounted === true, "registered package route is not mounted");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.persistenceAllowed === true, "review queue persistence is not enabled");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.databasePersistence === "QUESTION_STUDIO_REVIEW_QUEUE_ONLY", "persistence scope is broader than review queue");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.compatibleCombinationsPerLocale === 471, "per-locale capacity changed");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations === 1413, "multilingual capacity changed");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable === false, "registration must not enable Question Bank writes");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible === false, "registration must not enable tests");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible === false, "registration must not enable mocks");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable === false, "registration must not enable public publishing");
assert(TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication === false, "registration must not enable automatic publication");
assert(TSD_CP010_QUESTION_STUDIO_INTEGRATION_AUTHORITY.includes(TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedSourceHead), "integration authority is not bound to approved frozen source");

for (const language of ["en", "hi", "pa"] as const) {
  const request = { language, count: 40, seed: `cp010-registration-${language}` } as const;
  const frozen = previewTsdCp010StudioCandidate(request);
  const registered = previewTsdCp010QuestionStudioReview(request);
  assert(registered.questions.length === frozen.questions.length, `${language}: registered preview count drifted`);
  for (let index = 0; index < frozen.questions.length; index += 1) {
    const before = frozen.questions[index]!;
    const after = registered.questions[index]!;
    assert(after.questionId === before.questionId, `${language}/${index}: question identity drifted`);
    assert(after.familyId === before.familyId && after.caseId === before.caseId, `${language}/${index}: family/case identity drifted`);
    assert(after.stem === before.stem, `${language}/${after.familyId}: learner stem changed during registration`);
    assert(after.answer === before.answer, `${language}/${after.familyId}: answer changed during registration`);
    assert(after.correctIndex === before.correctIndex, `${language}/${after.familyId}: correct option index changed during registration`);
    assert(after.options.join("\u0000") === before.options.join("\u0000"), `${language}/${after.familyId}: options changed during registration`);
    assert(after.explanation.steps.join("\u0000") === before.explanation.steps.join("\u0000"), `${language}/${after.familyId}: explanation steps changed during registration`);
    assert(after.explanation.conclusion === before.explanation.conclusion, `${language}/${after.familyId}: explanation conclusion changed during registration`);
    assert(after.questionStudioRegistrationStatus === "REGISTERED_REVIEW_ONLY", `${language}/${after.familyId}: registration overlay missing`);
    assert(after.persistenceAllowed === true, `${language}/${after.familyId}: review persistence overlay missing`);
    assert(after.questionBankWritable === false && after.testEligible === false && after.publiclyPublishable === false, `${language}/${after.familyId}: downstream release lock opened`);
  }
}

const routeIndex = readFileSync("artifacts/api-server/src/routes/index.ts", "utf8");
const route = readFileSync("artifacts/api-server/src/routes/admin-question-studio-time-speed-distance-cp010.ts", "utf8");
const adminApi = readFileSync("artifacts/admin-app/src/features/question-studio/api.ts", "utf8");
const adminHook = readFileSync("artifacts/admin-app/src/features/question-studio/useQuestionStudio.ts", "utf8");

assert(routeIndex.includes('adminQuestionStudioTimeSpeedDistanceCp010Router from "./admin-question-studio-time-speed-distance-cp010"'), "CP010 route import missing from route index");
assert(routeIndex.includes('router.use("/admin/question-studio", adminQuestionStudioTimeSpeedDistanceCp010Router)'), "CP010 route is not mounted under Question Studio");
assert(route.includes('/quant/time-speed-distance/cp010/package'), "CP010 package endpoint missing");
assert(route.includes('/quant/time-speed-distance/cp010/preview'), "CP010 preview endpoint missing");
assert(route.includes('/quant/time-speed-distance/cp010/runs'), "CP010 review-run endpoint missing");
assert(route.includes("'review'::generation_run_status"), "CP010 persisted runs are not review status");
assert(route.includes('questionBankWritable: false'), "CP010 route lost Question Bank lock");
assert(route.includes('testEligible: false'), "CP010 route lost test lock");
assert(route.includes('publiclyPublishable: false'), "CP010 route lost publishing lock");
assert(adminApi.includes("TSD_CP010_SELECTOR_PACKAGE_ID = 'TSD-002::CP010-REVIEW'"), "admin API selector ID missing");
assert(adminApi.includes('/admin/question-studio/quant/time-speed-distance/cp010/package'), "admin package fetch endpoint missing");
assert(adminApi.includes('/admin/question-studio/quant/time-speed-distance/cp010/runs'), "admin run endpoint missing");
assert(adminHook.includes('withTsdCp010ReviewPackage'), "admin hook does not surface CP010 review package");
assert(adminHook.includes('input.packageId === TSD_CP010_SELECTOR_PACKAGE_ID'), "admin hook does not route CP010 generation through review-only API");

console.log("TSD-CP-010 QUESTION STUDIO REGISTERED REVIEW-ONLY PROOF: PASS");
console.log(JSON.stringify({
  checkpoint: "TSD-CP-010",
  registration: "REGISTERED_REVIEW_ONLY",
  perLocale: 471,
  multilingual: 1413,
  persistedSurface: "QUESTION_STUDIO_REVIEW_QUEUE_ONLY",
  frozenLearnerContentChanged: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
