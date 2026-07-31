import type {
  NumCp003RetainedExplanation,
  NumCp003RetainedHiddenState,
  NumCp003RetainedTemplateLabel,
} from "../NUM-CP-003/retained/runtime-types";
import { formatStandaloneIntegersForEnglishIndia } from "./english-stem-style";

interface DigitAssignment {
  readonly x: number;
  readonly y?: number;
}

const COMPOSITE_DIVISOR_RULES: Readonly<Record<string, readonly bigint[]>> = {
  "6": [2n, 3n],
  "12": [3n, 4n],
  "18": [2n, 9n],
  "24": [3n, 8n],
  "36": [4n, 9n],
  "45": [5n, 9n],
};

function cleanText(text: unknown): string {
  return formatStandaloneIntegersForEnglishIndia(String(text ?? ""))
    .replace(/Compute or infer/gi, "Find")
    .replace(/Exact testing leaves/gi, "Using the divisibility rules, the possible values are")
    .replace(/admissible domain/gi, "possible digits")
    .replace(/admissible digit/gi, "possible digit")
    .replace(/candidate set/gi, "possible values")
    .replace(/cardinality/gi, "number")
    .replace(/remainder status/gi, "remainder")
    .replace(/opposite remainder status/gi, "opposite remainder result")
    .replace(/\bstatus\b/gi, "result")
    .replace(/\benumerate\b/gi, "check")
    .replace(/\benumeration\b/gi, "checking");
}

function displayInteger(value: bigint | number | string): string {
  return formatStandaloneIntegersForEnglishIndia(String(value));
}

function mathInteger(value: bigint | number | string): string {
  return `$${displayInteger(value)}$`;
}

function setText(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function pairText(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

function pairSetText(pairs: ReadonlyArray<readonly [number, number]>): string {
  return `{${pairs.map(pairText).join(", ")}}`;
}

function fillTemplate(template: string, assignment: DigitAssignment): string {
  return template
    .replaceAll("X", String(assignment.x))
    .replaceAll("Y", String(assignment.y ?? 0));
}

function assignmentLabel(assignment: DigitAssignment): string {
  return assignment.y === undefined
    ? `X = ${assignment.x}`
    : `(X, Y) = (${assignment.x}, ${assignment.y})`;
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function primitiveDivisors(divisors: readonly bigint[]): bigint[] {
  const output: bigint[] = [];
  for (const divisor of divisors) {
    const parts = COMPOSITE_DIVISOR_RULES[String(divisor)] ?? [divisor];
    for (const part of parts) {
      if (!output.some((value) => value === part)) output.push(part);
    }
  }
  return output;
}

function compositeRuleIntroductions(divisors: readonly bigint[]): string[] {
  return divisors.flatMap((divisor) => {
    const parts = COMPOSITE_DIVISOR_RULES[String(divisor)];
    if (!parts) return [];
    return [`For divisibility by ${divisor}, check divisibility by ${parts[0]} and ${parts[1]}.`];
  });
}

function digitSumDetails(template: string): {
  readonly expression: string;
  readonly fixed: number;
  readonly xCount: number;
  readonly yCount: number;
} {
  let fixed = 0;
  let xCount = 0;
  let yCount = 0;
  const terms: string[] = [];
  for (const character of template) {
    if (character === "X") {
      xCount += 1;
      terms.push("X");
    } else if (character === "Y") {
      yCount += 1;
      terms.push("Y");
    } else {
      fixed += Number(character);
      terms.push(character);
    }
  }
  return { expression: terms.join(" + "), fixed, xCount, yCount };
}

function simplifiedDigitSum(details: ReturnType<typeof digitSumDetails>): string {
  const terms: string[] = [];
  if (details.fixed !== 0) terms.push(String(details.fixed));
  if (details.xCount === 1) terms.push("X");
  else if (details.xCount > 1) terms.push(`${details.xCount}X`);
  if (details.yCount === 1) terms.push("Y");
  else if (details.yCount > 1) terms.push(`${details.yCount}Y`);
  return terms.length > 0 ? terms.join(" + ") : "0";
}

function digitSumValue(details: ReturnType<typeof digitSumDetails>, assignment: DigitAssignment): number {
  return details.fixed
    + details.xCount * assignment.x
    + details.yCount * (assignment.y ?? 0);
}

function suffixCalculation(
  template: string,
  length: number,
  divisor: bigint,
  assignments: readonly DigitAssignment[],
): string {
  const suffixTemplate = template.slice(-length);
  const samples = uniqueStrings(assignments.map((assignment) => {
    const suffix = fillTemplate(suffixTemplate, assignment);
    const value = BigInt(suffix);
    return `${assignmentLabel(assignment)} gives $${suffix} = ${displayInteger(value)}$ and $${displayInteger(value)} \\div ${divisor} = ${value / divisor}$.`;
  }));
  const label = length === 2 ? "last two digits" : "last three digits";
  return `For divisibility by ${divisor}, use the ${label} ${suffixTemplate}. ${samples.join(" ")}`;
}

function digitSumCalculation(
  template: string,
  divisor: bigint,
  assignments: readonly DigitAssignment[],
): string {
  const details = digitSumDetails(template);
  const simplified = simplifiedDigitSum(details);
  const samples = uniqueStrings(assignments.map((assignment) => {
    const total = digitSumValue(details, assignment);
    return `${assignmentLabel(assignment)} gives $${simplified.replace("X", String(assignment.x)).replace("Y", String(assignment.y ?? 0))} = ${total} = ${divisor} \\times ${total / Number(divisor)}$.`;
  }));
  return `For divisibility by ${divisor}, the digit sum is $${details.expression} = ${simplified}$. ${samples.join(" ")}`;
}

function lastDigitCalculation(
  template: string,
  divisor: 2n | 5n,
  assignments: readonly DigitAssignment[],
): string {
  const lastTemplate = template.at(-1)!;
  const samples = uniqueStrings(assignments.map((assignment) => {
    const lastDigit = Number(fillTemplate(lastTemplate, assignment));
    if (divisor === 2n) {
      return `${assignmentLabel(assignment)} gives last digit ${lastDigit}, which is even.`;
    }
    return `${assignmentLabel(assignment)} gives last digit ${lastDigit}, which is 0 or 5.`;
  }));
  const rule = divisor === 2n
    ? "the last digit must be even"
    : "the last digit must be 0 or 5";
  return `For divisibility by ${divisor}, ${rule}. ${samples.join(" ")}`;
}

function alternatingSumCalculation(
  template: string,
  assignments: readonly DigitAssignment[],
): string {
  const oddTerms = [...template].filter((_character, index) => index % 2 === 0);
  const evenTerms = [...template].filter((_character, index) => index % 2 === 1);
  const samples = uniqueStrings(assignments.map((assignment) => {
    const digits = [...fillTemplate(template, assignment)].map(Number);
    const odd = digits.filter((_digit, index) => index % 2 === 0).reduce((sum, digit) => sum + digit, 0);
    const even = digits.filter((_digit, index) => index % 2 === 1).reduce((sum, digit) => sum + digit, 0);
    const difference = Math.abs(odd - even);
    return `${assignmentLabel(assignment)} gives $|${odd} - ${even}| = ${difference}$, a multiple of 11.`;
  }));
  return `For divisibility by 11, compare alternating digit sums: $(${oddTerms.join(" + ")}) - (${evenTerms.join(" + ")})$. ${samples.join(" ")}`;
}

function divisorCalculation(
  divisor: bigint,
  template: string,
  assignments: readonly DigitAssignment[],
): string {
  if (divisor === 2n || divisor === 5n) {
    return lastDigitCalculation(template, divisor, assignments);
  }
  if (divisor === 3n || divisor === 9n) {
    return digitSumCalculation(template, divisor, assignments);
  }
  if (divisor === 4n || divisor === 25n) {
    return suffixCalculation(template, 2, divisor, assignments);
  }
  if (divisor === 8n) {
    return suffixCalculation(template, 3, divisor, assignments);
  }
  if (divisor === 11n) {
    return alternatingSumCalculation(template, assignments);
  }
  const samples = uniqueStrings(assignments.map((assignment) => {
    const completed = BigInt(fillTemplate(template, assignment));
    return `${assignmentLabel(assignment)} gives ${mathInteger(completed)}, and $${displayInteger(completed)} \\div ${divisor} = ${completed / divisor}$.`;
  }));
  return `Check divisibility by ${divisor} directly. ${samples.join(" ")}`;
}

function exactDivisionText(
  template: string,
  divisors: readonly bigint[],
  assignments: readonly DigitAssignment[],
): string {
  return assignments.map((assignment) => {
    const completed = BigInt(fillTemplate(template, assignment));
    const divisions = divisors.map((divisor) =>
      `$${displayInteger(completed)} \\div ${divisor} = ${completed / divisor}$`).join(" and ");
    return `${assignmentLabel(assignment)} forms ${mathInteger(completed)}; ${divisions}.`;
  }).join(" ");
}

function directDivisibilityExplanation(
  base: NumCp003RetainedExplanation,
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): NumCp003RetainedExplanation {
  const steps = state.divisorOptions.map((divisor) => {
    const quotient = state.number / divisor;
    const remainder = state.number % divisor;
    return remainder === 0n
      ? `${mathInteger(state.number)} $\\div$ ${mathInteger(divisor)} $=$ ${mathInteger(quotient)}, so the division is exact.`
      : `${mathInteger(state.number)} $=$ ${mathInteger(divisor)} $\\times$ ${mathInteger(quotient)} $+$ ${mathInteger(remainder)}, so the remainder is ${remainder}.`;
  });
  const answer = state.divisorOptions.find((divisor) => {
    const divides = state.number % divisor === 0n;
    return state.requestedPolarity === "DIVISIBLE" ? divides : !divides;
  })!;
  return {
    coreConcept: "A number is exactly divisible only when the remainder is 0.",
    strategy: "Check the displayed divisors one by one and read whether the question asks for a divisor or a non-divisor.",
    steps,
    shortcut: cleanText(base.shortcut),
    verification: cleanText(base.verification),
    conclusion: `Therefore, ${answer} is the required ${state.requestedPolarity === "DIVISIBLE" ? "divisor" : "non-divisor"}.`,
    traps: base.traps.map(cleanText),
  };
}

function singleDigitExplanation(
  label: NumCp003RetainedTemplateLabel,
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): NumCp003RetainedExplanation {
  const assignments = state.validDigits.map((x) => ({ x }));
  const steps = [
    ...compositeRuleIntroductions(state.divisors),
    ...primitiveDivisors(state.divisors).map((divisor) =>
      divisorCalculation(divisor, state.template, assignments)),
  ];
  const completed = state.validDigits.map((x) => BigInt(fillTemplate(state.template, { x })));
  const validSet = setText(state.validDigits);
  const qlNumber = Number(label.slice(-2));

  const conceptByQl: Readonly<Record<number, string>> = {
    2: "The missing digit must satisfy every divisibility rule in the question.",
    3: "Find every digit that works before choosing the largest or smallest one.",
    4: "Count all digits that satisfy the rules; do not stop after finding one.",
    5: "First find all valid digits, then add them.",
    6: "The correct set must contain every valid digit and no invalid digit.",
    7: "Build the complete numbers first, then choose the required largest or smallest number.",
  };

  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT":
      steps.push(`After applying all rules, only $X = ${state.validDigits[0]}$ remains. The number formed is ${mathInteger(completed[0]!)}.`);
      break;
    case "EXTREMUM_VALID_DIGIT": {
      const direction = state.extremumDirection === "LARGEST" ? "largest" : "smallest";
      const answer = direction === "largest" ? state.validDigits.at(-1)! : state.validDigits[0]!;
      steps.push(`The valid digits are ${validSet}. The ${direction} one is ${answer}.`);
      break;
    }
    case "VALID_DIGIT_COUNT":
      steps.push(`The valid digits are ${validSet}, so the required count is ${state.validDigits.length}.`);
      break;
    case "VALID_DIGIT_SUM": {
      const total = state.validDigits.reduce((sum, value) => sum + value, 0);
      steps.push(`The valid digits are ${validSet}. Their sum is $${state.validDigits.join(" + ")} = ${total}$.`);
      break;
    }
    case "COMPLETE_VALID_DIGIT_SET":
      steps.push(`The digits that satisfy every rule are exactly ${validSet}.`);
      break;
    case "EXTREMUM_COMPLETED_NUMBER": {
      const direction = state.extremumDirection === "GREATEST" ? "greatest" : "smallest";
      const answer = direction === "greatest" ? completed.at(-1)! : completed[0]!;
      steps.push(`The valid completed numbers are ${completed.map(mathInteger).join(", ")}. The ${direction} one is ${mathInteger(answer)}.`);
      break;
    }
    default:
      steps.push(`The digits that satisfy every rule are ${validSet}.`);
  }

  return {
    coreConcept: conceptByQl[qlNumber] ?? "Use the divisibility rules to find the digits that work.",
    strategy: "Apply the shortest useful rule first, then check every remaining condition.",
    steps,
    shortcut: "Start with a last-digit or suffix rule when one is available, then use the digit-sum or alternating-sum rule.",
    verification: exactDivisionText(state.template, state.divisors, assignments),
    conclusion: cleanText(
      state.projection === "UNIQUE_VALID_DIGIT"
        ? `Therefore, X = ${state.validDigits[0]}.`
        : `Therefore, the required result follows from the valid digits ${validSet}.`,
    ),
    traps: [
      "Check every divisibility condition, not just the first one.",
      "Do not allow 0 in the first position of a number.",
      "Keep all valid digits until the question asks for a count, sum, set or extreme value.",
    ],
  };
}

function orderedPairExplanation(
  label: NumCp003RetainedTemplateLabel,
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): NumCp003RetainedExplanation {
  const assignments = state.validPairs.map(([x, y]) => ({ x, y }));
  const steps: string[] = [];
  if (state.relation?.kind === "DIGIT_SUM") {
    steps.push(`Use the extra condition $X + Y = ${state.relation.value}$ before checking divisibility.`);
  }
  steps.push(...compositeRuleIntroductions(state.divisors));
  steps.push(...primitiveDivisors(state.divisors).map((divisor) =>
    divisorCalculation(divisor, state.template, assignments)));

  const validSet = pairSetText(state.validPairs);
  const completed = state.validPairs.map(([x, y]) => BigInt(fillTemplate(state.template, { x, y })));
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR":
      steps.push(`Only ${pairText(state.validPairs[0]!)} satisfies every condition, forming ${mathInteger(completed[0]!)}.`);
      break;
    case "VALID_ORDERED_PAIR_COUNT":
      steps.push(`The valid ordered pairs are ${validSet}. There are ${state.validPairs.length} pairs.`);
      break;
    case "COMPLETE_VALID_ORDERED_PAIR_SET":
      steps.push(`The complete answer is ${validSet}; each listed pair works and every other pair fails at least one rule.`);
      break;
    default:
      steps.push(`The ordered pairs that satisfy every condition are ${validSet}.`);
  }

  const qlNumber = Number(label.slice(-2));
  const conceptByQl: Readonly<Record<number, string>> = {
    8: "X and Y occupy different positions, so the order of the pair matters.",
    9: "Count each ordered pair once after checking every condition.",
    10: "The correct set must include all valid ordered pairs and no invalid pair.",
  };

  return {
    coreConcept: conceptByQl[qlNumber] ?? "Check the two digit positions in their given order.",
    strategy: "Use any relation between X and Y first, then apply the divisibility rules to the remaining pairs.",
    steps,
    shortcut: "A digit-sum relation or a last-two/last-three-digit rule usually removes most pairs quickly.",
    verification: exactDivisionText(state.template, state.divisors, assignments),
    conclusion: state.projection === "UNIQUE_VALID_ORDERED_PAIR"
      ? `Therefore, $(X, Y) = ${pairText(state.validPairs[0]!)}$.`
      : `Therefore, the required ordered-pair result comes from ${validSet}.`,
    traps: [
      "Do not swap X and Y; their positions are different.",
      "A pair must satisfy every stated condition.",
      "Do not count the same ordered pair twice.",
    ],
  };
}

function genericHumanisedExplanation(base: NumCp003RetainedExplanation): NumCp003RetainedExplanation {
  return {
    coreConcept: cleanText(base.coreConcept),
    strategy: cleanText(base.strategy),
    steps: base.steps.map(cleanText),
    shortcut: cleanText(base.shortcut),
    verification: cleanText(base.verification),
    conclusion: cleanText(base.conclusion),
    traps: base.traps.map(cleanText),
  };
}

export function polishNumCp003Explanation(
  label: NumCp003RetainedTemplateLabel,
  base: NumCp003RetainedExplanation,
  hiddenState: NumCp003RetainedHiddenState,
): NumCp003RetainedExplanation {
  if (hiddenState.kind === "DIRECT_DIVISIBILITY") {
    return directDivisibilityExplanation(base, hiddenState);
  }
  if (hiddenState.kind === "SINGLE_DIGIT_CANDIDATE_SET") {
    return singleDigitExplanation(label, hiddenState);
  }
  if (hiddenState.kind === "ORDERED_PAIR_CANDIDATE_SET" && Number(label.slice(-2)) <= 10) {
    return orderedPairExplanation(label, hiddenState);
  }
  return genericHumanisedExplanation(base);
}
