import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isWhi016QuestionStudioRequestV1, knowledgeV1Whi016QuestionStudioAdapterV1 } from "./knowledge-v1-whi016-adapter-v1";

async function run() {
  const sourceRoot = existsSync(resolve(process.cwd(), "src"))
    ? resolve(process.cwd(), "src")
    : resolve(process.cwd(), "artifacts/api-server/src");
  const composite = readFileSync(resolve(sourceRoot, "question-studio/engines/knowledge-v1-adapter.ts"), "utf8");
  assert.match(composite, /isWhi016QuestionStudioRequestV1, knowledgeV1Whi016QuestionStudioAdapterV1/);
  assert.match(composite, /\.\.\.knowledgeV1Whi016QuestionStudioAdapterV1\.listPackages\(\)/);
  assert.ok(composite.indexOf("if (isWhi016QuestionStudioRequestV1(request))") < composite.indexOf("if (isWhi001QuestionStudioRequestV1(request))"));

  const pkg = knowledgeV1Whi016QuestionStudioAdapterV1.listPackages()[0]!;
  assert.equal(pkg.packageId, "WHI-001-CP016");
  assert.deepEqual(pkg.cpIds, ["WHI-001-CP016"]);
  assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.mockTestEligible, false);
  assert.equal(pkg.automaticStudentPublication, false);
  assert.equal(pkg.productionReleaseAuthorized, false);

  for (const language of ["en", "hi", "pa"] as const) {
    const result = await knowledgeV1Whi016QuestionStudioAdapterV1.generate({ packageId: "WHI-001-CP016", language, count: 3, seed: `whi016-${language}` });
    assert.equal(result.questions.length, 3);
    for (const q of result.questions) {
      assert.equal(q.language, language);
      assert.equal(q.cpId, "WHI-001-CP016");
      assert.equal((q.options as string[]).length, 4);
      assert.equal((q.options as string[])[q.correctIndex as number], q.canonicalAnswer);
      assert.equal(q.reviewOnly, true);
      assert.equal(q.runtimeRegistered, false);
      assert.equal(q.productionReleased, false);
      assert.equal(q.automaticStudentPublication, false);
      assert.ok(q.originQuestionId && q.originFactId && q.sourceIds);
      assert.ok((q.sourceIds as string[]).every((id) => /^CP\d{3}-S\d+$/.test(id)), `${q.questionId}: source IDs must be checkpoint scoped without duplicate prefixes`);
    }
  }
  const selected = await knowledgeV1Whi016QuestionStudioAdapterV1.generate({
    packageId: "WHI-001-CP016", language: "pa", count: 1, patternId: "WHI-CP016-Q001-PA", seed: "whi016-single",
  });
  assert.equal(selected.questions.length, 1);
  assert.equal(selected.questions[0]!.questionId, "WHI-CP016-Q001-PA");
  assert.equal(isWhi016QuestionStudioRequestV1({ packageId: "WHI-001-CP016" }), true);
  assert.equal(isWhi016QuestionStudioRequestV1({ patternId: "WHI-CP016-Q001" }), true);
  assert.equal(isWhi016QuestionStudioRequestV1({ topic: "World History", subtopic: "Cumulative Review" }), true);
  assert.equal(isWhi016QuestionStudioRequestV1({ topic: "World History" }), false);
  await assert.rejects(() => knowledgeV1Whi016QuestionStudioAdapterV1.generate({ packageId: "WHI-001-CP016", language: "hi", count: 61 }), /between 1 and 50/);
  await assert.rejects(() => knowledgeV1Whi016QuestionStudioAdapterV1.generate({ packageId: "WHI-001-CP016", language: "hi", count: 1, runtimeMode: "learner" }), /review-only/);
  console.log("[WHI-016-QS] PASS package routing, en/hi/pa review generation, provenance, answer keys and release locks");
}
void run();
