import assert from "node:assert/strict";

import { autoPickHeadlines, type AutoPickHeadline } from "./headline-autopick-policy";

const item = (id: string, over: Partial<AutoPickHeadline> = {}): AutoPickHeadline => ({
  candidateId: id, category: `cat-${id}`, autoEligible: true, manualSelected: false, candidateStatus: "queued",
  isPrimarySource: true, relevanceScore: 80, clusterId: null, linkedEventId: null, linkedEventStatus: null, ...over,
});
const ids = (items: AutoPickHeadline[], limit?: number) => autoPickHeadlines(items, limit).map((entry) => entry.candidateId);

assert.deepEqual(ids([item("a", { relevanceScore: 70 }), item("b", { relevanceScore: 90 })]), ["b", "a"]);
assert.deepEqual(ids([
  item("low", { relevanceScore: 64 }),
  item("withheld", { autoEligible: false }),
  item("rejected", { candidateStatus: "rejected" }),
  item("news-only", { isPrimarySource: false }),
]), []);
assert.deepEqual(ids([item("news-verified", { isPrimarySource: false, linkedEventStatus: "verified" })]), ["news-verified"]);
assert.deepEqual(ids([item("a", { linkedEventId: "e1" }), item("b", { linkedEventId: "e1" })]), ["a"]);
assert.equal(ids(["a", "b", "c", "d", "e", "f"].map((id) => item(id, { category: "sports" }))).length, 4);
// Existing admin choices count toward the limit and are never re-picked.
assert.deepEqual(ids([item("mine", { manualSelected: true }), item("a"), item("b")], 2), ["a"]);
console.log("headline auto-pick policy: ok");
