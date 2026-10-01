import { createHash } from "node:crypto";
import {
  resolveInequalityRelation,
  type InequalityFact,
  type InequalityRelation,
} from "../../../../../lib/reasoning/inequality-foundation.ts";
import {
  evaluateFiniteDomainTriple,
  type ThreeStatementSufficiencyEvaluation,
} from "../DSF-CP-015/three-statement-foundation.ts";
import {
  buildThreeStatementAnswerOptions,
  isKnownThreeStatementSemanticKey,
  renderThreeStatementSemanticLabel,
  type DsfCp015ThreeStatementSemanticKey,
} from "../DSF-CP-015/three-statement-answer-profile.ts";

export const DSF_CP024_INEQUALITY_QL002_RUNTIME_VERSION = "DSF_CP024_INEQUALITY_QL002_RUNTIME_V1" as const;
export const DSF_CP024_INEQUALITY_SOLVE_MODES = [
  "DSF-SM-INEQ-A-VS-D",
  "DSF-SM-INEQ-A-VS-C",
  "DSF-SM-INEQ-B-VS-D",
] as const;

type SolveMode=(typeof DSF_CP024_INEQUALITY_SOLVE_MODES)[number];
type SymbolId="A"|"B"|"C"|"D";
type ContextId="SYMBOLIC_VALUES"|"SCORE_COMPARISON"|"WEIGHT_COMPARISON"|"HEIGHT_COMPARISON"|"PRICE_COMPARISON"|"RANK_VALUE_COMPARISON";
type World=Readonly<{A:number;B:number;C:number;D:number;facts:readonly InequalityFact[]}>;
type Problem=Readonly<{solveMode:SolveMode;anchor:World;contextId:ContextId}>;
type Statement=Readonly<{id:string;family:string;complexity:1|2|3;text:string;test:(w:World)=>boolean}>;
type Candidate=Readonly<{i:Statement;ii:Statement;iii:Statement;evaluation:ThreeStatementSufficiencyEvaluation<string>;semanticKey:DsfCp015ThreeStatementSemanticKey;quality:number}>;

const SYMBOLS:readonly SymbolId[]=["A","B","C","D"];
const CONTEXTS:readonly ContextId[]=["SYMBOLIC_VALUES","SCORE_COMPARISON","WEIGHT_COMPARISON","HEIGHT_COMPARISON","PRICE_COMPARISON","RANK_VALUE_COMPARISON"];

function hash(text:string){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function pick(seed:string,n:number){if(!n)throw new Error("CP024 empty candidate set");return hash(seed)%n;}
function relation(w:World,l:SymbolId,r:SymbolId):InequalityRelation{return w[l]===w[r]?"=":w[l]>w[r]?">":"<";}
function fact(l:SymbolId,r:SymbolId,lv:number,rv:number):InequalityFact{return lv===rv?{left:l,relation:"=",right:r}:lv>rv?{left:l,relation:">",right:r}:{left:r,relation:">",right:l};}
function allFacts(v:Readonly<Record<SymbolId,number>>){const out:InequalityFact[]=[];for(let i=0;i<SYMBOLS.length;i++)for(let j=i+1;j<SYMBOLS.length;j++){const l=SYMBOLS[i]!,r=SYMBOLS[j]!;out.push(fact(l,r,v[l],v[r]));}return Object.freeze(out);}
function enumerateWorlds():readonly World[]{const out:World[]=[];for(let A=0;A<=3;A++)for(let B=0;B<=3;B++)for(let C=0;C<=3;C++)for(let D=0;D<=3;D++){const v={A,B,C,D} as const;out.push(Object.freeze({...v,facts:allFacts(v)}));}return Object.freeze(out);}
const WORLDS=enumerateWorlds();
function pairFor(mode:SolveMode):readonly[SymbolId,SymbolId]{return mode==="DSF-SM-INEQ-A-VS-D"?["A","D"]:mode==="DSF-SM-INEQ-A-VS-C"?["A","C"]:["B","D"];}
function target(mode:SolveMode,w:World){const [l,r]=pairFor(mode);return resolveInequalityRelation(SYMBOLS,w.facts,l,r);}
const adapter={adapterId:"DSF-CP024-INEQ-THREE-STATEMENT-V1",domainFamily:"REASONING" as const,sourceChapterId:"REAS-INEQ",enumerateBaseWorlds:(_p:Problem)=>WORLDS,statementHolds:(_p:Problem,w:World,s:Statement)=>s.test(w),evaluateTarget:(p:Problem,w:World)=>target(p.solveMode,w),normalizeAnswer:(a:string)=>a};

function st(id:string,family:string,complexity:1|2|3,text:string,test:(w:World)=>boolean):Statement{return Object.freeze({id,family,complexity,text,test});}
function relText(l:SymbolId,r:InequalityRelation,right:SymbolId){return `${l} ${r} ${right}`;}
function pred(l:SymbolId,r:InequalityRelation,right:SymbolId){return (w:World)=>relation(w,l,right)===r;}
function nonLess(l:SymbolId,r:SymbolId){return (w:World)=>relation(w,l,r)!=="<";}
function targetLabel(mode:SolveMode){const [l,r]=pairFor(mode);return `definite relation between ${l} and ${r}`;}
function prompt(mode:SolveMode){const [l,r]=pairFor(mode);return `What is the definite relation between ${l} and ${r}?`;}
function lead(c:ContextId){return ({
  SYMBOLIC_VALUES:"Four symbolic quantities A, B, C and D have fixed relative values.",
  SCORE_COMPARISON:"A, B, C and D denote four candidates' scores.",
  WEIGHT_COMPARISON:"A, B, C and D denote four object weights.",
  HEIGHT_COMPARISON:"A, B, C and D denote four heights.",
  PRICE_COMPARISON:"A, B, C and D denote four prices.",
  RANK_VALUE_COMPARISON:"A, B, C and D denote four comparable performance values.",
} as const)[c];}

function pool(problem:Problem):readonly Statement[]{
  const a=problem.anchor,[ql,qr]=pairFor(problem.solveMode),t=target(problem.solveMode,a) as InequalityRelation;
  const ab=relation(a,"A","B"),bc=relation(a,"B","C"),cd=relation(a,"C","D"),ac=relation(a,"A","C"),bd=relation(a,"B","D"),ad=relation(a,"A","D");
  return Object.freeze([
    st(`TARGET_${t}`,"TARGET_EXACT",1,`${relText(ql,t,qr)}.`,w=>target(problem.solveMode,w)===t),
    st(`AB_${ab}`,"AB_EXACT",1,`${relText("A",ab,"B")}.`,pred("A",ab,"B")),
    st(`BC_${bc}`,"BC_EXACT",1,`${relText("B",bc,"C")}.`,pred("B",bc,"C")),
    st(`CD_${cd}`,"CD_EXACT",1,`${relText("C",cd,"D")}.`,pred("C",cd,"D")),
    st(`AC_${ac}`,"AC_EXACT",1,`${relText("A",ac,"C")}.`,pred("A",ac,"C")),
    st(`BD_${bd}`,"BD_EXACT",1,`${relText("B",bd,"D")}.`,pred("B",bd,"D")),
    st(`AD_${ad}`,"AD_EXACT",1,`${relText("A",ad,"D")}.`,pred("A",ad,"D")),
    st(`ABBD_${ab}_${bd}`,"AB_BD_CHAIN",2,`${relText("A",ab,"B")} and ${relText("B",bd,"D")}.`,w=>relation(w,"A","B")===ab&&relation(w,"B","D")===bd),
    st(`ACCD_${ac}_${cd}`,"AC_CD_CHAIN",2,`${relText("A",ac,"C")} and ${relText("C",cd,"D")}.`,w=>relation(w,"A","C")===ac&&relation(w,"C","D")===cd),
    st(`ABBC_${ab}_${bc}`,"AB_BC_CHAIN",2,`${relText("A",ab,"B")} and ${relText("B",bc,"C")}.`,w=>relation(w,"A","B")===ab&&relation(w,"B","C")===bc),
    st(`BCCD_${bc}_${cd}`,"BC_CD_CHAIN",2,`${relText("B",bc,"C")} and ${relText("C",cd,"D")}.`,w=>relation(w,"B","C")===bc&&relation(w,"C","D")===cd),
    st(`AB_NONLESS_${ab!=="<"}`,"AB_NONLESS",2,`A is ${ab!=="<"?"not less than":"less than"} B.`,ab!=="<"?nonLess("A","B"):w=>relation(w,"A","B")==="<"),
    st(`BC_NONLESS_${bc!=="<"}`,"BC_NONLESS",2,`B is ${bc!=="<"?"not less than":"less than"} C.`,bc!=="<"?nonLess("B","C"):w=>relation(w,"B","C")==="<"),
    st(`CD_NONLESS_${cd!=="<"}`,"CD_NONLESS",2,`C is ${cd!=="<"?"not less than":"less than"} D.`,cd!=="<"?nonLess("C","D"):w=>relation(w,"C","D")==="<"),
    st(`AD_EQ_${ad==="="}`,"A_D_EQUALITY_STATUS",2,`A and D are ${ad==="="?"equal":"not equal"}.`,w=>(relation(w,"A","D")==="=")===(ad==="=")),
  ]);
}

const CACHE=new Map<string,readonly Candidate[]>();
function candidates(problem:Problem):readonly Candidate[]{
  const a=problem.anchor,key=`${problem.solveMode}|${a.A}|${a.B}|${a.C}|${a.D}`,cached=CACHE.get(key);if(cached)return cached;
  const statements=pool(problem).filter(s=>s.test(a)),out:Candidate[]=[];
  for(let i=0;i<statements.length;i++)for(let j=i+1;j<statements.length;j++)for(let k=j+1;k<statements.length;k++){
    for(const [x,y,z] of [[statements[i]!,statements[j]!,statements[k]!],[statements[i]!,statements[k]!,statements[j]!],[statements[j]!,statements[i]!,statements[k]!]] as const){
      try{
        const evaluation=evaluateFiniteDomainTriple(adapter,problem,x,y,z);if(!isKnownThreeStatementSemanticKey(evaluation.semanticKey))continue;
        const quality=new Set([x.family,y.family,z.family]).size*8+evaluation.minimalSufficientSets.reduce((s,v)=>s+v.length,0)-x.complexity-y.complexity-z.complexity;
        out.push(Object.freeze({i:x,ii:y,iii:z,evaluation,semanticKey:evaluation.semanticKey,quality}));
      }catch{}
    }
  }
  const result=Object.freeze(out);if(!result.length)throw new Error(`CP024 no candidates for ${key}`);CACHE.set(key,result);return result;
}
function problem(seed:string,attempt:number):Problem{
  const solveMode=DSF_CP024_INEQUALITY_SOLVE_MODES[pick(`${seed}:mode:${attempt}`,3)]!,anchor=WORLDS[pick(`${seed}:anchor:${attempt}`,WORLDS.length)]!,contextId=CONTEXTS[pick(`${seed}:context:${attempt}`,CONTEXTS.length)]!;
  return Object.freeze({solveMode,anchor,contextId});
}
function select(seed:string){
  let fallback:{p:Problem;list:readonly Candidate[];breadth:number}|undefined;
  for(let attempt=0;attempt<40;attempt++){
    const p=problem(seed,attempt),list=candidates(p),keys=[...new Set(list.map(x=>x.semanticKey))].sort();
    if(!fallback||keys.length>fallback.breadth)fallback={p,list,breadth:keys.length};
    if(keys.length>=6){
      const semantic=keys[pick(`${seed}:semantic:${attempt}`,keys.length)]!,matching=list.filter(x=>x.semanticKey===semantic),top=Math.max(...matching.map(x=>x.quality)),short=matching.filter(x=>x.quality>=top-2);
      return {p,c:short[pick(`${seed}:triple:${attempt}`,short.length)]!};
    }
  }
  if(!fallback)throw new Error("CP024 unable to synthesize Inequality QL002");
  const top=Math.max(...fallback.list.map(x=>x.quality)),short=fallback.list.filter(x=>x.quality>=top-2);
  return {p:fallback.p,c:short[pick(`${seed}:fallback`,short.length)]!};
}
function explanation(p:Problem,c:Candidate){
  const get=(id:"I"|"II"|"III")=>c.evaluation.subsetEvaluations.find(e=>e.statementIds.length===1&&e.statementIds[0]===id)?.result;
  const line=(label:string,r:ReturnType<typeof get>)=>r?.sufficient?`${label} alone fixes the requested relation at ${r.normalizedTargetAnswers[0]}.`:`${label} alone does not fix one definite relation.`;
  return [`We need the ${targetLabel(p.solveMode)}.`,line("Statement I",get("I")),line("Statement II",get("II")),line("Statement III",get("III")),renderThreeStatementSemanticLabel(c.semanticKey)].join(" ");
}
export function generateDsfCp024InequalityQuestion(seed:string|number){
  const s=String(seed),{p,c}=select(s),options=buildThreeStatementAnswerOptions(c.semanticKey,hash(s)),correctIndex=options.findIndex(x=>x.isCorrect);
  const generationIdentity=createHash("sha256").update(`${DSF_CP024_INEQUALITY_QL002_RUNTIME_VERSION}|${s}|${p.solveMode}|${p.contextId}|${c.i.id}|${c.ii.id}|${c.iii.id}`).digest("hex").slice(0,24);
  return Object.freeze({
    packageId:"DSF-001" as const,checkpointId:"DSF-CP-024" as const,qlId:"DSF-QL-002" as const,runtimeVersion:DSF_CP024_INEQUALITY_QL002_RUNTIME_VERSION,
    language:"en" as const,locale:"en-IN" as const,domainFamily:"REASONING" as const,sourceChapterId:"REAS-INEQ" as const,
    sourceCapabilities:["lib/reasoning/inequality-foundation::resolveInequalityRelation"] as const,solveModeId:p.solveMode,contextId:p.contextId,
    statementCount:3 as const,taskContract:"THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,answerSemantic:"MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,
    stem:`${lead(p.contextId)} Equal values are allowed. ${prompt(p.solveMode)}`,questionPrompt:prompt(p.solveMode),
    statements:Object.freeze([
      Object.freeze({id:"I" as const,statementRuleId:c.i.id,statementFamily:c.i.family,text:c.i.text}),
      Object.freeze({id:"II" as const,statementRuleId:c.ii.id,statementFamily:c.ii.family,text:c.ii.text}),
      Object.freeze({id:"III" as const,statementRuleId:c.iii.id,statementFamily:c.iii.family,text:c.iii.text}),
    ] as const),
    options,correctIndex,canonicalAnswer:c.semanticKey,semanticKey:c.semanticKey,explanation:explanation(p,c),
    proof:Object.freeze({baseWorldCount:c.evaluation.base.worldCount,subsetEvaluations:c.evaluation.subsetEvaluations.map(e=>Object.freeze({statementIds:e.statementIds,worldCount:e.result.worldCount,sufficient:e.result.sufficient,normalizedTargetAnswers:e.result.normalizedTargetAnswers})),minimalSufficientSets:c.evaluation.minimalSufficientSets,allThreeWorldCount:c.evaluation.allThree.worldCount,allThreeSufficient:c.evaluation.allThree.sufficient,semanticKey:c.semanticKey}),
    generationIdentity,
    lifecycle:Object.freeze({questionStudioDiscoverable:false as const,questionBankWritable:false as const,testEligible:false as const,mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const}),
  });
}
export function generateDsfCp024InequalityBatch(seed:string,count=20){const n=Math.min(40,Math.max(1,Math.floor(count)));return Object.freeze(Array.from({length:n},(_,i)=>generateDsfCp024InequalityQuestion(`${seed}:${i}`)));}
