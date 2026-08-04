import {
  amount,
  div,
  eq,
  factor,
  mul,
  pow,
  rat,
  sub,
  verifyAnswer,
  yearlyInterest,
  type Cp003AnswerSemantic,
  type Cp003MathematicalState,
  type Cp003QuestionContract,
  type IntCp003QlId,
  type Rational,
} from "./cp003-exam-model";
import { ANSWER_SEMANTICS, type ResolvedState } from "./cp003-exam-support";

export const INT_CP003_SOLUTION_TRACE_VERSION = "INT-CP-003-SOLUTION-TRACE-v1" as const;

export type Cp003SolutionMethodId =
  | "DIRECT_ANNUAL_FACTOR"
  | "AMOUNT_MINUS_PRINCIPAL"
  | "REVERSE_COMPOUND_FACTOR"
  | "REVERSE_COMPOUND_INTEREST_FACTOR"
  | "AMOUNT_RATIO_FACTOR_MATCH"
  | "FACTOR_POWER_TIME_MATCH"
  | "NTH_YEAR_OPENING_BALANCE"
  | "REVERSE_NTH_YEAR_INTEREST_FACTOR"
  | "NTH_YEAR_RATE_SUBSTITUTION"
  | "REVERSE_ONE_YEAR_FACTOR"
  | "CONSECUTIVE_BALANCE_RATE"
  | "CONSECUTIVE_BALANCE_PRINCIPAL"
  | "ANNUAL_AMOUNT_DIFFERENCE"
  | "YEARLY_INTEREST_GEOMETRIC_GROWTH";

export type Cp003SolutionStepRole =
  | "OBSERVATION"
  | "RELATION"
  | "SUBSTITUTION"
  | "SIMPLIFICATION"
  | "INTERMEDIATE_RESULT"
  | "VERIFICATION";

export type Cp003SolutionOperationId =
  | "ANNUAL_FACTOR"
  | "POWER"
  | "MULTIPLY"
  | "SUBTRACT"
  | "DIVIDE"
  | "RATE_FROM_FACTOR"
  | "MATCH_POWER"
  | "YEAR_BALANCE"
  | "YEAR_INTEREST"
  | "RATE_PERCENT_OF_AMOUNT"
  | "RATE_FROM_INCREASE"
  | "VERIFY_NTH_YEAR_RATE";

export type Cp003TraceDatumSemantic =
  | "MONEY"
  | "RATE_PERCENT"
  | "TIME_YEARS"
  | "FACTOR"
  | "NUMBER";

export interface Cp003TraceRationalDatum {
  readonly kind: "RATIONAL";
  readonly key: string;
  readonly semantic: Cp003TraceDatumSemantic;
  readonly value: Rational;
}

export interface Cp003TraceNumberDatum {
  readonly kind: "NUMBER";
  readonly key: string;
  readonly semantic: "TIME_YEARS" | "NUMBER";
  readonly value: number;
}

export type Cp003TraceDatum = Cp003TraceRationalDatum | Cp003TraceNumberDatum;

export interface Cp003SolutionTraceStep {
  readonly id: string;
  readonly role: Cp003SolutionStepRole;
  readonly operationId: Cp003SolutionOperationId;
  readonly teachingKey: string;
  readonly data: readonly Cp003TraceDatum[];
}

export interface Cp003SolutionTraceSupport {
  readonly key: string;
  readonly sourceStepIds: readonly string[];
}

export interface Cp003SolutionTrace {
  readonly version: typeof INT_CP003_SOLUTION_TRACE_VERSION;
  readonly qlId: IntCp003QlId;
  readonly methodId: Cp003SolutionMethodId;
  readonly answerSemantic: Cp003AnswerSemantic;
  readonly conceptKey: string;
  readonly coreSteps: readonly Cp003SolutionTraceStep[];
  readonly foundationSteps: readonly Cp003SolutionTraceStep[];
  readonly verificationSteps: readonly Cp003SolutionTraceStep[];
  readonly shortcut?: Cp003SolutionTraceSupport;
  readonly commonMistakeKey?: string;
  readonly finalAnswer: Rational;
  readonly relationVerified: true;
}

const rationalDatum = (
  key: string,
  semantic: Cp003TraceDatumSemantic,
  value: Rational,
): Cp003TraceRationalDatum => Object.freeze({ kind: "RATIONAL", key, semantic, value });

const numberDatum = (
  key: string,
  semantic: "TIME_YEARS" | "NUMBER",
  value: number,
): Cp003TraceNumberDatum => Object.freeze({ kind: "NUMBER", key, semantic, value });

const traceStep = (
  id: string,
  role: Cp003SolutionStepRole,
  operationId: Cp003SolutionOperationId,
  teachingKey: string,
  data: readonly Cp003TraceDatum[],
): Cp003SolutionTraceStep => Object.freeze({ id, role, operationId, teachingKey, data: Object.freeze([...data]) });

const rational = (step: Cp003SolutionTraceStep, key: string): Rational => {
  const datum = step.data.find((entry) => entry.key === key);
  if (!datum || datum.kind !== "RATIONAL") throw new Error(`${step.id}: missing rational datum ${key}`);
  return datum.value;
};

const numeric = (step: Cp003SolutionTraceStep, key: string): number => {
  const datum = step.data.find((entry) => entry.key === key);
  if (!datum || datum.kind !== "NUMBER") throw new Error(`${step.id}: missing number datum ${key}`);
  return datum.value;
};

function annualFactorStep(id: string, ratePercent: Rational): Cp003SolutionTraceStep {
  return traceStep(id, "RELATION", "ANNUAL_FACTOR", "ANNUAL_FACTOR", [
    rationalDatum("ratePercent", "RATE_PERCENT", ratePercent),
    rationalDatum("annualFactor", "FACTOR", factor(ratePercent)),
  ]);
}

function powerStep(
  id: string,
  teachingKey: string,
  base: Rational,
  exponent: number,
): Cp003SolutionTraceStep {
  return traceStep(id, "SIMPLIFICATION", "POWER", teachingKey, [
    rationalDatum("base", "FACTOR", base),
    numberDatum("exponent", "NUMBER", exponent),
    rationalDatum("result", "FACTOR", pow(base, exponent)),
  ]);
}

function multiplyStep(
  id: string,
  teachingKey: string,
  left: Rational,
  right: Rational,
  resultSemantic: Cp003TraceDatumSemantic,
): Cp003SolutionTraceStep {
  return traceStep(id, "SUBSTITUTION", "MULTIPLY", teachingKey, [
    rationalDatum("left", resultSemantic, left),
    rationalDatum("right", "FACTOR", right),
    rationalDatum("result", resultSemantic, mul(left, right)),
  ]);
}

function subtractStep(
  id: string,
  teachingKey: string,
  left: Rational,
  right: Rational,
  semantic: Cp003TraceDatumSemantic,
): Cp003SolutionTraceStep {
  return traceStep(id, "SIMPLIFICATION", "SUBTRACT", teachingKey, [
    rationalDatum("left", semantic, left),
    rationalDatum("right", semantic, right),
    rationalDatum("result", semantic, sub(left, right)),
  ]);
}

function divideStep(
  id: string,
  teachingKey: string,
  numerator: Rational,
  denominator: Rational,
  resultSemantic: Cp003TraceDatumSemantic,
): Cp003SolutionTraceStep {
  return traceStep(id, "SUBSTITUTION", "DIVIDE", teachingKey, [
    rationalDatum("numerator", "MONEY", numerator),
    rationalDatum("denominator", "FACTOR", denominator),
    rationalDatum("result", resultSemantic, div(numerator, denominator)),
  ]);
}

function yearBalanceStep(
  id: string,
  teachingKey: string,
  principal: Rational,
  ratePercent: Rational,
  year: number,
): Cp003SolutionTraceStep {
  return traceStep(id, "INTERMEDIATE_RESULT", "YEAR_BALANCE", teachingKey, [
    rationalDatum("principal", "MONEY", principal),
    rationalDatum("ratePercent", "RATE_PERCENT", ratePercent),
    numberDatum("year", "TIME_YEARS", year),
    rationalDatum("result", "MONEY", amount(principal, ratePercent, year)),
  ]);
}

function yearInterestStep(
  id: string,
  teachingKey: string,
  principal: Rational,
  ratePercent: Rational,
  year: number,
): Cp003SolutionTraceStep {
  return traceStep(id, "INTERMEDIATE_RESULT", "YEAR_INTEREST", teachingKey, [
    rationalDatum("principal", "MONEY", principal),
    rationalDatum("ratePercent", "RATE_PERCENT", ratePercent),
    numberDatum("year", "TIME_YEARS", year),
    rationalDatum("result", "MONEY", yearlyInterest(principal, ratePercent, year)),
  ]);
}

function foundationBalanceSteps(resolved: ResolvedState, finalYear: number): readonly Cp003SolutionTraceStep[] {
  return Object.freeze(Array.from({ length: finalYear + 1 }, (_, year) =>
    yearBalanceStep(`foundation-balance-${year}`, "FOUNDATION_YEAR_BALANCE", resolved.principal, resolved.ratePercent, year)));
}

function foundationInterestSteps(resolved: ResolvedState, firstYear: number, lastYear: number): readonly Cp003SolutionTraceStep[] {
  return Object.freeze(Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
    const year = firstYear + index;
    return yearInterestStep(`foundation-interest-${year}`, "FOUNDATION_YEAR_INTEREST", resolved.principal, resolved.ratePercent, year);
  }));
}

function freezeTrace(input: Omit<Cp003SolutionTrace, "version" | "relationVerified"> & { readonly state: Cp003MathematicalState }): Cp003SolutionTrace {
  if (!verifyAnswer(input.state, input.finalAnswer)) throw new Error(`${input.qlId}: trace final answer failed relation verification`);
  const trace: Cp003SolutionTrace = {
    version: INT_CP003_SOLUTION_TRACE_VERSION,
    qlId: input.qlId,
    methodId: input.methodId,
    answerSemantic: input.answerSemantic,
    conceptKey: input.conceptKey,
    coreSteps: Object.freeze([...input.coreSteps]),
    foundationSteps: Object.freeze([...input.foundationSteps]),
    verificationSteps: Object.freeze([...input.verificationSteps]),
    ...(input.shortcut ? { shortcut: Object.freeze({ key: input.shortcut.key, sourceStepIds: Object.freeze([...input.shortcut.sourceStepIds]) }) } : {}),
    ...(input.commonMistakeKey ? { commonMistakeKey: input.commonMistakeKey } : {}),
    finalAnswer: input.finalAnswer,
    relationVerified: true,
  };
  return Object.freeze(trace);
}

export function buildCp003SolutionTrace(
  contract: Cp003QuestionContract,
  resolved: ResolvedState,
  solution: Rational,
): Cp003SolutionTrace {
  const state = contract.mathematicalState;
  const annualFactor = factor(resolved.ratePercent);
  const answerSemantic = ANSWER_SEMANTICS[contract.qlId];
  let methodId: Cp003SolutionMethodId;
  let conceptKey: string;
  let coreSteps: Cp003SolutionTraceStep[] = [];
  let foundationSteps: readonly Cp003SolutionTraceStep[] = [];
  let verificationSteps: Cp003SolutionTraceStep[] = [];
  let shortcut: Cp003SolutionTraceSupport | undefined;
  let commonMistakeKey: string | undefined;

  switch (contract.qlId) {
    case "INT-QL-053": {
      methodId = "DIRECT_ANNUAL_FACTOR";
      conceptKey = "AMOUNT_BY_ANNUAL_FACTOR";
      const factorStep = annualFactorStep("core-01", resolved.ratePercent);
      const multiplierStep = powerStep("core-02", "GROWTH_MULTIPLIER", annualFactor, resolved.years);
      const amountStep = multiplyStep("core-03", "AMOUNT_PRODUCT", resolved.principal, pow(annualFactor, resolved.years), "MONEY");
      coreSteps = [factorStep, multiplierStep, amountStep];
      foundationSteps = foundationBalanceSteps(resolved, resolved.years);
      if (annualFactor.denominator <= 10n) shortcut = { key: "CANCEL_BEFORE_MULTIPLYING", sourceStepIds: [amountStep.id] };
      commonMistakeKey = "RETURN_INTEREST_INSTEAD_OF_AMOUNT";
      break;
    }
    case "INT-QL-054": {
      methodId = "AMOUNT_MINUS_PRINCIPAL";
      conceptKey = "CI_AS_AMOUNT_MINUS_PRINCIPAL";
      const factorStep = annualFactorStep("core-01", resolved.ratePercent);
      const multiplierStep = powerStep("core-02", "GROWTH_MULTIPLIER", annualFactor, resolved.years);
      const amountStep = multiplyStep("core-03", "AMOUNT_PRODUCT", resolved.principal, pow(annualFactor, resolved.years), "MONEY");
      const interestStep = subtractStep("core-04", "COMPOUND_INTEREST_DIFFERENCE", resolved.amount, resolved.principal, "MONEY");
      coreSteps = [factorStep, multiplierStep, amountStep, interestStep];
      foundationSteps = foundationBalanceSteps(resolved, resolved.years);
      commonMistakeKey = "USE_SIMPLE_INTEREST";
      break;
    }
    case "INT-QL-055": {
      methodId = "REVERSE_COMPOUND_FACTOR";
      conceptKey = "REVERSE_COMPOUND_AMOUNT";
      const factorStep = annualFactorStep("core-01", resolved.ratePercent);
      const multiplierStep = powerStep("core-02", "GROWTH_MULTIPLIER", annualFactor, resolved.years);
      const principalStep = divideStep("core-03", "REVERSE_AMOUNT_TO_PRINCIPAL", resolved.amount, pow(annualFactor, resolved.years), "MONEY");
      coreSteps = [factorStep, multiplierStep, principalStep];
      foundationSteps = Object.freeze([principalStep, ...foundationBalanceSteps(resolved, resolved.years)]);
      shortcut = { key: "REVERSE_FACTOR_DIRECTLY", sourceStepIds: [multiplierStep.id, principalStep.id] };
      commonMistakeKey = "REVERSE_SIMPLE_INTEREST";
      break;
    }
    case "INT-QL-056": {
      methodId = "REVERSE_COMPOUND_INTEREST_FACTOR";
      conceptKey = "PRINCIPAL_FROM_CI_FACTOR";
      const factorStep = annualFactorStep("core-01", resolved.ratePercent);
      const multiplierStep = powerStep("core-02", "GROWTH_MULTIPLIER", annualFactor, resolved.years);
      const ciFactorStep = subtractStep("core-03", "COMPOUND_INTEREST_FACTOR", pow(annualFactor, resolved.years), rat(1), "FACTOR");
      const principalStep = divideStep("core-04", "PRINCIPAL_FROM_CI_FACTOR", resolved.compoundInterest, sub(pow(annualFactor, resolved.years), rat(1)), "MONEY");
      coreSteps = [factorStep, multiplierStep, ciFactorStep, principalStep];
      foundationSteps = coreSteps;
      commonMistakeKey = "COPY_COMPOUND_INTEREST_AS_PRINCIPAL";
      break;
    }
    case "INT-QL-057": {
      methodId = "AMOUNT_RATIO_FACTOR_MATCH";
      conceptKey = "RATE_FROM_GROWTH_FACTOR";
      const ratio = div(resolved.amount, resolved.principal);
      const ratioStep = divideStep("core-01", "AMOUNT_RATIO", resolved.amount, resolved.principal, "FACTOR");
      const factorStep = annualFactorStep("core-02", resolved.ratePercent);
      const matchStep = traceStep("core-03", "RELATION", "MATCH_POWER", "MATCH_FACTOR_POWER_FOR_RATE", [
        rationalDatum("base", "FACTOR", annualFactor),
        numberDatum("exponent", "NUMBER", resolved.years),
        rationalDatum("target", "FACTOR", ratio),
      ]);
      const rateStep = traceStep("core-04", "SIMPLIFICATION", "RATE_FROM_FACTOR", "FACTOR_TO_RATE", [
        rationalDatum("annualFactor", "FACTOR", annualFactor),
        rationalDatum("ratePercent", "RATE_PERCENT", solution),
      ]);
      coreSteps = [ratioStep, factorStep, matchStep, rateStep];
      verificationSteps = [traceStep("verify-01", "VERIFICATION", "YEAR_BALANCE", "VERIFY_AMOUNT_WITH_RATE", [
        rationalDatum("principal", "MONEY", resolved.principal),
        rationalDatum("ratePercent", "RATE_PERCENT", solution),
        numberDatum("year", "TIME_YEARS", resolved.years),
        rationalDatum("result", "MONEY", resolved.amount),
      ])];
      foundationSteps = coreSteps;
      commonMistakeKey = "DIVIDE_TOTAL_GROWTH_BY_YEARS";
      break;
    }
    case "INT-QL-058": {
      methodId = "FACTOR_POWER_TIME_MATCH";
      conceptKey = "TIME_FROM_GROWTH_FACTOR";
      const ratio = div(resolved.amount, resolved.principal);
      const ratioStep = divideStep("core-01", "AMOUNT_RATIO", resolved.amount, resolved.principal, "FACTOR");
      const factorStep = annualFactorStep("core-02", resolved.ratePercent);
      const matchStep = traceStep("core-03", "RELATION", "MATCH_POWER", "MATCH_FACTOR_POWER_FOR_TIME", [
        rationalDatum("base", "FACTOR", annualFactor),
        numberDatum("exponent", "TIME_YEARS", resolved.years),
        rationalDatum("target", "FACTOR", ratio),
      ]);
      coreSteps = [ratioStep, factorStep, matchStep];
      foundationSteps = foundationBalanceSteps(resolved, resolved.years);
      verificationSteps = foundationBalanceSteps(resolved, resolved.years).slice(1);
      commonMistakeKey = "USE_SIMPLE_INTEREST_TIME";
      break;
    }
    case "INT-QL-059": {
      methodId = "NTH_YEAR_OPENING_BALANCE";
      conceptKey = "NTH_YEAR_INTEREST_FROM_OPENING_BALANCE";
      const openingStep = yearBalanceStep("core-01", "OPENING_BALANCE_OF_TARGET_YEAR", resolved.principal, resolved.ratePercent, resolved.targetYear - 1);
      const interestStep = traceStep("core-02", "SUBSTITUTION", "RATE_PERCENT_OF_AMOUNT", "TARGET_YEAR_INTEREST", [
        rationalDatum("amount", "MONEY", amount(resolved.principal, resolved.ratePercent, resolved.targetYear - 1)),
        rationalDatum("ratePercent", "RATE_PERCENT", resolved.ratePercent),
        rationalDatum("result", "MONEY", solution),
      ]);
      coreSteps = [openingStep, interestStep];
      foundationSteps = foundationInterestSteps(resolved, 1, resolved.targetYear);
      shortcut = { key: "OPENING_BALANCE_ONLY", sourceStepIds: [openingStep.id, interestStep.id] };
      commonMistakeKey = "USE_FIRST_YEAR_INTEREST";
      break;
    }
    case "INT-QL-060": {
      methodId = "REVERSE_NTH_YEAR_INTEREST_FACTOR";
      conceptKey = "PRINCIPAL_FROM_NTH_YEAR_INTEREST";
      const factorStep = annualFactorStep("core-01", resolved.ratePercent);
      const rateFractionStep = subtractStep("core-02", "RATE_FRACTION_FROM_FACTOR", annualFactor, rat(1), "FACTOR");
      const priorGrowthStep = powerStep("core-03", "PRIOR_YEAR_GROWTH", annualFactor, resolved.targetYear - 1);
      const yearFactorStep = multiplyStep("core-04", "NTH_YEAR_INTEREST_FACTOR", sub(annualFactor, rat(1)), pow(annualFactor, resolved.targetYear - 1), "FACTOR");
      const principalStep = divideStep("core-05", "PRINCIPAL_FROM_NTH_YEAR_INTEREST_FACTOR", resolved.nthYearInterest, mul(sub(annualFactor, rat(1)), pow(annualFactor, resolved.targetYear - 1)), "MONEY");
      coreSteps = [factorStep, rateFractionStep, priorGrowthStep, yearFactorStep, principalStep];
      foundationSteps = coreSteps;
      commonMistakeKey = "TREAT_NTH_YEAR_AS_FIRST_YEAR";
      break;
    }
    case "INT-QL-061": {
      methodId = "NTH_YEAR_RATE_SUBSTITUTION";
      conceptKey = "RATE_BY_NTH_YEAR_SUBSTITUTION";
      const factorStep = annualFactorStep("core-01", resolved.ratePercent);
      const verificationStep = traceStep("core-02", "VERIFICATION", "VERIFY_NTH_YEAR_RATE", "VERIFY_NTH_YEAR_RATE", [
        rationalDatum("principal", "MONEY", resolved.principal),
        rationalDatum("ratePercent", "RATE_PERCENT", solution),
        numberDatum("year", "TIME_YEARS", resolved.targetYear),
        rationalDatum("expectedInterest", "MONEY", resolved.nthYearInterest),
      ]);
      coreSteps = [factorStep, verificationStep];
      foundationSteps = Object.freeze([factorStep, ...foundationInterestSteps(resolved, 1, resolved.targetYear)]);
      verificationSteps = [verificationStep];
      commonMistakeKey = "USE_DIRECT_INTEREST_TO_PRINCIPAL_RATIO";
      break;
    }
    case "INT-QL-062": {
      methodId = "REVERSE_ONE_YEAR_FACTOR";
      conceptKey = "PREVIOUS_BALANCE_BY_REVERSE_FACTOR";
      const factorStep = annualFactorStep("core-01", resolved.ratePercent);
      const previousStep = divideStep("core-02", "PREVIOUS_BALANCE", resolved.currentAmount, annualFactor, "MONEY");
      coreSteps = [factorStep, previousStep];
      foundationSteps = coreSteps;
      commonMistakeKey = "SUBTRACT_RATE_FROM_CURRENT_BALANCE";
      break;
    }
    case "INT-QL-063": {
      methodId = "CONSECUTIVE_BALANCE_RATE";
      conceptKey = "RATE_FROM_CONSECUTIVE_BALANCES";
      const opening = amount(resolved.principal, resolved.ratePercent, resolved.currentYear - 1);
      const increaseStep = subtractStep("core-01", "ONE_YEAR_INCREASE", resolved.currentAmount, opening, "MONEY");
      const rateStep = traceStep("core-02", "SIMPLIFICATION", "RATE_FROM_INCREASE", "RATE_FROM_OPENING_BALANCE", [
        rationalDatum("increase", "MONEY", sub(resolved.currentAmount, opening)),
        rationalDatum("openingAmount", "MONEY", opening),
        rationalDatum("ratePercent", "RATE_PERCENT", solution),
      ]);
      coreSteps = [increaseStep, rateStep];
      foundationSteps = coreSteps;
      commonMistakeKey = "DIVIDE_BY_CLOSING_BALANCE";
      break;
    }
    case "INT-QL-064": {
      methodId = "CONSECUTIVE_BALANCE_PRINCIPAL";
      conceptKey = "PRINCIPAL_FROM_CONSECUTIVE_BALANCES";
      const observedFactor = div(resolved.nextAmount, resolved.currentAmount);
      const factorStep = divideStep("core-01", "OBSERVED_ANNUAL_FACTOR", resolved.nextAmount, resolved.currentAmount, "FACTOR");
      const multiplierStep = powerStep("core-02", "OBSERVED_FACTOR_POWER", observedFactor, resolved.currentYear);
      const principalStep = divideStep("core-03", "REVERSE_OBSERVED_AMOUNT_TO_PRINCIPAL", resolved.currentAmount, pow(observedFactor, resolved.currentYear), "MONEY");
      coreSteps = [factorStep, multiplierStep, principalStep];
      foundationSteps = Object.freeze([principalStep, ...foundationBalanceSteps(resolved, resolved.currentYear + 1)]);
      commonMistakeKey = "COPY_FIRST_OBSERVED_AMOUNT_AS_PRINCIPAL";
      break;
    }
    case "INT-QL-065": {
      methodId = "ANNUAL_AMOUNT_DIFFERENCE";
      conceptKey = "AMOUNT_DIFFERENCE";
      const earlierStep = yearBalanceStep("core-01", "EARLIER_YEAR_AMOUNT", resolved.principal, resolved.ratePercent, resolved.earlierYear);
      if (resolved.laterYear - resolved.earlierYear === 1) {
        const differenceStep = traceStep("core-02", "SUBSTITUTION", "RATE_PERCENT_OF_AMOUNT", "CONSECUTIVE_AMOUNT_DIFFERENCE", [
          rationalDatum("amount", "MONEY", resolved.earlierAmount),
          rationalDatum("ratePercent", "RATE_PERCENT", resolved.ratePercent),
          rationalDatum("result", "MONEY", solution),
        ]);
        coreSteps = [earlierStep, differenceStep];
        shortcut = { key: "NEXT_YEAR_INTEREST", sourceStepIds: [earlierStep.id, differenceStep.id] };
      } else {
        const laterStep = yearBalanceStep("core-02", "LATER_YEAR_AMOUNT", resolved.principal, resolved.ratePercent, resolved.laterYear);
        const differenceStep = subtractStep("core-03", "AMOUNT_DIFFERENCE", resolved.laterAmount, resolved.earlierAmount, "MONEY");
        coreSteps = [earlierStep, laterStep, differenceStep];
      }
      foundationSteps = foundationBalanceSteps(resolved, resolved.laterYear);
      commonMistakeKey = "USE_SIMPLE_INTEREST_FOR_YEAR_GAP";
      break;
    }
    case "INT-QL-066": {
      methodId = "YEARLY_INTEREST_GEOMETRIC_GROWTH";
      conceptKey = "YEARLY_INTEREST_GP";
      const gap = resolved.laterYear - resolved.earlierYear;
      const multiplierStep = powerStep("core-01", "YEARLY_INTEREST_MULTIPLIER", annualFactor, gap);
      const laterInterestStep = multiplyStep("core-02", "LATER_YEAR_INTEREST", resolved.earlierInterest, pow(annualFactor, gap), "MONEY");
      coreSteps = [multiplierStep, laterInterestStep];
      foundationSteps = foundationInterestSteps(resolved, resolved.earlierYear, resolved.laterYear);
      shortcut = { key: "YEARLY_INTEREST_GP", sourceStepIds: [multiplierStep.id, laterInterestStep.id] };
      commonMistakeKey = "KEEP_YEARLY_INTEREST_CONSTANT";
      break;
    }
  }

  return freezeTrace({
    state,
    qlId: contract.qlId,
    methodId,
    answerSemantic,
    conceptKey,
    coreSteps,
    foundationSteps,
    verificationSteps,
    ...(shortcut ? { shortcut } : {}),
    ...(commonMistakeKey ? { commonMistakeKey } : {}),
    finalAnswer: solution,
  });
}

function validateStep(step: Cp003SolutionTraceStep): string | null {
  try {
    switch (step.operationId) {
      case "ANNUAL_FACTOR":
        return eq(factor(rational(step, "ratePercent")), rational(step, "annualFactor")) ? null : "annual factor mismatch";
      case "POWER":
        return eq(pow(rational(step, "base"), numeric(step, "exponent")), rational(step, "result")) ? null : "power mismatch";
      case "MULTIPLY":
        return eq(mul(rational(step, "left"), rational(step, "right")), rational(step, "result")) ? null : "multiplication mismatch";
      case "SUBTRACT":
        return eq(sub(rational(step, "left"), rational(step, "right")), rational(step, "result")) ? null : "subtraction mismatch";
      case "DIVIDE":
        return eq(div(rational(step, "numerator"), rational(step, "denominator")), rational(step, "result")) ? null : "division mismatch";
      case "RATE_FROM_FACTOR":
        return eq(mul(sub(rational(step, "annualFactor"), rat(1)), rat(100)), rational(step, "ratePercent")) ? null : "factor-to-rate mismatch";
      case "MATCH_POWER":
        return eq(pow(rational(step, "base"), numeric(step, "exponent")), rational(step, "target")) ? null : "factor-power match failed";
      case "YEAR_BALANCE":
        return eq(amount(rational(step, "principal"), rational(step, "ratePercent"), numeric(step, "year")), rational(step, "result")) ? null : "year balance mismatch";
      case "YEAR_INTEREST":
        return eq(yearlyInterest(rational(step, "principal"), rational(step, "ratePercent"), numeric(step, "year")), rational(step, "result")) ? null : "year interest mismatch";
      case "RATE_PERCENT_OF_AMOUNT":
        return eq(mul(rational(step, "amount"), div(rational(step, "ratePercent"), rat(100))), rational(step, "result")) ? null : "percentage-of-amount mismatch";
      case "RATE_FROM_INCREASE":
        return eq(mul(div(rational(step, "increase"), rational(step, "openingAmount")), rat(100)), rational(step, "ratePercent")) ? null : "rate-from-increase mismatch";
      case "VERIFY_NTH_YEAR_RATE":
        return eq(yearlyInterest(rational(step, "principal"), rational(step, "ratePercent"), numeric(step, "year")), rational(step, "expectedInterest")) ? null : "nth-year rate substitution mismatch";
    }
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

export function validateCp003SolutionTrace(
  trace: Cp003SolutionTrace,
  state: Cp003MathematicalState,
): Readonly<{ ok: boolean; errors: readonly string[] }> {
  const errors: string[] = [];
  if (trace.version !== INT_CP003_SOLUTION_TRACE_VERSION) errors.push("trace version mismatch");
  if (trace.qlId !== state.qlId) errors.push("trace QL mismatch");
  if (trace.answerSemantic !== ANSWER_SEMANTICS[state.qlId]) errors.push("trace answer semantic mismatch");
  if (!verifyAnswer(state, trace.finalAnswer)) errors.push("trace final answer failed relation verification");
  const steps = [...trace.coreSteps, ...trace.foundationSteps, ...trace.verificationSteps];
  const identifiers = new Set<string>();
  for (const step of steps) {
    if (identifiers.has(step.id) && !trace.foundationSteps.includes(step) && !trace.verificationSteps.includes(step)) errors.push(`duplicate step id ${step.id}`);
    identifiers.add(step.id);
    const error = validateStep(step);
    if (error) errors.push(`${step.id}: ${error}`);
  }
  const coreIdentifiers = new Set(trace.coreSteps.map((step) => step.id));
  for (const sourceId of trace.shortcut?.sourceStepIds ?? []) {
    if (!coreIdentifiers.has(sourceId)) errors.push(`shortcut source step is not a core step: ${sourceId}`);
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}
