import type { EntityRealismPolicy } from "./entity-policies";
import {
  evaluateScenarioPolicy,
  type ScenarioPolicyInput,
  type ScenarioPolicyResult,
} from "./scenario-policies";

export const PERCENT_OF_KNOWN_NUMBER_SCENARIO_VERSION = "1.0.0" as const;

export class ScenarioRealismError extends Error {
  readonly code: string;
  readonly scenario: string;

  constructor(policy: ScenarioPolicyResult) {
    super(policy.reason ?? "Scenario rejected by realism policy.");
    this.name = "ScenarioRealismError";
    this.code = policy.code ?? "SCENARIO_REJECTED";
    this.scenario = policy.normalizedLabel;
  }
}

export function requireRealisticScenario(
  input: ScenarioPolicyInput,
): ScenarioPolicyResult {
  const policy = evaluateScenarioPolicy(input);
  if (policy.decision === "REJECT") {
    throw new ScenarioRealismError(policy);
  }
  return policy;
}

export function preserveScenarioLabel(
  entityPolicy: EntityRealismPolicy,
  scenarioPolicy: ScenarioPolicyResult,
): EntityRealismPolicy {
  if (
    entityPolicy.entityKind === "ABSTRACT" ||
    !scenarioPolicy.normalizedLabel
  ) {
    return entityPolicy;
  }
  return {
    ...entityPolicy,
    contextLabel: scenarioPolicy.normalizedLabel,
    preserveContext: true,
  };
}

