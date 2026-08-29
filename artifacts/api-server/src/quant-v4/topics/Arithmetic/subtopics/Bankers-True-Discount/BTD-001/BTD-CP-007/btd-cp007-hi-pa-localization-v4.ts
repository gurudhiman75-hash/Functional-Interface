import { createHash } from "node:crypto";

import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP007_LANGUAGES_V3,
  BTD_CP007_LOCALIZATION_BOUNDARY_V3,
  buildBtdLocalizedQuestionV3,
  type BtdCp007LanguageV3,
} from "./btd-cp007-hi-pa-localization-v3";

export const BTD_CP007_LOCALIZATION_V4 = "BTD-001-CP007-HI-PA-LOCALIZATION-v4" as const;
export const BTD_CP007_LANGUAGES_V4 = BTD_CP007_LANGUAGES_V3;
export type BtdCp007LanguageV4 = BtdCp007LanguageV3;

export const BTD_CP007_LOCALIZATION_BOUNDARY_V4 = Object.freeze({
  ...BTD_CP007_LOCALIZATION_BOUNDARY_V3,
  localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
  multilingualFrozen: false as const,
  questionStudioDiscoverable: false as const,
  questionStudioGenerationEnabled: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  return JSON.stringify(value);
}

function fingerprint(value: unknown) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

export function localizeBtdCp007DisplayValueV4(value: string, language: BtdCp007LanguageV4) {
  return String(value).replace(/\b(\d+(?:\.\d+)?) months\b/gu, (_match, raw) => {
    const amount = Number(raw);
    if (language === "hi") return `${raw} ${amount === 1 ? "महीना" : "महीने"}`;
    return `${raw} ${amount === 1 ? "ਮਹੀਨਾ" : "ਮਹੀਨੇ"}`;
  });
}

function localizeFormulaVocabulary(value: string, language: BtdCp007LanguageV4) {
  const faceValueTerm = language === "hi" ? "अंकित मूल्य" : "ਅੰਕਿਤ ਮੁੱਲ";
  return localizeBtdCp007DisplayValueV4(String(value), language).replace(/\bFace\b/gu, faceValueTerm);
}

export function buildBtdLocalizedQuestionV4(
  qlId: BtdPermanentQlId,
  seed: string,
  language: BtdCp007LanguageV4,
) {
  const v3 = buildBtdLocalizedQuestionV3(qlId, seed, language) as any;
  const options = Object.freeze(v3.options.map((option: any) => Object.freeze({
    ...option,
    text: localizeBtdCp007DisplayValueV4(String(option.text), language),
  })));
  const correctAnswer = localizeBtdCp007DisplayValueV4(String(v3.correctAnswer), language);
  const explanation = Object.freeze({
    ...v3.explanation,
    keyIdea: localizeFormulaVocabulary(String(v3.explanation.keyIdea), language),
    steps: Object.freeze((v3.explanation.steps as readonly string[]).map((step) => localizeFormulaVocabulary(step, language))),
    finalAnswer: localizeFormulaVocabulary(String(v3.explanation.finalAnswer), language),
  });

  const payload = Object.freeze({
    qlId: v3.qlId,
    language: v3.language,
    semanticSignature: v3.semanticSignature,
    answerSemantic: v3.answerSemantic,
    sourceStateFingerprint: v3.sourceStateFingerprint,
    englishContentFingerprint: v3.englishContentFingerprint,
    presentation: v3.presentation,
    options,
    correctIndex: v3.correctIndex,
    correctAnswer,
    explanation,
  });

  return Object.freeze({
    ...v3,
    localizationVersion: BTD_CP007_LOCALIZATION_V4,
    options,
    correctAnswer,
    explanation,
    localizationFingerprint: fingerprint(payload),
    lifecycle: BTD_CP007_LOCALIZATION_BOUNDARY_V4,
  });
}
