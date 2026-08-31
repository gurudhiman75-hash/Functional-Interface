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
    allocation.basis !== "FIXED_AMOUNT" &&
    compareRational(allocation.value, HUNDRED) > 0
  ) {
    throw new Error("allocation percentage must not exceed 100");
  }
}

function allocationAmount(
  allocation: PreDistributionAllocation,
  grossProfit: Rational,
  currentPool: Rational,
): Rational {
  if (allocation.basis === "FIXED_AMOUNT") return allocation.value;
  const basis =
    allocation.basis === "PERCENT_OF_GROSS_PROFIT" ? grossProfit : currentPool;
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
    const amount = allocationAmount(
      allocation,
      state.grossProfitOrLoss,
      currentPool,
    );
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
