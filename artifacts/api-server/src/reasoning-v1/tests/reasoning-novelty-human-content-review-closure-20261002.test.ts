import assert from "node:assert/strict";

import {
  REASONING_V1_NOVELTY_PROVIDERS_V1,
} from "../shared/reasoning-novelty-provider-registry-v1";
import {
  REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_STATE,
  REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1,
} from "../shared/reasoning-novelty-human-content-review-v1";

const reviewOnly = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "DISCOVERY_REVIEW_ONLY",
);

assert.equal(reviewOnly.length, 8);
assert.equal(REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_STATE.reviewedProviderCount, 8);
assert.equal(REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_STATE.passedProviderCount, 8);
assert.equal(REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_STATE.activationAuthorizedProviderCount, 0);
assert.equal(REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_STATE.productionMixingChange, false);
assert.equal(REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_STATE.assemblyCreditChange, false);

assert.deepEqual(
  REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1.map((entry) => entry.providerId).sort(),
  reviewOnly.map((provider) => provider.providerId).sort(),
);

for (const entry of REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1) {
  assert.equal(entry.verdict, "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION");
  assert.equal(entry.reviewedSampleCount, 4);
  assert.equal(entry.stemQuality, "PASS");
  assert.equal(entry.optionQuality, "PASS");
  assert.equal(entry.explanationQuality, "PASS");
  assert.equal(entry.answerDefensibility, "PASS");
  assert.equal(entry.chapterOwnership, "PASS");
  assert.equal(entry.noveltySubstance, "PASS");
  assert.equal(entry.activationAuthorized, false);

  const provider = reviewOnly.find((candidate) => candidate.providerId === entry.providerId);
  assert.ok(provider, entry.providerId + ": missing review-only provider");
  assert.equal(provider.status, "DISCOVERY_REVIEW_ONLY");
  assert.equal(provider.questionStudioNoveltyMixActivated, false);
  assert.equal(provider.humanReviewRequired, true);
  assert.equal(provider.countsTowardAssemblyNoveltyNow, false);
}

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_HUMAN_CONTENT_REVIEW_CLOSURE_20261002",
  reviewedProviders: 8,
  passedContentReview: 8,
  activatedProviders: 0,
  productionMixingChanged: false,
}, null, 2));
