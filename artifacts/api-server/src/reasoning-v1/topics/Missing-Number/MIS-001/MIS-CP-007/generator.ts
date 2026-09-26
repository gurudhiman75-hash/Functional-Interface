import {renderBoxSvg,figurePreview} from '../visual-runtime';
import {MIS_CP007_RULES,misCp007RuleByCandidateId,type MisCp007CandidateId,type MisCp007RuleId} from './rule-definitions';
import {auditMisCp007Ambiguity,independentlyEvaluateMisCp007Rule,independentlyVerifyMisCp007Group,type MisCp007AmbiguityAudit,type MisCp007Group} from './independent-solver';

export interface MisCp007Option{readonly value:number;readonly errorLabel:string|null;}
export interface MisCp007RenderedFigure{
  readonly positions:{readonly topLeft:number;readonly topRight:number;readonly bottomLeft:number;readonly bottomRight:number;readonly centre:number|'?';};
  readonly shape:'SQUARE'|'RECTANGLE'; readonly svg:string;
}
export interface GeneratedMisCp007Question{
  readonly packageId:'MIS-001';readonly checkpointId:'MIS-CP-007';readonly candidateId:MisCp007CandidateId;readonly provisionalQl:true;
  readonly ruleId:MisCp007RuleId;readonly ruleFamily:string;readonly context:null;readonly difficulty:'Easy'|'Medium';readonly renderer:'SVG_BOX';
  readonly stem:string;readonly evidenceGroups:readonly MisCp007Group[];readonly target:MisCp007Group;readonly figures:readonly MisCp007RenderedFigure[];
  readonly options:readonly MisCp007Option[];readonly correctIndex:number;readonly answer:number;readonly explanation:string;readonly solverTrace:readonly string[];
  readonly ambiguityAudit:MisCp007AmbiguityAudit;readonly structuralFingerprint:string;readonly numericFingerprint:string;readonly operationDepth:1|2;
  readonly operandCount:4;readonly groupCount:number;readonly missingPosition:'CENTRE_MISSING';readonly semanticPositions:readonly ['topLeft','topRight','bottomLeft','bottomRight','centre'];
}
function hash(v:string):number{let h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed:string):()=>number{let s=hash(seed)||1;return()=>{s+=0x6d2b79f5;let v=s;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function shuffle<T>(items:readonly T[],seed:string):T[]{const a=[...items],r=rng(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j]!,a[i]!];}return a;}
function evaluate(ruleId:MisCp007RuleId,a:number,b:number,c:number,d:number):number|null{return independentlyEvaluateMisCp007Rule(ruleId,{topLeft:a,topRight:b,bottomLeft:c,bottomRight:d});}
const cache=new Map<string,readonly MisCp007Group[]>();
function validGroups(ruleId:MisCp007RuleId):readonly MisCp007Group[]{
  const old=cache.get(ruleId);if(old)return old;const out:MisCp007Group[]=[];
  for(let a=2;a<=12;a++)for(let b=2;b<=12;b++)for(let c=2;c<=12;c++)for(let d=2;d<=12;d++){
    if(new Set([a,b,c,d]).size<4)continue;const centre=evaluate(ruleId,a,b,c,d);if(centre==null||[a,b,c,d].includes(centre))continue;
    const g={topLeft:a,topRight:b,bottomLeft:c,bottomRight:d,centre};if(!independentlyVerifyMisCp007Group(ruleId,g))throw new Error('CP007 solver disagreement');out.push(g);
  }cache.set(ruleId,out);return out;
}
function visible(g:MisCp007Group):number[]{return[g.topLeft,g.topRight,g.bottomLeft,g.bottomRight];}
function shared(a:MisCp007Group,b:MisCp007Group):number{const s=new Set(visible(a));return visible(b).filter(v=>s.has(v)).length;}
function distractors(ruleId:MisCp007RuleId,g:MisCp007Group):MisCp007Option[]{
  const a=g.topLeft,b=g.topRight,c=g.bottomLeft,d=g.bottomRight,correct=g.centre,out:MisCp007Option[]=[];
  const add=(v:number|null,label:string)=>{if(v!=null&&Number.isInteger(v)&&v>0&&v<=999&&v!==correct&&!out.some(x=>x.value===v))out.push({value:v,errorLabel:label});};
  add(a+b+c+d,'ADDED_ALL_CORNERS');add(a*b+c*d,'ROW_PAIR_USED');add(a*c+b*d,'COLUMN_PAIR_USED');
  add(Math.abs(a*b-c*d),'ROW_PRODUCTS_DIFFERENCE');add(a*d+b*c,'DIAGONAL_PAIR_USED');
  add(Math.abs(a*d-b*c),'DIAGONAL_PRODUCTS_DIFFERENCE');add(c>d?(a+b)*(c-d):null,'TOP_SUM_TIMES_BOTTOM_DIFFERENCE');
  add(a*b+c+d,'ONLY_FIRST_PAIR_USED');add(a*d+b+c,'WRONG_PAIR_COMBINED');
  return out;
}
function select(ruleId:MisCp007RuleId,seed:string){
  const groups=shuffle(validGroups(ruleId),seed+':groups');
  for(let start=0;start<Math.min(groups.length,45);start++){
    const evidence:MisCp007Group[]=[groups[start]!],used=new Set([start]);
    while(evidence.length<3){let best=-1,bn=Infinity;
      for(let i=0;i<Math.min(groups.length,300);i++){if(used.has(i))continue;const g=groups[i]!;
        if(evidence.some(e=>e.centre===g.centre||shared(e,g)>1))continue;const a=auditMisCp007Ambiguity(ruleId,[...evidence,g]),n=new Set(a.matches.map(m=>m.semanticKey)).size;
        if(n<bn){best=i;bn=n;}if(n===1)break;
      }
      if(best<0)break;evidence.push(groups[best]!);used.add(best);
      if(evidence.length>=2){const ambiguity=auditMisCp007Ambiguity(ruleId,evidence);if(!ambiguity.accepted)continue;
        const target=groups.find((g,i)=>!used.has(i)&&distractors(ruleId,g).length>=3&&!evidence.some(e=>e.centre===g.centre||shared(e,g)>1));
        if(target)return{evidence,target,ambiguity};
      }
    }
  }throw new Error('Unable to construct unambiguous CP007 '+ruleId);
}
function words(ruleId:MisCp007RuleId):string{
  switch(ruleId){
    case 'SUM_FOUR_CORNERS':return'Add all four corner numbers.';
    case 'ROW_PRODUCTS_SUM':return'Multiply the two numbers in the top row and the two in the bottom row, then add the products.';
    case 'COLUMN_PRODUCTS_SUM':return'Multiply the two numbers in the left column and the two in the right column, then add the products.';
    case 'ROW_PRODUCTS_DIFFERENCE':return'Multiply each row pair, then take the positive difference between the two products.';
    case 'TOP_SUM_TIMES_BOTTOM_DIFFERENCE':return'Add the two top numbers, subtract the bottom-right number from the bottom-left number, then multiply the results.';
    case 'DIAGONAL_PRODUCTS_SUM':return'Multiply the two diagonal pairs, then add the products.';
    case 'DIAGONAL_PRODUCTS_DIFFERENCE':return'Multiply the two diagonal pairs, then take the positive difference between the products.';
  }
}
function calc(ruleId:MisCp007RuleId,g:MisCp007Group):string{
  const a=g.topLeft,b=g.topRight,c=g.bottomLeft,d=g.bottomRight,x=g.centre;
  switch(ruleId){
    case 'SUM_FOUR_CORNERS':return`${a} + ${b} + ${c} + ${d} = ${x}`;
    case 'ROW_PRODUCTS_SUM':{const p=a*b,q=c*d;return`Top row: ${a} × ${b} = ${p}\nBottom row: ${c} × ${d} = ${q}\n${p} + ${q} = ${x}`;}
    case 'COLUMN_PRODUCTS_SUM':{const p=a*c,q=b*d;return`Left column: ${a} × ${c} = ${p}\nRight column: ${b} × ${d} = ${q}\n${p} + ${q} = ${x}`;}
    case 'ROW_PRODUCTS_DIFFERENCE':{const p=a*b,q=c*d;return`Top row: ${a} × ${b} = ${p}\nBottom row: ${c} × ${d} = ${q}\n|${p} − ${q}| = ${x}`;}
    case 'TOP_SUM_TIMES_BOTTOM_DIFFERENCE':{const p=a+b,q=c-d;return`Top: ${a} + ${b} = ${p}\nBottom: ${c} − ${d} = ${q}\n${p} × ${q} = ${x}`;}
    case 'DIAGONAL_PRODUCTS_SUM':{const p=a*d,q=b*c;return`One diagonal: ${a} × ${d} = ${p}\nOther diagonal: ${b} × ${c} = ${q}\n${p} + ${q} = ${x}`;}
    case 'DIAGONAL_PRODUCTS_DIFFERENCE':{const p=a*d,q=b*c;return`One diagonal: ${a} × ${d} = ${p}\nOther diagonal: ${b} × ${c} = ${q}\n|${p} − ${q}| = ${x}`;}
  }
}
function rendered(g:MisCp007Group,hide:boolean,shape:'SQUARE'|'RECTANGLE'):MisCp007RenderedFigure{
  const positions={topLeft:g.topLeft,topRight:g.topRight,bottomLeft:g.bottomLeft,bottomRight:g.bottomRight,centre:hide?'?' as const:g.centre};
  return{positions,shape,svg:renderBoxSvg(positions,shape)};
}
export function generateMisCp007Question(candidateId:MisCp007CandidateId,seed:string|number='mis-cp007-v1'):GeneratedMisCp007Question{
  const rule=misCp007RuleByCandidateId(candidateId),base=String(seed),sel=select(rule.ruleId,base),shape: 'SQUARE'|'RECTANGLE'=hash(base+':shape')%2===0?'SQUARE':'RECTANGLE';
  const solved=independentlyEvaluateMisCp007Rule(rule.ruleId,{topLeft:sel.target.topLeft,topRight:sel.target.topRight,bottomLeft:sel.target.bottomLeft,bottomRight:sel.target.bottomRight});
  if(solved!==sel.target.centre)throw new Error('CP007 target solver disagreement');
  const wrong=shuffle(distractors(rule.ruleId,sel.target),base+':opts').slice(0,3);if(wrong.length!==3)throw new Error('CP007 distractor shortage');
  const correctIndex=hash(base+':'+candidateId)%4,options=[...wrong];options.splice(correctIndex,0,{value:sel.target.centre,errorLabel:null});
  const figures=[...sel.evidence.map(g=>rendered(g,false,shape)),rendered(sel.target,true,shape)];
  const previews=figures.map((f,i)=>`Figure ${i+1}:\n${figurePreview('SVG_BOX',f.positions)}`);
  const lines=sel.evidence.flatMap((g,i)=>[i===0?'Look at Figure 1:':`Check Figure ${i+1} in the same way:`,calc(rule.ruleId,g),'']);
  const explanation=['The same rule is used in every box.',words(rule.ruleId),'',...lines,'Now apply the same rule to the box with the question mark:',calc(rule.ruleId,sel.target),'',`So, ? = ${sel.target.centre}.`].join('\n');
  return{packageId:'MIS-001',checkpointId:'MIS-CP-007',candidateId,provisionalQl:true,ruleId:rule.ruleId,ruleFamily:rule.label,context:null,difficulty:rule.difficulty,renderer:'SVG_BOX',
    stem:['Find the missing value in the following figure.','',...previews].join('\n\n'),evidenceGroups:sel.evidence,target:sel.target,figures,options,correctIndex,answer:sel.target.centre,explanation,
    solverTrace:[...sel.evidence.map(g=>calc(rule.ruleId,g)),calc(rule.ruleId,sel.target)],ambiguityAudit:sel.ambiguity,
    structuralFingerprint:['MIS-CP-007',rule.ruleId,'SVG_BOX',shape,'CENTRE_MISSING',`EVIDENCE_${sel.evidence.length}`].join('|'),
    numericFingerprint:[...sel.evidence,sel.target].map(g=>`${g.topLeft},${g.topRight},${g.bottomLeft},${g.bottomRight},${g.centre}`).join('|'),
    operationDepth:rule.operationDepth,operandCount:4,groupCount:sel.evidence.length+1,missingPosition:'CENTRE_MISSING',semanticPositions:['topLeft','topRight','bottomLeft','bottomRight','centre']};
}
export const MIS_CP007_CANDIDATE_IDS=Object.freeze(MIS_CP007_RULES.map(r=>r.candidateId));
