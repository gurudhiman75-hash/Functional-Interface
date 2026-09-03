import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import { ARG_CP007_EXAM_PROFILES, type ArgCp007Difficulty, type ArgCp007ExamProfile } from "./cp007-exam-profile-generator-v2.ts";
import { ARG_CP009_CHECKPOINT_ID, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import { ARG_CP010_AUTHORITY, ARG_CP010_CHECKPOINT_ID } from "./cp010-correlated-real-paper-generator.ts";
import {
  ARG_CP012_QUESTION_STUDIO_AUTHORITY,
  ARG_CP012_QUESTION_STUDIO_PACKAGE,
  ARG_CP012_REVIEW_STATUS,
  ARG_CP012_RUNTIME_MODE,
  generateArgCp012QuestionStudioBatch,
  isArgCp012CurrentReviewRequest,
  isArgCp012RealPaperRequest,
} from "./cp012-question-studio-adapter.ts";
import { ARG_CP012_AUTHORITY, ARG_CP012_CHECKPOINT_ID } from "./cp012-editorial-real-paper-remediation.ts";
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

assert.equal(ARG_CP012_QUESTION_STUDIO_AUTHORITY, "ARG_CP012_QUESTION_STUDIO_EDITORIAL_REMEDIATION_V1");
assert.equal(ARG_CP012_RUNTIME_MODE, "REVIEW_ONLY_CP009_CORE_CP012_REAL_PAPER");
assert.equal(ARG_CP012_REVIEW_STATUS, "QUESTION_STUDIO_CP012_EDITORIAL_REMEDIATION_CONNECTED");
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.currentCoreCheckpointId, ARG_CP009_CHECKPOINT_ID);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.currentRealPaperCheckpointId, ARG_CP012_CHECKPOINT_ID);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.coreEnglishAuthority, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.coreLocalizationAuthority, ARG_CP009_LOCALIZATION_AUTHORITY_V2);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.historicalRealPaperAuthority, ARG_CP010_AUTHORITY);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.realPaperAuthority, ARG_CP012_AUTHORITY);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(ARG_CP012_QUESTION_STUDIO_PACKAGE.learnerRelease, "LOCKED");

for (const request of [
  { packageId: "ARG-001" },
  { qlId: "ARG-QL-001" },
  { subtopic: "Statement & Arguments" },
  { cpId: "ARG-CP-005", packageId: "ARG-001" },
  { cpId: "ARG-CP-007", packageId: "ARG-001" },
  { cpId: "ARG-CP-010", packageId: "ARG-001" },
  { cpId: "ARG-CP-012", packageId: "ARG-001" },
  { packageId: "ARG-001", examProfile: "BANKING_COMBO_4X5" },
] as const) {
  assert.equal(isArgCp012CurrentReviewRequest(request), true, `CP012 router failed to recognize ${JSON.stringify(request)}`);
}
assert.equal(isArgCp012CurrentReviewRequest({ packageId: "NUM-002", subtopic: "Number System" }), false);
assert.equal(isArgCp012RealPaperRequest({ cpId: "ARG-CP-007" }), true, "legacy CP007 must upgrade to CP012");
assert.equal(isArgCp012RealPaperRequest({ cpId: "ARG-CP-010" }), true, "CP010 requests must upgrade to CP012");
assert.equal(isArgCp012RealPaperRequest({ cpId: "ARG-CP-012" }), true);
assert.equal(isArgCp012RealPaperRequest({ examProfile: "SSC_RECENT_2X4" }), true);
assert.equal(isArgCp012RealPaperRequest({ cpId: "ARG-CP-009" }), false);

function assertLocked(question: Readonly<Record<string, unknown>>) {
  assert.equal(question.currentQuestionStudioAuthority, ARG_CP012_QUESTION_STUDIO_AUTHORITY);
  assert.equal(question.runtimeMode, ARG_CP012_RUNTIME_MODE);
  assert.equal(question.reviewStatus, ARG_CP012_REVIEW_STATUS);
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

// Core semantics remain CP009; CP012 only supersedes the active Question Studio wrapper and real-paper path.
for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    for (const qlId of ARG_QL_IDS) {
      const result = generateArgCp012QuestionStudioBatch({
        language,
        difficulty,
        qlId,
        count: 2,
        seed: `CP012-CORE-${language}-${difficulty}-${qlId}`,
      });
      assert.equal(result.authority, ARG_CP012_QUESTION_STUDIO_AUTHORITY);
      assert.equal(result.checkpointId, ARG_CP012_CHECKPOINT_ID);
      assert.equal(result.generationContext.profileMode, "core");
      assert.equal(result.generationContext.currentCoreCheckpointId, ARG_CP009_CHECKPOINT_ID);
      assert.equal(result.generationContext.currentRealPaperCheckpointId, ARG_CP012_CHECKPOINT_ID);
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
        assertLocked(question as unknown as Readonly<Record<string, unknown>>);
      }
    }
  }
}

// All real-paper requests now resolve through CP012, including historical CP007 and CP010 IDs.
for (const [profile, difficulty] of PROFILE_DIFFICULTIES) {
  const profileMeta = ARG_CP007_EXAM_PROFILES[profile];
  for (const language of ["en", "hi", "pa"] as const) {
    const result = generateArgCp012QuestionStudioBatch({
      cpId: "ARG-CP-012",
      examProfile: profile,
      difficulty,
      language,
      count: 12,
      seed: `CP012-REAL-${profile}-${difficulty}-${language}`,
    });
    assert.equal(result.sourceAuthority, ARG_CP012_AUTHORITY);
    assert.equal(result.generationContext.profileMode, "real-paper");
    assert.equal(result.generationContext.currentRealPaperCheckpointId, ARG_CP012_CHECKPOINT_ID);
    assert.equal(result.questions.length, 12);
    for (const question of result.questions) {
      assert.equal(question.profileMode, "real-paper");
      assert.equal(question.examProfile, profile);
      assert.equal(question.language, language);
      assert.equal(question.difficulty, difficulty);
      assert.equal(question.arguments.length, profileMeta.argumentCount);
      assert.equal(question.options.length, profileMeta.optionCount);
      assert.equal(question.sourceAuthority, ARG_CP012_AUTHORITY);
      assert.equal(question.supersedesRealPaperAuthority, ARG_CP010_AUTHORITY);
      assertLocked(question as unknown as Readonly<Record<string, unknown>>);
    }
  }
}

for (const cpId of ["ARG-CP-007", "ARG-CP-010", "ARG-CP-012"] as const) {
  const result = generateArgCp012QuestionStudioBatch({
    cpId,
    language: "pa",
    difficulty: "Hard",
    examProfile: "BANKING_COMBO_4X5",
    seed: `UPGRADE-${cpId}`,
    count: 5,
  });
  assert.equal(result.sourceAuthority, ARG_CP012_AUTHORITY);
  for (const question of result.questions) assertLocked(question as unknown as Readonly<Record<string, unknown>>);
}

// Deterministic adapter replay.
for (const input of [
  { qlId: "ARG-QL-002", language: "hi", difficulty: "Medium", seed: "CP012-REPLAY-CORE", count: 6 },
  { qlId: "ARG-QL-006", language: "en", difficulty: "Hard", seed: "CP012-REPLAY-REAL", count: 6, examProfile: "BANKING_COMBO_4X5", profileMode: "real-paper" },
] as const) {
  assert.deepEqual(generateArgCp012QuestionStudioBatch(input), generateArgCp012QuestionStudioBatch(input));
}

// Registry precedence: CP012 current route must run before CP010, CP007 and CP005 fallbacks.
const registryCandidates = [
  resolve(process.cwd(), "src/routes/admin-question-studio-registry.ts"),
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  fileURLToPath(new URL("../../../../routes/admin-question-studio-registry.ts", import.meta.url)),
];
const registryPath = registryCandidates.find((candidate) => existsSync(candidate));
assert.ok(registryPath, `admin Question Studio registry was not found; checked: ${registryCandidates.join(", ")}`);
const registry = readFileSync(registryPath, "utf8");
const cp012Import = registry.indexOf('adminQuestionStudioArgumentsCp012Router from "./admin-question-studio-arguments-cp012"');
const cp010Import = registry.indexOf('adminQuestionStudioArgumentsCp010Router from "./admin-question-studio-arguments-cp010"');
const cp007Import = registry.indexOf('adminQuestionStudioArgumentsCp007Router from "./admin-question-studio-arguments-cp007-v2"');
const cp005Import = registry.indexOf('adminQuestionStudioArgumentsRouter from "./admin-question-studio-arguments"');
assert.ok(cp012Import >= 0 && cp010Import >= 0 && cp007Import >= 0 && cp005Import >= 0, "ARG router imports are incomplete");
const cp012Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp012Router)");
const cp010Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp010Router)");
const cp007Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp007Router)");
const cp005Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsRouter)");
assert.ok(cp012Mount >= 0, "CP012 current router is not mounted");
assert.ok(cp012Mount < cp010Mount, "CP012 must run before historical CP010");
assert.ok(cp012Mount < cp007Mount, "CP012 must run before historical CP007");
assert.ok(cp012Mount < cp005Mount, "CP012 must run before historical CP005");

assert.notEqual(ARG_CP012_CHECKPOINT_ID, ARG_CP010_CHECKPOINT_ID);
console.log("ARG-001 CP012 Question Studio activation: PASS (CP009 core retained; CP012 real-paper remediation active; CP010/CP007/CP005 demoted to historical fallbacks; learner gates locked)");
