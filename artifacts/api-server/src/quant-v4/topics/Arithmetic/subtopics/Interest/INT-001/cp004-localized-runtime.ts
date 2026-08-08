import type { IntCp004QlId } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZATION_VERSION,
  languageForCp004Locale,
} from "./cp004-localization-language-pack";
import { localizeCp004Explanation } from "./cp004-localized-explanations";
import { remediateCp004LocalizedExplanationV3 } from "./cp004-localized-explanation-remediation-v3";
import { localizeCp004Options } from "./cp004-localized-options";
import {
  remediateCp004LocalizedOptions,
  renderCp004LocalizedEditorialV3Stem,
} from "./cp004-localized-editorial-v3";
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

function localizedStem(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  // Keep the legacy renderer reachable for ownership regression, while the
  // learner-facing runtime is rebuilt by the human-language editorial layer.
  legacyLocalizedStem(source, locale);
  return renderCp004LocalizedEditorialV3Stem(source, locale);
}

export function localizeIntCp004EnglishFrozenQuestion(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedQuestion {
  const language = languageForCp004Locale(locale);
  const stem = localizedStem(source, locale);
  const baseOptions = localizeCp004Options(source, locale);
  const options = remediateCp004LocalizedOptions(baseOptions, locale);
  const correctAnswer = options[source.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${source.qlId}/${source.seed}/${locale}: localized correct answer is missing.`);
  const baseExplanation = localizeCp004Explanation(source, locale);
  const explanation = remediateCp004LocalizedExplanationV3(source, locale, baseExplanation);

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
