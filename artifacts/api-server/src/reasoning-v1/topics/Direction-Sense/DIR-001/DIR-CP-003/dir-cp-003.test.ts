import assert from "node:assert/strict";
import { DIR_CP003_QLS } from "./task-registry";
import { generateDirCp003Question, type DirectionDistanceAnswer, type DistanceOnlyAnswer, type TravelDisplacementAnswer } from "./generator";

assert.deepEqual(
  DIR_CP003_QLS.map((ql) => ql.qlId),
  ["DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"],
);
assert.equal(new Set(DIR_CP003_QLS.map((ql) => ql.ruleId)).size, 5);
assert.ok(DIR_CP003_QLS.every((ql) => ql.solveMode === undefined));
assert.ok(DIR_CP003_QLS.every((ql) => ql.status === "DRAFT"));

const answerPositions = [0, 0, 0, 0];
const directionCoverage = new Set<string>();
const qlProfiles = new Map<string, Set<string>>();
const qlDisplayModes = new Map<string, Set<string>>();
const reverseValues = new Set<boolean>();
const stemSets = new Map<string, Set<string>>();
const difficulties = new Set<string>();

for (const ql of DIR_CP003_QLS) {
  const profiles = new Set<string>();
  const displayModes = new Set<string>();
  const stems = new Set<string>();
  qlProfiles.set(ql.qlId, profiles);
  qlDisplayModes.set(ql.qlId, displayModes);
  stemSets.set(ql.qlId, stems);

  for (let seed = 0; seed < 120; seed += 1) {
    const generated = generateDirCp003Question(ql.qlId, seed);
    const replay = generateDirCp003Question(ql.qlId, seed);
    assert.deepEqual(replay, generated, `${ql.qlId} seed ${seed} is not deterministic`);
    assert.equal(generated.checkpointId, "DIR-CP-003");
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.equal(generated.metadata.solverVerified, true);
    assert.equal(generated.metadata.solveMode, null);
    assert.equal(generated.stem.split("\n").length, 1);
    assert.ok(generated.stem.includes("starts from a point facing"));
    assert.ok(!generated.stem.includes("point O"));
    assert.ok(!generated.stem.match(/point [A-Z]/));
    assert.ok(!generated.stem.includes("coordinate"));
    assert.ok(!generated.stem.includes("Pythagoras"));

    assert.equal(generated.explanation.movementLines.length, generated.metadata.legCount);
    assert.ok(generated.explanation.given.length > 40);
    assert.ok(generated.explanation.netLine.startsWith("The net movement is"));
    assert.ok(generated.explanation.conclusion.length > 30);
    assert.equal(generated.explanation.diagram.segments.length, generated.metadata.legCount);
    assert.equal(generated.explanation.diagram.points.length, generated.metadata.legCount + 1);
    assert.ok(generated.explanation.diagram.svg.startsWith("<svg"));
    assert.ok(generated.explanation.diagram.svg.includes("Movement path"));
    assert.ok(!generated.explanation.diagram.svg.includes("asked-relation"));
    assert.ok(!generated.explanation.diagram.svg.includes("final-facing"));
    assert.ok(!generated.explanation.diagram.svg.includes("coordinate"));
    assert.ok(!generated.explanation.diagram.svg.includes("solution"));
    assert.equal((generated.explanation.diagram.svg.match(/data-role="movement-leg"/g) ?? []).length, generated.metadata.legCount);
    assert.equal((generated.explanation.diagram.svg.match(/data-role="distance-label"/g) ?? []).length, generated.metadata.legCount);
    const illustratesShortestDistance = ql.answerDemand !== "MISSING_MOVEMENT_DISTANCE";
    assert.equal(generated.explanation.calculationLine !== null, illustratesShortestDistance);
    assert.equal((generated.explanation.diagram.svg.match(/data-role="shortest-distance-line"/g) ?? []).length, illustratesShortestDistance ? 1 : 0);
    assert.equal((generated.explanation.diagram.svg.match(/data-role="shortest-distance-key"/g) ?? []).length, illustratesShortestDistance ? 1 : 0);
    if (illustratesShortestDistance) {
      assert.ok(generated.explanation.calculationLine!.includes("straight line"));
      assert.ok(generated.explanation.calculationLine!.includes("Start"));
      assert.ok(generated.explanation.calculationLine!.includes("Finish"));
      assert.ok(generated.explanation.calculationLine!.includes("√") || generated.explanation.calculationLine!.includes("Only one net direction"));
      const keyMarkup = generated.explanation.diagram.svg.match(/<g data-role="shortest-distance-key">(.*?)<\/g>/)?.[1] ?? "";
      assert.ok(keyMarkup.includes("Shortest distance"));
      assert.ok(!keyMarkup.includes("<line"), "Shortest-distance key text must not be crossed by a line");
    }
    assert.ok(generated.explanation.diagram.svg.includes('data-role="compass" transform="translate(654 80)"'));
    const routeCoordinates = [...generated.explanation.diagram.svg.matchAll(/data-role="movement-leg" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)];
    assert.equal(routeCoordinates.length, generated.metadata.legCount);
    assert.ok(routeCoordinates.every((match) => Number(match[1]) <= 550 + 1e-9 && Number(match[3]) <= 550 + 1e-9), "Route entered the reserved compass zone");
    assert.ok(routeCoordinates.every((match) => Number(match[2]) <= 375 + 1e-9 && Number(match[4]) <= 375 + 1e-9), "Route entered the reserved footer zone");

    profiles.add(generated.metadata.pathProfile);
    displayModes.add(generated.metadata.displayMode);
    stems.add(generated.stem);
    difficulties.add(generated.difficulty);
    answerPositions[generated.correctIndex] += 1;

    if (ql.answerDemand === "SHORTEST_DISTANCE") {
      assert.ok(["AXIS", "PYTHAGOREAN"].includes(generated.metadata.pathProfile));
      assert.equal((generated.correctAnswer as DistanceOnlyAnswer).kind, "DISTANCE");
      assert.ok(Number.isInteger((generated.correctAnswer as DistanceOnlyAnswer).distance));
      assert.ok(generated.stem.includes("shortest distance"));
    } else if (ql.answerDemand === "DIRECTION_AND_SHORTEST_DISTANCE") {
      const answer = generated.correctAnswer as DirectionDistanceAnswer;
      assert.equal(answer.kind, "DIRECTION_DISTANCE");
      directionCoverage.add(answer.direction);
      reverseValues.add(generated.metadata.reverseQuery);
      assert.ok(generated.stem.includes("In which direction and at what shortest distance"));
    } else if (ql.answerDemand === "TOTAL_DISTANCE_AND_DISPLACEMENT") {
      const answer = generated.correctAnswer as TravelDisplacementAnswer;
      assert.equal(answer.kind, "TOTAL_AND_DISPLACEMENT");
      assert.ok(answer.totalDistance > answer.displacement);
      assert.ok(generated.stem.includes("total distance travelled"));
    } else if (ql.answerDemand === "MISSING_MOVEMENT_DISTANCE") {
      const answer = generated.correctAnswer as DistanceOnlyAnswer;
      assert.equal(answer.kind, "DISTANCE");
      assert.ok(Number.isInteger(answer.distance) && answer.distance > 0);
      const operations = generated.structuredPrompt.operations as readonly { readonly kind: string; readonly distance?: number | null }[];
      assert.equal(operations.filter((operation) => operation.kind === "MOVE" && operation.distance === null).length, 1);
      assert.ok(generated.stem.includes("walks some distance"));
      assert.ok(!generated.stem.includes(`${answer.distance} metres. At the end`));
    } else {
      const answer = generated.correctAnswer as DistanceOnlyAnswer;
      assert.equal(answer.kind, "DISTANCE");
      assert.ok(!Number.isInteger(answer.distance));
      assert.equal(generated.metadata.pathProfile, "NON_INTEGER");
      assert.ok(["RADICAL", "DECIMAL_1"].includes(generated.metadata.displayMode));
      if (generated.metadata.displayMode === "RADICAL") {
        assert.ok(generated.options.every((option) => option.label.includes("√") || /^\d+ metres$/.test(option.label)));
      } else {
        assert.ok(generated.options.every((option) => /\d+\.\d metres$/.test(option.label)));
      }
    }
  }
}

assert.deepEqual([...qlProfiles.get("DIR-QL-006")!].sort(), ["AXIS", "PYTHAGOREAN"]);
assert.deepEqual([...qlProfiles.get("DIR-QL-007")!].sort(), ["AXIS", "PYTHAGOREAN"]);
assert.deepEqual([...qlDisplayModes.get("DIR-QL-010")!].sort(), ["DECIMAL_1", "RADICAL"]);
assert.equal(directionCoverage.size, 8, `Direction-distance coverage incomplete: ${[...directionCoverage].join(", ")}`);
assert.deepEqual([...reverseValues].sort(), [false, true]);
assert.ok(difficulties.has("EASY"));
assert.ok(difficulties.has("MEDIUM"));
assert.ok(difficulties.has("HARD"));
for (const [qlId, stems] of stemSets) {
  assert.ok(stems.size >= 100, `${qlId} stem diversity too low: ${stems.size}`);
}
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(maxPosition / minPosition < 1.5, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("DIR-CP-003 distance, displacement, inverse and display proof passed.", {
  qlCount: DIR_CP003_QLS.length,
  generatedCases: DIR_CP003_QLS.length * 120,
  directionCoverage: [...directionCoverage].sort(),
  profiles: Object.fromEntries([...qlProfiles].map(([qlId, values]) => [qlId, [...values].sort()])),
  displayModes: Object.fromEntries([...qlDisplayModes].map(([qlId, values]) => [qlId, [...values].sort()])),
  answerPositions,
  stemDiversity: Object.fromEntries([...stemSets].map(([qlId, stems]) => [qlId, stems.size])),
});
