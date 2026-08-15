import {
  generateMenCp010ExamReadyEnglishQuestion,
  type MenCp010ExamReadyEnglishQuestion,
} from "./runtime-v3";
import {
  getMenCp010PermanentAllocation,
  type MenCp010PermanentQlId,
} from "./allocation";

export const MEN_CP_010_PERMANENT_ENGLISH_FREEZE_V2_AUTHORITY =
  "MEN-CP010-PERMANENT-ENGLISH-FREEZE-V2-EXAM-REALISM" as const;

export type MenCp010FrozenEnglishQuestionV2 = Omit<
  MenCp010ExamReadyEnglishQuestion,
  "authority" | "sourceRuntimeAuthority" | "maturity" | "reviewStatus" | "englishImplementationFrozen"
> & {
  readonly authority: typeof MEN_CP_010_PERMANENT_ENGLISH_FREEZE_V2_AUTHORITY;
  readonly sourceRuntimeAuthority: MenCp010ExamReadyEnglishQuestion["authority"];
  readonly maturity: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "EXAM_REALISM_REVIEW_APPROVED";
  readonly englishImplementationFrozen: true;
};

export function generateMenCp010FrozenEnglishQuestionV2(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010FrozenEnglishQuestionV2 {
  const allocation = getMenCp010PermanentAllocation(qlId);
  const reviewed = generateMenCp010ExamReadyEnglishQuestion(qlId, seed);
  if (!allocation.englishImplementationFrozen) {
    throw new Error(`${qlId}: permanent allocation is not English frozen`);
  }
  if (
    reviewed.permanentQlId !== allocation.qlId ||
    reviewed.templateId !== allocation.templateId ||
    reviewed.solveModeId !== allocation.solveModeId ||
    reviewed.clusterId !== allocation.clusterId
  ) {
    throw new Error(`${qlId}/${seed}: V2 frozen runtime identity drift`);
  }
  if (!reviewed.verification.valid) throw new Error(`${qlId}/${seed}: V2 verifier failure`);
  if (
    reviewed.active ||
    reviewed.questionStudioDiscoverable ||
    reviewed.questionBankStatus !== "NOT_STORED" ||
    reviewed.testEligibility !== "INELIGIBLE" ||
    reviewed.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${seed}: exam-realism freeze must not activate product lifecycle`);
  }
  return {
    ...reviewed,
    authority: MEN_CP_010_PERMANENT_ENGLISH_FREEZE_V2_AUTHORITY,
    sourceRuntimeAuthority: reviewed.authority,
    maturity: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "EXAM_REALISM_REVIEW_APPROVED",
    englishImplementationFrozen: true,
  };
}
