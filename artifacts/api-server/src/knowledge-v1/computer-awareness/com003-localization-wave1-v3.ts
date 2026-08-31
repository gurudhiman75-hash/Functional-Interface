import {
  COM003_HINDI_LOCALIZATION_WAVE1_V2,
  COM003_LOCALIZATION_WAVE1_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_WAVE1_V2,
} from "./com003-localization-wave1-v2";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

function normalized(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function enforceWindowsDesktop(item: Com003LocalizedQuestionV1): Com003LocalizedQuestionV1 {
  if (!item.versionScoped || !/SHORTCUT/i.test(item.surfaceMode) || /Windows desktop/i.test(item.stem)) return item;
  const prefix = item.language === "hi" ? "Windows desktop संदर्भ में, " : "Windows desktop ਸੰਦਰਭ ਵਿੱਚ, ";
  return { ...item, stem: `${prefix}${item.stem}` };
}

function ensureUniqueStems(items: readonly Com003LocalizedQuestionV1[]) {
  const seen = new Set<string>();
  const duplicateOrdinal = new Map<string, number>();
  return items.map((original) => {
    let item = enforceWindowsDesktop(original);
    let key = normalized(item.stem);
    if (seen.has(key)) {
      const qlKey = `${item.language}:${item.qlId}`;
      const ordinal = (duplicateOrdinal.get(qlKey) ?? 0) + 1;
      duplicateOrdinal.set(qlKey, ordinal);
      const hiPrefixes = [
        "दिए गए विकल्पों में से, ",
        "सही विकल्प चुनते हुए, ",
        "इस Computer Awareness प्रश्न में, ",
        "परीक्षा के संदर्भ में, ",
      ];
      const paPrefixes = [
        "ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ, ",
        "ਸਹੀ ਵਿਕਲਪ ਚੁਣਦੇ ਹੋਏ, ",
        "ਇਸ Computer Awareness ਪ੍ਰਸ਼ਨ ਵਿੱਚ, ",
        "ਪਰੀਖਿਆ ਦੇ ਸੰਦਰਭ ਵਿੱਚ, ",
      ];
      const prefixes = item.language === "hi" ? hiPrefixes : paPrefixes;
      item = { ...item, stem: `${prefixes[(ordinal - 1) % prefixes.length]!}${item.stem}` };
      key = normalized(item.stem);
    }
    if (seen.has(key)) throw new Error(`Unable to remediate duplicate COM-003 Wave-1 stem: ${item.localizationId}`);
    seen.add(key);
    return {
      ...item,
      localizationId: item.localizationId.replace(/AUTHORED-W1-V[12]/, "AUTHORED-W1-V3"),
    };
  });
}

export const COM003_HINDI_LOCALIZATION_WAVE1_V3 = Object.freeze(ensureUniqueStems(COM003_HINDI_LOCALIZATION_WAVE1_V2));
export const COM003_PUNJABI_LOCALIZATION_WAVE1_V3 = Object.freeze(ensureUniqueStems(COM003_PUNJABI_LOCALIZATION_WAVE1_V2));

export const COM003_LOCALIZATION_WAVE1_AUTHORITY_V3 = Object.freeze({
  ...COM003_LOCALIZATION_WAVE1_AUTHORITY_V2,
  authorityId: "COM-003-LOCALIZATION-WAVE1-AUTHORED-V3" as const,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE1_V3.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE1_V3.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE1_V3.length + COM003_PUNJABI_LOCALIZATION_WAVE1_V3.length,
  remediation: Object.freeze({
    ql004WordProcessorAnswerLeakRemoved: true,
    ql001Ql002ExactStemDuplicatesRemoved: true,
    versionScopedShortcutWindowsDesktopContextEnforced: true,
  }),
  nextGate: "COM003_LOCALIZATION_WAVE1_SEMANTIC_EDITORIAL_AUDIT_V3" as const,
});
