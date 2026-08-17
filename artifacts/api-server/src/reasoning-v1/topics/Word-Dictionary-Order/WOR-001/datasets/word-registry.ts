import type { WorDifficulty, WorWordFamily, WorWordRecord } from "../foundation/types";
import { WOR_WORD_FAMILY_EXPANSION } from "./expanded-word-registry";

function record(word: string, familiarity: WorWordRecord["familiarity"] = "COMMON"): WorWordRecord {
  const normalized = word.toUpperCase();
  const prefixKeys = Array.from({ length: Math.min(5, normalized.length) }, (_, index) => normalized.slice(0, index + 1));
  return {
    id: `WOR-WORD-${normalized}`,
    word,
    normalized,
    familiarity,
    morphologyTags: normalized.endsWith("TION") ? ["NOUN_SUFFIX"] : normalized.endsWith("IVE") ? ["ADJECTIVE_SUFFIX"] : [],
    prefixKeys,
    containsRepeatedLetters: /([A-Z]).*\1/.test(normalized),
    editorialStatus: "PROVISIONAL_REVIEW",
  };
}

function family(id: string, tier: WorDifficulty, words: readonly string[], familiarity: WorWordRecord["familiarity"] = "COMMON"): WorWordFamily {
  return { id, tier, words: words.map((word) => record(word, familiarity)) };
}

const WOR_BASE_WORD_FAMILIES: readonly WorWordFamily[] = [
  family("MIXED-COMMON-A", "EASY", ["Apple", "Bridge", "Candle", "Doctor", "Forest", "Garden", "Lemon", "Meadow", "River", "Silver", "Window", "Yellow"]),
  family("MIXED-COMMON-B", "EASY", ["Book", "Branch", "Cloud", "Crane", "Dance", "House", "Horse", "Pencil", "Table", "Truck", "Water", "Zebra"]),
  family("MIXED-COMMON-C", "EASY", ["Anchor", "Basket", "Circle", "Eagle", "Flower", "Kitchen", "Orange", "Planet", "Rabbit", "School", "Tiger", "Village"]),
  family("MIXED-COMMON-D", "EASY", ["Arrow", "Bottle", "Camera", "Desert", "Engine", "Finger", "Hammer", "Island", "Jacket", "Needle", "Queen", "Stone"]),
  family("MIXED-COMMON-E", "EASY", ["Autumn", "Beach", "Chair", "Drum", "Earth", "Fruit", "Globe", "Hotel", "Knife", "Music", "Paper", "Rose"]),
  family("MIXED-COMMON-F", "EASY", ["Animal", "Bread", "Clock", "Dream", "Field", "Glass", "Hill", "Lake", "Moon", "Road", "Ship", "Tree"]),
  family("MIXED-COMMON-G", "EASY", ["Army", "Box", "Child", "Door", "Farm", "Green", "Light", "Night", "Park", "Sun", "Voice", "World"]),
  family("MIXED-COMMON-H", "EASY", ["Air", "Bell", "Coat", "Desk", "Fire", "Gold", "Iron", "King", "Milk", "Ring", "Town", "Wood"]),
  family("GRA-FAMILY", "MEDIUM", ["Grace", "Grain", "Grand", "Grant", "Graphic", "Grape", "Grasp", "Grass", "Grate", "Gravel", "Gravity", "Gray"]),
  family("BL-FAMILY", "MEDIUM", ["Blank", "Blaze", "Bleed", "Blend", "Blind", "Blink", "Bliss", "Block", "Bloom", "Blouse", "Blue", "Blunt"]),
  family("ACT-FAMILY", "MEDIUM", ["Act", "Action", "Activate", "Active", "Activity", "Actor", "Actress", "Actual", "Acute", "Adapt", "Add", "Adjust"]),
  family("TRA-FAMILY", "MEDIUM", ["Trace", "Track", "Trade", "Trail", "Train", "Trainer", "Trait", "Tram", "Trance", "Trap", "Trash", "Travel"]),
  family("PRE-FAMILY", "MEDIUM", ["Preach", "Precise", "Predict", "Prefer", "Prefix", "Prepare", "Present", "Press", "Pretty", "Prevent", "Preview", "Price"]),
  family("COM-FAMILY", "MEDIUM", ["Combat", "Combine", "Come", "Comfort", "Command", "Comment", "Common", "Compact", "Commodity", "Commerce", "Commit", "Community"]),
  family("REA-FAMILY", "MEDIUM", ["Reach", "React", "Read", "Reader", "Ready", "Real", "Realm", "Rear", "Reason", "Rebuild", "Recall", "Record"]),
  family("PLA-FAMILY", "MEDIUM", ["Place", "Plain", "Plan", "Plane", "Plant", "Plate", "Play", "Player", "Plaza", "Plead", "Please", "Plenty"]),
  family("INT-FAMILY", "MEDIUM", ["Intact", "Intake", "Integer", "Intend", "Intent", "Into", "Invent", "Invite", "Involve", "Injury", "Input", "Inside"]),
  family("MAR-FAMILY", "MEDIUM", ["March", "Margin", "Marine", "Mark", "Market", "Marriage", "Mask", "Master", "Match", "Material", "Mature", "Maximum"]),
  family("CAR-FAMILY", "HARD", ["Car", "Carbon", "Card", "Care", "Careful", "Cargo", "Carnival", "Carp", "Carrier", "Carry", "Cart", "Carton"]),
  family("STAR-FAMILY", "HARD", ["Star", "Stare", "Stark", "Start", "State", "Station", "Static", "Statue", "Stay", "Steady", "Steam", "Steel"]),
  family("PRO-FAMILY", "HARD", ["Produce", "Product", "Production", "Productive", "Productivity", "Professor", "Program", "Progress", "Project", "Promise", "Promote", "Proper"]),
  family("EXA-FAMILY", "HARD", ["Exact", "Exalt", "Exam", "Examination", "Examine", "Examiner", "Example", "Exceed", "Except", "Exchange", "Excite", "Exclude"]),
  family("CON-FAMILY", "HARD", ["Conceal", "Concede", "Concept", "Concern", "Concert", "Conclude", "Concrete", "Condition", "Conduct", "Confirm", "Conflict", "Connect"], "STANDARD"),
  family("DIS-FAMILY", "HARD", ["Discard", "Discover", "Discovery", "Discreet", "Display", "Distance", "Distinct", "District", "Divide", "Divert", "Divine", "Division"], "STANDARD"),
  family("OVER-FAMILY", "HARD", ["Over", "Overall", "Overcome", "Overflow", "Overhead", "Overlap", "Overload", "Overnight", "Override", "Overseas", "Overtake", "Overtime"]),
  family("UNDER-FAMILY", "HARD", ["Under", "Undergo", "Underground", "Underline", "Underlying", "Understand", "Understood", "Undertake", "Undertone", "Underwear", "Underwrite", "Underwriter"]),
  family("INTER-FAMILY", "HARD", ["Interact", "Interest", "Interface", "Interior", "Interim", "Internal", "International", "Internet", "Interpose", "Interpret", "Interrupt", "Interval"], "STANDARD"),
  family("COMP-FAMILY", "HARD", ["Companion", "Company", "Compare", "Comparison", "Compass", "Compete", "Compile", "Complain", "Complete", "Complex", "Component", "Compose"], "STANDARD"),
  family("TRANS-FAMILY", "HARD", ["Transaction", "Transfer", "Transform", "Transit", "Transition", "Translate", "Translation", "Transmit", "Transport", "Transplant", "Transparent", "Transpose"], "STANDARD"),
  family("INST-FAMILY", "HARD", ["Install", "Instance", "Instant", "Instead", "Instinct", "Institute", "Institution", "Instruct", "Instruction", "Instrument", "Insurance", "Insure"], "STANDARD"),
];

export const WOR_WORD_FAMILIES: readonly WorWordFamily[] = [...WOR_BASE_WORD_FAMILIES, ...WOR_WORD_FAMILY_EXPANSION];

const allWords = WOR_WORD_FAMILIES.flatMap((entry) => entry.words);
if (WOR_WORD_FAMILIES.length !== 60 || allWords.length !== 720) throw new Error("WOR expanded real-word corpus must be 60 families / 720 words.");
if (allWords.some((entry) => !/^[A-Z]+$/.test(entry.normalized))) throw new Error("WOR word registry contains a non A-Z token.");
if (new Set(allWords.map((entry) => entry.normalized)).size !== allWords.length) throw new Error("WOR word registry contains a cross-family duplicate token.");
if (new Set(allWords.map((entry) => entry.id)).size !== allWords.length) throw new Error("WOR word registry contains a duplicate word ID.");

export function worFamiliesForDifficulty(difficulty: WorDifficulty): readonly WorWordFamily[] {
  return WOR_WORD_FAMILIES.filter((entry) => entry.tier === difficulty);
}

export function worFamilyById(id: string): WorWordFamily {
  const found = WOR_WORD_FAMILIES.find((entry) => entry.id === id);
  if (!found) throw new Error(`Unknown WOR word family: ${id}`);
  return found;
}
