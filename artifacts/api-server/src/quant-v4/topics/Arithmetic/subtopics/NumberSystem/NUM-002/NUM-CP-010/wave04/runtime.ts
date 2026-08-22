import { createHash } from "node:crypto";

import type { NumCp010Option } from "../wave01/types.ts";
import type { NumCp010Wave04Package, NumCp010Wave04PrototypeId } from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE04_SATURATION_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }
  int(min: number, max: number) { return min + Math.floor(this.next() * (max - min + 1)); }
}

function shuffle<T>(values: readonly T[], rng: Rng) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function options(correct: number, wrong: readonly number[], rng: Rng): readonly NumCp010Option[] {
  const values = [correct];
  for (const value of wrong) if (!values.includes(value) && value >= 0) values.push(value);
  let delta = 1;
  while (values.length < 4) {
    if (!values.includes(correct + delta)) values.push(correct + delta);
    delta += 1;
  }
  return Object.freeze(shuffle(values.slice(0, 4), rng).map((value, index) => Object.freeze({
    value: String(value),
    isCorrect: value === correct,
    misconceptionId: value === correct ? "CORRECT" : `DISTRACTOR_${index + 1}`,
  })));
}

function bruteZeroCount(upper: number) {
  let count = 0;
  for (let n = 1; n <= upper; n += 1) {
    for (const ch of String(n)) if (ch === "0") count += 1;
  }
  return count;
}

function p026(seed: number): NumCp010Wave04Package {
  const rng = new Rng(seed * 131 + 26);
  const completedHundreds = rng.int(0, 9);
  const upper = 100 * completedHundreds + 99;
  const unitsZeroes = 9 + 10 * completedHundreds;
  const tensZeroes = 10 * completedHundreds;
  const correct = unitsZeroes + tensZeroes;
  const verifier = bruteZeroCount(upper);
  const optionRng = new Rng(seed * 7919 + 26);
  const optionValues = options(correct, [20 * (completedHundreds + 1), 10 * (completedHundreds + 1), correct + 10], optionRng);
  const correctIndex = optionValues.findIndex((option) => option.isCorrect);

  const state = Object.freeze({ completedHundreds, upper, unitsZeroes, tensZeroes, correct });
  const mathematicalFingerprint = createHash("sha256")
    .update(JSON.stringify({ prototypeId: "NUM-CP010-PROT-026", state }))
    .digest("hex");

  return Object.freeze({
    packageId: "NUM-002",
    checkpointId: "NUM-CP-010",
    temporaryPrototypeId: "NUM-CP010-PROT-026",
    seed,
    locale: "en-IN",
    difficulty: completedHundreds >= 4 ? "HARD" : "MEDIUM",
    answerSemantic: "ZERO_DIGIT_OCCURRENCE_COUNT",
    representation: "BOUNDED_INTERVAL",
    stem: `How many times does the digit 0 appear when all integers from 1 to ${upper} are written in decimal notation?`,
    options: optionValues,
    correctIndex,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint,
    explanation: Object.freeze({
      coreConcept: "Zero needs special care because zeros before the first written digit are not part of the number.",
      strategy: "Count written zeros in the units and tens places separately, but do not treat one-digit numbers as 01, 02 and so on.",
      steps: Object.freeze([
        `From 1 to 99, 0 appears only in the units place of 10, 20, ..., 90, so there are 9 zeros.`,
        completedHundreds === 0
          ? "The range ends at 99, so there are no full three-digit hundred blocks to add."
          : `Each full block of 100 numbers from 100 onward adds 10 units-place zeros and 10 tens-place zeros. There are ${completedHundreds} such block${completedHundreds === 1 ? "" : "s"}.`,
        `${completedHundreds === 0 ? "Total" : "Therefore total"} zeros = 9 + 20 × ${completedHundreds} = ${correct}.`,
      ]),
      finalAnswer: String(correct),
    }),
    sourceAncestry: Object.freeze(["V4_GAP:BOUNDED_DIGIT_OCCURRENCE_ZERO", "V4_EDGE:LEADING_ZERO_EXCLUSION"]),
    prototypeAncestry: Object.freeze(["NUM-CP010-PROT-026"]),
    lifecycle,
  });
}

export function generateNumCp010Wave04(prototypeId: NumCp010Wave04PrototypeId, seed: number): NumCp010Wave04Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  if (prototypeId !== "NUM-CP010-PROT-026") throw new Error(`Unknown Wave 04 prototype ${prototypeId}`);
  return p026(seed);
}
