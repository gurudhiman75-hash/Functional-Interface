import {
  MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_AUTHORITY,
  generateMenCp013PermanentEnglishQuestion as generateV1,
  generateMenCp013PermanentEnglishQuestionFromSource as generateV1FromSource,
  listMenCp013PermanentEnglishSources,
  type MenCp013PermanentEnglishQuestion,
} from './runtime-v1';
import { getMenCp013PermanentAllocation, type MenCp013PermanentQlId } from './allocation';

export const MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY =
  'MEN-CP013-PERMANENT-ENGLISH-RUNTIME-V2-SETTER-HARDENED' as const;
export const MEN_CP_013_INVERSE_BASE_AREA_V2_AUTHORITY =
  'MEN-CP013-INVERSE-BASE-AREA-PERMANENT-CORRECTION-V2' as const;

const LABELS=['A','B','C','D'] as const;
type Label=typeof LABELS[number];

export type MenCp013PermanentEnglishQuestionV2 = Omit<MenCp013PermanentEnglishQuestion,'authority'> & {
  readonly authority:typeof MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY;
  readonly sourceRuntimeAuthority:typeof MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_AUTHORITY|string;
};

function trailing(seed:string){const m=/(\d+)$/.exec(seed);return m?Number(m[1]):0;}
function tidy(n:number){return Number.isInteger(n)?`${n}`:n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');}

function inverseBaseArea(qlId:MenCp013PermanentQlId,seed:string):MenCp013PermanentEnglishQuestionV2{
  const allocation=getMenCp013PermanentAllocation(qlId);
  if(allocation.clusterId!=='DISPLACEMENT_INVERSE_BASE_AREA')throw new Error(`${qlId}: not inverse base-area family`);
  const index=trailing(seed),correctIndex=index%4;
  const areas=[84,96,120,144,150,168,180,210,225,240,300,360];
  const rises=[2,3,4,5,6];
  const area=areas[Math.floor(index/4)%areas.length]!;
  const rise=rises[Math.floor(index/48)%rises.length]!;
  const displaced=area*rise;
  const answer=`${area} cm²`;
  const candidateNumbers=[area*rise,area/rise,area*2,area*3,area+rise*10,Math.max(1,area-rise*10)];
  const wrong=[...new Set(candidateNumbers.map(v=>`${tidy(v)} cm²`).filter(v=>v!==answer))].slice(0,3);
  if(wrong.length!==3)throw new Error(`${qlId}/${seed}: could not build inverse-area distractors`);
  let wi=0;
  const options=LABELS.map((label,pos)=>pos===correctIndex
    ? {label,display:answer,isCorrect:true,misconceptionId:null}
    : {label,display:wrong[wi++]!,isCorrect:false,misconceptionId:`CP013-INV-AREA-V2-M${wi}`});
  return {
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY,
    sourceRuntimeAuthority:MEN_CP_013_INVERSE_BASE_AREA_V2_AUTHORITY,
    packageId:'MEN-002',canonicalProblemId:'MEN-CP-013',permanentQlId:qlId,
    templateId:allocation.templateId,solveModeId:allocation.solveModeId,clusterId:allocation.clusterId,title:allocation.title,
    language:'en',seed,sourceId:'CP013-W2-INVERSE-TANK-BASE-AREA',sourceAuthority:MEN_CP_013_INVERSE_BASE_AREA_V2_AUTHORITY,
    stem:`A fully immersed solid displaces ${displaced} cm³ of water in a tank and raises the water level by ${rise} cm. Find the area of the tank's horizontal base.`,
    options:options as readonly {label:Label;display:string;isCorrect:boolean;misconceptionId:string|null}[],correctIndex,answer,
    explanation:{
      keyRule:allocation.governingInference,
      steps:[
        {title:'Relate displacement to level rise',body:'Displaced volume = horizontal base area × rise in water level.'},
        {title:'Substitute the observations',body:`${displaced} = A × ${rise}.`},
        {title:'Recover the base area',body:`A = ${displaced} ÷ ${rise} = ${area} cm².`},
        {title:'Check dimensions',body:'cm³ ÷ cm = cm², which matches a base-area answer.'},
      ],
      shortcut:'Tank base area = displaced volume ÷ level rise.',
      traps:['Do not multiply displaced volume by the level rise.','Do not report a length unit: the target is an area.'],
    },
    verification:{valid:area*rise===displaced,method:'exact displacement-volume/base-area identity'},
    maturity:'PERMANENT_ENGLISH_RUNTIME_CANDIDATE',reviewStatus:'AWAITING_HUMAN_ENGLISH_REVIEW',englishImplementationFrozen:false,
    active:false,questionStudioDiscoverable:false,questionBankStatus:'NOT_STORED',testEligibility:'INELIGIBLE',publiclyPublishable:false,
  };
}

function wrapV1(q:MenCp013PermanentEnglishQuestion):MenCp013PermanentEnglishQuestionV2{
  return {...q,authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY,sourceRuntimeAuthority:q.authority};
}

export function generateMenCp013PermanentEnglishQuestionV2(qlId:MenCp013PermanentQlId,seed:string){
  const allocation=getMenCp013PermanentAllocation(qlId);
  return allocation.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA' ? inverseBaseArea(qlId,seed) : wrapV1(generateV1(qlId,seed));
}

export function generateMenCp013PermanentEnglishQuestionFromSourceV2(qlId:MenCp013PermanentQlId,sourceId:string,seed:string){
  const allocation=getMenCp013PermanentAllocation(qlId);
  if(allocation.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA'){
    if(sourceId!=='CP013-W2-INVERSE-TANK-BASE-AREA')throw new Error(`${sourceId} not owned by ${qlId}`);
    return inverseBaseArea(qlId,seed);
  }
  return wrapV1(generateV1FromSource(qlId,sourceId,seed));
}

export { listMenCp013PermanentEnglishSources };
