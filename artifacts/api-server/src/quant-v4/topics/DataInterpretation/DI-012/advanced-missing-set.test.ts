import assert from "node:assert/strict";
import { DI012_MODEL_KINDS, generateDi012Set } from "./advanced-missing-set";
import { renderDi012TableHtml } from "./render-table";

function numberAfter(text:string, pattern:RegExp) {
  const m=text.match(pattern); assert(m, `Pattern ${pattern} not found in: ${text}`); return Number(m[1]);
}
function independentlyRecover(set: ReturnType<typeof generateDi012Set>) {
  const s=set.stimulus;
  const rows=s.rows;
  const sumKnown=(key:"a"|"b")=>rows.reduce((acc,row)=>acc+(typeof row[key]==="number"?row[key] as number:0),0);
  if(s.modelKind==="SINGLE_X_TOTAL"){
    const total=numberAfter(s.condition,/is (\d+)\.$/u); return {x:total-sumKnown("b")};
  }
  if(s.modelKind==="X_Y_SUM_DIFFERENCE"){
    const m=s.condition.match(/x \+ y = (\d+), and x is (\d+) (more|less) than y\./u); assert(m);
    const sum=Number(m[1]), gap=Number(m[2]), relation=m[3];
    return relation==="more"
      ? {x:(sum+gap)/2,y:(sum-gap)/2}
      : {x:(sum-gap)/2,y:(sum+gap)/2};
  }
  if(s.modelKind==="X_Y_RATIO_TOTAL"){
    const m=s.condition.match(/x : y = (\d+):(\d+) and x \+ y = (\d+)/u); assert(m);
    const a=Number(m[1]),b=Number(m[2]),total=Number(m[3]),k=total/(a+b); return {x:a*k,y:b*k};
  }
  if(s.modelKind==="TWO_MISSING_COLUMN_TOTALS"){
    const m=s.condition.match(/are (\d+) and (\d+), respectively/u); assert(m);
    return {x:Number(m[1])-sumKnown("a"),y:Number(m[2])-sumKnown("b")};
  }
  if(s.modelKind==="MISSING_RATE"){
    const row=rows.find(r=>r.a==="x"); assert(row && typeof row.b==="number"); return {x:(row.b as number)*4/3};
  }
  if(s.modelKind==="AVERAGE_CONSTRAINED"){
    const avg=numberAfter(s.condition,/is (\d+)\.$/u); return {x:avg*5-sumKnown("a")};
  }
  const m=s.condition.match(/x is (\d+) more/u); assert(m); const first=rows[0]!; assert(typeof first.b==="number");
  const x=(first.b as number)+Number(m[1]); return {x,y:2*x};
}

const models=new Set<string>(),tasks=new Set<string>();
let questions=0;
for(let i=0;i<350;i++){
  const seed=`DI-012-STRESS-${i}`;
  const set=generateDi012Set({seed,examProfile:i%2?"BANKING_MAINS":"BANKING_PRELIMS"});
  const replay=generateDi012Set({seed,examProfile:i%2?"BANKING_MAINS":"BANKING_PRELIMS"});
  assert.deepEqual(set,replay,`${seed}: deterministic replay failed`);
  const independent=independentlyRecover(set);
  assert.equal(independent.x,set.solution.x,`${seed}: independently recovered x differs`);
  if(set.solution.y!==undefined) assert.equal(independent.y,set.solution.y,`${seed}: independently recovered y differs`);
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  assert.equal(set.questions.length,5);
  assert(set.stimulus.rows.some(r=>r.a==="x"||r.b==="x"),`${seed}: x must be learner-visible`);
  if(set.solution.y!==undefined) assert(set.stimulus.rows.some(r=>r.a==="y"||r.b==="y"),`${seed}: y must be learner-visible when used`);
  assert(set.stimulus.condition.length>10);
  const rendered = renderDi012TableHtml(set.stimulus);
  assert(rendered.includes(set.stimulus.title), `${seed}: title missing from learner surface`);
  assert(rendered.includes(set.stimulus.condition), `${seed}: recovery condition missing from learner surface`);
  assert(rendered.includes(">x<"), `${seed}: x missing from learner-facing table`);
  if(set.solution.y!==undefined) assert(rendered.includes(">y<"), `${seed}: y missing from learner-facing table`);
  for (const row of set.stimulus.rows) {
    assert(rendered.includes(row.label), `${seed}: row label missing from learner surface`);
  }
  models.add(set.stimulus.modelKind);
  for(const q of set.questions){
    questions++; tasks.add(q.kind);
    assert.equal(q.options.length,5);
    assert.equal(new Set(q.options).size,5,`${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex],q.answer,`${seed}: answer/index drift`);
    assert(!/\.\d/u.test(q.answer),`${seed}: decimal answer leaked: ${q.answer}`);
    assert(q.explanation.steps.length>0);
  }
}
assert.deepEqual([...models].sort(),[...DI012_MODEL_KINDS].sort(),"Not all advanced missing models were exercised.");
for(const required of ["RECOVER_X","RECOVER_Y","UNKNOWN_SUM","UNKNOWN_DIFFERENCE","UNKNOWN_RATIO","RECOVERED_ROW_TOTAL","RECOVERED_COLUMN_TOTAL","RECOVERED_SHARE_OF_TOTAL","CROSS_ROW_RATIO_AFTER_RECOVERY","COMBINED_RECOVERED_PERCENT"]){
  assert(tasks.has(required),`Task family not exercised: ${required}`);
}
console.log("DI012_ADVANCED_MISSING_VARIABLE_V1",JSON.stringify({sets:350,questions,models:[...models].sort(),tasks:[...tasks].sort(),independentRecovery:true}));
