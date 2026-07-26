import type { Coordinate, Direction, DirectionOption } from "../foundation/types";
import { verifyMoverPath } from "./independent-solver";
import type { DirCp005AnswerDemand } from "./task-registry";
import type { MoverPath, MoverStep, MultiMoverDiagramSpec } from "./types";

export const NAMES = ["Aman", "Beena", "Charan", "Deepa", "Farhan", "Gurpreet", "Harpreet", "Isha", "Jatin", "Kiran", "Manpreet", "Neha"] as const;
export const CARDINALS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;

export type MultiMoverAnswer =
  | { readonly kind: "DIRECTION"; readonly direction: Direction }
  | { readonly kind: "DISTANCE"; readonly distance: number }
  | { readonly kind: "DIRECTION_DISTANCE"; readonly direction: Direction; readonly distance: number }
  | { readonly kind: "ENTITY"; readonly entity: string }
  | { readonly kind: "ENTITY_PAIR"; readonly entities: readonly [string, string] };

export interface RenderedMultiMoverOption extends DirectionOption<MultiMoverAnswer> {
  readonly label: string;
}

export interface MultiMoverExplanation {
  readonly given: string;
  readonly movementLines: readonly string[];
  readonly endpointLines: readonly string[];
  readonly comparisonLine: string;
  readonly calculationLine: string | null;
  readonly conclusion: string;
  readonly diagram: MultiMoverDiagramSpec;
}

export interface GeneratedMultiMoverQuestion {
  readonly qlId: string;
  readonly checkpointId: "DIR-CP-005";
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly RenderedMultiMoverOption[];
  readonly correctIndex: number;
  readonly correctAnswer: MultiMoverAnswer;
  readonly explanation: MultiMoverExplanation;
  readonly metadata: {
    readonly answerDemand: DirCp005AnswerDemand;
    readonly moverCount: number;
    readonly sameOrigin: boolean;
    readonly solverVerified: true;
    readonly solveMode: null;
  };
}

function seededRandom(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = seededRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function namesFor(seed: number, count: number): readonly string[] {
  return shuffle(NAMES, seed * 37 + 5).slice(0, count);
}

function vectorFor(step: MoverStep): Coordinate {
  switch (step.direction) {
    case "NORTH": return { x: 0, y: step.distance };
    case "EAST": return { x: step.distance, y: 0 };
    case "SOUTH": return { x: 0, y: -step.distance };
    case "WEST": return { x: -step.distance, y: 0 };
  }
}

function applyStep(point: Coordinate, step: MoverStep): Coordinate {
  const vector = vectorFor(step);
  return { x: point.x + vector.x, y: point.y + vector.y };
}

function directionStep(dx: number, dy: number, horizontalFirst: boolean): readonly MoverStep[] {
  const horizontal: MoverStep | null = dx === 0 ? null : { direction: dx > 0 ? "EAST" : "WEST", distance: Math.abs(dx) };
  const vertical: MoverStep | null = dy === 0 ? null : { direction: dy > 0 ? "NORTH" : "SOUTH", distance: Math.abs(dy) };
  if (horizontal && vertical) return horizontalFirst ? [horizontal, vertical] : [vertical, horizontal];
  const direct = horizontal ?? vertical;
  if (!direct) {
    return [
      { direction: "EAST", distance: 3 },
      { direction: "NORTH", distance: 4 },
      { direction: "WEST", distance: 3 },
      { direction: "SOUTH", distance: 4 },
    ];
  }
  const detour = 3;
  const perpendicularA: MoverStep = horizontal
    ? { direction: "NORTH", distance: detour }
    : { direction: "EAST", distance: detour };
  const perpendicularB: MoverStep = horizontal
    ? { direction: "SOUTH", distance: detour }
    : { direction: "WEST", distance: detour };
  return horizontalFirst ? [perpendicularA, direct, perpendicularB] : [direct, perpendicularA, perpendicularB];
}

export function buildPath(name: string, startLabel: string, start: Coordinate, endpoint: Coordinate, seed: number): MoverPath {
  const steps = directionStep(endpoint.x - start.x, endpoint.y - start.y, seed % 2 === 0);
  const points: Coordinate[] = [start];
  for (const step of steps) points.push(applyStep(points[points.length - 1], step));
  const path: MoverPath = { name, startLabel, start, steps, points, endpoint: points[points.length - 1] };
  if (path.endpoint.x !== endpoint.x || path.endpoint.y !== endpoint.y) throw new Error(`Path construction missed endpoint for ${name}`);
  verifyMoverPath(path);
  return path;
}

export function rotate(point: Coordinate, quarterTurns: number): Coordinate {
  let current = point;
  for (let index = 0; index < ((quarterTurns % 4) + 4) % 4; index += 1) current = { x: current.y, y: -current.x };
  return current;
}

export function endpointDescription(path: MoverPath, referenceLabel: string): string {
  const parts: string[] = [];
  if (path.endpoint.x) parts.push(`${Math.abs(path.endpoint.x)} metres ${path.endpoint.x > 0 ? "East" : "West"}`);
  if (path.endpoint.y) parts.push(`${Math.abs(path.endpoint.y)} metres ${path.endpoint.y > 0 ? "North" : "South"}`);
  if (parts.length === 0) return `${path.name} finishes at ${referenceLabel}.`;
  return `${path.name} finishes ${parts.join(" and ")} of ${referenceLabel}.`;
}

