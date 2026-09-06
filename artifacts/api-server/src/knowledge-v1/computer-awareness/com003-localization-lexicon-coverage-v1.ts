import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import { COM003_HINDI_LOCALIZATION_WAVE1_V3, COM003_PUNJABI_LOCALIZATION_WAVE1_V3 } from "./com003-localization-wave1-v3";
import { COM003_HINDI_LOCALIZATION_WAVE2_V3, COM003_PUNJABI_LOCALIZATION_WAVE2_V3 } from "./com003-localization-wave2-v3";
import { COM003_HINDI_LOCALIZATION_WAVE3_V2, COM003_PUNJABI_LOCALIZATION_WAVE3_V2 } from "./com003-localization-wave3-v2";
import { COM003_HINDI_LOCALIZATION_WAVE4_V2, COM003_PUNJABI_LOCALIZATION_WAVE4_V2 } from "./com003-localization-wave4-v2";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

function norm(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

const HI = Object.freeze([
  ...COM003_HINDI_LOCALIZATION_WAVE1_V3,
  ...COM003_HINDI_LOCALIZATION_WAVE2_V3,
  ...COM003_HINDI_LOCALIZATION_WAVE3_V2,
  ...COM003_HINDI_LOCALIZATION_WAVE4_V2,
]);
const PA = Object.freeze([
  ...COM003_PUNJABI_LOCALIZATION_WAVE1_V3,
  ...COM003_PUNJABI_LOCALIZATION_WAVE2_V3,
  ...COM003_PUNJABI_LOCALIZATION_WAVE3_V2,
  ...COM003_PUNJABI_LOCALIZATION_WAVE4_V2,
]);

const EN_BY_ID = new Map(COM003_ENGLISH_REVIEW_CORPUS_V4.map((q) => [q.questionId, q]));

function buildLexicon(items: readonly Com003LocalizedQuestionV1[]) {
  const option = new Map<string, Set<string>>();
  const answer = new Map<string, Set<string>>();
  const stem = new Map<string, Set<string>>();
  const explanation = new Map<string, Set<string>>();
  const add = (map: Map<string, Set<string>>, en: string, localized: string) => {
    const key = norm(en);
    const set = map.get(key) ?? new Set<string>();
    set.add(localized.trim());
    map.set(key, set);
  };
  for (const item of items) {
    const en = EN_BY_ID.get(item.sourceQuestionId);
    if (!en) throw new Error(`COM-003 localization lexicon missing V4 source ${item.sourceQuestionId}`);
    if (en.options.length !== item.options.length) throw new Error(`COM-003 localization option count drift ${item.localizationId}`);
    for (let i = 0; i < en.options.length; i += 1) add(option, en.options[i]!, item.options[i]!);
    add(answer, en.canonicalAnswer, item.canonicalAnswer);
    add(stem, en.stem, item.stem);
    add(explanation, en.explanation, item.explanation);
  }
  return { option, answer, stem, explanation };
}

const HI_LEXICON = buildLexicon(HI);
const PA_LEXICON = buildLexicon(PA);

function auditLanguage(language: "hi" | "pa", lexicon: ReturnType<typeof buildLexicon>) {
  const optionCoverageByQuestion = COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((q) => q.options.every((o) => lexicon.option.has(norm(o))));
  const uniqueOptions = new Set(COM003_ENGLISH_REVIEW_CORPUS_V16_2.flatMap((q) => q.options.map(norm)));
  const coveredUniqueOptions = [...uniqueOptions].filter((o) => lexicon.option.has(o));
  const ambiguousOptionKeys = [...lexicon.option.entries()].filter(([, values]) => values.size > 1).map(([key, values]) => ({ key, variants: [...values] }));
  const uniqueAnswers = new Set(COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((q) => norm(q.canonicalAnswer)));
  const coveredUniqueAnswers = [...uniqueAnswers].filter((a) => lexicon.answer.has(a));
  return {
    language,
    questionsWithAllOptionsCovered: optionCoverageByQuestion.filter(Boolean).length,
    questionsWithMissingOptionTranslation: optionCoverageByQuestion.filter((v) => !v).length,
    uniqueTargetOptions: uniqueOptions.size,
    uniqueTargetOptionsCovered: coveredUniqueOptions.length,
    uniqueTargetOptionsMissing: uniqueOptions.size - coveredUniqueOptions.length,
    uniqueTargetAnswers: uniqueAnswers.size,
    uniqueTargetAnswersCovered: coveredUniqueAnswers.length,
    uniqueTargetAnswersMissing: uniqueAnswers.size - coveredUniqueAnswers.length,
    exactStemTranslationReusable: COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => lexicon.stem.has(norm(q.stem))).length,
    exactExplanationTranslationReusable: COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => lexicon.explanation.has(norm(q.explanation))).length,
    ambiguousOptionKeyCount: ambiguousOptionKeys.length,
    ambiguousOptionKeys,
    missingOptionTerms: [...uniqueOptions].filter((o) => !lexicon.option.has(o)),
    missingAnswerTerms: [...uniqueAnswers].filter((a) => !lexicon.answer.has(a)),
  };
}

export const COM003_LOCALIZATION_LEXICON_COVERAGE_V1 = Object.freeze({
  v4EnglishQuestionCount: COM003_ENGLISH_REVIEW_CORPUS_V4.length,
  v16_2EnglishQuestionCount: COM003_ENGLISH_REVIEW_CORPUS_V16_2.length,
  hindiLocalizedQuestionCount: HI.length,
  punjabiLocalizedQuestionCount: PA.length,
  hindi: auditLanguage("hi", HI_LEXICON),
  punjabi: auditLanguage("pa", PA_LEXICON),
  policy: "LEXICON_REUSE_MAY_SEED_OPTIONS_AND_ANSWERS_BUT_NEVER_AUTO_AUTHORIZES_STEM_OR_EXPLANATION_REUSE" as const,
});
