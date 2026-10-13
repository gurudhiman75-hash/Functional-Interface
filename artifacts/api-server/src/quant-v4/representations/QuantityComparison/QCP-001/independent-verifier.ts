import { getQuantV4OptionCount } from "../../../common/exam-profile";
import { QCP_RELATIONS, relationText } from "./display";
import type {
  Qcp001Question,
  Qcp001RelationClass,
  Qcp001SourceState,
  Qcp001AnswerEvidenceMode,
} from "./types";

function recomputeSourceState(state: Qcp001SourceState): number {
  if (!state || typeof state !== "object") throw Error("Invalid source state.");
  if (state.kind === "PERCENTAGE") {
    if (
      !Number.isFinite(state.percentageRate) ||
      state.percentageRate < 0 ||
      !Number.isFinite(state.baseValue)
    )
      throw Error("Invalid percentage domain.");
    return (state.percentageRate * state.baseValue) / 100;
  }
  if (state.kind === "RATIO") {
    if (
      !Number.isFinite(state.ratioA) ||
      state.ratioA <= 0 ||
      !Number.isFinite(state.ratioB) ||
      state.ratioB <= 0 ||
      !Number.isFinite(state.valueA)
    )
      throw Error("Invalid ratio domain.");
    return (state.valueA * state.ratioB) / state.ratioA;
  }
  if (state.kind === "ALGEBRA") {
    if (
      ![state.a, state.b, state.c].every(Number.isSafeInteger) ||
      state.a === 0 ||
      ![0, 1].includes(state.rootIndex)
    )
      throw Error("Invalid quadratic domain.");
    const d = state.b * state.b - 4 * state.a * state.c;
    if (
      !Number.isSafeInteger(d) ||
      d < 0 ||
      !Number.isInteger(Math.sqrt(d)) ||
      (d === 0 && state.rootIndex !== 0)
    )
      throw Error("Unsupported rational-root domain.");
    const roots = [
      (-state.b - Math.sqrt(d)) / (2 * state.a),
      (-state.b + Math.sqrt(d)) / (2 * state.a),
    ].sort((a, b) => a - b);
    return roots[state.rootIndex]!;
  }
  if (
    state.kind !== "NUMBER_SYSTEM" ||
    !Number.isSafeInteger(state.dividend) ||
    !Number.isSafeInteger(state.divisor) ||
    state.divisor <= 0
  )
    throw Error("Invalid remainder domain.");
  const raw = state.dividend % state.divisor;
  return raw < 0 ? raw + state.divisor : raw;
}
function independentlyClassify(
  left: readonly number[],
  right: readonly number[],
): [Qcp001RelationClass, Qcp001AnswerEvidenceMode] {
  // Extremes are an independent route to the generator's pair-enumeration truth.
  const minI = Math.min(...left),
    maxI = Math.max(...left),
    minII = Math.min(...right),
    maxII = Math.max(...right);
  if (minI > maxII) return ["QUANTITY_I_GREATER", "STRICT_DETERMINATE"];
  if (maxI < minII) return ["QUANTITY_I_LESS", "STRICT_DETERMINATE"];
  if (minI === maxI && minII === maxII && minI === minII)
    return ["EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED", "EXACT_EQUALITY"];
  if (minI === maxII)
    return ["QUANTITY_I_GREATER_OR_EQUAL", "NON_STRICT_DETERMINATE"];
  if (maxI === minII)
    return ["QUANTITY_I_LESS_OR_EQUAL", "NON_STRICT_DETERMINATE"];
  return [
    "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED",
    "RELATION_CANNOT_BE_ESTABLISHED",
  ];
}
export interface Qcp001IndependentVerification {
  readonly valid: boolean;
  readonly recomputedQuantityI: readonly number[];
  readonly recomputedQuantityII: readonly number[];
  readonly recomputedRelation: Qcp001RelationClass;
  readonly checks: Readonly<Record<string, boolean>>;
}
export function independentlyVerifyQcp001Question(
  question: Qcp001Question,
): Qcp001IndependentVerification {
  let left: number[] = [],
    right: number[] = [],
    domainValid = true;
  const shape =
    !!question &&
    Array.isArray(question.quantityI?.states) &&
    question.quantityI.states.length > 0 &&
    Array.isArray(question.quantityII?.states) &&
    question.quantityII.states.length > 0 &&
    Array.isArray(question.quantityI.values) &&
    Array.isArray(question.quantityII.values) &&
    Array.isArray(question.options) &&
    Array.isArray(question.optionMetadata);
  if (!shape)
    return {
      valid: false,
      recomputedQuantityI: [],
      recomputedQuantityII: [],
      recomputedRelation: "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED",
      checks: { shape: false },
    };
  try {
    left = question.quantityI.states.map(recomputeSourceState);
    right = question.quantityII.states.map(recomputeSourceState);
  } catch {
    domainValid = false;
  }
  const [recomputedRelation, evidence] = domainValid
    ? independentlyClassify(left, right)
    : ([
        "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED",
        "RELATION_CANNOT_BE_ESTABLISHED",
      ] as const);
  const bindings = {
    PERCENTAGE: ["PCT-001", "percentOf"],
    RATIO: ["RAP-001", "scalingByComponent"],
    NUMBER_SYSTEM: ["NUM-001", "positiveMod"],
    ALGEBRA: ["ALG-002", "solveQuadraticEquation"],
  } as const;
  const sourceBinding = [question.quantityI, question.quantityII].every(
    (operand, index) => {
      const binding = bindings[operand.sourceFamily];
      return (
        !!binding &&
        operand.label === (index === 0 ? "Quantity I" : "Quantity II") &&
        operand.sourcePackageId === binding[0] &&
        operand.sourceSolveMode === binding[1] &&
        operand.states.every((state) => state?.kind === operand.sourceFamily) &&
        operand.values.length === operand.states.length &&
        operand.values.every(Number.isFinite)
      );
    },
  );
  const optionBinding =
    question.optionMetadata.length === 5 &&
    new Set(question.optionMetadata.map((o) => o.relationClass)).size === 5 &&
    question.optionMetadata.every(
      (o, i) =>
        QCP_RELATIONS.includes(o.relationClass) &&
        o.text === question.options[i] &&
        o.text === relationText(o.relationClass, question.language) &&
        o.isCorrect === (o.relationClass === question.answerClass),
    );
  const checks = {
    sourceDomain:
      domainValid &&
      left.every(Number.isFinite) &&
      right.every(Number.isFinite),
    sourceBinding,
    sourceIParity:
      JSON.stringify(left) === JSON.stringify(question.quantityI.values),
    sourceIIParity:
      JSON.stringify(right) === JSON.stringify(question.quantityII.values),
    relationParity: recomputedRelation === question.answerClass,
    evidenceParity: evidence === question.answerEvidenceMode,
    profile: ["BANKING_PRELIMS", "BANKING_MAINS"].includes(
      question.examProfile,
    ),
    language: ["en", "hi", "pa"].includes(question.language),
    centralOptionCount:
      question.optionCount === 5 &&
      getQuantV4OptionCount(question.examProfile) === 5 &&
      question.options.length === 5,
    uniqueOptions: new Set(question.options).size === 5,
    optionBinding,
    correctIndexRange:
      Number.isInteger(question.correctIndex) &&
      question.correctIndex >= 0 &&
      question.correctIndex < 5,
    correctMetadataParity:
      question.optionMetadata[question.correctIndex]?.relationClass ===
        question.answerClass &&
      question.optionMetadata[question.correctIndex]?.isCorrect === true,
    answerBinding:
      question.answer === question.options[question.correctIndex] &&
      question.answer === relationText(question.answerClass, question.language),
    lifecycleLocked:
      !question.traceability.questionStudioDiscoverable &&
      question.traceability.questionBankStatus === "NOT_STORED" &&
      question.traceability.testEligibility === "INELIGIBLE" &&
      !question.traceability.publiclyPublishable,
  };
  return {
    valid: Object.values(checks).every(Boolean),
    recomputedQuantityI: left,
    recomputedQuantityII: right,
    recomputedRelation,
    checks,
  };
}
