import {
  evaluateCountConstraints,
  type CountConstraintInput,
  type CountConstraintResult,
} from "./count-policies";

export const PERCENT_OF_KNOWN_NUMBER_ENTITY_CONSTRAINT_VERSION =
  "1.0.0" as const;

export class EntityConstraintError extends Error {
  readonly code: string;
  readonly scenario: string;
  readonly policyId: string;

  constructor(policy: CountConstraintResult) {
    super(policy.reason ?? "Entity constraint rejected the scenario.");
    this.name = "EntityConstraintError";
    this.code = policy.code ?? "ENTITY_CONSTRAINT_REJECTED";
    this.scenario = policy.normalizedLabel;
    this.policyId = policy.policyId;
  }
}

export function requireValidEntityConstraints(
  input: CountConstraintInput,
): CountConstraintResult {
  const policy = evaluateCountConstraints(input);
  if (policy.decision === "REJECT") {
    throw new EntityConstraintError(policy);
  }
  return policy;
}

