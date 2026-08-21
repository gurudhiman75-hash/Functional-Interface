import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { generateSea002Cp006DiscoveryCaselet } from "./discovery.ts";
import { renderCp006Clue, solveCp006, auditOracleCp006 } from "./generator.ts";
import { generateSea002Cp006SourceRealCaselet, renderCp006SourceClue } from "./source-realness.ts";
import { compileCp006TeachingExplanation } from "./teaching-explanation.ts";
import { compactCp006CaseTeaching } from "./presentation-polish.ts";
import type { Sea002Cp006BlueprintId, Sea002Cp006Caselet, Sea002Cp006ChildQuestion, Sea002Cp006Clue, Sea002Cp006State } from "./types.ts";

const SOURCE_KINDS=new Set<Sea002Cp006Clue["kind"]>(["SAME_ROW_GAP","SAME_ROW_MIN_BETWEEN","SAME_ROW_EQUAL_GAP","NOT_ADJACENT","ROW_END_DISTANCE","FACING_REFERENT_RELATIVE"]);
const POSITIONAL_KINDS=new Set<Sea002Cp006Clue["kind"]>(["SAME_ROW_RELATIVE","SAME_ROW_GAP","SAME_ROW_MIN_BETWEEN","SAME_ROW_EQUAL_GAP","NOT_ADJACENT","FACING_REFERENT_RELATIVE"]);

export function isCp006SourceNaturalClue(clue:Sea002Cp006Clue):boolean { return SOURCE_KINDS.has(clue.kind); }

function count(clues:readonly Sea002Cp006Clue[],kind:Sea002Cp006Clue["kind"]):number { return clues.filter((clue)=>clue.kind===kind).length; }
function positionalCount(clues:readonly Sea002Cp006Clue[]):number { return clues.filter((clue)=>POSITIONAL_KINDS.has(clue.kind)).length; }
function endpointCount(clues:readonly Sea002Cp006Clue[]):number { return clues.filter((clue)=>clue.kind==="END_POSITION"||clue.kind==="ROW_END_DISTANCE").length; }
function preservesBlueprintContract(blueprint:Sea002Cp006BlueprintId,clues:readonly Sea002Cp006Clue[],peopleCount:number):boolean {
  if(blueprint==="SEA-PBA-021") return count(clues,"ROW_MEMBERSHIP")===peopleCount&&count(clues,"OPPOSITE")>=1&&positionalCount(clues)>=1;
  if(blueprint==="SEA-PBA-022") return count(clues,"ROW_MEMBERSHIP")>=2&&count(clues,"OPPOSITE")>=1&&count(clues,"DIAGONAL")>=1&&positionalCount(clues)>=1;
  if(blueprint==="SEA-PBA-023") return count(clues,"ROW_MEMBERSHIP")>=1&&count(clues,"OPPOSITE")>=1&&positionalCount(clues)>=3;
  return count(clues,"OPPOSITE")>=1&&count(clues,"NOT_OPPOSITE")>=1&&count(clues,"DIAGONAL")>=1&&endpointCount(clues)>=1;
}
function uniqueSameState(people:readonly string[],width:number,clues:readonly Sea002Cp006Clue[],state:Sea002Cp006State):boolean {
  const solutions=solveCp006(people,width,clues);
  return solutions.length===1&&canonicalDigest(solutions[0])===canonicalDigest(state);
}
function clueText(clue:Sea002Cp006Clue):string { return isCp006SourceNaturalClue(clue)?renderCp006SourceClue(clue):renderCp006Clue(clue); }
function displayedClues(base:Sea002Cp006Caselet,clues:readonly Sea002Cp006Clue[]):string[] {
  if(base.blueprintAuthorityId!=="SEA-PBA-021") return clues.map(clueText);
  return [
    `${base.state.top.join(", ")} sit in the upper row, while ${base.state.bottom.join(", ")} sit in the lower row.`,
    ...clues.filter((clue)=>clue.kind!=="ROW_MEMBERSHIP").map(clueText),
  ];
}
function plainLanguage(text:string):string {
  return text
    .replaceAll("the observer's","our")
    .replaceAll("observer's","our")
    .replaceAll("observer column","vertical column")
    .replaceAll("observer-left","left side of the page")
    .replaceAll("observer-right","right side of the page")
    .replaceAll("towards the our","towards our")
    .replaceAll("seat intervals","seats")
    .replaceAll("strictly between","between");
}
function plainChild(child:Sea002Cp006ChildQuestion):Sea002Cp006ChildQuestion {
  return {
    ...child,
    explanation:plainLanguage(child.explanation),
    options:child.options.map((option)=>({...option,explanation:plainLanguage(option.explanation)})) as Sea002Cp006ChildQuestion["options"],
  };
}

function sourceEssentialClueSet(base:Sea002Cp006Caselet,sourcePool:readonly Sea002Cp006Clue[],seed:string):readonly Sea002Cp006Clue[] {
  const rng=new DeterministicRandom(`${seed}:exam-real-essentialization`);
  const start=rng.integer(0,sourcePool.length-1);
  const ordered=[...sourcePool.slice(start),...sourcePool.slice(0,start)];
  for(const target of ordered){
    for(let attempt=0;attempt<6;attempt+=1){
      let working:Sea002Cp006Clue[]=[...base.clues,target];
      const removalOrder=new DeterministicRandom(`${seed}:${canonicalDigest(target)}:${attempt}`).shuffle([...base.clues]);
      for(const removable of removalOrder){
        const index=working.indexOf(removable);
        if(index<0) continue;
        const candidate=working.filter((_,i)=>i!==index);
        if(!preservesBlueprintContract(base.blueprintAuthorityId,candidate,base.people.length)) continue;
        if(uniqueSameState(base.people,base.state.seatCountPerRow,candidate,base.state)) working=candidate;
      }
      if(!preservesBlueprintContract(base.blueprintAuthorityId,working,base.people.length)||!uniqueSameState(base.people,base.state.seatCountPerRow,working,base.state)) continue;
      const withoutTarget=working.filter((clue)=>clue!==target);
      if(!uniqueSameState(base.people,base.state.seatCountPerRow,withoutTarget,base.state)) return working;
    }
  }
  throw new Error(`${base.caseletId}: could not construct a source-essential exam-real clue set.`);
}

export function generateSea002Cp006ExamRealCaselet(blueprint:Sea002Cp006BlueprintId,seed:string,seatCountPerRow:number):Sea002Cp006Caselet {
  const base=generateSea002Cp006DiscoveryCaselet(blueprint,seed,seatCountPerRow);
  const auditBundle=generateSea002Cp006SourceRealCaselet(blueprint,seed,seatCountPerRow);
  const sourcePool=auditBundle.clues.slice(base.clues.length).filter(isCp006SourceNaturalClue);
  const clues=sourceEssentialClueSet(base,sourcePool,seed);
  const sourceClues=clues.filter(isCp006SourceNaturalClue);
  if(sourceClues.length<1) throw new Error(`${base.caseletId}: exam-real caselet lost source-natural clue coverage.`);
  const production=solveCp006(base.people,seatCountPerRow,clues),oracle=auditOracleCp006(base.people,seatCountPerRow,clues);
  if(production.length!==1||oracle.length!==1||canonicalDigest(production[0])!==canonicalDigest(base.state)||canonicalDigest(oracle[0])!==canonicalDigest(base.state)) throw new Error(`${base.caseletId}: exam-real clue set lost solver/oracle authority.`);
  const essentialSourceCount=sourceClues.filter((sourceClue)=>!uniqueSameState(base.people,seatCountPerRow,clues.filter((clue)=>clue!==sourceClue),base.state)).length;
  if(essentialSourceCount<1) throw new Error(`${base.caseletId}: source-natural clue is not solution-essential.`);
  const clueTexts=displayedClues(base,clues);
  const solutionClueTexts=clues.map(clueText);
  const children=auditBundle.children.map(plainChild) as Sea002Cp006Caselet["children"];
  const sharedExplanation=compactCp006CaseTeaching(compileCp006TeachingExplanation(base.state,base.people,clues,solutionClueTexts));
  return {
    ...base,
    clues,
    clueTexts,
    sharedExplanation,
    children,
    structuralFingerprint:canonicalDigest({
      blueprint,
      seatCountPerRow,
      clueShape:clues.map((clue)=>clue.kind==="SAME_ROW_RELATIVE"||clue.kind==="FACING_REFERENT_RELATIVE"?`${clue.kind}:${clue.side}:${clue.steps}`:clue.kind==="SAME_ROW_GAP"?`${clue.kind}:${clue.between}`:clue.kind==="SAME_ROW_MIN_BETWEEN"?`${clue.kind}:${clue.minBetween}`:clue.kind==="ROW_END_DISTANCE"?`${clue.kind}:${clue.mode}:${clue.positionFromEnd}`:clue.kind),
      queryContracts:children.map((child)=>child.queryContractId),
      sourceEssentialCount:essentialSourceCount,
    }),
  };
}
