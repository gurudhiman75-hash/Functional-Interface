import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter";
import {
  COD_001_STANDARD_QUESTION_STUDIO_AUTHORITY,
  COD_001_STANDARD_QUESTION_STUDIO_PACKAGE,
} from "./question-studio-integration";

const packages = reasoningV1QuestionStudioAdapter.listPackages().filter((entry) => entry.packageId === "COD-001");
assert.equal(packages.length, 1);
assert.equal(COD_001_STANDARD_QUESTION_STUDIO_PACKAGE.lifecycleStage, "REVIEW_ONLY");
assert.equal(COD_001_STANDARD_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(COD_001_STANDARD_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(COD_001_STANDARD_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(COD_001_STANDARD_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(COD_001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.permanentQlCount, 203);

const direct = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "COD-001",
  canonicalProblemId: "COD-QL-001",
  language: "en",
  count: 2,
  seed: "cod-standard-direct",
});
assert.equal(direct.questions.length, 2);
assert.ok(direct.questions.every((question) => question.qlId === "COD-QL-001"));
assert.ok(direct.questions.every((question) => question.checkpointId === "COD-CP-001"));
assert.ok(direct.questions.every((question) => question.registrationAuthorityId === COD_001_STANDARD_QUESTION_STUDIO_AUTHORITY));

const sourceGap = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "COD-001",
  questionLanguageId: "COD-QL-200",
  language: "pa",
  count: 2,
  seed: "cod-standard-source-gap-pa",
});
assert.ok(sourceGap.questions.every((question) => question.qlId === "COD-QL-200"));
assert.ok(sourceGap.questions.every((question) => question.locale === "pa-IN"));
assert.ok(sourceGap.questions.every((question) => question.checkpointId === "COD-CP-005"));

const cpNine = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "COD-001",
  patternId: "COD-CP-009",
  language: "hi",
  count: 3,
  seed: "cod-standard-cp009",
});
for (const question of cpNine.questions) {
  assert.equal(question.checkpointId, "COD-CP-009");
  const n = Number(String(question.qlId).slice(-3));
  assert.ok(n >= 175 && n <= 198);
}

const hard = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "COD-001",
  language: "en",
  difficulty: "Hard",
  count: 3,
  seed: "cod-standard-hard-filter",
});
assert.ok(hard.questions.every((question) => question.difficulty === "Hard"));

await assert.rejects(
  () => reasoningV1QuestionStudioAdapter.generate({
    packageId: "COD-001",
    canonicalProblemId: "COD-QL-204",
    count: 1,
  }),
  /Unknown COD-001 selector/u,
);

console.log(JSON.stringify({
  status: "PASS_COD_001_STANDARD_QUESTION_STUDIO_INTEGRATION",
  permanentQlCount: 203,
  hardCases: hard.questions.length,
  lifecycleStage: COD_001_STANDARD_QUESTION_STUDIO_PACKAGE.lifecycleStage,
}, null, 2));