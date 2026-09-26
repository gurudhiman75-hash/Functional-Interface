import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from '../../../../question-studio/engine-types';
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from '../../../../question-studio/standard-lifecycle';
import { generateClockQuestion } from './runtime/generator';
import {
  CLOCK_CHECKPOINTS,
  type ClockCheckpointCode,
  type ClockTaskId,
} from './runtime/catalog';
import {
  CLK_001_PERMANENT_CONTRACTS,
  CLK_001_PERMANENT_QL_IDS,
  CLK_001_PERMANENT_FREEZE_VERSION,
  CLK_001_DESIGN_ONLY_REPRESENTATION_QL_IDS,
  CLK_001_EXTERNALLY_EVIDENCED_QL_IDS,
  getClockPermanentContract,
  isClockPermanentQlId,
  type ClockPermanentQlId,
} from './permanent-contracts';
import { CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1 } from './final-freeze-authority';
import { localizeClockAnchorQuestion, type ClockAuthoringLanguage } from './localization';
import { adaptClockOptionsForBanking } from './banking-five-option-delivery';

export const CLK_001_PACKAGE_ID = 'CLK-001' as const;
export const CLK_001_RUNTIME_MODE = 'review-only' as const;
const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const cpIds = CLOCK_CHECKPOINTS.map((checkpoint) => checkpoint.code) as ClockCheckpointCode[];

type PublicClockDifficulty = 'Easy' | 'Medium' | 'Hard';
type ClockExamProfile = 'CHAPTER_COVERAGE' | 'SSC_MODERN' | 'BANKING' | 'PUNJAB_STATE';

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

function publicDifficulty(value: 'FOUNDATION' | 'STANDARD' | 'ADVANCED'): PublicClockDifficulty {
  return value === 'FOUNDATION' ? 'Easy' : value === 'STANDARD' ? 'Medium' : 'Hard';
}

function normalizeDifficulty(value: unknown): PublicClockDifficulty | undefined {
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

const VARIANT_ENABLED_TASKS_BY_QL: Partial<Record<ClockPermanentQlId, readonly ClockTaskId[]>> = {
  'CLK-QL-019': [
    'TOTAL_STRIKES_12_HOURS',
    'TOTAL_STRIKES_24_HOURS',
    'TOTAL_STRIKES_INCLUSIVE_RANGE',
  ],
};

function authoringTaskForQl(
  qlId: ClockPermanentQlId,
  itemSeed: string,
): ClockTaskId {
  const contract = getClockPermanentContract(qlId);
  const enabled = VARIANT_ENABLED_TASKS_BY_QL[qlId];
  if (!enabled || enabled.length === 0) return contract.anchorTaskId;

  for (const taskId of enabled) {
    if (!contract.ownedTaskIds.includes(taskId)) {
      throw new Error(qlId + ' cannot author unowned Clock task ' + taskId + '.');
    }
  }
  return enabled[hash(itemSeed + ':owned-variant') % enabled.length]!;
}

function resolveExamProfile(value: unknown): ClockExamProfile {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (!normalized) return 'CHAPTER_COVERAGE';
  if (/\bssc\b|\bcgl\b|\bchsl\b|\bcpo\b|\bmts\b|gd constable/u.test(normalized)) {
    return 'SSC_MODERN';
  }
  if (/\bibps\b|\bsbi\b|\bbank\b|rrb officer|\bclerk\b|\bpo\b/u.test(normalized)) {
    return 'BANKING';
  }
  if (/\bpunjab\b|\bpsssb\b|\bppsc\b|\bpatwari\b|\bpspcl\b|excise/u.test(normalized)) {
    return 'PUNJAB_STATE';
  }
  return 'CHAPTER_COVERAGE';
}

function learnerExplanation(
  question: ReturnType<typeof localizeClockAnchorQuestion>,
  language: ClockAuthoringLanguage,
): string {
  if (language === 'en') {
    return [
      question.explanation.given,
      question.explanation.rule,
      ...question.explanation.working,
      question.explanation.validityCheck,
      question.explanation.answer,
    ].filter((part) => String(part ?? '').trim().length > 0).join('\n\n');
  }

  const working = [...question.explanation.working];
  const answer = String(question.explanation.answer ?? '').trim();
  const answerAlreadyShown = answer.length > 0 && working.some((step) => String(step).includes(answer));
  const answerLine = language === 'hi'
    ? 'अतः सही उत्तर: ' + answer
    : 'ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ: ' + answer;

  return [
    question.explanation.rule,
    ...working,
    answerAlreadyShown ? '' : answerLine,
  ].filter((part) => String(part ?? '').trim().length > 0).join('\n\n');
}

function isCheckpointId(value: string): value is ClockCheckpointCode {
  return cpIds.includes(value as ClockCheckpointCode);
}

function requestSelectors(request: QuestionStudioGenerationRequest): string[] {
  return [
    request.canonicalProblemId,
    request.questionLanguageId,
    request.patternId,
  ].map((value) => String(value ?? '').trim().toUpperCase()).filter(Boolean);
}

function resolveQlPool(request: QuestionStudioGenerationRequest): ClockPermanentQlId[] {
  const selectors = requestSelectors(request);
  const qlMatches = [...new Set(selectors.filter(isClockPermanentQlId))];
  const cpMatches = [...new Set(selectors.filter(isCheckpointId))];

  const allowed = new Set<string>([CLK_001_PACKAGE_ID, ...CLK_001_PERMANENT_QL_IDS, ...cpIds]);
  const unknown = selectors.find((value) => value.startsWith('CLK-') && !allowed.has(value));
  if (unknown) throw new Error('Unknown CLK-001 selector: ' + unknown);
  if (qlMatches.length > 1) throw new Error('Conflicting CLK-001 permanent QL selectors.');
  if (cpMatches.length > 1) throw new Error('Conflicting CLK-001 checkpoint selectors.');

  const qlId = qlMatches[0] as ClockPermanentQlId | undefined;
  const cpId = cpMatches[0] as ClockCheckpointCode | undefined;

  if (qlId && cpId) {
    const owner = getClockPermanentContract(qlId).checkpointCode;
    if (owner !== cpId) throw new Error(qlId + ' is owned by ' + owner + ', not ' + cpId + '.');
  }
  if (qlId) return [qlId];
  if (cpId) {
    const qls = CLK_001_PERMANENT_CONTRACTS
      .filter((contract) => contract.checkpointCode === cpId)
      .map((contract) => contract.qlId);
    if (qls.length === 0) {
      throw new Error(cpId + ' owns no permanent learner QL in the frozen CLK-001 authoring surface.');
    }
    return qls;
  }
  return [...CLK_001_PERMANENT_QL_IDS];
}

function shuffledQls(seed: string, input: readonly ClockPermanentQlId[]): ClockPermanentQlId[] {
  const values = [...input];
  let state = hash(seed) || 1;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [values[index], values[swap]] = [values[swap]!, values[index]!];
  }
  return values;
}

function generateMatchingInstance(input: {
  preferredQl: ClockPermanentQlId;
  pool: readonly ClockPermanentQlId[];
  baseSeed: string;
  index: number;
  requestedDifficulty?: PublicClockDifficulty;
}) {
  const qlCandidates = [
    input.preferredQl,
    ...input.pool.filter((qlId) => qlId !== input.preferredQl),
  ];
  const attemptLimit = input.requestedDifficulty ? 64 : 1;
  let lastDifficulty: PublicClockDifficulty | undefined;

  for (const qlId of qlCandidates) {
    const contract = getClockPermanentContract(qlId);
    for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
      const itemSeed = input.baseSeed + ':' + qlId + ':' + input.index + ':attempt:' + attempt;
      const generatedTaskId = authoringTaskForQl(qlId, itemSeed);
      const english = generateClockQuestion({
        taskId: generatedTaskId,
        seed: itemSeed,
        locale: 'en-IN',
        correctOptionIndex: (hash(itemSeed + ':option') % 4) as 0 | 1 | 2 | 3,
      });
      const generatedDifficulty = publicDifficulty(english.difficulty);
      lastDifficulty = generatedDifficulty;
      if (!input.requestedDifficulty || generatedDifficulty === input.requestedDifficulty) {
        return {
          qlId,
          contract,
          english,
          itemSeed,
          generatedTaskId,
          attempt,
          difficulty: generatedDifficulty,
        };
      }
    }
  }

  throw new Error(
    'CLK-001 could not generate the requested ' +
    String(input.requestedDifficulty) +
    ' instance within the selected QL/checkpoint scope; last generated band was ' +
    String(lastDifficulty ?? 'unknown') +
    '.',
  );
}

export const CLK_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: 'reasoning-v1',
  packageId: CLK_001_PACKAGE_ID,
  subject: 'Reasoning',
  topic: 'Clock',
  subtopic: 'Clock',
  label: 'Reasoning · Clock · CLK-001',
  enabled: true,
  cpIds: [...cpIds],
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
    externallyEvidencedPermanentQlCount: CLK_001_EXTERNALLY_EVIDENCED_QL_IDS.length,
    designOnlyRepresentationQlIds: [...CLK_001_DESIGN_ONLY_REPRESENTATION_QL_IDS],
    checkpointCount: cpIds.length,
    checkpointRange: 'CLK-CP-001..014',
    sourceSaturationComplete: true,
    deterministicGeneration: true,
    multilingualAnchorParity: true,
    advancedHeldCandidatesExcluded: true,
    difficultyCalibrationStatus: 'GENERATED_INSTANCE_AUDITED_V1',
    checkpointRoutingStatus: 'PERMANENT_QL_OWNERSHIP_ROUTED',
    examProfileDeliveryStatus: 'DELIVERY_FORMAT_ONLY_V1',
    bankingFiveOptionDelivery: true,
    examProfileContentWeightingApplied: false,
    nativeExplanationFillerRemoved: true,
    ownedVariantAuthoringStatus: 'SAFE_LOCALIZED_VARIANTS_ENABLED_SELECTIVELY',
    reviewOnly: true,
  },
};

export function isClk001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? '').trim().toUpperCase();
  if (packageId) return packageId === CLK_001_PACKAGE_ID;
  if (requestSelectors(request).some((selector) =>
    selector === CLK_001_PACKAGE_ID ||
    selector.startsWith('CLK-QL-') ||
    selector.startsWith('CLK-CP-')
  )) return true;
  const topic = String(request.topic ?? '').trim().toLowerCase();
  const subtopic = String(request.subtopic ?? '').trim().toLowerCase();
  return topic === 'clock' || topic === 'clocks' || subtopic === 'clock' || subtopic === 'clocks';
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
  const examProfile = resolveExamProfile(request.exam);
  const basePool = resolveQlPool(request);
  const baseSeed = String(request.seed ?? '').trim() || 'clk001-question-studio-v1';
  const pool = shuffledQls(baseSeed + ':ql-order', basePool);
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const preferredQl = pool[index % pool.length]!;
    const resolved = generateMatchingInstance({
      preferredQl,
      pool: basePool,
      baseSeed,
      index,
      requestedDifficulty,
    });

    const { qlId, contract, english, itemSeed, generatedTaskId, attempt, difficulty } = resolved;
    const localized = localizeClockAnchorQuestion(english, language);
    const canonicalOptions = localized.options.map((option) => option.display);
    const canonicalCorrectIndex = localized.correctOptionIndex;
    const delivery = examProfile === 'BANKING'
      ? adaptClockOptionsForBanking({
          options: canonicalOptions,
          correctIndex: canonicalCorrectIndex,
          language,
        })
      : {
          options: [...canonicalOptions],
          correctIndex: canonicalCorrectIndex,
          metadata: null,
        };
    const options = delivery.options;
    const correctIndex = delivery.correctIndex;
    const questionId = 'CLK-001:' + qlId + ':' + language + ':' + hash(itemSeed);
    const explanation = learnerExplanation(localized, language);

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
      topic: 'Clock',
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
      difficultyCalibrationStatus: 'GENERATED_INSTANCE_AUDITED_V1',
      difficultyScore: english.discoveryAudit.difficultyItemScore,
      difficultyFactors: [...english.discoveryAudit.difficultyFactors],
      sourceDifficultyLabel: publicDifficulty(contract.defaultDifficulty),
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: requestedDifficulty ? difficulty === requestedDifficulty : false,
      difficultySearchAttempts: attempt + 1,
      requestedExam: request.exam ?? null,
      examProfile,
      examProfileApplied: examProfile !== 'CHAPTER_COVERAGE',
      examProfileContentWeightingApplied: false,
      optionCountProfileApplied: examProfile === 'BANKING',
      bankingFiveOptionDelivery: delivery.metadata,
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
        generatedTaskId,
        authorityCluster: contract.cluster,
        ownedDiscoveryTaskIds: [...contract.ownedTaskIds],
        sourceEvidenceRefs: [...contract.sourceEvidenceRefs],
        freezeVersion: CLK_001_PERMANENT_FREEZE_VERSION,
        semanticFingerprint: english.fingerprint,
        solverProofLevel: english.solveTrace.proofLevel,
      },
      validation: {
        canonicalFourOptions: canonicalOptions.length === 4,
        deliveredOptionCount: options.length,
        uniqueOptions: new Set(options).size === options.length,
        exactlyOneCorrect: localized.options.filter((option) => option.isCorrect).length === 1,
        solverAgreement: english.solveTrace.agreement === true,
        semanticParityPreserved: localized.answer.semanticKey === english.answer.semanticKey,
        correctIndexPreserved: localized.correctOptionIndex === english.correctOptionIndex,
        difficultyDerivedFromGeneratedItem: true,
        requestedDifficultySatisfied: requestedDifficulty ? difficulty === requestedDifficulty : true,
        sourceSaturationComplete: true,
      },
    });
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
      cpIds: [...cpIds],
      checkpointCount: cpIds.length,
      language,
      requestedDifficulty: requestedDifficulty ?? 'Mixed',
      difficultyFilterApplied: Boolean(requestedDifficulty),
      difficultyCalibrationStatus: 'GENERATED_INSTANCE_AUDITED_V1',
      requestedExam: request.exam ?? null,
      examProfile,
      examProfileApplied: examProfile !== 'CHAPTER_COVERAGE',
      examProfileContentWeightingApplied: false,
      optionCountProfileApplied: examProfile === 'BANKING',
      bankingFiveOptionDelivery: examProfile === 'BANKING',
      seed: baseSeed,
      count,
    },
  };
}
