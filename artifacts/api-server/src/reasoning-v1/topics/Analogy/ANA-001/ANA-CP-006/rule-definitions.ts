import {
  letterFromPosition,
  letterPosition,
  oppositeLetter,
  rotateCluster,
  shiftLetter,
} from "../foundation/alphabet";
import type { AnaCp006RuleId } from "./question-language.en";

export type Sign = 1 | -1;
export type DeletePositionRule =
  | "FIRST"
  | "LAST"
  | "SECOND"
  | "PENULTIMATE"
  | "MIDDLE"
  | "LEFT_MIDDLE"
  | "RIGHT_MIDDLE";
export type InsertDerivation =
  | "SUCCESSOR_OF_FIRST"
  | "PREDECESSOR_OF_LAST"
  | "OPPOSITE_OF_MIDDLE"
  | "MIDPOINT_FIRST_LAST";
export type InsertionRule = "START" | "END" | "AFTER_FIRST" | "BEFORE_LAST" | "MIDDLE";
export type NeighbourOrder = "PREV_NEXT" | "NEXT_PREV";
export type ParityProfile =
  | "ODD_FORWARD_EVEN_FORWARD"
  | "EVEN_FORWARD_ODD_FORWARD"
  | "ODD_FORWARD_EVEN_REVERSE"
  | "EVEN_FORWARD_ODD_REVERSE"
  | "ODD_REVERSE_EVEN_FORWARD"
  | "EVEN_REVERSE_ODD_FORWARD";
export type AlphabeticalDirection = "ASC" | "DESC";
export type TwoStageProfile =
  | "OPPOSITE_ROTATE_LEFT"
  | "OPPOSITE_ROTATE_RIGHT"
  | "ADJACENT_SWAP_UNIFORM_SHIFT"
  | "FIRST_LAST_SWAP_OPPOSITE"
  | "ODD_SHIFT_HALF_SWAP"
  | "PARITY_REGROUP_UNIFORM_SHIFT";

export type ClusterRuleContext =
  | { kind: "FIXED" }
  | { kind: "UNIFORM_SHIFT"; shift: number }
  | { kind: "POSITION_VECTOR"; shifts: readonly number[] }
  | { kind: "ALTERNATING_SIGN"; magnitude: number; firstSign: Sign }
  | { kind: "PROGRESSIVE_SHIFT"; sign: Sign; startMagnitude: number; deltaMagnitude: 1 | -1 }
  | { kind: "ROTATION"; count: number }
  | { kind: "POSITION_CLASS_SHIFT"; shift: number }
  | { kind: "ORDERED_POSITION_VECTOR"; shifts: readonly number[] }
  | { kind: "DELETE_POSITION"; positionRule: DeletePositionRule }
  | { kind: "INSERT_DERIVED"; derivation: InsertDerivation; insertionRule: InsertionRule }
  | { kind: "NEIGHBOUR_EXPANSION"; order: NeighbourOrder }
  | {
      kind: "TWO_STAGE";
      profile: TwoStageProfile;
      shift?: number;
      count?: number;
      parityProfile?: ParityProfile;
    }
  | { kind: "PARITY_REGROUP"; profile: ParityProfile }
  | { kind: "ALPHABETICAL_SORT"; direction: AlphabeticalDirection };

export interface ClusterRuleDefinition {
  id: AnaCp006RuleId;
  label: string;
  priority: number;
  supportedLengths: readonly number[];
  contextsForLength(length: number): readonly ClusterRuleContext[];
  apply(cluster: string, context: ClusterRuleContext): string | null;
  explain(cluster: string, output: string, context: ClusterRuleContext): string;
}

const lengths = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const CORE_LENGTHS = lengths(3, 8);
const POSITION_LENGTHS = lengths(3, 6);
const STRUCTURAL_LENGTHS = lengths(4, 8);
const BLOCK_LENGTHS = lengths(5, 8);
const EXPANSION_LENGTHS = lengths(2, 4);
const FIXED_CONTEXTS: readonly ClusterRuleContext[] = [{ kind: "FIXED" }];

function normalizeCluster(cluster: string): string | null {
  const normalized = cluster.trim().toUpperCase();
  return /^[A-Z]+$/.test(normalized) ? normalized : null;
}

function nonIdentity(input: string, output: string | null): string | null {
  return output && output !== input ? output : null;
}

function applyShiftVector(cluster: string, shifts: readonly number[]): string | null {
  const normalized = normalizeCluster(cluster);
  if (!normalized || normalized.length !== shifts.length || shifts.some((shift) => !Number.isInteger(shift))) {
    return null;
  }
  return nonIdentity(
    normalized,
    [...normalized].map((letter, index) => shiftLetter(letter, shifts[index])).join(""),
  );
}

function positionVectorTrace(cluster: string, shifts: readonly number[], output: string): string {
  return [...cluster]
    .map((letter, index) => `${letter}${shifts[index] >= 0 ? "+" : ""}${shifts[index]}→${output[index]}`)
    .join(", ");
}

function reverseCluster(cluster: string): string {
  return [...cluster].reverse().join("");
}

function adjacentPairSwap(cluster: string): string {
  const letters = [...cluster];
  for (let index = 0; index + 1 < letters.length; index += 2) {
    [letters[index], letters[index + 1]] = [letters[index + 1], letters[index]];
  }
  return letters.join("");
}

function firstLastSwap(cluster: string): string {
  const letters = [...cluster];
  [letters[0], letters[letters.length - 1]] = [letters[letters.length - 1], letters[0]];
  return letters.join("");
}

function oppositeCluster(cluster: string): string {
  return [...cluster].map(oppositeLetter).join("");
}

function positionClassShift(cluster: string, shift: number, parity: "ODD" | "EVEN"): string {
  return [...cluster]
    .map((letter, index) => {
      const oneBased = index + 1;
      const selected = parity === "ODD" ? oneBased % 2 === 1 : oneBased % 2 === 0;
      return selected ? shiftLetter(letter, shift) : letter;
    })
    .join("");
}

function halfBlockSwap(cluster: string): string {
  const half = Math.floor(cluster.length / 2);
  if (cluster.length % 2 === 0) return cluster.slice(half) + cluster.slice(0, half);
  return cluster.slice(half + 1) + cluster[half] + cluster.slice(0, half);
}

function reverseEachBlock(cluster: string): string {
  const half = Math.floor(cluster.length / 2);
  if (cluster.length % 2 === 0) {
    return reverseCluster(cluster.slice(0, half)) + reverseCluster(cluster.slice(half));
  }
  return reverseCluster(cluster.slice(0, half)) + cluster[half] + reverseCluster(cluster.slice(half + 1));
}

function groupWithDirection(values: string[], reverse: boolean): string[] {
  return reverse ? [...values].reverse() : values;
}

export function parityRegroup(cluster: string, profile: ParityProfile): string {
  const odd = [...cluster].filter((_, index) => index % 2 === 0);
  const even = [...cluster].filter((_, index) => index % 2 === 1);
  switch (profile) {
    case "ODD_FORWARD_EVEN_FORWARD":
      return [...odd, ...even].join("");
    case "EVEN_FORWARD_ODD_FORWARD":
      return [...even, ...odd].join("");
    case "ODD_FORWARD_EVEN_REVERSE":
      return [...odd, ...groupWithDirection(even, true)].join("");
    case "EVEN_FORWARD_ODD_REVERSE":
      return [...even, ...groupWithDirection(odd, true)].join("");
    case "ODD_REVERSE_EVEN_FORWARD":
      return [...groupWithDirection(odd, true), ...even].join("");
    case "EVEN_REVERSE_ODD_FORWARD":
      return [...groupWithDirection(even, true), ...odd].join("");
  }
}

function resolveDeleteIndex(length: number, rule: DeletePositionRule): number | null {
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

function resolveInsertionIndex(length: number, rule: InsertionRule): number {
  switch (rule) {
    case "START": return 0;
    case "END": return length;
    case "AFTER_FIRST": return 1;
    case "BEFORE_LAST": return length - 1;
    case "MIDDLE": return Math.ceil(length / 2);
  }
}

function deriveInsertedLetter(cluster: string, derivation: InsertDerivation): string | null {
  switch (derivation) {
    case "SUCCESSOR_OF_FIRST":
      return shiftLetter(cluster[0], 1);
    case "PREDECESSOR_OF_LAST":
      return shiftLetter(cluster[cluster.length - 1], -1);
    case "OPPOSITE_OF_MIDDLE": {
      if (cluster.length % 2 !== 1) return null;
      return oppositeLetter(cluster[Math.floor(cluster.length / 2)]);
    }
    case "MIDPOINT_FIRST_LAST": {
      const sum = letterPosition(cluster[0]) + letterPosition(cluster[cluster.length - 1]);
      if (sum % 2 !== 0) return null;
      return letterFromPosition(sum / 2);
    }
  }
}

function neighbourExpansion(cluster: string, order: NeighbourOrder): string {
  return [...cluster]
    .map((letter) => {
      const previous = shiftLetter(letter, -1);
      const next = shiftLetter(letter, 1);
      return order === "PREV_NEXT" ? previous + next : next + previous;
    })
    .join("");
}

function applyTwoStage(cluster: string, context: Extract<ClusterRuleContext, { kind: "TWO_STAGE" }>): string | null {
  switch (context.profile) {
    case "OPPOSITE_ROTATE_LEFT": {
      if (!context.count) return null;
      return rotateCluster(oppositeCluster(cluster), context.count);
    }
    case "OPPOSITE_ROTATE_RIGHT": {
      if (!context.count) return null;
      return rotateCluster(oppositeCluster(cluster), -context.count);
    }
    case "ADJACENT_SWAP_UNIFORM_SHIFT": {
      if (!context.shift) return null;
      return [...adjacentPairSwap(cluster)].map((letter) => shiftLetter(letter, context.shift!)).join("");
    }
    case "FIRST_LAST_SWAP_OPPOSITE":
      return oppositeCluster(firstLastSwap(cluster));
    case "ODD_SHIFT_HALF_SWAP": {
      if (!context.shift) return null;
      return halfBlockSwap(positionClassShift(cluster, context.shift, "ODD"));
    }
    case "PARITY_REGROUP_UNIFORM_SHIFT": {
      if (!context.shift || !context.parityProfile) return null;
      return [...parityRegroup(cluster, context.parityProfile)]
        .map((letter) => shiftLetter(letter, context.shift!))
        .join("");
    }
  }
}

const POSITION_VECTOR_BASES = [
  [1, 3, -2, 4, -1, 2, -3, 5],
  [-2, 1, 4, -3, 2, -1, 3, -4],
  [3, -1, 2, -4, 1, -2, 4, -3],
] as const;

const ORDERED_VECTOR_BASES = [
  [1, 3, -2, 4, -1, 2],
  [-2, 4, 1, -3, 3, -1],
] as const;

function positionVectorContexts(length: number): readonly ClusterRuleContext[] {
  return POSITION_VECTOR_BASES.map((base) => ({ kind: "POSITION_VECTOR", shifts: base.slice(0, length) }));
}

function orderedVectorContexts(length: number): readonly ClusterRuleContext[] {
  return ORDERED_VECTOR_BASES.map((base) => ({ kind: "ORDERED_POSITION_VECTOR", shifts: base.slice(0, length) }));
}

const PARITY_PROFILES: readonly ParityProfile[] = [
  "ODD_FORWARD_EVEN_FORWARD",
  "EVEN_FORWARD_ODD_FORWARD",
  "ODD_FORWARD_EVEN_REVERSE",
  "EVEN_FORWARD_ODD_REVERSE",
  "ODD_REVERSE_EVEN_FORWARD",
  "EVEN_REVERSE_ODD_FORWARD",
];

const INSERT_DERIVATIONS: readonly InsertDerivation[] = [
  "SUCCESSOR_OF_FIRST",
  "PREDECESSOR_OF_LAST",
  "OPPOSITE_OF_MIDDLE",
  "MIDPOINT_FIRST_LAST",
];

const INSERTION_RULES: readonly InsertionRule[] = ["START", "END", "AFTER_FIRST", "BEFORE_LAST", "MIDDLE"];

export function clusterContextKey(context: ClusterRuleContext): string {
  switch (context.kind) {
    case "FIXED": return "FIXED";
    case "UNIFORM_SHIFT": return `UNIFORM_SHIFT:${context.shift}`;
    case "POSITION_VECTOR": return `POSITION_VECTOR:${context.shifts.join(",")}`;
    case "ALTERNATING_SIGN": return `ALTERNATING_SIGN:${context.magnitude}:${context.firstSign}`;
    case "PROGRESSIVE_SHIFT": return `PROGRESSIVE_SHIFT:${context.sign}:${context.startMagnitude}:${context.deltaMagnitude}`;
    case "ROTATION": return `ROTATION:${context.count}`;
    case "POSITION_CLASS_SHIFT": return `POSITION_CLASS_SHIFT:${context.shift}`;
    case "ORDERED_POSITION_VECTOR": return `ORDERED_POSITION_VECTOR:${context.shifts.join(",")}`;
    case "DELETE_POSITION": return `DELETE_POSITION:${context.positionRule}`;
    case "INSERT_DERIVED": return `INSERT_DERIVED:${context.derivation}:${context.insertionRule}`;
    case "NEIGHBOUR_EXPANSION": return `NEIGHBOUR_EXPANSION:${context.order}`;
    case "TWO_STAGE": return `TWO_STAGE:${context.profile}:${context.shift ?? ""}:${context.count ?? ""}:${context.parityProfile ?? ""}`;
    case "PARITY_REGROUP": return `PARITY_REGROUP:${context.profile}`;
    case "ALPHABETICAL_SORT": return `ALPHABETICAL_SORT:${context.direction}`;
  }
}

export function sameClusterContext(left: ClusterRuleContext, right: ClusterRuleContext): boolean {
  return clusterContextKey(left) === clusterContextKey(right);
}

export const ANA_CP006_RULES: readonly ClusterRuleDefinition[] = [
  {
    id: "CLUSTER_UNIFORM_SHIFT_FORWARD",
    label: "move every letter forward by the same number of alphabet places",
    priority: 1,
    supportedLengths: CORE_LENGTHS,
    contextsForLength: () => [1, 2, 3, 4, 5, 6].map((shift) => ({ kind: "UNIFORM_SHIFT", shift })),
    apply: (cluster, context) => context.kind === "UNIFORM_SHIFT" && context.shift > 0
      ? applyShiftVector(cluster, Array(cluster.length).fill(context.shift))
      : null,
    explain: (cluster, output, context) => context.kind === "UNIFORM_SHIFT"
      ? `Each letter moves ${context.shift} place${context.shift === 1 ? "" : "s"} forward: ${positionVectorTrace(cluster, Array(cluster.length).fill(context.shift), output)}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_UNIFORM_SHIFT_BACKWARD",
    label: "move every letter backward by the same number of alphabet places",
    priority: 1,
    supportedLengths: CORE_LENGTHS,
    contextsForLength: () => [1, 2, 3, 4, 5, 6].map((amount) => ({ kind: "UNIFORM_SHIFT", shift: -amount })),
    apply: (cluster, context) => context.kind === "UNIFORM_SHIFT" && context.shift < 0
      ? applyShiftVector(cluster, Array(cluster.length).fill(context.shift))
      : null,
    explain: (cluster, output, context) => context.kind === "UNIFORM_SHIFT"
      ? `Each letter moves ${Math.abs(context.shift)} place${Math.abs(context.shift) === 1 ? "" : "s"} backward: ${positionVectorTrace(cluster, Array(cluster.length).fill(context.shift), output)}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_POSITIONAL_FIXED_SHIFTS",
    label: "apply the same fixed position-by-position shift pattern",
    priority: 4,
    supportedLengths: POSITION_LENGTHS,
    contextsForLength: positionVectorContexts,
    apply: (cluster, context) => context.kind === "POSITION_VECTOR" ? applyShiftVector(cluster, context.shifts) : null,
    explain: (cluster, output, context) => context.kind === "POSITION_VECTOR"
      ? `The fixed positional pattern is ${context.shifts.map((value) => `${value >= 0 ? "+" : ""}${value}`).join(", ")}: ${positionVectorTrace(cluster, context.shifts, output)}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_ALTERNATING_SIGN_SHIFT",
    label: "alternate equal forward and backward alphabet movements",
    priority: 3,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: () => [1, 2, 3, 4].flatMap((magnitude) => ([1, -1] as const).map((firstSign) => ({ kind: "ALTERNATING_SIGN", magnitude, firstSign }))),
    apply: (cluster, context) => {
      if (context.kind !== "ALTERNATING_SIGN") return null;
      const shifts = Array.from({ length: cluster.length }, (_, index) => context.magnitude * (index % 2 === 0 ? context.firstSign : -context.firstSign));
      return applyShiftVector(cluster, shifts);
    },
    explain: (cluster, output, context) => {
      if (context.kind !== "ALTERNATING_SIGN") return "Invalid context";
      const shifts = Array.from({ length: cluster.length }, (_, index) => context.magnitude * (index % 2 === 0 ? context.firstSign : -context.firstSign));
      return `The signs alternate while the magnitude remains ${context.magnitude}: ${positionVectorTrace(cluster, shifts, output)}`;
    },
  },
  {
    id: "CLUSTER_INCREASING_SHIFT",
    label: "use alphabet movements whose magnitudes increase from left to right",
    priority: 3,
    supportedLengths: POSITION_LENGTHS,
    contextsForLength: (length) => ([1, -1] as const).flatMap((sign) => [1, 2].map((startMagnitude) => ({ kind: "PROGRESSIVE_SHIFT", sign, startMagnitude, deltaMagnitude: 1 as const }))),
    apply: (cluster, context) => {
      if (context.kind !== "PROGRESSIVE_SHIFT" || context.deltaMagnitude !== 1) return null;
      const shifts = Array.from({ length: cluster.length }, (_, index) => context.sign * (context.startMagnitude + index));
      return applyShiftVector(cluster, shifts);
    },
    explain: (cluster, output, context) => {
      if (context.kind !== "PROGRESSIVE_SHIFT") return "Invalid context";
      const shifts = Array.from({ length: cluster.length }, (_, index) => context.sign * (context.startMagnitude + index));
      return `The movement grows by one place at each position: ${positionVectorTrace(cluster, shifts, output)}`;
    },
  },
  {
    id: "CLUSTER_DECREASING_SHIFT",
    label: "use alphabet movements whose magnitudes decrease from left to right",
    priority: 3,
    supportedLengths: POSITION_LENGTHS,
    contextsForLength: (length) => ([1, -1] as const).flatMap((sign) => [length, length + 1].map((startMagnitude) => ({ kind: "PROGRESSIVE_SHIFT", sign, startMagnitude, deltaMagnitude: -1 as const }))),
    apply: (cluster, context) => {
      if (context.kind !== "PROGRESSIVE_SHIFT" || context.deltaMagnitude !== -1) return null;
      const shifts = Array.from({ length: cluster.length }, (_, index) => context.sign * (context.startMagnitude - index));
      if (shifts.some((shift) => shift === 0)) return null;
      return applyShiftVector(cluster, shifts);
    },
    explain: (cluster, output, context) => {
      if (context.kind !== "PROGRESSIVE_SHIFT") return "Invalid context";
      const shifts = Array.from({ length: cluster.length }, (_, index) => context.sign * (context.startMagnitude - index));
      return `The movement decreases by one place at each position: ${positionVectorTrace(cluster, shifts, output)}`;
    },
  },
  {
    id: "CLUSTER_REVERSE",
    label: "write the complete letter-cluster in reverse order",
    priority: 1,
    supportedLengths: CORE_LENGTHS,
    contextsForLength: () => FIXED_CONTEXTS,
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "FIXED" && normalized ? nonIdentity(normalized, reverseCluster(normalized)) : null;
    },
    explain: (cluster, output) => `${cluster} is read from right to left, giving ${output}`,
  },
  {
    id: "CLUSTER_ADJACENT_PAIR_SWAP",
    label: "exchange each neighbouring pair of letters",
    priority: 2,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: () => FIXED_CONTEXTS,
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "FIXED" && normalized ? nonIdentity(normalized, adjacentPairSwap(normalized)) : null;
    },
    explain: (cluster, output) => `Neighbouring pairs are exchanged: ${cluster.match(/.{1,2}/g)?.join(" | ")} → ${output.match(/.{1,2}/g)?.join(" | ")}`,
  },
  {
    id: "CLUSTER_FIRST_LAST_SWAP",
    label: "exchange only the first and last letters",
    priority: 2,
    supportedLengths: CORE_LENGTHS,
    contextsForLength: () => FIXED_CONTEXTS,
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "FIXED" && normalized ? nonIdentity(normalized, firstLastSwap(normalized)) : null;
    },
    explain: (cluster, output) => `Only the two end letters exchange places: ${cluster} → ${output}`,
  },
  {
    id: "CLUSTER_ROTATE_LEFT",
    label: "rotate the complete cluster to the left",
    priority: 2,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: (length) => lengths(1, Math.floor((length - 1) / 2)).map((count) => ({ kind: "ROTATION", count })),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "ROTATION" && context.count > 0 && normalized
        ? nonIdentity(normalized, rotateCluster(normalized, context.count))
        : null;
    },
    explain: (cluster, output, context) => context.kind === "ROTATION"
      ? `Rotate ${context.count} place${context.count === 1 ? "" : "s"} to the left: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_ROTATE_RIGHT",
    label: "rotate the complete cluster to the right",
    priority: 2,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: (length) => lengths(1, Math.floor((length - 1) / 2)).map((count) => ({ kind: "ROTATION", count })),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "ROTATION" && context.count > 0 && normalized
        ? nonIdentity(normalized, rotateCluster(normalized, -context.count))
        : null;
    },
    explain: (cluster, output, context) => context.kind === "ROTATION"
      ? `Rotate ${context.count} place${context.count === 1 ? "" : "s"} to the right: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_OPPOSITE_SUBSTITUTION",
    label: "replace every letter with its opposite alphabet partner",
    priority: 1,
    supportedLengths: CORE_LENGTHS,
    contextsForLength: () => FIXED_CONTEXTS,
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "FIXED" && normalized ? nonIdentity(normalized, oppositeCluster(normalized)) : null;
    },
    explain: (cluster, output) => [...cluster].map((letter, index) => `${letter}↔${output[index]}`).join(", "),
  },
  {
    id: "CLUSTER_ODD_POSITION_TRANSFORM",
    label: "shift only the letters in odd-numbered positions",
    priority: 3,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: () => [-4, -3, -2, -1, 1, 2, 3, 4].map((shift) => ({ kind: "POSITION_CLASS_SHIFT", shift })),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "POSITION_CLASS_SHIFT" && normalized
        ? nonIdentity(normalized, positionClassShift(normalized, context.shift, "ODD"))
        : null;
    },
    explain: (cluster, output, context) => context.kind === "POSITION_CLASS_SHIFT"
      ? `Odd positions move ${Math.abs(context.shift)} place${Math.abs(context.shift) === 1 ? "" : "s"} ${context.shift > 0 ? "forward" : "backward"}; even positions stay unchanged: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_EVEN_POSITION_TRANSFORM",
    label: "shift only the letters in even-numbered positions",
    priority: 3,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: () => [-4, -3, -2, -1, 1, 2, 3, 4].map((shift) => ({ kind: "POSITION_CLASS_SHIFT", shift })),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "POSITION_CLASS_SHIFT" && normalized
        ? nonIdentity(normalized, positionClassShift(normalized, context.shift, "EVEN"))
        : null;
    },
    explain: (cluster, output, context) => context.kind === "POSITION_CLASS_SHIFT"
      ? `Even positions move ${Math.abs(context.shift)} place${Math.abs(context.shift) === 1 ? "" : "s"} ${context.shift > 0 ? "forward" : "backward"}; odd positions stay unchanged: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_REVERSE_THEN_SHIFT",
    label: "reverse the cluster and then apply a fixed positional shift pattern",
    priority: 5,
    supportedLengths: POSITION_LENGTHS.filter((length) => length >= 4),
    contextsForLength: orderedVectorContexts,
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "ORDERED_POSITION_VECTOR" && normalized
        ? applyShiftVector(reverseCluster(normalized), context.shifts)
        : null;
    },
    explain: (cluster, output, context) => context.kind === "ORDERED_POSITION_VECTOR"
      ? `First reverse ${cluster} to ${reverseCluster(cluster)}; then use ${context.shifts.join(", ")} by position to obtain ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_SHIFT_THEN_REVERSE",
    label: "apply a fixed positional shift pattern and then reverse the result",
    priority: 5,
    supportedLengths: POSITION_LENGTHS.filter((length) => length >= 4),
    contextsForLength: orderedVectorContexts,
    apply: (cluster, context) => {
      if (context.kind !== "ORDERED_POSITION_VECTOR") return null;
      const shifted = applyShiftVector(cluster, context.shifts);
      return shifted ? nonIdentity(cluster, reverseCluster(shifted)) : null;
    },
    explain: (cluster, output, context) => {
      if (context.kind !== "ORDERED_POSITION_VECTOR") return "Invalid context";
      const shifted = applyShiftVector(cluster, context.shifts);
      return shifted ? `First apply ${context.shifts.join(", ")} by position to get ${shifted}; then reverse it to obtain ${output}` : "Invalid context";
    },
  },
  {
    id: "CLUSTER_DELETE_POSITION",
    label: "remove the letter at the same named position",
    priority: 4,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: (length) => {
      const common: DeletePositionRule[] = ["FIRST", "LAST", "SECOND", "PENULTIMATE"];
      const middle: DeletePositionRule[] = length % 2 === 1 ? ["MIDDLE"] : ["LEFT_MIDDLE", "RIGHT_MIDDLE"];
      return [...common, ...middle].map((positionRule) => ({ kind: "DELETE_POSITION", positionRule }));
    },
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      if (context.kind !== "DELETE_POSITION" || !normalized) return null;
      const index = resolveDeleteIndex(normalized.length, context.positionRule);
      return index === null ? null : normalized.slice(0, index) + normalized.slice(index + 1);
    },
    explain: (cluster, output, context) => context.kind === "DELETE_POSITION"
      ? `Delete the ${context.positionRule.toLowerCase().replace("_", " ")} letter: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_INSERT_DERIVED_LETTER",
    label: "derive one letter and insert it at the same named position",
    priority: 4,
    supportedLengths: lengths(3, 7),
    contextsForLength: (length) => INSERT_DERIVATIONS.flatMap((derivation) => {
      if (derivation === "OPPOSITE_OF_MIDDLE" && length % 2 === 0) return [];
      return INSERTION_RULES.map((insertionRule) => ({ kind: "INSERT_DERIVED", derivation, insertionRule }));
    }),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      if (context.kind !== "INSERT_DERIVED" || !normalized) return null;
      const letter = deriveInsertedLetter(normalized, context.derivation);
      if (!letter) return null;
      const index = resolveInsertionIndex(normalized.length, context.insertionRule);
      return normalized.slice(0, index) + letter + normalized.slice(index);
    },
    explain: (cluster, output, context) => context.kind === "INSERT_DERIVED"
      ? `Use ${context.derivation.toLowerCase().replaceAll("_", " ")} and insert it at ${context.insertionRule.toLowerCase().replaceAll("_", " ")}: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_NEIGHBOUR_EXPANSION",
    label: "replace each letter by its two alphabet neighbours",
    priority: 4,
    supportedLengths: EXPANSION_LENGTHS,
    contextsForLength: () => (["PREV_NEXT", "NEXT_PREV"] as const).map((order) => ({ kind: "NEIGHBOUR_EXPANSION", order })),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "NEIGHBOUR_EXPANSION" && normalized
        ? nonIdentity(normalized, neighbourExpansion(normalized, context.order))
        : null;
    },
    explain: (cluster, output, context) => context.kind === "NEIGHBOUR_EXPANSION"
      ? `Each letter is replaced by its ${context.order === "PREV_NEXT" ? "previous then next" : "next then previous"} alphabet neighbours: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_TWO_STAGE_MIXED",
    label: "apply the same two named transformations in order",
    priority: 6,
    supportedLengths: lengths(4, 7),
    contextsForLength: (length) => [
      { kind: "TWO_STAGE", profile: "OPPOSITE_ROTATE_LEFT", count: 1 },
      { kind: "TWO_STAGE", profile: "OPPOSITE_ROTATE_RIGHT", count: 1 },
      { kind: "TWO_STAGE", profile: "ADJACENT_SWAP_UNIFORM_SHIFT", shift: 2 },
      { kind: "TWO_STAGE", profile: "ADJACENT_SWAP_UNIFORM_SHIFT", shift: -2 },
      { kind: "TWO_STAGE", profile: "FIRST_LAST_SWAP_OPPOSITE" },
      { kind: "TWO_STAGE", profile: "ODD_SHIFT_HALF_SWAP", shift: 2 },
      { kind: "TWO_STAGE", profile: "PARITY_REGROUP_UNIFORM_SHIFT", parityProfile: "EVEN_FORWARD_ODD_REVERSE", shift: 1 },
    ],
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "TWO_STAGE" && normalized ? nonIdentity(normalized, applyTwoStage(normalized, context)) : null;
    },
    explain: (cluster, output, context) => context.kind === "TWO_STAGE"
      ? `Apply the two-stage profile ${context.profile.toLowerCase().replaceAll("_", " ")} in the same order: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_HALF_BLOCK_SWAP",
    label: "exchange the two equal outer blocks while preserving their internal order",
    priority: 3,
    supportedLengths: BLOCK_LENGTHS,
    contextsForLength: () => FIXED_CONTEXTS,
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "FIXED" && normalized ? nonIdentity(normalized, halfBlockSwap(normalized)) : null;
    },
    explain: (cluster, output) => {
      const half = Math.floor(cluster.length / 2);
      const grouped = cluster.length % 2 === 0
        ? `${cluster.slice(0, half)} | ${cluster.slice(half)}`
        : `${cluster.slice(0, half)} | ${cluster[half]} | ${cluster.slice(half + 1)}`;
      return `Exchange the equal outer blocks: ${grouped} → ${output}`;
    },
  },
  {
    id: "CLUSTER_REVERSE_EACH_BLOCK",
    label: "reverse each half or equal outer block independently",
    priority: 3,
    supportedLengths: BLOCK_LENGTHS,
    contextsForLength: () => FIXED_CONTEXTS,
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "FIXED" && normalized ? nonIdentity(normalized, reverseEachBlock(normalized)) : null;
    },
    explain: (cluster, output) => `Reverse each equal block separately while keeping its place: ${cluster} → ${output}`,
  },
  {
    id: "CLUSTER_PARITY_REGROUP",
    label: "regroup letters according to their odd and even source positions",
    priority: 3,
    supportedLengths: BLOCK_LENGTHS,
    contextsForLength: () => PARITY_PROFILES.map((profile) => ({ kind: "PARITY_REGROUP", profile })),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      return context.kind === "PARITY_REGROUP" && normalized
        ? nonIdentity(normalized, parityRegroup(normalized, context.profile))
        : null;
    },
    explain: (cluster, output, context) => context.kind === "PARITY_REGROUP"
      ? `Regroup the odd/even source positions using ${context.profile.toLowerCase().replaceAll("_", " ")}: ${cluster} → ${output}`
      : "Invalid context",
  },
  {
    id: "CLUSTER_ALPHABETICAL_SORT",
    label: "arrange the letters in alphabetic order",
    priority: 2,
    supportedLengths: STRUCTURAL_LENGTHS,
    contextsForLength: () => (["ASC", "DESC"] as const).map((direction) => ({ kind: "ALPHABETICAL_SORT", direction })),
    apply: (cluster, context) => {
      const normalized = normalizeCluster(cluster);
      if (context.kind !== "ALPHABETICAL_SORT" || !normalized) return null;
      const sorted = [...normalized].sort();
      if (context.direction === "DESC") sorted.reverse();
      return nonIdentity(normalized, sorted.join(""));
    },
    explain: (cluster, output, context) => context.kind === "ALPHABETICAL_SORT"
      ? `Arrange the letters in ${context.direction === "ASC" ? "A-to-Z" : "Z-to-A"} order: ${cluster} → ${output}`
      : "Invalid context",
  },
];

export function clusterRuleById(id: string): ClusterRuleDefinition {
  const rule = ANA_CP006_RULES.find((entry) => entry.id === id);
  if (!rule) throw new Error(`Unknown ANA-CP-006 rule: ${id}`);
  return rule;
}
