import { COM004_ENGLISH_FREEZE_AUTHORITY_V2 } from './com004-english-chapter-v2';
import { COM004_ENGLISH_CHAPTER_V2 } from "./com004-english-chapter-v2";
import type { Com004EnglishChapterQuestionV1 } from "./com004-english-chapter-candidate-v1";

export type Com004LocalizationLanguage = "hi" | "pa";
export type Com004LocalizationLocale = "hi-IN" | "pa-IN";

export type Com004LocalizedQuestionV1 = {
  localizationId: string;
  sourceQuestionId: string;
  qlId: Com004EnglishChapterQuestionV1["qlId"];
  authorityProposalId: string;
  sourceCandidateIds: string[];
  surfaceFamily: Com004EnglishChapterQuestionV1["surfaceFamily"];
  language: Com004LocalizationLanguage;
  locale: Com004LocalizationLocale;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceEnglishCanonicalAnswer: string;
  sourceEnglishFrozen: boolean;
  sourceEnglishAuthorityId: string;
  localizationReviewOnly: true;
  localizationFrozen: false;
  runtimeRegistered: false;
  productionReleased: false;
};

type LocalizedCopy = {
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
};

export type Com004BilingualCopyV1 = {
  sourceQuestionId: string;
  hi: LocalizedCopy;
  pa: LocalizedCopy;
};

const sourceById = new Map(COM004_ENGLISH_CHAPTER_V2.map((question) => [question.questionId, question]));

if (!COM004_ENGLISH_FREEZE_AUTHORITY_V2.governance.englishFrozen) {
  throw new Error("COM-004 localization cannot bind before English Freeze V2");
}
if (!COM004_ENGLISH_FREEZE_AUTHORITY_V2.governance.hindiPunjabiLocalizationV1Authorized) {
  throw new Error("COM-004 Hindi/Punjabi localization V1 is not authorized by English Freeze V2");
}

export function localizeCom004Wave1QuestionV1(
  copy: Com004BilingualCopyV1,
  language: Com004LocalizationLanguage,
): Com004LocalizedQuestionV1 {
  if (language !== "hi" && language !== "pa") throw new Error(`Unsupported COM-004 language ${String(language)}`);
  const source = sourceById.get(copy.sourceQuestionId);
  if (!source) throw new Error(`Unknown COM-004 source question ${copy.sourceQuestionId}`);
  const localized = copy[language];
  if (!localized || localized.distractors.length !== 3) throw new Error(`${copy.sourceQuestionId}/${language}: three distractors required`);
  const choices = [localized.canonicalAnswer.trim(), ...localized.distractors.map((value) => value.trim())];
  if (new Set(choices.map((option) => option.toLocaleLowerCase())).size !== 4) {
    throw new Error(`${copy.sourceQuestionId}/${language}: localized options must be distinct`);
  }
  if (choices.some(value => !value) || !localized.stem.trim() || !localized.explanation.trim()) {
    throw new Error(`${copy.sourceQuestionId}/${language}: localized stem/explanation cannot be empty`);
  }

  const options = localized.distractors.map((value) => value.trim());
  options.splice(source.correctIndex, 0, localized.canonicalAnswer.trim());

  return Object.freeze({
    localizationId: `COM004-LOC-${copy.sourceQuestionId.split("-")[2]}-${language.toUpperCase()}-${copy.sourceQuestionId}`,
    sourceQuestionId: source.questionId,
    qlId: source.qlId,
    authorityProposalId: source.authorityProposalId,
    sourceCandidateIds: Object.freeze([...source.sourceCandidateIds]) as unknown as string[],
    surfaceFamily: source.surfaceFamily,
    language,
    locale: language === "hi" ? "hi-IN" : "pa-IN",
    stem: localized.stem.trim(),
    options: Object.freeze(options) as unknown as string[],
    correctIndex: source.correctIndex,
    canonicalAnswer: localized.canonicalAnswer.trim(),
    explanation: localized.explanation.trim(),
    sourceEnglishCanonicalAnswer: source.canonicalAnswer,
    sourceEnglishFrozen: true,
    sourceEnglishAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    localizationReviewOnly: true,
    localizationFrozen: false,
    runtimeRegistered: false,
    productionReleased: false,
  });
}

export function buildCom004BilingualLocalizationV1(copy: readonly Com004BilingualCopyV1[]) {
  const sourceIds = copy.map((item) => item.sourceQuestionId);
  if (new Set(sourceIds).size !== sourceIds.length) throw new Error("COM-004 localization source IDs must be unique within an authored packet");
  return Object.freeze({
    hi: Object.freeze(copy.map((item) => localizeCom004Wave1QuestionV1(item, "hi"))),
    pa: Object.freeze(copy.map((item) => localizeCom004Wave1QuestionV1(item, "pa"))),
  });
}
