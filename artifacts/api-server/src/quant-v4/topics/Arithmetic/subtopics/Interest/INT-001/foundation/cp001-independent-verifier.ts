import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./rational";
import type {
  IntAnswerSemantic,
  IntCp001PrototypeParameters,
  IntCp001SolveRequest,
  IntCp001SolveResult,
  Rational,
  VerificationResult,
} from "./types";

function rateFromPercent(percent: Rational): Rational {
  return divideRational(percent, rational(100));
}

function interestFor(principal: Rational, ratePercent: Rational, timeYears: Rational): Rational {
  const interestPerYear = multiplyRational(principal, rateFromPercent(ratePercent));
  return multiplyRational(interestPerYear, timeYears);
}

function requestSemantic(request: IntCp001SolveRequest): IntAnswerSemantic {
  switch (request.mode) {
    case "INTEREST_FROM_PRT":
    case "INTEREST_FOR_SUBDURATION":
      return "SIMPLE_INTEREST";
    case "AMOUNT_FROM_PRT":
      return "TOTAL_AMOUNT";
    case "PRINCIPAL_FROM_INTEREST":
    case "PRINCIPAL_FROM_AMOUNT":
      return "PRINCIPAL";
    case "RATE_FROM_INTEREST":
    case "RATE_FROM_AMOUNT":
    case "RATE_FROM_AMOUNT_MULTIPLE":
    case "RATE_FROM_INTEREST_PRINCIPAL_RATIO":
      return "ANNUAL_RATE_PERCENT";
    case "TIME_FROM_INTEREST":
    case "TIME_FROM_AMOUNT":
    case "TIME_FROM_AMOUNT_MULTIPLE":
    case "TIME_FROM_INTEREST_MULTIPLE":
      return "TIME_YEARS";
    case "ANNUAL_INTEREST_FROM_TOTAL":
      return "ANNUAL_INTEREST";
  }
}

function directValue(request: IntCp001SolveRequest): Rational | null {
  switch (request.mode) {
    case "INTEREST_FROM_PRT":
      return interestFor(request.principal, request.annualRatePercent, request.timeYears);
    case "AMOUNT_FROM_PRT":
      return addRational(
        request.principal,
        interestFor(request.principal, request.annualRatePercent, request.timeYears),
      );
    case "ANNUAL_INTEREST_FROM_TOTAL": {
      const oneYearShare = divideRational(request.totalInterest, request.timeYears);
      return oneYearShare;
    }
    case "INTEREST_FOR_SUBDURATION": {
      const oneYearInterest = divideRational(request.totalInterest, request.knownTimeYears);
      return multiplyRational(oneYearInterest, request.targetTimeYears);
    }
    default:
      return null;
  }
}

function candidateMatches(request: IntCp001SolveRequest, candidate: Rational): boolean {
  switch (request.mode) {
    case "PRINCIPAL_FROM_INTEREST":
      return equalsRational(
        interestFor(candidate, request.annualRatePercent, request.timeYears),
        request.simpleInterest,
      );
    case "PRINCIPAL_FROM_AMOUNT": {
      const reconstructed = addRational(
        candidate,
        interestFor(candidate, request.annualRatePercent, request.timeYears),
      );
      return equalsRational(reconstructed, request.amount);
    }
    case "RATE_FROM_INTEREST":
      return equalsRational(
        interestFor(request.principal, candidate, request.timeYears),
        request.simpleInterest,
      );
    case "RATE_FROM_AMOUNT": {
      const reconstructed = addRational(
        request.principal,
        interestFor(request.principal, candidate, request.timeYears),
      );
      return equalsRational(reconstructed, request.amount);
    }
    case "TIME_FROM_INTEREST":
      return equalsRational(
        interestFor(request.principal, request.annualRatePercent, candidate),
        request.simpleInterest,
      );
    case "TIME_FROM_AMOUNT": {
      const reconstructed = addRational(
        request.principal,
        interestFor(request.principal, request.annualRatePercent, candidate),
      );
      return equalsRational(reconstructed, request.amount);
    }
    case "RATE_FROM_AMOUNT_MULTIPLE": {
      const reconstructed = addRational(
        rational(1),
        multiplyRational(rateFromPercent(candidate), request.timeYears),
      );
      return equalsRational(reconstructed, request.amountMultiple);
    }
    case "TIME_FROM_AMOUNT_MULTIPLE": {
      const reconstructed = addRational(
        rational(1),
        multiplyRational(rateFromPercent(request.annualRatePercent), candidate),
      );
      return equalsRational(reconstructed, request.amountMultiple);
    }
    case "TIME_FROM_INTEREST_MULTIPLE": {
      const reconstructed = multiplyRational(rateFromPercent(request.annualRatePercent), candidate);
      return equalsRational(reconstructed, request.interestToPrincipalRatio);
    }
    case "RATE_FROM_INTEREST_PRINCIPAL_RATIO": {
      const reconstructed = multiplyRational(rateFromPercent(candidate), request.timeYears);
      return equalsRational(reconstructed, request.interestToPrincipalRatio);
    }
    default:
      return false;
  }
}

function enumerateDomain(parameters: IntCp001PrototypeParameters): Rational[] {
  const domain = parameters.verificationDomain;
  switch (domain.kind) {
    case "DIRECT":
      return [];
    case "RATE_POOL":
    case "TIME_POOL":
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

function verifyHiddenState(parameters: IntCp001PrototypeParameters): string[] {
  const errors: string[] = [];
  const state = parameters.hiddenState;
  const reconstructedInterest = interestFor(
    state.principal,
    state.annualRatePercent,
    state.timeYears,
  );
  if (!equalsRational(reconstructedInterest, state.simpleInterest)) {
    errors.push("Hidden simple-interest state does not balance.");
  }
  if (!equalsRational(addRational(state.principal, state.simpleInterest), state.amount)) {
    errors.push("Hidden amount does not equal principal plus interest.");
  }
  if (!equalsRational(rateFromPercent(state.annualRatePercent), state.annualRate)) {
    errors.push("Stored annual decimal rate disagrees with the percentage rate.");
  }
  return errors;
}

export function verifyIntCp001Independently(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
): VerificationResult {
  const errors = verifyHiddenState(parameters);
  const expectedSemantic = requestSemantic(parameters.request);
  if (solution.semantic !== expectedSemantic) {
    errors.push(`Answer semantic mismatch: ${solution.semantic} !== ${expectedSemantic}.`);
  }

  const direct = directValue(parameters.request);
  if (parameters.verificationDomain.kind === "DIRECT") {
    if (direct === null) {
      errors.push("Direct verification domain was assigned to an inverse request.");
    } else if (!equalsRational(direct, solution.value)) {
      errors.push(`Independent direct value ${rationalKey(direct)} disagrees with ${rationalKey(solution.value)}.`);
    }
    return { ok: errors.length === 0, errors };
  }

  if (direct !== null) {
    errors.push("Inverse verification domain was assigned to a direct request.");
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

export function reconstructEvidenceWithCandidate(
  request: IntCp001SolveRequest,
  candidate: Rational,
): Rational | null {
  switch (request.mode) {
    case "PRINCIPAL_FROM_INTEREST":
      return interestFor(candidate, request.annualRatePercent, request.timeYears);
    case "PRINCIPAL_FROM_AMOUNT":
      return addRational(candidate, interestFor(candidate, request.annualRatePercent, request.timeYears));
    case "RATE_FROM_INTEREST":
      return interestFor(request.principal, candidate, request.timeYears);
    case "RATE_FROM_AMOUNT":
      return addRational(request.principal, interestFor(request.principal, candidate, request.timeYears));
    case "TIME_FROM_INTEREST":
      return interestFor(request.principal, request.annualRatePercent, candidate);
    case "TIME_FROM_AMOUNT":
      return addRational(request.principal, interestFor(request.principal, request.annualRatePercent, candidate));
    case "RATE_FROM_AMOUNT_MULTIPLE":
      return addRational(rational(1), multiplyRational(rateFromPercent(candidate), request.timeYears));
    case "TIME_FROM_AMOUNT_MULTIPLE":
      return addRational(rational(1), multiplyRational(rateFromPercent(request.annualRatePercent), candidate));
    case "TIME_FROM_INTEREST_MULTIPLE":
      return multiplyRational(rateFromPercent(request.annualRatePercent), candidate);
    case "RATE_FROM_INTEREST_PRINCIPAL_RATIO":
      return multiplyRational(rateFromPercent(candidate), request.timeYears);
    case "INTEREST_FROM_PRT":
      return interestFor(request.principal, request.annualRatePercent, request.timeYears);
    case "AMOUNT_FROM_PRT":
      return addRational(
        request.principal,
        interestFor(request.principal, request.annualRatePercent, request.timeYears),
      );
    case "ANNUAL_INTEREST_FROM_TOTAL":
      return divideRational(request.totalInterest, request.timeYears);
    case "INTEREST_FOR_SUBDURATION":
      return multiplyRational(
        divideRational(request.totalInterest, request.knownTimeYears),
        request.targetTimeYears,
      );
  }
}

export function interestPortion(amount: Rational, principal: Rational): Rational {
  return subtractRational(amount, principal);
}
