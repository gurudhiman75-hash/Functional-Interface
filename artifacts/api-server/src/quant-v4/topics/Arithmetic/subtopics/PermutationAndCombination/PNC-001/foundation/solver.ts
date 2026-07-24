import {
  descendingFactors,
  divideExact,
  factorialExact,
  factorialQuotientExact,
  productExact,
  subtractExact,
  sumExact,
} from "./math";
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

function independentFactorial(argument: number): number {
  if (argument <= 1) return 1;
  return argument * independentFactorial(argument - 1);
}

function independentRangeProduct(upper: number, lower: number): number {
  let result = 1;
  for (let value = upper; value > lower; value -= 1) result *= value;
  return result;
}

function readInteger(parameters: Pnc001Parameters, key: string): number {
  const found = parameters.values[key];
  if (typeof found !== "number" || !Number.isInteger(found)) {
    throw new Error(`Missing integer PNC-001 value: ${key}`);
  }
  return found;
}

function assertNever(value: never): never {
  throw new Error(`Unsupported PNC-001 solve mode: ${String(value)}`);
}

export function solvePnc001(parameters: Pnc001Parameters): Pnc001SolverResult {
  const ranges = getPnc001VariableRanges();
  const ceiling = ranges.answerCeiling;
  const value = (key: string): number => readInteger(parameters, key);

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
    case "evaluateFactorialValue": {
      const argument = parameters.scenarioFamily === "factorialPredecessor"
        ? value("n") - 1
        : value("factorialArgument");
      const answer = factorialExact(argument, ceiling);
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${argument}! = ${answer}`,
        mathJax: `${argument}! = ${answer}`,
        evidence: {
          operation: "FACTORIAL",
          factorialArgument: argument,
          factorialValue: answer,
          factorialFactors: descendingFactors(argument, 0),
          totalCount: answer,
        },
      };
    }
    case "evaluateFactorialUnitExpression": {
      const argument = value("factorialArgument");
      const factorialValue = factorialExact(argument, ceiling);
      const isAddition = parameters.scenarioFamily === "zeroPlusFactorial";
      const answer = isAddition ? sumExact([1, factorialValue], ceiling) : subtractExact(factorialValue, 1);
      const operator = isAddition ? "+" : "−";
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `1 ${operator} ${factorialValue} = ${answer}`,
        mathJax: `1 ${isAddition ? "+" : "-"} ${factorialValue} = ${answer}`,
        evidence: {
          operation: "FACTORIAL_UNIT_EXPRESSION",
          factorialArgument: argument,
          factorialValue,
          factorialFactors: descendingFactors(argument, 0),
          unitFactorial: isAddition ? "0!" : "1!",
          unitOperation: isAddition ? "ADD" : "SUBTRACT",
          totalCount: answer,
        },
      };
    }
    case "simplifyFactorialQuotient": {
      let upper: number;
      let lower: number;
      if (parameters.scenarioFamily === "numericFactorialQuotient") {
        upper = value("upper");
        lower = value("lower");
      } else {
        const n = value("n");
        upper = n + (parameters.scenarioFamily === "doubleSuccessorFactorialQuotient" ? 2 : 1);
        lower = n;
      }
      const factors = descendingFactors(upper, lower);
      const answer = factorialQuotientExact(upper, lower, ceiling);
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${upper}! ÷ ${lower}! = ${factors.join(" × ")} = ${answer}`,
        mathJax: `\\frac{${upper}!}{${lower}!} = ${factors.join(" \\times ")} = ${answer}`,
        evidence: {
          operation: "FACTORIAL_QUOTIENT",
          factorialUpper: upper,
          factorialLower: lower,
          factorialFactors: factors,
          totalCount: answer,
        },
      };
    }
    case "recoverFactorialArgument": {
      const target = value("target");
      let matchedArgument = -1;
      for (let candidate = 0; candidate <= ranges.generation.maximumFactorialArgument; candidate += 1) {
        if (factorialExact(candidate, ceiling) === target) {
          matchedArgument = candidate;
          break;
        }
      }
      if (matchedArgument < 0) throw new Error(`No factorial argument matches target ${target}`);
      const shift = parameters.scenarioFamily === "shiftedFactorialInverse" ? 1 : 0;
      const answer = matchedArgument - shift;
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${matchedArgument}! = ${target}; n = ${matchedArgument} − ${shift} = ${answer}`,
        mathJax: `${matchedArgument}! = ${target},\quad n = ${matchedArgument} - ${shift} = ${answer}`,
        evidence: {
          operation: "FACTORIAL_INVERSE",
          factorialTarget: target,
          matchedFactorialArgument: matchedArgument,
          displayedShift: shift,
          totalCount: answer,
        },
      };
    }
    case "recoverFactorialQuotientArgument": {
      const target = value("target");
      let answer = -1;
      for (let candidate = 2; candidate <= ranges.generation.maximumFactorialArgument; candidate += 1) {
        if (factorialQuotientExact(candidate, candidate - 2, ceiling) === target) {
          answer = candidate;
          break;
        }
      }
      if (answer < 0) throw new Error(`No two-step factorial quotient argument matches target ${target}`);
      return {
        exactAnswer: String(answer),
        answer: String(answer),
        numericAnswer: answer,
        equation: `${answer}! ÷ ${answer - 2}! = ${answer} × ${answer - 1} = ${target}`,
        mathJax: `\\frac{${answer}!}{${answer - 2}!} = ${answer} \\times ${answer - 1} = ${target}`,
        evidence: {
          operation: "FACTORIAL_QUOTIENT_INVERSE",
          factorialUpper: answer,
          factorialLower: answer - 2,
          factorialFactors: [answer, answer - 1],
          factorialTarget: target,
          matchedFactorialArgument: answer,
          totalCount: answer,
        },
      };
    }
    default:
      return assertNever(parameters.solveMode);
  }
}

export function verifyPnc001Independently(parameters: Pnc001Parameters): Pnc001IndependentVerification {
  const ranges = getPnc001VariableRanges();
  const value = (key: string): number => readInteger(parameters, key);
  switch (parameters.solveMode) {
    case "countSequentialIndependentChoices": {
      const answer = cartesianEnumeration(parameters.requiredVariables.map(value));
      return { supported: true, answer, method: "Cartesian-product enumeration" };
    }
    case "countMutuallyExclusiveAlternatives": {
      let answer = 0;
      for (const key of parameters.requiredVariables) {
        for (let index = 0; index < value(key); index += 1) answer += 1;
      }
      return { supported: true, answer, method: "Alternative-item enumeration" };
    }
    case "countDisjointCasePartition": {
      const answer = cartesianEnumeration([value("caseAFirst"), value("caseARest")])
        + cartesianEnumeration([value("caseBFirst"), value("caseBRest")]);
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
    case "evaluateFactorialValue": {
      const argument = parameters.scenarioFamily === "factorialPredecessor"
        ? value("n") - 1
        : value("factorialArgument");
      return { supported: true, answer: independentFactorial(argument), method: "Recursive factorial evaluation" };
    }
    case "evaluateFactorialUnitExpression": {
      const base = independentFactorial(value("factorialArgument"));
      const answer = parameters.scenarioFamily === "zeroPlusFactorial" ? 1 + base : base - 1;
      return { supported: true, answer, method: "Recursive factorial plus independent unit-factorial identity" };
    }
    case "simplifyFactorialQuotient": {
      let upper: number;
      let lower: number;
      if (parameters.scenarioFamily === "numericFactorialQuotient") {
        upper = value("upper");
        lower = value("lower");
      } else {
        const n = value("n");
        upper = n + (parameters.scenarioFamily === "doubleSuccessorFactorialQuotient" ? 2 : 1);
        lower = n;
      }
      return { supported: true, answer: independentRangeProduct(upper, lower), method: "Independent descending range product" };
    }
    case "recoverFactorialArgument": {
      const target = value("target");
      let matched = -1;
      for (let candidate = 0; candidate <= ranges.generation.maximumFactorialArgument; candidate += 1) {
        if (independentFactorial(candidate) === target) {
          matched = candidate;
          break;
        }
      }
      const shift = parameters.scenarioFamily === "shiftedFactorialInverse" ? 1 : 0;
      return { supported: matched >= shift, answer: matched - shift, method: "Bounded recursive-factorial search" };
    }
    case "recoverFactorialQuotientArgument": {
      const target = value("target");
      let answer = -1;
      for (let candidate = 2; candidate <= ranges.generation.maximumFactorialArgument; candidate += 1) {
        if (independentRangeProduct(candidate, candidate - 2) === target) {
          answer = candidate;
          break;
        }
      }
      return { supported: answer > 0, answer, method: "Bounded independent range-product search" };
    }
    default:
      return assertNever(parameters.solveMode);
  }
}