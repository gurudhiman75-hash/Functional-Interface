import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";

export type Com003TargetLanguage = "hi" | "pa";
export type Com003TargetLocale = "hi-IN" | "pa-IN";

export const COM003_LOCALIZATION_TERM_POLICY_V1 = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-TERM-POLICY-V1" as const,
  preserveLatinTokens: Object.freeze([
    "Microsoft",
    "Word",
    "Excel",
    "PowerPoint",
    "Windows",
    "Ctrl",
    "Shift",
    "Alt",
    "F5",
    "A1",
    "B7",
    "SUM",
    "AVERAGE",
    "MAX",
    "MIN",
    "COUNT",
  ] as const),
  preserveTokenClasses: Object.freeze([
    "keyboard shortcuts",
    "file extensions",
    "Excel formulas and function names",
    "cell and range references",
    "Microsoft product names",
  ] as const),
  translationGuidance: Object.freeze({
    stems: "Translate naturally into exam-standard language without changing the tested fact or clue strength." as const,
    options: "Translate ordinary concepts where natural; preserve protected technical tokens and option order." as const,
    explanations: "Translate the full reasoning faithfully; do not shorten into a generic answer-only explanation." as const,
    terminology: "Prefer terminology commonly used in Indian competitive-exam computer awareness; protected Latin technical tokens remain unchanged." as const,
  }),
});

function targetLocale(language: Com003TargetLanguage): Com003TargetLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

export function buildCom003LocalizationPacketV1(language: Com003TargetLanguage) {
  if (!COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) {
    throw new Error("COM-003 English authority must be frozen before localization work begins.");
  }
  if (!COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiLocalizationAuthorized) {
    throw new Error("COM-003 localization is not authorized by the English freeze authority.");
  }

  const locale = targetLocale(language);
  return COM003_ENGLISH_REVIEW_CORPUS_V4.map((question) => Object.freeze({
    localizationWorkItemId: `${question.questionId}:${locale}` as const,
    sourceQuestionId: question.questionId,
    qlId: question.qlId,
    surfaceMode: question.surfaceMode,
    targetFactId: question.targetFactId,
    sourceFactIds: Object.freeze([...question.sourceFactIds]),
    sourceIds: Object.freeze([...question.sourceIds]),
    versionScoped: question.versionScoped,
    correctIndex: question.correctIndex,
    targetLanguage: language,
    targetLocale: locale,
    source: Object.freeze({
      stem: question.stem,
      options: Object.freeze([...question.options]),
      canonicalAnswer: question.canonicalAnswer,
      explanation: question.explanation,
    }),
    invariantContract: Object.freeze({
      qlIdInvariant: true,
      surfaceModeInvariant: true,
      targetFactIdInvariant: true,
      sourceFactIdsInvariant: true,
      sourceIdsInvariant: true,
      versionScopedInvariant: true,
      protectedVersionPlatformWordingInvariant: true,
      optionCountInvariant: true,
      optionOrderSemanticInvariant: true,
      correctIndexInvariant: true,
      testedFactInvariant: true,
    }),
    localizedFieldsRequired: Object.freeze(["stem", "options", "canonicalAnswer", "explanation"] as const),
    translationStatus: "AWAITING_AUTHORED_TRANSLATION" as const,
    reviewStatus: "NOT_REVIEWED" as const,
    runtimeRegistered: false,
    productionReleased: false,
  }));
}

export const COM003_HINDI_LOCALIZATION_PACKET_V1 = Object.freeze(buildCom003LocalizationPacketV1("hi"));
export const COM003_PUNJABI_LOCALIZATION_PACKET_V1 = Object.freeze(buildCom003LocalizationPacketV1("pa"));

export const COM003_LOCALIZATION_PACKET_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-HI-PA-LOCALIZATION-PACKET-V1" as const,
  englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  sourceQuestionCount: 228,
  hindiWorkItemCount: COM003_HINDI_LOCALIZATION_PACKET_V1.length,
  punjabiWorkItemCount: COM003_PUNJABI_LOCALIZATION_PACKET_V1.length,
  totalWorkItemCount: COM003_HINDI_LOCALIZATION_PACKET_V1.length + COM003_PUNJABI_LOCALIZATION_PACKET_V1.length,
  termPolicyId: COM003_LOCALIZATION_TERM_POLICY_V1.authorityId,
  status: "LOCALIZATION_AUTHORING_READY" as const,
  localizationFrozen: false,
  questionStudioRegistrationAuthorized: false,
  automaticPublicationAuthorized: false,
  nextGate: "COM003_HINDI_PUNJABI_AUTHORED_TRANSLATION_V1" as const,
});
