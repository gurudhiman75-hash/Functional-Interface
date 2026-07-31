import {
  CLS_CP007_ALPHABET,
  clsCp007IsVowel,
  clsCp007LetterFromPosition,
  clsCp007LetterPosition,
  clsCp007RepeatPattern,
} from "./cluster-domain";
import type {
  ClsCp007PairItem,
  ClsCp007PairRuleId,
} from "./cluster-pair-types";

export { clsCp007LetterPosition };

export const CLS_CP007_PAIR_RULE_IDS: readonly ClsCp007PairRuleId[] = [
  "CLUSTER_PAIR_POSITION_SUM_VECTOR",
  "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS",
  "CLUSTER_PAIR_SIGNED_SHIFT_VECTOR",
  "CLUSTER_PAIR_ABSOLUTE_SHIFT_VECTOR",
  "CLUSTER_PAIR_DIRECT_REVERSAL_STATUS",
  "CLUSTER_PAIR_REVERSED_OPPOSITE_STATUS",
  "CLUSTER_PAIR_VOWEL_COUNT_SIGNATURE",
  "CLUSTER_PAIR_REPEAT_TOPOLOGY_SIGNATURE",
];

export function clsCp007OppositeLetter(letter: string): string {
  return clsCp007LetterFromPosition(27 - clsCp007LetterPosition(letter));
}

export function clsCp007FormatPairItem(item: ClsCp007PairItem): string {
  return `${item.left.join("")}–${item.right.join("")}`;
}

export function clsCp007ParsePairOption(option: string): ClsCp007PairItem {
  const match = /^([A-Z]{3})–([A-Z]{3})$/.exec(option);
  if (!match) throw new Error(`Invalid CLS-CP-007 cluster-pair option: ${option}`);
  return {
    kind: "LETTER_CLUSTER_PAIR",
    left: [...match[1]!],
    right: [...match[2]!],
  };
}

function positions(letters: readonly string[]): readonly number[] {
  return letters.map(clsCp007LetterPosition);
}

function vowelCount(letters: readonly string[]): number {
  return letters.filter(clsCp007IsVowel).length;
}

function repeatPattern(letters: readonly string[]): string {
  return clsCp007RepeatPattern({ kind: "LETTER_CLUSTER", letters });
}

export function clsCp007PairRuleValue(
  item: ClsCp007PairItem,
  ruleId: ClsCp007PairRuleId,
): string {
  if (item.left.length !== 3 || item.right.length !== 3) {
    throw new Error("CLS-CP-007 cluster-pair Wave 1 requires two three-letter clusters.");
  }
  const left = positions(item.left);
  const right = positions(item.right);
  switch (ruleId) {
    case "CLUSTER_PAIR_POSITION_SUM_VECTOR":
      return left.map((value, index) => value + right[index]!).join(",");
    case "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS":
      return left.every((value, index) => value + right[index]! === 27)
        ? "MATCH"
        : "NO_MATCH";
    case "CLUSTER_PAIR_SIGNED_SHIFT_VECTOR":
      return left.map((value, index) => right[index]! - value).join(",");
    case "CLUSTER_PAIR_ABSOLUTE_SHIFT_VECTOR":
      return left.map((value, index) => Math.abs(right[index]! - value)).join(",");
    case "CLUSTER_PAIR_DIRECT_REVERSAL_STATUS":
      return item.right.join("") === [...item.left].reverse().join("")
        ? "MATCH"
        : "NO_MATCH";
    case "CLUSTER_PAIR_REVERSED_OPPOSITE_STATUS":
      return item.right.join("") === item.left.map(clsCp007OppositeLetter).reverse().join("")
        ? "MATCH"
        : "NO_MATCH";
    case "CLUSTER_PAIR_VOWEL_COUNT_SIGNATURE":
      return `${vowelCount(item.left)},${vowelCount(item.right)}`;
    case "CLUSTER_PAIR_REPEAT_TOPOLOGY_SIGNATURE":
      return `${repeatPattern(item.left)}|${repeatPattern(item.right)}`;
  }
}

export function clsCp007PairNuisanceKey(item: ClsCp007PairItem): string {
  return [
    `vowels=${clsCp007PairRuleValue(item, "CLUSTER_PAIR_VOWEL_COUNT_SIGNATURE")}`,
    `repeat=${clsCp007PairRuleValue(item, "CLUSTER_PAIR_REPEAT_TOPOLOGY_SIGNATURE")}`,
  ].join(";");
}

function allUnique(letters: readonly string[]): boolean {
  return new Set(letters).size === letters.length;
}

function buildCommonPairs(): readonly ClsCp007PairItem[] {
  const pairs: ClsCp007PairItem[] = [];
  for (const first of CLS_CP007_ALPHABET) {
    for (const second of CLS_CP007_ALPHABET) {
      if (second === first) continue;
      for (const third of CLS_CP007_ALPHABET) {
        if (third === first || third === second) continue;
        const left = [first, second, third] as const;
        const right = left.map(clsCp007OppositeLetter);
        if (!allUnique(right)) continue;
        pairs.push({ kind: "LETTER_CLUSTER_PAIR", left, right });
      }
    }
  }
  return pairs;
}

export const CLS_CP007_COMMON_CLUSTER_PAIRS: readonly ClsCp007PairItem[] = buildCommonPairs();

export type ClsCp007PairNearMiss = {
  readonly item: ClsCp007PairItem;
  readonly changedIndexes: readonly [number, number];
  readonly correspondingTotals: readonly [number, number, number];
};

function buildNearMisses(): readonly ClsCp007PairNearMiss[] {
  const misses = new Map<string, ClsCp007PairNearMiss>();
  const indexPairs: readonly (readonly [number, number])[] = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];
  for (const common of CLS_CP007_COMMON_CLUSTER_PAIRS) {
    const rightPositions = positions(common.right);
    for (const [plusIndex, minusIndex] of indexPairs) {
      const mutated = [...rightPositions];
      mutated[plusIndex] += 1;
      mutated[minusIndex] -= 1;
      if (mutated.some((value) => value < 1 || value > 26)) continue;
      const right = mutated.map(clsCp007LetterFromPosition);
      if (!allUnique(right)) continue;
      const item: ClsCp007PairItem = {
        kind: "LETTER_CLUSTER_PAIR",
        left: common.left,
        right,
      };
      if (clsCp007PairNuisanceKey(item) !== clsCp007PairNuisanceKey(common)) continue;
      const leftPositions = positions(item.left);
      const correspondingTotals = leftPositions.map(
        (value, index) => value + mutated[index]!,
      ) as [number, number, number];
      if (correspondingTotals.reduce((total, value) => total + value, 0) !== 81) continue;
      const key = clsCp007FormatPairItem(item);
      misses.set(key, {
        item,
        changedIndexes: [plusIndex, minusIndex],
        correspondingTotals,
      });
    }
  }
  return [...misses.values()];
}

export const CLS_CP007_CLUSTER_PAIR_NEAR_MISSES: readonly ClsCp007PairNearMiss[] =
  buildNearMisses();

const COMMON_BY_NUISANCE = new Map<string, readonly ClsCp007PairItem[]>();
const NEAR_MISS_BY_NUISANCE = new Map<string, readonly ClsCp007PairNearMiss[]>();

for (const pair of CLS_CP007_COMMON_CLUSTER_PAIRS) {
  const key = clsCp007PairNuisanceKey(pair);
  const values = [...(COMMON_BY_NUISANCE.get(key) ?? []), pair];
  COMMON_BY_NUISANCE.set(key, values);
}
for (const nearMiss of CLS_CP007_CLUSTER_PAIR_NEAR_MISSES) {
  const key = clsCp007PairNuisanceKey(nearMiss.item);
  const values = [...(NEAR_MISS_BY_NUISANCE.get(key) ?? []), nearMiss];
  NEAR_MISS_BY_NUISANCE.set(key, values);
}

export function clsCp007ClusterPairNuisanceGroups(): readonly {
  readonly key: string;
  readonly common: readonly ClsCp007PairItem[];
  readonly nearMisses: readonly ClsCp007PairNearMiss[];
}[] {
  return [...COMMON_BY_NUISANCE.entries()]
    .map(([key, common]) => ({
      key,
      common,
      nearMisses: NEAR_MISS_BY_NUISANCE.get(key) ?? [],
    }))
    .filter((group) => group.nearMisses.length > 0)
    .sort((left, right) => left.key.localeCompare(right.key));
}
