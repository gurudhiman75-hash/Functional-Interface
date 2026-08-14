import { MEN_CP_010_PERMANENT_ALLOCATION } from "./allocation";
import {
  generateMenCp010PermanentEnglishQuestion,
  listMenCp010PermanentEnglishSources,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime";

export const MEN_CP_010_PERMANENT_ENGLISH_REVIEW_AUTHORITY =
  "MEN-CP010-PERMANENT-ENGLISH-REVIEW-V1" as const;

type QlId = (typeof MEN_CP_010_PERMANENT_ALLOCATION)[number]["qlId"];

const DECLARED_SOURCES = new Map(
  listMenCp010PermanentEnglishSources().map((row) => [row.qlId, row.sources.map((source) => source.id)]),
);

function candidatesForPosition(qlId: QlId, targetPosition: number) {
  const candidates: MenCp010PermanentEnglishQuestion[] = [];
  const seenStems = new Set<string>();
  for (let attempt = targetPosition; attempt < 4096 && candidates.length < 96; attempt += 4) {
    const seed = `review-${qlId}-${targetPosition}-${String(attempt).padStart(4, "0")}`;
    const q = generateMenCp010PermanentEnglishQuestion(qlId, seed);
    if (q.correctIndex !== targetPosition || seenStems.has(q.stem)) continue;
    seenStems.add(q.stem);
    candidates.push(q);
  }
  if (!candidates.length) {
    throw new Error(`Unable to build review candidates for ${qlId} at answer position ${targetPosition}`);
  }
  return candidates;
}

function buildForQl(qlId: QlId) {
  const selected: MenCp010PermanentEnglishQuestion[] = [];
  const usedStems = new Set<string>();
  const usedSources = new Set<string>();

  for (let targetPosition = 0; targetPosition < 4; targetPosition += 1) {
    const candidates = candidatesForPosition(qlId, targetPosition);
    const q = candidates.find((candidate) =>
      !usedStems.has(candidate.stem) && !usedSources.has(candidate.sourceId),
    ) ?? candidates.find((candidate) => !usedStems.has(candidate.stem));
    if (!q) throw new Error(`Unable to select a distinct review state for ${qlId} at position ${targetPosition}`);
    selected.push(q);
    usedStems.add(q.stem);
    usedSources.add(q.sourceId);
  }

  return selected;
}

export function buildMenCp010PermanentEnglishReview() {
  return MEN_CP_010_PERMANENT_ALLOCATION.flatMap((allocation) => buildForQl(allocation.qlId));
}

export function auditMenCp010PermanentEnglishReview() {
  const records = buildMenCp010PermanentEnglishReview();
  const positions = [0, 0, 0, 0];
  for (const q of records) positions[q.correctIndex] += 1;

  const sourceCoverage = MEN_CP_010_PERMANENT_ALLOCATION.map((allocation) => {
    const slice = records.filter((q) => q.permanentQlId === allocation.qlId);
    const declared = DECLARED_SOURCES.get(allocation.qlId) ?? [];
    return {
      qlId: allocation.qlId,
      declaredSourceCount: declared.length,
      reviewSourceCount: new Set(slice.map((q) => q.sourceId)).size,
      requiredReviewSourceCount: Math.min(4, declared.length),
      uniqueStemCount: new Set(slice.map((q) => q.stem)).size,
    };
  });

  const noEngineeringShorthand = records.every((q) =>
    !/pyramid\/frustum|\b(?:a|b|h|l|R|r)=|\b(?:side|height|rate)=/.test(q.stem),
  );
  const naturalPercentageDisplay = records.every((q) =>
    !q.options.some((option) => /\/\d+%/.test(option.display)),
  );
  const capacityUnitsPresent = records
    .filter((q) => q.sourceId === "CP010-D2-APP-BUCKET-CAPACITY-LITRES")
    .every((q) => q.options.every((option) => /litres$/.test(option.display)) && /litres$/.test(q.answer));
  const individualizedTeaching = records.every((q) =>
    q.explanation.steps.some((step) =>
      step.title === "Substitute the given values" && step.body.includes(q.answer),
    ),
  );

  return {
    authority: MEN_CP_010_PERMANENT_ENGLISH_REVIEW_AUTHORITY,
    reviewRecordCount: records.length,
    permanentQlCount: new Set(records.map((q) => q.permanentQlId)).size,
    recordsPerQl: records.length / MEN_CP_010_PERMANENT_ALLOCATION.length,
    correctPositions: {
      A: positions[0],
      B: positions[1],
      C: positions[2],
      D: positions[3],
    },
    allVerified: records.every((q) => q.verification.valid),
    allFourOptions: records.every((q) => q.options.length === 4),
    allUniqueOptions: records.every((q) => new Set(q.options.map((o) => o.display)).size === 4),
    allHaveTeaching: records.every((q) => q.explanation.steps.length >= 4),
    allReviewStatesDistinctWithinQl: sourceCoverage.every((row) => row.uniqueStemCount === 4),
    allReviewSourcesCovered: sourceCoverage.every((row) => row.reviewSourceCount >= row.requiredReviewSourceCount),
    noEngineeringShorthand,
    naturalPercentageDisplay,
    capacityUnitsPresent,
    individualizedTeaching,
    sourceCoverage,
    englishImplementationFrozen: false,
    productLocked: records.every(
      (q) =>
        !q.active &&
        !q.questionStudioDiscoverable &&
        q.questionBankStatus === "NOT_STORED" &&
        q.testEligibility === "INELIGIBLE" &&
        !q.publiclyPublishable,
    ),
  } as const;
}
