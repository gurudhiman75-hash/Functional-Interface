import { assertKnowledgeQuestionValid } from "../question-validation";
import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import {
  COM002_LOCALIZATION_VERSION_V4,
  localizeCom002QuestionV4,
  type Com002LocalizedQuestionV4,
} from "./com002-localization-v4";
import type { Com002TargetLanguageV1 } from "./com002-localization-lexicon-v1";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
  generateCom002ReviewQuestionV6,
} from "./com002-review-synthesis-v6";

export const COM002_LOCALIZATION_VERSION_V5 =
  "COM-002-LOCALIZATION-V5-EDITORIAL-ERRATA-REVIEW-CANDIDATE-3" as const;
export const COM002_LOCALIZATION_DRAFT_AUTHORITY_V5 =
  "COM002_HI_PA_LOCALIZATION_V5_EDITORIAL_ERRATA_REVIEW_CANDIDATE_3" as const;

export type Com002LocalizedQuestionV5 = Omit<
  Com002LocalizedQuestionV4,
  "questionId" | "localizationV4" | "lifecycleV4"
> & {
  questionId: string;
  localizationV5: {
    version: typeof COM002_LOCALIZATION_VERSION_V5;
    supersedesLocalizationVersion: typeof COM002_LOCALIZATION_VERSION_V4;
    authority: typeof COM002_LOCALIZATION_DRAFT_AUTHORITY_V5;
    englishGeneratorVersion: typeof COM002_ENGLISH_GENERATOR_VERSION_V6;
    englishBaseFreezeAuthorityId: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId;
    englishBaseCombinedFingerprint: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint;
    englishQuestionId: string;
    semanticStateInvariant: true;
    qlInvariant: true;
    cpInvariant: true;
    surfaceModeInvariant: true;
    targetFactInvariant: true;
    sourceFactsInvariant: true;
    sourceAuthorityInvariant: true;
    solverAuthorityInvariant: true;
    optionOrderSemanticInvariant: true;
    correctIndexInvariant: true;
    learnerSurfaceErrataOverlayOnly: true;
    strictSimplifiedOptionParityOverrides: true;
  };
  lifecycleV5: {
    englishV5BaseFrozen: true;
    englishV6ErrataCandidate: true;
    localizationReviewOnly: true;
    localizationHumanReviewAccepted: false;
    localizationFingerprintsPinned: false;
    localizationFrozen: false;
    questionStudioActive: false;
    reviewRunPersistenceAllowed: false;
    canonicalQuestionPersistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  };
};

const STRICT_SIMPLIFIED_OPTION_TRANSLATIONS: Readonly<
  Record<string, Readonly<Record<Com002TargetLanguageV1, string>>>
> = Object.freeze({
  "supports one user at a time": Object.freeze({
    hi: "एक समय में एक उपयोगकर्ता का समर्थन करता है",
    pa: "ਇੱਕ ਸਮੇਂ ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ",
  }),
  "shares processor time among many users or tasks": Object.freeze({
    hi: "कई उपयोगकर्ताओं या कार्यों के बीच प्रोसेसर समय साझा करता है",
    pa: "ਕਈ ਵਰਤੋਂਕਾਰਾਂ ਜਾਂ ਟਾਸਕਾਂ ਵਿਚਕਾਰ ਪ੍ਰੋਸੈਸਰ ਸਮਾਂ ਸਾਂਝਾ ਕਰਦਾ ਹੈ",
  }),
  "responds to events within strict time limits": Object.freeze({
    hi: "कठोर समय सीमाओं के भीतर घटनाओं पर प्रतिक्रिया करता है",
    pa: "ਸਖ਼ਤ ਸਮਾਂ ਸੀਮਾਵਾਂ ਅੰਦਰ ਘਟਨਾਵਾਂ ਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਕਰਦਾ ਹੈ",
  }),
  "allows many programs to run during the same period": Object.freeze({
    hi: "एक ही अवधि में कई प्रोग्राम चलने देता है",
    pa: "ਇੱਕੋ ਸਮੇਂ ਦੌਰਾਨ ਕਈ ਪ੍ਰੋਗਰਾਮ ਚੱਲਣ ਦਿੰਦਾ ਹੈ",
  }),
  "gives CPU time to processes": Object.freeze({
    hi: "प्रक्रियाओं को CPU समय देता है",
    pa: "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ CPU ਸਮਾਂ ਦਿੰਦਾ ਹੈ",
  }),
  "gives memory to processes": Object.freeze({
    hi: "प्रक्रियाओं को मेमोरी देता है",
    pa: "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਮੈਮੋਰੀ ਦਿੰਦਾ ਹੈ",
  }),
  "provides a user-facing command/interface layer for interacting with operating-system services": Object.freeze({
    hi: "ऑपरेटिंग सिस्टम की सेवाओं के उपयोग के लिए कमांड/इंटरफेस देता है",
    pa: "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦੀਆਂ ਸੇਵਾਵਾਂ ਵਰਤਣ ਲਈ ਕਮਾਂਡ/ਇੰਟਰਫੇਸ ਦਿੰਦਾ ਹੈ",
  }),
  "uses buttons, icons, windows, and other graphical controls": Object.freeze({
    hi: "बटन, आइकन, विंडो और अन्य ग्राफिकल कंट्रोल का उपयोग करता है",
    pa: "ਬਟਨ, ਆਇਕਨ, ਵਿੰਡੋ ਅਤੇ ਹੋਰ ਗ੍ਰਾਫਿਕਲ ਕੰਟਰੋਲ ਵਰਤਦਾ ਹੈ",
  }),
  "open apps, settings, files, and search": Object.freeze({
    hi: "ऐप, सेटिंग्स, फ़ाइलें और सर्च खोलना",
    pa: "ਐਪ, ਸੈਟਿੰਗਾਂ, ਫ਼ਾਈਲਾਂ ਅਤੇ ਸਰਚ ਖੋਲ੍ਹਣਾ",
  }),
  "help launch apps, switch open windows and access system features": Object.freeze({
    hi: "ऐप लॉन्च करने, खुली विंडो बदलने और सिस्टम सुविधाओं तक पहुँचने में मदद करना",
    pa: "ਐਪ ਖੋਲ੍ਹਣ, ਖੁੱਲ੍ਹੀਆਂ ਵਿੰਡੋਆਂ ਵਿਚਕਾਰ ਬਦਲਣ ਅਤੇ ਸਿਸਟਮ ਸੁਵਿਧਾਵਾਂ ਤੱਕ ਪਹੁੰਚ ਵਿੱਚ ਮਦਦ ਕਰਨਾ",
  }),
  "change display settings": Object.freeze({
    hi: "डिस्प्ले सेटिंग्स बदलना",
    pa: "ਡਿਸਪਲੇ ਸੈਟਿੰਗਾਂ ਬਦਲਣਾ",
  }),
  "change mouse settings": Object.freeze({
    hi: "माउस सेटिंग्स बदलना",
    pa: "ਮਾਊਸ ਸੈਟਿੰਗਾਂ ਬਦਲਣਾ",
  }),
  "change date and time settings": Object.freeze({
    hi: "दिनांक और समय सेटिंग्स बदलना",
    pa: "ਮਿਤੀ ਅਤੇ ਸਮਾਂ ਸੈਟਿੰਗਾਂ ਬਦਲਣਾ",
  }),
  "add, remove or manage printers": Object.freeze({
    hi: "प्रिंटर जोड़ना, हटाना या प्रबंधित करना",
    pa: "ਪ੍ਰਿੰਟਰ ਜੋੜਨਾ, ਹਟਾਉਣਾ ਜਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰਨਾ",
  }),
  "changes the item's name": Object.freeze({
    hi: "आइटम का नाम बदलता है",
    pa: "ਆਈਟਮ ਦਾ ਨਾਂ ਬਦਲਦਾ ਹੈ",
  }),
  "finds matching files or folders": Object.freeze({
    hi: "मेल खाने वाली फ़ाइलें या फ़ोल्डर ढूँढता है",
    pa: "ਮੇਲ ਖਾਂਦੀਆਂ ਫ਼ਾਈਲਾਂ ਜਾਂ ਫ਼ੋਲਡਰ ਲੱਭਦਾ ਹੈ",
  }),
  "removes the selected item from its current location": Object.freeze({
    hi: "चुने गए आइटम को उसकी मौजूदा जगह से हटाता है",
    pa: "ਚੁਣੀ ਆਈਟਮ ਨੂੰ ਉਸਦੀ ਮੌਜੂਦਾ ਥਾਂ ਤੋਂ ਹਟਾਉਂਦਾ ਹੈ",
  }),
  "moves the item to another location": Object.freeze({
    hi: "आइटम को दूसरी जगह ले जाता है",
    pa: "ਆਈਟਮ ਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲੈ ਜਾਂਦਾ ਹੈ",
  }),
  "brings the deleted item back": Object.freeze({
    hi: "डिलीट किए गए आइटम को वापस लाता है",
    pa: "ਡਿਲੀਟ ਕੀਤੀ ਆਈਟਮ ਨੂੰ ਵਾਪਸ ਲਿਆਉਂਦਾ ਹੈ",
  }),
});

function repairLocalizedTextV5(
  text: string,
  qlId: string,
  language: Com002TargetLanguageV1,
) {
  if (language === "hi") {
    let repaired = text
      .replace(
        /फ़ाइल-स्टोरेज संसाधन ऑपरेटिंग सिस्टम का कार्य है।/gu,
        "फ़ाइल-स्टोरेज संसाधनों का प्रबंधन ऑपरेटिंग सिस्टम का कार्य है।",
      )
      .replace(/रीनेम क्रिया([^।\n?]*?)बदलता है/gu, "रीनेम क्रिया$1बदलती है")
      .replace(
        /रीनेम क्रिया मूल आइटम को वहीं छोड़ने के बजाय उसका स्थान बदलती है/gu,
        "रीनेम क्रिया आइटम को दूसरी जगह ले जाती है",
      );

    if (qlId === "COM-002-QL-010") {
      repaired = repaired
        .replace(/ क्रिया का प्रभाव है:\s*/gu, " क्रिया ")
        .replace(/ता है।$/u, "ती है।");
    }
    return repaired;
  }

  let repaired = text
    .replace(
      /ਫ਼ਾਈਲ-ਸਟੋਰੇਜ ਸਰੋਤ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।/gu,
      "ਫ਼ਾਈਲ-ਸਟੋਰੇਜ ਸਰੋਤਾਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰਨਾ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।",
    )
    .replace(/ਰੀਨੇਮ ਕਾਰਵਾਈ([^।\n?]*?)ਬਦਲਦਾ ਹੈ/gu, "ਰੀਨੇਮ ਕਾਰਵਾਈ$1ਬਦਲਦੀ ਹੈ")
    .replace(
      /ਰੀਨੇਮ ਕਾਰਵਾਈ ਮੂਲ ਆਈਟਮ ਨੂੰ ਥਾਂ ਤੇ ਛੱਡਣ ਦੀ ਬਜਾਇ ਉਸਦੀ ਥਾਂ ਬਦਲਦੀ ਹੈ/gu,
      "ਰੀਨੇਮ ਕਾਰਵਾਈ ਆਈਟਮ ਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲੈ ਜਾਂਦੀ ਹੈ",
    );

  if (qlId === "COM-002-QL-010") {
    repaired = repaired
      .replace(/ ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਹੈ:\s*/gu, " ਕਾਰਵਾਈ ")
      .replace(/ਦਾ ਹੈ।$/u, "ਦੀ ਹੈ।");
  }
  return repaired;
}

function repairLocalizedStemV5(input: {
  stem: string;
  qlId: string;
  surfaceMode: string;
  language: Com002TargetLanguageV1;
}) {
  let stem = repairLocalizedTextV5(input.stem, input.qlId, input.language);

  if (input.qlId === "COM-002-QL-001" && input.surfaceMode === "ENTITY_TO_FUNCTION") {
    return input.language === "hi"
      ? "इनमें से कौन-सा ऑपरेटिंग सिस्टम का कार्य है?"
      : "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ?";
  }

  if (input.qlId === "COM-002-QL-006") {
    if (input.language === "hi") {
      stem = stem
        .replace(/^कौन-सी सिस्टम क्रिया यह काम करती है:\s*/u, "कौन-सी सिस्टम क्रिया ")
        .replace(/करता है\?$/u, "करती है?");
    } else {
      stem = stem
        .replace(/^ਕਿਹੜੀ ਸਿਸਟਮ ਕਾਰਵਾਈ ਇਹ ਕੰਮ ਕਰਦੀ ਹੈ:\s*/u, "ਕਿਹੜੀ ਸਿਸਟਮ ਕਾਰਵਾਈ ")
        .replace(/ਕਰਦਾ ਹੈ\?$/u, "ਕਰਦੀ ਹੈ?");
    }
  }

  if (input.qlId === "COM-002-QL-008") {
    return input.language === "hi"
      ? "संबंधित व्यू विकल्प चालू होने पर छिपे आइटम दिखाने के लिए इनमें से किसका उपयोग किया जाता है?"
      : "ਸੰਬੰਧਿਤ ਵਿਊ ਵਿਕਲਪ ਚਾਲੂ ਹੋਣ ਤੇ ਲੁਕੀਆਂ ਆਈਟਮਾਂ ਦਿਖਾਉਣ ਲਈ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸਦੀ ਵਰਤੋਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ?";
  }

  if (input.qlId === "COM-002-QL-010") {
    if (input.language === "hi" && stem === "रीनेम क्रिया का प्रभाव क्या है?") {
      return "रीनेम करने पर क्या होता है?";
    }
    if (input.language === "pa" && stem === "ਰੀਨੇਮ ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਕੀ ਹੈ?") {
      return "ਰੀਨੇਮ ਕਰਨ ਨਾਲ ਕੀ ਹੁੰਦਾ ਹੈ?";
    }
  }

  if (input.qlId === "COM-002-QL-011") {
    if (input.language === "hi" && stem === "Windows रीसायकल बिन में मौजूद आइटम के लिए Restore क्रिया का उद्देश्य क्या है?") {
      return "रीसायकल बिन में मौजूद आइटम को Restore करने पर क्या होता है?";
    }
    if (input.language === "pa" && stem === "Windows ਰੀਸਾਈਕਲ ਬਿਨ ਵਿੱਚ ਮੌਜੂਦ ਆਈਟਮ ਲਈ Restore ਕਾਰਵਾਈ ਦਾ ਉਦੇਸ਼ ਕੀ ਹੈ?") {
      return "ਰੀਸਾਈਕਲ ਬਿਨ ਵਿੱਚ ਮੌਜੂਦ ਆਈਟਮ ਨੂੰ Restore ਕਰਨ ਨਾਲ ਕੀ ਹੁੰਦਾ ਹੈ?";
    }
  }

  return stem;
}

function repairLocalizedExplanationV5(input: {
  explanation: string;
  qlId: string;
  language: Com002TargetLanguageV1;
}) {
  let explanation = repairLocalizedTextV5(input.explanation, input.qlId, input.language);

  if (input.language === "hi") {
    if (input.qlId === "COM-002-QL-006") {
      explanation = explanation.replace(/^(.+?) का अर्थ है:\s*(.+)$/u, "$1 $2");
    }
    if (input.qlId === "COM-002-QL-007" || input.qlId === "COM-002-QL-008") {
      explanation = explanation.replace(/^([^:।\n]+):\s+/u, "$1 ");
    }
    if (input.qlId === "COM-002-QL-011") {
      explanation = explanation.replace(
        /^रीसायकल बिन से रीस्टोर रीसायकल बिन में अभी उपलब्ध डिलीट किए गए आइटम को वापस लाता है।$/u,
        "रीस्टोर रीसायकल बिन में मौजूद डिलीट किए गए आइटम को वापस लाता है।",
      );
    }
    if (input.qlId === "COM-002-QL-013") {
      explanation = explanation
        .replace(/इसलिए केवल ([IVX, ]+ और [IVX]+) सही उत्तर है।/u, "इसलिए केवल $1 सही हैं।")
        .replace(/इसलिए केवल ([IVX]+) सही उत्तर है।/u, "इसलिए केवल $1 सही है।");
    }
    return explanation;
  }

  if (input.qlId === "COM-002-QL-006") {
    explanation = explanation.replace(/^(.+?) ਦਾ ਅਰਥ ਹੈ:\s*(.+)$/u, "$1 $2");
  }
  if (input.qlId === "COM-002-QL-007" || input.qlId === "COM-002-QL-008") {
    explanation = explanation.replace(/^([^:।\n]+):\s+/u, "$1 ");
  }
  if (input.qlId === "COM-002-QL-011") {
    explanation = explanation.replace(
      /^ਰੀਸਾਈਕਲ ਬਿਨ ਤੋਂ ਰੀਸਟੋਰ ਰੀਸਾਈਕਲ ਬਿਨ ਵਿੱਚ ਹਾਲੇ ਮੌਜੂਦ ਡਿਲੀਟ ਕੀਤੀ ਆਈਟਮ ਨੂੰ ਵਾਪਸ ਲਿਆਉਂਦਾ ਹੈ।$/u,
      "ਰੀਸਟੋਰ ਰੀਸਾਈਕਲ ਬਿਨ ਵਿੱਚ ਮੌਜੂਦ ਡਿਲੀਟ ਕੀਤੀ ਆਈਟਮ ਨੂੰ ਵਾਪਸ ਲਿਆਉਂਦਾ ਹੈ।",
    );
  }
  if (input.qlId === "COM-002-QL-013") {
    explanation = explanation
      .replace(/ਇਸ ਲਈ ਕੇਵਲ ([IVX, ]+ ਅਤੇ [IVX]+) ਸਹੀ ਉੱਤਰ ਹੈ।/u, "ਇਸ ਲਈ ਕੇਵਲ $1 ਸਹੀ ਹਨ।")
      .replace(/ਇਸ ਲਈ ਕੇਵਲ ([IVX]+) ਸਹੀ ਉੱਤਰ ਹੈ।/u, "ਇਸ ਲਈ ਕੇਵਲ $1 ਸਹੀ ਹੈ।");
  }
  return explanation;
}

function repairLocalizedOptionsV5(input: {
  englishOptions: string[];
  localizedOptions: string[];
  qlId: string;
  language: Com002TargetLanguageV1;
}) {
  return input.localizedOptions.map((localized, index) => {
    const english = input.englishOptions[index]!;
    const strict = STRICT_SIMPLIFIED_OPTION_TRANSLATIONS[english]?.[input.language];
    return strict ?? repairLocalizedTextV5(localized, input.qlId, input.language);
  });
}

function assertV6SemanticRebindSafe(
  historical: Com002LocalizedQuestionV4,
  english: ReturnType<typeof generateCom002ReviewQuestionV6>,
  input: { qlId: string; seed: string; language: Com002TargetLanguageV1 },
) {
  const prefix = `${input.qlId}/${input.seed}/${input.language}`;
  if (historical.qlId !== english.qlId) throw new Error(`${prefix}: V6 QL drift`);
  if (historical.cpId !== english.cpId) throw new Error(`${prefix}: V6 CP drift`);
  if (historical.surfaceMode !== english.surfaceMode) throw new Error(`${prefix}: V6 surface-mode drift`);
  if (historical.targetFactId !== english.targetFactId) throw new Error(`${prefix}: V6 target-fact drift`);
  if (historical.correctIndex !== english.correctIndex) throw new Error(`${prefix}: V6 correct-index drift`);
  if (historical.solverAuthority !== english.solverAuthority) throw new Error(`${prefix}: V6 solver-authority drift`);
  if (JSON.stringify(historical.sourceFactIds) !== JSON.stringify(english.sourceFactIds)) {
    throw new Error(`${prefix}: V6 source-fact provenance drift`);
  }
  if (JSON.stringify(historical.sourceIds) !== JSON.stringify(english.sourceIds)) {
    throw new Error(`${prefix}: V6 source-authority drift`);
  }
}

/**
 * Candidate-only Hindi/Punjabi editorial errata layer.
 *
 * This preserves V4 as a historical review baseline and rebinds to English V6,
 * which itself is a semantic no-op over frozen V5. V5 fixes only learner-facing
 * grammar/wording defects and selected simplified-option parity mismatches.
 */
export function localizeCom002QuestionV5(input: {
  qlId: string;
  seed: string;
  language: Com002TargetLanguageV1;
}): Com002LocalizedQuestionV5 {
  const english = generateCom002ReviewQuestionV6({ qlId: input.qlId, seed: input.seed });
  const historical = localizeCom002QuestionV4(input);
  assertV6SemanticRebindSafe(historical, english, input);

  const {
    localizationV4: _localizationV4,
    lifecycleV4: _lifecycleV4,
    ...base
  } = historical;

  const options = repairLocalizedOptionsV5({
    englishOptions: english.options,
    localizedOptions: historical.options,
    qlId: english.qlId,
    language: input.language,
  });
  const stem = repairLocalizedStemV5({
    stem: historical.stem,
    qlId: english.qlId,
    surfaceMode: english.surfaceMode,
    language: input.language,
  });
  const explanation = repairLocalizedExplanationV5({
    explanation: historical.explanation,
    qlId: english.qlId,
    language: input.language,
  });

  const question: Com002LocalizedQuestionV5 = {
    ...base,
    questionId: `${english.questionId}-${input.language.toUpperCase()}`,
    qlId: english.qlId,
    cpId: english.cpId,
    surfaceMode: english.surfaceMode,
    targetFactId: english.targetFactId,
    stem,
    options,
    correctIndex: english.correctIndex,
    canonicalAnswer: options[english.correctIndex]!,
    explanation,
    sourceIds: [...english.sourceIds],
    sourceFactIds: [...english.sourceFactIds],
    solverAuthority: english.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
    localizationV5: {
      version: COM002_LOCALIZATION_VERSION_V5,
      supersedesLocalizationVersion: COM002_LOCALIZATION_VERSION_V4,
      authority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V5,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
      englishBaseFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
      englishBaseCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
      englishQuestionId: english.questionId,
      semanticStateInvariant: true,
      qlInvariant: true,
      cpInvariant: true,
      surfaceModeInvariant: true,
      targetFactInvariant: true,
      sourceFactsInvariant: true,
      sourceAuthorityInvariant: true,
      solverAuthorityInvariant: true,
      optionOrderSemanticInvariant: true,
      correctIndexInvariant: true,
      learnerSurfaceErrataOverlayOnly: true,
      strictSimplifiedOptionParityOverrides: true,
    },
    lifecycleV5: {
      englishV5BaseFrozen: true,
      englishV6ErrataCandidate: true,
      localizationReviewOnly: true,
      localizationHumanReviewAccepted: false,
      localizationFingerprintsPinned: false,
      localizationFrozen: false,
      questionStudioActive: false,
      reviewRunPersistenceAllowed: false,
      canonicalQuestionPersistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });

  return question;
}
