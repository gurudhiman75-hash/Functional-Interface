import { COM004_ENGLISH_EDITORIAL_CANDIDATE_V4 } from './com004-english-editorial-candidate-v4';
import { COM004_LOCALIZATION_FREEZE_AUTHORITY_V4 } from './com004-localization-freeze-v4';

export type Com004DifficultyV3 = 'Easy' | 'Medium';
export const COM004_DIFFICULTY_AUTHORITY_VERSION_V3 = 'COM004-DIFFICULTY-TOPOLOGY-V3' as const;

export function classifyCom004DifficultyV3(question: { surfaceFamily: string }) {
  const difficulty: Com004DifficultyV3 = question.surfaceFamily === 'DIRECT_RECALL' ? 'Easy' : 'Medium';
  const rationale = difficulty === 'Easy'
    ? 'Direct recognition or stable terminology recall with one bounded concept.'
    : 'Requires discrimination, application, statement evaluation or ordered/matched reasoning.';
  return Object.freeze({
    difficulty,
    topology: difficulty === 'Easy' ? 'RECALL_RECOGNITION' as const : 'DISCRIMINATION_APPLICATION' as const,
    rationale,
    classifierVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V3,
  });
}

export const COM004_DIFFICULTY_AUTHORITY_V3 = Object.freeze({
  authorityId: 'COM-004-DIFFICULTY-AUTHORITY-V3' as const,
  chapterCode: 'COM-004' as const,
  localizationFreezeAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V4.authorityId,
  englishFreezeAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V4.englishFreezeAuthorityId,
  status: 'FROZEN_REVIEW_TOPOLOGY' as const,
  classifierVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V3,
  supportedDifficulties: ['Easy', 'Medium'] as const,
  hardDifficultyAuthorized: false,
  classificationRule: Object.freeze({
    DIRECT_RECALL: 'Easy',
    CONCEPT_DISCRIMINATION: 'Medium',
    SCENARIO_APPLICATION: 'Medium',
    STATEMENT_EVALUATION: 'Medium',
    PROCESS_REASONING: 'Medium',
    MATCHING_REASONING: 'Medium',
  }),
  questionCount: COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.length,
  questionsPerQl: 12,
  governance: Object.freeze({
    difficultyFilterSupported: true,
    productionDifficultyClaimsAuthorized: false,
    mutationAllowed: false,
    replacementRequiresNewVersion: true,
  }),
});

export function auditCom004DifficultyAuthorityV3() {
  const issues: string[] = [];
  const counts = { Easy: 0, Medium: 0 };
  const perQl = new Map<string, { Easy: number; Medium: number }>();
  for (const question of COM004_ENGLISH_EDITORIAL_CANDIDATE_V4) {
    const decision = classifyCom004DifficultyV3(question);
    counts[decision.difficulty] += 1;
    const current = perQl.get(question.qlId) ?? { Easy: 0, Medium: 0 };
    current[decision.difficulty] += 1;
    perQl.set(question.qlId, current);
    if (decision.difficulty === 'Easy' && question.surfaceFamily !== 'DIRECT_RECALL') issues.push(`EASY_RULE:${question.questionId}`);
  }
  if (counts.Easy === 0 || counts.Medium === 0) issues.push('DIFFICULTY_BUCKET_EMPTY');
  if (COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.length !== 204) issues.push('QUESTION_COUNT');
  for (const [qlId, count] of perQl) if (count.Easy === 0 || count.Medium === 0) issues.push(`QL_BUCKET:${qlId}`);
  return { valid: issues.length === 0, issues, counts, perQl: Object.fromEntries(perQl) };
}

const audit = auditCom004DifficultyAuthorityV3();
if (!audit.valid) throw new Error(`COM-004 V3 difficulty audit failed: ${audit.issues.join(', ')}`);
