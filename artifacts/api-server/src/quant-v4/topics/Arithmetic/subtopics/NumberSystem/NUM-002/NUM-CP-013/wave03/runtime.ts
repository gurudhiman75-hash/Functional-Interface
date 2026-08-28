import { createHash } from "node:crypto";

import type { NumCp013Option } from "../wave01/types.ts";
import type { NumCp013Wave03Package, NumCp013Wave03PrototypeId } from "./types.ts";

const SYMBOLS = "0123456789ABCDEF";

type Candidate = Readonly<{ value: string; misconceptionId: string }>;

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

function assertSeed(seed: number) {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("NUM-CP-013 Wave03 seed must be a positive integer.");
}

function symbol(value: number) {
  const out = SYMBOLS[value];
  if (!out) throw new Error(`Unsupported digit value ${value}.`);
  return out;
}

function digitValue(ch: string) {
  const value = SYMBOLS.indexOf(ch.toUpperCase());
  if (value < 0) throw new Error(`Unsupported digit symbol ${ch}.`);
  return value;
}

function notation(text: string, base: number) { return `(${text})_${base}`; }

function toBase(value: number, base: number) {
  if (!Number.isSafeInteger(value) || value < 0 || base < 2 || base > 16) throw new Error("Unsupported base conversion state.");
  if (value === 0) return "0";
  const out: string[] = [];
  let remaining = value;
  while (remaining > 0) {
    out.push(symbol(remaining % base));
    remaining = Math.floor(remaining / base);
  }
  return out.reverse().join("");
}

function fromBase(text: string, base: number) {
  let value = 0;
  for (const ch of text.toUpperCase()) {
    const digit = digitValue(ch);
    if (digit >= base) throw new Error(`Digit ${ch} invalid in base ${base}.`);
    value = value * base + digit;
  }
  return value;
}

function shuffle<T>(items: readonly T[], rng: Rng) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function buildOptions(correct: string, distractors: readonly Candidate[], seed: number, rng: Rng) {
  const unique: Candidate[] = [];
  const seen = new Set([correct]);
  for (const candidate of distractors) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    unique.push(candidate);
    if (unique.length === 3) break;
  }
  if (unique.length !== 3) throw new Error(`NUM-CP-013 Wave03 insufficient distractors for ${correct}.`);
  const shuffledDistractors = shuffle(unique, rng);
  const targetIndex = (seed - 1) % 4;
  const options: NumCp013Option[] = [];
  let d = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === targetIndex) options.push({ value: correct, isCorrect: true, misconceptionId: "CORRECT" });
    else {
      const candidate = shuffledDistractors[d++]!;
      options.push({ value: candidate.value, isCorrect: false, misconceptionId: candidate.misconceptionId });
    }
  }
  return { options: Object.freeze(options.map((option) => Object.freeze(option))), correctIndex: targetIndex };
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256").update(JSON.stringify({ prototypeId, state })).digest("hex");
}

const SOURCE_ANCESTRY = Object.freeze([
  "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-013",
  "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY:NUM-CP-013",
  "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
  "NUM-CP-013-WAVE01-FOUNDATION",
  "NUM-CP-013-WAVE02-EDGE-REPRESENTATION",
]);

const LIFECYCLE = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE03_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

function packageOf(input: Readonly<{
  prototypeId: NumCp013Wave03PrototypeId;
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
}>) : NumCp013Wave03Package {
  if (input.canonicalAnswer !== input.verifierAnswer) throw new Error(`${input.prototypeId}: canonical/verifier drift.`);
  if (input.options[input.correctIndex]?.isCorrect !== true || input.options[input.correctIndex]?.value !== input.canonicalAnswer) {
    throw new Error(`${input.prototypeId}: option binding drift.`);
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
    prototypeAncestry: Object.freeze([input.prototypeId, "NUM-CP-013-WAVE03"]),
    lifecycle: LIFECYCLE,
  });
}

function expansion(text: string, base: number) {
  const digits = [...text].map(digitValue);
  const terms = digits.map((digit, index) => ({
    digit,
    power: digits.length - 1 - index,
    value: digit * base ** (digits.length - 1 - index),
  }));
  return { digits, terms, value: terms.reduce((sum, term) => sum + term.value, 0) };
}

function generateP015(seed: number) {
  const rng = new Rng(seed * 157 + 15);
  const baseA = rng.int(3, 16);
  let baseB = rng.int(3, 16);
  if (baseB === baseA) baseB = baseB === 16 ? 3 : baseB + 1;
  const anchor = rng.int(80, 2500);
  const delta = rng.int(1, 80);
  const mode = seed % 3;
  const valueA = mode === 0 ? anchor + delta : anchor;
  const valueB = mode === 1 ? anchor + delta : anchor;
  const textA = toBase(valueA, baseA);
  const textB = toBase(valueB, baseB);
  const canonical = valueA > valueB ? "First numeral is greater" : valueA < valueB ? "Second numeral is greater" : "Both numerals are equal";
  const { options, correctIndex } = buildOptions(canonical, [
    { value: "First numeral is greater", misconceptionId: "COMPARE_DIGIT_STRINGS_ONLY" },
    { value: "Second numeral is greater", misconceptionId: "COMPARE_BASES_ONLY" },
    { value: "Both numerals are equal", misconceptionId: "ASSUME_SAME_DIGITS_SAME_VALUE" },
    { value: "Cannot be determined", misconceptionId: "AVOID_CROSS_BASE_CONVERSION" },
  ], seed, rng);
  const expA = expansion(textA, baseA);
  const expB = expansion(textB, baseB);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-015",
    seed,
    difficulty: "MEDIUM",
    taskKind: "COMPARE_NUMERALS_ACROSS_BASES",
    answerSemantic: "COMPARISON_CLASS",
    representation: "CROSS_BASE_COMPARISON_TABLE",
    stem: rng.pick([
      `Compare ${notation(textA, baseA)} and ${notation(textB, baseB)}.`,
      `Which relation is correct for ${notation(textA, baseA)} and ${notation(textB, baseB)}?`,
      `After accounting for their different bases, how do ${notation(textA, baseA)} and ${notation(textB, baseB)} compare?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: fromBase(textA, baseA) > fromBase(textB, baseB) ? "First numeral is greater" : fromBase(textA, baseA) < fromBase(textB, baseB) ? "Second numeral is greater" : "Both numerals are equal",
    hiddenState: { baseA, baseB, textA, textB, valueA, valueB, mode, delta },
    fullDerivation: [
      `The two digit strings are written in different bases, so compare their values rather than their appearances.`,
      `${notation(textA, baseA)} = ${expA.terms.map((t) => `${t.digit} × ${baseA}^${t.power}`).join(" + ")}.`,
      `${expA.terms.map((t) => t.value).join(" + ")} = ${expA.value}.`,
      `${notation(textB, baseB)} = ${expB.terms.map((t) => `${t.digit} × ${baseB}^${t.power}`).join(" + ")}.`,
      `${expB.terms.map((t) => t.value).join(" + ")} = ${expB.value}.`,
      `Now compare ${expA.value} and ${expB.value}. Therefore: ${canonical}.`,
    ],
    examShortcut: [
      `Use Horner evaluation for each numeral: repeatedly multiply the running value by its base and add the next digit.`,
      `That gives ${valueA} and ${valueB}; compare those two integers directly.`,
    ],
  });
}

function generateP016(seed: number) {
  const rng = new Rng(seed * 163 + 16);
  const base = rng.int(4, 12);
  const digits = [rng.int(1, base - 1), rng.int(0, base - 1), rng.int(0, base - 1), rng.int(0, base - 1)];
  const text = digits.map(symbol).join("");
  const divisor = rng.int(4, 9);
  const value = fromBase(text, base);
  const remainder = value % divisor;
  const quotient = Math.floor(value / divisor);
  const modularTrace: number[] = [];
  let running = 0;
  for (const digit of digits) {
    running = (running * base + digit) % divisor;
    modularTrace.push(running);
  }
  const { options, correctIndex } = buildOptions(String(remainder), [
    { value: String((remainder + 1) % divisor), misconceptionId: "REMAINDER_OFF_BY_ONE" },
    { value: String((remainder + divisor - 1) % divisor), misconceptionId: "NORMALISE_WRONG_DIRECTION" },
    { value: String((remainder + 2) % divisor), misconceptionId: "DROP_ONE_PLACE_TERM" },
    { value: String(divisor - 1), misconceptionId: "ASSUME_MAXIMUM_REMAINDER" },
  ], seed, rng);
  const exp = expansion(text, base);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-016",
    seed,
    difficulty: "MEDIUM",
    taskKind: "REMAINDER_OF_BASE_NUMERAL",
    answerSemantic: "REMAINDER",
    representation: "BASE_EXPANSION_MODULAR_LADDER",
    stem: rng.pick([
      `What remainder is obtained when ${notation(text, base)} is divided by ${divisor}?`,
      `Find the remainder on dividing the base-${base} numeral ${notation(text, base)} by ${divisor}.`,
      `Evaluate ${notation(text, base)} modulo ${divisor}.`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: String(remainder),
    verifierAnswer: String(fromBase(text, base) % divisor),
    hiddenState: { base, digits, text, divisor, value, quotient, remainder, modularTrace },
    fullDerivation: [
      `First recover the integer represented by the base-${base} numeral.`,
      `${notation(text, base)} = ${exp.terms.map((t) => `${t.digit} × ${base}^${t.power}`).join(" + ")}.`,
      `${exp.terms.map((t) => t.value).join(" + ")} = ${value}.`,
      `Now divide ${value} by ${divisor}: ${value} = ${quotient} × ${divisor} + ${remainder}.`,
      `Because a remainder must satisfy 0 ≤ r < ${divisor}, the required remainder is ${remainder}.`,
    ],
    examShortcut: [
      `Avoid forming the full decimal integer: process digits modulo ${divisor} by running r ← (r × ${base} + next digit) mod ${divisor}.`,
      `The successive residues are ${modularTrace.join(" → ")}; the final residue is ${remainder}.`,
    ],
  });
}

function generateP017(seed: number) {
  const rng = new Rng(seed * 167 + 17);
  const base = rng.int(5, 16);
  const left = [rng.int(1, base - 1), rng.int(0, base - 1)];
  const right = [rng.int(1, base - 1), rng.int(0, base - 1)];
  const leftText = left.map(symbol).join("");
  const rightText = right.map(symbol).join("");
  const unitProduct = left[1]! * right[1]!;
  const quotient = Math.floor(unitProduct / base);
  const unit = unitProduct % base;
  const canonical = symbol(unit);
  const distractorValues = Array.from({ length: base }, (_, value) => value).filter((value) => value !== unit).slice(0, 6);
  const { options, correctIndex } = buildOptions(canonical, distractorValues.map((value, index) => ({
    value: symbol(value), misconceptionId: index === 0 ? "USE_FIRST_AVAILABLE_DIGIT" : index === 1 ? "IGNORE_BASE_REDUCTION" : "WRONG_TERMINAL_RESIDUE",
  })), seed, rng);
  const fullProduct = fromBase(leftText, base) * fromBase(rightText, base);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-017",
    seed,
    difficulty: base > 10 ? "MEDIUM" : "EASY",
    taskKind: "TERMINAL_DIGIT_IN_STATED_BASE",
    answerSemantic: "TERMINAL_BASE_DIGIT",
    representation: "TERMINAL_BASE_DIGIT_COLUMN",
    stem: rng.pick([
      `What is the last digit, in base ${base}, of ${notation(leftText, base)} × ${notation(rightText, base)}?`,
      `Find the units digit of the product ${notation(leftText, base)}${" × "}${notation(rightText, base)} when the answer is written in base ${base}.`,
      `Only the final base-${base} digit is required for ${notation(leftText, base)} × ${notation(rightText, base)}. What is it?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: toBase(fullProduct, base).slice(-1),
    hiddenState: { base, left, right, leftText, rightText, unitProduct, quotient, unit, fullProduct },
    fullDerivation: [
      `In base ${base}, every place except the units place contains a factor of ${base}. Therefore higher-place contributions cannot change the final digit modulo ${base}.`,
      `The units digits are ${symbol(left[1]!)} = ${left[1]} and ${symbol(right[1]!)} = ${right[1]}.`,
      `Multiply them: ${left[1]} × ${right[1]} = ${unitProduct}.`,
      `Write ${unitProduct} in quotient-remainder form with divisor ${base}: ${unitProduct} = ${quotient} × ${base} + ${unit}.`,
      `So the units residue is ${unit}, written as digit ${canonical} in base ${base}.`,
      `Therefore the last digit of the whole product is ${canonical}.`,
    ],
    examShortcut: [
      `For a product's last digit in base ${base}, ignore all higher digits and multiply only the two units digits modulo ${base}.`,
      `${left[1]} × ${right[1]} mod ${base} = ${unit}; digit ${canonical}.`,
    ],
  });
}

function generateP018(seed: number) {
  const rng = new Rng(seed * 173 + 18);
  const base = rng.int(3, 16);
  const a = rng.int(1, base - 1);
  const b = rng.int(0, base - 1);
  const invalid = `0${symbol(a)}${symbol(b)}`;
  const valid1 = `${symbol(a)}0${symbol(b)}`;
  const valid2 = `${symbol(a)}${symbol(b)}0`;
  const valid3 = `${symbol(Math.max(1, Math.min(base - 1, a)))}${symbol((b + 1) % base)}${symbol((a + 1) % base)}`;
  const canonical = notation(invalid, base);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(valid1, base), misconceptionId: "REJECT_INTERNAL_ZERO" },
    { value: notation(valid2, base), misconceptionId: "REJECT_TRAILING_ZERO" },
    { value: notation(valid3, base), misconceptionId: "REJECT_VALID_THREE_DIGIT_NUMERAL" },
    { value: notation(`${symbol(a)}11`, base), misconceptionId: "IGNORE_DIGIT_COUNT" },
  ], seed, rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-018",
    seed,
    difficulty: "EASY",
    taskKind: "LEADING_ZERO_THREE_DIGIT_CLASSIFICATION",
    answerSemantic: "BASE_NUMERAL",
    representation: "DIGIT_LENGTH_VALIDITY_SET",
    stem: rng.pick([
      `Which option does NOT represent a three-digit integer numeral in base ${base}?`,
      `All options are written with three symbols. Which one is not actually a three-digit base-${base} integer numeral?`,
      `Select the base-${base} representation whose leading zero prevents it from being a three-digit numeral.`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: canonical,
    hiddenState: { base, invalid, validTexts: [valid1, valid2, valid3], leadingDigit: 0 },
    fullDerivation: [
      `A three-digit positional numeral must have a non-zero first digit; otherwise the highest ${base}^2 place contributes zero and the value has fewer than three base-${base} digits.`,
      `In ${canonical}, the first digit is 0. Its ${base}^2 contribution is therefore 0 × ${base}^2 = 0.`,
      `So ${canonical} has the same value as ${notation(`${symbol(a)}${symbol(b)}`, base)}, which is only a two-digit numeral.`,
      `The other listed candidates begin with non-zero digits smaller than ${base}, so they genuinely have three base-${base} digits.`,
      `Therefore ${canonical} is the required option.`,
    ],
    examShortcut: [
      `For an n-digit numeral, check only the first digit: it must be non-zero. The option beginning with 0 is not an n-digit numeral.`,
    ],
  });
}

function addDigits(left: readonly number[], right: readonly number[], base: number) {
  const out: number[] = [];
  const trace: Array<Readonly<{ left: number; right: number; carryIn: number; total: number; digit: number; carryOut: number }>> = [];
  let carry = 0;
  for (let i = left.length - 1; i >= 0; i -= 1) {
    const total = left[i]! + right[i]! + carry;
    const digit = total % base;
    const carryOut = Math.floor(total / base);
    trace.push(Object.freeze({ left: left[i]!, right: right[i]!, carryIn: carry, total, digit, carryOut }));
    out.push(digit);
    carry = carryOut;
  }
  if (carry > 0) out.push(carry);
  return { digits: Object.freeze(out.reverse()), trace: Object.freeze(trace), finalCarry: carry };
}

function generateP019(seed: number) {
  const rng = new Rng(seed * 179 + 19);
  const base = rng.int(4, 9);
  const left = [base - 1, rng.int(Math.ceil(base / 2), base - 1), base - 1];
  const right = [rng.int(1, base - 1), rng.int(Math.ceil(base / 2), base - 1), 1];
  const added = addDigits(left, right, base);
  if (added.finalCarry !== 1 || added.digits.length !== 4) throw new Error("P019 failed to force a new leading carry digit.");
  const leftText = left.join("");
  const rightText = right.join("");
  const resultText = added.digits.join("");
  const canonical = notation(resultText, base);
  const sumValue = fromBase(leftText, base) + fromBase(rightText, base);
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(toBase(sumValue - 1, base), base), misconceptionId: "DROP_FINAL_CARRY" },
    { value: notation(toBase(sumValue + 1, base), base), misconceptionId: "CARRY_OFF_BY_ONE" },
    { value: notation(toBase(sumValue + base, base), base), misconceptionId: "SHIFT_FINAL_CARRY" },
    { value: notation(resultText.slice(1), base), misconceptionId: "OMIT_NEW_MOST_SIGNIFICANT_DIGIT" },
  ], seed, rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-019",
    seed,
    difficulty: "MEDIUM",
    taskKind: "ADDITION_WITH_NEW_LEADING_CARRY",
    answerSemantic: "BASE_NUMERAL",
    representation: "COLUMN_ARITHMETIC_CARRY_CHAIN",
    stem: `Add ${notation(leftText, base)} and ${notation(rightText, base)} in base ${base}.`,
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: notation(toBase(sumValue, base), base),
    hiddenState: { base, left, right, leftText, rightText, resultDigits: added.digits, trace: added.trace, finalCarry: added.finalCarry, sumValue },
    fullDerivation: [
      `In base ${base}, each column is split into written digit and carry using total = carry × ${base} + written digit.`,
      ...added.trace.map((step, index) => `Column ${index + 1} from the right: ${step.left} + ${step.right} + carry ${step.carryIn} = ${step.total} = ${step.carryOut} × ${base} + ${step.digit}. Write ${step.digit} and carry ${step.carryOut}.`),
      `After the highest original column, carry ${added.finalCarry} is still left. It becomes a new most-significant digit.`,
      `Thus the four result digits are ${resultText}, so the sum is ${canonical}.`,
    ],
    examShortcut: [
      `When the highest column produces a carry, do not discard it; prepend it to the written digits.`,
      `A decimal-value check gives ${sumValue}, which converts to ${canonical}.`,
    ],
  });
}

function generateP020(seed: number) {
  const rng = new Rng(seed * 181 + 20);
  const base = rng.int(4, 12);
  const a = rng.int(2, base - 1);
  const c = rng.int(1, base - 1);
  const topText = `${symbol(a)}00`;
  const bottomText = `00${symbol(c)}`;
  const resultDigits = [a - 1, base - 1, base - c];
  const resultText = resultDigits.map(symbol).join("");
  const canonical = notation(resultText, base);
  const topValue = fromBase(topText, base);
  const bottomValue = fromBase(bottomText, base);
  const difference = topValue - bottomValue;
  const { options, correctIndex } = buildOptions(canonical, [
    { value: notation(toBase(difference - 1, base), base), misconceptionId: "BORROW_CHAIN_OFF_BY_ONE" },
    { value: notation(toBase(difference + 1, base), base), misconceptionId: "RESTORE_ONE_TOO_MUCH" },
    { value: notation(`${symbol(a)}${symbol(base - 1)}${symbol(base - c)}`, base), misconceptionId: "DO_NOT_REDUCE_HUNDREDS_AFTER_BORROW" },
    { value: notation(`${symbol(a - 1)}0${symbol(base - c)}`, base), misconceptionId: "SKIP_ZERO_COLUMN_BORROW" },
  ], seed, rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-020",
    seed,
    difficulty: "MEDIUM",
    taskKind: "SUBTRACTION_BORROW_CHAIN_ACROSS_ZEROES",
    answerSemantic: "BASE_NUMERAL",
    representation: "COLUMN_ARITHMETIC_BORROW_CHAIN",
    stem: `Evaluate ${notation(topText, base)} − ${notation(bottomText, base)} in base ${base}.`,
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: notation(toBase(difference, base), base),
    hiddenState: { base, a, c, topText, bottomText, resultDigits, resultText, topValue, bottomValue, difference },
    fullDerivation: [
      `Start at the units column: 0 − ${c} cannot be done without borrowing.`,
      `The next (${base}s) digit is also 0, so it cannot lend directly. Borrow one ${base}^2 group from the leading digit ${a}.`,
      `The leading digit becomes ${a} − 1 = ${a - 1}, while the middle column receives ${base} groups of ${base}.`,
      `The middle column now lends one group to the units column, so its digit becomes ${base} − 1 = ${base - 1}.`,
      `The units column receives ${base}; therefore ${base} − ${c} = ${base - c}.`,
      `The result digits are ${a - 1}, ${base - 1}, ${base - c}, giving ${canonical}.`,
    ],
    examShortcut: [
      `Use the identity ${notation(topText, base)} = ${a} × ${base}^2 and ${notation(bottomText, base)} = ${c}.`,
      `${topValue} − ${bottomValue} = ${difference}; converting back to base ${base} gives ${canonical}.`,
    ],
  });
}

function generateP021(seed: number) {
  const rng = new Rng(seed * 191 + 21);
  const mode = seed % 3;
  const bases = Object.freeze(Array.from({ length: 11 }, (_, index) => index + 2));
  let equation: string;
  let validBases: readonly number[];
  let canonical: string;
  let proofLines: string[];
  if (mode === 0) {
    equation = `(10)_b + (1)_b = (20)_b`;
    validBases = Object.freeze(bases.filter((base) => base > 2 && base + 1 === 2 * base));
    canonical = "NO_SOLUTION";
    proofLines = [
      `(10)_b has value b and (1)_b has value 1, while (20)_b has value 2b.`,
      `So the equation becomes b + 1 = 2b.`,
      `Subtract b from both sides: 1 = b.`,
      `But a positional base must satisfy b ≥ 2, and digit 2 in (20)_b additionally requires b > 2. Thus b = 1 is invalid.`,
    ];
  } else if (mode === 1) {
    const targetBase = rng.int(3, 10);
    const target = targetBase + 1;
    equation = `(10)_b + (1)_b = ${target} in decimal`;
    validBases = Object.freeze(bases.filter((base) => base + 1 === target));
    canonical = "ONE_SOLUTION";
    proofLines = [
      `(10)_b has decimal value b and (1)_b has value 1.`,
      `Therefore b + 1 = ${target}.`,
      `Subtract 1 from both sides: b = ${target} − 1 = ${targetBase}.`,
      `${targetBase} lies in the allowed range 2 ≤ b ≤ 12, so exactly one base works.`,
    ];
  } else {
    equation = `(10)_b + (1)_b = (11)_b`;
    validBases = bases;
    canonical = "MULTIPLE_SOLUTIONS";
    proofLines = [
      `(10)_b has value b and (1)_b has value 1.`,
      `(11)_b has value 1 × b + 1 = b + 1.`,
      `So the equation is b + 1 = b + 1, an identity for every allowed base.`,
      `All bases 2 through 12 satisfy the equation, so there are multiple solutions.`,
    ];
  }
  const verifierClass = validBases.length === 0 ? "NO_SOLUTION" : validBases.length === 1 ? "ONE_SOLUTION" : "MULTIPLE_SOLUTIONS";
  const { options, correctIndex } = buildOptions(canonical, [
    { value: "NO_SOLUTION", misconceptionId: "REJECT_VALID_BASE_STATES" },
    { value: "ONE_SOLUTION", misconceptionId: "ASSUME_UNIQUE_BASE" },
    { value: "MULTIPLE_SOLUTIONS", misconceptionId: "MISS_BOUNDED_IDENTITY_OR_MULTIPLE_BASES" },
    { value: "CANNOT_DETERMINE", misconceptionId: "DO_NOT_ENUMERATE_BOUNDED_BASES" },
  ], seed, rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-021",
    seed,
    difficulty: "HARD",
    taskKind: "UNKNOWN_BASE_SOLUTION_TOPOLOGY",
    answerSemantic: "SOLUTION_CLASS",
    representation: "BOUNDED_BASE_EQUATION_CLASSIFICATION",
    stem: `For integer bases 2 ≤ b ≤ 12, classify the solutions of ${equation}.`,
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: verifierClass,
    hiddenState: { mode, equation, bases, validBases, solutionCount: validBases.length },
    fullDerivation: [
      `Translate each base-b numeral into its positional value before solving for the base.`,
      ...proofLines,
      `The bounded verifier set is ${validBases.length ? validBases.join(", ") : "empty"}.`,
      `Therefore the correct solution class is ${canonical}.`,
    ],
    examShortcut: [
      `Replace (10)_b by b immediately; (11)_b becomes b + 1 and (20)_b becomes 2b.`,
      `The resulting one-line equation tells whether there are zero, one or many valid bases in the declared interval.`,
    ],
  });
}

function generateP022(seed: number) {
  const rng = new Rng(seed * 193 + 22);
  const canonical = "2";
  const { options, correctIndex } = buildOptions(canonical, [
    { value: "1", misconceptionId: "ALLOW_UNARY_AS_POSITIONAL_BASE" },
    { value: "0", misconceptionId: "CONFUSE_ZERO_DIGIT_WITH_ZERO_BASE" },
    { value: "10", misconceptionId: "ASSUME_DECIMAL_ONLY" },
    { value: "3", misconceptionId: "ADD_ONE_TO_ZERO_INSTEAD_OF_BASE_MINIMUM" },
  ], seed, rng);
  return packageOf({
    prototypeId: "NUM-CP013-PROT-022",
    seed,
    difficulty: "EASY",
    taskKind: "ZERO_NUMERAL_MINIMUM_BASE_BOUNDARY",
    answerSemantic: "BASE",
    representation: "BASE_BOUNDARY_CLAIM",
    stem: rng.pick([
      `The numeral (0)_b represents zero. What is the smallest positional base b allowed by the chapter convention?`,
      `What is the minimum valid positional base for the one-digit numeral (0)_b?`,
      `For the numeral (0)_b, what is the least permitted integer base b?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: "2",
    hiddenState: { digit: 0, minimumPositionalBase: 2, zeroValidInEveryBaseAtLeastTwo: true },
    fullDerivation: [
      `A positional base in this chapter must satisfy b ≥ 2.`,
      `The single digit 0 is valid whenever 0 < b. In particular it is valid in base 2 because 0 < 2.`,
      `Base 1 is not included in ordinary positional base-b notation here, so no smaller allowed integer base exists.`,
      `Therefore the minimum valid base is 2.`,
    ],
    examShortcut: [
      `The smallest ordinary positional base is binary, base 2; digit 0 is valid there.`,
    ],
  });
}

export function generateNumCp013Wave03(prototypeId: NumCp013Wave03PrototypeId, seed: number): NumCp013Wave03Package {
  assertSeed(seed);
  switch (prototypeId) {
    case "NUM-CP013-PROT-015": return generateP015(seed);
    case "NUM-CP013-PROT-016": return generateP016(seed);
    case "NUM-CP013-PROT-017": return generateP017(seed);
    case "NUM-CP013-PROT-018": return generateP018(seed);
    case "NUM-CP013-PROT-019": return generateP019(seed);
    case "NUM-CP013-PROT-020": return generateP020(seed);
    case "NUM-CP013-PROT-021": return generateP021(seed);
    case "NUM-CP013-PROT-022": return generateP022(seed);
  }
}
