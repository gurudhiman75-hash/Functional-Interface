import type { DeterministicRandom } from "../../foundation/prng";
import {
  DIVISOR_POOL,
  constructRepeatedNumeral,
  countMultiplesInclusive,
  difficultyFromState,
  falseDivisors,
  firstNDigitBoundary,
  greatestMultipleAtOrBelow,
  lastNDigitBoundary,
  leastMultipleAtOrAbove,
  option,
  reasoningNodes,
  trueDivisors,
} from "./runtime-core";
import type {
  NumCp003RawRetainedQuestion,
  NumCp003RetainedOptionAudit,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";

function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function lcm(left: bigint, right: bigint): bigint {
  return left / gcd(left, right) * right;
}

function addUnique(rows: NumCp003RetainedOptionAudit[], row: NumCp003RetainedOptionAudit): void {
  if (!rows.some((existing) => existing.text === row.text)) rows.push(row);
}

function directDivisibility(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const polarity = random.pick(["DIVISIBLE", "NOT_DIVISIBLE"] as const);
  let number: bigint;
  let correct: bigint;
  let divisorOptions: bigint[];

  if (polarity === "DIVISIBLE") {
    for (;;) {
      correct = random.pick(DIVISOR_POOL);
      number = correct * BigInt(random.int(1_000, 99_000));
      let wrong: bigint[];
      try { wrong = falseDivisors(number, correct, random); } catch { continue; }
      divisorOptions = [correct, ...wrong];
      break;
    }
  } else {
    for (;;) {
      const selected = random.shuffle([...DIVISOR_POOL]).slice(0, 3);
      const base = selected.reduce((value, divisor) => lcm(value, divisor), 1n);
      if (base > 1_000_000n) continue;
      number = base * BigInt(random.int(11, 901));
      let falseValues: bigint[];
      try { falseValues = falseDivisors(number, -1n, random); } catch { continue; }
      correct = falseValues[0]!;
      const trueValues = selected.filter((divisor) => number % divisor === 0n);
      if (new Set(trueValues.map(String)).size < 3) continue;
      divisorOptions = [correct, ...trueValues.slice(0, 3)];
      break;
    }
  }

  const rows = divisorOptions.map((divisor) => {
    const remainder = number % divisor;
    const isCorrect = polarity === "DIVISIBLE" ? remainder === 0n : remainder !== 0n;
    return option(
      divisor.toString(),
      isCorrect ? "CORRECT" : remainder === 0n ? "DIVIDES_WHEN_NON_DIVISOR_REQUESTED" : "NON_ZERO_REMAINDER",
      remainder === 0n
        ? `${number} ÷ ${divisor} = ${number / divisor} exactly.`
        : `${number} ÷ ${divisor} leaves remainder ${remainder}.`,
    );
  });
  if (rows.filter((row) => row.misconceptionId === "CORRECT").length !== 1) throw new Error("Direct divisibility state is not unique");
  const request = polarity === "DIVISIBLE" ? "divides" : "does not divide";
  return {
    difficulty: difficultyFromState(number.toString().length + correct.toString().length),
    answerSemantic: "DIVISOR",
    stem: random.pick([
      `Which option ${request} ${number} exactly?`,
      `Select the number that ${polarity === "DIVISIBLE" ? "leaves remainder 0" : "leaves a non-zero remainder"} when ${number} is divided by it.`,
      `For which divisor option is the statement '${number} is ${polarity === "DIVISIBLE" ? "divisible" : "not divisible"}' true?`,
      `Identify the ${polarity === "DIVISIBLE" ? "divisor" : "non-divisor"} of ${number}.`,
    ]),
    answer: correct.toString(),
    optionAudit: rows,
    hiddenState: { kind: "DIRECT_DIVISIBILITY", number, requestedPolarity: polarity, divisorOptions },
    explanation: {
      coreConcept: "Exact divisibility is decided by the remainder for each displayed divisor.",
      strategy: `Test every option and select the unique one that ${request} the visible number.`,
      steps: [
        `Compute or infer the remainder of ${number} for each option.`,
        `The option ${correct} gives the requested ${polarity === "DIVISIBLE" ? "zero" : "non-zero"} remainder condition.`,
        "Every other option has the opposite remainder status.",
      ],
      shortcut: "Use the appropriate last-digit, digit-sum, suffix or alternating-sum rule before exact verification.",
      verification: polarity === "DIVISIBLE"
        ? `${number} = ${correct} × ${number / correct}.`
        : `${number} ÷ ${correct} leaves remainder ${number % correct}.`,
      conclusion: `Therefore, ${correct} is the required ${polarity === "DIVISIBLE" ? "divisor" : "non-divisor"}.`,
      traps: ["Do not use a digit-sum rule for an unrelated divisor.", "Do not check only one factor of a composite divisor.", "Read whether the question asks for a divisor or a non-divisor."],
    },
    reasoningNodes: reasoningNodes(
      `The tested number is ${number}.`,
      "Divisibility is equivalent to remainder 0.",
      `${correct} has the requested remainder status.`,
      polarity === "DIVISIBLE" ? `${number} = ${correct} × ${number / correct}.` : `The remainder is ${number % correct}.`,
      `${correct} is the correct option.`,
    ),
    fingerprint: `direct:${polarity}:${number}:${divisorOptions.join(",")}`,
  };
}

function boundaryMultiple(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const digits = random.int(3, 7);
  const divisor = random.pick(DIVISOR_POOL.filter((value) => value >= 7n));
  const direction = random.pick(["LEAST", "GREATEST"] as const);
  const lowerBoundary = firstNDigitBoundary(digits);
  const upperBoundary = lastNDigitBoundary(digits);
  const answer = direction === "LEAST"
    ? leastMultipleAtOrAbove(lowerBoundary, divisor)
    : greatestMultipleAtOrBelow(upperBoundary, divisor);
  const previous = answer - divisor;
  const next = answer + divisor;
  const wrongBoundary = direction === "LEAST"
    ? greatestMultipleAtOrBelow(lowerBoundary, divisor)
    : leastMultipleAtOrAbove(upperBoundary, divisor);
  const rows: NumCp003RetainedOptionAudit[] = [
    option(answer.toString(), "CORRECT", `${answer} is divisible by ${divisor} and is the requested ${direction.toLowerCase()} ${digits}-digit multiple.`),
  ];
  addUnique(rows, option(previous.toString(), "USED_PREVIOUS_MULTIPLE", `${previous} is the previous multiple; it fails the requested boundary condition.`));
  addUnique(rows, option(next.toString(), "USED_NEXT_MULTIPLE", `${next} is a later multiple than the required extremum.`));
  addUnique(rows, option(wrongBoundary.toString(), "USED_WRONG_BOUNDARY_DIRECTION", `${wrongBoundary} uses the opposite boundary direction.`));
  for (let offset = 2n; rows.length < 4; offset += 1n) {
    addUnique(rows, option((answer + offset * divisor).toString(), "USED_LATER_MULTIPLE", "This is a valid multiple but not the requested boundary extremum."));
  }
  const directionWord = direction.toLowerCase();
  return {
    difficulty: difficultyFromState(digits + Number(divisor % 7n)),
    answerSemantic: "NUMBER",
    stem: random.pick([
      `Find the ${directionWord} ${digits}-digit number divisible by ${divisor}.`,
      `What is the ${directionWord} multiple of ${divisor} having exactly ${digits} digits?`,
      `Determine the ${directionWord} ${digits}-digit integer that leaves remainder 0 on division by ${divisor}.`,
      `Which is the ${directionWord} number in the ${digits}-digit range that is a multiple of ${divisor}?`,
    ]),
    answer: answer.toString(),
    optionAudit: rows,
    hiddenState: { kind: "DIGIT_BOUND_MULTIPLE", digits, divisor, direction, lowerBoundary, upperBoundary, answer },
    explanation: {
      coreConcept: "The task asks for the nearest multiple at one decimal digit boundary.",
      strategy: direction === "LEAST" ? "Start at the first n-digit number and move to the next multiple." : "Start at the last n-digit number and move back to the previous multiple.",
      steps: [
        `The ${digits}-digit interval is ${lowerBoundary} to ${upperBoundary}.`,
        direction === "LEAST" ? `Move upward from ${lowerBoundary} to the first multiple of ${divisor}.` : `Move downward from ${upperBoundary} to the last multiple of ${divisor}.`,
        `The required boundary multiple is ${answer}.`,
      ],
      shortcut: direction === "LEAST" ? "Add the complement of the lower-bound remainder." : "Subtract the upper-bound remainder.",
      verification: `${answer} ÷ ${divisor} = ${answer / divisor}, and the adjacent multiple beyond the requested edge fails the ${digits}-digit extremum condition.`,
      conclusion: `Therefore, the ${directionWord} ${digits}-digit multiple is ${answer}.`,
      traps: ["Do not use the opposite decimal boundary.", "Do not add the remainder when the complement is required.", "A later or earlier valid multiple may still fail the extremum target."],
    },
    reasoningNodes: reasoningNodes(
      `The range is ${lowerBoundary} to ${upperBoundary}.`,
      "Use the multiple nearest the requested boundary.",
      `The computed boundary multiple is ${answer}.`,
      `${answer} is divisible by ${divisor} and lies in the required digit range.`,
      `${answer} is the ${directionWord} valid number.`,
    ),
    fingerprint: `boundary:${direction}:${digits}:${divisor}:${answer}`,
  };
}

function rangeCount(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const divisor = random.pick(DIVISOR_POOL.filter((value) => value >= 4n));
  const lower = BigInt(random.int(1, 8_000));
  const upper = lower + BigInt(random.int(80, 2_500));
  const count = countMultiplesInclusive(lower, upper, divisor);
  const rows: NumCp003RetainedOptionAudit[] = [
    option(count.toString(), "CORRECT", `There are exactly ${count} multiples of ${divisor} from ${lower} through ${upper}, inclusive.`),
  ];
  for (const value of [count - 1n, count + 1n, count + 2n]) {
    if (value < 0n) continue;
    addUnique(rows, option(value.toString(), "BOUNDARY_COUNT_ERROR", `${value} results from omitting or adding an endpoint multiple.`));
  }
  for (let value = 0n; rows.length < 4; value += 1n) {
    if (value === count) continue;
    addUnique(rows, option(value.toString(), "INCORRECT_RANGE_COUNT", `${value} does not equal the exact inclusive count ${count}.`));
  }
  const first = leastMultipleAtOrAbove(lower, divisor);
  const last = greatestMultipleAtOrBelow(upper, divisor);
  return {
    difficulty: difficultyFromState(Number((upper - lower) / 300n) + divisor.toString().length),
    answerSemantic: "COUNT",
    stem: random.pick([
      `How many integers from ${lower} to ${upper}, inclusive, are divisible by ${divisor}?`,
      `Count the multiples of ${divisor} in the closed interval [${lower}, ${upper}].`,
      `How many numbers between ${lower} and ${upper}, including both endpoints, leave remainder 0 when divided by ${divisor}?`,
      `Find the number of multiples of ${divisor} in the inclusive range ${lower}–${upper}.`,
    ]),
    answer: count.toString(),
    optionAudit: rows,
    hiddenState: { kind: "ONE_DIVISOR_RANGE", lower, upper, divisor, count },
    explanation: {
      coreConcept: "Inclusive range counting uses the first and last multiples inside the interval.",
      strategy: "Find the endpoint multiples and count the arithmetic progression between them.",
      steps: [`The first multiple in range is ${first}.`, `The last multiple in range is ${last}.`, `The count is (${last} − ${first}) ÷ ${divisor} + 1 = ${count}.`],
      shortcut: `Use floor(${upper}/${divisor}) − floor((${lower}−1)/${divisor}).`,
      verification: `Direct bounded enumeration also finds ${count} valid integers.`,
      conclusion: `Therefore, the inclusive count is ${count}.`,
      traps: ["Do not exclude an endpoint that is itself a multiple.", "Use lower − 1 in the floor-count formula.", "This template has one divisor; do not introduce overlap counting."],
    },
    reasoningNodes: reasoningNodes(
      `Count multiples of ${divisor} from ${lower} to ${upper}.`,
      "Use first and last in-range multiples.",
      `The progression runs from ${first} to ${last}.`,
      `Its exact size is ${count}.`,
      `${count} integers qualify.`,
    ),
    fingerprint: `range:${lower}:${upper}:${divisor}:${count}`,
  };
}

function repeatedNumeral(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  for (let attempt = 0; attempt < 2_000; attempt += 1) {
    const length = random.int(1, 3);
    const block = Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9))).join("");
    const repeats = random.int(2, 5);
    const number = constructRepeatedNumeral(block, repeats);
    const possible = DIVISOR_POOL.filter((divisor) => number % divisor === 0n);
    if (possible.length === 0) continue;
    const correct = random.pick(possible);
    let wrong: bigint[];
    try { wrong = falseDivisors(number, correct, random); } catch { continue; }
    const divisorOptions = [correct, ...wrong];
    const rows = divisorOptions.map((divisor) => {
      const remainder = number % divisor;
      return option(
        divisor.toString(),
        remainder === 0n ? "CORRECT" : "NON_ZERO_REMAINDER",
        remainder === 0n
          ? `The constructed numeral equals ${divisor} × ${number / divisor}.`
          : `The constructed numeral leaves remainder ${remainder} on division by ${divisor}.`,
      );
    });
    if (rows.filter((row) => row.misconceptionId === "CORRECT").length !== 1) continue;
    return {
      difficulty: difficultyFromState(length + repeats + correct.toString().length),
      answerSemantic: "DIVISOR",
      stem: random.pick([
        `The block ${block} is written consecutively ${repeats} times to form one numeral. Which option divides that numeral exactly?`,
        `Repeat the digit block ${block} exactly ${repeats} times without spaces. The resulting number is divisible by which option?`,
        `A numeral is formed by concatenating ${repeats} copies of ${block}. Select its divisor.`,
        `Without being shown the expanded numeral, determine which option divides the number made from ${repeats} repetitions of ${block}.`,
      ]),
      answer: correct.toString(),
      optionAudit: rows,
      hiddenState: { kind: "IMPLICIT_REPEATED_NUMERAL", block, repeats, number, divisorOptions },
      explanation: {
        coreConcept: "The repeated block must first be interpreted as one place-value numeral before divisibility is tested.",
        strategy: "Construct the exact concatenated value or use its place-value factor, then test the options.",
        steps: [`Concatenating ${repeats} copies of ${block} gives ${number}.`, `Test the displayed divisor options against ${number}.`, `${number} is divisible by ${correct}.`],
        shortcut: `Write the value as ${block} × (1 + 10^${length} + ⋯ + 10^${length * (repeats - 1)}) before checking factors.`,
        verification: `${number} = ${correct} × ${number / correct}.`,
        conclusion: `Therefore, ${correct} is the required divisor.`,
        traps: ["Do not multiply the block by the repeat count.", "Do not add the blocks as ordinary integers.", "The complete numeral is intentionally implicit, not already displayed."],
      },
      reasoningNodes: reasoningNodes(
        `${repeats} copies of block ${block} are concatenated.`,
        "Concatenation uses decimal place value.",
        `The constructed numeral is ${number}.`,
        `${number} = ${correct} × ${number / correct}.`,
        `${correct} divides the numeral.`,
      ),
      fingerprint: `repeated:${block}:${repeats}:${number}:${correct}`,
    };
  }
  throw new Error("Unable to construct implicit repeated-numeral state");
}

function claimValidation(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const requestedPolarity = random.pick(["CORRECT", "INCORRECT"] as const);
  const desiredTruth = requestedPolarity === "CORRECT";
  const claims: Array<{ text: string; number: bigint; divisor: bigint; isTrue: boolean }> = [];
  const desiredIndex = random.int(0, 3);

  for (let index = 0; index < 4; index += 1) {
    const shouldBeTrue = index === desiredIndex ? desiredTruth : !desiredTruth;
    let number: bigint;
    let divisor: bigint;
    if (shouldBeTrue) {
      divisor = random.pick(DIVISOR_POOL);
      number = divisor * BigInt(random.int(500, 50_000));
    } else {
      for (;;) {
        divisor = random.pick(DIVISOR_POOL);
        number = BigInt(random.int(10_000, 999_999));
        if (number % divisor !== 0n) break;
      }
    }
    claims.push({
      text: `${number} is ${shouldBeTrue ? "divisible" : "not divisible"} by ${divisor}.`,
      number,
      divisor,
      isTrue: shouldBeTrue,
    });
  }

  const answerClaim = claims[desiredIndex]!;
  const rows = claims.map((claim, index) => option(
    claim.text,
    index === desiredIndex ? "CORRECT" : "WRONG_CLAIM_POLARITY",
    claim.number % claim.divisor === 0n
      ? `${claim.number} ÷ ${claim.divisor} = ${claim.number / claim.divisor} exactly, so the mathematical divisibility fact is true.`
      : `${claim.number} ÷ ${claim.divisor} leaves remainder ${claim.number % claim.divisor}, so the mathematical divisibility fact is false.`,
  ));
  return {
    difficulty: difficultyFromState(claims.reduce((sum, claim) => sum + claim.divisor.toString().length, 0)),
    answerSemantic: "TRUTH_CLAIM",
    stem: random.pick([
      `Which of the following divisibility statements is ${requestedPolarity.toLowerCase()}?`,
      `Select the ${requestedPolarity.toLowerCase()} claim.`,
      `Exactly one displayed statement has the requested truth status. Which is ${requestedPolarity.toLowerCase()}?`,
      `Identify the ${requestedPolarity.toLowerCase()} divisibility assertion among the options.`,
    ]),
    answer: answerClaim.text,
    optionAudit: rows,
    hiddenState: { kind: "CLAIM_VALIDATION", requestedPolarity, claims },
    explanation: {
      coreConcept: "Each claim must be evaluated mathematically before the requested correct or incorrect polarity is applied.",
      strategy: "Compute the exact remainder for every claim, then select the one with the requested truth status.",
      steps: ["Evaluate each number–divisor pair independently.", `The requested polarity is ${requestedPolarity.toLowerCase()}.`, `The matching claim is: ${answerClaim.text}`],
      shortcut: "Use the relevant divisibility rule for each divisor, then confirm any close case by exact remainder.",
      verification: answerClaim.number % answerClaim.divisor === 0n
        ? `${answerClaim.number} = ${answerClaim.divisor} × ${answerClaim.number / answerClaim.divisor}.`
        : `The remainder is ${answerClaim.number % answerClaim.divisor}.`,
      conclusion: `Therefore, '${answerClaim.text}' is the required ${requestedPolarity.toLowerCase()} claim.`,
      traps: ["Do not select a mathematically true claim when the question asks for an incorrect one.", "Evaluate every option independently.", "Do not use one divisor's rule for another divisor."],
    },
    reasoningNodes: reasoningNodes(
      `The requested claim polarity is ${requestedPolarity}.`,
      "Evaluate exact divisibility for each statement.",
      `The matching claim is '${answerClaim.text}'.`,
      rows[desiredIndex]!.diagnostic,
      "Select that claim.",
    ),
    fingerprint: `claim:${requestedPolarity}:${claims.map((claim) => `${claim.number}/${claim.divisor}/${claim.isTrue}`).join("|")}`,
  };
}

export function generateDirectBoundaryRangeRepeatedAuthority(
  label: NumCp003RetainedTemplateLabel,
  random: DeterministicRandom,
): NumCp003RawRetainedQuestion {
  switch (label) {
    case "NUM-CP003-QLT2-01": return directDivisibility(random);
    case "NUM-CP003-QLT2-12": return boundaryMultiple(random);
    case "NUM-CP003-QLT2-13": return rangeCount(random);
    case "NUM-CP003-QLT2-14": return repeatedNumeral(random);
    case "NUM-CP003-QLT2-17": return claimValidation(random);
    default: throw new Error(`Unsupported direct/boundary/range/repeated template ${label}`);
  }
}
