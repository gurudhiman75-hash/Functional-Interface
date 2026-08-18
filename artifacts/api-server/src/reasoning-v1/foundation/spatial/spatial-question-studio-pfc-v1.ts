import {
  PFC_001_ENGLISH_FREEZE_AUTHORITY_V1,
} from "./paper-folding-english-freeze-v1";
import {
  PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
} from "./paper-folding-localization-freeze-v1";
import {
  localizePfcPermanentQuestionV1,
  renderPfcLocalizedStimulusSvgV1,
  type PfcLocalizedLanguageV1,
} from "./paper-folding-localization-v1";
import {
  generatePfcPermanentEnglishQlV1,
  type PfcPermanentEnglishQuestionV1,
} from "./paper-folding-permanent-english-runtime-v1";
import {
  renderPfcDiscoveryOptionSvgV1,
} from "./paper-folding-discovery-v1";
import {
  renderPfcDiscoveryStimulusSvgV3,
} from "./paper-folding-discovery-presentation-v3";
import {
  SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3,
  type PfcPermanentQlIdV3,
} from "./spatial-permanent-ql-allocation-v3";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  spatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioDifficultyV1,
} from "./spatial-question-studio-integration-v1";

export type SpatialPfcQuestionStudioQlIdV1 = PfcPermanentQlIdV3;
export type SpatialPfcQuestionStudioLanguageV1 = "en" | PfcLocalizedLanguageV1;

type PfcLocalizedSourceV1 = ReturnType<typeof localizePfcPermanentQuestionV1>;
type PfcStudioSourceV1 = PfcPermanentEnglishQuestionV1 | PfcLocalizedSourceV1;

export interface SpatialPfcStudioQuestionV1 {
  version: "SPA-PFC-001-QUESTION-STUDIO-QUESTION-V1";
  packageId: "SPA-001";
  qlId: SpatialPfcQuestionStudioQlIdV1;
  proposalId: string;
  chapterCode: "PFC-001";
  qlName: string;
  language: SpatialPfcQuestionStudioLanguageV1;
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
    recommendedStimulusPixels: 520;
    recommendedOptionPixels: 128;
    mobileMinimumOptionPixels: 112;
  };
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority;
  localization: {
    authority: typeof PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
    canonicalLanguage: "en";
    targetLanguage: SpatialPfcQuestionStudioLanguageV1;
    semanticParity: "GEOMETRY_AND_ANSWER_EXACT";
    learnerFieldsLocalized: readonly ["qlName", "stem", "explanation", "diagramLabels"];
    sourceFreezeAuthority: typeof PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
  };
  validation: {
    valid: true;
    semanticOptionUniqueness: true;
    perceptualOptionUniqueness: true;
    learnerExplanationSafe: true;
    uniqueAnswer: true;
  };
  sourceAuthority: {
    englishFreezeAuthority: typeof PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
    localizationFreezeAuthority: typeof PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
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

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function allocationFor(qlId: SpatialPfcQuestionStudioQlIdV1) {
  const allocation = SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3.find(
    (entry) => entry.permanentQlId === qlId,
  );
  if (!allocation) throw new Error(`Unknown PFC Question Studio QL '${qlId}'.`);
  return allocation;
}

function explanationFor(
  source: PfcStudioSourceV1,
  language: SpatialPfcQuestionStudioLanguageV1,
) {
  if (language === "hi") {
    return {
      observation: "तीर देखकर समझें कि कागज़ किस तरफ मोड़ा गया है और कट कहाँ किया गया है।",
      rule: "मोड़ उलटे क्रम में खोलें। कट जिन परतों से गुजरता है, खोलने पर उन्हीं के अनुसार मिलती हुई जगहों पर निशान बनते हैं।",
      application: source.explanation,
      check: `विकल्प ${source.correctOptionId} में पूरा खुला हुआ सही कट-पैटर्न है।`,
    } as const;
  }
  if (language === "pa") {
    return {
      observation: "ਤੀਰ ਵੇਖ ਕੇ ਸਮਝੋ ਕਿ ਕਾਗਜ਼ ਕਿਹੜੇ ਪਾਸੇ ਮੋੜਿਆ ਗਿਆ ਹੈ ਅਤੇ ਕੱਟ ਕਿੱਥੇ ਕੀਤਾ ਗਿਆ ਹੈ।",
      rule: "ਮੋੜ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਖੋਲ੍ਹੋ। ਕੱਟ ਜਿਨ੍ਹਾਂ ਪਰਤਾਂ ਵਿਚੋਂ ਲੰਘਦਾ ਹੈ, ਖੋਲ੍ਹਣ ਤੇ ਉਨ੍ਹਾਂ ਅਨੁਸਾਰ ਮਿਲਦੀਆਂ ਥਾਵਾਂ ਤੇ ਨਿਸ਼ਾਨ ਬਣਦੇ ਹਨ।",
      application: source.explanation,
      check: `ਵਿਕਲਪ ${source.correctOptionId} ਵਿੱਚ ਪੂਰਾ ਖੁੱਲ੍ਹਿਆ ਸਹੀ ਕੱਟ-ਪੈਟਰਨ ਹੈ।`,
    } as const;
  }
  return {
    observation: "Follow the fold arrows and note where the cut is made on the folded paper.",
    rule: "Open the folds in reverse order. A cut is copied only through the paper layers it actually passed through.",
    application: source.explanation,
    check: `Option ${source.correctOptionId} shows the complete unfolded cut pattern.`,
  } as const;
}

export function isSpatialPfcQuestionStudioQlIdV1(
  qlId: string,
): qlId is SpatialPfcQuestionStudioQlIdV1 {
  return qlId === "SPA-QL-035"
    || qlId === "SPA-QL-036"
    || qlId === "SPA-QL-037"
    || qlId === "SPA-QL-038";
}

export function generateSpatialPfcStudioQuestionV1(input: {
  qlId: SpatialPfcQuestionStudioQlIdV1;
  seed: string;
  language?: SpatialPfcQuestionStudioLanguageV1;
}): SpatialPfcStudioQuestionV1 {
  const language = input.language ?? "en";
  const EnglishQuestions = generatePfcPermanentEnglishQlV1(input.qlId);
  const sourceIndex = hash32(`${input.qlId}:${input.seed}:PFC-FROZEN`) % EnglishQuestions.length;
  const englishSource = EnglishQuestions[sourceIndex]!;
  const source: PfcStudioSourceV1 = language === "en"
    ? englishSource
    : localizePfcPermanentQuestionV1(englishSource, language);
  const allocation = allocationFor(input.qlId);
  const stimulusSvg = language === "en"
    ? renderPfcDiscoveryStimulusSvgV3(englishSource, 520)
    : renderPfcLocalizedStimulusSvgV1(source as PfcLocalizedSourceV1, 520);
  const explanation = explanationFor(source, language);

  return {
    version: "SPA-PFC-001-QUESTION-STUDIO-QUESTION-V1",
    packageId: "SPA-001",
    qlId: input.qlId,
    proposalId: allocation.proposalId,
    chapterCode: "PFC-001",
    qlName: source.permanentQlTitle,
    language,
    locale: language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN",
    difficultyBand: spatialQuestionStudioDifficultyV1(allocation.baseDifficulty),
    seed: input.seed,
    generationSeed: `${input.seed}:PFC:${sourceIndex}`,
    mode: source.representationId,
    stem: source.stem,
    stimulusSvgs: [stimulusSvg],
    optionSvgs: source.options.map((option) => renderPfcDiscoveryOptionSvgV1(option, 128)),
    optionLabels: ["A", "B", "C", "D"],
    correctIndex: source.correctOptionIndex,
    answer: source.correctOptionId,
    explanation,
    questionId: source.permanentQuestionId,
    canonicalItemId: source.canonicalQuestionId,
    questionLanguageId: source.permanentQuestionId,
    contentFingerprint: source.deliveryFingerprint,
    renderer: {
      kind: "SVG",
      recommendedStimulusPixels: 520,
      recommendedOptionPixels: 128,
      mobileMinimumOptionPixels: 112,
    },
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
    localization: {
      authority: PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en",
      targetLanguage: language,
      semanticParity: "GEOMETRY_AND_ANSWER_EXACT",
      learnerFieldsLocalized: ["qlName", "stem", "explanation", "diagramLabels"],
      sourceFreezeAuthority: PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    },
    validation: {
      valid: true,
      semanticOptionUniqueness: true,
      perceptualOptionUniqueness: true,
      learnerExplanationSafe: true,
      uniqueAnswer: true,
    },
    sourceAuthority: {
      englishFreezeAuthority: PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      localizationFreezeAuthority: PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      sourceQuestionFingerprint: source.semanticFingerprint,
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
