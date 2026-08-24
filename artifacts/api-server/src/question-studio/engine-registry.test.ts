import { strict as assert } from "node:assert";

import {
  getQuestionStudioEngine,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "./engine-registry";

const engines = listQuestionStudioEngines();
assert.deepEqual(engines, ["quant-v4", "knowledge-v1"]);

const packages = listQuestionStudioPackages();
assert.equal(packages.length > 0, true);
assert.equal(
  packages.every((pkg) => pkg.packageId.length > 0),
  true,
);
assert.equal(
  packages.every((pkg) => pkg.supportedLanguages.length > 0),
  true,
);

const quantPackage = packages.find((pkg) => pkg.engineId === "quant-v4");
assert.ok(quantPackage);
assert.equal(
  resolveQuestionStudioEngine({ packageId: quantPackage.packageId }).engineId,
  "quant-v4",
);
assert.equal(
  resolveQuestionStudioEngine({ topic: "Arithmetic", subtopic: "Percentage" }).engineId,
  "quant-v4",
);
assert.equal(getQuestionStudioEngine("quant-v4").engineId, "quant-v4");

const com001 = packages.find((pkg) => pkg.packageId === "COM-001");
assert.ok(com001);
assert.equal(com001.engineId, "knowledge-v1");
assert.equal(com001.enabled, true);
assert.deepEqual(com001.cpIds, ["COM-001-CP-001"]);
assert.deepEqual(com001.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(com001.runtimeMode, "review-only");
assert.equal(com001.questionBankStatus, "NOT_STORED");
assert.equal(com001.testEligibility, "INELIGIBLE_REVIEW_ONLY");
assert.equal(com001.publiclyPublishable, false);
assert.equal(resolveQuestionStudioEngine({ packageId: "COM-001" }).engineId, "knowledge-v1");
assert.equal(getQuestionStudioEngine("knowledge-v1").engineId, "knowledge-v1");

assert.throws(
  () => getQuestionStudioEngine("language-v1"),
  /not registered/,
);
