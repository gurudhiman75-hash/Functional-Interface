import type { Avg001QuestionPackage } from "./types";

type LocalizedLanguage = "hi" | "pa";
type ContextKind =
  | "number"
  | "marks"
  | "salary"
  | "output"
  | "weight"
  | "sales"
  | "age"
  | "price"
  | "reading"
  | "runs";

type ContextProfile = {
  kind: ContextKind;
  average: string;
  total: string;
  item: string;
  incoming: string;
  outgoing: string;
  count: string;
  unitPrefix: string;
  unitSuffix: string;
};

const HI_FRAMES = [
  "अतः {content}",
  "इसलिए {content}",
  "इस प्रकार {content}",
  "फलतः {content}",
  "अतः गणना से {content}",
  "इसलिए सरल करने पर {content}",
  "इस प्रकार मान रखने पर {content}",
  "फलतः अंतिम गणना से {content}",
  "अतः हमें मिलता है कि {content}",
  "इसलिए परिणाम बताता है कि {content}",
  "इस प्रकार आँकड़े दिखाते हैं कि {content}",
  "फलतः निकाला गया मान पुष्टि करता है कि {content}",
  "अतः अंतिम चरण से स्पष्ट है कि {content}",
  "इसलिए अंकगणित से सिद्ध होता है कि {content}",
  "इस प्रकार प्राप्त मान का अर्थ है कि {content}",
  "फलतः दिए आँकड़ों से निष्कर्ष है कि {content}",
  "अतः सरल परिणाम बताता है कि {content}",
  "इसलिए पूरी गणना दिखाती है कि {content}",
  "इस प्रकार अंतिम मान पुष्टि करता है कि {content}",
] as const;

const PA_FRAMES = [
  "ਇਸ ਲਈ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ {content}",
  "ਫਲਸਰੂਪ {content}",
  "ਇਸ ਲਈ ਗਣਨਾ ਤੋਂ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਸਰਲ ਕਰਨ ਉੱਤੇ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ {content}",
  "ਫਲਸਰੂਪ ਅੰਤਿਮ ਗਣਨਾ ਤੋਂ {content}",
  "ਇਸ ਲਈ ਸਾਨੂੰ ਮਿਲਦਾ ਹੈ ਕਿ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਨਤੀਜਾ ਦੱਸਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਅੰਕੜੇ ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ {content}",
  "ਫਲਸਰੂਪ ਕੱਢਿਆ ਮੁੱਲ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਲਈ ਅੰਤਿਮ ਕਦਮ ਤੋਂ ਸਪਸ਼ਟ ਹੈ ਕਿ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਹਿਸਾਬ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਪ੍ਰਾਪਤ ਮੁੱਲ ਦਾ ਅਰਥ ਹੈ ਕਿ {content}",
  "ਫਲਸਰੂਪ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ ਨਤੀਜਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਲਈ ਸਰਲ ਨਤੀਜਾ ਦੱਸਦਾ ਹੈ ਕਿ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਪੂਰੀ ਗਣਨਾ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਅੰਤਿਮ ਮੁੱਲ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ {content}",
] as const;

function kindFromStem(stem: string, language: LocalizedLanguage): ContextKind {
  if (language === "hi") {
    if (/रन|पारी|बल्लेबाज/.test(stem)) return "runs";
    if (/वेतन/.test(stem)) return "salary";
    if (/बिक्री/.test(stem)) return "sales";
    if (/वजन|किग्रा|किलोग्राम/.test(stem)) return "weight";
    if (/आयु|वर्ष|साल/.test(stem)) return "age";
    if (/कीमत/.test(stem)) return "price";
    if (/उत्पादन|मशीन/.test(stem)) return "output";
    if (/अंक|परीक्षा|विद्यार्थी|कक्षा/.test(stem)) return "marks";
    if (/माप|प्रेक्षण/.test(stem)) return "reading";
    return "number";
  }
  if (/ਦੌੜ|ਪਾਰੀ|ਬੱਲੇਬਾਜ਼/.test(stem)) return "runs";
  if (/ਤਨਖਾਹ/.test(stem)) return "salary";
  if (/ਵਿਕਰੀ/.test(stem)) return "sales";
  if (/ਵਜ਼ਨ|ਕਿਲੋਗ੍ਰਾਮ|ਕਿਗ੍ਰਾ/.test(stem)) return "weight";
  if (/ਉਮਰ|ਸਾਲ/.test(stem)) return "age";
  if (/ਕੀਮਤ/.test(stem)) return "price";
  if (/ਉਤਪਾਦਨ|ਮਸ਼ੀਨ/.test(stem)) return "output";
  if (/ਅੰਕ|ਪ੍ਰੀਖਿਆ|ਵਿਦਿਆਰਥੀ|ਜਮਾਤ/.test(stem)) return "marks";
  if (/ਮਾਪ|ਪ੍ਰੇਖਣ/.test(stem)) return "reading";
  return "number";
}

function subjectFromStem(stem: string, language: LocalizedLanguage) {
  if (language === "hi") {
    if (/शिक्षक/.test(stem)) return { incoming: "नए शिक्षक", outgoing: "जाने वाले शिक्षक", count: "शिक्षकों" };
    if (/विद्यार्थी|कक्षा/.test(stem)) return { incoming: "नए विद्यार्थी", outgoing: "जाने वाले विद्यार्थी", count: "विद्यार्थियों" };
    if (/कर्मचारी/.test(stem)) return { incoming: "नए कर्मचारी", outgoing: "जाने वाले कर्मचारी", count: "कर्मचारियों" };
    if (/कर्मी|कार्य-दल/.test(stem)) return { incoming: "नए कर्मी", outgoing: "जाने वाले कर्मी", count: "कर्मियों" };
    if (/मशीन/.test(stem)) return { incoming: "नई मशीन", outgoing: "हटाई गई मशीन", count: "मशीनों" };
    if (/खिलाड़ी|टीम/.test(stem)) return { incoming: "नए खिलाड़ी", outgoing: "जाने वाले खिलाड़ी", count: "खिलाड़ियों" };
    if (/पार्सल/.test(stem)) return { incoming: "नए पार्सल", outgoing: "हटाए गए पार्सल", count: "पार्सलों" };
    if (/वस्तु/.test(stem)) return { incoming: "नई वस्तु", outgoing: "हटाई गई वस्तु", count: "वस्तुओं" };
    if (/परिवार|सदस्य/.test(stem)) return { incoming: "नए सदस्य", outgoing: "जाने वाले सदस्य", count: "सदस्यों" };
    if (/व्यक्ति/.test(stem)) return { incoming: "नए व्यक्ति", outgoing: "जाने वाले व्यक्ति", count: "व्यक्तियों" };
    if (/दिन|बिक्री/.test(stem)) return { incoming: "अगले दिन", outgoing: "हटाए गए दिन", count: "दिनों" };
    if (/परीक्षा/.test(stem)) return { incoming: "अगली परीक्षा", outgoing: "हटाई गई परीक्षा", count: "परीक्षाओं" };
    if (/माप|प्रेक्षण/.test(stem)) return { incoming: "नए प्रेक्षण", outgoing: "हटाए गए प्रेक्षण", count: "प्रेक्षणों" };
    return { incoming: "नई संख्या", outgoing: "हटाई गई संख्या", count: "संख्याओं" };
  }
  if (/ਅਧਿਆਪਕ/.test(stem)) return { incoming: "ਨਵੇਂ ਅਧਿਆਪਕ", outgoing: "ਜਾਣ ਵਾਲੇ ਅਧਿਆਪਕ", count: "ਅਧਿਆਪਕਾਂ" };
  if (/ਵਿਦਿਆਰਥੀ|ਜਮਾਤ/.test(stem)) return { incoming: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ", outgoing: "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ", count: "ਵਿਦਿਆਰਥੀਆਂ" };
  if (/ਕਰਮਚਾਰੀ/.test(stem)) return { incoming: "ਨਵੇਂ ਕਰਮਚਾਰੀ", outgoing: "ਜਾਣ ਵਾਲੇ ਕਰਮਚਾਰੀ", count: "ਕਰਮਚਾਰੀਆਂ" };
  if (/ਕਾਮਾ|ਕਾਰਜ-ਦਲ/.test(stem)) return { incoming: "ਨਵੇਂ ਕਾਮੇ", outgoing: "ਜਾਣ ਵਾਲੇ ਕਾਮੇ", count: "ਕਾਮਿਆਂ" };
  if (/ਮਸ਼ੀਨ/.test(stem)) return { incoming: "ਨਵੀਂ ਮਸ਼ੀਨ", outgoing: "ਹਟਾਈ ਮਸ਼ੀਨ", count: "ਮਸ਼ੀਨਾਂ" };
  if (/ਖਿਡਾਰੀ|ਟੀਮ/.test(stem)) return { incoming: "ਨਵੇਂ ਖਿਡਾਰੀ", outgoing: "ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ", count: "ਖਿਡਾਰੀਆਂ" };
  if (/ਪਾਰਸਲ/.test(stem)) return { incoming: "ਨਵੇਂ ਪਾਰਸਲ", outgoing: "ਹਟਾਏ ਪਾਰਸਲ", count: "ਪਾਰਸਲਾਂ" };
  if (/ਵਸਤੂ/.test(stem)) return { incoming: "ਨਵੀਂ ਵਸਤੂ", outgoing: "ਹਟਾਈ ਵਸਤੂ", count: "ਵਸਤੂਆਂ" };
  if (/ਪਰਿਵਾਰ|ਮੈਂਬਰ/.test(stem)) return { incoming: "ਨਵੇਂ ਮੈਂਬਰ", outgoing: "ਜਾਣ ਵਾਲੇ ਮੈਂਬਰ", count: "ਮੈਂਬਰਾਂ" };
  if (/ਵਿਅਕਤੀ/.test(stem)) return { incoming: "ਨਵੇਂ ਵਿਅਕਤੀ", outgoing: "ਜਾਣ ਵਾਲੇ ਵਿਅਕਤੀ", count: "ਵਿਅਕਤੀਆਂ" };
  if (/ਦਿਨ|ਵਿਕਰੀ/.test(stem)) return { incoming: "ਅਗਲੇ ਦਿਨ", outgoing: "ਹਟਾਏ ਦਿਨ", count: "ਦਿਨਾਂ" };
  if (/ਪ੍ਰੀਖਿਆ/.test(stem)) return { incoming: "ਅਗਲੀ ਪ੍ਰੀਖਿਆ", outgoing: "ਹਟਾਈ ਪ੍ਰੀਖਿਆ", count: "ਪ੍ਰੀਖਿਆਵਾਂ" };
  if (/ਮਾਪ|ਪ੍ਰੇਖਣ/.test(stem)) return { incoming: "ਨਵੇਂ ਪ੍ਰੇਖਣ", outgoing: "ਹਟਾਏ ਪ੍ਰੇਖਣ", count: "ਪ੍ਰੇਖਣਾਂ" };
  return { incoming: "ਨਵੀਂ ਸੰਖਿਆ", outgoing: "ਹਟਾਈ ਸੰਖਿਆ", count: "ਸੰਖਿਆਵਾਂ" };
}

function profile(stem: string, language: LocalizedLanguage): ContextProfile {
  const kind = kindFromStem(stem, language);
  const subject = subjectFromStem(stem, language);
  if (language === "hi") {
    const byKind: Record<ContextKind, Omit<ContextProfile, "kind" | "incoming" | "outgoing" | "count">> = {
      number: { average: "औसत", total: "कुल योग", item: "मान", unitPrefix: "", unitSuffix: "" },
      marks: { average: "औसत अंक", total: "कुल अंक", item: "अंक", unitPrefix: "", unitSuffix: " अंक" },
      salary: { average: "औसत वेतन", total: "कुल वेतन", item: "वेतन", unitPrefix: "₹", unitSuffix: "" },
      output: { average: "औसत उत्पादन", total: "कुल उत्पादन", item: "उत्पादन", unitPrefix: "", unitSuffix: " इकाइयाँ" },
      weight: { average: "औसत वजन", total: "कुल वजन", item: "वजन", unitPrefix: "", unitSuffix: " किग्रा" },
      sales: { average: "औसत दैनिक बिक्री", total: "कुल बिक्री", item: "बिक्री", unitPrefix: "₹", unitSuffix: "" },
      age: { average: "औसत आयु", total: "कुल आयु", item: "आयु", unitPrefix: "", unitSuffix: " वर्ष" },
      price: { average: "औसत कीमत", total: "कुल कीमत", item: "कीमत", unitPrefix: "₹", unitSuffix: "" },
      reading: { average: "औसत माप", total: "मापों का कुल", item: "माप", unitPrefix: "", unitSuffix: "" },
      runs: { average: "बल्लेबाजी औसत", total: "कुल रन", item: "रन", unitPrefix: "", unitSuffix: " रन" },
    };
    return { kind, ...byKind[kind], ...subject };
  }
  const byKind: Record<ContextKind, Omit<ContextProfile, "kind" | "incoming" | "outgoing" | "count">> = {
    number: { average: "ਔਸਤ", total: "ਕੁੱਲ ਜੋੜ", item: "ਮੁੱਲ", unitPrefix: "", unitSuffix: "" },
    marks: { average: "ਔਸਤ ਅੰਕ", total: "ਕੁੱਲ ਅੰਕ", item: "ਅੰਕ", unitPrefix: "", unitSuffix: " ਅੰਕ" },
    salary: { average: "ਔਸਤ ਤਨਖਾਹ", total: "ਕੁੱਲ ਤਨਖਾਹ", item: "ਤਨਖਾਹ", unitPrefix: "₹", unitSuffix: "" },
    output: { average: "ਔਸਤ ਉਤਪਾਦਨ", total: "ਕੁੱਲ ਉਤਪਾਦਨ", item: "ਉਤਪਾਦਨ", unitPrefix: "", unitSuffix: " ਇਕਾਈਆਂ" },
    weight: { average: "ਔਸਤ ਵਜ਼ਨ", total: "ਕੁੱਲ ਵਜ਼ਨ", item: "ਵਜ਼ਨ", unitPrefix: "", unitSuffix: " ਕਿਲੋਗ੍ਰਾਮ" },
    sales: { average: "ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", total: "ਕੁੱਲ ਵਿਕਰੀ", item: "ਵਿਕਰੀ", unitPrefix: "₹", unitSuffix: "" },
    age: { average: "ਔਸਤ ਉਮਰ", total: "ਕੁੱਲ ਉਮਰ", item: "ਉਮਰ", unitPrefix: "", unitSuffix: " ਸਾਲ" },
    price: { average: "ਔਸਤ ਕੀਮਤ", total: "ਕੁੱਲ ਕੀਮਤ", item: "ਕੀਮਤ", unitPrefix: "₹", unitSuffix: "" },
    reading: { average: "ਔਸਤ ਮਾਪ", total: "ਮਾਪਾਂ ਦਾ ਕੁੱਲ", item: "ਮਾਪ", unitPrefix: "", unitSuffix: "" },
    runs: { average: "ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ", total: "ਕੁੱਲ ਦੌੜਾਂ", item: "ਦੌੜਾਂ", unitPrefix: "", unitSuffix: " ਦੌੜਾਂ" },
  };
  return { kind, ...byKind[kind], ...subject };
}

function displayAnswer(pkg: Avg001QuestionPackage, p: ContextProfile) {
  const answer = String(pkg.answer);
  const prefix = p.unitPrefix && !answer.startsWith(p.unitPrefix) ? p.unitPrefix : "";
  const suffix = p.unitSuffix && !answer.includes(p.unitSuffix.trim()) ? p.unitSuffix : "";
  return `${prefix}${answer}${suffix}`;
}

function method(pkg: Avg001QuestionPackage, language: LocalizedLanguage, p: ContextProfile) {
  const mode = pkg.solveMode;
  if (language === "hi") {
    if (mode === "findNewAverageAfterAddition") return `पुराने ${p.average} से ${p.total} निकालें, ${p.incoming} का ${p.item} जोड़ें और बढ़ी हुई संख्या से भाग दें।`;
    if (mode === "findNewAverageAfterRemoval") return `पुराने ${p.average} से ${p.total} निकालें, ${p.outgoing} का ${p.item} घटाएँ और शेष संख्या से भाग दें।`;
    if (mode === "findNewAverageAfterReplacement") return `${p.total} में पुराना ${p.item} घटाकर नया ${p.item} जोड़ें; संख्या वही रहती है।`;
    if (mode === "findAddedMemberValueFromShift") return `पुराने और नए ${p.average} से दोनों कुल निकालें; उनका अंतर ${p.incoming} का ${p.item} देता है।`;
    if (mode === "findRemovedMemberValueFromShift") return `पुराने और शेष समूह के कुल निकालें; उनका अंतर ${p.outgoing} का ${p.item} देता है।`;
    if (mode === "findReplacementValueFromShift") return `${p.total} में हुए परिवर्तन को पुराने ${p.item} के साथ समायोजित करके नया ${p.item} निकालें।`;
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "पुराने कुल रन में अगली पारी के रन जोड़ें और नई पारी-संख्या से भाग दें।"
      : "लक्षित कुल रन में से वर्तमान कुल रन घटाकर अगली पारी के आवश्यक रन निकालें।";
    if (mode === "findOriginalCountFromJoiningMemberShift") return `${p.incoming} के अतिरिक्त ${p.item} को औसत-वृद्धि से भाग दें और नए सदस्य का एक स्थान घटाएँ।`;
    if (mode === "findOriginalCountFromLeavingMemberShift") return `${p.outgoing} के ${p.item}-अंतर को औसत-परिवर्तन से भाग दें और उसका एक स्थान वापस जोड़ें।`;
    return pkg.explanation.lines[1] ?? "दिए मानों से आवश्यक कुल निकालें।";
  }
  if (mode === "findNewAverageAfterAddition") return `ਪੁਰਾਣੀ ${p.average} ਤੋਂ ${p.total} ਕੱਢੋ, ${p.incoming} ਦਾ ${p.item} ਜੋੜੋ ਅਤੇ ਵਧੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (mode === "findNewAverageAfterRemoval") return `ਪੁਰਾਣੀ ${p.average} ਤੋਂ ${p.total} ਕੱਢੋ, ${p.outgoing} ਦਾ ${p.item} ਘਟਾਓ ਅਤੇ ਬਾਕੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (mode === "findNewAverageAfterReplacement") return `${p.total} ਵਿੱਚ ਪੁਰਾਣਾ ${p.item} ਘਟਾ ਕੇ ਨਵਾਂ ${p.item} ਜੋੜੋ; ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।`;
  if (mode === "findAddedMemberValueFromShift") return `ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ${p.average} ਤੋਂ ਦੋਵੇਂ ਕੁੱਲ ਕੱਢੋ; ਉਨ੍ਹਾਂ ਦਾ ਫਰਕ ${p.incoming} ਦਾ ${p.item} ਦਿੰਦਾ ਹੈ।`;
  if (mode === "findRemovedMemberValueFromShift") return `ਪੁਰਾਣੇ ਅਤੇ ਬਾਕੀ ਸਮੂਹ ਦੇ ਕੁੱਲ ਕੱਢੋ; ਉਨ੍ਹਾਂ ਦਾ ਫਰਕ ${p.outgoing} ਦਾ ${p.item} ਦਿੰਦਾ ਹੈ।`;
  if (mode === "findReplacementValueFromShift") return `${p.total} ਵਿੱਚ ਆਏ ਬਦਲਾਅ ਨੂੰ ਪੁਰਾਣੇ ${p.item} ਨਾਲ ਮਿਲਾ ਕੇ ਨਵਾਂ ${p.item} ਕੱਢੋ।`;
  if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
    ? "ਪੁਰਾਣੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚ ਅਗਲੀ ਪਾਰੀ ਦੀਆਂ ਦੌੜਾਂ ਜੋੜੋ ਅਤੇ ਨਵੀਂ ਪਾਰੀ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।"
    : "ਟੀਚੇ ਦੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚੋਂ ਮੌਜੂਦਾ ਕੁੱਲ ਦੌੜਾਂ ਘਟਾ ਕੇ ਅਗਲੀ ਪਾਰੀ ਲਈ ਲੋੜੀਂਦੀਆਂ ਦੌੜਾਂ ਕੱਢੋ।";
  if (mode === "findOriginalCountFromJoiningMemberShift") return `${p.incoming} ਦੇ ਵਾਧੂ ${p.item} ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਨਵੇਂ ਮੈਂਬਰ ਦਾ ਇੱਕ ਸਥਾਨ ਘਟਾਓ।`;
  if (mode === "findOriginalCountFromLeavingMemberShift") return `${p.outgoing} ਦੇ ${p.item}-ਫਰਕ ਨੂੰ ਔਸਤ-ਬਦਲਾਅ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਉਸ ਦਾ ਇੱਕ ਸਥਾਨ ਮੁੜ ਜੋੜੋ।`;
  return pkg.explanation.lines[1] ?? "ਦਿੱਤੇ ਮੁੱਲਾਂ ਤੋਂ ਲੋੜੀਂਦਾ ਕੁੱਲ ਕੱਢੋ।";
}

function conclusionContent(pkg: Avg001QuestionPackage, language: LocalizedLanguage, p: ContextProfile) {
  const answer = displayAnswer(pkg, p);
  const mode = pkg.solveMode;
  if (language === "hi") {
    if (mode === "findNewAverageAfterAddition" || mode === "findNewAverageAfterRemoval" || mode === "findNewAverageAfterReplacement") return `नया ${p.average} ${answer} है`;
    if (mode === "findAddedMemberValueFromShift") return `${p.incoming} का ${p.item} ${answer} है`;
    if (mode === "findRemovedMemberValueFromShift") return `${p.outgoing} का ${p.item} ${answer} है`;
    if (mode === "findReplacementValueFromShift") return `${p.incoming} का ${p.item} ${answer} है`;
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? `नया बल्लेबाजी औसत ${answer} है`
      : `अगली पारी में आवश्यक स्कोर ${answer} है`;
    if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") return `${p.count} की प्रारंभिक संख्या ${pkg.answer} है`;
    return `आवश्यक मान ${answer} है`;
  }
  if (mode === "findNewAverageAfterAddition" || mode === "findNewAverageAfterRemoval" || mode === "findNewAverageAfterReplacement") return `ਨਵੀਂ ${p.average} ${answer} ਹੈ`;
  if (mode === "findAddedMemberValueFromShift") return `${p.incoming} ਦਾ ${p.item} ${answer} ਹੈ`;
  if (mode === "findRemovedMemberValueFromShift") return `${p.outgoing} ਦਾ ${p.item} ${answer} ਹੈ`;
  if (mode === "findReplacementValueFromShift") return `${p.incoming} ਦਾ ${p.item} ${answer} ਹੈ`;
  if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
    ? `ਨਵੀਂ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ${answer} ਹੈ`
    : `ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ਲੋੜੀਂਦਾ ਸਕੋਰ ${answer} ਹੈ`;
  if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") return `${p.count} ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ${pkg.answer} ਹੈ`;
  return `ਲੋੜੀਂਦਾ ਮੁੱਲ ${answer} ਹੈ`;
}

function contextualizeEquations(lines: string[], p: ContextProfile, language: LocalizedLanguage) {
  return lines.map((line) => {
    if (language === "hi") {
      const excess = p.kind === "marks" ? "अतिरिक्त अंक" : p.kind === "runs" ? "अतिरिक्त रन" : p.kind === "output" ? "अतिरिक्त उत्पादन" : `अतिरिक्त ${p.item}`;
      const gap = p.kind === "marks" ? "अंक-अंतर" : p.kind === "runs" ? "रन-अंतर" : p.kind === "output" ? "उत्पादन-अंतर" : `${p.item}-अंतर`;
      return line.replaceAll("अतिरिक्त मान", excess).replaceAll("मान-अंतर", gap);
    }
    const excess = p.kind === "marks" ? "ਵਾਧੂ ਅੰਕ" : p.kind === "runs" ? "ਵਾਧੂ ਦੌੜਾਂ" : p.kind === "output" ? "ਵਾਧੂ ਉਤਪਾਦਨ" : `ਵਾਧੂ ${p.item}`;
    const gap = p.kind === "marks" ? "ਅੰਕ-ਫਰਕ" : p.kind === "runs" ? "ਦੌੜਾਂ ਦਾ ਫਰਕ" : p.kind === "output" ? "ਉਤਪਾਦਨ-ਫਰਕ" : `${p.item}-ਫਰਕ`;
    return line.replaceAll("ਵਾਧੂ ਮੁੱਲ", excess).replaceAll("ਮੁੱਲ-ਅੰਤਰ", gap);
  });
}

export function finalizeAvg001Cp003ExplanationContext(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003" || (pkg.language !== "hi" && pkg.language !== "pa")) return pkg;
  const language = pkg.language as LocalizedLanguage;
  const p = profile(pkg.stem, language);
  const id = Math.max(0, Number(pkg.questionLanguageId.slice(-3)) - 1);
  const frames = language === "hi" ? HI_FRAMES : PA_FRAMES;
  const lines = contextualizeEquations([...pkg.explanation.lines], p, language);
  if (lines.length > 1) lines[1] = method(pkg, language, p);
  lines[lines.length - 1] = `${frames[Math.floor(id / 23) % frames.length]!.replace("{content}", conclusionContent(pkg, language, p))}${language === "hi" ? "।" : "।"}`;
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      cp003ExplanationContextFinalizer: "AVG-CP-003 localized context finalizer v1",
    },
  };
}
