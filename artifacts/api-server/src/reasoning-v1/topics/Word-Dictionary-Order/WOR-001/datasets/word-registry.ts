import type { WorDifficulty, WorWordFamily, WorWordRecord } from "../foundation/types";

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

export const WOR_WORD_FAMILIES: readonly WorWordFamily[] = [
  family("MIXED-COMMON-A", "EASY", ["Apple", "Bridge", "Candle", "Doctor", "Garden", "Market", "Silver", "Window", "Yellow"]),
  family("MIXED-COMMON-B", "EASY", ["Book", "Branch", "Cloud", "Crane", "House", "Horse", "Table", "Train", "Water"]),
  family("GRA-FAMILY", "MEDIUM", ["Grain", "Grand", "Grant", "Graphic", "Grape", "Grasp", "Grass", "Grate", "Gravity"]),
  family("BL-FAMILY", "MEDIUM", ["Blend", "Blind", "Blink", "Bliss", "Block", "Bloom", "Blouse", "Blue", "Blunt"]),
  family("ACT-FAMILY", "MEDIUM", ["Act", "Action", "Active", "Actor", "Actual", "Acute", "Adapt", "Add", "Adjust"]),
  family("TRA-FAMILY", "MEDIUM", ["Trace", "Track", "Trade", "Train", "Trainer", "Trait", "Transfer", "Travel", "Tray"]),
  family("CAR-FAMILY", "HARD", ["Car", "Card", "Care", "Careful", "Cargo", "Carnival", "Carp", "Cart", "Carbon"]),
  family("STAR-FAMILY", "HARD", ["Star", "Stare", "Stark", "Start", "State", "Station", "Static", "Statue", "Stay"]),
  family("PRO-FAMILY", "HARD", ["Produce", "Product", "Production", "Productive", "Productivity", "Professor", "Program", "Progress", "Project"]),
  family("EXA-FAMILY", "HARD", ["Exact", "Exalt", "Exam", "Example", "Examine", "Examiner", "Examination", "Exceed", "Except"]),
  family("CON-FAMILY", "HARD", ["Conceal", "Concede", "Concept", "Concern", "Concert", "Conclude", "Concrete", "Condition", "Conduct"], "STANDARD"),
  family("DIS-FAMILY", "HARD", ["Discard", "Discover", "Discovery", "Discreet", "Display", "Distance", "Distinct", "District", "Divide"], "STANDARD"),
];

const allWords = WOR_WORD_FAMILIES.flatMap((entry) => entry.words);
if (allWords.some((entry) => !/^[A-Z]+$/.test(entry.normalized))) throw new Error("WOR word registry contains a non A-Z token.");

export function worFamiliesForDifficulty(difficulty: WorDifficulty): readonly WorWordFamily[] {
  return WOR_WORD_FAMILIES.filter((entry) => entry.tier === difficulty);
}

export function worFamilyById(id: string): WorWordFamily {
  const found = WOR_WORD_FAMILIES.find((entry) => entry.id === id);
  if (!found) throw new Error(`Unknown WOR word family: ${id}`);
  return found;
}
