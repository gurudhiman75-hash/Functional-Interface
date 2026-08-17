import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../question-studio-generation-engine";
import {
  SAP_QUESTION_STUDIO_CP_IDS,
  SAP_QUESTION_STUDIO_QLS,
  inferSapQuestionStudioCpFromQl,
  runSapQuestionStudioPipeline,
} from "./question-studio-adapter";

assert.equal(SAP_QUESTION_STUDIO_CP_IDS.length, 12);
assert.equal(SAP_QUESTION_STUDIO_QLS.length, 211);
assert.equal(new Set(SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId)).size, 211);
assert.deepEqual(
  SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId),
  Array.from({ length: 211 }, (_, index) => `SAP-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.deepEqual(
  SAP_QUESTION_STUDIO_CP_IDS,
  Array.from({ length: 12 }, (_, index) => `SAP-CP-${String(index + 1).padStart(3, "0")}`),
);

const packageCard = listQuantV4Packages().find((entry: any) => entry.packageId === "SAP") as any;
assert.ok(packageCard, "SAP was not discovered by the central Question Studio package registry.");
assert.equal(packageCard.subtopic, "Simplification & Approximation");
assert.deepEqual(packageCard.supportedLanguages, ["en"]);
assert.deepEqual(packageCard.cpIds, [...SAP_QUESTION_STUDIO_CP_IDS]);
assert.equal(packageCard.enabled, true);
assert.equal(packageCard.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(packageCard.questionBankStatus, "NOT_STORED");
assert.equal(packageCard.testEligibility, "INELIGIBLE");
assert.equal(packageCard.publiclyPublishable, false);

let generated = 0;
for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  assert.equal(
    inferSapQuestionStudioCpFromQl(descriptor.qlId),
    descriptor.checkpointId,
    `${descriptor.qlId}: QL ownership drifted.`,
  );
  const question = runSapQuestionStudioPipeline(descriptor.checkpointId, {
    language: "en",
    questionLanguageId: descriptor.qlId,
    seed: `shared-studio-authority:${descriptor.qlId}`,
  });
  assert.equal(question.packageId, "SAP");
  assert.equal(question.canonicalProblemId, descriptor.checkpointId);
  assert.equal(question.questionLanguageId, descriptor.qlId);
  assert.ok(question.stem.trim().length > 0, `${descriptor.qlId}: empty stem.`);
  assert.equal(question.options.length, 4, `${descriptor.qlId}: expected four options.`);
  assert.equal(new Set(question.options).size, 4, `${descriptor.qlId}: duplicate options.`);
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 4, `${descriptor.qlId}: invalid correct index.`);
  assert.equal(question.options[question.correctIndex], question.answer, `${descriptor.qlId}: answer binding mismatch.`);
  assert.ok(question.explanation.lines.length >= 1, `${descriptor.qlId}: missing explanation.`);
  assert.equal(question.validation.ok, true, `${descriptor.qlId}: source validation failed: ${question.validation.errors.join(" | ")}`);
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.publiclyPublishable, false);
  generated += 1;
}

const specialist = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-185");
assert.ok(specialist);
assert.equal(specialist.defaultWeight, 0, "Significant-figure diagnostic should not enter the default mix.");
assert.equal(specialist.specialist, true);

const ql180 = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-180");
assert.ok(ql180?.title.toLowerCase().includes("power"));
assert.ok(!ql180?.title.toLowerCase().includes("root or power"));

const sharedResult = await generateQuestion({
  packageId: "SAP",
  topic: "Arithmetic",
  subtopic: "Simplification & Approximation",
  language: "en",
  count: 12,
  seed: "sap-shared-question-studio-contract",
});
assert.equal(sharedResult.questions.length, 12);
assert.ok(sharedResult.questions.every((question: any) => question.packageId === "SAP"));
assert.ok(sharedResult.questions.every((question: any) => question.questionBankStatus === "NOT_STORED"));
assert.ok(sharedResult.questions.every((question: any) => question.testEligibility === "INELIGIBLE"));
assert.ok(sharedResult.questions.every((question: any) => question.publiclyPublishable === false));
assert.equal(sharedResult.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(sharedResult.generationContext.testEligibility, "INELIGIBLE");
assert.equal(sharedResult.generationContext.publiclyPublishable, false);

const difficultyRuns: Record<string, number> = {};
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await generateQuestion({
    packageId: "SAP",
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    language: "en",
    difficulty,
    count: 8,
    seed: `sap-shared-cockpit-${difficulty.toLowerCase()}`,
  });
  assert.equal(result.questions.length, 8, `${difficulty}: shared Cockpit batch under-filled.`);
  assert.ok(result.questions.every((question: any) => question.packageId === "SAP"));
  assert.ok(
    result.questions.every((question: any) => question.difficultyLabel === difficulty),
    `${difficulty}: chapter mix did not honor the existing Cockpit difficulty control.`,
  );
  assert.ok(result.questions.every((question: any) => question.questionBankStatus === "NOT_STORED"));
  assert.ok(result.questions.every((question: any) => question.testEligibility === "INELIGIBLE"));
  assert.ok(result.questions.every((question: any) => question.publiclyPublishable === false));
  difficultyRuns[difficulty] = result.questions.length;
}

console.log(JSON.stringify({
  authority: "SAP-SHARED-QUESTION-STUDIO-INTEGRATION",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  checkpointCount: SAP_QUESTION_STUDIO_CP_IDS.length,
  generatedStates: generated,
  centralPackageDiscovered: true,
  sharedRunCount: sharedResult.questions.length,
  difficultyRuns,
  questionBankStatus: sharedResult.generationContext.questionBankStatus,
  testEligibility: sharedResult.generationContext.testEligibility,
  publiclyPublishable: sharedResult.generationContext.publiclyPublishable,
}));