import type { CodTranslatedLocale } from "./translational-language-pack";

export interface Cp008LocalizedFact {
  question: string;
  rationale: string;
}

export interface Cp008LanguagePack {
  locale: CodTranslatedLocale;
  scriptPattern: RegExp;
  label(value: string): string;
  fact(factId: string): Cp008LocalizedFact;
  mappingStatement(actual: string, called: string): string;
  directStem(statements: string, target: string, style: number): string;
  semanticStem(statements: string, question: string, style: number): string;
  referenceAid: readonly string[];
  quickMethod: string;
  ruleStatement: string;
  directReferent(target: string, style: number): string;
  application(actual: string, called: string, style: number): string;
  conclusion(answer: string, style: number): string;
  trap(option: string): string;
}

const HI_LABELS: Readonly<Record<string, string>> = {
  second: "सेकंड", minute: "मिनट", hour: "घंटा", day: "दिन", week: "सप्ताह", month: "महीना", year: "वर्ष",
  teacher: "अध्यापक", doctor: "डॉक्टर", manager: "प्रबंधक", engineer: "इंजीनियर", lawyer: "वकील", accountant: "लेखाकार", clerk: "लिपिक", businessman: "व्यवसायी",
  red: "लाल", white: "सफेद", blue: "नीला", green: "हरा", orange: "नारंगी", pink: "गुलाबी", black: "काला", yellow: "पीला",
  pen: "कलम", paper: "कागज", book: "किताब", table: "मेज", chair: "कुर्सी", bottle: "बोतल", bag: "बैग", lamp: "लैंप", shelf: "शेल्फ", cupboard: "अलमारी",
  eye: "आंख", ear: "कान", nose: "नाक", hand: "हाथ", mouth: "मुंह", tongue: "जीभ", foot: "पैर",
  apple: "सेब", mango: "आम", banana: "केला", papaya: "पपीता", grape: "अंगूर", coconut: "नारियल",
  needle: "सुई", button: "बटन", cloth: "कपड़ा", scissors: "कैंची", hook: "कांटा", thimble: "अंगुश्ताना",
  soap: "साबुन", butter: "मक्खन", ink: "स्याही", honey: "शहद", oil: "तेल",
  oven: "ओवन", sofa: "सोफा", bed: "बिस्तर", television: "टेलीविजन", fan: "पंखा",
  mobile: "मोबाइल", tablet: "टैबलेट", laptop: "लैपटॉप", computer: "कंप्यूटर", "pen drive": "पेन ड्राइव", keyboard: "कीबोर्ड",
  jupiter: "बृहस्पति", saturn: "शनि", moon: "चंद्रमा", venus: "शुक्र", mercury: "बुध", sun: "सूर्य",
  pepper: "काली मिर्च", salt: "नमक", chilli: "मिर्च", sugar: "चीनी", turmeric: "हल्दी",
};

const PA_LABELS: Readonly<Record<string, string>> = {
  second: "ਸਕਿੰਟ", minute: "ਮਿੰਟ", hour: "ਘੰਟਾ", day: "ਦਿਨ", week: "ਹਫ਼ਤਾ", month: "ਮਹੀਨਾ", year: "ਸਾਲ",
  teacher: "ਅਧਿਆਪਕ", doctor: "ਡਾਕਟਰ", manager: "ਮੈਨੇਜਰ", engineer: "ਇੰਜੀਨੀਅਰ", lawyer: "ਵਕੀਲ", accountant: "ਲੇਖਾਕਾਰ", clerk: "ਕਲਰਕ", businessman: "ਵਪਾਰੀ",
  red: "ਲਾਲ", white: "ਚਿੱਟਾ", blue: "ਨੀਲਾ", green: "ਹਰਾ", orange: "ਸੰਤਰੀ", pink: "ਗੁਲਾਬੀ", black: "ਕਾਲਾ", yellow: "ਪੀਲਾ",
  pen: "ਕਲਮ", paper: "ਕਾਗਜ਼", book: "ਕਿਤਾਬ", table: "ਮੇਜ਼", chair: "ਕੁਰਸੀ", bottle: "ਬੋਤਲ", bag: "ਥੈਲਾ", lamp: "ਲੈਂਪ", shelf: "ਸ਼ੈਲਫ਼", cupboard: "ਅਲਮਾਰੀ",
  eye: "ਅੱਖ", ear: "ਕੰਨ", nose: "ਨੱਕ", hand: "ਹੱਥ", mouth: "ਮੂੰਹ", tongue: "ਜੀਭ", foot: "ਪੈਰ",
  apple: "ਸੇਬ", mango: "ਅੰਬ", banana: "ਕੇਲਾ", papaya: "ਪਪੀਤਾ", grape: "ਅੰਗੂਰ", coconut: "ਨਾਰੀਅਲ",
  needle: "ਸੂਈ", button: "ਬਟਨ", cloth: "ਕੱਪੜਾ", scissors: "ਕੈਂਚੀ", hook: "ਕੁੰਡੀ", thimble: "ਉਂਗਲੀ-ਢੱਕਣ",
  soap: "ਸਾਬਣ", butter: "ਮੱਖਣ", ink: "ਸਿਆਹੀ", honey: "ਸ਼ਹਿਦ", oil: "ਤੇਲ",
  oven: "ਓਵਨ", sofa: "ਸੋਫ਼ਾ", bed: "ਬਿਸਤਰਾ", television: "ਟੈਲੀਵਿਜ਼ਨ", fan: "ਪੱਖਾ",
  mobile: "ਮੋਬਾਈਲ", tablet: "ਟੈਬਲੈਟ", laptop: "ਲੈਪਟਾਪ", computer: "ਕੰਪਿਊਟਰ", "pen drive": "ਪੈਨ ਡਰਾਈਵ", keyboard: "ਕੀਬੋਰਡ",
  jupiter: "ਬ੍ਰਹਸਪਤੀ", saturn: "ਸ਼ਨੀ", moon: "ਚੰਦ", venus: "ਸ਼ੁੱਕਰ", mercury: "ਬੁੱਧ", sun: "ਸੂਰਜ",
  pepper: "ਕਾਲੀ ਮਿਰਚ", salt: "ਨਮਕ", chilli: "ਮਿਰਚ", sugar: "ਚੀਨੀ", turmeric: "ਹਲਦੀ",
};

const HI_FACTS: Readonly<Record<string, Cp008LocalizedFact>> = {
  PATIENTS_TREATED_BY_DOCTOR: { question: "रोगियों का उपचार कौन करता है?", rationale: "सामान्य रूप से रोगियों का उपचार डॉक्टर करता है।" },
  INK_WRITING_TOOL: { question: "स्याही से लिखने के लिए सामान्यतः किस वस्तु का उपयोग होता है?", rationale: "स्याही से लिखने के लिए कलम का उपयोग होता है।" },
  ONE_PERSON_SEAT: { question: "एक व्यक्ति के बैठने के लिए बनी वस्तु कौन-सी है?", rationale: "एक व्यक्ति के बैठने के लिए कुर्सी बनी होती है।" },
  SEWING_NEEDLE: { question: "कपड़े में धागा ले जाने वाला नुकीला औजार कौन-सा है?", rationale: "सिलाई करते समय सुई कपड़े में धागा ले जाती है।" },
  HEARING_WITH_EAR: { question: "सुनने के लिए शरीर के किस अंग का उपयोग होता है?", rationale: "सुनने के लिए कान का उपयोग होता है।" },
  GRIP_PEN_WITH_HAND: { question: "लिखते समय कलम पकड़ने के लिए सामान्यतः किस अंग का उपयोग होता है?", rationale: "कलम पकड़ने के लिए हाथ का उपयोग होता है।" },
  SOAP_CLEANS_CLOTHES: { question: "पानी के साथ कपड़े साफ करने के लिए किस वस्तु का उपयोग होता है?", rationale: "कपड़े साफ करने के लिए पानी के साथ साबुन का उपयोग होता है।" },
  OVEN_BAKES_FOOD: { question: "भोजन सेंकने के लिए किस उपकरण का उपयोग होता है?", rationale: "भोजन सेंकने के लिए ओवन का उपयोग होता है।" },
  PORTABLE_EXTERNAL_STORAGE: { question: "बाहरी पोर्टेबल भंडारण के लिए सामान्यतः कौन-सा उपकरण प्रयोग होता है?", rationale: "पेन ड्राइव पोर्टेबल बाहरी भंडारण का सामान्य उपकरण है।" },
  EARTH_NATURAL_SATELLITE: { question: "पृथ्वी का प्राकृतिक उपग्रह कौन है?", rationale: "चंद्रमा पृथ्वी का प्राकृतिक उपग्रह है।" },
  MILK_COLOUR_WHITE: { question: "दूध का सामान्य रंग क्या है?", rationale: "दूध सामान्यतः सफेद होता है।" },
  HUMAN_BLOOD_RED: { question: "मनुष्य के रक्त का रंग क्या है?", rationale: "मनुष्य का रक्त लाल होता है।" },
  FRESH_GRASS_GREEN: { question: "ताजी घास का सामान्य रंग क्या है?", rationale: "ताजी घास सामान्यतः हरी होती है।" },
  SUGAR_IS_SWEET: { question: "कौन-सी वस्तु मीठी होती है?", rationale: "चीनी मीठी होती है।" },
  COCONUT_HARD_SHELL: { question: "किस फल का खोल कठोर होता है?", rationale: "नारियल का खोल कठोर होता है।" },
};

const PA_FACTS: Readonly<Record<string, Cp008LocalizedFact>> = {
  PATIENTS_TREATED_BY_DOCTOR: { question: "ਮਰੀਜ਼ਾਂ ਦਾ ਇਲਾਜ ਕੌਣ ਕਰਦਾ ਹੈ?", rationale: "ਆਮ ਤੌਰ ਉੱਤੇ ਮਰੀਜ਼ਾਂ ਦਾ ਇਲਾਜ ਡਾਕਟਰ ਕਰਦਾ ਹੈ।" },
  INK_WRITING_TOOL: { question: "ਸਿਆਹੀ ਨਾਲ ਲਿਖਣ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜੀ ਚੀਜ਼ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?", rationale: "ਸਿਆਹੀ ਨਾਲ ਲਿਖਣ ਲਈ ਕਲਮ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।" },
  ONE_PERSON_SEAT: { question: "ਇੱਕ ਵਿਅਕਤੀ ਦੇ ਬੈਠਣ ਲਈ ਬਣੀ ਚੀਜ਼ ਕਿਹੜੀ ਹੈ?", rationale: "ਇੱਕ ਵਿਅਕਤੀ ਦੇ ਬੈਠਣ ਲਈ ਕੁਰਸੀ ਬਣੀ ਹੁੰਦੀ ਹੈ।" },
  SEWING_NEEDLE: { question: "ਕੱਪੜੇ ਵਿਚੋਂ ਧਾਗਾ ਲੰਘਾਉਣ ਵਾਲਾ ਨੁਕੀਲਾ ਸੰਦ ਕਿਹੜਾ ਹੈ?", rationale: "ਸਿਲਾਈ ਵੇਲੇ ਸੂਈ ਕੱਪੜੇ ਵਿਚੋਂ ਧਾਗਾ ਲੰਘਾਉਂਦੀ ਹੈ।" },
  HEARING_WITH_EAR: { question: "ਸੁਣਨ ਲਈ ਸਰੀਰ ਦਾ ਕਿਹੜਾ ਅੰਗ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", rationale: "ਸੁਣਨ ਲਈ ਕੰਨ ਵਰਤੇ ਜਾਂਦੇ ਹਨ।" },
  GRIP_PEN_WITH_HAND: { question: "ਲਿਖਦੇ ਸਮੇਂ ਕਲਮ ਫੜਨ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਅੰਗ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", rationale: "ਕਲਮ ਫੜਨ ਲਈ ਹੱਥ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
  SOAP_CLEANS_CLOTHES: { question: "ਪਾਣੀ ਨਾਲ ਕੱਪੜੇ ਸਾਫ਼ ਕਰਨ ਲਈ ਕਿਹੜੀ ਚੀਜ਼ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?", rationale: "ਕੱਪੜੇ ਸਾਫ਼ ਕਰਨ ਲਈ ਪਾਣੀ ਨਾਲ ਸਾਬਣ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
  OVEN_BAKES_FOOD: { question: "ਭੋਜਨ ਸੇਕਣ ਲਈ ਕਿਹੜਾ ਉਪਕਰਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", rationale: "ਭੋਜਨ ਸੇਕਣ ਲਈ ਓਵਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
  PORTABLE_EXTERNAL_STORAGE: { question: "ਬਾਹਰੀ ਪੋਰਟੇਬਲ ਸਟੋਰੇਜ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਉਪਕਰਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", rationale: "ਪੈਨ ਡਰਾਈਵ ਪੋਰਟੇਬਲ ਬਾਹਰੀ ਸਟੋਰੇਜ ਦਾ ਆਮ ਉਪਕਰਨ ਹੈ।" },
  EARTH_NATURAL_SATELLITE: { question: "ਧਰਤੀ ਦਾ ਕੁਦਰਤੀ ਉਪਗ੍ਰਹਿ ਕਿਹੜਾ ਹੈ?", rationale: "ਚੰਦ ਧਰਤੀ ਦਾ ਕੁਦਰਤੀ ਉਪਗ੍ਰਹਿ ਹੈ।" },
  MILK_COLOUR_WHITE: { question: "ਦੁੱਧ ਦਾ ਆਮ ਰੰਗ ਕੀ ਹੈ?", rationale: "ਦੁੱਧ ਆਮ ਤੌਰ ਉੱਤੇ ਚਿੱਟਾ ਹੁੰਦਾ ਹੈ।" },
  HUMAN_BLOOD_RED: { question: "ਮਨੁੱਖੀ ਖੂਨ ਦਾ ਰੰਗ ਕੀ ਹੈ?", rationale: "ਮਨੁੱਖੀ ਖੂਨ ਲਾਲ ਹੁੰਦਾ ਹੈ।" },
  FRESH_GRASS_GREEN: { question: "ਤਾਜ਼ੀ ਘਾਹ ਦਾ ਆਮ ਰੰਗ ਕੀ ਹੈ?", rationale: "ਤਾਜ਼ੀ ਘਾਹ ਆਮ ਤੌਰ ਉੱਤੇ ਹਰੀ ਹੁੰਦੀ ਹੈ।" },
  SUGAR_IS_SWEET: { question: "ਕਿਹੜੀ ਚੀਜ਼ ਮਿੱਠੀ ਹੁੰਦੀ ਹੈ?", rationale: "ਚੀਨੀ ਮਿੱਠੀ ਹੁੰਦੀ ਹੈ।" },
  COCONUT_HARD_SHELL: { question: "ਕਿਹੜੇ ਫਲ ਦਾ ਛਿਲਕਾ ਸਖ਼ਤ ਹੁੰਦਾ ਹੈ?", rationale: "ਨਾਰੀਅਲ ਦਾ ਛਿਲਕਾ ਸਖ਼ਤ ਹੁੰਦਾ ਹੈ।" },
};

function makePack(
  locale: CodTranslatedLocale,
  labels: Readonly<Record<string, string>>,
  facts: Readonly<Record<string, Cp008LocalizedFact>>,
): Cp008LanguagePack {
  const hi = locale === "hi-IN";
  return {
    locale,
    scriptPattern: hi ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u,
    label(value) {
      const localized = labels[value];
      if (!localized) throw new Error(`Missing CP-008 ${locale} label for '${value}'`);
      return localized;
    },
    fact(factId) {
      const localized = facts[factId];
      if (!localized) throw new Error(`Missing CP-008 ${locale} fact '${factId}'`);
      return localized;
    },
    mappingStatement: hi
      ? (actual, called) => `‘${actual}’ को ‘${called}’ कहा जाता है`
      : (actual, called) => `‘${actual}’ ਨੂੰ ‘${called}’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ`,
    directStem: hi
      ? (statements, target, style) => [
        `एक विशेष नाम-कोड में ${statements}। इस भाषा में ‘${target}’ को क्या कहा जाएगा?`,
        `नाम बदलने के ये नियम दिए हैं: ${statements}। ‘${target}’ के लिए कौन-सा नाम उपयोग होगा?`,
        `${statements}। इन्हीं बदले हुए नामों के अनुसार ‘${target}’ का सही नाम चुनिए।`,
      ][style % 3]!
      : (statements, target, style) => [
        `ਇੱਕ ਖਾਸ ਨਾਮ-ਕੋਡ ਵਿੱਚ ${statements}। ਇਸ ਭਾਸ਼ਾ ਵਿੱਚ ‘${target}’ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਵੇਗਾ?`,
        `ਨਾਮ ਬਦਲਣ ਦੇ ਇਹ ਨਿਯਮ ਦਿੱਤੇ ਹਨ: ${statements}। ‘${target}’ ਲਈ ਕਿਹੜਾ ਨਾਮ ਵਰਤਿਆ ਜਾਵੇਗਾ?`,
        `${statements}। ਇਨ੍ਹਾਂ ਬਦਲੇ ਹੋਏ ਨਾਮਾਂ ਮੁਤਾਬਕ ‘${target}’ ਦਾ ਸਹੀ ਨਾਮ ਚੁਣੋ।`,
      ][style % 3]!,
    semanticStem: hi
      ? (statements, question, style) => [
        `एक विशेष नाम-कोड में ${statements}। इस भाषा में ${question}`,
        `दिए गए नाम बदलने के नियम हैं: ${statements}। पहले सामान्य उत्तर पहचानिए, फिर बताइए—${question}`,
        `${statements}। बदले हुए नामों के अनुसार उत्तर दीजिए: ${question}`,
      ][style % 3]!
      : (statements, question, style) => [
        `ਇੱਕ ਖਾਸ ਨਾਮ-ਕੋਡ ਵਿੱਚ ${statements}। ਇਸ ਭਾਸ਼ਾ ਵਿੱਚ ${question}`,
        `ਦਿੱਤੇ ਨਾਮ-ਬਦਲ ਨਿਯਮ ਹਨ: ${statements}। ਪਹਿਲਾਂ ਆਮ ਜਵਾਬ ਪਛਾਣੋ, ਫਿਰ ਦੱਸੋ—${question}`,
        `${statements}। ਬਦਲੇ ਹੋਏ ਨਾਮਾਂ ਮੁਤਾਬਕ ਜਵਾਬ ਦਿਓ: ${question}`,
      ][style % 3]!,
    referenceAid: hi
      ? ["वास्तविक वस्तु और उसके बदले हुए नाम को अलग रखें।", "वास्तविक उत्तर से केवल एक नाम-बदल तीर आगे बढ़ें; पूरी श्रृंखला का पीछा न करें।"]
      : ["ਅਸਲ ਚੀਜ਼ ਅਤੇ ਉਸ ਦੇ ਬਦਲੇ ਹੋਏ ਨਾਮ ਨੂੰ ਵੱਖ ਰੱਖੋ।", "ਅਸਲ ਜਵਾਬ ਤੋਂ ਸਿਰਫ਼ ਇੱਕ ਨਾਮ-ਬਦਲ ਤੀਰ ਅੱਗੇ ਜਾਓ; ਪੂਰੀ ਲੜੀ ਦੇ ਪਿੱਛੇ ਨਾ ਲੱਗੋ।"],
    quickMethod: hi
      ? "पहले सामान्य जीवन वाला वास्तविक उत्तर निकालें। फिर उसी शब्द के सामने दिया गया नया नाम पढ़ें।"
      : "ਪਹਿਲਾਂ ਆਮ ਜੀਵਨ ਵਾਲਾ ਅਸਲ ਜਵਾਬ ਕੱਢੋ। ਫਿਰ ਉਸੇ ਸ਼ਬਦ ਦੇ ਸਾਹਮਣੇ ਦਿੱਤਾ ਨਵਾਂ ਨਾਮ ਪੜ੍ਹੋ।",
    ruleStatement: hi
      ? "हर कथन केवल किसी वस्तु का उपयोग किया जाने वाला नाम बदलता है। सही उत्तर वास्तविक संदर्भ को सीधे दिया गया नया नाम है।"
      : "ਹਰ ਕਥਨ ਸਿਰਫ਼ ਕਿਸੇ ਚੀਜ਼ ਲਈ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਨਾਮ ਬਦਲਦਾ ਹੈ। ਸਹੀ ਜਵਾਬ ਅਸਲ ਚੀਜ਼ ਨੂੰ ਸਿੱਧਾ ਦਿੱਤਾ ਨਵਾਂ ਨਾਮ ਹੈ।",
    directReferent: hi
      ? (target, style) => [`प्रश्न सीधे ‘${target}’ के बारे में है, इसलिए वास्तविक संदर्भ यही है।`, `यहां सामान्य उत्तर पहले से ‘${target}’ है; अब केवल इसका बदला हुआ नाम देखना है।`, `लक्षित वास्तविक वस्तु ‘${target}’ है।`][style % 3]!
      : (target, style) => [`ਸਵਾਲ ਸਿੱਧਾ ‘${target}’ ਬਾਰੇ ਹੈ, ਇਸ ਲਈ ਅਸਲ ਚੀਜ਼ ਇਹੀ ਹੈ।`, `ਇੱਥੇ ਆਮ ਜਵਾਬ ਪਹਿਲਾਂ ਹੀ ‘${target}’ ਹੈ; ਹੁਣ ਸਿਰਫ਼ ਇਸ ਦਾ ਬਦਲਿਆ ਨਾਮ ਵੇਖਣਾ ਹੈ।`, `ਨਿਸ਼ਾਨੇ ਵਾਲੀ ਅਸਲ ਚੀਜ਼ ‘${target}’ ਹੈ।`][style % 3]!,
    application: hi
      ? (actual, called, style) => [`संबंधित नाम-बदल है: ${actual} → ${called}। इसलिए वास्तविक उत्तर ${actual} को ${called} कहा जाएगा।`, `${actual} के तुरंत सामने नया नाम ${called} दिया है; केवल यही एक कदम लेना है।`, `मानचित्र में ${actual} से सीधा तीर ${called} की ओर है।`][style % 3]!
      : (actual, called, style) => [`ਸੰਬੰਧਤ ਨਾਮ-ਬਦਲ ਹੈ: ${actual} → ${called}। ਇਸ ਲਈ ਅਸਲ ਜਵਾਬ ${actual} ਨੂੰ ${called} ਕਿਹਾ ਜਾਵੇਗਾ।`, `${actual} ਦੇ ਤੁਰੰਤ ਸਾਹਮਣੇ ਨਵਾਂ ਨਾਮ ${called} ਦਿੱਤਾ ਹੈ; ਸਿਰਫ਼ ਇਹੀ ਇੱਕ ਕਦਮ ਲੈਣਾ ਹੈ।`, `ਮੈਪਿੰਗ ਵਿੱਚ ${actual} ਤੋਂ ਸਿੱਧਾ ਤੀਰ ${called} ਵੱਲ ਹੈ।`][style % 3]!,
    conclusion: hi
      ? (answer, style) => [`अतः सही उत्तर ‘${answer}’ है।`, `इसलिए इस भाषा में उत्तर ‘${answer}’ होगा।`, `अंतिम बदला हुआ नाम ‘${answer}’ है।`][style % 3]!
      : (answer, style) => [`ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ‘${answer}’ ਹੈ।`, `ਇਸ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ‘${answer}’ ਹੋਵੇਗਾ।`, `ਆਖਰੀ ਬਦਲਿਆ ਹੋਇਆ ਨਾਮ ‘${answer}’ ਹੈ।`][style % 3]!,
    trap: hi
      ? (option) => `विकल्प ‘${option}’ वास्तविक संदर्भ से एक सीधा नाम-बदल कदम सही प्रकार नहीं लेता।`
      : (option) => `ਚੋਣ ‘${option}’ ਅਸਲ ਚੀਜ਼ ਤੋਂ ਇੱਕ ਸਿੱਧਾ ਨਾਮ-ਬਦਲ ਕਦਮ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਲੈਂਦੀ।`,
  };
}

const HINDI = makePack("hi-IN", HI_LABELS, HI_FACTS);
const PUNJABI = makePack("pa-IN", PA_LABELS, PA_FACTS);

export function getCp008LanguagePack(locale: CodTranslatedLocale): Cp008LanguagePack {
  return locale === "hi-IN" ? HINDI : PUNJABI;
}
