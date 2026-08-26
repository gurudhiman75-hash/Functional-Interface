import { createHash } from "node:crypto";

import { generateNumCp013Wave01 as generateWave01V1 } from "./runtime.ts";
import type {
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

function positionalValue(digits: readonly number[], base: number) {
  return digits.reduce((value, digit) => value * base + digit, 0);
}

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

function misconceptionForBase(candidate: number, correct: number, minimum: number) {
  if (candidate < minimum) return "ALLOW_DIGIT_NOT_LESS_THAN_BASE";
  if (candidate === minimum) return "USE_MINIMUM_VALID_BASE_WITHOUT_VALUE_CHECK";
  if (candidate === correct - 1) return "USE_BASE_MINUS_ONE";
  if (candidate === correct + 1) return "USE_BASE_PLUS_ONE";
  return "WRONG_BOUNDED_BASE";
}

function generateP006V2(seed: number): NumCp013Wave01Package {
  const rng = new Rng(seed * 113 + 6);
  const base = rng.int(4, 10);
  const digits = Object.freeze([
    rng.int(1, base - 1),
    rng.int(0, base - 1),
    rng.int(0, base - 1),
  ]);
  const [a, d, c] = digits;
  const numeral = digits.join("");
  const decimal = positionalValue(digits, base);
  const minBase = Math.max(...digits) + 1;
  const candidates = Object.freeze(Array.from({ length: 13 - minBase }, (_, index) => minBase + index)
    .map((candidateBase) => Object.freeze({ base: candidateBase, value: positionalValue(digits, candidateBase) })));
  const valid = candidates.filter((candidate) => candidate.value === decimal);
  if (valid.length !== 1 || valid[0]!.base !== base) {
    throw new Error("NUM-CP013-PROT-006: bounded independent base verifier lost uniqueness.");
  }

  const preference = [
    base - 1,
    base + 1,
    minBase - 1,
    base + 2,
    minBase,
    base - 2,
    12,
    2,
    11,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
  ];
  const distractorBases: number[] = [];
  for (const candidate of preference) {
    if (candidate < 2 || candidate > 12 || candidate === base || distractorBases.includes(candidate)) continue;
    distractorBases.push(candidate);
    if (distractorBases.length === 3) break;
  }
  if (distractorBases.length !== 3) throw new Error("NUM-CP013-PROT-006: failed to construct three distinct base distractors.");

  const rawOptions: NumCp013Option[] = [
    { value: String(base), isCorrect: true, misconceptionId: "CORRECT" },
    ...distractorBases.map((candidate) => ({
      value: String(candidate),
      isCorrect: false,
      misconceptionId: misconceptionForBase(candidate, base, minBase),
    })),
  ];
  const options = Object.freeze(shuffle(rawOptions, rng).map((option) => Object.freeze(option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const hiddenState = Object.freeze({
    digits,
    numeral,
    decimal,
    base,
    minBase,
    candidates,
    distractorBases: Object.freeze([...distractorBases]),
  });

  const stem = rng.pick([
    `If (${numeral})_b = ${decimal} in decimal, find b.`,
    `The numeral (${numeral})_b represents the decimal integer ${decimal}. What is the base b?`,
    `Find the integer base b if ${a}b^2 + ${d}b + ${c} = ${decimal}.`,
  ] as const);

  return Object.freeze({
    packageId: "NUM-002" as const,
    checkpointId: "NUM-CP-013" as const,
    temporaryPrototypeId: "NUM-CP013-PROT-006" as const,
    seed,
    locale: "en-IN" as const,
    difficulty: "HARD" as const,
    taskKind: "UNKNOWN_BASE_FROM_DECIMAL_EQUALITY",
    answerSemantic: "BASE",
    representation: "BASE_CANDIDATE_EQUATION",
    stem,
    options,
    correctIndex,
    canonicalAnswer: String(base),
    verifierAnswer: String(valid[0]!.base),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP013-PROT-006", hiddenState),
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
      fullDerivation: Object.freeze([
        `For the three-digit numeral (${numeral})_b, the left, middle and right places are worth b^2, b and 1 respectively.`,
        `Therefore (${numeral})_b = ${a} × b^2 + ${d} × b + ${c} × 1 = ${a}b^2 + ${d}b + ${c}.`,
        `The largest digit is ${Math.max(...digits)}, so digit validity requires b > ${Math.max(...digits)}; hence b ≥ ${minBase}.`,
        `Substitute b = ${base}: ${a} × ${base}^2 + ${d} × ${base} + ${c}.`,
        `${base}^2 = ${base ** 2}; therefore the value is ${a} × ${base ** 2} + ${d * base} + ${c} = ${a * base ** 2} + ${d * base} + ${c} = ${decimal}.`,
        `So b = ${base} satisfies the stated decimal equality.`,
        `For every valid b ≥ ${minBase}, the expression ${a}b^2 + ${d}b + ${c} strictly increases because ${a} is positive and the other coefficients are non-negative.`,
        `Therefore two different valid bases cannot produce the same decimal value ${decimal}; the solution is unique.`,
        `Hence b = ${base}.`,
      ]),
      examShortcut: Object.freeze([
        `First note b ≥ ${minBase} from the largest digit.`,
        `Test the likely nearby base ${base}: the expansion equals ${decimal} exactly, and monotonicity makes that hit unique.`,
      ]),
      finalAnswer: String(base),
    }),
    sourceAncestry: Object.freeze([
      "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-013",
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY:NUM-CP-013",
      "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
    ]),
    prototypeAncestry: Object.freeze(["NUM-CP013-PROT-006", "NUM-CP-013-WAVE01", "P006-DISTRACTOR-HARDENING-V2"]),
    lifecycle: Object.freeze({
      maturity: "DISCOVERY_PROTOTYPE" as const,
      reviewStatus: "WAVE01_REVIEW_REQUIRED" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

/**
 * Canonical Wave01 entry after the bounded-base distractor hardening.
 * P001..P005 and P007..P008 retain the original foundation runtime;
 * P006 is regenerated with a complete distinct-option construction over bases 2..12.
 */
export function generateNumCp013Wave01(prototypeId: NumCp013Wave01PrototypeId, seed: number): NumCp013Wave01Package {
  if (prototypeId === "NUM-CP013-PROT-006") return generateP006V2(seed);
  return generateWave01V1(prototypeId, seed);
}
