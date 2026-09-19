import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import {
  COA_CP010_ACTIVE_QL_IDS,
  COA_CP010_CHECKPOINT_ID,
  COA_CP010_PRESENTATION_PROFILES,
  COA_CP010_QUESTION_STUDIO_PACKAGE,
  generateCoaCp010QuestionStudioBatch,
  isCoaCp010QuestionStudioRequest,
} from "./cp010-question-studio-integration.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const languages = ["en", "hi", "pa"] as const;

assert(COA_CP010_ACTIVE_QL_IDS.length === 8, "CP010 must expose exactly eight active semantic QLs");
assert(!COA_CP010_ACTIVE_QL_IDS.includes("COA-QL-007" as never), "retired QL007 must not be selectable");
assert(COA_CP010_PRESENTATION_PROFILES.length === 3, "CP010 must expose three approved presentation profiles");

assert(COA_CP010_QUESTION_STUDIO_PACKAGE.enabled === true, "COA package must be enabled in Question Studio");
assert(COA_CP010_QUESTION_STUDIO_PACKAGE.reviewOnly === true, "COA package must remain review-only");
assert(COA_CP010_QUESTION_STUDIO_PACKAGE.questionStudioVisible === true, "COA package must be visible");
assert(COA_CP010_QUESTION_STUDIO_PACKAGE.questionStudioGenerationEnabled === true, "COA package generation must be enabled");
assert(COA_CP010_QUESTION_STUDIO_PACKAGE.questionBankWritable === false, "Question Bank writes must remain closed");
assert(COA_CP010_QUESTION_STUDIO_PACKAGE.testEligible === false, "test eligibility must remain closed");
assert(COA_CP010_QUESTION_STUDIO_PACKAGE.mockTestEligible === false, "mock eligibility must remain closed");
assert(COA_CP010_QUESTION_STUDIO_PACKAGE.publiclyPublishable === false, "public release must remain closed");

assert(isCoaCp010QuestionStudioRequest({ packageId: "COA-001" }), "package routing failed");
assert(isCoaCp010QuestionStudioRequest({ topic: "Reasoning", subtopic: "Course of Action" }), "subtopic routing failed");
assert(isCoaCp010QuestionStudioRequest({ canonicalProblemId: "COA-QL-003" }), "QL routing failed");
assert(!isCoaCp010QuestionStudioRequest({ packageId: "OPS-001" }), "COA routing stole another package");

for (const language of languages) {
  const first = await generateCoaCp010QuestionStudioBatch({
    packageId: "COA-001",
    language,
    count: 12,
    seed: `CP010-PROOF-${language}`,
  });
  const replay = await generateCoaCp010QuestionStudioBatch({
    packageId: "COA-001",
    language,
    count: 12,
    seed: `CP010-PROOF-${language}`,
  });

  assert(JSON.stringify(first) === JSON.stringify(replay), `${language}: CP010 generation must be deterministic`);
  assert(first.checkpointId === COA_CP010_CHECKPOINT_ID, `${language}: checkpoint drift`);
  assert(first.questions.length === 12, `${language}: batch count drift`);

  for (const question of first.questions as readonly Record<string, any>[]) {
    assert(question.packageId === "COA-001", `${language}: package drift`);
    assert(question.checkpointId === COA_CP010_CHECKPOINT_ID, `${language}: question checkpoint drift`);
    assert(question.language === language, `${language}: language drift`);
    assert(question.questionStudioVisible === true, `${language}: Question Studio visibility lost`);
    assert(question.questionStudioDiscoverable === true, `${language}: Question Studio discovery lost`);
    assert(question.questionStudioGenerationEnabled === true, `${language}: generation flag lost`);
    assert(question.reviewOnly === true, `${language}: review-only gate opened`);
    assert(question.questionBankWritable === false, `${language}: Question Bank gate opened`);
    assert(question.testEligible === false, `${language}: test gate opened`);
    assert(question.mockTestEligible === false, `${language}: mock gate opened`);
    assert(question.publiclyPublishable === false, `${language}: public gate opened`);
    assert(question.automaticStudentPublication === false, `${language}: automatic publication gate opened`);
    assert(question.learnerRelease === "LOCKED", `${language}: learner release gate opened`);
    assert(question.qlId !== "COA-QL-007", `${language}: retired QL007 reached runtime`);
    assert(Array.isArray(question.options) && question.options.length === 4, `${language}: default four-way options drifted`);
    assert(question.options[question.correctIndex] === question.answer, `${language}: answer/index mismatch`);
  }
}

for (const qlId of COA_CP010_ACTIVE_QL_IDS) {
  for (const language of languages) {
    const result = await generateCoaCp010QuestionStudioBatch({
      packageId: "COA-001",
      canonicalProblemId: qlId,
      language,
      count: 2,
      seed: `CP010-QL-PROOF:${qlId}:${language}`,
    });
    assert(result.questions.length === 2, `${qlId}/${language}: QL batch size drift`);
    for (const question of result.questions as readonly Record<string, any>[]) {
      assert(question.qlId === qlId, `${qlId}/${language}: generated wrong QL`);
      assert(question.presentationProfile === "TWO_ACTION_FOUR_WAY", `${qlId}/${language}: default presentation drift`);
    }
  }
}

for (const language of languages) {
  const fiveWay = await generateCoaCp010QuestionStudioBatch({
    packageId: "COA-001",
    patternId: "TWO_ACTION_FIVE_CODE",
    language,
    count: 10,
    seed: `CP010-FIVE-WAY:${language}`,
  });
  const fiveWayQuestions = fiveWay.questions as readonly Record<string, any>[];
  assert(fiveWayQuestions.every((question) => question.options.length === 5), `${language}: five-way option count drift`);
  assert(fiveWayQuestions.some((question) => question.answerClass === "EITHER"), `${language}: genuine Either authority not reachable`);
  for (const question of fiveWayQuestions) {
    assert(question.options[question.correctIndex] === question.answer, `${language}: five-way answer/index mismatch`);
    if (question.answerClass === "EITHER") {
      assert(question.correctIndex === 2, `${language}: Either must map to dedicated third code`);
      assert(question.pairRelation === "MUTUALLY_EXCLUSIVE_ALTERNATIVES", `${language}: Either relation lost`);
      assert(question.qlId == null, `${language}: dedicated Either authority must not invent a semantic QL`);
    }
  }

  const threeAction = await generateCoaCp010QuestionStudioBatch({
    packageId: "COA-001",
    patternId: "THREE_ACTION_COMBINATION",
    language,
    count: 8,
    seed: `CP010-THREE:${language}`,
  });
  for (const question of threeAction.questions as readonly Record<string, any>[]) {
    assert(question.presentationProfile === "THREE_ACTION_COMBINATION", `${language}: three-action profile drift`);
    assert(question.courses.length === 3, `${language}: three-action course count drift`);
    assert(question.options.length === 4, `${language}: three-action option count drift`);
    assert(Number.isInteger(question.answerMask), `${language}: three-action truth mask missing`);
    assert(question.options[question.correctIndex] === question.answer, `${language}: three-action answer/index mismatch`);
    assert(question.qlId == null, `${language}: source-backed three-action authority must not invent a QL`);
  }
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await generateCoaCp010QuestionStudioBatch({
    packageId: "COA-001",
    difficulty,
    count: 6,
    seed: `CP010-DIFFICULTY:${difficulty}`,
  });
  for (const question of result.questions as readonly Record<string, any>[]) {
    assert(question.difficulty === difficulty, `${difficulty}: difficulty filter was relabelled or ignored`);
  }
}

let retiredQlRejected = false;
try {
  await generateCoaCp010QuestionStudioBatch({
    packageId: "COA-001",
    canonicalProblemId: "COA-QL-007",
    count: 1,
  });
} catch {
  retiredQlRejected = true;
}
assert(retiredQlRejected, "retired QL007 must be rejected as a Question Studio semantic selector");

const registeredPackages = reasoningV1QuestionStudioAdapter.listPackages();
assert(registeredPackages.some((pkg) => pkg.packageId === "COA-001"), "generic reasoning-v1 adapter did not register COA-001");

const adapterResult = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "COA-001",
  language: "pa",
  difficulty: "Medium",
  count: 3,
  seed: "CP010-GENERIC-ADAPTER",
});
assert(adapterResult.questions.length === 3, "generic reasoning-v1 adapter could not generate COA");
for (const question of adapterResult.questions as readonly Record<string, any>[]) {
  assert(question.packageId === "COA-001", "generic adapter routed COA to the wrong package");
  assert(question.language === "pa", "generic adapter lost Punjabi selection");
}

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: COA_CP010_CHECKPOINT_ID,
  status: "QUESTION_STUDIO_CONNECTED_REVIEW_ONLY",
  activeSemanticQls: COA_CP010_ACTIVE_QL_IDS,
  retiredSemanticQls: ["COA-QL-007"],
  presentationProfiles: COA_CP010_PRESENTATION_PROFILES,
  languages,
  difficultyFilter: ["Easy", "Medium", "Hard"],
  deterministicGeneration: true,
  genericReasoningAdapterRegistered: true,
  historicalCheckpointContract: "CP010_DIRECT_GENERATOR_REMAINS_REVIEW_ONLY_AFTER_LATER_PROMOTION",
  questionStudioVisible: true,
  reviewRunPersistenceAllowed: true,
  canonicalQuestionPersistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  learnerRelease: "LOCKED",
}, null, 2));
