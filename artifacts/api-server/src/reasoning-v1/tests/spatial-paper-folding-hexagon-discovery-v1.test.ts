import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_HEXAGON_DISCOVERY_AUTHORITY_V1,
  pfcHexagonDiscoveryScenariosV1,
  solvePfcHexagonReverseInferenceV1,
  solvePfcHexagonScenarioV1,
} from "../foundation/spatial/paper-folding-hexagon-discovery-v1";
import { PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V4 } from "../foundation/spatial/paper-folding-polygon-source-saturation-v4";

const scenarios = pfcHexagonDiscoveryScenariosV1();
assert.equal(scenarios.length, 8);
assert.equal(scenarios.filter((s) => s.family === "HEXAGON_SINGLE_AXIS").length, 4);
assert.equal(scenarios.filter((s) => s.family === "HEXAGON_SIX_SECTOR_RADIAL").length, 4);
assert.equal(PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V4.shapeDecisions.HEXAGON, "ACTIVE_SOURCE_BACKED_POLYGON_REVIEW_REQUIRED");

const solutions = scenarios.map(solvePfcHexagonScenarioV1);
assert.equal(new Set(solutions.map((s) => s.fingerprint)).size, 8);
for (const solution of solutions.slice(0, 4)) {
  assert.equal(solution.affectedLayerCount, 2);
  assert.equal(solution.mappedCuts.length, 2);
}
for (const solution of solutions.slice(4)) {
  assert.equal(solution.affectedLayerCount, 6);
  assert.equal(solution.mappedCuts.length, 6);
}

const reverseCandidates = scenarios.filter((s) => s.cut.kind === "CIRCLE_HOLE");
assert.ok(reverseCandidates.length >= 4);
for (const target of reverseCandidates.slice(0, 4)) {
  const fingerprint = solvePfcHexagonScenarioV1(target).fingerprint;
  assert.equal(solvePfcHexagonReverseInferenceV1(fingerprint, reverseCandidates).scenarioId, target.scenarioId);
}

const evidence = {
  status: "PASS_PFC_HEXAGON_DISCOVERY_V1",
  authority: PFC_001_HEXAGON_DISCOVERY_AUTHORITY_V1,
  scenarioCount: scenarios.length,
  singleAxisScenarioCount: 4,
  sixSectorScenarioCount: 4,
  affectedLayerCounts: solutions.map((s) => ({ scenarioId: s.scenarioId, layers: s.affectedLayerCount })),
  uniqueFingerprints: true,
  reverseInferenceUnique: true,
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_001_HEXAGON_LEARNER_REVIEW_V1",
  },
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-hexagon-discovery-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
