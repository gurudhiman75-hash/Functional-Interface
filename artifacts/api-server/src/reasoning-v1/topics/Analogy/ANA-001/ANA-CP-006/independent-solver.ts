import {
  letterFromPosition,
  letterPosition,
  oppositeLetter,
  rotateCluster,
  shiftLetter,
} from "../foundation/alphabet";
import type { AnaCp006RuleId } from "./question-language.en";
import {
  ANA_CP006_RULES,
  sameClusterContext,
  type ClusterRuleContext,
  type DeletePositionRule,
  type InsertDerivation,
  type InsertionRule,
  type ParityProfile,
} from "./rule-definitions";

export interface ClusterPair {
  left: string;
  right: string;
}

export interface ClusterRuleMatch {
  ruleId: AnaCp006RuleId;
  context: ClusterRuleContext;
  priority: number;
}

function normalize(cluster: string): string | null {
  const value = cluster.trim().toUpperCase();
  return /^[A-Z]+$/.test(value) ? value : null;
}

function vectorShift(cluster: string, shifts: readonly number[]): string | null {
  const value = normalize(cluster);
  if (!value || value.length !== shifts.length) return null;
  const output = [...value].map((letter, index) => shiftLetter(letter, shifts[index])).join("");
  return output === value ? null : output;
}

function reverse(value: string): string {
  return [...value].reverse().join("");
}

function adjacentSwap(value: string): string {
  const letters = [...value];
  for (let index = 0; index + 1 < letters.length; index += 2) {
    [letters[index], letters[index + 1]] = [letters[index + 1], letters[index]];
  }
  return letters.join("");
}

function endSwap(value: string): string {
  const letters = [...value];
  [letters[0], letters[letters.length - 1]] = [letters[letters.length - 1], letters[0]];
  return letters.join("");
}

function opposite(value: string): string {
  return [...value].map(oppositeLetter).join("");
}

function parityShift(value: string, shift: number, odd: boolean): string {
  return [...value]
    .map((letter, index) => ((index % 2 === 0) === odd ? shiftLetter(letter, shift) : letter))
    .join("");
}

function blockSwap(value: string): string {
  const half = Math.floor(value.length / 2);
  return value.length % 2 === 0
    ? value.slice(half) + value.slice(0, half)
    : value.slice(half + 1) + value[half] + value.slice(0, half);
}

function reverseBlocks(value: string): string {
  const half = Math.floor(value.length / 2);
  return value.length % 2 === 0
    ? reverse(value.slice(0, half)) + reverse(value.slice(half))
    : reverse(value.slice(0, half)) + value[half] + reverse(value.slice(half + 1));
}

function regroup(value: string, profile: ParityProfile): string {
  const odd = [...value].filter((_, index) => index % 2 === 0);
  const even = [...value].filter((_, index) => index % 2 === 1);
  const reversed = (items: string[]) => [...items].reverse();
  switch (profile) {
    case "ODD_FORWARD_EVEN_FORWARD": return [...odd, ...even].join("");
    case "EVEN_FORWARD_ODD_FORWARD": return [...even, ...odd].join("");
    case "ODD_FORWARD_EVEN_REVERSE": return [...odd, ...reversed(even)].join("");
    case "EVEN_FORWARD_ODD_REVERSE": return [...even, ...reversed(odd)].join("");
    case "ODD_REVERSE_EVEN_FORWARD": return [...reversed(odd), ...even].join("");
    case "EVEN_REVERSE_ODD_FORWARD": return [...reversed(even), ...odd].join("");
  }
}

function deletionIndex(length: number, rule: DeletePositionRule): number | null {
  switch (rule) {
    case "FIRST": return 0;
    case "LAST": return length - 1;
    case "SECOND": return length >= 3 ? 1 : null;
    case "PENULTIMATE": return length >= 3 ? length - 2 : null;
    case "MIDDLE": return length % 2 === 1 ? Math.floor(length / 2) : null;
    case "LEFT_MIDDLE": return length % 2 === 0 ? length / 2 - 1 : null;
    case "RIGHT_MIDDLE": return length % 2 === 0 ? length / 2 : null;
  }
}

function insertionIndex(length: number, rule: InsertionRule): number {
  switch (rule) {
    case "START": return 0;
    case "END": return length;
    case "AFTER_FIRST": return 1;
    case "BEFORE_LAST": return length - 1;
    case "MIDDLE": return Math.ceil(length / 2);
  }
}

function insertedLetter(value: string, derivation: InsertDerivation): string | null {
  switch (derivation) {
    case "SUCCESSOR_OF_FIRST": return shiftLetter(value[0], 1);
    case "PREDECESSOR_OF_LAST": return shiftLetter(value[value.length - 1], -1);
    case "OPPOSITE_OF_MIDDLE":
      return value.length % 2 === 1 ? oppositeLetter(value[Math.floor(value.length / 2)]) : null;
    case "MIDPOINT_FIRST_LAST": {
      const sum = letterPosition(value[0]) + letterPosition(value[value.length - 1]);
      return sum % 2 === 0 ? letterFromPosition(sum / 2) : null;
    }
  }
}

function neighbours(value: string, nextFirst: boolean): string {
  return [...value]
    .map((letter) => {
      const previous = shiftLetter(letter, -1);
      const next = shiftLetter(letter, 1);
      return nextFirst ? next + previous : previous + next;
    })
    .join("");
}

function twoStage(value: string, context: Extract<ClusterRuleContext, { kind: "TWO_STAGE" }>): string | null {
  switch (context.profile) {
    case "OPPOSITE_ROTATE_LEFT":
      return context.count ? rotateCluster(opposite(value), context.count) : null;
    case "OPPOSITE_ROTATE_RIGHT":
      return context.count ? rotateCluster(opposite(value), -context.count) : null;
    case "ADJACENT_SWAP_UNIFORM_SHIFT":
      return context.shift
        ? [...adjacentSwap(value)].map((letter) => shiftLetter(letter, context.shift!)).join("")
        : null;
    case "FIRST_LAST_SWAP_OPPOSITE":
      return opposite(endSwap(value));
    case "ODD_SHIFT_HALF_SWAP":
      return context.shift ? blockSwap(parityShift(value, context.shift, true)) : null;
    case "PARITY_REGROUP_UNIFORM_SHIFT":
      return context.shift && context.parityProfile
        ? [...regroup(value, context.parityProfile)].map((letter) => shiftLetter(letter, context.shift!)).join("")
        : null;
  }
}

export function independentlyApplyClusterRule(
  ruleId: AnaCp006RuleId,
  context: ClusterRuleContext,
  cluster: string,
): string | null {
  const value = normalize(cluster);
  if (!value) return null;

  let output: string | null = null;
  switch (ruleId) {
    case "CLUSTER_UNIFORM_SHIFT_FORWARD":
      output = context.kind === "UNIFORM_SHIFT" && context.shift > 0
        ? vectorShift(value, Array(value.length).fill(context.shift))
        : null;
      break;
    case "CLUSTER_UNIFORM_SHIFT_BACKWARD":
      output = context.kind === "UNIFORM_SHIFT" && context.shift < 0
        ? vectorShift(value, Array(value.length).fill(context.shift))
        : null;
      break;
    case "CLUSTER_POSITIONAL_FIXED_SHIFTS":
      output = context.kind === "POSITION_VECTOR" ? vectorShift(value, context.shifts) : null;
      break;
    case "CLUSTER_ALTERNATING_SIGN_SHIFT":
      output = context.kind === "ALTERNATING_SIGN"
        ? vectorShift(value, Array.from({ length: value.length }, (_, index) => context.magnitude * (index % 2 === 0 ? context.firstSign : -context.firstSign)))
        : null;
      break;
    case "CLUSTER_INCREASING_SHIFT":
      output = context.kind === "PROGRESSIVE_SHIFT" && context.deltaMagnitude === 1
        ? vectorShift(value, Array.from({ length: value.length }, (_, index) => context.sign * (context.startMagnitude + index)))
        : null;
      break;
    case "CLUSTER_DECREASING_SHIFT":
      output = context.kind === "PROGRESSIVE_SHIFT" && context.deltaMagnitude === -1
        ? vectorShift(value, Array.from({ length: value.length }, (_, index) => context.sign * (context.startMagnitude - index)))
        : null;
      break;
    case "CLUSTER_REVERSE":
      output = context.kind === "FIXED" ? reverse(value) : null;
      break;
    case "CLUSTER_ADJACENT_PAIR_SWAP":
      output = context.kind === "FIXED" ? adjacentSwap(value) : null;
      break;
    case "CLUSTER_FIRST_LAST_SWAP":
      output = context.kind === "FIXED" ? endSwap(value) : null;
      break;
    case "CLUSTER_ROTATE_LEFT":
      output = context.kind === "ROTATION" ? rotateCluster(value, context.count) : null;
      break;
    case "CLUSTER_ROTATE_RIGHT":
      output = context.kind === "ROTATION" ? rotateCluster(value, -context.count) : null;
      break;
    case "CLUSTER_OPPOSITE_SUBSTITUTION":
      output = context.kind === "FIXED" ? opposite(value) : null;
      break;
    case "CLUSTER_ODD_POSITION_TRANSFORM":
      output = context.kind === "POSITION_CLASS_SHIFT" ? parityShift(value, context.shift, true) : null;
      break;
    case "CLUSTER_EVEN_POSITION_TRANSFORM":
      output = context.kind === "POSITION_CLASS_SHIFT" ? parityShift(value, context.shift, false) : null;
      break;
    case "CLUSTER_REVERSE_THEN_SHIFT":
      output = context.kind === "ORDERED_POSITION_VECTOR" ? vectorShift(reverse(value), context.shifts) : null;
      break;
    case "CLUSTER_SHIFT_THEN_REVERSE": {
      const shifted = context.kind === "ORDERED_POSITION_VECTOR" ? vectorShift(value, context.shifts) : null;
      output = shifted ? reverse(shifted) : null;
      break;
    }
    case "CLUSTER_DELETE_POSITION": {
      if (context.kind !== "DELETE_POSITION") break;
      const index = deletionIndex(value.length, context.positionRule);
      output = index === null ? null : value.slice(0, index) + value.slice(index + 1);
      break;
    }
    case "CLUSTER_INSERT_DERIVED_LETTER": {
      if (context.kind !== "INSERT_DERIVED") break;
      const letter = insertedLetter(value, context.derivation);
      if (!letter) break;
      const index = insertionIndex(value.length, context.insertionRule);
      output = value.slice(0, index) + letter + value.slice(index);
      break;
    }
    case "CLUSTER_NEIGHBOUR_EXPANSION":
      output = context.kind === "NEIGHBOUR_EXPANSION" ? neighbours(value, context.order === "NEXT_PREV") : null;
      break;
    case "CLUSTER_TWO_STAGE_MIXED":
      output = context.kind === "TWO_STAGE" ? twoStage(value, context) : null;
      break;
    case "CLUSTER_HALF_BLOCK_SWAP":
      output = context.kind === "FIXED" ? blockSwap(value) : null;
      break;
    case "CLUSTER_REVERSE_EACH_BLOCK":
      output = context.kind === "FIXED" ? reverseBlocks(value) : null;
      break;
    case "CLUSTER_PARITY_REGROUP":
      output = context.kind === "PARITY_REGROUP" ? regroup(value, context.profile) : null;
      break;
    case "CLUSTER_ALPHABETICAL_SORT": {
      if (context.kind !== "ALPHABETICAL_SORT") break;
      const letters = [...value].sort();
      if (context.direction === "DESC") letters.reverse();
      output = letters.join("");
      break;
    }
  }

  return output && output !== value ? output : null;
}

export function solveClusterRule(ruleId: AnaCp006RuleId, context: ClusterRuleContext, cluster: string): string {
  const rule = ANA_CP006_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown ANA-CP-006 rule: ${ruleId}`);
  if (!rule.supportedLengths.includes(cluster.length)) {
    throw new Error(`${ruleId} does not support cluster length ${cluster.length}.`);
  }
  const output = independentlyApplyClusterRule(ruleId, context, cluster);
  if (!output) throw new Error(`${ruleId} is invalid for cluster ${cluster}.`);
  return output;
}

export function matchingClusterRules(pairs: readonly ClusterPair[]): ClusterRuleMatch[] {
  if (pairs.length === 0) return [];
  const inputLength = pairs[0].left.length;
  if (pairs.some((pair) => pair.left.length !== inputLength)) return [];

  return ANA_CP006_RULES.flatMap((rule) => {
    if (!rule.supportedLengths.includes(inputLength)) return [];
    return rule.contextsForLength(inputLength)
      .filter((context) => pairs.every((pair) => independentlyApplyClusterRule(rule.id, context, pair.left) === pair.right))
      .map((context) => ({ ruleId: rule.id, context, priority: rule.priority }));
  });
}

export function verifyClusterTransfer(
  ruleId: AnaCp006RuleId,
  context: ClusterRuleContext,
  source: ClusterPair,
  target: ClusterPair,
): boolean {
  return matchingClusterRules([source, target]).some(
    (match) => match.ruleId === ruleId && sameClusterContext(match.context, context),
  );
}

export function contextsForClusterRule(ruleId: AnaCp006RuleId, length: number): readonly ClusterRuleContext[] {
  const rule = ANA_CP006_RULES.find((entry) => entry.id === ruleId);
  if (!rule || !rule.supportedLengths.includes(length)) return [];
  return rule.contextsForLength(length);
}

export function supportedLengthsForClusterRule(ruleId: AnaCp006RuleId): readonly number[] {
  const rule = ANA_CP006_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown ANA-CP-006 rule: ${ruleId}`);
  return rule.supportedLengths;
}
