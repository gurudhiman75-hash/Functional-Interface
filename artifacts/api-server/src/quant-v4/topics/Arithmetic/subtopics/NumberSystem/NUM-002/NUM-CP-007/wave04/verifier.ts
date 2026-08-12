import { formatDivisionResult, formatRemainderPair } from "./core.ts";
import type { NumCp007Wave04Package } from "./types.ts";

const integer = (state: Readonly<Record<string, unknown>>, key: string): number => {
  const value = state[key];
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`Invalid integer hidden state: ${key}`);
  return value;
};

const text = (state: Readonly<Record<string, unknown>>, key: string): string => {
  const value = state[key];
  if (typeof value !== "string") throw new Error(`Invalid text hidden state: ${key}`);
  return value;
};

const integers = (state: Readonly<Record<string, unknown>>, key: string): number[] => {
  const value = state[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isInteger(item))) {
    throw new Error(`Invalid integer-array hidden state: ${key}`);
  }
  return [...value] as number[];
};

const norm = (value: number, divisor: number): number => ((value % divisor) + divisor) % divisor;

function linkedCandidates(state: Readonly<Record<string, unknown>>): number[] {
  const dividend = integer(state, "dividend");
  const mode = text(state, "mode");
  const a = integer(state, "a");
  const b = integer(state, "b");
  const gap = integer(state, "gap");
  const output: number[] = [];
  for (let divisor = 2; divisor <= dividend; divisor++) {
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend - divisor * quotient;
    if (remainder < 0 || remainder >= divisor) continue;
    const valid = mode === "D_MULTIPLE_Q_AND_R"
      ? divisor === a * quotient && divisor === b * remainder
      : mode === "D_MULTIPLE_Q_WITH_GAP"
        ? divisor === a * quotient && quotient - remainder === gap
        : mode === "D_MULTIPLE_R_WITH_GAP"
          ? divisor === b * remainder && quotient - remainder === gap
          : false;
    if (valid) output.push(divisor);
  }
  return output;
}

function verifyInversePropagation(state: Readonly<Record<string, unknown>>): number {
  const mode = text(state, "mode");
  const candidates: number[] = [];
  if (mode === "SUM_ONE_WRAP") {
    const r1 = integer(state, "r1");
    const r2 = integer(state, "r2");
    const r3 = integer(state, "r3");
    const raw = r1 + r2;
    for (let divisor = Math.max(r1, r2, r3) + 1; divisor <= raw; divisor++) {
      if (raw >= divisor && raw < 2 * divisor && raw % divisor === r3) candidates.push(divisor);
    }
  } else if (mode === "SCALE_ONE_WRAP") {
    const k = integer(state, "k");
    const remainder = integer(state, "remainder");
    const scaledRemainder = integer(state, "scaledRemainder");
    const raw = k * remainder;
    for (let divisor = Math.max(remainder, scaledRemainder) + 1; divisor <= raw; divisor++) {
      if (raw >= divisor && raw < 2 * divisor && raw % divisor === scaledRemainder) candidates.push(divisor);
    }
  } else {
    throw new Error(`Unknown inverse propagation mode: ${mode}`);
  }
  if (candidates.length !== 1) throw new Error(`Expected one inverse-propagation divisor, got ${candidates.join(",")}`);
  return candidates[0]!;
}

function reconstructChain(state: Readonly<Record<string, unknown>>): number {
  const d1 = integer(state, "d1");
  const d2 = integer(state, "d2");
  const r1 = integer(state, "r1");
  const r2 = integer(state, "r2");
  const finalQ = integer(state, "finalQ");
  if (r1 < 0 || r1 >= d1 || r2 < 0 || r2 >= d2) throw new Error("Invalid successive-division remainder bound.");
  const firstQ = d2 * finalQ + r2;
  return d1 * firstQ + r1;
}

function traceRemainders(dividend: number, divisor: number): number[] {
  let prefix = 0;
  const output: number[] = [];
  for (const character of String(dividend)) {
    prefix = prefix * 10 + Number(character);
    output.push(prefix % divisor);
  }
  return output;
}

export function verifyNumCp007Wave04Package(pkg: NumCp007Wave04Package): string {
  const state = pkg.hiddenState;
  switch (state.task) {
    case "RICHER_LINKED_RELATION": {
      const candidates = linkedCandidates(state);
      if (candidates.length !== 1) throw new Error(`Expected one linked divisor, got ${candidates.join(",")}`);
      return String(candidates[0]);
    }

    case "INVERSE_REMAINDER_PROPAGATION":
      return String(verifyInversePropagation(state));

    case "SUCCESSIVE_DIVISION_CHAIN": {
      const dividend = reconstructChain(state);
      const target = text(state, "target");
      if (target === "ORIGINAL_NUMBER") return String(dividend);
      if (target === "PRODUCT_REMAINDER") {
        const product = integer(state, "d1") * integer(state, "d2");
        return String(dividend % product);
      }
      throw new Error(`Unknown chain target: ${target}`);
    }

    case "REVERSE_SUCCESSIVE_DIVISION": {
      const dividend = reconstructChain(state);
      const d1 = integer(state, "d1");
      const d2 = integer(state, "d2");
      const firstQ = Math.floor(dividend / d2);
      return formatRemainderPair(dividend % d2, firstQ % d1);
    }

    case "WRONG_DIVISOR_CORRECTION": {
      const wrongDivisor = integer(state, "wrongDivisor");
      const wrongQuotient = integer(state, "wrongQuotient");
      const wrongRemainder = integer(state, "wrongRemainder");
      const correctDivisor = integer(state, "correctDivisor");
      const dividend = wrongDivisor * wrongQuotient + wrongRemainder;
      const quotient = Math.floor(dividend / correctDivisor);
      return formatDivisionResult(quotient, dividend - correctDivisor * quotient);
    }

    case "LONG_DIVISION_TRACE": {
      const dividend = integer(state, "dividend");
      const expected = integers(state, "remainders");
      const maxDivisor = integer(state, "maxDivisor");
      const candidates: number[] = [];
      for (let divisor = 2; divisor <= maxDivisor; divisor++) {
        const actual = traceRemainders(dividend, divisor);
        if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
          candidates.push(divisor);
        }
      }
      if (candidates.length !== 1) throw new Error(`Expected one trace divisor, got ${candidates.join(",")}`);
      return String(candidates[0]);
    }

    case "BOUNDED_NONZERO_REMAINDER_EXTREMUM": {
      const mode = text(state, "mode");
      const divisor = integer(state, "divisor");
      const remainder = integer(state, "remainder");
      const bound = integer(state, "bound");
      if (remainder <= 0 || remainder >= divisor) throw new Error("Extremum verifier requires a non-zero valid remainder.");
      if (mode === "LEAST_ABOVE") {
        for (let value = bound + 1; value <= bound + divisor; value++) {
          if (norm(value, divisor) === remainder) return String(value);
        }
      } else if (mode === "GREATEST_BELOW") {
        for (let value = bound - 1; value >= Math.max(0, bound - divisor); value--) {
          if (norm(value, divisor) === remainder) return String(value);
        }
      }
      throw new Error(`Could not verify extremum mode ${mode}.`);
    }

    case "SAME_REMAINDER_BOUNDED_RECONSTRUCTION": {
      const first = integer(state, "first");
      const second = integer(state, "second");
      const lower = integer(state, "lower");
      const upper = integer(state, "upper");
      const candidates: number[] = [];
      for (let divisor = lower; divisor <= upper; divisor++) {
        if (divisor > 0 && norm(first, divisor) === norm(second, divisor)) candidates.push(divisor);
      }
      if (candidates.length !== 1) throw new Error(`Expected one bounded same-remainder divisor, got ${candidates.join(",")}`);
      return String(candidates[0]);
    }

    default:
      throw new Error(`Unknown Wave 04 hidden task: ${String(state.task)}`);
  }
}
