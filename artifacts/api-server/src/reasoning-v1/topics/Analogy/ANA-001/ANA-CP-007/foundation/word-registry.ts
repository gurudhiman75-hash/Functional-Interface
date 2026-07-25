import { deriveWordStructure, type DerivedWordStructure } from "./word-structure";

export interface AnaCp007PilotWordRecord {
  id: string;
  word: string;
  lexicalBand: "COMMON" | "STANDARD_EXAM";
  locale: "en-IN";
  sourceRefs: readonly string[];
  editorialStatus: "REVIEWED";
  enabled: boolean;
  structure: DerivedWordStructure;
}

interface PilotWordInput {
  id: string;
  word: string;
  lexicalBand?: "COMMON" | "STANDARD_EXAM";
}

const PILOT_WORD_INPUTS: readonly PilotWordInput[] = [
  { id: "ANA-WORD-001", word: "CITY" },
  { id: "ANA-WORD-002", word: "LION" },
  { id: "ANA-WORD-003", word: "KIND" },
  { id: "ANA-WORD-004", word: "TABLE" },
  { id: "ANA-WORD-005", word: "CHAIR" },
  { id: "ANA-WORD-006", word: "WATER" },
  { id: "ANA-WORD-007", word: "LIGHT" },
  { id: "ANA-WORD-008", word: "SOUND" },
  { id: "ANA-WORD-009", word: "HOUSE" },
  { id: "ANA-WORD-010", word: "TRAIN" },
  { id: "ANA-WORD-011", word: "CLOUD" },
  { id: "ANA-WORD-012", word: "STONE" },
  { id: "ANA-WORD-013", word: "GRAPE" },
  { id: "ANA-WORD-014", word: "BREAD" },
  { id: "ANA-WORD-015", word: "CREAM" },
  { id: "ANA-WORD-016", word: "MOUSE" },
  { id: "ANA-WORD-017", word: "TIGER" },
  { id: "ANA-WORD-018", word: "HORSE" },
  { id: "ANA-WORD-019", word: "SHEEP" },
  { id: "ANA-WORD-020", word: "APPLE" },
  { id: "ANA-WORD-021", word: "ALLEY" },
  { id: "ANA-WORD-022", word: "OFFER" },
  { id: "ANA-WORD-023", word: "LEVEL" },
  { id: "ANA-WORD-024", word: "RADAR" },
  { id: "ANA-WORD-025", word: "CIVIC" },
  { id: "ANA-WORD-026", word: "REFER" },
  { id: "ANA-WORD-027", word: "TENET" },
  { id: "ANA-WORD-028", word: "NOON" },
  { id: "ANA-WORD-029", word: "DEED" },
  { id: "ANA-WORD-030", word: "PEEP" },
  { id: "ANA-WORD-031", word: "TOOT" },
  { id: "ANA-WORD-032", word: "SEES" },
  { id: "ANA-WORD-033", word: "PLANET" },
  { id: "ANA-WORD-034", word: "GARDEN" },
  { id: "ANA-WORD-035", word: "MARKET" },
  { id: "ANA-WORD-036", word: "SCHOOL" },
  { id: "ANA-WORD-037", word: "BRIDGE" },
  { id: "ANA-WORD-038", word: "ORANGE" },
  { id: "ANA-WORD-039", word: "POETRY" },
  { id: "ANA-WORD-040", word: "WINDOW" },
  { id: "ANA-WORD-041", word: "SILVER" },
  { id: "ANA-WORD-042", word: "FLOWER" },
  { id: "ANA-WORD-043", word: "LETTER" },
  { id: "ANA-WORD-044", word: "BETTER" },
  { id: "ANA-WORD-045", word: "SETTER" },
  { id: "ANA-WORD-046", word: "KETTLE" },
  { id: "ANA-WORD-047", word: "BANANA" },
  { id: "ANA-WORD-048", word: "MAMMAL" },
  { id: "ANA-WORD-049", word: "COMMON" },
  { id: "ANA-WORD-050", word: "SUMMER" },
  { id: "ANA-WORD-051", word: "WINTER" },
  { id: "ANA-WORD-052", word: "SPRING" },
  { id: "ANA-WORD-053", word: "AUTUMN" },
  { id: "ANA-WORD-054", word: "JOURNEY" },
  { id: "ANA-WORD-055", word: "COUNTRY" },
  { id: "ANA-WORD-056", word: "VILLAGE" },
  { id: "ANA-WORD-057", word: "PICTURE" },
  { id: "ANA-WORD-058", word: "MACHINE" },
  { id: "ANA-WORD-059", word: "OUTSIDE" },
  { id: "ANA-WORD-060", word: "JOURNAL" },
  { id: "ANA-WORD-061", word: "SUCCESS" },
  { id: "ANA-WORD-062", word: "ADDRESS" },
  { id: "ANA-WORD-063", word: "COFFEE" },
  { id: "ANA-WORD-064", word: "BALLOON" },
  { id: "ANA-WORD-065", word: "MONSOON" },
  { id: "ANA-WORD-066", word: "EDUCATE", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-067", word: "JANUARY", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-068", word: "OCTOBER", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-069", word: "FORWARD" },
  { id: "ANA-WORD-070", word: "BACKWARD" },
  { id: "ANA-WORD-071", word: "CALCULATOR", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-072", word: "MAXIMIZING", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-073", word: "POSITION", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-074", word: "WELCOME" },
  { id: "ANA-WORD-075", word: "THANKS" },
  { id: "ANA-WORD-076", word: "COLLEGE" },
  { id: "ANA-WORD-077", word: "STUDENT" },
  { id: "ANA-WORD-078", word: "COMMITTEE", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-079", word: "BOOKKEEPER", lexicalBand: "STANDARD_EXAM" },
  { id: "ANA-WORD-080", word: "LANGUAGE", lexicalBand: "STANDARD_EXAM" },
] as const;

export const ANA_CP007_PILOT_WORDS: readonly AnaCp007PilotWordRecord[] = PILOT_WORD_INPUTS.map(
  ({ id, word, lexicalBand = "COMMON" }) => ({
    id,
    word,
    lexicalBand,
    locale: "en-IN" as const,
    sourceRefs: ["ana-cp-007-reviewed-pilot-v1"] as const,
    editorialStatus: "REVIEWED" as const,
    enabled: true,
    structure: deriveWordStructure(word),
  }),
);

export function enabledPilotWords(): readonly AnaCp007PilotWordRecord[] {
  return ANA_CP007_PILOT_WORDS.filter((entry) => entry.enabled);
}

export function pilotWordsByPattern(): ReadonlyMap<string, readonly AnaCp007PilotWordRecord[]> {
  const groups = new Map<string, AnaCp007PilotWordRecord[]>();
  for (const entry of enabledPilotWords()) {
    const group = groups.get(entry.structure.equalityPatternKey) ?? [];
    group.push(entry);
    groups.set(entry.structure.equalityPatternKey, group);
  }
  return groups;
}
