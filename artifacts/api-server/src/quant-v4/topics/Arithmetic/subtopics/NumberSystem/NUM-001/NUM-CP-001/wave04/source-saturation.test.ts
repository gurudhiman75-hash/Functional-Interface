import assert from "node:assert/strict";
import { NUM_CP001_WAVE01_PROTOTYPE_IDS } from "../wave01/types";
import { NUM_CP001_WAVE02_PROTOTYPE_IDS } from "../wave02/types";
import { NUM_CP001_WAVE03_PROTOTYPE_IDS } from "../wave03/types";
import { NUM_CP001_WAVE04_PROTOTYPE_IDS } from "./types";
import {
  NUM_CP001_SOURCE_DISPOSITIONS,
  NUM_CP001_SOURCE_SATURATION_STATUS,
} from "./source-saturation-registry";

const discovered = [
  ...NUM_CP001_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP001_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP001_WAVE03_PROTOTYPE_IDS,
  ...NUM_CP001_WAVE04_PROTOTYPE_IDS,
];

assert.equal(discovered.length, 26);
assert.equal(new Set(discovered).size, 26);

const executableRows = NUM_CP001_SOURCE_DISPOSITIONS.filter(
  (row) => row.status === "COVERED_BY_EXECUTABLE_PROTOTYPE",
);
const executablePrototypeCoverage = new Set(executableRows.flatMap((row) => row.prototypeIds));
for (const prototypeId of discovered) {
  assert.ok(
    executablePrototypeCoverage.has(prototypeId),
    `${prototypeId} is missing from executable source coverage`,
  );
}

assert.ok(NUM_CP001_SOURCE_DISPOSITIONS.every((row) => row.family.length > 8));
assert.ok(NUM_CP001_SOURCE_DISPOSITIONS.every((row) => row.owner.length > 2));
assert.ok(NUM_CP001_SOURCE_DISPOSITIONS.every((row) => row.rationale.length > 20));
assert.ok(NUM_CP001_SOURCE_DISPOSITIONS.every((row) => !row.status.includes("OPEN")));

const representationRows = NUM_CP001_SOURCE_DISPOSITIONS.filter(
  (row) => row.status === "MERGE_AS_REPRESENTATION",
);
assert.ok(representationRows.some((row) => row.family === "number-line ordering rendering"));
assert.ok(representationRows.some((row) => row.family === "number-line distance rendering"));
assert.ok(representationRows.some((row) => row.family === "small exact-value table rendering"));
assert.ok(representationRows.some((row) => row.family === "interval notation rendering"));
assert.ok(representationRows.some((row) => row.family === "legacy NS-CLASS-001"));
assert.ok(representationRows.some((row) => row.family === "legacy NS-NLINE-001"));

const reassignments = NUM_CP001_SOURCE_DISPOSITIONS.filter(
  (row) => row.status === "REASSIGNED_TO_OTHER_OWNER",
);
assert.deepEqual(
  [...new Set(reassignments.map((row) => row.owner))].sort(),
  ["ALGEBRA", "NUM-CP-002", "NUM-CP-004", "NUMBER_SERIES", "P_AND_C"],
);

assert.ok(NUM_CP001_SOURCE_DISPOSITIONS.some(
  (row) => row.status === "ADVANCED_ENRICHMENT_HOLD",
));

assert.deepEqual(NUM_CP001_SOURCE_SATURATION_STATUS, {
  discoveredPrototypeCount: 26,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-124",
  routineSourceGapCount: 0,
  legacyTraceCount: 2,
  representationMergeCount: 6,
  reassignedFamilyCount: 5,
  advancedHoldCount: 1,
  waveStatus: "SOURCE_SATURATED_AWAITING_MERGE_SPLIT_AUDIT",
});

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE04_SOURCE_SATURATION",
  discoveredPrototypeCount: discovered.length,
  sourceDispositionCount: NUM_CP001_SOURCE_DISPOSITIONS.length,
  executableFamilyCount: executableRows.length,
  representationMergeCount: representationRows.length,
  reassignedFamilyCount: reassignments.length,
  advancedHoldCount: NUM_CP001_SOURCE_SATURATION_STATUS.advancedHoldCount,
  routineSourceGapCount: NUM_CP001_SOURCE_SATURATION_STATUS.routineSourceGapCount,
  permanentQlCount: NUM_CP001_SOURCE_SATURATION_STATUS.permanentQlCount,
  nextAvailableQl: NUM_CP001_SOURCE_SATURATION_STATUS.nextAvailableQl,
  waveStatus: NUM_CP001_SOURCE_SATURATION_STATUS.waveStatus,
}, null, 2));