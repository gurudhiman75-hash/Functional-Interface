import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { CircularTopology } from "./cp003/topology.ts";
import {
  assertOutwardCaseletIntegrity,
  generateOutwardCaselet,
  SEA_CP004_BLUEPRINTS,
} from "./cp004/generator.ts";
import { enumerateOutwardProduction } from "./cp004/solvers.ts";

const topology = new CircularTopology(8);
assert.equal(topology.moveRelativeOutward(0, "LEFT", 1), 7);
assert.equal(topology.moveRelativeOutward(0, "RIGHT", 1), 1);
assert.notEqual(
  topology.moveRelativeOutward(0, "LEFT", 2),
  topology.moveRelativeCentre(0, "LEFT", 2),
  "outward and centre-facing left must differ",
);

const casesPerBlueprint = Number(process.env.SEA_CP004_PROOF_CASES ?? 100);
const answerPositions = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const observedSeatCounts = new Set<number>();
let generatedCaselets = 0;
let generatedQuestions = 0;
let oddGuardedCaselets = 0;
let landmarkCaselets = 0;
let reversalDetectorQuestions = 0;
let displayedClueNecessityAudits = 0;
const startedAt = performance.now();

for (const blueprint of SEA_CP004_BLUEPRINTS) {
  for (let index = 0; index < casesPerBlueprint; index += 1) {
    const seed = `SEA-CP004-PROOF-${blueprint}-${String(index).padStart(4, "0")}`;
    const caselet = generateOutwardCaselet(seed, blueprint);
    const replay = generateOutwardCaselet(seed, blueprint);
    assert.deepEqual(replay, caselet, `${blueprint}/${seed} was not deterministic`);
    assertOutwardCaseletIntegrity(caselet);
    generatedCaselets += 1;
    generatedQuestions += caselet.children.length;
    observedSeatCounts.add(caselet.topologySnapshot.seatCount);

    assert.match(caselet.setupText, /facing outward/);
    assert.match(caselet.sharedExplanation, /left is anticlockwise and right is clockwise/i);
    const reversalQuestions = caselet.children.filter((child) =>
      child.centreFacingCounterfactual !== undefined
        && JSON.stringify(child.centreFacingCounterfactual) !== JSON.stringify(child.answer));
    assert.ok(reversalQuestions.length >= 1, "caselet lacks a centre-facing counterfactual question");
    reversalDetectorQuestions += reversalQuestions.length;

    if (caselet.topologySnapshot.seatCount % 2 !== 0) {
      oddGuardedCaselets += 1;
      assert.ok(!caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE"));
      assert.ok(!caselet.children.some((child) => child.queryContractId === "SEA-QC-010"));
    }
    if (blueprint === "SEA-PBA-013") {
      assert.equal(caselet.topologySnapshot.seatCount % 2, 0);
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE"));
    }
    if (blueprint === "SEA-PBA-014") {
      assert.ok(caselet.constraints.filter((constraint) => constraint.kind === "RELATIVE_POSITION").length >= 3);
    }
    if (blueprint === "SEA-PBA-015") {
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "ADJACENT"));
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "DIRECTIONAL_COUNT_BETWEEN"));
    }
    if (blueprint === "SEA-PBA-016") {
      landmarkCaselets += 1;
      assert.ok(caselet.topologySnapshot.landmark);
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "LANDMARK_ANCHOR"));
    }

    const persons = caselet.solverOracleAgreement.productionKeys[0]?.split("|") ?? [];
    for (const clue of caselet.constraints) {
      const trial = caselet.constraints.filter((candidate) => candidate.id !== clue.id);
      const models = caselet.topologySnapshot.landmark
        && !trial.some((candidate) => candidate.kind === "LANDMARK_ANCHOR")
        ? []
        : enumerateOutwardProduction({
            persons,
            constraints: trial,
            landmarkAnchored: caselet.topologySnapshot.landmark !== undefined,
            maxModels: 2,
          });
      assert.notEqual(models.length, 1, `${blueprint}/${seed}/${clue.id} was redundant`);
      displayedClueNecessityAudits += 1;
    }

    for (const child of caselet.children) {
      answerPositions[child.questionOrder - 1]![child.answerIndex] += 1;
    }
  }
}

assert.equal(generatedCaselets, SEA_CP004_BLUEPRINTS.length * casesPerBlueprint);
assert.equal(generatedQuestions, generatedCaselets * 4);
assert.equal(landmarkCaselets, casesPerBlueprint);
assert.ok(oddGuardedCaselets > 0);
assert.ok(reversalDetectorQuestions >= generatedCaselets);
assert.ok(observedSeatCounts.has(6) && observedSeatCounts.has(8) && observedSeatCounts.has(10));
assert.ok(observedSeatCounts.has(7) || observedSeatCounts.has(9));
for (const counts of answerPositions) {
  assert.ok(counts.every((count) => count > 0), `Missing answer position: ${counts.join(",")}`);
}

console.log("PASS_SEA_001_CP004_OUTWARD");
console.log(`named blueprint authorities ${SEA_CP004_BLUEPRINTS.length}`);
console.log(`generated deterministic caselets ${generatedCaselets}`);
console.log(`generated child questions ${generatedQuestions}`);
console.log(`odd-seat guarded caselets ${oddGuardedCaselets}`);
console.log(`landmark-anchored caselets ${landmarkCaselets}`);
console.log(`centre-rule reversal detector questions ${reversalDetectorQuestions}`);
console.log(`displayed-clue necessity audits ${displayedClueNecessityAudits}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - startedAt)}`);
console.log("permanent QLs 0");
