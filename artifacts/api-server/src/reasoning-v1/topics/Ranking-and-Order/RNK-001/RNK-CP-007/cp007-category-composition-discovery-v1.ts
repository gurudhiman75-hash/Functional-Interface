import { selectRnkPeople } from "../foundation/rnk-object-pool-v2";
import { selectRnkPartitionScheme } from "../foundation/rnk-derived-object-pool-v2";

export const RNK_CP007_CATEGORY_COMPOSITION_VERSION =
  "RNK_CP007_CATEGORY_COMPOSITION_DISCOVERY_V1" as const;

export type RnkCp007CategoryCompositionMode =
  | "TARGET_CATEGORY_AFTER"
  | "OTHER_CATEGORY_AFTER"
  | "UNKNOWN_CATEGORY_AHEAD";

export const RNK_CP007_CATEGORY_COMPOSITION_MODES: readonly RnkCp007CategoryCompositionMode[] = [
  "TARGET_CATEGORY_AFTER",
  "OTHER_CATEGORY_AFTER",
  "UNKNOWN_CATEGORY_AHEAD",
] as const;

export type RnkCp007CategoryId = "A" | "B";

export interface RnkCp007CategoryCompositionState {
  readonly total: number;
  readonly categoryATotal: number;
  readonly categoryBTotal: number;
  readonly targetRankFromTop: number;
  readonly targetCategory: RnkCp007CategoryId;
  readonly knownAheadCategory: RnkCp007CategoryId;
  readonly knownAheadCount: number;
  readonly categoryAAhead: number;
  readonly categoryBAhead: number;
  readonly categoryAAfter: number;
  readonly categoryBAfter: number;
}

export interface RnkCp007CategoryCompositionQuestion {
  readonly discoveryVersion: typeof RNK_CP007_CATEGORY_COMPOSITION_VERSION;
  readonly prototypeId: "CATEGORY_COMPOSITION_AROUND_RANK";
  readonly mode: RnkCp007CategoryCompositionMode;
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly number[];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: number;
  readonly explanation: string;
  readonly mathematicalFingerprint: string;
  readonly state: RnkCp007CategoryCompositionState;
  readonly reviewMetadata: {
    readonly sourceBacked: true;
    readonly permanentQlAllocated: false;
    readonly targetName: string;
    readonly partitionId: string;
    readonly requestedCategory: RnkCp007CategoryId;
    readonly requestedSide: "AHEAD" | "AFTER";
    readonly derivationSteps: 4;
    readonly quantDominant: false;
  };
}

const RATIO_PAIRS = [
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 3],
  [3, 2],
  [3, 4],
  [4, 3],
  [3, 5],
  [5, 3],
] as const;

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function pickInt(seed: number, salt: number, min: number, max: number): number {
  if (max < min) throw new Error(`Invalid integer range ${min}..${max}`);
  return min + (mix32(seed ^ salt) % (max - min + 1));
}

function categoryTotal(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryATotal : state.categoryBTotal;
}

function categoryAhead(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryAAhead : state.categoryBAhead;
}

function categoryAfter(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryAAfter : state.categoryBAfter;
}

function otherCategory(category: RnkCp007CategoryId): RnkCp007CategoryId {
  return category === "A" ? "B" : "A";
}

export function solveRnkCp007CategoryComposition(
  state: RnkCp007CategoryCompositionState,
  category: RnkCp007CategoryId,
  side: "AHEAD" | "AFTER",
): number {
  const totalAhead = state.targetRankFromTop - 1;
  const known = state.knownAheadCount;
  const requestedAhead = category === state.knownAheadCategory ? known : totalAhead - known;
  if (side === "AHEAD") return requestedAhead;
  const targetConsumes = state.targetCategory === category ? 1 : 0;
  return categoryTotal(state, category) - requestedAhead - targetConsumes;
}

function constructState(seed: number): RnkCp007CategoryCompositionState {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const localSeed = mix32(seed ^ Math.imul(attempt + 1, 0x9e3779b1));
    const [ratioA, ratioB] = RATIO_PAIRS[mix32(localSeed ^ 0x52415449) % RATIO_PAIRS.length]!;
    const unit = pickInt(localSeed, 0x554e4954, 12, 30);
    const categoryATotal = ratioA * unit;
    const categoryBTotal = ratioB * unit;
    const total = categoryATotal + categoryBTotal;
    if (total < 45 || total > 180) continue;

    const targetCategory: RnkCp007CategoryId = (mix32(localSeed ^ 0x54415247) & 1) === 0 ? "A" : "B";
    const maxRank = Math.min(total - 8, 48);
    if (maxRank < 10) continue;
    const targetRankFromTop = pickInt(localSeed, 0x52414e4b, 10, maxRank);
    const totalAhead = targetRankFromTop - 1;

    const availableA = categoryATotal - (targetCategory === "A" ? 1 : 0);
    const availableB = categoryBTotal - (targetCategory === "B" ? 1 : 0);
    const minAAhead = Math.max(1, totalAhead - availableB);
    const maxAAhead = Math.min(availableA, totalAhead - 1);
    if (maxAAhead < minAAhead) continue;

    const categoryAAhead = pickInt(localSeed, 0x41484541, minAAhead, maxAAhead);
    const categoryBAhead = totalAhead - categoryAAhead;
    if (categoryAAhead <= 0 || categoryBAhead <= 0) continue;

    const categoryAAfter = categoryATotal - categoryAAhead - (targetCategory === "A" ? 1 : 0);
    const categoryBAfter = categoryBTotal - categoryBAhead - (targetCategory === "B" ? 1 : 0);
    if (categoryAAfter < 2 || categoryBAfter < 2) continue;

    const knownAheadCategory: RnkCp007CategoryId = (mix32(localSeed ^ 0x4b4e4f57) & 1) === 0 ? "A" : "B";
    const knownAheadCount = knownAheadCategory === "A" ? categoryAAhead : categoryBAhead;

    return {
      total,
      categoryATotal,
      categoryBTotal,
      targetRankFromTop,
      targetCategory,
      knownAheadCategory,
      knownAheadCount,
      categoryAAhead,
      categoryBAhead,
      categoryAAfter,
      categoryBAfter,
    };
  }
  throw new Error(`Unable to construct CP007 category-composition state for seed ${seed}`);
}

function queryProfile(
  state: RnkCp007CategoryCompositionState,
  mode: RnkCp007CategoryCompositionMode,
): { category: RnkCp007CategoryId; side: "AHEAD" | "AFTER" } {
  if (mode === "TARGET_CATEGORY_AFTER") return { category: state.targetCategory, side: "AFTER" };
  if (mode === "OTHER_CATEGORY_AFTER") return { category: otherCategory(state.targetCategory), side: "AFTER" };
  return { category: otherCategory(state.knownAheadCategory), side: "AHEAD" };
}

function buildDistractors(
  state: RnkCp007CategoryCompositionState,
  requestedCategory: RnkCp007CategoryId,
  requestedSide: "AHEAD" | "AFTER",
  answer: number,
): number[] {
  const totalAhead = state.targetRankFromTop - 1;
  const requestedTotal = categoryTotal(state, requestedCategory);
  const requestedAhead = categoryAhead(state, requestedCategory);
  const candidates = [
    requestedSide === "AFTER" ? requestedTotal - requestedAhead : state.targetRankFromTop - state.knownAheadCount,
    requestedSide === "AFTER" ? requestedTotal - requestedAhead - 1 : state.targetRankFromTop - 1,
    state.total - state.targetRankFromTop,
    requestedTotal - state.knownAheadCount,
    Math.abs(totalAhead - state.knownAheadCount),
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    answer + 5,
  ].filter((value) => Number.isInteger(value) && value >= 0 && value !== answer);

  const unique = [...new Set(candidates)];
  if (unique.length < 3) throw new Error("Insufficient category-composition distractors");
  return unique.slice(0, 3);
}

function placeOptions(answer: number, distractors: readonly number[], answerIndex: 0 | 1 | 2 | 3): readonly number[] {
  const output: number[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === answerIndex) output.push(answer);
    else output.push(distractors[distractorIndex++]!);
  }
  if (new Set(output).size !== 4) throw new Error("Duplicate options in category-composition question");
  return output;
}

export function generateRnkCp007CategoryCompositionQuestion(
  mode: RnkCp007CategoryCompositionMode,
  seed: number,
  requestedAnswerIndex: 0 | 1 | 2 | 3 = (seed % 4) as 0 | 1 | 2 | 3,
): RnkCp007CategoryCompositionQuestion {
  const state = constructState(seed);
  const profile = queryProfile(state, mode);
  if (profile.side === "AHEAD" && profile.category === state.knownAheadCategory) {
    throw new Error("Direct-lookup category-ahead question is forbidden");
  }

  const partition = selectRnkPartitionScheme(seed);
  const target = selectRnkPeople(seed ^ 0x50455253, 1)[0]!;
  const labelA = partition.categories[0].en;
  const labelB = partition.categories[1].en;
  const targetCategoryLabel = state.targetCategory === "A" ? labelA : labelB;
  const knownAheadLabel = state.knownAheadCategory === "A" ? labelA : labelB;
  const requestedLabel = profile.category === "A" ? labelA : labelB;

  const answer = solveRnkCp007CategoryComposition(state, profile.category, profile.side);
  const directAnswer = profile.side === "AHEAD"
    ? categoryAhead(state, profile.category)
    : categoryAfter(state, profile.category);
  if (answer !== directAnswer) throw new Error("Category-composition independent solver mismatch");

  const ratioGcd = gcd(state.categoryATotal, state.categoryBTotal);
  const ratioA = state.categoryATotal / ratioGcd;
  const ratioB = state.categoryBTotal / ratioGcd;
  const queryText = profile.side === "AFTER"
    ? `How many ${requestedLabel} are ranked after ${target.names.en}?`
    : `How many ${requestedLabel} are ranked ahead of ${target.names.en}?`;

  const stem = [
    `A ranking contains ${state.total} ${partition.wholeLabels.en}.`,
    `The numbers of ${labelA} and ${labelB} are in the ratio ${ratioA}:${ratioB}.`,
    `${target.names.en}, who is among the ${targetCategoryLabel}, is ranked ${state.targetRankFromTop}th from the top.`,
    `Exactly ${state.knownAheadCount} ${knownAheadLabel} are ranked ahead of ${target.names.en}.`,
    queryText,
  ].join(" ");

  const distractors = buildDistractors(state, profile.category, profile.side, answer);
  const options = placeOptions(answer, distractors, requestedAnswerIndex);
  const totalAhead = state.targetRankFromTop - 1;
  const requestedAhead = categoryAhead(state, profile.category);
  const targetAdjustment = state.targetCategory === profile.category ? 1 : 0;
  const explanation = profile.side === "AHEAD"
    ? `${state.targetRankFromTop}th from the top means ${totalAhead} people are ahead. Of them, ${state.knownAheadCount} are ${knownAheadLabel}, so the remaining ${answer} are ${requestedLabel}.`
    : `The ratio gives ${state.categoryATotal} ${labelA} and ${state.categoryBTotal} ${labelB}. ${state.targetRankFromTop}th from the top means ${totalAhead} people are ahead. Therefore ${requestedAhead} ${requestedLabel} are ahead of ${target.names.en}. From the total ${requestedLabel}, subtract those ahead${targetAdjustment ? ` and subtract ${target.names.en} as well` : ""}: ${categoryTotal(state, profile.category)} - ${requestedAhead} - ${targetAdjustment} = ${answer}.`;

  return {
    discoveryVersion: RNK_CP007_CATEGORY_COMPOSITION_VERSION,
    prototypeId: "CATEGORY_COMPOSITION_AROUND_RANK",
    mode,
    seed,
    stem,
    options,
    answerIndex: requestedAnswerIndex,
    answer,
    explanation,
    mathematicalFingerprint: [
      "CATCOMP",
      state.total,
      state.categoryATotal,
      state.categoryBTotal,
      state.targetRankFromTop,
      state.targetCategory,
      state.knownAheadCategory,
      state.knownAheadCount,
      mode,
    ].join(":"),
    state,
    reviewMetadata: {
      sourceBacked: true,
      permanentQlAllocated: false,
      targetName: target.names.en,
      partitionId: partition.id,
      requestedCategory: profile.category,
      requestedSide: profile.side,
      derivationSteps: 4,
      quantDominant: false,
    },
  };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}
