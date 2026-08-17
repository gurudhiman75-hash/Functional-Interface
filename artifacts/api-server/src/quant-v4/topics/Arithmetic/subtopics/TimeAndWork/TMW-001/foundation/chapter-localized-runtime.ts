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
import { polishTmw001ExtensionQuestion } from "./final-extension-presentation-polish";
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
import { applyTmwCp005EditorialReviewRemediation } from "./cp005-editorial-review-remediation";
import { applyTmwCp005StartingAgentEditorialFix } from "./cp005-starting-agent-editorial-fix";
import { applyTmwCp005InverseEditorialFix, applyTmwCp005RemainingWorkEditorialFix } from "./cp005-inverse-editorial-fix";
import { applyTmwCp006MultilingualEditorialReview } from "./cp006-multilingual-editorial-review-remediation";
import { polishTmwCp006EditorialReview } from "./cp006-editorial-final-polish";
import { applyTmwCp007MultilingualEditorialReview } from "./cp007-multilingual-editorial-review-remediation";
import { polishTmwCp007EditorialReview } from "./cp007-editorial-final-polish";
import { finalizeTmwCp007EditorialValidation } from "./cp007-editorial-validation-finalizer";
import { finalizeTmwCp008MultilingualEditorialReview } from "./cp008-multilingual-editorial-review-finalizer";
import { polishTmwCp008VisibleGivens } from "./cp008-visible-givens-final-polish";
import { finalizeTmwCp009MultilingualEditorialReview } from "./cp009-multilingual-editorial-review-finalizer";
import { finalizeTmwCp010MultilingualEditorialReview } from "./cp010-multilingual-editorial-review-finalizer";
import { polishTmwCp010EditorialReview } from "./cp010-editorial-final-polish";
import { finalizeTmwCp010CorpusCleanup } from "./cp010-corpus-cleanup-finalizer";
import { finalizeTmwCp011CorpusReview } from "./cp011-corpus-review-finalizer";
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

function finishCp007(question: any, questionLanguageId: string, language: Tmw001ChapterLanguage): any {
  const reviewed = applyTmwCp007MultilingualEditorialReview(question, questionLanguageId, language);
  const polished = polishTmwCp007EditorialReview(reviewed, questionLanguageId, language);
  return finalizeTmwCp007EditorialValidation(polished, language);
}

function finishCp008(question: any, language: Tmw001ChapterLanguage): any {
  return polishTmwCp008VisibleGivens(finalizeTmwCp008MultilingualEditorialReview(question, language), language);
}

function finishCp009(question: any, language: Tmw001ChapterLanguage): any {
  return finalizeTmwCp009MultilingualEditorialReview(question, language);
}

function translateCp010CycleLabel(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/Dual-pump/gi, "दो-पंप")
      .replace(/Single-pump/gi, "एक-पंप")
      .replace(/Pump-on/gi, "पंप-चालू")
      .replace(/Pump-off/gi, "पंप-बंद")
      .replace(/Recovery inlet/gi, "पुनः भराव")
      .replace(/Fast inlet/gi, "तेज़ भराव")
      .replace(/Slow inlet/gi, "धीमा भराव")
      .replace(/Inlet ([A-Z])/gi, "भराव पाइप $1")
      .replace(/Outlet ([A-Z])/gi, "निकासी पाइप $1")
      .replace(/Drainage/gi, "निकासी")
      .replace(/Drain/gi, "निकासी")
      .replace(/Inlet/gi, "भराव")
      .replace(/Outlet/gi, "निकासी")
      .replace(/interval/gi, "अंतराल")
      .replace(/shift/gi, "पाली")
      .replace(/hour/gi, "घंटा")
      .replace(/check/gi, "जाँच");
  }
  return value
    .replace(/Dual-pump/gi, "ਦੋ-ਪੰਪ")
    .replace(/Single-pump/gi, "ਇੱਕ-ਪੰਪ")
    .replace(/Pump-on/gi, "ਪੰਪ-ਚਾਲੂ")
    .replace(/Pump-off/gi, "ਪੰਪ-ਬੰਦ")
    .replace(/Recovery inlet/gi, "ਮੁੜ ਭਰਾਵ")
    .replace(/Fast inlet/gi, "ਤੇਜ਼ ਭਰਾਵ")
    .replace(/Slow inlet/gi, "ਹੌਲਾ ਭਰਾਵ")
    .replace(/Inlet ([A-Z])/gi, "ਭਰਾਵ ਪਾਈਪ $1")
    .replace(/Outlet ([A-Z])/gi, "ਨਿਕਾਸੀ ਪਾਈਪ $1")
    .replace(/Drainage/gi, "ਨਿਕਾਸੀ")
    .replace(/Drain/gi, "ਨਿਕਾਸੀ")
    .replace(/Inlet/gi, "ਭਰਾਵ")
    .replace(/Outlet/gi, "ਨਿਕਾਸੀ")
    .replace(/interval/gi, "ਅੰਤਰਾਲ")
    .replace(/shift/gi, "ਵਾਰੀ")
    .replace(/hour/gi, "ਘੰਟਾ")
    .replace(/check/gi, "ਜਾਂਚ");
}

function normalizeCp010CycleLabels(question: any, language: Tmw001ChapterLanguage): any {
  if (language === "en" || question?.canonicalProblemId !== "TMW-CP-010") return question;
  const mapLine = (line: string): string => translateCp010CycleLabel(line, language);
  const learner = question.learnerExplanation
    ? { ...question.learnerExplanation, solution: question.learnerExplanation.solution.map(mapLine) }
    : question.learnerExplanation;
  const explanation = question.explanation
    ? { ...question.explanation, steps: question.explanation.steps.map(mapLine) }
    : question.explanation;
  return { ...question, learnerExplanation: learner, explanation };
}

function normalizeCp010HourAgreement(question: any, language: Tmw001ChapterLanguage): any {
  if (question?.canonicalProblemId !== "TMW-CP-010") return question;
  const mapLine = (line: string): string => {
    if (language === "en") return line.replace(/(=1\\\)|\\\(1\\\)) hours/g, "$1 hour");
    if (language === "hi") return line.replace(/(=1\\\)|\\\(1\\\)) घंटे/gu, "$1 घंटा");
    return line.replace(/(=1\\\)|\\\(1\\\)) ਘੰਟੇ/gu, "$1 ਘੰਟਾ");
  };
  const learner = question.learnerExplanation
    ? { ...question.learnerExplanation, solution: question.learnerExplanation.solution.map(mapLine) }
    : question.learnerExplanation;
  const explanation = question.explanation
    ? { ...question.explanation, steps: question.explanation.steps.map(mapLine) }
    : question.explanation;
  return { ...question, learnerExplanation: learner, explanation };
}

function finishCp010(question: any, language: Tmw001ChapterLanguage): any {
  const reviewed = finalizeTmwCp010MultilingualEditorialReview(question, language);
  const polished = polishTmwCp010EditorialReview(reviewed, language);
  const cleaned = finalizeTmwCp010CorpusCleanup(polished, language);
  const cycleNormalized = normalizeCp010CycleLabels(cleaned, language);
  return normalizeCp010HourAgreement(cycleNormalized, language);
}

function finishCp011(question: any, questionLanguageId: string, language: Tmw001ChapterLanguage): any {
  return finalizeTmwCp011CorpusReview(question, questionLanguageId, language);
}

function finishEnglish(question: any, questionLanguageId: string): any {
  const r2Remediated = applyTmw001EditorialRemediationR2Cp001To006(question, questionLanguageId, "en");
  const r3Remediated = applyTmw001EditorialRemediationR3Cp007To011(r2Remediated, questionLanguageId, "en");
  const r2Learner = applyTmw001LearnerExplanationR2Cp001To006(r3Remediated, questionLanguageId, "en");
  const r3Learner = applyTmw001LearnerExplanationR3Cp007To011(r2Learner, questionLanguageId, "en");
  const r4Learner = applyTmw001LearnerExplanationR4ExamReadiness(r3Learner, questionLanguageId, "en");
  const cp005Reviewed = applyTmwCp005EditorialReviewRemediation(r4Learner, questionLanguageId, "en");
  const cp005StartFixed = applyTmwCp005StartingAgentEditorialFix(cp005Reviewed, questionLanguageId, "en");
  const cp005InverseFixed = applyTmwCp005InverseEditorialFix(cp005StartFixed, questionLanguageId, "en");
  const cp005RemainingFixed = applyTmwCp005RemainingWorkEditorialFix(cp005InverseFixed, questionLanguageId, "en");
  const cp006Reviewed = applyTmwCp006MultilingualEditorialReview(cp005RemainingFixed, questionLanguageId, "en");
  const cp006Polished = polishTmwCp006EditorialReview(cp006Reviewed, questionLanguageId, "en");
  return finishCp007(cp006Polished, questionLanguageId, "en");
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
  const r4Learner = applyTmw001LearnerExplanationR4ExamReadiness(r3Learner, questionLanguageId, language);
  const cp005Reviewed = applyTmwCp005EditorialReviewRemediation(r4Learner, questionLanguageId, language);
  const cp005StartFixed = applyTmwCp005StartingAgentEditorialFix(cp005Reviewed, questionLanguageId, language);
  const cp005InverseFixed = applyTmwCp005InverseEditorialFix(cp005StartFixed, questionLanguageId, language);
  const cp005RemainingFixed = applyTmwCp005RemainingWorkEditorialFix(cp005InverseFixed, questionLanguageId, language);
  const cp006Reviewed = applyTmwCp006MultilingualEditorialReview(cp005RemainingFixed, questionLanguageId, language);
  const cp006Polished = polishTmwCp006EditorialReview(cp006Reviewed, questionLanguageId, language);
  return finishCp007(cp006Polished, questionLanguageId, language);
}

export function runTmw001ChapterPipeline(input: Tmw001ChapterRequest): any {
  const ordinal = qlOrdinal(input.questionLanguageId);
  const base = { questionLanguageId: input.questionLanguageId, seed: input.seed };

  if (ordinal >= 224) {
    return polishTmw001ExtensionQuestion(runTmwCp014PresentationPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  }
  if (ordinal >= 216) return runTmwCp013DataSufficiencyPipeline({ ...base, language: input.language });
  if (ordinal >= 212) {
    return polishTmw001ExtensionQuestion(runTmwCp012CoverageClosurePipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
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
    const question = input.language === "en"
      ? finishEnglish(runTmwCp008Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp008LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
    return finishCp008(question, input.language);
  }
  if (ordinal <= 174) {
    const question = input.language === "en"
      ? finishEnglish(runTmwCp009Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp009LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
    return finishCp009(question, input.language);
  }
  if (ordinal <= 192) {
    const question = input.language === "en"
      ? finishEnglish(runTmwCp010Pipeline(base), input.questionLanguageId)
      : finishLocalized(runTmwCp010LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
    return finishCp010(question, input.language);
  }
  const question = input.language === "en"
    ? finishEnglish(runTmwCp011Pipeline(input.questionLanguageId, input.seed), input.questionLanguageId)
    : finishLocalized(runTmwCp011LocalizedPipeline({ ...base, language: input.language }), input.questionLanguageId, input.language);
  return finishCp011(question, input.questionLanguageId, input.language);
}
