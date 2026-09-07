import { createHash } from 'node:crypto';
import {
  COM004_ENGLISH_EDITORIAL_CANDIDATE_V4,
  COM004_ENGLISH_EDITORIAL_AUTHORITY_V4,
} from './com004-english-editorial-candidate-v4';
import {
  auditCom004LocalizationEditorialCandidateV4,
  COM004_LOCALIZATION_CHAPTER_V4,
  COM004_LOCALIZATION_EDITORIAL_AUTHORITY_V4,
} from './com004-localization-editorial-candidate-v4';

const fingerprint = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hindiFingerprint = fingerprint(COM004_LOCALIZATION_CHAPTER_V4.hi);
const punjabiFingerprint = fingerprint(COM004_LOCALIZATION_CHAPTER_V4.pa);
const combinedFingerprint = fingerprint({
  englishFreezeAuthorityId: 'COM-004-ENGLISH-FREEZE-V4',
  englishContentFingerprint: fingerprint(COM004_ENGLISH_EDITORIAL_CANDIDATE_V4),
  hindiFingerprint,
  punjabiFingerprint,
});

export const COM004_LOCALIZATION_FREEZE_AUTHORITY_V4 = Object.freeze({
  authorityId: 'COM-004-LOCALIZATION-FREEZE-V4' as const,
  chapterCode: 'COM-004' as const,
  chapterTitle: 'Internet, Web, E-mail & Digital Services' as const,
  status: 'HI_PA_LOCALIZATION_FROZEN' as const,
  predecessorAuthorityId: 'COM-004-LOCALIZATION-FREEZE-V3' as const,
  englishFreezeAuthorityId: 'COM-004-ENGLISH-FREEZE-V4' as const,
  englishEditorialAuthorityId: COM004_ENGLISH_EDITORIAL_AUTHORITY_V4.authorityId,
  permanentQlRange: 'QL-001 through QL-017' as const,
  permanentQlCount: 17,
  supportedLanguages: ['en', 'hi', 'pa'] as const,
  locales: ['en-IN', 'hi-IN', 'pa-IN'] as const,
  frozenEnglishQuestionCount: COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.length,
  frozenHindiQuestionCount: COM004_LOCALIZATION_CHAPTER_V4.hi.length,
  frozenPunjabiQuestionCount: COM004_LOCALIZATION_CHAPTER_V4.pa.length,
  frozenLocalizedQuestionCount: COM004_LOCALIZATION_CHAPTER_V4.hi.length + COM004_LOCALIZATION_CHAPTER_V4.pa.length,
  questionsPerQlPerLanguage: 12,
  fingerprints: Object.freeze({ hindiFingerprint, punjabiFingerprint, combinedFingerprint }),
  sourceLocalizationEditorialAuthorityId: COM004_LOCALIZATION_EDITORIAL_AUTHORITY_V4.authorityId,
  governance: Object.freeze({
    englishFrozen: true,
    localizationFrozen: true,
    fullChapterLocalizationFrozen: true,
    mutationAllowed: false,
    replacementRequiresNewVersion: true,
    localizationAuthoringAuthorized: false,
    questionStudioRegistrationGateAuthorized: true,
    questionStudioRegistered: false,
    runtimeRegistrationAuthorized: true,
    persistenceAllowed: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    publicPublicationAuthorized: false,
    productionReleased: false,
  }),
  nextGate: 'COM004_QUESTION_STUDIO_REGISTRATION_V4' as const,
});

export function auditCom004LocalizationFreezeV4() {
  const candidateAudit = auditCom004LocalizationEditorialCandidateV4();
  const issues = [...candidateAudit.issues];
  if (COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.length !== 204) issues.push('ENGLISH_COUNT');
  if (COM004_LOCALIZATION_CHAPTER_V4.hi.length !== 204) issues.push('HINDI_COUNT');
  if (COM004_LOCALIZATION_CHAPTER_V4.pa.length !== 204) issues.push('PUNJABI_COUNT');
  if (fingerprint(COM004_ENGLISH_EDITORIAL_CANDIDATE_V4) !== COM004_ENGLISH_EDITORIAL_AUTHORITY_V4.contentFingerprint) issues.push('ENGLISH_FINGERPRINT');
  if (fingerprint(COM004_LOCALIZATION_CHAPTER_V4.hi) !== hindiFingerprint) issues.push('HINDI_FINGERPRINT');
  if (fingerprint(COM004_LOCALIZATION_CHAPTER_V4.pa) !== punjabiFingerprint) issues.push('PUNJABI_FINGERPRINT');
  return { valid: issues.length === 0, issues, authority: COM004_LOCALIZATION_FREEZE_AUTHORITY_V4 };
}

const audit = auditCom004LocalizationFreezeV4();
if (!audit.valid) throw new Error(`COM-004 V4 localization freeze failed: ${audit.issues.join(', ')}`);
