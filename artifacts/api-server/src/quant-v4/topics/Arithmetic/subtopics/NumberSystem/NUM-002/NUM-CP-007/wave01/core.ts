import type {
  NumCp007Difficulty,
  NumCp007Explanation,
  NumCp007Option,
  NumCp007Wave01Package,
} from "./types.ts";

export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const next = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(values: readonly T[]) => values[Math.floor(next() * values.length)]!,
  };
}

export function shuffle<T>(values: readonly T[], rng: Rng): T[] {
  const output = [...values];
  for (let i = output.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [output[i], output[j]] = [output[j]!, output[i]!];
  }
  return output;
}

export function difficulty(tier: 0 | 1 | 2, reasoningLoad = 0): NumCp007Difficulty {
  const score = tier + reasoningLoad;
  return score <= 1 ? "EASY" : score <= 3 ? "MEDIUM" : "HARD";
}

export interface WrongValue {
  readonly value: number;
  readonly misconceptionId: string;
}

export function numericOptions(
  answer: number,
  candidates: readonly WrongValue[],
  rng: Rng,
  constraints: { readonly nonNegative?: boolean; readonly positive?: boolean } = {},
): { readonly options: readonly NumCp007Option[]; readonly correctIndex: number; readonly canonicalAnswer: string } {
  const allowed = (value: number) =>
    Number.isInteger(value) &&
    (!constraints.nonNegative || value >= 0) &&
    (!constraints.positive || value > 0);

  if (!allowed(answer)) throw new Error(`Answer violates option constraints: ${answer}`);

  const seen = new Set<number>([answer]);
  const wrong: WrongValue[] = [];
  for (const candidate of candidates) {
    if (!allowed(candidate.value) || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }

  for (let delta = 1; wrong.length < 3; delta++) {
    for (const value of [answer + delta, answer - delta]) {
      if (!allowed(value) || seen.has(value)) continue;
      seen.add(value);
      wrong.push({ value, misconceptionId: "NEARBY_UNVERIFIED_VALUE" });
      if (wrong.length === 3) break;
    }
  }

  const options = shuffle<NumCp007Option>([
    { value: String(answer), isCorrect: true, misconceptionId: "CORRECT" },
    ...wrong.map((item) => ({ value: String(item.value), isCorrect: false, misconceptionId: item.misconceptionId })),
  ], rng);

  return {
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer: String(answer),
  };
}

export function textOptions(
  answer: string,
  distractors: readonly { readonly value: string; readonly misconceptionId: string }[],
  rng: Rng,
): { readonly options: readonly NumCp007Option[]; readonly correctIndex: number; readonly canonicalAnswer: string } {
  const seen = new Set([answer]);
  const wrong = distractors.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  }).slice(0, 3);
  if (wrong.length !== 3) throw new Error("Text option set did not produce three distinct distractors.");
  const options = shuffle<NumCp007Option>([
    { value: answer, isCorrect: true, misconceptionId: "CORRECT" },
    ...wrong.map((item) => ({ value: item.value, isCorrect: false, misconceptionId: item.misconceptionId })),
  ], rng);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect), canonicalAnswer: answer };
}

export function explanation(
  coreConcept: string,
  strategy: string,
  steps: readonly string[],
  finalAnswer: string,
): NumCp007Explanation {
  return { coreConcept, strategy, steps, finalAnswer };
}

export function base(
  input: Omit<NumCp007Wave01Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">,
): NumCp007Wave01Package {
  return {
    packageId: "NUM-002",
    checkpointId: "NUM-CP-007",
    permanentQlId: null,
    locale: "en-IN",
    ...input,
    lifecycle: {
      permanentQlId: null,
      maturity: "EXECUTABLE_DISCOVERY_PROOF",
      reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export const sources = (family: string) => [family, "NUMBER-SYSTEM-DESIGN-CP007"] as const;

export interface DivisionState {
  readonly dividend: number;
  readonly divisor: number;
  readonly quotient: number;
  readonly remainder: number;
}

export function isValidDivisionState(state: DivisionState): boolean {
  return Number.isInteger(state.dividend) &&
    Number.isInteger(state.divisor) &&
    Number.isInteger(state.quotient) &&
    Number.isInteger(state.remainder) &&
    state.divisor > 0 &&
    state.quotient >= 0 &&
    state.remainder >= 0 &&
    state.remainder < state.divisor &&
    state.dividend === state.divisor * state.quotient + state.remainder;
}

export function stateText(state: DivisionState): string {
  return `${state.dividend} = ${state.divisor} × ${state.quotient} + ${state.remainder}`;
}

export function makeDivisionState(seed: number, rng: Rng): DivisionState & { readonly tier: 0 | 1 | 2 } {
  const tier = ((seed - 1) % 3) as 0 | 1 | 2;
  const divisor = tier === 0 ? rng.int(3, 12) : tier === 1 ? rng.int(13, 49) : rng.int(50, 97);
  const quotient = tier === 0 ? rng.int(1, 12) : tier === 1 ? rng.int(13, 99) : rng.int(100, 999);
  const edge = seed % 10;
  const remainder = edge === 0 ? 0 : edge === 1 ? divisor - 1 : rng.int(1, divisor - 1);
  return { dividend: divisor * quotient + remainder, divisor, quotient, remainder, tier };
}
