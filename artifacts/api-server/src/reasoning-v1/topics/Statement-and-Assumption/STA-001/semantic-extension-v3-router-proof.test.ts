import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_V2 } from "./english-corpus/index.ts";
import { STA_SEMANTIC_EXTENSION_V3_AUTHORITIES } from "./semantic-extension-v3-authorities.ts";
import {
  assertStaExtendedScenarioOwnership,
  routeStaExtendedScenarioBySemantics,
} from "./semantic-extension-v3-router.ts";

for (const scenario of STA_ENGLISH_CORPUS_V2) {
  assertStaExtendedScenarioOwnership(scenario);
}

for (const scenario of STA_SEMANTIC_EXTENSION_V3_AUTHORITIES) {
  assertStaExtendedScenarioOwnership(scenario);
}

const comparisonAdvertisement = STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.find(
  (scenario) => scenario.scenarioId === "STA-EXT6-BANK-LOAN-RATE-COMPARISON",
);
assert.ok(comparisonAdvertisement, "comparison advertisement fixture missing");
assert.equal(comparisonAdvertisement.discourseAct, "ADVERTISEMENT");
assert.equal(routeStaExtendedScenarioBySemantics(comparisonAdvertisement), "STA-QL-006");

const ordinaryAdvertisement = STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.find(
  (scenario) => scenario.scenarioId === "STA-EXT5-BANK-DOORSTEP-ACCOUNT",
);
assert.ok(ordinaryAdvertisement, "ordinary advertisement fixture missing");
assert.equal(routeStaExtendedScenarioBySemantics(ordinaryAdvertisement), "STA-QL-005");

const appeal = STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.find(
  (scenario) => scenario.scenarioId === "STA-EXT5-BANK-WATER-APPEAL",
);
assert.ok(appeal, "appeal fixture missing");
assert.equal(routeStaExtendedScenarioBySemantics(appeal), "STA-QL-005");

const measurement = STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.find(
  (scenario) => scenario.scenarioId === "STA-EXT6-BANK-ASER-MEASURE",
);
assert.ok(measurement, "measurement fixture missing");
assert.equal(routeStaExtendedScenarioBySemantics(measurement), "STA-QL-006");

console.log("PASS_STA_001_SEMANTIC_EXTENSION_V3_ROUTER");
console.log(JSON.stringify({
  frozenCoreOwnershipChecks: STA_ENGLISH_CORPUS_V2.length,
  extensionOwnershipChecks: STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.length,
  precedenceRule: "EVIDENCE_VALIDITY_BEFORE_PERSUASIVE_SURFACE",
  comparisonAdvertisementRoute: routeStaExtendedScenarioBySemantics(comparisonAdvertisement),
  ordinaryAdvertisementRoute: routeStaExtendedScenarioBySemantics(ordinaryAdvertisement),
  appealRoute: routeStaExtendedScenarioBySemantics(appeal),
  measurementRoute: routeStaExtendedScenarioBySemantics(measurement),
}, null, 2));
