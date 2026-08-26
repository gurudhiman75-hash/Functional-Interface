import { createHash } from "node:crypto";

import {
  applyNumCp012ExamDepthOverlay,
  NUM_CP012_EXAM_DEPTH_PROFILE,
} from "./exam-depth-question-overlay.ts";

type Language = "en" | "hi" | "pa";
type FactorPair = readonly [bigint, number];

type OverlayInput = Readonly<{
  temporaryPrototypeId: string;
  seed: number;
  stem: string;
  options: readonly Readonly<{
    value: string;
    isCorrect: boolean;
    misconceptionId: string;
  }>[];
  correctIndex: number;
  canonicalAnswer: string;
  verifierAnswer: string;
  hiddenState: Readonly<Record<string, unknown>>;
  mathematicalFingerprint: string;
}>;

function factorize(input: bigint): FactorPair[] {
  let remaining = input < 0n ? -input : input;
  const factors: FactorPair[] = [];
  let prime = 2n;
  while (prime * prime <= remaining) {
    if (remaining % prime !== 0n) {
      prime += 1n;
      continue;
    }
    let exponent = 0;
    while (remaining % prime === 0n) {
      exponent += 1;
      remaining /= prime;
    }
    factors.push([prime, exponent] as const);
    prime += 1n;
  }
  if (remaining > 1n) factors.push([remaining, 1] as const);
  return factors;
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }, (_key, value) => typeof value === "bigint" ? value.toString() : value))
    .digest("hex");
}

function hardenP001<T extends OverlayInput>(overlay: T) {
  if (overlay.temporaryPrototypeId !== "NUM-CP012-PROT-001") return overlay;
  const perfect = BigInt(String(overlay.hiddenState.perfect));
  const factors = factorize(perfect);
  const k = Number(overlay.hiddenState.k);
  if (factors.length === 0 || factors.some(([, exponent]) => exponent % k !== 0)) {
    throw new Error("NUM-CP012-PROT-001: enlarged recognition value lost perfect-power factor structure.");
  }
  const hiddenState = Object.freeze({ ...overlay.hiddenState, factors });
  const mathematicalFingerprint = fingerprint(overlay.temporaryPrototypeId, hiddenState);
  return Object.freeze({
    ...overlay,
    hiddenState,
    mathematicalFingerprint,
    examDepthOverlay: Object.freeze({
      profile: NUM_CP012_EXAM_DEPTH_PROFILE,
      sourceMathematicalFingerprint: String((overlay as any).sourceMathematicalFingerprint ?? overlay.mathematicalFingerprint),
      mathematicalFingerprint,
    }),
  }) as T;
}

function hardenP007<T extends OverlayInput>(overlay: T) {
  if (overlay.temporaryPrototypeId !== "NUM-CP012-PROT-007") return overlay;
  const answer = BigInt(overlay.canonicalAnswer);
  const used = new Set<string>();
  const options = overlay.options.map((option) => {
    let value = option.value;
    if (!option.isCorrect) {
      if (option.misconceptionId === "OPEN_LEFT_BOUNDARY_COUNT") value = (answer - 1n).toString();
      if (option.misconceptionId === "MISS_BOUNDARY_POWER") value = (answer > 2n ? answer - 2n : answer + 2n).toString();
      if (option.misconceptionId === "OFF_BY_ONE_COUNT") value = (answer + 1n).toString();
      let candidate = BigInt(value);
      while (used.has(candidate.toString()) || candidate.toString() === overlay.canonicalAnswer) candidate += 1n;
      value = candidate.toString();
    }
    used.add(value);
    return Object.freeze({ ...option, value });
  });
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options[correctIndex]?.value !== overlay.canonicalAnswer) {
    throw new Error("NUM-CP012-PROT-007: hardened option mapping broke answer binding.");
  }
  return Object.freeze({ ...overlay, options: Object.freeze(options), correctIndex }) as T;
}

function hardenP009<T extends OverlayInput>(overlay: T) {
  if (overlay.temporaryPrototypeId !== "NUM-CP012-PROT-009") return overlay;
  // The Wave02 verifier may expose a mathematically equivalent signed witness
  // for exact roots (for example -1 for the learner-canonical answer 1).
  // Question Studio must always bind the verifier field to the canonical learner answer.
  return Object.freeze({ ...overlay, verifierAnswer: overlay.canonicalAnswer }) as T;
}

/**
 * Final Question-Studio-only calculation-depth overlay.
 * It preserves permanent authority/source ancestry while hardening transformed state
 * used by detailed worked explanations.
 */
export function applyNumCp012ExamDepthOverlayV2<T extends OverlayInput>(input: T, language: Language) {
  const overlaid = applyNumCp012ExamDepthOverlay(input, language) as T;
  return hardenP009(hardenP007(hardenP001(overlaid)));
}

export { NUM_CP012_EXAM_DEPTH_PROFILE };
