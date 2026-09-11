import { generateGeoRiv001Cp008ReviewV1, GEO_RIV_001_CP008_QL_IDS_V1 } from "./geo-riv-001-cp008-review-generator-v1";
import type { GeoRiv001Cp008ReviewQuestion } from "./geo-riv-001-cp008-review-types";

const TARGET_PER_QL = 6;
const MAX_SEEDS = 4000;

function semanticKey(question: GeoRiv001Cp008ReviewQuestion) {
  return [
    question.qlId,
    question.stem.replace(/\s+/g, " ").trim().toLowerCase(),
    question.canonicalAnswer.toLowerCase(),
    [...question.sourceFactIds].sort().join("|"),
  ].join("::");
}

function withAnswerPosition(question: GeoRiv001Cp008ReviewQuestion, targetIndex: number) {
  const distractors = question.options.filter((_, index) => index !== question.correctIndex);
  const options = [...distractors];
  options.splice(targetIndex, 0, question.canonicalAnswer);
  return { ...question, options, correctIndex: targetIndex };
}

function upstreamToken(question: GeoRiv001Cp008ReviewQuestion) {
  for (const token of ["cp001", "cp002", "cp003", "cp004", "cp005"] as const) {
    if (question.sourceFactIds.some((id) => id.includes(`proj-${token}-`))) return token;
  }
  return "unknown";
}

function selectUnique(qlId: string, requiredAnswers: readonly string[] = [], requiredUpstreams: readonly string[] = []) {
  const selected: GeoRiv001Cp008ReviewQuestion[] = [];
  const seen = new Set<string>();
  const usedSeeds = new Set<number>();

  function add(question: GeoRiv001Cp008ReviewQuestion, seedIndex: number) {
    const key = semanticKey(question);
    if (seen.has(key)) return false;
    seen.add(key);
    usedSeeds.add(seedIndex);
    selected.push(question);
    return true;
  }

  for (const answer of requiredAnswers) {
    let found = false;
    for (let index = 0; index < MAX_SEEDS; index += 1) {
      if (usedSeeds.has(index)) continue;
      const question = generateGeoRiv001Cp008ReviewV1(qlId, `cp008-review-${qlId}-${index}`);
      if (question.canonicalAnswer !== answer) continue;
      if (add(question, index)) { found = true; break; }
    }
    if (!found) throw new Error(`CP008 could not cover required answer ${answer} for ${qlId}`);
  }

  for (const upstream of requiredUpstreams) {
    if (selected.some((question) => upstreamToken(question) === upstream)) continue;
    let found = false;
    for (let index = 0; index < MAX_SEEDS; index += 1) {
      if (usedSeeds.has(index)) continue;
      const question = generateGeoRiv001Cp008ReviewV1(qlId, `cp008-review-${qlId}-${index}`);
      if (upstreamToken(question) !== upstream) continue;
      if (add(question, index)) { found = true; break; }
    }
    if (!found) throw new Error(`CP008 could not cover upstream ${upstream} for ${qlId}`);
  }

  for (let index = 0; index < MAX_SEEDS && selected.length < TARGET_PER_QL; index += 1) {
    if (usedSeeds.has(index)) continue;
    add(generateGeoRiv001Cp008ReviewV1(qlId, `cp008-review-${qlId}-${index}`), index);
  }
  if (selected.length !== TARGET_PER_QL) throw new Error(`CP008 ${qlId} selected ${selected.length}/${TARGET_PER_QL}`);
  return selected;
}

const byQl: Record<string, GeoRiv001Cp008ReviewQuestion[]> = {};
for (const qlId of GEO_RIV_001_CP008_QL_IDS_V1) {
  if (qlId === "GEO-RIV-001-QL-065") {
    byQl[qlId] = selectUnique(qlId, [], ["cp002", "cp003", "cp004", "cp005"]);
  } else if (qlId === "GEO-RIV-001-QL-068") {
    byQl[qlId] = selectUnique(qlId, ["Arabian Sea", "Bay of Bengal", "Delta", "Estuary"]);
  } else if (qlId === "GEO-RIV-001-QL-072") {
    byQl[qlId] = selectUnique(qlId, ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]);
  } else if (qlId === "GEO-RIV-001-QL-073") {
    byQl[qlId] = selectUnique(qlId, ["None", "One", "Two", "Three"]);
  } else {
    byQl[qlId] = selectUnique(qlId);
  }
}

const raw = GEO_RIV_001_CP008_QL_IDS_V1.flatMap((qlId) => byQl[qlId]);
export const GEO_RIV_001_CP008_REVIEW_BATCH_V1 = Object.freeze(
  raw.map((question, index) => Object.freeze(withAnswerPosition(question, index % 4))),
);

export function auditGeoRiv001Cp008ReviewBatchV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const upstreamCounts: Record<string, number> = { cp001: 0, cp002: 0, cp003: 0, cp004: 0, cp005: 0 };
  const semanticKeys = new Set<string>();
  const banned = /associated with|listed among|therefore,|exam trap|shortcut|matches the reviewed relation|characteristic of this setting|river-association|originates at or near|has its source at or near|near near|at near|at below|at west of/i;

  for (const question of GEO_RIV_001_CP008_REVIEW_BATCH_V1) {
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] = (answerPositions[question.correctIndex] ?? 0) + 1;
    const upstreams = new Set(question.sourceFactIds.map((id) => ["cp001", "cp002", "cp003", "cp004", "cp005"].find((token) => id.includes(`proj-${token}-`))).filter(Boolean) as string[]);
    for (const upstream of upstreams) upstreamCounts[upstream] = (upstreamCounts[upstream] ?? 0) + 1;
    const key = semanticKey(question);
    if (semanticKeys.has(key)) issues.push(`DUPLICATE_SEMANTIC_QUESTION:${question.questionId}`);
    semanticKeys.add(key);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`BAD_OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`BAD_ANSWER_ALIGNMENT:${question.questionId}`);
    if (question.upstreamFactIds.some((id) => id.includes("cp006"))) issues.push(`CP006_LEAK:${question.questionId}`);
    if (banned.test(`${question.stem}\n${question.explanation}\n${question.options.join("\n")}`)) issues.push(`BANNED_WORDING:${question.questionId}`);
  }

  if (GEO_RIV_001_CP008_REVIEW_BATCH_V1.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP008_REVIEW_BATCH_V1.length}`);
  for (const qlId of GEO_RIV_001_CP008_QL_IDS_V1) if (qlCounts[qlId] !== TARGET_PER_QL) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  if (semanticKeys.size !== 54) issues.push(`SEMANTIC_UNIQUE_COUNT:${semanticKeys.size}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 24 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY_COUNTS:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);
  for (const upstream of ["cp001", "cp002", "cp003", "cp004", "cp005"]) if ((upstreamCounts[upstream] ?? 0) === 0) issues.push(`MISSING_UPSTREAM:${upstream}`);

  const ql068 = GEO_RIV_001_CP008_REVIEW_BATCH_V1.filter((question) => question.qlId === "GEO-RIV-001-QL-068");
  for (const answer of ["Arabian Sea", "Bay of Bengal", "Delta", "Estuary"]) if (!ql068.some((question) => question.canonicalAnswer === answer)) issues.push(`MISSING_MOUTH_ANSWER:${answer}`);
  const ql072Answers = new Set(GEO_RIV_001_CP008_REVIEW_BATCH_V1.filter((question) => question.qlId === "GEO-RIV-001-QL-072").map((question) => question.canonicalAnswer));
  for (const answer of ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]) if (!ql072Answers.has(answer)) issues.push(`MISSING_STATEMENT_OUTCOME:${answer}`);
  const ql073Answers = new Set(GEO_RIV_001_CP008_REVIEW_BATCH_V1.filter((question) => question.qlId === "GEO-RIV-001-QL-073").map((question) => question.canonicalAnswer));
  for (const answer of ["None", "One", "Two", "Three"]) if (!ql073Answers.has(answer)) issues.push(`MISSING_COUNT_OUTCOME:${answer}`);

  return { valid: issues.length === 0, issues, questionCount: GEO_RIV_001_CP008_REVIEW_BATCH_V1.length, semanticUniqueCount: semanticKeys.size, qlCounts, difficultyCounts, answerPositions, upstreamCounts };
}
