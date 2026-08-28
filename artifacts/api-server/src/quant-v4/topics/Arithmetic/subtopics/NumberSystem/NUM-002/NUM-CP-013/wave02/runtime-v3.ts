import { createHash } from "node:crypto";

import type { NumCp013Option } from "../wave01/types.ts";
import { generateNumCp013Wave02 as generateWave02V2 } from "./runtime-v2.ts";
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

function generateP012V3(seed: number): NumCp013Wave02Package {
  const rng = new Rng(seed * 151 + 12);
  const lower = rng.int(2, 12);
  const minUpper = Math.min(15, lower + 2);
  const maxUpper = Math.min(15, lower + 5);
  const upper = rng.int(minUpper, maxUpper);
  const mode = seed % 3;

  const maxDigit = mode === 0
    ? upper
    : mode === 1
      ? upper - 1
      : rng.int(1, Math.max(1, lower - 1));

  const first = rng.int(1, Math.max(1, maxDigit));
  const middle = rng.int(0, maxDigit);
  const digits = Object.freeze([first, middle, maxDigit]);
  const text = digits.map(symbol).join("");
  const candidateBases = Object.freeze(Array.from({ length: upper - lower + 1 }, (_, index) => lower + index));
  const validBases = Object.freeze(candidateBases.filter((base) => digits.every((digit) => digit < base)));
  const count = validBases.length;

  if (mode === 0 && count !== 0) throw new Error(`NUM-CP013-PROT-012/${seed}: zero-valid-base class drift.`);
  if (mode === 1 && count !== 1) throw new Error(`NUM-CP013-PROT-012/${seed}: one-valid-base class drift.`);
  if (mode === 2 && count < 2) throw new Error(`NUM-CP013-PROT-012/${seed}: multi-valid-base class drift.`);

  const distractorPool = [
    Math.max(0, count - 1),
    count + 1,
    count + 2,
    count + 3,
    candidateBases.length,
    candidateBases.length + 1,
    Math.max(0, upper - maxDigit),
    0,
    1,
    2,
    3,
  ];
  const distractors: number[] = [];
  for (const value of distractorPool) {
    if (value === count || distractors.includes(value)) continue;
    distractors.push(value);
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`NUM-CP013-PROT-012/${seed}: three distinct distractors were not constructed.`);

  const raw: NumCp013Option[] = [
    { value: String(count), isCorrect: true, misconceptionId: "CORRECT" },
    { value: String(distractors[0]), isCorrect: false, misconceptionId: "EXCLUDE_ONE_VALID_ENDPOINT" },
    { value: String(distractors[1]), isCorrect: false, misconceptionId: "INCLUDE_ONE_INVALID_BASE" },
    { value: String(distractors[2]), isCorrect: false, misconceptionId: "BOUNDED_BASE_COUNT_ERROR" },
  ];
  const options = Object.freeze(shuffle(raw, rng).map((option) => Object.freeze(option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const canonicalAnswer = String(count);
  const hiddenState = Object.freeze({ lower, upper, mode, maxDigit, digits, text, candidateBases, validBases, count, distractors: Object.freeze(distractors) });
  const sourceAncestry = Object.freeze([
    "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-013",
    "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY:NUM-CP-013",
    "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
    "NUM-CP-013-WAVE01-FOUNDATION",
  ]);

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
        `A numeral in base b is legal only when every digit value is strictly smaller than b.`,
        `The largest digit in ${text} is ${symbol(maxDigit)}, whose numeric value is ${maxDigit}.`,
        `Therefore b must satisfy b > ${maxDigit}; the first possible base from digit validity alone is ${maxDigit + 1}.`,
        `The question separately limits b to ${candidateBases.join(", ")}.`,
        ...candidateBases.map((base) => `Check b = ${base}: ${maxDigit} < ${base} is ${maxDigit < base ? "true" : "false"}, so base ${base} is ${maxDigit < base ? "valid" : "invalid"}.`),
        `After checking the complete bounded set, the valid bases are ${validBases.length ? validBases.join(", ") : "none"}.`,
        `Thus the number of valid bases is ${count}.`,
      ]),
      examShortcut: Object.freeze([
        `Use only the largest digit: count bases in [${lower}, ${upper}] satisfying b > ${maxDigit}. That count is ${count}.`,
      ]),
      finalAnswer: canonicalAnswer,
    }),
    sourceAncestry,
    prototypeAncestry: Object.freeze(["NUM-CP013-PROT-012", "NUM-CP-013-WAVE02", "BOUNDED-BASE-COUNT-HARDENING-V3"]),
    lifecycle: Object.freeze({
      maturity: "DISCOVERY_PROTOTYPE" as const,
      reviewStatus: "WAVE02_REVIEW_REQUIRED" as const,
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

/** Final Wave02 entry after zero/one/multiple bounded-base option hardening. */
export function generateNumCp013Wave02(prototypeId: NumCp013Wave02PrototypeId, seed: number): NumCp013Wave02Package {
  if (prototypeId === "NUM-CP013-PROT-012") return generateP012V3(seed);
  return generateWave02V2(prototypeId, seed);
}
