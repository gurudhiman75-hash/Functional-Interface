import assert from "node:assert/strict";
import { test } from "node:test";

import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";
import {
  reasoningNoveltyProviderByIdV1,
  reasoningNoveltyProviderSummaryV1,
} from "../shared/reasoning-novelty-provider-registry-v1";

test("diagnostic sampler has no content-approved provider left awaiting a live route", () => {
  const summary = reasoningNoveltyProviderSummaryV1();
  assert.deepEqual(summary.awaitingRouteProviderIds, []);
  assert.deepEqual(summary.reviewOnlyProviderIds, []);
});

test("all approved reviewed runtime providers are excluded from the diagnostic sampler", async () => {
  for (const providerId of [
    "PFC-001-CONTROLLED-NOVEL",
    "ALP-001-TRANSFORMED-GAP",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    "CAE-001-EDGE-FAMILIES",
    "BLR-001-CODED-FILTERED-COUNT",
    "OPS-001-INFER-THEN-FILL",
    "CLK-001-FAULTY-TIME-ANGLE",
    "DIR-001-GRAPH-RELATIVE-PATH",
    "RNK-001-CROSS-FAMILY-CASELET",
  ]) {
    await assert.rejects(
      () => generateReasoningNoveltyReviewBatchV1({
        providerId,
        count: 1,
        seed: 1,
      }),
      /already an approved runtime/u,
    );
  }
});

test("RNK live provider remains English-only after activation", () => {
  const provider = reasoningNoveltyProviderByIdV1("RNK-001-CROSS-FAMILY-CASELET");
  assert.equal(provider.status, "APPROVED_RUNTIME");
  assert.deepEqual(provider.supportedLanguages, ["en"]);
  assert.equal(provider.questionStudioNoveltyMixActivated, true);
  assert.equal(provider.humanReviewRequired, false);
  assert.equal(provider.countsTowardAssemblyNoveltyNow, true);
});
