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

function localizeQuestion(
  canonical: MensurationQuestionStudioQuestionV2,
  language: MensurationLocalizedLanguage,
): MensurationLocalizedQuestionV1 {
  const options = canonical.options.map((option) => localizeMensurationOption(option, language));
  const optionDetails = canonical.optionDetails.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const stem = localizeMensurationProse(canonical.stem, language);
  const explanation = {
    steps: canonical.explanation.steps.map((step) => localizeMensurationProse(step, language)),
    shortcut: localizeMensurationProse(canonical.explanation.shortcut, language),
    traps: canonical.explanation.traps.map((trap) =>
      localizeMensurationProse(stripLearnerMisconceptionTag(trap), language),
    ),
  };
  const answer = options[canonical.correctIndex]!;
  const learnerText = [stem, ...explanation.steps, explanation.shortcut, ...explanation.traps].join("\n");
  return {
    ...canonical,
    language,
    locale: localeForLanguage(language),
    stem,
    options,
    optionDetails,
    correctIndex: canonical.correctIndex,
    answer,
    explanation,
    localization: {
      authority: MENSURATION_LOCALIZATION_AUTHORITY,
      canonicalLanguage: "en",
      canonicalLocale: "en-IN",
      canonicalQuestionId: canonical.questionId,
      canonicalItemId: canonical.canonicalItemId,
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
  if (language === "en") return canonical as MensurationLocalizedQuestionV1;
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
    ? canonical.questions as MensurationLocalizedQuestionV1[]
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
