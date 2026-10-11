import assert from "node:assert/strict";
import {previewTsdSourceMotionReview} from "./source-motion-extension-studio-preview";
import {itemStem,itemExplanation} from "../../../../../../../../admin-app/src/features/question-studio/quality";
const ids=new Set<string>();
for(const language of ["en","hi","pa"] as const){
 const result=previewTsdSourceMotionReview({language});assert.equal(result.questions.length,15);
 assert.equal(result.package.routeMounted,false);assert.equal(result.package.productionSelectorVisible,false);
 for(const question of result.questions){
  assert.equal(ids.has(question.id),false);ids.add(question.id);
  assert.equal(itemStem(question),question.stem);assert.ok(itemExplanation(question).length>50);
  assert.equal(question.options[question.correctIndex],question.answerText);
  assert.equal(question.permanentQlId,null);assert.equal(question.bank,false);assert.equal(question.registered,false);
  assert.doesNotThrow(()=>JSON.stringify(question)); //No raw BigInt solver objects in Studio payloads.
 }
}
assert.equal(ids.size,45);assert.throws(()=>previewTsdSourceMotionReview({familyId:"UNKNOWN"}));assert.throws(()=>previewTsdSourceMotionReview({count:16}));
console.log("PASS:45 source-motion questions through explicit locked Studio preview payloads; unique ids, real extraction and JSON transport verified.");
