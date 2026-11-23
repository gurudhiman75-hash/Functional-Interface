import assert from "node:assert/strict";
import test from "node:test";

import { likePattern, normalizePickerQuery } from "./admin-test-question-picker";

const id = "11111111-1111-4111-8111-111111111111";

test("picker defaults are safe and paged", () => {
  const q = normalizePickerQuery({});
  assert.deepEqual([q.limit, q.offset, q.sort, q.usage, q.examVersionId], [50, 0, "newest", "any", null]);
});

test("picker clamps paging and drops invalid filters", () => {
  const q = normalizePickerQuery({ limit: "9999", offset: "-5", difficulties: "Easy,silly,HARD", taxonomyNodeIds: `${id},nope`,
    languages: "hi,pa,en,<x>", examVersionId: "not-a-uuid", usage: "unused", sort: "least_used" });
  assert.equal(q.limit, 100);
  assert.equal(q.offset, 0);
  assert.deepEqual(q.difficulties, ["easy", "hard"]);
  assert.deepEqual(q.taxonomyNodeIds, [id]);
  assert.deepEqual(q.languages, ["hi", "pa"]);
  assert.equal(q.examVersionId, null);
  assert.equal(q.usage, "unused");
  assert.equal(q.sort, "least_used");
});

test("search text is matched literally", () => {
  assert.equal(likePattern("50%_off"), "%50\\%\\_off%");
});
