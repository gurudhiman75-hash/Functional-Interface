import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Entry = readonly [string, string, string];

const WORDS: readonly Entry[] = [
  ["wide", "चौड़ा", "ਚੌੜਾ"], ["measuring", "माप", "ਮਾਪ"], ["metallic", "धातु", "ਧਾਤ"],
  ["inscribed", "अंतर्लिखित", "ਅੰਦਰ ਅੰਕਿਤ"], ["identical", "समान", "ਇੱਕੋ ਜਿਹੇ"],
  ["parallel", "समानांतर", "ਸਮਾਂਤਰ"], ["shaped", "आकार", "ਆਕਾਰ"], ["made", "बनाया", "ਬਣਾਇਆ"],
  ["completely", "पूरी तरह", "ਪੂਰੀ ਤਰ੍ਹਾਂ"], ["attached", "जुड़ा", "ਜੁੜਿਆ"], ["whose", "जिसका", "ਜਿਸਦਾ"],
  ["shorter", "छोटी", "ਛੋਟੀ"], ["shows", "दिखाता", "ਦਿਖਾਉਂਦਾ"], ["frame", "फ्रेम", "ਫਰੇਮ"],
  ["rebent", "फिर मोड़ा", "ਮੁੜ ਮੋੜਿਆ"], ["bent", "मोड़ा", "ਮੋੜਿਆ"], ["straightened", "सीधा किया", "ਸਿੱਧਾ ਕੀਤਾ"],
  ["block", "खंड", "ਬਲਾਕ"], ["terms", "पदों", "ਪਦਾਂ"], ["pipe", "पाइप", "ਪਾਈਪ"],
  ["exposed", "खुला", "ਖੁੱਲ੍ਹਾ"], ["melted", "पिघलाया", "ਪਿਘਲਾਇਆ"], ["percentage", "प्रतिशत", "ਪ੍ਰਤੀਸ਼ਤ"],
  ["bounded", "घिरा", "ਘਿਰਿਆ"], ["enclosure", "घेरा", "ਘੇਰਾ"], ["field", "क्षेत्र", "ਖੇਤ"],
  ["equilateral", "समबाहु", "ਸਮਭੁਜ"], ["plot", "भूखंड", "ਪਲਾਟ"], ["trapezium", "समलंब", "ਸਮਲੰਬ"],
  ["ring", "छल्ला", "ਛੱਲਾ"], ["wheel", "पहिया", "ਪਹੀਆ"], ["uniform", "समान", "ਇੱਕੋ"],
  ["hall", "हॉल", "ਹਾਲ"], ["paving", "फर्श", "ਫਰਸ਼"], ["semicircular", "अर्धवृत्ताकार", "ਅਰਧ-ਵ੍ਰਿਤਾਕਾਰ"],
  ["pieces", "टुकड़े", "ਟੁਕੜੇ"], ["shared", "साझा", "ਸਾਂਝਾ"], ["tape", "फीता", "ਫੀਤਾ"],
  ["cube", "घन", "ਘਣ"], ["storage", "भंडारण", "ਸਟੋਰੇਜ"], ["edges", "किनारे", "ਕਿਨਾਰੇ"],
];

export function prelocalizeMensurationStemWordsV1(text: string, language: MensurationLocalizedLanguage) {
  const map = new Map(WORDS.map(([word, hi, pa]) => [word, language === "hi" ? hi : pa]));
  return text.replace(/\b[A-Za-z]+\b/g, (word) => map.get(word.toLowerCase()) ?? word);
}
