import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com002-english-freeze-v1";
import {
  COM002_LOCALIZATION_DRAFT_AUTHORITY_V1,
  COM002_LOCALIZATION_VERSION_V1,
  COM002_TERMINOLOGY_REGISTRY_V1,
  localizeCom002LexemeV1,
  type Com002TargetLanguageV1,
} from "./com002-localization-lexicon-v1";
import { generateCom002ReviewQuestionV2 } from "./com002-review-synthesis-v2";
import type { Com002ReviewQuestion } from "./com002-review-types";

export type Com002LocalizationLocaleV1 = "hi-IN" | "pa-IN";

export type Com002LocalizedQuestionV1 = Omit<
  Com002ReviewQuestion,
  "questionId" | "stem" | "options" | "canonicalAnswer" | "explanation"
> & {
  questionId: string;
  language: Com002TargetLanguageV1;
  locale: Com002LocalizationLocaleV1;
  stem: string;
  options: string[];
  canonicalAnswer: string;
  explanation: string;
  localizationV1: {
    version: typeof COM002_LOCALIZATION_VERSION_V1;
    authority: typeof COM002_LOCALIZATION_DRAFT_AUTHORITY_V1;
    englishFreezeAuthorityId: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
    englishCombinedFingerprint: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint;
    englishQuestionId: string;
    semanticStateInvariant: true;
    qlInvariant: true;
    cpInvariant: true;
    surfaceModeInvariant: true;
    targetFactInvariant: true;
    sourceFactsInvariant: true;
    sourceAuthorityInvariant: true;
    solverAuthorityInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
  };
  lifecycleV1: {
    localizationReviewOnly: true;
    localizationFrozen: false;
    questionStudioActive: false;
    persistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  };
};

type SurfaceLexeme = Readonly<{ hi: string; pa: string }>;

const SURFACE_REGISTRY: Readonly<Record<string, SurfaceLexeme>> = Object.freeze({
  "Word processor": { hi: "वर्ड प्रोसेसर", pa: "ਵਰਡ ਪ੍ਰੋਸੈਸਰ" },
  "Web browser": { hi: "वेब ब्राउज़र", pa: "ਵੈੱਬ ਬ੍ਰਾਊਜ਼ਰ" },
  "Presentation software": { hi: "प्रेज़ेंटेशन सॉफ़्टवेयर", pa: "ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਸਾਫਟਵੇਅਰ" },
  "Spreadsheet software": { hi: "स्प्रेडशीट सॉफ़्टवेयर", pa: "ਸਪ੍ਰੈਡਸ਼ੀਟ ਸਾਫਟਵੇਅਰ" },
  "Creating presentation slides": { hi: "प्रेज़ेंटेशन स्लाइड बनाना", pa: "ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਸਲਾਈਡਾਂ ਬਣਾਉਣਾ" },
  "Editing a photograph": { hi: "फ़ोटो संपादित करना", pa: "ਫ਼ੋਟੋ ਸੰਪਾਦਿਤ ਕਰਨਾ" },
  "Writing a spreadsheet formula": { hi: "स्प्रेडशीट फ़ॉर्मूला लिखना", pa: "ਸਪ੍ਰੈਡਸ਼ੀਟ ਫਾਰਮੂਲਾ ਲਿਖਣਾ" },
  "Composing an email message": { hi: "ईमेल संदेश लिखना", pa: "ਈਮੇਲ ਸੁਨੇਹਾ ਲਿਖਣਾ" },
  "Managing hardware and applications by allocating system resources": { hi: "सिस्टम संसाधन आवंटित करके हार्डवेयर और एप्लिकेशन का प्रबंधन करना", pa: "ਸਿਸਟਮ ਸਰੋਤ ਵੰਡ ਕੇ ਹਾਰਡਵੇਅਰ ਅਤੇ ਐਪਲੀਕੇਸ਼ਨਾਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰਨਾ" },
  "Microsoft Excel": { hi: "Microsoft Excel", pa: "Microsoft Excel" },
  "Google Chrome": { hi: "Google Chrome", pa: "Google Chrome" },
  "Intel processor": { hi: "Intel प्रोसेसर", pa: "Intel ਪ੍ਰੋਸੈਸਰ" },
  "SQL language": { hi: "SQL भाषा", pa: "SQL ਭਾਸ਼ਾ" },
  "Adobe Photoshop": { hi: "Adobe Photoshop", pa: "Adobe Photoshop" },
  "Microsoft Word": { hi: "Microsoft Word", pa: "Microsoft Word" },
  "application software": { hi: "एप्लिकेशन सॉफ़्टवेयर", pa: "ਐਪਲੀਕੇਸ਼ਨ ਸਾਫਟਵੇਅਰ" },
  "device driver": { hi: "डिवाइस ड्राइवर", pa: "ਡਿਵਾਈਸ ਡਰਾਈਵਰ" },
  "mobile application": { hi: "मोबाइल एप्लिकेशन", pa: "ਮੋਬਾਈਲ ਐਪਲੀਕੇਸ਼ਨ" },
  "manages files and folders in Windows": { hi: "Windows में फ़ाइलों और फ़ोल्डरों का प्रबंधन करता है", pa: "Windows ਵਿੱਚ ਫ਼ਾਈਲਾਂ ਅਤੇ ਫ਼ੋਲਡਰਾਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰਦਾ ਹੈ" },
  "loads the operating system during startup": { hi: "स्टार्टअप के दौरान ऑपरेटिंग सिस्टम लोड करता है", pa: "ਸਟਾਰਟਅੱਪ ਦੌਰਾਨ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਲੋਡ ਕਰਦਾ ਹੈ" },
  "automatically converts the file into the new format": { hi: "फ़ाइल को अपने-आप नए फ़ॉर्मेट में बदल देता है", pa: "ਫ਼ਾਈਲ ਨੂੰ ਆਪਣੇ-ਆਪ ਨਵੇਂ ਫਾਰਮੈਟ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ" },
  "deletes the original file contents": { hi: "मूल फ़ाइल की सामग्री मिटा देता है", pa: "ਮੂਲ ਫ਼ਾਈਲ ਦੀ ਸਮੱਗਰੀ ਮਿਟਾ ਦਿੰਦਾ ਹੈ" },
  "compresses the file into an archive": { hi: "फ़ाइल को आर्काइव में कम्प्रेस करता है", pa: "ਫ਼ਾਈਲ ਨੂੰ ਆਰਕਾਈਵ ਵਿੱਚ ਕੰਪ੍ਰੈੱਸ ਕਰਦਾ ਹੈ" },
  "the folder in which the file is stored": { hi: "वह फ़ोल्डर जिसमें फ़ाइल संग्रहीत है", pa: "ਉਹ ਫ਼ੋਲਡਰ ਜਿਸ ਵਿੱਚ ਫ਼ਾਈਲ ਸੰਭਾਲੀ ਹੈ" },
  "the password used to open the file": { hi: "फ़ाइल खोलने के लिए उपयोग किया गया पासवर्ड", pa: "ਫ਼ਾਈਲ ਖੋਲ੍ਹਣ ਲਈ ਵਰਤਿਆ ਪਾਸਵਰਡ" },
  "the amount of free disk space": { hi: "खाली डिस्क स्थान की मात्रा", pa: "ਖਾਲੀ ਡਿਸਕ ਥਾਂ ਦੀ ਮਾਤਰਾ" },
  "deletes the selected file or folder": { hi: "चुनी गई फ़ाइल या फ़ोल्डर को डिलीट करता है", pa: "ਚੁਣੀ ਫ਼ਾਈਲ ਜਾਂ ਫ਼ੋਲਡਰ ਨੂੰ ਡਿਲੀਟ ਕਰਦਾ ਹੈ" },
  "moves the selected item to the Recycle Bin": { hi: "चुने गए आइटम को रीसायकल बिन में भेजता है", pa: "ਚੁਣੀ ਆਈਟਮ ਨੂੰ ਰੀਸਾਈਕਲ ਬਿਨ ਵਿੱਚ ਭੇਜਦਾ ਹੈ" },
  "renames the selected item": { hi: "चुने गए आइटम का नाम बदलता है", pa: "ਚੁਣੀ ਆਈਟਮ ਦਾ ਨਾਂ ਬਦਲਦਾ ਹੈ" },
  "opens the selected item's properties": { hi: "चुने गए आइटम की प्रॉपर्टीज़ खोलता है", pa: "ਚੁਣੀ ਆਈਟਮ ਦੀਆਂ ਪ੍ਰਾਪਰਟੀਜ਼ ਖੋਲ੍ਹਦਾ ਹੈ" },
  "permanently erases the item": { hi: "आइटम को स्थायी रूप से मिटाता है", pa: "ਆਈਟਮ ਨੂੰ ਸਥਾਈ ਤੌਰ ਤੇ ਮਿਟਾਉਂਦਾ ਹੈ" },
  "renames the item": { hi: "आइटम का नाम बदलता है", pa: "ਆਈਟਮ ਦਾ ਨਾਂ ਬਦਲਦਾ ਹੈ" },
  "compresses the item into an archive": { hi: "आइटम को आर्काइव में कम्प्रेस करता है", pa: "ਆਈਟਮ ਨੂੰ ਆਰਕਾਈਵ ਵਿੱਚ ਕੰਪ੍ਰੈੱਸ ਕਰਦਾ ਹੈ" },
});

function locale(language: Com002TargetLanguageV1): Com002LocalizationLocaleV1 {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function approvedFact(factId: string | null): KnowledgeFact | null {
  if (!factId) return null;
  return COM002_EDITORIALLY_APPROVED_FACTS.find((fact) => fact.factId === factId) ?? null;
}

function textValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId}: COM-002 localization requires a text value`);
  return fact.value.text.en;
}

function localizeExact(text: string, language: Com002TargetLanguageV1): string {
  const semantic = COM002_TERMINOLOGY_REGISTRY_V1[text]?.[language];
  if (semantic) return semantic;
  const surface = SURFACE_REGISTRY[text]?.[language];
  if (surface) return surface;

  if (text.startsWith("Managing ")) {
    const raw = text.slice("Managing ".length);
    const localizedRaw = localizeCom002LexemeV1(raw, language);
    return language === "hi" ? `${localizedRaw} का प्रबंधन करना` : `${localizedRaw} ਦਾ ਪ੍ਰਬੰਧ ਕਰਨਾ`;
  }

  const finiteForms: readonly [RegExp, string][] = [
    [/^provide\b/i, "provides"],
    [/^show\b/i, "shows"],
    [/^help\b/i, "helps"],
    [/^manage\b/i, "manages"],
    [/^accept\b/i, "accepts"],
    [/^use\b/i, "uses"],
    [/^allow\b/i, "allows"],
  ];
  for (const [pattern, finite] of finiteForms) {
    if (!pattern.test(text)) continue;
    const candidate = text.replace(pattern, finite);
    const localized = COM002_TERMINOLOGY_REGISTRY_V1[candidate]?.[language];
    if (localized) return localized;
  }

  throw new Error(`COM-002 learner-facing localization missing [${language}]: ${text}`);
}

function localizedComboLabel(text: string, language: Com002TargetLanguageV1) {
  if (text === "None of the statements") return language === "hi" ? "कोई भी कथन नहीं" : "ਕੋਈ ਵੀ ਕਥਨ ਨਹੀਂ";
  const ids = text.match(/\b(?:I|II|III|IV)\b/g) ?? [];
  if (ids.length === 0) throw new Error(`COM-002 combination option cannot be parsed: ${text}`);
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  const joined = ids.length === 1 ? ids[0]! : `${ids.slice(0, -1).join(", ")}${conjunction}${ids.at(-1)}`;
  if (text.includes("only")) return language === "hi" ? `केवल ${joined}` : `ਕੇਵਲ ${joined}`;
  return joined;
}

function localizeOption(text: string, language: Com002TargetLanguageV1, qlId: string) {
  if (qlId === "COM-002-QL-013") return localizedComboLabel(text, language);
  if (text.includes(" — ")) {
    return text.split(" — ").map((part) => localizeExact(part, language)).join(" — ");
  }
  return localizeExact(text, language);
}

function entity(fact: KnowledgeFact, language: Com002TargetLanguageV1) {
  return localizeCom002LexemeV1(fact.entity.label.en, language);
}

function value(fact: KnowledgeFact, language: Com002TargetLanguageV1) {
  return localizeCom002LexemeV1(textValue(fact), language);
}

function simpleText(
  english: Com002ReviewQuestion,
  fact: KnowledgeFact,
  language: Com002TargetLanguageV1,
): { stem: string; explanation: string } {
  const hi = language === "hi";
  const e = entity(fact, language);
  const v = value(fact, language);
  switch (english.qlId) {
    case "COM-002-QL-001":
      if (english.surfaceMode === "FUNCTION_TO_ENTITY") {
        return {
          stem: hi ? `निम्न कार्य से मुख्य रूप से कौन-सा सॉफ़्टवेयर संबंधित है: ${v}?` : `ਹੇਠਾਂ ਦਿੱਤੇ ਕੰਮ ਨਾਲ ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਹੜਾ ਸਾਫਟਵੇਅਰ ਸੰਬੰਧਿਤ ਹੈ: ${v}?`,
          explanation: hi ? `${e} यह कार्य करता है: ${v}। इसलिए ${e} सही उत्तर है।` : `${e} ਇਹ ਕੰਮ ਕਰਦਾ ਹੈ: ${v}। ਇਸ ਲਈ ${e} ਸਹੀ ਉੱਤਰ ਹੈ।`,
        };
      }
      return {
        stem: hi ? "ऑपरेटिंग-सिस्टम संसाधन प्रबंधन से संबंधित कार्य चुनिए।" : "ਓਪਰੇਟਿੰਗ-ਸਿਸਟਮ ਸਰੋਤ ਪ੍ਰਬੰਧਨ ਨਾਲ ਸੰਬੰਧਿਤ ਕੰਮ ਚੁਣੋ।",
        explanation: hi ? `${v} ऑपरेटिंग सिस्टम का कार्य है।` : `${v} ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।`,
      };
    case "COM-002-QL-002":
      if (english.surfaceMode === "OS_VS_NON_OS") {
        return {
          stem: hi ? "निम्न में से कौन-सा एक ऑपरेटिंग सिस्टम है?" : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਇੱਕ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਹੈ?",
          explanation: hi ? `${e} का वर्गीकरण ${v} के रूप में होता है।` : `${e} ਦਾ ਵਰਗੀਕਰਨ ${v} ਵਜੋਂ ਹੁੰਦਾ ਹੈ।`,
        };
      }
      if (english.surfaceMode === "OS_TO_LICENSE") {
        return {
          stem: hi ? `${e} का सही वर्गीकरण क्या है?` : `${e} ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਕੀ ਹੈ?`,
          explanation: hi ? `${e} एक ${v} है।` : `${e} ਇੱਕ ${v} ਹੈ।`,
        };
      }
      return {
        stem: hi ? `निम्न में से कौन-सा ${v} है?` : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ${v} ਹੈ?`,
        explanation: hi ? `${e} एक ${v} है।` : `${e} ਇੱਕ ${v} ਹੈ।`,
      };
    case "COM-002-QL-003":
      if (english.surfaceMode === "PROPERTY_TO_TYPE") {
        return {
          stem: hi ? `कौन-सा ऑपरेटिंग-सिस्टम प्रकार इस विशेषता से मेल खाता है: ${v}?` : `ਕਿਹੜੀ ਓਪਰੇਟਿੰਗ-ਸਿਸਟਮ ਕਿਸਮ ਇਸ ਵਿਸ਼ੇਸ਼ਤਾ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ: ${v}?`,
          explanation: hi ? `${e} ${v}। इसलिए यही सही प्रकार है।` : `${e} ${v}। ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਕਿਸਮ ਹੈ।`,
        };
      }
      return {
        stem: hi ? `${e} का सही वर्णन कौन-सा है?` : `${e} ਦਾ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?`,
        explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
      };
    case "COM-002-QL-004":
      if (english.surfaceMode === "ROLE_TO_COMPONENT" || english.surfaceMode === "CORE_COMPONENT") {
        return {
          stem: hi ? "कौन-सा ऑपरेटिंग-सिस्टम घटक कर्नेल की भूमिका से मेल खाता है?" : "ਕਿਹੜਾ ਓਪਰੇਟਿੰਗ-ਸਿਸਟਮ ਘਟਕ ਕਰਨਲ ਦੀ ਭੂਮਿਕਾ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ?",
          explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
        };
      }
      return {
        stem: hi ? "कर्नेल का सही वर्णन कौन-सा है?" : "ਕਰਨਲ ਦਾ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?",
        explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
      };
    case "COM-002-QL-005":
      if (english.surfaceMode === "PROPERTY_TO_INTERFACE") {
        return {
          stem: hi ? `कौन-सा इंटरफेस इस विशेषता से मेल खाता है: ${v}?` : `ਕਿਹੜਾ ਇੰਟਰਫੇਸ ਇਸ ਵਿਸ਼ੇਸ਼ਤਾ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ: ${v}?`,
          explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
        };
      }
      return {
        stem: hi ? `${e} का सही वर्णन कौन-सा है?` : `${e} ਦਾ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?`,
        explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
      };
    case "COM-002-QL-006":
      if (english.surfaceMode === "PROCESS_TO_TERM") {
        return {
          stem: hi ? `कौन-सी सिस्टम क्रिया यह काम करती है: ${v}?` : `ਕਿਹੜੀ ਸਿਸਟਮ ਕਾਰਵਾਈ ਇਹ ਕੰਮ ਕਰਦੀ ਹੈ: ${v}?`,
          explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
        };
      }
      return {
        stem: hi ? `Windows/बेसिक-कंप्यूटर संदर्भ में “${e}” का क्या अर्थ है?` : `Windows/ਬੇਸਿਕ-ਕੰਪਿਊਟਰ ਸੰਦਰਭ ਵਿੱਚ “${e}” ਦਾ ਕੀ ਅਰਥ ਹੈ?`,
        explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
      };
    case "COM-002-QL-007":
      if (english.surfaceMode === "FUNCTION_TO_COMPONENT") {
        return {
          stem: hi ? `कौन-सा Windows घटक या सेटिंग क्षेत्र इस कार्य से मेल खाता है: ${v}?` : `ਕਿਹੜਾ Windows ਘਟਕ ਜਾਂ ਸੈਟਿੰਗ ਖੇਤਰ ਇਸ ਕੰਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ: ${v}?`,
          explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
        };
      }
      return {
        stem: hi ? `${e} का मुख्य कार्य कौन-सा है?` : `${e} ਦਾ ਮੁੱਖ ਕੰਮ ਕਿਹੜਾ ਹੈ?`,
        explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
      };
    case "COM-002-QL-008":
      if (english.surfaceMode === "DEFINITION_TO_ITEM") {
        return {
          stem: hi ? `कौन-सा फ़ाइल-प्रबंधन आइटम इस वर्णन से मेल खाता है: ${v}?` : `ਕਿਹੜੀ ਫ਼ਾਈਲ-ਪ੍ਰਬੰਧਨ ਆਈਟਮ ਇਸ ਵਰਣਨ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ: ${v}?`,
          explanation: hi ? `${e}: ${v}।` : `${e}: ${v}।`,
        };
      }
      return {
        stem: hi ? `${e} का सही वर्णन कौन-सा है?` : `${e} ਦਾ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?`,
        explanation: hi ? `${e}: ${v}।` : `${e}: ${v}।`,
      };
    case "COM-002-QL-009":
      if (english.surfaceMode === "TYPE_TO_EXTENSION") {
        return {
          stem: hi ? `${v} से संबंधित फ़ाइल एक्सटेंशन कौन-सा है?` : `${v} ਨਾਲ ਸੰਬੰਧਿਤ ਫ਼ਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜਾ ਹੈ?`,
          explanation: hi ? `${e} का संबंध ${v} से है।` : `${e} ਦਾ ਸੰਬੰਧ ${v} ਨਾਲ ਹੈ।`,
        };
      }
      if (english.surfaceMode === "EXTENSION_TO_TYPE") {
        return {
          stem: hi ? `${e} एक्सटेंशन सामान्यतः किस फ़ाइल प्रकार से संबंधित है?` : `${e} ਐਕਸਟੈਂਸ਼ਨ ਆਮ ਤੌਰ ਤੇ ਕਿਹੜੀ ਫ਼ਾਈਲ ਕਿਸਮ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
          explanation: hi ? `${e} का संबंध ${v} से है।` : `${e} ਦਾ ਸੰਬੰਧ ${v} ਨਾਲ ਹੈ।`,
        };
      }
      if (english.surfaceMode === "MATCHED_PAIR") {
        return {
          stem: hi ? "कौन-सा फ़ाइल एक्सटेंशन और फ़ाइल-प्रकार युग्म सही मिला हुआ है?" : "ਕਿਹੜਾ ਫ਼ਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਅਤੇ ਫ਼ਾਈਲ-ਕਿਸਮ ਜੋੜਾ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?",
          explanation: hi ? `${e} का संबंध ${v} से है; इसलिए सही युग्म वही है।` : `${e} ਦਾ ਸੰਬੰਧ ${v} ਨਾਲ ਹੈ; ਇਸ ਲਈ ਸਹੀ ਜੋੜਾ ਉਹੀ ਹੈ।`,
        };
      }
      return {
        stem: hi ? (fact.relation === "extension_behavior" ? "फ़ाइल-नाम एक्सटेंशन बदलने के बारे में कौन-सा कथन सही है?" : "फ़ाइल एक्सटेंशन का सही वर्णन कौन-सा है?") : (fact.relation === "extension_behavior" ? "ਫ਼ਾਈਲ-ਨਾਂ ਐਕਸਟੈਂਸ਼ਨ ਬਦਲਣ ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?" : "ਫ਼ਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਦਾ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?"),
        explanation: hi ? `${e}: ${v}।` : `${e}: ${v}।`,
      };
    case "COM-002-QL-010":
      if (english.surfaceMode === "EFFECT_TO_ACTION") {
        return {
          stem: hi ? `कौन-सी फ़ाइल/फ़ोल्डर क्रिया यह प्रभाव देती है: ${v}?` : `ਕਿਹੜੀ ਫ਼ਾਈਲ/ਫ਼ੋਲਡਰ ਕਾਰਵਾਈ ਇਹ ਪ੍ਰਭਾਵ ਦਿੰਦੀ ਹੈ: ${v}?`,
          explanation: hi ? `${e} क्रिया ${v}।` : `${e} ਕਾਰਵਾਈ ${v}।`,
        };
      }
      return {
        stem: hi ? `${e} क्रिया का प्रभाव क्या है?` : `${e} ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਕੀ ਹੈ?`,
        explanation: hi ? `${e} क्रिया ${v}।` : `${e} ਕਾਰਵਾਈ ${v}।`,
      };
    case "COM-002-QL-011":
      if (english.surfaceMode === "DELETE_DESTINATION") {
        return {
          stem: hi ? "Windows में स्थानीय हार्ड-डिस्क से सामान्य रूप से डिलीट की गई फ़ाइल आम तौर पर कहाँ जाती है?" : "Windows ਵਿੱਚ ਸਥਾਨਕ ਹਾਰਡ-ਡਿਸਕ ਤੋਂ ਆਮ ਤੌਰ ਤੇ ਡਿਲੀਟ ਕੀਤੀ ਫ਼ਾਈਲ ਆਮ ਤੌਰ ਤੇ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?",
          explanation: hi ? `${e}: ${v}।` : `${e}: ${v}।`,
        };
      }
      if (english.surfaceMode === "PERMANENT_DELETE_BEHAVIOR") {
        return {
          stem: hi ? "Windows में चुने गए आइटम पर Shift+Delete क्या करता है?" : "Windows ਵਿੱਚ ਚੁਣੀ ਆਈਟਮ ਉੱਤੇ Shift+Delete ਕੀ ਕਰਦਾ ਹੈ?",
          explanation: hi ? `Shift+Delete ${v}।` : `Shift+Delete ${v}।`,
        };
      }
      return {
        stem: hi ? "Windows रीसायकल बिन में मौजूद आइटम के लिए Restore क्रिया का उद्देश्य क्या है?" : "Windows ਰੀਸਾਈਕਲ ਬਿਨ ਵਿੱਚ ਮੌਜੂਦ ਆਈਟਮ ਲਈ Restore ਕਾਰਵਾਈ ਦਾ ਉਦੇਸ਼ ਕੀ ਹੈ?",
        explanation: hi ? `${e} ${v}।` : `${e} ${v}।`,
      };
    case "COM-002-QL-012":
      if (english.surfaceMode === "SHORTCUT_TO_ACTION") {
        return {
          stem: hi ? `${e} Windows/फ़ाइल एक्सप्लोरर में क्या करता है?` : `${e} Windows/ਫ਼ਾਈਲ ਐਕਸਪਲੋਰਰ ਵਿੱਚ ਕੀ ਕਰਦਾ ਹੈ?`,
          explanation: hi ? `${e} का उपयोग ${v} के लिए किया जाता है।` : `${e} ਦੀ ਵਰਤੋਂ ${v} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
        };
      }
      if (english.surfaceMode === "ACTION_TO_SHORTCUT") {
        return {
          stem: hi ? `${v} के लिए कौन-सा शॉर्टकट उपयोग होता है?` : `${v} ਲਈ ਕਿਹੜਾ ਸ਼ਾਰਟਕੱਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
          explanation: hi ? `${e} का उपयोग ${v} के लिए किया जाता है।` : `${e} ਦੀ ਵਰਤੋਂ ${v} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
        };
      }
      return {
        stem: hi ? "कौन-सा Windows/फ़ाइल एक्सप्लोरर शॉर्टकट अपनी क्रिया से सही मिला हुआ है?" : "ਕਿਹੜਾ Windows/ਫ਼ਾਈਲ ਐਕਸਪਲੋਰਰ ਸ਼ਾਰਟਕੱਟ ਆਪਣੀ ਕਾਰਵਾਈ ਨਾਲ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?",
        explanation: hi ? `${e} का उपयोग ${v} के लिए किया जाता है; इसलिए वही सही युग्म है।` : `${e} ਦੀ ਵਰਤੋਂ ${v} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ; ਇਸ ਲਈ ਉਹੀ ਸਹੀ ਜੋੜਾ ਹੈ।`,
      };
    default:
      throw new Error(`${english.questionId}: unsupported COM-002 localization QL ${english.qlId}`);
  }
}

type ParsedStatement = { id: string; target: KnowledgeFact; claimedValue: string };

function parseQ13Statements(english: Com002ReviewQuestion): ParsedStatement[] {
  const candidateFacts = english.sourceFactIds
    .map((factId) => approvedFact(factId))
    .filter((fact): fact is KnowledgeFact => Boolean(fact));
  const lines = english.stem.split("\n").filter((line) => /^(I|II|III|IV)\./.test(line));
  return lines.map((line) => {
    const match = line.match(/^(I|II|III|IV)\.\s+(.+)$/);
    if (!match) throw new Error(`${english.questionId}: malformed QL-013 statement ${line}`);
    const id = match[1]!;
    const sentence = match[2]!;
    const targets = candidateFacts
      .filter((fact) => sentence.startsWith(fact.entity.label.en))
      .sort((a, b) => b.entity.label.en.length - a.entity.label.en.length);
    const target = targets[0];
    if (!target) throw new Error(`${english.questionId}: cannot resolve QL-013 target for ${sentence}`);
    const entityText = target.entity.label.en;
    let claimedValue: string;
    if (["software_classification", "license_class"].includes(target.relation)) {
      claimedValue = sentence.slice(`${entityText} is classified as `.length).replace(/\.$/, "");
    } else if (target.relation === "extension_file_type") {
      claimedValue = sentence.slice(`${entityText} is associated with `.length).replace(/\.$/, "");
    } else if (target.relation === "shortcut_action") {
      claimedValue = sentence.slice(`${entityText} is used to `.length).replace(/\.$/, "");
    } else if (target.relation === "os_type_property") {
      claimedValue = sentence.slice(entityText.length).trim().replace(/\.$/, "");
    } else {
      throw new Error(`${english.questionId}: unsupported QL-013 relation ${target.relation}`);
    }
    return { id, target, claimedValue };
  });
}

function statementText(statement: ParsedStatement, language: Com002TargetLanguageV1, actual = false) {
  const hi = language === "hi";
  const e = entity(statement.target, language);
  const rawValue = actual ? textValue(statement.target) : statement.claimedValue;
  const v = localizeExact(rawValue, language);
  switch (statement.target.relation) {
    case "software_classification":
    case "license_class":
      return hi ? `${e} को ${v} के रूप में वर्गीकृत किया गया है।` : `${e} ਨੂੰ ${v} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਗਿਆ ਹੈ।`;
    case "os_type_property":
      return `${e} ${v}।`;
    case "extension_file_type":
      return hi ? `${e} का संबंध ${v} से है।` : `${e} ਦਾ ਸੰਬੰਧ ${v} ਨਾਲ ਹੈ।`;
    case "shortcut_action":
      return hi ? `${e} का उपयोग ${v} के लिए किया जाता है।` : `${e} ਦੀ ਵਰਤੋਂ ${v} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`;
    default:
      throw new Error(`Unsupported COM-002 QL-013 statement relation ${statement.target.relation}`);
  }
}

function trueStatementIds(canonicalAnswer: string) {
  if (canonicalAnswer === "None of the statements") return new Set<string>();
  return new Set(canonicalAnswer.match(/\b(?:I|II|III|IV)\b/g) ?? []);
}

function q13Text(english: Com002ReviewQuestion, language: Com002TargetLanguageV1) {
  const hi = language === "hi";
  const statements = parseQ13Statements(english);
  const stem = [
    hi ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
    ...statements.map((statement) => `${statement.id}. ${statementText(statement, language)}`),
    hi ? "उपरोक्त में से कौन-से कथन सही हैं?" : "ਉਪਰੋਕਤ ਵਿੱਚੋਂ ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?",
  ].join("\n");
  const trueIds = trueStatementIds(english.canonicalAnswer);
  const explanation = statements.map((statement) => {
    const isTrue = trueIds.has(statement.id);
    if (isTrue) {
      return hi
        ? `${statement.id} सही है। ${statementText(statement, language, true)}`
        : `${statement.id} ਸਹੀ ਹੈ। ${statementText(statement, language, true)}`;
    }
    return hi
      ? `${statement.id} गलत है। सही तथ्य: ${statementText(statement, language, true)}`
      : `${statement.id} ਗਲਤ ਹੈ। ਸਹੀ ਤੱਥ: ${statementText(statement, language, true)}`;
  }).join(" ");
  const answer = localizedComboLabel(english.canonicalAnswer, language);
  return {
    stem,
    explanation: hi ? `${explanation} इसलिए ${answer} सही उत्तर है।` : `${explanation} ਇਸ ਲਈ ${answer} ਸਹੀ ਉੱਤਰ ਹੈ।`,
  };
}

export function localizeCom002QuestionV1(input: {
  qlId: string;
  seed: string;
  language: Com002TargetLanguageV1;
}): Com002LocalizedQuestionV1 {
  const english = generateCom002ReviewQuestionV2({ qlId: input.qlId, seed: input.seed });
  const options = english.options.map((option) => localizeOption(option, input.language, english.qlId));
  const canonicalAnswer = localizeOption(english.canonicalAnswer, input.language, english.qlId);
  const text = english.qlId === "COM-002-QL-013"
    ? q13Text(english, input.language)
    : simpleText(english, approvedFact(english.targetFactId) ?? (() => { throw new Error(`${english.questionId}: localization target fact is missing`); })(), input.language);

  assertKnowledgeQuestionValid({
    stem: text.stem,
    explanation: text.explanation,
    options,
    correctIndex: english.correctIndex,
    canonicalAnswer,
  });

  return {
    ...english,
    questionId: `${english.questionId}-${input.language.toUpperCase()}`,
    language: input.language,
    locale: locale(input.language),
    stem: text.stem,
    options,
    correctIndex: english.correctIndex,
    canonicalAnswer,
    explanation: text.explanation,
    localizationV1: {
      version: COM002_LOCALIZATION_VERSION_V1,
      authority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V1,
      englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
      englishQuestionId: english.questionId,
      semanticStateInvariant: true,
      qlInvariant: true,
      cpInvariant: true,
      surfaceModeInvariant: true,
      targetFactInvariant: true,
      sourceFactsInvariant: true,
      sourceAuthorityInvariant: true,
      solverAuthorityInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
    },
    lifecycleV1: {
      localizationReviewOnly: true,
      localizationFrozen: false,
      questionStudioActive: false,
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };
}
