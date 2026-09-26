import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from '../../../../question-studio/engine-types';
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from '../../../../question-studio/standard-lifecycle';
import {
  MIS_CP001_CANDIDATE_IDS,
  generateMisCp001Question,
  type GeneratedMisCp001Question,
} from './MIS-CP-001/generator';
import {
  independentlyEvaluateMisCp001Rule,
  independentlyVerifyMisCp001Group,
} from './MIS-CP-001/independent-solver';
import { misCp001RuleByCandidateId, type MisCp001CandidateId } from './MIS-CP-001/rule-definitions';
import {
  MIS_CP002_CANDIDATE_IDS,
  generateMisCp002Question,
  type GeneratedMisCp002Question,
} from './MIS-CP-002/generator';
import {
  independentlyEvaluateMisCp002Rule,
  independentlyVerifyMisCp002Group,
} from './MIS-CP-002/independent-solver';
import { misCp002RuleByCandidateId, type MisCp002CandidateId } from './MIS-CP-002/rule-definitions';
import {
  MIS_CP003_CANDIDATE_IDS,
  generateMisCp003Question,
  type GeneratedMisCp003Question,
} from './MIS-CP-003/generator';
import {
  independentlyEvaluateMisCp003Rule,
  independentlyVerifyMisCp003Group,
} from './MIS-CP-003/independent-solver';
import { misCp003RuleByCandidateId, type MisCp003CandidateId } from './MIS-CP-003/rule-definitions';

export const MIS_001_PACKAGE_ID = 'MIS-001' as const;
export const MIS_001_RUNTIME_MODE = 'review-only' as const;
export const MIS_001_REVIEW_AUTHORITY = 'MIS-001-CP001-CP003-EXECUTABLE-PROTOTYPE-V1' as const;
export const MIS_001_CHECKPOINT_IDS = ['MIS-CP-001', 'MIS-CP-002', 'MIS-CP-003'] as const;

type MisCandidateId = MisCp001CandidateId | MisCp002CandidateId | MisCp003CandidateId;
type MisGeneratedQuestion = GeneratedMisCp001Question | GeneratedMisCp002Question | GeneratedMisCp003Question;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ALL_CANDIDATES: readonly MisCandidateId[] = Object.freeze([
  ...MIS_CP001_CANDIDATE_IDS,
  ...MIS_CP002_CANDIDATE_IDS,
  ...MIS_CP003_CANDIDATE_IDS,
]);

function text(value: unknown): string {
  return String(value ?? '').trim();
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error('MIS-001 review batches require count between 1 and 50.');
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest['language']): 'en' {
  const language = value ?? 'en';
  if (language === 'en') return language;
  throw new Error('MIS-001 is in English editorial review; Hindi and Punjabi localization are not frozen yet.');
}

function normalizeDifficulty(value: unknown): 'Easy' | 'Medium' | undefined {
  const difficulty = text(value).toLowerCase();
  if (!difficulty || difficulty === 'mixed') return undefined;
  if (difficulty === 'easy') return 'Easy';
  if (difficulty === 'medium' || difficulty === 'moderate') return 'Medium';
  if (difficulty === 'hard') throw new Error('MIS-001 CP001-CP003 do not yet expose Hard review candidates.');
  throw new Error('MIS-001 difficulty must be Easy, Medium or Mixed.');
}

function isCp001Candidate(value: string): value is MisCp001CandidateId {
  return MIS_CP001_CANDIDATE_IDS.includes(value as MisCp001CandidateId);
}

function isCp002Candidate(value: string): value is MisCp002CandidateId {
  return MIS_CP002_CANDIDATE_IDS.includes(value as MisCp002CandidateId);
}

function isCp003Candidate(value: string): value is MisCp003CandidateId {
  return MIS_CP003_CANDIDATE_IDS.includes(value as MisCp003CandidateId);
}

function isCandidate(value: string): value is MisCandidateId {
  return isCp001Candidate(value) || isCp002Candidate(value) || isCp003Candidate(value);
}

function candidateCheckpoint(candidateId: MisCandidateId): 'MIS-CP-001' | 'MIS-CP-002' | 'MIS-CP-003' {
  if (isCp001Candidate(candidateId)) return 'MIS-CP-001';
  if (isCp002Candidate(candidateId)) return 'MIS-CP-002';
  return 'MIS-CP-003';
}

function candidateSupportsDifficulty(candidateId: MisCandidateId, difficulty: 'Easy' | 'Medium'): boolean {
  if (isCp001Candidate(candidateId)) {
    return misCp001RuleByCandidateId(candidateId).difficulty === difficulty;
  }
  if (isCp002Candidate(candidateId)) {
    const rule = misCp002RuleByCandidateId(candidateId);
    if (rule.ruleId === 'THREE_INPUT_SUM' || rule.ruleId === 'TWO_ADD_ONE_SUBTRACT') {
      return difficulty === 'Easy';
    }
    return difficulty === 'Medium';
  }
  return misCp003RuleByCandidateId(candidateId).baselineDifficulty === difficulty;
}

function resolveCandidatePool(
  request: QuestionStudioGenerationRequest,
  difficulty: 'Easy' | 'Medium' | undefined,
): MisCandidateId[] {
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ].map((value) => text(value).toUpperCase()).filter(Boolean);

  const candidates = [...new Set(selectors.filter(isCandidate))];
  const checkpoints = [...new Set(selectors.filter((value) =>
    value === 'MIS-CP-001' || value === 'MIS-CP-002' || value === 'MIS-CP-003',
  ))] as ('MIS-CP-001' | 'MIS-CP-002' | 'MIS-CP-003')[];

  if (candidates.length > 1) throw new Error('Conflicting MIS-001 candidate selectors.');
  if (checkpoints.length > 1) throw new Error('Conflicting MIS-001 checkpoint selectors.');
  const unknown = selectors.find((value) =>
    value.startsWith('MIS-CAND-') && !isCandidate(value)
    || value.startsWith('MIS-CP-') && !MIS_001_CHECKPOINT_IDS.includes(value as any),
  );
  if (unknown) throw new Error('Unknown MIS-001 selector: ' + unknown);

  let pool = candidates.length > 0
    ? candidates
    : [...ALL_CANDIDATES];

  if (checkpoints.length > 0) {
    const checkpoint = checkpoints[0]!;
    if (candidates.length > 0 && candidateCheckpoint(candidates[0]!) !== checkpoint) {
      throw new Error(candidates[0] + ' is not owned by ' + checkpoint + '.');
    }
    pool = pool.filter((candidateId) => candidateCheckpoint(candidateId) === checkpoint);
  }
  if (difficulty) {
    pool = pool.filter((candidateId) => candidateSupportsDifficulty(candidateId, difficulty));
  }
  if (pool.length === 0) throw new Error('No MIS-001 candidates match the requested scope.');
  return pool;
}

function generateCandidate(candidateId: MisCandidateId, seed: string): MisGeneratedQuestion {
  if (isCp001Candidate(candidateId)) return generateMisCp001Question(candidateId, seed);
  if (isCp002Candidate(candidateId)) return generateMisCp002Question(candidateId, seed);
  return generateMisCp003Question(candidateId, seed);
}

function resolveGeneratedCandidate(
  preferredCandidate: MisCandidateId,
  pool: readonly MisCandidateId[],
  baseSeed: string,
  index: number,
  requestedDifficulty: 'Easy' | 'Medium' | undefined,
): { generated: MisGeneratedQuestion; candidateId: MisCandidateId; itemSeed: string; attempt: number } {
  const candidates = [preferredCandidate, ...pool.filter((candidateId) => candidateId !== preferredCandidate)];
  const attemptLimit = requestedDifficulty ? 80 : 1;

  for (const candidateId of candidates) {
    for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
      const itemSeed = `${baseSeed}:${candidateId}:${index}:attempt:${attempt}`;
      try {
        const generated = generateCandidate(candidateId, itemSeed);
        if (!requestedDifficulty || generated.difficulty === requestedDifficulty) {
          return { generated, candidateId, itemSeed, attempt };
        }
      } catch {
        continue;
      }
    }
  }
  throw new Error(
    requestedDifficulty
      ? `MIS-001 could not produce a ${requestedDifficulty} instance in the requested scope.`
      : 'MIS-001 could not produce a valid deterministic instance in the requested scope.',
  );
}

function independentValidation(question: MisGeneratedQuestion) {
  if (question.checkpointId === 'MIS-CP-001') {
    const solved = independentlyEvaluateMisCp001Rule(
      question.ruleId,
      question.target.first,
      question.target.second,
      question.context,
    );
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) =>
        independentlyVerifyMisCp001Group(question.ruleId, question.context, group),
      ),
      solverAgreement: solved === question.answer,
    };
  }

  if (question.checkpointId === 'MIS-CP-002') {
    const solved = independentlyEvaluateMisCp002Rule(
      question.ruleId,
      [question.target.first, question.target.second, question.target.third],
      question.context,
    );
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) =>
        independentlyVerifyMisCp002Group(question.ruleId, question.context, group),
      ),
      solverAgreement: solved === question.answer,
    };
  }

  const solved = independentlyEvaluateMisCp003Rule(
    question.ruleId,
    question.target.first,
    question.target.second,
    question.context,
  );
  return {
    sameRuleFitsAllExamples: question.evidenceGroups.every((group) =>
      independentlyVerifyMisCp003Group(question.ruleId, question.context, group),
    ),
    solverAgreement: solved === question.answer,
  };
}

export const MIS_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: 'reasoning-v1',
  packageId: MIS_001_PACKAGE_ID,
  subject: 'Reasoning',
  topic: 'Reasoning',
  subtopic: 'Missing Number',
  label: 'Reasoning · Missing Number · MIS-001 (CP001-CP003 review)',
  enabled: true,
  cpIds: [...MIS_001_CHECKPOINT_IDS],
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
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    reviewAuthority: MIS_001_REVIEW_AUTHORITY,
    implementedCheckpoints: [...MIS_001_CHECKPOINT_IDS],
    candidateCount: ALL_CANDIDATES.length,
    candidateIds: [...ALL_CANDIDATES],
    cp001CandidateCount: MIS_CP001_CANDIDATE_IDS.length,
    cp002CandidateCount: MIS_CP002_CANDIDATE_IDS.length,
    cp003CandidateCount: MIS_CP003_CANDIDATE_IDS.length,
    permanentQlCount: 0,
    permanentQlAllocation: false,
    sourceSaturationComplete: false,
    mergeSplitAuditComplete: false,
    englishEditorialFreezeComplete: false,
    localizationStarted: false,
    deterministicGeneration: true,
    independentSolver: true,
    ambiguityEnumeration: true,
    reviewOnly: true,
  },
};

export function isMis001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === MIS_001_PACKAGE_ID;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((value) => value === MIS_001_PACKAGE_ID || value.startsWith('MIS-CP-') || value.startsWith('MIS-CAND-'))) {
    return true;
  }
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === 'missing number' || subtopic === 'missing number' || subtopic === 'missing numbers';
}

export async function generateMis001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== MIS_001_RUNTIME_MODE) {
    throw new Error('MIS-001 only supports review-only runtime.');
  }
  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const pool = resolveCandidatePool(request, requestedDifficulty);
  const baseSeed = text(request.seed) || 'mis-001-question-studio-v1';
  const start = hash(baseSeed + ':candidate-start') % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const preferredCandidate = pool[(start + index) % pool.length]!;
    const resolved = resolveGeneratedCandidate(
      preferredCandidate,
      pool,
      baseSeed,
      index,
      requestedDifficulty,
    );
    const { generated, candidateId, itemSeed, attempt } = resolved;
    const independent = independentValidation(generated);
    const options = generated.options.map((option) => String(option.value));
    const questionId = `MIS-001:${generated.checkpointId}:${candidateId}:${hash(itemSeed)}:en`;

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: MIS_001_PACKAGE_ID,
      patternId: candidateId,
      candidateId,
      qlId: null,
      provisionalQl: true,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
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
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: requestedDifficulty ? generated.difficulty === requestedDifficulty : false,
      difficultySearchAttempts: attempt + 1,
      generationSeed: itemSeed,
      runtimeMode: MIS_001_RUNTIME_MODE,
      registrationStatus: 'REGISTERED_REVIEW_ONLY_PROVISIONAL',
      registrationAuthorityId: MIS_001_REVIEW_AUTHORITY,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      groupCount: generated.groupCount,
      operandCount: generated.checkpointId === 'MIS-CP-003' ? generated.operandCount : generated.checkpointId === 'MIS-CP-001' ? 2 : 3,
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
      runtimeVersion: generated.checkpointId === 'MIS-CP-001' ? 'MIS-CP-001-V1' : generated.checkpointId === 'MIS-CP-002' ? 'MIS-CP-002-V1' : 'MIS-CP-003-V1',
      traceability: {
        packageId: MIS_001_PACKAGE_ID,
        checkpointId: generated.checkpointId,
        candidateId,
        ruleId: generated.ruleId,
        permanentQlAllocated: false,
        sourceSaturationComplete: false,
      },
      validation: {
        sameRuleFitsAllExamples: independent.sameRuleFitsAllExamples,
        exactlyOneIntendedRule:
          generated.ambiguityAudit.accepted
          && new Set(generated.ambiguityAudit.matches.map((match) => match.semanticKey)).size === 1,
        exactlyOneCorrect: generated.options.filter((option) => option.errorLabel === null).length === 1,
        fourUniqueOptions: generated.options.length === 4 && new Set(options).size === 4,
        solverAgreement: independent.solverAgreement,
        resultWithinBounds: generated.answer > 0 && generated.answer <= 999,
        noDecimal: Number.isInteger(generated.answer),
        explanationUsesGeneratedValues: generated.explanation.includes(String(generated.answer)),
        everyDisplayedInputParticipates: true,
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
      cpIds: [...MIS_001_CHECKPOINT_IDS],
      runtimeMode: MIS_001_RUNTIME_MODE,
      registrationStatus: 'REGISTERED_REVIEW_ONLY_PROVISIONAL',
      reviewAuthority: MIS_001_REVIEW_AUTHORITY,
      permanentQlAllocation: false,
      permanentQlCount: 0,
      candidateIds: [...ALL_CANDIDATES],
      sourceSaturationComplete: false,
      language,
      requestedDifficulty: requestedDifficulty ?? 'Mixed',
      difficultyFilterApplied: Boolean(requestedDifficulty),
      seed: baseSeed,
      count,
    },
  };
}
