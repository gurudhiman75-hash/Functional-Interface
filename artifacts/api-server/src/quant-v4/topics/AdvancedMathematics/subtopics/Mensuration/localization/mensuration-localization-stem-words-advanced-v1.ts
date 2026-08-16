import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Entry = readonly [string, string, string];

const WORDS: readonly Entry[] = [
  ["costs", "लागत", "ਲਾਗਤ"], ["twelve", "बारह", "ਬਾਰਾਂ"], ["cuboidal", "घनाभाकार", "ਘਣਾਭਾਕਾਰ"],
  ["cutting", "काटकर", "ਕੱਟ ਕੇ"], ["internal", "भीतरी", "ਅੰਦਰਲਾ"], ["cuts", "कट", "ਕੱਟ"],
  ["distinct", "अलग", "ਵੱਖਰੇ"], ["grid", "ग्रिड", "ਗ੍ਰਿਡ"], ["plane", "तल", "ਤਲ"],
  ["leave", "रखें", "ਰੱਖੋ"], ["minimum", "न्यूनतम", "ਘੱਟੋ-ਘੱਟ"], ["possible", "संभव", "ਸੰਭਵ"],
  ["designed", "बनाया", "ਬਣਾਇਆ"], ["order", "क्रम", "ਕ੍ਰਮ"], ["lower", "निचली", "ਹੇਠਲੀ"],
  ["upper", "ऊपरी", "ਉੱਪਰਲੀ"], ["parent", "मूल", "ਮੂਲ"], ["polygon", "बहुभुज", "ਬਹੁਭੁਜ"],
  ["perimeters", "परिमाप", "ਪਰਿਮਾਪ"], ["regular", "सम", "ਸਮ"], ["annular", "वलयाकार", "ਛੱਲਾਕਾਰ"],
  ["including", "सहित", "ਸਮੇਤ"], ["walls", "पृष्ठ", "ਸਤਹਾਂ"], ["external", "बाहरी", "ਬਾਹਰੀ"],
  ["ends", "सिरे", "ਸਿਰੇ"], ["bore", "भीतरी छेद", "ਅੰਦਰਲਾ ਛੇਦ"], ["joined", "जोड़े", "ਜੋੜੇ"],
  ["row", "पंक्ति", "ਕਤਾਰ"], ["resulting", "बना", "ਬਣਿਆ"], ["coaxial", "समाक्षीय", "ਸਮ-ਅਕਸੀ"],
  ["lining", "अस्तर", "ਲਾਈਨਿੰਗ"], ["casing", "आवरण", "ਆਵਰਨ"], ["rolled", "बेला", "ਰੋਲ ਕੀਤਾ"],
  ["thinner", "पतली", "ਪਤਲੀ"], ["assuming", "मानते हुए", "ਮੰਨਦੇ ਹੋਏ"], ["plate", "चादर", "ਚਾਦਰ"],
  ["slab", "पट्टी", "ਪੱਟੀ"], ["thick", "मोटी", "ਮੋਟੀ"], ["loss", "हानि", "ਘਾਟ"],
  ["thickness", "मोटाई", "ਮੋਟਾਈ"], ["lost", "नष्ट", "ਘਟਿਆ"], ["together", "साथ", "ਇਕੱਠੇ"],
  ["decimal", "दशमलव", "ਦਸ਼ਮਲਵ"], ["recast", "फिर ढाला", "ਮੁੜ ਢਾਲਿਆ"], ["places", "स्थान", "ਥਾਵਾਂ"],
  ["model", "मॉडल", "ਮਾਡਲ"], ["decorative", "सजावटी", "ਸਜਾਵਟੀ"], ["consists", "बना है", "ਬਣਿਆ ਹੈ"],
  ["toy", "मॉडल", "ਮਾਡਲ"], ["surmounted", "ऊपर रखा", "ਉੱਪਰ ਰੱਖਿਆ"], ["rise", "वृद्धि", "ਵਾਧਾ"],
  ["level", "स्तर", "ਪੱਧਰ"], ["immersed", "डुबोए", "ਡੁੱਬੇ"], ["water", "पानी", "ਪਾਣੀ"],
];

export function prelocalizeMensurationStemWordsAdvancedV1(text: string, language: MensurationLocalizedLanguage) {
  const map = new Map(WORDS.map(([word, hi, pa]) => [word, language === "hi" ? hi : pa]));
  return text.replace(/\b[A-Za-z]+\b/g, (word) => map.get(word.toLowerCase()) ?? word);
}
