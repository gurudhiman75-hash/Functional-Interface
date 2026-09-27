import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";
import { DI005_PERMANENT_QLS, DI005_PERMANENT_RELEASE_ID } from "./permanent-ql-registry";
import { DI005_LOCALIZATION_RELEASE_ID } from "./localization-review-v1";
import {
  DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI005_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi005QuestionStudioBatch,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const card = quantV4QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DI-005");
assert(card, "DI-005 is missing from the shared Quant V4 Question Studio package list.");
assert(card.enabled, "DI-005 package card must be enabled for controlled review.");
assert(card.cpIds.includes(DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID), "DI-005 package card lost its canonical problem id.");
assert(card.runtimeMode === DI005_QUESTION_STUDIO_RUNTIME_MODE, "DI-005 package card exposes the wrong runtime mode.");
assert(card.questionBankStatus === "NOT_STORED" && card.questionBankWritable === false, "DI-005 must remain outside Question Bank writes.");
assert(card.testEligibility === "INELIGIBLE" && card.testEligible === false && card.mockTestEligible === false, "DI-005 must remain ineligible for tests and mocks.");
assert(card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false, "DI-005 publication locks drifted.");
assert(["en", "hi", "pa"].every((language) => card.supportedLanguages.includes(language as any)), "DI-005 package card must expose approved English, Hindi and Punjabi controlled-review languages.");

const seen = new Set<string>();
for (const descriptor of DI005_PERMANENT_QLS) {
  const request = {
    packageId: "DI-005",
    canonicalProblemId: DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    language: "en",
    count: 1,
    seed: `DI005-QS-INTEGRATION-${descriptor.qlId}`,
    examProfile: "SSC_CGL_TIER_I",
  } as const;
  const first = await generateDi005QuestionStudioBatch(request);
  const replay = await generateDi005QuestionStudioBatch(request);
  assert(first.questions.length === 1 && replay.questions.length === 1, `${descriptor.qlId} did not generate exactly one preview.`);
  const question = first.questions[0] as Record<string, any>;
  const replayQuestion = replay.questions[0] as Record<string, any>;
  assert(question.packageId === "DI-005", `${descriptor.qlId} routed to the wrong DI package.`);
  assert(question.questionLanguageId === descriptor.qlId && question.permanentQlId === descriptor.qlId, `${descriptor.qlId} lost permanent QL identity.`);
  assert(question.taskKind === descriptor.taskKind, `${descriptor.qlId} drifted from ${descriptor.taskKind}.`);
  assert(question.difficulty === descriptor.difficulty, `${descriptor.qlId} drifted from ${descriptor.difficulty}.`);
  assert(Array.isArray(question.options) && question.options.length === 4 && new Set(question.options).size === 4, `${descriptor.qlId} has invalid SSC options.`);
  assert(question.options[question.correctIndex] === question.answer, `${descriptor.qlId} correct index does not point to the answer.`);
  assert(question.stimulus?.kind === "PIE" && Array.isArray(question.stimulus?.slices) && question.stimulus.slices.length === 5, `${descriptor.qlId} is missing its semantic pie stimulus.`);
  assert(question.releaseId === DI005_PERMANENT_RELEASE_ID && question.runtimeMode === DI005_QUESTION_STUDIO_RUNTIME_MODE, `${descriptor.qlId} lost release/runtime authority.`);
  assert(question.questionBankStatus === "NOT_STORED" && question.questionBankWritable === false && question.testEligibility === "INELIGIBLE", `${descriptor.qlId} lifecycle lock drifted.`);
  assert(question.mockTestEligible === false && question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `${descriptor.qlId} publication lock drifted.`);
  if (descriptor.difficulty === "Hard") {
    const hidden = question.stimulus.hiddenPercentIndex;
    if (descriptor.taskKind === "RELATIVE_SECTOR_PERCENT_EXCESS") {
      assert(Number(question.richExplanation?.steps?.length) >= 3, `${descriptor.qlId} lost the approved multi-step explanation.`);
      const source = first.questionPackages[0] as Record<string, any>;
      const evidence = source.question.evidence;
      assert(Number(evidence.largerIndex) === hidden || Number(evidence.smallerIndex) === hidden, `${descriptor.qlId} no longer requires hidden-sector recovery.`);
    } else {
      const source = first.questionPackages[0] as Record<string, any>;
      const evidence = source.question.evidence;
      assert(Number(evidence.firstIndex) === hidden || Number(evidence.secondIndex) === hidden, `${descriptor.qlId} no longer requires hidden-sector recovery.`);
    }
  }
  const projection = (item: Record<string, any>) => ({ stem: item.stem, options: item.options, correctIndex: item.correctIndex, answer: item.answer, stimulus: item.stimulus, taskKind: item.taskKind, difficulty: item.difficulty });
  assert(JSON.stringify(projection(question)) === JSON.stringify(projection(replayQuestion)), `${descriptor.qlId} is not deterministic for a fixed seed.`);
  seen.add(descriptor.qlId);
}
assert(seen.size === 12, "DI-005 permanent integration did not exercise all 12 QLs.");

const shared = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-005",
  canonicalProblemId: DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  language: "en",
  count: 12,
  seed: "DI005-SHARED-ADAPTER-MIXED",
  exam: "SSC CGL Tier I",
});
assert(shared.questions.length === 12, "Shared Quant V4 adapter did not route DI-005 generation.");
assert(new Set(shared.questions.map((question) => question.questionLanguageId)).size === 12, "A 12-question mixed DI-005 batch must cover all permanent QLs once.");
assert(shared.questions.every((question) => question.packageId === "DI-005" && question.questionBankWritable === false && question.testEligible === false), "Shared adapter widened DI-005 lifecycle authority.");

for (const language of ["hi", "pa"] as const) {
  const localized = await quantV4QuestionStudioAdapter.generate({
    packageId: "DI-005",
    canonicalProblemId: DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    language,
    count: 12,
    seed: `DI005-MULTILINGUAL-QS-${language}`,
    exam: "SSC CGL Tier I",
  });
  assert(localized.questions.length === 12, `DI-005 ${language} controlled review did not generate all 12 permanent QLs.`);
  assert(new Set(localized.questions.map((question) => question.questionLanguageId)).size === 12, `DI-005 ${language} batch did not cover all permanent QLs.`);
  for (const raw of localized.questions) {
    const question = raw as Record<string, any>;
    const learnerText = [question.stem, ...(question.options ?? []), question.answer, question.explanation].join(" ");
    assert(question.language === language, `DI-005 ${language} question lost requested language.`);
    assert(question.reviewStatus === "MULTILINGUAL_FROZEN", `DI-005 ${language} question is not frozen multilingual authority.`);
    assert(question.releaseId === DI005_LOCALIZATION_RELEASE_ID, `DI-005 ${language} question lost localization release identity.`);
    assert(question.questionBankWritable === false && question.testEligible === false && question.mockTestEligible === false, `DI-005 ${language} widened learner lifecycle authority.`);
    assert(question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `DI-005 ${language} widened publication authority.`);
    assert(!/[A-Za-z]/u.test(learnerText), `DI-005 ${language} learner surface leaks Roman text: ${learnerText}`);
    if (language === "hi") assert(/[\u0900-\u097F]/u.test(learnerText), "DI-005 Hindi Question Studio surface lacks Devanagari.");
    else assert(/[\u0A00-\u0A7F]/u.test(learnerText), "DI-005 Punjabi Question Studio surface lacks Gurmukhi.");
    assert(question.options[question.correctIndex] === question.answer, `DI-005 ${language} localized answer-index binding failed.`);
    if (question.difficulty === "Hard") {
      assert(Number(question.richExplanation?.steps?.length) >= 3, `DI-005 ${language} Hard explanation lost hidden-sector recovery flow.`);
      assert(String(question.richExplanation?.steps?.[0] ?? "").includes("100%"), `DI-005 ${language} Hard explanation does not recover hidden sector first.`);
    }
  }
}

const banking = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-005",
  language: "en",
  count: 12,
  seed: "DI005-BANKING-OPTION-SHAPE",
  exam: "Banking Prelims",
});
assert(banking.questions.length === 12, "Banking DI-005 mixed batch did not generate twelve questions.");
assert(banking.questions.every((question) => Array.isArray(question.options) && question.options.length === 5 && new Set(question.options).size === 5), "Banking DI-005 must expose five unique options per question.");

const explicit = await quantV4QuestionStudioAdapter.generate({
  questionLanguageId: "DI-QL-049",
  language: "en",
  count: 1,
  seed: "DI005-ROUTING-GUARD",
  exam: "SSC CGL Tier I",
});
assert(explicit.questions[0]?.packageId === "DI-005", "DI-QL-049 was intercepted by another DI package selector.");

console.log(JSON.stringify({
  status: "PASS_DI_005_QUESTION_STUDIO_MULTILINGUAL_CONTROLLED_REVIEW",
  releaseId: DI005_PERMANENT_RELEASE_ID,
  runtimeMode: DI005_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlCount: DI005_PERMANENT_QLS.length,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
