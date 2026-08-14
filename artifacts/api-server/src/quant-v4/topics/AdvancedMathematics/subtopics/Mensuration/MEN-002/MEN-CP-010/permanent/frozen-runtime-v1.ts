import {
  generateMenCp010PermanentEnglishQuestion as generateReviewedMenCp010PermanentEnglishQuestion,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime-v2";
import {
  getMenCp010PermanentAllocation,
  type MenCp010PermanentQlId,
} from "./allocation";

export const MEN_CP_010_PERMANENT_ENGLISH_FREEZE_AUTHORITY =
  "MEN-CP010-PERMANENT-ENGLISH-FREEZE-V1" as const;

export type MenCp010FrozenEnglishQuestion = Omit<
  MenCp010PermanentEnglishQuestion,
  | "authority"
  | "maturity"
  | "reviewStatus"
  | "englishImplementationFrozen"
> & {
  readonly authority: typeof MEN_CP_010_PERMANENT_ENGLISH_FREEZE_AUTHORITY;
  readonly sourceRuntimeAuthority: MenCp010PermanentEnglishQuestion["authority"];
  readonly maturity: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "ENGLISH_REVIEW_APPROVED";
  readonly englishImplementationFrozen: true;
};

export function generateMenCp010FrozenEnglishQuestion(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010FrozenEnglishQuestion {
  const allocation = getMenCp010PermanentAllocation(qlId);
  const reviewed = generateReviewedMenCp010PermanentEnglishQuestion(qlId, seed);

  if (!allocation.englishImplementationFrozen) {
    throw new Error(`${qlId}: permanent allocation is not English frozen`);
  }
  if (
    reviewed.permanentQlId !== allocation.qlId ||
    reviewed.templateId !== allocation.templateId ||
    reviewed.solveModeId !== allocation.solveModeId ||
    reviewed.clusterId !== allocation.clusterId
  ) {
    throw new Error(`${qlId}/${seed}: frozen runtime identity drift`);
  }
  if (!reviewed.verification.valid) {
    throw new Error(`${qlId}/${seed}: frozen runtime verifier failure`);
  }
  if (
    reviewed.active ||
    reviewed.questionStudioDiscoverable ||
    reviewed.questionBankStatus !== "NOT_STORED" ||
    reviewed.testEligibility !== "INELIGIBLE" ||
    reviewed.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${seed}: English freeze must not activate product lifecycle`);
  }

  return {
    ...reviewed,
    authority: MEN_CP_010_PERMANENT_ENGLISH_FREEZE_AUTHORITY,
    sourceRuntimeAuthority: reviewed.authority,
    maturity: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "ENGLISH_REVIEW_APPROVED",
    englishImplementationFrozen: true,
  };
}
