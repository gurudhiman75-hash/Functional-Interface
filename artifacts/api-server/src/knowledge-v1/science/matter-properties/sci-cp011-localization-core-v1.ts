import { SCI_CP011_REVIEW_V1 } from "./sci-cp011-review-v1";

export type SciCp011LocalizationLanguage = "hi" | "pa";
export type SciCp011LocalizationLocale = "hi-IN" | "pa-IN";

type LocalizedCopy = {
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
};

export type SciCp011BilingualCopyV1 = {
  sourceQuestionId: string;
  hi: LocalizedCopy;
  pa: LocalizedCopy;
};

export type SciCp011LocalizedQuestionV1 = {
  localizationId: string;
  sourceQuestionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-011";
  qlId: string;
  qlName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: SciCp011LocalizationLanguage;
  locale: SciCp011LocalizationLocale;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceEnglishCanonicalAnswer: string;
  sourceIds: string[];
  sourceFactIds: string[];
  localizationReviewOnly: true;
  localizationFrozen: false;
  runtimeRegistered: false;
};

const sourceById = new Map(SCI_CP011_REVIEW_V1.map((question) => [question.questionId, question]));

function normalize(value: string) {
  return value.trim();
}

export function localizeSciCp011QuestionV1(copy: SciCp011BilingualCopyV1, language: SciCp011LocalizationLanguage): SciCp011LocalizedQuestionV1 {
  const source = sourceById.get(copy.sourceQuestionId);
  if (!source) throw new Error(`Unknown SCI-CP-011 source question ${copy.sourceQuestionId}`);
  const localized = copy[language];
  const choices = [localized.canonicalAnswer, ...localized.distractors].map(normalize);
  if (choices.some((value) => !value) || !localized.stem.trim() || !localized.explanation.trim()) {
    throw new Error(`${copy.sourceQuestionId}/${language}: empty localized learner copy`);
  }
  if (new Set(choices.map((value) => value.toLocaleLowerCase())).size !== 4) {
    throw new Error(`${copy.sourceQuestionId}/${language}: localized options must be distinct`);
  }
  const options = localized.distractors.map(normalize);
  options.splice(source.correctIndex, 0, normalize(localized.canonicalAnswer));
  return Object.freeze({
    localizationId: `${copy.sourceQuestionId}-${language.toUpperCase()}-V1`,
    sourceQuestionId: source.questionId,
    chapterId: "SCI-001" as const,
    cpId: "SCI-CP-011" as const,
    qlId: source.qlId,
    qlName: source.qlName,
    difficulty: source.difficulty,
    language,
    locale: language === "hi" ? "hi-IN" : "pa-IN",
    stem: normalize(localized.stem),
    options: Object.freeze(options) as unknown as string[],
    correctIndex: source.correctIndex,
    canonicalAnswer: normalize(localized.canonicalAnswer),
    explanation: normalize(localized.explanation),
    sourceEnglishCanonicalAnswer: source.canonicalAnswer,
    sourceIds: Object.freeze([...source.sourceIds]) as unknown as string[],
    sourceFactIds: Object.freeze([...source.sourceFactIds]) as unknown as string[],
    localizationReviewOnly: true as const,
    localizationFrozen: false as const,
    runtimeRegistered: false as const,
  });
}

export function buildSciCp011BilingualLocalizationV1(copy: readonly SciCp011BilingualCopyV1[]) {
  const sourceIds = copy.map((item) => item.sourceQuestionId);
  if (new Set(sourceIds).size !== sourceIds.length) throw new Error("SCI-CP-011 localization source IDs must be unique");
  return Object.freeze({
    hi: Object.freeze(copy.map((item) => localizeSciCp011QuestionV1(item, "hi"))),
    pa: Object.freeze(copy.map((item) => localizeSciCp011QuestionV1(item, "pa"))),
  });
}
