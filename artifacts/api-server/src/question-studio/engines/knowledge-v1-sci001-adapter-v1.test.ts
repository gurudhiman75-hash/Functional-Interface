import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import {
  SCI_001_QUESTION_STUDIO_CORPUS_V1,
  SCI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isSci001QuestionStudioRequestV1,
  knowledgeV1Sci001QuestionStudioAdapterV1,
} from "./knowledge-v1-sci001-adapter-v1";

const pkg = SCI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.packageId, "SCI-001");
assert.equal(pkg.subject, "Static GK");
assert.equal(pkg.topic, "General Science");
assert.equal(pkg.subtopic, "Complete Chapter");
assert.equal(pkg.enabled, true);
assert.equal(pkg.cpIds.length, 40);
assert.equal(new Set(pkg.cpIds).size, 40);
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
assert.equal(pkg.metadata?.cpCount, 40);
assert.equal(pkg.metadata?.questionsPerLanguage, 5280);
assert.equal(pkg.metadata?.multilingualSurfaceCount, 15840);
assert.ok(Number(pkg.metadata?.qlCount) > 0);

for (const language of ["en", "hi", "pa"] as const) {
  const corpus = SCI_001_QUESTION_STUDIO_CORPUS_V1[language];
  assert.equal(corpus.length, 5280, `${language}: corpus count`);
  assert.equal(new Set(corpus.map((q) => q.questionId)).size, 5280, `${language}: unique ids`);
  assert.equal(new Set(corpus.map((q) => q.cpId)).size, 40, `${language}: CP count`);
}

assert.equal(isSci001QuestionStudioRequestV1({ packageId: "SCI-001" }), true);
assert.equal(
  isSci001QuestionStudioRequestV1({
    subject: "Static GK",
    topic: "General Science",
    subtopic: "Complete Chapter",
  }),
  true,
);
assert.equal(isSci001QuestionStudioRequestV1({ packageId: "ENV-001" }), false);

const compositeMatches = listQuestionStudioPackages().filter((entry) => entry.packageId === "SCI-001");
assert.equal(compositeMatches.length, 1);
assert.deepEqual(compositeMatches[0]?.supportedLanguages, ["en", "hi", "pa"]);

const baseRequest = {
  packageId: "SCI-001",
  difficulty: "Mixed" as const,
  count: 20,
  seed: "sci001-question-studio-integration",
  runtimeMode: "review-only",
};

const en = await generateQuestionStudioQuestions({ ...baseRequest, language: "en" });
const enReplay = await generateQuestionStudioQuestions({ ...baseRequest, language: "en" });
const hi = await generateQuestionStudioQuestions({ ...baseRequest, language: "hi" });
const pa = await generateQuestionStudioQuestions({ ...baseRequest, language: "pa" });

assert.deepEqual(en, enReplay);
for (const result of [en, hi, pa]) {
  assert.equal(result.engineId, "knowledge-v1");
  assert.equal(result.questions.length, 20);
  assert.equal(new Set(result.questions.map((q) => q.questionId)).size, 20);
  assert.equal(result.generationContext?.packageId, "SCI-001");
  assert.equal(result.generationContext?.reviewOnly, true);
  assert.equal(result.generationContext?.questionBankStatus, "NOT_STORED");
  assert.equal(result.generationContext?.questionBankWritable, false);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.mockTestEligible, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);

  for (const question of result.questions) {
    assert.equal(question.packageId, "SCI-001");
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

const physics = await knowledgeV1Sci001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "pa",
  canonicalProblemId: "SCI-CP-001",
  count: 20,
  seed: "sci001-cp001-filter",
});
assert.equal(physics.questions.length, 20);
assert.equal(physics.questions.every((q) => q.cpId === "SCI-CP-001"), true);

const finalCp = await knowledgeV1Sci001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "hi",
  canonicalProblemId: "SCI-CP-040",
  count: 12,
  seed: "sci001-cp040-filter",
});
assert.equal(finalCp.questions.length, 12);
assert.equal(finalCp.questions.every((q) => q.cpId === "SCI-CP-040"), true);

const qlId = SCI_001_QUESTION_STUDIO_CORPUS_V1.en.find((q) => q.cpId === "SCI-CP-011")!.qlId;
const qlResult = await knowledgeV1Sci001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "pa",
  patternId: qlId,
  count: 4,
  seed: "sci001-chemistry-ql-filter",
});
assert.equal(qlResult.questions.length, 4);
assert.equal(qlResult.questions.every((q) => q.qlId === qlId), true);

const hard = await knowledgeV1Sci001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  language: "en",
  difficulty: "Hard",
  count: 12,
  seed: "sci001-hard-filter",
});
assert.equal(hard.questions.length, 12);
assert.equal(hard.questions.every((q) => q.difficulty === "Hard"), true);

await assert.rejects(
  knowledgeV1Sci001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "SCI-CP-999",
  }),
  /Unknown SCI-001 selector/i,
);

await assert.rejects(
  knowledgeV1Sci001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    runtimeMode: "bank-only",
  }),
  /only supports review-only runtime/i,
);

console.log("[SCI-001-QUESTION-STUDIO] PASS CPs=40 questionsPerLanguage=5280 languages=en,hi,pa review-only");
