import { inferBijectiveMapping, solveWithMapping } from "./foundation/solver";
import { mappingFingerprint } from "./foundation/transformations";
import type {
  ArithmeticOperator,
  OperatorMapping,
} from "./foundation/types";
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from "../../../shared/reasoning-novelty-governance-v1";

export const OPS_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  "OPS_001_CONTROLLED_NOVELTY_DISCOVERY_V1" as const;

const TOKENS = ["M", "N", "P", "Q"] as const;
const SEMANTICS = ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"] as const satisfies readonly ArithmeticOperator[];
const EVIDENCE_PAIRS = [
  [12, 3],
  [20, 4],
  [18, 6],
  [35, 5],
] as const;
const TARGET_PAIR = [24, 6] as const;

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length === 0) return [[]];
  const out: T[][] = [];
  for (let index = 0; index < values.length; index += 1) {
    const head = values[index]!;
    const rest = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const tail of permutations(rest)) out.push([head, ...tail]);
  }
  return out;
}

const SEMANTIC_PERMUTATIONS = permutations(SEMANTICS);

function applyIntegerOperator(
  left: number,
  operator: ArithmeticOperator,
  right: number,
): number {
  switch (operator) {
    case "ADD": return left + right;
    case "SUBTRACT": return left - right;
    case "MULTIPLY": return left * right;
    case "DIVIDE": {
      if (right === 0 || left % right !== 0) {
        throw new Error("OPS controlled-novel integer division must be exact.");
      }
      return left / right;
    }
  }
}

function hiddenMappingForSeed(seed: number): OperatorMapping {
  const semanticOrder = SEMANTIC_PERMUTATIONS[Math.abs(seed) % SEMANTIC_PERMUTATIONS.length]!;
  return {
    entries: TOKENS.map((displayToken, index) => ({
      displayToken,
      semanticOperator: semanticOrder[index]!,
    })),
    preserveUnmappedStandardOperators: true,
  };
}

function semanticForToken(mapping: OperatorMapping, token: string): ArithmeticOperator {
  const found = mapping.entries.find((entry) => entry.displayToken === token);
  if (!found) throw new Error("OPS controlled-novel mapping token is missing: " + token);
  if (!SEMANTICS.includes(found.semanticOperator as ArithmeticOperator)) {
    throw new Error("OPS controlled-novel lane supports arithmetic semantics only.");
  }
  return found.semanticOperator as ArithmeticOperator;
}

function integerResult(source: string, mapping: OperatorMapping): number {
  const solved = solveWithMapping(source, mapping);
  const value = solved.evaluation.arithmeticValue;
  if (!value || value.denominator !== 1n) {
    throw new Error("OPS controlled-novel expression must resolve to an integer.");
  }
  return Number(value.numerator);
}

function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

export interface OpsControlledNovelInferThenFillCandidateV1 {
  readonly candidateId: string;
  readonly provenance: "CONTROLLED_NOVEL";
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly parentQlIds: readonly ["OPS-QL-008", "OPS-QL-028"];
  readonly seed: number;
  readonly stem: string;
  readonly evidence: readonly string[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly semanticFingerprint: string;
  readonly solverAgreement: true;
  readonly permanentQlAllocated: false;
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
  readonly structuredState: {
    readonly hiddenMappingFingerprint: string;
    readonly inferredMappingFingerprint: string;
    readonly omittedEvidenceToken: string;
    readonly targetCorrectToken: string;
    readonly targetExpression: string;
    readonly targetResult: number;
    readonly survivingTargetTokens: readonly string[];
  };
}

export function generateOpsControlledNovelInferThenFillCandidateV1(
  seed: number,
): OpsControlledNovelInferThenFillCandidateV1 {
  if (!Number.isSafeInteger(seed)) {
    throw new Error("OPS controlled-novel seed must be a safe integer.");
  }

  const hiddenMapping = hiddenMappingForSeed(seed);
  const omittedEvidenceToken = TOKENS[Math.floor(Math.abs(seed) / 18) % TOKENS.length]!;
  const evidence = TOKENS
    .filter((token) => token !== omittedEvidenceToken)
    .map((token, index) => {
      const [left, right] = EVIDENCE_PAIRS[(index + Math.abs(seed)) % EVIDENCE_PAIRS.length]!;
      const operator = semanticForToken(hiddenMapping, token);
      const expectedValue = applyIntegerOperator(left, operator, right);
      return {
        token,
        left,
        right,
        expectedValue,
        statement: `${left} ${token} ${right} = ${expectedValue}`,
      };
    });

  const inferred = inferBijectiveMapping(
    TOKENS,
    SEMANTICS,
    evidence.map((item) => ({
      expression: `${item.left} ${item.token} ${item.right}`,
      expectedValue: String(item.expectedValue),
    })),
  );

  if (inferred.length !== 1) {
    throw new Error(
      "OPS controlled-novel evidence must infer exactly one mapping; received " + inferred.length + ".",
    );
  }
  const inferredMapping = inferred[0]!;
  const hiddenFingerprint = mappingFingerprint(hiddenMapping);
  const inferredFingerprint = mappingFingerprint(inferredMapping);
  if (hiddenFingerprint !== inferredFingerprint) {
    throw new Error("OPS controlled-novel inferred mapping does not match hidden mapping.");
  }

  const correctToken = TOKENS[Math.floor(Math.abs(seed) / 5) % TOKENS.length]!;
  const [targetLeft, targetRight] = TARGET_PAIR;
  const targetOperator = semanticForToken(hiddenMapping, correctToken);
  const targetResult = applyIntegerOperator(targetLeft, targetOperator, targetRight);
  const targetExpression = `${targetLeft} ? ${targetRight} = ${targetResult}`;

  const survivingTargetTokens = TOKENS.filter((token) =>
    integerResult(`${targetLeft} ${token} ${targetRight}`, inferredMapping) === targetResult
  );
  if (survivingTargetTokens.length !== 1 || survivingTargetTokens[0] !== correctToken) {
    throw new Error(
      "OPS controlled-novel target must have exactly one coded-symbol answer.",
    );
  }

  const options = rotate(TOKENS, Math.abs(seed) % TOKENS.length);
  const correctIndex = options.indexOf(correctToken);
  if (correctIndex < 0 || new Set(options).size !== 4) {
    throw new Error("OPS controlled-novel option construction failed.");
  }

  const evidenceText = evidence.map((item) => item.statement);
  const stem =
    `M, N, P and Q each represent one of +, −, × and ÷, with no operation repeated. Given ${evidenceText.join("; ")}, which symbol should replace ? in ${targetExpression}?`;

  const noveltyAxes = [
    "MULTI_STAGE_COMPOSITION",
    "INFORMATION_DISTRIBUTION",
    "QUERY_DIRECTION",
    "VALID_CROSS_FAMILY_COMPOSITION",
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: "OPS-NOVEL-INFER-THEN-FILL-" + seed,
    chapterId: "OPS-001",
    qlId: "OPS-QL-008+OPS-QL-028",
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: options.length === 4 && new Set(options).size === 4,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  return {
    candidateId: "OPS-NOVEL-INFER-THEN-FILL-" + seed,
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    parentQlIds: ["OPS-QL-008", "OPS-QL-028"],
    seed,
    stem,
    evidence: evidenceText,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    semanticFingerprint: [
      OPS_001_CONTROLLED_NOVELTY_DISCOVERY_V1,
      hiddenFingerprint,
      evidenceText.join("|"),
      targetExpression,
      correctToken,
    ].join("::"),
    solverAgreement: true,
    permanentQlAllocated: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
    structuredState: {
      hiddenMappingFingerprint: hiddenFingerprint,
      inferredMappingFingerprint: inferredFingerprint,
      omittedEvidenceToken,
      targetCorrectToken: correctToken,
      targetExpression,
      targetResult,
      survivingTargetTokens,
    },
  };
}
