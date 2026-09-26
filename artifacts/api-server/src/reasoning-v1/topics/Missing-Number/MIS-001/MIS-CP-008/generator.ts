import { renderTriangleSvg, figurePreview } from '../visual-runtime';
import { MIS_CP008_RULES, misCp008RuleByCandidateId, type MisCp008CandidateId, type MisCp008MissingPosition, type MisCp008RuleId } from './rule-definitions';
import { auditMisCp008Ambiguity, independentlyEvaluateMisCp008Rule, independentlySolveMisCp008Missing, type MisCp008AmbiguityAudit, type MisCp008Group } from './independent-solver';

export interface MisCp008Option { readonly value:number; readonly errorLabel:string|null; }
export interface GeneratedMisCp008Question {
  readonly packageId:'MIS-001'; readonly checkpointId:'MIS-CP-008'; readonly candidateId:MisCp008CandidateId; readonly provisionalQl:true;
  readonly ruleId:MisCp008RuleId; readonly ruleFamily:string; readonly context:null; readonly difficulty:'Medium'|'Hard';
  readonly renderer:'TABLE_GROUP'|'SVG_TRIANGLE'; readonly stem:string; readonly evidenceGroups:readonly MisCp008Group[]; readonly target:MisCp008Group;
  readonly figures:readonly {svg:string;positions:Record<string,number|'?'>}[]|null; readonly options:readonly MisCp008Option[];
  readonly correctIndex:number; readonly answer:number; readonly explanation:string; readonly solverTrace:readonly string[];
  readonly ambiguityAudit:MisCp008AmbiguityAudit; readonly structuralFingerprint:string; readonly numericFingerprint:string;
  readonly operationDepth:1|2; readonly operandCount:2|3; readonly groupCount:number; readonly missingPosition:MisCp008MissingPosition;
  readonly forwardOrInverse:'FORWARD'|'INVERSE';
}

function hash(v:string):number{let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string):()=>number{let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:readonly T[],seed:string):T[]{const out=[...a],r=rng(seed);for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j]!,out[i]!];}return out;}

function validGroups(ruleId:MisCp008RuleId,arity:2|3,min:number,max:number):MisCp008Group[]{
  const out:MisCp008Group[]=[];
  for(let a=min;a<=max;a++)for(let b=min;b<=max;b++){
    if(a===b)continue;
    if(arity===2){const result=independentlyEvaluateMisCp008Rule(ruleId,a,b,null);if(result&&![a,b].includes(result))out.push({first:a,second:b,third:null,result});continue;}
    for(let c=min;c<=max;c++){if(new Set([a,b,c]).size<3)continue;const result=independentlyEvaluateMisCp008Rule(ruleId,a,b,c);if(result&&![a,b,c].includes(result))out.push({first:a,second:b,third:c,result});}
  }
  return out;
}
function choose(ruleId:MisCp008RuleId,arity:2|3,min:number,max:number,seed:string){
  const groups=shuffle(validGroups(ruleId,arity,min,max),seed+':g');
  for(let i=0;i<Math.min(groups.length,50);i++){
    const e1=groups[i]!;
    for(let j=i+1;j<Math.min(groups.length,150);j++){
      const e2=groups[j]!; if(e1.result===e2.result)continue;
      const evidence=[e1,e2],audit=auditMisCp008Ambiguity(ruleId,evidence); if(!audit.accepted)continue;
      const target=groups.find((g,k)=>k!==i&&k!==j&&g.result!==e1.result&&g.result!==e2.result);
      if(target)return{evidence,target,audit};
    }
  }
  throw new Error('Unable to construct CP008 '+ruleId);
}
function valueAt(g:MisCp008Group,p:MisCp008MissingPosition):number{
  if(p==='FIRST_INPUT'||p==='TOP_VERTEX')return g.first;
  if(p==='SECOND_INPUT'||p==='LEFT_VERTEX')return g.second;
  if(p==='THIRD_INPUT'||p==='RIGHT_VERTEX')return g.third!;
  return g.result;
}
function ruleWords(ruleId:MisCp008RuleId):string{
  switch(ruleId){
    case 'INVERSE_SUM':return'Result = first + second.';
    case 'INVERSE_PRODUCT':return'Result = first × second.';
    case 'INVERSE_PRODUCT_MINUS_SECOND':return'Result = first × second − second.';
    case 'INVERSE_SQUARE_PLUS_SECOND':return'Result = first² + second.';
    case 'INVERSE_SUM_TIMES_THIRD':return'Result = (first + second) × third.';
    case 'INVERSE_TRIANGLE_PRODUCT_MINUS_TOP':return'Centre = left × right − top.';
  }
}
function calc(ruleId:MisCp008RuleId,g:MisCp008Group):string{
  const a=g.first,b=g.second,c=g.third,r=g.result;
  switch(ruleId){
    case 'INVERSE_SUM':return`${a} + ${b} = ${r}`;
    case 'INVERSE_PRODUCT':return`${a} × ${b} = ${r}`;
    case 'INVERSE_PRODUCT_MINUS_SECOND':return`${a} × ${b} = ${a*b}\n${a*b} − ${b} = ${r}`;
    case 'INVERSE_SQUARE_PLUS_SECOND':return`${a}² = ${a*a}\n${a*a} + ${b} = ${r}`;
    case 'INVERSE_SUM_TIMES_THIRD':return`${a} + ${b} = ${a+b}\n${a+b} × ${c} = ${r}`;
    case 'INVERSE_TRIANGLE_PRODUCT_MINUS_TOP':return`Left × right: ${b} × ${c} = ${b*c!}\n${b*c!} − top ${a} = ${r}`;
  }
}
function distractors(answer:number,g:MisCp008Group,p:MisCp008MissingPosition):MisCp008Option[]{
  const raw=[
    [g.first,'USED_FIRST_INPUT'],[g.second,'USED_SECOND_INPUT'],[g.third,'USED_THIRD_INPUT'],[g.result,'USED_RESULT'],
    [Math.abs(g.result-g.first),'SUBTRACTED_WRONG_VISIBLE_VALUE'],[Math.abs(g.result-g.second),'SUBTRACTED_WRONG_VISIBLE_VALUE'],
    [g.first+g.second,'ADDED_VISIBLE_INPUTS'],[g.first*g.second,'MULTIPLIED_VISIBLE_INPUTS']
  ] as const;
  const out:MisCp008Option[]=[];for(const [v,l] of raw){if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==answer&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:l});}
  return out;
}
function renderTable(g:MisCp008Group,p:MisCp008MissingPosition):string{
  const vals:[number|string,number|string,number|string,number|string]=[g.first,g.second,g.third??'',g.result];
  if(p==='FIRST_INPUT')vals[0]='?'; if(p==='SECOND_INPUT')vals[1]='?';if(p==='THIRD_INPUT')vals[2]='?';if(p==='RESULT')vals[3]='?';
  return g.third==null?`${vals[0]}   ${vals[1]}   ${vals[3]}`:`${vals[0]}   ${vals[1]}   ${vals[2]}   ${vals[3]}`;
}
export function generateMisCp008Question(candidateId:MisCp008CandidateId,seed:string|number='mis-cp008-v1'):GeneratedMisCp008Question{
  const rule=misCp008RuleByCandidateId(candidateId),base=String(seed),sel=choose(rule.ruleId,rule.arity,rule.minInput,rule.maxInput,base);
  const positions=shuffle(rule.supportedMissingPositions,base+':p');
  let missing=positions[0]!,solutions:readonly number[]=[];
  for(const p of positions){const s=independentlySolveMisCp008Missing(rule.ruleId,sel.target,p,rule.minInput,rule.maxInput);if(s.length===1){missing=p;solutions=s;break;}}
  if(solutions.length!==1)throw new Error('CP008 target must have exactly one inverse solution.');
  const answer=solutions[0]!,wrong=shuffle(distractors(answer,sel.target,missing),base+':o').slice(0,3);if(wrong.length!==3)throw new Error('CP008 distractor shortage');
  const correctIndex=hash(base+candidateId)%4,options=[...wrong];options.splice(correctIndex,0,{value:answer,errorLabel:null});
  const inverse=missing!=='RESULT'&&missing!=='CENTRE';
  let stem:string,figures:null|{svg:string;positions:Record<string,number|'?'>}[]=null;
  if(rule.renderer==='SVG_TRIANGLE'){
    const make=(g:MisCp008Group,hide=false)=>{const pos={top:g.first,left:g.second,right:g.third!,centre:g.result} as Record<string,number|'?'>;if(hide){if(missing==='TOP_VERTEX')pos.top='?';else if(missing==='LEFT_VERTEX')pos.left='?';else if(missing==='RIGHT_VERTEX')pos.right='?';else pos.centre='?';}return{positions:pos,svg:renderTriangleSvg(pos as any)};};
    figures=[...sel.evidence.map(g=>make(g)),make(sel.target,true)];
    stem=['Find the missing value in the following figure.','',...figures.map((f,i)=>`Figure ${i+1}:\n${figurePreview('SVG_TRIANGLE',f.positions)}`)].join('\n\n');
  }else{
    stem=['Find the number that will replace the question mark (?).','',...sel.evidence.map(g=>renderTable(g,'RESULT')),renderTable(sel.target,missing)].join('\n');
  }
  const explanation=['The same rule is used in every group.',ruleWords(rule.ruleId),'','Look at the completed groups:',...sel.evidence.map(g=>calc(rule.ruleId,g)),'','Now use the same rule in reverse for the group with the question mark:',calc(rule.ruleId,sel.target),'',`So, ? = ${answer}.`].join('\n');
  return{packageId:'MIS-001',checkpointId:'MIS-CP-008',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,difficulty:rule.difficulty,renderer:rule.renderer,stem,evidenceGroups:sel.evidence,target:sel.target,figures,options,correctIndex,answer,explanation,solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g)),calc(rule.ruleId,sel.target)],ambiguityAudit:sel.audit,structuralFingerprint:['MIS-CP-008',rule.ruleId,rule.renderer,missing,`ARITY_${rule.arity}`].join('|'),numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.first},${g.second},${g.third??'_'}:${g.result}`).join('|'),operationDepth:rule.operationDepth,operandCount:rule.arity,groupCount:sel.evidence.length+1,missingPosition:missing,forwardOrInverse:inverse?'INVERSE':'FORWARD'};
}
export const MIS_CP008_CANDIDATE_IDS=Object.freeze(MIS_CP008_RULES.map(r=>r.candidateId));
