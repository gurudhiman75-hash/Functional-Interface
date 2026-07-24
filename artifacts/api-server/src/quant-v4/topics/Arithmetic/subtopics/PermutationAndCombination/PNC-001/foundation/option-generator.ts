import {
  createSeededRandom,
  factorialExact,
  productExact,
  shuffleSeeded,
  sumExact,
} from "./math";
import type { Pnc001Parameters, Pnc001SolverResult } from "./types";

function uniquePositiveIntegers(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

function assertNever(value: never): never {
  throw new Error(`Unsupported PNC-001 solve mode for options: ${String(value)}`);
}

export function buildPnc001Options(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const evidence = solver.evidence;
  let candidates: number[] = [];

  switch (parameters.solveMode) {
    case "countSequentialIndependentChoices": {
      const stages = evidence.stageCounts ?? [];
      candidates = [
        sumExact(stages),
        stages.length > 1 ? productExact(stages.slice(0, -1)) : correct + 1,
        productExact(stages.map((value, index) => index === 0 ? value + 1 : value)),
        correct + (stages[0] ?? 2),
      ];
      break;
    }
    case "countMutuallyExclusiveAlternatives": {
      const stages = evidence.stageCounts ?? [];
      candidates = [
        productExact(stages),
        Math.max(...stages),
        correct + Math.min(...stages),
        correct - Math.min(...stages),
      ];
      break;
    }
    case "countDisjointCasePartition": {
      const cases = evidence.caseCounts ?? [];
      const factors = cases.flatMap((item) => item.factors);
      candidates = [
        productExact(factors),
        sumExact(factors),
        cases[0]?.count ?? correct + 1,
        cases[1]?.count ?? correct + 2,
      ];
      break;
    }
    case "countUsingSimpleComplement": {
      const total = evidence.totalCount ?? correct;
      const invalid = evidence.invalidCount ?? 1;
      candidates = [total, total + invalid, invalid, Math.max(1, total - 2 * invalid)];
      break;
    }
    case "recoverMissingStageChoiceCount": {
      const total = evidence.totalChoices ?? parameters.values.totalChoices!;
      const known = evidence.knownChoices ?? parameters.values.knownChoices!;
      candidates = [total - known, known, Math.max(1, Math.floor(total / (known + 1))), correct + known];
      break;
    }
    case "evaluateFactorialValue": {
      const argument = evidence.factorialArgument ?? 2;
      candidates = [
        factorialExact(Math.max(0, argument - 1)),
        factorialExact(argument + 1),
        argument * argument,
        correct + argument,
      ];
      break;
    }
    case "evaluateFactorialUnitExpression": {
      const factorialValue = evidence.factorialValue ?? correct;
      candidates = [factorialValue, factorialValue + 2, Math.max(1, factorialValue - 2), 1];
      break;
    }
    case "simplifyFactorialQuotient": {
      const factors = evidence.factorialFactors ?? [];
      const upper = evidence.factorialUpper ?? correct;
      const lower = evidence.factorialLower ?? 0;
      candidates = [
        sumExact(factors),
        factors.length > 1 ? productExact(factors.slice(0, -1)) : upper - lower,
        factorialExact(Math.max(0, upper - lower)),
        upper * Math.max(1, lower),
      ];
      break;
    }
    case "recoverFactorialArgument": {
      const matched = evidence.matchedFactorialArgument ?? correct;
      const target = evidence.factorialTarget ?? correct;
      candidates = [matched, Math.max(1, correct - 1), correct + 1, target];
      break;
    }
    case "recoverFactorialQuotientArgument": {
      const target = evidence.factorialTarget ?? correct;
      candidates = [Math.max(1, correct - 1), correct + 1, Math.max(1, Math.round(Math.sqrt(target))), target];
      break;
    }
    default:
      return assertNever(parameters.solveMode);
  }

  const distractors = uniquePositiveIntegers(candidates, correct);
  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct + offset, correct - offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }

  const shuffled = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:options`),
  );
  return {
    options: shuffled.map(String),
    correctIndex: shuffled.indexOf(correct),
  };
}