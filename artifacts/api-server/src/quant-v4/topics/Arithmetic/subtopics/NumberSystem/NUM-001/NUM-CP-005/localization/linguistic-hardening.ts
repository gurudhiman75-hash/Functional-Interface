import type { NumCp005PermanentQuestion } from "../permanent/runtime";
import type {
  NumCp005LocalizedOption,
  NumCp005LocalizedQuestion,
  NumCp005TranslatedLocale,
} from "./types";

function replaceAllText(value: string, replacements: readonly (readonly [string, string])[]): string {
  return replacements.reduce((text, [from, to]) => text.replaceAll(from, to), value);
}

function naturalizeText(value: string, locale: NumCp005TranslatedLocale): string {
  const common: readonly (readonly [string, string])[] = locale === "hi-IN"
    ? [
        ["n के उचित धनात्मक भाजकों", "n से छोटे धनात्मक भाजकों"],
        ["उचित योग के लिए n घटाइए", "n से छोटे भाजकों का योग पूछा हो तो n घटाइए"],
        ["गैर-बढ़ते क्रम", "घटते या बराबर क्रम"],
        ["एक लघु विवरण में ", ""],
        ["पहले दोनों सूत्र-मान लिखिए", "पहले दोनों निकाले हुए मान लिखिए"],
        ["केवल साझा मिलान चुनिए", "वह पंक्ति चुनिए जो दोनों शर्तें पूरी करती है"],
      ]
    : [
        ["n ਦੇ ਢੰਗ ਦੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ", "n ਤੋਂ ਛੋਟੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ"],
        ["ਢੰਗ ਦੇ ਭਾਜਕਾਂ ਦੇ ਜੋੜ ਲਈ n ਘਟਾਓ", "n ਤੋਂ ਛੋਟੇ ਭਾਜਕਾਂ ਦਾ ਜੋੜ ਪੁੱਛਿਆ ਹੋਵੇ ਤਾਂ n ਘਟਾਓ"],
        ["ਨਾ-ਵੱਧਦੇ ਕ੍ਰਮ", "ਘਟਦੇ ਜਾਂ ਬਰਾਬਰ ਕ੍ਰਮ"],
        ["ਪੂਰਨ rਵੀਂ ਘਾਤ", "ਪੂਰਨ r-ਵੀਂ ਘਾਤ"],
        ["ਲਕਸ਼ ਭਾਜਕ ਗਿਣਤੀ", "ਲੋੜੀਂਦੀ ਭਾਜਕ ਗਿਣਤੀ"],
        ["ਲਕਸ਼ ਤੋਂ", "ਲੋੜੀਂਦੇ ਮੁੱਲ ਤੋਂ"],
        ["ਸਾਂਝਾ ਮਿਲਾਪ ਚੁਣੋ", "ਉਹ ਕਤਾਰ ਚੁਣੋ ਜੋ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀ ਕਰਦੀ ਹੈ"],
        ["ਨਿਯਮ-ਮੁੱਲ", "ਕੱਢੇ ਹੋਏ ਮੁੱਲ"],
        ["ਇੱਕ ਛੋਟੇ ਵੇਰਵੇ ਵਿੱਚ ", ""],
        ["ਉਹ ਲਾਈਨ ਚੁਣੋ", "ਉਹ ਕਤਾਰ ਚੁਣੋ"],
        ["ਹਰ ਲਾਈਨ ਉੱਤੇ", "ਹਰ ਕਤਾਰ ਉੱਤੇ"],
        ["ਸਹੀ ਲਾਈਨ ਨੂੰ", "ਸਹੀ ਕਤਾਰ ਨੂੰ"],
        ["ਲਾਈਨ ਤੁਰੰਤ ਹਟਾਓ", "ਕਤਾਰ ਤੁਰੰਤ ਹਟਾਓ"],
        ["ਹਰ ਲਾਈਨ ਦੇ", "ਹਰ ਕਤਾਰ ਦੇ"],
        ["ਸਹੀ ਲਾਈਨ ਵਿੱਚ", "ਸਹੀ ਕਤਾਰ ਵਿੱਚ"],
        ["ਕਰਣੀਆਂ", "ਕਰਨੀਆਂ"],
        ["ਮੂਲ ਸੰਖਿਆਵਾਂ ਜਾਂਚਣ ਦੀ ਥਾਂ", "n ਦੇ ਮੁੱਲ ਇਕ-ਇਕ ਕਰਕੇ ਜਾਂਚਣ ਦੀ ਥਾਂ"],
        ["ਨਾਲ ਭਾਜਯ ਨਹੀਂ ਹਨ", "ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਹੀਂ ਵੰਡੇ ਜਾਂਦੇ"],
        ["ਨਾਲ ਭਾਜਯ ਹਨ", "ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੰਡੇ ਜਾਂਦੇ ਹਨ"],
        ["ਨਾਲ ਭਾਜਯ ਨਹੀਂ ਹੈ", "ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਹੀਂ ਵੰਡੀ ਜਾਂਦੀ"],
        ["k ਨਾਲ ਭਾਜਯ ਭਾਜਕ", "k ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੰਡੇ ਜਾਣ ਵਾਲੇ ਭਾਜਕ"],
        ["k1 ਨਾਲ ਭਾਜਯ ਭਾਜਕ", "k1 ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੰਡੇ ਜਾਣ ਵਾਲੇ ਭਾਜਕ"],
        ["ਦੋਵਾਂ ਨਾਲ ਭਾਜਯ ਭਾਜਕ", "ਦੋਵਾਂ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੰਡੇ ਜਾਣ ਵਾਲੇ ਭਾਜਕ"],
      ];
  return replaceAllText(value, common);
}

function misconceptionReason(
  misconceptionId: string | null,
  locale: NumCp005TranslatedLocale,
): string {
  const hi = locale === "hi-IN";
  const id = misconceptionId ?? "";

  if (id.endsWith("OMIT-ONE")) return hi ? "इसमें 1 को भाजक नहीं गिना गया है।" : "ਇਸ ਵਿੱਚ 1 ਨੂੰ ਭਾਜਕ ਨਹੀਂ ਗਿਣਿਆ ਗਿਆ।";
  if (id.endsWith("OMIT-N")) return hi ? "इसमें स्वयं संख्या n को भाजक नहीं गिना गया है।" : "ਇਸ ਵਿੱਚ ਸੰਖਿਆ n ਨੂੰ ਆਪ ਭਾਜਕ ਨਹੀਂ ਗਿਣਿਆ ਗਿਆ।";
  if (id.endsWith("ADD-NONDIVISOR")) return hi ? "इसमें ऐसा मान जोड़ दिया गया है जो n को पूरा विभाजित नहीं करता।" : "ਇਸ ਵਿੱਚ ਉਹ ਮੁੱਲ ਜੋੜਿਆ ਗਿਆ ਹੈ ਜੋ n ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਹੀਂ ਵੰਡਦਾ।";
  if (id.endsWith("ADD-EXPONENTS")) return hi ? "इसमें स्वतंत्र घात-विकल्पों को गुणा करने के बजाय जोड़ा गया है।" : "ਇਸ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਘਾਤ ਚੋਣਾਂ ਨੂੰ ਗੁਣਾ ਕਰਨ ਦੀ ਥਾਂ ਜੋੜਿਆ ਗਿਆ ਹੈ।";
  if (id.endsWith("EXPONENT-OFFSET")) return hi ? "इसमें घात a के लिए a + 1 विकल्प होने की बात भूल गई है।" : "ਇਸ ਵਿੱਚ ਘਾਤ a ਲਈ a + 1 ਚੋਣਾਂ ਹੋਣ ਦੀ ਗੱਲ ਭੁੱਲੀ ਗਈ ਹੈ।";
  if (id.endsWith("FORMULA-SWAP")) return hi ? "इसमें माँगे गए परिणाम पर किसी दूसरी भाजक-राशि का सूत्र लगा दिया गया है।" : "ਇਸ ਵਿੱਚ ਮੰਗੇ ਨਤੀਜੇ ਉੱਤੇ ਕਿਸੇ ਹੋਰ ਭਾਜਕ-ਰਾਸ਼ੀ ਦਾ ਨਿਯਮ ਲਗਾਇਆ ਗਿਆ ਹੈ।";
  if (id.endsWith("COUNT-FOR-SUM")) return hi ? "इसमें भाजकों का योग निकालने के बजाय केवल उनकी संख्या ली गई है।" : "ਇਸ ਵਿੱਚ ਭਾਜਕਾਂ ਦਾ ਜੋੜ ਕੱਢਣ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਲਈ ਗਈ ਹੈ।";
  if (id.endsWith("POWER-CHOICE")) return hi ? "इसमें ऐसा घात चुना गया है जो माँगी गई पूर्ण घात का मान्य गुणज नहीं है।" : "ਇਸ ਵਿੱਚ ਉਹ ਘਾਤ ਚੁਣਿਆ ਗਿਆ ਹੈ ਜੋ ਮੰਗੀ ਪੂਰਨ ਘਾਤ ਦਾ ਠੀਕ ਗੁਣਜ ਨਹੀਂ ਹੈ।";
  if (id.endsWith("CONDITION-IGNORED")) return hi ? "इसमें दी गई विशेष शर्त लगाए बिना सभी भाजक गिन लिए गए हैं।" : "ਇਸ ਵਿੱਚ ਦਿੱਤੀ ਖਾਸ ਸ਼ਰਤ ਲਗਾਏ ਬਿਨਾਂ ਸਾਰੇ ਭਾਜਕ ਗਿਣ ਲਏ ਗਏ ਹਨ।";
  if (id.endsWith("CONDITION-LOSS")) return hi ? "इसमें दिखाई गई दो शर्तों में से एक को छोड़ दिया गया है।" : "ਇਸ ਵਿੱਚ ਦਿੱਤੀਆਂ ਦੋ ਸ਼ਰਤਾਂ ਵਿੱਚੋਂ ਇੱਕ ਛੱਡ ਦਿੱਤੀ ਗਈ ਹੈ।";
  if (id.endsWith("ENDPOINT")) return hi ? "इसमें 1, n या सीमा के अंतिम मान को गलत ढंग से शामिल या बाहर किया गया है।" : "ਇਸ ਵਿੱਚ 1, n ਜਾਂ ਹੱਦ ਦੇ ਆਖਰੀ ਮੁੱਲ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਸ਼ਾਮਲ ਜਾਂ ਬਾਹਰ ਕੀਤਾ ਗਿਆ ਹੈ।";
  if (id.endsWith("ORDER-BOUNDARY")) return hi ? "इसमें क्रम, सीमा या पूरक भाजक जोड़ी को गलत पढ़ा गया है।" : "ਇਸ ਵਿੱਚ ਕ੍ਰਮ, ਹੱਦ ਜਾਂ ਪੂਰਕ ਭਾਜਕ ਜੋੜੇ ਨੂੰ ਗਲਤ ਪੜ੍ਹਿਆ ਗਿਆ ਹੈ।";
  if (id.endsWith("BOUNDARY")) return hi ? "इसमें उचित-भाजक, जोड़ी या घात की सीमा पर एक मान गलत लिया गया है।" : "ਇਸ ਵਿੱਚ ਛੋਟੇ ਭਾਜਕ, ਜੋੜੇ ਜਾਂ ਘਾਤ ਦੀ ਹੱਦ ਉੱਤੇ ਇੱਕ ਮੁੱਲ ਗਲਤ ਲਿਆ ਗਿਆ ਹੈ।";
  if (id.endsWith("RELATED-VALUE")) return hi ? "यह पास का संबंधित मान है, पर प्रश्न में माँगा गया परिणाम नहीं है।" : "ਇਹ ਨੇੜਲਾ ਸੰਬੰਧਿਤ ਮੁੱਲ ਹੈ, ਪਰ ਸਵਾਲ ਵਿੱਚ ਮੰਗਿਆ ਨਤੀਜਾ ਨਹੀਂ ਹੈ।";
  if (id.endsWith("INVERSE-FIRST-HIT")) return hi ? "इसमें पहली मिली संख्या स्वीकार कर ली गई है, पर ठीक या न्यूनतम शर्त सिद्ध नहीं की गई।" : "ਇਸ ਵਿੱਚ ਪਹਿਲੀ ਮਿਲੀ ਸੰਖਿਆ ਮੰਨ ਲਈ ਗਈ ਹੈ, ਪਰ ਠੀਕ ਜਾਂ ਸਭ ਤੋਂ ਛੋਟੀ ਹੋਣ ਦੀ ਸ਼ਰਤ ਸਾਬਤ ਨਹੀਂ ਕੀਤੀ ਗਈ।";
  if (id.endsWith("UNVERIFIED-INVERSE")) return hi ? "इस उल्टे मान के भाजकों की ठीक संख्या दोबारा जाँची नहीं गई है।" : "ਇਸ ਉਲਟੇ ਮੁੱਲ ਦੇ ਭਾਜਕਾਂ ਦੀ ਠੀਕ ਗਿਣਤੀ ਮੁੜ ਜਾਂਚੀ ਨਹੀਂ ਗਈ।";
  if (id.endsWith("INVERSE-NOT-MINIMUM")) return hi ? "यह संबंधित भाजक संख्या दे सकता है, पर माँगा गया सबसे छोटा सही मान नहीं है।" : "ਇਹ ਸੰਬੰਧਿਤ ਭਾਜਕ ਗਿਣਤੀ ਦੇ ਸਕਦਾ ਹੈ, ਪਰ ਮੰਗਿਆ ਸਭ ਤੋਂ ਛੋਟਾ ਸਹੀ ਮੁੱਲ ਨਹੀਂ ਹੈ।";
  if (id.endsWith("CLAIM-POLARITY")) return hi ? "इसमें स्वतंत्र गणना से मिले सही/गलत निष्कर्ष को उलट दिया गया है।" : "ਇਸ ਵਿੱਚ ਵੱਖਰੀ ਗਿਣਤੀ ਨਾਲ ਮਿਲੇ ਸਹੀ/ਗਲਤ ਨਤੀਜੇ ਨੂੰ ਉਲਟ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  if (id.endsWith("CLAIM-UNRESOLVED")) return hi ? "अभाज्य गुणनखंड रूप से यह गुण ठीक-ठीक तय हो जाता है; इसे अनिश्चित नहीं छोड़ा जा सकता।" : "ਅਭਾਜ ਗੁਣਨਖੰਡ ਰੂਪ ਨਾਲ ਇਹ ਗੁਣ ਠੀਕ ਤੈਅ ਹੋ ਜਾਂਦਾ ਹੈ; ਇਸਨੂੰ ਅਣਨਿਰਧਾਰਤ ਨਹੀਂ ਛੱਡਿਆ ਜਾ ਸਕਦਾ।";
  if (id.endsWith("IRRELEVANT-PRIMALITY")) return hi ? "इस दावे का निर्णय अभाज्य होने से नहीं, दी गई भाजक-विशेषता से होता है।" : "ਇਸ ਦਾਅਵੇ ਦਾ ਫੈਸਲਾ ਅਭਾਜ ਹੋਣ ਨਾਲ ਨਹੀਂ, ਦਿੱਤੇ ਭਾਜਕ-ਗੁਣ ਨਾਲ ਹੁੰਦਾ ਹੈ।";
  if (id.includes("TABLE-MISMATCH")) return hi ? "यह पंक्ति कुल भाजक और पूर्ण-वर्ग भाजक—दोनों शर्तें एक साथ पूरी नहीं करती।" : "ਇਹ ਕਤਾਰ ਕੁੱਲ ਭਾਜਕ ਅਤੇ ਪੂਰਨ-ਵਰਗ ਭਾਜਕ—ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਇਕੱਠੀਆਂ ਪੂਰੀ ਨਹੀਂ ਕਰਦੀ।";

  const suffix = Number(id.match(/-(\d)$/)?.[1] ?? 0);
  if (suffix === 1) return hi ? "इसमें एक शर्त को वास्तविकता से अधिक निर्णायक मान लिया गया है।" : "ਇਸ ਵਿੱਚ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਅਸਲ ਤੋਂ ਵੱਧ ਨਿਰਣਾਇਕ ਮੰਨਿਆ ਗਿਆ ਹੈ।";
  if (suffix === 2) return hi ? "इसमें कोई मान्य उम्मीदवार छूट गया है या अमान्य उम्मीदवार जोड़ दिया गया है।" : "ਇਸ ਵਿੱਚ ਕੋਈ ਠੀਕ ਉਮੀਦਵਾਰ ਛੱਡਿਆ ਗਿਆ ਹੈ ਜਾਂ ਗਲਤ ਉਮੀਦਵਾਰ ਜੋੜਿਆ ਗਿਆ ਹੈ।";
  if (suffix === 3) return hi ? "इसमें अस्तित्व, एकमात्रता और पूरे समुच्चय के निष्कर्ष आपस में मिला दिए गए हैं।" : "ਇਸ ਵਿੱਚ ਮੌਜੂਦਗੀ, ਇਕੋ ਹੱਲ ਅਤੇ ਪੂਰੇ ਸਮੂਹ ਦੇ ਨਤੀਜੇ ਆਪਸ ਵਿੱਚ ਮਿਲਾ ਦਿੱਤੇ ਗਏ ਹਨ।";

  return hi ? "यह विकल्प दी गई सभी शर्तों की सही जाँच नहीं करता।" : "ਇਹ ਚੋਣ ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਦੀ ਠੀਕ ਜਾਂਚ ਨਹੀਂ ਕਰਦੀ।";
}

function hardenOptions(
  question: NumCp005LocalizedQuestion,
): readonly NumCp005LocalizedOption[] {
  const hi = question.locale === "hi-IN";
  return Object.freeze(question.options.map((option) => {
    const analysis = option.isCorrect
      ? (hi
          ? `“${option.value}” सभी दी गई शर्तों और सही भाजक गणना से मेल खाता है।`
          : `“${option.value}” ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਅਤੇ ਠੀਕ ਭਾਜਕ ਗਿਣਤੀ ਨਾਲ ਮਿਲਦਾ ਹੈ।`)
      : (hi
          ? `“${option.value}” सही नहीं है। ${misconceptionReason(option.misconceptionId, question.locale)}`
          : `“${option.value}” ਸਹੀ ਨਹੀਂ ਹੈ। ${misconceptionReason(option.misconceptionId, question.locale)}`);
    return Object.freeze({ ...option, analysis });
  }));
}

function hardenQls(
  english: NumCp005PermanentQuestion,
  localized: NumCp005LocalizedQuestion,
): NumCp005LocalizedQuestion {
  const hi = localized.locale === "hi-IN";
  let stem = naturalizeText(localized.stem, localized.locale);
  let coreConcept = naturalizeText(localized.explanation.coreConcept, localized.locale);
  let strategy = naturalizeText(localized.explanation.givenDataAndStrategy, localized.locale);
  let speed = naturalizeText(localized.explanation.examSpeedMethod, localized.locale);
  let steps = localized.explanation.stepByStep.map((step) => naturalizeText(step, localized.locale));

  if (localized.questionLanguageId === "NUM-QL-055") {
    const prime = english.hiddenState.prime;
    const target = english.hiddenState.targetDivisorCount;
    stem = hi
      ? `एक धनात्मक पूर्णांक, अभाज्य संख्या ${prime} की किसी घात के बराबर है और उसके ठीक ${target} धनात्मक भाजक हैं। वह पूर्णांक ज्ञात कीजिए।`
      : `ਇੱਕ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ, ਅਭਾਜ ਸੰਖਿਆ ${prime} ਦੀ ਕਿਸੇ ਘਾਤ ਦੇ ਬਰਾਬਰ ਹੈ ਅਤੇ ਉਸ ਦੇ ਠੀਕ ${target} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ। ਉਹ ਪੂਰਨ ਅੰਕ ਕੱਢੋ।`;
  }

  if (localized.questionLanguageId === "NUM-QL-057") {
    const parity = String(english.hiddenState.parity ?? "ANY");
    const bound = english.hiddenState.bound;
    if (parity === "ANY") {
      coreConcept = hi
        ? "सीमा के भीतर सबसे बड़ी संख्या को सीमा और ठीक भाजक संख्या—दोनों शर्तें पूरी करनी होती हैं।"
        : "ਹੱਦ ਅੰਦਰ ਸਭ ਤੋਂ ਵੱਡੀ ਸੰਖਿਆ ਨੂੰ ਹੱਦ ਅਤੇ ਠੀਕ ਭਾਜਕ ਗਿਣਤੀ—ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਨੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।";
      strategy = hi
        ? "ऊपरी सीमा से नीचे की ओर हर संख्या के भाजक गिनिए और पहली मान्य संख्या चुनिए।"
        : "ਉੱਪਰੀ ਹੱਦ ਤੋਂ ਹੇਠਾਂ ਵੱਲ ਹਰ ਸੰਖਿਆ ਦੇ ਭਾਜਕ ਗਿਣੋ ਅਤੇ ਪਹਿਲੀ ਠੀਕ ਸੰਖਿਆ ਚੁਣੋ।";
      speed = hi
        ? "ऊपरी सीमा से नीचे चलिए; भाजक संख्या मिलते ही रुक जाइए।"
        : "ਉੱਪਰੀ ਹੱਦ ਤੋਂ ਹੇਠਾਂ ਚੱਲੋ; ਭਾਜਕ ਗਿਣਤੀ ਮਿਲਦੇ ਹੀ ਰੁਕ ਜਾਓ।";
      steps = [
        hi ? `${bound} से नीचे की संख्याएँ एक-एक करके जाँची जाती हैं।` : `${bound} ਤੋਂ ਹੇਠਾਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਇਕ-ਇਕ ਕਰਕੇ ਜਾਂਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।`,
        steps[1]!,
        steps[2]!,
      ];
    } else {
      const parityWord = hi
        ? (parity === "ODD" ? "विषम" : "सम")
        : (parity === "ODD" ? "ਟਾਂਕ" : "ਜਿਸਤ");
      coreConcept = hi
        ? `सीमा के भीतर सबसे बड़ी संख्या को ठीक भाजक संख्या और ${parityWord} होने की शर्त—दोनों पूरी करनी होती हैं।`
        : `ਹੱਦ ਅੰਦਰ ਸਭ ਤੋਂ ਵੱਡੀ ਸੰਖਿਆ ਨੂੰ ਠੀਕ ਭਾਜਕ ਗਿਣਤੀ ਅਤੇ ${parityWord} ਹੋਣ ਦੀ ਸ਼ਰਤ—ਦੋਵੇਂ ਪੂਰੀਆਂ ਕਰਨੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।`;
      speed = hi
        ? `पहले केवल ${parityWord} संख्याएँ रखिए, फिर उनके भाजक गिनिए।`
        : `ਪਹਿਲਾਂ ਸਿਰਫ਼ ${parityWord} ਸੰਖਿਆਵਾਂ ਰੱਖੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਦੇ ਭਾਜਕ ਗਿਣੋ।`;
    }
  }

  if (localized.questionLanguageId === "NUM-QL-064") {
    speed = hi
      ? "n के मान एक-एक करके जाँचने के बजाय T की गुणक जोड़ियाँ जाँचिए।"
      : "n ਦੇ ਮੁੱਲ ਇਕ-ਇਕ ਕਰਕੇ ਜਾਂਚਣ ਦੀ ਥਾਂ T ਦੇ ਗੁਣਕ ਜੋੜੇ ਜਾਂਚੋ।";
  }

  if (localized.questionLanguageId === "NUM-QL-068") {
    const first = String(english.hiddenState.factorState ? localized.stem.match(/A = (.+?) (?:और|ਅਤੇ) /)?.[1] ?? "A" : "A");
    const second = String(localized.stem.match(/B = (.+?) (?:हैं|ਹਨ)/)?.[1] ?? "B");
    const metric = localized.stem.match(/किसकी (.+?) अधिक है|ਕਿਸਦੀ (.+?) ਵੱਧ ਹੈ/)?.slice(1).find(Boolean);
    if (metric) {
      stem = hi
        ? `संख्या A = ${first} और संख्या B = ${second} हैं। किसकी ${metric} अधिक है?`
        : `ਸੰਖਿਆ A = ${first} ਅਤੇ ਸੰਖਿਆ B = ${second} ਹਨ। ਕਿਸਦੀ ${metric} ਵੱਧ ਹੈ?`;
    }
  }

  if (localized.questionLanguageId === "NUM-QL-069") {
    const combined = Array.isArray(english.hiddenState.combinedCandidates)
      ? `{${english.hiddenState.combinedCandidates.join(", ")}}`
      : "∅";
    steps = [
      steps[0]!,
      steps[1]!,
      hi
        ? `दोनों कथनों के साझा मान ${combined} हैं; इसलिए निष्कर्ष है: ${localized.canonicalAnswer}।`
        : `ਦੋਵੇਂ ਕਥਨਾਂ ਦੇ ਸਾਂਝੇ ਮੁੱਲ ${combined} ਹਨ; ਇਸ ਲਈ ਨਤੀਜਾ ਹੈ: ${localized.canonicalAnswer}।`,
    ];
  }

  const options = hardenOptions(localized);
  const commonTraps = Object.freeze(options.filter((option) => !option.isCorrect).map((option) => option.analysis));

  return Object.freeze({
    ...localized,
    stem,
    options,
    explanation: Object.freeze({
      ...localized.explanation,
      coreConcept,
      givenDataAndStrategy: strategy,
      stepByStep: Object.freeze(steps),
      examSpeedMethod: speed,
      commonTraps,
    }),
  });
}

export function hardenNumCp005LocalizedQuestion(
  english: NumCp005PermanentQuestion,
  localized: NumCp005LocalizedQuestion,
): NumCp005LocalizedQuestion {
  return hardenQls(english, localized);
}
