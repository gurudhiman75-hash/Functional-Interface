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
  renderCp004LocalizedEditorialV4Stem,
} from "./cp004-localized-editorial-v4";
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

function balanceRecordFirstLabel(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-069": return "अंतिम राशि";
      case "INT-QL-070": return "दिया गया चक्रवृद्धि ब्याज";
      case "INT-QL-077": return "प्रभावी वार्षिक दर";
      case "INT-QL-081": return "वार्षिक ब्याज दर";
      default: return "मूलधन";
    }
  }
  switch (source.qlId) {
    case "INT-QL-069": return "ਅੰਤਿਮ ਰਕਮ";
    case "INT-QL-070": return "ਦਿੱਤਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ";
    case "INT-QL-077": return "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ";
    case "INT-QL-081": return "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ";
    default: return "ਮੂਲਧਨ";
  }
}

function polishLocalizedStem(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  stem: string,
): string {
  let polished = locale === "hi-IN"
    ? stem.replace("**ज्ञात कीजिए:**", "**प्रश्न:**")
    : stem.replace("**ਪਤਾ ਲਗਾਓ:**", "**ਪ੍ਰਸ਼ਨ:**");

  if (source.representation === "BALANCE_RECORD") {
    const genericLabel = locale === "hi-IN" ? "| आरंभिक प्रविष्टि |" : "| ਸ਼ੁਰੂਆਤੀ ਦਰਜ |";
    polished = polished.replace(
      genericLabel,
      `| ${balanceRecordFirstLabel(source, locale)} |`,
    );
  }
  return polished;
}

function localizedStem(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  // Keep the legacy renderer reachable for ownership regression, while the
  // learner-facing runtime is rebuilt by the human-language editorial layer.
  legacyLocalizedStem(source, locale);
  return polishLocalizedStem(
    source,
    locale,
    renderCp004LocalizedEditorialV4Stem(source, locale),
  );
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
  const steps = source.qlId === "INT-QL-076"
    ? explanation.steps.map((step) => /₹100[^\n]*=[^\n]*%/u.test(step) ? correctedEffectiveRateStep : step)
    : explanation.steps;

  return Object.freeze({
    whatAsked: explanation.whatAsked,
    steps: Object.freeze([...steps]),
    finalAnswer: explanation.finalAnswer.replace(duplicate, single),
    commonMistake: explanation.commonMistake,
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
  const options = remediateCp004LocalizedOptionsV4(source, editorialV3Options, locale);
  const correctAnswer = options[source.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${source.qlId}/${source.seed}/${locale}: localized correct answer is missing.`);
  const baseExplanation = localizeCp004Explanation(source, locale);
  const editorialV3Explanation = remediateCp004LocalizedExplanationV3(source, locale, baseExplanation);
  const explanation = cleanExplanation(
    source,
    remediateCp004LocalizedExplanationV4(source, locale, editorialV3Explanation),
    locale,
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
