import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";
import { DI006_PERMANENT_QLS, DI006_PERMANENT_RELEASE_ID } from "./permanent-ql-registry";
import {
  DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI006_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi006QuestionStudioBatch,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const card = quantV4QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DI-006");
assert(card, "DI-006 is missing from the shared Quant V4 Question Studio package list.");
assert(card.enabled, "DI-006 package card must be enabled for controlled review.");
assert(card.cpIds.includes(DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID), "DI-006 package card lost its canonical problem id.");
assert(card.runtimeMode === DI006_QUESTION_STUDIO_RUNTIME_MODE, "DI-006 package card exposes the wrong runtime mode.");
assert(card.questionBankStatus === "NOT_STORED" && card.questionBankWritable === false, "DI-006 must remain outside Question Bank writes.");
assert(card.testEligibility === "INELIGIBLE" && card.testEligible === false && card.mockTestEligible === false, "DI-006 must remain ineligible for tests and mocks.");
assert(card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false, "DI-006 publication locks drifted.");

const seen = new Set<string>();
for (const descriptor of DI006_PERMANENT_QLS) {
  const request = {
    packageId: "DI-006",
    canonicalProblemId: DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    language: "en",
    count: 1,
    seed: `DI006-QS-INTEGRATION-${descriptor.qlId}`,
    examProfile: "SSC_CGL_TIER_I",
  } as const;

  const first = await generateDi006QuestionStudioBatch(request);
  const replay = await generateDi006QuestionStudioBatch(request);
  assert(first.questions.length === 1 && replay.questions.length === 1, `${descriptor.qlId} did not generate exactly one preview.`);

  const question = first.questions[0] as Record<string, any>;
  const replayQuestion = replay.questions[0] as Record<string, any>;
  assert(question.packageId === "DI-006", `${descriptor.qlId} routed to the wrong DI package.`);
  assert(question.questionLanguageId === descriptor.qlId && question.permanentQlId === descriptor.qlId, `${descriptor.qlId} lost permanent QL identity.`);
  assert(question.taskKind === descriptor.taskKind, `${descriptor.qlId} drifted from ${descriptor.taskKind}.`);
  assert(question.difficulty === descriptor.difficulty, `${descriptor.qlId} drifted from ${descriptor.difficulty}.`);
  assert(Array.isArray(question.options) && question.options.length === 4 && new Set(question.options).size === 4, `${descriptor.qlId} has invalid SSC options.`);
  assert(question.options[question.correctIndex] === question.answer, `${descriptor.qlId} correct index does not point to the answer.`);
  assert(question.stimulus?.kind === "CASELET" && Array.isArray(question.stimulus?.relations) && question.stimulus.relations.length === 3, `${descriptor.qlId} is missing its semantic caselet stimulus.`);
  assert(question.releaseId === DI006_PERMANENT_RELEASE_ID && question.runtimeMode === DI006_QUESTION_STUDIO_RUNTIME_MODE, `${descriptor.qlId} lost release/runtime authority.`);
  assert(question.questionBankStatus === "NOT_STORED" && question.questionBankWritable === false && question.testEligibility === "INELIGIBLE", `${descriptor.qlId} lifecycle lock drifted.`);
  assert(question.mockTestEligible === false && question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `${descriptor.qlId} publication lock drifted.`);
  if (descriptor.difficulty === "Hard") {
    assert(Number(question.richExplanation?.steps?.length) >= 2, `${descriptor.qlId} lost its approved multi-step explanation.`);
  }

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
assert(seen.size === 12, "DI-006 permanent integration did not exercise all 12 QLs.");

const shared = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-006",
  canonicalProblemId: DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  language: "en",
  count: 12,
  seed: "DI006-SHARED-ADAPTER-MIXED",
  exam: "SSC CGL Tier I",
});
assert(shared.questions.length === 12, "Shared Quant V4 adapter did not route DI-006 generation.");
assert(new Set(shared.questions.map((question) => question.questionLanguageId)).size === 12, "A 12-question mixed DI-006 batch must cover all permanent QLs once.");
assert(shared.questions.every((question) => question.packageId === "DI-006" && question.questionBankWritable === false && question.testEligible === false), "Shared adapter widened DI-006 lifecycle authority.");

const banking = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-006",
  language: "en",
  count: 12,
  seed: "DI006-BANKING-OPTION-SHAPE",
  exam: "Banking Prelims",
});
assert(banking.questions.length === 12, "Banking DI-006 mixed batch did not generate twelve questions.");
assert(banking.questions.every((question) => Array.isArray(question.options) && question.options.length === 5 && new Set(question.options).size === 5), "Banking DI-006 must expose five unique options per question.");

const explicit = await quantV4QuestionStudioAdapter.generate({
  questionLanguageId: "DI-QL-061",
  language: "en",
  count: 1,
  seed: "DI006-ROUTING-GUARD",
  exam: "SSC CGL Tier I",
});
assert(explicit.questions[0]?.packageId === "DI-006", "DI-QL-061 was intercepted by another DI package selector.");

console.log(JSON.stringify({
  status: "PASS_DI_006_QUESTION_STUDIO_CONTROLLED_REVIEW",
  releaseId: DI006_PERMANENT_RELEASE_ID,
  runtimeMode: DI006_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlCount: DI006_PERMANENT_QLS.length,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
