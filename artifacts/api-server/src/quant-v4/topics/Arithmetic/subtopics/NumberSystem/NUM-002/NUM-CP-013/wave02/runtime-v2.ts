import { createHash } from "node:crypto";

import type { NumCp013Option } from "../wave01/types.ts";
import { generateNumCp013Wave02 as generateWave02V1 } from "./runtime.ts";
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

function symbol(value: number) {
  const out = SYMBOLS[value];
  if (!out) throw new Error(`NUM-CP-013 unsupported digit value ${value}.`);
  return out;
}

function notation(text: string, base: number) { return `(${text})_${base}`; }

function shuffle<T>(items: readonly T[], rng: Rng) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256").update(JSON.stringify({ prototypeId, state })).digest("hex");
}

function lifecycle() {
  return Object.freeze({
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
}

const ancestry = Object.freeze([
  "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-013",
  "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY:NUM-CP-013",
  "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
  "NUM-CP-013-WAVE01-FOUNDATION",
]);

function generateP010V2(seed: number): NumCp013Wave02Package {
  const rng = new Rng(seed * 139 + 10);
  const base = rng.int(2, 15);
  const invalidDigit = base;
  const invalidSymbol = symbol(invalidDigit);
  const invalidText = `1${invalidSymbol}0`;

  // These three are distinct and valid even in base 2.
  const validTexts = ["10", "11", "101"] as const;
  const raw: NumCp013Option[] = [
    { value: notation(invalidText, base), isCorrect: true, misconceptionId: "CORRECT" },
    ...validTexts.map((text) => ({
      value: notation(text, base),
      isCorrect: false,
      misconceptionId: "REJECT_VALID_DIGIT_PATTERN",
    })),
  ];
  const options = Object.freeze(shuffle(raw, rng).map((option) => Object.freeze(option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const canonicalAnswer = notation(invalidText, base);
  const hiddenState = Object.freeze({
    base,
    invalidDigit,
    invalidSymbol,
    invalidText,
    validTexts,
    candidateTexts: options.map((option) => option.value),
  });

  return Object.freeze({
    packageId: "NUM-002" as const,
    checkpointId: "NUM-CP-013" as const,
    temporaryPrototypeId: "NUM-CP013-PROT-010" as const,
    seed,
    locale: "en-IN" as const,
    difficulty: base > 10 ? "MEDIUM" as const : "EASY" as const,
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
    canonicalAnswer,
    verifierAnswer: canonicalAnswer,
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP013-PROT-010", hiddenState),
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
      fullDerivation: Object.freeze([
        `In base ${base}, an allowed digit must have value d satisfying 0 ≤ d < ${base}.`,
        ...(base > 10 ? ["For letter digits, A = 10, B = 11, C = 12, D = 13, E = 14 and F = 15."] : []),
        `${notation("10", base)} is valid because its digit values are 1 and 0, both below ${base}.`,
        `${notation("11", base)} is valid because both digit values are 1, below ${base}.`,
        `${notation("101", base)} is valid because every digit is either 0 or 1, below ${base}.`,
        `${invalidSymbol} has digit value ${invalidDigit}. In ${canonicalAnswer}, that digit value equals the base instead of being smaller than it.`,
        `Therefore ${canonicalAnswer} is not a valid base-${base} numeral.`,
      ]),
      examShortcut: Object.freeze([
        `Only scan for a digit whose value is at least the base. ${invalidSymbol} = ${invalidDigit} = base ${base}, so it is illegal immediately.`,
      ]),
      finalAnswer: canonicalAnswer,
    }),
    sourceAncestry: ancestry,
    prototypeAncestry: Object.freeze(["NUM-CP013-PROT-010", "NUM-CP-013-WAVE02", "VALIDITY-OPTION-HARDENING-V2"]),
    lifecycle: lifecycle(),
  });
}

function generateP012V2(seed: number): NumCp013Wave02Package {
  const rng = new Rng(seed * 151 + 12);
  const lower = rng.int(2, 12);
  // Cap at 15 so the zero-valid-base edge can still be represented using F=15.
  const minUpper = Math.min(15, lower + 2);
  const maxUpper = Math.min(15, lower + 5);
  const upper = rng.int(minUpper, maxUpper);
  const mode = seed % 3;

  let maxDigit: number;
  if (mode === 0) {
    // No base in [lower, upper] is valid: choose a digit equal to the largest candidate base.
    maxDigit = upper;
  } else if (mode === 1) {
    // Exactly one base is valid: only b=upper is strictly greater than upper-1.
    maxDigit = upper - 1;
  } else {
    // Several bases are valid; keep the largest digit below the lower end when possible.
    maxDigit = rng.int(1, Math.max(1, lower - 1));
  }

  const first = Math.max(1, Math.min(maxDigit, rng.int(1, Math.max(1, maxDigit))));
  const middle = rng.int(0, maxDigit);
  const digits = Object.freeze([first, middle, maxDigit]);
  const text = digits.map(symbol).join("");
  const candidateBases = Object.freeze(Array.from({ length: upper - lower + 1 }, (_, index) => lower + index));
  const validBases = Object.freeze(candidateBases.filter((base) => digits.every((digit) => digit < base)));
  const count = validBases.length;

  if (mode === 0 && count !== 0) throw new Error(`NUM-CP013-PROT-012/${seed}: zero-solution class construction drift.`);
  if (mode === 1 && count !== 1) throw new Error(`NUM-CP013-PROT-012/${seed}: one-solution class construction drift.`);
  if (mode === 2 && count < 2) throw new Error(`NUM-CP013-PROT-012/${seed}: multi-solution class construction drift.`);

  const candidateCounts = [
    count,
    Math.max(0, count - 1),
    count + 1,
    candidateBases.length,
    Math.max(0, upper - maxDigit),
    0,
    1,
  ];
  const uniqueDistractors: number[] = [];
  for (const value of candidateCounts) {
    if (value === count || uniqueDistractors.includes(value)) continue;
    uniqueDistractors.push(value);
    if (uniqueDistractors.length === 3) break;
  }
  if (uniqueDistractors.length !== 3) throw new Error(`NUM-CP013-PROT-012/${seed}: insufficient distinct count distractors.`);

  const raw: NumCp013Option[] = [
    { value: String(count), isCorrect: true, misconceptionId: "CORRECT" },
    { value: String(uniqueDistractors[0]), isCorrect: false, misconceptionId: "EXCLUDE_ONE_VALID_ENDPOINT" },
    { value: String(uniqueDistractors[1]), isCorrect: false, misconceptionId: "INCLUDE_ONE_INVALID_BASE" },
    { value: String(uniqueDistractors[2]), isCorrect: false, misconceptionId: "ASSUME_ALL_BOUNDED_BASES_VALID" },
  ];
  const options = Object.freeze(shuffle(raw, rng).map((option) => Object.freeze(option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const canonicalAnswer = String(count);
  const hiddenState = Object.freeze({ lower, upper, mode, maxDigit, digits, text, candidateBases, validBases, count });

  return Object.freeze({
    packageId: "NUM-002" as const,
    checkpointId: "NUM-CP-013" as const,
    temporaryPrototypeId: "NUM-CP013-PROT-012" as const,
    seed,
    locale: "en-IN" as const,
    difficulty: "MEDIUM" as const,
    taskKind: "COUNT_VALID_BASES_IN_RANGE",
    answerSemantic: "COUNT",
    representation: "BASE_CANDIDATE_TABLE",
    stem: rng.pick([
      `For how many integer bases b with ${lower} ≤ b ≤ ${upper} is (${text})_b a valid numeral?`,
      `Count the bases b in the interval [${lower}, ${upper}] for which (${text})_b is valid.`,
      `How many values of b from ${lower} through ${upper} can legally be the base of (${text})_b?`,
    ] as const),
    options,
    correctIndex,
    canonicalAnswer,
    verifierAnswer: String(candidateBases.filter((base) => digits.every((digit) => digit < base)).length),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP013-PROT-012", hiddenState),
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
      fullDerivation: Object.freeze([
        `A base-b numeral is valid only when every digit value is less than b.`,
        `The largest digit in ${text} is ${symbol(maxDigit)}, whose value is ${maxDigit}.`,
        `Therefore the base must satisfy b > ${maxDigit}, equivalently b ≥ ${maxDigit + 1}.`,
        `The question independently restricts b to the integers ${candidateBases.join(", ")}.`,
        ...candidateBases.map((base) => `For b = ${base}, ${maxDigit} < ${base} is ${maxDigit < base ? "true" : "false"}; therefore base ${base} is ${maxDigit < base ? "valid" : "invalid"}.`),
        `The valid bases are ${validBases.length ? validBases.join(", ") : "none"}.`,
        `Hence the required count is ${count}.`,
      ]),
      examShortcut: Object.freeze([
        `Use only the largest digit: b must be greater than ${maxDigit}. Count the integers in [${lower}, ${upper}] above ${maxDigit}; there are ${count}.`,
      ]),
      finalAnswer: canonicalAnswer,
    }),
    sourceAncestry: ancestry,
    prototypeAncestry: Object.freeze(["NUM-CP013-PROT-012", "NUM-CP-013-WAVE02", "BOUNDED-BASE-CLASS-HARDENING-V2"]),
    lifecycle: lifecycle(),
  });
}

/** Canonical Wave02 entry after validity-option and bounded-base edge hardening. */
export function generateNumCp013Wave02(prototypeId: NumCp013Wave02PrototypeId, seed: number): NumCp013Wave02Package {
  if (prototypeId === "NUM-CP013-PROT-010") return generateP010V2(seed);
  if (prototypeId === "NUM-CP013-PROT-012") return generateP012V2(seed);
  return generateWave02V1(prototypeId, seed);
}
