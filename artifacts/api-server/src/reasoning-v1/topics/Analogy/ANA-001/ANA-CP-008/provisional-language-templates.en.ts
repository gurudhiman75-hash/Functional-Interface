import { letterPosition, shiftLetter } from "../foundation/alphabet";
import {
  clusterNumberToken,
  letterGroupToken,
  letterNumberToken,
  letterToken,
  mixedTokenKey,
  numberClusterToken,
  numberLetterToken,
  renderMixedToken,
  sameMixedToken,
  type MixedResult,
  type MixedToken,
} from "./foundation/mixed-token";
import {
  independentlyApplyProvisionalMixedRule,
  matchingProvisionalMixedRules,
  type ProvisionalMixedEvidence,
} from "./provisional-independent-solver";
import {
  provisionalMixedContextKey,
  provisionalMixedRuleById,
  type ProvisionalMixedContext,
  type ProvisionalMixedRuleId,
} from "./provisional-rule-definitions";

export type ProvisionalEnglishTask = "DIRECT_COMPLETION" | "ODD_PAIR_SELECTION";

export type ProvisionalEnglishPrototypeId =
  | "PROTO_POSITION_SUM_TO_NUMBER"
  | "PROTO_POSITION_PRODUCT_TO_NUMBER"
  | "PROTO_POSITION_SUM_TO_LETTER"
  | "PROTO_SINGLE_LETTER_POSITION_SQUARE"
  | "PROTO_INDEPENDENT_LETTER_NUMBER_DELTA"
  | "PROTO_SHARED_CLUSTER_NUMBER_DELTA"
  | "PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA"
  | "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST"
  | "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST"
  | "PROTO_DIRECT_CUBE_CLUSTER_FIRST"
  | "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST"
  | "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST"
  | "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST"
  | "PROTO_DIGIT_SUM_SQUARE_SUCCESSOR";

export interface ProvisionalEnglishPrototypeDefinition {
  prototypeId: ProvisionalEnglishPrototypeId;
  title: string;
  solveContract: string;
  ruleId: ProvisionalMixedRuleId;
  context: ProvisionalMixedContext;
  sampleInputs: readonly [MixedToken, MixedToken, MixedToken, MixedToken];
  taskEligibility: readonly ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"];
  tokenOrderDecision: "NOT_APPLICABLE" | "CLUSTER_FIRST" | "NUMBER_FIRST";
  sourceNote: string;
}

export interface ProvisionalExplanation {
  ruleStatement: string;
  sourceDemonstration: string;
  targetApplication: string;
  conclusion: string;
  closestTrapRejection: string;
}

export interface RenderedDirectEnglishPrototype {
  prototypeId: ProvisionalEnglishPrototypeId;
  task: "DIRECT_COMPLETION";
  stem: string;
  source: ProvisionalMixedEvidence;
  target: ProvisionalMixedEvidence;
  correctAnswer: MixedResult;
  answerKind: MixedResult["kind"];
  explanation: ProvisionalExplanation;
  metadata: {
    permanentQlId: null;
    publiclyPublishable: false;
    maturity: "LANGUAGE_PROTOTYPE";
  };
}

export interface RenderedOddPairEnglishPrototype {
  prototypeId: ProvisionalEnglishPrototypeId;
  task: "ODD_PAIR_SELECTION";
  stem: string;
  options: readonly ProvisionalMixedEvidence[];
  correctIndex: number;
  explanation: {
    commonRule: string;
    validPairDemonstrations: readonly [string, string, string];
    oddPairRejection: string;
    conclusion: string;
  };
  metadata: {
    permanentQlId: null;
    publiclyPublishable: false;
    maturity: "LANGUAGE_PROTOTYPE";
  };
}

const TASKS = ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] as const;

export const ANA_CP008_ENGLISH_PROTOTYPES: readonly ProvisionalEnglishPrototypeDefinition[] = [
  {
    prototypeId: "PROTO_POSITION_SUM_TO_NUMBER",
    title: "Ordinary alphabet-position sum to a number",
    solveContract: "Convert both letters to ordinary positions and add them.",
    ruleId: "MIXED_LETTER_GROUP_SCALAR_AGGREGATE",
    context: { kind: "LETTER_GROUP_SCALAR", aggregate: "SUM" },
    sampleInputs: [letterGroupToken("BD"), letterGroupToken("FH"), letterGroupToken("ZA"), letterGroupToken("YB")],
    taskEligibility: TASKS,
    tokenOrderDecision: "NOT_APPLICABLE",
    sourceNote: "Source-backed by ordinary-position sum examples such as ZA : 27 :: YB : 27.",
  },
  {
    prototypeId: "PROTO_POSITION_PRODUCT_TO_NUMBER",
    title: "Ordinary alphabet-position product to a number",
    solveContract: "Convert both letters to ordinary positions and multiply them.",
    ruleId: "MIXED_LETTER_GROUP_SCALAR_AGGREGATE",
    context: { kind: "LETTER_GROUP_SCALAR", aggregate: "PRODUCT" },
    sampleInputs: [letterGroupToken("AB"), letterGroupToken("CD"), letterGroupToken("BE"), letterGroupToken("FG")],
    taskEligibility: TASKS,
    tokenOrderDecision: "NOT_APPLICABLE",
    sourceNote: "Source-backed by AB : 2 :: CD : 12.",
  },
  {
    prototypeId: "PROTO_POSITION_SUM_TO_LETTER",
    title: "Position sum converted back to a letter",
    solveContract: "Add ordinary positions and map the result back to its alphabet letter.",
    ruleId: "MIXED_LETTER_GROUP_DERIVED_LETTER",
    context: { kind: "LETTER_GROUP_TO_LETTER", aggregate: "SUM" },
    sampleInputs: [letterGroupToken("AE"), letterGroupToken("CG"), letterGroupToken("BD"), letterGroupToken("FH")],
    taskEligibility: TASKS,
    tokenOrderDecision: "NOT_APPLICABLE",
    sourceNote: "Source-backed by AE : F :: CG : J.",
  },
  {
    prototypeId: "PROTO_SINGLE_LETTER_POSITION_SQUARE",
    title: "Square of a letter's ordinary position",
    solveContract: "Find the ordinary position of the letter and square it.",
    ruleId: "MIXED_SINGLE_LETTER_POSITION_POWER",
    context: { kind: "SINGLE_LETTER_POSITION_POWER", exponent: 2 },
    sampleInputs: [letterToken("R"), letterToken("I"), letterToken("L"), letterToken("F")],
    taskEligibility: TASKS,
    tokenOrderDecision: "NOT_APPLICABLE",
    sourceNote: "Source-backed by R : 324 :: I : 81.",
  },
  {
    prototypeId: "PROTO_INDEPENDENT_LETTER_NUMBER_DELTA",
    title: "Independent letter shift and whole-number change",
    solveContract: "Apply one fixed letter shift and a separate fixed whole-number operation.",
    ruleId: "MIXED_TOKEN_INDEPENDENT_TRANSFORM",
    context: { kind: "INDEPENDENT_LETTER_NUMBER", letterShift: -6, numberOperation: "ADD", numberAmount: 7 },
    sampleInputs: [letterNumberToken("P", 21), letterNumberToken("G", 19), letterNumberToken("M", 16), letterNumberToken("H", 12)],
    taskEligibility: TASKS,
    tokenOrderDecision: "NOT_APPLICABLE",
    sourceNote: "Source-backed by P21 : J28 :: G19 : A26.",
  },
  {
    prototypeId: "PROTO_SHARED_CLUSTER_NUMBER_DELTA",
    title: "One shared delta across two letters and a number",
    solveContract: "Apply the same signed change to both letters and to the whole number.",
    ruleId: "MIXED_CLUSTER_NUMBER_SHARED_DELTA",
    context: { kind: "CLUSTER_NUMBER_SHARED_DELTA", delta: 5 },
    sampleInputs: [clusterNumberToken("PL", 36), clusterNumberToken("MI", 49), clusterNumberToken("AC", 20), clusterNumberToken("JK", 70)],
    taskEligibility: TASKS,
    tokenOrderDecision: "CLUSTER_FIRST",
    sourceNote: "Source-backed by PL36 : UQ41 :: MI49 : RN54.",
  },
  {
    prototypeId: "PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA",
    title: "Independent two-letter vector and numeric delta",
    solveContract: "Track both letter positions separately, then apply an independent fixed change to the number.",
    ruleId: "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR",
    context: { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [3, -2], numberDelta: -17 },
    sampleInputs: [clusterNumberToken("KH", 12), clusterNumberToken("NU", 13), clusterNumberToken("AB", 30), clusterNumberToken("PQ", 50)],
    taskEligibility: TASKS,
    tokenOrderDecision: "CLUSTER_FIRST",
    sourceNote: "Source-backed by KH12 : NF-5 :: NU13 : QS-4.",
  },
  {
    prototypeId: "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST",
    title: "Cluster-first exact multiplier with a letter vector",
    solveContract: "Apply the positional letter vector and multiply the number by an exact factor.",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER",
    context: { kind: "CLUSTER_NUMBER_VECTOR_MULTIPLIER", letterShifts: [3, 3], numerator: 5, denominator: 1 },
    sampleInputs: [clusterNumberToken("DA", 2), clusterNumberToken("SP", 7), clusterNumberToken("BE", 4), clusterNumberToken("LM", 6)],
    taskEligibility: TASKS,
    tokenOrderDecision: "CLUSTER_FIRST",
    sourceNote: "Source-backed by DA2 : GD10 :: SP7 : VS35; the same template must later prove exact rational factors.",
  },
  {
    prototypeId: "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST",
    title: "Number-first exact multiplier with a letter vector",
    solveContract: "Multiply the leading number exactly, transform both letters, and preserve number-first order.",
    ruleId: "MIXED_NUMBER_CLUSTER_VECTOR_MULTIPLIER",
    context: { kind: "NUMBER_CLUSTER_VECTOR_MULTIPLIER", letterShifts: [1, 3], numerator: 2, denominator: 1 },
    sampleInputs: [numberClusterToken(78, "AV"), numberClusterToken(108, "LD"), numberClusterToken(50, "CF"), numberClusterToken(32, "HM")],
    taskEligibility: TASKS,
    tokenOrderDecision: "NUMBER_FIRST",
    sourceNote: "Source-backed by 78AV : 156BY :: 108LD : 216MG.",
  },
  {
    prototypeId: "PROTO_DIRECT_CUBE_CLUSTER_FIRST",
    title: "Direct cube with a positional letter vector",
    solveContract: "Apply the two letter shifts and cube the displayed whole number directly.",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_POWER",
    context: { kind: "CLUSTER_NUMBER_VECTOR_POWER", letterShifts: [4, 11], transform: "CUBE" },
    sampleInputs: [clusterNumberToken("TR", 4), clusterNumberToken("AC", 3), clusterNumberToken("FH", 5), clusterNumberToken("JK", 6)],
    taskEligibility: TASKS,
    tokenOrderDecision: "CLUSTER_FIRST",
    sourceNote: "Source-backed by TR4 : XC64 :: AC3 : EN27.",
  },
  {
    prototypeId: "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST",
    title: "Perfect-square base converted to its cube",
    solveContract: "Recognize n as r squared, then use r cubed while applying the letter vector.",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_POWER",
    context: { kind: "CLUSTER_NUMBER_VECTOR_POWER", letterShifts: [3, -3], transform: "PERFECT_SQUARE_TO_CUBE" },
    sampleInputs: [clusterNumberToken("FM", 25), clusterNumberToken("NO", 36), clusterNumberToken("DE", 49), clusterNumberToken("RS", 64)],
    taskEligibility: TASKS,
    tokenOrderDecision: "CLUSTER_FIRST",
    sourceNote: "Source-backed by FM25 : IJ125 :: NO36 : QL216.",
  },
  {
    prototypeId: "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST",
    title: "Exact cube root after adding one",
    solveContract: "Add one to the number, prove a perfect cube, and take its exact cube root.",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_ROOT",
    context: { kind: "CLUSTER_NUMBER_VECTOR_ROOT", letterShifts: [-2, -5], transform: "CUBE_MINUS_ONE_ROOT" },
    sampleInputs: [clusterNumberToken("SN", 1330), clusterNumberToken("MP", 999), clusterNumberToken("TX", 1727), clusterNumberToken("HD", 215)],
    taskEligibility: TASKS,
    tokenOrderDecision: "CLUSTER_FIRST",
    sourceNote: "Source-backed by SN1330 : QI11 :: MP999 : KK10.",
  },
  {
    prototypeId: "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST",
    title: "Number-first exact square root after adding one",
    solveContract: "Add one, take the exact square root, transform the letters, and preserve number-first order.",
    ruleId: "MIXED_NUMBER_CLUSTER_VECTOR_ROOT",
    context: { kind: "NUMBER_CLUSTER_VECTOR_ROOT", letterShifts: [3, 6], transform: "SQUARE_MINUS_ONE_ROOT" },
    sampleInputs: [numberClusterToken(120, "LD"), numberClusterToken(288, "CG"), numberClusterToken(48, "HM"), numberClusterToken(80, "PQ")],
    taskEligibility: TASKS,
    tokenOrderDecision: "NUMBER_FIRST",
    sourceNote: "Source-backed by 120LD : 11OJ :: 288CG : 17FM.",
  },
  {
    prototypeId: "PROTO_DIGIT_SUM_SQUARE_SUCCESSOR",
    title: "Digit-sum-square letter recomputed after a number successor",
    solveContract: "Increase the number by one and recompute the attached letter from the square of its digit sum.",
    ruleId: "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR",
    context: { kind: "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR", numberStep: 1 },
    sampleInputs: [numberLetterToken(21, "I"), numberLetterToken(13, "P"), numberLetterToken(30, "I"), numberLetterToken(40, "P")],
    taskEligibility: TASKS,
    tokenOrderDecision: "NOT_APPLICABLE",
    sourceNote: "Source-backed by 21I : 22P :: 13P : 14Y.",
  },
];

function signed(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function positionTrace(input: string, output: string, shifts: readonly number[]): string {
  return [...input]
    .map((letter, index) => `${letter}${signed(shifts[index])}=${output[index]}`)
    .join(", ");
}

function digitSum(number: number): number {
  return [...String(Math.abs(number))].reduce((sum, digit) => sum + Number(digit), 0);
}

function pair(input: MixedToken, output: MixedToken): ProvisionalMixedEvidence {
  return { input, output };
}

function applyPrototype(
  prototype: ProvisionalEnglishPrototypeDefinition,
  input: MixedToken,
): MixedResult {
  const rule = provisionalMixedRuleById(prototype.ruleId);
  const output = rule.apply(input, prototype.context);
  if (!output) {
    throw new Error(`${prototype.prototypeId} cannot apply its source-backed context to ${mixedTokenKey(input)}.`);
  }
  const independent = independentlyApplyProvisionalMixedRule(prototype.ruleId, prototype.context, input);
  if (!sameMixedToken(output, independent)) {
    throw new Error(`${prototype.prototypeId} authority and independent solver disagree for ${mixedTokenKey(input)}.`);
  }
  return output;
}

function ruleStatement(prototype: ProvisionalEnglishPrototypeDefinition): string {
  switch (prototype.prototypeId) {
    case "PROTO_POSITION_SUM_TO_NUMBER":
      return "Write the ordinary alphabet positions of the two letters and add them.";
    case "PROTO_POSITION_PRODUCT_TO_NUMBER":
      return "Write the ordinary alphabet positions of the two letters and multiply them.";
    case "PROTO_POSITION_SUM_TO_LETTER":
      return "Add the ordinary alphabet positions, then convert that total back to its alphabet letter.";
    case "PROTO_SINGLE_LETTER_POSITION_SQUARE":
      return "Square the ordinary alphabet position of the letter.";
    case "PROTO_INDEPENDENT_LETTER_NUMBER_DELTA":
      return "The letter and the whole number follow two separate fixed changes.";
    case "PROTO_SHARED_CLUSTER_NUMBER_DELTA":
      return "The same signed change is applied to both letters and to the whole number.";
    case "PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA":
      return "Each letter position has its own fixed shift, and the number has a separate fixed delta.";
    case "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST":
    case "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST":
      return "Apply the fixed letter shifts and multiply the whole number by the exact demonstrated factor.";
    case "PROTO_DIRECT_CUBE_CLUSTER_FIRST":
      return "Apply the fixed letter shifts and cube the displayed whole number directly.";
    case "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST":
      return "Recognize the displayed number as a perfect square, recover its base, and cube that base.";
    case "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST":
      return "Add one to the displayed number, then take the exact cube root.";
    case "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST":
      return "Add one to the leading number, take the exact square root, and keep the number-first order.";
    case "PROTO_DIGIT_SUM_SQUARE_SUCCESSOR":
      return "Increase the number by one and recompute the letter from the square of the new number's digit sum.";
  }
}

function explainEvidence(
  prototype: ProvisionalEnglishPrototypeDefinition,
  evidence: ProvisionalMixedEvidence,
): string {
  const { input, output } = evidence;
  const context = prototype.context;

  switch (context.kind) {
    case "LETTER_GROUP_SCALAR": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "NUMBER") throw new Error("Scalar prototype token mismatch.");
      const positions = [...input.letters].map(letterPosition);
      const symbol = context.aggregate === "SUM" ? "+" : "×";
      return `${input.letters}: ${input.letters[0]}=${positions[0]} and ${input.letters[1]}=${positions[1]}; ${positions[0]} ${symbol} ${positions[1]} = ${output.number}.`;
    }
    case "LETTER_GROUP_TO_LETTER": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "LETTER") throw new Error("Derived-letter prototype token mismatch.");
      const positions = [...input.letters].map(letterPosition);
      const total = positions[0] + positions[1];
      return `${input.letters}: ${input.letters[0]}=${positions[0]} and ${input.letters[1]}=${positions[1]}; ${positions[0]} + ${positions[1]} = ${total}, and the ${total}th letter is ${output.letter}.`;
    }
    case "SINGLE_LETTER_POSITION_POWER": {
      if (input.kind !== "LETTER" || output.kind !== "NUMBER") throw new Error("Position-square prototype token mismatch.");
      const position = letterPosition(input.letter);
      return `${input.letter} is the ${position}th letter, and ${position}² = ${output.number}.`;
    }
    case "INDEPENDENT_LETTER_NUMBER": {
      if (input.kind !== "LETTER_NUMBER" || output.kind !== "LETTER_NUMBER") throw new Error("Independent mixed prototype token mismatch.");
      const numericSymbol = context.numberOperation === "ADD" ? "+" : "−";
      return `${renderMixedToken(input)}: ${input.letter}${signed(context.letterShift)}=${output.letter}, while ${input.number} ${numericSymbol} ${context.numberAmount} = ${output.number}.`;
    }
    case "CLUSTER_NUMBER_SHARED_DELTA": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Shared-delta prototype token mismatch.");
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, [context.delta, context.delta])}, and ${input.number}${signed(context.delta)}=${output.number}.`;
    }
    case "CLUSTER_NUMBER_INDEPENDENT_VECTOR": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Vector-delta prototype token mismatch.");
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, context.letterShifts)}, and ${input.number}${signed(context.numberDelta)}=${output.number}.`;
    }
    case "CLUSTER_NUMBER_VECTOR_MULTIPLIER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Cluster multiplier prototype token mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, context.letterShifts)}, and ${arithmetic}.`;
    }
    case "NUMBER_CLUSTER_VECTOR_MULTIPLIER": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Number-first multiplier prototype token mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return `${renderMixedToken(input)}: ${arithmetic}; ${positionTrace(input.letters, output.letters, context.letterShifts)}. The result stays number-first: ${renderMixedToken(output)}.`;
    }
    case "CLUSTER_NUMBER_VECTOR_POWER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Power prototype token mismatch.");
      const numericTrace = context.transform === "CUBE"
        ? `${input.number}³ = ${output.number}`
        : `${input.number} = ${Math.sqrt(input.number)}², so ${Math.sqrt(input.number)}³ = ${output.number}`;
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, context.letterShifts)}, and ${numericTrace}.`;
    }
    case "CLUSTER_NUMBER_VECTOR_ROOT": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Cube-root prototype token mismatch.");
      return `${renderMixedToken(input)}: ${input.number} + 1 = ${input.number + 1} = ${output.number}³, so the exact cube root is ${output.number}; ${positionTrace(input.letters, output.letters, context.letterShifts)}.`;
    }
    case "NUMBER_CLUSTER_VECTOR_ROOT": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Square-root prototype token mismatch.");
      return `${renderMixedToken(input)}: ${input.number} + 1 = ${input.number + 1} = ${output.number}², so the exact square root is ${output.number}; ${positionTrace(input.letters, output.letters, context.letterShifts)}. The result remains number-first.`;
    }
    case "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR": {
      if (input.kind !== "NUMBER_LETTER" || output.kind !== "NUMBER_LETTER") throw new Error("Digit-sum-square prototype token mismatch.");
      const inputDigitSum = digitSum(input.number);
      const outputDigitSum = digitSum(output.number);
      return `${renderMixedToken(input)}: first verify ${input.number} → ${inputDigitSum}²=${inputDigitSum * inputDigitSum}, which is ${input.letter}. Then increase the number to ${output.number}; its digit sum is ${outputDigitSum}, and ${outputDigitSum}²=${outputDigitSum * outputDigitSum}, the position of ${output.letter}.`;
    }
  }
}

function trapRejection(prototype: ProvisionalEnglishPrototypeDefinition): string {
  switch (prototype.prototypeId) {
    case "PROTO_POSITION_SUM_TO_NUMBER":
      return "A tempting mistake is to multiply the positions or count the gap. Here the demonstrated operation is ordinary-position addition.";
    case "PROTO_POSITION_PRODUCT_TO_NUMBER":
      return "A tempting mistake is to add the positions. Both ordinary positions are factors, so they must be multiplied.";
    case "PROTO_POSITION_SUM_TO_LETTER":
      return "Do not stop at the numerical total: the final step is to convert that exact total back to a letter.";
    case "PROTO_SINGLE_LETTER_POSITION_SQUARE":
      return "Using the position itself or merely doubling it misses the square required by the source pair.";
    case "PROTO_INDEPENDENT_LETTER_NUMBER_DELTA":
      return "Do not force one shared change onto both components. The letter shift and the whole-number change are independent.";
    case "PROTO_SHARED_CLUSTER_NUMBER_DELTA":
      return "Do not use different shifts for the two letters or leave the number unchanged; one common signed change controls all three components.";
    case "PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA":
      return "Do not replace the positional vector with one uniform shift. Each letter position and the number have their own fixed changes.";
    case "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST":
    case "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST":
      return "The number is multiplied, not increased by the factor. For a fractional factor, the division must be exact rather than rounded.";
    case "PROTO_DIRECT_CUBE_CLUSTER_FIRST":
      return "Cube the displayed number directly; squaring it or multiplying it by three gives a different relationship.";
    case "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST":
      return "Do not cube the displayed square itself. Recover its square-root base first, then cube that base.";
    case "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST":
      return "The rule uses the exact cube root after adding one. Taking a root of the original number or rounding an approximate root breaks the relation.";
    case "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST":
      return "Add one before taking the exact square root, and keep the number before the letters in the final term.";
    case "PROTO_DIGIT_SUM_SQUARE_SUCCESSOR":
      return "The letter is recomputed from the new number; it is not obtained by applying a fixed alphabet shift to the old letter.";
  }
}

function directStem(prototype: ProvisionalEnglishPrototypeDefinition, source: ProvisionalMixedEvidence, targetInput: MixedToken): string {
  const sourceText = `${renderMixedToken(source.input)} : ${renderMixedToken(source.output)}`;
  const targetText = `${renderMixedToken(targetInput)} : ?`;
  const index = ANA_CP008_ENGLISH_PROTOTYPES.findIndex((entry) => entry.prototypeId === prototype.prototypeId);
  switch (index % 4) {
    case 0:
      return `Choose the term that completes the analogy: ${sourceText} :: ${targetText}`;
    case 1:
      return `Find the missing term so that both pairs follow the same relationship: ${sourceText} :: ${targetText}`;
    case 2:
      return `Select the option that replaces the question mark: ${sourceText} :: ${targetText}`;
    default:
      return `Complete the second pair by applying the relationship shown in the first pair: ${sourceText} :: ${targetText}`;
  }
}

function oddStem(prototype: ProvisionalEnglishPrototypeDefinition): string {
  const index = ANA_CP008_ENGLISH_PROTOTYPES.findIndex((entry) => entry.prototypeId === prototype.prototypeId);
  switch (index % 3) {
    case 0:
      return "Three of the following pairs follow the same relationship. Select the pair that does not belong to the group.";
    case 1:
      return "Choose the pair that is different from the other three in its letter-and-number relationship.";
    default:
      return "In three options the same rule is used. Identify the option in which that rule is not followed.";
  }
}

function mutateOutput(output: MixedResult): readonly MixedResult[] {
  switch (output.kind) {
    case "NUMBER":
      return [
        { kind: "NUMBER", number: output.number + 1 },
        { kind: "NUMBER", number: output.number - 1 },
      ];
    case "LETTER":
      return [letterToken(shiftLetter(output.letter, 1)), letterToken(shiftLetter(output.letter, -1))];
    case "LETTER_NUMBER":
      return [
        letterNumberToken(shiftLetter(output.letter, 1), output.number),
        letterNumberToken(output.letter, output.number + 1),
      ];
    case "NUMBER_LETTER":
      return [
        numberLetterToken(output.number, shiftLetter(output.letter, 1)),
        numberLetterToken(output.number + 1, output.letter),
      ];
    case "CLUSTER_NUMBER":
      return [
        clusterNumberToken(shiftLetter(output.letters[0], 1) + output.letters.slice(1), output.number),
        clusterNumberToken(output.letters, output.number + 1),
      ];
    case "NUMBER_CLUSTER":
      return [
        numberClusterToken(output.number, shiftLetter(output.letters[0], 1) + output.letters.slice(1)),
        numberClusterToken(output.number + 1, output.letters),
      ];
    case "LETTER_GROUP":
      return [letterGroupToken(shiftLetter(output.letters[0], 1) + output.letters.slice(1))];
  }
}

function prototypeById(prototypeId: ProvisionalEnglishPrototypeId): ProvisionalEnglishPrototypeDefinition {
  const prototype = ANA_CP008_ENGLISH_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId);
  if (!prototype) throw new Error(`Unknown ANA-CP-008 English prototype: ${prototypeId}`);
  return prototype;
}

export function renderDirectEnglishPrototype(
  prototypeId: ProvisionalEnglishPrototypeId,
): RenderedDirectEnglishPrototype {
  const prototype = prototypeById(prototypeId);
  const source = pair(prototype.sampleInputs[0], applyPrototype(prototype, prototype.sampleInputs[0]));
  const target = pair(prototype.sampleInputs[1], applyPrototype(prototype, prototype.sampleInputs[1]));
  const matches = matchingProvisionalMixedRules([source, target])
    .filter((match) => match.priority <= provisionalMixedRuleById(prototype.ruleId).priority);
  if (matches.length !== 1 || matches[0].ruleId !== prototype.ruleId ||
      matches[0].contextKey !== provisionalMixedContextKey(prototype.context)) {
    throw new Error(`${prototype.prototypeId} direct fixture is not uniquely owned by its intended context.`);
  }

  return {
    prototypeId,
    task: "DIRECT_COMPLETION",
    stem: directStem(prototype, source, target.input),
    source,
    target,
    correctAnswer: target.output,
    answerKind: target.output.kind,
    explanation: {
      ruleStatement: ruleStatement(prototype),
      sourceDemonstration: explainEvidence(prototype, source),
      targetApplication: explainEvidence(prototype, target),
      conclusion: `Therefore, ${renderMixedToken(target.output)} completes the analogy.`,
      closestTrapRejection: trapRejection(prototype),
    },
    metadata: {
      permanentQlId: null,
      publiclyPublishable: false,
      maturity: "LANGUAGE_PROTOTYPE",
    },
  };
}

export function renderOddPairEnglishPrototype(
  prototypeId: ProvisionalEnglishPrototypeId,
): RenderedOddPairEnglishPrototype {
  const prototype = prototypeById(prototypeId);
  const validPairs = prototype.sampleInputs.slice(0, 3).map((input) => pair(input, applyPrototype(prototype, input)));
  const intendedMatches = matchingProvisionalMixedRules(validPairs)
    .filter((match) => match.priority <= provisionalMixedRuleById(prototype.ruleId).priority);
  if (intendedMatches.length !== 1 || intendedMatches[0].ruleId !== prototype.ruleId ||
      intendedMatches[0].contextKey !== provisionalMixedContextKey(prototype.context)) {
    throw new Error(`${prototype.prototypeId} odd-pair valid set is not uniquely owned by its intended context.`);
  }

  const oddInput = prototype.sampleInputs[3];
  const expectedOutput = applyPrototype(prototype, oddInput);
  const wrongOutput = mutateOutput(expectedOutput).find((candidate) => {
    if (sameMixedToken(candidate, expectedOutput)) return false;
    const complete = [...validPairs, pair(oddInput, candidate)];
    return matchingProvisionalMixedRules(complete).length === 0;
  });
  if (!wrongOutput) throw new Error(`${prototype.prototypeId} cannot build a safe odd-pair prototype.`);

  const oddPair = pair(oddInput, wrongOutput);
  const options = [...validPairs, oddPair];
  const validDemonstrations = validPairs.map((entry) => explainEvidence(prototype, entry));

  return {
    prototypeId,
    task: "ODD_PAIR_SELECTION",
    stem: oddStem(prototype),
    options,
    correctIndex: 3,
    explanation: {
      commonRule: ruleStatement(prototype),
      validPairDemonstrations: validDemonstrations as [string, string, string],
      oddPairRejection: `For ${renderMixedToken(oddInput)}, the demonstrated rule gives ${renderMixedToken(expectedOutput)}, not ${renderMixedToken(wrongOutput)}.`,
      conclusion: `Therefore, ${renderMixedToken(oddPair.input)} : ${renderMixedToken(oddPair.output)} is the pair that does not follow the common rule.`,
    },
    metadata: {
      permanentQlId: null,
      publiclyPublishable: false,
      maturity: "LANGUAGE_PROTOTYPE",
    },
  };
}

export function renderAllDirectEnglishPrototypes(): readonly RenderedDirectEnglishPrototype[] {
  return ANA_CP008_ENGLISH_PROTOTYPES.map((prototype) => renderDirectEnglishPrototype(prototype.prototypeId));
}

export function renderAllOddPairEnglishPrototypes(): readonly RenderedOddPairEnglishPrototype[] {
  return ANA_CP008_ENGLISH_PROTOTYPES.map((prototype) => renderOddPairEnglishPrototype(prototype.prototypeId));
}
