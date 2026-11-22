import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const route = readFileSync("artifacts/api-server/src/routes/admin-question-studio-native-editorial.ts", "utf8");
const page = readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx", "utf8");

test("bulk handoff reuses both guarded actions with per-item outcomes", () => {
  const batch = route.split('router.post("/native-editorial/batch-accept"')[1];
  assert.match(batch, /requireAdminPermission\("content\.generation\.review"\)/);
  assert.match(batch, /requireAdminPermission\("content\.translations\.review"\)/);
  assert.match(batch, /items\.length>25/);
  assert.match(batch, /await approveNativeLanguages[\s\S]*await promoteNativeLanguages/);
  assert.match(batch, /return \{itemId,ok:false,code:/);
  assert.match(route, /NATIVE_APPROVE_SAVED_EDIT_REQUIRES_REVIEW/);
  assert.match(route, /NATIVE_APPROVE_REVISION_CHANGED/);
  assert.match(route, /NATIVE_PROMOTION_ENGLISH_NOT_ACCEPTED/);
});

test("browser hands off banked questions in one request and refreshes in the background", () => {
  const action = page.split("async function approveSelectedBatch()")[1].split("const toggleAllVisible")[0];
  assert.match(action, /await updateGenerationItems[\s\S]*await acceptQuestionStudioNativeBatch/);
  assert.equal(action.match(/await acceptQuestionStudioNativeBatch/g)?.length, 1);
  assert.doesNotMatch(action, /getQuestionStudioNativeEditorial\(/);
  assert.match(action, /void refreshReviewPage\(\{ background: true \}\)/);
});
