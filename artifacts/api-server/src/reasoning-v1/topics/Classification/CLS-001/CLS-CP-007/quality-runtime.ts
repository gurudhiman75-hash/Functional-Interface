import {
  CLS_CP007_PROTOTYPE_BY_ID,
  clsCp007DomainForLength,
  clsCp007FormatItem,
  clsCp007GapEqualityPattern,
  clsCp007IsVowel,
  clsCp007LetterPosition,
  clsCp007NormalizedGapRatio,
  clsCp007RepeatPattern,
  clsCp007RuleGroups,
  clsCp007RuleValue,
  clsCp007SignedGaps,
} from "./cluster-domain";
import { auditClsCp007Items } from "./runtime";
import type {
  ClsCp007ClusterItem,
  ClsCp007Difficulty,
  ClsCp007DifficultyFeatures,
  ClsCp007Explanation,
  ClsCp007Length,
  ClsCp007PrototypeId,
  ClsCp007RuleId,
  GeneratedClsCp007Question,
} from "./types";

export type QualityClsCp007Question = GeneratedClsCp007Question & {
  readonly qualityDiagnostics: {
    readonly commonNuisanceKey: string;
    readonly commonRawValueCount: number;
    readonly outlierDistance: number;
    readonly commonGroupAttempt: number;
    readonly outlierAttempt: number;
  };
};

function assertSeed(seed: number): void {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`CLS-CP-007 quality seed must be a non-negative safe integer: ${seed}`);
  }
}

function mix(seed: number, salt: number): number {
  let value = (seed + Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function choose<T>(values: readonly T[], seed: number, salt: number): T {
  if (values.length === 0) throw new Error("Cannot choose from an empty CP-007 quality collection.");
  return values[mix(seed, salt) % values.length]!;
}

function ranked<T>(values: readonly T[], seed: number, salt: number): readonly T[] {
  return values
    .map((value, index) => ({ value, rank: mix(seed + index * 131, salt + index * 17) }))
    .sort((left, right) => left.rank - right.rank || String(left.value).localeCompare(String(right.value)))
    .map(({ value }) => value);
}

function shuffled<T>(values: readonly T[], seed: number, salt: number): readonly T[] {
  return ranked(values, seed, salt);
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function vector(value: string): readonly number[] {
  return value.split(",").map(Number);
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

function gapScale(item: ClsCp007ClusterItem): number {
  return clsCp007SignedGaps(item).reduce(
    (current, gap) => greatestCommonDivisor(current, gap),
    0,
  );
}

function vowelCount(item: ClsCp007ClusterItem): number {
  return item.letters.filter(clsCp007IsVowel).length;
}

function uniqueLetterCount(item: ClsCp007ClusterItem): number {
  return new Set(item.letters).size;
}

function allLettersUnique(item: ClsCp007ClusterItem): boolean {
  return uniqueLetterCount(item) === item.letters.length;
}

function hamming(left: readonly string[], right: readonly string[]): number {
  return left.reduce((count, value, index) => count + (value === right[index] ? 0 : 1), 0);
}

function numericDistance(left: readonly number[], right: readonly number[]): number {
  return left.reduce((total, value, index) => total + Math.abs(value - right[index]!), 0);
}

function commonValueAllowed(
  ruleId: ClsCp007RuleId,
  value: string,
  length: ClsCp007Length,
): boolean {
  const numbers = vector(value);
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return numbers.every((entry) => entry !== 0 && Math.abs(entry) <= 8);
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return numbers.every((entry) => entry !== 0 && Math.abs(entry) <= 6) &&
        new Set(numbers.map(Math.abs)).size > 1;
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return new Set(value.split("-")).size < length - 1;
    case "CLUSTER_VOWEL_COUNT": {
      const count = Number(value);
      return count >= 1 && count <= Math.min(3, length - 1);
    }
    case "CLUSTER_REPEAT_PATTERN": {
      const unique = new Set(value.split("-")).size;
      return unique >= 2 && unique < length;
    }
    case "CLUSTER_POSITION_SUM": {
      const total = Number(value);
      return total >= length * 6 && total <= length * 20;
    }
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return value === "MATCH";
    case "CLUSTER_HALF_SUM_DIFFERENCE": {
      const difference = Number(value);
      return difference >= 1 && difference <= 14;
    }
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return numbers.length === 2 && numbers.every((entry) => entry !== 0 && Math.abs(entry) <= 6);
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP": {
      const gap = Number(value);
      return gap >= 1 && gap <= 10;
    }
  }
}

function naturalItem(item: ClsCp007ClusterItem, ruleId: ClsCp007RuleId): boolean {
  if (ruleId === "CLUSTER_REPEAT_PATTERN") {
    const unique = uniqueLetterCount(item);
    return unique >= 2 && unique < item.letters.length &&
      Math.max(...item.letters.map((letter) => item.letters.filter((candidate) => candidate === letter).length)) < item.letters.length;
  }
  return allLettersUnique(item);
}

function nuisanceKey(item: ClsCp007ClusterItem, ruleId: ClsCp007RuleId): string {
  if (ruleId === "CLUSTER_VOWEL_COUNT") {
    return `repeat=${clsCp007RepeatPattern(item)}`;
  }
  if (ruleId === "CLUSTER_REPEAT_PATTERN") {
    return `vowels=${vowelCount(item)};unique=${uniqueLetterCount(item)}`;
  }
  return `vowels=${vowelCount(item)};repeat=${clsCp007RepeatPattern(item)}`;
}

function rawVariationKey(item: ClsCp007ClusterItem, ruleId: ClsCp007RuleId): string {
  if (ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" || ruleId === "CLUSTER_GAP_EQUALITY_PATTERN") {
    return clsCp007SignedGaps(item).join(",");
  }
  return clsCp007RuleValue(item, ruleId);
}

function selectCommonItems(
  domain: readonly ClsCp007ClusterItem[],
  count: number,
  ruleId: ClsCp007RuleId,
  seed: number,
): { readonly items: readonly ClsCp007ClusterItem[]; readonly nuisance: string; readonly rawCount: number } | null {
  const byNuisance = new Map<string, ClsCp007ClusterItem[]>();
  for (const item of domain) {
    if (!naturalItem(item, ruleId)) continue;
    const key = nuisanceKey(item, ruleId);
    const values = byNuisance.get(key) ?? [];
    values.push(item);
    byNuisance.set(key, values);
  }
  const eligible = ranked(
    [...byNuisance.entries()].filter(([, items]) => items.length >= count),
    seed,
    211,
  );
  for (const [nuisance, items] of eligible) {
    const candidates = ranked(items, seed, 223);
    const selected: ClsCp007ClusterItem[] = [];
    const rawValues = new Set<string>();
    if (ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" || ruleId === "CLUSTER_GAP_EQUALITY_PATTERN") {
      for (const candidate of candidates) {
        const raw = rawVariationKey(candidate, ruleId);
        if (rawValues.has(raw)) continue;
        selected.push(candidate);
        rawValues.add(raw);
        if (selected.length === Math.min(2, count)) break;
      }
    }
    for (const candidate of candidates) {
      if (selected.includes(candidate)) continue;
      selected.push(candidate);
      rawValues.add(rawVariationKey(candidate, ruleId));
      if (selected.length === count) break;
    }
    if (selected.length !== count) continue;
    if (
      (ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" || ruleId === "CLUSTER_GAP_EQUALITY_PATTERN") &&
      rawValues.size < 2
    ) {
      continue;
    }
    if (ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO") {
      const scales = new Set(selected.map(gapScale));
      if (scales.size < 2 || Math.max(...scales) <= 1) continue;
    }
    return { items: selected, nuisance, rawCount: rawValues.size };
  }
  return null;
}

function equationError(item: ClsCp007ClusterItem): number {
  const positions = item.letters.map(clsCp007LetterPosition);
  return Math.abs(positions[0]! + positions[1]! - positions[2]!);
}

function pairSums13_24(item: ClsCp007ClusterItem): readonly [number, number] {
  const p = item.letters.map(clsCp007LetterPosition);
  return [p[0]! + p[2]!, p[1]! + p[3]!];
}

function pairSums12_34(item: ClsCp007ClusterItem): readonly [number, number] {
  const p = item.letters.map(clsCp007LetterPosition);
  return [p[0]! + p[1]!, p[2]! + p[3]!];
}

function outlierDistance(
  item: ClsCp007ClusterItem,
  ruleId: ClsCp007RuleId,
  commonValue: string,
): number | null {
  const candidateValue = clsCp007RuleValue(item, ruleId);
  if (candidateValue === commonValue) return null;
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
    case "CLUSTER_ABSOLUTE_GAP_VECTOR": {
      const common = vector(commonValue);
      const candidate = vector(candidateValue);
      const changed = hamming(common.map(String), candidate.map(String));
      const distance = numericDistance(common, candidate);
      return changed >= 1 && changed <= 2 && distance >= 1 && distance <= 4 &&
        candidate.every((entry) => entry !== 0 && Math.abs(entry) <= 10)
        ? distance
        : null;
    }
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO": {
      const common = vector(commonValue);
      const candidate = vector(candidateValue);
      const distance = numericDistance(common, candidate);
      return hamming(common.map(String), candidate.map(String)) <= 2 && distance >= 1 && distance <= 5 &&
        candidate.every((entry) => entry !== 0 && Math.abs(entry) <= 8)
        ? distance
        : null;
    }
    case "CLUSTER_GAP_EQUALITY_PATTERN": {
      const distance = hamming(commonValue.split("-"), candidateValue.split("-"));
      return distance >= 1 && distance <= 2 ? distance : null;
    }
    case "CLUSTER_VOWEL_COUNT": {
      const distance = Math.abs(Number(candidateValue) - Number(commonValue));
      return distance === 1 ? distance : null;
    }
    case "CLUSTER_REPEAT_PATTERN": {
      if (uniqueLetterCount(item) !== new Set(commonValue.split("-")).size) return null;
      const distance = hamming(commonValue.split("-"), candidateValue.split("-"));
      return distance >= 1 && distance <= 2 ? distance : null;
    }
    case "CLUSTER_POSITION_SUM": {
      const distance = Math.abs(Number(candidateValue) - Number(commonValue));
      return distance >= 1 && distance <= 6 ? distance : null;
    }
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS": {
      const error = equationError(item);
      return candidateValue === "NO_MATCH" && error >= 1 && error <= 4 ? error : null;
    }
    case "CLUSTER_HALF_SUM_DIFFERENCE": {
      const distance = Math.abs(Number(candidateValue) - Number(commonValue));
      return distance >= 1 && distance <= 4 ? distance : null;
    }
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS": {
      if (candidateValue !== "NO_MATCH") return null;
      const [first, second] = pairSums13_24(item);
      if (first + second !== 54) return null;
      const firstMiss = Math.abs(first - 27);
      const secondMiss = Math.abs(second - 27);
      return firstMiss === secondMiss && firstMiss >= 1 && firstMiss <= 2 ? firstMiss : null;
    }
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS": {
      if (candidateValue !== "NO_MATCH") return null;
      const [first, second] = pairSums12_34(item);
      if (first + second !== 54) return null;
      const firstMiss = Math.abs(first - 27);
      const secondMiss = Math.abs(second - 27);
      return firstMiss === secondMiss && firstMiss >= 1 && firstMiss <= 2 ? firstMiss : null;
    }
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE": {
      const common = vector(commonValue);
      const candidate = vector(candidateValue);
      const changed = hamming(common.map(String), candidate.map(String));
      const distance = numericDistance(common, candidate);
      return changed === 1 && distance >= 1 && distance <= 2 &&
        candidate.every((entry) => entry !== 0 && Math.abs(entry) <= 8)
        ? distance
        : null;
    }
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP": {
      const distance = Math.abs(Number(candidateValue) - Number(commonValue));
      return Number(candidateValue) >= 1 && distance >= 1 && distance <= 2 ? distance : null;
    }
  }
}

function displayPattern(value: string): string {
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return value
    .split("-")
    .map((entry) => labels[Number(entry) - 1] ?? entry)
    .join("–");
}

function vectorText(value: string, withSign = true): string {
  return vector(value).map((entry) => withSign ? signed(entry) : String(entry)).join(", ");
}

function stemFor(seed: number): string {
  return choose([
    "Which of the following letter-clusters is the odd one out?",
    "All but one of these letter-clusters share the same internal alphabet pattern. Select the different cluster.",
    "Identify the complete letter-cluster that does not follow the common internal relation.",
    "Most of these letter-clusters obey one alphabet structure. Which cluster differs?",
    "Choose the letter-cluster whose internal position pattern is different from the others.",
  ], seed, 401);
}

function coreConceptFor(ruleId: ClsCp007RuleId, commonValue: string): string {
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return `Most clusters have the same ordered signed-gap vector: ${vectorText(commonValue)}.`;
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return `Most clusters have the same ordered absolute-gap vector: ${vectorText(commonValue, false)}.`;
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return `The raw movements may be different sizes, but most clusters reduce to the same signed gap ratio: ${vector(commonValue).map(signed).join(":")}.`;
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return `Most clusters share the same equality arrangement among adjacent gaps: ${displayPattern(commonValue)}.`;
    case "CLUSTER_VOWEL_COUNT": {
      const count = Number(commonValue);
      return `Most clusters contain exactly ${count} ${count === 1 ? "vowel" : "vowels"}.`;
    }
    case "CLUSTER_REPEAT_PATTERN":
      return `Most clusters repeat letters in the same positional form: ${displayPattern(commonValue)}.`;
    case "CLUSTER_POSITION_SUM":
      return `Most clusters have alphabet positions adding to ${commonValue}.`;
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      return "In most three-letter clusters, the first two alphabet positions add exactly to the third.";
    case "CLUSTER_HALF_SUM_DIFFERENCE":
      return `In most four-letter clusters, the absolute difference between the first-pair and second-pair totals is ${commonValue}.`;
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return "In most clusters, positions 1–3 and 2–4 form opposite-letter pairs, so both totals are 27.";
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return "In most clusters, positions 1–2 and 3–4 form two adjacent opposite-letter pairs, so both totals are 27.";
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return `Most clusters have the same signed movement inside the first and second adjacent pair-blocks: ${vectorText(commonValue)}.`;
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return `In most clusters, the two central letters are ${commonValue} alphabet positions apart.`;
  }
}

function evidenceFor(
  item: ClsCp007ClusterItem,
  ruleId: ClsCp007RuleId,
  commonValue: string,
): string {
  const cluster = clsCp007FormatItem(item);
  const positions = item.letters.map(clsCp007LetterPosition);
  const gaps = clsCp007SignedGaps(item);
  const matches = clsCp007RuleValue(item, ruleId) === commonValue;
  const result = matches ? "so it follows the common rule" : "so it does not follow the common rule";
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return `${cluster}: positions ${positions.join(", ")}; signed gaps ${gaps.map(signed).join(", ")}, ${result}.`;
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return `${cluster}: positions ${positions.join(", ")}; absolute gaps ${gaps.map((gap) => Math.abs(gap)).join(", ")}, ${result}.`;
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO": {
      const ratio = clsCp007NormalizedGapRatio(gaps);
      return `${cluster}: signed gaps ${gaps.map(signed).join(", ")}; reduced ratio ${ratio.map(signed).join(":")}, ${result}.`;
    }
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return `${cluster}: signed gaps ${gaps.map(signed).join(", ")}; equality form ${displayPattern(clsCp007GapEqualityPattern(item))}, ${result}.`;
    case "CLUSTER_VOWEL_COUNT": {
      const count = vowelCount(item);
      return `${cluster} contains ${count} ${count === 1 ? "vowel" : "vowels"}, ${result}.`;
    }
    case "CLUSTER_REPEAT_PATTERN":
      return `${cluster} has letter-equality form ${displayPattern(clsCp007RepeatPattern(item))}, ${result}.`;
    case "CLUSTER_POSITION_SUM": {
      const total = positions.reduce((sum, position) => sum + position, 0);
      return `${cluster}: ${positions.join(" + ")} = ${total}, ${result}.`;
    }
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS": {
      const sum = positions[0]! + positions[1]!;
      return `${cluster}: ${positions[0]} + ${positions[1]} = ${sum}${sum === positions[2] ? ` = ${positions[2]}` : ` ≠ ${positions[2]}`}, ${result}.`;
    }
    case "CLUSTER_HALF_SUM_DIFFERENCE": {
      const left = positions[0]! + positions[1]!;
      const right = positions[2]! + positions[3]!;
      return `${cluster}: |(${positions[0]} + ${positions[1]}) - (${positions[2]} + ${positions[3]})| = |${left} - ${right}| = ${Math.abs(left - right)}, ${result}.`;
    }
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS": {
      const [first, second] = pairSums13_24(item);
      return `${cluster}: positions 1+3 total ${first} and positions 2+4 total ${second}, ${result}.`;
    }
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS": {
      const [first, second] = pairSums12_34(item);
      return `${cluster}: positions 1+2 total ${first} and positions 3+4 total ${second}, ${result}.`;
    }
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return `${cluster}: first pair gap ${signed(positions[1]! - positions[0]!)}, second pair gap ${signed(positions[3]! - positions[2]!)}, ${result}.`;
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return `${cluster}: central positions ${positions[1]} and ${positions[2]} differ by ${Math.abs(positions[2]! - positions[1]!)}, ${result}.`;
  }
}

function shortcutFor(ruleId: ClsCp007RuleId): string {
  switch (ruleId) {
    case "CLUSTER_VOWEL_COUNT":
      return "Mark A, E, I, O and U in every cluster, then compare the counts.";
    case "CLUSTER_REPEAT_PATTERN":
      return "Label each new letter A, B, C and so on, reusing a label whenever a letter repeats.";
    case "CLUSTER_POSITION_SUM":
      return "Write the alphabet positions under each cluster and add them from left to right.";
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      return "Add the first two positions and compare the result directly with the third position.";
    case "CLUSTER_HALF_SUM_DIFFERENCE":
      return "Add positions 1–2 and 3–4 separately, then take one absolute difference.";
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return "Check the 1st with the 3rd and the 2nd with the 4th; opposite positions total 27.";
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return "Check positions 1–2 and 3–4 as two blocks; each opposite pair must total 27.";
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return "Subtract within positions 1–2 and 3–4 only; ignore the gap between the blocks.";
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return "Compare only positions 2 and 3, using the absolute difference.";
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return "Write every adjacent position difference and remove the signs before comparing the vectors.";
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return "Write the signed gaps, divide by their common factor, and compare the reduced patterns.";
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return "Compare which gaps are equal before comparing their numerical sizes.";
    default:
      return "Write the alphabet positions and compare adjacent movements in their displayed order.";
  }
}

function trapFor(ruleId: ClsCp007RuleId): string {
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return "Do not drop the signs; forward and backward movements are different.";
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return "Do not reject a cluster only because one movement is reversed; this rule compares magnitudes.";
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return "Do not compare raw gap sizes before reducing by the common factor.";
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return "Do not require identical numbers when the tested structure is only which gaps repeat.";
    case "CLUSTER_REPEAT_PATTERN":
      return "Do not compare the actual letters; compare which positions contain equal letters.";
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return "Do not pair visually convenient letters; use the declared indexes and confirm totals of 27.";
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return "Do not include the middle cross-block gap; only the two stated pair movements matter.";
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return "Do not compare the end letters; the active relation is only between the middle positions.";
    default:
      return "Do not stop at surface resemblance; verify the active calculation for every complete cluster.";
  }
}

function difficultyFor(
  items: readonly ClsCp007ClusterItem[],
  ruleId: ClsCp007RuleId,
  optionCount: 4 | 5,
  supportCount: number,
): { readonly difficulty: ClsCp007Difficulty; readonly features: ClsCp007DifficultyFeatures } {
  const clusterLength = items[0]!.letters.length as ClsCp007Length;
  const arithmeticDemand: 1 | 2 | 3 =
    ruleId === "CLUSTER_VOWEL_COUNT" || ruleId === "CLUSTER_REPEAT_PATTERN"
      ? 1
      : ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" ||
          ruleId === "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS" ||
          ruleId === "CLUSTER_HALF_SUM_DIFFERENCE" ||
          ruleId === "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS" ||
          ruleId === "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"
        ? 3
        : 2;
  const structuralLayers: 1 | 2 | 3 =
    ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" ||
    ruleId === "CLUSTER_HALF_SUM_DIFFERENCE" ||
    ruleId === "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS" ||
    ruleId === "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"
      ? 3
      : ruleId === "CLUSTER_SIGNED_GAP_VECTOR" ||
          ruleId === "CLUSTER_ABSOLUTE_GAP_VECTOR" ||
          ruleId === "CLUSTER_GAP_EQUALITY_PATTERN" ||
          ruleId === "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS" ||
          ruleId === "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE"
        ? 2
        : 1;
  const directionSensitive =
    ruleId === "CLUSTER_SIGNED_GAP_VECTOR" ||
    ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" ||
    ruleId === "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE";
  const maximumPosition = Math.max(...items.flatMap((item) => item.letters.map(clsCp007LetterPosition)));
  const score = arithmeticDemand + (clusterLength - 3) + (structuralLayers - 1) +
    (directionSensitive ? 1 : 0) + (optionCount === 5 ? 1 : 0) + (supportCount > 1 ? 1 : 0);
  return {
    difficulty: score <= 3 ? "EASY" : score <= 6 ? "MEDIUM" : "HARD",
    features: {
      optionCount,
      clusterLength,
      arithmeticDemand,
      structuralLayers,
      directionSensitive,
      competingSupportCount: supportCount,
      maximumPosition,
      score,
    },
  };
}

export function generateClsCp007QualityQuestion(
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): QualityClsCp007Question {
  assertSeed(seed);
  if (optionCount !== 4 && optionCount !== 5) {
    throw new Error(`CLS-CP-007 quality option count must be 4 or 5: ${optionCount}`);
  }
  const prototype = CLS_CP007_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-007 quality prototype: ${prototypeId}`);
  const ruleId = choose(prototype.allowedRuleIds, seed, 101);
  const length = choose(prototype.allowedLengths, seed, 103);
  const commonCount = optionCount - 1;
  const groups = ranked(
    [...clsCp007RuleGroups(length, ruleId).entries()].filter(
      ([value, items]) => items.length >= commonCount && commonValueAllowed(ruleId, value, length),
    ),
    seed,
    107,
  );

  for (let commonGroupAttempt = 0; commonGroupAttempt < groups.length; commonGroupAttempt += 1) {
    const [commonValue, commonDomain] = groups[commonGroupAttempt]!;
    const selected = selectCommonItems(
      commonDomain,
      commonCount,
      ruleId,
      seed + commonGroupAttempt * 1_009,
    );
    if (!selected) continue;
    const outlierCandidates = clsCp007DomainForLength(length)
      .filter((item) => naturalItem(item, ruleId) && nuisanceKey(item, ruleId) === selected.nuisance)
      .map((item) => ({ item, distance: outlierDistance(item, ruleId, commonValue) }))
      .filter((entry): entry is { item: ClsCp007ClusterItem; distance: number } => entry.distance !== null)
      .sort((left, right) => left.distance - right.distance ||
        mix(seed + clsCp007FormatItem(left.item).charCodeAt(0), 503) -
        mix(seed + clsCp007FormatItem(right.item).charCodeAt(0), 503));

    for (let outlierAttempt = 0; outlierAttempt < Math.min(300, outlierCandidates.length); outlierAttempt += 1) {
      const outlier = outlierCandidates[outlierAttempt]!;
      const items = shuffled(
        [...selected.items, outlier.item],
        seed + commonGroupAttempt * 10_007 + outlierAttempt * 97,
        521,
      );
      const correctIndex = items.findIndex((item) => item === outlier.item);
      const ambiguityAudit = auditClsCp007Items(items, ruleId, correctIndex);
      if (
        ambiguityAudit.result !== "UNIQUE" ||
        ambiguityAudit.answerIndex !== correctIndex ||
        !ambiguityAudit.intendedRuleSupported
      ) {
        continue;
      }
      const options = items.map(clsCp007FormatItem);
      const evidence = items.map((item) => evidenceFor(item, ruleId, commonValue));
      const { difficulty, features } = difficultyFor(
        items,
        ruleId,
        optionCount,
        ambiguityAudit.candidateSupports.length,
      );
      const explanation: ClsCp007Explanation = {
        coreConcept: [coreConceptFor(ruleId, commonValue)],
        stepByStep: [...evidence, `Therefore, ${options[correctIndex]} is the odd one out.`],
        examSpeedShortcut: [shortcutFor(ruleId)],
        commonTrapWarning: [trapFor(ruleId)],
      };
      return {
        checkpointId: "CLS-CP-007",
        prototypeId,
        permanentQlId: null,
        seed,
        task: "FIND_ODD_LETTER_CLUSTER",
        clusterLength: length,
        stem: stemFor(seed + commonGroupAttempt * 10_007 + outlierAttempt),
        items,
        options,
        correctIndex,
        answer: options[correctIndex]!,
        intendedRuleId: ruleId,
        intendedRuleValue: commonValue,
        evidenceByOption: evidence,
        ambiguityAudit,
        difficulty,
        difficultyFeatures: features,
        explanation,
        reviewOnly: true,
        questionStudioVisible: false,
        metadata: {
          datasetVersion: "CLS-CP007-LETTER-CLUSTER-DOMAIN-v1",
          runtimeVersion: "cls-cp007-discovery-v1",
          locale: "en-IN",
          optionCount,
          sourcePrototypeSeed: seed + commonGroupAttempt * 10_007 + outlierAttempt,
          sourceSaturationStatus: "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN",
        },
        lifecycle: {
          permanentQlId: null,
          reviewStatus: "UNREVIEWED_DISCOVERY",
          questionBankStatus: "NOT_STORED",
          testEligibility: "INELIGIBLE",
          publiclyPublishable: false,
          questionStudioDiscoverable: false,
        },
        qualityDiagnostics: {
          commonNuisanceKey: selected.nuisance,
          commonRawValueCount: selected.rawCount,
          outlierDistance: outlier.distance,
          commonGroupAttempt,
          outlierAttempt,
        },
      };
    }
  }
  throw new Error(`Unable to generate a source-shaped CP-007 quality question for ${prototypeId}/${seed}.`);
}
