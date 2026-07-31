import type {
  FactRisk,
  PrototypeDefinition,
  PrototypeFamily,
  SemanticClass,
  SemanticEntity,
  SurfaceKind,
} from "./types";

type ClassSeed = {
  readonly classId: string;
  readonly label: string;
  readonly family: Exclude<PrototypeFamily, "INVERSE_CLASS_MEMBER">;
  readonly contrastGroup: string;
  readonly surfaceKind: SurfaceKind;
  readonly qualityRank: number;
  readonly parentClassIds: readonly string[];
  readonly members: readonly string[];
  readonly factRisk: FactRisk;
  readonly explanation: string;
  readonly shortcut: string;
  readonly trap: string;
};

const CLASS_SEEDS: readonly ClassSeed[] = [
  {
    classId: "CLS_FOOD_ITEMS",
    label: "food items",
    family: "HIERARCHY_CATEGORY",
    contrastGroup: "ROOT_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 40,
    parentClassIds: [],
    members: [],
    factRisk: "LOW",
    explanation: "These items belong to the broad class of food items.",
    shortcut: "Use the narrowest defensible food class before falling back to the broad food category.",
    trap: "A broad class that contains all four options cannot by itself identify an outlier.",
  },
  {
    classId: "CLS_FRUITS",
    label: "fruits",
    family: "DIRECT_CATEGORY",
    contrastGroup: "FOOD_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 90,
    parentClassIds: ["CLS_FOOD_ITEMS"],
    members: ["Apple", "Grape", "Pear", "Pomegranate", "Peach", "Plum", "Apricot", "Fig"],
    factRisk: "LOW",
    explanation: "These items are fruits.",
    shortcut: "Check the ordinary food category first: fruit, vegetable, cereal or spice.",
    trap: "Do not stop at the broad fact that every option is edible.",
  },
  {
    classId: "CLS_CITRUS_FRUITS",
    label: "citrus fruits",
    family: "HIERARCHY_CATEGORY",
    contrastGroup: "FRUIT_SUBCLASS",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 130,
    parentClassIds: ["CLS_FRUITS"],
    members: ["Orange", "Lemon", "Lime", "Grapefruit", "Mandarin", "Pomelo", "Citron", "Tangerine"],
    factRisk: "LOW",
    explanation: "These fruits belong to the narrower citrus class.",
    shortcut: "When all items are fruits, test whether three share a narrower fruit subclass.",
    trap: "The broader class fruit is true but less precise than the source-backed citrus class.",
  },
  {
    classId: "CLS_TROPICAL_FRUITS",
    label: "tropical fruits",
    family: "HIERARCHY_CATEGORY",
    contrastGroup: "FRUIT_SUBCLASS",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 130,
    parentClassIds: ["CLS_FRUITS"],
    members: ["Mango", "Banana", "Papaya", "Guava", "Pineapple", "Coconut", "Lychee", "Jackfruit"],
    factRisk: "LOW",
    explanation: "These fruits are commonly classified as tropical fruits.",
    shortcut: "After recognising fruit, check whether the common group is specifically tropical.",
    trap: "Do not select an item merely because all four are fruits; use the narrower recurring class.",
  },
  {
    classId: "CLS_VEGETABLES",
    label: "vegetables",
    family: "DIRECT_CATEGORY",
    contrastGroup: "FOOD_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: ["CLS_FOOD_ITEMS"],
    members: ["Carrot", "Potato", "Cabbage", "Spinach", "Radish", "Onion", "Cauliflower", "Pea"],
    factRisk: "LOW",
    explanation: "These items are vegetables in ordinary competitive-exam classification.",
    shortcut: "Separate vegetables from fruits, grains and spices.",
    trap: "Use conventional exam classification rather than a botanical debate about edible plant parts.",
  },
  {
    classId: "CLS_CEREALS",
    label: "cereals",
    family: "DIRECT_CATEGORY",
    contrastGroup: "FOOD_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: ["CLS_FOOD_ITEMS"],
    members: ["Wheat", "Rice", "Maize", "Barley", "Oats", "Millet", "Rye", "Sorghum"],
    factRisk: "LOW",
    explanation: "These items are cereal grains.",
    shortcut: "Separate staple grains from fruits, vegetables and spices.",
    trap: "Do not treat every plant product as a cereal.",
  },
  {
    classId: "CLS_SPICES",
    label: "spices",
    family: "DIRECT_CATEGORY",
    contrastGroup: "FOOD_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: ["CLS_FOOD_ITEMS"],
    members: ["Cumin", "Turmeric", "Cardamom", "Clove", "Pepper", "Cinnamon", "Fennel", "Nutmeg"],
    factRisk: "LOW",
    explanation: "These items are spices used for flavouring.",
    shortcut: "Look for the common culinary role rather than merely whether an item is edible.",
    trap: "Do not confuse spices with staple grains or vegetables.",
  },
  {
    classId: "CLS_PLANTS",
    label: "plants",
    family: "HIERARCHY_CATEGORY",
    contrastGroup: "ROOT_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 40,
    parentClassIds: [],
    members: [],
    factRisk: "LOW",
    explanation: "These names belong to the broad class of plants.",
    shortcut: "Prefer the narrower plant form, such as flower or tree, when it explains three options.",
    trap: "The broad word plant often groups every option and therefore does not identify the odd one.",
  },
  {
    classId: "CLS_FLOWERS",
    label: "flowers",
    family: "DIRECT_CATEGORY",
    contrastGroup: "PLANT_FORM",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 120,
    parentClassIds: ["CLS_PLANTS"],
    members: ["Rose", "Lotus", "Marigold", "Jasmine", "Tulip", "Dahlia", "Lily", "Sunflower"],
    factRisk: "LOW",
    explanation: "These names refer to flowers.",
    shortcut: "Decide whether each plant name is a flower or a tree.",
    trap: "Do not stop at the broad class plant when a narrower plant form is clear.",
  },
  {
    classId: "CLS_TREES",
    label: "trees",
    family: "DIRECT_CATEGORY",
    contrastGroup: "PLANT_FORM",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 120,
    parentClassIds: ["CLS_PLANTS"],
    members: ["Neem", "Banyan", "Teak", "Pine", "Oak", "Cedar", "Eucalyptus", "Peepal"],
    factRisk: "LOW",
    explanation: "These names refer to trees.",
    shortcut: "Separate the plant form: tree versus flower.",
    trap: "All options may be plants, but only three may be trees.",
  },
  {
    classId: "CLS_ANIMALS",
    label: "animals",
    family: "HIERARCHY_CATEGORY",
    contrastGroup: "ROOT_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 35,
    parentClassIds: [],
    members: [],
    factRisk: "LOW",
    explanation: "These living creatures belong to the broad animal class.",
    shortcut: "Use the narrowest stable biological or ecological class supported by three options.",
    trap: "The broad class animal usually includes all four and cannot settle the answer.",
  },
  {
    classId: "CLS_BIRDS",
    label: "birds",
    family: "DIRECT_CATEGORY",
    contrastGroup: "ANIMAL_CROSS_CUTTING",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 110,
    parentClassIds: ["CLS_ANIMALS"],
    members: ["Sparrow", "Eagle", "Peacock", "Pigeon", "Parrot", "Crow", "Owl", "Duck", "Penguin", "Hen"],
    factRisk: "LOW",
    explanation: "These animals are birds.",
    shortcut: "Identify the biological class before relying on habitat or movement.",
    trap: "Flying ability is not the defining test because some birds do not fly.",
  },
  {
    classId: "CLS_MAMMALS",
    label: "mammals",
    family: "DIRECT_CATEGORY",
    contrastGroup: "ANIMAL_CROSS_CUTTING",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 110,
    parentClassIds: ["CLS_ANIMALS"],
    members: ["Lion", "Tiger", "Elephant", "Horse", "Cow", "Whale", "Goat", "Deer", "Dolphin", "Seal", "Bat"],
    factRisk: "LOW",
    explanation: "These animals are mammals.",
    shortcut: "Use the stable animal class rather than size, habitat or movement.",
    trap: "Whales and dolphins live in water, while bats fly, but all are mammals.",
  },
  {
    classId: "CLS_AQUATIC_ANIMALS",
    label: "aquatic animals",
    family: "CROSS_CUTTING_CATEGORY",
    contrastGroup: "ANIMAL_CROSS_CUTTING",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 110,
    parentClassIds: ["CLS_ANIMALS"],
    members: ["Whale", "Dolphin", "Shark", "Octopus", "Duck", "Crocodile", "Seal", "Penguin"],
    factRisk: "LOW",
    explanation: "These animals characteristically live or spend substantial time in water.",
    shortcut: "Check habitat only after testing stable biological classes.",
    trap: "An aquatic group can overlap birds and mammals, so competing answers must be audited.",
  },
  {
    classId: "CLS_FLYING_ANIMALS",
    label: "animals capable of flight",
    family: "CROSS_CUTTING_CATEGORY",
    contrastGroup: "ANIMAL_CROSS_CUTTING",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 110,
    parentClassIds: ["CLS_ANIMALS"],
    members: ["Eagle", "Sparrow", "Parrot", "Pigeon", "Bat", "Butterfly", "Bee", "Dragonfly"],
    factRisk: "LOW",
    explanation: "These animals are capable of powered flight.",
    shortcut: "Treat movement as a cross-cutting property, not as a biological class.",
    trap: "A flying-animal rule may compete with bird or mammal membership and can make a question ambiguous.",
  },
  {
    classId: "CLS_RIVERS",
    label: "rivers",
    family: "DIRECT_CATEGORY",
    contrastGroup: "GEOGRAPHIC_TYPE",
    surfaceKind: "PROPER_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Ganga", "Yamuna", "Sutlej", "Beas", "Ravi", "Narmada", "Godavari", "Krishna"],
    factRisk: "LOW",
    explanation: "These names refer to rivers.",
    shortcut: "Classify the geographic feature before thinking about location.",
    trap: "Do not group proper names merely because they are geographical.",
  },
  {
    classId: "CLS_MOUNTAIN_RANGES",
    label: "mountain ranges",
    family: "DIRECT_CATEGORY",
    contrastGroup: "GEOGRAPHIC_TYPE",
    surfaceKind: "PROPER_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Himalayas", "Aravalli", "Vindhya", "Satpura", "Andes", "Alps", "Rockies", "Urals"],
    factRisk: "LOW",
    explanation: "These names refer to mountain ranges.",
    shortcut: "Check whether the proper names are rivers or mountain ranges.",
    trap: "Do not use country or continent as the grouping rule.",
  },
  {
    classId: "CLS_MUSICAL_INSTRUMENTS",
    label: "musical instruments",
    family: "DIRECT_CATEGORY",
    contrastGroup: "EQUIPMENT_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Sitar", "Tabla", "Flute", "Violin", "Guitar", "Piano", "Trumpet", "Drum"],
    factRisk: "LOW",
    explanation: "These objects are musical instruments.",
    shortcut: "Ask what activity the object is mainly used for.",
    trap: "Do not group by material or shape when function gives the stable class.",
  },
  {
    classId: "CLS_SPORTS_EQUIPMENT",
    label: "sports equipment",
    family: "DIRECT_CATEGORY",
    contrastGroup: "EQUIPMENT_CATEGORY",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Racket", "Cricket bat", "Hockey stick", "Football", "Wicket", "Shuttlecock", "Helmet", "Goalpost"],
    factRisk: "LOW",
    explanation: "These objects are used as sports equipment.",
    shortcut: "Use the main activity linked with each object.",
    trap: "Do not treat every handheld object as belonging to one class.",
  },
  {
    classId: "CLS_WRITING_TOOLS",
    label: "writing tools",
    family: "FUNCTIONAL_USE",
    contrastGroup: "TOOL_FUNCTION",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Pen", "Pencil", "Marker", "Chalk", "Crayon", "Stylus", "Fountain pen", "Highlighter"],
    factRisk: "LOW",
    explanation: "These tools are primarily used to write or mark.",
    shortcut: "Group tools by their primary use, not by material.",
    trap: "Some tools share a shape, but primary function is the intended rule.",
  },
  {
    classId: "CLS_CUTTING_TOOLS",
    label: "cutting tools",
    family: "FUNCTIONAL_USE",
    contrastGroup: "TOOL_FUNCTION",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Scissors", "Knife", "Saw", "Axe", "Cutter", "Shears", "Razor", "Sickle"],
    factRisk: "LOW",
    explanation: "These tools are primarily used for cutting.",
    shortcut: "Identify the action performed by each tool.",
    trap: "Do not classify merely by whether an object is metal or sharp.",
  },
  {
    classId: "CLS_MEASURING_INSTRUMENTS",
    label: "measuring instruments",
    family: "FUNCTIONAL_USE",
    contrastGroup: "TOOL_FUNCTION",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Ruler", "Thermometer", "Barometer", "Ammeter", "Speedometer", "Voltmeter", "Odometer", "Hygrometer"],
    factRisk: "LOW",
    explanation: "These instruments are used to measure a quantity.",
    shortcut: "Check whether the object measures, cuts, writes or cooks.",
    trap: "The measured quantities differ, but the common function is measurement.",
  },
  {
    classId: "CLS_COOKING_TOOLS",
    label: "cooking tools",
    family: "FUNCTIONAL_USE",
    contrastGroup: "TOOL_FUNCTION",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Spatula", "Ladle", "Whisk", "Tongs", "Rolling pin", "Peeler", "Grater", "Colander"],
    factRisk: "LOW",
    explanation: "These tools are primarily used while preparing food.",
    shortcut: "Use the primary kitchen function rather than size or material.",
    trap: "A kitchen tool may cut or hold food, but its reviewed class is cooking equipment.",
  },
  {
    classId: "CLS_TREE_PARTS",
    label: "parts of a tree",
    family: "PART_WHOLE",
    contrastGroup: "SYSTEM_PARTS",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Root", "Trunk", "Branch", "Bark", "Leaf", "Twig", "Crown", "Sapwood"],
    factRisk: "LOW",
    explanation: "These are parts of a tree.",
    shortcut: "Name the whole system to which three parts belong.",
    trap: "Do not group by material or appearance; check system membership.",
  },
  {
    classId: "CLS_SHIP_PARTS",
    label: "parts of a ship",
    family: "PART_WHOLE",
    contrastGroup: "SYSTEM_PARTS",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Deck", "Mast", "Anchor", "Rudder", "Hull", "Cabin", "Keel", "Propeller"],
    factRisk: "LOW",
    explanation: "These are parts or standard components of a ship.",
    shortcut: "Test whether each item belongs to the same vehicle or system.",
    trap: "Do not confuse objects carried on a ship with structural ship parts.",
  },
  {
    classId: "CLS_COMPUTER_PARTS",
    label: "computer components",
    family: "PART_WHOLE",
    contrastGroup: "SYSTEM_PARTS",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Processor", "Motherboard", "Memory", "Keyboard", "Monitor", "Mouse", "Hard drive", "Power supply"],
    factRisk: "LOW",
    explanation: "These are standard components or peripherals of a computer system.",
    shortcut: "Identify the common system before considering each component's individual function.",
    trap: "Do not group electronic objects merely because they use electricity.",
  },
  {
    classId: "CLS_CIRCLE_COMPONENTS",
    label: "parts or elements of a circle",
    family: "PART_WHOLE",
    contrastGroup: "SYSTEM_PARTS",
    surfaceKind: "COMMON_NOUN",
    qualityRank: 100,
    parentClassIds: [],
    members: ["Radius", "Diameter", "Chord", "Arc", "Centre", "Circumference", "Sector", "Segment"],
    factRisk: "LOW",
    explanation: "These are standard parts or elements of a circle.",
    shortcut: "Check whether each term belongs to the same geometric figure.",
    trap: "Do not confuse a circle element with a general geometric term.",
  },
] as const;

const CLASS_SEED_BY_ID = new Map(CLASS_SEEDS.map((seed) => [seed.classId, seed]));

function ancestorsOf(classId: string, trail: readonly string[] = []): string[] {
  if (trail.includes(classId)) throw new Error(`Semantic class hierarchy cycle: ${[...trail, classId].join(" -> ")}`);
  const seed = CLASS_SEED_BY_ID.get(classId);
  if (!seed) throw new Error(`Unknown semantic class in hierarchy: ${classId}`);
  return seed.parentClassIds.flatMap((parentId) => [parentId, ...ancestorsOf(parentId, [...trail, classId])]);
}

function hierarchyDepth(classId: string): number {
  const seed = CLASS_SEED_BY_ID.get(classId);
  if (!seed) throw new Error(`Unknown semantic class: ${classId}`);
  if (seed.parentClassIds.length === 0) return 0;
  return 1 + Math.max(...seed.parentClassIds.map(hierarchyDepth));
}

function normaliseLabel(label: string): string {
  return label.trim().toLocaleLowerCase("en-IN");
}

function entityId(label: string): string {
  return `CLS_ENT_${label.toLocaleUpperCase("en-IN").replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
}

const labelsInOrder: string[] = [];
const directMembership = new Map<string, Set<string>>();
for (const seed of CLASS_SEEDS) {
  for (const label of seed.members) {
    const key = normaliseLabel(label);
    if (!directMembership.has(key)) {
      directMembership.set(key, new Set());
      labelsInOrder.push(label);
    }
    directMembership.get(key)!.add(seed.classId);
  }
}

export const CLS_CP001_ENTITIES: readonly SemanticEntity[] = labelsInOrder.map((label) => {
  const directClassIds = [...directMembership.get(normaliseLabel(label))!];
  const classIds = [...new Set(directClassIds.flatMap((classId) => [classId, ...ancestorsOf(classId)]))];
  return {
    entityId: entityId(label),
    label,
    directClassIds,
    classIds,
  };
});

export const CLS_CP001_CLASSES: readonly SemanticClass[] = CLASS_SEEDS.map((seed) => {
  const directMemberEntityIds = CLS_CP001_ENTITIES
    .filter((entity) => entity.directClassIds.includes(seed.classId))
    .map((entity) => entity.entityId);
  const memberEntityIds = CLS_CP001_ENTITIES
    .filter((entity) => entity.classIds.includes(seed.classId))
    .map((entity) => entity.entityId);
  return {
    classId: seed.classId,
    label: seed.label,
    family: seed.family,
    contrastGroup: seed.contrastGroup,
    surfaceKind: seed.surfaceKind,
    qualityRank: seed.qualityRank,
    hierarchyDepth: hierarchyDepth(seed.classId),
    parentClassIds: seed.parentClassIds,
    memberEntityIds,
    directMemberEntityIds,
    factRisk: seed.factRisk,
    explanation: seed.explanation,
    shortcut: seed.shortcut,
    trap: seed.trap,
  };
});

const DIRECT_CLASS_IDS = CLS_CP001_CLASSES
  .filter((semanticClass) => semanticClass.family === "DIRECT_CATEGORY")
  .map((semanticClass) => semanticClass.classId);
const FUNCTIONAL_CLASS_IDS = CLS_CP001_CLASSES
  .filter((semanticClass) => semanticClass.family === "FUNCTIONAL_USE")
  .map((semanticClass) => semanticClass.classId);
const PART_CLASS_IDS = CLS_CP001_CLASSES
  .filter((semanticClass) => semanticClass.family === "PART_WHOLE")
  .map((semanticClass) => semanticClass.classId);
const HIERARCHY_INTENDED_IDS = ["CLS_CITRUS_FRUITS", "CLS_TROPICAL_FRUITS", "CLS_FLOWERS", "CLS_TREES"] as const;
const HIERARCHY_ELIGIBLE_IDS = [
  "CLS_FOOD_ITEMS",
  "CLS_FRUITS",
  "CLS_CITRUS_FRUITS",
  "CLS_TROPICAL_FRUITS",
  "CLS_PLANTS",
  "CLS_FLOWERS",
  "CLS_TREES",
] as const;
const CROSS_CUTTING_INTENDED_IDS = ["CLS_BIRDS", "CLS_MAMMALS", "CLS_AQUATIC_ANIMALS", "CLS_FLYING_ANIMALS"] as const;
const CROSS_CUTTING_ELIGIBLE_IDS = ["CLS_ANIMALS", ...CROSS_CUTTING_INTENDED_IDS] as const;

export const CLS_CP001_PROTOTYPES: readonly PrototypeDefinition[] = [
  {
    prototypeId: "CLS-CP001-PROT-001",
    family: "DIRECT_CATEGORY",
    generationProfile: "CLEAN_SIBLING",
    task: "FIND_OUTLIER",
    title: "Direct semantic category outlier",
    intendedClassIds: DIRECT_CLASS_IDS,
    eligibleClassIds: DIRECT_CLASS_IDS,
  },
  {
    prototypeId: "CLS-CP001-PROT-002",
    family: "FUNCTIONAL_USE",
    generationProfile: "CLEAN_SIBLING",
    task: "FIND_OUTLIER",
    title: "Primary-function outlier",
    intendedClassIds: FUNCTIONAL_CLASS_IDS,
    eligibleClassIds: FUNCTIONAL_CLASS_IDS,
  },
  {
    prototypeId: "CLS-CP001-PROT-003",
    family: "PART_WHOLE",
    generationProfile: "CLEAN_SIBLING",
    task: "FIND_OUTLIER",
    title: "Part or system-membership outlier",
    intendedClassIds: PART_CLASS_IDS,
    eligibleClassIds: PART_CLASS_IDS,
  },
  {
    prototypeId: "CLS-CP001-PROT-004",
    family: "INVERSE_CLASS_MEMBER",
    generationProfile: "CLASS_MEMBER",
    task: "SELECT_CLASS_MEMBER",
    title: "Select another member of the supplied class",
    intendedClassIds: DIRECT_CLASS_IDS,
    eligibleClassIds: DIRECT_CLASS_IDS,
  },
  {
    prototypeId: "CLS-CP001-PROT-005",
    family: "HIERARCHY_CATEGORY",
    generationProfile: "HIERARCHY_SIBLING",
    task: "FIND_OUTLIER",
    title: "Narrower class outlier inside a broad shared category",
    intendedClassIds: HIERARCHY_INTENDED_IDS,
    eligibleClassIds: HIERARCHY_ELIGIBLE_IDS,
  },
  {
    prototypeId: "CLS-CP001-PROT-006",
    family: "CROSS_CUTTING_CATEGORY",
    generationProfile: "CROSS_CUTTING",
    task: "FIND_OUTLIER",
    title: "Cross-cutting multi-membership outlier",
    intendedClassIds: CROSS_CUTTING_INTENDED_IDS,
    eligibleClassIds: CROSS_CUTTING_ELIGIBLE_IDS,
  },
  {
    prototypeId: "CLS-CP001-PROT-007",
    family: "INVERSE_CLASS_MEMBER",
    generationProfile: "HIERARCHY_CLASS_MEMBER",
    task: "SELECT_CLASS_MEMBER",
    title: "Select a member of the narrowest shared class",
    intendedClassIds: HIERARCHY_INTENDED_IDS,
    eligibleClassIds: HIERARCHY_ELIGIBLE_IDS,
  },
] as const;

export const CLASS_BY_ID = new Map(CLS_CP001_CLASSES.map((semanticClass) => [semanticClass.classId, semanticClass]));
export const ENTITY_BY_ID = new Map(CLS_CP001_ENTITIES.map((entity) => [entity.entityId, entity]));
export const ENTITY_BY_LABEL = new Map(CLS_CP001_ENTITIES.map((entity) => [normaliseLabel(entity.label), entity]));
export const PROTOTYPE_BY_ID = new Map(CLS_CP001_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]));
