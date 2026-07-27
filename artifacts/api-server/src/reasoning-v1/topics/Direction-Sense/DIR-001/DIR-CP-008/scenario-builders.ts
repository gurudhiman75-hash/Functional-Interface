import { addCoordinates } from "../foundation/coordinates";
import { rotateDirection } from "../foundation/directions";
import type { Coordinate, Direction, PositionRelation } from "../foundation/types";
import { CARDINALS, cardinalVector, directionFromVector, distanceFromVector, relationVector, replayAbsolute, replayRelative, turnFacing } from "./geometry";
import type {
  AdvancedTurn,
  CaseletScenario,
  ContradictionScenario,
  HybridScenario,
  InitialFacingScenario,
  MissingGraphRelationScenario,
  MissingMovementScenario,
  MissingTurnScenario,
  MixedGraphMovementScenario,
  RelativePathOperation,
} from "./types";

const NAMES = ["Aman", "Beena", "Charan", "Deepa", "Farhan", "Gurpreet", "Harpreet", "Isha", "Jasleen", "Karan", "Meena", "Naman", "Pooja", "Ravi", "Simran", "Tanvi"] as const;
const POINTS = ["P", "Q", "R", "S", "T", "U", "V", "W"] as const;
const PLACES = ["a school ground", "a public park", "a college campus", "an office compound", "a village square", "a sports complex", "a market yard", "a garden"] as const;
const TURNS: readonly AdvancedTurn[] = ["LEFT", "RIGHT", "ABOUT", "NO_TURN"];

const rotate = (direction: Direction, quarterTurns: number): Direction => rotateDirection(direction, quarterTurns * 2);
const name = (seed: number, offset: number): string => NAMES[(seed * 5 + offset * 7 + Math.floor(seed / 3)) % NAMES.length];
const point = (seed: number, offset: number): string => `${POINTS[offset % POINTS.length]}${seed * 4 + offset + 1}`;
const context = (seed: number, offset = 0): { readonly subject: string; readonly place: string } => ({ subject: NAMES[(seed + offset) % NAMES.length], place: PLACES[Math.floor(seed / NAMES.length) % PLACES.length] });
const relation = (fromEntity: string, toEntity: string, direction: Direction, distance: number): PositionRelation => ({
  fromEntity,
  toEntity,
  vector: relationVector(direction, distance),
});

export function missingGraphRelationScenario(seed: number): MissingGraphRelationScenario {
  const q = seed % 4;
  const east = rotate("EAST", q), north = rotate("NORTH", q), west = rotate("WEST", q), south = rotate("SOUTH", q);
  const entities = [point(seed, 0), point(seed, 1), point(seed, 2), point(seed, 3)] as const;
  const horizontal = 3 + (seed % 5), vertical = 4 + ((seed * 2) % 5);
  return {
    kind: "MISSING_GRAPH_RELATION",
    entities,
    visibleRelations: [
      relation(entities[0], entities[1], east, horizontal),
      relation(entities[1], entities[2], north, vertical),
      relation(entities[2], entities[3], west, horizontal),
    ],
    missingFrom: entities[3],
    missingTo: entities[0],
    missingDistance: vertical,
    answerDirection: south,
  };
}

export function contradictionScenario(seed: number): ContradictionScenario {
  const q = seed % 4;
  const east = rotate("EAST", q), north = rotate("NORTH", q), diagonal = rotate("NORTH_EAST", q), wrong = rotate("SOUTH_EAST", q);
  const a = point(seed, 0), b = point(seed, 1), c = point(seed, 2), dPoint = point(seed, 3);
  const distance = 3 + (seed % 5);
  const anchorRelations = [relation(a, b, east, distance), relation(b, c, north, distance)] as const;
  const base: PositionRelation[] = [
    relation(a, c, diagonal, distance),
    relation(c, dPoint, east, distance),
    relation(b, dPoint, diagonal, distance),
    relation(a, dPoint, wrong, distance),
  ];
  const shift = seed % 4;
  const relations = [...base.slice(shift), ...base.slice(0, shift)];
  const wrongRelation = base[3];
  const inconsistentIndex = relations.indexOf(wrongRelation);
  const statementLabels = relations.map((item, index) => `Statement ${index + 1}`);
  return { kind: "CONTRADICTION", anchorRelations, relations, statementLabels, inconsistentIndex };
}

export function missingMovementScenario(seed: number): MissingMovementScenario {
  const q = seed % 4;
  const fullDirections = ["NORTH", "EAST", "SOUTH", "EAST"].map((direction) => rotate(direction as Direction, q));
  const distances = [4 + (seed % 4), 6 + ((seed * 3) % 5), 2 + ((seed * 5) % 4), 3 + ((seed * 7) % 5)];
  const unknownIndex = Math.floor(seed / 4) % fullDirections.length;
  const fullLegs = fullDirections.map((direction, index) => ({ direction, distance: distances[index] }));
  const target = replayAbsolute({ x: 0, y: 0 }, fullLegs);
  const legs = fullLegs.map((leg, index) => index === unknownIndex ? { direction: "UNKNOWN" as const, distance: leg.distance } : leg);
  const ctx = context(seed, 0);
  return { kind: "MISSING_MOVEMENT", ...ctx, start: { x: 0, y: 0 }, legs, unknownIndex, target, answerDirection: fullDirections[unknownIndex] };
}

export function missingTurnScenario(seed: number): MissingTurnScenario {
  const initialFacing = rotate("NORTH", seed % 4);
  const answerTurn = TURNS[seed % TURNS.length];
  const firstDistance = 3 + (seed % 5), secondDistance = 6 + ((seed * 2) % 5), thirdDistance = 2 + ((seed * 3) % 4);
  const knownTurn = seed % 2 === 0 ? "LEFT" as const : "RIGHT" as const;
  let position: Coordinate = cardinalVector(initialFacing, firstDistance);
  const afterUnknown = turnFacing(initialFacing, answerTurn);
  position = addCoordinates(position, cardinalVector(afterUnknown, secondDistance));
  const afterKnown = turnFacing(afterUnknown, knownTurn);
  position = addCoordinates(position, cardinalVector(afterKnown, thirdDistance));
  const ctx = context(seed, 1);
  return { kind: "MISSING_TURN", ...ctx, initialFacing, firstDistance, secondDistance, knownTurn, thirdDistance, target: position, answerTurn };
}

export function initialFacingScenario(seed: number): InitialFacingScenario {
  const answerFacing = CARDINALS[seed % CARDINALS.length];
  const operations: readonly RelativePathOperation[] = [
    { kind: "MOVE", distance: 7 + (seed % 4) },
    { kind: "TURN", turn: seed % 2 === 0 ? "RIGHT" : "LEFT" },
    { kind: "MOVE", distance: 5 + ((seed * 2) % 5) },
    { kind: "TURN", turn: "ABOUT" },
    { kind: "MOVE", distance: 2 + ((seed * 3) % 4) },
  ];
  const target = replayRelative(answerFacing, operations).position;
  const ctx = context(seed, 2);
  return { kind: "INITIAL_FACING_FROM_ENDPOINT", ...ctx, operations, target, answerFacing };
}

export function mixedGraphMovementScenario(seed: number): MixedGraphMovementScenario {
  const q = seed % 4;
  const east = rotate("EAST", q), north = rotate("NORTH", q);
  const anchor = point(seed, 0), startEntity = point(seed, 1), referenceEntity = point(seed, 2);
  const relations = [relation(anchor, startEntity, east, 4), relation(anchor, referenceEntity, north, 6)] as const;
  const movements = [{ direction: north, distance: 3 }] as const;
  const endpoint = addCoordinates(relationVector(east, 4), cardinalVector(north, 3));
  const reference = relationVector(north, 6);
  const vector = { x: endpoint.x - reference.x, y: endpoint.y - reference.y };
  return {
    kind: "GRAPH_AND_MOVEMENT",
    relations,
    startEntity,
    referenceEntity,
    movements,
    endpoint,
    answerDirection: directionFromVector(vector),
    answerDistance: distanceFromVector(vector),
  };
}

export function caseletScenario(seed: number): CaseletScenario {
  const initialFacing = rotate("NORTH", seed % 4);
  const operations: readonly RelativePathOperation[] = [
    { kind: "MOVE", distance: 9 },
    { kind: "TURN", turn: "RIGHT" },
    { kind: "MOVE", distance: 12 },
    { kind: "TURN", turn: "RIGHT" },
    { kind: "MOVE", distance: 4 },
  ];
  const solved = replayRelative(initialFacing, operations);
  const ctx = context(seed, 3);
  return {
    kind: "SHARED_PATH_CASELET",
    ...ctx,
    checkpoint: point(seed, 7),
    caseletId: `DIR-CP008-CASELET-${String(seed).padStart(4, "0")}`,
    initialFacing,
    operations,
    endpoint: solved.position,
    finalFacing: solved.facing,
    answerDirection: directionFromVector(solved.position),
    answerDistance: distanceFromVector(solved.position),
  };
}

export function hybridScenario(seed: number): HybridScenario {
  const q = seed % 4;
  const east = rotate("EAST", q), north = rotate("NORTH", q), west = rotate("WEST", q);
  const a = point(seed, 0), b = point(seed, 1), c = point(seed, 2), d = point(seed, 3);
  const diagramRelations = [relation(a, b, east, 4), relation(b, c, north, 3)] as const;
  const textRelation = relation(c, d, west, 6);
  const vector = addCoordinates(addCoordinates(relationVector(east, 4), relationVector(north, 3)), relationVector(west, 6));
  return { kind: "DIAGRAM_TEXT_HYBRID", diagramRelations, textRelation, queryFrom: a, queryTo: d, answerDirection: directionFromVector(vector) };
}
