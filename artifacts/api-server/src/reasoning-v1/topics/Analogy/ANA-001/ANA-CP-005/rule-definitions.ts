import { letterFromPosition, letterPosition, oppositeLetter, shiftLetter } from "../foundation/alphabet";

export interface AlphabetRuleContext {
  shift?: number;
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

const shifts = (...values: number[]): readonly AlphabetRuleContext[] => values.map((shift) => ({ shift }));
const fixed: readonly AlphabetRuleContext[] = [{}];

function nonIdentity(input: string, output: string): string | null {
  return input === output ? null : output;
}

function positionTransform(
  letter: string,
  eligiblePositions: readonly number[],
  transform: (position: number) => number,
): string | null {
  const inputPosition = letterPosition(letter);
  if (!eligiblePositions.includes(inputPosition)) return null;
  const outputPosition = transform(inputPosition);
  if (!Number.isInteger(outputPosition) || outputPosition < 1 || outputPosition > 26) return null;
  return nonIdentity(letter, letterFromPosition(outputPosition));
}

const DOUBLE_INPUTS = positions(2, 13);
const HALF_INPUTS = positions(4, 26, (value) => value % 2 === 0);
const HALF_ROUND_UP_INPUTS = positions(5, 25, (value) => value % 2 === 1);
const OPPOSITE_DOUBLE_INPUTS = positions(2, 12);

export const ANA_CP005_RULES: readonly AlphabetRuleDefinition[] = [
  {
    id: "ALPHA_SHIFT_FORWARD",
    label: "move forward by the question's fixed alphabet shift",
    priority: 1,
    contexts: shifts(1, 2, 3, 4, 5, 6),
    eligibleInputPositions: positions(1, 26),
    apply: (letter, context) => context.shift === undefined ? null : nonIdentity(letter, shiftLetter(letter, context.shift)),
    explain: (letter, result, context) => `${letter} is moved ${context.shift} place${context.shift === 1 ? "" : "s"} forward to get ${result}`,
  },
  {
    id: "ALPHA_SHIFT_BACKWARD",
    label: "move backward by the question's fixed alphabet shift",
    priority: 1,
    contexts: shifts(1, 2, 3, 4, 5, 6),
    eligibleInputPositions: positions(1, 26),
    apply: (letter, context) => context.shift === undefined ? null : nonIdentity(letter, shiftLetter(letter, -context.shift)),
    explain: (letter, result, context) => `${letter} is moved ${context.shift} place${context.shift === 1 ? "" : "s"} backward to get ${result}`,
  },
  {
    id: "ALPHA_OPPOSITE",
    label: "use the opposite letter of the alphabet",
    priority: 2,
    contexts: fixed,
    eligibleInputPositions: positions(1, 26),
    apply: (letter) => nonIdentity(letter, oppositeLetter(letter)),
    explain: (letter, result) => `${letter} is at position ${letterPosition(letter)} and its opposite position is ${27 - letterPosition(letter)}, giving ${result}`,
  },
  {
    id: "ALPHA_OPPOSITE_FORWARD",
    label: "take the opposite letter and then move forward by a fixed shift",
    priority: 4,
    contexts: shifts(1, 2, 3, 4),
    eligibleInputPositions: positions(1, 26),
    apply: (letter, context) => context.shift === undefined ? null : nonIdentity(letter, shiftLetter(oppositeLetter(letter), context.shift)),
    explain: (letter, result, context) => `the opposite of ${letter} is ${oppositeLetter(letter)}; moving ${context.shift} place${context.shift === 1 ? "" : "s"} forward gives ${result}`,
  },
  {
    id: "ALPHA_OPPOSITE_BACKWARD",
    label: "take the opposite letter and then move backward by a fixed shift",
    priority: 4,
    contexts: shifts(1, 2, 3, 4),
    eligibleInputPositions: positions(1, 26),
    apply: (letter, context) => context.shift === undefined ? null : nonIdentity(letter, shiftLetter(oppositeLetter(letter), -context.shift)),
    explain: (letter, result, context) => `the opposite of ${letter} is ${oppositeLetter(letter)}; moving ${context.shift} place${context.shift === 1 ? "" : "s"} backward gives ${result}`,
  },
  {
    id: "ALPHA_POSITION_DOUBLE",
    label: "double the alphabet position",
    priority: 5,
    contexts: fixed,
    eligibleInputPositions: DOUBLE_INPUTS,
    apply: (letter) => positionTransform(letter, DOUBLE_INPUTS, (position) => position * 2),
    explain: (letter, result) => `${letter} is at position ${letterPosition(letter)}; doubling it gives ${letterPosition(letter) * 2}, which is ${result}`,
  },
  {
    id: "ALPHA_POSITION_DOUBLE_MINUS_ONE",
    label: "double the alphabet position and subtract one",
    priority: 5,
    contexts: fixed,
    eligibleInputPositions: DOUBLE_INPUTS,
    apply: (letter) => positionTransform(letter, DOUBLE_INPUTS, (position) => position * 2 - 1),
    explain: (letter, result) => `${letter} is at position ${letterPosition(letter)}; 2 × ${letterPosition(letter)} - 1 = ${letterPosition(letter) * 2 - 1}, which is ${result}`,
  },
  {
    id: "ALPHA_POSITION_HALF",
    label: "halve an even alphabet position",
    priority: 5,
    contexts: fixed,
    eligibleInputPositions: HALF_INPUTS,
    apply: (letter) => positionTransform(letter, HALF_INPUTS, (position) => position / 2),
    explain: (letter, result) => `${letter} is at position ${letterPosition(letter)}; half of it is ${letterPosition(letter) / 2}, which is ${result}`,
  },
  {
    id: "ALPHA_POSITION_HALF_ROUND_UP",
    label: "add one to an odd alphabet position and halve it",
    priority: 6,
    contexts: fixed,
    eligibleInputPositions: HALF_ROUND_UP_INPUTS,
    apply: (letter) => positionTransform(letter, HALF_ROUND_UP_INPUTS, (position) => (position + 1) / 2),
    explain: (letter, result) => `${letter} is at position ${letterPosition(letter)}; (${letterPosition(letter)} + 1) ÷ 2 = ${(letterPosition(letter) + 1) / 2}, which is ${result}`,
  },
  {
    id: "ALPHA_OPPOSITE_OF_DOUBLE",
    label: "double the alphabet position and then take its opposite position",
    priority: 6,
    contexts: fixed,
    eligibleInputPositions: OPPOSITE_DOUBLE_INPUTS,
    apply: (letter) => positionTransform(letter, OPPOSITE_DOUBLE_INPUTS, (position) => 27 - position * 2),
    explain: (letter, result) => `${letter} is at position ${letterPosition(letter)}; doubling gives ${letterPosition(letter) * 2}, whose opposite position is ${27 - letterPosition(letter) * 2}, giving ${result}`,
  },
];

export function alphabetRuleById(id: string): AlphabetRuleDefinition {
  const rule = ANA_CP005_RULES.find((entry) => entry.id === id);
  if (!rule) throw new Error(`Unknown ANA-CP-005 rule: ${id}`);
  return rule;
}
