import assert from "node:assert/strict";

import {
  SAP_QUESTION_STUDIO_CHECKPOINTS,
  SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  SAP_QUESTION_STUDIO_PACKAGE_V1,
  SAP_QUESTION_STUDIO_QLS,
  generateSapQuestionStudioBatch,
  generateSapQuestionStudioQuestion,
} from "./sap-question-studio-release-v1";

assert.equal(SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY, "SAP-QUESTION-STUDIO-INTEGRATION-V1-QL001-211");
assert.equal(SAP_QUESTION_STUDIO_QLS.length, 211);
assert.equal(new Set(SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId)).size, 211);
assert.deepEqual(
  SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId),
  Array.from({ length: 211 }, (_, index) => `SAP-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.deepEqual(
  SAP_QUESTION_STUDIO_CHECKPOINTS,
  Array.from({ length: 12 }, (_, index) => `SAP-CP-${String(index + 1).padStart(3, "0")}`),
);
assert.equal(SAP_QUESTION_STUDIO_PACKAGE_V1.questionStudioDiscoverable, true);
assert.equal(SAP_QUESTION_STUDIO_PACKAGE_V1.persistenceAllowed, true);
assert.equal(SAP_QUESTION_STUDIO_PACKAGE_V1.reviewOnly, true);
assert.equal(SAP_QUESTION_STUDIO_PACKAGE_V1.questionBankWritable, false);
assert.equal(SAP_QUESTION_STUDIO_PACKAGE_V1.testEligible, false);
assert.equal(SAP_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable, false);
assert.equal(SAP_QUESTION_STUDIO_PACKAGE_V1.automaticStudentPublication, false);

let generated = 0;
for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  for (const sample of [1, 2, 3]) {
    const question = generateSapQuestionStudioQuestion(descriptor.qlId, `studio-authority-${descriptor.qlId}-${sample}`, "SSC", sample);
    assert.equal(question.qlId, descriptor.qlId, `${descriptor.qlId}: QL binding drifted.`);
    assert.equal(question.checkpointId, descriptor.checkpointId, `${descriptor.qlId}: checkpoint binding drifted.`);
    assert.ok(question.stem.trim().length > 0, `${descriptor.qlId}: empty stem.`);
    assert.equal(question.options.length, 4, `${descriptor.qlId}: expected four options.`);
    assert.equal(new Set(question.options).size, 4, `${descriptor.qlId}: duplicate options.`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4, `${descriptor.qlId}: invalid correct index.`);
    assert.equal(question.options[question.correctIndex], question.answer, `${descriptor.qlId}: answer binding mismatch.`);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1, `${descriptor.qlId}: expected exactly one correct option.`);
    assert.ok(question.explanation.steps.length >= 1, `${descriptor.qlId}: missing explanation steps.`);
    assert.equal(question.sourceLifecycleLocked, true);
    assert.equal(question.integrationAuthority, SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY);
    assert.equal(question.sourceValidation.valid, true, `${descriptor.qlId}: source validation failed: ${question.sourceValidation.errors.join(" | ")}`);
    generated += 1;
  }
}

const specialist = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-185");
assert.ok(specialist);
assert.equal(specialist.defaultWeight, 0, "Significant-figure diagnostic should not enter the default production mix.");
assert.equal(specialist.specialist, true);

const ql180 = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-180");
assert.ok(ql180?.title.toLowerCase().includes("power"));
assert.ok(!ql180?.title.toLowerCase().includes("root or power"));

const batch = generateSapQuestionStudioBatch({ count: 20, seed: "sap-studio-batch-authority", examProfile: "BANKING" });
assert.equal(batch.questions.length, 20);
assert.ok(batch.questions.every((question) => question.examProfile === "BANKING"));
assert.ok(batch.questions.every((question) => question.qlId !== "SAP-QL-185"), "Default mix leaked zero-weight QL185.");

const hardBatch = generateSapQuestionStudioBatch({
  count: 12,
  seed: "sap-studio-hard-count-authority",
  qlId: "SAP-QL-183",
  difficulty: "HARD",
  examProfile: "SSC",
});
assert.equal(hardBatch.questions.length, 12, "Difficulty-filtered batch did not preserve requested count.");
assert.ok(hardBatch.questions.every((question) => question.qlId === "SAP-QL-183" && question.difficultyBand === "HARD"));

console.log(JSON.stringify({
  authority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  checkpointCount: SAP_QUESTION_STUDIO_CHECKPOINTS.length,
  generatedStates: generated,
  exactCountDifficultyBatch: hardBatch.questions.length,
  reviewQueueEnabled: SAP_QUESTION_STUDIO_PACKAGE_V1.persistenceAllowed,
  questionBankWritable: SAP_QUESTION_STUDIO_PACKAGE_V1.questionBankWritable,
  testEligible: SAP_QUESTION_STUDIO_PACKAGE_V1.testEligible,
  publiclyPublishable: SAP_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable,
}));
