import { strict as assert } from "node:assert";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { runTmwCp007Pipeline } from "./foundation/cp007-runtime";
import { verifyTmwCp007 } from "./foundation/cp007-solver";
import { buildTmwCp007ReviewRows } from "./foundation/cp007-review";

const correctPositions=new Set<number>(),stems=new Set<string>();let generatedCount=0;
for(const entry of TMW_CP007_REGISTRY){
  const qlStems=new Set<string>(),qlPositions=new Set<number>();
  for(let index=0;index<50;index+=1){
    const seed=`tmw-cp007-proof:${entry.qlId}:${index}`,first=runTmwCp007Pipeline({questionLanguageId:entry.qlId,seed}),second=runTmwCp007Pipeline({questionLanguageId:entry.qlId,seed});
    generatedCount+=1;assert.deepEqual(first,second);assert.equal(first.validation.valid,true,first.validation.errors.join("; "));assert.equal(verifyTmwCp007(entry,first.parameters,first.solution),true);assert.equal(first.options.length,4);assert.equal(new Set(first.options).size,4);assert.equal(first.options[first.correctIndex],first.solution.answerText);assert.equal(first.optionAudit.filter(option=>option.misconceptionId==="CORRECT").length,1);assert.equal(first.publiclyPublishable,false);assert.equal(first.explanation.commonTrap.optionText===first.solution.answerText,false);assert.ok(first.explanation.givens.length>=2);assert.ok(first.explanation.steps.length>=3);assert.ok(first.explanation.steps.every(step=>step.startsWith("\\(")&&step.endsWith("\\)")));assert.ok(first.explanation.shortcut.steps.length>=2);
    if(["COUNT","COUNT_PAIR","RESOURCE_TIME"].includes(entry.answerType))assert.ok(first.solution.answerValues.every(value=>value.denominator===1));
    correctPositions.add(first.correctIndex);qlPositions.add(first.correctIndex);stems.add(first.stem);qlStems.add(first.stem);
  }
  assert.equal(qlPositions.size,4,`${entry.qlId} did not reach all four answer positions`);assert.ok(qlStems.size>=3,`${entry.qlId} stem diversity is too low`);
}
const reviewRows=buildTmwCp007ReviewRows(3);assert.equal(reviewRows.length,48);for(const entry of TMW_CP007_REGISTRY){const qlRows=reviewRows.filter(row=>row.qlId===entry.qlId);assert.equal(qlRows.length,3);assert.equal(new Set(qlRows.map(row=>row.stem)).size,3,`${entry.qlId} review rows are not distinct`);}
assert.equal(TMW_CP007_REGISTRY.length,16);assert.equal(generatedCount,800);assert.equal(correctPositions.size,4);assert.throws(()=>runTmwCp007Pipeline({questionLanguageId:"TMW-QL-128",seed:"locale",language:"hi"}),/English only/);assert.throws(()=>runTmwCp007Pipeline({questionLanguageId:"TMW-QL-999",seed:"unknown"}),/Unknown TMW-CP-007/);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-007",qlCount:TMW_CP007_REGISTRY.length,seedsPerQl:50,generatedCount,distinctStems:stems.size,correctAnswerPositions:[...correctPositions].sort(),status:"PASS"},null,2));
