import type { TsdCp008Difficulty } from "./english-authoring-registry";

export type TsdCp008Locale = "hi-IN" | "pa-IN";

export interface TsdCp008LocalizedFamily {
  readonly familyId: string;
  readonly difficulty: TsdCp008Difficulty;
  readonly stem: string;
  readonly explanationGuide: string;
}

export interface TsdCp008LocalizedQl {
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly learnerContract: string;
  readonly objectPool: readonly string[];
  readonly families: readonly TsdCp008LocalizedFamily[];
  readonly sourceEnglishStatus: "FROZEN";
  readonly localizationStatus: "REVIEW_CANDIDATE";
}

export interface TsdCp008LocalizationRegistry {
  readonly locale: TsdCp008Locale;
  readonly qls: readonly TsdCp008LocalizedQl[];
}
