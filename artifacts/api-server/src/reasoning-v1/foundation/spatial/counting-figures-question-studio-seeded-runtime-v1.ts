import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
} from "./counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "./counting-figures-graph-v2";
import {
  FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  freezeCountingFiguresLocalizedQuestionV1,
} from "./counting-figures-localization-freeze-v1";
import {
  generateCountingFiguresPermanentEnglishQuestionV1,
  type CountingFiguresPermanentEnglishQuestionV1,
} from "./counting-figures-permanent-english-runtime-v1";
import type { CountingFigureTargetShapeV1 } from "./counting-figures-production-generator-v1";

export type CountingFiguresStudioLanguageV1 = "en" | "hi" | "pa";
export type CountingFiguresStudioDifficultyV1 = "Easy" | "Medium" | "Hard";
export type CountingFiguresStudioAnswerV1 = "A" | "B" | "C" | "D";

export interface CountingFiguresQuestionStudioQuestionV1 {
  version: "FCT-001-QUESTION-STUDIO-QUESTION-V1";
  packageId: "SPA-001";
  qlId: "SPA-QL-042";
  proposalId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION";
  chapterCode: "FCT-001";
  qlName: string;
  language: CountingFiguresStudioLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: CountingFiguresStudioDifficultyV1;
  seed: string;
  generationSeed: string;
  targetShape: CountingFigureTargetShapeV1;
  motifFamily: string;
  structuralVariant: string;
  equivalencePolicy: "TARGET_SHAPE_PARAMETERIZED";
  stem: string;
  stimulusSvgs: readonly [string];
  options: readonly [number, number, number, number];
  optionLabels: readonly ["A", "B", "C", "D"];
  correctIndex: number;
  answer: CountingFiguresStudioAnswerV1;
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
  structuralFingerprint: string;
  renderer: Readonly<{
    kind: "SVG_WITH_NUMERIC_OPTIONS";
    recommendedStimulusPixels: 280;
    mobileMinimumStimulusPixels: 220;
  }>;
  localization: Readonly<{
    authority: typeof FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
    canonicalLanguage: "en";
    targetLanguage: CountingFiguresStudioLanguageV1;
    semanticParity: "GRAPH_SVG_OPTIONS_COUNTS_ANSWER_AND_FINGERPRINTS_EXACT";
  }>;
  validation: Readonly<{
    valid: true;
    exactGraphSolverBacked: true;
    constructionCountMatched: true;
    uniqueNumericOptions: true;
    uniqueAnswer: true;
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

export const FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-QUESTION-STUDIO-SEEDED-RUNTIME-V1" as const,
  localizationFreezeAuthorityId: FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlId: "SPA-QL-042" as const,
  chapterCode: "FCT-001" as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  supportedTargetShapes: ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const,
  generationModel: "EXACT_GRAPH_SOLVER_SEEDED_CLOSED_FIGURE_ENUMERATION" as const,
  targetResolutionPolicy: "IMPLICIT_TARGET_RESOLVED_ONCE_THEN_EXPLICIT_CANONICAL_REPLAY" as const,
  canonicalReviewCorpusIsGenerationCeiling: false,
  status: "SEEDED_RUNTIME_IMPLEMENTED_OPERATOR_REVIEW_REQUIRED" as const,
  questionStudioDiscoverable: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticPublication: false,
  nextGate: "FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_V1_EXACT_HEAD_CI_THEN_OPERATOR_REVIEW" as const,
} as const);

if (!FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.seededQuestionStudioIntegrationAuthorized) {
  throw new Error("FCT-001 seeded Question Studio runtime is not authorized by localization freeze governance.");
}

function difficultyBand(source: CountingFiguresPermanentEnglishQuestionV1): CountingFiguresStudioDifficultyV1 {
  if (source.difficulty === "EASY") return "Easy";
  if (source.difficulty === "HARD") return "Hard";
  return "Medium";
}

function exactCount(source: CountingFiguresPermanentEnglishQuestionV1): number {
  switch (source.targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(source.graph).length;
    case "SQUARE": return enumerateSquaresV1(source.graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(source.graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(source.graph).length;
  }
}

function canonicalEnglishSource(input: Readonly<{
  seed: string;
  targetShape?: CountingFigureTargetShapeV1;
}>): CountingFiguresPermanentEnglishQuestionV1 {
  const resolvedTargetShape = input.targetShape ?? generateCountingFiguresPermanentEnglishQuestionV1({ seed: input.seed }).targetShape;
  return generateCountingFiguresPermanentEnglishQuestionV1({
    seed: input.seed,
    targetShape: resolvedTargetShape,
  });
}

function localizedSurface(source: CountingFiguresPermanentEnglishQuestionV1, language: CountingFiguresStudioLanguageV1) {
  if (language === "en") {
    return {
      qlName: source.permanentQlTitle,
      locale: "en-IN" as const,
      stem: source.stem,
      explanation: source.explanation,
    };
  }
  const localized = freezeCountingFiguresLocalizedQuestionV1(source, language);
  return {
    qlName: localized.permanentQlTitle,
    locale: localized.locale,
    stem: localized.stem,
    explanation: localized.explanation,
  };
}

const ANSWERS = ["A", "B", "C", "D"] as const;

export function generateCountingFiguresQuestionStudioSeededV1(input: Readonly<{
  seed: string;
  language: CountingFiguresStudioLanguageV1;
  targetShape?: CountingFigureTargetShapeV1;
}>): CountingFiguresQuestionStudioQuestionV1 {
  const source = canonicalEnglishSource({ seed: input.seed, targetShape: input.targetShape });
  if (source.permanentQlId !== "SPA-QL-042" || source.chapterCode !== "FCT-001") {
    throw new Error(`FCT-001 Question Studio source trace mismatch for seed ${input.seed}.`);
  }
  const solverCount = exactCount(source);
  if (solverCount !== source.correctCount || source.constructionExpectedCount !== source.correctCount) {
    throw new Error(`FCT-001 Question Studio exact count mismatch for seed ${input.seed}.`);
  }
  if (new Set(source.options).size !== 4 || source.options[source.correctIndex] !== source.correctCount) {
    throw new Error(`FCT-001 Question Studio invalid numeric options for seed ${input.seed}.`);
  }
  const surface = localizedSurface(source, input.language);
  const canonicalItemId = `fct-001:${source.geometryFingerprint}:${source.contentFingerprint}`;
  const questionLanguageId = `${canonicalItemId}:${input.language}`;
  return Object.freeze({
    version: "FCT-001-QUESTION-STUDIO-QUESTION-V1",
    packageId: "SPA-001",
    qlId: "SPA-QL-042",
    proposalId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION",
    chapterCode: "FCT-001",
    qlName: surface.qlName,
    language: input.language,
    locale: surface.locale,
    difficultyBand: difficultyBand(source),
    seed: input.seed,
    generationSeed: input.seed,
    targetShape: source.targetShape,
    motifFamily: source.motifFamily,
    structuralVariant: source.structuralVariant,
    equivalencePolicy: "TARGET_SHAPE_PARAMETERIZED",
    stem: surface.stem,
    stimulusSvgs: Object.freeze([source.svg]) as readonly [string],
    options: Object.freeze([...source.options]) as readonly [number, number, number, number],
    optionLabels: Object.freeze(["A", "B", "C", "D"]) as readonly ["A", "B", "C", "D"],
    correctIndex: source.correctIndex,
    answer: ANSWERS[source.correctIndex]!,
    explanation: surface.explanation,
    canonicalItemId,
    questionLanguageId,
    contentFingerprint: source.contentFingerprint,
    geometryFingerprint: source.geometryFingerprint,
    structuralFingerprint: source.structuralFingerprint,
    renderer: Object.freeze({
      kind: "SVG_WITH_NUMERIC_OPTIONS",
      recommendedStimulusPixels: 280,
      mobileMinimumStimulusPixels: 220,
    }),
    localization: Object.freeze({
      authority: FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en",
      targetLanguage: input.language,
      semanticParity: "GRAPH_SVG_OPTIONS_COUNTS_ANSWER_AND_FINGERPRINTS_EXACT",
    }),
    validation: Object.freeze({
      valid: true,
      exactGraphSolverBacked: true,
      constructionCountMatched: true,
      uniqueNumericOptions: true,
      uniqueAnswer: true,
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

export function generateCountingFiguresQuestionStudioBatchV1(input: Readonly<{
  seed: string;
  language: CountingFiguresStudioLanguageV1;
  count: number;
  targetShape?: CountingFigureTargetShapeV1;
}>): readonly CountingFiguresQuestionStudioQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) {
    throw new Error("FCT-001 Question Studio batch count must be an integer from 1 to 50.");
  }
  const questions: CountingFiguresQuestionStudioQuestionV1[] = [];
  const geometries = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: CountingFiguresQuestionStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 30; retry += 1) {
      const candidate = generateCountingFiguresQuestionStudioSeededV1({
        seed: `${input.seed}:${index}:${retry}`,
        language: input.language,
        targetShape: input.targetShape,
      });
      if (!geometries.has(candidate.geometryFingerprint)) {
        accepted = candidate;
        break;
      }
    }
    if (!accepted) throw new Error(`FCT-001 Question Studio batch could not produce geometry-unique item at index ${index}.`);
    geometries.add(accepted.geometryFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
