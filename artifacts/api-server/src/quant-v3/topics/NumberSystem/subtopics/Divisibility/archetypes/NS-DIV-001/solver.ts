import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001Parameters,
  type Cp001SolverResult,
} from "./types";
import { assertNsDiv001DivisorCapabilityAllowed } from "./realism-library";

export function solveCp001(parameters: Cp001Parameters): Cp001SolverResult {
  if (parameters.archetypeId !== NS_DIV_001_ARCHETYPE_ID) {
    throw new Error("NS-DIV-001 solver received an unsupported archetype.");
  }
  if (parameters.canonicalProblemId !== NS_DIV_001_CANONICAL_PROBLEM_ID) {
    throw new Error("NS-DIV-001 solver only supports CP-001 in the reference slice.");
  }
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);

  const knownDigitSum = parameters.knownDigits.reduce((sum, digit) => sum + digit, 0);
  const validCandidates = parameters.candidateDomain.filter((candidate) => {
    const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(candidate)));
    return resolvedNumber % parameters.divisor === 0;
  });

  if (validCandidates.length !== 1) {
    throw new Error("CP-001 parameter set must resolve to exactly one valid missing digit.");
  }

  const answerDigit = validCandidates[0];
  const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(answerDigit)));
  const digitSum = knownDigitSum + answerDigit;

  return {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
    reasoningPatternId: divisorCapability.reasoningPattern.id,
    knownDigitSum,
    validCandidates,
    answerDigit,
    resolvedNumber,
    verification: {
      digitSum,
      divisor: parameters.divisor,
      isDivisible: resolvedNumber % parameters.divisor === 0,
    },
  };
}
