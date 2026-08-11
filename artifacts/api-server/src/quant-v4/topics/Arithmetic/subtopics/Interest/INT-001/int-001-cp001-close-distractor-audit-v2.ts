import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  generateIntCp001ReadableEnglishQuestion,
  generateIntCp001ReadableLocalizedQuestion,
} from "./cp001-readable-stem-runtime";
import {
  generateIntCp001CloseDistractorEnglishQuestion,
  generateIntCp001CloseDistractorLocalizedQuestion,
} from "./cp001-close-distractor-runtime-v2";
import { rationalKey } from "./foundation/rational";
import { isRational } from "./cp001-localization-foundation";

type Language = "en" | "hi" | "pa";

function fail(message: string): never {
  throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function invariantProjection(item: Record<string, unknown>): Record<string, unknown> {
  const {
    releaseId: _releaseId,
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    options: _options,
    optionAudit: _optionAudit,
    validation: _validation,
    distractorEditorialTrace: _distractorEditorialTrace,
    explanation,
    ...rest
  } = item;
  const explanationRecord = explanation as Record<string, unknown>;
  const { trapAnalysis: _trapAnalysis, ...explanationRest } = explanationRecord;
  return { ...rest, explanation: explanationRest };
}

function resultKey(item: { semantic: string; value: unknown }): string {
  if (!isRational(item.value)) fail(`Non-rational option result for semantic ${item.semantic}.`);
  return `${item.semantic}:${rationalKey(item.value)}`;
}

function generateReadable(qlId: IntCp001FinalQlId, seed: string, language: Language) {
  return language === "en"
    ? generateIntCp001ReadableEnglishQuestion(qlId, seed)
    : generateIntCp001ReadableLocalizedQuestion(qlId, seed, language);
}

function generateClose(qlId: IntCp001FinalQlId, seed: string, language: Language) {
  return language === "en"
    ? generateIntCp001CloseDistractorEnglishQuestion(qlId, seed)
    : generateIntCp001CloseDistractorLocalizedQuestion(qlId, seed, language);
}

const languages: Language[] = ["en", "hi", "pa"];
const seeds = Array.from({ length: 80 }, (_item, index) => `close-distractor-${index}`);

let generatedQuestions = 0;
let invariantChecks = 0;
let deterministicChecks = 0;
let proximityChecks = 0;
let lifecycleChecks = 0;
let multilingualParityChecks = 0;
let retainedConceptDistractors = 0;
let generatedNearMisses = 0;
let maximumRelativeDistanceBps = 0;
const byLanguage: Record<Language, { generated: number; retained: number; nearMisses: number; maxBps: number }> = {
  en: { generated: 0, retained: 0, nearMisses: 0, maxBps: 0 },
  hi: { generated: 0, retained: 0, nearMisses: 0, maxBps: 0 },
  pa: { generated: 0, retained: 0, nearMisses: 0, maxBps: 0 },
};

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (const seed of seeds) {
    const candidates = new Map<Language, ReturnType<typeof generateClose>>();
    for (const language of languages) {
      const readable = generateReadable(qlId, seed, language);
      const candidate = generateClose(qlId, seed, language);
      const repeated = generateClose(qlId, seed, language);
      candidates.set(language, candidate);
      generatedQuestions += 1;
      byLanguage[language].generated += 1;

      if (!candidate.validation.ok) {
        fail(`${qlId}/${seed}/${language}: ${candidate.validation.errors.join(" | ")}`);
      }
      if (stable(candidate) !== stable(repeated)) {
        fail(`${qlId}/${seed}/${language}: close-distractor generation is not deterministic.`);
      }
      deterministicChecks += 1;

      if (stable(invariantProjection(candidate as unknown as Record<string, unknown>))
        !== stable(invariantProjection(readable as unknown as Record<string, unknown>))) {
        fail(`${qlId}/${seed}/${language}: a non-option invariant changed.`);
      }
      if (candidate.stem !== readable.stem) fail(`${qlId}/${seed}/${language}: stem changed during distractor patch.`);
      if (candidate.correctIndex !== readable.correctIndex) fail(`${qlId}/${seed}/${language}: correct index changed.`);
      if (candidate.options[candidate.correctIndex] !== readable.options[readable.correctIndex]) {
        fail(`${qlId}/${seed}/${language}: correct option text changed.`);
      }
      if (resultKey(candidate.optionAudit[candidate.correctIndex]!.result)
        !== resultKey(readable.optionAudit[readable.correctIndex]!.result)) {
        fail(`${qlId}/${seed}/${language}: correct result changed.`);
      }
      invariantChecks += 1;

      if (candidate.options.length !== 4 || new Set(candidate.options).size !== 4) {
        fail(`${qlId}/${seed}/${language}: options are not four-way unique.`);
      }
      if (candidate.explanation.trapAnalysis.items.length !== 3) {
        fail(`${qlId}/${seed}/${language}: trap analysis does not contain three items.`);
      }
      if (!candidate.distractorEditorialTrace.hasLowerDistractor
        || !candidate.distractorEditorialTrace.hasUpperDistractor) {
        fail(`${qlId}/${seed}/${language}: distractors do not bracket the correct answer.`);
      }
      for (const audit of candidate.optionAudit) {
        if (audit.proximityOrigin === "RETAINED_CONCEPT_TRAP" && audit.relativeDistanceBps > 1500) {
          fail(`${qlId}/${seed}/${language}: retained concept trap exceeds 15%.`);
        }
      }
      for (const trap of candidate.explanation.trapAnalysis.items) {
        if (candidate.options[trap.optionNumber - 1] !== trap.optionText) {
          fail(`${qlId}/${seed}/${language}: trap option ${trap.optionNumber} is out of sync.`);
        }
      }
      proximityChecks += 1;

      if (
        candidate.maturity !== "CLOSE_DISTRACTOR_EDITORIAL_CANDIDATE"
        || candidate.reviewStatus !== "PENDING_MULTILINGUAL_DISTRACTOR_REVIEW"
        || candidate.localeReviewStatus !== "PENDING_HUMAN_REVIEW"
        || candidate.questionBankStatus !== "NOT_STORED"
        || candidate.testEligibility !== "INELIGIBLE"
        || candidate.publiclyPublishable
        || candidate.questionStudioDiscoverable
      ) {
        fail(`${qlId}/${seed}/${language}: candidate lifecycle lock is invalid.`);
      }
      lifecycleChecks += 1;

      retainedConceptDistractors += candidate.distractorEditorialTrace.retainedConceptDistractors;
      generatedNearMisses += candidate.distractorEditorialTrace.generatedNearMisses;
      maximumRelativeDistanceBps = Math.max(maximumRelativeDistanceBps, candidate.distractorEditorialTrace.maximumRelativeDistanceBps);
      byLanguage[language].retained += candidate.distractorEditorialTrace.retainedConceptDistractors;
      byLanguage[language].nearMisses += candidate.distractorEditorialTrace.generatedNearMisses;
      byLanguage[language].maxBps = Math.max(byLanguage[language].maxBps, candidate.distractorEditorialTrace.maximumRelativeDistanceBps);
    }

    const english = candidates.get("en")!;
    for (const language of ["hi", "pa"] as const) {
      const localized = candidates.get(language)!;
      if (localized.correctIndex !== english.correctIndex) {
        fail(`${qlId}/${seed}/${language}: correct option position drifted from English.`);
      }
      const englishValues = english.optionAudit.map((audit) => resultKey(audit.result));
      const localizedValues = localized.optionAudit.map((audit) => resultKey(audit.result));
      if (stable(englishValues) !== stable(localizedValues)) {
        fail(`${qlId}/${seed}/${language}: distractor values or positions drifted across locales.`);
      }
      multilingualParityChecks += 1;
    }
  }
}

const summary = {
  packageId: "INT-001",
  cpId: "INT-CP-001",
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  seedCount: seeds.length,
  languageCount: languages.length,
  generatedQuestions,
  invariantChecks,
  deterministicChecks,
  proximityChecks,
  lifecycleChecks,
  multilingualParityChecks,
  retainedConceptDistractors,
  generatedNearMisses,
  maximumRelativeDistanceBps,
  byLanguage,
  retainedConceptMaximumBps: 1500,
  status: "PASS",
};

console.log(JSON.stringify(summary, null, 2));
