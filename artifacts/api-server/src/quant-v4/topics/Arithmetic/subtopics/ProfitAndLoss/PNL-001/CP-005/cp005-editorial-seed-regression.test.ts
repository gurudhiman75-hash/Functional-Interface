import assert from "node:assert/strict";

import {
  listPnlCp005DynamicQlIds,
  runPnlCp005DynamicPipeline,
} from "./cp005-dynamic-runtime";

let generated = 0;
for (const qlId of listPnlCp005DynamicQlIds()) {
  for (let candidateIndex = 1; candidateIndex <= 18; candidateIndex += 1) {
    const seed = `pnl-english-editorial:PNL-CP-005:${qlId}:candidate-${candidateIndex}`;
    try {
      const pkg = runPnlCp005DynamicPipeline({
        questionLanguageId: qlId,
        language: "en",
        seed,
      });
      assert.equal(pkg.questionLanguageId, qlId);
      assert.equal(pkg.validation.valid, true);
      assert.equal(pkg.options.length, 4);
      assert.equal(new Set(pkg.options).size, 4);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
      assert.doesNotMatch(pkg.options.join("\n"), /\bAlternative\s+\d+\b/i);
      generated += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${qlId} / ${seed}: ${message}`);
    }
  }
}

assert.equal(generated, 522);
console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-005",
      qlCount: 29,
      candidateSeedsPerQl: 18,
      generatedPackages: generated,
    },
    null,
    2,
  ),
);
