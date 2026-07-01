import {
  evaluateMoneyPolicy,
  type MoneyPolicyInput,
  type MoneyPolicyResult,
} from "./money-policies";

export const PERCENT_OF_KNOWN_NUMBER_MONEY_REALISM_VERSION =
  "1.0.0" as const;

export class MoneyRealismError extends Error {
  readonly code: string;
  readonly scenario: string;
  readonly policyId: string;

  constructor(policy: MoneyPolicyResult) {
    super(policy.reason ?? "Money scale rejected by realism policy.");
    this.name = "MoneyRealismError";
    this.code = policy.code ?? "MONEY_SCALE_REJECTED";
    this.scenario = policy.normalizedLabel;
    this.policyId = policy.policyId;
  }
}

export function requireRealisticMoneyScale(
  input: MoneyPolicyInput,
): MoneyPolicyResult {
  const policy = evaluateMoneyPolicy(input);
  if (policy.decision === "REJECT") {
    throw new MoneyRealismError(policy);
  }
  return policy;
}

