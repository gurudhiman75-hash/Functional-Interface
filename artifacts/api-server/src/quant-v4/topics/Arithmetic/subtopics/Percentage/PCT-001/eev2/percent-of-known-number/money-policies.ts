import { normalizeContextLabel } from "./context-labels";

export interface MoneyScalePolicy {
  policyId: string;
  labels: readonly string[];
  minimumKnownAmount: number;
  minimumImpliedWhole: number;
}

export interface MoneyPolicyInput {
  contextLabel: string;
  knownRate: number;
  knownAmount: number;
  targetRate: number;
  targetAmount: number;
}

export interface MoneyPolicyResult {
  decision: "ACCEPT" | "REJECT";
  policyId: string;
  normalizedLabel: string;
  knownAmount: number;
  impliedWhole: number;
  targetAmount: number;
  code?: string;
  reason?: string;
}

export const MONEY_SCALE_POLICIES: readonly MoneyScalePolicy[] = [
  {
    policyId: "MONTHLY_SALARY",
    labels: ["monthly salary"],
    minimumKnownAmount: 500,
    minimumImpliedWhole: 5_000,
  },
  {
    policyId: "ANNUAL_INCOME",
    labels: ["annual income"],
    minimumKnownAmount: 1_000,
    minimumImpliedWhole: 10_000,
  },
  {
    policyId: "ANNUAL_PROFIT",
    labels: ["annual profit"],
    minimumKnownAmount: 100,
    minimumImpliedWhole: 1_000,
  },
  {
    policyId: "RECURRING_INCOME",
    labels: ["salary", "income", "profit", "revenue"],
    minimumKnownAmount: 10,
    minimumImpliedWhole: 50,
  },
  {
    policyId: "PERSONAL_MONEY",
    labels: ["savings", "expenses"],
    minimumKnownAmount: 0.5,
    minimumImpliedWhole: 1,
  },
  {
    policyId: "INCENTIVE",
    labels: ["commission", "bonus"],
    minimumKnownAmount: 10,
    minimumImpliedWhole: 50,
  },
] as const;

function policyFor(label: string): MoneyScalePolicy {
  const exact = MONEY_SCALE_POLICIES.find((policy) =>
    policy.labels.includes(label),
  );
  if (exact) return exact;
  return {
    policyId: "GENERIC_MONEY",
    labels: [label],
    minimumKnownAmount: 0.01,
    minimumImpliedWhole: 0.01,
  };
}

export function evaluateMoneyPolicy(
  input: MoneyPolicyInput,
): MoneyPolicyResult {
  const normalizedLabel = normalizeContextLabel(input.contextLabel);
  const policy = policyFor(normalizedLabel);
  const impliedWhole =
    input.knownAmount * (100 / input.knownRate);

  if (
    input.knownAmount < policy.minimumKnownAmount ||
    impliedWhole < policy.minimumImpliedWhole
  ) {
    return {
      decision: "REJECT",
      policyId: policy.policyId,
      normalizedLabel,
      knownAmount: input.knownAmount,
      impliedWhole,
      targetAmount: input.targetAmount,
      code: "UNREALISTIC_MONEY_SCALE",
      reason:
        `${normalizedLabel} uses an implausibly small amount for an exam context.`,
    };
  }

  return {
    decision: "ACCEPT",
    policyId: policy.policyId,
    normalizedLabel,
    knownAmount: input.knownAmount,
    impliedWhole,
    targetAmount: input.targetAmount,
  };
}

