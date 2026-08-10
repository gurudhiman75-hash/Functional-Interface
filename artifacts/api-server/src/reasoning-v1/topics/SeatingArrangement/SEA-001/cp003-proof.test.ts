import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { canonicalDigest } from "./canonical.ts";
import { circularConstraintFingerprint } from "./cp003/constraints.ts";
import { assertCircularCaseletIntegrity, generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "./cp003/generator.ts";
import { CircularTopology, circularCanonicalKey, rotateOrder } from "./cp003/topology.ts";
import { enumerateCircularProduction } from "./cp003/solvers.ts";

const topology6 = new CircularTopology(6);
assert.equal(topology6.moveCyclic(5, "CLOCKWISE", 2), 1, "clockwise wrap-around failed");
assert.equal(topology6.moveCyclic(0, "ANTICLOCKWISE", 1), 5, "anticlockwise wrap-around failed");
assert.equal(topology6.moveRelativeCentre(5, "LEFT", 2), 1, "centre-facing left must be clockwise");
assert.equal(topology6.moveRelativeCentre(0, "RIGHT", 1), 5, "centre-facing right must be anticlockwise");
assert.equal(topology6.oppositeSeatIndex(5), 2, "even opposite seat failed");
assert.equal(new CircularTopology(7).oppositeSeatIndex(0), null, "odd circle must not expose opposite seat");
assert.equal(topology6.countBetween(5, 2, "CLOCKWISE"), 2, "clockwise arc count failed");

const rotationFixture = ["A", "B", "C", "D", "E", "F"];
const rotationKey = circularCanonicalKey(rotationFixture, false);
for (let offset = 0; offset < rotationFixture.length; offset += 1) {
  assert.equal(circularCanonicalKey(rotateOrder(rotationFixture, offset), false), rotationKey, "rotation canonicalisation failed");
}
assert.notEqual(
  circularCanonicalKey(rotationFixture, true),
  circularCanonicalKey(rotateOrder(rotationFixture, 1), true),
  "landmark anchor must break rotation equivalence",
);

const casesPerBlueprint = 125;
const answerPositions = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const observedSeatCounts = new Set<number>();
const observedBlueprints = new Set<string>();
let caseletCount = 0;
let childCount = 0;
let oddCaselets = 0;
let landmarkCaselets = 0;
let deterministicReplays = 0;
let fullClueNecessityAudits = 0;
const start = performance.now();

for (const blueprint of SEA_CP003_BLUEPRINTS) {
  for (let index = 0; index < casesPerBlueprint; index += 1) {
    const seed = `SEA-CP003-PROOF-${blueprint}-${String(index).padStart(4, "0")}`;
    const caselet = generateCircularCaselet(seed, blueprint);
    assertCircularCaseletIntegrity(caselet);
    observedBlueprints.add(caselet.blueprintAuthorityId);
    observedSeatCounts.add(caselet.topologySnapshot.seatCount);
    caseletCount += 1;
    childCount += caselet.children.length;

    assert.match(caselet.setupText, /not necessarily in the same order/);
    assert.doesNotMatch(caselet.setupText, /Rotations represent|fixes one displayed seat/);
    assert.equal(new Set(caselet.constraints.map(circularConstraintFingerprint)).size, caselet.constraints.length, "semantically duplicate displayed clue");
    assert.match(caselet.children[0]?.text ?? "", /Who sits second to the left of/);
    assert.ok(caselet.children.every((child) => !child.explanation.includes("1 persons")), "singular/plural explanation error");

    if (caselet.topologySnapshot.seatCount % 2 !== 0) {
      oddCaselets += 1;
      assert.ok(!caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE"), "odd caselet contains opposite clue");
      assert.ok(!caselet.children.some((child) => child.queryContractId === "SEA-QC-010"), "odd caselet contains opposite query");
      assert.ok(caselet.checkpointSkillCoverage.includes("ODD_OPPOSITE_GUARD"));
    }

    if (blueprint === "SEA-PBA-009") {
      assert.equal(caselet.topologySnapshot.seatCount % 2, 0, "opposite-anchor blueprint must be even");
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE"), "opposite-anchor blueprint lacks opposite clue");
    }
    if (blueprint === "SEA-PBA-010") {
      assert.ok(caselet.constraints.filter((constraint) => constraint.kind === "CYCLIC_POSITION" && constraint.steps === 1).length >= 3, "clockwise-block blueprint lacks linked block");
    }
    if (blueprint === "SEA-PBA-011") {
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "DIRECTIONAL_COUNT_BETWEEN"), "gap blueprint lacks directional gap");
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "ADJACENT"), "gap blueprint lacks adjacency clue");
    }
    if (blueprint === "SEA-PBA-012") {
      landmarkCaselets += 1;
      assert.ok(caselet.topologySnapshot.landmark, "landmark blueprint lacks topology landmark");
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "LANDMARK_ANCHOR"), "landmark blueprint lacks anchor clue");
      assert.ok(caselet.diagram.landmark, "landmark blueprint lacks landmark diagram");
      assert.match(caselet.setupText, /(An entrance|A stage|A door) is shown at the top of the diagram/);
    } else {
      assert.equal(caselet.topologySnapshot.landmark, undefined, "non-landmark blueprint gained an absolute marker");
      assert.ok(!caselet.constraints.some((constraint) => constraint.kind === "LANDMARK_ANCHOR"));
    }

    for (const child of caselet.children) {
      answerPositions[child.questionOrder - 1]![child.answerIndex] += 1;
    }

    if (index % 10 === 0) {
      for (const clue of caselet.constraints) {
        const trial = caselet.constraints.filter((constraint) => constraint.id !== clue.id);
        const landmarkAnchored = caselet.topologySnapshot.landmark !== undefined;
        const models = landmarkAnchored && !trial.some((constraint) => constraint.kind === "LANDMARK_ANCHOR")
          ? []
          : enumerateCircularProduction({
              persons: caselet.solverOracleAgreement.productionKeys[0]?.split("|") ?? [],
              constraints: trial,
              landmarkAnchored,
              maxModels: 2,
            });
        assert.notEqual(models.length, 1, `displayed clue ${clue.id} was redundant`);
      }
      fullClueNecessityAudits += 1;
    }

    if (index % 25 === 0) {
      const replay = generateCircularCaselet(seed, blueprint);
      assert.equal(canonicalDigest(replay), canonicalDigest(caselet), "deterministic replay failed");
      deterministicReplays += 1;
    }
  }
}

assert.deepEqual([...observedBlueprints].sort(), [...SEA_CP003_BLUEPRINTS].sort(), "not all CP-003 blueprints were reachable");
assert.ok(observedSeatCounts.has(6) && observedSeatCounts.has(8) && observedSeatCounts.has(10), "required 6/8/10 variants were not all reached");
assert.ok(observedSeatCounts.has(7) || observedSeatCounts.has(9), "odd-seat guard variants were not reached");
assert.ok(oddCaselets > 0, "odd-seat proof corpus is empty");
assert.equal(landmarkCaselets, casesPerBlueprint, "landmark blueprint count mismatch");

for (let childPosition = 0; childPosition < answerPositions.length; childPosition += 1) {
  const counts = answerPositions[childPosition] as number[];
  const spread = Math.max(...counts) - Math.min(...counts);
  // Visible query shuffling mixes several independently balanced query families.
  // Allow normal random variation while still rejecting a persistent A/B/C/D bias.
  assert.ok(spread <= 35, `answer positions are imbalanced for child ${childPosition + 1}: ${counts.join(",")}`);
  assert.ok(counts.every((count) => count > 0), `child ${childPosition + 1} misses an answer position`);
}

const elapsedMs = performance.now() - start;
console.log("PASS_SEA_001_CP003_CIRCULAR_FOUNDATION");
console.log(`named blueprint authorities ${SEA_CP003_BLUEPRINTS.length}`);
console.log(`generated deterministic caselets ${caseletCount}`);
console.log(`generated child questions ${childCount}`);
console.log(`odd-seat guarded caselets ${oddCaselets}`);
console.log(`landmark-anchored caselets ${landmarkCaselets}`);
console.log(`full displayed-clue necessity audits ${fullClueNecessityAudits}`);
console.log(`deterministic replay checks ${deterministicReplays}`);
console.log(`elapsed milliseconds ${Math.round(elapsedMs)}`);
console.log("permanent QLs 0");
