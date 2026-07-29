import {
  ANA_CP001_FACTS,
} from "../../../Analogy/ANA-001/ANA-CP-001/task-registry";
import { ANA_CP001_RELATIONS } from "../../../Analogy/ANA-001/ANA-CP-001/relation-definitions";
import { ANA_CP002_FACTS } from "../../../Analogy/ANA-001/ANA-CP-002/lexical-facts.en";
import { ANA_CP002_RELATIONS } from "../../../Analogy/ANA-001/ANA-CP-002/relation-definitions";
import {
  CLS_CP001_CLASSES,
  CLS_CP001_ENTITIES,
} from "../CLS-CP-001/semantic-dataset.en";
import {
  CLS_CP002_SUPPLEMENTAL_FACTS,
  CLS_CP002_SUPPLEMENTAL_RELATIONS,
} from "./supplemental-relations.en";
import type {
  ClsCp002Pair,
  ClsCp002PrototypeDefinition,
  ClsCp002RelationDefinition,
  ClsCp002RelationFact,
} from "./types";

const EXCLUDED_VOLATILE_RELATIONS = new Set([
  "SEM_COUNTRY_CAPITAL",
  "SEM_STATE_CAPITAL",
  "SEM_COUNTRY_CURRENCY",
]);

const SEMANTIC_CONTRAST_GROUP: Readonly<Record<string, string>> = {
  SEM_ANIMAL_YOUNG: "ANIMAL_RELATION",
  SEM_MALE_FEMALE: "ANIMAL_RELATION",
  SEM_ANIMAL_SOUND: "ANIMAL_RELATION",
  SEM_ANIMAL_MOVEMENT: "ANIMAL_RELATION",
  SEM_WORKER_WORKPLACE: "WORKER_RELATION",
  SEM_WORKER_TOOL: "WORKER_RELATION",
  SEM_WORKER_PRODUCT: "WORKER_RELATION",
  SEM_INSTRUMENT_MEASUREMENT: "MEASUREMENT_RELATION",
  SEM_QUANTITY_UNIT: "MEASUREMENT_RELATION",
  SEM_OBJECT_FUNCTION: "OBJECT_RELATION",
  SEM_PART_WHOLE: "OBJECT_RELATION",
  SEM_MEMBER_CLASS: "MEMBERSHIP_RELATION",
  SEM_INDIVIDUAL_GROUP: "MEMBERSHIP_RELATION",
  SEM_PRODUCT_MATERIAL: "OBJECT_RELATION",
  SEM_PLACE_PURPOSE: "OBJECT_RELATION",
};

const LEXICAL_CONTRAST_GROUP: Readonly<Record<string, string>> = {
  LEX_SYNONYM: "LEXICAL_POLARITY",
  LEX_ANTONYM: "LEXICAL_POLARITY",
  LEX_INTENSITY_UP: "LEXICAL_INTENSITY",
  LEX_INTENSITY_DOWN: "LEXICAL_INTENSITY",
  LEX_CAUSE_EFFECT: "LEXICAL_CAUSAL",
  LEX_EFFECT_CAUSE: "LEXICAL_CAUSAL",
  LEX_CONDITION_SYMPTOM: "LEXICAL_CAUSAL",
  LEX_ACTION_RESULT: "LEXICAL_CAUSAL",
  LEX_OBJECT_CHARACTERISTIC: "LEXICAL_DESCRIPTION",
  LEX_WORD_DEFINITION: "LEXICAL_DESCRIPTION",
  LEX_DEFICIENCY_MISSING_QUALITY: "LEXICAL_DESCRIPTION",
  LEX_STUDY_SUBJECT: "LEXICAL_DESCRIPTION",
};

function normalise(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN");
}

function pairKey(left: string, right: string): string {
  return `${normalise(left)}\u0000${normalise(right)}`;
}

const importedSemanticDefinitions: ClsCp002RelationDefinition[] = ANA_CP001_RELATIONS
  .filter((definition) => !EXCLUDED_VOLATILE_RELATIONS.has(definition.id))
  .map((definition) => ({
    relationId: definition.id,
    label: definition.label,
    family: "DIRECTIONAL_SEMANTIC" as const,
    ruleStatement: definition.ruleStatement,
    directionSensitive: true,
    sourceCategory: definition.sourceCategory,
    answerCategory: definition.answerCategory,
    qualityRank: 110,
    contrastGroup: SEMANTIC_CONTRAST_GROUP[definition.id] ?? "SEMANTIC_OTHER",
  }));

const semanticDefinitions: ClsCp002RelationDefinition[] = [
  ...importedSemanticDefinitions,
  ...CLS_CP002_SUPPLEMENTAL_RELATIONS,
];

const lexicalDefinitions: ClsCp002RelationDefinition[] = ANA_CP002_RELATIONS.map((definition) => ({
  relationId: definition.id,
  label: definition.label,
  family: "LEXICAL" as const,
  ruleStatement: definition.ruleStatement,
  directionSensitive: !["LEX_SYNONYM", "LEX_ANTONYM"].includes(definition.id),
  sourceCategory: definition.sourceCategory,
  answerCategory: definition.answerCategory,
  qualityRank: ["LEX_SYNONYM", "LEX_ANTONYM"].includes(definition.id) ? 120 : 105,
  contrastGroup: LEXICAL_CONTRAST_GROUP[definition.id] ?? "LEXICAL_OTHER",
}));

const classDefinitions: ClsCp002RelationDefinition[] = CLS_CP001_CLASSES
  .filter((semanticClass) => semanticClass.qualityRank >= 90)
  .filter((semanticClass) => semanticClass.directMemberEntityIds.length >= 6)
  .map((semanticClass) => ({
    relationId: `PAIR_CLASS_${semanticClass.classId}`,
    label: `pair of ${semanticClass.label}`,
    family: "CLASS_COHESION" as const,
    ruleStatement: `Both words in the pair are ${semanticClass.label}.`,
    directionSensitive: false,
    sourceCategory: semanticClass.classId,
    answerCategory: semanticClass.classId,
    qualityRank: semanticClass.qualityRank,
    contrastGroup: `PAIR_CLASS_${semanticClass.contrastGroup}`,
  }));

export const CLS_CP002_RELATIONS: readonly ClsCp002RelationDefinition[] = [
  ...semanticDefinitions,
  ...lexicalDefinitions,
  ...classDefinitions,
];

export const CLS_CP002_RELATION_BY_ID = new Map(
  CLS_CP002_RELATIONS.map((definition) => [definition.relationId, definition]),
);

const importedSemanticFacts: ClsCp002RelationFact[] = ANA_CP001_FACTS
  .filter((fact) => !EXCLUDED_VOLATILE_RELATIONS.has(fact.relation))
  .filter((fact) => fact.status === "CURATED" && fact.factRisk !== "HIGH")
  .map((fact) => ({
    factId: `CLS-CP002-${fact.id}`,
    relationId: fact.relation,
    left: fact.left,
    right: fact.right,
    sourceCategory: fact.sourceCategory,
    answerCategory: fact.answerCategory,
    predicate: fact.predicate,
    difficulty: fact.difficulty,
    factRisk: fact.factRisk === "MEDIUM" ? "MEDIUM" as const : "LOW" as const,
    sourceLibrary: "ANA-CP-001" as const,
  }));

const semanticFacts: ClsCp002RelationFact[] = [
  ...importedSemanticFacts,
  ...CLS_CP002_SUPPLEMENTAL_FACTS,
];

const lexicalFacts: ClsCp002RelationFact[] = ANA_CP002_FACTS.map((fact) => ({
  factId: `CLS-CP002-${fact.id}`,
  relationId: fact.relation,
  left: fact.left,
  right: fact.right,
  sourceCategory: fact.sourceCategory,
  answerCategory: fact.answerCategory,
  predicate: fact.predicate,
  difficulty: fact.difficulty,
  factRisk: "LOW" as const,
  sourceLibrary: "ANA-CP-002" as const,
}));

export const CLS_CP002_FACTS: readonly ClsCp002RelationFact[] = [
  ...semanticFacts,
  ...lexicalFacts,
];

const factsByRelation = new Map<string, ClsCp002RelationFact[]>();
const factKeysByRelation = new Map<string, Set<string>>();
for (const fact of CLS_CP002_FACTS) {
  const facts = factsByRelation.get(fact.relationId) ?? [];
  facts.push(fact);
  factsByRelation.set(fact.relationId, facts);

  const keys = factKeysByRelation.get(fact.relationId) ?? new Set<string>();
  keys.add(pairKey(fact.left, fact.right));
  factKeysByRelation.set(fact.relationId, keys);
}

const entityByLabel = new Map(
  CLS_CP001_ENTITIES.map((entity) => [normalise(entity.label), entity]),
);

export function relationDefinition(relationId: string): ClsCp002RelationDefinition {
  const definition = CLS_CP002_RELATION_BY_ID.get(relationId);
  if (!definition) throw new Error(`Unknown CLS-CP-002 relation: ${relationId}`);
  return definition;
}

export function factsForRelation(relationId: string): readonly ClsCp002RelationFact[] {
  return factsByRelation.get(relationId) ?? [];
}

export function classMemberLabels(relationId: string): readonly string[] {
  if (!relationId.startsWith("PAIR_CLASS_")) return [];
  const classId = relationId.slice("PAIR_CLASS_".length);
  return CLS_CP001_ENTITIES
    .filter((entity) => entity.classIds.includes(classId))
    .map((entity) => entity.label);
}

export function directClassMemberLabels(relationId: string): readonly string[] {
  if (!relationId.startsWith("PAIR_CLASS_")) return [];
  const classId = relationId.slice("PAIR_CLASS_".length);
  return CLS_CP001_ENTITIES
    .filter((entity) => entity.directClassIds.includes(classId))
    .map((entity) => entity.label);
}

export function matchingRelationIds(
  pair: ClsCp002Pair,
  eligibleRelationIds: readonly string[],
): string[] {
  const matches: string[] = [];
  for (const relationId of eligibleRelationIds) {
    const definition = relationDefinition(relationId);
    if (definition.family === "CLASS_COHESION") {
      const classId = relationId.slice("PAIR_CLASS_".length);
      const left = entityByLabel.get(normalise(pair.left));
      const right = entityByLabel.get(normalise(pair.right));
      if (left?.classIds.includes(classId) && right?.classIds.includes(classId)) {
        matches.push(relationId);
      }
      continue;
    }

    const keys = factKeysByRelation.get(relationId);
    if (!keys) continue;
    if (keys.has(pairKey(pair.left, pair.right))) {
      matches.push(relationId);
      continue;
    }
    if (!definition.directionSensitive && keys.has(pairKey(pair.right, pair.left))) {
      matches.push(relationId);
    }
  }
  return matches;
}

export const CLS_CP002_SEMANTIC_RELATION_IDS = semanticDefinitions.map((definition) => definition.relationId);
export const CLS_CP002_LEXICAL_RELATION_IDS = lexicalDefinitions.map((definition) => definition.relationId);
export const CLS_CP002_CLASS_RELATION_IDS = classDefinitions.map((definition) => definition.relationId);

export const CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS = [
  "SEM_ANIMAL_YOUNG",
  "SEM_MALE_FEMALE",
  "SEM_INSTRUMENT_MEASUREMENT",
  "SEM_QUANTITY_UNIT",
  "LEX_SYNONYM",
  "LEX_ANTONYM",
  "LEX_STUDY_SUBJECT",
] as const;

const semanticContrastEligibleIds = semanticDefinitions
  .filter((definition) => semanticDefinitions.some(
    (other) => other.relationId !== definition.relationId && other.contrastGroup === definition.contrastGroup,
  ))
  .map((definition) => definition.relationId);

const directionSensitiveIds = [...semanticDefinitions, ...lexicalDefinitions]
  .filter((definition) => definition.directionSensitive)
  .map((definition) => definition.relationId);

export const CLS_CP002_PROTOTYPES: readonly ClsCp002PrototypeDefinition[] = [
  {
    prototypeId: "CLS-CP002-PROT-001",
    title: "Directional semantic relation outlier",
    generationProfile: "CONTRAST_RELATION",
    family: "DIRECTIONAL_SEMANTIC",
    eligibleRelationIds: semanticContrastEligibleIds,
  },
  {
    prototypeId: "CLS-CP002-PROT-002",
    title: "Synonym and antonym polarity outlier",
    generationProfile: "LEXICAL_POLARITY",
    family: "LEXICAL",
    eligibleRelationIds: ["LEX_SYNONYM", "LEX_ANTONYM"],
  },
  {
    prototypeId: "CLS-CP002-PROT-003",
    title: "Direction-reversal pair outlier",
    generationProfile: "REVERSED_DIRECTION",
    family: "DIRECTIONAL_SEMANTIC",
    eligibleRelationIds: directionSensitiveIds,
  },
  {
    prototypeId: "CLS-CP002-PROT-004",
    title: "Category-correct false semantic pair",
    generationProfile: "CATEGORY_SAFE_FALSE_PAIR",
    family: "DIRECTIONAL_SEMANTIC",
    eligibleRelationIds: CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS,
  },
  {
    prototypeId: "CLS-CP002-PROT-005",
    title: "Pair from a different semantic class",
    generationProfile: "CLASS_PAIR_CONTRAST",
    family: "CLASS_COHESION",
    eligibleRelationIds: CLS_CP002_CLASS_RELATION_IDS,
  },
];

export const CLS_CP002_PROTOTYPE_BY_ID = new Map(
  CLS_CP002_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);
