import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1,
  type Com003LocalizedQuestionV2,
} from "./com003-localization-v2-wave1";

const COMMAND_NAME: Record<string, string> = {
  "com003-command-copy": "Copy",
  "com003-command-save": "Save",
  "com003-command-cut": "Cut",
};

const SHORTCUT_NAME: Record<string, string> = {
  "com003-shortcut-ctrl-p": "Ctrl+P",
  "com003-shortcut-ctrl-s": "Ctrl+S",
};

function correctedStem(item: Com003LocalizedQuestionV2) {
  if (item.surfaceMode === "COMMAND_TO_EFFECT") {
    const command = COMMAND_NAME[item.targetFactId];
    if (!command) throw new Error(`COM-003 Wave 1 V2 missing command label for ${item.targetFactId}`);
    return item.language === "hi"
      ? `${command} कमांड का कार्य क्या है?`
      : `${command} ਕਮਾਂਡ ਦਾ ਕੰਮ ਕੀ ਹੈ?`;
  }

  if (item.surfaceMode === "SHORTCUT_TO_ACTION") {
    const shortcut = SHORTCUT_NAME[item.targetFactId];
    if (!shortcut) throw new Error(`COM-003 Wave 1 V2 missing shortcut label for ${item.targetFactId}`);
    return item.language === "hi"
      ? `Microsoft Office (Windows desktop) में ${shortcut} का उपयोग किस कार्य के लिए होता है?`
      : `Microsoft Office (Windows desktop) ਵਿੱਚ ${shortcut} ਕਿਹੜੇ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`;
  }

  return item.stem;
}

function correct(items: readonly Com003LocalizedQuestionV2[]) {
  return items.map((item) => ({
    ...item,
    localizationId: item.localizationId.replace("COM003-LOC-V2-W1-", "COM003-LOC-V2-W1R2-"),
    stem: correctedStem(item),
  }));
}

export const COM003_HINDI_LOCALIZATION_V2_WAVE1_V2 = Object.freeze(correct(COM003_HINDI_LOCALIZATION_V2_WAVE1));
export const COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2 = Object.freeze(correct(COM003_PUNJABI_LOCALIZATION_V2_WAVE1));

export const COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2 = Object.freeze({
  ...COM003_LOCALIZATION_V2_WAVE1_AUTHORITY,
  authorityId: "COM-003-LOCALIZATION-V2-WAVE1-CANDIDATE-2" as const,
  supersedesCandidateAuthorityId: COM003_LOCALIZATION_V2_WAVE1_AUTHORITY.authorityId,
  remediation: Object.freeze({
    commandToEffectUsesCommandNameInStem: true,
    shortcutToActionUsesShortcutNameInStem: true,
    changedFields: Object.freeze(["localizationId", "stem"] as const),
    answerOptionsProvenanceUnchanged: true,
  }),
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1_V2.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2.length,
  localizedQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1_V2.length + COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2.length,
  nextGate: "COM003_LOCALIZATION_V2_WAVE1_V2_PARITY_EDITORIAL_AUDIT" as const,
});
