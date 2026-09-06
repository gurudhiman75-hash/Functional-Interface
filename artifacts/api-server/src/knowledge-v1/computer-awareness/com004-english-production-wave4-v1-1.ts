import {
  COM004_ENGLISH_PRODUCTION_WAVE4_AUTHORITY_V1 as BASE_AUTHORITY,
  COM004_ENGLISH_PRODUCTION_WAVE4_V1 as BASE_QUESTIONS,
  type Com004EnglishWave4QuestionV1,
} from "./com004-english-production-wave4-v1";

const TARGET_ID = "COM004-EN-W4-014-01";
let replacementApplied = false;

export const COM004_ENGLISH_PRODUCTION_WAVE4_V1: Com004EnglishWave4QuestionV1[] = Object.freeze(
  BASE_QUESTIONS.map((question) => {
    if (question.questionId !== TARGET_ID) return question;
    replacementApplied = true;
    return Object.freeze({
      ...question,
      stem: "Which description most accurately defines an e-mail attachment in normal message composition?",
    });
  }),
) as unknown as Com004EnglishWave4QuestionV1[];

if (!replacementApplied) throw new Error(`COM-004 Wave 4 V1.1 could not bind ${TARGET_ID}`);

export const COM004_ENGLISH_PRODUCTION_WAVE4_AUTHORITY_V1 = Object.freeze({
  ...BASE_AUTHORITY,
  authorityId: "COM-004-ENGLISH-PRODUCTION-WAVE4-V1.1" as const,
  status: "REVIEW_CANDIDATE_NOT_FROZEN" as const,
  questionCount: COM004_ENGLISH_PRODUCTION_WAVE4_V1.length,
  editorialOverlay: Object.freeze({
    version: "V1.1" as const,
    replacedQuestionIds: Object.freeze([TARGET_ID]),
    purpose: "Strengthen the single under-substance attachment-definition stem without changing answer, options, explanation, QL/provenance binding or lifecycle." as const,
  }),
  nextGate: "COM004_ENGLISH_PRODUCTION_WAVE4_EDITORIAL_AUDIT" as const,
});
