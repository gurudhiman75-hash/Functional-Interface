import {
  ONE,
  ZERO,
  addRational,
  compareRational,
  multiplyRational,
  subtractRational,
} from "./math";
import type {
  CapitalSegment,
  CapitalTimeline,
  Partner,
  PartnershipState,
  Rational,
} from "./types";

type EntitledPartner = Partner & { readonly profitShareMultiplier?: Rational };

function validateSegment(
  segment: CapitalSegment,
  totalDuration?: Rational,
): void {
  if (compareRational(segment.start, ZERO) < 0) {
    throw new Error("capital segment start must not be negative");
  }
  if (compareRational(segment.end, segment.start) <= 0) {
    throw new Error("capital segment end must be after its start");
  }
  if (compareRational(segment.capital, ZERO) <= 0) {
    throw new Error("capital must remain positive while a partner is active");
  }
  if (totalDuration && compareRational(segment.end, totalDuration) > 0) {
    throw new Error("capital segment extends beyond total duration");
  }
}

export function sumCapitalTimeSegments(
  segments: readonly CapitalSegment[],
  totalDuration?: Rational,
): Rational {
  if (segments.length === 0)
    throw new Error("partner requires at least one capital segment");
  const ordered = [...segments].sort((a, b) =>
    compareRational(a.start, b.start),
  );
  let weight = ZERO;
  for (let index = 0; index < ordered.length; index += 1) {
    const segment = ordered[index]!;
    validateSegment(segment, totalDuration);
    const previous = ordered[index - 1];
    if (previous && compareRational(segment.start, previous.end) < 0) {
      throw new Error("capital segments for a partner must not overlap");
    }
    weight = addRational(
      weight,
      multiplyRational(
        segment.capital,
        subtractRational(segment.end, segment.start),
      ),
    );
  }
  return weight;
}

function validatePartners(partners: readonly Partner[]): void {
  if (partners.length < 2)
    throw new Error("partnership requires at least two partners");
  const ids = partners.map((partner) => partner.partnerId.trim());
  if (ids.some((partnerId) => partnerId.length === 0)) {
    throw new Error("partnerId must not be empty");
  }
  if (new Set(ids).size !== ids.length)
    throw new Error("partnerId values must be unique");
  for (const partner of partners as readonly EntitledPartner[]) {
    const multiplier = partner.profitShareMultiplier ?? ONE;
    if (compareRational(multiplier, ZERO) <= 0) {
      throw new Error("profit-share entitlement multiplier must be positive");
    }
  }
}

export function buildCapitalTimeline(state: PartnershipState): CapitalTimeline {
  if (compareRational(state.totalDuration, ZERO) <= 0) {
    throw new Error("total duration must be positive");
  }
  validatePartners(state.partners);
  return {
    totalDuration: state.totalDuration,
    weights: state.partners.map((rawPartner) => {
      const partner = rawPartner as EntitledPartner;
      const contributionWeight = sumCapitalTimeSegments(
        partner.capitalSegments,
        state.totalDuration,
      );
      return {
        partnerId: partner.partnerId,
        effectiveCapital: multiplyRational(
          contributionWeight,
          partner.profitShareMultiplier ?? ONE,
        ),
      };
    }),
  };
}

export function intervalForPartnerJoiningAfter(
  totalDuration: Rational,
  elapsedBeforeJoin: Rational,
): Pick<CapitalSegment, "start" | "end"> {
  if (
    compareRational(elapsedBeforeJoin, ZERO) < 0 ||
    compareRational(elapsedBeforeJoin, totalDuration) >= 0
  ) {
    throw new Error("join time must fall within the partnership duration");
  }
  return { start: elapsedBeforeJoin, end: totalDuration };
}

export function intervalForLastDuration(
  totalDuration: Rational,
  activeDuration: Rational,
): Pick<CapitalSegment, "start" | "end"> {
  if (
    compareRational(activeDuration, ZERO) <= 0 ||
    compareRational(activeDuration, totalDuration) > 0
  ) {
    throw new Error(
      "active duration must be positive and within total duration",
    );
  }
  return {
    start: subtractRational(totalDuration, activeDuration),
    end: totalDuration,
  };
}

export function intervalForPartnerLeavingAfter(
  totalDuration: Rational,
  elapsedBeforeLeave: Rational,
): Pick<CapitalSegment, "start" | "end"> {
  if (
    compareRational(elapsedBeforeLeave, ZERO) <= 0 ||
    compareRational(elapsedBeforeLeave, totalDuration) > 0
  ) {
    throw new Error("leave time must be positive and within total duration");
  }
  return { start: ZERO, end: elapsedBeforeLeave };
}
