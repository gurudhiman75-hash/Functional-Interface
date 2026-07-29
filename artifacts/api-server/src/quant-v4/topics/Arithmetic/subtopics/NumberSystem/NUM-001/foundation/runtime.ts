import {
  fillSingleDigit,
  fillTwoDigits,
  isDivisible,
  leastMultipleAtOrAbove,
  powerOfTen,
  repeatBlock,
  validSingleDigits,
  validTwoDigitPairs,
} from "./divisibility";
import { createRandom, type DeterministicRandom } from "./prng";
import { NUM_CP003_PROTOTYPE_REGISTRY } from "./registry";
import {
  NUM_001_ARCHETYPE_ID,
  NUM_CP_003_ID,
  type NumAnswerSemantic,
  type NumCp003Explanation,
  type NumCp003GeneratedPrototype,
  type NumCp003HiddenState,
  type NumCp003MisconceptionId,
  type NumCp003OptionAudit,
  type NumCp003PrototypeId,
  type NumDifficulty,
  type NumReasoningNode,
  type NumTaskDirection,
} from "./types";

const DIVISOR_POOL = [4n, 6n, 7n, 8n, 9n, 11n, 12n, 13n, 15n, 18n, 24n, 25n, 27n, 32n, 36n, 45n, 72n, 99n] as const;
const SINGLE_DIGIT_DIVISORS = [4n, 6n, 8n, 9n, 11n, 12n, 18n, 24n, 25n, 36n, 45n] as const;
const TWO_RULE_DIVISORS: ReadonlyArray<readonly [bigint, bigint]> = [
  [8n, 9n], [8n, 11n], [9n, 11n], [11n, 12n], [11n, 18n], [12n, 25n],
];

interface RawQuestion {
  hiddenState: NumCp003HiddenState;
  stem: string;
  answer: string;
  options: NumCp003OptionAudit[];
  explanation: NumCp003Explanation;
  reasoningNodes: NumReasoningNode[];
  difficultyEvidence: string[];
  fingerprint: string;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`);
}

function randomDigits(random: DeterministicRandom, length: number): string[] {
  return Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
}

function option(value: string, misconceptionId: NumCp003MisconceptionId): NumCp003OptionAudit {
  return { text: value, value, misconceptionId };
}

function shuffleOptions(
  random: DeterministicRandom,
  candidates: readonly NumCp003OptionAudit[],
): { options: NumCp003OptionAudit[]; correctIndex: number } {
  const unique = new Map<string, NumCp003OptionAudit>();
  for (const candidate of candidates) if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);
  if (unique.size !== 4) throw new Error(`Expected four unique options, received ${unique.size}`);
  const options = random.shuffle([...unique.values()]);
  const correctIndex = options.findIndex((item) => item.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("Correct option is missing");
  return { options, correctIndex };
}

function falseDivisors(number: bigint, correct: bigint, random: DeterministicRandom): bigint[] {
  const values = DIVISOR_POOL.filter((divisor) => divisor !== correct && !isDivisible(number, divisor));
  if (values.length < 3) throw new Error("Insufficient false divisors");
  return random.shuffle(values).slice(0, 3);
}

function directComposite(random: DeterministicRandom): RawQuestion {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const correctDivisor = random.pick(DIVISOR_POOL.filter((value) => ![7n, 11n, 13n].includes(value)));
    const multiplier = BigInt(random.int(1_200, 98_000));
    const number = correctDivisor * multiplier;
    let wrong: bigint[];
    try { wrong = falseDivisors(number, correctDivisor, random); } catch { continue; }
    const divisorOptions = [correctDivisor, ...wrong];
    return {
      hiddenState: { kind: "DIRECT_COMPOSITE_DIVISIBILITY", number, correctDivisor, divisorOptions },
      stem: random.pick([
        `Which of the following numbers divides ${number} exactly?`,
        `For which option is ${number} exactly divisible?`,
        `Which divisor leaves no remainder when ${number} is divided?`,
        `${number} is divisible by exactly one of the following options. Which one?`,
      ]),
      answer: correctDivisor.toString(),
      options: [
        option(correctDivisor.toString(), "CORRECT"),
        option(wrong[0]!.toString(), "USED_LAST_DIGIT_ONLY"),
        option(wrong[1]!.toString(), "USED_DIGIT_SUM_ONLY"),
        option(wrong[2]!.toString(), "CHECKED_ONE_FACTOR_ONLY"),
      ],
      explanation: {
        coreConcept: "A composite divisor must satisfy every prime-power condition in its factorisation.",
        strategy: `Test each option against ${number}; the correct divisor must leave remainder 0.`,
        steps: [
          "Use exact division rather than relying on only the last digit or only the digit sum.",
          `\(${number} \div ${correctDivisor} = ${multiplier}\), which is an integer.`,
          "The other displayed options leave non-zero remainders.",
        ],
        shortcut: `Factor ${correctDivisor} into its prime-power conditions and check those conditions directly.`,
        verification: `${number} = ${correctDivisor} × ${multiplier}, so the remainder is exactly 0.`,
        conclusion: `Therefore, ${correctDivisor} is the required divisor.`,
        traps: [
          "A valid last digit proves divisibility only for specific divisors.",
          "A digit-sum test cannot be used for every divisor.",
          "For a composite divisor, checking only one prime factor is incomplete.",
        ],
      },
      reasoningNodes: [
        { id: "given", kind: "GIVEN", text: `The tested number is ${number}.`, dependsOn: [] },
        { id: "rule", kind: "RULE", text: "Exact divisibility means remainder 0.", dependsOn: ["given"] },
        { id: "derive", kind: "DERIVATION", text: `${number} = ${correctDivisor} × ${multiplier}.`, dependsOn: ["rule"] },
        { id: "verify", kind: "VERIFICATION", text: "The product reconstructs the displayed number exactly.", dependsOn: ["derive"] },
        { id: "conclusion", kind: "CONCLUSION", text: `${correctDivisor} is the correct option.`, dependsOn: ["verify"] },
      ],
      difficultyEvidence: ["composite divisor", "multiple competing divisibility rules"],
      fingerprint: `direct:${number}:${correctDivisor}:${divisorOptions.join(",")}`,
    };
  }
  throw new Error("Unable to construct a direct composite-divisibility state");
}

function singleMissingUnique(random: DeterministicRandom): RawQuestion {
  for (let attempt = 0; attempt < 900; attempt += 1) {
    const length = random.int(4, 7);
    const digits = randomDigits(random, length);
    digits[random.int(1, length - 1)] = "X";
    const template = digits.join("");
    const divisor = random.pick(SINGLE_DIGIT_DIVISORS);
    const validDigits = validSingleDigits(template, divisor);
    if (validDigits.length !== 1) continue;
    const answerDigit = validDigits[0]!;
    const wrong = random.shuffle(Array.from({ length: 10 }, (_unused, digit) => digit).filter((digit) => digit !== answerDigit)).slice(0, 3);
    const completed = fillSingleDigit(template, answerDigit);
    return {
      hiddenState: { kind: "SINGLE_MISSING_DIGIT", template, divisor, validDigits },
      stem: random.pick([
        `The number ${template} is divisible by ${divisor}. What is the missing digit X?`,
        `Which digit should replace X in ${template} so that the number is exactly divisible by ${divisor}?`,
        `What is X if ${template} leaves remainder 0 when divided by ${divisor}?`,
        `Only one digit makes ${template} divisible by ${divisor}. Which digit is it?`,
      ]),
      answer: String(answerDigit),
      options: [
        option(String(answerDigit), "CORRECT"),
        option(String(wrong[0]), "USED_DIGIT_SUM_ONLY"),
        option(String(wrong[1]), "USED_LAST_DIGIT_ONLY"),
        option(String(wrong[2]), "CHECKED_ONE_FACTOR_ONLY"),
      ],
      explanation: {
        coreConcept: `A missing digit must satisfy the complete divisibility condition for ${divisor}.`,
        strategy: "Test the admissible digits 0 to 9 and retain only those that make the full number divisible.",
        steps: [
          "Replace X successively by digits from 0 to 9.",
          `The unique successful completion is \(${completed}\).`,
          `\(${completed} \div ${divisor}\) is an integer, while every other completion leaves a remainder.`,
        ],
        shortcut: `Apply the divisibility rule for ${divisor} to the fixed digits first; solve only for the missing contribution.`,
        verification: `Direct enumeration gives the valid-digit set {${validDigits.join(", ")}}.`,
        conclusion: `Therefore, X = ${answerDigit}.`,
        traps: [
          "Do not stop after a digit satisfies only part of a composite rule.",
          "The last-digit rule applies only to selected divisors.",
          "Check whether zero is allowed only after confirming X is not the leading digit.",
        ],
      },
      reasoningNodes: [
        { id: "given", kind: "GIVEN", text: `Template ${template} must be divisible by ${divisor}.`, dependsOn: [] },
        { id: "rule", kind: "RULE", text: `Use the complete divisibility condition for ${divisor}.`, dependsOn: ["given"] },
        { id: "enumerate", kind: "ENUMERATION", text: `Digits 0 to 9 produce the valid set {${validDigits.join(", ")}}.`, dependsOn: ["rule"] },
        { id: "verify", kind: "VERIFICATION", text: `${completed} has remainder 0 on division by ${divisor}.`, dependsOn: ["enumerate"] },
        { id: "conclusion", kind: "CONCLUSION", text: `X = ${answerDigit}.`, dependsOn: ["verify"] },
      ],
      difficultyEvidence: ["inverse digit reconstruction", `divisor ${divisor}`, `${length}-digit numeral`],
      fingerprint: `single-unique:${template}:${divisor}:${answerDigit}`,
    };
  }
  throw new Error("Unable to construct a unique single-missing-digit state");
}

function singleMissingCount(random: DeterministicRandom): RawQuestion {
  for (let attempt = 0; attempt < 900; attempt += 1) {
    const length = random.int(4, 7);
    const digits = randomDigits(random, length);
    digits[random.int(1, length - 1)] = "X";
    const template = digits.join("");
    const divisor = random.pick([3n, 6n, 9n, 11n] as const);
    const validDigits = validSingleDigits(template, divisor);
    if (validDigits.length < 2 || validDigits.length > 5) continue;
    const count = validDigits.length;
    const wrongCounts = [...new Set([count - 1, count + 1, 10 - count, count + 2])]
      .filter((value) => value >= 0 && value <= 10 && value !== count);
    for (let candidate = 0; wrongCounts.length < 3 && candidate <= 10; candidate += 1) {
      if (candidate !== count && !wrongCounts.includes(candidate)) wrongCounts.push(candidate);
    }
    return {
      hiddenState: { kind: "SINGLE_MISSING_DIGIT", template, divisor, validDigits },
      stem: random.pick([
        `How many digits can replace X in ${template} so that the number is divisible by ${divisor}?`,
        `For how many values of X from 0 to 9 is ${template} exactly divisible by ${divisor}?`,
        `How many digits X make ${template} a multiple of ${divisor}?`,
        `The digit X in ${template} may take several values. How many of them satisfy divisibility by ${divisor}?`,
      ]),
      answer: String(count),
      options: [
        option(String(count), "CORRECT"),
        option(String(wrongCounts[0]), "COUNTED_ONE_FEWER_DIGIT"),
        option(String(wrongCounts[1]), "COUNTED_ONE_EXTRA_DIGIT"),
        option(String(wrongCounts[2]), "IGNORED_LEADING_ZERO_RULE"),
      ],
      explanation: {
        coreConcept: "A count question requires the complete valid set, not the first working digit.",
        strategy: `Enumerate all ten digit candidates and keep every completion divisible by ${divisor}.`,
        steps: [
          `Test X = 0, 1, 2, …, 9 in the full numeral ${template}.`,
          `The valid digits are {${validDigits.join(", ")}}.`,
          `This set contains ${count} digits.`,
        ],
        shortcut: `Use the divisibility rule for ${divisor} to derive the allowed residue class of X, then list that class within 0 to 9.`,
        verification: `Direct exact division of all ten completed numerals confirms ${count} valid digits.`,
        conclusion: `Therefore, the required count is ${count}.`,
        traps: [
          "Do not report the first valid digit when the question asks for a count.",
          "Include every digit from 0 to 9 when X is not leading.",
          "A composite divisor may require more than one simultaneous condition.",
        ],
      },
      reasoningNodes: [
        { id: "given", kind: "GIVEN", text: `${template} must be divisible by ${divisor}.`, dependsOn: [] },
        { id: "rule", kind: "RULE", text: "The answer is the size of the complete admissible digit set.", dependsOn: ["given"] },
        { id: "enumerate", kind: "ENUMERATION", text: `Valid digits: {${validDigits.join(", ")}}.`, dependsOn: ["rule"] },
        { id: "verify", kind: "VERIFICATION", text: `The set size is ${count}.`, dependsOn: ["enumerate"] },
        { id: "conclusion", kind: "CONCLUSION", text: `${count} digits work.`, dependsOn: ["verify"] },
      ],
      difficultyEvidence: ["complete digit-domain enumeration", `multiple valid values (${count})`, `divisor ${divisor}`],
      fingerprint: `single-count:${template}:${divisor}:${validDigits.join("")}`,
    };
  }
  throw new Error("Unable to construct a multi-answer single-missing-digit state");
}

function pairText(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

function twoMissingDigits(random: DeterministicRandom): RawQuestion {
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    const length = random.int(5, 7);
    const digits = randomDigits(random, length);
    const firstIndex = random.int(1, length - 2);
    const secondIndex = random.int(firstIndex + 1, length - 1);
    digits[firstIndex] = "X";
    digits[secondIndex] = "Y";
    const template = digits.join("");
    const divisors = random.pick(TWO_RULE_DIVISORS);
    const viable: Array<{ sum: number; pairs: Array<[number, number]> }> = [];
    for (let sum = 1; sum <= 17; sum += 1) {
      const pairs = validTwoDigitPairs(template, divisors, sum);
      if (pairs.length === 1) viable.push({ sum, pairs });
    }
    if (viable.length === 0) continue;
    const chosen = random.pick(viable);
    const answerPair = chosen.pairs[0]!;
    const distractors: Array<[number, number]> = [];
    const swapped: [number, number] = [answerPair[1], answerPair[0]];
    if (pairText(swapped) !== pairText(answerPair)) distractors.push(swapped);
    for (const pair of validTwoDigitPairs(template, divisors)) {
      if (pairText(pair) !== pairText(answerPair) && !distractors.some((item) => pairText(item) === pairText(pair))) distractors.push(pair);
    }
    for (let x = 0; distractors.length < 3 && x <= 9; x += 1) {
      const pair: [number, number] = [x, Math.max(0, Math.min(9, chosen.sum - x))];
      if (pairText(pair) !== pairText(answerPair) && !distractors.some((item) => pairText(item) === pairText(pair))) distractors.push(pair);
    }
    if (distractors.length < 3) continue;
    const completed = fillTwoDigits(template, answerPair[0], answerPair[1]);
    return {
      hiddenState: {
        kind: "TWO_MISSING_DIGITS",
        template,
        divisors: [divisors[0], divisors[1]],
        requiredDigitSum: chosen.sum,
        validPairs: chosen.pairs,
      },
      stem: random.pick([
        `In the number ${template}, X + Y = ${chosen.sum}. If the number is divisible by both ${divisors[0]} and ${divisors[1]}, what is the ordered pair (X, Y)?`,
        `The digits X and Y in ${template} add to ${chosen.sum}. Which ordered pair makes the number divisible by ${divisors[0]} as well as ${divisors[1]}?`,
        `What is (X, Y) for ${template} when X + Y = ${chosen.sum} and both divisibility conditions ${divisors[0]} and ${divisors[1]} hold?`,
      ]),
      answer: pairText(answerPair),
      options: [
        option(pairText(answerPair), "CORRECT"),
        option(pairText(distractors[0]!), "SWAPPED_DIGIT_ORDER"),
        option(pairText(distractors[1]!), "IGNORED_DIGIT_SUM_CONSTRAINT"),
        option(pairText(distractors[2]!), "IGNORED_SECOND_DIVISIBILITY_RULE"),
      ],
      explanation: {
        coreConcept: "Both digit positions are ordered, and every stated constraint must hold simultaneously.",
        strategy: `Use X + Y = ${chosen.sum} to limit the pairs, then test divisibility by ${divisors[0]} and ${divisors[1]}.`,
        steps: [
          `List ordered digit pairs whose sum is ${chosen.sum}.`,
          `Substitute each pair into ${template}.`,
          `Only ${pairText(answerPair)} gives ${completed}, which is divisible by both stated divisors.`,
        ],
        shortcut: "Apply the cheaper digit rule first, then test the surviving pair against the second divisor.",
        verification: `A complete 100-pair search with the digit-sum filter leaves only ${pairText(answerPair)}.`,
        conclusion: `Therefore, (X, Y) = ${pairText(answerPair)}.`,
        traps: [
          "(X, Y) is ordered; swapping the digits changes the numeral.",
          "A pair with the correct sum may still fail a divisibility rule.",
          "Passing one divisor is not enough when two are stated.",
        ],
      },
      reasoningNodes: [
        { id: "given", kind: "GIVEN", text: `${template}, X + Y = ${chosen.sum}, divisors ${divisors[0]} and ${divisors[1]}.`, dependsOn: [] },
        { id: "rule", kind: "RULE", text: "All constraints must hold for the same ordered pair.", dependsOn: ["given"] },
        { id: "enumerate", kind: "ENUMERATION", text: `The full filtered search gives ${pairText(answerPair)} only.`, dependsOn: ["rule"] },
        { id: "verify", kind: "VERIFICATION", text: `${completed} is divisible by both divisors.`, dependsOn: ["enumerate"] },
        { id: "conclusion", kind: "CONCLUSION", text: `(X, Y) = ${pairText(answerPair)}.`, dependsOn: ["verify"] },
      ],
      difficultyEvidence: ["two unknown digits", "two divisibility rules", "ordered-pair semantics", "digit-sum constraint"],
      fingerprint: `two-digit:${template}:${divisors.join(",")}:${chosen.sum}:${pairText(answerPair)}`,
    };
  }
  throw new Error("Unable to construct a unique two-missing-digit state");
}

function repeatedBlockQuestion(random: DeterministicRandom): RawQuestion {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const block = randomDigits(random, random.int(2, 3)).join("");
    const repeats = random.int(2, 4);
    const number = repeatBlock(block, repeats);
    const trueDivisors = DIVISOR_POOL.filter((divisor) => isDivisible(number, divisor));
    if (trueDivisors.length === 0) continue;
    const correctDivisor = random.pick(trueDivisors);
    let wrong: bigint[];
    try { wrong = falseDivisors(number, correctDivisor, random); } catch { continue; }
    const divisorOptions = [correctDivisor, ...wrong];
    return {
      hiddenState: { kind: "REPEATED_BLOCK", block, repeats, number, correctDivisor, divisorOptions },
      stem: random.pick([
        `The block ${block} is written ${repeats} times without a gap, forming ${number}. Which option divides the resulting number exactly?`,
        `Which of the following is a divisor of the repeated-block number ${number}?`,
        `A numeral is formed by repeating ${block} exactly ${repeats} times. Which option leaves remainder 0?`,
      ]),
      answer: correctDivisor.toString(),
      options: [
        option(correctDivisor.toString(), "CORRECT"),
        option(wrong[0]!.toString(), "TESTED_ONLY_THE_SOURCE_BLOCK"),
        option(wrong[1]!.toString(), "USED_DIGIT_SUM_ONLY"),
        option(wrong[2]!.toString(), "CHECKED_ONE_FACTOR_ONLY"),
      ],
      explanation: {
        coreConcept: "A repeated block forms one complete integer; divisibility must be tested on that full integer.",
        strategy: `Use the place-value identity or divide the constructed number ${number} by each option.`,
        steps: [
          `The repeated numeral is ${number}.`,
          `\(${number} \div ${correctDivisor} = ${number / correctDivisor}\).`,
          "That quotient is an integer, whereas the other displayed options leave remainders.",
        ],
        shortcut: `Write the number as ${block} multiplied by a place-value repetition factor, then test the factorisation.`,
        verification: `Exact reconstruction gives ${number} = ${correctDivisor} × ${number / correctDivisor}, so the remainder is 0.`,
        conclusion: `Therefore, ${correctDivisor} is the required divisor.`,
        traps: [
          "Testing only the source block ignores the place-value repetition factor.",
          "Digit-sum tests apply only to specific divisors.",
          "A composite option requires every prime-power condition.",
        ],
      },
      reasoningNodes: [
        { id: "given", kind: "GIVEN", text: `${block} repeated ${repeats} times gives ${number}.`, dependsOn: [] },
        { id: "rule", kind: "RULE", text: "Test divisibility on the full repeated numeral.", dependsOn: ["given"] },
        { id: "derive", kind: "DERIVATION", text: `${number} ÷ ${correctDivisor} = ${number / correctDivisor}.`, dependsOn: ["rule"] },
        { id: "verify", kind: "VERIFICATION", text: "The quotient is integral and reconstructs the numeral.", dependsOn: ["derive"] },
        { id: "conclusion", kind: "CONCLUSION", text: `${correctDivisor} divides the number exactly.`, dependsOn: ["verify"] },
      ],
      difficultyEvidence: ["repeated-block representation", `${repeats} concatenated blocks`, "composite divisibility choices"],
      fingerprint: `block:${block}:${repeats}:${correctDivisor}:${divisorOptions.join(",")}`,
    };
  }
  throw new Error("Unable to construct a repeated-block state");
}

function leastNDigitMultiple(random: DeterministicRandom): RawQuestion {
  const digits = random.int(3, 6);
  const divisor = BigInt(random.int(7, 97));
  const lowerBound = powerOfTen(digits - 1);
  const answer = leastMultipleAtOrAbove(lowerBound, divisor);
  const previous = answer - divisor;
  const next = answer + divisor;
  const wrongComplement = lowerBound + (lowerBound % divisor);
  const wrongBoundary = powerOfTen(digits);
  const wrong = [...new Set([previous, next, wrongComplement, wrongBoundary].map(String))].filter((value) => value !== answer.toString());
  for (let offset = 2n; wrong.length < 3; offset += 1n) {
    const value = (answer + offset * divisor).toString();
    if (!wrong.includes(value)) wrong.push(value);
  }
  return {
    hiddenState: { kind: "LEAST_N_DIGIT_MULTIPLE", digits, divisor, lowerBound, answer },
    stem: random.pick([
      `What is the least ${digits}-digit number exactly divisible by ${divisor}?`,
      `What is the smallest multiple of ${divisor} that has ${digits} digits?`,
      `Which is the first ${digits}-digit integer in the sequence of multiples of ${divisor}?`,
      `What is the least ${digits}-digit number that leaves remainder 0 when divided by ${divisor}?`,
    ]),
    answer: answer.toString(),
    options: [
      option(answer.toString(), "CORRECT"),
      option(wrong[0]!, "USED_PREVIOUS_MULTIPLE"),
      option(wrong[1]!, "USED_NEXT_MULTIPLE_AFTER_ANSWER"),
      option(wrong[2]!, "USED_N_PLUS_ONE_DIGIT_BOUNDARY"),
    ],
    explanation: {
      coreConcept: `The least ${digits}-digit number is ${lowerBound}; move upward only to the first multiple of ${divisor}.`,
      strategy: `Divide ${lowerBound} by ${divisor}, then add the complement of the remainder.`,
      steps: [
        `The lower boundary is \(${lowerBound}\).`,
        `The first multiple of ${divisor} at or above that boundary is \(${answer}\).`,
        `The previous multiple, ${previous}, is below the required boundary.`,
      ],
      shortcut: `Use \(\lceil ${lowerBound}/${divisor} \rceil \times ${divisor}\).`,
      verification: `${answer} is divisible by ${divisor}, and ${previous} has fewer than ${digits} digits.`,
      conclusion: `Therefore, the least required number is ${answer}.`,
      traps: [
        "The previous multiple may be divisible but can have too few digits.",
        "The next multiple is valid but is not the least one.",
        "Use the complement of the remainder, not the remainder itself.",
      ],
    },
    reasoningNodes: [
      { id: "given", kind: "GIVEN", text: `Need the least ${digits}-digit multiple of ${divisor}.`, dependsOn: [] },
      { id: "rule", kind: "RULE", text: `Start at the boundary ${lowerBound}.`, dependsOn: ["given"] },
      { id: "derive", kind: "DERIVATION", text: `First admissible multiple: ${answer}.`, dependsOn: ["rule"] },
      { id: "verify", kind: "VERIFICATION", text: `${answer} is divisible and ${previous} is below the boundary.`, dependsOn: ["derive"] },
      { id: "conclusion", kind: "CONCLUSION", text: `${answer} is least.`, dependsOn: ["verify"] },
    ],
    difficultyEvidence: ["lower-bound optimisation", `${digits}-digit range`, `divisor ${divisor}`],
    fingerprint: `least:${digits}:${divisor}:${answer}`,
  };
}

function independentlyVerify(state: NumCp003HiddenState, displayedOptions: readonly string[]): string {
  switch (state.kind) {
    case "DIRECT_COMPOSITE_DIVISIBILITY": {
      const matches = displayedOptions.filter((value) => state.number % BigInt(value) === 0n);
      if (matches.length !== 1) throw new Error(`Expected one dividing option, found ${matches.join(", ")}`);
      return matches[0]!;
    }
    case "SINGLE_MISSING_DIGIT": {
      const matches: number[] = [];
      for (let digit = 0; digit <= 9; digit += 1) {
        const numeral = state.template.replace("X", String(digit));
        if (!numeral.startsWith("0") && BigInt(numeral) % state.divisor === 0n) matches.push(digit);
      }
      return matches.length === 1 ? String(matches[0]) : String(matches.length);
    }
    case "TWO_MISSING_DIGITS": {
      const matches: Array<[number, number]> = [];
      for (let first = 0; first <= 9; first += 1) {
        for (let second = 0; second <= 9; second += 1) {
          if (first + second !== state.requiredDigitSum) continue;
          const numeral = state.template.replace("X", String(first)).replace("Y", String(second));
          if (numeral.startsWith("0")) continue;
          const value = BigInt(numeral);
          if (value % state.divisors[0] === 0n && value % state.divisors[1] === 0n) matches.push([first, second]);
        }
      }
      if (matches.length !== 1) throw new Error(`Expected one ordered pair, found ${matches.map(pairText).join(", ")}`);
      return pairText(matches[0]!);
    }
    case "REPEATED_BLOCK": {
      const reconstructed = BigInt(state.block.repeat(state.repeats));
      if (reconstructed !== state.number) throw new Error("Repeated-block reconstruction mismatch");
      const matches = displayedOptions.filter((value) => reconstructed % BigInt(value) === 0n);
      if (matches.length !== 1) throw new Error(`Expected one repeated-block divisor, found ${matches.join(", ")}`);
      return matches[0]!;
    }
    case "LEAST_N_DIGIT_MULTIPLE": {
      let candidate = state.lowerBound;
      while (candidate % state.divisor !== 0n) candidate += 1n;
      return candidate.toString();
    }
    default:
      return assertNever(state);
  }
}

function metadataFor(prototypeId: NumCp003PrototypeId): {
  difficulty: NumDifficulty;
  taskDirection: NumTaskDirection;
  answerSemantic: NumAnswerSemantic;
} {
  const entry = NUM_CP003_PROTOTYPE_REGISTRY.find((candidate) => candidate.prototypeId === prototypeId);
  if (!entry) throw new Error(`Unknown prototype ${prototypeId}`);
  return { difficulty: entry.baseDifficulty, taskDirection: entry.taskDirection, answerSemantic: entry.answerSemantic };
}

export function generateNumCp003Prototype(prototypeId: NumCp003PrototypeId, seed: string): NumCp003GeneratedPrototype {
  const random = createRandom(`${prototypeId}:${seed}`);
  const raw = (() => {
    switch (prototypeId) {
      case "NUM-CP003-PROT-DIRECT-COMPOSITE-DIVISIBILITY": return directComposite(random);
      case "NUM-CP003-PROT-SINGLE-MISSING-DIGIT-UNIQUE": return singleMissingUnique(random);
      case "NUM-CP003-PROT-SINGLE-MISSING-DIGIT-COUNT": return singleMissingCount(random);
      case "NUM-CP003-PROT-TWO-MISSING-DIGITS-MULTI-RULE": return twoMissingDigits(random);
      case "NUM-CP003-PROT-REPEATED-BLOCK-DIVISIBILITY": return repeatedBlockQuestion(random);
      case "NUM-CP003-PROT-LEAST-N-DIGIT-MULTIPLE": return leastNDigitMultiple(random);
      default: return assertNever(prototypeId);
    }
  })();

  const shuffled = shuffleOptions(random, raw.options);
  const displayedOptions = shuffled.options.map((item) => item.text);
  const verifierAnswer = independentlyVerify(raw.hiddenState, displayedOptions);
  const errors: string[] = [];
  if (verifierAnswer !== raw.answer) errors.push(`Verifier answer ${verifierAnswer} differs from ${raw.answer}`);
  if (new Set(displayedOptions).size !== 4) errors.push("Options are not unique");
  if (displayedOptions[shuffled.correctIndex] !== raw.answer) errors.push("Correct option does not match the answer");
  if (!raw.stem.endsWith("?")) errors.push("Stem is not interrogative");
  if (!raw.reasoningNodes.some((node) => node.kind === "VERIFICATION")) errors.push("Verification node is missing");
  const metadata = metadataFor(prototypeId);

  return {
    archetypeId: NUM_001_ARCHETYPE_ID,
    canonicalProblemId: NUM_CP_003_ID,
    prototypeId,
    permanentQlId: null,
    language: "en",
    seed,
    difficulty: metadata.difficulty,
    difficultyEvidence: raw.difficultyEvidence,
    taskDirection: metadata.taskDirection,
    answerSemantic: metadata.answerSemantic,
    stem: raw.stem,
    hiddenState: raw.hiddenState,
    answer: raw.answer,
    options: displayedOptions,
    optionAudit: shuffled.options,
    correctIndex: shuffled.correctIndex,
    explanation: raw.explanation,
    reasoningGraph: { nodes: raw.reasoningNodes },
    mathematicalFingerprint: raw.fingerprint,
    validation: { ok: errors.length === 0, errors, verifierAnswer },
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
