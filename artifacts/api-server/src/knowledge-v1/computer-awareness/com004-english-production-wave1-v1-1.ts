import {
  COM004_ENGLISH_PRODUCTION_WAVE1_AUTHORITY_V1 as BASE_AUTHORITY,
  COM004_ENGLISH_PRODUCTION_WAVE1_V1 as BASE_QUESTIONS,
  type Com004EnglishQuestionV1,
} from "./com004-english-production-wave1-v1";

const STEM_REPLACEMENTS = Object.freeze({
  "COM004-EN-W1-001-07": "Which of the following pairs correctly matches an Internet-related term with its basic function?",
  "COM004-EN-W1-002-08": "Which of the following comparisons correctly distinguishes the Internet from the World Wide Web?",
  "COM004-EN-W1-002-09": "Which of the following statements incorrectly treats the Internet and the World Wide Web as equivalent?",
  "COM004-EN-W1-003-02": "In the context of the World Wide Web, which description most accurately defines an individual web page?",
} as const);

const replacementIds = new Set(Object.keys(STEM_REPLACEMENTS));
const seenReplacementIds = new Set<string>();

export const COM004_ENGLISH_PRODUCTION_WAVE1_V1: Com004EnglishQuestionV1[] = Object.freeze(
  BASE_QUESTIONS.map((question) => {
    const replacement = STEM_REPLACEMENTS[question.questionId as keyof typeof STEM_REPLACEMENTS];
    if (!replacement) return question;
    seenReplacementIds.add(question.questionId);
    return Object.freeze({ ...question, stem: replacement });
  }),
) as unknown as Com004EnglishQuestionV1[];

if (seenReplacementIds.size !== replacementIds.size) {
  const missing = [...replacementIds].filter((questionId) => !seenReplacementIds.has(questionId));
  throw new Error(`COM-004 English Wave 1 V1.1 overlay failed to bind replacement IDs: ${missing.join(", ")}`);
}

export const COM004_ENGLISH_PRODUCTION_WAVE1_AUTHORITY_V1 = Object.freeze({
  ...BASE_AUTHORITY,
  authorityId: "COM-004-ENGLISH-PRODUCTION-WAVE1-V1.1" as const,
  status: "REVIEW_CANDIDATE_NOT_FROZEN" as const,
  questionCount: COM004_ENGLISH_PRODUCTION_WAVE1_V1.length,
  editorialOverlay: Object.freeze({
    version: "V1.1" as const,
    purpose: "Strengthen four under-substance stems caught by the first editorial gate without altering answers, options, explanations, QL bindings, provenance, or lifecycle locks." as const,
    replacedQuestionIds: Object.freeze([...replacementIds]),
  }),
  nextGate: "COM004_ENGLISH_PRODUCTION_WAVE1_EDITORIAL_AUDIT" as const,
});
