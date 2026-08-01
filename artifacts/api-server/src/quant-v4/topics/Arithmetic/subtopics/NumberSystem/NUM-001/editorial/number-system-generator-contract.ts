// @ts-nocheck
import {
  cleanText,
  correctIndex,
  displayEquation,
  formatNumber,
  isPrime,
  mathNumber,
  mathValue,
  optionValues,
  parseAdjustmentSet,
} from "./simple-teacher-voice-core";

export const NUMBER_SYSTEM_GENERATOR_MODEL =
  "FOUR_TIER_EXAM_READY_TEACHER_VOICE_V3" as const;

export const NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH = "V3.1" as const;

export type NumberSystemStemFamily = "SCENARIO" | "DIRECT" | "IMPERATIVE";

const BANNED_STUDENT_PATTERNS = [
  /divisor polarity selection/i,
  /minimum signed integer adjustment/i,
  /admissible domain/i,
  /exact testing leaves/i,
  /solve mode/i,
  /prototype ancestry/i,
  /candidate set/i,
  /target projection/i,
  /remainder status/i,
  /compute or infer/i,
];

export function titleCaseDifficulty(value: unknown): "Easy" | "Medium" | "Hard" {
  const normalised = String(value ?? "").trim().toLowerCase();
  if (normalised === "easy") return "Easy";
  if (normalised === "hard") return "Hard";
  return "Medium";
}

export function stripStudentOptionLeaks(value: unknown): string {
  return String(value ?? "")
    .replace(/\s*\*\*[✓✔]\*\*\s*/gu, " ")
    .replace(/\s*[✓✔]\s*/gu, " ")
    .replace(/\s*\[x\]\s*/giu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function assertNoStudentJargon(value: unknown, label = "student text"): void {
  const text = String(value ?? "");
  for (const pattern of BANNED_STUDENT_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error(`${label}: banned developer wording ${pattern} found in: ${text}`);
    }
  }
}

function formatMathToken(token: string): string {
  return token
    .trim()
    .replace(/×/g, "\\times")
    .replace(/÷/g, "\\div")
    .replace(/(\d[\d,]*)\^(\d+)/g, (_match, base, exponent) =>
      `${formatNumber(String(base).replaceAll(",", ""))}^{${exponent}}`)
    .replace(/\d[\d,]*/g, (value) =>
      formatNumber(value.replaceAll(",", "")));
}

function formatPlainProseMath(segment: string): string {
  const mathToken = /(?<![A-Za-z])(?:\d[\d,]*(?:\^\d+)?(?:\s*(?:\+|-|×|÷)\s*\d[\d,]*(?:\^\d+)?)+|\d[\d,]*\^\d+|\d[\d,]*)(?![A-Za-z])/gu;
  return segment.replace(mathToken, (token) => `$${formatMathToken(token)}$`);
}

/**
 * Keeps prose outside MathJax while wrapping only the mathematical fragments.
 * Existing MathJax spans are preserved.
 */
export function formatStudentProseMath(value: unknown): string {
  const text = String(value ?? "");
  return text
    .split(/(\$[^$]*\$)/gu)
    .map((segment, index) => index % 2 === 1 ? segment : formatPlainProseMath(segment))
    .join("");
}

/**
 * Formats a learner option without ever wrapping a complete prose sentence in
 * one MathJax span.
 */
export function formatStudentOptionValue(value: unknown): string {
  const text = stripStudentOptionLeaks(value);
  if (/^\$[^$]+\$$/u.test(text)) return normaliseStudentLine(text);
  if (/^[+-]?\d[\d,]*$/u.test(text)) {
    return mathNumber(text.replaceAll(",", ""));
  }
  if (/^[\s{}()[\],+\-×÷=^\d.]+$/u.test(text) && /\d/u.test(text)) {
    return mathValue(
      text
        .replace(/×/g, "\\times")
        .replace(/÷/g, "\\div")
        .replace(/(\d[\d,]*)\^(\d+)/g, "$1^{$2}"),
    );
  }
  return formatStudentProseMath(text);
}

/**
 * Converts display delimiters that were embedded inside a sentence to inline
 * MathJax and merges split multiplication fragments into one clean equation.
 */
export function normaliseStudentLine(value: unknown): string {
  let text = cleanText(value)
    .replace(/minimum signed integer adjustment/gi, "smallest change")
    .replace(/exact testing leaves/gi, "the calculation gives")
    .replace(/admissible domain/gi, "digits from 0 to 9")
    .replace(/\$\$([\s\S]*?)\$\$/gu, (_match, expression) =>
      `$${String(expression).trim()}$`)
    .replace(/\$([^$\n]+)\$\s*×\s*\$([^$\n]+)\$\s*=\s*\$([^$\n]+)\$/gu,
      (_match, left, right, result) =>
        `$${String(left).trim()} \\times ${String(right).trim()} = ${String(result).trim()}$`)
    .replace(/\$([^$\n]+)\$\s*×\s*\$([^$\n]+)\$/gu,
      (_match, left, right) =>
        `$${String(left).trim()} \\times ${String(right).trim()}$`)
    .replace(/\$([^$]*?)×([^$]*?)\$/gu,
      (_match, left, right) =>
        `$${String(left).trim()} \\times ${String(right).trim()}$`);

  text = formatStudentProseMath(text);
  assertNoStudentJargon(text);
  return text;
}

function digitsFromRight(value: bigint | number | string): number[] {
  return [...String(value).replace(/\D/g, "")].reverse().map(Number);
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function joined(values: readonly number[]): string {
  return values.join(" + ") || "0";
}

function exactElevenProof(value: bigint | number | string): string[] {
  const raw = String(value).replace(/\D/g, "");
  const n = BigInt(raw || "0");
  const digits = digitsFromRight(raw);
  const oddPlaces = digits.filter((_digit, index) => index % 2 === 0);
  const evenPlaces = digits.filter((_digit, index) => index % 2 === 1);
  const oddSum = sum(oddPlaces);
  const evenSum = sum(evenPlaces);
  const difference = Math.abs(oddSum - evenSum);
  const quotient = n / 11n;
  const remainder = n % 11n;

  return [
    `**Test divisibility by ${mathNumber(11)}.** Count places from right to left.`,
    `Digits at odd places are ${oddPlaces.map(mathNumber).join(", ")}. ${displayEquation(`${joined(oddPlaces)} = ${oddSum}`)}`,
    `Digits at even places are ${evenPlaces.map(mathNumber).join(", ")}. ${displayEquation(`${joined(evenPlaces)} = ${evenSum}`)}`,
    `Find the difference. ${displayEquation(`|${oddSum} - ${evenSum}| = ${difference}`)} ${mathNumber(difference)} ${difference % 11 === 0 ? "is" : "is not"} ${difference === 0 ? "zero" : `a multiple of ${mathNumber(11)}`}.`,
    remainder === 0n
      ? `Verify the exact quotient. ${displayEquation(`${formatNumber(n)} \\div 11 = ${formatNumber(quotient)}`)} The remainder is ${mathNumber(0)}.`
      : `Verify the result. ${displayEquation(`${formatNumber(n)} = 11 \\times ${formatNumber(quotient)} + ${remainder}`)} The remainder is ${mathNumber(remainder)}.`,
  ];
}

function digitSumProof(value: bigint, divisor: number): string {
  const digits = [...String(value)].map(Number);
  const total = sum(digits);
  return `${displayEquation(`${joined(digits)} = ${total}`)} ${mathNumber(total)} ${total % divisor === 0 ? "is" : "is not"} a multiple of ${mathNumber(divisor)}.`;
}

function suffixProof(value: bigint, divisor: number, digits: number): string {
  const raw = String(value);
  const suffixText = raw.slice(-digits);
  const suffix = Number(suffixText);
  const quotient = Math.floor(suffix / divisor);
  const remainder = suffix % divisor;
  return `${digits === 2 ? "Use the last two digits" : "Use the last three digits"}: ${mathNumber(suffix)}. ${displayEquation(`${suffix} = ${divisor} \\times ${quotient} + ${remainder}`)} The remainder is ${mathNumber(remainder)}.`;
}

function directOptionProof(value: bigint, divisor: number): string[] {
  if (divisor === 11) return exactElevenProof(value);

  if (value % 2n === 1n && divisor % 2 === 0) {
    return [
      `**Test ${mathNumber(divisor)} using parity.** ${mathNumber(value)} ends in an odd digit, so it is an odd number. Every multiple of the even divisor ${mathNumber(divisor)} is even. Therefore, an odd number cannot be divided exactly by ${mathNumber(divisor)}.`,
    ];
  }

  if (divisor === 3 || divisor === 9) {
    return [
      `**Test ${mathNumber(divisor)} using the digit-sum rule.** ${digitSumProof(value, divisor)}`,
    ];
  }

  if (divisor === 5) {
    const lastDigit = Number(String(value).at(-1));
    return [
      `**Test ${mathNumber(5)} using the last digit.** The last digit is ${mathNumber(lastDigit)}, not ${mathNumber(0)} or ${mathNumber(5)}, so the number is not divisible by ${mathNumber(5)}.`,
    ];
  }

  if (divisor === 25) {
    const lastTwo = Number(String(value).slice(-2));
    return [
      `**Test ${mathNumber(25)} using the last two digits.** They form ${mathNumber(lastTwo)}. A multiple of ${mathNumber(25)} must end in ${mathValue("00, 25, 50, 75")}.`,
    ];
  }

  if (divisor === 4) return [`**Test ${mathNumber(4)}.** ${suffixProof(value, divisor, 2)}`];
  if (divisor === 8) return [`**Test ${mathNumber(8)}.** ${suffixProof(value, divisor, 3)}`];

  const d = BigInt(divisor);
  const quotient = value / d;
  const remainder = value % d;
  return [
    remainder === 0n
      ? `**Test ${mathNumber(divisor)} by direct division.** ${displayEquation(`${formatNumber(value)} \\div ${divisor} = ${formatNumber(quotient)}`)} The remainder is ${mathNumber(0)}.`
      : `**Test ${mathNumber(divisor)} by direct division.** ${displayEquation(`${formatNumber(value)} = ${divisor} \\times ${formatNumber(quotient)} + ${remainder}`)} The remainder is ${mathNumber(remainder)}, so the division is not exact.`,
  ];
}

function buildDirectDivisibilityExplanation(row: any, base: any): any {
  const state = row.question.hiddenState;
  const n = BigInt(state.number);
  const answer = Number(row.question.answer);
  const requestedDivisible = state.requestedPolarity === "DIVISIBLE";
  const answerProof = directOptionProof(n, answer);
  const wrongOptions = state.divisorOptions.filter((value: unknown) => Number(value) !== answer);

  return {
    ...base,
    mainRule: [
      requestedDivisible
        ? `A number divides cleanly only when the remainder is ${mathNumber(0)}. Use a quick divisibility rule before doing long division.`
        : `A number is not exactly divisible when the division leaves a non-zero remainder. Use the shortest rule for each option.`,
    ],
    steps: [
      ...answerProof,
      ...wrongOptions.flatMap((divisor: unknown) => directOptionProof(n, Number(divisor))),
      `Therefore, the correct choice is ${mathNumber(answer)}.`,
    ],
    speedTrick: [
      n % 2n === 1n
        ? `The number is odd, so cross out every even divisor immediately. Then test ${mathNumber(11)} with the two alternating digit sums before trying direct division.`
        : `Use this order: parity, last digit, digit sum, last two or three digits, then direct division only for the options left.`,
    ],
  };
}

function findPrimeAdjustmentTarget(row: any): number {
  const state = row.question.hiddenState ?? {};
  for (const key of ["target", "value", "number", "base", "n"]) {
    const candidate = Number(state[key]);
    if (Number.isInteger(candidate)) return candidate;
  }
  const stemNumbers = [...String(row.question.stem).matchAll(/\d[\d,]*/g)]
    .map((match) => Number(match[0].replaceAll(",", "")))
    .filter(Number.isInteger);
  if (stemNumbers.length === 0) throw new Error("NUM-QL-045: target number not found");
  return stemNumbers.at(-1)!;
}

function buildPrimeAdjustmentExplanation(row: any, base: any): any {
  const target = findPrimeAdjustmentTarget(row);
  const answerText = String(row.question.canonicalAnswer ?? optionValues(row)[correctIndex(row)]);
  const adjustments = parseAdjustmentSet(answerText);
  const minimumDistance = Math.min(...adjustments.map((value: number) => Math.abs(value)));
  const steps: string[] = [];

  for (let distance = 1; distance <= minimumDistance; distance += 1) {
    const lower = target - distance;
    const upper = target + distance;
    steps.push(`Test equal distance ${mathValue(`d = ${distance}`)} on both sides.`);
    steps.push(`${displayEquation(`${target} - ${distance} = ${lower}`)} ${mathNumber(lower)} is ${isPrime(lower) ? "prime" : "composite"}.`);
    steps.push(`${displayEquation(`${target} + ${distance} = ${upper}`)} ${mathNumber(upper)} is ${isPrime(upper) ? "prime" : "composite"}.`);
  }

  const validAdjustments = [-minimumDistance, minimumDistance]
    .filter((change) => isPrime(target + change));

  steps.push(
    validAdjustments.length === 2
      ? `Both directions reach a prime at the same smallest distance. Keep both changes: ${mathValue(`{${validAdjustments.map((value) => value > 0 ? `+${value}` : value).join(", ")}}`)}.`
      : `Only one direction reaches a prime at the smallest distance. Keep ${mathValue(validAdjustments[0] > 0 ? `+${validAdjustments[0]}` : validAdjustments[0])}.`,
  );

  return {
    ...base,
    mainRule: [
      `To make a number prime with the smallest change, test the same distance below and above it. Keep both changes when both sides give a prime at the first successful distance.`,
    ],
    steps,
    speedTrick: [
      `Search symmetrically: ${mathValue("n - 1")}, ${mathValue("n + 1")}; then ${mathValue("n - 2")}, ${mathValue("n + 2")}, and stop as soon as a prime appears.`,
    ],
  };
}

export function applyNumberSystemGeneratorContract(row: any, explanation: any): any {
  let transformed = explanation;
  if (row.checkpoint === "NUM-CP-003" && row.question.hiddenState?.kind === "DIRECT_DIVISIBILITY") {
    transformed = buildDirectDivisibilityExplanation(row, explanation);
  }
  if (row.allocation?.qlId === "NUM-QL-045") {
    transformed = buildPrimeAdjustmentExplanation(row, transformed);
  }

  const mainRule = transformed.mainRule.filter(Boolean).slice(0, 2).map(normaliseStudentLine);
  const steps = transformed.steps.filter(Boolean).map(normaliseStudentLine);
  const speedTrick = transformed.speedTrick.filter(Boolean).slice(0, 2).map(normaliseStudentLine);

  if (mainRule.length === 0 || steps.length === 0 || speedTrick.length === 0) {
    throw new Error(`${row.allocation?.qlId}: incomplete four-tier explanation`);
  }

  return { mainRule, steps, speedTrick };
}

function lowerFirst(value: string): string {
  return value ? `${value[0]!.toLowerCase()}${value.slice(1)}` : value;
}

function statementForm(value: string): string {
  return value.replace(/\?$/u, ".");
}

function imperativeStem(stem: string): string {
  let match = /^Which of the following co-prime statements about (.+) is correct\?$/iu.exec(stem);
  if (match) return `Identify the correct co-prime statement about ${match[1]}.`;

  match = /^Which of the following prime numbers divides (.+) exactly\?$/iu.exec(stem);
  if (match) return `Identify the prime number that divides ${match[1]} exactly.`;

  match = /^Which of the following statements about (.+) is correct\?$/iu.exec(stem);
  if (match) return `Identify the correct statement about ${match[1]}.`;

  match = /^Which of the following numbers (.+)\?$/iu.exec(stem);
  if (match) return `Identify the number that ${statementForm(lowerFirst(match[1]))}`;

  if (/^Which of the following /iu.test(stem)) {
    return `Select the correct answer: ${stem}`;
  }

  return stem
    .replace(/^Which set /i, "Choose the set that ")
    .replace(/^What is /i, "Find ")
    .replace(/^How many /i, "Count how many ")
    .replace(/^Can /i, "Determine whether ")
    .replace(/^Select /i, "Choose ");
}

export function buildExamReadyStem(
  row: any,
  reviewIndex: number,
): { family: NumberSystemStemFamily; stem: string } {
  const baseStem = cleanText(row.question.stem);
  const slot = reviewIndex % 10;
  let family: NumberSystemStemFamily;
  let stem: string;

  if (slot <= 3) {
    const openings = [
      "In a number-system test",
      "During a quick number check",
      "In a competitive-exam practice set",
      "While comparing the given numbers",
    ];
    family = "SCENARIO";
    stem = `${openings[reviewIndex % openings.length]}, ${lowerFirst(baseStem)}`;
  } else if (slot <= 6) {
    family = "DIRECT";
    stem = baseStem;
  } else {
    family = "IMPERATIVE";
    const imperative = imperativeStem(baseStem);
    stem = imperative === baseStem
      ? `Solve the following: ${lowerFirst(baseStem)}`
      : imperative;
  }

  const polished = formatStudentProseMath(stem)
    .replace(/Choose the option that co-prime statements about/giu,
      "Which of the following co-prime statements about")
    .replace(/Choose the option that prime numbers divides/giu,
      "Which of the following prime numbers divides");

  return { family, stem: polished };
}
