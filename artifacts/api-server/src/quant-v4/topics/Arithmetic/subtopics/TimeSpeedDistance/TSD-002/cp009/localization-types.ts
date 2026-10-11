import type { TsdCp009Difficulty } from "./english-authoring-registry";

export type TsdCp009Locale = "hi-IN" | "pa-IN";

export interface TsdCp009LocalizedFamily {
  readonly familyId: string;
  readonly difficulty: TsdCp009Difficulty;
  readonly stem: string;
  readonly explanationGuide: string;
}

export interface TsdCp009LocalizedQl {
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly learnerContract: string;
  readonly objectPool: readonly string[];
  readonly families: readonly TsdCp009LocalizedFamily[];
  readonly sourceEnglishStatus: "FROZEN";
  readonly localizationStatus: "REVIEW_CANDIDATE";
}

export interface TsdCp009LocalizationRegistry {
  readonly locale: TsdCp009Locale;
  readonly qls: readonly TsdCp009LocalizedQl[];
}
