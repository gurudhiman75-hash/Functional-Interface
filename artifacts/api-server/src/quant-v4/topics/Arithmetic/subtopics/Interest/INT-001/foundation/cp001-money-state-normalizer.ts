import { solveIntCp001 } from "./cp001-solver";
import {
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import type {
  IntCp001PrototypeParameters,
  IntCp001SolveRequest,
  Rational,
  SimpleInterestState,
} from "./types";

function usesMoneyAnswer(request: IntCp001SolveRequest): boolean {
  return request.mode === "INTEREST_FROM_PRT"
    || request.mode === "AMOUNT_FROM_PRT"
    || request.mode === "PRINCIPAL_FROM_INTEREST"
    || request.mode === "PRINCIPAL_FROM_AMOUNT"
    || request.mode === "ANNUAL_INTEREST_FROM_TOTAL"
    || request.mode === "INTEREST_FOR_SUBDURATION";
}

function scaleState(state: SimpleInterestState, factor: Rational): SimpleInterestState {
  return {
    ...state,
    principal: multiplyRational(state.principal, factor),
    simpleInterest: multiplyRational(state.simpleInterest, factor),
    amount: multiplyRational(state.amount, factor),
  };
}

function scaleRequest(request: IntCp001SolveRequest, factor: Rational): IntCp001SolveRequest {
  switch (request.mode) {
    case "INTEREST_FROM_PRT":
      return { ...request, principal: multiplyRational(request.principal, factor) };
    case "AMOUNT_FROM_PRT":
      return { ...request, principal: multiplyRational(request.principal, factor) };
    case "PRINCIPAL_FROM_INTEREST":
      return { ...request, simpleInterest: multiplyRational(request.simpleInterest, factor) };
    case "PRINCIPAL_FROM_AMOUNT":
      return { ...request, amount: multiplyRational(request.amount, factor) };
    case "ANNUAL_INTEREST_FROM_TOTAL":
      return { ...request, totalInterest: multiplyRational(request.totalInterest, factor) };
    case "INTEREST_FOR_SUBDURATION":
      return { ...request, totalInterest: multiplyRational(request.totalInterest, factor) };
    default:
      return request;
  }
}

/**
 * Scales the complete money state when a money answer is fractional. This keeps
 * every ratio, rate and duration unchanged while producing exam-realistic
 * integral-rupee answers without rounding any intermediate value.
 */
export function normaliseIntCp001MoneyState(
  parameters: IntCp001PrototypeParameters,
): IntCp001PrototypeParameters {
  if (!usesMoneyAnswer(parameters.request)) return parameters;
  const preliminary = solveIntCp001(parameters.request);
  if (isWholeRational(preliminary.value)) return parameters;

  const factor = rational(preliminary.value.denominator);
  const hiddenState = scaleState(parameters.hiddenState, factor);
  const request = scaleRequest(parameters.request, factor);
  const normalised = solveIntCp001(request);
  if (!isWholeRational(normalised.value)) {
    throw new Error(`${parameters.prototypeId} could not construct an integral money answer.`);
  }

  return {
    ...parameters,
    hiddenState,
    request,
    generationFingerprint: [
      parameters.generationFingerprint,
      "integral-money-scale",
      rationalKey(factor),
    ].join("::"),
  };
}
