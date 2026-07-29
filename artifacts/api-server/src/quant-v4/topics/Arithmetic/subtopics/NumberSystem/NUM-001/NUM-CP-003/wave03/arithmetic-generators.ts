import { fillSingleDigit, fillTwoDigits, numeralToBigInt, validSingleDigits, validTwoDigitPairs } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import { DIVISORS, PAIR_DIVISORS, audit, nodes, pairText, type Raw } from "./core";
import type { Wave03HiddenState } from "./types";

export function arithmeticResultDigit(random: DeterministicRandom, kind: "DIFFERENCE" | "PRODUCT"): Raw {
  for (let attempt = 0; attempt < 2500; attempt += 1) {
    let left: bigint;
    let right: bigint;
    let actualResult: bigint;
    let expression: string;
    if (kind === "DIFFERENCE") {
      left = BigInt(random.int(150_000, 999_999));
      right = BigInt(random.int(10_000, Number(left - 1n)));
      actualResult = left - right;
      expression = `${left} - ${right}`;
    } else {
      left = BigInt(random.int(1_000, 70_000));
      right = BigInt(random.int(2, 19));
      actualResult = left * right;
      expression = `${left} × ${right}`;
    }
    const resultText = actualResult.toString();
    if (resultText.length < 3) continue;
    const hiddenIndex = random.int(1, resultText.length - 1);
    const resultTemplate = `${resultText.slice(0, hiddenIndex)}X${resultText.slice(hiddenIndex + 1)}`;
    const divisorChoices = DIVISORS.filter((divisor) => actualResult % divisor === 0n);
    if (divisorChoices.length === 0) continue;
    const divisor = random.pick(divisorChoices);
    const validDigits = validSingleDigits(resultTemplate, divisor);
    const answerDigit = Number(resultText[hiddenIndex]);
    if (validDigits.length !== 1 || validDigits[0] !== answerDigit) continue;

    const arithmeticWrong = (answerDigit + random.int(1, 9)) % 10;
    const otherDigits = random.shuffle(
      Array.from({ length: 10 }, (_unused, digit) => digit)
        .filter((digit) => digit !== answerDigit && digit !== arithmeticWrong),
    ).slice(0, 2);
    const operationLabel = kind === "DIFFERENCE" ? "subtraction" : "multiplication";
    const state: Wave03HiddenState = kind === "DIFFERENCE"
      ? { kind: "MISSING_DIGIT_IN_DIFFERENCE", minuend: left, subtrahend: right, resultTemplate, divisor, actualResult, validDigits }
      : { kind: "MISSING_DIGIT_IN_PRODUCT", multiplicand: left, multiplier: right, resultTemplate, divisor, actualResult, validDigits };

    return {
      hiddenState: state,
      difficulty: kind === "DIFFERENCE" ? "Medium" : "Hard",
      answerSemantic: "DIGIT",
      stem: `${expression} = ${resultTemplate}. The result is divisible by ${divisor}. What is X?`,
      answer: String(answerDigit),
      options: [
        audit(String(answerDigit), "CORRECT", `Exact ${operationLabel} gives ${actualResult}, so X = ${answerDigit}.`),
        audit(String(arithmeticWrong), "ARITHMETIC_RESULT_ERROR", `This digit does not match the exact ${operationLabel} result ${actualResult}.`),
        ...otherDigits.map((digit) => {
          const candidate = BigInt(fillSingleDigit(resultTemplate, digit));
          return audit(String(digit), "NON_ZERO_REMAINDER", `${candidate} leaves remainder ${candidate % divisor} on division by ${divisor}.`);
        }),
      ],
      explanation: {
        coreConcept: `The missing digit must satisfy the displayed ${operationLabel} and the divisibility condition.`,
        strategy: `Complete the ${operationLabel} exactly, then use divisibility by ${divisor} as an independent check.`,
        steps: [`${expression} = ${actualResult}.`, `The hidden digit in ${resultTemplate} is ${answerDigit}.`, `${actualResult} leaves remainder 0 on division by ${divisor}.`],
        shortcut: `Work only around the hidden place if convenient, but verify the full result by ${divisor}.`,
        verification: `Direct reconstruction of the complete result gives ${actualResult} and the singleton valid set {${answerDigit}}.`,
        conclusion: `Therefore, X = ${answerDigit}.`,
        traps: ["Do not ignore borrowing, carrying or place value.", "A digit satisfying divisibility still fails if the arithmetic is wrong.", "Verify the complete numeral, not an isolated digit."],
      },
      nodes: nodes(`Evaluate ${expression}.`, `Arithmetic and divisibility must agree.`, `Exact result ${actualResult}.`, `${actualResult} mod ${divisor} = 0.`, `X = ${answerDigit}.`),
      fingerprint: `${kind.toLowerCase()}:${left}:${right}:${resultTemplate}:${divisor}:${answerDigit}`,
    };
  }
  throw new Error(`Could not build ${kind.toLowerCase()} result-digit state`);
}

export function twoDigitPairCount(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 3500; attempt += 1) {
    const length = random.int(5, 7);
    const parts = Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
    const xIndex = random.int(1, length - 2);
    const yIndex = random.int(xIndex + 1, length - 1);
    parts[xIndex] = "X";
    parts[yIndex] = "Y";
    const template = parts.join("");
    const divisors = random.pick(PAIR_DIVISORS);
    const validPairs = validTwoDigitPairs(template, divisors);
    if (validPairs.length < 2 || validPairs.length > 14) continue;

    let firstPass = 0;
    let secondPass = 0;
    for (let x = 0; x <= 9; x += 1) {
      for (let y = 0; y <= 9; y += 1) {
        const value = numeralToBigInt(fillTwoDigits(template, x, y));
        if (value % divisors[0] === 0n) firstPass += 1;
        if (value % divisors[1] === 0n) secondPass += 1;
      }
    }
    const answer = validPairs.length;
    const wrongValues = [...new Set([answer - 1, answer + 1, firstPass, secondPass, answer + 2])]
      .filter((value) => value >= 0 && value !== answer);
    if (wrongValues.length < 3) continue;
    const chosenWrong = wrongValues.slice(0, 3);
    const options = [
      audit(String(answer), "CORRECT", `Complete enumeration gives ${answer} ordered pairs satisfying both divisors.`),
      ...chosenWrong.map((value) => {
        if (value === firstPass) return audit(String(value), "COUNTED_ONLY_FIRST_RULE", `${value} counts pairs passing ${divisors[0]} without enforcing ${divisors[1]}.`);
        if (value === secondPass) return audit(String(value), "COUNTED_ONLY_SECOND_RULE", `${value} counts pairs passing ${divisors[1]} without enforcing ${divisors[0]}.`);
        return audit(String(value), "PAIR_COUNT_OFF_BY_ONE", `The exhaustive ordered-pair count is ${answer}, not ${value}.`);
      }),
    ];
    if (new Set(options.map((row) => row.text)).size !== 4) continue;

    return {
      hiddenState: { kind: "TWO_DIGIT_PAIR_COUNT", template, divisors: [divisors[0], divisors[1]], validPairs },
      difficulty: "Hard",
      answerSemantic: "COUNT",
      stem: `How many ordered pairs (X, Y) make ${template} divisible by both ${divisors[0]} and ${divisors[1]}?`,
      answer: String(answer),
      options,
      explanation: {
        coreConcept: "The answer is the size of the intersection of two ordered-pair solution sets.",
        strategy: `Enumerate pairs (X, Y), retain those divisible by ${divisors[0]}, then apply ${divisors[1]}.`,
        steps: [`There are 100 ordered digit pairs initially.`, `Apply both divisibility rules to the same completed numeral.`, `The surviving pairs are ${validPairs.map(pairText).join(", ")}, so the count is ${answer}.`],
        shortcut: `Use the rule with the smaller survivor set first, then test only those pairs against the second divisor.`,
        verification: `A separate 10 × 10 exact search also returns ${answer}.`,
        conclusion: `Therefore, ${answer} ordered pairs satisfy both conditions.`,
        traps: ["Ordered pairs distinguish (X, Y) from (Y, X).", "Do not count pairs passing only one divisor.", "Count every survivor, not only the first one."],
      },
      nodes: nodes(`${template} must satisfy two divisors.`, "Count the intersection of valid-pair sets.", `${answer} pairs survive.`, "All 100 ordered pairs were tested.", `Answer ${answer}.`),
      fingerprint: `pair-count:${template}:${divisors.join(",")}:${validPairs.map(pairText).join("|")}`,
    };
  }
  throw new Error("Could not build two-digit pair-count state");
}
