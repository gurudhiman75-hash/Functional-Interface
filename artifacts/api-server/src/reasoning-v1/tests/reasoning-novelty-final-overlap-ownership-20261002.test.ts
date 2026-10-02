import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

const awaitingRouteProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "CONTENT_REVIEW_APPROVED_AWAITING_ROUTE",
);
assert.deepEqual(awaitingRouteProviders, []);

const approvedProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "APPROVED_RUNTIME",
);
assert.deepEqual(
  approvedProviders.map((provider) => provider.providerId),
  [
    "PFC-001-CONTROLLED-NOVEL",
    "ALP-001-TRANSFORMED-GAP",
    "OPS-001-INFER-THEN-FILL",
    "RNK-001-CROSS-FAMILY-CASELET",
    "CLK-001-FAULTY-TIME-ANGLE",
    "CAE-001-EDGE-FAMILIES",
    "DIR-001-GRAPH-RELATIVE-PATH",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    "BLR-001-CODED-FILTERED-COUNT",
  ],
);

const providerIds = new Set<string>();
const chapterIds = new Set<string>();

for (const provider of approvedProviders) {
  assert.ok(!providerIds.has(provider.providerId));
  providerIds.add(provider.providerId);

  assert.equal(provider.questionStudioNoveltyMixActivated, true);
  assert.equal(provider.countsTowardAssemblyNoveltyNow, true);
  assert.equal(provider.humanReviewRequired, false);
  assert.equal(provider.permanentQlAllocationRequired, false);

  if (provider.providerId === "PFC-001-CONTROLLED-NOVEL") continue;

  assert.ok(!chapterIds.has(provider.chapterId));
  chapterIds.add(provider.chapterId);
  assert.ok(provider.parentQlIds.length > 0);

  const expectedQlPrefix = provider.chapterId.split("-")[0] + "-QL-";
  for (const parentQlId of provider.parentQlIds) {
    assert.ok(
      parentQlId.startsWith(expectedQlPrefix),
      provider.providerId + ": parent QL crosses chapter ownership: " + parentQlId,
    );
  }

  const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
    (entry) => entry.topicDirectory === provider.topicDirectory,
  );
  assert.ok(inventory, provider.providerId + ": novelty inventory entry missing");
  assert.equal(inventory?.chapterId, provider.chapterId);
  assert.equal(inventory?.status, "APPROVED_CONTROLLED_NOVEL_RUNTIME");
  assert.equal(inventory?.countsTowardControlledNovelTargetNow, true);
}

const reviewPack = await buildReasoningNoveltyReviewPackV1({
  samplesPerProvider: 3,
  seed: 9400,
});
assert.equal((reviewPack.match(/\*\*Human review:\*\*/g) ?? []).length, 0);
assert.doesNotMatch(reviewPack, /^## [A-Z]{3}-001\b/mu);

assert.deepEqual(
  REASONING_V1_NOVELTY_PROVIDERS_V1
    .filter((provider) => provider.countsTowardAssemblyNoveltyNow)
    .map((provider) => provider.providerId),
  approvedProviders.map((provider) => provider.providerId),
);

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_FINAL_OVERLAP_OWNERSHIP_20261002",
  awaitingRouteProviderCount: awaitingRouteProviders.length,
  approvedRuntimeProviderCount: approvedProviders.length,
  reviewedChapterOwnershipCount: chapterIds.size,
  pendingReviewPackSamples: 0,
  assemblyCreditedProviders: approvedProviders.map((provider) => provider.providerId),
}, null, 2));
