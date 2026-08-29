import { createHash } from "node:crypto";

import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdFrozenEnglishQuestionV1 } from "../BTD-CP-005/btd-cp005-english-freeze-v1";
import {
  BTD_CP007_LANGUAGES_V2,
  BTD_CP007_LOCALIZATION_BOUNDARY_V2,
  buildBtdLocalizedQuestionV2,
  type BtdCp007LanguageV2,
} from "./btd-cp007-hi-pa-localization-v2";

export const BTD_CP007_LOCALIZATION_V3 = "BTD-001-CP007-HI-PA-LOCALIZATION-v3" as const;
export const BTD_CP007_LANGUAGES_V3 = BTD_CP007_LANGUAGES_V2;
export type BtdCp007LanguageV3 = BtdCp007LanguageV2;

export const BTD_CP007_LOCALIZATION_BOUNDARY_V3 = Object.freeze({
  ...BTD_CP007_LOCALIZATION_BOUNDARY_V2,
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

export function buildBtdLocalizedQuestionV3(
  qlId: BtdPermanentQlId,
  seed: string,
  language: BtdCp007LanguageV3,
) {
  const v2 = buildBtdLocalizedQuestionV2(qlId, seed, language) as any;
  const frozen = buildBtdFrozenEnglishQuestionV1(qlId, seed) as any;
  const options = Object.freeze(frozen.options.map((option: any) => Object.freeze({
    text: String(option.text),
    isCorrect: Boolean(option.isCorrect),
    misconceptionId: option.misconceptionId ? String(option.misconceptionId) : undefined,
  })));

  const fingerprintPayload = Object.freeze({
    qlId: v2.qlId,
    language: v2.language,
    semanticSignature: v2.semanticSignature,
    answerSemantic: v2.answerSemantic,
    sourceStateFingerprint: v2.sourceStateFingerprint,
    englishContentFingerprint: v2.englishContentFingerprint,
    presentation: v2.presentation,
    options,
    correctIndex: v2.correctIndex,
    correctAnswer: v2.correctAnswer,
    explanation: v2.explanation,
  });

  return Object.freeze({
    ...v2,
    localizationVersion: BTD_CP007_LOCALIZATION_V3,
    options,
    localizationFingerprint: fingerprint(fingerprintPayload),
    lifecycle: BTD_CP007_LOCALIZATION_BOUNDARY_V3,
  });
}
