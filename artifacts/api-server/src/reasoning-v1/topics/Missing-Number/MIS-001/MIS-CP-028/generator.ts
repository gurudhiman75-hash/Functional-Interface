import{MIS_CP028_RULES,misCp028RuleByCandidateId,type MisCp028CandidateId}from'./rule-definitions';
import{independentlyEvaluateMisCp028,independentlyVerifyMisCp028Group,type MisCp028Group}from'./independent-solver';

export interface MisCp028Option{readonly value:number;readonly errorLabel:string|null;}
export interface GeneratedMisCp028Question{
 readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-028';readonly candidateId:MisCp028CandidateId;readonly provisionalQl:true;
 readonly ruleId:'ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD';readonly ruleFamily:string;readonly context:null;readonly difficulty:'Medium';readonly renderer:'TABLE_GROUP';
 readonly stem:string;readonly evidenceGroups:readonly MisCp028Group[];readonly target:MisCp028Group;readonly options:readonly MisCp028Option[];
 readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
 readonly ambiguityAudit:{readonly accepted:boolean;readonly survivingRules:readonly string[];readonly reason:string};
 readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:3;readonly operandCount:3;readonly groupCount:3;
 readonly missingPosition:'RESULT';readonly forwardOrInverse:'FORWARD';readonly sourceBacked:true;readonly sourceNote:string;
 readonly semanticAuthorityCandidateId:MisCp028CandidateId;readonly createsNewSemanticAuthority:true;readonly wholeNumberOrDigitMode:'WHOLE_NUMBER';
}
function hash(v:string){let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string){let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string){const o=[...a],r=rng(seed);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j]!,o[i]!];}return o;}
function root(n:number){return Math.round(Math.sqrt(n));}

type Nearby='ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD'|'ROOT_SUM'|'ROOT_FIRST_PLUS_ROOT_SECOND_MINUS_ROOT_THIRD'|'RAW_FIRST_MINUS_SECOND_PLUS_THIRD'|'ROOT_FIRST_MINUS_ROOT_SECOND';
const NEARBY:readonly Nearby[]=['ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD','ROOT_SUM','ROOT_FIRST_PLUS_ROOT_SECOND_MINUS_ROOT_THIRD','RAW_FIRST_MINUS_SECOND_PLUS_THIRD','ROOT_FIRST_MINUS_ROOT_SECOND'];
function evalNearby(id:Nearby,g:MisCp028Group):number|null{
 const[a,b,c]=g.inputs,ra=root(a!),rb=root(b!),rc=root(c!);
 if(ra*ra!==a||rb*rb!==b||rc*rc!==c)return null;
 if(id==='ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD')return independentlyEvaluateMisCp028(g.inputs);
 if(id==='ROOT_SUM')return ra+rb+rc;
 if(id==='ROOT_FIRST_PLUS_ROOT_SECOND_MINUS_ROOT_THIRD')return ra+rb-rc;
 if(id==='RAW_FIRST_MINUS_SECOND_PLUS_THIRD')return a!-b!+c!;
 return ra-rb;
}
function audit(evidence:readonly MisCp028Group[]){
 const survivors=NEARBY.filter(rule=>evidence.every(g=>evalNearby(rule,g)===g.result));
 return survivors.length===1&&survivors[0]==='ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD'
 ?{accepted:true,survivingRules:survivors,reason:'Only √first − √second + √third fits every complete row.'}
 :{accepted:false,survivingRules:survivors,reason:'Competing nearby root rules survive: '+survivors.join(', ')};
}
function groups():MisCp028Group[]{
 const out:MisCp028Group[]=[];
 for(let ra=4;ra<=14;ra++)for(let rb=2;rb<=12;rb++)for(let rc=2;rc<=12;rc++){
  if(ra<=rb)continue;
  const inputs=[ra*ra,rb*rb,rc*rc] as const;
  const result=independentlyEvaluateMisCp028(inputs);
  if(result==null||inputs.includes(result as never))continue;
  out.push({inputs,result});
 }
 return out;
}
function distractors(g:MisCp028Group):MisCp028Option[]{
 const[a,b,c]=g.inputs,ra=root(a),rb=root(b),rc=root(c),correct=g.result,out:MisCp028Option[]=[];
 const add=(v:number,l:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==correct&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});};
 add(ra+rb+rc,'ADDED_ALL_ROOTS');
 add(ra+rb-rc,'SUBTRACTED_THIRD_ROOT');
 add(ra-rb,'OMITTED_THIRD_ROOT');
 add(ra+rc,'OMITTED_SECOND_ROOT');
 add(a-b+c,'USED_RAW_VALUES');
 return out;
}
function select(seed:string){
 const gs=shuffle(groups(),seed+':groups');
 for(let i=0;i<Math.min(gs.length,100);i++)for(let j=i+1;j<Math.min(gs.length,220);j++){
  const evidence=[gs[i]!,gs[j]!];if(evidence[0]!.result===evidence[1]!.result)continue;
  const ambiguity=audit(evidence);if(!ambiguity.accepted)continue;
  const target=gs.find((g,k)=>k!==i&&k!==j&&g.result!==evidence[0]!.result&&g.result!==evidence[1]!.result&&distractors(g).length>=3);
  if(target)return{evidence,target,ambiguity};
 }
 throw new Error('Unable to construct MIS-CP-028 root-combination question');
}
function calc(g:MisCp028Group):string{
 const[a,b,c]=g.inputs;return`√${a}=${root(a)}; √${b}=${root(b)}; √${c}=${root(c)}; ${root(a)}−${root(b)}+${root(c)}=${g.result}`;
}
function row(g:MisCp028Group,hide=false){return[...g.inputs,hide?'?':g.result].join('   ');}
export function generateMisCp028Question(candidateId:MisCp028CandidateId,seed:string|number='mis-cp028-v1'):GeneratedMisCp028Question{
 const rule=misCp028RuleByCandidateId(candidateId),base=String(seed),sel=select(base),wrong=shuffle(distractors(sel.target),base+':opts').slice(0,3);
 if(wrong.length!==3)throw new Error('CP028 distractor shortage');const ci=hash(base+candidateId)%4,options=[...wrong];options.splice(ci,0,{value:sel.target.result,errorLabel:null});
 const explanation=['The same rule is used in every row.','Take the square roots of all three numbers. Subtract the second root from the first, then add the third root.','', 'Row 1:',calc(sel.evidence[0]!),'','Row 2:',calc(sel.evidence[1]!),'','Now apply the same rule:',calc(sel.target),'',`So, ? = ${sel.target.result}.`].join('\n');
 return{packageId:'MIS-001',checkpointId:'MIS-CP-028',candidateId,provisionalQl:true,ruleId:'ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD',ruleFamily:rule.label,context:null,difficulty:'Medium',renderer:'TABLE_GROUP',stem:['Study the pattern and find the number that will replace the question mark (?).','',...sel.evidence.map(g=>row(g)),row(sel.target,true)].join('\n'),evidenceGroups:sel.evidence,target:sel.target,options,correctIndex:ci,answer:sel.target.result,explanation,solverTrace:[...sel.evidence.map(calc),calc(sel.target)],ambiguityAudit:sel.ambiguity,structuralFingerprint:'MIS-CP-028|ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD|SOURCE_BACKED',numericFingerprint:[...sel.evidence,sel.target].map(g=>g.inputs.join(',')+':'+g.result).join('|'),operationDepth:3,operandCount:3,groupCount:3,missingPosition:'RESULT',forwardOrInverse:'FORWARD',sourceBacked:true,sourceNote:rule.sourceNote,semanticAuthorityCandidateId:candidateId,createsNewSemanticAuthority:true,wholeNumberOrDigitMode:'WHOLE_NUMBER'};
}
export const MIS_CP028_CANDIDATE_IDS=Object.freeze(MIS_CP028_RULES.map(r=>r.candidateId));
