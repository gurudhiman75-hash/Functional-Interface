import { classifyDirection } from "../foundation/directions";
import type { Coordinate, Direction } from "../foundation/types";
import { CODE_SYMBOLS, type CodeRecoveryEvidence, type CodeSymbol, type CodedMovementStep, type CodedRelation, type DirectionCodeMap } from "./types";
import { allCardinalMaps, mapMatchesEvidence, vectorFor } from "./code-system";

function equal(left: Coordinate, right: Coordinate): boolean {
  return Math.abs(left.x - right.x) <= 1e-9 && Math.abs(left.y - right.y) <= 1e-9;
}

export function solveCodedRelationsIndependent(relations: readonly CodedRelation[], map: DirectionCodeMap): Readonly<Record<string, Coordinate>> {
  const coordinates: Record<string, Coordinate> = {};
  if (relations.length === 0) return coordinates;
  const entities = [...new Set(relations.flatMap((relation) => [relation.subject, relation.reference]))];
  coordinates[entities[entities.length - 1]] = { x: 0, y: 0 };
  for (let pass = 0; pass < entities.length + relations.length; pass += 1) {
    let changed = false;
    for (const relation of relations) {
      const direction = map[relation.symbol];
      const vector = vectorFor(direction);
      const subject = coordinates[relation.subject];
      const reference = coordinates[relation.reference];
      if (reference && !subject) {
        coordinates[relation.subject] = { x: reference.x + vector.x, y: reference.y + vector.y };
        changed = true;
      } else if (subject && !reference) {
        coordinates[relation.reference] = { x: subject.x - vector.x, y: subject.y - vector.y };
        changed = true;
      } else if (subject && reference && !equal(subject, { x: reference.x + vector.x, y: reference.y + vector.y })) {
        throw new Error(`Independent coded graph contradiction at ${relation.subject} ${relation.symbol} ${relation.reference}`);
      }
    }
    if (!changed) break;
  }
  if (!entities.every((entity) => coordinates[entity])) throw new Error("Independent coded graph is disconnected");
  return coordinates;
}

export function independentDirection(coordinates: Readonly<Record<string, Coordinate>>, subject: string, reference: string): Direction | "SAME_POSITION" {
  const subjectPoint = coordinates[subject];
  const referencePoint = coordinates[reference];
  if (!subjectPoint || !referencePoint) throw new Error("Independent direction query references an unknown entity");
  return classifyDirection(subjectPoint.x - referencePoint.x, subjectPoint.y - referencePoint.y);
}

export function solveCodedMovementIndependent(steps: readonly CodedMovementStep[], map: DirectionCodeMap): { readonly endpoint: Coordinate; readonly direction: Direction | "SAME_POSITION" } {
  let x = 0;
  let y = 0;
  for (const step of steps) {
    const vector = vectorFor(map[step.symbol]);
    x += vector.x * step.distance;
    y += vector.y * step.distance;
  }
  return { endpoint: { x, y }, direction: classifyDirection(x, y) };
}

export function recoverCodeMapsIndependent(evidence: readonly CodeRecoveryEvidence[]): readonly DirectionCodeMap[] {
  return allCardinalMaps().filter((map) => mapMatchesEvidence(map, evidence));
}

export function recoverMissingOperatorIndependent(
  relations: readonly CodedRelation[],
  hiddenIndex: number,
  targetSubject: string,
  targetReference: string,
  targetDirection: Direction,
  map: DirectionCodeMap,
): readonly CodeSymbol[] {
  return CODE_SYMBOLS.filter((symbol) => {
    const candidate = relations.map((relation, index) => index === hiddenIndex ? { ...relation, symbol } : relation);
    try {
      const coordinates = solveCodedRelationsIndependent(candidate, map);
      return independentDirection(coordinates, targetSubject, targetReference) === targetDirection;
    } catch {
      return false;
    }
  });
}
