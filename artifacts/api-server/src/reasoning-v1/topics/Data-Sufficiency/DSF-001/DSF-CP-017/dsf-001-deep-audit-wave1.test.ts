import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine-sri.ts";
import {
  DSF_CP017_LANES,
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
} from "./question-studio-review-v1.ts";

async function main() {
  const packages = listQuestionStudioPackages();
  const dsf = packages.filter((entry: any) => entry.packageId === "DSF-001");
  assert.equal(dsf.length, 1, "Exactly one current DSF-001 Question Studio package must be exposed.");
  const pkg = dsf[0] as any;

  assert.deepEqual(pkg.permanentQlIds, ["DSF-QL-001", "DSF-QL-002"]);
  assert.deepEqual(pkg.generatableQlIds, ["DSF-QL-001"]);
  assert.deepEqual(pkg.runtimeDeferredQlIds, ["DSF-QL-002"]);
  assert.equal(pkg.nextAvailableQlId, "DSF-QL-003");
  assert.equal(pkg.reviewOnly, true);
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.mockTestEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.automaticStudentPublication, false);

  assert.equal(DSF_CP017_LANES.length, 21);
  assert.deepEqual(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, ["DSF-QL-001", "DSF-QL-002"]);
  assert.deepEqual(DSF_CP017_RUNTIME_DEFERRED_QL_IDS, ["DSF-QL-002"]);

  const seenQuestionIds = new Set<string>();
  const seenSourceIdentities = new Set<string>();

  for (const lane of DSF_CP017_LANES) {
    for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
      const generated = await generateQuestion({
        packageId: "DSF-001",
        topic: "Reasoning",
        subtopic: "Data Sufficiency",
        canonicalProblemId: lane.laneId,
        patternId: "DSF-QL-001",
        difficulty,
        language: "en",
        seed: `dsf-wave1:${lane.laneId}:${difficulty}`,
        count: 2,
      } as any);

      const questions = (generated as any).questions as any[];
      assert.equal(questions.length, 2, `${lane.laneId}/${difficulty}: expected two questions`);

      for (const question of questions) {
        assert.equal(question.packageId, "DSF-001");
        assert.equal(question.qlId, "DSF-QL-001");
        assert.equal(question.laneId, lane.laneId);
        assert.equal(question.difficulty, difficulty);
        assert.equal(question.statements.length, 2);
        assert.equal(question.options.length, 5);
        assert.equal(new Set(question.options).size, 5);
        assert.equal(question.optionDetails.filter((option: any) => option.isCorrect).length, 1);
        assert(question.correctIndex >= 0 && question.correctIndex < 5);
        assert.equal(question.options[question.correctIndex], question.answer);
        assert.equal(question.reviewOnly, true);
        assert.equal(question.questionBankWritable, false);
        assert.equal(question.testEligible, false);
        assert.equal(question.mockTestEligible, false);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.automaticStudentPublication, false);
        assert.ok(question.explanation.length > 20);
        assert.doesNotMatch(`${question.stem} ${question.explanation}`, /TODO|TBD|placeholder|solver|debug|\[object Object\]/iu);

        assert(!seenQuestionIds.has(question.questionId), `Duplicate questionId: ${question.questionId}`);
        seenQuestionIds.add(question.questionId);
        assert(!seenSourceIdentities.has(question.sourceGenerationIdentity), `Duplicate source identity: ${question.sourceGenerationIdentity}`);
        seenSourceIdentities.add(question.sourceGenerationIdentity);
      }
    }
  }

  await assert.rejects(
    () => generateQuestion({
      packageId: "DSF-001",
      patternId: "DSF-QL-002",
      language: "en",
      seed: "dsf-wave1-ql002-boundary",
      count: 1,
    } as any),
    /permanently allocated.*not exposed/i,
    "QL002 must remain explicitly allocated-but-runtime-deferred until reviewed batch generation exists.",
  );

  await assert.rejects(
    () => generateQuestion({
      packageId: "DSF-001",
      patternId: "DSF-QL-001",
      language: "hi",
      seed: "dsf-wave1-new-breadth-hi-boundary",
      count: 1,
    } as any),
    /English-first/i,
    "The CP011-CP013 expansion must not falsely claim localization.",
  );

  console.log(JSON.stringify({
    status: "PASS_DSF001_DEEP_AUDIT_WAVE1_CURRENT_MAIN",
    laneCount: DSF_CP017_LANES.length,
    difficultyBands: 3,
    generatedQuestions: seenQuestionIds.size,
    permanentQlIds: pkg.permanentQlIds,
    generatableQlIds: pkg.generatableQlIds,
    runtimeDeferredQlIds: pkg.runtimeDeferredQlIds,
    nextAvailableQlId: pkg.nextAvailableQlId,
    reviewOnly: true,
  }, null, 2));
}

await main();
