import { runPrb002Pipeline, listPrb002QuestionEntries, PRB_002_LIBRARIES } from "./index";
function assert(condition:unknown,message:string):asserts condition{if(!condition)throw new Error(message);}
const entries=listPrb002QuestionEntries();let runs=0;for(const entry of entries){const seed=`PRB-002:forced:${entry.qlId}`;const first=runPrb002Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed}),second=runPrb002Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed});assert(first.validation.valid,`${entry.qlId} validation failed`);assert(first.independentVerification.matched,`${entry.qlId} independent verifier failed`);assert(JSON.stringify(first)===JSON.stringify(second),`${entry.qlId} is not deterministic`);runs+=2;}console.log(JSON.stringify({packageId:"PRB-002",qlCount:entries.length,deterministicRuns:runs}));


function normalizeSurfaceP4(stem:string){
  return stem.normalize("NFKC").toLowerCase()
    .replace(/-?\d+(?:\.\d+)?/gu,"<n>")
    .replace(/[^a-z<>%+*/=\-]+/gu," ")
    .replace(/\s+/gu," ").trim();
}
function wave2Surfaces(ids:string[]){
  return ids.map((qlId)=>{
    const entry=entries.find((candidate)=>candidate.qlId===qlId);
    assert(entry,`${qlId} missing from PRB-002 registry`);
    return normalizeSurfaceP4(runPrb002Pipeline(entry.cpId as any,{questionLanguageId:qlId,seed:`PRB-002:surface-wave2:${qlId}`}).stem);
  });
}
const conditionalNumberWave2=wave2Surfaces(["PRB-QL-603","PRB-QL-609","PRB-QL-615","PRB-QL-621"]);
const conditionalCountingWave2=wave2Surfaces(["PRB-QL-601","PRB-QL-607","PRB-QL-613","PRB-QL-619"]);
assert(new Set(conditionalNumberWave2).size>=4,`Conditional-number QLs still collapse to ${new Set(conditionalNumberWave2).size} structures`);
assert(new Set(conditionalCountingWave2).size>=4,`Conditional-counting QLs still collapse to ${new Set(conditionalCountingWave2).size} structures`);
console.log(JSON.stringify({
  packageId:"PRB-002",
  surfaceStabilityWave2:{
    conditionalNumberStructures:new Set(conditionalNumberWave2).size,
    conditionalCountingStructures:new Set(conditionalCountingWave2).size,
  }
}));
