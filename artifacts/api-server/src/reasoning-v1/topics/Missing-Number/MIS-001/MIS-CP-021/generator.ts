import{MIS_CP021_RULES,misCp021RuleByCandidateId,type MisCp021CandidateId,type MisCp021RuleId}from'./rule-definitions';
import{independentlyEvaluateMisCp021Rule,type MisCp021Group}from'./independent-solver';

export interface MisCp021Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp021Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-021';readonly candidateId:MisCp021CandidateId;readonly provisionalQl:true;
 readonly ruleId:MisCp021RuleId;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Medium'|'Hard';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp021Group[];readonly target:MisCp021Group;readonly options:readonly MisCp021Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:2|3;readonly operandCount:2|3;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp021CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}

type Nearby=MisCp021RuleId|'ABS_DIFFERENCE'|'SUM'|'PRODUCT'|'THREE_PRODUCT'|'PAIR_PRODUCT_PLUS_THIRD'|'PAIR_SUM_TIMES_THIRD';
const NEARBY:readonly Nearby[]=['CUBE_ROOT_OF_DIFFERENCE','PAIR_PRODUCT_PLUS_ONE_TIMES_THIRD','ABS_DIFFERENCE','SUM','PRODUCT','THREE_PRODUCT','PAIR_PRODUCT_PLUS_THIRD','PAIR_SUM_TIMES_THIRD'];

function evalNearby(id:Nearby,inputs:readonly number[]):number|null{
 if(id==='ABS_DIFFERENCE')return inputs.length===2?Math.abs(inputs[0]!-inputs[1]!):null;
 if(id==='SUM')return inputs.length===2?inputs[0]!+inputs[1]!:null;
 if(id==='PRODUCT')return inputs.length===2?inputs[0]!*inputs[1]!:null;
 if(id==='THREE_PRODUCT')return inputs.length===3?inputs[0]!*inputs[1]!*inputs[2]!:null;
 if(id==='PAIR_PRODUCT_PLUS_THIRD')return inputs.length===3?inputs[0]!*inputs[1]!+inputs[2]!:null;
 if(id==='PAIR_SUM_TIMES_THIRD')return inputs.length===3?(inputs[0]!+inputs[1]!)*inputs[2]!:null;
 return independentlyEvaluateMisCp021Rule(id,inputs);
}
function audit(id:MisCp021RuleId,evidence:readonly MisCp021Group[]){
 const survivors=NEARBY.filter(r=>evidence.every(g=>evalNearby(r,g.inputs)===g.result));
 return survivors.length===1&&survivors[0]===id
  ?{accepted:true,survivingRules:survivors,reason:'Exactly one nearby source grammar rule survives all evidence rows.'}
  :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups(id:MisCp021RuleId):MisCp021Group[]{
 const out:MisCp021Group[]=[];
 if(id==='CUBE_ROOT_OF_DIFFERENCE'){
  for(let root=3;root<=12;root++)for(let low=40;low<=500;low+=7){
   const diff=root*root*root,high=low+diff;if(high>999)continue;
   out.push({inputs:[high,low],result:root});
  }
 }else{
  for(let a=2;a<=12;a++)for(let b=2;b<=12;b++)for(let c=1;c<=9;c++){
   const result=independentlyEvaluateMisCp021Rule(id,[a,b,c]);
   if(result&&result<=500&&![a,b,c].includes(result))out.push({inputs:[a,b,c],result});
  }
 }
 return out;
}
function distractors(id:MisCp021RuleId,g:MisCp021Group):MisCp021Option[]{
 const out:MisCp021Option[]=[];const add=(v:number|null,l:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 if(id==='CUBE_ROOT_OF_DIFFERENCE'){
  const [a,b]=g.inputs,d=Math.abs(a!-b!);
  add(d,'USED_RAW_DIFFERENCE');add(Math.round(Math.sqrt(d)),'USED_SQUARE_ROOT');add(Math.round(Math.cbrt(a!)),'ROOTED_FIRST_INPUT');add(Math.round(Math.cbrt(b!)),'ROOTED_SECOND_INPUT');
 }else{
  const [a,b,c]=g.inputs;
  add(a!*b!*c!,'OMITTED_PLUS_ONE');add(a!*b!+c!,'ADDED_THIRD_AFTER_PRODUCT');add((a!+b!)*c!,'USED_PAIR_SUM_TIMES_THIRD');add((a!*b!+1)+c!,'ADDED_THIRD_INSTEAD_OF_MULTIPLYING');
 }
 return out;
}
function select(id:MisCp021RuleId,seed:string){
 const gs=shuffle(groups(id),seed+':groups');
 for(let i=0;i<Math.min(gs.length,80);i++)for(let j=i+1;j<Math.min(gs.length,220);j++){
  const evidence=[gs[i]!,gs[j]!];if(evidence[0]!.result===evidence[1]!.result)continue;const ambiguity=audit(id,evidence);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(id,g).length>=3);
  if(target)return{evidence,target,ambiguity};
 }
 throw new Error('Unable to construct CP021 '+id);
}
function words(id:MisCp021RuleId):string{
 if(id==='CUBE_ROOT_OF_DIFFERENCE')return'Subtract the smaller displayed number from the larger one, then take the exact cube root.';
 return'Multiply the first two numbers, add 1 to that product, then multiply by the third number.';
}
function calc(id:MisCp021RuleId,g:MisCp021Group):string{
 if(id==='CUBE_ROOT_OF_DIFFERENCE'){
  const [a,b]=g.inputs,d=Math.abs(a!-b!);return`|${a}−${b}|=${d}; ∛${d}=${g.result}`;
 }
 const [a,b,c]=g.inputs,p=a!*b!;return`${a}×${b}=${p}; ${p}+1=${p+1}; ${p+1}×${c}=${g.result}`;
}
function row(g:MisCp021Group,hide=false){return[...g.inputs,hide?'?':g.result].join('   ');}
export function generateMisCp021Question(candidateId:MisCp021CandidateId,seed:string|number='mis-cp021-v1'):GeneratedMisCp021Question{
 const rule=misCp021RuleByCandidateId(candidateId),base=String(seed),sel=select(rule.ruleId,base),wrong=shuffle(distractors(rule.ruleId,sel.target),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP021 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const stem=['Study the pattern and find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['The same rule is used in every row.',words(rule.ruleId),'','Row 1:',calc(rule.ruleId,sel.evidence[0]!),'','Row 2:',calc(rule.ruleId,sel.evidence[1]!),'','Now apply the same rule:',calc(rule.ruleId,sel.target),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-021',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,difficulty:rule.difficulty,renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g)),calc(rule.ruleId,sel.target)],ambiguityAudit:sel.ambiguity,structuralFingerprint:['MIS-CP-021',rule.ruleId,'SOURCE_BACKED'].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>g.inputs.join(',')+':'+g.result).join('|'),operationDepth:rule.operationDepth,operandCount:rule.operandCount,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP021_CANDIDATE_IDS=Object.freeze(MIS_CP021_RULES.map(r=>r.candidateId));
