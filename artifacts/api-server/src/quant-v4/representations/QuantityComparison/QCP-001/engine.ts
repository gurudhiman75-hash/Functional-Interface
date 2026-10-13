import {
  ADDITIONAL_FAMILIES,
  ADDITIONAL_BINDINGS,
  isAdditional,
  additionalResult,
  buildAdditional,
} from "./additional-source";
import {
  additionalOperandPrompt,
  additionalWorking,
} from "./additional-display";
import {
  QCP_WORD_FAMILIES,
  isWordState,
  solveWordState,
  buildWordStates,
} from "./word-source";
import { wordOperandPrompt, wordWorking } from "./word-display";
import {
  solveQcpQuadratic,
  quadraticText,
  quadraticWorking,
} from "./quadratic-source";
import { localizeQcp001 } from "./localization";
import { independentlyVerifyQcp001Question } from "./independent-verifier";
import { getQuantV4OptionCount } from "../../../common/exam-profile";
import { solvePct001 } from "../../../topics/Arithmetic/subtopics/Percentage/PCT-001/solver";
import type { Pct001Parameters } from "../../../topics/Arithmetic/subtopics/Percentage/PCT-001/types";
import { solveRap001 } from "../../../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/solver";
import type { Rap001Parameters } from "../../../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/types";
import { positiveMod } from "../../../topics/Arithmetic/subtopics/NumberSystem/NUM-001/foundation/divisibility";
import type {
  Qcp001AnswerEvidenceMode,
  Qcp001Language,
  Qcp001ExamProfile,
  Qcp001Operand,
  Qcp001Option,
  Qcp001Question,
  Qcp001RelationClass,
  Qcp001SourceFamily,
  Qcp001SourceState,
} from "./types";

const RELATION_TEXT: Readonly<Record<Qcp001RelationClass, string>> =
  Object.freeze({
    QUANTITY_I_GREATER: "Quantity I > Quantity II",
    QUANTITY_I_LESS: "Quantity I < Quantity II",
    QUANTITY_I_GREATER_OR_EQUAL: "Quantity I ≥ Quantity II",
    QUANTITY_I_LESS_OR_EQUAL: "Quantity I ≤ Quantity II",
    EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED:
      "Quantity I = Quantity II or the relationship cannot be established",
  });

export const QCP_001_RELATION_CLASSES = Object.freeze(
  Object.keys(RELATION_TEXT) as Qcp001RelationClass[],
);
export const QCP_001_SOURCE_FAMILIES = Object.freeze([
  "PERCENTAGE",
  "RATIO",
  "NUMBER_SYSTEM",
  "ALGEBRA",
] as const);

const SOURCE_FAMILY_PAIRS = Object.freeze(
  QCP_001_SOURCE_FAMILIES.flatMap((left) =>
    QCP_001_SOURCE_FAMILIES.map((right) => [left, right] as const),
  ),
);

const RATIO_PAIRS = Object.freeze([
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
] as const);

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (const ch of text) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function trailingIndex(seed: string): number | null {
  const match = /(?:^|:)(\d+)$/.exec(seed);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

function seedIndex(seed: string): number {
  return trailingIndex(seed) ?? (hashText(seed) % 10_000) + 1;
}

function uniqueSorted(values: readonly number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : String(Math.round(value * 100) / 100);
}

function formatSet(values: readonly number[]): string {
  return `{${values.map(formatNumber).join(", ")}}`;
}

function pctParameters(rate: number, baseValue: number): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-001",
    questionId: "QCP-001-PCT-SOURCE",
    questionLanguageId: "QCP-001",
    explanationId: "QCP-001",
    language: "en",
    difficultyBand: "Medium",
    taskKind: "percentOf",
    answerType: "ABSOLUTE",
    requiredVariables: ["percentageRate", "baseValue"],
    variables: { percentageRate: rate, baseValue },
    sourceTrace: {
      questionLanguageSource: "QCP-001-COMPOSITION",
      explanationSource: "QCP-001-COMPOSITION",
      variableRangeSource: "QCP-001-COMPOSITION",
    },
  };
}

function rapParameters(
  ratioA: number,
  ratioB: number,
  valueA: number,
): Rap001Parameters {
  return {
    archetypeId: "RAP-001",
    canonicalProblemId: "RAP-CP-001",
    questionId: "QCP-001-RAP-SOURCE",
    questionLanguageId: "QCP-001",
    explanationId: "QCP-001",
    language: "en",
    difficultyBand: "Medium",
    taskKind: "scalingByComponent",
    answerType: "ABSOLUTE",
    requiredVariables: ["ratioA", "ratioB", "valueA"],
    variables: { ratioA, ratioB, valueA },
    sourceTrace: {
      questionLanguageSource: "QCP-001-COMPOSITION",
      explanationSource: "QCP-001-COMPOSITION",
      variableRangeSource: "QCP-001-COMPOSITION",
    },
  };
}

function solveSourceState(state: Qcp001SourceState): number {
  if (isAdditional(state)) return additionalResult(state).value;
  if (isWordState(state)) return solveWordState(state);
  if (state.kind === "ALGEBRA") return solveQcpQuadratic(state).value;
  if (state.kind === "PERCENTAGE") {
    const result = solvePct001(
      pctParameters(state.percentageRate, state.baseValue),
    );
    if (
      result.numericAnswer === null ||
      !Number.isFinite(result.numericAnswer)
    ) {
      throw new Error("QCP-001 received a non-numeric PCT-001 source answer.");
    }
    return result.numericAnswer;
  }
  if (state.kind === "RATIO") {
    const result = solveRap001(
      rapParameters(state.ratioA, state.ratioB, state.valueA),
    );
    const value = Number(result.answerValue);
    if (!Number.isFinite(value))
      throw new Error("QCP-001 received a non-numeric RAP-001 source answer.");
    return value;
  }
  return Number(positiveMod(BigInt(state.dividend), BigInt(state.divisor)));
}

function stateWorking(
  state: Qcp001SourceState,
  label: "Quantity I" | "Quantity II",
): string {
  if (isAdditional(state))
    return additionalWorking(state, additionalResult(state).text);
  if (isWordState(state))
    return wordWorking(state, solveWordState(state), "en");
  if (state.kind === "ALGEBRA")
    return quadraticWorking(state, label === "Quantity I" ? "x" : "y");
  if (state.kind === "PERCENTAGE") {
    return `${formatNumber(state.percentageRate)}% of ${formatNumber(state.baseValue)} = ${formatNumber((state.percentageRate * state.baseValue) / 100)}`;
  }
  if (state.kind === "RATIO") {
    const first = label === "Quantity I" ? "A" : "C",
      second = label === "Quantity I" ? "B" : "D";
    return `${first}:${second} = ${state.ratioA}:${state.ratioB}, ${first} = ${formatNumber(state.valueA)} ⇒ ${second} = ${formatNumber((state.valueA * state.ratioB) / state.ratioA)}`;
  }
  return `${state.dividend} ÷ ${state.divisor} leaves remainder ${Number(positiveMod(BigInt(state.dividend), BigInt(state.divisor)))}`;
}

function buildPercentageOperand(
  label: "Quantity I" | "Quantity II",
  targetValues: readonly number[],
  seed: string,
  profile: Qcp001ExamProfile,
): Qcp001Operand {
  const variable = label === "Quantity I" ? "M" : "N";
  const rates =
    profile === "BANKING_MAINS" ? [12.5, 20, 25, 40, 50] : [20, 25, 40, 50];
  const rate = rates[hashText(`${seed}:${label}:pct-rate`) % rates.length]!;
  const states = targetValues.map((target) => ({
    kind: "PERCENTAGE" as const,
    percentageRate: rate,
    baseValue: (target * 100) / rate,
  }));
  const values = states.map(solveSourceState);
  const bases = states.map((state) => state.baseValue);
  const prompt =
    states.length === 1
      ? `${formatNumber(rate)}% of ${formatNumber(bases[0]!)}`
      : `${formatNumber(rate)}% of ${variable}, where ${variable} is selected from ${formatSet(bases)}`;
  return {
    label,
    sourceFamily: "PERCENTAGE",
    sourcePackageId: "PCT-001",
    sourceSolveMode: "percentOf",
    prompt,
    states,
    values,
  };
}

function buildRatioOperand(
  label: "Quantity I" | "Quantity II",
  targetValues: readonly number[],
  seed: string,
): Qcp001Operand {
  const pool = targetValues.some((value) => value % 60 !== 0)
    ? ([
        [1, 2],
        [3, 2],
        [5, 4],
        [7, 4],
      ] as const)
    : RATIO_PAIRS;
  const [ratioA, ratioB] =
    pool[hashText(`${seed}:${label}:ratio-pair`) % pool.length]!;
  const states = targetValues.map((target) => ({
    kind: "RATIO" as const,
    ratioA,
    ratioB,
    valueA: (target * ratioA) / ratioB,
  }));
  const values = states.map(solveSourceState);
  const aValues = states.map((state) => state.valueA);
  const first = label === "Quantity I" ? "A" : "C";
  const second = label === "Quantity I" ? "B" : "D";
  const prompt =
    states.length === 1
      ? `${second}, if ${first}:${second} = ${ratioA}:${ratioB} and ${first} = ${formatNumber(aValues[0]!)}`
      : `${second}, if ${first}:${second} = ${ratioA}:${ratioB} and ${first} is selected from ${formatSet(aValues)}`;
  return {
    label,
    sourceFamily: "RATIO",
    sourcePackageId: "RAP-001",
    sourceSolveMode: "scalingByComponent",
    prompt,
    states,
    values,
  };
}

function buildNumberSystemOperand(
  label: "Quantity I" | "Quantity II",
  targetValues: readonly number[],
  seed: string,
): Qcp001Operand {
  const divisor =
    Math.max(...targetValues) +
    29 +
    (hashText(`${seed}:${label}:divisor`) % 4) * 2;
  const qBase = 2 + (hashText(`${seed}:${label}:quotient`) % 4);
  const states = targetValues.map((target, index) => ({
    kind: "NUMBER_SYSTEM" as const,
    dividend: (qBase + index) * divisor + target,
    divisor,
  }));
  const values = states.map(solveSourceState);
  const dividends = states.map((state) => state.dividend);
  const variable = label === "Quantity I" ? "P" : "Q";
  const prompt =
    states.length === 1
      ? `The remainder when ${dividends[0]} is divided by ${divisor}`
      : `The remainder when ${variable} is divided by ${divisor}, where ${variable} is selected from ${formatSet(dividends)}`;
  return {
    label,
    sourceFamily: "NUMBER_SYSTEM",
    sourcePackageId: "NUM-001",
    sourceSolveMode: "positiveMod",
    prompt,
    states,
    values,
  };
}

function buildOperand(
  family: Qcp001SourceFamily,
  label: "Quantity I" | "Quantity II",
  targetValues: readonly number[],
  seed: string,
  profile: Qcp001ExamProfile,
  additionalVariant = 0,
  irrational = false,
): Qcp001Operand {
  if (ADDITIONAL_FAMILIES.some((k) => k === family)) {
    const states = buildAdditional(
        family as (typeof ADDITIONAL_FAMILIES)[number],
        targetValues,
        additionalVariant,
      ),
      binding = ADDITIONAL_BINDINGS[family as keyof typeof ADDITIONAL_BINDINGS];
    const sourcePackageId =
      states[0]?.kind === "PROBABILITY" && states[0].task === "SINGLE"
        ? "PRB-001"
        : binding[0];
    const operand: Qcp001Operand = {
      label,
      sourceFamily: family,
      sourcePackageId,
      sourceSolveMode: binding[1],
      states,
      values: states.map(solveSourceState),
      prompt: "",
    };
    return { ...operand, prompt: additionalOperandPrompt(operand, "en") };
  }
  if (family === "ALGEBRA" && irrational) {
    const d = [2, 3, 5][additionalVariant % 3]!,
      variable = label === "Quantity I" ? "x" : "y";
    const states = targetValues.map((k) => ({
      kind: "ALGEBRA" as const,
      a: 1,
      b: 0,
      c: -d * k * k,
      rootIndex: 1 as const,
      positiveOnly: true as const,
    }));
    return {
      label,
      sourceFamily: family,
      sourcePackageId: "ALG-002",
      sourceSolveMode: "solveQuadraticEquation",
      states,
      values: states.map(solveSourceState),
      prompt: `${variable} > 0, where ${states.map((s) => quadraticText(s, variable)).join(" or ")}`,
    };
  }
  if (QCP_WORD_FAMILIES.some((k) => k === family)) {
    const states = buildWordStates(
      family as (typeof QCP_WORD_FAMILIES)[number],
      targetValues,
      hashText(`${seed}:${label}:word-variant`),
    );
    const bindings = {
      PROFIT_LOSS: ["PNL-001", "fundamentalMoney"],
      INTEREST: ["INT-001", "simpleInterest"],
      MIXTURE: ["MAL-001", "weightedBlend"],
    } as const;
    const binding = bindings[family as keyof typeof bindings];
    const operand: Qcp001Operand = {
      label,
      sourceFamily: family,
      sourcePackageId: binding[0],
      sourceSolveMode: binding[1],
      states,
      values: states.map(solveSourceState),
      prompt: "",
    };
    return { ...operand, prompt: wordOperandPrompt(operand, "en") };
  }
  if (family === "ALGEBRA") {
    const roots = uniqueSorted(targetValues);
    const states: Qcp001SourceState[] = [];
    const equations: string[] = [];
    const variable = label === "Quantity I" ? "x" : "y";
    for (let i = 0; i < roots.length; i += 2) {
      const first = roots[i]!;
      const second = roots[i + 1] ?? first;
      const equation = {
        kind: "ALGEBRA" as const,
        a: 1,
        b: -(first + second),
        c: first * second,
      };
      states.push({ ...equation, rootIndex: 0 });
      if (first !== second) states.push({ ...equation, rootIndex: 1 });
      equations.push(quadraticText({ ...equation, rootIndex: 0 }, variable));
    }
    return {
      label,
      sourceFamily: family,
      sourcePackageId: "ALG-002",
      sourceSolveMode: "solveQuadraticEquation",
      states,
      values: states.map(solveSourceState),
      prompt: `${variable}, where ${equations.join(" or ")}`,
    };
  }
  if (family === "PERCENTAGE")
    return buildPercentageOperand(label, targetValues, seed, profile);
  if (family === "RATIO") return buildRatioOperand(label, targetValues, seed);
  return buildNumberSystemOperand(label, targetValues, seed);
}

function pairwiseRelations(
  left: readonly number[],
  right: readonly number[],
): Set<">" | "<" | "="> {
  const relations = new Set<">" | "<" | "=">();
  for (const a of left) {
    for (const b of right) relations.add(a > b ? ">" : a < b ? "<" : "=");
  }
  return relations;
}

export function classifyQcp001Relation(
  left: readonly number[],
  right: readonly number[],
): Qcp001RelationClass {
  if (
    !left.length ||
    !right.length ||
    !left.every(Number.isFinite) ||
    !right.every(Number.isFinite)
  )
    throw new Error("QCP-001 requires at least one value for each quantity.");
  const relations = pairwiseRelations(left, right);
  if (relations.size === 1 && relations.has(">")) return "QUANTITY_I_GREATER";
  if (relations.size === 1 && relations.has("<")) return "QUANTITY_I_LESS";
  if (relations.has(">") && relations.has("=") && !relations.has("<"))
    return "QUANTITY_I_GREATER_OR_EQUAL";
  if (relations.has("<") && relations.has("=") && !relations.has(">"))
    return "QUANTITY_I_LESS_OR_EQUAL";
  return "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED";
}

function answerEvidenceMode(
  left: readonly number[],
  right: readonly number[],
  answerClass: Qcp001RelationClass,
): Qcp001AnswerEvidenceMode {
  if (answerClass === "QUANTITY_I_GREATER" || answerClass === "QUANTITY_I_LESS")
    return "STRICT_DETERMINATE";
  if (
    answerClass === "QUANTITY_I_GREATER_OR_EQUAL" ||
    answerClass === "QUANTITY_I_LESS_OR_EQUAL"
  )
    return "NON_STRICT_DETERMINATE";
  const relations = pairwiseRelations(left, right);
  return relations.size === 1 && relations.has("=")
    ? "EXACT_EQUALITY"
    : "RELATION_CANNOT_BE_ESTABLISHED";
}

function targetValueSets(
  seed: string,
  profile: Qcp001ExamProfile,
  relation: Qcp001RelationClass,
): readonly [number[], number[]] {
  const index = seedIndex(seed);
  const anchor = 120 + 60 * (hashText(`${seed}:anchor`) % 6);
  const equalVariant = Math.floor((index - 1) / 5) % 2 === 0;

  if (profile === "BANKING_PRELIMS") {
    if (relation === "QUANTITY_I_GREATER")
      return [[anchor + 180], [anchor + 60]];
    if (relation === "QUANTITY_I_LESS") return [[anchor + 60], [anchor + 180]];
    if (relation === "QUANTITY_I_GREATER_OR_EQUAL")
      return [
        [anchor + 120, anchor + 180],
        [anchor + 60, anchor + 120],
      ];
    if (relation === "QUANTITY_I_LESS_OR_EQUAL")
      return [
        [anchor + 60, anchor + 120],
        [anchor + 120, anchor + 180],
      ];
    return equalVariant
      ? [[anchor + 120], [anchor + 120]]
      : [
          [anchor + 60, anchor + 240],
          [anchor + 120, anchor + 180],
        ];
  }

  if (relation === "QUANTITY_I_GREATER")
    return [
      [anchor + 240, anchor + 300, anchor + 360],
      [anchor + 60, anchor + 120],
    ];
  if (relation === "QUANTITY_I_LESS")
    return [
      [anchor + 60, anchor + 120],
      [anchor + 240, anchor + 300, anchor + 360],
    ];
  if (relation === "QUANTITY_I_GREATER_OR_EQUAL")
    return [
      [anchor + 180, anchor + 240, anchor + 300],
      [anchor + 60, anchor + 120, anchor + 180],
    ];
  if (relation === "QUANTITY_I_LESS_OR_EQUAL")
    return [
      [anchor + 60, anchor + 120, anchor + 180],
      [anchor + 180, anchor + 240, anchor + 300],
    ];
  return equalVariant
    ? [[anchor + 120], [anchor + 120]]
    : [
        [anchor + 60, anchor + 180, anchor + 300],
        [anchor + 120, anchor + 240],
      ];
}

function buildOptions(
  seed: string,
  answerClass: Qcp001RelationClass,
): { options: string[]; metadata: Qcp001Option[]; correctIndex: number } {
  const index = seedIndex(seed);
  const correctIndex = hashText(`${seed}:correct-option-position`) % 5;
  const wrong = QCP_001_RELATION_CLASSES.filter(
    (value) => value !== answerClass,
  );
  const rotation = hashText(`${seed}:wrong-option-order`) % wrong.length;
  const rotated = [...wrong.slice(rotation), ...wrong.slice(0, rotation)];
  const classes: Qcp001RelationClass[] = new Array(5);
  classes[correctIndex] = answerClass;
  let wrongIndex = 0;
  for (let position = 0; position < classes.length; position += 1) {
    if (position === correctIndex) continue;
    classes[position] = rotated[wrongIndex++]!;
  }
  const metadata = classes.map((relationClass) => ({
    text: RELATION_TEXT[relationClass],
    relationClass,
    isCorrect: relationClass === answerClass,
  }));
  return { options: metadata.map((item) => item.text), metadata, correctIndex };
}

function relationStep(
  left: readonly number[],
  right: readonly number[],
  answerClass: Qcp001RelationClass,
  format = formatNumber,
): string {
  const minI = Math.min(...left);
  const maxI = Math.max(...left);
  const minII = Math.min(...right);
  const maxII = Math.max(...right);
  if (answerClass === "QUANTITY_I_GREATER") {
    return `Smallest Quantity I = ${format(minI)} and largest Quantity II = ${format(maxII)}. Since ${format(minI)} > ${format(maxII)}, Quantity I is always greater.`;
  }
  if (answerClass === "QUANTITY_I_LESS") {
    return `Largest Quantity I = ${format(maxI)} and smallest Quantity II = ${format(minII)}. Since ${format(maxI)} < ${format(minII)}, Quantity I is always smaller.`;
  }
  if (answerClass === "QUANTITY_I_GREATER_OR_EQUAL") {
    return `Smallest Quantity I = ${format(minI)} and largest Quantity II = ${format(maxII)}. They can be equal, and every other allowed comparison keeps Quantity I larger.`;
  }
  if (answerClass === "QUANTITY_I_LESS_OR_EQUAL") {
    return `Largest Quantity I = ${format(maxI)} and smallest Quantity II = ${format(minII)}. They can be equal, and every other allowed comparison keeps Quantity I smaller.`;
  }
  const relations = pairwiseRelations(left, right);
  if (relations.size === 1 && relations.has("="))
    return `Both quantities reduce to ${format(left[0]!)}, so they are equal.`;
  let greaterPair: [number, number] | null = null;
  let lessPair: [number, number] | null = null;
  for (const a of left)
    for (const b of right) {
      if (!greaterPair && a > b) greaterPair = [a, b];
      if (!lessPair && a < b) lessPair = [a, b];
    }
  return `The relation changes with the allowed values: ${format(greaterPair![0])} > ${format(greaterPair![1])}, but ${format(lessPair![0])} < ${format(lessPair![1])}. Hence one fixed relation cannot be established.`;
}

function wrongReason(
  optionClass: Qcp001RelationClass,
  actualClass: Qcp001RelationClass,
  left: readonly number[],
  right: readonly number[],
): string {
  const relations = pairwiseRelations(left, right);
  if (actualClass === "QUANTITY_I_GREATER") {
    if (optionClass === "QUANTITY_I_GREATER_OR_EQUAL")
      return "Every allowed comparison is strictly greater; use the strict '>' class when equality is impossible.";
    return `Rejected because every allowed pair gives Quantity I > Quantity II.`;
  }
  if (actualClass === "QUANTITY_I_LESS") {
    if (optionClass === "QUANTITY_I_LESS_OR_EQUAL")
      return "Every allowed comparison is strictly smaller; use the strict '<' class when equality is impossible.";
    return `Rejected because every allowed pair gives Quantity I < Quantity II.`;
  }
  if (actualClass === "QUANTITY_I_GREATER_OR_EQUAL") {
    return optionClass === "QUANTITY_I_GREATER"
      ? "Equality occurs for at least one allowed pair, so the strict '>' relation is too strong."
      : "All allowed pairs keep Quantity I at least as large as Quantity II, so this relation does not match the full possibility set.";
  }
  if (actualClass === "QUANTITY_I_LESS_OR_EQUAL") {
    return optionClass === "QUANTITY_I_LESS"
      ? "Equality occurs for at least one allowed pair, so the strict '<' relation is too strong."
      : "All allowed pairs keep Quantity I at most as large as Quantity II, so this relation does not match the full possibility set.";
  }
  if (relations.size === 1 && relations.has("="))
    return "Both quantities are exactly equal, so a strict or one-sided non-strict relation is not the exam's exclusive answer class.";
  return "At least one allowed pair reverses this proposed relation, so no one-sided comparison is valid for every case.";
}

function validateQuestion(question: Omit<Qcp001Question, "validation">) {
  const checks: Array<{ id: string; passed: boolean; message: string }> = [];
  const add = (id: string, passed: boolean, message: string) =>
    checks.push({ id, passed, message });
  add(
    "CENTRAL_OPTION_COUNT",
    getQuantV4OptionCount(question.examProfile) === 5 &&
      question.options.length === 5,
    "Banking Quantity Comparison must obey the central five-option profile contract.",
  );
  add(
    "UNIQUE_OPTIONS",
    new Set(question.options).size === 5,
    "All five relation options must be distinct.",
  );
  add(
    "ONE_CORRECT",
    question.optionMetadata.filter((option) => option.isCorrect).length === 1 &&
      question.optionMetadata[question.correctIndex]?.isCorrect === true,
    "Exactly one option must be marked correct and aligned with correctIndex.",
  );
  add(
    "SOURCE_VALUES",
    question.quantityI.values.length > 0 &&
      question.quantityII.values.length > 0 &&
      question.quantityI.values.every(Number.isFinite) &&
      question.quantityII.values.every(Number.isFinite),
    "Both quantities require finite source-owned values.",
  );
  add(
    "RELATION_PARITY",
    classifyQcp001Relation(
      question.quantityI.values,
      question.quantityII.values,
    ) === question.answerClass,
    "The answer class must match the complete Cartesian comparison of allowed values.",
  );
  add(
    "SOURCE_STATE_PARITY",
    question.quantityI.states.every(
      (state, index) =>
        solveSourceState(state) === question.quantityI.values[index],
    ) &&
      question.quantityII.states.every(
        (state, index) =>
          solveSourceState(state) === question.quantityII.values[index],
      ),
    "Persisted source states must reproduce the projected quantity values.",
  );
  add(
    "EXPLANATION_DEPTH",
    question.explanation.steps.length >= 3 &&
      question.distractorAnalysis.length === 4,
    "Explanation must include source working, comparison logic and all four wrong-option diagnoses.",
  );
  add(
    "LIFECYCLE_LOCK",
    !question.traceability.questionStudioDiscoverable &&
      question.traceability.questionBankStatus === "NOT_STORED" &&
      question.traceability.testEligibility === "INELIGIBLE" &&
      !question.traceability.publiclyPublishable,
    "QCP-001 Phase 0 must remain review-only.",
  );
  return { valid: checks.every((check) => check.passed), checks };
}

function generateBaseQcp001Question(
  input: {
    seed?: string;
    examProfile?: Qcp001ExamProfile;
    sourceMode?: "FOUNDATION" | "WORD_PROBLEMS" | "ADDITIONAL" | "IRRATIONAL";
  } = {},
): Qcp001Question {
  const seed = input.seed ?? "QCP-001:PHASE0:1";
  const examProfile = input.examProfile ?? "BANKING_PRELIMS";
  if (
    !["BANKING_PRELIMS", "BANKING_MAINS"].includes(examProfile) ||
    getQuantV4OptionCount(examProfile) !== 5
  )
    throw new Error(
      `QCP-001 requires a five-option banking profile, received ${examProfile}.`,
    );

  const index = seedIndex(seed);
  const answerClass =
    QCP_001_RELATION_CLASSES[(index - 1) % QCP_001_RELATION_CLASSES.length]!;
  const pairs =
    input.sourceMode === "ADDITIONAL"
      ? ADDITIONAL_FAMILIES.map((k) => [k, k] as const)
      : input.sourceMode === "IRRATIONAL"
        ? [["ALGEBRA", "ALGEBRA"] as const]
        : input.sourceMode === "WORD_PROBLEMS"
          ? QCP_WORD_FAMILIES.flatMap((a) =>
              QCP_WORD_FAMILIES.map((b) => [a, b] as const),
            )
          : SOURCE_FAMILY_PAIRS;
  const [familyI, familyII] =
    pairs[Math.floor((index - 1) / 5) % pairs.length]!;
  const targets = targetValueSets(seed, examProfile, answerClass);
  const small = familyI === "ALGEBRA" || familyII === "ALGEBRA";
  const [targetI, targetII] = targets.map((values) =>
    small ? values.map((value) => value / 60) : values,
  ) as [number[], number[]];
  const quantityI = buildOperand(
    familyI,
    "Quantity I",
    targetI,
    `${seed}:I`,
    examProfile,
    hashText(`${seed}:additional-variant`),
    input.sourceMode === "IRRATIONAL",
  );
  const quantityII = buildOperand(
    familyII,
    "Quantity II",
    targetII,
    `${seed}:II`,
    examProfile,
    hashText(`${seed}:additional-variant`),
    input.sourceMode === "IRRATIONAL",
  );

  const actualClass = classifyQcp001Relation(
    quantityI.values,
    quantityII.values,
  );
  if (actualClass !== answerClass) {
    throw new Error(
      `QCP-001 target relation drift: expected ${answerClass}, got ${actualClass}.`,
    );
  }

  const builtOptions = buildOptions(seed, answerClass);
  const evidenceMode = answerEvidenceMode(
    quantityI.values,
    quantityII.values,
    answerClass,
  );
  const exact = new Map<number, string>();
  for (const o of [quantityI, quantityII])
    o.states.forEach((state, i) =>
      exact.set(
        o.values[i]!,
        isAdditional(state)
          ? additionalResult(state).text
          : state.kind === "ALGEBRA"
            ? solveQcpQuadratic(state).selectedText
            : formatNumber(o.values[i]!),
      ),
    );
  const display = (n: number) => exact.get(n) ?? formatNumber(n);
  const exactSet = (values: readonly number[]) =>
    `{${uniqueSorted(values).map(display).join(", ")}}`;
  const sourceSteps = [
    `${quantityI.label}: ${quantityI.states.map((state) => stateWorking(state, quantityI.label)).join("; ")}. Possible values = ${exactSet(quantityI.values)}.`,
    `${quantityII.label}: ${quantityII.states.map((state) => stateWorking(state, quantityII.label)).join("; ")}. Possible values = ${exactSet(quantityII.values)}.`,
  ];
  const distractorAnalysis = builtOptions.metadata
    .filter((option) => !option.isCorrect)
    .map((option) => ({
      optionText: option.text,
      relationClass: option.relationClass,
      whyWrong: wrongReason(
        option.relationClass,
        answerClass,
        quantityI.values,
        quantityII.values,
      ),
    }));

  const withoutValidation: Omit<Qcp001Question, "validation"> = {
    packageId: "QCP-001",
    representation: "QUANTITY_COMPARISON",
    questionId: `QCP-001-${hashText(`${seed}:${examProfile}${input.sourceMode && input.sourceMode !== "FOUNDATION" ? `:${input.sourceMode}` : ""}`).toString(36)}`,
    seed,
    language: "en",
    examProfile,
    optionCount: 5,
    difficulty:
      examProfile === "BANKING_MAINS" && evidenceMode !== "EXACT_EQUALITY"
        ? "Hard"
        : "Medium",
    direction:
      "Choose the most specific relation between Quantity I and Quantity II.",
    stem: `Quantity I: ${quantityI.prompt}\nQuantity II: ${quantityII.prompt}`,
    quantityI,
    quantityII,
    options: builtOptions.options,
    optionMetadata: builtOptions.metadata,
    correctIndex: builtOptions.correctIndex,
    answerClass,
    answer: RELATION_TEXT[answerClass],
    answerEvidenceMode: evidenceMode,
    distractorAnalysis,
    explanation: {
      keyIdea:
        "Find every value allowed by each quantity, then compare the two possibility sets. A non-strict relation is used only when equality is genuinely possible.",
      steps: [
        ...sourceSteps,
        relationStep(quantityI.values, quantityII.values, answerClass, display),
      ],
      shortcut:
        answerClass === "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED" &&
        evidenceMode === "RELATION_CANNOT_BE_ESTABLISHED"
          ? "To disprove a fixed relation, one comparison in each opposite direction is enough."
          : "Compare the extreme possible values first; this often settles the relation without checking every pair.",
    },
    traceability: {
      representationOwner: "QCP-001",
      sourceTruthOwners:
        input.sourceMode === "ADDITIONAL"
          ? [
              "INT-001",
              "TMW-001",
              "TSD-002",
              "ALG-001",
              "PRB-001",
              "PRB-002",
              "MEN-001",
              "MAL-001",
              "PNL-001",
            ]
          : input.sourceMode === "IRRATIONAL"
            ? ["ALG-002"]
            : input.sourceMode === "WORD_PROBLEMS"
              ? ["PNL-001", "INT-001", "MAL-001"]
              : ["PCT-001", "RAP-001", "NUM-001", "ALG-002"],
      contractVersion:
        input.sourceMode === "ADDITIONAL" || input.sourceMode === "IRRATIONAL"
          ? "QCP-001-BANKING-RELATION-V4"
          : input.sourceMode === "WORD_PROBLEMS"
            ? "QCP-001-BANKING-RELATION-V3"
            : "QCP-001-BANKING-RELATION-V2",
      reviewStatus: "UNREVIEWED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  };
  const validation = validateQuestion(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks
      .filter((check) => !check.passed)
      .map((check) => check.id)
      .join(", ");
    throw new Error(`QCP-001 validation failed: ${failed}`);
  }
  return { ...withoutValidation, validation };
}

export function generateQcp001Question(
  input: {
    seed?: string;
    examProfile?: Qcp001ExamProfile;
    language?: Qcp001Language;
    sourceMode?: "FOUNDATION" | "WORD_PROBLEMS" | "ADDITIONAL" | "IRRATIONAL";
  } = {},
): Qcp001Question {
  if (
    input.sourceMode !== undefined &&
    !["FOUNDATION", "WORD_PROBLEMS", "ADDITIONAL", "IRRATIONAL"].includes(
      input.sourceMode,
    )
  )
    throw Error("Unsupported QCP source mode");
  const language = input.language ?? "en";
  if (!["en", "hi", "pa"].includes(language))
    throw new Error("QCP-001 unsupported language.");
  const question = localizeQcp001(generateBaseQcp001Question(input), language);
  if (!independentlyVerifyQcp001Question(question).valid)
    throw new Error("QCP-001 independent package verification failed.");
  return question;
}
