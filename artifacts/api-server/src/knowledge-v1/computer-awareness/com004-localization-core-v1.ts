import { COM004_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com004-english-freeze-v1";
import { COM004_ENGLISH_PRODUCTION_WAVE1_V1 } from "./com004-english-production-wave1-v1-1";
import type { Com004EnglishQuestionV1 } from "./com004-english-production-wave1-v1";

export type Com004LocalizationLanguage = "hi" | "pa";
export type Com004LocalizationLocale = "hi-IN" | "pa-IN";

export type Com004LocalizedQuestionV1 = {
  localizationId: string;
  sourceQuestionId: string;
  qlId: Com004EnglishQuestionV1["qlId"];
  authorityProposalId: string;
  sourceCandidateIds: string[];
  surfaceFamily: Com004EnglishQuestionV1["surfaceFamily"];
  language: Com004LocalizationLanguage;
  locale: Com004LocalizationLocale;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceEnglishCanonicalAnswer: string;
  sourceEnglishFrozen: true;
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

const sourceById = new Map(COM004_ENGLISH_PRODUCTION_WAVE1_V1.map((question) => [question.questionId, question]));

if (!COM004_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) {
  throw new Error("COM-004 localization cannot bind before English Freeze V1");
}
if (!COM004_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiLocalizationV1Authorized) {
  throw new Error("COM-004 Hindi/Punjabi localization V1 is not authorized by English Freeze V1");
}

export function localizeCom004Wave1QuestionV1(
  copy: Com004BilingualCopyV1,
  language: Com004LocalizationLanguage,
): Com004LocalizedQuestionV1 {
  const source = sourceById.get(copy.sourceQuestionId);
  if (!source) throw new Error(`Unknown frozen COM-004 Wave 1 source question ${copy.sourceQuestionId}`);
  const localized = copy[language];
  const choices = [localized.canonicalAnswer.trim(), ...localized.distractors.map((value) => value.trim())];
  if (new Set(choices.map((option) => option.toLocaleLowerCase())).size !== 4) {
    throw new Error(`${copy.sourceQuestionId}/${language}: localized options must be distinct`);
  }
  if (!localized.stem.trim() || !localized.explanation.trim()) {
    throw new Error(`${copy.sourceQuestionId}/${language}: localized stem/explanation cannot be empty`);
  }

  const options = localized.distractors.map((value) => value.trim());
  options.splice(source.correctIndex, 0, localized.canonicalAnswer.trim());

  return Object.freeze({
    localizationId: `COM004-LOC-W1-${language.toUpperCase()}-${copy.sourceQuestionId}`,
    sourceQuestionId: source.questionId,
    qlId: source.qlId,
    authorityProposalId: source.authorityProposalId,
    sourceCandidateIds: [...source.sourceCandidateIds],
    surfaceFamily: source.surfaceFamily,
    language,
    locale: language === "hi" ? "hi-IN" : "pa-IN",
    stem: localized.stem.trim(),
    options,
    correctIndex: source.correctIndex,
    canonicalAnswer: localized.canonicalAnswer.trim(),
    explanation: localized.explanation.trim(),
    sourceEnglishCanonicalAnswer: source.canonicalAnswer,
    sourceEnglishFrozen: true,
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
