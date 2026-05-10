import type {
  FormulaQuestion,
  GeneratedQuestion,
} from "../core/generator-engine";
import { realizeEnglish } from "./english-realizer";
import { realizeHindi } from "./hindi-realizer";
import { realizePunjabi } from "./punjabi-realizer";
import {
  getNativeRealizationCoverage,
} from "./coverage";
import type {
  NativeRealizerInput,
  NativeRealizerResult,
  RealizerLanguage,
} from "./types";

export const REALIZERS: Record<
  RealizerLanguage,
  (
    input: NativeRealizerInput,
  ) => NativeRealizerResult
> = {
  en: realizeEnglish,
  hi: realizeHindi,
  pa: realizePunjabi,
};

export const punjabiRealizer =
  realizePunjabi;

export type {
  NativeRealizerInput,
  NativeRealizerResult,
  RealizedLanguageBundle,
  RealizerLanguage,
} from "./types";
export {
  detectCoverageCategory,
  getCoveragePercent,
  getNativeRealizationCoverage,
  validateNativeBundle,
} from "./coverage";
export {
  REALIZATION_PRIMITIVE_SUPPORT,
  diagnosePrimitiveSupport,
} from "./primitive-registry";
export {
  PEOPLE,
  getPersonEntity,
  getPersonGender,
  localizeOptionText,
  localizePersonName,
} from "./entity-registry";
export {
  parseSeatingExpression,
  semanticFromStudioRelation,
} from "./semantic-primitives";

function isFormulaQuestion(
  question: GeneratedQuestion,
): question is FormulaQuestion {
  return !(
    "questionType" in question &&
    question.questionType === "di"
  );
}

export function extractQuestionLogic(
  question: FormulaQuestion,
) {
  return (
    (question as any)
      .proceduralLogic ??
    question.debugMetadata
      ?.proceduralScenario ??
    (question as any)
      .proceduralScenario ??
    (question as any).logic ??
    question.debugMetadata ??
    null
  );
}

function uniqueLanguages(
  languages: unknown,
): RealizerLanguage[] {
  const requested = Array.isArray(languages)
    ? languages
    : ["en"];
  const allowed: RealizerLanguage[] = [
    "en",
    "hi",
    "pa",
  ];
  return allowed.filter((language) =>
    requested.includes(language),
  );
}

export function applyNativeRealizations(
  question: GeneratedQuestion,
  config: {
    languages: unknown;
    patternId?: string;
  },
): GeneratedQuestion {
  if (!isFormulaQuestion(question)) {
    return question;
  }

  const languages = uniqueLanguages(
    config.languages,
  );
  const logic = extractQuestionLogic(question);
  const input: NativeRealizerInput = {
    question,
    logic,
    patternId: config.patternId,
  };
  const next: FormulaQuestion & {
    nativeRealization?: Record<
      string,
      unknown
    >;
    nativeCoverage?: unknown;
  } = {
    ...question,
  };
  const realizationStatus: Record<
    string,
    unknown
  > = {};

  for (const language of languages) {
    const result =
      generateReasoningQuestion(
        input,
        language,
      );

    realizationStatus[language] = result;

    if (!result.supported) {
      continue;
    }

    if (language === "hi") {
      next.textHi =
        result.bundle.question;
      next.optionsHi =
        result.bundle.options;
      next.explanationHi =
        result.bundle.explanation;
    }

    if (language === "pa") {
      next.textPa =
        result.bundle.question;
      next.optionsPa =
        result.bundle.options;
      next.explanationPa =
        result.bundle.explanation;
    }
  }

  next.nativeRealization =
    realizationStatus;
  next.nativeCoverage =
    languages.map((language) =>
      getNativeRealizationCoverage(
        language,
      ),
    );

  return next;
}

export function generateReasoningQuestion(
  input: NativeRealizerInput,
  language: RealizerLanguage,
): NativeRealizerResult {
  return REALIZERS[language](input);
}
