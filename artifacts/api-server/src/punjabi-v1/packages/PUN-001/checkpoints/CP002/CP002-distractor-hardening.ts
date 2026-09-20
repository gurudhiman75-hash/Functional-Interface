import type { ExtendedSpellingCategory } from "./CP002-extended-types";

export interface HardenableSpellingAuthority {
  id: string;
  correct: string;
  incorrect: readonly [string, string, string];
  category: ExtendedSpellingCategory;
  explanationPa: string;
  contextPa?: string;
  provenance: "DONOR_CP002" | "DONOR_CP002_CURATED" | "EDITORIAL_CURATED";
  sourceStatus: "REVIEW_PENDING";
}

/**
 * Known valid Punjabi words / accepted lexical variants that must never be used
 * as a generic "wrong spelling" distractor. This is deliberately conservative:
 * a form may be valid in another meaning, register or accepted spelling tradition.
 * Sources consulted during review include Punjabi University / Punjabipedia
 * dictionaries and technical lexicons.
 */
export const CP002_KNOWN_VALID_DISTRACTOR_QUARANTINE = new Set<string>([
  "ਬੀਮਾਰੀ",
  "ਪੁਰਬ",
  "ਪਤਾ",
  "ਹਲ",
  "ਸਦਾ",
  "ਪਰਕਾਰ",
  "ਪ੍ਰਨਾਲੀ",
  "ਪਰਨਾਲੀ",
  "ਪਰਦੇਸ਼",
  "ਪ੍ਰਦੇਸ",
  "ਪਰਦੇਸ",
  "ਪ੍ਰੇਰਨਾ",
  "ਕਿਰਿਆ",
  "ਬ੍ਰਹਮੰਡ",
  "ਵਿਆਕਰਨ",
]);

const overrides: Readonly<Record<string, Partial<HardenableSpellingAuthority>>> = {
  // ਬੀਮਾਰੀ is attested as a valid form; replace the whole target with a safer item.
  "ED-W2-007": {
    correct: "ਗਤੀਵਿਧੀ",
    incorrect: ["ਗਤੀਵਿਧਿ", "ਗਤੀਵੀਧੀ", "ਗਤਿਵਿਧੀ"],
    category: "SIHARI_BIHARI",
    contextPa: "ਸਕੂਲ ਵਿੱਚ ਸੱਭਿਆਚਾਰਕ ਗਤੀਵਿਧੀ ਕਰਵਾਈ ਗਈ।",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਗਤੀਵਿਧੀ’ ਹੈ।",
  },
  // ਪੁਰਬ is a valid word meaning festival/occasion.
  "ED-W2-032": { incorrect: ["ਪੂਰੱਬ", "ਪੂੜਬ", "ਪੁਰੱਬ"] },
  // ਸਹਿ can function independently; keep the distractors orthographic-only.
  "ED-W2-072": { incorrect: ["ਸੈਹੀ", "ਸਹੀੰ", "ਸੇਹੀ"] },
  // ਪਤਾ is an independent valid word; replace the target with a cleaner addak item.
  "ED-W2-118": {
    correct: "ਮੱਛੀ",
    incorrect: ["ਮਛੀ", "ਮੱਛਿ", "ਮਛ੍ਛੀ"],
    category: "ADDAK_OMISSION",
    contextPa: "ਤਲਾਬ ਵਿੱਚ ਮੱਛੀ ਤੈਰ ਰਹੀ ਹੈ।",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਮੱਛੀ’ ਹੈ।",
  },
  // ਹਲ is a valid word (plough); replace the target rather than contrast lexemes.
  "ED-W2-134": {
    correct: "ਚਿੱਠੀ",
    incorrect: ["ਚਿਠੀ", "ਚਿੱਠਿ", "ਚੀਠੀ"],
    category: "ADDAK_OMISSION",
    contextPa: "ਉਸ ਨੇ ਘਰ ਚਿੱਠੀ ਭੇਜੀ।",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਚਿੱਠੀ’ ਹੈ।",
  },
  // ਸਦਾ is a valid adverb; replace ਸੱਦਾ with a cleaner addak target.
  "ED-W2-135": {
    correct: "ਮਿੱਟੀ",
    incorrect: ["ਮਿਟੀ", "ਮਿੱਟਿ", "ਮੀੱਟੀ"],
    category: "ADDAK_OMISSION",
    contextPa: "ਖੇਤ ਦੀ ਮਿੱਟੀ ਉਪਜਾਊ ਹੈ।",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਮਿੱਟੀ’ ਹੈ।",
  },
  // Punjabi University uses ਵਿਆਕਰਨ; avoid treating it as a wrong form.
  "ED-W2-180": {
    correct: "ਵਰਤਮਾਨ",
    incorrect: ["ਵਰਤਮਾਣ", "ਵਰਤਮਾਂਨ", "ਵਰਤਮਾਨਿ"],
    category: "VARG_CONFUSION",
    contextPa: "ਵਰਤਮਾਨ ਸਮੇਂ ਤਕਨਾਲੋਜੀ ਦੀ ਵਰਤੋਂ ਵਧ ਰਹੀ ਹੈ।",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਵਰਤਮਾਨ’ ਹੈ।",
  },
  // ਪਰਮਾਣ has historical/lexical use; keep this item strictly orthographic.
  "ED-W2-181": { incorrect: ["ਪ੍ਰਮਾਨ", "ਪ੍ਰਮਾਂਣ", "ਪ੍ਰਮਾਣਿ"] },

  // Cluster authorities: avoid decomposed forms that may be valid lexical variants.
  "ED-W2-193": { incorrect: ["ਪ੍ਰਕਾੜ", "ਪ੍ਰਕਰ", "ਪ੍ਰਕੌਰ"] },
  "ED-W2-194": { incorrect: ["ਪ੍ਰਯੌਗ", "ਪ੍ਰਯੂਗ", "ਪ੍ਰਯੋਗਿ"] },
  "ED-W2-195": { incorrect: ["ਪ੍ਰਯਾਸ਼", "ਪ੍ਰਯਸ", "ਪ੍ਰਿਆਸ"] },
  "ED-W2-196": { incorrect: ["ਪ੍ਰਸਤਾਉ", "ਪ੍ਰਸਤਵ", "ਪ੍ਰਸਤਾਂਵ"] },
  // ਪ੍ਰਨਾਲੀ / ਪਰਨਾਲੀ are independently attested; keep neither as a wrong spelling.
  "ED-W2-197": {
    correct: "ਪ੍ਰਬੰਧਕੀ",
    incorrect: ["ਪ੍ਰਬਂਧਕੀ", "ਪ੍ਰਬੰਧਕਿ", "ਪ੍ਰਬਨਧਕੀ"],
    category: "HALVANT_PAIRIN",
    contextPa: "ਦਫ਼ਤਰ ਦੀ ਪ੍ਰਬੰਧਕੀ ਜ਼ਿੰਮੇਵਾਰੀ ਉਸ ਨੂੰ ਦਿੱਤੀ ਗਈ।",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਪ੍ਰਬੰਧਕੀ’ ਹੈ।",
  },
  // ਪਰਦੇਸ਼ / ਪ੍ਰਦੇਸ are attested alternatives/lexemes.
  "ED-W2-198": { incorrect: ["ਪ੍ਰਦੈਸ਼", "ਪ੍ਰਦੇਸ਼ਿ", "ਪ੍ਰਦੀਸ਼"] },
  "ED-W2-199": { incorrect: ["ਪ੍ਰਾਚਿਨ", "ਪ੍ਰਾਚੀਣ", "ਪ੍ਰਚੀਨ"] },
  // ਪ੍ਰੇਰਨਾ is itself a Punjabi University dictionary headword.
  "ED-W2-200": { incorrect: ["ਪਰੇਰਣਾ", "ਪ੍ਰੈਰਣਾ", "ਪ੍ਰੇਰਿਣਾ"] },
  "ED-W2-201": { incorrect: ["ਪ੍ਰਮੁਖ਼", "ਪ੍ਰਮੁੱਖਿ", "ਪ੍ਰਮੂੱਖ"] },
  "ED-W2-202": { incorrect: ["ਪ੍ਰੌਗਰਾਮ", "ਪ੍ਰੋਗਰਾਂਮ", "ਪ੍ਰੋਗਰਮ"] },
  "ED-W2-203": { incorrect: ["ਕ੍ਰਾਂਤਿ", "ਕ੍ਰਾਂਥੀ", "ਕ੍ਰਾਂਟੀ"] },
  // Standard Punjabi grammar headword is ਕਿਰਿਆ, so do not make ਕ੍ਰਿਆ the target.
  "ED-W2-204": {
    correct: "ਪ੍ਰਸ਼ਾਸਕੀ",
    incorrect: ["ਪ੍ਰਸਾਸਕੀ", "ਪ੍ਰਸ਼ਾਸਕਿ", "ਪ੍ਰਸ਼ਾਸ਼ਕੀ"],
    category: "HALVANT_PAIRIN",
    contextPa: "ਇਹ ਪ੍ਰਸ਼ਾਸਕੀ ਹੁਕਮ ਸਾਰੇ ਦਫ਼ਤਰਾਂ ਲਈ ਲਾਗੂ ਹੈ।",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਪ੍ਰਸ਼ਾਸਕੀ’ ਹੈ।",
  },
  "ED-W2-205": { incorrect: ["ਤ੍ਰੀਕੋਣ", "ਤ੍ਰਿਕੋਨ", "ਤ੍ਰਿਕੌਣ"] },
  "ED-W2-206": { incorrect: ["ਤ੍ਰੀਭੁਜ", "ਤ੍ਰਿਭੂਜ", "ਤ੍ਰਿਭੁਜ਼"] },
  // ਬ੍ਰਹਮੰਡ is attested; it must not be labelled a misspelling of ਬ੍ਰਹਿਮੰਡ.
  "ED-W2-207": { incorrect: ["ਬ੍ਰਹੀਮੰਡ", "ਬ੍ਰਹਿਮੰੜ", "ਬ੍ਰਹਿਮਡ"] },
};

export function hardenCP002Authority<T extends HardenableSpellingAuthority>(authority: T): T {
  const patch = overrides[authority.id];
  if (!patch) return authority;
  return { ...authority, ...patch } as T;
}
