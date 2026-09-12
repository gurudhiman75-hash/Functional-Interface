import { COM001_EDITORIALLY_APPROVED_FACTS } from "./com001-editorial-review";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com001-english-freeze-v2";
import {
  COM001_TERMINOLOGY_REGISTRY_V1,
  localizeCom001ReviewQuestionV1,
  type Com001LocalizationLanguageV1,
} from "./com001-localization-v1";
import {
  generateCom001ReviewQuestionV2,
  type Com001ReviewV2Question,
} from "./com001-review-synthesis-v2";

export const COM001_LOCALIZATION_VERSION_V2 = "COM-001-LOCALIZATION-V2" as const;
export const COM001_LOCALIZATION_AUTHORITY_DRAFT_V2 =
  "COM001_HI_PA_LOCALIZATION_REVIEW_V2" as const;

export type Com001LocalizationLanguageV2 = Com001LocalizationLanguageV1;
export type Com001LocalizationLocaleV2 = "en-IN" | "hi-IN" | "pa-IN";
type TargetLanguage = Exclude<Com001LocalizationLanguageV2, "en">;

export type Com001LocalizedReviewQuestionV2 = Omit<
  Com001ReviewV2Question,
  "stem" | "options" | "canonicalAnswer" | "explanation"
> & {
  language: Com001LocalizationLanguageV2;
  locale: Com001LocalizationLocaleV2;
  stem: string;
  options: string[];
  canonicalAnswer: string;
  explanation: string;
  localizationV2: {
    version: typeof COM001_LOCALIZATION_VERSION_V2;
    authority: typeof COM001_LOCALIZATION_AUTHORITY_DRAFT_V2;
    englishFreezeAuthorityId: typeof COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId;
    englishQuestionId: string;
    semanticStateInvariant: true;
    qlInvariant: true;
    sourceFactsInvariant: true;
    sourceAuthorityInvariant: true;
    solverAuthorityInvariant: true;
    reviewV2ModeInvariant: true;
    relationalSurfaceModeInvariant: true;
    capacityConventionInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
  };
  lifecycleV2: {
    localizationReviewOnly: true;
    localizationFrozen: false;
    questionStudioV2Active: false;
    persistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  };
};

function locale(language: Com001LocalizationLanguageV2): Com001LocalizationLocaleV2 {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function tr(text: string, language: TargetLanguage) {
  const registered = COM001_TERMINOLOGY_REGISTRY_V1[text]?.[language];
  if (registered) return registered;
  return text
    .replace(/\bbytes\b/gu, language === "hi" ? "बाइट" : "ਬਾਈਟ")
    .replace(/\bbits\b/gu, language === "hi" ? "बिट" : "ਬਿਟ");
}

function translateOption(option: string, language: TargetLanguage) {
  if (option.includes(" — ")) {
    return option.split(" — ").map((part) => tr(part, language)).join(" — ");
  }
  return tr(option, language);
}

function approvedFact(factId: string) {
  const fact = COM001_EDITORIALLY_APPROVED_FACTS.find((entry) => entry.factId === factId);
  if (!fact) throw new Error(`COM-001 V2 localization cannot resolve approved fact ${factId}`);
  return fact;
}

function factEntity(factId: string, language: TargetLanguage) {
  return tr(approvedFact(factId).entity.label.en, language);
}

function factValue(factId: string, language: TargetLanguage) {
  const fact = approvedFact(factId);
  if (fact.value.kind === "text") return tr(fact.value.text.en, language);
  if (fact.value.kind === "entity_ref") return tr(fact.value.label.en, language);
  throw new Error(`COM-001 V2 localization expected text/entity value for ${factId}`);
}

function canDelegateToV1(question: Com001ReviewV2Question) {
  if (["COM-001-QL-006", "COM-001-QL-008"].includes(question.qlId)) return true;
  if (question.qlId === "COM-001-QL-009") return question.capacityConvention === "SI_IEC_EXPLICIT";
  return [
    "ENTITY_SELECTION",
    "LAYER_TO_ENTITY",
    "COMPONENT_TO_FUNCTION",
    "PARENT_TO_ENTITY",
    "MEDIUM_TO_ENTITY",
  ].includes(question.relationalSurfaceMode ?? "");
}

function relationalText(
  question: Com001ReviewV2Question,
  language: TargetLanguage,
) {
  const hi = language === "hi";
  const factId = question.sourceFactIds[0];
  if (!factId) throw new Error(`${question.questionId}: V2 relational localization needs target fact`);
  const entity = factEntity(factId, language);
  const value = factValue(factId, language);

  if (question.qlId === "COM-001-QL-001" && question.relationalSurfaceMode === "MATCHED_PAIR") {
    return {
      stem: hi
        ? "निम्न में से कौन-सा मेमोरी/स्टोरेज आइटम अपनी वोलाटिलिटी श्रेणी से सही मिलान किया गया है?"
        : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਮੈਮਰੀ/ਸਟੋਰੇਜ ਆਈਟਮ ਆਪਣੀ ਵੋਲਾਟਿਲਿਟੀ ਸ਼੍ਰੇਣੀ ਨਾਲ ਠੀਕ ਮਿਲਾਈ ਗਈ ਹੈ?",
      explanation: hi
        ? `${entity} ${value} है। इसलिए ${translateOption(question.canonicalAnswer, language)} सही मिलान है।`
        : `${entity} ${value} ਹੈ। ਇਸ ਲਈ ${translateOption(question.canonicalAnswer, language)} ਠੀਕ ਮਿਲਾਨ ਹੈ।`,
    };
  }

  if (question.qlId === "COM-001-QL-002" && question.relationalSurfaceMode === "ENTITY_TO_LAYER") {
    return {
      stem: hi
        ? `${entity} को व्यापक मेमोरी/स्टोरेज पदानुक्रम में किस श्रेणी में रखा जाता है?`
        : `${entity} ਨੂੰ ਵਿਆਪਕ ਮੈਮਰੀ/ਸਟੋਰੇਜ ਕ੍ਰਮ ਵਿੱਚ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ?`,
      explanation: hi
        ? `${entity} का सही वर्गीकरण ${value} है। इसलिए ${value} सही उत्तर है।`
        : `${entity} ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ${value} ਹੈ। ਇਸ ਲਈ ${value} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }

  if (question.qlId === "COM-001-QL-003" && question.relationalSurfaceMode === "FUNCTION_TO_COMPONENT") {
    return {
      stem: hi
        ? `उस घटक को पहचानिए जिसका मुख्य कार्य यह है: ${value}।`
        : `ਉਸ ਘਟਕ ਨੂੰ ਪਛਾਣੋ ਜਿਸਦਾ ਮੁੱਖ ਕੰਮ ਇਹ ਹੈ: ${value}।`,
      explanation: hi
        ? `${entity} का मुख्य कार्य है: ${value}। इसलिए ${entity} सही उत्तर है।`
        : `${entity} ਦਾ ਮੁੱਖ ਕੰਮ ਹੈ: ${value}। ਇਸ ਲਈ ${entity} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }

  if (question.qlId === "COM-001-QL-004" && question.relationalSurfaceMode === "ENTITY_TO_PARENT") {
    return {
      stem: hi
        ? `${entity} निम्न में से किस परिवार या स्टोरेज-प्रौद्योगिकी श्रेणी का प्रकार है?`
        : `${entity} ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੇ ਪਰਿਵਾਰ ਜਾਂ ਸਟੋਰੇਜ-ਤਕਨਾਲੋਜੀ ਵਰਗ ਦੀ ਕਿਸਮ ਹੈ?`,
      explanation: hi
        ? `${entity} की सही मूल श्रेणी ${value} है। इसलिए ${value} सही उत्तर है।`
        : `${entity} ਦੀ ਸਹੀ ਮੁੱਖ ਸ਼੍ਰੇਣੀ ${value} ਹੈ। ਇਸ ਲਈ ${value} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }

  if (question.qlId === "COM-001-QL-005" && question.relationalSurfaceMode === "MATCHED_PAIR") {
    return {
      stem: hi
        ? "निम्न में से कौन-सा स्टोरेज डिवाइस–प्रौद्योगिकी युग्म सही मिलान किया गया है?"
        : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਟੋਰੇਜ ਡਿਵਾਈਸ–ਤਕਨਾਲੋਜੀ ਜੋੜਾ ਠੀਕ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?",
      explanation: hi
        ? `${entity} ${value} स्टोरेज तकनीक का उपयोग करता है। इसलिए ${translateOption(question.canonicalAnswer, language)} सही मिलान है।`
        : `${entity} ${value} ਸਟੋਰੇਜ ਤਕਨਾਲੋਜੀ ਵਰਤਦਾ ਹੈ। ਇਸ ਲਈ ${translateOption(question.canonicalAnswer, language)} ਠੀਕ ਮਿਲਾਨ ਹੈ।`,
    };
  }

  throw new Error(`${question.questionId}: unsupported V2 relational localization surface`);
}

function ql007Text(question: Com001ReviewV2Question, language: TargetLanguage) {
  const hi = language === "hi";
  const answer = translateOption(question.canonicalAnswer, language);
  if (question.canonicalAnswer === "Magnetic tape") {
    return {
      stem: hi
        ? "कौन-सा स्टोरेज माध्यम क्रमिक पहुँच का उपयोग करता है और सामान्यतः बैकअप तथा अभिलेखीय स्टोरेज के लिए प्रयोग होता है?"
        : "ਕਿਹੜਾ ਸਟੋਰੇਜ ਮੀਡੀਆ ਕ੍ਰਮਵਾਰ ਪਹੁੰਚ ਵਰਤਦਾ ਹੈ ਅਤੇ ਆਮ ਤੌਰ ਤੇ ਬੈਕਅੱਪ ਅਤੇ ਆਰਕਾਈਵ ਸਟੋਰੇਜ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      explanation: hi
        ? `${answer} क्रमिक-पहुँच वाला चुंबकीय स्टोरेज है जिसका उपयोग सामान्यतः बैकअप और अभिलेखन के लिए होता है। इसलिए ${answer} सही उत्तर है।`
        : `${answer} ਕ੍ਰਮਵਾਰ-ਪਹੁੰਚ ਵਾਲਾ ਚੁੰਬਕੀ ਸਟੋਰੇਜ ਹੈ ਜੋ ਆਮ ਤੌਰ ਤੇ ਬੈਕਅੱਪ ਅਤੇ ਆਰਕਾਈਵ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ${answer} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }
  if (question.canonicalAnswer === "WORM optical media") {
    return {
      stem: hi
        ? "कौन-सा ऑप्टिकल स्टोरेज माध्यम एक बार लिखकर अभिलेखीय रूप से सुरक्षित रखने के लिए बनाया गया है?"
        : "ਕਿਹੜਾ ਆਪਟੀਕਲ ਸਟੋਰੇਜ ਮੀਡੀਆ ਇੱਕ ਵਾਰ ਲਿਖ ਕੇ ਆਰਕਾਈਵ ਵਜੋਂ ਸੰਭਾਲਣ ਲਈ ਬਣਾਇਆ ਗਿਆ ਹੈ?",
      explanation: hi
        ? `${answer} एक-बार-लिखने और अभिलेखीय उपयोग के लिए बनाया गया ऑप्टिकल माध्यम है। इसलिए ${answer} सही उत्तर है।`
        : `${answer} ਇੱਕ ਵਾਰ ਲਿਖਣ ਅਤੇ ਆਰਕਾਈਵ ਵਰਤੋਂ ਲਈ ਬਣਾਇਆ ਗਿਆ ਆਪਟੀਕਲ ਮੀਡੀਆ ਹੈ। ਇਸ ਲਈ ${answer} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }
  if (question.canonicalAnswer === "USB flash drive") {
    return {
      stem: hi
        ? "कौन-सा हटाने योग्य सॉलिड-स्टेट स्टोरेज डिवाइस रैंडम पहुँच देता है और पोर्टेबल बैकअप प्रतियां रखने के लिए उपयोग किया जा सकता है?"
        : "ਕਿਹੜਾ ਹਟਾਉਣਯੋਗ ਸਾਲਿਡ-ਸਟੇਟ ਸਟੋਰੇਜ ਡਿਵਾਈਸ ਰੈਂਡਮ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ ਅਤੇ ਪੋਰਟੇਬਲ ਬੈਕਅੱਪ ਕਾਪੀਆਂ ਰੱਖਣ ਲਈ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
      explanation: hi
        ? `${answer} हटाने योग्य सॉलिड-स्टेट स्टोरेज है, रैंडम पहुँच देता है और पोर्टेबल बैकअप के लिए उपयोग किया जा सकता है। इसलिए ${answer} सही उत्तर है।`
        : `${answer} ਹਟਾਉਣਯੋਗ ਸਾਲਿਡ-ਸਟੇਟ ਸਟੋਰੇਜ ਹੈ, ਰੈਂਡਮ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ ਅਤੇ ਪੋਰਟੇਬਲ ਬੈਕਅੱਪ ਲਈ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ। ਇਸ ਲਈ ${answer} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }
  throw new Error(`${question.questionId}: unknown QL-007 V2 answer`);
}

function ql009ExamText(question: Com001ReviewV2Question, language: TargetLanguage) {
  const hi = language === "hi";
  const en = question.stem;
  let stem: string;
  if (/How many bits are there in one byte\?/iu.test(en)) {
    stem = hi ? "एक बाइट में कितने बिट होते हैं?" : "ਇੱਕ ਬਾਈਟ ਵਿੱਚ ਕਿੰਨੇ ਬਿਟ ਹੁੰਦੇ ਹਨ?";
  } else if (/One byte is equal to how many bits\?/iu.test(en)) {
    stem = hi ? "एक बाइट कितने बिट के बराबर होता है?" : "ਇੱਕ ਬਾਈਟ ਕਿੰਨੇ ਬਿਟ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ?";
  } else if (/^1 KB is equal to how many bytes\?$/u.test(en)) {
    stem = hi ? "1 KB कितने बाइट के बराबर है?" : "1 KB ਕਿੰਨੇ ਬਾਈਟ ਦੇ ਬਰਾਬਰ ਹੈ?";
  } else if (/^How many bytes are there in 1 KB\?$/u.test(en)) {
    stem = hi ? "1 KB में कितने बाइट होते हैं?" : "1 KB ਵਿੱਚ ਕਿੰਨੇ ਬਾਈਟ ਹੁੰਦੇ ਹਨ?";
  } else if (/^1 MB is equal to how many KB\?$/u.test(en)) {
    stem = hi ? "1 MB कितने KB के बराबर है?" : "1 MB ਕਿੰਨੇ KB ਦੇ ਬਰਾਬਰ ਹੈ?";
  } else if (/^1 MB consists of 1024 ______\.$/u.test(en)) {
    stem = hi ? "1 MB में 1024 ______ होते हैं।" : "1 MB ਵਿੱਚ 1024 ______ ਹੁੰਦੇ ਹਨ।";
  } else if (/^1 GB is equal to how many MB\?$/u.test(en)) {
    stem = hi ? "1 GB कितने MB के बराबर है?" : "1 GB ਕਿੰਨੇ MB ਦੇ ਬਰਾਬਰ ਹੈ?";
  } else if (/^How many MB are there in 1 GB\?$/u.test(en)) {
    stem = hi ? "1 GB में कितने MB होते हैं?" : "1 GB ਵਿੱਚ ਕਿੰਨੇ MB ਹੁੰਦੇ ਹਨ?";
  } else if (/^1 TB is equal to how many GB\?$/u.test(en)) {
    stem = hi ? "1 TB कितने GB के बराबर है?" : "1 TB ਕਿੰਨੇ GB ਦੇ ਬਰਾਬਰ ਹੈ?";
  } else if (/^How many GB are there in 1 TB\?$/u.test(en)) {
    stem = hi ? "1 TB में कितने GB होते हैं?" : "1 TB ਵਿੱਚ ਕਿੰਨੇ GB ਹੁੰਦੇ ਹਨ?";
  } else {
    throw new Error(`${question.questionId}: unsupported QL-009 exam stem`);
  }

  const answer = translateOption(question.canonicalAnswer, language);
  if (question.sourceFactIds.includes("com001-exam-byte-bits")) {
    return {
      stem,
      explanation: hi
        ? `एक बाइट में 8 बिट होते हैं। इसलिए ${answer} सही उत्तर है।`
        : `ਇੱਕ ਬਾਈਟ ਵਿੱਚ 8 ਬਿਟ ਹੁੰਦੇ ਹਨ। ਇਸ ਲਈ ${answer} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }
  const relation = question.explanation.match(/competitive exams, (.+)\. Therefore/u)?.[1];
  if (!relation) throw new Error(`${question.questionId}: QL-009 exam relation missing`);
  return {
    stem,
    explanation: hi
      ? `प्रतियोगी परीक्षाओं में प्रयुक्त पारंपरिक 1024-आधारित मान के अनुसार ${tr(relation, language)}। इसलिए ${answer} सही उत्तर है।`
      : `ਮੁਕਾਬਲੇ ਦੀਆਂ ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਵਰਤੇ ਜਾਂਦੇ ਰਵਾਇਤੀ 1024-ਅਧਾਰਿਤ ਮਾਨ ਅਨੁਸਾਰ ${tr(relation, language)}। ਇਸ ਲਈ ${answer} ਸਹੀ ਉੱਤਰ ਹੈ।`,
  };
}

function customText(question: Com001ReviewV2Question, language: TargetLanguage) {
  if (question.qlId === "COM-001-QL-007") return ql007Text(question, language);
  if (question.qlId === "COM-001-QL-009" && question.capacityConvention === "TRADITIONAL_EXAM_1024") {
    return ql009ExamText(question, language);
  }
  return relationalText(question, language);
}

export function localizeCom001ReviewQuestionV2(
  english: Com001ReviewV2Question,
  language: Com001LocalizationLanguageV2,
): Com001LocalizedReviewQuestionV2 {
  let stem = english.stem;
  let explanation = english.explanation;
  let options = [...english.options];

  if (language !== "en") {
    if (canDelegateToV1(english)) {
      const delegated = localizeCom001ReviewQuestionV1(english, language);
      stem = delegated.stem;
      explanation = delegated.explanation;
      options = [...delegated.options];
    } else {
      const localized = customText(english, language);
      stem = localized.stem;
      explanation = localized.explanation;
      options = english.options.map((option) => translateOption(option, language));
    }
  }

  return {
    ...english,
    language,
    locale: locale(language),
    stem,
    options,
    correctIndex: english.correctIndex,
    canonicalAnswer: options[english.correctIndex]!,
    explanation,
    localizationV2: {
      version: COM001_LOCALIZATION_VERSION_V2,
      authority: COM001_LOCALIZATION_AUTHORITY_DRAFT_V2,
      englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
      englishQuestionId: english.questionId,
      semanticStateInvariant: true,
      qlInvariant: true,
      sourceFactsInvariant: true,
      sourceAuthorityInvariant: true,
      solverAuthorityInvariant: true,
      reviewV2ModeInvariant: true,
      relationalSurfaceModeInvariant: true,
      capacityConventionInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
    },
    lifecycleV2: {
      localizationReviewOnly: true,
      localizationFrozen: false,
      questionStudioV2Active: false,
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}

export function generateCom001LocalizedReviewQuestionV2(input: {
  qlId: string;
  seed: string;
  language: Com001LocalizationLanguageV2;
}) {
  return localizeCom001ReviewQuestionV2(
    generateCom001ReviewQuestionV2({ qlId: input.qlId, seed: input.seed }),
    input.language,
  );
}
