import type { Rational } from "./types";

export type TmwLocalizedLanguage = "hi" | "pa";
export type TmwDisplayLocale = "hi-IN" | "pa-IN";
export type TmwLocalizationEditorialStatus = "PENDING" | "APPROVED";
export type TmwLocalizedValue = Rational | string;

export interface TmwLocalizedOption {
  text: string;
  value: TmwLocalizedValue;
  misconceptionId: string;
}

export interface TmwLocalizedExplanation {
  opening: string;
  formula: string;
  steps: string[];
  shortcut: {
    title: string;
    steps: string[];
  };
  commonTrap: {
    optionLabel: string;
    optionText: string;
    misconceptionId: string;
    explanation: string;
  };
  conclusion: string;
}

export interface TmwLocalizedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: string;
  questionLanguageId: string;
  solveMode: string;
  language: TmwLocalizedLanguage;
  locale: TmwDisplayLocale;
  sourceLanguage: "en";
  seed: string;
  stem: string;
  parameters: unknown;
  solution: {
    answer: TmwLocalizedValue;
    answerType: string;
    formulaLatex: string;
    workedLatex: string[];
    answerText: string;
  };
  options: string[];
  optionAudit: TmwLocalizedOption[];
  correctIndex: number;
  explanation: TmwLocalizedExplanation;
  mathematicalFingerprint: string;
  validation: {
    valid: boolean;
    errors: string[];
  };
  editorialStatus: TmwLocalizationEditorialStatus;
  publiclyPublishable: false;
}

export function displayLocale(language: TmwLocalizedLanguage): TmwDisplayLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}
