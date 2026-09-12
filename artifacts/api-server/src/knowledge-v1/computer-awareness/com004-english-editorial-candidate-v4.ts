import { createHash } from 'node:crypto';
import { COM004_ENGLISH_CHAPTER_V3, COM004_EDITORIAL_APPROVAL_V3, COM004_ENGLISH_FREEZE_AUTHORITY_V3 } from './com004-editorial-corpus-v3';
import { COM004_ENGLISH_EDITORIAL_COPY_V4 } from './com004-english-editorial-copy-v4';
import { auditCom004EnglishChapterV2 } from './com004-english-chapter-v2';
import type { Com004EnglishChapterQuestionV1 } from './com004-english-chapter-candidate-v1';

const copyById = new Map(COM004_ENGLISH_EDITORIAL_COPY_V4.map(row => [row.sourceQuestionId, row]));
const approved = new Set(COM004_EDITORIAL_APPROVAL_V3.revisedSourceQuestionIds);
if (copyById.size !== 170 || COM004_ENGLISH_EDITORIAL_COPY_V4.length !== 170) throw new Error('COM004 V4 requires 170 unique revisions');
for (const id of copyById.keys()) {
  if (approved.has(id)) throw new Error(`COM004 V4 must preserve the approved V3 item ${id}`);
  if (!COM004_ENGLISH_CHAPTER_V3.some(q => q.questionId === id)) throw new Error(`Unknown COM004 source ${id}`);
}
export const COM004_ENGLISH_EDITORIAL_CANDIDATE_V4 = Object.freeze(COM004_ENGLISH_CHAPTER_V3.map(source => {
  const copy = copyById.get(source.questionId);
  return copy ? Object.freeze({ ...source, stem: copy.stem, explanation: copy.explanation }) : source;
}));
export const COM004_ENGLISH_EDITORIAL_AUTHORITY_V4 = Object.freeze({
  authorityId: 'COM-004-ENGLISH-EDITORIAL-CANDIDATE-V4',
  predecessorAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V3.authorityId,
  status: 'COMPLETE_ENGLISH_EDITORIAL_REVIEW_CANDIDATE',
  reviewFile: 'COM004-COMPLETE-ENGLISH-REVIEW-V4.md',
  totalQuestionCount: COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.length,
  revisedQuestionCount: copyById.size,
  retainedApprovedQuestionCount: approved.size,
  revisedQuestionIds: Object.freeze([...copyById.keys()]),
  contentFingerprint: createHash('sha256').update(JSON.stringify(COM004_ENGLISH_EDITORIAL_CANDIDATE_V4)).digest('hex'),
  governance: Object.freeze({
    newItemsHumanReviewApproved: false,
    englishFrozen: false,
    localizationUpdated: false,
    runtimeRegistered: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    publicPublicationAuthorized: false,
  }),
});

export function auditCom004EnglishEditorialCandidateV4(questions: readonly Com004EnglishChapterQuestionV1[] = COM004_ENGLISH_EDITORIAL_CANDIDATE_V4) {
  const audit = auditCom004EnglishChapterV2(questions);
  const issues = [...audit.issues];
  const sourceById = new Map(COM004_ENGLISH_CHAPTER_V3.map(q => [q.questionId, q]));
  for (const q of questions) {
    const old = sourceById.get(q.questionId);
    if (!old) { issues.push(`UNKNOWN_SOURCE:${q.questionId}`); continue; }
    for (const key of Object.keys(old) as (keyof Com004EnglishChapterQuestionV1)[]) {
      if (key === 'stem' || key === 'explanation') continue;
      if (JSON.stringify(q[key]) !== JSON.stringify(old[key])) issues.push(`PROTECTED_FIELD:${q.questionId}:${key}`);
    }
    if (approved.has(q.questionId) && (q.stem !== old.stem || q.explanation !== old.explanation)) issues.push(`APPROVED_COPY_CHANGED:${q.questionId}`);
    if (/\b(?:at|in|for) (?:basic )?computer.awareness|exam.level|user.facing|a learner is asked|a question asks|durable enough|safest exam|Shortcut:|Trap warning:/i.test(q.stem + ' ' + q.explanation)) issues.push(`EDITORIAL_PADDING:${q.questionId}`);
    if (/\b(?:distractors?|other (?:options|choices)|remaining (?:options|choices|statements)|chapter|taxonomy|stable (?:fact|concept)|durable (?:fact|capability))\b/i.test(q.explanation)) issues.push(`EXPLANATION_COMMENTARY:${q.questionId}`);
  }
  return { valid: issues.length === 0, issues, questionCount: questions.length, revisedQuestionCount: copyById.size, retainedApprovedQuestionCount: approved.size };
}
const audit = auditCom004EnglishEditorialCandidateV4();
if (!audit.valid) throw new Error(`COM004 V4 audit failed: ${audit.issues.join(', ')}`);
