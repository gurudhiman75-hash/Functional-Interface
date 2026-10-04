import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { CLK_001_AUTHORING_TASKS_BY_QL_V1 } from "./authoring-variants-v1";
import { CLK_001_PERMANENT_CONTRACTS, CLK_001_PERMANENT_QL_IDS } from "./permanent-contracts";
import { generateClk001QuestionStudioBatch } from "./question-studio-integration";
import { generateClockQuestion } from "./runtime/generator";

const LANGUAGES = ["en", "hi", "pa"] as const;
const SAMPLES_PER_TASK = 4;

assert.equal(CLK_001_PERMANENT_QL_IDS.length, 23);
assert.equal(CLK_001_PERMANENT_CONTRACTS.length, 23);

const allAuthoringTasks = new Set<string>();
for (const contract of CLK_001_PERMANENT_CONTRACTS) {
  const tasks = CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId];
  assert.ok(tasks.length > 0, `${contract.qlId}: no enabled authoring tasks`);
  assert.ok(tasks.includes(contract.anchorTaskId), `${contract.qlId}: anchor task missing from authoring pool`);
  for (const taskId of tasks) allAuthoringTasks.add(taskId);
}

assert.equal(
  allAuthoringTasks.size,
  78,
  "CLK-001 current authoring surface must contain 23 anchors + 55 enabled merged variants",
);

let englishAuthoringSurfaces = 0;
let dualOracleSurfaces = 0;
const structuralOnly: Array<{ qlId: string; taskId: string; seed: number }> = [];
const fingerprints = new Set<string>();

for (const contract of CLK_001_PERMANENT_CONTRACTS) {
  for (const taskId of CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId]) {
    for (let seed = 0; seed < SAMPLES_PER_TASK; seed += 1) {
      const question = generateClockQuestion({
        taskId,
        seed: `clk-post-closure:${contract.qlId}:${taskId}:${seed}`,
        locale: "en-IN",
        correctOptionIndex: (seed % 4) as 0 | 1 | 2 | 3,
      });

      assert.equal(question.solveTrace.agreement, true);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option) => option.display)).size, 4);
      assert.equal(new Set(question.options.map((option) => option.semanticKey)).size, 4);
      assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(
        question.options[question.correctOptionIndex]?.semanticKey,
        question.answer.semanticKey,
      );

      if (question.solveTrace.proofLevel === "DUAL_ANSWER_ORACLE") {
        dualOracleSurfaces += 1;
        assert.equal(question.solveTrace.canonicalAnswerKey, question.solveTrace.verifierAnswerKey);
      } else {
        structuralOnly.push({ qlId: contract.qlId, taskId, seed });
      }

      fingerprints.add(createHash("sha256").update(JSON.stringify([
        contract.qlId,
        taskId,
        question.stem,
        question.answer.semanticKey,
        question.options.map((option) => option.semanticKey),
      ])).digest("hex"));
      englishAuthoringSurfaces += 1;
    }
  }
}

assert.deepEqual(
  structuralOnly,
  [],
  "Every current CLK-001 authoring task must retain a dual answer oracle; structural-only records are discovery evidence, not frozen authoring authority.",
);

let questionStudioSurfaces = 0;
for (const qlId of CLK_001_PERMANENT_QL_IDS) {
  const byLanguage = new Map<string, Record<string, any>>();
  for (const language of LANGUAGES) {
    const result = await generateClk001QuestionStudioBatch({
      packageId: "CLK-001",
      canonicalProblemId: qlId,
      language,
      difficulty: "Mixed",
      count: 1,
      seed: `clk-post-closure-studio:${qlId}`,
      runtimeMode: "review-only",
    });
    assert.equal(result.questions.length, 1);
    assert.ok(result.generationContext);
    assert.equal(result.generationContext.questionBankWritable, false);
    assert.equal(result.generationContext.testEligible, false);
    assert.equal(result.generationContext.mockTestEligible, false);
    assert.equal(result.generationContext.publiclyPublishable, false);
    assert.equal(result.generationContext.productionReleaseAuthorized, false);

    const question = result.questions[0] as Record<string, any>;
    assert.equal(question.qlId, qlId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.validation?.solverAgreement, true);
    assert.equal(question.validation?.semanticParityPreserved, true);
    assert.equal(question.validation?.correctIndexPreserved, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.reviewOnly, true);
    byLanguage.set(language, question);
    questionStudioSurfaces += 1;
  }
  const en = byLanguage.get("en")!;
  const hi = byLanguage.get("hi")!;
  const pa = byLanguage.get("pa")!;
  assert.equal(hi.correctIndex, en.correctIndex, `${qlId}: Hindi correct-index drift`);
  assert.equal(pa.correctIndex, en.correctIndex, `${qlId}: Punjabi correct-index drift`);
  assert.equal(
    (hi.traceability as any).semanticFingerprint,
    (en.traceability as any).semanticFingerprint,
    `${qlId}: Hindi semantic fingerprint drift`,
  );
  assert.equal(
    (pa.traceability as any).semanticFingerprint,
    (en.traceability as any).semanticFingerprint,
    `${qlId}: Punjabi semantic fingerprint drift`,
  );
}

console.log(JSON.stringify({
  status: "PASS_CLK_001_POST_CLOSURE_AUDIT_20261004",
  permanentQlCount: CLK_001_PERMANENT_QL_IDS.length,
  enabledAuthoringTaskCount: allAuthoringTasks.size,
  samplesPerTask: SAMPLES_PER_TASK,
  englishAuthoringSurfaces,
  dualOracleSurfaces,
  uniqueEnglishSurfaceFingerprints: fingerprints.size,
  questionStudioSurfaces,
  languages: LANGUAGES,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  productionReleaseAuthorized: false,
}, null, 2));
