import { createHash } from "node:crypto";

import { evaluateTranslationQuality, type TranslationOptionInput } from "../lib/admin-translation-operations";
import type { CurrentAffairsLocalizationLanguage } from "./multilingual-localization";

export type CurrentAffairsQuestionFamily = "CA-QL-001" | "CA-QL-002";

export type CurrentAffairsQuestionLocalizationInput = {
  sourceGenerationVersionId: string;
  languageCode: CurrentAffairsLocalizationLanguage;
  family: CurrentAffairsQuestionFamily;
  factKey: string;
  factValue: string;
  localizedEventTitle: string;
  sourcePayload: Record<string, unknown>;
  localizedEventTitleByEnglishTitle?: Record<string, string>;
};

export type CurrentAffairsQuestionLocalizationOutput = {
  status: "ready" | "needs_editorial";
  payload?: Record<string, unknown>;
  inputFingerprint: string;
  quality: {
    shared: ReturnType<typeof evaluateTranslationQuality> | null;
    answerIndexPreserved: boolean;
    optionCountPreserved: boolean;
    factValuePreserved: boolean;
    expectedScriptPresent: boolean;
    missingEventTitleOptions: string[];
  };
  reasons: string[];
};

const FACT_LABELS: Record<CurrentAffairsLocalizationLanguage, Record<string, string>> = {
  hi: {
    appointee: "नियुक्त व्यक्ति",
    position: "पद",
    index_value: "सूचकांक मान",
    policy_repo_rate: "रेपो दर",
    standing_deposit_facility_rate: "SDF दर",
    marginal_standing_facility_rate: "MSF दर",
    bank_rate: "बैंक दर",
    cash_reserve_ratio: "CRR",
    statutory_liquidity_ratio: "SLR",
    mou_parties: "MoU के पक्ष",
    orbit_altitude: "कक्षा ऊंचाई",
    repeat_cycle: "पुनरावृत्ति चक्र",
    mission_life: "मिशन अवधि",
    launcher: "प्रक्षेपण यान",
    scheme_outlay: "परिव्यय",
    beneficiary_count: "लाभार्थी",
    effective_date: "प्रभावी तिथि",
  },
  pa: {
    appointee: "ਨਿਯੁਕਤ ਵਿਅਕਤੀ",
    position: "ਅਹੁਦਾ",
    index_value: "ਸੂਚਕਾਂਕ ਮੁੱਲ",
    policy_repo_rate: "ਰੇਪੋ ਦਰ",
    standing_deposit_facility_rate: "SDF ਦਰ",
    marginal_standing_facility_rate: "MSF ਦਰ",
    bank_rate: "ਬੈਂਕ ਦਰ",
    cash_reserve_ratio: "CRR",
    statutory_liquidity_ratio: "SLR",
    mou_parties: "MoU ਦੇ ਪੱਖ",
    orbit_altitude: "ਕਕਸ਼ ਉਚਾਈ",
    repeat_cycle: "ਦੁਹਰਾਵਾ ਚੱਕਰ",
    mission_life: "ਮਿਸ਼ਨ ਅਵਧੀ",
    launcher: "ਲਾਂਚ ਵਾਹਨ",
    scheme_outlay: "ਖਰਚਾ",
    beneficiary_count: "ਲਾਭਪਾਤਰੀ",
    effective_date: "ਲਾਗੂ ਮਿਤੀ",
  },
};

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function options(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => text(item)).filter(Boolean) : [];
}

function index(value: unknown): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : -1;
}

function optionInputs(values: string[]): TranslationOptionInput[] {
  return values.map((value, i) => ({
    key: String.fromCharCode(65 + i),
    text: value,
    sortOrder: i + 1,
  }));
}

function expectedScriptPresent(value: string, languageCode: CurrentAffairsLocalizationLanguage): boolean {
  return languageCode === "hi" ? /[\u0900-\u097F]/u.test(value) : /[\u0A00-\u0A7F]/u.test(value);
}

function normalizedTitleKey(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function localizedLabel(languageCode: CurrentAffairsLocalizationLanguage, factKey: string): string {
  return FACT_LABELS[languageCode][factKey] ?? factKey.replaceAll("_", " ");
}

export function questionLocalizationInputFingerprint(input: CurrentAffairsQuestionLocalizationInput): string {
  const titleMap = Object.entries(input.localizedEventTitleByEnglishTitle ?? {})
    .map(([source, target]) => [normalizedTitleKey(source), text(target)] as const)
    .sort((a, b) => a[0].localeCompare(b[0]));
  return createHash("sha256").update(JSON.stringify({
    sourceGenerationVersionId: input.sourceGenerationVersionId,
    languageCode: input.languageCode,
    family: input.family,
    factKey: input.factKey,
    factValue: input.factValue,
    localizedEventTitle: input.localizedEventTitle,
    sourcePayload: input.sourcePayload,
    titleMap,
  })).digest("hex");
}

export function localizeCurrentAffairsQuestion(
  input: CurrentAffairsQuestionLocalizationInput,
): CurrentAffairsQuestionLocalizationOutput {
  const sourceStem = text(input.sourcePayload.stem ?? input.sourcePayload.text);
  const sourceExplanation = text(input.sourcePayload.explanation);
  const sourceOptions = options(input.sourcePayload.options);
  const correctIndex = index(input.sourcePayload.correctIndex);
  const reasons: string[] = [];
  const fingerprint = questionLocalizationInputFingerprint(input);

  if (!sourceStem || !sourceExplanation || sourceOptions.length < 2 || correctIndex < 0 || correctIndex >= sourceOptions.length) {
    return {
      status: "needs_editorial",
      inputFingerprint: fingerprint,
      quality: {
        shared: null,
        answerIndexPreserved: false,
        optionCountPreserved: false,
        factValuePreserved: false,
        expectedScriptPresent: false,
        missingEventTitleOptions: [],
      },
      reasons: ["Source Current Affairs question payload is incomplete or invalid"],
    };
  }

  const label = localizedLabel(input.languageCode, input.factKey);
  let targetOptions: string[] = [];
  let stem = "";
  let explanation = "";
  const missingEventTitleOptions: string[] = [];

  if (input.family === "CA-QL-001") {
    targetOptions = [...sourceOptions];
    if (input.languageCode === "hi") {
      stem = `“${input.localizedEventTitle}” से संबंधित ${label} क्या है?`;
      explanation = `सही उत्तर ${sourceOptions[correctIndex]} है। “${input.localizedEventTitle}” के लिए सत्यापित ${label} ${input.factValue} है।`;
    } else {
      stem = `“${input.localizedEventTitle}” ਨਾਲ ਸੰਬੰਧਿਤ ${label} ਕੀ ਹੈ?`;
      explanation = `ਸਹੀ ਜਵਾਬ ${sourceOptions[correctIndex]} ਹੈ। “${input.localizedEventTitle}” ਲਈ ਪ੍ਰਮਾਣਿਤ ${label} ${input.factValue} ਹੈ।`;
    }
  } else if (input.family === "CA-QL-002") {
    const titleMap = new Map(
      Object.entries(input.localizedEventTitleByEnglishTitle ?? {}).map(([source, target]) => [normalizedTitleKey(source), text(target)]),
    );
    targetOptions = sourceOptions.map((sourceOption) => {
      const localized = titleMap.get(normalizedTitleKey(sourceOption)) ?? "";
      if (!localized) missingEventTitleOptions.push(sourceOption);
      return localized;
    });
    if (input.languageCode === "hi") {
      stem = `कौन-सी Current Affairs घटना ${label} “${input.factValue}” से सही रूप से संबंधित है?`;
      explanation = `सही उत्तर “${input.localizedEventTitle}” है। इसका सत्यापित ${label} ${input.factValue} है।`;
    } else {
      stem = `ਕਿਹੜੀ Current Affairs ਘਟਨਾ ${label} “${input.factValue}” ਨਾਲ ਸਹੀ ਤਰ੍ਹਾਂ ਸੰਬੰਧਿਤ ਹੈ?`;
      explanation = `ਸਹੀ ਜਵਾਬ “${input.localizedEventTitle}” ਹੈ। ਇਸ ਦਾ ਪ੍ਰਮਾਣਿਤ ${label} ${input.factValue} ਹੈ।`;
    }
  } else {
    reasons.push("Unsupported Current Affairs question family");
  }

  if (missingEventTitleOptions.length > 0) {
    reasons.push("One or more event-title options do not have approved CP010 localization");
  }

  const targetCanonicalAnswer = targetOptions[correctIndex] ?? "";
  const optionCountPreserved = targetOptions.length === sourceOptions.length && targetOptions.every(Boolean);
  const answerIndexPreserved = correctIndex >= 0 && correctIndex < targetOptions.length && Boolean(targetCanonicalAnswer);
  const factValuePreserved = [stem, explanation, ...targetOptions].join(" ").includes(input.factValue);
  const expectedScript = expectedScriptPresent([stem, explanation, ...targetOptions].join(" "), input.languageCode);
  const shared = optionCountPreserved
    ? evaluateTranslationQuality({
        source: { stem: sourceStem, explanation: sourceExplanation, options: optionInputs(sourceOptions) },
        target: { stem, explanation, options: optionInputs(targetOptions) },
        languageCode: input.languageCode,
        terms: [],
      })
    : null;

  if (!optionCountPreserved) reasons.push("Localized option count/order could not be preserved");
  if (!answerIndexPreserved) reasons.push("Correct answer index could not be preserved");
  if (!factValuePreserved) reasons.push("Canonical fact value is missing from localized question");
  if (!expectedScript) reasons.push("Target-language script is absent from localized question");
  if (shared && !shared.approvable) reasons.push("Shared translation quality gate reported blocking errors");

  const ready = missingEventTitleOptions.length === 0
    && optionCountPreserved
    && answerIndexPreserved
    && factValuePreserved
    && expectedScript
    && Boolean(shared?.approvable);

  if (!ready) {
    return {
      status: "needs_editorial",
      inputFingerprint: fingerprint,
      quality: {
        shared,
        answerIndexPreserved,
        optionCountPreserved,
        factValuePreserved,
        expectedScriptPresent: expectedScript,
        missingEventTitleOptions,
      },
      reasons,
    };
  }

  const sourceContext = input.sourcePayload.generationContext && typeof input.sourcePayload.generationContext === "object"
    ? input.sourcePayload.generationContext as Record<string, unknown>
    : {};
  const sourceProvenance = input.sourcePayload.provenance && typeof input.sourcePayload.provenance === "object"
    ? input.sourcePayload.provenance as Record<string, unknown>
    : {};
  const payload = {
    ...input.sourcePayload,
    text: stem,
    stem,
    explanation,
    options: targetOptions,
    correctIndex,
    canonicalAnswer: targetCanonicalAnswer,
    language: input.languageCode,
    generationContext: {
      ...sourceContext,
      reviewStatus: "PENDING_EDITORIAL_REVIEW",
      questionBankAcceptanceMode: "BANK_ONLY",
      publiclyPublishable: false,
      automaticStudentPublication: false,
      localizationAuthority: "CURRENT_AFFAIRS_STUDIO_CP011",
      sourceGenerationVersionId: input.sourceGenerationVersionId,
    },
    provenance: {
      ...sourceProvenance,
      sourceGenerationVersionId: input.sourceGenerationVersionId,
      localizationLanguage: input.languageCode,
      localizationSource: "cp010_approved_current_affairs_localizations",
      factValue: input.factValue,
    },
  };

  return {
    status: "ready",
    payload,
    inputFingerprint: fingerprint,
    quality: {
      shared,
      answerIndexPreserved,
      optionCountPreserved,
      factValuePreserved,
      expectedScriptPresent: expectedScript,
      missingEventTitleOptions: [],
    },
    reasons,
  };
}
