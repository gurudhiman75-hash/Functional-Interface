import type { NumCp006PermanentQlId } from "./allocation";
import {
  countCoprimeFactorPairs,
  fractionHcf,
  fractionLcm,
  fractionText,
  gcd,
  gcdMany,
  lcm,
  lcmMany,
  type Fraction,
} from "./core";

function strings(state: Readonly<Record<string, unknown>>, key: string): bigint[] {
  const value = state[key];
  if (!Array.isArray(value)) throw new Error(`Expected array hidden state ${key}`);
  return value.map((item) => BigInt(String(item)));
}

function integer(state: Readonly<Record<string, unknown>>, key: string): bigint {
  const value = state[key];
  if (value === undefined) throw new Error(`Missing hidden state ${key}`);
  return BigInt(String(value));
}

function text(state: Readonly<Record<string, unknown>>, key: string): string {
  const value = state[key];
  if (value === undefined) throw new Error(`Missing hidden state ${key}`);
  return String(value);
}

function rationalValues(state: Readonly<Record<string, unknown>>): Fraction[] {
  const value = state.rationals;
  if (!Array.isArray(value)) throw new Error("Missing rational state");
  return value.map((item) => {
    const record = item as Record<string, unknown>;
    return { numerator: BigInt(String(record.numerator)), denominator: BigInt(String(record.denominator)) };
  });
}

function verifyPairOption(state: Readonly<Record<string, unknown>>): string {
  const h = integer(state, "hcf");
  const L = integer(state, "lcm");
  const options = state.optionPairs;
  if (!Array.isArray(options)) throw new Error("Missing pair options");
  const valid = options.map(String).filter((value) => {
    const match = value.match(/^\((\d+),\s*(\d+)\)$/);
    if (!match) return false;
    const left = BigInt(match[1]!);
    const right = BigInt(match[2]!);
    return gcd(left, right) === h && lcm(left, right) === L;
  });
  if (valid.length !== 1) throw new Error(`Expected one valid pair; received ${valid.length}`);
  return valid[0]!;
}

function verifyQl095(state: Readonly<Record<string, unknown>>): string {
  const a = integer(state, "a");
  const b = integer(state, "b");
  const statements = state.statements;
  if (!Array.isArray(statements) || statements.length !== 3) throw new Error("Missing statement set");
  const expected = [gcd(a, b), lcm(a, b), a * b];
  const truth = statements.map((statement, index) => {
    const match = String(statement).match(/=\s*(\d+)\.?$/);
    if (!match) throw new Error(`Cannot parse statement ${statement}`);
    return BigInt(match[1]!) === expected[index];
  });
  const key = truth.map((flag, index) => flag ? index + 1 : 0).filter(Boolean).join(",");
  const labels: Record<string, string> = {
    "1": "I only", "2": "II only", "3": "III only", "1,2": "I and II only",
    "1,3": "I and III only", "2,3": "II and III only", "1,2,3": "All three",
  };
  const result = labels[key];
  if (!result) throw new Error(`Unsupported truth pattern ${key}`);
  return result;
}

export function verifyNumCp006Answer(
  qlId: NumCp006PermanentQlId,
  state: Readonly<Record<string, unknown>>,
): string {
  switch (qlId) {
    case "NUM-QL-070":
    case "NUM-QL-072":
    case "NUM-QL-074":
      return `${gcdMany(strings(state, "numbers"))}`;
    case "NUM-QL-071":
    case "NUM-QL-073":
      return `${lcmMany(strings(state, "numbers"))}`;
    case "NUM-QL-075":
    case "NUM-QL-076": {
      const values = strings(state, "numbers");
      return text(state, "target") === "HCF" ? `${gcdMany(values)}` : `${lcmMany(values)}`;
    }
    case "NUM-QL-077":
      return `${integer(state, "hcf") * integer(state, "lcm") / integer(state, "known")}`;
    case "NUM-QL-078":
      return verifyPairOption(state);
    case "NUM-QL-079":
      return `${countCoprimeFactorPairs(integer(state, "quotient"))}`;
    case "NUM-QL-080":
      return `${gcdMany(strings(state, "values"))} ${text(state, "unit")}`;
    case "NUM-QL-081":
      return `${lcmMany(strings(state, "intervals"))} ${text(state, "unit")}`;
    case "NUM-QL-082": {
      const common = lcmMany(strings(state, "divisors"));
      const lower = integer(state, "lowerBound");
      return `${((lower + common - 1n) / common) * common}`;
    }
    case "NUM-QL-083": {
      const common = lcmMany(strings(state, "divisors"));
      const upper = integer(state, "upperBound");
      return `${(upper / common) * common}`;
    }
    case "NUM-QL-084": {
      const numbers = strings(state, "numbers");
      return `${gcdMany(numbers.slice(1).map((value) => value - numbers[0]!))}`;
    }
    case "NUM-QL-085": {
      const numbers = strings(state, "numbers");
      const remainders = strings(state, "remainders");
      return `${gcdMany(numbers.map((value, index) => value - remainders[index]!))}`;
    }
    case "NUM-QL-086":
      return `${lcmMany(strings(state, "divisors")) + integer(state, "commonRemainder")}`;
    case "NUM-QL-087": {
      const common = lcmMany(strings(state, "divisors"));
      const number = integer(state, "number");
      const remainder = number % common;
      return `${remainder === 0n ? 0n : common - remainder}`;
    }
    case "NUM-QL-088": {
      const common = lcmMany(strings(state, "divisors"));
      return `${integer(state, "number") % common}`;
    }
    case "NUM-QL-089": {
      const common = lcmMany(strings(state, "divisors"));
      const deficiency = integer(state, "deficiency");
      const lower = integer(state, "lowerBound");
      const multiplier = (lower + 1n + deficiency + common - 1n) / common;
      return `${multiplier * common - deficiency}`;
    }
    case "NUM-QL-090": {
      const common = lcmMany(strings(state, "divisors"));
      const lower = integer(state, "lower");
      const upper = integer(state, "upper");
      return `${upper / common - (lower - 1n) / common}`;
    }
    case "NUM-QL-091":
      return fractionText(fractionHcf(rationalValues(state)));
    case "NUM-QL-092":
      return fractionText(fractionLcm(rationalValues(state)));
    case "NUM-QL-093": {
      const mode = Number(state.claimMode);
      return mode === 0 || mode === 2 ? "True" : "False";
    }
    case "NUM-QL-094": {
      const setA = strings(state, "setA");
      const setB = strings(state, "setB");
      const target = text(state, "target");
      const valueA = target === "HCF" ? gcdMany(setA) : lcmMany(setA);
      const valueB = target === "HCF" ? gcdMany(setB) : lcmMany(setB);
      return `A = ${valueA}; B = ${valueB}`;
    }
    case "NUM-QL-095":
      return verifyQl095(state);
    case "NUM-QL-096": {
      const mode = Number(state.mode);
      return [
        "I alone is sufficient",
        "II alone is sufficient",
        "Both together are sufficient",
        "Even together are insufficient",
      ][mode]!;
    }
    case "NUM-QL-097": {
      const mode = text(state, "caseletMode");
      if (mode === "GROUPING") {
        const lengths = strings(state, "lengths");
        const groupSize = gcdMany(lengths);
        return `${lengths.reduce((sum, value) => sum + value / groupSize, 0n)}`;
      }
      const intervals = strings(state, "intervals");
      return `${integer(state, "duration") / lcmMany(intervals)}`;
    }
    default: {
      const exhaustive: never = qlId;
      throw new Error(`Unsupported NUM-CP-006 QL ${exhaustive}`);
    }
  }
}
