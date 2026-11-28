import { MENSURATION_NATIVE_STEM_TEMPLATES_V1 } from "./mensuration-native-stem-templates-v1";

export type MensurationNativeStemLanguage = "hi" | "pa";

/**
 * Hindi/Punjabi stems used to be produced by swapping English words and phrases inside the English stem.
 * That kept English word order ("क्या है उसका त्रिज्या?") and left English words behind.
 *
 * Native stems replace that for every pattern that has a reviewed template: the numbers and
 * math tokens are pulled out of the English stem by position, then dropped into a template written
 * natively in Hindi or Punjabi. Patterns without a template still use the old path.
 */
const UNIT = String.raw`(?:\s?(?:cm|mm|km|m|litres?|liters?|kg|g)(?:\^?[23]|[²³])?(?![A-Za-z]))`;
const SLOT_PATTERN = new RegExp(
  [
    String.raw`\$[^$]+\$`,
    String.raw`π\s*=\s*\d+(?:\.\d+)?(?:/\d+)?`,
    String.raw`₹\s?\d+(?:,\d{2,3})*(?:\.\d+)?`,
    String.raw`\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)+`,
    String.raw`\d+(?:,\d{3})*(?:\.\d+)?(?:/\d+(?:,\d{3})*)?(?:[√π]\d*)*(?:%|°)?${UNIT}?`,
    String.raw`(?<=per )(?:square )?(?:metre|meter|cm|m)(?:[²³])?`,
  ].join("|"),
  "g",
);

const SLOT_WORDS: Record<MensurationNativeStemLanguage, ReadonlyArray<readonly [RegExp, string]>> = {
  hi: [
    [/\bsquare (?:metre|meter)s?\b/, "वर्ग मीटर"],
    [/\b(?:metre|meter)s?\b/, "मीटर"],
    [/\b(?:litre|liter)s?\b/, "लीटर"],
  ],
  pa: [
    [/\bsquare (?:metre|meter)s?\b/, "ਵਰਗ ਮੀਟਰ"],
    [/\b(?:metre|meter)s?\b/, "ਮੀਟਰ"],
    [/\b(?:litre|liter)s?\b/, "ਲੀਟਰ"],
  ],
};

export function localizeMensurationSlotWordsV1(value: string, language: MensurationNativeStemLanguage) {
  let out = value;
  for (const [pattern, replacement] of SLOT_WORDS[language]) out = out.replace(pattern, replacement);
  return out;
}

export function extractMensurationStemSlotsV1(stem: string): string[] {
  return [...stem.matchAll(SLOT_PATTERN)].map((match) => match[0]);
}

export function mensurationNativeStemKeyV1(patternId: string, slotCount: number) {
  return `${patternId}#${slotCount}`;
}

export function hasMensurationNativeStemV1(patternId: string, slotCount: number) {
  return Object.prototype.hasOwnProperty.call(
    MENSURATION_NATIVE_STEM_TEMPLATES_V1,
    mensurationNativeStemKeyV1(patternId, slotCount),
  );
}

/** Returns the native stem, or null when this pattern/shape has no reviewed template yet. */
export function renderMensurationNativeStemV1(
  patternId: string,
  englishStem: string,
  language: MensurationNativeStemLanguage,
): string | null {
  const slots = extractMensurationStemSlotsV1(englishStem);
  const key = mensurationNativeStemKeyV1(patternId, slots.length);
  const entry = MENSURATION_NATIVE_STEM_TEMPLATES_V1[key];
  if (!entry) return null;
  const template = language === "hi" ? entry[0] : entry[1];
  let missing = false;
  const rendered = template.replace(/\{(\d+)\}/g, (_match, index: string) => {
    const value = slots[Number(index) - 1];
    if (value === undefined) {
      missing = true;
      return "";
    }
    return localizeMensurationSlotWordsV1(value, language);
  });
  return missing ? null : rendered;
}
