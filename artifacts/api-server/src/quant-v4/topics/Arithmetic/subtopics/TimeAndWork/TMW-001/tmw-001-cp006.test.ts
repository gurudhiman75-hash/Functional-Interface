import { strict as assert } from "node:assert";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { runTmwCp006Pipeline } from "./foundation/cp006-runtime";

assert.equal(TMW_CP006_REGISTRY.length,22);
assert.deepEqual(TMW_CP006_REGISTRY.map(entry=>entry.qlId),Array.from({length:22},(_,index)=>`TMW-QL-${String(index+106).padStart(3,"0")}`));
assert.equal(new Set(TMW_CP006_REGISTRY.map(entry=>entry.solveMode)).size,22);

const positions=new Set<number>(),stems=new Set<string>();
let cases=0;
for(const entry of TMW_CP006_REGISTRY){
  for(let index=0;index<50;index+=1){
    const seed=`tmw-cp006-proof:${entry.qlId}:${index}`;
    const first=runTmwCp006Pipeline({questionLanguageId:entry.qlId,seed});
    const second=runTmwCp006Pipeline({questionLanguageId:entry.qlId,seed});
    assert.deepEqual(first,second,`${entry.qlId} is not deterministic for ${seed}`);
    assert.equal(first.validation.valid,true,`${entry.qlId}: ${first.validation.errors.join("; ")}`);
    assert.equal(first.options.length,4);
    assert.equal(new Set(first.options).size,4);
    assert.equal(first.options[first.correctIndex],first.solution.answerText);
    assert.equal(first.optionAudit.filter(option=>option.misconceptionId==="CORRECT").length,1);
    assert.equal(first.publiclyPublishable,false);
    assert.ok(first.explanation.steps.length>=3);
    assert.ok(first.explanation.steps.every(step=>step.startsWith("\\(")&&step.endsWith("\\)")));
    assert.ok(first.explanation.shortcut.title.startsWith("10-Second "));
    assert.ok(first.optionAudit.some(option=>option.text===first.explanation.commonTrap.optionText&&option.misconceptionId===first.explanation.commonTrap.misconceptionId));
    if(["COUNT","SHIFT","RESOURCE_TIME"].includes(entry.answerType))assert.equal(first.solution.answer.denominator,1,`${entry.qlId} produced a non-integral discrete answer`);
    positions.add(first.correctIndex);stems.add(first.stem);cases+=1;
  }
}
assert.deepEqual([...positions].sort(),[0,1,2,3]);
for(const language of ["hi","pa"] as const){
  const localized=runTmwCp006Pipeline({questionLanguageId:"TMW-QL-106",seed:`locale-${language}`,language});
  assert.equal(localized.validation.valid,true,localized.validation.errors.join("; "));
  assert.equal(localized.language,language);
  assert.equal(localized.publiclyPublishable,false);
  assert.equal(localized.options[localized.correctIndex],localized.solution.answerText);
}
assert.throws(()=>runTmwCp006Pipeline({questionLanguageId:"TMW-QL-999",seed:"unknown"}),/Unknown TMW-CP-006/);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-006",qlCount:TMW_CP006_REGISTRY.length,seedsPerQl:50,cases,distinctStems:stems.size,correctPositions:[...positions].sort(),status:"PASS"},null,2));
