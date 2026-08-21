import assert from "node:assert/strict";

import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { auditOracleCp006, solveCp006 } from "./generator.ts";
import { cp006SourceClueTrue, generateSea002Cp006SourceRealCaselet } from "./source-realness.ts";
import { SEA002_CP006_BLUEPRINT_IDS } from "./types.ts";

const WIDTHS=[4,5,6] as const;
const sourceKinds=new Set<string>();
const queryContracts=new Set<string>();
const fourthQueryContracts=new Set<string>();
const structures=new Set<string>();
let caseletCount=0;
let childCount=0;

for(const blueprint of SEA002_CP006_BLUEPRINT_IDS) {
  for(const width of WIDTHS) {
    for(let index=0;index<2;index+=1) {
      const caselet=generateSea002Cp006SourceRealCaselet(blueprint,`source-proof-${width}-${index}`,width);
      caseletCount+=1;
      childCount+=caselet.children.length;
      structures.add(caselet.structuralFingerprint);

      const sourceClues=caselet.clues.filter((clue)=>
        clue.kind==="SAME_ROW_GAP"||
        clue.kind==="SAME_ROW_MIN_BETWEEN"||
        clue.kind==="NOT_ADJACENT"||
        clue.kind==="ROW_END_DISTANCE"||
        clue.kind==="FACING_REFERENT_RELATIVE");
      assert.equal(sourceClues.length,7,`${caselet.caseletId}: incomplete source-realness clue bundle`);
      assert.ok(sourceClues.every((clue)=>cp006SourceClueTrue(caselet.state,clue)),`${caselet.caseletId}: source clue truth`);
      for(const clue of sourceClues) sourceKinds.add(clue.kind);
      assert.ok(sourceClues.some((clue)=>clue.kind==="SAME_ROW_GAP"&&clue.between===0),`${caselet.caseletId}: missing adjacency semantic`);
      assert.ok(sourceClues.some((clue)=>clue.kind==="SAME_ROW_GAP"&&clue.between===width-2),`${caselet.caseletId}: missing exact gap semantic`);
      assert.ok(sourceClues.some((clue)=>clue.kind==="SAME_ROW_MIN_BETWEEN"&&clue.minBetween===2),`${caselet.caseletId}: missing minimum-gap semantic`);
      assert.ok(sourceClues.some((clue)=>clue.kind==="NOT_ADJACENT"),`${caselet.caseletId}: missing negative adjacency`);
      assert.ok(sourceClues.some((clue)=>clue.kind==="ROW_END_DISTANCE"&&clue.mode==="AT_EITHER_END_DISTANCE"&&clue.positionFromEnd===2),`${caselet.caseletId}: missing second-from-end semantic`);
      assert.ok(sourceClues.some((clue)=>clue.kind==="ROW_END_DISTANCE"&&clue.mode==="NOT_AT_EITHER_END_DISTANCE"&&clue.positionFromEnd===2),`${caselet.caseletId}: missing negative end-distance semantic`);
      assert.ok(sourceClues.some((clue)=>clue.kind==="FACING_REFERENT_RELATIVE"),`${caselet.caseletId}: missing facing-referent chain`);

      const production=solveCp006(caselet.people,width,caselet.clues);
      const oracle=auditOracleCp006(caselet.people,width,caselet.clues);
      assert.equal(production.length,1,`${caselet.caseletId}: production uniqueness`);
      assert.equal(oracle.length,1,`${caselet.caseletId}: oracle uniqueness`);
      assert.equal(canonicalDigest(production[0]),canonicalDigest(caselet.state));
      assert.equal(canonicalDigest(oracle[0]),canonicalDigest(caselet.state));
      assert.equal(canonicalDigest(solveCp006(caselet.people,width,[...caselet.clues].reverse())[0]),canonicalDigest(caselet.state),`${caselet.caseletId}: clue-order invariance`);

      assert.equal(caselet.children.length,4);
      assert.equal(new Set(caselet.children.map((child)=>child.queryContractId)).size,4);
      assert.deepEqual(caselet.children.slice(0,3).map((child)=>child.queryContractId),["SEA-QC-010","SEA-QC-003","SEA-QC-006"]);
      assert.ok(caselet.children[3].queryContractId==="SEA-QC-009"||caselet.children[3].queryContractId==="SEA-QC-015",`${caselet.caseletId}: unexpected fourth query contract`);
      fourthQueryContracts.add(caselet.children[3].queryContractId);
      assert.equal(caselet.children[2].answerType,"PAIR");
      assert.equal(caselet.children[3].answerType,caselet.children[3].queryContractId==="SEA-QC-009"?"COUNT":"RELATION");
      if(caselet.children[3].queryContractId==="SEA-QC-015") assert.match(caselet.children[3].text,/position of .* with respect to/i);
      for(const child of caselet.children) {
        queryContracts.add(child.queryContractId);
        assert.equal(child.options.length,4);
        assert.equal(new Set(child.options.map((option)=>option.value)).size,4,`${caselet.caseletId}/Q${child.questionOrder}: duplicate option value`);
        assert.equal(child.options.filter((option)=>option.isCorrect).length,1);
        assert.equal(child.options[child.answerIndex]?.value,child.answer);
        assert.ok(child.explanation.length>35);
        assert.ok(child.options.every((option)=>option.explanation.length>20));
      }

      const learnerSurface=[caselet.setupText,...caselet.clueTexts,...caselet.children.map((child)=>child.text)].join("\n");
      assert.match(learnerSurface,/immediate neighbours/i);
      assert.match(learnerSurface,/not immediate neighbours/i);
      assert.match(learnerSurface,/person facing/i);
      assert.match(learnerSurface,/persons? sit between/i);
      assert.match(learnerSurface,/at least 2 persons sit between/i);
      assert.match(learnerSurface,/second from either end/i);
      assert.ok(!/SEA-PBA|SEA-QC|oracle|fingerprint/i.test(learnerSurface),`${caselet.caseletId}: internal language leaked`);

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

assert.deepEqual([...sourceKinds].sort(),["FACING_REFERENT_RELATIVE","NOT_ADJACENT","ROW_END_DISTANCE","SAME_ROW_GAP","SAME_ROW_MIN_BETWEEN"]);
assert.deepEqual([...fourthQueryContracts].sort(),["SEA-QC-009","SEA-QC-015"],"source corpus must exercise both count-between and relative-position fourth-query families");
assert.deepEqual([...queryContracts].sort(),["SEA-QC-003","SEA-QC-006","SEA-QC-009","SEA-QC-010","SEA-QC-015"]);
assert.equal(caseletCount,24);
assert.equal(childCount,96);
assert.ok(structures.size>=18,`source-realness structure diversity too thin: ${structures.size}`);

console.log("PASS_SEA002_CP006_SOURCE_REALNESS");
console.log("caselets",caseletCount);
console.log("child questions",childCount);
console.log("source clue kinds",[...sourceKinds].sort().join(","));
console.log("query contracts",[...queryContracts].sort().join(","));
console.log("fourth-query families",[...fourthQueryContracts].sort().join(","));
console.log("structural signatures",structures.size);
console.log("permanent QLs",0);
console.log("English/localization/Studio/Bank/mock/public",false,false,false,false,false,false);
