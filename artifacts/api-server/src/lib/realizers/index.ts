import type {
  FormulaQuestion,
  GeneratedQuestion,
} from "../core/generator-engine";
import { realizeEnglish } from "./english-realizer";
import { realizeHindi } from "./hindi-realizer";
import { realizePunjabi } from "./punjabi-realizer";
import { quantRealizer } from "./quant-realizer";
import {
  realizeExplanation,
} from "./explanation-realizer";
import {
  detectCoverageCategory,
  getNativeRealizationCoverage,
} from "./coverage";
import type {
  NativeRealizerInput,
  NativeRealizerResult,
  RealizerKey,
  RealizerLanguage,
} from "./types";

export const REALIZERS: Record<
  RealizerKey,
  (
    input: NativeRealizerInput,
  ) => NativeRealizerResult
> = {
  en: realizeEnglish,
  hi: realizeHindi,
  pa: realizePunjabi,
  quant: quantRealizer,
};

export const punjabiRealizer =
  realizePunjabi;
export { quantRealizer };

export type {
  NativeRealizerInput,
  NativeRealizerResult,
  RealizedLanguageBundle,
  RealizerKey,
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
export {
  realizeExplanation,
} from "./explanation-realizer";

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
  const selected = allowed.filter((language) =>
    requested.includes(language),
  );
  return selected.includes("en")
    ? selected
    : ["en", ...selected];
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

    if (language === "en") {
      next.explanation =
        result.bundle.explanation;
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
  const coverageCategory =
    detectCoverageCategory(input);
  const withTutorExplanation = (
    result: NativeRealizerResult,
  ): NativeRealizerResult => {
    if (!result.supported) {
      return result;
    }

    return {
      ...result,
      bundle: {
        ...result.bundle,
        explanation: realizeExplanation(
          input,
          language,
        ),
      },
    };
  };

  if (coverageCategory === "quant") {
    if (!REALIZERS.quant) {
      return {
        supported: false,
        language,
        reason:
          "No native realizer registered for Quant",
        coverageCategory: "quant",
        coveragePercent: 0,
      };
    }

    return withTutorExplanation(
      quantRealizer(input, language),
    );
  }

  return withTutorExplanation(
    REALIZERS[language](input),
  );
}
