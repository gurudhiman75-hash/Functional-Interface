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

function digitSum(template: string): string {
  let fixed = 0;
  let x = 0;
  let y = 0;
  for (const character of template) {
    if (character === "X") x += 1;
    else if (character === "Y") y += 1;
    else if (/\d/u.test(character)) fixed += Number(character);
  }
  const terms: string[] = [];
  if (fixed) terms.push(String(fixed));
  if (x === 1) terms.push("X");
  else if (x > 1) terms.push(`${x}X`);
  if (y === 1) terms.push("Y");
  else if (y > 1) terms.push(`${y}Y`);
  return terms.join("+") || "0";
}

function constraint(template: string, divisor: number): string {
  switch (divisor) {
    case 2: return `${math(2)}: ${math(template.at(-1) ?? "")} even`;
    case 3: return `${math(3)}: sum ${math(digitSum(template))} multiple of ${math(3)}`;
    case 4: return `${math(4)}: suffix ${math(template.slice(-2))} divisible by ${math(4)}`;
    case 5: return `${math(5)}: last digit ${math(template.at(-1) ?? "")} is ${math("0/5")}`;
    case 8: return `${math(8)}: suffix ${math(template.slice(-3))} divisible by ${math(8)}`;
    case 9: return `${math(9)}: sum ${math(digitSum(template))} multiple of ${math(9)}`;
    case 10: return `${math(10)}: last digit ${math(template.at(-1) ?? "")} is ${math(0)}`;
    case 11: return `${math(11)}: alternating-sum difference multiple of ${math(11)}`;
    case 25: return `${math(25)}: suffix ${math(template.slice(-2))} is ${math("00/25/50/75")}`;
    default: return `${math(divisor)}: remainder ${math(0)}`;
  }
}

function divisorRule(template: string, divisor: number): string {
  const parts = COMPOSITE_PARTS[divisor];
  if (parts) return `${math(divisor)} needs ${constraint(template, parts[0])}; ${constraint(template, parts[1])}`;
  return constraint(template, divisor);
}

function target(state: PairState): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": return "the unique ordered pair";
    case "VALID_ORDERED_PAIR_COUNT": return "the valid-pair count";
    case "COMPLETE_VALID_ORDERED_PAIR_SET": return "all valid ordered pairs";
    case "PAIR_SOLUTION_CLASS": return "whether there are 0, 1 or multiple solutions";
    default: return "the valid ordered pairs";
  }
}

export function buildNumCp003PairConcept(state: PairState): string {
  const rules = state.divisors.map((value) => divisorRule(state.template, Number(value))).join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM" ? `; ${math(`X+Y=${state.relation.value}`)}` : "";
  const concept = `This question tests ${target(state)} in ${math(state.template)}. ${rules}${relation}. Order matters.`;
  if (concept.length <= 180) return concept;

  // Preserve the exact tested rules while trimming repeated divisor labels for dense composite cases.
  const compact = state.divisors.flatMap((value) => {
    const divisor = Number(value);
    return COMPOSITE_PARTS[divisor] ?? [divisor];
  });
  const unique = [...new Set(compact)];
  const compactRules = unique.map((divisor) => constraint(state.template, divisor)).join("; ");
  return `This question tests ${target(state)} in ${math(state.template)}. ${compactRules}${relation}. Order matters.`;
}
