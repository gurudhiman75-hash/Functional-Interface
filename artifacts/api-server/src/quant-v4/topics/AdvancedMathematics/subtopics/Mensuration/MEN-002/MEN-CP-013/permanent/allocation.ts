import {
  MEN_CP_013_CANONICAL_CLUSTERS,
  type MenCp013CanonicalClusterId,
} from '../../cp013-foundation/merge-split-v2';

export const MEN_CP_013_PERMANENT_ALLOCATION_AUTHORITY =
  'MEN-CP013-PERMANENT-ALLOCATION-V2' as const;

export const MEN_CP_013_PERMANENT_QL_IDS = Array.from(
  {length:15},
  (_unused,index)=>`MEN-002-QL-${String(163+index).padStart(3,'0')}`,
) as readonly `MEN-002-QL-${string}`[];

export type MenCp013PermanentQlId=`MEN-002-QL-${string}`;
export type MenCp013PermanentAnswerSemantic =
  | 'VOLUME' | 'SURFACE_AREA' | 'LENGTH' | 'AREA' | 'COUNT' | 'CAPACITY' | 'RATIO' | 'LENGTH_OR_RATIO';

export interface MenCp013PermanentAllocationEntry {
  readonly authority:typeof MEN_CP_013_PERMANENT_ALLOCATION_AUTHORITY;
  readonly packageId:'MEN-002';
  readonly cpId:'MEN-CP-013';
  readonly qlId:MenCp013PermanentQlId;
  readonly templateId:`MEN-CP013-TPL-${string}`;
  readonly solveModeId:`MEN-CP013-SM-${string}`;
  readonly clusterId:MenCp013CanonicalClusterId;
  readonly title:string;
  readonly governingInference:string;
  readonly sourceIds:readonly string[];
  readonly answerSemantic:MenCp013PermanentAnswerSemantic;
  readonly permanentIdentityFrozen:true;
  readonly solveModeFrozen:true;
  readonly englishImplementationFrozen:false;
  readonly active:false;
  readonly questionStudioDiscoverable:false;
  readonly questionBankStatus:'NOT_STORED';
  readonly testEligibility:'INELIGIBLE';
  readonly publiclyPublishable:false;
}

function answerSemantic(clusterId:MenCp013CanonicalClusterId):MenCp013PermanentAnswerSemantic{
  if(clusterId==='INSCRIBED_AXIS_ALIGNED_CONTAINMENT') return 'LENGTH_OR_RATIO';
  const cluster=MEN_CP_013_CANONICAL_CLUSTERS.find(row=>row.clusterId===clusterId);
  if(!cluster) throw new Error(`Missing CP013 cluster ${clusterId}`);
  return cluster.answerSemantic;
}

export const MEN_CP_013_PERMANENT_ALLOCATION:readonly MenCp013PermanentAllocationEntry[]=
  MEN_CP_013_CANONICAL_CLUSTERS.map((cluster,index)=>({
    authority:MEN_CP_013_PERMANENT_ALLOCATION_AUTHORITY,
    packageId:'MEN-002' as const,
    cpId:'MEN-CP-013' as const,
    qlId:MEN_CP_013_PERMANENT_QL_IDS[index]!,
    templateId:`MEN-CP013-TPL-${String(index+1).padStart(3,'0')}` as const,
    solveModeId:`MEN-CP013-SM-${String(index+1).padStart(3,'0')}` as const,
    clusterId:cluster.clusterId,
    title:cluster.title,
    governingInference:cluster.governingInference,
    sourceIds:cluster.sourceIds,
    answerSemantic:answerSemantic(cluster.clusterId),
    permanentIdentityFrozen:true as const,
    solveModeFrozen:true as const,
    englishImplementationFrozen:false as const,
    active:false as const,
    questionStudioDiscoverable:false as const,
    questionBankStatus:'NOT_STORED' as const,
    testEligibility:'INELIGIBLE' as const,
    publiclyPublishable:false as const,
  }));

const byQl=new Map(MEN_CP_013_PERMANENT_ALLOCATION.map(row=>[row.qlId,row]));
const byCluster=new Map(MEN_CP_013_PERMANENT_ALLOCATION.map(row=>[row.clusterId,row]));

export function getMenCp013PermanentAllocation(qlId:MenCp013PermanentQlId){
  const row=byQl.get(qlId);
  if(!row) throw new Error(`Unknown MEN-CP-013 permanent QL ${qlId}`);
  return row;
}

export function getMenCp013PermanentAllocationForCluster(clusterId:MenCp013CanonicalClusterId){
  const row=byCluster.get(clusterId);
  if(!row) throw new Error(`Unknown MEN-CP-013 canonical cluster ${clusterId}`);
  return row;
}

export function auditMenCp013PermanentAllocation(){
  const qlIds=MEN_CP_013_PERMANENT_ALLOCATION.map(row=>row.qlId);
  const expected=Array.from({length:15},(_u,index)=>`MEN-002-QL-${String(163+index).padStart(3,'0')}`);
  return {
    authority:MEN_CP_013_PERMANENT_ALLOCATION_AUTHORITY,
    permanentQlCount:MEN_CP_013_PERMANENT_ALLOCATION.length,
    firstQlId:qlIds[0],
    lastQlId:qlIds.at(-1),
    uniqueQlCount:new Set(qlIds).size,
    uniqueTemplateCount:new Set(MEN_CP_013_PERMANENT_ALLOCATION.map(row=>row.templateId)).size,
    uniqueSolveModeCount:new Set(MEN_CP_013_PERMANENT_ALLOCATION.map(row=>row.solveModeId)).size,
    contiguousQlRange:JSON.stringify(qlIds)===JSON.stringify(expected),
    sourceMappingCount:MEN_CP_013_PERMANENT_ALLOCATION.flatMap(row=>row.sourceIds).length,
    englishImplementationFrozen:MEN_CP_013_PERMANENT_ALLOCATION.every(row=>row.englishImplementationFrozen),
    lifecycleLocked:MEN_CP_013_PERMANENT_ALLOCATION.every(row=>row.permanentIdentityFrozen&&row.solveModeFrozen&&!row.active&&!row.questionStudioDiscoverable&&row.questionBankStatus==='NOT_STORED'&&row.testEligibility==='INELIGIBLE'&&!row.publiclyPublishable),
  } as const;
}
