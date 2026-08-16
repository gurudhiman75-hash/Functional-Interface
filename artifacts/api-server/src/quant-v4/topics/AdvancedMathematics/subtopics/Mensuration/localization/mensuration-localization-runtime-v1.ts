import {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  generateMensurationStudioBatchV2,
  generateMensurationStudioQuestionV2,
  type MensurationQuestionStudioCpId,
  type MensurationQuestionStudioDifficulty,
  type MensurationQuestionStudioExamProfile,
  type MensurationQuestionStudioQuestionV2,
} from "../mensuration-question-studio-selection-v2";
import {
  MENSURATION_LOCALIZATION_AUTHORITY,
  MENSURATION_LOCALIZED_LANGUAGES,
  instructionalLatinLeaks,
  localeForLanguage,
  localizeMensurationOption,
  localizeMensurationProse,
  stripLearnerMisconceptionTag,
  type MensurationLocalizedLanguage,
  type MensurationStudioLanguage,
} from "./mensuration-localization-foundation-v3";
import { prelocalizeMensurationEditorialSource } from "./mensuration-localization-source-editorial-v1";
import { prelocalizeMensurationStructuredInstructionSource } from "./mensuration-localization-structured-instructions-v1";
import {
  polishMensurationLocalizedOption,
  polishMensurationLocalizedText,
  protectMensurationFormulaIdentifiers,
  repairMensurationLearnerMathSurface,
} from "./mensuration-localization-editorial-v1";

export type MensurationLocalizedQuestionV1 = Omit<
  MensurationQuestionStudioQuestionV2,
  "language" | "locale" | "stem" | "options" | "optionDetails" | "answer" | "explanation"
> & {
  language: MensurationStudioLanguage;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  stem: string;
  options: string[];
  optionDetails: Array<{
    label: "A" | "B" | "C" | "D";
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }>;
  correctIndex: number;
  answer: string;
  explanation: { steps: string[]; shortcut: string; traps: string[] };
  localization?: {
    authority: typeof MENSURATION_LOCALIZATION_AUTHORITY;
    canonicalLanguage: "en";
    canonicalLocale: "en-IN";
    canonicalQuestionId: string;
    canonicalItemId: string;
    language: MensurationLocalizedLanguage;
    locale: "hi-IN" | "pa-IN";
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    realismMetadataPreserved: true;
    lifecycleLocked: true;
    residualInstructionalLatin: string[];
  };
};

export const MENSURATION_LOCALIZED_PACKAGE_V1 = {
  ...MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
  label: "Mensuration · Full Chapter · English/Hindi/Punjabi",
  supportedLanguages: MENSURATION_LOCALIZED_LANGUAGES,
  localizationAuthority: MENSURATION_LOCALIZATION_AUTHORITY,
  localizationStatus: "HINDI_PUNJABI_CONTROLLED_REVIEW" as const,
} as const;

function translate(text: string, language: MensurationLocalizedLanguage) {
  const editorialSource = prelocalizeMensurationEditorialSource(text, language);
  const structuredSource = prelocalizeMensurationStructuredInstructionSource(editorialSource, language);
  const protectedFormula = protectMensurationFormulaIdentifiers(structuredSource);
  const localized = localizeMensurationProse(protectedFormula.text, language);
  return polishMensurationLocalizedText(protectedFormula.restore(localized), language);
}

function normalizeCanonicalQuestion(
  canonical: MensurationQuestionStudioQuestionV2,
): MensurationLocalizedQuestionV1 {
  const options = canonical.options.map(repairMensurationLearnerMathSurface);
  const optionDetails = canonical.optionDetails.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  return {
    ...canonical,
    language: "en",
    locale: "en-IN",
    stem: repairMensurationLearnerMathSurface(canonical.stem),
    options,
    optionDetails,
    answer: options[canonical.correctIndex]!,
    explanation: {
      steps: canonical.explanation.steps.map(repairMensurationLearnerMathSurface),
      shortcut: repairMensurationLearnerMathSurface(canonical.explanation.shortcut),
      traps: canonical.explanation.traps.map(repairMensurationLearnerMathSurface),
    },
  };
}

function localizeQuestion(
  canonical: MensurationQuestionStudioQuestionV2,
  language: MensurationLocalizedLanguage,
): MensurationLocalizedQuestionV1 {
  const source = normalizeCanonicalQuestion(canonical);
  const options = source.options.map((option) =>
    repairMensurationLearnerMathSurface(
      polishMensurationLocalizedOption(localizeMensurationOption(option, language), language),
    ),
  );
  const optionDetails = source.optionDetails.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const stem = translate(source.stem, language);
  const explanation = {
    steps: source.explanation.steps.map((step) => translate(step, language)),
    shortcut: translate(source.explanation.shortcut, language),
    traps: source.explanation.traps.map((trap) =>
      translate(stripLearnerMisconceptionTag(trap), language),
    ),
  };
  const answer = options[source.correctIndex]!;
  const learnerText = [stem, ...options, ...explanation.steps, explanation.shortcut, ...explanation.traps].join("\n");
  return {
    ...source,
    language,
    locale: localeForLanguage(language),
    stem,
    options,
    optionDetails,
    correctIndex: source.correctIndex,
    answer,
    explanation,
    localization: {
      authority: MENSURATION_LOCALIZATION_AUTHORITY,
      canonicalLanguage: "en",
      canonicalLocale: "en-IN",
      canonicalQuestionId: source.questionId,
      canonicalItemId: source.canonicalItemId,
      language,
      locale: localeForLanguage(language) as "hi-IN" | "pa-IN",
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionMappingPreserved: true,
      realismMetadataPreserved: true,
      lifecycleLocked: true,
      residualInstructionalLatin: instructionalLatinLeaks(learnerText),
    },
  };
}

export function generateMensurationLocalizedQuestionV1(input: {
  patternId: string;
  seed: string;
  examProfile?: MensurationQuestionStudioExamProfile;
  language?: MensurationStudioLanguage;
}): MensurationLocalizedQuestionV1 {
  const canonical = generateMensurationStudioQuestionV2({
    patternId: input.patternId,
    seed: input.seed,
    examProfile: input.examProfile,
  });
  const language = input.language ?? "en";
  if (language === "en") return normalizeCanonicalQuestion(canonical);
  return localizeQuestion(canonical, language);
}

export function generateMensurationLocalizedBatchV1(input: {
  cpId?: MensurationQuestionStudioCpId;
  patternId?: string;
  difficulty?: MensurationQuestionStudioDifficulty;
  examProfile?: MensurationQuestionStudioExamProfile;
  seed?: string;
  count?: number;
  language?: MensurationStudioLanguage;
}) {
  const language = input.language ?? "en";
  const canonical = generateMensurationStudioBatchV2({
    cpId: input.cpId,
    patternId: input.patternId,
    difficulty: input.difficulty,
    examProfile: input.examProfile,
    seed: input.seed,
    count: input.count,
  });
  const questions = language === "en"
    ? canonical.questions.map(normalizeCanonicalQuestion)
    : canonical.questions.map((question) => localizeQuestion(question, language));
  return {
    ...canonical,
    package: MENSURATION_LOCALIZED_PACKAGE_V1,
    questions,
    filters: {
      ...canonical.filters,
      language,
    },
    localizationAuthority: language === "en" ? null : MENSURATION_LOCALIZATION_AUTHORITY,
  };
}

export {
  MENSURATION_LOCALIZATION_AUTHORITY,
  MENSURATION_LOCALIZED_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
};
export type {
  MensurationQuestionStudioCpId,
  MensurationQuestionStudioDifficulty,
  MensurationQuestionStudioExamProfile,
  MensurationStudioLanguage,
};
