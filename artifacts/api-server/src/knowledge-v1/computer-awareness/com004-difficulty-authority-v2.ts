import { COM004_ENGLISH_CHAPTER_V3 } from './com004-editorial-corpus-v3';
import { COM004_LOCALIZATION_FREEZE_AUTHORITY_V3 } from './com004-editorial-corpus-v3';

export type Com004Difficulty = 'Easy' | 'Medium';
export const COM004_DIFFICULTY_AUTHORITY_VERSION_V2 = 'COM004-DIFFICULTY-TOPOLOGY-V2' as const;

export function classifyCom004DifficultyV2(question: { surfaceFamily: string; stem: string; options: string[]; correctIndex: number }) {
  const difficulty: Com004Difficulty = question.surfaceFamily === 'DIRECT_RECALL' ? 'Easy' : 'Medium';
  const rationale = difficulty === 'Easy'
    ? 'Direct recognition or stable terminology recall with one bounded concept.'
    : 'Requires discrimination, application, statement evaluation or ordered/matched reasoning.';
  return Object.freeze({
    difficulty,
    topology: difficulty === 'Easy' ? 'RECALL_RECOGNITION' as const : 'DISCRIMINATION_APPLICATION' as const,
    rationale,
    classifierVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V2,
  });
}

export const COM004_DIFFICULTY_AUTHORITY_V2 = Object.freeze({
  authorityId: 'COM-004-DIFFICULTY-AUTHORITY-V2' as const,
  chapterCode: 'COM-004' as const,
  localizationFreezeAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.authorityId,
  status: 'FROZEN_REVIEW_TOPOLOGY' as const,
  classifierVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V2,
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
  questionCount: COM004_ENGLISH_CHAPTER_V3.length,
  questionsPerQl: 12,
  governance: Object.freeze({
    difficultyFilterSupported: true,
    productionDifficultyClaimsAuthorized: false,
    mutationAllowed: false,
    replacementRequiresNewVersion: true,
  }),
});

export function auditCom004DifficultyAuthorityV2() {
  const issues: string[] = [];
  const counts = { Easy: 0, Medium: 0 };
  const perQl = new Map<string, { Easy: number; Medium: number }>();
  for (const question of COM004_ENGLISH_CHAPTER_V3) {
    const decision = classifyCom004DifficultyV2(question);
    counts[decision.difficulty] += 1;
    const current = perQl.get(question.qlId) ?? { Easy: 0, Medium: 0 };
    current[decision.difficulty] += 1;
    perQl.set(question.qlId, current);
    if (decision.difficulty === 'Easy' && question.surfaceFamily !== 'DIRECT_RECALL') issues.push(`EASY_RULE:${question.questionId}`);
  }
  if (counts.Easy === 0 || counts.Medium === 0) issues.push('DIFFICULTY_BUCKET_EMPTY');
  if (COM004_ENGLISH_CHAPTER_V3.length !== 204) issues.push('QUESTION_COUNT');
  for (const [qlId, count] of perQl) if (count.Easy === 0 || count.Medium === 0) issues.push(`QL_BUCKET:${qlId}`);
  return { valid: issues.length === 0, issues, counts, perQl: Object.fromEntries(perQl) };
}
