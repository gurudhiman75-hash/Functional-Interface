import {
  CLASS_BY_ID,
} from "../CLS-CP-001/semantic-dataset.en";
import {
  CLS_CP002_CLASS_RELATION_IDS,
  CLS_CP002_LEXICAL_RELATION_IDS,
  CLS_CP002_SEMANTIC_RELATION_IDS,
  matchingRelationIds,
  relationDefinition,
} from "./relation-registry";
import type {
  ClsCp002Pair,
  GeneratedClsCp002Question,
} from "./types";

const ALL_RELATION_IDS = [
  ...CLS_CP002_SEMANTIC_RELATION_IDS,
  ...CLS_CP002_LEXICAL_RELATION_IDS,
  ...CLS_CP002_CLASS_RELATION_IDS,
];

function display(pair: ClsCp002Pair): string {
  return `${pair.left} : ${pair.right}`;
}

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function simpleClassLabel(classId: string): string {
  const semanticClass = CLASS_BY_ID.get(classId);
  if (!semanticClass) throw new Error(`Unknown semantic class: ${classId}`);
  const overrides: Readonly<Record<string, string>> = {
    CLS_AQUATIC_ANIMALS: "animals that live in water",
    CLS_FLYING_ANIMALS: "animals that can fly",
    CLS_COMPUTER_PARTS: "computer parts",
    CLS_CIRCLE_COMPONENTS: "parts of a circle",
  };
  return overrides[classId] ?? semanticClass.label;
}

function bestAlternativeRelation(pair: ClsCp002Pair, intendedRelationId: string): string | null {
  return matchingRelationIds(pair, ALL_RELATION_IDS)
    .filter((relationId) => relationId !== intendedRelationId)
    .sort((leftId, rightId) => {
      const left = relationDefinition(leftId);
      const right = relationDefinition(rightId);
      return right.qualityRank - left.qualityRank || leftId.localeCompare(rightId);
    })[0] ?? null;
}

function alternativeReason(pair: ClsCp002Pair, relationId: string): string {
  const pairText = display(pair);
  if (relationId.startsWith("PAIR_CLASS_")) {
    const classId = relationId.slice("PAIR_CLASS_".length);
    return `Both words in ${pairText} are ${simpleClassLabel(classId)}, so this pair is different.`;
  }

  switch (relationId) {
    case "LEX_SYNONYM":
      return `The two words in ${pairText} have the same meaning, so this pair is different.`;
    case "LEX_ANTONYM":
      return `The two words in ${pairText} have opposite meanings, so this pair is different.`;
    case "SEM_PART_WHOLE":
      return `${pair.left} is part of ${pair.right}, so ${pairText} is different.`;
    case "SEM_MATERIAL_PRODUCT":
      return `${pair.right} is made from ${pair.left}, so ${pairText} is different.`;
    case "SEM_PRODUCT_MATERIAL":
      return `${pair.right} is the material used to make ${pair.left}, so ${pairText} is different.`;
    case "SEM_WORKER_WORKPLACE":
      return `${pair.right} is the usual workplace of ${pair.left}, so ${pairText} is different.`;
    case "SEM_WORKER_TOOL":
      return `${pair.right} is a tool used by ${pair.left}, so ${pairText} is different.`;
    case "SEM_WORKER_PRODUCT":
      return `${pair.right} is made by ${pair.left}, so ${pairText} is different.`;
    case "SEM_INSTRUMENT_MEASUREMENT":
      return `${pair.left} measures ${pair.right}, so ${pairText} is different.`;
    case "SEM_QUANTITY_UNIT":
      return `${pair.right} is a unit of ${pair.left}, so ${pairText} is different.`;
    case "SEM_OBJECT_FUNCTION":
      return `${pair.right} is the main use of ${pair.left}, so ${pairText} is different.`;
    case "SEM_MEMBER_CLASS":
      return `${pair.left} is a member of ${pair.right}, so ${pairText} is different.`;
    case "SEM_INDIVIDUAL_GROUP":
      return `${pair.right} is the group to which ${pair.left} belongs, so ${pairText} is different.`;
    case "SEM_PLACE_PURPOSE":
      return `${pair.right} is the main purpose of ${pair.left}, so ${pairText} is different.`;
    case "SEM_CONTAINER_CONTENT":
      return `${pair.left} commonly holds ${pair.right}, so ${pairText} is different.`;
    case "SEM_OBJECT_SOUND":
      return `${pair.right} is a characteristic sound of ${pair.left}, so ${pairText} is different.`;
    case "SEM_ANIMAL_YOUNG":
      return `${pair.right} is the young one of ${pair.left}, so ${pairText} is different.`;
    case "SEM_MALE_FEMALE":
      return `${pair.right} is the female counterpart of ${pair.left}, so ${pairText} is different.`;
    case "SEM_ANIMAL_SOUND":
      return `${pair.right} is the sound made by ${pair.left}, so ${pairText} is different.`;
    case "SEM_ANIMAL_MOVEMENT":
      return `${pair.right} is a characteristic movement of ${pair.left}, so ${pairText} is different.`;
    case "SEM_KIN_ONE_GENERATION_DOWN":
      return `${pair.right} is one family generation below ${pair.left}, so ${pairText} is different.`;
    default:
      return `${pairText} follows a different relationship (${relationDefinition(relationId).label}).`;
  }
}

function simpleRule(relationId: string): string {
  if (relationId.startsWith("PAIR_CLASS_")) {
    const classId = relationId.slice("PAIR_CLASS_".length);
    return `Both words in each common pair are ${simpleClassLabel(classId)}.`;
  }
  const replacements: Readonly<Record<string, string>> = {
    SEM_MATERIAL_PRODUCT: "The second item is made from the first material.",
    SEM_PRODUCT_MATERIAL: "The second item is the material used to make the first.",
    SEM_KIN_ONE_GENERATION_DOWN: "The second family role is one generation below the first.",
  };
  return replacements[relationId] ?? relationDefinition(relationId).ruleStatement;
}

export function polishClsCp002EnglishQuestion<T extends GeneratedClsCp002Question>(question: T): T {
  const commonPairs = question.pairs
    .filter((_, index) => index !== question.correctIndex)
    .map(display);
  const oddPair = question.pairs[question.correctIndex]!;
  const odd = display(oddPair);

  const secondStep = question.generationProfile === "REVERSED_DIRECTION"
    ? `${odd} reverses the required direction.`
    : question.generationProfile === "CATEGORY_SAFE_FALSE_PAIR"
      ? `${odd} uses the expected kinds of words, but they do not form the required relationship.`
      : (() => {
        const alternative = bestAlternativeRelation(oddPair, question.intendedRelationId);
        return alternative
          ? alternativeReason(oddPair, alternative)
          : `${odd} does not follow the common relationship.`;
      })();

  const intendedRelationLabel = question.intendedRelationId.startsWith("PAIR_CLASS_")
    ? `${simpleClassLabel(question.intendedRelationId.slice("PAIR_CLASS_".length))} pair`
    : question.intendedRelationLabel;

  return {
    ...question,
    intendedRelationLabel,
    explanation: {
      coreConcept: [`The other pairs follow this relation: ${simpleRule(question.intendedRelationId)}`],
      stepByStep: [
        `${naturalList(commonPairs)} follow the same relationship.`,
        secondStep,
        `Therefore, ${odd} is the odd pair.`,
      ],
      examSpeedShortcut: question.explanation.examSpeedShortcut,
      commonTrapWarning: question.explanation.commonTrapWarning,
    },
  };
}
