import assert from "node:assert/strict";
import test from "node:test";

function stableQuestionId(id: string, index = 0): number {
  let hash = 17;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash || index + 1;
}

test("published question ids remain stable between load and submit", () => {
  const versionId = "11111111-1111-4111-8111-111111111111";
  assert.equal(stableQuestionId(versionId), stableQuestionId(versionId));
  assert.notEqual(
    stableQuestionId(versionId),
    stableQuestionId("22222222-2222-4222-8222-222222222222"),
  );
});
