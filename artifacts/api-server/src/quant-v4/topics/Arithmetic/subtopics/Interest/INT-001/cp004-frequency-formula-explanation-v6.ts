import { deepFreeze, type Cp004Explanation, type Cp004MathematicalState } from "./cp004-frequency-math";

function formulaFor(state: Cp004MathematicalState): string {
  switch (state.qlId) {
    case "INT-QL-067":
    case "INT-QL-073":
      return "Formula: A = P(1 + r/100)^n, where r is the rate per compounding period and n is the number of compounding periods.";

    case "INT-QL-068":
    case "INT-QL-074":
      return "Formula: A = P(1 + r/100)^n, then compound interest CI = A − P.";

    case "INT-QL-069":
      return "Formula: P = A ÷ (1 + r/100)^n, where r is the rate per compounding period.";

    case "INT-QL-070":
      return "Formula: CI = P[(1 + r/100)^n − 1], so P = CI ÷ [(1 + r/100)^n − 1].";

    case "INT-QL-071":
      return "Formula: A = P(1 + r/100)^n. After finding the rate r for one compounding period, nominal annual rate R = m × r, where m is the number of compounding periods in a year.";

    case "INT-QL-072":
      return "Formula: A = P(1 + r/100)^n. First find the number of compounding periods n; time in years = n ÷ m, where m is the number of compounding periods in a year.";

    case "INT-QL-075":
      return "Formula: A₁ = P(1 + r₁/100)^n₁ and A₂ = P(1 + r₂/100)^n₂; required difference = |A₁ − A₂|.";

    case "INT-QL-076":
      return "Formula: Effective annual rate = [(1 + R/(100m))^m − 1] × 100, where R is the nominal annual rate and m is the number of compounding periods in a year.";

    case "INT-QL-077":
      return "Formula: Effective annual rate = [(1 + R/(100m))^m − 1] × 100. Use the given effective rate to find or verify the nominal annual rate R.";

    case "INT-QL-078":
      return "Formula: A = P(1 + R/(100m))^(mt), where m is the number of times interest is compounded in a year. Test the permitted values of m against the stated amount.";

    case "INT-QL-079":
      return "Formula: A = P(1 + R/100)^y × [1 + (R/100)(k/12)], where y is the number of annually compounded years and k is the remaining number of months.";

    case "INT-QL-080":
      return "Formula: A = P(1 + R/100)^y × [1 + (R/100)(k/12)], then total interest = A − P.";

    case "INT-QL-081":
      return "Formula: P = A ÷ {(1 + R/100)^y × [1 + (R/100)(k/12)]}.";

    case "INT-QL-082":
      return "Formula: A = P(1 + R/100)^y × [1 + (R/100)(k/12)]. Use the stated amount to find or verify the annual rate R.";

    case "INT-QL-083":
      return "Formula: A = P(1 + R/100)^y × [1 + (R/100)(k/12)]. Use the stated amount to find the number of annually compounded years y.";

    case "INT-QL-084":
      return "Formula: A = P(1 + R/(100m₁))^(m₁t₁) × (1 + R/(100m₂))^(m₂t₂), where the two stages use their respective compounding frequencies.";

    case "INT-QL-085":
      return "Formula: A = P(1 + R/(100m₁))^(m₁t₁) × (1 + R/(100m₂))^(m₂t₂), then compound interest CI = A − P.";
  }
}

export function ensureCp004FormulaStepV6(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  const formula = formulaFor(state);
  const steps = explanation.steps[0]?.startsWith("Formula:")
    ? explanation.steps
    : Object.freeze([formula, ...explanation.steps]);

  return steps === explanation.steps
    ? explanation
    : deepFreeze({ ...explanation, steps });
}

export function assertCp004FormulaStepV6(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): void {
  if (!explanation.steps[0]?.startsWith("Formula:")) {
    throw new Error(`${state.qlId}: explanation must begin with the formula used in the calculation.`);
  }
  if (!/[=×÷−+^]/u.test(explanation.steps[0])) {
    throw new Error(`${state.qlId}: formula step does not contain a mathematical relation.`);
  }
}
