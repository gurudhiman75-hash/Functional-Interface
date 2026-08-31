import { assertKnowledgeQuestionValid } from "../question-validation";
import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import {
  COM002_LOCALIZATION_VERSION_V3,
  localizeCom002QuestionV3,
  type Com002LocalizedQuestionV3,
} from "./com002-localization-v3";
import type { Com002TargetLanguageV1 } from "./com002-localization-lexicon-v1";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V5,
  generateCom002ReviewQuestionV5,
} from "./com002-review-synthesis-v5";

export const COM002_LOCALIZATION_VERSION_V4 =
  "COM-002-LOCALIZATION-V4-V5-BOUND-REVIEW-CANDIDATE-1" as const;
export const COM002_LOCALIZATION_DRAFT_AUTHORITY_V4 =
  "COM002_HI_PA_LOCALIZATION_V4_V5_FREEZE_BOUND_REVIEW_CANDIDATE" as const;

export type Com002LocalizedQuestionV4 = Omit<
  Com002LocalizedQuestionV3,
  "questionId" | "localizationV3" | "lifecycleV3"
> & {
  questionId: string;
  localizationV4: {
    version: typeof COM002_LOCALIZATION_VERSION_V4;
    supersedesLocalizationVersion: typeof COM002_LOCALIZATION_VERSION_V3;
    authority: typeof COM002_LOCALIZATION_DRAFT_AUTHORITY_V4;
    englishGeneratorVersion: typeof COM002_ENGLISH_GENERATOR_VERSION_V5;
    englishFreezeAuthorityId: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId;
    englishCombinedFingerprint: typeof COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint;
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
    localizedLearnerSurfaceInheritedFromGrammarPolishedV3: true;
    v5EnglishSimplificationIsSemanticNoOpForLocalization: true;
  };
  lifecycleV4: {
    englishV5Frozen: true;
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

function assertV5SemanticRebindSafe(
  historical: Com002LocalizedQuestionV3,
  english: ReturnType<typeof generateCom002ReviewQuestionV5>,
  input: { qlId: string; seed: string; language: Com002TargetLanguageV1 },
) {
  const prefix = `${input.qlId}/${input.seed}/${input.language}`;
  if (historical.qlId !== english.qlId) throw new Error(`${prefix}: V5 QL drift`);
  if (historical.cpId !== english.cpId) throw new Error(`${prefix}: V5 CP drift`);
  if (historical.surfaceMode !== english.surfaceMode) throw new Error(`${prefix}: V5 surface-mode drift`);
  if (historical.targetFactId !== english.targetFactId) throw new Error(`${prefix}: V5 target-fact drift`);
  if (historical.correctIndex !== english.correctIndex) throw new Error(`${prefix}: V5 correct-index drift`);
  if (historical.solverAuthority !== english.solverAuthority) throw new Error(`${prefix}: V5 solver-authority drift`);
  if (JSON.stringify(historical.sourceFactIds) !== JSON.stringify(english.sourceFactIds)) {
    throw new Error(`${prefix}: V5 source-fact provenance drift`);
  }
  if (JSON.stringify(historical.sourceIds) !== JSON.stringify(english.sourceIds)) {
    throw new Error(`${prefix}: V5 source-authority drift`);
  }
}

/**
 * Rebind the grammar-polished Hindi/Punjabi V3 learner surface to the frozen
 * English V5 semantic authority. V5 simplifies English wording but deliberately
 * preserves semantic state, option order, answer index and provenance. The
 * guards above make any future structural drift fail closed.
 */
export function localizeCom002QuestionV4(input: {
  qlId: string;
  seed: string;
  language: Com002TargetLanguageV1;
}): Com002LocalizedQuestionV4 {
  const english = generateCom002ReviewQuestionV5({ qlId: input.qlId, seed: input.seed });
  const historical = localizeCom002QuestionV3(input);
  assertV5SemanticRebindSafe(historical, english, input);

  const {
    localizationV3: _localizationV3,
    lifecycleV3: _lifecycleV3,
    ...base
  } = historical;

  const question: Com002LocalizedQuestionV4 = {
    ...base,
    questionId: `${english.questionId}-${input.language.toUpperCase()}`,
    qlId: english.qlId,
    cpId: english.cpId,
    surfaceMode: english.surfaceMode,
    targetFactId: english.targetFactId,
    sourceIds: [...english.sourceIds],
    sourceFactIds: [...english.sourceFactIds],
    solverAuthority: english.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
    localizationV4: {
      version: COM002_LOCALIZATION_VERSION_V4,
      supersedesLocalizationVersion: COM002_LOCALIZATION_VERSION_V3,
      authority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V4,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
      englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
      englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
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
      localizedLearnerSurfaceInheritedFromGrammarPolishedV3: true,
      v5EnglishSimplificationIsSemanticNoOpForLocalization: true,
    },
    lifecycleV4: {
      englishV5Frozen: true,
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
