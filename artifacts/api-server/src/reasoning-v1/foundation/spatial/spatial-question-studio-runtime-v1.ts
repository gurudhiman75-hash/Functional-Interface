import { buildSpatialFan001ProofCorpus } from "../../proofs/spa-fnd-001-fan-001-corpus";
import { generateFigureAnalogyProofQuestion } from "./analogy-proof-generator";
import type { SpatialAnalogyFigureState, SpatialAnalogyRuleId } from "./analogy-types";
import { generateClockProofQuestion } from "./clock-proof-generator";
import { generateSpatialFanArbitraryAngleQuestionV1 } from "./fan-arbitrary-angle-v1";
import {
  generateSpatialFclGeometricFormQuestionV1,
  type SpatialFclGeometricFormModeV1,
} from "./fcl-geometric-form-safe-v1";
import {
  validateLearnerVisibleExplanationV2,
  validateSpatialPerceptualOptionUniquenessV2,
} from "./gap-question-perceptual-v2";
import { generateSpatialGapLearnerQuestionV1 } from "./gap-question-generator-v1";
import { generateGlyphStringProofQuestion } from "./glyph-string-proof-generator";
import { synthesizeSpatialFclAttemptV1, synthesizeSpatialFsrAttemptV1 } from "./production-synthesis-v1";
import { SpatialSeededRandom } from "./seed";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  type SpatialPermanentChapterCodeV1,
} from "./spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  spatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioDifficultyV1,
} from "./spatial-question-studio-integration-v1";
import { renderSpatialSceneToSvg } from "./svg-renderer";
import { generateSpatialTransformProofQuestion } from "./transform-proof-generator";
import type { SpatialScene } from "./types";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "./validator";

export type SpatialPermanentQlIdV1 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V1)[number]["permanentQlId"];

export interface SpatialStudioExplanationV1 {
  observation: string;
  rule: string;
  application: string;
  check: string;
}

export interface SpatialStudioQuestionV1 {
  version: "SPA-FND-001-QUESTION-STUDIO-QUESTION-V1";
  packageId: "SPA-001";
  qlId: SpatialPermanentQlIdV1;
  proposalId: string;
  chapterCode: SpatialPermanentChapterCodeV1;
  qlName: string;
  language: "en";
  locale: "en-IN";
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
  explanation: SpatialStudioExplanationV1;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  renderer: {
    kind: "SVG";
    recommendedStimulusPixels: 128;
    recommendedOptionPixels: 128;
    mobileMinimumOptionPixels: 104;
  };
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority;
  validation: {
    valid: true;
    semanticOptionUniqueness: true;
    perceptualOptionUniqueness: true;
    learnerExplanationSafe: true;
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

export interface SpatialStudioBatchRequestV1 {
  seed: string;
  count?: number;
  qlId?: SpatialPermanentQlIdV1;
  chapterCode?: SpatialPermanentChapterCodeV1;
  difficulty?: SpatialQuestionStudioDifficultyV1;
}

interface Candidate {
  generationSeed: string;
  mode: string;
  stem: string;
  stimulusScenes: SpatialScene[];
  optionScenes: SpatialScene[];
  correctOptionIndex: 0 | 1 | 2 | 3;
  explanation: SpatialStudioExplanationV1;
}

const LETTERS = ["A", "B", "C", "D"] as const;
const LATIN_GLYPHS = ["LATIN-F", "LATIN-L", "LATIN-P", "LATIN-R", "LATIN-K", "LATIN-Q"] as const;
const DIGIT_GLYPHS = ["DIGIT-2", "DIGIT-4", "DIGIT-5", "DIGIT-7"] as const;
const SHAPES = ["CIRCLE", "TRIANGLE", "SQUARE", "PENTAGON"] as const;
const MARKERS = ["TOP_LEFT", "TOP_RIGHT", "BOTTOM_RIGHT", "BOTTOM_LEFT"] as const;
const DIRECTIONS = ["UP", "RIGHT", "DOWN", "LEFT"] as const;
const ANCHORS = ["TOP", "RIGHT", "BOTTOM", "LEFT"] as const;
const FAN_CORPUS = buildSpatialFan001ProofCorpus();

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

function desiredSlot(seed: string): 0 | 1 | 2 | 3 {
  return (hash32(`${seed}:slot`) % 4) as 0 | 1 | 2 | 3;
}

function explanationArray(explanation: SpatialStudioExplanationV1): string[] {
  return [
    explanation.observation,
    explanation.rule,
    explanation.application,
    explanation.check,
  ];
}

function candidateIsValid(candidate: Candidate): boolean {
  if (candidate.optionScenes.length !== 4) return false;
  if (![0, 1, 2, 3].includes(candidate.correctOptionIndex)) return false;
  for (const scene of [...candidate.stimulusScenes, ...candidate.optionScenes]) {
    if (!validateSpatialScene(scene).ok) return false;
  }
  if (!validateSpatialOptionUniqueness(candidate.optionScenes).ok) return false;
  if (!validateSpatialPerceptualOptionUniquenessV2(candidate.optionScenes).ok) return false;
  if (!validateLearnerVisibleExplanationV2(explanationArray(candidate.explanation)).ok) return false;
  return true;
}

function directTransformCandidate(
  proposalId: "MIR-PQL-01" | "WAT-PQL-01",
  generationSeed: string,
): Candidate {
  const mirror = proposalId.startsWith("MIR");
  const question = generateSpatialTransformProofQuestion({
    seed: generationSeed,
    chapterCode: mirror ? "MIR-001" : "WAT-001",
    prototypeId: `QUESTION-STUDIO-${proposalId}-${shortHash(generationSeed)}`,
    requestedTransform: mirror ? "REFLECT_VERTICAL" : "REFLECT_HORIZONTAL",
    instructionKey: mirror ? "MIR_SELECT_EXACT_MIRROR" : "WAT_SELECT_EXACT_WATER",
  });
  return {
    generationSeed,
    mode: "GENERAL_COMPOSITION",
    stem: mirror
      ? "Choose the exact mirror image of the given figure."
      : "Choose the exact water image of the given figure.",
    stimulusScenes: [question.sourceScene],
    optionScenes: question.options.map((option) => option.scene),
    correctOptionIndex: question.correctOptionIndex,
    explanation: question.learnerExplanation,
  };
}

function glyphCandidate(
  proposalId: "MIR-PQL-02" | "WAT-PQL-02",
  generationSeed: string,
): Candidate {
  const mirror = proposalId.startsWith("MIR");
  const rng = new SpatialSeededRandom(generationSeed);
  const useLatin = rng.int(0, 1) === 0;
  const pool = useLatin ? LATIN_GLYPHS : DIGIT_GLYPHS;
  const length = rng.int(2, 4);
  const glyphIds = Array.from({ length }, () => rng.pick(pool));
  const stimulusKind = useLatin ? "LATIN_GLYPH_STRING" : "WESTERN_ARABIC_DIGIT_STRING";
  const question = generateGlyphStringProofQuestion({
    seed: generationSeed,
    chapterCode: mirror ? "MIR-001" : "WAT-001",
    prototypeId: `QUESTION-STUDIO-${proposalId}-${shortHash(generationSeed)}`,
    requestedTransform: mirror ? "REFLECT_VERTICAL" : "REFLECT_HORIZONTAL",
    instructionKey: mirror ? "MIR_SELECT_STRING" : "WAT_SELECT_STRING",
    glyphIds: glyphIds as any,
    stimulusKind,
  });
  return {
    generationSeed,
    mode: stimulusKind,
    stem: mirror
      ? "Choose the exact mirror image of the given letter or digit group."
      : "Choose the exact water image of the given letter or digit group.",
    stimulusScenes: [question.sourceScene],
    optionScenes: question.options.map((option) => option.scene),
    correctOptionIndex: question.correctOptionIndex,
    explanation: question.learnerExplanation,
  };
}

function mirrorClockCandidate(generationSeed: string): Candidate {
  const rng = new SpatialSeededRandom(generationSeed);
  const question = generateClockProofQuestion({
    seed: generationSeed,
    chapterCode: "MIR-001",
    prototypeId: `QUESTION-STUDIO-MIR-CLOCK-${shortHash(generationSeed)}`,
    requestedTransform: "REFLECT_VERTICAL",
    instructionKey: "MIR_SELECT_CLOCK_DIAGRAM",
    time: { hour: rng.int(1, 12), minute: rng.int(0, 59) },
  });
  return {
    generationSeed,
    mode: "ANALOG_CLOCK_GEOMETRY",
    stem: "Choose the exact mirror image of the given clock diagram.",
    stimulusScenes: [question.sourceScene],
    optionScenes: question.options.map((option) => option.scene),
    correctOptionIndex: question.correctOptionIndex,
    explanation: {
      observation: "Treat the clock as a figure. The vertical mirror keeps the 12–6 axis fixed while moving both visible hands to opposite left-right positions.",
      rule: "Reflect the complete dial-and-hand geometry across the vertical axis; do not convert this diagram task into mirror-time arithmetic.",
      application: "Track the hour hand and minute hand separately, reflect each across the centre line, and keep each hand length unchanged.",
      check: `Option ${LETTERS[question.correctOptionIndex]} alone places both hands at their exact reflected positions.`,
    },
  };
}

function fanAngleCandidate(generationSeed: string): Candidate {
  const angles = [45, -45, 135, -135] as const;
  const angle = angles[hash32(`${generationSeed}:angle`) % angles.length]!;
  const question = generateSpatialFanArbitraryAngleQuestionV1({
    seed: generationSeed,
    angleDeg: angle,
    desiredCorrectOptionIndex: desiredSlot(generationSeed),
  });
  return {
    generationSeed,
    mode: `WHOLE_FIGURE_ROTATION_${angle}`,
    stem: question.stemText,
    stimulusScenes: [...question.stimulusScenes],
    optionScenes: question.options.map((option) => option.scene),
    correctOptionIndex: question.correctOptionIndex,
    explanation: question.learnerExplanation,
  };
}

function randomFanState(seed: string, rule: SpatialAnalogyRuleId): SpatialAnalogyFigureState {
  const rng = new SpatialSeededRandom(seed);
  const outerShape = rng.pick(SHAPES);
  let innerShape = rng.pick(SHAPES);
  if (rule === "SWAP_INNER_OUTER" && innerShape === outerShape) {
    innerShape = SHAPES[(SHAPES.indexOf(innerShape) + 1) % SHAPES.length]!;
  }
  let segmentCount = rng.int(1, 4) as 1 | 2 | 3 | 4;
  if (rule === "ADD_SEGMENT") segmentCount = rng.int(1, 3) as 1 | 2 | 3;
  if (rule === "REMOVE_SEGMENT") segmentCount = rng.int(2, 4) as 2 | 3 | 4;
  return {
    outerShape,
    innerShape,
    outerRotationQuarter: rng.int(0, 3) as 0 | 1 | 2 | 3,
    innerRotationQuarter: rng.int(0, 3) as 0 | 1 | 2 | 3,
    markerPosition: rng.pick(MARKERS),
    direction: rng.pick(DIRECTIONS),
    shadedInner: rng.int(0, 1) === 1,
    segmentCount,
    segmentAnchor: rng.pick(ANCHORS),
  };
}

function fanLegacyCandidate(
  proposalId: "FAN-PQL-04" | "FAN-PQL-05" | "FAN-PQL-07",
  generationSeed: string,
): Candidate | null {
  const rule: SpatialAnalogyRuleId = proposalId === "FAN-PQL-04"
    ? (hash32(`${generationSeed}:count-rule`) % 2 === 0 ? "ADD_SEGMENT" : "REMOVE_SEGMENT")
    : proposalId === "FAN-PQL-05"
      ? "SUBSTITUTE_INNER_NEXT"
      : "TOGGLE_INNER_SHADING";
  const base = FAN_CORPUS.find((item) => item.ruleId === rule);
  if (!base) throw new Error(`Missing FAN proof authority for ${rule}.`);
  const distractors = base.options
    .filter((option) => option.label !== "CORRECT_RULE_APPLICATION")
    .map((option) => ({ ruleId: option.appliedRuleId, label: option.label })) as any;
  try {
    const question = generateFigureAnalogyProofQuestion({
      seed: generationSeed,
      prototypeId: `QUESTION-STUDIO-${proposalId}-${shortHash(generationSeed)}`,
      ruleId: rule,
      aState: randomFanState(`${generationSeed}:A`, rule),
      cState: randomFanState(`${generationSeed}:C`, rule),
      distractors,
    });
    return {
      generationSeed,
      mode: rule,
      stem: "Choose the figure that completes A : B :: C : ?",
      stimulusScenes: [question.aScene, question.bScene, question.cScene],
      optionScenes: question.options.map((option) => option.scene),
      correctOptionIndex: question.correctOptionIndex,
      explanation: question.learnerExplanation,
    };
  } catch {
    return null;
  }
}

function gapCandidate(
  gapId: Parameters<typeof generateSpatialGapLearnerQuestionV1>[0]["gapId"],
  generationSeed: string,
): Candidate {
  const question = generateSpatialGapLearnerQuestionV1({
    gapId,
    seed: generationSeed,
    desiredCorrectOptionIndex: desiredSlot(generationSeed),
  });
  return {
    generationSeed,
    mode: gapId,
    stem: question.stemText,
    stimulusScenes: [...question.stimulusScenes],
    optionScenes: question.options.map((option) => option.scene),
    correctOptionIndex: question.correctOptionIndex as 0 | 1 | 2 | 3,
    explanation: question.learnerExplanation,
  };
}

function fclGeometricFormCandidate(generationSeed: string): Candidate {
  const modes: SpatialFclGeometricFormModeV1[] = [
    "CLOSED_VS_OPEN",
    "POLYGON_VS_CURVED",
    "EVEN_SIDED_POLYGON",
  ];
  const mode = modes[hash32(`${generationSeed}:form-mode`) % modes.length]!;
  const question = generateSpatialFclGeometricFormQuestionV1({
    seed: generationSeed,
    mode,
    desiredCorrectOptionIndex: desiredSlot(generationSeed),
  });
  return {
    generationSeed,
    mode,
    stem: question.stemText,
    stimulusScenes: [],
    optionScenes: question.options.map((option) => option.scene),
    correctOptionIndex: question.correctOptionIndex,
    explanation: question.learnerExplanation,
  };
}

function primitiveFclCandidate(
  generationSeed: string,
  familyIds: readonly string[],
): Candidate | null {
  const familyId = familyIds[hash32(`${generationSeed}:primitive-family`) % familyIds.length]!;
  const slot = desiredSlot(generationSeed);
  for (let attemptIndex = 0; attemptIndex < 300; attemptIndex += 1) {
    const seed = `${generationSeed}:primitive:${attemptIndex}`;
    const attempt = synthesizeSpatialFclAttemptV1({
      seed,
      familyId: familyId as any,
      desiredCorrectOptionIndex: slot,
      attemptIndex,
    });
    if (attempt.status !== "ACCEPTED") continue;
    const payload = attempt.candidate.payload as any;
    if (!Array.isArray(payload.optionScenes) || payload.optionScenes.length !== 4) continue;
    return {
      generationSeed: seed,
      mode: familyId,
      stem: "Select the figure that is different from the other three.",
      stimulusScenes: [],
      optionScenes: payload.optionScenes as SpatialScene[],
      correctOptionIndex: payload.correctOptionIndex as 0 | 1 | 2 | 3,
      explanation: payload.learnerExplanation as SpatialStudioExplanationV1,
    };
  }
  return null;
}

function compoundSeriesCandidate(generationSeed: string): Candidate | null {
  const familyIds = ["ROTATE_90_CW_MOVE_MARKER_CCW", "ROTATE_90_CCW_MOVE_DOTS_CW"] as const;
  const familyId = familyIds[hash32(`${generationSeed}:compound-series`) % familyIds.length]!;
  const slot = desiredSlot(generationSeed);
  for (let attemptIndex = 0; attemptIndex < 300; attemptIndex += 1) {
    const seed = `${generationSeed}:series:${attemptIndex}`;
    const attempt = synthesizeSpatialFsrAttemptV1({
      seed,
      familyId,
      desiredCorrectOptionIndex: slot,
      attemptIndex,
    });
    if (attempt.status !== "ACCEPTED") continue;
    const payload = attempt.candidate.payload as any;
    if (!Array.isArray(payload.seriesScenes) || !Array.isArray(payload.options)) continue;
    return {
      generationSeed: seed,
      mode: familyId,
      stem: "Study the figure series and choose the next figure.",
      stimulusScenes: payload.seriesScenes as SpatialScene[],
      optionScenes: payload.options.map((option: any) => option.scene) as SpatialScene[],
      correctOptionIndex: payload.correctOptionIndex as 0 | 1 | 2 | 3,
      explanation: payload.learnerExplanation as SpatialStudioExplanationV1,
    };
  }
  return null;
}

function candidateForQl(
  qlId: SpatialPermanentQlIdV1,
  generationSeed: string,
): Candidate | null {
  switch (qlId) {
    case "SPA-QL-001": return directTransformCandidate("MIR-PQL-01", generationSeed);
    case "SPA-QL-002": return glyphCandidate("MIR-PQL-02", generationSeed);
    case "SPA-QL-003": return mirrorClockCandidate(generationSeed);
    case "SPA-QL-004": return directTransformCandidate("WAT-PQL-01", generationSeed);
    case "SPA-QL-005": return glyphCandidate("WAT-PQL-02", generationSeed);
    case "SPA-QL-006": return fanAngleCandidate(generationSeed);
    case "SPA-QL-007": return gapCandidate("FAN-GAP-01", generationSeed);
    case "SPA-QL-008": return gapCandidate("FAN-GAP-02", generationSeed);
    case "SPA-QL-009": return fanLegacyCandidate("FAN-PQL-04", generationSeed);
    case "SPA-QL-010": return fanLegacyCandidate("FAN-PQL-05", generationSeed);
    case "SPA-QL-011": return gapCandidate(
      hash32(`${generationSeed}:nesting-mode`) % 2 === 0 ? "FAN-GAP-03" : "FAN-GAP-04",
      generationSeed,
    );
    case "SPA-QL-012": return fanLegacyCandidate("FAN-PQL-07", generationSeed);
    case "SPA-QL-013": return gapCandidate("FAN-GAP-05", generationSeed);
    case "SPA-QL-014": return gapCandidate("FCL-GAP-01", generationSeed);
    case "SPA-QL-015": return primitiveFclCandidate(generationSeed, [
      "VERTICAL_SYMMETRY",
      "HORIZONTAL_SYMMETRY",
      "HALF_TURN_SYMMETRY",
      "QUARTER_TURN_SYMMETRY",
    ]);
    case "SPA-QL-016": return fclGeometricFormCandidate(generationSeed);
    case "SPA-QL-017": return gapCandidate("FCL-GAP-02", generationSeed);
    case "SPA-QL-018": return gapCandidate("FCL-GAP-03", generationSeed);
    case "SPA-QL-019": return gapCandidate("FCL-GAP-04", generationSeed);
    case "SPA-QL-020": return primitiveFclCandidate(generationSeed, [
      "HAS_BRANCH_JUNCTION",
      "HAS_TRUE_CROSSING",
      "TWO_FREE_TERMINALS",
    ]);
    case "SPA-QL-021": return hash32(`${generationSeed}:partition-mode`) % 3 === 0
      ? primitiveFclCandidate(generationSeed, ["PARTITIONED_FIGURE"])
      : gapCandidate("FCL-GAP-05", generationSeed);
    case "SPA-QL-022": return gapCandidate("FCL-GAP-06", generationSeed);
    case "SPA-QL-023": return gapCandidate("FSR-GAP-01", generationSeed);
    case "SPA-QL-024": return gapCandidate("FSR-GAP-02", generationSeed);
    case "SPA-QL-025": return gapCandidate(
      hash32(`${generationSeed}:position-series-mode`) % 2 === 0 ? "FSR-GAP-03" : "FSR-GAP-07",
      generationSeed,
    );
    case "SPA-QL-026": return gapCandidate("FSR-GAP-04", generationSeed);
    case "SPA-QL-027": return gapCandidate("FSR-GAP-05", generationSeed);
    case "SPA-QL-028": return gapCandidate("FSR-GAP-06", generationSeed);
    case "SPA-QL-029": return gapCandidate("FSR-GAP-08", generationSeed);
    case "SPA-QL-030": return compoundSeriesCandidate(generationSeed);
    default: return null;
  }
}

function allocationForQl(qlId: SpatialPermanentQlIdV1) {
  const allocation = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.find(
    (entry) => entry.permanentQlId === qlId,
  );
  if (!allocation) throw new Error(`Unknown permanent Spatial QL '${qlId}'.`);
  return allocation;
}

export function generateSpatialStudioQuestionV1(input: {
  qlId: SpatialPermanentQlIdV1;
  seed: string;
}): SpatialStudioQuestionV1 {
  const seed = String(input.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio generation requires an explicit deterministic seed.");
  const allocation = allocationForQl(input.qlId);
  let candidate: Candidate | null = null;
  for (let attempt = 0; attempt < 120 && !candidate; attempt += 1) {
    const generationSeed = `${seed}:${input.qlId}:A${attempt}`;
    try {
      const generated = candidateForQl(input.qlId, generationSeed);
      if (generated && candidateIsValid(generated)) candidate = generated;
    } catch {
      candidate = null;
    }
  }
  if (!candidate) {
    throw new Error(`${input.qlId}/${seed}: unable to generate a validated Spatial Question Studio item.`);
  }

  const stimulusSvgs = candidate.stimulusScenes.map(renderSpatialSceneToSvg);
  const optionSvgs = candidate.optionScenes.map(renderSpatialSceneToSvg);
  const signature = JSON.stringify({
    qlId: input.qlId,
    stem: candidate.stem,
    stimulusSvgs,
    optionSvgs,
    correctIndex: candidate.correctOptionIndex,
  });
  const fingerprint = `spa-${shortHash(signature)}`;
  const answer = LETTERS[candidate.correctOptionIndex];

  return {
    version: "SPA-FND-001-QUESTION-STUDIO-QUESTION-V1",
    packageId: "SPA-001",
    qlId: input.qlId,
    proposalId: allocation.proposalId,
    chapterCode: allocation.chapterCode,
    qlName: allocation.name,
    language: "en",
    locale: "en-IN",
    difficultyBand: spatialQuestionStudioDifficultyV1(allocation.baseDifficulty),
    seed,
    generationSeed: candidate.generationSeed,
    mode: candidate.mode,
    stem: candidate.stem,
    stimulusSvgs,
    optionSvgs,
    optionLabels: ["A", "B", "C", "D"],
    correctIndex: candidate.correctOptionIndex,
    answer,
    explanation: candidate.explanation,
    questionId: `${input.qlId}:${fingerprint}`,
    canonicalItemId: `${input.qlId}:${fingerprint}`,
    questionLanguageId: `${input.qlId}:EN:${fingerprint}`,
    contentFingerprint: fingerprint,
    renderer: {
      kind: "SVG",
      recommendedStimulusPixels: 128,
      recommendedOptionPixels: 128,
      mobileMinimumOptionPixels: 104,
    },
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
    validation: {
      valid: true,
      semanticOptionUniqueness: true,
      perceptualOptionUniqueness: true,
      learnerExplanationSafe: true,
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

function eligibleAllocations(request: SpatialStudioBatchRequestV1) {
  let allocations = [...SPATIAL_PERMANENT_QL_ALLOCATIONS_V1];
  if (request.qlId) {
    allocations = allocations.filter((entry) => entry.permanentQlId === request.qlId);
  }
  if (request.chapterCode) {
    allocations = allocations.filter((entry) => entry.chapterCode === request.chapterCode);
  }
  if (request.difficulty) {
    allocations = allocations.filter(
      (entry) => spatialQuestionStudioDifficultyV1(entry.baseDifficulty) === request.difficulty,
    );
  }
  if (!allocations.length) throw new Error("No permanent Spatial QLs match the requested filters.");
  return allocations;
}

export function generateSpatialStudioBatchV1(request: SpatialStudioBatchRequestV1) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const allocations = eligibleAllocations(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);
  const questions: SpatialStudioQuestionV1[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    const allocation = allocations[index % allocations.length]!;
    let accepted: SpatialStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialStudioQuestionV1({
        qlId: allocation.permanentQlId,
        seed: `${seed}:${index}:R${retry}`,
      });
      if (seen.has(question.contentFingerprint)) continue;
      seen.add(question.contentFingerprint);
      accepted = question;
    }
    if (!accepted) {
      throw new Error(`${allocation.permanentQlId}: unable to produce a unique batch item at index ${index}.`);
    }
    questions.push(accepted);
  }

  return {
    generationContext: {
      packageId: "SPA-001" as const,
      generationDomain: "reasoning-v1" as const,
      seed,
      count,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      reviewOnly: true as const,
    },
    questions,
  } as const;
}
