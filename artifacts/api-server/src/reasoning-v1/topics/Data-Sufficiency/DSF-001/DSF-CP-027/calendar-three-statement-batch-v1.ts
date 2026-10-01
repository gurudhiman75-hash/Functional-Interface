import { createHash } from "node:crypto";
import { WEEKDAY_ORDER, mod7, weekdayShift } from "../../../Calendar/CAL-001/foundation.ts";
import type { Weekday } from "../../../Calendar/CAL-001/types.ts";
import { evaluateFiniteDomainTriple, type ThreeStatementSufficiencyEvaluation } from "../DSF-CP-015/three-statement-foundation.ts";
import {
  buildThreeStatementAnswerOptions,
  isKnownThreeStatementSemanticKey,
  renderThreeStatementSemanticLabel,
  type DsfCp015ThreeStatementSemanticKey,
} from "../DSF-CP-015/three-statement-answer-profile.ts";
import { renderThreeStatementEditorialExplanation } from "../shared/three-statement-editorial-explanation.ts";

export const DSF_CP027_CALENDAR_QL002_RUNTIME_VERSION="DSF_CP027_CALENDAR_QL002_RUNTIME_V1" as const;
export const DSF_CP027_CALENDAR_SOLVE_MODES=[
  "DSF-SM-CAL-RESULT-WEEKDAY",
  "DSF-SM-CAL-START-WEEKDAY",
  "DSF-SM-CAL-SHIFT-REMAINDER",
] as const;
type SolveMode=(typeof DSF_CP027_CALENDAR_SOLVE_MODES)[number];
type ContextId="CALENDAR_NOTE"|"DELIVERY_SCHEDULE"|"TRAINING_PLAN"|"SHIFT_ROSTER"|"EVENT_PLANNER"|"JOURNAL_ENTRY";
type World=Readonly<{start:Weekday;shiftRemainder:Weekday;end:Weekday}>;
type Problem=Readonly<{solveMode:SolveMode;anchor:World;contextId:ContextId}>;
type Statement=Readonly<{id:string;family:string;complexity:1|2;text:string;test:(w:World)=>boolean}>;
type Candidate=Readonly<{i:Statement;ii:Statement;iii:Statement;evaluation:ThreeStatementSufficiencyEvaluation<string>;semanticKey:DsfCp015ThreeStatementSemanticKey;quality:number}>;

const NAMES:Readonly<Record<Weekday,string>>={0:"Sunday",1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"};
const CONTEXTS:readonly ContextId[]=["CALENDAR_NOTE","DELIVERY_SCHEDULE","TRAINING_PLAN","SHIFT_ROSTER","EVENT_PLANNER","JOURNAL_ENTRY"];
function hash(t:string){let h=2166136261;for(const ch of t){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function pick(seed:string,n:number){if(!n)throw new Error("CP027 empty set");return hash(seed)%n;}
function name(d:Weekday){return NAMES[d];}
const WORLDS:readonly World[]=Object.freeze(WEEKDAY_ORDER.flatMap(start=>WEEKDAY_ORDER.map(shiftRemainder=>Object.freeze({start,shiftRemainder,end:weekdayShift(start,shiftRemainder)}))));
if(WORLDS.length!==49)throw new Error("CP027 calendar universe must have 49 states");
for(const w of WORLDS){if(weekdayShift(w.end,-w.shiftRemainder)!==w.start||mod7(w.end-w.start)!==w.shiftRemainder)throw new Error("CP027 CAL-001 parity failed");}
function target(mode:SolveMode,w:World){return mode==="DSF-SM-CAL-RESULT-WEEKDAY"?name(weekdayShift(w.start,w.shiftRemainder)):mode==="DSF-SM-CAL-START-WEEKDAY"?name(weekdayShift(w.end,-w.shiftRemainder)):String(mod7(w.end-w.start));}
const adapter={adapterId:"DSF-CP027-CAL-THREE-STATEMENT-V1",domainFamily:"REASONING" as const,sourceChapterId:"CAL-001",enumerateBaseWorlds:(_p:Problem)=>WORLDS,statementHolds:(_p:Problem,w:World,s:Statement)=>s.test(w),evaluateTarget:(p:Problem,w:World)=>target(p.solveMode,w),normalizeAnswer:(a:string)=>a};
function st(id:string,family:string,complexity:1|2,text:string,test:(w:World)=>boolean):Statement{return Object.freeze({id,family,complexity,text,test});}
function prompt(mode:SolveMode){return mode==="DSF-SM-CAL-RESULT-WEEKDAY"?"What is the resulting weekday?":mode==="DSF-SM-CAL-START-WEEKDAY"?"What was the starting weekday?":"What remainder does the number of moved days leave when divided by 7?";}
function label(mode:SolveMode){return mode==="DSF-SM-CAL-RESULT-WEEKDAY"?"the resulting weekday":mode==="DSF-SM-CAL-START-WEEKDAY"?"the starting weekday":"the remainder of the day count modulo 7";}
function lead(c:ContextId){return ({CALENDAR_NOTE:"A calendar note describes a forward movement from one weekday to another.",DELIVERY_SCHEDULE:"A delivery schedule advances from one weekday by a whole number of days.",TRAINING_PLAN:"A training plan advances from one weekday by a whole number of days.",SHIFT_ROSTER:"A shift roster advances from one weekday by a whole number of days.",EVENT_PLANNER:"An event planner advances from one weekday by a whole number of days.",JOURNAL_ENTRY:"A journal entry advances from one weekday by a whole number of days."} as const)[c];}

function pool(p:Problem):readonly Statement[]{
 const {start,shiftRemainder,end}=p.anchor,nextStart=mod7(start+1),nextShift=mod7(shiftRemainder+1),nextEnd=mod7(end+1);
 return Object.freeze([
  st(`START_${start}`,"START_EXACT",1,`The starting day is ${name(start)}.`,w=>w.start===start),
  st(`SHIFT_${shiftRemainder}`,"SHIFT_EXACT",1,`The day count leaves remainder ${shiftRemainder} when divided by 7.`,w=>w.shiftRemainder===shiftRemainder),
  st(`END_${end}`,"END_EXACT",1,`The resulting day is ${name(end)}.`,w=>w.end===end),
  st(`START_SHIFT_${start}_${shiftRemainder}`,"START_SHIFT_PAIR",2,`The starting day is ${name(start)}, and the day count leaves remainder ${shiftRemainder} on division by 7.`,w=>w.start===start&&w.shiftRemainder===shiftRemainder),
  st(`END_SHIFT_${end}_${shiftRemainder}`,"END_SHIFT_PAIR",2,`The resulting day is ${name(end)}, and the day count leaves remainder ${shiftRemainder} on division by 7.`,w=>w.end===end&&w.shiftRemainder===shiftRemainder),
  st(`START_END_${start}_${end}`,"START_END_PAIR",2,`The movement starts on ${name(start)} and ends on ${name(end)}.`,w=>w.start===start&&w.end===end),
  st(`START_TWO_${start}_${nextStart}`,"START_TWO_SET",2,`The starting day is either ${name(start)} or ${name(nextStart)}.`,w=>w.start===start||w.start===nextStart),
  st(`SHIFT_TWO_${shiftRemainder}_${nextShift}`,"SHIFT_TWO_SET",2,`The remainder is either ${shiftRemainder} or ${nextShift}.`,w=>w.shiftRemainder===shiftRemainder||w.shiftRemainder===nextShift),
  st(`END_TWO_${end}_${nextEnd}`,"END_TWO_SET",2,`The resulting day is either ${name(end)} or ${name(nextEnd)}.`,w=>w.end===end||w.end===nextEnd),
 ]);
}
const CACHE=new Map<string,readonly Candidate[]>();
function candidates(p:Problem):readonly Candidate[]{
 const key=`${p.solveMode}|${p.anchor.start}|${p.anchor.shiftRemainder}`,cached=CACHE.get(key);if(cached)return cached;
 const s=pool(p),out:Candidate[]=[];
 for(let i=0;i<s.length;i++)for(let j=i+1;j<s.length;j++)for(let k=j+1;k<s.length;k++){
  for(const [a,b,c] of [[s[i]!,s[j]!,s[k]!],[s[i]!,s[k]!,s[j]!],[s[j]!,s[i]!,s[k]!]] as const){
   try{const e=evaluateFiniteDomainTriple(adapter,p,a,b,c);if(!isKnownThreeStatementSemanticKey(e.semanticKey))continue;const quality=new Set([a.family,b.family,c.family]).size*8+e.minimalSufficientSets.reduce((sum,x)=>sum+x.length,0)-(a.complexity+b.complexity+c.complexity);out.push(Object.freeze({i:a,ii:b,iii:c,evaluation:e,semanticKey:e.semanticKey,quality}));}catch{}
  }
 }
 const r=Object.freeze(out);if(!r.length)throw new Error(`CP027 no triples ${key}`);CACHE.set(key,r);return r;
}
function problem(seed:string,attempt:number):Problem{const solveMode=DSF_CP027_CALENDAR_SOLVE_MODES[pick(`${seed}:mode:${attempt}`,3)]!,anchor=WORLDS[pick(`${seed}:anchor:${attempt}`,WORLDS.length)]!,contextId=CONTEXTS[pick(`${seed}:context:${attempt}`,CONTEXTS.length)]!;return Object.freeze({solveMode,anchor,contextId});}
function select(seed:string){let fb:{p:Problem;l:readonly Candidate[];b:number}|undefined;for(let a=0;a<30;a++){const p=problem(seed,a),l=candidates(p),keys=[...new Set(l.map(x=>x.semanticKey))].sort();if(!fb||keys.length>fb.b)fb={p,l,b:keys.length};if(keys.length>=6){const sem=keys[pick(`${seed}:sem:${a}`,keys.length)]!,m=l.filter(x=>x.semanticKey===sem),top=Math.max(...m.map(x=>x.quality)),short=m.filter(x=>x.quality>=top-2);return {p,c:short[pick(`${seed}:triple:${a}`,short.length)]!};}}if(!fb)throw new Error("CP027 synthesis failed");const top=Math.max(...fb.l.map(x=>x.quality)),short=fb.l.filter(x=>x.quality>=top-2);return {p:fb.p,c:short[pick(`${seed}:fallback`,short.length)]!};}
function explanation(p:Problem,c:Candidate){
  return renderThreeStatementEditorialExplanation(c.evaluation, label(p.solveMode), c.semanticKey);
}
export function generateDsfCp027CalendarQuestion(seed:string|number){const s=String(seed),{p,c}=select(s),options=buildThreeStatementAnswerOptions(c.semanticKey,hash(s)),correctIndex=options.findIndex(x=>x.isCorrect),generationIdentity=createHash("sha256").update(`${DSF_CP027_CALENDAR_QL002_RUNTIME_VERSION}|${s}|${p.solveMode}|${p.contextId}|${p.anchor.start}|${p.anchor.shiftRemainder}|${c.i.id}|${c.ii.id}|${c.iii.id}`).digest("hex").slice(0,24);return Object.freeze({packageId:"DSF-001" as const,checkpointId:"DSF-CP-027" as const,qlId:"DSF-QL-002" as const,runtimeVersion:DSF_CP027_CALENDAR_QL002_RUNTIME_VERSION,language:"en" as const,locale:"en-IN" as const,domainFamily:"REASONING" as const,sourceChapterId:"CAL-001" as const,sourceWorldCount:WORLDS.length,sourceCapabilities:["CAL-001/foundation::weekdayShift","CAL-001/foundation::mod7"] as const,solveModeId:p.solveMode,contextId:p.contextId,statementCount:3 as const,taskContract:"THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,answerSemantic:"MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,stem:`${lead(p.contextId)} ${prompt(p.solveMode)}`,questionPrompt:prompt(p.solveMode),statements:Object.freeze([Object.freeze({id:"I" as const,statementRuleId:c.i.id,statementFamily:c.i.family,text:c.i.text}),Object.freeze({id:"II" as const,statementRuleId:c.ii.id,statementFamily:c.ii.family,text:c.ii.text}),Object.freeze({id:"III" as const,statementRuleId:c.iii.id,statementFamily:c.iii.family,text:c.iii.text})] as const),options,correctIndex,canonicalAnswer:c.semanticKey,semanticKey:c.semanticKey,explanation:explanation(p,c),proof:Object.freeze({baseWorldCount:c.evaluation.base.worldCount,subsetEvaluations:c.evaluation.subsetEvaluations.map(e=>Object.freeze({statementIds:e.statementIds,worldCount:e.result.worldCount,sufficient:e.result.sufficient,normalizedTargetAnswers:e.result.normalizedTargetAnswers})),minimalSufficientSets:c.evaluation.minimalSufficientSets,allThreeWorldCount:c.evaluation.allThree.worldCount,allThreeSufficient:c.evaluation.allThree.sufficient,semanticKey:c.semanticKey}),generationIdentity,lifecycle:Object.freeze({questionStudioDiscoverable:false as const,questionBankWritable:false as const,testEligible:false as const,mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const})});}
export function generateDsfCp027CalendarBatch(seed:string,count=20){const n=Math.min(40,Math.max(1,Math.floor(count)));return Object.freeze(Array.from({length:n},(_,i)=>generateDsfCp027CalendarQuestion(`${seed}:${i}`)));}
