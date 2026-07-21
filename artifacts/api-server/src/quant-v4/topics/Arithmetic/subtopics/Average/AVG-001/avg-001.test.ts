import { strict as assert } from "node:assert";
import {
  getAvg001QuestionEntries,
  getAvg001QuestionLanguageIds,
} from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries();
const cp001 = entries.filter((entry) => entry.cpId === "AVG-CP-001");
const cp002 = entries.filter((entry) => entry.cpId === "AVG-CP-002");
const cp003 = entries.filter((entry) => entry.cpId === "AVG-CP-003");

assert.equal(entries.length, 88);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 88);
assert.equal(cp001.length, 24);
assert.equal(cp002.length, 50);
assert.equal(cp003.length, 14);
assert.deepEqual(
  cp003.map((entry) => entry.qlId),
  Array.from({ length: 14 }, (_, index) => `AVG-QL-${String(index + 123).padStart(3, "0")}`),
);

const cp003Modes = [
  "findNewAverageAfterAddition",
  "findNewAverageAfterRemoval",
  "findNewAverageAfterReplacement",
  "findAddedMemberValueFromShift",
  "findRemovedMemberValueFromShift",
  "findReplacementValueFromShift",
  "findInningsValueOrNewCricketAverage",
];
for (const mode of cp003Modes) {
  assert.equal(cp003.filter((entry) => entry.solveMode === mode).length, 2, `${mode} proof count`);
}
assert.equal(cp003.filter((entry) => entry.scenarioVariant.toLowerCase().includes("years")).length >= 2, true);
assert.equal(cp003.filter((entry) => entry.contextDomain === "Sports").length, 2);

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

for (const qlId of ["AVG-QL-001", "AVG-QL-073", "AVG-QL-123"]) {
  for (const language of ["hi", "pa"] as const) {
    assert.throws(
      () => runAvg001Pipeline({ questionLanguageId: qlId, seed: "unsupported", language }),
      /English only/,
    );
  }
}

console.log(JSON.stringify({ qlCount: entries.length, cp001QlCount: cp001.length, cp002QlCount: cp002.length, cp003ProofQlCount: cp003.length, seedsPerQl: 12, generated, status: "PASS" }, null, 2));
