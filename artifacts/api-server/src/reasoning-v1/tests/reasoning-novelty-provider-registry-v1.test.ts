import assert from "node:assert/strict";
import { test } from "node:test";

import {
  REASONING_V1_NOVELTY_PROVIDERS_V1,
  reasoningNoveltyProviderByIdV1,
  reasoningNoveltyProviderSummaryV1,
} from "../shared/reasoning-novelty-provider-registry-v1";

test("novelty provider registry has unique provider identities", () => {
  const ids = REASONING_V1_NOVELTY_PROVIDERS_V1.map((entry) => entry.providerId);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.length >= 7);
});

test("only explicitly approved Paper Folding runtime counts toward assembly novelty today", () => {
  const summary = reasoningNoveltyProviderSummaryV1();
  assert.deepEqual(summary.approvedProviderIds, ["PFC-001-CONTROLLED-NOVEL"]);
  assert.deepEqual(summary.assemblyCreditedProviderIds, ["PFC-001-CONTROLLED-NOVEL"]);
});

test("all new reasoning novelty generators remain review-only and production-mix disabled", () => {
  const reviewOnly = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
    (entry) => entry.status === "DISCOVERY_REVIEW_ONLY",
  );
  assert.ok(reviewOnly.length >= 6);

  for (const provider of reviewOnly) {
    assert.equal(provider.questionStudioNoveltyMixActivated, false, provider.providerId);
    assert.equal(provider.humanReviewRequired, true, provider.providerId);
    assert.equal(provider.countsTowardAssemblyNoveltyNow, false, provider.providerId);
    assert.equal(provider.permanentQlAllocationRequired, false, provider.providerId);
    assert.ok(provider.parentQlIds.length >= 1, provider.providerId);
    assert.ok(provider.noveltyAxes.length >= 2, provider.providerId);
    assert.ok(provider.generatorModule.length > 10, provider.providerId);
    assert.ok(provider.generatorExport.length > 5, provider.providerId);
  }
});

test("registered review lanes can be addressed deterministically by provider id", () => {
  for (const providerId of [
    "RNK-001-CROSS-FAMILY-CASELET",
    "CLK-001-FAULTY-TIME-ANGLE",
    "CAE-001-EDGE-FAMILIES",
    "DIR-001-GRAPH-RELATIVE-PATH",
    "BLR-001-CODED-FILTERED-COUNT",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
  ]) {
    const provider = reasoningNoveltyProviderByIdV1(providerId);
    assert.equal(provider.providerId, providerId);
    assert.equal(provider.status, "DISCOVERY_REVIEW_ONLY");
  }
});
