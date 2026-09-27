import {renderCircleSvg,figurePreview} from '../visual-runtime';
import {MIS_CP006_RULES,misCp006RuleByCandidateId,type MisCp006CandidateId,type MisCp006RuleId} from './rule-definitions';
import {auditMisCp006Ambiguity,independentlyEvaluateMisCp006Rule,independentlyVerifyMisCp006Group,type MisCp006AmbiguityAudit,type MisCp006Group} from './independent-solver';

export interface MisCp006Option{readonly value:number;readonly errorLabel:string|null;}
export interface MisCp006RenderedFigure{
  readonly positions:{readonly top:number;readonly right:number;readonly bottom:number;readonly left:number|null;readonly centre:number|'?';};
  readonly svg:string;
}
export interface GeneratedMisCp006Question{
  readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-006';readonly candidateId:MisCp006CandidateId;readonly provisionalQl:true;
  readonly ruleId:MisCp006RuleId;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Easy'|'Medium';
  readonly renderer:'SVG_CIRCLE';readonly stem:string;readonly evidenceGroups:readonly MisCp006Group[];readonly target:MisCp006Group;
  readonly figures:readonly MisCp006RenderedFigure[];readonly options:readonly MisCp006Option[];readonly correctIndex:number;readonly answer:number;
  readonly explanation:string;readonly solverTrace:readonly string[];readonly ambiguityAudit:MisCp006AmbiguityAudit;readonly structuralFingerprint:string;
  readonly numericFingerprint:string;readonly operationDepth:1|2;readonly operandCount:3|4;readonly groupCount:number;readonly missingPosition:'CENTRE_MISSING';
  readonly semanticPositions:readonly string[];
}
function hash(v:string):number{let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string):()=>number{let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(items:readonly T[],seed:string):T[]{const a=[...items],r=rng(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j]!,a[i]!];}return a;}
function evalRule(ruleId:MisCp006RuleId,top:number,right:number,bottom:number,left:number|null):number|null{
  return independentlyEvaluateMisCp006Rule(ruleId,{top,right,bottom,left});
}
const cache=new Map<string,readonly MisCp006Group[]>();
function validGroups(ruleId:MisCp006RuleId,count:3|4):readonly MisCp006Group[]{
  const key=ruleId+':'+count,c=cache.get(key);if(c)return c;const out:MisCp006Group[]=[];
  for(let t=2;t<=13;t++)for(let r=2;r<=13;r++)for(let b=2;b<=13;b++){
    if(new Set([t,r,b]).size<3)continue;
    if(count===3){const centre=evalRule(ruleId,t,r,b,null);if(centre==null||[t,r,b].includes(centre))continue;const g={top:t,right:r,bottom:b,left:null,centre};if(!independentlyVerifyMisCp006Group(ruleId,g))throw new Error('CP006 solver disagreement');out.push(g);continue;}
    for(let l=2;l<=13;l++){if(new Set([t,r,b,l]).size<4)continue;const centre=evalRule(ruleId,t,r,b,l);if(centre==null||[t,r,b,l].includes(centre))continue;const g={top:t,right:r,bottom:b,left:l,centre};if(!independentlyVerifyMisCp006Group(ruleId,g))throw new Error('CP006 solver disagreement');out.push(g);}
  }
  cache.set(key,out);return out;
}
function visible(g:MisCp006Group):number[]{return [g.top,g.right,g.bottom,g.left].filter((v):v is number=>v!=null);}
function shared(a:MisCp006Group,b:MisCp006Group):number{const s=new Set(visible(a));return visible(b).filter(v=>s.has(v)).length;}
function distractors(ruleId:MisCp006RuleId,g:MisCp006Group):MisCp006Option[]{
  const t=g.top,r=g.right,b=g.bottom,l=g.left,correct=g.centre,out:MisCp006Option[]=[];
  const add=(v:number|null,label:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==correct&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:label});};
  add(t+r+b+(l??0),'ADDED_ALL_VISIBLE_VALUES');add(t*r-b,'SELECTED_PAIR_PRODUCT_MINUS_THIRD');
  if(l!=null){
    add(Math.abs((t+b)-(l+r)),'OPPOSITE_SUM_DIFFERENCE');
    add(Math.abs(t*b-l*r),'OPPOSITE_PRODUCT_DIFFERENCE');
    add(t*b+l*r,'OPPOSITE_PRODUCT_SUM');
    add((t+b)*(l+r),'OPPOSITE_SUM_PRODUCT');
    add(t*r+b*l,'ADJACENT_PAIR_USED_INSTEAD_OF_OPPOSITE_PAIR');
    add(t*l+r*b,'ADJACENT_PAIR_USED_INSTEAD_OF_OPPOSITE_PAIR');
  } else {
    add(t*r+b,'ADDED_THIRD_INSTEAD_OF_SUBTRACTED');
    add(t*b-r,'WRONG_PAIR_COMBINED');
    add(r*b-t,'WRONG_PAIR_COMBINED');
    add(t+r+b,'ADD_INSTEAD_OF_COMPOSITE_RULE');
  }
  return out;
}
function select(ruleId:MisCp006RuleId,count:3|4,seed:string){
  const groups=shuffle(validGroups(ruleId,count),seed+':groups');
  for(let start=0;start<Math.min(groups.length,40);start++){
    const evidence:MisCp006Group[]=[groups[start]!],used=new Set([start]);
    while(evidence.length<3){
      let best=-1,bn=Infinity;
      for(let i=0;i<Math.min(groups.length,260);i++){if(used.has(i))continue;const g=groups[i]!;
        if(evidence.some(e=>e.centre===g.centre||shared(e,g)>1))continue;
        const a=auditMisCp006Ambiguity(ruleId,[...evidence,g]),n=new Set(a.matches.map(m=>m.semanticKey)).size;
        if(n<bn){best=i;bn=n;}if(n===1)break;
      }
      if(best<0)break;evidence.push(groups[best]!);used.add(best);
      if(evidence.length>=2){const ambiguity=auditMisCp006Ambiguity(ruleId,evidence);if(!ambiguity.accepted)continue;
        const target=groups.find((g,i)=>!used.has(i)&&distractors(ruleId,g).length>=3&&!evidence.some(e=>e.centre===g.centre||shared(e,g)>1));
        if(target)return{evidence,target,ambiguity};
      }
    }
  }
  throw new Error('Unable to construct unambiguous CP006 '+ruleId);
}
function words(ruleId:MisCp006RuleId):string{
  switch(ruleId){
    case 'SUM_THREE_SURROUNDING':return'Add the three surrounding numbers.';
    case 'SUM_FOUR_SURROUNDING':return'Add all four surrounding numbers.';
    case 'TOP_RIGHT_PRODUCT_MINUS_BOTTOM':return'Multiply the top and right numbers, then subtract the bottom number.';
    case 'OPPOSITE_SUM_DIFFERENCE':return'Add each opposite pair, then take the positive difference between the two sums.';
    case 'OPPOSITE_PRODUCT_DIFFERENCE':return'Multiply each opposite pair, then take the positive difference between the two products.';
    case 'OPPOSITE_PRODUCT_SUM':return'Multiply each opposite pair, then add the two products.';
    case 'OPPOSITE_SUM_PRODUCT':return'Add each opposite pair, then multiply the two sums.';
  }
}
function calc(ruleId:MisCp006RuleId,g:MisCp006Group):string{
  const t=g.top,r=g.right,b=g.bottom,l=g.left,c=g.centre;
  switch(ruleId){
    case 'SUM_THREE_SURROUNDING':return`${t} + ${r} + ${b} = ${c}`;
    case 'SUM_FOUR_SURROUNDING':return`${t} + ${r} + ${b} + ${l} = ${c}`;
    case 'TOP_RIGHT_PRODUCT_MINUS_BOTTOM':return`${t} × ${r} = ${t*r}\n${t*r} − ${b} = ${c}`;
    case 'OPPOSITE_SUM_DIFFERENCE':{const a=t+b,d=(l??0)+r;return`Top + bottom: ${t} + ${b} = ${a}\nLeft + right: ${l} + ${r} = ${d}\n|${a} − ${d}| = ${c}`;}
    case 'OPPOSITE_PRODUCT_DIFFERENCE':{const a=t*b,d=(l??0)*r;return`Top × bottom: ${t} × ${b} = ${a}\nLeft × right: ${l} × ${r} = ${d}\n|${a} − ${d}| = ${c}`;}
    case 'OPPOSITE_PRODUCT_SUM':{const a=t*b,d=(l??0)*r;return`Top × bottom: ${t} × ${b} = ${a}\nLeft × right: ${l} × ${r} = ${d}\n${a} + ${d} = ${c}`;}
    case 'OPPOSITE_SUM_PRODUCT':{const a=t+b,d=(l??0)+r;return`Top + bottom: ${t} + ${b} = ${a}\nLeft + right: ${l} + ${r} = ${d}\n${a} × ${d} = ${c}`;}
  }
}
function rendered(g:MisCp006Group,hide=false):MisCp006RenderedFigure{
  const positions={top:g.top,right:g.right,bottom:g.bottom,left:g.left,centre:hide?'?' as const:g.centre};
  const svg=renderCircleSvg(positions);
  return{positions,svg};
}
export function generateMisCp006Question(candidateId:MisCp006CandidateId,seed:string|number='mis-cp006-v1'):GeneratedMisCp006Question{
  const rule=misCp006RuleByCandidateId(candidateId),base=String(seed),sel=select(rule.ruleId,rule.surroundingCount,base);
  const solved=independentlyEvaluateMisCp006Rule(rule.ruleId,{top:sel.target.top,right:sel.target.right,bottom:sel.target.bottom,left:sel.target.left});
  if(solved!==sel.target.centre)throw new Error('CP006 target solver disagreement');
  const wrong=shuffle(distractors(rule.ruleId,sel.target),base+':opts').slice(0,3);if(wrong.length!==3)throw new Error('CP006 distractor shortage');
  const correctIndex=hash(base+':'+candidateId)%4,options=[...wrong];options.splice(correctIndex,0,{value:sel.target.centre,errorLabel:null});
  const figures=[...sel.evidence.map(g=>rendered(g)),rendered(sel.target,true)];
  const previews=figures.map((f,i)=>`Figure ${i+1}:\n${figurePreview('SVG_CIRCLE',f.positions as any)}`);
  const lines=sel.evidence.flatMap((g,i)=>[i===0?'Look at Figure 1:':`Check Figure ${i+1} in the same way:`,calc(rule.ruleId,g),'']);
  const explanation=['The same rule is used in every circle.',words(rule.ruleId),'',...lines,'Now apply the same rule to the circle with the question mark:',calc(rule.ruleId,sel.target),'',`So, ? = ${sel.target.centre}.`].join('\n');
  return{packageId:'MIS-001',checkpointId:'MIS-CP-006',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,
    difficulty:rule.difficulty,renderer:'SVG_CIRCLE',stem:['Find the missing value in the following figure.','',...previews].join('\n\n'),evidenceGroups:sel.evidence,target:sel.target,
    figures,options,correctIndex,answer:sel.target.centre,explanation,solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g)),calc(rule.ruleId,sel.target)],ambiguityAudit:sel.ambiguity,
    structuralFingerprint:['MIS-CP-006',rule.ruleId,'SVG_CIRCLE','CENTRE_MISSING',`SURROUNDING_${rule.surroundingCount}`,`EVIDENCE_${sel.evidence.length}`].join('|'),
    numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.top},${g.right},${g.bottom},${g.left??'_'},${g.centre}`).join('|'),operationDepth:rule.operationDepth,
    operandCount:rule.surroundingCount,groupCount:sel.evidence.length+1,missingPosition:'CENTRE_MISSING',semanticPositions:rule.surroundingCount===3?['top','right','bottom','centre']:['top','right','bottom','left','centre']};
}
export const MIS_CP006_CANDIDATE_IDS=Object.freeze(MIS_CP006_RULES.map(r=>r.candidateId));
