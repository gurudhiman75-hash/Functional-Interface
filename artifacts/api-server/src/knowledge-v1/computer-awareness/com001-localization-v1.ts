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

type TranslatedPair = { hi: string; pa: string };

export const COM001_TERMINOLOGY_REGISTRY_V1: Record<string, TranslatedPair> = {
  volatile: { hi: "वोलाटाइल", pa: "ਵੋਲਾਟਾਈਲ" },
  "non-volatile": { hi: "नॉन-वोलाटाइल", pa: "ਨਾਨ-ਵੋਲਾਟਾਈਲ" },
  "register memory": { hi: "रजिस्टर मेमोरी", pa: "ਰਜਿਸਟਰ ਮੈਮਰੀ" },
  "cache memory": { hi: "कैश मेमोरी", pa: "ਕੈਸ਼ ਮੈਮਰੀ" },
  "primary memory": { hi: "प्राथमिक मेमोरी", pa: "ਪ੍ਰਾਇਮਰੀ ਮੈਮਰੀ" },
  "secondary storage": { hi: "द्वितीयक स्टोरेज", pa: "ਸੈਕੰਡਰੀ ਸਟੋਰੇਜ" },
  "magnetic storage": { hi: "चुंबकीय स्टोरेज", pa: "ਚੁੰਬਕੀ ਸਟੋਰੇਜ" },
  "optical storage": { hi: "ऑप्टिकल स्टोरेज", pa: "ਆਪਟੀਕਲ ਸਟੋਰੇਜ" },
  "solid-state storage": { hi: "सॉलिड-स्टेट स्टोरेज", pa: "ਸਾਲਿਡ-ਸਟੇਟ ਸਟੋਰੇਜ" },
  magnetic: { hi: "चुंबकीय", pa: "ਚੁੰਬਕੀ" },
  optical: { hi: "ऑप्टिकल", pa: "ਆਪਟੀਕਲ" },
  "solid-state": { hi: "सॉलिड-स्टेट", pa: "ਸਾਲਿਡ-ਸਟੇਟ" },
  "CPU registers": { hi: "CPU रजिस्टर", pa: "CPU ਰਜਿਸਟਰ" },
  "Cache memory": { hi: "कैश मेमोरी", pa: "ਕੈਸ਼ ਮੈਮਰੀ" },
  "Flash memory": { hi: "फ्लैश मेमोरी", pa: "ਫਲੈਸ਼ ਮੈਮਰੀ" },
  "Magnetic tape": { hi: "मैग्नेटिक टेप", pa: "ਮੈਗਨੇਟਿਕ ਟੇਪ" },
  "USB flash drive": { hi: "USB फ्लैश ड्राइव", pa: "USB ਫਲੈਸ਼ ਡਰਾਈਵ" },
  "Floppy disk": { hi: "फ्लॉपी डिस्क", pa: "ਫਲਾਪੀ ਡਿਸਕ" },
  "Blu-ray Disc": { hi: "ब्लू-रे डिस्क", pa: "ਬਲੂ-ਰੇ ਡਿਸਕ" },
  "SD memory card": { hi: "SD मेमोरी कार्ड", pa: "SD ਮੈਮਰੀ ਕਾਰਡ" },
  "Main memory (RAM)": { hi: "मुख्य मेमोरी (RAM)", pa: "ਮੁੱਖ ਮੈਮਰੀ (RAM)" },
  "Secondary storage": { hi: "द्वितीयक स्टोरेज", pa: "ਸੈਕੰਡਰੀ ਸਟੋਰੇਜ" },
  "RDX removable disk": { hi: "RDX रिमूवेबल डिस्क", pa: "RDX ਰਿਮੂਵੇਬਲ ਡਿਸਕ" },
  "WORM optical media": { hi: "WORM ऑप्टिकल मीडिया", pa: "WORM ਆਪਟੀਕਲ ਮੀਡੀਆ" },
  "keeps frequently used data closer to the processor for faster access": {
    hi: "अक्सर उपयोग होने वाले डेटा को तेज़ पहुँच के लिए प्रोसेसर के पास रखती है",
    pa: "ਵਾਰ-ਵਾਰ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਡਾਟੇ ਨੂੰ ਤੇਜ਼ ਪਹੁੰਚ ਲਈ ਪ੍ਰੋਸੈਸਰ ਦੇ ਨੇੜੇ ਰੱਖਦੀ ਹੈ",
  },
  "temporarily holds active programs and data for quick processor access": {
    hi: "सक्रिय प्रोग्राम और डेटा को तेज़ प्रोसेसर पहुँच के लिए अस्थायी रूप से रखती है",
    pa: "ਸਰਗਰਮ ਪ੍ਰੋਗਰਾਮਾਂ ਅਤੇ ਡਾਟੇ ਨੂੰ ਤੇਜ਼ ਪ੍ਰੋਸੈਸਰ ਪਹੁੰਚ ਲਈ ਅਸਥਾਈ ਤੌਰ ਤੇ ਰੱਖਦੀ ਹੈ",
  },
  "serves as volatile main working memory for active program data": {
    hi: "सक्रिय प्रोग्राम डेटा के लिए वोलाटाइल मुख्य कार्यशील मेमोरी का काम करती है",
    pa: "ਸਰਗਰਮ ਪ੍ਰੋਗਰਾਮ ਡਾਟੇ ਲਈ ਵੋਲਾਟਾਈਲ ਮੁੱਖ ਵਰਕਿੰਗ ਮੈਮਰੀ ਵਜੋਂ ਕੰਮ ਕਰਦੀ ਹੈ",
  },
  "stores persistent startup or firmware instructions": {
    hi: "स्थायी स्टार्टअप या फर्मवेयर निर्देशों को संग्रहीत करती है",
    pa: "ਸਥਾਈ ਸਟਾਰਟਅੱਪ ਜਾਂ ਫਰਮਵੇਅਰ ਹਦਾਇਤਾਂ ਸੰਭਾਲਦੀ ਹੈ",
  },
  "provides read-only memory that can be programmed once after manufacture": {
    hi: "ऐसी रीड-ओनली मेमोरी देती है जिसे निर्माण के बाद एक बार प्रोग्राम किया जा सकता है",
    pa: "ਅਜਿਹੀ ਰੀਡ-ਓਨਲੀ ਮੈਮਰੀ ਦਿੰਦੀ ਹੈ ਜਿਸਨੂੰ ਬਣਾਉਣ ਤੋਂ ਬਾਅਦ ਇੱਕ ਵਾਰ ਪ੍ਰੋਗਰਾਮ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ",
  },
  "provides non-volatile program storage that can be erased with ultraviolet light and reused": {
    hi: "नॉन-वोलाटाइल प्रोग्राम स्टोरेज देती है जिसे पराबैंगनी प्रकाश से मिटाकर दोबारा उपयोग किया जा सकता है",
    pa: "ਨਾਨ-ਵੋਲਾਟਾਈਲ ਪ੍ਰੋਗਰਾਮ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ ਜਿਸਨੂੰ ਅਲਟਰਾ ਵਾਇਲਟ ਰੋਸ਼ਨੀ ਨਾਲ ਮਿਟਾ ਕੇ ਮੁੜ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ",
  },
  "stores non-volatile data that can be electrically erased and reprogrammed": {
    hi: "नॉन-वोलाटाइल डेटा संग्रहीत करती है जिसे विद्युत रूप से मिटाकर फिर प्रोग्राम किया जा सकता है",
    pa: "ਨਾਨ-ਵੋਲਾਟਾਈਲ ਡਾਟਾ ਸੰਭਾਲਦੀ ਹੈ ਜਿਸਨੂੰ ਬਿਜਲੀ ਰਾਹੀਂ ਮਿਟਾ ਕੇ ਮੁੜ ਪ੍ਰੋਗਰਾਮ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ",
  },
  "provides persistent magnetic storage for files and applications": {
    hi: "फाइलों और एप्लिकेशन के लिए स्थायी चुंबकीय स्टोरेज देती है",
    pa: "ਫਾਈਲਾਂ ਅਤੇ ਐਪਲੀਕੇਸ਼ਨਾਂ ਲਈ ਸਥਾਈ ਚੁੰਬਕੀ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ",
  },
  "provides persistent solid-state storage without mechanical moving parts": {
    hi: "बिना यांत्रिक चलने वाले भागों के स्थायी सॉलिड-स्टेट स्टोरेज देती है",
    pa: "ਮਕੈਨੀਕੀ ਹਿਲਣ ਵਾਲੇ ਭਾਗਾਂ ਤੋਂ ਬਿਨਾਂ ਸਥਾਈ ਸਾਲਿਡ-ਸਟੇਟ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ",
  },
  "provides removable sequential storage commonly used for long-term data retention and backup": {
    hi: "हटाने योग्य क्रमिक स्टोरेज देती है जिसका उपयोग लंबे समय तक डेटा रखने और बैकअप के लिए किया जाता है",
    pa: "ਹਟਾਉਣਯੋਗ ਕ੍ਰਮਵਾਰ ਸਟੋਰੇਜ ਦਿੰਦੀ ਹੈ ਜੋ ਲੰਬੇ ਸਮੇਂ ਲਈ ਡਾਟਾ ਸੰਭਾਲਣ ਅਤੇ ਬੈਕਅੱਪ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ",
  },
  "magnetic storage": { hi: "चुंबकीय स्टोरेज", pa: "ਚੁੰਬਕੀ ਸਟੋਰੇਜ" },
  "optical storage": { hi: "ऑप्टिकल स्टोरेज", pa: "ਆਪਟੀਕਲ ਸਟੋਰੇਜ" },
  "solid-state storage": { hi: "सॉलिड-स्टेट स्टोरेज", pa: "ਸਾਲਿਡ-ਸਟੇਟ ਸਟੋਰੇਜ" },
  "sequential access": { hi: "क्रमिक पहुँच", pa: "ਕ੍ਰਮਵਾਰ ਪਹੁੰਚ" },
  "random access": { hi: "रैंडम पहुँच", pa: "ਰੈਂਡਮ ਪਹੁੰਚ" },
  "removable media": { hi: "हटाने योग्य माध्यम", pa: "ਹਟਾਉਣਯੋਗ ਮੀਡੀਆ" },
  backup: { hi: "बैकअप", pa: "ਬੈਕਅੱਪ" },
  "archival use": { hi: "अभिलेखीय उपयोग", pa: "ਆਰਕਾਈਵ ਵਰਤੋਂ" },
  recovery: { hi: "रिकवरी", pa: "ਰਿਕਵਰੀ" },
  "write-once retention": { hi: "एक बार लिखकर सुरक्षित रखना", pa: "ਇੱਕ ਵਾਰ ਲਿਖ ਕੇ ਸੰਭਾਲਣਾ" },
};

const UNCHANGED_TECHNICAL = new Set([
  "RAM",
  "DRAM",
  "SRAM",
  "ROM",
  "PROM",
  "EPROM",
  "EEPROM",
  "HDD",
  "SSD",
  "CD",
  "DVD",
]);

function locale(language: Com001LocalizationLanguageV1): Com001LocalizationLocaleV1 {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function term(text: string, language: "hi" | "pa") {
  if (UNCHANGED_TECHNICAL.has(text)) return text;
  return COM001_TERMINOLOGY_REGISTRY_V1[text]?.[language] ?? text;
}

function unitText(text: string, language: "hi" | "pa") {
  return text
    .replace(/\bbits\b/gi, language === "hi" ? "बिट" : "ਬਿਟ")
    .replace(/\bbytes\b/gi, language === "hi" ? "बाइट" : "ਬਾਈਟ");
}

function translatedOption(text: string, language: "hi" | "pa") {
  const direct = term(text, language);
  if (direct !== text) return direct;
  if (/^[\d,]+\s+(?:bits|bytes)$/i.test(text)) return unitText(text, language);
  if (text === "None of the statements") {
    return language === "hi" ? "कोई भी कथन नहीं" : "ਕੋਈ ਵੀ ਕਥਨ ਨਹੀਂ";
  }
  const statementIds = text.match(/\b(?:IV|III|II|I)\b/g);
  if (statementIds?.length) {
    const joined = statementIds.length === 1
      ? statementIds[0]
      : statementIds.length === 2
        ? `${statementIds[0]} ${language === "hi" ? "और" : "ਅਤੇ"} ${statementIds[1]}`
        : `${statementIds.slice(0, -1).join(", ")} ${language === "hi" ? "और" : "ਅਤੇ"} ${statementIds.at(-1)}`;
    return language === "hi" ? `केवल ${joined}` : `ਕੇਵਲ ${joined}`;
  }
  return text;
}

function findFact(question: Com001ReviewQuestion, predicate: (fact: KnowledgeFact) => boolean) {
  for (const factId of question.sourceFactIds) {
    const fact = COM001_EDITORIALLY_APPROVED_FACTS.find((entry) => entry.factId === factId);
    if (fact && predicate(fact)) return fact;
  }
  return undefined;
}

function factEntityLabel(fact: KnowledgeFact, language: "hi" | "pa") {
  return term(fact.entity.label.en, language);
}

function valueText(value: KnowledgeFactValue, language: "hi" | "pa") {
  if (value.kind === "text") return term(value.text.en, language);
  if (value.kind === "entity_ref") return term(value.label.en, language);
  if (value.kind === "number") {
    const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value.value);
    const unit = value.unit ? unitText(value.unit, language) : "";
    return `${formatted} ${unit}`.trim();
  }
  if (value.kind === "date") return value.isoDate;
  return value.value ? (language === "hi" ? "सही" : "ਸਹੀ") : (language === "hi" ? "गलत" : "ਗਲਤ");
}

function targetFact(question: Com001ReviewQuestion) {
  if (question.qlId === "COM-001-QL-003") {
    return findFact(
      question,
      (fact) => fact.value.kind === "text" && fact.value.text.en === question.canonicalAnswer,
    );
  }
  if (question.qlId === "COM-001-QL-009") {
    return question.sourceFactIds.length
      ? COM001_EDITORIALLY_APPROVED_FACTS.find((fact) => fact.factId === question.sourceFactIds[0])
      : undefined;
  }
  return findFact(question, (fact) => fact.entity.label.en === question.canonicalAnswer);
}

function localizedStemSimple(
  question: Com001ReviewQuestion,
  language: "hi" | "pa",
  target: KnowledgeFact,
) {
  const entity = factEntityLabel(target, language);
  const en = question.stem;
  switch (question.qlId) {
    case "COM-001-QL-001": {
      const volatility = target.value.kind === "text" ? target.value.text.en : "";
      if (volatility === "volatile") {
        if (en.startsWith("Which of the following loses")) {
          return language === "hi"
            ? "निम्न में से किसकी संग्रहित सामग्री बिजली बंद होने पर नष्ट हो जाती है?"
            : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸਦੀ ਸੰਭਾਲੀ ਸਮੱਗਰੀ ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਤੇ ਮਿਟ ਜਾਂਦੀ ਹੈ?";
        }
        if (en.startsWith("Identify")) {
          return language === "hi"
            ? "निम्न विकल्पों में से वोलाटाइल मेमोरी पहचानिए।"
            : "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਵੋਲਾਟਾਈਲ ਮੈਮਰੀ ਪਛਾਣੋ।";
        }
        return language === "hi"
          ? "निम्न में से कौन-सी वोलाटाइल मेमोरी है?"
          : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਵੋਲਾਟਾਈਲ ਮੈਮਰੀ ਹੈ?";
      }
      if (en.startsWith("Which of the following can retain")) {
        return language === "hi"
          ? "निम्न में से कौन बिजली बंद होने पर भी संग्रहित डेटा बनाए रख सकता है?"
          : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਤੇ ਵੀ ਸੰਭਾਲਿਆ ਡਾਟਾ ਕਾਇਮ ਰੱਖ ਸਕਦਾ ਹੈ?";
      }
      if (en.startsWith("Identify")) {
        return language === "hi"
          ? "निम्न विकल्पों में से नॉन-वोलाटाइल मेमोरी या स्टोरेज डिवाइस पहचानिए।"
          : "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਨਾਨ-ਵੋਲਾਟਾਈਲ ਮੈਮਰੀ ਜਾਂ ਸਟੋਰੇਜ ਡਿਵਾਈਸ ਪਛਾਣੋ।";
      }
      return language === "hi"
        ? "निम्न में से कौन नॉन-वोलाटाइल है?"
        : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਾਨ-ਵੋਲਾਟਾਈਲ ਹੈ?";
    }
    case "COM-001-QL-002": {
      const layer = target.value.kind === "entity_ref" ? term(target.value.label.en, language) : "";
      if (en.startsWith("Which option belongs")) {
        return language === "hi"
          ? `कौन-सा विकल्प ${layer} से संबंधित है?`
          : `ਕਿਹੜਾ ਵਿਕਲਪ ${layer} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`;
      }
      if (en.startsWith("Identify")) {
        return language === "hi"
          ? `निम्न विकल्पों में से ${layer} वाला आइटम पहचानिए।`
          : `ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ${layer} ਵਾਲੀ ਆਈਟਮ ਪਛਾਣੋ।`;
      }
      return language === "hi"
        ? `निम्न में से किसे ${layer} के रूप में वर्गीकृत किया जाता है?`
        : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸਨੂੰ ${layer} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`;
    }
    case "COM-001-QL-003":
      if (en.startsWith("Which option best")) {
        return language === "hi"
          ? `कौन-सा विकल्प ${entity} के मुख्य उद्देश्य को सबसे सही बताता है?`
          : `ਕਿਹੜਾ ਵਿਕਲਪ ${entity} ਦੇ ਮੁੱਖ ਉਦੇਸ਼ ਨੂੰ ਸਭ ਤੋਂ ਠੀਕ ਦੱਸਦਾ ਹੈ?`;
      }
      if (en.includes("is primarily used")) {
        return language === "hi"
          ? `${entity} का मुख्य उपयोग निम्न में से किसके लिए होता है?`
          : `${entity} ਦੀ ਮੁੱਖ ਵਰਤੋਂ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਲਈ ਹੁੰਦੀ ਹੈ?`;
      }
      return language === "hi"
        ? `${entity} का मुख्य कार्य क्या है?`
        : `${entity} ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?`;
    case "COM-001-QL-004": {
      const parent = target.value.kind === "entity_ref" ? term(target.value.label.en, language) : "";
      if (en.startsWith("Which option belongs")) {
        return language === "hi"
          ? `कौन-सा विकल्प ${parent} परिवार से संबंधित है?`
          : `ਕਿਹੜਾ ਵਿਕਲਪ ${parent} ਪਰਿਵਾਰ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`;
      }
      if (en.startsWith("Identify")) {
        return language === "hi"
          ? `${parent} के अंतर्गत सही वर्गीकृत आइटम पहचानिए।`
          : `${parent} ਹੇਠ ਠੀਕ ਵਰਗੀਕ੍ਰਿਤ ਆਈਟਮ ਪਛਾਣੋ।`;
      }
      return language === "hi"
        ? `निम्न में से कौन ${parent} का एक प्रकार है?`
        : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ${parent} ਦੀ ਇੱਕ ਕਿਸਮ ਹੈ?`;
    }
    case "COM-001-QL-005": {
      const medium = target.value.kind === "text" ? term(target.value.text.en, language) : "";
      if (en.startsWith("Which option is")) {
        return language === "hi"
          ? `कौन-सा विकल्प ${medium} स्टोरेज डिवाइस या माध्यम है?`
          : `ਕਿਹੜਾ ਵਿਕਲਪ ${medium} ਸਟੋਰੇਜ ਡਿਵਾਈਸ ਜਾਂ ਮੀਡੀਆ ਹੈ?`;
      }
      if (en.startsWith("Identify")) {
        return language === "hi"
          ? `${medium} स्टोरेज विकल्प पहचानिए।`
          : `${medium} ਸਟੋਰੇਜ ਵਿਕਲਪ ਪਛਾਣੋ।`;
      }
      return language === "hi"
        ? `निम्न में से कौन ${medium} स्टोरेज तकनीक का उपयोग करता है?`
        : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ${medium} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ?`;
    }
    case "COM-001-QL-006": {
      const map: Record<string, TranslatedPair> = {
        "Which item is closest to the processor in the broad memory hierarchy?": {
          hi: "व्यापक मेमोरी पदानुक्रम में प्रोसेसर के सबसे निकट कौन-सा आइटम है?",
          pa: "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ ਪ੍ਰੋਸੈਸਰ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਕਿਹੜੀ ਆਈਟਮ ਹੈ?",
        },
        "Which item comes immediately below CPU registers in the broad memory hierarchy?": {
          hi: "व्यापक मेमोरी पदानुक्रम में CPU रजिस्टर के ठीक नीचे कौन-सा आइटम आता है?",
          pa: "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ CPU ਰਜਿਸਟਰਾਂ ਤੋਂ ਤੁਰੰਤ ਹੇਠਾਂ ਕਿਹੜੀ ਆਈਟਮ ਆਉਂਦੀ ਹੈ?",
        },
        "Which item comes immediately after cache in the broad memory hierarchy?": {
          hi: "व्यापक मेमोरी पदानुक्रम में कैश के तुरंत बाद कौन-सा आइटम आता है?",
          pa: "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ ਕੈਸ਼ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਕਿਹੜੀ ਆਈਟਮ ਆਉਂਦੀ ਹੈ?",
        },
        "Which item is farthest from the processor in the broad memory hierarchy?": {
          hi: "व्यापक मेमोरी पदानुक्रम में प्रोसेसर से सबसे दूर कौन-सा आइटम है?",
          pa: "ਵਿਆਪਕ ਮੈਮਰੀ ਕ੍ਰਮ ਵਿੱਚ ਪ੍ਰੋਸੈਸਰ ਤੋਂ ਸਭ ਤੋਂ ਦੂਰ ਕਿਹੜੀ ਆਈਟਮ ਹੈ?",
        },
      };
      return map[en]?.[language] ?? en;
    }
    default:
      return en;
  }
}

function localizedExplanationSimple(
  question: Com001ReviewQuestion,
  language: "hi" | "pa",
  target: KnowledgeFact,
) {
  const entity = factEntityLabel(target, language);
  switch (question.qlId) {
    case "COM-001-QL-001": {
      const value = target.value.kind === "text" ? target.value.text.en : "";
      if (value === "volatile") {
        return language === "hi"
          ? `${entity} वोलाटाइल है, इसलिए अपनी सामग्री बनाए रखने के लिए इसे बिजली की आवश्यकता होती है। इसलिए ${entity} सही उत्तर है।`
          : `${entity} ਵੋਲਾਟਾਈਲ ਹੈ, ਇਸ ਲਈ ਆਪਣੀ ਸਮੱਗਰੀ ਕਾਇਮ ਰੱਖਣ ਲਈ ਇਸਨੂੰ ਬਿਜਲੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਇਸ ਲਈ ${entity} ਸਹੀ ਉੱਤਰ ਹੈ।`;
      }
      return language === "hi"
        ? `${entity} नॉन-वोलाटाइल है, इसलिए बिजली हटने पर भी इसका संग्रहित डेटा बना रहता है। इसलिए ${entity} सही उत्तर है।`
        : `${entity} ਨਾਨ-ਵੋਲਾਟਾਈਲ ਹੈ, ਇਸ ਲਈ ਬਿਜਲੀ ਹਟਣ ਤੇ ਵੀ ਇਸਦਾ ਸੰਭਾਲਿਆ ਡਾਟਾ ਕਾਇਮ ਰਹਿੰਦਾ ਹੈ। ਇਸ ਲਈ ${entity} ਸਹੀ ਉੱਤਰ ਹੈ।`;
    }
    case "COM-001-QL-002": {
      const layer = target.value.kind === "entity_ref" ? term(target.value.label.en, language) : "";
      return language === "hi"
        ? `${entity} को ${layer} के रूप में वर्गीकृत किया जाता है। अन्य विकल्प मेमोरी या स्टोरेज की अलग श्रेणियों से संबंधित हैं।`
        : `${entity} ਨੂੰ ${layer} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਹੋਰ ਵਿਕਲਪ ਮੈਮਰੀ ਜਾਂ ਸਟੋਰੇਜ ਦੀਆਂ ਵੱਖਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।`;
    }
    case "COM-001-QL-003": {
      const functionText = target.value.kind === "text" ? term(target.value.text.en, language) : "";
      return language === "hi"
        ? `${entity} ${functionText}। इसलिए यही विकल्प इसके मुख्य कार्य को सही बताता है।`
        : `${entity} ${functionText}। ਇਸ ਲਈ ਇਹੀ ਵਿਕਲਪ ਇਸਦਾ ਮੁੱਖ ਕੰਮ ਠੀਕ ਦੱਸਦਾ ਹੈ।`;
    }
    case "COM-001-QL-004": {
      const parent = target.value.kind === "entity_ref" ? term(target.value.label.en, language) : "";
      return language === "hi"
        ? `${entity}, ${parent} परिवार का हिस्सा है। अन्य विकल्प अलग मेमोरी या स्टोरेज परिवारों से संबंधित हैं।`
        : `${entity}, ${parent} ਪਰਿਵਾਰ ਦਾ ਹਿੱਸਾ ਹੈ। ਹੋਰ ਵਿਕਲਪ ਵੱਖਰੇ ਮੈਮਰੀ ਜਾਂ ਸਟੋਰੇਜ ਪਰਿਵਾਰਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।`;
    }
    case "COM-001-QL-005": {
      const medium = target.value.kind === "text" ? term(target.value.text.en, language) : "";
      return language === "hi"
        ? `${entity} ${medium} स्टोरेज तकनीक का उपयोग करता है, इसलिए यह पूछे गए वर्गीकरण से मेल खाता है।`
        : `${entity} ${medium} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪੁੱਛੇ ਗਏ ਵਰਗੀਕਰਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`;
    }
    case "COM-001-QL-006":
      return language === "hi"
        ? `व्यापक क्रम है: CPU रजिस्टर → कैश → मुख्य मेमोरी (RAM) → द्वितीयक स्टोरेज। इसलिए ${entity} प्रश्न में पूछे गए स्थान पर आता है।`
        : `ਵਿਆਪਕ ਕ੍ਰਮ ਹੈ: CPU ਰਜਿਸਟਰ → ਕੈਸ਼ → ਮੁੱਖ ਮੈਮਰੀ (RAM) → ਸੈਕੰਡਰੀ ਸਟੋਰੇਜ। ਇਸ ਲਈ ${entity} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੇ ਗਏ ਸਥਾਨ ਤੇ ਆਉਂਦਾ ਹੈ।`;
    default:
      return question.explanation;
  }
}

const QL007_STEMS: Record<string, TranslatedPair> = {
  "Which storage option is magnetic, sequential-access, removable, and suited to both backup and archival use?": {
    hi: "कौन-सा स्टोरेज विकल्प चुंबकीय, क्रमिक-पहुँच वाला, हटाने योग्य और बैकअप तथा अभिलेखीय उपयोग दोनों के लिए उपयुक्त है?",
    pa: "ਕਿਹੜਾ ਸਟੋਰੇਜ ਵਿਕਲਪ ਚੁੰਬਕੀ, ਕ੍ਰਮਵਾਰ-ਪਹੁੰਚ ਵਾਲਾ, ਹਟਾਉਣਯੋਗ ਅਤੇ ਬੈਕਅੱਪ ਤੇ ਆਰਕਾਈਵ ਦੋਵਾਂ ਲਈ ਉਚਿਤ ਹੈ?",
  },
  "Which removable magnetic storage option provides random access and is used for both backup and recovery?": {
    hi: "कौन-सा हटाने योग्य चुंबकीय स्टोरेज विकल्प रैंडम पहुँच देता है और बैकअप तथा रिकवरी दोनों के लिए उपयोग होता है?",
    pa: "ਕਿਹੜਾ ਹਟਾਉਣਯੋਗ ਚੁੰਬਕੀ ਸਟੋਰੇਜ ਵਿਕਲਪ ਰੈਂਡਮ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ ਅਤੇ ਬੈਕਅੱਪ ਤੇ ਰਿਕਵਰੀ ਦੋਵਾਂ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
  },
  "Which removable optical option is intended for archival, write-once retention?": {
    hi: "कौन-सा हटाने योग्य ऑप्टिकल विकल्प अभिलेखीय, एक-बार-लिखकर सुरक्षित रखने के लिए बनाया गया है?",
    pa: "ਕਿਹੜਾ ਹਟਾਉਣਯੋਗ ਆਪਟੀਕਲ ਵਿਕਲਪ ਆਰਕਾਈਵ ਲਈ ਇੱਕ ਵਾਰ ਲਿਖ ਕੇ ਸੰਭਾਲਣ ਵਾਸਤੇ ਬਣਾਇਆ ਗਿਆ ਹੈ?",
  },
  "Which removable solid-state option supports random access and can be used as backup media?": {
    hi: "कौन-सा हटाने योग्य सॉलिड-स्टेट विकल्प रैंडम पहुँच देता है और बैकअप माध्यम के रूप में उपयोग किया जा सकता है?",
    pa: "ਕਿਹੜਾ ਹਟਾਉਣਯੋਗ ਸਾਲਿਡ-ਸਟੇਟ ਵਿਕਲਪ ਰੈਂਡਮ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ ਅਤੇ ਬੈਕਅੱਪ ਮੀਡੀਆ ਵਜੋਂ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
  },
};

function localizedQl007Explanation(question: Com001ReviewQuestion, language: "hi" | "pa") {
  const match = question.explanation.match(/^(.+) satisfies all the given conditions: (.+)\. Therefore, .+ is the correct answer\.$/);
  if (!match) return question.explanation;
  const label = term(match[1]!, language);
  const properties = match[2]!.split(", ").map((entry) => term(entry, language));
  return language === "hi"
    ? `${label} दी गई सभी शर्तें पूरी करता है: ${properties.join(", ")}। इसलिए ${label} सही उत्तर है।`
    : `${label} ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀ ਕਰਦਾ ਹੈ: ${properties.join(", ")}। ਇਸ ਲਈ ${label} ਸਹੀ ਉੱਤਰ ਹੈ।`;
}

function translatedStatement(statement: string, language: "hi" | "pa") {
  let match = statement.match(/^(.+) is (volatile|non-volatile)\.$/);
  if (match) {
    const entity = term(match[1]!, language);
    const value = term(match[2]!, language);
    return language === "hi" ? `${entity} ${value} है।` : `${entity} ${value} ਹੈ।`;
  }
  match = statement.match(/^(.+) is classified as (.+)\.$/);
  if (match) {
    const entity = term(match[1]!, language);
    const value = term(match[2]!, language);
    return language === "hi"
      ? `${entity} को ${value} के रूप में वर्गीकृत किया जाता है।`
      : `${entity} ਨੂੰ ${value} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
  }
  match = statement.match(/^(.+) is a subtype of (.+)\.$/);
  if (match) {
    const entity = term(match[1]!, language);
    const value = term(match[2]!, language);
    return language === "hi" ? `${entity}, ${value} का एक प्रकार है।` : `${entity}, ${value} ਦੀ ਇੱਕ ਕਿਸਮ ਹੈ।`;
  }
  match = statement.match(/^(.+) uses (magnetic|optical|solid-state) storage technology\.$/);
  if (match) {
    const entity = term(match[1]!, language);
    const medium = term(match[2]!, language);
    return language === "hi"
      ? `${entity} ${medium} स्टोरेज तकनीक का उपयोग करता है।`
      : `${entity} ${medium} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ।`;
  }
  match = statement.match(/^(.+) equals ([\d,]+) (bits|bytes)\.$/);
  if (match) {
    const entity = term(match[1]!, language);
    const amount = unitText(`${match[2]} ${match[3]}`, language);
    return language === "hi" ? `${entity} ${amount} के बराबर है।` : `${entity} ${amount} ਦੇ ਬਰਾਬਰ ਹੈ।`;
  }
  return statement;
}

function localizedQl008Stem(question: Com001ReviewQuestion, language: "hi" | "pa") {
  const lines = question.stem.split("\n");
  const localized = lines.map((line) => {
    if (line === "Consider the following statements:") {
      return language === "hi" ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:";
    }
    if (line === "Which of the above statements are correct?") {
      return language === "hi" ? "उपरोक्त में से कौन-से कथन सही हैं?" : "ਉਪਰੋਕਤ ਵਿੱਚੋਂ ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?";
    }
    const match = line.match(/^((?:IV|III|II|I))\.\s+(.+)$/);
    if (!match) return line;
    return `${match[1]}. ${translatedStatement(match[2]!, language)}`;
  });
  return localized.join("\n");
}

function trueStatementIds(canonicalAnswer: string) {
  if (canonicalAnswer === "None of the statements") return new Set<string>();
  return new Set(canonicalAnswer.match(/\b(?:IV|III|II|I)\b/g) ?? []);
}

function actualFactSentence(fact: KnowledgeFact, language: "hi" | "pa") {
  const entity = factEntityLabel(fact, language);
  const value = valueText(fact.value, language);
  switch (fact.relation) {
    case "has_volatility":
      return language === "hi" ? `${entity} ${value} है` : `${entity} ${value} ਹੈ`;
    case "classified_as_memory_layer":
      return language === "hi"
        ? `${entity} को ${value} के रूप में वर्गीकृत किया जाता है`
        : `${entity} ਨੂੰ ${value} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ`;
    case "is_subtype_of":
      return language === "hi" ? `${entity}, ${value} का एक प्रकार है` : `${entity}, ${value} ਦੀ ਇੱਕ ਕਿਸਮ ਹੈ`;
    case "uses_storage_medium":
      return language === "hi"
        ? `${entity} ${value} स्टोरेज तकनीक का उपयोग करता है`
        : `${entity} ${value} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ`;
    case "capacity_unit_relation":
      return language === "hi" ? `${entity} ${value} के बराबर है` : `${entity} ${value} ਦੇ ਬਰਾਬਰ ਹੈ`;
    default:
      return language === "hi" ? `${entity} का मान ${value} है` : `${entity} ਦਾ ਮਾਨ ${value} ਹੈ`;
  }
}

function localizedQl008Explanation(question: Com001ReviewQuestion, language: "hi" | "pa") {
  const trueIds = trueStatementIds(question.canonicalAnswer);
  const clauses = question.sourceFactIds.map((factId, index) => {
    const fact = COM001_EDITORIALLY_APPROVED_FACTS.find((entry) => entry.factId === factId);
    if (!fact) throw new Error(`Missing approved COM-001 localization fact ${factId}`);
    const id = ["I", "II", "III", "IV"][index]!;
    const correct = trueIds.has(id);
    if (language === "hi") {
      return `${id} ${correct ? "सही" : "गलत"} है क्योंकि ${actualFactSentence(fact, language)}।`;
    }
    return `${id} ${correct ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ ਕਿਉਂਕਿ ${actualFactSentence(fact, language)}।`;
  });
  const answer = translatedOption(question.canonicalAnswer, language);
  return language === "hi"
    ? `${clauses.join(" ")} इसलिए ${answer} सही हैं।`
    : `${clauses.join(" ")} ਇਸ ਲਈ ${answer} ਸਹੀ ਹਨ।`;
}

function localizedQl009Stem(question: Com001ReviewQuestion, language: "hi" | "pa") {
  const en = question.stem;
  if (/How many bits are there in one byte\?/i.test(en)) {
    return language === "hi" ? "एक बाइट में कितने बिट होते हैं?" : "ਇੱਕ ਬਾਈਟ ਵਿੱਚ ਕਿੰਨੇ ਬਿਟ ਹੁੰਦੇ ਹਨ?";
  }
  if (/One byte is equal to how many bits\?/i.test(en)) {
    return language === "hi" ? "एक बाइट कितने बिट के बराबर होता है?" : "ਇੱਕ ਬਾਈਟ ਕਿੰਨੇ ਬਿਟ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ?";
  }
  if (/Choose the correct bit-to-byte relation/i.test(en)) {
    return language === "hi" ? "बिट और बाइट का सही संबंध चुनिए।" : "ਬਿਟ ਅਤੇ ਬਾਈਟ ਦਾ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।";
  }
  let match = en.match(/^Using IEC binary prefixes, (.+) is equal to how many bytes\?$/);
  if (match) {
    return language === "hi"
      ? `IEC बाइनरी प्रीफिक्स के अनुसार ${match[1]} कितने बाइट के बराबर है?`
      : `IEC ਬਾਈਨਰੀ ਪ੍ਰੀਫਿਕਸ ਅਨੁਸਾਰ ${match[1]} ਕਿੰਨੇ ਬਾਈਟ ਦੇ ਬਰਾਬਰ ਹੈ?`;
  }
  match = en.match(/^Under the IEC binary-prefix convention, what is the value of (.+)\?$/);
  if (match) {
    return language === "hi"
      ? `IEC बाइनरी-प्रीफिक्स मानक के अनुसार ${match[1]} का मान क्या है?`
      : `IEC ਬਾਈਨਰੀ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${match[1]} ਦਾ ਮਾਨ ਕੀ ਹੈ?`;
  }
  match = en.match(/^Choose the correct byte value for (.+) under the binary-prefix convention\.$/);
  if (match) {
    return language === "hi"
      ? `बाइनरी-प्रीफिक्स मानक के अनुसार ${match[1]} का सही बाइट मान चुनिए।`
      : `ਬਾਈਨਰੀ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${match[1]} ਦਾ ਸਹੀ ਬਾਈਟ ਮਾਨ ਚੁਣੋ।`;
  }
  match = en.match(/^Using SI decimal prefixes, (.+) is equal to how many bytes\?$/);
  if (match) {
    return language === "hi"
      ? `SI दशमलव प्रीफिक्स के अनुसार ${match[1]} कितने बाइट के बराबर है?`
      : `SI ਦਸ਼ਮਲਵ ਪ੍ਰੀਫਿਕਸ ਅਨੁਸਾਰ ${match[1]} ਕਿੰਨੇ ਬਾਈਟ ਦੇ ਬਰਾਬਰ ਹੈ?`;
  }
  match = en.match(/^Under the SI decimal-prefix convention, what is the value of (.+)\?$/);
  if (match) {
    return language === "hi"
      ? `SI दशमलव-प्रीफिक्स मानक के अनुसार ${match[1]} का मान क्या है?`
      : `SI ਦਸ਼ਮਲਵ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${match[1]} ਦਾ ਮਾਨ ਕੀ ਹੈ?`;
  }
  match = en.match(/^Choose the correct byte value for (.+) under the decimal-prefix convention\.$/);
  if (match) {
    return language === "hi"
      ? `दशमलव-प्रीफिक्स मानक के अनुसार ${match[1]} का सही बाइट मान चुनिए।`
      : `ਦਸ਼ਮਲਵ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਅਨੁਸਾਰ ${match[1]} ਦਾ ਸਹੀ ਬਾਈਟ ਮਾਨ ਚੁਣੋ।`;
  }
  return en;
}

function localizedQl009Explanation(question: Com001ReviewQuestion, language: "hi" | "pa") {
  const fact = targetFact(question);
  if (!fact || fact.value.kind !== "number") return question.explanation;
  const label = fact.entity.label.en;
  const answer = unitText(question.canonicalAnswer, language);
  if (fact.value.unit === "bits") {
    return language === "hi"
      ? `एक बाइट में 8 बिट होते हैं। इसलिए ${label} = ${answer}।`
      : `ਇੱਕ ਬਾਈਟ ਵਿੱਚ 8 ਬਿਟ ਹੁੰਦੇ ਹਨ। ਇਸ ਲਈ ${label} = ${answer}।`;
  }
  if (/KiB|MiB|GiB/.test(label)) {
    return language === "hi"
      ? `${label} में IEC बाइनरी-प्रीफिक्स मानक लागू होता है। इसलिए ${label} = ${answer}।`
      : `${label} ਲਈ IEC ਬਾਈਨਰੀ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ਇਸ ਲਈ ${label} = ${answer}।`;
  }
  return language === "hi"
    ? `${label} में SI दशमलव-प्रीफिक्स मानक लागू होता है। इसलिए ${label} = ${answer}।`
    : `${label} ਲਈ SI ਦਸ਼ਮਲਵ-ਪ੍ਰੀਫਿਕਸ ਮਿਆਰ ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ਇਸ ਲਈ ${label} = ${answer}।`;
}

function localizedText(question: Com001ReviewQuestion, language: "hi" | "pa") {
  if ([
    "COM-001-QL-001",
    "COM-001-QL-002",
    "COM-001-QL-003",
    "COM-001-QL-004",
    "COM-001-QL-005",
    "COM-001-QL-006",
  ].includes(question.qlId)) {
    const target = targetFact(question);
    if (!target) throw new Error(`${question.questionId}: localization target fact missing`);
    return {
      stem: localizedStemSimple(question, language, target),
      explanation: localizedExplanationSimple(question, language, target),
    };
  }
  if (question.qlId === "COM-001-QL-007") {
    return {
      stem: QL007_STEMS[question.stem]?.[language] ?? question.stem,
      explanation: localizedQl007Explanation(question, language),
    };
  }
  if (question.qlId === "COM-001-QL-008") {
    return {
      stem: localizedQl008Stem(question, language),
      explanation: localizedQl008Explanation(question, language),
    };
  }
  if (question.qlId === "COM-001-QL-009") {
    return {
      stem: localizedQl009Stem(question, language),
      explanation: localizedQl009Explanation(question, language),
    };
  }
  throw new Error(`Unsupported COM-001 localization QL ${question.qlId}`);
}

export function localizeCom001ReviewQuestionV1(
  english: Com001ReviewQuestion,
  language: Com001LocalizationLanguageV1,
): Com001LocalizedReviewQuestionV1 {
  const localized = language === "en"
    ? { stem: english.stem, explanation: english.explanation }
    : localizedText(english, language);
  const options = language === "en"
    ? [...english.options]
    : english.options.map((option) => translatedOption(option, language));
  const canonicalAnswer = options[english.correctIndex]!;
  return {
    ...english,
    language,
    locale: locale(language),
    stem: localized.stem,
    options,
    canonicalAnswer,
    explanation: localized.explanation,
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
  const english = generateCom001ReviewQuestion({ qlId: input.qlId, seed: input.seed });
  return localizeCom001ReviewQuestionV1(english, input.language);
}
