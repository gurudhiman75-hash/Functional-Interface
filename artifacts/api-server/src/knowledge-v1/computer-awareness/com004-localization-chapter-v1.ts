import { COM004_ENGLISH_CHAPTER_V2 } from './com004-english-chapter-v2';
import { COM004_LOCALIZATION_WAVE1_QL001_V1 } from './com004-localization-wave1-ql001-v1';
import { COM004_LOCALIZATION_WAVE1_QL002_V1 } from './com004-localization-wave1-ql002-v1';
import { COM004_LOCALIZATION_WAVE1_QL003_V1 } from './com004-localization-wave1-ql003-v1';
import { COM004_LOCALIZATION_WAVE1_QL004_V1 } from './com004-localization-wave1-ql004-v1';
import type { Com004LocalizedQuestionV1 } from './com004-localization-core-v1';
import { COM004_LOCALIZATION_QL007_V2 } from './com004-localization-ql007-v2';
import { COM004_LOCALIZATION_QL008_V2 } from './com004-localization-ql008-v2';
import { COM004_LOCALIZATION_QL009_V2 } from './com004-localization-ql009-v2';
import { COM004_LOCALIZATION_QL010_V2 } from './com004-localization-ql010-v2';
import { COM004_LOCALIZATION_QL011_V2 } from './com004-localization-ql011-v2';
import { COM004_LOCALIZATION_QL012_V2 } from './com004-localization-ql012-v2';
import { COM004_LOCALIZATION_QL013_V2 } from './com004-localization-ql013-v2';
import { COM004_LOCALIZATION_QL014_V2 } from './com004-localization-ql014-v2';
import { COM004_LOCALIZATION_QL015_V2 } from './com004-localization-ql015-v2';
import { COM004_LOCALIZATION_QL016_V2 } from './com004-localization-ql016-v2';
import { COM004_LOCALIZATION_QL017_V2 } from './com004-localization-ql017-v2';
import { COM004_LOCALIZATION_WAVE2_QL005_V1 } from './com004-localization-wave2-ql005-v1';
import { COM004_LOCALIZATION_WAVE2_QL006_V1 } from './com004-localization-wave2-ql006-v1';
const packets = [
  COM004_LOCALIZATION_WAVE1_QL001_V1, COM004_LOCALIZATION_WAVE1_QL002_V1,
  COM004_LOCALIZATION_WAVE1_QL003_V1, COM004_LOCALIZATION_WAVE1_QL004_V1,
  COM004_LOCALIZATION_WAVE2_QL005_V1, COM004_LOCALIZATION_WAVE2_QL006_V1,
  COM004_LOCALIZATION_QL007_V2, COM004_LOCALIZATION_QL008_V2,
  COM004_LOCALIZATION_QL009_V2, COM004_LOCALIZATION_QL010_V2,
  COM004_LOCALIZATION_QL011_V2, COM004_LOCALIZATION_QL012_V2,
  COM004_LOCALIZATION_QL013_V2, COM004_LOCALIZATION_QL014_V2,
  COM004_LOCALIZATION_QL015_V2, COM004_LOCALIZATION_QL016_V2,
  COM004_LOCALIZATION_QL017_V2,
];
export const COM004_LOCALIZATION_CHAPTER_V1 = Object.freeze({
  hi: Object.freeze(packets.flatMap(p => p.hi)), pa: Object.freeze(packets.flatMap(p => p.pa)),
});
export function auditCom004LocalizationChapterV1(corpus: {hi: readonly Com004LocalizedQuestionV1[]; pa: readonly Com004LocalizedQuestionV1[]} = COM004_LOCALIZATION_CHAPTER_V1) {
  const issues: string[] = [];
  const missing: Record<string, string[]> = {};
  for (const language of ['hi','pa'] as const) {
    const items = corpus[language], ids = new Set<string>(), stems = new Set<string>();
    const script = language === 'hi' ? /[\u0900-\u097f]/ : /[\u0a00-\u0a7f]/;
    for (const item of items) {
      const source = COM004_ENGLISH_CHAPTER_V2.find(q => q.questionId === item.sourceQuestionId);
      const key = `${item.sourceQuestionId}/${language}`;
      if (ids.has(item.sourceQuestionId)) issues.push(`DUPLICATE_SOURCE:${key}`);
      ids.add(item.sourceQuestionId);
      if (stems.has(item.stem.trim())) issues.push(`DUPLICATE_STEM:${key}`);
      stems.add(item.stem.trim());
      if (!source) { issues.push(`UNKNOWN_SOURCE:${key}`); continue; }
      if (item.language !== language || item.locale !== `${language}-IN`) issues.push(`LOCALE:${key}`);
      if (item.qlId !== source.qlId || item.correctIndex !== source.correctIndex || item.sourceEnglishCanonicalAnswer !== source.canonicalAnswer || item.authorityProposalId !== source.authorityProposalId || JSON.stringify(item.sourceCandidateIds) !== JSON.stringify(source.sourceCandidateIds)) issues.push(`SOURCE_BINDING:${key}`);
      if (item.options.length !== 4 || new Set(item.options.map(v => v.trim().toLowerCase())).size !== 4 || item.options[item.correctIndex] !== item.canonicalAnswer) issues.push(`ANSWER_OPTIONS:${key}`);
      if (!script.test(item.stem) || !script.test(item.explanation)) issues.push(`SCRIPT:${key}`);
      if (/COM-00\d|\bQL\b|\bcorpus\b|\bTODO\b|\bTBD\b|\{\{/i.test([item.stem,...item.options,item.explanation].join(' '))) issues.push(`INTERNAL_COPY:${key}`);
      if (!item.localizationReviewOnly || item.localizationFrozen || item.runtimeRegistered || item.productionReleased) issues.push(`LIFECYCLE_DRIFT:${key}`);
    }
    missing[language] = COM004_ENGLISH_CHAPTER_V2.filter(q => !ids.has(q.questionId)).map(q => q.questionId);
    if (missing[language].length) issues.push(`MISSING_${language.toUpperCase()}:${missing[language].length}`);
  }
  return { valid: issues.length === 0, issues, missing, counts: { en: COM004_ENGLISH_CHAPTER_V2.length, hi: corpus.hi.length, pa: corpus.pa.length } };
}
