import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const routePath = fileURLToPath(new URL("../../../../routes/admin-question-studio-exam-profiles.ts", import.meta.url));
const source = readFileSync(routePath, "utf8");

assert.match(source, /generateQuestion as generateSharedQuestionStudioQuestions/u);
assert.match(source, /isRnk001QuestionStudioRequest/u);
assert.match(source, /generateQuestion as generateQuantV4Questions/u);
assert.match(source, /if \(reasoningRnk\)/u);
assert.match(source, /examProfileId: profile\.id/u);
assert.match(source, /generationSystem = reasoningRnk \? "reasoning-v1" : "quant-v4"/u);
assert.match(source, /PUNJAB_POLICE/u);
assert.match(source, /reasoning-v1-exam-profile/u);
assert.match(source, /sourceGenerationContext/u, "RNK shared generation metadata must be preserved before exam-profile trace enrichment");
assert.match(source, /content\.generation_runs/u);
assert.match(source, /content\.generation_run_items/u);
assert.match(source, /content\.generation_item_versions/u);
assert.doesNotMatch(source, /INSERT INTO content\.(?:questions|question_bank)/iu);
assert.doesNotMatch(source, /publiclyPublishable:\s*true/u);
assert.doesNotMatch(source, /testEligible:\s*true/u);

console.log(JSON.stringify({
  status: "PASS",
  sharedRnkExamProfileRoute: true,
  quantPathPreserved: true,
  sharedGenerationContextPreserved: true,
  reviewRunPersistenceOnly: true,
  questionBankWriteDetected: false,
}, null, 2));
