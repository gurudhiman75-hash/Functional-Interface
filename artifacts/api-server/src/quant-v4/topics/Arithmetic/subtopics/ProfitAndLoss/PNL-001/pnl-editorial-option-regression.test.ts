import assert from "node:assert/strict";

import { runPnlCp005DynamicPipeline } from "./CP-005/cp005-dynamic-runtime";
import { runPnlCp006DynamicPipeline } from "./CP-006/cp006-dynamic-runtime";

const cases = [
  {
    qlId: "PNL-QL-137",
    seed: "pnl-english-editorial:PNL-CP-005:PNL-QL-137:2",
    run: runPnlCp005DynamicPipeline,
  },
  {
    qlId: "PNL-QL-155",
    seed: "pnl-english-editorial:PNL-CP-006:PNL-QL-155:3",
    run: runPnlCp006DynamicPipeline,
  },
] as const;

for (const item of cases) {
  const pkg = item.run({
    questionLanguageId: item.qlId,
    language: "en",
    seed: item.seed,
  } as never);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options).size, 4);
  assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
  assert.doesNotMatch(pkg.options.join("\n"), /\bAlternative\s+\d+\b/i);
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      regressions: cases.map(({ qlId, seed }) => ({ qlId, seed })),
    },
    null,
    2,
  ),
);
