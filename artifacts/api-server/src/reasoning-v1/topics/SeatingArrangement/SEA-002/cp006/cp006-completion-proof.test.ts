import assert from "node:assert/strict";

import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { generateSea002Cp006DiscoveryCaselet } from "./discovery.ts";
import { solveCp006, auditOracleCp006 } from "./generator.ts";
import { cp006SourceClueTrue, generateSea002Cp006SourceRealCaselet } from "./source-realness.ts";
import { areDiagonal, mirroredState, oppositePerson, sameRowMove } from "./topology.ts";
import { SEA002_CP006_BLUEPRINT_IDS, type Sea002Cp006Clue, type Sea002Cp006State, type Sea002ParallelSide } from "./types.ts";

const RETAINED_QUERY_CONTRACTS=["SEA-QC-003","SEA-QC-006","SEA-QC-008","SEA-QC-010","SEA-QC-011","SEA-QC-012","SEA-QC-014","SEA-QC-015"] as const;
const queryContracts=new Set<string>();
const thirdFamilies=new Set<string>();
const structures=new Set<string>();
const structuresByBlueprint=new Map<string,Set<string>>();
const answerPositionByQuestion=Array.from({length:4},()=>[0,0,0,0]);
const caseletIds=new Set<string>();
const clueSets=new Set<string>();
let sourceCaselets=0;
let sourceChildren=0;
let supportiveChecks=0;
let essentialChecks=0;
let essentialClueCount=0;
let renameChecks=0;
let mirrorChecks=0;
let oppositeInvolutions=0;
let relativeInverseChecks=0;
let diagonalSymmetryChecks=0;

function swapSide(side:Sea002ParallelSide):Sea002ParallelSide { return side==="LEFT"?"RIGHT":"LEFT"; }
function renameClue(clue:Sea002Cp006Clue,map:ReadonlyMap<string,string>):Sea002Cp006Clue {
  const r=(person:string)=>map.get(person)??person;
  switch(clue.kind){
    case "ROW_MEMBERSHIP": return {...clue,person:r(clue.person)};
    case "OPPOSITE": case "NOT_OPPOSITE": case "SAME_ROW_GAP": case "SAME_ROW_MIN_BETWEEN": case "NOT_ADJACENT": case "DIAGONAL": return {...clue,first:r(clue.first),second:r(clue.second)};
    case "SAME_ROW_EQUAL_GAP": return {...clue,first:r(clue.first),second:r(clue.second),third:r(clue.third),fourth:r(clue.fourth)};
    case "SAME_ROW_RELATIVE": return {...clue,target:r(clue.target),reference:r(clue.reference)};
    case "FACING_REFERENT_RELATIVE": return {...clue,targetFacee:r(clue.targetFacee),referenceFacee:r(clue.referenceFacee)};
    case "END_POSITION": return {...clue,person:r(clue.person)};
    case "ROW_END_DISTANCE": return {...clue,person:r(clue.person)};
  }
}
function mirrorClue(clue:Sea002Cp006Clue):Sea002Cp006Clue {
  switch(clue.kind){
    case "SAME_ROW_RELATIVE": return {...clue,side:swapSide(clue.side)};
    case "FACING_REFERENT_RELATIVE": return {...clue,side:swapSide(clue.side)};
    case "END_POSITION": return {...clue,end:clue.end==="LEFT"?"RIGHT":"LEFT"};
    default:return clue;
  }
}
function renamedState(state:Sea002Cp006State,map:ReadonlyMap<string,string>):Sea002Cp006State {
  const r=(person:string)=>map.get(person)!;
  return {seatCountPerRow:state.seatCountPerRow,top:state.top.map(r),bottom:state.bottom.map(r)};
}
function isSameUniqueState(people:readonly string[],width:number,clues:readonly Sea002Cp006Clue[],expected:Sea002Cp006State):boolean {
  const solutions=solveCp006(people,width,clues);
  return solutions.length===1&&canonicalDigest(solutions[0])===canonicalDigest(expected);
}
function minimalUniqueClues(people:readonly string[],width:number,clues:readonly Sea002Cp006Clue[],expected:Sea002Cp006State):Sea002Cp006Clue[] {
  const retained=[...clues];
  for(let index=retained.length-1;index>=0;index-=1){
    const candidate=retained.filter((_,i)=>i!==index);
    if(isSameUniqueState(people,width,candidate,expected)) retained.splice(index,1);
  }
  return retained;
}

for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
  const blueprintStructures=new Set<string>();
  structuresByBlueprint.set(blueprint,blueprintStructures);
  for(let index=0;index<80;index+=1){
    const width=4+(index%3);
    const seed=`completion-${blueprint}-${index}`;
    const caselet=generateSea002Cp006SourceRealCaselet(blueprint,seed,width);
    sourceCaselets+=1;
    sourceChildren+=caselet.children.length;
    assert.equal(caselet.solutionCount,1);
    assert.equal(caselet.solverOracleAgreement.passed,true);
    assert.ok(caselet.clues.every((clue)=>cp006SourceClueTrue(caselet.state,clue)),`${caselet.caseletId}: direct clue truth`);
    assert.ok(!caseletIds.has(caselet.caseletId),`${caselet.caseletId}: duplicate caselet id`); caseletIds.add(caselet.caseletId);
    const clueSet=canonicalDigest(caselet.clues);
    assert.ok(!clueSets.has(clueSet),`${caselet.caseletId}: exact duplicate clue set`); clueSets.add(clueSet);
    structures.add(caselet.structuralFingerprint); blueprintStructures.add(caselet.structuralFingerprint);

    assert.equal(caselet.children.length,4);
    assert.equal(new Set(caselet.children.map((child)=>child.queryContractId)).size,4);
    assert.equal(new Set(caselet.children.map((child)=>child.answerDeterminingFactFingerprint)).size,4);
    thirdFamilies.add(caselet.children[2].answerDeterminingFactFingerprint.split(":")[0]!);
    for(let q=0;q<caselet.children.length;q+=1){
      const child=caselet.children[q]!;
      queryContracts.add(child.queryContractId);
      assert.ok((RETAINED_QUERY_CONTRACTS as readonly string[]).includes(child.queryContractId),`${caselet.caseletId}: out-of-bound query ${child.queryContractId}`);
      assert.equal(child.options.length,4);
      assert.equal(new Set(child.options.map((option)=>option.value)).size,4);
      assert.equal(child.options.filter((option)=>option.isCorrect).length,1);
      assert.equal(child.options[child.answerIndex]?.value,child.answer);
      assert.ok(child.explanation.length>35);
      assert.ok(child.options.every((option)=>option.explanation.length>20));
      answerPositionByQuestion[q]![child.answerIndex]+=1;
    }
    const learner=[caselet.setupText,...caselet.clueTexts,caselet.sharedExplanation,...caselet.children.flatMap((child)=>[child.text,child.explanation])].join("\n");
    assert.ok(!/SEA-PBA|SEA-QC|oracle|fingerprint|hidden state/i.test(learner),`${caselet.caseletId}: implementation language leaked`);
    assert.ok(caselet.clueTexts.every((text)=>text.trim().length>12));
    assert.equal(new Set(caselet.clueTexts).size,caselet.clueTexts.length,`${caselet.caseletId}: duplicate displayed clue`);

    for(const person of caselet.people){
      assert.equal(oppositePerson(caselet.state,oppositePerson(caselet.state,person)),person);
      oppositeInvolutions+=1;
      for(const side of ["LEFT","RIGHT"] as const) for(let steps=1;steps<width;steps+=1){
        const moved=sameRowMove(caselet.state,person,side,steps);
        if(!moved) continue;
        assert.equal(sameRowMove(caselet.state,moved,swapSide(side),steps),person);
        relativeInverseChecks+=1;
      }
    }
    for(let a=0;a<caselet.people.length;a+=1) for(let b=a+1;b<caselet.people.length;b+=1){
      const first=caselet.people[a]!,second=caselet.people[b]!;
      assert.equal(areDiagonal(caselet.state,first,second),areDiagonal(caselet.state,second,first));
      diagonalSymmetryChecks+=1;
    }

    if(index<4){
      const base=generateSea002Cp006DiscoveryCaselet(blueprint,seed,width);
      queryContracts.add(base.children[2].queryContractId);
      queryContracts.add(base.children[3].queryContractId);
      assert.equal(canonicalDigest(base.state),canonicalDigest(caselet.state),`${caselet.caseletId}: supportive source clues changed hidden state`);
      assert.equal(canonicalDigest(solveCp006(caselet.people,width,caselet.clues)[0]),canonicalDigest(base.state));
      supportiveChecks+=1;

      const mirrored=mirroredState(caselet.state),mirroredClues=caselet.clues.map(mirrorClue);
      const mirroredProduction=solveCp006(caselet.people,width,mirroredClues),mirroredOracle=auditOracleCp006(caselet.people,width,mirroredClues);
      assert.equal(mirroredProduction.length,1);
      assert.equal(mirroredOracle.length,1);
      assert.equal(canonicalDigest(mirroredProduction[0]),canonicalDigest(mirrored));
      assert.equal(canonicalDigest(mirroredOracle[0]),canonicalDigest(mirrored));
      for(const clue of caselet.clues.filter((candidate)=>candidate.kind==="SAME_ROW_EQUAL_GAP")) assert.equal(cp006SourceClueTrue(mirrored,clue),true);
      mirrorChecks+=1;

      const renameMap=new Map(caselet.people.map((person,i)=>[person,`R${i+1}`] as const));
      const renamedPeople=caselet.people.map((person)=>renameMap.get(person)!);
      const renamedClues=caselet.clues.map((clue)=>renameClue(clue,renameMap));
      const expectedRenamed=renamedState(caselet.state,renameMap);
      const renamedProduction=solveCp006(renamedPeople,width,renamedClues),renamedOracle=auditOracleCp006(renamedPeople,width,renamedClues);
      assert.equal(renamedProduction.length,1);
      assert.equal(renamedOracle.length,1);
      assert.equal(canonicalDigest(renamedProduction[0]),canonicalDigest(expectedRenamed));
      assert.equal(canonicalDigest(renamedOracle[0]),canonicalDigest(expectedRenamed));
      renameChecks+=1;

      const minimal=minimalUniqueClues(base.people,width,base.clues,base.state);
      assert.ok(minimal.length>0,`${base.caseletId}: minimal unique clue set unexpectedly empty`);
      for(let removeIndex=0;removeIndex<minimal.length;removeIndex+=1){
        const reduced=minimal.filter((_,i)=>i!==removeIndex);
        assert.equal(isSameUniqueState(base.people,width,reduced,base.state),false,`${base.caseletId}: clue classified essential did not change solution policy`);
        essentialClueCount+=1;
      }
      essentialChecks+=1;
    }
  }
}

assert.deepEqual([...queryContracts].sort(),[...RETAINED_QUERY_CONTRACTS].sort(),"retained CP006 query inventory mismatch");
assert.deepEqual([...thirdFamilies].sort(),["FACING_PAIR","NEIGHBOURS","ROW_END_PAIR"]);
for(const blueprint of SEA002_CP006_BLUEPRINT_IDS) assert.ok((structuresByBlueprint.get(blueprint)?.size??0)>=12,`${blueprint}: structural pool too thin`);
assert.ok(structures.size>=60,`CP006 saturation structurally too thin: ${structures.size}`);
for(let q=0;q<4;q+=1) for(let answer=0;answer<4;answer+=1) assert.ok(answerPositionByQuestion[q]![answer]>=12,`Q${q+1} answer position ${answer} underrepresented`);
assert.equal(sourceCaselets,320);
assert.equal(sourceChildren,1280);
assert.equal(supportiveChecks,16);
assert.equal(essentialChecks,16);
assert.ok(essentialClueCount>=16);
assert.equal(renameChecks,16);
assert.equal(mirrorChecks,16);
assert.ok(oppositeInvolutions>2500);
assert.ok(relativeInverseChecks>5000);
assert.ok(diagonalSymmetryChecks>10000);

console.log("PASS_SEA002_CP006_COMPLETION");
console.log("source saturation caselets",sourceCaselets);
console.log("child questions",sourceChildren);
console.log("retained query contracts",[...queryContracts].sort().join(","));
console.log("source question families",[...thirdFamilies].sort().join(","));
console.log("structural signatures",structures.size);
console.log("structures by blueprint",Object.fromEntries([...structuresByBlueprint].map(([id,set])=>[id,set.size])));
console.log("answer positions by child",answerPositionByQuestion);
console.log("supportive/minimal-essential/essential-clues/rename/mirror",supportiveChecks,essentialChecks,essentialClueCount,renameChecks,mirrorChecks);
console.log("opposite/relative/diagonal invariants",oppositeInvolutions,relativeInverseChecks,diagonalSymmetryChecks);
console.log("boundary","CP007 owns non-uniform/same-direction parallel facing; advanced hypothetical contracts remain outside CP006");
