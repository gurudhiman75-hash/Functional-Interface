import { GEO_RIV_001_CP008_REVIEW_BATCH_V5, auditGeoRiv001Cp008ReviewBatchV5 } from "./geo-riv-001-cp008-review-batch-v5";
import { GEO_RIV_001_CP009_REVIEW_BATCH_V3, auditGeoRiv001Cp009ReviewBatchV3 } from "./geo-riv-001-cp009-review-batch-v3";
import { GEO_RIV_001_CP010_REVIEW_BATCH_V1, auditGeoRiv001Cp010ReviewBatchV1 } from "./geo-riv-001-cp010-review-batch-v1";
import { GEO_RIV_001_CP011_REVIEW_BATCH_V1, auditGeoRiv001Cp011ReviewBatchV1 } from "./geo-riv-001-cp011-review-batch-v1";
import { GEO_RIV_001_CP012_REVIEW_BATCH_V1, auditGeoRiv001Cp012ReviewBatchV1 } from "./geo-riv-001-cp012-review-batch-v1";
import { GEO_RIV_001_CP013_REVIEW_BATCH_V1, auditGeoRiv001Cp013ReviewBatchV1 } from "./geo-riv-001-cp013-review-batch-v1";
import { GEO_RIV_001_CP014_REVIEW_BATCH_V1, auditGeoRiv001Cp014ReviewBatchV1 } from "./geo-riv-001-cp014-review-batch-v1";
import type { KnowledgeV1Difficulty } from "../../types";
import type { GeoRiv001Cp015ReviewQuestion } from "./geo-riv-001-cp015-review-types";

type UpstreamQuestion = Readonly<{
  questionId: string;
  cpId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  solverAuthority?: string;
}>;

type Lane = Readonly<{
  sourceCpId: string;
  qlId: string;
  qlName: string;
  batch: readonly UpstreamQuestion[];
}>;

export const GEO_RIV_001_CP015_QL_IDS_V1 = Object.freeze([
  "GEO-RIV-001-QL-128",
  "GEO-RIV-001-QL-129",
  "GEO-RIV-001-QL-130",
  "GEO-RIV-001-QL-131",
  "GEO-RIV-001-QL-132",
  "GEO-RIV-001-QL-133",
  "GEO-RIV-001-QL-134",
] as const);

const LANES: readonly Lane[] = Object.freeze([
  { sourceCpId: "GEO-RIV-001-CP008", qlId: GEO_RIV_001_CP015_QL_IDS_V1[0], qlName: "Sources and river-course mastery", batch: GEO_RIV_001_CP008_REVIEW_BATCH_V5 as readonly UpstreamQuestion[] },
  { sourceCpId: "GEO-RIV-001-CP009", qlId: GEO_RIV_001_CP015_QL_IDS_V1[1], qlName: "Rivers and states mastery", batch: GEO_RIV_001_CP009_REVIEW_BATCH_V3 as readonly UpstreamQuestion[] },
  { sourceCpId: "GEO-RIV-001-CP010", qlId: GEO_RIV_001_CP015_QL_IDS_V1[2], qlName: "Projects and reservoirs mastery", batch: GEO_RIV_001_CP010_REVIEW_BATCH_V1 as readonly UpstreamQuestion[] },
  { sourceCpId: "GEO-RIV-001-CP011", qlId: GEO_RIV_001_CP015_QL_IDS_V1[3], qlName: "Basins and drainage-pattern mastery", batch: GEO_RIV_001_CP011_REVIEW_BATCH_V1 as readonly UpstreamQuestion[] },
  { sourceCpId: "GEO-RIV-001-CP012", qlId: GEO_RIV_001_CP015_QL_IDS_V1[4], qlName: "Cities and rivers mastery", batch: GEO_RIV_001_CP012_REVIEW_BATCH_V1 as readonly UpstreamQuestion[] },
  { sourceCpId: "GEO-RIV-001-CP013", qlId: GEO_RIV_001_CP015_QL_IDS_V1[5], qlName: "River comparison and classification mastery", batch: GEO_RIV_001_CP013_REVIEW_BATCH_V1 as readonly UpstreamQuestion[] },
  { sourceCpId: "GEO-RIV-001-CP014", qlId: GEO_RIV_001_CP015_QL_IDS_V1[6], qlName: "Integrated rivers mastery", batch: GEO_RIV_001_CP014_REVIEW_BATCH_V1 as readonly UpstreamQuestion[] },
]);

function signature(question: UpstreamQuestion) {
  return `${question.stem}::${question.canonicalAnswer}`;
}

function moveAnswer(question: UpstreamQuestion, target: number) {
  const correct = question.options[question.correctIndex];
  const distractors = question.options.filter((_, index) => index !== question.correctIndex);
  const options = [...distractors];
  options.splice(target, 0, correct);
  return { options, correctIndex: target };
}

function selectLaneQuestions(lane: Lane, seen: Set<string>) {
  const byQl = new Map<string, UpstreamQuestion[]>();
  for (const question of lane.batch) {
    const bucket = byQl.get(question.qlId) ?? [];
    bucket.push(question);
    byQl.set(question.qlId, bucket);
  }
  const selected: UpstreamQuestion[] = [];
  for (const sourceQlId of [...byQl.keys()].sort()) {
    const candidate = byQl.get(sourceQlId)!.find((question) => !seen.has(signature(question)));
    if (!candidate) throw new Error(`CP015 cannot select unique question for ${lane.sourceCpId}/${sourceQlId}`);
    seen.add(signature(candidate));
    selected.push(candidate);
  }
  return selected;
}

function buildBatch() {
  const selected: Array<{ lane: Lane; question: UpstreamQuestion }> = [];
  const seen = new Set<string>();
  for (const lane of LANES) {
    for (const question of selectLaneQuestions(lane, seen)) selected.push({ lane, question });
  }

  const integratedLane = LANES[LANES.length - 1];
  const extra = integratedLane.batch.find((question) => !selected.some((entry) => entry.question.questionId === question.questionId) && !seen.has(signature(question)));
  if (!extra) throw new Error("CP015 requires one additional unique integrated mastery question");
  seen.add(signature(extra));
  selected.push({ lane: integratedLane, question: extra });

  if (selected.length !== 64) throw new Error(`CP015 expected 64 selected questions, found ${selected.length}`);

  return selected.map(({ lane, question }, index): GeoRiv001Cp015ReviewQuestion => {
    const placed = moveAnswer(question, index % 4);
    return Object.freeze({
      questionId: `GEO-RIV-001-CP015-V1-${String(index + 1).padStart(3, "0")}`,
      chapterId: "GEO-RIV-001",
      cpId: "GEO-RIV-001-CP015",
      qlId: lane.qlId,
      qlName: lane.qlName,
      difficulty: question.difficulty,
      stem: question.stem,
      options: placed.options,
      correctIndex: placed.correctIndex,
      canonicalAnswer: question.canonicalAnswer,
      explanation: question.explanation,
      sourceIds: [...question.sourceIds],
      sourceFactIds: [...question.sourceFactIds],
      solverAuthority: `MASTER:${question.solverAuthority ?? "UPSTREAM_QUALIFIED"}`,
      sourceCpId: lane.sourceCpId,
      sourceQlId: question.qlId,
      sourceQuestionId: question.questionId,
      reviewOnly: true,
      runtimeRegistered: false,
    });
  });
}

export const GEO_RIV_001_CP015_REVIEW_BATCH_V1 = Object.freeze(buildBatch());

export function auditGeoRiv001Cp015ReviewBatchV1() {
  const issues: string[] = [];
  const upstreamAudits = [
    ["CP008", auditGeoRiv001Cp008ReviewBatchV5()],
    ["CP009", auditGeoRiv001Cp009ReviewBatchV3()],
    ["CP010", auditGeoRiv001Cp010ReviewBatchV1()],
    ["CP011", auditGeoRiv001Cp011ReviewBatchV1()],
    ["CP012", auditGeoRiv001Cp012ReviewBatchV1()],
    ["CP013", auditGeoRiv001Cp013ReviewBatchV1()],
    ["CP014", auditGeoRiv001Cp014ReviewBatchV1()],
  ] as const;
  for (const [cp, audit] of upstreamAudits) if (!audit.valid) issues.push(`UPSTREAM_INVALID:${cp}`);

  const questions = GEO_RIV_001_CP015_REVIEW_BATCH_V1;
  const positions = [0, 0, 0, 0];
  const laneCounts = new Map<string, number>();
  const sourceCpCounts = new Map<string, number>();
  const sourceQlIds = new Set<string>();
  const sourceQuestionIds = new Set<string>();
  const semantic = new Set<string>();
  const difficulty = { Easy: 0, Medium: 0, Hard: 0 };

  for (const question of questions) {
    positions[question.correctIndex] += 1;
    difficulty[question.difficulty] += 1;
    laneCounts.set(question.qlId, (laneCounts.get(question.qlId) ?? 0) + 1);
    sourceCpCounts.set(question.sourceCpId, (sourceCpCounts.get(question.sourceCpId) ?? 0) + 1);
    sourceQlIds.add(`${question.sourceCpId}:${question.sourceQlId}`);
    if (sourceQuestionIds.has(question.sourceQuestionId)) issues.push(`DUPLICATE_SOURCE_QUESTION:${question.sourceQuestionId}`);
    sourceQuestionIds.add(question.sourceQuestionId);
    const sig = `${question.stem}::${question.canonicalAnswer}`;
    if (semantic.has(sig)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantic.add(sig);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_MATRIX:${question.questionId}`);
    if (new Set(question.options).size !== 4) issues.push(`OPTION_UNIQUENESS:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (!question.solverAuthority.startsWith("MASTER:")) issues.push(`SOLVER_AUTHORITY:${question.questionId}`);
    if (/qualified relation set|source-backed set|solver|generator|engine/i.test(`${question.stem} ${question.explanation}`)) issues.push(`INTERNAL_LANGUAGE:${question.questionId}`);
  }

  if (questions.length !== 64) issues.push(`TOTAL:${questions.length}`);
  if (positions.join(",") !== "16,16,16,16") issues.push(`ANSWER_POSITIONS:${positions.join(",")}`);
  if (sourceQlIds.size !== 63) issues.push(`SOURCE_QL_COVERAGE:${sourceQlIds.size}`);
  for (const lane of LANES) {
    const expected = lane.sourceCpId === "GEO-RIV-001-CP014" ? 10 : 9;
    if (laneCounts.get(lane.qlId) !== expected) issues.push(`LANE_COUNT:${lane.qlId}:${laneCounts.get(lane.qlId) ?? 0}`);
    if (sourceCpCounts.get(lane.sourceCpId) !== expected) issues.push(`SOURCE_CP_COUNT:${lane.sourceCpId}:${sourceCpCounts.get(lane.sourceCpId) ?? 0}`);
  }
  if (difficulty.Medium + difficulty.Hard < 40) issues.push(`MASTERY_DEPTH:${JSON.stringify(difficulty)}`);
  if (difficulty.Hard < 8) issues.push(`HARD_DEPTH:${difficulty.Hard}`);

  return {
    valid: issues.length === 0,
    issues,
    total: questions.length,
    positions,
    difficulty,
    laneCounts: Object.fromEntries(laneCounts),
    sourceCpCounts: Object.fromEntries(sourceCpCounts),
    sourceQlCoverage: sourceQlIds.size,
    uniqueSemanticCount: semantic.size,
    upstreamAuditsValid: upstreamAudits.every(([, audit]) => audit.valid),
  };
}
