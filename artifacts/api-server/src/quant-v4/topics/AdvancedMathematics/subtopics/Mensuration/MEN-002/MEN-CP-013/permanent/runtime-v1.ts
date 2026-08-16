import { generateMenCp013QuestionV2 } from '../../cp013-foundation/presentation-v2';
import type { MenCp013CanonicalClusterId } from '../../cp013-foundation/merge-split-v2';
import {
  MEN_CP_013_PERMANENT_ALLOCATION,
  getMenCp013PermanentAllocation,
  type MenCp013PermanentQlId,
} from './allocation';

export const MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_AUTHORITY =
  'MEN-CP013-PERMANENT-ENGLISH-RUNTIME-V1-CANDIDATE' as const;
export const MEN_CP_013_INVERSE_BASE_AREA_CORRECTION_AUTHORITY =
  'MEN-CP013-INVERSE-BASE-AREA-PERMANENT-CORRECTION-V1' as const;

const LABELS=['A','B','C','D'] as const;
type Label=typeof LABELS[number];

export interface MenCp013PermanentEnglishQuestion {
  readonly authority:typeof MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_AUTHORITY;
  readonly packageId:'MEN-002';
  readonly canonicalProblemId:'MEN-CP-013';
  readonly permanentQlId:MenCp013PermanentQlId;
  readonly templateId:string;
  readonly solveModeId:string;
  readonly clusterId:MenCp013CanonicalClusterId;
  readonly title:string;
  readonly language:'en';
  readonly seed:string;
  readonly sourceId:string;
  readonly sourceAuthority:string;
  readonly stem:string;
  readonly options:readonly {readonly label:Label;readonly display:string;readonly isCorrect:boolean;readonly misconceptionId:string|null}[];
  readonly correctIndex:number;
  readonly answer:string;
  readonly explanation:{
    readonly keyRule:string;
    readonly steps:readonly {readonly title:string;readonly body:string}[];
    readonly shortcut:string;
    readonly traps:readonly string[];
  };
  readonly verification:{readonly valid:boolean;readonly method:string};
  readonly maturity:'PERMANENT_ENGLISH_RUNTIME_CANDIDATE';
  readonly reviewStatus:'AWAITING_HUMAN_ENGLISH_REVIEW';
  readonly englishImplementationFrozen:false;
  readonly active:false;
  readonly questionStudioDiscoverable:false;
  readonly questionBankStatus:'NOT_STORED';
  readonly testEligibility:'INELIGIBLE';
  readonly publiclyPublishable:false;
}

const TEACHING:Readonly<Record<MenCp013CanonicalClusterId,{shortcut:string;traps:readonly [string,string]}>>={
  COMPOSITE_VOLUME_DIRECT:{shortcut:'Decompose the solid, factor common constants such as π, then add only non-overlapping component volumes.',traps:['Do not subtract the common joining face from volume.','Use a hemisphere volume, not a full sphere, when only one half is present.']},
  COMPOSITE_VOLUME_DERIVED_DIMENSION:{shortcut:'Recover the component height from the total geometry first; then apply the normal composite-volume sum.',traps:['Do not use total height as cylinder/cone height when a cap occupies part of it.','Derive the missing component dimension before substituting into volume.']},
  COMPOSITE_SURFACE_EXPOSED:{shortcut:'List the surfaces visible from outside and add only those; a joining face becomes internal.',traps:['Do not count the circular joining face twice.','Surface area and volume use different component formulae.']},
  REMOVED_MATERIAL_VOLUME:{shortcut:'Compute original solid volume and subtract the exact volume of the drilled/carved region.',traps:['Subtract volume, not surface area.','Match the removed region dimensions to the actual bore/carving.']},
  INSCRIBED_AXIS_ALIGNED_CONTAINMENT:{shortcut:'Translate contact with faces into equal diameter/base/height dimensions before calculating the target.',traps:['For a largest sphere in a cube, diameter equals cube edge.','Do not use a body diagonal unless the inscribed geometry actually touches opposite vertices.']},
  INSCRIBED_DIAGONAL_CONTAINMENT:{shortcut:'Use the cube body diagonal as the enclosing sphere diameter, then solve the cube edge.',traps:['A cube body diagonal is a√3, not a√2.','Use the sphere diameter 2r, not radius r, against the body diagonal.']},
  VACANT_SPACE_CONTAINMENT:{shortcut:'Resolve the tight containment dimensions first, then subtract occupied solid volume from container volume.',traps:['Vacant space is container minus inserted solid.','Do not subtract surface areas when the question asks space/volume.']},
  TANK_CAPACITY_DIRECT:{shortcut:'Find the complete internal volume first, then convert cubic units to litres or millilitres once.',traps:['1000 cm³ equals 1 litre.','Do not mix linear-unit conversion with cubic-unit conversion.']},
  DISPLACEMENT_LEVEL_CHANGE_DIRECT:{shortcut:'Displaced or removed volume equals tank base area × change in liquid level.',traps:['Use the tank base area, not total surface area.','For several immersed objects, add their displaced volumes before dividing by base area.']},
  DISPLACEMENT_INVERSE_COUNT:{shortcut:'Find total displaced volume from base area × rise, then divide by one object volume.',traps:['The answer is a whole object count.','Do not reverse total displaced volume and one-object volume.']},
  DISPLACEMENT_INVERSE_DIMENSION:{shortcut:'Recover displaced volume first, equate it to the immersed-object volume, then take the required root.',traps:['A cube side comes from a cube root.','Do not treat level rise itself as the object dimension.']},
  DISPLACEMENT_INVERSE_BASE_AREA:{shortcut:'Tank base area = displaced volume ÷ level rise.',traps:['Divide by the level change; do not multiply.','The requested answer is area, so its unit must be square units.']},
  PARTIAL_FILL_FINAL_LEVEL:{shortcut:'Convert the added/removed liquid volume into a height change using base area, then update the initial level.',traps:['Do not ignore the initial liquid depth.','Check that the final level remains within tank capacity.']},
  OVERFLOW_FROM_HEADROOM:{shortcut:'Compute remaining headroom volume first; overflow equals incoming/displaced volume minus available headroom.',traps:['Only the excess over headroom overflows.','If incoming volume does not exceed headroom, overflow is zero.']},
  CONTAINMENT_SECONDARY_MEASURE:{shortcut:'Solve the containment dimension first, then use that dimension in the requested second-stage measure.',traps:['Do not apply the secondary formula before the containing/inscribed dimension is known.','Surface area is not a containment ratio by itself.']},
};

function trailing(seed:string){const m=/(\d+)$/.exec(seed);return m?Number(m[1]):0;}
function sourceFor(clusterId:MenCp013CanonicalClusterId,seed:string){
  const row=MEN_CP_013_PERMANENT_ALLOCATION.find(item=>item.clusterId===clusterId);
  if(!row)throw new Error(`Missing CP013 allocation for ${clusterId}`);
  const index=Math.floor(trailing(seed)/4)%row.sourceIds.length;
  return row.sourceIds[index]!;
}
function tidy(n:number){return Number.isInteger(n)?`${n}`:n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');}

function correctedInverseBaseArea(seed:string){
  const index=trailing(seed);
  const correctIndex=index%4;
  const areas=[96,120,144,150,180,225,240,300,360,420];
  const rises=[2,3,4,5,6];
  const area=areas[Math.floor(index/4)%areas.length]!;
  const rise=rises[Math.floor(index/40)%rises.length]!;
  const displaced=area*rise;
  const answer=`${area} cm²`;
  const wrong=[`${area*rise} cm²`,`${tidy(area/rise)} cm²`,`${area*2} cm²`];
  let wi=0;
  const options=LABELS.map((label,pos)=>pos===correctIndex
    ? {label,display:answer,isCorrect:true,misconceptionId:null}
    : {label,display:wrong[wi++]!,isCorrect:false,misconceptionId:`CP013-INV-AREA-M${wi}`});
  return {
    sourceAuthority:MEN_CP_013_INVERSE_BASE_AREA_CORRECTION_AUTHORITY,
    stem:`A fully immersed solid displaces ${displaced} cm³ of water in a tank and the water level rises by ${rise} cm. Find the area of the tank's horizontal base.`,
    options,
    correctIndex,
    answer,
    steps:[
      {title:'Use the displacement relation',body:'Displaced volume = tank base area × rise in level.'},
      {title:'Substitute the observed change',body:`${displaced} = A × ${rise}.`},
      {title:'Isolate the base area',body:`A = ${displaced}/${rise} = ${area} cm².`},
      {title:'Check the unit',body:'Volume divided by length gives square centimetres, so the result is an area.'},
    ],
    sourceTraps:['Divide displaced volume by the level rise; multiplying gives the wrong dimension.'],
    verification:{valid:area*rise===displaced,method:'exact displacement-volume/base-area identity'},
  };
}

function sourceQuestion(sourceId:string,seed:string){
  if(sourceId==='CP013-W2-INVERSE-TANK-BASE-AREA') return correctedInverseBaseArea(seed);
  const q=generateMenCp013QuestionV2(sourceId,seed);
  return {
    sourceAuthority:q.presentationAuthority,
    stem:q.stem,
    options:q.options,
    correctIndex:q.correctIndex,
    answer:q.answer,
    steps:q.explanation.steps,
    sourceTraps:q.explanation.traps,
    verification:q.verification,
  };
}

function build(qlId:MenCp013PermanentQlId,seed:string,forcedSourceId?:string):MenCp013PermanentEnglishQuestion{
  const allocation=getMenCp013PermanentAllocation(qlId);
  const sourceId=forcedSourceId??sourceFor(allocation.clusterId,seed);
  if(!allocation.sourceIds.includes(sourceId))throw new Error(`${sourceId} is not owned by ${qlId}`);
  const q=sourceQuestion(sourceId,seed);
  const teaching=TEACHING[allocation.clusterId];
  const traps=[...new Set([...q.sourceTraps,...teaching.traps])].slice(0,4);
  const result:MenCp013PermanentEnglishQuestion={
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_AUTHORITY,
    packageId:'MEN-002',canonicalProblemId:'MEN-CP-013',permanentQlId:qlId,
    templateId:allocation.templateId,solveModeId:allocation.solveModeId,clusterId:allocation.clusterId,title:allocation.title,
    language:'en',seed,sourceId,sourceAuthority:q.sourceAuthority,stem:q.stem,
    options:q.options.map(option=>({label:option.label as Label,display:option.display,isCorrect:option.isCorrect,misconceptionId:option.misconception??null})),
    correctIndex:q.correctIndex,answer:q.answer,
    explanation:{keyRule:allocation.governingInference,steps:q.steps,shortcut:teaching.shortcut,traps},
    verification:q.verification,
    maturity:'PERMANENT_ENGLISH_RUNTIME_CANDIDATE',reviewStatus:'AWAITING_HUMAN_ENGLISH_REVIEW',englishImplementationFrozen:false,
    active:false,questionStudioDiscoverable:false,questionBankStatus:'NOT_STORED',testEligibility:'INELIGIBLE',publiclyPublishable:false,
  };
  if(!result.verification.valid)throw new Error(`${qlId}/${seed}: verification failed`);
  if(result.options.length!==4||new Set(result.options.map(o=>o.display)).size!==4)throw new Error(`${qlId}/${seed}: option contract failed`);
  if(result.options.filter(o=>o.isCorrect).length!==1||result.options[result.correctIndex]?.display!==result.answer)throw new Error(`${qlId}/${seed}: answer parity failed`);
  return result;
}

export function generateMenCp013PermanentEnglishQuestion(qlId:MenCp013PermanentQlId,seed:string){return build(qlId,seed)}
export function generateMenCp013PermanentEnglishQuestionFromSource(qlId:MenCp013PermanentQlId,sourceId:string,seed:string){return build(qlId,seed,sourceId)}
export function listMenCp013PermanentEnglishSources(){return MEN_CP_013_PERMANENT_ALLOCATION.map(row=>({qlId:row.qlId,clusterId:row.clusterId,sources:row.sourceIds}))}
