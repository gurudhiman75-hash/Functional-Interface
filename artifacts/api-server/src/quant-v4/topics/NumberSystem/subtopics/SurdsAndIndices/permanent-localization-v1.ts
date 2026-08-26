import type { SriDiscoveryQuestion, SriHumanExplanation } from "./discovery-types";
import { generateSriPermanentEnglishQuestionV1 } from "./permanent-runtime-v1";
import type { SriPermanentQlId } from "./permanent-allocation-v1";
import {
  localizeSriLearnerTextV1 as localizeSriLearnerTextNaturalV1,
  type SriLocalizedLocaleV1,
  type SriLocalizedLanguageV1,
  type SriLocalizedDiscoveryQuestionV1,
  type SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-natural-v1";

export type {
  SriLocalizedLocaleV1,
  SriLocalizedLanguageV1,
  SriLocalizedDiscoveryQuestionV1,
  SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-natural-v1";

const LANGUAGE_BY_LOCALE: Record<SriLocalizedLocaleV1, SriLocalizedLanguageV1> = {
  "hi-IN": "Hindi",
  "pa-IN": "Punjabi",
};

const ZERO_EXPONENT_SENTENCE: Record<SriLocalizedLocaleV1, string> = {
  "hi-IN": "किसी भी शून्येतर संख्या की 0 घात 1 होती है।",
  "pa-IN": "ਕਿਸੇ ਵੀ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਸੰਖਿਆ ਦੀ 0 ਘਾਤ 1 ਹੁੰਦੀ ਹੈ।",
};

const CROSS_TERM_COMPARISON_SENTENCE: Record<SriLocalizedLocaleV1, string> = {
  "hi-IN": "दोनों धनात्मक व्यंजकों का वर्ग कीजिए। उनके परिमेय भाग समान हैं, इसलिए मिश्र पदों के सटीक गुणनफलों की तुलना कीजिए।",
  "pa-IN": "ਦੋਵੇਂ ਧਨਾਤਮਕ ਵਿਅੰਜਕਾਂ ਦਾ ਵਰਗ ਕਰੋ। ਉਨ੍ਹਾਂ ਦੇ ਪਰਿਮੇਯ ਭਾਗ ਇੱਕੋ ਹਨ, ਇਸ ਲਈ ਮਿਸ਼ਰਤ ਪਦਾਂ ਦੇ ਸਟੀਕ ਗੁਣਨਫਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
};

export function localizeSriLearnerTextV1(text: string, locale: SriLocalizedLocaleV1): string {
  if (text === "Any non-zero number raised to the power 0 equals 1.") {
    return ZERO_EXPONENT_SENTENCE[locale];
  }

  if (text === "Square both positive expressions. Their rational parts match, so compare the exact cross-term products.") {
    return CROSS_TERM_COMPARISON_SENTENCE[locale];
  }

  const denest = text.match(/^Denest (.+)\.$/u);
  if (denest) {
    return locale === "hi-IN"
      ? `${denest[1]} को सरल करणी रूप में लिखिए।`
      : `${denest[1]} ਨੂੰ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;
  }

  const crossTermRadicand = text.match(/^Second cross-term radicand: (.+)$/u);
  if (crossTermRadicand) {
    return locale === "hi-IN"
      ? `दूसरे मिश्र पद की करणीगत संख्या: ${crossTermRadicand[1]}`
      : `ਦੂਜੇ ਮਿਸ਼ਰਤ ਪਦ ਦੀ ਕਰਣੀਗਤ ਸੰਖਿਆ: ${crossTermRadicand[1]}`;
  }

  const extraction = text.match(/^Write (.+) after extracting the perfect (.+)-power factor\.$/u);
  if (extraction) {
    return locale === "hi-IN"
      ? `${extraction[1]} में पूर्ण ${extraction[2]} घात वाला गुणनखंड बाहर निकालकर लिखिए।`
      : `${extraction[1]} ਵਿੱਚ ਪੂਰਨ ${extraction[2]} ਘਾਤ ਵਾਲਾ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢ ਕੇ ਲਿਖੋ।`;
  }

  return localizeSriLearnerTextNaturalV1(text, locale);
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
