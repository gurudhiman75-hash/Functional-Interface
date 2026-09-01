import {
  generateSpatialFinalHeldGapReviewQuestionV3,
  type SpatialFinalHeldGapNumericQuestionV3,
} from "./spatial-final-held-gap-review-runtime-v3";
import type {
  SpatialFinalHeldGapEmbeddedQuestionV1,
  SpatialFinalHeldGapLanguageV1,
  SpatialFinalHeldGapQlIdV1,
} from "./spatial-final-held-gap-review-runtime-v1";
import { SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1 } from "./spatial-final-held-gap-freeze-v1";
import { SPATIAL_FINAL_HELD_GAP_PERMANENT_QL_ALLOCATIONS_V9 } from "./spatial-permanent-ql-allocation-v9";

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);

type OptionLabel = (typeof OPTION_LABELS)[number];

function proposalId(qlId: SpatialFinalHeldGapQlIdV1) {
  const entry = SPATIAL_FINAL_HELD_GAP_PERMANENT_QL_ALLOCATIONS_V9.find(
    (allocation) => allocation.permanentQlId === qlId,
  );
  if (!entry) throw new Error(`Missing permanent allocation for ${qlId}.`);
  return entry.proposalId;
}

function observation(language: SpatialFinalHeldGapLanguageV1, qlId: SpatialFinalHeldGapQlIdV1): string {
  if (language === "hi") {
    if (qlId === "SPA-QL-048") return "आकृति को पूरी लगातार सीधी रेखाओं के समूहों में बाँटकर गिनें।";
    if (qlId === "SPA-QL-049") return "लक्षित वृत्त या अर्धवृत्त को व्यवस्थित समूहों में बाँटकर गिनें।";
    return "पहले लक्ष्य आकृति के विशिष्ट जोड़ और रेखाओं को पहचानें, फिर विकल्पों में घुमाकर मिलान करें।";
  }
  if (language === "pa") {
    if (qlId === "SPA-QL-048") return "ਆਕ੍ਰਿਤੀ ਨੂੰ ਪੂਰੀਆਂ ਲਗਾਤਾਰ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਦੇ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਗਿਣੋ।";
    if (qlId === "SPA-QL-049") return "ਨਿਸ਼ਾਨੇ ਵਾਲੇ ਵਰਤੁੱਲ ਜਾਂ ਅਰਧ-ਵਰਤੁੱਲ ਨੂੰ ਸੁਵਿਧਾਜਨਕ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਗਿਣੋ।";
    return "ਪਹਿਲਾਂ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਦੇ ਖਾਸ ਜੋੜ ਅਤੇ ਰੇਖਾਵਾਂ ਪਛਾਣੋ, ਫਿਰ ਵਿਕਲਪਾਂ ਵਿੱਚ ਘੁਮਾ ਕੇ ਮਿਲਾਓ।";
  }
  if (qlId === "SPA-QL-048") return "Break the figure into convenient groups of complete continuous straight lines before counting.";
  if (qlId === "SPA-QL-049") return "Break the target circles or semicircles into convenient groups and count each complete primitive once.";
  return "Identify the target's distinctive junctions and edges first, then rotate it mentally while checking the options.";
}

function numericOptionSvg(value: number, label: OptionLabel): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 72" width="120" height="72" role="img" aria-label="Option ${label}: ${value}"><rect x="1" y="1" width="118" height="70" rx="6" fill="white" stroke="#111827" stroke-width="1.35"/><text x="60" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#111827">${value}</text></svg>`;
}

function lifecycle() {
  return Object.freeze({
    questionStudioDiscoverable: true as const,
    registrationStatus: "REGISTERED" as const,
    persistenceAllowed: true as const,
    questionBankStatus: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.questionBankStatus,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.questionBankAcceptanceMode,
    testEligibility: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.testEligibility,
    testEligible: true as const,
    testBuilderEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: false as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    manualApprovalRequired: true as const,
    manualQuestionPublicationRequired: true as const,
    automaticStudentPublication: false as const,
    releaseAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.authorityId,
  });
}

function richExplanation(
  source: SpatialFinalHeldGapNumericQuestionV3 | SpatialFinalHeldGapEmbeddedQuestionV1,
) {
  return Object.freeze({
    observation: observation(source.language, source.qlId),
    rule: source.explanation.rule,
    application: source.explanation.working.join(" "),
    check: source.explanation.answerLine,
  });
}

export type SpatialFinalHeldGapQuestionStudioNumericV1 = Readonly<{
  version: "SPA-FINAL-HELD-GAP-QUESTION-STUDIO-NUMERIC-V1";
  packageId: "SPA-001";
  qlId: "SPA-QL-048" | "SPA-QL-049";
  proposalId: "FCT-CAND-B-STRAIGHT-LINE-ENUMERATION" | "FCT-CAND-C-CURVED-PRIMITIVE-ENUMERATION";
  chapterCode: "FCT-001";
  qlName: string;
  language: SpatialFinalHeldGapLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: "Easy" | "Medium" | "Hard";
  seed: string;
  generationSeed: string;
  mode: "SYSTEMATIC_STRAIGHT_LINE_ENUMERATION" | "SYSTEMATIC_CURVED_PRIMITIVE_ENUMERATION";
  stem: string;
  stimulusSvgs: readonly [string];
  options: readonly [number, number, number, number];
  optionLabels: typeof OPTION_LABELS;
  optionSvgs: readonly [string, string, string, string];
  correctIndex: number;
  answer: OptionLabel;
  explanation: ReturnType<typeof richExplanation>;
  canonicalItemId: string;
  questionLanguageId: string;
  questionId: string;
  contentFingerprint: string;
  geometryFingerprint: string;
  renderer: Readonly<{
    kind: "SVG_WITH_NUMERIC_OPTIONS";
    recommendedStimulusPixels: 280;
    mobileMinimumStimulusPixels: 220;
  }>;
  localization: Readonly<{
    authority: typeof SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId;
    canonicalLanguage: "en";
    targetLanguage: SpatialFinalHeldGapLanguageV1;
    semanticParity: "GEOMETRY_OPTIONS_ANSWER_AND_SOLVE_FACTS_EXACT";
  }>;
  validation: Readonly<{
    valid: true;
    exactSolverBacked: true;
    uniqueNumericOptions: true;
    uniqueAnswer: true;
    learnerExplanationSafe: true;
  }>;
  lifecycle: ReturnType<typeof lifecycle>;
  sourceFreezeAuthority: typeof SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId;
}>;

export type SpatialFinalHeldGapQuestionStudioEmbeddedV1 = Readonly<{
  version: "SPA-FINAL-HELD-GAP-QUESTION-STUDIO-EMBEDDED-V1";
  packageId: "SPA-001";
  qlId: "SPA-QL-050";
  proposalId: "EMB-PROP-02";
  chapterCode: "EMB-001";
  qlName: string;
  language: SpatialFinalHeldGapLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: "Easy" | "Medium" | "Hard";
  seed: string;
  generationSeed: string;
  mode: "ROTATION_ALLOWED_EMBEDDED_SUBGRAPH";
  stem: string;
  stimulusSvgs: readonly [string];
  optionSvgs: readonly [string, string, string, string];
  optionLabels: typeof OPTION_LABELS;
  correctIndex: number;
  answer: OptionLabel;
  explanation: ReturnType<typeof richExplanation>;
  canonicalItemId: string;
  questionLanguageId: string;
  questionId: string;
  contentFingerprint: string;
  geometryFingerprint: string;
  renderer: Readonly<{
    kind: "SVG_WITH_IMAGE_OPTIONS";
    recommendedStimulusPixels: 220;
    recommendedOptionPixels: 180;
  }>;
  localization: Readonly<{
    authority: typeof SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId;
    canonicalLanguage: "en";
    targetLanguage: SpatialFinalHeldGapLanguageV1;
    semanticParity: "GEOMETRY_OPTIONS_ANSWER_AND_SOLVE_FACTS_EXACT";
  }>;
  validation: Readonly<{
    valid: true;
    exactSolverBacked: true;
    uniqueAnswer: true;
    rotationRequired: true;
    reflectionDisallowed: true;
    learnerExplanationSafe: true;
  }>;
  lifecycle: ReturnType<typeof lifecycle>;
  sourceFreezeAuthority: typeof SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId;
}>;

export type SpatialFinalHeldGapQuestionStudioQuestionV1 =
  | SpatialFinalHeldGapQuestionStudioNumericV1
  | SpatialFinalHeldGapQuestionStudioEmbeddedV1;

export function generateSpatialFinalHeldGapQuestionStudioV1(input: Readonly<{
  qlId: SpatialFinalHeldGapQlIdV1;
  seed: string;
  language: SpatialFinalHeldGapLanguageV1;
}>): SpatialFinalHeldGapQuestionStudioQuestionV1 {
  const source = generateSpatialFinalHeldGapReviewQuestionV3(input);
  const canonicalItemId = `${source.qlId}:${source.geometryFingerprint}:${source.contentFingerprint}`;
  const questionLanguageId = `${canonicalItemId}:${source.language}`;
  const common = {
    packageId: "SPA-001" as const,
    qlId: source.qlId,
    proposalId: proposalId(source.qlId),
    chapterCode: source.chapterCode,
    qlName: source.qlName,
    language: source.language,
    locale: source.locale,
    difficultyBand: source.difficultyBand,
    seed: source.seed,
    generationSeed: source.seed,
    stem: source.stem,
    stimulusSvgs: source.stimulusSvgs,
    correctIndex: source.correctIndex,
    answer: OPTION_LABELS[source.correctIndex]!,
    explanation: richExplanation(source),
    canonicalItemId,
    questionLanguageId,
    questionId: `spa-final-held-gap:${questionLanguageId}`,
    contentFingerprint: source.contentFingerprint,
    geometryFingerprint: source.geometryFingerprint,
    localization: Object.freeze({
      authority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
      canonicalLanguage: "en" as const,
      targetLanguage: source.language,
      semanticParity: "GEOMETRY_OPTIONS_ANSWER_AND_SOLVE_FACTS_EXACT" as const,
    }),
    lifecycle: lifecycle(),
    sourceFreezeAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
  };

  if (source.qlId === "SPA-QL-050") {
    if (source.solveFacts.reflectionUsed || source.solveFacts.fixedOrientationWouldMatchCorrectOption) {
      throw new Error(`${source.qlId}: frozen embedded runtime lost its rotation-only semantic boundary.`);
    }
    return Object.freeze({
      ...common,
      version: "SPA-FINAL-HELD-GAP-QUESTION-STUDIO-EMBEDDED-V1" as const,
      qlId: "SPA-QL-050" as const,
      proposalId: "EMB-PROP-02" as const,
      chapterCode: "EMB-001" as const,
      mode: "ROTATION_ALLOWED_EMBEDDED_SUBGRAPH" as const,
      optionSvgs: source.optionSvgs,
      optionLabels: OPTION_LABELS,
      renderer: Object.freeze({
        kind: "SVG_WITH_IMAGE_OPTIONS" as const,
        recommendedStimulusPixels: 220,
        recommendedOptionPixels: 180,
      }),
      validation: Object.freeze({
        valid: true as const,
        exactSolverBacked: true as const,
        uniqueAnswer: true as const,
        rotationRequired: true as const,
        reflectionDisallowed: true as const,
        learnerExplanationSafe: true as const,
      }),
    });
  }

  const numeric = source as SpatialFinalHeldGapNumericQuestionV3;
  if (new Set(numeric.options).size !== 4 || numeric.options[numeric.correctIndex] !== numeric.answer) {
    throw new Error(`${numeric.qlId}: frozen numeric option ownership is invalid.`);
  }
  const qlId = numeric.qlId as "SPA-QL-048" | "SPA-QL-049";
  return Object.freeze({
    ...common,
    version: "SPA-FINAL-HELD-GAP-QUESTION-STUDIO-NUMERIC-V1" as const,
    qlId,
    proposalId: qlId === "SPA-QL-048"
      ? "FCT-CAND-B-STRAIGHT-LINE-ENUMERATION" as const
      : "FCT-CAND-C-CURVED-PRIMITIVE-ENUMERATION" as const,
    chapterCode: "FCT-001" as const,
    mode: qlId === "SPA-QL-048"
      ? "SYSTEMATIC_STRAIGHT_LINE_ENUMERATION" as const
      : "SYSTEMATIC_CURVED_PRIMITIVE_ENUMERATION" as const,
    options: numeric.options,
    optionLabels: OPTION_LABELS,
    // Preview-only image surfaces keep the existing Spatial review panel usable.
    // Persistence strips these for SVG_WITH_NUMERIC_OPTIONS so Question Bank stores numeric text options.
    optionSvgs: Object.freeze(numeric.options.map((value, index) => numericOptionSvg(value, OPTION_LABELS[index]!))) as unknown as readonly [string, string, string, string],
    renderer: Object.freeze({
      kind: "SVG_WITH_NUMERIC_OPTIONS" as const,
      recommendedStimulusPixels: 280,
      mobileMinimumStimulusPixels: 220,
    }),
    validation: Object.freeze({
      valid: true as const,
      exactSolverBacked: true as const,
      uniqueNumericOptions: true as const,
      uniqueAnswer: true as const,
      learnerExplanationSafe: true as const,
    }),
  });
}
