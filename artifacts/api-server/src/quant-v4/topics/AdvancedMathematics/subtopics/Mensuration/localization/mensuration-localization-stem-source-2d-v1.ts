import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Entry = readonly [string, string, string];

const ENTRIES: readonly Entry[] = [
  ["semicircle whose diameter equals the rectangle's width", "अर्धवृत्त जिसका व्यास आयत की चौड़ाई के बराबर है", "ਅਰਧ-ਵ੍ਰਿਤ ਜਿਸ ਦਾ ਵਿਆਸ ਆਇਤ ਦੀ ਚੌੜਾਈ ਦੇ ਬਰਾਬਰ ਹੈ"],
  ["attached externally along one shorter side", "एक छोटी भुजा के बाहर जोड़ा गया", "ਇੱਕ ਛੋਟੀ ਭੁਜਾ ਦੇ ਬਾਹਰ ਜੋੜਿਆ ਗਿਆ"],
  ["semicircular pieces", "अर्धवृत्ताकार टुकड़े", "ਅਰਧ-ਵ੍ਰਿਤਾਕਾਰ ਟੁਕੜੇ"],
  ["shared diameter", "साझा व्यास", "ਸਾਂਝਾ ਵਿਆਸ"],
  ["inside the circle but outside the square", "वृत्त के अंदर लेकिन वर्ग के बाहर", "ਵ੍ਰਿਤ ਦੇ ਅੰਦਰ ਪਰ ਵਰਗ ਦੇ ਬਾਹਰ"],
  ["measuring tape", "माप-फीता", "ਮਾਪ-ਫੀਤਾ"],
  ["straightened and rebent", "सीधा करके फिर मोड़ा गया", "ਸਿੱਧਾ ਕਰਕੇ ਮੁੜ ਮੋੜਿਆ ਗਿਆ"],
  ["metallic wire", "धातु का तार", "ਧਾਤ ਦੀ ਤਾਰ"],
  ["rectangular hall floor", "आयताकार हॉल का फर्श", "ਆਇਤਾਕਾਰ ਹਾਲ ਦਾ ਫਰਸ਼"],
  ["cover it completely", "इसे पूरी तरह ढकने", "ਇਸ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਢੱਕਣ"],
  ["uniform width", "समान चौड़ाई", "ਇੱਕੋ ਚੌੜਾਈ"],
  ["rectangular paving tiles", "आयताकार फर्श-टाइलें", "ਆਇਤਾਕਾਰ ਫਰਸ਼-ਟਾਈਲਾਂ"],
  ["inside boundary", "भीतरी सीमा", "ਅੰਦਰਲੀ ਸੀਮਾ"],
  ["circular ring", "वृत्ताकार छल्ला", "ਵ੍ਰਿਤਾਕਾਰ ਛੱਲਾ"],
  ["complete revolutions", "पूरे चक्कर", "ਪੂਰੇ ਚੱਕਰ"],
  ["trapezium-shaped plot", "समलंबाकार भूखंड", "ਸਮਲੰਬਾਕਾਰ ਪਲਾਟ"],
  ["parallel sides", "समानांतर भुजाएँ", "ਸਮਾਂਤਰ ਭੁਜਾਵਾਂ"],
  ["perpendicular distance between them", "उनके बीच की लंबवत दूरी", "ਉਹਨਾਂ ਵਿਚਕਾਰ ਦੀ ਲੰਬ ਦੂਰੀ"],
  ["equilateral field", "समबाहु त्रिभुजाकार क्षेत्र", "ਸਮਭੁਜ ਤਿਕੋਣਾ ਖੇਤ"],
];

function esc(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
export function prelocalizeMensurationStemSource2dV1(text: string, language: MensurationLocalizedLanguage) {
  let out = text;
  for (const [source, hi, pa] of [...ENTRIES].sort((a, b) => b[0].length - a[0].length)) {
    const left = /^[A-Za-z]/.test(source) ? "\\b" : "";
    const right = /[A-Za-z]$/.test(source) ? "\\b" : "";
    out = out.replace(new RegExp(`${left}${esc(source)}${right}`, "gi"), language === "hi" ? hi : pa);
  }
  return out;
}
