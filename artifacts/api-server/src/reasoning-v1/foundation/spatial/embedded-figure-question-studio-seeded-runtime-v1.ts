import {
  EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  freezeEmbeddedFigureLocalizedQuestionV1,
} from "./embedded-figure-localization-freeze-v1";
import {
  generateEmbeddedFigurePermanentEnglishQuestionV1,
  type EmbeddedFigurePermanentEnglishQuestionV1,
} from "./embedded-figure-permanent-english-runtime-v1";

export type EmbeddedFigureStudioLanguageV1 = "en" | "hi" | "pa";
export type EmbeddedFigureStudioDifficultyV1 = "Easy" | "Medium" | "Hard";

export interface EmbeddedFigureQuestionStudioQuestionV1 {
  version: "EMB-001-QUESTION-STUDIO-QUESTION-V1";
  packageId: "SPA-001";
  qlId: "SPA-QL-041";
  proposalId: "EMB-PROP-01";
  chapterCode: "EMB-001";
  qlName: string;
  language: EmbeddedFigureStudioLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: EmbeddedFigureStudioDifficultyV1;
  seed: string;
  generationSeed: string;
  motifId: string;
  motifFamily: string;
  motifVariant: number;
  equivalencePolicy: "FIXED_ORIENTATION";
  stem: string;
  stimulusSvgs: readonly [string];
  optionSvgs: readonly [string, string, string, string];
  optionLabels: readonly ["A", "B", "C", "D"];
  correctIndex: number;
  answer: "A" | "B" | "C" | "D";
  explanation: Readonly<{
    observation: string;
    rule: string;
    application: string;
    check: string;
  }>;
  canonicalItemId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  geometryFingerprint: string;
  targetFingerprint: string;
  renderer: Readonly<{
    kind: "SVG";
    recommendedStimulusPixels: 220;
    recommendedOptionPixels: 150;
    mobileMinimumOptionPixels: 108;
  }>;
  localization: Readonly<{
    authority: typeof EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
    canonicalLanguage: "en";
    targetLanguage: EmbeddedFigureStudioLanguageV1;
    semanticParity: "GEOMETRY_OPTIONS_ANSWER_AND_FINGERPRINTS_EXACT";
  }>;
  validation: Readonly<{
    valid: true;
    exactSolverBacked: true;
    uniqueAnswer: true;
    everyOptionConnected: true;
    fixedOrientation: true;
  }>;
  lifecycle: Readonly<{
    reviewOnly: true;
    questionStudioDiscoverable: false;
    registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED";
    persistenceAllowed: false;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}

export const EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "EMB-001-QUESTION-STUDIO-SEEDED-RUNTIME-V1" as const,
  localizationFreezeAuthorityId: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlId: "SPA-QL-041" as const,
  chapterCode: "EMB-001" as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  generationModel: "EXACT_GRAPH_SOLVER_SEEDED_PARAMETER_EXPANSION" as const,
  canonicalReviewCorpusIsGenerationCeiling: false,
  sourceBackedCoreEnabled: true,
  rotationAllowed: false,
  reflectionAllowed: false,
  status: "SEEDED_RUNTIME_IMPLEMENTED_OPERATOR_REVIEW_REQUIRED" as const,
  questionStudioDiscoverable: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticPublication: false,
  nextGate: "EMB_001_QUESTION_STUDIO_SEEDED_RUNTIME_V1_EXACT_HEAD_CI_THEN_OPERATOR_REVIEW" as const,
} as const);

if (!EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.seededQuestionStudioIntegrationAuthorized) {
  throw new Error("EMB-001 seeded Question Studio runtime is not authorized by localization freeze governance.");
}

function difficultyBand(source: EmbeddedFigurePermanentEnglishQuestionV1): EmbeddedFigureStudioDifficultyV1 {
  if (source.difficulty === "L1") return "Easy";
  if (source.difficulty === "L3") return "Hard";
  return "Medium";
}

function localizedSurface(source: EmbeddedFigurePermanentEnglishQuestionV1, language: EmbeddedFigureStudioLanguageV1) {
  if (language === "en") {
    return {
      qlName: source.permanentQlTitle,
      locale: "en-IN" as const,
      stem: source.stem,
      explanation: source.explanation,
    };
  }
  const localized = freezeEmbeddedFigureLocalizedQuestionV1(source, language);
  return {
    qlName: localized.permanentQlTitle,
    locale: localized.locale,
    stem: localized.stem,
    explanation: localized.explanation,
  };
}

export function generateEmbeddedFigureQuestionStudioSeededV1(input: Readonly<{
  seed: string;
  language: EmbeddedFigureStudioLanguageV1;
}>): EmbeddedFigureQuestionStudioQuestionV1 {
  const source = generateEmbeddedFigurePermanentEnglishQuestionV1(input.seed);
  if (source.permanentQlId !== "SPA-QL-041" || source.equivalencePolicy !== "FIXED_ORIENTATION") {
    throw new Error(`EMB-001 Question Studio source trace mismatch for seed ${input.seed}.`);
  }
  const surface = localizedSurface(source, input.language);
  const canonicalItemId = `emb-001:${source.geometryFingerprint}:${source.contentFingerprint}`;
  const questionLanguageId = `${canonicalItemId}:${input.language}`;
  const optionSvgs = source.optionSvgs as readonly [string, string, string, string];
  if (optionSvgs.length !== 4) throw new Error(`EMB-001 Question Studio requires exactly four options for seed ${input.seed}.`);
  if (!source.connectivityValidation.finalComponentCounts.every((count) => count === 1)) {
    throw new Error(`EMB-001 Question Studio received disconnected option geometry for seed ${input.seed}.`);
  }

  return Object.freeze({
    version: "EMB-001-QUESTION-STUDIO-QUESTION-V1",
    packageId: "SPA-001",
    qlId: "SPA-QL-041",
    proposalId: "EMB-PROP-01",
    chapterCode: "EMB-001",
    qlName: surface.qlName,
    language: input.language,
    locale: surface.locale,
    difficultyBand: difficultyBand(source),
    seed: input.seed,
    generationSeed: input.seed,
    motifId: source.motifId,
    motifFamily: source.motifFamily,
    motifVariant: source.motifVariant,
    equivalencePolicy: "FIXED_ORIENTATION",
    stem: surface.stem,
    stimulusSvgs: Object.freeze([source.targetSvg]) as readonly [string],
    optionSvgs: Object.freeze([...optionSvgs]) as unknown as readonly [string, string, string, string],
    optionLabels: Object.freeze(["A", "B", "C", "D"]) as readonly ["A", "B", "C", "D"],
    correctIndex: source.correctIndex,
    answer: source.answer,
    explanation: surface.explanation,
    canonicalItemId,
    questionLanguageId,
    contentFingerprint: source.contentFingerprint,
    geometryFingerprint: source.geometryFingerprint,
    targetFingerprint: source.targetFingerprint,
    renderer: Object.freeze({
      kind: "SVG",
      recommendedStimulusPixels: 220,
      recommendedOptionPixels: 150,
      mobileMinimumOptionPixels: 108,
    }),
    localization: Object.freeze({
      authority: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en",
      targetLanguage: input.language,
      semanticParity: "GEOMETRY_OPTIONS_ANSWER_AND_FINGERPRINTS_EXACT",
    }),
    validation: Object.freeze({
      valid: true,
      exactSolverBacked: true,
      uniqueAnswer: true,
      everyOptionConnected: true,
      fixedOrientation: true,
    }),
    lifecycle: Object.freeze({
      reviewOnly: true,
      questionStudioDiscoverable: false,
      registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED",
      persistenceAllowed: false,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
  });
}

export function generateEmbeddedFigureQuestionStudioBatchV1(input: Readonly<{
  seed: string;
  language: EmbeddedFigureStudioLanguageV1;
  count: number;
}>): readonly EmbeddedFigureQuestionStudioQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) {
    throw new Error("EMB-001 Question Studio batch count must be an integer from 1 to 50.");
  }
  const questions: EmbeddedFigureQuestionStudioQuestionV1[] = [];
  const geometries = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: EmbeddedFigureQuestionStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 30; retry += 1) {
      const candidate = generateEmbeddedFigureQuestionStudioSeededV1({
        seed: `${input.seed}:${index}:${retry}`,
        language: input.language,
      });
      if (!geometries.has(candidate.geometryFingerprint)) {
        accepted = candidate;
        break;
      }
    }
    if (!accepted) throw new Error(`EMB-001 Question Studio batch could not produce geometry-unique item at index ${index}.`);
    geometries.add(accepted.geometryFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
