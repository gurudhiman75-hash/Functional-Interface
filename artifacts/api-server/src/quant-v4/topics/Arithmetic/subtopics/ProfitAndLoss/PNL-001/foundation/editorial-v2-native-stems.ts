export type NativeEditorialLanguage = "hi" | "pa";

export type NativeStemContext = Readonly<{
  family: string;
  lead: string;
  item: string;
  actor: string;
}>;

const HINDI_SECTORS = [
  "घरेलू उपकरण", "स्कूल सामग्री", "साइकिल शोरूम", "कपड़ा व्यापार", "किराना वितरण",
  "इलेक्ट्रॉनिक्स खुदरा", "फर्नीचर बिक्री", "कृषि उपकरण", "दवा आपूर्ति", "पुस्तक वितरण",
  "खाद्य प्रसंस्करण", "मोबाइल एक्सेसरी", "निर्माण सामग्री", "पैकेजिंग", "ऑटो पार्ट्स",
  "खेल सामग्री", "कार्यालय उपकरण", "बेकरी उत्पादन", "डेयरी वितरण", "ऑनलाइन रिटेल",
  "वेयरहाउस प्रबंधन", "परिधान थोक", "मशीन मरम्मत", "फल-सब्जी मंडी"
] as const;

const PUNJABI_SECTORS = [
  "ਘਰੇਲੂ ਉਪਕਰਣ", "ਸਕੂਲੀ ਸਮੱਗਰੀ", "ਸਾਈਕਲ ਸ਼ੋਰੂਮ", "ਕੱਪੜਾ ਵਪਾਰ", "ਕਿਰਾਣਾ ਵੰਡ",
  "ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਰਿਟੇਲ", "ਫਰਨੀਚਰ ਵਿਕਰੀ", "ਖੇਤੀਬਾੜੀ ਉਪਕਰਣ", "ਦਵਾਈ ਸਪਲਾਈ", "ਕਿਤਾਬ ਵੰਡ",
  "ਖਾਦ ਪ੍ਰੋਸੈਸਿੰਗ", "ਮੋਬਾਈਲ ਐਕਸੈਸਰੀ", "ਨਿਰਮਾਣ ਸਮੱਗਰੀ", "ਪੈਕੇਜਿੰਗ", "ਆਟੋ ਪਾਰਟਸ",
  "ਖੇਡ ਸਮੱਗਰੀ", "ਦਫ਼ਤਰੀ ਉਪਕਰਣ", "ਬੇਕਰੀ ਉਤਪਾਦਨ", "ਡੇਅਰੀ ਵੰਡ", "ਆਨਲਾਈਨ ਰਿਟੇਲ",
  "ਗੋਦਾਮ ਪ੍ਰਬੰਧਨ", "ਕੱਪੜਾ ਥੋਕ", "ਮਸ਼ੀਨ ਮੁਰੰਮਤ", "ਫਲ-ਸਬਜ਼ੀ ਮੰਡੀ"
] as const;

const HINDI_ITEMS = [
  "मिक्सर", "अध्ययन मेज", "साइकिल", "कपड़ों की खेप", "चावल की बोरियाँ", "स्मार्टफोन",
  "कार्यालय कुर्सियाँ", "पानी के पंप", "चिकित्सा किट", "पुस्तकों का लॉट", "बिस्कुट के पैकेट",
  "हेडफोन", "सीमेंट की बोरियाँ", "पैकिंग डिब्बे", "वाहन के पुर्जे", "क्रिकेट किट",
  "प्रिंटर", "ब्रेड की ट्रे", "दूध के पैकेट", "ऑनलाइन ऑर्डर", "भंडार की इकाइयाँ",
  "शर्टों की खेप", "पुरानी मशीन", "फलों की पेटियाँ"
] as const;

const PUNJABI_ITEMS = [
  "ਮਿਕਸਰ", "ਪੜ੍ਹਾਈ ਵਾਲਾ ਮੇਜ਼", "ਸਾਈਕਲ", "ਕੱਪੜਿਆਂ ਦੀ ਖੇਪ", "ਚੌਲਾਂ ਦੀਆਂ ਬੋਰੀਆਂ", "ਸਮਾਰਟਫੋਨ",
  "ਦਫ਼ਤਰੀ ਕੁਰਸੀਆਂ", "ਪਾਣੀ ਦੇ ਪੰਪ", "ਮੈਡੀਕਲ ਕਿੱਟ", "ਕਿਤਾਬਾਂ ਦਾ ਲਾਟ", "ਬਿਸਕੁਟਾਂ ਦੇ ਪੈਕਟ",
  "ਹੈੱਡਫੋਨ", "ਸੀਮੈਂਟ ਦੀਆਂ ਬੋਰੀਆਂ", "ਪੈਕਿੰਗ ਡੱਬੇ", "ਵਾਹਨ ਦੇ ਪੁਰਜ਼ੇ", "ਕ੍ਰਿਕਟ ਕਿੱਟ",
  "ਪ੍ਰਿੰਟਰ", "ਬਰੈੱਡ ਦੀਆਂ ਟ੍ਰੇਆਂ", "ਦੁੱਧ ਦੇ ਪੈਕਟ", "ਆਨਲਾਈਨ ਆਰਡਰ", "ਗੋਦਾਮ ਦੀਆਂ ਇਕਾਈਆਂ",
  "ਕਮੀਜ਼ਾਂ ਦੀ ਖੇਪ", "ਪੁਰਾਣੀ ਮਸ਼ੀਨ", "ਫਲਾਂ ਦੀਆਂ ਪੇਟੀਆਂ"
] as const;

const HINDI_ACTORS = [
  "विक्रेता", "दुकानदार", "थोक व्यापारी", "क्षेत्रीय वितरक", "खुदरा विक्रेता", "निर्माता",
  "गोदाम प्रबंधक", "कमीशन एजेंट", "उत्पादन प्रबंधक", "व्यवसायी", "ऑनलाइन विक्रेता", "आपूर्तिकर्ता"
] as const;

const PUNJABI_ACTORS = [
  "ਵਿਕਰੇਤਾ", "ਦੁਕਾਨਦਾਰ", "ਥੋਕ ਵਪਾਰੀ", "ਖੇਤਰੀ ਵੰਡਕਾਰ", "ਰਿਟੇਲ ਵਿਕਰੇਤਾ", "ਨਿਰਮਾਤਾ",
  "ਗੋਦਾਮ ਪ੍ਰਬੰਧਕ", "ਕਮਿਸ਼ਨ ਏਜੰਟ", "ਉਤਪਾਦਨ ਪ੍ਰਬੰਧਕ", "ਕਾਰੋਬਾਰੀ", "ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ", "ਸਪਲਾਇਰ"
] as const;

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
  const sectors = language === "hi" ? HINDI_SECTORS : PUNJABI_SECTORS;
  const items = language === "hi" ? HINDI_ITEMS : PUNJABI_ITEMS;
  const actors = language === "hi" ? HINDI_ACTORS : PUNJABI_ACTORS;
  const sector = sectors[(number + cp * 3) % sectors.length];
  const item = items[(number * 5 + cp) % items.length];
  const actor = actors[(number * 7 + cp) % actors.length];
  const family = `${language}:${cpId}:${number}:${sector}`;

  if (language === "hi") {
    const leads = [
      `एक ${sector} से जुड़े व्यापारिक प्रश्न में निम्न जानकारी दी गई है।`,
      `${sector} के एक वास्तविक बिक्री रिकॉर्ड पर विचार कीजिए।`,
      `${sector} व्यवसाय की मूल्य-निर्धारण स्थिति नीचे दी गई है।`,
      `निम्न विवरण ${sector} से जुड़े एक लेन-देन का है।`,
      `${sector} के व्यावसायिक आंकड़ों का उपयोग कीजिए।`,
    ];
    return { family, lead: leads[number % leads.length], item, actor };
  }

  const leads = [
    `${sector} ਨਾਲ ਜੁੜੇ ਇੱਕ ਵਪਾਰਕ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਵਰਤੋ।`,
    `${sector} ਦੇ ਇੱਕ ਅਸਲ ਵਿਕਰੀ ਰਿਕਾਰਡ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ।`,
    `${sector} ਕਾਰੋਬਾਰ ਦੀ ਕੀਮਤ-ਨਿਰਧਾਰਨ ਸਥਿਤੀ ਹੇਠਾਂ ਦਿੱਤੀ ਹੈ।`,
    `ਹੇਠਾਂ ਦਿੱਤਾ ਵੇਰਵਾ ${sector} ਨਾਲ ਜੁੜੇ ਇੱਕ ਲੈਣ-ਦੇਣ ਦਾ ਹੈ।`,
    `${sector} ਦੇ ਵਪਾਰਕ ਅੰਕੜਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।`,
  ];
  return { family, lead: leads[number % leads.length], item, actor };
}

function replaceHindiGeneric(text: string, item: string, actor: string): string {
  return text
    .replace(/एक वस्तु/g, item)
    .replace(/वस्तु/g, item)
    .replace(/एक व्यापारी/g, actor)
    .replace(/एक विक्रेता/g, actor)
    .replace(/एक दुकानदार/g, actor)
    .replace(/एक डीलर/g, actor);
}

function replacePunjabiGeneric(text: string, item: string, actor: string): string {
  return text
    .replace(/ਇੱਕ ਵਸਤੂ/g, item)
    .replace(/ਵਸਤੂ/g, item)
    .replace(/ਇੱਕ ਵਪਾਰੀ/g, actor)
    .replace(/ਇੱਕ ਵਿਕਰੇਤਾ/g, actor)
    .replace(/ਇੱਕ ਦੁਕਾਨਦਾਰ/g, actor)
    .replace(/ਇੱਕ ਡੀਲਰ/g, actor);
}

export function contextualiseNativeTemplate(
  language: NativeEditorialLanguage,
  cpId: string,
  qlId: string,
  template: string,
): Readonly<{ family: string; text: string }> {
  const context = nativeStemContext(language, cpId, qlId);
  const localized = language === "hi"
    ? replaceHindiGeneric(template, context.item, context.actor)
    : replacePunjabiGeneric(template, context.item, context.actor);
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
