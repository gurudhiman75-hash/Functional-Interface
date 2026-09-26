import { strict as assert } from "node:assert";
import { knowledgeV1Whi001QuestionStudioAdapterV1, isWhi001QuestionStudioRequestV1 } from "./knowledge-v1-whi001-adapter-v1";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";

async function run() {
  const packages = knowledgeV1Whi001QuestionStudioAdapterV1.listPackages();
  assert.ok(listQuestionStudioPackages().some((pkg) => pkg.packageId === "WHI-001"));
  const routed = await generateQuestionStudioQuestions({ packageId: "WHI-001", language: "hi", count: 1, seed: "whi-registry-route" });
  assert.equal(routed.engineId, "knowledge-v1");
  assert.equal(routed.questions[0]!.language, "hi");
  assert.equal(packages.length, 1);
  assert.equal(packages[0]!.packageId, "WHI-001");
  assert.equal(packages[0]!.lifecycleStage, "REVIEW_ONLY");
  assert.equal(packages[0]!.questionBankWritable, false);
  assert.equal(packages[0]!.automaticStudentPublication, false);
  for (const language of ["en", "hi", "pa"] as const) {
    const result = await knowledgeV1Whi001QuestionStudioAdapterV1.generate({ packageId: "WHI-001", language, count: 5, seed: "whi-smoke", runtimeMode: "review-only" });
    assert.equal(result.questions.length, 5);
    for (const q of result.questions) {
      assert.equal((q.options as string[]).length, 4);
      assert.equal((q.options as string[])[q.correctIndex as number], q.canonicalAnswer);
      assert.equal(q.language, language);
      assert.equal(q.reviewOnly, true);
      assert.equal(q.productionReleased, false);
    }
  }
  const filtered = await knowledgeV1Whi001QuestionStudioAdapterV1.generate({ packageId: "WHI-001", language: "pa", count: 2, difficulty: "Hard", seed: "whi-hard" });
  assert.equal(filtered.questions.length, 2);
  assert.ok(filtered.questions.every((q) => q.difficulty === "Hard"));
  assert.equal(isWhi001QuestionStudioRequestV1({ topic: "World History" }), true);
  assert.equal(isWhi001QuestionStudioRequestV1({ topic: "Indian History" }), false);
  await assert.rejects(() => knowledgeV1Whi001QuestionStudioAdapterV1.generate({ packageId: "WHI-001", language: "hi", count: 61 }), /between 1 and 50/);
}
void run();
