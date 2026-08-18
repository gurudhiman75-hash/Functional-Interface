import {
  FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  generateFigureCompletionLocalizedQuestionV1,
  type FigureCompletionLanguageV1,
} from "./figure-completion-localization-authority-v1";
import type { FigureCompletionPermanentQlIdV1 } from "./figure-completion-permanent-english-runtime-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  spatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioDifficultyV1,
} from "./spatial-question-studio-integration-v1";
import { renderSpatialSceneToSvg } from "./svg-renderer";

export type SpatialFgcQuestionStudioQlIdV1 = FigureCompletionPermanentQlIdV1;
export type SpatialFgcQuestionStudioLanguageV1 = FigureCompletionLanguageV1;

export interface SpatialFgcStudioQuestionV1 {
  version: "SPA-FGC-001-QUESTION-STUDIO-QUESTION-V1";
  packageId: "SPA-001";
  qlId: SpatialFgcQuestionStudioQlIdV1;
  proposalId: string;
  chapterCode: "FGC-001";
  qlName: string;
  language: SpatialFgcQuestionStudioLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: SpatialQuestionStudioDifficultyV1;
  seed: string;
  generationSeed: string;
  mode: string;
  stem: string;
  stimulusSvgs: string[];
  optionSvgs: string[];
  optionLabels: ["A", "B", "C", "D"];
  correctIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  renderer: {
    kind: "SVG";
    recommendedStimulusPixels: 384;
    recommendedOptionPixels: 128;
    mobileMinimumOptionPixels: 104;
  };
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority;
  localization: {
    authority: typeof FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
    canonicalLanguage: "en";
    targetLanguage: SpatialFgcQuestionStudioLanguageV1;
    semanticParity: "GEOMETRY_AND_ANSWER_EXACT";
    learnerFieldsLocalized: readonly ["qlName", "stem", "explanation"];
    sourceFreezeAuthority: typeof FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
  };
  validation: {
    valid: true;
    semanticOptionUniqueness: true;
    perceptualOptionUniqueness: true;
    learnerExplanationSafe: true;
    uniqueAnswer: true;
  };
  sourceAuthority: {
    englishFreezeAuthority: string;
    localizationFreezeAuthority: typeof FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
    sourceQuestionFingerprint: string;
    deliveryFingerprint: string;
  };
  lifecycle: {
    reviewOnly: true;
    questionStudioDiscoverable: true;
    registrationStatus: "REGISTERED";
    persistenceAllowed: true;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  };
}

export function isSpatialFgcQuestionStudioQlIdV1(
  qlId: string,
): qlId is SpatialFgcQuestionStudioQlIdV1 {
  return qlId === "SPA-QL-031" || qlId === "SPA-QL-032" || qlId === "SPA-QL-033" || qlId === "SPA-QL-034";
}

export function generateSpatialFgcStudioQuestionV1(input: {
  qlId: SpatialFgcQuestionStudioQlIdV1;
  seed: string;
  language?: SpatialFgcQuestionStudioLanguageV1;
}): SpatialFgcStudioQuestionV1 {
  const language = input.language ?? "en";
  const source = generateFigureCompletionLocalizedQuestionV1({
    qlId: input.qlId,
    seed: input.seed,
    language,
  });

  return {
    version: "SPA-FGC-001-QUESTION-STUDIO-QUESTION-V1",
    packageId: "SPA-001",
    qlId: source.qlId,
    proposalId: source.proposalId,
    chapterCode: "FGC-001",
    qlName: source.qlName,
    language: source.language,
    locale: source.locale,
    difficultyBand: spatialQuestionStudioDifficultyV1(source.baseDifficulty),
    seed: source.seed,
    generationSeed: source.generationSeed,
    mode: source.prototypeId,
    stem: source.stem,
    stimulusSvgs: source.stimulusScenes.map((scene) => renderSpatialSceneToSvg(scene)),
    optionSvgs: source.optionScenes.map((scene) => renderSpatialSceneToSvg(scene)),
    optionLabels: ["A", "B", "C", "D"],
    correctIndex: source.correctOptionIndex,
    answer: source.answer,
    explanation: source.explanation,
    questionId: source.questionId,
    canonicalItemId: source.canonicalItemId,
    questionLanguageId: source.questionLanguageId,
    contentFingerprint: source.contentFingerprint,
    renderer: source.renderer,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
    localization: {
      authority: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en",
      targetLanguage: language,
      semanticParity: "GEOMETRY_AND_ANSWER_EXACT",
      learnerFieldsLocalized: ["qlName", "stem", "explanation"],
      sourceFreezeAuthority: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    },
    validation: {
      valid: true,
      semanticOptionUniqueness: source.validation.semanticOptionUniqueness,
      perceptualOptionUniqueness: source.validation.perceptualOptionUniqueness,
      learnerExplanationSafe: source.validation.learnerExplanationSafe,
      uniqueAnswer: source.validation.uniqueAnswer,
    },
    sourceAuthority: {
      englishFreezeAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.fgcEnglishFreezeAuthority,
      localizationFreezeAuthority: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      sourceQuestionFingerprint: source.sourceQuestionFingerprint,
      deliveryFingerprint: source.deliveryFingerprint,
    },
    lifecycle: {
      reviewOnly: true,
      questionStudioDiscoverable: true,
      registrationStatus: "REGISTERED",
      persistenceAllowed: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
