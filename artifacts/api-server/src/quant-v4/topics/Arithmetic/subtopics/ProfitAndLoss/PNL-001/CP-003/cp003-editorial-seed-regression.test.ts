import assert from "node:assert/strict";

import {
  listPnlCp003DynamicQlIds,
  runPnlCp003DynamicPipeline,
} from "./cp003-dynamic-runtime";

let generated = 0;
for (const qlId of listPnlCp003DynamicQlIds()) {
  for (let sampleIndex = 1; sampleIndex <= 3; sampleIndex += 1) {
    const seed = `pnl-english-editorial:PNL-CP-003:${qlId}:${sampleIndex}`;
    try {
      const pkg = runPnlCp003DynamicPipeline({
        questionLanguageId: qlId,
        language: "en",
        seed,
      });
      assert.equal(pkg.questionLanguageId, qlId);
      assert.equal(pkg.validation.valid, true);
      generated += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${qlId} / ${seed}: ${message}`);
    }
  }
}

assert.equal(generated, 72);
console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-003",
      qlCount: 24,
      editorialSeedsPerQl: 3,
      generatedPackages: generated,
    },
    null,
    2,
  ),
);
