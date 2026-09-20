import type { CP003NounCategory } from "./CP003-noun-corpus";
import type { CP003PronounCategory } from "./CP003-pronoun-corpus";

export interface CP003CategoryDefinition<T extends string> {
  id: string;
  category: T;
  namePa: string;
  definitionPa: string;
  sourceStatus: "REVIEW_PENDING";
}

export const CP003_NOUN_DEFINITIONS: readonly CP003CategoryDefinition<CP003NounCategory>[] = [
  { id: "ND-01", category: "NIJJ", namePa: "ਨਿੱਜਵਾਚਕ ਨਾਂਵ", definitionPa: "ਕਿਸੇ ਖ਼ਾਸ ਵਿਅਕਤੀ, ਥਾਂ, ਵਸਤੂ ਜਾਂ ਵਿਸ਼ੇਸ਼ ਨਾਮ ਲਈ ਵਰਤਿਆ ਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "ND-02", category: "JATI", namePa: "ਜਾਤੀਵਾਚਕ ਨਾਂਵ", definitionPa: "ਇੱਕੋ ਜਾਤੀ ਜਾਂ ਕਿਸਮ ਦੇ ਸਾਰੇ ਜੀਵਾਂ ਜਾਂ ਵਸਤੂਆਂ ਲਈ ਵਰਤਿਆ ਸਾਂਝਾ ਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "ND-03", category: "IKATH", namePa: "ਇਕੱਠਵਾਚਕ ਨਾਂਵ", definitionPa: "ਜੀਵਾਂ ਜਾਂ ਵਸਤੂਆਂ ਦੇ ਸਮੂਹ ਜਾਂ ਇਕੱਠ ਦਾ ਬੋਧ ਕਰਾਉਣ ਵਾਲਾ ਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "ND-04", category: "VASTU", namePa: "ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ", definitionPa: "ਤੋਲੀ, ਮਾਪੀ ਜਾਂ ਮਿਣੀ ਜਾਣ ਵਾਲੀ ਪਰ ਆਮ ਤੌਰ ਤੇ ਇਕਾਈਆਂ ਵਜੋਂ ਨਾ ਗਿਣੀ ਜਾਣ ਵਾਲੀ ਵਸਤੂ ਜਾਂ ਪਦਾਰਥ ਦਾ ਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "ND-05", category: "BHAV", namePa: "ਭਾਵਵਾਚਕ ਨਾਂਵ", definitionPa: "ਗੁਣ, ਅਵਸਥਾ, ਭਾਵ ਜਾਂ ਵਿਚਾਰ ਦਾ ਬੋਧ ਕਰਾਉਣ ਵਾਲਾ ਨਾਂਵ ਜਿਸ ਨੂੰ ਸਿੱਧਾ ਛੂਹਿਆ ਜਾਂ ਵੇਖਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।", sourceStatus: "REVIEW_PENDING" },
] as const;

export const CP003_PRONOUN_DEFINITIONS: readonly CP003CategoryDefinition<CP003PronounCategory>[] = [
  { id: "PD-01", category: "PURAKH", namePa: "ਪੁਰਖ-ਵਾਚਕ ਪੜਨਾਂਵ", definitionPa: "ਬੋਲਣ ਵਾਲੇ, ਸੁਣਨ ਵਾਲੇ ਜਾਂ ਜਿਸ ਬਾਰੇ ਗੱਲ ਹੋ ਰਹੀ ਹੋਵੇ ਉਸ ਦੀ ਥਾਂ ਵਰਤਿਆ ਪੜਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "PD-02", category: "NIJJ", namePa: "ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ", definitionPa: "ਕਰਤਾ ਵੱਲ ਮੁੜ ਸੰਕੇਤ ਕਰਨ ਜਾਂ ਆਪਣੇ ਆਪ ਉੱਤੇ ਜ਼ੋਰ ਦੇਣ ਵਾਲਾ ਪੜਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "PD-03", category: "NISHCHAY", namePa: "ਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ", definitionPa: "ਕਿਸੇ ਨੇੜੀ ਜਾਂ ਦੂਰਲੀ ਵਸਤੂ ਜਾਂ ਵਿਅਕਤੀ ਵੱਲ ਨਿਸ਼ਚਿਤ ਸੰਕੇਤ ਕਰਨ ਵਾਲਾ ਪੜਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "PD-04", category: "ANISHCHAY", namePa: "ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ", definitionPa: "ਜਿਸ ਨਾਲ ਵਿਅਕਤੀ ਜਾਂ ਵਸਤੂ ਦੀ ਪਛਾਣ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਿਸ਼ਚਿਤ ਨਾ ਹੋਵੇ।", sourceStatus: "REVIEW_PENDING" },
  { id: "PD-05", category: "SAMBANDH", namePa: "ਸੰਬੰਧ-ਵਾਚਕ ਪੜਨਾਂਵ", definitionPa: "ਮੁੱਖ ਵਾਕ ਅਤੇ ਉਸ ਨਾਲ ਸੰਬੰਧਿਤ ਉਪਵਾਕ ਵਿਚ ਨਾਂਵ ਦੀ ਥਾਂ ਲੈ ਕੇ ਸੰਬੰਧ ਜੋੜਨ ਵਾਲਾ ਪੜਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
  { id: "PD-06", category: "PRASHAN", namePa: "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਪੜਨਾਂਵ", definitionPa: "ਵਿਅਕਤੀ ਜਾਂ ਵਸਤੂ ਬਾਰੇ ਪੁੱਛਣ ਲਈ ਨਾਂਵ ਦੀ ਥਾਂ ਵਰਤਿਆ ਪੜਨਾਂਵ।", sourceStatus: "REVIEW_PENDING" },
] as const;

export type CP003PronounRelation = "KARTA" | "KARAM" | "SAMBANDH" | "APADAN" | "SAATH";

export interface CP003PronounParadigm {
  id: string;
  labelPa: string;
  personPa: string;
  numberPa: "ਇਕ-ਵਚਨ" | "ਬਹੁ-ਵਚਨ";
  forms: Readonly<Record<CP003PronounRelation, string>>;
  sourceStatus: "REVIEW_PENDING";
}

export const CP003_PRONOUN_PARADIGMS: readonly CP003PronounParadigm[] = [
  { id: "PAR-01", labelPa: "ਮੈਂ", personPa: "ਉੱਤਮ ਪੁਰਖ", numberPa: "ਇਕ-ਵਚਨ", forms: { KARTA: "ਮੈਂ", KARAM: "ਮੈਨੂੰ", SAMBANDH: "ਮੇਰਾ / ਮੇਰੀ / ਮੇਰੇ", APADAN: "ਮੈਥੋਂ / ਮੇਰੇ ਤੋਂ", SAATH: "ਮੇਰੇ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
  { id: "PAR-02", labelPa: "ਅਸੀਂ", personPa: "ਉੱਤਮ ਪੁਰਖ", numberPa: "ਬਹੁ-ਵਚਨ", forms: { KARTA: "ਅਸੀਂ", KARAM: "ਸਾਨੂੰ", SAMBANDH: "ਸਾਡਾ / ਸਾਡੀ / ਸਾਡੇ", APADAN: "ਸਾਡੇ ਤੋਂ", SAATH: "ਸਾਡੇ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
  { id: "PAR-03", labelPa: "ਤੂੰ", personPa: "ਮੱਧਮ ਪੁਰਖ", numberPa: "ਇਕ-ਵਚਨ", forms: { KARTA: "ਤੂੰ", KARAM: "ਤੈਨੂੰ", SAMBANDH: "ਤੇਰਾ / ਤੇਰੀ / ਤੇਰੇ", APADAN: "ਤੈਥੋਂ / ਤੇਰੇ ਤੋਂ", SAATH: "ਤੇਰੇ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
  { id: "PAR-04", labelPa: "ਤੁਸੀਂ", personPa: "ਮੱਧਮ ਪੁਰਖ", numberPa: "ਬਹੁ-ਵਚਨ", forms: { KARTA: "ਤੁਸੀਂ", KARAM: "ਤੁਹਾਨੂੰ", SAMBANDH: "ਤੁਹਾਡਾ / ਤੁਹਾਡੀ / ਤੁਹਾਡੇ", APADAN: "ਤੁਹਾਡੇ ਤੋਂ", SAATH: "ਤੁਹਾਡੇ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
  { id: "PAR-05", labelPa: "ਇਹ (ਇਕ-ਵਚਨ)", personPa: "ਅੰਨਯ ਪੁਰਖ — ਨੇੜਲਾ", numberPa: "ਇਕ-ਵਚਨ", forms: { KARTA: "ਇਹ", KARAM: "ਇਸ ਨੂੰ", SAMBANDH: "ਇਸ ਦਾ / ਇਸ ਦੀ / ਇਸ ਦੇ", APADAN: "ਇਸ ਤੋਂ", SAATH: "ਇਸ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
  { id: "PAR-06", labelPa: "ਉਹ (ਇਕ-ਵਚਨ)", personPa: "ਅੰਨਯ ਪੁਰਖ — ਦੂਰਲਾ", numberPa: "ਇਕ-ਵਚਨ", forms: { KARTA: "ਉਹ", KARAM: "ਉਸ ਨੂੰ", SAMBANDH: "ਉਸ ਦਾ / ਉਸ ਦੀ / ਉਸ ਦੇ", APADAN: "ਉਸ ਤੋਂ", SAATH: "ਉਸ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
  { id: "PAR-07", labelPa: "ਇਹ (ਬਹੁ-ਵਚਨ)", personPa: "ਅੰਨਯ ਪੁਰਖ — ਨੇੜਲਾ", numberPa: "ਬਹੁ-ਵਚਨ", forms: { KARTA: "ਇਹ", KARAM: "ਇਨ੍ਹਾਂ ਨੂੰ", SAMBANDH: "ਇਨ੍ਹਾਂ ਦਾ / ਇਨ੍ਹਾਂ ਦੀ / ਇਨ੍ਹਾਂ ਦੇ", APADAN: "ਇਨ੍ਹਾਂ ਤੋਂ", SAATH: "ਇਨ੍ਹਾਂ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
  { id: "PAR-08", labelPa: "ਉਹ (ਬਹੁ-ਵਚਨ)", personPa: "ਅੰਨਯ ਪੁਰਖ — ਦੂਰਲਾ", numberPa: "ਬਹੁ-ਵਚਨ", forms: { KARTA: "ਉਹ", KARAM: "ਉਨ੍ਹਾਂ ਨੂੰ", SAMBANDH: "ਉਨ੍ਹਾਂ ਦਾ / ਉਨ੍ਹਾਂ ਦੀ / ਉਨ੍ਹਾਂ ਦੇ", APADAN: "ਉਨ੍ਹਾਂ ਤੋਂ", SAATH: "ਉਨ੍ਹਾਂ ਨਾਲ" }, sourceStatus: "REVIEW_PENDING" },
] as const;

export const CP003_PRONOUN_RELATION_NAMES: Readonly<Record<CP003PronounRelation, string>> = {
  KARTA: "ਕਰਤਾ-ਰੂਪ",
  KARAM: "ਕਰਮ/ਸੰਪਰਦਾਨ-ਰੂਪ",
  SAMBANDH: "ਸੰਬੰਧ-ਰੂਪ",
  APADAN: "ਤੋਂ-ਰੂਪ",
  SAATH: "ਨਾਲ-ਰੂਪ",
};

export const CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT = CP003_PRONOUN_PARADIGMS.length * 5;
