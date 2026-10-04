import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter";
import {
  ASM_001_CONTENT_CLOSURE,
  ASM_001_PERMANENT_QL_IDS,
  type AsmAnswerClass,
} from "./asm-001-authority";
import {
  ASM_001_ANSWER_CLASS_COUNTS,
  ASM_001_SCENARIO_AUTHORITIES,
} from "./asm-001-corpus";
import {
  ASM_001_QUESTION_STUDIO_PACKAGE,
  generateAsm001QuestionStudioBatch,
} from "./question-studio-integration";
import { generateAsm001Question } from "./asm-001-runtime";

assert.deepEqual([...ASM_001_PERMANENT_QL_IDS], ["ASM-QL-001"]);
assert.equal(ASM_001_CONTENT_CLOSURE.nextAvailablePermanentQl, "ASM-QL-002");
assert.equal(ASM_001_SCENARIO_AUTHORITIES.length, 23);
assert.ok(ASM_001_ANSWER_CLASS_COUNTS.BOTH_TRUE_REASON_EXPLAINS >= 4);
assert.ok(ASM_001_ANSWER_CLASS_COUNTS.BOTH_TRUE_REASON_NOT_EXPLAINS >= 3);
assert.ok(ASM_001_ANSWER_CLASS_COUNTS.ASSERTION_TRUE_REASON_FALSE >= 3);
assert.ok(ASM_001_ANSWER_CLASS_COUNTS.ASSERTION_FALSE_REASON_TRUE >= 3);
assert.ok(ASM_001_ANSWER_CLASS_COUNTS.BOTH_FALSE >= 2);

for (const scenario of ASM_001_SCENARIO_AUTHORITIES) {
  if (scenario.answerClass === "BOTH_TRUE_REASON_EXPLAINS") {
    assert.equal(scenario.assertionTruth, true);
    assert.equal(scenario.reasonTruth, true);
    assert.equal(scenario.reasonExplainsAssertion, true);
  } else if (scenario.answerClass === "BOTH_TRUE_REASON_NOT_EXPLAINS") {
    assert.equal(scenario.assertionTruth, true);
    assert.equal(scenario.reasonTruth, true);
    assert.equal(scenario.reasonExplainsAssertion, false);
  } else if (scenario.answerClass === "ASSERTION_TRUE_REASON_FALSE") {
    assert.equal(scenario.assertionTruth, true);
    assert.equal(scenario.reasonTruth, false);
  } else if (scenario.answerClass === "ASSERTION_FALSE_REASON_TRUE") {
    assert.equal(scenario.assertionTruth, false);
    assert.equal(scenario.reasonTruth, true);
  } else {
    assert.equal(scenario.assertionTruth, false);
    assert.equal(scenario.reasonTruth, false);
  }
  assert.match(scenario.assertion.hi, /[ऀ-ॿ]/u);
  assert.match(scenario.reason.hi, /[ऀ-ॿ]/u);
  assert.match(scenario.assertion.pa, /[਀-੿]/u);
  assert.match(scenario.reason.pa, /[਀-੿]/u);
}

assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);

const registered = reasoningV1QuestionStudioAdapter
  .listPackages()
  .find((entry) => entry.packageId === "ASM-001");
assert.ok(registered, "ASM-001 must be registered in reasoning-v1 Question Studio.");
assert.deepEqual(registered?.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(registered?.supportedDifficulties, ["Easy", "Medium", "Hard"]);

const answerClasses = new Set<AsmAnswerClass>();
const scenarioIds = new Set<string>();
const profiles = new Set<string>();
const correctSlots = new Set<number>();

for (const language of ["en", "hi", "pa"] as const) {
  for (let i = 0; i < 600; i += 1) {
    const seed = "asm-closure-" + language + "-" + i;
    const first = generateAsm001Question(seed, language);
    const second = generateAsm001Question(seed, language);
    assert.deepEqual(first, second, "ASM-001 generation must be deterministic.");
    assert.equal(first.qlId, "ASM-QL-001");
    assert.equal(first.checkpointId, "ASM-CP-001");
    assert.equal(first.metadata.curatedTruthAuthority, true);
    assert.equal(first.metadata.reviewOnly, true);
    assert.equal(first.proof.semanticConsistency, true);
    assert.equal(new Set(first.options).size, first.options.length);
    assert.ok(first.options.length === 4 || first.options.length === 5);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < first.options.length);
    assert.equal(first.optionSemantics[first.correctIndex], first.canonicalAnswer);
    assert.ok(first.explanation.length > 80);
    assert.doesNotMatch(first.stem, /Directions:/i);
    assert.match(first.stem, /Assertion|अभिकथन|ਅਭਿਕਥਨ/u);
    answerClasses.add(first.canonicalAnswer);
    scenarioIds.add(first.scenarioId);
    profiles.add(first.optionProfile);
    correctSlots.add(first.correctIndex);
  }
}

assert.deepEqual(
  [...answerClasses].sort(),
  [
    "ASSERTION_FALSE_REASON_TRUE",
    "ASSERTION_TRUE_REASON_FALSE",
    "BOTH_FALSE",
    "BOTH_TRUE_REASON_EXPLAINS",
    "BOTH_TRUE_REASON_NOT_EXPLAINS",
  ].sort(),
);
assert.equal(
  scenarioIds.size,
  ASM_001_SCENARIO_AUTHORITIES.length,
  "Seed sweep must expose all curated ASM scenarios.",
);
assert.deepEqual([...profiles].sort(), ["EXTENDED_5", "STANDARD_4"]);
assert.ok(correctSlots.size >= 4, "Correct answer positions must not be fixed.");

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const pool = ASM_001_SCENARIO_AUTHORITIES.filter((scenario) => scenario.difficulty === difficulty);
  const result = await generateAsm001QuestionStudioBatch({
    packageId: "ASM-001",
    language: "en",
    difficulty,
    count: pool.length,
    seed: "asm-difficulty-" + difficulty,
  });
  assert.equal(result.questions.length, pool.length);
  assert.ok(result.questions.every((q) => q.difficulty === difficulty));
  assert.ok(result.questions.every((q) => q.qlId === "ASM-QL-001"));
  assert.ok(result.questions.every((q) => q.questionBankWritable === false));
  assert.ok(result.questions.every((q) => q.testEligible === false));
  assert.equal(
    new Set(result.questions.map((q) => String(q.traceability?.scenarioId))).size,
    pool.length,
    difficulty + " batch must not repeat curated scenarios",
  );
  assert.equal(result.generationContext?.withoutReplacement, true);
  assert.equal(result.generationContext?.availableDistinctScenarioCount, pool.length);

  await assert.rejects(
    () => generateAsm001QuestionStudioBatch({
      packageId: "ASM-001",
      language: "en",
      difficulty,
      count: pool.length + 1,
      seed: "asm-over-capacity-" + difficulty,
    }),
    /distinct curated .* scenarios/i,
  );

  const classes = new Set(pool.map((scenario) => scenario.answerClass));
  assert.equal(classes.size, 5, difficulty + " must cover all five answer classes");
}

const mixedFull = await generateAsm001QuestionStudioBatch({
  packageId: "ASM-001",
  language: "en",
  count: ASM_001_SCENARIO_AUTHORITIES.length,
  seed: "asm-full-unique-batch",
});
assert.equal(mixedFull.questions.length, ASM_001_SCENARIO_AUTHORITIES.length);
assert.equal(
  new Set(mixedFull.questions.map((q) => String(q.traceability?.scenarioId))).size,
  ASM_001_SCENARIO_AUTHORITIES.length,
  "Mixed full-capacity batch must expose every curated scenario exactly once",
);

const punjabi = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "ASM-001",
  language: "pa",
  count: 6,
  seed: "asm-adapter-pa",
});
assert.equal(punjabi.questions.length, 6);
assert.ok(
  punjabi.questions.every((q) => /[਀-੿]/u.test(String(q.stem))),
);
assert.ok(punjabi.questions.every((q) => q.packageId === "ASM-001"));

console.log(JSON.stringify({
  status: "PASS_ASM_001_STANDALONE_CONTENT_CLOSURE",
  permanentQlCount: ASM_001_PERMANENT_QL_IDS.length,
  scenarioCount: ASM_001_SCENARIO_AUTHORITIES.length,
  answerClassCounts: ASM_001_ANSWER_CLASS_COUNTS,
  optionProfiles: [...profiles].sort(),
  correctSlots: [...correctSlots].sort(),
  nextAvailablePermanentQl: ASM_001_CONTENT_CLOSURE.nextAvailablePermanentQl,
}, null, 2));
