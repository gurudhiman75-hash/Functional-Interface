import { runPrb002Pipeline, listPrb002QuestionEntries, PRB_002_LIBRARIES } from "./index";
function assert(condition:unknown,message:string):asserts condition{if(!condition)throw new Error(message);}
const entries=listPrb002QuestionEntries();let runs=0;for(const entry of entries){const seed=`PRB-002:forced:${entry.qlId}`;const first=runPrb002Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed}),second=runPrb002Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed});assert(first.validation.valid,`${entry.qlId} validation failed`);assert(first.independentVerification.matched,`${entry.qlId} independent verifier failed`);assert(JSON.stringify(first)===JSON.stringify(second),`${entry.qlId} is not deterministic`);runs+=2;}console.log(JSON.stringify({packageId:"PRB-002",qlCount:entries.length,deterministicRuns:runs}));


function normalizeSurface(stem:string){
  return stem.normalize("NFKC").toLowerCase()
    .replace(/-?\d+(?:\.\d+)?/gu,"<n>")
    .replace(/\b(red|blue|green|black|white)\b/gu,"<colour>")
    .replace(/\b(bag|box|jar|pouch|ball|balls|marble|marbles|pen|pens|stone|stones)\b/gu,"<object>")
    .replace(/[^a-z<>%+*/=\-]+/gu," ")
    .replace(/\s+/gu," ").trim();
}
function surfaces(ids:string[]){
  return ids.map((qlId)=>{
    const entry=entries.find((candidate)=>candidate.qlId===qlId);
    assert(entry,`${qlId} missing from PRB-002 registry`);
    return normalizeSurface(runPrb002Pipeline(entry.cpId as any,{questionLanguageId:qlId,seed:`PRB-002:surface:${qlId}`}).stem);
  });
}
const dependent=surfaces(["PRB-QL-502","PRB-QL-504","PRB-QL-510","PRB-QL-512","PRB-QL-518","PRB-QL-520"]);
const committee=surfaces(["PRB-QL-701","PRB-QL-709","PRB-QL-717","PRB-QL-725","PRB-QL-726"]);
const conditionalCard=surfaces(["PRB-QL-602","PRB-QL-608","PRB-QL-614","PRB-QL-620"]);
const conditionalUrn=surfaces(["PRB-QL-604","PRB-QL-610","PRB-QL-616","PRB-QL-622"]);
assert(new Set(dependent).size>=3,`Successive-dependent QLs still collapse to ${new Set(dependent).size} structures`);
assert(new Set(committee).size>=3,`Committee QLs still collapse to ${new Set(committee).size} structures`);
assert(new Set(conditionalCard).size>=4,`Conditional-card QLs still collapse to ${new Set(conditionalCard).size} structures`);
assert(new Set(conditionalUrn).size>=4,`Conditional-urn QLs still collapse to ${new Set(conditionalUrn).size} structures`);
console.log(JSON.stringify({
  packageId:"PRB-002",
  surfaceStabilityWave1:{
    successiveDependentStructures:new Set(dependent).size,
    committeeStructures:new Set(committee).size,
    conditionalCardStructures:new Set(conditionalCard).size,
    conditionalUrnStructures:new Set(conditionalUrn).size,
  }
}));


const conditionalNumberWave2=surfaces(["PRB-QL-603","PRB-QL-609","PRB-QL-615","PRB-QL-621"]);
const conditionalCountingWave2=surfaces(["PRB-QL-601","PRB-QL-607","PRB-QL-613","PRB-QL-619"]);
assert(new Set(conditionalNumberWave2).size>=4,`Conditional-number QLs still collapse to ${new Set(conditionalNumberWave2).size} structures`);
assert(new Set(conditionalCountingWave2).size>=4,`Conditional-counting QLs still collapse to ${new Set(conditionalCountingWave2).size} structures`);
console.log(JSON.stringify({
  packageId:"PRB-002",
  surfaceStabilityWave2:{
    conditionalNumberStructures:new Set(conditionalNumberWave2).size,
    conditionalCountingStructures:new Set(conditionalCountingWave2).size,
  }
}));
