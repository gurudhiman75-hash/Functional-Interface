import { quantV4QuestionStudioAdapter } from "../../../../question-studio/engines/quant-v4-adapter";
import { DI002_PERMANENT_QLS, DI002_PERMANENT_RELEASE_ID } from "./permanent-ql-registry";
import { DI002_LOCALIZATION_RELEASE_ID } from "./localization-review-v1";
import {
  DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI002_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi002QuestionStudioBatch,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const card = quantV4QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DI-002");
assert(card, "DI-002 is missing from the shared Quant V4 Question Studio package list.");
assert(card.enabled, "DI-002 package card must be enabled for controlled review.");
assert(card.cpIds.includes(DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID), "DI-002 package card lost its canonical problem id.");
assert(card.runtimeMode === DI002_QUESTION_STUDIO_RUNTIME_MODE, "DI-002 package card exposes the wrong runtime mode.");
assert(card.questionBankStatus === "NOT_STORED" && card.questionBankWritable === false, "DI-002 must remain outside Question Bank writes.");
assert(card.testEligibility === "INELIGIBLE" && card.testEligible === false && card.mockTestEligible === false, "DI-002 must remain ineligible for tests and mocks.");
assert(card.publiclyPublishable === false && card.automaticStudentPublication === false && card.productionReleaseAuthorized === false, "DI-002 publication locks drifted.");
assert(["en", "hi", "pa"].every((language) => card.supportedLanguages.includes(language as any)), "DI-002 package card must expose approved English, Hindi and Punjabi controlled-review languages.");

const seen = new Set<string>();
for (const descriptor of DI002_PERMANENT_QLS) {
  const request = {
    packageId: "DI-002",
    canonicalProblemId: DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    language: "en",
    count: 1,
    seed: `DI002-QS-INTEGRATION-${descriptor.qlId}`,
    examProfile: "SSC_CGL_TIER_I",
  } as const;
  const first = await generateDi002QuestionStudioBatch(request);
  const replay = await generateDi002QuestionStudioBatch(request);
  assert(first.questions.length === 1 && replay.questions.length === 1, `${descriptor.qlId} did not generate exactly one preview.`);

  const question = first.questions[0] as Record<string, any>;
  const replayQuestion = replay.questions[0] as Record<string, any>;
  assert(question.packageId === "DI-002", `${descriptor.qlId} routed to the wrong DI package.`);
  assert(question.questionLanguageId === descriptor.qlId && question.permanentQlId === descriptor.qlId, `${descriptor.qlId} lost permanent QL identity.`);
  assert(question.taskKind === descriptor.taskKind, `${descriptor.qlId} drifted from ${descriptor.taskKind}.`);
  assert(question.difficulty === descriptor.difficulty, `${descriptor.qlId} drifted from ${descriptor.difficulty}.`);
  assert(Array.isArray(question.options) && question.options.length === 4 && new Set(question.options).size === 4, `${descriptor.qlId} has invalid SSC options.`);
  assert(question.options[question.correctIndex] === question.answer, `${descriptor.qlId} correct index does not point to the answer.`);
  assert(question.stimulus?.kind === "TABLE" && Array.isArray(question.stimulus?.rows) && question.stimulus.rows.length === 5, `${descriptor.qlId} is missing its five-row table stimulus.`);
  assert(question.stimulus.rows.filter((row: Record<string, unknown>) => row.applicants === "?").length === 1, `${descriptor.qlId} lost the one-missing-Applicants contract.`);
  assert(question.releaseId === DI002_PERMANENT_RELEASE_ID && question.runtimeMode === DI002_QUESTION_STUDIO_RUNTIME_MODE, `${descriptor.qlId} lost release/runtime authority.`);
  assert(question.reviewStatus === "ENGLISH_REVIEW_APPROVED", `${descriptor.qlId} lost approved editorial status.`);
  assert(question.questionBankStatus === "NOT_STORED" && question.questionBankWritable === false && question.testEligibility === "INELIGIBLE", `${descriptor.qlId} lifecycle lock drifted.`);
  assert(question.mockTestEligible === false && question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `${descriptor.qlId} publication lock drifted.`);
  assert(!new Set(["DIRECT_SELECTED_VALUE", "DIRECT_SELECTION_RATE", "SELECTION_RATE_POINT_GAP"]).has(question.taskKind), `${descriptor.qlId} reintroduced a removed trivial family.`);
  if (question.difficulty === "Easy") assert(question.richExplanation?.steps?.length >= 2, `${descriptor.qlId} Easy route collapsed to direct lookup.`);
  if (question.difficulty === "Medium") assert(question.richExplanation?.steps?.length >= 2, `${descriptor.qlId} Medium route lost derived/aggregate working.`);
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
assert(seen.size === 12, "DI-002 permanent integration did not exercise all 12 QLs.");

const shared = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-002",
  canonicalProblemId: DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  language: "en",
  count: 12,
  seed: "DI002-SHARED-ADAPTER-MIXED",
  exam: "SSC CGL Tier I",
});
assert(shared.questions.length === 12, "Shared Quant V4 adapter did not route DI-002 generation.");
assert(new Set(shared.questions.map((question) => question.questionLanguageId)).size === 12, "A 12-question mixed DI-002 batch must cover all permanent QLs once.");
assert(shared.questions.every((question) => question.packageId === "DI-002" && question.questionBankWritable === false && question.testEligible === false), "Shared adapter widened DI-002 lifecycle authority.");

for (const language of ["hi", "pa"] as const) {
  const localized = await quantV4QuestionStudioAdapter.generate({
    packageId: "DI-002",
    canonicalProblemId: DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    language,
    count: 12,
    seed: `DI002-MULTILINGUAL-QS-${language}`,
    exam: "SSC CGL Tier I",
  });
  assert(localized.questions.length === 12, `DI-002 ${language} controlled review did not generate all 12 permanent QLs.`);
  assert(new Set(localized.questions.map((question) => question.questionLanguageId)).size === 12, `DI-002 ${language} batch did not cover all permanent QLs.`);

  for (const raw of localized.questions) {
    const question = raw as Record<string, any>;
    const learnerText = [
      question.stimulus?.title,
      question.stimulus?.instruction,
      question.stimulus?.rowHeader,
      ...(question.stimulus?.columns ?? []),
      ...(question.stimulus?.rows ?? []).map((row: any) => row.label),
      question.stem,
      ...(question.options ?? []),
      question.answer,
      question.explanation,
    ].join(" ");

    assert(question.language === language, `DI-002 ${language} question lost requested language.`);
    assert(question.reviewStatus === "MULTILINGUAL_FROZEN", `DI-002 ${language} question is not frozen multilingual authority.`);
    assert(question.releaseId === DI002_LOCALIZATION_RELEASE_ID, `DI-002 ${language} question lost localization release identity.`);
    assert(question.questionBankWritable === false && question.testEligible === false && question.mockTestEligible === false, `DI-002 ${language} widened learner lifecycle authority.`);
    assert(question.publiclyPublishable === false && question.automaticStudentPublication === false && question.productionReleaseAuthorized === false, `DI-002 ${language} widened publication authority.`);
    assert(Array.isArray(question.options) && question.options.length === 4 && new Set(question.options).size === 4, `DI-002 ${language} SSC options drifted.`);
    assert(question.options[question.correctIndex] === question.answer, `DI-002 ${language} localized answer-index binding failed.`);
    assert(question.stimulus?.kind === "TABLE" && question.stimulus.rows.length === 5, `DI-002 ${language} table stimulus drifted.`);
    assert(question.stimulus.rows.filter((row: any) => row.applicants === "?").length === 1, `DI-002 ${language} lost the one-missing-Applicants contract.`);
    assert(!/[A-Za-z]/u.test(learnerText), `DI-002 ${language} learner surface leaks Roman text: ${learnerText}`);
    if (language === "hi") {
      assert(/[\u0904-\u0939\u093C-\u094D\u0950-\u0961\u0971-\u097F]/u.test(learnerText), "DI-002 Hindi Question Studio surface lacks Devanagari.");
      assert(!/[\u0A05-\u0A39\u0A3C-\u0A4D\u0A59-\u0A5E]/u.test(learnerText), `DI-002 Hindi Question Studio surface leaks Gurmukhi: ${learnerText}`);
      assert(!/स्तंभ/u.test(learnerText), `DI-002 Hindi learner surface leaked banned terminology: ${learnerText}`);
    } else {
      assert(/[\u0A05-\u0A39\u0A3C-\u0A4D\u0A59-\u0A5E]/u.test(learnerText), "DI-002 Punjabi Question Studio surface lacks Gurmukhi.");
      assert(!/[\u0904-\u0939\u093C-\u094D\u0950-\u0961\u0971-\u097F]/u.test(learnerText), `DI-002 Punjabi Question Studio surface leaks Devanagari: ${learnerText}`);
    }
    assert(!/nearest whole percent|round to the nearest|निकटतम पूर्ण प्रतिशत|पूर्ण प्रतिशत तक पूर्णांकित|ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਾ ਪ੍ਰਤੀਸ਼ਤ|ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਤੱਕ ਗੋਲ/iu.test(learnerText), `DI-002 ${language} reintroduced explicit rounding instructions.`);
    assert(!new Set(["DIRECT_SELECTED_VALUE", "DIRECT_SELECTION_RATE", "SELECTION_RATE_POINT_GAP"]).has(question.taskKind), `DI-002 ${language} reintroduced a retired trivial family.`);
    if (question.difficulty === "Easy") {
      assert(["SELECTED_DIFFERENCE", "COMBINED_SELECTED"].includes(question.taskKind), `DI-002 ${language} Easy route stopped requiring arithmetic.`);
      assert(Number(question.richExplanation?.steps?.length) >= 2, `DI-002 ${language} Easy explanation collapsed to lookup.`);
    }
    if (question.difficulty === "Medium") {
      assert(Number(question.richExplanation?.steps?.length) >= 2, `DI-002 ${language} Medium explanation lost derived/aggregate working.`);
    }
    if (question.difficulty === "Hard") {
      assert(Number(question.richExplanation?.steps?.length) >= 3, `DI-002 ${language} Hard explanation lost multi-step reasoning.`);
    }
  }
}

const banking = await quantV4QuestionStudioAdapter.generate({
  packageId: "DI-002",
  language: "en",
  count: 12,
  seed: "DI002-BANKING-OPTION-SHAPE",
  exam: "Banking Prelims",
});
assert(banking.questions.length === 12, "Banking DI-002 mixed batch did not generate twelve questions.");
assert(banking.questions.every((question) => Array.isArray(question.options) && question.options.length === 5 && new Set(question.options).size === 5), "Banking DI-002 must expose five unique options per question.");

const explicit = await quantV4QuestionStudioAdapter.generate({
  questionLanguageId: "DI-QL-097",
  language: "en",
  count: 1,
  seed: "DI002-ROUTING-GUARD",
  exam: "SSC CGL Tier I",
});
assert(explicit.questions[0]?.packageId === "DI-002", "DI-QL-097 was intercepted by another DI package selector.");

console.log(JSON.stringify({
  status: "PASS_DI_002_QUESTION_STUDIO_MULTILINGUAL_CONTROLLED_REVIEW",
  releaseId: DI002_PERMANENT_RELEASE_ID,
  runtimeMode: DI002_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlCount: DI002_PERMANENT_QLS.length,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
