import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "../foundation/rational";
import type {
  IntCp001Wave2AnswerSemantic,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2SolveRequest,
  IntCp001Wave2SolveResult,
  IntCp001Wave2VerificationResult,
  Rational,
} from "./types";

function rateFromPercent(value: Rational): Rational {
  return divideRational(value, rational(100));
}

function interestFor(
  principal: Rational,
  annualRatePercent: Rational,
  timeYears: Rational,
): Rational {
  return multiplyRational(
    multiplyRational(principal, rateFromPercent(annualRatePercent)),
    timeYears,
  );
}

function amountFor(
  principal: Rational,
  annualRatePercent: Rational,
  timeYears: Rational,
): Rational {
  return addRational(principal, interestFor(principal, annualRatePercent, timeYears));
}

function requestSemantic(request: IntCp001Wave2SolveRequest): IntCp001Wave2AnswerSemantic {
  switch (request.mode) {
    case "AMOUNT_FROM_PRT":
      return "TOTAL_AMOUNT";
    case "PRINCIPAL_FROM_INTEREST":
    case "PRINCIPAL_FROM_AMOUNT":
    case "PRINCIPAL_FROM_TWO_AMOUNTS":
      return "PRINCIPAL";
    case "RATE_FROM_INTEREST":
    case "RATE_FROM_AMOUNT":
    case "RATE_FROM_TWO_AMOUNTS":
    case "RATE_FROM_TWO_AMOUNT_RATIO":
      return "ANNUAL_RATE_PERCENT";
    case "TIME_MONTHS_FROM_INTEREST":
    case "TIME_MONTHS_FROM_AMOUNT":
      return "TIME_MONTHS";
    case "ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
      return "ANNUAL_INTEREST";
    case "AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return "AMOUNT_MULTIPLE";
    case "INTEREST_RATIO_FROM_RATE_TIME":
      return "INTEREST_TO_PRINCIPAL_RATIO";
  }
}

function directValue(request: IntCp001Wave2SolveRequest): Rational | null {
  switch (request.mode) {
    case "AMOUNT_FROM_PRT":
      return amountFor(request.principal, request.annualRatePercent, request.timeYears);
    case "ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
      return divideRational(
        subtractRational(request.laterAmount, request.earlierAmount),
        subtractRational(request.laterTimeYears, request.earlierTimeYears),
      );
    case "AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return addRational(
        rational(1),
        multiplyRational(rateFromPercent(request.annualRatePercent), request.timeYears),
      );
    case "INTEREST_RATIO_FROM_RATE_TIME":
      return multiplyRational(rateFromPercent(request.annualRatePercent), request.timeYears);
    default:
      return null;
  }
}

function candidateMatches(
  request: IntCp001Wave2SolveRequest,
  candidate: Rational,
): boolean {
  switch (request.mode) {
    case "PRINCIPAL_FROM_INTEREST":
      return equalsRational(
        interestFor(candidate, request.annualRatePercent, request.timeYears),
        request.simpleInterest,
      );
    case "PRINCIPAL_FROM_AMOUNT":
      return equalsRational(
        amountFor(candidate, request.annualRatePercent, request.timeYears),
        request.amount,
      );
    case "RATE_FROM_INTEREST":
      return equalsRational(
        interestFor(request.principal, candidate, request.timeYears),
        request.simpleInterest,
      );
    case "RATE_FROM_AMOUNT":
      return equalsRational(
        amountFor(request.principal, candidate, request.timeYears),
        request.amount,
      );
    case "TIME_MONTHS_FROM_INTEREST": {
      const timeYears = divideRational(candidate, rational(12));
      return equalsRational(
        interestFor(request.principal, request.annualRatePercent, timeYears),
        request.simpleInterest,
      );
    }
    case "TIME_MONTHS_FROM_AMOUNT": {
      const timeYears = divideRational(candidate, rational(12));
      return equalsRational(
        amountFor(request.principal, request.annualRatePercent, timeYears),
        request.amount,
      );
    }
    case "PRINCIPAL_FROM_TWO_AMOUNTS": {
      const earlierAnnualInterest = divideRational(
        subtractRational(request.earlierAmount, candidate),
        request.earlierTimeYears,
      );
      const laterAnnualInterest = divideRational(
        subtractRational(request.laterAmount, candidate),
        request.laterTimeYears,
      );
      return compareRational(earlierAnnualInterest, rational(0)) > 0
        && equalsRational(earlierAnnualInterest, laterAnnualInterest);
    }
    case "RATE_FROM_TWO_AMOUNTS": {
      const rate = rateFromPercent(candidate);
      const earlierPrincipal = divideRational(
        request.earlierAmount,
        addRational(rational(1), multiplyRational(rate, request.earlierTimeYears)),
      );
      const laterPrincipal = divideRational(
        request.laterAmount,
        addRational(rational(1), multiplyRational(rate, request.laterTimeYears)),
      );
      return compareRational(earlierPrincipal, rational(0)) > 0
        && equalsRational(earlierPrincipal, laterPrincipal);
    }
    case "RATE_FROM_TWO_AMOUNT_RATIO": {
      const rate = rateFromPercent(candidate);
      const reconstructedRatio = divideRational(
        addRational(rational(1), multiplyRational(rate, request.laterTimeYears)),
        addRational(rational(1), multiplyRational(rate, request.earlierTimeYears)),
      );
      return equalsRational(reconstructedRatio, request.laterToEarlierAmountRatio);
    }
    default:
      return false;
  }
}

function enumerateDomain(parameters: IntCp001Wave2PrototypeParameters): Rational[] {
  const domain = parameters.verificationDomain;
  switch (domain.kind) {
    case "DIRECT":
      return [];
    case "RATE_POOL":
    case "MONTH_POOL":
      return domain.values;
    case "PRINCIPAL_GRID": {
      const values: Rational[] = [];
      for (let current = domain.minimum; current <= domain.maximum; current += domain.step) {
        values.push(rational(current));
      }
      return values;
    }
  }
}

function verifyHiddenState(parameters: IntCp001Wave2PrototypeParameters): string[] {
  const errors: string[] = [];
  const state = parameters.hiddenState;
  if (!equalsRational(rateFromPercent(state.annualRatePercent), state.annualRate)) {
    errors.push("Stored annual decimal rate disagrees with the percentage rate.");
  }
  if (!equalsRational(
    multiplyRational(state.principal, state.annualRate),
    state.annualInterest,
  )) {
    errors.push("Stored annual interest does not equal principal times annual rate.");
  }
  if (!equalsRational(
    interestFor(state.principal, state.annualRatePercent, state.earlierTimeYears),
    state.earlierInterest,
  )) {
    errors.push("Earlier timeline interest does not balance.");
  }
  if (!equalsRational(
    interestFor(state.principal, state.annualRatePercent, state.laterTimeYears),
    state.laterInterest,
  )) {
    errors.push("Later timeline interest does not balance.");
  }
  if (!equalsRational(addRational(state.principal, state.earlierInterest), state.earlierAmount)) {
    errors.push("Earlier amount does not equal principal plus earlier interest.");
  }
  if (!equalsRational(addRational(state.principal, state.laterInterest), state.laterAmount)) {
    errors.push("Later amount does not equal principal plus later interest.");
  }
  return errors;
}

export function verifyIntCp001Wave2Independently(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
): IntCp001Wave2VerificationResult {
  const errors = verifyHiddenState(parameters);
  const expectedSemantic = requestSemantic(parameters.request);
  if (solution.semantic !== expectedSemantic) {
    errors.push(`Answer semantic mismatch: ${solution.semantic} !== ${expectedSemantic}.`);
  }

  const direct = directValue(parameters.request);
  if (parameters.verificationDomain.kind === "DIRECT") {
    if (direct === null) {
      errors.push("Direct verification was assigned to an inverse request.");
    } else if (!equalsRational(direct, solution.value)) {
      errors.push(
        `Independent direct value ${rationalKey(direct)} disagrees with ${rationalKey(solution.value)}.`,
      );
    }
    return { ok: errors.length === 0, errors };
  }

  if (direct !== null) {
    errors.push("An inverse verification domain was assigned to a direct request.");
    return { ok: false, errors };
  }

  const matches = enumerateDomain(parameters).filter((candidate) =>
    candidateMatches(parameters.request, candidate),
  );
  const matchingCandidates = matches.map(rationalKey);
  if (matches.length !== 1) {
    errors.push(`Expected exactly one admissible inverse solution; found ${matches.length}.`);
  } else if (!equalsRational(matches[0]!, solution.value)) {
    errors.push(
      `Unique admissible value ${rationalKey(matches[0]!)} disagrees with solver ${rationalKey(solution.value)}.`,
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    matchingCandidates,
  };
}
