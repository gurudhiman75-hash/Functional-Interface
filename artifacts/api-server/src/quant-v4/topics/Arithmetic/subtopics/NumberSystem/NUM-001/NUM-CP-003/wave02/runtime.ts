import {
  fillSingleDigit,
  fillTwoDigits,
  numeralToBigInt,
  powerOfTen,
  positiveMod,
  validSingleDigits,
  validTwoDigitPairs,
} from "../../foundation/divisibility";
import { createRandom, type DeterministicRandom } from "../../foundation/prng";
import {
  NUM_CP003_WAVE02_IDS,
  type NumCp003Wave02Id,
  type NumCp003Wave02Question,
  type NumDifficulty,
  type NumReasoningNode,
  type Wave02AnswerSemantic,
  type Wave02Explanation,
  type Wave02HiddenState,
  type Wave02MisconceptionId,
  type Wave02OptionAudit,
} from "./types";

interface Raw {
  hiddenState: Wave02HiddenState;
  difficulty: NumDifficulty;
  answerSemantic: Wave02AnswerSemantic;
  stem: string;
  answer: string;
  options: Wave02OptionAudit[];
  explanation: Wave02Explanation;
  nodes: NumReasoningNode[];
  fingerprint: string;
}

const SINGLE_DIVISORS = [3n, 4n, 6n, 8n, 9n, 11n, 12n, 18n, 24n, 25n, 36n, 45n] as const;
const PAIR_DIVISORS: ReadonlyArray<readonly [bigint, bigint]> = [
  [8n, 9n], [8n, 11n], [9n, 11n], [11n, 12n], [11n, 18n], [12n, 25n], [16n, 9n], [25n, 11n], [8n, 13n],
];
const POWER_DIVISORS = [3n, 4n, 5n, 7n, 8n, 9n, 11n, 13n, 15n, 16n, 17n, 25n] as const;

function audit(text: string, misconceptionId: Wave02MisconceptionId, diagnostic: string): Wave02OptionAudit {
  return { text, misconceptionId, diagnostic };
}

function shuffle(random: DeterministicRandom, candidates: readonly Wave02OptionAudit[]): { rows: Wave02OptionAudit[]; correctIndex: number } {
  const unique = new Map<string, Wave02OptionAudit>();
  for (const candidate of candidates) if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);
  if (unique.size !== 4) throw new Error(`Expected four unique options, got ${unique.size}`);
  const rows = random.shuffle([...unique.values()]);
  const correctIndex = rows.findIndex((row) => row.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("Correct option missing");
  return { rows, correctIndex };
}

function digits(random: DeterministicRandom, length: number): string[] {
  return Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
}

function setText(values: readonly number[]): string {
  return `{${[...values].sort((a, b) => a - b).join(", ")}}`;
}

function pairText(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

function nodes(given: string, rule: string, derivation: string, verification: string, conclusion: string): NumReasoningNode[] {
  return [
    { id: "given", kind: "GIVEN", text: given, dependsOn: [] },
    { id: "rule", kind: "RULE", text: rule, dependsOn: ["given"] },
    { id: "derive", kind: "DERIVATION", text: derivation, dependsOn: ["rule"] },
    { id: "verify", kind: "VERIFICATION", text: verification, dependsOn: ["derive"] },
    { id: "conclusion", kind: "CONCLUSION", text: conclusion, dependsOn: ["verify"] },
  ];
}

function allDigitSet(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 900; attempt += 1) {
    const length = random.int(4, 7);
    const parts = digits(random, length);
    parts[random.int(1, length - 1)] = "X";
    const template = parts.join("");
    const divisor = random.pick([3n, 6n, 9n, 11n] as const);
    const validDigits = validSingleDigits(template, divisor);
    if (validDigits.length < 3 || validDigits.length > 5) continue;
    const answer = setText(validDigits);
    const omitted = setText(validDigits.slice(0, -1));
    const invalidDigit = Array.from({ length: 10 }, (_unused, digit) => digit).find((digit) => !validDigits.includes(digit));
    if (invalidDigit === undefined) continue;
    const included = setText([...validDigits, invalidDigit]);
    const firstOnly = setText([validDigits[0]!]);
    return {
      hiddenState: { kind: "DIGIT_SET", template, divisor, validDigits, leading: false },
      difficulty: "Medium",
      answerSemantic: "DIGIT_SET",
      stem: random.pick([
        `Which set contains all digits that can replace X in ${template} so that the number is divisible by ${divisor}?`,
        `For ${template} to be a multiple of ${divisor}, what is the complete set of possible digits X?`,
        `Which is the complete valid-digit set for X if ${template} must be divisible by ${divisor}?`,
      ]),
      answer,
      options: [
        audit(answer, "CORRECT", `Exhaustive substitution gives exactly ${answer}.`),
        audit(omitted, "OMITTED_VALID_DIGIT", `${omitted} omits at least one digit that also gives remainder 0.`),
        audit(included, "INCLUDED_INVALID_DIGIT", `${included} includes ${invalidDigit}, which gives a non-zero remainder.`),
        audit(firstOnly, "SELECTED_FIRST_VALID_DIGIT_ONLY", `${firstOnly} stops after the first success instead of listing all valid digits.`),
      ],
      explanation: {
        coreConcept: "A set-valued question requires every admissible digit and no invalid digit.",
        strategy: `Substitute X = 0 through 9 and retain every completion divisible by ${divisor}.`,
        steps: [
          `Test the ten possible digits in ${template}.`,
          `The successful digits are ${answer}.`,
          `No digit outside ${answer} leaves remainder 0.`,
        ],
        shortcut: `Use the divisibility rule for ${divisor} to identify the required residue class of X within 0 to 9.`,
        verification: `Direct exact division of all ten completions reproduces ${answer}.`,
        conclusion: `Therefore, the complete valid set is ${answer}.`,
        traps: ["Do not stop after the first valid digit.", "Do not include a digit that satisfies only part of a composite rule.", "Set order does not change membership, but the set must be complete."],
      },
      nodes: nodes(`${template} must be divisible by ${divisor}.`, "Enumerate the entire digit domain.", `Valid set ${answer}.`, "All ten digits were checked exactly.", `Answer ${answer}.`),
      fingerprint: `set:${template}:${divisor}:${validDigits.join("")}`,
    };
  }
  throw new Error("Could not build all-digit-set state");
}

function leadingDigit(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const length = random.int(4, 7);
    const parts = digits(random, length);
    parts[0] = "X";
    const template = parts.join("");
    const divisor = random.pick(SINGLE_DIVISORS);
    const validDigits = validSingleDigits(template, divisor).filter((digit) => digit !== 0);
    if (validDigits.length !== 1) continue;
    const answerDigit = validDigits[0]!;
    const wrongNonZero = random.shuffle(Array.from({ length: 9 }, (_unused, index) => index + 1).filter((digit) => digit !== answerDigit)).slice(0, 2);
    const optionRows = [
      audit(String(answerDigit), "CORRECT", `${fillSingleDigit(template, answerDigit)} is divisible by ${divisor}.`),
      audit("0", "LEADING_ZERO_INCLUDED", `X = 0 would not produce a ${length}-digit number.`),
      ...wrongNonZero.map((digit) => {
        const candidate = BigInt(fillSingleDigit(template, digit));
        return audit(String(digit), "NON_ZERO_REMAINDER", `${candidate} leaves remainder ${candidate % divisor} on division by ${divisor}.`);
      }),
    ];
    return {
      hiddenState: { kind: "LEADING_DIGIT", template, divisor, validDigits, leading: true },
      difficulty: "Easy",
      answerSemantic: "DIGIT",
      stem: `The ${length}-digit number ${template} is divisible by ${divisor}. What is the leading digit X?`,
      answer: String(answerDigit),
      options: optionRows,
      explanation: {
        coreConcept: "A leading missing digit can take values 1 to 9 only.",
        strategy: `Test the admissible leading digits and enforce divisibility by ${divisor}.`,
        steps: [`Exclude X = 0 because the numeral must keep ${length} digits.`, `Test X = 1 through 9.`, `Only X = ${answerDigit} gives remainder 0.`],
        shortcut: `Apply the divisibility rule after restricting the domain to leading digits 1–9.`,
        verification: `Complete enumeration over 1–9 leaves the singleton set {${answerDigit}}.`,
        conclusion: `Therefore, X = ${answerDigit}.`,
        traps: ["Zero cannot be used as the first digit of an n-digit number.", "Do not test only the last digit.", "A composite divisor requires every component rule."],
      },
      nodes: nodes(`${template} is an ${length}-digit multiple of ${divisor}.`, "Leading digit domain is 1–9.", `Only ${answerDigit} works.`, "All nine admissible digits were checked.", `X = ${answerDigit}.`),
      fingerprint: `leading:${template}:${divisor}:${answerDigit}`,
    };
  }
  throw new Error("Could not build leading-digit state");
}

function twoDigitsNoSum(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const length = random.int(5, 7);
    const parts = digits(random, length);
    const xIndex = random.int(1, length - 2);
    const yIndex = random.int(xIndex + 1, length - 1);
    parts[xIndex] = "X";
    parts[yIndex] = "Y";
    const template = parts.join("");
    const divisors = random.pick(PAIR_DIVISORS);
    const validPairs = validTwoDigitPairs(template, divisors);
    if (validPairs.length !== 1) continue;
    const answerPair = validPairs[0]!;
    if (answerPair[0] === answerPair[1]) continue;
    const allPairs: Array<[number, number]> = [];
    for (let x = 0; x <= 9; x += 1) for (let y = 0; y <= 9; y += 1) allPairs.push([x, y]);
    const firstOnly = allPairs.find(([x, y]) => {
      const value = numeralToBigInt(fillTwoDigits(template, x, y));
      return value % divisors[0] === 0n && value % divisors[1] !== 0n;
    });
    const secondOnly = allPairs.find(([x, y]) => {
      const value = numeralToBigInt(fillTwoDigits(template, x, y));
      return value % divisors[0] !== 0n && value % divisors[1] === 0n;
    });
    if (!firstOnly || !secondOnly) continue;
    const swapped: [number, number] = [answerPair[1], answerPair[0]];
    const rows: Wave02OptionAudit[] = [
      audit(pairText(answerPair), "CORRECT", `${fillTwoDigits(template, ...answerPair)} is divisible by both ${divisors[0]} and ${divisors[1]}.`),
      audit(pairText(swapped), "SWAPPED_DIGIT_ORDER", `Swapping the positions forms ${fillTwoDigits(template, ...swapped)}, not the valid numeral.`),
      audit(pairText(firstOnly), "PASSED_FIRST_RULE_ONLY", `${fillTwoDigits(template, ...firstOnly)} passes ${divisors[0]} but fails ${divisors[1]}.`),
      audit(pairText(secondOnly), "PASSED_SECOND_RULE_ONLY", `${fillTwoDigits(template, ...secondOnly)} passes ${divisors[1]} but fails ${divisors[0]}.`),
    ];
    if (new Set(rows.map((row) => row.text)).size !== 4) continue;
    return {
      hiddenState: { kind: "TWO_DIGITS_NO_SUM", template, divisors: [divisors[0], divisors[1]], validPairs },
      difficulty: "Hard",
      answerSemantic: "ORDERED_DIGIT_PAIR",
      stem: `In ${template}, which ordered pair (X, Y) makes the number divisible by both ${divisors[0]} and ${divisors[1]}?`,
      answer: pairText(answerPair),
      options: rows,
      explanation: {
        coreConcept: "Both unknown positions must satisfy both divisibility rules simultaneously.",
        strategy: "Use the cheaper rule to reduce the 100 ordered pairs, then apply the second rule.",
        steps: [`Enumerate ordered pairs (X, Y) from 0 to 9.`, `Reject each pair that fails either divisor.`, `Only ${pairText(answerPair)} survives both checks.`],
        shortcut: `Apply divisibility by ${divisors[0]} first, then test the survivors for ${divisors[1]}.`,
        verification: `A complete 10 × 10 search yields exactly one pair: ${pairText(answerPair)}.`,
        conclusion: `Therefore, (X, Y) = ${pairText(answerPair)}.`,
        traps: ["The pair is ordered.", "Passing one rule is insufficient.", "Do not assume an unstated digit-sum relation."],
      },
      nodes: nodes(`${template} must satisfy two divisors.`, "Intersect both valid-pair sets.", `Unique intersection ${pairText(answerPair)}.`, "All 100 ordered pairs were checked.", `Answer ${pairText(answerPair)}.`),
      fingerprint: `pair-no-sum:${template}:${divisors.join(",")}:${pairText(answerPair)}`,
    };
  }
  throw new Error("Could not build two-digit no-sum state");
}

function missingDigitInSum(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 1500; attempt += 1) {
    const left = BigInt(random.int(10_000, 900_000));
    const right = BigInt(random.int(10_000, 900_000));
    const actualSum = left + right;
    const sumText = actualSum.toString();
    const index = random.int(1, sumText.length - 1);
    const resultTemplate = `${sumText.slice(0, index)}X${sumText.slice(index + 1)}`;
    const divisorChoices = SINGLE_DIVISORS.filter((divisor) => actualSum % divisor === 0n);
    if (divisorChoices.length === 0) continue;
    const divisor = random.pick(divisorChoices);
    const validDigits = validSingleDigits(resultTemplate, divisor);
    const actualDigit = Number(sumText[index]);
    if (validDigits.length !== 1 || validDigits[0] !== actualDigit) continue;
    const arithmeticWrong = Number((actualDigit + random.int(1, 8)) % 10);
    const other = random.shuffle(Array.from({ length: 10 }, (_unused, digit) => digit).filter((digit) => digit !== actualDigit && digit !== arithmeticWrong)).slice(0, 2);
    return {
      hiddenState: { kind: "MISSING_DIGIT_IN_SUM", left, right, resultTemplate, divisor, validDigits, actualSum },
      difficulty: "Medium",
      answerSemantic: "DIGIT",
      stem: `${left} + ${right} = ${resultTemplate}. The result is divisible by ${divisor}. What is X?`,
      answer: String(actualDigit),
      options: [
        audit(String(actualDigit), "CORRECT", `Direct addition gives ${actualSum}, so X = ${actualDigit}.`),
        audit(String(arithmeticWrong), "ARITHMETIC_RESULT_ERROR", `This digit does not match the exact sum ${actualSum}.`),
        ...other.map((digit) => {
          const candidate = BigInt(fillSingleDigit(resultTemplate, digit));
          return audit(String(digit), "NON_ZERO_REMAINDER", `${candidate} leaves remainder ${candidate % divisor} on division by ${divisor}.`);
        }),
      ],
      explanation: {
        coreConcept: "The missing digit must agree with both the arithmetic result and the divisibility condition.",
        strategy: "Compute the sum exactly, then use divisibility as an independent confirmation.",
        steps: [`${left} + ${right} = ${actualSum}.`, `The hidden position in ${resultTemplate} is ${actualDigit}.`, `${actualSum} is exactly divisible by ${divisor}.`],
        shortcut: "Use column addition near the missing place, then verify the complete numeral by the stated rule.",
        verification: `The completed result ${actualSum} has remainder 0 on division by ${divisor}.`,
        conclusion: `Therefore, X = ${actualDigit}.`,
        traps: ["Do not use divisibility while ignoring the stated addition.", "Carry into the hidden place must be included.", "A plausible digit still fails if the full result has a remainder."],
      },
      nodes: nodes(`Add ${left} and ${right}.`, "The result and divisibility must agree.", `Exact sum ${actualSum}.`, `${actualSum} mod ${divisor} = 0.`, `X = ${actualDigit}.`),
      fingerprint: `sum-digit:${left}:${right}:${resultTemplate}:${divisor}:${actualDigit}`,
    };
  }
  throw new Error("Could not build arithmetic-result digit state");
}

function repunit(length: number): bigint {
  return BigInt("1".repeat(length));
}

function leastRepunitLength(divisor: bigint, max = 18): number | null {
  let residue = 0n;
  for (let length = 1; length <= max; length += 1) {
    residue = (residue * 10n + 1n) % divisor;
    if (residue === 0n) return length;
  }
  return null;
}

function leastRepunit(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const divisor = BigInt(random.pick([3, 7, 9, 11, 13, 27, 33, 37, 41] as const));
    const answerLength = leastRepunitLength(divisor, 18);
    if (answerLength === null || answerLength < 2 || answerLength > 12) continue;
    const previous = Math.max(1, answerLength - 1);
    const next = answerLength + 1;
    const baseOnly = 1;
    const candidates = [...new Set([answerLength, previous, next, baseOnly, answerLength + 2])].slice(0, 4);
    if (!candidates.includes(answerLength) || candidates.length !== 4) continue;
    const options = candidates.map((length) => {
      if (length === answerLength) return audit(String(length), "CORRECT", `${repunit(length)} is divisible by ${divisor}, and no shorter repunit is.`);
      if (length === previous) return audit(String(length), "USED_PREVIOUS_LENGTH", `${repunit(length)} leaves remainder ${repunit(length) % divisor}.`);
      if (length === next || length > answerLength) return audit(String(length), "USED_NEXT_LENGTH", `This length is not least because length ${answerLength} already works.`);
      return audit(String(length), "TESTED_ONLY_THE_BASE", `The single digit 1 is not divisible by ${divisor}.`);
    });
    return {
      hiddenState: { kind: "LEAST_REPUNIT_LENGTH", divisor, answerLength, maximumLength: 18 },
      difficulty: "Hard",
      answerSemantic: "LENGTH",
      stem: `What is the least number of repeated 1s needed to form a number divisible by ${divisor}?`,
      answer: String(answerLength),
      options,
      explanation: {
        coreConcept: "Successive repunits follow a remainder recurrence, so the first zero residue gives the least length.",
        strategy: `Track the remainder after appending one more 1 modulo ${divisor}.`,
        steps: [`Start with remainder of 1 modulo ${divisor}.`, `Update by r → (10r + 1) mod ${divisor}.`, `The first zero residue occurs at length ${answerLength}.`],
        shortcut: "Track only remainders; there is no need to divide the full growing number each time.",
        verification: `${repunit(answerLength)} is divisible by ${divisor}, while every shorter repunit has a non-zero remainder.`,
        conclusion: `Therefore, the least length is ${answerLength}.`,
        traps: ["A later working length is not the least.", "Testing only the digit 1 ignores concatenation.", "Append a digit by multiplying the previous number by 10 first."],
      },
      nodes: nodes(`Find the least repunit divisible by ${divisor}.`, "Use the remainder recurrence.", `First zero residue at ${answerLength}.`, "All shorter lengths were checked.", `Answer ${answerLength}.`),
      fingerprint: `repunit:${divisor}:${answerLength}`,
    };
  }
  throw new Error("Could not build repunit state");
}

function powerExpression(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const base = BigInt(random.int(2, 25));
    const exponent = random.int(3, 9);
    const subtractBase = random.int(0, 1) === 1;
    const value = base ** BigInt(exponent) - (subtractBase ? base : 1n);
    const trueDivisors = POWER_DIVISORS.filter((divisor) => value % divisor === 0n);
    const falseDivisors = POWER_DIVISORS.filter((divisor) => value % divisor !== 0n);
    if (trueDivisors.length === 0 || falseDivisors.length < 3) continue;
    const correctDivisor = random.pick(trueDivisors);
    const wrong = random.shuffle(falseDivisors).slice(0, 3);
    const expression = `${base}^${exponent} - ${subtractBase ? base : 1}`;
    return {
      hiddenState: { kind: "POWER_EXPRESSION", base, exponent, subtractBase, value, divisorOptions: [correctDivisor, ...wrong], correctDivisor },
      difficulty: "Hard",
      answerSemantic: "DIVISOR",
      stem: `Which option divides ${expression} exactly?`,
      answer: correctDivisor.toString(),
      options: [
        audit(correctDivisor.toString(), "CORRECT", `${value} ÷ ${correctDivisor} is an integer.`),
        ...wrong.map((divisor) => audit(divisor.toString(), "NON_ZERO_REMAINDER", `${value} leaves remainder ${value % divisor} on division by ${divisor}.`)),
      ],
      explanation: {
        coreConcept: "Power expressions can be tested by modular exponentiation without expanding every intermediate value.",
        strategy: "Reduce the base modulo each option and compute the power residue.",
        steps: [`Evaluate the expression exactly as ${value}.`, `${value} mod ${correctDivisor} = 0.`, `Each other displayed divisor gives a non-zero remainder.`],
        shortcut: "Use repeated squaring modulo each candidate divisor.",
        verification: `Direct BigInt evaluation confirms ${value} is exactly divisible by ${correctDivisor}.`,
        conclusion: `Therefore, ${correctDivisor} is the required divisor.`,
        traps: ["Do not use only the unit digit for an arbitrary divisor.", "Apply the subtraction after exponentiation.", "A factor of the base need not divide the whole expression."],
      },
      nodes: nodes(`Expression ${expression}.`, "Use modular exponentiation.", `Exact value ${value}.`, `Remainder 0 only for ${correctDivisor} among the options.`, `Answer ${correctDivisor}.`),
      fingerprint: `power:${base}:${exponent}:${subtractBase}:${correctDivisor}:${wrong.join(",")}`,
    };
  }
  throw new Error("Could not build power-expression state");
}

function countMultiples(lower: bigint, upper: bigint, divisor: bigint): bigint {
  return upper / divisor - (lower - 1n) / divisor;
}

function countMultiplesQuestion(random: DeterministicRandom): Raw {
  const lower = BigInt(random.int(1, 600));
  const upper = lower + BigInt(random.int(120, 1500));
  const divisor = BigInt(random.int(3, 47));
  const answer = countMultiples(lower, upper, divisor);
  const widthDivision = (upper - lower + 1n) / divisor;
  const candidates = [...new Set([answer, answer - 1n, answer + 1n, widthDivision, answer + 2n].map(String))].filter((value) => BigInt(value) >= 0n).slice(0, 4);
  if (!candidates.includes(answer.toString()) || candidates.length !== 4) return countMultiplesQuestion(random);
  const options = candidates.map((value) => {
    const numeric = BigInt(value);
    if (numeric === answer) return audit(value, "CORRECT", `⌊${upper}/${divisor}⌋ - ⌊${lower - 1n}/${divisor}⌋ = ${answer}.`);
    if (numeric === answer - 1n || numeric === answer + 1n) return audit(value, "ENDPOINT_OFF_BY_ONE", `This differs from the inclusive count ${answer} by one endpoint.`);
    return audit(value, "USED_RANGE_WIDTH_DIVISION", `Dividing the interval width alone ignores where the multiples fall relative to the endpoints.`);
  });
  return {
    hiddenState: { kind: "COUNT_MULTIPLES", lower, upper, divisor, answer },
    difficulty: "Medium",
    answerSemantic: "COUNT",
    stem: `How many integers from ${lower} to ${upper}, both inclusive, are divisible by ${divisor}?`,
    answer: answer.toString(),
    options,
    explanation: {
      coreConcept: "Count multiples up to the upper bound and subtract those below the lower bound.",
      strategy: `Use floor(${upper}/${divisor}) - floor((${lower}-1)/${divisor}).`,
      steps: [`Multiples up to ${upper}: ${upper / divisor}.`, `Multiples below ${lower}: ${(lower - 1n) / divisor}.`, `Required count = ${answer}.`],
      shortcut: "Use the inclusive floor-count formula instead of listing every multiple.",
      verification: `The first and last admissible multiples produce exactly ${answer} terms in the arithmetic progression.`,
      conclusion: `Therefore, ${answer} integers satisfy the condition.`,
      traps: ["Subtract multiples below L, not below or equal to L.", "The interval is inclusive.", "Dividing only the interval width can miss an endpoint shift."],
    },
    nodes: nodes(`Interval [${lower}, ${upper}], divisor ${divisor}.`, "Use cumulative multiple counts.", `${upper / divisor} - ${(lower - 1n) / divisor} = ${answer}.`, "Arithmetic-progression count agrees.", `Answer ${answer}.`),
    fingerprint: `count:${lower}:${upper}:${divisor}:${answer}`,
  };
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

function lcm(a: bigint, b: bigint): bigint {
  return a / gcd(a, b) * b;
}

function countOneNotAnotherQuestion(random: DeterministicRandom): Raw {
  const lower = BigInt(random.int(1, 500));
  const upper = lower + BigInt(random.int(300, 1800));
  const firstDivisor = BigInt(random.int(3, 18));
  let excludedDivisor = BigInt(random.int(4, 25));
  while (excludedDivisor === firstDivisor) excludedDivisor = BigInt(random.int(4, 25));
  const firstCount = countMultiples(lower, upper, firstDivisor);
  const overlapDivisor = lcm(firstDivisor, excludedDivisor);
  const overlap = countMultiples(lower, upper, overlapDivisor);
  const answer = firstCount - overlap;
  const excludedCount = countMultiples(lower, upper, excludedDivisor);
  const candidates = [...new Set([answer, firstCount, firstCount - excludedCount, answer - 1n, answer + 1n].map(String))]
    .filter((value) => BigInt(value) >= 0n).slice(0, 4);
  if (!candidates.includes(answer.toString()) || candidates.length !== 4) return countOneNotAnotherQuestion(random);
  const options = candidates.map((value) => {
    const numeric = BigInt(value);
    if (numeric === answer) return audit(value, "CORRECT", `${firstCount} multiples of ${firstDivisor} minus ${overlap} common multiples gives ${answer}.`);
    if (numeric === firstCount) return audit(value, "INCLUDED_COMMON_MULTIPLES", `This counts all multiples of ${firstDivisor}, including ${overlap} also divisible by ${excludedDivisor}.`);
    if (numeric === firstCount - excludedCount) return audit(value, "SUBTRACTED_WRONG_OVERLAP", `This subtracts every multiple of ${excludedDivisor}, not only common multiples.`);
    return audit(value, "ENDPOINT_OFF_BY_ONE", `The inclusive exact count is ${answer}.`);
  });
  return {
    hiddenState: { kind: "COUNT_ONE_NOT_ANOTHER", lower, upper, firstDivisor, excludedDivisor, answer },
    difficulty: "Hard",
    answerSemantic: "COUNT",
    stem: `How many integers from ${lower} to ${upper}, inclusive, are divisible by ${firstDivisor} but not by ${excludedDivisor}?`,
    answer: answer.toString(),
    options,
    explanation: {
      coreConcept: "Start with multiples of the required divisor and remove only the common multiples.",
      strategy: `Count multiples of ${firstDivisor}, then subtract multiples of lcm(${firstDivisor}, ${excludedDivisor}) = ${overlapDivisor}.`,
      steps: [`Required-divisor count = ${firstCount}.`, `Common-multiple count = ${overlap}.`, `Answer = ${firstCount} - ${overlap} = ${answer}.`],
      shortcut: "For A but not B, subtract multiples of lcm(A, B), not all multiples of B.",
      verification: `Direct bounded enumeration gives ${answer} integers.`,
      conclusion: `Therefore, the required count is ${answer}.`,
      traps: ["Do not include common multiples.", "Do not subtract every multiple of the excluded divisor.", "Keep interval endpoints inclusive."],
    },
    nodes: nodes(`Count multiples of ${firstDivisor} but not ${excludedDivisor}.`, "Remove the lcm overlap.", `${firstCount} - ${overlap} = ${answer}.`, "Direct enumeration agrees.", `Answer ${answer}.`),
    fingerprint: `one-not:${lower}:${upper}:${firstDivisor}:${excludedDivisor}:${answer}`,
  };
}

function greatestNDigit(random: DeterministicRandom): Raw {
  const digitCount = random.int(3, 6);
  const divisor = BigInt(random.int(7, 97));
  const upperBound = powerOfTen(digitCount) - 1n;
  const answer = upperBound - positiveMod(upperBound, divisor);
  const previous = answer - divisor;
  const next = answer + divisor;
  const lowerBoundary = powerOfTen(digitCount - 1);
  const optionRows = [
    audit(answer.toString(), "CORRECT", `${answer} is divisible by ${divisor}, and the next multiple ${next} exceeds ${upperBound}.`),
    audit(previous.toString(), "USED_PREVIOUS_MULTIPLE", `${previous} is divisible but smaller than the valid maximum ${answer}.`),
    audit(next.toString(), "USED_NEXT_MULTIPLE", `${next} is divisible but has ${digitCount + 1} digits or exceeds the upper boundary ${upperBound}.`),
    audit(lowerBoundary.toString(), "USED_LOWER_DIGIT_BOUNDARY", `${lowerBoundary} is the least ${digitCount}-digit boundary, not the greatest multiple.`),
  ];
  if (new Set(optionRows.map((row) => row.text)).size !== 4) return greatestNDigit(random);
  return {
    hiddenState: { kind: "GREATEST_N_DIGIT_MULTIPLE", digits: digitCount, divisor, upperBound, answer },
    difficulty: "Medium",
    answerSemantic: "NUMBER",
    stem: `What is the greatest ${digitCount}-digit number exactly divisible by ${divisor}?`,
    answer: answer.toString(),
    options: optionRows,
    explanation: {
      coreConcept: `The greatest ${digitCount}-digit integer is ${upperBound}; move down only to the nearest multiple of ${divisor}.`,
      strategy: `Subtract the remainder of ${upperBound} ÷ ${divisor}.`,
      steps: [`Upper boundary = ${upperBound}.`, `Remainder = ${upperBound % divisor}.`, `Greatest multiple = ${upperBound} - ${upperBound % divisor} = ${answer}.`],
      shortcut: `Use ${upperBound} - (${upperBound} mod ${divisor}).`,
      verification: `${answer} is divisible by ${divisor}, while the next multiple ${next} is outside the allowed range.`,
      conclusion: `Therefore, the greatest required number is ${answer}.`,
      traps: ["The previous multiple is valid but not greatest.", "The next multiple may exceed the digit limit.", "Start from the upper boundary, not the lower one."],
    },
    nodes: nodes(`Upper ${digitCount}-digit boundary ${upperBound}.`, "Subtract the remainder.", `${upperBound} - ${upperBound % divisor} = ${answer}.`, `Next multiple ${next} is out of range.`, `Answer ${answer}.`),
    fingerprint: `greatest:${digitCount}:${divisor}:${answer}`,
  };
}

function rawFor(id: NumCp003Wave02Id, random: DeterministicRandom): Raw {
  switch (id) {
    case "NUM-CP003-W2-PROT-ALL-MISSING-DIGITS-SET": return allDigitSet(random);
    case "NUM-CP003-W2-PROT-LEADING-MISSING-DIGIT": return leadingDigit(random);
    case "NUM-CP003-W2-PROT-TWO-DIGITS-NO-SUM": return twoDigitsNoSum(random);
    case "NUM-CP003-W2-PROT-MISSING-DIGIT-IN-SUM": return missingDigitInSum(random);
    case "NUM-CP003-W2-PROT-LEAST-REPUNIT-LENGTH": return leastRepunit(random);
    case "NUM-CP003-W2-PROT-POWER-EXPRESSION-DIVISIBILITY": return powerExpression(random);
    case "NUM-CP003-W2-PROT-COUNT-MULTIPLES-IN-RANGE": return countMultiplesQuestion(random);
    case "NUM-CP003-W2-PROT-COUNT-ONE-NOT-ANOTHER": return countOneNotAnotherQuestion(random);
    case "NUM-CP003-W2-PROT-GREATEST-N-DIGIT-MULTIPLE": return greatestNDigit(random);
  }
}

function verify(state: Wave02HiddenState): string {
  switch (state.kind) {
    case "DIGIT_SET": return setText(validSingleDigits(state.template, state.divisor));
    case "LEADING_DIGIT": {
      const values = validSingleDigits(state.template, state.divisor).filter((digit) => digit !== 0);
      if (values.length !== 1) throw new Error(`Expected one leading digit, found ${values}`);
      return String(values[0]);
    }
    case "TWO_DIGITS_NO_SUM": {
      const values = validTwoDigitPairs(state.template, state.divisors);
      if (values.length !== 1) throw new Error(`Expected one pair, found ${values.map(pairText)}`);
      return pairText(values[0]!);
    }
    case "MISSING_DIGIT_IN_SUM": {
      if (state.left + state.right !== state.actualSum) throw new Error("Sum reconstruction failed");
      const sumText = state.actualSum.toString();
      for (let digit = 0; digit <= 9; digit += 1) if (fillSingleDigit(state.resultTemplate, digit) === sumText) return String(digit);
      throw new Error("Hidden sum digit not found");
    }
    case "LEAST_REPUNIT_LENGTH": {
      const length = leastRepunitLength(state.divisor, state.maximumLength);
      if (length === null) throw new Error("No bounded repunit length");
      return String(length);
    }
    case "POWER_EXPRESSION": {
      const matches = state.divisorOptions.filter((divisor) => state.value % divisor === 0n);
      if (matches.length !== 1) throw new Error(`Expected one divisor, found ${matches}`);
      return matches[0]!.toString();
    }
    case "COUNT_MULTIPLES": {
      let count = 0n;
      for (let value = state.lower; value <= state.upper; value += 1n) if (value % state.divisor === 0n) count += 1n;
      return count.toString();
    }
    case "COUNT_ONE_NOT_ANOTHER": {
      let count = 0n;
      for (let value = state.lower; value <= state.upper; value += 1n) {
        if (value % state.firstDivisor === 0n && value % state.excludedDivisor !== 0n) count += 1n;
      }
      return count.toString();
    }
    case "GREATEST_N_DIGIT_MULTIPLE": {
      let value = state.upperBound;
      while (value % state.divisor !== 0n) value -= 1n;
      return value.toString();
    }
  }
}

export function generateNumCp003Wave02(id: NumCp003Wave02Id, seed: string): NumCp003Wave02Question {
  if (!NUM_CP003_WAVE02_IDS.includes(id)) throw new Error(`Unknown wave-02 prototype ${id}`);
  const random = createRandom(`${id}:${seed}`);
  const raw = rawFor(id, random);
  const shuffled = shuffle(random, raw.options);
  const verifierAnswer = verify(raw.hiddenState);
  const errors: string[] = [];
  if (verifierAnswer !== raw.answer) errors.push(`Verifier ${verifierAnswer} != answer ${raw.answer}`);
  if (shuffled.rows[shuffled.correctIndex]?.text !== raw.answer) errors.push("Correct option mismatch");
  if (!raw.stem.endsWith("?")) errors.push("Stem is not interrogative");
  if (raw.explanation.traps.length !== 3) errors.push("Expected three traps");
  return {
    canonicalProblemId: "NUM-CP-003",
    prototypeId: id,
    permanentQlId: null,
    seed,
    difficulty: raw.difficulty,
    answerSemantic: raw.answerSemantic,
    stem: raw.stem,
    answer: raw.answer,
    options: shuffled.rows.map((row) => row.text),
    correctIndex: shuffled.correctIndex,
    optionAudit: shuffled.rows,
    hiddenState: raw.hiddenState,
    explanation: raw.explanation,
    reasoningGraph: { nodes: raw.nodes },
    fingerprint: raw.fingerprint,
    validation: { ok: errors.length === 0, errors, verifierAnswer },
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
