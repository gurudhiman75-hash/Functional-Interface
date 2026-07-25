import assert from "node:assert/strict";
import { DIR_CP002_QLS } from "./task-registry";
import { generateDirCp002Question, type CombinedPathAnswer } from "./generator";

assert.deepEqual(DIR_CP002_QLS.map((ql) => ql.qlId), ["DIR-QL-004", "DIR-QL-005"]);
assert.equal(new Set(DIR_CP002_QLS.map((ql) => ql.ruleId)).size, 2);
assert.ok(DIR_CP002_QLS.every((ql) => ql.solveMode === undefined));

const answerPositions = [0, 0, 0, 0];
const endpointDirections = new Set<string>();
const finalFacings = new Set<string>();
const difficulties = new Set<string>();
const reverseQueryValues = new Set<boolean>();
const stemSets = new Map<string, Set<string>>();

for (const ql of DIR_CP002_QLS) {
  const stems = new Set<string>();
  stemSets.set(ql.qlId, stems);
  for (let seed = 0; seed < 200; seed += 1) {
    const generated = generateDirCp002Question(ql.qlId, seed);
    const replay = generateDirCp002Question(ql.qlId, seed);
    assert.deepEqual(replay, generated, `${ql.qlId} seed ${seed} is not deterministic`);
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.equal(generated.metadata.solverVerified, true);
    assert.equal(generated.metadata.solveMode, null);
    assert.ok(generated.explanation.steps.length >= 3);
    assert.ok(generated.explanation.conclusion.length > 30);
    assert.ok(!generated.stem.includes("DIR_"));
    assert.ok(!generated.explanation.conclusion.includes("DIR_"));

    if (ql.answerDemand === "ENDPOINT_DIRECTION") {
      assert.equal(typeof generated.correctAnswer, "string");
      endpointDirections.add(generated.correctAnswer as string);
      reverseQueryValues.add(generated.metadata.reverseQuery);
    } else {
      const answer = generated.correctAnswer as CombinedPathAnswer;
      endpointDirections.add(answer.endpointDirection);
      finalFacings.add(answer.finalFacing);
      assert.ok(generated.options.every((option) => typeof option.value === "object"));
    }

    difficulties.add(generated.difficulty);
    stems.add(generated.stem);
    answerPositions[generated.correctIndex] += 1;
  }
}

assert.equal(endpointDirections.size, 8, `Endpoint coverage incomplete: ${[...endpointDirections].join(", ")}`);
assert.equal(finalFacings.size, 4, `Final-facing coverage incomplete: ${[...finalFacings].join(", ")}`);
assert.deepEqual([...reverseQueryValues].sort(), [false, true]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok((stemSets.get("DIR-QL-004")?.size ?? 0) >= 180);
assert.ok((stemSets.get("DIR-QL-005")?.size ?? 0) >= 180);

const minPositionCount = Math.min(...answerPositions);
const maxPositionCount = Math.max(...answerPositions);
assert.ok(maxPositionCount / minPositionCount < 1.35, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("DIR-CP-002 exhaustive runtime proof passed.", {
  qlCount: DIR_CP002_QLS.length,
  generatedCases: DIR_CP002_QLS.length * 200,
  endpointDirections: [...endpointDirections].sort(),
  finalFacings: [...finalFacings].sort(),
  difficulties: [...difficulties].sort(),
  answerPositions,
  stemDiversity: Object.fromEntries([...stemSets].map(([qlId, stems]) => [qlId, stems.size])),
});
