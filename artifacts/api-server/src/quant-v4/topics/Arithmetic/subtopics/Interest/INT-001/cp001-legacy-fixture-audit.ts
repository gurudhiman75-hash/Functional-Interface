import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";

interface LegacyFixture {
  legacyFamilyId: string;
  disposition: "RETAIN" | "MERGE" | "MISCONCEPTION_ONLY";
  finalQlIds: string[];
  description: string;
  expected: Rational;
  calculate: () => Rational;
}

const rate = (percent: Rational) => divideRational(percent, rational(100));
const interest = (principal: Rational, ratePercent: Rational, time: Rational) =>
  multiplyRational(multiplyRational(principal, rate(ratePercent)), time);
const amount = (principal: Rational, ratePercent: Rational, time: Rational) =>
  addRational(principal, interest(principal, ratePercent, time));

export const INT_CP001_LEGACY_FIXTURES: readonly LegacyFixture[] = [
  {
    legacyFamilyId: "int_si_from_prt",
    disposition: "RETAIN",
    finalQlIds: ["INT-QL-001"],
    description: "Direct simple interest from principal, rate and time.",
    expected: rational(1000),
    calculate: () => interest(rational(5000), rational(10), rational(2)),
  },
  {
    legacyFamilyId: "int_si_amount_from_prt",
    disposition: "RETAIN",
    finalQlIds: ["INT-QL-002"],
    description: "Direct amount under simple interest.",
    expected: rational(6000),
    calculate: () => amount(rational(5000), rational(10), rational(2)),
  },
  {
    legacyFamilyId: "int_si_principal_from_si_rt",
    disposition: "RETAIN",
    finalQlIds: ["INT-QL-003"],
    description: "Principal inverse from simple interest evidence.",
    expected: rational(3000),
    calculate: () => divideRational(rational(720), multiplyRational(rate(rational(8)), rational(3))),
  },
  {
    legacyFamilyId: "int_si_rate_from_si_pt",
    disposition: "RETAIN",
    finalQlIds: ["INT-QL-005"],
    description: "Annual rate inverse from simple interest.",
    expected: rational(10),
    calculate: () => multiplyRational(divideRational(rational(800), multiplyRational(rational(4000), rational(2))), rational(100)),
  },
  {
    legacyFamilyId: "int_si_time_from_si_pr",
    disposition: "RETAIN",
    finalQlIds: ["INT-QL-007"],
    description: "Time inverse from simple interest.",
    expected: rational(3),
    calculate: () => divideRational(rational(1800), multiplyRational(rational(6000), rate(rational(10)))),
  },
  {
    legacyFamilyId: "int_si_sum_doubles",
    disposition: "MERGE",
    finalQlIds: ["INT-QL-011"],
    description: "Doubling is the amount-multiple time inverse with A/P = 2.",
    expected: rational(8),
    calculate: () => divideRational(subtractRational(rational(2), rational(1)), rate(rational(25, 2))),
  },
  {
    legacyFamilyId: "int_si_sum_triples",
    disposition: "MERGE",
    finalQlIds: ["INT-QL-011"],
    description: "Tripling is the amount-multiple time inverse with A/P = 3.",
    expected: rational(20),
    calculate: () => divideRational(subtractRational(rational(3), rational(1)), rate(rational(10))),
  },
  {
    legacyFamilyId: "int_si_amount_ratio_time_gap",
    disposition: "RETAIN",
    finalQlIds: ["INT-QL-017", "INT-QL-021"],
    description: "Two-time amount ratio supports rate or later-time inversion depending the unknown.",
    expected: rational(5),
    calculate: () => {
      const k = rational(5, 4);
      const r = rate(rational(10));
      const t1 = rational(2);
      return divideRational(subtractRational(multiplyRational(k, addRational(rational(1), multiplyRational(r, t1))), rational(1)), r);
    },
  },
  {
    legacyFamilyId: "int_si_temporal_amount_gap",
    disposition: "RETAIN",
    finalQlIds: ["INT-QL-014", "INT-QL-015", "INT-QL-016", "INT-QL-020"],
    description: "Amounts at two times recover annual interest, principal, rate or another amount.",
    expected: rational(300),
    calculate: () => divideRational(subtractRational(rational(4500), rational(3600)), subtractRational(rational(5), rational(2))),
  },
  {
    legacyFamilyId: "int_amount_ratio_find_rate_si",
    disposition: "MERGE",
    finalQlIds: ["INT-QL-010"],
    description: "Amount-to-principal ratio rate inverse.",
    expected: rational(10),
    calculate: () => multiplyRational(divideRational(subtractRational(rational(3, 2), rational(1)), rational(5)), rational(100)),
  },
  {
    legacyFamilyId: "int_amount_ratio_find_time_si",
    disposition: "MERGE",
    finalQlIds: ["INT-QL-011"],
    description: "Amount-to-principal ratio time inverse.",
    expected: rational(5),
    calculate: () => divideRational(subtractRational(rational(7, 5), rational(1)), rate(rational(8))),
  },
  {
    legacyFamilyId: "int_interest_included_excluded_amount",
    disposition: "MISCONCEPTION_ONLY",
    finalQlIds: ["INT-QL-004", "INT-QL-006", "INT-QL-008"],
    description: "Included-versus-excluded amount is retained as amount-evidence recognition and distractor ownership, not a standalone QL.",
    expected: rational(600),
    calculate: () => subtractRational(rational(6600), rational(6000)),
  },
] as const;

export function runIntCp001LegacyFixtureAudit(): {
  ok: boolean;
  checked: number;
  errors: string[];
  dispositions: Record<string, number>;
} {
  const errors: string[] = [];
  const seen = new Set<string>();
  const dispositions: Record<string, number> = {};
  for (const fixture of INT_CP001_LEGACY_FIXTURES) {
    if (seen.has(fixture.legacyFamilyId)) errors.push(`Duplicate legacy fixture: ${fixture.legacyFamilyId}.`);
    seen.add(fixture.legacyFamilyId);
    const actual = fixture.calculate();
    if (!equalsRational(actual, fixture.expected)) {
      errors.push(`${fixture.legacyFamilyId}: ${rationalKey(actual)} !== ${rationalKey(fixture.expected)}.`);
    }
    if (fixture.finalQlIds.length === 0) errors.push(`${fixture.legacyFamilyId} has no final disposition target.`);
    dispositions[fixture.disposition] = (dispositions[fixture.disposition] ?? 0) + 1;
  }
  return { ok: errors.length === 0, checked: INT_CP001_LEGACY_FIXTURES.length, errors, dispositions };
}
