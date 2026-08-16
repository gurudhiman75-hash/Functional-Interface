import {
  MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V4_AUTHORITY,
  generateMenCp013PermanentEnglishQuestionV4,
  generateMenCp013PermanentEnglishQuestionFromSourceV4,
  listMenCp013PermanentEnglishSources,
  type MenCp013PermanentEnglishQuestionV4,
} from './runtime-v4';
import {
  getMenCp013PermanentAllocation,
  type MenCp013PermanentQlId,
} from './allocation';

export const MEN_CP_013_PERMANENT_ENGLISH_FREEZE_AUTHORITY =
  'MEN-CP013-PERMANENT-ENGLISH-FREEZE-V1' as const;

export type MenCp013FrozenEnglishQuestion = Omit<
  MenCp013PermanentEnglishQuestionV4,
  'authority' | 'maturity' | 'reviewStatus' | 'englishImplementationFrozen'
> & {
  readonly authority:typeof MEN_CP_013_PERMANENT_ENGLISH_FREEZE_AUTHORITY;
  readonly sourceRuntimeAuthority:typeof MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V4_AUTHORITY;
  readonly maturity:'PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN';
  readonly reviewStatus:'ENGLISH_REVIEW_APPROVED';
  readonly englishImplementationFrozen:true;
};

function freeze(
  qlId:MenCp013PermanentQlId,
  seed:string,
  reviewed:MenCp013PermanentEnglishQuestionV4,
):MenCp013FrozenEnglishQuestion{
  const allocation=getMenCp013PermanentAllocation(qlId);
  if(
    reviewed.permanentQlId!==allocation.qlId ||
    reviewed.templateId!==allocation.templateId ||
    reviewed.solveModeId!==allocation.solveModeId ||
    reviewed.clusterId!==allocation.clusterId
  ) throw new Error(`${qlId}/${seed}: frozen identity drift`);
  if(!reviewed.verification.valid)throw new Error(`${qlId}/${seed}: frozen verifier failure`);
  if(
    reviewed.active ||
    reviewed.questionStudioDiscoverable ||
    reviewed.questionBankStatus!=='NOT_STORED' ||
    reviewed.testEligibility!=='INELIGIBLE' ||
    reviewed.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}: English freeze must not activate product lifecycle`);
  return {
    ...reviewed,
    authority:MEN_CP_013_PERMANENT_ENGLISH_FREEZE_AUTHORITY,
    sourceRuntimeAuthority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V4_AUTHORITY,
    maturity:'PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN',
    reviewStatus:'ENGLISH_REVIEW_APPROVED',
    englishImplementationFrozen:true,
  };
}

export function generateMenCp013FrozenEnglishQuestion(qlId:MenCp013PermanentQlId,seed:string){
  return freeze(qlId,seed,generateMenCp013PermanentEnglishQuestionV4(qlId,seed));
}

export function generateMenCp013FrozenEnglishQuestionFromSource(
  qlId:MenCp013PermanentQlId,
  sourceId:string,
  seed:string,
){
  return freeze(qlId,seed,generateMenCp013PermanentEnglishQuestionFromSourceV4(qlId,sourceId,seed));
}

export { listMenCp013PermanentEnglishSources };
