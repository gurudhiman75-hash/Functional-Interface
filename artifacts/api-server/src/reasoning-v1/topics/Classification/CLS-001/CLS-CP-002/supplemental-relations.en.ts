import type {
  ClsCp002RelationDefinition,
  ClsCp002RelationFact,
} from "./types";

type SupplementalSeed = {
  readonly relationId: string;
  readonly label: string;
  readonly ruleStatement: string;
  readonly directionSensitive: boolean;
  readonly sourceCategory: string;
  readonly answerCategory: string;
  readonly contrastGroup: string;
  readonly pairs: readonly (readonly [string, string])[];
  readonly predicate: (left: string, right: string) => string;
};

const SUPPLEMENTAL_SEEDS: readonly SupplementalSeed[] = [
  {
    relationId: "SEM_CONTAINER_CONTENT",
    label: "container and usual content",
    ruleStatement: "The first item commonly contains or holds the second.",
    directionSensitive: true,
    sourceCategory: "CONTAINER",
    answerCategory: "CONTENT",
    contrastGroup: "OBJECT_RELATION",
    pairs: [
      ["Bottle", "Water"],
      ["Cup", "Tea"],
      ["Glass", "Juice"],
      ["Tank", "Fuel"],
      ["Jar", "Pickles"],
      ["Envelope", "Letter"],
      ["Cage", "Bird"],
      ["Aquarium", "Fish"],
      ["Wallet", "Money"],
      ["Basket", "Fruits"],
      ["Box", "Chocolates"],
      ["Sack", "Grain"],
    ],
    predicate: (left, right) => `A ${left} commonly contains or holds ${right}.`,
  },
  {
    relationId: "SEM_MATERIAL_PRODUCT",
    label: "raw material and product",
    ruleStatement: "The second item is commonly made from the first material.",
    directionSensitive: true,
    sourceCategory: "MATERIAL",
    answerCategory: "PRODUCT",
    contrastGroup: "OBJECT_RELATION",
    pairs: [
      ["Wood", "Table"],
      ["Pulp", "Paper"],
      ["Grapes", "Wine"],
      ["Clay", "Pottery"],
      ["Cotton", "Cloth"],
      ["Leather", "Shoes"],
      ["Milk", "Cheese"],
      ["Iron", "Tools"],
      ["Rubber", "Tyre"],
      ["Sand", "Glass"],
      ["Gold", "Jewellery"],
      ["Wheat", "Bread"],
    ],
    predicate: (left, right) => `${right} is commonly made from ${left}.`,
  },
  {
    relationId: "SEM_OBJECT_SOUND",
    label: "object and characteristic sound",
    ruleStatement: "The second term is a characteristic sound produced by the first object or source.",
    directionSensitive: true,
    sourceCategory: "SOUND_SOURCE",
    answerCategory: "SOUND",
    contrastGroup: "OBJECT_RELATION",
    pairs: [
      ["Bell", "Ring"],
      ["Clock", "Tick"],
      ["Drum", "Beat"],
      ["Horn", "Honk"],
      ["Gun", "Bang"],
      ["Doorbell", "Chime"],
      ["Alarm", "Buzz"],
      ["Engine", "Roar"],
      ["Keyboard", "Click"],
      ["Camera", "Click"],
      ["Telephone", "Ring"],
      ["Firecracker", "Bang"],
    ],
    predicate: (left, right) => `A ${left} characteristically produces a ${right} sound.`,
  },
  {
    relationId: "SEM_KIN_ONE_GENERATION_DOWN",
    label: "older family role and next-generation role",
    ruleStatement: "The second family role is one generation below the first.",
    directionSensitive: true,
    sourceCategory: "OLDER_FAMILY_ROLE",
    answerCategory: "YOUNGER_FAMILY_ROLE",
    contrastGroup: "KIN_ROLE_RELATION",
    pairs: [
      ["Father", "Son"],
      ["Father", "Daughter"],
      ["Mother", "Son"],
      ["Mother", "Daughter"],
      ["Uncle", "Nephew"],
      ["Uncle", "Niece"],
      ["Aunt", "Nephew"],
      ["Aunt", "Niece"],
      ["Parent", "Child"],
      ["Parent", "Son"],
      ["Grandfather", "Father"],
      ["Grandmother", "Mother"],
    ],
    predicate: (left, right) => `${right} is one family generation below ${left}.`,
  },
];

export const CLS_CP002_SUPPLEMENTAL_RELATIONS: readonly ClsCp002RelationDefinition[] =
  SUPPLEMENTAL_SEEDS.map((seed) => ({
    relationId: seed.relationId,
    label: seed.label,
    family: "DIRECTIONAL_SEMANTIC",
    ruleStatement: seed.ruleStatement,
    directionSensitive: seed.directionSensitive,
    sourceCategory: seed.sourceCategory,
    answerCategory: seed.answerCategory,
    qualityRank: 112,
    contrastGroup: seed.contrastGroup,
  }));

export const CLS_CP002_SUPPLEMENTAL_FACTS: readonly ClsCp002RelationFact[] =
  SUPPLEMENTAL_SEEDS.flatMap((seed, relationIndex) => seed.pairs.map(([left, right], pairIndex) => ({
    factId: `CLS-CP002-SUP-${String(relationIndex + 1).padStart(2, "0")}-${String(pairIndex + 1).padStart(2, "0")}`,
    relationId: seed.relationId,
    left,
    right,
    sourceCategory: seed.sourceCategory,
    answerCategory: seed.answerCategory,
    predicate: seed.predicate(left, right),
    difficulty: pairIndex < 4 ? "EASY" as const : pairIndex < 9 ? "MEDIUM" as const : "HARD" as const,
    factRisk: "LOW" as const,
    sourceLibrary: "CLS-CP-002" as const,
  })));
