import assert from "node:assert/strict";
import { knowledgeV1Com008QuestionStudioAdapterV1 } from "./knowledge-v1-com008-adapter-v1";
import { auditCom008FreezeV1 } from "../../knowledge-v1/computer-awareness/com008-data-representation-freeze-v1";

const freezeAudit = auditCom008FreezeV1();
assert.equal(freezeAudit.valid, true, freezeAudit.issues.join(","));

const packages = knowledgeV1Com008QuestionStudioAdapterV1.listPackages();
assert.equal(packages.length, 1);
assert.equal(packages[0]?.packageId, "COM-008");
assert.equal(packages[0]?.runtimeMode, "review-only");
assert.equal(packages[0]?.questionBankWritable, false);
assert.equal(packages[0]?.testEligible, false);

const first = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "en",
  count: 8,
  seed: "com008-test",
});
assert.equal(first.questions.length, 8);
assert.equal(new Set(first.questions.map((q: any) => q.questionId)).size, 8);
assert.ok(first.questions.every((q: any) => q.packageId === "COM-008"));
assert.ok(first.questions.every((q: any) => q.difficulty === "EASY" || q.difficulty === "MEDIUM"));

const replay = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "en",
  count: 8,
  seed: "com008-test",
});
assert.deepEqual(first.questions, replay.questions);

const hindi = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "hi",
  count: 4,
  seed: "com008-hi",
});
const punjabi = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "pa",
  count: 4,
  seed: "com008-pa",
});
assert.equal(hindi.questions.length, 4);
assert.equal(punjabi.questions.length, 4);

await assert.rejects(
  () =>
    knowledgeV1Com008QuestionStudioAdapterV1.generate({
      packageId: "COM-008",
      language: "en",
      difficulty: "Hard",
      count: 1,
    }),
  /Hard difficulty is not authorized/,
);
await assert.rejects(
  () =>
    knowledgeV1Com008QuestionStudioAdapterV1.generate({
      packageId: "COM-008",
      language: "en",
      patternId: "COM-008-QL-001",
      count: 5,
    }),
  /without repeats/,
);

console.log("COM-008 Question Studio adapter tests passed");
