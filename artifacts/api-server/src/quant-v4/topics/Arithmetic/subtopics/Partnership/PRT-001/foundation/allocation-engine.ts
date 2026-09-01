import {
  HUNDRED,
  ZERO,
  addRational,
  compareRational,
  divideRational,
  multiplyRational,
  subtractRational,
} from "./math";
import type {
  AllocationExecution,
  DistributablePoolResult,
  PartnerWeight,
  PartnershipState,
  PreDistributionAllocation,
  Rational,
} from "./types";

const PARTNER_REMUNERATION_KINDS = new Set([
  "SALARY",
  "COMMISSION",
  "BONUS",
  "INTEREST_ON_CAPITAL",
]);

function validateAllocation(
  allocation: PreDistributionAllocation,
  partnerIds: ReadonlySet<string>,
): void {
  if (!Number.isSafeInteger(allocation.sequence)) {
    throw new Error("allocation sequence must be a safe integer");
  }
  if (compareRational(allocation.value, ZERO) < 0) {
    throw new Error("allocation value must not be negative");
  }
  const isRemuneration = PARTNER_REMUNERATION_KINDS.has(allocation.kind);
  if (isRemuneration && !allocation.recipientPartnerId) {
    throw new Error(`${allocation.kind} requires a recipient partner`);
  }
  if (!isRemuneration && allocation.recipientPartnerId) {
    throw new Error(`${allocation.kind} must not name a recipient partner`);
  }
  if (
    allocation.recipientPartnerId &&
    !partnerIds.has(allocation.recipientPartnerId)
  ) {
    throw new Error(
      `unknown allocation recipient: ${allocation.recipientPartnerId}`,
    );
  }
  if (
    allocation.basis === "PERCENT_OF_PARTNER_CAPITAL" &&
    allocation.kind !== "INTEREST_ON_CAPITAL"
  ) {
    throw new Error(
      "PERCENT_OF_PARTNER_CAPITAL is reserved for interest-on-capital allocations",
    );
  }
  if (
    allocation.basis !== "FIXED_AMOUNT" &&
    compareRational(allocation.value, HUNDRED) > 0
  ) {
    throw new Error("allocation percentage must not exceed 100");
  }
}

function fullHorizonPartnerCapital(
  state: PartnershipState,
  partnerId: string,
): Rational {
  const partner = state.partners.find((item) => item.partnerId === partnerId);
  if (!partner) throw new Error(`unknown capital-interest recipient: ${partnerId}`);
  if (partner.capitalSegments.length !== 1) {
    throw new Error(
      "partner-capital percentage basis requires one unambiguous full-horizon capital segment",
    );
  }
  const segment = partner.capitalSegments[0]!;
  if (
    compareRational(segment.start, ZERO) !== 0 ||
    compareRational(segment.end, state.totalDuration) !== 0
  ) {
    throw new Error(
      "partner-capital percentage basis requires capital invested for the full partnership horizon",
    );
  }
  return segment.capital;
}

function allocationAmount(
  allocation: PreDistributionAllocation,
  state: PartnershipState,
  currentPool: Rational,
): Rational {
  if (allocation.basis === "FIXED_AMOUNT") return allocation.value;
  let basis: Rational;
  switch (allocation.basis) {
    case "PERCENT_OF_GROSS_PROFIT":
      basis = state.grossProfitOrLoss;
      break;
    case "PERCENT_OF_POST_DEDUCTION_POOL":
      basis = currentPool;
      break;
    case "PERCENT_OF_PARTNER_CAPITAL":
      if (!allocation.recipientPartnerId) {
        throw new Error("partner-capital percentage basis requires a recipient partner");
      }
      basis = fullHorizonPartnerCapital(state, allocation.recipientPartnerId);
      break;
    default:
      throw new Error("unsupported allocation basis");
  }
  return multiplyRational(basis, divideRational(allocation.value, HUNDRED));
}

export function computeDistributablePool(
  state: PartnershipState,
): DistributablePoolResult {
  if (
    state.allocations.length > 0 &&
    compareRational(state.grossProfitOrLoss, ZERO) < 0
  ) {
    throw new Error(
      "pre-distribution allocations are not supported for a loss pool",
    );
  }
  const partnerIds = new Set(
    state.partners.map((partner) => partner.partnerId),
  );
  const sequences = state.allocations.map((allocation) => allocation.sequence);
  if (new Set(sequences).size !== sequences.length) {
    throw new Error("allocation sequence values must be unique");
  }

  let currentPool = state.grossProfitOrLoss;
  const executions: AllocationExecution[] = [];
  const ordered = [...state.allocations].sort(
    (a, b) => a.sequence - b.sequence,
  );
  for (const allocation of ordered) {
    validateAllocation(allocation, partnerIds);
    const amount = allocationAmount(allocation, state, currentPool);
    const poolAfter = subtractRational(currentPool, amount);
    if (compareRational(poolAfter, ZERO) < 0) {
      throw new Error("allocations must not exceed gross profit");
    }
    executions.push({
      sequence: allocation.sequence,
      kind: allocation.kind,
      ...(allocation.recipientPartnerId
        ? { recipientPartnerId: allocation.recipientPartnerId }
        : {}),
      poolBefore: currentPool,
      amount,
      poolAfter,
    });
    currentPool = poolAfter;
  }
  return {
    grossProfitOrLoss: state.grossProfitOrLoss,
    distributablePool: currentPool,
    executions,
  };
}

export function allocateByEffectiveCapital(
  distributablePool: Rational,
  weights: readonly PartnerWeight[],
): Record<string, Rational> {
  const totalWeight = weights.reduce(
    (total, item) => addRational(total, item.effectiveCapital),
    ZERO,
  );
  if (compareRational(totalWeight, ZERO) <= 0) {
    throw new Error("total effective-capital weight must be positive");
  }
  return Object.fromEntries(
    weights.map((item) => [
      item.partnerId,
      multiplyRational(
        distributablePool,
        divideRational(item.effectiveCapital, totalWeight),
      ),
    ]),
  );
}

export function addPartnerRemuneration(
  distributedShares: Readonly<Record<string, Rational>>,
  executions: readonly AllocationExecution[],
): Record<string, Rational> {
  const finalReceipts = { ...distributedShares };
  for (const execution of executions) {
    if (!execution.recipientPartnerId) continue;
    const existing = finalReceipts[execution.recipientPartnerId];
    if (!existing)
      throw new Error(
        `missing distributed share for ${execution.recipientPartnerId}`,
      );
    finalReceipts[execution.recipientPartnerId] = addRational(
      existing,
      execution.amount,
    );
  }
  return finalReceipts;
}
