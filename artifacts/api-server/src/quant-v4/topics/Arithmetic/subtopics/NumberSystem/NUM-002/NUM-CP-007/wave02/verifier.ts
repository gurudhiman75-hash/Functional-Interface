import { mod, rangeCount, valuesInRange } from "./core.ts";
import type { NumCp007Wave02Package } from "./types.ts";

const integer = (state: Readonly<Record<string, unknown>>, key: string): number => {
  const value = state[key];
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`Invalid numeric hidden state: ${key}`);
  }
  return value;
};

const boolean = (state: Readonly<Record<string, unknown>>, key: string): boolean => {
  const value = state[key];
  if (typeof value !== "boolean") throw new Error(`Invalid boolean hidden state: ${key}`);
  return value;
};

function solutionLabel(count: number, invalid: boolean): string {
  if (invalid) return "The remainder condition itself is invalid";
  if (count === 0) return "No integer satisfies the condition";
  if (count === 1) return "Exactly one integer satisfies the condition";
  return "More than one integer satisfies the condition";
}

function nearestLabel(number: number, divisor: number): string {
  const remainder = mod(number, divisor);
  if (remainder === 0) return "The given number is already a multiple";
  const lowerDistance = remainder;
  const upperDistance = divisor - remainder;
  if (lowerDistance === upperDistance) return "The two neighbouring multiples are equally near";
  return lowerDistance < upperDistance
    ? "The lower multiple is nearer"
    : "The upper multiple is nearer";
}

export function verifyNumCp007Wave02Package(pkg: NumCp007Wave02Package): string {
  const state = pkg.hiddenState;
  switch (state.task) {
    case "DIFFERENCE_REMAINDER":
      return String(mod(integer(state, "remainderA") - integer(state, "remainderB"), integer(state, "divisor")));
    case "SCALED_REMAINDER":
      return String(mod(integer(state, "multiplier") * integer(state, "remainder"), integer(state, "divisor")));
    case "COMPATIBLE_NESTED_REMAINDER": {
      const small = integer(state, "smallDivisor");
      const large = integer(state, "largeDivisor");
      if (large % small !== 0) throw new Error("Nested divisor is not compatible.");
      return String(mod(integer(state, "knownRemainder"), small));
    }
    case "POLYNOMIAL_REMAINDER": {
      const divisor = integer(state, "divisor");
      const remainder = integer(state, "remainder");
      const coefficient = integer(state, "coefficient");
      const constant = integer(state, "constant");
      const quadratic = boolean(state, "quadratic");
      const value = quadratic
        ? remainder * remainder + coefficient * remainder + constant
        : coefficient * remainder + constant;
      return String(mod(value, divisor));
    }
    case "LINKED_DIVISOR_QUOTIENT": {
      const dividend = integer(state, "dividend");
      const remainder = integer(state, "remainder");
      const gap = integer(state, "gap");
      const candidates: number[] = [];
      for (let divisor = 1; divisor <= dividend; divisor++) {
        const quotient = divisor - gap;
        if (quotient < 0 || remainder >= divisor) continue;
        if (dividend === divisor * quotient + remainder) candidates.push(divisor);
      }
      if (candidates.length !== 1) {
        throw new Error(`Expected unique linked state, found ${candidates.length}.`);
      }
      return String(candidates[0]);
    }
    case "BOUNDED_DIVIDEND_COUNT":
      return String(
        rangeCount(
          integer(state, "lower"),
          integer(state, "upper"),
          integer(state, "divisor"),
          integer(state, "remainder"),
        ),
      );
    case "BOUNDED_SOLUTION_CLASS": {
      const divisor = integer(state, "divisor");
      const remainder = integer(state, "remainder");
      const invalid = remainder < 0 || remainder >= divisor;
      const count = invalid
        ? 0
        : valuesInRange(
            integer(state, "lower"),
            integer(state, "upper"),
            divisor,
            remainder,
          ).length;
      return solutionLabel(count, invalid);
    }
    case "NEAREST_MULTIPLE_CLASS":
      return nearestLabel(integer(state, "number"), integer(state, "divisor"));
    default:
      throw new Error(`Unknown hidden task: ${String(state.task)}`);
  }
}
