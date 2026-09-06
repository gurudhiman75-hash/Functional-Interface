import {
  COM003_HINDI_LOCALIZATION_WAVE4_V1,
  COM003_LOCALIZATION_WAVE4_AUTHORITY_V1,
  COM003_PUNJABI_LOCALIZATION_WAVE4_V1,
} from "./com003-localization-wave4-v1";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

function restoreVersionContext(item: Com003LocalizedQuestionV1): Com003LocalizedQuestionV1 {
  const needsExcelDesktopContext = item.qlId === "COM-003-QL-015" && !/Windows desktop/i.test(item.stem);
  const needsPowerPointDesktopContext = item.qlId === "COM-003-QL-019" && !/Windows desktop/i.test(item.stem);

  if (!needsExcelDesktopContext && !needsPowerPointDesktopContext) {
    return {
      ...item,
      localizationId: item.localizationId.replace("AUTHORED-W4-V1", "AUTHORED-W4-V2"),
    };
  }

  const prefix = item.language === "hi"
    ? needsExcelDesktopContext
      ? "Windows desktop Excel संदर्भ में, "
      : "Windows desktop PowerPoint संदर्भ में, "
    : needsExcelDesktopContext
      ? "Windows desktop Excel ਸੰਦਰਭ ਵਿੱਚ, "
      : "Windows desktop PowerPoint ਸੰਦਰਭ ਵਿੱਚ, ";

  return {
    ...item,
    localizationId: item.localizationId.replace("AUTHORED-W4-V1", "AUTHORED-W4-V2"),
    stem: `${prefix}${item.stem.charAt(0).toLocaleLowerCase()}${item.stem.slice(1)}`,
  };
}

export const COM003_HINDI_LOCALIZATION_WAVE4_V2 = Object.freeze(
  COM003_HINDI_LOCALIZATION_WAVE4_V1.map(restoreVersionContext),
);

export const COM003_PUNJABI_LOCALIZATION_WAVE4_V2 = Object.freeze(
  COM003_PUNJABI_LOCALIZATION_WAVE4_V1.map(restoreVersionContext),
);

export const COM003_LOCALIZATION_WAVE4_AUTHORITY_V2 = Object.freeze({
  ...COM003_LOCALIZATION_WAVE4_AUTHORITY_V1,
  authorityId: "COM-003-LOCALIZATION-WAVE4-AUTHORED-V2" as const,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE4_V2.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE4_V2.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE4_V2.length + COM003_PUNJABI_LOCALIZATION_WAVE4_V2.length,
  remediation: Object.freeze({
    windowsDesktopExcelContextPreserved: true,
    windowsDesktopPowerPointContextPreserved: true,
    legitimatePowerPointPlaceholderConceptPreserved: true,
  }),
  nextGate: "COM003_LOCALIZATION_WAVE4_SEMANTIC_EDITORIAL_AUDIT_V2" as const,
});
