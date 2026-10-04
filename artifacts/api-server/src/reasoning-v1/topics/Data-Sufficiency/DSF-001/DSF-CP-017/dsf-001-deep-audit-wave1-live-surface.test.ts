import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine-sri.ts";
import {
  DSF_CP017_LANES,
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review-v1.ts";

const pkg = listQuestionStudioPackages().find((entry: any) => String(entry.packageId) === "DSF-001") as any;
assert.ok(pkg, "DSF-001 must be discoverable through the current shared Question Studio engine.");
assert.equal(pkg.integrationAuthority, DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority);
assert.equal(pkg.canonicalProblems.length, 21);
assert.deepEqual(pkg.permanentQlIds, ["DSF-QL-001", "DSF-QL-002"]);
assert.deepEqual(pkg.generatableQlIds, ["DSF-QL-001"]);
assert.deepEqual(pkg.runtimeDeferredQlIds, ["DSF-QL-002"]);
assert.deepEqual(pkg.supportedLanguages, ["en"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(pkg.reviewOnly, true);
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);

const observedLanes = new Set<string>();
const observedDifficulties = new Set<string>();
const observedSemanticClasses = new Set<string>();
const questionIds = new Set<string>();

for (const [laneIndex, lane] of DSF_CP017_LANES.entries()) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const generated = await generateQuestion({
      packageId: "DSF-001",
      canonicalProblemId: lane.laneId,
      patternId: "DSF-QL-001",
      difficulty,
      language: "en",
      seed: `dsf-wave1:${lane.laneId}:${difficulty}:${laneIndex}`,
      count: 1,
    } as any);

    const questions = (generated as any).questions as any[];
    assert.equal(questions.length, 1, `${lane.laneId}/${difficulty}: expected one live shared-engine question`);
    const question = questions[0]!;

    assert.equal(question.packageId, "DSF-001");
    assert.equal(question.qlId, "DSF-QL-001");
    assert.equal(question.patternId, "DSF-QL-001");
    assert.equal(question.laneId, lane.laneId);
    assert.equal(question.canonicalProblemId, lane.laneId);
    assert.equal(question.difficulty, difficulty);
    assert.equal(question.language, "en");
    assert.equal(question.statements.length, 2);
    assert.ok(question.statements.every((statement: any) => typeof statement.text === "string" && statement.text.trim().length > 0));
    assert.equal(question.options.length, 5);
    assert.equal(new Set(question.options).size, 5, `${lane.laneId}/${difficulty}: duplicate options`);
    assert.equal(question.optionDetails.length, 5);
    assert.equal(question.optionDetails.filter((option: any) => option.isCorrect).length, 1);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 5);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.ok(typeof question.canonicalAnswer === "string" && question.canonicalAnswer.length > 0);
    assert.ok(typeof question.explanation === "string" && question.explanation.length > 20);
    assert.doesNotMatch(question.explanation, /\[object Object\]|undefined|null|TODO|TBD/iu);
    assert.ok(question.text.includes("I. ") && question.text.includes("II. "));

    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.persistenceAllowed, true);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);

    if (lane.domainFamily === "REASONING") {
      assert.equal(question.editorialSurfaceVersion, "DSF_REASONING_COMMON_BASE_EDITORIAL_V3");
    }

    assert.ok(!questionIds.has(question.questionId), `${lane.laneId}/${difficulty}: duplicate live question identity`);
    questionIds.add(question.questionId);
    observedLanes.add(question.laneId);
    observedDifficulties.add(question.difficulty);
    observedSemanticClasses.add(question.canonicalAnswer);
  }
}

assert.equal(observedLanes.size, 21);
assert.deepEqual([...observedDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.ok(observedSemanticClasses.size >= 3, `Live surface semantic-class breadth is unexpectedly narrow: ${[...observedSemanticClasses].join(", ")}`);

await assert.rejects(
  () => generateQuestion({
    packageId: "DSF-001",
    patternId: "DSF-QL-002",
    language: "en",
    count: 1,
    seed: "dsf-wave1-ql002-deferred",
  } as any),
  /permanently allocated.*not exposed/i,
  "DSF-QL-002 must stay runtime-deferred until a reviewed batch runtime exists.",
);

await assert.rejects(
  () => generateQuestion({
    packageId: "DSF-001",
    patternId: "DSF-QL-001",
    language: "hi",
    count: 1,
    seed: "dsf-wave1-hi-boundary",
  } as any),
  /English-first/i,
  "Current CP017 breadth must not pretend the new lanes are Hindi-localized.",
);

console.log(JSON.stringify({
  status: "PASS_DSF_001_DEEP_AUDIT_WAVE1_LIVE_SURFACE",
  laneCount: observedLanes.size,
  difficultyBands: [...observedDifficulties].sort(),
  semanticClassCountObserved: observedSemanticClasses.size,
  liveQuestionCount: questionIds.size,
  ql001Generatable: true,
  ql002RuntimeDeferred: true,
  supportedLanguages: ["en"],
  reviewOnly: true,
  downstreamReleaseLocked: true,
}, null, 2));
