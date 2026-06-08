import { buildMathJax, coprimeFactorPairs, factorPairs, gcd, hcfOf, lcmOf, mathJaxPresent, operandSizeBucket, parseRatio, quotientSizeBucket } from "./math";
import type { NsHl001Answer, NsHl001Pair, NsHl001Parameters, NsHl001SolverResult } from "./types";

export function solveNsHl001(parameters: NsHl001Parameters): NsHl001SolverResult {
  const solved = answerFor(parameters);
  const quotient = parameters.hcf && parameters.lcm && parameters.lcm % parameters.hcf === 0 ? parameters.lcm / parameters.hcf : undefined;
  const allFactorPairs = quotient ? factorPairs(quotient) : [];
  const coprimePairs = quotient ? coprimeFactorPairs(quotient) : [];
  const selectedPairs = selectedMultiplierPairs(parameters, coprimePairs);
  const answerPair = solved.answerPair;
  const mathJax = buildMathJax(parameters, { answer: solved.answer, answerPair, quotient, factorPairs: allFactorPairs, coprimePairs, selectedPairs });
  const product = parameters.product ?? (parameters.hcf && parameters.lcm ? parameters.hcf * parameters.lcm : undefined);
  const result: NsHl001SolverResult = {
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    topology: parameters.topology,
    hcf: parameters.hcf,
    lcm: parameters.lcm,
    product,
    answer: solved.answer,
    answerPair,
    quotient,
    factorPairs: allFactorPairs,
    coprimePairs,
    selectedPairs,
    cp001Family: parameters.cp001Family,
    validityType: parameters.validityType,
    conditionType: parameters.conditionType,
    pairPolicy: parameters.pairPolicy,
    pairCountCase: parameters.pairCountCase,
    ratioType: parameters.ratioType,
    ratioReductionType: parameters.ratioReductionType,
    operandSize: operandSizeBucket(typeof solved.answer === "number" ? solved.answer : product),
    quotientSize: quotientSizeBucket(quotient),
    coprimeMultiplierCount: coprimePairs.length,
    ...mathJax,
    verification: {
      inputValid: inputValid(parameters),
      productRelationValid: productRelationValid(parameters),
      divisibilityValid: divisibilityValid(parameters),
      numberConsistencyValid: numberConsistencyValid(parameters),
      uniquenessValid: parameters.canonicalProblemId !== "CP-004" || selectedPairs.length === 1,
      pairPolicyValid: parameters.canonicalProblemId !== "CP-005" || Boolean(parameters.pairPolicy),
      ratioValid: parameters.canonicalProblemId !== "CP-006" || ratioValid(parameters, answerPair),
      mathJaxValid: mathJaxPresent(mathJax),
      answerRuleSatisfied: answerRuleSatisfied(parameters, solved.answer, answerPair, selectedPairs),
    },
  };
  return result;
}

function answerFor(parameters: NsHl001Parameters): { answer: NsHl001Answer; answerPair?: NsHl001Pair } {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return { answer: cp001Answer(parameters) };
    case "CP-002":
      return { answer: validityDecision(parameters) ? "Valid" : "Invalid" };
    case "CP-003": {
      const answer = ((parameters.hcf ?? 0) * (parameters.lcm ?? 0)) / (parameters.knownNumber ?? 1);
      return { answer, answerPair: orderedPair(parameters.knownNumber ?? 0, answer) };
    }
    case "CP-004": {
      const quotient = quotientOrThrow(parameters);
      const selected = selectedMultiplierPairs(parameters, coprimeFactorPairs(quotient));
      if (selected.length !== 1) throw new Error(`NS-HL-001 CP-004 must have exactly one answer; found ${selected.length}.`);
      const pair = reconstruct(parameters.hcf ?? 1, selected[0]);
      return { answer: formatAnswerPair(pair), answerPair: pair };
    }
    case "CP-005": {
      const quotient = quotientOrThrow(parameters);
      const count = coprimeFactorPairs(quotient).length;
      return { answer: parameters.pairPolicy === "orderedPairs" ? count * 2 : count };
    }
    case "CP-006": {
      const pair = ratioPair(parameters);
      return { answer: formatAnswerPair(pair), answerPair: pair };
    }
  }
}

function cp001Answer(parameters: NsHl001Parameters) {
  if (parameters.cp001Family === "findLcm") return (parameters.product ?? 0) / (parameters.hcf ?? 1);
  if (parameters.cp001Family === "findHcf") return (parameters.product ?? 0) / (parameters.lcm ?? 1);
  return (parameters.hcf ?? 0) * (parameters.lcm ?? 0);
}

function validityDecision(parameters: NsHl001Parameters) {
  return divisibilityValid(parameters) && productRelationValid(parameters) && numberConsistencyValid(parameters);
}

function selectedMultiplierPairs(parameters: NsHl001Parameters, pairs: readonly NsHl001Pair[]) {
  if (parameters.canonicalProblemId !== "CP-004") return [];
  const hcf = parameters.hcf ?? 1;
  return pairs.filter((pair) => {
    const reconstructed = reconstruct(hcf, pair);
    if (parameters.conditionType === "sumCondition") return reconstructed.a + reconstructed.b === parameters.sum;
    if (parameters.conditionType === "differenceCondition") return Math.abs(reconstructed.b - reconstructed.a) === parameters.difference;
    if (parameters.conditionType === "rangeCondition") return [reconstructed.a, reconstructed.b].some((value) => value >= (parameters.lowerBound ?? 0) && value <= (parameters.upperBound ?? 0));
    return true;
  });
}

function quotientOrThrow(parameters: NsHl001Parameters) {
  if (!parameters.hcf || !parameters.lcm || parameters.lcm % parameters.hcf !== 0) throw new Error("NS-HL-001 requires LCM to be divisible by HCF.");
  return parameters.lcm / parameters.hcf;
}

function reconstruct(hcf: number, pair: NsHl001Pair): NsHl001Pair {
  return orderedPair(hcf * pair.a, hcf * pair.b);
}

function orderedPair(a: number, b: number): NsHl001Pair {
  return a <= b ? { a, b } : { a: b, b: a };
}

function formatAnswerPair(pair: NsHl001Pair) {
  return `${pair.a} and ${pair.b}`;
}

function ratioPair(parameters: NsHl001Parameters): NsHl001Pair {
  const ratio = parseRatio(parameters.ratio ?? "1:1");
  let multiplier: number;
  if (parameters.hcf) multiplier = parameters.hcf;
  else if (parameters.lcm) multiplier = parameters.lcm / (ratio.reducedLeft * ratio.reducedRight);
  else throw new Error("NS-HL-001 CP-006 requires HCF or LCM.");
  if (!Number.isInteger(multiplier) || multiplier <= 0) throw new Error("NS-HL-001 CP-006 multiplier must be a positive integer.");
  return orderedPair(ratio.reducedLeft * multiplier, ratio.reducedRight * multiplier);
}

function inputValid(parameters: NsHl001Parameters) {
  return [parameters.hcf, parameters.lcm, parameters.product, parameters.a, parameters.b, parameters.knownNumber].every((value) => value === undefined || (Number.isInteger(value) && value > 0));
}

function divisibilityValid(parameters: NsHl001Parameters) {
  if (!parameters.hcf || !parameters.lcm) return true;
  return parameters.lcm % parameters.hcf === 0;
}

function productRelationValid(parameters: NsHl001Parameters) {
  if (parameters.a && parameters.b && parameters.hcf && parameters.lcm) return parameters.a * parameters.b === parameters.hcf * parameters.lcm;
  return true;
}

function numberConsistencyValid(parameters: NsHl001Parameters) {
  if (parameters.a && parameters.b && parameters.hcf && parameters.lcm) {
    return hcfOf([parameters.a, parameters.b]) === parameters.hcf && lcmOf([parameters.a, parameters.b]) === parameters.lcm;
  }
  return true;
}

function ratioValid(parameters: NsHl001Parameters, pair: NsHl001Pair | undefined) {
  if (!pair || !parameters.ratio) return false;
  const ratio = parseRatio(parameters.ratio);
  const ratioMatches = pair.a / pair.b === ratio.reducedLeft / ratio.reducedRight;
  const hcfMatches = !parameters.hcf || hcfOf([pair.a, pair.b]) === parameters.hcf;
  const lcmMatches = !parameters.lcm || lcmOf([pair.a, pair.b]) === parameters.lcm;
  return ratioMatches && hcfMatches && lcmMatches;
}

function answerRuleSatisfied(parameters: NsHl001Parameters, answer: NsHl001Answer, pair: NsHl001Pair | undefined, selectedPairs: readonly NsHl001Pair[]) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return answer === cp001Answer(parameters);
    case "CP-002":
      return answer === (validityDecision(parameters) ? "Valid" : "Invalid");
    case "CP-003":
      return typeof answer === "number" && Number.isInteger(answer) && Boolean(pair) && hcfOf([pair.a, pair.b]) === parameters.hcf && lcmOf([pair.a, pair.b]) === parameters.lcm;
    case "CP-004":
      return selectedPairs.length === 1 && Boolean(pair) && hcfOf([pair!.a, pair!.b]) === parameters.hcf && lcmOf([pair!.a, pair!.b]) === parameters.lcm;
    case "CP-005":
      return typeof answer === "number";
    case "CP-006":
      return ratioValid(parameters, pair);
  }
}
