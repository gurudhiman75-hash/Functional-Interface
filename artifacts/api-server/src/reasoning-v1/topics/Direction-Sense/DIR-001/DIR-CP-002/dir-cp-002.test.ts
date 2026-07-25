import assert from "node:assert/strict";
import type { Coordinate } from "../foundation/types";
import { DIR_CP002_QLS } from "./task-registry";
import { generateDirCp002Question, type CombinedPathAnswer } from "./generator";
import type { PathDiagramSegment, PathDiagramSpec } from "./path-diagram";

const EPSILON = 1e-9;

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= EPSILON;
}

function sameCoordinate(left: Coordinate, right: Coordinate): boolean {
  return nearlyEqual(left.x, right.x) && nearlyEqual(left.y, right.y);
}

function between(value: number, edgeA: number, edgeB: number): boolean {
  return value >= Math.min(edgeA, edgeB) - EPSILON && value <= Math.max(edgeA, edgeB) + EPSILON;
}

function positiveIntervalOverlap(a1: number, a2: number, b1: number, b2: number): boolean {
  const overlap = Math.min(Math.max(a1, a2), Math.max(b1, b2)) - Math.max(Math.min(a1, a2), Math.min(b1, b2));
  return overlap > EPSILON;
}

function diagramSegmentCoordinates(diagram: PathDiagramSpec, segment: PathDiagramSegment): { start: Coordinate; end: Coordinate } {
  const pointById = new Map(diagram.points.map((point) => [point.id, point.coordinate]));
  return {
    start: pointById.get(segment.fromPointId)!,
    end: pointById.get(segment.toPointId)!,
  };
}

function segmentsConflict(
  first: { readonly start: Coordinate; readonly end: Coordinate },
  second: { readonly start: Coordinate; readonly end: Coordinate },
  consecutive: boolean,
): boolean {
  const firstVertical = nearlyEqual(first.start.x, first.end.x);
  const secondVertical = nearlyEqual(second.start.x, second.end.x);

  if (firstVertical && secondVertical) {
    return nearlyEqual(first.start.x, second.start.x)
      && positiveIntervalOverlap(first.start.y, first.end.y, second.start.y, second.end.y);
  }
  if (!firstVertical && !secondVertical) {
    return nearlyEqual(first.start.y, second.start.y)
      && positiveIntervalOverlap(first.start.x, first.end.x, second.start.x, second.end.x);
  }

  const vertical = firstVertical ? first : second;
  const horizontal = firstVertical ? second : first;
  const crossing = { x: vertical.start.x, y: horizontal.start.y };
  const intersects = between(crossing.y, vertical.start.y, vertical.end.y)
    && between(crossing.x, horizontal.start.x, horizontal.end.x);
  if (!intersects) return false;
  if (consecutive) {
    const sharedEndpoint = sameCoordinate(first.end, second.start) || sameCoordinate(second.end, first.start);
    if (sharedEndpoint && (
      sameCoordinate(crossing, first.start)
      || sameCoordinate(crossing, first.end)
      || sameCoordinate(crossing, second.start)
      || sameCoordinate(crossing, second.end)
    )) return false;
  }
  return true;
}

function assertClearDiagramRoute(diagram: PathDiagramSpec): void {
  const coordinateKeys = diagram.points.map((point) => `${point.coordinate.x}:${point.coordinate.y}`);
  assert.equal(new Set(coordinateKeys).size, coordinateKeys.length, "Diagram route must not revisit a point");
  const segments = diagram.segments.map((segment) => diagramSegmentCoordinates(diagram, segment));
  for (let left = 0; left < segments.length; left += 1) {
    for (let right = left + 1; right < segments.length; right += 1) {
      assert.equal(
        segmentsConflict(segments[left], segments[right], right === left + 1),
        false,
        `Diagram legs ${left + 1} and ${right + 1} overlap or cross`,
      );
    }
  }
}

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

    assert.ok(generated.stem.includes("starts from a point facing"));
    assert.ok(generated.stem.includes("starting point"));
    assert.equal(generated.stem.split("\n").length, 1, "Question statement must be continuous exam prose");
    assert.equal((generated.stem.match(/\bwalks\b/g) ?? []).length, generated.metadata.legCount);
    assert.equal((generated.stem.match(/\b(?:North|South|East|West)\b/g) ?? []).length, 1, "Stem must reveal only the initial compass direction");
    assert.ok(!generated.stem.includes("point O"));
    assert.ok(!generated.stem.match(/point [A-Z]/));
    assert.ok(!generated.stem.includes("without changing position"));
    assert.ok(!generated.stem.includes("is now facing"));

    assert.deepEqual(Object.keys(generated.explanation), ["given", "movementLines", "conclusion", "diagram"]);
    assert.ok(generated.explanation.given.includes("starts facing"));
    assert.ok(generated.explanation.given.endsWith("following movements."));
    assert.equal(generated.explanation.movementLines.length, generated.metadata.legCount);
    assert.ok(generated.explanation.movementLines[0].startsWith("First,"));
    assert.ok(generated.explanation.movementLines.every((line) => line.split("\n").length === 1));
    assert.ok(generated.explanation.movementLines.every((line) => line.includes("metres")));
    assert.ok(generated.explanation.movementLines.every((line) => /\b(?:North|South|East|West)\b/.test(line)));
    assert.ok(generated.explanation.movementLines.every((line) => !line.includes("coordinate")));
    assert.ok(generated.explanation.movementLines.every((line) => !line.includes(" = ")));
    assert.ok(generated.explanation.conclusion.length > 35);
    assert.equal(Object.keys(generated.explanation).at(-1), "diagram");

    const diagram = generated.explanation.diagram;
    assert.equal(diagram.kind, "DIRECTION_PATH_DIAGRAM");
    assert.equal(diagram.points.length, generated.metadata.legCount + 1);
    assert.equal(diagram.segments.length, generated.metadata.legCount);
    assert.equal(diagram.points[0].label, "Start");
    assert.equal(diagram.points[0].role, "START");
    assert.equal(diagram.points.at(-1)?.label, "Finish");
    assert.equal(diagram.points.at(-1)?.role, "END");
    assertClearDiagramRoute(diagram);
    assert.ok(diagram.svg.startsWith("<svg"));
    assert.equal((diagram.svg.match(/data-role="movement-leg"/g) ?? []).length, generated.metadata.legCount);
    assert.equal((diagram.svg.match(/data-role="distance-label"/g) ?? []).length, generated.metadata.legCount);
    assert.ok(diagram.svg.includes("data-role=\"start-point\""));
    assert.ok(diagram.svg.includes("data-role=\"finish-point\""));
    assert.ok(diagram.svg.includes("data-role=\"compass\""));
    assert.ok(!diagram.svg.includes("asked-relation"));
    assert.ok(!diagram.svg.includes("questionArrow"));
    assert.ok(!diagram.svg.includes("final-facing"));
    assert.ok(!diagram.svg.includes("Final facing"));
    assert.ok(!diagram.svg.includes("Asked:"));
    assert.ok(!diagram.svg.includes("coordinate"));
    assert.ok(!diagram.svg.includes("Movements</text>"));

    assert.ok(!generated.stem.includes("DIR_"));
    assert.ok(!generated.explanation.conclusion.includes("DIR_"));

    if (ql.answerDemand === "ENDPOINT_DIRECTION") {
      assert.equal(typeof generated.correctAnswer, "string");
      const answer = generated.correctAnswer as string;
      endpointDirections.add(answer);
      reverseQueryValues.add(generated.metadata.reverseQuery);
    } else {
      const answer = generated.correctAnswer as CombinedPathAnswer;
      endpointDirections.add(answer.endpointDirection);
      finalFacings.add(answer.finalFacing);
      assert.ok(generated.options.every((option) => typeof option.value === "object"));
      assert.ok(generated.explanation.conclusion.includes(`facing ${answer.finalFacing.replace("_", "-")}`) || generated.explanation.conclusion.includes("facing"));
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

console.log("DIR-CP-002 exam prose, movement walkthrough and plain-diagram proof passed.", {
  qlCount: DIR_CP002_QLS.length,
  generatedCases: DIR_CP002_QLS.length * 200,
  endpointDirections: [...endpointDirections].sort(),
  finalFacings: [...finalFacings].sort(),
  difficulties: [...difficulties].sort(),
  answerPositions,
  stemDiversity: Object.fromEntries([...stemSets].map(([qlId, stems]) => [qlId, stems.size])),
});
