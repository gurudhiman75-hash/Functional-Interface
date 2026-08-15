import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";

type PairState = Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>;

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

const COMPOSITE_PARTS: Readonly<Record<number, readonly [number, number]>> = Object.freeze({
  6: [2, 3],
  12: [3, 4],
  15: [3, 5],
  18: [2, 9],
  24: [3, 8],
  36: [4, 9],
  45: [5, 9],
  72: [8, 9],
  99: [9, 11],
});

function ruleName(divisor: number): string {
  switch (divisor) {
    case 2: return "last-digit parity";
    case 3: return "digit sum";
    case 4: return "last two digits";
    case 5: return "last digit 0/5";
    case 8: return "last three digits";
    case 9: return "digit sum";
    case 10: return "last digit 0";
    case 11: return "alternating sum";
    case 25: return "last-two-digit ending";
    default: return "remainder";
  }
}

function divisorRule(divisor: number): string {
  const parts = COMPOSITE_PARTS[divisor];
  if (parts) return `${math(divisor)} needs ${ruleName(parts[0])} and ${ruleName(parts[1])}`;
  return `${math(divisor)} uses ${ruleName(divisor)}`;
}

function target(state: PairState): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": return "finding the unique ordered pair";
    case "VALID_ORDERED_PAIR_COUNT": return "counting valid ordered pairs";
    case "COMPLETE_VALID_ORDERED_PAIR_SET": return "finding all valid ordered pairs";
    case "PAIR_SOLUTION_CLASS": return "deciding whether there are 0, 1 or multiple ordered pairs";
    default: return "finding the valid ordered pairs";
  }
}

export function buildNumCp003PairConcept(state: PairState): string {
  const rules = state.divisors.map((value) => divisorRule(Number(value))).join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM"
    ? `; ${math(`X+Y=${state.relation.value}`)}`
    : "";
  return `This question tests ${target(state)} in ${math(state.template)}: ${rules}${relation}.`;
}
