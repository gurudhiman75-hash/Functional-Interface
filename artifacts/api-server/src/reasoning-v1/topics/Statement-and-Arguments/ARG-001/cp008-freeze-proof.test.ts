import assert from "node:assert/strict";

import {
  ARG_CP006_FROZEN_BLOBS,
  ARG_CP006_FROZEN_CONTRACT,
  ARG_CP006_FREEZE_AUTHORITY,
} from "./cp006-freeze-manifest.ts";
import {
  ARG_CP007_AUTHORITY,
  ARG_CP007_CHECKPOINT_ID,
  ARG_CP007_EXAM_PROFILES,
  ARG_CP007_PROFILE_TEMPLATE_IDS,
  generateArgCp007ExamProfileBatch,
} from "./cp007-exam-profile-generator-v2.ts";
import {
  ARG_CP008_CHECKPOINT_ID,
  ARG_CP008_EXAM_PROFILES,
  ARG_CP008_FREEZE_AUTHORITY,
  ARG_CP008_FROZEN_BLOBS,
  ARG_CP008_FROZEN_CONTRACT,
  ARG_CP008_LOCALES,
} from "./cp008-freeze-manifest.ts";
import { ARG_QL_IDS } from "./types.ts";

assert.equal(ARG_CP008_FROZEN_CONTRACT.chapterId, "ARG-001");
assert.equal(ARG_CP008_FROZEN_CONTRACT.subjectCode, "REAS-ARG");
assert.equal(ARG_CP008_FROZEN_CONTRACT.checkpointId, ARG_CP008_CHECKPOINT_ID);
assert.equal(ARG_CP008_FROZEN_CONTRACT.checkpointId, "ARG-CP-008");
assert.equal(ARG_CP008_FROZEN_CONTRACT.authority, ARG_CP008_FREEZE_AUTHORITY);
assert.equal(ARG_CP008_FROZEN_CONTRACT.authority, "ARG_CP008_REAL_PAPER_CLOSURE_V1");
assert.equal(ARG_CP008_FROZEN_CONTRACT.status, "FROZEN_CERTIFIED");

assert.equal(ARG_CP006_FROZEN_CONTRACT.status, "FROZEN_CERTIFIED");
assert.equal(ARG_CP006_FROZEN_CONTRACT.authority, ARG_CP006_FREEZE_AUTHORITY);
assert.equal(ARG_CP006_FREEZE_AUTHORITY, "ARG_CP006_IMMUTABLE_FREEZE_V1");
assert.equal(ARG_CP008_FROZEN_CONTRACT.preservesCp006Authority, ARG_CP006_FREEZE_AUTHORITY);
assert.equal(ARG_CP008_FROZEN_CONTRACT.closesCp007Authority, ARG_CP007_AUTHORITY);
assert.equal(ARG_CP007_AUTHORITY, "ARG_CP007_REAL_PAPER_PARITY_V2");
assert.equal(ARG_CP007_CHECKPOINT_ID, "ARG-CP-007");

assert.deepEqual(ARG_CP008_EXAM_PROFILES, [
  "SSC_RECENT_2X4",
  "BANKING_CLASSIC_2X5",
  "BANKING_COMBO_3X5",
  "BANKING_COMBO_4X5",
]);
assert.deepEqual(ARG_CP008_FROZEN_CONTRACT.examProfiles, ARG_CP008_EXAM_PROFILES);
assert.deepEqual(ARG_CP008_LOCALES, ["en-IN", "hi-IN", "pa-IN"]);
assert.deepEqual(ARG_CP008_FROZEN_CONTRACT.locales, ARG_CP008_LOCALES);

assert.equal(Object.keys(ARG_CP007_EXAM_PROFILES).length, 4);
assert.deepEqual(ARG_CP007_EXAM_PROFILES.SSC_RECENT_2X4.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(ARG_CP007_EXAM_PROFILES.SSC_RECENT_2X4.argumentCount, 2);
assert.equal(ARG_CP007_EXAM_PROFILES.SSC_RECENT_2X4.optionCount, 4);
assert.deepEqual(ARG_CP007_EXAM_PROFILES.BANKING_CLASSIC_2X5.supportedDifficulties, ["Medium", "Hard"]);
assert.equal(ARG_CP007_EXAM_PROFILES.BANKING_CLASSIC_2X5.argumentCount, 2);
assert.equal(ARG_CP007_EXAM_PROFILES.BANKING_CLASSIC_2X5.optionCount, 5);
assert.deepEqual(ARG_CP007_EXAM_PROFILES.BANKING_COMBO_3X5.supportedDifficulties, ["Medium", "Hard"]);
assert.equal(ARG_CP007_EXAM_PROFILES.BANKING_COMBO_3X5.argumentCount, 3);
assert.equal(ARG_CP007_EXAM_PROFILES.BANKING_COMBO_3X5.optionCount, 5);
assert.deepEqual(ARG_CP007_EXAM_PROFILES.BANKING_COMBO_4X5.supportedDifficulties, ["Hard"]);
assert.equal(ARG_CP007_EXAM_PROFILES.BANKING_COMBO_4X5.argumentCount, 4);
assert.equal(ARG_CP007_EXAM_PROFILES.BANKING_COMBO_4X5.optionCount, 5);

assert.equal(ARG_QL_IDS.length, 6);
assert.deepEqual(ARG_CP006_FROZEN_CONTRACT.permanentQlIds, ARG_QL_IDS);
assert.equal(ARG_CP007_PROFILE_TEMPLATE_IDS.length, 6);
assert.equal(new Set(ARG_CP007_PROFILE_TEMPLATE_IDS).size, 6);
assert.equal(ARG_CP008_FROZEN_CONTRACT.permanentQlCount, 6);
assert.equal(ARG_CP008_FROZEN_CONTRACT.cp007ProfileTemplateCount, 6);
assert.equal(ARG_CP006_FROZEN_BLOBS.length, 29);
assert.equal(ARG_CP008_FROZEN_CONTRACT.cp006FrozenBlobCount, 29);
assert.equal(ARG_CP008_FROZEN_BLOBS.length, 3);
assert.equal(ARG_CP008_FROZEN_CONTRACT.cp008FrozenBlobCount, 3);

assert.equal(ARG_CP008_FROZEN_CONTRACT.questionStudioRuntimeMode, "REVIEW_ONLY_REAL_PAPER_PARITY");
assert.equal(ARG_CP008_FROZEN_CONTRACT.manualApprovalRequired, true);
assert.equal(ARG_CP008_FROZEN_CONTRACT.persistenceAllowed, false);
assert.equal(ARG_CP008_FROZEN_CONTRACT.questionBankWritable, false);
assert.equal(ARG_CP008_FROZEN_CONTRACT.testEligible, false);
assert.equal(ARG_CP008_FROZEN_CONTRACT.mockTestEligible, false);
assert.equal(ARG_CP008_FROZEN_CONTRACT.publiclyPublishable, false);
assert.equal(ARG_CP008_FROZEN_CONTRACT.automaticStudentPublication, false);
assert.equal(ARG_CP008_FROZEN_CONTRACT.learnerRelease, "LOCKED");

const hardPunjabi = generateArgCp007ExamProfileBatch({
  profile: "BANKING_COMBO_4X5",
  difficulty: "Hard",
  locale: "pa-IN",
  seed: "ARG-CP008-HARD-PA",
  count: 6,
});
assert.equal(hardPunjabi.packageId, "ARG-001");
assert.equal(hardPunjabi.checkpointId, ARG_CP007_CHECKPOINT_ID);
assert.equal(hardPunjabi.authority, ARG_CP007_AUTHORITY);
assert.equal(hardPunjabi.questions.length, 6);
assert.equal(hardPunjabi.generationContext.reviewOnly, true);
assert.equal(hardPunjabi.generationContext.manualApprovalRequired, true);
assert.equal(hardPunjabi.generationContext.persistenceAllowed, false);
assert.equal(hardPunjabi.generationContext.questionBankWritable, false);
assert.equal(hardPunjabi.generationContext.testEligible, false);
assert.equal(hardPunjabi.generationContext.mockTestEligible, false);
assert.equal(hardPunjabi.generationContext.publiclyPublishable, false);
assert.equal(hardPunjabi.generationContext.automaticStudentPublication, false);
assert.equal(hardPunjabi.generationContext.learnerRelease, "LOCKED");
for (const question of hardPunjabi.questions) {
  assert.equal(question.locale, "pa-IN");
  assert.equal(question.profile, "BANKING_COMBO_4X5");
  assert.equal(question.arguments.length, 4);
  assert.equal(question.options.length, 5);
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 5);
  assert.equal(question.metadata.cp006CoreUnmodified, true);
  assert.equal(question.metadata.cp006FreezeAuthorityRetained, ARG_CP006_FREEZE_AUTHORITY);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.metadata.manualApprovalRequired, true);
  assert.equal(question.metadata.questionBankWritable, false);
  assert.equal(question.metadata.testEligible, false);
  assert.equal(question.metadata.mockEligible, false);
  assert.equal(question.metadata.publicEligible, false);
  assert.equal(question.metadata.automaticStudentPublication, false);
  assert.equal(question.metadata.learnerRelease, "LOCKED");
}

const recentEnglish = generateArgCp007ExamProfileBatch({
  profile: "SSC_RECENT_2X4",
  difficulty: "Medium",
  locale: "en-IN",
  seed: "ARG-CP008-RECENT-EN",
  count: 6,
});
assert.equal(recentEnglish.questions.length, 6);
for (const question of recentEnglish.questions) {
  assert.equal(question.locale, "en-IN");
  assert.equal(question.profile, "SSC_RECENT_2X4");
  assert.equal(question.arguments.length, 2);
  assert.equal(question.options.length, 4);
  assert.equal(question.metadata.conciseExamSurface, true);
  assert.equal(question.metadata.cp006CoreUnmodified, true);
}

console.log(JSON.stringify({
  chapter: ARG_CP008_FROZEN_CONTRACT.chapterId,
  checkpoint: ARG_CP008_CHECKPOINT_ID,
  authority: ARG_CP008_FREEZE_AUTHORITY,
  status: ARG_CP008_FROZEN_CONTRACT.status,
  preservesCp006: ARG_CP008_FROZEN_CONTRACT.preservesCp006Authority,
  closesCp007: ARG_CP008_FROZEN_CONTRACT.closesCp007Authority,
  profiles: ARG_CP008_EXAM_PROFILES,
  qls: ARG_QL_IDS.length,
  cp006FrozenAuthorities: ARG_CP006_FROZEN_BLOBS.length,
  cp008FrozenAuthorities: ARG_CP008_FROZEN_BLOBS.length,
  questionStudio: ARG_CP008_FROZEN_CONTRACT.questionStudioRuntimeMode,
  learnerRelease: ARG_CP008_FROZEN_CONTRACT.learnerRelease,
}, null, 2));
console.log("ARG-001 CP008 real-paper closure freeze: PASS");
