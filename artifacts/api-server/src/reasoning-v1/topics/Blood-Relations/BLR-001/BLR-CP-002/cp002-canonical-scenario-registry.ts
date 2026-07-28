import { BLR_CP002_LONG_CHAIN_SCENARIOS } from "./cp002-long-chain-scenarios";
import { BLR_CP002_NEGATIVE_SIBLING_SCENARIOS } from "./cp002-negative-sibling-scenarios";
import { BLR_CP002_ONLY_CHILD_SCENARIOS } from "./cp002-only-child-scenarios";
import { BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS } from "./cp002-ownership-question-scenarios";
import {
  cp002ScenariosFor,
  type BlrCp002ScenarioTemplate,
} from "./cp002-scenario-library";
import { BLR_CP002_SOURCE_WIDENING_SCENARIOS } from "./cp002-source-widening-scenarios";
import { BLR_CP002_THREE_ANCHOR_SCENARIOS } from "./cp002-three-anchor-scenarios";
import type { BlrCp002PrototypeId } from "./cp002-types";

const EXTENDED_ONLY_PROTOTYPES = new Set<BlrCp002PrototypeId>([
  "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
]);

const EXTENDED_SCENARIOS: readonly BlrCp002ScenarioTemplate[] = [
  ...BLR_CP002_SOURCE_WIDENING_SCENARIOS,
  ...BLR_CP002_ONLY_CHILD_SCENARIOS,
  ...BLR_CP002_LONG_CHAIN_SCENARIOS,
  ...BLR_CP002_THREE_ANCHOR_SCENARIOS,
  ...BLR_CP002_NEGATIVE_SIBLING_SCENARIOS,
  ...BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS,
];

export function cp002CanonicalScenariosFor(
  prototypeId: BlrCp002PrototypeId,
): readonly BlrCp002ScenarioTemplate[] {
  const baseScenarios = EXTENDED_ONLY_PROTOTYPES.has(prototypeId)
    ? []
    : cp002ScenariosFor(prototypeId);
  const scenarios = [
    ...baseScenarios,
    ...EXTENDED_SCENARIOS.filter((entry) => entry.prototypeId === prototypeId),
  ];
  if (scenarios.length === 0) {
    throw new Error(`No canonical CP-002 scenarios for ${prototypeId}.`);
  }
  return scenarios;
}

export function allBlrCp002CanonicalScenarios(): readonly BlrCp002ScenarioTemplate[] {
  const prototypeIds: readonly BlrCp002PrototypeId[] = [
    "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT",
    "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
    "BLR-CP002-PROT-SELF-IDENTITY",
  ];
  const scenarios = prototypeIds.flatMap((prototypeId) =>
    cp002CanonicalScenariosFor(prototypeId),
  );
  const ids = scenarios.map((scenario) => scenario.scenarioId);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate CP-002 canonical scenario ID detected.");
  }
  return scenarios;
}
