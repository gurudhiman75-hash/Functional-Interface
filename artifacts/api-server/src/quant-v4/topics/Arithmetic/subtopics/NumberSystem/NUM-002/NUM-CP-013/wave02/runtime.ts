import { createHash } from "node:crypto";

import type { NumCp013Option } from "../wave01/types.ts";
import type { NumCp013Wave02Package, NumCp013Wave02PrototypeId } from "./types.ts";

const SYMBOLS = "0123456789ABCDEF";

class Rng {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 0x1_0000_0000;
  }
  int(min: number, max: number) { return min + Math.floor(this.next() * (max - min + 1)); }
  pick<T>(items: readonly T[]): T { return items[this.int(0, items.length - 1)]!; }
}

type Candidate = Readonly<{ value: string; misconceptionId: string }>;

const SOURCE_ANCESTRY = Object.freeze([
  "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-013",
  "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY:NUM-CP-013",
  "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
  "NUM-CP-013-WAVE01-FOUNDATION",
]);

const LIFECYCLE = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE02_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

function assertSeed(seed: number) {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("NUM-CP-013 Wave02 seed must be a positive integer.");
}

function symbol(value: number) {
  if (!Number.isInteger(value) || value < 0 || value >= 16) throw new Error(`Unsupported digit value ${value}.`);
  return SYMBOLS[value]!;
}

function digitValue(ch: string) {
  const value = SYMBOLS.indexOf(ch.toUpperCase());
  if (value < 0) throw new Error(`Unsupported digit symbol ${ch}.`);
  return value;
}

function numeral(digits: readonly number[]) { return digits.map(symbol).join(""); }
function notation(text: string, base: number) { return `(${text})_${base}`; }

function fromBase(text: string, base: number) {
  if (base < 2 || base > 16) throw new Error(`Unsupported base ${base}.`);
  let value = 0;
  for (const ch of text.toUpperCase()) {
    const digit = digitValue(ch);
    if (digit >= base) throw new Error(`Digit ${ch} invalid in base ${base}.`);
    value = value * base + digit;
  }
  return value;
}

function toBase(value: number, base: number) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid conversion value ${value}.`);
  if (base < 2 || base > 16) throw new Error(`Unsupported base ${base}.`);
  if (value === 0) return "0";
  const out: string[] = [];
  let remaining = value;
  while (remaining > 0) {
    out.push(symbol(remaining % base));
    remaining = Math.floor(remaining / base);
  }
  return out.reverse().join("");
}

function positionalValue(digits: readonly number[], base: number) {
  return digits.reduce((value, digit) => value * base + digit, 0);
}

function randomDigits(rng: Rng, base: number, length: number) {
  return [rng.int(1, base - 1), ...Array.from({ length: length - 1 }, () => rng.int(0, base - 1))];
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
  const raw: NumCp013Option[] = [{ value: correct, isCorrect: true, misconceptionId: "CORRECT" }];
  const seen = new Set([correct]);
  for (const candidate of distractors) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    raw.push({ value: candidate.value, isCorrect: false, misconceptionId: candidate.misconceptionId });
    if (raw.length === 4) break;
  }
  if (raw.length !== 4) throw new Error(`NUM-CP-013 Wave02 insufficient distractors for ${correct}.`);
  const options = Object.freeze(shuffle(raw, rng).map((option) => Object.freeze(option)));
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256").update(JSON.stringify({ prototypeId, state })).digest("hex");
}

function packageOf(input: Readonly<{
  prototypeId: NumCp013Wave02PrototypeId;
  seed: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
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
}>) : NumCp013Wave02Package {
  if (input.canonicalAnswer !== input.verifierAnswer) {
    throw new Error(`${input.prototypeId}: canonical/verifier drift ${input.canonicalAnswer} vs ${input.verifierAnswer}.`);
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
    prototypeAncestry: Object.freeze([input.prototypeId, "NUM-CP-013-WAVE02"]),
    lifecycle: LIFECYCLE,
  });
}

function generateP009(seed: number) {
  const rng = new Rng(seed * 137 + 9);
  const mode = seed % 4;
  const value = rng.int(32, 4095);
  const sourceBase = mode <= 1 ? 2 : mode === 2 ? 8 : 16;
  const targetBase = mode === 0 ? 8 : mode === 1 ? 16 : 2;
  const sourceText = toBase(value, sourceBase);
  const targetText = toBase(value, targetBase);
  const canonical = notation(targetText, targetBase);
  const verifier = notation(toBase(fromBase(sourceText, sourceBase), targetBase), targetBase);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(toBase(value + 1, targetBase), targetBase), misconceptionId: "GROUP_VALUE_OFF_BY_ONE" },
    { value: notation(toBase(value - 1, targetBase), targetBase), misconceptionId: "DROP_LEADING_GROUP_BIT" },
    { value: notation(toBase(value + targetBase, targetBase), targetBase), misconceptionId: "SHIFT_GROUP_ONE_PLACE" },
    { value: notation([...targetText].reverse().join(""), targetBase), misconceptionId: "REVERSE_GROUP_ORDER" },
  ], rng);

  let fullDerivation: string[];
  let examShortcut: string[];
  let groupingState: Readonly<Record<string, unknown>>;
  if (sourceBase === 2) {
    const width = targetBase === 8 ? 3 : 4;
    const padded = sourceText.padStart(Math.ceil(sourceText.length / width) * width, "0");
    const groups = Array.from({ length: padded.length / width }, (_, index) => padded.slice(index * width, (index + 1) * width));
    const mapped = groups.map((group) => parseInt(group, 2));
    const mappedSymbols = mapped.map(symbol);
    fullDerivation = [
      `For binary-to-base-${targetBase} grouping, one base-${targetBase} digit represents exactly ${width} binary bits because ${targetBase} = 2^${width}.`,
      `Pad only on the left if necessary: ${sourceText} → ${padded}. Left padding with zero does not change the value.`,
      `Split from the right into ${width}-bit groups: ${groups.join(" | ")}.`,
      ...groups.map((group, index) => `${group}_2 = ${mapped[index]} in decimal, which is digit ${mappedSymbols[index]} in base ${targetBase}.`),
      `Reading those mapped digits in the same order gives ${targetText}.`,
      `Therefore ${notation(sourceText, sourceBase)} = ${canonical}.`,
    ];
    examShortcut = [
      `Remember the grouping width: binary↔octal uses 3 bits; binary↔hex uses 4 bits.`,
      `Group, map, and read directly: ${groups.join(" | ")} → ${mappedSymbols.join(" ")} → ${canonical}.`,
    ];
    groupingState = { width, padded, groups, mapped, mappedSymbols };
  } else {
    const width = sourceBase === 8 ? 3 : 4;
    const sourceDigits = [...sourceText].map(digitValue);
    const groups = sourceDigits.map((digit) => digit.toString(2).padStart(width, "0"));
    const joined = groups.join("");
    const normalized = joined.replace(/^0+(?=\d)/u, "") || "0";
    fullDerivation = [
      `Each base-${sourceBase} digit maps to exactly ${width} binary bits because ${sourceBase} = 2^${width}.`,
      ...sourceDigits.map((digit, index) => `Digit ${symbol(digit)} has value ${digit}; ${digit} in ${width}-bit binary is ${groups[index]}.`),
      `Join the groups without changing their order: ${groups.join(" | ")} → ${joined}.`,
      `Remove only leading zero padding from the whole binary numeral: ${joined} → ${normalized}.`,
      `Therefore ${notation(sourceText, sourceBase)} = ${notation(normalized, 2)}.`,
    ];
    examShortcut = [
      `Map each ${sourceBase === 8 ? "octal" : "hexadecimal"} digit directly to ${width} bits and concatenate.`,
      `${[...sourceText].join(" ")} → ${groups.join(" ")} → ${notation(normalized, 2)}.`,
    ];
    groupingState = { width, sourceDigits, groups, joined, normalized };
  }
  return packageOf({
    prototypeId: "NUM-CP013-PROT-009",
    seed,
    difficulty: sourceText.length >= 4 ? "MEDIUM" : "EASY",
    taskKind: sourceBase === 2 ? (targetBase === 8 ? "BINARY_TO_OCTAL_GROUPING" : "BINARY_TO_HEX_GROUPING") : (sourceBase === 8 ? "OCTAL_TO_BINARY_GROUPING" : "HEX_TO_BINARY_GROUPING"),
    answerSemantic: "BASE_NUMERAL",
    representation: "BINARY_GROUPING_TABLE",
    stem: rng.pick([
      `Convert ${notation(sourceText, sourceBase)} to base ${targetBase} using direct grouping.`,
      `Which base-${targetBase} numeral is equal to ${notation(sourceText, sourceBase)}?`,
      `Express ${notation(sourceText, sourceBase)} in base ${targetBase}.`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    hiddenState: { mode, value, sourceBase, targetBase, sourceText, targetText, groupingState },
    fullDerivation,
    examShortcut,
  });
}

function generateP010(seed: number) {
  const rng = new Rng(seed * 139 + 10);
  const base = rng.int(2, 15);
  const validA = randomDigits(rng, base, 3);
  const validB = randomDigits(rng, base, 3);
  const validC = randomDigits(rng, base, 2);
  if (base > 10) validA[1] = base - 1;
  const invalidDigit = base;
  const invalid = [rng.int(1, base - 1), invalidDigit, rng.int(0, base - 1)];
  const candidates = shuffle([
    { text: numeral(validA), valid: true },
    { text: numeral(validB), valid: true },
    { text: numeral(validC), valid: true },
    { text: numeral(invalid), valid: false },
  ], rng);
  const answerText = candidates.find((candidate) => !candidate.valid)!.text;
  const correct = notation(answerText, base);
  const options = Object.freeze(candidates.map((candidate) => Object.freeze({
    value: notation(candidate.text, base),
    isCorrect: !candidate.valid,
    misconceptionId: candidate.valid ? "REJECT_VALID_DIGIT_PATTERN" : "CORRECT",
  })));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const invalidSymbol = symbol(invalidDigit);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-010",
    seed,
    difficulty: base > 10 ? "MEDIUM" : "EASY",
    taskKind: "NUMERAL_VALIDITY_CLASSIFICATION",
    answerSemantic: "BASE_NUMERAL",
    representation: "DIGIT_VALIDITY_CANDIDATE_SET",
    stem: rng.pick([
      `Which of the following is NOT a valid numeral in base ${base}?`,
      `Select the numeral that cannot be written in base ${base}.`,
      `One option uses an illegal base-${base} digit. Which option is it?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: { base, candidates, invalidDigit, invalidSymbol, answerText },
    fullDerivation: [
      `A base-${base} digit must have value from 0 through ${base - 1}; equivalently every digit value must be strictly less than ${base}.`,
      ...(base > 10 ? [`For letter digits, A = 10, B = 11, C = 12, D = 13, E = 14 and F = 15.`] : []),
      ...candidates.map((candidate) => {
        const values = [...candidate.text].map((ch) => `${ch}=${digitValue(ch)}`).join(", ");
        return `${notation(candidate.text, base)} has digit values ${values}; it is ${candidate.valid ? "valid because every value is below the base" : `invalid because ${invalidSymbol} has value ${invalidDigit}, which is not below ${base}`}.`;
      }),
      `Therefore the invalid numeral is ${correct}.`,
    ],
    examShortcut: [
      `Scan only for the largest digit value. In base ${base}, any digit ≥ ${base} is illegal.`,
      `${invalidSymbol} = ${invalidDigit}, so ${correct} is impossible in base ${base}.`,
    ],
  });
}

function generateP011(seed: number) {
  const rng = new Rng(seed * 149 + 11);
  const mode = seed % 4;
  if (mode === 0) {
    const base = rng.int(3, 16);
    const digits = randomDigits(rng, base, 4);
    const index = rng.int(0, 3);
    if (digits[index] === 0) digits[index] = rng.int(1, base - 1);
    const power = 3 - index;
    const contribution = digits[index]! * base ** power;
    const text = numeral(digits);
    const { options, correctIndex } = buildOptions(String(contribution), [
      { value: String(digits[index]), misconceptionId: "RETURN_FACE_VALUE" },
      { value: String(base ** power), misconceptionId: "RETURN_PLACE_WEIGHT_ONLY" },
      { value: String(digits[index]! * base ** Math.max(0, power - 1)), misconceptionId: "USE_ADJACENT_PLACE" },
      { value: String(fromBase(text, base)), misconceptionId: "RETURN_WHOLE_NUMERAL_VALUE" },
    ], rng);
    return packageOf({
      prototypeId: "NUM-CP013-PROT-011", seed, difficulty: "MEDIUM", taskKind: "PLACE_VALUE_IN_BASE", answerSemantic: "PLACE_VALUE", representation: "POSITIONAL_EXPANSION_TABLE",
      stem: `What is the decimal place value contributed by the digit ${symbol(digits[index]!)} in position ${index + 1} from the left of ${notation(text, base)}?`,
      options, correctIndex, canonicalAnswer: String(contribution), verifierAnswer: String(digits[index]! * base ** power),
      hiddenState: { mode, base, digits, text, index, power, contribution },
      fullDerivation: [
        `The numeral has four positions, so their powers from left to right are ${base}^3, ${base}^2, ${base}^1 and ${base}^0.`,
        `The selected digit is ${symbol(digits[index]!)} = ${digits[index]} and it sits in the ${base}^${power} place.`,
        `${base}^${power} = ${base ** power}.`,
        `Place-value contribution = digit value × place weight = ${digits[index]} × ${base ** power} = ${contribution}.`,
        `Therefore the required decimal place value is ${contribution}.`,
      ],
      examShortcut: [`Count places from the right starting at power 0. The selected digit is ${power} place(s) above units, so compute ${digits[index]} × ${base}^${power} = ${contribution}.`],
    });
  }
  if (mode === 1) {
    const base = rng.int(2, 12);
    const digitsCount = rng.int(3, 6);
    const lower = base ** (digitsCount - 1);
    const upper = base ** digitsCount - 1;
    const decimal = rng.int(lower, Math.min(upper, lower + 5000));
    const verifierCount = toBase(decimal, base).length;
    const { options, correctIndex } = buildOptions(String(digitsCount), [
      { value: String(digitsCount - 1), misconceptionId: "USE_LOWER_POWER_INDEX" },
      { value: String(digitsCount + 1), misconceptionId: "COUNT_POWER_ZERO_TWICE" },
      { value: String(Math.max(1, digitsCount - 2)), misconceptionId: "UNDERESTIMATE_DIGIT_COUNT" },
      { value: String(digitsCount + 2), misconceptionId: "OVERESTIMATE_DIGIT_COUNT" },
    ], rng);
    return packageOf({
      prototypeId: "NUM-CP013-PROT-011", seed, difficulty: "MEDIUM", taskKind: "NUMBER_OF_DIGITS_IN_BASE", answerSemantic: "NUMBER_OF_DIGITS", representation: "POWER_BOUND_TABLE",
      stem: `How many digits are required to write the decimal integer ${decimal} in base ${base}?`,
      options, correctIndex, canonicalAnswer: String(digitsCount), verifierAnswer: String(verifierCount),
      hiddenState: { mode, base, digitsCount, decimal, lower, upper },
      fullDerivation: [
        `A positive integer has exactly n digits in base ${base} when ${base}^(n−1) ≤ N < ${base}^n.`,
        `${base}^${digitsCount - 1} = ${lower}.`,
        `${base}^${digitsCount} = ${base ** digitsCount}.`,
        `${lower} ≤ ${decimal} < ${base ** digitsCount}.`,
        `Therefore ${decimal} needs exactly ${digitsCount} base-${base} digits.`,
      ],
      examShortcut: [`Locate ${decimal} between consecutive powers of ${base}. It lies from ${base}^${digitsCount - 1} up to one less than ${base}^${digitsCount}, so the digit count is ${digitsCount}.`],
    });
  }
  const base = rng.int(3, 12);
  const n = rng.int(2, 5);
  const largestMode = mode === 2;
  const decimal = largestMode ? base ** n - 1 : base ** (n - 1);
  const baseText = largestMode ? symbol(base - 1).repeat(n) : `1${"0".repeat(n - 1)}`;
  const { options, correctIndex } = buildOptions(String(decimal), [
    { value: String(base ** n), misconceptionId: "USE_NEXT_POWER" },
    { value: String(base ** (n - 1) - 1), misconceptionId: "USE_PREVIOUS_POWER_MINUS_ONE" },
    { value: String(decimal + 1), misconceptionId: "BOUNDARY_OFF_BY_ONE" },
    { value: String(Math.max(0, decimal - 1)), misconceptionId: "BOUNDARY_BELOW_TARGET" },
  ], rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-011", seed, difficulty: "EASY", taskKind: largestMode ? "LARGEST_N_DIGIT_BASE_NUMERAL" : "SMALLEST_N_DIGIT_BASE_NUMERAL", answerSemantic: "DECIMAL_INTEGER", representation: "POSITIONAL_BOUNDARY",
    stem: `What is the decimal value of the ${largestMode ? "largest" : "smallest"} ${n}-digit numeral in base ${base}?`,
    options, correctIndex, canonicalAnswer: String(decimal), verifierAnswer: String(fromBase(baseText, base)),
    hiddenState: { mode, base, n, largestMode, baseText, decimal },
    fullDerivation: largestMode ? [
      `The largest allowed digit in base ${base} is ${symbol(base - 1)} = ${base - 1}.`,
      `So the largest ${n}-digit numeral is ${notation(baseText, base)}.`,
      `All ${n}-digit base-${base} numerals are below ${base}^${n}; the largest one is exactly one less than that next place boundary.`,
      `${base}^${n} = ${base ** n}, so the largest value is ${base ** n} − 1 = ${decimal}.`,
    ] : [
      `The first digit of an ${n}-digit numeral must be non-zero; to make the numeral as small as possible, use 1 followed by ${n - 1} zero(s).`,
      `Thus the smallest numeral is ${notation(baseText, base)}.`,
      `Its only non-zero place is ${base}^${n - 1}.`,
      `${base}^${n - 1} = ${decimal}.`,
    ],
    examShortcut: [largestMode ? `Largest n-digit value in base b = b^n − 1 = ${base}^${n} − 1 = ${decimal}.` : `Smallest n-digit value in base b = b^(n−1) = ${base}^${n - 1} = ${decimal}.`],
  });
}

function generateP012(seed: number) {
  const rng = new Rng(seed * 151 + 12);
  const lower = rng.int(2, 12);
  const upper = rng.int(Math.min(16, lower + 2), Math.min(16, lower + 5));
  const mode = seed % 3;
  let maxDigit: number;
  if (mode === 0) maxDigit = rng.int(upper, 15);
  else if (mode === 1) maxDigit = upper - 1;
  else maxDigit = rng.int(1, Math.max(1, lower - 1));
  const digits = [rng.int(1, Math.max(1, maxDigit)), rng.int(0, maxDigit), maxDigit];
  if (digits[0] === 0) digits[0] = 1;
  const text = numeral(digits);
  const validBases = Array.from({ length: upper - lower + 1 }, (_, index) => lower + index)
    .filter((base) => digits.every((digit) => digit < base));
  const count = validBases.length;
  const { options, correctIndex } = buildOptions(String(count), [
    { value: String(Math.max(0, count - 1)), misconceptionId: "EXCLUDE_ONE_VALID_ENDPOINT" },
    { value: String(count + 1), misconceptionId: "INCLUDE_ONE_INVALID_BASE" },
    { value: String(upper - lower + 1), misconceptionId: "ASSUME_ALL_BOUNDED_BASES_VALID" },
    { value: String(Math.max(0, upper - maxDigit)), misconceptionId: "BOUND_COUNT_OFF_BY_ONE" },
    { value: "0", misconceptionId: "ASSUME_NO_BASE_VALID" },
  ], rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-012", seed, difficulty: "MEDIUM", taskKind: "COUNT_VALID_BASES_IN_RANGE", answerSemantic: "COUNT", representation: "BASE_CANDIDATE_TABLE",
    stem: `For how many integer bases b with ${lower} ≤ b ≤ ${upper} is (${text})_b a valid numeral?`,
    options, correctIndex, canonicalAnswer: String(count), verifierAnswer: String(validBases.length),
    hiddenState: { lower, upper, mode, maxDigit, digits, text, validBases, count },
    fullDerivation: [
      `A numeral is valid in base b only when every digit value is less than b.`,
      `The largest digit in ${text} is ${symbol(maxDigit)} = ${maxDigit}, so validity requires b ≥ ${maxDigit + 1}.`,
      `The allowed base interval is ${lower} through ${upper}.`,
      `Intersecting the two conditions gives valid bases: ${validBases.length ? validBases.join(", ") : "none"}.`,
      `Therefore the number of valid bases is ${count}.`,
    ],
    examShortcut: [`Use b > largest digit. Here b > ${maxDigit}; count only integers in [${lower}, ${upper}] that satisfy that inequality, giving ${count}.`],
  });
}

function generateP013(seed: number) {
  const rng = new Rng(seed * 157 + 13);
  const base = rng.int(6, 12);
  const maxLead = Math.max(1, Math.floor((base - 2) / 2));
  const a = rng.int(1, maxLead);
  const c = rng.int(1, maxLead);
  const p = rng.int(Math.ceil(base / 2), base - 1);
  const q = rng.int(base - p, base - 1);
  const s = p + q - base;
  const r = a + c + 1;
  if (r >= base) throw new Error("NUM-CP013-PROT-013 tens result exceeded base.");
  const leftText = numeral([a, p]);
  const rightText = numeral([c, q]);
  const resultText = numeral([r, s]);
  const minBase = Math.max(a, p, c, q, r, s) + 1;
  const solutions = Array.from({ length: 17 - minBase }, (_, index) => minBase + index)
    .filter((candidateBase) => fromBase(leftText, candidateBase) + fromBase(rightText, candidateBase) === fromBase(resultText, candidateBase));
  if (solutions.length !== 1 || solutions[0] !== base) throw new Error("NUM-CP013-PROT-013 arithmetic base state is not unique.");
  const { options, correctIndex } = buildOptions(String(base), [
    { value: String(Math.max(2, base - 1)), misconceptionId: "BASE_MINUS_ONE" },
    { value: String(Math.min(16, base + 1)), misconceptionId: "BASE_PLUS_ONE" },
    { value: String(p + q), misconceptionId: "IGNORE_WRITTEN_UNITS_DIGIT" },
    { value: String(Math.max(2, p + q - s - 1)), misconceptionId: "CARRY_EQUATION_OFF_BY_ONE" },
  ], rng);
  const leftValue = fromBase(leftText, base);
  const rightValue = fromBase(rightText, base);
  const resultValue = fromBase(resultText, base);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-013", seed, difficulty: "HARD", taskKind: "UNKNOWN_BASE_FROM_ARITHMETIC_STATEMENT", answerSemantic: "BASE", representation: "BASE_COLUMN_EQUATION",
    stem: `In base b, ${notation(leftText, base).replace(`_${base}`, "_b")} + ${notation(rightText, base).replace(`_${base}`, "_b")} = ${notation(resultText, base).replace(`_${base}`, "_b")}. Find b.`,
    options, correctIndex, canonicalAnswer: String(base), verifierAnswer: String(solutions[0]),
    hiddenState: { base, a, p, c, q, r, s, leftText, rightText, resultText, minBase, solutions, leftValue, rightValue, resultValue },
    fullDerivation: [
      `Expand each two-digit base-b numeral: (${leftText})_b = ${a}b + ${symbol(p)} and (${rightText})_b = ${c}b + ${symbol(q)}.`,
      `The result (${resultText})_b = ${r}b + ${symbol(s)}.`,
      `So (${a}b + ${p}) + (${c}b + ${q}) = ${r}b + ${s}.`,
      `Combine like terms: ${a + c}b + ${p + q} = ${r}b + ${s}.`,
      `Move the b-terms to one side and constants to the other: ${p + q - s} = (${r} − ${a + c})b.`,
      `${r} − ${a + c} = 1, and ${p + q} − ${s} = ${p + q - s}.`,
      `Therefore b = ${p + q - s}.`,
      `Hence b = ${base}. Verification in decimal: ${leftValue} + ${rightValue} = ${resultValue}.`,
    ],
    examShortcut: [
      `Look only at the units column. ${symbol(p)} + ${symbol(q)} writes ${symbol(s)} and produces one carry.`,
      `Therefore ${p} + ${q} = b + ${s}, so b = ${p} + ${q} − ${s} = ${base}.`,
    ],
  });
}

function generateP014(seed: number) {
  const rng = new Rng(seed * 163 + 14);
  const base = rng.int(4, 16);
  const multiplier = rng.int(2, base - 1);
  const unitMin = Math.max(1, Math.ceil(base / multiplier));
  const units = rng.int(unitMin, base - 1);
  const leading = rng.int(1, base - 1);
  const multiplicandText = numeral([leading, units]);
  const multiplierText = symbol(multiplier);
  const unitsTotal = units * multiplier;
  const unitsDigit = unitsTotal % base;
  const carry = Math.floor(unitsTotal / base);
  const nextTotal = leading * multiplier + carry;
  const decimalProduct = fromBase(multiplicandText, base) * multiplier;
  const resultText = toBase(decimalProduct, base);
  const canonical = notation(resultText, base);
  const verifier = notation(toBase(positionalValue([leading, units], base) * multiplier, base), base);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(toBase(decimalProduct + 1, base), base), misconceptionId: "MULTIPLICATION_OFF_BY_ONE" },
    { value: notation(toBase(decimalProduct - 1, base), base), misconceptionId: "DROP_CARRY" },
    { value: notation(toBase(decimalProduct + base, base), base), misconceptionId: "SHIFT_CARRY" },
    { value: notation(toBase(fromBase(multiplicandText, base) + multiplier, base), base), misconceptionId: "ADD_INSTEAD_OF_MULTIPLY" },
  ], rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-014", seed, difficulty: base > 10 ? "HARD" : "MEDIUM", taskKind: "MULTIPLICATION_IN_BASE", answerSemantic: "BASE_NUMERAL", representation: "COLUMN_MULTIPLICATION_IN_BASE",
    stem: `Multiply ${notation(multiplicandText, base)} by ${notation(multiplierText, base)}. Give the product in base ${base}.`,
    options, correctIndex, canonicalAnswer: canonical, verifierAnswer: verifier,
    hiddenState: { base, leading, units, multiplier, multiplicandText, multiplierText, unitsTotal, unitsDigit, carry, nextTotal, decimalProduct, resultText },
    fullDerivation: [
      `Work from the units column exactly as in decimal multiplication, but every carry is measured in groups of base ${base}.`,
      `${symbol(units)} × ${symbol(multiplier)} means ${units} × ${multiplier} = ${unitsTotal}.`,
      `Divide ${unitsTotal} by ${base}: ${unitsTotal} = ${carry} × ${base} + ${unitsDigit}. Therefore write digit ${symbol(unitsDigit)} and carry ${carry}.`,
      `Now multiply the leading digit and add that carry: ${leading} × ${multiplier} + ${carry} = ${nextTotal}.`,
      `Writing ${nextTotal} in base ${base} and then appending the already fixed units digit produces ${resultText}.`,
      `Therefore the product is ${canonical}.`,
    ],
    examShortcut: [
      `Quick verification route: ${notation(multiplicandText, base)} = ${fromBase(multiplicandText, base)} in decimal and ${symbol(multiplier)} = ${multiplier}.`,
      `${fromBase(multiplicandText, base)} × ${multiplier} = ${decimalProduct}; converting back gives ${canonical}.`,
    ],
  });
}

export function generateNumCp013Wave02(prototypeId: NumCp013Wave02PrototypeId, seed: number): NumCp013Wave02Package {
  assertSeed(seed);
  switch (prototypeId) {
    case "NUM-CP013-PROT-009": return generateP009(seed);
    case "NUM-CP013-PROT-010": return generateP010(seed);
    case "NUM-CP013-PROT-011": return generateP011(seed);
    case "NUM-CP013-PROT-012": return generateP012(seed);
    case "NUM-CP013-PROT-013": return generateP013(seed);
    case "NUM-CP013-PROT-014": return generateP014(seed);
  }
}
