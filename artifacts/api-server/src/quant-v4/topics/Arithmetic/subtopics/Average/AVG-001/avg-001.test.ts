import { strict as assert } from "node:assert";
import {
  getAvg001QuestionEntries,
  getAvg001QuestionLanguageIds,
} from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries();
assert.equal(entries.length, 24);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 24);

for (const mode of [
  "findSumFromAverageAndCount",
  "findAverageFromSumAndCount",
  "findCountFromSumAndAverage",
  "findMissingValueFromAverage",
]) {
  assert.equal(entries.filter((entry) => entry.solveMode === mode).length, 6);
}

const difficulty = Object.groupBy(entries, (entry) => entry.difficulty);
assert.equal(difficulty.Easy?.length, 8);
assert.equal(difficulty.Medium?.length, 8);
assert.equal(difficulty.Hard?.length, 8);

let generated = 0;
for (const questionLanguageId of getAvg001QuestionLanguageIds()) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `avg-proof:${questionLanguageId}:${index}`;
    const first = runAvg001Pipeline({ questionLanguageId, seed });
    const second = runAvg001Pipeline({ questionLanguageId, seed });

    assert.equal(first.validation.valid, true);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.parameters, second.parameters);
    assert.deepEqual(first.options, second.options);
    assert.equal(first.answer, second.answer);
    assert.deepEqual(first.explanation, second.explanation);
    generated += 1;
  }
}

assert.throws(
  () =>
    runAvg001Pipeline({
      questionLanguageId: "AVG-QL-001",
      seed: "unsupported",
      language: "hi",
    }),
  /English only/,
);

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      seedsPerQl: 12,
      generated,
      status: "PASS",
    },
    null,
    2,
  ),
);
