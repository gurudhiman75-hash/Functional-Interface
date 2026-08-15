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
    case 2: return `${math(2)}→last digit`;
    case 3: return `${math(3)}→digit sum`;
    case 4: return `${math(4)}→last two digits`;
    case 5: return `${math(5)}→last digit ${math("0/5")}`;
    case 6: return `${math(6)}→${math(2)} and ${math(3)}`;
    case 8: return `${math(8)}→last three digits`;
    case 9: return `${math(9)}→digit sum`;
    case 10: return `${math(10)}→last digit ${math(0)}`;
    case 11: return `${math(11)}→alternating sums`;
    case 12: return `${math(12)}→${math(3)} and ${math(4)}`;
    case 15: return `${math(15)}→${math(3)} and ${math(5)}`;
    case 18: return `${math(18)}→${math(2)} and ${math(9)}`;
    case 24: return `${math(24)}→${math(3)} and ${math(8)}`;
    case 25: return `${math(25)}→last two digits`;
    case 36: return `${math(36)}→${math(4)} and ${math(9)}`;
    case 45: return `${math(45)}→${math(5)} and ${math(9)}`;
    case 72: return `${math(72)}→${math(8)} and ${math(9)}`;
    case 99: return `${math(99)}→${math(9)} and ${math(11)}`;
    default: return `${math(divisor)}→exact remainder`;
  }
}

function templateRule(template: string, divisor: number): string {
  const last = template.at(-1) ?? "";
  const lastTwo = template.slice(-2);
  const lastThree = template.slice(-3);
  switch (divisor) {
    case 2: return `${math(2)} uses last digit ${math(last)}`;
    case 3: return `${math(3)} uses digit sum ${math(digitSumExpression(template))}`;
    case 4: return `${math(4)} uses suffix ${math(lastTwo)}`;
    case 5: return `${math(5)} uses last digit ${math(last)}`;
    case 6: return `${math(6)} needs both ${math(2)} and ${math(3)}`;
    case 8: return `${math(8)} uses suffix ${math(lastThree)}`;
    case 9: return `${math(9)} uses digit sum ${math(digitSumExpression(template))}`;
    case 10: return `${math(10)} uses last digit ${math(last)}`;
    case 11: return `${math(11)} uses alternating sums`;
    case 12: return `${math(12)} needs ${math(3)} and ${math(4)}`;
    case 15: return `${math(15)} needs ${math(3)} and ${math(5)}`;
    case 18: return `${math(18)} needs ${math(2)} and ${math(9)}`;
    case 24: return `${math(24)} needs ${math(3)} and ${math(8)}`;
    case 25: return `${math(25)} uses suffix ${math(lastTwo)}`;
    case 36: return `${math(36)} needs ${math(4)} and ${math(9)}`;
    case 45: return `${math(45)} needs ${math(5)} and ${math(9)}`;
    case 72: return `${math(72)} needs ${math(8)} and ${math(9)}`;
    case 99: return `${math(99)} needs ${math(9)} and ${math(11)}`;
    default: return `${math(divisor)} uses an exact remainder check`;
  }
}

function singleGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT": return "the unique missing digit";
    case "EXTREMUM_VALID_DIGIT": return "the required largest/smallest valid digit";
    case "VALID_DIGIT_COUNT": return "the count of all valid missing digits";
    case "VALID_DIGIT_SUM": return "the sum of all valid missing digits";
    case "COMPLETE_VALID_DIGIT_SET": return "the complete valid digit set";
    case "EXTREMUM_COMPLETED_NUMBER": return "the required largest/smallest completed number";
    default: return "the valid missing digit values";
  }
}

function pairGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": return "the unique ordered pair";
    case "VALID_ORDERED_PAIR_COUNT": return "the number of valid ordered pairs";
    case "COMPLETE_VALID_ORDERED_PAIR_SET": return "the complete ordered-pair set";
    case "PAIR_SOLUTION_CLASS": return "whether the system has none, one or multiple ordered-pair solutions";
    default: return "the valid ordered-pair solutions";
  }
}

function directConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): string {
  const target = state.requestedPolarity === "DIVISIBLE" ? "divisor" : "non-divisor";
  const rules = state.divisorOptions.map((value) => compactRule(Number(value))).join(", ");
  return `This question tests ${target} selection for ${math(formatInteger(state.number))}: ${rules}. Each option must pass its own complete divisibility test.`;
}

function singleConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors.map((value) => templateRule(state.template, Number(value))).join("; ");
  return `This question tests ${singleGoal(state)} in ${math(state.template)}: ${rules}. Apply all stated divisibility conditions together.`;
}

function pairConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors.map((value) => templateRule(state.template, Number(value))).join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM" ? `; also ${math(`X+Y=${state.relation.value}`)}` : "";
  return `This question tests ${pairGoal(state)} in ${math(state.template)}: ${rules}${relation}. The positions of ${math("X")} and ${math("Y")} are distinct.`;
}

function boundaryConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIGIT_BOUND_MULTIPLE" }>,
): string {
  const boundary = state.direction === "LEAST" ? state.lowerBoundary : state.upperBoundary;
  const move = state.direction === "LEAST" ? "move upward by the remainder complement" : "move downward by the remainder";
  return `This question tests the ${state.direction.toLowerCase()} ${state.digits}-digit multiple of ${math(state.divisor)}: start at boundary ${math(formatInteger(boundary))} and ${move}.`;
}

function rangeConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ONE_DIVISOR_RANGE" }>,
): string {
  return `This question tests inclusive counting of multiples of ${math(state.divisor)} from ${math(formatInteger(state.lower))} to ${math(formatInteger(state.upper))}; both endpoints must be handled correctly.`;
}

function repeatedConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "IMPLICIT_REPEATED_NUMERAL" }>,
): string {
  return `This question tests repeated-block place value: first form the numeral by writing block ${math(state.block)} exactly ${state.repeats} times, then apply divisibility rules to that number.`;
}

function linkedConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "LINKED_ARITHMETIC_DIVISIBILITY" }>,
): string {
  const target = state.direction === "LARGEST" ? "largest" : "smallest";
  return `This question tests linked digit reconstruction: ${math(state.sourcePattern)} + ${math(formatInteger(state.addend))} must match ${math(state.resultPattern)}, and the result must be divisible by ${math(state.divisor)}; then choose the ${target} ${math("A")}.`;
}

function dsConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DATA_SUFFICIENCY" }>,
): string {
  return `This question tests data sufficiency for the missing digit in ${math(state.template)}: judge each statement separately by whether it determines exactly one value of ${math("X")}, then combine only if needed.`;
}

function claimConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "CLAIM_VALIDATION" }>,
): string {
  const requested = state.requestedPolarity === "CORRECT" ? "correct" : "incorrect";
  return `This question tests claim verification: check whether each stated divisible/not-divisible claim matches the actual divisibility result, then select the ${requested} statement.`;
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
