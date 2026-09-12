/**
 * CP006: Verbs, Tenses & Aspects (ਕਿਰਿਆ, ਕਾਲ ਅਤੇ ਰੂਪਾਂਤਰਣ)
 * Curated knowledge base of verbal classes, tenses, causatives, transitivity, and aspectual forms in Punjabi.
 */

export interface VerbSentenceItem {
  readonly sentence: string;
  readonly verbPhrase: string;
  readonly mainVerb: string;
  readonly auxiliaryVerb?: string;
  readonly verbType: "AKARMAK" | "SAKARMAK";
  readonly tense: "VARATMAN" | "BHOOT" | "BHAVIKHAT";
  readonly explanationPa: string;
  readonly directObject?: string;
}

export interface TenseShiftPair {
  readonly baseSentence: string;
  readonly targetTense: "ਵਰਤਮਾਨ ਕਾਲ" | "ਭੂਤਕਾਲ" | "ਭਵਿੱਖਤ ਕਾਲ";
  readonly convertedSentence: string;
  readonly distractors: readonly string[];
  readonly explanationPa: string;
}

export interface TransitivityConversionItem {
  readonly intransitive: string;
  readonly transitive: string;
  readonly explanationPa: string;
  readonly distractors: readonly string[];
}

export interface CompoundVerbItem {
  readonly sentence: string;
  readonly compoundVerb: string;
  readonly mainVerb: string;
  readonly sanchalakVerb: string;
  readonly explanationPa: string;
}

export interface AspectSentenceItem {
  readonly sentence: string;
  readonly aspectCategory: "ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ" | "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)" | "ਪੂਰਨ ਪੱਖ" | "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ";
  readonly aspectTense: string;
  readonly verbPhrase: string;
  readonly explanationPa: string;
  readonly distractors: readonly string[];
}

export interface DhatuItem {
  readonly verb: string;
  readonly root: string;
  readonly distractors: readonly string[];
}

export interface PreranarthakItem {
  readonly base: string;
  readonly first: string;
  readonly second: string;
}

export const VERB_SENTENCE_ITEMS: readonly VerbSentenceItem[] = [
  {
    "sentence": "ਛੋਟਾ ਬੱਚਾ ਉੱਚੀ-ਉੱਚੀ ਹੱਸਦਾ ਹੈ।",
    "verbPhrase": "ਹੱਸਦਾ ਹੈ",
    "mainVerb": "ਹੱਸਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ, ਕਿਰਿਆ ਦਾ ਫਲ ਸਿੱਧਾ ਕਰਤਾ (ਬੱਚਾ) 'ਤੇ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ‘ਅਕਰਮਕ ਕਿਰਿਆ’ ਹੈ।"
  },
  {
    "sentence": "ਸਵੇਰ ਵੇਲੇ ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਡਦੇ ਹਨ।",
    "verbPhrase": "ਉੱਡਦੇ ਹਨ",
    "mainVerb": "ਉੱਡਦੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਕਿਰਿਆ ‘ਉੱਡਦੇ ਹਨ’ ਕਰਮ ਰਹਿਤ ਹੈ, ਇਸ ਲਈ ਇਹ ‘ਅਕਰਮਕ ਕਿਰਿਆ’ ਹੈ।"
  },
  {
    "sentence": "ਮਰੀਜ਼ ਹਸਪਤਾਲ ਵਿੱਚ ਸੌਂ ਰਿਹਾ ਸੀ।",
    "verbPhrase": "ਸੌਂ ਰਿਹਾ ਸੀ",
    "mainVerb": "ਸੌਂ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਇਸ ਵਿੱਚ ਸੌਣ ਦਾ ਕੰਮ ਕਰਤਾ ਤੱਕ ਸੀਮਤ ਹੈ, ਇਸ ਲਈ ‘ਅਕਰਮਕ ਕਿਰਿਆ’ ਹੈ ਅਤੇ ਕਾਲ ‘ਭੂਤਕਾਲ’ ਹੈ।"
  },
  {
    "sentence": "ਸੂਰਜ ਸ਼ਾਮ ਨੂੰ ਪੱਛਮ ਵਿੱਚ ਡੁੱਬੇਗਾ।",
    "verbPhrase": "ਡੁੱਬੇਗਾ",
    "mainVerb": "ਡੁੱਬੇਗਾ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਡੁੱਬੇਗਾ’ ਭਵਿੱਖ ਵਿੱਚ ਵਾਪਰਨ ਵਾਲੀ ਅਕਰਮਕ ਕਿਰਿਆ (ਭਵਿੱਖਤ ਕਾਲ) ਹੈ।"
  },
  {
    "sentence": "ਨਦੀ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਤੇਜ਼ੀ ਨਾਲ ਵਗਦੀ ਹੈ।",
    "verbPhrase": "ਵਗਦੀ ਹੈ",
    "mainVerb": "ਵਗਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਵਗਦੀ ਹੈ’ ਕਰਮ ਰਹਿਤ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਖਿਡਾਰੀ ਮੈਦਾਨ ਦੇ ਦੁਆਲੇ ਤੇਜ਼ ਦੌੜਿਆ।",
    "verbPhrase": "ਦੌੜਿਆ",
    "mainVerb": "ਦੌੜਿਆ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਦੌੜਨ ਦੀ ਕਿਰਿਆ ਦਾ ਪ੍ਰਭਾਵ ਕਰਤਾ 'ਤੇ ਹੀ ਰਹਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ (ਭੂਤਕਾਲ) ਹੈ।"
  },
  {
    "sentence": "ਮਹਿਮਾਨ ਕੱਲ੍ਹ ਸਵੇਰੇ ਵਾਪਸ ਮੁੜਨਗੇ।",
    "verbPhrase": "ਮੁੜਨਗੇ",
    "mainVerb": "ਮੁੜਨਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਕਿਰਿਆ ਵਿੱਚ ਕਰਮ ਨਹੀਂ ਹੈ, ਇਹ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਕਮਰੇ ਵਿੱਚ ਹਨੇਰਾ ਹੋਣ ਕਾਰਨ ਬੱਚਾ ਡਰ ਗਿਆ।",
    "verbPhrase": "ਡਰ ਗਿਆ",
    "mainVerb": "ਡਰ ਗਿਆ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਡਰਨ ਦੀ ਅਵਸਥਾ ਕਰਤਾ ਦੀ ਆਪਣੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬਸੰਤ ਰੁੱਤ ਵਿੱਚ ਫੁੱਲ ਖਿੜਦੇ ਹਨ।",
    "verbPhrase": "ਖਿੜਦੇ ਹਨ",
    "mainVerb": "ਖਿੜਦੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਖਿੜਨਾ ਕਰਮ ਰਹਿਤ ਕਿਰਿਆ ਹੋਣ ਕਾਰਨ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪ੍ਰੋਗਰਾਮ ਵੇਲੇ ਸਾਰੇ ਦਰਸ਼ਕ ਹੱਸ ਪਏ।",
    "verbPhrase": "ਹੱਸ ਪਏ",
    "mainVerb": "ਹੱਸ ਪਏ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਹੱਸਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਫੁੱਟਬਾਲ ਖੇਡਦਾ ਹੈ।",
    "verbPhrase": "ਖੇਡਦਾ ਹੈ",
    "mainVerb": "ਖੇਡਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਵਾਕ ਵਿੱਚ ‘ਫੁੱਟਬਾਲ’ ਕਰਮ (Object) ਮੌਜੂਦ ਹੈ, ਇਸ ਲਈ ਇਹ ‘ਸਕਰਮਕ ਕਿਰਿਆ’ ਹੈ।",
    "directObject": "ਫੁੱਟਬਾਲ"
  },
  {
    "sentence": "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੰਜਾਬੀ ਪੜ੍ਹਾਉਂਦਾ ਸੀ।",
    "verbPhrase": "ਪੜ੍ਹਾਉਂਦਾ ਸੀ",
    "mainVerb": "ਪੜ੍ਹਾਉਂਦਾ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਪੰਜਾਬੀ’ ਕਰਮ ਹੈ ਅਤੇ ਕਿਰਿਆ ਬੀਤੇ ਸਮੇਂ ਦੀ ਹੋਣ ਕਾਰਨ ‘ਸਕਰਮਕ ਕਿਰਿਆ (ਭੂਤਕਾਲ)’ ਹੈ।",
    "directObject": "ਪੰਜਾਬੀ"
  },
  {
    "sentence": "ਕਿਸਾਨ ਖੇਤਾਂ ਵਿੱਚ ਕਣਕ ਬੀਜੇਗਾ।",
    "verbPhrase": "ਬੀਜੇਗਾ",
    "mainVerb": "ਬੀਜੇਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਕਿਰਿਆ ਦਾ ਫਲ ‘ਕਣਕ’ (ਕਰਮ) 'ਤੇ ਪੈਂਦਾ ਹੈ ਅਤੇ ਇਹ ਆਉਣ ਵਾਲੇ ਸਮੇਂ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ (ਸਕਰਮਕ ਕਿਰਿਆ, ਭਵਿੱਖਤ ਕਾਲ)।",
    "directObject": "ਕਣਕ"
  },
  {
    "sentence": "ਕੁੜੀ ਨੇ ਸੁਰੀਲਾ ਗੀਤ ਗਾਇਆ।",
    "verbPhrase": "ਗਾਇਆ",
    "mainVerb": "ਗਾਇਆ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਵਾਕ ਵਿੱਚ ‘ਗੀਤ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ‘ਗਾਇਆ’ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਗੀਤ"
  },
  {
    "sentence": "ਲੇਖਕ ਨੇ ਨਵਾਂ ਨਾਵਲ ਲਿਖਿਆ।",
    "verbPhrase": "ਲਿਖਿਆ",
    "mainVerb": "ਲਿਖਿਆ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਨਾਵਲ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਨਾਵਲ"
  },
  {
    "sentence": "ਸਰਪੰਚ ਨੇ ਪਿੰਡ ਵਿੱਚ ਨਵੀਂ ਲਾਇਬ੍ਰੇਰੀ ਖੋਲ੍ਹੀ।",
    "verbPhrase": "ਖੋਲ੍ਹੀ",
    "mainVerb": "ਖੋਲ੍ਹੀ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਲਾਇਬ੍ਰੇਰੀ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ਸਕਰਮਕ ਹੈ।",
    "directObject": "ਲਾਇਬ੍ਰੇਰੀ"
  },
  {
    "sentence": "ਦਰਜ਼ੀ ਸੁੰਦਰ ਕੱਪੜੇ ਸਿਉਂਦਾ ਹੈ।",
    "verbPhrase": "ਸਿਉਂਦਾ ਹੈ",
    "mainVerb": "ਸਿਉਂਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਕੱਪੜੇ’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਕੱਪੜੇ"
  },
  {
    "sentence": "ਮਾਲੀ ਸਵੇਰੇ ਫੁੱਲ ਤੋੜੇਗਾ।",
    "verbPhrase": "ਤੋੜੇਗਾ",
    "mainVerb": "ਤੋੜੇਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਫੁੱਲ’ ਕਰਮ ਹੈ ਅਤੇ ਕਿਰਿਆ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਫੁੱਲ"
  },
  {
    "sentence": "ਬੱਚੇ ਮਨਪਸੰਦ ਕਹਾਣੀ ਸੁਣ ਰਹੇ ਹਨ।",
    "verbPhrase": "ਸੁਣ ਰਹੇ ਹਨ",
    "mainVerb": "ਸੁਣ ਰਹੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਕਹਾਣੀ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਕਹਾਣੀ"
  },
  {
    "sentence": "ਵਿਗਿਆਨੀ ਨਵੀਂ ਦਵਾਈ ਤਿਆਰ ਕਰਨਗੇ।",
    "verbPhrase": "ਤਿਆਰ ਕਰਨਗੇ",
    "mainVerb": "ਤਿਆਰ ਕਰਨਗੇ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਦਵਾਈ’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ (ਭਵਿੱਖਤ ਕਾਲ) ਹੈ।",
    "directObject": "ਦਵਾਈ"
  },
  {
    "sentence": "ਮੀਂਹ ਤੇਜ਼ੀ ਨਾਲ ਵਰ੍ਹ ਰਿਹਾ ਹੈ।",
    "verbPhrase": "ਵਰ੍ਹ ਰਿਹਾ ਹੈ",
    "mainVerb": "ਵਰ੍ਹ ਰਿਹਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਮੀਂਹ ਪੈਣ ਦੀ ਕਿਰਿਆ ਕਰਮ-ਰਹਿਤ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪੱਤੇ ਰੁੱਖਾਂ ਤੋਂ ਹੇਠਾਂ ਡਿੱਗਦੇ ਹਨ।",
    "verbPhrase": "ਡਿੱਗਦੇ ਹਨ",
    "mainVerb": "ਡਿੱਗਦੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਡਿੱਗਣ ਦਾ ਕਾਰਜ ਕਰਤਾ ਤੱਕ ਹੀ ਸੀਮਤ ਹੈ, ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬੁੱਢਾ ਆਦਮੀ ਹੌਲੀ-ਹੌਲੀ ਤੁਰਦਾ ਸੀ।",
    "verbPhrase": "ਤੁਰਦਾ ਸੀ",
    "mainVerb": "ਤੁਰਦਾ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਤੁਰਨਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਕਾਲ ਭੂਤਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਮੇਲੇ ਵਿੱਚ ਬਹੁਤ ਰੌਲਾ ਪਵੇਗਾ।",
    "verbPhrase": "ਪਵੇਗਾ",
    "mainVerb": "ਪਵੇਗਾ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਪਵੇਗਾ’ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਘੋੜਾ ਅਸਤਬਲ ਵਿੱਚ ਖੜ੍ਹਾ ਹੈ।",
    "verbPhrase": "ਖੜ੍ਹਾ ਹੈ",
    "mainVerb": "ਖੜ੍ਹਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਖੜ੍ਹੇ ਹੋਣਾ ਸਥਿਤੀ-ਸੂਚਕ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਚੋਰ ਪੁਲਿਸ ਨੂੰ ਵੇਖ ਕੇ ਭੱਜ ਗਿਆ।",
    "verbPhrase": "ਭੱਜ ਗਿਆ",
    "mainVerb": "ਭੱਜ ਗਿਆ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਭੱਜਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਸਮਾਂ ਬੀਤ ਚੁੱਕਾ (ਭੂਤਕਾਲ) ਹੈ।"
  },
  {
    "sentence": "ਕੱਲ੍ਹ ਸਕੂਲ ਵਿੱਚ ਛੁੱਟੀ ਹੋਵੇਗੀ।",
    "verbPhrase": "ਹੋਵੇਗੀ",
    "mainVerb": "ਹੋਵੇਗੀ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਹੋਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਇਹ ਭਵਿੱਖਤ ਕਾਲ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।"
  },
  {
    "sentence": "ਛੋਟੀ ਬੱਚੀ ਉੱਚੀ-ਉੱਚੀ ਰੋਈ।",
    "verbPhrase": "ਰੋਈ",
    "mainVerb": "ਰੋਈ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਰੋਣਾ ਕਰਮ-ਰਹਿਤ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪਾਣੀ ਬਰਫ਼ ਬਣ ਕੇ ਜੰਮਦਾ ਹੈ।",
    "verbPhrase": "ਜੰਮਦਾ ਹੈ",
    "mainVerb": "ਜੰਮਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਜੰਮਣਾ ਸੁਭਾਵਿਕ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਾਰੇ ਵਿਦਿਆਰਥੀ ਸ਼ਾਂਤ ਬੈਠਣਗੇ।",
    "verbPhrase": "ਬੈਠਣਗੇ",
    "mainVerb": "ਬੈਠਣਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਬੈਠਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਕਾਲ ਭਵਿੱਖਤ ਹੈ।"
  },
  {
    "sentence": "ਮਾਂ ਨੇ ਸੁਆਦੀ ਖੀਰ ਬਣਾਈ।",
    "verbPhrase": "ਬਣਾਈ",
    "mainVerb": "ਬਣਾਈ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਵਾਕ ਵਿੱਚ ‘ਖੀਰ’ ਕਰਮ (Object) ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਖੀਰ"
  },
  {
    "sentence": "ਡਾਕਟਰ ਮਰੀਜ਼ ਦੀ ਨਬਜ਼ ਵੇਖਦਾ ਹੈ।",
    "verbPhrase": "ਵੇਖਦਾ ਹੈ",
    "mainVerb": "ਵੇਖਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਨਬਜ਼’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਨਬਜ਼"
  },
  {
    "sentence": "ਧੋਬੀ ਤਲਾਬ ਕੰਢੇ ਕੱਪੜੇ ਧੋਵੇਗਾ।",
    "verbPhrase": "ਧੋਵੇਗਾ",
    "mainVerb": "ਧੋਵੇਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਕੱਪੜੇ’ ਕਰਮ ਹੈ ਅਤੇ ਕਿਰਿਆ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਕੱਪੜੇ"
  },
  {
    "sentence": "ਕਿਸਾਨ ਟਰੈਕਟਰ ਨਾਲ ਖੇਤ ਵਾਹੁੰਦਾ ਹੈ।",
    "verbPhrase": "ਵਾਹੁੰਦਾ ਹੈ",
    "mainVerb": "ਵਾਹੁੰਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਖੇਤ’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਖੇਤ"
  },
  {
    "sentence": "ਬੱਚੇ ਦੁੱਧ ਪੀ ਰਹੇ ਹਨ।",
    "verbPhrase": "ਪੀ ਰਹੇ ਹਨ",
    "mainVerb": "ਪੀ ਰਹੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਦੁੱਧ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਦੁੱਧ"
  },
  {
    "sentence": "ਮਿਸਤਰੀ ਨੇ ਨਵਾਂ ਮਕਾਨ ਬਣਾਇਆ।",
    "verbPhrase": "ਬਣਾਇਆ",
    "mainVerb": "ਬਣਾਇਆ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਮਕਾਨ’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਮਕਾਨ"
  },
  {
    "sentence": "ਸਿਪਾਹੀ ਨੇ ਚੋਰ ਨੂੰ ਫੜ ਲਿਆ।",
    "verbPhrase": "ਫੜ ਲਿਆ",
    "mainVerb": "ਫੜ ਲਿਆ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਚੋਰ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਚੋਰ"
  },
  {
    "sentence": "ਵਿਦਿਆਰਥੀ ਇਮਤਿਹਾਨ ਦੇਣਗੇ।",
    "verbPhrase": "ਦੇਣਗੇ",
    "mainVerb": "ਦੇਣਗੇ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਇਮਤਿਹਾਨ’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਇਹ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਇਮਤਿਹਾਨ"
  },
  {
    "sentence": "ਮੋਚੀ ਜੁੱਤੀਆਂ ਗੰਢਦਾ ਸੀ।",
    "verbPhrase": "ਗੰਢਦਾ ਸੀ",
    "mainVerb": "ਗੰਢਦਾ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਜੁੱਤੀਆਂ’ ਕਰਮ ਹੈ ਅਤੇ ਸਮਾਂ ਭੂਤਕਾਲ ਹੈ।",
    "directObject": "ਜੁੱਤੀਆਂ"
  },
  {
    "sentence": "ਲੜਕੀ ਕੰਧ ਉੱਤੇ ਤਸਵੀਰ ਟੰਗੇਗੀ।",
    "verbPhrase": "ਟੰਗੇਗੀ",
    "mainVerb": "ਟੰਗੇਗੀ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਤਸਵੀਰ’ ਕਰਮ ਹੋਣ ਕਰਕੇ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਤਸਵੀਰ"
  },
  {
    "sentence": "ਚਿੜੀਆਂ ਰੁੱਖਾਂ 'ਤੇ ਚਹਿਕਦੀਆਂ ਹਨ।",
    "verbPhrase": "ਚਹਿਕਦੀਆਂ ਹਨ",
    "mainVerb": "ਚਹਿਕਦੀਆਂ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਚਹਿਕਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਕਿਉਂਕਿ ਇਸ ਵਿੱਚ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ।"
  },
  {
    "sentence": "ਮੁਸਾਫ਼ਿਰ ਛਾਂ ਹੇਠ ਆਰਾਮ ਕਰੇਗਾ।",
    "verbPhrase": "ਆਰਾਮ ਕਰੇਗਾ",
    "mainVerb": "ਆਰਾਮ ਕਰੇਗਾ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਆਰਾਮ ਕਰਨਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਕਾਲ ਭਵਿੱਖਤ ਹੈ।"
  },
  {
    "sentence": "ਸਿਆਣਾ ਬੰਦਾ ਸਦਾ ਸੱਚ ਬੋਲਦਾ ਹੈ।",
    "verbPhrase": "ਬੋਲਦਾ ਹੈ",
    "mainVerb": "ਬੋਲਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਸੱਚ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਸੱਚ"
  },
  {
    "sentence": "ਕੁੱਤਾ ਰਾਤ ਨੂੰ ਉੱਚੀ ਭੌਂਕਦਾ ਸੀ।",
    "verbPhrase": "ਭੌਂਕਦਾ ਸੀ",
    "mainVerb": "ਭੌਂਕਦਾ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਭੌਂਕਣਾ ਕਰਮ-ਰਹਿਤ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪਾਣੀ ਉਬਲ ਰਿਹਾ ਹੈ।",
    "verbPhrase": "ਉਬਲ ਰਿਹਾ ਹੈ",
    "mainVerb": "ਉਬਲ ਰਿਹਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਉਬਲਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਾਰੇ ਬੱਚੇ ਸਮੇਂ ਸਿਰ ਪਹੁੰਚਣਗੇ।",
    "verbPhrase": "ਪਹੁੰਚਣਗੇ",
    "mainVerb": "ਪਹੁੰਚਣਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਪਹੁੰਚਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬਜ਼ੁਰਗ ਸੋਟੀ ਦੇ ਸਹਾਰੇ ਚੱਲਦਾ ਸੀ।",
    "verbPhrase": "ਚੱਲਦਾ ਸੀ",
    "mainVerb": "ਚੱਲਦਾ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਚੱਲਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਫੁੱਲ ਸੂਰਜ ਦੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਖਿੜਨਗੇ।",
    "verbPhrase": "ਖਿੜਨਗੇ",
    "mainVerb": "ਖਿੜਨਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਖਿੜਨਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਗੱਡੀ ਰੇਲਵੇ ਸਟੇਸ਼ਨ 'ਤੇ ਰੁਕੀ।",
    "verbPhrase": "ਰੁਕੀ",
    "mainVerb": "ਰੁਕੀ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਰੁਕਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਠੰਢੀ ਹਵਾ ਹੌਲੀ-ਹੌਲੀ ਵਗਦੀ ਹੈ।",
    "verbPhrase": "ਵਗਦੀ ਹੈ",
    "mainVerb": "ਵਗਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਹਵਾ ਦਾ ਵਗਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਾਸਟਰ ਜੀ ਨੇ ਬੱਚਿਆਂ ਨੂੰ ਸਵਾਲ ਪੁੱਛਿਆ।",
    "verbPhrase": "ਪੁੱਛਿਆ",
    "mainVerb": "ਪੁੱਛਿਆ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਸਵਾਲ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਸਵਾਲ"
  },
  {
    "sentence": "ਕੁੜੀ ਮੇਜ਼ ਉੱਤੇ ਦੀਵਾ ਜਗਾਉਂਦੀ ਹੈ।",
    "verbPhrase": "ਜਗਾਉਂਦੀ ਹੈ",
    "mainVerb": "ਜਗਾਉਂਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਦੀਵਾ’ ਕਰਮ ਹੋਣ ਕਰਕੇ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਦੀਵਾ"
  },
  {
    "sentence": "ਮਜ਼ਦੂਰ ਵੱਡੇ ਪੱਥਰ ਤੋੜਨਗੇ।",
    "verbPhrase": "ਤੋੜਨਗੇ",
    "mainVerb": "ਤੋੜਨਗੇ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਪੱਥਰ’ ਕਰਮ ਹੈ ਅਤੇ ਕਿਰਿਆ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਹੈ।",
    "directObject": "ਪੱਥਰ"
  },
  {
    "sentence": "ਕਵਿੱਤਰੀ ਨੇ ਸੁੰਦਰ ਕਵਿਤਾ ਸੁਣਾਈ।",
    "verbPhrase": "ਸੁਣਾਈ",
    "mainVerb": "ਸੁਣਾਈ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਕਵਿਤਾ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਕਵਿਤਾ"
  },
  {
    "sentence": "ਭਰਾ ਨੇ ਭੈਣ ਨੂੰ ਤੋਹਫ਼ਾ ਦਿੱਤਾ।",
    "verbPhrase": "ਦਿੱਤਾ",
    "mainVerb": "ਦਿੱਤਾ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਤੋਹਫ਼ਾ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਤੋਹਫ਼ਾ"
  },
  {
    "sentence": "ਕੁੜੀਆਂ ਸਵੇਰੇ ਰੰਗੋਲੀ ਬਣਾਉਣਗੀਆਂ।",
    "verbPhrase": "ਬਣਾਉਣਗੀਆਂ",
    "mainVerb": "ਬਣਾਉਣਗੀਆਂ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਰੰਗੋਲੀ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਰੰਗੋਲੀ"
  },
  {
    "sentence": "ਮਾਂ ਰਸੋਈ ਵਿੱਚ ਰੋਟੀ ਪਕਾਉਂਦੀ ਹੈ।",
    "verbPhrase": "ਪਕਾਉਂਦੀ ਹੈ",
    "mainVerb": "ਪਕਾਉਂਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਰੋਟੀ’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਰੋਟੀ"
  },
  {
    "sentence": "ਪਿਤਾ ਜੀ ਨੇ ਨਵੀਂ ਕਾਰ ਖ਼ਰੀਦੀ।",
    "verbPhrase": "ਖ਼ਰੀਦੀ",
    "mainVerb": "ਖ਼ਰੀਦੀ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਕਾਰ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਕਾਰ"
  },
  {
    "sentence": "ਮਾਲੀ ਪੌਦਿਆਂ ਦੀ ਕਾਂਟ-ਛਾਂਟ ਕਰਦਾ ਸੀ।",
    "verbPhrase": "ਕਰਦਾ ਸੀ",
    "mainVerb": "ਕਰਦਾ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਕਾਂਟ-ਛਾਂਟ’ ਕਰਮ ਹੈ ਅਤੇ ਕਾਲ ਭੂਤਕਾਲ ਹੈ।",
    "directObject": "ਕਾਂਟ-ਛਾਂਟ"
  },
  {
    "sentence": "ਵਿਦਿਆਰਥੀ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਅਖ਼ਬਾਰ ਪੜ੍ਹਦੇ ਹਨ।",
    "verbPhrase": "ਪੜ੍ਹਦੇ ਹਨ",
    "mainVerb": "ਪੜ੍ਹਦੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਅਖ਼ਬਾਰ’ ਕਰਮ ਹੋਣ ਕਰਕੇ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਅਖ਼ਬਾਰ"
  },
  {
    "sentence": "ਪੁਲਿਸ ਅਫ਼ਸਰ ਮੁਲਜ਼ਮ ਤੋਂ ਪੁੱਛਗਿੱਛ ਕਰੇਗਾ।",
    "verbPhrase": "ਕਰੇਗਾ",
    "mainVerb": "ਕਰੇਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਪੁੱਛਗਿੱਛ’ ਕਰਮ ਹੈ ਅਤੇ ਕਾਲ ਭਵਿੱਖਤ ਹੈ।",
    "directObject": "ਪੁੱਛਗਿੱਛ"
  },
  {
    "sentence": "ਦਰਜ਼ੀ ਨੇ ਸੋਹਣਾ ਸੂਟ ਸਿਉਂਤਾ।",
    "verbPhrase": "ਸਿਉਂਤਾ",
    "mainVerb": "ਸਿਉਂਤਾ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਸੂਟ’ ਕਰਮ ਹੋਣ ਕਾਰਨ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਸੂਟ"
  },
  {
    "sentence": "ਨੌਕਰ ਕਮਰੇ ਦੀ ਸਫ਼ਾਈ ਕਰਦਾ ਹੈ।",
    "verbPhrase": "ਕਰਦਾ ਹੈ",
    "mainVerb": "ਕਰਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਸਫ਼ਾਈ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਸਫ਼ਾਈ"
  },
  {
    "sentence": "ਸੇਵਾਦਾਰ ਘੰਟੀ ਵਜਾਏਗਾ।",
    "verbPhrase": "ਵਜਾਏਗਾ",
    "mainVerb": "ਵਜਾਏਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਘੰਟੀ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਘੰਟੀ"
  },
  {
    "sentence": "ਰਵੀ ਨੇ ਚਿੱਤਰ ਵਿੱਚ ਰੰਗ ਭਰਿਆ।",
    "verbPhrase": "ਭਰਿਆ",
    "mainVerb": "ਭਰਿਆ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਰੰਗ’ ਕਰਮ ਹੋਣ ਕਰਕੇ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।",
    "directObject": "ਰੰਗ"
  },
  {
    "sentence": "ਸ਼ਾਮ ਵੇਲੇ ਠੰਢੀ ਹਵਾ ਚੱਲਦੀ ਹੈ।",
    "verbPhrase": "ਚੱਲਦੀ ਹੈ",
    "mainVerb": "ਚੱਲਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਹਵਾ ਚੱਲਣ ਦਾ ਕੰਮ ਕਰਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ ਅਤੇ ਇਸ ਵਿੱਚ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ‘ਅਕਰਮਕ ਕਿਰਿਆ’ ਹੈ।"
  },
  {
    "sentence": "ਪੁਰਾਣਾ ਰੁੱਖ ਤੇਜ਼ ਹਨੇਰੀ ਵਿੱਚ ਡਿੱਗ ਪਿਆ।",
    "verbPhrase": "ਡਿੱਗ ਪਿਆ",
    "mainVerb": "ਡਿੱਗ ਪਿਆ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "‘ਡਿੱਗ ਪਿਆ’ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਕਿਉਂਕਿ ਡਿੱਗਣ ਦਾ ਪ੍ਰਭਾਵ ਸਿੱਧਾ ਰੁੱਖ 'ਤੇ ਪੈਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਸਾਰੇ ਮੁਸਾਫ਼ਿਰ ਸਮੇਂ ਸਿਰ ਸਟੇਸ਼ਨ 'ਤੇ ਪਹੁੰਚਣਗੇ।",
    "verbPhrase": "ਪਹੁੰਚਣਗੇ",
    "mainVerb": "ਪਹੁੰਚਣਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਪਹੁੰਚਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਕਾਲ ‘ਭਵਿੱਖਤ ਕਾਲ’ ਹੈ।"
  },
  {
    "sentence": "ਛੱਤ ਤੋਂ ਪਾਣੀ ਦੀਆਂ ਬੂੰਦਾਂ ਟਪਕਦੀਆਂ ਹਨ।",
    "verbPhrase": "ਟਪਕਦੀਆਂ ਹਨ",
    "mainVerb": "ਟਪਕਦੀਆਂ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਟਪਕਣਾ ਕਰਮ ਰਹਿਤ ਕਿਰਿਆ ਹੈ, ਇਸ ਲਈ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਲੋਕ ਡਰ ਦੇ ਮਾਰੇ ਚੁੱਪ ਰਹੇ।",
    "verbPhrase": "ਰਹੇ",
    "mainVerb": "ਰਹੇ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਇਸ ਵਿੱਚ ਕਰਮ ਮੌਜੂਦ ਨਹੀਂ ਹੈ, ਇਹ ਭੂਤਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਨਵਾਂ ਸਾਲ ਖ਼ੁਸ਼ੀਆਂ ਲੈ ਕੇ ਆਵੇਗਾ।",
    "verbPhrase": "ਆਵੇਗਾ",
    "mainVerb": "ਆਵੇਗਾ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਆਵੇਗਾ’ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਵੇਰੇ ਬਾਗ਼ ਵਿੱਚ ਤ੍ਰੇਲ ਦੇ ਤੁਪਕੇ ਚਮਕਦੇ ਹਨ।",
    "verbPhrase": "ਚਮਕਦੇ ਹਨ",
    "mainVerb": "ਚਮਕਦੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਚਮਕਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਕਿਉਂਕਿ ਕਿਰਿਆ ਦਾ ਪ੍ਰਭਾਵ ਕਰਤਾ ਤੱਕ ਸੀਮਤ ਹੈ।"
  },
  {
    "sentence": "ਸ਼ੇਰ ਦੀ ਦਹਾੜ ਸੁਣ ਕੇ ਹਿਰਨ ਦੌੜ ਗਿਆ।",
    "verbPhrase": "ਦੌੜ ਗਿਆ",
    "mainVerb": "ਦੌੜ ਗਿਆ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਦੌੜਨਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਇਹ ਭੂਤਕਾਲ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।"
  },
  {
    "sentence": "ਅਗਲੇ ਮਹੀਨੇ ਸਕੂਲ ਮੁੜ ਖੁੱਲ੍ਹਣਗੇ।",
    "verbPhrase": "ਖੁੱਲ੍ਹਣਗੇ",
    "mainVerb": "ਖੁੱਲ੍ਹਣਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਖੁੱਲ੍ਹਣਗੇ’ ਕਰਮ ਰਹਿਤ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸੂਰਜ ਦੀ ਗਰਮੀ ਨਾਲ ਬਰਫ਼ ਪਿਘਲਦੀ ਹੈ।",
    "verbPhrase": "ਪਿਘਲਦੀ ਹੈ",
    "mainVerb": "ਪਿਘਲਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਪਿਘਲਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਕਿਉਂਕਿ ਇਸ ਵਿੱਚ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ।"
  },
  {
    "sentence": "ਗ਼ਰੀਬ ਮਜ਼ਦੂਰ ਧੁੱਪ ਵਿੱਚ ਬੇਹੋਸ਼ ਹੋ ਗਿਆ।",
    "verbPhrase": "ਹੋ ਗਿਆ",
    "mainVerb": "ਹੋ ਗਿਆ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਹੋਣਾ/ਬੇਹੋਸ਼ ਹੋਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮੀਂਹ ਰੁਕਣ ਤੋਂ ਬਾਅਦ ਅਸਮਾਨ ਸਾਫ਼ ਹੋਵੇਗਾ।",
    "verbPhrase": "ਹੋਵੇਗਾ",
    "mainVerb": "ਹੋਵੇਗਾ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਹੋਵੇਗਾ’ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬਸੰਤ ਰੁੱਤ ਵਿੱਚ ਰੁੱਖਾਂ ਦੇ ਪੱਤੇ ਝੜਦੇ ਹਨ।",
    "verbPhrase": "ਝੜਦੇ ਹਨ",
    "mainVerb": "ਝੜਦੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਝੜਨਾ ਕਰਮ ਰਹਿਤ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸ਼ਾਮ ਹੁੰਦਿਆਂ ਹੀ ਸਾਰੇ ਪੰਛੀ ਆਲ੍ਹਣਿਆਂ ਵਿੱਚ ਪਰਤ ਆਏ।",
    "verbPhrase": "ਪਰਤ ਆਏ",
    "mainVerb": "ਪਰਤ ਆਏ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਪਰਤ ਆਉਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਿਹਨਤੀ ਵਿਦਿਆਰਥੀ ਮੁਸ਼ਕਲਾਂ ਅੱਗੇ ਕਦੇ ਨਹੀਂ ਝੁਕਣਗੇ।",
    "verbPhrase": "ਝੁਕਣਗੇ",
    "mainVerb": "ਝੁਕਣਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਝੁਕਣਗੇ’ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਕਾਲ ਭਵਿੱਖਤ ਹੈ।"
  },
  {
    "sentence": "ਮਿੱਠਾ ਸੰਗੀਤ ਸੁਣ ਕੇ ਮਨ ਸ਼ਾਂਤ ਹੁੰਦਾ ਹੈ।",
    "verbPhrase": "ਹੁੰਦਾ ਹੈ",
    "mainVerb": "ਹੁੰਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਇਸ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ‘ਅਕਰਮਕ ਕਿਰਿਆ’ ਹੈ।"
  },
  {
    "sentence": "ਬੱਸ ਅੱਡੇ 'ਤੇ ਭਾਰੀ ਭੀੜ ਇਕੱਠੀ ਹੋ ਗਈ।",
    "verbPhrase": "ਹੋ ਗਈ",
    "mainVerb": "ਹੋ ਗਈ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਇਕੱਠੀ ਹੋਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬੱਦਲ ਗਰਜਣਗੇ ਤਾਂ ਮੀਂਹ ਪਵੇਗਾ।",
    "verbPhrase": "ਪਵੇਗਾ",
    "mainVerb": "ਪਵੇਗਾ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਪਵੇਗਾ’ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦਰਿਆ ਦਾ ਪਾਣੀ ਤੇਜ਼ ਵਹਾਅ ਨਾਲ ਵਗਦਾ ਹੈ।",
    "verbPhrase": "ਵਗਦਾ ਹੈ",
    "mainVerb": "ਵਗਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "‘ਵਗਦਾ ਹੈ’ ਕਰਮ ਰਹਿਤ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਵੇਰੇ ਜਲਦੀ ਉੱਠਣ ਨਾਲ ਸਿਹਤ ਠੀਕ ਰਹਿੰਦੀ ਹੈ।",
    "verbPhrase": "ਰਹਿੰਦੀ ਹੈ",
    "mainVerb": "ਰਹਿੰਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਇਸ ਵਿੱਚ ਕਿਰਿਆ ਕਰਤਾ ਦੀ ਸਥਿਤੀ ਦਰਸਾਉਂਦੀ ਹੈ, ਕਰਮ ਨਹੀਂ ਹੈ।"
  },
  {
    "sentence": "ਬੱਚੇ ਦਾ ਦੰਦ ਦੁਖਦਾ ਸੀ।",
    "verbPhrase": "ਦੁਖਦਾ ਸੀ",
    "mainVerb": "ਦੁਖਦਾ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਦੁਖਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ਕਾਲ ਭੂਤਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਪਹਾੜਾਂ 'ਤੇ ਬਰਫ਼ ਪਵੇਗੀ।",
    "verbPhrase": "ਪਵੇਗੀ",
    "mainVerb": "ਪਵੇਗੀ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਪਵੇਗੀ’ ਕਰਮ ਰਹਿਤ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦੀਵਾ ਸਾਰੀ ਰਾਤ ਬਲਦਾ ਰਿਹਾ।",
    "verbPhrase": "ਬਲਦਾ ਰਿਹਾ",
    "mainVerb": "ਬਲਦਾ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਬਲਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਗਰਮੀਆਂ ਵਿੱਚ ਦੁੱਧ ਛੇਤੀ ਖ਼ਰਾਬ ਹੁੰਦਾ ਹੈ।",
    "verbPhrase": "ਹੁੰਦਾ ਹੈ",
    "mainVerb": "ਹੁੰਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਇਸ ਵਿੱਚ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ, ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਉਹ ਉੱਚੀ-ਉੱਚੀ ਬੋਲਣਗੇ।",
    "verbPhrase": "ਬੋਲਣਗੇ",
    "mainVerb": "ਬੋਲਣਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ਬੋਲਣ ਦਾ ਕਰਮ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ, ਇਸ ਲਈ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਿਪਾਹੀ ਡਿਊਟੀ ਦੌਰਾਨ ਜਾਗਦਾ ਰਿਹਾ।",
    "verbPhrase": "ਜਾਗਦਾ ਰਿਹਾ",
    "mainVerb": "ਜਾਗਦਾ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਜਾਗਣਾ ਕਰਮ ਰਹਿਤ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਾਡੇ ਪਿੰਡ ਦੀ ਨਹਿਰ ਸੁੱਕ ਗਈ ਹੈ।",
    "verbPhrase": "ਸੁੱਕ ਗਈ ਹੈ",
    "mainVerb": "ਸੁੱਕ ਗਈ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਸੁੱਕਣਾ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਤਾਰੇ ਰਾਤ ਵੇਲੇ ਚਮਕਣਗੇ।",
    "verbPhrase": "ਚਮਕਣਗੇ",
    "mainVerb": "ਚਮਕਣਗੇ",
    "verbType": "AKARMAK",
    "tense": "BHAVIKHAT",
    "explanationPa": "‘ਚਮਕਣਗੇ’ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਰੀਜ਼ ਕਮਜ਼ੋਰੀ ਕਾਰਨ ਕੰਬ ਰਿਹਾ ਸੀ।",
    "verbPhrase": "ਕੰਬ ਰਿਹਾ ਸੀ",
    "mainVerb": "ਕੰਬ",
    "auxiliaryVerb": "ਸੀ",
    "verbType": "AKARMAK",
    "tense": "BHOOT",
    "explanationPa": "ਕੰਬਣਾ ਕਰਤਾ ਦੀ ਆਪਣੀ ਹਾਲਤ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪਾਣੀ ਸੌ ਡਿਗਰੀ 'ਤੇ ਉੱਬਲਦਾ ਹੈ।",
    "verbPhrase": "ਉੱਬਲਦਾ ਹੈ",
    "mainVerb": "ਉੱਬਲਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "AKARMAK",
    "tense": "VARATMAN",
    "explanationPa": "ਉੱਬਲਣਾ ਕਰਮ ਰਹਿਤ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਕਿਸਾਨ ਖੇਤਾਂ ਵਿੱਚ ਕਣਕ ਬੀਜਦਾ ਹੈ।",
    "verbPhrase": "ਬੀਜਦਾ ਹੈ",
    "mainVerb": "ਬੀਜਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਕਣਕ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਕਣਕ’ ਕਰਮ ਹੈ ਜਿਸ ਉੱਤੇ ਬੀਜਣ ਦੀ ਕਿਰਿਆ ਦਾ ਅਸਰ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਅਧਿਆਪਕ ਨੇ ਬੱਚਿਆਂ ਨੂੰ ਵਿਆਕਰਣ ਪੜ੍ਹਾਈ।",
    "verbPhrase": "ਪੜ੍ਹਾਈ",
    "mainVerb": "ਪੜ੍ਹਾਈ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਵਿਆਕਰਣ",
    "explanationPa": "ਇਸ ਵਿੱਚ ‘ਵਿਆਕਰਣ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਭੂਤਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਤਰਖਾਣ ਲੱਕੜ ਦਾ ਮੇਜ਼ ਬਣਾਏਗਾ।",
    "verbPhrase": "ਬਣਾਏਗਾ",
    "mainVerb": "ਬਣਾਏਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਮੇਜ਼",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਮੇਜ਼’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦਰਜ਼ੀ ਰੇਸ਼ਮੀ ਕੱਪੜਾ ਕੱਟਦਾ ਹੈ।",
    "verbPhrase": "ਕੱਟਦਾ ਹੈ",
    "mainVerb": "ਕੱਟਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਕੱਪੜਾ",
    "explanationPa": "ਵਾਕ ਵਿੱਚ ‘ਕੱਪੜਾ’ ਕਰਮ ਹੈ ਜਿਸ ਨੂੰ ਕੱਟਿਆ ਜਾ ਰਿਹਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਾਲੀ ਨੇ ਸਾਰੇ ਗੁਲਾਬ ਤੋੜ ਲਏ।",
    "verbPhrase": "ਤੋੜ ਲਏ",
    "mainVerb": "ਤੋੜ ਲਏ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਗੁਲਾਬ",
    "explanationPa": "ਇਸ ਵਿੱਚ ‘ਗੁਲਾਬ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਵਿਦਿਆਰਥੀ ਮੁਕਾਬਲੇ ਵਿੱਚ ਭਾਸ਼ਣ ਦੇਣਗੇ।",
    "verbPhrase": "ਦੇਣਗੇ",
    "mainVerb": "ਦੇਣਗੇ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਭਾਸ਼ਣ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਭਾਸ਼ਣ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਾਂ ਰਸੋਈ ਵਿੱਚ ਰੋਟੀਆਂ ਪਕਾਉਂਦੀ ਹੈ।",
    "verbPhrase": "ਪਕਾਉਂਦੀ ਹੈ",
    "mainVerb": "ਪਕਾਉਂਦੀ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਰੋਟੀਆਂ",
    "explanationPa": "‘ਰੋਟੀਆਂ’ ਕਰਮ ਹੈ ਜਿਸ ਉੱਤੇ ਪਕਾਉਣ ਦੀ ਕਿਰਿਆ ਹੋ ਰਹੀ ਹੈ, ਇਸ ਲਈ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਿਪਾਹੀ ਨੇ ਚੋਰ ਨੂੰ ਹੱਥਕੜੀ ਲਗਾਈ।",
    "verbPhrase": "ਲਗਾਈ",
    "mainVerb": "ਲਗਾਈ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਹੱਥਕੜੀ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਹੱਥਕੜੀ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਰਕਾਰ ਨਵੇਂ ਹਸਪਤਾਲ ਖੋਲ੍ਹੇਗੀ।",
    "verbPhrase": "ਖੋਲ੍ਹੇਗੀ",
    "mainVerb": "ਖੋਲ੍ਹੇਗੀ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਹਸਪਤਾਲ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਹਸਪਤਾਲ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਲੇਖਕ ਨਵਾਂ ਨਾਵਲ ਲਿਖਦਾ ਹੈ।",
    "verbPhrase": "ਲਿਖਦਾ ਹੈ",
    "mainVerb": "ਲਿਖਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਨਾਵਲ",
    "explanationPa": "‘ਨਾਵਲ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਰਤਮਾਨ ਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਜ਼ਦੂਰਾਂ ਨੇ ਭਾਰੇ ਪੱਥਰ ਚੁੱਕੇ।",
    "verbPhrase": "ਚੁੱਕੇ",
    "mainVerb": "ਚੁੱਕੇ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਪੱਥਰ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਪੱਥਰ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਗਾਇਕ ਸਟੇਜ 'ਤੇ ਲੋਕ-ਗੀਤ ਗਾਵੇਗਾ।",
    "verbPhrase": "ਗਾਵੇਗਾ",
    "mainVerb": "ਗਾਵੇਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਲੋਕ-ਗੀਤ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਲੋਕ-ਗੀਤ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਡਾਕਟਰ ਮਰੀਜ਼ ਦੀ ਨਬਜ਼ ਵੇਖਦਾ ਹੈ।",
    "verbPhrase": "ਵੇਖਦਾ ਹੈ",
    "mainVerb": "ਵੇਖਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਨਬਜ਼",
    "explanationPa": "‘ਨਬਜ਼’ ਕਰਮ ਹੈ ਜਿਸ ਨੂੰ ਵੇਖਿਆ ਜਾ ਰਿਹਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬੱਚਿਆਂ ਨੇ ਰੰਗ-ਬਿਰੰਗੇ ਗੁਬਾਰੇ ਖ਼ਰੀਦੇ।",
    "verbPhrase": "ਖ਼ਰੀਦੇ",
    "mainVerb": "ਖ਼ਰੀਦੇ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਗੁਬਾਰੇ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਗੁਬਾਰੇ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਅਸੀਂ ਕੱਲ੍ਹ ਨਵੀਂ ਫ਼ਿਲਮ ਵੇਖਾਂਗੇ।",
    "verbPhrase": "ਵੇਖਾਂਗੇ",
    "mainVerb": "ਵੇਖਾਂਗੇ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਫ਼ਿਲਮ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਫ਼ਿਲਮ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਧੋਬੀ ਤਲਾਬ 'ਤੇ ਕੱਪੜੇ ਧੋਂਦਾ ਹੈ।",
    "verbPhrase": "ਧੋਂਦਾ ਹੈ",
    "mainVerb": "ਧੋਂਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਕੱਪੜੇ",
    "explanationPa": "‘ਕੱਪੜੇ’ ਕਰਮ ਹੈ ਜਿਸ ਨੂੰ ਧੋਤਾ ਜਾ ਰਿਹਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦਾਦੀ ਜੀ ਨੇ ਸੁਆਦੀ ਖੀਰ ਬਣਾਈ।",
    "verbPhrase": "ਬਣਾਈ",
    "mainVerb": "ਬਣਾਈ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਖੀਰ",
    "explanationPa": "ਇਸ ਵਿੱਚ ‘ਖੀਰ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪੰਚਾਇਤ ਪਿੰਡ ਵਿੱਚ ਸਕੂਲ ਬਣਵਾਏਗੀ।",
    "verbPhrase": "ਬਣਵਾਏਗੀ",
    "mainVerb": "ਬਣਵਾਏਗੀ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਸਕੂਲ",
    "explanationPa": "‘ਸਕੂਲ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮੁੰਡੇ ਨੇ ਫੁੱਟਬਾਲ ਨੂੰ ਕਿੱਕ ਮਾਰੀ।",
    "verbPhrase": "ਮਾਰੀ",
    "mainVerb": "ਮਾਰੀ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਫੁੱਟਬਾਲ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਫੁੱਟਬਾਲ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਕਾਪੀ ਚੈੱਕ ਕਰਦਾ ਹੈ।",
    "verbPhrase": "ਕਰਦਾ ਹੈ",
    "mainVerb": "ਕਰਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਕਾਪੀ",
    "explanationPa": "‘ਕਾਪੀ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪੁਲਿਸ ਨੇ ਲੁਟੇਰੇ ਨੂੰ ਗ੍ਰਿਫ਼ਤਾਰ ਕੀਤਾ।",
    "verbPhrase": "ਕੀਤਾ",
    "mainVerb": "ਕੀਤਾ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਲੁਟੇਰੇ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਲੁਟੇਰੇ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਕਵੀ ਆਪਣੀ ਨਵੀਂ ਕਵਿਤਾ ਸੁਣਾਏਗਾ।",
    "verbPhrase": "ਸੁਣਾਏਗਾ",
    "mainVerb": "ਸੁਣਾਏਗਾ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਕਵਿਤਾ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਕਵਿਤਾ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਲੜਕੀ ਨੇ ਸੁੰਦਰ ਤਸਵੀਰ ਬਣਾਈ।",
    "verbPhrase": "ਬਣਾਈ",
    "mainVerb": "ਬਣਾਈ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਤਸਵੀਰ",
    "explanationPa": "‘ਤਸਵੀਰ’ ਕਰਮ ਹੈ ਜਿਸ ਨੂੰ ਬਣਾਇਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦੁਕਾਨਦਾਰ ਸਬਜ਼ੀਆਂ ਵੇਚਦਾ ਹੈ।",
    "verbPhrase": "ਵੇਚਦਾ ਹੈ",
    "mainVerb": "ਵੇਚਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਸਬਜ਼ੀਆਂ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਸਬਜ਼ੀਆਂ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਅਸੀਂ ਨਵਾਂ ਮਕਾਨ ਖ਼ਰੀਦਾਂਗੇ।",
    "verbPhrase": "ਖ਼ਰੀਦਾਂਗੇ",
    "mainVerb": "ਖ਼ਰੀਦਾਂਗੇ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਮਕਾਨ",
    "explanationPa": "‘ਮਕਾਨ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਕਿਸਾਨ ਨੇ ਬਲਦਾਂ ਨੂੰ ਚਾਰਾ ਪਾਇਆ।",
    "verbPhrase": "ਪਾਇਆ",
    "mainVerb": "ਪਾਇਆ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਚਾਰਾ",
    "explanationPa": "‘ਚਾਰਾ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਾਲੀ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦਿੰਦਾ ਹੈ।",
    "verbPhrase": "ਦਿੰਦਾ ਹੈ",
    "mainVerb": "ਦਿੰਦਾ",
    "auxiliaryVerb": "ਹੈ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਪਾਣੀ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਪਾਣੀ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਵਿਦਿਆਰਥੀ ਇਮਤਿਹਾਨ ਦੇਣਗੇ।",
    "verbPhrase": "ਦੇਣਗੇ",
    "mainVerb": "ਦੇਣਗੇ",
    "verbType": "SAKARMAK",
    "tense": "BHAVIKHAT",
    "directObject": "ਇਮਤਿਹਾਨ",
    "explanationPa": "‘ਇਮਤਿਹਾਨ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਉਸਨੇ ਭਿਖਾਰੀ ਨੂੰ ਰੁਪਏ ਦਿੱਤੇ।",
    "verbPhrase": "ਦਿੱਤੇ",
    "mainVerb": "ਦਿੱਤੇ",
    "verbType": "SAKARMAK",
    "tense": "BHOOT",
    "directObject": "ਰੁਪਏ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਰੁਪਏ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਜ਼ਦੂਰ ਇੱਟਾਂ ਢੋਂਦੇ ਹਨ।",
    "verbPhrase": "ਢੋਂਦੇ ਹਨ",
    "mainVerb": "ਢੋਂਦੇ",
    "auxiliaryVerb": "ਹਨ",
    "verbType": "SAKARMAK",
    "tense": "VARATMAN",
    "directObject": "ਇੱਟਾਂ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਇੱਟਾਂ’ ਕਰਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"
  }
];

export const TENSE_SHIFT_PAIRS: readonly TenseShiftPair[] = [
  {
    "baseSentence": "ਅਮਨ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਅਮਨ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਸੀ।",
    "distractors": [
      "ਅਮਨ ਕਿਤਾਬ ਪੜ੍ਹੇਗਾ।",
      "ਅਮਨ ਕਿਤਾਬ ਪੜ੍ਹ ਰਿਹਾ ਹੈ।",
      "ਅਮਨ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ਕਾਲ ‘ਪੜ੍ਹਦਾ ਹੈ’ ਨੂੰ ਭੂਤਕਾਲ ਵਿੱਚ ਬਦਲਣ 'ਤੇ ‘ਪੜ੍ਹਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਕੱਲ੍ਹ ਦਿੱਲੀ ਜਾਵਾਂਗੇ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਦਿੱਲੀ ਜਾਂਦੇ ਹਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਦਿੱਲੀ ਗਏ ਸਾਂ।",
      "ਅਸੀਂ ਦਿੱਲੀ ਜਾਵਾਂਗੇ ਹੀ।",
      "ਅਸੀਂ ਦਿੱਲੀ ਜਾਣਾ ਸੀ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ਕਾਲ ‘ਜਾਵਾਂਗੇ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਜਾਂਦੇ ਹਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਲੀ ਬੂਟਿਆਂ ਨੂੰ ਪਾਣੀ ਦਿੰਦਾ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਮਾਲੀ ਬੂਟਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇਵੇਗਾ।",
    "distractors": [
      "ਮਾਲੀ ਬੂਟਿਆਂ ਨੂੰ ਪਾਣੀ ਦਿੰਦਾ ਹੈ।",
      "ਮਾਲੀ ਬੂਟਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਿਹਾ ਹੈ।",
      "ਮਾਲੀ ਬੂਟਿਆਂ ਨੂੰ ਪਾਣੀ ਦਿੱਤਾ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਦਿੰਦਾ ਸੀ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ਰੂਪ ‘ਦੇਵੇਗਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕੁੜੀਆਂ ਗਿੱਧਾ ਪਾਉਂਦੀਆਂ ਹਨ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਕੁੜੀਆਂ ਗਿੱਧਾ ਪਾਉਂਦੀਆਂ ਸਨ।",
    "distractors": [
      "ਕੁੜੀਆਂ ਗਿੱਧਾ ਪਾਉਣਗੀਆਂ।",
      "ਕੁੜੀਆਂ ਗਿੱਧਾ ਪਾ ਰਹੀਆਂ ਹਨ।",
      "ਕੁੜੀਆਂ ਗਿੱਧਾ ਪਾਉਂਦੀਆਂ ਹੋਣਗੀਆਂ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਪਾਉਂਦੀਆਂ ਹਨ’ ਦਾ ਭੂਤਕਾਲ ਰੂਪ ‘ਪਾਉਂਦੀਆਂ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੜ੍ਹਾਉਂਦਾ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੜ੍ਹਾਉਂਦਾ ਹੈ।",
    "distractors": [
      "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੜ੍ਹਾਵੇਗਾ।",
      "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੜ੍ਹਾਉਂਦਾ ਰਹੇਗਾ।",
      "ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੜ੍ਹਾਇਆ ਸੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਪੜ੍ਹਾਉਂਦਾ ਸੀ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਪੜ੍ਹਾਉਂਦਾ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕਿਸਾਨ ਅਨਾਜ ਮੰਡੀ ਵਿੱਚ ਵੇਚੇਗਾ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਕਿਸਾਨ ਅਨਾਜ ਮੰਡੀ ਵਿੱਚ ਵੇਚਦਾ ਹੈ।",
    "distractors": [
      "ਕਿਸਾਨ ਅਨਾਜ ਮੰਡੀ ਵਿੱਚ ਵੇਚਦਾ ਸੀ।",
      "ਕਿਸਾਨ ਨੇ ਅਨਾਜ ਵੇਚ ਦਿੱਤਾ ਹੈ।",
      "ਕਿਸਾਨ ਅਨਾਜ ਮੰਡੀ ਵਿੱਚ ਵੇਚ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ਕਾਲ ‘ਵੇਚੇਗਾ’ ਦਾ ਨਿੱਤ ਵਰਤਮਾਨ ਰੂਪ ‘ਵੇਚਦਾ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਫੁੱਟਬਾਲ ਖੇਡਦੇ ਹਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਫੁੱਟਬਾਲ ਖੇਡਣਗੇ।",
    "distractors": [
      "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਫੁੱਟਬਾਲ ਖੇਡਦੇ ਸਨ।",
      "ਬੱਚੇ ਫੁੱਟਬਾਲ ਖੇਡ ਚੁੱਕੇ ਹਨ।",
      "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਫੁੱਟਬਾਲ ਖੇਡਦੇ ਰਹਿੰਦੇ ਹਨ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਖੇਡਦੇ ਹਨ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਖੇਡਣਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਲੇਖਕ ਨੇ ਕਹਾਣੀ ਲਿਖੀ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਲੇਖਕ ਕਹਾਣੀ ਲਿਖੇਗਾ।",
    "distractors": [
      "ਲੇਖਕ ਕਹਾਣੀ ਲਿਖਦਾ ਹੈ।",
      "ਲੇਖਕ ਕਹਾਣੀ ਲਿਖ ਰਿਹਾ ਹੈ।",
      "ਲੇਖਕ ਨੇ ਕਹਾਣੀ ਲਿਖੀ ਹੋਵੇਗੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਤੋਂ ਆਉਣ ਵਾਲੇ ਸਮੇਂ ਲਈ ਭਵਿੱਖਤ ਕਾਲ ‘ਲਿਖੇਗਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਸਿਪਾਹੀ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰਦੇ ਹਨ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਸਿਪਾਹੀ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰਦੇ ਸਨ।",
    "distractors": [
      "ਸਿਪਾਹੀ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰਨਗੇ।",
      "ਸਿਪਾਹੀ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰ ਰਹੇ ਹੋਣਗੇ।",
      "ਸਿਪਾਹੀਆਂ ਨੇ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰਨੀ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਕਰਦੇ ਹਨ’ ਦਾ ਭੂਤਕਾਲ ਰੂਪ ‘ਕਰਦੇ ਸਨ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਸੂਰਜ ਪੂਰਬ ਵਿੱਚੋਂ ਚੜ੍ਹਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਸੂਰਜ ਪੂਰਬ ਵਿੱਚੋਂ ਚੜ੍ਹਦਾ ਸੀ।",
    "distractors": [
      "ਸੂਰਜ ਪੂਰਬ ਵਿੱਚੋਂ ਚੜ੍ਹੇਗਾ।",
      "ਸੂਰਜ ਪੂਰਬ ਵਿੱਚੋਂ ਚੜ੍ਹਿਆ ਹੋਵੇਗਾ।",
      "ਸੂਰਜ ਪੂਰਬ ਵਿੱਚੋਂ ਚੜ੍ਹਦਾ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਚੜ੍ਹਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲੀ ਰੂਪ ‘ਚੜ੍ਹਦਾ ਸੀ’ ਹੈ।"
  },
  {
    "baseSentence": "ਕੁੜੀ ਗੀਤ ਗਾਉਂਦੀ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਕੁੜੀ ਗੀਤ ਗਾਵੇਗੀ।",
    "distractors": [
      "ਕੁੜੀ ਗੀਤ ਗਾਉਂਦੀ ਸੀ।",
      "ਕੁੜੀ ਨੇ ਗੀਤ ਗਾਇਆ ਸੀ।",
      "ਕੁੜੀ ਗੀਤ ਗਾ ਰਹੀ ਹੋਵੇਗੀ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਗਾਉਂਦੀ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ਰੂਪ ‘ਗਾਵੇਗੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਮੈਚ ਜਿੱਤਿਆ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਮੈਚ ਜਿੱਤਦੇ ਹਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਮੈਚ ਜਿੱਤਾਂਗੇ।",
      "ਅਸੀਂ ਮੈਚ ਜਿੱਤ ਚੁੱਕੇ ਹਾਂ।",
      "ਅਸੀਂ ਮੈਚ ਜਿੱਤਣਾ ਸੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਜਿੱਤਿਆ ਸੀ’ ਦਾ ਨਿੱਤ ਵਰਤਮਾਨ ਰੂਪ ‘ਜਿੱਤਦੇ ਹਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਪੰਛੀ ਆਲ੍ਹਣੇ ਬਣਾਉਣਗੇ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਪੰਛੀ ਆਲ੍ਹਣੇ ਬਣਾਉਂਦੇ ਸਨ।",
    "distractors": [
      "ਪੰਛੀ ਆਲ੍ਹਣੇ ਬਣਾਉਂਦੇ ਹਨ।",
      "ਪੰਛੀਆਂ ਨੇ ਆਲ੍ਹਣੇ ਬਣਾਉਣੇ ਹਨ।",
      "ਪੰਛੀ ਆਲ੍ਹਣੇ ਬਣਾ ਰਹੇ ਹਨ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਬਣਾਉਣਗੇ’ ਦਾ ਭੂਤਕਾਲ ਰੂਪ ‘ਬਣਾਉਂਦੇ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾਉਂਦੇ ਹਨ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾਉਂਦੇ ਸਨ।",
    "distractors": [
      "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾਉਣਗੇ।",
      "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾ ਰਹੇ ਹੋਣਗੇ।",
      "ਮਾਤਾ ਜੀ ਨੇ ਰੋਟੀ ਪਕਾਉਣੀ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਪਕਾਉਂਦੇ ਹਨ’ ਦਾ ਭੂਤਕਾਲੀ ਰੂਪ ‘ਪਕਾਉਂਦੇ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਹਵਾ ਤੇਜ਼ ਚੱਲਦੀ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਹਵਾ ਤੇਜ਼ ਚੱਲੇਗੀ।",
    "distractors": [
      "ਹਵਾ ਤੇਜ਼ ਚੱਲਦੀ ਹੈ।",
      "ਹਵਾ ਤੇਜ਼ ਚੱਲ ਰਹੀ ਹੈ।",
      "ਹਵਾ ਤੇਜ਼ ਚੱਲੀ ਸੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਚੱਲਦੀ ਸੀ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਚੱਲੇਗੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਵਿਦਿਆਰਥੀ ਮਿਹਨਤ ਕਰਨਗੇ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਵਿਦਿਆਰਥੀ ਮਿਹਨਤ ਕਰਦੇ ਹਨ।",
    "distractors": [
      "ਵਿਦਿਆਰਥੀ ਮਿਹਨਤ ਕਰਦੇ ਸਨ।",
      "ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਮਿਹਨਤ ਕੀਤੀ।",
      "ਵਿਦਿਆਰਥੀ ਮਿਹਨਤ ਕਰਨ ਵਾਲੇ ਹਨ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਕਰਨਗੇ’ ਦਾ ਸਾਧਾਰਨ ਵਰਤਮਾਨ ‘ਕਰਦੇ ਹਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਲੀ ਫੁੱਲ ਤੋੜਦਾ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਮਾਲੀ ਫੁੱਲ ਤੋੜੇਗਾ।",
    "distractors": [
      "ਮਾਲੀ ਫੁੱਲ ਤੋੜਦਾ ਸੀ।",
      "ਮਾਲੀ ਨੇ ਫੁੱਲ ਤੋੜਿਆ ਸੀ।",
      "ਮਾਲੀ ਫੁੱਲ ਤੋੜ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਤੋੜਦਾ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ਰੂਪ ‘ਤੋੜੇਗਾ’ ਹੈ।"
  },
  {
    "baseSentence": "ਸ਼ੇਰ ਜੰਗਲ ਵਿੱਚ ਗਰਜਦਾ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਸ਼ੇਰ ਜੰਗਲ ਵਿੱਚ ਗਰਜਦਾ ਹੈ।",
    "distractors": [
      "ਸ਼ੇਰ ਜੰਗਲ ਵਿੱਚ ਗਰਜੇਗਾ।",
      "ਸ਼ੇਰ ਨੇ ਜੰਗਲ ਵਿੱਚ ਗਰਜਣਾ ਸੀ।",
      "ਸ਼ੇਰ ਜੰਗਲ ਵਿੱਚ ਗਰਜ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਗਰਜਦਾ ਸੀ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਗਰਜਦਾ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਬੱਚੇ ਪਤੰਗ ਉਡਾਉਣਗੇ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਬੱਚੇ ਪਤੰਗ ਉਡਾਉਂਦੇ ਸਨ।",
    "distractors": [
      "ਬੱਚੇ ਪਤੰਗ ਉਡਾਉਂਦੇ ਹਨ।",
      "ਬੱਚਿਆਂ ਨੇ ਪਤੰਗ ਉਡਾਉਣੀ ਹੈ।",
      "ਬੱਚੇ ਪਤੰਗ ਉਡਾ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਉਡਾਉਣਗੇ’ ਦਾ ਭੂਤਕਾਲ ਰੂਪ ‘ਉਡਾਉਂਦੇ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕਿਸਾਨ ਫ਼ਸਲ ਵੱਢਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਕਿਸਾਨ ਫ਼ਸਲ ਵੱਢਦਾ ਸੀ।",
    "distractors": [
      "ਕਿਸਾਨ ਫ਼ਸਲ ਵੱਢੇਗਾ।",
      "ਕਿਸਾਨ ਨੇ ਫ਼ਸਲ ਵੱਢਣੀ ਹੈ।",
      "ਕਿਸਾਨ ਫ਼ਸਲ ਵੱਢ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਵੱਢਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲ ‘ਵੱਢਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਦਰਜ਼ੀ ਕਮੀਜ਼ ਸਿਊਂਦਾ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਦਰਜ਼ੀ ਕਮੀਜ਼ ਸਿਊਂਵੇਗਾ।",
    "distractors": [
      "ਦਰਜ਼ੀ ਕਮੀਜ਼ ਸਿਊਂਦਾ ਹੈ।",
      "ਦਰਜ਼ੀ ਨੇ ਕਮੀਜ਼ ਸੀਤੀ ਸੀ।",
      "ਦਰਜ਼ੀ ਕਮੀਜ਼ ਸੀ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਸਿਊਂਦਾ ਸੀ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਸਿਊਂਵੇਗਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਰੇਲਗੱਡੀ ਪਲੇਟਫ਼ਾਰਮ 'ਤੇ ਪਹੁੰਚੇਗੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਰੇਲਗੱਡੀ ਪਲੇਟਫ਼ਾਰਮ 'ਤੇ ਪਹੁੰਚਦੀ ਹੈ।",
    "distractors": [
      "ਰੇਲਗੱਡੀ ਪਲੇਟਫ਼ਾਰਮ 'ਤੇ ਪਹੁੰਚੀ ਸੀ।",
      "ਰੇਲਗੱਡੀ ਪਹੁੰਚਣ ਵਾਲੀ ਸੀ।",
      "ਰੇਲਗੱਡੀ ਪਹੁੰਚ ਚੁੱਕੀ ਹੈ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਪਹੁੰਚੇਗੀ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਪਹੁੰਚਦੀ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਸੂਰਜ ਤੇਜ਼ ਚਮਕਦਾ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਸੂਰਜ ਤੇਜ਼ ਚਮਕੇਗਾ।",
    "distractors": [
      "ਸੂਰਜ ਤੇਜ਼ ਚਮਕਦਾ ਸੀ।",
      "ਸੂਰਜ ਤੇਜ਼ ਚਮਕਿਆ ਹੋਵੇਗਾ।",
      "ਸੂਰਜ ਤੇਜ਼ ਚਮਕ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਚਮਕਦਾ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਚਮਕੇਗਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਨਦੀ ਤੇਜ਼ ਵਗਦੀ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਨਦੀ ਤੇਜ਼ ਵਗਦੀ ਹੈ।",
    "distractors": [
      "ਨਦੀ ਤੇਜ਼ ਵਗੇਗੀ।",
      "ਨਦੀ ਤੇਜ਼ ਵਹਿ ਚੁੱਕੀ ਹੈ।",
      "ਨਦੀ ਤੇਜ਼ ਵਗ ਰਹੀ ਹੋਵੇਗੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਵਗਦੀ ਸੀ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਵਗਦੀ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮੈਂ ਚਿੱਠੀ ਲਿਖਾਂਗਾ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਮੈਂ ਚਿੱਠੀ ਲਿਖਦਾ ਸੀ।",
    "distractors": [
      "ਮੈਂ ਚਿੱਠੀ ਲਿਖਦਾ ਹਾਂ।",
      "ਮੈਂ ਚਿੱਠੀ ਲਿਖ ਰਿਹਾ ਹਾਂ।",
      "ਮੈਂ ਚਿੱਠੀ ਲਿਖਣੀ ਚਾਹੁੰਦਾ ਹਾਂ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਲਿਖਾਂਗਾ’ ਦਾ ਭੂਤਕਾਲ ਰੂਪ ‘ਲਿਖਦਾ ਸੀ’ (ਜਾਂ ਲਿਖੀ ਸੀ) ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਸਟਰ ਜੀ ਪਾਠ ਪੜ੍ਹਾਉਂਦੇ ਹਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਮਾਸਟਰ ਜੀ ਪਾਠ ਪੜ੍ਹਾਉਣਗੇ।",
    "distractors": [
      "ਮਾਸਟਰ ਜੀ ਨੇ ਪਾਠ ਪੜ੍ਹਾਇਆ ਸੀ।",
      "ਮਾਸਟਰ ਜੀ ਪਾਠ ਪੜ੍ਹਾਉਂਦੇ ਸਨ।",
      "ਮਾਸਟਰ ਜੀ ਪਾਠ ਪੜ੍ਹਾ ਰਹੇ ਹਨ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਪੜ੍ਹਾਉਂਦੇ ਹਨ’ ਦਾ ਭਵਿੱਖਤ ਰੂਪ ‘ਪੜ੍ਹਾਉਣਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕੁੜੀ ਨੇ ਰੰਗੋਲੀ ਬਣਾਈ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਕੁੜੀ ਰੰਗੋਲੀ ਬਣਾਉਂਦੀ ਹੈ।",
    "distractors": [
      "ਕੁੜੀ ਰੰਗੋਲੀ ਬਣਾਵੇਗੀ।",
      "ਕੁੜੀ ਨੇ ਰੰਗੋਲੀ ਬਣਾਈ ਸੀ।",
      "ਕੁੜੀ ਰੰਗੋਲੀ ਬਣਾ ਰਹੀ ਹੋਵੇਗੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਬਣਾਈ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਬਣਾਉਂਦੀ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਰਲ ਕੇ ਗੀਤ ਗਾਵਾਂਗੇ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਰਲ ਕੇ ਗੀਤ ਗਾਉਂਦੇ ਸਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਰਲ ਕੇ ਗੀਤ ਗਾਉਂਦੇ ਹਾਂ।",
      "ਅਸੀਂ ਗੀਤ ਗਾ ਰਹੇ ਹਾਂ।",
      "ਅਸੀਂ ਗੀਤ ਗਾਉਣਾ ਸੀ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਗਾਵਾਂਗੇ’ ਦਾ ਭੂਤਕਾਲ ‘ਗਾਉਂਦੇ ਸਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਲੀ ਬੂਟੇ ਲਗਾਉਂਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਮਾਲੀ ਬੂਟੇ ਲਗਾਉਂਦਾ ਸੀ।",
    "distractors": [
      "ਮਾਲੀ ਬੂਟੇ ਲਗਾਵੇਗਾ।",
      "ਮਾਲੀ ਨੇ ਬੂਟੇ ਲਗਾਉਣੇ ਹਨ।",
      "ਮਾਲੀ ਬੂਟੇ ਲਗਾ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਲਗਾਉਂਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲ ‘ਲਗਾਉਂਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਪੰਛੀ ਆਲ੍ਹਣੇ ਵੱਲ ਉੱਡਦੇ ਸਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਪੰਛੀ ਆਲ੍ਹਣੇ ਵੱਲ ਉੱਡਣਗੇ।",
    "distractors": [
      "ਪੰਛੀ ਆਲ੍ਹਣੇ ਵੱਲ ਉੱਡਦੇ ਹਨ।",
      "ਪੰਛੀ ਆਲ੍ਹਣੇ ਵਿੱਚ ਉੱਡੇ ਸਨ।",
      "ਪੰਛੀ ਆਲ੍ਹਣੇ ਵੱਲ ਉੱਡ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਉੱਡਦੇ ਸਨ’ ਦਾ ਭਵਿੱਖਤ ‘ਉੱਡਣਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਵਿਦਿਆਰਥੀ ਪ੍ਰੀਖਿਆ ਦੀ ਤਿਆਰੀ ਕਰਦੇ ਹਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਵਿਦਿਆਰਥੀ ਪ੍ਰੀਖਿਆ ਦੀ ਤਿਆਰੀ ਕਰਨਗੇ।",
    "distractors": [
      "ਵਿਦਿਆਰਥੀ ਪ੍ਰੀਖਿਆ ਦੀ ਤਿਆਰੀ ਕਰਦੇ ਸਨ।",
      "ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਤਿਆਰੀ ਕੀਤੀ ਸੀ।",
      "ਵਿਦਿਆਰਥੀ ਤਿਆਰੀ ਕਰ ਰਹੇ ਹਨ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਕਰਦੇ ਹਨ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਕਰਨਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਚੋਰ ਪੁਲਿਸ ਨੂੰ ਵੇਖ ਕੇ ਭੱਜਿਆ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਚੋਰ ਪੁਲਿਸ ਨੂੰ ਵੇਖ ਕੇ ਭੱਜਦਾ ਹੈ।",
    "distractors": [
      "ਚੋਰ ਪੁਲਿਸ ਨੂੰ ਵੇਖ ਕੇ ਭੱਜੇਗਾ।",
      "ਚੋਰ ਪੁਲਿਸ ਤੋਂ ਭੱਜ ਰਿਹਾ ਹੋਵੇਗਾ।",
      "ਚੋਰ ਭੱਜਣ ਵਾਲਾ ਸੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਭੱਜਿਆ ਸੀ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਭੱਜਦਾ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕਿਸਾਨ ਖੂਹ 'ਤੇ ਕੰਮ ਕਰੇਗਾ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਕਿਸਾਨ ਖੂਹ 'ਤੇ ਕੰਮ ਕਰਦਾ ਸੀ।",
    "distractors": [
      "ਕਿਸਾਨ ਖੂਹ 'ਤੇ ਕੰਮ ਕਰਦਾ ਹੈ।",
      "ਕਿਸਾਨ ਖੂਹ 'ਤੇ ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ।",
      "ਕਿਸਾਨ ਨੇ ਕੰਮ ਕਰਨਾ ਸੀ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਕਰੇਗਾ’ ਦਾ ਭੂਤਕਾਲ ‘ਕਰਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਬੱਚਾ ਖਿਡੌਣੇ ਨਾਲ ਖੇਡਦਾ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਬੱਚਾ ਖਿਡੌਣੇ ਨਾਲ ਖੇਡੇਗਾ।",
    "distractors": [
      "ਬੱਚਾ ਖਿਡੌਣੇ ਨਾਲ ਖੇਡਦਾ ਸੀ।",
      "ਬੱਚੇ ਨੇ ਖਿਡੌਣੇ ਨਾਲ ਖੇਡਿਆ ਸੀ।",
      "ਬੱਚਾ ਖੇਡ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਖੇਡਦਾ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਖੇਡੇਗਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਉਹ ਰੋਜ਼ ਸਵੇਰੇ ਸੈਰ ਕਰਦੇ ਸਨ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਉਹ ਰੋਜ਼ ਸਵੇਰੇ ਸੈਰ ਕਰਦੇ ਹਨ।",
    "distractors": [
      "ਉਹ ਰੋਜ਼ ਸਵੇਰੇ ਸੈਰ ਕਰਨਗੇ।",
      "ਉਹਨਾਂ ਨੇ ਸੈਰ ਕੀਤੀ ਸੀ।",
      "ਉਹ ਸੈਰ ਕਰ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਕਰਦੇ ਸਨ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਕਰਦੇ ਹਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਪ੍ਰਸ਼ੰਸਾ ਕਰਨਗੇ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਪ੍ਰਸ਼ੰਸਾ ਕਰਦੇ ਸਨ।",
    "distractors": [
      "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਪ੍ਰਸ਼ੰਸਾ ਕਰਦੇ ਹਨ।",
      "ਅਧਿਆਪਕ ਨੇ ਪ੍ਰਸ਼ੰਸਾ ਕੀਤੀ ਸੀ।",
      "ਅਧਿਆਪਕ ਪ੍ਰਸ਼ੰਸਾ ਕਰ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਕਰਨਗੇ’ ਦਾ ਭੂਤਕਾਲ ‘ਕਰਦੇ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਦਰਜ਼ੀ ਕੁੜਤਾ ਸਿਊਂਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਦਰਜ਼ੀ ਕੁੜਤਾ ਸਿਊਂਦਾ ਸੀ।",
    "distractors": [
      "ਦਰਜ਼ੀ ਕੁੜਤਾ ਸਿਊਂਵੇਗਾ।",
      "ਦਰਜ਼ੀ ਨੇ ਕੁੜਤਾ ਸੀਤਾ ਸੀ।",
      "ਦਰਜ਼ੀ ਕੁੜਤਾ ਸੀ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਸਿਊਂਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲ ‘ਸਿਊਂਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਨਦੀ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਨਿਕਲਦੀ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਨਦੀ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਨਿਕਲੇਗੀ।",
    "distractors": [
      "ਨਦੀ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਨਿਕਲਦੀ ਸੀ।",
      "ਨਦੀ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਨਿਕਲੀ ਸੀ।",
      "ਨਦੀ ਨਿਕਲ ਰਹੀ ਹੋਵੇਗੀ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਨਿਕਲਦੀ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ‘ਨਿਕਲੇਗੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਡਾਕਟਰ ਮਰੀਜ਼ਾਂ ਦੀ ਦੇਖਭਾਲ ਕਰੇਗਾ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਡਾਕਟਰ ਮਰੀਜ਼ਾਂ ਦੀ ਦੇਖਭਾਲ ਕਰਦਾ ਹੈ।",
    "distractors": [
      "ਡਾਕਟਰ ਮਰੀਜ਼ਾਂ ਦੀ ਦੇਖਭਾਲ ਕਰਦਾ ਸੀ।",
      "ਡਾਕਟਰ ਨੇ ਦੇਖਭਾਲ ਕੀਤੀ ਸੀ।",
      "ਡਾਕਟਰ ਦੇਖਭਾਲ ਕਰ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਕਰੇਗਾ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਕਰਦਾ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਲੋਕ ਮੇਲੇ ਵਿੱਚ ਖ਼ਰੀਦਦਾਰੀ ਕਰਦੇ ਸਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਲੋਕ ਮੇਲੇ ਵਿੱਚ ਖ਼ਰੀਦਦਾਰੀ ਕਰਨਗੇ।",
    "distractors": [
      "ਲੋਕ ਮੇਲੇ ਵਿੱਚ ਖ਼ਰੀਦਦਾਰੀ ਕਰਦੇ ਹਨ।",
      "ਲੋਕਾਂ ਨੇ ਖ਼ਰੀਦਦਾਰੀ ਕੀਤੀ ਸੀ।",
      "ਲੋਕ ਖ਼ਰੀਦਦਾਰੀ ਕਰ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਕਰਦੇ ਸਨ’ ਦਾ ਭਵਿੱਖਤ ‘ਕਰਨਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਵਿਦਿਆਰਥੀ ਮਿਹਨਤ ਨਾਲ ਪੜ੍ਹਦੇ ਹਨ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਵਿਦਿਆਰਥੀ ਮਿਹਨਤ ਨਾਲ ਪੜ੍ਹਦੇ ਸਨ।",
    "distractors": [
      "ਵਿਦਿਆਰਥੀ ਮਿਹਨਤ ਨਾਲ ਪੜ੍ਹਨਗੇ।",
      "ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਮਿਹਨਤ ਨਾਲ ਪੜ੍ਹਿਆ ਹੋਵੇਗਾ।",
      "ਵਿਦਿਆਰਥੀ ਪੜ੍ਹ ਰਹੇ ਹਨ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ਕਾਲ ‘ਪੜ੍ਹਦੇ ਹਨ’ ਦਾ ਭੂਤਕਾਲ ‘ਪੜ੍ਹਦੇ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਨਵਾਂ ਮਕਾਨ ਬਣਾਇਆ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਨਵਾਂ ਮਕਾਨ ਬਣਾਉਂਦੇ ਹਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਨਵਾਂ ਮਕਾਨ ਬਣਾਵਾਂਗੇ।",
      "ਅਸੀਂ ਮਕਾਨ ਬਣਾ ਰਹੇ ਸੀ।",
      "ਅਸਾਂ ਨਵਾਂ ਮਕਾਨ ਬਣਾਉਣਾ ਹੈ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਬਣਾਇਆ ਸੀ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਬਣਾਉਂਦੇ ਹਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕੁੜੀਆਂ ਸਟੇਜ 'ਤੇ ਨੱਚਣਗੀਆਂ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਕੁੜੀਆਂ ਸਟੇਜ 'ਤੇ ਨੱਚਦੀਆਂ ਸਨ।",
    "distractors": [
      "ਕੁੜੀਆਂ ਸਟੇਜ 'ਤੇ ਨੱਚਦੀਆਂ ਹਨ।",
      "ਕੁੜੀਆਂ ਨੱਚ ਰਹੀਆਂ ਹੋਣਗੀਆਂ।",
      "ਕੁੜੀਆਂ ਨੇ ਨੱਚਣਾ ਸੀ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਨੱਚਣਗੀਆਂ’ ਦਾ ਭੂਤਕਾਲ ‘ਨੱਚਦੀਆਂ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਲੀ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਿਹਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਮਾਲੀ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਿਹਾ ਸੀ।",
    "distractors": [
      "ਮਾਲੀ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇਵੇਗਾ।",
      "ਮਾਲੀ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦਿੰਦਾ ਹੈ।",
      "ਮਾਲੀ ਨੇ ਪਾਣੀ ਦਿੱਤਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਚਾਲੂ ਵਰਤਮਾਨ ਕਾਲ ‘ਦੇ ਰਿਹਾ ਹੈ’ ਦਾ ਚਾਲੂ ਭੂਤਕਾਲ ‘ਦੇ ਰਿਹਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕਿਸਾਨ ਖੇਤਾਂ ਵਿੱਚ ਹਲ ਵਾਹ ਰਹੇ ਸਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਕਿਸਾਨ ਖੇਤਾਂ ਵਿੱਚ ਹਲ ਵਾਹ ਰਹੇ ਹੋਣਗੇ।",
    "distractors": [
      "ਕਿਸਾਨ ਖੇਤਾਂ ਵਿੱਚ ਹਲ ਵਾਹ ਰਹੇ ਹਨ।",
      "ਕਿਸਾਨਾਂ ਨੇ ਹਲ ਵਾਹਿਆ ਸੀ।",
      "ਕਿਸਾਨ ਹਲ ਵਾਹੁਣਗੇ ਹੀ।"
    ],
    "explanationPa": "ਚਾਲੂ ਭੂਤਕਾਲ ‘ਵਾਹ ਰਹੇ ਸਨ’ ਦਾ ਚਾਲੂ ਭਵਿੱਖਤ ਕਾਲ ‘ਵਾਹ ਰਹੇ ਹੋਣਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਸਿਪਾਹੀ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰਦਾ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਸਿਪਾਹੀ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰੇਗਾ।",
    "distractors": [
      "ਸਿਪਾਹੀ ਦੇਸ਼ ਦੀ ਰਾਖੀ ਕਰਦਾ ਸੀ।",
      "ਸਿਪਾਹੀ ਨੇ ਰਾਖੀ ਕੀਤੀ ਸੀ।",
      "ਸਿਪਾਹੀ ਰਾਖੀ ਕਰ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਕਰਦਾ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ਰੂਪ ‘ਕਰੇਗਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਣਗੇ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦੇ ਹਨ।",
    "distractors": [
      "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦੇ ਸਨ।",
      "ਬੱਚਿਆਂ ਨੇ ਖੇਡਣਾ ਸੀ।",
      "ਬੱਚੇ ਖੇਡ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਖੇਡਣਗੇ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਖੇਡਦੇ ਹਨ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਦਾਦੀ ਜੀ ਨੇ ਕਹਾਣੀ ਸੁਣਾਈ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਦਾਦੀ ਜੀ ਕਹਾਣੀ ਸੁਣਾਉਂਦੇ ਹਨ।",
    "distractors": [
      "ਦਾਦੀ ਜੀ ਕਹਾਣੀ ਸੁਣਾਉਣਗੇ।",
      "ਦਾਦੀ ਜੀ ਕਹਾਣੀ ਸੁਣਾ ਰਹੇ ਹੋਣਗੇ।",
      "ਦਾਦੀ ਜੀ ਨੇ ਸੁਣਾਉਣੀ ਹੈ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ਰੂਪ ‘ਸੁਣਾਉਂਦੇ ਹਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਹਵਾ ਤੇਜ਼ ਚੱਲਦੀ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਹਵਾ ਤੇਜ਼ ਚੱਲੇਗੀ।",
    "distractors": [
      "ਹਵਾ ਤੇਜ਼ ਚੱਲਦੀ ਹੈ।",
      "ਹਵਾ ਤੇਜ਼ ਚੱਲ ਰਹੀ ਹੈ।",
      "ਹਵਾ ਚੱਲਦੀ ਹੋਵੇਗੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਚੱਲਦੀ ਸੀ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਚੱਲੇਗੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਉਹ ਰੋਜ਼ ਸਵੇਰੇ ਦੌੜਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਉਹ ਰੋਜ਼ ਸਵੇਰੇ ਦੌੜਦਾ ਸੀ।",
    "distractors": [
      "ਉਹ ਰੋਜ਼ ਸਵੇਰੇ ਦੌੜੇਗਾ।",
      "ਉਹ ਸਵੇਰੇ ਦੌੜਿਆ ਕਰੇਗਾ।",
      "ਉਹ ਦੌੜ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਦੌੜਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲ ‘ਦੌੜਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਧਿਆਪਕ ਸਵਾਲ ਪੁੱਛੇਗਾ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਅਧਿਆਪਕ ਸਵਾਲ ਪੁੱਛਦਾ ਸੀ।",
    "distractors": [
      "ਅਧਿਆਪਕ ਸਵਾਲ ਪੁੱਛਦਾ ਹੈ।",
      "ਅਧਿਆਪਕ ਨੇ ਸਵਾਲ ਪੁੱਛਿਆ ਹੋਵੇਗਾ।",
      "ਅਧਿਆਪਕ ਪੁੱਛ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਪੁੱਛੇਗਾ’ ਦਾ ਭੂਤਕਾਲ ‘ਪੁੱਛਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਰੀਜ਼ ਦਵਾਈ ਲੈਂਦਾ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਮਰੀਜ਼ ਦਵਾਈ ਲਵੇਗਾ।",
    "distractors": [
      "ਮਰੀਜ਼ ਦਵਾਈ ਲੈਂਦਾ ਸੀ।",
      "ਮਰੀਜ਼ ਨੇ ਦਵਾਈ ਲਈ ਸੀ।",
      "ਮਰੀਜ਼ ਦਵਾਈ ਲੈ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਲੈਂਦਾ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ‘ਲਵੇਗਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਸੈਰ ਕਰ ਰਹੇ ਹਾਂ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਸੈਰ ਕਰ ਰਹੇ ਸਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਸੈਰ ਕਰ ਰਹੇ ਹੋਵਾਂਗੇ।",
      "ਅਸੀਂ ਸੈਰ ਕਰਾਂਗੇ।",
      "ਅਸੀਂ ਸੈਰ ਕਰਦੇ ਹਾਂ।"
    ],
    "explanationPa": "ਚਾਲੂ ਵਰਤਮਾਨ ‘ਕਰ ਰਹੇ ਹਾਂ’ ਦਾ ਭੂਤਕਾਲ ‘ਕਰ ਰਹੇ ਸਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕੁੜੀ ਚਿੱਠੀ ਲਿਖੇਗੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਕੁੜੀ ਚਿੱਠੀ ਲਿਖਦੀ ਹੈ।",
    "distractors": [
      "ਕੁੜੀ ਚਿੱਠੀ ਲਿਖਦੀ ਸੀ।",
      "ਕੁੜੀ ਨੇ ਚਿੱਠੀ ਲਿਖੀ ਸੀ।",
      "ਕੁੜੀ ਚਿੱਠੀ ਲਿਖ ਰਹੀ ਸੀ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਲਿਖੇਗੀ’ ਦਾ ਵਰਤਮਾਨ ਕਾਲ ‘ਲਿਖਦੀ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਸੂਰਜ ਪੱਛਮ ਵਿੱਚ ਛਿਪਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਸੂਰਜ ਪੱਛਮ ਵਿੱਚ ਛਿਪਦਾ ਸੀ।",
    "distractors": [
      "ਸੂਰਜ ਪੱਛਮ ਵਿੱਚ ਛਿਪੇਗਾ।",
      "ਸੂਰਜ ਛਿਪ ਰਿਹਾ ਹੈ।",
      "ਸੂਰਜ ਛਿਪ ਗਿਆ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਛਿਪਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲ ‘ਛਿਪਦਾ ਸੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਉਹ ਗ਼ਰੀਬਾਂ ਦੀ ਮਦਦ ਕਰਨਗੇ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਉਹ ਗ਼ਰੀਬਾਂ ਦੀ ਮਦਦ ਕਰਦੇ ਹਨ।",
    "distractors": [
      "ਉਹ ਗ਼ਰੀਬਾਂ ਦੀ ਮਦਦ ਕਰਦੇ ਸਨ।",
      "ਉਹਨਾਂ ਨੇ ਮਦਦ ਕੀਤੀ ਸੀ।",
      "ਉਹ ਮਦਦ ਕਰ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਕਰਨਗੇ’ ਦਾ ਵਰਤਮਾਨ ‘ਕਰਦੇ ਹਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾਉਂਦੇ ਸਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾਉਣਗੇ।",
    "distractors": [
      "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾਉਂਦੇ ਹਨ।",
      "ਮਾਤਾ ਜੀ ਨੇ ਰੋਟੀ ਪਕਾਈ ਸੀ।",
      "ਮਾਤਾ ਜੀ ਰੋਟੀ ਪਕਾ ਰਹੇ ਹਨ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਪਕਾਉਂਦੇ ਸਨ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਪਕਾਉਣਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਦਰਜ਼ੀ ਵਰਦੀ ਸਿਊਂਦਾ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਦਰਜ਼ੀ ਵਰਦੀ ਸਿਊਂਦਾ ਹੈ।",
    "distractors": [
      "ਦਰਜ਼ੀ ਵਰਦੀ ਸਿਊਂਵੇਗਾ।",
      "ਦਰਜ਼ੀ ਨੇ ਵਰਦੀ ਸੀਤੀ ਸੀ।",
      "ਦਰਜ਼ੀ ਵਰਦੀ ਸੀ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਸਿਊਂਦਾ ਸੀ’ ਦਾ ਵਰਤਮਾਨ ‘ਸਿਊਂਦਾ ਹੈ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਲੋਕ ਮੇਲੇ ਵਿੱਚ ਗਏ ਸਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਲੋਕ ਮੇਲੇ ਵਿੱਚ ਜਾਣਗੇ।",
    "distractors": [
      "ਲੋਕ ਮੇਲੇ ਵਿੱਚ ਜਾਂਦੇ ਹਨ।",
      "ਲੋਕ ਮੇਲੇ ਵਿੱਚ ਜਾ ਰਹੇ ਹਨ।",
      "ਲੋਕ ਮੇਲੇ ਗਏ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਗਏ ਸਨ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਜਾਣਗੇ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਡਾਕਟਰ ਟੀਕਾ ਲਗਾਵੇਗਾ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਡਾਕਟਰ ਟੀਕਾ ਲਗਾਉਂਦਾ ਹੈ।",
    "distractors": [
      "ਡਾਕਟਰ ਟੀਕਾ ਲਗਾਉਂਦਾ ਸੀ।",
      "ਡਾਕਟਰ ਨੇ ਟੀਕਾ ਲਗਾਇਆ ਸੀ।",
      "ਡਾਕਟਰ ਟੀਕਾ ਲਗਾ ਰਿਹਾ ਸੀ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਲਗਾਵੇਗਾ’ ਦਾ ਵਰਤਮਾਨ ‘ਲਗਾਉਂਦਾ ਹੈ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਸੀ।",
    "distractors": [
      "ਬੱਚਾ ਦੁੱਧ ਪੀਵੇਗਾ।",
      "ਬੱਚੇ ਨੇ ਦੁੱਧ ਪੀਤਾ ਹੋਵੇਗਾ।",
      "ਬੱਚਾ ਦੁੱਧ ਪੀ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਪੀਂਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲ ‘ਪੀਂਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਨੌਕਰ ਸਫ਼ਾਈ ਕਰਦਾ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਨੌਕਰ ਸਫ਼ਾਈ ਕਰੇਗਾ।",
    "distractors": [
      "ਨੌਕਰ ਸਫ਼ਾਈ ਕਰਦਾ ਹੈ।",
      "ਨੌਕਰ ਨੇ ਸਫ਼ਾਈ ਕੀਤੀ ਸੀ।",
      "ਨੌਕਰ ਸਫ਼ਾਈ ਕਰ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਕਰਦਾ ਸੀ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਕਰੇਗਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਗਾਇਕ ਗੀਤ ਗਾਉਂਦਾ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਗਾਇਕ ਗੀਤ ਗਾਵੇਗਾ।",
    "distractors": [
      "ਗਾਇਕ ਗੀਤ ਗਾਉਂਦਾ ਸੀ।",
      "ਗਾਇਕ ਨੇ ਗੀਤ ਗਾਇਆ ਸੀ।",
      "ਗਾਇਕ ਗੀਤ ਗਾ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਗਾਉਂਦਾ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ‘ਗਾਵੇਗਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਨਦੀ ਵਿੱਚ ਤਰਦੇ ਸਾਂ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਨਦੀ ਵਿੱਚ ਤਰਦੇ ਹਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਨਦੀ ਵਿੱਚ ਤਰਾਂਗੇ।",
      "ਅਸਾਂ ਨਦੀ ਵਿੱਚ ਤਰਨਾ ਸੀ।",
      "ਅਸੀਂ ਨਦੀ ਤਰ ਰਹੇ ਸਾਂ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਤਰਦੇ ਸਾਂ’ ਦਾ ਵਰਤਮਾਨ ‘ਤਰਦੇ ਹਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਸਰਪੰਚ ਭਾਸ਼ਣ ਦੇਵੇਗਾ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਸਰਪੰਚ ਭਾਸ਼ਣ ਦਿੰਦਾ ਸੀ।",
    "distractors": [
      "ਸਰਪੰਚ ਭਾਸ਼ਣ ਦਿੰਦਾ ਹੈ।",
      "ਸਰਪੰਚ ਨੇ ਭਾਸ਼ਣ ਦਿੱਤਾ ਹੋਵੇਗਾ।",
      "ਸਰਪੰਚ ਭਾਸ਼ਣ ਦੇ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਦੇਵੇਗਾ’ ਦਾ ਭੂਤਕਾਲ ‘ਦਿੰਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮਾਲੀ ਘਾਹ ਕੱਟਦਾ ਹੈ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਮਾਲੀ ਘਾਹ ਕੱਟਦਾ ਸੀ।",
    "distractors": [
      "ਮਾਲੀ ਘਾਹ ਕੱਟੇਗਾ।",
      "ਮਾਲੀ ਨੇ ਘਾਹ ਕੱਟਿਆ ਹੋਵੇਗਾ।",
      "ਮਾਲੀ ਘਾਹ ਕੱਟ ਰਿਹਾ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਕੱਟਦਾ ਹੈ’ ਦਾ ਭੂਤਕਾਲ ‘ਕੱਟਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਉਹ ਗੱਡੀ ਚਲਾਉਂਦੇ ਸਨ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਉਹ ਗੱਡੀ ਚਲਾਉਣਗੇ।",
    "distractors": [
      "ਉਹ ਗੱਡੀ ਚਲਾਉਂਦੇ ਹਨ।",
      "ਉਹਨਾਂ ਨੇ ਗੱਡੀ ਚਲਾਈ ਸੀ।",
      "ਉਹ ਗੱਡੀ ਚਲਾ ਰਹੇ ਹੋਣਗੇ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਚਲਾਉਂਦੇ ਸਨ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਚਲਾਉਣਗੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕੁੜੀ ਫੁੱਲ ਤੋੜਦੀ ਹੈ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਕੁੜੀ ਫੁੱਲ ਤੋੜੇਗੀ।",
    "distractors": [
      "ਕੁੜੀ ਫੁੱਲ ਤੋੜਦੀ ਸੀ।",
      "ਕੁੜੀ ਨੇ ਫੁੱਲ ਤੋੜਿਆ ਸੀ।",
      "ਕੁੜੀ ਫੁੱਲ ਤੋੜ ਰਹੀ ਹੈ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਤੋੜਦੀ ਹੈ’ ਦਾ ਭਵਿੱਖਤ ‘ਤੋੜੇਗੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਚੋਰ ਦੀਵਾਰ ਟੱਪਦਾ ਸੀ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਚੋਰ ਦੀਵਾਰ ਟੱਪਦਾ ਹੈ।",
    "distractors": [
      "ਚੋਰ ਦੀਵਾਰ ਟੱਪੇਗਾ।",
      "ਚੋਰ ਨੇ ਦੀਵਾਰ ਟੱਪੀ ਸੀ।",
      "ਚੋਰ ਦੀਵਾਰ ਟੱਪ ਰਿਹਾ ਸੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਟੱਪਦਾ ਸੀ’ ਦਾ ਵਰਤਮਾਨ ‘ਟੱਪਦਾ ਹੈ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਸੱਚ ਬੋਲਾਂਗੇ।",
    "targetTense": "ਵਰਤਮਾਨ ਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਸੱਚ ਬੋਲਦੇ ਹਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਸੱਚ ਬੋਲਦੇ ਸਾਂ।",
      "ਅਸਾਂ ਸੱਚ ਬੋਲਿਆ ਸੀ।",
      "ਅਸੀਂ ਸੱਚ ਬੋਲ ਰਹੇ ਹੋਵਾਂਗੇ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਬੋਲਾਂਗੇ’ ਦਾ ਵਰਤਮਾਨ ‘ਬੋਲਦੇ ਹਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਬਿੱਲੀ ਦੁੱਧ ਪੀਂਦੀ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਬਿੱਲੀ ਦੁੱਧ ਪੀਵੇਗੀ।",
    "distractors": [
      "ਬਿੱਲੀ ਦੁੱਧ ਪੀਂਦੀ ਹੈ।",
      "ਬਿੱਲੀ ਨੇ ਦੁੱਧ ਪੀਤਾ ਸੀ।",
      "ਬਿੱਲੀ ਦੁੱਧ ਪੀ ਰਹੀ ਹੈ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਪੀਂਦੀ ਸੀ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਪੀਵੇਗੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਕਿਸਾਨ ਅਨਾਜ ਵੇਚੇਗਾ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਕਿਸਾਨ ਅਨਾਜ ਵੇਚਦਾ ਸੀ।",
    "distractors": [
      "ਕਿਸਾਨ ਅਨਾਜ ਵੇਚਦਾ ਹੈ।",
      "ਕਿਸਾਨ ਨੇ ਅਨਾਜ ਵੇਚਿਆ ਸੀ।",
      "ਕਿਸਾਨ ਅਨਾਜ ਵੇਚ ਰਿਹਾ ਹੋਵੇਗਾ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਵੇਚੇਗਾ’ ਦਾ ਭੂਤਕਾਲ ‘ਵੇਚਦਾ ਸੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਮੁੰਡੇ ਗੇਂਦ ਸੁੱਟਦੇ ਹਨ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਮੁੰਡੇ ਗੇਂਦ ਸੁੱਟਦੇ ਸਨ।",
    "distractors": [
      "ਮੁੰਡੇ ਗੇਂਦ ਸੁੱਟਣਗੇ।",
      "ਮੁੰਡਿਆਂ ਨੇ ਗੇਂਦ ਸੁੱਟੀ ਸੀ।",
      "ਮੁੰਡੇ ਗੇਂਦ ਸੁੱਟ ਰਹੇ ਹਨ।"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ‘ਸੁੱਟਦੇ ਹਨ’ ਦਾ ਭੂਤਕਾਲ ‘ਸੁੱਟਦੇ ਸਨ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਅਸੀਂ ਰੇਲਗੱਡੀ ਰਾਹੀਂ ਜਾਵਾਂਗੇ।",
    "targetTense": "ਭੂਤਕਾਲ",
    "convertedSentence": "ਅਸੀਂ ਰੇਲਗੱਡੀ ਰਾਹੀਂ ਜਾਂਦੇ ਸਾਂ।",
    "distractors": [
      "ਅਸੀਂ ਰੇਲਗੱਡੀ ਰਾਹੀਂ ਜਾਂਦੇ ਹਾਂ।",
      "ਅਸੀਂ ਰੇਲਗੱਡੀ ਰਾਹੀਂ ਗਏ ਸਾਂ।",
      "ਅਸੀਂ ਜਾ ਰਹੇ ਹੋਵਾਂਗੇ।"
    ],
    "explanationPa": "ਭਵਿੱਖਤ ‘ਜਾਵਾਂਗੇ’ ਦਾ ਭੂਤਕਾਲ ‘ਜਾਂਦੇ ਸਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "baseSentence": "ਪੁਲਿਸ ਪਹਿਰਾ ਦਿੰਦੀ ਸੀ।",
    "targetTense": "ਭਵਿੱਖਤ ਕਾਲ",
    "convertedSentence": "ਪੁਲਿਸ ਪਹਿਰਾ ਦੇਵੇਗੀ।",
    "distractors": [
      "ਪੁਲਿਸ ਪਹਿਰਾ ਦਿੰਦੀ ਹੈ।",
      "ਪੁਲਿਸ ਨੇ ਪਹਿਰਾ ਦਿੱਤਾ ਸੀ।",
      "ਪੁਲਿਸ ਪਹਿਰਾ ਦੇ ਰਹੀ ਸੀ।"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ‘ਦਿੰਦੀ ਸੀ’ ਦਾ ਭਵਿੱਖਤ ਕਾਲ ‘ਦੇਵੇਗੀ’ ਹੁੰਦਾ ਹੈ।"
  }
];

export const TRANSITIVITY_CONVERSIONS: readonly TransitivityConversionItem[] = [
  {
    "intransitive": "ਉੱਠਣਾ",
    "transitive": "ਉਠਾਉਣਾ",
    "distractors": [
      "ਉੱਠਿਆ",
      "ਉਠਾਈ",
      "ਉੱਠਵ"
    ],
    "explanationPa": "ਅਕਰਮਕ ਕਿਰਿਆ ‘ਉੱਠਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਉਠਾਉਣਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਮੁੜਨਾ",
    "transitive": "ਮੋੜਨਾ",
    "distractors": [
      "ਮੁੜਿਆ",
      "ਮੋੜ",
      "ਮੁੜਾਈ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਮੁੜਨਾ’ ਨੂੰ ਸਕਰਮਕ ਬਣਾਉਣ 'ਤੇ ‘ਮੋੜਨਾ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਜੁੜਨਾ",
    "transitive": "ਜੋੜਨਾ",
    "distractors": [
      "ਜੁੜਿਆ",
      "ਜੋੜ",
      "ਜੁੜਵਾਂ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਜੁੜਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਜੋੜਨਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਸੜਨਾ",
    "transitive": "ਸਾੜਨਾ",
    "distractors": [
      "ਸੜਿਆ",
      "ਸਾੜ",
      "ਸੜਾਈ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਸੜਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਸਾੜਨਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਟੁੱਟਣਾ",
    "transitive": "ਤੋੜਨਾ",
    "distractors": [
      "ਟੁੱਟਿਆ",
      "ਤੋੜ",
      "ਟੋਟਾ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਟੁੱਟਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਤੋੜਨਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਤਰਨਾ",
    "transitive": "ਤਾਰਨਾ",
    "distractors": [
      "ਤਰਿਆ",
      "ਤਾਰੂ",
      "ਤਾਰ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਤਰਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਤਾਰਨਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਪੱਕਣਾ",
    "transitive": "ਪਕਾਉਣਾ",
    "distractors": [
      "ਪੱਕਿਆ",
      "ਪਕਾਈ",
      "ਪੱਕਾ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਪੱਕਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਪਕਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਖਿੜਨਾ",
    "transitive": "ਖਿੜਾਉਣਾ",
    "distractors": [
      "ਖਿੜਿਆ",
      "ਖੇੜਾ",
      "ਖਿੜਵ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਖਿੜਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਖਿੜਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਬਣਨਾ",
    "transitive": "ਬਣਾਉਣਾ",
    "distractors": [
      "ਬਣਿਆ",
      "ਬਣਤਰ",
      "ਬਣਾਈ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਬਣਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਬਣਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਫੁੱਟਣਾ",
    "transitive": "ਫੋੜਨਾ",
    "distractors": [
      "ਫੁੱਟਿਆ",
      "ਫੋੜਾ",
      "ਫੁੱਟ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਫੁੱਟਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਫੋੜਨਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਸੁੱਕਣਾ",
    "transitive": "ਸੁਕਾਉਣਾ",
    "distractors": [
      "ਸੁੱਕਿਆ",
      "ਸੁੱਕਾ",
      "ਸੁਕਾਈ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਸੁੱਕਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਸੁਕਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਮਰਨਾ",
    "transitive": "ਮਾਰਨਾ",
    "distractors": [
      "ਮਰਿਆ",
      "ਮੌਤ",
      "ਮਰਊ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਮਰਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਮਾਰਨਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਡਿੱਗਣਾ",
    "transitive": "ਡੇਗਣਾ",
    "distractors": [
      "ਡਿੱਗਿਆ",
      "ਢਹਿਣਾ",
      "ਡਿਗਾਈ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਡਿੱਗਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਡੇਗਣਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਛਿਪਣਾ",
    "transitive": "ਛੁਪਾਉਣਾ",
    "distractors": [
      "ਛਿਪਿਆ",
      "ਛੁਪਨ",
      "ਛਾਂ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਛਿਪਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਛੁਪਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਹਿੱਲਣਾ",
    "transitive": "ਹਿਲਾਉਣਾ",
    "distractors": [
      "ਹਿੱਲਿਆ",
      "ਹਿੱਲਜੁੱਲ",
      "ਹਾਲਾ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਹਿੱਲਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਹਿਲਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਲਟਕਣਾ",
    "transitive": "ਲਟਕਾਉਣਾ",
    "distractors": [
      "ਲਟਕਿਆ",
      "ਲਟਕਣ",
      "ਲਟਕ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਲਟਕਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਲਟਕਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਘੁਲਣਾ",
    "transitive": "ਘੋਲਣਾ",
    "distractors": [
      "ਘੁਲਿਆ",
      "ਘੋਲ",
      "ਘੁਲਾਈ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਘੁਲਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਘੋਲਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਬਲਣਾ",
    "transitive": "ਬਾਲਣਾ",
    "distractors": [
      "ਬਲਿਆ",
      "ਬਾਲਣ",
      "ਬਲਵਾਂ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਬਲਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਬਾਲਣਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਵਗਣਾ",
    "transitive": "ਵਗਾਉਣਾ",
    "distractors": [
      "ਵਗਿਆ",
      "ਵਹਾਅ",
      "ਵਗਤ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਵਗਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਵਗਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਉੱਬਲਣਾ",
    "transitive": "ਉਬਾਲਣਾ",
    "distractors": [
      "ਉੱਬਲਿਆ",
      "ਉਬਾਲ",
      "ਉਬਾਲੀ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਉੱਬਲਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਉਬਾਲਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਖੁੱਲ੍ਹਣਾ",
    "transitive": "ਖੋਲ੍ਹਣਾ",
    "distractors": [
      "ਖੁੱਲ੍ਹਿਆ",
      "ਖੁੱਲ੍ਹਾ",
      "ਖੋਲ੍ਹ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਖੁੱਲ੍ਹਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਖੋਲ੍ਹਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਤੁਰਨਾ",
    "transitive": "ਤੋਰਨਾ",
    "distractors": [
      "ਤੁਰਿਆ",
      "ਤੋਰ",
      "ਤੁਰੰਤ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਤੁਰਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਤੋਰਨਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਰੁਕਣਾ",
    "transitive": "ਰੋਕਣਾ",
    "distractors": [
      "ਰੁਕਿਆ",
      "ਰੁਕਾਵਟ",
      "ਰੋਕ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਰੁਕਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਰੋਕਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਝੁਕਣਾ",
    "transitive": "ਝੁਕਾਉਣਾ",
    "distractors": [
      "ਝੁਕਿਆ",
      "ਝੁਕਾਵ",
      "ਝੁੱਕ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਝੁਕਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਝੁਕਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਡੁੱਬਣਾ",
    "transitive": "ਡੋਬਣਾ",
    "distractors": [
      "ਡੁੱਬਿਆ",
      "ਡੋਬੂ",
      "ਡੁੱਬ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਡੁੱਬਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਡੋਬਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਭੁੱਲਣਾ",
    "transitive": "ਭੁਲਾਉਣਾ",
    "distractors": [
      "ਭੁੱਲਿਆ",
      "ਭੁਲੇਖਾ",
      "ਭੁੱਲ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਭੁੱਲਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਭੁਲਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਛੁੱਟਣਾ",
    "transitive": "ਛੱਡਣਾ",
    "distractors": [
      "ਛੁੱਟਿਆ",
      "ਛੁੱਟੀ",
      "ਛੁਟਕਾਰਾ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਛੁੱਟਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਛੱਡਣਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "intransitive": "ਫੈਲਣਾ",
    "transitive": "ਫੈਲਾਉਣਾ",
    "distractors": [
      "ਫੈਲਿਆ",
      "ਫੈਲਾਅ",
      "ਫੈਲ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਫੈਲਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਫੈਲਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਚਿਪਕਣਾ",
    "transitive": "ਚਿਪਕਾਉਣਾ",
    "distractors": [
      "ਚਿਪਕਿਆ",
      "ਚਿਪਚਿਪਾ",
      "ਚੇਪ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਚਿਪਕਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਚਿਪਕਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਦਬਣਾ",
    "transitive": "ਦਬਾਉਣਾ",
    "distractors": [
      "ਦਬਿਆ",
      "ਦਬਾਅ",
      "ਦਬਦਬਾ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਦਬਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਦਬਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਗਲਣਾ",
    "transitive": "ਗਾਲਣਾ",
    "distractors": [
      "ਗਲਿਆ",
      "ਗਲਨ",
      "ਗਾਲ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਗਲਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਗਾਲਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਸੁੰਗੜਨਾ",
    "transitive": "ਸੁੰਗੜਾਉਣਾ",
    "distractors": [
      "ਸੁੰਗੜਿਆ",
      "ਸੰਕੋਚ",
      "ਸੁੰਗੜ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਸੁੰਗੜਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਸੁੰਗੜਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਚਮਕਣਾ",
    "transitive": "ਚਮਕਾਉਣਾ",
    "distractors": [
      "ਚਮਕਿਆ",
      "ਚਮਕ",
      "ਚਮਕੀਲਾ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਚਮਕਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਚਮਕਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਹਾਰਨਾ",
    "transitive": "ਹਰਾਉਣਾ",
    "distractors": [
      "ਹਾਰਿਆ",
      "ਹਾਰ",
      "ਹਾਰੂ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਹਾਰਨਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਹਰਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਜਾਗਣਾ",
    "transitive": "ਜਗਾਉਣਾ",
    "distractors": [
      "ਜਾਗਿਆ",
      "ਜਾਗ",
      "ਜਾਗ੍ਰਿਤੀ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਜਾਗਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਜਗਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਘੁੰਮਣਾ",
    "transitive": "ਘੁਮਾਉਣਾ",
    "distractors": [
      "ਘੁੰਮਿਆ",
      "ਘੁੰਮਣਘੇਰੀ",
      "ਚੱਕਰ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਘੁੰਮਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਘੁਮਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਕੰਬਣਾ",
    "transitive": "ਕੰਬਾਉਣਾ",
    "distractors": [
      "ਕੰਬਿਆ",
      "ਕੰਬਣੀ",
      "ਕੰਬਊ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਕੰਬਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਕੰਬਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਵੱਧਣਾ",
    "transitive": "ਵਧਾਉਣਾ",
    "distractors": [
      "ਵੱਧਿਆ",
      "ਵਾਧਾ",
      "ਵਧੀਕ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਵੱਧਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਵਧਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਘਟਣਾ",
    "transitive": "ਘਟਾਉਣਾ",
    "distractors": [
      "ਘਟਿਆ",
      "ਘਾਟਾ",
      "ਘਾਟ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਘਟਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਘਟਾਉਣਾ’ ਹੈ।"
  },
  {
    "intransitive": "ਰਿੱਝਣਾ",
    "transitive": "ਰਿੰਨ੍ਹਣਾ",
    "distractors": [
      "ਰਿੱਝਿਆ",
      "ਰੀਝ",
      "ਰਿੰਨ੍ਹ"
    ],
    "explanationPa": "ਅਕਰਮਕ ‘ਰਿੱਝਣਾ’ ਦਾ ਸਕਰਮਕ ਰੂਪ ‘ਰਿੰਨ੍ਹਣਾ’ ਹੁੰਦਾ ਹੈ।"
  }
];

export const COMPOUND_VERB_ITEMS: readonly CompoundVerbItem[] = [
  {
    "sentence": "ਉਸਨੇ ਆਪਣਾ ਸਾਰਾ ਕੰਮ ਮੁਕਾ ਲਿਆ।",
    "compoundVerb": "ਮੁਕਾ ਲਿਆ",
    "mainVerb": "ਮੁਕਾ",
    "sanchalakVerb": "ਲਿਆ",
    "explanationPa": "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਮੁਕਾ ਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ, ਜਿਸ ਵਿੱਚ ‘ਮੁਕਾ’ ਮੁੱਖ ਕਿਰਿਆ ਅਤੇ ‘ਲਿਆ’ ਸੰਚਾਲਕ ਸਹਾਇਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬੱਚਾ ਖਿਡੌਣਾ ਟੁੱਟਣ 'ਤੇ ਅਚਾਨਕ ਰੋ ਪਿਆ।",
    "compoundVerb": "ਰੋ ਪਿਆ",
    "mainVerb": "ਰੋ",
    "sanchalakVerb": "ਪਿਆ",
    "explanationPa": "ਇੱਥੇ ‘ਰੋ ਪਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ ਅਤੇ ‘ਪਿਆ’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਵਜੋਂ ਕੰਮ ਕਰਦੀ ਹੈ।"
  },
  {
    "sentence": "ਮਾਸਟਰ ਜੀ ਨੇ ਸਾਰੇ ਪਾਠ ਦੀ ਵਿਆਖਿਆ ਕਰ ਦਿੱਤੀ।",
    "compoundVerb": "ਕਰ ਦਿੱਤੀ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਦਿੱਤੀ",
    "explanationPa": "‘ਕਰ ਦਿੱਤੀ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ ਜਿਸ ਵਿੱਚ ‘ਦਿੱਤੀ’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਹਿਮਾਨ ਚਾਹ ਪੀ ਕੇ ਆਪਣੇ ਘਰ ਤੁਰ ਪਏ।",
    "compoundVerb": "ਤੁਰ ਪਏ",
    "mainVerb": "ਤੁਰ",
    "sanchalakVerb": "ਪਏ",
    "explanationPa": "‘ਤੁਰ ਪਏ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ ਜਿਸ ਵਿੱਚ ਮੁੱਖ ਕਿਰਿਆ ‘ਤੁਰ’ ਅਤੇ ਸੰਚਾਲਕ ‘ਪਏ’ ਹੈ।"
  },
  {
    "sentence": "ਬਿੱਲੀ ਨੂੰ ਵੇਖ ਕੇ ਚੂਹਾ ਖੁੱਡ ਵਿੱਚ ਵੜ ਗਿਆ।",
    "compoundVerb": "ਵੜ ਗਿਆ",
    "mainVerb": "ਵੜ",
    "sanchalakVerb": "ਗਿਆ",
    "explanationPa": "ਇਸ ਵਿੱਚ ‘ਵੜ ਗਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ ਅਤੇ ‘ਗਿਆ’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਗਵੱਈਏ ਨੇ ਸਭਾ ਵਿੱਚ ਸੁਰੀਲਾ ਗੀਤ ਗਾ ਸੁਣਾਇਆ।",
    "compoundVerb": "ਗਾ ਸੁਣਾਇਆ",
    "mainVerb": "ਗਾ",
    "sanchalakVerb": "ਸੁਣਾਇਆ",
    "explanationPa": "‘ਗਾ ਸੁਣਾਇਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ, ਜਿੱਥੇ ‘ਸੁਣਾਇਆ’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਵਜੋਂ ਆਇਆ ਹੈ।"
  },
  {
    "sentence": "ਪੁਲਿਸ ਨੂੰ ਵੇਖਦਿਆਂ ਹੀ ਮੁਲਜ਼ਮ ਭੱਜ ਨਿਕਲਿਆ।",
    "compoundVerb": "ਭੱਜ ਨਿਕਲਿਆ",
    "mainVerb": "ਭੱਜ",
    "sanchalakVerb": "ਨਿਕਲਿਆ",
    "explanationPa": "‘ਭੱਜ ਨਿਕਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ ਅਤੇ ‘ਨਿਕਲਿਆ’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਜ਼ਦੂਰਾਂ ਨੇ ਸ਼ਾਮ ਤੱਕ ਕੰਧ ਉਸਾਰ ਦਿੱਤੀ।",
    "compoundVerb": "ਉਸਾਰ ਦਿੱਤੀ",
    "mainVerb": "ਉਸਾਰ",
    "sanchalakVerb": "ਦਿੱਤੀ",
    "explanationPa": "ਇਸ ਵਿੱਚ ‘ਉਸਾਰ ਦਿੱਤੀ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦਾਦੀ ਜੀ ਨੇ ਬੱਚਿਆਂ ਨੂੰ ਸਿੱਖਿਆਦਾਇਕ ਕਹਾਣੀ ਕਹਿ ਸੁਣਾਈ।",
    "compoundVerb": "ਕਹਿ ਸੁਣਾਈ",
    "mainVerb": "ਕਹਿ",
    "sanchalakVerb": "ਸੁਣਾਈ",
    "explanationPa": "‘ਕਹਿ ਸੁਣਾਈ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ ਜਿਸ ਵਿੱਚ ‘ਸੁਣਾਈ’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਹਨੇਰੀ ਆਉਣ ਨਾਲ ਛੱਤ ਦਾ ਟੀਨ ਉੱਡ ਗਿਆ।",
    "compoundVerb": "ਉੱਡ ਗਿਆ",
    "mainVerb": "ਉੱਡ",
    "sanchalakVerb": "ਗਿਆ",
    "explanationPa": "‘ਉੱਡ ਗਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਕਿਸਾਨ ਨੇ ਪੱਕੀ ਹੋਈ ਫ਼ਸਲ ਵੱਢ ਲਈ।",
    "compoundVerb": "ਵੱਢ ਲਈ",
    "mainVerb": "ਵੱਢ",
    "sanchalakVerb": "ਲਈ",
    "explanationPa": "‘ਵੱਢ ਲਈ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ ਜਿਸ ਵਿੱਚ ‘ਲਈ’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਉਸਨੇ ਆਪਣੀ ਗ਼ਲਤੀ ਕਬੂਲ ਕਰ ਲਈ।",
    "compoundVerb": "ਕਰ ਲਈ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਲਈ",
    "explanationPa": "‘ਕਰ ਲਈ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਾਂ ਨੇ ਬੱਚੇ ਨੂੰ ਗੋਦੀ ਵਿੱਚ ਚੁੱਕ ਲਿਆ।",
    "compoundVerb": "ਚੁੱਕ ਲਿਆ",
    "mainVerb": "ਚੁੱਕ",
    "sanchalakVerb": "ਲਿਆ",
    "explanationPa": "‘ਚੁੱਕ ਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦਰਵਾਜ਼ੇ ਦੀ ਘੰਟੀ ਵੱਜਦਿਆਂ ਹੀ ਉਹ ਉੱਠ ਖੜੋਤਾ।",
    "compoundVerb": "ਉੱਠ ਖੜੋਤਾ",
    "mainVerb": "ਉੱਠ",
    "sanchalakVerb": "ਖੜੋਤਾ",
    "explanationPa": "‘ਉੱਠ ਖੜੋਤਾ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਜੱਜ ਸਾਹਿਬ ਨੇ ਮੁਜਰਿਮ ਨੂੰ ਸਜ਼ਾ ਸੁਣਾ ਦਿੱਤੀ।",
    "compoundVerb": "ਸੁਣਾ ਦਿੱਤੀ",
    "mainVerb": "ਸੁਣਾ",
    "sanchalakVerb": "ਦਿੱਤੀ",
    "explanationPa": "‘ਸੁਣਾ ਦਿੱਤੀ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਸਿਪਾਹੀ ਨੇ ਚੋਰ ਨੂੰ ਫੜ ਲਿਆ।",
    "compoundVerb": "ਫੜ ਲਿਆ",
    "mainVerb": "ਫੜ",
    "sanchalakVerb": "ਲਿਆ",
    "explanationPa": "‘ਫੜ ਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਲੜਕੀ ਨੇ ਸੁੰਦਰ ਤਸਵੀਰ ਬਣਾ ਲਈ।",
    "compoundVerb": "ਬਣਾ ਲਈ",
    "mainVerb": "ਬਣਾ",
    "sanchalakVerb": "ਲਈ",
    "explanationPa": "‘ਬਣਾ ਲਈ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਵਿਦਿਆਰਥੀ ਨੇ ਇਮਤਿਹਾਨ ਪਾਸ ਕਰ ਲਿਆ।",
    "compoundVerb": "ਕਰ ਲਿਆ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਲਿਆ",
    "explanationPa": "‘ਕਰ ਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਮਾਲੀ ਨੇ ਸੁੱਕੇ ਪੱਤੇ ਇਕੱਠੇ ਕਰ ਦਿੱਤੇ।",
    "compoundVerb": "ਕਰ ਦਿੱਤੇ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਦਿੱਤੇ",
    "explanationPa": "‘ਕਰ ਦਿੱਤੇ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਡਾਕਟਰ ਨੇ ਮਰੀਜ਼ ਨੂੰ ਦਵਾਈ ਦੇ ਦਿੱਤੀ।",
    "compoundVerb": "ਦੇ ਦਿੱਤੀ",
    "mainVerb": "ਦੇ",
    "sanchalakVerb": "ਦਿੱਤੀ",
    "explanationPa": "‘ਦੇ ਦਿੱਤੀ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬਜ਼ੁਰਗ ਨੇ ਠੰਢ ਵਿੱਚ ਕੰਬਲ ਓੜ੍ਹ ਲਿਆ।",
    "compoundVerb": "ਓੜ੍ਹ ਲਿਆ",
    "mainVerb": "ਓੜ੍ਹ",
    "sanchalakVerb": "ਲਿਆ",
    "explanationPa": "‘ਓੜ੍ਹ ਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਰਾਹੀ ਨੇ ਰੁੱਖ ਦੀ ਛਾਂ ਹੇਠ ਆਰਾਮ ਕਰ ਲਿਆ।",
    "compoundVerb": "ਕਰ ਲਿਆ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਲਿਆ",
    "explanationPa": "‘ਕਰ ਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਉਸਨੇ ਅਚਾਨਕ ਖ਼ੁਸ਼ੀ ਵਿੱਚ ਰੌਲਾ ਪਾ ਦਿੱਤਾ।",
    "compoundVerb": "ਪਾ ਦਿੱਤਾ",
    "mainVerb": "ਪਾ",
    "sanchalakVerb": "ਦਿੱਤਾ",
    "explanationPa": "‘ਪਾ ਦਿੱਤਾ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਬੱਚੇ ਨੇ ਗੁਬਾਰਾ ਹਵਾ ਵਿੱਚ ਛੱਡ ਦਿੱਤਾ।",
    "compoundVerb": "ਛੱਡ ਦਿੱਤਾ",
    "mainVerb": "ਛੱਡ",
    "sanchalakVerb": "ਦਿੱਤਾ",
    "explanationPa": "‘ਛੱਡ ਦਿੱਤਾ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਰਸੋਈਏ ਨੇ ਸੁਆਦੀ ਖਾਣਾ ਤਿਆਰ ਕਰ ਲਿਆ।",
    "compoundVerb": "ਕਰ ਲਿਆ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਲਿਆ",
    "explanationPa": "‘ਕਰ ਲਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਖਿਡਾਰੀ ਨੇ ਗੇਂਦ ਨੂੰ ਜ਼ੋਰ ਨਾਲ ਮਾਰ ਦਿੱਤਾ।",
    "compoundVerb": "ਮਾਰ ਦਿੱਤਾ",
    "mainVerb": "ਮਾਰ",
    "sanchalakVerb": "ਦਿੱਤਾ",
    "explanationPa": "‘ਮਾਰ ਦਿੱਤਾ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਉਹ ਗੱਲ ਸੁਣ ਕੇ ਹੈਰਾਨ ਰਹਿ ਗਿਆ।",
    "compoundVerb": "ਰਹਿ ਗਿਆ",
    "mainVerb": "ਰਹਿ",
    "sanchalakVerb": "ਗਿਆ",
    "explanationPa": "‘ਰਹਿ ਗਿਆ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪੰਛੀ ਸ਼ਿਕਾਰੀ ਦੇ ਜਾਲ ਵਿੱਚੋਂ ਉੱਡ ਨਿਕਲੇ।",
    "compoundVerb": "ਉੱਡ ਨਿਕਲੇ",
    "mainVerb": "ਉੱਡ",
    "sanchalakVerb": "ਨਿਕਲੇ",
    "explanationPa": "‘ਉੱਡ ਨਿਕਲੇ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਉਸਨੇ ਸੱਚਾਈ ਸਾਰਿਆਂ ਅੱਗੇ ਦੱਸ ਦਿੱਤੀ।",
    "compoundVerb": "ਦੱਸ ਦਿੱਤੀ",
    "mainVerb": "ਦੱਸ",
    "sanchalakVerb": "ਦਿੱਤੀ",
    "explanationPa": "‘ਦੱਸ ਦਿੱਤੀ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਦੁਕਾਨਦਾਰ ਨੇ ਸਾਰਾ ਸੌਦਾ ਵੇਚ ਦਿੱਤਾ।",
    "compoundVerb": "ਵੇਚ ਦਿੱਤਾ",
    "mainVerb": "ਵੇਚ",
    "sanchalakVerb": "ਦਿੱਤਾ",
    "explanationPa": "‘ਵੇਚ ਦਿੱਤਾ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਅਧਿਆਪਕ ਨੇ ਬੱਚਿਆਂ ਨੂੰ ਸਵਾਲ ਸਮਝਾ ਦਿੱਤਾ।",
    "compoundVerb": "ਸਮਝਾ ਦਿੱਤਾ",
    "mainVerb": "ਸਮਝਾ",
    "sanchalakVerb": "ਦਿੱਤਾ",
    "explanationPa": "‘ਸਮਝਾ ਦਿੱਤਾ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਉਸਨੇ ਨਵੀਂ ਕਾਰ ਖ਼ਰੀਦ ਲਈ।",
    "compoundVerb": "ਖ਼ਰੀਦ ਲਈ",
    "mainVerb": "ਖ਼ਰੀਦ",
    "sanchalakVerb": "ਲਈ",
    "explanationPa": "‘ਖ਼ਰੀਦ ਲਈ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਨੌਕਰ ਨੇ ਕਮਰਾ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਾਫ਼ ਕਰ ਦਿੱਤਾ।",
    "compoundVerb": "ਕਰ ਦਿੱਤਾ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਦਿੱਤਾ",
    "explanationPa": "‘ਕਰ ਦਿੱਤਾ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਡਾਕੀਏ ਨੇ ਜ਼ਰੂਰੀ ਚਿੱਠੀ ਪਹੁੰਚਾ ਦਿੱਤੀ।",
    "compoundVerb": "ਪਹੁੰਚਾ ਦਿੱਤੀ",
    "mainVerb": "ਪਹੁੰਚਾ",
    "sanchalakVerb": "ਦਿੱਤੀ",
    "explanationPa": "‘ਪਹੁੰਚਾ ਦਿੱਤੀ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਅਸੀਂ ਔਖੀ ਨਦੀ ਪਾਰ ਕਰ ਲਈ।",
    "compoundVerb": "ਕਰ ਲਈ",
    "mainVerb": "ਕਰ",
    "sanchalakVerb": "ਲਈ",
    "explanationPa": "‘ਕਰ ਲਈ’ ਸੰਯੁਕਤ ਕਿਰਿਆ ਹੈ।"
  }
];

export const ASPECT_SENTENCE_ITEMS: readonly AspectSentenceItem[] = [
  {
    "sentence": "ਸੂਰਜ ਹਰ ਰੋਜ਼ ਪੂਰਬ ਵਿੱਚੋਂ ਚੜ੍ਹਦਾ ਹੈ।",
    "aspectCategory": "ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",
    "aspectTense": "ਸਧਾਰਨ ਵਰਤਮਾਨ ਕਾਲ (ਨਿੱਤਤਾਵਾਚਕ)",
    "verbPhrase": "ਚੜ੍ਹਦਾ ਹੈ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ ਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਸ਼ਰਤੀ ਭਵਿੱਖਤ ਕਾਲ"
    ],
    "explanationPa": "ਨਿਯਮਿਤ ਜਾਂ ਰੋਜ਼ਾਨਾ ਹੋਣ ਵਾਲੇ ਕੰਮ ਲਈ ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ (ਸਧਾਰਨ ਵਰਤਮਾਨ) ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਕਿਸਾਨ ਖੇਤਾਂ ਵਿੱਚ ਹਲ ਵਾਹ ਰਿਹਾ ਹੈ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਵਰਤਮਾਨ ਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਵਾਹ ਰਿਹਾ ਹੈ",
    "distractors": [
      "ਨਿੱਤਤਾਵਾਚਕ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਜਦੋਂ ਕਿਰਿਆ ਮੌਜੂਦਾ ਸਮੇਂ ਨਿਰੰਤਰ ਜਾਰੀ ਹੋਵੇ, ਤਾਂ ਇਹ ਅਪੂਰਨ ਜਾਂ ਚਾਲੂ ਪੱਖ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "sentence": "ਵਿਦਿਆਰਥੀ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਪੜ੍ਹ ਰਹੇ ਸਨ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਭੂਤਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਪੜ੍ਹ ਰਹੇ ਸਨ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਚਾਲੂ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਵਿੱਚ ਜਾਰੀ ਰਹਿਣ ਵਾਲੀ ਕਿਰਿਆ ਅਪੂਰਨ ਭੂਤਕਾਲ (ਚਾਲੂ ਭੂਤਕਾਲ) ਅਖਵਾਉਂਦੀ ਹੈ।"
  },
  {
    "sentence": "ਕੱਲ੍ਹ ਇਸ ਵੇਲੇ ਮੀਂਹ ਪੈ ਰਿਹਾ ਹੋਵੇਗਾ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਭਵਿੱਖਤ ਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਪੈ ਰਿਹਾ ਹੋਵੇਗਾ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਪੂਰਨ ਭਵਿੱਖਤ",
      "ਚਾਲੂ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਭਵਿੱਖ ਵਿੱਚ ਜਾਰੀ ਰਹਿਣ ਵਾਲੀ ਕਿਰਿਆ ਚਾਲੂ ਭਵਿੱਖਤ ਕਾਲ ਹੁੰਦੀ ਹੈ।"
  },
  {
    "sentence": "ਅਸੀਂ ਸਾਰਾ ਸਬਕ ਯਾਦ ਕਰ ਲਿਆ ਹੈ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਵਰਤਮਾਨ ਕਾਲ",
    "verbPhrase": "ਕਰ ਲਿਆ ਹੈ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਸ਼ਰਤੀ ਕਾਲ"
    ],
    "explanationPa": "ਕੰਮ ਦਾ ਹੁਣੇ-ਹੁਣੇ ਮੁਕੰਮਲ ਹੋਣਾ ‘ਪੂਰਨ ਵਰਤਮਾਨ ਕਾਲ’ (ਪੂਰਨ ਪੱਖ) ਦਰਸਾਉਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਰੇਲਗੱਡੀ ਸਟੇਸ਼ਨ ਤੋਂ ਜਾ ਚੁੱਕੀ ਸੀ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਭੂਤਕਾਲ",
    "verbPhrase": "ਜਾ ਚੁੱਕੀ ਸੀ",
    "distractors": [
      "ਚਾਲੂ ਭੂਤਕਾਲ",
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਵਿੱਚ ਕੰਮ ਦਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਮਾਪਤ ਹੋਣਾ ‘ਪੂਰਨ ਭੂਤਕਾਲ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "sentence": "ਮਹਿਮਾਨ ਆਪਣੇ ਘਰ ਪਹੁੰਚ ਚੁੱਕੇ ਹੋਣਗੇ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਭਵਿੱਖਤ ਕਾਲ",
    "verbPhrase": "ਪਹੁੰਚ ਚੁੱਕੇ ਹੋਣਗੇ",
    "distractors": [
      "ਚਾਲੂ ਭਵਿੱਖਤ",
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਪੂਰਨ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਭਵਿੱਖ ਵਿੱਚ ਕੰਮ ਦੇ ਮੁਕੰਮਲ ਹੋਣ ਦਾ ਅਨੁਮਾਨ ‘ਪੂਰਨ ਭਵਿੱਖਤ ਕਾਲ’ ਹੈ।"
  },
  {
    "sentence": "ਜੇ ਉਹ ਮਿਹਨਤ ਕਰਦਾ ਤਾਂ ਜ਼ਰੂਰ ਪਾਸ ਹੋ ਜਾਂਦਾ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸ਼ਰਤੀ ਭੂਤਕਾਲ (Conditional Past)",
    "verbPhrase": "ਪਾਸ ਹੋ ਜਾਂਦਾ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਹੁਕਮੀ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਜਿਸ ਵਾਕ ਵਿੱਚ ਇੱਕ ਕਿਰਿਆ ਦੂਜੀ ਸ਼ਰਤ 'ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੋਵੇ, ਉਹ ਸ਼ਰਤੀ ਕਾਲ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "sentence": "ਜੇ ਮੀਂਹ ਪੈਂਦਾ ਤਾਂ ਫ਼ਸਲ ਚੰਗੀ ਹੁੰਦੀ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸ਼ਰਤੀ ਭੂਤਕਾਲ (Conditional Past)",
    "verbPhrase": "ਚੰਗੀ ਹੁੰਦੀ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਚਾਲੂ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਸ਼ਰਤ ਅਤੇ ਨਤੀਜੇ ਨੂੰ ਦਰਸਾਉਣ ਵਾਲਾ ਕਾਲ ‘ਸ਼ਰਤੀ ਭੂਤਕਾਲ’ ਹੈ।"
  },
  {
    "sentence": "ਸ਼ਾਇਦ ਅੱਜ ਸ਼ਾਮ ਨੂੰ ਤੇਜ਼ ਮੀਂਹ ਪਵੇ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ (Subjunctive Future)",
    "verbPhrase": "ਮੀਂਹ ਪਵੇ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਪੂਰਨ ਭਵਿੱਖਤ",
      "ਹੁਕਮੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਜਿਸ ਕਿਰਿਆ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਸਮੇਂ ਦੀ ਸੰਭਾਵਨਾ ਪ੍ਰਗਟ ਹੋਵੇ, ਉਹ ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਹੋ ਸਕਦਾ ਹੈ ਉਹ ਕੱਲ੍ਹ ਇੱਥੇ ਆਵੇ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ",
    "verbPhrase": "ਆਵੇ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਸ਼ਰਤੀ ਭੂਤਕਾਲ",
      "ਚਾਲੂ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "‘ਆਵੇ’ ਭਵਿੱਖ ਵਿੱਚ ਕੰਮ ਦੀ ਸੰਭਾਵਨਾ ਦਰਸਾਉਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਫੁੱਟਬਾਲ ਖੇਡਦੇ ਹਨ।",
    "aspectCategory": "ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",
    "aspectTense": "ਸਧਾਰਨ ਵਰਤਮਾਨ ਕਾਲ (ਨਿੱਤਤਾਵਾਚਕ)",
    "verbPhrase": "ਖੇਡਦੇ ਹਨ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਵਰਤਮਾਨ",
      "ਸ਼ਰਤੀ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਸਧਾਰਨ ਵਰਤਮਾਨ ਕਾਲ ਆਮ ਆਦਤ ਜਾਂ ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ ਨੂੰ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ।"
  },
  {
    "sentence": "ਪੰਛੀ ਸ਼ਾਮ ਨੂੰ ਆਲ੍ਹਣਿਆਂ ਵੱਲ ਪਰਤਦੇ ਹਨ।",
    "aspectCategory": "ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",
    "aspectTense": "ਸਧਾਰਨ ਵਰਤਮਾਨ ਕਾਲ (ਨਿੱਤਤਾਵਾਚਕ)",
    "verbPhrase": "ਪਰਤਦੇ ਹਨ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਇਹ ਨਿੱਤ ਨੇਮ ਦੀ ਕਿਰਿਆ ਹੋਣ ਕਾਰਨ ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ ਹੈ।"
  },
  {
    "sentence": "ਮਾਲੀ ਬਗੀਚੇ ਵਿੱਚ ਬੂਟਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਿਹਾ ਹੈ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਵਰਤਮਾਨ ਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਦੇ ਰਿਹਾ ਹੈ",
    "distractors": [
      "ਸਧਾਰਨ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਵਰਤਮਾਨ",
      "ਚਾਲੂ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਕਿਰਿਆ ਦਾ ਵਰਤਮਾਨ ਵਿੱਚ ਜਾਰੀ ਰਹਿਣਾ ਅਪੂਰਨ ਜਾਂ ਚਾਲੂ ਪੱਖ ਹੈ।"
  },
  {
    "sentence": "ਸਿਪਾਹੀ ਸਰਹੱਦ 'ਤੇ ਪਹਿਰਾ ਦੇ ਰਹੇ ਸਨ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਭੂਤਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਦੇ ਰਹੇ ਸਨ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਚਾਲੂ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਵਿੱਚ ਚੱਲ ਰਹੇ ਕਾਰਜ ਨੂੰ ਅਪੂਰਨ ਭੂਤਕਾਲ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਉਸਨੇ ਸਾਰਾ ਇਮਤਿਹਾਨ ਦੇ ਲਿਆ ਹੈ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਵਰਤਮਾਨ ਕਾਲ",
    "verbPhrase": "ਦੇ ਲਿਆ ਹੈ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਕਾਰਜ ਦਾ ਸੰਪੂਰਨ ਹੋ ਚੁੱਕਣਾ ਪੂਰਨ ਪੱਖ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਡਾਕਟਰ ਨੇ ਮਰੀਜ਼ ਦਾ ਇਲਾਜ ਕਰ ਦਿੱਤਾ ਸੀ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਭੂਤਕਾਲ",
    "verbPhrase": "ਕਰ ਦਿੱਤਾ ਸੀ",
    "distractors": [
      "ਚਾਲੂ ਭੂਤਕਾਲ",
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਵਿੱਚ ਕਾਰਜ ਸੰਪੂਰਨ ਹੋਣ ਕਾਰਨ ਇਹ ਪੂਰਨ ਭੂਤਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਉਹ ਆਪਣਾ ਸਫ਼ਰ ਖ਼ਤਮ ਕਰ ਚੁੱਕੇ ਹੋਣਗੇ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਭਵਿੱਖਤ ਕਾਲ",
    "verbPhrase": "ਖ਼ਤਮ ਕਰ ਚੁੱਕੇ ਹੋਣਗੇ",
    "distractors": [
      "ਚਾਲੂ ਭਵਿੱਖਤ",
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਪੂਰਨ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਭਵਿੱਖ ਵਿੱਚ ਕੰਮ ਦੇ ਮੁਕੰਮਲ ਹੋਣ ਦਾ ਬੋਧ ‘ਪੂਰਨ ਭਵਿੱਖਤ ਕਾਲ’ ਕਰਵਾਉਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਜੇ ਤੁਸੀਂ ਸੱਚ ਬੋਲਦੇ ਤਾਂ ਸਭ ਤੁਹਾਡਾ ਸਨਮਾਨ ਕਰਦੇ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸ਼ਰਤੀ ਭੂਤਕਾਲ (Conditional Past)",
    "verbPhrase": "ਸਨਮਾਨ ਕਰਦੇ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਹੁਕਮੀ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਇਹ ਸ਼ਰਤ ਅਧੀਨ ਵਾਪਰਨ ਵਾਲੀ ਘਟਨਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਸ਼ਰਤੀ ਭੂਤਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਸ਼ਾਇਦ ਅਧਿਆਪਕ ਜੀ ਅੱਜ ਨਵਾਂ ਪਾਠ ਪੜ੍ਹਾਉਣ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ",
    "verbPhrase": "ਪੜ੍ਹਾਉਣ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਸ਼ਰਤੀ ਭੂਤਕਾਲ",
      "ਚਾਲੂ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਇਹ ਭਵਿੱਖ ਦੀ ਸੰਭਾਵਨਾ ਵਾਲੀ ਕਿਰਿਆ ਹੈ।"
  },
  {
    "sentence": "ਪਾਣੀ ਹਮੇਸ਼ਾ ਹੇਠਾਂ ਵੱਲ ਵਗਦਾ ਹੈ।",
    "aspectCategory": "ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",
    "aspectTense": "ਸਧਾਰਨ ਵਰਤਮਾਨ ਕਾਲ (ਨਿੱਤਤਾਵਾਚਕ)",
    "verbPhrase": "ਵਗਦਾ ਹੈ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਵਰਤਮਾਨ",
      "ਸ਼ਰਤੀ ਕਾਲ"
    ],
    "explanationPa": "ਸਦਾ ਸੱਚ (Universal truth) ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "sentence": "ਗਵੱਈਆ ਮਹਿਫ਼ਿਲ ਵਿੱਚ ਗੀਤ ਗਾ ਰਿਹਾ ਸੀ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਭੂਤਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਗਾ ਰਿਹਾ ਸੀ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਚਾਲੂ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਵਿੱਚ ਕਿਰਿਆ ਜਾਰੀ ਰਹਿਣ ਕਾਰਨ ਇਹ ਚਾਲੂ ਭੂਤਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਮਜ਼ਦੂਰਾਂ ਨੇ ਕੰਧ ਉਸਾਰ ਲਈ ਹੈ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਵਰਤਮਾਨ ਕਾਲ",
    "verbPhrase": "ਉਸਾਰ ਲਈ ਹੈ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਸ਼ਰਤੀ ਕਾਲ"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ਵਿੱਚ ਕਾਰਜ ਦਾ ਸੰਪੂਰਨ ਹੋਣਾ ਪੂਰਨ ਵਰਤਮਾਨ ਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਜੇ ਗੱਡੀ ਸਮੇਂ ਸਿਰ ਆਉਂਦੀ ਤਾਂ ਅਸੀਂ ਪਹੁੰਚ ਜਾਂਦੇ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸ਼ਰਤੀ ਭੂਤਕਾਲ (Conditional Past)",
    "verbPhrase": "ਪਹੁੰਚ ਜਾਂਦੇ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਸ਼ਰਤੀ ਵਾਕ ਭੂਤਕਾਲੀ ਸਥਿਤੀ ਨੂੰ ਦਰਸਾ ਰਿਹਾ ਹੈ।"
  },
  {
    "sentence": "ਸ਼ਾਇਦ ਮੁਸਾਫ਼ਿਰ ਕੱਲ੍ਹ ਸਵੇਰੇ ਰਵਾਨਾ ਹੋਣ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ",
    "verbPhrase": "ਰਵਾਨਾ ਹੋਣ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਚਾਲੂ ਭਵਿੱਖਤ",
      "ਸ਼ਰਤੀ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਆਉਣ ਵਾਲੇ ਸਮੇਂ ਦੀ ਸੰਭਾਵਨਾ ‘ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ’ ਅਖਵਾਉਂਦੀ ਹੈ।"
  },
  {
    "sentence": "ਧਰਤੀ ਸੂਰਜ ਦੁਆਲੇ ਘੁੰਮਦੀ ਹੈ।",
    "aspectCategory": "ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",
    "aspectTense": "ਸਧਾਰਨ ਵਰਤਮਾਨ ਕਾਲ (ਨਿੱਤਤਾਵਾਚਕ)",
    "verbPhrase": "ਘੁੰਮਦੀ ਹੈ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਵਰਤਮਾਨ",
      "ਸੰਭਾਵੀ ਕਾਲ"
    ],
    "explanationPa": "ਸਦੀਵੀ ਸੱਚਾਈ ਵਾਲੀ ਕਿਰਿਆ ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ ਵਿੱਚ ਆਉਂਦੀ ਹੈ।"
  },
  {
    "sentence": "ਦਰਜ਼ੀ ਕੁੜਤਾ ਸਿਊਂ ਰਿਹਾ ਹੋਵੇਗਾ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਭਵਿੱਖਤ ਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਸਿਊਂ ਰਿਹਾ ਹੋਵੇਗਾ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਪੂਰਨ ਭਵਿੱਖਤ",
      "ਚਾਲੂ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਭਵਿੱਖ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਜਾਰੀ ਰਹਿਣਾ ਚਾਲੂ ਭਵਿੱਖਤ ਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਅਸੀਂ ਸਾਰਾ ਖਾਣਾ ਖਾ ਚੁੱਕੇ ਸਾਂ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਭੂਤਕਾਲ",
    "verbPhrase": "ਖਾ ਚੁੱਕੇ ਸਾਂ",
    "distractors": [
      "ਚਾਲੂ ਭੂਤਕਾਲ",
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਵਿੱਚ ਕੰਮ ਮੁਕੰਮਲ ਹੋਣਾ ਪੂਰਨ ਭੂਤਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਜੇ ਤੁਸੀਂ ਬੁਲਾਉਂਦੇ ਤਾਂ ਮੈਂ ਜ਼ਰੂਰ ਆਉਂਦਾ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸ਼ਰਤੀ ਭੂਤਕਾਲ (Conditional Past)",
    "verbPhrase": "ਆਉਂਦਾ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਸ਼ਰਤ ਵਾਲਾ ਵਾਕ ਸ਼ਰਤੀ ਭੂਤਕਾਲ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਕੀ ਪਤਾ ਕੱਲ੍ਹ ਧੁੱਪ ਨਿਕਲੇ?",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ",
    "verbPhrase": "ਧੁੱਪ ਨਿਕਲੇ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਹੁਕਮੀ ਭਵਿੱਖਤ",
      "ਸ਼ਰਤੀ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਅਨਿਸ਼ਚਿਤਤਾ ਅਤੇ ਸੰਭਾਵਨਾ ਵਾਲੀ ਕਿਰਿਆ ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਬਜ਼ੁਰਗ ਰੋਜ਼ ਸਵੇਰੇ ਗੁਰਦੁਆਰੇ ਜਾਂਦੇ ਹਨ।",
    "aspectCategory": "ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",
    "aspectTense": "ਸਧਾਰਨ ਵਰਤਮਾਨ ਕਾਲ (ਨਿੱਤਤਾਵਾਚਕ)",
    "verbPhrase": "ਜਾਂਦੇ ਹਨ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਪੂਰਨ ਵਰਤਮਾਨ",
      "ਸ਼ਰਤੀ ਕਾਲ"
    ],
    "explanationPa": "ਰੋਜ਼ਾਨਾ ਨੇਮ ਦੀ ਕਿਰਿਆ ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ ਹੈ।"
  },
  {
    "sentence": "ਹਨੇਰੀ ਤੇਜ਼ੀ ਨਾਲ ਵਗ ਰਹੀ ਸੀ।",
    "aspectCategory": "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",
    "aspectTense": "ਚਾਲੂ ਭੂਤਕਾਲ (ਅਪੂਰਨ ਪੱਖ)",
    "verbPhrase": "ਵਗ ਰਹੀ ਸੀ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਚਾਲੂ ਵਰਤਮਾਨ"
    ],
    "explanationPa": "ਭੂਤਕਾਲ ਵਿੱਚ ਜਾਰੀ ਅਵਸਥਾ ਅਪੂਰਨ ਭੂਤਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਪੰਛੀ ਦੂਰ ਉੱਡ ਚੁੱਕੇ ਹਨ।",
    "aspectCategory": "ਪੂਰਨ ਪੱਖ",
    "aspectTense": "ਪੂਰਨ ਵਰਤਮਾਨ ਕਾਲ",
    "verbPhrase": "ਉੱਡ ਚੁੱਕੇ ਹਨ",
    "distractors": [
      "ਚਾਲੂ ਵਰਤਮਾਨ",
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਕਾਲ"
    ],
    "explanationPa": "ਵਰਤਮਾਨ ਵਿੱਚ ਮੁਕੰਮਲ ਕਿਰਿਆ ਪੂਰਨ ਵਰਤਮਾਨ ਕਾਲ ਹੈ।"
  },
  {
    "sentence": "ਜੇ ਡਾਕਟਰ ਵੇਲੇ ਸਿਰ ਪਹੁੰਚਦਾ ਤਾਂ ਮਰੀਜ਼ ਬਚ ਜਾਂਦਾ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸ਼ਰਤੀ ਭੂਤਕਾਲ (Conditional Past)",
    "verbPhrase": "ਬਚ ਜਾਂਦਾ",
    "distractors": [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਸੰਭਾਵੀ ਭਵਿੱਖਤ"
    ],
    "explanationPa": "ਸ਼ਰਤੀ ਭੂਤਕਾਲ ਦੋ ਕਿਰਿਆਵਾਂ ਦਾ ਆਪਸੀ ਸ਼ਰਤੀ ਸੰਬੰਧ ਦਰਸਾਉਂਦਾ ਹੈ।"
  },
  {
    "sentence": "ਸੰਭਵ ਹੈ ਕਿ ਮਹਿਮਾਨ ਅੱਜ ਹੀ ਆ ਜਾਣ।",
    "aspectCategory": "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ",
    "aspectTense": "ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ",
    "verbPhrase": "ਆ ਜਾਣ",
    "distractors": [
      "ਸਧਾਰਨ ਭਵਿੱਖਤ",
      "ਚਾਲੂ ਭਵਿੱਖਤ",
      "ਸ਼ਰਤੀ ਭੂਤਕਾਲ"
    ],
    "explanationPa": "ਸੰਭਾਵਨਾ ਪ੍ਰਗਟਾਉਣ ਵਾਲੀ ਕਿਰਿਆ ਸੰਭਾਵੀ ਭਵਿੱਖਤ ਕਾਲ ਹੈ।"
  }
];

export const DHATU_ITEMS: readonly DhatuItem[] = [
  {
    "verb": "ਪੜ੍ਹਨਾ",
    "root": "ਪੜ੍ਹ",
    "distractors": [
      "ਪੜ੍ਹਾਈ",
      "ਪੜ੍ਹਾ",
      "ਪੜ੍ਹਿ"
    ]
  },
  {
    "verb": "ਲਿਖਣਾ",
    "root": "ਲਿਖ",
    "distractors": [
      "ਲਿਖਤ",
      "ਲਿਖਾਈ",
      "ਲੇਖ"
    ]
  },
  {
    "verb": "ਖਾਣਾ",
    "root": "ਖਾ",
    "distractors": [
      "ਖੁਰਾਕ",
      "ਖਾਊ",
      "ਖਾਧਾ"
    ]
  },
  {
    "verb": "ਪੀਣਾ",
    "root": "ਪੀ",
    "distractors": [
      "ਪੀਤਾ",
      "ਪੀਵ",
      "ਪਾਣੀ"
    ]
  },
  {
    "verb": "ਗਾਉਣਾ",
    "root": "ਗਾ",
    "distractors": [
      "ਗੀਤ",
      "ਗਾਵ",
      "ਗਾਇਆ"
    ]
  },
  {
    "verb": "ਨੱਚਣਾ",
    "root": "ਨੱਚ",
    "distractors": [
      "ਨਾਚ",
      "ਨਚਾਰ",
      "ਨੱਚਿਆ"
    ]
  },
  {
    "verb": "ਖੇਡਣਾ",
    "root": "ਖੇਡ",
    "distractors": [
      "ਖੇਡਾਰੀ",
      "ਖੇਡਿਆ",
      "ਖੇਡਾਂ"
    ]
  },
  {
    "verb": "ਸੌਣਾ",
    "root": "ਸੌਂ",
    "distractors": [
      "ਸੌਂਤਾ",
      "ਸੁਪਨਾ",
      "ਸੌਂਵ"
    ]
  },
  {
    "verb": "ਹੱਸਣਾ",
    "root": "ਹੱਸ",
    "distractors": [
      "ਹਾਸਾ",
      "ਹਸਮੁਖ",
      "ਹੱਸਿਆ"
    ]
  },
  {
    "verb": "ਰੋਣਾ",
    "root": "ਰੋ",
    "distractors": [
      "ਰੋਂਦਾ",
      "ਰੋਇਆ",
      "ਰੋਵ"
    ]
  },
  {
    "verb": "ਵੇਖਣਾ",
    "root": "ਵੇਖ",
    "distractors": [
      "ਵੇਖਿਆ",
      "ਵਿਖਾ",
      "ਦਰਸ਼ਨ"
    ]
  },
  {
    "verb": "ਸੁਣਨਾ",
    "root": "ਸੁਣ",
    "distractors": [
      "ਸੁਣਿਆ",
      "ਸੁਣਵਾਈ",
      "ਸਰਵਣ"
    ]
  },
  {
    "verb": "ਬੋਲਣਾ",
    "root": "ਬੋਲ",
    "distractors": [
      "ਬੋਲੀ",
      "ਬੁਲਾਰਾ",
      "ਬੋਲਿਆ"
    ]
  },
  {
    "verb": "ਦੌੜਨਾ",
    "root": "ਦੌੜ",
    "distractors": [
      "ਦੌੜਾਕ",
      "ਦੌੜਿਆ",
      "ਦੌੜਾਂ"
    ]
  },
  {
    "verb": "ਤੁਰਨਾ",
    "root": "ਤੁਰ",
    "distractors": [
      "ਤੋਰ",
      "ਤੁਰਿਆ",
      "ਤੁਰੰਤ"
    ]
  },
  {
    "verb": "ਬੈਠਣਾ",
    "root": "ਬੈਠ",
    "distractors": [
      "ਬੈਠਕ",
      "ਬੈਠਿਆ",
      "ਬੈਠਾ"
    ]
  },
  {
    "verb": "ਉੱਠਣਾ",
    "root": "ਉੱਠ",
    "distractors": [
      "ਉਠਾਅ",
      "ਉੱਠਿਆ",
      "ਉੱਠਵ"
    ]
  },
  {
    "verb": "ਕਰਨਾ",
    "root": "ਕਰ",
    "distractors": [
      "ਕਰਤੂਤ",
      "ਕਰਤਾ",
      "ਕੀਤਾ"
    ]
  },
  {
    "verb": "ਸਿੱਖਣਾ",
    "root": "ਸਿੱਖ",
    "distractors": [
      "ਸਿੱਖਿਆ",
      "ਸਿੱਖਿਆਰਥੀ",
      "ਸਿੱਖ"
    ]
  },
  {
    "verb": "ਜਿੱਤਣਾ",
    "root": "ਜਿੱਤ",
    "distractors": [
      "ਜੇਤੂ",
      "ਜਿੱਤਿਆ",
      "ਜੈ"
    ]
  },
  {
    "verb": "ਤਰਨਾ",
    "root": "ਤਰ",
    "distractors": [
      "ਤਾਰੂ",
      "ਤਰਿਆ",
      "ਤਾਰ"
    ]
  },
  {
    "verb": "ਧੋਣਾ",
    "root": "ਧੋ",
    "distractors": [
      "ਧੁਆਈ",
      "ਧੋਤਾ",
      "ਧੋਵ"
    ]
  },
  {
    "verb": "ਜਾਣਾ",
    "root": "ਜਾ",
    "distractors": [
      "ਜਾਂਦਾ",
      "ਗਿਆ",
      "ਜਾਣੂ"
    ]
  },
  {
    "verb": "ਆਉਣਾ",
    "root": "ਆ",
    "distractors": [
      "ਆਇਆ",
      "ਆਵ",
      "ਆਮਦ"
    ]
  },
  {
    "verb": "ਦੇਣਾ",
    "root": "ਦੇ",
    "distractors": [
      "ਦਿੱਤਾ",
      "ਦੇਵ",
      "ਦੇਣਦਾਰ"
    ]
  },
  {
    "verb": "ਲੈਣਾ",
    "root": "ਲੈ",
    "distractors": [
      "ਲਿਆ",
      "ਲੈਂਦਾ",
      "ਲੇਵਾ"
    ]
  },
  {
    "verb": "ਕਹਿਣਾ",
    "root": "ਕਹਿ",
    "distractors": [
      "ਕਿਹਾ",
      "ਕਹਿੰਦਾ",
      "ਕਹਾਵਤ"
    ]
  },
  {
    "verb": "ਰਹਿਣਾ",
    "root": "ਰਹਿ",
    "distractors": [
      "ਰਿਹਾ",
      "ਰਹਿੰਦਾ",
      "ਰਿਹਾਇਸ਼"
    ]
  },
  {
    "verb": "ਬਹਿਣਾ",
    "root": "ਬਹਿ",
    "distractors": [
      "ਬੈਠਾ",
      "ਬਹਿੰਦਾ",
      "ਬੈਠਕ"
    ]
  },
  {
    "verb": "ਲੱਭਣਾ",
    "root": "ਲੱਭ",
    "distractors": [
      "ਲੱਭਿਆ",
      "ਲੱਭਤ",
      "ਲੱਭੂ"
    ]
  },
  {
    "verb": "ਖੋਲ੍ਹਣਾ",
    "root": "ਖੋਲ੍ਹ",
    "distractors": [
      "ਖੋਲ੍ਹਿਆ",
      "ਖੁਲ੍ਹਾ",
      "ਖੋਲ੍ਹਵ"
    ]
  },
  {
    "verb": "ਬੰਨ੍ਹਣਾ",
    "root": "ਬੰਨ੍ਹ",
    "distractors": [
      "ਬੰਨ੍ਹਿਆ",
      "ਬੰਧਨ",
      "ਬੰਨ੍ਹਾਂ"
    ]
  },
  {
    "verb": "ਕੱਟਣਾ",
    "root": "ਕੱਟ",
    "distractors": [
      "ਕੱਟਿਆ",
      "ਕਟਾਈ",
      "ਕੱਟੂ"
    ]
  },
  {
    "verb": "ਵੱਢਣਾ",
    "root": "ਵੱਢ",
    "distractors": [
      "ਵੱਢਿਆ",
      "ਵਾਢੀ",
      "ਵੱਢੂ"
    ]
  },
  {
    "verb": "ਸਿਊਣਾ",
    "root": "ਸਿਉਂ",
    "distractors": [
      "ਸੀਤਾ",
      "ਸਿਲਾਈ",
      "ਸਿਊਣ"
    ]
  },
  {
    "verb": "ਰੰਗਣਾ",
    "root": "ਰੰਗ",
    "distractors": [
      "ਰੰਗਿਆ",
      "ਰੰਗਾਈ",
      "ਰੰਗੀਨ"
    ]
  },
  {
    "verb": "ਵੰਡਣਾ",
    "root": "ਵੰਡ",
    "distractors": [
      "ਵੰਡਿਆ",
      "ਵੰਡਾਈ",
      "ਵੰਡਾਰਾ"
    ]
  },
  {
    "verb": "ਮਿਲਣਾ",
    "root": "ਮਿਲ",
    "distractors": [
      "ਮਿਲਿਆ",
      "ਮਿਲਾਪ",
      "ਮਿਲਵਰਤਨ"
    ]
  },
  {
    "verb": "ਚੱਲਣਾ",
    "root": "ਚੱਲ",
    "distractors": [
      "ਚੱਲਿਆ",
      "ਚਾਲ",
      "ਚਲੰਤ"
    ]
  },
  {
    "verb": "ਭੱਜਣਾ",
    "root": "ਭੱਜ",
    "distractors": [
      "ਭੱਜਿਆ",
      "ਭਗੌੜਾ",
      "ਭਜਾਈ"
    ]
  },
  {
    "verb": "ਉੱਡਣਾ",
    "root": "ਉੱਡ",
    "distractors": [
      "ਉੱਡਿਆ",
      "ਉਡਾਣ",
      "ਉਡਾਰੂ"
    ]
  },
  {
    "verb": "ਰੱਖਣਾ",
    "root": "ਰੱਖ",
    "distractors": [
      "ਰੱਖਿਆ",
      "ਰਖਵਾਲਾ",
      "ਰੱਖਿਆਤਮਕ"
    ]
  },
  {
    "verb": "ਛੱਡਣਾ",
    "root": "ਛੱਡ",
    "distractors": [
      "ਛੱਡਿਆ",
      "ਛੁਟਕਾਰਾ",
      "ਛੱਡੂ"
    ]
  },
  {
    "verb": "ਤੋੜਨਾ",
    "root": "ਤੋੜ",
    "distractors": [
      "ਤੋੜਿਆ",
      "ਤੋੜ-ਫੋੜ",
      "ਤੋੜਵਾਂ"
    ]
  },
  {
    "verb": "ਜੋੜਨਾ",
    "root": "ਜੋੜ",
    "distractors": [
      "ਜੋੜਿਆ",
      "ਜੋੜ-ਤੋੜ",
      "ਜੁੜਵਾਂ"
    ]
  },
  {
    "verb": "ਮੰਗਣਾ",
    "root": "ਮੰਗ",
    "distractors": [
      "ਮੰਗਿਆ",
      "ਮੰਗਤਾ",
      "ਮੰਗਣੀ"
    ]
  },
  {
    "verb": "ਰੋਕਣਾ",
    "root": "ਰੋਕ",
    "distractors": [
      "ਰੋਕਿਆ",
      "ਰੁਕਾਵਟ",
      "ਰੋਕੂ"
    ]
  },
  {
    "verb": "ਮਾਰਨਾ",
    "root": "ਮਾਰ",
    "distractors": [
      "ਮਾਰਿਆ",
      "ਮਾਰੂ",
      "ਕੁਟਾਈ"
    ]
  },
  {
    "verb": "ਮਰਨਾ",
    "root": "ਮਰ",
    "distractors": [
      "ਮਰਿਆ",
      "ਮੌਤ",
      "ਮਰਊ"
    ]
  },
  {
    "verb": "ਪੱਕਣਾ",
    "root": "ਪੱਕ",
    "distractors": [
      "ਪੱਕਿਆ",
      "ਪੱਕਾ",
      "ਪਕਾਈ"
    ]
  },
  {
    "verb": "ਸੁੱਕਣਾ",
    "root": "ਸੁੱਕ",
    "distractors": [
      "ਸੁੱਕਿਆ",
      "ਸੁੱਕਾ",
      "ਸੁਕਾਈ"
    ]
  },
  {
    "verb": "ਡਿੱਗਣਾ",
    "root": "ਡਿੱਗ",
    "distractors": [
      "ਡਿੱਗਿਆ",
      "ਢਹਿਣਾ",
      "ਡਿਗਾਈ"
    ]
  },
  {
    "verb": "ਛਿਪਣਾ",
    "root": "ਛਿਪ",
    "distractors": [
      "ਛਿਪਿਆ",
      "ਛੁਪਣਗਾਹ",
      "ਛਾਂ"
    ]
  },
  {
    "verb": "ਹਿੱਲਣਾ",
    "root": "ਹਿੱਲ",
    "distractors": [
      "ਹਿੱਲਿਆ",
      "ਹਿੱਲਜੁੱਲ",
      "ਹਾਲਾ"
    ]
  },
  {
    "verb": "ਲਟਕਣਾ",
    "root": "ਲਟਕ",
    "distractors": [
      "ਲਟਕਿਆ",
      "ਲਟਕਣ",
      "ਲਟਕ"
    ]
  },
  {
    "verb": "ਘੁਲਣਾ",
    "root": "ਘੁਲ",
    "distractors": [
      "ਘੁਲਿਆ",
      "ਘੋਲ",
      "ਘੁਲਾਈ"
    ]
  },
  {
    "verb": "ਬਲਣਾ",
    "root": "ਬਲ",
    "distractors": [
      "ਬਲਿਆ",
      "ਬਾਲਣ",
      "ਬਲਵਾਂ"
    ]
  },
  {
    "verb": "ਵਗਣਾ",
    "root": "ਵਗ",
    "distractors": [
      "ਵਗਿਆ",
      "ਵਹਾਅ",
      "ਵਗਤ"
    ]
  },
  {
    "verb": "ਉੱਬਲਣਾ",
    "root": "ਉੱਬਲ",
    "distractors": [
      "ਉੱਬਲਿਆ",
      "ਉਬਾਲ",
      "ਉਬਾਲੀ"
    ]
  },
  {
    "verb": "ਖੁੱਲ੍ਹਣਾ",
    "root": "ਖੁੱਲ੍ਹ",
    "distractors": [
      "ਖੁੱਲ੍ਹਿਆ",
      "ਖੁੱਲ੍ਹਾ",
      "ਖੋਲ੍ਹ"
    ]
  },
  {
    "verb": "ਝੁਕਣਾ",
    "root": "ਝੁਕ",
    "distractors": [
      "ਝੁਕਿਆ",
      "ਝੁਕਾਵ",
      "ਝੁੱਕ"
    ]
  },
  {
    "verb": "ਡੁੱਬਣਾ",
    "root": "ਡੁੱਬ",
    "distractors": [
      "ਡੁੱਬਿਆ",
      "ਡੋਬੂ",
      "ਡੁੱਬ"
    ]
  },
  {
    "verb": "ਭੁੱਲਣਾ",
    "root": "ਭੁੱਲ",
    "distractors": [
      "ਭੁੱਲਿਆ",
      "ਭੁਲੇਖਾ",
      "ਭੁੱਲ"
    ]
  },
  {
    "verb": "ਫੈਲਣਾ",
    "root": "ਫੈਲ",
    "distractors": [
      "ਫੈਲਿਆ",
      "ਫੈਲਾਅ",
      "ਫੈਲ"
    ]
  },
  {
    "verb": "ਦਬਣਾ",
    "root": "ਦਬ",
    "distractors": [
      "ਦਬਿਆ",
      "ਦਬਾਅ",
      "ਦਬਦਬਾ"
    ]
  },
  {
    "verb": "ਗਲਣਾ",
    "root": "ਗਲ",
    "distractors": [
      "ਗਲਿਆ",
      "ਗਲਨ",
      "ਗਾਲ"
    ]
  },
  {
    "verb": "ਚਮਕਣਾ",
    "root": "ਚਮਕ",
    "distractors": [
      "ਚਮਕਿਆ",
      "ਚਮਕ",
      "ਚਮਕੀਲਾ"
    ]
  },
  {
    "verb": "ਹਾਰਨਾ",
    "root": "ਹਾਰ",
    "distractors": [
      "ਹਾਰਿਆ",
      "ਹਾਰ",
      "ਹਾਰੂ"
    ]
  },
  {
    "verb": "ਜਾਗਣਾ",
    "root": "ਜਾਗ",
    "distractors": [
      "ਜਾਗਿਆ",
      "ਜਾਗ",
      "ਜਾਗ੍ਰਿਤੀ"
    ]
  },
  {
    "verb": "ਘੁੰਮਣਾ",
    "root": "ਘੁੰਮ",
    "distractors": [
      "ਘੁੰਮਿਆ",
      "ਘੁੰਮਣਘੇਰੀ",
      "ਚੱਕਰ"
    ]
  },
  {
    "verb": "ਕੰਬਣਾ",
    "root": "ਕੰਬ",
    "distractors": [
      "ਕੰਬਿਆ",
      "ਕੰਬਣੀ",
      "ਕੰਬਊ"
    ]
  },
  {
    "verb": "ਪਾਲਣਾ",
    "root": "ਪਾਲ",
    "distractors": [
      "ਪਾਲਿਆ",
      "ਪਾਲਕ",
      "ਪਾਲਣਹਾਰ"
    ]
  },
  {
    "verb": "ਚੁੱਕਣਾ",
    "root": "ਚੁੱਕ",
    "distractors": [
      "ਚੁੱਕਿਆ",
      "ਚੁਕਾਈ",
      "ਚੁੱਕੂ"
    ]
  },
  {
    "verb": "ਫੜਨਾ",
    "root": "ਫੜ",
    "distractors": [
      "ਫੜਿਆ",
      "ਪਕੜ",
      "ਫੜੂ"
    ]
  },
  {
    "verb": "ਖਿੱਚਣਾ",
    "root": "ਖਿੱਚ",
    "distractors": [
      "ਖਿੱਚਿਆ",
      "ਖਿਚਾਅ",
      "ਖਿਚੜੀ"
    ]
  }
];

export const PRERANARTHAK_ITEMS: readonly PreranarthakItem[] = [
  {
    "base": "ਪੜ੍ਹਨਾ",
    "first": "ਪੜ੍ਹਾਉਣਾ",
    "second": "ਪੜ੍ਹਵਾਉਣਾ"
  },
  {
    "base": "ਲਿਖਣਾ",
    "first": "ਲਿਖਾਉਣਾ",
    "second": "ਲਿਖਵਾਉਣਾ"
  },
  {
    "base": "ਕਰਨਾ",
    "first": "ਕਰਾਉਣਾ",
    "second": "ਕਰਵਾਉਣਾ"
  },
  {
    "base": "ਸੁਣਨਾ",
    "first": "ਸੁਣਾਉਣਾ",
    "second": "ਸੁਣਵਾਉਣਾ"
  },
  {
    "base": "ਧੋਣਾ",
    "first": "ਧੁਆਉਣਾ",
    "second": "ਧੁਵਾਉਣਾ"
  },
  {
    "base": "ਖਾਣਾ",
    "first": "ਖੁਆਉਣਾ",
    "second": "ਖਵਾਉਣਾ"
  },
  {
    "base": "ਪੀਣਾ",
    "first": "ਪਿਲਾਉਣਾ",
    "second": "ਪਿਲਵਾਉਣਾ"
  },
  {
    "base": "ਵੇਖਣਾ",
    "first": "ਵਿਖਾਉਣਾ",
    "second": "ਵਿਖਵਾਉਣਾ"
  },
  {
    "base": "ਬੋਲਣਾ",
    "first": "ਬੁਲਾਉਣਾ",
    "second": "ਬੁਲਵਾਉਣਾ"
  },
  {
    "base": "ਜਿੱਤਣਾ",
    "first": "ਜਿਤਾਉਣਾ",
    "second": "ਜਿਤਵਾਉਣਾ"
  },
  {
    "base": "ਗਾਉਣਾ",
    "first": "ਗਵਾਉਣਾ",
    "second": "ਗਵਵਾਉਣਾ"
  },
  {
    "base": "ਨੱਚਣਾ",
    "first": "ਨਚਾਉਣਾ",
    "second": "ਨਚਵਾਉਣਾ"
  },
  {
    "base": "ਖੇਡਣਾ",
    "first": "ਖਿਡਾਉਣਾ",
    "second": "ਖਿਡਵਾਉਣਾ"
  },
  {
    "base": "ਸੌਣਾ",
    "first": "ਸੁਆਉਣਾ",
    "second": "ਸੁਵਾਉਣਾ"
  },
  {
    "base": "ਹੱਸਣਾ",
    "first": "ਹਸਾਉਣਾ",
    "second": "ਹਸਵਾਉਣਾ"
  },
  {
    "base": "ਰੋਣਾ",
    "first": "ਰੁਆਉਣਾ",
    "second": "ਰੁਵਾਉਣਾ"
  },
  {
    "base": "ਦੌੜਨਾ",
    "first": "ਦੁੜਾਉਣਾ",
    "second": "ਦੁੜਵਾਉਣਾ"
  },
  {
    "base": "ਤੁਰਨਾ",
    "first": "ਤੋਰਾਉਣਾ",
    "second": "ਤੁਰਵਾਉਣਾ"
  },
  {
    "base": "ਬੈਠਣਾ",
    "first": "ਬਿਠਾਉਣਾ",
    "second": "ਬਿਠਵਾਉਣਾ"
  },
  {
    "base": "ਉੱਠਣਾ",
    "first": "ਉਠਾਉਣਾ",
    "second": "ਉਠਵਾਉਣਾ"
  },
  {
    "base": "ਸਿੱਖਣਾ",
    "first": "ਸਿਖਾਉਣਾ",
    "second": "ਸਿਖਵਾਉਣਾ"
  },
  {
    "base": "ਲੱਭਣਾ",
    "first": "ਲਭਾਉਣਾ",
    "second": "ਲਭਵਾਉਣਾ"
  },
  {
    "base": "ਕੱਟਣਾ",
    "first": "ਕਟਾਉਣਾ",
    "second": "ਕਟਵਾਉਣਾ"
  },
  {
    "base": "ਵੰਡਣਾ",
    "first": "ਵੰਡਾਉਣਾ",
    "second": "ਵੰਡਵਾਉਣਾ"
  },
  {
    "base": "ਜੋੜਨਾ",
    "first": "ਜੁੜਾਉਣਾ",
    "second": "ਜੁੜਵਾਉਣਾ"
  },
  {
    "base": "ਰੋਕਣਾ",
    "first": "ਰੁਕਾਉਣਾ",
    "second": "ਰੁਕਵਾਉਣਾ"
  },
  {
    "base": "ਤੋੜਨਾ",
    "first": "ਤੁੜਾਉਣਾ",
    "second": "ਤੁੜਵਾਉਣਾ"
  },
  {
    "base": "ਮੋੜਨਾ",
    "first": "ਮੁੜਾਉਣਾ",
    "second": "ਮੁੜਵਾਉਣਾ"
  },
  {
    "base": "ਸਾੜਨਾ",
    "first": "ਸੜਾਉਣਾ",
    "second": "ਸੜਵਾਉਣਾ"
  },
  {
    "base": "ਛੱਡਣਾ",
    "first": "ਛੁਡਾਉਣਾ",
    "second": "ਛੁਡਵਾਉਣਾ"
  },
  {
    "base": "ਰੱਖਣਾ",
    "first": "ਰਖਾਉਣਾ",
    "second": "ਰਖਵਾਉਣਾ"
  },
  {
    "base": "ਫੜਨਾ",
    "first": "ਫੜਾਉਣਾ",
    "second": "ਫੜਵਾਉਣਾ"
  },
  {
    "base": "ਮੰਗਣਾ",
    "first": "ਮੰਗਾਉਣਾ",
    "second": "ਮੰਗਵਾਉਣਾ"
  },
  {
    "base": "ਬੰਨ੍ਹਣਾ",
    "first": "ਬਨ੍ਹਾਉਣਾ",
    "second": "ਬਨ੍ਹਵਾਉਣਾ"
  },
  {
    "base": "ਖੋਲ੍ਹਣਾ",
    "first": "ਖੁਲ੍ਹਾਉਣਾ",
    "second": "ਖੁਲ੍ਹਵਾਉਣਾ"
  },
  {
    "base": "ਰੰਗਣਾ",
    "first": "ਰੰਗਾਉਣਾ",
    "second": "ਰੰਗਵਾਉਣਾ"
  },
  {
    "base": "ਵੱਢਣਾ",
    "first": "ਵਢਾਉਣਾ",
    "second": "ਵਢਵਾਉਣਾ"
  },
  {
    "base": "ਪਕਾਉਣਾ",
    "first": "ਪਕਵਾਉਣਾ",
    "second": "ਪਕਵਵਾਉਣਾ"
  },
  {
    "base": "ਉਬਾਲਣਾ",
    "first": "ਉਬਲਾਉਣਾ",
    "second": "ਉਬਲਵਾਉਣਾ"
  },
  {
    "base": "ਸੁਕਾਉਣਾ",
    "first": "ਸੁਕਵਾਉਣਾ",
    "second": "ਸੁਕਵਵਾਉਣਾ"
  },
  {
    "base": "ਜਗਾਉਣਾ",
    "first": "ਜਗਵਾਉਣਾ",
    "second": "ਜਗਵਵਾਉਣਾ"
  },
  {
    "base": "ਚਲਾਉਣਾ",
    "first": "ਚਲਵਾਉਣਾ",
    "second": "ਚਲਵਵਾਉਣਾ"
  },
  {
    "base": "ਡੇਗਣਾ",
    "first": "ਡਿਗਾਉਣਾ",
    "second": "ਡਿਗਵਾਉਣਾ"
  },
  {
    "base": "ਘੁਮਾਉਣਾ",
    "first": "ਘੁਮਵਾਉਣਾ",
    "second": "ਘੁਮਵਵਾਉਣਾ"
  },
  {
    "base": "ਵਧਾਉਣਾ",
    "first": "ਵਧਵਾਉਣਾ",
    "second": "ਵਧਵਵਾਉਣਾ"
  }
];
