import { distanceBetween } from "../foundation/coordinates";
import type { Coordinate } from "../foundation/types";
import { distanceIndependent } from "./independent-solver";
import { buildPath, namesFor, rotate } from "./model";
import type { MoverPath } from "./types";

export function pairScenario(seed: number): { readonly paths: readonly [MoverPath, MoverPath]; readonly sameOrigin: boolean; readonly originRelation: string | null; readonly referenceLabel: string } {
  const names = namesFor(seed + 100, 2);
  const sameOrigin = seed % 2 === 0;
  const firstStart = { x: 0, y: 0 };
  const secondStart = sameOrigin ? firstStart : rotate({ x: 6 + Math.abs(seed % 5), y: 0 }, Math.floor(Math.abs(seed) / 2) % 4);
  const directionDeltas: readonly Coordinate[] = [
    { x: 0, y: 10 }, { x: 6, y: 8 }, { x: 12, y: 0 }, { x: 9, y: -12 },
    { x: 0, y: -15 }, { x: -8, y: -15 }, { x: -12, y: 0 }, { x: -5, y: 12 },
  ];
  const delta = directionDeltas[Math.abs(seed) % directionDeltas.length];
  const referenceEndpoint = rotate({ x: 4 + Math.abs(seed % 4), y: 3 + Math.abs((seed * 3) % 5) }, Math.floor(Math.abs(seed) / 8) % 4);
  const subjectEndpoint = { x: referenceEndpoint.x + delta.x, y: referenceEndpoint.y + delta.y };
  const first = buildPath(names[0], sameOrigin ? "O" : "P", firstStart, subjectEndpoint, seed * 7 + 1);
  const second = buildPath(names[1], sameOrigin ? "O" : "Q", secondStart, referenceEndpoint, seed * 7 + 2);
  const originRelation = sameOrigin ? null : `${names[0]} starts from point P. ${names[1]} starts from point Q, which is ${Math.abs(secondStart.x || secondStart.y)} metres ${secondStart.x > 0 ? "east" : secondStart.x < 0 ? "west" : secondStart.y > 0 ? "north" : "south"} of P.`;
  return { paths: [first, second], sameOrigin, originRelation, referenceLabel: sameOrigin ? "point O" : "point P" };
}

export function fourMoverPaths(seed: number, endpoints: readonly Coordinate[], starts?: readonly Coordinate[]): readonly MoverPath[] {
  const names = namesFor(seed + 500, 4);
  const actualStarts = starts ?? endpoints.map(() => ({ x: 0, y: 0 }));
  return names.map((name, index) => buildPath(name, starts ? String.fromCharCode(80 + index) : "O", actualStarts[index], endpoints[index], seed * 11 + index));
}

export function comparisonComponents(from: Coordinate, to: Coordinate): { readonly horizontal: number; readonly vertical: number; readonly text: string } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const parts: string[] = [];
  if (dx) parts.push(`${Math.abs(dx)} metres ${dx > 0 ? "East" : "West"}`);
  if (dy) parts.push(`${Math.abs(dy)} metres ${dy > 0 ? "North" : "South"}`);
  return { horizontal: Math.abs(dx), vertical: Math.abs(dy), text: parts.join(" and ") || "no separation" };
}

export function calculationLine(from: Coordinate, to: Coordinate, distance: number): string {
  const delta = distanceBetween(from, to);
  const horizontal = Math.abs(delta.dx);
  const vertical = Math.abs(delta.dy);
  if (horizontal === 0 || vertical === 0) return `Only one net direction remains, so the endpoint separation is ${distance} metres.`;
  return `Endpoint separation = √(${horizontal}² + ${vertical}²) = √(${horizontal ** 2} + ${vertical ** 2}) = √${delta.squaredDistance} = ${distance} metres.`;
}

