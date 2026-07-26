export type NativeEditorialLanguage = "hi" | "pa";

export type NativeStemContext = Readonly<{
  family: string;
  lead: string;
  item: string;
  actor: string;
}>;

const HINDI_CP_SECTORS: Readonly<Record<number, readonly string[]>> = {
  1: ["खुदरा बिक्री", "उपभोक्ता वस्तु बिक्री", "स्थानीय दुकान", "पुनर्विक्रय"],
  2: ["रिटेल ऑफर", "छूट अभियान", "ऑनलाइन खरीद", "स्टोर मूल्य-निर्धारण", "प्रमोशनल बिक्री"],
  3: ["गोदाम स्टॉक", "इन्वेंटरी प्रबंधन", "थोक माल", "स्टॉक निपटान", "क्षतिग्रस्त माल वसूली"],
  4: ["आपूर्ति श्रृंखला", "वितरक लेन-देन", "बहु-स्तरीय पुनर्विक्रय", "व्यापारी श्रृंखला", "कमीशन बिक्री"],
  5: ["मंडी माप-तौल", "खुदरा माप बिक्री", "कम तौल व्यापार", "मात्रा-आधारित बिक्री", "उपभोक्ता मूल्य प्रभाव"],
  6: ["व्यवसाय लागत योजना", "उत्पादन लागत", "लाभ-लक्ष्य योजना", "ब्रेक-ईवन विश्लेषण", "लागत वसूली", "निर्माण प्रबंधन"],
};

const PUNJABI_CP_SECTORS: Readonly<Record<number, readonly string[]>> = {
  1: ["ਰਿਟੇਲ ਵਿਕਰੀ", "ਖਪਤਕਾਰ ਵਸਤੂ ਵਿਕਰੀ", "ਸਥਾਨਕ ਦੁਕਾਨ", "ਮੁੜ-ਵਿਕਰੀ"],
  2: ["ਰਿਟੇਲ ਆਫਰ", "ਛੂਟ ਮੁਹਿੰਮ", "ਆਨਲਾਈਨ ਖਰੀਦ", "ਸਟੋਰ ਕੀਮਤ-ਨਿਰਧਾਰਨ", "ਪ੍ਰਚਾਰਕ ਵਿਕਰੀ"],
  3: ["ਗੋਦਾਮ ਸਟਾਕ", "ਇਨਵੈਂਟਰੀ ਪ੍ਰਬੰਧਨ", "ਥੋਕ ਮਾਲ", "ਸਟਾਕ ਨਿਪਟਾਰਾ", "ਨੁਕਸਾਨੀ ਮਾਲ ਵਸੂਲੀ"],
  4: ["ਸਪਲਾਈ ਲੜੀ", "ਵੰਡਕਾਰ ਲੈਣ-ਦੇਣ", "ਬਹੁ-ਪੜਾਅ ਮੁੜ-ਵਿਕਰੀ", "ਵਪਾਰੀ ਲੜੀ", "ਕਮਿਸ਼ਨ ਵਿਕਰੀ"],
  5: ["ਮੰਡੀ ਮਾਪ-ਤੋਲ", "ਰਿਟੇਲ ਮਾਪ ਵਿਕਰੀ", "ਘੱਟ ਤੋਲ ਵਪਾਰ", "ਮਾਤਰਾ-ਆਧਾਰਿਤ ਵਿਕਰੀ", "ਖਪਤਕਾਰ ਕੀਮਤ ਪ੍ਰਭਾਵ"],
  6: ["ਕਾਰੋਬਾਰੀ ਲਾਗਤ ਯੋਜਨਾ", "ਉਤਪਾਦਨ ਲਾਗਤ", "ਲਾਭ-ਟੀਚਾ ਯੋਜਨਾ", "ਬ੍ਰੇਕ-ਈਵਨ ਵਿਸ਼ਲੇਸ਼ਣ", "ਲਾਗਤ ਵਸੂਲੀ", "ਨਿਰਮਾਣ ਪ੍ਰਬੰਧਨ"],
};

const HINDI_CP_ITEMS: Readonly<Record<number, readonly string[]>> = {
  1: ["घरेलू उपकरण", "फर्नीचर", "साइकिल", "इलेक्ट्रॉनिक उपकरण", "कार्यालय सामग्री", "कपड़ों की खेप"],
  2: ["रिटेल उत्पाद", "ऑनलाइन ऑर्डर", "परिधान", "इलेक्ट्रॉनिक सामान", "घरेलू उपकरण", "पैक किया हुआ उत्पाद"],
  3: ["स्टॉक की इकाइयाँ", "माल की पेटियाँ", "गोदाम का लॉट", "पैक किए उत्पाद", "इन्वेंटरी समूह", "थोक खेप"],
  4: ["व्यावसायिक खेप", "वितरण लॉट", "माल की खेप", "उपकरणों का लॉट", "थोक पैकेज", "आपूर्ति बैच"],
  5: ["अनाज", "खाद्य तेल", "कपड़ा", "फलों की पेटियाँ", "पैक किए सामान", "थोक किराना"],
  6: ["उत्पादन बैच", "मशीन", "व्यावसायिक उपकरण", "निर्मित इकाइयाँ", "कारखाना लॉट", "मरम्मत किया उपकरण"],
};

const PUNJABI_CP_ITEMS: Readonly<Record<number, readonly string[]>> = {
  1: ["ਘਰੇਲੂ ਉਪਕਰਣ", "ਫਰਨੀਚਰ", "ਸਾਈਕਲ", "ਇਲੈਕਟ੍ਰਾਨਿਕ ਉਪਕਰਣ", "ਦਫ਼ਤਰੀ ਸਮੱਗਰੀ", "ਕੱਪੜਿਆਂ ਦੀ ਖੇਪ"],
  2: ["ਰਿਟੇਲ ਉਤਪਾਦ", "ਆਨਲਾਈਨ ਆਰਡਰ", "ਪਹਿਰਾਵਾ", "ਇਲੈਕਟ੍ਰਾਨਿਕ ਸਮਾਨ", "ਘਰੇਲੂ ਉਪਕਰਣ", "ਪੈਕ ਕੀਤਾ ਉਤਪਾਦ"],
  3: ["ਸਟਾਕ ਦੀਆਂ ਇਕਾਈਆਂ", "ਮਾਲ ਦੀਆਂ ਪੇਟੀਆਂ", "ਗੋਦਾਮ ਲਾਟ", "ਪੈਕ ਕੀਤੇ ਉਤਪਾਦ", "ਇਨਵੈਂਟਰੀ ਸਮੂਹ", "ਥੋਕ ਖੇਪ"],
  4: ["ਵਪਾਰਕ ਖੇਪ", "ਵੰਡ ਲਾਟ", "ਮਾਲ ਦੀ ਖੇਪ", "ਉਪਕਰਣਾਂ ਦਾ ਲਾਟ", "ਥੋਕ ਪੈਕੇਜ", "ਸਪਲਾਈ ਬੈਚ"],
  5: ["ਅਨਾਜ", "ਖਾਣ ਵਾਲਾ ਤੇਲ", "ਕੱਪੜਾ", "ਫਲਾਂ ਦੀਆਂ ਪੇਟੀਆਂ", "ਪੈਕ ਕੀਤਾ ਸਮਾਨ", "ਥੋਕ ਕਿਰਾਣਾ"],
  6: ["ਉਤਪਾਦਨ ਬੈਚ", "ਮਸ਼ੀਨ", "ਵਪਾਰਕ ਉਪਕਰਣ", "ਤਿਆਰ ਇਕਾਈਆਂ", "ਫੈਕਟਰੀ ਲਾਟ", "ਮੁਰੰਮਤ ਕੀਤਾ ਉਪਕਰਣ"],
};

const HINDI_CP_ACTORS: Readonly<Record<number, readonly string[]>> = {
  1: ["विक्रेता", "दुकानदार", "खुदरा विक्रेता", "पुनर्विक्रेता"],
  2: ["स्टोर प्रबंधक", "ऑनलाइन विक्रेता", "खुदरा विक्रेता", "प्रमोशन प्रबंधक"],
  3: ["गोदाम प्रबंधक", "थोक व्यापारी", "इन्वेंटरी प्रबंधक", "स्टॉक विक्रेता"],
  4: ["वितरक", "थोक व्यापारी", "क्षेत्रीय डीलर", "कमीशन एजेंट"],
  5: ["मंडी व्यापारी", "माप विक्रेता", "खुदरा व्यापारी", "थोक विक्रेता"],
  6: ["उत्पादन प्रबंधक", "निर्माता", "लागत विश्लेषक", "व्यवसाय प्रबंधक"],
};

const PUNJABI_CP_ACTORS: Readonly<Record<number, readonly string[]>> = {
  1: ["ਵਿਕਰੇਤਾ", "ਦੁਕਾਨਦਾਰ", "ਰਿਟੇਲ ਵਿਕਰੇਤਾ", "ਮੁੜ-ਵਿਕਰੇਤਾ"],
  2: ["ਸਟੋਰ ਪ੍ਰਬੰਧਕ", "ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ", "ਰਿਟੇਲ ਵਿਕਰੇਤਾ", "ਪ੍ਰਚਾਰ ਪ੍ਰਬੰਧਕ"],
  3: ["ਗੋਦਾਮ ਪ੍ਰਬੰਧਕ", "ਥੋਕ ਵਪਾਰੀ", "ਇਨਵੈਂਟਰੀ ਪ੍ਰਬੰਧਕ", "ਸਟਾਕ ਵਿਕਰੇਤਾ"],
  4: ["ਵੰਡਕਾਰ", "ਥੋਕ ਵਪਾਰੀ", "ਖੇਤਰੀ ਡੀਲਰ", "ਕਮਿਸ਼ਨ ਏਜੰਟ"],
  5: ["ਮੰਡੀ ਵਪਾਰੀ", "ਮਾਪ ਵਿਕਰੇਤਾ", "ਰਿਟੇਲ ਵਪਾਰੀ", "ਥੋਕ ਵਿਕਰੇਤਾ"],
  6: ["ਉਤਪਾਦਨ ਪ੍ਰਬੰਧਕ", "ਨਿਰਮਾਤਾ", "ਲਾਗਤ ਵਿਸ਼ਲੇਸ਼ਕ", "ਕਾਰੋਬਾਰੀ ਪ੍ਰਬੰਧਕ"],
};

function cpNumber(cpId: string): number {
  const value = Number(cpId.split("-").at(-1));
  return Number.isFinite(value) ? value : 1;
}

function qlNumber(qlId: string): number {
  const value = Number(qlId.split("-").at(-1));
  return Number.isFinite(value) ? value : 1;
}

export function nativeStemContext(
  language: NativeEditorialLanguage,
  cpId: string,
  qlId: string,
): NativeStemContext {
  const number = qlNumber(qlId);
  const cp = cpNumber(cpId);
  const sectors = (language === "hi" ? HINDI_CP_SECTORS : PUNJABI_CP_SECTORS)[cp];
  const items = (language === "hi" ? HINDI_CP_ITEMS : PUNJABI_CP_ITEMS)[cp];
  const actors = (language === "hi" ? HINDI_CP_ACTORS : PUNJABI_CP_ACTORS)[cp];
  const sector = sectors[number % sectors.length];
  const item = items[number % items.length];
  const actor = actors[number % actors.length];
  const family = `${language}:${cpId}:${number}:${sector}`;

  if (language === "hi") {
    const leads = [
      `${sector} से जुड़े एक व्यावहारिक प्रश्न में निम्न जानकारी दी गई है।`,
      `${sector} के एक वास्तविक व्यावसायिक रिकॉर्ड पर विचार कीजिए।`,
      `${sector} की मूल्य-निर्धारण स्थिति नीचे दी गई है।`,
      `निम्न विवरण ${sector} से जुड़े एक लेन-देन का है।`,
      `${sector} के दिए गए आंकड़ों का उपयोग कीजिए।`,
    ];
    return { family, lead: leads[number % leads.length], item, actor };
  }

  const leads = [
    `${sector} ਨਾਲ ਜੁੜੇ ਇੱਕ ਵਿਆਵਹਾਰਿਕ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਵਰਤੋ।`,
    `${sector} ਦੇ ਇੱਕ ਅਸਲ ਵਪਾਰਕ ਰਿਕਾਰਡ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ।`,
    `${sector} ਦੀ ਕੀਮਤ-ਨਿਰਧਾਰਨ ਸਥਿਤੀ ਹੇਠਾਂ ਦਿੱਤੀ ਹੈ।`,
    `ਹੇਠਾਂ ਦਿੱਤਾ ਵੇਰਵਾ ${sector} ਨਾਲ ਜੁੜੇ ਇੱਕ ਲੈਣ-ਦੇਣ ਦਾ ਹੈ।`,
    `${sector} ਦੇ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।`,
  ];
  return { family, lead: leads[number % leads.length], item, actor };
}

function replaceHindiGeneric(text: string, item: string): string {
  return text
    .replace(/एक वस्तु/g, item)
    .replace(/वस्तु/g, item);
}

function replacePunjabiGeneric(text: string, item: string): string {
  return text
    .replace(/ਇੱਕ ਵਸਤੂ/g, item)
    .replace(/ਵਸਤੂ/g, item);
}

export function contextualiseNativeTemplate(
  language: NativeEditorialLanguage,
  cpId: string,
  qlId: string,
  template: string,
): Readonly<{ family: string; text: string }> {
  const context = nativeStemContext(language, cpId, qlId);
  const localized = language === "hi"
    ? replaceHindiGeneric(template, context.item)
    : replacePunjabiGeneric(template, context.item);
  return { family: context.family, text: `${context.lead} ${localized}` };
}

const HINDI_PROMPT_PATTERN = /(ज्ञात कीजिए|बताइए|चुनिए|निर्धारित कीजिए|तय कीजिए|क्या होगा|क्या था|कितना होगा|कितनी होगी|कितना है|कौन-सा|किस मूल्य|किस दर|कितने)/g;
const PUNJABI_PROMPT_PATTERN = /(ਪਤਾ ਕਰੋ|ਦੱਸੋ|ਚੁਣੋ|ਨਿਰਧਾਰਤ ਕਰੋ|ਕੀ ਹੋਵੇਗਾ|ਕੀ ਸੀ|ਕਿੰਨਾ ਹੋਵੇਗਾ|ਕਿੰਨੀ ਹੋਵੇਗੀ|ਕਿਹੜਾ|ਕਿਸ ਮੁੱਲ|ਕਿਸ ਦਰ|ਕਿੰਨੇ)/g;

export function splitNativeQuestion(
  language: NativeEditorialLanguage,
  text: string,
): Readonly<{ body: string; prompt: string }> {
  const sentences = text
    .split(/(?<=[।?])/u)
    .map((part) => part.trim())
    .filter(Boolean);

  if (sentences.length >= 2) {
    return {
      body: sentences.slice(0, -1).join(" "),
      prompt: sentences.at(-1) ?? text,
    };
  }

  const pattern = language === "hi" ? HINDI_PROMPT_PATTERN : PUNJABI_PROMPT_PATTERN;
  const matches = [...text.matchAll(pattern)];
  const match = matches.at(-1);
  if (match?.index !== undefined && match.index > 20) {
    const sentenceStart = Math.max(
      text.lastIndexOf("।", match.index - 1),
      text.lastIndexOf("?", match.index - 1),
    ) + 1;
    if (sentenceStart > 0 && sentenceStart < match.index) {
      return {
        body: text.slice(0, sentenceStart).trim(),
        prompt: text.slice(sentenceStart).trim(),
      };
    }
    return {
      body: text.slice(0, match.index).trim(),
      prompt: text.slice(match.index).trim(),
    };
  }

  return {
    body: text,
    prompt: language === "hi" ? "सही उत्तर चुनिए।" : "ਸਹੀ ਉੱਤਰ ਚੁਣੋ।",
  };
}

export function nativeRepresentationLabels(language: NativeEditorialLanguage) {
  return language === "hi"
    ? {
        tableCaption: "दिए गए व्यावसायिक आंकड़े",
        tableColumns: ["समूह/विकल्प", "मात्रा या मूल्य", "बिक्री की शर्त"],
        offerColumns: ["ऑफर", "पहली छूट", "दूसरी छूट"],
        transactionColumns: ["चरण", "लाभ/हानि की शर्त", "दर"],
        caseletTitle: "व्यावसायिक केसलेट",
        statementsLead: "निम्न कथनों पर विचार कीजिए:",
        dsQuestion: "क्या मांगी गई राशि या दर को निश्चित रूप से ज्ञात किया जा सकता है?",
        dsFooter: "मानक दो-कथन डेटा-पर्याप्तता नियम का उपयोग कीजिए।",
      }
    : {
        tableCaption: "ਦਿੱਤੇ ਗਏ ਵਪਾਰਕ ਅੰਕੜੇ",
        tableColumns: ["ਸਮੂਹ/ਵਿਕਲਪ", "ਮਾਤਰਾ ਜਾਂ ਮੁੱਲ", "ਵਿਕਰੀ ਦੀ ਸ਼ਰਤ"],
        offerColumns: ["ਆਫਰ", "ਪਹਿਲੀ ਛੂਟ", "ਦੂਜੀ ਛੂਟ"],
        transactionColumns: ["ਪੜਾਅ", "ਲਾਭ/ਹਾਨੀ ਦੀ ਸ਼ਰਤ", "ਦਰ"],
        caseletTitle: "ਵਪਾਰਕ ਕੇਸਲੈਟ",
        statementsLead: "ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:",
        dsQuestion: "ਕੀ ਮੰਗੀ ਗਈ ਰਕਮ ਜਾਂ ਦਰ ਨੂੰ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
        dsFooter: "ਮਿਆਰੀ ਦੋ-ਕਥਨ ਡਾਟਾ-ਪਰਯਾਪਤਤਾ ਨਿਯਮ ਵਰਤੋ।",
      };
}
