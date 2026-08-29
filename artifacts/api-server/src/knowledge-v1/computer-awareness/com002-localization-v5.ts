import { assertKnowledgeQuestionValid } from "../question-validation";
import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import {
  COM002_LOCALIZATION_VERSION_V4,
  localizeCom002QuestionV4,
  type Com002LocalizedQuestionV4,
} from "./com002-localization-v4";
import type { Com002TargetLanguageV1 } from "./com002-localization-lexicon-v1";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
  generateCom002ReviewQuestionV6,
} from "./com002-review-synthesis-v6";

export const COM002_LOCALIZATION_VERSION_V5 =
  "COM-002-LOCALIZATION-V5-EDITORIAL-ERRATA-REVIEW-CANDIDATE-1" as const;
export const COM002_LOCALIZATION_DRAFT_AUTHORITY_V5 =
  "COM002_HI_PA_LOCALIZATION_V5_EDITORIAL_ERRATA_REVIEW_CANDIDATE" as const;

export type Com002LocalizedQuestionV5 = Omit<
  Com002LocalizedQuestionV4,
  "questionId" | "localizationV4" | "lifecycleV4"
> & {
  questionId: string;
  localizationV5: {
    version: typeof COM002_LOCALIZATION_VERSION_V5;
    supersedesLocalizationVersion: typeof COM002_LOCALIZATION_VERSION_V4;
    authority: typeof COM002_LOCALIZATION_DRAFT_AUTHORITY_V5;
    englishGeneratorVersion: typeof COM002_ENGLISH_GENERATOR_VERSION_V6;
    englishBaseFreezeAuthorityId: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId;
    englishBaseCombinedFingerprint: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint;
    englishQuestionId: string;
    semanticStateInvariant: true;
    qlInvariant: true;
    cpInvariant: true;
    surfaceModeInvariant: true;
    targetFactInvariant: true;
    sourceFactsInvariant: true;
    sourceAuthorityInvariant: true;
    solverAuthorityInvariant: true;
    optionOrderSemanticInvariant: true;
    correctIndexInvariant: true;
    learnerSurfaceErrataOverlayOnly: true;
    strictSimplifiedOptionParityOverrides: true;
  };
  lifecycleV5: {
    englishV5BaseFrozen: true;
    englishV6ErrataCandidate: true;
    localizationReviewOnly: true;
    localizationHumanReviewAccepted: false;
    localizationFingerprintsPinned: false;
    localizationFrozen: false;
    questionStudioActive: false;
    reviewRunPersistenceAllowed: false;
    canonicalQuestionPersistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  };
};

const STRICT_SIMPLIFIED_OPTION_TRANSLATIONS: Readonly<
  Record<string, Readonly<Record<Com002TargetLanguageV1, string>>>
> = Object.freeze({
  "gives CPU time to processes": Object.freeze({
    hi: "प्रक्रियाओं को CPU समय देता है",
    pa: "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ CPU ਸਮਾਂ ਦਿੰਦਾ ਹੈ",
  }),
  "gives memory to processes": Object.freeze({
    hi: "प्रक्रियाओं को मेमोरी देता है",
    pa: "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਮੈਮੋਰੀ ਦਿੰਦਾ ਹੈ",
  }),
});

function repairLocalizedTextV5(
  text: string,
  qlId: string,
  language: Com002TargetLanguageV1,
) {
  if (language === "hi") {
    let repaired = text
      .replace(
        /फ़ाइल-स्टोरेज संसाधन ऑपरेटिंग सिस्टम का कार्य है।/gu,
        "फ़ाइल-स्टोरेज संसाधनों का प्रबंधन ऑपरेटिंग सिस्टम का कार्य है।",
      )
      .replace(
        /कौन-सी सिस्टम क्रिया यह काम करती है:\s*Windows को बंद करके फिर से चालू करता है\?/gu,
        "कौन-सी सिस्टम क्रिया Windows को बंद करके फिर से चालू करती है?",
      )
      .replace(/रीनेम क्रिया([^।\n?]*?)बदलता है/gu, "रीनेम क्रिया$1बदलती है");

    if (qlId === "COM-002-QL-010") {
      repaired = repaired
        .replace(/ क्रिया का प्रभाव है:\s*/gu, " क्रिया ")
        .replace(/ता है।$/u, "ती है।");
    }
    if (qlId === "COM-002-QL-006") {
      repaired = repaired.replace(/ का अर्थ है:\s*/gu, ": ");
    }
    return repaired;
  }

  let repaired = text
    .replace(
      /ਫ਼ਾਈਲ-ਸਟੋਰੇਜ ਸਰੋਤ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।/gu,
      "ਫ਼ਾਈਲ-ਸਟੋਰੇਜ ਸਰੋਤਾਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰਨਾ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।",
    )
    .replace(
      /ਕਿਹੜੀ ਸਿਸਟਮ ਕਾਰਵਾਈ ਇਹ ਕੰਮ ਕਰਦੀ ਹੈ:\s*Windows ਨੂੰ ਬੰਦ ਕਰਕੇ ਫਿਰ ਚਾਲੂ ਕਰਦਾ ਹੈ\?/gu,
      "ਕਿਹੜੀ ਸਿਸਟਮ ਕਾਰਵਾਈ Windows ਨੂੰ ਬੰਦ ਕਰਕੇ ਫਿਰ ਚਾਲੂ ਕਰਦੀ ਹੈ?",
    )
    .replace(/ਰੀਨੇਮ ਕਾਰਵਾਈ([^।\n?]*?)ਬਦਲਦਾ ਹੈ/gu, "ਰੀਨੇਮ ਕਾਰਵਾਈ$1ਬਦਲਦੀ ਹੈ");

  if (qlId === "COM-002-QL-010") {
    repaired = repaired
      .replace(/ ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਹੈ:\s*/gu, " ਕਾਰਵਾਈ ")
      .replace(/ਦਾ ਹੈ।$/u, "ਦੀ ਹੈ।");
  }
  if (qlId === "COM-002-QL-006") {
    repaired = repaired.replace(/ ਦਾ ਅਰਥ ਹੈ:\s*/gu, ": ");
  }
  return repaired;
}

function repairLocalizedOptionsV5(input: {
  englishOptions: string[];
  localizedOptions: string[];
  qlId: string;
  language: Com002TargetLanguageV1;
}) {
  return input.localizedOptions.map((localized, index) => {
    const english = input.englishOptions[index]!;
    const strict = STRICT_SIMPLIFIED_OPTION_TRANSLATIONS[english]?.[input.language];
    return strict ?? repairLocalizedTextV5(localized, input.qlId, input.language);
  });
}

function assertV6SemanticRebindSafe(
  historical: Com002LocalizedQuestionV4,
  english: ReturnType<typeof generateCom002ReviewQuestionV6>,
  input: { qlId: string; seed: string; language: Com002TargetLanguageV1 },
) {
  const prefix = `${input.qlId}/${input.seed}/${input.language}`;
  if (historical.qlId !== english.qlId) throw new Error(`${prefix}: V6 QL drift`);
  if (historical.cpId !== english.cpId) throw new Error(`${prefix}: V6 CP drift`);
  if (historical.surfaceMode !== english.surfaceMode) throw new Error(`${prefix}: V6 surface-mode drift`);
  if (historical.targetFactId !== english.targetFactId) throw new Error(`${prefix}: V6 target-fact drift`);
  if (historical.correctIndex !== english.correctIndex) throw new Error(`${prefix}: V6 correct-index drift`);
  if (historical.solverAuthority !== english.solverAuthority) throw new Error(`${prefix}: V6 solver-authority drift`);
  if (JSON.stringify(historical.sourceFactIds) !== JSON.stringify(english.sourceFactIds)) {
    throw new Error(`${prefix}: V6 source-fact provenance drift`);
  }
  if (JSON.stringify(historical.sourceIds) !== JSON.stringify(english.sourceIds)) {
    throw new Error(`${prefix}: V6 source-authority drift`);
  }
}

/**
 * Candidate-only Hindi/Punjabi editorial errata layer.
 *
 * This preserves V4 as a historical review baseline and rebinds to English V6,
 * which itself is a semantic no-op over frozen V5. V5 fixes only learner-facing
 * grammar/wording defects and selected simplified-option parity mismatches.
 */
export function localizeCom002QuestionV5(input: {
  qlId: string;
  seed: string;
  language: Com002TargetLanguageV1;
}): Com002LocalizedQuestionV5 {
  const english = generateCom002ReviewQuestionV6({ qlId: input.qlId, seed: input.seed });
  const historical = localizeCom002QuestionV4(input);
  assertV6SemanticRebindSafe(historical, english, input);

  const {
    localizationV4: _localizationV4,
    lifecycleV4: _lifecycleV4,
    ...base
  } = historical;

  const options = repairLocalizedOptionsV5({
    englishOptions: english.options,
    localizedOptions: historical.options,
    qlId: english.qlId,
    language: input.language,
  });
  const stem = repairLocalizedTextV5(historical.stem, english.qlId, input.language);
  const explanation = repairLocalizedTextV5(historical.explanation, english.qlId, input.language);

  const question: Com002LocalizedQuestionV5 = {
    ...base,
    questionId: `${english.questionId}-${input.language.toUpperCase()}`,
    qlId: english.qlId,
    cpId: english.cpId,
    surfaceMode: english.surfaceMode,
    targetFactId: english.targetFactId,
    stem,
    options,
    correctIndex: english.correctIndex,
    canonicalAnswer: options[english.correctIndex]!,
    explanation,
    sourceIds: [...english.sourceIds],
    sourceFactIds: [...english.sourceFactIds],
    solverAuthority: english.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
    localizationV5: {
      version: COM002_LOCALIZATION_VERSION_V5,
      supersedesLocalizationVersion: COM002_LOCALIZATION_VERSION_V4,
      authority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V5,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
      englishBaseFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
      englishBaseCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
      englishQuestionId: english.questionId,
      semanticStateInvariant: true,
      qlInvariant: true,
      cpInvariant: true,
      surfaceModeInvariant: true,
      targetFactInvariant: true,
      sourceFactsInvariant: true,
      sourceAuthorityInvariant: true,
      solverAuthorityInvariant: true,
      optionOrderSemanticInvariant: true,
      correctIndexInvariant: true,
      learnerSurfaceErrataOverlayOnly: true,
      strictSimplifiedOptionParityOverrides: true,
    },
    lifecycleV5: {
      englishV5BaseFrozen: true,
      englishV6ErrataCandidate: true,
      localizationReviewOnly: true,
      localizationHumanReviewAccepted: false,
      localizationFingerprintsPinned: false,
      localizationFrozen: false,
      questionStudioActive: false,
      reviewRunPersistenceAllowed: false,
      canonicalQuestionPersistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });

  return question;
}
