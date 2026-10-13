import { quadraticOperandPrompt } from "./quadratic-source";
import { independentlySolveAdditional } from "./additional-independent";
import { additionalOperandPrompt } from "./additional-display";
import type { Qcp001AdditionalState } from "./types";
import { wordOperandPrompt } from "./word-display";
import { getQuantV4OptionCount } from "../../../common/exam-profile";
import { QCP_RELATIONS, relationText, quantityLabel } from "./display";
import type {
  Qcp001Question,
  Qcp001RelationClass,
  Qcp001SourceState,
  Qcp001AnswerEvidenceMode,
} from "./types";

function recomputeSourceState(state: Qcp001SourceState): number {
  if (!state || typeof state !== "object") throw Error("Invalid source state.");
  if (
    [
      "COMPOUND_INTEREST",
      "WORK",
      "BOATS",
      "TRAINS",
      "AGES",
      "PROBABILITY",
      "MENSURATION",
      "REPLACEMENT",
      "PRICE_RECOVERY",
    ].includes(state.kind)
  )
    return independentlySolveAdditional(state as Qcp001AdditionalState);
  if (state.kind === "PROFIT_LOSS" || state.kind === "INTEREST") {
    if (
      ![state.amount, state.rate].every((v) => Number.isSafeInteger(v) && v > 0)
    )
      throw Error("Invalid monetary source domain");
    if (state.kind === "PROFIT_LOSS") {
      if (
        !["SELLING_PRICE", "COST_PRICE", "PROFIT_AMOUNT"].includes(
          state.task,
        ) ||
        !["PROFIT", "LOSS"].includes(state.direction) ||
        (state.direction === "LOSS" && state.rate >= 100)
      )
        throw Error("Invalid profit/loss source domain");
      const factor =
        100 + (state.direction === "PROFIT" ? state.rate : -state.rate);
      return state.task === "PROFIT_AMOUNT"
        ? (state.amount * state.rate) / 100
        : state.task === "SELLING_PRICE"
          ? (state.amount * factor) / 100
          : (state.amount * 100) / factor;
    }
    if (
      !["INTEREST", "AMOUNT", "PRINCIPAL"].includes(state.task) ||
      !Number.isSafeInteger(state.years) ||
      state.years <= 0
    )
      throw Error("Invalid interest source domain");
    const interest = (state.amount * state.rate * state.years) / 100;
    return state.task === "INTEREST"
      ? interest
      : state.task === "AMOUNT"
        ? state.amount + interest
        : (state.amount * 100) / (state.rate * state.years);
  }
  if (state.kind === "MIXTURE") {
    if (
      !["MEAN", "UNKNOWN_PRICE"].includes(state.task) ||
      !Array.isArray(state.quantities) ||
      !Array.isArray(state.prices) ||
      state.prices.length < 1 ||
      state.quantities.length !==
        state.prices.length + (state.task === "UNKNOWN_PRICE" ? 1 : 0) ||
      ![...state.quantities, ...state.prices, state.mean].every(
        (v) => Number.isSafeInteger(v) && v > 0,
      )
    )
      throw Error("Invalid blend source domain");
    const total = state.quantities.reduce((a, b) => a + b, 0),
      weighted = state.prices.reduce(
        (a, v, i) => a + v * state.quantities[i]!,
        0,
      );
    const value =
      state.task === "MEAN"
        ? weighted / total
        : (state.mean * total - weighted) /
          state.quantities[state.prices.length]!;
    if (value <= 0 || (state.task === "MEAN" && value !== state.mean))
      throw Error("Inconsistent blend source");
    return value;
  }
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
    if (!Number.isSafeInteger(d) || d < 0 || (d === 0 && state.rootIndex !== 0))
      throw Error("Unsupported rational-root domain.");
    if (!Number.isInteger(Math.sqrt(d))) {
      if (
        !state.positiveOnly ||
        state.a !== 1 ||
        state.b !== 0 ||
        state.rootIndex !== 1
      )
        throw Error("Unsupported irrational domain");
      for (const radicand of [2, 3, 5]) {
        const k = Math.sqrt(-state.c / radicand);
        if (Number.isSafeInteger(k) && k > 0) return k * Math.sqrt(radicand);
      }
      throw Error("Unsupported irrational radical");
    }
    if (state.positiveOnly)
      throw Error("Unexpected positive-only rational source");
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
    PROFIT_LOSS: ["PNL-001", "fundamentalMoney"],
    INTEREST: ["INT-001", "simpleInterest"],
    MIXTURE: ["MAL-001", "weightedBlend"],
    COMPOUND_INTEREST: ["INT-001", "annualCompound"],
    WORK: ["TMW-001", "combineWorkRates"],
    BOATS: ["TSD-002", "mediumJourney"],
    TRAINS: ["TSD-002", "trainCrossing"],
    AGES: ["ALG-001", "ageShift"],
    PROBABILITY: ["PRB-002", "urnProbability"],
    MENSURATION: ["MEN-001", "triangleMeasurement"],
    REPLACEMENT: ["MAL-001", "removeRefill"],
    PRICE_RECOVERY: ["PNL-001", "twoSellingConditions"],
  } as const;
  const sourceBinding = [question.quantityI, question.quantityII].every(
    (operand, index) => {
      const binding =
        operand.sourceFamily === "PROBABILITY" &&
        operand.states[0]?.kind === "PROBABILITY" &&
        operand.states[0].task === "SINGLE"
          ? ["PRB-001", "urnProbability"]
          : bindings[operand.sourceFamily];
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
  const quadraticCompleteness = [question.quantityI, question.quantityII].every(
    (o) => {
      if (o.sourceFamily !== "ALGEBRA") return true;
      const states = o.states.filter((s) => s.kind === "ALGEBRA");
      if (new Set(states.map((s) => Boolean(s.positiveOnly))).size !== 1)
        return false;
      const groups = new Map<string, Set<number>>();
      for (const state of states) {
        const key = `${state.a}:${state.b}:${state.c}`,
          indices = groups.get(key) ?? new Set<number>();
        indices.add(state.rootIndex);
        groups.set(key, indices);
      }
      return states.every((s) => {
        const indices = groups.get(`${s.a}:${s.b}:${s.c}`)!;
        return s.positiveOnly === true
          ? indices.size === 1 && indices.has(1)
          : s.b * s.b - 4 * s.a * s.c === 0
            ? indices.size === 1 && indices.has(0)
            : indices.size === 2 && indices.has(0) && indices.has(1);
      });
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
    quadraticCompleteness,
    quadraticPromptBinding:
      domainValid &&
      sourceBinding &&
      [question.quantityI, question.quantityII].every(
        (o) =>
          o.sourceFamily !== "ALGEBRA" ||
          o.prompt === quadraticOperandPrompt(o, question.language),
      ),
    additionalPromptBinding:
      domainValid &&
      [question.quantityI, question.quantityII].every(
        (o) =>
          ![
            "COMPOUND_INTEREST",
            "WORK",
            "BOATS",
            "TRAINS",
            "AGES",
            "PROBABILITY",
            "MENSURATION",
            "REPLACEMENT",
            "PRICE_RECOVERY",
          ].includes(o.sourceFamily) ||
          o.prompt === additionalOperandPrompt(o, question.language),
      ),
    stemBinding:
      question.stem ===
      `${quantityLabel(question.language, "I")}: ${question.quantityI.prompt}\n${quantityLabel(question.language, "II")}: ${question.quantityII.prompt}`,
    wordPromptBinding:
      domainValid &&
      [question.quantityI, question.quantityII].every(
        (o) =>
          !["PROFIT_LOSS", "INTEREST", "MIXTURE"].includes(o.sourceFamily) ||
          o.prompt === wordOperandPrompt(o, question.language),
      ),
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
