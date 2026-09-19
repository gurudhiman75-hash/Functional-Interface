import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";
import { DI008_PERMANENT_QLS, DI008_PERMANENT_RELEASE_ID } from "./permanent-ql-registry";
import {
  DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI008_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi008QuestionStudioBatch,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const card = quantV4QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DI-008");
assert(card, "DI-008 is missing from the shared Quant V4 Question Studio package list.");
assert(card.enabled, "DI-008 package card must be enabled for controlled review.");
assert(card.cpIds.includes(DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID), "DI-008 package card lost its canonical problem id.");
assert(card.runtimeMode === DI008_QUESTION_STUDIO_RUNTIME_MODE, "DI-008 package card exposes the wrong runtime mode.");
assert(card.questionBankStatus === "NOT_STORED" && card.questionBankWritable === false, "DI-008 must remain outside Question Bank writes.");
assert(card.testEligibility === "INELIGIBLE" && card.testEligible === false && card.mockTestEligible === false, "DI-008 must remain ineligible for tests and mocks.");
assert(card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false, "DI-008 publication locks drifted.");

const seen = new Set<string>();
for (const descriptor of DI008_PERMANENT_QLS) {
  const request = {
    packageId: "DI-008",
    canonicalProblemId: DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    language: "en",
    count: 1,
    seed: `DI008-QS-INTEGRATION-${descriptor.qlId}`,
    examProfile: "BANKING_PRELIMS",
  } as const;

  const first = await generateDi008QuestionStudioBatch(request);
  const replay = await generateDi008QuestionStudioBatch(request);
  assert(first.questions.length === 1 && replay.questions.length === 1, `${descriptor.qlId} did not generate exactly one preview.`);

  const question = first.questions[0] as Record<string, any>;
  const replayQuestion = replay.questions[0] as Record<string, any>;
  assert(question.packageId === "DI-008", `${descriptor.qlId} routed to the wrong DI package.`);
  assert(question.questionLanguageId === descriptor.qlId && question.permanentQlId === descriptor.qlId, `${descriptor.qlId} lost permanent QL identity.`);
  assert(question.taskKind === descriptor.taskKind, `${descriptor.qlId} drifted from ${descriptor.taskKind}.`);
  assert(question.difficulty === descriptor.difficulty, `${descriptor.qlId} drifted from ${descriptor.difficulty}.`);
  assert(Array.isArray(question.options) && question.options.length === 5 && new Set(question.options).size === 5, `${descriptor.qlId} has invalid Banking options.`);
  assert(question.options[question.correctIndex] === question.answer, `${descriptor.qlId} correct index does not point to the answer.`);
  assert(question.stimulus?.kind === "ARITHMETIC_TABLE" && Array.isArray(question.stimulus?.rows) && question.stimulus.rows.length === 5 && question.stimulus.rows.every((row: any) => typeof row.label === "string" && Number.isFinite(row.unitsPrevious) && Number.isFinite(row.unitsCurrent) && Number.isFinite(row.costPerUnit) && Number.isFinite(row.sellingPricePerUnit)), `${descriptor.qlId} is missing its semantic arithmetic-table stimulus.`);
  assert(question.releaseId === DI008_PERMANENT_RELEASE_ID && question.runtimeMode === DI008_QUESTION_STUDIO_RUNTIME_MODE, `${descriptor.qlId} lost release/runtime authority.`);
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
assert(seen.size === 12, "DI-008 permanent integration did not exercise all 12 QLs.");

const shared = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-008",
  canonicalProblemId: DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  language: "en",
  count: 12,
  seed: "DI008-SHARED-ADAPTER-MIXED",
  exam: "Banking Prelims",
});
assert(shared.questions.length === 12, "Shared Quant V4 adapter did not route DI-008 generation.");
assert(new Set(shared.questions.map((question) => question.questionLanguageId)).size === 12, "A 12-question mixed DI-008 batch must cover all permanent QLs once.");
assert(shared.questions.every((question) => question.packageId === "DI-008" && question.questionBankWritable === false && question.testEligible === false), "Shared adapter widened DI-008 lifecycle authority.");

const banking = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-008",
  language: "en",
  count: 12,
  seed: "DI008-BANKING-OPTION-SHAPE",
  exam: "Banking Mains",
});
assert(banking.questions.length === 12, "Banking Mains DI-008 mixed batch did not generate twelve questions.");
assert(banking.questions.every((question) => Array.isArray(question.options) && question.options.length === 5 && new Set(question.options).size === 5), "Banking Mains DI-008 must expose five unique options per question.");

const explicit = await quantV4QuestionStudioAdapter.generate({
  questionLanguageId: "DI-QL-085",
  language: "en",
  count: 1,
  seed: "DI008-ROUTING-GUARD",
  exam: "Banking Prelims",
});
assert(explicit.questions[0]?.packageId === "DI-008", "DI-QL-085 was intercepted by another DI package selector.");

console.log(JSON.stringify({
  status: "PASS_DI_008_QUESTION_STUDIO_CONTROLLED_REVIEW",
  releaseId: DI008_PERMANENT_RELEASE_ID,
  runtimeMode: DI008_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlCount: DI008_PERMANENT_QLS.length,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
