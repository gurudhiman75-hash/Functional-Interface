import { fillSingleDigit } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import {
  completeSingleDigitNumber,
  digitSetText,
  difficultyFromState,
  enumerateSingleDigits,
  option,
  randomTemplate,
  reasoningNodes,
  singleDigitDomain,
} from "./runtime-core";
import type {
  NumCp003RawRetainedQuestion,
  NumCp003RetainedOptionAudit,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";

const SINGLE_DIVISORS = [3n, 4n, 6n, 8n, 9n, 11n, 12n, 18n, 24n, 25n, 36n, 45n] as const;
const MULTI_DIVISORS: ReadonlyArray<readonly [bigint, bigint]> = [
  [3n, 4n], [3n, 8n], [4n, 9n], [8n, 9n], [9n, 11n], [4n, 11n],
];

function chooseDivisors(random: DeterministicRandom): bigint[] {
  return random.bool(0.28)
    ? [...random.pick(MULTI_DIVISORS)]
    : [random.pick(SINGLE_DIVISORS)];
}

function divisorText(divisors: readonly bigint[]): string {
  return divisors.length === 1
    ? `divisible by ${divisors[0]}`
    : `divisible by both ${divisors[0]} and ${divisors[1]}`;
}

function addUnique(rows: NumCp003RetainedOptionAudit[], row: NumCp003RetainedOptionAudit): void {
  if (!rows.some((existing) => existing.text === row.text)) rows.push(row);
}

function fillNumericOptions(
  rows: NumCp003RetainedOptionAudit[],
  correct: number,
  diagnostic: (value: number) => string,
): void {
  for (let candidate = 0; rows.length < 4 && candidate <= Math.max(12, correct + 5); candidate += 1) {
    if (candidate === correct) continue;
    addUnique(rows, option(String(candidate), "INCORRECT_PROJECTION", diagnostic(candidate)));
  }
}

function generateState(
  random: DeterministicRandom,
  desired: "UNIQUE" | "MULTIPLE",
): { template: string; divisors: bigint[]; validDigits: number[]; domain: number[] } {
  for (let attempt = 0; attempt < 3_000; attempt += 1) {
    const template = randomTemplate(random, 1);
    const divisors = chooseDivisors(random);
    const validDigits = enumerateSingleDigits(template, divisors);
    const ok = desired === "UNIQUE"
      ? validDigits.length === 1
      : validDigits.length >= 2 && validDigits.length <= 5;
    if (!ok) continue;
    return { template, divisors, validDigits, domain: singleDigitDomain(template) };
  }
  throw new Error(`Unable to construct ${desired} single-digit state`);
}

function invalidDigits(domain: readonly number[], validDigits: readonly number[]): number[] {
  return domain.filter((digit) => !validDigits.includes(digit));
}

function uniqueDigit(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const state = generateState(random, "UNIQUE");
  const answerDigit = state.validDigits[0]!;
  const completed = completeSingleDigitNumber(state.template, answerDigit);
  const wrong = random.shuffle(invalidDigits(state.domain, state.validDigits)).slice(0, 3);
  const rows = [
    option(String(answerDigit), "CORRECT", `${completed} satisfies every displayed divisibility constraint.`),
    ...wrong.map((digit) => option(
      String(digit),
      "NON_ZERO_REMAINDER",
      `Replacing X by ${digit} gives ${fillSingleDigit(state.template, digit)}, which fails at least one divisibility constraint.`,
    )),
  ];
  if (rows.length !== 4) throw new Error("Insufficient unique-digit distractors");
  const constraints = divisorText(state.divisors);
  return {
    difficulty: difficultyFromState(state.template.length + state.divisors.length * 2),
    answerSemantic: "DIGIT",
    stem: random.pick([
      `What digit must replace X in ${state.template} so that the number is ${constraints}?`,
      `Only one digit makes ${state.template} ${constraints}. Find X.`,
      `Determine X if the completed numeral ${state.template} must be ${constraints}.`,
      `Which digit gives a zero remainder for every stated divisor in ${state.template}?`,
    ]),
    answer: String(answerDigit),
    optionAudit: rows,
    hiddenState: {
      kind: "SINGLE_DIGIT_CANDIDATE_SET",
      template: state.template,
      divisors: state.divisors,
      domain: state.domain,
      validDigits: state.validDigits,
      projection: "UNIQUE_VALID_DIGIT",
    },
    explanation: {
      coreConcept: "A missing digit is valid only when the complete numeral satisfies every divisibility constraint.",
      strategy: "Enumerate the admissible digit domain and retain only exact zero-remainder completions.",
      steps: [
        `The admissible domain is ${digitSetText(state.domain)}.`,
        `Exact testing leaves the valid set ${digitSetText(state.validDigits)}.`,
        `The only valid replacement is X = ${answerDigit}, forming ${completed}.`,
      ],
      shortcut: `Apply the relevant divisibility rule${state.divisors.length > 1 ? "s simultaneously" : ""}, then verify the surviving digit by exact division.`,
      verification: `${completed} leaves remainder 0 for ${state.divisors.join(" and ")}.`,
      conclusion: `Therefore, X = ${answerDigit}.`,
      traps: [
        "Do not apply only one part of a composite or multi-divisor condition.",
        "Do not allow zero in the leading position.",
        "Verify the full numeral rather than only a convenient suffix unless the rule permits it.",
      ],
    },
    reasoningNodes: reasoningNodes(
      `${state.template} must be ${constraints}.`,
      "Test every admissible digit against every stated divisor.",
      `The complete valid set is ${digitSetText(state.validDigits)}.`,
      `${completed} satisfies all constraints exactly.`,
      `X = ${answerDigit}.`,
    ),
    fingerprint: `single:unique:${state.template}:${state.divisors.join(",")}:${answerDigit}`,
  };
}

function extremumDigit(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const state = generateState(random, "MULTIPLE");
  const direction = random.pick(["LARGEST", "SMALLEST"] as const);
  const answerDigit = direction === "LARGEST" ? state.validDigits[state.validDigits.length - 1]! : state.validDigits[0]!;
  const opposite = direction === "LARGEST" ? state.validDigits[0]! : state.validDigits[state.validDigits.length - 1]!;
  const rows: NumCp003RetainedOptionAudit[] = [
    option(String(answerDigit), "CORRECT", `${answerDigit} is the ${direction.toLowerCase()} member of ${digitSetText(state.validDigits)}.`),
  ];
  if (opposite !== answerDigit) addUnique(rows, option(
    String(opposite),
    "OPPOSITE_EXTREMUM",
    `${opposite} is valid but is the opposite extremum of the requested set.`,
  ));
  const middle = state.validDigits.filter((digit) => digit !== answerDigit && digit !== opposite);
  if (middle.length > 0) {
    const digit = random.pick(middle);
    addUnique(rows, option(String(digit), "NON_EXTREME_VALID_DIGIT", `${digit} is valid but is not the requested extremum.`));
  }
  const invalid = random.shuffle(invalidDigits(state.domain, state.validDigits));
  for (const digit of invalid) {
    if (rows.length >= 4) break;
    addUnique(rows, option(
      String(digit),
      "INVALID_DIGIT",
      `${fillSingleDigit(state.template, digit)} fails at least one divisibility constraint.`,
    ));
  }
  fillNumericOptions(rows, answerDigit, (value) => `${value} is not the requested extremum of ${digitSetText(state.validDigits)}.`);
  const constraints = divisorText(state.divisors);
  return {
    difficulty: difficultyFromState(state.template.length + state.validDigits.length + state.divisors.length),
    answerSemantic: "DIGIT",
    stem: random.pick([
      `Find the ${direction.toLowerCase()} digit X for which ${state.template} is ${constraints}.`,
      `Among all valid replacements in ${state.template}, what is the ${direction.toLowerCase()} X if the number is ${constraints}?`,
      `The numeral ${state.template} must be ${constraints}. Determine the ${direction.toLowerCase()} possible X.`,
      `Which is the ${direction.toLowerCase()} admissible digit that satisfies every divisor condition in ${state.template}?`,
    ]),
    answer: String(answerDigit),
    optionAudit: rows,
    hiddenState: {
      kind: "SINGLE_DIGIT_CANDIDATE_SET",
      template: state.template,
      divisors: state.divisors,
      domain: state.domain,
      validDigits: state.validDigits,
      projection: "EXTREMUM_VALID_DIGIT",
      extremumDirection: direction,
    },
    explanation: {
      coreConcept: "An extremum question requires the complete valid candidate set before selecting its largest or smallest member.",
      strategy: "Recover every valid digit, then apply the requested extremum direction.",
      steps: [
        `Test the admissible domain ${digitSetText(state.domain)}.`,
        `The complete valid set is ${digitSetText(state.validDigits)}.`,
        `Its ${direction.toLowerCase()} member is ${answerDigit}.`,
      ],
      shortcut: "Use the divisibility rule to obtain the valid residue class, then inspect only admissible digits in that class.",
      verification: `${completeSingleDigitNumber(state.template, answerDigit)} satisfies all stated divisors, and no valid digit lies beyond ${answerDigit} in the requested direction.`,
      conclusion: `Therefore, the ${direction.toLowerCase()} valid digit is ${answerDigit}.`,
      traps: [
        "Do not stop at the first valid digit.",
        "Do not return the opposite extremum.",
        "Do not report the number of valid digits instead of the digit itself.",
      ],
    },
    reasoningNodes: reasoningNodes(
      `${state.template} must be ${constraints}.`,
      "Recover the entire valid candidate set.",
      `The valid set is ${digitSetText(state.validDigits)}.`,
      `${answerDigit} is its ${direction.toLowerCase()} member.`,
      `The answer is ${answerDigit}.`,
    ),
    fingerprint: `single:extremum:${direction}:${state.template}:${state.divisors.join(",")}:${state.validDigits.join(",")}`,
  };
}

function projectedSetQuestion(
  random: DeterministicRandom,
  projection: "COUNT" | "SUM" | "SET" | "COMPLETED_EXTREMUM",
): NumCp003RawRetainedQuestion {
  const state = generateState(random, "MULTIPLE");
  const constraints = divisorText(state.divisors);
  const count = state.validDigits.length;
  const sum = state.validDigits.reduce((total, digit) => total + digit, 0);
  const smallest = state.validDigits[0]!;
  const largest = state.validDigits[state.validDigits.length - 1]!;

  if (projection === "COUNT") {
    const rows: NumCp003RetainedOptionAudit[] = [
      option(String(count), "CORRECT", `${digitSetText(state.validDigits)} contains ${count} digits.`),
    ];
    for (const candidate of [count - 1, count + 1, 10 - count, count + 2]) {
      if (candidate < 0 || candidate === count) continue;
      addUnique(rows, option(String(candidate), "MISCOUNTED_VALID_SET", `${candidate} does not equal the exact valid-set size ${count}.`));
    }
    fillNumericOptions(rows, count, (value) => `${value} is not the cardinality of ${digitSetText(state.validDigits)}.`);
    return {
      difficulty: difficultyFromState(state.template.length + count),
      answerSemantic: "COUNT",
      stem: random.pick([
        `How many digits can replace X in ${state.template} so that the number is ${constraints}?`,
        `For how many admissible values of X is ${state.template} ${constraints}?`,
        `Count every digit X that satisfies all divisor conditions in ${state.template}.`,
        `What is the size of the complete valid-digit set for ${state.template}?`,
      ]),
      answer: String(count),
      optionAudit: rows,
      hiddenState: { kind: "SINGLE_DIGIT_CANDIDATE_SET", template: state.template, divisors: state.divisors, domain: state.domain, validDigits: state.validDigits, projection: "VALID_DIGIT_COUNT" },
      explanation: {
        coreConcept: "A count target requires the complete candidate set, not the first working digit.",
        strategy: "Enumerate all admissible digits and count the exact zero-remainder completions.",
        steps: [`The admissible domain is ${digitSetText(state.domain)}.`, `The valid digits are ${digitSetText(state.validDigits)}.`, `This set contains ${count} digits.`],
        shortcut: "Reduce the condition to a residue requirement, then count only admissible digits in that residue class.",
        verification: `Direct substitution confirms exactly ${count} valid completions.`,
        conclusion: `Therefore, the required count is ${count}.`,
        traps: ["Do not return a digit when the target is a count.", "Do not omit zero when it is allowed.", "Do not count a digit that satisfies only one displayed divisor."],
      },
      reasoningNodes: reasoningNodes(`${state.template} must be ${constraints}.`, "Enumerate the full candidate domain.", `Valid digits: ${digitSetText(state.validDigits)}.`, `The set size is ${count}.`, `${count} digits work.`),
      fingerprint: `single:count:${state.template}:${state.divisors.join(",")}:${state.validDigits.join(",")}`,
    };
  }

  if (projection === "SUM") {
    const rows: NumCp003RetainedOptionAudit[] = [
      option(String(sum), "CORRECT", `${state.validDigits.join(" + ")} = ${sum}.`),
    ];
    addUnique(rows, option(String(count), "REPORTED_COUNT", `${count} is the number of valid digits, not their sum.`));
    addUnique(rows, option(String(largest), "REPORTED_EXTREMUM", `${largest} is the largest valid digit, not the sum.`));
    addUnique(rows, option(String(smallest), "REPORTED_EXTREMUM", `${smallest} is the smallest valid digit, not the sum.`));
    fillNumericOptions(rows, sum, (value) => `${value} does not equal ${state.validDigits.join(" + ")} = ${sum}.`);
    return {
      difficulty: difficultyFromState(state.template.length + count + 1),
      answerSemantic: "DIGIT_SUM",
      stem: random.pick([
        `Find the sum of all digits X that make ${state.template} ${constraints}.`,
        `What is the sum of the complete valid-digit set for ${state.template}?`,
        `Add every admissible value of X for which ${state.template} is ${constraints}.`,
        `The number ${state.template} must satisfy all divisor conditions. What is the sum of all possible X?`,
      ]),
      answer: String(sum),
      optionAudit: rows,
      hiddenState: { kind: "SINGLE_DIGIT_CANDIDATE_SET", template: state.template, divisors: state.divisors, domain: state.domain, validDigits: state.validDigits, projection: "VALID_DIGIT_SUM" },
      explanation: {
        coreConcept: "A sum target requires every valid candidate exactly once.",
        strategy: "Recover the complete valid set and add its members.",
        steps: [`The valid digits are ${digitSetText(state.validDigits)}.`, `Add them: ${state.validDigits.join(" + ")}.`, `The total is ${sum}.`],
        shortcut: "Use the rule-derived residue class to list valid digits without testing unnecessary candidates.",
        verification: `Every listed digit gives remainder 0, and their exact sum is ${sum}.`,
        conclusion: `Therefore, the required sum is ${sum}.`,
        traps: ["Do not report the count.", "Do not report only an extreme digit.", "Do not omit an allowed zero."],
      },
      reasoningNodes: reasoningNodes(`${state.template} must be ${constraints}.`, "Recover the complete valid set before aggregation.", `Valid digits: ${digitSetText(state.validDigits)}.`, `${state.validDigits.join(" + ")} = ${sum}.`, `The sum is ${sum}.`),
      fingerprint: `single:sum:${state.template}:${state.divisors.join(",")}:${state.validDigits.join(",")}:${sum}`,
    };
  }

  if (projection === "SET") {
    const correct = digitSetText(state.validDigits);
    const removed = digitSetText(state.validDigits.slice(0, -1));
    const invalid = invalidDigits(state.domain, state.validDigits)[0] ?? 9;
    const added = digitSetText([...state.validDigits, invalid].sort((a, b) => a - b));
    const partial = digitSetText([state.validDigits[0]!, state.validDigits[state.validDigits.length - 1]!]);
    const rows = [
      option(correct, "CORRECT", `${correct} is exactly the set of all admissible zero-remainder digits.`),
      option(removed, "OMITTED_VALID_DIGIT", `${removed} omits at least one valid digit.`),
      option(added, "INCLUDED_INVALID_DIGIT", `${added} includes ${invalid}, which fails a divisor condition.`),
      option(partial, "REPORTED_ONLY_EXTREMES", `${partial} reports only extremes rather than the complete set.`),
    ];
    if (new Set(rows.map((row) => row.text)).size !== 4) throw new Error("Unable to create four semantic digit-set options");
    return {
      difficulty: difficultyFromState(state.template.length + count + 2),
      answerSemantic: "DIGIT_SET",
      stem: random.pick([
        `Which set contains every digit X that makes ${state.template} ${constraints}?`,
        `Find the complete valid-digit set for X in ${state.template}.`,
        `Which option lists all and only the admissible replacements in ${state.template}?`,
        `Select the exact set of X-values satisfying every divisibility condition in ${state.template}.`,
      ]),
      answer: correct,
      optionAudit: rows,
      hiddenState: { kind: "SINGLE_DIGIT_CANDIDATE_SET", template: state.template, divisors: state.divisors, domain: state.domain, validDigits: state.validDigits, projection: "COMPLETE_VALID_DIGIT_SET" },
      explanation: {
        coreConcept: "A set answer must include every valid digit and no invalid digit.",
        strategy: "Exhaust the admissible domain and compare options by semantic set equality.",
        steps: [`Test ${digitSetText(state.domain)}.`, `The exact valid set is ${correct}.`, "Any option that omits or adds a digit is incorrect."],
        shortcut: "Use the rule-derived residue pattern to list the complete set directly.",
        verification: `Exact substitution confirms ${correct} and rejects every digit outside it.`,
        conclusion: `Therefore, the complete valid set is ${correct}.`,
        traps: ["Do not stop after one valid digit.", "Do not report only the largest and smallest values.", "Set order does not create a different mathematical answer."],
      },
      reasoningNodes: reasoningNodes(`${state.template} must be ${constraints}.`, "Enumerate the full admissible domain.", `The valid set is ${correct}.`, "Every member succeeds and every outside digit fails.", `${correct} is the exact answer.`),
      fingerprint: `single:set:${state.template}:${state.divisors.join(",")}:${state.validDigits.join(",")}`,
    };
  }

  const direction = random.pick(["GREATEST", "SMALLEST"] as const);
  const answerDigit = direction === "GREATEST" ? largest : smallest;
  const oppositeDigit = direction === "GREATEST" ? smallest : largest;
  const answerNumber = completeSingleDigitNumber(state.template, answerDigit);
  const oppositeNumber = completeSingleDigitNumber(state.template, oppositeDigit);
  const rows: NumCp003RetainedOptionAudit[] = [
    option(answerNumber.toString(), "CORRECT", `${answerNumber} is the ${direction.toLowerCase()} valid completed numeral.`),
    option(oppositeNumber.toString(), "OPPOSITE_EXTREMUM", `${oppositeNumber} is valid but is the opposite completed-number extremum.`),
    option(String(answerDigit), "RETURNED_DIGIT_ONLY", `${answerDigit} is the replacement digit, not the completed numeral.`),
  ];
  for (const digit of invalidDigits(state.domain, state.validDigits)) {
    if (rows.length >= 4) break;
    const text = fillSingleDigit(state.template, digit);
    if (text.startsWith("0")) continue;
    addUnique(rows, option(text, "INVALID_COMPLETION", `${text} fails at least one divisor condition.`));
  }
  if (rows.length !== 4) throw new Error("Unable to create completed-number options");
  return {
    difficulty: difficultyFromState(state.template.length + count + 2),
    answerSemantic: "NUMBER",
    stem: random.pick([
      `Form the ${direction.toLowerCase()} number by replacing X in ${state.template} so that it is ${constraints}.`,
      `Which is the ${direction.toLowerCase()} valid completion of ${state.template}?`,
      `Among all divisible completions of ${state.template}, select the ${direction.toLowerCase()} numeral.`,
      `What is the ${direction.toLowerCase()} full number obtainable from ${state.template} under the stated divisibility conditions?`,
    ]),
    answer: answerNumber.toString(),
    optionAudit: rows,
    hiddenState: { kind: "SINGLE_DIGIT_CANDIDATE_SET", template: state.template, divisors: state.divisors, domain: state.domain, validDigits: state.validDigits, projection: "EXTREMUM_COMPLETED_NUMBER", extremumDirection: direction === "GREATEST" ? "GREATEST" : "SMALLEST_NUMBER" },
    explanation: {
      coreConcept: "The target is the complete numeral obtained from an extremum valid digit.",
      strategy: "Find every valid digit, build its completed numeral and compare the numerals.",
      steps: [`The valid digits are ${digitSetText(state.validDigits)}.`, `They form ${state.validDigits.map((digit) => completeSingleDigitNumber(state.template, digit)).join(", ")}.`, `The ${direction.toLowerCase()} completed number is ${answerNumber}.`],
      shortcut: "With one fixed digit position, the requested extremum valid digit also gives the requested extremum completed numeral.",
      verification: `${answerNumber} satisfies all divisors, while every other valid completion is ${direction === "GREATEST" ? "smaller" : "larger"}.`,
      conclusion: `Therefore, the answer is ${answerNumber}.`,
      traps: ["Do not return only the replacement digit.", "Do not choose the opposite valid extremum.", "Do not permit a leading zero."],
    },
    reasoningNodes: reasoningNodes(`${state.template} must be ${constraints}.`, "Build all valid completed numerals.", `Valid completions: ${state.validDigits.map((digit) => completeSingleDigitNumber(state.template, digit)).join(", ")}.`, `${answerNumber} is the requested extremum.`, `The answer is ${answerNumber}.`),
    fingerprint: `single:number-extremum:${direction}:${state.template}:${state.divisors.join(",")}:${answerNumber}`,
  };
}

export function generateSingleDigitAuthority(
  label: NumCp003RetainedTemplateLabel,
  random: DeterministicRandom,
): NumCp003RawRetainedQuestion {
  switch (label) {
    case "NUM-CP003-QLT2-02": return uniqueDigit(random);
    case "NUM-CP003-QLT2-03": return extremumDigit(random);
    case "NUM-CP003-QLT2-04": return projectedSetQuestion(random, "COUNT");
    case "NUM-CP003-QLT2-05": return projectedSetQuestion(random, "SUM");
    case "NUM-CP003-QLT2-06": return projectedSetQuestion(random, "SET");
    case "NUM-CP003-QLT2-07": return projectedSetQuestion(random, "COMPLETED_EXTREMUM");
    default: throw new Error(`Unsupported single-digit template ${label}`);
  }
}
