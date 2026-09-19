import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";
import {
  DI009_PERMANENT_QLS,
  DI009_PERMANENT_RELEASE_ID,
} from "./permanent-ql-registry";
import {
  DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI009_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi009QuestionStudioBatch,
  isDi009QuestionStudioRequest,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(!isDi009QuestionStudioRequest({ questionLanguageId: "DI-QL-014" }), "DI-009 must not intercept DI-010 QLs.");
assert(!isDi009QuestionStudioRequest({ questionLanguageId: "DI-QL-085" }), "DI-009 must not intercept DI-008 QLs.");

const card = quantV4QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DI-009");
assert(card, "DI-009 is missing from the shared Quant V4 Question Studio package list.");
assert(card.enabled, "DI-009 package card must be enabled for controlled review.");
assert(card.cpIds.includes(DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID), "DI-009 package card lost its canonical problem id.");
assert(card.runtimeMode === DI009_QUESTION_STUDIO_RUNTIME_MODE, "DI-009 package card exposes the wrong runtime mode.");
assert(card.questionBankStatus === "NOT_STORED" && card.questionBankWritable === false, "DI-009 must remain outside Question Bank writes.");
assert(card.testEligibility === "INELIGIBLE" && card.testEligible === false && card.mockTestEligible === false, "DI-009 must remain ineligible for tests and mocks.");
assert(card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false, "DI-009 publication locks drifted.");

const seen = new Set<string>();
for (const descriptor of DI009_PERMANENT_QLS) {
  const request = {
    packageId: "DI-009",
    canonicalProblemId: DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    language: "en",
    count: 1,
    seed: `DI009-QS-INTEGRATION-${descriptor.qlId}`,
    examProfile: "SSC_CGL_TIER_II",
  } as const;
  const first = await generateDi009QuestionStudioBatch(request);
  const replay = await generateDi009QuestionStudioBatch(request);
  assert(first.questions.length === 1 && replay.questions.length === 1, `${descriptor.qlId} did not generate exactly one preview.`);
  const question = first.questions[0] as Record<string, any>;
  const replayQuestion = replay.questions[0] as Record<string, any>;
  assert(question.questionLanguageId === descriptor.qlId && question.permanentQlId === descriptor.qlId, `${descriptor.qlId} lost permanent QL identity.`);
  assert(question.taskKind === descriptor.taskKind, `${descriptor.qlId} drifted from ${descriptor.taskKind}.`);
  assert(question.difficulty === descriptor.difficulty, `${descriptor.qlId} drifted from ${descriptor.difficulty}.`);
  assert(Array.isArray(question.options) && question.options.length === 4 && new Set(question.options).size === 4, `${descriptor.qlId} has invalid options.`);
  assert(question.options[question.correctIndex] === question.answer, `${descriptor.qlId} correct index does not point to the answer.`);
  assert(Array.isArray(question.stimulusSvgs) && question.stimulusSvgs.length === 1 && question.stimulusSvgs[0].includes("<svg"), `${descriptor.qlId} is missing its histogram stimulus SVG.`);
  assert(question.stimulusSvgs[0].includes('data-di-presentation-layer="shared"'), `${descriptor.qlId} bypassed the shared DI presentation layer.`);
  assert(!("svg" in question.stimulus), `${descriptor.qlId} re-embedded SVG into semantic stimulus data.`);
  assert(question.releaseId === DI009_PERMANENT_RELEASE_ID && question.runtimeMode === DI009_QUESTION_STUDIO_RUNTIME_MODE, `${descriptor.qlId} lost release/runtime authority.`);
  assert(question.questionBankStatus === "NOT_STORED" && question.questionBankWritable === false && question.testEligibility === "INELIGIBLE", `${descriptor.qlId} lifecycle lock drifted.`);
  assert(question.mockTestEligible === false && question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `${descriptor.qlId} publication lock drifted.`);
  const projection = (item: Record<string, any>) => ({ stem: item.stem, options: item.options, correctIndex: item.correctIndex, answer: item.answer, stimulus: item.stimulus, stimulusSvgs: item.stimulusSvgs, taskKind: item.taskKind, difficulty: item.difficulty });
  assert(JSON.stringify(projection(question)) === JSON.stringify(projection(replayQuestion)), `${descriptor.qlId} is not deterministic for a fixed seed.`);
  seen.add(descriptor.qlId);
}
assert(seen.size === 13, "DI-009 permanent integration did not exercise all 13 QLs.");

const shared = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-009",
  canonicalProblemId: DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  language: "en",
  count: 13,
  seed: "DI009-SHARED-ADAPTER-MIXED",
  exam: "SSC CGL Tier II",
});
assert(shared.questions.length === 13, "Shared Quant V4 adapter did not route DI-009 generation.");
assert(new Set(shared.questions.map((question) => question.questionLanguageId)).size === 13, "A 13-question mixed DI-009 batch must cover all permanent QLs once.");
assert(shared.questions.every((question) => question.packageId === "DI-009" && question.questionBankWritable === false && question.testEligible === false), "Shared adapter widened DI-009 lifecycle authority.");

console.log(JSON.stringify({
  status: "PASS_DI_009_QUESTION_STUDIO_CONTROLLED_REVIEW",
  releaseId: DI009_PERMANENT_RELEASE_ID,
  runtimeMode: DI009_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlCount: DI009_PERMANENT_QLS.length,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
