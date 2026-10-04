import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import { ASM_001_CONTENT_CLOSURE, ASM_001_FREEZE_VERSION } from "./asm-001-authority.ts";
import {
  ASM_001_SCENARIO_AUTHORITIES,
  asmLocalized,
  type AsmDifficulty,
  type AsmLanguage,
} from "./asm-001-corpus.ts";
import {
  generateAsm001QuestionFromScenario,
  listAsm001ScenarioAuthorities,
} from "./asm-001-runtime.ts";
import {
  ASM_001_QUESTION_STUDIO_PACKAGE,
  generateAsm001QuestionStudioBatch,
} from "./question-studio-integration.ts";

const LANGUAGES = ["en", "hi", "pa"] as const satisfies readonly AsmLanguage[];
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const satisfies readonly AsmDifficulty[];

assert.equal(ASM_001_SCENARIO_AUTHORITIES.length, 23);
assert.equal(ASM_001_CONTENT_CLOSURE.permanentQlCount, 1);
assert.equal(ASM_001_FREEZE_VERSION, "ASM_001_POST_CLOSURE_FREEZE_2026_10_04_V2");

let directSurfaces = 0;
for (const difficulty of DIFFICULTIES) {
  const pool = listAsm001ScenarioAuthorities(difficulty);
  assert.ok(pool.length >= 5, `${difficulty}: curated pool is too thin for five semantic answer classes`);
  assert.equal(
    new Set(pool.map((scenario) => scenario.answerClass)).size,
    5,
    `${difficulty}: all five Assertion-and-Reason answer classes must be represented`,
  );
}

for (const scenario of ASM_001_SCENARIO_AUTHORITIES) {
  for (const language of LANGUAGES) {
    for (let variant = 0; variant < 8; variant += 1) {
      const seed = `asm-post-closure:${scenario.id}:${language}:${variant}`;
      const question = generateAsm001QuestionFromScenario(scenario, seed, language);
      assert.equal(question.scenarioId, scenario.id);
      assert.equal(question.canonicalAnswer, scenario.answerClass);
      assert.equal(question.proof.assertionTruth, scenario.assertionTruth);
      assert.equal(question.proof.reasonTruth, scenario.reasonTruth);
      assert.equal(question.proof.reasonExplainsAssertion, scenario.reasonExplainsAssertion);
      assert.equal(question.proof.answerClass, scenario.answerClass);
      assert.equal(question.optionSemantics[question.correctIndex], scenario.answerClass);
      assert.equal(new Set(question.options).size, question.options.length);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
      assert.ok(question.explanation.includes(asmLocalized(scenario.rationale, language)));
      if (scenario.answerClass === "BOTH_FALSE") {
        assert.equal(question.optionProfile, "EXTENDED_5");
        assert.equal(question.options.length, 5);
      }
      directSurfaces += 1;
    }
  }
}

let batchSurfaces = 0;
for (const difficulty of [...DIFFICULTIES, undefined] as const) {
  const pool = listAsm001ScenarioAuthorities(difficulty);
  const result = await generateAsm001QuestionStudioBatch({
    packageId: "ASM-001",
    language: "en",
    difficulty,
    count: pool.length,
    seed: `asm-post-closure-batch:${difficulty ?? "Mixed"}`,
  });
  assert.equal(result.questions.length, pool.length);
  const scenarioIds = result.questions.map((question) => String(question.traceability?.scenarioId));
  assert.equal(new Set(scenarioIds).size, pool.length);
  assert.equal(result.generationContext?.withoutReplacement, true);
  assert.equal(result.generationContext?.availableDistinctScenarioCount, pool.length);
  assert.deepEqual(result.generationContext?.scenarioIds, scenarioIds);
  assert.ok(result.questions.every((question) => question.questionBankWritable === false));
  assert.ok(result.questions.every((question) => question.testEligible === false));
  assert.ok(result.questions.every((question) => question.mockTestEligible === false));
  assert.ok(result.questions.every((question) => question.publiclyPublishable === false));
  batchSurfaces += result.questions.length;

  await assert.rejects(
    () => generateAsm001QuestionStudioBatch({
      packageId: "ASM-001",
      language: "en",
      difficulty,
      count: pool.length + 1,
      seed: `asm-post-closure-over:${difficulty ?? "Mixed"}`,
    }),
    /distinct curated .* scenarios/i,
  );
}

const adapterHard = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "ASM-001",
  language: "pa",
  difficulty: "Hard",
  count: 5,
  seed: "asm-post-closure-adapter-hard",
});
assert.equal(adapterHard.questions.length, 5);
assert.equal(
  new Set(adapterHard.questions.map((question) => String(question.traceability?.scenarioId))).size,
  5,
);
assert.ok(adapterHard.questions.every((question) => question.difficulty === "Hard"));
assert.ok(adapterHard.questions.every((question) => /[਀-੿]/u.test(String(question.stem))));

assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ASM_001_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);

console.log(JSON.stringify({
  status: "PASS_ASM_001_POST_CLOSURE_AUDIT_20261004",
  curatedScenarioCount: ASM_001_SCENARIO_AUTHORITIES.length,
  directSurfaces,
  batchSurfaces,
  totalAuditedGeneratedSurfaces: directSurfaces + batchSurfaces + adapterHard.questions.length,
  difficultyPools: Object.fromEntries(
    DIFFICULTIES.map((difficulty) => [difficulty, listAsm001ScenarioAuthorities(difficulty).length]),
  ),
  allFiveAnswerClassesPerDifficulty: true,
  withoutReplacement: true,
  reviewOnly: true,
}, null, 2));
