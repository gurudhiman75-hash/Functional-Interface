import { createHash } from "node:crypto";

import type { NumCp013Option } from "../wave01/types.ts";
import { generateNumCp013Wave02 as generateWave02V3 } from "./runtime-v3.ts";
import type { NumCp013Wave02Package, NumCp013Wave02PrototypeId } from "./types.ts";

const SYMBOLS = "0123456789ABCDEF";
class Rng {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next() { this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0; return this.state / 0x1_0000_0000; }
  int(min: number, max: number) { return min + Math.floor(this.next() * (max - min + 1)); }
}
type Candidate = Readonly<{ value: string; misconceptionId: string }>;

function symbol(value: number) {
  const out = SYMBOLS[value];
  if (!out) throw new Error(`NUM-CP-013 unsupported digit value ${value}.`);
  return out;
}
function digitValue(ch: string) {
  const value = SYMBOLS.indexOf(ch.toUpperCase());
  if (value < 0) throw new Error(`Unsupported digit symbol ${ch}.`);
  return value;
}
function fromBase(text: string, base: number) {
  let value = 0;
  for (const ch of text) {
    const digit = digitValue(ch);
    if (digit >= base) throw new Error(`Digit ${ch} invalid in base ${base}.`);
    value = value * base + digit;
  }
  return value;
}
function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256").update(JSON.stringify({ prototypeId, state })).digest("hex");
}
function balancedOptions(correct: string, candidates: readonly Candidate[], seed: number, rng: Rng) {
  const unique: Candidate[] = [];
  const seen = new Set([correct]);
  for (const candidate of candidates) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    unique.push(candidate);
    if (unique.length === 3) break;
  }
  if (unique.length !== 3) throw new Error(`Wave02 V4 insufficient distractors for ${correct}.`);
  for (let i = unique.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [unique[i], unique[j]] = [unique[j]!, unique[i]!];
  }
  const correctIndex = (seed - 1) % 4;
  const options: NumCp013Option[] = [];
  let d = 0;
  for (let i = 0; i < 4; i += 1) {
    if (i === correctIndex) options.push({ value: correct, isCorrect: true, misconceptionId: "CORRECT" });
    else {
      const candidate = unique[d++]!;
      options.push({ value: candidate.value, isCorrect: false, misconceptionId: candidate.misconceptionId });
    }
  }
  return { options: Object.freeze(options.map((option) => Object.freeze(option))), correctIndex };
}

const sourceAncestry = Object.freeze([
  "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-013",
  "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY:NUM-CP-013",
  "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
  "NUM-CP-013-WAVE01-FOUNDATION",
]);
const lifecycle = Object.freeze({
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
function makePackage(input: Readonly<{
  prototypeId: "NUM-CP013-PROT-011" | "NUM-CP013-PROT-013";
  seed: number;
  taskKind: string;
  answerSemantic: string;
  representation: string;
  stem: string;
  options: readonly NumCp013Option[];
  correctIndex: number;
  answer: string;
  verifier: string;
  hiddenState: Readonly<Record<string, unknown>>;
  derivation: readonly string[];
  shortcut: readonly string[];
  marker: string;
}>): NumCp013Wave02Package {
  if (input.answer !== input.verifier) throw new Error(`${input.prototypeId}: V4 verifier drift.`);
  if (input.options[input.correctIndex]?.value !== input.answer || !input.options[input.correctIndex]?.isCorrect) throw new Error(`${input.prototypeId}: V4 binding drift.`);
  return Object.freeze({
    packageId: "NUM-002" as const,
    checkpointId: "NUM-CP-013" as const,
    temporaryPrototypeId: input.prototypeId,
    seed: input.seed,
    locale: "en-IN" as const,
    difficulty: input.prototypeId === "NUM-CP013-PROT-013" ? "HARD" as const : "MEDIUM" as const,
    taskKind: input.taskKind,
    answerSemantic: input.answerSemantic,
    representation: input.representation,
    stem: input.stem,
    options: input.options,
    correctIndex: input.correctIndex,
    canonicalAnswer: input.answer,
    verifierAnswer: input.verifier,
    hiddenState: Object.freeze({ ...input.hiddenState }),
    mathematicalFingerprint: fingerprint(input.prototypeId, input.hiddenState),
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
      fullDerivation: Object.freeze([...input.derivation]),
      examShortcut: Object.freeze([...input.shortcut]),
      finalAnswer: input.answer,
    }),
    sourceAncestry,
    prototypeAncestry: Object.freeze([input.prototypeId, "NUM-CP-013-WAVE02", input.marker]),
    lifecycle,
  });
}

function generateP011PlaceValue(seed: number): NumCp013Wave02Package {
  const rng = new Rng(seed * 149 + 11);
  const base = rng.int(3, 16);
  const digits = [rng.int(1, base - 1), rng.int(0, base - 1), rng.int(0, base - 1), rng.int(0, base - 1)];
  const index = rng.int(0, 3);
  if (digits[index] === 0) digits[index] = rng.int(1, base - 1);
  const digit = digits[index]!;
  const power = 3 - index;
  const placeWeight = base ** power;
  const answer = digit * placeWeight;
  const text = digits.map(symbol).join("");
  const wholeValue = digits.reduce((value, d) => value * base + d, 0);
  const { options, correctIndex } = balancedOptions(String(answer), [
    { value: String(digit), misconceptionId: "RETURN_FACE_VALUE" },
    { value: String(placeWeight), misconceptionId: "RETURN_PLACE_WEIGHT_ONLY" },
    { value: String(wholeValue), misconceptionId: "RETURN_WHOLE_NUMERAL_VALUE" },
    { value: String(answer + 1), misconceptionId: "PLACE_VALUE_OFF_BY_ONE" },
    { value: String(Math.max(0, answer - 1)), misconceptionId: "PLACE_VALUE_OFF_BY_ONE" },
    { value: String(answer + base), misconceptionId: "SHIFT_ONE_BASE_GROUP" },
  ], seed, rng);
  return makePackage({
    prototypeId: "NUM-CP013-PROT-011",
    seed,
    taskKind: "PLACE_VALUE_IN_BASE",
    answerSemantic: "PLACE_VALUE",
    representation: "POSITIONAL_EXPANSION_TABLE",
    stem: `What is the decimal place value contributed by the digit ${symbol(digit)} in position ${index + 1} from the left of (${text})_${base}?`,
    options,
    correctIndex,
    answer: String(answer),
    verifier: String(digit * base ** power),
    hiddenState: { mode: 0, base, digits, text, index, power, contribution: answer, placeWeight, wholeValue },
    derivation: [
      `The four positions in (${text})_${base}, from left to right, have weights ${base}^3, ${base}^2, ${base}^1 and ${base}^0.`,
      `The selected digit ${symbol(digit)} has numeric value ${digit} and is in the power-${power} position.`,
      `Its place weight is ${base}^${power} = ${placeWeight}.`,
      `Place-value contribution = digit value × place weight = ${digit} × ${placeWeight}.`,
      `${digit} × ${placeWeight} = ${answer}.`,
      `Therefore the required decimal place value is ${answer}.`,
    ],
    shortcut: [`Count powers from the right starting at 0, then compute ${digit} × ${base}^${power} = ${answer}.`],
    marker: "P011-PLACE-VALUE-DISTRACTOR-HARDENING-V4",
  });
}

function generateP013(seed: number): NumCp013Wave02Package {
  const rng = new Rng(seed * 157 + 13);
  const base = rng.int(6, 12);
  const maxLead = Math.max(1, Math.floor((base - 2) / 2));
  const a = rng.int(1, maxLead);
  const c = rng.int(1, maxLead);
  const p = rng.int(Math.ceil(base / 2), base - 1);
  const q = rng.int(base - p, base - 1);
  const s = p + q - base;
  const r = a + c + 1;
  if (r >= base) throw new Error("P013 V4 leading result digit exceeded base.");
  const leftText = `${symbol(a)}${symbol(p)}`;
  const rightText = `${symbol(c)}${symbol(q)}`;
  const resultText = `${symbol(r)}${symbol(s)}`;
  const minBase = Math.max(a, p, c, q, r, s) + 1;
  const solutions = Array.from({ length: 17 - minBase }, (_, index) => minBase + index)
    .filter((candidateBase) => fromBase(leftText, candidateBase) + fromBase(rightText, candidateBase) === fromBase(resultText, candidateBase));
  if (solutions.length !== 1 || solutions[0] !== base) throw new Error("P013 V4 lost bounded base uniqueness.");
  const { options, correctIndex } = balancedOptions(String(base), [
    { value: String(base - 1), misconceptionId: "BASE_MINUS_ONE" },
    { value: String(base + 1), misconceptionId: "BASE_PLUS_ONE" },
    { value: String(Math.max(2, minBase - 1)), misconceptionId: "ALLOW_DIGIT_EQUAL_TO_BASE" },
    { value: String(Math.max(2, base - 2)), misconceptionId: "DROP_ONE_CARRY_GROUP" },
    { value: String(Math.min(16, base + 2)), misconceptionId: "CARRY_EQUATION_PLUS_TWO" },
    { value: String(Math.min(16, base + 3)), misconceptionId: "TRIAL_BASE_ERROR" },
  ], seed, rng);
  const leftValue = fromBase(leftText, base);
  const rightValue = fromBase(rightText, base);
  const resultValue = fromBase(resultText, base);
  return makePackage({
    prototypeId: "NUM-CP013-PROT-013",
    seed,
    taskKind: "UNKNOWN_BASE_FROM_ARITHMETIC_STATEMENT",
    answerSemantic: "BASE",
    representation: "BASE_COLUMN_EQUATION",
    stem: `In base b, (${leftText})_b + (${rightText})_b = (${resultText})_b. Find b.`,
    options,
    correctIndex,
    answer: String(base),
    verifier: String(solutions[0]),
    hiddenState: { base, a, p, c, q, r, s, leftText, rightText, resultText, minBase, solutions, leftValue, rightValue, resultValue },
    derivation: [
      `Expand each two-digit numeral: (${leftText})_b = ${a}b + ${p}, (${rightText})_b = ${c}b + ${q}, and (${resultText})_b = ${r}b + ${s}.`,
      `Therefore (${a}b + ${p}) + (${c}b + ${q}) = ${r}b + ${s}.`,
      `Combine the left side: ${a + c}b + ${p + q} = ${r}b + ${s}.`,
      `Move terms: ${p + q - s} = (${r} − ${a + c})b.`,
      `Since r = a + c + 1, ${r} − ${a + c} = 1.`,
      `Hence b = ${p + q} − ${s} = ${p + q - s} = ${base}.`,
      `Digit validity requires b ≥ ${minBase}; ${base} satisfies this.`,
      `Verification: ${leftValue} + ${rightValue} = ${resultValue}.`,
    ],
    shortcut: [`Use the units column: ${p} + ${q} = b + ${s}, so b = ${p} + ${q} − ${s} = ${base}.`],
    marker: "P013-DISTRACTOR-AND-POSITION-HARDENING-V4",
  });
}

/** Canonical Wave02 entry after all known discovery hardening. */
export function generateNumCp013Wave02(prototypeId: NumCp013Wave02PrototypeId, seed: number): NumCp013Wave02Package {
  if (prototypeId === "NUM-CP013-PROT-011" && seed % 4 === 0) return generateP011PlaceValue(seed);
  if (prototypeId === "NUM-CP013-PROT-013") return generateP013(seed);
  return generateWave02V3(prototypeId, seed);
}
