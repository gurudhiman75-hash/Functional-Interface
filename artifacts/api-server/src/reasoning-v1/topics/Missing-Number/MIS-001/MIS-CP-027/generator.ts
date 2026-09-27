import{MIS_CP027_RULES,misCp027RuleByCandidateId,type MisCp027CandidateId}from'./rule-definitions';
import{independentlyEvaluateMisCp027,independentlyVerifyMisCp027Group,type MisCp027Group}from'./independent-solver';
export interface MisCp027Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp027Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-027';readonly candidateId:MisCp027CandidateId;readonly provisionalQl:true;
 readonly ruleId:'SUM_OF_CUBES';readonly ruleFamily:string;readonly context:null;readonly difficulty:'Medium';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp027Group[];readonly target:MisCp027Group;readonly options:readonly MisCp027Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:2;readonly operandCount:2;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp027CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
type Nearby='SUM_OF_CUBES'|'CUBE_OF_SUM'|'SUM_OF_SQUARES'|'PRODUCT'|'SUM';
const NEARBY:readonly Nearby[]=['SUM_OF_CUBES','CUBE_OF_SUM','SUM_OF_SQUARES','PRODUCT','SUM'];
function evalNearby(id:Nearby,g:MisCp027Group):number|null{
 const a=g.first,b=g.second;
 if(id==='SUM_OF_CUBES')return independentlyEvaluateMisCp027(a,b);
 if(id==='CUBE_OF_SUM')return(a+b)**3;
 if(id==='SUM_OF_SQUARES')return a*a+b*b;
 if(id==='PRODUCT')return a*b;
 return a+b;
}
function audit(evidence:readonly MisCp027Group[]){
 const survivors=NEARBY.filter(r=>evidence.every(g=>evalNearby(r,g)===g.result));
 return survivors.length===1&&survivors[0]==='SUM_OF_CUBES'
 ?{accepted:true,survivingRules:survivors,reason:'Only sum of the two individual cubes fits every complete row.'}
 :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups():MisCp027Group[]{
 const out:MisCp027Group[]=[];
 for(let a=2;a<=9;a++)for(let b=2;b<=9;b++){if(a===b)continue;const result=independentlyEvaluateMisCp027(a,b);if(result!=null)out.push({first:a,second:b,result});}
 return out;
}
function distractors(g:MisCp027Group):MisCp027Option[]{
 const a=g.first,b=g.second,out:MisCp027Option[]=[];const correct=g.result;
 const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==correct&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add((a+b)**3,'CUBED_SUM_INSTEAD');add(a*a+b*b,'USED_SQUARES');add(a*a*a+b*b,'CUBED_ONLY_FIRST');add(a*a+b*b*b,'CUBED_ONLY_SECOND');add(a*b,'MULTIPLIED_INPUTS');
 return out;
}
function select(seed:string){
 const gs=shuffle(groups(),seed+':groups');
 for(let i=0;i<gs.length;i++)for(let j=i+1;j<gs.length;j++){const evidence=[gs[i]!,gs[j]!];const ambiguity=audit(evidence);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(g).length>=3);
  if(target)return{evidence,target,ambiguity};}
 throw new Error('Unable to construct CP027 SUM_OF_CUBES');
}
function calc(g:MisCp027Group){return`${g.first}³=${g.first**3}; ${g.second}³=${g.second**3}; ${g.first**3}+${g.second**3}=${g.result}`;}
function row(g:MisCp027Group,hide=false){return`${g.first}   ${g.second}   ${hide?'?':g.result}`;}
export function generateMisCp027Question(candidateId:MisCp027CandidateId,seed:string|number='mis-cp027-v1'):GeneratedMisCp027Question{
 const rule=misCp027RuleByCandidateId(candidateId),base=String(seed),sel=select(base),wrong=shuffle(distractors(sel.target),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP027 distractor shortage');const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const explanation=['The same rule is used in every row.','Cube each of the two numbers separately, then add the two cubes.','', 'Row 1:',calc(sel.evidence[0]!),'','Row 2:',calc(sel.evidence[1]!),'','Now apply the same rule:',calc(sel.target),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-027',candidateId,provisionalQl:true,ruleId:'SUM_OF_CUBES',ruleFamily:rule.label,context:null,difficulty:'Medium',renderer:'TABLE_GROUP',stem:['Find the missing number.','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n'),evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(calc),calc(sel.target)],ambiguityAudit:sel.ambiguity,structuralFingerprint:'MIS-CP-027|SUM_OF_CUBES|SOURCE_BACKED',numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.first},${g.second}:${g.result}`).join('|'),operationDepth:2,operandCount:2,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP027_CANDIDATE_IDS=Object.freeze(MIS_CP027_RULES.map(r=>r.candidateId));
