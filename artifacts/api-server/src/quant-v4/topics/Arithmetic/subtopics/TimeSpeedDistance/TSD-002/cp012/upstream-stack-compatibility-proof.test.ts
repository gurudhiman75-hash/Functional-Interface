import {
  TSD_CP011_NEXT_PERMANENT_QL,
  TSD_CP011_PERMANENT_QL_IDS,
  TSD_CP011_QL_LIFECYCLE,
} from "../cp011/ql-allocation";
import {
  TSD_CP011_RELEASE_HINDI_REVIEW,
  TSD_CP011_RELEASE_PUNJABI_REVIEW,
} from "../cp011/native-review-release";
import {
  TSD_CP011_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  previewTsdCp011StudioCandidate,
} from "../cp011/question-studio-candidate";
import {
  TSD_CP012_NEXT_PERMANENT_QL,
  TSD_CP012_PERMANENT_QL_IDS,
  TSD_CP012_QL_LIFECYCLE,
} from "./ql-allocation";
import {
  TSD_CP012_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
} from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD CP011→CP012 stack compatibility proof failed: ${message}`);
}

assert(TSD_CP011_PERMANENT_QL_IDS.length === 7, "CP011 must own seven permanent QLs");
assert(TSD_CP011_PERMANENT_QL_IDS[0] === "TSD-QL-125", "CP011 must start at TSD-QL-125");
assert(TSD_CP011_PERMANENT_QL_IDS.at(-1) === "TSD-QL-131", "CP011 must end at TSD-QL-131");
assert(TSD_CP011_NEXT_PERMANENT_QL === "TSD-QL-132", "CP011 next permanent QL must remain TSD-QL-132");

assert(TSD_CP012_PERMANENT_QL_IDS.length === 11, "CP012 must own eleven permanent QLs");
assert(TSD_CP012_PERMANENT_QL_IDS[0] === "TSD-QL-132", "CP012 must start at TSD-QL-132");
assert(TSD_CP012_PERMANENT_QL_IDS.at(-1) === "TSD-QL-142", "CP012 must end at TSD-QL-142");
assert(TSD_CP012_NEXT_PERMANENT_QL === "TSD-QL-143", "CP012 next permanent QL must remain TSD-QL-143");
assert(TSD_CP011_NEXT_PERMANENT_QL === TSD_CP012_PERMANENT_QL_IDS[0], "CP011→CP012 QL continuity is broken");

const qlOverlap = TSD_CP011_PERMANENT_QL_IDS.filter((qlId) =>
  (TSD_CP012_PERMANENT_QL_IDS as readonly string[]).includes(qlId));
assert(qlOverlap.length === 0, `CP011/CP012 QL overlap detected: ${qlOverlap.join(", ")}`);

assert(TSD_CP011_RELEASE_HINDI_REVIEW.length === 168, "CP011 Hindi release surface must contain 168 questions");
assert(TSD_CP011_RELEASE_PUNJABI_REVIEW.length === 168, "CP011 Punjabi release surface must contain 168 questions");
assert(TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE === 168, "CP011 Studio per-locale capacity drifted");
assert(TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS === 504, "CP011 Studio multilingual capacity drifted");
assert(TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE === 270, "CP012 Studio per-locale capacity drifted");
assert(TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS === 810, "CP012 Studio multilingual capacity drifted");

for (const [language, review] of [
  ["hi", TSD_CP011_RELEASE_HINDI_REVIEW],
  ["pa", TSD_CP011_RELEASE_PUNJABI_REVIEW],
] as const) {
  assert(new Set(review.map((question) => question.familyId)).size === 168, `${language}: CP011 release family IDs must remain unique`);
  assert(new Set(review.map((question) => question.stem)).size === 168, `${language}: CP011 release stems must remain unique`);

  const ratioQuestions = review.filter((question) => question.solution.unit === "RATIO");
  assert(ratioQuestions.length > 0, `${language}: expected ratio questions in CP011 release surface`);
  for (const question of ratioQuestions) {
    const ratio = `${question.solution.answer.numerator}:${question.solution.answer.denominator}`;
    assert(question.explanation.conclusion.includes(ratio), `${language}/${question.familyId}: release conclusion lost standard a:b ratio presentation`);
    assert(question.explanation.steps.some((step) => step.includes(ratio)), `${language}/${question.familyId}: release explanation lost standard a:b ratio presentation`);
  }

  const preview = previewTsdCp011StudioCandidate({ language, count: 168, seed: `cp011-cp012-stack-${language}` });
  assert(preview.questions.length === 168, `${language}: CP011 Studio no longer consumes the full polished release surface`);
  assert(preview.availableCombinationsUnderFilters === 168, `${language}: CP011 Studio availability drifted after stack synchronization`);
  for (const question of preview.questions.filter((item) => item.solution.unit === "RATIO")) {
    const ratio = `${question.solution.answer.numerator}:${question.solution.answer.denominator}`;
    assert(question.explanation.conclusion.includes(ratio), `${language}/${question.familyId}: Studio is not consuming polished ratio explanation`);
    assert(question.options.includes(ratio), `${language}/${question.familyId}: Studio ratio options lost standard a:b presentation`);
  }
}

for (const [checkpoint, lifecycle] of [
  ["CP011", TSD_CP011_QL_LIFECYCLE],
  ["CP012", TSD_CP012_QL_LIFECYCLE],
] as const) {
  assert(lifecycle.productOwnerApproved === true, `${checkpoint}: approved content lifecycle lost product-owner approval`);
  assert(lifecycle.frozen === true, `${checkpoint}: content lifecycle is no longer frozen`);
  assert(lifecycle.questionBankWritable === false, `${checkpoint}: Question Bank write lock unexpectedly opened`);
  assert(lifecycle.testEligible === false, `${checkpoint}: test eligibility unexpectedly opened`);
  assert(lifecycle.publiclyPublishable === false, `${checkpoint}: public publication unexpectedly opened`);
}

for (const [checkpoint, studio] of [
  ["CP011", TSD_CP011_STUDIO_CANDIDATE_PACKAGE],
  ["CP012", TSD_CP012_STUDIO_CANDIDATE_PACKAGE],
] as const) {
  assert(studio.questionStudioRegistrationStatus === "NOT_REGISTERED", `${checkpoint}: Studio registration lock unexpectedly opened`);
  assert(studio.productionSelectorVisible === false, `${checkpoint}: production selector unexpectedly visible`);
  assert(studio.routeMounted === false, `${checkpoint}: production route unexpectedly mounted`);
  assert(studio.persistenceAllowed === false, `${checkpoint}: persistence unexpectedly enabled`);
  assert(studio.questionBankWritable === false, `${checkpoint}: Question Bank unexpectedly writable`);
  assert(studio.testEligible === false, `${checkpoint}: tests unexpectedly enabled`);
  assert(studio.publiclyPublishable === false, `${checkpoint}: public publishing unexpectedly enabled`);
}

console.log("TSD CP011→CP012 FROZEN STACK COMPATIBILITY PROOF: PASS");
console.log(JSON.stringify({
  cp011: {
    qls: `${TSD_CP011_PERMANENT_QL_IDS[0]}..${TSD_CP011_PERMANENT_QL_IDS.at(-1)}`,
    perLocale: TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
    multilingual: TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
    nativeRatioPresentation: "STANDARD_A_COLON_B",
    frozen: TSD_CP011_QL_LIFECYCLE.frozen,
  },
  cp012: {
    qls: `${TSD_CP012_PERMANENT_QL_IDS[0]}..${TSD_CP012_PERMANENT_QL_IDS.at(-1)}`,
    perLocale: TSD_CP012_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
    multilingual: TSD_CP012_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
    frozen: TSD_CP012_QL_LIFECYCLE.frozen,
  },
  qlContinuity: `${TSD_CP011_PERMANENT_QL_IDS.at(-1)} -> ${TSD_CP012_PERMANENT_QL_IDS[0]}`,
  lifecycle: "CONTENT_FROZEN_PRODUCTION_LOCKS_PRESERVED",
}, null, 2));
