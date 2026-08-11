import {
  DS_CLASS_LABELS,
  STATE_CLASS_LABELS,
  formatNumberSet,
  type DivisionStateClass,
  type DsClass,
} from "./core.ts";
import type { NumCp007Wave03Package } from "./types.ts";

const integer = (state: Readonly<Record<string, unknown>>, key: string): number => {
  const value = state[key];
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`Invalid integer hidden state: ${key}`);
  }
  return value;
};

const text = (state: Readonly<Record<string, unknown>>, key: string): string => {
  const value = state[key];
  if (typeof value !== "string") throw new Error(`Invalid text hidden state: ${key}`);
  return value;
};

const norm = (value: number, divisor: number): number => ((value % divisor) + divisor) % divisor;

function enumerateResidueValues(lower: number, upper: number, divisor: number, remainder: number): number[] {
  const output: number[] = [];
  for (let value = lower; value <= upper; value++) {
    if (norm(value, divisor) === remainder) output.push(value);
  }
  return output;
}

function classifyState(
  dividend: number,
  divisor: number,
  quotient: number,
  remainder: number,
): DivisionStateClass {
  const identityValid = divisor > 0 && dividend === divisor * quotient + remainder;
  const remainderValid = divisor > 0 && remainder >= 0 && remainder < divisor;
  if (identityValid && remainderValid) return "VALID";
  if (!identityValid && remainderValid) return "INVALID_IDENTITY";
  if (identityValid && !remainderValid) return "INVALID_REMAINDER";
  return "INVALID_BOTH";
}

function dsClass(
  baseValues: readonly number[],
  opI: string,
  valueI: number,
  opII: string,
  valueII: number,
): DsClass {
  const apply = (values: readonly number[], op: string, threshold: number) =>
    values.filter((value) => op === "GT" ? value > threshold : value < threshold);
  const i = apply(baseValues, opI, valueI);
  const ii = apply(baseValues, opII, valueII);
  const both = apply(i, opII, valueII);
  if (i.length === 1 && ii.length !== 1) return "I_ALONE";
  if (ii.length === 1 && i.length !== 1) return "II_ALONE";
  if (i.length !== 1 && ii.length !== 1 && both.length === 1) return "BOTH_TOGETHER";
  return "NOT_SUFFICIENT";
}

export function verifyNumCp007Wave03Package(pkg: NumCp007Wave03Package): string {
  const state = pkg.hiddenState;
  switch (state.task) {
    case "BOUNDED_DIVIDEND_RECONSTRUCTION": {
      const values = enumerateResidueValues(
        integer(state, "lower"),
        integer(state, "upper"),
        integer(state, "divisor"),
        integer(state, "remainder"),
      );
      if (values.length !== 1) throw new Error(`Expected one bounded dividend, got ${values.length}`);
      return String(values[0]);
    }

    case "BOUNDED_NUMBER_SET": {
      const values = enumerateResidueValues(
        integer(state, "lower"),
        integer(state, "upper"),
        integer(state, "divisor"),
        integer(state, "remainder"),
      );
      return formatNumberSet(values);
    }

    case "DIVISION_STATE_CLASSIFICATION": {
      const result = classifyState(
        integer(state, "dividend"),
        integer(state, "divisor"),
        integer(state, "quotient"),
        integer(state, "remainder"),
      );
      return STATE_CLASS_LABELS[result];
    }

    case "SAME_REMAINDER_DIVISOR_CANDIDATE": {
      const first = integer(state, "first");
      const second = integer(state, "second");
      const valid = pkg.options
        .map((option) => Number(option.value))
        .filter((candidate) =>
          Number.isInteger(candidate) &&
          candidate > 0 &&
          norm(first, candidate) === norm(second, candidate)
        );
      if (valid.length !== 1) {
        throw new Error(`Expected exactly one valid same-remainder option, got ${valid.join(",")}`);
      }
      return String(valid[0]);
    }

    case "QUOTIENT_REMAINDER_TABLE": {
      const dividend = integer(state, "dividend");
      const divisor = integer(state, "divisor");
      const quotient = Math.floor(dividend / divisor);
      const remainder = dividend - divisor * quotient;
      return `Quotient ${quotient}; remainder ${remainder}`;
    }

    case "STATEMENT_COMBINATION": {
      const dividend = integer(state, "dividend");
      const divisor = integer(state, "divisor");
      const quotient = integer(state, "quotient");
      const remainder = integer(state, "remainder");
      const statementIAddedRemainder = integer(state, "statementIAddedRemainder");
      const statementIIClaim = text(state, "statementIIClaim");
      const statementIIIValue = integer(state, "statementIIIValue");

      const truthI = dividend === divisor * quotient + statementIAddedRemainder;
      const truthII = statementIIClaim === "LT"
        ? remainder < divisor
        : remainder >= divisor;
      const truthIII = statementIIIValue % divisor === 0;

      const mask = `${truthI ? 1 : 0}${truthII ? 1 : 0}${truthIII ? 1 : 0}`;
      if (mask === "110") return "I and II only";
      if (mask === "101") return "I and III only";
      if (mask === "011") return "II and III only";
      if (mask === "111") return "I, II and III";
      throw new Error(`Unsupported statement truth mask: ${mask}`);
    }

    case "DATA_SUFFICIENCY": {
      const baseValues = enumerateResidueValues(
        integer(state, "lower"),
        integer(state, "upper"),
        integer(state, "divisor"),
        integer(state, "remainder"),
      );
      const result = dsClass(
        baseValues,
        text(state, "statementIOperator"),
        integer(state, "statementIValue"),
        text(state, "statementIIOperator"),
        integer(state, "statementIIValue"),
      );
      return DS_CLASS_LABELS[result];
    }

    case "LINKED_STATE_MINI_CASELET": {
      const dividend = integer(state, "dividend");
      const remainder = integer(state, "remainder");
      const gap = integer(state, "gap");
      const candidates: number[] = [];
      for (let quotient = 0; quotient <= dividend; quotient++) {
        const divisor = quotient + gap;
        if (divisor <= 0 || remainder < 0 || remainder >= divisor) continue;
        if (dividend === divisor * quotient + remainder) candidates.push(quotient);
      }
      if (candidates.length !== 1) {
        throw new Error(`Expected one linked-state quotient, got ${candidates.join(",")}`);
      }
      return String(candidates[0]);
    }

    default:
      throw new Error(`Unknown Wave 03 hidden task: ${String(state.task)}`);
  }
}
