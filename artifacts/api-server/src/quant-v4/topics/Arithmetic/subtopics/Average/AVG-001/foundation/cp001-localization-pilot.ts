import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { runAvg001Pipeline } from "./pipeline";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_CP001_MULTILINGUAL_PILOT = Object.freeze({
  releaseId: "AVG-001-CP001-HI-PA-v1-CANDIDATE",
  packageId: "AVG-001",
  canonicalProblemId: "AVG-CP-001",
  languages: ["hi", "pa"] as const,
  qlCount: 80,
  status: "MANUAL_REVIEW",
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  createdAt: "2026-07-24",
});

type PilotLanguage = (typeof AVG_001_CP001_MULTILINGUAL_PILOT.languages)[number];
type Values = Record<string, string | number>;

const CP001_QL_IDS = [
  ...Array.from({ length: 72 }, (_, index) => `AVG-QL-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 8 }, (_, index) => `AVG-QL-${String(index + 374).padStart(3, "0")}`),
];

function numericId(qlId: string) {
  return Number(qlId.slice(-3));
}

function modeContextIndex(qlId: string, mode: string) {
  const id = numericId(qlId);
  if (mode === "findSumFromAverageAndCount") return id <= 6 ? id - 1 : (id - 25) % 6;
  if (mode === "findAverageFromSumAndCount") return id <= 12 ? id - 7 : (id - 37) % 6;
  if (mode === "findCountFromSumAndAverage") return id <= 18 ? id - 13 : (id - 49) % 6;
  if (mode === "findMissingValueFromAverage") return id <= 24 ? id - 19 : (id - 61) % 6;
  return id - 374;
}

function wordingVariant(qlId: string) {
  const id = numericId(qlId);
  if (id >= 374) return 0;
  if (id <= 24) return 0;
  if (id <= 48) return 1;
  return 2;
}

const HI_SUM = [
  [
    "{count} विद्यार्थियों के अंकों का औसत {average} है। उनके कुल अंक ज्ञात कीजिए।",
    "एक परीक्षा में {count} विद्यार्थियों का औसत अंक {average} है। कक्षा के कुल अंक निकालिए।",
    "एक बैच में {count} विद्यार्थियों का औसत स्कोर {average} है। संयुक्त स्कोर ज्ञात कीजिए।",
  ],
  [
    "एक इकाई {count} दिनों तक प्रतिदिन औसतन {average} वस्तुएँ बनाती है। कुल उत्पादन ज्ञात कीजिए।",
    "एक उत्पादन इकाई {count} दिनों में प्रतिदिन औसतन {average} इकाइयाँ बनाती है। कुल उत्पादन निकालिए।",
    "एक संयंत्र का {count} दिनों का औसत दैनिक उत्पादन {average} इकाइयाँ है। कुल उत्पादन ज्ञात कीजिए।",
  ],
  [
    "एक दुकान की {count} दिनों की औसत दैनिक बिक्री ₹{average} है। कुल बिक्री ज्ञात कीजिए।",
    "एक विक्रय केंद्र पर {count} दिनों तक प्रतिदिन औसतन ₹{average} की बिक्री होती है। कुल बिक्री निकालिए।",
    "एक ऑनलाइन विक्रेता को {count} दिनों तक प्रतिदिन औसतन ₹{average} के ऑर्डर मिलते हैं। कुल ऑर्डर मूल्य ज्ञात कीजिए।",
  ],
  [
    "{count} कर्मचारियों का औसत मासिक वेतन ₹{average} है। कुल मासिक वेतन ज्ञात कीजिए।",
    "{count} संविदा कर्मचारियों का औसत वेतन ₹{average} है। उनका संयुक्त वेतन निकालिए।",
    "एक विभाग में {count} कर्मचारियों का औसत वेतन ₹{average} है। कुल वेतन ज्ञात कीजिए।",
  ],
  [
    "एक वाहन {count} फेरों में प्रति फेरा औसतन {average} यात्रियों को ले जाता है। कुल यात्रियों की संख्या ज्ञात कीजिए।",
    "एक शटल {count} फेरों में प्रति फेरा औसतन {average} यात्री ले जाती है। कुल यात्री निकालिए।",
    "एक फेरी नाव {count} फेरों में प्रति फेरा औसतन {average} यात्रियों को ले जाती है। कुल यात्री ज्ञात कीजिए।",
  ],
  [
    "एक परिवार {count} दिनों तक प्रतिदिन औसतन ₹{average} खर्च करता है। कुल खर्च ज्ञात कीजिए।",
    "एक छात्रावास {count} दिनों तक प्रतिदिन औसतन ₹{average} खर्च करता है। कुल खर्च निकालिए।",
    "एक परिवार {count} दिनों तक प्रतिदिन औसतन ₹{average} खर्च करता है। कुल राशि ज्ञात कीजिए।",
  ],
] as const;

const PA_SUM = [
  [
    "{count} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ {average} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਕੁੱਲ ਅੰਕ ਪਤਾ ਕਰੋ।",
    "ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ {count} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ {average} ਹੈ। ਜਮਾਤ ਦੇ ਕੁੱਲ ਅੰਕ ਕੱਢੋ।",
    "ਇੱਕ ਬੈਚ ਵਿੱਚ {count} ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਔਸਤ ਸਕੋਰ {average} ਹੈ। ਮਿਲਿਆ-ਜੁਲਿਆ ਸਕੋਰ ਪਤਾ ਕਰੋ।",
  ],
  [
    "ਇੱਕ ਇਕਾਈ {count} ਦਿਨਾਂ ਤੱਕ ਹਰ ਰੋਜ਼ ਔਸਤਨ {average} ਵਸਤਾਂ ਬਣਾਉਂਦੀ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।",
    "ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ {count} ਦਿਨਾਂ ਵਿੱਚ ਹਰ ਰੋਜ਼ ਔਸਤਨ {average} ਇਕਾਈਆਂ ਬਣਾਉਂਦੀ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਕੱਢੋ।",
    "ਇੱਕ ਪਲਾਂਟ ਦਾ {count} ਦਿਨਾਂ ਦਾ ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ {average} ਇਕਾਈਆਂ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।",
  ],
  [
    "ਇੱਕ ਦੁਕਾਨ ਦੀ {count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ₹{average} ਹੈ। ਕੁੱਲ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।",
    "ਇੱਕ ਵਿਕਰੀ ਕੇਂਦਰ ਉੱਤੇ {count} ਦਿਨਾਂ ਤੱਕ ਹਰ ਰੋਜ਼ ਔਸਤਨ ₹{average} ਦੀ ਵਿਕਰੀ ਹੁੰਦੀ ਹੈ। ਕੁੱਲ ਵਿਕਰੀ ਕੱਢੋ।",
    "ਇੱਕ ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ ਨੂੰ {count} ਦਿਨਾਂ ਤੱਕ ਹਰ ਰੋਜ਼ ਔਸਤਨ ₹{average} ਦੇ ਆਰਡਰ ਮਿਲਦੇ ਹਨ। ਕੁੱਲ ਆਰਡਰ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
  ],
  [
    "{count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ ₹{average} ਹੈ। ਕੁੱਲ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।",
    "{count} ਠੇਕੇ ਦੇ ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ₹{average} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਮਿਲੀ-ਜੁਲੀ ਤਨਖਾਹ ਕੱਢੋ।",
    "ਇੱਕ ਵਿਭਾਗ ਵਿੱਚ {count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ₹{average} ਹੈ। ਕੁੱਲ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।",
  ],
  [
    "ਇੱਕ ਵਾਹਨ {count} ਚੱਕਰਾਂ ਵਿੱਚ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤਨ {average} ਯਾਤਰੀ ਲੈ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਯਾਤਰੀਆਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
    "ਇੱਕ ਸ਼ਟਲ {count} ਚੱਕਰਾਂ ਵਿੱਚ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤਨ {average} ਯਾਤਰੀ ਲੈ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਯਾਤਰੀ ਕੱਢੋ।",
    "ਇੱਕ ਫੈਰੀ ਕਿਸ਼ਤੀ {count} ਚੱਕਰਾਂ ਵਿੱਚ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤਨ {average} ਯਾਤਰੀ ਲੈ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਯਾਤਰੀ ਪਤਾ ਕਰੋ।",
  ],
  [
    "ਇੱਕ ਪਰਿਵਾਰ {count} ਦਿਨਾਂ ਤੱਕ ਹਰ ਰੋਜ਼ ਔਸਤਨ ₹{average} ਖਰਚ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਖਰਚ ਪਤਾ ਕਰੋ।",
    "ਇੱਕ ਹੋਸਟਲ {count} ਦਿਨਾਂ ਤੱਕ ਹਰ ਰੋਜ਼ ਔਸਤਨ ₹{average} ਖਰਚ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਖਰਚ ਕੱਢੋ।",
    "ਇੱਕ ਪਰਿਵਾਰ {count} ਦਿਨਾਂ ਤੱਕ ਹਰ ਰੋਜ਼ ਔਸਤਨ ₹{average} ਖਰਚ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਰਕਮ ਪਤਾ ਕਰੋ।",
  ],
] as const;

const HI_AVERAGE = [
  ["{count} परीक्षाओं में कुल {total} अंक मिले। प्रति परीक्षा औसत अंक ज्ञात कीजिए।", "{count} मॉक परीक्षाओं के कुल अंक {total} हैं। औसत अंक निकालिए।", "{count} अभ्यास परीक्षाओं का संयुक्त स्कोर {total} है। प्रति परीक्षा औसत ज्ञात कीजिए।"],
  ["{count} घंटों में कुल {total} इकाइयाँ बनीं। प्रति घंटा औसत उत्पादन ज्ञात कीजिए।", "एक मशीन ने {count} घंटों में {total} पुर्जे बनाए। औसत प्रति घंटा उत्पादन निकालिए।", "एक असेंबली लाइन ने {count} घंटों में {total} इकाइयाँ बनाई। प्रति घंटा औसत ज्ञात कीजिए।"],
  ["{count} दिनों की कुल बिक्री ₹{total} है। औसत दैनिक बिक्री ज्ञात कीजिए।", "एक विक्रय केंद्र की {count} दिनों की कुल बिक्री ₹{total} है। प्रतिदिन का औसत निकालिए।", "एक ऑनलाइन विक्रेता को {count} दिनों में ₹{total} के ऑर्डर मिले। औसत दैनिक ऑर्डर मूल्य ज्ञात कीजिए।"],
  ["{count} दिनों में कुल ₹{total} खर्च हुए। औसत दैनिक खर्च ज्ञात कीजिए।", "एक परिवार ने {count} दिनों में ₹{total} खर्च किए। प्रतिदिन का औसत निकालिए।", "एक छात्रावास ने {count} दिनों में ₹{total} खर्च किए। औसत दैनिक खर्च ज्ञात कीजिए।"],
  ["{count} दिनों में कुल {total} किमी दूरी तय की गई। औसत दैनिक दूरी ज्ञात कीजिए।", "एक वाहन ने {count} दिनों में {total} किमी दूरी तय की। प्रतिदिन की औसत दूरी निकालिए।", "एक साइकिल चालक ने {count} दिनों में कुल {total} किमी दूरी तय की। औसत दैनिक दूरी ज्ञात कीजिए।"],
  ["{count} संख्याओं का योग {total} है। उनका औसत ज्ञात कीजिए।", "{count} दर्ज मानों का योग {total} है। औसत निकालिए।", "एक आँकड़ा-समूह की {count} संख्याओं का योग {total} है। अंकगणितीय औसत ज्ञात कीजिए।"],
] as const;

const PA_AVERAGE = [
  ["{count} ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਕੁੱਲ {total} ਅੰਕ ਮਿਲੇ। ਪ੍ਰਤੀ ਪ੍ਰੀਖਿਆ ਔਸਤ ਅੰਕ ਪਤਾ ਕਰੋ।", "{count} ਮੌਕ ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਕੁੱਲ ਅੰਕ {total} ਹਨ। ਔਸਤ ਅੰਕ ਕੱਢੋ।", "{count} ਅਭਿਆਸ ਪ੍ਰੀਖਿਆਵਾਂ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਸਕੋਰ {total} ਹੈ। ਪ੍ਰਤੀ ਪ੍ਰੀਖਿਆ ਔਸਤ ਪਤਾ ਕਰੋ।"],
  ["{count} ਘੰਟਿਆਂ ਵਿੱਚ ਕੁੱਲ {total} ਇਕਾਈਆਂ ਬਣੀਆਂ। ਪ੍ਰਤੀ ਘੰਟਾ ਔਸਤ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਮਸ਼ੀਨ ਨੇ {count} ਘੰਟਿਆਂ ਵਿੱਚ {total} ਪੁਰਜ਼ੇ ਬਣਾਏ। ਪ੍ਰਤੀ ਘੰਟਾ ਔਸਤ ਉਤਪਾਦਨ ਕੱਢੋ।", "ਇੱਕ ਅਸੈਂਬਲੀ ਲਾਈਨ ਨੇ {count} ਘੰਟਿਆਂ ਵਿੱਚ {total} ਇਕਾਈਆਂ ਬਣਾਈਆਂ। ਪ੍ਰਤੀ ਘੰਟਾ ਔਸਤ ਪਤਾ ਕਰੋ।"],
  ["{count} ਦਿਨਾਂ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ₹{total} ਹੈ। ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਵਿਕਰੀ ਕੇਂਦਰ ਦੀ {count} ਦਿਨਾਂ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ₹{total} ਹੈ। ਪ੍ਰਤੀ ਦਿਨ ਔਸਤ ਕੱਢੋ।", "ਇੱਕ ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ ਨੂੰ {count} ਦਿਨਾਂ ਵਿੱਚ ₹{total} ਦੇ ਆਰਡਰ ਮਿਲੇ। ਔਸਤ ਰੋਜ਼ਾਨਾ ਆਰਡਰ ਮੁੱਲ ਪਤਾ ਕਰੋ।"],
  ["{count} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ₹{total} ਖਰਚ ਹੋਏ। ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਪਰਿਵਾਰ ਨੇ {count} ਦਿਨਾਂ ਵਿੱਚ ₹{total} ਖਰਚ ਕੀਤੇ। ਪ੍ਰਤੀ ਦਿਨ ਔਸਤ ਕੱਢੋ।", "ਇੱਕ ਹੋਸਟਲ ਨੇ {count} ਦਿਨਾਂ ਵਿੱਚ ₹{total} ਖਰਚ ਕੀਤੇ। ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ਪਤਾ ਕਰੋ।"],
  ["{count} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ {total} ਕਿ.ਮੀ. ਦੂਰੀ ਤੈਅ ਕੀਤੀ ਗਈ। ਔਸਤ ਰੋਜ਼ਾਨਾ ਦੂਰੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਵਾਹਨ ਨੇ {count} ਦਿਨਾਂ ਵਿੱਚ {total} ਕਿ.ਮੀ. ਦੂਰੀ ਤੈਅ ਕੀਤੀ। ਪ੍ਰਤੀ ਦਿਨ ਔਸਤ ਦੂਰੀ ਕੱਢੋ।", "ਇੱਕ ਸਾਈਕਲ ਸਵਾਰ ਨੇ {count} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ {total} ਕਿ.ਮੀ. ਦੂਰੀ ਤੈਅ ਕੀਤੀ। ਔਸਤ ਰੋਜ਼ਾਨਾ ਦੂਰੀ ਪਤਾ ਕਰੋ।"],
  ["{count} ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ {total} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।", "{count} ਦਰਜ ਮੁੱਲਾਂ ਦਾ ਜੋੜ {total} ਹੈ। ਔਸਤ ਕੱਢੋ।", "ਇੱਕ ਡਾਟਾ ਸਮੂਹ ਦੀਆਂ {count} ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ {total} ਹੈ। ਅੰਕਗਣਿਤ ਔਸਤ ਪਤਾ ਕਰੋ।"],
] as const;

const HI_COUNT = [
  ["कुल {total} इकाइयाँ बनीं और प्रतिदिन औसत {average} इकाइयाँ बनीं। कार्य-दिवसों की संख्या ज्ञात कीजिए।", "एक उत्पादन इकाई ने कुल {total} वस्तुएँ बनाईं और दैनिक औसत {average} रहा। दिनों की संख्या निकालिए।", "एक कार्यशाला ने कुल {total} पुर्जे बनाए और प्रतिदिन औसतन {average} पुर्जे बने। उसने कितने दिन काम किया?"],
  ["कक्षा के कुल अंक {total} हैं और प्रति विद्यार्थी औसत {average} अंक है। विद्यार्थियों की संख्या ज्ञात कीजिए।", "एक कक्षा का कुल स्कोर {total} और औसत {average} है। विद्यार्थियों की संख्या निकालिए।", "एक बैच का संयुक्त स्कोर {total} है और औसत {average} है। बैच में कितने विद्यार्थी हैं?"],
  ["₹{total} के लेन-देन का औसत मूल्य ₹{average} है। लेन-देन की संख्या ज्ञात कीजिए।", "कुल लेन-देन राशि ₹{total} और औसत मूल्य ₹{average} है। संख्या निकालिए।", "एक प्रणाली ने कुल ₹{total} के लेन-देन संसाधित किए, जिनका औसत ₹{average} है। लेन-देन की संख्या ज्ञात कीजिए।"],
  ["कुल मासिक वेतन ₹{total} और औसत वेतन ₹{average} है। कर्मचारियों की संख्या ज्ञात कीजिए।", "एक दल का कुल वेतन ₹{total} और औसत ₹{average} है। कर्मचारियों की संख्या निकालिए।", "मासिक वेतन-भुगतान ₹{total} है और प्रति कर्मचारी औसत ₹{average} है। कितने कर्मचारी हैं?"],
  ["कुल {total} यात्रियों और प्रति फेरा औसत {average} यात्रियों के आधार पर फेरों की संख्या ज्ञात कीजिए।", "एक शटल ने कुल {total} यात्रियों को ढोया और प्रति फेरा औसत {average} रहा। फेरों की संख्या निकालिए।", "एक फेरी नाव ने कुल {total} यात्रियों को ले जाया और प्रति फेरा औसत {average} था। कितने फेरे हुए?"],
  ["कुल खर्च ₹{total} और औसत दैनिक खर्च ₹{average} है। दिनों की संख्या ज्ञात कीजिए।", "एक परिवार ने कुल ₹{total} खर्च किए और दैनिक औसत ₹{average} रहा। दिनों की संख्या निकालिए।", "एक छात्रावास के पास ₹{total} हैं और औसत दैनिक खर्च ₹{average} है। राशि कितने दिन चलेगी?"],
] as const;

const PA_COUNT = [
  ["ਕੁੱਲ {total} ਇਕਾਈਆਂ ਬਣੀਆਂ ਅਤੇ ਪ੍ਰਤੀ ਦਿਨ ਔਸਤ {average} ਇਕਾਈਆਂ ਬਣੀਆਂ। ਕੰਮ ਦੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ ਨੇ ਕੁੱਲ {total} ਵਸਤਾਂ ਬਣਾਈਆਂ ਅਤੇ ਰੋਜ਼ਾਨਾ ਔਸਤ {average} ਰਿਹਾ। ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।", "ਇੱਕ ਵਰਕਸ਼ਾਪ ਨੇ ਕੁੱਲ {total} ਪੁਰਜ਼ੇ ਬਣਾਏ ਅਤੇ ਪ੍ਰਤੀ ਦਿਨ ਔਸਤਨ {average} ਪੁਰਜ਼ੇ ਬਣੇ। ਇਸ ਨੇ ਕਿੰਨੇ ਦਿਨ ਕੰਮ ਕੀਤਾ?"],
  ["ਜਮਾਤ ਦੇ ਕੁੱਲ ਅੰਕ {total} ਹਨ ਅਤੇ ਪ੍ਰਤੀ ਵਿਦਿਆਰਥੀ ਔਸਤ {average} ਅੰਕ ਹੈ। ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਜਮਾਤ ਦਾ ਕੁੱਲ ਸਕੋਰ {total} ਅਤੇ ਔਸਤ {average} ਹੈ। ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।", "ਇੱਕ ਬੈਚ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਸਕੋਰ {total} ਹੈ ਅਤੇ ਔਸਤ {average} ਹੈ। ਬੈਚ ਵਿੱਚ ਕਿੰਨੇ ਵਿਦਿਆਰਥੀ ਹਨ?"],
  ["₹{total} ਦੇ ਲੈਣ-ਦੇਣ ਦਾ ਔਸਤ ਮੁੱਲ ₹{average} ਹੈ। ਲੈਣ-ਦੇਣ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਕੁੱਲ ਲੈਣ-ਦੇਣ ਰਕਮ ₹{total} ਅਤੇ ਔਸਤ ਮੁੱਲ ₹{average} ਹੈ। ਗਿਣਤੀ ਕੱਢੋ।", "ਇੱਕ ਪ੍ਰਣਾਲੀ ਨੇ ਕੁੱਲ ₹{total} ਦੇ ਲੈਣ-ਦੇਣ ਸੰਭਾਲੇ, ਜਿਨ੍ਹਾਂ ਦਾ ਔਸਤ ₹{average} ਹੈ। ਲੈਣ-ਦੇਣ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।"],
  ["ਕੁੱਲ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ ₹{total} ਅਤੇ ਔਸਤ ਤਨਖਾਹ ₹{average} ਹੈ। ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਟੀਮ ਦੀ ਕੁੱਲ ਤਨਖਾਹ ₹{total} ਅਤੇ ਔਸਤ ₹{average} ਹੈ। ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।", "ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ-ਭੁਗਤਾਨ ₹{total} ਹੈ ਅਤੇ ਪ੍ਰਤੀ ਕਰਮਚਾਰੀ ਔਸਤ ₹{average} ਹੈ। ਕਿੰਨੇ ਕਰਮਚਾਰੀ ਹਨ?"],
  ["ਕੁੱਲ {total} ਯਾਤਰੀਆਂ ਅਤੇ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ {average} ਯਾਤਰੀਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਸ਼ਟਲ ਨੇ ਕੁੱਲ {total} ਯਾਤਰੀ ਲਿਜਾਏ ਅਤੇ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ {average} ਰਿਹਾ। ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।", "ਇੱਕ ਫੈਰੀ ਕਿਸ਼ਤੀ ਨੇ ਕੁੱਲ {total} ਯਾਤਰੀ ਲਿਜਾਏ ਅਤੇ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ {average} ਸੀ। ਕਿੰਨੇ ਚੱਕਰ ਹੋਏ?"],
  ["ਕੁੱਲ ਖਰਚ ₹{total} ਅਤੇ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ₹{average} ਹੈ। ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਪਰਿਵਾਰ ਨੇ ਕੁੱਲ ₹{total} ਖਰਚ ਕੀਤੇ ਅਤੇ ਰੋਜ਼ਾਨਾ ਔਸਤ ₹{average} ਰਿਹਾ। ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।", "ਇੱਕ ਹੋਸਟਲ ਕੋਲ ₹{total} ਹਨ ਅਤੇ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ₹{average} ਹੈ। ਰਕਮ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗੀ?"],
] as const;

const HI_MISSING = [
  ["{count} परीक्षाओं का औसत अंक {average} है। पहली {knownCount} परीक्षाओं के कुल अंक {knownTotal} हैं। शेष परीक्षा का अंक ज्ञात कीजिए।", "{count} परीक्षाओं में औसत {average} है और {knownCount} परीक्षाओं का योग {knownTotal} है। बाकी अंक निकालिए।", "एक अभ्यर्थी की {count} परीक्षाओं का औसत {average} है। {knownCount} परीक्षाओं के अंक {knownTotal} हैं। अंतिम परीक्षा का अंक ज्ञात कीजिए।"],
  ["{count} पालियों का औसत उत्पादन {average} इकाइयाँ है। पहली {knownCount} पालियों का कुल {knownTotal} है। शेष पाली का उत्पादन ज्ञात कीजिए।", "{count} पालियों का औसत {average} इकाइयाँ और {knownCount} पालियों का कुल {knownTotal} है। अंतिम पाली का उत्पादन निकालिए।", "एक संयंत्र की {count} पालियों का औसत {average} इकाइयाँ है। {knownCount} पालियों का उत्पादन {knownTotal} है। शेष पाली का उत्पादन ज्ञात कीजिए।"],
  ["{count} दिनों की औसत दैनिक बिक्री ₹{average} है। पहले {knownCount} दिनों की कुल बिक्री ₹{knownTotal} है। शेष दिन की बिक्री ज्ञात कीजिए।", "{count} दिनों की औसत बिक्री ₹{average} है और {knownCount} दिनों की बिक्री ₹{knownTotal} है। बाकी दिन की बिक्री निकालिए।", "एक दुकान की {count} दिनों की औसत दैनिक बिक्री ₹{average} है। पहले {knownCount} दिनों में ₹{knownTotal} की बिक्री हुई। अंतिम दिन की बिक्री ज्ञात कीजिए।"],
  ["{count} दिनों का औसत दैनिक खर्च ₹{average} है। पहले {knownCount} दिनों में ₹{knownTotal} खर्च हुए। शेष दिन का खर्च ज्ञात कीजिए।", "{count} दिनों का औसत खर्च ₹{average} है और {knownCount} दिनों का कुल ₹{knownTotal} है। बाकी खर्च निकालिए।", "एक छात्रावास {count} दिनों तक प्रतिदिन औसतन ₹{average} खर्च करता है। पहले {knownCount} दिनों में ₹{knownTotal} खर्च हुए। अंतिम दिन का खर्च ज्ञात कीजिए।"],
  ["{count} दिनों की औसत दैनिक दूरी {average} किमी है। पहले {knownCount} दिनों की दूरी {knownTotal} किमी है। शेष दिन की दूरी ज्ञात कीजिए।", "एक वाहन {count} दिनों में प्रतिदिन औसतन {average} किमी चलता है। {knownCount} दिनों में {knownTotal} किमी चला। बाकी दूरी निकालिए।", "एक साइकिल चालक की {count} दिनों की औसत दैनिक दूरी {average} किमी है। पहले {knownCount} दिनों की दूरी {knownTotal} किमी है। अंतिम दिन की दूरी ज्ञात कीजिए।"],
  ["{count} संख्याओं का औसत {average} है। {knownCount} संख्याओं का योग {knownTotal} है। शेष संख्या ज्ञात कीजिए।", "{count} मानों का औसत {average} और {knownCount} मानों का योग {knownTotal} है। बाकी मान निकालिए।", "{count} प्रेक्षणों का औसत {average} है। {knownCount} प्रेक्षणों का योग {knownTotal} है। अंतिम प्रेक्षण ज्ञात कीजिए।"],
] as const;

const PA_MISSING = [
  ["{count} ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ {average} ਹੈ। ਪਹਿਲੀਆਂ {knownCount} ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਕੁੱਲ ਅੰਕ {knownTotal} ਹਨ। ਬਾਕੀ ਪ੍ਰੀਖਿਆ ਦਾ ਅੰਕ ਪਤਾ ਕਰੋ।", "{count} ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਔਸਤ {average} ਹੈ ਅਤੇ {knownCount} ਪ੍ਰੀਖਿਆਵਾਂ ਦਾ ਜੋੜ {knownTotal} ਹੈ। ਬਾਕੀ ਅੰਕ ਕੱਢੋ।", "ਇੱਕ ਉਮੀਦਵਾਰ ਦੀਆਂ {count} ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਔਸਤ {average} ਹੈ। {knownCount} ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਅੰਕ {knownTotal} ਹਨ। ਆਖਰੀ ਪ੍ਰੀਖਿਆ ਦਾ ਅੰਕ ਪਤਾ ਕਰੋ।"],
  ["{count} ਸ਼ਿਫਟਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ {average} ਇਕਾਈਆਂ ਹੈ। ਪਹਿਲੀਆਂ {knownCount} ਸ਼ਿਫਟਾਂ ਦਾ ਕੁੱਲ {knownTotal} ਹੈ। ਬਾਕੀ ਸ਼ਿਫਟ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।", "{count} ਸ਼ਿਫਟਾਂ ਦੀ ਔਸਤ {average} ਇਕਾਈਆਂ ਅਤੇ {knownCount} ਸ਼ਿਫਟਾਂ ਦਾ ਕੁੱਲ {knownTotal} ਹੈ। ਆਖਰੀ ਸ਼ਿਫਟ ਦਾ ਉਤਪਾਦਨ ਕੱਢੋ।", "ਇੱਕ ਪਲਾਂਟ ਦੀਆਂ {count} ਸ਼ਿਫਟਾਂ ਦਾ ਔਸਤ {average} ਇਕਾਈਆਂ ਹੈ। {knownCount} ਸ਼ਿਫਟਾਂ ਦਾ ਉਤਪਾਦਨ {knownTotal} ਹੈ। ਬਾਕੀ ਸ਼ਿਫਟ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।"],
  ["{count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ₹{average} ਹੈ। ਪਹਿਲੇ {knownCount} ਦਿਨਾਂ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ₹{knownTotal} ਹੈ। ਬਾਕੀ ਦਿਨ ਦੀ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।", "{count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ ₹{average} ਹੈ ਅਤੇ {knownCount} ਦਿਨਾਂ ਦੀ ਵਿਕਰੀ ₹{knownTotal} ਹੈ। ਬਾਕੀ ਦਿਨ ਦੀ ਵਿਕਰੀ ਕੱਢੋ।", "ਇੱਕ ਦੁਕਾਨ ਦੀ {count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ₹{average} ਹੈ। ਪਹਿਲੇ {knownCount} ਦਿਨਾਂ ਵਿੱਚ ₹{knownTotal} ਦੀ ਵਿਕਰੀ ਹੋਈ। ਆਖਰੀ ਦਿਨ ਦੀ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।"],
  ["{count} ਦਿਨਾਂ ਦਾ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ₹{average} ਹੈ। ਪਹਿਲੇ {knownCount} ਦਿਨਾਂ ਵਿੱਚ ₹{knownTotal} ਖਰਚ ਹੋਏ। ਬਾਕੀ ਦਿਨ ਦਾ ਖਰਚ ਪਤਾ ਕਰੋ।", "{count} ਦਿਨਾਂ ਦਾ ਔਸਤ ਖਰਚ ₹{average} ਹੈ ਅਤੇ {knownCount} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ₹{knownTotal} ਹੈ। ਬਾਕੀ ਖਰਚ ਕੱਢੋ।", "ਇੱਕ ਹੋਸਟਲ {count} ਦਿਨਾਂ ਤੱਕ ਹਰ ਰੋਜ਼ ਔਸਤਨ ₹{average} ਖਰਚ ਕਰਦਾ ਹੈ। ਪਹਿਲੇ {knownCount} ਦਿਨਾਂ ਵਿੱਚ ₹{knownTotal} ਖਰਚ ਹੋਏ। ਆਖਰੀ ਦਿਨ ਦਾ ਖਰਚ ਪਤਾ ਕਰੋ।"],
  ["{count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਦੂਰੀ {average} ਕਿ.ਮੀ. ਹੈ। ਪਹਿਲੇ {knownCount} ਦਿਨਾਂ ਦੀ ਦੂਰੀ {knownTotal} ਕਿ.ਮੀ. ਹੈ। ਬਾਕੀ ਦਿਨ ਦੀ ਦੂਰੀ ਪਤਾ ਕਰੋ।", "ਇੱਕ ਵਾਹਨ {count} ਦਿਨਾਂ ਵਿੱਚ ਹਰ ਰੋਜ਼ ਔਸਤਨ {average} ਕਿ.ਮੀ. ਤੈਅ ਕਰਦਾ ਹੈ। {knownCount} ਦਿਨਾਂ ਵਿੱਚ {knownTotal} ਕਿ.ਮੀ. ਤੈਅ ਕੀਤੇ। ਬਾਕੀ ਦੂਰੀ ਕੱਢੋ।", "ਇੱਕ ਸਾਈਕਲ ਸਵਾਰ ਦੀ {count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਦੂਰੀ {average} ਕਿ.ਮੀ. ਹੈ। ਪਹਿਲੇ {knownCount} ਦਿਨਾਂ ਦੀ ਦੂਰੀ {knownTotal} ਕਿ.ਮੀ. ਹੈ। ਆਖਰੀ ਦਿਨ ਦੀ ਦੂਰੀ ਪਤਾ ਕਰੋ।"],
  ["{count} ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ {average} ਹੈ। {knownCount} ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ {knownTotal} ਹੈ। ਬਾਕੀ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।", "{count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ {average} ਅਤੇ {knownCount} ਮੁੱਲਾਂ ਦਾ ਜੋੜ {knownTotal} ਹੈ। ਬਾਕੀ ਮੁੱਲ ਕੱਢੋ।", "{count} ਅਵਲੋਕਨਾਂ ਦੀ ਔਸਤ {average} ਹੈ। {knownCount} ਅਵਲੋਕਨਾਂ ਦਾ ਜੋੜ {knownTotal} ਹੈ। ਆਖਰੀ ਅਵਲੋਕਨ ਪਤਾ ਕਰੋ।"],
] as const;

const HI_TRANSFORM = [
  "{count} परीक्षा अंकों का औसत {oldAverage} है। यदि हर अंक में {change} जोड़ा जाए, तो नया औसत ज्ञात कीजिए।",
  "{count} प्रेक्षणों का औसत {oldAverage} है। यदि हर प्रेक्षण को {factor} से गुणा किया जाए, तो नया औसत क्या होगा?",
  "{count} माप-पाठों का औसत {oldAverage} है। हर माप-पाठ को {factor} से गुणा करके फिर {change} जोड़ा जाता है। नया औसत ज्ञात कीजिए।",
  "{count} चुने हुए मानों का औसत {oldAverage} है। यदि हर मान में {change} जोड़ा जाए, तो नया औसत ज्ञात कीजिए।",
  "{count} प्रेक्षणों का औसत {oldAverage} है। यदि हर प्रेक्षण को {factor} से गुणा किया जाए, तो नया औसत ज्ञात कीजिए।",
  "{count} अंकों का औसत {oldAverage} है। हर अंक को {factor} से गुणा करके फिर {change} जोड़ा जाता है। नया औसत ज्ञात कीजिए।",
  "{count} दर्ज मानों का औसत {oldAverage} है। यदि हर मान में {change} की वृद्धि की जाए, तो नया औसत ज्ञात कीजिए।",
  "{count} मापों का औसत {oldAverage} है। यदि हर माप को {factor} से गुणा किया जाए, तो नया औसत क्या होगा?",
] as const;

const PA_TRANSFORM = [
  "{count} ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਜੇ ਹਰ ਅੰਕ ਵਿੱਚ {change} ਜੋੜਿਆ ਜਾਵੇ, ਤਾਂ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।",
  "{count} ਅਵਲੋਕਨਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਜੇ ਹਰ ਅਵਲੋਕਨ ਨੂੰ {factor} ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਨਵੀਂ ਔਸਤ ਕੀ ਹੋਵੇਗੀ?",
  "{count} ਰੀਡਿੰਗਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਹਰ ਰੀਡਿੰਗ ਨੂੰ {factor} ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਫਿਰ {change} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।",
  "{count} ਚੁਣੇ ਹੋਏ ਮੁੱਲਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਜੇ ਹਰ ਮੁੱਲ ਵਿੱਚ {change} ਜੋੜਿਆ ਜਾਵੇ, ਤਾਂ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।",
  "{count} ਅਵਲੋਕਨਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਜੇ ਹਰ ਅਵਲੋਕਨ ਨੂੰ {factor} ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।",
  "{count} ਅੰਕਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਹਰ ਅੰਕ ਨੂੰ {factor} ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਫਿਰ {change} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।",
  "{count} ਦਰਜ ਮੁੱਲਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਜੇ ਹਰ ਮੁੱਲ ਵਿੱਚ {change} ਦਾ ਵਾਧਾ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।",
  "{count} ਮਾਪਾਂ ਦੀ ਔਸਤ {oldAverage} ਹੈ। ਜੇ ਹਰ ਮਾਪ ਨੂੰ {factor} ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਨਵੀਂ ਔਸਤ ਕੀ ਹੋਵੇਗੀ?",
] as const;

function localizedTemplate(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const mode = pkg.solveMode;
  const context = modeContextIndex(pkg.questionLanguageId, mode);
  const variant = wordingVariant(pkg.questionLanguageId);
  if (mode === "findSumFromAverageAndCount") return (language === "hi" ? HI_SUM : PA_SUM)[context]![variant]!;
  if (mode === "findAverageFromSumAndCount") return (language === "hi" ? HI_AVERAGE : PA_AVERAGE)[context]![variant]!;
  if (mode === "findCountFromSumAndAverage") return (language === "hi" ? HI_COUNT : PA_COUNT)[context]![variant]!;
  if (mode === "findMissingValueFromAverage") return (language === "hi" ? HI_MISSING : PA_MISSING)[context]![variant]!;
  if (mode === "findAverageAfterUniformTransformation") return (language === "hi" ? HI_TRANSFORM : PA_TRANSFORM)[context]!;
  throw new Error(`Unsupported CP-001 localization mode: ${mode}`);
}

function localizedExplanation(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const values: Values = pkg.parameters.renderVariables;
  const value = (key: string) => String(values[key] ?? "");
  const answer = pkg.answer;
  if (language === "hi") {
    if (pkg.solveMode === "findSumFromAverageAndCount") return { lines: [`औसत ${value("average")} और संख्या ${value("count")} है।`, "कुल के लिए औसत को संख्या से गुणा करते हैं।", `$$${value("average")}\\times${value("count")}=${answer}$$`, `अतः आवश्यक कुल ${answer} है।`] };
    if (pkg.solveMode === "findAverageFromSumAndCount") return { lines: [`कुल ${value("total")} और संख्या ${value("count")} है।`, "औसत के लिए कुल को संख्या से भाग देते हैं।", `$$${value("total")}\\div${value("count")}=${answer}$$`, `अतः औसत ${answer} है।`] };
    if (pkg.solveMode === "findCountFromSumAndAverage") return { lines: [`कुल ${value("total")} और औसत ${value("average")} है।`, "संख्या के लिए कुल को औसत से भाग देते हैं।", `$$${value("total")}\\div${value("average")}=${answer}$$`, `अतः आवश्यक संख्या ${answer} है।`] };
    if (pkg.solveMode === "findMissingValueFromAverage") return { lines: [`आवश्यक कुल = ${value("average")} × ${value("count")} = ${value("total")}।`, `ज्ञात ${value("knownCount")} मानों का कुल ${value("knownTotal")} है।`, `$$${value("total")}\\mathbin{-}${value("knownTotal")}=${answer}$$`, `अतः शेष मान ${answer} है।`] };
    const factor = Number(values.factor ?? 1); const change = Number(values.change ?? 0);
    const operation = factor === 1 ? `$$${value("oldAverage")}+${change}=${answer}$$` : change === 0 ? `$$${value("oldAverage")}\\times${factor}=${answer}$$` : `$$${value("oldAverage")}\\times${factor}+${change}=${answer}$$`;
    return { lines: [`पुराना औसत ${value("oldAverage")} है।`, "हर मान पर समान क्रिया होने से औसत पर भी वही क्रिया लागू होती है।", operation, `अतः नया औसत ${answer} है।`] };
  }
  if (pkg.solveMode === "findSumFromAverageAndCount") return { lines: [`ਔਸਤ ${value("average")} ਅਤੇ ਗਿਣਤੀ ${value("count")} ਹੈ।`, "ਕੁੱਲ ਲਈ ਔਸਤ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।", `$$${value("average")}\\times${value("count")}=${answer}$$`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਕੁੱਲ ${answer} ਹੈ।`] };
  if (pkg.solveMode === "findAverageFromSumAndCount") return { lines: [`ਕੁੱਲ ${value("total")} ਅਤੇ ਗਿਣਤੀ ${value("count")} ਹੈ।`, "ਔਸਤ ਲਈ ਕੁੱਲ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਕਰਦੇ ਹਾਂ।", `$$${value("total")}\\div${value("count")}=${answer}$$`, `ਇਸ ਲਈ ਔਸਤ ${answer} ਹੈ।`] };
  if (pkg.solveMode === "findCountFromSumAndAverage") return { lines: [`ਕੁੱਲ ${value("total")} ਅਤੇ ਔਸਤ ${value("average")} ਹੈ।`, "ਗਿਣਤੀ ਲਈ ਕੁੱਲ ਨੂੰ ਔਸਤ ਨਾਲ ਭਾਗ ਕਰਦੇ ਹਾਂ।", `$$${value("total")}\\div${value("average")}=${answer}$$`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`] };
  if (pkg.solveMode === "findMissingValueFromAverage") return { lines: [`ਲੋੜੀਂਦਾ ਕੁੱਲ = ${value("average")} × ${value("count")} = ${value("total")}।`, `ਜਾਣੇ ਹੋਏ ${value("knownCount")} ਮੁੱਲਾਂ ਦਾ ਕੁੱਲ ${value("knownTotal")} ਹੈ।`, `$$${value("total")}\\mathbin{-}${value("knownTotal")}=${answer}$$`, `ਇਸ ਲਈ ਬਾਕੀ ਮੁੱਲ ${answer} ਹੈ।`] };
  const factor = Number(values.factor ?? 1); const change = Number(values.change ?? 0);
  const operation = factor === 1 ? `$$${value("oldAverage")}+${change}=${answer}$$` : change === 0 ? `$$${value("oldAverage")}\\times${factor}=${answer}$$` : `$$${value("oldAverage")}\\times${factor}+${change}=${answer}$$`;
  return { lines: [`ਪੁਰਾਣੀ ਔਸਤ ${value("oldAverage")} ਹੈ।`, "ਹਰ ਮੁੱਲ ਉੱਤੇ ਇੱਕੋ ਕਾਰਵਾਈ ਹੋਣ ਕਰਕੇ ਔਸਤ ਉੱਤੇ ਵੀ ਉਹੀ ਕਾਰਵਾਈ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।", operation, `ਇਸ ਲਈ ਨਵੀਂ ਔਸਤ ${answer} ਹੈ।`] };
}

function localizationChecks(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !["language", "maturity", "release-approval", "resolved-stem", "explanation-depth", "explanation-arithmetic", "explanation-answer"].includes(check.name));
  const allText = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`;
  const expectedScript = language === "hi" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
  const wrongScript = language === "hi" ? /[\u0A00-\u0A7F]/ : /[\u0900-\u097F]/;
  checks.push(
    { name: "localized-language", passed: pkg.language === language, message: `Package language is ${language}` },
    { name: "localized-script", passed: expectedScript.test(allText) && !wrongScript.test(allText), message: "Localized text uses the expected script" },
    { name: "localized-stem", passed: !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem), message: "Localized stem is fully rendered" },
    { name: "localized-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines.some((line) => line.includes(pkg.answer)), message: "Localized explanation has four lines and answer evidence" },
    { name: "localization-candidate", passed: pkg.maturity === "MANUAL_REVIEW" && !pkg.publiclyPublishable, message: "Pilot remains non-publishable pending review" },
  );
  return checks;
}

export function getAvg001Cp001LocalizedQlIds() { return [...CP001_QL_IDS]; }

export function runAvg001Cp001LocalizationPilot(input: { questionLanguageId: string; seed: string; language: PilotLanguage }): Avg001QuestionPackage {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== AVG_001_CP001_MULTILINGUAL_PILOT.canonicalProblemId) throw new Error(`${input.questionLanguageId} is outside the AVG-001 CP-001 multilingual pilot`);
  const english = runAvg001Pipeline({ questionLanguageId: input.questionLanguageId, seed: input.seed, language: "en" });
  const localized: Avg001QuestionPackage = {
    ...english,
    questionId: `${english.questionId}:${input.language}`,
    language: input.language as Avg001Language,
    stem: renderTemplate(localizedTemplate(english, input.language), english.parameters.renderVariables),
    parameters: { ...english.parameters, language: input.language as Avg001Language },
    explanation: localizedExplanation(english, input.language),
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: { ...english.traceability, localizationReleaseId: AVG_001_CP001_MULTILINGUAL_PILOT.releaseId, localizationStatus: AVG_001_CP001_MULTILINGUAL_PILOT.status, editorialStatus: AVG_001_CP001_MULTILINGUAL_PILOT.editorialStatus, localizedLanguage: input.language, sourceEnglishReleaseId: english.traceability.releaseId, publiclyPublishable: false },
  };
  const checks = localizationChecks(localized, input.language);
  return { ...localized, validation: { valid: checks.every((check) => check.passed), checks } };
}
