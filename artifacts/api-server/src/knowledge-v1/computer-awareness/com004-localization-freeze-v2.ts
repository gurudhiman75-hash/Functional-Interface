import { createHash } from 'node:crypto';
import { COM004_ENGLISH_FREEZE_AUTHORITY_V2 } from './com004-english-chapter-v2';
import { COM004_LOCALIZATION_CHAPTER_V1, auditCom004LocalizationChapterV1 } from './com004-localization-chapter-v1';

function stableProjection(language: 'hi' | 'pa') {
  return COM004_LOCALIZATION_CHAPTER_V1[language].map(question => ({
    localizationId: question.localizationId,
    sourceQuestionId: question.sourceQuestionId,
    qlId: question.qlId,
    authorityProposalId: question.authorityProposalId,
    sourceCandidateIds: [...question.sourceCandidateIds],
    surfaceFamily: question.surfaceFamily,
    language: question.language,
    locale: question.locale,
    stem: question.stem,
    options: [...question.options],
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
    sourceEnglishCanonicalAnswer: question.sourceEnglishCanonicalAnswer,
    sourceEnglishFrozen: question.sourceEnglishFrozen,
    sourceEnglishAuthorityId: question.sourceEnglishAuthorityId,
  }));
}

function fingerprint(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

const audit = auditCom004LocalizationChapterV1();
if (!audit.valid) throw new Error(`COM-004 localization freeze requires a valid corpus: ${audit.issues.join(', ')}`);

const hindiFingerprint = fingerprint(stableProjection('hi'));
const punjabiFingerprint = fingerprint(stableProjection('pa'));
const combinedFingerprint = fingerprint({
  englishFreezeAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  englishContentFingerprint: COM004_ENGLISH_FREEZE_AUTHORITY_V2.contentFingerprint,
  hindiFingerprint,
  punjabiFingerprint,
});

export const COM004_LOCALIZATION_FREEZE_AUTHORITY_V2 = Object.freeze({
  authorityId: 'COM-004-LOCALIZATION-FREEZE-V2' as const,
  chapterCode: 'COM-004' as const,
  chapterTitle: 'Internet, Web, E-mail & Digital Services' as const,
  status: 'HI_PA_LOCALIZATION_FROZEN' as const,
  englishFreezeAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  permanentQlRange: COM004_ENGLISH_FREEZE_AUTHORITY_V2.permanentQlRange,
  permanentQlCount: 17,
  supportedLanguages: ['en', 'hi', 'pa'] as const,
  locales: ['en-IN', 'hi-IN', 'pa-IN'] as const,
  frozenEnglishQuestionCount: 204,
  frozenHindiQuestionCount: 204,
  frozenPunjabiQuestionCount: 204,
  frozenLocalizedQuestionCount: 408,
  questionsPerQlPerLanguage: 12,
  fingerprints: Object.freeze({ hindiFingerprint, punjabiFingerprint, combinedFingerprint }),
  validation: Object.freeze({
    auditValid: audit.valid,
    issueCount: audit.issues.length,
    missingHindi: audit.missing.hi.length,
    missingPunjabi: audit.missing.pa.length,
  }),
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
  nextGate: 'COM004_QUESTION_STUDIO_REGISTRATION_V1' as const,
});

export function auditCom004LocalizationFreezeV2() {
  const current = auditCom004LocalizationChapterV1();
  const issues = [...current.issues];
  if (current.counts.en !== 204 || current.counts.hi !== 204 || current.counts.pa !== 204) issues.push('COUNT_DRIFT');
  if (COM004_ENGLISH_FREEZE_AUTHORITY_V2.governance.englishFrozen !== true) issues.push('ENGLISH_NOT_FROZEN');
  return { valid: issues.length === 0, issues, authority: COM004_LOCALIZATION_FREEZE_AUTHORITY_V2 };
}
