import { DIRECTIONS, type CardinalDirection, type Coordinate, type Direction } from "../foundation/types";
import {
  CARDINAL_DIRECTIONS,
  PERSON_NAMES,
  allCardinalMaps,
  codeMapFingerprint,
  directionBetween,
  evidenceResult,
  generateCodeMap,
  mapMatchesEvidence,
  pick,
  seededRandom,
  shuffle,
  solveMovementCanonical,
  solveRelationsCanonical,
  symbolForDirection,
  vectorFor,
} from "./code-system";
import type { CodeRecoveryEvidence, CodeSymbol, CodedMovementStep, CodedRelation, DirectionCodeMap } from "./types";

export interface CodedChainScenario {
  readonly map: DirectionCodeMap;
  readonly relations: readonly CodedRelation[];
  readonly coordinates: Readonly<Record<string, Coordinate>>;
  readonly entities: readonly string[];
  readonly subject: string;
  readonly reference: string;
  readonly direction: Direction;
}

export interface CodedEntityScenario {
  readonly map: DirectionCodeMap;
  readonly relations: readonly CodedRelation[];
  readonly coordinates: Readonly<Record<string, Coordinate>>;
  readonly reference: string;
  readonly targetDirection: CardinalDirection;
  readonly answerEntity: string;
  readonly optionEntities: readonly string[];
}

export interface CodeRecoveryScenario {
  readonly map: DirectionCodeMap;
  readonly evidence: readonly CodeRecoveryEvidence[];
  readonly targetDirection: CardinalDirection;
  readonly answerSymbol: CodeSymbol;
}

export interface EquivalentStatementScenario {
  readonly map: DirectionCodeMap;
  readonly subject: string;
  readonly reference: string;
  readonly direction: CardinalDirection;
  readonly answerSymbol: CodeSymbol;
}

export interface MissingOperatorScenario {
  readonly map: DirectionCodeMap;
  readonly relations: readonly CodedRelation[];
  readonly hiddenIndex: number;
  readonly subject: string;
  readonly reference: string;
  readonly targetDirection: Direction;
  readonly answerSymbol: CodeSymbol;
  readonly coordinates: Readonly<Record<string, Coordinate>>;
}

export interface CodedMovementScenario {
  readonly map: DirectionCodeMap;
  readonly steps: readonly CodedMovementStep[];
  readonly points: readonly Coordinate[];
  readonly endpoint: Coordinate;
  readonly direction: Direction;
}

function namesFor(seed: number, count: number): readonly string[] {
  return shuffle(PERSON_NAMES, seededRandom(seed * 131 + 17)).slice(0, count);
}

function cardinalStepTemplates(direction: Direction): readonly (readonly CardinalDirection[])[] {
  switch (direction) {
    case "NORTH": return [["NORTH"], ["EAST", "NORTH", "WEST"], ["NORTH", "EAST", "NORTH", "WEST"]];
    case "NORTH_EAST": return [["NORTH", "EAST"], ["EAST", "NORTH", "NORTH"], ["WEST", "NORTH", "EAST", "EAST"]];
    case "EAST": return [["EAST"], ["NORTH", "EAST", "SOUTH"], ["EAST", "NORTH", "EAST", "SOUTH"]];
    case "SOUTH_EAST": return [["SOUTH", "EAST"], ["EAST", "SOUTH", "SOUTH"], ["WEST", "SOUTH", "EAST", "EAST"]];
    case "SOUTH": return [["SOUTH"], ["EAST", "SOUTH", "WEST"], ["SOUTH", "EAST", "SOUTH", "WEST"]];
    case "SOUTH_WEST": return [["SOUTH", "WEST"], ["WEST", "SOUTH", "SOUTH"], ["EAST", "SOUTH", "WEST", "WEST"]];
    case "WEST": return [["WEST"], ["NORTH", "WEST", "SOUTH"], ["WEST", "NORTH", "WEST", "SOUTH"]];
    case "NORTH_WEST": return [["NORTH", "WEST"], ["WEST", "NORTH", "NORTH"], ["EAST", "NORTH", "WEST", "WEST"]];
  }
}

export function buildCodedChainScenario(seed: number): CodedChainScenario {
  const map = generateCodeMap(seed + 401);
  const desired = DIRECTIONS[Math.abs(seed) % DIRECTIONS.length];
  const templates = cardinalStepTemplates(desired);
  const steps = templates[Math.floor(Math.abs(seed) / DIRECTIONS.length) % templates.length];
  const entities = namesFor(seed + 401, steps.length + 1);
  const relations = steps.map((direction, index) => ({
    subject: entities[index],
    symbol: symbolForDirection(map, direction),
    reference: entities[index + 1],
  }));
  const solved = solveRelationsCanonical(relations, map);
  if (!solved.connected || solved.contradictions.length > 0) throw new Error(`Invalid coded chain for seed ${seed}`);
  const subject = entities[0];
  const reference = entities[entities.length - 1];
  const direction = directionBetween(solved.coordinates, subject, reference);
  if (direction !== desired) throw new Error(`Coded chain target mismatch for seed ${seed}: ${direction} !== ${desired}`);
  return { map, relations, coordinates: solved.coordinates, entities, subject, reference, direction };
}

export function buildCodedEntityScenario(seed: number): CodedEntityScenario {
  const map = generateCodeMap(seed + 503);
  const [reference, ...candidates] = namesFor(seed + 503, 5);
  const orderedDirections = shuffle(CARDINAL_DIRECTIONS, seededRandom(seed * 137 + 43));
  const relations = orderedDirections.map((direction, index) => ({
    subject: candidates[index],
    symbol: symbolForDirection(map, direction),
    reference,
  }));
  const solved = solveRelationsCanonical(relations, map);
  if (!solved.connected || solved.contradictions.length > 0) throw new Error(`Invalid coded entity scenario for seed ${seed}`);
  const targetDirection = CARDINAL_DIRECTIONS[Math.abs(seed) % CARDINAL_DIRECTIONS.length];
  const answerIndex = orderedDirections.indexOf(targetDirection);
  if (answerIndex < 0) throw new Error("Target direction missing from coded entity scenario");
  return {
    map,
    relations,
    coordinates: solved.coordinates,
    reference,
    targetDirection,
    answerEntity: candidates[answerIndex],
    optionEntities: candidates,
  };
}

function evidenceKey(evidence: CodeRecoveryEvidence): string {
  return `${evidence.symbols.join("")}:${evidence.resultDirection}`;
}

function candidateEvidence(actual: DirectionCodeMap, seed: number): readonly CodeRecoveryEvidence[] {
  const sequences: CodeSymbol[][] = [];
  for (const first of ["@", "#", "%", "&"] as const) {
    for (const second of ["@", "#", "%", "&"] as const) {
      if (first !== second) sequences.push([first, second]);
      for (const third of ["@", "#", "%", "&"] as const) {
        if (new Set([first, second, third]).size >= 2) sequences.push([first, second, third]);
      }
    }
  }
  let entityCode = 0;
  const seen = new Set<string>();
  const evidence: CodeRecoveryEvidence[] = [];
  const orderedSequences = shuffle(sequences, seededRandom(seed * 181 + 109));
  for (const symbols of orderedSequences) {
    const result = evidenceResult(symbols, actual);
    if (result === "SAME_POSITION") continue;
    const item: CodeRecoveryEvidence = {
      symbols,
      resultDirection: result,
      displayEntities: namesFor(seed * 211 + entityCode++ * 17 + 19, symbols.length + 1),
    };
    const key = evidenceKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    evidence.push(item);
  }
  return evidence;
}

export function buildCodeRecoveryScenario(seed: number): CodeRecoveryScenario {
  const map = generateCodeMap(seed + 607);
  const candidates = candidateEvidence(map, seed);
  let surviving = [...allCardinalMaps()];
  const chosen: CodeRecoveryEvidence[] = [];
  const used = new Set<string>();
  while (surviving.length > 1 && chosen.length < 5) {
    let best: CodeRecoveryEvidence | null = null;
    let bestRemaining = surviving.length;
    for (const evidence of candidates) {
      const key = evidenceKey(evidence);
      if (used.has(key)) continue;
      const next = surviving.filter((candidate) => mapMatchesEvidence(candidate, [evidence]));
      if (next.length > 0 && next.length < bestRemaining) {
        best = evidence;
        bestRemaining = next.length;
      }
    }
    if (!best) break;
    chosen.push(best);
    used.add(evidenceKey(best));
    surviving = surviving.filter((candidate) => mapMatchesEvidence(candidate, [best!]));
  }
  if (surviving.length !== 1 || codeMapFingerprint(surviving[0]) !== codeMapFingerprint(map)) {
    throw new Error(`Unable to recover a unique coded map for seed ${seed}; survivors=${surviving.length}`);
  }
  if (chosen.every((evidence) => evidence.symbols.length < 2)) throw new Error("Map recovery must use combined evidence");
  const targetDirection = CARDINAL_DIRECTIONS[Math.abs(seed * 3) % CARDINAL_DIRECTIONS.length];
  return { map, evidence: chosen, targetDirection, answerSymbol: symbolForDirection(map, targetDirection) };
}

export function buildEquivalentStatementScenario(seed: number): EquivalentStatementScenario {
  const map = generateCodeMap(seed + 701);
  const [subject, reference] = namesFor(seed + 701, 2);
  const direction = CARDINAL_DIRECTIONS[Math.abs(seed) % CARDINAL_DIRECTIONS.length];
  return { map, subject, reference, direction, answerSymbol: symbolForDirection(map, direction) };
}

function randomRelations(seed: number, count: number, map: DirectionCodeMap, entities: readonly string[]): readonly CodedRelation[] {
  const random = seededRandom(seed * 149 + 73);
  return Array.from({ length: count }, (_, index) => ({
    subject: entities[index],
    symbol: symbolForDirection(map, pick(CARDINAL_DIRECTIONS, random)),
    reference: entities[index + 1],
  }));
}

export function buildMissingOperatorScenario(seed: number): MissingOperatorScenario {
  const map = generateCodeMap(seed + 809);
  for (let attempt = 0; attempt < 256; attempt += 1) {
    const relationCount = 3 + ((Math.abs(seed) + attempt) % 2);
    const entities = namesFor(seed + attempt * 17 + 809, relationCount + 1);
    const relations = randomRelations(seed + attempt * 19 + 5, relationCount, map, entities);
    const hiddenIndex = (Math.abs(seed * 5) + attempt) % relationCount;
    const solved = solveRelationsCanonical(relations, map);
    if (!solved.connected || solved.contradictions.length > 0) continue;
    const subject = entities[0];
    const reference = entities[entities.length - 1];
    let targetDirection: Direction;
    try {
      targetDirection = directionBetween(solved.coordinates, subject, reference);
    } catch {
      continue;
    }
    const satisfying = (["@", "#", "%", "&"] as const).filter((symbol) => {
      const candidate = relations.map((relation, index) => index === hiddenIndex ? { ...relation, symbol } : relation);
      const candidateSolved = solveRelationsCanonical(candidate, map);
      if (!candidateSolved.connected || candidateSolved.contradictions.length > 0) return false;
      try {
        return directionBetween(candidateSolved.coordinates, subject, reference) === targetDirection;
      } catch {
        return false;
      }
    });
    if (satisfying.length !== 1 || satisfying[0] !== relations[hiddenIndex].symbol) continue;
    return {
      map,
      relations,
      hiddenIndex,
      subject,
      reference,
      targetDirection,
      answerSymbol: relations[hiddenIndex].symbol,
      coordinates: solved.coordinates,
    };
  }
  throw new Error(`Unable to build a unique missing-operator scenario for seed ${seed}`);
}

function movementDirectionsFor(direction: Direction, variant: number): readonly CardinalDirection[] {
  const templates = cardinalStepTemplates(direction);
  const template = templates[variant % templates.length];
  if (template.length === 1) {
    const cancel = direction === "NORTH" || direction === "SOUTH" ? (["EAST", "WEST"] as const) : (["NORTH", "SOUTH"] as const);
    return variant % 2 === 0 ? template : [cancel[0], cancel[1], template[0]];
  }
  return template;
}

export function buildCodedMovementScenario(seed: number): CodedMovementScenario {
  const map = generateCodeMap(seed + 907);
  const desired = DIRECTIONS[Math.abs(seed) % DIRECTIONS.length];
  const directions = movementDirectionsFor(desired, Math.floor(Math.abs(seed) / DIRECTIONS.length));
  const random = seededRandom(seed * 157 + 89);
  const cancelDistance = 3 + Math.floor(random() * 6);
  const steps: CodedMovementStep[] = directions.map((direction, index) => {
    let distance = 4 + Math.floor(random() * 9);
    if (directions.length >= 3 && index < 2 && vectorFor(directions[0]).x === -vectorFor(directions[1]).x && vectorFor(directions[0]).y === -vectorFor(directions[1]).y) {
      distance = cancelDistance;
    }
    return { symbol: symbolForDirection(map, direction), distance };
  });
  const solved = solveMovementCanonical(steps, map);
  if (solved.direction !== desired) {
    // Templates with unequal same-axis components can drift; rebuild with unit-scaled cardinal signs.
    const fallbackDirections: CardinalDirection[] = desired.includes("NORTH") ? ["NORTH"] : desired.includes("SOUTH") ? ["SOUTH"] : [];
    if (desired.includes("EAST")) fallbackDirections.push("EAST");
    if (desired.includes("WEST")) fallbackDirections.push("WEST");
    const fallbackSteps = fallbackDirections.map((direction, index) => ({ symbol: symbolForDirection(map, direction), distance: 6 + ((Math.abs(seed) + index * 3) % 7) }));
    const fallbackSolved = solveMovementCanonical(fallbackSteps, map);
    if (fallbackSolved.direction !== desired) throw new Error(`Unable to build coded movement direction ${desired}`);
    return { map, steps: fallbackSteps, points: fallbackSolved.points, endpoint: fallbackSolved.endpoint, direction: fallbackSolved.direction };
  }
  return { map, steps, points: solved.points, endpoint: solved.endpoint, direction: solved.direction };
}
