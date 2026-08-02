import type { ClsCp003LocalizedLocale } from "./cp003-localized-contracts";

export type ClsCp003LocalizedWordEntry = {
  readonly word: string;
  readonly primaryAffix: string;
  readonly sourceStatus: "CURATED_NATIVE";
};

export type ClsCp003LocalizedJumbleEntry = {
  readonly canonicalWord: string;
  readonly semanticClass: string;
  readonly sourceStatus: "CURATED_NATIVE";
};

type LocaleSource = {
  readonly generalWords: readonly string[];
  readonly palindromes: readonly string[];
  readonly affixGroups: Readonly<Record<string, readonly string[]>>;
  readonly jumbleClasses: Readonly<Record<string, readonly string[]>>;
};

const HINDI_SOURCE: LocaleSource = {
  generalWords: [
    "कमल", "कलम", "नगर", "सड़क", "घर", "खेत", "नदी", "पहाड़", "बादल", "सूरज", "चाँद", "तारा",
    "पानी", "आग", "हवा", "मिट्टी", "किताब", "कागज", "मेज", "कुर्सी", "स्कूल", "बच्चा", "लड़की", "लड़का",
    "माता", "पिता", "भाई", "बहन", "दोस्त", "राजा", "रानी", "हाथी", "घोड़ा", "बकरी", "गाय", "बिल्ली",
    "कुत्ता", "चिड़िया", "मोर", "कबूतर", "केला", "सेब", "आम", "अंगूर", "अमरूद", "आलू", "गाजर", "मूली",
    "टमाटर", "लाल", "हरा", "नीला", "काला", "पीला", "सफेद", "सुबह", "शाम", "रात", "दिन", "समय",
    "काम", "खेल", "गीत", "नाच", "फूल", "पत्ता", "पेड़", "जंगल", "बगीचा", "बाजार", "दुकान", "पैसा",
    "दूध", "चाय", "रोटी", "दाल", "चावल", "नमक", "चीनी", "सपना", "सच", "झूठ", "ज्ञान", "भाषा",
    "प्रश्न", "उत्तर", "लेख", "चित्र", "कहानी", "कविता", "मेहनत", "सफलता", "किसान", "वकील", "नाई",
    "दर्जी", "डॉक्टर", "हथौड़ा", "आरी", "फावड़ा", "चिमटा", "रंदा", "बाघ", "ऊँट", "खरगोश", "बंदर",
    "कौआ", "तोता", "चील", "कार", "बस", "रेल", "नाव", "जहाज", "कपड़ा", "जूता", "टोपी", "दरवाजा",
    "खिड़की", "दीवार", "छत", "गेंद", "पतंग", "घड़ी", "मोबाइल", "थैला", "कटोरी", "चम्मच", "थाली",
  ],
  palindromes: ["नयन", "नमन", "कनक", "जलज", "सरस", "नवन", "मलयालम"],
  affixGroups: {
    PREFIX_BE: ["बेकार", "बेईमान", "बेहोश", "बेरंग", "बेनाम", "बेसहारा"],
    PREFIX_AN: ["अनजान", "अनपढ़", "अनमोल", "अनदेखा", "अनसुना", "अनकहा"],
    PREFIX_SU: ["सुगंध", "सुविचार", "सुलेख", "सुपुत्र", "सुस्वादु", "सुव्यवस्थित"],
    SUFFIX_WALA: ["दूधवाला", "फलवाला", "चायवाला", "सब्जीवाला", "रिक्शावाला", "दुकानवाला"],
    SUFFIX_PAN: ["बचपन", "अपनापन", "बड़प्पन", "भोलापन", "लड़कपन", "पागलपन"],
    SUFFIX_DAR: ["ईमानदार", "समझदार", "जिम्मेदार", "मजेदार", "दमदार", "शानदार"],
  },
  jumbleClasses: {
    FRUIT: ["आम", "केला", "सेब", "अंगूर", "अमरूद"],
    VEGETABLE: ["आलू", "गाजर", "मूली", "टमाटर", "शलजम"],
    ANIMAL: ["बाघ", "घोड़ा", "ऊँट", "खरगोश", "बंदर"],
    BIRD: ["कौआ", "मोर", "कबूतर", "तोता", "चील"],
    COLOUR: ["लाल", "हरा", "नीला", "काला", "पीला"],
    TOOL: ["हथौड़ा", "आरी", "फावड़ा", "चिमटा", "रंदा"],
    PROFESSION: ["डॉक्टर", "किसान", "वकील", "नाई", "दर्जी"],
  },
};

const PUNJABI_SOURCE: LocaleSource = {
  generalWords: [
    "ਕਮਲ", "ਕਲਮ", "ਨਗਰ", "ਸੜਕ", "ਘਰ", "ਖੇਤ", "ਨਦੀ", "ਪਹਾੜ", "ਬੱਦਲ", "ਸੂਰਜ", "ਚੰਦ", "ਤਾਰਾ",
    "ਪਾਣੀ", "ਅੱਗ", "ਹਵਾ", "ਮਿੱਟੀ", "ਕਿਤਾਬ", "ਕਾਗਜ਼", "ਮੇਜ਼", "ਕੁਰਸੀ", "ਸਕੂਲ", "ਬੱਚਾ", "ਕੁੜੀ", "ਮੁੰਡਾ",
    "ਮਾਤਾ", "ਪਿਤਾ", "ਭਰਾ", "ਭੈਣ", "ਦੋਸਤ", "ਰਾਜਾ", "ਰਾਣੀ", "ਹਾਥੀ", "ਘੋੜਾ", "ਬੱਕਰੀ", "ਗਾਂ", "ਬਿੱਲੀ",
    "ਕੁੱਤਾ", "ਚਿੜੀ", "ਮੋਰ", "ਕਬੂਤਰ", "ਕੇਲਾ", "ਸੇਬ", "ਅੰਬ", "ਅੰਗੂਰ", "ਅਮਰੂਦ", "ਆਲੂ", "ਗਾਜਰ", "ਮੂਲੀ",
    "ਟਮਾਟਰ", "ਲਾਲ", "ਹਰਾ", "ਨੀਲਾ", "ਕਾਲਾ", "ਪੀਲਾ", "ਚਿੱਟਾ", "ਸਵੇਰ", "ਸ਼ਾਮ", "ਰਾਤ", "ਦਿਨ", "ਸਮਾਂ",
    "ਕੰਮ", "ਖੇਡ", "ਗੀਤ", "ਨਾਚ", "ਫੁੱਲ", "ਪੱਤਾ", "ਰੁੱਖ", "ਜੰਗਲ", "ਬਗੀਚਾ", "ਬਾਜ਼ਾਰ", "ਦੁਕਾਨ", "ਪੈਸਾ",
    "ਦੁੱਧ", "ਚਾਹ", "ਰੋਟੀ", "ਦਾਲ", "ਚੌਲ", "ਨਮਕ", "ਚੀਨੀ", "ਸੁਪਨਾ", "ਸੱਚ", "ਝੂਠ", "ਗਿਆਨ", "ਭਾਸ਼ਾ",
    "ਸਵਾਲ", "ਜਵਾਬ", "ਲੇਖ", "ਤਸਵੀਰ", "ਕਹਾਣੀ", "ਕਵਿਤਾ", "ਮਿਹਨਤ", "ਸਫਲਤਾ", "ਕਿਸਾਨ", "ਵਕੀਲ", "ਨਾਈ",
    "ਦਰਜ਼ੀ", "ਡਾਕਟਰ", "ਹਥੌੜਾ", "ਆਰੀ", "ਫਾਵੜਾ", "ਚਿਮਟਾ", "ਰੰਦਾ", "ਬਾਘ", "ਊਠ", "ਖਰਗੋਸ਼", "ਬਾਂਦਰ",
    "ਕਾਂ", "ਤੋਤਾ", "ਚੀਲ", "ਕਾਰ", "ਬੱਸ", "ਰੇਲ", "ਕਿਸ਼ਤੀ", "ਜਹਾਜ਼", "ਕੱਪੜਾ", "ਜੁੱਤਾ", "ਟੋਪੀ", "ਦਰਵਾਜ਼ਾ",
    "ਖਿੜਕੀ", "ਕੰਧ", "ਛੱਤ", "ਗੇਂਦ", "ਪਤੰਗ", "ਘੜੀ", "ਮੋਬਾਈਲ", "ਥੈਲਾ", "ਕੌਲੀ", "ਚਮਚਾ", "ਥਾਲੀ",
  ],
  palindromes: ["ਨਯਨ", "ਨਮਨ", "ਕਨਕ", "ਜਲਜ", "ਸਰਸ", "ਨਵਨ", "ਮਲਯਾਲਮ"],
  affixGroups: {
    PREFIX_BE: ["ਬੇਕਾਰ", "ਬੇਈਮਾਨ", "ਬੇਹੋਸ਼", "ਬੇਰੰਗ", "ਬੇਨਾਮ", "ਬੇਸਹਾਰਾ"],
    PREFIX_AN: ["ਅਣਜਾਣ", "ਅਣਪੜ੍ਹ", "ਅਣਮੋਲ", "ਅਣਦੇਖਾ", "ਅਣਸੁਣਿਆ", "ਅਣਕਿਹਾ"],
    SUFFIX_WALA: ["ਦੁੱਧਵਾਲਾ", "ਫਲਵਾਲਾ", "ਚਾਹਵਾਲਾ", "ਸਬਜ਼ੀਵਾਲਾ", "ਰਿਕਸ਼ਾਵਾਲਾ", "ਦੁਕਾਨਵਾਲਾ"],
    SUFFIX_PAN: ["ਬਚਪਨ", "ਆਪਣਾਪਨ", "ਵੱਡਾਪਨ", "ਭੋਲਾਪਨ", "ਲੜਕਪਨ", "ਪਾਗਲਪਨ"],
    SUFFIX_DAR: ["ਈਮਾਨਦਾਰ", "ਸਮਝਦਾਰ", "ਮਜ਼ੇਦਾਰ", "ਦਮਦਾਰ", "ਸ਼ਾਨਦਾਰ", "ਵਫ਼ਾਦਾਰ"],
  },
  jumbleClasses: {
    FRUIT: ["ਅੰਬ", "ਕੇਲਾ", "ਸੇਬ", "ਅੰਗੂਰ", "ਅਮਰੂਦ"],
    VEGETABLE: ["ਆਲੂ", "ਗਾਜਰ", "ਮੂਲੀ", "ਟਮਾਟਰ", "ਸ਼ਲਗਮ"],
    ANIMAL: ["ਬਾਘ", "ਘੋੜਾ", "ਊਠ", "ਖਰਗੋਸ਼", "ਬਾਂਦਰ"],
    BIRD: ["ਕਾਂ", "ਮੋਰ", "ਕਬੂਤਰ", "ਤੋਤਾ", "ਚੀਲ"],
    COLOUR: ["ਲਾਲ", "ਹਰਾ", "ਨੀਲਾ", "ਕਾਲਾ", "ਪੀਲਾ"],
    TOOL: ["ਹਥੌੜਾ", "ਆਰੀ", "ਫਾਵੜਾ", "ਚਿਮਟਾ", "ਰੰਦਾ"],
    PROFESSION: ["ਡਾਕਟਰ", "ਕਿਸਾਨ", "ਵਕੀਲ", "ਨਾਈ", "ਦਰਜ਼ੀ"],
  },
};

const SOURCE_BY_LOCALE: Readonly<Record<ClsCp003LocalizedLocale, LocaleSource>> = {
  "hi-IN": HINDI_SOURCE,
  "pa-IN": PUNJABI_SOURCE,
};

function buildWords(source: LocaleSource): readonly ClsCp003LocalizedWordEntry[] {
  const byWord = new Map<string, ClsCp003LocalizedWordEntry>();
  const add = (word: string, primaryAffix: string) => {
    byWord.set(word.normalize("NFC"), {
      word: word.normalize("NFC"),
      primaryAffix,
      sourceStatus: "CURATED_NATIVE",
    });
  };
  for (const word of source.generalWords) add(word, "NONE");
  for (const word of source.palindromes) add(word, "NONE");
  for (const [affixId, words] of Object.entries(source.affixGroups)) {
    for (const word of words) add(word, affixId);
  }
  return [...byWord.values()].sort((left, right) => left.word.localeCompare(right.word));
}

function buildJumbles(source: LocaleSource): readonly ClsCp003LocalizedJumbleEntry[] {
  return Object.entries(source.jumbleClasses).flatMap(([semanticClass, words]) =>
    words.map((canonicalWord) => ({
      canonicalWord: canonicalWord.normalize("NFC"),
      semanticClass,
      sourceStatus: "CURATED_NATIVE" as const,
    })),
  );
}

export const CLS_CP003_LOCALIZED_WORDS: Readonly<
  Record<ClsCp003LocalizedLocale, readonly ClsCp003LocalizedWordEntry[]>
> = {
  "hi-IN": buildWords(HINDI_SOURCE),
  "pa-IN": buildWords(PUNJABI_SOURCE),
};

export const CLS_CP003_LOCALIZED_JUMBLE_WORDS: Readonly<
  Record<ClsCp003LocalizedLocale, readonly ClsCp003LocalizedJumbleEntry[]>
> = {
  "hi-IN": buildJumbles(HINDI_SOURCE),
  "pa-IN": buildJumbles(PUNJABI_SOURCE),
};

export function getClsCp003LocalizedDatasetSummary(locale: ClsCp003LocalizedLocale) {
  const source = SOURCE_BY_LOCALE[locale];
  return {
    locale,
    wordCount: CLS_CP003_LOCALIZED_WORDS[locale].length,
    jumbleWordCount: CLS_CP003_LOCALIZED_JUMBLE_WORDS[locale].length,
    affixFamilyCount: Object.keys(source.affixGroups).length,
    semanticClassCount: Object.keys(source.jumbleClasses).length,
  } as const;
}
