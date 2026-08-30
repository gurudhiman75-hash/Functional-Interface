import { strict as assert } from "node:assert";

import {
  getQuestionStudioEngine,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "./engine-registry";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "./standard-lifecycle";

const engines = listQuestionStudioEngines();
assert.deepEqual(engines, ["quant-v4", "knowledge-v1"]);

const packages = listQuestionStudioPackages();
assert.equal(packages.length > 0, true);
assert.equal(packages.every((pkg) => pkg.packageId.length > 0), true);
assert.equal(packages.every((pkg) => pkg.supportedLanguages.length > 0), true);

const quantPackage = packages.find((pkg) => pkg.engineId === "quant-v4");
assert.ok(quantPackage);
assert.equal(resolveQuestionStudioEngine({ packageId: quantPackage.packageId }).engineId, "quant-v4");
assert.equal(resolveQuestionStudioEngine({ topic: "Arithmetic", subtopic: "Percentage" }).engineId, "quant-v4");
assert.equal(getQuestionStudioEngine("quant-v4").engineId, "quant-v4");

const com001 = packages.find((pkg) => pkg.packageId === "COM-001");
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
assert.ok(com001);
assert.equal(com001.engineId, "knowledge-v1");
assert.equal(com001.enabled, true);
assert.deepEqual(com001.cpIds, ["COM-001-CP-001"]);
assert.deepEqual(com001.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(com001.runtimeMode, "review-only");
assert.equal(com001.questionBankStatus, lifecycle.questionBankStatus);
assert.equal(com001.testEligibility, lifecycle.testEligibility);
assert.equal(com001.publiclyPublishable, false);
assert.equal(com001.metadata?.lifecycleId, lifecycle.lifecycleId);
assert.equal(com001.metadata?.stage, "BANK_ONLY");
assert.equal(com001.metadata?.questionBankWritable, true);
assert.equal(com001.metadata?.testEligible, false);
assert.equal(com001.metadata?.mockTestEligible, false);
assert.equal(com001.metadata?.productionReleaseAuthorized, false);
assert.equal(resolveQuestionStudioEngine({ packageId: "COM-001" }).engineId, "knowledge-v1");
assert.equal(getQuestionStudioEngine("knowledge-v1").engineId, "knowledge-v1");

assert.throws(() => getQuestionStudioEngine("language-v1"), /not registered/);
