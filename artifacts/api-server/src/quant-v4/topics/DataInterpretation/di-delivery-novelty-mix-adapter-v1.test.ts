import assert from "node:assert/strict";
import { quantV4QuestionStudioAdapter } from "../../../question-studio/engines/quant-v4-adapter";
import { DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID } from "./di-delivery-novelty-mix-v1";

const packages=quantV4QuestionStudioAdapter.listPackages();
const card=packages.find(pkg=>pkg.packageId===DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID);
assert(card,"DI-MIX-001 must be discoverable through the shared Quant Question Studio adapter.");
assert.equal(card.enabled,true);
assert.deepEqual(card.supportedLanguages,["en"]);
assert.equal(card.questionBankWritable,false);
assert.equal(card.testEligible,false);
assert.equal(card.publiclyPublishable,false);

const result=await quantV4QuestionStudioAdapter.generate({
  packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
  topic:"Data Interpretation",
  subtopic:"Chapter Delivery Mix",
  language:"en",
  exam:"Banking Mains",
  seed:"DI-MIX-SHARED-ADAPTER-V1",
  count:20,
});
assert.equal(result.questions.length,20);
const context=result.generationContext as any;
assert.equal(context.packageId,DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID);
assert.deepEqual(context.noveltyMix.actualCounts,{STANDARD:15,FRESH_FAMILIAR:4,HIGHER_NOVELTY:1});
assert(result.questions.every((q:any)=>q.noveltyMixAuthority==="DI-DELIVERY-NOVELTY-MIX-V1"));
assert(result.questions.every((q:any)=>q.questionBankWritable===false));
assert(result.questions.every((q:any)=>q.testEligible===false));
assert(result.questions.every((q:any)=>q.publiclyPublishable===false));

console.log("DI_DELIVERY_NOVELTY_MIX_SHARED_ADAPTER_V1",JSON.stringify({
  packageDiscovered:true,
  questions:result.questions.length,
  mix:context.noveltyMix.actualCounts,
  lifecycleLocked:true,
}));
