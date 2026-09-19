import { oppositeDirection, rotateDirection } from "../foundation/directions";
import type { Direction } from "../foundation/types";
import { MULTI_DIRECTION_LABELS } from "./question-language.en";
import { shuffle, type MultiMoverAnswer, type RenderedMultiMoverOption } from "./model";

function answerKey(answer: MultiMoverAnswer): string {
  if (answer.kind === "DIRECTION") return `D:${answer.direction}`;
  if (answer.kind === "DISTANCE") return `N:${answer.distance}`;
  if (answer.kind === "DIRECTION_DISTANCE") return `DD:${answer.direction}:${answer.distance}`;
  if (answer.kind === "ENTITY") return `E:${answer.entity}`;
  return `P:${[...answer.entities].sort().join("|")}`;
}

export function validateOptions(options: readonly RenderedMultiMoverOption[], correct: MultiMoverAnswer): number {
  if (options.length !== 4) throw new Error(`DIR-CP-005 requires four options, received ${options.length}`);
  if (new Set(options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size !== 4) throw new Error("DIR-CP-005 option labels must be unique");
  const key = answerKey(correct);
  const indexes = options.map((option, index) => answerKey(option.value) === key ? index : -1).filter((index) => index >= 0);
  if (indexes.length !== 1) throw new Error(`DIR-CP-005 expected one correct option, received ${indexes.length}`);
  return indexes[0];
}

export function directionOptions(correct: Direction, seed: number): readonly RenderedMultiMoverOption[] {
  const values = [
    { direction: correct, errorLabel: null },
    { direction: oppositeDirection(correct), errorLabel: "QUERY_RELATION_REVERSED" },
    { direction: rotateDirection(correct, 2), errorLabel: "CLOCKWISE_QUADRANT_ERROR" },
    { direction: rotateDirection(correct, -2), errorLabel: "ANTICLOCKWISE_QUADRANT_ERROR" },
  ];
  return shuffle(values.map(({ direction, errorLabel }) => ({ value: { kind: "DIRECTION", direction } as const, label: MULTI_DIRECTION_LABELS[direction], errorLabel })), seed * 41 + 7);
}

function wrongDistance(correct: number, dx: number, dy: number): number {
  const candidates = [Math.abs(dx) + Math.abs(dy), Math.max(Math.abs(dx), Math.abs(dy)), correct + 2, Math.max(1, correct - 2), correct + 3];
  return candidates.find((value) => value !== correct)!;
}

export function distanceOptions(correct: number, dx: number, dy: number, seed: number): readonly RenderedMultiMoverOption[] {
  const candidates = [correct, wrongDistance(correct, dx, dy), correct + 4, Math.max(1, correct - 3)];
  const unique = [...new Set(candidates)];
  while (unique.length < 4) unique.push(correct + unique.length + 5);
  return shuffle(unique.slice(0, 4).map((distance) => ({ value: { kind: "DISTANCE", distance } as const, label: `${distance} metres`, errorLabel: distance === correct ? null : "ENDPOINT_DISTANCE_ERROR" })), seed * 43 + 11);
}

export function combinedOptions(direction: Direction, distance: number, dx: number, dy: number, seed: number): readonly RenderedMultiMoverOption[] {
  const wrong = wrongDistance(distance, dx, dy);
  const opposite = oppositeDirection(direction);
  const values = [
    { direction, distance, errorLabel: null },
    { direction: opposite, distance, errorLabel: "QUERY_RELATION_REVERSED" },
    { direction, distance: wrong, errorLabel: "ENDPOINT_DISTANCE_ERROR" },
    { direction: opposite, distance: wrong, errorLabel: "DIRECTION_AND_DISTANCE_ERROR" },
  ];
  return shuffle(values.map((value) => ({ value: { kind: "DIRECTION_DISTANCE", direction: value.direction, distance: value.distance } as const, label: `${MULTI_DIRECTION_LABELS[value.direction]}, ${value.distance} metres`, errorLabel: value.errorLabel })), seed * 47 + 13);
}

export function entityOptions(correct: string, names: readonly string[], seed: number): readonly RenderedMultiMoverOption[] {
  return shuffle(names.map((entity) => ({ value: { kind: "ENTITY", entity } as const, label: entity, errorLabel: entity === correct ? null : "WRONG_MOVER_ENDPOINT" })), seed * 53 + 17);
}

export function pairLabel(pair: readonly [string, string]): string {
  return [...pair].sort().join(" and ");
}

export function pairOptions(correct: readonly [string, string], names: readonly string[], seed: number): readonly RenderedMultiMoverOption[] {
  const allPairs: [string, string][] = [];
  for (let left = 0; left < names.length; left += 1) for (let right = left + 1; right < names.length; right += 1) allPairs.push([names[left], names[right]]);
  const correctKey = pairLabel(correct);
  const selected = [correct, ...shuffle(allPairs.filter((pair) => pairLabel(pair) !== correctKey), seed * 59 + 19).slice(0, 3)];
  return shuffle(selected.map((pair) => ({ value: { kind: "ENTITY_PAIR", entities: [...pair].sort() as [string, string] } as const, label: pairLabel(pair), errorLabel: pairLabel(pair) === correctKey ? null : "DIFFERENT_ENDPOINTS" })), seed * 61 + 23);
}

