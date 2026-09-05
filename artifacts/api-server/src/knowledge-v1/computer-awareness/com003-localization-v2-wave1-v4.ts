import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V3,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3,
  type Com003LocalizedQuestionV2,
} from "./com003-localization-v2-wave1-v3";

const HINDI_EXCEL_CLASSIFICATION_BEFORE =
  "Microsoft Excel निम्न में से किस प्रकार के सॉफ्टवेयर में आता है?";
const HINDI_EXCEL_CLASSIFICATION_AFTER =
  "Microsoft Excel निम्न में से किस प्रकार का सॉफ्टवेयर है?";

const PUNJABI_EXCEL_CLASSIFICATION_BEFORE =
  "Microsoft Excel ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਕਿਸਮ ਦੇ ਸਾਫਟਵੇਅਰ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?";
const PUNJABI_EXCEL_CLASSIFICATION_AFTER =
  "Microsoft Excel ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?";

function polishHindi(item: Com003LocalizedQuestionV2) {
  const stem = item.stem === HINDI_EXCEL_CLASSIFICATION_BEFORE
    ? HINDI_EXCEL_CLASSIFICATION_AFTER
    : item.stem;
  return {
    ...item,
    localizationId: item.localizationId.replace("COM003-LOC-V2-W1R3-", "COM003-LOC-V2-W1R4-"),
    stem,
  };
}

function polishPunjabi(item: Com003LocalizedQuestionV2) {
  let stem = item.stem === PUNJABI_EXCEL_CLASSIFICATION_BEFORE
    ? PUNJABI_EXCEL_CLASSIFICATION_AFTER
    : item.stem;
  stem = stem
    .replaceAll("ਕਿਹੜਾ Office ਕਮਾਂਡ", "ਕਿਹੜੀ Office ਕਮਾਂਡ")
    .replaceAll("ਕਿਹੜਾ ਕਮਾਂਡ", "ਕਿਹੜੀ ਕਮਾਂਡ");
  return {
    ...item,
    localizationId: item.localizationId.replace("COM003-LOC-V2-W1R3-", "COM003-LOC-V2-W1R4-"),
    stem,
  };
}

export const COM003_HINDI_LOCALIZATION_V2_WAVE1_V4 = Object.freeze(
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V3.map(polishHindi),
);
export const COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V4 = Object.freeze(
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3.map(polishPunjabi),
);

export const COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V4 = Object.freeze({
  ...COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3,
  authorityId: "COM-003-LOCALIZATION-V2-WAVE1-CANDIDATE-4" as const,
  supersedesCandidateAuthorityId: COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.authorityId,
  editorialBasis: "EXACT_CANDIDATE_3_RENDERED_ARTIFACT_HUMAN_LANGUAGE_PASS" as const,
  remediation: Object.freeze({
    candidate3StemPolishRetained: true,
    punjabiCommandGenderAgreementRepaired: true,
    excelClassificationWordingNaturalized: true,
    changedFields: Object.freeze(["localizationId", "stem"] as const),
    optionsAnswersExplanationsProvenanceUnchanged: true,
  }),
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1_V4.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V4.length,
  localizedQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1_V4.length + COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V4.length,
  nextGate: "COM003_LOCALIZATION_V2_WAVE1_V4_FINAL_HUMAN_REVIEW" as const,
});
