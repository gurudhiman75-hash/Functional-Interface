import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from '../../../../../question-studio/engine-types';
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from '../../../../../question-studio/standard-lifecycle';
import {
  MIS_CP001_CANDIDATE_IDS,
  generateMisCp001Question,
} from './generator';
import {
  independentlyEvaluateMisCp001Rule,
  independentlyVerifyMisCp001Group,
} from './independent-solver';
import {
  misCp001RuleByCandidateId,
  type MisCp001CandidateId,
} from './rule-definitions';

export const MIS_001_PACKAGE_ID = 'MIS-001' as const;
export const MIS_CP001_CHECKPOINT_ID = 'MIS-CP-001' as const;
export const MIS_001_RUNTIME_MODE = 'review-only' as const;
export const MIS_CP001_REVIEW_AUTHORITY = 'MIS-CP-001-EXECUTABLE-PROTOTYPE-V1' as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error('MIS-001 CP001 review batches require count between 1 and 50.');
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest['language']): 'en' {
  const language = value ?? 'en';
  if (language === 'en') return language;
  throw new Error('MIS-001 CP001 is in English editorial review; Hindi and Punjabi localization are not frozen yet.');
}

function normalizeDifficulty(value: unknown): 'Easy' | 'Medium' | undefined {
  const difficulty = String(value ?? '').trim().toLowerCase();
  if (!difficulty || difficulty === 'mixed') return undefined;
  if (difficulty === 'easy') return 'Easy';
  if (difficulty === 'medium' || difficulty === 'moderate') return 'Medium';
  if (difficulty === 'hard') {
    throw new Error('MIS-CP-001 owns Easy and Medium structures only; Hard begins in later checkpoints.');
  }
  throw new Error('MIS-001 CP001 difficulty must be Easy, Medium or Mixed.');
}

function isCandidateId(value: string): value is MisCp001CandidateId {
  return MIS_CP001_CANDIDATE_IDS.includes(value as MisCp001CandidateId);
}

function resolvePool(request: QuestionStudioGenerationRequest, difficulty?: 'Easy' | 'Medium'): MisCp001CandidateId[] {
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ].map((value) => String(value ?? '').trim().toUpperCase()).filter(Boolean);

  const requestedCandidates = [...new Set(selectors.filter(isCandidateId))];
  if (requestedCandidates.length > 1) throw new Error('Conflicting MIS-CP-001 candidate selectors.');
  const unknown = selectors.find((value) => value.startsWith('MIS-CAND-') && !isCandidateId(value));
  if (unknown) throw new Error('Unknown MIS-CP-001 candidate: ' + unknown);

  const base = requestedCandidates.length > 0
    ? requestedCandidates
    : [...MIS_CP001_CANDIDATE_IDS];
  const filtered = difficulty
    ? base.filter((candidateId) => misCp001RuleByCandidateId(candidateId).difficulty === difficulty)
    : base;
  if (filtered.length === 0) throw new Error('No MIS-CP-001 candidates match the requested difficulty.');
  return filtered;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export const MIS_CP001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: 'reasoning-v1',
  packageId: MIS_001_PACKAGE_ID,
  subject: 'Reasoning',
  topic: 'Reasoning',
  subtopic: 'Missing Number',
  label: 'Reasoning · Missing Number · MIS-001 (CP001 review)',
  enabled: true,
  cpIds: [MIS_CP001_CHECKPOINT_ID],
  supportedLanguages: ['en'],
  supportedDifficulties: ['Easy', 'Medium'],
  difficultyFilterSupported: true,
  runtimeMode: MIS_001_RUNTIME_MODE,
  supportedRuntimeModes: [MIS_001_RUNTIME_MODE],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    reviewAuthority: MIS_CP001_REVIEW_AUTHORITY,
    implementationCheckpoint: MIS_CP001_CHECKPOINT_ID,
    candidateCount: MIS_CP001_CANDIDATE_IDS.length,
    candidateIds: [...MIS_CP001_CANDIDATE_IDS],
    permanentQlCount: 0,
    permanentQlAllocation: false,
    sourceSaturationComplete: false,
    mergeSplitAuditComplete: false,
    englishEditorialFreezeComplete: false,
    localizationStarted: false,
    deterministicGeneration: true,
    independentSolver: true,
    ambiguityEnumeration: true,
    resultMissingOnly: true,
    reviewOnly: true,
  },
};

export function isMis001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? '').trim().toUpperCase();
  if (packageId) return packageId === MIS_001_PACKAGE_ID;
  const pattern = String(request.patternId ?? '').trim().toUpperCase();
  if (pattern === MIS_001_PACKAGE_ID || pattern === MIS_CP001_CHECKPOINT_ID || pattern.startsWith('MIS-CAND-')) return true;
  const topic = String(request.topic ?? '').trim().toLowerCase();
  const subtopic = String(request.subtopic ?? '').trim().toLowerCase();
  return topic === 'missing number' || subtopic === 'missing number' || subtopic === 'missing numbers';
}

export async function generateMis001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== MIS_001_RUNTIME_MODE) {
    throw new Error('MIS-001 CP001 only supports review-only runtime.');
  }
  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const difficulty = normalizeDifficulty(request.difficulty);
  const pool = resolvePool(request, difficulty);
  const baseSeed = String(request.seed ?? '').trim() || 'mis-cp001-question-studio-v1';
  const start = hash(baseSeed + ':candidate-start') % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const candidateId = pool[(start + index) % pool.length]!;
    const itemSeed = `${baseSeed}:${candidateId}:${index}`;
    const generated = generateMisCp001Question(candidateId, itemSeed);
    const solverAnswer = independentlyEvaluateMisCp001Rule(
      generated.ruleId,
      generated.target.first,
      generated.target.second,
      generated.context,
    );
    const options = generated.options.map((option) => String(option.value));
    const questionId = `MIS-001:${candidateId}:${hash(itemSeed)}:en`;

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: MIS_001_PACKAGE_ID,
      patternId: candidateId,
      candidateId,
      qlId: null,
      provisionalQl: true,
      cpId: MIS_CP001_CHECKPOINT_ID,
      checkpointId: MIS_CP001_CHECKPOINT_ID,
      subject: 'Reasoning',
      topic: 'Reasoning',
      subtopic: 'Missing Number',
      language,
      locale: 'en-IN',
      stem: generated.stem,
      text: generated.stem,
      options,
      correctIndex: generated.correctIndex,
      correct: generated.correctIndex,
      answer: String(generated.answer),
      canonicalAnswer: generated.answer,
      explanation: generated.explanation,
      packageExplanation: {
        solverTrace: generated.solverTrace,
        ruleFamily: generated.ruleFamily,
      },
      renderer: generated.renderer,
      difficulty: generated.difficulty,
      difficultyLabel: generated.difficulty,
      generationSeed: itemSeed,
      runtimeMode: MIS_001_RUNTIME_MODE,
      registrationStatus: 'REGISTERED_REVIEW_ONLY_PROVISIONAL',
      registrationAuthorityId: MIS_CP001_REVIEW_AUTHORITY,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      groupCount: generated.groupCount,
      operandCount: 2,
      missingPosition: generated.missingPosition,
      forwardOrInverse: 'FORWARD',
      operationDepth: generated.operationDepth,
      structuralFingerprint: generated.structuralFingerprint,
      numericFingerprint: generated.numericFingerprint,
      optionErrorLabels: generated.options.map((option) => option.errorLabel),
      solverTrace: generated.solverTrace,
      ambiguityAudit: generated.ambiguityAudit,
      localizationParity: 'NOT_STARTED_ENGLISH_REVIEW_FIRST',
      editorialStatus: 'EXECUTABLE_PROTOTYPE',
      runtimeVersion: 'MIS-CP-001-V1',
      traceability: {
        packageId: MIS_001_PACKAGE_ID,
        checkpointId: MIS_CP001_CHECKPOINT_ID,
        candidateId,
        ruleId: generated.ruleId,
        permanentQlAllocated: false,
        sourceSaturationComplete: false,
      },
      validation: {
        sameRuleFitsAllExamples: generated.evidenceGroups.every((group) =>
          independentlyVerifyMisCp001Group(generated.ruleId, generated.context, group),
        ),
        exactlyOneIntendedRule:
          generated.ambiguityAudit.accepted
          && new Set(generated.ambiguityAudit.matches.map((match) => match.semanticKey)).size === 1,
        exactlyOneCorrect: generated.options.filter((option) => option.errorLabel === null).length === 1,
        fourUniqueOptions: generated.options.length === 4 && new Set(options).size === 4,
        solverAgreement: solverAnswer === generated.answer,
        resultWithinBounds: generated.answer > 0 && generated.answer <= 999,
        noDecimal: Number.isInteger(generated.answer),
        explanationUsesGeneratedValues: generated.explanation.includes(String(generated.answer)),
      },
      hiddenCompleteStructure: {
        evidenceGroups: generated.evidenceGroups,
        target: generated.target,
        context: generated.context,
        ruleId: generated.ruleId,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: 'reasoning-v1',
      packageId: MIS_001_PACKAGE_ID,
      checkpointId: MIS_CP001_CHECKPOINT_ID,
      runtimeMode: MIS_001_RUNTIME_MODE,
      registrationStatus: 'REGISTERED_REVIEW_ONLY_PROVISIONAL',
      reviewAuthority: MIS_CP001_REVIEW_AUTHORITY,
      permanentQlAllocation: false,
      permanentQlCount: 0,
      candidateIds: [...MIS_CP001_CANDIDATE_IDS],
      sourceSaturationComplete: false,
      language,
      requestedDifficulty: difficulty ?? 'Mixed',
      seed: baseSeed,
      count,
    },
  };
}
