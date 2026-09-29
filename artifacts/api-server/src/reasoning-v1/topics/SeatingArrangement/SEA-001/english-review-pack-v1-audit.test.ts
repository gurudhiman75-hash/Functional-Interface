import assert from "node:assert/strict";
import { SEA_001_QLS } from "./ql-registry.ts";
import {
  buildSea001EnglishReviewPackV1,
  SEA_001_ENGLISH_REVIEW_PACK_V1,
} from "./english-review-pack-v1.ts";

const first = buildSea001EnglishReviewPackV1();
const second = buildSea001EnglishReviewPackV1();
assert.deepEqual(first, second);

assert.equal(SEA_001_ENGLISH_REVIEW_PACK_V1.blueprintCount, 20);
assert.equal(SEA_001_ENGLISH_REVIEW_PACK_V1.permanentQlCount, 9);
assert.equal(SEA_001_ENGLISH_REVIEW_PACK_V1.manualReviewRequired, true);
assert.equal(SEA_001_ENGLISH_REVIEW_PACK_V1.englishFreezePermitted, false);
assert.equal(SEA_001_ENGLISH_REVIEW_PACK_V1.downstreamActivationPermitted, false);

assert.equal(first.length, 324);
assert.equal(new Set(first.map((item) => item.itemId)).size, first.length);
assert.equal(new Set(first.map((item) => item.blueprintAuthorityId)).size, 20);
assert.deepEqual(
  [...new Set(first.map((item) => item.qlId))].sort(),
  SEA_001_QLS.map((entry) => entry.qlId).sort(),
);

const bands = [...new Set(first.map((item) => item.difficulty))].sort();
assert.deepEqual(bands, ["EASY", "HARD", "MEDIUM"]);

for (const item of first) {
  assert.equal(item.options.length, 4);
  assert.equal(new Set(item.options).size, 4);
  assert.ok(item.correctIndex >= 0 && item.correctIndex < 4);
  assert.equal(item.diagramPolicy, "EXPLANATION_ONLY");
  assert.equal(item.reviewStatus, "UNREVIEWED");
  assert.ok(item.stem.length > 10);
  assert.ok(item.explanation.length > 10);
}

const qlCounts = Object.fromEntries(
  SEA_001_QLS.map((ql) => [
    ql.qlId,
    first.filter((item) => item.qlId === ql.qlId).length,
  ]),
);
for (const count of Object.values(qlCounts)) assert.ok(count > 0);

console.log(JSON.stringify({
  status: "PASS_SEA_001_ENGLISH_REVIEW_PACK_V1",
  reviewItems: first.length,
  blueprintAuthorities: 20,
  qlCounts,
  difficultyBands: bands,
  manualReviewRequired: true,
  englishFreezePermitted: false,
}, null, 2));
