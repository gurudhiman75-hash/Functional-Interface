import { createHash } from "node:crypto";
import { evaluateConstraint } from "../../../SeatingArrangement/SEA-001/constraints/evaluate.ts";
import { LinearTopology } from "../../../SeatingArrangement/SEA-001/topology/linear.ts";
import { solveLinear } from "../../../SeatingArrangement/SEA-001/solver/production-solver.ts";
import { enumerateLinearOracle } from "../../../SeatingArrangement/SEA-001/solver/independent-oracle.ts";
import type { FacingDirection, LinearConstraint, PersonId, SolverModel } from "../../../SeatingArrangement/SEA-001/types.ts";
import { evaluateFiniteDomainTriple, type ThreeStatementSufficiencyEvaluation } from "../DSF-CP-015/three-statement-foundation.ts";
import {
  buildThreeStatementAnswerOptions,
  isKnownThreeStatementSemanticKey,
  renderThreeStatementSemanticLabel,
  type DsfCp015ThreeStatementSemanticKey,
} from "../DSF-CP-015/three-statement-answer-profile.ts";
import { renderThreeStatementEditorialExplanation } from "../shared/three-statement-editorial-explanation.ts";

export const DSF_CP025_SEATING_QL002_RUNTIME_VERSION="DSF_CP025_SEATING_QL002_RUNTIME_V1" as const;
export const DSF_CP025_SEATING_SOLVE_MODES=[
  "DSF-SM-SEA-MIDDLE-OCCUPANT",
  "DSF-SM-SEA-AMAN-POSITION",
  "DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA",
  "DSF-SM-SEA-CHARAN-RELATIVE-TO-DIYA",
] as const;
type SolveMode=(typeof DSF_CP025_SEATING_SOLVE_MODES)[number];
type ContextId="TRAINING_ROW"|"SEMINAR_ROW"|"WAITING_BENCH"|"INTERVIEW_ROW"|"BRIEFING_ROW"|"CONFERENCE_ROW";
type World=Readonly<{model:SolverModel;placement:ReadonlyMap<PersonId,number>}>;
type Problem=Readonly<{solveMode:SolveMode;facing:FacingDirection;anchor:World;contextId:ContextId}>;
type Statement=Readonly<{id:string;family:string;complexity:1|2|3;text:string;test:(w:World)=>boolean}>;
type Candidate=Readonly<{i:Statement;ii:Statement;iii:Statement;evaluation:ThreeStatementSufficiencyEvaluation<string|number>;semanticKey:DsfCp015ThreeStatementSemanticKey;quality:number}>;

const PEOPLE=["Aman","Bina","Charan","Diya","Eshan"] as const;
const IDS:readonly PersonId[]=PEOPLE;
const TOPOLOGY=new LinearTopology(PEOPLE.length);
const CONTEXTS:readonly ContextId[]=["TRAINING_ROW","SEMINAR_ROW","WAITING_BENCH","INTERVIEW_ROW","BRIEFING_ROW","CONFERENCE_ROW"];
const PAIRS=[["Aman","Bina"],["Aman","Charan"],["Bina","Diya"],["Charan","Eshan"],["Charan","Diya"]] as const;

function hash(text:string){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function pick(seed:string,n:number){if(!n)throw new Error("CP025 empty candidate set");return hash(seed)%n;}

function parityWorlds(facing:FacingDirection):readonly World[]{
  const prod=solveLinear({personIds:IDS,facing,constraints:[]});
  if(prod.truncated)throw new Error(`CP025 seating solver truncated ${facing}`);
  const oracle=enumerateLinearOracle({personIds:IDS,facing,constraints:[]});
  const pk=prod.models.map(m=>m.canonicalKey).sort(),ok=oracle.map(m=>m.canonicalKey).sort();
  if(pk.length!==120||ok.length!==120||pk.join("|")!==ok.join("|"))throw new Error(`CP025 seating solver/oracle mismatch ${facing}`);
  return Object.freeze(prod.models.map(model=>Object.freeze({model,placement:new Map(model.seatOrder.map((id,i)=>[id,i] as const))})));
}
const BY_FACING:Readonly<Record<FacingDirection,readonly World[]>>=Object.freeze({NORTH:parityWorlds("NORTH"),SOUTH:parityWorlds("SOUTH")});
function holds(w:World,c:LinearConstraint){return evaluateConstraint(c,w.placement,TOPOLOGY,w.model.facing)==="SATISFIED";}
function seat(w:World,id:PersonId){const s=w.placement.get(id);if(s===undefined)throw new Error(`missing ${id}`);return s;}
function relAnswer(w:World,s:PersonId,r:PersonId){
  for(const direction of ["LEFT","RIGHT"] as const)for(let steps=1;steps<PEOPLE.length;steps++){
    const c:LinearConstraint={id:`REL_${s}_${r}_${direction}_${steps}`,kind:"RELATIVE_POSITION",subjectId:s,referenceId:r,direction,steps};
    if(holds(w,c))return `${direction}_${steps}`;
  }
  throw new Error("relative answer unresolved");
}
function target(mode:SolveMode,w:World):string|number{
  if(mode==="DSF-SM-SEA-MIDDLE-OCCUPANT")return w.model.seatOrder[2]!;
  if(mode==="DSF-SM-SEA-AMAN-POSITION")return seat(w,"Aman")+1;
  if(mode==="DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA")return Math.abs(seat(w,"Aman")-seat(w,"Bina"))-1;
  return relAnswer(w,"Charan","Diya");
}
const adapter={adapterId:"DSF-CP025-SEA-THREE-STATEMENT-V1",domainFamily:"REASONING" as const,sourceChapterId:"SEA-001",enumerateBaseWorlds:(p:Problem)=>BY_FACING[p.facing],statementHolds:(_p:Problem,w:World,s:Statement)=>s.test(w),evaluateTarget:(p:Problem,w:World)=>target(p.solveMode,w),normalizeAnswer:(a:string|number)=>String(a)};
function st(id:string,family:string,complexity:1|2|3,text:string,test:(w:World)=>boolean):Statement{return Object.freeze({id,family,complexity,text,test});}
function pos(i:number){return ["first","second","third","fourth","fifth"][i]??`${i+1}th`;}
function places(n:number){return n===1?"immediately":`${n} places`;}
function prompt(mode:SolveMode){return mode==="DSF-SM-SEA-MIDDLE-OCCUPANT"?"Who occupies the middle seat?":mode==="DSF-SM-SEA-AMAN-POSITION"?"What is Aman's position from the left end?":mode==="DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA"?"How many people sit between Aman and Bina?":"What is Charan's exact position relative to Diya?";}
function targetLabel(mode:SolveMode){return mode==="DSF-SM-SEA-MIDDLE-OCCUPANT"?"the person in the middle seat":mode==="DSF-SM-SEA-AMAN-POSITION"?"Aman's exact position from the left end":mode==="DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA"?"the number of people between Aman and Bina":"Charan's exact position relative to Diya";}
function lead(c:ContextId){return ({
 TRAINING_ROW:"Five trainees are seated in a straight row.",SEMINAR_ROW:"Five participants are seated in a seminar row.",WAITING_BENCH:"Five people are seated on a straight waiting bench.",INTERVIEW_ROW:"Five candidates are seated in a straight interview row.",BRIEFING_ROW:"Five staff members are seated in a straight briefing row.",CONFERENCE_ROW:"Five delegates are seated in a straight conference row."
} as const)[c];}

function trueConstraint(p:Problem,c:LinearConstraint,family:string,complexity:1|2|3,text:string){if(!holds(p.anchor,c))throw new Error("false seating clue");return st(c.id,family,complexity,text,w=>holds(w,c));}
function relConstraint(p:Problem,s:PersonId,r:PersonId):LinearConstraint{const [direction,n]=relAnswer(p.anchor,s,r).split("_") as ["LEFT"|"RIGHT",string];return {id:`REL_${s}_${r}_${direction}_${n}`,kind:"RELATIVE_POSITION",subjectId:s,referenceId:r,direction,steps:Number(n)};}
function pool(p:Problem):readonly Statement[]{
 const a=p.anchor,out:Statement[]=[];
 for(const id of PEOPLE){const si=seat(a,id),c:LinearConstraint={id:`ABS_${id}_${si}`,kind:"ABSOLUTE_SEAT",personId:id,seatIndex:si};out.push(trueConstraint(p,c,"ABSOLUTE_SEAT",1,`${id} occupies the ${pos(si)} seat from the left end.`));}
 for(const id of [a.model.seatOrder[0]!,a.model.seatOrder[4]!] as PersonId[]){const c:LinearConstraint={id:`END_${id}`,kind:"AT_END",personId:id};out.push(trueConstraint(p,c,"AT_END",2,`${id} sits at one of the ends.`));}
 const mid=a.model.seatOrder[2]!;out.push(trueConstraint(p,{id:`MID_${mid}`,kind:"AT_MIDDLE",personId:mid},"AT_MIDDLE",1,`${mid} sits in the middle.`));
 for(let i=0;i<PEOPLE.length-1;i++){const f=a.model.seatOrder[i]!,s=a.model.seatOrder[i+1]!,c:LinearConstraint={id:`ADJ_${f}_${s}`,kind:"ADJACENT",firstId:f,secondId:s};out.push(trueConstraint(p,c,"ADJACENT",2,`${f} and ${s} sit next to each other.`));}
 for(const [f,s] of PAIRS){const count=Math.abs(seat(a,f)-seat(a,s))-1,c:LinearConstraint={id:`BET_${f}_${s}_${count}`,kind:"EXACT_COUNT_BETWEEN",firstId:f,secondId:s,count};out.push(trueConstraint(p,c,"EXACT_COUNT_BETWEEN",2,`${count} ${count===1?"person sits":"people sit"} between ${f} and ${s}.`));if(count>0){const n:LinearConstraint={id:`NADJ_${f}_${s}`,kind:"NOT_ADJACENT",firstId:f,secondId:s};out.push(trueConstraint(p,n,"NOT_ADJACENT",3,`${f} and ${s} are not adjacent.`));}}
 for(const [s,r] of [["Charan","Diya"],["Aman","Bina"]] as const){const c=relConstraint(p,s,r);out.push(trueConstraint(p,c,"RELATIVE_POSITION",1,`${s} sits ${places(c.steps)} to the ${c.direction.toLowerCase()} of ${r}.`));}
 const t=target(p.solveMode,a);
 out.push(st(`TARGET_${p.solveMode}_${String(t)}`,"TARGET_EXACT",1,p.solveMode==="DSF-SM-SEA-MIDDLE-OCCUPANT"?`${String(t)} sits in the middle seat.`:p.solveMode==="DSF-SM-SEA-AMAN-POSITION"?`Aman is ${pos(Number(t)-1)} from the left end.`:p.solveMode==="DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA"?`${String(t)} ${Number(t)===1?"person sits":"people sit"} between Aman and Bina.`:(()=>{const [d,n]=String(t).split("_");return `Charan sits ${places(Number(n))} to the ${d!.toLowerCase()} of Diya.`;})(),w=>target(p.solveMode,w)===t));
 return Object.freeze(out);
}
const CACHE=new Map<string,readonly Candidate[]>();
function candidates(p:Problem):readonly Candidate[]{
 const key=`${p.solveMode}|${p.facing}|${p.anchor.model.canonicalKey}`,cached=CACHE.get(key);if(cached)return cached;
 const statements=pool(p),out:Candidate[]=[];
 for(let i=0;i<statements.length;i++)for(let j=i+1;j<statements.length;j++)for(let k=j+1;k<statements.length;k++){
  for(const [x,y,z] of [[statements[i]!,statements[j]!,statements[k]!],[statements[i]!,statements[k]!,statements[j]!],[statements[j]!,statements[i]!,statements[k]!]] as const){
   try{const e=evaluateFiniteDomainTriple(adapter,p,x,y,z);if(!isKnownThreeStatementSemanticKey(e.semanticKey))continue;const quality=new Set([x.family,y.family,z.family]).size*8+e.minimalSufficientSets.reduce((s,v)=>s+v.length,0)-(x.complexity+y.complexity+z.complexity)-(x.family==="TARGET_EXACT"||y.family==="TARGET_EXACT"||z.family==="TARGET_EXACT"?2:0);out.push(Object.freeze({i:x,ii:y,iii:z,evaluation:e,semanticKey:e.semanticKey,quality}));}catch{}
  }
 }
 const result=Object.freeze(out);if(!result.length)throw new Error(`CP025 no seating triples ${key}`);CACHE.set(key,result);return result;
}
function problem(seed:string,attempt:number):Problem{const solveMode=DSF_CP025_SEATING_SOLVE_MODES[pick(`${seed}:mode:${attempt}`,4)]!,facing=(pick(`${seed}:facing:${attempt}`,2)===0?"NORTH":"SOUTH") as FacingDirection,worlds=BY_FACING[facing],anchor=worlds[pick(`${seed}:anchor:${attempt}`,worlds.length)]!,contextId=CONTEXTS[pick(`${seed}:context:${attempt}`,CONTEXTS.length)]!;return Object.freeze({solveMode,facing,anchor,contextId});}
function select(seed:string){let fallback:{p:Problem;list:readonly Candidate[];breadth:number}|undefined;for(let a=0;a<30;a++){const p=problem(seed,a),list=candidates(p),keys=[...new Set(list.map(x=>x.semanticKey))].sort();if(!fallback||keys.length>fallback.breadth)fallback={p,list,breadth:keys.length};if(keys.length>=6){const sem=keys[pick(`${seed}:semantic:${a}`,keys.length)]!,m=list.filter(x=>x.semanticKey===sem),top=Math.max(...m.map(x=>x.quality)),short=m.filter(x=>x.quality>=top-2);return {p,c:short[pick(`${seed}:triple:${a}`,short.length)]!};}}if(!fallback)throw new Error("CP025 cannot synthesize seating");const top=Math.max(...fallback.list.map(x=>x.quality)),short=fallback.list.filter(x=>x.quality>=top-2);return {p:fallback.p,c:short[pick(`${seed}:fallback`,short.length)]!};}
function explanation(p:Problem,c:Candidate){
  return renderThreeStatementEditorialExplanation(c.evaluation, targetLabel(p.solveMode), c.semanticKey);
}
export function generateDsfCp025SeatingQuestion(seed:string|number){const s=String(seed),{p,c}=select(s),options=buildThreeStatementAnswerOptions(c.semanticKey,hash(s)),correctIndex=options.findIndex(x=>x.isCorrect),generationIdentity=createHash("sha256").update(`${DSF_CP025_SEATING_QL002_RUNTIME_VERSION}|${s}|${p.solveMode}|${p.facing}|${p.anchor.model.canonicalKey}|${c.i.id}|${c.ii.id}|${c.iii.id}`).digest("hex").slice(0,24);return Object.freeze({packageId:"DSF-001" as const,checkpointId:"DSF-CP-025" as const,qlId:"DSF-QL-002" as const,runtimeVersion:DSF_CP025_SEATING_QL002_RUNTIME_VERSION,language:"en" as const,locale:"en-IN" as const,domainFamily:"REASONING" as const,sourceChapterId:"SEA-001" as const,sourceCapabilities:["SEA-001/solver/production-solver::solveLinear","SEA-001/solver/independent-oracle::enumerateLinearOracle"] as const,solveModeId:p.solveMode,contextId:p.contextId,facing:p.facing,solverOracleParity:true as const,statementCount:3 as const,taskContract:"THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,answerSemantic:"MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,stem:`${lead(p.contextId)} All five face ${p.facing==="NORTH"?"north":"south"}. ${prompt(p.solveMode)}`,questionPrompt:prompt(p.solveMode),statements:Object.freeze([Object.freeze({id:"I" as const,statementRuleId:c.i.id,statementFamily:c.i.family,text:c.i.text}),Object.freeze({id:"II" as const,statementRuleId:c.ii.id,statementFamily:c.ii.family,text:c.ii.text}),Object.freeze({id:"III" as const,statementRuleId:c.iii.id,statementFamily:c.iii.family,text:c.iii.text})] as const),options,correctIndex,canonicalAnswer:c.semanticKey,semanticKey:c.semanticKey,explanation:explanation(p,c),proof:Object.freeze({baseWorldCount:c.evaluation.base.worldCount,subsetEvaluations:c.evaluation.subsetEvaluations.map(e=>Object.freeze({statementIds:e.statementIds,worldCount:e.result.worldCount,sufficient:e.result.sufficient,normalizedTargetAnswers:e.result.normalizedTargetAnswers})),minimalSufficientSets:c.evaluation.minimalSufficientSets,allThreeWorldCount:c.evaluation.allThree.worldCount,allThreeSufficient:c.evaluation.allThree.sufficient,semanticKey:c.semanticKey,productionOracleParity:true as const}),generationIdentity,lifecycle:Object.freeze({questionStudioDiscoverable:false as const,questionBankWritable:false as const,testEligible:false as const,mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const})});}
export function generateDsfCp025SeatingBatch(seed:string,count=16){const n=Math.min(24,Math.max(1,Math.floor(count)));return Object.freeze(Array.from({length:n},(_,i)=>generateDsfCp025SeatingQuestion(`${seed}:${i}`)));}
