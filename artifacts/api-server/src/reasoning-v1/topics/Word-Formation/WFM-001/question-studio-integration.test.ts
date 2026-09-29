import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter";
import {
  WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
  WFM001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
} from "./question-studio-integration";
import { WFM_001_QL_IDS } from "./runtime";
import type { WfmQlId } from "./types";

const difficulties = ["Easy", "Medium", "Hard"] as const;
const languages = ["en", "hi", "pa"] as const;

const packages = reasoningV1QuestionStudioAdapter.listPackages();
const wfmPackages = packages.filter((entry) => entry.packageId === WFM001_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.equal(wfmPackages.length, 1, "WFM-001 must be registered exactly once in the normal Reasoning V1 engine");
assert.deepEqual(wfmPackages[0], WFM001_STANDARD_REVIEW_ONLY_PACKAGE_V1);
assert.equal(wfmPackages[0]!.enabled, true);
assert.equal(wfmPackages[0]!.lifecycleStage, "REVIEW_ONLY");
assert.equal(wfmPackages[0]!.questionBankWritable, false);
assert.equal(wfmPackages[0]!.testEligible, false);
assert.equal(wfmPackages[0]!.mockTestEligible, false);
assert.equal(wfmPackages[0]!.publiclyPublishable, false);
assert.equal(wfmPackages[0]!.automaticStudentPublication, false);

let generatedCount = 0;

for (const qlId of WFM_001_QL_IDS) {
  for (const difficulty of difficulties) {
    for (const language of languages) {
      for (let sample = 0; sample < 2; sample += 1) {
        const seed = `wfm-integration:${qlId}:${difficulty}:${language}:${sample}`;
        const request = {
          engineId: "reasoning-v1" as const,
          packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
          patternId: qlId,
          difficulty,
          language,
          count: 1,
          seed,
          runtimeMode: "review-only",
          exam: qlId === "WFM-QL-005" || qlId === "WFM-QL-006"
            ? "IBPS PO"
            : language === "pa"
              ? "Punjab Police"
              : "SSC CGL",
        };
        const first = await reasoningV1QuestionStudioAdapter.generate(request);
        const replay = await reasoningV1QuestionStudioAdapter.generate(request);

        assert.deepEqual(replay, first, `${qlId}/${difficulty}/${language}/${sample}: generation must replay deterministically`);
        assert.equal(first.questions.length, 1);
        const question = first.questions[0]!;

        assert.equal(question.packageId, WFM001_QUESTION_STUDIO_PACKAGE_ID_V1);
        assert.equal(question.qlId, qlId);
        assert.equal(question.patternId, qlId);
        assert.equal(question.difficulty, difficulty);
        assert.equal(question.language, language);
        assert.equal(question.reviewOnly, true);
        assert.equal(question.questionBankWritable, false);
        assert.equal(question.testEligible, false);
        assert.equal(question.mockTestEligible, false);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.automaticStudentPublication, false);
        assert.equal(question.questionStudioDiscoverable, true);
        assert.equal(question.questionStudioGenerationEnabled, true);
        assert.equal(question.runtimeRegistered, true);
        assert.equal(question.productionReleased, false);

        const options = question.options as readonly string[];
        const expectedOptionCount = qlId === "WFM-QL-005" || qlId === "WFM-QL-006" ? 5 : 4;
        assert.equal(options.length, expectedOptionCount);
        assert.equal(new Set(options).size, expectedOptionCount);
        assert.ok(Number.isInteger(question.correctIndex));
        assert.ok((question.correctIndex as number) >= 0 && (question.correctIndex as number) < expectedOptionCount);
        assert.ok(String(question.stem).trim().length >= 20);
        assert.ok(String(question.explanation).trim().length >= 45);

        const validation = question.validation as Record<string, unknown>;
        assert.equal(validation.rawRuntimeQuestionStudioVisible, false);
        assert.equal(validation.difficultyDerivedFromGeneratedInstance, true);
        assert.equal(validation.optionCountVerified, true);

        generatedCount++;
      }
    }
  }
}

for (const [cpId, expectedQls] of [
  ["WFM-CP-001", ["WFM-QL-001", "WFM-QL-002"]],
  ["WFM-CP-002", ["WFM-QL-003"]],
  ["WFM-CP-003", ["WFM-QL-004"]],
  ["WFM-CP-004", ["WFM-QL-005"]],
  ["WFM-CP-005", ["WFM-QL-006"]],
] as const) {
  const result = await reasoningV1QuestionStudioAdapter.generate({
    packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: cpId,
    count: expectedQls.length,
    seed: `wfm-cp-scope:${cpId}`,
    language: "en",
    exam: cpId === "WFM-CP-004" || cpId === "WFM-CP-005" ? "SBI Clerk" : "SSC CGL",
  });
  const qls = new Set(result.questions.map((question) => String(question.qlId)));
  for (const qlId of expectedQls) assert(qls.has(qlId), `${cpId} did not generate owned QL ${qlId}`);
}

await assert.rejects(
  () => reasoningV1QuestionStudioAdapter.generate({
    packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: "WFM-QL-999",
    count: 1,
  }),
  /Unknown WFM-001 selector/i,
);

const banking = await reasoningV1QuestionStudioAdapter.generate({
  packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
  count: 12,
  exam: "IBPS PO",
  language: "en",
  seed: "wfm-banking-pool-proof",
});
assert.equal(banking.questions.length, 12);
for (const question of banking.questions) {
  assert.ok(["WFM-QL-003", "WFM-QL-005", "WFM-QL-006"].includes(String(question.qlId)));
  assert.equal((question.options as readonly string[]).length, 5);
  assert.equal(question.examProfile, "BANKING_5");
}

console.log(JSON.stringify({
  status: "PASS_WFM_001_NORMAL_QUESTION_STUDIO_INTEGRATION",
  permanentQlIds: WFM_001_QL_IDS as readonly WfmQlId[],
  integrationCases: generatedCount,
  lifecycle: "REVIEW_ONLY",
}, null, 2));
