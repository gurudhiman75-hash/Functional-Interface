import { buildMathJax, factorCount, hcfOf, mathJaxPresent, primeFactorize } from "./math";
import type { NsHcf001Parameters, NsHcf001SolverResult } from "./types";

export function solveNsHcf001(parameters: NsHcf001Parameters): NsHcf001SolverResult {
  const answer = answerFor(parameters);
  const validCandidates = parameters.canonicalProblemId === "CP-003" ? validCp003Candidates(parameters) : [];
  const numbersForHcf = parameters.canonicalProblemId === "CP-003" ? [...(parameters.knownOperands ?? []), answer] : parameters.numbers;
  const hcf = hcfOf(numbersForHcf);
  const mathJax = buildMathJax(parameters, answer, validCandidates);
  const commonDivisorCount = parameters.canonicalProblemId === "CP-002" ? factorCount(hcf) : undefined;
  const result: NsHcf001SolverResult = {
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    topology: parameters.topology,
    numbers: numbersForHcf,
    knownOperands: parameters.knownOperands,
    targetHcf: parameters.targetHcf,
    cp003Family: parameters.cp003Family,
    candidateValues: parameters.candidateValues ?? [],
    validCandidates,
    missingNumber: parameters.canonicalProblemId === "CP-003" ? answer : undefined,
    hcf,
    answer,
    commonDivisorCount,
    operandPrimeFactorizations: numbersForHcf.map((number) => primeFactorize(number)),
    hcfPrimeFactorization: primeFactorize(hcf),
    ...mathJax,
    verification: {
      inputValid: numbersForHcf.every((number) => Number.isInteger(number) && number > 0),
      hcfValid: numbersForHcf.every((number) => number % hcf === 0),
      commonDivisorCountValid: parameters.canonicalProblemId !== "CP-002" || answer === factorCount(hcf),
      uniquenessValid: parameters.canonicalProblemId !== "CP-003" || validCandidates.length === 1,
      mathJaxValid: mathJaxPresent(mathJax),
      answerRuleSatisfied: answerRuleSatisfied(parameters, answer, hcf, validCandidates),
    },
  };
  return result;
}

export function validCp003Candidates(parameters: NsHcf001Parameters) {
  if (parameters.canonicalProblemId !== "CP-003") return [];
  const known = parameters.knownOperands ?? [];
  const target = parameters.targetHcf;
  if (!target) return [];
  return (parameters.candidateValues ?? []).filter((value) => hcfOf([...known, value]) === target && satisfiesExtraCondition(parameters, value));
}

function answerFor(parameters: NsHcf001Parameters) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return hcfOf(parameters.numbers);
    case "CP-002":
      return factorCount(hcfOf(parameters.numbers));
    case "CP-003": {
      const candidates = validCp003Candidates(parameters);
      if (candidates.length !== 1) throw new Error(`NS-HCF-001 CP-003 must have exactly one valid answer; found ${candidates.length}.`);
      return candidates[0];
    }
    case "CP-004":
      return hcfOf(parameters.numbers);
  }
}

function satisfiesExtraCondition(parameters: NsHcf001Parameters, value: number) {
  const idNumber = Number(parameters.questionLanguageId.slice(3));
  if ((idNumber >= 16 && idNumber <= 20) || idNumber === 36 || idNumber === 39) {
    return typeof parameters.rangeStart === "number" && typeof parameters.rangeEnd === "number" && value >= parameters.rangeStart && value <= parameters.rangeEnd;
  }
  if ((idNumber >= 21 && idNumber <= 25) || idNumber === 37 || idNumber === 40) {
    return (parameters.candidateValues ?? []).includes(value);
  }
  if ((idNumber >= 26 && idNumber <= 30) || idNumber === 38) {
    return Boolean(parameters.divisibleBy && parameters.notDivisibleBy && value % parameters.divisibleBy === 0 && value % parameters.notDivisibleBy !== 0);
  }
  if (idNumber === 32 || idNumber === 34) {
    return Boolean(parameters.baseNumber && parameters.decrease && value === parameters.baseNumber - parameters.decrease);
  }
  if (idNumber >= 31 && idNumber <= 35) {
    return Boolean(parameters.baseNumber && parameters.increase && value === parameters.baseNumber + parameters.increase);
  }
  return true;
}

function answerRuleSatisfied(parameters: NsHcf001Parameters, answer: number, hcf: number, validCandidates: readonly number[]) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return answer === hcf;
    case "CP-002":
      return answer === factorCount(hcfOf(parameters.numbers));
    case "CP-003":
      return validCandidates.length === 1 && validCandidates[0] === answer && hcf === parameters.targetHcf;
    case "CP-004":
      return answer === hcf;
  }
}
