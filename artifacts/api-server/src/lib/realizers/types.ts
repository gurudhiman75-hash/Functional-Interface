import type {
  FormulaQuestion,
} from "../core/generator-engine";

export type RealizerLanguage =
  | "en"
  | "hi"
  | "pa";

export type RealizerKey =
  | RealizerLanguage
  | "quant";

export type RealizedLanguageBundle = {
  question: string;
  options: string[];
  explanation: string;
};

export type RealizationCoverageCategory =
  | "seating"
  | "bloodRelation"
  | "directionSense"
  | "pattern"
  | "temporal"
  | "boolean"
  | "critical"
  | "quant"
  | "knowledge"
  | "english"
  | "unknown";

export type NativeRealizationCoverage = {
  language: RealizerLanguage;
  coverage: Record<
    RealizationCoverageCategory,
    number
  >;
};

export type NativeRealizationValidation = {
  passed: boolean;
  diagnostics: string[];
  unsupportedPrimitives?: string[];
  missingTemplates?: string[];
};

export type RealizationPrimitive =
  | "immediate-left"
  | "immediate-right"
  | "relative-left"
  | "relative-right"
  | "opposite"
  | "not-opposite"
  | "adjacent"
  | "not-adjacent"
  | "between"
  | "same-row"
  | "different-row"
  | "north-facing"
  | "south-facing"
  | "clockwise"
  | "anti-clockwise"
  | "not-end"
  | "absolute-position"
  | "end-position"
  | "slot-fixed"
  | "slot-gap"
  | "slot-parity"
  | "slot-immediate"
  | "slot-not"
  | "attribute-match";

export type NativeRealizerInput = {
  question: FormulaQuestion;
  logic: unknown;
  patternId?: string;
};

export type NativeRealizerResult =
  | {
      supported: true;
      language: RealizerLanguage;
      bundle: RealizedLanguageBundle;
      source:
        | "native-realizer"
        | "canonical";
      coverageCategory: RealizationCoverageCategory;
      coveragePercent: number;
      validation: NativeRealizationValidation;
    }
  | {
      supported: false;
      language: RealizerLanguage;
      reason: string;
      coverageCategory?: RealizationCoverageCategory;
      coveragePercent?: number;
      validation?: NativeRealizationValidation;
    };
