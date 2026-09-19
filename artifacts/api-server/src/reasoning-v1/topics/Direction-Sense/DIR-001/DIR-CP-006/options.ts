import { oppositeDirection, turnLeft, turnRight } from "../foundation/directions";
import type { Direction } from "../foundation/types";
import { CODE_SYMBOLS, type CodeSymbol, type CodedDirectionAnswer, type CodedDirectionOption, type DirectionCodeMap } from "./types";
import { DIRECTION_LABELS, seededRandom, shuffle, symbolForDirection } from "./code-system";

function finalize(options: readonly CodedDirectionOption[], seed: number): readonly CodedDirectionOption[] {
  const shuffled = shuffle(options, seededRandom(seed * 173 + 101));
  if (shuffled.length !== 4) throw new Error(`Expected four coded-direction options, received ${shuffled.length}`);
  if (new Set(shuffled.map((option) => option.label.trim().toLocaleLowerCase("en-IN"))).size !== 4) {
    throw new Error("Coded-direction options must have four unique labels");
  }
  if (shuffled.filter((option) => option.errorLabel === null).length !== 1) {
    throw new Error("Coded-direction options must contain exactly one correct answer");
  }
  return shuffled;
}

export function directionOptions(correct: Direction, seed: number): readonly CodedDirectionOption[] {
  const candidates: readonly { readonly direction: Direction; readonly errorLabel: string }[] = [
    { direction: oppositeDirection(correct), errorLabel: "QUERY_RELATION_REVERSED" },
    { direction: turnLeft(correct), errorLabel: "ANTICLOCKWISE_QUADRANT_ERROR" },
    { direction: turnRight(correct), errorLabel: "CLOCKWISE_QUADRANT_ERROR" },
    { direction: turnLeft(turnLeft(correct)), errorLabel: "DOUBLE_TURN_ERROR" },
  ];
  const used = new Set<Direction>([correct]);
  const distractors: CodedDirectionOption[] = [];
  for (const candidate of candidates) {
    if (used.has(candidate.direction)) continue;
    used.add(candidate.direction);
    distractors.push({
      value: { kind: "DIRECTION", direction: candidate.direction },
      label: DIRECTION_LABELS[candidate.direction],
      errorLabel: candidate.errorLabel,
    });
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`Unable to build direction distractors for ${correct}`);
  return finalize([
    { value: { kind: "DIRECTION", direction: correct }, label: DIRECTION_LABELS[correct], errorLabel: null },
    ...distractors,
  ], seed);
}

export function entityOptions(correct: string, entities: readonly string[], seed: number): readonly CodedDirectionOption[] {
  const distractors = entities.filter((entity) => entity !== correct).slice(0, 3);
  if (distractors.length !== 3) throw new Error("Entity options require exactly three distractors");
  return finalize([
    { value: { kind: "ENTITY", entity: correct }, label: correct, errorLabel: null },
    ...distractors.map((entity, index) => ({
      value: { kind: "ENTITY", entity } as CodedDirectionAnswer,
      label: entity,
      errorLabel: index === 0 ? "REFERENCE_ENTITY_CONFUSED" : index === 1 ? "ADJACENT_DIRECTION_ERROR" : "OPPOSITE_ENTITY_SELECTED",
    })),
  ], seed);
}

export function symbolOptions(correct: CodeSymbol, seed: number, errorPrefix: string): readonly CodedDirectionOption[] {
  return finalize(CODE_SYMBOLS.map((symbol) => ({
    value: { kind: "CODE_SYMBOL", symbol },
    label: symbol,
    errorLabel: symbol === correct ? null : `${errorPrefix}_${symbol.charCodeAt(0)}`,
  })), seed);
}

export function equivalentStatementOptions(
  map: DirectionCodeMap,
  subject: string,
  reference: string,
  correctDirection: "NORTH" | "EAST" | "SOUTH" | "WEST",
  seed: number,
): readonly CodedDirectionOption[] {
  const correctSymbol = symbolForDirection(map, correctDirection);
  const opposite = oppositeDirection(correctDirection) as "NORTH" | "EAST" | "SOUTH" | "WEST";
  const adjacent = turnRight(correctDirection) as "NORTH" | "EAST" | "SOUTH" | "WEST";
  const correctStatement = `${subject} ${correctSymbol} ${reference}`;
  const options: CodedDirectionOption[] = [
    { value: { kind: "CODED_STATEMENT", statement: correctStatement }, label: correctStatement, errorLabel: null },
    {
      value: { kind: "CODED_STATEMENT", statement: `${subject} ${symbolForDirection(map, opposite)} ${reference}` },
      label: `${subject} ${symbolForDirection(map, opposite)} ${reference}`,
      errorLabel: "OPPOSITE_CODE_SELECTED",
    },
    {
      value: { kind: "CODED_STATEMENT", statement: `${reference} ${correctSymbol} ${subject}` },
      label: `${reference} ${correctSymbol} ${subject}`,
      errorLabel: "ENTITY_ORDER_REVERSED",
    },
    {
      value: { kind: "CODED_STATEMENT", statement: `${subject} ${symbolForDirection(map, adjacent)} ${reference}` },
      label: `${subject} ${symbolForDirection(map, adjacent)} ${reference}`,
      errorLabel: "ADJACENT_CODE_SELECTED",
    },
  ];
  return finalize(options, seed);
}

export function conclusionOptions(
  correctStatement: string,
  wrongStatements: readonly string[],
  seed: number,
): readonly CodedDirectionOption[] {
  if (wrongStatements.length < 3) throw new Error("Conclusion options require three false statements");
  return finalize([
    { value: { kind: "CONCLUSION", statement: correctStatement }, label: correctStatement, errorLabel: null },
    ...wrongStatements.slice(0, 3).map((statement, index) => ({
      value: { kind: "CONCLUSION", statement } as CodedDirectionAnswer,
      label: statement,
      errorLabel: index === 0 ? "QUERY_RELATION_REVERSED" : index === 1 ? "WRONG_QUADRANT" : "WRONG_ENTITY_PAIR",
    })),
  ], seed);
}

export function correctIndex(options: readonly CodedDirectionOption[]): number {
  const index = options.findIndex((option) => option.errorLabel === null);
  if (index < 0) throw new Error("Correct option is missing");
  return index;
}
