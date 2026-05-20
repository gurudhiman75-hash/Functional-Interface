import { COMMERCIAL_OBJECT_POOL } from "../editorial/commercial-object-pools";

export type SemanticLanguage = "en" | "hi" | "pa";

export type SemanticAnchorDomain =
  | "commercial"
  | "election"
  | "population"
  | "marks"
  | "mixture"
  | "expenditure"
  | "salary"
  | "relational"
  | "general";

export type SemanticAnchorEntry = {
  key: string;
  domain: SemanticAnchorDomain;
  entityType: string;
  unit?: string;
  en: string;
  hi: string;
  pa: string;
};

const COMMERCIAL_ANCHORS: SemanticAnchorEntry[] = COMMERCIAL_OBJECT_POOL.map(
  (item) => ({
    key: item.id,
    domain: "commercial",
    entityType: "product",
    unit: "₹",
    en: item.en,
    hi: item.hi,
    pa: item.pa,
  }),
);

export const ANCHOR_LEXICON: readonly SemanticAnchorEntry[] = [
  ...COMMERCIAL_ANCHORS,
  {
    key: "fuel",
    domain: "expenditure",
    entityType: "consumption_item",
    en: "fuel",
    hi: "ईंधन",
    pa: "ਈਂਧਨ",
  },
  {
    key: "votes",
    domain: "election",
    entityType: "vote_count",
    en: "votes",
    hi: "वोट",
    pa: "ਵੋਟ",
  },
  {
    key: "winning_candidate",
    domain: "election",
    entityType: "candidate",
    en: "winning candidate",
    hi: "विजयी उम्मीदवार",
    pa: "ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ",
  },
  {
    key: "valid_votes",
    domain: "election",
    entityType: "vote_count",
    en: "valid votes",
    hi: "वैध वोट",
    pa: "ਯੋਗ ਵੋਟ",
  },
  {
    key: "population",
    domain: "population",
    entityType: "count",
    en: "population",
    hi: "जनसंख्या",
    pa: "ਆਬਾਦੀ",
  },
  {
    key: "marks",
    domain: "marks",
    entityType: "score",
    en: "marks",
    hi: "अंक",
    pa: "ਅੰਕ",
  },
  {
    key: "milk_water_mixture",
    domain: "mixture",
    entityType: "mixture",
    en: "milk-water mixture",
    hi: "दूध-पानी मिश्रण",
    pa: "ਦੁੱਧ-ਪਾਣੀ ਮਿਸ਼ਰਣ",
  },
  {
    key: "salary",
    domain: "salary",
    entityType: "currency_amount",
    unit: "₹",
    en: "salary",
    hi: "वेतन",
    pa: "ਤਨਖਾਹ",
  },
  {
    key: "income",
    domain: "relational",
    entityType: "currency_amount",
    unit: "₹",
    en: "income",
    hi: "आय",
    pa: "ਆਮਦਨ",
  },
];

export function anchorText(key: string | undefined, language: SemanticLanguage) {
  return ANCHOR_LEXICON.find((entry) => entry.key === key)?.[language];
}

export function anchorEntry(key: string | undefined) {
  return ANCHOR_LEXICON.find((entry) => entry.key === key);
}

export function detectAnchorKeys(
  text: string | undefined,
  language: SemanticLanguage,
) {
  const value = String(text ?? "");
  const normalized = language === "en" ? value.toLowerCase() : value;
  const keys: string[] = [];

  for (const entry of ANCHOR_LEXICON) {
    const phrase = entry[language];
    if (!phrase) continue;
    const haystack = language === "en" ? normalized : value;
    const needle = language === "en" ? phrase.toLowerCase() : phrase;
    if (haystack.includes(needle)) {
      keys.push(entry.key);
    }
  }

  return [...new Set(keys)];
}

export function detectCommercialAnchorKeyFromEnglish(text: string | undefined) {
  const keys = detectAnchorKeys(text, "en");
  return keys.find((key) => anchorEntry(key)?.domain === "commercial");
}

