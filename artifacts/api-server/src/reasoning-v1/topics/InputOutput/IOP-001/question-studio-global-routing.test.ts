import assert from "node:assert/strict";
import { generateQuestion, listQuantV4Packages } from "../../../quant-v4/generation-engine.ts";

const packages = listQuantV4Packages();
const iopPackages = packages.filter((entry) => entry.packageId === "IOP-001");
assert.equal(iopPackages.length, 1, "Question Studio package registry must expose IOP-001 exactly once");
const iop = iopPackages[0]! as any;
assert.deepEqual(iop.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(iop.enabled, true);
assert.equal(iop.questionBankStatus, "NOT_STORED");
assert.equal(iop.testEligibility, "INELIGIBLE");
assert.equal(iop.publiclyPublishable, false);

const routed = await generateQuestion({
  packageId: "IOP-001",
  canonicalProblemId: "IOP-QL-002",
  language: "hi",
  seed: "IOP-GLOBAL-ROUTING-SMOKE",
  count: 3,
} as any) as any;

assert.equal(routed.generationContext.packageId, "IOP-001");
assert.equal(routed.generationContext.chapterId, "REAS-INP");
assert.equal(routed.generationContext.language, "hi");
assert.equal(routed.generationContext.questionStudioDiscoverable, true);
assert.equal(routed.generationContext.questionStudioGeneratable, true);
assert.equal(routed.generationContext.persistenceAllowed, false);
assert.equal(routed.generationContext.questionBankWritable, false);
assert.equal(routed.generationContext.testEligible, false);
assert.equal(routed.generationContext.publiclyPublishable, false);
assert.equal(routed.questions.length, 3);
for (const question of routed.questions) {
  assert.equal(question.packageId, "IOP-001");
  assert.equal(question.qlId, "IOP-QL-002");
  assert.equal(question.language, "hi");
  assert.match(question.stem, /[\u0900-\u097F]/);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
}

console.log("PASS_IOP_001_QUESTION_STUDIO_GLOBAL_ROUTING");
console.log(`registry package count ${iopPackages.length}`);
console.log(`routed questions ${routed.questions.length}`);
console.log("Question Studio true");
console.log("persistence false");
console.log("Question Bank false");
console.log("test eligible false");
console.log("publicly publishable false");
