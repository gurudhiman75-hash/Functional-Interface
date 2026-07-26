import { canonicalExactKey, fromFiniteDecimal } from "./exact-rational";
import {
  OpsFoundationError,
  type DisplayToken,
  type OperatorMapping,
  type OperatorPairSwap,
  type SemanticOperator,
  type SemanticToken,
  type TransformationTrace,
} from "./types";
import { renderDisplayTokens } from "./tokenizer";

const STANDARD_OPERATOR_MAP: Readonly<Record<string, SemanticOperator>> = {
  "+": "ADD",
  "−": "SUBTRACT",
  "×": "MULTIPLY",
  "÷": "DIVIDE",
  "=": "EQUAL",
  "<": "LESS_THAN",
  ">": "GREATER_THAN",
};

export function mappingFingerprint(mapping: OperatorMapping): string {
  const entries = [...mapping.entries]
    .map((entry) => `${entry.displayToken}->${entry.semanticOperator}`)
    .sort();
  return `MAP:${entries.join("|")}:preserve=${mapping.preserveUnmappedStandardOperators !== false}`;
}

export function applyOperatorMapping(
  tokens: readonly DisplayToken[],
  mapping: OperatorMapping,
): readonly SemanticToken[] {
  const lookup = new Map<string, SemanticOperator>();
  for (const entry of mapping.entries) {
    if (lookup.has(entry.displayToken)) {
      throw new OpsFoundationError("DUPLICATE_MAPPING_TOKEN", `Display token '${entry.displayToken}' is mapped more than once.`);
    }
    lookup.set(entry.displayToken, entry.semanticOperator);
  }

  const preserveStandard = mapping.preserveUnmappedStandardOperators !== false;
  return tokens.map((token): SemanticToken => {
    if (token.kind !== "SYMBOL") return token;
    const mapped = lookup.get(token.lexeme) ?? (preserveStandard ? STANDARD_OPERATOR_MAP[token.lexeme] : undefined);
    if (!mapped) {
      throw new OpsFoundationError("UNMAPPED_SYMBOL", `No semantic operator is defined for '${token.lexeme}'.`);
    }
    if (mapped === "EQUAL" || mapped === "LESS_THAN" || mapped === "GREATER_THAN") {
      return { kind: "RELATION", operator: mapped, sourceLexeme: token.lexeme };
    }
    return { kind: "ARITHMETIC", operator: mapped, sourceLexeme: token.lexeme };
  });
}

export function operatorSwapFingerprint(swaps: readonly OperatorPairSwap[]): string {
  const keys = swaps.map(({ left, right }) => [left, right].sort().join("<->")).sort();
  return `OP_SWAP:${keys.join("|")}`;
}

export function swapDisplayOperators(
  tokens: readonly DisplayToken[],
  swaps: readonly OperatorPairSwap[],
): { tokens: readonly DisplayToken[]; trace: TransformationTrace } {
  const lookup = new Map<string, string>();
  for (const { left, right } of swaps) {
    if (left === right || lookup.has(left) || lookup.has(right)) {
      throw new OpsFoundationError("DUPLICATE_SWAP_TOKEN", `Operator swaps must contain disjoint token pairs; received ${left}<->${right}.`);
    }
    lookup.set(left, right);
    lookup.set(right, left);
  }
  const transformed = tokens.map((token): DisplayToken =>
    token.kind === "SYMBOL" && lookup.has(token.lexeme)
      ? { kind: "SYMBOL", lexeme: lookup.get(token.lexeme)! }
      : token,
  );
  return {
    tokens: transformed,
    trace: {
      transformationId: "GLOBAL_OPERATOR_PAIR_SWAP",
      before: renderDisplayTokens(tokens),
      after: renderDisplayTokens(transformed),
      fingerprint: operatorSwapFingerprint(swaps),
    },
  };
}

export function swapWholeNumberTokens(
  tokens: readonly DisplayToken[],
  leftSource: string,
  rightSource: string,
): { tokens: readonly DisplayToken[]; trace: TransformationTrace } {
  const leftValue = fromFiniteDecimal(leftSource);
  const rightValue = fromFiniteDecimal(rightSource);
  const leftKey = canonicalExactKey(leftValue);
  const rightKey = canonicalExactKey(rightValue);
  if (leftKey === rightKey) {
    throw new OpsFoundationError("DUPLICATE_SWAP_TOKEN", "Whole-number swap values must differ.");
  }

  const transformed = tokens.map((token): DisplayToken => {
    if (token.kind !== "NUMBER") return token;
    const key = canonicalExactKey(token.value);
    if (key === leftKey) return { kind: "NUMBER", source: rightSource, value: rightValue };
    if (key === rightKey) return { kind: "NUMBER", source: leftSource, value: leftValue };
    return token;
  });
  return {
    tokens: transformed,
    trace: {
      transformationId: "WHOLE_NUMBER_TOKEN_SWAP",
      before: renderDisplayTokens(tokens),
      after: renderDisplayTokens(transformed),
      fingerprint: `NUMBER_SWAP:${[leftKey, rightKey].sort().join("<->")}`,
    },
  };
}

function swapDigitsInLiteral(source: string, leftDigit: number, rightDigit: number): string {
  const left = String(leftDigit);
  const right = String(rightDigit);
  let result = "";
  for (const char of source) {
    result += char === left ? right : char === right ? left : char;
  }
  const integerPart = result.split(".")[0];
  if (integerPart.length > 1 && integerPart.startsWith("0")) {
    throw new OpsFoundationError("LEADING_ZERO_AFTER_DIGIT_SWAP", `Digit swap creates a leading-zero literal: ${source} -> ${result}`);
  }
  return result;
}

export function swapDigitIdentities(
  tokens: readonly DisplayToken[],
  leftDigit: number,
  rightDigit: number,
): { tokens: readonly DisplayToken[]; trace: TransformationTrace } {
  if (!Number.isInteger(leftDigit) || !Number.isInteger(rightDigit) || leftDigit < 0 || leftDigit > 9 || rightDigit < 0 || rightDigit > 9 || leftDigit === rightDigit) {
    throw new OpsFoundationError("INVALID_DIGIT_SWAP", "Digit swap requires two distinct digits from 0 to 9.");
  }
  const transformed = tokens.map((token): DisplayToken => {
    if (token.kind !== "NUMBER") return token;
    const source = swapDigitsInLiteral(token.source, leftDigit, rightDigit);
    return { kind: "NUMBER", source, value: fromFiniteDecimal(source) };
  });
  return {
    tokens: transformed,
    trace: {
      transformationId: "DIGIT_IDENTITY_SWAP",
      before: renderDisplayTokens(tokens),
      after: renderDisplayTokens(transformed),
      fingerprint: `DIGIT_SWAP:${[leftDigit, rightDigit].sort((a, b) => a - b).join("<->")}`,
    },
  };
}

export function composeTransformations(
  original: readonly DisplayToken[],
  transforms: readonly ((tokens: readonly DisplayToken[]) => { tokens: readonly DisplayToken[]; trace: TransformationTrace })[],
): { tokens: readonly DisplayToken[]; traces: readonly TransformationTrace[]; fingerprint: string } {
  let current = original;
  const traces: TransformationTrace[] = [];
  for (const transform of transforms) {
    const result = transform(current);
    current = result.tokens;
    traces.push(result.trace);
  }
  return {
    tokens: current,
    traces,
    fingerprint: `COMPOSE:${traces.map((trace) => trace.fingerprint).join("+")}`,
  };
}
