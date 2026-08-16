import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type EditorialPair = readonly [string, string];
type EditorialDict = Readonly<Record<string, string>>;

export function protectMensurationFormulaIdentifiers(text: string) {
  const values: string[] = [];
  const save = (value: string) => {
    const token = `⟦V${values.length}⟧`;
    values.push(value);
    return token;
  };
  let protectedText = text.replace(
    /\b([A-Za-z])\b(?=\s*(?:[_²³^=+×÷−\-*/)]))/g,
    (match) => save(match),
  );
  protectedText = protectedText.replace(
    /([=+×÷−\-*/(]\s*)([A-Za-z])\b/g,
    (_match, prefix: string, variable: string) => `${prefix}${save(variable)}`,
  );
  return {
    text: protectedText,
    restore(value: string) {
      let restored = value;
      values.forEach((variable, index) => {
        restored = restored.replace(`⟦V${index}⟧`, variable);
      });
      return restored;
    },
  };
}

/**
 * Presentation-only math repair shared by English, Hindi and Punjabi surfaces.
 * It must not alter mathematical values, operators or answer semantics.
 */
export function repairMensurationLearnerMathSurface(text: string) {
  return text
    .replace(/\\pih\b/g, "\\pi h")
    // Raw CP008 QL077 source can contain a formatted RHS nested inside an
    // outer MathJax span: `$TSA-CSA=$128\\pi\\text{ cm}^{2}$$`.
    .replace(
      /\$TSA-CSA=\$(\d+\\pi\\text\{ cm\}\^\{2\})\$\$/g,
      (_match, rhs: string) => `$TSA-CSA=${rhs}$`,
    )
    // After localization/protection the redundant trailing delimiter may
    // already have been collapsed, leaving three dollars. Remove only the
    // duplicated middle opener to retain one balanced span.
    .replace(/\$TSA-CSA=\$(?=\d)/g, () => "$TSA-CSA=");
}

/**
 * Phrase translation intentionally runs before the word dictionary. Older
 * authority phrases such as "surface area" can therefore match the prefix of
 * an English plural ("surface areas") and leave an impossible Latin `s`
 * attached to the localized noun. Repair only the observed noun forms here;
 * do not strip arbitrary Latin/Indic joins, because the hard-gate audit must
 * continue to expose every other token-boundary defect.
 */
export function repairMensurationLocalizedPluralJoins(text: string, language: MensurationLocalizedLanguage) {
  if (language === "hi") {
    return text
      .replace(/क्षेत्रफलs\b/g, "क्षेत्रफल")
      .replace(/ऊँचाईs\b/g, "ऊँचाइयाँ")
      .replace(/त्रिभुजs\b/g, "त्रिभुज");
  }
  return text
    .replace(/ਖੇਤਰਫਲs\b/g, "ਖੇਤਰਫਲ")
    .replace(/ਉਚਾਈs\b/g, "ਉਚਾਈਆਂ")
    .replace(/ਤਿਕੋਣs\b/g, "ਤਿਕੋਣ");
}

const HI_EDITORIAL_PHRASES: readonly EditorialPair[] = [
  ["triangular sheet-metal piece", "त्रिभुजाकार धातु की चादर"],
  ["triangular glass pane", "त्रिभुजाकार काँच की पट्टी"],
  ["triangular banner", "त्रिभुजाकार बैनर"],
  ["equilateral plot", "समबाहु त्रिभुजाकार भूखंड"],
  ["sheet-metal piece", "धातु की चादर"],
  ["glass pane", "काँच की पट्टी"],
  ["has been used", "प्रयोग किया गया है"],
  ["has been removed", "हटा दिया गया है"],
  ["has been applied", "लगाया गया है"],
  ["has been changed", "बदला गया है"],
  ["has been selected", "चुना गया है"],
  ["instead of", "के बजाय"],
  ["comes from", "से आता है"],
  ["belongs to", "से संबंधित है"],
  ["according to", "के अनुसार"],
  ["in the question", "प्रश्न में"],
  ["the question asks", "प्रश्न में पूछा गया है"],
  ["this option", "यह विकल्प"],
  ["that option", "वह विकल्प"],
  ["the option", "विकल्प"],
  ["the picture", "चित्र"],
  ["at this stage", "इस चरण पर"],
  ["at this step", "इस चरण में"],
  ["intermediate value", "मध्यवर्ती मान"],
  ["intermediate result", "मध्यवर्ती परिणाम"],
  ["correct option", "सही विकल्प"],
  ["wrong option", "गलत विकल्प"],
  ["required quantity", "आवश्यक राशि"],
  ["final answer", "अंतिम उत्तर"],
  ["respectively", "क्रमशः"],
];

const PA_EDITORIAL_PHRASES: readonly EditorialPair[] = [
  ["triangular sheet-metal piece", "ਤਿਕੋਣੀ ਧਾਤ ਦੀ ਚਾਦਰ"],
  ["triangular glass pane", "ਤਿਕੋਣੀ ਕੱਚ ਦੀ ਪੱਟੀ"],
  ["triangular banner", "ਤਿਕੋਣਾ ਬੈਨਰ"],
  ["equilateral plot", "ਸਮਭੁਜ ਤਿਕੋਣਾ ਪਲਾਟ"],
  ["sheet-metal piece", "ਧਾਤ ਦੀ ਚਾਦਰ"],
  ["glass pane", "ਕੱਚ ਦੀ ਪੱਟੀ"],
  ["has been used", "ਵਰਤਿਆ ਗਿਆ ਹੈ"],
  ["has been removed", "ਹਟਾਇਆ ਗਿਆ ਹੈ"],
  ["has been applied", "ਲਗਾਇਆ ਗਿਆ ਹੈ"],
  ["has been changed", "ਬਦਲਿਆ ਗਿਆ ਹੈ"],
  ["has been selected", "ਚੁਣਿਆ ਗਿਆ ਹੈ"],
  ["instead of", "ਦੀ ਬਜਾਏ"],
  ["comes from", "ਤੋਂ ਆਉਂਦਾ ਹੈ"],
  ["belongs to", "ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ"],
  ["according to", "ਦੇ ਅਨੁਸਾਰ"],
  ["in the question", "ਸਵਾਲ ਵਿੱਚ"],
  ["the question asks", "ਸਵਾਲ ਵਿੱਚ ਪੁੱਛਿਆ ਗਿਆ ਹੈ"],
  ["this option", "ਇਹ ਵਿਕਲਪ"],
  ["that option", "ਉਹ ਵਿਕਲਪ"],
  ["the option", "ਵਿਕਲਪ"],
  ["the picture", "ਚਿੱਤਰ"],
  ["at this stage", "ਇਸ ਪੜਾਅ 'ਤੇ"],
  ["at this step", "ਇਸ ਕਦਮ ਵਿੱਚ"],
  ["intermediate value", "ਵਿਚਕਾਰਲਾ ਮੁੱਲ"],
  ["intermediate result", "ਵਿਚਕਾਰਲਾ ਨਤੀਜਾ"],
  ["correct option", "ਸਹੀ ਵਿਕਲਪ"],
  ["wrong option", "ਗਲਤ ਵਿਕਲਪ"],
  ["required quantity", "ਲੋੜੀਂਦੀ ਮਾਤਰਾ"],
  ["final answer", "ਅੰਤਿਮ ਉੱਤਰ"],
  ["respectively", "ਕ੍ਰਮਵਾਰ"],
];

const HI_EDITORIAL_WORDS: EditorialDict = {
  option:"विकल्प", here:"यहाँ", picture:"चित्र", so:"इसलिए", been:"गया", it:"यह",
  instead:"इसके बजाय", multiplying:"गुणा करने पर", take:"लें", question:"प्रश्न", comes:"आता है",
  boundary:"सीमा", what:"क्या", used:"प्रयोग किया", intermediate:"मध्यवर्ती", extra:"अतिरिक्त",
  flat:"समतल", gives:"देता है", step:"चरण", removed:"हटाया", stage:"चरण", different:"अलग",
  remains:"शेष रहता है", stopping:"रुकना", applied:"लगाया", be:"हो", operation:"क्रिया",
  produces:"देता है", belongs:"संबंधित है", dividing:"भाग देने पर", calculating:"गणना करते समय",
  adding:"जोड़ने पर", matching:"संबंधित", changed:"बदला", solution:"हल", incorrectly:"गलत तरीके से",
  units:"इकाइयाँ", out:"बाहर", report:"रिपोर्ट", linear:"रैखिक", subtracting:"घटाने पर",
  circular:"वृत्ताकार", full:"पूरा", visible:"दिखाई देने वाला", half:"आधा", leaving:"छोड़कर",
  area:"क्षेत्रफल", but:"लेकिन", belong:"संबंधित होना", asks:"पूछता है", right:"सही",
  opposite:"विपरीत", though:"हालाँकि", any:"कोई", all:"सभी", even:"भी", rectangular:"आयताकार",
  covered:"ढका हुआ", shape:"आकृति", enclosed:"घिरा हुआ", left:"शेष", requires:"आवश्यक है",
  plan:"योजना", keeps:"बनाए रखता है", measured:"मापा गया", you:"आप", match:"मिलान",
  triangle:"त्रिभुज", control:"नियंत्रण", reporting:"बताते समय", backwards:"उल्टा", necessary:"आवश्यक",
  simple:"सरल", skipped:"छोड़ा गया", shown:"दिखाया गया", missing:"छूटा हुआ", obtained:"प्राप्त",
  doubling:"दोगुना करने पर", becomes:"हो जाता है", assigned:"दिया गया", meaning:"अर्थ", symbol:"चिह्न",
  squaring:"वर्ग करने पर", angle:"कोण", now:"अब", below:"नीचे", according:"अनुसार",
  actually:"वास्तव में", reach:"प्राप्त करें", centre:"केंद्र", excluded:"शामिल नहीं", which:"जो",
  break:"तोड़ें", long:"लंबा", broad:"चौड़ा", triangular:"त्रिभुजाकार", banner:"बैनर",
  pairs:"युग्म", halving:"आधा करने पर", measures:"माप", numerical:"संख्यात्मक", they:"वे",
  twice:"दो गुना", depends:"निर्भर करता है", straight:"सीधा", taking:"लेने पर", putting:"रखने पर",
  radii:"त्रिज्याएँ", cut:"काटें", treating:"मानते हुए", fraction:"भिन्न", no:"नहीं",
  selected:"चुना गया", counting:"गिनते समय", counts:"गिनती", solve:"हल करें", itself:"स्वयं",
  unit:"इकाई", choosing:"चुनते समय", square:"वर्ग", sum:"योग", follows:"इस प्रकार मिलता है",
};

const PA_EDITORIAL_WORDS: EditorialDict = {
  option:"ਵਿਕਲਪ", here:"ਇੱਥੇ", picture:"ਚਿੱਤਰ", so:"ਇਸ ਲਈ", been:"ਗਿਆ", it:"ਇਹ",
  instead:"ਇਸ ਦੀ ਬਜਾਏ", multiplying:"ਗੁਣਾ ਕਰਨ 'ਤੇ", take:"ਲਓ", question:"ਸਵਾਲ", comes:"ਆਉਂਦਾ ਹੈ",
  boundary:"ਸੀਮਾ", what:"ਕੀ", used:"ਵਰਤਿਆ", intermediate:"ਵਿਚਕਾਰਲਾ", extra:"ਵਾਧੂ",
  flat:"ਸਮਤਲ", gives:"ਦਿੰਦਾ ਹੈ", step:"ਕਦਮ", removed:"ਹਟਾਇਆ", stage:"ਪੜਾਅ", different:"ਵੱਖਰਾ",
  remains:"ਬਾਕੀ ਰਹਿੰਦਾ ਹੈ", stopping:"ਰੁਕਣਾ", applied:"ਲਗਾਇਆ", be:"ਹੋ", operation:"ਕਿਰਿਆ",
  produces:"ਦਿੰਦਾ ਹੈ", belongs:"ਸੰਬੰਧਿਤ ਹੈ", dividing:"ਭਾਗ ਦੇਣ 'ਤੇ", calculating:"ਗਣਨਾ ਕਰਦੇ ਸਮੇਂ",
  adding:"ਜੋੜਨ 'ਤੇ", matching:"ਸੰਬੰਧਿਤ", changed:"ਬਦਲਿਆ", solution:"ਹੱਲ", incorrectly:"ਗਲਤ ਤਰੀਕੇ ਨਾਲ",
  units:"ਇਕਾਈਆਂ", out:"ਬਾਹਰ", report:"ਰਿਪੋਰਟ", linear:"ਰੇਖੀ", subtracting:"ਘਟਾਉਣ 'ਤੇ",
  circular:"ਵ੍ਰਿਤਾਕਾਰ", full:"ਪੂਰਾ", visible:"ਦਿੱਖਣ ਵਾਲਾ", half:"ਅੱਧਾ", leaving:"ਛੱਡ ਕੇ",
  area:"ਖੇਤਰਫਲ", but:"ਪਰ", belong:"ਸੰਬੰਧਿਤ ਹੋਣਾ", asks:"ਪੁੱਛਦਾ ਹੈ", right:"ਸਹੀ",
  opposite:"ਉਲਟ", though:"ਭਾਵੇਂ", any:"ਕੋਈ", all:"ਸਾਰੇ", even:"ਵੀ", rectangular:"ਆਇਤਾਕਾਰ",
  covered:"ਢੱਕਿਆ", shape:"ਆਕਾਰ", enclosed:"ਘਿਰਿਆ", left:"ਬਾਕੀ", requires:"ਲੋੜ ਹੈ",
  plan:"ਯੋਜਨਾ", keeps:"ਬਣਾਈ ਰੱਖਦਾ ਹੈ", measured:"ਮਾਪਿਆ", you:"ਤੁਸੀਂ", match:"ਮਿਲਾਨ",
  triangle:"ਤਿਕੋਣ", control:"ਨਿਯੰਤਰਣ", reporting:"ਦੱਸਦੇ ਸਮੇਂ", backwards:"ਉਲਟ", necessary:"ਲਾਜ਼ਮੀ",
  simple:"ਸਰਲ", skipped:"ਛੱਡਿਆ ਗਿਆ", shown:"ਦਿਖਾਇਆ ਗਿਆ", missing:"ਛੁੱਟਿਆ ਹੋਇਆ", obtained:"ਪ੍ਰਾਪਤ",
  doubling:"ਦੁੱਗਣਾ ਕਰਨ 'ਤੇ", becomes:"ਹੋ ਜਾਂਦਾ ਹੈ", assigned:"ਦਿੱਤਾ ਗਿਆ", meaning:"ਅਰਥ", symbol:"ਚਿੰਨ੍ਹ",
  squaring:"ਵਰਗ ਕਰਨ 'ਤੇ", angle:"ਕੋਣ", now:"ਹੁਣ", below:"ਹੇਠਾਂ", according:"ਅਨੁਸਾਰ",
  actually:"ਅਸਲ ਵਿੱਚ", reach:"ਪ੍ਰਾਪਤ ਕਰੋ", centre:"ਕੇਂਦਰ", excluded:"ਸ਼ਾਮਲ ਨਹੀਂ", which:"ਜੋ",
  break:"ਤੋੜੋ", long:"ਲੰਮਾ", broad:"ਚੌੜਾ", triangular:"ਤਿਕੋਣਾ", banner:"ਬੈਨਰ",
  pairs:"ਜੋੜੇ", halving:"ਅੱਧਾ ਕਰਨ 'ਤੇ", measures:"ਮਾਪ", numerical:"ਅੰਕੀ", they:"ਉਹ",
  twice:"ਦੋ ਗੁਣਾ", depends:"ਨਿਰਭਰ ਕਰਦਾ ਹੈ", straight:"ਸਿੱਧਾ", taking:"ਲੈਣ 'ਤੇ", putting:"ਰੱਖਣ 'ਤੇ",
  radii:"ਅਰਧ-ਵਿਆਸ", cut:"ਕੱਟੋ", treating:"ਮੰਨਦੇ ਹੋਏ", fraction:"ਭਿੰਨ", no:"ਨਹੀਂ",
  selected:"ਚੁਣਿਆ ਗਿਆ", counting:"ਗਿਣਦੇ ਸਮੇਂ", counts:"ਗਿਣਤੀ", solve:"ਹੱਲ ਕਰੋ", itself:"ਆਪ",
  unit:"ਇਕਾਈ", choosing:"ਚੁਣਦੇ ਸਮੇਂ", square:"ਵਰਗ", sum:"ਜੋੜ", follows:"ਇਸ ਤਰ੍ਹਾਂ ਮਿਲਦਾ ਹੈ",
};

function protectMathSpans(text: string) {
  const values: string[] = [];
  const save = (value: string) => {
    const token = `⟦M${values.length}⟧`;
    values.push(value);
    return token;
  };
  let out = text
    .replace(/\$\$[\s\S]*?\$\$/g, save)
    .replace(/\$[^$]*\$/g, save)
    .replace(/\\\([\s\S]*?\\\)/g, save)
    .replace(/\\\[[\s\S]*?\\\]/g, save);
  return {
    text: out,
    restore(value: string) {
      let restored = value;
      values.forEach((math, index) => {
        restored = restored.replace(`⟦M${index}⟧`, math);
      });
      return restored;
    },
  };
}

function replaceEditorialPhrases(text: string, pairs: readonly EditorialPair[]) {
  let out = text;
  for (const [source, target] of [...pairs].sort((a, b) => b[0].length - a[0].length)) {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "gi"), target);
  }
  return out;
}

/**
 * Controlled second-pass prose remediation. It runs only outside MathJax and
 * only translates a curated high-frequency editorial lexicon observed by the
 * 3,192-question leakage audit. This is intentionally not a generic machine
 * translator and must never rewrite formulas, variables, units or option math.
 */
export function repairMensurationLocalizedEditorialProse(text: string, language: MensurationLocalizedLanguage) {
  const protectedMath = protectMathSpans(text);
  const phrases = language === "hi" ? HI_EDITORIAL_PHRASES : PA_EDITORIAL_PHRASES;
  const words = language === "hi" ? HI_EDITORIAL_WORDS : PA_EDITORIAL_WORDS;
  let out = replaceEditorialPhrases(protectedMath.text, phrases);
  out = out.replace(/\b[A-Za-z]+\b/g, (word) => words[word.toLowerCase()] ?? word);
  out = protectedMath.restore(out);
  if (language === "hi") {
    return out
      .replace(/\bएक\s+त्रिभुजाकार\s+बैनर\s+हैं\b/g, "एक त्रिभुजाकार बैनर है")
      .replace(/\bहै\s+गया\b/g, "गया है")
      .replace(/\bहैं\s+गया\b/g, "गए हैं")
      .replace(/\s{2,}/g, " ");
  }
  return out
    .replace(/\bਇੱਕ\s+ਤਿਕੋਣਾ\s+ਬੈਨਰ\s+ਹਨ\b/g, "ਇੱਕ ਤਿਕੋਣਾ ਬੈਨਰ ਹੈ")
    .replace(/\bਹੈ\s+ਗਿਆ\b/g, "ਗਿਆ ਹੈ")
    .replace(/\bਹਨ\s+ਗਿਆ\b/g, "ਗਏ ਹਨ")
    .replace(/\s{2,}/g, " ");
}

/**
 * Final learner-language polish that must not add or remove mathematical
 * notation relative to the English authority. Keep these rewrites semantic:
 * worded relations remain worded relations rather than new symbols.
 */
export function polishMensurationLocalizedText(text: string, language: MensurationLocalizedLanguage) {
  const tokenSafe = repairMensurationLocalizedPluralJoins(text, language);
  const mathSafe = repairMensurationLearnerMathSurface(tokenSafe);
  const editorialSafe = repairMensurationLocalizedEditorialProse(mathSafe, language);
  if (language === "hi") {
    return editorialSafe
      .replace(/वक्र पृष्ठ क्षेत्रफल\s*=\s*परिधि\s*×\s*ऊँचाई/g, "वक्र पृष्ठ क्षेत्रफल परिधि × ऊँचाई के बराबर होता है")
      .replace(/\.\s*$/g, ".")
      .trim();
  }
  return editorialSafe
    .replace(/ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ\s*=\s*ਪਰਿਧੀ\s*×\s*ਉਚਾਈ/g, "ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ ਪਰਿਧੀ × ਉਚਾਈ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ")
    .replace(/\.\s*$/g, ".")
    .trim();
}
