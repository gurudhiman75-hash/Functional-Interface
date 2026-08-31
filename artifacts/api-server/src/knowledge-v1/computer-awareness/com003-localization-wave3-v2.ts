import {
  COM003_HINDI_LOCALIZATION_WAVE3_V1,
  COM003_LOCALIZATION_WAVE3_AUTHORITY_V1,
  COM003_PUNJABI_LOCALIZATION_WAVE3_V1,
} from "./com003-localization-wave3-v1";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

function remediate(item: Com003LocalizedQuestionV1): Com003LocalizedQuestionV1 {
  let stem = item.stem;
  let explanation = item.explanation;
  if (item.language === "hi") {
    stem = stem.replaceAll("basic numeric-count संदर्भ", "मूल संख्यात्मक गणना के संदर्भ");
    explanation = explanation.replaceAll("basic numeric-count संदर्भ", "मूल संख्यात्मक गणना के संदर्भ");
  } else {
    stem = stem.replaceAll("basic numeric-count ਸੰਦਰਭ", "ਮੂਲ ਸੰਖਿਆਤਮਕ ਗਿਣਤੀ ਦੇ ਸੰਦਰਭ");
    explanation = explanation.replaceAll("basic numeric-count ਸੰਦਰਭ", "ਮੂਲ ਸੰਖਿਆਤਮਕ ਗਿਣਤੀ ਦੇ ਸੰਦਰਭ");
  }
  return {
    ...item,
    localizationId: item.localizationId.replace("AUTHORED-W3-V1", "AUTHORED-W3-V2"),
    stem,
    explanation,
  };
}

export const COM003_HINDI_LOCALIZATION_WAVE3_V2 = Object.freeze(COM003_HINDI_LOCALIZATION_WAVE3_V1.map(remediate));
export const COM003_PUNJABI_LOCALIZATION_WAVE3_V2 = Object.freeze(COM003_PUNJABI_LOCALIZATION_WAVE3_V1.map(remediate));

export const COM003_LOCALIZATION_WAVE3_AUTHORITY_V2 = Object.freeze({
  ...COM003_LOCALIZATION_WAVE3_AUTHORITY_V1,
  authorityId: "COM-003-LOCALIZATION-WAVE3-AUTHORED-V2" as const,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE3_V2.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE3_V2.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE3_V2.length + COM003_PUNJABI_LOCALIZATION_WAVE3_V2.length,
  remediation: Object.freeze({ countTokenRemovedFromPurposeClue: true }),
  nextGate: "COM003_LOCALIZATION_WAVE3_SEMANTIC_EDITORIAL_AUDIT_V2" as const,
});
