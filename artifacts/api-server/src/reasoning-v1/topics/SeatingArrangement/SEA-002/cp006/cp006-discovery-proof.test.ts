import assert from "node:assert/strict";

import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { auditOracleCp006, cp006ClueTrue, solveCp006 } from "./generator.ts";
import { generateSea002Cp006DiscoveryCaselet } from "./discovery.ts";
import { areDiagonal, areOpposite, mirroredState, oppositePerson, sameRowMove, seatOf } from "./topology.ts";
import { SEA002_CP006_BLUEPRINT_IDS, type Sea002Cp006BlueprintId, type Sea002Cp006State } from "./types.ts";

const fixture:Sea002Cp006State={seatCountPerRow:3,top:["A","B","C"],bottom:["D","E","F"]};
assert.equal(oppositePerson(fixture,"A"),"D");
assert.equal(oppositePerson(fixture,"B"),"E");
assert.equal(areOpposite(fixture,"C","F"),true);
assert.equal(areDiagonal(fixture,"A","E"),true);
assert.equal(areDiagonal(fixture,"A","D"),false);
assert.equal(sameRowMove(fixture,"A","LEFT",1),"B","south-facing top-row left must move toward observer-right");
assert.equal(sameRowMove(fixture,"C","RIGHT",1),"B","south-facing top-row right must move toward observer-left");
assert.equal(sameRowMove(fixture,"D","RIGHT",1),"E","north-facing bottom-row right must move toward observer-right");
assert.equal(sameRowMove(fixture,"F","LEFT",1),"E","north-facing bottom-row left must move toward observer-left");
assert.deepEqual(mirroredState(mirroredState(fixture)),fixture,"parallel-row mirror must be an involution");

const REQUIRED:Readonly<Record<Sea002Cp006BlueprintId,readonly string[]>>={
  "SEA-PBA-021":["ROW_MEMBERSHIP","OPPOSITE","SAME_ROW_RELATIVE"],
  "SEA-PBA-022":["ROW_MEMBERSHIP","OPPOSITE","SAME_ROW_RELATIVE","DIAGONAL"],
  "SEA-PBA-023":["ROW_MEMBERSHIP","OPPOSITE","SAME_ROW_RELATIVE"],
  "SEA-PBA-024":["OPPOSITE","NOT_OPPOSITE","DIAGONAL","END_POSITION"],
};

const allCaseletIds=new Set<string>();
const answerPositions=[0,0,0,0];
const structures=new Map<Sea002Cp006BlueprintId,Set<string>>();
const caseTeachingByBlueprint=new Map<Sea002Cp006BlueprintId,number>();
let caseletCount=0;
let childCount=0;

for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
  const blueprintStructures=new Set<string>(); structures.set(blueprint,blueprintStructures);
  caseTeachingByBlueprint.set(blueprint,0);
  for(let index=0;index<12;index+=1){
    const caselet=generateSea002Cp006DiscoveryCaselet(blueprint,`discovery-proof-${index}`);
    caseletCount+=1; childCount+=caselet.children.length;
    assert.equal(caselet.packageId,"SEA-002");
    assert.equal(caselet.checkpointId,"SEA-CP-006");
    assert.equal(caselet.blueprintAuthorityId,blueprint);
    assert.equal(caselet.solutionCount,1);
    assert.equal(caselet.solverOracleAgreement.passed,true);
    assert.equal(caselet.state.seatCountPerRow,3);
    assert.equal(caselet.people.length,6);
    assert.equal(new Set(caselet.people).size,6);
    assert.equal(caselet.state.top.length,3);
    assert.equal(caselet.state.bottom.length,3);
    assert.equal(new Set([...caselet.state.top,...caselet.state.bottom]).size,6);
    assert.ok(caselet.clues.every((clue)=>cp006ClueTrue(caselet.state,clue)),`${caselet.caseletId}: hidden-state clue verifier`);

    const production=solveCp006(caselet.people,3,caselet.clues);
    const oracle=auditOracleCp006(caselet.people,3,caselet.clues);
    assert.equal(production.length,1,`${caselet.caseletId}: production uniqueness`);
    assert.equal(oracle.length,1,`${caselet.caseletId}: oracle uniqueness`);
    assert.equal(canonicalDigest(production[0]),canonicalDigest(caselet.state));
    assert.equal(canonicalDigest(oracle[0]),canonicalDigest(caselet.state));
    assert.equal(canonicalDigest(solveCp006(caselet.people,3,[...caselet.clues].reverse())[0]),canonicalDigest(caselet.state),`${caselet.caseletId}: clue-order invariance`);

    const kinds=new Set(caselet.clues.map((clue)=>clue.kind));
    for(const required of REQUIRED[blueprint]) assert.ok(kinds.has(required as never),`${caselet.caseletId}: missing ${required}`);
    if(blueprint==="SEA-PBA-021") assert.equal(caselet.clues.filter((clue)=>clue.kind==="ROW_MEMBERSHIP").length,6,"fixed-membership blueprint must carry all six row identities internally");
    if(blueprint==="SEA-PBA-022") assert.equal(caselet.clues.filter((clue)=>clue.kind==="ROW_MEMBERSHIP").length,2,"partly-inferred blueprint must not reveal all row memberships");
    if(blueprint==="SEA-PBA-023") assert.ok(caselet.clues.filter((clue)=>clue.kind==="SAME_ROW_RELATIVE").length>=3,"chain blueprint needs at least three same-row links");

    assert.deepEqual(caselet.checkpointSkillCoverage,["ROW_IDENTITY","OPPOSITE_ALIGNMENT","PERSON_RELATIVE_DIRECTION"]);
    assert.equal(caselet.children.length,4);
    assert.equal(new Set(caselet.children.map((child)=>child.queryContractId)).size,4);
    assert.ok(caselet.children.some((child)=>child.queryContractId==="SEA-QC-010"),"parallel-row passage must include opposite/corresponding child");
    assert.equal(new Set(caselet.children.map((child)=>child.answerDeterminingFactFingerprint)).size,4);
    for(const child of caselet.children){
      assert.equal(child.options.length,4);
      assert.equal(child.options.filter((option)=>option.isCorrect).length,1);
      assert.equal(child.options[child.answerIndex]?.isCorrect,true);
      assert.equal(child.options[child.answerIndex]?.value,child.answer);
      assert.ok(child.explanation.length>40);
      assert.ok(child.options.every((option)=>option.explanation.length>20));
      assert.ok(!/\bcolumns?\b/i.test(child.explanation));
      assert.ok(child.options.every((option)=>!/\bcolumns?\b/i.test(option.explanation)));
      answerPositions[child.answerIndex]+=1;
    }

    assert.ok(caselet.setupText.includes("two parallel rows"));
    assert.ok(caselet.setupText.includes("upper row face south"));
    assert.ok(caselet.setupText.includes("lower row face north"));
    assert.ok(caselet.setupText.includes("same position"));
    assert.ok(!/observer coordinates|blueprint|hidden state|\bcolumns?\b/i.test(caselet.setupText));
    assert.ok(caselet.diagram.svg.includes("fill=\"white\""));
    assert.ok(caselet.diagramText.includes("Positions:"));
    assert.ok(!/\bcolumns?\b/i.test(caselet.diagramText));
    assert.ok(caselet.sharedExplanation.includes("Final arrangement:"));
    assert.ok(caselet.sharedExplanation.includes("Step 1:"));
    assert.ok(caselet.sharedExplanation.includes("Position:"));
    assert.match(caselet.sharedExplanation,/^Use positions 1 to 3 from left to right\./);
    assert.match(caselet.sharedExplanation,/upper row faces south/i);
    assert.match(caselet.sharedExplanation,/lower row faces north/i);
    assert.ok(/\bposition\b/i.test(caselet.sharedExplanation));
    assert.ok(!/\bcolumns?\b/i.test(caselet.sharedExplanation));
    assert.ok(!/Draw two equal rows first|For a person in the upper row|Here the conditions fix|Use this final arrangement to answer/i.test(caselet.sharedExplanation));
    assert.ok(caselet.sharedExplanation.length>400,`${caselet.caseletId}: detailed solution too thin`);
    if(caselet.sharedExplanation.includes("Case 1:")) caseTeachingByBlueprint.set(blueprint,(caseTeachingByBlueprint.get(blueprint)??0)+1);
    assert.ok(!/SEA-PBA|SEA-QC|blueprint|oracle|fingerprint|hidden state|observer coordinates/i.test([caselet.setupText,...caselet.clueTexts,caselet.sharedExplanation,...caselet.children.map((child)=>child.text)].join("\n")),`${caselet.caseletId}: internal implementation language leaked to learner surface`);

    assert.equal(caselet.permanentQlAllocated,false);
    assert.equal(caselet.englishFrozen,false);
    assert.equal(caselet.localizationFrozen,false);
    assert.equal(caselet.questionStudioRegistered,false);
    assert.equal(caselet.questionBankWritable,false);
    assert.equal(caselet.mockTestEligible,false);
    assert.equal(caselet.publiclyPublishable,false);
    assert.ok(!allCaseletIds.has(caselet.caseletId),`duplicate caselet id ${caselet.caseletId}`); allCaseletIds.add(caselet.caseletId);
    blueprintStructures.add(caselet.structuralFingerprint);

    for(const person of caselet.people){ const seat=seatOf(caselet.state,person); assert.ok(seat.column>=0&&seat.column<3); assert.notEqual(oppositePerson(caselet.state,person),person); }
  }
}

for(const [blueprint,values] of structures) assert.ok(values.size>=3,`${blueprint}: discovery corpus is structurally static (${values.size} signatures)`);
assert.equal(caseletCount,48);
assert.equal(childCount,192);
assert.ok(answerPositions.every((count)=>count>=25),`answer-position discovery balance too thin: ${answerPositions.join(",")}`);
assert.ok([...caseTeachingByBlueprint.values()].reduce((sum,value)=>sum+value,0)>=8,"case-formation teaching surface too thin across discovery corpus");

console.log("PASS_SEA002_CP006_DISCOVERY");
console.log("caselets",caseletCount);
console.log("child questions",childCount);
console.log("blueprints",SEA002_CP006_BLUEPRINT_IDS.join(","));
console.log("structural signatures",Object.fromEntries([...structures].map(([id,set])=>[id,set.size])));
console.log("case-teaching counts",Object.fromEntries(caseTeachingByBlueprint));
console.log("answer positions",answerPositions);
console.log("permanent QLs",0);
console.log("English/localization/Studio/Bank/mock/public",false,false,false,false,false,false);