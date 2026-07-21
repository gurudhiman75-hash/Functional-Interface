import { strict as assert } from "node:assert";
import {
  getAvg001QuestionEntries,
  getAvg001QuestionLanguageIds,
} from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries();
const cp001 = entries.filter((entry) => entry.cpId === "AVG-CP-001");
const cp002 = entries.filter((entry) => entry.cpId === "AVG-CP-002");

assert.equal(entries.length, 74);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 74);
assert.equal(cp001.length, 24);
assert.equal(cp002.length, 50);
assert.deepEqual(
  cp002.map((entry) => entry.qlId),
  Array.from({ length: 50 }, (_, index) => `AVG-QL-${String(index + 73).padStart(3, "0")}`),
);

const expectedModes: Record<string, number> = {
  findSumFromAverageAndCount: 6,
  findAverageFromSumAndCount: 6,
  findCountFromSumAndAverage: 6,
  findMissingValueFromAverage: 6,
  findAverageOfConsecutiveSet: 14,
  findMiddleTermFromAverage: 12,
  findExtremeFromAverageAndCount: 12,
  findAverageOfOddOrEvenSet: 12,
};
for (const [mode, count] of Object.entries(expectedModes)) {
  assert.equal(
    entries.filter((entry) => entry.solveMode === mode).length,
    count,
    `${mode} count`,
  );
}

const cp002Difficulty = Object.groupBy(cp002, (entry) => entry.difficulty);
assert.equal(cp002Difficulty.Easy?.length, 22);
assert.equal(cp002Difficulty.Medium?.length, 15);
assert.equal(cp002Difficulty.Hard?.length, 13);

const allDifficulty = Object.groupBy(entries, (entry) => entry.difficulty);
assert.equal(allDifficulty.Easy?.length, 30);
assert.equal(allDifficulty.Medium?.length, 23);
assert.equal(allDifficulty.Hard?.length, 21);

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
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    generated += 1;
  }
}

for (const qlId of ["AVG-QL-001", "AVG-QL-073"]) {
  assert.throws(
    () =>
      runAvg001Pipeline({
        questionLanguageId: qlId,
        seed: "unsupported",
        language: "hi",
      }),
    /English only/,
  );
  assert.throws(
    () =>
      runAvg001Pipeline({
        questionLanguageId: qlId,
        seed: "unsupported",
        language: "pa",
      }),
    /English only/,
  );
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      cp001QlCount: cp001.length,
      cp002QlCount: cp002.length,
      seedsPerQl: 12,
      generated,
      status: "PASS",
    },
    null,
    2,
  ),
);
