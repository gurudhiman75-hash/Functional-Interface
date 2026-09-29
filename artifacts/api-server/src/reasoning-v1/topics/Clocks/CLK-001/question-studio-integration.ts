import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from '../../../../question-studio/engine-types';
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from '../../../../question-studio/standard-lifecycle';
import { generateClockQuestion } from './runtime/generator';
import {
  CLK_001_PERMANENT_CONTRACTS,
  CLK_001_PERMANENT_QL_IDS,
  CLK_001_PERMANENT_FREEZE_VERSION,
  getClockPermanentContract,
  isClockPermanentQlId,
  type ClockPermanentQlId,
} from './permanent-contracts';
import { CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1 } from './final-freeze-authority';
import { localizeClockAnchorQuestion, type ClockAuthoringLanguage } from './localization';
import {
  CLK_001_AUTHORING_VARIANT_AUTHORITY_V1,
  clk001AuthoringTasksForQlV1,
  selectClk001AuthoringTaskV1,
} from './authoring-variants-v1';

export const CLK_001_PACKAGE_ID = 'CLK-001' as const;
export const CLK_001_RUNTIME_MODE = 'review-only' as const;
const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error('CLK-001 review batches require count between 1 and 50.');
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest['language']): ClockAuthoringLanguage {
  const language = value ?? 'en';
  if (language === 'en' || language === 'hi' || language === 'pa') return language;
  throw new Error('CLK-001 supports English, Hindi and Punjabi.');
}

function publicDifficulty(value: 'FOUNDATION' | 'STANDARD' | 'ADVANCED') {
  return value === 'FOUNDATION' ? 'Easy' : value === 'STANDARD' ? 'Medium' : 'Hard';
}

function normalizeDifficulty(value: unknown): 'Easy' | 'Medium' | 'Hard' | undefined {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text || text === 'mixed') return undefined;
  if (text === 'easy') return 'Easy';
  if (text === 'medium' || text === 'moderate') return 'Medium';
  if (text === 'hard') return 'Hard';
  throw new Error('CLK-001 difficulty must be Easy, Medium, Hard or Mixed.');
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function resolveQlId(request: QuestionStudioGenerationRequest): ClockPermanentQlId | undefined {
  const selectors = [
    request.canonicalProblemId,
    request.questionLanguageId,
    request.patternId,
  ].map((value) => String(value ?? '').trim().toUpperCase()).filter(Boolean);
  const qls = selectors.filter(isClockPermanentQlId);
  if (qls.length > 1 && new Set(qls).size > 1) {
    throw new Error('Conflicting CLK-001 permanent QL selectors.');
  }
  const unknown = selectors.find((value) => value.startsWith('CLK-QL-') && !isClockPermanentQlId(value));
  if (unknown) throw new Error('Unknown CLK-001 permanent QL: ' + unknown);
  return qls[0] as ClockPermanentQlId | undefined;
}

function shuffledQls(seed: string): ClockPermanentQlId[] {
  const values = CLK_001_PERMANENT_CONTRACTS
    .map((entry) => entry.qlId);
  if (values.length === 0) throw new Error('CLK-001 has no permanent QLs.');
  let state = hash(seed) || 1;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [values[index], values[swap]] = [values[swap]!, values[index]!];
  }
  return values;
}

export const CLK_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: 'reasoning-v1',
  packageId: CLK_001_PACKAGE_ID,
  subject: 'Reasoning',
  topic: 'Reasoning',
  subtopic: 'Clock',
  label: 'Reasoning · Clock · CLK-001',
  enabled: true,
  cpIds: [...CLK_001_PERMANENT_QL_IDS],
  supportedLanguages: ['en', 'hi', 'pa'],
  supportedDifficulties: ['Easy', 'Medium', 'Hard'],
  difficultyFilterSupported: true,
  runtimeMode: CLK_001_RUNTIME_MODE,
  supportedRuntimeModes: [CLK_001_RUNTIME_MODE],
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
    completionAuthorityId: CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1.authorityId,
    freezeVersion: CLK_001_PERMANENT_FREEZE_VERSION,
    permanentQlCount: CLK_001_PERMANENT_QL_IDS.length,
    permanentQlRange: 'CLK-QL-001..023',
    sourceSaturationComplete: true,
    deterministicGeneration: true,
    multilingualAnchorParity: true,
    multilingualVariantParity: true,
    enabledMergedVariantCount: CLK_001_AUTHORING_VARIANT_AUTHORITY_V1.enabledMergedVariantCount,
    authoringVariantAuthorityId: CLK_001_AUTHORING_VARIANT_AUTHORITY_V1.authorityId,
    advancedHeldCandidatesExcluded: true,
    reviewOnly: true,
  },
};

export function isClk001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? '').trim().toUpperCase();
  if (packageId) return packageId === CLK_001_PACKAGE_ID;
  const pattern = String(request.patternId ?? '').trim().toUpperCase();
  if (pattern === CLK_001_PACKAGE_ID || pattern.startsWith('CLK-QL-')) return true;
  const topic = String(request.topic ?? '').trim().toLowerCase();
  const subtopic = String(request.subtopic ?? '').trim().toLowerCase();
  return topic === 'clock' || subtopic === 'clock' || subtopic === 'clocks';
}

export async function generateClk001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== CLK_001_RUNTIME_MODE) {
    throw new Error('CLK-001 only supports review-only runtime.');
  }
  const count = normalizeCount(request.count);
  const language = normalizeLanguage(request.language);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const requestedQl = resolveQlId(request);
  const baseSeed = String(request.seed ?? '').trim() || 'clk001-question-studio-v1';
  const pool = requestedQl
    ? [requestedQl]
    : shuffledQls(baseSeed + ':ql-order');
  const questions: Record<string, unknown>[] = [];
  const maxCandidates = requestedDifficulty ? Math.max(400, count * 120) : count;
  let candidateIndex = 0;

  while (questions.length < count && candidateIndex < maxCandidates) {
    const qlId = pool[candidateIndex % pool.length]!;
    const contract = getClockPermanentContract(qlId);
    const itemSeed = baseSeed + ':' + qlId + ':' + candidateIndex;
    const authoringTaskId = selectClk001AuthoringTaskV1(
      qlId,
      candidateIndex + hash(baseSeed + ':' + qlId + ':variant-offset'),
    );
    const english = generateClockQuestion({
      taskId: authoringTaskId,
      seed: itemSeed,
      locale: 'en-IN',
      correctOptionIndex: (hash(itemSeed + ':option') % 4) as 0 | 1 | 2 | 3,
    });
    const localized = localizeClockAnchorQuestion(english, language);
    const options = localized.options.map((option) => option.display);
    const correctIndex = localized.correctOptionIndex;
    const difficulty = publicDifficulty(english.difficulty);
    candidateIndex += 1;
    if (requestedDifficulty && difficulty !== requestedDifficulty) {
      continue;
    }
    const questionId = 'CLK-001:' + qlId + ':' + language + ':' + hash(itemSeed);
    const explanation = [
      localized.explanation.given,
      localized.explanation.rule,
      ...localized.explanation.working,
      localized.explanation.validityCheck,
      localized.explanation.answer,
    ].join('\n\n');

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: CLK_001_PACKAGE_ID,
      patternId: qlId,
      qlId,
      cpId: contract.checkpointCode,
      checkpointId: contract.checkpointCode,
      subject: 'Reasoning',
      topic: 'Reasoning',
      subtopic: 'Clock',
      language,
      locale: localized.locale,
      stem: localized.stem,
      text: localized.stem,
      options,
      correct: correctIndex,
      correctIndex,
      answer: options[correctIndex],
      canonicalAnswer: localized.answer.semanticKey,
      explanation,
      packageExplanation: localized.explanation,
      media: localized.media ?? null,
      renderer: localized.media ? 'SVG_FIGURE' : 'TEXT',
      difficulty,
      difficultyLabel: difficulty,
      generationSeed: itemSeed,
      runtimeMode: CLK_001_RUNTIME_MODE,
      reviewOnly: true,
      readOnly: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      registrationStatus: 'REGISTERED_REVIEW_ONLY',
      registrationAuthorityId: CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1.authorityId,
      traceability: {
        packageId: CLK_001_PACKAGE_ID,
        qlId,
        checkpointId: contract.checkpointCode,
        anchorTaskId: contract.anchorTaskId,
        authoringTaskId,
        authoringTaskPool: [...clk001AuthoringTasksForQlV1(qlId)],
        authoringVariantAuthorityId: CLK_001_AUTHORING_VARIANT_AUTHORITY_V1.authorityId,
        authorityCluster: contract.cluster,
        ownedDiscoveryTaskIds: [...contract.ownedTaskIds],
        sourceEvidenceRefs: [...contract.sourceEvidenceRefs],
        freezeVersion: CLK_001_PERMANENT_FREEZE_VERSION,
        semanticFingerprint: english.fingerprint,
        solverProofLevel: english.solveTrace.proofLevel,
        difficultyAuthority: 'ITEM_LEVEL_V1',
        difficultyBaselineScore: english.discoveryAudit.difficultyBaselineScore,
        difficultyItemScore: english.discoveryAudit.difficultyItemScore,
        difficultyFactors: [...english.discoveryAudit.difficultyFactors],
      },
      validation: {
        fourOptions: options.length === 4,
        uniqueOptions: new Set(options).size === 4,
        exactlyOneCorrect: localized.options.filter((option) => option.isCorrect).length === 1,
        solverAgreement: english.solveTrace.agreement === true,
        semanticParityPreserved: localized.answer.semanticKey === english.answer.semanticKey,
        correctIndexPreserved: localized.correctOptionIndex === english.correctOptionIndex,
        sourceSaturationComplete: true,
      },
    });
  }

  if (questions.length !== count) {
    throw new Error(
      'Unable to generate ' + count + ' CLK-001 questions matching ' +
      String(requestedDifficulty ?? 'Mixed') + ' within deterministic candidate budget.'
    );
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: 'reasoning-v1',
      packageId: CLK_001_PACKAGE_ID,
      runtimeMode: CLK_001_RUNTIME_MODE,
      completionAuthorityId: CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1.authorityId,
      freezeVersion: CLK_001_PERMANENT_FREEZE_VERSION,
      permanentQlCount: CLK_001_PERMANENT_QL_IDS.length,
      permanentQlIds: [...CLK_001_PERMANENT_QL_IDS],
      language,
      requestedDifficulty: requestedDifficulty ?? 'Mixed',
      seed: baseSeed,
      count,
    },
  };
}
