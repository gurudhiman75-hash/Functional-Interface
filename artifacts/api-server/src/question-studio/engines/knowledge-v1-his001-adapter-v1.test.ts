import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import {
  HIS_001_QUESTION_STUDIO_CORPUS_V1,
  HIS_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  HIS_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isHis001QuestionStudioRequestV1,
  knowledgeV1His001QuestionStudioAdapterV1,
} from "./knowledge-v1-his001-adapter-v1";

const pkg = HIS_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.packageId, "HIS-001");
assert.equal(pkg.subject, "Static GK");
assert.equal(pkg.topic, "Indian History");
assert.equal(pkg.subtopic, "Complete Chapter");
assert.equal(pkg.enabled, true);
assert.equal(pkg.cpIds?.length, 24);
assert.equal(new Set(pkg.cpIds).size, 24);
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankStatus, "NOT_STORED");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.cpCount, 24);
assert.equal(pkg.metadata?.qlCount, 239);
assert.equal(pkg.metadata?.questionsPerLanguage, 1434);
assert.equal(pkg.metadata?.multilingualSurfaceCount, 4302);
assert.equal(pkg.metadata?.payloadsPerPermanentQlPerLanguage, 6);
assert.equal(pkg.metadata?.registrationAuthorityId, HIS_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);

for (const language of ["en", "hi", "pa"] as const) {
  const corpus = HIS_001_QUESTION_STUDIO_CORPUS_V1[language];
  assert.equal(corpus.length, 1434, `${language}: corpus count`);
  assert.equal(new Set(corpus.map((q) => q.questionId)).size, 1434, `${language}: unique ids`);
  assert.equal(new Set(corpus.map((q) => q.cpId)).size, 24, `${language}: CP count`);
  assert.equal(new Set(corpus.map((q) => q.qlId)).size, 239, `${language}: QL count`);
}

assert.equal(isHis001QuestionStudioRequestV1({ packageId: "HIS-001" }), true);
assert.equal(
  isHis001QuestionStudioRequestV1({
    subject: "Static GK",
    topic: "Indian History",
    subtopic: "Complete Chapter",
  }),
  true,
);
assert.equal(isHis001QuestionStudioRequestV1({ packageId: "ENV-001" }), false);

const compositeMatches = listQuestionStudioPackages().filter((entry) => entry.packageId === "HIS-001");
assert.equal(compositeMatches.length, 1);
assert.deepEqual(compositeMatches[0]?.supportedLanguages, ["en", "hi", "pa"]);

const baseRequest = {
  packageId: "HIS-001",
  difficulty: "Mixed" as const,
  count: 24,
  seed: "his001-question-studio-final-integration",
  runtimeMode: "review-only",
};

const en = await generateQuestionStudioQuestions({ ...baseRequest, language: "en" });
const enReplay = await generateQuestionStudioQuestions({ ...baseRequest, language: "en" });
const hi = await generateQuestionStudioQuestions({ ...baseRequest, language: "hi" });
const pa = await generateQuestionStudioQuestions({ ...baseRequest, language: "pa" });

assert.deepEqual(en, enReplay);
for (const result of [en, hi, pa]) {
  assert.equal(result.engineId, "knowledge-v1");
  assert.equal(result.questions.length, 24);
  assert.equal(new Set(result.questions.map((q) => q.questionId)).size, 24);
  assert.equal(result.generationContext?.packageId, "HIS-001");
  assert.equal(result.generationContext?.reviewOnly, true);
  assert.equal(result.generationContext?.questionBankStatus, "NOT_STORED");
  assert.equal(result.generationContext?.questionBankWritable, false);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.mockTestEligible, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);

  for (const question of result.questions) {
    assert.equal(question.packageId, "HIS-001");
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, true);
    assert.equal(question.readOnly, true);
    assert.equal(question.productionReleased, false);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(
      getGeneratedItemApprovalDisposition({
        ...question,
        generationContext: result.generationContext,
      }).mode,
      "review_only",
    );
  }
}

const sourceIds = (result: typeof en) => result.questions.map((q) => String(q.sourceQuestionId));
assert.deepEqual(sourceIds(hi), sourceIds(en), "Hindi seeded batch must preserve English source identities");
assert.deepEqual(sourceIds(pa), sourceIds(en), "Punjabi seeded batch must preserve English source identities");
assert.equal(hi.questions.every((q) => q.language === "hi" && q.locale === "hi-IN"), true);
assert.equal(pa.questions.every((q) => q.language === "pa" && q.locale === "pa-IN"), true);

const cpResult = await knowledgeV1His001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "pa",
  canonicalProblemId: "HIS-CP-024",
  count: 12,
  seed: "his001-cp024-filter",
});
assert.equal(cpResult.questions.length, 12);
assert.equal(cpResult.questions.every((q) => q.cpId === "HIS-CP-024"), true);
assert.equal(cpResult.questions.every((q) => q.language === "pa"), true);

const compactCpResult = await knowledgeV1His001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "hi",
  canonicalProblemId: "HIS-CP024",
  count: 6,
  seed: "his001-cp024-compact-filter",
});
assert.equal(compactCpResult.questions.every((q) => q.cpId === "HIS-CP-024"), true);

const firstQlId = HIS_001_QUESTION_STUDIO_CORPUS_V1.en[0]!.qlId;
const qlResult = await knowledgeV1His001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "hi",
  patternId: firstQlId,
  count: 6,
  seed: "his001-first-ql-filter",
});
assert.equal(qlResult.questions.length, 6);
assert.equal(qlResult.questions.every((q) => q.qlId === firstQlId), true);
assert.equal(qlResult.questions.every((q) => q.language === "hi"), true);

const hard = await knowledgeV1His001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "en",
  difficulty: "Hard",
  count: 12,
  seed: "his001-hard-filter",
});
assert.equal(hard.questions.length, 12);
assert.equal(hard.questions.every((q) => q.difficulty === "Hard"), true);

await assert.rejects(
  knowledgeV1His001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "HIS-CP-999",
  }),
  /Unknown HIS-001 selector/i,
);
await assert.rejects(
  knowledgeV1His001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    runtimeMode: "bank-only",
  }),
  /only supports review-only runtime/i,
);

console.log(
  "[HIS-001-QUESTION-STUDIO] PASS CPs=24 QLs=239 questionsPerLanguage=1434 languages=en,hi,pa review-only",
);
