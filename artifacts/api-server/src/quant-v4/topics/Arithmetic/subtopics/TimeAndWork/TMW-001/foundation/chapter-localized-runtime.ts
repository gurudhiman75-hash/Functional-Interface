import { runTmwCp001Pipeline } from "./cp001-runtime";
import { runTmwCp002Pipeline } from "./cp002-runtime";
import { runTmwCp003Pipeline } from "./cp003-runtime";
import { runTmwCp004Pipeline } from "./cp004-runtime";
import { runTmwCp005Pipeline } from "./cp005-runtime";
import { runTmwCp006Pipeline } from "./cp006-runtime";
import { runTmwCp007Pipeline } from "./cp007-runtime";
import { runTmwCp007LocalizedPipeline } from "./cp007-localized-runtime";
import { runTmwCp008Pipeline } from "./cp008-runtime";
import { runTmwCp008LocalizedPipeline } from "./cp008-localized-runtime";
import { runTmwCp009Pipeline } from "./cp009-runtime";
import { runTmwCp009LocalizedPipeline } from "./cp009-localized-runtime";
import { runTmwCp010Pipeline } from "./cp010-runtime";
import { runTmwCp010LocalizedPipeline } from "./cp010-localized-runtime";
import { runTmwCp011Pipeline } from "./cp011-runtime";
import { runTmwCp011LocalizedPipeline } from "./cp011-localized-runtime";
import { runTmwCp012CoverageClosurePipeline } from "./cp012-coverage-closure-runtime";
import { runTmwCp013DataSufficiencyPipeline } from "./cp013-data-sufficiency-runtime";
import { runTmwCp014PresentationPipeline } from "./cp014-presentation-runtime";
import { applyTmw001MultilingualStemRemediation } from "./chapter-editorial-remediation";
import { applyTmw001MultilingualStemRemediationWave02 } from "./chapter-editorial-remediation-wave02";
import { sanitizeTmw001LocalizedPresentation } from "./chapter-presentation-sanitizer";
import { naturalizeTmw001LocalizedExplanation } from "./chapter-explanation-naturalizer";
import { applyTmwCp001EditorialReviewRemediation } from "./cp001-editorial-review-remediation";
import { applyTmwCp001EditorialFieldCleanup } from "./cp001-editorial-field-cleanup";
import { applyTmwCp002EditorialReviewRemediation } from "./cp002-editorial-review-remediation";
import { applyTmwCp003EditorialReviewRemediation } from "./cp003-editorial-review-remediation";
import { applyTmwCp003EditorialFieldCleanup } from "./cp003-editorial-field-cleanup";
import { applyTmw001CriticalLocalizedRemediationR1 } from "./critical-remediation-r1";
import { applyTmw001EditorialRemediationR2Cp001To006 } from "./editorial-remediation-r2-cp001-cp006";
import { applyTmw001LearnerExplanationR2Cp001To006 } from "./learner-explanation-r2-cp001-cp006";
import { applyTmw001EditorialRemediationR3Cp007To011 } from "./editorial-remediation-r3-cp007-cp011";
import { applyTmw001LearnerExplanationR3Cp007To011 } from "./learner-explanation-r3-cp007-cp011";
import { applyTmw001LearnerExplanationR4ExamReadiness } from "./learner-explanation-r4-exam-readiness";
import type { TmwLocalizedLanguage } from "./localization-types";

export type Tmw001ChapterLanguage = "en" | TmwLocalizedLanguage;

export interface Tmw001ChapterRequest {
  questionLanguageId: string;
  seed: string;
  language: Tmw001ChapterLanguage;
}

function qlOrdinal(questionLanguageId: string): number {
  const match = /^TMW-QL-(\d{3})$/.exec(questionLanguageId);
  if (!match) throw new Error(`Unknown TMW-001 question-language ID: ${questionLanguageId}`);
  const ordinal = Number(match[1]);
  if (!Number.isInteger(ordinal) || ordinal < 1 || ordinal > 228) {
    throw new Error(`TMW-001 question-language ID is outside the supported range: ${questionLanguageId}`);
  }
  return ordinal;
}

function finishEnglish(question: any, questionLanguageId: string): any {
  const r2Remediated = applyTmw001EditorialRemediationR2Cp001To006(question, questionLanguageId, "en");
  const r3Remediated = applyTmw001EditorialRemediationR3Cp007To011(r2Remediated, questionLanguageId, "en");
  const r2Learner = applyTmw001LearnerExplanationR2Cp001To006(r3Remediated, questionLanguageId, "en");
  const r3Learner = applyTmw001LearnerExplanationR3Cp007To011(r2Learner, questionLanguageId, "en");
  return applyTmw001LearnerExplanationR4ExamReadiness(r3Learner, questionLanguageId, "en");
}

function finishLocalized(question: any, questionLanguageId: string, language: TmwLocalizedLanguage): any {
  const wave01 = applyTmw001MultilingualStemRemediation(question, questionLanguageId, language);
  const wave02 = applyTmw001MultilingualStemRemediationWave02(wave01, questionLanguageId, language);
  const sanitized = sanitizeTmw001LocalizedPresentation(wave02);
  const naturalized = naturalizeTmw001LocalizedExplanation(sanitized, questionLanguageId, language);
  const cp001Reviewed = applyTmwCp001EditorialReviewRemediation(naturalized, questionLanguageId, language);
  const cp001Cleaned = applyTmwCp001EditorialFieldCleanup(cp001Reviewed, questionLanguageId, language);
  const cp002Reviewed = applyTmwCp002EditorialReviewRemediation(cp001Cleaned, questionLanguageId, language);
  const cp003Reviewed = applyTmwCp003EditorialReviewRemediation(cp002Reviewed, questionLanguageId, language);
  const cp003Cleaned = applyTmwCp003EditorialFieldCleanup(cp003Reviewed, questionLanguageId, language);
  const r1Remediated = applyTmw001CriticalLocalizedRemediationR1(cp003Cleaned, questionLanguageId, language);
  const r2Remediated = applyTmw001EditorialRemediationR2Cp001To006(r1Remediated, questionLanguageId, language);
  const r3Remediated = applyTmw001EditorialRemediationR3Cp007To011(r2Remediated, questionLanguageId, language);
  const r2Learner = applyTmw001LearnerExplanationR2Cp001To006(r3Remediated, questionLanguageId, language);
  const r3Learner = applyTmw001LearnerExplanationR3Cp007To011(r2Learner, questionLanguageId, language);
  return applyTmw001LearnerExplanationR4ExamReadiness(r3Learner, questionLanguageId, language);
}

export function runTmw001ChapterPipeline(input: Tmw001ChapterRequest): any {
  const ordinal = qlOrdinal(input.questionLanguageId);
  const base = { questionLanguageId: input.questionLanguageId, seed: input.seed };

  if (ordinal >= 224) {
    return runTmwCp014PresentationPipeline({ ...base, language: input.language });
  }
  if (ordinal >= 216) {
    return runTmwCp013DataSufficiencyPipeline({ ...base, language: input.language });
  }
  if (ordinal >= 212) {
    return runTmwCp012CoverageClosurePipeline({ ...base, language: input.language });
  }
  if (ordinal <= 20) {
    return input.language === "en"
      ? finishEnglish(runTmwCp001Pipeline({ ...base, language: "en" }), input.questionLanguageId)
      : finishLocalized(runTmwCp001Pipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 34) {
    return input.language === "en"
      ? finishEnglish(runTmwCp002Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp002Pipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 57) {
    return input.language === "en"
      ? finishEnglish(runTmwCp003Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp003Pipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 81) {
    return input.language === "en"
      ? finishEnglish(runTmwCp004Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp004Pipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 105) {
    return input.language === "en"
      ? finishEnglish(runTmwCp005Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp005Pipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 127) {
    return input.language === "en"
      ? finishEnglish(runTmwCp006Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp006Pipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 143) {
    return input.language === "en"
      ? finishEnglish(runTmwCp007Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp007LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 156) {
    return input.language === "en"
      ? finishEnglish(runTmwCp008Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp008LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 174) {
    return input.language === "en"
      ? finishEnglish(runTmwCp009Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp009LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal <= 192) {
    return input.language === "en"
      ? finishEnglish(runTmwCp010Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp010LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  return input.language === "en"
    ? finishEnglish(runTmwCp011Pipeline(input.questionLanguageId, input.seed), input.questionLanguageId)
    : finishLocalized(runTmwCp011LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
}
