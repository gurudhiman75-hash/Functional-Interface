import assert from "node:assert/strict";
import { independentCollinear, independentDirection } from "./independent-solver";
import { generateDirCp004Question, type RelativeGraphAnswer } from "./generator";
import { DIR_CP004_QLS } from "./task-registry";

assert.deepEqual(DIR_CP004_QLS.map((ql) => ql.qlId), ["DIR-QL-011", "DIR-QL-012", "DIR-QL-013", "DIR-QL-014", "DIR-QL-015"]);
assert.equal(new Set(DIR_CP004_QLS.map((ql) => ql.ruleId)).size, 5);
assert.ok(DIR_CP004_QLS.every((ql) => ql.solveMode === undefined));
assert.ok(DIR_CP004_QLS.every((ql) => ql.status === "DRAFT"));

const answerPositions = [0, 0, 0, 0];
const directionCoverage = new Map<string, Set<string>>();
const stemDiversity = new Map<string, Set<string>>();
const difficulties = new Set<string>();

function rectanglesOverlap(left: readonly number[], right: readonly number[], padding = 1): boolean {
  return left[0] < right[0] + right[2] + padding
    && left[0] + left[2] + padding > right[0]
    && left[1] < right[1] + right[3] + padding
    && left[1] + left[3] + padding > right[1];
}

function rectangleTouchesCircle(rect: readonly number[], circle: readonly number[], padding = 2): boolean {
  const closestX = Math.min(Math.max(circle[0], rect[0]), rect[0] + rect[2]);
  const closestY = Math.min(Math.max(circle[1], rect[1]), rect[1] + rect[3]);
  return (circle[0] - closestX) ** 2 + (circle[1] - closestY) ** 2 < (circle[2] + padding) ** 2;
}

for (const ql of DIR_CP004_QLS) {
  const directions = new Set<string>();
  const stems = new Set<string>();
  directionCoverage.set(ql.qlId, directions);
  stemDiversity.set(ql.qlId, stems);

  for (let seed = 0; seed < 120; seed += 1) {
    const generated = generateDirCp004Question(ql.qlId, seed);
    const replay = generateDirCp004Question(ql.qlId, seed);
    assert.deepEqual(replay, generated, `${ql.qlId} seed ${seed} is not deterministic`);
    assert.equal(generated.checkpointId, "DIR-CP-004");
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.equal(generated.metadata.solverVerified, true);
    assert.equal(generated.metadata.solveMode, null);
    assert.equal(generated.metadata.graphTopology, "BRANCHED_TREE");
    assert.equal(generated.stem.split("\n").length, 1);
    assert.ok(!generated.stem.includes("coordinate"));
    assert.ok(!generated.stem.includes("point O"));
    assert.ok(generated.stem.includes("metres"));
    assert.equal(generated.explanation.placementLines.length, generated.metadata.relationCount);
    assert.ok(generated.explanation.placementLines.every((line) => line.includes("so place ")));
    assert.ok(generated.explanation.given.startsWith("Take "));
    assert.ok(generated.explanation.resultLine.length > 20);
    assert.ok(generated.explanation.conclusion.length > 20);
    assert.equal(generated.explanation.diagram.relationCount, generated.metadata.relationCount);
    assert.equal((generated.explanation.diagram.svg.match(/data-role="relation-edge"/g) ?? []).length, generated.metadata.relationCount);
    assert.equal((generated.explanation.diagram.svg.match(/data-role="position-node"/g) ?? []).length, generated.explanation.diagram.pointGroups.length);
    assert.ok(generated.explanation.diagram.svg.includes('data-role="compass"'));
    assert.ok(!generated.explanation.diagram.svg.includes("coordinate"));
    assert.ok(!generated.explanation.diagram.svg.includes("solution"));
    assert.ok(!generated.explanation.diagram.svg.includes("asked-relation"));
    const singleNodeShapes = [...generated.explanation.diagram.svg.matchAll(/data-role="single-node-shape" data-label-length="([^"]+)" cx="([^"]+)" cy="([^"]+)" r="([^"]+)"/g)];
    assert.ok(singleNodeShapes.every((match) => Number(match[4]) >= 18 + Number(match[1]) * 1.85 - 1e-9), "Node circle is too small for its label");
    const nodeCircles = singleNodeShapes.map((match) => [Number(match[2]), Number(match[3]), Number(match[4])] as const);
    const coincidentRects = [...generated.explanation.diagram.svg.matchAll(/data-role="coincident-node-shape" x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/g)]
      .map((match) => [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])] as const);
    const distanceRects = [...generated.explanation.diagram.svg.matchAll(/data-role="relation-distance"><rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/g)]
      .map((match) => [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])] as const);
    for (let left = 0; left < distanceRects.length; left += 1) {
      assert.ok(nodeCircles.every((circle) => !rectangleTouchesCircle(distanceRects[left], circle)), "Relation label touches a named node");
      assert.ok(coincidentRects.every((rect) => !rectanglesOverlap(distanceRects[left], rect, 2)), "Relation label touches the coincident node");
      for (let right = left + 1; right < distanceRects.length; right += 1) {
        assert.ok(!rectanglesOverlap(distanceRects[left], distanceRects[right]), "Relation labels overlap each other");
      }
    }
    if (ql.answerDemand === "RELATION_DIRECTION_AND_DISTANCE") {
      assert.ok(nodeCircles.every((circle) => circle[0] + circle[2] < 566), "A named node entered the shortest-distance key zone");
      assert.ok(coincidentRects.every((rect) => rect[0] + rect[2] < 566), "A grouped node entered the shortest-distance key zone");
      assert.ok(distanceRects.every((rect) => rect[0] + rect[2] < 566), "A relation label entered the shortest-distance key zone");
    }

    const queryLines = (generated.explanation.diagram.svg.match(/data-role="query-relation-line"/g) ?? []).length;
    const distanceKeys = (generated.explanation.diagram.svg.match(/data-role="shortest-distance-key"/g) ?? []).length;
    const collinearGuides = (generated.explanation.diagram.svg.match(/data-role="collinear-guide"/g) ?? []).length;
    const coincidentNodes = (generated.explanation.diagram.svg.match(/data-coincident="true"/g) ?? []).length;

    if (ql.answerDemand === "RELATION_DIRECTION") {
      assert.equal(generated.correctAnswer.kind, "DIRECTION");
      const answer = generated.correctAnswer as Extract<RelativeGraphAnswer, { readonly kind: "DIRECTION" }>;
      directions.add(answer.direction);
      const query = (generated.structuredPrompt.query ?? {}) as { readonly subject?: string; readonly reference?: string };
      const coordinates = generated.structuredPrompt.coordinates as Readonly<Record<string, { readonly x: number; readonly y: number }>>;
      assert.equal(independentDirection(coordinates[query.reference!], coordinates[query.subject!]), answer.direction);
      assert.equal(generated.explanation.calculationLine, null);
      assert.equal(queryLines, 1);
      assert.equal(distanceKeys, 0);
      assert.ok(generated.explanation.diagram.svg.includes('data-guide-kind="relation-guide"'));
      assert.ok(generated.explanation.diagram.svg.indexOf('data-role="query-relation-line"') < generated.explanation.diagram.svg.indexOf('data-role="relation-distance"'), "Relation guide must remain behind labels");
      assert.ok(generated.stem.includes("In which direction"));
    } else if (ql.answerDemand === "RELATION_DIRECTION_AND_DISTANCE") {
      assert.equal(generated.correctAnswer.kind, "DIRECTION_DISTANCE");
      const answer = generated.correctAnswer as Extract<RelativeGraphAnswer, { readonly kind: "DIRECTION_DISTANCE" }>;
      directions.add(answer.direction);
      const query = (generated.structuredPrompt.query ?? {}) as { readonly subject?: string; readonly reference?: string };
      const coordinates = generated.structuredPrompt.coordinates as Readonly<Record<string, { readonly x: number; readonly y: number }>>;
      assert.equal(independentDirection(coordinates[query.reference!], coordinates[query.subject!]), answer.direction);
      assert.ok(Number.isInteger(answer.distance) && answer.distance > 0);
      assert.ok(generated.explanation.calculationLine?.includes("shortest distance") || generated.explanation.calculationLine?.includes("straight-line distance"));
      const horizontal = Math.abs(coordinates[query.subject!].x - coordinates[query.reference!].x);
      const vertical = Math.abs(coordinates[query.subject!].y - coordinates[query.reference!].y);
      if (horizontal > 0 && vertical > 0) {
        assert.ok(generated.explanation.calculationLine!.includes(`${horizontal ** 2} + ${vertical ** 2}`), "Pythagorean working must show the squared values being added");
      }
      assert.equal(queryLines, 1);
      assert.equal(distanceKeys, 1);
      assert.ok(generated.explanation.diagram.svg.includes('data-guide-kind="shortest-distance"'));
      assert.ok(!generated.explanation.diagram.svg.includes('<line x1="584"'));
      assert.ok(generated.explanation.diagram.svg.indexOf('data-role="query-relation-line"') < generated.explanation.diagram.svg.indexOf('data-role="relation-distance"'), "Query line must remain behind relation labels");
      assert.ok(generated.stem.includes("at what shortest distance"));
    } else if (ql.answerDemand === "ENTITY_AT_RELATION") {
      assert.equal(generated.correctAnswer.kind, "ENTITY");
      const answer = generated.correctAnswer as Extract<RelativeGraphAnswer, { readonly kind: "ENTITY" }>;
      const query = (generated.structuredPrompt.query ?? {}) as { readonly subject?: string; readonly reference?: string; readonly direction?: string };
      const coordinates = generated.structuredPrompt.coordinates as Readonly<Record<string, { readonly x: number; readonly y: number }>>;
      assert.equal(independentDirection(coordinates[query.reference!], coordinates[answer.entity]), query.direction);
      assert.equal(query.subject, answer.entity);
      assert.equal(queryLines, 1);
      assert.equal(distanceKeys, 0);
      assert.ok(generated.explanation.diagram.svg.includes('data-guide-kind="relation-guide"'));
      assert.ok(generated.explanation.diagram.svg.indexOf('data-role="query-relation-line"') < generated.explanation.diagram.svg.indexOf('data-role="relation-distance"'), "Lookup guide must remain behind labels");
      assert.ok(generated.stem.includes("Who is"));
    } else if (ql.answerDemand === "COLLINEAR_ENTITY_GROUP") {
      assert.equal(generated.correctAnswer.kind, "ENTITY_GROUP");
      const coordinates = generated.structuredPrompt.coordinates as Readonly<Record<string, { readonly x: number; readonly y: number }>>;
      const answer = generated.correctAnswer as Extract<RelativeGraphAnswer, { readonly kind: "ENTITY_GROUP" }>;
      const [a, b, c] = answer.entities;
      assert.ok(independentCollinear(coordinates[a], coordinates[b], coordinates[c]));
      assert.equal(collinearGuides, 1);
      assert.equal(coincidentNodes, 0);
      const guide = /data-role="collinear-guide" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/.exec(generated.explanation.diagram.svg);
      assert.ok(guide);
      assert.ok(Math.hypot(Number(guide![3]) - Number(guide![1]), Number(guide![4]) - Number(guide![2])) > 100, "Collinear guide must visibly extend across the group");
      assert.ok(generated.stem.includes("straight line"));
    } else {
      assert.equal(generated.correctAnswer.kind, "ENTITY_PAIR");
      const coordinates = generated.structuredPrompt.coordinates as Readonly<Record<string, { readonly x: number; readonly y: number }>>;
      const answer = generated.correctAnswer as Extract<RelativeGraphAnswer, { readonly kind: "ENTITY_PAIR" }>;
      const [left, right] = answer.entities;
      assert.equal(independentDirection(coordinates[left], coordinates[right]), "SAME_POSITION");
      assert.equal(coincidentNodes, 1);
      assert.equal((generated.explanation.diagram.svg.match(/data-role="coincident-node-shape"/g) ?? []).length, 1);
      assert.ok(generated.explanation.diagram.svg.includes(" and "));
      assert.equal(collinearGuides, 0);
      assert.ok(generated.stem.includes("same position"));
    }

    const correctKey = JSON.stringify(generated.correctAnswer as RelativeGraphAnswer);
    assert.ok(correctKey.length > 5);
    stems.add(generated.stem);
    difficulties.add(generated.difficulty);
    answerPositions[generated.correctIndex] += 1;
  }
}

assert.equal(directionCoverage.get("DIR-QL-011")!.size, 8);
assert.equal(directionCoverage.get("DIR-QL-012")!.size, 8);
for (const [qlId, stems] of stemDiversity) assert.ok(stems.size >= 110, `${qlId} stem diversity too low: ${stems.size}`);
assert.ok(difficulties.has("EASY"));
assert.ok(difficulties.has("MEDIUM"));
assert.ok(difficulties.has("HARD"));
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(maxPosition / minPosition < 1.35, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("DIR-CP-004 relative-position graph proof passed.", {
  qlCount: DIR_CP004_QLS.length,
  generatedCases: DIR_CP004_QLS.length * 120,
  directionCoverage: Object.fromEntries([...directionCoverage].map(([qlId, values]) => [qlId, [...values].sort()])),
  answerPositions,
  stemDiversity: Object.fromEntries([...stemDiversity].map(([qlId, stems]) => [qlId, stems.size])),
});
