import { createHash } from 'node:crypto';
import { COM004_EDITORIAL_COPY_V3 } from './com004-editorial-copy-v3';
import { COM004_ENGLISH_CHAPTER_V2, COM004_ENGLISH_FREEZE_AUTHORITY_V2, auditCom004EnglishChapterV2 } from './com004-english-chapter-v2';
import { COM004_LOCALIZATION_CHAPTER_V1, auditCom004LocalizationChapterV1 } from './com004-localization-chapter-v1';
import { COM004_LOCALIZATION_FREEZE_AUTHORITY_V2 } from './com004-localization-freeze-v2';

const fingerprint = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const revisions = new Map(COM004_EDITORIAL_COPY_V3.map(row => [row.sourceQuestionId, row]));
if (revisions.size !== 34 || COM004_EDITORIAL_COPY_V3.length !== 34) throw new Error('COM004 V3 must contain exactly 34 unique revisions');
for (const id of revisions.keys()) if (!COM004_ENGLISH_CHAPTER_V2.some(q => q.questionId === id)) throw new Error(`Unknown COM004 V3 source ${id}`);

export const COM004_EDITORIAL_APPROVAL_V3 = Object.freeze({
  authorityId: 'COM-004-EDITORIAL-APPROVAL-V3',
  reviewFile: 'COM004-ENGLISH-QUESTION-REVIEW-V3.md',
  reviewFileSha256: 'e3023f688a632c4f9508361a1158b3bfad8c372ef7e76f633b15f267dfebc0dd',
  decision: 'APPROVED',
  userMessage: 'Approved',
  scope: '34_ENGLISH_REVIEW_ITEMS_STEMS_AND_EXPLANATIONS',
  revisedSourceQuestionIds: Object.freeze([...revisions.keys()]),
  localizedCopyStatus: 'TRANSLATED_FROM_APPROVED_ENGLISH_NOT_SEPARATELY_HUMAN_REVIEWED',
  scopeIncludesRemaining170Items: false,
});

export const COM004_ENGLISH_CHAPTER_V3 = Object.freeze(COM004_ENGLISH_CHAPTER_V2.map(source => {
  const copy = revisions.get(source.questionId)?.en;
  return copy ? Object.freeze({ ...source, ...copy }) : source;
}));
export const COM004_ENGLISH_FREEZE_AUTHORITY_V3 = Object.freeze({
  ...COM004_ENGLISH_FREEZE_AUTHORITY_V2,
  authorityId: 'COM-004-ENGLISH-FREEZE-V3' as const,
  predecessorAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  editorialRevisionAuthorityId: COM004_EDITORIAL_APPROVAL_V3.authorityId,
  contentFingerprint: fingerprint(COM004_ENGLISH_CHAPTER_V3),
  editorialApproval: COM004_EDITORIAL_APPROVAL_V3,
  nextGate: 'COM004_VERSIONED_EDITORIAL_RUNTIME_V3',
});
function localized(language: 'hi' | 'pa') {
  return Object.freeze(COM004_LOCALIZATION_CHAPTER_V1[language].map(source => Object.freeze({
    ...source,
    ...revisions.get(source.sourceQuestionId)?.[language],
    sourceEnglishAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V3.authorityId,
  })));
}
export const COM004_LOCALIZATION_CHAPTER_V3 = Object.freeze({ hi: localized('hi'), pa: localized('pa') });
const hindiFingerprint = fingerprint(COM004_LOCALIZATION_CHAPTER_V3.hi);
const punjabiFingerprint = fingerprint(COM004_LOCALIZATION_CHAPTER_V3.pa);
export const COM004_LOCALIZATION_FREEZE_AUTHORITY_V3 = Object.freeze({
  ...COM004_LOCALIZATION_FREEZE_AUTHORITY_V2,
  authorityId: 'COM-004-LOCALIZATION-FREEZE-V3' as const,
  predecessorAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
  englishFreezeAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V3.authorityId,
  fingerprints: Object.freeze({ hindiFingerprint, punjabiFingerprint, combinedFingerprint: fingerprint({
    english: COM004_ENGLISH_FREEZE_AUTHORITY_V3.contentFingerprint, hindiFingerprint, punjabiFingerprint,
  }) }),
  editorialApproval: COM004_EDITORIAL_APPROVAL_V3,
});

export function auditCom004EditorialCorpusV3() {
  const issues = [
    ...auditCom004EnglishChapterV2(COM004_ENGLISH_CHAPTER_V3).issues,
    ...auditCom004LocalizationChapterV1(COM004_LOCALIZATION_CHAPTER_V3).issues,
  ];
  for (const language of ['en', 'hi', 'pa'] as const) {
    const corpus = language === 'en' ? COM004_ENGLISH_CHAPTER_V3 : COM004_LOCALIZATION_CHAPTER_V3[language];
    const old = language === 'en' ? COM004_ENGLISH_CHAPTER_V2 : COM004_LOCALIZATION_CHAPTER_V1[language];
    for (const [i, q] of corpus.entries()) {
      const id = language === 'en' ? COM004_ENGLISH_CHAPTER_V3[i].questionId : COM004_LOCALIZATION_CHAPTER_V3[language][i].sourceQuestionId;
      const revision = revisions.get(id)?.[language];
      if (q.correctIndex !== old[i].correctIndex || q.canonicalAnswer !== old[i].canonicalAnswer || JSON.stringify(q.options) !== JSON.stringify(old[i].options)) issues.push(`ANSWER_DRIFT:${id}/${language}`);
      if (revision && (q.stem !== revision.stem || q.explanation !== revision.explanation)) issues.push(`COPY_DRIFT:${id}/${language}`);
      if (!revision && (q.stem !== old[i].stem || q.explanation !== old[i].explanation)) issues.push(`OUT_OF_SCOPE_EDIT:${id}/${language}`);
      if (revision && /Shortcut:|Trap warning:|computer-awareness question|a learner compares|in standard computer terminology/i.test(q.stem + q.explanation)) issues.push(`EDITORIAL_PADDING:${id}/${language}`);
    }
  }
  if (fingerprint(COM004_ENGLISH_CHAPTER_V3) !== COM004_ENGLISH_FREEZE_AUTHORITY_V3.contentFingerprint) issues.push('ENGLISH_FINGERPRINT');
  if (fingerprint(COM004_LOCALIZATION_CHAPTER_V3.hi) !== hindiFingerprint || fingerprint(COM004_LOCALIZATION_CHAPTER_V3.pa) !== punjabiFingerprint) issues.push('LOCALIZATION_FINGERPRINT');
  return { valid: issues.length === 0, issues, revisedPerLanguage: revisions.size, counts: { en: COM004_ENGLISH_CHAPTER_V3.length, hi: COM004_LOCALIZATION_CHAPTER_V3.hi.length, pa: COM004_LOCALIZATION_CHAPTER_V3.pa.length } };
}
const audit = auditCom004EditorialCorpusV3();
if (!audit.valid) throw new Error(`Invalid COM004 editorial revision: ${audit.issues.join(', ')}`);
