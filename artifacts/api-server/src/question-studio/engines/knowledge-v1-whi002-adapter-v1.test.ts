import { strict as assert } from "node:assert";
import { isWhi002QuestionStudioRequestV1, knowledgeV1Whi002QuestionStudioAdapterV1 } from "./knowledge-v1-whi002-adapter-v1";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";

async function run() {
  const packages = knowledgeV1Whi002QuestionStudioAdapterV1.listPackages();
  assert.ok(listQuestionStudioPackages().some((pkg) => pkg.packageId === "WHI-002"));
  assert.equal(packages.length, 1);
  assert.equal(packages[0]!.packageId, "WHI-002");
  assert.equal(packages[0]!.lifecycleStage, "REVIEW_ONLY");
  assert.equal(packages[0]!.questionBankWritable, false);
  assert.equal(packages[0]!.automaticStudentPublication, false);
  assert.deepEqual(packages[0]!.supportedLanguages, ["en"]);

  const routed = await generateQuestionStudioQuestions({ packageId: "WHI-002", language: "en", count: 5, seed: "whi002-registry-route" });
  assert.equal(routed.engineId, "knowledge-v1");
  assert.equal(routed.questions.length, 5);
  assert.ok(routed.questions.every((q) => q.cpId === "WHI-001-CP002" && q.language === "en"));

  const counts = new Map<string, number>();
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", language: "en", count: 50, difficulty, seed: `whi002-${difficulty}` });
    counts.set(difficulty, result.generationContext.candidateCount as number);
    assert.ok(result.questions.every((q) => q.difficulty === difficulty));
  }
  assert.deepEqual(Object.fromEntries(counts), { Easy: 18, Medium: 30, Hard: 12 });

  const one = await knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", language: "en", count: 1, patternId: "WHI-CP002-Q055", seed: "whi002-selector" });
  assert.equal(one.questions[0]!.questionId, "WHI-CP002-Q055");
  assert.equal(one.questions[0]!.reviewOnly, true);
  assert.equal(one.questions[0]!.productionReleased, false);
  assert.equal(one.questions[0]!.sourceIds instanceof Array, true);
  assert.equal(isWhi002QuestionStudioRequestV1({ packageId: "WHI-002" }), true);
  assert.equal(isWhi002QuestionStudioRequestV1({ patternId: "WHI-CP002-Q055" }), true);
  assert.equal(isWhi002QuestionStudioRequestV1({ topic: "World History" }), false);
  await assert.rejects(() => knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", language: "hi", count: 1 }), /currently exposes English/);
  await assert.rejects(() => knowledgeV1Whi002QuestionStudioAdapterV1.generate({ packageId: "WHI-002", count: 51 }), /between 1 and 50/);
}
void run();
