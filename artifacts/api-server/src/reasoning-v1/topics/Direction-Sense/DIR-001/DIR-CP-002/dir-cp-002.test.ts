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

    const stemLines = generated.stem.split("\n");
    assert.ok(stemLines[0].includes("starts at point O"));
    assert.ok(stemLines.at(-1)?.startsWith("Question:"));
    assert.ok(generated.stem.includes("without changing position"));
    assert.ok(generated.stem.includes("without turning during the movement"));
    assert.ok(generated.stem.includes("reference point"));
    assert.ok(!generated.stem.includes("final position from the starting point"));
    assert.ok(!generated.stem.includes("Where is the final position"));

    assert.ok(generated.explanation.steps.length >= generated.metadata.legCount * 2);
    assert.deepEqual(
      generated.explanation.steps.map((step) => step.stepNumber),
      generated.explanation.steps.map((_, index) => index + 1),
    );
    assert.ok(generated.explanation.steps.every((step) => step.title.length > 5));
    assert.ok(generated.explanation.steps.every((step) => step.statement.length > 20));
    assert.ok(generated.explanation.steps.every((step) => step.calculation.length > 5));
    assert.ok(generated.explanation.steps.every((step) => step.result.length > 15));
    assert.ok(generated.explanation.coordinateConvention.includes("East = +x"));
    assert.ok(generated.explanation.askedRelation.includes("Point"));
    assert.ok(generated.explanation.conclusion.length > 40);
    assert.equal(Object.keys(generated.explanation).at(-1), "diagram");

    const diagram = generated.explanation.diagram;
    assert.equal(diagram.kind, "DIRECTION_PATH_DIAGRAM");
    assert.equal(diagram.points.length, generated.metadata.legCount + 1);
    assert.equal(diagram.segments.length, generated.metadata.legCount);
    assert.equal(diagram.points[0].label, "O");
    assert.equal(diagram.points[0].role, "START");
    assert.equal(diagram.points.at(-1)?.role, "END");
    assert.ok(diagram.svg.startsWith("<svg"));
    assert.ok(diagram.svg.includes("Dashed red arrow = the exact relation asked"));
    assert.ok(diagram.svg.includes(diagram.askedRelation.label));
    assert.ok(diagram.svg.includes("marker-end=\"url(#questionArrow)\""));

    assert.ok(!generated.stem.includes("DIR_"));
    assert.ok(!generated.explanation.conclusion.includes("DIR_"));

    if (ql.answerDemand === "ENDPOINT_DIRECTION") {
      assert.equal(typeof generated.correctAnswer, "string");
      const answer = generated.correctAnswer as string;
      endpointDirections.add(answer);
      reverseQueryValues.add(generated.metadata.reverseQuery);
      assert.equal(diagram.askedRelation.direction, answer);
      assert.equal(diagram.finalFacing, null);
      assert.equal(diagram.askedRelation.fromLabel, generated.metadata.reverseQuery ? diagram.points.at(-1)?.label : "O");
      assert.equal(diagram.askedRelation.toLabel, generated.metadata.reverseQuery ? "O" : diagram.points.at(-1)?.label);
    } else {
      const answer = generated.correctAnswer as CombinedPathAnswer;
      endpointDirections.add(answer.endpointDirection);
      finalFacings.add(answer.finalFacing);
      assert.ok(generated.options.every((option) => typeof option.value === "object"));
      assert.equal(diagram.askedRelation.direction, answer.endpointDirection);
      assert.equal(diagram.finalFacing?.direction, answer.finalFacing);
      assert.ok(diagram.svg.includes("Purple arrow = final facing direction"));
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

console.log("DIR-CP-002 unambiguous stem, detailed explanation and diagram proof passed.", {
  qlCount: DIR_CP002_QLS.length,
  generatedCases: DIR_CP002_QLS.length * 200,
  endpointDirections: [...endpointDirections].sort(),
  finalFacings: [...finalFacings].sort(),
  difficulties: [...difficulties].sort(),
  answerPositions,
  stemDiversity: Object.fromEntries([...stemSets].map(([qlId, stems]) => [qlId, stems.size])),
});
