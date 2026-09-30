import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import { isWhi011014QuestionStudioRequestV1, knowledgeV1Whi011014QuestionStudioAdapterV1 } from "./knowledge-v1-whi011-014-adapter-v1";

async function run() {
  const sourceRoot = existsSync(resolve(process.cwd(), "src")) ? resolve(process.cwd(), "src") : resolve(process.cwd(), "artifacts/api-server/src");
  const composite = readFileSync(resolve(sourceRoot, "question-studio/engines/knowledge-v1-adapter.ts"), "utf8");
  assert.match(composite, /isWhi011014QuestionStudioRequestV1, knowledgeV1Whi011014QuestionStudioAdapterV1/);
  assert.match(composite, /\.\.\.knowledgeV1Whi011014QuestionStudioAdapterV1\.listPackages\(\)/);
  assert.ok(composite.indexOf("if (isWhi011014QuestionStudioRequestV1(request))") < composite.indexOf("if (isWhi001QuestionStudioRequestV1(request))"));

  const packages = knowledgeV1Whi011014QuestionStudioAdapterV1.listPackages();
  assert.deepEqual(packages.map((pkg) => pkg.packageId), ["WHI-001-CP011", "WHI-001-CP012", "WHI-001-CP013", "WHI-001-CP014"]);
  for (const pkg of packages) {
    assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
    assert.deepEqual(pkg.cpIds, [pkg.packageId]);
    assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
    assert.equal(pkg.questionBankWritable, false);
    assert.equal(pkg.testEligible, false);
    assert.equal(pkg.mockTestEligible, false);
    assert.equal(pkg.automaticStudentPublication, false);
    assert.equal(pkg.productionReleaseAuthorized, false);
  }

  for (const cp of ["011", "012", "013", "014"]) {
    const packageId = `WHI-001-CP${cp}`;
    for (const language of ["en", "hi", "pa"] as const) {
      const result = await knowledgeV1QuestionStudioAdapter.generate({ packageId, language, count: 4, seed: `${packageId}-${language}` });
      assert.equal(result.questions.length, 4);
      for (const q of result.questions) {
        assert.equal(q.language, language);
        assert.equal(q.cpId, packageId);
        assert.equal((q.options as string[]).length, 4);
        assert.equal((q.options as string[])[q.correctIndex as number], q.canonicalAnswer);
        assert.equal(q.reviewOnly, true);
        assert.equal(q.runtimeRegistered, false);
        assert.equal(q.productionReleased, false);
        assert.equal(q.automaticStudentPublication, false);
        assert.ok(q.factId && (q.sourceIds as string[]).length > 0);
      }
    }
    const localizedQuestion = await knowledgeV1QuestionStudioAdapter.generate({
      packageId, language: "pa", count: 1, patternId: `WHI-CP${cp}-Q001-PA`, seed: `${packageId}-selector`,
    });
    assert.equal(localizedQuestion.questions[0]!.questionId, `WHI-CP${cp}-Q001-PA`);
    const topicRoute = await knowledgeV1QuestionStudioAdapter.generate({
      topic: "World History", subtopic: packages.find((pkg) => pkg.packageId === packageId)!.subtopic, language: "en", count: 1,
    });
    assert.equal(topicRoute.questions[0]!.packageId, packageId);
  }

  assert.equal(knowledgeV1QuestionStudioAdapter.listPackages().filter((pkg) => packages.some((candidate) => candidate.packageId === pkg.packageId)).length, 4);
  assert.equal(isWhi011014QuestionStudioRequestV1({ packageId: "WHI-001-CP011" }), true);
  assert.equal(isWhi011014QuestionStudioRequestV1({ patternId: "WHI-CP014-Q060-HI" }), true);
  assert.equal(isWhi011014QuestionStudioRequestV1({ topic: "World History", subtopic: "Decolonization in Africa" }), true);
  assert.equal(isWhi011014QuestionStudioRequestV1({ topic: "World History" }), false);
  await assert.rejects(() => knowledgeV1Whi011014QuestionStudioAdapterV1.generate({ packageId: "WHI-001-CP011", language: "hi", count: 51 }), /between 1 and 50/);
  await assert.rejects(() => knowledgeV1Whi011014QuestionStudioAdapterV1.generate({ packageId: "WHI-001-CP011", language: "hi", count: 1, runtimeMode: "learner" }), /review-only/);
  await assert.rejects(() => knowledgeV1Whi011014QuestionStudioAdapterV1.generate({ packageId: "WHI-001-CP011", patternId: "WHI-CP012-Q001", count: 1 }), /Conflicting WHI-001-CP011-CP014 checkpoint selectors/);
  console.log("[WHI-011-014-QS] PASS four routed packages, en/hi/pa generation, selectors, parity and learner-release locks");
}
void run();
