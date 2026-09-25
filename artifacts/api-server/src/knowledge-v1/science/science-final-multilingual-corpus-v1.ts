import {
  generatePhysicsLocalizedCpV1,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS,
} from "./physics-localization-v1/sci-physics-localization-generator-v1";
import type { PhysicsLocaleV1 } from "./physics-localization-v1/sci-physics-localization-types-v1";
import { SCI_PHYSICS_EXHAUSTIVE_CP_META_V2 } from "./physics-exhaustive-v2/sci-physics-exhaustive-domain-v2";
import {
  generateChemistryLocalizedCpV1,
  type ChemistryLocalizedCpV1,
} from "./chemistry-localization-v1/sci-chemistry-localization-generator-v1";
import type { ChemistryLocaleV1 } from "./chemistry-localization-v1/sci-chemistry-localization-types-v1";
import {
  generateBiologyLocalizedCpV1,
  type BiologyLocalizedCpV1,
} from "./biology-localization-v1/sci-biology-localization-generator-v1";
import type { BiologyLocaleV1 } from "./biology-localization-v1/sci-biology-localization-types-v1";
import {
  generateGeneralScienceLocalizedCpV1,
  type GeneralScienceLocalizedCpV1,
} from "./general-science-localization-v1/sci-general-localization-generator-v1";
import type { GeneralScienceLocaleV1 } from "./general-science-localization-v1/sci-general-localization-types-v1";

export type ScienceLocaleV1 = "en" | "hi" | "pa";
export type ScienceDifficultyV1 = "Easy" | "Medium" | "Hard";

export type ScienceFinalLocalizedQuestionV1 = Readonly<{
  questionId: string;
  englishQuestionId: string;
  chapterId: "SCI-001";
  cpId: string;
  qlId: string;
  qlName?: string;
  difficulty: ScienceDifficultyV1;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
  locale: ScienceLocaleV1;
}>;

export const SCI_001_FINAL_LOCALIZED_CP_IDS_V1 = Object.freeze(
  Array.from({ length: 40 }, (_, index) => `SCI-CP-${String(index + 1).padStart(3, "0")}`),
);

export const SCI_001_FINAL_LOCALIZED_LOCALES_V1 = Object.freeze(["en", "hi", "pa"] as const);

const physicsTopicNames = new Map<string, string>(
  SCI_PHYSICS_EXHAUSTIVE_CP_META_V2.flatMap((cp) =>
    cp.anchors.map((anchor) => [`${cp.cpId}:${anchor.topicId}`, anchor.topic] as const),
  ),
);

function physicsQlId(cpId: string, topicId: string) {
  return `${cpId}-QL-${topicId.toUpperCase()}`;
}

function physicsCp(cpId: string, locale: ScienceLocaleV1): readonly ScienceFinalLocalizedQuestionV1[] {
  const questions = generatePhysicsLocalizedCpV1(
    cpId as (typeof SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS)[number],
    locale as PhysicsLocaleV1,
  );

  return Object.freeze(
    questions.map((q) => {
      const topicId = q.topicIds[0];
      if (!topicId) throw new Error(`${q.questionId}: Physics topic identity missing`);
      return Object.freeze({
        questionId: q.questionId,
        englishQuestionId: q.localizationV1.englishQuestionId,
        chapterId: "SCI-001" as const,
        cpId: q.cpId,
        qlId: physicsQlId(q.cpId, topicId),
        qlName: physicsTopicNames.get(`${q.cpId}:${topicId}`) ?? topicId,
        difficulty: q.difficulty as ScienceDifficultyV1,
        stem: q.stem,
        options: Object.freeze([...q.options]),
        correctIndex: q.correctIndex,
        canonicalAnswer: q.canonicalAnswer,
        explanation: q.explanation,
        sourceIds: Object.freeze([...q.sourceIds]),
        sourceFactIds: Object.freeze([...q.anchorIds]),
        reviewOnly: true as const,
        runtimeRegistered: false as const,
        locale,
      });
    }),
  );
}

function chemistryCp(cpId: string, locale: ScienceLocaleV1): readonly ScienceFinalLocalizedQuestionV1[] {
  return Object.freeze(
    generateChemistryLocalizedCpV1(cpId as ChemistryLocalizedCpV1, locale as ChemistryLocaleV1).map((q) =>
      Object.freeze({
        questionId: q.questionId,
        englishQuestionId: q.localizationV1.englishQuestionId,
        chapterId: q.chapterId,
        cpId: q.cpId,
        qlId: q.qlId,
        qlName: q.qlName,
        difficulty: q.difficulty,
        stem: q.stem,
        options: Object.freeze([...q.options]),
        correctIndex: q.correctIndex,
        canonicalAnswer: q.canonicalAnswer,
        explanation: q.explanation,
        sourceIds: Object.freeze([...q.sourceIds]),
        sourceFactIds: Object.freeze([...q.sourceFactIds]),
        reviewOnly: q.reviewOnly,
        runtimeRegistered: q.runtimeRegistered,
        locale,
      }),
    ),
  );
}

function biologyCp(cpId: string, locale: ScienceLocaleV1): readonly ScienceFinalLocalizedQuestionV1[] {
  return Object.freeze(
    generateBiologyLocalizedCpV1(cpId as BiologyLocalizedCpV1, locale as BiologyLocaleV1).map((q) =>
      Object.freeze({
        questionId: q.questionId,
        englishQuestionId: q.localizationV1.englishQuestionId,
        chapterId: q.chapterId,
        cpId: q.cpId,
        qlId: q.qlId,
        qlName: q.qlName,
        difficulty: q.difficulty,
        stem: q.stem,
        options: Object.freeze([...q.options]),
        correctIndex: q.correctIndex,
        canonicalAnswer: q.canonicalAnswer,
        explanation: q.explanation,
        sourceIds: Object.freeze([...q.sourceIds]),
        sourceFactIds: Object.freeze([...q.sourceFactIds]),
        reviewOnly: q.reviewOnly,
        runtimeRegistered: q.runtimeRegistered,
        locale,
      }),
    ),
  );
}

function generalScienceCp(cpId: string, locale: ScienceLocaleV1): readonly ScienceFinalLocalizedQuestionV1[] {
  return Object.freeze(
    generateGeneralScienceLocalizedCpV1(
      cpId as GeneralScienceLocalizedCpV1,
      locale as GeneralScienceLocaleV1,
    ).map((q) =>
      Object.freeze({
        questionId: q.questionId,
        englishQuestionId: q.localizationV1.englishQuestionId,
        chapterId: q.chapterId,
        cpId: q.cpId,
        qlId: q.qlId,
        qlName: q.qlName,
        difficulty: q.difficulty,
        stem: q.stem,
        options: Object.freeze([...q.options]),
        correctIndex: q.correctIndex,
        canonicalAnswer: q.canonicalAnswer,
        explanation: q.explanation,
        sourceIds: Object.freeze([...q.sourceIds]),
        sourceFactIds: Object.freeze([...q.sourceFactIds]),
        reviewOnly: q.reviewOnly,
        runtimeRegistered: q.runtimeRegistered,
        locale,
      }),
    ),
  );
}

export function generateScienceFinalLocalizedCpV1(
  cpId: string,
  locale: ScienceLocaleV1,
): readonly ScienceFinalLocalizedQuestionV1[] {
  const number = Number(cpId.slice(-3));
  if (!Number.isInteger(number) || number < 1 || number > 40) {
    throw new Error(`Unknown SCI-001 CP: ${cpId}`);
  }
  if (number <= 10) return physicsCp(cpId, locale);
  if (number <= 18) return chemistryCp(cpId, locale);
  if (number <= 35) return biologyCp(cpId, locale);
  return generalScienceCp(cpId, locale);
}

export function generateScienceFinalLocalizedCorpusV1(
  locale: ScienceLocaleV1,
): readonly ScienceFinalLocalizedQuestionV1[] {
  return Object.freeze(
    SCI_001_FINAL_LOCALIZED_CP_IDS_V1.flatMap((cpId) =>
      generateScienceFinalLocalizedCpV1(cpId, locale),
    ),
  );
}
