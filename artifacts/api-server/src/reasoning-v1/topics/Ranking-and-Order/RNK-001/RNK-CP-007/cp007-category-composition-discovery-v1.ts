import { selectRnkPeople } from "../foundation/rnk-object-pool-v2";
import { selectRnkPartitionScheme } from "../foundation/rnk-derived-object-pool-v2";

export const RNK_CP007_CATEGORY_COMPOSITION_VERSION =
  "RNK_CP007_CATEGORY_COMPOSITION_DISCOVERY_V1_1" as const;

export type RnkCp007CategoryCompositionMode =
  | "TARGET_CATEGORY_AFTER"
  | "OTHER_CATEGORY_AFTER"
  | "TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER"
  | "OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER";

export const RNK_CP007_CATEGORY_COMPOSITION_MODES: readonly RnkCp007CategoryCompositionMode[] = [
  "TARGET_CATEGORY_AFTER",
  "OTHER_CATEGORY_AFTER",
  "TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER",
  "OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER",
] as const;

export type RnkCp007CategoryId = "A" | "B";
export type RnkCp007Side = "AHEAD" | "AFTER";

export interface RnkCp007CategoryCompositionState {
  readonly total: number;
  readonly categoryATotal: number;
  readonly categoryBTotal: number;
  readonly targetRankFromTop: number;
  readonly targetCategory: RnkCp007CategoryId;
  readonly categoryAAhead: number;
  readonly categoryBAhead: number;
  readonly categoryAAfter: number;
  readonly categoryBAfter: number;
}

export interface RnkCp007CategoryEvidence {
  readonly category: RnkCp007CategoryId;
  readonly side: RnkCp007Side;
  readonly count: number;
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
  readonly evidence: RnkCp007CategoryEvidence;
  readonly reviewMetadata: {
    readonly sourceBacked: true;
    readonly permanentQlAllocated: false;
    readonly targetName: string;
    readonly partitionId: string;
    readonly requestedCategory: RnkCp007CategoryId;
    readonly requestedSide: RnkCp007Side;
    readonly derivationSteps: 4 | 5;
    readonly allDisplayedEvidenceEssential: true;
    readonly quantDominant: false;
  };
}

const RATIO_PAIRS = [
  [1, 1], [1, 2], [2, 1], [2, 3], [3, 2], [3, 4], [4, 3], [3, 5], [5, 3],
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

function otherCategory(category: RnkCp007CategoryId): RnkCp007CategoryId {
  return category === "A" ? "B" : "A";
}

function categoryTotal(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryATotal : state.categoryBTotal;
}

function categoryCount(
  state: RnkCp007CategoryCompositionState,
  category: RnkCp007CategoryId,
  side: RnkCp007Side,
): number {
  if (category === "A") return side === "AHEAD" ? state.categoryAAhead : state.categoryAAfter;
  return side === "AHEAD" ? state.categoryBAhead : state.categoryBAfter;
}

function targetAdjustment(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return state.targetCategory === category ? 1 : 0;
}

function queryProfile(
  state: RnkCp007CategoryCompositionState,
  mode: RnkCp007CategoryCompositionMode,
): { requestedCategory: RnkCp007CategoryId; requestedSide: RnkCp007Side; evidenceCategory: RnkCp007CategoryId; evidenceSide: RnkCp007Side } {
  const other = otherCategory(state.targetCategory);
  if (mode === "TARGET_CATEGORY_AFTER") {
    return { requestedCategory: state.targetCategory, requestedSide: "AFTER", evidenceCategory: other, evidenceSide: "AHEAD" };
  }
  if (mode === "OTHER_CATEGORY_AFTER") {
    return { requestedCategory: other, requestedSide: "AFTER", evidenceCategory: state.targetCategory, evidenceSide: "AHEAD" };
  }
  if (mode === "TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER") {
    return { requestedCategory: state.targetCategory, requestedSide: "AHEAD", evidenceCategory: other, evidenceSide: "AFTER" };
  }
  return { requestedCategory: other, requestedSide: "AHEAD", evidenceCategory: state.targetCategory, evidenceSide: "AFTER" };
}

export function solveRnkCp007CategoryComposition(
  state: RnkCp007CategoryCompositionState,
  requestedCategory: RnkCp007CategoryId,
  requestedSide: RnkCp007Side,
  evidence: RnkCp007CategoryEvidence,
): number {
  if (evidence.category === requestedCategory) {
    throw new Error("CP007 composition evidence must concern the opposite category");
  }

  const totalAhead = state.targetRankFromTop - 1;
  let evidenceAhead: number;
  if (evidence.side === "AHEAD") {
    evidenceAhead = evidence.count;
  } else {
    evidenceAhead = categoryTotal(state, evidence.category)
      - evidence.count
      - targetAdjustment(state, evidence.category);
  }

  const requestedAhead = totalAhead - evidenceAhead;
  if (requestedSide === "AHEAD") return requestedAhead;
  return categoryTotal(state, requestedCategory)
    - requestedAhead
    - targetAdjustment(state, requestedCategory);
}

function constructState(seed: number): RnkCp007CategoryCompositionState {
  for (let attempt = 0; attempt < 300; attempt += 1) {
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
    const minAAhead = Math.max(2, totalAhead - availableB);
    const maxAAhead = Math.min(availableA, totalAhead - 2);
    if (maxAAhead < minAAhead) continue;

    const categoryAAhead = pickInt(localSeed, 0x41484541, minAAhead, maxAAhead);
    const categoryBAhead = totalAhead - categoryAAhead;
    if (categoryAAhead < 2 || categoryBAhead < 2 || categoryAAhead === categoryBAhead) continue;

    const categoryAAfter = categoryATotal - categoryAAhead - (targetCategory === "A" ? 1 : 0);
    const categoryBAfter = categoryBTotal - categoryBAhead - (targetCategory === "B" ? 1 : 0);
    if (categoryAAfter < 2 || categoryBAfter < 2 || categoryAAfter === categoryBAfter) continue;

    return {
      total,
      categoryATotal,
      categoryBTotal,
      targetRankFromTop,
      targetCategory,
      categoryAAhead,
      categoryBAhead,
      categoryAAfter,
      categoryBAfter,
    };
  }
  throw new Error(`Unable to construct CP007 category-composition state for seed ${seed}`);
}

function boundedDistractors(
  state: RnkCp007CategoryCompositionState,
  requestedCategory: RnkCp007CategoryId,
  requestedSide: RnkCp007Side,
  evidence: RnkCp007CategoryEvidence,
  answer: number,
): number[] {
  const requestedMaximum = requestedSide === "AHEAD"
    ? state.targetRankFromTop - 1
    : categoryTotal(state, requestedCategory) - targetAdjustment(state, requestedCategory);
  const totalAhead = state.targetRankFromTop - 1;
  const evidenceTotal = categoryTotal(state, evidence.category);
  const evidenceAhead = evidence.side === "AHEAD"
    ? evidence.count
    : evidenceTotal - evidence.count - targetAdjustment(state, evidence.category);
  const requestedAhead = totalAhead - evidenceAhead;

  const raw = requestedSide === "AFTER"
    ? [
        categoryTotal(state, requestedCategory) - requestedAhead,
        categoryTotal(state, requestedCategory) - evidence.count - targetAdjustment(state, requestedCategory),
        categoryTotal(state, requestedCategory) - evidenceAhead - targetAdjustment(state, requestedCategory),
        answer + 1,
        answer - 1,
        answer + 2,
        answer - 2,
        answer + 3,
        answer - 3,
      ]
    : [
        totalAhead - evidence.count,
        totalAhead - evidenceAhead + targetAdjustment(state, requestedCategory),
        state.targetRankFromTop - evidenceAhead,
        answer + 1,
        answer - 1,
        answer + 2,
        answer - 2,
        answer + 3,
        answer - 3,
      ];

  const unique = [...new Set(raw)]
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= requestedMaximum && value !== answer)
    .sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer) || a - b);
  if (unique.length < 3) throw new Error("Insufficient bounded category-composition distractors");
  return unique.slice(0, 3);
}

function placeOptions(answer: number, distractors: readonly number[], answerIndex: 0 | 1 | 2 | 3): readonly number[] {
  const output: number[] = [];
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    output.push(index === answerIndex ? answer : distractors[cursor++]!);
  }
  if (new Set(output).size !== 4) throw new Error("Duplicate options in category-composition question");
  return output;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  const mod10 = value % 10;
  if (mod10 === 1) return `${value}st`;
  if (mod10 === 2) return `${value}nd`;
  if (mod10 === 3) return `${value}rd`;
  return `${value}th`;
}

export function generateRnkCp007CategoryCompositionQuestion(
  mode: RnkCp007CategoryCompositionMode,
  seed: number,
  requestedAnswerIndex: 0 | 1 | 2 | 3 = (seed % 4) as 0 | 1 | 2 | 3,
): RnkCp007CategoryCompositionQuestion {
  const state = constructState(seed);
  const profile = queryProfile(state, mode);
  const evidence: RnkCp007CategoryEvidence = {
    category: profile.evidenceCategory,
    side: profile.evidenceSide,
    count: categoryCount(state, profile.evidenceCategory, profile.evidenceSide),
  };
  if (evidence.category === profile.requestedCategory) throw new Error("Decorative composition evidence detected");

  const partition = selectRnkPartitionScheme(seed);
  const target = selectRnkPeople(seed ^ 0x50455253, 1)[0]!;
  const labelA = partition.categories[0].en;
  const labelB = partition.categories[1].en;
  const targetCategoryLabel = state.targetCategory === "A" ? labelA : labelB;
  const evidenceLabel = evidence.category === "A" ? labelA : labelB;
  const requestedLabel = profile.requestedCategory === "A" ? labelA : labelB;

  const answer = solveRnkCp007CategoryComposition(
    state,
    profile.requestedCategory,
    profile.requestedSide,
    evidence,
  );
  const truth = categoryCount(state, profile.requestedCategory, profile.requestedSide);
  if (answer !== truth) throw new Error("Category-composition independent solver mismatch");

  const ratioGcd = gcd(state.categoryATotal, state.categoryBTotal);
  const ratioA = state.categoryATotal / ratioGcd;
  const ratioB = state.categoryBTotal / ratioGcd;
  const evidencePhrase = evidence.side === "AHEAD"
    ? `Exactly ${evidence.count} ${evidenceLabel} are ranked ahead of ${target.names.en}.`
    : `Exactly ${evidence.count} ${evidenceLabel} are ranked after ${target.names.en}.`;
  const queryText = profile.requestedSide === "AFTER"
    ? `How many ${requestedLabel} are ranked after ${target.names.en}?`
    : `How many ${requestedLabel} are ranked ahead of ${target.names.en}?`;

  const stem = [
    `In a ranking of ${state.total} ${partition.wholeLabels.en}, the numbers of ${labelA} and ${labelB} are in the ratio ${ratioA}:${ratioB}.`,
    `${target.names.en}, who is among the ${targetCategoryLabel}, is ranked ${ordinal(state.targetRankFromTop)} from the top.`,
    evidencePhrase,
    queryText,
  ].join(" ");

  const distractors = boundedDistractors(
    state,
    profile.requestedCategory,
    profile.requestedSide,
    evidence,
    answer,
  );
  const options = placeOptions(answer, distractors, requestedAnswerIndex);

  const totalAhead = state.targetRankFromTop - 1;
  const evidenceAhead = evidence.side === "AHEAD"
    ? evidence.count
    : categoryTotal(state, evidence.category) - evidence.count - targetAdjustment(state, evidence.category);
  const requestedAhead = totalAhead - evidenceAhead;
  const evidenceDerivation = evidence.side === "AHEAD"
    ? `${evidence.count} ${evidenceLabel} are already known to be ahead.`
    : `There are ${categoryTotal(state, evidence.category)} ${evidenceLabel} in total, so ${categoryTotal(state, evidence.category)} - ${evidence.count} - ${targetAdjustment(state, evidence.category)} = ${evidenceAhead} of them are ahead.`;

  const explanation = profile.requestedSide === "AHEAD"
    ? `The ratio gives ${state.categoryATotal} ${labelA} and ${state.categoryBTotal} ${labelB}. ${ordinal(state.targetRankFromTop)} from the top means ${totalAhead} people are ahead. ${evidenceDerivation} Hence ${requestedLabel} ahead = ${totalAhead} - ${evidenceAhead} = ${answer}.`
    : `The ratio gives ${state.categoryATotal} ${labelA} and ${state.categoryBTotal} ${labelB}. ${ordinal(state.targetRankFromTop)} from the top means ${totalAhead} people are ahead. ${evidenceDerivation} Therefore ${requestedAhead} ${requestedLabel} are ahead. So ${requestedLabel} after = ${categoryTotal(state, profile.requestedCategory)} - ${requestedAhead}${targetAdjustment(state, profile.requestedCategory) ? " - 1 (the target)" : ""} = ${answer}.`;

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
      "CATCOMPV11",
      state.total,
      state.categoryATotal,
      state.categoryBTotal,
      state.targetRankFromTop,
      state.targetCategory,
      evidence.category,
      evidence.side,
      evidence.count,
      mode,
    ].join(":"),
    state,
    evidence,
    reviewMetadata: {
      sourceBacked: true,
      permanentQlAllocated: false,
      targetName: target.names.en,
      partitionId: partition.id,
      requestedCategory: profile.requestedCategory,
      requestedSide: profile.requestedSide,
      derivationSteps: evidence.side === "AFTER" ? 5 : 4,
      allDisplayedEvidenceEssential: true,
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
