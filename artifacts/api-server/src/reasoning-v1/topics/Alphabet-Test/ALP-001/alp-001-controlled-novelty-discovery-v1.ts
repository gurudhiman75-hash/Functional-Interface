import { applyAlphabetTransform, describeTransformCore } from "./foundation/sequence";
import type { AlpTransformId } from "./types";
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from "../../../shared/reasoning-novelty-governance-v1";

export const ALP_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  "ALP_001_CONTROLLED_NOVELTY_DISCOVERY_V1" as const;

const TRANSFORMS: readonly AlpTransformId[] = [
  "REVERSE_FIRST_HALF",
  "REVERSE_SECOND_HALF",
  "REVERSE_BOTH_HALVES",
  "SWAP_HALVES",
  "ODD_THEN_EVEN",
  "EVEN_THEN_ODD",
  "ALTERNATE_LEFT_RIGHT",
  "ALTERNATE_RIGHT_LEFT",
  "SWAP_ADJACENT_PAIRS",
  "REVERSE_BLOCKS_OF_THREE",
];

function rank(letter: string): number {
  const code = letter.charCodeAt(0) - 64;
  if (code < 1 || code > 26) throw new Error("ALP novelty requires A-Z letters.");
  return code;
}

function transformQlId(transformId: AlpTransformId): string {
  const all: readonly AlpTransformId[] = [
    "REVERSE_ALL",
    "REVERSE_FIRST_HALF",
    "REVERSE_SECOND_HALF",
    "REVERSE_BOTH_HALVES",
    "SWAP_HALVES",
    "ROTATE_TO_START",
    "ODD_THEN_EVEN",
    "EVEN_THEN_ODD",
    "ALTERNATE_LEFT_RIGHT",
    "ALTERNATE_RIGHT_LEFT",
    "REMOVE_VOWELS",
    "REMOVE_CONSONANTS",
    "SWAP_ADJACENT_PAIRS",
    "REVERSE_BLOCKS_OF_THREE",
  ];
  const index = all.indexOf(transformId);
  if (index < 0) throw new Error("Unknown ALP transform.");
  return `ALP-QL-${String(47 + index * 2).padStart(3, "0")}`;
}

function rotate<T>(values: readonly T[], amount: number): T[] {
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function choosePair(sequence: readonly string[], seed: number) {
  const candidates: Array<{
    first: string;
    second: string;
    transformedGap: number;
    originalGap: number;
  }> = [];

  for (let i = 0; i < sequence.length; i += 1) {
    for (let j = i + 2; j < sequence.length; j += 1) {
      const first = sequence[i]!;
      const second = sequence[j]!;
      const transformedGap = j - i - 1;
      const originalGap = Math.abs(rank(first) - rank(second)) - 1;
      if (transformedGap < 1 || transformedGap > 14) continue;
      if (originalGap < 0 || originalGap === transformedGap) continue;
      candidates.push({ first, second, transformedGap, originalGap });
    }
  }

  if (!candidates.length) throw new Error("ALP novelty transform produced no usable interval pair.");
  return candidates[Math.abs(seed * 17 + 11) % candidates.length]!;
}

export interface AlpControlledNovelTransformedGapCandidateV1 {
  readonly candidateId: string;
  readonly provenance: "CONTROLLED_NOVEL";
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly parentQlIds: readonly string[];
  readonly seed: number;
  readonly transformId: AlpTransformId;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: string;
  readonly semanticFingerprint: string;
  readonly solverVerified: true;
  readonly uniqueCorrectAnswer: true;
  readonly plausibleDistractors: true;
  readonly examNatural: true;
  readonly falseHistoricalAttribution: false;
  readonly permanentQlAllocated: false;
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
}

export function generateAlpControlledNovelTransformedGapCandidateV1(
  seed: number,
): AlpControlledNovelTransformedGapCandidateV1 {
  if (!Number.isSafeInteger(seed)) throw new Error("ALP controlled-novel seed must be a safe integer.");

  const transformId = TRANSFORMS[Math.abs(seed) % TRANSFORMS.length]!;
  const sequence = applyAlphabetTransform(transformId);
  if (sequence.length !== 26 || new Set(sequence).size !== 26) {
    throw new Error("ALP controlled-novel lane requires a full 26-letter transformed alphabet.");
  }

  const pair = choosePair(sequence, seed);
  const firstPosition = sequence.indexOf(pair.first) + 1;
  const secondPosition = sequence.indexOf(pair.second) + 1;
  const independentlySolvedGap = Math.abs(firstPosition - secondPosition) - 1;
  if (independentlySolvedGap !== pair.transformedGap) {
    throw new Error("ALP transformed-gap solver disagreement.");
  }

  const distractorPool = [
    pair.originalGap,
    pair.transformedGap + 1,
    pair.transformedGap + 2,
    Math.max(0, pair.transformedGap - 1),
    Math.max(0, pair.originalGap + 1),
  ];
  const distractors = [...new Set(distractorPool)]
    .filter((value) => value !== pair.transformedGap)
    .slice(0, 3);
  if (distractors.length !== 3) throw new Error("ALP transformed-gap distractor construction failed.");

  const optionValues = rotate([pair.transformedGap, ...distractors], seed);
  const options = optionValues.map(String);
  const correctIndex = optionValues.indexOf(pair.transformedGap);
  if (correctIndex < 0 || new Set(options).size !== 4) {
    throw new Error("ALP transformed-gap options must contain four unique choices.");
  }

  const parentTransformQlId = transformQlId(transformId);
  const transformDescription = describeTransformCore(transformId);
  const stem =
    `The English alphabet is rearranged as follows: ${transformDescription}. In the new order, how many letters are there between ${pair.first} and ${pair.second}?`;
  const explanation =
    `After the stated rearrangement, ${pair.first} is at position ${firstPosition} and ${pair.second} is at position ${secondPosition}. The number of letters between them is |${secondPosition} − ${firstPosition}| − 1 = ${pair.transformedGap}.`;

  const noveltyAxes = [
    "MULTI_STAGE_COMPOSITION",
    "REPRESENTATION_LOGIC",
    "VALID_CROSS_FAMILY_COMPOSITION",
    "ANSWER_SEMANTIC",
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: "ALP-NOVEL-TRANSFORMED-GAP-" + seed,
    chapterId: "ALP-001",
    qlId: "ALP-QL-031+" + parentTransformQlId,
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  return {
    candidateId: "ALP-NOVEL-TRANSFORMED-GAP-" + seed,
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    parentQlIds: ["ALP-QL-031", parentTransformQlId],
    seed,
    transformId,
    stem,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    explanation,
    semanticFingerprint: [
      ALP_001_CONTROLLED_NOVELTY_DISCOVERY_V1,
      transformId,
      sequence.join(""),
      pair.first,
      pair.second,
      String(pair.transformedGap),
    ].join("::"),
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    permanentQlAllocated: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
  };
}
