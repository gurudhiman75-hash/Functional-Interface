import { RNK_PARTITION_SCHEMES_V2 } from "../foundation/rnk-derived-object-pool-v2";
import {
  generateRnkCp007CategoryCompositionQuestion as generateV12Question,
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  solveRnkCp007CategoryComposition,
  type RnkCp007CategoryCompositionEditorialQuestion,
  type RnkCp007CategoryCompositionMode,
  type RnkCp007CategoryCompositionState,
  type RnkCp007CategoryEvidence,
  type RnkCp007CategoryId,
  type RnkCp007Side,
} from "./cp007-category-composition-editorial-v1-1";

export const RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V2_VERSION =
  "RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V2_SURFACE_DIVERSIFIED_POLISHED" as const;

export { RNK_CP007_CATEGORY_COMPOSITION_MODES, solveRnkCp007CategoryComposition };
export type {
  RnkCp007CategoryCompositionMode,
  RnkCp007CategoryCompositionState,
  RnkCp007CategoryEvidence,
  RnkCp007CategoryId,
  RnkCp007Side,
};

export type RnkCp007CategorySurfaceStyle =
  | "CANONICAL"
  | "RANKED_LIST"
  | "ORDER_OF_MERIT"
  | "COMPACT_RATIO";

export type RnkCp007CategoryCompositionEditorialV2Question =
  RnkCp007CategoryCompositionEditorialQuestion & {
    readonly reviewMetadata: RnkCp007CategoryCompositionEditorialQuestion["reviewMetadata"] & {
      readonly surfaceProfile: {
        readonly version: typeof RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V2_VERSION;
        readonly style: RnkCp007CategorySurfaceStyle;
      };
    };
  };

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function categoryTotal(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryATotal : state.categoryBTotal;
}

function targetAdjustment(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return state.targetCategory === category ? 1 : 0;
}

function styleFor(seed: number): RnkCp007CategorySurfaceStyle {
  return (["CANONICAL", "RANKED_LIST", "ORDER_OF_MERIT", "COMPACT_RATIO"] as const)[seed % 4]!;
}

function sidePhrase(side: RnkCp007Side): string {
  return side === "AHEAD" ? "ahead of" : "after";
}

function renderStem(
  question: RnkCp007CategoryCompositionEditorialQuestion,
  style: RnkCp007CategorySurfaceStyle,
): string {
  const partition = RNK_PARTITION_SCHEMES_V2.find((entry) => entry.id === question.reviewMetadata.partitionId);
  if (!partition) throw new Error(`Unknown partition ${question.reviewMetadata.partitionId}`);

  const state = question.state;
  const labelA = partition.categories[0].en;
  const labelB = partition.categories[1].en;
  const whole = partition.wholeLabels.en;
  const targetLabel = state.targetCategory === "A" ? labelA : labelB;
  const evidenceLabel = question.evidence.category === "A" ? labelA : labelB;
  const requestedLabel = question.reviewMetadata.requestedCategory === "A" ? labelA : labelB;
  const divisor = gcd(state.categoryATotal, state.categoryBTotal);
  const ratioA = state.categoryATotal / divisor;
  const ratioB = state.categoryBTotal / divisor;
  const rank = ordinal(state.targetRankFromTop);
  const name = question.reviewMetadata.targetName;
  const evidenceSide = sidePhrase(question.evidence.side);
  const requestedSide = question.reviewMetadata.requestedSide === "AHEAD" ? "ahead of" : "after";

  if (style === "RANKED_LIST") {
    return [
      `A ranked list contains ${state.total} ${whole}.`,
      `The ratio of ${labelA} to ${labelB} is ${ratioA}:${ratioB}.`,
      `${name} is one of the ${targetLabel} and occupies ${rank} position from the top.`,
      `Exactly ${question.evidence.count} ${evidenceLabel} are ${evidenceSide} ${name}.`,
      `How many ${requestedLabel} are ${requestedSide} ${name}?`,
    ].join(" ");
  }

  if (style === "ORDER_OF_MERIT") {
    return [
      `Among ${state.total} ${whole} arranged in order of merit, ${labelA} and ${labelB} are in the ratio ${ratioA}:${ratioB}.`,
      `${name} is one of the ${targetLabel} and stands ${rank} from the top.`,
      `Of the ${evidenceLabel}, exactly ${question.evidence.count} are ${evidenceSide} ${name}.`,
      `Find the number of ${requestedLabel} ranked ${requestedSide} ${name}.`,
    ].join(" ");
  }

  if (style === "COMPACT_RATIO") {
    return [
      `${state.total} ${whole} are ranked from top to bottom. ${labelA} and ${labelB} are in the ratio ${ratioA}:${ratioB}.`,
      `${name} is one of the ${targetLabel} and is ${rank} from the top.`,
      `${question.evidence.count} ${evidenceLabel} are ${evidenceSide} ${name}.`,
      `How many ${requestedLabel} are ${requestedSide} ${name}?`,
    ].join(" ");
  }

  return question.stem;
}

function renderExplanation(question: RnkCp007CategoryCompositionEditorialQuestion): string {
  const partition = RNK_PARTITION_SCHEMES_V2.find((entry) => entry.id === question.reviewMetadata.partitionId);
  if (!partition) throw new Error(`Unknown partition ${question.reviewMetadata.partitionId}`);
  const state = question.state;
  const labelA = partition.categories[0].en;
  const labelB = partition.categories[1].en;
  const evidenceLabel = question.evidence.category === "A" ? labelA : labelB;
  const requestedLabel = question.reviewMetadata.requestedCategory === "A" ? labelA : labelB;
  const totalAhead = state.targetRankFromTop - 1;
  const evidenceAdjustment = targetAdjustment(state, question.evidence.category);
  const evidenceAhead = question.evidence.side === "AHEAD"
    ? question.evidence.count
    : categoryTotal(state, question.evidence.category) - question.evidence.count - evidenceAdjustment;
  const requestedAhead = totalAhead - evidenceAhead;
  const evidenceConversion = question.evidence.side === "AHEAD"
    ? `${question.evidence.count} ${evidenceLabel} are already ahead.`
    : `The number of ${evidenceLabel} ahead = ${categoryTotal(state, question.evidence.category)} - ${question.evidence.count}${evidenceAdjustment ? " - 1 (the target)" : ""} = ${evidenceAhead}.`;

  if (question.reviewMetadata.requestedSide === "AHEAD") {
    return `The ratio gives ${state.categoryATotal} ${labelA} and ${state.categoryBTotal} ${labelB}. Rank ${state.targetRankFromTop} means ${totalAhead} people are ahead. ${evidenceConversion} Therefore, the number of ${requestedLabel} ahead = ${totalAhead} - ${evidenceAhead} = ${question.answer}.`;
  }

  const requestedAdjustment = targetAdjustment(state, question.reviewMetadata.requestedCategory);
  return `The ratio gives ${state.categoryATotal} ${labelA} and ${state.categoryBTotal} ${labelB}. Rank ${state.targetRankFromTop} means ${totalAhead} people are ahead. ${evidenceConversion} Hence, the number of ${requestedLabel} ahead = ${requestedAhead}. The number of ${requestedLabel} after = ${categoryTotal(state, question.reviewMetadata.requestedCategory)} - ${requestedAhead}${requestedAdjustment ? " - 1 (the target)" : ""} = ${question.answer}.`;
}

export function generateRnkCp007CategoryCompositionQuestion(
  mode: RnkCp007CategoryCompositionMode,
  logicalSeed: number,
  requestedAnswerIndex: 0 | 1 | 2 | 3 = (logicalSeed % 4) as 0 | 1 | 2 | 3,
): RnkCp007CategoryCompositionEditorialV2Question {
  const question = generateV12Question(mode, logicalSeed, requestedAnswerIndex);
  const style = styleFor(logicalSeed);
  const stem = renderStem(question, style);
  const explanation = renderExplanation(question);
  return {
    ...question,
    stem,
    explanation,
    mathematicalFingerprint: `${question.mathematicalFingerprint}:SURFACE_V2:${style}:POLISHED`,
    reviewMetadata: {
      ...question.reviewMetadata,
      surfaceProfile: {
        version: RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V2_VERSION,
        style,
      },
    },
  };
}
