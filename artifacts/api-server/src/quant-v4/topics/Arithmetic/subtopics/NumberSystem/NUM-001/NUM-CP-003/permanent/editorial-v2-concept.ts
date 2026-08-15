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
  if (fixed !== 0) terms.push(String(fixed));
  if (xCount === 1) terms.push("X");
  else if (xCount > 1) terms.push(`${xCount}X`);
  if (yCount === 1) terms.push("Y");
  else if (yCount > 1) terms.push(`${yCount}Y`);
  return terms.join(" + ") || "0";
}

function requirementForDivisor(divisor: number): string {
  switch (divisor) {
    case 2:
      return `${math(2)} uses the last-digit parity rule`;
    case 3:
      return `${math(3)} uses the digit-sum rule`;
    case 4:
      return `${math(4)} uses the last-two-digit rule`;
    case 5:
      return `${math(5)} uses a final digit of ${math("0")} or ${math("5")}`;
    case 6:
      return `${math(6)} requires both ${math(2)} and ${math(3)}`;
    case 8:
      return `${math(8)} uses the last-three-digit rule`;
    case 9:
      return `${math(9)} uses the digit-sum rule`;
    case 10:
      return `${math(10)} requires final digit ${math("0")}`;
    case 11:
      return `${math(11)} uses the alternating-sum rule`;
    case 12:
      return `${math(12)} requires both ${math(3)} and ${math(4)}`;
    case 15:
      return `${math(15)} requires both ${math(3)} and ${math(5)}`;
    case 18:
      return `${math(18)} requires both ${math(2)} and ${math(9)}`;
    case 24:
      return `${math(24)} requires both ${math(3)} and ${math(8)}`;
    case 25:
      return `${math(25)} uses the last-two-digit endings ${math("00,25,50,75")}`;
    case 36:
      return `${math(36)} requires both ${math(4)} and ${math(9)}`;
    case 45:
      return `${math(45)} requires both ${math(5)} and ${math(9)}`;
    case 72:
      return `${math(72)} requires both ${math(8)} and ${math(9)}`;
    case 99:
      return `${math(99)} requires both ${math(9)} and ${math(11)}`;
    default:
      return `${math(divisor)} needs an exact zero-remainder check`;
  }
}

function focusForTemplate(template: string, divisor: number): string {
  const last = template.at(-1) ?? "";
  const lastTwo = template.slice(-2);
  const lastThree = template.slice(-3);
  switch (divisor) {
    case 2:
      return `for ${math(2)}, only the last digit ${math(last)} matters`;
    case 3:
      return `for ${math(3)}, use digit sum ${math(digitSumExpression(template))}`;
    case 4:
      return `for ${math(4)}, test the last two digits ${math(lastTwo)}`;
    case 5:
      return `for ${math(5)}, the last digit ${math(last)} must be ${math("0")} or ${math("5")}`;
    case 6:
      return `for ${math(6)}, satisfy both ${math(2)} and ${math(3)}: last-digit parity and digit sum`;
    case 8:
      return `for ${math(8)}, test the last three digits ${math(lastThree)}`;
    case 9:
      return `for ${math(9)}, use digit sum ${math(digitSumExpression(template))}`;
    case 10:
      return `for ${math(10)}, the last digit ${math(last)} must be ${math("0")}`;
    case 11:
      return `for ${math(11)}, compare the two alternating digit sums of ${math(template)}`;
    case 12:
      return `for ${math(12)}, satisfy both ${math(3)} (digit sum) and ${math(4)} (last two digits ${math(lastTwo)})`;
    case 15:
      return `for ${math(15)}, satisfy both ${math(3)} (digit sum) and ${math(5)} (last digit)`;
    case 18:
      return `for ${math(18)}, satisfy both ${math(2)} (last digit) and ${math(9)} (digit sum ${math(digitSumExpression(template))})`;
    case 24:
      return `for ${math(24)}, satisfy both ${math(3)} (digit sum) and ${math(8)} (last three digits ${math(lastThree)})`;
    case 25:
      return `for ${math(25)}, the last two digits ${math(lastTwo)} must be ${math("00,25,50,75")}`;
    case 36:
      return `for ${math(36)}, satisfy both ${math(4)} (last two digits ${math(lastTwo)}) and ${math(9)} (digit sum)`;
    case 45:
      return `for ${math(45)}, satisfy both ${math(5)} (last digit) and ${math(9)} (digit sum)`;
    case 72:
      return `for ${math(72)}, satisfy both ${math(8)} (last three digits ${math(lastThree)}) and ${math(9)} (digit sum)`;
    case 99:
      return `for ${math(99)}, satisfy both ${math(9)} (digit sum) and ${math(11)} (alternating sums)`;
    default:
      return `for ${math(divisor)}, verify that the completed number leaves remainder ${math(0)}`;
  }
}

function singleDigitGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT":
      return `determine the unique value of ${math("X")}`;
    case "EXTREMUM_VALID_DIGIT":
      return `find all valid values of ${math("X")} and then choose the required largest or smallest digit`;
    case "VALID_DIGIT_COUNT":
      return `find the complete valid digit set and count its members`;
    case "VALID_DIGIT_SUM":
      return `find every valid digit and add those digits`;
    case "COMPLETE_VALID_DIGIT_SET":
      return `identify the complete set of valid digits, not just one example`;
    case "EXTREMUM_COMPLETED_NUMBER":
      return `find the valid digits, form the completed numbers and then choose the required extremum`;
    default:
      return `resolve the valid values of ${math("X")}`;
  }
}

function orderedPairGoal(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR":
      return `determine the unique ordered pair ${math("(X,Y)")}`;
    case "VALID_ORDERED_PAIR_COUNT":
      return "find every valid ordered pair and count them";
    case "COMPLETE_VALID_ORDERED_PAIR_SET":
      return "identify the complete ordered-pair solution set";
    case "PAIR_SOLUTION_CLASS":
      return "decide whether the conditions give no solution, exactly one solution or multiple solutions";
    default:
      return "resolve the ordered-pair solution set";
  }
}

function directConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): string {
  const requirements = state.divisorOptions
    .map((value) => requirementForDivisor(Number(value)))
    .join("; ");
  const target = state.requestedPolarity === "DIVISIBLE" ? "the divisor" : "the non-divisor";
  return `This question tests selecting ${target} of ${math(formatInteger(state.number))} by matching each option to its correct divisibility test: ${requirements}.`;
}

function singleDigitConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors
    .map((value) => focusForTemplate(state.template, Number(value)))
    .join("; ");
  return `This question tests a missing digit in ${math(state.template)}: ${rules}. The required skill is to ${singleDigitGoal(state)} after applying all conditions together.`;
}

function orderedPairConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  const rules = state.divisors
    .map((value) => focusForTemplate(state.template, Number(value)))
    .join("; ");
  const relation = state.relation?.kind === "DIGIT_SUM"
    ? ` The extra condition ${math(`X + Y = ${state.relation.value}`)} must also hold.`
    : "";
  return `This question tests two missing digits in ${math(state.template)}, where the positions of ${math("X")} and ${math("Y")} matter: ${rules}.${relation} The target is to ${orderedPairGoal(state)}.`;
}

function digitBoundConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIGIT_BOUND_MULTIPLE" }>,
): string {
  const boundary = state.direction === "LEAST" ? state.lowerBoundary : state.upperBoundary;
  const action = state.direction === "LEAST"
    ? "add the complement of the boundary remainder"
    : "subtract the boundary remainder";
  return `This question tests the nearest multiple of ${math(state.divisor)} at the ${state.digits}-digit boundary: start from ${math(formatInteger(boundary))}, find its remainder and ${action}.`;
}

function rangeConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ONE_DIVISOR_RANGE" }>,
): string {
  return `This question tests inclusive counting of multiples of ${math(state.divisor)} from ${math(formatInteger(state.lower))} to ${math(formatInteger(state.upper))}. Use ${math(`\\lfloor U/${state.divisor}\\rfloor-\\lfloor(L-1)/${state.divisor}\\rfloor`)} so endpoint multiples are counted correctly.`;
}

function repeatedConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "IMPLICIT_REPEATED_NUMERAL" }>,
): string {
  const requirements = state.divisorOptions
    .map((value) => requirementForDivisor(Number(value)))
    .join("; ");
  return `This question tests place-value interpretation before divisibility: concatenate block ${math(state.block)} exactly ${state.repeats} times to form one number, then test the options. The relevant checks are ${requirements}.`;
}

function linkedConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "LINKED_ARITHMETIC_DIVISIBILITY" }>,
): string {
  const target = state.direction === "LARGEST" ? "largest" : "smallest";
  return `This question tests linked digit reconstruction: ${math(state.sourcePattern)} plus ${math(formatInteger(state.addend))} must equal ${math(state.resultPattern)}, and the completed result must also be divisible by ${math(state.divisor)}. Then choose the ${target} valid value of ${math("A")}.`;
}

function dataSufficiencyConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DATA_SUFFICIENCY" }>,
): string {
  return `This question tests data sufficiency for the missing digit in ${math(state.template)}, not merely solving for it. Apply each statement separately and ask whether it reduces the possible values of ${math("X")} to exactly one; combine the statements only if needed.`;
}

function claimConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "CLAIM_VALIDATION" }>,
): string {
  const divisors = [...new Set(state.claims.map((claim) => Number(claim.divisor)))];
  const requested = state.requestedPolarity === "CORRECT" ? "correct" : "incorrect";
  return `This question tests whether each stated divisible/not-divisible claim matches the actual remainder. The options involve divisors ${divisors.map((value) => math(value)).join(", ")}; verify each with its own rule, then select the ${requested} claim.`;
}

export function buildNumCp003QuestionSpecificConcept(state: NumCp003RetainedHiddenState): string {
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return directConcept(state);
    case "SINGLE_DIGIT_CANDIDATE_SET":
      return singleDigitConcept(state);
    case "ORDERED_PAIR_CANDIDATE_SET":
      return orderedPairConcept(state);
    case "DIGIT_BOUND_MULTIPLE":
      return digitBoundConcept(state);
    case "ONE_DIVISOR_RANGE":
      return rangeConcept(state);
    case "IMPLICIT_REPEATED_NUMERAL":
      return repeatedConcept(state);
    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return linkedConcept(state);
    case "DATA_SUFFICIENCY":
      return dataSufficiencyConcept(state);
    case "CLAIM_VALIDATION":
      return claimConcept(state);
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}
