import type { Coordinate, Direction, PositionRelation } from "../foundation/types";
import { DIRECTION_LABELS, TURN_LABELS, directionFromVector, statementText } from "./geometry";
import type { AdvancedTurn, CaseletScenario, InitialFacingScenario, MissingMovementScenario, MissingTurnScenario, RelativePathOperation } from "./types";

export const directionLabel = (direction: Direction): string => DIRECTION_LABELS[direction];
export const turnLabel = (turn: AdvancedTurn): string => TURN_LABELS[turn];

export function directionOnlyStatement(relation: PositionRelation): string {
  return `${relation.toEntity} is ${DIRECTION_LABELS[directionFromVector(relation.vector)]} of ${relation.fromEntity}.`;
}

export function componentDescription(target: Coordinate): string {
  const parts: string[] = [];
  const metres = (value: number): string => `${value} ${value === 1 ? "metre" : "metres"}`;
  if (target.x > 0) parts.push(`${metres(target.x)} East`);
  if (target.x < 0) parts.push(`${metres(Math.abs(target.x))} West`);
  if (target.y > 0) parts.push(`${metres(target.y)} North`);
  if (target.y < 0) parts.push(`${metres(Math.abs(target.y))} South`);
  if (parts.length === 0) return "at the starting point";
  return parts.length === 1 ? parts[0] : `${parts[0]} and ${parts[1]}`;
}

function operationText(operation: RelativePathOperation): string {
  if (operation.kind === "MOVE") return `walks ${operation.distance} metres straight ahead`;
  return operation.turn === "LEFT" ? "turns left" : operation.turn === "RIGHT" ? "turns right" : "turns around";
}

export function pathSentence(operations: readonly RelativePathOperation[]): string {
  return operations.map((operation, index) => `${index === 0 ? "" : index === operations.length - 1 ? "and finally " : "then "}${operationText(operation)}`).join(", ");
}

export function renderMissingGraphStem(visible: readonly PositionRelation[], missingFrom: string, missingTo: string, missingDistance: number): string {
  return `${visible.map(statementText).join(" ")} A fourth statement must place ${missingTo} exactly ${missingDistance} metres from ${missingFrom} so that all four relations form one consistent closed layout. In which direction should ${missingTo} be from ${missingFrom}?`;
}

export function renderContradictionStem(anchorRelations: readonly PositionRelation[], relations: readonly PositionRelation[]): string {
  const anchors = anchorRelations.map(directionOnlyStatement).join(" ");
  const statements = relations.map((relation, index) => `(${index + 1}) ${directionOnlyStatement(relation)}`).join(" ");
  return `${anchors} Now consider these four additional statements: ${statements} Exactly one additional statement disagrees with the complete layout. Which statement is inconsistent?`;
}

export function renderMissingMovementStem(scenario: MissingMovementScenario): string {
  const legs = scenario.legs.map((leg, index) => leg.direction === "UNKNOWN"
    ? `${index === 0 ? `${scenario.subject} starts from a marked point in ${scenario.place} and` : "then"} walks ${leg.distance} metres in a direction that is not stated`
    : `${index === 0 ? `${scenario.subject} starts from a marked point in ${scenario.place} and` : "then"} walks ${leg.distance} metres ${DIRECTION_LABELS[leg.direction]}`).join(", ");
  return `${legs}. The final point is ${componentDescription(scenario.target)} of the starting point. Which direction was used for the missing movement?`;
}

export function renderMissingTurnStem(scenario: MissingTurnScenario): string {
  const known = scenario.knownTurn === "LEFT" ? "turns left" : "turns right";
  return `${scenario.subject}, while in ${scenario.place}, starts facing ${DIRECTION_LABELS[scenario.initialFacing]} and walks ${scenario.firstDistance} metres. What ${scenario.subject} does before the next movement is not stated. ${scenario.subject} then walks ${scenario.secondDistance} metres, ${known}, and walks another ${scenario.thirdDistance} metres. The final point is ${componentDescription(scenario.target)} of the starting point. What should fill the missing step?`;
}

export function renderInitialFacingStem(scenario: InitialFacingScenario): string {
  return `${scenario.subject} starts from a marked point in ${scenario.place}, ${pathSentence(scenario.operations)}. The final point is ${componentDescription(scenario.target)} of the starting point. In which direction was ${scenario.subject} facing initially?`;
}

export function renderCaseletStimulus(scenario: CaseletScenario): string {
  return `${scenario.subject}, a patrol officer at checkpoint ${scenario.checkpoint} in ${scenario.place}, starts facing ${DIRECTION_LABELS[scenario.initialFacing]} and ${pathSentence(scenario.operations)}.`;
}
