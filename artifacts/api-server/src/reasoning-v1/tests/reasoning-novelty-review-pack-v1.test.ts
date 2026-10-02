import assert from "node:assert/strict";
import { test } from "node:test";

import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

test("controlled novelty diagnostic pack is empty after every reviewed provider has a live route", async () => {
  const markdown = await buildReasoningNoveltyReviewPackV1({
    samplesPerProvider: 2,
    seed: 9000,
  });

  assert.match(markdown, /^# Reasoning V1 — Controlled Novelty Human Review Pack/mu);
  assert.doesNotMatch(markdown, /^## RNK-001\b/mu);
  assert.doesNotMatch(markdown, /^### Sample /mu);
  assert.doesNotMatch(markdown, /^\*\*Human review:\*\*/mu);
  assert.doesNotMatch(markdown, /Production novelty mixing: \*\*disabled\*\*/u);
});
