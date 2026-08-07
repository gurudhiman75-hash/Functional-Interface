import { normalizePhraseKey, reverseRelation } from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
  RelationPhraseKey,
} from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp005Context, IneCp005RenderedStatement } from "./types";

const PHRASES_BY_RELATION: Readonly<
  Record<ComparisonRelation, readonly RelationPhraseKey[]>
> = {
  GREATER_THAN: ["GREATER_THAN", "NEITHER_LESS_NOR_EQUAL"],
  LESS_THAN: ["LESS_THAN", "NEITHER_GREATER_NOR_EQUAL"],
  EQUAL_TO: ["EQUAL_TO", "NEITHER_LESS_NOR_GREATER"],
  GREATER_THAN_OR_EQUAL: ["NOT_LESS_THAN"],
  LESS_THAN_OR_EQUAL: ["NOT_GREATER_THAN"],
};

const PROPERTY_BY_CONTEXT: Readonly<
  Record<
    Exclude<IneCp005Context, "GENERIC" | "PRICE">,
    { noun: string; verb: "is" | "are" }
  >
> = {
  MARKS: { noun: "marks", verb: "are" },
  SALARY: { noun: "salary", verb: "is" },
  HEIGHT: { noun: "height", verb: "is" },
  WEIGHT: { noun: "weight", verb: "is" },
  SCORE: { noun: "score", verb: "is" },
  PRODUCTION: { noun: "production", verb: "is" },
};

function relationWords(phraseKey: RelationPhraseKey): string {
  if (phraseKey === "GREATER_THAN") return "greater than";
  if (phraseKey === "LESS_THAN") return "less than";
  if (phraseKey === "NOT_LESS_THAN") return "not less than";
  if (phraseKey === "NOT_GREATER_THAN") return "not greater than";
  if (phraseKey === "EQUAL_TO") return "equal to";
  if (phraseKey === "NEITHER_LESS_NOR_GREATER")
    return "neither less than nor greater than";
  if (phraseKey === "NEITHER_LESS_NOR_EQUAL")
    return "neither less than nor equal to";
  return "neither greater than nor equal to";
}

export function phraseKeyForRelation(
  relation: ComparisonRelation,
  variant: number,
): RelationPhraseKey {
  const candidates = PHRASES_BY_RELATION[relation];
  return candidates[
    ((variant % candidates.length) + candidates.length) % candidates.length
  ]!;
}

export function renderLinguisticConstraint(
  constraint: ComparisonConstraint,
  phraseKey: RelationPhraseKey,
  entityNames: Readonly<Record<string, string>>,
  context: IneCp005Context,
): string {
  if (normalizePhraseKey(phraseKey) !== constraint.relation) {
    throw new Error("Phrase key does not match the structured relation.");
  }
  const left = entityNames[constraint.leftId] ?? constraint.leftId;
  const right = entityNames[constraint.rightId] ?? constraint.rightId;
  const words = relationWords(phraseKey);
  if (context === "GENERIC") return `${left} is ${words} ${right}.`;
  if (context === "PRICE")
    return `The price of ${left} is ${words} the price of ${right}.`;
  const property = PROPERTY_BY_CONTEXT[context];
  return `${left}'s ${property.noun} ${property.verb} ${words} ${right}'s ${property.noun}.`;
}

export function renderStructuredStatement(
  constraint: ComparisonConstraint,
  entityNames: Readonly<Record<string, string>>,
  context: IneCp005Context,
  surfaceKind: "LINGUISTIC" | "SYMBOLIC",
  variant: number,
): IneCp005RenderedStatement {
  if (surfaceKind === "SYMBOLIC") {
    return {
      constraint,
      surfaceKind,
      text: formatStatement(constraint, entityNames),
    };
  }
  const phraseKey = phraseKeyForRelation(constraint.relation, variant);
  return {
    constraint,
    surfaceKind,
    phraseKey,
    text: renderLinguisticConstraint(
      constraint,
      phraseKey,
      entityNames,
      context,
    ),
  };
}

export function reverseConstraint(
  constraint: ComparisonConstraint,
): ComparisonConstraint {
  return {
    leftId: constraint.rightId,
    relation: reverseRelation(constraint.relation),
    rightId: constraint.leftId,
    sourceStatementId: constraint.sourceStatementId,
  };
}
