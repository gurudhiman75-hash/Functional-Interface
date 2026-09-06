import {
  COM003_HINDI_LOCALIZATION_WAVE2_V2,
  COM003_LOCALIZATION_WAVE2_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_WAVE2_V2,
} from "./com003-localization-wave2-v2";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

function remediate(item: Com003LocalizedQuestionV1): Com003LocalizedQuestionV1 {
  let stem = item.stem;
  if (item.language === "hi" && item.qlId === "COM-003-QL-009" && item.surfaceMode === "OPERATION_TO_OPERATOR") {
    stem = stem.replaceAll("कौन-सा", "कौन सा").replaceAll("कौन-सी", "कौन सी");
  }
  return {
    ...item,
    localizationId: item.localizationId.replace("AUTHORED-W2-V2", "AUTHORED-W2-V3"),
    stem,
  };
}

export const COM003_HINDI_LOCALIZATION_WAVE2_V3 = Object.freeze(COM003_HINDI_LOCALIZATION_WAVE2_V2.map(remediate));
export const COM003_PUNJABI_LOCALIZATION_WAVE2_V3 = Object.freeze(COM003_PUNJABI_LOCALIZATION_WAVE2_V2.map(remediate));

export const COM003_LOCALIZATION_WAVE2_AUTHORITY_V3 = Object.freeze({
  ...COM003_LOCALIZATION_WAVE2_AUTHORITY_V2,
  authorityId: "COM-003-LOCALIZATION-WAVE2-AUTHORED-V3" as const,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE2_V3.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE2_V3.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE2_V3.length + COM003_PUNJABI_LOCALIZATION_WAVE2_V3.length,
  remediation: Object.freeze({
    ...COM003_LOCALIZATION_WAVE2_AUTHORITY_V2.remediation,
    hindiSubtractionHyphenCollisionRemoved: true,
  }),
  nextGate: "COM003_LOCALIZATION_WAVE2_SEMANTIC_EDITORIAL_AUDIT_V3" as const,
});
