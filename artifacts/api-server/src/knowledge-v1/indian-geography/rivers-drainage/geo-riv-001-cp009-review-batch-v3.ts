import { GEO_RIV_001_CP009_REVIEW_BATCH_V2, auditGeoRiv001Cp009ReviewBatchV2 } from "./geo-riv-001-cp009-review-batch-v2";
import { toGeoRiv001Cp009ReviewV3 } from "./geo-riv-001-cp009-review-generator-v3";
import {
  auditGeoRiv001Cp009ScopeV1,
  geoRiv001Cp009CourseStatesForRiver,
  geoRiv001Cp009IsCourseState,
} from "./geo-riv-001-cp009-scope";
import type { GeoRiv001Cp009ReviewQuestion } from "./geo-riv-001-cp009-review-types";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(74 + index).padStart(3, "0")}`);

export const GEO_RIV_001_CP009_REVIEW_BATCH_V3 = Object.freeze(
  GEO_RIV_001_CP009_REVIEW_BATCH_V2.map((question) => Object.freeze(toGeoRiv001Cp009ReviewV3(question))),
);

function sameArray(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function parsePair(pair: string) {
  const [river = "", state = ""] = pair.split(" — ").map((part) => part.trim());
  return { river, state };
}

function statementClaims(stem: string) {
  return [...stem.matchAll(/(?:I{1,2}|\d+)\. The (.+?) flows through (.+?)\./g)].map((match) => ({ river: match[1], state: match[2] }));
}

function expectedTwoStatementAnswer(truth: readonly boolean[]) {
  if (truth[0] && truth[1]) return "Both I and II are correct";
  if (truth[0]) return "Only I is correct";
  if (truth[1]) return "Only II is correct";
  return "Neither I nor II is correct";
}

function expectedCountAnswer(count: number) {
  return ["None", "One", "Two", "Three"][count] ?? "";
}

function semanticTruthAudit(question: GeoRiv001Cp009ReviewQuestion, issues: string[]) {
  if (question.qlId === "GEO-RIV-001-QL-074") {
    const river = question.stem.match(/^Which of the following states does the (.+?) flow through\?$/)?.[1] ?? "";
    const truth = question.options.map((state) => geoRiv001Cp009IsCourseState(river, state));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL074_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-075") {
    const state = question.stem.match(/^Which of the following rivers flows through (.+?)\?$/)?.[1] ?? "";
    const truth = question.options.map((river) => geoRiv001Cp009IsCourseState(river, state));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL075_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-077") {
    const listed = question.stem.match(/^Which river's course in India passes through only the following states: (.+?)\?$/)?.[1]
      ?.split(", ").sort() ?? [];
    const expected = [...geoRiv001Cp009CourseStatesForRiver(question.canonicalAnswer)].sort();
    if (!sameArray(listed, expected)) issues.push(`QL077_EXHAUSTIVE_SET:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-078" || question.qlId === "GEO-RIV-001-QL-079") {
    const truth = question.options.map((pair) => {
      const { river, state } = parsePair(pair);
      return geoRiv001Cp009IsCourseState(river, state);
    });
    const expectedTrue = question.qlId === "GEO-RIV-001-QL-078" ? 1 : 3;
    if (truth.filter(Boolean).length !== expectedTrue) issues.push(`${question.qlId.endsWith("078") ? "QL078" : "QL079"}_TRUTH_COUNT:${question.questionId}`);
    if (question.qlId === "GEO-RIV-001-QL-078" && !truth[question.correctIndex]) issues.push(`QL078_ANSWER_TRUTH:${question.questionId}`);
    if (question.qlId === "GEO-RIV-001-QL-079" && truth[question.correctIndex]) issues.push(`QL079_ANSWER_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-080") {
    const match = question.stem.match(/^Which river flows through both (.+?) and (.+?)\?$/);
    const first = match?.[1] ?? "";
    const second = match?.[2] ?? "";
    const truth = question.options.map((river) => geoRiv001Cp009IsCourseState(river, first) && geoRiv001Cp009IsCourseState(river, second));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL080_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-081") {
    const claims = statementClaims(question.stem);
    if (claims.length !== 2) {
      issues.push(`QL081_PARSE:${question.questionId}`);
    } else {
      const truth = claims.map((claim) => geoRiv001Cp009IsCourseState(claim.river, claim.state));
      if (question.canonicalAnswer !== expectedTwoStatementAnswer(truth)) issues.push(`QL081_ANSWER:${question.questionId}`);
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-082") {
    const claims = statementClaims(question.stem);
    if (claims.length !== 3) {
      issues.push(`QL082_PARSE:${question.questionId}`);
    } else {
      const count = claims.filter((claim) => geoRiv001Cp009IsCourseState(claim.river, claim.state)).length;
      if (question.canonicalAnswer !== expectedCountAnswer(count)) issues.push(`QL082_ANSWER:${question.questionId}`);
    }
  }
}

export function auditGeoRiv001Cp009ReviewBatchV3() {
  const issues: string[] = [];
  const v2Audit = auditGeoRiv001Cp009ReviewBatchV2();
  const scopeAudit = auditGeoRiv001Cp009ScopeV1();
  if (!v2Audit.valid) issues.push(...v2Audit.issues.map((issue) => `V2_BASELINE:${issue}`));
  if (!scopeAudit.valid) issues.push(...scopeAudit.issues.map((issue) => `SCOPE:${issue}`));

  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

  GEO_RIV_001_CP009_REVIEW_BATCH_V3.forEach((question, index) => {
    const baseline = GEO_RIV_001_CP009_REVIEW_BATCH_V2[index];
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (!question.questionId.includes("CP009-V3")) issues.push(`QUESTION_ID_VERSION:${question.questionId}`);
    if (question.stem !== baseline.stem) issues.push(`STEM_DRIFT:${question.questionId}`);
    if (!sameArray(question.options, baseline.options)) issues.push(`OPTION_DRIFT:${question.questionId}`);
    if (question.correctIndex !== baseline.correctIndex) issues.push(`CORRECT_INDEX_DRIFT:${question.questionId}`);
    if (question.canonicalAnswer !== baseline.canonicalAnswer) issues.push(`ANSWER_DRIFT:${question.questionId}`);
    if (question.difficulty !== baseline.difficulty) issues.push(`DIFFICULTY_DRIFT:${question.questionId}`);
    if (question.solverAuthority !== baseline.solverAuthority) issues.push(`SOLVER_AUTHORITY_DRIFT:${question.questionId}`);
    if (!sameArray(question.sourceIds, baseline.sourceIds)) issues.push(`SOURCE_ID_DRIFT:${question.questionId}`);
    if (!sameArray(question.sourceFactIds, baseline.sourceFactIds)) issues.push(`SOURCE_FACT_DRIFT:${question.questionId}`);
    if (!sameArray(question.upstreamFactIds, baseline.upstreamFactIds)) issues.push(`UPSTREAM_FACT_DRIFT:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_ALIGNMENT:${question.questionId}`);
    if (question.explanation.length < 95) issues.push(`THIN_EXPLANATION:${question.questionId}:${question.explanation.length}`);
    if (/CP009|V[123]|reviewed|sourceFact|state set|associated with|linked with|exam trap|shortcut|Therefore,/i.test(question.explanation)) issues.push(`INTERNAL_OR_MACHINE_LANGUAGE:${question.questionId}`);
    semanticTruthAudit(question, issues);
  });

  if (GEO_RIV_001_CP009_REVIEW_BATCH_V3.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP009_REVIEW_BATCH_V3.length}`);
  for (const qlId of QLS) if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY_COUNTS:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_RIV_001_CP009_REVIEW_BATCH_V3.length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    scopeAudit,
    baselineAuditValid: v2Audit.valid,
    answerMatrixPreserved: !issues.some((issue) => /(?:OPTION|CORRECT_INDEX|ANSWER)_DRIFT/.test(issue)),
  });
}
