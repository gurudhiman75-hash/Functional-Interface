import { getQuantV4OptionCount } from "../../../common/exam-profile";
import type {
  Qcp001Question,
  Qcp001RelationClass,
  Qcp001SourceState,
} from "./types";

function recomputeSourceState(state: Qcp001SourceState): number {
  if (state.kind === "PERCENTAGE") return state.percentageRate * state.baseValue / 100;
  if (state.kind === "RATIO") return state.valueA * state.ratioB / state.ratioA;
  const raw = state.dividend % state.divisor;
  return raw < 0 ? raw + state.divisor : raw;
}

function relationSymbol(left: number, right: number): ">" | "<" | "=" {
  return left > right ? ">" : left < right ? "<" : "=";
}

function independentlyClassify(left: readonly number[], right: readonly number[]): Qcp001RelationClass {
  const seen = new Set<">" | "<" | "=">();
  for (const leftValue of left) {
    for (const rightValue of right) seen.add(relationSymbol(leftValue, rightValue));
  }
  if (seen.size === 1 && seen.has(">")) return "QUANTITY_I_GREATER";
  if (seen.size === 1 && seen.has("<")) return "QUANTITY_I_LESS";
  if (seen.has(">") && seen.has("=") && !seen.has("<")) return "QUANTITY_I_GREATER_OR_EQUAL";
  if (seen.has("<") && seen.has("=") && !seen.has(">")) return "QUANTITY_I_LESS_OR_EQUAL";
  return "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED";
}

export interface Qcp001IndependentVerification {
  readonly valid: boolean;
  readonly recomputedQuantityI: readonly number[];
  readonly recomputedQuantityII: readonly number[];
  readonly recomputedRelation: Qcp001RelationClass;
  readonly checks: Readonly<Record<string, boolean>>;
}

export function independentlyVerifyQcp001Question(question: Qcp001Question): Qcp001IndependentVerification {
  const recomputedQuantityI = question.quantityI.states.map(recomputeSourceState);
  const recomputedQuantityII = question.quantityII.states.map(recomputeSourceState);
  const recomputedRelation = independentlyClassify(recomputedQuantityI, recomputedQuantityII);
  const checks = {
    sourceIParity: JSON.stringify(recomputedQuantityI) === JSON.stringify(question.quantityI.values),
    sourceIIParity: JSON.stringify(recomputedQuantityII) === JSON.stringify(question.quantityII.values),
    relationParity: recomputedRelation === question.answerClass,
    centralOptionCount: getQuantV4OptionCount(question.examProfile) === question.options.length && question.options.length === 5,
    uniqueOptions: new Set(question.options).size === 5,
    correctIndexRange: Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 5,
    correctMetadataParity: question.optionMetadata[question.correctIndex]?.relationClass === question.answerClass && question.optionMetadata[question.correctIndex]?.isCorrect === true,
    lifecycleLocked: !question.traceability.questionStudioDiscoverable && question.traceability.questionBankStatus === "NOT_STORED" && question.traceability.testEligibility === "INELIGIBLE" && !question.traceability.publiclyPublishable,
  };
  return {
    valid: Object.values(checks).every(Boolean),
    recomputedQuantityI,
    recomputedQuantityII,
    recomputedRelation,
    checks,
  };
}
