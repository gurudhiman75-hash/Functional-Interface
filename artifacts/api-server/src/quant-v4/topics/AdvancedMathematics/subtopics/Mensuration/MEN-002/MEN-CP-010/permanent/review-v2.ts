import { MEN_CP_010_PERMANENT_ALLOCATION } from "./allocation";
import {
  generateMenCp010ExamReadyEnglishQuestion,
  listMenCp010ExamReadyEnglishSources,
  type MenCp010ExamReadyEnglishQuestion,
} from "./runtime-v3";

export const MEN_CP_010_EXAM_REALISM_REVIEW_V2_AUTHORITY =
  "MEN-CP010-EXAM-REALISM-REVIEW-V2" as const;

type QlId = (typeof MEN_CP_010_PERMANENT_ALLOCATION)[number]["qlId"];

const ALL_DECLARED_SOURCES = listMenCp010ExamReadyEnglishSources();
const EXAM_SOURCE_ROWS = ALL_DECLARED_SOURCES.filter((row) => row.layer === "EXAM_REALISM_V2");
const EXAM_SOURCE_IDS = new Set(EXAM_SOURCE_ROWS.map((row) => row.sourceId));
const DECLARED_BY_QL = new Map<QlId, string[]>();
for (const source of ALL_DECLARED_SOURCES) {
  const qlId = source.qlId as QlId;
  const current = DECLARED_BY_QL.get(qlId) ?? [];
  current.push(source.sourceId);
  DECLARED_BY_QL.set(qlId, current);
}
const SOURCE_SALTS = "abcdefghijklmnopqrstuvwx".split("");
const CANDIDATE_CACHE = new Map<string, readonly MenCp010ExamReadyEnglishQuestion[]>();

function candidatesForPosition(qlId: QlId, targetPosition: number) {
  const cacheKey = `${qlId}:${targetPosition}`;
  const cached = CANDIDATE_CACHE.get(cacheKey);
  if (cached) return cached;

  const candidates: MenCp010ExamReadyEnglishQuestion[] = [];
  const seen = new Set<string>();
  for (let attempt = targetPosition; attempt < 4096 && candidates.length < 256; attempt += 4) {
    const suffix = String(attempt).padStart(5, "0");
    const seeds = [
      `exam-v2-review-${qlId}-${targetPosition}-${suffix}`,
      ...SOURCE_SALTS.map((salt) => `base-v2-review-${salt}-${qlId}-${targetPosition}-${suffix}`),
      ...SOURCE_SALTS.map((salt) => `review-v2-${salt}-${qlId}-${targetPosition}-${suffix}`),
    ];
    for (const seed of seeds) {
      const q = generateMenCp010ExamReadyEnglishQuestion(qlId, seed);
      if (q.correctIndex !== targetPosition) continue;
      const identity = `${q.sourceId}|${q.stem}`;
      if (seen.has(identity)) continue;
      seen.add(identity);
      candidates.push(q);
      if (candidates.length >= 256) break;
    }
  }
  if (!candidates.length) throw new Error(`No V2 review candidates for ${qlId} at position ${targetPosition}`);
  CANDIDATE_CACHE.set(cacheKey, candidates);
  return candidates;
}

function requiredHumanSourceCount(declaredCount: number) {
  return Math.min(2, declaredCount);
}

function chooseBest(
  candidates: readonly MenCp010ExamReadyEnglishQuestion[],
  usedSources: Set<string>,
  usedStems: Set<string>,
) {
  return (
    candidates.find((q) => EXAM_SOURCE_IDS.has(q.sourceId) && !usedSources.has(q.sourceId) && !usedStems.has(q.stem)) ??
    candidates.find((q) => !usedSources.has(q.sourceId) && !usedStems.has(q.stem)) ??
    candidates.find((q) => !usedStems.has(q.stem)) ??
    null
  );
}

function positionOrder(extraPositionCounts: readonly number[], qlIndex: number, extraIndex: number) {
  return [0, 1, 2, 3].sort((a, b) => {
    const countDelta = extraPositionCounts[a]! - extraPositionCounts[b]!;
    if (countDelta !== 0) return countDelta;
    const aRank = (a - qlIndex - extraIndex + 8) % 4;
    const bRank = (b - qlIndex - extraIndex + 8) % 4;
    return aRank - bRank;
  });
}

function buildForQl(
  qlId: QlId,
  qlIndex: number,
  extraPositionCounts: number[],
) {
  const selected: MenCp010ExamReadyEnglishQuestion[] = [];
  const usedStems = new Set<string>();
  const usedSources = new Set<string>();
  const declared = [...new Set(DECLARED_BY_QL.get(qlId) ?? [])];
  const requiredSourceCount = requiredHumanSourceCount(declared.length);

  // First four records guarantee one A/B/C/D example for every permanent QL.
  for (let targetPosition = 0; targetPosition < 4; targetPosition += 1) {
    const q = chooseBest(candidatesForPosition(qlId, targetPosition), usedSources, usedStems);
    if (!q) throw new Error(`Cannot select V2 answer-position review state for ${qlId}/${targetPosition}`);
    selected.push(q);
    usedSources.add(q.sourceId);
    usedStems.add(q.stem);
  }

  // The remaining four maximize content breadth while keeping the setter
  // artifact globally balanced. Position is a preference, not a per-QL quota:
  // if a preferred position has insufficient distinct states, another position
  // is used rather than repeating a stem.
  for (let extraIndex = 0; extraIndex < 4; extraIndex += 1) {
    let selectedExtra: MenCp010ExamReadyEnglishQuestion | null = null;
    let selectedPosition = -1;
    for (const position of positionOrder(extraPositionCounts, qlIndex, extraIndex)) {
      const candidate = chooseBest(candidatesForPosition(qlId, position), usedSources, usedStems);
      if (!candidate) continue;
      selectedExtra = candidate;
      selectedPosition = position;
      break;
    }
    if (!selectedExtra || selectedPosition < 0) {
      throw new Error(`Cannot reach 8 distinct V2 review states for ${qlId}; reached ${selected.length}`);
    }
    selected.push(selectedExtra);
    usedSources.add(selectedExtra.sourceId);
    usedStems.add(selectedExtra.stem);
    extraPositionCounts[selectedPosition] = (extraPositionCounts[selectedPosition] ?? 0) + 1;
  }

  if (usedSources.size < requiredSourceCount) {
    throw new Error(`${qlId}: review covers ${usedSources.size}/${requiredSourceCount} required human-review sources`);
  }
  return selected;
}

export function buildMenCp010ExamRealismReviewV2() {
  const extraPositionCounts = [0, 0, 0, 0];
  return MEN_CP_010_PERMANENT_ALLOCATION.flatMap((allocation, qlIndex) =>
    buildForQl(allocation.qlId, qlIndex, extraPositionCounts));
}

export function auditMenCp010ExamRealismReviewV2() {
  const records = buildMenCp010ExamRealismReviewV2();
  const positions = [0, 0, 0, 0];
  for (const q of records) positions[q.correctIndex] += 1;

  const sourceCoverage = MEN_CP_010_PERMANENT_ALLOCATION.map((allocation) => {
    const slice = records.filter((q) => q.permanentQlId === allocation.qlId);
    const declared = [...new Set(DECLARED_BY_QL.get(allocation.qlId) ?? [])];
    const reviewSources = new Set(slice.map((q) => q.sourceId));
    return {
      qlId: allocation.qlId,
      declaredSourceCount: declared.length,
      requiredReviewSourceCount: requiredHumanSourceCount(declared.length),
      reviewSourceCount: reviewSources.size,
      uniqueStemCount: new Set(slice.map((q) => q.stem)).size,
      examSourceCount: slice.filter((q) => EXAM_SOURCE_IDS.has(q.sourceId)).length,
    };
  });

  const examRecords = records.filter((q) => EXAM_SOURCE_IDS.has(q.sourceId));
  const examSourcesCovered = EXAM_SOURCE_ROWS.every((source) =>
    records.some((q) => q.permanentQlId === source.qlId && q.sourceId === source.sourceId),
  );
  const realisticBucketCapacity = records
    .filter((q) => q.sourceId === "EXAM-V2-FRUSTUM-BUCKET-CAPACITY")
    .every((q) => {
      const litres = Number.parseFloat(q.answer);
      return Number.isFinite(litres) && litres > 1 && litres < 30 && q.answer.endsWith(" litres");
    });
  const cleanSscFrustumArithmetic = records
    .filter((q) => q.sourceId === "EXAM-V2-CONICAL-FRUSTUM-VOLUME-CLEAN-PI")
    .every((q) => /^\d+ cm³$/.test(q.answer));
  const multiStepWorked = examRecords.every((q) => {
    const work = q.explanation.steps.find((step) => step.title === "Substitute and calculate")?.body ?? "";
    return work.includes(q.answer) && /[=×√]/.test(work);
  });
  // Match the mathematical cross-term token only. The old `/Rr/i` pattern
  // falsely matched ordinary words containing `rr`, such as "correct".
  const irrelevantPyramidTrapRecords = examRecords
    .filter((q) => q.sourceId.includes("PYRAMID"))
    .filter((q) => q.explanation.traps.some((trap) => /\bRr\b|mixed frustum/i.test(trap)))
    .map((q) => ({ qlId: q.permanentQlId, sourceId: q.sourceId, traps: q.explanation.traps }));
  const noGenericCrossTermTrapOnPyramid = irrelevantPyramidTrapRecords.length === 0;
  const maxPositionCount = Math.max(...positions);
  const minPositionCount = Math.min(...positions);

  return {
    authority: MEN_CP_010_EXAM_REALISM_REVIEW_V2_AUTHORITY,
    reviewRecordCount: records.length,
    permanentQlCount: new Set(records.map((q) => q.permanentQlId)).size,
    recordsPerQl: records.length / MEN_CP_010_PERMANENT_ALLOCATION.length,
    correctPositions: { A: positions[0], B: positions[1], C: positions[2], D: positions[3] },
    answerPositionSpread: maxPositionCount - minPositionCount,
    everyQlHasAllFourPositions: MEN_CP_010_PERMANENT_ALLOCATION.every((allocation) => {
      const slice = records.filter((q) => q.permanentQlId === allocation.qlId);
      return new Set(slice.map((q) => q.correctIndex)).size === 4;
    }),
    allVerified: records.every((q) => q.verification.valid),
    allFourOptions: records.every((q) => q.options.length === 4),
    allUniqueOptions: records.every((q) => new Set(q.options.map((o) => o.display)).size === 4),
    allStatesDistinctWithinQl: sourceCoverage.every((row) => row.uniqueStemCount === 8),
    sourceCoverageSatisfied: sourceCoverage.every((row) => row.reviewSourceCount >= row.requiredReviewSourceCount),
    examSourcesCovered,
    examReviewRecordCount: examRecords.length,
    realisticBucketCapacity,
    cleanSscFrustumArithmetic,
    multiStepWorked,
    noGenericCrossTermTrapOnPyramid,
    irrelevantPyramidTrapRecords,
    sourceCoverage,
    productLocked: records.every((q) =>
      !q.active &&
      !q.questionStudioDiscoverable &&
      q.questionBankStatus === "NOT_STORED" &&
      q.testEligibility === "INELIGIBLE" &&
      !q.publiclyPublishable),
  } as const;
}
