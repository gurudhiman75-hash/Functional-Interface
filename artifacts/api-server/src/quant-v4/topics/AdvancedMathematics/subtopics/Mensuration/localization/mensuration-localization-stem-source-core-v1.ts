import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Entry = readonly [string, string, string];

const ENTRIES: readonly Entry[] = [
  ["hollow metallic pipe", "खोखली धातु की पाइप", "ਖੋਖਲੀ ਧਾਤ ਦੀ ਪਾਈਪ"],
  ["complete exposed surface area", "पूरा खुला पृष्ठ क्षेत्रफल", "ਪੂਰਾ ਖੁੱਲ੍ਹਾ ਸਤਹ ਖੇਤਰਫਲ"],
  ["melted together and recast into one solid sphere", "एक साथ पिघलाकर एक ठोस गोले के रूप में फिर से ढाला गया", "ਇਕੱਠੇ ਪਿਘਲਾ ਕੇ ਇੱਕ ਠੋਸ ਗੋਲੇ ਵਜੋਂ ਮੁੜ ਢਾਲਿਆ ਗਿਆ"],
  ["rolled into a thinner rectangular plate", "बेलकर एक पतली आयताकार चादर बनाई गई", "ਰੋਲ ਕਰਕੇ ਇੱਕ ਪਤਲੀ ਆਇਤਾਕਾਰ ਚਾਦਰ ਬਣਾਈ ਗਈ"],
  ["Assuming no loss", "कोई पदार्थ नष्ट न होने पर", "ਕੋਈ ਪਦਾਰਥ ਨਾ ਘਟਣ ਦੀ ਸਥਿਤੀ ਵਿੱਚ"],
  ["is inscribed in a sphere", "एक गोले में अंतर्लिखित है", "ਇੱਕ ਗੋਲੇ ਵਿੱਚ ਅੰਦਰ ਅੰਕਿਤ ਹੈ"],
  ["is inscribed in a circle", "एक वृत्त में अंतर्लिखित है", "ਇੱਕ ਵ੍ਰਿਤ ਵਿੱਚ ਅੰਦਰ ਅੰਕਿਤ ਹੈ"],
  ["minimum possible total surface area", "न्यूनतम संभव कुल पृष्ठ क्षेत्रफल", "ਘੱਟੋ-ਘੱਟ ਸੰਭਵ ਕੁੱਲ ਸਤਹ ਖੇਤਰਫਲ"],
  ["in exact terms of", "के ठीक पदों में", "ਦੇ ਠੀਕ ਪਦਾਂ ਵਿੱਚ"],
  ["in the same order", "उसी क्रम में", "ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ"],
];

function escapeRegExp(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function prelocalizeMensurationStemSourceCoreV1(text: string, language: MensurationLocalizedLanguage) {
  let out = text;
  for (const [source, hi, pa] of [...ENTRIES].sort((a, b) => b[0].length - a[0].length)) {
    const escaped = escapeRegExp(source);
    const left = /^[A-Za-z]/.test(source) ? "\\b" : "";
    const right = /[A-Za-z]$/.test(source) ? "\\b" : "";
    out = out.replace(new RegExp(`${left}${escaped}${right}`, "gi"), language === "hi" ? hi : pa);
  }
  return out;
}
