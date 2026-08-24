import type { NumCp010PermanentPackage } from "../permanent-runtime.ts";

export type NumCp010LocalizedLanguage = "hi" | "pa";
export type NumCp010LocalizedLocale = "hi-IN" | "pa-IN";

export interface NumCp010LocalizedPackage extends Omit<NumCp010PermanentPackage, "locale" | "stem" | "explanation" | "lifecycle"> {
  readonly locale: NumCp010LocalizedLocale;
  readonly language: NumCp010LocalizedLanguage;
  readonly stem: string;
  readonly explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  readonly lifecycle: NumCp010PermanentPackage["lifecycle"] & Readonly<{
    reviewStatus: "HI_PA_REVIEW_CANDIDATE";
  }>;
}
