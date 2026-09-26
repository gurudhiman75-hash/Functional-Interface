import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const examProfileRoutePath = fileURLToPath(new URL("../../../../routes/admin-question-studio-exam-profiles.ts", import.meta.url));
const sharedRunsRoutePath = fileURLToPath(new URL("../../../../routes/admin-question-studio-average.ts", import.meta.url));
const examProfileSource = readFileSync(examProfileRoutePath, "utf8");
const sharedRunsSource = readFileSync(sharedRunsRoutePath, "utf8");

assert.match(examProfileSource, /generateQuestion as generateSharedQuestionStudioQuestions/u);
assert.match(examProfileSource, /isRnk001QuestionStudioRequest/u);
assert.match(examProfileSource, /generateQuestion as generateQuantV4Questions/u);
assert.match(examProfileSource, /if \(reasoningRnk\)/u);
assert.match(examProfileSource, /examProfileId: profile\.id/u);
assert.match(examProfileSource, /generationSystem = reasoningRnk \? "reasoning-v1" : "quant-v4"/u);
assert.match(examProfileSource, /PUNJAB_POLICE/u);
assert.match(examProfileSource, /reasoning-v1-exam-profile/u);
assert.match(examProfileSource, /sourceGenerationContext/u);
assert.match(examProfileSource, /content\.generation_runs/u);
assert.match(examProfileSource, /content\.generation_run_items/u);
assert.match(examProfileSource, /content\.generation_item_versions/u);
assert.doesNotMatch(examProfileSource, /INSERT INTO content\.(?:questions|question_bank)/iu);
assert.doesNotMatch(examProfileSource, /publiclyPublishable:\s*true/u);
assert.doesNotMatch(examProfileSource, /testEligible:\s*true/u);

assert.match(sharedRunsSource, /isRnk001QuestionStudioRequest/u);
assert.match(sharedRunsSource, /rnkRequest = isRnk001QuestionStudioRequest/u);
assert.match(sharedRunsSource, /selectedPackageId = rnkRequest[\s\S]*?"RNK-001"/u);
assert.match(sharedRunsSource, /selectedSubtopic = rnkRequest[\s\S]*?"Ranking & Order"/u);
assert.match(sharedRunsSource, /supportedExamProfiles/u);
assert.match(sharedRunsSource, /canonicalProblems/u);
assert.match(sharedRunsSource, /questionBankWritable/u);
assert.match(sharedRunsSource, /examProfileId/u);
assert.match(sharedRunsSource, /rnkQlId/u);
assert.match(sharedRunsSource, /rnkCpId/u);
assert.match(sharedRunsSource, /RNK-001 Hindi\/Punjabi Question Studio delivery remains locked/u);
assert.match(sharedRunsSource, /reasoning-v1-rnk-001/u);
assert.match(sharedRunsSource, /content\.generation_runs/u);
assert.match(sharedRunsSource, /content\.generation_run_items/u);
assert.match(sharedRunsSource, /content\.generation_item_versions/u);
assert.doesNotMatch(sharedRunsSource, /INSERT INTO content\.(?:questions|question_bank)/iu);

console.log(JSON.stringify({
  status: "PASS",
  sharedRnkExamProfileRoute: true,
  sharedRnkNormalRunsRoute: true,
  capabilitiesExposeExamProfilesAndQls: true,
  quantPathPreserved: true,
  reviewRunPersistenceOnly: true,
  questionBankWriteDetected: false,
}, null, 2));
