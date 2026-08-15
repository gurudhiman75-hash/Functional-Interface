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

function compactRule(divisor: number): string {
  switch (divisor) {
    case 2: return `${math(2)}:last digit`;
    case 3: return `${math(3)}:digit sum`;
    case 4: return `${math(4)}:last 2 digits`;
    case 5: return `${math(5)}:last digit`;
    case 6: return `${math(6)}:${math("2+3")}`;
    case 8: return `${math(8)}:last 3 digits`;
    case 9: return `${math(9)}:digit sum`;
    case 10: return `${math(10)}:last digit`;
    case 11: return `${math(11)}:alternating sums`;
    case 12: return `${math(12)}:${math("3+4")}`;
    case 15: return `${math(15)}:${math("3+5")}`;
    case 18: return `${math(18)}:${math("2+9")}`;
    case 24: return `${math(24)}:${math("3+8")}`;
    case 25: return `${math(25)}:last 2 digits`;
    case 36: return `${math(36)}:${math("4+9")}`;
    case 45: return `${math(45)}:${math("5+9")}`;
    case 72: return `${math(72)}:${math("8+9")}`;
    case 99: return `${math(99)}:${math("9+11")}`;
    default: return `${math(divisor)}:remainder`;
  }
}

function templateRule(template: string, divisor: number): string {
  const last = template.at(-1) ?? "";
  const lastTwo = template.slice(-2);
  const lastThree = template.slice(-3);
  switch (divisor) {
    case 2: return `${math(2)}→last digit ${math(last)}`;
    case 3: return `${math(3)}→sum ${math(digitSumExpression(template))}`;
    case 4: return `${math(4)}→suffix ${math(lastTwo)}`;
    case 5: return `${math(5)}→last digit ${math(last)}`;
    case 6: return `${math(6)}→${math("2+3")}`;
    case 8: return `${math(8)}→suffix ${math(lastThree)}`;
    case 9: return `${math(9)}→sum ${math(digitSumExpression(template))}`;
    case 10: return `${math(10)}→last digit ${math(last)}`;
    case 11: return `${math(11)}→alternating sums`;
    case 12: return `${math(12)}→${math("3+4")}`;
    case 15: return `${math(15)}→${math("3+5")}`;
    case 18: return `${math(18)}→${math("2+9")}`;
    case 24: return `${math(24)}→${math("3+8")}`;
    case 25: return `${math(25)}→suffix ${math(lastTwo)}`;
    case 36: return `${math(36)}→${math("4+9")}`;
    case 45: return `${math(45)}→${math("5+9")}`;
    case 72: return `${math(72)}→${math("8+9")}`;
    case 99: return `${math(99)}→${math("9+11")}`;
    default: return `${math(divisor)}→remainder`;
  }
}

function singleGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT": return "the unique missing digit";
    case "EXTREMUM_VALID_DIGIT": return "the extreme valid digit";
    case "VALID_DIGIT_COUNT": return "counting all valid digits";
    case "VALID_DIGIT_SUM": return "summing all valid digits";
    case "COMPLETE_VALID_DIGIT_SET": return "the complete valid digit set";
    case "EXTREMUM_COMPLETED_NUMBER": return "the extreme completed number";
    default: return "the valid missing digits";
  }
}

function pairGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": return "the unique ordered pair";
    case "VALID_ORDERED_PAIR_COUNT": return "counting valid ordered pairs";
    case "COMPLETE_VALID_ORDERED_PAIR_SET": return "the complete ordered-pair set";
    case "PAIR_SOLUTION_CLASS": return "classifying the number of ordered-pair solutions";
    default: return "the ordered-pair solutions";
  }
}

function directConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): string {
  const target = state.requestedPolarity === "DIVISIBLE" ? "divisor" : "non-divisor";
  const rules = state.divisorOptions.map((value) => compactRule(Number(value))).join(", ");
  return `This question tests ${target} selection for ${math(formatInteger(state.number))}: ${rules}. Composite options must pass every component rule.`;
}

function singleConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors.map((value) => templateRule(state.template, Number(value))).join("; ");
  return `This question tests ${singleGoal(state)} in ${math(state.template)}: ${rules}. Apply all conditions together.`;
}

function pairConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors.map((value) => templateRule(state.template, Number(value))).join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM" ? `; ${math(`X+Y=${state.relation.value}`)}` : "";
  return `This question tests ${pairGoal(state)} in ${math(state.template)}: ${rules}${relation}. ${math("(X,Y)")} is ordered.`;
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
  return `This question tests repeated-block place value: write ${math(state.block)} exactly ${state.repeats} times to form one numeral, then test that numeral for divisibility.`;
}

function linkedConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "LINKED_ARITHMETIC_DIVISIBILITY" }>,
): string {
  const target = state.direction === "LARGEST" ? "largest" : "smallest";
  return `This question tests linked digits: ${math(state.sourcePattern)} + ${math(formatInteger(state.addend))} = ${math(state.resultPattern)}, and the result must be divisible by ${math(state.divisor)}; then choose the ${target} ${math("A")}.`;
}

function dsConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DATA_SUFFICIENCY" }>,
): string {
  return `This question tests data sufficiency in ${math(state.template)}: a statement is sufficient only if it alone fixes one value of ${math("X")}; combine statements only if required.`;
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
