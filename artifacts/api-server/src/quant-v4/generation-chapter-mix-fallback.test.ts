import assert from "node:assert/strict";
import test from "node:test";
import { generateQuestion } from "./generation-engine-core";

// PRT-CP-007 only has Hard questions. A Medium chapter mix must skip it, not fail the whole batch.
test("Partnership chapter mix at Medium skips CPs with no Medium questions", async () => {
  const result = await generateQuestion({
    packageId: "PRT-001",
    difficulty: "Medium",
    count: 10,
    language: "en",
    seed: "chapter-mix-fallback-test",
  } as never);
  assert.equal(result.questions.length, 10);
});

test("an explicitly chosen CP without questions at that difficulty still reports the error", async () => {
  await assert.rejects(
    generateQuestion({
      packageId: "PRT-001",
      canonicalProblemId: "PRT-CP-007",
      difficulty: "Medium",
      count: 1,
      language: "en",
      seed: "explicit-cp-test",
    } as never),
    /No active PRT-001 QLs match PRT-CP-007/,
  );
});
