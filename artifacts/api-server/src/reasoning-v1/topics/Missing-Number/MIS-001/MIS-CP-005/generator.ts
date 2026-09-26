import { renderTriangleSvg, figurePreview } from '../visual-runtime';
import { MIS_CP005_RULES, misCp005RuleByCandidateId, type MisCp005CandidateId, type MisCp005RuleId } from './rule-definitions';
import { auditMisCp005Ambiguity, independentlyEvaluateMisCp005Rule, independentlyVerifyMisCp005Group, type MisCp005AmbiguityAudit, type MisCp005Group } from './independent-solver';

export interface MisCp005Option { readonly value:number; readonly errorLabel:string|null; }
export interface MisCp005RenderedFigure {
  readonly positions:{ readonly top:number; readonly left:number; readonly right:number; readonly centre:number|'?'; };
  readonly svg:string;
}
export interface GeneratedMisCp005Question {
  readonly packageId:'MIS-001'; readonly checkpointId:'MIS-CP-005'; readonly candidateId:MisCp005CandidateId;
  readonly provisionalQl:true; readonly ruleId:MisCp005RuleId; readonly ruleFamily:string; readonly context:null;
  readonly difficulty:'Easy'|'Medium'; readonly renderer:'SVG_TRIANGLE'; readonly stem:string;
  readonly evidenceGroups:readonly MisCp005Group[]; readonly target:MisCp005Group; readonly figures:readonly MisCp005RenderedFigure[];
  readonly options:readonly MisCp005Option[]; readonly correctIndex:number; readonly answer:number; readonly explanation:string;
  readonly solverTrace:readonly string[]; readonly ambiguityAudit:MisCp005AmbiguityAudit; readonly structuralFingerprint:string;
  readonly numericFingerprint:string; readonly operationDepth:1|2; readonly operandCount:3; readonly groupCount:number;
  readonly missingPosition:'CENTRE_MISSING'; readonly semanticPositions:readonly ['top','left','right','centre'];
}

function hash(value:string):number { let h=2166136261; for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);} return h>>>0; }
function rng(seed:string):()=>number { let s=hash(seed)||1; return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(items:readonly T[],seed:string):T[]{const out=[...items],r=rng(seed);for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j]!,out[i]!];}return out;}

function evaluate(ruleId:MisCp005RuleId,top:number,left:number,right:number):number|null{
  const v=independentlyEvaluateMisCp005Rule(ruleId,top,left,right);
  return v!=null&&v>0&&v<=999?v:null;
}
const cache=new Map<string,readonly MisCp005Group[]>();
function validGroups(ruleId:MisCp005RuleId):readonly MisCp005Group[]{
  const c=cache.get(ruleId); if(c)return c;
  const groups:MisCp005Group[]=[];
  for(let top=2;top<=15;top++) for(let left=2;left<=15;left++) for(let right=2;right<=15;right++){
    if(new Set([top,left,right]).size<3) continue;
    const centre=evaluate(ruleId,top,left,right); if(centre==null||[top,left,right].includes(centre))continue;
    const g={top,left,right,centre}; if(!independentlyVerifyMisCp005Group(ruleId,g))throw new Error('CP005 solver disagreement');
    groups.push(g);
  }
  cache.set(ruleId,groups); return groups;
}
function sharedCount(a:MisCp005Group,b:MisCp005Group):number{
  const s=new Set([a.top,a.left,a.right]); return [b.top,b.left,b.right].filter(v=>s.has(v)).length;
}
function distractors(ruleId:MisCp005RuleId,g:MisCp005Group):MisCp005Option[]{
  const {top:t,left:l,right:r,centre:correct}=g; const out:MisCp005Option[]=[];
  const add=(v:number,label:string)=>{if(Number.isInteger(v)&&v>0&&v<=999&&v!==correct&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:label});};
  add(t*l+r,'TOP_LEFT_PRODUCT_PLUS_RIGHT'); add(t*l-r,'TOP_LEFT_PRODUCT_MINUS_RIGHT');
  add(l*r+t,'LEFT_RIGHT_PRODUCT_PLUS_TOP'); add(l*r-t,'LEFT_RIGHT_PRODUCT_MINUS_TOP');
  add(t+l+r,'ADDED_ALL_VERTICES'); add((t+l)*r,'TOP_LEFT_SUM_TIMES_RIGHT');
  add((l+r)*t,'LEFT_RIGHT_SUM_TIMES_TOP'); add(l*l+r*r,'SQUARED_LEFT_RIGHT');
  add(t*t+l*l,'WRONG_VERTEX_PAIR'); add(t*r+l,'WRONG_VERTEX_PAIR');
  return out;
}
function select(ruleId:MisCp005RuleId,seed:string){
  const groups=shuffle(validGroups(ruleId),seed+':groups');
  for(let start=0;start<Math.min(groups.length,40);start++){
    const evidence:MisCp005Group[]=[groups[start]!]; const used=new Set([start]);
    while(evidence.length<3){
      let best=-1,bestN=Infinity;
      for(let i=0;i<Math.min(groups.length,240);i++){if(used.has(i))continue; const g=groups[i]!;
        if(evidence.some(e=>e.centre===g.centre||sharedCount(e,g)>1))continue;
        const a=auditMisCp005Ambiguity(ruleId,[...evidence,g]); const n=new Set(a.matches.map(m=>m.semanticKey)).size;
        if(n<bestN){best=i;bestN=n;} if(n===1)break;
      }
      if(best<0)break; evidence.push(groups[best]!);used.add(best);
      if(evidence.length>=2){const ambiguity=auditMisCp005Ambiguity(ruleId,evidence);if(!ambiguity.accepted)continue;
        const target=groups.find((g,i)=>!used.has(i)&&distractors(ruleId,g).length>=3&&!evidence.some(e=>e.centre===g.centre||sharedCount(e,g)>1));
        if(target)return {evidence,target,ambiguity};
      }
    }
  }
  throw new Error('Unable to construct unambiguous CP005 '+ruleId);
}
function ruleWords(ruleId:MisCp005RuleId):string{
  switch(ruleId){
    case 'TOP_LEFT_PRODUCT_PLUS_RIGHT': return 'Multiply the top and left numbers, then add the right number.';
    case 'TOP_LEFT_PRODUCT_MINUS_RIGHT': return 'Multiply the top and left numbers, then subtract the right number.';
    case 'LEFT_RIGHT_PRODUCT_PLUS_TOP': return 'Multiply the left and right numbers, then add the top number.';
    case 'LEFT_RIGHT_PRODUCT_MINUS_TOP': return 'Multiply the left and right numbers, then subtract the top number.';
    case 'SUM_THREE_VERTICES': return 'Add the top, left and right numbers.';
    case 'TOP_LEFT_SUM_TIMES_RIGHT': return 'Add the top and left numbers, then multiply by the right number.';
    case 'LEFT_RIGHT_SUM_TIMES_TOP': return 'Add the left and right numbers, then multiply by the top number.';
    case 'LEFT_RIGHT_SQUARES_SUM': return 'Square the left and right numbers, then add the squares.';
  }
}
function calc(ruleId:MisCp005RuleId,g:MisCp005Group):string{
  const {top:t,left:l,right:r,centre:c}=g;
  switch(ruleId){
    case 'TOP_LEFT_PRODUCT_PLUS_RIGHT': return `${t} × ${l} = ${t*l}\n${t*l} + ${r} = ${c}`;
    case 'TOP_LEFT_PRODUCT_MINUS_RIGHT': return `${t} × ${l} = ${t*l}\n${t*l} − ${r} = ${c}`;
    case 'LEFT_RIGHT_PRODUCT_PLUS_TOP': return `${l} × ${r} = ${l*r}\n${l*r} + ${t} = ${c}`;
    case 'LEFT_RIGHT_PRODUCT_MINUS_TOP': return `${l} × ${r} = ${l*r}\n${l*r} − ${t} = ${c}`;
    case 'SUM_THREE_VERTICES': return `${t} + ${l} + ${r} = ${c}`;
    case 'TOP_LEFT_SUM_TIMES_RIGHT': return `${t} + ${l} = ${t+l}\n${t+l} × ${r} = ${c}`;
    case 'LEFT_RIGHT_SUM_TIMES_TOP': return `${l} + ${r} = ${l+r}\n${l+r} × ${t} = ${c}`;
    case 'LEFT_RIGHT_SQUARES_SUM': return `${l}² = ${l*l}\n${r}² = ${r*r}\n${l*l} + ${r*r} = ${c}`;
  }
}
function figure(g:MisCp005Group,hide=false):MisCp005RenderedFigure{
  const positions={top:g.top,left:g.left,right:g.right,centre:hide?'?' as const:g.centre};
  return {positions,svg:renderTriangleSvg(positions)};
}
export function generateMisCp005Question(candidateId:MisCp005CandidateId,seed:string|number='mis-cp005-v1'):GeneratedMisCp005Question{
  const rule=misCp005RuleByCandidateId(candidateId), base=String(seed), selected=select(rule.ruleId,base);
  const answer=independentlyEvaluateMisCp005Rule(rule.ruleId,selected.target.top,selected.target.left,selected.target.right);
  if(answer!==selected.target.centre)throw new Error('CP005 target solver disagreement');
  const wrong=shuffle(distractors(rule.ruleId,selected.target),base+':opts').slice(0,3); if(wrong.length!==3)throw new Error('CP005 distractor shortage');
  const correctIndex=hash(base+':'+candidateId)%4; const options=[...wrong]; options.splice(correctIndex,0,{value:selected.target.centre,errorLabel:null});
  const figures=[...selected.evidence.map(g=>figure(g)),figure(selected.target,true)];
  const previews=figures.map((f,i)=>`Figure ${i+1}:\n${figurePreview('SVG_TRIANGLE',f.positions)}`);
  const evidenceLines=selected.evidence.flatMap((g,i)=>[i===0?'Look at Figure 1:':`Check Figure ${i+1} in the same way:`,calc(rule.ruleId,g),'']);
  const explanation=['The same rule is used in every triangle.',ruleWords(rule.ruleId),'',...evidenceLines,'Now apply the same rule to the triangle with the question mark:',calc(rule.ruleId,selected.target),'',`So, ? = ${selected.target.centre}.`].join('\n');
  return {
    packageId:'MIS-001',checkpointId:'MIS-CP-005',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,
    difficulty:rule.difficulty,renderer:'SVG_TRIANGLE',stem:['Find the missing value in the following figure.','',...previews].join('\n\n'),
    evidenceGroups:selected.evidence,target:selected.target,figures,options,correctIndex,answer:selected.target.centre,explanation,
    solverTrace:[...selected.evidence.map(g=>calc(rule.ruleId,g)),calc(rule.ruleId,selected.target)],ambiguityAudit:selected.ambiguity,
    structuralFingerprint:['MIS-CP-005',rule.ruleId,'SVG_TRIANGLE','CENTRE_MISSING',`EVIDENCE_${selected.evidence.length}`].join('|'),
    numericFingerprint:[...selected.evidence,selected.target].map(g=>`${g.top},${g.left},${g.right},${g.centre}`).join('|'),
    operationDepth:rule.operationDepth,operandCount:3,groupCount:selected.evidence.length+1,missingPosition:'CENTRE_MISSING',
    semanticPositions:['top','left','right','centre'],
  };
}
export const MIS_CP005_CANDIDATE_IDS=Object.freeze(MIS_CP005_RULES.map(r=>r.candidateId));
