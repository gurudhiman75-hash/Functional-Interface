import type { CardinalDirection, Direction } from "../foundation/types";
import type { CodeRecoveryEvidence, CodedMovementStep, CodedRelation, DirectionCodeMap } from "./types";
import { CODE_SYMBOLS } from "./types";
import { DIRECTION_LABELS, DIRECTION_PHRASES, renderCodedChain } from "./code-system";

export function relationCodePreamble(map: DirectionCodeMap): string {
  return `In a certain direction code, ${CODE_SYMBOLS.map((symbol) => `${symbol} means "is ${DIRECTION_PHRASES[map[symbol]]} of"`).join(", ")}.`;
}

export function movementCodePreamble(map: DirectionCodeMap): string {
  return `In a coded movement system, ${CODE_SYMBOLS.map((symbol) => `${symbol} means move ${DIRECTION_LABELS[map[symbol]]}`).join(", ")}.`;
}

export function renderDirectionStem(
  map: DirectionCodeMap,
  relations: readonly CodedRelation[],
  subject: string,
  reference: string,
): string {
  return `${relationCodePreamble(map)} Read the coded chain "${renderCodedChain(relations)}". In which direction is ${subject} from ${reference}?`;
}

export function renderEntityLookupStem(
  map: DirectionCodeMap,
  relations: readonly CodedRelation[],
  targetDirection: CardinalDirection,
  reference: string,
): string {
  const statements = relations.map((relation) => `${relation.subject} ${relation.symbol} ${relation.reference}`).join(", ");
  return `${relationCodePreamble(map)} The coded statements are ${statements}. Who is ${DIRECTION_PHRASES[targetDirection]} of ${reference}?`;
}

function evidenceChain(evidence: CodeRecoveryEvidence): string {
  return evidence.displayEntities.map((entity, index) => index < evidence.symbols.length ? `${entity} ${evidence.symbols[index]}` : entity).join(" ");
}

export function renderMapRecoveryStem(
  evidence: readonly CodeRecoveryEvidence[],
  targetDirection: CardinalDirection,
): string {
  const facts = evidence.map((item) => `"${evidenceChain(item)}" places ${item.displayEntities[0]} ${DIRECTION_PHRASES[item.resultDirection]} of ${item.displayEntities[item.displayEntities.length - 1]}`).join("; ");
  return `The symbols @, #, % and & stand for North, East, South and West in some one-to-one order. In the same code, ${facts}. Which symbol means ${DIRECTION_LABELS[targetDirection]}?`;
}

export function renderEquivalentStatementStem(
  map: DirectionCodeMap,
  subject: string,
  reference: string,
  direction: CardinalDirection,
): string {
  return `${relationCodePreamble(map)} Which coded statement means that ${subject} is ${DIRECTION_PHRASES[direction]} of ${reference}?`;
}

export function renderValidConclusionStem(map: DirectionCodeMap, relations: readonly CodedRelation[]): string {
  return `${relationCodePreamble(map)} Read the coded chain "${renderCodedChain(relations)}". Which of the following conclusions is correct?`;
}

export function renderMissingOperatorStem(
  map: DirectionCodeMap,
  relations: readonly CodedRelation[],
  hiddenIndex: number,
  subject: string,
  reference: string,
  targetDirection: Direction,
): string {
  const displayed = relations.map((relation, index) => ({ ...relation, symbol: index === hiddenIndex ? "?" : relation.symbol }));
  const chain = displayed.map((relation, index) => index === 0 ? `${relation.subject} ${relation.symbol} ${relation.reference}` : `${relation.symbol} ${relation.reference}`).join(" ");
  return `${relationCodePreamble(map)} In the coded chain "${chain}", which symbol should replace ? so that ${subject} is ${DIRECTION_PHRASES[targetDirection]} of ${reference}?`;
}

export function renderMovementStem(map: DirectionCodeMap, steps: readonly CodedMovementStep[]): string {
  const movement = steps.map((step) => `${step.symbol} ${step.distance} metres`).join(", then ");
  return `${movementCodePreamble(map)} A person starts from point O and follows ${movement}. In which direction is the final position from point O?`;
}

export function decodeMapLines(map: DirectionCodeMap, movement = false): readonly string[] {
  return CODE_SYMBOLS.map((symbol) => movement
    ? `${symbol} means move ${DIRECTION_LABELS[map[symbol]]}.`
    : `${symbol} means ${DIRECTION_LABELS[map[symbol]]} of the reference entity.`);
}

export function decodeRelationLines(relations: readonly CodedRelation[], map: DirectionCodeMap): readonly string[] {
  return relations.map((relation) => `${relation.subject} ${relation.symbol} ${relation.reference} means ${relation.subject} is ${DIRECTION_PHRASES[map[relation.symbol]]} of ${relation.reference}.`);
}
