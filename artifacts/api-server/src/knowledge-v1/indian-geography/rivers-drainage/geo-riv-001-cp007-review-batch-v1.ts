import { generateGeoRiv001Cp007ReviewV1 } from "./geo-riv-001-cp007-review-generator-v1";
import type { GeoRiv001Cp007ReviewQuestion } from "./geo-riv-001-cp007-review-types";

const TARGET_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-055": 8,
  "GEO-RIV-001-QL-056": 7,
  "GEO-RIV-001-QL-057": 7,
  "GEO-RIV-001-QL-058": 6,
  "GEO-RIV-001-QL-059": 7,
  "GEO-RIV-001-QL-060": 6,
  "GEO-RIV-001-QL-061": 6,
  "GEO-RIV-001-QL-062": 5,
  "GEO-RIV-001-QL-063": 4,
  "GEO-RIV-001-QL-064": 4,
};

function semanticKey(q: GeoRiv001Cp007ReviewQuestion) {
  return [q.qlId, q.stem, q.canonicalAnswer].join("|");
}

function upstreamTokens(q: GeoRiv001Cp007ReviewQuestion) {
  return [...new Set(q.sourceFactIds.flatMap((id) => {
    const match = id.match(/geo-riv-001-cp007-(cp00[2-5])-/);
    return match ? [match[1]] : [];
  }))];
}

function genericSelect(qlId: string, count: number) {
  const selected: GeoRiv001Cp007ReviewQuestion[] = [];
  const keys = new Set<string>();
  for (let i = 0; i < 4000 && selected.length < count; i += 1) {
    const q = generateGeoRiv001Cp007ReviewV1(qlId, `cp007-batch-${qlId}-${i}`);
    const key = semanticKey(q);
    if (keys.has(key)) continue;
    keys.add(key);
    selected.push(q);
  }
  if (selected.length !== count) throw new Error(`CP007 could not select ${count} unique ${qlId} questions; got ${selected.length}`);
  return selected;
}

function selectQl055() {
  const selected: GeoRiv001Cp007ReviewQuestion[] = [];
  const keys = new Set<string>();
  for (const token of ["cp002", "cp003", "cp004", "cp005"] as const) {
    let found = 0;
    for (let i = 0; i < 5000 && found < 2; i += 1) {
      const q = generateGeoRiv001Cp007ReviewV1("GEO-RIV-001-QL-055", `cp007-batch-ql055-${token}-${i}`);
      if (!upstreamTokens(q).includes(token)) continue;
      const key = semanticKey(q);
      if (keys.has(key)) continue;
      keys.add(key);
      selected.push(q);
      found += 1;
    }
    if (found !== 2) throw new Error(`CP007 QL055 could not secure two questions from ${token}`);
  }
  return selected;
}

function selectByRequiredAnswers(qlId: string, answers: readonly string[]) {
  const selected: GeoRiv001Cp007ReviewQuestion[] = [];
  const keys = new Set<string>();
  for (const answer of answers) {
    let found: GeoRiv001Cp007ReviewQuestion | undefined;
    for (let i = 0; i < 5000 && !found; i += 1) {
      const q = generateGeoRiv001Cp007ReviewV1(qlId, `cp007-batch-${qlId}-${answer}-${i}`);
      const key = semanticKey(q);
      if (q.canonicalAnswer === answer && !keys.has(key)) found = q;
    }
    if (!found) throw new Error(`CP007 ${qlId} could not generate required answer ${answer}`);
    keys.add(semanticKey(found));
    selected.push(found);
  }
  return selected;
}

const rawBatch: GeoRiv001Cp007ReviewQuestion[] = [
  ...selectQl055(),
  ...genericSelect("GEO-RIV-001-QL-056", TARGET_COUNTS["GEO-RIV-001-QL-056"]),
  ...genericSelect("GEO-RIV-001-QL-057", TARGET_COUNTS["GEO-RIV-001-QL-057"]),
  ...genericSelect("GEO-RIV-001-QL-058", TARGET_COUNTS["GEO-RIV-001-QL-058"]),
  ...genericSelect("GEO-RIV-001-QL-059", TARGET_COUNTS["GEO-RIV-001-QL-059"]),
  ...genericSelect("GEO-RIV-001-QL-060", TARGET_COUNTS["GEO-RIV-001-QL-060"]),
  ...genericSelect("GEO-RIV-001-QL-061", TARGET_COUNTS["GEO-RIV-001-QL-061"]),
  ...selectByRequiredAnswers("GEO-RIV-001-QL-062", ["Chenab", "Beas → Satluj → Chenab", "Alaknanda", "Dibang and Lohit", "Ganga"]),
  ...selectByRequiredAnswers("GEO-RIV-001-QL-063", ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]),
  ...selectByRequiredAnswers("GEO-RIV-001-QL-064", ["None", "One", "Two", "Three"]),
];

function rebalance(q: GeoRiv001Cp007ReviewQuestion, targetIndex: number): GeoRiv001Cp007ReviewQuestion {
  if (q.correctIndex === targetIndex) return q;
  const options = [...q.options];
  [options[q.correctIndex], options[targetIndex]] = [options[targetIndex], options[q.correctIndex]];
  return { ...q, options, correctIndex: targetIndex };
}

export const GEO_RIV_001_CP007_REVIEW_BATCH_V1: GeoRiv001Cp007ReviewQuestion[] = rawBatch.map((q, index) =>
  rebalance(q, index % 4),
);

export function auditGeoRiv001Cp007ReviewBatchV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const upstreamCounts: Record<string, number> = {};
  const semanticKeys = new Set<string>();
  const banned = /associated with|matches the reviewed relation|listed among|joining relation|therefore,|exam trap|shortcut|both banks|neither bank/i;

  for (const q of GEO_RIV_001_CP007_REVIEW_BATCH_V1) {
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] = (answerPositions[q.correctIndex] ?? 0) + 1;
    semanticKeys.add(semanticKey(q));

    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push(`BAD_OPTIONS:${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER_MISMATCH:${q.questionId}`);
    if (!q.sourceIds.length || !q.sourceFactIds.length || !q.upstreamFactIds.length) issues.push(`NO_PROVENANCE:${q.questionId}`);
    if (q.upstreamFactIds.some((id) => id === "unknown" || id.includes("cp006"))) issues.push(`BAD_UPSTREAM:${q.questionId}`);
    if (q.sourceFactIds.some((id) => id.includes("cp006"))) issues.push(`CP006_LEAK:${q.questionId}`);
    if (banned.test(`${q.stem}\n${q.explanation}`)) issues.push(`EDITORIAL_LANGUAGE:${q.questionId}`);

    for (const token of upstreamTokens(q)) upstreamCounts[token] = (upstreamCounts[token] ?? 0) + 1;
  }

  if (GEO_RIV_001_CP007_REVIEW_BATCH_V1.length !== 60) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP007_REVIEW_BATCH_V1.length}`);
  if (semanticKeys.size !== 60) issues.push(`SEMANTIC_UNIQUENESS:${semanticKeys.size}`);
  for (const [qlId, count] of Object.entries(TARGET_COUNTS)) {
    if (qlCounts[qlId] !== count) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  for (const [position, expected] of Object.entries({ 0: 15, 1: 15, 2: 15, 3: 15 })) {
    if (answerPositions[Number(position)] !== expected) issues.push(`ANSWER_POSITION:${position}:${answerPositions[Number(position)]}`);
  }
  for (const token of ["cp002", "cp003", "cp004", "cp005"]) {
    if (!upstreamCounts[token]) issues.push(`MISSING_UPSTREAM:${token}`);
  }
  if (upstreamCounts.cp006) issues.push("UNAPPROVED_CP006_PRESENT");

  const ql055 = GEO_RIV_001_CP007_REVIEW_BATCH_V1.filter((q) => q.qlId === "GEO-RIV-001-QL-055");
  for (const token of ["cp002", "cp003", "cp004", "cp005"]) {
    const count = ql055.filter((q) => upstreamTokens(q).includes(token)).length;
    if (count < 2) issues.push(`QL055_UPSTREAM_BALANCE:${token}:${count}`);
  }

  for (const qlId of ["GEO-RIV-001-QL-060", "GEO-RIV-001-QL-061"]) {
    const answers = GEO_RIV_001_CP007_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId).map((q) => q.canonicalAnswer);
    if (new Set(answers).size !== answers.length) issues.push(`PAIR_CONTENT_REPEAT:${qlId}`);
  }

  const answersFor = (qlId: string) => new Set(GEO_RIV_001_CP007_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId).map((q) => q.canonicalAnswer));
  const ql062 = answersFor("GEO-RIV-001-QL-062");
  for (const answer of ["Chenab", "Beas → Satluj → Chenab", "Alaknanda", "Dibang and Lohit", "Ganga"]) if (!ql062.has(answer)) issues.push(`QL062_MISSING:${answer}`);
  const ql063 = answersFor("GEO-RIV-001-QL-063");
  for (const answer of ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]) if (!ql063.has(answer)) issues.push(`QL063_MISSING:${answer}`);
  const ql064 = answersFor("GEO-RIV-001-QL-064");
  for (const answer of ["None", "One", "Two", "Three"]) if (!ql064.has(answer)) issues.push(`QL064_MISSING:${answer}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP007_REVIEW_BATCH_V1.length,
    semanticUniqueCount: semanticKeys.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    upstreamCounts,
  };
}
