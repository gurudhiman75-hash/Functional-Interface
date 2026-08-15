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
    case 3: return "digit-sum";
    case 4: return "last-two-digit";
    case 5: return "last-digit 0/5";
    case 8: return "last-three-digit";
    case 9: return "digit-sum";
    case 10: return "last-digit 0";
    case 11: return "alternating-sum";
    case 25: return "last-two-digit ending";
    default: return "exact-remainder";
  }
}

function divisorRule(divisor: number): string {
  const parts = COMPOSITE_PARTS[divisor];
  if (parts) return `${math(divisor)}: ${ruleName(parts[0])} and ${ruleName(parts[1])} rules`;
  return `${math(divisor)}: ${ruleName(divisor)} rule`;
}

function target(state: PairState): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": return "the unique ordered pair";
    case "VALID_ORDERED_PAIR_COUNT": return "the number of valid ordered pairs";
    case "COMPLETE_VALID_ORDERED_PAIR_SET": return "all valid ordered pairs";
    case "PAIR_SOLUTION_CLASS": return "whether the ordered-pair system has 0, 1 or multiple solutions";
    default: return "the valid ordered pairs";
  }
}

export function buildNumCp003PairConcept(state: PairState): string {
  const rules = state.divisors.map((value) => divisorRule(Number(value))).join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM"
    ? `; also ${math(`X+Y=${state.relation.value}`)}`
    : "";
  return `This question tests ${target(state)} in ${math(state.template)} using ${rules}${relation}.`;
}
