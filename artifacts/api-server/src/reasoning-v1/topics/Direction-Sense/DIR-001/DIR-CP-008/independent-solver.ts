import { addCoordinates } from "../foundation/coordinates";
import { DIRECTIONS, type Coordinate, type Direction } from "../foundation/types";
import { solveEntityPositions } from "../foundation/entity-position-graph";
import { CARDINALS, cardinalVector, directionFromVector, distanceFromVector, relationVector, replayAbsolute, replayRelative, sameCoordinate, turnFacing } from "./geometry";
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
} from "./types";

const TURN_CANDIDATES: readonly AdvancedTurn[] = ["LEFT", "RIGHT", "ABOUT", "NO_TURN"];

export function solveMissingGraphDirectionIndependent(scenario: MissingGraphRelationScenario): Direction {
  const matches = DIRECTIONS.filter((direction) => {
    const relations = [...scenario.visibleRelations, {
      fromEntity: scenario.missingFrom,
      toEntity: scenario.missingTo,
      vector: relationVector(direction, scenario.missingDistance),
    }];
    const solved = solveEntityPositions(relations, scenario.entities[0]);
    return solved.connected && solved.contradictions.length === 0;
  });
  if (matches.length !== 1) throw new Error(`Missing graph relation has ${matches.length} solutions`);
  return matches[0];
}

export function solveContradictionIndependent(scenario: ContradictionScenario): number {
  const matches = scenario.relations.flatMap((_, index) => {
    const remaining = scenario.relations.filter((__, candidate) => candidate !== index);
    const solved = solveEntityPositions([...scenario.anchorRelations, ...remaining]);
    return solved.connected && solved.contradictions.length === 0 ? [index] : [];
  });
  if (matches.length !== 1) throw new Error(`Contradiction scenario has ${matches.length} removable statements`);
  return matches[0];
}

export function solveMissingMovementIndependent(scenario: MissingMovementScenario): Direction {
  const matches = CARDINALS.filter((candidate) => {
    const legs = scenario.legs.map((leg, index) => ({
      direction: index === scenario.unknownIndex ? candidate : leg.direction as Direction,
      distance: leg.distance,
    }));
    return sameCoordinate(replayAbsolute(scenario.start, legs), scenario.target);
  });
  if (matches.length !== 1) throw new Error(`Missing movement scenario has ${matches.length} solutions`);
  return matches[0];
}

function endpointForTurn(scenario: MissingTurnScenario, turn: AdvancedTurn): Coordinate {
  let position = cardinalVector(scenario.initialFacing, scenario.firstDistance);
  const secondFacing = turnFacing(scenario.initialFacing, turn);
  position = addCoordinates(position, cardinalVector(secondFacing, scenario.secondDistance));
  const thirdFacing = turnFacing(secondFacing, scenario.knownTurn);
  return addCoordinates(position, cardinalVector(thirdFacing, scenario.thirdDistance));
}

export function solveMissingTurnIndependent(scenario: MissingTurnScenario): AdvancedTurn {
  const matches = TURN_CANDIDATES.filter((candidate) => sameCoordinate(endpointForTurn(scenario, candidate), scenario.target));
  if (matches.length !== 1) throw new Error(`Missing turn scenario has ${matches.length} solutions`);
  return matches[0];
}

export function solveInitialFacingIndependent(scenario: InitialFacingScenario): Direction {
  const matches = CARDINALS.filter((candidate) => sameCoordinate(replayRelative(candidate, scenario.operations).position, scenario.target));
  if (matches.length !== 1) throw new Error(`Initial-facing scenario has ${matches.length} solutions`);
  return matches[0];
}

export function solveMixedGraphMovementIndependent(scenario: MixedGraphMovementScenario): { readonly direction: Direction; readonly distance: number } {
  const solved = solveEntityPositions(scenario.relations);
  if (!solved.connected || solved.contradictions.length) throw new Error("Mixed graph scenario is invalid");
  const start = solved.coordinates[scenario.startEntity];
  const reference = solved.coordinates[scenario.referenceEntity];
  if (!start || !reference) throw new Error("Mixed graph scenario is missing an entity coordinate");
  const endpoint = replayAbsolute(start, scenario.movements);
  const vector = { x: endpoint.x - reference.x, y: endpoint.y - reference.y };
  return { direction: directionFromVector(vector), distance: distanceFromVector(vector) };
}

export function solveCaseletIndependent(scenario: CaseletScenario): { readonly endpoint: Coordinate; readonly finalFacing: Direction; readonly direction: Direction; readonly distance: number } {
  const solved = replayRelative(scenario.initialFacing, scenario.operations);
  return {
    endpoint: solved.position,
    finalFacing: solved.facing,
    direction: directionFromVector(solved.position),
    distance: distanceFromVector(solved.position),
  };
}

export function solveHybridIndependent(scenario: HybridScenario): Direction {
  const solved = solveEntityPositions([...scenario.diagramRelations, scenario.textRelation], scenario.queryFrom);
  if (!solved.connected || solved.contradictions.length) throw new Error("Hybrid scenario is invalid");
  const from = solved.coordinates[scenario.queryFrom], to = solved.coordinates[scenario.queryTo];
  if (!from || !to) throw new Error("Hybrid query entities are missing");
  return directionFromVector({ x: to.x - from.x, y: to.y - from.y });
}
