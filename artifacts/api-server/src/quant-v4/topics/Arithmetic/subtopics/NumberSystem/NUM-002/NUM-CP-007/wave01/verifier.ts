import { isValidDivisionState, stateText, type DivisionState } from "./core.ts";
import type { NumCp007Wave01Package } from "./types.ts";

const number = (state: Readonly<Record<string, unknown>>, key: string): number => {
  const value = state[key];
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`Invalid numeric hidden state: ${key}`);
  return value;
};

export function verifyNumCp007Wave01Package(pkg: NumCp007Wave01Package): string {
  const state = pkg.hiddenState;
  const task = state.task;
  switch (task) {
    case "REMAINDER_FROM_STATE":
      return String(number(state, "dividend") - number(state, "divisor") * number(state, "quotient"));
    case "DIVIDEND_FROM_STATE":
      return String(number(state, "divisor") * number(state, "quotient") + number(state, "remainder"));
    case "DIVISOR_FROM_STATE":
      return String((number(state, "dividend") - number(state, "remainder")) / number(state, "quotient"));
    case "QUOTIENT_FROM_STATE":
      return String((number(state, "dividend") - number(state, "remainder")) / number(state, "divisor"));
    case "SELECT_VALID_STATE": {
      const candidate: DivisionState = {
        dividend: number(state, "dividend"),
        divisor: number(state, "divisor"),
        quotient: number(state, "quotient"),
        remainder: number(state, "remainder"),
      };
      if (!isValidDivisionState(candidate)) throw new Error("Hidden valid-state authority is invalid.");
      return stateText(candidate);
    }
    case "SUM_REMAINDER":
      return String((number(state, "remainderA") + number(state, "remainderB")) % number(state, "divisor"));
    case "PRODUCT_REMAINDER":
      return String((number(state, "remainderA") * number(state, "remainderB")) % number(state, "divisor"));
    case "EXACT_DIVISIBILITY_ADJUSTMENT": {
      const dividend = number(state, "dividend");
      const divisor = number(state, "divisor");
      const operation = state.operation;
      if (operation === "ADD") return String((divisor - (dividend % divisor)) % divisor);
      if (operation === "SUBTRACT") return String(dividend % divisor);
      throw new Error("Unknown adjustment operation.");
    }
    default:
      throw new Error(`Unknown hidden task: ${String(task)}`);
  }
}
