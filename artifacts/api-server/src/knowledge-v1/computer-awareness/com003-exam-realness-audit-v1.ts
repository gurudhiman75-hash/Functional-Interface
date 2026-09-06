import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V6 } from "./com003-review-synthesis-v6";

function normalized(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const GENERATOR_LANGUAGE = [
  /for office productivity software/i,
  /within a desktop office suite/i,
  /for spreadsheet structure and references/i,
  /for common office commands/i,
  /which windows desktop office shortcut corresponds to this action/i,
  /in the stated office (?:desktop )?context/i,
  /in the stated office environment/i,
  /principal task:/i,
  /select the operator used for/i,
  /correctly states the function of/i,
] as const;

const GRAMMAR_DEFECTS = [
  /\ba Excel\b/i,
  /\ba Office\b/i,
  /\bused to inserts\b/i,
  /\bused to copies\b/i,
  /\bused to cuts\b/i,
  /\bused to saves\b/i,
  /\bused to opens\b/i,
] as const;

export function auditCom003ExamRealnessV1() {
  const blockers: string[] = [];
  const advisories: string[] = [];
  const corpus = COM003_ENGLISH_REVIEW_CORPUS_V6;

  for (const question of corpus) {
    const stem = question.stem.trim();
    if (!stem.endsWith("?")) blockers.push(`STEM_NOT_QUESTION:${question.questionId}`);
    if (!/^[A-Z0-9“"'(]/.test(stem)) blockers.push(`STEM_NOT_CAPITALIZED:${question.questionId}`);
    const count = wordCount(stem);
    if (count > 42) blockers.push(`STEM_TOO_WORDY:${question.questionId}:${count}`);
    if (count > 30) advisories.push(`STEM_WORDY:${question.questionId}:${count}`);
    for (const pattern of GENERATOR_LANGUAGE) {
      if (pattern.test(stem)) blockers.push(`GENERATOR_LANGUAGE:${question.questionId}:${pattern.source}`);
    }
    for (const pattern of GRAMMAR_DEFECTS) {
      if (pattern.test(stem) || pattern.test(question.explanation)) {
        blockers.push(`GRAMMAR_DEFECT:${question.questionId}:${pattern.source}`);
      }
    }
    if (question.versionScoped && /SHORTCUT|SLIDESHOW/i.test(question.surfaceMode) && !/Windows desktop/i.test(stem)) {
      blockers.push(`VERSION_CONTEXT_MISSING:${question.questionId}`);
    }
  }

  const duplicateStems = new Map<string, string[]>();
  for (const question of corpus) {
    const key = normalized(question.stem);
    const ids = duplicateStems.get(key) ?? [];
    ids.push(question.questionId);
    duplicateStems.set(key, ids);
  }
  const duplicateGroups = [...duplicateStems.entries()].filter(([, ids]) => ids.length > 1);
  if (duplicateGroups.length) {
    blockers.push(`DUPLICATE_STEMS:${duplicateGroups.reduce((total, [, ids]) => total + ids.length - 1, 0)}`);
  }

  const coverage = COM003_PERMANENT_QLS.map((ql) => {
    const questions = corpus.filter((question) => question.qlId === ql.qlId);
    const uniqueStems = new Set(questions.map((question) => normalized(question.stem)));
    if (questions.length !== 12) blockers.push(`QL_COUNT:${ql.qlId}:${questions.length}`);
    if (uniqueStems.size < 8) blockers.push(`QL_STEM_DIVERSITY:${ql.qlId}:${uniqueStems.size}`);
    return {
      qlId: ql.qlId,
      questionCount: questions.length,
      uniqueStemCount: uniqueStems.size,
      surfaceModes: [...new Set(questions.map((question) => question.surfaceMode))].sort(),
    };
  });

  return {
    valid: blockers.length === 0,
    questionCount: corpus.length,
    qlCount: coverage.length,
    coverage,
    blockerCount: blockers.length,
    advisoryCount: advisories.length,
    blockers,
    advisories,
    status: blockers.length === 0 ? "EXAM_REALNESS_REVIEW_CANDIDATE" as const : "EXAM_REALNESS_REMEDIATION_REQUIRED" as const,
    priorV4ProductReview: "REJECTED_STEMS_NOT_EXAM_LEVEL" as const,
    priorV5TechnicalReview: "REJECTED_DUPLICATE_STEMS" as const,
    contentFrozen: false,
    localizationFrozen: false,
    questionStudioReplacementAuthorized: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

export const COM003_EXAM_REALNESS_AUDIT_V1 = auditCom003ExamRealnessV1();
