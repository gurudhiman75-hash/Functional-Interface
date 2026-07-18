import assert from "node:assert/strict";
import test from "node:test";

import { stablePublishedQuestionId } from "./published-test-runner";

test("published question ids remain stable between load and submit", () => {
  const versionId = "11111111-1111-4111-8111-111111111111";
  assert.equal(stablePublishedQuestionId(versionId), stablePublishedQuestionId(versionId));
  assert.notEqual(
    stablePublishedQuestionId(versionId),
    stablePublishedQuestionId("22222222-2222-4222-8222-222222222222"),
  );
});
