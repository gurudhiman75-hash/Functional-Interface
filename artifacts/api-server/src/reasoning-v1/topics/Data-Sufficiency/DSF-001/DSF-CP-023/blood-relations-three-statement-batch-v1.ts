import { createHash } from "node:crypto";
import {
  clueToNormalizedText,
  graphFromClues,
  solveRelationFromGraph,
} from "../../../Blood-Relations/BLR-001/foundation/graph-closure.ts";
import type {
  BlrGender,
  BlrRelationId,
  DirectRelationClue,
  DirectRelationId,
  FamilyGraph,
} from "../../../Blood-Relations/BLR-001/foundation/types.ts";
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

export const DSF_CP023_BLOOD_QL002_RUNTIME_VERSION = "DSF_CP023_BLOOD_QL002_RUNTIME_V1" as const;
export const DSF_CP023_BLOOD_SOLVE_MODES = [
  "DSF-SM-BLR-P-TO-Q-RELATION",
  "DSF-SM-BLR-Q-TO-P-RELATION",
] as const;

type SolveMode=(typeof DSF_CP023_BLOOD_SOLVE_MODES)[number];
type ContextId="FAMILY_TREE"|"FAMILY_GATHERING"|"HOUSEHOLD_RECORD"|"RELATION_CHAIN"|"PEDIGREE_NOTE"|"KINSHIP_RECORD";
type DirectCategory="PARENT"|"CHILD"|"SIBLING"|"SPOUSE";
type World=Readonly<{
  firstOrientation:"P_TO_X"|"X_TO_P";
  secondOrientation:"X_TO_Q"|"Q_TO_X";
  firstRelation:DirectRelationId;
  secondRelation:DirectRelationId;
  firstClue:DirectRelationClue;
  secondClue:DirectRelationClue;
  firstKey:string;
  secondKey:string;
  graph:FamilyGraph;
  pToQ:BlrRelationId;
  qToP:BlrRelationId;
  pGender:BlrGender;
  xGender:BlrGender;
  qGender:BlrGender;
}>;
type Problem=Readonly<{solveMode:SolveMode;anchor:World;contextId:ContextId}>;
type Statement=Readonly<{id:string;family:string;complexity:1|2|3;text:string;test:(w:World)=>boolean}>;
type Candidate=Readonly<{i:Statement;ii:Statement;iii:Statement;evaluation:ThreeStatementSufficiencyEvaluation<string>;semanticKey:DsfCp015ThreeStatementSemanticKey;quality:number}>;

const DIRECT_RELATIONS:readonly DirectRelationId[]=["FATHER","MOTHER","SON","DAUGHTER","BROTHER","SISTER","HUSBAND","WIFE"];
const FIRST_ORIENTATIONS=["P_TO_X","X_TO_P"] as const;
const SECOND_ORIENTATIONS=["X_TO_Q","Q_TO_X"] as const;
const NAMES=Object.freeze({P:"P",X:"X",Q:"Q"});
const CONTEXTS:readonly ContextId[]=["FAMILY_TREE","FAMILY_GATHERING","HOUSEHOLD_RECORD","RELATION_CHAIN","PEDIGREE_NOTE","KINSHIP_RECORD"];

function hash(text:string){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function pick(seed:string,n:number){if(!n)throw new Error("CP023 empty candidate set");return hash(seed)%n;}
function category(r:DirectRelationId):DirectCategory{return r==="FATHER"||r==="MOTHER"?"PARENT":r==="SON"||r==="DAUGHTER"?"CHILD":r==="BROTHER"||r==="SISTER"?"SIBLING":"SPOUSE";}
function isBlood(r:DirectRelationId){return category(r)!=="SPOUSE";}
function gender(g:FamilyGraph,id:"P"|"X"|"Q"):BlrGender{return g.persons.find(p=>p.personId===id)?.gender??"UNKNOWN";}
function clue1(o:"P_TO_X"|"X_TO_P",r:DirectRelationId):DirectRelationClue{return o==="P_TO_X"?{subjectId:"P",relationId:r,referenceId:"X"}:{subjectId:"X",relationId:r,referenceId:"P"};}
function clue2(o:"X_TO_Q"|"Q_TO_X",r:DirectRelationId):DirectRelationClue{return o==="X_TO_Q"?{subjectId:"X",relationId:r,referenceId:"Q"}:{subjectId:"Q",relationId:r,referenceId:"X"};}
function key(c:DirectRelationClue){return `${c.subjectId}:${c.relationId}:${c.referenceId}`;}

function enumerateWorlds():readonly World[]{
  const out:World[]=[];const seen=new Set<string>();
  for(const firstOrientation of FIRST_ORIENTATIONS)for(const secondOrientation of SECOND_ORIENTATIONS)
  for(const firstRelation of DIRECT_RELATIONS)for(const secondRelation of DIRECT_RELATIONS){
    const firstClue=clue1(firstOrientation,firstRelation),secondClue=clue2(secondOrientation,secondRelation);
    try{
      const graph=graphFromClues([firstClue,secondClue],NAMES,["P","X","Q"]);
      const pToQ=solveRelationFromGraph(graph,"P","Q").relationId,qToP=solveRelationFromGraph(graph,"Q","P").relationId;
      const firstKey=key(firstClue),secondKey=key(secondClue),id=`${firstKey}|${secondKey}|${pToQ}|${qToP}`;
      if(seen.has(id))continue;seen.add(id);
      out.push(Object.freeze({firstOrientation,secondOrientation,firstRelation,secondRelation,firstClue,secondClue,firstKey,secondKey,graph,pToQ,qToP,pGender:gender(graph,"P"),xGender:gender(graph,"X"),qGender:gender(graph,"Q")}));
    }catch{}
  }
  if(out.length<24)throw new Error(`CP023 BLR universe too thin: ${out.length}`);
  return Object.freeze(out);
}
const WORLDS=enumerateWorlds();

function target(mode:SolveMode,w:World){return mode==="DSF-SM-BLR-P-TO-Q-RELATION"?w.pToQ:w.qToP;}
function reverse(mode:SolveMode,w:World){return mode==="DSF-SM-BLR-P-TO-Q-RELATION"?w.qToP:w.pToQ;}
const adapter={
  adapterId:"DSF-CP023-BLR-THREE-STATEMENT-V1",
  domainFamily:"REASONING" as const,
  sourceChapterId:"BLR-001",
  enumerateBaseWorlds:(_p:Problem)=>WORLDS,
  statementHolds:(_p:Problem,w:World,s:Statement)=>s.test(w),
  evaluateTarget:(p:Problem,w:World)=>target(p.solveMode,w),
  normalizeAnswer:(a:string)=>a,
};
function st(id:string,family:string,complexity:1|2|3,text:string,test:(w:World)=>boolean):Statement{return Object.freeze({id,family,complexity,text,test});}
function rel(r:string){return r.toLowerCase().replaceAll("_"," ");}
function targetLabel(mode:SolveMode){return mode==="DSF-SM-BLR-P-TO-Q-RELATION"?"P's exact relation to Q":"Q's exact relation to P";}
function prompt(mode:SolveMode){return mode==="DSF-SM-BLR-P-TO-Q-RELATION"?"How is P related to Q?":"How is Q related to P?";}
function lead(c:ContextId){return ({
  FAMILY_TREE:"P, X and Q are members of the same family.",
  FAMILY_GATHERING:"P, X and Q are members of the same family.",
  HOUSEHOLD_RECORD:"P, X and Q are members of the same family.",
  RELATION_CHAIN:"P, X and Q are members of the same family.",
  PEDIGREE_NOTE:"P, X and Q are members of the same family.",
  KINSHIP_RECORD:"P, X and Q are members of the same family.",
} as const)[c];}
function genderText(person:string,g:BlrGender){return g==="UNKNOWN"?`The gender of ${person} is not fixed.`:`${person} is ${g==="MALE"?"male":"female"}.`;}

function pool(problem:Problem):readonly Statement[]{
  const a=problem.anchor,t=target(problem.solveMode,a),rev=reverse(problem.solveMode,a),firstText=clueToNormalizedText(a.firstClue,NAMES),secondText=clueToNormalizedText(a.secondClue,NAMES);
  const subject=problem.solveMode==="DSF-SM-BLR-P-TO-Q-RELATION"?"P":"Q",reference=subject==="P"?"Q":"P";
  return Object.freeze([
    st(`TARGET_${t}`,"TARGET_EXACT",1,`${subject} is the ${rel(t)} of ${reference}.`,w=>target(problem.solveMode,w)===t),
    st(`REVERSE_${rev}`,"REVERSE_TARGET_EXACT",1,`${reference} is the ${rel(rev)} of ${subject}.`,w=>reverse(problem.solveMode,w)===rev),
    st(`FIRST_${a.firstKey}`,"FIRST_CLUE_EXACT",1,firstText,w=>w.firstKey===a.firstKey),
    st(`SECOND_${a.secondKey}`,"SECOND_CLUE_EXACT",1,secondText,w=>w.secondKey===a.secondKey),
    st(`CHAIN_${a.firstKey}_${a.secondKey}`,"CHAIN_EXACT",3,`${firstText} ${secondText}`,w=>w.firstKey===a.firstKey&&w.secondKey===a.secondKey),
    st(`PG_${a.pGender}`,"P_GENDER",2,genderText("P",a.pGender),w=>w.pGender===a.pGender),
    st(`XG_${a.xGender}`,"X_GENDER",2,genderText("X",a.xGender),w=>w.xGender===a.xGender),
    st(`QG_${a.qGender}`,"Q_GENDER",2,genderText("Q",a.qGender),w=>w.qGender===a.qGender),
    st(`FC_${category(a.firstRelation)}`,"FIRST_CATEGORY",2,`The P-X clue is a ${category(a.firstRelation).toLowerCase()}-type relation.`,w=>category(w.firstRelation)===category(a.firstRelation)),
    st(`SC_${category(a.secondRelation)}`,"SECOND_CATEGORY",2,`The X-Q clue is a ${category(a.secondRelation).toLowerCase()}-type relation.`,w=>category(w.secondRelation)===category(a.secondRelation)),
    st(`FO_${a.firstOrientation}`,"FIRST_ORIENTATION",2,`The P-X clue has ${a.firstClue.subjectId} as subject and ${a.firstClue.referenceId} as reference.`,w=>w.firstOrientation===a.firstOrientation),
    st(`SO_${a.secondOrientation}`,"SECOND_ORIENTATION",2,`The X-Q clue has ${a.secondClue.subjectId} as subject and ${a.secondClue.referenceId} as reference.`,w=>w.secondOrientation===a.secondOrientation),
    st(`FB_${isBlood(a.firstRelation)}`,"FIRST_IS_BLOOD",2,`The P-X link is ${isBlood(a.firstRelation)?"a blood relation":"a spouse relation"}.`,w=>isBlood(w.firstRelation)===isBlood(a.firstRelation)),
    st(`SB_${isBlood(a.secondRelation)}`,"SECOND_IS_BLOOD",2,`The X-Q link is ${isBlood(a.secondRelation)?"a blood relation":"a spouse relation"}.`,w=>isBlood(w.secondRelation)===isBlood(a.secondRelation)),
  ]);
}

const CACHE=new Map<string,readonly Candidate[]>();
function candidates(problem:Problem):readonly Candidate[]{
  const a=problem.anchor,cacheKey=`${problem.solveMode}|${a.firstKey}|${a.secondKey}`;
  const cached=CACHE.get(cacheKey);if(cached)return cached;
  const statements=pool(problem).filter(s=>s.test(a)),out:Candidate[]=[];
  for(let i=0;i<statements.length;i++)for(let j=i+1;j<statements.length;j++)for(let k=j+1;k<statements.length;k++){
    for(const [x,y,z] of [[statements[i]!,statements[j]!,statements[k]!],[statements[i]!,statements[k]!,statements[j]!],[statements[j]!,statements[i]!,statements[k]!]] as const){
      try{
        const evaluation=evaluateFiniteDomainTriple(adapter,problem,x,y,z);if(!isKnownThreeStatementSemanticKey(evaluation.semanticKey))continue;
        const familyBreadth=new Set([x.family,y.family,z.family]).size;
        const clueBonus=[x,y,z].filter(s=>s.family.includes("CLUE")||s.family==="CHAIN_EXACT").length*2;
        const quality=familyBreadth*8+clueBonus+evaluation.minimalSufficientSets.reduce((sum,s)=>sum+s.length,0)-x.complexity-y.complexity-z.complexity;
        out.push(Object.freeze({i:x,ii:y,iii:z,evaluation,semanticKey:evaluation.semanticKey,quality}));
      }catch{}
    }
  }
  const result=Object.freeze(out);if(!result.length)throw new Error(`CP023 no BLR triples for ${cacheKey}`);CACHE.set(cacheKey,result);return result;
}
function buildProblem(seed:string,attempt:number):Problem{
  const solveMode=DSF_CP023_BLOOD_SOLVE_MODES[pick(`${seed}:mode:${attempt}`,2)]!,anchor=WORLDS[pick(`${seed}:anchor:${attempt}`,WORLDS.length)]!,contextId=CONTEXTS[pick(`${seed}:context:${attempt}`,CONTEXTS.length)]!;
  return Object.freeze({solveMode,anchor,contextId});
}
function select(seed:string){
  let fallback:{problem:Problem;list:readonly Candidate[];breadth:number}|undefined;
  for(let attempt=0;attempt<40;attempt++){
    const problem=buildProblem(seed,attempt),list=candidates(problem),keys=[...new Set(list.map(x=>x.semanticKey))].sort();
    if(!fallback||keys.length>fallback.breadth)fallback={problem,list,breadth:keys.length};
    if(keys.length>=6){
      const semantic=keys[pick(`${seed}:semantic:${attempt}`,keys.length)]!,matching=list.filter(x=>x.semanticKey===semantic),top=Math.max(...matching.map(x=>x.quality)),short=matching.filter(x=>x.quality>=top-2);
      return {problem,candidate:short[pick(`${seed}:triple:${attempt}`,short.length)]!};
    }
  }
  if(!fallback)throw new Error("CP023 cannot synthesize BLR QL002 item");
  const top=Math.max(...fallback.list.map(x=>x.quality)),short=fallback.list.filter(x=>x.quality>=top-2);
  return {problem:fallback.problem,candidate:short[pick(`${seed}:fallback`,short.length)]!};
}
function explanation(problem:Problem,c:Candidate){
  return renderThreeStatementEditorialExplanation(c.evaluation, targetLabel(problem.solveMode), c.semanticKey);
}
export function generateDsfCp023BloodQuestion(seed:string|number){
  const s=String(seed),{problem,candidate:c}=select(s),options=buildThreeStatementAnswerOptions(c.semanticKey,hash(s)),correctIndex=options.findIndex(x=>x.isCorrect);
  const generationIdentity=createHash("sha256").update(`${DSF_CP023_BLOOD_QL002_RUNTIME_VERSION}|${s}|${problem.solveMode}|${problem.contextId}|${c.i.id}|${c.ii.id}|${c.iii.id}`).digest("hex").slice(0,24);
  return Object.freeze({
    packageId:"DSF-001" as const,checkpointId:"DSF-CP-023" as const,qlId:"DSF-QL-002" as const,runtimeVersion:DSF_CP023_BLOOD_QL002_RUNTIME_VERSION,
    language:"en" as const,locale:"en-IN" as const,domainFamily:"REASONING" as const,sourceChapterId:"BLR-001" as const,
    sourceCapabilities:["BLR-001/foundation/graph-closure::solveRelationFromGraph"] as const,solveModeId:problem.solveMode,contextId:problem.contextId,
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
export function generateDsfCp023BloodBatch(seed:string,count=20){const n=Math.min(40,Math.max(1,Math.floor(count)));return Object.freeze(Array.from({length:n},(_,i)=>generateDsfCp023BloodQuestion(`${seed}:${i}`)));}
