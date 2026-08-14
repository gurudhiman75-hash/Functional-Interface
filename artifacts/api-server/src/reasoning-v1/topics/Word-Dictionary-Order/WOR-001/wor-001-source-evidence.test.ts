import assert from "node:assert/strict";
import { WOR_001_PROTOTYPES } from "./prototype-registry";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";

const validStatuses = new Set(["PYQ_SUPPORTED", "PLATFORM_SUPPORTED", "EXPLORATORY_SOURCE_GAP"]);
assert.equal(WOR_001_PROTOTYPES.length, 19);
assert.ok(WOR_001_PROTOTYPES.every((prototype) => validStatuses.has(prototype.sourceEvidenceStatus)));

const cp003 = WOR_001_PROTOTYPES.filter((prototype) => prototype.checkpointId === "WOR-CP-003");
assert.equal(cp003.length, 6);
assert.ok(cp003.every((prototype) => prototype.sourceEvidenceStatus === "EXPLORATORY_SOURCE_GAP"));

const directPyq = WOR_001_PROTOTYPES.filter((prototype) => prototype.sourceEvidenceStatus === "PYQ_SUPPORTED");
assert.ok(directPyq.some((prototype) => prototype.taskKind === "SELECT_COMPLETE_ORDER"));
assert.ok(directPyq.some((prototype) => prototype.taskKind === "SELECT_FIRST"));
assert.ok(directPyq.some((prototype) => prototype.taskKind === "SELECT_LAST"));
assert.ok(directPyq.some((prototype) => prototype.taskKind === "SELECT_KTH"));

const sourceGaps = WOR_001_PROTOTYPES.filter((prototype) => prototype.sourceEvidenceStatus === "EXPLORATORY_SOURCE_GAP");
assert.ok(sourceGaps.length > 0, "Source gaps were unexpectedly erased; rerun the source audit before freeze.");

// Until source gaps and editorial gates are resolved, WOR-001 must remain review-only.
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.permanentQlCount, 0);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.questionStudioVisible, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.publicReleaseEnabled, false);

console.log("WOR-001 source-evidence governance audit passed.", {
  directPyq: directPyq.map((prototype) => prototype.prototypeId),
  sourceGaps: sourceGaps.map((prototype) => prototype.prototypeId),
});
