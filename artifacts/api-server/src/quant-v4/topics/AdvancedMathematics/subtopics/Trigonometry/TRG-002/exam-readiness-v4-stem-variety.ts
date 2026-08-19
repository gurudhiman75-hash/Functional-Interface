import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";

export const TRG_002_V4_STEM_VARIETY_IDS = [
  "TRG-002-QL-003", "TRG-002-QL-018", "TRG-002-QL-020", "TRG-002-QL-022",
  "TRG-002-QL-026", "TRG-002-QL-032", "TRG-002-QL-034", "TRG-002-QL-035",
  "TRG-002-QL-042", "TRG-002-QL-055", "TRG-002-QL-054", "TRG-002-QL-072",
  "TRG-002-QL-077", "TRG-002-QL-082", "TRG-002-QL-091", "TRG-002-QL-094",
] as const;

export type Trg002V4StemVarietyId = (typeof TRG_002_V4_STEM_VARIETY_IDS)[number];
type VarietyLocale = "en" | Trg002ExamRealnessLocale;
type Mode = "REVERSE_GIVENS" | "ROTATE_GIVENS";

type Config = {
  mode: Mode;
  en: string;
  hi: string;
  pa: string;
};

const CONFIG: Record<Trg002V4StemVarietyId, Config> = {
  "TRG-002-QL-003": { mode: "REVERSE_GIVENS", en: "During a survey on an open parade ground, a direct tower observation is recorded.", hi: "खुले परेड मैदान में सर्वेक्षण के दौरान मीनार का सीधा अवलोकन किया गया।", pa: "ਖੁੱਲ੍ਹੇ ਪਰੇਡ ਮੈਦਾਨ ਵਿੱਚ ਸਰਵੇਖਣ ਦੌਰਾਨ ਮੀਨਾਰ ਦਾ ਸਿੱਧਾ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-018": { mode: "REVERSE_GIVENS", en: "A surveyor takes the observation from the roof of a municipal office building.", hi: "नगर कार्यालय की इमारत की छत से सर्वेक्षक यह अवलोकन करता है।", pa: "ਨਗਰ ਦਫ਼ਤਰ ਦੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਸਰਵੇਖਕ ਇਹ ਨਿਰੀਖਣ ਕਰਦਾ ਹੈ।" },
  "TRG-002-QL-020": { mode: "REVERSE_GIVENS", en: "Inside a factory compound, a roof-level survey is made toward a nearby pole.", hi: "कारखाने के परिसर में छत से पास के खंभे की ओर सर्वेक्षण किया गया।", pa: "ਫੈਕਟਰੀ ਦੇ ਪਰਿਸਰ ਵਿੱਚ ਛੱਤ ਤੋਂ ਨੇੜਲੇ ਖੰਭੇ ਵੱਲ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-022": { mode: "REVERSE_GIVENS", en: "From a school-building roof, a surveyor observes a pole across the level courtyard.", hi: "विद्यालय की इमारत की छत से समतल प्रांगण के पार एक खंभे का अवलोकन किया गया।", pa: "ਸਕੂਲ ਦੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਸਮਤਲ ਵਿਹੜੇ ਦੇ ਪਾਰ ਇੱਕ ਖੰਭੇ ਦਾ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-026": { mode: "REVERSE_GIVENS", en: "On a clear day, a pole and its shadow are measured on level ground.", hi: "एक साफ दिन समतल जमीन पर खंभे और उसकी छाया का मापन किया गया।", pa: "ਇੱਕ ਸਾਫ਼ ਦਿਨ ਸਮਤਲ ਜ਼ਮੀਨ ਉੱਤੇ ਖੰਭੇ ਅਤੇ ਇਸ ਦੀ ਛਾਂ ਦਾ ਮਾਪ ਲਿਆ ਗਿਆ।" },
  "TRG-002-QL-032": { mode: "REVERSE_GIVENS", en: "At a sports ground, the shadow of a vertical pole is being marked for a sun-angle exercise.", hi: "खेल मैदान में सूर्य-कोण अभ्यास के लिए ऊर्ध्वाधर खंभे की छाया चिन्हित की जा रही है।", pa: "ਖੇਡ ਮੈਦਾਨ ਵਿੱਚ ਸੂਰਜ-ਕੋਣ ਅਭਿਆਸ ਲਈ ਖੜ੍ਹੇ ਖੰਭੇ ਦੀ ਛਾਂ ਨਿਸ਼ਾਨਬੱਧ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।" },
  "TRG-002-QL-034": { mode: "REVERSE_GIVENS", en: "Two shadow readings of the same pole are taken at different times of the day.", hi: "दिन के अलग-अलग समय पर उसी खंभे की छाया के दो माप लिए गए।", pa: "ਦਿਨ ਦੇ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ 'ਤੇ ਉਸੇ ਖੰਭੇ ਦੀ ਛਾਂ ਦੇ ਦੋ ਮਾਪ ਲਏ ਗਏ।" },
  "TRG-002-QL-035": { mode: "ROTATE_GIVENS", en: "A solar survey records how the shadow of one fixed pole changes as the sun moves.", hi: "सौर सर्वेक्षण में एक स्थिर खंभे की बदलती छाया दर्ज की गई।", pa: "ਸੂਰਜੀ ਸਰਵੇਖਣ ਵਿੱਚ ਇੱਕ ਸਥਿਰ ਖੰਭੇ ਦੀ ਬਦਲਦੀ ਛਾਂ ਦਰਜ ਕੀਤੀ ਗਈ।" },
  "TRG-002-QL-042": { mode: "REVERSE_GIVENS", en: "After a storm, a broken roadside tree is inspected before removal.", hi: "आंधी के बाद सड़क किनारे टूटे पेड़ का निरीक्षण किया गया।", pa: "ਆੰਧੀ ਤੋਂ ਬਾਅਦ ਸੜਕ ਕਿਨਾਰੇ ਟੁੱਟੇ ਦਰੱਖਤ ਦਾ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-055": { mode: "REVERSE_GIVENS", en: "A field survey is being used to determine a distance to a tower.", hi: "मैदानी सर्वेक्षण में मीनार तक की दूरी निर्धारित की जा रही है।", pa: "ਮੈਦਾਨੀ ਸਰਵੇਖਣ ਵਿੱਚ ਮੀਨਾਰ ਤੱਕ ਦੀ ਦੂਰੀ ਨਿਰਧਾਰਤ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।" },
  "TRG-002-QL-054": { mode: "ROTATE_GIVENS", en: "A site survey records two angular readings to a tower.", hi: "स्थल सर्वेक्षण में मीनार के लिए दो कोणीय माप दर्ज किए गए।", pa: "ਸਾਈਟ ਸਰਵੇਖਣ ਵਿੱਚ ਮੀਨਾਰ ਲਈ ਦੋ ਕੋਣੀ ਮਾਪ ਦਰਜ ਕੀਤੇ ਗਏ।" },
  "TRG-002-QL-072": { mode: "REVERSE_GIVENS", en: "A spacing survey is carried out in a communications compound.", hi: "दूरसंचार परिसर में दूरी-मापन सर्वेक्षण किया गया।", pa: "ਦੂਰਸੰਚਾਰ ਪਰਿਸਰ ਵਿੱਚ ਦੂਰੀ-ਮਾਪ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-077": { mode: "REVERSE_GIVENS", en: "At a construction site, an observer estimates a building height from eye level.", hi: "निर्माण स्थल पर पर्यवेक्षक आँख के स्तर से इमारत की ऊँचाई का अनुमान लगाता है।", pa: "ਨਿਰਮਾਣ ਸਥਾਨ ਉੱਤੇ ਨਿਰੀਖਕ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਂਦਾ ਹੈ।" },
  "TRG-002-QL-082": { mode: "ROTATE_GIVENS", en: "A baseline survey is carried out around a tower.", hi: "मीनार के लिए आधार-रेखा सर्वेक्षण किया गया।", pa: "ਮੀਨਾਰ ਲਈ ਅਧਾਰ-ਰੇਖਾ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-091": { mode: "REVERSE_GIVENS", en: "An urban survey is carried out from the roof of a building toward a tower across the street.", hi: "शहरी सर्वेक्षण में इमारत की छत से सड़क के पार स्थित मीनार का अवलोकन किया गया।", pa: "ਸ਼ਹਿਰੀ ਸਰਵੇਖਣ ਵਿੱਚ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਸੜਕ ਪਾਰ ਸਥਿਤ ਮੀਨਾਰ ਦਾ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-094": { mode: "REVERSE_GIVENS", en: "During a river-width survey, an observation is taken from a fixed platform on one bank.", hi: "नदी की चौड़ाई के सर्वेक्षण में एक किनारे के स्थिर मंच से अवलोकन किया गया।", pa: "ਨਦੀ ਦੀ ਚੌੜਾਈ ਦੇ ਸਰਵੇਖਣ ਵਿੱਚ ਇੱਕ ਕਿਨਾਰੇ ਦੇ ਸਥਿਰ ਮੰਚ ਤੋਂ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
};

const ID_SET = new Set<string>(TRG_002_V4_STEM_VARIETY_IDS);

function splitSentences(stem: string, locale: VarietyLocale) {
  const delimiter = locale === "en" ? ". " : "। ";
  return stem.split(delimiter).map((part, index, parts) => index < parts.length - 1 ? `${part}${locale === "en" ? "." : "।"}` : part);
}

function reorder(stem: string, locale: VarietyLocale, mode: Mode) {
  const sentences = splitSentences(stem, locale);
  if (sentences.length < 3) return stem;
  const question = sentences[sentences.length - 1];
  const givens = sentences.slice(0, -1);
  const reordered = mode === "REVERSE_GIVENS"
    ? [...givens].reverse()
    : givens.length <= 1 ? givens : [...givens.slice(1), givens[0]];
  return [...reordered, question].join(" ");
}

export function isTrg002V4StemVarietyTarget(qlId: string): qlId is Trg002V4StemVarietyId {
  return ID_SET.has(qlId);
}

export function applyTrg002V4StemVariety(qlId: string, locale: VarietyLocale, stem: string) {
  if (!isTrg002V4StemVarietyTarget(qlId)) return { stem, applied: false } as const;
  const config = CONFIG[qlId];
  const context = locale === "en" ? config.en : locale === "hi-IN" ? config.hi : config.pa;
  return { stem: `${context} ${reorder(stem, locale, config.mode)}`, applied: true } as const;
}