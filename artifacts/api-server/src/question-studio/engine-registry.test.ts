import { strict as assert } from "node:assert";

import {
  getQuestionStudioEngine,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "./engine-registry";

const engines = listQuestionStudioEngines();
assert.deepEqual(engines, ["quant-v4"]);

const packages = listQuestionStudioPackages();
assert.equal(packages.length > 0, true);
assert.equal(
  packages.every((pkg) => pkg.engineId === "quant-v4"),
  true,
);
assert.equal(
  packages.every((pkg) => pkg.packageId.length > 0),
  true,
);
assert.equal(
  packages.every((pkg) => pkg.supportedLanguages.length > 0),
  true,
);

const firstPackage = packages[0]!;
assert.equal(
  resolveQuestionStudioEngine({ packageId: firstPackage.packageId }).engineId,
  "quant-v4",
);
assert.equal(
  resolveQuestionStudioEngine({ topic: "Arithmetic", subtopic: "Percentage" }).engineId,
  "quant-v4",
);
assert.equal(getQuestionStudioEngine("quant-v4").engineId, "quant-v4");

assert.throws(
  () => getQuestionStudioEngine("knowledge-v1"),
  /not registered/,
);
