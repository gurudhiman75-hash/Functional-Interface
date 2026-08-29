import { createHash } from "node:crypto";

import {
  TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
  generateExamRealLocalizedTrg002Question as generateBaseExamRealLocalizedTrg002Question,
  type Trg002ExamRealnessLocale,
} from "./localization-exam-realness-v2-base";

export {
  TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
};
export type { Trg002ExamRealnessLocale };

type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

function decimalizeHalfFractions(text: string) {
  return text.replace(/\b(\d+)\/2\b/g, (_match, numeratorText: string) => {
    const numerator = Number(numeratorText);
    if (!Number.isSafeInteger(numerator)) return _match;
    const value = numerator / 2;
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  });
}

function decimalizeExplanation(explanation: AnyQuestion) {
  return {
    ...explanation,
    keyRule: decimalizeHalfFractions(explanation.keyRule),
    steps: explanation.steps.map((step: AnyQuestion) => ({ ...step, body: decimalizeHalfFractions(step.body) })),
    shortcut: decimalizeHalfFractions(explanation.shortcut),
    traps: explanation.traps.map((trap: string) => decimalizeHalfFractions(trap)),
  };
}

export function generateExamRealLocalizedTrg002Question(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  const base: AnyQuestion = generateBaseExamRealLocalizedTrg002Question(qlId, seed, locale);
  const stem = decimalizeHalfFractions(base.stem);
  const explanation = decimalizeExplanation(base.explanation);
  const localizationFingerprint = sha256({
    version: TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
    locale,
    qlId,
    seed,
    canonicalSemanticFingerprint: base.localizationProof.canonicalSemanticFingerprint,
    stem,
    explanation,
  });
  return {
    ...base,
    stem,
    explanation,
    localizationProof: {
      ...base.localizationProof,
      localizationFingerprint,
      genericHalfFractionSurfaceNormalization: true,
    },
    realnessRemediation: {
      ...base.realnessRemediation,
      genericHalfFractionSurfaceNormalization: true,
    },
  };
}

export function buildTrg002ExamRealnessV2ReviewBank(locale: Trg002ExamRealnessLocale, seedsPerQl = 12) {
  return TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateExamRealLocalizedTrg002Question(
      qlId,
      `trg002-exam-realness-v2-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
