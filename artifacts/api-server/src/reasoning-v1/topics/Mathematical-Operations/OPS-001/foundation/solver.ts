import { canonicalExactKey, fromFiniteDecimal } from "./exact-rational";
import { evaluateParsedExpression } from "./evaluator";
import { parseSemanticTokens, parsedExpressionFingerprint } from "./parser";
import { renderDisplayTokens, tokenizeDisplayExpression } from "./tokenizer";
import {
  applyOperatorMapping,
  composeTransformations,
  swapDigitIdentities,
  swapDisplayOperators,
  swapWholeNumberTokens,
} from "./transformations";
import {
  OpsFoundationError,
  type CandidateRepair,
  type DisplayToken,
  type EvaluationResult,
  type OperatorMapping,
  type OperatorPairSwap,
  type SemanticOperator,
} from "./types";

export interface SolvedExpression {
  originalTokens: readonly DisplayToken[];
  transformedTokens: readonly DisplayToken[];
  semanticFingerprint: string;
  evaluation: EvaluationResult;
}

export function solveWithMapping(
  source: string,
  mapping: OperatorMapping,
  preTransform?: (tokens: readonly DisplayToken[]) => readonly DisplayToken[],
): SolvedExpression {
  const originalTokens = tokenizeDisplayExpression(source);
  const transformedTokens = preTransform ? preTransform(originalTokens) : originalTokens;
  const semanticTokens = applyOperatorMapping(transformedTokens, mapping);
  const parsed = parseSemanticTokens(semanticTokens);
  return {
    originalTokens,
    transformedTokens,
    semanticFingerprint: parsedExpressionFingerprint(parsed),
    evaluation: evaluateParsedExpression(parsed),
  };
}

export const STANDARD_IDENTITY_MAPPING: OperatorMapping = {
  entries: [],
  preserveUnmappedStandardOperators: true,
};

function requireTrueStatement(result: EvaluationResult): boolean {
  return result.parsed.kind === "RELATION" && result.relationValue === true;
}

export function findOperatorPairRepairs(
  equation: string,
  eligibleTokens: readonly string[] = ["+", "−", "×", "÷"],
): readonly CandidateRepair<OperatorPairSwap>[] {
  const original = tokenizeDisplayExpression(equation);
  const repairs: CandidateRepair<OperatorPairSwap>[] = [];
  for (let leftIndex = 0; leftIndex < eligibleTokens.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < eligibleTokens.length; rightIndex += 1) {
      const candidate = { left: eligibleTokens[leftIndex], right: eligibleTokens[rightIndex] };
      const swapped = swapDisplayOperators(original, [candidate]);
      try {
        const semantic = applyOperatorMapping(swapped.tokens, STANDARD_IDENTITY_MAPPING);
        const result = evaluateParsedExpression(parseSemanticTokens(semantic));
        if (requireTrueStatement(result)) repairs.push({ candidate, transformed: swapped.tokens, result });
      } catch (error) {
        if (!(error instanceof OpsFoundationError)) throw error;
      }
    }
  }
  return repairs;
}

export function findWholeNumberPairRepairs(equation: string): readonly CandidateRepair<readonly [string, string]>[] {
  const original = tokenizeDisplayExpression(equation);
  const numbers = [...new Set(original
    .filter((token): token is Extract<DisplayToken, { kind: "NUMBER" }> => token.kind === "NUMBER")
    .map((token) => canonicalExactKey(token.value)))];
  const sourceByKey = new Map<string, string>();
  for (const token of original) {
    if (token.kind === "NUMBER" && !sourceByKey.has(canonicalExactKey(token.value))) {
      sourceByKey.set(canonicalExactKey(token.value), token.source);
    }
  }

  const repairs: CandidateRepair<readonly [string, string]>[] = [];
  for (let leftIndex = 0; leftIndex < numbers.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < numbers.length; rightIndex += 1) {
      const pair = [sourceByKey.get(numbers[leftIndex])!, sourceByKey.get(numbers[rightIndex])!] as const;
      const swapped = swapWholeNumberTokens(original, pair[0], pair[1]);
      try {
        const result = evaluateParsedExpression(
          parseSemanticTokens(applyOperatorMapping(swapped.tokens, STANDARD_IDENTITY_MAPPING)),
        );
        if (requireTrueStatement(result)) repairs.push({ candidate: pair, transformed: swapped.tokens, result });
      } catch (error) {
        if (!(error instanceof OpsFoundationError)) throw error;
      }
    }
  }
  return repairs;
}

export function findDigitPairRepairs(equation: string): readonly CandidateRepair<readonly [number, number]>[] {
  const original = tokenizeDisplayExpression(equation);
  const digits = [...new Set(original
    .filter((token): token is Extract<DisplayToken, { kind: "NUMBER" }> => token.kind === "NUMBER")
    .flatMap((token) => [...token.source].filter((char) => /\d/.test(char)).map(Number)))]
    .sort((a, b) => a - b);
  const repairs: CandidateRepair<readonly [number, number]>[] = [];

  for (let leftIndex = 0; leftIndex < digits.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < digits.length; rightIndex += 1) {
      const pair = [digits[leftIndex], digits[rightIndex]] as const;
      try {
        const swapped = swapDigitIdentities(original, pair[0], pair[1]);
        const result = evaluateParsedExpression(
          parseSemanticTokens(applyOperatorMapping(swapped.tokens, STANDARD_IDENTITY_MAPPING)),
        );
        if (requireTrueStatement(result)) repairs.push({ candidate: pair, transformed: swapped.tokens, result });
      } catch (error) {
        if (!(error instanceof OpsFoundationError)) throw error;
      }
    }
  }
  return repairs;
}

export interface CompoundRepair {
  operatorPair: OperatorPairSwap;
  numberPair: readonly [string, string];
}

export function findOperatorAndWholeNumberRepairs(equation: string): readonly CandidateRepair<CompoundRepair>[] {
  const original = tokenizeDisplayExpression(equation);
  const operatorPairs: OperatorPairSwap[] = [];
  const operators = ["+", "−", "×", "÷"];
  for (let leftIndex = 0; leftIndex < operators.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < operators.length; rightIndex += 1) {
      operatorPairs.push({ left: operators[leftIndex], right: operators[rightIndex] });
    }
  }

  const numberSources = [...new Map(original
    .filter((token): token is Extract<DisplayToken, { kind: "NUMBER" }> => token.kind === "NUMBER")
    .map((token) => [canonicalExactKey(token.value), token.source])).values()];
  const repairs: CandidateRepair<CompoundRepair>[] = [];

  for (const operatorPair of operatorPairs) {
    for (let leftIndex = 0; leftIndex < numberSources.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < numberSources.length; rightIndex += 1) {
        const numberPair = [numberSources[leftIndex], numberSources[rightIndex]] as const;
        const compound = composeTransformations(original, [
          (tokens) => swapDisplayOperators(tokens, [operatorPair]),
          (tokens) => swapWholeNumberTokens(tokens, numberPair[0], numberPair[1]),
        ]);
        try {
          const result = evaluateParsedExpression(
            parseSemanticTokens(applyOperatorMapping(compound.tokens, STANDARD_IDENTITY_MAPPING)),
          );
          if (requireTrueStatement(result)) {
            repairs.push({ candidate: { operatorPair, numberPair }, transformed: compound.tokens, result });
          }
        } catch (error) {
          if (!(error instanceof OpsFoundationError)) throw error;
        }
      }
    }
  }
  return repairs;
}

function permutations<T>(values: readonly T[], length: number): readonly T[][] {
  if (length === 0) return [[]];
  const results: T[][] = [];
  for (let index = 0; index < values.length; index += 1) {
    const remaining = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const tail of permutations(remaining, length - 1)) {
      results.push([values[index], ...tail]);
    }
  }
  return results;
}

export interface MappingEvidence {
  expression: string;
  expectedTruth?: boolean;
  expectedValue?: string;
}

export function inferBijectiveMapping(
  displayTokens: readonly string[],
  semanticDomain: readonly SemanticOperator[],
  evidence: readonly MappingEvidence[],
): readonly OperatorMapping[] {
  if (displayTokens.length > semanticDomain.length) return [];
  const candidates: OperatorMapping[] = [];

  for (const assignment of permutations(semanticDomain, displayTokens.length)) {
    const mapping: OperatorMapping = {
      entries: displayTokens.map((displayToken, index) => ({
        displayToken,
        semanticOperator: assignment[index],
      })),
      preserveUnmappedStandardOperators: true,
    };
    let valid = true;

    for (const item of evidence) {
      try {
        const solved = solveWithMapping(item.expression, mapping);
        if (item.expectedTruth !== undefined) {
          valid = solved.evaluation.parsed.kind === "RELATION"
            && solved.evaluation.relationValue === item.expectedTruth;
        } else if (item.expectedValue !== undefined) {
          valid = solved.evaluation.parsed.kind === "ARITHMETIC"
            && solved.evaluation.arithmeticValue !== undefined
            && canonicalExactKey(solved.evaluation.arithmeticValue)
              === canonicalExactKey(fromFiniteDecimal(item.expectedValue));
        }
      } catch {
        valid = false;
      }
      if (!valid) break;
    }
    if (valid) candidates.push(mapping);
  }
  return candidates;
}

export function renderSolvedTransformation(solved: SolvedExpression): string {
  return `${renderDisplayTokens(solved.originalTokens)} -> ${renderDisplayTokens(solved.transformedTokens)}`;
}
