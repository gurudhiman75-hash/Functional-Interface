import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import { COM003_HINDI_LOCALIZATION_WAVE1_V3, COM003_PUNJABI_LOCALIZATION_WAVE1_V3 } from "./com003-localization-wave1-v3";
import { COM003_HINDI_LOCALIZATION_WAVE2_V3, COM003_PUNJABI_LOCALIZATION_WAVE2_V3 } from "./com003-localization-wave2-v3";
import { COM003_HINDI_LOCALIZATION_WAVE3_V2, COM003_PUNJABI_LOCALIZATION_WAVE3_V2 } from "./com003-localization-wave3-v2";
import { COM003_HINDI_LOCALIZATION_WAVE4_V2, COM003_PUNJABI_LOCALIZATION_WAVE4_V2 } from "./com003-localization-wave4-v2";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

export type Com003LocalizationLanguageV2 = "hi" | "pa";

function norm(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

const EN_BY_ID = new Map(COM003_ENGLISH_REVIEW_CORPUS_V4.map((q) => [q.questionId, q]));
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

function build(items: readonly Com003LocalizedQuestionV1[]) {
  const option = new Map<string, Set<string>>();
  const answer = new Map<string, Set<string>>();
  const bySourceId = new Map<string, Com003LocalizedQuestionV1>();
  const relation = new Map<string, Com003LocalizedQuestionV1[]>();
  const add = (map: Map<string, Set<string>>, en: string, localized: string) => {
    const key = norm(en);
    const set = map.get(key) ?? new Set<string>();
    set.add(localized.trim());
    map.set(key, set);
  };
  for (const item of items) {
    const en = EN_BY_ID.get(item.sourceQuestionId);
    if (!en) throw new Error(`COM-003 translation memory missing V4 English ${item.sourceQuestionId}`);
    if (en.options.length !== item.options.length) throw new Error(`COM-003 translation memory option drift ${item.localizationId}`);
    bySourceId.set(item.sourceQuestionId, item);
    for (let i = 0; i < en.options.length; i += 1) add(option, en.options[i]!, item.options[i]!);
    add(answer, en.canonicalAnswer, item.canonicalAnswer);
    const relationKey = `${en.qlId}|${en.targetFactId}|${norm(en.canonicalAnswer)}`;
    const arr = relation.get(relationKey) ?? [];
    arr.push(item);
    relation.set(relationKey, arr);
  }
  return { option, answer, bySourceId, relation };
}

const MEM = { hi: build(HI), pa: build(PA) } as const;

export type Com003TranslationMemoryLookupV1 = {
  english: string;
  status: "UNIQUE" | "AMBIGUOUS" | "MISSING";
  candidates: readonly string[];
  selected: string | null;
};

function lookup(map: Map<string, Set<string>>, english: string): Com003TranslationMemoryLookupV1 {
  const candidates = [...(map.get(norm(english)) ?? new Set<string>())];
  return {
    english,
    status: candidates.length === 0 ? "MISSING" : candidates.length === 1 ? "UNIQUE" : "AMBIGUOUS",
    candidates,
    selected: candidates.length === 1 ? candidates[0]! : null,
  };
}

export function lookupCom003OptionTranslationV1(language: Com003LocalizationLanguageV2, english: string) {
  return lookup(MEM[language].option, english);
}

export function lookupCom003AnswerTranslationV1(language: Com003LocalizationLanguageV2, english: string) {
  return lookup(MEM[language].answer, english);
}

export function findCom003LegacyLocalizedRelationV1(
  language: Com003LocalizationLanguageV2,
  qlId: string,
  targetFactId: string,
  canonicalAnswer: string,
) {
  return MEM[language].relation.get(`${qlId}|${targetFactId}|${norm(canonicalAnswer)}`) ?? [];
}

export const COM003_LOCALIZATION_TRANSLATION_MEMORY_V1 = Object.freeze({
  englishSourceQuestions: COM003_ENGLISH_REVIEW_CORPUS_V4.length,
  hindiQuestions: HI.length,
  punjabiQuestions: PA.length,
  authority: "COM-003-LOCALIZATION-TRANSLATION-MEMORY-V1" as const,
  usePolicy: "AUTHORING_SEED_ONLY_REQUIRES_V16_2_PARITY_REVIEW" as const,
});
