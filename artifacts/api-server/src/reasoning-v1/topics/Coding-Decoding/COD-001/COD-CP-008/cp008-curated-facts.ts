import type { Cp008SemanticFact } from "./cp008-prototype-types";

export const CP008_DIRECT_LABEL_POOLS: readonly (readonly string[])[] = [
  ["second", "minute", "hour", "day", "week", "month", "year"],
  ["teacher", "doctor", "manager", "engineer", "lawyer", "accountant", "clerk"],
  ["red", "white", "blue", "green", "orange", "pink", "black"],
  ["pen", "paper", "book", "table", "chair", "bottle", "bag"],
  ["eye", "ear", "nose", "hand", "mouth", "tongue", "foot"],
  ["apple", "mango", "banana", "orange", "papaya", "grape", "coconut"],
] as const;

export const CP008_SEMANTIC_FACTS: readonly Cp008SemanticFact[] = [
  {
    factId: "PATIENTS_TREATED_BY_DOCTOR",
    category: "ROLE",
    question: "who treats patients?",
    ordinaryAnswer: "doctor",
    rationale: "A doctor treats patients.",
    domain: ["businessman", "doctor", "engineer", "lawyer", "manager", "accountant"],
  },
  {
    factId: "INK_WRITING_TOOL",
    category: "FUNCTION",
    question: "which item is normally used to write with ink?",
    ordinaryAnswer: "pen",
    rationale: "A pen is normally used to write with ink.",
    domain: ["pen", "paper", "book", "table", "chair", "bottle"],
  },
  {
    factId: "ONE_PERSON_SEAT",
    category: "FUNCTION",
    question: "which item is designed for one person to sit on?",
    ordinaryAnswer: "chair",
    rationale: "A chair is designed for one person to sit on.",
    domain: ["chair", "table", "lamp", "shelf", "cupboard", "bottle"],
  },
  {
    factId: "SEWING_NEEDLE",
    category: "FUNCTION",
    question: "which pointed tool passes thread through cloth?",
    ordinaryAnswer: "needle",
    rationale: "A needle passes thread through cloth while sewing.",
    domain: ["needle", "button", "cloth", "scissors", "hook", "thimble"],
  },
  {
    factId: "HEARING_WITH_EAR",
    category: "FUNCTION",
    question: "which body part is used for hearing?",
    ordinaryAnswer: "ear",
    rationale: "A person hears with the ear.",
    domain: ["eye", "ear", "nose", "hand", "mouth", "tongue"],
  },
  {
    factId: "GRIP_PEN_WITH_HAND",
    category: "FUNCTION",
    question: "which body part is normally used to grip a pen while writing?",
    ordinaryAnswer: "hand",
    rationale: "A person normally grips a pen with the hand while writing.",
    domain: ["eye", "ear", "nose", "hand", "mouth", "foot"],
  },
  {
    factId: "SOAP_CLEANS_CLOTHES",
    category: "FUNCTION",
    question: "which item is used with water to clean clothes?",
    ordinaryAnswer: "soap",
    rationale: "Soap is used with water to clean clothes.",
    domain: ["orange", "butter", "soap", "ink", "honey", "oil"],
  },
  {
    factId: "OVEN_BAKES_FOOD",
    category: "FUNCTION",
    question: "which appliance is used to bake food?",
    ordinaryAnswer: "oven",
    rationale: "An oven is used to bake food.",
    domain: ["sofa", "bed", "table", "television", "oven", "fan"],
  },
  {
    factId: "PORTABLE_EXTERNAL_STORAGE",
    category: "FUNCTION",
    question: "which device is commonly used as portable external storage?",
    ordinaryAnswer: "pen drive",
    rationale: "A pen drive is commonly used as portable external storage.",
    domain: ["mobile", "tablet", "laptop", "computer", "pen drive", "keyboard"],
  },
  {
    factId: "EARTH_NATURAL_SATELLITE",
    category: "CATEGORY",
    question: "which object is Earth's natural satellite?",
    ordinaryAnswer: "moon",
    rationale: "The Moon is Earth's natural satellite.",
    domain: ["jupiter", "saturn", "moon", "venus", "mercury", "sun"],
  },
  {
    factId: "MILK_COLOUR_WHITE",
    category: "ATTRIBUTE",
    question: "what is the usual colour of milk?",
    ordinaryAnswer: "white",
    rationale: "Milk is ordinarily white.",
    domain: ["red", "white", "blue", "green", "orange", "black"],
  },
  {
    factId: "HUMAN_BLOOD_RED",
    category: "ATTRIBUTE",
    question: "what is the colour of human blood?",
    ordinaryAnswer: "red",
    rationale: "Human blood is red.",
    domain: ["red", "white", "blue", "green", "yellow", "black"],
  },
  {
    factId: "FRESH_GRASS_GREEN",
    category: "ATTRIBUTE",
    question: "what is the common colour of fresh grass?",
    ordinaryAnswer: "green",
    rationale: "Fresh grass is commonly green.",
    domain: ["red", "white", "blue", "green", "orange", "pink"],
  },
  {
    factId: "SUGAR_IS_SWEET",
    category: "ATTRIBUTE",
    question: "which item is sweet?",
    ordinaryAnswer: "sugar",
    rationale: "Sugar is sweet.",
    domain: ["pepper", "salt", "chilli", "sugar", "oil", "turmeric"],
  },
  {
    factId: "COCONUT_HARD_SHELL",
    category: "ATTRIBUTE",
    question: "which fruit has a hard shell?",
    ordinaryAnswer: "coconut",
    rationale: "A coconut has a hard shell.",
    domain: ["apple", "mango", "banana", "grape", "coconut", "papaya"],
  },
] as const;

export function getCp008SemanticFact(factId: string): Cp008SemanticFact {
  const fact = CP008_SEMANTIC_FACTS.find((entry) => entry.factId === factId);
  if (!fact) throw new Error(`Unknown CP-008 semantic fact '${factId}'`);
  return fact;
}
