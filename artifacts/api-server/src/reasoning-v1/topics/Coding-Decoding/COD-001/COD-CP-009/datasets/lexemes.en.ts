export type EnglishLexemePartOfSpeech =
  | "NOUN"
  | "VERB"
  | "ADVERB"
  | "ADJECTIVE"
  | "CONJUNCTION";

export interface EnglishSentenceCodeLexeme {
  id: string;
  display: string;
  partOfSpeech: EnglishLexemePartOfSpeech;
  semanticTags: readonly string[];
  status: "REVIEWED";
}

function lexeme(
  id: string,
  partOfSpeech: EnglishLexemePartOfSpeech,
  semanticTags: readonly string[],
): EnglishSentenceCodeLexeme {
  return { id, display: id, partOfSpeech, semanticTags, status: "REVIEWED" };
}

const noun = (id: string, ...tags: string[]) => lexeme(id, "NOUN", tags);
const verb = (id: string, ...tags: string[]) => lexeme(id, "VERB", tags);
const adverb = (id: string, ...tags: string[]) => lexeme(id, "ADVERB", tags);
const adjective = (id: string, ...tags: string[]) => lexeme(id, "ADJECTIVE", tags);

export const ENGLISH_SENTENCE_CODE_LEXEMES: readonly EnglishSentenceCodeLexeme[] = [
  noun("birds", "plural", "living", "actor"),
  verb("fly", "intransitive", "action"),
  verb("sing", "intransitive", "action"),
  noun("flowers", "plural", "living", "subject"),
  verb("bloom", "intransitive", "action"),
  verb("fade", "intransitive", "action"),
  noun("children", "plural", "people", "actor"),
  verb("learn", "intransitive", "action"),
  verb("play", "intransitive", "action"),
  noun("stars", "plural", "object", "subject"),
  verb("shine", "intransitive", "action"),
  verb("twinkle", "intransitive", "action"),
  noun("rivers", "plural", "place", "subject"),
  verb("flow", "intransitive", "action"),
  verb("merge", "intransitive", "action"),
  adverb("quickly", "manner"),
  adverb("daily", "frequency"),
  noun("adults", "plural", "people", "actor"),
  adverb("sweetly", "manner"),
  noun("plants", "plural", "living", "subject"),
  verb("grow", "intransitive", "action"),
  adverb("well", "manner"),
  noun("workers", "plural", "people", "actor"),
  verb("act", "intransitive", "action"),
  adverb("carefully", "manner"),
  noun("leaders", "plural", "people", "actor"),
  noun("students", "plural", "people", "actor"),
  verb("read", "transitive_or_intransitive", "action"),
  adverb("quietly", "manner"),
  noun("teachers", "plural", "people", "actor"),
  verb("solve", "transitive", "action"),
  noun("problems", "plural", "object"),
  adjective("difficult", "quality", "object_modifier"),
  verb("build", "transitive", "action"),
  noun("nests", "plural", "object"),
  adjective("strong", "quality", "object_modifier"),
  noun("sparrows", "plural", "living", "actor"),
  verb("complete", "transitive", "action"),
  noun("tasks", "plural", "object"),
  adjective("urgent", "quality", "object_modifier"),
  adverb("early", "time"),
  adverb("safely", "manner"),
  noun("teams", "plural", "people", "actor"),
  noun("books", "plural", "object"),
  adjective("useful", "quality", "object_modifier"),
  noun("drivers", "plural", "people", "actor"),
  verb("follow", "transitive", "action"),
  noun("rules", "plural", "object"),
  adjective("important", "quality", "object_modifier"),
  adverb("strictly", "manner"),
  noun("citizens", "plural", "people", "actor"),
  lexeme("and", "CONJUNCTION", ["coordinator"]),
  noun("apple", "singular", "food", "list_item"),
  noun("mango", "singular", "food", "list_item"),
  noun("orange", "singular", "food", "list_item"),
  noun("banana", "singular", "food", "list_item"),
  noun("tea", "mass", "drink", "list_item"),
  noun("coffee", "mass", "drink", "list_item"),
  noun("milk", "mass", "drink", "list_item"),
  noun("juice", "mass", "drink", "list_item"),
  adjective("red", "colour", "list_item"),
  adjective("blue", "colour", "list_item"),
  adjective("green", "colour", "list_item"),
  adjective("yellow", "colour", "list_item"),
  noun("cricket", "sport", "list_item"),
  noun("hockey", "sport", "list_item"),
  noun("tennis", "sport", "list_item"),
  noun("football", "sport", "list_item"),
  noun("buses", "plural", "transport", "list_item"),
  noun("trains", "plural", "transport", "list_item"),
  noun("cars", "plural", "transport", "list_item"),
  noun("bicycles", "plural", "transport", "list_item"),
  noun("pens", "plural", "stationery", "list_item"),
  noun("pencils", "plural", "stationery", "list_item"),
  noun("apples", "plural", "food", "list_item"),
  noun("mangoes", "plural", "food", "list_item"),
  noun("oranges", "plural", "food", "list_item"),
  adverb("outside", "place"),
  adverb("together", "manner"),
  verb("study", "intransitive", "action"),
  adverb("high", "manner"),
  verb("practise", "intransitive", "action"),
  verb("work", "intransitive", "action"),
  noun("dogs", "plural", "living", "actor"),
  verb("run", "intransitive", "action"),
  adverb("fast", "manner"),
  noun("players", "plural", "people", "actor"),
  verb("train", "intransitive", "action"),
  adverb("hard", "manner"),
  noun("friends", "plural", "people", "actor"),
  verb("meet", "intransitive", "action"),
  noun("artists", "plural", "people", "actor"),
  noun("planes", "plural", "transport", "actor"),
  noun("athletes", "plural", "people", "actor"),
] as const;

const LEXEME_BY_ID = new Map(ENGLISH_SENTENCE_CODE_LEXEMES.map((entry) => [entry.id, entry]));

export function getEnglishSentenceCodeLexeme(id: string): EnglishSentenceCodeLexeme {
  const found = LEXEME_BY_ID.get(id);
  if (!found) throw new Error(`Unknown English sentence-code lexeme '${id}'`);
  return found;
}
