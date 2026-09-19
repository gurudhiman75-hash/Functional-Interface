import { classifyDirection } from "../foundation/directions";
import type { CardinalDirection, Coordinate, Direction } from "../foundation/types";
import { CODE_SYMBOLS, type CodeRecoveryEvidence, type CodeSymbol, type CodedMovementStep, type CodedRelation, type DirectionCodeMap, type SolvedCodedGraph } from "./types";

export const CARDINAL_DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
export const PERSON_NAMES = [
  "Aman", "Beena", "Charan", "Deepa", "Farhan", "Gurpreet", "Harpreet", "Isha",
  "Jatin", "Kiran", "Manpreet", "Neha", "Pawan", "Riya", "Simran", "Taran",
] as const;

export const DIRECTION_LABELS: Readonly<Record<Direction, string>> = {
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
};

export const DIRECTION_PHRASES: Readonly<Record<Direction, string>> = {
  NORTH: "north",
  NORTH_EAST: "north-east",
  EAST: "east",
  SOUTH_EAST: "south-east",
  SOUTH: "south",
  SOUTH_WEST: "south-west",
  WEST: "west",
  NORTH_WEST: "north-west",
};

export function seededRandom(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

export function vectorFor(direction: CardinalDirection): Coordinate {
  switch (direction) {
    case "NORTH": return { x: 0, y: 1 };
    case "EAST": return { x: 1, y: 0 };
    case "SOUTH": return { x: 0, y: -1 };
    case "WEST": return { x: -1, y: 0 };
  }
}

export function addCoordinates(left: Coordinate, right: Coordinate): Coordinate {
  return { x: left.x + right.x, y: left.y + right.y };
}

export function subtractCoordinates(subject: Coordinate, reference: Coordinate): Coordinate {
  return { x: subject.x - reference.x, y: subject.y - reference.y };
}

export function sameCoordinate(left: Coordinate, right: Coordinate, epsilon = 1e-9): boolean {
  return Math.abs(left.x - right.x) <= epsilon && Math.abs(left.y - right.y) <= epsilon;
}

export function generateCodeMap(seed: number): DirectionCodeMap {
  const directions = shuffle(CARDINAL_DIRECTIONS, seededRandom(seed * 97 + 31));
  return Object.freeze({
    "@": directions[0],
    "#": directions[1],
    "%": directions[2],
    "&": directions[3],
  });
}

export function symbolForDirection(map: DirectionCodeMap, direction: CardinalDirection): CodeSymbol {
  const symbol = CODE_SYMBOLS.find((candidate) => map[candidate] === direction);
  if (!symbol) throw new Error(`No code symbol maps to ${direction}`);
  return symbol;
}

export function renderCodeMap(map: DirectionCodeMap): string {
  return CODE_SYMBOLS.map((symbol) => `${symbol} means ${DIRECTION_PHRASES[map[symbol]]} of`).join(", ");
}

export function renderCodedChain(relations: readonly CodedRelation[]): string {
  if (relations.length === 0) throw new Error("A coded chain requires at least one relation");
  const parts: string[] = [relations[0].subject, relations[0].symbol, relations[0].reference];
  for (let index = 1; index < relations.length; index += 1) {
    const previousReference = relations[index - 1].reference;
    const relation = relations[index];
    if (relation.subject !== previousReference) {
      return relations.map((item) => `${item.subject} ${item.symbol} ${item.reference}`).join(", ");
    }
    parts.push(relation.symbol, relation.reference);
  }
  return parts.join(" ");
}

export function solveRelationsCanonical(relations: readonly CodedRelation[], map: DirectionCodeMap): SolvedCodedGraph {
  if (relations.length === 0) return { coordinates: {}, connected: true, contradictions: [] };
  const entities = [...new Set(relations.flatMap((relation) => [relation.subject, relation.reference]))];
  const coordinates: Record<string, Coordinate> = { [relations[0].reference]: { x: 0, y: 0 } };
  const contradictions: string[] = [];
  let progress = true;
  while (progress) {
    progress = false;
    for (const relation of relations) {
      const vector = vectorFor(map[relation.symbol]);
      const subject = coordinates[relation.subject];
      const reference = coordinates[relation.reference];
      if (reference && !subject) {
        coordinates[relation.subject] = addCoordinates(reference, vector);
        progress = true;
      } else if (subject && !reference) {
        coordinates[relation.reference] = { x: subject.x - vector.x, y: subject.y - vector.y };
        progress = true;
      } else if (subject && reference) {
        const expected = addCoordinates(reference, vector);
        if (!sameCoordinate(expected, subject)) contradictions.push(`${relation.subject} ${relation.symbol} ${relation.reference}`);
      }
    }
  }
  return {
    coordinates,
    connected: entities.every((entity) => coordinates[entity] !== undefined),
    contradictions: [...new Set(contradictions)],
  };
}

export function directionBetween(coordinates: Readonly<Record<string, Coordinate>>, subject: string, reference: string): Direction {
  const subjectPoint = coordinates[subject];
  const referencePoint = coordinates[reference];
  if (!subjectPoint || !referencePoint) throw new Error(`Unknown query entity: ${subject} or ${reference}`);
  const vector = subtractCoordinates(subjectPoint, referencePoint);
  const direction = classifyDirection(vector.x, vector.y);
  if (direction === "SAME_POSITION") throw new Error(`Query entities ${subject} and ${reference} coincide`);
  return direction;
}

export function solveMovementCanonical(steps: readonly CodedMovementStep[], map: DirectionCodeMap): { readonly points: readonly Coordinate[]; readonly endpoint: Coordinate; readonly direction: Direction } {
  const points: Coordinate[] = [{ x: 0, y: 0 }];
  for (const step of steps) {
    const unit = vectorFor(map[step.symbol]);
    const current = points[points.length - 1];
    points.push({ x: current.x + unit.x * step.distance, y: current.y + unit.y * step.distance });
  }
  const endpoint = points[points.length - 1];
  const direction = classifyDirection(endpoint.x, endpoint.y);
  if (direction === "SAME_POSITION") throw new Error("Coded movement endpoint may not coincide with the start");
  return { points, endpoint, direction };
}

export function allCardinalMaps(): readonly DirectionCodeMap[] {
  const values = [...CARDINAL_DIRECTIONS];
  const permutations: CardinalDirection[][] = [];
  const build = (prefix: CardinalDirection[], remaining: CardinalDirection[]) => {
    if (remaining.length === 0) {
      permutations.push(prefix);
      return;
    }
    for (let index = 0; index < remaining.length; index += 1) {
      build([...prefix, remaining[index]], [...remaining.slice(0, index), ...remaining.slice(index + 1)]);
    }
  };
  build([], values);
  return permutations.map((directions) => ({ "@": directions[0], "#": directions[1], "%": directions[2], "&": directions[3] }));
}

export function evidenceResult(symbols: readonly CodeSymbol[], map: DirectionCodeMap): Direction | "SAME_POSITION" {
  const vector = symbols.reduce<Coordinate>((sum, symbol) => addCoordinates(sum, vectorFor(map[symbol])), { x: 0, y: 0 });
  return classifyDirection(vector.x, vector.y);
}

export function mapMatchesEvidence(map: DirectionCodeMap, evidence: readonly CodeRecoveryEvidence[]): boolean {
  return evidence.every((item) => evidenceResult(item.symbols, map) === item.resultDirection);
}

export function codeMapFingerprint(map: DirectionCodeMap): string {
  return CODE_SYMBOLS.map((symbol) => `${symbol}:${map[symbol]}`).join("|");
}
