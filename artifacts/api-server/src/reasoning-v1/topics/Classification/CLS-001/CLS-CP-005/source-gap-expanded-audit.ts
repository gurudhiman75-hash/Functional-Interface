import { independentlyInferClsCp005Signatures } from "./audit";
import { CLS_CP005_RULE_IDS } from "./relation-registry";
import {
  CLS_CP005_SOURCE_GAP_RULE_IDS,
  independentlyInferClsCp005SourceGapSignatures,
  type ClsCp005SourceGapRuleId,
  type ClsCp005SourceGapTuple,
} from "./source-gap-registry";
import {
  CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
  independentlyEvaluateClsCp005Wave2DigitProductRule,
  type ClsCp005Wave2DigitProductRuleId,
} from "./wave2-digit-product-rule";
import type {
  ClsCp005RuleId,
  ClsCp005Tuple,
} from "./types";

export type ClsCp005ExpandedRuleId =
  | ClsCp005RuleId
  | ClsCp005SourceGapRuleId
  | ClsCp005Wave2DigitProductRuleId;
export type ClsCp005ExpandedTuple = ClsCp005SourceGapTuple;

export const CLS_CP005_EXPANDED_RULE_COUNT =
  CLS_CP005_RULE_IDS.length + CLS_CP005_SOURCE_GAP_RULE_IDS.length + 1;

export type ClsCp005ExpandedRuleSupport = {
  readonly ruleId: ClsCp005ExpandedRuleId;
  readonly commonValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly answerIndex: number;
  readonly source: "WAVE_1" | "SOURCE_GAP_WAVE_2";
};

export type ClsCp005ExpandedAudit = {
  readonly result: "EXPANDED_UNIQUE" | "EXPANDED_AMBIGUOUS" | "INTENDED_NOT_SUPPORTED";
  readonly intendedRuleSupported: boolean;
  readonly answerIndex: number | null;
  readonly expandedAnswerIndexes: readonly number[];
  readonly supports: readonly ClsCp005ExpandedRuleSupport[];
  readonly newRuleSupports: readonly ClsCp005ExpandedRuleSupport[];
  readonly completeRuleCount: number;
  readonly reason: string;
};

type Signature = {
  readonly ruleId: ClsCp005ExpandedRuleId;
  readonly value: string;
  readonly source: "WAVE_1" | "SOURCE_GAP_WAVE_2";
};

function signatureKey(signature: Pick<Signature, "ruleId" | "value">): string {
  return `${signature.ruleId}::${signature.value}`;
}

export function independentlyInferClsCp005ExpandedSignatures(
  tuple: ClsCp005ExpandedTuple,
): readonly Signature[] {
  const wave1: Signature[] = tuple.length === 2 || tuple.length === 3
    ? independentlyInferClsCp005Signatures(tuple as ClsCp005Tuple).map((signature) => ({
        ...signature,
        source: "WAVE_1" as const,
      }))
    : [];
  const wave2: Signature[] = independentlyInferClsCp005SourceGapSignatures(tuple).map((signature) => ({
    ...signature,
    source: "SOURCE_GAP_WAVE_2" as const,
  }));
  const digitProduct = independentlyEvaluateClsCp005Wave2DigitProductRule(tuple);
  const digitProductSignatures: Signature[] = digitProduct === null
    ? []
    : [{
        ruleId: CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
        value: digitProduct,
        source: "SOURCE_GAP_WAVE_2" as const,
      }];
  return [...wave1, ...wave2, ...digitProductSignatures];
}

function sourceForRule(ruleId: ClsCp005ExpandedRuleId): "WAVE_1" | "SOURCE_GAP_WAVE_2" {
  return (CLS_CP005_SOURCE_GAP_RULE_IDS as readonly string[]).includes(ruleId)
    || ruleId === CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID
    ? "SOURCE_GAP_WAVE_2"
    : "WAVE_1";
}

function supportFromKey(
  key: string,
  matchingOptionIndexes: readonly number[],
  answerIndex: number,
): ClsCp005ExpandedRuleSupport {
  const separator = key.indexOf("::");
  const ruleId = key.slice(0, separator) as ClsCp005ExpandedRuleId;
  return {
    ruleId,
    commonValue: key.slice(separator + 2),
    matchingOptionIndexes,
    answerIndex,
    source: sourceForRule(ruleId),
  };
}

function finalise(
  supports: readonly ClsCp005ExpandedRuleSupport[],
  intendedRuleId: ClsCp005ExpandedRuleId,
  intendedRuleValue: string,
): ClsCp005ExpandedAudit {
  const intendedRuleSupported = supports.some(
    (support) => support.ruleId === intendedRuleId && support.commonValue === intendedRuleValue,
  );
  const expandedAnswerIndexes = [...new Set(supports.map((support) => support.answerIndex))].sort((left, right) => left - right);
  const newRuleSupports = supports.filter((support) => support.source === "SOURCE_GAP_WAVE_2");

  if (!intendedRuleSupported) {
    return {
      result: "INTENDED_NOT_SUPPORTED",
      intendedRuleSupported: false,
      answerIndex: null,
      expandedAnswerIndexes,
      supports,
      newRuleSupports,
      completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
      reason: "The expanded independent verifier did not recover the intended rule.",
    };
  }

  if (expandedAnswerIndexes.length !== 1) {
    return {
      result: "EXPANDED_AMBIGUOUS",
      intendedRuleSupported: true,
      answerIndex: null,
      expandedAnswerIndexes,
      supports,
      newRuleSupports,
      completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
      reason: `The broader source-backed registry supports different answers: ${expandedAnswerIndexes.join(", ")}.`,
    };
  }

  return {
    result: "EXPANDED_UNIQUE",
    intendedRuleSupported: true,
    answerIndex: expandedAnswerIndexes[0]!,
    expandedAnswerIndexes,
    supports,
    newRuleSupports,
    completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
    reason: "Every Wave 1 and source-gap supporting rule points to the same answer.",
  };
}

export function auditClsCp005OddTuplesAgainstExpandedRegistry(
  tuples: readonly ClsCp005ExpandedTuple[],
  intendedRuleId: ClsCp005ExpandedRuleId,
  intendedRuleValue: string,
): ClsCp005ExpandedAudit {
  const signatures = new Map<string, number[]>();
  for (const [optionIndex, tuple] of tuples.entries()) {
    for (const signature of independentlyInferClsCp005ExpandedSignatures(tuple)) {
      const key = signatureKey(signature);
      const indexes = signatures.get(key) ?? [];
      indexes.push(optionIndex);
      signatures.set(key, indexes);
    }
  }

  const supports: ClsCp005ExpandedRuleSupport[] = [];
  for (const [key, matchingOptionIndexes] of signatures) {
    if (matchingOptionIndexes.length !== tuples.length - 1) continue;
    const answerIndex = tuples.findIndex((_, index) => !matchingOptionIndexes.includes(index));
    if (answerIndex >= 0) supports.push(supportFromKey(key, matchingOptionIndexes, answerIndex));
  }
  return finalise(supports, intendedRuleId, intendedRuleValue);
}

export function auditClsCp005EquivalentSetAgainstExpandedRegistry(
  referenceTuple: ClsCp005ExpandedTuple,
  tuples: readonly ClsCp005ExpandedTuple[],
  intendedRuleId: ClsCp005ExpandedRuleId,
  intendedRuleValue: string,
): ClsCp005ExpandedAudit {
  const referenceSignatures = independentlyInferClsCp005ExpandedSignatures(referenceTuple);
  const optionSignatureSets = tuples.map((tuple) => new Set(independentlyInferClsCp005ExpandedSignatures(tuple).map(signatureKey)));
  const supports: ClsCp005ExpandedRuleSupport[] = [];

  for (const signature of referenceSignatures) {
    const key = signatureKey(signature);
    const matchingOptionIndexes = optionSignatureSets
      .map((set, index) => set.has(key) ? index : -1)
      .filter((index) => index >= 0);
    if (matchingOptionIndexes.length === 1) {
      supports.push(supportFromKey(key, matchingOptionIndexes, matchingOptionIndexes[0]!));
    }
  }
  return finalise(supports, intendedRuleId, intendedRuleValue);
}

export function auditClsCp005QuestionAgainstExpandedRegistry(question: {
  readonly task: string;
  readonly referenceTuple: ClsCp005ExpandedTuple | null;
  readonly tuples: readonly ClsCp005ExpandedTuple[];
  readonly intendedRuleId: ClsCp005ExpandedRuleId;
  readonly intendedRuleValue: string;
}): ClsCp005ExpandedAudit {
  return question.task === "SELECT_EQUIVALENT_NUMBER_SET"
    ? auditClsCp005EquivalentSetAgainstExpandedRegistry(
        question.referenceTuple ?? (() => { throw new Error("Equivalent-set question has no reference tuple"); })(),
        question.tuples,
        question.intendedRuleId,
        question.intendedRuleValue,
      )
    : auditClsCp005OddTuplesAgainstExpandedRegistry(
        question.tuples,
        question.intendedRuleId,
        question.intendedRuleValue,
      );
}
