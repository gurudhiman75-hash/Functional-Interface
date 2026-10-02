import assert from "node:assert/strict";
import { test } from "node:test";

import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

test("controlled novelty diagnostic pack is empty after every reviewed provider has a live route", async () => {
  const markdown = await buildReasoningNoveltyReviewPackV1({
    samplesPerProvider: 2,
    seed: 9000,
  });

  assert.match(markdown, /^# Reasoning V1 — Controlled Novelty Human Review Pack/mu);
  for (const chapterId of [
    "ALP-001",
    "CAL-001",
    "OPS-001",
    "DIR-001",
    "CLK-001",
    "CAE-001",
    "BLR-001",
    "RNK-001",
  ]) {
    assert.doesNotMatch(markdown, new RegExp("## " + chapterId + "\\b", "u"));
  }
  assert.equal((markdown.match(/^### Sample /gmu) ?? []).length, 0);
  assert.equal((markdown.match(/^\*\*Human review:\*\*/gmu) ?? []).length, 0);
  assert.doesNotMatch(markdown, /automatic student publication/iu);
});
