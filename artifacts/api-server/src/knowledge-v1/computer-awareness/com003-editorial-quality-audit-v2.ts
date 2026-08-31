import { COM003_ENGLISH_REVIEW_CORPUS_V3 } from "./com003-review-synthesis-v3";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";

function normalized(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function words(value: string) {
  return normalized(value).replace(/[^a-z0-9+$.-]+/g, " ").trim().split(/\s+/).filter(Boolean);
}

function startsWithFamily(value: string) {
  return words(value).slice(0, 4).join(" ");
}

function answerLeakedIntoStem(stem: string, answer: string) {
  const canonical = normalized(answer);
  if (canonical.length < 3) return false;
  const haystack = ` ${normalized(stem).replace(/[^a-z0-9+$.-]+/g, " ")} `;
  const needle = ` ${canonical.replace(/[^a-z0-9+$.-]+/g, " ")} `;
  return haystack.includes(needle);
}

function isExamRealStem(stem: string) {
  const trimmed = stem.trim();
  if (trimmed.endsWith("?")) return true;
  return /(?:^|,\s)(?:identify|select|choose)\b.*\.$/i.test(trimmed);
}

export function auditCom003EditorialQualityV2() {
  const blockers: string[] = [];
  const advisories: string[] = [];
  const corpus = COM003_ENGLISH_REVIEW_CORPUS_V3;

  for (const question of corpus) {
    const stemLength = question.stem.length;
    const explanationLength = question.explanation.length;
    if (stemLength < 20) blockers.push(`STEM_TOO_SHORT:${question.questionId}:${stemLength}`);
    if (stemLength > 280) blockers.push(`STEM_TOO_LONG:${question.questionId}:${stemLength}`);
    if (!isExamRealStem(question.stem)) blockers.push(`STEM_NOT_EXAM_REAL:${question.questionId}`);
    if (/[.?!]{2,}$/.test(question.stem)) blockers.push(`STEM_PUNCTUATION:${question.questionId}`);
    if (explanationLength < 18) blockers.push(`EXPLANATION_TOO_SHORT:${question.questionId}:${explanationLength}`);
    if (explanationLength > 360) blockers.push(`EXPLANATION_TOO_LONG:${question.questionId}:${explanationLength}`);
    if (normalized(question.explanation) === normalized(question.stem)) blockers.push(`EXPLANATION_REPEATS_STEM:${question.questionId}`);
    if (!normalized(question.explanation).includes(normalized(question.canonicalAnswer))) blockers.push(`EXPLANATION_OMITS_ANSWER:${question.questionId}`);
    if (answerLeakedIntoStem(question.stem, question.canonicalAnswer)) blockers.push(`ANSWER_LEAK_IN_STEM:${question.questionId}`);
    if (/all of the above|none of the above/i.test(question.stem)) blockers.push(`META_CUE_IN_STEM:${question.questionId}`);
    if (/obviously|clearly the|easy to see|as everyone knows/i.test(question.explanation)) blockers.push(`EDITORIAL_CUE:${question.questionId}`);

    const optionLengths = question.options.map((option) => option.trim().length);
    const max = Math.max(...optionLengths);
    const min = Math.min(...optionLengths);
    if (max > 180) blockers.push(`OPTION_TOO_LONG:${question.questionId}:${max}`);
    if (max - min > 115) advisories.push(`OPTION_LENGTH_IMBALANCE:${question.questionId}:${min}-${max}`);
  }

  const coverage = COM003_PERMANENT_QLS.map((ql) => {
    const questions = corpus.filter((question) => question.qlId === ql.qlId);
    const stems = new Set(questions.map((question) => normalized(question.stem)));
    const leadFamilies = new Set(questions.map((question) => startsWithFamily(question.stem)));
    const explanations = new Set(questions.map((question) => normalized(question.explanation)));
    const targetFacts = new Set(questions.map((question) => question.targetFactId));
    const answerPositions = [0, 1, 2, 3].map((position) => questions.filter((question) => question.correctIndex === position).length);
    const modes = new Set(questions.map((question) => question.surfaceMode));

    if (stems.size < 8) blockers.push(`LOW_STEM_DIVERSITY:${ql.qlId}:${stems.size}`);
    if (leadFamilies.size < 3) blockers.push(`LOW_STEM_FAMILY_DIVERSITY:${ql.qlId}:${leadFamilies.size}`);
    if (answerPositions.some((count) => count === 0)) blockers.push(`ANSWER_POSITION_MISSING:${ql.qlId}:${answerPositions.join("/")}`);
    if (Math.max(...answerPositions) >= 7) advisories.push(`ANSWER_POSITION_SKEW:${ql.qlId}:${answerPositions.join("/")}`);
    if (explanations.size < Math.min(6, questions.length / 2)) advisories.push(`LOW_EXPLANATION_DIVERSITY:${ql.qlId}:${explanations.size}`);
    if (targetFacts.size < 2) advisories.push(`LOW_TARGET_FACT_DIVERSITY:${ql.qlId}:${targetFacts.size}`);

    return {
      qlId: ql.qlId,
      questionCount: questions.length,
      uniqueStemCount: stems.size,
      stemFamilyCount: leadFamilies.size,
      uniqueExplanationCount: explanations.size,
      targetFactCount: targetFacts.size,
      answerPositions,
      surfaceModes: [...modes].sort(),
    };
  });

  const globalPositions = [0, 1, 2, 3].map((position) => corpus.filter((question) => question.correctIndex === position).length);
  if (globalPositions.some((count) => count < 40 || count > 75)) blockers.push(`GLOBAL_ANSWER_POSITION_SKEW:${globalPositions.join("/")}`);

  const stemGroups = new Map<string, string[]>();
  for (const question of corpus) {
    const key = normalized(question.stem);
    const ids = stemGroups.get(key) ?? [];
    ids.push(question.questionId);
    stemGroups.set(key, ids);
  }
  const duplicateStemGroups = [...stemGroups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([stem, ids]) => ({ stem, questionIds: ids }));
  if (duplicateStemGroups.length) blockers.push(`DUPLICATE_STEMS_GLOBAL:${duplicateStemGroups.reduce((sum, group) => sum + group.questionIds.length - 1, 0)}`);

  return {
    valid: blockers.length === 0,
    questionCount: corpus.length,
    qlCount: coverage.length,
    coverage,
    globalAnswerPositions: globalPositions,
    duplicateStemGroups,
    blockerCount: blockers.length,
    advisoryCount: advisories.length,
    blockers,
    advisories,
    status: blockers.length === 0 ? "EDITORIAL_AUDIT_PASS_WITH_ADVISORIES" as const : "EDITORIAL_REMEDIATION_REQUIRED" as const,
    contentFrozen: false,
    runtimeRegistered: false,
    productionReleased: false,
  };
}
