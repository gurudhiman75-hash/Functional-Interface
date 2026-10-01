import { createHash } from "node:crypto";
import { solveCodCp001 } from "../../../Coding-Decoding/COD-001/COD-CP-001/independent-solver.ts";
import { mappingFromEvidence } from "../../../Coding-Decoding/COD-001/foundation/mapping.ts";
import type { DirectMappingPrompt, MappingEvidence } from "../../../Coding-Decoding/COD-001/foundation/types.ts";
import { evaluateFiniteDomainTriple, type ThreeStatementSufficiencyEvaluation } from "../DSF-CP-015/three-statement-foundation.ts";
import {
  buildThreeStatementAnswerOptions,
  isKnownThreeStatementSemanticKey,
  renderThreeStatementSemanticLabel,
  type DsfCp015ThreeStatementSemanticKey,
} from "../DSF-CP-015/three-statement-answer-profile.ts";
import { renderThreeStatementEditorialExplanation } from "../shared/three-statement-editorial-explanation.ts";

export const DSF_CP026_CODING_QL002_RUNTIME_VERSION="DSF_CP026_CODING_QL002_RUNTIME_V1" as const;
export const DSF_CP026_CODING_SOLVE_MODES=[
  "DSF-SM-COD-ENCODE-FIRST-SYMBOL",
  "DSF-SM-COD-DECODE-DIGIT-1",
  "DSF-SM-COD-ENCODE-FIRST-TWO",
] as const;
type SolveMode=(typeof DSF_CP026_CODING_SOLVE_MODES)[number];
type ContextId="CODE_LANGUAGE"|"ACCESS_KEY"|"ARCHIVE_KEY"|"TRAINING_CODE"|"SIGNAL_CODE"|"LABEL_CODE";
type Symbols=readonly[string,string,string,string];
type World=Readonly<{tokensByIndex:readonly[string,string,string,string]}>;
type Context=Readonly<{id:ContextId;symbols:Symbols}>;
type Problem=Readonly<{solveMode:SolveMode;context:Context;anchor:World}>;
type Statement=Readonly<{id:string;family:"SINGLE_MAPPING"|"DOUBLE_MAPPING"|"TRIPLE_MAPPING";complexity:1|2|3;sourceIndexes:readonly(0|1|2|3)[];text:string;test:(w:World)=>boolean}>;
type Candidate=Readonly<{i:Statement;ii:Statement;iii:Statement;evaluation:ThreeStatementSufficiencyEvaluation<string>;semanticKey:DsfCp015ThreeStatementSemanticKey;quality:number}>;

const TOKENS=["1","2","3","4"] as const;
const CONTEXTS:readonly Context[]=[
 {id:"CODE_LANGUAGE",symbols:["A","B","C","D"]},
 {id:"ACCESS_KEY",symbols:["P","Q","R","S"]},
 {id:"ARCHIVE_KEY",symbols:["J","K","L","M"]},
 {id:"TRAINING_CODE",symbols:["W","X","Y","Z"]},
 {id:"SIGNAL_CODE",symbols:["G","H","I","J"]},
 {id:"LABEL_CODE",symbols:["R","T","U","V"]},
];
function hash(t:string){let h=2166136261;for(const ch of t){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function pick(seed:string,n:number){if(!n)throw new Error("CP026 empty set");return hash(seed)%n;}
function permutations(values:readonly string[]){const o:[string,string,string,string][]=[];for(const a of values)for(const b of values)for(const c of values)for(const d of values){if(new Set([a,b,c,d]).size===4)o.push([a,b,c,d]);}return Object.freeze(o.map(x=>Object.freeze(x)));}
const WORLDS:readonly World[]=Object.freeze(permutations(TOKENS).map(tokensByIndex=>Object.freeze({tokensByIndex})));
if(WORLDS.length!==24)throw new Error("CP026 coding universe must contain 24 worlds");

function evidence(p:Problem,w:World):readonly MappingEvidence[]{return p.context.symbols.map((source,index)=>({source,code:w.tokensByIndex[index]!}));}
function target(p:Problem,w:World):string{
 const ev=evidence(p,w); mappingFromEvidence(ev,"-"); const [first,second]=p.context.symbols;
 const prompt:DirectMappingPrompt=p.solveMode==="DSF-SM-COD-DECODE-DIGIT-1"
  ?{taskKind:"DECODE_TARGET",outputKind:"DIGIT",evidence:ev,target:"",encodedTarget:"1",separator:"-"}
  :{taskKind:"ENCODE_TARGET",outputKind:"DIGIT",evidence:ev,target:p.solveMode==="DSF-SM-COD-ENCODE-FIRST-TWO"?`${first}${second}`:first,separator:"-"};
 return solveCodCp001(prompt);
}
const adapter={adapterId:"DSF-CP026-CODING-THREE-STATEMENT-V1",domainFamily:"REASONING" as const,sourceChapterId:"COD-001",enumerateBaseWorlds:(_p:Problem)=>WORLDS,statementHolds:(_p:Problem,w:World,s:Statement)=>s.test(w),evaluateTarget:(p:Problem,w:World)=>target(p,w),normalizeAnswer:(a:string)=>a};
function subset(mask:number){const x:(0|1|2|3)[]=[];for(let i=0 as 0|1|2|3;i<4;i=(i+1) as 0|1|2|3)if(mask&(1<<i))x.push(i);return x;}
function family(n:number){return n===1?"SINGLE_MAPPING":n===2?"DOUBLE_MAPPING":"TRIPLE_MAPPING";}
function render(p:Problem,indexes:readonly(0|1|2|3)[]){const parts=indexes.map(i=>`${p.context.symbols[i]} is coded as ${p.anchor.tokensByIndex[i]}`);return parts.join("; ")+ ".";}
function pool(p:Problem):readonly Statement[]{
 const out:Statement[]=[];
 for(let mask=1;mask<15;mask++){const indexes=subset(mask);if(indexes.length>3)continue;const facts=indexes.map(i=>({i,token:p.anchor.tokensByIndex[i]!}));out.push(Object.freeze({id:`MAP_${indexes.join("")}_${facts.map(f=>f.token).join("")}`,family:family(indexes.length),complexity:indexes.length as 1|2|3,sourceIndexes:indexes,text:render(p,indexes),test:(w:World)=>facts.every(f=>w.tokensByIndex[f.i]===f.token)}));}
 return Object.freeze(out);
}
const CACHE=new Map<string,readonly Candidate[]>();
function candidates(p:Problem):readonly Candidate[]{
 const key=`${p.solveMode}|${p.context.id}|${p.anchor.tokensByIndex.join("")}`,cached=CACHE.get(key);if(cached)return cached;
 const st=pool(p),out:Candidate[]=[];
 for(let i=0;i<st.length;i++)for(let j=i+1;j<st.length;j++)for(let k=j+1;k<st.length;k++){
  for(const [a,b,c] of [[st[i]!,st[j]!,st[k]!],[st[i]!,st[k]!,st[j]!],[st[j]!,st[i]!,st[k]!]] as const){
   try{const e=evaluateFiniteDomainTriple(adapter,p,a,b,c);if(!isKnownThreeStatementSemanticKey(e.semanticKey))continue;const overlap=a.sourceIndexes.filter(x=>b.sourceIndexes.includes(x)||c.sourceIndexes.includes(x)).length+b.sourceIndexes.filter(x=>c.sourceIndexes.includes(x)).length;const quality=new Set([a.family,b.family,c.family]).size*8-overlap*2+e.minimalSufficientSets.reduce((s,x)=>s+x.length,0)-(a.complexity+b.complexity+c.complexity);out.push(Object.freeze({i:a,ii:b,iii:c,evaluation:e,semanticKey:e.semanticKey,quality}));}catch{}
  }
 }
 const r=Object.freeze(out);if(!r.length)throw new Error(`CP026 no triples ${key}`);CACHE.set(key,r);return r;
}
function problem(seed:string,attempt:number):Problem{const solveMode=DSF_CP026_CODING_SOLVE_MODES[pick(`${seed}:mode:${attempt}`,3)]!,context=CONTEXTS[pick(`${seed}:context:${attempt}`,6)]!,anchor=WORLDS[pick(`${seed}:anchor:${attempt}`,24)]!;return Object.freeze({solveMode,context,anchor});}
function select(seed:string){let fb:{p:Problem;l:readonly Candidate[];b:number}|undefined;for(let a=0;a<24;a++){const p=problem(seed,a),l=candidates(p),keys=[...new Set(l.map(x=>x.semanticKey))].sort();if(!fb||keys.length>fb.b)fb={p,l,b:keys.length};if(keys.length>=6){const sem=keys[pick(`${seed}:sem:${a}`,keys.length)]!,m=l.filter(x=>x.semanticKey===sem),top=Math.max(...m.map(x=>x.quality)),s=m.filter(x=>x.quality>=top-2);return {p,c:s[pick(`${seed}:triple:${a}`,s.length)]!};}}if(!fb)throw new Error("CP026 synthesis failed");const top=Math.max(...fb.l.map(x=>x.quality)),s=fb.l.filter(x=>x.quality>=top-2);return {p:fb.p,c:s[pick(`${seed}:fallback`,s.length)]!};}
function prompt(p:Problem){const [a,b]=p.context.symbols;return p.solveMode==="DSF-SM-COD-ENCODE-FIRST-SYMBOL"?`What is the digit code of ${a}?`:p.solveMode==="DSF-SM-COD-DECODE-DIGIT-1"?"Which source symbol is represented by digit 1?":`How is the sequence ${a}${b} coded?`;}
function label(p:Problem){const [a,b]=p.context.symbols;return p.solveMode==="DSF-SM-COD-ENCODE-FIRST-SYMBOL"?`the exact digit assigned to ${a}`:p.solveMode==="DSF-SM-COD-DECODE-DIGIT-1"?"the exact source symbol assigned digit 1":`the exact code of ${a}${b}`;}
function lead(c:ContextId){return ({CODE_LANGUAGE:"A code language maps four symbols to four different digits.",ACCESS_KEY:"An access-key system maps four symbols to four different digits.",ARCHIVE_KEY:"An archive key maps four symbols to four different digits.",TRAINING_CODE:"A training code maps four symbols to four different digits.",SIGNAL_CODE:"A signal code maps four symbols to four different digits.",LABEL_CODE:"A label code maps four symbols to four different digits."} as const)[c];}
function explanation(p:Problem,c:Candidate){
  return renderThreeStatementEditorialExplanation(c.evaluation, label(p), c.semanticKey);
}
export function generateDsfCp026CodingQuestion(seed:string|number){const s=String(seed),{p,c}=select(s),options=buildThreeStatementAnswerOptions(c.semanticKey,hash(s)),correctIndex=options.findIndex(x=>x.isCorrect),generationIdentity=createHash("sha256").update(`${DSF_CP026_CODING_QL002_RUNTIME_VERSION}|${s}|${p.solveMode}|${p.context.id}|${p.anchor.tokensByIndex.join("")}|${c.i.id}|${c.ii.id}|${c.iii.id}`).digest("hex").slice(0,24);return Object.freeze({packageId:"DSF-001" as const,checkpointId:"DSF-CP-026" as const,qlId:"DSF-QL-002" as const,runtimeVersion:DSF_CP026_CODING_QL002_RUNTIME_VERSION,language:"en" as const,locale:"en-IN" as const,domainFamily:"REASONING" as const,sourceChapterId:"COD-001" as const,sourceCheckpointId:"COD-CP-001" as const,sourceCapabilities:["COD-CP-001/independent-solver::solveCodCp001","COD-001/foundation/mapping::mappingFromEvidence"] as const,solveModeId:p.solveMode,contextId:p.context.id,statementCount:3 as const,taskContract:"THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,answerSemantic:"MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,stem:`${lead(p.context.id)} The digits 1, 2, 3 and 4 are used exactly once each. ${prompt(p)}`,questionPrompt:prompt(p),statements:Object.freeze([Object.freeze({id:"I" as const,statementRuleId:c.i.id,statementFamily:c.i.family,text:c.i.text}),Object.freeze({id:"II" as const,statementRuleId:c.ii.id,statementFamily:c.ii.family,text:c.ii.text}),Object.freeze({id:"III" as const,statementRuleId:c.iii.id,statementFamily:c.iii.family,text:c.iii.text})] as const),options,correctIndex,canonicalAnswer:c.semanticKey,semanticKey:c.semanticKey,explanation:explanation(p,c),proof:Object.freeze({baseWorldCount:c.evaluation.base.worldCount,subsetEvaluations:c.evaluation.subsetEvaluations.map(e=>Object.freeze({statementIds:e.statementIds,worldCount:e.result.worldCount,sufficient:e.result.sufficient,normalizedTargetAnswers:e.result.normalizedTargetAnswers})),minimalSufficientSets:c.evaluation.minimalSufficientSets,allThreeWorldCount:c.evaluation.allThree.worldCount,allThreeSufficient:c.evaluation.allThree.sufficient,semanticKey:c.semanticKey}),generationIdentity,lifecycle:Object.freeze({questionStudioDiscoverable:false as const,questionBankWritable:false as const,testEligible:false as const,mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const})});}
export function generateDsfCp026CodingBatch(seed:string,count=20){const n=Math.min(40,Math.max(1,Math.floor(count)));return Object.freeze(Array.from({length:n},(_,i)=>generateDsfCp026CodingQuestion(`${seed}:${i}`)));}
