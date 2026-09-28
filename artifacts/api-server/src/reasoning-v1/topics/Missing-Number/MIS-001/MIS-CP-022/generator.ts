import{MIS_CP022_RULES,misCp022RuleByCandidateId,type MisCp022CandidateId,type MisCp022RuleId}from'./rule-definitions';
import{independentlyEvaluateMisCp022Rule,type MisCp022Group}from'./independent-solver';

export interface MisCp022Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp022Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-022';readonly candidateId:MisCp022CandidateId;readonly provisionalQl:true;
 readonly ruleId:MisCp022RuleId;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Medium';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp022Group[];readonly target:MisCp022Group;readonly options:readonly MisCp022Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:2;readonly operandCount:2;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp022CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}

type Nearby='PAIR_ARITHMETIC_MEAN'|'SUM'|'ABS_DIFFERENCE'|'PRODUCT'|'HALF_ABS_DIFFERENCE';
const NEARBY:readonly Nearby[]=['PAIR_ARITHMETIC_MEAN','SUM','ABS_DIFFERENCE','PRODUCT','HALF_ABS_DIFFERENCE'];
function evalNearby(id:Nearby,inputs:readonly number[]):number|null{
 if(inputs.length!==2)return null;
 const[a,b]=inputs;
 if(id==='PAIR_ARITHMETIC_MEAN')return independentlyEvaluateMisCp022Rule(id,inputs);
 if(id==='SUM')return a!+b!;
 if(id==='ABS_DIFFERENCE')return Math.abs(a!-b!);
 if(id==='PRODUCT')return a!*b!;
 const d=Math.abs(a!-b!);return d%2===0?d/2:null;
}
function audit(evidence:readonly MisCp022Group[]){
 const survivors=NEARBY.filter(r=>evidence.every(g=>evalNearby(r,g.inputs)===g.result));
 return survivors.length===1&&survivors[0]==='PAIR_ARITHMETIC_MEAN'
  ?{accepted:true,survivingRules:survivors,reason:'Exactly one nearby source grammar rule survives all evidence rows.'}
  :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups():MisCp022Group[]{
 const out:MisCp022Group[]=[];
 for(let a=12;a<=96;a+=2)for(let b=6;b<=88;b+=2){
  if(a===b)continue;
  const result=(a+b)/2;
  if(result===a||result===b||result>99)continue;
  out.push({inputs:[a,b],result});
 }
 return out;
}
function distractors(g:MisCp022Group):MisCp022Option[]{
 const[a,b]=g.inputs;const out:MisCp022Option[]=[];
 const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(a+b,'FORGOT_DIVIDE_BY_TWO');
 add(Math.abs(a-b),'USED_DIFFERENCE');
 add(Math.max(a,b),'USED_LARGER_INPUT');
 add(Math.abs(a-b)/2,'HALVED_DIFFERENCE');
 add(g.result+2,'ARITHMETIC_ERROR');
 return out;
}
function select(seed:string){
 const gs=shuffle(groups(),seed+':groups');
 for(let i=0;i<Math.min(gs.length,100);i++)for(let j=i+1;j<Math.min(gs.length,240);j++){
  const evidence=[gs[i]!,gs[j]!];if(evidence[0]!.result===evidence[1]!.result)continue;
  const ambiguity=audit(evidence);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(g).length>=3);
  if(target)return{evidence,target,ambiguity};
 }
 throw new Error('Unable to construct CP022 PAIR_ARITHMETIC_MEAN');
}
function calc(g:MisCp022Group):string{const[a,b]=g.inputs;return`${a}+${b}=${a+b}; ${a+b}÷2=${g.result}`;}
function row(g:MisCp022Group,hide=false){return[...g.inputs,hide?'?':g.result].join('   ');}
export function generateMisCp022Question(candidateId:MisCp022CandidateId,seed:string|number='mis-cp022-v1'):GeneratedMisCp022Question{
 const rule=misCp022RuleByCandidateId(candidateId),base=String(seed),sel=select(base),wrong=shuffle(distractors(sel.target),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP022 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const stem=['Find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['The same rule is used in every row.','Add the two numbers, then divide the sum by 2.','', 'Row 1:',calc(sel.evidence[0]!),'','Row 2:',calc(sel.evidence[1]!),'','Now apply the same rule:',calc(sel.target),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-022',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,difficulty:rule.difficulty,renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(calc),calc(sel.target)],ambiguityAudit:sel.ambiguity,structuralFingerprint:['MIS-CP-022',rule.ruleId,'SOURCE_BACKED'].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>g.inputs.join(',')+':'+g.result).join('|'),operationDepth:2,operandCount:2,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP022_CANDIDATE_IDS=Object.freeze(MIS_CP022_RULES.map(r=>r.candidateId));
