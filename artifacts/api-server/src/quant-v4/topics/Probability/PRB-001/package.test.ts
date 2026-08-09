import { runPrb001Pipeline, listPrb001QuestionEntries } from "./index";
function assert(condition:unknown,message:string):asserts condition{if(!condition)throw new Error(message);}
const entries=listPrb001QuestionEntries();
let runs=0;
for(const entry of entries){
  const seed=`PRB-001:forced:${entry.qlId}`;
  const first=runPrb001Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed});
  const second=runPrb001Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed});
  const failures=first.validation.checks.filter((item)=>!item.passed).map((item)=>`${item.name}: ${item.message}`).join(" | ");
  assert(first.validation.valid,`${entry.qlId} validation failed: ${failures}\nStem: ${first.stem}\nExplanation: ${first.explanation.lines.join(" ")}`);
  assert(first.independentVerification.matched,`${entry.qlId} independent verifier failed`);
  assert(JSON.stringify(first)===JSON.stringify(second),`${entry.qlId} is not deterministic`);
  runs+=2;
}
console.log(JSON.stringify({packageId:"PRB-001",qlCount:entries.length,deterministicRuns:runs}));
