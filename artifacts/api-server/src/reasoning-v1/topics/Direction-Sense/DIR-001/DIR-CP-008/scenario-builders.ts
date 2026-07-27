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
const PLACE_DETAILS = ["near the main gate", "beside the central lawn", "along a marked track", "close to the entrance", "near the boundary wall"] as const;
const TURNS: readonly AdvancedTurn[] = ["LEFT", "RIGHT", "ABOUT", "NO_TURN"];

const rotate = (direction: Direction, quarterTurns: number): Direction => rotateDirection(direction, quarterTurns * 2);
const name = (seed: number, offset: number): string => NAMES[(seed * 5 + offset * 7 + Math.floor(seed / 3)) % NAMES.length];
const point = (seed: number, offset: number): string => `${POINTS[offset % POINTS.length]}${seed * 4 + offset + 1}`;
const context = (seed: number, offset = 0): { readonly subject: string; readonly place: string } => ({ subject: NAMES[(seed + offset) % NAMES.length], place: `${PLACES[(seed * 3 + offset) % PLACES.length]} ${PLACE_DETAILS[(Math.floor(seed / 8) + offset) % PLACE_DETAILS.length]}` });
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
  const patterns = [
    { horizontal: 3, vertical: 4, distance: 5 },
    { horizontal: 5, vertical: 12, distance: 13 },
    { horizontal: 8, vertical: 15, distance: 17 },
    { horizontal: 7, vertical: 24, distance: 25 },
  ] as const;
  const pattern = patterns[Math.floor(seed / 4) % patterns.length];
  const q = seed % 4;
  const positiveVertical = Math.floor(seed / (patterns.length * 4)) % 2 === 1;
  const east = rotate("EAST", q), north = rotate("NORTH", q);
  const anchor = point(seed, 0), startEntity = point(seed, 1), referenceEntity = point(seed, 2);
  const referenceDistance = positiveVertical ? 3 : pattern.vertical + 3;
  const movementDistance = positiveVertical ? pattern.vertical + 3 : 3;
  const relations = [
    relation(anchor, startEntity, east, pattern.horizontal),
    relation(anchor, referenceEntity, north, referenceDistance),
  ] as const;
  const movements = [{ direction: north, distance: movementDistance }] as const;
  const endpoint = addCoordinates(relationVector(east, pattern.horizontal), cardinalVector(north, movementDistance));
  const reference = relationVector(north, referenceDistance);
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
  const patterns = [
    { first: 9, cross: 12, third: 4, distance: 13 },
    { first: 11, cross: 15, third: 3, distance: 17 },
    { first: 13, cross: 24, third: 6, distance: 25 },
    { first: 17, cross: 35, third: 5, distance: 37 },
    { first: 14, cross: 40, third: 5, distance: 41 },
  ] as const;
  const pattern = patterns[seed % patterns.length];
  const initialFacing = rotate("NORTH", seed % 4);
  const turn = Math.floor(seed / 4) % 2 === 0 ? "RIGHT" as const : "LEFT" as const;
  const operations: readonly RelativePathOperation[] = [
    { kind: "MOVE", distance: pattern.first },
    { kind: "TURN", turn },
    { kind: "MOVE", distance: pattern.cross },
    { kind: "TURN", turn },
    { kind: "MOVE", distance: pattern.third },
  ];
  const solved = replayRelative(initialFacing, operations);
  if (distanceFromVector(solved.position) !== pattern.distance) throw new Error("Caselet exact-distance pattern failed");
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
    answerDistance: pattern.distance,
  };
}

export function hybridScenario(seed: number): HybridScenario {
  const patterns = [
    { east: 4, north: 3, west: 6 },
    { east: 7, north: 5, west: 2 },
    { east: 3, north: 6, west: 8 },
    { east: 9, north: 4, west: 3 },
  ] as const;
  const pattern = patterns[Math.floor(seed / 4) % patterns.length];
  const q = seed % 4;
  const east = rotate("EAST", q), north = rotate("NORTH", q), west = rotate("WEST", q);
  const a = point(seed, 0), b = point(seed, 1), c = point(seed, 2), d = point(seed, 3);
  const diagramRelations = [
    relation(a, b, east, pattern.east),
    relation(b, c, north, pattern.north),
  ] as const;
  const textRelation = relation(c, d, west, pattern.west);
  const vector = addCoordinates(
    addCoordinates(relationVector(east, pattern.east), relationVector(north, pattern.north)),
    relationVector(west, pattern.west),
  );
  return { kind: "DIAGRAM_TEXT_HYBRID", diagramRelations, textRelation, queryFrom: a, queryTo: d, answerDirection: directionFromVector(vector) };
}
