export interface LexicalFact {
  id: string;
  left: string;
  right: string;
  relation: string;
  predicate: string;
  sourceCategory: string;
  answerCategory: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  locale: "en-IN";
  examSuitability: readonly ("SSC" | "BANKING" | "PUNJAB")[];
  version: string;
  status: "CURATED";
  verifiedAt: string;
  sourceType: "STANDARD_DICTIONARY" | "STANDARD_GENERAL_KNOWLEDGE";
}

export type LexicalPair = readonly [string, string];
