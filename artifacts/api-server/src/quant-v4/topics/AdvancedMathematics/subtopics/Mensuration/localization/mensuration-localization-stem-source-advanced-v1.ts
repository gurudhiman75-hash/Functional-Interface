import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Entry = readonly [string, string, string];

const ENTRIES: readonly Entry[] = [
  ["right square-pyramid frustum", "समकोण वर्गाकार पिरामिडीय फ्रस्टम", "ਲੰਬ ਵਰਗ-ਆਧਾਰ ਪਿਰਾਮਿਡੀ ਫਰਸਟਮ"],
  ["complete parent solid", "पूर्ण मूल ठोस", "ਪੂਰਾ ਮੂਲ ਠੋਸ"],
  ["regular-polygon frustum", "समबहुभुजीय फ्रस्टम", "ਸਮ-ਬਹੁਭੁਜੀ ਫਰਸਟਮ"],
  ["base perimeters", "आधारों के परिमाप", "ਆਧਾਰਾਂ ਦੇ ਪਰਿਮਾਪ"],
  ["base areas", "आधारों के क्षेत्रफल", "ਆਧਾਰਾਂ ਦੇ ਖੇਤਰਫਲ"],
  ["minimum possible total surface area", "न्यूनतम संभव कुल पृष्ठ क्षेत्रफल", "ਘੱਟੋ-ਘੱਟ ਸੰਭਵ ਕੁੱਲ ਸਤਹ ਖੇਤਰਫਲ"],
  ["in exact terms of", "के ठीक पदों में", "ਦੇ ਠੀਕ ਪਦਾਂ ਵਿੱਚ"],
  ["in terms of", "के पदों में", "ਦੇ ਪਦਾਂ ਵਿੱਚ"],
  ["in the same order", "उसी क्रम में", "ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ"],
  ["decorative metal model consists of a cylinder surmounted by a hemisphere", "सजावटी धातु मॉडल एक बेलन से बना है, जिसके ऊपर एक अर्धगोला है", "ਸਜਾਵਟੀ ਧਾਤ ਮਾਡਲ ਇੱਕ ਬੇਲਨ ਤੋਂ ਬਣਿਆ ਹੈ, ਜਿਸ ਦੇ ਉੱਪਰ ਇੱਕ ਅਰਧਗੋਲਾ ਹੈ"],
  ["shows a water-level rise", "जल-स्तर में वृद्धि दिखाता है", "ਪਾਣੀ ਦੇ ਪੱਧਰ ਵਿੱਚ ਵਾਧਾ ਦਿਖਾਉਂਦਾ ਹੈ"],
  ["are completely immersed", "पूरी तरह डुबोए गए हैं", "ਪੂਰੀ ਤਰ੍ਹਾਂ ਡੁੱਬੇ ਹੋਏ ਹਨ"],
  ["identical solid spheres", "समान ठोस गोले", "ਇੱਕੋ ਜਿਹੇ ਠੋਸ ਗੋਲੇ"],
  ["correct to two decimal places", "दो दशमलव स्थान तक सही", "ਦੋ ਦਸ਼ਮਲਵ ਥਾਵਾਂ ਤੱਕ ਸਹੀ"],
];

function esc(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
export function prelocalizeMensurationStemSourceAdvancedV1(text: string, language: MensurationLocalizedLanguage) {
  let out = text;
  for (const [source, hi, pa] of [...ENTRIES].sort((a, b) => b[0].length - a[0].length)) {
    const left = /^[A-Za-z]/.test(source) ? "\\b" : "";
    const right = /[A-Za-z]$/.test(source) ? "\\b" : "";
    out = out.replace(new RegExp(`${left}${esc(source)}${right}`, "gi"), language === "hi" ? hi : pa);
  }
  return out;
}
