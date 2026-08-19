import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";

export const TRG_002_V4_STEM_VARIETY_IDS = [
  "TRG-002-QL-003", "TRG-002-QL-018", "TRG-002-QL-020", "TRG-002-QL-022",
  "TRG-002-QL-026", "TRG-002-QL-032", "TRG-002-QL-034", "TRG-002-QL-035",
  "TRG-002-QL-037", "TRG-002-QL-042", "TRG-002-QL-044", "TRG-002-QL-046",
  "TRG-002-QL-050", "TRG-002-QL-053", "TRG-002-QL-055", "TRG-002-QL-054",
  "TRG-002-QL-060", "TRG-002-QL-066", "TRG-002-QL-072", "TRG-002-QL-077",
  "TRG-002-QL-081", "TRG-002-QL-082", "TRG-002-QL-091", "TRG-002-QL-094",
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
  "TRG-002-QL-037": { mode: "REVERSE_GIVENS", en: "A maintenance worker places a ladder against a vertical wall.", hi: "मरम्मत के लिए एक कर्मचारी ऊर्ध्वाधर दीवार से सीढ़ी लगाता है।", pa: "ਮੁਰੰਮਤ ਲਈ ਇੱਕ ਕਰਮਚਾਰੀ ਖੜ੍ਹੀ ਕੰਧ ਨਾਲ ਸੀੜ੍ਹੀ ਲਗਾਉਂਦਾ ਹੈ।" },
  "TRG-002-QL-042": { mode: "REVERSE_GIVENS", en: "After a storm, a broken roadside tree is inspected before removal.", hi: "आंधी के बाद सड़क किनारे टूटे पेड़ का निरीक्षण किया गया।", pa: "ਆੰਧੀ ਤੋਂ ਬਾਅਦ ਸੜਕ ਕਿਨਾਰੇ ਟੁੱਟੇ ਦਰੱਖਤ ਦਾ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-044": { mode: "REVERSE_GIVENS", en: "A forestry worker measures a tree whose upper part has fallen to the ground.", hi: "वनकर्मी उस पेड़ का मापन करता है जिसका ऊपरी भाग जमीन पर गिरा है।", pa: "ਵਣ ਕਰਮਚਾਰੀ ਉਸ ਦਰੱਖਤ ਦਾ ਮਾਪ ਲੈਂਦਾ ਹੈ ਜਿਸ ਦਾ ਉੱਪਰਲਾ ਹਿੱਸਾ ਜ਼ਮੀਨ 'ਤੇ ਡਿੱਗਿਆ ਹੈ।" },
  "TRG-002-QL-046": { mode: "REVERSE_GIVENS", en: "During installation of a communication mast, its supporting wire is checked.", hi: "संचार मस्तूल की स्थापना के समय उसके सहारा-तार का मापन किया गया।", pa: "ਸੰਚਾਰ ਮਸਤੂਲ ਦੀ ਸਥਾਪਨਾ ਸਮੇਂ ਇਸ ਦੇ ਸਹਾਰਾ-ਤਾਰ ਦਾ ਮਾਪ ਲਿਆ ਗਿਆ।" },
  "TRG-002-QL-050": { mode: "REVERSE_GIVENS", en: "Two marked points on a straight service road are used to observe the same tower.", hi: "सीधी सेवा-सड़क पर दो चिन्हित बिंदुओं से उसी मीनार का अवलोकन किया गया।", pa: "ਸਿੱਧੀ ਸੇਵਾ-ਸੜਕ ਉੱਤੇ ਦੋ ਨਿਸ਼ਾਨਬੱਧ ਬਿੰਦੂਆਂ ਤੋਂ ਉਸੇ ਮੀਨਾਰ ਦਾ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-053": { mode: "REVERSE_GIVENS", en: "A land survey uses two stations on the same side of a watchtower.", hi: "भूमि सर्वेक्षण में प्रहरी-मीनार के एक ही ओर दो स्टेशन लिए गए।", pa: "ਜ਼ਮੀਨੀ ਸਰਵੇਖਣ ਵਿੱਚ ਪਹਿਰੇਦਾਰ ਮੀਨਾਰ ਦੇ ਇੱਕੋ ਪਾਸੇ ਦੋ ਸਟੇਸ਼ਨ ਲਏ ਗਏ।" },
  "TRG-002-QL-055": { mode: "REVERSE_GIVENS", en: "A survey team marks two collinear observation stations on one side of a tower.", hi: "सर्वेक्षण दल मीनार के एक ही ओर एक सीधी रेखा में दो अवलोकन स्टेशन चिन्हित करता है।", pa: "ਸਰਵੇਖਣ ਟੀਮ ਮੀਨਾਰ ਦੇ ਇੱਕੋ ਪਾਸੇ ਇੱਕ ਸਿੱਧੀ ਰੇਖਾ ਵਿੱਚ ਦੋ ਨਿਰੀਖਣ ਸਟੇਸ਼ਨ ਨਿਸ਼ਾਨਬੱਧ ਕਰਦੀ ਹੈ।" },
  "TRG-002-QL-054": { mode: "ROTATE_GIVENS", en: "For a site survey, two observation stations are fixed on the same straight line from a tower.", hi: "स्थल सर्वेक्षण के लिए मीनार से एक ही सीधी रेखा पर दो अवलोकन स्टेशन तय किए गए।", pa: "ਸਾਈਟ ਸਰਵੇਖਣ ਲਈ ਮੀਨਾਰ ਤੋਂ ਇੱਕੋ ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਦੋ ਨਿਰੀਖਣ ਸਟੇਸ਼ਨ ਨਿਰਧਾਰਤ ਕੀਤੇ ਗਏ।" },
  "TRG-002-QL-060": { mode: "REVERSE_GIVENS", en: "On a straight approach path, an observer takes two readings while walking toward a tower.", hi: "सीधे रास्ते पर मीनार की ओर चलते हुए पर्यवेक्षक दो कोणीय माप लेता है।", pa: "ਸਿੱਧੇ ਰਸਤੇ ਉੱਤੇ ਮੀਨਾਰ ਵੱਲ ਤੁਰਦਿਆਂ ਨਿਰੀਖਕ ਦੋ ਕੋਣੀ ਮਾਪ ਲੈਂਦਾ ਹੈ।" },
  "TRG-002-QL-066": { mode: "ROTATE_GIVENS", en: "A distance-measurement exercise records a tower from two positions on the same approach line.", hi: "दूरी-मापन अभ्यास में एक ही मार्ग पर दो स्थितियों से मीनार का अवलोकन किया गया।", pa: "ਦੂਰੀ-ਮਾਪ ਅਭਿਆਸ ਵਿੱਚ ਇੱਕੋ ਰਸਤੇ ਉੱਤੇ ਦੋ ਸਥਿਤੀਆਂ ਤੋਂ ਮੀਨਾਰ ਦਾ ਨਿਰੀਖਣ ਕੀਤਾ ਗਿਆ।" },
  "TRG-002-QL-072": { mode: "REVERSE_GIVENS", en: "In a communications compound, two towers on the same ray are observed from one station.", hi: "दूरसंचार परिसर में एक ही किरण पर स्थित दो मीनारों को एक स्टेशन से देखा गया।", pa: "ਦੂਰਸੰਚਾਰ ਪਰਿਸਰ ਵਿੱਚ ਇੱਕੋ ਕਿਰਣ ਉੱਤੇ ਸਥਿਤ ਦੋ ਮੀਨਾਰਾਂ ਨੂੰ ਇੱਕ ਸਟੇਸ਼ਨ ਤੋਂ ਵੇਖਿਆ ਗਿਆ।" },
  "TRG-002-QL-077": { mode: "REVERSE_GIVENS", en: "At a construction site, an observer estimates a building height from eye level.", hi: "निर्माण स्थल पर पर्यवेक्षक आँख के स्तर से इमारत की ऊँचाई का अनुमान लगाता है।", pa: "ਨਿਰਮਾਣ ਸਥਾਨ ਉੱਤੇ ਨਿਰੀਖਕ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਂਦਾ ਹੈ।" },
  "TRG-002-QL-081": { mode: "REVERSE_GIVENS", en: "Two survey stations are placed on opposite sides of a tower along one straight ground line.", hi: "एक सीधी जमीन-रेखा पर मीनार के विपरीत ओर दो सर्वेक्षण स्टेशन रखे गए।", pa: "ਇੱਕ ਸਿੱਧੀ ਜ਼ਮੀਨੀ ਰੇਖਾ ਉੱਤੇ ਮੀਨਾਰ ਦੇ ਉਲਟ ਪਾਸਿਆਂ ਦੋ ਸਰਵੇਖਣ ਸਟੇਸ਼ਨ ਰੱਖੇ ਗਏ।" },
  "TRG-002-QL-082": { mode: "ROTATE_GIVENS", en: "A baseline survey observes the same tower from two opposite-side points.", hi: "आधार-रेखा सर्वेक्षण में मीनार को उसके विपरीत ओर स्थित दो बिंदुओं से देखा गया।", pa: "ਅਧਾਰ-ਰੇਖਾ ਸਰਵੇਖਣ ਵਿੱਚ ਮੀਨਾਰ ਨੂੰ ਇਸ ਦੇ ਉਲਟ ਪਾਸਿਆਂ ਸਥਿਤ ਦੋ ਬਿੰਦੂਆਂ ਤੋਂ ਵੇਖਿਆ ਗਿਆ।" },
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
