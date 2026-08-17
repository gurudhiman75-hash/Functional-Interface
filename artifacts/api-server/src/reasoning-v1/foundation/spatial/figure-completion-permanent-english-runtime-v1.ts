import { spatialSceneSemanticFingerprint } from "./normalize";
import { validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "./validator";
import type { SpatialScene } from "./types";
import {
  generateFigureCompletionDiscoveryQuestionV2,
  type FigureCompletionPrototypeV1,
} from "./figure-completion-discovery-v2-hardened";
import {
  generateFigureCompletionSymmetryQuestionV1,
  type FigureCompletionSymmetryPrototypeV1,
} from "./figure-completion-symmetry-discovery-v1";
import {
  FGC_001_ARC_PROTOTYPE_V1,
  generateFigureCompletionArcQuestionV1,
} from "./figure-completion-arc-discovery-v1";
import {
  generateFigureCompletionSourceGapQuestionV2,
  type FigureCompletionSourceGapPrototypeV1,
} from "./figure-completion-source-gap-discovery-v2-exam-ready";
import {
  SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2,
  type SpatialFgcPermanentQlAllocationV2,
} from "./spatial-permanent-ql-allocation-v2";

export const FGC_001_PERMANENT_ENGLISH_RUNTIME_VERSION_V1 = "FGC-001-PERMANENT-ENGLISH-RUNTIME-V1" as const;

export type FigureCompletionPermanentQlIdV1 =
  (typeof SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2)[number]["permanentQlId"];

export type FigureCompletionPermanentPrototypeV1 =
  | FigureCompletionPrototypeV1
  | FigureCompletionSymmetryPrototypeV1
  | typeof FGC_001_ARC_PROTOTYPE_V1
  | FigureCompletionSourceGapPrototypeV1;

export interface FigureCompletionPermanentEnglishQuestionV1 {
  version: typeof FGC_001_PERMANENT_ENGLISH_RUNTIME_VERSION_V1;
  packageId: "SPA-001";
  chapterCode: "FGC-001";
  qlId: FigureCompletionPermanentQlIdV1;
  proposalId: SpatialFgcPermanentQlAllocationV2["proposalId"];
  qlName: string;
  candidateAuthorityId: SpatialFgcPermanentQlAllocationV2["candidateAuthorityId"];
  prototypeId: FigureCompletionPermanentPrototypeV1;
  language: "en";
  locale: "en-IN";
  baseDifficulty: SpatialFgcPermanentQlAllocationV2["baseDifficulty"];
  seed: string;
  generationSeed: string;
  stem: string;
  stimulusScenes: SpatialScene[];
  optionScenes: [SpatialScene, SpatialScene, SpatialScene, SpatialScene];
  correctOptionIndex: 0 | 1 | 2 | 3;
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
  deliveryFingerprint: string;
  sourceQuestionFingerprint: string;
  validation: {
    valid: true;
    semanticOptionUniqueness: true;
    perceptualOptionUniqueness: true;
    learnerExplanationSafe: true;
    uniqueAnswer: true;
  };
  renderer: {
    kind: "SVG";
    recommendedStimulusPixels: 384;
    recommendedOptionPixels: 128;
    mobileMinimumOptionPixels: 104;
  };
  lifecycle: {
    maturity: "PERMANENT_ENGLISH_RUNTIME_REVIEW";
    reviewOnly: true;
    questionStudioDiscoverable: false;
    registrationStatus: "NOT_REGISTERED";
    persistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    hindiPunjabiGeneration: false;
  };
}

const QL_PROTOTYPES: Readonly<Record<FigureCompletionPermanentQlIdV1, readonly FigureCompletionPermanentPrototypeV1[]>> = {
  "SPA-QL-031": [
    "FGC-PROT-01-STRAIGHT-CONTINUITY",
    "FGC-PROT-02-CURVED-PATH-CONTINUITY",
    "FGC-PROT-03-JUNCTION-CONTINUITY",
    "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY",
  ],
  "SPA-QL-032": [
    "FGC-PROT-05-COMPOUND-CONTOUR-MARKER",
    "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION",
  ],
  "SPA-QL-033": [
    "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY",
    "FGC-PROT-08-ARC-QUADRANT-SYMMETRY",
  ],
  "SPA-QL-034": [
    "FGC-PROT-07-MIRROR-STATE-REVERSAL",
    "FGC-PROT-10-SHAPE-CONTACT-STATE",
  ],
};

export const FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1 = QL_PROTOTYPES;

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shortHash(value: string): string {
  return hash32(value).toString(16).padStart(8, "0");
}

function allocationFor(qlId: FigureCompletionPermanentQlIdV1): SpatialFgcPermanentQlAllocationV2 {
  const allocation = SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.find((entry) => entry.permanentQlId === qlId);
  if (!allocation) throw new Error(`Unknown FGC permanent QL ${qlId}.`);
  return allocation;
}

interface NormalizedSourceQuestion {
  prototypeId: FigureCompletionPermanentPrototypeV1;
  stem: string;
  stimulusScene: SpatialScene;
  optionScenes: [SpatialScene, SpatialScene, SpatialScene, SpatialScene];
  correctOptionIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  explanation: FigureCompletionPermanentEnglishQuestionV1["explanation"];
  contentFingerprint: string;
  deliveryFingerprint: string;
  matchingOptionIndexes: number[];
}

function normalizeOptions(options: readonly { scene: SpatialScene }[]): [SpatialScene, SpatialScene, SpatialScene, SpatialScene] {
  if (options.length !== 4) throw new Error(`FGC permanent runtime requires exactly four options; found ${options.length}.`);
  return [options[0]!.scene, options[1]!.scene, options[2]!.scene, options[3]!.scene];
}

function editorializeExplanation(question: NormalizedSourceQuestion): NormalizedSourceQuestion {
  const answer = question.answer;
  switch (question.prototypeId) {
    case "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY":
      return {
        ...question,
        explanation: {
          observation: "Two parallel lines reach the missing square and continue on the other side.",
          rule: "Both lines must keep the same direction and the same gap between them through the missing square.",
          application: "Continue both lines at their visible angle without flattening, reversing, or shifting either line.",
          check: `Option ${answer} is the only piece that reconnects both lines with the same direction and spacing.`,
        },
      };
    case "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY":
      return {
        ...question,
        explanation: {
          observation: "The three visible quadrants contain the same crossed lines and dot, reflected across the centre lines.",
          rule: "The right quadrant is the left quadrant reflected sideways, and the lower quadrant is the upper quadrant reflected downward.",
          application: "Reflect the top-left crossed lines and dot across both centre lines to get the missing bottom-right quadrant.",
          check: `Option ${answer} alone puts both crossed lines and the dot in the positions required by those two reflections.`,
        },
      };
    case "FGC-PROT-07-MIRROR-STATE-REVERSAL":
      return {
        ...question,
        explanation: {
          observation: "Across each row the figure is mirrored; from the upper row to the lower row, outline parts become filled and filled parts become outline.",
          rule: "Use the mirror position and the filled/outline reversal together.",
          application: "Mirror the lower-left figure into the missing bottom-right quadrant and keep the lower-row fill reversal.",
          check: `Option ${answer} is the only one with the correct mirrored position and the required filled/outline state.`,
        },
      };
    case "FGC-PROT-08-ARC-QUADRANT-SYMMETRY":
      return {
        ...question,
        explanation: {
          observation: "The three visible quadrants repeat two circular arcs and one diagonal around the centre.",
          rule: "The missing quadrant must continue the same two curve sizes around the centre and continue the diagonal toward the outer corner.",
          application: "Place both matching arcs in the bottom-right quadrant and extend the diagonal from the centre to the bottom-right corner.",
          check: `Option ${answer} is the only figure that completes both arcs and the diagonal in the correct positions.`,
        },
      };
    case "FGC-PROT-10-SHAPE-CONTACT-STATE":
      return {
        ...question,
        explanation: {
          observation: "The completed pairs show that a circle touching a filled circle is also filled, while a circle touching an outline circle is also outline; two straight guide lines also enter the blank.",
          rule: "Match the fill of each touching circle and join the two guide lines with the same unflipped right-angle corner.",
          application: "Use a filled circle at the left contact, an outline circle at the top contact, and the right-angle corner that joins the visible guides without flipping it.",
          check: `Option ${answer} alone has the correct filled/outline contacts and the correct unflipped right-angle corner.`,
        },
      };
    default:
      return question;
  }
}

function generateSourceQuestion(
  prototypeId: FigureCompletionPermanentPrototypeV1,
  generationSeed: string,
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3,
): NormalizedSourceQuestion {
  let normalized: NormalizedSourceQuestion;
  if (prototypeId === FGC_001_ARC_PROTOTYPE_V1) {
    const question = generateFigureCompletionArcQuestionV1({ seed: generationSeed, desiredCorrectOptionIndex });
    normalized = {
      prototypeId,
      stem: question.stem,
      stimulusScene: question.stimulusScene,
      optionScenes: normalizeOptions(question.options),
      correctOptionIndex: question.correctOptionIndex,
      answer: question.answer,
      explanation: question.explanation,
      contentFingerprint: question.contentFingerprint,
      deliveryFingerprint: question.deliveryFingerprint,
      matchingOptionIndexes: question.solverEvidence.matchingOptionIndexes,
    };
  } else if (prototypeId === "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY" || prototypeId === "FGC-PROT-07-MIRROR-STATE-REVERSAL") {
    const question = generateFigureCompletionSymmetryQuestionV1({ prototypeId, seed: generationSeed, desiredCorrectOptionIndex });
    normalized = {
      prototypeId,
      stem: question.stem,
      stimulusScene: question.stimulusScene,
      optionScenes: normalizeOptions(question.options),
      correctOptionIndex: question.correctOptionIndex,
      answer: question.answer,
      explanation: question.explanation,
      contentFingerprint: question.contentFingerprint,
      deliveryFingerprint: question.deliveryFingerprint,
      matchingOptionIndexes: question.solverEvidence.matchingOptionIndexes,
    };
  } else if (prototypeId === "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION" || prototypeId === "FGC-PROT-10-SHAPE-CONTACT-STATE") {
    const question = generateFigureCompletionSourceGapQuestionV2({ prototypeId, seed: generationSeed, desiredCorrectOptionIndex });
    normalized = {
      prototypeId,
      stem: question.stem,
      stimulusScene: question.stimulusScene,
      optionScenes: normalizeOptions(question.options),
      correctOptionIndex: question.correctOptionIndex,
      answer: question.answer,
      explanation: question.explanation,
      contentFingerprint: question.contentFingerprint,
      deliveryFingerprint: question.deliveryFingerprint,
      matchingOptionIndexes: question.solverEvidence.matchingOptionIndexes,
    };
  } else {
    const question = generateFigureCompletionDiscoveryQuestionV2({ prototypeId, seed: generationSeed, desiredCorrectOptionIndex });
    normalized = {
      prototypeId,
      stem: question.stem,
      stimulusScene: question.stimulusScene,
      optionScenes: normalizeOptions(question.options),
      correctOptionIndex: question.correctOptionIndex,
      answer: question.answer,
      explanation: question.explanation,
      contentFingerprint: question.contentFingerprint,
      deliveryFingerprint: question.deliveryFingerprint,
      matchingOptionIndexes: question.solverEvidence.matchingOptionIndexes,
    };
  }
  return editorializeExplanation(normalized);
}

function sourceQuestionIsValid(question: NormalizedSourceQuestion): boolean {
  if (!validateSpatialScene(question.stimulusScene).ok) return false;
  if (question.optionScenes.some((scene) => !validateSpatialScene(scene).ok)) return false;
  if (!validateSpatialOptionUniqueness(question.optionScenes).ok) return false;
  if (!validateSpatialPerceptualOptionUniquenessV2(question.optionScenes).ok) return false;
  if (!validateLearnerVisibleExplanationV2([
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ]).ok) return false;
  if (question.matchingOptionIndexes.length !== 1 || question.matchingOptionIndexes[0] !== question.correctOptionIndex) return false;
  return true;
}

function isRetryableGenerationError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("semantically equivalent") ||
    error.message.includes("perceptually equivalent") ||
    error.message.includes("completion oracle") ||
    error.message.includes("mobile circle-arrow clearance") ||
    error.message.includes("independent feature separation");
}

export function generateFigureCompletionPermanentEnglishQuestionV1(request: {
  qlId: FigureCompletionPermanentQlIdV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionPermanentEnglishQuestionV1 {
  if (!request.seed.trim()) throw new Error("FGC permanent English runtime requires a non-empty seed.");
  const allocation = allocationFor(request.qlId);
  if (allocation.allocationStatus !== "PERMANENT_QL_ALLOCATED_RUNTIME_PENDING") {
    throw new Error(`${request.qlId}: permanent allocation is not runtime-pending.`);
  }
  const prototypes = QL_PROTOTYPES[request.qlId];
  const prototypeId = prototypes[hash32(`${request.qlId}:${request.seed}:prototype`) % prototypes.length]!;

  let source: NormalizedSourceQuestion | null = null;
  let generationSeed = "";
  for (let attempt = 0; attempt < 96; attempt += 1) {
    generationSeed = `FGC-PERMANENT:${request.qlId}:${request.seed}:${prototypeId}:${String(attempt).padStart(2, "0")}`;
    try {
      const candidate = generateSourceQuestion(prototypeId, generationSeed, request.desiredCorrectOptionIndex);
      if (!sourceQuestionIsValid(candidate)) continue;
      source = candidate;
      break;
    } catch (error) {
      if (!isRetryableGenerationError(error)) throw error;
    }
  }
  if (!source) throw new Error(`${request.qlId}/${prototypeId}: could not generate a valid permanent English review question.`);

  const contentFingerprint = JSON.stringify({
    qlId: request.qlId,
    candidateAuthorityId: allocation.candidateAuthorityId,
    prototypeId,
    sourceContentFingerprint: source.contentFingerprint,
    stimulus: spatialSceneSemanticFingerprint(source.stimulusScene),
    options: source.optionScenes.map(spatialSceneSemanticFingerprint).sort(),
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    sourceDeliveryFingerprint: source.deliveryFingerprint,
    orderedOptions: source.optionScenes.map(spatialSceneSemanticFingerprint),
    correctOptionIndex: source.correctOptionIndex,
  });
  const key = shortHash(`${request.qlId}:${request.seed}:${deliveryFingerprint}`);

  return {
    version: FGC_001_PERMANENT_ENGLISH_RUNTIME_VERSION_V1,
    packageId: "SPA-001",
    chapterCode: "FGC-001",
    qlId: request.qlId,
    proposalId: allocation.proposalId,
    qlName: allocation.name,
    candidateAuthorityId: allocation.candidateAuthorityId,
    prototypeId,
    language: "en",
    locale: "en-IN",
    baseDifficulty: allocation.baseDifficulty,
    seed: request.seed,
    generationSeed,
    stem: source.stem,
    stimulusScenes: [source.stimulusScene],
    optionScenes: source.optionScenes,
    correctOptionIndex: source.correctOptionIndex,
    answer: source.answer,
    explanation: source.explanation,
    questionId: `SPA-FGC-${request.qlId}-${key}`,
    canonicalItemId: `SPA-FGC-CANON-${request.qlId}-${key}`,
    questionLanguageId: `SPA-FGC-EN-${request.qlId}-${key}`,
    contentFingerprint,
    deliveryFingerprint,
    sourceQuestionFingerprint: source.contentFingerprint,
    validation: {
      valid: true,
      semanticOptionUniqueness: true,
      perceptualOptionUniqueness: true,
      learnerExplanationSafe: true,
      uniqueAnswer: true,
    },
    renderer: {
      kind: "SVG",
      recommendedStimulusPixels: 384,
      recommendedOptionPixels: 128,
      mobileMinimumOptionPixels: 104,
    },
    lifecycle: {
      maturity: "PERMANENT_ENGLISH_RUNTIME_REVIEW",
      reviewOnly: true,
      questionStudioDiscoverable: false,
      registrationStatus: "NOT_REGISTERED",
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      hindiPunjabiGeneration: false,
    },
  };
}
