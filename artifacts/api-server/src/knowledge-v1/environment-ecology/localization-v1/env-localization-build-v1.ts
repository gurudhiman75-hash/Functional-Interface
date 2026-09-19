import {
  ENV_LOCALIZATION_V1,
  type EnvLocaleV1,
  type EnvLocalizedQuestionV1,
} from "./env-localization-types-v1";

export type EnvNativePairV1 = Readonly<{ hi: string; pa: string }>;
export type EnvNativeSurfaceV1 = Readonly<{
  stem: EnvNativePairV1;
  explanation: EnvNativePairV1;
}>;

export const envPairV1 = (hi: string, pa: string): EnvNativePairV1 => Object.freeze({ hi, pa });

type EnglishQuestion = {
  questionId: string;
  chapterId: "ENV-001";
  cpId: string;
  qlId: string;
  qlName: string;
  difficulty: EnvLocalizedQuestionV1["difficulty"];
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

export function buildEnvLocalizedBatchV1(
  source: readonly EnglishQuestion[],
  locale: EnvLocaleV1,
  surfaces: readonly EnvNativeSurfaceV1[],
  optionMap: Readonly<Record<string, EnvNativePairV1>>,
): EnvLocalizedQuestionV1[] {
  if (surfaces.length !== source.length) {
    throw new Error(`Environment localization surface mismatch: source=${source.length}, surfaces=${surfaces.length}`);
  }

  return source.map((q, index) => {
    if (locale === "en") {
      return {
        ...q,
        options: [...q.options],
        sourceIds: [...q.sourceIds],
        sourceFactIds: [...q.sourceFactIds],
        locale,
        localizationV1: {
          version: ENV_LOCALIZATION_V1,
          englishQuestionId: q.questionId,
          semanticInvariant: true,
          cpInvariant: true,
          qlInvariant: true,
          difficultyInvariant: true,
          sourceInvariant: true,
          optionOrderInvariant: true,
          correctIndexInvariant: true,
          reviewOnly: true,
        },
      };
    }

    const surface = surfaces[index];
    const options = q.options.map((option) => {
      const pair = optionMap[option];
      if (!pair) throw new Error(`${q.questionId}: missing ${locale} option localization: ${option}`);
      return pair[locale];
    });

    return {
      ...q,
      questionId: `${q.questionId}-${locale.toUpperCase()}`,
      stem: surface.stem[locale],
      options,
      canonicalAnswer: options[q.correctIndex],
      explanation: surface.explanation[locale],
      sourceIds: [...q.sourceIds],
      sourceFactIds: [...q.sourceFactIds],
      locale,
      localizationV1: {
        version: ENV_LOCALIZATION_V1,
        englishQuestionId: q.questionId,
        semanticInvariant: true,
        cpInvariant: true,
        qlInvariant: true,
        difficultyInvariant: true,
        sourceInvariant: true,
        optionOrderInvariant: true,
        correctIndexInvariant: true,
        reviewOnly: true,
      },
    };
  });
}
