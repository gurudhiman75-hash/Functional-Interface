import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../question-studio-review-engine";
import {
  listSapBankingSpeedEligibleQls,
  type SapBankingSpeedExamProfile,
} from "./banking-speed-profile";

const PROFILES = ["BANKING_PRELIMS", "BANKING_MAINS"] as const satisfies readonly SapBankingSpeedExamProfile[];
const RUNS_PER_PROFILE = 30;

function assertBankingQuestion(question: any, profile: SapBankingSpeedExamProfile) {
  assert.equal(question.examProfile, profile);
  assert.equal(question.runtimeMode, "SAP_BANKING_SPEED_PROFILE_V1");
  assert.equal(question.reviewStatus, "BANKING_SPEED_PROFILE_REVIEW_ONLY");
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.manualApprovalRequired, true);
  assert.equal(question.optionCount, 5);
  assert.equal(question.options.length, 5);
  assert.equal(new Set(question.options).size, 5);
  assert.equal(question.options[4], "None of these");
  assert.ok(Number.isInteger(question.correctIndex));
  assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3, "Known-false fifth option must never be correct.");
  assert.notEqual(question.options[question.correctIndex], "None of these");
  assert.equal(question.bankingSpeedProfile.fifthOptionPolicy, "KNOWN_FALSE_NONE_OF_THESE");
  assert.ok(Number(question.bankingSpeedProfile.targetSolveSeconds) > 0);
  assert.ok(
    question.bankingSpeedProfile.approximationContract === "EXACT_RESULT_REQUIRED"
      || question.bankingSpeedProfile.approximationContract === "CERTIFIED_APPROXIMATION_ONLY",
  );
  assert.ok(String(question.text ?? "").trim().length > 0);
  assert.ok(String(question.explanation ?? "").trim().length > 0);
  assert.equal(question.traceability.examProfile, profile);
  assert.equal(question.traceability.questionStudioDiscoverable, false);
  assert.equal(question.traceability.questionBankStatus, "NOT_STORED");
  assert.equal(question.traceability.testEligibility, "INELIGIBLE");
  assert.equal(question.traceability.publiclyPublishable, false);
}

const sapCapability = listQuantV4Packages().find((entry: any) => entry.packageId === "SAP") as any;
assert.ok(sapCapability, "SAP Question Studio capability is missing.");
assert.deepEqual(sapCapability.supportedExamProfiles, [
  "GENERIC_PRACTICE",
  "BANKING_PRELIMS",
  "BANKING_MAINS",
]);
assert.equal(sapCapability.optionCountByExamProfile.GENERIC_PRACTICE, 4);
assert.equal(sapCapability.optionCountByExamProfile.BANKING_PRELIMS, 5);
assert.equal(sapCapability.optionCountByExamProfile.BANKING_MAINS, 5);
assert.equal(sapCapability.bankingSpeedProfiles.BANKING_PRELIMS.questionBankStatus, "NOT_STORED");
assert.equal(sapCapability.bankingSpeedProfiles.BANKING_MAINS.testEligibility, "INELIGIBLE");

let bankingQuestionCount = 0;
let deterministicReplayCount = 0;
const correctPositions = new Set<number>();
const seenCheckpoints = new Set<string>();

for (const profile of PROFILES) {
  for (let index = 0; index < RUNS_PER_PROFILE; index += 1) {
    const seed = `SAP-BANKING-QS-ROUTING:${profile}:${index}`;
    const request = {
      packageId: "SAP" as const,
      examProfile: profile,
      language: "en" as const,
      difficulty: index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Medium" : "Hard",
      seed,
      count: 1,
    };
    const first = await generateQuestion(request);
    const replay = await generateQuestion(request);
    assert.deepEqual(first.questions, replay.questions, `Routing replay drifted for ${profile} seed ${index}.`);
    deterministicReplayCount += 1;

    assert.equal(first.generationContext.examProfile, profile);
    assert.equal(first.generationContext.optionCount, 5);
    assert.equal(first.generationContext.runtimeMode, "SAP_BANKING_SPEED_PROFILE_V1");
    assert.equal(first.generationContext.questionBankStatus, "NOT_STORED");
    assert.equal(first.generationContext.testEligibility, "INELIGIBLE");
    assert.equal(first.generationContext.publiclyPublishable, false);

    const question = first.questions[0] as any;
    assertBankingQuestion(question, profile);
    bankingQuestionCount += 1;
    correctPositions.add(question.correctIndex);
    seenCheckpoints.add(question.canonicalProblemId);
  }
}

assert.deepEqual([...correctPositions].sort(), [0, 1, 2, 3], "Banking routing did not exercise every valid A-D answer position.");
assert.ok(seenCheckpoints.size >= 6, `Banking routing diversity is too narrow: ${seenCheckpoints.size} checkpoints.`);

for (const profile of PROFILES) {
  const constrained = await generateQuestion({
    packageId: "SAP",
    examProfile: profile,
    canonicalProblemId: "SAP-CP-001",
    difficulty: "Medium",
    language: "en",
    seed: `SAP-BANKING-QS-CONSTRAINED:${profile}:CP001`,
    count: 4,
  });
  assert.equal(constrained.questions.length, 4);
  for (const question of constrained.questions as any[]) {
    assertBankingQuestion(question, profile);
    assert.equal(question.canonicalProblemId, "SAP-CP-001");
  }
}

const mainsCp012 = await generateQuestion({
  packageId: "SAP",
  examProfile: "BANKING_MAINS",
  canonicalProblemId: "SAP-CP-012",
  difficulty: "Hard",
  language: "en",
  seed: "SAP-BANKING-QS-MAINS-CP012",
  count: 2,
});
for (const question of mainsCp012.questions as any[]) {
  assertBankingQuestion(question, "BANKING_MAINS");
  assert.equal(question.canonicalProblemId, "SAP-CP-012");
}

await assert.rejects(
  () => generateQuestion({
    packageId: "SAP",
    examProfile: "BANKING_PRELIMS",
    canonicalProblemId: "SAP-CP-012",
    language: "en",
    seed: "SAP-BANKING-QS-PRELIMS-CP012-REJECT",
    count: 1,
  }),
  /not eligible for BANKING_PRELIMS/u,
);

const mismatchedQl = listSapBankingSpeedEligibleQls("BANKING_MAINS")
  .find((descriptor) => descriptor.checkpointId !== "SAP-CP-001")!;
assert.ok(mismatchedQl);
await assert.rejects(
  () => generateQuestion({
    packageId: "SAP",
    examProfile: "BANKING_MAINS",
    canonicalProblemId: "SAP-CP-001",
    questionLanguageId: mismatchedQl.qlId,
    language: "en",
    seed: "SAP-BANKING-QS-OWNERSHIP-REJECT",
    count: 1,
  }),
  /is owned by/u,
);

await assert.rejects(
  () => generateQuestion({
    packageId: "SAP",
    examProfile: "BANKING_PRELIMS",
    language: "hi",
    seed: "SAP-BANKING-QS-HINDI-REJECT",
    count: 1,
  }),
  /English-only/u,
);

const generic = await generateQuestion({
  packageId: "SAP",
  language: "en",
  difficulty: "Medium",
  seed: "SAP-GENERIC-QS-NON-REGRESSION",
  count: 2,
});
assert.equal(generic.questions.length, 2);
for (const question of generic.questions as any[]) {
  assert.equal(question.options.length, 4, "Generic SAP must remain on its frozen four-option learner surface.");
  assert.notEqual(question.runtimeMode, "SAP_BANKING_SPEED_PROFILE_V1");
  assert.equal(question.examProfile, undefined);
}

const here = dirname(fileURLToPath(import.meta.url));
const routeSource = readFileSync(
  resolve(here, "../../../../../routes/admin-question-studio-average.ts"),
  "utf8",
);
const sharedFacadeSource = readFileSync(
  resolve(here, "../../../../../question-studio/shared-generation-engine.ts"),
  "utf8",
);
assert.ok(routeSource.includes("resolveSapBankingExamProfile"), "Authenticated Question Studio route no longer retains SAP Banking profile inference.");
assert.ok(routeSource.includes("resolveQuantQuestionStudioExamProfile"), "Authenticated Question Studio route does not resolve the shared Quant exam profile.");
assert.ok(routeSource.includes("examProfile: quantExamProfile"), "Authenticated Question Studio route drops the resolved shared Quant exam profile.");
assert.ok(routeSource.includes("sapBankingExamProfile"), "Authenticated Question Studio route no longer preserves the SAP Banking readiness guard.");
assert.ok(routeSource.includes("supportedExamProfiles"), "Capabilities route does not expose SAP exam-profile support.");
assert.ok(routeSource.includes("optionCountByExamProfile"), "Capabilities route does not expose profile option counts.");
assert.ok(sharedFacadeSource.includes("generateQuantQuestionStudioQuestion(request as any)"), "Shared Question Studio facade no longer delegates Quant requests to the guarded review facade.");

console.log(JSON.stringify({
  status: "PASS_SAP_BANKING_QUESTION_STUDIO_ROUTING_P1",
  bankingQuestionCount,
  deterministicReplayCount,
  profiles: [...PROFILES],
  correctPositions: [...correctPositions].sort(),
  distinctCheckpoints: seenCheckpoints.size,
  explicitCheckpointProofs: 10,
  genericSapNonRegressionQuestions: generic.questions.length,
}));
