import{MIS_CP023_RULES,misCp023RuleByCandidateId,type MisCp023CandidateId,type MisCp023RuleId}from'./rule-definitions';
import{independentlyEvaluateMisCp023Rule,type MisCp023Group}from'./independent-solver';

export interface MisCp023Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp023Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-023';readonly candidateId:MisCp023CandidateId;readonly provisionalQl:true;
 readonly ruleId:MisCp023RuleId;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Hard';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp023Group[];readonly target:MisCp023Group;readonly options:readonly MisCp023Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:4;readonly operandCount:3;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp023CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function sqrt(n:number){return Math.round(Math.sqrt(n));}

type Nearby='ROOT_SUM_TIMES_THIRD_PLUS_TWO'|'ROOT_SUM_TIMES_THIRD'|'RAW_SUM_TIMES_THIRD_PLUS_TWO'|'ROOT_SUM_PLUS_THIRD'|'ROOT_PRODUCT_PLUS_THIRD';
const NEARBY:readonly Nearby[]=['ROOT_SUM_TIMES_THIRD_PLUS_TWO','ROOT_SUM_TIMES_THIRD','RAW_SUM_TIMES_THIRD_PLUS_TWO','ROOT_SUM_PLUS_THIRD','ROOT_PRODUCT_PLUS_THIRD'];
function evalNearby(id:Nearby,inputs:readonly number[]):number|null{
 if(inputs.length!==3)return null;
 const[a,b,c]=inputs,ra=sqrt(a!),rb=sqrt(b!);
 if(ra*ra!==a||rb*rb!==b)return null;
 if(id==='ROOT_SUM_TIMES_THIRD_PLUS_TWO')return independentlyEvaluateMisCp023Rule(id,inputs);
 if(id==='ROOT_SUM_TIMES_THIRD')return(ra+rb)*c!;
 if(id==='RAW_SUM_TIMES_THIRD_PLUS_TWO')return(a!+b!)*c!+2;
 if(id==='ROOT_SUM_PLUS_THIRD')return ra+rb+c!;
 return ra*rb+c!;
}
function audit(evidence:readonly MisCp023Group[]){
 const survivors=NEARBY.filter(r=>evidence.every(g=>evalNearby(r,g.inputs)===g.result));
 return survivors.length===1&&survivors[0]==='ROOT_SUM_TIMES_THIRD_PLUS_TWO'
  ?{accepted:true,survivingRules:survivors,reason:'Exactly one nearby source grammar rule survives all evidence rows.'}
  :{accepted:false,survivingRules:survivors,reason:'Competing nearby rules survive: '+survivors.join(', ')};
}
function groups():MisCp023Group[]{
 const out:MisCp023Group[]=[];
 for(let ra=2;ra<=10;ra++)for(let rb=2;rb<=10;rb++)for(let c=3;c<=20;c++){
  if(ra===rb)continue;
  const inputs=[ra*ra,rb*rb,c] as const;
  const result=independentlyEvaluateMisCp023Rule('ROOT_SUM_TIMES_THIRD_PLUS_TWO',inputs);
  if(result!=null&&result<=500&&!inputs.includes(result as never))out.push({inputs,result});
 }
 return out;
}
function distractors(g:MisCp023Group):MisCp023Option[]{
 const[a,b,c]=g.inputs,ra=sqrt(a),rb=sqrt(b),out:MisCp023Option[]=[];
 const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==g.result&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add((ra+rb)*c,'OMITTED_FINAL_TWO');
 add((a+b)*c+2,'USED_RAW_VALUES_INSTEAD_OF_ROOTS');
 add(ra+rb+c,'ADDED_THIRD_INSTEAD_OF_MULTIPLYING');
 add(ra*rb*c+2,'MULTIPLIED_ROOTS');
 return out;
}
function select(seed:string){
 const gs=shuffle(groups(),seed+':groups');
 for(let i=0;i<Math.min(gs.length,100);i++)for(let j=i+1;j<Math.min(gs.length,250);j++){
  const evidence=[gs[i]!,gs[j]!];if(evidence[0]!.result===evidence[1]!.result)continue;const ambiguity=audit(evidence);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(g).length>=3);
  if(target)return{evidence,target,ambiguity};
 }
 throw new Error('Unable to construct CP023 ROOT_SUM_TIMES_THIRD_PLUS_TWO');
}
function calc(g:MisCp023Group):string{const[a,b,c]=g.inputs,ra=sqrt(a),rb=sqrt(b);return`√${a}=${ra}; √${b}=${rb}; (${ra}+${rb})×${c}+2=${g.result}`;}
function row(g:MisCp023Group,hide=false){return[...g.inputs,hide?'?':g.result].join('   ');}
export function generateMisCp023Question(candidateId:MisCp023CandidateId,seed:string|number='mis-cp023-v1'):GeneratedMisCp023Question{
 const rule=misCp023RuleByCandidateId(candidateId),base=String(seed),sel=select(base),wrong=shuffle(distractors(sel.target),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP023 distractor shortage');
 const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const stem=['Find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n');
 const explanation=['The same rule is used in every row.','Take the square roots of the first two numbers, add them, multiply by the third number, then add 2.','', 'Row 1:',calc(sel.evidence[0]!),'','Row 2:',calc(sel.evidence[1]!),'','Now apply the same rule:',calc(sel.target),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-023',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,difficulty:rule.difficulty,renderer:'TABLE_GROUP',stem,evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(calc),calc(sel.target)],ambiguityAudit:sel.ambiguity,structuralFingerprint:['MIS-CP-023',rule.ruleId,'SOURCE_BACKED'].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>g.inputs.join(',')+':'+g.result).join('|'),operationDepth:4,operandCount:3,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP023_CANDIDATE_IDS=Object.freeze(MIS_CP023_RULES.map(r=>r.candidateId));
