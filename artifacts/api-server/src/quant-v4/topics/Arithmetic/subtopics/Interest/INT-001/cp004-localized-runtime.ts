import {
  effectiveAnnualRate,
  type IntCp004QlId,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZATION_VERSION,
  languageForCp004Locale,
} from "./cp004-localization-language-pack";
import { localizeCp004Explanation } from "./cp004-localized-explanations";
import { remediateCp004LocalizedExplanationV3 } from "./cp004-localized-explanation-remediation-v3";
import { localizeCp004Options } from "./cp004-localized-options";
import { remediateCp004LocalizedOptions } from "./cp004-localized-editorial-v3";
import {
  remediateCp004LocalizedExplanationV4,
  remediateCp004LocalizedOptionsV4,
} from "./cp004-localized-editorial-v4";
import {
  humanizeCp004LocalizedExplanationV7,
  humanizeCp004LocalizedOptionV7,
  humanizeCp004LocalizedStemV7,
} from "./cp004-localized-human-editorial-v7";
import { renderCp004LocalizedNativeStemV6 } from "./cp004-localized-native-stems-v6";
import {
  INT_CP004_PRESENTATION_WAVE1_QL_IDS,
  renderCp004LocalizedPresentationWave1,
} from "./cp004-localized-presentation-wave1";
import {
  INT_CP004_PRESENTATION_WAVE2_QL_IDS,
  renderCp004LocalizedPresentationWave2,
} from "./cp004-localized-presentation-wave2";
import {
  INT_CP004_PRESENTATION_WAVE3_QL_IDS,
  renderCp004LocalizedPresentationWave3,
} from "./cp004-localized-presentation-wave3";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
  IntCp004LocalizedQuestion,
  IntCp004LocalizedRuntimeInput,
} from "./cp004-localization-types";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";

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

function includesQlId(ids: readonly IntCp004QlId[], qlId: IntCp004QlId): boolean {
  return ids.includes(qlId);
}

function hindiCreditInterval(frequency: string): string {
  switch (frequency) {
    case "वार्षिक": return "हर वर्ष";
    case "छमाही": return "हर छमाही";
    case "तिमाही": return "हर तिमाही";
    case "मासिक": return "हर महीने";
    default: return frequency;
  }
}

function polishHindi(text: string): string {
  let polished = text
    .replace(/कुल (\d+) तिमाहियाँ बाद/gu, "$1 तिमाहियों के बाद")
    .replace(/कुल (\d+) महीने बाद/gu, "$1 महीनों के बाद")
    .replace(/दी गई राशि या ब्याज से पूरा वृद्धि-गुणक हटाने पर/gu, "हर बार जुड़ी ब्याज-वृद्धि को उलटने पर")
    .replace(/दिए गए वृद्धि-गुणक तक पहुँचने के लिए/gu, "दी गई राशि तक पहुँचने के लिए")
    .replace(/अलग-अलग ब्याज-नियम/gu, "ब्याज जोड़ने के अलग-अलग नियम")
    .replace(/ब्याज-क्रम/gu, "ब्याज जोड़ने का क्रम")
    .replace(/ब्याज-नियम/gu, "ब्याज जोड़ने का नियम")
    .replace(/अवधियाँ = (\d+)/gu, "कुल $1 बार ब्याज जोड़ा गया")
    .replace(/अवधियों की संख्या/gu, "ब्याज जोड़ने की कुल संख्या")
    .replace(/हर अवधि/gu, "हर बार");

  polished = polished
    .replace(
      /शुरुआती (\d+) वर्ष में (वार्षिक|छमाही|तिमाही|मासिक) तथा बाद के (\d+) वर्ष में (वार्षिक|छमाही|तिमाही|मासिक) ब्याज-योग हुआ/gu,
      (_match, firstYears: string, firstFrequency: string, secondYears: string, secondFrequency: string) =>
        `शुरुआती ${firstYears} वर्ष में ब्याज ${hindiCreditInterval(firstFrequency)} और बाद के ${secondYears} वर्ष में ${hindiCreditInterval(secondFrequency)} जोड़ा गया`,
    )
    .replace(
      /पहले चरण में (वार्षिक|छमाही|तिमाही|मासिक) और दूसरे चरण में (वार्षिक|छमाही|तिमाही|मासिक) ब्याज-योग हुआ/gu,
      (_match, firstFrequency: string, secondFrequency: string) =>
        `पहले चरण में ब्याज ${hindiCreditInterval(firstFrequency)} और दूसरे चरण में ${hindiCreditInterval(secondFrequency)} जोड़ा गया`,
    )
    .replace(/ब्याज-योग (हर (?:वर्ष|छमाही|तिमाही|महीने)) था/gu, "ब्याज $1 जोड़ा जाता था")
    .replace(/ब्याज-योग के साथ/gu, "ब्याज जोड़ने पर")
    .replace(
      /(वार्षिक|छमाही|तिमाही|मासिक) ब्याज-योग होता है/gu,
      (_match, frequency: string) => `ब्याज ${hindiCreditInterval(frequency)} जोड़ा जाता है`,
    )
    .replace(
      /(वार्षिक|छमाही|तिमाही|मासिक) ब्याज-योग वाली/gu,
      (_match, frequency: string) => `${hindiCreditInterval(frequency)} ब्याज जोड़ने वाली`,
    )
    .replace(/ब्याज-योग हुआ/gu, "ब्याज जोड़ा गया")
    .replace(/ब्याज-योग/gu, "ब्याज जोड़ने की व्यवस्था");

  return polished;
}

function polishPunjabi(text: string): string {
  let polished = text
    .replace(/ਕੁੱਲ (\d+) ਤਿਮਾਹੀਆਂ ਬਾਅਦ/gu, "$1 ਤਿਮਾਹੀਆਂ ਤੋਂ ਬਾਅਦ")
    .replace(/ਕੁੱਲ (\d+) ਮਹੀਨੇ ਬਾਅਦ/gu, "$1 ਮਹੀਨਿਆਂ ਤੋਂ ਬਾਅਦ")
    .replace(/ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ/gu, "ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ")
    .replace(/ਦੋਵਾਂ ਅੰਤਿਮ ਰਕਮਾਂ/gu, "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ")
    .replace(/ਦਿੱਤੀ ਰਕਮ ਜਾਂ ਵਿਆਜ ਵਿੱਚੋਂ ਪੂਰਾ ਵਾਧਾ-ਗੁਣਕ ਹਟਾਉਣ ਉੱਤੇ/gu, "ਹਰ ਵਾਰ ਜੋੜੇ ਗਏ ਵਿਆਜ ਦਾ ਅਸਰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਹਟਾਉਣ ਉੱਤੇ")
    .replace(/ਦਿੱਤੀ ਰਕਮ ਜਾਂ ਵਿਆਜ ਨੂੰ ਪੂਰੇ ਵਿਆਜ-ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ/gu, "ਹਰ ਵਾਰ ਜੋੜੇ ਗਏ ਵਿਆਜ ਦਾ ਅਸਰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਹਟਾਉਣ ਉੱਤੇ")
    .replace(/ਦਿੱਤੇ ਵਾਧਾ-ਗੁਣਕ ਤੱਕ ਪਹੁੰਚਣ ਲਈ/gu, "ਦਿੱਤੀ ਰਕਮ ਤੱਕ ਪਹੁੰਚਣ ਲਈ")
    .replace(/ਵੱਖ-ਵੱਖ ਵਿਆਜ-ਨਿਯਮ/gu, "ਵਿਆਜ ਜੋੜਨ ਦੇ ਵੱਖ-ਵੱਖ ਨਿਯਮ")
    .replace(/ਵਿਆਜ-ਕ੍ਰਮ/gu, "ਵਿਆਜ ਜੋੜਨ ਦਾ ਕ੍ਰਮ")
    .replace(/ਵਿਆਜ-ਨਿਯਮ/gu, "ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ")
    .replace(/ਮਿਆਦਾਂ = (\d+)/gu, "ਕੁੱਲ $1 ਵਾਰ ਵਿਆਜ ਜੋੜਿਆ ਗਿਆ")
    .replace(/ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ/gu, "ਵਿਆਜ ਜੋੜਨ ਦੀ ਕੁੱਲ ਗਿਣਤੀ")
    .replace(/ਹਰ ਮਿਆਦ/gu, "ਹਰ ਵਾਰ")
    .replace(/ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu, "ਮਿਸ਼ਰਤ ਵਿਆਜ")
    .replace(/ਚੱਕਰਵੱਧੀ ਰਕਮ/gu, "ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ ਬਣੀ ਰਕਮ")
    .replace(/ਚੱਕਰਵੱਧੀ ਗੁਣਕ/gu, "ਵਿਆਜ ਜੋੜਨ ਦਾ ਗੁਣਕ")
    .replace(/ਚੱਕਰਵੱਧੀ ਕਰਨੀ ਹੈ/gu, "ਵਿਆਜ ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਨਾ ਹੈ")
    .replace(/ਚੱਕਰਵੱਧੀ ਦੇ ਹਰ ਪੜਾਅ/gu, "ਵਿਆਜ ਜੋੜਨ ਦੇ ਹਰ ਪੜਾਅ")
    .replace(/ਚੱਕਰਵੱਧੀ ਪੜਾਅ/gu, "ਵਿਆਜ ਜੋੜਨ ਦੇ ਪੜਾਅ")
    .replace(/ਚੱਕਰਵੱਧੀ ਨਾਲ/gu, "ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ")
    .replace(/ਚੱਕਰਵੱਧੀ/gu, "ਮਿਸ਼ਰਤ ਵਿਆਜ")
    .replace(/ਵਿਆਜ-ਗੁਣਕ/gu, "ਵਿਆਜ ਜੋੜਨ ਦਾ ਅਸਰ")
    .replace(/ਇੱਕ ਰਕਮ (₹[\d,.]+) ਨੂੰ/gu, "$1 ਦੀ ਰਕਮ ਨੂੰ")
    .replace(/ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਪਛਾਣੋ।/gu, "ਦੱਸੋ ਕਿ ਵਿਆਜ ਸਾਲ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ ਜੋੜਿਆ ਗਿਆ ਸੀ।");

  polished = polished
    .replace(
      /(\d+) ਸਾਲ ਪੂਰੇ ਸਾਲ ਅਤੇ/gu,
      (_match, rawCount: string) => Number(rawCount) === 1
        ? "1 ਪੂਰੇ ਸਾਲ ਦੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ"
        : `${rawCount} ਪੂਰੇ ਸਾਲਾਂ ਦੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ`,
    )
    .replace(
      /(\d+) ਮਹੀਨੇ ਵਾਧੂ ਸਮੇਂ ਬਾਅਦ/gu,
      (_match, rawCount: string) => `${rawCount} ਮਹੀਨਿਆਂ ਦੇ ਵਾਧੂ ਸਮੇਂ ਬਾਅਦ`,
    )
    .replace(
      /(\d+) ਮਹੀਨੇ (ਬਾਅਦ|ਦੇ ਅੰਤ|ਵਿੱਚ|ਤੱਕ|ਲਈ|ਦਾ|ਦੀ|ਦੇ|ਉੱਤੇ)/gu,
      (match, rawCount: string, postposition: string) => Number(rawCount) > 1
        ? `${rawCount} ਮਹੀਨਿਆਂ ${postposition}`
        : match,
    )
    .replace(
      /1 ਮਹੀਨਾ (ਬਾਅਦ|ਦੇ ਅੰਤ|ਵਿੱਚ|ਤੱਕ|ਲਈ|ਦਾ|ਦੀ|ਦੇ|ਉੱਤੇ)/gu,
      "1 ਮਹੀਨੇ $1",
    )
    .replace(
      /(\d+) ਸਾਲ (ਬਾਅਦ|ਦੇ ਅੰਤ|ਵਿੱਚ|ਤੱਕ|ਲਈ|ਦਾ|ਦੀ|ਦੇ|ਉੱਤੇ)/gu,
      (match, rawCount: string, postposition: string) => Number(rawCount) > 1
        ? `${rawCount} ਸਾਲਾਂ ${postposition}`
        : match,
    )
    .replace(
      /ਦੋਵੇਂ ਪੜਾਅ ਕ੍ਰਮਵਾਰ (\d+) ਸਾਲ ਅਤੇ (\d+) ਸਾਲਾਂ ਦੇ ਹਨ/gu,
      (_match, firstYears: string, secondYears: string) =>
        `ਦੋਵੇਂ ਪੜਾਅ ਕ੍ਰਮਵਾਰ ${firstYears} ਅਤੇ ${secondYears} ਸਾਲਾਂ ਦੇ ਹਨ`,
    );

  return polished;
}

function polishLocalizedText(locale: IntCp004LocalizedLocale, text: string): string {
  return locale === "hi-IN" ? polishHindi(text) : polishPunjabi(text);
}

function legacyLocalizedStem(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (includesQlId(INT_CP004_PRESENTATION_WAVE1_QL_IDS, source.qlId)) {
    return renderCp004LocalizedPresentationWave1(source, locale);
  }
  if (includesQlId(INT_CP004_PRESENTATION_WAVE2_QL_IDS, source.qlId)) {
    return renderCp004LocalizedPresentationWave2(source, locale);
  }
  if (includesQlId(INT_CP004_PRESENTATION_WAVE3_QL_IDS, source.qlId)) {
    return renderCp004LocalizedPresentationWave3(source, locale);
  }
  throw new Error(`${source.qlId}: no CP-004 localized presentation owner.`);
}

function localizedStem(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  // The old presentation owners stay executable for parity regression, but
  // learner-facing wording is owned by the native stem and human-editorial layers.
  legacyLocalizedStem(source, locale);
  const nativeStem = polishLocalizedText(locale, renderCp004LocalizedNativeStemV6(source, locale));
  return humanizeCp004LocalizedStemV7(source, locale, nativeStem);
}

function cleanExplanation(
  source: IntCp004EnglishFrozenQuestion,
  explanation: IntCp004LocalizedExplanation,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  const duplicate = locale === "hi-IN" ? "अंतिम उत्तर: अंतिम उत्तर:" : "ਅੰਤਿਮ ਉੱਤਰ: ਅੰਤਿਮ ਉੱਤਰ:";
  const single = locale === "hi-IN" ? "अंतिम उत्तर:" : "ਅੰਤਿਮ ਉੱਤਰ:";
  const effective = effectiveAnnualRate(
    source.mathematicalState.nominalAnnualRatePercent,
    source.mathematicalState.frequency,
  );
  const correctedEffectiveRateStep = locale === "hi-IN"
    ? `₹100 पर एक वर्ष में ब्याज ${moneyText(effective)} है; इसलिए प्रभावी वार्षिक दर ${percentText(effective)} है।`
    : `₹100 ਉੱਤੇ ਇੱਕ ਸਾਲ ਵਿੱਚ ਵਿਆਜ ${moneyText(effective)} ਹੈ; ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effective)} ਹੈ।`;
  const unitSafeSteps = source.qlId === "INT-QL-076"
    ? explanation.steps.map((step) => /₹100[^\n]*=[^\n]*%/u.test(step) ? correctedEffectiveRateStep : step)
    : explanation.steps;

  return Object.freeze({
    whatAsked: polishLocalizedText(locale, explanation.whatAsked),
    steps: Object.freeze(unitSafeSteps.map((step) => polishLocalizedText(locale, step))),
    finalAnswer: polishLocalizedText(locale, explanation.finalAnswer.replace(duplicate, single)),
    commonMistake: polishLocalizedText(locale, explanation.commonMistake),
  });
}

export function localizeIntCp004EnglishFrozenQuestion(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedQuestion {
  const language = languageForCp004Locale(locale);
  const stem = localizedStem(source, locale);
  const baseOptions = localizeCp004Options(source, locale);
  const editorialV3Options = remediateCp004LocalizedOptions(baseOptions, locale);
  const editorialV4Options = remediateCp004LocalizedOptionsV4(source, editorialV3Options, locale);
  const options = Object.freeze(editorialV4Options.map((option) => humanizeCp004LocalizedOptionV7(
    source,
    locale,
    Object.freeze({
      ...option,
      feedback: polishLocalizedText(locale, option.feedback),
    }),
  )));
  const correctAnswer = options[source.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${source.qlId}/${source.seed}/${locale}: localized correct answer is missing.`);
  const baseExplanation = localizeCp004Explanation(source, locale);
  const editorialV3Explanation = remediateCp004LocalizedExplanationV3(source, locale, baseExplanation);
  const explanation = humanizeCp004LocalizedExplanationV7(
    source,
    locale,
    cleanExplanation(
      source,
      remediateCp004LocalizedExplanationV4(source, locale, editorialV3Explanation),
      locale,
    ),
  );

  const lifecycle = {
    permanentQlId: source.qlId,
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  } as const;

  const localized: IntCp004LocalizedQuestion = {
    ...source,
    locale,
    language,
    stem,
    options,
    correctAnswer,
    explanation,
    editorialStatus: "MULTILINGUAL_LOCALISATION_REVIEW",
    approvalStatus: "LOCALIZED_REVIEW_REQUIRED",
    allocationStatus: "INACTIVE_LOCALISATION_REVIEW",
    lifecycle,
    localization: {
      localizationVersion: INT_CP004_LOCALIZATION_VERSION,
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalFreezeId: source.freezeId,
      canonicalSeed: source.seed,
      canonicalQlId: source.qlId,
      locale,
      language,
      status: "EXECUTABLE_REVIEW_REQUIRED",
      mathematicalStatePreserved: true,
      solutionPreserved: true,
      optionValuesPreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionIdsPreserved: true,
      representationPreserved: true,
      stemFamilyPreserved: true,
      explanationStructurePreserved: true,
      lifecycleLocked: true,
    },
  };

  return deepFreeze(localized);
}

export function generateIntCp004LocalizedQuestion(
  input: IntCp004LocalizedRuntimeInput,
): IntCp004LocalizedQuestion {
  const source = generateIntCp004EnglishFrozenQuestion(input.qlId, input.seed);
  return localizeIntCp004EnglishFrozenQuestion(source, input.locale);
}
