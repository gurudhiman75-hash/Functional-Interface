import { letterFromPosition, letterPosition, oppositeLetter, shiftLetter } from "../foundation/alphabet";

export type AlphabetClassDirection = "VOWEL_TO_CONSONANT" | "CONSONANT_TO_VOWEL";

export interface AlphabetRuleContext {
  shift?: number;
  distance?: number;
  offset?: number;
  classDirection?: AlphabetClassDirection;
  adjustment?: -1 | 1;
}

export interface AlphabetRuleDefinition {
  id: string;
  label: string;
  priority: number;
  contexts: readonly AlphabetRuleContext[];
  eligibleInputPositions: readonly number[];
  apply(letter: string, context: AlphabetRuleContext): string | null;
  explain(letter: string, result: string, context: AlphabetRuleContext): string;
}

const positions = (start: number, end: number, predicate: (value: number) => boolean = () => true) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index).filter(predicate);

const ALL_POSITIONS = positions(1, 26);
const DOUBLED_INPUTS = positions(2, 13);
const TWO_STEP_INPUTS = positions(2, 12);
const VOWELS = ["A", "E", "I", "O", "U"] as const;
const CORRESPONDING_CONSONANTS = ["B", "C", "D", "F", "G"] as const;

const shifts = (...values: number[]): readonly AlphabetRuleContext[] => values.map((shift) => ({ shift }));
const distances = (...values: number[]): readonly AlphabetRuleContext[] => values.map((distance) => ({ distance }));
const offsets = (...values: number[]): readonly AlphabetRuleContext[] => values.map((offset) => ({ offset }));
const fixed: readonly AlphabetRuleContext[] = [{}];

function nonIdentity(input: string, output: string | null): string | null {
  return output && input !== output ? output : null;
}

function fromBoundedPosition(input: string, outputPosition: number): string | null {
  if (!Number.isInteger(outputPosition) || outputPosition < 1 || outputPosition > 26) return null;
  return nonIdentity(input, letterFromPosition(outputPosition));
}

function places(value: number | undefined): string {
  return `${value} place${value === 1 ? "" : "s"}`;
}

export function alphabetRuleContextKey(context: AlphabetRuleContext): string {
  return JSON.stringify({
    shift: context.shift ?? null,
    distance: context.distance ?? null,
    offset: context.offset ?? null,
    classDirection: context.classDirection ?? null,
    adjustment: context.adjustment ?? null,
  });
}

export function sameAlphabetRuleContext(left: AlphabetRuleContext, right: AlphabetRuleContext): boolean {
  return alphabetRuleContextKey(left) === alphabetRuleContextKey(right);
}

export const ANA_CP005_RULES: readonly AlphabetRuleDefinition[] = [
  {
    id: "ALPHA_FIXED_SHIFT_FORWARD",
    label: "move forward by a fixed number of places without crossing Z",
    priority: 1,
    contexts: shifts(1, 2, 3, 4, 5, 6),
    eligibleInputPositions: ALL_POSITIONS,
    apply: (letter, context) => {
      if (context.shift === undefined) return null;
      return fromBoundedPosition(letter, letterPosition(letter) + context.shift);
    },
    explain: (letter, result, context) =>
      `${letter} is at position ${letterPosition(letter)}; moving ${places(context.shift)} forward gives position ${letterPosition(result)}, which is ${result}`,
  },
  {
    id: "ALPHA_FIXED_SHIFT_BACKWARD",
    label: "move backward by a fixed number of places without crossing A",
    priority: 1,
    contexts: shifts(1, 2, 3, 4, 5, 6),
    eligibleInputPositions: ALL_POSITIONS,
    apply: (letter, context) => {
      if (context.shift === undefined) return null;
      return fromBoundedPosition(letter, letterPosition(letter) - context.shift);
    },
    explain: (letter, result, context) =>
      `${letter} is at position ${letterPosition(letter)}; moving ${places(context.shift)} backward gives position ${letterPosition(result)}, which is ${result}`,
  },
  {
    id: "ALPHA_CYCLIC_SHIFT_FORWARD",
    label: "move forward by a fixed number of places and continue from A after Z",
    priority: 2,
    contexts: shifts(2, 3, 4, 5, 6),
    eligibleInputPositions: ALL_POSITIONS,
    apply: (letter, context) => {
      if (context.shift === undefined || letterPosition(letter) + context.shift <= 26) return null;
      return nonIdentity(letter, shiftLetter(letter, context.shift));
    },
    explain: (letter, result, context) => {
      const rawPosition = letterPosition(letter) + context.shift!;
      return `${letter} is at position ${letterPosition(letter)}; ${letterPosition(letter)} + ${context.shift} = ${rawPosition}, so after wrapping ${rawPosition} - 26 = ${letterPosition(result)}, which is ${result}`;
    },
  },
  {
    id: "ALPHA_CYCLIC_SHIFT_BACKWARD",
    label: "move backward by a fixed number of places and continue from Z before A",
    priority: 2,
    contexts: shifts(2, 3, 4, 5, 6),
    eligibleInputPositions: ALL_POSITIONS,
    apply: (letter, context) => {
      if (context.shift === undefined || letterPosition(letter) - context.shift >= 1) return null;
      return nonIdentity(letter, shiftLetter(letter, -context.shift));
    },
    explain: (letter, result, context) => {
      const rawPosition = letterPosition(letter) - context.shift!;
      return `${letter} is at position ${letterPosition(letter)}; ${letterPosition(letter)} - ${context.shift} = ${rawPosition}, so after wrapping ${rawPosition} + 26 = ${letterPosition(result)}, which is ${result}`;
    },
  },
  {
    id: "ALPHA_OPPOSITE",
    label: "replace the letter by its opposite alphabet partner",
    priority: 2,
    contexts: fixed,
    eligibleInputPositions: ALL_POSITIONS,
    apply: (letter) => nonIdentity(letter, oppositeLetter(letter)),
    explain: (letter, result) =>
      `${letter} is at position ${letterPosition(letter)}; its opposite position is 27 - ${letterPosition(letter)} = ${letterPosition(result)}, which is ${result}`,
  },
  {
    id: "ALPHA_EQUAL_DISTANCE",
    label: "move the same distance toward the middle of the alphabet",
    priority: 3,
    contexts: distances(2, 3, 4, 5),
    eligibleInputPositions: ALL_POSITIONS,
    apply: (letter, context) => {
      if (context.distance === undefined) return null;
      const position = letterPosition(letter);
      const outputPosition = position <= 13 ? position + context.distance : position - context.distance;
      return fromBoundedPosition(letter, outputPosition);
    },
    explain: (letter, result, context) => {
      const direction = letterPosition(letter) <= 13 ? "forward" : "backward";
      return `${letter} is ${places(context.distance)} from ${result} when moving ${direction} toward the middle of the alphabet`;
    },
  },
  {
    id: "ALPHA_REVERSE_POSITION",
    label: "take the reverse-position letter and then apply the fixed adjustment",
    priority: 4,
    contexts: offsets(-4, -3, -2, -1, 1, 2, 3, 4),
    eligibleInputPositions: ALL_POSITIONS,
    apply: (letter, context) => {
      if (context.offset === undefined) return null;
      return fromBoundedPosition(letter, 27 - letterPosition(letter) + context.offset);
    },
    explain: (letter, result, context) => {
      const reverse = oppositeLetter(letter);
      const direction = context.offset! > 0 ? "forward" : "backward";
      return `the reverse-position letter of ${letter} is ${reverse}; moving ${Math.abs(context.offset!)} place${Math.abs(context.offset!) === 1 ? "" : "s"} ${direction} gives ${result}`;
    },
  },
  {
    id: "ALPHA_DOUBLED_MOVEMENT",
    label: "double the alphabet position",
    priority: 5,
    contexts: fixed,
    eligibleInputPositions: DOUBLED_INPUTS,
    apply: (letter) => fromBoundedPosition(letter, letterPosition(letter) * 2),
    explain: (letter, result) =>
      `${letter} is at position ${letterPosition(letter)}; 2 × ${letterPosition(letter)} = ${letterPosition(result)}, which is ${result}`,
  },
  {
    id: "ALPHA_CLASS_CORRESPONDENCE",
    label: "match vowels and consonants by their order within the two letter classes",
    priority: 4,
    contexts: [
      { classDirection: "VOWEL_TO_CONSONANT" },
      { classDirection: "CONSONANT_TO_VOWEL" },
    ],
    eligibleInputPositions: [...VOWELS, ...CORRESPONDING_CONSONANTS].map(letterPosition),
    apply: (letter, context) => {
      if (context.classDirection === "VOWEL_TO_CONSONANT") {
        const index = VOWELS.indexOf(letter as (typeof VOWELS)[number]);
        return index < 0 ? null : CORRESPONDING_CONSONANTS[index];
      }
      if (context.classDirection === "CONSONANT_TO_VOWEL") {
        const index = CORRESPONDING_CONSONANTS.indexOf(letter as (typeof CORRESPONDING_CONSONANTS)[number]);
        return index < 0 ? null : VOWELS[index];
      }
      return null;
    },
    explain: (letter, result, context) => {
      const inputList = context.classDirection === "VOWEL_TO_CONSONANT" ? VOWELS : CORRESPONDING_CONSONANTS;
      const classIndex = inputList.indexOf(letter as never) + 1;
      const direction = context.classDirection === "VOWEL_TO_CONSONANT" ? "vowel to consonant" : "consonant to vowel";
      return `${letter} is the ${classIndex}${classIndex === 1 ? "st" : classIndex === 2 ? "nd" : classIndex === 3 ? "rd" : "th"} letter in its selected class; the ${direction} correspondence gives ${result}`;
    },
  },
  {
    id: "ALPHA_TWO_STEP_POSITION",
    label: "double the position and then add or subtract one",
    priority: 6,
    contexts: [{ adjustment: -1 }, { adjustment: 1 }],
    eligibleInputPositions: TWO_STEP_INPUTS,
    apply: (letter, context) => {
      if (context.adjustment === undefined) return null;
      return fromBoundedPosition(letter, letterPosition(letter) * 2 + context.adjustment);
    },
    explain: (letter, result, context) => {
      const sign = context.adjustment === 1 ? "+ 1" : "- 1";
      return `${letter} is at position ${letterPosition(letter)}; 2 × ${letterPosition(letter)} ${sign} = ${letterPosition(result)}, which is ${result}`;
    },
  },
];

export function alphabetRuleById(id: string): AlphabetRuleDefinition {
  const rule = ANA_CP005_RULES.find((entry) => entry.id === id);
  if (!rule) throw new Error(`Unknown ANA-CP-005 rule: ${id}`);
  return rule;
}
