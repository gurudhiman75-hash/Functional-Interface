import assert from "node:assert/strict";
import {
  DI_DELIVERY_NOVELTY_MIX_AUTHORITY,
  DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  allocateDiDifficultyBands,
  allocateDiNoveltyTiers,
  generateDiDeliveryNoveltyMix,
} from "./di-delivery-novelty-mix-v1";

const bankingAllocation=allocateDiNoveltyTiers(20,"BANKING_MAINS");
assert.deepEqual(bankingAllocation.counts,{STANDARD:15,FRESH_FAMILIAR:4,HIGHER_NOVELTY:1});
assert.equal(bankingAllocation.highNoveltyEligible,true);

const sscAllocation=allocateDiNoveltyTiers(20,"SSC_CGL_TIER_I");
assert.deepEqual(sscAllocation.counts,{STANDARD:15,FRESH_FAMILIAR:5,HIGHER_NOVELTY:0});
assert.equal(sscAllocation.highNoveltyEligible,false);
assert.deepEqual(allocateDiDifficultyBands(20,"SSC_CGL_TIER_I").counts,{Easy:7,Medium:8,Hard:5});
assert.deepEqual(allocateDiDifficultyBands(20,"BANKING_PRELIMS").counts,{Easy:6,Medium:10,Hard:4});
assert.deepEqual(allocateDiDifficultyBands(20,"BANKING_MAINS").counts,{Easy:3,Medium:9,Hard:8});


const banking=await generateDiDeliveryNoveltyMix({
  packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  seed:"DI-MIX-ACCEPTANCE-BANKING",
  count:20,
});
assert.equal(banking.questions.length,20);
assert.deepEqual(banking.generationContext.noveltyMix.actualCounts,{STANDARD:15,FRESH_FAMILIAR:4,HIGHER_NOVELTY:1});
assert.deepEqual(banking.generationContext.difficultyMix.actualCounts,{Easy:3,Medium:9,Hard:8});
assert.deepEqual(banking.generationContext.difficultyMix.requestedCounts,{Easy:3,Medium:9,Hard:8});
const mainsHardIneligible=new Set([
  "DI001_BASIC_TABLE",
  "DI003_GROUPED_BAR",
  "DI004_TWO_SERIES_LINE",
  "DI005_HIDDEN_PIE",
  "DI005_VISIBLE_PIE",
  "DI006_BASE_CASELET",
  "DI003_SINGLE_BAR",
  "DI004_SINGLE_LINE",
  "DI005_DONUT",
  "DI003_STACKED_BAR",
  "DI004_THREE_SERIES_LINE",
  "DI013_RADAR",
]);

const mainsHardTaskDenylist=new Map<string,Set<string>>([
  ["DI002_ADVANCED_TABLE",new Set(["RELATIVE_SELECTED_PERCENT_EXCESS","COMBINED_SELECTED_RATIO"])],
  ["DI006_ADVANCED_CASELET",new Set(["REMAINDER_AFTER_GROUP"])],
  ["DI014_RADAR_PIE",new Set(["TWO_CATEGORY_APPLICATION_TOTAL"])],
]);
function assertMainsHardTaskDepth(question:any,context:string){
  if((question.difficultyLabel??question.difficulty)!=="Hard") return;
  const denied=mainsHardTaskDenylist.get(question.noveltySourceMode);
  const task=String(question.taskKind??question.kind??question.metadata?.taskKind??"");
  assert(
    !denied?.has(task),
    `${context}: shallow Banking Mains Hard task ${task} came from ${question.noveltySourceMode}`,
  );
}
for(const q of banking.questions as any[]){
  if((q.difficultyLabel??q.difficulty)==="Hard"){
    assert(
      !mainsHardIneligible.has(q.noveltySourceMode),
      `Banking Mains Hard slot used non-hard-capable source ${q.noveltySourceMode}`,
    );
    assertMainsHardTaskDepth(q,"acceptance batch");
  }
}
const bankingHardSources=new Set(
  (banking.questions as any[])
    .filter(q=>(q.difficultyLabel??q.difficulty)==="Hard")
    .map(q=>q.noveltySourceMode),
);
assert(
  bankingHardSources.size>=4,
  `Expected at least 4 distinct source modes across 8 Banking Mains Hard questions; saw ${[...bankingHardSources].join(", ")}`,
);
assert(
  Math.max(...[...bankingHardSources].map(source=>
    (banking.questions as any[]).filter(q=>(q.difficultyLabel??q.difficulty)==="Hard"&&q.noveltySourceMode===source).length
  ))<=2,
  "No single source mode should occupy more than 2 of the 8 Banking Mains Hard slots in the acceptance batch.",
);
assert.equal(banking.generationContext.noveltyMix.authority,DI_DELIVERY_NOVELTY_MIX_AUTHORITY);
assert(banking.questions.every((q:any)=>q.questionBankWritable===false));
assert(banking.questions.every((q:any)=>q.testEligible===false));
assert(banking.questions.every((q:any)=>q.publiclyPublishable===false));
assert(banking.questions.every((q:any)=>q.productionReleaseAuthorized===false));
assert(banking.questions.every((q:any)=>["STANDARD","FRESH_FAMILIAR","HIGHER_NOVELTY"].includes(q.noveltyTier)));
assert.equal(new Set(banking.questions.map((q:any)=>q.questionId)).size,20);
assert.equal(
  new Set(banking.questions.map((q:any)=>String(q.stem??q.text??"").toLowerCase().replace(/\s+/g," ").trim())).size,
  20,
  "Banking mix must not contain exact normalized stem duplicates.",
);
for(let i=1;i<banking.questions.length;i+=1){
  const prev=(banking.questions[i-1] as any).noveltyTier;
  const current=(banking.questions[i] as any).noveltyTier;
  assert(
    prev==="STANDARD" || current==="STANDARD",
    `Non-standard questions clustered at positions ${i} and ${i+1}.`,
  );
}

const bankingReplay=await generateDiDeliveryNoveltyMix({
  packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  seed:"DI-MIX-ACCEPTANCE-BANKING",
  count:20,
});
assert.deepEqual(
  banking.questions.map((q:any)=>({id:q.questionId,tier:q.noveltyTier,source:q.noveltySourceMode})),
  bankingReplay.questions.map((q:any)=>({id:q.questionId,tier:q.noveltyTier,source:q.noveltySourceMode})),
);

const ssc=await generateDiDeliveryNoveltyMix({
  packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  examProfile:"SSC_CGL_TIER_I",
  language:"en",
  seed:"DI-MIX-ACCEPTANCE-SSC",
  count:20,
});
assert.equal(ssc.questions.length,20);
assert.deepEqual(ssc.generationContext.noveltyMix.actualCounts,{STANDARD:15,FRESH_FAMILIAR:5,HIGHER_NOVELTY:0});
assert.deepEqual(ssc.generationContext.difficultyMix.actualCounts,{Easy:7,Medium:8,Hard:5});
assert(ssc.questions.every((q:any)=>q.noveltyTier!=="HIGHER_NOVELTY"));
assert(ssc.questions.every((q:any)=>!["DI011_MIXED_MULTI_CHART","DI003_STACKED_BAR","DI004_THREE_SERIES_LINE","DI013_RADAR","DI014_RADAR_PIE"].includes(q.noveltySourceMode)));

const prelims=await generateDiDeliveryNoveltyMix({
  packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  examProfile:"BANKING_PRELIMS",
  language:"en",
  seed:"DI-MIX-ACCEPTANCE-PRELIMS",
  count:20,
});
assert.equal(prelims.questions.length,20);
assert.deepEqual(prelims.generationContext.noveltyMix.actualCounts,{STANDARD:15,FRESH_FAMILIAR:4,HIGHER_NOVELTY:1});
assert.deepEqual(prelims.generationContext.difficultyMix.actualCounts,{Easy:6,Medium:10,Hard:4});

const hardOverride=await generateDiDeliveryNoveltyMix({
  packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  difficulty:"hard",
  seed:"DI-MIX-HARD-OVERRIDE",
  count:10,
});
assert.deepEqual(hardOverride.generationContext.difficultyMix.actualCounts,{Easy:0,Medium:0,Hard:10});
assert.equal(hardOverride.generationContext.difficultyMix.explicitDifficulty,"Hard");
assert(
  (hardOverride.questions as any[]).every(q=>!mainsHardIneligible.has(q.noveltySourceMode)),
  "Explicit Banking Mains Hard override must use only hard-capable source modes.",
);
for(const q of hardOverride.questions as any[]) assertMainsHardTaskDepth(q,"explicit Hard override");

for(let i=0;i<20;i+=1){
  const result=await generateDiDeliveryNoveltyMix({
    packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
    examProfile:"BANKING_MAINS",
    language:"en",
    seed:`DI-MIX-MAINS-HARD-GUARD-${i}`,
    count:20,
  });
  assert.deepEqual(result.generationContext.difficultyMix.actualCounts,{Easy:3,Medium:9,Hard:8});
  const hardQuestions=(result.questions as any[]).filter(q=>(q.difficultyLabel??q.difficulty)==="Hard");
  const hardSourceCounts=new Map<string,number>();
  for(const q of hardQuestions){
    assert(
      !mainsHardIneligible.has(q.noveltySourceMode),
      `Banking Mains Hard slot used excluded source ${q.noveltySourceMode} for seed ${i}`,
    );
    assertMainsHardTaskDepth(q,`seed ${i}`);
    hardSourceCounts.set(q.noveltySourceMode,(hardSourceCounts.get(q.noveltySourceMode)??0)+1);
  }
  assert(
    hardSourceCounts.size>=4,
    `Expected at least 4 distinct Hard source modes for seed ${i}; saw ${[...hardSourceCounts.keys()].join(", ")}`,
  );
  assert(
    Math.max(...hardSourceCounts.values())<=2,
    `A Hard source mode exceeded the 2-question cap for seed ${i}: ${JSON.stringify([...hardSourceCounts.entries()])}`,
  );
}

const highNoveltySources=new Set<string>();
for(let i=0;i<25;i+=1){
  const result=await generateDiDeliveryNoveltyMix({
    packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
    examProfile:"BANKING_MAINS",
    language:"en",
    seed:`DI-MIX-HIGH-ROTATION-${i}`,
    count:20,
  });
  const higher=result.questions.filter((q:any)=>q.noveltyTier==="HIGHER_NOVELTY");
  assert.equal(higher.length,1);
  highNoveltySources.add((higher[0] as any).noveltySourceMode);
}
assert(
  highNoveltySources.size>=4,
  `Expected higher-novelty rotation across at least 4 Banking Mains sources; saw ${[...highNoveltySources].join(", ")}`,
);

await assert.rejects(
  ()=>generateDiDeliveryNoveltyMix({examProfile:"BANKING_MAINS",language:"hi",seed:"blocked-hi",count:20}),
  /English controlled-review only/u,
);

console.log("DI_DELIVERY_NOVELTY_MIX_V1",JSON.stringify({
  banking:banking.generationContext.noveltyMix.actualCounts,
  ssc:ssc.generationContext.noveltyMix.actualCounts,
  difficulty:{
    ssc:ssc.generationContext.difficultyMix.actualCounts,
    prelims:prelims.generationContext.difficultyMix.actualCounts,
    mains:banking.generationContext.difficultyMix.actualCounts,
  },
  deterministicReplay:true,
  exactStemDeduplication:true,
  tierSpacing:true,
  mainsHardSourceGuard:true,
  mainsHardSourceDiversity:true,
  mainsHardTaskDepth:true,
  bankingHardSources:[...bankingHardSources].sort(),
  higherNoveltySources:[...highNoveltySources].sort(),
  lifecycleLocked:true,
}));
