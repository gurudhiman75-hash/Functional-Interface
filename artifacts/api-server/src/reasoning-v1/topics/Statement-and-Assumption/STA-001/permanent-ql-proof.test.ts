import assert from "node:assert/strict";
import { STA_PERMANENT_QL_LIFECYCLE } from "./lifecycle.ts";
import { evaluateAssumptionOracle } from "./oracle.ts";
import {
  STA_DEFERRED_DISCOVERY_RESERVES,
  STA_PERMANENT_QL_AUTHORITIES,
  assertStaPermanentAuthorityIntegrity,
} from "./permanent-authorities.ts";
import { STA_EXECUTABLE_SCENARIOS, STA_SCENARIOS_BY_QL } from "./prototype-authorities.ts";

assertStaPermanentAuthorityIntegrity();
assert.deepEqual(
  STA_PERMANENT_QL_AUTHORITIES.map((authority) => authority.qlId),
  ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"],
  "STA permanent QL IDs changed",
);
assert.ok(STA_PERMANENT_QL_AUTHORITIES.every((authority) => authority.sourceState === "STRONG"));
assert.equal(STA_PERMANENT_QL_LIFECYCLE.maturity, "PERMANENT_QL_SEMANTIC_FREEZE");
assert.equal(STA_PERMANENT_QL_LIFECYCLE.permanentQlCount, 4);
assert.equal(STA_PERMANENT_QL_LIFECYCLE.questionStudioDiscoverable, false);
assert.equal(STA_PERMANENT_QL_LIFECYCLE.questionBankWritable, false);
assert.equal(STA_PERMANENT_QL_LIFECYCLE.testEligible, false);
assert.equal(STA_PERMANENT_QL_LIFECYCLE.publiclyPublishable, false);

const ql004Scenarios = STA_SCENARIOS_BY_QL["STA-QL-004"];
assert.equal(ql004Scenarios.length, 3);
for (const scenario of ql004Scenarios) {
  assert.ok(scenario.explicitPropositionIds.length > 0, `${scenario.scenarioId}: causal-bridge QL lacks explicit premise`);
  const explicitIds = new Set(scenario.explicitPropositionIds);
  for (const dependency of scenario.hiddenDependencies) {
    assert.equal(dependency.relation, "EFFICACY", `${scenario.scenarioId}: QL004 dependency must be an efficacy bridge`);
    assert.equal(explicitIds.has(dependency.propositionId), false, `${scenario.scenarioId}: hidden bridge is actually explicit`);
  }
}

const allThreeScenario = STA_EXECUTABLE_SCENARIOS.find((scenario) => scenario.scenarioId === "STA-DISC-QL002-004");
assert.ok(allThreeScenario, "Missing all-three-implicit source-supported scenario");
assert.equal(allThreeScenario.candidates.length, 3);
assert.deepEqual(
  allThreeScenario.candidates.map((candidate) => evaluateAssumptionOracle(allThreeScenario, candidate).classification),
  ["IMPLICIT", "IMPLICIT", "IMPLICIT"],
);

assert.deepEqual(
  STA_DEFERRED_DISCOVERY_RESERVES,
  [
    "ADVERTISING_OR_APPEAL_BREADTH_AS_A_SEPARATE_QL",
    "COMPARISON_MEASUREMENT_REPRESENTATIVENESS_AS_A_SEPARATE_QL",
    "NEGATIVE_QUERY_AS_A_SEPARATE_QL",
  ],
  "A deferred presentation/source reserve was silently promoted into the permanent QL set",
);

console.log("PASS_STA_001_PERMANENT_QL_SEMANTIC_FREEZE");
console.log(`permanent QLs ${STA_PERMANENT_QL_AUTHORITIES.length}`);
console.log(`reviewed executable authorities ${STA_EXECUTABLE_SCENARIOS.length}`);
console.log(`deferred discovery reserves ${STA_DEFERRED_DISCOVERY_RESERVES.length}`);
console.log("Question Studio false");
