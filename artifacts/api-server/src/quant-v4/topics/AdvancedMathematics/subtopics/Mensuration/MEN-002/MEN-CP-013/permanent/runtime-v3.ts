import {
  generateMenCp013PermanentEnglishQuestionV2,
  generateMenCp013PermanentEnglishQuestionFromSourceV2,
  listMenCp013PermanentEnglishSources,
  type MenCp013PermanentEnglishQuestionV2,
} from './runtime-v2';
import { getMenCp013PermanentAllocation, type MenCp013PermanentQlId } from './allocation';
import type { MenCp013CanonicalClusterId } from '../../cp013-foundation/merge-split-v2';

export const MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY =
  'MEN-CP013-PERMANENT-ENGLISH-RUNTIME-V3-SETTER-HARDENED' as const;
export const MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY =
  'MEN-CP013-PERMANENT-SETTER-CORRECTIONS-V3' as const;

const LABELS=['A','B','C','D'] as const;
type Label=typeof LABELS[number];
export type MenCp013PermanentEnglishQuestionV3=Omit<MenCp013PermanentEnglishQuestionV2,'authority'> & {
  readonly authority:typeof MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY;
  readonly setterAuthority:typeof MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY;
};

const TRAPS:Readonly<Record<MenCp013CanonicalClusterId,readonly [string,string]>>={
  COMPOSITE_VOLUME_DIRECT:['Use the actual component volumes; a common joining face does not change volume.','A hemispherical cap contributes half a sphere, while two hemispheres make one sphere.'],
  COMPOSITE_VOLUME_DERIVED_DIMENSION:['Derive the component height from the total geometry before using the volume formula.','Do not use total external height as a cylinder/cone height when a cap occupies part of it.'],
  COMPOSITE_SURFACE_EXPOSED:['Count only surfaces exposed to the outside.','The common joining face is internal and must not be counted as exposed area.'],
  REMOVED_MATERIAL_VOLUME:['Remaining material = original solid volume − removed region volume.','Do not substitute a surface-area difference when the question asks volume.'],
  INSCRIBED_AXIS_ALIGNED_CONTAINMENT:['Translate the actual contact condition into diameter/base/height equality first.','Do not introduce a face/body diagonal unless the containment geometry requires it.'],
  INSCRIBED_DIAGONAL_CONTAINMENT:['For a cube inside a sphere, the cube body diagonal is a√3.','Match the body diagonal to the sphere diameter 2r, not to the radius.'],
  VACANT_SPACE_CONTAINMENT:['Vacant space = container volume − inscribed-solid volume.','Resolve the tight containment dimensions before subtracting volumes.'],
  TANK_CAPACITY_DIRECT:['Compute internal volume before converting to litres.','Remember that 1000 cm³ = 1 litre; cubic conversion is not a simple linear conversion.'],
  DISPLACEMENT_LEVEL_CHANGE_DIRECT:['Displaced/removed volume = tank base area × level change.','For multiple immersed objects, add their displaced volumes before dividing by base area.'],
  DISPLACEMENT_INVERSE_COUNT:['Total displaced volume divided by one-object volume gives the whole-number count.','Do not use a linear radius ratio for a three-dimensional object count.'],
  DISPLACEMENT_INVERSE_DIMENSION:['Equate displaced volume to the immersed-object volume, then take the required root.','A cube side requires a cube root, not a square root.'],
  DISPLACEMENT_INVERSE_BASE_AREA:['Base area = displaced volume ÷ level rise.','The result must carry square units, not a length or volume unit.'],
  PARTIAL_FILL_FINAL_LEVEL:['Convert added/removed volume to a height change, then update the initial level.','Do not report only the rise when the question asks final depth.'],
  OVERFLOW_FROM_HEADROOM:['Find remaining headroom volume before calculating overflow.','Only the volume exceeding headroom overflows.'],
  CONTAINMENT_SECONDARY_MEASURE:['Resolve the containment dimension first, then apply the second-stage measure formula.','Do not treat surface area itself as a containment ratio.'],
};

function trailing(seed:string){const m=/(\d+)$/.exec(seed);return m?Number(m[1]):0;}
function tidy(n:number){return Number.isInteger(n)?`${n}`:n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');}
function normalizePi(text:string){return text.replace(/\b(\d+)\/(\d+)π\b/g,'($1π/$2)');}
function misconceptionOptions(answer:string,correctIndex:number,wrong:readonly string[],prefix:string){
  const unique=[...new Set(wrong.filter(value=>value!==answer))];
  if(unique.length<3)throw new Error(`${prefix}: insufficient distinct distractors`);
  let wi=0;
  return LABELS.map((label,index)=>index===correctIndex
    ? {label,display:answer,isCorrect:true,misconceptionId:null}
    : {label,display:unique[wi++]!,isCorrect:false,misconceptionId:`${prefix}-M${wi}`});
}

function customDiagonal(qlId:MenCp013PermanentQlId,seed:string):MenCp013PermanentEnglishQuestionV3{
  const allocation=getMenCp013PermanentAllocation(qlId),index=trailing(seed),correctIndex=index%4;
  const edges=[4,6,8,10,12,14,16,18];
  const edge=edges[Math.floor(index/4)%edges.length]!;
  const answer=`${edge}√3 cm`;
  const options=misconceptionOptions(answer,correctIndex,[`${edge}√2 cm`,`${edge} cm`,`${2*edge} cm`],'CP013-DIAGONAL-V3');
  return {
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY,setterAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    sourceRuntimeAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    packageId:'MEN-002',canonicalProblemId:'MEN-CP-013',permanentQlId:qlId,templateId:allocation.templateId,solveModeId:allocation.solveModeId,clusterId:allocation.clusterId,title:allocation.title,
    language:'en',seed,sourceId:'CP013-W2-LARGEST-CUBE-IN-SPHERE',sourceAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    stem:`A cube of edge ${edge} cm is inscribed in a sphere. Find the sphere's diameter.`,options,correctIndex,answer,
    explanation:{keyRule:allocation.governingInference,steps:[
      {title:'Identify the contact line',body:'The sphere passes through the cube vertices, so the sphere diameter equals the cube body diagonal.'},
      {title:'Use the body diagonal',body:`For cube edge ${edge} cm, body diagonal = ${edge}√3 cm.`},
      {title:'Match the sphere diameter',body:`Therefore 2r = ${edge}√3 cm.`},
      {title:'State the requested diameter',body:`Sphere diameter = ${answer}.`},
    ],shortcut:'For a cube inscribed in a sphere: sphere diameter = cube body diagonal = a√3.',traps:TRAPS[allocation.clusterId]},
    verification:{valid:true,method:'exact cube-body-diagonal containment identity'},
    maturity:'PERMANENT_ENGLISH_RUNTIME_CANDIDATE',reviewStatus:'AWAITING_HUMAN_ENGLISH_REVIEW',englishImplementationFrozen:false,active:false,questionStudioDiscoverable:false,questionBankStatus:'NOT_STORED',testEligibility:'INELIGIBLE',publiclyPublishable:false,
  };
}

function customMultiSphere(qlId:MenCp013PermanentQlId,sourceId:string,seed:string):MenCp013PermanentEnglishQuestionV3{
  const allocation=getMenCp013PermanentAllocation(qlId),index=trailing(seed),correctIndex=index%4,variant=Math.floor(index/4);
  const n=[3,6,9,12][variant%4]!;
  const sourceBacked=sourceId==='CP013-W3-SSC-MULTI-STONE-RISE';
  const length=sourceBacked?56:[49,98,77,196][variant%4]!;
  const breadth=sourceBacked?77:[44,22,28,11][variant%4]!;
  const base=length*breadth;
  const oneSphere=4312/3; // r=7, pi=22/7
  const displaced=n*oneSphere;
  const rise=displaced/base;
  if(!Number.isInteger(rise))throw new Error(`${sourceId}/${seed}: non-integral setter rise`);
  const answer=`${rise} cm`;
  const candidates=[rise/2,rise*2,rise+1,rise+2,rise*3].filter(v=>v>0).map(v=>`${tidy(v)} cm`);
  const options=misconceptionOptions(answer,correctIndex,candidates,`${sourceId}-V3`);
  const objectWord=sourceBacked?'metal balls':'solid spherical stones';
  return {
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY,setterAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,sourceRuntimeAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    packageId:'MEN-002',canonicalProblemId:'MEN-CP-013',permanentQlId:qlId,templateId:allocation.templateId,solveModeId:allocation.solveModeId,clusterId:allocation.clusterId,title:allocation.title,
    language:'en',seed,sourceId,sourceAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    stem:`${n} identical ${objectWord} of radius 7 cm are completely submerged in a rectangular tank with base ${length} cm × ${breadth} cm. Find the rise in water level. Use π = 22/7.`,
    options,correctIndex,answer,
    explanation:{keyRule:allocation.governingInference,steps:[
      {title:'Find one sphere volume',body:'Using π = 22/7 and r = 7 cm, one sphere has volume 4312/3 cm³.'},
      {title:'Add all displaced volume',body:`${n} immersed spheres displace ${tidy(displaced)} cm³ in total.`},
      {title:'Find the tank base area',body:`Base area = ${length} × ${breadth} = ${base} cm².`},
      {title:'Convert displacement to level rise',body:`Rise = ${tidy(displaced)} ÷ ${base} = ${rise} cm.`},
    ],shortcut:'Level rise = total displaced volume ÷ tank base area.',traps:TRAPS[allocation.clusterId]},
    verification:{valid:Math.abs(base*rise-displaced)<1e-9,method:'exact multiple-sphere displacement with π=22/7'},
    maturity:'PERMANENT_ENGLISH_RUNTIME_CANDIDATE',reviewStatus:'AWAITING_HUMAN_ENGLISH_REVIEW',englishImplementationFrozen:false,active:false,questionStudioDiscoverable:false,questionBankStatus:'NOT_STORED',testEligibility:'INELIGIBLE',publiclyPublishable:false,
  };
}

function customInverseCount(qlId:MenCp013PermanentQlId,seed:string):MenCp013PermanentEnglishQuestionV3{
  const allocation=getMenCp013PermanentAllocation(qlId),index=trailing(seed),correctIndex=index%4;
  const counts=[3,4,5,6,7,8,9,10,12,15];
  const count=counts[Math.floor(index/4)%counts.length]!;
  const answer=`${count} spheres`;
  const options=misconceptionOptions(answer,correctIndex,[`${count*2} spheres`,`${count*4} spheres`,`${count*8} spheres`],'CP013-INVERSE-COUNT-V3');
  return {
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY,setterAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,sourceRuntimeAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    packageId:'MEN-002',canonicalProblemId:'MEN-CP-013',permanentQlId:qlId,templateId:allocation.templateId,solveModeId:allocation.solveModeId,clusterId:allocation.clusterId,title:allocation.title,
    language:'en',seed,sourceId:'CP013-W2-INVERSE-SPHERE-COUNT',sourceAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    stem:`A cylindrical vessel of radius 6 cm shows a water-level rise of ${count} cm when identical solid spheres of radius 3 cm are completely immersed. How many spheres were immersed?`,options,correctIndex,answer,
    explanation:{keyRule:allocation.governingInference,steps:[
      {title:'Find total displaced volume',body:`Tank base area is 36π cm², so a ${count} cm rise represents ${36*count}π cm³.`},
      {title:'Find one sphere volume',body:'One sphere of radius 3 cm has volume (4/3)π(3³) = 36π cm³.'},
      {title:'Form the count',body:`Number = ${36*count}π ÷ 36π = ${count}.`},
      {title:'Check discreteness',body:`The result is the whole-number count ${count}.`},
    ],shortcut:'Count = total displaced volume ÷ volume of one immersed sphere.',traps:TRAPS[allocation.clusterId]},
    verification:{valid:true,method:'exact π-cancelling displacement count identity'},
    maturity:'PERMANENT_ENGLISH_RUNTIME_CANDIDATE',reviewStatus:'AWAITING_HUMAN_ENGLISH_REVIEW',englishImplementationFrozen:false,active:false,questionStudioDiscoverable:false,questionBankStatus:'NOT_STORED',testEligibility:'INELIGIBLE',publiclyPublishable:false,
  };
}

function customInverseArea(qlId:MenCp013PermanentQlId,seed:string):MenCp013PermanentEnglishQuestionV3{
  const allocation=getMenCp013PermanentAllocation(qlId),index=trailing(seed),correctIndex=index%4,variant=Math.floor(index/4);
  const areas=[84,96,120,144,150,168,180,210,225,240,300,360];
  const rises=[2,3,4,5,6];
  const area=areas[variant%areas.length]!,rise=rises[variant%rises.length]!,displaced=area*rise,answer=`${area} cm²`;
  const candidates=[area*rise,area/rise,area*2,area*3,area+rise*10].map(v=>`${tidy(v)} cm²`);
  const options=misconceptionOptions(answer,correctIndex,candidates,'CP013-INVERSE-AREA-V3');
  return {
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY,setterAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,sourceRuntimeAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    packageId:'MEN-002',canonicalProblemId:'MEN-CP-013',permanentQlId:qlId,templateId:allocation.templateId,solveModeId:allocation.solveModeId,clusterId:allocation.clusterId,title:allocation.title,
    language:'en',seed,sourceId:'CP013-W2-INVERSE-TANK-BASE-AREA',sourceAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    stem:`A fully immersed solid displaces ${displaced} cm³ of water in a tank and raises the water level by ${rise} cm. Find the area of the tank's horizontal base.`,options,correctIndex,answer,
    explanation:{keyRule:allocation.governingInference,steps:[
      {title:'Use the displacement relation',body:'Displaced volume = horizontal base area × level rise.'},
      {title:'Substitute the observations',body:`${displaced} = A × ${rise}.`},
      {title:'Recover the base area',body:`A = ${displaced} ÷ ${rise} = ${area} cm².`},
      {title:'Check dimensions',body:'cm³ ÷ cm = cm², so the result has the correct area unit.'},
    ],shortcut:'Base area = displaced volume ÷ level rise.',traps:TRAPS[allocation.clusterId]},
    verification:{valid:area*rise===displaced,method:'exact displacement inverse base-area identity'},
    maturity:'PERMANENT_ENGLISH_RUNTIME_CANDIDATE',reviewStatus:'AWAITING_HUMAN_ENGLISH_REVIEW',englishImplementationFrozen:false,active:false,questionStudioDiscoverable:false,questionBankStatus:'NOT_STORED',testEligibility:'INELIGIBLE',publiclyPublishable:false,
  };
}

function polish(q:MenCp013PermanentEnglishQuestionV2):MenCp013PermanentEnglishQuestionV3{
  const normalize=(text:string)=>normalizePi(text);
  return {
    ...q,
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY,
    setterAuthority:MEN_CP_013_SETTER_CORRECTION_V3_AUTHORITY,
    stem:normalize(q.stem),answer:normalize(q.answer),
    options:q.options.map(option=>({...option,display:normalize(option.display)})),
    explanation:{...q.explanation,steps:q.explanation.steps.map(step=>({...step,body:normalize(step.body)})),traps:TRAPS[q.clusterId]},
  };
}

function build(qlId:MenCp013PermanentQlId,seed:string,sourceId?:string):MenCp013PermanentEnglishQuestionV3{
  const allocation=getMenCp013PermanentAllocation(qlId);
  const resolved=sourceId??allocation.sourceIds[Math.floor(trailing(seed)/4)%allocation.sourceIds.length]!;
  let result:MenCp013PermanentEnglishQuestionV3;
  if(allocation.clusterId==='INSCRIBED_DIAGONAL_CONTAINMENT') result=customDiagonal(qlId,seed);
  else if(allocation.clusterId==='DISPLACEMENT_INVERSE_COUNT') result=customInverseCount(qlId,seed);
  else if(allocation.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA') result=customInverseArea(qlId,seed);
  else if(allocation.clusterId==='DISPLACEMENT_LEVEL_CHANGE_DIRECT'&&(resolved==='CP013-W1-MULTI-SPHERE-LEVEL-RISE'||resolved==='CP013-W3-SSC-MULTI-STONE-RISE')) result=customMultiSphere(qlId,resolved,seed);
  else result=polish(sourceId?generateMenCp013PermanentEnglishQuestionFromSourceV2(qlId,resolved,seed):generateMenCp013PermanentEnglishQuestionV2(qlId,seed));
  if(result.options.length!==4||new Set(result.options.map(option=>option.display)).size!==4)throw new Error(`${qlId}/${seed}: V3 option contract failed`);
  if(result.options.filter(option=>option.isCorrect).length!==1||result.options[result.correctIndex]?.display!==result.answer)throw new Error(`${qlId}/${seed}: V3 answer parity failed`);
  if(result.explanation.traps.length!==2)throw new Error(`${qlId}/${seed}: V3 trap curation failed`);
  return result;
}

export function generateMenCp013PermanentEnglishQuestionV3(qlId:MenCp013PermanentQlId,seed:string){return build(qlId,seed)}
export function generateMenCp013PermanentEnglishQuestionFromSourceV3(qlId:MenCp013PermanentQlId,sourceId:string,seed:string){
  const allocation=getMenCp013PermanentAllocation(qlId);
  if(!allocation.sourceIds.includes(sourceId))throw new Error(`${sourceId} not owned by ${qlId}`);
  return build(qlId,seed,sourceId);
}
export { listMenCp013PermanentEnglishSources };
