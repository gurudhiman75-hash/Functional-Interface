import {
  HUNDRED,
  ONE,
  ZERO,
  addRational,
  compareRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./math";
import type {
  Partner,
  PartnerWeight,
  PartnershipState,
  Prt001IndependentVerification,
  Rational,
} from "./types";

type EntitledPartner = Partner & { readonly profitShareMultiplier?: Rational };

function key(value: Rational): string {
  const normalized = rational(value.numerator, value.denominator);
  return `${normalized.numerator}/${normalized.denominator}`;
}

function reconstructWeightsByBoundarySweep(
  state: PartnershipState,
): PartnerWeight[] {
  if (state.partners.length < 2)
    throw new Error("partnership requires at least two partners");
  const boundariesByKey = new Map<string, Rational>();
  boundariesByKey.set(key(ZERO), ZERO);
  boundariesByKey.set(key(state.totalDuration), state.totalDuration);
  for (const partner of state.partners) {
    for (const segment of partner.capitalSegments) {
      boundariesByKey.set(key(segment.start), segment.start);
      boundariesByKey.set(key(segment.end), segment.end);
    }
  }
  const boundaries = [...boundariesByKey.values()].sort(compareRational);
  return state.partners.map((rawPartner) => {
    const partner = rawPartner as EntitledPartner;
    let contributionWeight = ZERO;
    for (let index = 0; index < boundaries.length - 1; index += 1) {
      const start = boundaries[index]!;
      const end = boundaries[index + 1]!;
      const coveringSegments = partner.capitalSegments.filter(
        (segment) =>
          compareRational(segment.start, start) <= 0 &&
          compareRational(segment.end, end) >= 0,
      );
      if (coveringSegments.length > 1) {
        throw new Error(
          `overlapping verifier segments for ${partner.partnerId}`,
        );
      }
      const segment = coveringSegments[0];
      if (!segment) continue;
      if (compareRational(segment.capital, ZERO) <= 0) {
        throw new Error("verifier encountered non-positive capital");
      }
      contributionWeight = addRational(
        contributionWeight,
        multiplyRational(segment.capital, subtractRational(end, start)),
      );
    }
    if (compareRational(contributionWeight, ZERO) <= 0) {
      throw new Error(
        `verifier found no effective contribution for ${partner.partnerId}`,
      );
    }
    const multiplier = partner.profitShareMultiplier ?? ONE;
    if (compareRational(multiplier, ZERO) <= 0) {
      throw new Error("verifier encountered non-positive entitlement multiplier");
    }
    return {
      partnerId: partner.partnerId,
      effectiveCapital: multiplyRational(contributionWeight, multiplier),
    };
  });
}

function reconstructFullHorizonCapital(
  state: PartnershipState,
  partnerId: string,
): Rational {
  const partner = state.partners.find((item) => item.partnerId === partnerId);
  if (!partner) throw new Error("verifier encountered an unknown capital-interest recipient");
  if (partner.capitalSegments.length !== 1) {
    throw new Error(
      "verifier requires one full-horizon capital segment for partner-capital percentage allocations",
    );
  }
  const segment = partner.capitalSegments[0]!;
  if (
    compareRational(segment.start, ZERO) !== 0 ||
    compareRational(segment.end, state.totalDuration) !== 0
  ) {
    throw new Error(
      "verifier found an ambiguous partner-capital percentage horizon",
    );
  }
  return segment.capital;
}

export function verifyPrt001Independently(
  state: PartnershipState,
): Prt001IndependentVerification {
  const weights = reconstructWeightsByBoundarySweep(state);
  let distributablePool = state.grossProfitOrLoss;
  const remuneration: Record<string, Rational> = Object.fromEntries(
    state.partners.map((partner) => [partner.partnerId, ZERO]),
  );
  for (const allocation of [...state.allocations].sort(
    (a, b) => a.sequence - b.sequence,
  )) {
    let amount: Rational;
    if (allocation.basis === "FIXED_AMOUNT") {
      amount = allocation.value;
    } else {
      let basis: Rational;
      if (allocation.basis === "PERCENT_OF_GROSS_PROFIT") {
        basis = state.grossProfitOrLoss;
      } else if (allocation.basis === "PERCENT_OF_POST_DEDUCTION_POOL") {
        basis = distributablePool;
      } else {
        if (!allocation.recipientPartnerId) {
          throw new Error("verifier requires a recipient for partner-capital percentage allocations");
        }
        basis = reconstructFullHorizonCapital(state, allocation.recipientPartnerId);
      }
      amount = multiplyRational(
        basis,
        divideRational(allocation.value, HUNDRED),
      );
    }
    distributablePool = subtractRational(distributablePool, amount);
    if (allocation.recipientPartnerId) {
      const previous = remuneration[allocation.recipientPartnerId];
      if (!previous)
        throw new Error("verifier encountered an unknown recipient");
      remuneration[allocation.recipientPartnerId] = addRational(
        previous,
        amount,
      );
    }
  }

  const totalWeight = weights.reduce(
    (total, item) => addRational(total, item.effectiveCapital),
    ZERO,
  );
  const distributedShares = Object.fromEntries(
    weights.map((item) => [
      item.partnerId,
      divideRational(
        multiplyRational(distributablePool, item.effectiveCapital),
        totalWeight,
      ),
    ]),
  );
  const finalPartnerReceipts = Object.fromEntries(
    Object.entries(distributedShares).map(([partnerId, share]) => [
      partnerId,
      addRational(share, remuneration[partnerId] ?? ZERO),
    ]),
  );
  return {
    supported: true,
    method:
      "Independent boundary-sweep reconstruction with entitlement multipliers, partner-capital interest reconstruction and sequential pool ledger",
    weights,
    distributablePool,
    distributedShares,
    finalPartnerReceipts,
  };
}
