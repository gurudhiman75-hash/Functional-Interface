import { buildMathJax, commonFactorBucket, commonFactors, density, factorsOf, gcd, hcfBucket, hcfSize, isPrime, mathJaxPresent, reduceRatio, unorderedPairs } from "./math";
import type { NsCop001Answer, NsCop001Parameters, NsCop001SolverResult } from "./types";

export function solveNsCop001(parameters: NsCop001Parameters): NsCop001SolverResult {
  const solved = answerFor(parameters);
  const hcf = hcfFor(parameters);
  const cf = commonFactorsFor(parameters);
  const listEvaluations = (parameters.numberList ?? []).map((value) => ({ value, hcf: gcd(parameters.targetNumber ?? 1, value), valid: gcd(parameters.targetNumber ?? 1, value) === 1 }));
  const candidateEvaluations = (parameters.candidateSet ?? []).map((value) => ({ value, hcf: gcd(parameters.number ?? 1, value), valid: gcd(parameters.number ?? 1, value) === 1 }));
  const allPairs = unorderedPairs(parameters.numberSet ?? []);
  const pairEvaluations = allPairs.map((pair) => ({ pair, hcf: gcd(pair.a, pair.b), valid: gcd(pair.a, pair.b) === 1 }));
  const coprimePairs = pairEvaluations.filter((entry) => entry.valid).map((entry) => entry.pair);
  const reduced = parameters.a && parameters.b ? reduceRatio(parameters.a, parameters.b) : undefined;
  const mathJax = buildMathJax(parameters, { hcf, commonFactors: cf, listEvaluations, candidateEvaluations, pairEvaluations, reducedRatio: reduced?.ratio });
  const result: NsCop001SolverResult = {
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    topology: parameters.topology,
    answer: solved,
    hcf,
    commonFactors: cf,
    coprimeStatus: hcf === 1 ? "coprime" : "notCoprime",
    numberList: parameters.numberList ?? [],
    numberSet: parameters.numberSet ?? [],
    candidateSet: parameters.candidateSet ?? [],
    validCandidates: candidateEvaluations.filter((entry) => entry.valid).map((entry) => entry.value),
    coprimePairs,
    allPairs,
    reducedRatio: reduced?.ratio,
    cp001AnswerType: parameters.cp001AnswerType,
    generationBucket: parameters.generationBucket,
    listLength: parameters.listLength,
    coprimeDensity: parameters.canonicalProblemId === "CP-002" ? density(listEvaluations.filter((entry) => entry.valid).length, listEvaluations.length) : undefined,
    candidateCount: parameters.canonicalProblemId === "CP-003" ? (parameters.candidateSet ?? []).length : undefined,
    distractorCount: parameters.canonicalProblemId === "CP-003" ? (parameters.candidateSet ?? []).length - candidateEvaluations.filter((entry) => entry.valid).length : undefined,
    setSize: parameters.setSize,
    pairCount: parameters.canonicalProblemId === "CP-004" ? coprimePairs.length : undefined,
    ratioType: parameters.ratioType,
    hcfBucket: hcfBucket(hcf),
    commonFactorBucket: commonFactorBucket(cf.length),
    hcfSize: hcfSize(hcf),
    ...mathJax,
    verification: {
      inputValid: inputValid(parameters),
      answerConsistentWithHcf: answerConsistentWithHcf(parameters, solved, hcf),
      answerConsistentWithCommonFactors: answerConsistentWithCommonFactors(parameters, solved, cf),
      uniqueCandidateValid: parameters.canonicalProblemId !== "CP-003" || candidateEvaluations.filter((entry) => entry.valid).length === 1,
      reducedRatioEquivalent: parameters.canonicalProblemId !== "CP-006" || ratioEquivalent(parameters, reduced?.ratio),
      reducedTermsCoprime: parameters.canonicalProblemId !== "CP-006" || Boolean(reduced && gcd(reduced.left, reduced.right) === 1),
      mathJaxValid: mathJaxPresent(mathJax),
      answerRuleSatisfied: answerRuleSatisfied(parameters, solved),
    },
  };
  return result;
}

function answerFor(parameters: NsCop001Parameters): NsCop001Answer {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return cp001Answer(parameters);
    case "CP-002":
      return (parameters.numberList ?? []).filter((value) => gcd(parameters.targetNumber ?? 1, value) === 1).length;
    case "CP-003": {
      const valid = (parameters.candidateSet ?? []).filter((value) => gcd(parameters.number ?? 1, value) === 1);
      if (valid.length !== 1) throw new Error(`NS-COP-001 CP-003 must have exactly one valid candidate; found ${valid.length}.`);
      return valid[0];
    }
    case "CP-004":
      return unorderedPairs(parameters.numberSet ?? []).filter((pair) => gcd(pair.a, pair.b) === 1).length;
    case "CP-005":
      if (parameters.questionLanguageId === "QL-021") return "1";
      if (parameters.questionLanguageId === "QL-022") return 1;
      return 1;
    case "CP-006":
      return reduceRatio(parameters.a ?? 1, parameters.b ?? 1).ratio;
  }
}

function cp001Answer(parameters: NsCop001Parameters): NsCop001Answer {
  const hcf = gcd(parameters.a ?? 1, parameters.b ?? 1);
  const cf = commonFactors(parameters.a ?? 1, parameters.b ?? 1);
  if (parameters.cp001AnswerType === "hcfValue") return hcf;
  if (parameters.cp001AnswerType === "commonFactorCount") return cf.length;
  if (parameters.cp001AnswerType === "categorySelection") return category(parameters.a ?? 1, parameters.b ?? 1, hcf);
  return hcf === 1 ? "Co-prime" : "Not co-prime";
}

function category(a: number, b: number, hcf: number) {
  if (hcf === 1) return "Co-prime pair";
  if (isPrime(a) && isPrime(b)) return "Prime pair";
  if (!isPrime(a) && !isPrime(b)) return "Composite pair";
  return "Equal-factor pair";
}

function hcfFor(parameters: NsCop001Parameters) {
  if (parameters.a && parameters.b) return gcd(parameters.a, parameters.b);
  if (parameters.number && parameters.nextNumber) return gcd(parameters.number, parameters.nextNumber);
  return undefined;
}

function commonFactorsFor(parameters: NsCop001Parameters) {
  if (parameters.a && parameters.b) return commonFactors(parameters.a, parameters.b);
  if (parameters.number && parameters.nextNumber) return commonFactors(parameters.number, parameters.nextNumber);
  return [];
}

function inputValid(parameters: NsCop001Parameters) {
  return [parameters.a, parameters.b, parameters.number, parameters.nextNumber, parameters.targetNumber, ...(parameters.numberList ?? []), ...(parameters.numberSet ?? []), ...(parameters.candidateSet ?? [])].every((value) => value === undefined || (Number.isInteger(value) && value > 0));
}

function answerConsistentWithHcf(parameters: NsCop001Parameters, answer: NsCop001Answer, hcf: number | undefined) {
  if (parameters.canonicalProblemId === "CP-001" && parameters.cp001AnswerType === "hcfValue") return answer === hcf;
  if (parameters.canonicalProblemId === "CP-005") return answer === 1 || answer === "1";
  return true;
}

function answerConsistentWithCommonFactors(parameters: NsCop001Parameters, answer: NsCop001Answer, cf: readonly number[]) {
  if (parameters.canonicalProblemId === "CP-001" && parameters.cp001AnswerType === "commonFactorCount") return answer === cf.length;
  if (parameters.canonicalProblemId === "CP-005" && parameters.questionLanguageId === "QL-022") return answer === cf.length;
  return true;
}

function ratioEquivalent(parameters: NsCop001Parameters, reducedRatio: string | undefined) {
  if (!reducedRatio || !parameters.a || !parameters.b) return false;
  const [left, right] = reducedRatio.split(":").map(Number);
  return parameters.a * right === parameters.b * left;
}

function answerRuleSatisfied(parameters: NsCop001Parameters, answer: NsCop001Answer) {
  return answer === answerFor(parameters);
}
