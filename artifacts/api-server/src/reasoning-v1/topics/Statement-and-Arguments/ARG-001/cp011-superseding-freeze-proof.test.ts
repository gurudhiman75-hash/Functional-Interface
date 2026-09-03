import assert from "node:assert/strict";

import { ARG_CP007_EXAM_PROFILES, type ArgCp007Difficulty, type ArgCp007ExamProfile } from "./cp007-exam-profile-generator-v2.ts";
import { ARG_CP009_CHECKPOINT_ID, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import { ARG_CP010_AUTHORITY, ARG_CP010_CHECKPOINT_ID } from "./cp010-correlated-real-paper-generator.ts";
import {
  ARG_CP010_QUESTION_STUDIO_AUTHORITY,
  ARG_CP010_QUESTION_STUDIO_PACKAGE,
  generateArgCp010QuestionStudioBatch,
} from "./cp010-question-studio-adapter.ts";
import {
  ARG_CP011_AUDIT_STATUS,
  ARG_CP011_CHECKPOINT_ID,
  ARG_CP011_SUPERSEDING_FREEZE,
  ARG_CP011_SUPERSEDING_FREEZE_AUTHORITY,
} from "./cp011-superseding-freeze-manifest.ts";
import { ARG_QL_IDS } from "./types.ts";

const freeze = ARG_CP011_SUPERSEDING_FREEZE;

assert.equal(ARG_CP011_CHECKPOINT_ID, "ARG-CP-011");
assert.equal(ARG_CP011_SUPERSEDING_FREEZE_AUTHORITY, "ARG_CP011_POST_REMEDIATION_SUPERSEDING_FREEZE_V1");
assert.equal(ARG_CP011_AUDIT_STATUS, "TECHNICAL_RELEASE_READY_MANUAL_EDITORIAL_APPROVAL_REQUIRED");
assert.equal(freeze.currentAuthorities.coreCheckpointId, ARG_CP009_CHECKPOINT_ID);
assert.equal(freeze.currentAuthorities.english, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY);
assert.equal(freeze.currentAuthorities.localization, ARG_CP009_LOCALIZATION_AUTHORITY_V2);
assert.equal(freeze.currentAuthorities.realPaperCheckpointId, ARG_CP010_CHECKPOINT_ID);
assert.equal(freeze.currentAuthorities.realPaper, ARG_CP010_AUTHORITY);
assert.equal(freeze.currentAuthorities.questionStudio, ARG_CP010_QUESTION_STUDIO_AUTHORITY);
assert.deepEqual(freeze.doesNotRewriteHistoricalAuthorities, ["ARG-CP-003", "ARG-CP-006", "ARG-CP-008"]);
assert.equal(freeze.coverage.permanentQlCount, 6);
assert.deepEqual(freeze.coverage.permanentQlIds, ARG_QL_IDS);
assert.equal(freeze.coverage.englishExhaustiveSurfaceCount, 12_288);
assert.equal(freeze.coverage.localizedExhaustiveSurfaceCount, 24_576);
assert.equal(freeze.coverage.totalExhaustivelyProvedCoreSurfaces, 36_864);
assert.equal(freeze.coverage.correlatedRealPaperRemediationRequired, true);
assert.equal(freeze.coverage.deterministicGenerationRequired, true);
assert.equal(freeze.coverage.registryPrecedenceRequired, true);

assert.equal(freeze.lifecycle.reviewOnly, true);
assert.equal(freeze.lifecycle.manualEditorialApprovalRequired, true);
assert.equal(freeze.lifecycle.separateLearnerReleaseApprovalRequired, true);
assert.equal(freeze.lifecycle.persistenceAllowed, false);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.mockTestEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.equal(freeze.lifecycle.automaticStudentPublication, false);
assert.equal(freeze.lifecycle.learnerRelease, "LOCKED_PENDING_MANUAL_EDITORIAL_APPROVAL");

// The runtime package itself must remain locked even though CP011 technically freezes remediation.
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(ARG_CP010_QUESTION_STUDIO_PACKAGE.learnerRelease, "LOCKED");

// QL × difficulty × language smoke matrix over the already exhaustively-proved CP009 authorities.
for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    for (const qlId of ARG_QL_IDS) {
      const input = {
        packageId: "ARG-001",
        qlId,
        language,
        difficulty,
        count: 1,
        seed: `CP011-CORE-${language}-${difficulty}-${qlId}`,
      } as const;
      const first = generateArgCp010QuestionStudioBatch(input as any);
      const replay = generateArgCp010QuestionStudioBatch(input as any);
      assert.deepEqual(first, replay, `non-deterministic CP011 core replay for ${language}/${difficulty}/${qlId}`);
      assert.equal(first.questions.length, 1);
      const question = first.questions[0]!;
      assert.equal(question.profileMode, "core");
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.difficulty, difficulty);
      assert.equal(question.sourceCheckpointId, ARG_CP009_CHECKPOINT_ID);
      assert.equal(
        question.sourceAuthority,
        language === "en" ? ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY : ARG_CP009_LOCALIZATION_AUTHORITY_V2,
      );
      assert.equal(question.currentQuestionStudioAuthority, ARG_CP010_QUESTION_STUDIO_AUTHORITY);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.learnerRelease, "LOCKED");
    }
  }
}

// Every supported real-paper profile/difficulty/locale must remain on correlated CP010 authority.
for (const [profileName, profileMetadata] of Object.entries(ARG_CP007_EXAM_PROFILES) as [ArgCp007ExamProfile, (typeof ARG_CP007_EXAM_PROFILES)[ArgCp007ExamProfile]][]) {
  for (const difficulty of profileMetadata.supportedDifficulties as readonly ArgCp007Difficulty[]) {
    for (const language of ["en", "hi", "pa"] as const) {
      const input = {
        packageId: "ARG-001",
        cpId: "ARG-CP-010",
        examProfile: profileName,
        difficulty,
        language,
        count: 2,
        seed: `CP011-REAL-${profileName}-${difficulty}-${language}`,
      } as const;
      const first = generateArgCp010QuestionStudioBatch(input as any);
      const replay = generateArgCp010QuestionStudioBatch(input as any);
      assert.deepEqual(first, replay, `non-deterministic CP011 real-paper replay for ${profileName}/${difficulty}/${language}`);
      assert.equal(first.questions.length, 2);
      assert.equal(first.sourceAuthority, ARG_CP010_AUTHORITY);
      for (const question of first.questions) {
        assert.equal(question.profileMode, "real-paper");
        assert.ok("examProfile" in question);
        assert.equal(question.examProfile, profileName);
        assert.equal(question.language, language);
        assert.equal(question.difficulty, difficulty);
        assert.equal(question.sourceCheckpointId, ARG_CP010_CHECKPOINT_ID);
        assert.equal(question.sourceAuthority, ARG_CP010_AUTHORITY);
        assert.equal(question.arguments.length, profileMetadata.argumentCount);
        assert.equal(question.options.length, profileMetadata.optionCount);
        assert.equal(question.currentQuestionStudioAuthority, ARG_CP010_QUESTION_STUDIO_AUTHORITY);
        assert.equal(question.questionBankWritable, false);
        assert.equal(question.testEligible, false);
        assert.equal(question.mockTestEligible, false);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.automaticStudentPublication, false);
        assert.equal(question.learnerRelease, "LOCKED");
      }
    }
  }
}

console.log("ARG-001 CP011 superseding freeze: PASS (CP009 core + CP010 correlated real-paper technically frozen; learner release remains separately locked)");
