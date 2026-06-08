import {
  buildFactorModel,
  factorsDivisibleBy,
  factorsNotDivisibleBy,
  mathJaxValuesPresent,
  positionClass,
} from "./math";
import {
  NS_FAC_001_ARCHETYPE_ID,
  NS_FAC_001_CP_001,
  NS_FAC_001_CP_002,
  NS_FAC_001_CP_003,
  NS_FAC_001_CP_004,
  NS_FAC_001_CP_005,
  NS_FAC_001_CP_006,
  NS_FAC_001_CP_007,
  NS_FAC_001_CP_008,
  NS_FAC_001_CP_009,
  type NsFac001Answer,
  type NsFac001Parameters,
  type NsFac001SolverResult,
} from "./types";

export function solveNsFac001(parameters: NsFac001Parameters): NsFac001SolverResult {
  const factorModel = buildFactorModel(parameters.number, parameters.k, parameters.position);
  const divisibleFactors = typeof parameters.k === "number" ? factorsDivisibleBy(factorModel.factorList, parameters.k) : [];
  const notDivisibleFactors = typeof parameters.k === "number" ? factorsNotDivisibleBy(factorModel.factorList, parameters.k) : [];
  const selectedFactor = selectedFactorFor(parameters, factorModel.factorsIncreasing, factorModel.factorsDecreasing);
  const answer = answerFor(parameters, factorModel, divisibleFactors, selectedFactor);
  const result = {
    archetypeId: NS_FAC_001_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    topology: parameters.topology,
    number: parameters.number,
    k: parameters.k,
    position: parameters.position,
    ordinalDisplay: parameters.ordinalDisplay,
    answer,
    factorModel,
    primeFactorization: factorModel.primeFactorization,
    factorCount: factorModel.factorCount,
    factorSum: factorModel.factorSum,
    factorProduct: factorModel.factorProductString,
    factorProductString: factorModel.factorProductString,
    productDigitCount: factorModel.productDigitCount,
    factorList: factorModel.factorList,
    factorsIncreasing: factorModel.factorsIncreasing,
    factorsDecreasing: factorModel.factorsDecreasing,
    largestPrimeFactor: factorModel.largestPrimeFactor,
    smallestPrimeFactor: factorModel.smallestPrimeFactor,
    isPrimeInput: factorModel.isPrimeInput,
    isCompositeInput: factorModel.isCompositeInput,
    isPerfectSquare: factorModel.isPerfectSquare,
    isPrimePower: factorModel.isPrimePower,
    isMixedPrime: factorModel.isMixedPrime,
    isHighlyCompositeNumber: factorModel.isHighlyCompositeNumber,
    selectedPosition: parameters.position,
    selectedFactor,
    selectedK: parameters.k,
    divisibleFactors,
    notDivisibleFactors,
    divisibleFactorCount: typeof parameters.k === "number" ? divisibleFactors.length : undefined,
    notDivisibleFactorCount: typeof parameters.k === "number" ? factorModel.factorCount - divisibleFactors.length : undefined,
    positionClass: positionClass(parameters.position, factorModel.factorCount),
    primeFactorizationLatex: factorModel.primeFactorizationLatex,
    factorCountFormulaLatex: factorModel.factorCountFormulaLatex,
    factorSumFormulaLatex: factorModel.factorSumFormulaLatex,
    factorProductFormulaLatex: factorModel.factorProductFormulaLatex,
    factorListLatex: factorModel.factorListLatex,
    factorsIncreasingLatex: factorModel.factorsIncreasingLatex,
    factorsDecreasingLatex: factorModel.factorsDecreasingLatex,
    kPrimeFactorizationLatex: factorModel.kPrimeFactorizationLatex,
    divisibleFactorConstraintLatex: factorModel.divisibleFactorConstraintLatex,
    complementFormulaLatex: factorModel.complementFormulaLatex,
    selectedPositionFormulaLatex: factorModel.selectedPositionFormulaLatex,
    greatestProperFactorFormulaLatex: factorModel.greatestProperFactorFormulaLatex,
    perfectSquareRuleLatex: factorModel.perfectSquareRuleLatex,
  };

  return {
    ...result,
    verification: {
      inputValid: Number.isInteger(parameters.number) && parameters.number > 1,
      factorizationValid: factorModel.primeFactorization.reduce((product, term) => product * term.power, 1) === parameters.number,
      factorCountValid: factorModel.factorCount === factorModel.factorList.length,
      factorSumValid: factorModel.factorSum === factorModel.factorList.reduce((sum, factor) => sum + factor, 0),
      factorProductValid: factorModel.factorProductString === factorModel.factorList.reduce((product, factor) => product * BigInt(factor), 1n).toString(),
      bigIntSerializationValid: /^\d+$/.test(factorModel.factorProductString),
      productDigitCountValid: factorModel.productDigitCount === factorModel.factorProductString.length,
      mathJaxValid: mathJaxValuesPresent(factorModel),
      answerRuleSatisfied: answerRuleSatisfied(parameters, factorModel, divisibleFactors, selectedFactor, answer),
    },
  };
}

export const solveNsFac001Cp001 = solveNsFac001;
export const solveNsFac001Cp002 = solveNsFac001;
export const solveNsFac001Cp003 = solveNsFac001;
export const solveNsFac001Cp004 = solveNsFac001;
export const solveNsFac001Cp005 = solveNsFac001;
export const solveNsFac001Cp006 = solveNsFac001;
export const solveNsFac001Cp007 = solveNsFac001;
export const solveNsFac001Cp008 = solveNsFac001;
export const solveNsFac001Cp009 = solveNsFac001;

function answerFor(
  parameters: NsFac001Parameters,
  factorModel: ReturnType<typeof buildFactorModel>,
  divisibleFactors: readonly number[],
  selectedFactor: number | undefined,
): NsFac001Answer {
  switch (parameters.canonicalProblemId) {
    case NS_FAC_001_CP_001:
      return factorModel.factorCount;
    case NS_FAC_001_CP_002:
      return factorModel.factorSum;
    case NS_FAC_001_CP_003:
      return factorModel.factorProductString;
    case NS_FAC_001_CP_004:
      return factorModel.isPerfectSquare ? "Odd" : "Even";
    case NS_FAC_001_CP_005:
      return factorModel.greatestProperFactor;
    case NS_FAC_001_CP_006:
      assertK(parameters, factorModel);
      return divisibleFactors.length;
    case NS_FAC_001_CP_007:
      assertK(parameters, factorModel);
      return factorModel.factorCount - divisibleFactors.length;
    case NS_FAC_001_CP_008:
    case NS_FAC_001_CP_009:
      assertPosition(parameters, factorModel);
      return requiredNumber(selectedFactor, "selectedFactor");
  }
}

function selectedFactorFor(parameters: NsFac001Parameters, increasing: readonly number[], decreasing: readonly number[]) {
  if (typeof parameters.position !== "number") return undefined;
  if (parameters.canonicalProblemId === NS_FAC_001_CP_008) return increasing[parameters.position - 1];
  if (parameters.canonicalProblemId === NS_FAC_001_CP_009) return decreasing[parameters.position - 1];
  return undefined;
}

function answerRuleSatisfied(
  parameters: NsFac001Parameters,
  factorModel: ReturnType<typeof buildFactorModel>,
  divisibleFactors: readonly number[],
  selectedFactor: number | undefined,
  answer: NsFac001Answer,
) {
  switch (parameters.canonicalProblemId) {
    case NS_FAC_001_CP_001:
      return answer === factorModel.factorCount;
    case NS_FAC_001_CP_002:
      return answer === factorModel.factorSum;
    case NS_FAC_001_CP_003:
      return answer === factorModel.factorProductString;
    case NS_FAC_001_CP_004:
      return answer === (factorModel.isPerfectSquare ? "Odd" : "Even");
    case NS_FAC_001_CP_005:
      return answer === factorModel.greatestProperFactor;
    case NS_FAC_001_CP_006:
      return answer === divisibleFactors.length;
    case NS_FAC_001_CP_007:
      return answer === factorModel.factorCount - divisibleFactors.length;
    case NS_FAC_001_CP_008:
    case NS_FAC_001_CP_009:
      return answer === selectedFactor;
  }
}

function assertK(parameters: NsFac001Parameters, factorModel: ReturnType<typeof buildFactorModel>) {
  if (typeof parameters.k !== "number" || !Number.isInteger(parameters.k) || parameters.k < 2 || parameters.number % parameters.k !== 0) {
    throw new Error("NS-FAC-001 k must be a non-trivial factor that divides number.");
  }
  if (!factorModel.factorList.includes(parameters.k)) throw new Error("NS-FAC-001 k must be a factor.");
}

function assertPosition(parameters: NsFac001Parameters, factorModel: ReturnType<typeof buildFactorModel>) {
  if (typeof parameters.position !== "number" || !Number.isInteger(parameters.position) || parameters.position < 1 || parameters.position > factorModel.factorCount) {
    throw new Error("NS-FAC-001 position must satisfy 1 <= position <= factorCount.");
  }
}

function requiredNumber(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`Missing NS-FAC-001 value: ${name}`);
  return value;
}
