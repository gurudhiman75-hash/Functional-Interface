import { strict as assert } from "node:assert";
import { createBlindReview, recordBlindReview } from "../../../../../../../common/eev2/blind-review";
import { analyzeBlindReviews } from "../../../../../../../common/eev2/review-analysis";
import { BLIND_REVIEW_DIMENSIONS, type BlindReviewScores } from "../../../../../../../common/eev2/review-contracts";
const bundle = createBlindReview({
  instanceId: "ENG-011:001", locale: "en", detailMode: "standard",
  candidates: [
    { engine: "v1", deterministicIdentity: "legacy", lines: ["Given","Calculation","Answer"] },
    { engine: "v2", deterministicIdentity: "pedagogical", lines: ["20% = 600","1% = 30","25% = 750"] },
  ],
  metadata: { taskKind: "percentOfKnownNumber" },
});
assert.doesNotMatch(JSON.stringify(bundle.packet), /"v1"|"v2"|legacy|pedagogical/i);
const scores = Object.fromEntries(BLIND_REVIEW_DIMENSIONS.map((dimension) => [
  dimension, { A: 4, B: 4 },
])) as unknown as BlindReviewScores;
const record = recordBlindReview(bundle.packet, {
  scores, preference: "NO_PREFERENCE", notes: [],
  timestamp: "2026-06-19T20:00:00.000Z", metadata: {},
});
const analysis = analyzeBlindReviews([record], [bundle.assignment]);
assert.equal(analysis.reviewCount, 1);
assert.equal("winner" in analysis, false);
console.log("ENG-011 Blind Human Review regression passed.");

