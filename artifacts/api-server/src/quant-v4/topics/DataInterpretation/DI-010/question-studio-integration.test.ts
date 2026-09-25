import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";
import { DI010_PERMANENT_QLS, DI010_PERMANENT_RELEASE_ID } from "./permanent-ql-registry";
import { DI010_LOCALIZATION_RELEASE_ID } from "./localization-review-v1";
import { DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, DI010_QUESTION_STUDIO_RUNTIME_MODE, generateDi010QuestionStudioBatch } from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function previewLearnerText(question: Record<string, any>) {
  const table = question.richExplanation?.workingTable;
  return [question.stem, ...(question.options ?? []), question.answer, question.explanation, ...(table?.headers ?? []), ...(table?.rows?.flat?.() ?? [])].join(" ");
}

const card = quantV4QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DI-010");
assert(card, "DI-010 is missing from the shared Quant V4 Question Studio package list.");
assert(card.enabled, "DI-010 package card must be enabled for controlled review.");
assert(card.cpIds.includes(DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID), "DI-010 package card lost its canonical problem id.");
assert(card.runtimeMode === DI010_QUESTION_STUDIO_RUNTIME_MODE, "DI-010 package card exposes the wrong runtime mode.");
assert(card.questionBankStatus === "NOT_STORED" && card.questionBankWritable === false, "DI-010 must remain outside Question Bank writes.");
assert(card.testEligibility === "INELIGIBLE" && card.testEligible === false && card.mockTestEligible === false, "DI-010 must remain ineligible for tests and mocks.");
assert(card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false, "DI-010 publication locks drifted.");
assert(["en", "hi", "pa"].every((language) => card.supportedLanguages.includes(language as any)), "DI-010 package card must expose approved English, Hindi and Punjabi controlled-review languages.");

const seen = new Set<string>();
for (const descriptor of DI010_PERMANENT_QLS) {
  const request = {
    packageId: "DI-010",
    canonicalProblemId: DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    language: "en",
    count: 1,
    seed: `DI010-QS-INTEGRATION-${descriptor.qlId}`,
    examProfile: "SSC_CGL_TIER_II",
  } as const;
  const first = await generateDi010QuestionStudioBatch(request);
  const replay = await generateDi010QuestionStudioBatch(request);
  assert(first.questions.length === 1 && replay.questions.length === 1, `${descriptor.qlId} did not generate exactly one preview.`);
  const question = first.questions[0] as Record<string, any>;
  const replayQuestion = replay.questions[0] as Record<string, any>;
  assert(question.packageId === "DI-010", `${descriptor.qlId} routed to the wrong DI package.`);
  assert(question.questionLanguageId === descriptor.qlId && question.permanentQlId === descriptor.qlId, `${descriptor.qlId} lost permanent QL identity.`);
  assert(question.taskKind === descriptor.taskKind, `${descriptor.qlId} drifted from ${descriptor.taskKind}.`);
  assert(question.difficulty === descriptor.difficulty, `${descriptor.qlId} drifted from ${descriptor.difficulty}.`);
  assert(Array.isArray(question.options) && question.options.length === 4 && new Set(question.options).size === 4, `${descriptor.qlId} has invalid options.`);
  assert(question.options[question.correctIndex] === question.answer, `${descriptor.qlId} correct index does not point to the answer.`);
  assert(!/\d+\.\d+/u.test(previewLearnerText(question)), `${descriptor.qlId} exposes decimal learner-facing values.`);
  assert(Array.isArray(question.stimulusSvgs) && question.stimulusSvgs.length === 1 && question.stimulusSvgs[0].includes("<svg"), `${descriptor.qlId} is missing its frequency-polygon stimulus SVG.`);
  assert(question.stimulusSvgs[0].includes('data-frequency-polygon="true"') && question.stimulusSvgs[0].includes('data-di-presentation-layer="shared"'), `${descriptor.qlId} bypassed the shared DI polygon presentation layer.`);
  assert(!("svg" in question.stimulus), `${descriptor.qlId} re-embedded SVG into semantic stimulus data.`);
  assert(question.releaseId === DI010_PERMANENT_RELEASE_ID && question.runtimeMode === DI010_QUESTION_STUDIO_RUNTIME_MODE, `${descriptor.qlId} lost release/runtime authority.`);
  assert(question.questionBankStatus === "NOT_STORED" && question.questionBankWritable === false && question.testEligibility === "INELIGIBLE", `${descriptor.qlId} lifecycle lock drifted.`);
  assert(question.mockTestEligible === false && question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `${descriptor.qlId} publication lock drifted.`);
  const projection = (item: Record<string, any>) => ({ stem: item.stem, options: item.options, correctIndex: item.correctIndex, answer: item.answer, stimulus: item.stimulus, stimulusSvgs: item.stimulusSvgs, taskKind: item.taskKind, difficulty: item.difficulty });
  assert(JSON.stringify(projection(question)) === JSON.stringify(projection(replayQuestion)), `${descriptor.qlId} is not deterministic for a fixed seed.`);
  seen.add(descriptor.qlId);
}
assert(seen.size === 13, "DI-010 permanent integration did not exercise all 13 QLs.");

const shared = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-010",
  canonicalProblemId: DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  language: "en",
  count: 13,
  seed: "DI010-SHARED-ADAPTER-MIXED",
  exam: "SSC CGL Tier II",
});
assert(shared.questions.length === 13, "Shared Quant V4 adapter did not route DI-010 generation.");
assert(new Set(shared.questions.map((question) => question.questionLanguageId)).size === 13, "A 13-question mixed DI-010 batch must cover all permanent QLs once.");
assert(shared.questions.every((question) => question.packageId === "DI-010" && question.questionBankWritable === false && question.testEligible === false), "Shared adapter widened DI-010 lifecycle authority.");

for (const language of ["hi", "pa"] as const) {
  const localized = await quantV4QuestionStudioAdapter.generate({
    packageId: "DI-010",
    canonicalProblemId: DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    language,
    count: 13,
    seed: `DI010-MULTILINGUAL-QS-${language}`,
    exam: "SSC CGL Tier II",
  });
  assert(localized.questions.length === 13, `DI-010 ${language} controlled review did not generate all 13 permanent QLs.`);
  assert(new Set(localized.questions.map((question) => question.questionLanguageId)).size === 13, `DI-010 ${language} batch did not cover all permanent QLs.`);
  for (const raw of localized.questions) {
    const question = raw as Record<string, any>;
    assert(question.language === language, `DI-010 ${language} question lost requested language.`);
    assert(question.reviewStatus === "MULTILINGUAL_FROZEN", `DI-010 ${language} question is not frozen multilingual authority.`);
    assert(question.releaseId === DI010_LOCALIZATION_RELEASE_ID, `DI-010 ${language} question lost localization release identity.`);
    assert(!/\d+\.\d+/u.test(previewLearnerText(question)), `DI-010 ${language} exposes decimal learner-facing values.`);
    assert(question.questionBankWritable === false && question.testEligible === false && question.mockTestEligible === false, `DI-010 ${language} widened learner lifecycle authority.`);
    assert(question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `DI-010 ${language} widened publication authority.`);
    const text = previewLearnerText(question);
    assert(!/[A-Za-z]/u.test(text), `DI-010 ${language} learner surface leaks Roman text: ${text}`);
    if (language === "hi") assert(/[\u0900-\u097F]/u.test(text), "DI-010 Hindi Question Studio surface lacks Devanagari.");
    else assert(/[\u0A00-\u0A7F]/u.test(text), "DI-010 Punjabi Question Studio surface lacks Gurmukhi.");
  }
}

const explicit = await quantV4QuestionStudioAdapter.generate({ questionLanguageId: "DI-QL-014", language: "en", count: 1, seed: "DI010-ROUTING-GUARD", exam: "SSC CGL Tier I" });
assert(explicit.questions[0]?.packageId === "DI-010", "DI-QL-014 was intercepted by an older DI package selector.");

console.log(JSON.stringify({ status: "PASS_DI_010_QUESTION_STUDIO_MULTILINGUAL_CONTROLLED_REVIEW", releaseId: DI010_PERMANENT_RELEASE_ID, runtimeMode: DI010_QUESTION_STUDIO_RUNTIME_MODE, permanentQlCount: DI010_PERMANENT_QLS.length, questionStudioDiscoverable: true, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false }));
