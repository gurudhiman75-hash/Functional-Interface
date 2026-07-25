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
  parityRegroup,
  type ClusterRuleContext,
  type DeletePositionRule,
  type InsertionRule,
} from "./rule-definitions";

type StudentExplainer = (
  input: string,
  output: string,
  context: ClusterRuleContext,
) => string;

function plural(value: number, singular: string, pluralForm = `${singular}s`): string {
  return value === 1 ? singular : pluralForm;
}

function directionText(amount: number): string {
  return `${Math.abs(amount)} ${plural(Math.abs(amount), "place")} ${amount > 0 ? "forward" : "backward"}`;
}

function positionName(index: number): string {
  const value = index + 1;
  if (value % 100 >= 11 && value % 100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function movementTrace(input: string, output: string, movements: readonly number[]): string {
  return [...input]
    .map((letter, index) => {
      const amount = movements[index];
      if (amount === 0) return `${positionName(index)} letter ${letter} stays ${output[index]}`;
      return `${positionName(index)} letter ${letter} moves ${directionText(amount)} to ${output[index]}`;
    })
    .join("; ");
}

function reverseText(value: string): string {
  return [...value].reverse().join("");
}

function adjacentPairSwap(value: string): string {
  const letters = [...value];
  for (let index = 0; index + 1 < letters.length; index += 2) {
    [letters[index], letters[index + 1]] = [letters[index + 1], letters[index]];
  }
  return letters.join("");
}

function pairGroups(value: string): string {
  return value.match(/.{1,2}/g)?.join(" | ") ?? value;
}

function swapEnds(value: string): string {
  const letters = [...value];
  [letters[0], letters[letters.length - 1]] = [letters[letters.length - 1], letters[0]];
  return letters.join("");
}

function oppositeCluster(value: string): string {
  return [...value].map(oppositeLetter).join("");
}

function classShift(value: string, amount: number, odd: boolean): string {
  return [...value]
    .map((letter, index) => ((index % 2 === 0) === odd ? shiftLetter(letter, amount) : letter))
    .join("");
}

function deleteIndex(length: number, rule: DeletePositionRule): number | null {
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

function deleteLabel(rule: DeletePositionRule): string {
  const labels: Record<DeletePositionRule, string> = {
    FIRST: "first",
    LAST: "last",
    SECOND: "second",
    PENULTIMATE: "second-last",
    MIDDLE: "middle",
    LEFT_MIDDLE: "left-middle",
    RIGHT_MIDDLE: "right-middle",
  };
  return labels[rule];
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

function insertionLabel(rule: InsertionRule): string {
  const labels: Record<InsertionRule, string> = {
    START: "at the beginning",
    END: "at the end",
    AFTER_FIRST: "after the first letter",
    BEFORE_LAST: "before the last letter",
    MIDDLE: "in the middle",
  };
  return labels[rule];
}

function derivedLetter(input: string, context: Extract<ClusterRuleContext, { kind: "INSERT_DERIVED" }>): string | null {
  switch (context.derivation) {
    case "SUCCESSOR_OF_FIRST":
      return shiftLetter(input[0], 1);
    case "PREDECESSOR_OF_LAST":
      return shiftLetter(input[input.length - 1], -1);
    case "OPPOSITE_OF_MIDDLE":
      return input.length % 2 === 1 ? oppositeLetter(input[Math.floor(input.length / 2)]) : null;
    case "MIDPOINT_FIRST_LAST": {
      const total = letterPosition(input[0]) + letterPosition(input[input.length - 1]);
      return total % 2 === 0 ? letterFromPosition(total / 2) : null;
    }
  }
}

function derivationText(input: string, context: Extract<ClusterRuleContext, { kind: "INSERT_DERIVED" }>): string {
  switch (context.derivation) {
    case "SUCCESSOR_OF_FIRST":
      return `the letter immediately after ${input[0]}`;
    case "PREDECESSOR_OF_LAST":
      return `the letter immediately before ${input[input.length - 1]}`;
    case "OPPOSITE_OF_MIDDLE":
      return `the alphabet opposite of the middle letter ${input[Math.floor(input.length / 2)]}`;
    case "MIDPOINT_FIRST_LAST":
      return `the alphabet midpoint of ${input[0]} and ${input[input.length - 1]}`;
  }
}

function parityGroups(value: string): { odd: string; even: string } {
  return {
    odd: [...value].filter((_, index) => index % 2 === 0).join(""),
    even: [...value].filter((_, index) => index % 2 === 1).join(""),
  };
}

function parityProfileText(profile: Extract<ClusterRuleContext, { kind: "PARITY_REGROUP" }>["profile"]): string {
  const texts = {
    ODD_FORWARD_EVEN_FORWARD: "odd-position letters in their original order, followed by even-position letters in their original order",
    EVEN_FORWARD_ODD_FORWARD: "even-position letters in their original order, followed by odd-position letters in their original order",
    ODD_FORWARD_EVEN_REVERSE: "odd-position letters in their original order, followed by even-position letters in reverse order",
    EVEN_FORWARD_ODD_REVERSE: "even-position letters in their original order, followed by odd-position letters in reverse order",
    ODD_REVERSE_EVEN_FORWARD: "odd-position letters in reverse order, followed by even-position letters in their original order",
    EVEN_REVERSE_ODD_FORWARD: "even-position letters in reverse order, followed by odd-position letters in their original order",
  } as const;
  return texts[profile];
}

function applyPositionMovements(input: string, movements: readonly number[]): string {
  return [...input].map((letter, index) => shiftLetter(letter, movements[index])).join("");
}

function twoStageExplanation(
  input: string,
  output: string,
  context: Extract<ClusterRuleContext, { kind: "TWO_STAGE" }>,
): string {
  switch (context.profile) {
    case "OPPOSITE_ROTATE_LEFT": {
      const middle = oppositeCluster(input);
      return `First replace every letter in ${input} with its alphabet opposite to get ${middle}. Then move the first ${context.count} ${plural(context.count ?? 0, "letter")} to the end, giving ${output}.`;
    }
    case "OPPOSITE_ROTATE_RIGHT": {
      const middle = oppositeCluster(input);
      return `First replace every letter in ${input} with its alphabet opposite to get ${middle}. Then move the last ${context.count} ${plural(context.count ?? 0, "letter")} to the front, giving ${output}.`;
    }
    case "ADJACENT_SWAP_UNIFORM_SHIFT": {
      const middle = adjacentPairSwap(input);
      return `First exchange neighbouring pairs: ${pairGroups(input)} becomes ${pairGroups(middle)}. Then move every letter ${directionText(context.shift ?? 0)}, giving ${output}.`;
    }
    case "FIRST_LAST_SWAP_OPPOSITE": {
      const middle = swapEnds(input);
      return `First exchange only the first and last letters, so ${input} becomes ${middle}. Then replace every letter with its alphabet opposite, giving ${output}.`;
    }
    case "ODD_SHIFT_HALF_SWAP": {
      const middle = classShift(input, context.shift ?? 0, true);
      return `First move only the 1st, 3rd, 5th and other odd-position letters ${directionText(context.shift ?? 0)}, producing ${middle}. Then exchange the two equal outer blocks, giving ${output}.`;
    }
    case "PARITY_REGROUP_UNIFORM_SHIFT": {
      if (!context.parityProfile) return `${input} becomes ${output}.`;
      const middle = parityRegroup(input, context.parityProfile);
      return `First place the letters as ${parityProfileText(context.parityProfile)}, producing ${middle}. Then move every letter ${directionText(context.shift ?? 0)}, giving ${output}.`;
    }
  }
}

const LABELS: Record<AnaCp006RuleId, string> = {
  CLUSTER_UNIFORM_SHIFT_FORWARD: "every letter moves the same number of places forward",
  CLUSTER_UNIFORM_SHIFT_BACKWARD: "every letter moves the same number of places backward",
  CLUSTER_POSITIONAL_FIXED_SHIFTS: "each position has its own fixed alphabet movement",
  CLUSTER_ALTERNATING_SIGN_SHIFT: "letters move forward and backward alternately by the same amount",
  CLUSTER_INCREASING_SHIFT: "the alphabet movement increases by one from left to right",
  CLUSTER_DECREASING_SHIFT: "the alphabet movement decreases by one from left to right",
  CLUSTER_REVERSE: "the complete letter group is written in reverse order",
  CLUSTER_ADJACENT_PAIR_SWAP: "the 1st and 2nd letters exchange places, then the 3rd and 4th, and so on",
  CLUSTER_FIRST_LAST_SWAP: "only the first and last letters exchange places",
  CLUSTER_ROTATE_LEFT: "a fixed number of beginning letters move to the end",
  CLUSTER_ROTATE_RIGHT: "a fixed number of ending letters move to the front",
  CLUSTER_OPPOSITE_SUBSTITUTION: "every letter is replaced by its alphabet opposite",
  CLUSTER_ODD_POSITION_TRANSFORM: "only letters in odd-numbered positions change",
  CLUSTER_EVEN_POSITION_TRANSFORM: "only letters in even-numbered positions change",
  CLUSTER_REVERSE_THEN_SHIFT: "the group is reversed first and then its letters change by position",
  CLUSTER_SHIFT_THEN_REVERSE: "the letters change by position first and the result is then reversed",
  CLUSTER_DELETE_POSITION: "the same named letter position is removed",
  CLUSTER_INSERT_DERIVED_LETTER: "a letter found from the existing group is inserted at the same named place",
  CLUSTER_NEIGHBOUR_EXPANSION: "each letter is replaced by its two immediate alphabet neighbours",
  CLUSTER_TWO_STAGE_MIXED: "the same two operations are performed in the same order",
  CLUSTER_HALF_BLOCK_SWAP: "the two equal outer blocks exchange places without changing their internal order",
  CLUSTER_REVERSE_EACH_BLOCK: "each half or outer block is reversed separately",
  CLUSTER_PARITY_REGROUP: "letters are regrouped according to their odd and even source positions",
  CLUSTER_ALPHABETICAL_SORT: "all letters are arranged in alphabetical order",
};

const EXPLAINERS: Record<AnaCp006RuleId, StudentExplainer> = {
  CLUSTER_UNIFORM_SHIFT_FORWARD: (input, output, context) => {
    if (context.kind !== "UNIFORM_SHIFT") return `${input} becomes ${output}.`;
    const movements = Array(input.length).fill(context.shift);
    return `Every letter moves ${directionText(context.shift)}. In ${input}: ${movementTrace(input, output, movements)}. Therefore the new group is ${output}.`;
  },
  CLUSTER_UNIFORM_SHIFT_BACKWARD: (input, output, context) => {
    if (context.kind !== "UNIFORM_SHIFT") return `${input} becomes ${output}.`;
    const movements = Array(input.length).fill(context.shift);
    return `Every letter moves ${directionText(context.shift)}. In ${input}: ${movementTrace(input, output, movements)}. Therefore the new group is ${output}.`;
  },
  CLUSTER_POSITIONAL_FIXED_SHIFTS: (input, output, context) => {
    if (context.kind !== "POSITION_VECTOR") return `${input} becomes ${output}.`;
    return `Different positions use different movements, and the same position always uses the same movement. For ${input}: ${movementTrace(input, output, context.shifts)}. Combining the changed letters gives ${output}.`;
  },
  CLUSTER_ALTERNATING_SIGN_SHIFT: (input, output, context) => {
    if (context.kind !== "ALTERNATING_SIGN") return `${input} becomes ${output}.`;
    const movements = Array.from(
      { length: input.length },
      (_, index) => context.magnitude * (index % 2 === 0 ? context.firstSign : -context.firstSign),
    );
    return `The letters move alternately forward and backward by ${context.magnitude} ${plural(context.magnitude, "place")}. For ${input}: ${movementTrace(input, output, movements)}. This forms ${output}.`;
  },
  CLUSTER_INCREASING_SHIFT: (input, output, context) => {
    if (context.kind !== "PROGRESSIVE_SHIFT") return `${input} becomes ${output}.`;
    const movements = Array.from(
      { length: input.length },
      (_, index) => context.sign * (context.startMagnitude + index),
    );
    return `The movement becomes one place larger at each next position. For ${input}: ${movementTrace(input, output, movements)}. Therefore the result is ${output}.`;
  },
  CLUSTER_DECREASING_SHIFT: (input, output, context) => {
    if (context.kind !== "PROGRESSIVE_SHIFT") return `${input} becomes ${output}.`;
    const movements = Array.from(
      { length: input.length },
      (_, index) => context.sign * (context.startMagnitude - index),
    );
    return `The first letter moves the most, and the movement becomes one place smaller at each next position. For ${input}: ${movementTrace(input, output, movements)}. Therefore the result is ${output}.`;
  },
  CLUSTER_REVERSE: (input, output) =>
    `Write the letters from the last one back to the first one. ${input} written in reverse order is ${output}.`,
  CLUSTER_ADJACENT_PAIR_SWAP: (input, output) =>
    `Exchange the 1st and 2nd letters, then the 3rd and 4th, and continue in the same way. ${pairGroups(input)} becomes ${pairGroups(output)}, so the result is ${output}.`,
  CLUSTER_FIRST_LAST_SWAP: (input, output) =>
    `Only the two end letters exchange places; every middle letter stays where it is. In ${input}, ${input[0]} and ${input[input.length - 1]} exchange places, giving ${output}.`,
  CLUSTER_ROTATE_LEFT: (input, output, context) => {
    if (context.kind !== "ROTATION") return `${input} becomes ${output}.`;
    return `Move the first ${context.count} ${plural(context.count, "letter")} to the end without changing their order. Doing this to ${input} gives ${output}.`;
  },
  CLUSTER_ROTATE_RIGHT: (input, output, context) => {
    if (context.kind !== "ROTATION") return `${input} becomes ${output}.`;
    return `Move the last ${context.count} ${plural(context.count, "letter")} to the front without changing their order. Doing this to ${input} gives ${output}.`;
  },
  CLUSTER_OPPOSITE_SUBSTITUTION: (input, output) => {
    const pairs = [...input].map((letter, index) => `${letter} becomes ${output[index]}`).join("; ");
    return `Use opposite alphabet pairs such as A–Z, B–Y and C–X. In ${input}: ${pairs}. Therefore the result is ${output}.`;
  },
  CLUSTER_ODD_POSITION_TRANSFORM: (input, output, context) => {
    if (context.kind !== "POSITION_CLASS_SHIFT") return `${input} becomes ${output}.`;
    const movements = Array.from(
      { length: input.length },
      (_, index) => (index % 2 === 0 ? context.shift : 0),
    );
    return `Only the 1st, 3rd, 5th and other odd-position letters move ${directionText(context.shift)}; the even-position letters stay unchanged. For ${input}: ${movementTrace(input, output, movements)}. This gives ${output}.`;
  },
  CLUSTER_EVEN_POSITION_TRANSFORM: (input, output, context) => {
    if (context.kind !== "POSITION_CLASS_SHIFT") return `${input} becomes ${output}.`;
    const movements = Array.from(
      { length: input.length },
      (_, index) => (index % 2 === 1 ? context.shift : 0),
    );
    return `Only the 2nd, 4th, 6th and other even-position letters move ${directionText(context.shift)}; the odd-position letters stay unchanged. For ${input}: ${movementTrace(input, output, movements)}. This gives ${output}.`;
  },
  CLUSTER_REVERSE_THEN_SHIFT: (input, output, context) => {
    if (context.kind !== "ORDERED_POSITION_VECTOR") return `${input} becomes ${output}.`;
    const reversed = reverseText(input);
    return `There are two steps, and their order matters. First reverse ${input} to get ${reversed}. Then change its letters position by position: ${movementTrace(reversed, output, context.shifts)}. The final group is ${output}.`;
  },
  CLUSTER_SHIFT_THEN_REVERSE: (input, output, context) => {
    if (context.kind !== "ORDERED_POSITION_VECTOR") return `${input} becomes ${output}.`;
    const changed = applyPositionMovements(input, context.shifts);
    return `There are two steps, and the letter changes come first. Change ${input} position by position to get ${changed}: ${movementTrace(input, changed, context.shifts)}. Reverse ${changed} to obtain ${output}.`;
  },
  CLUSTER_DELETE_POSITION: (input, output, context) => {
    if (context.kind !== "DELETE_POSITION") return `${input} becomes ${output}.`;
    const index = deleteIndex(input.length, context.positionRule);
    if (index === null) return `${input} becomes ${output}.`;
    return `Remove the ${deleteLabel(context.positionRule)} letter and keep every other letter in its original order. Removing ${input[index]} from ${input} gives ${output}.`;
  },
  CLUSTER_INSERT_DERIVED_LETTER: (input, output, context) => {
    if (context.kind !== "INSERT_DERIVED") return `${input} becomes ${output}.`;
    const inserted = derivedLetter(input, context);
    const index = insertionIndex(input.length, context.insertionRule);
    return inserted
      ? `Find ${derivationText(input, context)}, which is ${inserted}, and insert it ${insertionLabel(context.insertionRule)}. Placing ${inserted} at position ${index + 1} changes ${input} to ${output}.`
      : `${input} becomes ${output}.`;
  },
  CLUSTER_NEIGHBOUR_EXPANSION: (input, output, context) => {
    if (context.kind !== "NEIGHBOUR_EXPANSION") return `${input} becomes ${output}.`;
    const parts = [...input].map((letter) => {
      const previous = shiftLetter(letter, -1);
      const next = shiftLetter(letter, 1);
      const replacement = context.order === "PREV_NEXT" ? previous + next : next + previous;
      return `${letter} becomes ${replacement}`;
    });
    return `Replace each letter by its two immediate alphabet neighbours in the shown order. ${parts.join("; ")}. Joining the new pairs gives ${output}.`;
  },
  CLUSTER_TWO_STAGE_MIXED: (input, output, context) =>
    context.kind === "TWO_STAGE" ? twoStageExplanation(input, output, context) : `${input} becomes ${output}.`,
  CLUSTER_HALF_BLOCK_SWAP: (input, output) => {
    const half = Math.floor(input.length / 2);
    if (input.length % 2 === 0) {
      return `Split ${input} into two equal blocks: ${input.slice(0, half)} | ${input.slice(half)}. Exchange the blocks without reversing letters inside them, giving ${output}.`;
    }
    return `Keep the middle letter ${input[half]} fixed and exchange the equal blocks on its two sides: ${input.slice(0, half)} | ${input[half]} | ${input.slice(half + 1)} becomes ${output}.`;
  },
  CLUSTER_REVERSE_EACH_BLOCK: (input, output) => {
    const half = Math.floor(input.length / 2);
    if (input.length % 2 === 0) {
      return `Split ${input} into ${input.slice(0, half)} | ${input.slice(half)}. Reverse the letters inside each block separately, producing ${reverseText(input.slice(0, half))} | ${reverseText(input.slice(half))} = ${output}.`;
    }
    return `Keep the middle letter ${input[half]} fixed. Reverse the left block ${input.slice(0, half)} and the right block ${input.slice(half + 1)} separately, giving ${output}.`;
  },
  CLUSTER_PARITY_REGROUP: (input, output, context) => {
    if (context.kind !== "PARITY_REGROUP") return `${input} becomes ${output}.`;
    const groups = parityGroups(input);
    return `Take the letters from odd positions as ${groups.odd} and from even positions as ${groups.even}. Write ${parityProfileText(context.profile)}. This gives ${output}.`;
  },
  CLUSTER_ALPHABETICAL_SORT: (input, output, context) => {
    if (context.kind !== "ALPHABETICAL_SORT") return `${input} becomes ${output}.`;
    return `Arrange all letters of ${input} in ${context.direction === "ASC" ? "A-to-Z" : "Z-to-A"} order. No letter is added, removed or changed, so the result is ${output}.`;
  },
};

for (const rule of ANA_CP006_RULES) {
  rule.label = LABELS[rule.id];
  rule.explain = EXPLAINERS[rule.id];
}
