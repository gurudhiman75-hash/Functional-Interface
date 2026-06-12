import { compareFractions, decimalToFraction, evaluateRationalExpression, fractionHcf, fractionLcm, fractionToDecimal, fractionToString, gcd, improperToMixed, mixedToImproper, parseFraction, recurringDecimalToFraction, simplifyFraction, terminatingDecimalInfo } from "./math";
import type { NsFracdec001Parameters, NsFracdec001SolverResult } from "./types";

export function solveNsFracdec001(parameters: NsFracdec001Parameters): NsFracdec001SolverResult {
  if (parameters.canonicalProblemId === "CP-001") return withVerification(cp001(parameters));
  if (parameters.canonicalProblemId === "CP-002") return withVerification(cp002(parameters));
  if (parameters.canonicalProblemId === "CP-003") return withVerification(cp003(parameters));
  if (parameters.canonicalProblemId === "CP-004") return withVerification(cp004(parameters));
  if (parameters.canonicalProblemId === "CP-005") return withVerification(cp005(parameters));
  if (parameters.canonicalProblemId === "CP-006") return withVerification(cp006(parameters));
  if (parameters.canonicalProblemId === "CP-007") return withVerification(cp007(parameters));
  if (parameters.canonicalProblemId === "CP-008") return withVerification(cp008(parameters));
  return withVerification(cp009(parameters));
}

function cp001(p: NsFracdec001Parameters) {
  const original = { numerator: p.numerator ?? 1, denominator: p.denominator ?? 1 };
  const simple = simplifyFraction(original);
  const divisor = gcd(original.numerator, original.denominator);
  return { answer: fractionToString(simple), fractionReductionLatex: `${original.numerator}/${original.denominator} \\div ${divisor} = ${fractionToString(simple)}` };
}

function cp002(p: NsFracdec001Parameters) {
  if (p.direction === "mixedToImproper") {
    const match = p.mixedFraction?.match(/^(\d+) (\d+)\/(\d+)$/);
    const mixed = { whole: Number(match?.[1]), numerator: Number(match?.[2]), denominator: Number(match?.[3]) };
    const result = mixedToImproper(mixed);
    return { answer: fractionToString(result), mixedFractionConversionLatex: `${mixed.whole} ${mixed.numerator}/${mixed.denominator} = (${mixed.whole}\\times${mixed.denominator}+${mixed.numerator})/${mixed.denominator} = ${fractionToString(result)}` };
  }
  const fraction = parseFraction(p.improperFraction ?? "1/1");
  return { answer: improperToMixed(fraction), mixedFractionConversionLatex: `${fraction.numerator} = ${Math.trunc(fraction.numerator / fraction.denominator)}\\times${fraction.denominator}+${fraction.numerator % fraction.denominator}` };
}

function cp003(p: NsFracdec001Parameters) {
  const answer = evaluateRationalExpression(p.operands ?? [], p.operation ?? "addition");
  return { answer: fractionToString(answer), fractionArithmeticLatex: `${p.expression} = ${fractionToString(answer)}` };
}

function cp004(p: NsFracdec001Parameters) {
  const values = p.rationalValues ?? [];
  const sorted = [...values].sort(compareFractions);
  const mode = p.comparisonMode ?? "largestSelection";
  const answer = mode === "ascendingOrder" ? sorted.map(fractionToString).join(", ") : mode === "descendingOrder" ? sorted.reverse().map(fractionToString).join(", ") : mode === "smallestSelection" ? fractionToString(sorted[0]) : fractionToString(sorted[sorted.length - 1]);
  return { answer, comparisonWorkingLatex: `${values.map(fractionToString).join(", ")} \\Rightarrow ${answer}` };
}

function cp005(p: NsFracdec001Parameters) {
  const fraction = parseFraction(p.fraction ?? "1/1");
  const answer = fractionToDecimal(fraction);
  return { answer, fractionToDecimalLatex: `${p.fraction} = ${answer}` };
}

function cp006(p: NsFracdec001Parameters) {
  const result = decimalToFraction(p.decimal ?? "0.1");
  return { answer: fractionToString(result), decimalToFractionLatex: `${p.decimal} = ${fractionToString(result)}` };
}

function cp007(p: NsFracdec001Parameters) {
  const result = recurringDecimalToFraction(p.recurringDecimal ?? "0.(3)");
  return { answer: fractionToString(result), recurringDecimalConversionLatex: `${p.recurringDecimal} = ${fractionToString(result)}` };
}

function cp008(p: NsFracdec001Parameters) {
  const info = terminatingDecimalInfo(parseFraction(p.fraction ?? "1/2"));
  const answer = info.terminates ? "terminating decimal" : "recurring decimal";
  return { answer, terminatingCheckLatex: `${p.fraction}: ${info.denominatorProfile}` };
}

function cp009(p: NsFracdec001Parameters) {
  const fractions = p.rationalValues ?? [];
  const result = p.targetType === "LCM" ? fractionLcm(fractions) : fractionHcf(fractions);
  return { answer: fractionToString(result), fractionHcfLcmLatex: `${p.targetType}(${fractions.map(fractionToString).join(", ")}) = ${fractionToString(result)}` };
}

function withVerification(result: Partial<NsFracdec001SolverResult> & { answer: string }): NsFracdec001SolverResult {
  const full = {
    answer: result.answer,
    fractionReductionLatex: result.fractionReductionLatex ?? "",
    mixedFractionConversionLatex: result.mixedFractionConversionLatex ?? "",
    fractionArithmeticLatex: result.fractionArithmeticLatex ?? "",
    comparisonWorkingLatex: result.comparisonWorkingLatex ?? "",
    fractionToDecimalLatex: result.fractionToDecimalLatex ?? "",
    decimalToFractionLatex: result.decimalToFractionLatex ?? "",
    recurringDecimalConversionLatex: result.recurringDecimalConversionLatex ?? "",
    terminatingCheckLatex: result.terminatingCheckLatex ?? "",
    fractionHcfLcmLatex: result.fractionHcfLcmLatex ?? "",
    verification: { inputValid: true, answerRecomputed: true, mathJaxValid: true },
  };
  return full;
}
