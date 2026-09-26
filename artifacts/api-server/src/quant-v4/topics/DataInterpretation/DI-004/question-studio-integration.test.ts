import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";
import { DI004_PERMANENT_QLS, DI004_PERMANENT_RELEASE_ID } from "./permanent-ql-registry";
import {
  DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI004_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi004QuestionStudioBatch,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const card = quantV4QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DI-004");
assert(card, "DI-004 is missing from the shared Quant V4 Question Studio package list.");
assert(card.enabled, "DI-004 package card must be enabled for controlled review.");
assert(card.cpIds.includes(DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID), "DI-004 package card lost its canonical problem id.");
assert(card.runtimeMode === DI004_QUESTION_STUDIO_RUNTIME_MODE, "DI-004 package card exposes the wrong runtime mode.");
assert(card.questionBankStatus === "NOT_STORED" && card.questionBankWritable === false, "DI-004 must remain outside Question Bank writes.");
assert(card.testEligibility === "INELIGIBLE" && card.testEligible === false && card.mockTestEligible === false, "DI-004 must remain ineligible for tests and mocks.");
assert(card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false, "DI-004 publication locks drifted.");
assert(card.supportedLanguages.length === 1 && card.supportedLanguages[0] === "en", "DI-004 must remain English-only until localization is approved.");

const seen = new Set<string>();
for (const descriptor of DI004_PERMANENT_QLS) {
  const request = {
    packageId: "DI-004",
    canonicalProblemId: DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    language: "en",
    count: 1,
    seed: `DI004-QS-INTEGRATION-${descriptor.qlId}`,
    examProfile: "SSC_CGL_TIER_I",
  } as const;
  const first = await generateDi004QuestionStudioBatch(request);
  const replay = await generateDi004QuestionStudioBatch(request);
  assert(first.questions.length === 1 && replay.questions.length === 1, `${descriptor.qlId} did not generate exactly one preview.`);

  const question = first.questions[0] as Record<string, any>;
  const replayQuestion = replay.questions[0] as Record<string, any>;
  assert(question.packageId === "DI-004", `${descriptor.qlId} routed to the wrong DI package.`);
  assert(question.questionLanguageId === descriptor.qlId && question.permanentQlId === descriptor.qlId, `${descriptor.qlId} lost permanent QL identity.`);
  assert(question.taskKind === descriptor.taskKind, `${descriptor.qlId} drifted from ${descriptor.taskKind}.`);
  assert(question.difficulty === descriptor.difficulty, `${descriptor.qlId} drifted from ${descriptor.difficulty}.`);
  assert(Array.isArray(question.options) && question.options.length === 4 && new Set(question.options).size === 4, `${descriptor.qlId} has invalid SSC options.`);
  assert(question.options[question.correctIndex] === question.answer, `${descriptor.qlId} correct index does not point to the answer.`);
  assert(question.stimulus?.kind === "LINE" && Array.isArray(question.stimulus?.points) && question.stimulus.points.length === 6, `${descriptor.qlId} is missing its six-period line stimulus.`);
  assert(Array.isArray(question.stimulus?.series) && question.stimulus.series.length === 2, `${descriptor.qlId} lost its two-series line contract.`);
  assert(question.releaseId === DI004_PERMANENT_RELEASE_ID && question.runtimeMode === DI004_QUESTION_STUDIO_RUNTIME_MODE, `${descriptor.qlId} lost release/runtime authority.`);
  assert(question.reviewStatus === "ENGLISH_REVIEW_APPROVED", `${descriptor.qlId} lost approved editorial status.`);
  assert(question.questionBankStatus === "NOT_STORED" && question.questionBankWritable === false && question.testEligibility === "INELIGIBLE", `${descriptor.qlId} lifecycle lock drifted.`);
  assert(question.mockTestEligible === false && question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `${descriptor.qlId} publication lock drifted.`);
  assert(!/\d+\.\d+%/u.test(question.stem + " " + question.answer), `${descriptor.qlId} leaked a decimal percentage to the learner surface.`);
  assert((question.richExplanation as Record<string, unknown>).shortcut === undefined && (question.richExplanation as Record<string, unknown>).trap === undefined, `${descriptor.qlId} reintroduced shortcut/trap boilerplate.`);
  if (question.difficulty === "Easy") {
    assert(["CROSS_SERIES_DIFFERENCE", "COMBINED_PERIOD_TOTAL"].includes(question.taskKind), `${descriptor.qlId} Easy route does not require arithmetic.`);
    assert(question.richExplanation?.steps?.length >= 2, `${descriptor.qlId} Easy route collapsed to lookup.`);
  }
  if (question.difficulty === "Medium") assert(question.richExplanation?.steps?.length >= 2, `${descriptor.qlId} Medium route lacks derived/comparison working.`);
  if (question.difficulty === "Hard") assert(question.richExplanation?.steps?.length >= 3, `${descriptor.qlId} Hard route lost multi-step working.`);

  const projection = (item: Record<string, any>) => ({
    stem: item.stem,
    options: item.options,
    correctIndex: item.correctIndex,
    answer: item.answer,
    stimulus: item.stimulus,
    taskKind: item.taskKind,
    difficulty: item.difficulty,
  });
  assert(JSON.stringify(projection(question)) === JSON.stringify(projection(replayQuestion)), `${descriptor.qlId} is not deterministic for a fixed seed.`);
  seen.add(descriptor.qlId);
}
assert(seen.size === 12, "DI-004 permanent integration did not exercise all 12 QLs.");

const shared = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-004",
  canonicalProblemId: DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  language: "en",
  count: 12,
  seed: "DI004-SHARED-ADAPTER-MIXED",
  exam: "SSC CGL Tier I",
});
assert(shared.questions.length === 12, "Shared Quant V4 adapter did not route DI-004 generation.");
assert(new Set(shared.questions.map((question) => question.questionLanguageId)).size === 12, "A 12-question mixed DI-004 batch must cover all permanent QLs once.");
assert(shared.questions.every((question) => question.packageId === "DI-004" && question.questionBankWritable === false && question.testEligible === false), "Shared adapter widened DI-004 lifecycle authority.");

const banking = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-004",
  language: "en",
  count: 12,
  seed: "DI004-BANKING-OPTION-SHAPE",
  exam: "Banking Prelims",
});
assert(banking.questions.length === 12, "Banking DI-004 mixed batch did not generate twelve questions.");
assert(banking.questions.every((question) => Array.isArray(question.options) && question.options.length === 5 && new Set(question.options).size === 5), "Banking DI-004 must expose five unique options per question.");

const explicit = await quantV4QuestionStudioAdapter.generate({
  questionLanguageId: "DI-QL-109",
  language: "en",
  count: 1,
  seed: "DI004-ROUTING-GUARD",
  exam: "SSC CGL Tier I",
});
assert(explicit.questions[0]?.packageId === "DI-004", "DI-QL-109 was intercepted by another DI package selector.");

let localizationBlocked = false;
try {
  await generateDi004QuestionStudioBatch({ packageId: "DI-004", language: "hi", count: 1, seed: "DI004-LOCALIZATION-LOCK" });
} catch {
  localizationBlocked = true;
}
assert(localizationBlocked, "DI-004 Hindi generation must stay blocked until localization is approved.");

console.log(JSON.stringify({
  status: "PASS_DI_004_QUESTION_STUDIO_CONTROLLED_REVIEW",
  releaseId: DI004_PERMANENT_RELEASE_ID,
  runtimeMode: DI004_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlCount: DI004_PERMANENT_QLS.length,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
