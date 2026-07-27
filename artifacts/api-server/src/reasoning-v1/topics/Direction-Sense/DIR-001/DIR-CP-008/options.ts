import { classifyDirection, oppositeDirection } from "../foundation/directions";
import type { Direction } from "../foundation/types";
import { DIRECTION_LABELS, TURN_LABELS } from "./geometry";
import type { AdvancedAnswer, AdvancedOption, AdvancedTurn } from "./types";

export function answerKey(answer: AdvancedAnswer): string {
  switch (answer.kind) {
    case "DIRECTION": return `D:${answer.direction}`;
    case "TURN": return `T:${answer.turn}`;
    case "STATEMENT": return `S:${answer.statementIndex}`;
    case "DISTANCE": return `M:${answer.distance}`;
    case "DIRECTION_DISTANCE": return `P:${answer.direction}:${answer.distance}`;
  }
}

function rng(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], seed: number): T[] {
  const output = [...values], random = rng(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [output[index], output[swap]] = [output[swap], output[index]];
  }
  return output;
}

function directionVector(direction: Direction): readonly [number, number] {
  switch (direction) {
    case "NORTH": return [0, 1];
    case "NORTH_EAST": return [1, 1];
    case "EAST": return [1, 0];
    case "SOUTH_EAST": return [1, -1];
    case "SOUTH": return [0, -1];
    case "SOUTH_WEST": return [-1, -1];
    case "WEST": return [-1, 0];
    case "NORTH_WEST": return [-1, 1];
  }
}

function flipDirection(direction: Direction, axis: "X" | "Y"): Direction {
  const [x, y] = directionVector(direction);
  const value = classifyDirection(axis === "X" ? -x : x, axis === "Y" ? -y : y);
  if (value === "SAME_POSITION") throw new Error("A direction flip cannot produce coincidence");
  return value;
}

export function directionOptions(correct: Direction, seed: number): AdvancedOption[] {
  const cardinal: readonly Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];
  if (cardinal.includes(correct)) {
    return shuffle(cardinal.map((direction) => ({
      value: { kind: "DIRECTION", direction } as const,
      label: DIRECTION_LABELS[direction],
      errorLabel: direction === correct ? null : direction === oppositeDirection(correct) ? "OPPOSITE_DIRECTION" : "WRONG_CARDINAL_AXIS",
    })), seed * 17 + 11);
  }
  const candidates: readonly [Direction, string | null][] = [
    [correct, null],
    [oppositeDirection(correct), "OPPOSITE_DIRECTION"],
    [flipDirection(correct, "X"), "X_SIGN_REVERSED"],
    [flipDirection(correct, "Y"), "Y_SIGN_REVERSED"],
  ];
  const unique = new Map<Direction, string | null>();
  for (const [direction, label] of candidates) if (!unique.has(direction)) unique.set(direction, label);
  const fallback: Direction[] = ["NORTH_EAST", "SOUTH_EAST", "SOUTH_WEST", "NORTH_WEST"];
  for (const direction of fallback) if (unique.size < 4 && !unique.has(direction)) unique.set(direction, "WRONG_QUADRANT");
  return shuffle([...unique.entries()].slice(0, 4).map(([direction, errorLabel]) => ({
    value: { kind: "DIRECTION", direction } as const,
    label: DIRECTION_LABELS[direction],
    errorLabel,
  })), seed * 17 + 11);
}

export function turnOptions(correct: AdvancedTurn, seed: number): AdvancedOption[] {
  const turns: readonly AdvancedTurn[] = ["LEFT", "RIGHT", "ABOUT", "NO_TURN"];
  return shuffle(turns.map((turn) => ({
    value: { kind: "TURN", turn } as const,
    label: TURN_LABELS[turn],
    errorLabel: turn === correct ? null : turn === "NO_TURN" ? "NO_TURN_ASSUMED" : "WRONG_TURN",
  })), seed * 19 + 7);
}

export function statementOptions(labels: readonly string[], correctIndex: number, seed: number): AdvancedOption[] {
  if (labels.length !== 4) throw new Error("Statement questions require exactly four statements");
  return shuffle(labels.map((label, statementIndex) => ({
    value: { kind: "STATEMENT", statementIndex } as const,
    label,
    errorLabel: statementIndex === correctIndex ? null : "CONSISTENT_STATEMENT_SELECTED",
  })), seed * 23 + 5);
}

export function distanceOptions(correct: number, totalDistance: number, dx: number, dy: number, seed: number): AdvancedOption[] {
  const values = [correct, totalDistance, Math.abs(dx) + Math.abs(dy), Math.max(Math.abs(dx), Math.abs(dy)), Math.min(Math.abs(dx), Math.abs(dy))]
    .filter((value) => Number.isInteger(value) && value > 0);
  const unique = [...new Set(values)];
  for (let delta = 1; unique.length < 4; delta += 1) if (!unique.includes(correct + delta)) unique.push(correct + delta);
  return shuffle(unique.slice(0, 4).map((distance) => ({
    value: { kind: "DISTANCE", distance } as const,
    label: `${distance} metres`,
    errorLabel: distance === correct ? null : distance === totalDistance ? "TOTAL_DISTANCE_NOT_DISPLACEMENT" : "DISTANCE_COMPONENT_ERROR",
  })), seed * 29 + 3);
}

export function directionDistanceOptions(correctDirection: Direction, correctDistance: number, seed: number): AdvancedOption[] {
  const wrongDirection = oppositeDirection(correctDirection);
  const wrongDistance = correctDistance + 2 + (seed % 3);
  const options: AdvancedOption[] = [
    { value: { kind: "DIRECTION_DISTANCE", direction: correctDirection, distance: correctDistance }, label: `${DIRECTION_LABELS[correctDirection]}, ${correctDistance} metres`, errorLabel: null },
    { value: { kind: "DIRECTION_DISTANCE", direction: wrongDirection, distance: correctDistance }, label: `${DIRECTION_LABELS[wrongDirection]}, ${correctDistance} metres`, errorLabel: "QUERY_RELATION_REVERSED" },
    { value: { kind: "DIRECTION_DISTANCE", direction: correctDirection, distance: wrongDistance }, label: `${DIRECTION_LABELS[correctDirection]}, ${wrongDistance} metres`, errorLabel: "DISTANCE_COMPONENT_ERROR" },
    { value: { kind: "DIRECTION_DISTANCE", direction: wrongDirection, distance: wrongDistance }, label: `${DIRECTION_LABELS[wrongDirection]}, ${wrongDistance} metres`, errorLabel: "COMBINED_DIRECTION_DISTANCE_ERROR" },
  ];
  return shuffle(options, seed * 31 + 13);
}
