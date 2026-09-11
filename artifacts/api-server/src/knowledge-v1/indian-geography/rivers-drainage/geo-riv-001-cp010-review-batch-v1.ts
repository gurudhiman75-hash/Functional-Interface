import { GEO_RIV_001_CP010_PROJECT_ROWS_V1 } from "./geo-riv-001-cp010-facts";
import { generateGeoRiv001Cp010ReviewV1, GEO_RIV_001_CP010_QL_IDS_V1 } from "./geo-riv-001-cp010-review-generator-v1";
import type { GeoRiv001Cp010ReviewQuestion } from "./geo-riv-001-cp010-review-types";
import { auditGeoRiv001Cp010SourceAuthorities } from "./geo-riv-001-cp010-source-authorities";

const ROWS = GEO_RIV_001_CP010_PROJECT_ROWS_V1;

function rawRiver(value: string) {
  return value.replace(/^River\s+/, "");
}

function rowForProject(project: string) {
  return ROWS.find((row) => row.project === project);
}

function parsePair(value: string) {
  const [left = "", right = ""] = value.split(" — ").map((part) => part.trim());
  return { left, right };
}

function projectRiverTrue(project: string, riverDisplay: string) {
  return rowForProject(project)?.river === rawRiver(riverDisplay);
}

function projectStateTrue(project: string, state: string) {
  return rowForProject(project)?.states.includes(state) ?? false;
}

function projectReservoirTrue(project: string, reservoir: string) {
  return rowForProject(project)?.reservoir === reservoir;
}

function reservoirProjectTrue(reservoir: string, project: string) {
  return ROWS.some((row) => row.reservoir === reservoir && row.project === project);
}

function forceAnswerPosition(question: GeoRiv001Cp010ReviewQuestion, targetIndex: number): GeoRiv001Cp010ReviewQuestion {
  const answer = question.canonicalAnswer;
  const others = question.options.filter((_, index) => index !== question.correctIndex);
  const options = [...others];
  options.splice(targetIndex, 0, answer);
  return { ...question, options, correctIndex: targetIndex };
}

const generated: GeoRiv001Cp010ReviewQuestion[] = [];
for (const qlId of GEO_RIV_001_CP010_QL_IDS_V1) {
  for (let index = 1; index <= 6; index += 1) {
    generated.push(generateGeoRiv001Cp010ReviewV1(qlId, `review-${qlId}-${String(index).padStart(2, "0")}`));
  }
}

export const GEO_RIV_001_CP010_REVIEW_BATCH_V1 = Object.freeze(
  generated.map((question, index) => Object.freeze(forceAnswerPosition(question, index % 4))),
);

function evaluateClaim(text: string): boolean | null {
  const river = text.match(/^(.+?) is built on (River .+?)\.$/);
  if (river) return projectRiverTrue(river[1], river[2]);
  const state = text.match(/^(.+?) is located in (.+?)\.$/);
  if (state) return projectStateTrue(state[1], state[2]);
  const reservoir = text.match(/^(.+?) is associated with (.+?)\.$/);
  if (reservoir) return projectReservoirTrue(reservoir[1], reservoir[2]);
  return null;
}

function statementLines(stem: string) {
  return stem.split("\n")
    .map((line) => line.replace(/^(?:I{1,2}|\d+)\.\s*/, "").trim())
    .filter((line) => / is (?:built on|located in|associated with) /.test(line));
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

function semanticAudit(question: GeoRiv001Cp010ReviewQuestion, issues: string[]) {
  if (question.qlId === "GEO-RIV-001-QL-083") {
    const project = question.stem.match(/^On which of the following rivers is (.+?) built\?$/)?.[1] ?? "";
    const truth = question.options.map((option) => projectRiverTrue(project, option));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL083_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-084") {
    const river = question.stem.match(/^Which of the following dams\/projects is built on (River .+?)\?$/)?.[1] ?? "";
    const truth = question.options.map((project) => projectRiverTrue(project, river));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL084_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-085") {
    const project = question.stem.match(/^(.+?) is located in which of the following states\?$/)?.[1] ?? "";
    const truth = question.options.map((state) => projectStateTrue(project, state));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL085_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-086") {
    const project = question.stem.match(/^Which reservoir is associated with (.+?)\?$/)?.[1] ?? "";
    const truth = question.options.map((reservoir) => projectReservoirTrue(project, reservoir));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL086_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-087") {
    const reservoir = question.stem.match(/^(.+?) is associated with which of the following dams\/projects\?$/)?.[1] ?? "";
    const truth = question.options.map((project) => reservoirProjectTrue(reservoir, project));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL087_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-088") {
    const truth = question.options.map((option) => {
      const { left, right } = parsePair(option);
      return projectRiverTrue(left, right);
    });
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL088_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-089") {
    const truth = question.options.map((option) => {
      const { left, right } = parsePair(option);
      return projectStateTrue(left, right);
    });
    if (truth.filter(Boolean).length !== 3 || truth[question.correctIndex]) issues.push(`QL089_TRUTH:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-090") {
    const claims = statementLines(question.stem);
    const truth = claims.map(evaluateClaim);
    if (truth.length !== 2 || truth.some((value) => value === null)) issues.push(`QL090_PARSE:${question.questionId}`);
    else if (question.canonicalAnswer !== expectedTwoStatementAnswer(truth as boolean[])) issues.push(`QL090_ANSWER:${question.questionId}`);
  }

  if (question.qlId === "GEO-RIV-001-QL-091") {
    const claims = statementLines(question.stem);
    const truth = claims.map(evaluateClaim);
    if (truth.length !== 3 || truth.some((value) => value === null)) issues.push(`QL091_PARSE:${question.questionId}`);
    else {
      const count = (truth as boolean[]).filter(Boolean).length;
      if (question.canonicalAnswer !== expectedCountAnswer(count)) issues.push(`QL091_ANSWER:${question.questionId}`);
    }
  }
}

function hasBareRiverReference(text: string) {
  for (const river of ROWS.map((row) => row.river)) {
    const escaped = river.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?<!River )\\b${escaped}\\b(?!\\s+(?:Dam|Reservoir|Project|Sagar))`);
    if (pattern.test(text)) return true;
  }
  return false;
}

export function auditGeoRiv001Cp010ReviewBatchV1() {
  const issues: string[] = [];
  const sourceAudit = auditGeoRiv001Cp010SourceAuthorities();
  if (!sourceAudit.valid) issues.push(...sourceAudit.issues.map((issue) => `SOURCE:${issue}`));

  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const ids = new Set<string>();

  for (const question of GEO_RIV_001_CP010_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTION_COUNT:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_ALIGNMENT:${question.questionId}`);
    if (!question.sourceFactIds.length || !question.sourceIds.length) issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (hasBareRiverReference(question.stem)) issues.push(`BARE_RIVER_IN_STEM:${question.questionId}`);
    if (question.options.some(hasBareRiverReference)) issues.push(`BARE_RIVER_IN_OPTIONS:${question.questionId}`);
    if (hasBareRiverReference(question.explanation)) issues.push(`BARE_RIVER_IN_EXPLANATION:${question.questionId}`);
    if (/CP010|sourceFact|reviewed|associated with the fact|exam trap|shortcut/i.test(question.explanation)) issues.push(`MACHINE_LANGUAGE:${question.questionId}`);
    semanticAudit(question, issues);
  }

  if (GEO_RIV_001_CP010_REVIEW_BATCH_V1.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP010_REVIEW_BATCH_V1.length}`);
  for (const qlId of GEO_RIV_001_CP010_QL_IDS_V1) if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  if (difficultyCounts.Easy !== 24 || difficultyCounts.Medium !== 24 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_RIV_001_CP010_REVIEW_BATCH_V1.length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    sourceAudit,
  });
}
