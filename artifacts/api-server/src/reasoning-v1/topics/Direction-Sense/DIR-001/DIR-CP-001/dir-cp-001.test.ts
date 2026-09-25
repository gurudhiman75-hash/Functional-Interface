import assert from "node:assert/strict";
import { DIRECTIONS } from "../foundation/types";
import { DIR_CP001_QLS } from "./task-registry";
import { generateDirCp001Question } from "./generator";

assert.equal(DIR_CP001_QLS.length, 3);
assert.deepEqual(
  DIR_CP001_QLS.map((ql) => ql.qlId),
  ["DIR-QL-001", "DIR-QL-002", "DIR-QL-003"],
);
assert.equal(new Set(DIR_CP001_QLS.map((ql) => ql.ruleId)).size, 3);
assert.ok(DIR_CP001_QLS.every((ql) => !("solveMode" in ql)));
assert.ok(DIR_CP001_QLS.every((ql) => Object.values(ql.needEvidence).some((value) => value?.trim())));

const answerPositionCounts = [0, 0, 0, 0];
const directionCoverage = new Set<string>();
const turnCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const stemsByQl = new Map<string, Set<string>>();

for (const ql of DIR_CP001_QLS) {
  const stems = new Set<string>();
  stemsByQl.set(ql.qlId, stems);

  for (let seed = 0; seed < 200; seed += 1) {
    const generated = generateDirCp001Question(ql.qlId, seed);
    const repeated = generateDirCp001Question(ql.qlId, seed);

    assert.deepEqual(repeated, generated, `${ql.qlId} seed ${seed} is not deterministic`);
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => option.value)).size, 4);
    assert.equal(new Set(generated.options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(generated.options[generated.correctIndex].value, generated.correctAnswer);
    assert.equal(generated.metadata.solverVerified, true);
    assert.equal(generated.metadata.solveMode, null);
    assert.ok(generated.stem.length > 45);
    assert.ok(!generated.stem.includes("DIR_"));
    assert.doesNotMatch(generated.stem, /starts by facing/i, `${ql.qlId} machine-like opening: ${generated.stem}`);
    assert.ok(!generated.explanation.concept.includes("DIR_"));
    assert.ok(generated.explanation.steps.length >= 1);
    assert.ok(generated.explanation.conclusion.length > 20);
    assert.ok(generated.explanation.closestTrapRejection.length > 30);
    if (ql.qlId !== "DIR-QL-003") {
      const turns = generated.structuredPrompt.turns as readonly { readonly sense: string; readonly degrees: number }[];
      for (let index = 1; index < turns.length; index += 1) {
        const signed = (turn: { readonly sense: string; readonly degrees: number }) => turn.sense === "CLOCKWISE" ? turn.degrees : -turn.degrees;
        const net = ((signed(turns[index - 1]) + signed(turns[index])) % 360 + 360) % 360;
        assert.notEqual(net, 0, `${ql.qlId} seed ${seed}: adjacent turns cancel trivially`);
      }
      const expectedDifficulty = turns.length <= 1 ? "EASY" : turns.length <= 3 ? "MEDIUM" : "HARD";
      assert.equal(generated.difficulty, expectedDifficulty, `${ql.qlId} seed ${seed}: turn-burden difficulty`);
    }

    answerPositionCounts[generated.correctIndex] += 1;
    difficultyCoverage.add(generated.difficulty);
    stems.add(generated.stem);

    if (typeof generated.correctAnswer === "string" && DIRECTIONS.includes(generated.correctAnswer as (typeof DIRECTIONS)[number])) {
      directionCoverage.add(generated.correctAnswer);
    } else {
      turnCoverage.add(generated.correctAnswer);
    }
  }

  assert.ok(stems.size >= 150, `${ql.qlId} has insufficient visible stem diversity: ${stems.size}`);
}

const minPositionCount = Math.min(...answerPositionCounts);
const maxPositionCount = Math.max(...answerPositionCounts);
assert.ok(maxPositionCount / minPositionCount < 1.35, `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}`);
assert.equal(directionCoverage.size, 8, `Expected all directions, received ${[...directionCoverage].join(", ")}`);
assert.deepEqual([...turnCoverage].sort(), ["ABOUT_TURN", "LEFT_TURN", "RIGHT_TURN"]);
assert.ok(difficultyCoverage.has("EASY"));
assert.ok(difficultyCoverage.has("MEDIUM"));
assert.ok(difficultyCoverage.has("HARD"));

console.log("DIR-CP-001 exhaustive orientation runtime audit passed.", {
  qlCount: DIR_CP001_QLS.length,
  generatedCases: DIR_CP001_QLS.length * 200,
  answerPositionCounts,
  directionCoverage: [...directionCoverage].sort(),
  turnCoverage: [...turnCoverage].sort(),
  difficultyCoverage: [...difficultyCoverage].sort(),
  stemDiversity: Object.fromEntries([...stemsByQl].map(([qlId, stems]) => [qlId, stems.size])),
});
