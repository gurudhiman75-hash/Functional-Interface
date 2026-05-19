import { roundClean } from "../utils/math-utils";

const UNSAFE_EQUATION_PATTERN = /[\\$<>\[\]`]/u;
const ALLOWED_EQUATION_PATTERN =
  /^[A-Za-z0-9_{}\s+\-*/^().,;=%:|]+$/u;

function stableNumberText(value: number) {
  const rounded = roundClean(value, 4);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

export function normalizeEquation(equation: string): string {
  return equation
    .trim()
    .replace(/\s+/gu, " ")
    .replace(/\s*([=+\-*/^(),;:%|])\s*/gu, " $1 ")
    .replace(/\s+/gu, " ")
    .trim();
}

export function sanitizeEquation(equation: string): string {
  const normalized = normalizeEquation(equation);

  if (!normalized) {
    throw new Error("Equation cannot be empty.");
  }
  if (UNSAFE_EQUATION_PATTERN.test(normalized)) {
    throw new Error(`Equation contains rendering or unsafe characters: ${equation}`);
  }
  if (!ALLOWED_EQUATION_PATTERN.test(normalized)) {
    throw new Error(`Equation contains unsupported characters: ${equation}`);
  }

  return normalized;
}

export function substituteVariables(
  equation: string,
  variables: Record<string, number>,
): string {
  const substituted = equation.replace(
    /\{([A-Za-z_][A-Za-z0-9_]*)\}/gu,
    (match, variable: string) => {
      const value = variables[variable];
      if (typeof value !== "number") {
        throw new Error(`Missing variable for equation substitution: ${variable}`);
      }
      return stableNumberText(value);
    },
  );

  return sanitizeEquation(substituted);
}

export function percentageToMultiplier(
  percent: number | string,
  direction: "increase" | "decrease" = "increase",
): string {
  const operator = direction === "increase" ? "+" : "-";

  if (typeof percent === "number") {
    const multiplier =
      direction === "increase"
        ? 1 + percent / 100
        : 1 - percent / 100;
    return stableNumberText(multiplier);
  }

  return `(100 ${operator} ${percent}) / 100`;
}
