import { createHash } from 'node:crypto';
import {
  COM004_EDITORIAL_APPROVAL_V3,
  COM004_LOCALIZATION_CHAPTER_V3,
} from './com004-editorial-corpus-v3';
import {
  COM004_ENGLISH_EDITORIAL_CANDIDATE_V4,
} from './com004-english-editorial-candidate-v4';
import type { Com004LocalizedQuestionV1 } from './com004-localization-core-v1';

const approvedLocalizedIds = new Set(COM004_EDITORIAL_APPROVAL_V3.revisedSourceQuestionIds);

function simplifyStem(value: string, language: 'hi' | 'pa') {
  let stem = value.trim();
  if (language === 'hi') {
    stem = stem
      .replace(/^मूल computer awareness में\s*/i, '')
      .replace(/^बुनियादी computer awareness में\s*/i, '')
      .replace(/\s*सही विकल्प चुनें\.?\s*$/i, '?')
      .replace(/\s*सही विकल्प क्या है\??\s*$/i, '?');
  } else {
    stem = stem
      .replace(/^ਮੁੱਢਲੀ computer awareness ਵਿੱਚ\s*/i, '')
      .replace(/\s*ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ\.?\s*$/i, '?')
      .replace(/\s*ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ\??\s*$/i, '?');
  }
  return stem.replace(/\s{2,}/g, ' ').trim();
}

function simplifyExplanation(value: string, language: 'hi' | 'pa') {
  const commentary = language === 'hi'
    ? /बाकी विकल्प|अन्य विकल्प|दूसरे विकल्प|chapter|अध्याय|वर्गीकरण से अलग|विकल्पों को/u
    : /ਬਾਕੀ ਵਿਕਲਪ|ਹੋਰ ਵਿਕਲਪ|ਦੂਜੇ ਵਿਕਲਪ|chapter|ਅਧਿਆਇ|ਵਰਗੀਕਰਨ ਤੋਂ ਵੱਖ|ਵਿਕਲਪਾਂ ਨੂੰ/u;
  const sentences = value
    .trim()
    .split(/(?<=[।!?])\s+/u)
    .filter((sentence) => sentence.trim() && !commentary.test(sentence));
  return (sentences.slice(0, 2).join(' ') || value.trim()).replace(/\s{2,}/g, ' ').trim();
}

function buildLanguage(language: 'hi' | 'pa') {
  const source = COM004_LOCALIZATION_CHAPTER_V3[language];
  return Object.freeze(source.map((question) => {
    const revised = approvedLocalizedIds.has(question.sourceQuestionId);
    return Object.freeze({
      ...question,
      stem: revised ? question.stem : simplifyStem(question.stem, language),
      explanation: revised ? question.explanation : simplifyExplanation(question.explanation, language),
      sourceEnglishAuthorityId: 'COM-004-ENGLISH-FREEZE-V4',
    });
  })) as unknown as readonly Com004LocalizedQuestionV1[];
}

export const COM004_LOCALIZATION_CHAPTER_V4 = Object.freeze({
  hi: buildLanguage('hi'),
  pa: buildLanguage('pa'),
});

const fingerprint = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hindiFingerprint = fingerprint(COM004_LOCALIZATION_CHAPTER_V4.hi);
const punjabiFingerprint = fingerprint(COM004_LOCALIZATION_CHAPTER_V4.pa);

export const COM004_LOCALIZATION_EDITORIAL_AUTHORITY_V4 = Object.freeze({
  authorityId: 'COM-004-LOCALIZATION-EDITORIAL-CANDIDATE-V4' as const,
  predecessorAuthorityId: 'COM-004-LOCALIZATION-FREEZE-V3' as const,
  status: 'LOCALIZATION_EDITORIAL_CANDIDATE' as const,
  revisedQuestionCountPerLanguage: 170,
  retainedApprovedQuestionCountPerLanguage: 34,
  supportedLanguages: Object.freeze(['hi', 'pa'] as const),
  fingerprints: Object.freeze({ hindiFingerprint, punjabiFingerprint }),
  governance: Object.freeze({
    humanReviewApproved: false,
    localizationFrozen: false,
    runtimeRegistered: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    publicPublicationAuthorized: false,
  }),
});

export function auditCom004LocalizationEditorialCandidateV4() {
  const issues: string[] = [];
  for (const language of ['hi', 'pa'] as const) {
    const corpus = COM004_LOCALIZATION_CHAPTER_V4[language];
    if (corpus.length !== 204) issues.push(`COUNT:${language}:${corpus.length}`);
    const ids = new Set<string>();
    for (const question of corpus) {
      if (ids.has(question.sourceQuestionId)) issues.push(`DUPLICATE:${language}:${question.sourceQuestionId}`);
      ids.add(question.sourceQuestionId);
      if (!/[\u0900-\u097f]/u.test(question.stem) && language === 'hi') issues.push(`SCRIPT_STEM:${question.sourceQuestionId}`);
      if (!/[\u0a00-\u0a7f]/u.test(question.stem) && language === 'pa') issues.push(`SCRIPT_STEM:${question.sourceQuestionId}`);
      if (question.options.length !== 4 || question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_OPTIONS:${language}:${question.sourceQuestionId}`);
      const english = COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.find((candidate) => candidate.questionId === question.sourceQuestionId);
      const historical = COM004_LOCALIZATION_CHAPTER_V3[language].find((candidate) => candidate.sourceQuestionId === question.sourceQuestionId);
      if (!english || !historical) { issues.push(`MISSING_SOURCE:${language}:${question.sourceQuestionId}`); continue; }
      if (question.correctIndex !== english.correctIndex || question.sourceEnglishCanonicalAnswer !== english.canonicalAnswer) issues.push(`ENGLISH_BINDING:${language}:${question.sourceQuestionId}`);
      if (JSON.stringify(question.options) !== JSON.stringify(historical.options)) issues.push(`OPTION_MUTATION:${language}:${question.sourceQuestionId}`);
      if (question.sourceEnglishAuthorityId !== 'COM-004-ENGLISH-FREEZE-V4') issues.push(`AUTHORITY:${language}:${question.sourceQuestionId}`);
      if (/\b(?:Shortcut|Trap warning|computer-awareness question|exam level|a learner is asked|chapter|अध्याय|\bਅਧਿਆਇ\b)/iu.test(`${question.stem} ${question.explanation}`)) issues.push(`EDITORIAL_PADDING:${language}:${question.sourceQuestionId}`);
    }
    if (ids.size !== 204) issues.push(`ID_COVERAGE:${language}:${ids.size}`);
  }
  return { valid: issues.length === 0, issues, counts: { hi: COM004_LOCALIZATION_CHAPTER_V4.hi.length, pa: COM004_LOCALIZATION_CHAPTER_V4.pa.length } };
}

if (COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.length !== 204) {
  throw new Error('COM-004 V4 English candidate must contain 204 questions');
}
const audit = auditCom004LocalizationEditorialCandidateV4();
if (!audit.valid) throw new Error(`COM-004 V4 localization audit failed: ${audit.issues.join(', ')}`);
