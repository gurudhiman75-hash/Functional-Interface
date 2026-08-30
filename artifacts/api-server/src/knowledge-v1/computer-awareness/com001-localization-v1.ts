import type { KnowledgeFact, KnowledgeFactValue } from "../types";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com001-english-freeze-v1";
import { COM001_EDITORIALLY_APPROVED_FACTS } from "./com001-editorial-review";
import { generateCom001ReviewQuestion } from "./com001-review-synthesis";
import type { Com001ReviewQuestion } from "./com001-review-types";

export const COM001_LOCALIZATION_VERSION_V1 = "COM-001-LOCALIZATION-V1" as const;
export const COM001_LOCALIZATION_AUTHORITY_DRAFT_V1 =
  "COM001_HI_PA_LOCALIZATION_REVIEW_V1" as const;

export type Com001LocalizationLanguageV1 = "en" | "hi" | "pa";
export type Com001LocalizationLocaleV1 = "en-IN" | "hi-IN" | "pa-IN";

type TargetLanguage = Exclude<Com001LocalizationLanguageV1, "en">;
type Pair = { hi: string; pa: string };

export type Com001LocalizedReviewQuestionV1 = Omit<
  Com001ReviewQuestion,
  "stem" | "options" | "canonicalAnswer" | "explanation"
> & {
  language: Com001LocalizationLanguageV1;
  locale: Com001LocalizationLocaleV1;
  stem: string;
  options: string[];
  canonicalAnswer: string;
  explanation: string;
  localization: {
    version: typeof COM001_LOCALIZATION_VERSION_V1;
    authority: typeof COM001_LOCALIZATION_AUTHORITY_DRAFT_V1;
    englishFreezeAuthorityId: typeof COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
    englishQuestionId: string;
    semanticStateInvariant: true;
    qlInvariant: true;
    sourceFactsInvariant: true;
    sourceAuthorityInvariant: true;
    solverAuthorityInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
  };
  lifecycle: {
    localizationReviewOnly: true;
    localizationFrozen: false;
    questionStudioDiscoverable: false;
    questionStudioRegistrationStatus: "NOT_REGISTERED";
    persistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  };
};

const phrase = (hi: string, pa: string): Pair => ({ hi, pa });

export const COM001_TERMINOLOGY_REGISTRY_V1: Record<string, Pair> = {
  volatile: phrase("वोलाटाइल", "ਵੋਲਾਟਾਈਲ"),
  "non-volatile": phrase("नॉन-वोलाटाइल", "ਨਾਨ-ਵੋਲਾਟਾਈਲ"),
  magnetic: phrase("चुंबकीय", "ਚੁੰਬਕੀ"),
  optical: phrase("ऑप्टिकल", "ਆਪਟੀਕਲ"),
  "solid-state": phrase("सॉलिड-स्टेट", "ਸਾਲਿਡ-ਸਟੇਟ"),
  "register memory": phrase("रजिस्टर मेमोरी", "ਰਜਿਸਟਰ ਮੈਮਰੀ"),
  "cache memory": phrase("कैश मेमोरी", "ਕੈਸ਼ ਮੈਮਰੀ"),
  "primary memory": phrase("प्राथमिक मेमोरी", "ਪ੍ਰਾਇਮਰੀ ਮੈਮਰੀ"),
  "secondary storage": phrase("द्वितीयक स्टोरेज", "ਸੈਕੰਡਰੀ ਸਟੋਰੇਜ"),
  "magnetic storage": phrase("चुंबकीय स्टोरेज", "ਚੁੰਬਕੀ ਸਟੋਰੇਜ"),
  "optical storage": phrase("ऑप्टिकल स्टोरेज", "ਆਪਟੀਕਲ ਸਟੋਰੇਜ"),
  "solid-state storage": phrase("सॉलिड-स्टेट स्टोरेज", "ਸਾਲਿਡ-ਸਟੇਟ ਸਟੋਰੇਜ"),
  "CPU registers": phrase("CPU रजिस्टर", "CPU ਰਜਿਸਟਰ"),
  "Cache memory": phrase("कैश मेमोरी", "ਕੈਸ਼ ਮੈਮਰੀ"),
  "Flash memory": phrase("फ्लैश मेमोरी", "ਫਲੈਸ਼ ਮੈਮਰੀ"),
  "Magnetic tape": phrase("मैग्नेटिक टेप", "ਮੈਗਨੇਟਿਕ ਟੇਪ"),
  "USB flash drive": phrase("USB फ्लैश ड्राइव", "USB ਫਲੈਸ਼ ਡਰਾਈਵ"),
  "Floppy disk": phrase("फ्लॉपी डिस्क", "ਫਲਾਪੀ ਡਿਸਕ"),
  "Blu-ray Disc": phrase("ब्लू-रे डिस्क", "ਬਲੂ-ਰੇ ਡਿਸਕ"),
  "SD memory card": phrase("SD मेमोरी कार्ड", "SD ਮੈਮਰੀ ਕਾਰਡ"),
  "Main memory (RAM)": phrase("मुख्य मेमोरी (RAM)", "ਮੁੱਖ ਮੈਮਰੀ (RAM)"),
  "Secondary storage": phrase("द्वितीयक स्टोरेज", "ਸੈਕੰਡਰੀ ਸਟੋਰੇਜ"),
  "RDX removable disk": phrase("RDX रिमूवेबल डिस्क", "RDX ਰਿਮੂਵੇਬਲ ਡਿਸਕ"),
  "WORM optical media": phrase("WORM ऑप्टिकल मीडिया", "WORM ਆਪਟੀਕਲ ਮੀਡੀਆ"),
  "keeps frequently used data closer to the processor for faster access": phrase(
    "अक्सर उपयोग होने वाले डेटा को तेज़ पहुँच के लिए प्रोसेसर के पास रखती है",
    "ਵਾਰ-ਵਾਰ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਡਾਟੇ ਨੂੰ ਤੇਜ਼ ਪਹੁੰਚ ਲਈ ਪ੍ਰੋਸੈਸਰ ਦੇ ਨੇੜੇ ਰੱਖਦੀ ਹੈ",
  ),
  "temporarily holds active programs and data for quick processor access": phrase(
    "सक्रिय प्रोग्राम और डेटा को तेज़ प्रोसेसर पहुँच के लिए अस्थायी रूप से रखती है",
    "ਸਰਗਰਮ ਪ੍ਰੋਗਰਾਮਾਂ ਅਤੇ ਡਾਟੇ ਨੂੰ ਤੇਜ਼ ਪ੍ਰੋਸੈਸਰ ਪਹੁੰਚ ਲਈ ਅਸਥਾਈ ਤੌਰ ਤੇ ਰੱਖਦੀ ਹੈ",
  ),
  "serves as volatile main working memory for active program data": phrase(
    "सक्रिय प्रोग्राम डेटा के लिए वोलाटाइल मुख्य कार्यशील मेमोरी का काम करती है",
    "ਸਰਗਰਮ ਪ੍ਰੋਗਰਾਮ ਡਾਟੇ ਲਈ ਵੋਲਾਟਾਈਲ ਮੁੱਖ ਵਰਕਿੰਗ ਮੈਮਰੀ ਵਜੋਂ ਕੰਮ ਕਰਦੀ ਹੈ",
  ),
  "stores persistent startup or firmware instructions": phrase(
    "स्थायी स्टार्टअप या फर्मवेयर निर्देशों को संग्रहीत करती है",
    "ਸਥਾਈ ਸਟਾਰਟਅੱਪ ਜਾਂ ਫਰਮਵੇਅਰ ਹਦਾਇਤਾਂ ਸੰਭਾਲਦੀ ਹੈ",
  ),
  "provides read-only memory that can be programmed once after manufacture": phrase(
    "ऐसी रीड-ओनली मेमोरी देती है जिसे निर्माण के बाद एक बार प्रोग्राम किया जा सकता है",
    "ਅਜਿਹੀ ਰੀਡ-ਓਨਲੀ ਮੈਮਰੀ ਦਿੰਦੀ ਹੈ ਜਿਸਨੂੰ ਬਣਾਉਣ ਤੋਂ ਬਾਅਦ ਇੱਕ ਵਾਰ ਪ੍ਰੋਗਰਾਮ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ",
  ),
  "provides non-volatile program storage that can be erased with ultraviolet light and reused": phrase(
    "नॉन-वोलाटाइल प्रोग्राम स्टोरेज देती है जिसे पराबैंगनी प्रकाश से मिटाकर दोबारा उपयोग किया जा सकता है",
    "ਨਾਨ-ਵੋਲਾਟਾਈਲ ਪ੍ਰੋਗਰਾਮ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ ਜਿਸਨੂੰ ਅਲਟਰਾ ਵਾਇਲਟ ਰੋਸ਼ਨੀ ਨਾਲ ਮਿਟਾ ਕੇ ਮੁੜ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ",
  ),
  "stores non-volatile data that can be electrically erased and reprogrammed": phrase(
    "नॉन-वोलाटाइल डेटा संग्रहीत करती है जिसे विद्युत रूप से मिटाकर फिर प्रोग्राम किया जा सकता है",
    "ਨਾਨ-ਵੋਲਾਟਾਈਲ ਡਾਟਾ ਸੰਭਾਲਦੀ ਹੈ ਜਿਸਨੂੰ ਬਿਜਲੀ ਰਾਹੀਂ ਮਿਟਾ ਕੇ ਮੁੜ ਪ੍ਰੋਗਰਾਮ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ",
  ),
  "provides persistent magnetic storage for files and applications": phrase(
    "फाइलों और एप्लिकेशन के लिए स्थायी चुंबकीय स्टोरेज देती है",
    "ਫਾਈਲਾਂ ਅਤੇ ਐਪਲੀਕੇਸ਼ਨਾਂ ਲਈ ਸਥਾਈ ਚੁੰਬਕੀ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ",
  ),
  "provides persistent solid-state storage without mechanical moving parts": phrase(
    "बिना यांत्रिक चलने वाले भागों के स्थायी सॉलिड-स्टेट स्टोरेज देती है",
    "ਮਕੈਨੀਕੀ ਹਿਲਣ ਵਾਲੇ ਭਾਗਾਂ ਤੋਂ ਬਿਨਾਂ ਸਥਾਈ ਸਾਲਿਡ-ਸਟੇਟ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ",
  ),
  "provides removable sequential storage commonly used for long-term data retention and backup": phrase(
    "हटाने योग्य क्रमिक स्टोरेज देती है जिसका उपयोग लंबे समय तक डेटा रखने और बैकअप के लिए किया जाता है",
    "ਹਟਾਉਣਯੋਗ ਕ੍ਰਮਵਾਰ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ ਜੋ ਲੰਬੇ ਸਮੇਂ ਲਈ ਡਾਟਾ ਸੰਭਾਲਣ ਅਤੇ ਬੈਕਅੱਪ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ",
  ),
  "sequential access": phrase("क्रमिक पहुँच", "ਕ੍ਰਮਵਾਰ ਪਹੁੰਚ"),
  "random access": phrase("रैंडम पहुँच", "ਰੈਂਡਮ ਪਹੁੰਚ"),
  "removable media": phrase("हटाने योग्य माध्यम", "ਹਟਾਉਣਯੋਗ ਮੀਡੀਆ"),
  backup: phrase("बैकअप", "ਬੈਕਅੱਪ"),
  "archival use": phrase("अभिलेखीय उपयोग", "ਆਰਕਾਈਵ ਵਰਤੋਂ"),
  recovery: phrase("रिकवरी", "ਰਿਕਵਰੀ"),
  "write-once retention": phrase("एक बार लिखकर सुरक्षित रखना", "ਇੱਕ ਵਾਰ ਲਿਖ ਕੇ ਸੰਭਾਲਣਾ"),
};

const TECHNICAL_UNCHANGED = new Set([
  "RAM", "DRAM", "SRAM", "ROM", "PROM", "EPROM", "EEPROM",
  "HDD", "SSD", "CD", "DVD",
]);

function locale(language: Com001LocalizationLanguageV1): Com001LocalizationLocaleV1 {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function tr(text: string, language: TargetLanguage) {
  if (TECHNICAL_UNCHANGED.has(text)) return text;
  return COM001_TERMINOLOGY_REGISTRY_V1[text]?.[language] ?? text;
}

function translateUnits(text: string, language: TargetLanguage) {
  return text
    .replace(/\bbits\b/giu, language === "hi" ? "बिट" : "ਬਿਟ")
    .replace(/\bbytes\b/giu, language === "hi" ? "बाइट" : "ਬਾਈਟ");
}

function translateCombination(text: string, language: TargetLanguage) {
  if (text === "None of the statements") {
    return language === "hi" ? "कोई भी कथन नहीं" : "ਕੋਈ ਵੀ ਕਥਨ ਨਹੀਂ";
  }
  const ids = text.match(/\b(?:IV|III|II|I)\b/gu) ?? [];
  if (!ids.length) return text;
  const and = language === "hi" ? "और" : "ਅਤੇ";
  const joined = ids.length === 1
    ? ids[0]!
    : ids.length === 2
      ? `${ids[0]} ${and} ${ids[1]}`
      : `${ids.slice(0, -1).join(", ")} ${and} ${ids.at(-1)}`;
  return language === "hi" ? `केवल ${joined}` : `ਕੇਵਲ ${joined}`;
}

function translateOption(text: string, language: TargetLanguage) {
  const direct = tr(text, language);
  if (direct !== text) return direct;
  if (/^[\d,]+\s+(?:bits|bytes)$/iu.test(text)) return translateUnits(text, language);
  if (text === "None of the statements" || /\b(?:IV|III|II|I)\b/u.test(text)) {
    return translateCombination(text, language);
  }
  return text;
}

function approvedFact(factId: string) {
  const fact = COM001_EDITORIALLY_APPROVED_FACTS.find((entry) => entry.factId === factId);
  if (!fact) throw new Error(`COM-001 localization fact ${factId} is not editorially approved`);
  return fact;
}

function findFact(question: Com001ReviewQuestion, predicate: (fact: KnowledgeFact) => boolean) {
  return question.sourceFactIds.map(approvedFact).find(predicate);
}

function targetFact(question: Com001ReviewQuestion) {
  if (question.qlId === "COM-001-QL-003") {
    return findFact(
      question,
      (fact) => fact.value.kind === "text" && fact.value.text.en === question.canonicalAnswer,
    );
  }
  if (question.qlId === "COM-001-QL-009") return approvedFact(question.sourceFactIds[0]!);
  return findFact(question, (fact) => fact.entity.label.en === question.canonicalAnswer);
}

function valueText(value: KnowledgeFactValue, language: TargetLanguage) {
  if (value.kind === "text") return tr(value.text.en, language);
  if (value.kind === "entity_ref") return tr(value.label.en, language);
  if (value.kind === "number") {
    const n = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value.value);
    return translateUnits(`${n} ${value.unit ?? ""}`.trim(), language);
  }
  if (value.kind === "date") return value.isoDate;
  return value.value ? (language === "hi" ? "सही" : "ਸਹੀ") : (language === "hi" ? "गलत" : "ਗਲਤ");
}

function simpleStem(question: Com001ReviewQuestion, language: TargetLanguage, fact: KnowledgeFact) {
  const en = question.stem;
  const entity = tr(fact.entity.label.en, language);
  const hi = language === "hi";

  if (question.qlId === "COM-001-QL-001") {
    const volatility = fact.value.kind === "text" ? fact.value.text.en : "";
    if (volatility === "volatile") {
      if (en.startsWith("Which of the following loses")) return hi
        ? "निम्न में से किसकी संग्रहित सामग्री बिजली बंद होने पर नष्ट हो जाती है?"
        : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸਦੀ ਸੰਭਾਲੀ ਸਮੱਗਰੀ ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਤੇ ਮਿਟ ਜਾਂਦੀ ਹੈ?";
      if (en.startsWith("Identify")) return hi
        ? "निम्न विकल्पों में से वोलाटाइल मेमोरी पहचानिए।"
        : "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਵੋਲਾਟਾਈਲ ਮੈਮਰੀ ਪਛਾਣੋ।";
      return hi ? "निम्न में से कौन-सी वोलाटाइल मेमोरी है?" : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਵੋਲਾਟਾਈਲ ਮੈਮਰੀ ਹੈ?";
    }
    if (en.startsWith("Which of the following can retain")) return hi
      ? "निम्न में से कौन बिजली बंद होने पर भी संग्रहित डेटा बनाए रख सकता है?"
      : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਤੇ ਵੀ ਸੰਭਾਲਿਆ ਡਾਟਾ ਕਾਇਮ ਰੱਖ ਸਕਦਾ ਹੈ?";
    if (en.startsWith("Identify")) return hi
      ? "निम्न विकल्पों में से नॉन-वोलाटाइल मेमोरी या स्टोरेज डिवाइस पहचानिए।"
      : "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਨਾਨ-ਵੋਲਾਟਾਈਲ ਮੈਮਰੀ ਜਾਂ ਸਟੋਰੇਜ ਡਿਵਾਈਸ ਪਛਾਣੋ।";
    return hi ? "निम्न में से कौन नॉन-वोलाटाइल है?" : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਾਨ-ਵੋਲਾਟਾਈਲ ਹੈ?";
  }

  if (question.qlId === "COM-001-QL-002") {
    const layer = fact.value.kind === "entity_ref" ? tr(fact.value.label.en, language) : "";
    if (en.startsWith("Which option belongs")) return hi ? `कौन-सा विकल्प ${layer} से संबंधित है?` : `ਕਿਹੜਾ ਵਿਕਲਪ ${layer} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`;
    if (en.startsWith("Identify")) return hi ? `निम्न विकल्पों में से ${layer} वाला आइटम पहचानिए।` : `ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ${layer} ਵਾਲੀ ਆਈਟਮ ਪਛਾਣੋ।`;
    return hi ? `निम्न में से किसे ${layer} के रूप में वर्गीकृत किया जाता है?` : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸਨੂੰ ${layer} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`;
  }

  if (question.qlId === "COM-001-QL-003") {
    if (en.startsWith("Which option best")) return hi ? `कौन-सा विकल्प ${entity} के मुख्य उद्देश्य को सबसे सही बताता है?` : `ਕਿਹੜਾ ਵਿਕਲਪ ${entity} ਦੇ ਮੁੱਖ ਉਦੇਸ਼ ਨੂੰ ਸਭ ਤੋਂ ਠੀਕ ਦੱਸਦਾ ਹੈ?`;
    if (en.includes("is primarily used")) return hi ? `${entity} का मुख्य उपयोग निम्न में से किसके लिए होता है?` : `${entity} ਦੀ ਮੁੱਖ ਵਰਤੋਂ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਲਈ ਹੁੰਦੀ ਹੈ?`;
    return hi ? `${entity} का मुख्य कार्य क्या है?` : `${entity} ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?`;
  }

  if (question.qlId === "COM-001-QL-004") {
    const parent = fact.value.kind === "entity_ref" ? tr(fact.value.label.en, language) : "";
    if (en.startsWith("Which option belongs")) return hi ? `कौन-सा विकल्प ${parent} परिवार से संबंधित है?` : `ਕਿਹੜਾ ਵਿਕਲਪ ${parent} ਪਰਿਵਾਰ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`;
    if (en.startsWith("Identify")) return hi ? `${parent} के अंतर्गत सही वर्गीकृत आइटम पहचानिए।` : `${parent} ਹੇਠ ਠੀਕ ਵਰਗੀਕ੍ਰਿਤ ਆਈਟਮ ਪਛਾਣੋ।`;
    return hi ? `निम्न में से कौन ${parent} का एक प्रकार है?` : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ${parent} ਦੀ ਇੱਕ ਕਿਸਮ ਹੈ?`;
  }

  if (question.qlId === "COM-001-QL-005") {
    const medium = fact.value.kind === "text" ? tr(fact.value.text.en, language) : "";
    if (en.startsWith("Which option is")) return hi ? `कौन-सा विकल्प ${medium} स्टोरेज डिवाइस या माध्यम है?` : `ਕਿਹੜਾ ਵਿਕਲਪ ${medium} ਸਟੋਰੇਜ ਡਿਵਾਈਸ ਜਾਂ ਮੀਡੀਆ ਹੈ?`;
    if (en.startsWith("Identify")) return hi ? `${medium} स्टोरेज विकल्प पहचानिए।` : `${medium} ਸਟੋਰੇਜ ਵਿਕਲਪ ਪਛਾਣੋ।`;
    return hi ? `निम्न में से कौन ${medium} स्टोरेज तकनीक का उपयोग करता है?` : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ${medium} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ?`;
  }

  const hierarchy: Record<string, Pair> = {
    "Which item is closest to the processor in the broad memory hierarchy?": phrase(
      "व्यापक मेमोरी पदानुक्रम में प्रोसेसर के सबसे निकट कौन-सा आइटम है?",
      "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ ਪ੍ਰੋਸੈਸਰ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਕਿਹੜੀ ਆਈਟਮ ਹੈ?",
    ),
    "Which item comes immediately below CPU registers in the broad memory hierarchy?": phrase(
      "व्यापक मेमोरी पदानुक्रम में CPU रजिस्टर के ठीक नीचे कौन-सा आइटम आता है?",
      "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ CPU ਰਜਿਸਟਰਾਂ ਤੋਂ ਤੁਰੰਤ ਹੇਠਾਂ ਕਿਹੜੀ ਆਈਟਮ ਆਉਂਦੀ ਹੈ?",
    ),
    "Which item comes immediately after cache in the broad memory hierarchy?": phrase(
      "व्यापक मेमोरी पदानुक्रम में कैश के तुरंत बाद कौन-सा आइटम आता है?",
      "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ ਕੈਸ਼ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਕਿਹੜੀ ਆਈਟਮ ਆਉਂਦੀ ਹੈ?",
    ),
    "Which item is farthest from the processor in the broad memory hierarchy?": phrase(
      "व्यापक मेमोरी पदानुक्रम में प्रोसेसर से सबसे दूर कौन-सा आइटम है?",
      "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ ਪ੍ਰੋਸੈਸਰ ਤੋਂ ਸਭ ਤੋਂ ਦੂਰ ਕਿਹੜੀ ਆਈਟਮ ਹੈ?",
    ),
  };
  return hierarchy[en]?.[language] ?? en;
}

function simpleExplanation(question: Com001ReviewQuestion, language: TargetLanguage, fact: KnowledgeFact) {
  const entity = tr(fact.entity.label.en, language);
  const hi = language === "hi";

  if (question.qlId === "COM-001-QL-001") {
    const volatility = fact.value.kind === "text" ? fact.value.text.en : "";
    if (volatility === "volatile") return hi
      ? `${entity} वोलाटाइल है, इसलिए अपनी सामग्री बनाए रखने के लिए इसे बिजली की आवश्यकता होती है। इसलिए ${entity} सही उत्तर है।`
      : `${entity} ਵੋਲਾਟਾਈਲ ਹੈ, ਇਸ ਲਈ ਆਪਣੀ ਸਮੱਗਰੀ ਕਾਇਮ ਰੱਖਣ ਲਈ ਇਸਨੂੰ ਬਿਜਲੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਇਸ ਲਈ ${entity} ਸਹੀ ਉੱਤਰ ਹੈ।`;
    return hi
      ? `${entity} नॉन-वोलाटाइल है, इसलिए बिजली हटने पर भी इसका संग्रहित डेटा बना रहता है। इसलिए ${entity} सही उत्तर है।`
      : `${entity} ਨਾਨ-ਵੋਲਾਟਾਈਲ ਹੈ, ਇਸ ਲਈ ਬਿਜਲੀ ਹਟਣ ਤੇ ਵੀ ਇਸਦਾ ਸੰਭਾਲਿਆ ਡਾਟਾ ਕਾਇਮ ਰਹਿੰਦਾ ਹੈ। ਇਸ ਲਈ ${entity} ਸਹੀ ਉੱਤਰ ਹੈ।`;
  }
  if (question.qlId === "COM-001-QL-002") {
    const layer = fact.value.kind === "entity_ref" ? tr(fact.value.label.en, language) : "";
    return hi ? `${entity} को ${layer} के रूप में वर्गीकृत किया जाता है। अन्य विकल्प मेमोरी या स्टोरेज की अलग श्रेणियों से संबंधित हैं।` : `${entity} ਨੂੰ ${layer} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਹੋਰ ਵਿਕਲਪ ਮੈਮਰੀ ਜਾਂ ਸਟੋਰੇਜ ਦੀਆਂ ਵੱਖਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।`;
  }
  if (question.qlId === "COM-001-QL-003") {
    const fn = fact.value.kind === "text" ? tr(fact.value.text.en, language) : "";
    return hi ? `${entity} ${fn}। इसलिए यही विकल्प इसके मुख्य कार्य को सही बताता है।` : `${entity} ${fn}। ਇਸ ਲਈ ਇਹੀ ਵਿਕਲਪ ਇਸਦਾ ਮੁੱਖ ਕੰਮ ਠੀਕ ਦੱਸਦਾ ਹੈ।`;
  }
  if (question.qlId === "COM-001-QL-004") {
    const parent = fact.value.kind === "entity_ref" ? tr(fact.value.label.en, language) : "";
    return hi ? `${entity}, ${parent} परिवार का हिस्सा है। अन्य विकल्प अलग मेमोरी या स्टोरेज परिवारों से संबंधित हैं।` : `${entity}, ${parent} ਪਰਿਵਾਰ ਦਾ ਹਿੱਸਾ ਹੈ। ਹੋਰ ਵਿਕਲਪ ਵੱਖਰੇ ਮੈਮਰੀ ਜਾਂ ਸਟੋਰੇਜ ਪਰਿਵਾਰਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।`;
  }
  if (question.qlId === "COM-001-QL-005") {
    const medium = fact.value.kind === "text" ? tr(fact.value.text.en, language) : "";
    return hi ? `${entity} ${medium} स्टोरेज तकनीक का उपयोग करता है, इसलिए यह पूछे गए वर्गीकरण से मेल खाता है।` : `${entity} ${medium} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪੁੱਛੇ ਗਏ ਵਰਗੀਕਰਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`;
  }
  return hi
    ? `व्यापक क्रम है: CPU रजिस्टर → कैश → मुख्य मेमोरी (RAM) → द्वितीयक स्टोरेज। इसलिए ${entity} प्रश्न में पूछे गए स्थान पर आता है।`
    : `ਵਿਆਪਕ ਕ੍ਰਮ ਹੈ: CPU ਰਜਿਸਟਰ → ਕੈਸ਼ → ਮੁੱਖ ਮੈਮਰੀ (RAM) → ਸੈਕੰਡਰੀ ਸਟੋਰੇਜ। ਇਸ ਲਈ ${entity} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੇ ਗਏ ਸਥਾਨ ਤੇ ਆਉਂਦਾ ਹੈ।`;
}

const QL007_STEMS: Record<string, Pair> = {
  "Which storage option is magnetic, sequential-access, removable, and suited to both backup and archival use?": phrase(
    "कौन-सा स्टोरेज विकल्प चुंबकीय, क्रमिक-पहुँच वाला, हटाने योग्य और बैकअप तथा अभिलेखीय उपयोग दोनों के लिए उपयुक्त है?",
    "ਕਿਹੜਾ ਸਟੋਰੇਜ ਵਿਕਲਪ ਚੁੰਬਕੀ, ਕ੍ਰਮਵਾਰ-ਪਹੁੰਚ ਵਾਲਾ, ਹਟਾਉਣਯੋਗ ਅਤੇ ਬੈਕਅੱਪ ਤੇ ਆਰਕਾਈਵ ਦੋਵਾਂ ਲਈ ਉਚਿਤ ਹੈ?",
  ),
  "Which removable magnetic storage option provides random access and is used for both backup and recovery?": phrase(
    "कौन-सा हटाने योग्य चुंबकीय स्टोरेज विकल्प रैंडम पहुँच देता है और बैकअप तथा रिकवरी दोनों के लिए उपयोग होता है?",
    "ਕਿਹੜਾ ਹਟਾਉਣਯੋਗ ਚੁੰਬਕੀ ਸਟੋਰੇਜ ਵਿਕਲਪ ਰੈਂਡਮ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ ਅਤੇ ਬੈਕਅੱਪ ਤੇ ਰਿਕਵਰੀ ਦੋਵਾਂ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
  ),
  "Which removable optical option is intended for archival, write-once retention?": phrase(
    "कौन-सा हटाने योग्य ऑप्टिकल विकल्प अभिलेखीय, एक-बार-लिखकर सुरक्षित रखने के लिए बनाया गया है?",
    "ਕਿਹੜਾ ਹਟਾਉਣਯੋਗ ਆਪਟੀਕਲ ਵਿਕਲਪ ਆਰਕਾਈਵ ਲਈ ਇੱਕ ਵਾਰ ਲਿਖ ਕੇ ਸੰਭਾਲਣ ਵਾਸਤੇ ਬਣਾਇਆ ਗਿਆ ਹੈ?",
  ),
  "Which removable solid-state option supports random access and can be used as backup media?": phrase(
    "कौन-सा हटाने योग्य सॉलिड-स्टेट विकल्प रैंडम पहुँच देता है और बैकअप माध्यम के रूप में उपयोग किया जा सकता है?",
    "ਕਿਹੜਾ ਹਟਾਉਣਯੋਗ ਸਾਲਿਡ-ਸਟੇਟ ਵਿਕਲਪ ਰੈਂਡਮ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ ਅਤੇ ਬੈਕਅੱਪ ਮੀਡੀਆ ਵਜੋਂ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
  ),
};

function ql007Explanation(question: Com001ReviewQuestion, language: TargetLanguage) {
  const match = question.explanation.match(/^(.+) satisfies all the given conditions: (.+)\. Therefore, .+ is the correct answer\.$/u);
  if (!match) throw new Error(`${question.questionId}: QL-007 English explanation shape changed`);
  const label = tr(match[1]!, language);
  const properties = match[2]!.split(", ").map((entry) => tr(entry, language));
  return language === "hi"
    ? `${label} दी गई सभी शर्तें पूरी करता है: ${properties.join(", ")}। इसलिए ${label} सही उत्तर है।`
    : `${label} ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀ ਕਰਦਾ ਹੈ: ${properties.join(", ")}। ਇਸ ਲਈ ${label} ਸਹੀ ਉੱਤਰ ਹੈ।`;
}

function translateStatement(statement: string, language: TargetLanguage) {
  const hi = language === "hi";
  let m = statement.match(/^(.+) is (volatile|non-volatile)\.$/u);
  if (m) return hi ? `${tr(m[1]!, language)} ${tr(m[2]!, language)} है।` : `${tr(m[1]!, language)} ${tr(m[2]!, language)} ਹੈ।`;
  m = statement.match(/^(.+) is classified as (.+)\.$/u);
  if (m) return hi ? `${tr(m[1]!, language)} को ${tr(m[2]!, language)} के रूप में वर्गीकृत किया जाता है।` : `${tr(m[1]!, language)} ਨੂੰ ${tr(m[2]!, language)} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
  m = statement.match(/^(.+) is a subtype of (.+)\.$/u);
  if (m) return hi ? `${tr(m[1]!, language)}, ${tr(m[2]!, language)} का एक प्रकार है।` : `${tr(m[1]!, language)}, ${tr(m[2]!, language)} ਦੀ ਇੱਕ ਕਿਸਮ ਹੈ।`;
  m = statement.match(/^(.+) uses (magnetic|optical|solid-state) storage technology\.$/u);
  if (m) return hi ? `${tr(m[1]!, language)} ${tr(m[2]!, language)} स्टोरेज तकनीक का उपयोग करता है।` : `${tr(m[1]!, language)} ${tr(m[2]!, language)} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ।`;
  m = statement.match(/^(.+) equals ([\d,]+) (bits|bytes)\.$/u);
  if (m) {
    const amount = translateUnits(`${m[2]} ${m[3]}`, language);
    return hi ? `${tr(m[1]!, language)} ${amount} के बराबर है।` : `${tr(m[1]!, language)} ${amount} ਦੇ ਬਰਾਬਰ ਹੈ।`;
  }
  throw new Error(`COM-001 localization statement shape changed: ${statement}`);
}

function ql008Stem(question: Com001ReviewQuestion, language: TargetLanguage) {
  return question.stem.split("\n").map((line) => {
    if (line === "Consider the following statements:") return language === "hi" ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:";
    if (line === "Which of the above statements are correct?") return language === "hi" ? "उपरोक्त में से कौन-से कथन सही हैं?" : "ਉਪਰੋਕਤ ਵਿੱਚੋਂ ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?";
    const m = line.match(/^((?:IV|III|II|I))\.\s+(.+)$/u);
    return m ? `${m[1]}. ${translateStatement(m[2]!, language)}` : line;
  }).join("\n");
}

function factSentence(fact: KnowledgeFact, language: TargetLanguage) {
  const entity = tr(fact.entity.label.en, language);
  const value = valueText(fact.value, language);
  const hi = language === "hi";
  if (fact.relation === "has_volatility") return hi ? `${entity} ${value} है` : `${entity} ${value} ਹੈ`;
  if (fact.relation === "classified_as_memory_layer") return hi ? `${entity} को ${value} के रूप में वर्गीकृत किया जाता है` : `${entity} ਨੂੰ ${value} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ`;
  if (fact.relation === "is_subtype_of") return hi ? `${entity}, ${value} का एक प्रकार है` : `${entity}, ${value} ਦੀ ਇੱਕ ਕਿਸਮ ਹੈ`;
  if (fact.relation === "uses_storage_medium") return hi ? `${entity} ${value} स्टोरेज तकनीक का उपयोग करता है` : `${entity} ${value} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ`;
  if (fact.relation === "capacity_unit_relation") return hi ? `${entity} ${value} के बराबर है` : `${entity} ${value} ਦੇ ਬਰਾਬਰ ਹੈ`;
  return hi ? `${entity} का मान ${value} है` : `${entity} ਦਾ ਮਾਨ ${value} ਹੈ`;
}

function ql008Explanation(question: Com001ReviewQuestion, language: TargetLanguage) {
  const trueIds = new Set(question.canonicalAnswer.match(/\b(?:IV|III|II|I)\b/gu) ?? []);
  const ids = ["I", "II", "III", "IV"];
  const clauses = question.sourceFactIds.map((factId, index) => {
    const id = ids[index]!;
    const correct = trueIds.has(id);
    const sentence = factSentence(approvedFact(factId), language);
    return language === "hi"
      ? `${id} ${correct ? "सही" : "गलत"} है क्योंकि ${sentence}।`
      : `${id} ${correct ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ ਕਿਉਂਕਿ ${sentence}।`;
  });
  const answer = translateCombination(question.canonicalAnswer, language);
  return language === "hi" ? `${clauses.join(" ")} इसलिए ${answer} सही हैं।` : `${clauses.join(" ")} ਇਸ ਲਈ ${answer} ਸਹੀ ਹਨ।`;
}

function ql009Stem(question: Com001ReviewQuestion, language: TargetLanguage) {
  const hi = language === "hi";
  const en = question.stem;
  if (/How many bits are there in one byte\?/iu.test(en)) return hi ? "एक बाइट में कितने बिट होते हैं?" : "ਇੱਕ ਬਾਈਟ ਵਿੱਚ ਕਿੰਨੇ ਬਿਟ ਹੁੰਦੇ ਹਨ?";
  if (/One byte is equal to how many bits\?/iu.test(en)) return hi ? "एक बाइट कितने बिट के बराबर होता है?" : "ਇੱਕ ਬਾਈਟ ਕਿੰਨੇ ਬਿਟ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ?";
  if (/Choose the correct bit-to-byte relation/iu.test(en)) return hi ? "बिट और बाइट का सही संबंध चुनिए।" : "ਬਿਟ ਅਤੇ ਬਾਈਟ ਦਾ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।";
  let m = en.match(/^Using IEC binary prefixes, (.+) is equal to how many bytes\?$/u);
  if (m) return hi ? `IEC बाइनरी प्रीफिक्स के अनुसार ${m[1]} कितने बाइट के बराबर है?` : `IEC ਬਾਈਨਰੀ ਪ੍ਰੀਫਿਕਸ ਅਨੁਸਾਰ ${m[1]} ਕਿੰਨੇ ਬਾਈਟ ਦੇ ਬਰਾਬਰ ਹੈ?`;
  m = en.match(/^Under the IEC binary-prefix convention, what is the value of (.+)\?$/u);
  if (m) return hi ? `IEC बाइनरी-प्रीफिक्स मानक के अनुसार ${m[1]} का मान क्या है?` : `IEC ਬਾਈਨਰੀ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${m[1]} ਦਾ ਮਾਨ ਕੀ ਹੈ?`;
  m = en.match(/^Choose the correct byte value for (.+) under the binary-prefix convention\.$/u);
  if (m) return hi ? `IEC बाइनरी-प्रीफिक्स मानक के अनुसार ${m[1]} का सही बाइट मान चुनिए।` : `IEC ਬਾਈਨਰੀ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${m[1]} ਦਾ ਸਹੀ ਬਾਈਟ ਮਾਨ ਚੁਣੋ।`;
  m = en.match(/^Using SI decimal prefixes, (.+) is equal to how many bytes\?$/u);
  if (m) return hi ? `SI दशमलव प्रीफिक्स के अनुसार ${m[1]} कितने बाइट के बराबर है?` : `SI ਦਸ਼ਮਲਵ ਪ੍ਰੀਫਿਕਸ ਅਨੁਸਾਰ ${m[1]} ਕਿੰਨੇ ਬਾਈਟ ਦੇ ਬਰਾਬਰ ਹੈ?`;
  m = en.match(/^Under the SI decimal-prefix convention, what is the value of (.+)\?$/u);
  if (m) return hi ? `SI दशमलव-प्रीफिक्स मानक के अनुसार ${m[1]} का मान क्या है?` : `SI ਦਸ਼ਮਲਵ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${m[1]} ਦਾ ਮਾਨ ਕੀ ਹੈ?`;
  m = en.match(/^Choose the correct byte value for (.+) under the decimal-prefix convention\.$/u);
  if (m) return hi ? `SI दशमलव-प्रीफिक्स मानक के अनुसार ${m[1]} का सही बाइट मान चुनिए।` : `SI ਦਸ਼ਮਲਵ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${m[1]} ਦਾ ਸਹੀ ਬਾਈਟ ਮਾਨ ਚੁਣੋ।`;
  throw new Error(`${question.questionId}: QL-009 English stem shape changed`);
}

function ql009Explanation(question: Com001ReviewQuestion, language: TargetLanguage) {
  const fact = targetFact(question);
  if (!fact || fact.value.kind !== "number") throw new Error(`${question.questionId}: QL-009 target missing`);
  const label = fact.entity.label.en;
  const answer = translateUnits(question.canonicalAnswer, language);
  if (fact.value.unit === "bits") return language === "hi" ? `एक बाइट में 8 बिट होते हैं। इसलिए ${label} = ${answer}।` : `ਇੱਕ ਬਾਈਟ ਵਿੱਚ 8 ਬਿਟ ਹੁੰਦੇ ਹਨ। ਇਸ ਲਈ ${label} = ${answer}।`;
  if (/KiB|MiB|GiB/u.test(label)) return language === "hi" ? `${label} में IEC बाइनरी-प्रीफिक्स मानक लागू होता है। इसलिए ${label} = ${answer}।` : `${label} ਲਈ IEC ਬਾਈਨਰੀ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ਇਸ ਲਈ ${label} = ${answer}।`;
  return language === "hi" ? `${label} में SI दशमलव-प्रीफिक्स मानक लागू होता है। इसलिए ${label} = ${answer}।` : `${label} ਲਈ SI ਦਸ਼ਮਲਵ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ਇਸ ਲਈ ${label} = ${answer}।`;
}

function localText(question: Com001ReviewQuestion, language: TargetLanguage) {
  if (["COM-001-QL-001", "COM-001-QL-002", "COM-001-QL-003", "COM-001-QL-004", "COM-001-QL-005", "COM-001-QL-006"].includes(question.qlId)) {
    const fact = targetFact(question);
    if (!fact) throw new Error(`${question.questionId}: localization target fact missing`);
    return { stem: simpleStem(question, language, fact), explanation: simpleExplanation(question, language, fact) };
  }
  if (question.qlId === "COM-001-QL-007") return {
    stem: QL007_STEMS[question.stem]?.[language] ?? (() => { throw new Error(`${question.questionId}: QL-007 stem shape changed`); })(),
    explanation: ql007Explanation(question, language),
  };
  if (question.qlId === "COM-001-QL-008") return { stem: ql008Stem(question, language), explanation: ql008Explanation(question, language) };
  if (question.qlId === "COM-001-QL-009") return { stem: ql009Stem(question, language), explanation: ql009Explanation(question, language) };
  throw new Error(`Unsupported COM-001 localization QL ${question.qlId}`);
}

export function localizeCom001ReviewQuestionV1(
  english: Com001ReviewQuestion,
  language: Com001LocalizationLanguageV1,
): Com001LocalizedReviewQuestionV1 {
  const text = language === "en"
    ? { stem: english.stem, explanation: english.explanation }
    : localText(english, language);
  const options = language === "en" ? [...english.options] : english.options.map((option) => translateOption(option, language));
  return {
    ...english,
    language,
    locale: locale(language),
    stem: text.stem,
    options,
    correctIndex: english.correctIndex,
    canonicalAnswer: options[english.correctIndex]!,
    explanation: text.explanation,
    localization: {
      version: COM001_LOCALIZATION_VERSION_V1,
      authority: COM001_LOCALIZATION_AUTHORITY_DRAFT_V1,
      englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      englishQuestionId: english.questionId,
      semanticStateInvariant: true,
      qlInvariant: true,
      sourceFactsInvariant: true,
      sourceAuthorityInvariant: true,
      solverAuthorityInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
    },
    lifecycle: {
      localizationReviewOnly: true,
      localizationFrozen: false,
      questionStudioDiscoverable: false,
      questionStudioRegistrationStatus: "NOT_REGISTERED",
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}

export function generateCom001LocalizedReviewQuestionV1(input: {
  qlId: string;
  seed: string;
  language: Com001LocalizationLanguageV1;
}) {
  return localizeCom001ReviewQuestionV1(
    generateCom001ReviewQuestion({ qlId: input.qlId, seed: input.seed }),
    input.language,
  );
}
