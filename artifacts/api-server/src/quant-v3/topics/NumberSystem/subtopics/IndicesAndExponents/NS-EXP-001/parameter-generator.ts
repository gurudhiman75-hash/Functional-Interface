import { getQuestionLanguageEntries } from "./library";
import { referenceAnswerFor } from "./reference-verifier";
import {
  NS_EXP_001_ARCHETYPE_ID,
  type NsExp001CanonicalProblemId,
  type NsExp001DifficultyBand,
  type NsExp001Parameters,
  type NsExp001VariableMap,
} from "./types";

export interface NsExp001ParameterInput {
  seed?: string;
  difficultyBand?: NsExp001DifficultyBand;
  questionLanguageId?: string;
}

const ES_BY_CP: Record<NsExp001CanonicalProblemId, string> = {
  CP01: "ES-001", CP02: "ES-002", CP03: "ES-003", CP04: "ES-004",
  CP05: "ES-005", CP06: "ES-006", CP07: "ES-007", CP09: "ES-008",
};

export function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stableBucket(seed: string, modulo: number) {
  return modulo <= 0 ? 0 : hashSeed(seed) % modulo;
}

function pick<T>(seed: string, values: readonly T[]): T {
  return values[stableBucket(seed, values.length)]!;
}

function int(seed: string, min: number, max: number): number {
  return min + stableBucket(seed, max - min + 1);
}

function interpolate(template: string, variables: NsExp001VariableMap): string {
  return Object.keys(variables)
    .sort((a, b) => b.length - a.length)
    .reduce((text, key) => text.replace(new RegExp(`\\b${key}\\b`, "g"), String(variables[key])), template);
}

function classify(cpId: NsExp001CanonicalProblemId, template: string): { operationType: string; comparisonMode?: string } {
  if (cpId === "CP01") {
    if (template.includes("innerExponent")) return { operationType: "powerOfPower" };
    if (template.includes("\\times {base} \\div")) return { operationType: "multiplyByBaseThenDivide" };
    if (template.includes("\\frac") && template.includes("thirdExponent")) return { operationType: "denominatorProduct" };
    if (template.includes("\\times") && template.includes("\\div")) {
      return { operationType: template.indexOf("\\div") < template.indexOf("\\times") ? "divideThenMultiply" : "multiplyThenDivide" };
    }
    if (template.includes("\\times")) return { operationType: "multiplication" };
    return { operationType: "division" };
  }

  if (cpId === "CP02") {
    if (template.includes("x/divisor")) return { operationType: "divisorEquation" };
    if (template.includes("coefficient") && template.includes("- constant")) return { operationType: "coefficientMinusConstant" };
    if (template.includes("coefficient") && template.includes("+ constant")) return { operationType: "coefficientPlusConstant" };
    if (template.includes("coefficient")) return { operationType: "coefficientEquation" };
    if (template.includes("x+constant")) return { operationType: "plusConstant" };
    if (template.includes("x-constant")) return { operationType: "minusConstant" };
    return { operationType: "directEquality" };
  }

  if (cpId === "CP03") {
    if (template.includes("= {visibleBase2}^x")) return { operationType: "equationRightX" };
    if (template.includes("coefficient") && template.includes("=")) return { operationType: "equationCoefficient" };
    if (template.includes("x+shift") && template.includes("=")) return { operationType: "equationShift" };
    if (template.includes("^x =") && template.includes("targetExponent")) return { operationType: "equationDirect" };
    if (template.includes("Arrange")) return { operationType: "ordering", comparisonMode: template.includes("decreasing") ? "descending" : "ascending" };
    if (/largest|greatest/i.test(template)) return { operationType: "greatest", comparisonMode: "greatest" };
    if (/smallest|least/i.test(template)) return { operationType: "smallest", comparisonMode: "smallest" };
    if (/Which is smaller/i.test(template)) return { operationType: "pairComparison", comparisonMode: "smaller" };
    if (/Which is greater/i.test(template)) return { operationType: "pairComparison", comparisonMode: "greater" };
    if (/Compare/i.test(template)) return { operationType: "pairComparison", comparisonMode: "relation" };
    return { operationType: "simplification" };
  }

  if (cpId === "CP04") {
    if (template.includes("firstNegativeExponent")) return { operationType: "negativeFraction" };
    if (template.includes("positiveExponent") && template.includes("\\frac")) return { operationType: "positiveOverNegative" };
    if (template.includes("positiveExponent")) return { operationType: "mixedSigns" };
    return { operationType: "negativeOnly" };
  }

  if (cpId === "CP05") {
    if (template.includes("3/2")) return { operationType: "threeHalves" };
    if (template.includes("1/rootDegree")) return { operationType: "rootOnly" };
    return { operationType: "fractionalPower" };
  }

  if (cpId === "CP06") {
    const fractional = template.includes("fractionalExponentNumerator");
    const root = template.includes("1/rootDegree");
    if (fractional && template.includes("negativeExponent") && template.includes("\\times")) return { operationType: "fractionalTimesNegative" };
    if (fractional && template.includes("negativeExponent") && template.includes("\\frac")) return { operationType: "fractionalOverNegative" };
    if (fractional && template.includes(")^{positiveExponent}") && template.includes("divisorBase")) return { operationType: "fractionalPowerThenDividePowered" };
    if (fractional && template.includes("positiveExponent") && template.includes("divisorBase")) return { operationType: "fractionalPlusIntegerDivisor" };
    if (root && template.includes("positiveExponent") && template.includes("negativeExponent")) return { operationType: "rootIntegerOverNegative" };
    if (root && template.includes("positiveExponent") && template.includes("{base}^{rootDegree}")) return { operationType: "rootIntegerOverPower" };
    if (root && template.includes(")^{positiveExponent}") && template.includes("divisorBase")) return { operationType: "rootPowerDivisor" };
    if (root && template.includes("\\frac") && template.includes("{base}^{rootDegree}")) return { operationType: "rootOverPower" };
    if (root && template.includes("negativeExponent")) return { operationType: "rootTimesNegative" };
    return { operationType: "mixedIntegerNegativeDivisor" };
  }

  if (cpId === "CP07") {
    if (template.includes("Arrange")) return { operationType: "ordering", comparisonMode: template.includes("decreasing") ? "descending" : "ascending" };
    if (/largest|greatest/i.test(template)) return { operationType: "greatest", comparisonMode: "greatest" };
    if (/smallest|least/i.test(template)) return { operationType: "smallest", comparisonMode: "smallest" };
    if (/Which is smaller/i.test(template)) return { operationType: "pairComparison", comparisonMode: "smaller" };
    if (/Compare/i.test(template)) return { operationType: "pairComparison", comparisonMode: "relation" };
    return { operationType: "pairComparison", comparisonMode: "greater" };
  }

  if (template.includes("+increment")) return { operationType: "increase" };
  if (template.includes("-decrement")) return { operationType: "decrease" };
  return { operationType: "multiplication" };
}

function generateVariables(cpId: NsExp001CanonicalProblemId, template: string, operationType: string, seed: string): NsExp001VariableMap {
  if (cpId === "CP01") {
    const base = pick(`${seed}:base`, [2, 3, 5, 7, 11]);
    const firstExponent = int(`${seed}:e1`, 4, 10);
    const secondExponent = int(`${seed}:e2`, 1, 4);
    const thirdExponent = int(`${seed}:e3`, 1, Math.max(1, firstExponent + secondExponent - 1));
    const innerExponent = int(`${seed}:inner`, 2, 5);
    const outerExponent = template.includes(")^2") ? 2 : int(`${seed}:outer`, 2, 4);
    const resultExponent = int(`${seed}:result`, 1, Math.max(1, innerExponent * outerExponent - 1));
    return { base, firstExponent, secondExponent, thirdExponent, innerExponent, outerExponent, resultExponent };
  }

  if (cpId === "CP02") {
    const base = pick(`${seed}:base`, [2, 3, 5, 7, 11, 13]);
    const coefficient = int(`${seed}:coefficient`, 2, 4);
    const constant = int(`${seed}:constant`, 1, 4);
    const divisor = int(`${seed}:divisor`, 2, 4);
    let answerExponent = int(`${seed}:x`, 3, 10);
    if (operationType === "minusConstant" && answerExponent <= constant) answerExponent = constant + 2;
    if (operationType === "divisorEquation") answerExponent = divisor * int(`${seed}:quotient`, 2, 6);
    let targetExponent = answerExponent;
    if (operationType === "plusConstant") targetExponent = answerExponent + constant;
    if (operationType === "minusConstant") targetExponent = answerExponent - constant;
    if (operationType === "coefficientMinusConstant") targetExponent = coefficient * answerExponent - constant;
    if (operationType === "coefficientPlusConstant") targetExponent = coefficient * answerExponent + constant;
    if (operationType === "coefficientEquation") targetExponent = coefficient * answerExponent;
    if (operationType === "divisorEquation") targetExponent = answerExponent / divisor;
    return { base, coefficient, constant, divisor, answerExponent, targetExponent };
  }

  if (cpId === "CP03" || cpId === "CP07") {
    const commonBase = pick(`${seed}:commonBase`, [2, 3]);
    const transformationPower1 = pick(`${seed}:p1`, [2, 3]);
    const transformationPower2 = transformationPower1 === 2 ? 3 : 2;
    const transformationPower3 = 4;
    const visibleBase1 = commonBase ** transformationPower1;
    const visibleBase2 = commonBase ** transformationPower2;
    const visibleBase3 = commonBase ** transformationPower3;
    let firstExponent = int(`${seed}:e1`, 2, 6);
    const secondExponent = int(`${seed}:e2`, 2, 6);
    const thirdExponent = int(`${seed}:e3`, 2, 6);
    const shift = int(`${seed}:shift`, 1, 3);
    const coefficient = int(`${seed}:coefficient`, 2, 3);
    let targetExponent = int(`${seed}:target`, 2, 8);
    if (cpId === "CP03") {
      if (operationType === "equationDirect") {
        const k = int(`${seed}:k`, 1, 4); firstExponent = transformationPower2 * k; targetExponent = transformationPower1 * k;
      } else if (operationType === "equationShift") {
        const k = int(`${seed}:k`, 2, 5); targetExponent = transformationPower1 * k; firstExponent = transformationPower2 * k - shift;
      } else if (operationType === "equationCoefficient") {
        const k = int(`${seed}:k`, 1, 4); firstExponent = transformationPower2 * k; targetExponent = transformationPower1 * coefficient * k;
      } else if (operationType === "equationRightX") {
        const k = int(`${seed}:k`, 1, 4); firstExponent = transformationPower2 * k; targetExponent = transformationPower1 * k;
      } else if (operationType === "simplification") {
        for (let candidate = 2; candidate <= 9; candidate += 1) {
          if (transformationPower1 * candidate - transformationPower2 * secondExponent > 0) { firstExponent = candidate; break; }
        }
      }
    }
    return { commonBase, transformationPower1, transformationPower2, transformationPower3, visibleBase1, visibleBase2, visibleBase3, firstExponent, secondExponent, thirdExponent, shift, coefficient, targetExponent };
  }

  if (cpId === "CP04") {
    const base = pick(`${seed}:base`, [2, 3, 5, 7, 10]);
    const negativeExponent = -int(`${seed}:negative`, 1, 4);
    const positiveExponent = int(`${seed}:positive`, 2, 6);
    const firstNegativeExponent = -int(`${seed}:firstNegative`, 1, 3);
    const secondNegativeExponent = firstNegativeExponent - int(`${seed}:gap`, 1, 3);
    return { base, negativeExponent, positiveExponent, firstNegativeExponent, secondNegativeExponent };
  }

  if (cpId === "CP05") {
    const root = int(`${seed}:root`, 2, 5);
    if (operationType === "threeHalves") return { base: root ** 2, rootDegree: 2, fractionalExponentNumerator: 3, fractionalExponentDenominator: 2 };
    const denominator = int(`${seed}:degree`, 2, 4);
    const numerator = operationType === "rootOnly" ? 1 : int(`${seed}:numerator`, 1, Math.min(3, denominator));
    return { base: root ** denominator, rootDegree: denominator, fractionalExponentNumerator: numerator, fractionalExponentDenominator: denominator };
  }

  if (cpId === "CP06") {
    const commonPrime = pick(`${seed}:prime`, [2, 3]);
    const basePower = int(`${seed}:basePower`, 2, 3);
    const base = commonPrime ** basePower;
    const divisorPower = int(`${seed}:divisorPower`, 1, 2);
    const divisorBase = commonPrime ** divisorPower;
    const positiveExponent = int(`${seed}:positive`, 1, 4);
    const negativeExponent = -int(`${seed}:negative`, 1, 2);
    const fractionalExponentNumerator = int(`${seed}:numerator`, 1, basePower);
    return { commonPrime, basePower, base, divisorPower, divisorBase, positiveExponent, negativeExponent, rootDegree: basePower, fractionalExponentNumerator, fractionalExponentDenominator: basePower };
  }

  const base = pick(`${seed}:base`, [2, 3, 4, 5, 7]);
  const answerExponent = int(`${seed}:knownExponent`, 2, 4);
  const knownValue = base ** answerExponent;
  const increment = int(`${seed}:increment`, 1, 3);
  const decrement = int(`${seed}:decrement`, 1, Math.max(1, answerExponent - 1));
  const multiplier = int(`${seed}:multiplier`, 2, 3);
  const coefficient = multiplier;
  return { base, answerExponent, knownValue, increment, decrement, multiplier, coefficient };
}

export function generateNsExp001Parameters(cpId: NsExp001CanonicalProblemId, input: NsExp001ParameterInput = {}): NsExp001Parameters {
  const seed = input.seed ?? `NS-EXP-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficulty(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQl(cpId, seed);
  const entry = getQuestionLanguageEntries(cpId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Missing question language ${questionLanguageId} for ${cpId}`);
  const classification = classify(cpId, entry.text);
  const variables = generateVariables(cpId, entry.text, classification.operationType, seed);
  const expression = interpolate(entry.text, variables);
  const expectedAnswer = referenceAnswerFor({ cpId, operationType: classification.operationType, comparisonMode: classification.comparisonMode, variables });
  return {
    archetypeId: NS_EXP_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `NS-EXP-001:${cpId}:${seed}`,
    difficultyBand,
    questionLanguageId,
    explanationId: ES_BY_CP[cpId],
    stemTemplate: entry.text,
    variables,
    expression,
    expectedAnswer,
    coverageBucket: classification.operationType,
    operationType: classification.operationType,
    comparisonMode: classification.comparisonMode,
  };
}

function selectDifficulty(seed: string): NsExp001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQl(cpId: NsExp001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(cpId);
  const indexMatch = seed.match(/:(\d+)$/);
  const index = indexMatch ? Number(indexMatch[1]) % entries.length : stableBucket(`${seed}:ql`, entries.length);
  return entries[index]!.id;
}
