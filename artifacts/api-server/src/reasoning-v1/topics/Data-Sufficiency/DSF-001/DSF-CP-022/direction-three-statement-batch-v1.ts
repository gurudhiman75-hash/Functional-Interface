import { createHash } from "node:crypto";
import { VectorPathState } from "../../../../../lib/reasoning/spatial-reasoning.ts";
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
import { renderThreeStatementEditorialExplanation } from "../shared/three-statement-editorial-explanation.ts";

export const DSF_CP022_DIRECTION_QL002_RUNTIME_VERSION = "DSF_CP022_DIRECTION_QL002_RUNTIME_V1" as const;

export const DSF_CP022_DIRECTION_SOLVE_MODES = [
  "DSF-SM-DIR-FINAL-FACING",
  "DSF-SM-DIR-FINAL-COORDINATES",
  "DSF-SM-DIR-SHORTEST-DISTANCE",
] as const;

type SolveMode=(typeof DSF_CP022_DIRECTION_SOLVE_MODES)[number];
type Facing="North"|"East"|"South"|"West";
type Turn="left"|"right";
type ContextId="WALKING_ROUTE"|"DELIVERY_ROUTE"|"CAMPUS_PATH"|"PATROL_ROUTE"|"WAREHOUSE_ROUTE"|"FIELD_ROUTE";
type World=Readonly<{
  startFacing:Facing; firstDistance:number; firstTurn:Turn; secondDistance:number; secondTurn:Turn; thirdDistance:number;
  finalFacing:Facing; finalX:number; finalY:number; shortestDistance:number; totalPath:number;
}>;
type Problem=Readonly<{solveMode:SolveMode;anchor:World;contextId:ContextId}>;
type Statement=Readonly<{id:string;family:string;complexity:1|2|3;text:string;test:(world:World)=>boolean}>;
type Candidate=Readonly<{i:Statement;ii:Statement;iii:Statement;evaluation:ThreeStatementSufficiencyEvaluation<string>;semanticKey:DsfCp015ThreeStatementSemanticKey;quality:number}>;

const CONTEXTS:readonly ContextId[]=["WALKING_ROUTE","DELIVERY_ROUTE","CAMPUS_PATH","PATROL_ROUTE","WAREHOUSE_ROUTE","FIELD_ROUTE"];
const FACING_TO_DEGREES:Record<Facing,number>={East:0,North:90,West:180,South:270};
const DEGREES_TO_FACING:Record<number,Facing>={0:"East",90:"North",180:"West",270:"South"};
const TURN_DEGREES:Record<Turn,number>={left:90,right:-90};

function hash(text:string){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function pick(seed:string,n:number){if(!n)throw new Error("CP022 empty candidate set");return hash(seed)%n;}

function enumerateWorlds():readonly World[]{
  const out:World[]=[]; const facings=Object.keys(FACING_TO_DEGREES) as Facing[]; const turns:Turn[]=["left","right"]; const distances=[2,3,4] as const;
  for(const startFacing of facings)for(const firstDistance of distances)for(const firstTurn of turns)
  for(const secondDistance of distances)for(const secondTurn of turns)for(const thirdDistance of distances){
    const p=new VectorPathState({x:0,y:0},FACING_TO_DEGREES[startFacing]);
    p.move(firstDistance);p.turn(TURN_DEGREES[firstTurn]);p.move(secondDistance);p.turn(TURN_DEGREES[secondTurn]);p.move(thirdDistance);
    const angle=((p.thetaDegrees%360)+360)%360; const finalFacing=DEGREES_TO_FACING[angle]!;
    out.push(Object.freeze({startFacing,firstDistance,firstTurn,secondDistance,secondTurn,thirdDistance,finalFacing,finalX:p.position.x,finalY:p.position.y,shortestDistance:p.shortestDistance(),totalPath:firstDistance+secondDistance+thirdDistance}));
  }
  return Object.freeze(out);
}
const WORLDS=enumerateWorlds();

function target(mode:SolveMode,w:World):string{
  if(mode==="DSF-SM-DIR-FINAL-FACING")return w.finalFacing;
  if(mode==="DSF-SM-DIR-FINAL-COORDINATES")return `(${w.finalX},${w.finalY})`;
  return `${w.shortestDistance} m`;
}
const adapter={
  adapterId:"DSF-CP022-DIRECTION-THREE-STATEMENT-V1",
  domainFamily:"REASONING" as const,
  sourceChapterId:"REAS-DIR",
  enumerateBaseWorlds:(_p:Problem)=>WORLDS,
  statementHolds:(_p:Problem,w:World,s:Statement)=>s.test(w),
  evaluateTarget:(p:Problem,w:World)=>target(p.solveMode,w),
  normalizeAnswer:(a:string)=>a,
};
function st(id:string,family:string,complexity:1|2|3,text:string,test:(w:World)=>boolean):Statement{return Object.freeze({id,family,complexity,text,test});}
function sign(v:number){return v===0?"zero":v>0?"positive":"negative";}
function targetLabel(mode:SolveMode){return mode==="DSF-SM-DIR-FINAL-FACING"?"final facing direction":mode==="DSF-SM-DIR-FINAL-COORDINATES"?"final coordinates":"shortest distance from the starting point";}
function prompt(mode:SolveMode){return mode==="DSF-SM-DIR-FINAL-FACING"?"Which direction is the person facing after the third movement?":mode==="DSF-SM-DIR-FINAL-COORDINATES"?"Taking the starting point as (0, 0), what are the final coordinates?":"What is the shortest distance from the final point to the starting point?";}
function lead(c:ContextId){return ({
  WALKING_ROUTE:"A person moves in three successive stages.",
  DELIVERY_ROUTE:"A delivery worker moves in three successive stages.",
  CAMPUS_PATH:"A student moves in three successive stages across a campus.",
  PATROL_ROUTE:"A guard moves in three successive stages while on patrol.",
  WAREHOUSE_ROUTE:"A worker moves in three successive stages inside a warehouse.",
  FIELD_ROUTE:"A surveyor moves in three successive stages across a field.",
} as const)[c];}

function pool(problem:Problem):readonly Statement[]{
  const a=problem.anchor,t=target(problem.solveMode,a);
  const statements = [
    st(`TARGET_${t}`,"TARGET_EXACT",1,`The ${targetLabel(problem.solveMode)} is ${t}.`,w=>target(problem.solveMode,w)===t),
    st(`START_${a.startFacing}`,"START_FACING_EXACT",1,`The person starts facing ${a.startFacing}.`,w=>w.startFacing===a.startFacing),
    st(`TURN1_${a.firstTurn}`,"FIRST_TURN_EXACT",1,`After the first movement, the person turns ${a.firstTurn}.`,w=>w.firstTurn===a.firstTurn),
    st(`TURN2_${a.secondTurn}`,"SECOND_TURN_EXACT",1,`After the second movement, the person turns ${a.secondTurn}.`,w=>w.secondTurn===a.secondTurn),
    st(`TURNS_${a.firstTurn}_${a.secondTurn}`,"TURN_PAIR",2,`The two turns, in order, are ${a.firstTurn} and then ${a.secondTurn}.`,w=>w.firstTurn===a.firstTurn&&w.secondTurn===a.secondTurn),
    st(`D1_${a.firstDistance}`,"FIRST_DISTANCE_EXACT",1,`The first movement is ${a.firstDistance} m.`,w=>w.firstDistance===a.firstDistance),
    st(`D2_${a.secondDistance}`,"SECOND_DISTANCE_EXACT",1,`The second movement is ${a.secondDistance} m.`,w=>w.secondDistance===a.secondDistance),
    st(`D3_${a.thirdDistance}`,"THIRD_DISTANCE_EXACT",1,`The third movement is ${a.thirdDistance} m.`,w=>w.thirdDistance===a.thirdDistance),
    st(`D12_${a.firstDistance}_${a.secondDistance}`,"DISTANCE_PAIR",2,`The first two movement lengths are ${a.firstDistance} m and ${a.secondDistance} m respectively.`,w=>w.firstDistance===a.firstDistance&&w.secondDistance===a.secondDistance),
    st(`X_${a.finalX}`,"FINAL_X_EXACT",2,`The net east-west displacement is ${Math.abs(a.finalX)} m ${a.finalX===0?"with no east-west shift":a.finalX>0?"to the east":"to the west"}.`,w=>w.finalX===a.finalX),
    st(`Y_${a.finalY}`,"FINAL_Y_EXACT",2,`The net north-south displacement is ${Math.abs(a.finalY)} m ${a.finalY===0?"with no north-south shift":a.finalY>0?"to the north":"to the south"}.`,w=>w.finalY===a.finalY),
    st(`XY_${a.finalX}_${a.finalY}`,"FINAL_COMPONENT_PAIR",3,`The net displacement components are ${a.finalX} m east-west and ${a.finalY} m north-south.`,w=>w.finalX===a.finalX&&w.finalY===a.finalY),
    st(`FACING_${a.finalFacing}`,"FINAL_FACING_EXACT",1,`After all movements, the person is facing ${a.finalFacing}.`,w=>w.finalFacing===a.finalFacing),
    st(`PATH_${a.totalPath}`,"TOTAL_PATH_EXACT",2,`The total path length is ${a.totalPath} m.`,w=>w.totalPath===a.totalPath),
    st(`XSIGN_${sign(a.finalX)}`,"FINAL_X_SIGN",2,`The final east-west coordinate is ${sign(a.finalX)}.`,w=>sign(w.finalX)===sign(a.finalX)),
    st(`YSIGN_${sign(a.finalY)}`,"FINAL_Y_SIGN",2,`The final north-south coordinate is ${sign(a.finalY)}.`,w=>sign(w.finalY)===sign(a.finalY)),
  ];
  return Object.freeze(statements.filter((statement) => {
    if (problem.solveMode === "DSF-SM-DIR-FINAL-FACING" && statement.family === "FINAL_FACING_EXACT") return false;
    if (problem.solveMode === "DSF-SM-DIR-FINAL-COORDINATES" && statement.family === "FINAL_COMPONENT_PAIR") return false;
    return true;
  }));
}
const CACHE=new Map<string,readonly Candidate[]>();
function candidates(problem:Problem):readonly Candidate[]{
  const key=`${problem.solveMode}|${problem.anchor.startFacing}|${problem.anchor.firstDistance}|${problem.anchor.firstTurn}|${problem.anchor.secondDistance}|${problem.anchor.secondTurn}|${problem.anchor.thirdDistance}`;
  const cached=CACHE.get(key);if(cached)return cached;
  const statements=pool(problem).filter(s=>s.test(problem.anchor)); const out:Candidate[]=[];
  for(let i=0;i<statements.length;i++)for(let j=i+1;j<statements.length;j++)for(let k=j+1;k<statements.length;k++){
    for(const [a,b,c] of [[statements[i]!,statements[j]!,statements[k]!],[statements[i]!,statements[k]!,statements[j]!],[statements[j]!,statements[i]!,statements[k]!]] as const){
      try{
        const evaluation=evaluateFiniteDomainTriple(adapter,problem,a,b,c); if(!isKnownThreeStatementSemanticKey(evaluation.semanticKey))continue;
        const familyBreadth=new Set([a.family,b.family,c.family]).size;
        const quality=familyBreadth*8+evaluation.minimalSufficientSets.reduce((s,x)=>s+x.length,0)-a.complexity-b.complexity-c.complexity;
        out.push(Object.freeze({i:a,ii:b,iii:c,evaluation,semanticKey:evaluation.semanticKey,quality}));
      }catch{}
    }
  }
  const result=Object.freeze(out); if(!result.length)throw new Error(`CP022 no candidates for ${key}`);CACHE.set(key,result);return result;
}
function buildProblem(seed:string,attempt:number):Problem{
  const solveMode=DSF_CP022_DIRECTION_SOLVE_MODES[pick(`${seed}:mode:${attempt}`,DSF_CP022_DIRECTION_SOLVE_MODES.length)]!;
  const anchor=WORLDS[pick(`${seed}:anchor:${attempt}`,WORLDS.length)]!;
  const contextId=CONTEXTS[pick(`${seed}:context:${attempt}`,CONTEXTS.length)]!;
  return Object.freeze({solveMode,anchor,contextId});
}
function select(seed:string){
  let fallback:{problem:Problem;list:readonly Candidate[];breadth:number}|undefined;
  for(let attempt=0;attempt<30;attempt++){
    const problem=buildProblem(seed,attempt),list=candidates(problem),keys=[...new Set(list.map(x=>x.semanticKey))].sort();
    if(!fallback||keys.length>fallback.breadth)fallback={problem,list,breadth:keys.length};
    if(keys.length>=6){
      const semantic=keys[pick(`${seed}:semantic:${attempt}`,keys.length)]!,matching=list.filter(x=>x.semanticKey===semantic),top=Math.max(...matching.map(x=>x.quality)),short=matching.filter(x=>x.quality>=top-2);
      return {problem,candidate:short[pick(`${seed}:triple:${attempt}`,short.length)]!};
    }
  }
  if(!fallback)throw new Error("CP022 unable to synthesize Direction QL002 item");
  const top=Math.max(...fallback.list.map(x=>x.quality)),short=fallback.list.filter(x=>x.quality>=top-2);
  return {problem:fallback.problem,candidate:short[pick(`${seed}:fallback`,short.length)]!};
}
function explanation(problem:Problem,c:Candidate){
  return renderThreeStatementEditorialExplanation(c.evaluation, targetLabel(problem.solveMode), c.semanticKey);
}
export function generateDsfCp022DirectionQuestion(seed:string|number){
  const s=String(seed),{problem,candidate:c}=select(s),options=buildThreeStatementAnswerOptions(c.semanticKey,hash(s)),correctIndex=options.findIndex(x=>x.isCorrect);
  const generationIdentity=createHash("sha256").update(`${DSF_CP022_DIRECTION_QL002_RUNTIME_VERSION}|${s}|${problem.solveMode}|${problem.contextId}|${c.i.id}|${c.ii.id}|${c.iii.id}`).digest("hex").slice(0,24);
  return Object.freeze({
    packageId:"DSF-001" as const,checkpointId:"DSF-CP-022" as const,qlId:"DSF-QL-002" as const,runtimeVersion:DSF_CP022_DIRECTION_QL002_RUNTIME_VERSION,
    language:"en" as const,locale:"en-IN" as const,domainFamily:"REASONING" as const,sourceChapterId:"REAS-DIR" as const,
    sourceCapabilities:["lib/reasoning/spatial-reasoning::VectorPathState"] as const,solveModeId:problem.solveMode,contextId:problem.contextId,
    statementCount:3 as const,taskContract:"THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,answerSemantic:"MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,
    stem:`${lead(problem.contextId)} ${prompt(problem.solveMode)}`,questionPrompt:prompt(problem.solveMode),
    statements:Object.freeze([
      Object.freeze({id:"I" as const,statementRuleId:c.i.id,statementFamily:c.i.family,text:c.i.text}),
      Object.freeze({id:"II" as const,statementRuleId:c.ii.id,statementFamily:c.ii.family,text:c.ii.text}),
      Object.freeze({id:"III" as const,statementRuleId:c.iii.id,statementFamily:c.iii.family,text:c.iii.text}),
    ] as const),
    options,correctIndex,canonicalAnswer:c.semanticKey,semanticKey:c.semanticKey,explanation:explanation(problem,c),
    proof:Object.freeze({baseWorldCount:c.evaluation.base.worldCount,subsetEvaluations:c.evaluation.subsetEvaluations.map(e=>Object.freeze({statementIds:e.statementIds,worldCount:e.result.worldCount,sufficient:e.result.sufficient,normalizedTargetAnswers:e.result.normalizedTargetAnswers})),minimalSufficientSets:c.evaluation.minimalSufficientSets,allThreeWorldCount:c.evaluation.allThree.worldCount,allThreeSufficient:c.evaluation.allThree.sufficient,semanticKey:c.semanticKey}),
    generationIdentity,
    lifecycle:Object.freeze({questionStudioDiscoverable:false as const,questionBankWritable:false as const,testEligible:false as const,mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const}),
  });
}
export function generateDsfCp022DirectionBatch(seed:string,count=20){const n=Math.min(40,Math.max(1,Math.floor(count)));return Object.freeze(Array.from({length:n},(_,i)=>generateDsfCp022DirectionQuestion(`${seed}:${i}`)));}
