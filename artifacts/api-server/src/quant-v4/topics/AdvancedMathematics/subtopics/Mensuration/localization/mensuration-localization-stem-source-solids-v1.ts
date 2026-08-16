import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Entry = readonly [string, string, string];

const ENTRIES: readonly Entry[] = [
  ["How many distinct grid-plane cuts are required?", "कुल कितने अलग-अलग ग्रिड-तल कट आवश्यक हैं?", "ਕੁੱਲ ਕਿੰਨੇ ਵੱਖਰੇ ਗ੍ਰਿਡ-ਤਲ ਕੱਟ ਲੋੜੀਂਦੇ ਹਨ?"],
  ["cube-shaped storage block", "घनाकार भंडारण खंड", "ਘਣਾਕਾਰ ਸਟੋਰੇਜ ਬਲਾਕ"],
  ["cuboidal block", "घनाभाकार खंड", "ਘਣਾਭਾਕਾਰ ਬਲਾਕ"],
  ["internal grid plane", "भीतरी ग्रिड-तल", "ਅੰਦਰਲਾ ਗ੍ਰਿਡ-ਤਲ"],
  ["grid-plane cuts", "ग्रिड-तल कट", "ਗ੍ਰਿਡ-ਤਲ ਕੱਟ"],
  ["identical solid cubes", "समान ठोस घन", "ਇੱਕੋ ਜਿਹੇ ਠੋਸ ਘਣ"],
  ["joined face to face", "पृष्ठ से पृष्ठ जोड़े गए", "ਪਾਸੇ ਨਾਲ ਪਾਸਾ ਜੋੜੇ ਗਏ"],
  ["straight row", "सीधी पंक्ति", "ਸਿੱਧੀ ਕਤਾਰ"],
  ["resulting solid", "बना हुआ ठोस", "ਬਣਿਆ ਹੋਇਆ ਠੋਸ"],
  ["including both curved walls and both annular ends", "दोनों वक्र पृष्ठों और दोनों वलयाकार सिरों सहित", "ਦੋਵੇਂ ਵਕਰ ਸਤਹਾਂ ਅਤੇ ਦੋਵੇਂ ਛੱਲਾਕਾਰ ਸਿਰਿਆਂ ਸਮੇਤ"],
  ["complete exposed surface area", "पूरा खुला पृष्ठ क्षेत्रफल", "ਪੂਰਾ ਖੁੱਲ੍ਹਾ ਸਤਹ ਖੇਤਰਫਲ"],
  ["external radius", "बाहरी त्रिज्या", "ਬਾਹਰੀ ਅਰਧ-ਵਿਆਸ"],
  ["bore radius", "भीतरी छेद की त्रिज्या", "ਅੰਦਰਲੇ ਛੇਦ ਦਾ ਅਰਧ-ਵਿਆਸ"],
  ["volume of metal used", "प्रयुक्त धातु का आयतन", "ਵਰਤੀ ਧਾਤ ਦਾ ਆਇਤਨ"],
  ["coaxial inner surface", "समाक्षीय भीतरी पृष्ठ", "ਸਮ-ਅਕਸੀ ਅੰਦਰਲੀ ਸਤਹ"],
  ["inner-to-outer scale", "भीतरी-बाहरी माप-गुणक", "ਅੰਦਰਲੇ-ਬਾਹਰੀ ਮਾਪ ਦਾ ਗੁਣਕ"],
  ["inner curved lining cost", "भीतरी वक्र पृष्ठ की अस्तर लागत", "ਅੰਦਰਲੀ ਵਕਰ ਸਤਹ ਦੀ ਲਾਈਨਿੰਗ ਲਾਗਤ"],
];

function esc(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
export function prelocalizeMensurationStemSourceSolidsV1(text: string, language: MensurationLocalizedLanguage) {
  let out = text;
  for (const [source, hi, pa] of [...ENTRIES].sort((a, b) => b[0].length - a[0].length)) {
    const left = /^[A-Za-z]/.test(source) ? "\\b" : "";
    const right = /[A-Za-z]$/.test(source) ? "\\b" : "";
    out = out.replace(new RegExp(`${left}${esc(source)}${right}`, "gi"), language === "hi" ? hi : pa);
  }
  return out;
}
