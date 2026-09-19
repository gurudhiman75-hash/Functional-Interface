import assert from "node:assert/strict";
import { directionIndependent, distanceIndependent, solveMoverIndependent } from "./independent-solver";
import { generateDirCp005Question, type MultiMoverAnswer } from "./generator";
import { DIR_CP005_QLS } from "./task-registry";
import type { MoverPath } from "./types";

assert.deepEqual(DIR_CP005_QLS.map((ql) => ql.qlId), ["DIR-QL-016", "DIR-QL-017", "DIR-QL-018", "DIR-QL-019", "DIR-QL-020", "DIR-QL-021", "DIR-QL-022"]);
assert.equal(new Set(DIR_CP005_QLS.map((ql) => ql.ruleId)).size, 7);
assert.ok(DIR_CP005_QLS.every((ql) => ql.solveMode === undefined));
assert.ok(DIR_CP005_QLS.every((ql) => ql.status === "DRAFT"));

const answerPositions = [0, 0, 0, 0];
const directionCoverage = new Map<string, Set<string>>();
const stemDiversity = new Map<string, Set<string>>();
const originCoverage = new Map<string, Set<boolean>>();
const comparisonCoverage = new Set<string>();

for (const ql of DIR_CP005_QLS) {
  const directions = new Set<string>();
  const stems = new Set<string>();
  const origins = new Set<boolean>();
  directionCoverage.set(ql.qlId, directions);
  stemDiversity.set(ql.qlId, stems);
  originCoverage.set(ql.qlId, origins);

  for (let seed = 0; seed < 120; seed += 1) {
    const generated = generateDirCp005Question(ql.qlId, seed);
    assert.deepEqual(generateDirCp005Question(ql.qlId, seed), generated, `${ql.qlId} seed ${seed} is not deterministic`);
    assert.equal(generated.checkpointId, "DIR-CP-005");
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.equal(generated.metadata.solverVerified, true);
    assert.equal(generated.metadata.solveMode, null);
    assert.equal(generated.stem.split("\n").length, 1);
    assert.ok(!generated.stem.toLocaleLowerCase("en-IN").includes("coordinate"));
    assert.ok(!generated.stem.toLocaleLowerCase("en-IN").includes("speed"));
    assert.ok(!generated.stem.toLocaleLowerCase("en-IN").includes("time taken"));
    assert.ok(generated.stem.includes("metres"));
    assert.equal(generated.explanation.movementLines.length, generated.metadata.moverCount);
    assert.equal(generated.explanation.endpointLines.length, generated.metadata.moverCount);
    assert.ok(generated.explanation.movementLines.every((line) => line.includes(":")));
    assert.ok(generated.explanation.conclusion.length > 20);
    assert.equal(generated.explanation.diagram.moverCount, generated.metadata.moverCount);
    assert.ok(generated.explanation.diagram.svg.includes('data-role="compass"'));
    assert.equal((generated.explanation.diagram.svg.match(/data-role="mover-path"/g) ?? []).length, (generated.structuredPrompt.paths as readonly MoverPath[]).reduce((total, path) => total + path.steps.length, 0));
    assert.equal((generated.explanation.diagram.svg.match(/data-role="endpoint-node"/g) ?? []).length, new Set((generated.structuredPrompt.paths as readonly MoverPath[]).map((path) => `${path.endpoint.x}:${path.endpoint.y}`)).size);

    const paths = generated.structuredPrompt.paths as readonly MoverPath[];
    for (const path of paths) {
      const solved = solveMoverIndependent(path.start, path.steps);
      assert.deepEqual(solved, path.endpoint);
    }

    const queryGuides = (generated.explanation.diagram.svg.match(/data-role="endpoint-comparison-guide"/g) ?? []).length;
    const distanceKeys = (generated.explanation.diagram.svg.match(/data-role="separation-distance-key"/g) ?? []).length;

    if (ql.answerDemand === "ENDPOINT_RELATIVE_DIRECTION") {
      const answer = generated.correctAnswer as Extract<MultiMoverAnswer, { readonly kind: "DIRECTION" }>;
      const query = generated.structuredPrompt.query as { readonly subject: string; readonly reference: string };
      const subject = paths.find((path) => path.name === query.subject)!;
      const reference = paths.find((path) => path.name === query.reference)!;
      assert.equal(directionIndependent(reference.endpoint, subject.endpoint), answer.direction);
      directions.add(answer.direction);
      origins.add(generated.metadata.sameOrigin);
      assert.equal(queryGuides, 1);
      assert.equal(distanceKeys, 0);
      assert.equal(generated.explanation.calculationLine, null);
    } else if (ql.answerDemand === "ENDPOINT_SEPARATION_DISTANCE") {
      const answer = generated.correctAnswer as Extract<MultiMoverAnswer, { readonly kind: "DISTANCE" }>;
      const query = generated.structuredPrompt.query as { readonly left: string; readonly right: string };
      const left = paths.find((path) => path.name === query.left)!;
      const right = paths.find((path) => path.name === query.right)!;
      assert.equal(distanceIndependent(left.endpoint, right.endpoint), answer.distance);
      origins.add(generated.metadata.sameOrigin);
      assert.equal(queryGuides, 1);
      assert.equal(distanceKeys, 1);
      assert.ok(generated.explanation.calculationLine?.includes("endpoint separation") || generated.explanation.calculationLine?.includes("Endpoint separation"));
    } else if (ql.answerDemand === "ENDPOINT_DIRECTION_AND_DISTANCE") {
      const answer = generated.correctAnswer as Extract<MultiMoverAnswer, { readonly kind: "DIRECTION_DISTANCE" }>;
      const query = generated.structuredPrompt.query as { readonly subject: string; readonly reference: string };
      const subject = paths.find((path) => path.name === query.subject)!;
      const reference = paths.find((path) => path.name === query.reference)!;
      assert.equal(directionIndependent(reference.endpoint, subject.endpoint), answer.direction);
      assert.equal(distanceIndependent(reference.endpoint, subject.endpoint), answer.distance);
      directions.add(answer.direction);
      origins.add(generated.metadata.sameOrigin);
      assert.equal(queryGuides, 1);
      assert.equal(distanceKeys, 1);
      const dx = Math.abs(subject.endpoint.x - reference.endpoint.x);
      const dy = Math.abs(subject.endpoint.y - reference.endpoint.y);
      if (dx > 0 && dy > 0) assert.ok(generated.explanation.calculationLine!.includes(`${dx ** 2} + ${dy ** 2}`));
    } else if (ql.answerDemand === "MOVER_AT_RELATION") {
      const answer = generated.correctAnswer as Extract<MultiMoverAnswer, { readonly kind: "ENTITY" }>;
      const query = generated.structuredPrompt.query as { readonly subject: string; readonly reference: string; readonly direction: string };
      assert.equal(answer.entity, query.subject);
      const subject = paths.find((path) => path.name === query.subject)!;
      const reference = paths.find((path) => path.name === query.reference)!;
      assert.equal(directionIndependent(reference.endpoint, subject.endpoint), query.direction);
      assert.equal(queryGuides, 1);
      assert.equal(distanceKeys, 0);
    } else if (ql.answerDemand === "ENDPOINT_EXTREMUM") {
      const answer = generated.correctAnswer as Extract<MultiMoverAnswer, { readonly kind: "ENTITY" }>;
      const query = generated.structuredPrompt.query as { readonly extremumDirection: string; readonly answer: string };
      assert.equal(answer.entity, query.answer);
      comparisonCoverage.add(query.extremumDirection);
      assert.equal(queryGuides, 0);
      assert.ok(generated.explanation.diagram.svg.includes(answer.entity));
    } else if (ql.answerDemand === "NEAREST_OR_FARTHEST_FROM_REFERENCE") {
      const answer = generated.correctAnswer as Extract<MultiMoverAnswer, { readonly kind: "ENTITY" }>;
      const query = generated.structuredPrompt.query as { readonly comparison: string; readonly answer: string };
      assert.equal(answer.entity, query.answer);
      comparisonCoverage.add(query.comparison);
      const distances = paths.map((path) => ({ name: path.name, distance: distanceIndependent({ x: 0, y: 0 }, path.endpoint) }));
      const expected = query.comparison === "NEAREST"
        ? [...distances].sort((left, right) => left.distance - right.distance)[0]
        : [...distances].sort((left, right) => right.distance - left.distance)[0];
      assert.equal(expected.name, answer.entity);
      assert.ok(generated.explanation.diagram.svg.includes('data-role="reference-point"'));
    } else {
      const answer = generated.correctAnswer as Extract<MultiMoverAnswer, { readonly kind: "ENTITY_PAIR" }>;
      const [left, right] = answer.entities;
      assert.equal(directionIndependent(paths.find((path) => path.name === left)!.endpoint, paths.find((path) => path.name === right)!.endpoint), "SAME_POSITION");
      assert.equal((generated.explanation.diagram.svg.match(/data-coincident="true"/g) ?? []).length, 1);
      assert.equal(queryGuides, 0);
    }

    assert.equal(JSON.stringify(generated.options[generated.correctIndex].value), JSON.stringify(generated.correctAnswer));
    stems.add(generated.stem);
    answerPositions[generated.correctIndex] += 1;
  }
}

assert.equal(directionCoverage.get("DIR-QL-016")!.size, 8);
assert.equal(directionCoverage.get("DIR-QL-018")!.size, 8);
assert.deepEqual([...originCoverage.get("DIR-QL-016")!].sort(), [false, true]);
assert.deepEqual([...originCoverage.get("DIR-QL-017")!].sort(), [false, true]);
assert.deepEqual([...originCoverage.get("DIR-QL-018")!].sort(), [false, true]);
assert.ok(["NORTH", "EAST", "SOUTH", "WEST"].every((value) => comparisonCoverage.has(value)));
assert.ok(comparisonCoverage.has("NEAREST") && comparisonCoverage.has("FARTHEST"));
for (const [qlId, stems] of stemDiversity) assert.ok(stems.size >= 110, `${qlId} stem diversity too low: ${stems.size}`);
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(maxPosition / minPosition < 1.35, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("DIR-CP-005 multiple-mover proof passed.", {
  qlCount: DIR_CP005_QLS.length,
  generatedCases: DIR_CP005_QLS.length * 120,
  directionCoverage: Object.fromEntries([...directionCoverage].map(([qlId, values]) => [qlId, [...values].sort()])),
  originCoverage: Object.fromEntries([...originCoverage].map(([qlId, values]) => [qlId, [...values].sort()])),
  comparisonCoverage: [...comparisonCoverage].sort(),
  answerPositions,
  stemDiversity: Object.fromEntries([...stemDiversity].map(([qlId, stems]) => [qlId, stems.size])),
});
