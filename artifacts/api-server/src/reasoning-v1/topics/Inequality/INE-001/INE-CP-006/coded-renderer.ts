import { SeededRandom, stableHash } from "../foundation/prng";
import type {
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import type {
  IneCp006CodeMap,
  IneCp006KeyEntry,
  IneCp006SymbolProfile,
} from "./types";

const RELATIONS: readonly ComparisonRelation[] = [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
];

const SYMBOL_SETS: Readonly<
  Record<
    IneCp006SymbolProfile,
    readonly { id: string; symbols: readonly string[] }[]
  >
> = {
  ASCII_EXAM_PROFILE: [
    { id: "ASCII_CLASSIC", symbols: ["@", "#", "$", "%", "&"] },
    { id: "ASCII_ALTERNATE", symbols: ["!", "^", "~", "+", "?"] },
  ],
  UNICODE_GUIDED_PROFILE: [
    { id: "GEOMETRIC", symbols: ["★", "◆", "●", "■", "▲"] },
    { id: "CIRCLED_OPERATORS", symbols: ["⊕", "⊗", "⊙", "⊖", "⊘"] },
  ],
};

const RELATION_SYMBOL: Readonly<Record<ComparisonRelation, string>> = {
  GREATER_THAN: ">",
  LESS_THAN: "<",
  EQUAL_TO: "=",
  GREATER_THAN_OR_EQUAL: "≥",
  LESS_THAN_OR_EQUAL: "≤",
};

const RELATION_WORDS: Readonly<Record<ComparisonRelation, string>> = {
  GREATER_THAN: "greater than",
  LESS_THAN: "less than",
  EQUAL_TO: "equal to",
  GREATER_THAN_OR_EQUAL: "greater than or equal to",
  LESS_THAN_OR_EQUAL: "less than or equal to",
};

export function ordinaryRelationSymbol(relation: ComparisonRelation): string {
  return RELATION_SYMBOL[relation];
}

export function ordinaryRelationWords(relation: ComparisonRelation): string {
  return RELATION_WORDS[relation];
}

export function buildIneCp006CodeMap(
  seed: number,
  profile: IneCp006SymbolProfile,
): IneCp006CodeMap {
  const profileSets = SYMBOL_SETS[profile];
  const symbolSet =
    profileSets[
      ((seed % profileSets.length) + profileSets.length) % profileSets.length
    ]!;
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash(["cp006-code-map-v1", symbolSet.id]), 16),
  );
  const symbols = random.shuffle(symbolSet.symbols);
  const symbolByRelation = Object.fromEntries(
    RELATIONS.map((relation, index) => [relation, symbols[index]!]),
  ) as Record<ComparisonRelation, string>;
  return {
    mapId: `${symbolSet.id}-${stableHash([seed, ...symbols]).toUpperCase()}`,
    symbolSetId: symbolSet.id,
    symbolByRelation,
  };
}

export function renderCodeKey(codeMap: IneCp006CodeMap): IneCp006KeyEntry[] {
  return RELATIONS.map((relation) => {
    const symbol = codeMap.symbolByRelation[relation];
    return {
      symbol,
      relation,
      text: `A ${symbol} B means A is ${RELATION_WORDS[relation]} B.`,
    };
  });
}

export function renderCodedConstraint(
  constraint: ComparisonConstraint,
  codeMap: IneCp006CodeMap,
  entityNames: Readonly<Record<string, string>>,
): string {
  const left = entityNames[constraint.leftId] ?? constraint.leftId;
  const right = entityNames[constraint.rightId] ?? constraint.rightId;
  return `${left} ${codeMap.symbolByRelation[constraint.relation]} ${right}`;
}

export function renderCodedExpressions(
  constraints: readonly ComparisonConstraint[],
  codeMap: IneCp006CodeMap,
  entityNames: Readonly<Record<string, string>>,
): string[] {
  const expressions: string[] = [];
  let index = 0;
  while (index < constraints.length) {
    const first = constraints[index]!;
    let text = renderCodedConstraint(first, codeMap, entityNames);
    let rightId = first.rightId;
    index += 1;
    while (
      index < constraints.length &&
      constraints[index]!.leftId === rightId
    ) {
      const next = constraints[index]!;
      const right = entityNames[next.rightId] ?? next.rightId;
      text += ` ${codeMap.symbolByRelation[next.relation]} ${right}`;
      rightId = next.rightId;
      index += 1;
    }
    expressions.push(text);
  }
  return expressions;
}
