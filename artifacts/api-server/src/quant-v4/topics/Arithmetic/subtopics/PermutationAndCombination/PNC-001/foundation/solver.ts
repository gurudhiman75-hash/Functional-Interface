import { divideExact, productExact, subtractExact, sumExact } from "./math";
import type {
  Pnc001IndependentVerification,
  Pnc001Parameters,
  Pnc001SolverResult,
} from "./types";
import { getPnc001VariableRanges } from "./library";

function cartesianEnumeration(stageCounts: number[]): number {
  let count = 0;
  const visit = (stage: number): void => {
    if (stage === stageCounts.length) {
      count += 1;
      return;
    }
    for (let index = 0; index < stageCounts[stage]!; index += 1) visit(stage + 1);
  };
  visit(0);
  return count;
}

export function solvePnc001(parameters: Pnc001Parameters): Pnc001SolverResult {
  const ceiling = getPnc001VariableRanges().answerCeiling;
  const value = (key: string): number => {
    const found = parameters.values[key];
    if (!Number.isInteger(found)) throw new Error(`Missing integer PNC-001 value: ${key}`);
    return found;
  };

  switch (parameters.solveMode) {
    case "countSequentialIndependentChoices": {
      const stages = parameters.requiredVariables.map(value);
      const answer = productExact(stages, ceiling);
      const expression = stages.join(" × ");
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${expression} = ${answer}`,
        mathJax: `${stages.join(" \\times ")} = ${answer}`,
        evidence: { operation: "PRODUCT", stageCounts: stages, totalCount: answer },
      };
    }
    case "countMutuallyExclusiveAlternatives": {
      const stages = parameters.requiredVariables.map(value);
      const answer = sumExact(stages, ceiling);
      const expression = stages.join(" + ");
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${expression} = ${answer}`,
        mathJax: `${stages.join(" + ")} = ${answer}`,
        evidence: { operation: "SUM", stageCounts: stages, totalCount: answer },
      };
    }
    case "countDisjointCasePartition": {
      const caseAFactors = [value("caseAFirst"), value("caseARest")];
      const caseBFactors = [value("caseBFirst"), value("caseBRest")];
      const caseA = productExact(caseAFactors, ceiling);
      const caseB = productExact(caseBFactors, ceiling);
      const answer = sumExact([caseA, caseB], ceiling);
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `(${caseAFactors.join(" × ")}) + (${caseBFactors.join(" × ")}) = ${answer}`,
        mathJax: `(${caseAFactors.join(" \\times ")}) + (${caseBFactors.join(" \\times ")}) = ${answer}`,
        evidence: {
          operation: "SUM_OF_PRODUCTS",
          caseCounts: [
            { label: "A", count: caseA, factors: caseAFactors },
            { label: "B", count: caseB, factors: caseBFactors },
          ],
          totalCount: answer,
        },
      };
    }
    case "countUsingSimpleComplement": {
      const stages = [value("choiceA"), value("choiceB")];
      const total = productExact(stages, ceiling);
      const invalid = value("invalidChoices");
      const answer = subtractExact(total, invalid);
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${stages.join(" × ")} − ${invalid} = ${answer}`,
        mathJax: `${stages.join(" \\times ")} - ${invalid} = ${answer}`,
        evidence: { operation: "COMPLEMENT", stageCounts: stages, totalCount: total, invalidCount: invalid },
      };
    }
    case "recoverMissingStageChoiceCount": {
      const total = value("totalChoices");
      const known = value("knownChoices");
      const answer = divideExact(total, known);
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${total} ÷ ${known} = ${answer}`,
        mathJax: `\\frac{${total}}{${known}} = ${answer}`,
        evidence: { operation: "EXACT_DIVISION", totalChoices: total, knownChoices: known, totalCount: answer },
      };
    }
    default: {
      const exhaustive: never = parameters.solveMode;
      throw new Error(`Unsupported PNC-001 solve mode: ${exhaustive}`);
    }
  }
}

export function verifyPnc001Independently(parameters: Pnc001Parameters): Pnc001IndependentVerification {
  const value = (key: string) => parameters.values[key]!;
  switch (parameters.solveMode) {
    case "countSequentialIndependentChoices": {
      const answer = cartesianEnumeration(parameters.requiredVariables.map(value));
      return { supported: true, answer, method: "Cartesian-product enumeration" };
    }
    case "countMutuallyExclusiveAlternatives": {
      let answer = 0;
      for (const key of parameters.requiredVariables) for (let index = 0; index < value(key); index += 1) answer += 1;
      return { supported: true, answer, method: "Alternative-item enumeration" };
    }
    case "countDisjointCasePartition": {
      const answer = cartesianEnumeration([value("caseAFirst"), value("caseARest")]) + cartesianEnumeration([value("caseBFirst"), value("caseBRest")]);
      return { supported: true, answer, method: "Independent enumeration of disjoint cases" };
    }
    case "countUsingSimpleComplement": {
      const unrestricted = cartesianEnumeration([value("choiceA"), value("choiceB")]);
      const answer = unrestricted - value("invalidChoices");
      return { supported: true, answer, method: "Enumerated unrestricted outcomes minus stated invalid outcomes" };
    }
    case "recoverMissingStageChoiceCount": {
      const total = value("totalChoices");
      const known = value("knownChoices");
      let answer = -1;
      for (let candidate = 1; candidate <= total; candidate += 1) {
        if (cartesianEnumeration([known, candidate]) === total) {
          answer = candidate;
          break;
        }
      }
      return { supported: answer > 0, answer, method: "Bounded search for the exact missing factor" };
    }
  }
}
