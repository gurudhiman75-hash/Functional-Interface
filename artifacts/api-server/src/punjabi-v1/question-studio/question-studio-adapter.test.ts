import { strict as assert } from "node:assert";
import {
  exportGoldenBatchJson,
  listPunjabiQuestionStudioPackages,
  previewPunjabiQuestionStudioReview,
  PUNJABI_QUESTION_STUDIO_PACKAGE_ID,
} from "./question-studio-adapter";

console.log("Starting Punjabi Question Studio Adapter tests...");

// 1. Package listing
const packages = listPunjabiQuestionStudioPackages();
assert.equal(packages.length, 1);
assert.equal(packages[0]!.packageId, PUNJABI_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(packages[0]!.subject, "Punjabi");
assert.equal(packages[0]!.language, "pa");
assert.equal(packages[0]!.checkpoints.length, 14);

console.log(`Active checkpoints available in Question Studio: ${packages[0]!.checkpoints.map((c) => c.cpId).join(", ")}`);

// 2. Preview review request for multiple checkpoints
const testCps = [
  "PUN-001-CP001",
  "PUN-001-CP002",
  "PUN-001-CP003",
  "PUN-001-CP004",
  "PUN-001-CP005",
  "PUN-001-CP006",
  "PUN-001-CP007",
  "PUN-001-CP008",
  "PUN-001-CP009",
  "PUN-001-CP010",
  "PUN-001-CP011",
  "PUN-001-CP012",
  "PUN-001-CP013",
  "PUN-001-CP014",
];

for (const cpId of testCps) {
  const previewRes = previewPunjabiQuestionStudioReview({
    packageId: PUNJABI_QUESTION_STUDIO_PACKAGE_ID,
    cpId,
    difficulty: "Medium",
    count: 10,
    seed: 8888,
  });

  assert.equal(previewRes.packageId, PUNJABI_QUESTION_STUDIO_PACKAGE_ID);
  assert.equal(previewRes.totalGenerated, 10);
  assert.equal(previewRes.items.length, 10);

  for (const item of previewRes.items) {
    assert.equal(item.options.length, 4);
    assert.equal(item.options.includes(item.correctAnswer), true);
    assert.equal(item.subject, "Punjabi");
    assert.equal(item.language, "pa");
    assert.equal(item.cpId, cpId);
    assert.equal(typeof item.stem, "string");
    assert.equal(typeof item.explanation, "string");
  }
}

// 3. Golden batch export JSON
const batchJson = exportGoldenBatchJson("PUN-001-CP001", 60, 5000);
assert.equal(typeof batchJson, "string");
const parsed = JSON.parse(batchJson);
assert.equal(parsed.totalQuestions, 60);
assert.equal(parsed.questions.length, 60);

console.log("All Punjabi Question Studio Adapter tests passed successfully!");
