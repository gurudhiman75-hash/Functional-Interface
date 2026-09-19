import { strict as assert } from "node:assert";

import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  POL_001_QUESTION_STUDIO_CORPUS_V1,
  POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isPol001QuestionStudioRequestV1,
  knowledgeV1Pol001QuestionStudioAdapterV1,
} from "./knowledge-v1-pol001-adapter-v1";

const pkg = POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;

assert.equal(pkg.packageId, "POL-001");
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.subject, "Static GK");
assert.equal(pkg.topic, "Indian Polity");
assert.equal(pkg.subtopic, "Complete Chapter");
assert.equal(pkg.enabled, true);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.deepEqual(pkg.supportedLanguages, ["en"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(pkg.cpIds?.length, 27);
assert.equal(new Set(pkg.cpIds).size, 27);
assert.equal(pkg.metadata?.cpCount, 27);
assert.equal(pkg.metadata?.englishQuestionCount, 2087);
assert.equal(pkg.metadata?.registrationAuthorityId, POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);

assert.equal(POL_001_QUESTION_STUDIO_CORPUS_V1.length, 2087);
assert.equal(new Set(POL_001_QUESTION_STUDIO_CORPUS_V1.map((q) => q.questionId)).size, 2087);
assert.equal(new Set(POL_001_QUESTION_STUDIO_CORPUS_V1.map((q) => q.cpId)).size, 27);

const bannedStem = /^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:$/i;
for (const q of POL_001_QUESTION_STUDIO_CORPUS_V1) {
  assert.equal(q.options.length, 4, `${q.questionId}: four options required`);
  assert.equal(new Set(q.options).size, 4, `${q.questionId}: unique options required`);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}: answer mismatch`);
  assert.ok(q.stem.trim().length > 0, `${q.questionId}: missing stem`);
  assert.ok(q.explanation.trim().length > 0, `${q.questionId}: missing explanation`);
  assert.doesNotMatch(q.stem, bannedStem, `${q.questionId}: final editorial stem pass missing`);
}

assert.equal(isPol001QuestionStudioRequestV1({ packageId: "POL-001" }), true);
assert.equal(
  isPol001QuestionStudioRequestV1({
    subject: "Static GK",
    topic: "Indian Polity",
    subtopic: "Complete Chapter",
  }),
  true,
);
assert.equal(isPol001QuestionStudioRequestV1({ packageId: "ECO-001" }), false);

const compositePackages = knowledgeV1QuestionStudioAdapter.listPackages();
assert.equal(compositePackages.some((p) => p.packageId === "POL-001"), true);
assert.equal(new Set(compositePackages.map((p) => p.packageId)).size, compositePackages.length);

const request = {
  packageId: "POL-001",
  language: "en" as const,
  difficulty: "Mixed" as const,
  count: 30,
  seed: "pol001-integration-contract",
};
const first = await knowledgeV1Pol001QuestionStudioAdapterV1.generate(request);
const replay = await knowledgeV1Pol001QuestionStudioAdapterV1.generate(request);
assert.equal(first.questions.length, 30);
assert.deepEqual(first, replay);
assert.equal(new Set(first.questions.map((q) => q.questionId)).size, 30);

for (const q of first.questions as any[]) {
  assert.equal(q.packageId, "POL-001");
  assert.equal(q.language, "en");
  assert.equal(q.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(q.registrationAuthorityId, POL_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);
  assert.equal(q.authoringReviewApproved, true);
  assert.equal(q.finalAuditApproved, true);
  assert.equal(q.runtimeRegistered, true);
  assert.equal(q.readOnly, true);
  assert.equal(q.productionReleased, false);
  assert.equal(q.questionBankWritable, false);
  assert.equal(q.testEligible, false);
  assert.equal(q.mockTestEligible, false);
  assert.equal(q.publiclyPublishable, false);
}

const composite = await knowledgeV1QuestionStudioAdapter.generate({
  ...request,
  count: 12,
  seed: "pol001-composite-route",
});
assert.equal(composite.questions.length, 12);
assert.equal(composite.questions.every((q) => q.packageId === "POL-001"), true);

const cp014 = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
  packageId: "POL-001",
  canonicalProblemId: "POL-CP-014",
  count: 8,
  seed: "pol001-cp014",
});
assert.equal(cp014.questions.length, 8);
assert.equal(cp014.questions.every((q) => q.cpId === "POL-CP-014"), true);

const compactCp014 = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
  packageId: "POL-001",
  canonicalProblemId: "POL-CP014",
  count: 8,
  seed: "pol001-cp014-compact",
});
assert.equal(compactCp014.questions.every((q) => q.cpId === "POL-CP-014"), true);

const ql014009 = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
  packageId: "POL-001",
  patternId: "POL-014-QL-009",
  count: 4,
  seed: "pol001-ql014009",
});
assert.equal(ql014009.questions.length, 4);
assert.equal(ql014009.questions.every((q) => q.qlId === "POL-014-QL-009"), true);
assert.equal(ql014009.questions.every((q) => q.cpId === "POL-CP-014"), true);

const hard = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
  packageId: "POL-001",
  difficulty: "Hard",
  count: 25,
  seed: "pol001-hard",
});
assert.equal(hard.questions.every((q) => q.difficulty === "Hard"), true);

await assert.rejects(
  knowledgeV1Pol001QuestionStudioAdapterV1.generate({
    packageId: "POL-001",
    canonicalProblemId: "POL-CP-014",
    patternId: "POL-013-QL-009",
  }),
  /Conflicting POL-001 CP\/QL selectors/i,
);
await assert.rejects(
  knowledgeV1Pol001QuestionStudioAdapterV1.generate({
    packageId: "POL-001",
    canonicalProblemId: "POL-CP-028",
  }),
  /Unknown POL-001 selector/i,
);
await assert.rejects(
  knowledgeV1Pol001QuestionStudioAdapterV1.generate({
    packageId: "POL-001",
    language: "hi",
  }),
  /currently supports English only/i,
);
await assert.rejects(
  knowledgeV1Pol001QuestionStudioAdapterV1.generate({
    packageId: "POL-001",
    runtimeMode: "bank-only",
  }),
  /only supports review-only runtime/i,
);

console.log(JSON.stringify({
  packageId: pkg.packageId,
  cpCount: pkg.cpIds.length,
  qlCount: pkg.metadata?.qlCount,
  questionCount: POL_001_QUESTION_STUDIO_CORPUS_V1.length,
  runtimeSmoke: "PASS",
}, null, 2));
