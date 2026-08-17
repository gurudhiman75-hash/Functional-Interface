import { createHash } from "node:crypto";

import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";
import {
  TRG_002_CP008_LOCALIZATION_QL_IDS,
  TRG_002_CP008_LOCALIZATION_VERSION,
  localizeFrozenTrg002Cp008Question,
  trg002Cp008CanonicalSemanticFingerprint,
  type Trg002Cp008LocalizedLocale,
} from "./localization-cp008-v1";

type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}

function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

/**
 * QL-045 is part of the frozen original 48 and keeps its historical
 * GUY_WIRE_ANCHOR family identity. Phase-8 QL-046..048 use the expanded
 * GUY_WIRE_MAST_ANCHOR label. They are the same CP008 rendering family,
 * but localization must never rewrite the frozen QL identity or fingerprint.
 */
export function localizeFrozenTrg002Cp008QuestionCompat(
  canonicalQuestion: AnyQuestion,
  locale: Trg002Cp008LocalizedLocale,
) {
  if (canonicalQuestion.lockedFamily !== "GUY_WIRE_ANCHOR") {
    return localizeFrozenTrg002Cp008Question(canonicalQuestion, locale);
  }

  const canonicalSemanticFingerprint = trg002Cp008CanonicalSemanticFingerprint(canonicalQuestion);
  const renderProjection = { ...canonicalQuestion, lockedFamily: "GUY_WIRE_MAST_ANCHOR" };
  const rendered: AnyQuestion = localizeFrozenTrg002Cp008Question(renderProjection, locale);
  const localizationFingerprint = sha256({
    version: TRG_002_CP008_LOCALIZATION_VERSION,
    locale,
    qlId: canonicalQuestion.qlId,
    seed: canonicalQuestion.seed,
    canonicalSemanticFingerprint,
    stem: rendered.stem,
    explanation: rendered.explanation,
  });

  return {
    ...rendered,
    lockedFamily: canonicalQuestion.lockedFamily,
    localizationProof: {
      ...rendered.localizationProof,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      renderingFamilyAlias: "GUY_WIRE_ANCHOR -> GUY_WIRE_MAST_ANCHOR" as const,
      frozenFamilyIdentityPreserved: true,
    },
  };
}

export function generateLocalizedTrg002Cp008QuestionCompat(
  qlId: string,
  seed: string,
  locale: Trg002Cp008LocalizedLocale,
) {
  if (!TRG_002_CP008_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-CP-008 localization scope.`);
  return localizeFrozenTrg002Cp008QuestionCompat(
    generateFrozenTrg002Production96Question(qlId, seed) as AnyQuestion,
    locale,
  );
}
