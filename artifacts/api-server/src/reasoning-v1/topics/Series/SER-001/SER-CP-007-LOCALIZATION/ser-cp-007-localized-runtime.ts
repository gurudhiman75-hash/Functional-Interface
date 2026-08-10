import type { SerCp007EditorialQuestion } from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";
import type {
  SerCp007AdaptiveReviewV71,
  SerCp007RenderingContractV71,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review-v7-1";
import {
  generateSerCp007PermanentEnglishPackage,
  type SerCp007PermanentEnglishPackage,
} from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-permanent-runtime";

export const SER_CP007_LOCALIZATION_CANDIDATE_VERSION =
  "SER_CP007_HI_PA_LOCALIZATION_CANDIDATE_V1" as const;

export const SER_CP007_LOCALES = ["hi-IN", "pa-IN"] as const;
export type SerCp007Locale = (typeof SER_CP007_LOCALES)[number];

export interface SerCp007LocalizationDiagnostics {
  readonly sourceLineCount: number;
  readonly fallbackLineCount: number;
  readonly fallbackSourceLines: readonly string[];
}

export type SerCp007LocalizedQuestion = Omit<
  SerCp007EditorialQuestion,
  "stem" | "explanation"
> & {
  readonly locale: SerCp007Locale;
  readonly stem: string;
  readonly explanation: SerCp007EditorialQuestion["explanation"];
};

export type SerCp007LocalizedReview = Omit<
  SerCp007AdaptiveReviewV71,
  | "stem"
  | "review"
  | "conciseReview"
  | "expandedReview"
  | "workedSteps"
  | "renderingContract"
> & {
  readonly locale: SerCp007Locale;
  readonly stem: string;
  readonly review: string;
  readonly conciseReview: string;
  readonly expandedReview: string;
  readonly workedSteps: readonly string[];
  readonly renderingContract: SerCp007RenderingContractV71 | null;
  readonly localizationDiagnostics: SerCp007LocalizationDiagnostics;
};

export interface SerCp007LocalizedLifecycle {
  readonly permanentQlId: SerCp007PermanentEnglishPackage["permanentQlId"];
  readonly identityStatus: "PERMANENT_ID_ALLOCATED";
  readonly englishStatus: "ENGLISH_FROZEN";
  readonly localizationStatus: "IMPLEMENTED_PENDING_MANUAL_REVIEW";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export type SerCp007PermanentLocalizedPackage = Omit<
  SerCp007PermanentEnglishPackage,
  "question" | "review" | "lifecycle" | "reviewDecision"
> & {
  readonly locale: SerCp007Locale;
  readonly localizationVersion: typeof SER_CP007_LOCALIZATION_CANDIDATE_VERSION;
  readonly question: SerCp007LocalizedQuestion;
  readonly review: SerCp007LocalizedReview;
  readonly reviewDecision: "PENDING_NATIVE_LANGUAGE_MANUAL_APPROVAL";
  readonly lifecycle: SerCp007LocalizedLifecycle;
};

type TranslationResult = {
  readonly text: string;
  readonly fallback: boolean;
};

function translated(locale: SerCp007Locale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

const STEM_OPENERS: Readonly<
  Record<string, Readonly<Record<SerCp007Locale, string>>>
> = Object.freeze({
  "Which letter group should come immediately before the first given term?": {
    "hi-IN": "दिए गए पहले अक्षर-समूह से ठीक पहले कौन-सा अक्षर-समूह आएगा?",
    "pa-IN": "ਦਿੱਤੇ ਪਹਿਲੇ ਅੱਖਰ-ਸਮੂਹ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਆਵੇਗਾ?",
  },
  "Which letter group should come immediately before the given series?": {
    "hi-IN": "दी गई श्रृंखला से ठीक पहले कौन-सा अक्षर-समूह आएगा?",
    "pa-IN": "ਦਿੱਤੀ ਲੜੀ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਆਵੇਗਾ?",
  },
  "Which letter group should come next in the series?": {
    "hi-IN": "श्रृंखला में अगला अक्षर-समूह कौन-सा होगा?",
    "pa-IN": "ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਅੱਖਰ-ਸਮੂਹ ਕਿਹੜਾ ਹੋਵੇਗਾ?",
  },
  "Which letter group should replace the incorrect term?": {
    "hi-IN": "गलत समूह के स्थान पर कौन-सा अक्षर-समूह आएगा?",
    "pa-IN": "ਗਲਤ ਸਮੂਹ ਦੀ ਥਾਂ ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਆਵੇਗਾ?",
  },
  "Which letter group should replace the incorrectly placed group?": {
    "hi-IN": "गलत स्थान पर रखे गए समूह के स्थान पर कौन-सा अक्षर-समूह आएगा?",
    "pa-IN": "ਗਲਤ ਥਾਂ ਰੱਖੇ ਸਮੂਹ ਦੀ ਥਾਂ ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਆਵੇਗਾ?",
  },
  "Which letter group should replace the question mark?": {
    "hi-IN": "प्रश्नवाचक चिन्ह के स्थान पर कौन-सा अक्षर-समूह आएगा?",
    "pa-IN": "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਆਵੇਗਾ?",
  },
  "Which option correctly shows the wrong group and its replacement?": {
    "hi-IN": "कौन-सा विकल्प गलत समूह और उसके सही प्रतिस्थापन को दर्शाता है?",
    "pa-IN": "ਕਿਹੜਾ ਵਿਕਲਪ ਗਲਤ ਸਮੂਹ ਅਤੇ ਉਸ ਦੇ ਸਹੀ ਬਦਲ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?",
  },
  "Which two letter groups should come next?": {
    "hi-IN": "अगले दो अक्षर-समूह कौन-से होंगे?",
    "pa-IN": "ਅਗਲੇ ਦੋ ਅੱਖਰ-ਸਮੂਹ ਕਿਹੜੇ ਹੋਣਗੇ?",
  },
  "Which two letter groups should replace the question marks from left to right?": {
    "hi-IN": "बाएँ से दाएँ प्रश्नवाचक चिह्नों के स्थान पर कौन-से दो अक्षर-समूह आएँगे?",
    "pa-IN": "ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹਾਂ ਦੀ ਥਾਂ ਕਿਹੜੇ ਦੋ ਅੱਖਰ-ਸਮੂਹ ਆਉਣਗੇ?",
  },
  "Find the next letter group in the series.": {
    "hi-IN": "श्रृंखला में अगला अक्षर-समूह ज्ञात कीजिए।",
    "pa-IN": "ਲੜੀ ਵਿੱਚ ਅਗਲਾ ਅੱਖਰ-ਸਮੂਹ ਲੱਭੋ।",
  },
  "Which letter group should come next?": {
    "hi-IN": "अगला अक्षर-समूह कौन-सा होगा?",
    "pa-IN": "ਅਗਲਾ ਅੱਖਰ-ਸਮੂਹ ਕਿਹੜਾ ਹੋਵੇਗਾ?",
  },
  "Choose the letter group that should replace the question mark.": {
    "hi-IN": "प्रश्नवाचक चिन्ह के स्थान पर आने वाला अक्षर-समूह चुनिए।",
    "pa-IN": "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਆਉਣ ਵਾਲਾ ਅੱਖਰ-ਸਮੂਹ ਚੁਣੋ।",
  },
  "Find the missing letter group.": {
    "hi-IN": "लुप्त अक्षर-समूह ज्ञात कीजिए।",
    "pa-IN": "ਗੁੰਮ ਅੱਖਰ-ਸਮੂਹ ਲੱਭੋ।",
  },
  "Choose the group that continues the series.": {
    "hi-IN": "श्रृंखला को आगे बढ़ाने वाला समूह चुनिए।",
    "pa-IN": "ਲੜੀ ਨੂੰ ਅੱਗੇ ਵਧਾਉਣ ਵਾਲਾ ਸਮੂਹ ਚੁਣੋ।",
  },
  "One group is incorrect. Which group should be written in its place?": {
    "hi-IN": "एक समूह गलत है। उसके स्थान पर कौन-सा समूह लिखा जाना चाहिए?",
    "pa-IN": "ਇੱਕ ਸਮੂਹ ਗਲਤ ਹੈ। ਉਸ ਦੀ ਥਾਂ ਕਿਹੜਾ ਸਮੂਹ ਲਿਖਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  "Which group should replace the incorrect term?": {
    "hi-IN": "गलत समूह के स्थान पर कौन-सा समूह आएगा?",
    "pa-IN": "ਗਲਤ ਸਮੂਹ ਦੀ ਥਾਂ ਕਿਹੜਾ ਸਮੂਹ ਆਵੇਗਾ?",
  },
  "Which group completes the series?": {
    "hi-IN": "कौन-सा समूह श्रृंखला को पूरा करता है?",
    "pa-IN": "ਕਿਹੜਾ ਸਮੂਹ ਲੜੀ ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ?",
  },
  "Choose the correct replacement for the wrongly placed group.": {
    "hi-IN": "गलत स्थान पर दिए गए समूह का सही प्रतिस्थापन चुनिए।",
    "pa-IN": "ਗਲਤ ਥਾਂ ਦਿੱਤੇ ਸਮੂਹ ਦਾ ਸਹੀ ਬਦਲ ਚੁਣੋ।",
  },
  "Choose the ordered pair that continues the series.": {
    "hi-IN": "श्रृंखला को आगे बढ़ाने वाला क्रमबद्ध युग्म चुनिए।",
    "pa-IN": "ਲੜੀ ਨੂੰ ਅੱਗੇ ਵਧਾਉਣ ਵਾਲੀ ਕ੍ਰਮਬੱਧ ਜੋੜੀ ਚੁਣੋ।",
  },
  "Which two groups should come next?": {
    "hi-IN": "अगले दो समूह कौन-से होंगे?",
    "pa-IN": "ਅਗਲੇ ਦੋ ਸਮੂਹ ਕਿਹੜੇ ਹੋਣਗੇ?",
  },
  "Which groups of letters should fill the blanks from left to right?": {
    "hi-IN": "बाएँ से दाएँ रिक्त स्थानों में कौन-से अक्षर-समूह आएँगे?",
    "pa-IN": "ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਕਿਹੜੇ ਅੱਖਰ-ਸਮੂਹ ਆਉਣਗੇ?",
  },
  "Which group of letters should be placed in the blanks from left to right?": {
    "hi-IN": "बाएँ से दाएँ रिक्त स्थानों में कौन-सा अक्षर-समूह रखा जाएगा?",
    "pa-IN": "ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਰੱਖਿਆ ਜਾਵੇਗਾ?",
  },
  "Identify the incorrect group and select its correct replacement.": {
    "hi-IN": "गलत समूह पहचानिए और उसका सही प्रतिस्थापन चुनिए।",
    "pa-IN": "ਗਲਤ ਸਮੂਹ ਪਛਾਣੋ ਅਤੇ ਉਸ ਦਾ ਸਹੀ ਬਦਲ ਚੁਣੋ।",
  },
  "Choose the two groups that should replace the question marks.": {
    "hi-IN": "प्रश्नवाचक चिह्नों के स्थान पर आने वाले दो समूह चुनिए।",
    "pa-IN": "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹਾਂ ਦੀ ਥਾਂ ਆਉਣ ਵਾਲੇ ਦੋ ਸਮੂਹ ਚੁਣੋ।",
  },
  "Which ordered pair completes the two blanks?": {
    "hi-IN": "दोनों रिक्त स्थानों को पूरा करने वाला क्रमबद्ध युग्म कौन-सा है?",
    "pa-IN": "ਦੋਵੇਂ ਖਾਲੀ ਥਾਵਾਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੀ ਕ੍ਰਮਬੱਧ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?",
  },
});

const HEADING_TRANSLATIONS: Readonly<
  Record<string, Readonly<Record<SerCp007Locale, string>>>
> = Object.freeze({
  "Move the marker or boundary at the required step": {
    "hi-IN": "आवश्यक चरण पर संकेतक या सीमा को आगे बढ़ाएँ",
    "pa-IN": "ਲੋੜੀਂਦੇ ਪੜਾਅ ਉੱਤੇ ਨਿਸ਼ਾਨ ਜਾਂ ਹੱਦ ਨੂੰ ਅੱਗੇ ਵਧਾਓ",
  },
  "Use the two-part pair pattern": {
    "hi-IN": "दो-भाग वाले युग्म-पैटर्न का प्रयोग करें",
    "pa-IN": "ਦੋ-ਭਾਗੀ ਜੋੜੀ-ਪੈਟਰਨ ਵਰਤੋ",
  },
  "Prove the answer inside the target row": {
    "hi-IN": "लक्षित पंक्ति के भीतर उत्तर सिद्ध करें",
    "pa-IN": "ਨਿਸ਼ਾਨਾ ਕਤਾਰ ਦੇ ਅੰਦਰ ਉੱਤਰ ਸਾਬਤ ਕਰੋ",
  },
  "Expanded displayed-row check": {
    "hi-IN": "दिखाई गई पंक्तियों की विस्तृत जाँच",
    "pa-IN": "ਦਿਖਾਈਆਂ ਕਤਾਰਾਂ ਦੀ ਵਿਸਥਾਰਿਤ ਜਾਂਚ",
  },
  "Apply the movement at the required position": {
    "hi-IN": "आवश्यक स्थान पर परिवर्तन लागू करें",
    "pa-IN": "ਲੋੜੀਂਦੇ ਸਥਾਨ ਉੱਤੇ ਬਦਲਾਅ ਲਾਗੂ ਕਰੋ",
  },
  "Verify the term immediately before the series": {
    "hi-IN": "श्रृंखला से ठीक पहले वाले समूह की जाँच करें",
    "pa-IN": "ਲੜੀ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਵਾਲੇ ਸਮੂਹ ਦੀ ਜਾਂਚ ਕਰੋ",
  },
  "Construct the required group": {
    "hi-IN": "आवश्यक समूह बनाएँ",
    "pa-IN": "ਲੋੜੀਂਦਾ ਸਮੂਹ ਬਣਾਓ",
  },
  "Follow the correct alphabet direction": {
    "hi-IN": "वर्णमाला की सही दिशा का अनुसरण करें",
    "pa-IN": "ਵਰਣਮਾਲਾ ਦੀ ਸਹੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਚੱਲੋ",
  },
  "Use both insertion position and inserted-letter progression": {
    "hi-IN": "प्रविष्टि-स्थान और जोड़े गए अक्षरों की प्रगति, दोनों का प्रयोग करें",
    "pa-IN": "ਦਾਖਲਾ-ਸਥਾਨ ਅਤੇ ਜੋੜੇ ਅੱਖਰਾਂ ਦੀ ਤਰੱਕੀ ਦੋਵੇਂ ਵਰਤੋ",
  },
  "Track positions rather than alphabet values": {
    "hi-IN": "अक्षरों के मान के बजाय उनके स्थान देखें",
    "pa-IN": "ਅੱਖਰਾਂ ਦੇ ਮੁੱਲ ਦੀ ਬਜਾਏ ਉਨ੍ਹਾਂ ਦੇ ਸਥਾਨ ਵੇਖੋ",
  },
  "Continue both edge-letter sequences": {
    "hi-IN": "दोनों किनारों के अक्षर-क्रम आगे बढ़ाएँ",
    "pa-IN": "ਦੋਵੇਂ ਕਿਨਾਰਿਆਂ ਦੇ ਅੱਖਰ-ਕ੍ਰਮ ਅੱਗੇ ਵਧਾਓ",
  },
  "Rebuild the repeating sequence at the gaps": {
    "hi-IN": "रिक्त स्थानों पर दोहराव वाला क्रम पुनः बनाएँ",
    "pa-IN": "ਖਾਲੀ ਥਾਵਾਂ ਉੱਤੇ ਦੁਹਰਾਉਂਦਾ ਕ੍ਰਮ ਮੁੜ ਬਣਾਓ",
  },
  "Use only the decisive progressive jump": {
    "hi-IN": "केवल निर्णायक क्रमिक परिवर्तन का प्रयोग करें",
    "pa-IN": "ਸਿਰਫ਼ ਨਿਰਣਾਇਕ ਕ੍ਰਮਿਕ ਬਦਲਾਅ ਵਰਤੋ",
  },
  "Keep the conceptual jump progression": {
    "hi-IN": "परिवर्तनों की मूल प्रगति बनाए रखें",
    "pa-IN": "ਬਦਲਾਵਾਂ ਦੀ ਮੂਲ ਤਰੱਕੀ ਕਾਇਮ ਰੱਖੋ",
  },
  "Track the marker position": {
    "hi-IN": "संकेतक का स्थान देखें",
    "pa-IN": "ਨਿਸ਼ਾਨ ਦਾ ਸਥਾਨ ਵੇਖੋ",
  },
});

function localizeStem(stem: string, locale: SerCp007Locale): string {
  const lines = stem.split("\n");
  const opener = lines[0]?.trim() ?? "";
  const localized = STEM_OPENERS[opener]?.[locale];
  if (!localized) {
    throw new Error(`Missing ${locale} Series stem translation: ${opener}`);
  }
  return [localized, ...lines.slice(1)].join("\n");
}

function localizedRenderingContract(
  contract: SerCp007RenderingContractV71 | null,
  locale: SerCp007Locale,
): SerCp007RenderingContractV71 | null {
  if (!contract) return null;
  if (contract.kind === "CASE_MARKER") {
    return {
      ...contract,
      accessibleDescription: translated(
        locale,
        "अक्षरों का बड़ा या छोटा रूप अर्थपूर्ण है। प्रत्येक छोटे अक्षर वाले संकेतक को उसके अक्षर और स्थान के साथ पढ़ें; केवल रंग पर निर्भर न रहें।",
        "ਅੱਖਰਾਂ ਦਾ ਵੱਡਾ ਜਾਂ ਛੋਟਾ ਰੂਪ ਅਰਥਪੂਰਨ ਹੈ। ਹਰ ਛੋਟੇ ਅੱਖਰ ਵਾਲੇ ਨਿਸ਼ਾਨ ਨੂੰ ਉਸ ਦੇ ਅੱਖਰ ਅਤੇ ਸਥਾਨ ਸਮੇਤ ਪੜ੍ਹੋ; ਸਿਰਫ਼ ਰੰਗ ਉੱਤੇ ਨਿਰਭਰ ਨਾ ਕਰੋ।",
      ),
    };
  }
  return {
    ...contract,
    accessibleDescription: translated(
      locale,
      "पूरी अक्षर-रिक्ति पंक्ति को एक ही क्षैतिज, स्क्रॉल योग्य पंक्ति में रखें ताकि दोहराए जाने वाले खंडों की सीमाएँ स्थिर रहें।",
      "ਪੂਰੀ ਅੱਖਰ-ਖਾਲੀ ਲਾਈਨ ਨੂੰ ਇੱਕੋ ਖਿਤਿਜੀ, ਸਕ੍ਰੋਲਯੋਗ ਕਤਾਰ ਵਿੱਚ ਰੱਖੋ ਤਾਂ ਜੋ ਦੁਹਰਾਏ ਖੰਡਾਂ ਦੀਆਂ ਹੱਦਾਂ ਸਥਿਰ ਰਹਿਣ।",
    ),
  };
}

function formulaFallback(source: string, locale: SerCp007Locale): string {
  const symbolic = source
    .split(/\s+/)
    .filter((token) => {
      const clean = token.replace(/^[^A-Za-z0-9+-]+|[^A-Za-z0-9+\-=→,./]+$/g, "");
      if (!clean) return false;
      if (/^[+\-]?\d+(?:st|nd|rd|th)?$/.test(clean)) return true;
      if (/[→=+/]/.test(token)) return true;
      if (/^[A-Z]+$/.test(clean)) return true;
      return clean.length >= 3 && /[A-Z]/.test(clean) && /[a-z]/.test(clean);
    })
    .join(" ")
    .trim();
  return translated(
    locale,
    symbolic
      ? `दिए गए अक्षर-क्रम में यही परिवर्तन लागू होता है: ${symbolic}।`
      : "दिए गए अक्षर-क्रम में यही परिवर्तन लागू होता है।",
    symbolic
      ? `ਦਿੱਤੇ ਅੱਖਰ-ਕ੍ਰਮ ਵਿੱਚ ਇਹੀ ਬਦਲਾਅ ਲਾਗੂ ਹੁੰਦਾ ਹੈ: ${symbolic}।`
      : "ਦਿੱਤੇ ਅੱਖਰ-ਕ੍ਰਮ ਵਿੱਚ ਇਹੀ ਬਦਲਾਅ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।",
  );
}

function translateCore(source: string, locale: SerCp007Locale): TranslationResult {
  const value = source.trim();
  let match: RegExpMatchArray | null;
  const ok = (hi: string, pa: string): TranslationResult => ({
    text: translated(locale, hi, pa),
    fallback: false,
  });

  if ((match = value.match(/^Therefore, the answer is (.+)\.$/))) {
    return ok(`अतः उत्तर ${match[1]} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${match[1]} ਹੈ।`);
  }
  if ((match = value.match(/^Therefore, the required group is (.+)\.$/))) {
    return ok(
      `अतः आवश्यक समूह ${match[1]} है।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮੂਹ ${match[1]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^Therefore, the next two groups are (.+)\.$/))) {
    return ok(
      `अतः अगले दो समूह ${match[1]} हैं।`,
      `ਇਸ ਲਈ ਅਗਲੇ ਦੋ ਸਮੂਹ ${match[1]} ਹਨ।`,
    );
  }
  if ((match = value.match(/^The next two groups are (.+)\.$/))) {
    return ok(
      `अगले दो समूह ${match[1]} हैं।`,
      `ਅਗਲੇ ਦੋ ਸਮੂਹ ${match[1]} ਹਨ।`,
    );
  }
  if ((match = value.match(/^(.+) is wrong at that place\. It should be (.+)\.$/))) {
    return ok(
      `उस स्थान पर ${match[1]} गलत है; वहाँ ${match[2]} होना चाहिए।`,
      `ਉਸ ਸਥਾਨ ਉੱਤੇ ${match[1]} ਗਲਤ ਹੈ; ਉੱਥੇ ${match[2]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) is incorrect\. The determinate insertion rule gives (.+)\.$/))) {
    return ok(
      `${match[1]} गलत है। निश्चित प्रविष्टि-नियम से ${match[2]} मिलता है।`,
      `${match[1]} ਗਲਤ ਹੈ। ਨਿਸ਼ਚਿਤ ਦਾਖਲਾ-ਨਿਯਮ ਨਾਲ ${match[2]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) breaks the pair\/progression structure\. It should be (.+)\.$/))) {
    return ok(
      `${match[1]} युग्म/प्रगति की रचना तोड़ता है; इसके स्थान पर ${match[2]} होना चाहिए।`,
      `${match[1]} ਜੋੜੀ/ਤਰੱਕੀ ਦੀ ਬਣਤਰ ਤੋੜਦਾ ਹੈ; ਇਸ ਦੀ ਥਾਂ ${match[2]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) breaks the rotation\. It should be (.+)\.$/))) {
    return ok(
      `${match[1]} घूर्णन-क्रम तोड़ता है; इसके स्थान पर ${match[2]} होना चाहिए।`,
      `${match[1]} ਘੁੰਮਾਅ-ਕ੍ਰਮ ਤੋੜਦਾ ਹੈ; ਇਸ ਦੀ ਥਾਂ ${match[2]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) is the wrong group and (.+) is its replacement\.$/))) {
    return ok(
      `${match[1]} गलत समूह है और उसका सही प्रतिस्थापन ${match[2]} है।`,
      `${match[1]} ਗਲਤ ਸਮੂਹ ਹੈ ਅਤੇ ਉਸ ਦਾ ਸਹੀ ਬਦਲ ${match[2]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^The required position is the (first|second) group of this pair, so it is (.+)\.$/))) {
    const whichHi = match[1] === "first" ? "पहला" : "दूसरा";
    const whichPa = match[1] === "first" ? "ਪਹਿਲਾ" : "ਦੂਜਾ";
    return ok(
      `आवश्यक स्थान इस युग्म का ${whichHi} समूह है, इसलिए उत्तर ${match[2]} है।`,
      `ਲੋੜੀਂਦਾ ਸਥਾਨ ਇਸ ਜੋੜੀ ਦਾ ${whichPa} ਸਮੂਹ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ${match[2]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^The required position in this row is (.+)\.$/))) {
    return ok(
      `इस पंक्ति के आवश्यक स्थान पर ${match[1]} आएगा।`,
      `ਇਸ ਕਤਾਰ ਦੇ ਲੋੜੀਂਦੇ ਸਥਾਨ ਉੱਤੇ ${match[1]} ਆਵੇਗਾ।`,
    );
  }
  if ((match = value.match(/^The required (\d+(?:st|nd|rd|th)) group is (.+)\.$/))) {
    return ok(
      `आवश्यक ${match[1]} समूह ${match[2]} है।`,
      `ਲੋੜੀਂਦਾ ${match[1]} ਸਮੂਹ ${match[2]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^The missing letters, read from left to right, are (.+)\.$/))) {
    return ok(
      `बाएँ से दाएँ लुप्त अक्षर ${match[1]} हैं।`,
      `ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਗੁੰਮ ਅੱਖਰ ${match[1]} ਹਨ।`,
    );
  }
  if ((match = value.match(/^The missing groups, from left to right, are (.+)\.$/))) {
    return ok(
      `बाएँ से दाएँ लुप्त समूह ${match[1]} हैं।`,
      `ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਗੁੰਮ ਸਮੂਹ ${match[1]} ਹਨ।`,
    );
  }
  if ((match = value.match(/^Missing groups: (.+)$/))) {
    return ok(`लुप्त समूह: ${match[1]}`, `ਗੁੰਮ ਸਮੂਹ: ${match[1]}`);
  }
  if ((match = value.match(/^Complete line: (.+)$/))) {
    return ok(`पूर्ण पंक्ति: ${match[1]}`, `ਪੂਰੀ ਲਾਈਨ: ${match[1]}`);
  }
  if ((match = value.match(/^Lengths: (.+)\.$/))) {
    return ok(`लंबाइयाँ: ${match[1]}।`, `ਲੰਬਾਈਆਂ: ${match[1]}।`);
  }
  if ((match = value.match(/^Starting letters: (.+)\. The letters inside every group run (forward|backward)\.$/))) {
    const directionHi = match[2] === "forward" ? "आगे" : "पीछे";
    const directionPa = match[2] === "forward" ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
    return ok(
      `आरंभिक अक्षर: ${match[1]}। प्रत्येक समूह के भीतर अक्षर ${directionHi} चलते हैं।`,
      `ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ: ${match[1]}। ਹਰ ਸਮੂਹ ਦੇ ਅੰਦਰ ਅੱਖਰ ${directionPa} ਚਲਦੇ ਹਨ।`,
    );
  }
  if ((match = value.match(/^New left-edge letters: (.+) \((.+) each time, with alphabet wraparound\)\.$/))) {
    return ok(
      `बाएँ किनारे पर जुड़ने वाले नए अक्षर: ${match[1]} (${match[2]} हर बार; वर्णमाला के अंत पर क्रम फिर आरंभ होता है)।`,
      `ਖੱਬੇ ਕਿਨਾਰੇ ਉੱਤੇ ਜੁੜਦੇ ਨਵੇਂ ਅੱਖਰ: ${match[1]} (${match[2]} ਹਰ ਵਾਰ; ਵਰਣਮਾਲਾ ਦੇ ਅੰਤ ਉੱਤੇ ਕ੍ਰਮ ਮੁੜ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ)।`,
    );
  }
  if ((match = value.match(/^New right-edge letters: (.+) \((.+) each time, with alphabet wraparound\)\.$/))) {
    return ok(
      `दाएँ किनारे पर जुड़ने वाले नए अक्षर: ${match[1]} (${match[2]} हर बार; वर्णमाला के अंत पर क्रम फिर आरंभ होता है)।`,
      `ਸੱਜੇ ਕਿਨਾਰੇ ਉੱਤੇ ਜੁੜਦੇ ਨਵੇਂ ਅੱਖਰ: ${match[1]} (${match[2]} ਹਰ ਵਾਰ; ਵਰਣਮਾਲਾ ਦੇ ਅੰਤ ਉੱਤੇ ਕ੍ਰਮ ਮੁੜ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ)।`,
    );
  }
  if ((match = value.match(/^Inserted-letter sequence: (.+) \((.+) each time, with alphabet wraparound\)\.$/))) {
    return ok(
      `जोड़े गए अक्षरों का क्रम: ${match[1]} (${match[2]} हर बार; वर्णमाला के अंत पर क्रम फिर आरंभ होता है)।`,
      `ਜੋੜੇ ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ: ${match[1]} (${match[2]} ਹਰ ਵਾਰ; ਵਰਣਮਾਲਾ ਦੇ ਅੰਤ ਉੱਤੇ ਕ੍ਰਮ ਮੁੜ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ)।`,
    );
  }
  if ((match = value.match(/^(Odd-position|Even-position) row: (.+)\.$/))) {
    const rowHi = match[1] === "Odd-position" ? "विषम स्थानों की पंक्ति" : "सम स्थानों की पंक्ति";
    const rowPa = match[1] === "Odd-position" ? "ਵਿਸ਼ਮ ਸਥਾਨਾਂ ਦੀ ਕਤਾਰ" : "ਸਮ ਸਥਾਨਾਂ ਦੀ ਕਤਾਰ";
    return ok(`${rowHi}: ${match[2]}।`, `${rowPa}: ${match[2]}।`);
  }
  if ((match = value.match(/^Row (\d+) \(positions (.+)\.\.\.\): (.+)\.$/))) {
    return ok(
      `पंक्ति ${match[1]} (स्थान ${match[2]}...): ${match[3]}।`,
      `ਕਤਾਰ ${match[1]} (ਸਥਾਨ ${match[2]}...): ${match[3]}।`,
    );
  }
  if ((match = value.match(/^(\d+(?:st|nd|rd|th)) letters: (.+) \((.+) each time\)\.$/))) {
    return ok(
      `${match[1]} स्थान के अक्षर: ${match[2]} (${match[3]} हर बार)।`,
      `${match[1]} ਸਥਾਨ ਦੇ ਅੱਖਰ: ${match[2]} (${match[3]} ਹਰ ਵਾਰ)।`,
    );
  }
  if ((match = value.match(/^(\d+(?:st|nd|rd|th)) letters: (.+)\.$/))) {
    return ok(
      `${match[1]} स्थान के अक्षर: ${match[2]}।`,
      `${match[1]} ਸਥਾਨ ਦੇ ਅੱਖਰ: ${match[2]}।`,
    );
  }
  if ((match = value.match(/^First locate (.+) in each term\. Its positions are (.+)\.$/))) {
    return ok(
      `पहले प्रत्येक समूह में ${match[1]} का स्थान देखें। इसके स्थान हैं: ${match[2]}।`,
      `ਪਹਿਲਾਂ ਹਰ ਸਮੂਹ ਵਿੱਚ ${match[1]} ਦਾ ਸਥਾਨ ਵੇਖੋ। ਇਸ ਦੇ ਸਥਾਨ ਹਨ: ${match[2]}।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+) establishes the movement; applying it once more gives (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]} से परिवर्तन स्पष्ट होता है; वही परिवर्तन एक बार और लगाने पर ${match[3]} मिलता है।`,
      `${match[1]} → ${match[2]} ਨਾਲ ਬਦਲਾਅ ਸਪਸ਼ਟ ਹੁੰਦਾ ਹੈ; ਉਹੀ ਬਦਲਾਅ ਇੱਕ ਵਾਰ ਹੋਰ ਲਗਾਉਣ ਨਾਲ ${match[3]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+) establishes the row movement\. Reverse that movement once to obtain the required previous group (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]} से पंक्ति का परिवर्तन स्पष्ट है। इसे एक बार उलटने पर आवश्यक पिछला समूह ${match[3]} मिलता है।`,
      `${match[1]} → ${match[2]} ਨਾਲ ਕਤਾਰ ਦਾ ਬਦਲਾਅ ਸਪਸ਼ਟ ਹੈ। ਇਸ ਨੂੰ ਇੱਕ ਵਾਰ ਉਲਟਣ ਨਾਲ ਲੋੜੀਂਦਾ ਪਿਛਲਾ ਸਮੂਹ ${match[3]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^The same movements change (.+) to (.+) and (.+) to (.+); therefore (.+) is verified from both sides\.$/))) {
    return ok(
      `एक ही परिवर्तन ${match[1]} को ${match[2]} और ${match[3]} को ${match[4]} बनाता है; इसलिए ${match[5]} दोनों ओर से सत्यापित है।`,
      `ਇੱਕੋ ਬਦਲਾਅ ${match[1]} ਨੂੰ ${match[2]} ਅਤੇ ${match[3]} ਨੂੰ ${match[4]} ਬਣਾਉਂਦਾ ਹੈ; ਇਸ ਲਈ ${match[5]} ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੋਂ ਸਾਬਤ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+) → (.+) follows the target row's stated movements; therefore the missing group is (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]} → ${match[3]} लक्षित पंक्ति के परिवर्तन का पालन करता है; इसलिए लुप्त समूह ${match[4]} है।`,
      `${match[1]} → ${match[2]} → ${match[3]} ਨਿਸ਼ਾਨਾ ਕਤਾਰ ਦੇ ਬਦਲਾਅ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ; ਇਸ ਲਈ ਗੁੰਮ ਸਮੂਹ ${match[4]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^Continue the established target-row movement from (.+) to obtain (.+)\.$/))) {
    return ok(
      `लक्षित पंक्ति के स्थापित परिवर्तन को ${match[1]} से आगे बढ़ाने पर ${match[2]} मिलता है।`,
      `ਨਿਸ਼ਾਨਾ ਕਤਾਰ ਦੇ ਸਥਾਪਿਤ ਬਦਲਾਅ ਨੂੰ ${match[1]} ਤੋਂ ਅੱਗੇ ਵਧਾਉਣ ਨਾਲ ${match[2]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^First groups of the four pairs: (.+)\. Every letter moves (\d+) places forward from one pair to the next\.$/))) {
    return ok(
      `चारों युग्मों के पहले समूह: ${match[1]}। एक युग्म से अगले युग्म तक हर अक्षर ${match[2]} स्थान आगे बढ़ता है।`,
      `ਚਾਰਾਂ ਜੋੜੀਆਂ ਦੇ ਪਹਿਲੇ ਸਮੂਹ: ${match[1]}। ਇੱਕ ਜੋੜੀ ਤੋਂ ਅਗਲੀ ਜੋੜੀ ਤੱਕ ਹਰ ਅੱਖਰ ${match[2]} ਸਥਾਨ ਅੱਗੇ ਵਧਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): move every letter (\d+) places forward\. This fixes the first group of the required pair as (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: हर अक्षर को ${match[3]} स्थान आगे बढ़ाने पर आवश्यक युग्म का पहला समूह ${match[4]} मिलता है।`,
      `${match[1]} → ${match[2]}: ਹਰ ਅੱਖਰ ਨੂੰ ${match[3]} ਸਥਾਨ ਅੱਗੇ ਵਧਾਉਣ ਨਾਲ ਲੋੜੀਂਦੀ ਜੋੜੀ ਦਾ ਪਹਿਲਾ ਸਮੂਹ ${match[4]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): moving every letter (\d+) places forward gives the first group of the next pair, confirming that the required first group is (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: हर अक्षर को ${match[3]} स्थान आगे बढ़ाने पर अगले युग्म का पहला समूह मिलता है; इससे आवश्यक पहला समूह ${match[4]} पुष्ट होता है।`,
      `${match[1]} → ${match[2]}: ਹਰ ਅੱਖਰ ਨੂੰ ${match[3]} ਸਥਾਨ ਅੱਗੇ ਵਧਾਉਣ ਨਾਲ ਅਗਲੀ ਜੋੜੀ ਦਾ ਪਹਿਲਾ ਸਮੂਹ ਮਿਲਦਾ ਹੈ; ਇਸ ਨਾਲ ਲੋੜੀਂਦਾ ਪਹਿਲਾ ਸਮੂਹ ${match[4]} ਪੱਕਾ ਹੁੰਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): move every letter (\d+) places forward\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: हर अक्षर को ${match[3]} स्थान आगे बढ़ाएँ।`,
      `${match[1]} → ${match[2]}: ਹਰ ਅੱਖਰ ਨੂੰ ${match[3]} ਸਥਾਨ ਅੱਗੇ ਵਧਾਓ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): replace every letter with its alphabet opposite(?:, then move the first (?:(\d+|one) )?letters? to the end)?\. Therefore, the pair is (.+), (.+)\.$/))) {
    const hasRotation = value.includes(", then move the first");
    const rotation = hasRotation
      ? match[3]
        ? translated(
            locale,
            ` और फिर पहले ${match[3]} अक्षरों को अंत में रखें`,
            ` ਅਤੇ ਫਿਰ ਪਹਿਲੇ ${match[3]} ਅੱਖਰਾਂ ਨੂੰ ਅੰਤ ਵਿੱਚ ਰੱਖੋ`,
          )
        : translated(
            locale,
            " और फिर पहले अक्षर को अंत में रखें",
            " ਅਤੇ ਫਿਰ ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਅੰਤ ਵਿੱਚ ਰੱਖੋ",
          )
      : "";
    return {
      text: translated(
        locale,
        `${match[1]} → ${match[2]}: प्रत्येक अक्षर को उसके वर्णमाला-विपरीत अक्षर से बदलें${rotation}। इसलिए युग्म ${match[4]}, ${match[5]} है।`,
        `${match[1]} → ${match[2]}: ਹਰ ਅੱਖਰ ਨੂੰ ਉਸ ਦੇ ਵਰਣਮਾਲਾ-ਵਿਰੋਧੀ ਅੱਖਰ ਨਾਲ ਬਦਲੋ${rotation}। ਇਸ ਲਈ ਜੋੜੀ ${match[4]}, ${match[5]} ਹੈ।`,
      ),
      fallback: false,
    };
  }
  if ((match = value.match(/^(.+) → (.+): reverse the order of all letters\. Therefore, the pair is (.+), (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: सभी अक्षरों का क्रम उलटें। इसलिए युग्म ${match[3]}, ${match[4]} है।`,
      `${match[1]} → ${match[2]}: ਸਾਰੇ ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟੋ। ਇਸ ਲਈ ਜੋੜੀ ${match[3]}, ${match[4]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): swap the (.+) letters, the (.+) letters, and so on\. Therefore, the pair is (.+), (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: ${match[3]} अक्षरों, फिर ${match[4]} अक्षरों की अदला-बदली करें और यही क्रम जारी रखें। इसलिए युग्म ${match[5]}, ${match[6]} है।`,
      `${match[1]} → ${match[2]}: ${match[3]} ਅੱਖਰਾਂ, ਫਿਰ ${match[4]} ਅੱਖਰਾਂ ਦੀ ਅਦਲਾ-ਬਦਲੀ ਕਰੋ ਅਤੇ ਇਹੀ ਕ੍ਰਮ ਜਾਰੀ ਰੱਖੋ। ਇਸ ਲਈ ਜੋੜੀ ${match[5]}, ${match[6]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): write the odd-position letters first and the even-position letters afterwards\. Therefore, the pair is (.+), (.+)\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: पहले विषम स्थानों के अक्षर और फिर सम स्थानों के अक्षर लिखें। इसलिए युग्म ${match[3]}, ${match[4]} है।`,
      `${match[1]} → ${match[2]}: ਪਹਿਲਾਂ ਵਿਸ਼ਮ ਸਥਾਨਾਂ ਦੇ ਅੱਖਰ ਅਤੇ ਫਿਰ ਸਮ ਸਥਾਨਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ। ਇਸ ਲਈ ਜੋੜੀ ${match[3]}, ${match[4]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^Use position order (.+); the letters are rearranged, not changed alphabetically\.$/))) {
    return ok(
      `स्थान-क्रम ${match[1]} का प्रयोग करें; अक्षर केवल पुनर्व्यवस्थित होते हैं, वर्णमाला के अनुसार बदलते नहीं।`,
      `ਸਥਾਨ-ਕ੍ਰਮ ${match[1]} ਵਰਤੋ; ਅੱਖਰ ਸਿਰਫ਼ ਮੁੜ-ਵਿਉਂਤੇ ਜਾਂਦੇ ਹਨ, ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਬਦਲੇ ਨਹੀਂ ਜਾਂਦੇ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): move the first (\d+) letters? to the end\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: पहले ${match[3]} अक्षरों को अंत में ले जाएँ।`,
      `${match[1]} → ${match[2]}: ਪਹਿਲੇ ${match[3]} ਅੱਖਰਾਂ ਨੂੰ ਅੰਤ ਵਿੱਚ ਲੈ ਜਾਓ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+): move the first letter to the end\.$/))) {
    return ok(
      `${match[1]} → ${match[2]}: पहले अक्षर को अंत में ले जाएँ।`,
      `${match[1]} → ${match[2]}: ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਅੰਤ ਵਿੱਚ ਲੈ ਜਾਓ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+) after removing (.+) from the (beginning|end)\.$/))) {
    const sideHi = match[4] === "beginning" ? "आरंभ" : "अंत";
    const sidePa = match[4] === "beginning" ? "ਸ਼ੁਰੂ" : "ਅੰਤ";
    return ok(
      `${sideHi} से ${match[3]} हटाने पर ${match[1]} → ${match[2]} मिलता है।`,
      `${sidePa} ਤੋਂ ${match[3]} ਹਟਾਉਣ ਨਾਲ ${match[1]} → ${match[2]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^Remove (.+) from place (\d+) of (.+) to recover the previous group (.+)\.$/))) {
    return ok(
      `${match[3]} के स्थान ${match[2]} से ${match[1]} हटाने पर पिछला समूह ${match[4]} मिलता है।`,
      `${match[3]} ਦੇ ਸਥਾਨ ${match[2]} ਤੋਂ ${match[1]} ਹਟਾਉਣ ਨਾਲ ਪਿਛਲਾ ਸਮੂਹ ${match[4]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) ends at (.+)\. Moving (forward|backward), skip (.+); the next group therefore starts at (.+) and contains (\d+) letters: (.+)\.$/))) {
    const directionHi = match[3] === "forward" ? "आगे" : "पीछे";
    const directionPa = match[3] === "forward" ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
    return ok(
      `${match[1]} का अंतिम अक्षर ${match[2]} है। ${directionHi} चलते हुए ${match[4]} छोड़ें; अगला समूह ${match[5]} से आरंभ होकर ${match[6]} अक्षरों का होगा: ${match[7]}।`,
      `${match[1]} ਦਾ ਆਖਰੀ ਅੱਖਰ ${match[2]} ਹੈ। ${directionPa} ਚਲਦੇ ਹੋਏ ${match[4]} ਛੱਡੋ; ਅਗਲਾ ਸਮੂਹ ${match[5]} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ${match[6]} ਅੱਖਰਾਂ ਦਾ ਹੋਵੇਗਾ: ${match[7]}।`,
    );
  }
  if ((match = value.match(/^(.+) ends at (.+)\. Moving (forward|backward), skip (.+) before (.+); therefore the required previous group is (.+)\.$/))) {
    const directionHi = match[3] === "forward" ? "आगे" : "पीछे";
    const directionPa = match[3] === "forward" ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
    const skippedHi = match[4] === "no letters"
      ? "कोई अक्षर नहीं"
      : match[4]!.replace(/ and /g, " और ");
    const skippedPa = match[4] === "no letters"
      ? "ਕੋਈ ਅੱਖਰ ਨਹੀਂ"
      : match[4]!.replace(/ and /g, " ਅਤੇ ");
    return ok(
      `${match[1]} का अंतिम अक्षर ${match[2]} है। ${directionHi} चलते हुए ${match[5]} से पहले ${skippedHi} छोड़ें; इसलिए आवश्यक पिछला समूह ${match[6]} है।`,
      `${match[1]} ਦਾ ਆਖਰੀ ਅੱਖਰ ${match[2]} ਹੈ। ${directionPa} ਚਲਦੇ ਹੋਏ ${match[5]} ਤੋਂ ਪਹਿਲਾਂ ${skippedPa} ਛੱਡੋ; ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਪਿਛਲਾ ਸਮੂਹ ${match[6]} ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) must come before (.+) because the same position order changes (.+) into (.+)\.$/))) {
    return ok(
      `${match[2]} से पहले ${match[1]} आएगा, क्योंकि वही स्थान-क्रम ${match[3]} को ${match[4]} में बदलता है।`,
      `${match[2]} ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਆਵੇਗਾ, ਕਿਉਂਕਿ ਉਹੀ ਸਥਾਨ-ਕ੍ਰਮ ${match[3]} ਨੂੰ ${match[4]} ਵਿੱਚ ਬਦਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^Marker positions: (.+)\.$/))) {
    return ok(`संकेतक के स्थान: ${match[1]}।`, `ਨਿਸ਼ਾਨ ਦੇ ਸਥਾਨ: ${match[1]}।`);
  }
  if ((match = value.match(/^The lowercase marker moves (\d+) place(?:s)? to the (right|left) each time, wrapping at the end\.$/))) {
    const sideHi = match[2] === "right" ? "दाएँ" : "बाएँ";
    const sidePa = match[2] === "right" ? "ਸੱਜੇ" : "ਖੱਬੇ";
    return ok(
      `छोटे अक्षर वाला संकेतक हर बार ${match[1]} स्थान ${sideHi} चलता है और सीमा पार करने पर दूसरी ओर से जारी रहता है।`,
      `ਛੋਟੇ ਅੱਖਰ ਵਾਲਾ ਨਿਸ਼ਾਨ ਹਰ ਵਾਰ ${match[1]} ਸਥਾਨ ${sidePa} ਚਲਦਾ ਹੈ ਅਤੇ ਹੱਦ ਪਾਰ ਕਰਨ ਉੱਤੇ ਦੂਜੇ ਪਾਸੇ ਤੋਂ ਜਾਰੀ ਰਹਿੰਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^At the required group, the lowercase marker must be at position (\d+), giving (.+)\.$/))) {
    return ok(
      `आवश्यक समूह में छोटे अक्षर वाला संकेतक स्थान ${match[1]} पर होना चाहिए; इससे ${match[2]} मिलता है।`,
      `ਲੋੜੀਂਦੇ ਸਮੂਹ ਵਿੱਚ ਛੋਟੇ ਅੱਖਰ ਵਾਲਾ ਨਿਸ਼ਾਨ ਸਥਾਨ ${match[1]} ਉੱਤੇ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ; ਇਸ ਨਾਲ ${match[2]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^At the required transition, the column jumps are (.+)\.$/))) {
    return ok(
      `आवश्यक चरण पर स्तंभों के परिवर्तन ${match[1]} हैं।`,
      `ਲੋੜੀਂਦੇ ਪੜਾਅ ਉੱਤੇ ਕਾਲਮਾਂ ਦੇ ਬਦਲਾਅ ${match[1]} ਹਨ।`,
    );
  }
  if ((match = value.match(/^Reverse the first set of jumps to obtain the previous group (.+)\.$/))) {
    return ok(
      `पहले परिवर्तन-समूह को उलटने पर पिछला समूह ${match[1]} मिलता है।`,
      `ਪਹਿਲੇ ਬਦਲਾਅ-ਸਮੂਹ ਨੂੰ ਉਲਟਣ ਨਾਲ ਪਿਛਲਾ ਸਮੂਹ ${match[1]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) → (.+) using those jumps, with alphabet wraparound where needed\.$/))) {
    return ok(
      `उन्हीं परिवर्तनों को लगाकर ${match[1]} → ${match[2]} मिलता है; आवश्यकता पर वर्णमाला का क्रम फिर आरंभ होता है।`,
      `ਉਹੀ ਬਦਲਾਅ ਲਗਾ ਕੇ ${match[1]} → ${match[2]} ਮਿਲਦਾ ਹੈ; ਲੋੜ ਪੈਣ ਉੱਤੇ ਵਰਣਮਾਲਾ ਦਾ ਕ੍ਰਮ ਮੁੜ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^(.+) \+ insert (.+) at place (\d+) = (.+)\.$/))) {
    return ok(
      `${match[1]} में स्थान ${match[3]} पर ${match[2]} जोड़ने से ${match[4]} मिलता है।`,
      `${match[1]} ਵਿੱਚ ਸਥਾਨ ${match[3]} ਉੱਤੇ ${match[2]} ਜੋੜਨ ਨਾਲ ${match[4]} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^Mark the boundary between the old and new patterns\. It moves (\d+) place(?:s)? toward the (right|left) each time\.$/))) {
    const sideHi = match[2] === "right" ? "दाएँ" : "बाएँ";
    const sidePa = match[2] === "right" ? "ਸੱਜੇ" : "ਖੱਬੇ";
    return ok(
      `पुराने और नए पैटर्न के बीच की सीमा चिह्नित करें। यह हर बार ${match[1]} स्थान ${sideHi} खिसकती है।`,
      `ਪੁਰਾਣੇ ਅਤੇ ਨਵੇਂ ਪੈਟਰਨ ਵਿਚਕਾਰ ਦੀ ਹੱਦ ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ। ਇਹ ਹਰ ਵਾਰ ${match[1]} ਸਥਾਨ ${sidePa} ਖਿਸਕਦੀ ਹੈ।`,
    );
  }
  if (value === "Mark the repeated block boundaries, then read each blank group from left to right.") {
    return ok(
      "दोहराए गए खंडों की सीमाएँ चिह्नित करें, फिर प्रत्येक रिक्त समूह को बाएँ से दाएँ पढ़ें।",
      "ਦੁਹਰਾਏ ਖੰਡਾਂ ਦੀਆਂ ਹੱਦਾਂ ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ, ਫਿਰ ਹਰ ਖਾਲੀ ਸਮੂਹ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਪੜ੍ਹੋ।",
    );
  }
  if (value === "Mark the repeating block boundaries before filling any blank.") {
    return ok(
      "किसी भी रिक्त स्थान को भरने से पहले दोहराते खंडों की सीमाएँ चिह्नित करें।",
      "ਕਿਸੇ ਵੀ ਖਾਲੀ ਥਾਂ ਨੂੰ ਭਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੁਹਰਾਉਂਦੇ ਖੰਡਾਂ ਦੀਆਂ ਹੱਦਾਂ ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ।",
    );
  }
  if (value === "Split the line into equal blocks and compare odd and even block positions.") {
    return ok(
      "पंक्ति को समान खंडों में बाँटें और विषम तथा सम खंड-स्थानों की तुलना करें।",
      "ਲਾਈਨ ਨੂੰ ਬਰਾਬਰ ਖੰਡਾਂ ਵਿੱਚ ਵੰਡੋ ਅਤੇ ਵਿਸ਼ਮ ਅਤੇ ਸਮ ਖੰਡ-ਸਥਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    );
  }
  if (value === "Write the groups one below another and follow each vertical position separately.") {
    return ok(
      "समूहों को एक-दूसरे के नीचे लिखें और प्रत्येक ऊर्ध्वाधर स्थान को अलग-अलग देखें।",
      "ਸਮੂਹਾਂ ਨੂੰ ਇੱਕ-ਦੂਜੇ ਦੇ ਹੇਠਾਂ ਲਿਖੋ ਅਤੇ ਹਰ ਲੰਬਕਾਰੀ ਸਥਾਨ ਨੂੰ ਵੱਖ-ਵੱਖ ਵੇਖੋ।",
    );
  }
  if (value === "Keep the same seven letters and move the first letter to the end each time. The series stops before any state repeats.") {
    return ok(
      "उन्हीं सात अक्षरों को रखें और हर बार पहले अक्षर को अंत में ले जाएँ। किसी अवस्था के दोहरने से पहले श्रृंखला समाप्त होती है।",
      "ਉਹੀ ਸੱਤ ਅੱਖਰ ਰੱਖੋ ਅਤੇ ਹਰ ਵਾਰ ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਅੰਤ ਵਿੱਚ ਲੈ ਜਾਓ। ਕਿਸੇ ਅਵਸਥਾ ਦੇ ਦੁਹਰਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਲੜੀ ਸਮਾਪਤ ਹੁੰਦੀ ਹੈ।",
    );
  }
  if (/^[A-Za-z]+ → [A-Za-z]+: (?:[A-Za-z]→[A-Za-z] \([+\-]?\d+\)(?:, )?)+\.$/.test(value)) {
    return { text: value, fallback: false };
  }
  if (/^[A-Za-z]+(?:\s*[+→=]\s*[A-Za-z]+)+(?:\.)?$/.test(value)) {
    return { text: value, fallback: false };
  }

  const exactRules: Readonly<Record<string, readonly [string, string]>> = {
    "Separate the odd-position and even-position groups. Use only the displayed terms in the row containing the blank.": [
      "विषम और सम स्थानों के समूह अलग करें। केवल उसी पंक्ति के दिखाए गए समूहों का प्रयोग करें जिसमें रिक्त स्थान है।",
      "ਵਿਸ਼ਮ ਅਤੇ ਸਮ ਸਥਾਨਾਂ ਦੇ ਸਮੂਹ ਵੱਖ ਕਰੋ। ਸਿਰਫ਼ ਉਸ ਕਤਾਰ ਦੇ ਦਿਖਾਏ ਸਮੂਹ ਵਰਤੋ ਜਿਸ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਹੈ।",
    ],
    "Follow each letter position separately. Its jump changes by a fixed amount at every step.": [
      "हर अक्षर-स्थान को अलग-अलग देखें। प्रत्येक चरण पर उसका परिवर्तन एक निश्चित मात्रा से बदलता है।",
      "ਹਰ ਅੱਖਰ-ਸਥਾਨ ਨੂੰ ਵੱਖ-ਵੱਖ ਵੇਖੋ। ਹਰ ਪੜਾਅ ਉੱਤੇ ਉਸ ਦਾ ਬਦਲਾਅ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮਾਤਰਾ ਨਾਲ ਬਦਲਦਾ ਹੈ।",
    ],
    "Read the groups from top to bottom by position. Each letter position has its own fixed jump.": [
      "समूहों को स्थान के अनुसार ऊपर से नीचे पढ़ें। प्रत्येक अक्षर-स्थान का अपना निश्चित परिवर्तन है।",
      "ਸਮੂਹਾਂ ਨੂੰ ਸਥਾਨ ਅਨੁਸਾਰ ਉੱਪਰ ਤੋਂ ਹੇਠਾਂ ਪੜ੍ਹੋ। ਹਰ ਅੱਖਰ-ਸਥਾਨ ਦਾ ਆਪਣਾ ਨਿਸ਼ਚਿਤ ਬਦਲਾਅ ਹੈ।",
    ],
    "The first and last letters form a fixed frame. Move each inner letter by the same amount.": [
      "पहला और अंतिम अक्षर स्थिर ढाँचा बनाते हैं। प्रत्येक भीतरी अक्षर को समान मात्रा से बदलें।",
      "ਪਹਿਲਾ ਅਤੇ ਆਖਰੀ ਅੱਖਰ ਸਥਿਰ ਢਾਂਚਾ ਬਣਾਉਂਦੇ ਹਨ। ਹਰ ਅੰਦਰਲੇ ਅੱਖਰ ਨੂੰ ਇੱਕੋ ਮਾਤਰਾ ਨਾਲ ਬਦਲੋ।",
    ],
    "Follow the first and last letters separately. The middle letters stay unchanged.": [
      "पहले और अंतिम अक्षर को अलग-अलग देखें। बीच के अक्षर अपरिवर्तित रहते हैं।",
      "ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਅੱਖਰ ਨੂੰ ਵੱਖ-ਵੱਖ ਵੇਖੋ। ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਬਦਲਦੇ ਨਹੀਂ।",
    ],
    "Remove one letter from the beginning each time.": [
      "हर बार आरंभ से एक अक्षर हटाएँ।",
      "ਹਰ ਵਾਰ ਸ਼ੁਰੂ ਤੋਂ ਇੱਕ ਅੱਖਰ ਹਟਾਓ।",
    ],
    "Remove one letter from the end each time.": [
      "हर बार अंत से एक अक्षर हटाएँ।",
      "ਹਰ ਵਾਰ ਅੰਤ ਤੋਂ ਇੱਕ ਅੱਖਰ ਹਟਾਓ।",
    ],
    "Remove one letter from the beginning, then one from the end, and repeat.": [
      "पहले आरंभ से एक अक्षर, फिर अंत से एक अक्षर हटाएँ और यही क्रम दोहराएँ।",
      "ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਤੋਂ ਇੱਕ ਅੱਖਰ, ਫਿਰ ਅੰਤ ਤੋਂ ਇੱਕ ਅੱਖਰ ਹਟਾਓ ਅਤੇ ਇਹੀ ਕ੍ਰਮ ਦੁਹਰਾਓ।",
    ],
    "Keep the uppercase background unchanged. Track only the position of the lowercase marker.": [
      "बड़े अक्षरों वाली पृष्ठभूमि को अपरिवर्तित रखें। केवल छोटे अक्षर वाले संकेतक का स्थान देखें।",
      "ਵੱਡੇ ਅੱਖਰਾਂ ਵਾਲੀ ਪਿਛੋਕੜ ਨੂੰ ਬਦਲੇ ਬਿਨਾਂ ਰੱਖੋ। ਸਿਰਫ਼ ਛੋਟੇ ਅੱਖਰ ਵਾਲੇ ਨਿਸ਼ਾਨ ਦਾ ਸਥਾਨ ਵੇਖੋ।",
    ],
  };
  const exact = exactRules[value];
  if (exact) return ok(exact[0], exact[1]);

  if ((match = value.match(/^Separate the series into (\d+) rows\. Use only displayed terms and the proposed answer inside the target row\.$/))) {
    return ok(
      `श्रृंखला को ${match[1]} पंक्तियों में अलग करें। लक्षित पंक्ति में केवल दिखाए गए समूह और प्रस्तावित उत्तर का प्रयोग करें।`,
      `ਲੜੀ ਨੂੰ ${match[1]} ਕਤਾਰਾਂ ਵਿੱਚ ਵੱਖ ਕਰੋ। ਨਿਸ਼ਾਨਾ ਕਤਾਰ ਵਿੱਚ ਸਿਰਫ਼ ਦਿਖਾਏ ਸਮੂਹ ਅਤੇ ਪ੍ਰਸਤਾਵਿਤ ਉੱਤਰ ਵਰਤੋ।`,
    );
  }
  if ((match = value.match(/^Move every letter in the group by (\d+) places (forward|backward) each time\.$/))) {
    const directionHi = match[2] === "forward" ? "आगे" : "पीछे";
    const directionPa = match[2] === "forward" ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
    return ok(
      `हर बार समूह के प्रत्येक अक्षर को ${match[1]} स्थान ${directionHi} बढ़ाएँ।`,
      `ਹਰ ਵਾਰ ਸਮੂਹ ਦੇ ਹਰ ਅੱਖਰ ਨੂੰ ${match[1]} ਸਥਾਨ ${directionPa} ਵਧਾਓ।`,
    );
  }
  if ((match = value.match(/^Each group contains consecutive letters and becomes one letter longer\. The same gap is kept before the next group starts\.$/))) {
    return ok(
      "हर समूह में क्रमागत अक्षर हैं और अगला समूह एक अक्षर लंबा होता है। अगले समूह के आरंभ से पहले समान अंतर रखा जाता है।",
      "ਹਰ ਸਮੂਹ ਵਿੱਚ ਲਗਾਤਾਰ ਅੱਖਰ ਹਨ ਅਤੇ ਅਗਲਾ ਸਮੂਹ ਇੱਕ ਅੱਖਰ ਲੰਮਾ ਹੁੰਦਾ ਹੈ। ਅਗਲੇ ਸਮੂਹ ਦੇ ਸ਼ੁਰੂ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕੋ ਅੰਤਰ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
    );
  }
  if ((match = value.match(/^Each group contains consecutive letters\. The group becomes one letter shorter, and the same number of letters is skipped before the next group starts\.$/))) {
    return ok(
      "हर समूह में क्रमागत अक्षर हैं। समूह एक अक्षर छोटा होता है और अगले समूह से पहले उतने ही अक्षर छोड़े जाते हैं।",
      "ਹਰ ਸਮੂਹ ਵਿੱਚ ਲਗਾਤਾਰ ਅੱਖਰ ਹਨ। ਸਮੂਹ ਇੱਕ ਅੱਖਰ ਛੋਟਾ ਹੁੰਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਸਮੂਹ ਤੋਂ ਪਹਿਲਾਂ ਉਨ੍ਹਾਂ ਹੀ ਅੱਖਰਾਂ ਨੂੰ ਛੱਡਿਆ ਜਾਂਦਾ ਹੈ।",
    );
  }
  if ((match = value.match(/^Keep the same seven letters and move the first (\d+|one) letters? to the end each time\. The series stops before any state repeats\.$/))) {
    return ok(
      `उन्हीं सात अक्षरों को रखें और हर बार पहले ${match[1]} अक्षर को अंत में ले जाएँ। किसी अवस्था के दोहरने से पहले श्रृंखला समाप्त होती है।`,
      `ਉਹੀ ਸੱਤ ਅੱਖਰ ਰੱਖੋ ਅਤੇ ਹਰ ਵਾਰ ਪਹਿਲੇ ${match[1]} ਅੱਖਰ ਨੂੰ ਅੰਤ ਵਿੱਚ ਲੈ ਜਾਓ। ਕਿਸੇ ਅਵਸਥਾ ਦੇ ਦੁਹਰਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਲੜੀ ਸਮਾਪਤ ਹੁੰਦੀ ਹੈ।`,
    );
  }
  if ((match = value.match(/^Keep the fixed beginning (.+)\. After it, keep the existing group and add the next letter of the same sequence at the end\.$/))) {
    return ok(
      `स्थिर आरंभ ${match[1]} को बनाए रखें। उसके बाद मौजूदा समूह को रखते हुए उसी क्रम का अगला अक्षर अंत में जोड़ें।`,
      `ਸਥਿਰ ਸ਼ੁਰੂਆਤ ${match[1]} ਨੂੰ ਕਾਇਮ ਰੱਖੋ। ਇਸ ਤੋਂ ਬਾਅਦ ਮੌਜੂਦਾ ਸਮੂਹ ਰੱਖਦੇ ਹੋਏ ਉਸੇ ਕ੍ਰਮ ਦਾ ਅਗਲਾ ਅੱਖਰ ਅੰਤ ਵਿੱਚ ਜੋੜੋ।`,
    );
  }
  if ((match = value.match(/^Keep the middle group unchanged and add one letter to each side\. The new left letter moves ([+\-]\d+) each time, while the new right letter moves ([+\-]\d+) each time\.$/))) {
    return ok(
      `बीच का समूह अपरिवर्तित रखें और दोनों ओर एक-एक अक्षर जोड़ें। नया बायाँ अक्षर हर बार ${match[1]} और नया दायाँ अक्षर हर बार ${match[2]} चलता है।`,
      `ਵਿਚਕਾਰਲਾ ਸਮੂਹ ਬਦਲੇ ਬਿਨਾਂ ਰੱਖੋ ਅਤੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਇੱਕ-ਇੱਕ ਅੱਖਰ ਜੋੜੋ। ਨਵਾਂ ਖੱਬਾ ਅੱਖਰ ਹਰ ਵਾਰ ${match[1]} ਅਤੇ ਨਵਾਂ ਸੱਜਾ ਅੱਖਰ ਹਰ ਵਾਰ ${match[2]} ਚਲਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^Keep all existing letters in the same order\. Insert (.+)\. The inserted letters follow a fixed ([+\-]\d+) alphabet progression: (.+)\.$/))) {
    return ok(
      `मौजूदा सभी अक्षरों का क्रम बनाए रखें। ${match[1]}। जोड़े गए अक्षर वर्णमाला में निश्चित ${match[2]} क्रम का पालन करते हैं: ${match[3]}।`,
      `ਮੌਜੂਦਾ ਸਾਰੇ ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਕਾਇਮ ਰੱਖੋ। ${match[1]}। ਜੋੜੇ ਅੱਖਰ ਵਰਣਮਾਲਾ ਵਿੱਚ ਨਿਸ਼ਚਿਤ ${match[2]} ਕ੍ਰਮ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ: ${match[3]}।`,
    );
  }
  if ((match = value.match(/^Keep the term length fixed\. At every step, change (\d+) more positions? from the old repeating pattern to the new repeating pattern, starting from the (left|right)\.$/))) {
    const sideHi = match[2] === "left" ? "बाएँ" : "दाएँ";
    const sidePa = match[2] === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ";
    return ok(
      `समूह की लंबाई स्थिर रखें। हर चरण पर ${sideHi} ओर से पुराने दोहराव-पैटर्न के ${match[1]} और स्थान नए पैटर्न में बदलें।`,
      `ਸਮੂਹ ਦੀ ਲੰਬਾਈ ਸਥਿਰ ਰੱਖੋ। ਹਰ ਪੜਾਅ ਉੱਤੇ ${sidePa} ਪਾਸੇ ਤੋਂ ਪੁਰਾਣੇ ਦੁਹਰਾਉਂਦੇ ਪੈਟਰਨ ਦੇ ${match[1]} ਹੋਰ ਸਥਾਨ ਨਵੇਂ ਪੈਟਰਨ ਵਿੱਚ ਬਦਲੋ।`,
    );
  }
  if ((match = value.match(/^Keep the background pattern fixed\. Move the marker (.+) (\d+) place(?:s)? to the (left|right) each time(?:, continuing from the other end when it crosses the boundary)?\.$/))) {
    const sideHi = match[3] === "left" ? "बाएँ" : "दाएँ";
    const sidePa = match[3] === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ";
    return ok(
      `पृष्ठभूमि-पैटर्न स्थिर रखें। संकेतक ${match[1]} को हर बार ${match[2]} स्थान ${sideHi} ले जाएँ; सीमा पार होने पर दूसरी ओर से जारी रखें।`,
      `ਪਿਛੋਕੜ-ਪੈਟਰਨ ਸਥਿਰ ਰੱਖੋ। ਨਿਸ਼ਾਨ ${match[1]} ਨੂੰ ਹਰ ਵਾਰ ${match[2]} ਸਥਾਨ ${sidePa} ਲੈ ਜਾਓ; ਹੱਦ ਪਾਰ ਹੋਣ ਉੱਤੇ ਦੂਜੇ ਪਾਸੇ ਤੋਂ ਜਾਰੀ ਰੱਖੋ।`,
    );
  }
  if ((match = value.match(/^The same block, (.+), repeats throughout the line\. Fill each visible gap group from left to right\.$/))) {
    return ok(
      `पूरी पंक्ति में ${match[1]} खंड दोहरता है। दिखाई दिए रिक्त समूहों को बाएँ से दाएँ भरें।`,
      `ਪੂਰੀ ਲਾਈਨ ਵਿੱਚ ${match[1]} ਖੰਡ ਦੁਹਰਾਉਂਦਾ ਹੈ। ਦਿਖਾਏ ਖਾਲੀ ਸਮੂਹਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਭਰੋ।`,
    );
  }
  if ((match = value.match(/^The same letter block, (.+), repeats throughout the line\.$/))) {
    return ok(
      `पूरी पंक्ति में ${match[1]} अक्षर-खंड दोहरता है।`,
      `ਪੂਰੀ ਲਾਈਨ ਵਿੱਚ ${match[1]} ਅੱਖਰ-ਖੰਡ ਦੁਹਰਾਉਂਦਾ ਹੈ।`,
    );
  }
  if ((match = value.match(/^Two (?:letter )?blocks repeat in turn: (.+)\.$/))) {
    return ok(
      `दो अक्षर-खंड बारी-बारी दोहरते हैं: ${match[1]}।`,
      `ਦੋ ਅੱਖਰ-ਖੰਡ ਵਾਰੀ-ਵਾਰੀ ਦੁਹਰਾਉਂਦੇ ਹਨ: ${match[1]}।`,
    );
  }
  if ((match = value.match(/^Read the groups in pairs\. Within each pair, (.+)\. From one pair to the next, every letter of the first group moves (\d+) places forward\.$/))) {
    return ok(
      `समूहों को युग्मों में पढ़ें। प्रत्येक युग्म में ${match[1]}। एक युग्म से अगले युग्म तक पहले समूह का हर अक्षर ${match[2]} स्थान आगे बढ़ता है।`,
      `ਸਮੂਹਾਂ ਨੂੰ ਜੋੜੀਆਂ ਵਿੱਚ ਪੜ੍ਹੋ। ਹਰ ਜੋੜੀ ਵਿੱਚ ${match[1]}। ਇੱਕ ਜੋੜੀ ਤੋਂ ਅਗਲੀ ਜੋੜੀ ਤੱਕ ਪਹਿਲੇ ਸਮੂਹ ਦਾ ਹਰ ਅੱਖਰ ${match[2]} ਸਥਾਨ ਅੱਗੇ ਵਧਦਾ ਹੈ।`,
    );
  }

  return {
    text: formulaFallback(value, locale),
    fallback: true,
  };
}

function translateReviewText(input: {
  readonly source: string;
  readonly englishStem: string;
  readonly localizedStem: string;
  readonly locale: SerCp007Locale;
}): {
  readonly text: string;
  readonly diagnostics: SerCp007LocalizationDiagnostics;
} {
  const sourceLines = input.source.split("\n");
  const englishStemLines = input.englishStem.split("\n");
  const localizedStemLines = input.localizedStem.split("\n");
  const output: string[] = [];
  const fallbackSources: string[] = [];
  let sourceLineCount = 0;
  let index = 0;

  const startsWithStem = englishStemLines.every(
    (line, stemIndex) => sourceLines[stemIndex] === line,
  );
  if (!startsWithStem) {
    throw new Error("Localized Series review no longer starts with the frozen English stem.");
  }
  output.push(...localizedStemLines);
  index = englishStemLines.length;

  for (; index < sourceLines.length; index += 1) {
    const line = sourceLines[index]!;
    const trimmed = line.trim();
    if (!trimmed) {
      output.push(line);
      continue;
    }
    if (/^[✓ ]\s*\d+\.\s+/.test(line)) {
      output.push(line);
      continue;
    }
    if ((/^\*\*Answer:\*\*/).test(trimmed)) {
      output.push(
        trimmed.replace(
          "**Answer:**",
          translated(input.locale, "**उत्तर:**", "**ਉੱਤਰ:**"),
        ),
      );
      continue;
    }
    if (trimmed === "### Explanation") {
      output.push(translated(input.locale, "### समाधान", "### ਹੱਲ"));
      continue;
    }
    if (trimmed === "<details>" || trimmed === "</details>") {
      output.push(trimmed);
      continue;
    }
    if (trimmed === "<summary><strong>Expanded help</strong></summary>") {
      output.push(
        translated(
          input.locale,
          "<summary><strong>विस्तृत सहायता</strong></summary>",
          "<summary><strong>ਵਿਸਥਾਰਿਤ ਮਦਦ</strong></summary>",
        ),
      );
      continue;
    }
    const heading = trimmed.match(/^\*\*(.+):\*\*$/);
    if (heading) {
      const localized = HEADING_TRANSLATIONS[heading[1]!]?.[input.locale];
      if (!localized) {
        fallbackSources.push(trimmed);
        output.push(`**${formulaFallback(heading[1]!, input.locale)}:**`);
      } else {
        output.push(`**${localized}:**`);
      }
      sourceLineCount += 1;
      continue;
    }
    const shortcut = trimmed.match(/^\*\*Shortcut:\*\*\s*(.+)$/);
    if (shortcut) {
      const result = translateCore(shortcut[1]!, input.locale);
      output.push(
        `${translated(input.locale, "**त्वरित विधि:**", "**ਤੇਜ਼ ਤਰੀਕਾ:**")} ${result.text}`,
      );
      sourceLineCount += 1;
      if (result.fallback) fallbackSources.push(shortcut[1]!);
      continue;
    }
    const numbered = trimmed.match(/^(\d+)\.\s*(.+)$/);
    if (numbered) {
      const result = translateCore(numbered[2]!, input.locale);
      output.push(`${numbered[1]}. ${result.text}`);
      sourceLineCount += 1;
      if (result.fallback) fallbackSources.push(numbered[2]!);
      continue;
    }
    const result = translateCore(trimmed, input.locale);
    output.push(result.text);
    sourceLineCount += 1;
    if (result.fallback) fallbackSources.push(trimmed);
  }

  return {
    text: output.join("\n"),
    diagnostics: Object.freeze({
      sourceLineCount,
      fallbackLineCount: fallbackSources.length,
      fallbackSourceLines: Object.freeze([...new Set(fallbackSources)]),
    }),
  };
}

function localizedQuestion(
  english: SerCp007PermanentEnglishPackage,
  locale: SerCp007Locale,
  localizedStem: string,
): SerCp007LocalizedQuestion {
  const explanation = english.question.explanation;
  return Object.freeze({
    ...english.question,
    locale,
    stem: localizedStem,
    explanation: Object.freeze({
      ...explanation,
      rule: translateCore(explanation.rule, locale).text,
      steps: Object.freeze(
        explanation.steps.map((step) => translateCore(step, locale).text),
      ),
      quickMethod: translateCore(explanation.quickMethod, locale).text,
      commonMistake: translateCore(explanation.commonMistake, locale).text,
      conclusion: translateCore(explanation.conclusion, locale).text,
    }),
  });
}

function localizedLifecycle(
  english: SerCp007PermanentEnglishPackage,
): SerCp007LocalizedLifecycle {
  return Object.freeze({
    permanentQlId: english.permanentQlId,
    identityStatus: "PERMANENT_ID_ALLOCATED" as const,
    englishStatus: "ENGLISH_FROZEN" as const,
    localizationStatus: "IMPLEMENTED_PENDING_MANUAL_REVIEW" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}

export function generateSerCp007PermanentLocalizedPackage(
  temporaryTemplateId: string,
  locale: SerCp007Locale,
  seed: number,
): SerCp007PermanentLocalizedPackage {
  const english = generateSerCp007PermanentEnglishPackage(
    temporaryTemplateId,
    seed,
  );
  const stem = localizeStem(english.question.stem, locale);
  const concise = translateReviewText({
    source: english.review.conciseReview,
    englishStem: english.review.stem,
    localizedStem: stem,
    locale,
  });
  const expanded = translateReviewText({
    source: english.review.expandedReview,
    englishStem: english.review.stem,
    localizedStem: stem,
    locale,
  });
  const fallbackSources = Object.freeze([
    ...new Set([
      ...concise.diagnostics.fallbackSourceLines,
      ...expanded.diagnostics.fallbackSourceLines,
    ]),
  ]);
  const diagnostics = Object.freeze({
    sourceLineCount:
      concise.diagnostics.sourceLineCount + expanded.diagnostics.sourceLineCount,
    fallbackLineCount:
      concise.diagnostics.fallbackLineCount + expanded.diagnostics.fallbackLineCount,
    fallbackSourceLines: fallbackSources,
  });
  const review: SerCp007LocalizedReview = Object.freeze({
    ...english.review,
    locale,
    stem,
    review: concise.text,
    conciseReview: concise.text,
    expandedReview: expanded.text,
    workedSteps: Object.freeze(
      english.review.workedSteps.map((step) => translateCore(step, locale).text),
    ),
    renderingContract: localizedRenderingContract(
      english.review.renderingContract,
      locale,
    ),
    localizationDiagnostics: diagnostics,
  });

  return Object.freeze({
    ...english,
    locale,
    localizationVersion: SER_CP007_LOCALIZATION_CANDIDATE_VERSION,
    question: localizedQuestion(english, locale, stem),
    review,
    reviewDecision: "PENDING_NATIVE_LANGUAGE_MANUAL_APPROVAL" as const,
    lifecycle: localizedLifecycle(english),
  });
}

export function regenerateSerCp007PermanentLocalizedPackage(input: {
  readonly temporaryTemplateId: string;
  readonly locale: SerCp007Locale;
  readonly seed: number;
  readonly subtypeId: string;
  readonly learnerRenderer: string;
}): SerCp007PermanentLocalizedPackage {
  const localized = generateSerCp007PermanentLocalizedPackage(
    input.temporaryTemplateId,
    input.locale,
    input.seed,
  );
  if (
    localized.frozenTemplateAuthority.subtypeId !== input.subtypeId ||
    localized.frozenTemplateAuthority.learnerRenderer !== input.learnerRenderer
  ) {
    throw new Error(
      `Stored localized Series subtype metadata does not match ${input.temporaryTemplateId}.`,
    );
  }
  return localized;
}
