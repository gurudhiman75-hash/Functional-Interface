import { letterPosition } from "../foundation/alphabet";
import {
  mixedEvidenceKey,
  type ProvisionalMixedEvidence,
} from "./provisional-independent-solver";
import {
  mixedTokenKey,
  renderMixedToken,
  type MixedResult,
} from "./foundation/mixed-token";
import {
  provisionalMixedContextKey,
  provisionalMixedRuleById,
  type ProvisionalMixedContext,
  type ProvisionalMixedRuleId,
} from "./provisional-rule-definitions";
import {
  anaCp008PrototypeById,
  anaCp008QlById,
  type MixedPresentationMode,
} from "./question-language.en";
import type { ProvisionalEnglishPrototypeId } from "./provisional-language-templates.en";
import {
  buildOddPair,
  chooseUniqueEvidence,
  deterministicShuffle,
  safeDirectOptions,
  type MixedRuntimeOption,
} from "./runtime-support";

export type MixedDifficulty = "EASY" | "MEDIUM" | "HARD";
export type MixedRuntimeLayout = "INLINE" | "ARROW" | "TWO_ROW_TABLE" | "BOXED_PAIRS";

interface MixedRuntimeMetadata {
  runtimeVersion: "ana-cp-008-v1";
  ambiguityAccepted: true;
  publiclyPublishable: false;
  maturity: "RUNTIME_PROOF";
  tokenLanguage: "latin";
}

interface GeneratedMixedBase {
  checkpointId: "ANA-CP-008";
  qlId: string;
  prototypeId: ProvisionalEnglishPrototypeId;
  ruleId: ProvisionalMixedRuleId;
  presentationMode: MixedPresentationMode;
  seed: number;
  difficulty: MixedDifficulty;
  difficultyScore: number;
  layout: MixedRuntimeLayout;
  context: ProvisionalMixedContext;
  contextKey: string;
  stem: string;
  correctIndex: number;
  metadata: MixedRuntimeMetadata;
}

export interface GeneratedMixedDirectAnalogy extends GeneratedMixedBase {
  presentationMode: "DIRECT_COMPLETION";
  source: ProvisionalMixedEvidence;
  target: ProvisionalMixedEvidence;
  options: readonly MixedRuntimeOption[];
  explanation: {
    ruleStatement: string;
    sourceDemonstration: string;
    targetApplication: string;
    conclusion: string;
    closestTrapRejection: string;
  };
}

export interface GeneratedMixedOddPairAnalogy extends GeneratedMixedBase {
  presentationMode: "ODD_PAIR_SELECTION";
  validPairs: readonly [
    ProvisionalMixedEvidence,
    ProvisionalMixedEvidence,
    ProvisionalMixedEvidence,
  ];
  oddPair: ProvisionalMixedEvidence;
  expectedOddOutput: MixedResult;
  options: readonly ProvisionalMixedEvidence[];
  explanation: {
    commonRule: string;
    validPairDemonstrations: readonly [string, string, string];
    oddPairRejection: string;
    conclusion: string;
  };
}

export type GeneratedMixedAnalogy = GeneratedMixedDirectAnalogy | GeneratedMixedOddPairAnalogy;

const LAYOUTS: readonly MixedRuntimeLayout[] = ["INLINE", "ARROW", "TWO_ROW_TABLE", "BOXED_PAIRS"];

function contextsForPrototype(prototypeId: ProvisionalEnglishPrototypeId): readonly ProvisionalMixedContext[] {
  const prototype = anaCp008PrototypeById(prototypeId);
  const rule = provisionalMixedRuleById(prototype.ruleId);
  return rule.contexts.filter((context) => {
    switch (prototypeId) {
      case "PROTO_POSITION_SUM_TO_NUMBER":
        return context.kind === "LETTER_GROUP_SCALAR" && context.aggregate === "SUM";
      case "PROTO_POSITION_PRODUCT_TO_NUMBER":
        return context.kind === "LETTER_GROUP_SCALAR" && context.aggregate === "PRODUCT";
      case "PROTO_DIRECT_CUBE_CLUSTER_FIRST":
        return context.kind === "CLUSTER_NUMBER_VECTOR_POWER" && context.transform === "CUBE";
      case "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST":
        return context.kind === "CLUSTER_NUMBER_VECTOR_POWER" && context.transform === "PERFECT_SQUARE_TO_CUBE";
      default:
        return context.kind === prototype.context.kind;
    }
  });
}

export function anaCp008ContextsForPrototype(
  prototypeId: ProvisionalEnglishPrototypeId,
): readonly ProvisionalMixedContext[] {
  const contexts = contextsForPrototype(prototypeId);
  if (contexts.length === 0) throw new Error(`No runtime contexts for ${prototypeId}.`);
  return contexts;
}

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

export function englishRuleStatement(prototypeId: ProvisionalEnglishPrototypeId): string {
  switch (prototypeId) {
    case "PROTO_POSITION_SUM_TO_NUMBER":
      return "Write the ordinary alphabet positions of the two letters and add them.";
    case "PROTO_POSITION_PRODUCT_TO_NUMBER":
      return "Write the ordinary alphabet positions of the two letters and multiply them.";
    case "PROTO_POSITION_SUM_TO_LETTER":
      return "Add the ordinary alphabet positions, then convert the total back to its alphabet letter.";
    case "PROTO_SINGLE_LETTER_POSITION_SQUARE":
      return "Square the ordinary alphabet position of the letter.";
    case "PROTO_INDEPENDENT_LETTER_NUMBER_DELTA":
      return "The letter and the whole number follow two separate fixed changes.";
    case "PROTO_SHARED_CLUSTER_NUMBER_DELTA":
      return "Apply the same signed change to both letters and to the whole number.";
    case "PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA":
      return "Track the two letter positions separately and apply an independent fixed change to the number.";
    case "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST":
    case "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST":
      return "Apply the fixed letter shifts and multiply the number by the exact demonstrated factor.";
    case "PROTO_DIRECT_CUBE_CLUSTER_FIRST":
      return "Apply the fixed letter shifts and cube the displayed whole number directly.";
    case "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST":
      return "Recognise the displayed number as a perfect square, recover its base, and cube that base.";
    case "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST":
      return "Add one to the displayed number and take the exact cube root.";
    case "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST":
      return "Add one to the leading number, take the exact square root, and preserve number-first order.";
    case "PROTO_DIGIT_SUM_SQUARE_SUCCESSOR":
      return "Increase the number by one and recompute the letter from the square of the new digit sum.";
  }
}

export function explainMixedEvidence(
  context: ProvisionalMixedContext,
  evidence: ProvisionalMixedEvidence,
): string {
  const { input, output } = evidence;
  switch (context.kind) {
    case "LETTER_GROUP_SCALAR": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "NUMBER") throw new Error("Scalar token mismatch.");
      const positions = [...input.letters].map(letterPosition);
      const symbol = context.aggregate === "SUM" ? "+" : "×";
      return `${input.letters}: ${input.letters[0]}=${positions[0]} and ${input.letters[1]}=${positions[1]}; ${positions[0]} ${symbol} ${positions[1]} = ${output.number}.`;
    }
    case "LETTER_GROUP_TO_LETTER": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "LETTER") throw new Error("Derived-letter token mismatch.");
      const positions = [...input.letters].map(letterPosition);
      const total = positions[0] + positions[1];
      return `${input.letters}: ${positions[0]} + ${positions[1]} = ${total}, and the ${total}th letter is ${output.letter}.`;
    }
    case "SINGLE_LETTER_POSITION_POWER": {
      if (input.kind !== "LETTER" || output.kind !== "NUMBER") throw new Error("Position-square token mismatch.");
      const position = letterPosition(input.letter);
      return `${input.letter} is the ${position}th letter, and ${position}² = ${output.number}.`;
    }
    case "INDEPENDENT_LETTER_NUMBER": {
      if (input.kind !== "LETTER_NUMBER" || output.kind !== "LETTER_NUMBER") throw new Error("Independent-token mismatch.");
      const symbol = context.numberOperation === "ADD" ? "+" : "−";
      return `${renderMixedToken(input)}: ${input.letter}${signed(context.letterShift)}=${output.letter}, while ${input.number} ${symbol} ${context.numberAmount} = ${output.number}; therefore ${renderMixedToken(output)}.`;
    }
    case "CLUSTER_NUMBER_SHARED_DELTA": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Shared-delta token mismatch.");
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, [context.delta, context.delta])}, and ${input.number}${signed(context.delta)}=${output.number}; therefore ${renderMixedToken(output)}.`;
    }
    case "CLUSTER_NUMBER_INDEPENDENT_VECTOR": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Vector-delta token mismatch.");
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, context.letterShifts)}, and ${input.number}${signed(context.numberDelta)}=${output.number}; therefore ${renderMixedToken(output)}.`;
    }
    case "CLUSTER_NUMBER_VECTOR_MULTIPLIER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Multiplier token mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, context.letterShifts)}, and ${arithmetic}; therefore ${renderMixedToken(output)}.`;
    }
    case "NUMBER_CLUSTER_VECTOR_MULTIPLIER": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Number-first multiplier mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return `${renderMixedToken(input)}: ${arithmetic}; ${positionTrace(input.letters, output.letters, context.letterShifts)}. Keeping number-first order gives ${renderMixedToken(output)}.`;
    }
    case "CLUSTER_NUMBER_VECTOR_POWER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Power token mismatch.");
      const numeric = context.transform === "CUBE"
        ? `${input.number}³ = ${output.number}`
        : `${input.number}=${Math.sqrt(input.number)}², so ${Math.sqrt(input.number)}³=${output.number}`;
      return `${renderMixedToken(input)}: ${positionTrace(input.letters, output.letters, context.letterShifts)}, and ${numeric}; therefore ${renderMixedToken(output)}.`;
    }
    case "CLUSTER_NUMBER_VECTOR_ROOT": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Cube-root token mismatch.");
      return `${renderMixedToken(input)}: ${input.number}+1=${input.number + 1}=${output.number}³, so the exact cube root is ${output.number}; ${positionTrace(input.letters, output.letters, context.letterShifts)} gives ${renderMixedToken(output)}.`;
    }
    case "NUMBER_CLUSTER_VECTOR_ROOT": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Square-root token mismatch.");
      return `${renderMixedToken(input)}: ${input.number}+1=${input.number + 1}=${output.number}², so the exact square root is ${output.number}; ${positionTrace(input.letters, output.letters, context.letterShifts)} and number-first order give ${renderMixedToken(output)}.`;
    }
    case "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR": {
      if (input.kind !== "NUMBER_LETTER" || output.kind !== "NUMBER_LETTER") throw new Error("Digit-sum token mismatch.");
      const first = digitSum(input.number);
      const second = digitSum(output.number);
      return `${renderMixedToken(input)}: ${input.number} has digit sum ${first} and ${first}²=${first * first}, which gives ${input.letter}. Increase the number to ${output.number}; its digit sum is ${second} and ${second}²=${second * second}, which gives ${output.letter}.`;
    }
  }
}

export function englishTrapRejection(prototypeId: ProvisionalEnglishPrototypeId): string {
  switch (prototypeId) {
    case "PROTO_POSITION_SUM_TO_NUMBER":
      return "Multiplying the positions or counting their gap is a tempting error; the demonstrated operation is addition.";
    case "PROTO_POSITION_PRODUCT_TO_NUMBER":
      return "Adding the positions is the nearest trap; both positions are factors and must be multiplied.";
    case "PROTO_POSITION_SUM_TO_LETTER":
      return "Do not stop at the numerical total; convert that exact position back to a letter.";
    case "PROTO_SINGLE_LETTER_POSITION_SQUARE":
      return "Using the position itself or doubling it misses the square shown by the source pair.";
    case "PROTO_INDEPENDENT_LETTER_NUMBER_DELTA":
      return "Do not force one shared change onto the letter and number; their changes are independent.";
    case "PROTO_SHARED_CLUSTER_NUMBER_DELTA":
      return "Do not use different letter shifts or leave the number unchanged; one signed change controls all components.";
    case "PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA":
      return "Do not replace the positional vector with one uniform shift; each letter and the number have fixed separate changes.";
    case "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST":
      return "The number is multiplied rather than increased by the factor, and any division must be exact.";
    case "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST":
      return "Even with correct components, reversing their order is wrong; the number must remain first.";
    case "PROTO_DIRECT_CUBE_CLUSTER_FIRST":
      return "Squaring the number or multiplying it by three is not the same as cubing it.";
    case "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST":
      return "Do not cube the displayed square directly; recover its square-root base first.";
    case "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST":
      return "Add one before taking an exact cube root; do not root the original number or round an estimate.";
    case "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST":
      return "Add one before taking the exact square root and keep the number before the letters.";
    case "PROTO_DIGIT_SUM_SQUARE_SUCCESSOR":
      return "The new letter is recomputed from the new number, not obtained by a fixed shift from the old letter.";
  }
}

function difficultyScore(
  rulePriority: number,
  presentationMode: MixedPresentationMode,
  context: ProvisionalMixedContext,
): number {
  let score = rulePriority;
  if (presentationMode === "ODD_PAIR_SELECTION") score += 1;
  if (context.kind === "CLUSTER_NUMBER_INDEPENDENT_VECTOR" && Math.abs(context.numberDelta) >= 100) score += 1;
  if (context.kind.includes("ROOT") || context.kind.includes("POWER")) score += 1;
  return Math.max(1, Math.min(5, score));
}

function difficultyFromScore(score: number): MixedDifficulty {
  if (score <= 2) return "EASY";
  if (score === 3) return "MEDIUM";
  return "HARD";
}

function directStem(
  source: ProvisionalMixedEvidence,
  target: ProvisionalMixedEvidence,
  layout: MixedRuntimeLayout,
  seed: number,
): string {
  const sourceInput = renderMixedToken(source.input);
  const sourceOutput = renderMixedToken(source.output);
  const targetInput = renderMixedToken(target.input);
  if (layout === "ARROW") return `${sourceInput} → ${sourceOutput}  ::  ${targetInput} → ?`;
  if (layout === "BOXED_PAIRS") return `[ ${sourceInput} : ${sourceOutput} ]  ::  [ ${targetInput} : ? ]`;
  if (layout === "TWO_ROW_TABLE") {
    return `Complete the second row by applying the same relationship.\n\n| Pair | Input | Output |\n|---|---|---|\n| A | ${sourceInput} | ${sourceOutput} |\n| B | ${targetInput} | ? |`;
  }
  const variants = [
    `Choose the term that completes the analogy: ${sourceInput} : ${sourceOutput} :: ${targetInput} : ?`,
    `Find the missing term so that both pairs follow the same relationship: ${sourceInput} : ${sourceOutput} :: ${targetInput} : ?`,
    `Select the option that replaces the question mark: ${sourceInput} : ${sourceOutput} :: ${targetInput} : ?`,
  ];
  return variants[Math.abs(seed) % variants.length];
}

function oddStem(layout: MixedRuntimeLayout, seed: number): string {
  if (layout === "ARROW") return "Three arrow pairs follow one rule. Select the pair that does not follow it.";
  if (layout === "BOXED_PAIRS") return "Three boxed pairs use the same relationship. Choose the different box.";
  if (layout === "TWO_ROW_TABLE") return "Inspect the four input-output rows and select the one that does not use the common rule.";
  const variants = [
    "Three of the following pairs follow the same relationship. Select the pair that does not belong.",
    "Choose the pair that is different from the other three in its letter-and-number relationship.",
    "In three options the same rule is used. Identify the option in which that rule is not followed.",
  ];
  return variants[Math.abs(seed) % variants.length];
}

export function generateMixedAnalogy(qlId: string, seed = 0): GeneratedMixedAnalogy {
  const ql = anaCp008QlById(qlId);
  const prototype = anaCp008PrototypeById(ql.prototypeId);
  const rule = provisionalMixedRuleById(ql.ruleId);
  const contexts = anaCp008ContextsForPrototype(ql.prototypeId);
  const normalizedSeed = Math.abs(seed | 0);
  const context = contexts[normalizedSeed % contexts.length];
  const contextKey = provisionalMixedContextKey(context);
  const layout = LAYOUTS[(normalizedSeed + Number(qlId.slice(-3))) % LAYOUTS.length];
  const score = difficultyScore(rule.priority, ql.presentationMode, context);
  const metadata: MixedRuntimeMetadata = {
    runtimeVersion: "ana-cp-008-v1",
    ambiguityAccepted: true,
    publiclyPublishable: false,
    maturity: "RUNTIME_PROOF",
    tokenLanguage: "latin",
  };

  if (ql.presentationMode === "DIRECT_COMPLETION") {
    const [source, target] = chooseUniqueEvidence(rule, context, 2, normalizedSeed + Number(qlId.slice(-3))) as readonly [
      ProvisionalMixedEvidence,
      ProvisionalMixedEvidence,
    ];
    const options = safeDirectOptions(rule, context, source, target, normalizedSeed + 71);
    const correctIndex = options.findIndex((option) => option.errorLabel === "CORRECT");
    if (correctIndex < 0 || mixedTokenKey(options[correctIndex].value) !== mixedTokenKey(target.output)) {
      throw new Error(`${qlId} direct option set lost its correct answer.`);
    }
    const conclusions = [
      `Therefore, ${renderMixedToken(target.output)} completes the analogy.`,
      `Applying the complete source rule gives ${renderMixedToken(target.output)}, so that is the correct option.`,
      `The target becomes ${renderMixedToken(target.output)} after both components are checked.`,
    ];
    return {
      checkpointId: "ANA-CP-008",
      qlId,
      prototypeId: prototype.prototypeId,
      ruleId: rule.id,
      presentationMode: "DIRECT_COMPLETION",
      seed,
      difficulty: difficultyFromScore(score),
      difficultyScore: score,
      layout,
      context,
      contextKey,
      source,
      target,
      stem: directStem(source, target, layout, normalizedSeed),
      options,
      correctIndex,
      explanation: {
        ruleStatement: englishRuleStatement(prototype.prototypeId),
        sourceDemonstration: explainMixedEvidence(context, source),
        targetApplication: explainMixedEvidence(context, target),
        conclusion: conclusions[normalizedSeed % conclusions.length],
        closestTrapRejection: englishTrapRejection(prototype.prototypeId),
      },
      metadata,
    };
  }

  const built = buildOddPair(rule, context, normalizedSeed + Number(qlId.slice(-3)));
  const options = deterministicShuffle(
    [...built.validPairs, built.oddPair],
    normalizedSeed * 67 + Number(qlId.slice(-3)),
  );
  const correctIndex = options.findIndex((option) => mixedEvidenceKey(option) === mixedEvidenceKey(built.oddPair));
  if (correctIndex < 0) throw new Error(`${qlId} odd pair was lost during option shuffling.`);
  const validPairDemonstrations = built.validPairs.map((entry) => explainMixedEvidence(context, entry)) as [
    string,
    string,
    string,
  ];
  const conclusions = [
    `Therefore, ${renderMixedToken(built.oddPair.input)} : ${renderMixedToken(built.oddPair.output)} is the pair that does not follow the common rule.`,
    `The other three pairs satisfy the complete relationship, so ${renderMixedToken(built.oddPair.input)} : ${renderMixedToken(built.oddPair.output)} is the odd pair.`,
    `Only ${renderMixedToken(built.oddPair.input)} : ${renderMixedToken(built.oddPair.output)} fails the shared transformation.`,
  ];
  return {
    checkpointId: "ANA-CP-008",
    qlId,
    prototypeId: prototype.prototypeId,
    ruleId: rule.id,
    presentationMode: "ODD_PAIR_SELECTION",
    seed,
    difficulty: difficultyFromScore(score),
    difficultyScore: score,
    layout,
    context,
    contextKey,
    validPairs: built.validPairs,
    oddPair: built.oddPair,
    expectedOddOutput: built.expectedOddOutput,
    stem: oddStem(layout, normalizedSeed),
    options,
    correctIndex,
    explanation: {
      commonRule: englishRuleStatement(prototype.prototypeId),
      validPairDemonstrations,
      oddPairRejection: `For ${renderMixedToken(built.oddPair.input)}, the common rule gives ${renderMixedToken(built.expectedOddOutput)}, not ${renderMixedToken(built.oddPair.output)}.`,
      conclusion: conclusions[normalizedSeed % conclusions.length],
    },
    metadata,
  };
}
