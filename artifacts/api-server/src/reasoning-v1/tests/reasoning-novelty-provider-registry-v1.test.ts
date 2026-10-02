import assert from "node:assert/strict";
import { test } from "node:test";

import {
  REASONING_V1_NOVELTY_PROVIDERS_V1,
  reasoningNoveltyProviderByIdV1,
  reasoningNoveltyProviderSummaryV1,
} from "../shared/reasoning-novelty-provider-registry-v1";

const live = [
  "PFC-001-CONTROLLED-NOVEL",
  "ALP-001-TRANSFORMED-GAP",
  "OPS-001-INFER-THEN-FILL",
  "CLK-001-FAULTY-TIME-ANGLE",
  "CAE-001-EDGE-FAMILIES",
  "DIR-001-GRAPH-RELATIVE-PATH",
  "CAL-001-IMPLICIT-RANGE-FREQUENCY",
  "BLR-001-CODED-FILTERED-COUNT",
  "RNK-001-CROSS-FAMILY-CASELET",
] as const;
const awaitingRoute = [] as const;

test("novelty provider registry has unique provider identities", () => {
  const ids = REASONING_V1_NOVELTY_PROVIDERS_V1.map((entry) => entry.providerId);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 9);
});

test("approved runtime and assembly-credit state matches the authorized live set", () => {
  const summary = reasoningNoveltyProviderSummaryV1();
  assert.deepEqual(summary.approvedProviderIds, [...live]);
  assert.deepEqual(summary.awaitingRouteProviderIds, [...awaitingRoute]);
  assert.deepEqual(summary.assemblyCreditedProviderIds, [...live]);
  assert.deepEqual(summary.reviewOnlyProviderIds, []);
});

test("awaiting-route providers are content-approved but production-mix disabled", () => {
  for (const providerId of awaitingRoute) {
    const provider = reasoningNoveltyProviderByIdV1(providerId);
    assert.equal(provider.status, "CONTENT_REVIEW_APPROVED_AWAITING_ROUTE");
    assert.equal(provider.questionStudioNoveltyMixActivated, false);
    assert.equal(provider.humanReviewRequired, false);
    assert.equal(provider.countsTowardAssemblyNoveltyNow, false);
    assert.equal(provider.permanentQlAllocationRequired, false);
    assert.ok(provider.parentQlIds.length >= 1);
  }
});

test("eight reviewed chapter providers are live Question Studio runtimes", () => {
  for (const providerId of live.slice(1)) {
    const provider = reasoningNoveltyProviderByIdV1(providerId);
    assert.equal(provider.status, "APPROVED_RUNTIME");
    assert.equal(provider.questionStudioNoveltyMixActivated, true);
    assert.equal(provider.humanReviewRequired, false);
    assert.equal(provider.countsTowardAssemblyNoveltyNow, true);
  }
});
