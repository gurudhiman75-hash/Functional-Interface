import {
  fillSingleDigit,
  validSingleDigits,
} from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import {
  audit,
  completedNumber,
  difficultyFor,
  nodes,
  setText,
} from "./core";
import type {
  RawWave05,
  SingleDigitTarget,
  Wave05MisconceptionId,
  Wave05OptionAudit,
} from "./types";

const DIVISORS = [3n, 4n, 6n, 8n, 9n, 11n, 12n, 18n, 24n, 25n, 36n, 45n, 72n] as const;

function randomTemplate(random: DeterministicRandom): string {
  const length = random.int(3, 7);
  const digits = Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
  const missingIndex = random.int(0, length - 1);
  digits[missingIndex] = "X";
  return digits.join("");
}

function pushUnique(rows: Wave05OptionAudit[], row: Wave05OptionAudit): void {
  if (!rows.some((existing) => existing.text === row.text)) rows.push(row);
}

function invalidDigits(template: string, validDigits: readonly number[]): number[] {
  return Array.from({ length: 10 }, (_unused, digit) => digit)
    .filter((digit) => !(template.startsWith("X") && digit === 0))
    .filter((digit) => !validDigits.includes(digit));
}

function digitOptions(
  random: DeterministicRandom,
  template: string,
  validDigits: number[],
  answerDigit: number,
  direction: "largest" | "smallest",
): Wave05OptionAudit[] {
  const opposite = direction === "largest" ? validDigits[0]! : validDigits[validDigits.length - 1]!;
  const rows: Wave05OptionAudit[] = [
    audit(String(answerDigit), "CORRECT", `${answerDigit} is the ${direction} member of the complete valid set ${setText(validDigits)}.`),
  ];

  if (opposite !== answerDigit) {
    pushUnique(rows, audit(
      String(opposite),
      "SELECTED_OPPOSITE_EXTREMUM",
      `${opposite} is valid, but it is the ${direction === "largest" ? "smallest" : "largest"} valid digit rather than the requested ${direction} one.`,
    ));
  }

  if (validDigits.length !== answerDigit) {
    pushUnique(rows, audit(
      String(validDigits.length),
      "REPORTED_VALID_COUNT",
      `${validDigits.length} is the number of valid digits, not the requested digit value.`,
    ));
  }

  const otherValid = validDigits.filter((digit) => digit !== answerDigit && digit !== opposite);
  if (otherValid.length > 0) {
    const value = random.pick(otherValid);
    pushUnique(rows, audit(
      String(value),
      "SELECTED_NON_EXTREME_VALID_VALUE",
      `${value} satisfies divisibility but is not the requested ${direction} valid digit.`,
    ));
  }

  for (const digit of random.shuffle(invalidDigits(template, validDigits))) {
    if (rows.length >= 4) break;
    pushUnique(rows, audit(
      String(digit),
      template.startsWith("X") && digit === 0 ? "IGNORED_LEADING_ZERO_RULE" : "USED_INVALID_DIGIT",
      `Replacing X by ${digit} gives ${fillSingleDigit(template, digit)}, which is not an admissible divisible completion.`,
    ));
  }

  for (let digit = 0; rows.length < 4 && digit <= 9; digit += 1) {
    if (template.startsWith("X") && digit === 0) continue;
    pushUnique(rows, audit(
      String(digit),
      validDigits.includes(digit) ? "SELECTED_NON_EXTREME_VALID_VALUE" : "USED_INVALID_DIGIT",
      validDigits.includes(digit)
        ? `${digit} is valid but does not satisfy the requested extremum condition.`
        : `${digit} does not produce a number divisible by the stated divisor.`,
    ));
  }

  if (rows.length !== 4) throw new Error("Unable to construct four digit-extremum options");
  return rows;
}

function sumOptions(
  random: DeterministicRandom,
  template: string,
  validDigits: number[],
  answerSum: number,
): Wave05OptionAudit[] {
  const rows: Wave05OptionAudit[] = [
    audit(String(answerSum), "CORRECT", `${setText(validDigits)} has sum ${answerSum}.`),
  ];
  const count = validDigits.length;
  const smallest = validDigits[0]!;
  const largest = validDigits[validDigits.length - 1]!;

  pushUnique(rows, audit(String(count), "REPORTED_VALID_COUNT", `${count} is the size of the valid set, not the sum of its members.`));
  pushUnique(rows, audit(String(largest), "REPORTED_EXTREME_DIGIT", `${largest} is the largest valid digit, not the sum of all valid digits.`));
  pushUnique(rows, audit(String(smallest), "REPORTED_EXTREME_DIGIT", `${smallest} is the smallest valid digit, not the sum of all valid digits.`));

  for (const value of random.shuffle([answerSum - 1, answerSum + 1, answerSum - smallest, answerSum + count])) {
    if (rows.length >= 4) break;
    if (value < 0) continue;
    pushUnique(rows, audit(
      String(value),
      "STOPPED_AT_FIRST_VALID_VALUE",
      `${value} does not equal the sum ${validDigits.join(" + ")} = ${answerSum}.`,
    ));
  }

  if (rows.length !== 4) throw new Error(`Unable to construct four sum options for ${template}`);
  return rows;
}

function completedNumberOptions(
  random: DeterministicRandom,
  template: string,
  validDigits: number[],
  answerDigit: number,
  direction: "greatest" | "smallest",
): Wave05OptionAudit[] {
  const answerNumber = completedNumber(template, answerDigit);
  const oppositeDigit = direction === "greatest" ? validDigits[0]! : validDigits[validDigits.length - 1]!;
  const oppositeNumber = completedNumber(template, oppositeDigit);
  const rows: Wave05OptionAudit[] = [
    audit(answerNumber.toString(), "CORRECT", `${answerNumber} is the ${direction} divisible completion of ${template}.`),
  ];

  if (oppositeNumber !== answerNumber) {
    pushUnique(rows, audit(
      oppositeNumber.toString(),
      "USED_OPPOSITE_COMPLETED_NUMBER",
      `${oppositeNumber} is divisible but is the ${direction === "greatest" ? "smallest" : "greatest"} valid completion.`,
    ));
  }

  pushUnique(rows, audit(
    String(answerDigit),
    "RETURNED_DIGIT_INSTEAD_OF_NUMBER",
    `${answerDigit} is the replacement digit, but the question asks for the completed number ${answerNumber}.`,
  ));

  for (const digit of random.shuffle(invalidDigits(template, validDigits))) {
    if (rows.length >= 4) break;
    const numeral = fillSingleDigit(template, digit);
    if (numeral.startsWith("0")) continue;
    pushUnique(rows, audit(
      numeral,
      "USED_INVALID_DIGIT",
      `${numeral} uses X = ${digit}, which does not satisfy the divisibility condition.`,
    ));
  }

  for (const digit of random.shuffle(validDigits)) {
    if (rows.length >= 4) break;
    if (digit === answerDigit || digit === oppositeDigit) continue;
    const numeral = completedNumber(template, digit).toString();
    pushUnique(rows, audit(
      numeral,
      "SELECTED_NON_EXTREME_VALID_VALUE",
      `${numeral} is divisible but is not the requested ${direction} completion.`,
    ));
  }

  if (rows.length !== 4) throw new Error("Unable to construct four completed-number options");
  return rows;
}

function buildSingleDigit(
  random: DeterministicRandom,
  target: SingleDigitTarget,
): RawWave05 {
  for (let attempt = 0; attempt < 2_500; attempt += 1) {
    const template = randomTemplate(random);
    const divisor = random.pick(DIVISORS);
    const validDigits = validSingleDigits(template, divisor);
    if (validDigits.length < 2 || validDigits.length > 5) continue;

    const smallest = validDigits[0]!;
    const largest = validDigits[validDigits.length - 1]!;
    const sum = validDigits.reduce((total, digit) => total + digit, 0);
    const difficulty = difficultyFor(divisor, template.length, validDigits.length);
    const leadingNote = template.startsWith("X") ? " Because X is leading, 0 is not admissible." : "";

    if (target === "LARGEST_VALID_DIGIT" || target === "SMALLEST_VALID_DIGIT") {
      const direction = target === "LARGEST_VALID_DIGIT" ? "largest" : "smallest";
      const answerDigit = direction === "largest" ? largest : smallest;
      const options = digitOptions(random, template, validDigits, answerDigit, direction);
      const stem = random.pick([
        `What is the ${direction} digit that can replace X in ${template} so that the number is divisible by ${divisor}?`,
        `The number ${template} must be divisible by ${divisor}. Find the ${direction} possible value of X.`,
        `Among all digits that make ${template} exactly divisible by ${divisor}, which is the ${direction}?`,
        `Choose the ${direction} admissible digit X for which ${template} is a multiple of ${divisor}.`,
      ]);
      const completed = completedNumber(template, answerDigit);
      return {
        hiddenState: { kind: "SINGLE_DIGIT_CANDIDATE_SET", template, divisor, validDigits, target, answerDigit },
        difficulty,
        answerSemantic: "DIGIT",
        stem,
        answer: String(answerDigit),
        options,
        explanation: {
          coreConcept: `An extremum question must first recover the complete set of digits satisfying divisibility by ${divisor}.`,
          strategy: `Test the admissible digit domain and then select the ${direction} member of the valid set.`,
          steps: [
            `Replace X by every admissible digit.${leadingNote}`,
            `Exact division gives the valid set ${setText(validDigits)}.`,
            `The ${direction} member of this set is ${answerDigit}; it forms ${completed}.`,
          ],
          shortcut: `Apply the divisibility rule for ${divisor} to reduce the candidate domain, but still check the extremum against the complete valid set.`,
          verification: `${completed} is divisible by ${divisor}, and no valid digit lies ${direction === "largest" ? "above" : "below"} ${answerDigit}.`,
          conclusion: `Therefore, the ${direction} possible value of X is ${answerDigit}.`,
          traps: [
            "Do not stop at the first digit that works.",
            "Do not report how many digits work when the question asks for an extremum.",
            "If X is leading, zero cannot form a number of the stated length.",
          ],
        },
        nodes: nodes(
          `${template} must be divisible by ${divisor}.`,
          "Recover the complete admissible candidate set before selecting an extremum.",
          `The valid digits are ${setText(validDigits)}.`,
          `${answerDigit} forms the divisible number ${completed}.`,
          `${answerDigit} is the ${direction} valid digit.`,
        ),
        fingerprint: `${target}:${template}:${divisor}:${validDigits.join(",")}`,
      };
    }

    if (target === "SUM_VALID_DIGITS") {
      const options = sumOptions(random, template, validDigits, sum);
      const stem = random.pick([
        `Find the sum of all digits that can replace X in ${template} so that the number is divisible by ${divisor}.`,
        `For every digit X that makes ${template} a multiple of ${divisor}, what is the sum of the valid values?`,
        `The number ${template} is required to be divisible by ${divisor}. Determine the sum of all possible digits X.`,
        `What is the sum of the complete valid-digit set for X in ${template}, given divisibility by ${divisor}?`,
      ]);
      return {
        hiddenState: { kind: "SINGLE_DIGIT_CANDIDATE_SET", template, divisor, validDigits, target, answerSum: sum },
        difficulty,
        answerSemantic: "DIGIT_SUM",
        stem,
        answer: String(sum),
        options,
        explanation: {
          coreConcept: "A sum target requires every valid digit, not merely the first or largest successful replacement.",
          strategy: "Enumerate the complete valid set and add its members exactly once.",
          steps: [
            `Test the admissible replacements for X.${leadingNote}`,
            `The valid digits are ${setText(validDigits)}.`,
            `${validDigits.join(" + ")} = ${sum}.`,
          ],
          shortcut: `Use the divisibility rule for ${divisor} to identify the allowed residue pattern, then list only the digits in the admissible domain.`,
          verification: `Direct substitution confirms exactly ${validDigits.length} valid digits, whose sum is ${sum}.`,
          conclusion: `Therefore, the required sum is ${sum}.`,
          traps: [
            "Do not report the number of valid digits instead of their sum.",
            "Do not report only the largest or smallest valid digit.",
            "Do not omit zero when it is valid and X is not leading.",
          ],
        },
        nodes: nodes(
          `${template} must be divisible by ${divisor}.`,
          "Find the complete valid set before aggregation.",
          `The valid digits are ${setText(validDigits)} and their sum is ${sum}.`,
          "Substitution of every listed digit gives remainder 0.",
          `The valid-digit sum is ${sum}.`,
        ),
        fingerprint: `${target}:${template}:${divisor}:${validDigits.join(",")}:${sum}`,
      };
    }

    const direction = target === "GREATEST_COMPLETED_NUMBER" ? "greatest" : "smallest";
    const answerDigit = direction === "greatest" ? largest : smallest;
    const answerNumber = completedNumber(template, answerDigit);
    const options = completedNumberOptions(random, template, validDigits, answerDigit, direction);
    const stem = random.pick([
      `What is the ${direction} number that can be formed from ${template} by replacing X so that it is divisible by ${divisor}?`,
      `Replace X in ${template} to obtain a multiple of ${divisor}. Find the ${direction} possible completed number.`,
      `Among all divisible completions of ${template}, which number is the ${direction}?`,
      `Form the ${direction} number divisible by ${divisor} by choosing a suitable digit for X in ${template}.`,
    ]);
    return {
      hiddenState: { kind: "SINGLE_DIGIT_CANDIDATE_SET", template, divisor, validDigits, target, answerDigit, answerNumber },
      difficulty,
      answerSemantic: "NUMBER",
      stem,
      answer: answerNumber.toString(),
      options,
      explanation: {
        coreConcept: "The answer is the completed numeral, not merely the replacement digit.",
        strategy: `Find every valid replacement and compare the resulting numbers to select the ${direction} completion.`,
        steps: [
          `The admissible valid digits are ${setText(validDigits)}.${leadingNote}`,
          `They form the divisible completions ${validDigits.map((digit) => completedNumber(template, digit)).join(", ")}.`,
          `The ${direction} of these numbers is ${answerNumber}.`,
        ],
        shortcut: `With one fixed digit position, the ${direction} valid replacement also forms the ${direction} completed number.`,
        verification: `${answerNumber} is divisible by ${divisor}, and every other valid completion is ${direction === "greatest" ? "smaller" : "larger"}.`,
        conclusion: `Therefore, the required completed number is ${answerNumber}.`,
        traps: [
          "Do not return only the replacement digit.",
          "Do not choose the opposite valid extremum.",
          "Do not allow a leading zero to shorten the numeral.",
        ],
      },
      nodes: nodes(
        `${template} must be completed as a number divisible by ${divisor}.`,
        "Enumerate valid digits and compare the completed numerals.",
        `Valid completions are ${validDigits.map((digit) => completedNumber(template, digit)).join(", ")}.`,
        `${answerNumber} is divisible by ${divisor}.`,
        `${answerNumber} is the ${direction} valid completion.`,
      ),
      fingerprint: `${target}:${template}:${divisor}:${validDigits.join(",")}:${answerNumber}`,
    };
  }

  throw new Error(`Unable to construct ${target}`);
}

export function largestValidDigit(random: DeterministicRandom): RawWave05 {
  return buildSingleDigit(random, "LARGEST_VALID_DIGIT");
}

export function smallestValidDigit(random: DeterministicRandom): RawWave05 {
  return buildSingleDigit(random, "SMALLEST_VALID_DIGIT");
}

export function sumValidDigits(random: DeterministicRandom): RawWave05 {
  return buildSingleDigit(random, "SUM_VALID_DIGITS");
}

export function greatestCompletedNumber(random: DeterministicRandom): RawWave05 {
  return buildSingleDigit(random, "GREATEST_COMPLETED_NUMBER");
}

export function smallestCompletedNumber(random: DeterministicRandom): RawWave05 {
  return buildSingleDigit(random, "SMALLEST_COMPLETED_NUMBER");
}
