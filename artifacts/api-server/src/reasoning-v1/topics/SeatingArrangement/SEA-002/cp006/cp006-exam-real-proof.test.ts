import assert from "node:assert/strict";

import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { generateSea002Cp006ExamRealCaselet, isCp006SourceNaturalClue } from "./exam-real.ts";
import { solveCp006 } from "./generator.ts";
import { SEA002_CP006_BLUEPRINT_IDS } from "./types.ts";

const sourceKinds=new Set<string>();
const structures=new Set<string>();
const structuresByBlueprint=new Map<string,Set<string>>();
const queryContracts=new Set<string>();
const answerPositions=Array.from({length:4},()=>[0,0,0,0]);
let caselets=0;
let children=0;
let essentialSourceChecks=0;
let maxDisplayedClues=0;

for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
  const blueprintStructures=new Set<string>(); structuresByBlueprint.set(blueprint,blueprintStructures);
  for(let index=0;index<80;index+=1){
    const width=4+(index%3),seed=`exam-real-proof-${blueprint}-${index}`;
    const caselet=generateSea002Cp006ExamRealCaselet(blueprint,seed,width);
    caselets+=1; children+=caselet.children.length;
    structures.add(caselet.structuralFingerprint); blueprintStructures.add(caselet.structuralFingerprint);
    const sourceClues=caselet.clues.filter(isCp006SourceNaturalClue);
    assert.equal(sourceClues.length,1,`${caselet.caseletId}: compact exam case should retain one source-essential relation`);
    const sourceClue=sourceClues[0]!; sourceKinds.add(sourceClue.kind);
    const withoutSource=caselet.clues.filter((clue)=>clue!==sourceClue),solutions=solveCp006(caselet.people,width,withoutSource);
    assert.ok(solutions.length!==1||canonicalDigest(solutions[0])!==canonicalDigest(caselet.state),`${caselet.caseletId}: displayed source-natural clue is redundant`);
    essentialSourceChecks+=1;

    assert.equal(caselet.solutionCount,1);
    assert.equal(caselet.solverOracleAgreement.passed,true);
    assert.ok(caselet.clueTexts.some((text)=>/between|immediate neighbours|either end|person facing/i.test(text)),`${caselet.caseletId}: source-natural wording not visible`);
    assert.equal(new Set(caselet.clueTexts).size,caselet.clueTexts.length);
    assert.ok(caselet.clueTexts.length<=12,`${caselet.caseletId}: displayed clue set too cluttered (${caselet.clueTexts.length})`);
    maxDisplayedClues=Math.max(maxDisplayedClues,caselet.clueTexts.length);
    assert.ok(!caselet.sharedExplanation.includes("Clue 1:"),`${caselet.caseletId}: solution repeats the full clue list`);

    for(let q=0;q<4;q+=1){
      const child=caselet.children[q]!; queryContracts.add(child.queryContractId); answerPositions[q]![child.answerIndex]+=1;
      assert.equal(child.options.length,4);
      assert.equal(new Set(child.options.map((option)=>option.value)).size,4);
      assert.equal(child.options.filter((option)=>option.isCorrect).length,1);
      assert.equal(child.options[child.answerIndex]?.value,child.answer);
    }
    assert.equal(caselet.permanentQlAllocated,false);
    assert.equal(caselet.englishFrozen,false);
    assert.equal(caselet.localizationFrozen,false);
    assert.equal(caselet.questionStudioRegistered,false);
    assert.equal(caselet.questionBankWritable,false);
    assert.equal(caselet.mockTestEligible,false);
    assert.equal(caselet.publiclyPublishable,false);
  }
}

assert.equal(caselets,320);
assert.equal(children,1280);
assert.equal(essentialSourceChecks,320);
assert.ok(sourceKinds.size>=4,`source-essential family diversity too thin: ${[...sourceKinds].join(",")}`);
assert.deepEqual([...queryContracts].sort(),["SEA-QC-003","SEA-QC-006","SEA-QC-008","SEA-QC-010","SEA-QC-014","SEA-QC-015"]);
assert.ok(structures.size>=240,`exam-real structural diversity too thin: ${structures.size}`);
for(const blueprint of SEA002_CP006_BLUEPRINT_IDS) assert.ok((structuresByBlueprint.get(blueprint)?.size??0)>=60,`${blueprint}: exam-real structure pool too thin`);
for(let q=0;q<4;q+=1) for(let answer=0;answer<4;answer+=1) assert.ok(answerPositions[q]![answer]>=12,`Q${q+1} answer position ${answer} underrepresented`);

console.log("PASS_SEA002_CP006_EXAM_REAL");
console.log("caselets",caselets);
console.log("child questions",children);
console.log("source-essential clue kinds",[...sourceKinds].sort().join(","));
console.log("query contracts",[...queryContracts].sort().join(","));
console.log("structural signatures",structures.size);
console.log("structures by blueprint",Object.fromEntries([...structuresByBlueprint].map(([id,set])=>[id,set.size])));
console.log("max displayed clues",maxDisplayedClues);
console.log("answer positions",answerPositions);
