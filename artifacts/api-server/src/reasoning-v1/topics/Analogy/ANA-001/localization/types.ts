export type AnalogyLocale = "en-IN" | "hi-IN" | "pa-IN";
export type LocalizationMode = "TRANSLATED_FACT" | "LANGUAGE_ADAPTED" | "LANGUAGE_SPECIFIC";

export interface LocalizedAnalogyFact {
  id: string;
  canonicalFactId: string;
  relation: string;
  locale: Exclude<AnalogyLocale, "en-IN">;
  left: string;
  right: string;
  predicate: string;
  mode: LocalizationMode;
  version: string;
  status: "CURATED" | "REVIEW" | "RETIRED";
  reviewedByNativeSpeaker: boolean;
  editorialNote?: string;
}

export interface LocalizedRelationText {
  relation: string;
  locale: Exclude<AnalogyLocale, "en-IN">;
  label: string;
  ruleStatement: string;
  sourceLead: string;
  targetLead: string;
  conclusionTemplate: string;
  version: string;
}

export interface LocalizedQuestionText {
  locale: Exclude<AnalogyLocale, "en-IN">;
  missingTermStem: string;
  equivalentPairStem: string;
  correctAnswerLead: string;
}
