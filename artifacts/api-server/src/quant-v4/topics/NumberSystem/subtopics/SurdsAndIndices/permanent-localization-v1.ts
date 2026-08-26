import type { SriDiscoveryQuestion, SriHumanExplanation } from "./discovery-types";
import { generateSriPermanentEnglishQuestionV1 } from "./permanent-runtime-v1";
import type { SriPermanentQlId } from "./permanent-allocation-v1";
import {
  localizeSriLearnerTextV1 as localizeSriLearnerTextBaseV1,
  type SriLocalizedLocaleV1,
  type SriLocalizedLanguageV1,
  type SriLocalizedDiscoveryQuestionV1,
  type SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-base-v1";

export type {
  SriLocalizedLocaleV1,
  SriLocalizedLanguageV1,
  SriLocalizedDiscoveryQuestionV1,
  SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-base-v1";

const LANGUAGE_BY_LOCALE: Record<SriLocalizedLocaleV1, SriLocalizedLanguageV1> = {
  "hi-IN": "Hindi",
  "pa-IN": "Punjabi",
};

const EXACT_OVERRIDES: Record<SriLocalizedLocaleV1, Readonly<Record<string, string>>> = {
  "hi-IN": {
    "Simplify the power expression using the applicable law.": "उपयुक्त घातांक नियम का उपयोग करके व्यंजक को सरल कीजिए।",
    "Combine same-base factors by adding numerator exponents and subtracting the denominator exponent.": "समान आधार वाले गुणनखंडों में अंश के घातांक जोड़कर और हर का घातांक घटाकर सरल कीजिए।",
    "Any non-zero number raised to the power 0 equals 1.": "किसी भी शून्येतर संख्या की शून्य घात 1 होती है।",
    "Match A=m+n and B=mn, then use √(A+2√B)=√m+√n.": "A=m+n और B=mn का मिलान कीजिए, फिर √(A+2√B)=√m+√n का उपयोग कीजिए।",
    "Match A=m+n and B=mn, with m≥n, then use √(A−2√B)=√m−√n.": "A=m+n और B=mn का मिलान कीजिए, जहाँ m≥n, फिर √(A−2√B)=√m−√n का उपयोग कीजिए।",
  },
  "pa-IN": {
    "Simplify the power expression using the applicable law.": "ਉਚਿਤ ਘਾਤਾਂਕ ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵਿਅੰਜਕ ਨੂੰ ਸਰਲ ਕਰੋ।",
    "Combine same-base factors by adding numerator exponents and subtracting the denominator exponent.": "ਇੱਕੋ ਅਧਾਰ ਵਾਲੇ ਗੁਣਨਖੰਡਾਂ ਵਿੱਚ ਅੰਸ਼ ਦੇ ਘਾਤਾਂਕ ਜੋੜ ਕੇ ਅਤੇ ਹਰ ਦਾ ਘਾਤਾਂਕ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ।",
    "Any non-zero number raised to the power 0 equals 1.": "ਕਿਸੇ ਵੀ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਸੰਖਿਆ ਦੀ ਸਿਫ਼ਰ ਘਾਤ 1 ਹੁੰਦੀ ਹੈ।",
    "Match A=m+n and B=mn, then use √(A+2√B)=√m+√n.": "A=m+n ਅਤੇ B=mn ਦਾ ਮਿਲਾਨ ਕਰੋ, ਫਿਰ √(A+2√B)=√m+√n ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    "Match A=m+n and B=mn, with m≥n, then use √(A−2√B)=√m−√n.": "A=m+n ਅਤੇ B=mn ਦਾ ਮਿਲਾਨ ਕਰੋ, ਜਿੱਥੇ m≥n, ਫਿਰ √(A−2√B)=√m−√n ਦੀ ਵਰਤੋਂ ਕਰੋ।",
  },
};

const PREFIX_OVERRIDES: Record<SriLocalizedLocaleV1, readonly (readonly [string, string])[]> = {
  "hi-IN": [
    ["The given expression is ", "दिया गया व्यंजक है "],
    ["Therefore the expression is ", "अतः व्यंजक है "],
    ["Without decimals, decide the truth of: ", "दशमलव का प्रयोग किए बिना, कथनों की सत्यता निर्धारित कीजिए: "],
    ["Denest ", "नेस्टेड करणी को सरल रूप में लिखिए "],
  ],
  "pa-IN": [
    ["The given expression is ", "ਦਿੱਤਾ ਗਿਆ ਵਿਅੰਜਕ ਹੈ "],
    ["Therefore the expression is ", "ਇਸ ਲਈ ਵਿਅੰਜਕ ਹੈ "],
    ["Without decimals, decide the truth of: ", "ਦਸ਼ਮਲਵ ਵਰਤੇ ਬਿਨਾਂ, ਕਥਨਾਂ ਦੀ ਸੱਚਾਈ ਨਿਰਧਾਰਤ ਕਰੋ: "],
    ["Denest ", "ਨੇਸਟਡ ਕਰਣੀ ਨੂੰ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ "],
  ],
};

export function localizeSriLearnerTextV1(text: string, locale: SriLocalizedLocaleV1): string {
  const exact = EXACT_OVERRIDES[locale][text];
  if (exact) return exact;

  let prepared = text;
  for (const [source, target] of PREFIX_OVERRIDES[locale]) {
    if (prepared.startsWith(source)) {
      prepared = target + prepared.slice(source.length);
      break;
    }
  }
  return localizeSriLearnerTextBaseV1(prepared, locale);
}

export function localizeSriDiscoveryQuestionV1(
  source: SriDiscoveryQuestion,
  locale: SriLocalizedLocaleV1,
): SriLocalizedDiscoveryQuestionV1 {
  const answer = {
    ...source.answer,
    text: localizeSriLearnerTextV1(source.answer.text, locale),
  };
  const options = source.options.map((option) => ({
    ...option,
    text: localizeSriLearnerTextV1(option.text, locale),
  })) as unknown as SriDiscoveryQuestion["options"];
  const explanation: SriHumanExplanation = {
    given: localizeSriLearnerTextV1(source.explanation.given, locale),
    asked: localizeSriLearnerTextV1(source.explanation.asked, locale),
    method: localizeSriLearnerTextV1(source.explanation.method, locale),
    working: source.explanation.working.map((line) => localizeSriLearnerTextV1(line, locale)),
    answer: localizeSriLearnerTextV1(source.explanation.answer, locale),
  };
  return deepFreeze({
    ...source,
    stem: localizeSriLearnerTextV1(source.stem, locale),
    answer,
    options,
    explanation,
  });
}

export function generateSriPermanentLocalizedQuestionV1(
  qlId: SriPermanentQlId,
  externalSeed: string,
  locale: SriLocalizedLocaleV1,
): SriPermanentLocalizedQuestionV1 {
  const english = generateSriPermanentEnglishQuestionV1(qlId, externalSeed);
  const question = localizeSriDiscoveryQuestionV1(english.question, locale);
  return deepFreeze({
    packageId: english.packageId,
    checkpointId: english.checkpointId,
    permanentQlId: english.permanentQlId,
    permanentSolveModeId: english.permanentSolveModeId,
    retainedGroupId: english.retainedGroupId,
    englishQlTitle: english.qlTitle,
    locale,
    language: LANGUAGE_BY_LOCALE[locale],
    externalSeed,
    sourceCandidateId: english.sourceCandidateId,
    sourceCheckpointId: english.sourceCheckpointId,
    sourceSeed: english.sourceSeed,
    englishFingerprint: english.englishFingerprint,
    question,
    lifecycle: {
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "LOCALIZATION_REVIEW_READY" as const,
      localizationStatus: "REVIEW_READY" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionStudioGenerationEnabled: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}
