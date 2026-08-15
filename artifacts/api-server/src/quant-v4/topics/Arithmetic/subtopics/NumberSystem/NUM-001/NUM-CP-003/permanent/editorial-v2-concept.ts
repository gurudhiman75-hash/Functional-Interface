import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";

function math(value: string | number | bigint): string {
  return `\\(${String(value)}\\)`;
}

function formatInteger(value: bigint): string {
  return value.toLocaleString("en-IN");
}

function digitSumExpression(template: string): string {
  let fixed = 0;
  let xCount = 0;
  let yCount = 0;
  for (const character of template) {
    if (character === "X") xCount += 1;
    else if (character === "Y") yCount += 1;
    else if (/\d/u.test(character)) fixed += Number(character);
  }
  const terms: string[] = [];
  if (fixed) terms.push(String(fixed));
  if (xCount === 1) terms.push("X");
  else if (xCount > 1) terms.push(`${xCount}X`);
  if (yCount === 1) terms.push("Y");
  else if (yCount > 1) terms.push(`${yCount}Y`);
  return terms.join(" + ") || "0";
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

function primitiveFocus(template: string, divisor: number): string {
  const last = template.at(-1) ?? "";
  const lastTwo = template.slice(-2);
  const lastThree = template.slice(-3);
  switch (divisor) {
    case 2: return `last digit ${math(last)} for ${math(2)}`;
    case 3: return `digit sum ${math(digitSumExpression(template))} for ${math(3)}`;
    case 4: return `suffix ${math(lastTwo)} for ${math(4)}`;
    case 5: return `last digit ${math(last)} for ${math(5)}`;
    case 8: return `suffix ${math(lastThree)} for ${math(8)}`;
    case 9: return `digit sum ${math(digitSumExpression(template))} for ${math(9)}`;
    case 10: return `last digit ${math(last)} for ${math(10)}`;
    case 11: return `alternating sums for ${math(11)}`;
    case 25: return `suffix ${math(lastTwo)} for ${math(25)}`;
    default: return `exact remainder for ${math(divisor)}`;
  }
}

function templateRule(template: string, divisor: number): string {
  const parts = COMPOSITE_PARTS[divisor];
  if (parts) {
    return `for ${math(divisor)}, check ${primitiveFocus(template, parts[0])} and ${primitiveFocus(template, parts[1])}`;
  }
  return `use ${primitiveFocus(template, divisor)}`;
}

function singleGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT": return "finding the unique missing digit";
    case "EXTREMUM_VALID_DIGIT": return "finding the required extreme valid digit";
    case "VALID_DIGIT_COUNT": return "counting all valid missing digits";
    case "VALID_DIGIT_SUM": return "summing all valid missing digits";
    case "COMPLETE_VALID_DIGIT_SET": return "finding the complete valid digit set";
    case "EXTREMUM_COMPLETED_NUMBER": return "forming valid numbers and choosing the required extreme";
    default: return "finding the valid missing digits";
  }
}

function pairGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": return "finding the unique ordered pair";
    case "VALID_ORDERED_PAIR_COUNT": return "counting valid ordered pairs";
    case "COMPLETE_VALID_ORDERED_PAIR_SET": return "finding all valid ordered pairs";
    case "PAIR_SOLUTION_CLASS": return "deciding whether there are 0, 1 or multiple ordered-pair solutions";
    default: return "finding the ordered-pair solutions";
  }
}

function directConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): string {
  const target = state.requestedPolarity === "DIVISIBLE" ? "divisor" : "non-divisor";
  return `This question tests ${target} selection for ${math(formatInteger(state.number))}: apply the correct divisibility rule to each option, including every factor condition for composite divisors.`;
}

function singleConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors.map((value) => templateRule(state.template, Number(value))).join("; ");
  return `This question tests ${singleGoal(state)} in ${math(state.template)}: ${rules}.`;
}

function pairConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors.map((value) => templateRule(state.template, Number(value))).join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM" ? `; also ${math(`X+Y=${state.relation.value}`)}` : "";
  return `This question tests ${pairGoal(state)} in ${math(state.template)}: ${rules}${relation}; ${math("(X,Y)")} is ordered.`;
}

function boundaryConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIGIT_BOUND_MULTIPLE" }>,
): string {
  const boundary = state.direction === "LEAST" ? state.lowerBoundary : state.upperBoundary;
  const move = state.direction === "LEAST" ? "add the remainder complement" : "subtract the remainder";
  return `This question tests the ${state.direction.toLowerCase()} ${state.digits}-digit multiple of ${math(state.divisor)}: start at ${math(formatInteger(boundary))} and ${move}.`;
}

function rangeConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ONE_DIVISOR_RANGE" }>,
): string {
  return `This question tests inclusive counting of multiples of ${math(state.divisor)} from ${math(formatInteger(state.lower))} to ${math(formatInteger(state.upper))}, with both endpoints handled correctly.`;
}

function repeatedConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "IMPLICIT_REPEATED_NUMERAL" }>,
): string {
  return `This question tests repeated-block place value: write ${math(state.block)} exactly ${state.repeats} times to form one numeral, then apply divisibility rules to that numeral.`;
}

function linkedConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "LINKED_ARITHMETIC_DIVISIBILITY" }>,
): string {
  const target = state.direction === "LARGEST" ? "largest" : "smallest";
  return `This question tests linked digit reconstruction: satisfy ${math(state.sourcePattern)} + ${math(formatInteger(state.addend))} = ${math(state.resultPattern)} and divisibility by ${math(state.divisor)}, then choose the ${target} ${math("A")}.`;
}

function dsConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DATA_SUFFICIENCY" }>,
): string {
  return `This question tests data sufficiency in ${math(state.template)}: each statement is sufficient only if it alone fixes exactly one value of ${math("X")}; combine them only if needed.`;
}

function claimConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "CLAIM_VALIDATION" }>,
): string {
  const requested = state.requestedPolarity === "CORRECT" ? "correct" : "incorrect";
  return `This question tests checking divisibility claims: compare each stated divisible/not-divisible claim with the actual result, then select the ${requested} statement.`;
}

export function buildNumCp003QuestionSpecificConcept(state: NumCp003RetainedHiddenState): string {
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY": return directConcept(state);
    case "SINGLE_DIGIT_CANDIDATE_SET": return singleConcept(state);
    case "ORDERED_PAIR_CANDIDATE_SET": return pairConcept(state);
    case "DIGIT_BOUND_MULTIPLE": return boundaryConcept(state);
    case "ONE_DIVISOR_RANGE": return rangeConcept(state);
    case "IMPLICIT_REPEATED_NUMERAL": return repeatedConcept(state);
    case "LINKED_ARITHMETIC_DIVISIBILITY": return linkedConcept(state);
    case "DATA_SUFFICIENCY": return dsConcept(state);
    case "CLAIM_VALIDATION": return claimConcept(state);
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}
