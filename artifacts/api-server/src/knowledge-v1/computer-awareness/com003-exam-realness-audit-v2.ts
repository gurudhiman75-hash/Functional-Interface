import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V7, type Com003ExamSurfaceFamily } from "./com003-review-synthesis-v7";

function normalized(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const EXPECTED_FAMILIES: readonly Com003ExamSurfaceFamily[] = [
  "DIRECT_RECALL",
  "FUNCTIONAL_APPLICATION",
  "EXAMPLE_RECOGNITION",
  "CONTRAST_DISCRIMINATION",
];

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
  /principal purpose/i,
] as const;

const GRAMMAR_DEFECTS = [
  /\ba Excel\b/i,
  /\ba Office\b/i,
  /\bused to inserts\b/i,
  /\bused to copies\b/i,
  /\bused to cuts\b/i,
  /\bused to saves\b/i,
  /\bused to opens\b/i,
  /\bto is\b/i,
  /\bto are\b/i,
] as const;

const EMPTY_META_STEMS = [
  /^Which option correctly matches the following .* fact:/i,
  /^Identify the correct .* term for this example or description:/i,
  /^Which choice correctly represents .* in Microsoft/i,
] as const;

export function auditCom003ExamRealnessV2() {
  const blockers: string[] = [];
  const advisories: string[] = [];
  const corpus = COM003_ENGLISH_REVIEW_CORPUS_V7;

  for (const question of corpus) {
    const stem = question.stem.trim();
    const words = wordCount(stem);
    if (!stem.endsWith("?")) blockers.push(`STEM_NOT_QUESTION:${question.questionId}`);
    if (!/^[A-Z0-9“"'(]/.test(stem)) blockers.push(`STEM_NOT_CAPITALIZED:${question.questionId}`);
    if (words < 5) blockers.push(`STEM_TOO_THIN:${question.questionId}:${words}`);
    if (words > 42) blockers.push(`STEM_TOO_WORDY:${question.questionId}:${words}`);
    if (words > 30) advisories.push(`STEM_WORDY:${question.questionId}:${words}`);
    for (const pattern of GENERATOR_LANGUAGE) if (pattern.test(stem)) blockers.push(`GENERATOR_LANGUAGE:${question.questionId}:${pattern.source}`);
    for (const pattern of GRAMMAR_DEFECTS) if (pattern.test(stem) || pattern.test(question.explanation)) blockers.push(`GRAMMAR_DEFECT:${question.questionId}:${pattern.source}`);
    for (const pattern of EMPTY_META_STEMS) if (pattern.test(stem)) advisories.push(`GENERIC_META_SURFACE:${question.questionId}`);
    if (question.versionScoped && /SHORTCUT|SLIDESHOW/i.test(question.surfaceMode) && !/Windows desktop/i.test(stem)) {
      blockers.push(`VERSION_CONTEXT_MISSING:${question.questionId}`);
    }
    if (question.stemAuthority !== "COM003_V7_EXAM_SURFACE_FAMILY_AUTHORITY") blockers.push(`WRONG_STEM_AUTHORITY:${question.questionId}`);
  }

  const duplicateMap = new Map<string, string[]>();
  for (const question of corpus) {
    const key = normalized(question.stem);
    duplicateMap.set(key, [...(duplicateMap.get(key) ?? []), question.questionId]);
  }
  const duplicates = [...duplicateMap.values()].filter((ids) => ids.length > 1);
  if (duplicates.length) blockers.push(`DUPLICATE_STEMS:${duplicates.reduce((n, ids) => n + ids.length - 1, 0)}`);

  const coverage = COM003_PERMANENT_QLS.map((ql) => {
    const questions = corpus.filter((q) => q.qlId === ql.qlId);
    const familyCounts = Object.fromEntries(EXPECTED_FAMILIES.map((family) => [family, questions.filter((q) => q.examSurfaceFamily === family).length])) as Record<Com003ExamSurfaceFamily, number>;
    if (questions.length !== 12) blockers.push(`QL_COUNT:${ql.qlId}:${questions.length}`);
    for (const family of EXPECTED_FAMILIES) {
      if (familyCounts[family] !== 3) blockers.push(`FAMILY_COUNT:${ql.qlId}:${family}:${familyCounts[family]}`);
    }
    const unique = new Set(questions.map((q) => normalized(q.stem))).size;
    if (unique !== questions.length) blockers.push(`QL_STEM_NOT_FULLY_UNIQUE:${ql.qlId}:${unique}`);
    return { qlId: ql.qlId, questionCount: questions.length, uniqueStemCount: unique, familyCounts };
  });

  const genericMetaCount = advisories.filter((value) => value.startsWith("GENERIC_META_SURFACE:")).length;
  if (genericMetaCount > 18) blockers.push(`GENERIC_META_SURFACE_EXCESS:${genericMetaCount}`);

  return {
    valid: blockers.length === 0,
    questionCount: corpus.length,
    qlCount: coverage.length,
    expectedFamilies: EXPECTED_FAMILIES,
    coverage,
    blockerCount: blockers.length,
    advisoryCount: advisories.length,
    blockers,
    advisories,
    status: blockers.length === 0 ? "DEEP_EXAM_SURFACE_REVIEW_CANDIDATE" as const : "DEEP_EXAM_SURFACE_REMEDIATION_REQUIRED" as const,
    contentFrozen: false,
    localizationFrozen: false,
    questionStudioReplacementAuthorized: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

export const COM003_EXAM_REALNESS_AUDIT_V2 = auditCom003ExamRealnessV2();
