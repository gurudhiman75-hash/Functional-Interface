import type { ThreeStatementId, ThreeStatementSemanticKey } from "./three-statement-foundation.ts";

export const DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS = Object.freeze([
  "NONE",
  "I",
  "II",
  "III",
  "I+II",
  "I+III",
  "II+III",
  "I+II+III",
  "I|II",
  "I|III",
  "I|II+III",
  "II|III",
  "II|I+III",
  "III|I+II",
  "I+II|I+III",
  "I+II|II+III",
  "I+III|II+III",
  "I|II|III",
  "I+II|I+III|II+III",
] as const);

export type DsfCp015ThreeStatementSemanticKey = (typeof DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS)[number];

const SUBSET_UNIVERSE = ["I", "II", "III", "I+II", "I+III", "II+III", "I+II+III"] as const;
const OPTION_KEYS = ["A", "B", "C", "D", "E"] as const;

function parseSubset(value: string): readonly ThreeStatementId[] {
  return value.split("+") as ThreeStatementId[];
}

function minimalSubsets(key: ThreeStatementSemanticKey): readonly (readonly ThreeStatementId[])[] {
  if (key === "NONE") return [];
  return key.split("|").map(parseSubset);
}

function includesAll(superset: readonly ThreeStatementId[], subset: readonly ThreeStatementId[]): boolean {
  return subset.every((id) => superset.includes(id));
}

function sufficiencySignature(key: ThreeStatementSemanticKey): readonly boolean[] {
  const minimal = minimalSubsets(key);
  return SUBSET_UNIVERSE.map((candidate) => {
    const subset = parseSubset(candidate);
    return minimal.some((required) => includesAll(subset, required));
  });
}

function semanticDistance(left: ThreeStatementSemanticKey, right: ThreeStatementSemanticKey): number {
  const a = sufficiencySignature(left);
  const b = sufficiencySignature(right);
  let distance = 0;
  for (let index = 0; index < a.length; index += 1) if (a[index] !== b[index]) distance += 1;
  return distance;
}

function subsetPhrase(subset: readonly ThreeStatementId[]): string {
  if (subset.length === 1) return `Statement ${subset[0]} alone`;
  if (subset.length === 2) return `Statements ${subset[0]} and ${subset[1]} together`;
  return "Statements I, II and III together";
}

export function renderThreeStatementSemanticLabel(key: ThreeStatementSemanticKey): string {
  if (key === "NONE") return "Even Statements I, II and III together are not sufficient.";
  if (key === "I|II|III") return "Any one of Statements I, II or III alone is sufficient.";
  if (key === "I+II|I+III|II+III") return "Any two of Statements I, II and III together are sufficient; no single statement is sufficient.";
  if (key === "I+II+III") return "All three statements together are required to determine the answer.";

  const subsets = minimalSubsets(key);
  if (subsets.length === 1) {
    return `${subsetPhrase(subsets[0]!)} is the minimal sufficient statement set.`;
  }
  if (subsets.length === 2) {
    return `Either ${subsetPhrase(subsets[0]!)} or ${subsetPhrase(subsets[1]!)} is a minimal sufficient statement set.`;
  }
  return `The minimal sufficient statement sets are ${subsets.map(subsetPhrase).join("; ")}.`;
}

function rankedDistractors(correctKey: DsfCp015ThreeStatementSemanticKey): readonly DsfCp015ThreeStatementSemanticKey[] {
  return DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS
    .filter((key) => key !== correctKey)
    .map((key) => ({ key, distance: semanticDistance(correctKey, key), cardinalityGap: Math.abs(minimalSubsets(correctKey).length - minimalSubsets(key).length) }))
    .sort((left, right) => left.distance - right.distance || left.cardinalityGap - right.cardinalityGap || left.key.localeCompare(right.key))
    .slice(0, 4)
    .map((entry) => entry.key);
}

function rotate<T>(values: readonly T[], shift: number): readonly T[] {
  const normalized = ((shift % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

export interface ThreeStatementAnswerOption {
  readonly key: (typeof OPTION_KEYS)[number];
  readonly semanticKey: DsfCp015ThreeStatementSemanticKey;
  readonly text: string;
  readonly isCorrect: boolean;
}

export function buildThreeStatementAnswerOptions(
  correctKey: DsfCp015ThreeStatementSemanticKey,
  seed: number,
): readonly ThreeStatementAnswerOption[] {
  const semanticKeys = rotate([correctKey, ...rankedDistractors(correctKey)], Math.abs(seed) % 5);
  return Object.freeze(semanticKeys.map((semanticKey, index) => Object.freeze({
    key: OPTION_KEYS[index]!,
    semanticKey,
    text: renderThreeStatementSemanticLabel(semanticKey),
    isCorrect: semanticKey === correctKey,
  })));
}

export function isKnownThreeStatementSemanticKey(key: string): key is DsfCp015ThreeStatementSemanticKey {
  return (DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS as readonly string[]).includes(key);
}
