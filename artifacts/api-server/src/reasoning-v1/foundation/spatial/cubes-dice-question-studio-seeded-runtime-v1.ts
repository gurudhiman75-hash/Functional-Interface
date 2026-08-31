import { createHash } from "node:crypto";

import type { CubesDiceCp004TaskKindV1, CubesDicePermanentQlIdV1 } from "./cubes-dice-cp004-distractors-allocation-v1";
import {
  CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  freezeCubesDiceLocalizedQuestionV1,
} from "./cubes-dice-localization-freeze-v1";
import type { CubesDiceLocalizedLanguageV1 } from "./cubes-dice-localization-v1";
import {
  generateCubesDicePermanentEnglishQuestionV1,
  type CubesDicePermanentEnglishQuestionV1,
} from "./cubes-dice-permanent-english-runtime-v1";

export type CubesDiceStudioLanguageV1 = "en" | CubesDiceLocalizedLanguageV1;
export type CubesDiceStudioDifficultyV1 = "Easy" | "Medium" | "Hard";
export type CubesDiceStudioScalarOptionV1 = string | number;

const QL_TO_TASK: Readonly<Record<CubesDicePermanentQlIdV1, CubesDiceCp004TaskKindV1>> = Object.freeze({
  "SPA-QL-043": "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "SPA-QL-044": "CUBE_NET_OPPOSITE_FACE",
  "SPA-QL-045": "PAINTED_CUBE_EXACT_FACE_COUNT",
});
const QL_TO_PROPOSAL = Object.freeze({
  "SPA-QL-043": "CND-CAN-A-DIE-FACE-RELATIONS",
  "SPA-QL-044": "CND-CAN-B-CUBE-NET-FOLDING",
  "SPA-QL-045": "CND-CAN-C-PAINTED-CUBE-EXPOSURE",
} as const);

export interface CubesDiceQuestionStudioQuestionV1 {
  version: "CND-001-QUESTION-STUDIO-QUESTION-V1";
  packageId: "SPA-001";
  qlId: CubesDicePermanentQlIdV1;
  permanentQlId: CubesDicePermanentQlIdV1;
  proposalId: (typeof QL_TO_PROPOSAL)[CubesDicePermanentQlIdV1];
  chapterCode: "CND-001";
  qlName: string;
  language: CubesDiceStudioLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: CubesDiceStudioDifficultyV1;
  seed: string;
  generationSeed: string;
  taskKind: CubesDiceCp004TaskKindV1;
  candidateId: string;
  stemVariantId: string;
  stem: string;
  stimulusSvgs: readonly [string];
  options: readonly [CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1];
  optionLabels: readonly [CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1];
  correctIndex: number;
  answer: CubesDiceStudioScalarOptionV1;
  canonicalAnswer: CubesDiceStudioScalarOptionV1;
  explanation: Readonly<{
    whatIsGiven: string;
    howToReason: string;
    conclusion: string;
    observation: string;
    rule: string;
    application: string;
    check: string;
  }>;
  canonicalItemId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  renderer: Readonly<{
    kind: "SVG_WITH_SCALAR_OPTIONS" | "SVG_WITH_NUMERIC_OPTIONS";
    sourceKind: "SVG";
    sourceAuthority: string;
    whiteBackground: true;
    canonicalCamera: true;
    randomWholeFigureTiltAllowed: false;
    recommendedStimulusPixels: 280;
    mobileMinimumStimulusPixels: 220;
  }>;
  localization: Readonly<{
    authority: typeof CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId;
    canonicalLanguage: "en";
    targetLanguage: CubesDiceStudioLanguageV1;
    semanticParity: "SCENE_SOLVER_SVG_RENDERER_OPTIONS_ANSWER_DISTRACTORS_EXACT";
  }>;
  validation: Readonly<{
    valid: true;
    exactSolverBacked: true;
    uniqueOptions: true;
    uniqueAnswer: true;
    deterministicReplay: true;
    nativeScalarOptionsPreserved: true;
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

export const CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-QUESTION-STUDIO-SEEDED-RUNTIME-V1" as const,
  localizationFreezeAuthorityId: CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlIds: ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"] as const,
  chapterCode: "CND-001" as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  generationModel: "EXACT_CUBE_ROTATION_NET_FOLD_AND_COORDINATE_EXPOSURE_SOLVER" as const,
  rendererModel: "ONE_EXAM_SVG_STIMULUS_WITH_FOUR_NATIVE_SCALAR_OPTIONS" as const,
  canonicalReviewCorpusIsGenerationCeiling: false,
  status: "SEEDED_RUNTIME_IMPLEMENTED_OPERATOR_REVIEW_REQUIRED" as const,
  questionStudioDiscoverable: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticPublication: false,
  nextGate: "CND_001_QUESTION_STUDIO_OPERATOR_REVIEW_V1" as const,
} as const);

if (!CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.seededQuestionStudioIntegrationAuthorized) {
  throw new Error("CND-001 seeded Question Studio runtime is not authorized by localization freeze governance.");
}

function difficultyBand(source: CubesDicePermanentEnglishQuestionV1): CubesDiceStudioDifficultyV1 {
  if (source.difficulty === "EASY") return "Easy";
  if (source.difficulty === "HARD") return "Hard";
  return "Medium";
}

function fingerprint(source: CubesDicePermanentEnglishQuestionV1): string {
  return createHash("sha256")
    .update(JSON.stringify({
      permanentQlId: source.permanentQlId,
      taskKind: source.taskKind,
      candidateId: source.candidateId,
      stemVariantId: source.stemVariantId,
      scene: source.scene,
      solverEvidence: source.solverEvidence,
      stimulusSvgs: source.stimulusSvgs,
      options: source.options,
      correctIndex: source.correctIndex,
      answer: source.answer,
      distractorEvidence: source.distractorEvidence,
    }))
    .digest("hex");
}

function localizedSurface(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceStudioLanguageV1) {
  const sourceSurface = language === "en"
    ? {
        qlName: source.permanentQlTitle,
        locale: "en-IN" as const,
        stem: source.stem,
        explanation: source.explanation,
      }
    : (() => {
        const localized = freezeCubesDiceLocalizedQuestionV1({
          seed: source.seed,
          taskKind: source.taskKind,
          language,
        });
        return {
          qlName: localized.permanentQlTitle,
          locale: localized.locale,
          stem: localized.stem,
          explanation: localized.explanation,
        };
      })();

  return {
    qlName: sourceSurface.qlName,
    locale: sourceSurface.locale,
    stem: sourceSurface.stem,
    explanation: Object.freeze({
      ...sourceSurface.explanation,
      observation: sourceSurface.explanation.whatIsGiven,
      rule: sourceSurface.explanation.howToReason,
      application: sourceSurface.explanation.howToReason,
      check: sourceSurface.explanation.conclusion,
    }),
  };
}

function isNumericQuestion(source: CubesDicePermanentEnglishQuestionV1): boolean {
  return source.options.every((option) => typeof option === "number" && Number.isFinite(option));
}

export function generateCubesDiceQuestionStudioSeededV1(input: Readonly<{
  seed: string;
  qlId: CubesDicePermanentQlIdV1;
  language: CubesDiceStudioLanguageV1;
}>): CubesDiceQuestionStudioQuestionV1 {
  const taskKind = QL_TO_TASK[input.qlId];
  const source = generateCubesDicePermanentEnglishQuestionV1({ seed: input.seed, taskKind });
  if (source.permanentQlId !== input.qlId || source.chapterCode !== "CND-001") {
    throw new Error(`${input.seed}: CND Question Studio source trace mismatch.`);
  }
  if (source.options.length !== 4 || new Set(source.options.map(String)).size !== 4) {
    throw new Error(`${input.seed}: CND Question Studio requires four unique scalar options.`);
  }
  if (source.options[source.correctIndex] !== source.answer) {
    throw new Error(`${input.seed}: CND Question Studio correctIndex does not match solver answer.`);
  }
  if (source.options.filter((value) => value === source.answer).length !== 1) {
    throw new Error(`${input.seed}: CND Question Studio solver answer must occur exactly once.`);
  }
  if (source.stimulusSvgs.length !== 1 || !source.stimulusSvgs[0]?.startsWith("<svg")) {
    throw new Error(`${input.seed}: CND Question Studio requires one rendered SVG stimulus.`);
  }

  const numeric = isNumericQuestion(source);
  if (!numeric && !source.options.every((option) => typeof option === "string" && option.trim().length > 0)) {
    throw new Error(`${input.seed}: CND scalar choices must be uniformly textual or numeric.`);
  }

  const surface = localizedSurface(source, input.language);
  const contentFingerprint = fingerprint(source);
  const canonicalItemId = `cnd-001:${input.qlId}:${contentFingerprint}`;
  const questionLanguageId = `${canonicalItemId}:${input.language}`;
  const sourceRenderer = source.renderer;
  const options = Object.freeze([...source.options]) as readonly [CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1, CubesDiceStudioScalarOptionV1];

  return Object.freeze({
    version: "CND-001-QUESTION-STUDIO-QUESTION-V1",
    packageId: "SPA-001",
    qlId: input.qlId,
    permanentQlId: input.qlId,
    proposalId: QL_TO_PROPOSAL[input.qlId],
    chapterCode: "CND-001",
    qlName: surface.qlName,
    language: input.language,
    locale: surface.locale,
    difficultyBand: difficultyBand(source),
    seed: input.seed,
    generationSeed: input.seed,
    taskKind: source.taskKind,
    candidateId: source.candidateId,
    stemVariantId: source.stemVariantId,
    stem: surface.stem,
    stimulusSvgs: Object.freeze([...source.stimulusSvgs]) as readonly [string],
    options,
    optionLabels: options,
    correctIndex: source.correctIndex,
    answer: source.answer,
    canonicalAnswer: source.answer,
    explanation: surface.explanation,
    canonicalItemId,
    questionLanguageId,
    contentFingerprint,
    renderer: Object.freeze({
      kind: numeric ? "SVG_WITH_NUMERIC_OPTIONS" as const : "SVG_WITH_SCALAR_OPTIONS" as const,
      sourceKind: sourceRenderer.kind,
      sourceAuthority: sourceRenderer.authority,
      whiteBackground: sourceRenderer.whiteBackground,
      canonicalCamera: sourceRenderer.canonicalCamera,
      randomWholeFigureTiltAllowed: sourceRenderer.randomWholeFigureTiltAllowed,
      recommendedStimulusPixels: 280,
      mobileMinimumStimulusPixels: 220,
    }),
    localization: Object.freeze({
      authority: CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en",
      targetLanguage: input.language,
      semanticParity: "SCENE_SOLVER_SVG_RENDERER_OPTIONS_ANSWER_DISTRACTORS_EXACT",
    }),
    validation: Object.freeze({
      valid: true,
      exactSolverBacked: true,
      uniqueOptions: true,
      uniqueAnswer: true,
      deterministicReplay: true,
      nativeScalarOptionsPreserved: true,
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

export function generateCubesDiceQuestionStudioBatchV1(input: Readonly<{
  seed: string;
  language: CubesDiceStudioLanguageV1;
  count: number;
  qlId?: CubesDicePermanentQlIdV1;
}>): readonly CubesDiceQuestionStudioQuestionV1[] {
  if (!input.seed.trim()) throw new Error("CND-001 Question Studio batch requires an explicit seed.");
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) {
    throw new Error("CND-001 Question Studio batch count must be an integer from 1 to 50.");
  }
  const qlIds = input.qlId ? [input.qlId] : CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.permanentQlIds;
  const questions: CubesDiceQuestionStudioQuestionV1[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    const qlId = qlIds[index % qlIds.length]!;
    let accepted: CubesDiceQuestionStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const candidate = generateCubesDiceQuestionStudioSeededV1({
        seed: `${input.seed}:${index}:R${retry}`,
        qlId,
        language: input.language,
      });
      if (seen.has(candidate.contentFingerprint)) continue;
      accepted = candidate;
    }
    if (!accepted) throw new Error(`${qlId}: unable to produce a unique CND Question Studio item at batch index ${index}.`);
    seen.add(accepted.contentFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
