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

function focus(template: string, divisor: number): string {
  switch (divisor) {
    case 2: return `last digit ${math(template.at(-1) ?? "")} for ${math(2)}`;
    case 3: return `digit sum ${math(digitSum(template))} for ${math(3)}`;
    case 4: return `suffix ${math(template.slice(-2))} for ${math(4)}`;
    case 5: return `last digit ${math(template.at(-1) ?? "")} for ${math(5)}`;
    case 8: return `suffix ${math(template.slice(-3))} for ${math(8)}`;
    case 9: return `digit sum ${math(digitSum(template))} for ${math(9)}`;
    case 10: return `last digit ${math(template.at(-1) ?? "")} for ${math(10)}`;
    case 11: return `alternating sums for ${math(11)}`;
    case 25: return `suffix ${math(template.slice(-2))} for ${math(25)}`;
    default: return `remainder for ${math(divisor)}`;
  }
}

function divisorRule(template: string, divisor: number): string {
  const parts = COMPOSITE_PARTS[divisor];
  if (parts) return `For ${math(divisor)}, use ${focus(template, parts[0])} and ${focus(template, parts[1])}`;
  return `Use ${focus(template, divisor)}`;
}

function target(state: PairState): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": return "the unique ordered pair";
    case "VALID_ORDERED_PAIR_COUNT": return "the number of valid ordered pairs";
    case "COMPLETE_VALID_ORDERED_PAIR_SET": return "all valid ordered pairs";
    case "PAIR_SOLUTION_CLASS": return "whether there are 0, 1 or multiple solutions";
    default: return "the valid ordered pairs";
  }
}

export function buildNumCp003PairConcept(state: PairState): string {
  const rules = state.divisors.map((value) => divisorRule(state.template, Number(value))).join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM" ? `; also ${math(`X+Y=${state.relation.value}`)}` : "";
  return `This question tests ${target(state)} in ${math(state.template)}. ${rules}${relation}. ${math("X,Y")} positions matter.`;
}
