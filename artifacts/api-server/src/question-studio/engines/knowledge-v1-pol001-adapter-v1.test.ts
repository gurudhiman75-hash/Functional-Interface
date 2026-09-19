import { strict as assert } from "node:assert";
import { listQuestionStudioPackages } from "../engine-registry";
import {
  POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  knowledgeV1Pol001QuestionStudioAdapterV1,
} from "./knowledge-v1-pol001-adapter-v1";

const pkg = POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(pkg.packageId, "POL-001");
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.enabled, true);
assert.equal(pkg.cpIds.length, 27);
assert.equal(new Set(pkg.cpIds).size, 27);
assert.deepEqual(pkg.supportedLanguages, ["en"]);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.qualificationExplanationAuditComplete, true);

const request = {
  packageId: POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  language: "en" as const,
  difficulty: "Mixed" as const,
  count: 30,
  seed: "pol001-runtime-contract",
};
const first = await knowledgeV1Pol001QuestionStudioAdapterV1.generate(request);
const replay = await knowledgeV1Pol001QuestionStudioAdapterV1.generate(request);
assert.equal(first.questions.length, 30);
assert.deepEqual(first, replay);
assert.equal(new Set(first.questions.map((q) => q.questionId)).size, 30);

for (const question of first.questions as any[]) {
  assert.equal(question.packageId, "POL-001");
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
}

for (const cpId of pkg.cpIds) {
  const result = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
    packageId: "POL-001",
    patternId: cpId,
    count: 1,
    seed: `pol001-smoke-${cpId}`,
  });
  assert.equal(result.questions.length, 1, `${cpId}: expected one question`);
  const q = result.questions[0] as any;
  assert.equal(q.cpId, cpId);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
}

const cp027 = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
  packageId: "POL-001",
  patternId: "POL-CP-027",
  count: 5,
  seed: "pol001-cp027",
});
assert.equal(cp027.questions.length, 5);
assert.deepEqual(new Set((cp027.questions as any[]).map((q) => q.cpId)), new Set(["POL-CP-027"]));

const ql = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
  packageId: "POL-001",
  patternId: "POL-027-QL-020",
  count: 4,
  seed: "pol001-cp027-ql020",
});
assert.equal(ql.questions.length, 4);
assert.deepEqual(new Set((ql.questions as any[]).map((q) => q.qlId)), new Set(["POL-027-QL-020"]));

const hard = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
  packageId: "POL-001",
  difficulty: "Hard",
  count: 10,
  seed: "pol001-hard",
});
assert.equal(hard.questions.length, 10);
assert.deepEqual(new Set((hard.questions as any[]).map((q) => q.difficulty)), new Set(["Hard"]));

await assert.rejects(
  knowledgeV1Pol001QuestionStudioAdapterV1.generate({ packageId: "POL-001", language: "hi" }),
  /English only/i,
);
await assert.rejects(
  knowledgeV1Pol001QuestionStudioAdapterV1.generate({ packageId: "POL-001", patternId: "POL-CP-999" }),
  /Unknown POL-001 selector/i,
);

const matches = listQuestionStudioPackages().filter((candidate) => candidate.packageId === "POL-001");
assert.equal(matches.length, 1);
