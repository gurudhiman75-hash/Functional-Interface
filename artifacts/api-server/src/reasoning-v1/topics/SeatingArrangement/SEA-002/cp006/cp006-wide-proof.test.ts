import assert from "node:assert/strict";

import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { auditOracleCp006, cp006ClueTrue, solveCp006 } from "./generator.ts";
import { generateSea002Cp006DiscoveryCaselet } from "./discovery.ts";
import { oppositePerson, seatOf } from "./topology.ts";
import { SEA002_CP006_BLUEPRINT_IDS, type Sea002Cp006BlueprintId } from "./types.ts";

const REQUIRED:Readonly<Record<Sea002Cp006BlueprintId,readonly string[]>>={
  "SEA-PBA-021":["ROW_MEMBERSHIP","OPPOSITE","SAME_ROW_RELATIVE"],
  "SEA-PBA-022":["ROW_MEMBERSHIP","OPPOSITE","SAME_ROW_RELATIVE","DIAGONAL"],
  "SEA-PBA-023":["ROW_MEMBERSHIP","OPPOSITE","SAME_ROW_RELATIVE"],
  "SEA-PBA-024":["OPPOSITE","NOT_OPPOSITE","DIAGONAL","END_POSITION"],
};

const WIDTHS=[4,5,6] as const;
const widthCounts=new Map<number,number>();
const blueprintWidths=new Map<Sea002Cp006BlueprintId,Set<number>>();
const caseletIds=new Set<string>();
let caseletCount=0;
let childCount=0;

for(const blueprint of SEA002_CP006_BLUEPRINT_IDS){
  const covered=new Set<number>();
  blueprintWidths.set(blueprint,covered);
  for(const width of WIDTHS){
    for(let index=0;index<2;index+=1){
      const caselet=generateSea002Cp006DiscoveryCaselet(blueprint,`wide-proof-${width}-${index}`,width);
      caseletCount+=1;
      childCount+=caselet.children.length;
      covered.add(width);
      widthCounts.set(width,(widthCounts.get(width)??0)+1);

      assert.equal(caselet.state.seatCountPerRow,width);
      assert.equal(caselet.people.length,width*2);
      assert.equal(new Set(caselet.people).size,width*2);
      assert.equal(caselet.state.top.length,width);
      assert.equal(caselet.state.bottom.length,width);
      assert.equal(new Set([...caselet.state.top,...caselet.state.bottom]).size,width*2);
      assert.ok(caselet.clues.every((clue)=>cp006ClueTrue(caselet.state,clue)),`${caselet.caseletId}: hidden-state clue verifier`);

      const production=solveCp006(caselet.people,width,caselet.clues);
      const oracle=auditOracleCp006(caselet.people,width,caselet.clues);
      assert.equal(production.length,1,`${caselet.caseletId}: production uniqueness`);
      assert.equal(oracle.length,1,`${caselet.caseletId}: oracle uniqueness`);
      assert.equal(canonicalDigest(production[0]),canonicalDigest(caselet.state));
      assert.equal(canonicalDigest(oracle[0]),canonicalDigest(caselet.state));
      assert.equal(
        canonicalDigest(solveCp006(caselet.people,width,[...caselet.clues].reverse())[0]),
        canonicalDigest(caselet.state),
        `${caselet.caseletId}: clue-order invariance`,
      );

      const kinds=new Set(caselet.clues.map((clue)=>clue.kind));
      for(const required of REQUIRED[blueprint]) assert.ok(kinds.has(required as never),`${caselet.caseletId}: missing ${required}`);
      if(blueprint==="SEA-PBA-021") assert.equal(caselet.clues.filter((clue)=>clue.kind==="ROW_MEMBERSHIP").length,width*2);
      if(blueprint==="SEA-PBA-022") assert.equal(caselet.clues.filter((clue)=>clue.kind==="ROW_MEMBERSHIP").length,2);
      if(blueprint==="SEA-PBA-023") assert.ok(caselet.clues.filter((clue)=>clue.kind==="SAME_ROW_RELATIVE").length>=3);
      if(blueprint==="SEA-PBA-024") assert.equal(caselet.clues.some((clue)=>clue.kind==="ROW_MEMBERSHIP"),false);

      assert.equal(caselet.children.length,4);
      assert.equal(new Set(caselet.children.map((child)=>child.queryContractId)).size,4);
      for(const child of caselet.children){
        assert.equal(child.options.length,4);
        assert.equal(child.options.filter((option)=>option.isCorrect).length,1);
        assert.equal(child.options[child.answerIndex]?.value,child.answer);
      }

      const viewBox=caselet.diagram.svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      assert.ok(viewBox,`${caselet.caseletId}: missing SVG viewBox`);
      assert.ok(Number(viewBox[1])>=180+(width-1)*132,`${caselet.caseletId}: SVG width too small for ${width} columns`);
      assert.equal(Number(viewBox[2]),300);
      assert.ok(caselet.diagram.svg.includes("fill=\"white\""));
      assert.ok(caselet.diagram.svg.includes(`C${width}</text>`));
      assert.ok(caselet.setupText.includes(`two parallel rows of ${width} seats each`));

      for(const person of caselet.people){
        const seat=seatOf(caselet.state,person);
        assert.ok(seat.column>=0&&seat.column<width);
        assert.notEqual(oppositePerson(caselet.state,person),person);
      }

      assert.ok(!caseletIds.has(caselet.caseletId),`duplicate caselet id ${caselet.caseletId}`);
      caseletIds.add(caselet.caseletId);
      assert.equal(caselet.permanentQlAllocated,false);
      assert.equal(caselet.englishFrozen,false);
      assert.equal(caselet.localizationFrozen,false);
      assert.equal(caselet.questionStudioRegistered,false);
      assert.equal(caselet.questionBankWritable,false);
      assert.equal(caselet.mockTestEligible,false);
      assert.equal(caselet.publiclyPublishable,false);
    }
  }
}

for(const [blueprint,widths] of blueprintWidths) assert.deepEqual([...widths].sort(),[4,5,6],`${blueprint}: incomplete width coverage`);
assert.deepEqual(Object.fromEntries([...widthCounts].sort(([a],[b])=>a-b)),{"4":8,"5":8,"6":8});
assert.equal(caseletCount,24);
assert.equal(childCount,96);

console.log("PASS_SEA002_CP006_WIDE_DISCOVERY");
console.log("wide caselets",caseletCount);
console.log("wide child questions",childCount);
console.log("width counts",Object.fromEntries([...widthCounts].sort(([a],[b])=>a-b)));
console.log("permanent QLs",0);
console.log("English/localization/Studio/Bank/mock/public",false,false,false,false,false,false);
