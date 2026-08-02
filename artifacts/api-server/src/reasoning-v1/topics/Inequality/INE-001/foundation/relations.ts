import type {
  AtomicOrder,
  ComparisonConstraint,
  ComparisonRelation,
  ComparisonRelationToken,
  RelationPhraseKey,
} from "./types";

const RELATION_BY_TOKEN: Readonly<
  Record<ComparisonRelationToken, ComparisonRelation>
> = {
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  EQUAL_TO: "EQUAL_TO",
  GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
  LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
  ">": "GREATER_THAN",
  "<": "LESS_THAN",
  "=": "EQUAL_TO",
  ">=": "GREATER_THAN_OR_EQUAL",
  "<=": "LESS_THAN_OR_EQUAL",
  "≥": "GREATER_THAN_OR_EQUAL",
  "≤": "LESS_THAN_OR_EQUAL",
};

const RELATION_BY_PHRASE_KEY: Readonly<
  Record<RelationPhraseKey, ComparisonRelation>
> = {
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  NOT_LESS_THAN: "GREATER_THAN_OR_EQUAL",
  NOT_GREATER_THAN: "LESS_THAN_OR_EQUAL",
  EQUAL_TO: "EQUAL_TO",
  NEITHER_LESS_NOR_GREATER: "EQUAL_TO",
  NEITHER_LESS_NOR_EQUAL: "GREATER_THAN",
  NEITHER_GREATER_NOR_EQUAL: "LESS_THAN",
};

const DOMAIN_BY_RELATION: Readonly<
  Record<ComparisonRelation, readonly AtomicOrder[]>
> = {
  GREATER_THAN: ["GT"],
  LESS_THAN: ["LT"],
  EQUAL_TO: ["EQ"],
  GREATER_THAN_OR_EQUAL: ["EQ", "GT"],
  LESS_THAN_OR_EQUAL: ["LT", "EQ"],
};

export function normalizeRelation(
  token: ComparisonRelationToken,
): ComparisonRelation {
  return RELATION_BY_TOKEN[token];
}

export function normalizePhraseKey(
  phraseKey: RelationPhraseKey,
): ComparisonRelation {
  return RELATION_BY_PHRASE_KEY[phraseKey];
}

export function relationDomain(
  relation: ComparisonRelation,
): readonly AtomicOrder[] {
  return DOMAIN_BY_RELATION[relation];
}

export function reverseAtomicOrder(order: AtomicOrder): AtomicOrder {
  if (order === "GT") return "LT";
  if (order === "LT") return "GT";
  return "EQ";
}

export function reverseRelation(
  relation: ComparisonRelation,
): ComparisonRelation {
  switch (relation) {
    case "GREATER_THAN":
      return "LESS_THAN";
    case "LESS_THAN":
      return "GREATER_THAN";
    case "EQUAL_TO":
      return "EQUAL_TO";
    case "GREATER_THAN_OR_EQUAL":
      return "LESS_THAN_OR_EQUAL";
    case "LESS_THAN_OR_EQUAL":
      return "GREATER_THAN_OR_EQUAL";
  }
}

export function strongestDefiniteRelation(
  possibleAtomicRelations: readonly AtomicOrder[],
): ComparisonRelation | undefined {
  const domain = new Set(possibleAtomicRelations);
  if (domain.size === 1 && domain.has("GT")) return "GREATER_THAN";
  if (domain.size === 1 && domain.has("LT")) return "LESS_THAN";
  if (domain.size === 1 && domain.has("EQ")) return "EQUAL_TO";
  if (domain.size === 2 && domain.has("GT") && domain.has("EQ")) {
    return "GREATER_THAN_OR_EQUAL";
  }
  if (domain.size === 2 && domain.has("LT") && domain.has("EQ")) {
    return "LESS_THAN_OR_EQUAL";
  }
  return undefined;
}

export function atomicOrderForValues(left: number, right: number): AtomicOrder {
  if (left > right) return "GT";
  if (left < right) return "LT";
  return "EQ";
}

export function relationAcceptsAtomicOrder(
  relation: ComparisonRelation,
  atomicOrder: AtomicOrder,
): boolean {
  return relationDomain(relation).includes(atomicOrder);
}

export function createComparisonConstraint(
  leftId: string,
  relation: ComparisonRelationToken,
  rightId: string,
  sourceStatementId: string,
): ComparisonConstraint {
  return {
    leftId,
    relation: normalizeRelation(relation),
    rightId,
    sourceStatementId,
  };
}

export function normalizeConstraintDirection(
  constraint: ComparisonConstraint,
): ComparisonConstraint {
  if (constraint.relation === "LESS_THAN") {
    return {
      leftId: constraint.rightId,
      relation: "GREATER_THAN",
      rightId: constraint.leftId,
      sourceStatementId: constraint.sourceStatementId,
    };
  }
  if (constraint.relation === "LESS_THAN_OR_EQUAL") {
    return {
      leftId: constraint.rightId,
      relation: "GREATER_THAN_OR_EQUAL",
      rightId: constraint.leftId,
      sourceStatementId: constraint.sourceStatementId,
    };
  }
  return constraint;
}
