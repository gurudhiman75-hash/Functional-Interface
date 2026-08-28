import { createHash } from "node:crypto";

import type {
  NumCp013Difficulty,
  NumCp013Option,
  NumCp013Wave01Package,
  NumCp013Wave01PrototypeId,
} from "./types.ts";

class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 0x1_0000_0000;
  }

  int(min: number, max: number) {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)]!;
  }
}

type Candidate = Readonly<{ value: string; misconceptionId: string }>;
type ColumnAddTrace = Readonly<{
  columnFromRight: number;
  leftDigit: number;
  rightDigit: number;
  carryIn: number;
  total: number;
  writtenDigit: number;
  carryOut: number;
}>;
type ColumnSubtractTrace = Readonly<{
  columnFromRight: number;
  topDigitBeforeBorrow: number;
  bottomDigit: number;
  borrowIn: number;
  adjustedTopDigit: number;
  writtenDigit: number;
  borrowOut: number;
}>;

const SOURCE_ANCESTRY = Object.freeze([
  "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-013",
  "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY:NUM-CP-013",
  "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
]);

const LIFECYCLE = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE01_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

function assertSeed(seed: number) {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("NUM-CP-013 Wave01 seed must be a positive integer.");
}

function notation(digits: string, base: number) {
  return `(${digits})_${base}`;
}

function digitString(digits: readonly number[]) {
  return digits.join("");
}

function positionalValue(digits: readonly number[], base: number) {
  return digits.reduce((value, digit) => value * base + digit, 0);
}

function toBaseDigits(value: number, base: number) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("Base conversion expects a non-negative safe integer.");
  if (!Number.isInteger(base) || base < 2 || base > 10) throw new Error("Wave01 supports bases 2..10.");
  if (value === 0) return [0];
  const digits: number[] = [];
  let remaining = value;
  while (remaining > 0) {
    digits.push(remaining % base);
    remaining = Math.floor(remaining / base);
  }
  return digits.reverse();
}

function repeatedDivisionTrace(value: number, base: number) {
  const steps: Array<Readonly<{ dividend: number; quotient: number; remainder: number }>> = [];
  let remaining = value;
  while (remaining > 0) {
    const quotient = Math.floor(remaining / base);
    const remainder = remaining % base;
    steps.push(Object.freeze({ dividend: remaining, quotient, remainder }));
    remaining = quotient;
  }
  return Object.freeze(steps);
}

function evaluateInBase(digitText: string, base: number) {
  if (!/^\d+$/u.test(digitText)) throw new Error(`Unsupported Wave01 numeral ${digitText}.`);
  const digits = [...digitText].map(Number);
  if (digits[0] === 0 && digits.length > 1) throw new Error("Leading zero is not valid for an integer numeral in Wave01.");
  if (digits.some((digit) => digit >= base)) throw new Error(`Digit invalid in base ${base}.`);
  return positionalValue(digits, base);
}

function alternateDecimalToBase(value: number, base: number) {
  if (value === 0) return "0";
  let largestPower = 1;
  while (largestPower * base <= value) largestPower *= base;
  const digits: number[] = [];
  let remainder = value;
  for (let place = largestPower; place >= 1; place = Math.floor(place / base)) {
    const digit = Math.floor(remainder / place);
    digits.push(digit);
    remainder -= digit * place;
    if (place === 1) break;
  }
  return digitString(digits);
}

function shuffle<T>(items: readonly T[], rng: Rng) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function buildOptions(correct: string, distractors: readonly Candidate[], rng: Rng) {
  const options: NumCp013Option[] = [{ value: correct, isCorrect: true, misconceptionId: "CORRECT" }];
  const seen = new Set([correct]);
  for (const candidate of distractors) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    options.push({ value: candidate.value, isCorrect: false, misconceptionId: candidate.misconceptionId });
    if (options.length === 4) break;
  }
  if (options.length !== 4) throw new Error(`NUM-CP-013 insufficient distinct distractors for ${correct}.`);
  const shuffled = Object.freeze(shuffle(options, rng).map((option) => Object.freeze(option)));
  const correctIndex = shuffled.findIndex((option) => option.isCorrect);
  return { options: shuffled, correctIndex };
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }))
    .digest("hex");
}

function basePackage(input: Readonly<{
  prototypeId: NumCp013Wave01PrototypeId;
  seed: number;
  difficulty: NumCp013Difficulty;
  taskKind: string;
  answerSemantic: string;
  representation: string;
  stem: string;
  options: readonly NumCp013Option[];
  correctIndex: number;
  canonicalAnswer: string;
  verifierAnswer: string;
  hiddenState: Readonly<Record<string, unknown>>;
  fullDerivation: readonly string[];
  examShortcut: readonly string[];
}>) : NumCp013Wave01Package {
  if (input.canonicalAnswer !== input.verifierAnswer) {
    throw new Error(`${input.prototypeId}: canonical/verifier disagreement (${input.canonicalAnswer} vs ${input.verifierAnswer}).`);
  }
  if (input.options[input.correctIndex]?.value !== input.canonicalAnswer || input.options[input.correctIndex]?.isCorrect !== true) {
    throw new Error(`${input.prototypeId}: answer binding drift.`);
  }
  return Object.freeze({
    packageId: "NUM-002" as const,
    checkpointId: "NUM-CP-013" as const,
    temporaryPrototypeId: input.prototypeId,
    seed: input.seed,
    locale: "en-IN" as const,
    difficulty: input.difficulty,
    taskKind: input.taskKind,
    answerSemantic: input.answerSemantic,
    representation: input.representation,
    stem: input.stem,
    options: input.options,
    correctIndex: input.correctIndex,
    canonicalAnswer: input.canonicalAnswer,
    verifierAnswer: input.verifierAnswer,
    hiddenState: Object.freeze({ ...input.hiddenState }),
    mathematicalFingerprint: fingerprint(input.prototypeId, input.hiddenState),
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
      fullDerivation: Object.freeze([...input.fullDerivation]),
      examShortcut: Object.freeze([...input.examShortcut]),
      finalAnswer: input.canonicalAnswer,
    }),
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: Object.freeze([input.prototypeId, "NUM-CP-013-WAVE01"]),
    lifecycle: LIFECYCLE,
  });
}

function randomDigits(rng: Rng, base: number, length: number) {
  return Object.freeze([
    rng.int(1, base - 1),
    ...Array.from({ length: length - 1 }, () => rng.int(0, base - 1)),
  ]);
}

function generateP001(seed: number) {
  const rng = new Rng(seed * 97 + 1);
  const base = rng.int(3, 9);
  const digits = randomDigits(rng, base, rng.int(3, 4));
  const text = digitString(digits);
  const canonical = positionalValue(digits, base);
  const decimalMisread = Number(text);
  const wrongBaseValue = positionalValue(digits, base + 1);
  const omittedHighest = positionalValue(digits.slice(1), base);
  const digitSum = digits.reduce((sum, digit) => sum + digit, 0);
  const { options, correctIndex } = buildOptions(String(canonical), [
    { value: String(decimalMisread), misconceptionId: "READ_BASE_NUMERAL_AS_DECIMAL" },
    { value: String(wrongBaseValue), misconceptionId: "USE_BASE_PLUS_ONE" },
    { value: String(omittedHighest), misconceptionId: "OMIT_HIGHEST_PLACE" },
    { value: String(digitSum), misconceptionId: "ADD_DIGITS_ONLY" },
  ], rng);
  const powers = digits.map((_, index) => digits.length - 1 - index);
  const terms = digits.map((digit, index) => `${digit} × ${base}^${powers[index]}`);
  const evaluatedTerms = digits.map((digit, index) => digit * base ** powers[index]!);
  const verifier = evaluateInBase(text, base);
  const stems = [
    `Find the decimal value of ${notation(text, base)}.`,
    `Convert ${notation(text, base)} to base 10.`,
    `What integer does ${notation(text, base)} represent in decimal notation?`,
  ] as const;
  return basePackage({
    prototypeId: "NUM-CP013-PROT-001",
    seed,
    difficulty: digits.length === 4 ? "MEDIUM" : "EASY",
    taskKind: "BASE_TO_DECIMAL",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "POSITIONAL_EXPANSION",
    stem: rng.pick(stems),
    options,
    correctIndex,
    canonicalAnswer: String(canonical),
    verifierAnswer: String(verifier),
    hiddenState: { base, digits, numeral: text, powers, canonical },
    fullDerivation: [
      `In base ${base}, each place is a power of ${base}; from left to right the powers here are ${powers.join(", ")}.`,
      `${notation(text, base)} = ${terms.join(" + ")}.`,
      ...digits.map((digit, index) => `${digit} × ${base}^${powers[index]} = ${evaluatedTerms[index]}.`),
      `${evaluatedTerms.join(" + ")} = ${canonical}.`,
      `Therefore the decimal value is ${canonical}.`,
    ],
    examShortcut: [
      `Use Horner form and avoid writing all powers: start with ${digits[0]}.`,
      ...digits.slice(1).map((digit, index) => `After the next digit ${digit}: ${positionalValue(digits.slice(0, index + 2), base)}.`),
      `The final Horner value is ${canonical}.`,
    ],
  });
}

function generateP002(seed: number) {
  const rng = new Rng(seed * 101 + 2);
  const base = rng.int(2, 9);
  const decimal = rng.int(80, 2500);
  const digits = toBaseDigits(decimal, base);
  const text = digitString(digits);
  const canonical = notation(text, base);
  const trace = repeatedDivisionTrace(decimal, base);
  const verifierText = alternateDecimalToBase(decimal, base);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(digitString(toBaseDigits(decimal + 1, base)), base), misconceptionId: "OFF_BY_ONE_DECIMAL" },
    { value: notation(digitString(toBaseDigits(decimal - 1, base)), base), misconceptionId: "STOP_DIVISION_EARLY" },
    { value: notation(digitString(toBaseDigits(decimal + base, base)), base), misconceptionId: "MISPLACE_FINAL_QUOTIENT" },
    { value: notation([...text].reverse().join(""), base), misconceptionId: "READ_REMAINDERS_TOP_TO_BOTTOM" },
  ], rng);
  const stems = [
    `Convert the decimal integer ${decimal} to base ${base}.`,
    `Write ${decimal} in base ${base}.`,
    `Which base-${base} numeral is equal to the decimal number ${decimal}?`,
  ] as const;
  let largestPower = 1;
  while (largestPower * base <= decimal) largestPower *= base;
  return basePackage({
    prototypeId: "NUM-CP013-PROT-002",
    seed,
    difficulty: digits.length >= 5 ? "MEDIUM" : "EASY",
    taskKind: "DECIMAL_TO_BASE",
    answerSemantic: "BASE_NUMERAL",
    representation: "REPEATED_DIVISION_LADDER",
    stem: rng.pick(stems),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: notation(verifierText, base),
    hiddenState: { base, decimal, digits, numeral: text, divisionTrace: trace },
    fullDerivation: [
      `To convert an integer from decimal to base ${base}, repeatedly divide by ${base} and record each remainder.`,
      ...trace.map((step) => `${step.dividend} ÷ ${base} = ${step.quotient} remainder ${step.remainder}.`),
      `The remainders are read from the last division upward: ${[...trace].reverse().map((step) => step.remainder).join(", ")}.`,
      `So ${decimal} = ${canonical}.`,
    ],
    examShortcut: [
      `An alternative is place-value filling. The largest power of ${base} not exceeding ${decimal} is ${largestPower}.`,
      `Choose each digit greedily from the largest place downward; this gives ${text}.`,
      `Hence the answer is ${canonical}.`,
    ],
  });
}

function generateP003(seed: number) {
  const rng = new Rng(seed * 103 + 3);
  const sourceBase = rng.int(3, 9);
  let targetBase = rng.int(2, 9);
  if (targetBase === sourceBase) targetBase = targetBase === 9 ? 2 : targetBase + 1;
  const sourceDigits = randomDigits(rng, sourceBase, rng.int(3, 4));
  const sourceText = digitString(sourceDigits);
  const decimal = positionalValue(sourceDigits, sourceBase);
  const targetText = digitString(toBaseDigits(decimal, targetBase));
  const canonical = notation(targetText, targetBase);
  const verifierDecimal = evaluateInBase(sourceText, sourceBase);
  const verifier = notation(alternateDecimalToBase(verifierDecimal, targetBase), targetBase);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(digitString(toBaseDigits(decimal + 1, targetBase)), targetBase), misconceptionId: "DECIMAL_BRIDGE_OFF_BY_ONE" },
    { value: notation(digitString(toBaseDigits(Math.max(1, decimal - 1), targetBase)), targetBase), misconceptionId: "DROP_SOURCE_PLACE" },
    { value: notation(sourceText, targetBase), misconceptionId: "RELABEL_DIGITS_WITHOUT_CONVERSION" },
    { value: notation(digitString(toBaseDigits(decimal + targetBase, targetBase)), targetBase), misconceptionId: "TARGET_PLACE_SHIFT" },
  ], rng);
  const sourcePowers = sourceDigits.map((_, index) => sourceDigits.length - 1 - index);
  const sourceTerms = sourceDigits.map((digit, index) => digit * sourceBase ** sourcePowers[index]!);
  const trace = repeatedDivisionTrace(decimal, targetBase);
  return basePackage({
    prototypeId: "NUM-CP013-PROT-003",
    seed,
    difficulty: "MEDIUM",
    taskKind: "NON_DECIMAL_TO_NON_DECIMAL",
    answerSemantic: "BASE_NUMERAL",
    representation: "TWO_STAGE_BASE_CONVERSION",
    stem: rng.pick([
      `Convert ${notation(sourceText, sourceBase)} to base ${targetBase}.`,
      `Express ${notation(sourceText, sourceBase)} as a base-${targetBase} numeral.`,
      `Which base-${targetBase} numeral has the same value as ${notation(sourceText, sourceBase)}?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    hiddenState: { sourceBase, targetBase, sourceDigits, sourceText, decimal, targetText, divisionTrace: trace },
    fullDerivation: [
      `First convert the source numeral to decimal because its place values are powers of ${sourceBase}.`,
      `${notation(sourceText, sourceBase)} = ${sourceDigits.map((digit, index) => `${digit} × ${sourceBase}^${sourcePowers[index]}`).join(" + ")}.`,
      `${sourceTerms.join(" + ")} = ${decimal}.`,
      `Now repeatedly divide ${decimal} by the target base ${targetBase}.`,
      ...trace.map((step) => `${step.dividend} ÷ ${targetBase} = ${step.quotient} remainder ${step.remainder}.`),
      `Reading the target-base remainders upward gives ${targetText}.`,
      `Therefore ${notation(sourceText, sourceBase)} = ${canonical}.`,
    ],
    examShortcut: [
      `Evaluate the source numeral by Horner form instead of writing powers: ${sourceDigits.reduce<string[]>((lines, digit, index) => index === 0 ? [`start ${digit}`] : [...lines, `then ×${sourceBase} + ${digit} → ${positionalValue(sourceDigits.slice(0, index + 1), sourceBase)}`], []).join("; ")}.`,
      `Then perform the standard repeated-division conversion to base ${targetBase}.`,
    ],
  });
}

function generateP004(seed: number) {
  const rng = new Rng(seed * 107 + 4);
  const maxDigit = rng.int(2, 8);
  const length = rng.int(3, 5);
  const digits = [rng.int(1, maxDigit), ...Array.from({ length: length - 2 }, () => rng.int(0, maxDigit)), maxDigit];
  shuffle(digits, rng);
  if (digits[0] === 0) {
    const swapIndex = digits.findIndex((digit) => digit > 0);
    [digits[0], digits[swapIndex]] = [digits[swapIndex]!, digits[0]!];
  }
  if (!digits.includes(maxDigit)) digits[digits.length - 1] = maxDigit;
  const text = digitString(digits);
  const canonical = maxDigit + 1;
  const validBases = Array.from({ length: 12 - canonical + 1 }, (_, index) => canonical + index);
  const verifier = validBases[0]!;
  const { options, correctIndex } = buildOptions(String(canonical), [
    { value: String(maxDigit), misconceptionId: "ALLOW_DIGIT_EQUAL_TO_BASE" },
    { value: String(canonical + 1), misconceptionId: "ADD_TWO_TO_LARGEST_DIGIT" },
    { value: "10", misconceptionId: "ASSUME_DECIMAL_BASE" },
    { value: String(Math.max(2, canonical - 2)), misconceptionId: "IGNORE_LARGEST_DIGIT" },
  ], rng);
  return basePackage({
    prototypeId: "NUM-CP013-PROT-004",
    seed,
    difficulty: "EASY",
    taskKind: "MINIMUM_VALID_BASE",
    answerSemantic: "BASE",
    representation: "DIGIT_VALIDITY_SCAN",
    stem: rng.pick([
      `What is the minimum possible base of the numeral (${text})_b?`,
      `Find the least integer base b for which (${text})_b is a valid numeral.`,
      `The digits ${text} are written as one numeral in base b. What is the smallest possible value of b?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: String(canonical),
    verifierAnswer: String(verifier),
    hiddenState: { digits, numeral: text, maxDigit, validBases, correctBase: canonical },
    fullDerivation: [
      `In base b, every digit must satisfy 0 ≤ digit < b.`,
      `The largest digit appearing in ${text} is ${maxDigit}.`,
      `Therefore b must be strictly greater than ${maxDigit}; b = ${maxDigit} is invalid because a digit cannot equal the base.`,
      `The smallest integer greater than ${maxDigit} is ${maxDigit} + 1 = ${canonical}.`,
      `Hence the minimum possible base is ${canonical}.`,
    ],
    examShortcut: [
      `Scan only the largest digit. Minimum base = largest digit + 1 = ${maxDigit} + 1 = ${canonical}.`,
    ],
  });
}

function generateP005(seed: number) {
  const rng = new Rng(seed * 109 + 5);
  const base = rng.int(5, 9);
  const a = rng.int(1, base - 1);
  const x = rng.int(0, base - 1);
  const c = rng.int(0, base - 1);
  const decimal = a * base ** 2 + x * base + c;
  const otherPart = a * base ** 2 + c;
  const derivedNumerator = decimal - otherPart;
  const candidates = Array.from({ length: base }, (_, digit) => ({ digit, value: a * base ** 2 + digit * base + c }));
  const valid = candidates.filter((candidate) => candidate.value === decimal);
  if (valid.length !== 1) throw new Error("NUM-CP013-PROT-005 failed to construct a unique digit state.");
  const { options, correctIndex } = buildOptions(String(x), [
    { value: String((x + 1) % base), misconceptionId: "OFF_BY_ONE_DIGIT" },
    { value: String((x + base - 1) % base), misconceptionId: "DROP_ONE_BASE_GROUP" },
    { value: String((base - x) % base), misconceptionId: "USE_COMPLEMENT_DIGIT" },
    { value: String((x + 2) % base), misconceptionId: "WRONG_POSITION_COEFFICIENT" },
  ], rng);
  return basePackage({
    prototypeId: "NUM-CP013-PROT-005",
    seed,
    difficulty: "MEDIUM",
    taskKind: "UNKNOWN_DIGIT_IN_NUMERAL_EQUALITY",
    answerSemantic: "DIGIT",
    representation: "POSITIONAL_EQUATION",
    stem: rng.pick([
      `If (${a}x${c})_${base} = ${decimal} in decimal, find the digit x.`,
      `The base-${base} numeral (${a}x${c})_${base} has decimal value ${decimal}. What is x?`,
      `Find x if ${a} × ${base}^2 + x × ${base} + ${c} = ${decimal}, where x is a base-${base} digit.`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: String(x),
    verifierAnswer: String(valid[0]!.digit),
    hiddenState: { base, a, x, c, decimal, otherPart, derivedNumerator, candidates },
    fullDerivation: [
      `The numeral (${a}x${c})_${base} means ${a} × ${base}^2 + x × ${base}^1 + ${c} × ${base}^0.`,
      `${base}^2 = ${base ** 2} and ${base}^0 = 1, so the equation is ${a * base ** 2} + ${base}x + ${c} = ${decimal}.`,
      `Combine the known terms: ${a * base ** 2} + ${c} = ${otherPart}.`,
      `So ${base}x = ${decimal} − ${otherPart} = ${derivedNumerator}.`,
      `Divide both sides by ${base}: x = ${derivedNumerator} ÷ ${base} = ${x}.`,
      `Since ${x} is between 0 and ${base - 1}, it is a valid base-${base} digit.`,
    ],
    examShortcut: [
      `Subtract the contribution of the known digits first: ${decimal} − (${a} × ${base ** 2} + ${c}) = ${derivedNumerator}.`,
      `The x-place is worth ${base}, so x = ${derivedNumerator} ÷ ${base} = ${x}.`,
    ],
  });
}

function generateP006(seed: number) {
  const rng = new Rng(seed * 113 + 6);
  const base = rng.int(4, 10);
  const digits = randomDigits(rng, base, 3);
  const [a, d, c] = digits;
  const text = digitString(digits);
  const decimal = positionalValue(digits, base);
  const minBase = Math.max(...digits) + 1;
  const candidates = Array.from({ length: 13 - minBase }, (_, index) => minBase + index)
    .map((candidateBase) => ({ base: candidateBase, value: positionalValue(digits, candidateBase) }));
  const valid = candidates.filter((candidate) => candidate.value === decimal);
  if (valid.length !== 1 || valid[0]!.base !== base) throw new Error("NUM-CP013-PROT-006 unknown-base state is not unique.");
  const distractorBases = [base - 1, base + 1, minBase, base + 2, base - 2]
    .filter((candidate) => candidate >= minBase && candidate <= 12 && candidate !== base)
    .map((candidate, index) => ({ value: String(candidate), misconceptionId: ["USE_BASE_MINUS_ONE", "USE_BASE_PLUS_ONE", "USE_MINIMUM_BASE_ONLY", "ARITHMETIC_TRIAL_ERROR", "IGNORE_MIDDLE_TERM"][index] ?? "WRONG_BASE" }));
  while (distractorBases.length < 3) {
    const candidate = minBase + distractorBases.length;
    if (candidate !== base && candidate <= 12) distractorBases.push({ value: String(candidate), misconceptionId: "WRONG_VALID_BASE" });
    else distractorBases.push({ value: String(Math.min(12, base + distractorBases.length + 1)), misconceptionId: "WRONG_VALID_BASE" });
  }
  const { options, correctIndex } = buildOptions(String(base), distractorBases, rng);
  return basePackage({
    prototypeId: "NUM-CP013-PROT-006",
    seed,
    difficulty: "HARD",
    taskKind: "UNKNOWN_BASE_FROM_DECIMAL_EQUALITY",
    answerSemantic: "BASE",
    representation: "BASE_CANDIDATE_EQUATION",
    stem: rng.pick([
      `If (${text})_b = ${decimal} in decimal, find b.`,
      `The numeral (${text})_b represents the decimal integer ${decimal}. What is the base b?`,
      `Find the integer base b if ${a}b^2 + ${d}b + ${c} = ${decimal}.`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: String(base),
    verifierAnswer: String(valid[0]!.base),
    hiddenState: { digits, numeral: text, decimal, base, minBase, candidates },
    fullDerivation: [
      `For the three-digit numeral (${text})_b, the place values are b^2, b and 1.`,
      `Therefore (${text})_b = ${a}b^2 + ${d}b + ${c}.`,
      `The largest digit is ${Math.max(...digits)}, so a valid base must satisfy b ≥ ${minBase}.`,
      `Substitute the generated candidate b = ${base}: ${a} × ${base}^2 + ${d} × ${base} + ${c}.`,
      `${base}^2 = ${base ** 2}, so this becomes ${a * base ** 2} + ${d * base} + ${c} = ${decimal}.`,
      `Thus b = ${base} satisfies the equality.`,
      `For b ≥ ${minBase}, the expression ${a}b^2 + ${d}b + ${c} strictly increases because ${a} > 0 and all digits are non-negative; therefore no second valid base can give the same decimal value.`,
      `Hence b = ${base}.`,
    ],
    examShortcut: [
      `Minimum possible base is ${minBase}. Test nearby valid bases; at b = ${base}, the expansion gives exactly ${decimal}.`,
      `Because a positive three-digit numeral increases with the base, that hit is unique.`,
    ],
  });
}

function addInBase(left: readonly number[], right: readonly number[], base: number) {
  const out: number[] = [];
  const trace: ColumnAddTrace[] = [];
  let i = left.length - 1;
  let j = right.length - 1;
  let carry = 0;
  let column = 0;
  while (i >= 0 || j >= 0 || carry > 0) {
    const leftDigit = i >= 0 ? left[i]! : 0;
    const rightDigit = j >= 0 ? right[j]! : 0;
    const carryIn = carry;
    const total = leftDigit + rightDigit + carryIn;
    const writtenDigit = total % base;
    carry = Math.floor(total / base);
    out.push(writtenDigit);
    trace.push(Object.freeze({ columnFromRight: column, leftDigit, rightDigit, carryIn, total, writtenDigit, carryOut: carry }));
    i -= 1;
    j -= 1;
    column += 1;
  }
  return { digits: Object.freeze(out.reverse()), trace: Object.freeze(trace) };
}

function generateP007(seed: number) {
  const rng = new Rng(seed * 127 + 7);
  const base = rng.int(5, 9);
  const left = [rng.int(1, base - 2), rng.int(0, base - 1), rng.int(Math.ceil(base / 2), base - 1)];
  const unitFloor = Math.max(1, base - left[2]!);
  const right = [rng.int(1, base - 2), rng.int(0, base - 1), rng.int(unitFloor, base - 1)];
  const added = addInBase(left, right, base);
  if (!added.trace.some((step) => step.carryOut > 0)) throw new Error("NUM-CP013-PROT-007 failed to force a carry.");
  const leftValue = positionalValue(left, base);
  const rightValue = positionalValue(right, base);
  const sumValue = leftValue + rightValue;
  const canonicalText = digitString(added.digits);
  const canonical = notation(canonicalText, base);
  const verifier = notation(digitString(toBaseDigits(sumValue, base)), base);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(digitString(toBaseDigits(sumValue + 1, base)), base), misconceptionId: "CARRY_OFF_BY_ONE" },
    { value: notation(digitString(toBaseDigits(sumValue - 1, base)), base), misconceptionId: "DROP_CARRY" },
    { value: notation(digitString(toBaseDigits(sumValue + base, base)), base), misconceptionId: "SHIFT_CARRY_ONE_PLACE" },
    { value: notation(digitString(toBaseDigits(Math.abs(leftValue - rightValue), base)), base), misconceptionId: "SUBTRACT_INSTEAD_OF_ADD" },
  ], rng);
  const leftText = digitString(left);
  const rightText = digitString(right);
  return basePackage({
    prototypeId: "NUM-CP013-PROT-007",
    seed,
    difficulty: "MEDIUM",
    taskKind: "ADDITION_IN_BASE",
    answerSemantic: "BASE_NUMERAL",
    representation: "COLUMN_ARITHMETIC_IN_BASE",
    stem: rng.pick([
      `Add ${notation(leftText, base)} and ${notation(rightText, base)}. Give the answer in base ${base}.`,
      `Evaluate ${notation(leftText, base)} + ${notation(rightText, base)} without changing the final answer base.`,
      `What is the base-${base} sum of ${leftText} and ${rightText}?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    hiddenState: { base, left, right, leftValue, rightValue, sumValue, resultDigits: added.digits, trace: added.trace },
    fullDerivation: [
      `Base-${base} column addition works like decimal column addition, except every carry occurs at ${base}, not at 10.`,
      ...added.trace.map((step) => {
        const placeName = step.columnFromRight === 0 ? "units" : step.columnFromRight === 1 ? `${base}s` : `${base ** step.columnFromRight}s`;
        return `In the ${placeName} column: ${step.leftDigit} + ${step.rightDigit} + carry ${step.carryIn} = ${step.total}. Since ${step.total} = ${step.carryOut} × ${base} + ${step.writtenDigit}, write ${step.writtenDigit} and carry ${step.carryOut}.`;
      }),
      `Reading the written digits from the highest place gives ${canonicalText}.`,
      `Therefore the sum is ${canonical}.`,
    ],
    examShortcut: [
      `For a quick check, convert only to verify: ${notation(leftText, base)} = ${leftValue} and ${notation(rightText, base)} = ${rightValue}.`,
      `${leftValue} + ${rightValue} = ${sumValue}, which converts back to ${canonical}.`,
    ],
  });
}

function subtractInBase(top: readonly number[], bottom: readonly number[], base: number) {
  const result = Array(top.length).fill(0) as number[];
  const trace: ColumnSubtractTrace[] = [];
  let borrow = 0;
  let column = 0;
  for (let i = top.length - 1; i >= 0; i -= 1) {
    const j = bottom.length - 1 - column;
    const topDigitBeforeBorrow = top[i]!;
    const bottomDigit = j >= 0 ? bottom[j]! : 0;
    let adjustedTopDigit = topDigitBeforeBorrow - borrow;
    const borrowIn = borrow;
    let borrowOut = 0;
    if (adjustedTopDigit < bottomDigit) {
      adjustedTopDigit += base;
      borrowOut = 1;
    }
    const writtenDigit = adjustedTopDigit - bottomDigit;
    result[i] = writtenDigit;
    trace.push(Object.freeze({ columnFromRight: column, topDigitBeforeBorrow, bottomDigit, borrowIn, adjustedTopDigit, writtenDigit, borrowOut }));
    borrow = borrowOut;
    column += 1;
  }
  if (borrow !== 0) throw new Error("Subtraction state became negative.");
  while (result.length > 1 && result[0] === 0) result.shift();
  return { digits: Object.freeze(result), trace: Object.freeze(trace) };
}

function generateP008(seed: number) {
  const rng = new Rng(seed * 131 + 8);
  const base = rng.int(5, 9);
  const top = [rng.int(2, base - 1), rng.int(0, base - 1), rng.int(0, base - 2)];
  const bottom = [rng.int(1, top[0]! - 1), rng.int(0, base - 1), rng.int(top[2]! + 1, base - 1)];
  const topValue = positionalValue(top, base);
  const bottomValue = positionalValue(bottom, base);
  if (topValue <= bottomValue) throw new Error("NUM-CP013-PROT-008 failed to construct positive subtraction.");
  const subtracted = subtractInBase(top, bottom, base);
  if (!subtracted.trace.some((step) => step.borrowOut > 0)) throw new Error("NUM-CP013-PROT-008 failed to force a borrow.");
  const difference = topValue - bottomValue;
  const canonicalText = digitString(subtracted.digits);
  const canonical = notation(canonicalText, base);
  const verifier = notation(digitString(toBaseDigits(difference, base)), base);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(digitString(toBaseDigits(difference + 1, base)), base), misconceptionId: "BORROW_OFF_BY_ONE" },
    { value: notation(digitString(toBaseDigits(Math.max(0, difference - 1), base)), base), misconceptionId: "IGNORE_BORROW_EFFECT" },
    { value: notation(digitString(toBaseDigits(difference + base, base)), base), misconceptionId: "BORROW_AS_TEN_NOT_BASE" },
    { value: notation(digitString(toBaseDigits(topValue + bottomValue, base)), base), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT" },
  ], rng);
  const topText = digitString(top);
  const bottomText = digitString(bottom);
  return basePackage({
    prototypeId: "NUM-CP013-PROT-008",
    seed,
    difficulty: "MEDIUM",
    taskKind: "SUBTRACTION_IN_BASE",
    answerSemantic: "BASE_NUMERAL",
    representation: "COLUMN_ARITHMETIC_IN_BASE",
    stem: rng.pick([
      `Subtract ${notation(bottomText, base)} from ${notation(topText, base)}. Give the answer in base ${base}.`,
      `Evaluate ${notation(topText, base)} − ${notation(bottomText, base)} in base ${base}.`,
      `What is the base-${base} difference ${topText} − ${bottomText}?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    hiddenState: { base, top, bottom, topValue, bottomValue, difference, resultDigits: subtracted.digits, trace: subtracted.trace },
    fullDerivation: [
      `Base-${base} subtraction borrows one group of ${base}, not one group of 10.`,
      ...subtracted.trace.map((step) => {
        const placeName = step.columnFromRight === 0 ? "units" : step.columnFromRight === 1 ? `${base}s` : `${base ** step.columnFromRight}s`;
        const borrowText = step.borrowOut > 0 ? ` Because ${step.topDigitBeforeBorrow} − borrow ${step.borrowIn} is smaller than ${step.bottomDigit}, add ${base}; the adjusted top digit is ${step.adjustedTopDigit} and one is borrowed from the next column.` : ` No new borrow is needed.`;
        return `In the ${placeName} column, subtract ${step.bottomDigit} from the available top digit.${borrowText} Write ${step.adjustedTopDigit} − ${step.bottomDigit} = ${step.writtenDigit}.`;
      }),
      `The resulting digits are ${canonicalText}.`,
      `Therefore the difference is ${canonical}.`,
    ],
    examShortcut: [
      `Quick verification: ${notation(topText, base)} = ${topValue} and ${notation(bottomText, base)} = ${bottomValue} in decimal.`,
      `${topValue} − ${bottomValue} = ${difference}; converting ${difference} back to base ${base} gives ${canonical}.`,
    ],
  });
}

export function generateNumCp013Wave01(prototypeId: NumCp013Wave01PrototypeId, seed: number): NumCp013Wave01Package {
  assertSeed(seed);
  switch (prototypeId) {
    case "NUM-CP013-PROT-001": return generateP001(seed);
    case "NUM-CP013-PROT-002": return generateP002(seed);
    case "NUM-CP013-PROT-003": return generateP003(seed);
    case "NUM-CP013-PROT-004": return generateP004(seed);
    case "NUM-CP013-PROT-005": return generateP005(seed);
    case "NUM-CP013-PROT-006": return generateP006(seed);
    case "NUM-CP013-PROT-007": return generateP007(seed);
    case "NUM-CP013-PROT-008": return generateP008(seed);
  }
}
