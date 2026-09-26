import { deterministicShuffle } from '../../knowledge-v1/deterministic';
import { WGE_CORPUS, WGE_CP_TITLES, WGE_LANGUAGES, WGE_SOURCES, type WorldGeographyCpId } from '../../knowledge-v1/world-geography/corpus';
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioPackageDefinition } from '../engine-types';
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from '../standard-lifecycle';

const packageId = 'WGE-001';
const runtimeMode = 'review-only';
const cpIds = Object.keys(WGE_CP_TITLES) as WorldGeographyCpId[];
const packageIds = new Set([packageId, ...cpIds]);
const locales = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN' };
const registrationAuthorityId = 'WGE-001-SECTION-A-AUTHORED-REVIEW-V1';
const normalize = (v: string | undefined) => (v ?? '').trim().toUpperCase();

function definition(cp?: WorldGeographyCpId): QuestionStudioPackageDefinition {
  const rows = WGE_CORPUS.filter(q => !cp || q.cpId === cp);
  return {
    engineId: 'knowledge-v1', packageId: cp ?? packageId, subject: 'Static GK',
    topic: 'World Geography', subtopic: cp ? WGE_CP_TITLES[cp] : 'Earth and Physical Foundations',
    label: `World Geography · ${cp ? WGE_CP_TITLES[cp] : 'Earth and Physical Foundations — Mixed'}`,
    enabled: true, cpIds: cp ? [cp] : [...cpIds], supportedLanguages: [...WGE_LANGUAGES],
    supportedDifficulties: ['Easy', 'Medium', 'Hard'], difficultyFilterSupported: true,
    runtimeMode, supportedRuntimeModes: [runtimeMode],
    lifecycleId: lifecycle.lifecycleId, lifecycleStage: lifecycle.stage,
    reviewSurfaceRequired: true, manualApprovalRequired: true,
    questionBankStatus: lifecycle.questionBankStatus, questionBankWritable: false,
    testEligibility: lifecycle.testEligibility, testEligible: false, mockTestEligible: false,
    publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false,
    metadata: {
      ...lifecycle, registrationAuthorityId, authoringReviewApproved: true,
      localizationStatus: 'USER_APPROVED', section: 'A', questionCountPerLanguage: rows.length,
      canonicalPackageId: packageId, cpTitles: WGE_CP_TITLES,
      difficultyCounts: Object.fromEntries(['Easy', 'Medium', 'Hard'].map(d => [d, rows.filter(q => q.difficulty === d).length])),
      // CP package aliases make chapter selection available in the standard
      // cockpit's existing package selector; they do not duplicate the corpus.
      corpusSharedWith: packageId, distinctKnowledgeCapacityIsNotPermutationCount: true,
    },
  };
}
export function isWge001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest): boolean {
  const id = normalize(request.packageId);
  if (id) return id === packageId || id.startsWith(`${packageId}-`);
  return request.topic?.trim().toLowerCase() === 'world geography' ||
    [request.canonicalProblemId, request.patternId, request.questionLanguageId].some(v => normalize(v).startsWith(`${packageId}-`));
}

function resolveSelection(request: QuestionStudioGenerationRequest) {
  const requestedPackage = normalize(request.packageId) || packageId;
  if (!packageIds.has(requestedPackage)) throw new Error(`Unknown WGE package: ${requestedPackage}`);
  const selectedCps = new Set<string>();
  const selectedQuestions = new Set<string>();
  if (requestedPackage !== packageId) selectedCps.add(requestedPackage);
  for (const raw of [request.canonicalProblemId, request.patternId, request.questionLanguageId]) {
    const selector = normalize(raw);
    if (!selector || selector === packageId) continue;
    if (cpIds.includes(selector as WorldGeographyCpId)) selectedCps.add(selector);
    else {
      const q = WGE_CORPUS.find(q => q.id === selector);
      if (!q) throw new Error(`Unknown WGE selector: ${selector}`);
      selectedQuestions.add(q.id); selectedCps.add(q.cpId);
    }
  }
  const subtopic = request.subtopic?.trim();
  if (subtopic && subtopic.toLowerCase() !== 'earth and physical foundations') {
    const cp = cpIds.find(cp => WGE_CP_TITLES[cp].toLowerCase() === subtopic.toLowerCase() || cp === subtopic.toUpperCase());
    if (!cp) throw new Error(`Unknown WGE subtopic: ${subtopic}`);
    selectedCps.add(cp);
  }
  if (selectedCps.size > 1 || selectedQuestions.size > 1) throw new Error('Conflicting WGE selectors');
  return { requestedPackage, cp: [...selectedCps][0], questionId: [...selectedQuestions][0] };
}

export const knowledgeV1Wge001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: 'knowledge-v1',
  listPackages() { return [definition(), ...cpIds.map(cp => definition(cp))]; },
  async generate(request) {
    if (request.runtimeMode && request.runtimeMode !== runtimeMode) throw new Error('WGE-001 supports review-only runtime');
    const language = request.language ?? 'en';
    if (!WGE_LANGUAGES.includes(language)) throw new Error(`Unsupported WGE language: ${language}`);
    const difficulty = request.difficulty || 'Mixed';
    if (!['Mixed', 'Easy', 'Medium', 'Hard'].includes(difficulty)) throw new Error(`Unsupported WGE difficulty: ${difficulty}`);
    const count = request.count ?? 5;
    if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error('WGE count must be an integer between 1 and 50');
    const { requestedPackage, cp, questionId } = resolveSelection(request);
    const candidates = WGE_CORPUS.filter(q => (!cp || q.cpId === cp) && (!questionId || q.id === questionId) && (difficulty === 'Mixed' || q.difficulty === difficulty));
    if (!candidates.length) throw new Error('WGE selection contains no questions');
    if (count > candidates.length) throw new Error(`WGE cannot generate ${count} questions from ${candidates.length} candidates without repeats`);
    const seed = request.seed?.trim() || 'wge-section-a-v1';
    // Language is deliberately absent: the same seed selects the same canonical
    // questions and option positions in all three languages.
    const chosen = deterministicShuffle(candidates, `${seed}:${cp ?? 'ALL'}:${difficulty}:${questionId ?? 'ALL'}`).slice(0, count);
    const questions = chosen.map(q => {
      const l = q.locales[language];
      const order = deterministicShuffle([0, 1, 2, 3], `${seed}:${q.id}:options`);
      const options = order.map(i => l.options[i]!);
      const correctIndex = order.indexOf(q.correctIndex);
      const canonicalAnswer = l.options[q.correctIndex]!;
      return {
        ...lifecycle, id: `${q.id}-${language}`, questionId: `${q.id}-${language}`,
        sourceQuestionId: q.id, canonicalItemId: q.id, canonicalPackageId: packageId,
        packageId: requestedPackage, cpId: q.cpId, canonicalProblemId: q.cpId,
        patternId: q.cpId, subject: 'Static GK', topic: 'World Geography',
        subtopic: WGE_CP_TITLES[q.cpId as WorldGeographyCpId], language, locale: locales[language],
        stem: l.stem, text: l.stem, options, correctIndex, correct: correctIndex,
        canonicalAnswer, answer: canonicalAnswer, explanation: l.explanation,
        difficulty: q.difficulty, difficultyLabel: q.difficulty, learningObjective: q.objective,
        sourceIds: [...q.sourceIds], sourceReferences: WGE_SOURCES.filter(s => q.sourceIds.includes(s.id)),
        registrationAuthorityId, registrationStatus: 'REGISTERED_REVIEW_ONLY',
        authoringReviewApproved: true, localizationStatus: 'USER_APPROVED', reviewOnly: true,
        readOnly: true, runtimeRegistered: true, productionReleased: false,
        revisionPolicy: 'REVISE_SOURCE_CORPUS_AND_RELOCALIZE_ALL_LANGUAGES',
      };
    });
    return { questions, generationContext: {
      ...lifecycle, engineId: 'knowledge-v1', packageId: requestedPackage,
      canonicalPackageId: packageId, runtimeMode, registrationAuthorityId,
      registrationStatus: 'REGISTERED_REVIEW_ONLY', authoringReviewApproved: true,
      localizationStatus: 'USER_APPROVED', language, locale: locales[language], difficulty,
      cpId: cp ?? null, seed, requestedCount: count, candidateCount: candidates.length,
      corpusQuestionCount: WGE_CORPUS.length, studentPublicationAuthorized: false,
    } };
  },
};
