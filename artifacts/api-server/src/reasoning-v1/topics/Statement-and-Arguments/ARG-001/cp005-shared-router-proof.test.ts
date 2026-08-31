import assert from "node:assert/strict";

import {
  generateQuestion as generateArgAggregateQuestion,
  listQuestionStudioPackages as listArgAggregatePackages,
} from "../../../../question-studio/shared-generation-engine-arg.ts";
import {
  listQuestionStudioPackages as listPreviousPackages,
} from "../../../../question-studio/shared-generation-engine-sri.ts";

const EXPECTED_DIFFICULTIES = ["Easy", "Hard", "Medium"];

async function main() {
  const previous = listPreviousPackages();
  const aggregate = listArgAggregatePackages();

  assert.equal(
    aggregate.length,
    previous.length + 1,
    "ARG-001 CP005 must extend, not replace, the previous Question Studio registry",
  );

  for (const pkg of previous) {
    assert.ok(
      aggregate.some((entry) => String(entry.packageId) === String(pkg.packageId)),
      `previous Question Studio package ${String(pkg.packageId)} disappeared after ARG activation`,
    );
  }

  const argPackages = aggregate.filter((entry) => String(entry.packageId) === "ARG-001");
  assert.equal(argPackages.length, 1, "ARG-001 must be registered exactly once");
  const arg = argPackages[0]! as any;
  assert.equal(arg.questionStudioVisible, true);
  assert.equal(arg.questionStudioDiscoverable, true);
  assert.equal(arg.questionStudioGenerationEnabled, true);
  assert.equal(arg.reviewOnly, true);
  assert.equal(arg.questionBankWritable, false);
  assert.equal(arg.testEligible, false);
  assert.equal(arg.mockTestEligible, false);
  assert.equal(arg.publiclyPublishable, false);
  assert.equal(arg.automaticStudentPublication, false);
  assert.deepEqual(arg.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(arg.designTargetDifficulties, ["Easy", "Medium", "Hard"]);
  assert.deepEqual(arg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
  assert.deepEqual(arg.blockedDifficulties, []);
  assert.equal(arg.difficultyCoverageStatus, "CERTIFIED_EASY_MEDIUM_HARD");
  assert.equal(arg.permanentQlCount, 6);

  for (const problem of arg.canonicalProblems) {
    assert.deepEqual([...problem.supportedDifficulties].sort(), EXPECTED_DIFFICULTIES, `${problem.id}: incomplete difficulty capabilities`);
  }

  const result = await generateArgAggregateQuestion({
    packageId: "ARG-001",
    canonicalProblemId: "ARG-QL-005",
    cpId: "ARG-CP-005",
    difficulty: "Hard",
    language: "pa",
    seed: "shared-router-proof",
    count: 7,
  });

  assert.equal(result.questions.length, 7);
  assert.equal(result.generationContext.packageId, "ARG-001");
  assert.equal(result.generationContext.qlId, "ARG-QL-005");
  assert.equal(result.generationContext.language, "pa");
  for (const question of result.questions) {
    assert.equal(question.packageId, "ARG-001");
    assert.equal(question.qlId, "ARG-QL-005");
    assert.equal(question.language, "pa");
    assert.equal(question.difficulty, "Hard");
    assert.equal(question.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
  }

  const easy = await generateArgAggregateQuestion({
    packageId: "ARG-001",
    canonicalProblemId: "ARG-QL-006",
    cpId: "ARG-CP-005",
    difficulty: "Easy",
    language: "hi",
    seed: "easy-routing-proof",
    count: 5,
  });
  assert.equal(easy.questions.length, 5);
  for (const question of easy.questions) {
    assert.equal(question.qlId, "ARG-QL-006");
    assert.equal(question.language, "hi");
    assert.equal(question.difficulty, "Easy");
  }

  const medium = await generateArgAggregateQuestion({
    packageId: "ARG-001",
    canonicalProblemId: "ARG-QL-006",
    cpId: "ARG-CP-005",
    difficulty: "Medium",
    language: "en",
    seed: "medium-routing-proof",
    count: 5,
  });
  assert.equal(medium.questions.length, 5);
  for (const question of medium.questions) {
    assert.equal(question.qlId, "ARG-QL-006");
    assert.equal(question.difficulty, "Medium");
  }

  const nonArg = await generateArgAggregateQuestion({
    packageId: "STA-001",
    language: "en",
    seed: "fallback-proof",
    count: 1,
  });
  assert.notEqual(nonArg.generationContext.packageId, "ARG-001", "non-ARG request was hijacked by ARG router");

  console.log("ARG-001 CP005 shared Question Studio router proof: PASS");
}

await main();
