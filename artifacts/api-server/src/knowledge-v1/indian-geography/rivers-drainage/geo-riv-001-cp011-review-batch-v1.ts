import {
  GEO_RIV_001_CP011_BASIN_ROWS_V1,
  GEO_RIV_001_CP011_PATTERN_ROWS_V1,
} from "./geo-riv-001-cp011-facts";
import {
  generateGeoRiv001Cp011ReviewV1,
  GEO_RIV_001_CP011_QL_IDS_V1,
  geoRiv001Cp011RawRiver,
} from "./geo-riv-001-cp011-review-generator-v1";
import type { GeoRiv001Cp011ReviewQuestion } from "./geo-riv-001-cp011-review-types";

const BASIN_ROWS = GEO_RIV_001_CP011_BASIN_ROWS_V1;
const PATTERN_ROWS = GEO_RIV_001_CP011_PATTERN_ROWS_V1;

function pairParts(value: string) {
  const [left = "", right = ""] = value.split(" — ").map((part) => part.trim());
  return { left, right };
}

function basinTrue(riverDisplay: string, basin: string) {
  const river = geoRiv001Cp011RawRiver(riverDisplay);
  return BASIN_ROWS.some((row) => row.river === river && row.basin === basin);
}

function patternRecognitionTrue(pattern: string, recognition: string) {
  return PATTERN_ROWS.some((row) => row.pattern === pattern && row.recognition === recognition);
}

function patternControlTrue(pattern: string, control: string) {
  return PATTERN_ROWS.some((row) => row.pattern === pattern && row.control === control);
}

function forceAnswerPosition(question: GeoRiv001Cp011ReviewQuestion, targetIndex: number): GeoRiv001Cp011ReviewQuestion {
  const answer = question.canonicalAnswer;
  const others = question.options.filter((_, index) => index !== question.correctIndex);
  const options = [...others];
  options.splice(targetIndex, 0, answer);
  return { ...question, options, correctIndex: targetIndex };
}

function semanticSignature(question: GeoRiv001Cp011ReviewQuestion) {
  if (question.qlId === "GEO-RIV-001-QL-098") {
    return `${question.canonicalAnswer}|${[...question.options].sort().join("|")}`;
  }
  if (["GEO-RIV-001-QL-093", "GEO-RIV-001-QL-094", "GEO-RIV-001-QL-095"].includes(question.qlId)) {
    return `${question.stem}|${question.canonicalAnswer}`;
  }
  return question.stem;
}

const generated: GeoRiv001Cp011ReviewQuestion[] = [];
for (const qlId of GEO_RIV_001_CP011_QL_IDS_V1) {
  const qlQuestions: GeoRiv001Cp011ReviewQuestion[] = [];
  const signatures = new Set<string>();
  for (let attempt = 1; attempt <= 300 && qlQuestions.length < 6; attempt += 1) {
    const question = generateGeoRiv001Cp011ReviewV1(qlId, `review-${qlId}-${String(attempt).padStart(3, "0")}`);
    const signature = semanticSignature(question);
    if (signatures.has(signature) && !["GEO-RIV-001-QL-096", "GEO-RIV-001-QL-097"].includes(qlId)) continue;
    if (signatures.has(signature) && ["GEO-RIV-001-QL-096", "GEO-RIV-001-QL-097"].includes(qlId) && qlQuestions.length < PATTERN_ROWS.length) continue;
    signatures.add(signature);
    qlQuestions.push(question);
  }
  if (qlQuestions.length !== 6) throw new Error(`Unable to build six CP011 review questions for ${qlId}`);
  generated.push(...qlQuestions);
}

export const GEO_RIV_001_CP011_REVIEW_BATCH_V1 = Object.freeze(
  generated.map((question, index) => Object.freeze(forceAnswerPosition(question, index % 4))),
);

function evaluateStatement(text: string): boolean | null {
  const basinMatch = text.match(/^(River .+?) belongs to the (.+ Basin)\.$/);
  if (basinMatch) return basinTrue(basinMatch[1], basinMatch[2]);
  const patternPrefix = PATTERN_ROWS.find((row) => text.startsWith(`${row.pattern} is associated with `));
  if (patternPrefix) {
    const control = text.replace(`${patternPrefix.pattern} is associated with `, "").replace(/\.$/, "");
    return patternControlTrue(patternPrefix.pattern, control);
  }
  return null;
}

function statementLines(stem: string) {
  return stem.split("\n")
    .map((line) => line.replace(/^(?:I{1,2}|\d+)\.\s*/, "").trim())
    .filter((line) => line.startsWith("River ") || PATTERN_ROWS.some((row) => line.startsWith(row.pattern)));
}

function expectedTwo(truth: readonly boolean[]) {
  if (truth[0] && truth[1]) return "Both I and II are correct";
  if (truth[0]) return "Only I is correct";
  if (truth[1]) return "Only II is correct";
  return "Neither I nor II is correct";
}

function expectedCount(count: number) {
  return ["None", "One", "Two", "Three"][count] ?? "";
}

function rowByRecognitionInStem(stem: string) {
  return PATTERN_ROWS.filter((row) => stem.toLowerCase().includes(row.recognition.toLowerCase()));
}

function rowByControlInStem(stem: string) {
  return PATTERN_ROWS.filter((row) => stem.toLowerCase().includes(row.control.toLowerCase()));
}

function semanticAudit(question: GeoRiv001Cp011ReviewQuestion, issues: string[]) {
  if (question.qlId === "GEO-RIV-001-QL-092") {
    const match = question.stem.match(/^(River .+?) belongs to which of the following river basins\?$/);
    if (!match) issues.push(`QL092_PARSE:${question.questionId}`);
    else {
      const truth = question.options.map((basin) => basinTrue(match[1], basin));
      if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL092_TRUTH:${question.questionId}`);
    }
  }
  if (question.qlId === "GEO-RIV-001-QL-093") {
    const basin = question.stem.match(/^Which of the following rivers is a part of the (.+ Basin)\?$/)?.[1] ?? "";
    const truth = question.options.map((river) => basinTrue(river, basin));
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL093_TRUTH:${question.questionId}`);
  }
  if (question.qlId === "GEO-RIV-001-QL-094") {
    const truth = question.options.map((option) => {
      const { left, right } = pairParts(option);
      return basinTrue(left, right);
    });
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL094_TRUTH:${question.questionId}`);
  }
  if (question.qlId === "GEO-RIV-001-QL-095") {
    const truth = question.options.map((option) => {
      const { left, right } = pairParts(option);
      return basinTrue(left, right);
    });
    if (truth.filter(Boolean).length !== 3 || truth[question.correctIndex]) issues.push(`QL095_TRUTH:${question.questionId}`);
  }
  if (question.qlId === "GEO-RIV-001-QL-096") {
    const rows = rowByRecognitionInStem(question.stem);
    if (rows.length !== 1) issues.push(`QL096_PARSE:${question.questionId}`);
    else {
      const truth = question.options.map((pattern) => patternRecognitionTrue(pattern, rows[0].recognition));
      if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL096_TRUTH:${question.questionId}`);
    }
  }
  if (question.qlId === "GEO-RIV-001-QL-097") {
    const rows = rowByControlInStem(question.stem);
    if (rows.length !== 1) issues.push(`QL097_PARSE:${question.questionId}`);
    else {
      const truth = question.options.map((pattern) => patternControlTrue(pattern, rows[0].control));
      if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL097_TRUTH:${question.questionId}`);
    }
  }
  if (question.qlId === "GEO-RIV-001-QL-098") {
    const truth = question.options.map((option) => {
      const { left, right } = pairParts(option);
      return patternControlTrue(left, right);
    });
    if (truth.filter(Boolean).length !== 1 || !truth[question.correctIndex]) issues.push(`QL098_TRUTH:${question.questionId}`);
  }
  if (question.qlId === "GEO-RIV-001-QL-099") {
    const values = statementLines(question.stem).map(evaluateStatement);
    if (values.length !== 2 || values.some((value) => value === null)) issues.push(`QL099_PARSE:${question.questionId}`);
    else if (question.canonicalAnswer !== expectedTwo(values as boolean[])) issues.push(`QL099_ANSWER:${question.questionId}`);
  }
  if (question.qlId === "GEO-RIV-001-QL-100") {
    const values = statementLines(question.stem).map(evaluateStatement);
    if (values.length !== 3 || values.some((value) => value === null)) issues.push(`QL100_PARSE:${question.questionId}`);
    else if (question.canonicalAnswer !== expectedCount((values as boolean[]).filter(Boolean).length)) issues.push(`QL100_ANSWER:${question.questionId}`);
  }
}

function hasBareRiverReference(text: string) {
  const names = [...new Set([...RIVERS_FOR_AUDIT, ...BASIN_ROWS.map((row) => row.parentRiver)])];
  for (const river of names) {
    const escaped = river.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?<!River )\\b${escaped}\\b(?!\\s+Basin)`);
    if (pattern.test(text)) return true;
  }
  return false;
}
const RIVERS_FOR_AUDIT = BASIN_ROWS.map((row) => row.river);

export function auditGeoRiv001Cp011ReviewBatchV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const ids = new Set<string>();

  for (const question of GEO_RIV_001_CP011_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_ALIGNMENT:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (hasBareRiverReference(question.stem)) issues.push(`BARE_RIVER_STEM:${question.questionId}`);
    if (question.options.some(hasBareRiverReference)) issues.push(`BARE_RIVER_OPTION:${question.questionId}`);
    if (hasBareRiverReference(question.explanation)) issues.push(`BARE_RIVER_EXPLANATION:${question.questionId}`);
    if (/CP011|sourceFact|reviewed|exam trap|shortcut|in this corpus/i.test(question.explanation)) issues.push(`MACHINE_LANGUAGE:${question.questionId}`);
    semanticAudit(question, issues);
  }

  if (GEO_RIV_001_CP011_REVIEW_BATCH_V1.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP011_REVIEW_BATCH_V1.length}`);
  for (const qlId of GEO_RIV_001_CP011_QL_IDS_V1) if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  if (difficultyCounts.Easy !== 12 || difficultyCounts.Medium !== 36 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: GEO_RIV_001_CP011_REVIEW_BATCH_V1.length, qlCounts: Object.freeze(qlCounts), difficultyCounts: Object.freeze(difficultyCounts), answerPositions: Object.freeze(answerPositions) });
}