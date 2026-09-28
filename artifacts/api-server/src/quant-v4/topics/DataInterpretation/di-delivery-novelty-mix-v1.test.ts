import assert from "node:assert/strict";
import {
  DI_DELIVERY_NOVELTY_MIX_AUTHORITY,
  DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  allocateDiNoveltyTiers,
  generateDiDeliveryNoveltyMix,
} from "./di-delivery-novelty-mix-v1";

const bankingAllocation=allocateDiNoveltyTiers(20,"BANKING_MAINS");
assert.deepEqual(bankingAllocation.counts,{STANDARD:15,FRESH_FAMILIAR:4,HIGHER_NOVELTY:1});
assert.equal(bankingAllocation.highNoveltyEligible,true);

const sscAllocation=allocateDiNoveltyTiers(20,"SSC_CGL_TIER_I");
assert.deepEqual(sscAllocation.counts,{STANDARD:15,FRESH_FAMILIAR:5,HIGHER_NOVELTY:0});
assert.equal(sscAllocation.highNoveltyEligible,false);

const banking=await generateDiDeliveryNoveltyMix({
  packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  seed:"DI-MIX-ACCEPTANCE-BANKING",
  count:20,
});
assert.equal(banking.questions.length,20);
assert.deepEqual(banking.generationContext.noveltyMix.actualCounts,{STANDARD:15,FRESH_FAMILIAR:4,HIGHER_NOVELTY:1});
assert.equal(banking.generationContext.noveltyMix.authority,DI_DELIVERY_NOVELTY_MIX_AUTHORITY);
assert(banking.questions.every((q:any)=>q.questionBankWritable===false));
assert(banking.questions.every((q:any)=>q.testEligible===false));
assert(banking.questions.every((q:any)=>q.publiclyPublishable===false));
assert(banking.questions.every((q:any)=>q.productionReleaseAuthorized===false));
assert(banking.questions.every((q:any)=>["STANDARD","FRESH_FAMILIAR","HIGHER_NOVELTY"].includes(q.noveltyTier)));
assert.equal(new Set(banking.questions.map((q:any)=>q.questionId)).size,20);

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
assert(ssc.questions.every((q:any)=>q.noveltyTier!=="HIGHER_NOVELTY"));
assert(ssc.questions.every((q:any)=>!["DI011_MIXED_MULTI_CHART","DI003_STACKED_BAR","DI004_THREE_SERIES_LINE","DI013_RADAR","DI014_RADAR_PIE"].includes(q.noveltySourceMode)));

await assert.rejects(
  ()=>generateDiDeliveryNoveltyMix({examProfile:"BANKING_MAINS",language:"hi",seed:"blocked-hi",count:20}),
  /English controlled-review only/u,
);

console.log("DI_DELIVERY_NOVELTY_MIX_V1",JSON.stringify({
  banking:banking.generationContext.noveltyMix.actualCounts,
  ssc:ssc.generationContext.noveltyMix.actualCounts,
  deterministicReplay:true,
  lifecycleLocked:true,
}));
