import { MEN_CP_010_PERMANENT_ALLOCATION } from "./allocation";
import {
  generateMenCp010PermanentEnglishQuestion,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime";

export const MEN_CP_010_PERMANENT_ENGLISH_REVIEW_AUTHORITY =
  "MEN-CP010-PERMANENT-ENGLISH-REVIEW-V1" as const;

function findForPosition(
  qlId: (typeof MEN_CP_010_PERMANENT_ALLOCATION)[number]["qlId"],
  targetPosition: number,
): MenCp010PermanentEnglishQuestion {
  for (let attempt = 0; attempt < 2048; attempt += 1) {
    const seed = `review-${targetPosition}-${String(attempt).padStart(4, "0")}`;
    const q = generateMenCp010PermanentEnglishQuestion(qlId, seed);
    if (q.correctIndex === targetPosition) return q;
  }
  throw new Error(`Unable to build balanced review record for ${qlId} at answer position ${targetPosition}`);
}

export function buildMenCp010PermanentEnglishReview() {
  const records: MenCp010PermanentEnglishQuestion[] = [];
  for (const allocation of MEN_CP_010_PERMANENT_ALLOCATION) {
    for (let targetPosition = 0; targetPosition < 4; targetPosition += 1) {
      records.push(findForPosition(allocation.qlId, targetPosition));
    }
  }
  return records;
}

export function auditMenCp010PermanentEnglishReview() {
  const records = buildMenCp010PermanentEnglishReview();
  const positions = [0, 0, 0, 0];
  for (const q of records) positions[q.correctIndex] += 1;
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
