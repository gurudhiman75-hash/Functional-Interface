import { MEN_CP_010_PERMANENT_ALLOCATION } from "./allocation";
import {
  generateMenCp010ExamReadyEnglishQuestion,
  listMenCp010ExamReadyEnglishSources,
  type MenCp010ExamReadyEnglishQuestion,
} from "./runtime-v3";
import { listMenCp010ExamRealismSourcesV2 } from "./exam-realism-sources-v2";

export const MEN_CP_010_EXAM_REALISM_REVIEW_V2_AUTHORITY =
  "MEN-CP010-EXAM-REALISM-REVIEW-V2" as const;

type QlId = (typeof MEN_CP_010_PERMANENT_ALLOCATION)[number]["qlId"];

const DECLARED_BY_QL = new Map<QlId, string[]>();
for (const source of listMenCp010ExamReadyEnglishSources()) {
  const qlId = source.qlId as QlId;
  const current = DECLARED_BY_QL.get(qlId) ?? [];
  current.push(source.sourceId);
  DECLARED_BY_QL.set(qlId, current);
}
const EXAM_SOURCE_IDS = new Set(listMenCp010ExamRealismSourcesV2().map((row) => row.sourceId));
const SOURCE_SALTS = "abcdefghijklmnopqrstuvwx".split("");
const CANDIDATE_CACHE = new Map<string, readonly MenCp010ExamReadyEnglishQuestion[]>();

function candidatesForPosition(qlId: QlId, targetPosition: number) {
  const cacheKey = `${qlId}:${targetPosition}`;
  const cached = CANDIDATE_CACHE.get(cacheKey);
  if (cached) return cached;

  const candidates: MenCp010ExamReadyEnglishQuestion[] = [];
  const seen = new Set<string>();
  for (let attempt = targetPosition; attempt < 8192 && candidates.length < 512; attempt += 4) {
    const suffix = String(attempt).padStart(5, "0");
    const seeds = [
      `exam-v2-review-${qlId}-${targetPosition}-${suffix}`,
      ...SOURCE_SALTS.map((salt) => `review-v2-${salt}-${qlId}-${targetPosition}-${suffix}`),
    ];
    for (const seed of seeds) {
      const q = generateMenCp010ExamReadyEnglishQuestion(qlId, seed);
      if (q.correctIndex !== targetPosition) continue;
      const identity = `${q.sourceId}|${q.stem}`;
      if (seen.has(identity)) continue;
      seen.add(identity);
      candidates.push(q);
      if (candidates.length >= 512) break;
    }
  }
  if (!candidates.length) throw new Error(`No V2 review candidates for ${qlId} at position ${targetPosition}`);
  CANDIDATE_CACHE.set(cacheKey, candidates);
  return candidates;
}

function requiredHumanSourceCount(declaredCount: number) {
  // The machine freeze proof exercises every declared source. Human review
  // requires at least two distinct representations plus every named exam source.
  return Math.min(2, declaredCount);
}

function buildForQl(qlId: QlId) {
  const selected: MenCp010ExamReadyEnglishQuestion[] = [];
  const usedStems = new Set<string>();
  const usedSources = new Set<string>();
  const declared = [...new Set(DECLARED_BY_QL.get(qlId) ?? [])];
  const requiredSourceCount = requiredHumanSourceCount(declared.length);

  for (let round = 0; round < 2; round += 1) {
    for (let targetPosition = 0; targetPosition < 4; targetPosition += 1) {
      const candidates = candidatesForPosition(qlId, targetPosition);
      const unrepresentedExam = candidates.find((q) =>
        EXAM_SOURCE_IDS.has(q.sourceId) && !usedSources.has(q.sourceId) && !usedStems.has(q.stem),
      );
      const unrepresentedAny = candidates.find((q) =>
        !usedSources.has(q.sourceId) && !usedStems.has(q.stem),
      );
      const distinct = candidates.find((q) => !usedStems.has(q.stem));
      const q = unrepresentedExam ?? unrepresentedAny ?? distinct;
      if (!q) throw new Error(`Cannot select V2 review state for ${qlId}/${targetPosition}/${round}`);
      selected.push(q);
      usedSources.add(q.sourceId);
      usedStems.add(q.stem);
    }
  }

  if (usedSources.size < requiredSourceCount) {
    throw new Error(`${qlId}: review covers ${usedSources.size}/${requiredSourceCount} required human-review sources`);
  }
  return selected;
}

export function buildMenCp010ExamRealismReviewV2() {
  return MEN_CP_010_PERMANENT_ALLOCATION.flatMap((allocation) => buildForQl(allocation.qlId));
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
  const examSourcesCovered = listMenCp010ExamRealismSourcesV2().every((source) =>
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
  const noGenericCrossTermTrapOnPyramid = examRecords
    .filter((q) => q.sourceId.includes("PYRAMID"))
    .every((q) => !q.explanation.traps.some((trap) => /Rr|mixed frustum/i.test(trap)));

  return {
    authority: MEN_CP_010_EXAM_REALISM_REVIEW_V2_AUTHORITY,
    reviewRecordCount: records.length,
    permanentQlCount: new Set(records.map((q) => q.permanentQlId)).size,
    recordsPerQl: records.length / MEN_CP_010_PERMANENT_ALLOCATION.length,
    correctPositions: { A: positions[0], B: positions[1], C: positions[2], D: positions[3] },
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
    sourceCoverage,
    productLocked: records.every((q) =>
      !q.active &&
      !q.questionStudioDiscoverable &&
      q.questionBankStatus === "NOT_STORED" &&
      q.testEligibility === "INELIGIBLE" &&
      !q.publiclyPublishable),
  } as const;
}
