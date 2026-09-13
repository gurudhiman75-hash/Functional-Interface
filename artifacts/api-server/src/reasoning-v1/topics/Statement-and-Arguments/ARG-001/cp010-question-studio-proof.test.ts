import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import { ARG_CP007_EXAM_PROFILES, type ArgCp007Difficulty, type ArgCp007ExamProfile } from "./cp007-exam-profile-generator-v2.ts";
import { ARG_CP009_CHECKPOINT_ID, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import {
  ARG_CP010_QUESTION_STUDIO_AUTHORITY,
  ARG_CP010_QUESTION_STUDIO_PACKAGE,
  ARG_CP010_REVIEW_STATUS,
  ARG_CP010_RUNTIME_MODE,
  generateArgCp010QuestionStudioBatch,
  isArgCp010CurrentReviewRequest,
  isArgCp010RealPaperRequest,
} from "./cp010-question-studio-adapter.ts";
import { ARG_CP010_AUTHORITY, ARG_CP010_CHECKPOINT_ID } from "./cp010-correlated-real-paper-generator.ts";
import { ARG_QL_IDS } from "./types.ts";

const PROFILE_DIFFICULTIES: readonly [ArgCp007ExamProfile, ArgCp007Difficulty][] = [
  ["SSC_RECENT_2X4", "Easy"],
  ["SSC_RECENT_2X4", "Medium"],
  ["BANKING_CLASSIC_2X5", "Medium"],
  ["BANKING_CLASSIC_2X5", "Hard"],
  ["BANKING_COMBO_3X5", "Medium"],
  ["BANKING_COMBO_3X5", "Hard"],
  ["BANKING_COMBO_4X5", "Hard"],
];

assert.equal(ARG_CP010_QUESTION_STUDIO_AUTHORITY, "ARG_CP010_QUESTION_STUDIO_REMEDIATED_REVIEW_V1");
assert.equal(ARG_CP010_RUNTIME_MODE, "REVIEW_ONLY_CP009_CP010_REMEDIATED");
assert.equal(ARG_CP010_REVIEW_STATUS, "QUESTION_STUDIO_REMEDIATED_REVIEW_CONNECTED");
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.currentCoreCheckpointId, ARG_CP009_CHECKPOINT_ID);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.currentRealPaperCheckpointId, ARG_CP010_CHECKPOINT_ID);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.coreEnglishAuthority, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.coreLocalizationAuthority, ARG_CP009_LOCALIZATION_AUTHORITY_V2);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.realPaperAuthority, ARG_CP010_AUTHORITY);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.learnerRelease, "LOCKED");

// The current router must recognize ordinary ARG requests plus every historical/current ARG checkpoint.
for (const request of [
  { packageId: "ARG-001" },
  { qlId: "ARG-QL-001" },
  { subtopic: "Statement & Arguments" },
  { topic: "Reasoning", subtopic: "Arguments" },
  { cpId: "ARG-CP-005", packageId: "ARG-001" },
  { cpId: "ARG-CP-007", packageId: "ARG-001" },
  { cpId: "ARG-CP-009", packageId: "ARG-001" },
  { cpId: "ARG-CP-010", packageId: "ARG-001" },
  { packageId: "ARG-001", examProfile: "BANKING_COMBO_4X5" },
] as const) {
  assert.equal(isArgCp010CurrentReviewRequest(request), true, `current router failed to recognize ${JSON.stringify(request)}`);
}
assert.equal(isArgCp010CurrentReviewRequest({ packageId: "NUM-002", subtopic: "Number System" }), false);
assert.equal(isArgCp010CurrentReviewRequest({ packageId: "TRI-001", subtopic: "Trigonometry" }), false);
assert.equal(isArgCp010RealPaperRequest({ cpId: "ARG-CP-007" }), true, "legacy CP007 requests must upgrade to CP010");
assert.equal(isArgCp010RealPaperRequest({ cpId: "ARG-CP-010" }), true);
assert.equal(isArgCp010RealPaperRequest({ profileMode: "real-paper" }), true);
assert.equal(isArgCp010RealPaperRequest({ examProfile: "SSC_RECENT_2X4" }), true);
assert.equal(isArgCp010RealPaperRequest({ cpId: "ARG-CP-005" }), false);
assert.equal(isArgCp010RealPaperRequest({ cpId: "ARG-CP-009" }), false);

function assertLocked(question: Readonly<Record<string, unknown>>) {
  assert.equal(question.currentQuestionStudioAuthority, ARG_CP010_QUESTION_STUDIO_AUTHORITY);
  assert.equal(question.runtimeMode, ARG_CP010_RUNTIME_MODE);
  assert.equal(question.reviewStatus, ARG_CP010_REVIEW_STATUS);
  assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
  assert.equal(question.manualApprovalRequired, true);
  assert.equal(question.persistenceAllowed, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.learnerRelease, "LOCKED");
}

function assertEqualWithoutNarrowing(actual: unknown, expected: unknown, message?: string): void {
  assert.equal(actual, expected, message);
}

// Ordinary/core Question Studio generation must now come from CP009, not the historical CP005/CP004 runtime.
for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    for (const qlId of ARG_QL_IDS) {
      const result = generateArgCp010QuestionStudioBatch({
        packageId: "ARG-001",
        language,
        difficulty,
        qlId,
        count: 2,
        seed: `CORE-${language}-${difficulty}-${qlId}`,
      } as any);
      assert.equal(result.authority, ARG_CP010_QUESTION_STUDIO_AUTHORITY);
      assert.equal(result.checkpointId, ARG_CP010_CHECKPOINT_ID);
      assert.equal(result.generationContext.profileMode, "core");
      assert.ok("sourceCheckpointId" in result.generationContext, "core generation context must expose its source checkpoint");
      assert.equal(result.generationContext.sourceCheckpointId, ARG_CP009_CHECKPOINT_ID);
      assert.equal(result.questions.length, 2);
      for (const question of result.questions) {
        assert.equal(question.profileMode, "core");
        assert.equal(question.qlId, qlId);
        assert.equal(question.language, language);
        assert.equal(question.difficulty, difficulty);
        assert.equal(question.sourceCheckpointId, ARG_CP009_CHECKPOINT_ID);
        assert.equal(
          question.sourceAuthority,
          language === "en" ? ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY : ARG_CP009_LOCALIZATION_AUTHORITY_V2,
        );
        assert.notEqual(question.sourceAuthority, "ARGUMENT_STRENGTH_VARIABLEIZED_V1");
        assertLocked(question as unknown as Readonly<Record<string, unknown>>);
      }
    }
  }
}

// Historical CP005 requests are intentionally upgraded into the current CP009 core path.
const legacyCore = generateArgCp010QuestionStudioBatch({
  cpId: "ARG-CP-005",
  qlId: "ARG-QL-004",
  language: "en",
  difficulty: "Easy",
  seed: "LEGACY-CP005-UPGRADE",
  count: 3,
});
assert.equal(legacyCore.generationContext.profileMode, "core");
assert.ok("sourceCheckpointId" in legacyCore.generationContext, "legacy CP005 upgrade must expose the CP009 source checkpoint");
assert.equal(legacyCore.generationContext.sourceCheckpointId, ARG_CP009_CHECKPOINT_ID);
for (const question of legacyCore.questions) assertLocked(question as unknown as Readonly<Record<string, unknown>>);

// Real-paper generation must use CP010 correlated scenarios for all profile/difficulty/locale combinations.
for (const [profile, difficulty] of PROFILE_DIFFICULTIES) {
  const metadata = ARG_CP007_EXAM_PROFILES[profile];
  for (const language of ["en", "hi", "pa"] as const) {
    const result = generateArgCp010QuestionStudioBatch({
      cpId: "ARG-CP-010",
      examProfile: profile,
      difficulty,
      language,
      count: 8,
      seed: `REAL-${profile}-${difficulty}-${language}`,
    });
    assert.equal(result.generationContext.profileMode, "real-paper");
    assert.equal(result.generationContext.sourceAuthority, ARG_CP010_AUTHORITY);
    assert.equal(result.questions.length, 8);
    for (const question of result.questions) {
      assertEqualWithoutNarrowing(question.profileMode, "real-paper");
      assert.ok("examProfile" in question, "real-paper question must expose its resolved exam profile");
      assertEqualWithoutNarrowing(question.examProfile, profile);
      assertEqualWithoutNarrowing(question.language, language);
      assertEqualWithoutNarrowing(question.difficulty, difficulty);
      assert.equal(question.arguments.length, metadata.argumentCount);
      assert.equal(question.options.length, metadata.optionCount);
      assert.equal(question.sourceAuthority, ARG_CP010_AUTHORITY);
      assertLocked(question as unknown as Readonly<Record<string, unknown>>);
    }
  }
}

// A legacy CP007 request must also be upgraded into the CP010 correlated layer.
const legacyRealPaper = generateArgCp010QuestionStudioBatch({
  cpId: "ARG-CP-007",
  language: "pa",
  difficulty: "Hard",
  examProfile: "BANKING_COMBO_4X5",
  seed: "LEGACY-CP007-UPGRADE",
  count: 5,
});
assert.equal(legacyRealPaper.sourceAuthority, ARG_CP010_AUTHORITY);
assert.equal(legacyRealPaper.generationContext.profileMode, "real-paper");
for (const question of legacyRealPaper.questions) {
  assert.equal(question.sourceAuthority, ARG_CP010_AUTHORITY);
  assertLocked(question as unknown as Readonly<Record<string, unknown>>);
}

// Deterministic Question Studio replay must survive the adapter.
for (const input of [
  { packageId: "ARG-001", qlId: "ARG-QL-002", language: "hi", difficulty: "Medium", seed: "REPLAY-CORE", count: 6 },
  { packageId: "ARG-001", qlId: "ARG-QL-006", language: "en", difficulty: "Hard", seed: "REPLAY-REAL", count: 6, examProfile: "BANKING_COMBO_4X5", profileMode: "real-paper" },
] as const) {
  assert.deepEqual(generateArgCp010QuestionStudioBatch(input), generateArgCp010QuestionStudioBatch(input));
}

// Registry order is part of the activation contract: current ARG router must precede both historical fallbacks.
// CI bundles this proof into artifacts/api-server/dist, so import.meta.url no longer points at the source tree.
// Resolve the registry from the working directory first, while retaining source-relative fallback for direct runs.
const registryCandidates = [
  resolve(process.cwd(), "src/routes/admin-question-studio-registry.ts"),
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  fileURLToPath(new URL("../../../../routes/admin-question-studio-registry.ts", import.meta.url)),
];
const registryPath = registryCandidates.find((candidate) => existsSync(candidate));
assert.ok(registryPath, `admin Question Studio registry was not found; checked: ${registryCandidates.join(", ")}`);
const registry = readFileSync(registryPath, "utf8");
const currentImport = registry.indexOf('adminQuestionStudioArgumentsCp010Router from "./admin-question-studio-arguments-cp010"');
const historicalCp007Import = registry.indexOf('adminQuestionStudioArgumentsCp007Router from "./admin-question-studio-arguments-cp007-v2"');
const historicalCp005Import = registry.indexOf('adminQuestionStudioArgumentsRouter from "./admin-question-studio-arguments"');
assert.ok(currentImport >= 0 && historicalCp007Import >= 0 && historicalCp005Import >= 0, "ARG router imports are incomplete");
const currentMount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp010Router)");
const historicalCp007Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp007Router)");
const historicalCp005Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsRouter)");
assert.ok(currentMount >= 0, "CP010 current router is not mounted");
assert.ok(currentMount < historicalCp007Mount, "CP010 must run before historical CP007");
assert.ok(currentMount < historicalCp005Mount, "CP010 must run before historical CP005");

console.log("ARG-001 CP010 Question Studio activation: PASS (CP009 core + CP010 real-paper current path; historical CP005/CP007 upgraded; learner gates locked)");
