import assert from "node:assert/strict";
import { MEN_CP_007_PROTOTYPES } from "../../foundation/prototype-registry";
import { MEN_CP_007_WAVE_01_PROTOTYPES } from "../../gap-wave-01/registry";
import { MEN_CP_007_WAVE_02_PROTOTYPES } from "../../gap-wave-02/registry";
import { MEN_CP_007_WAVE_03_PROTOTYPES } from "../../gap-wave-03/registry";
import { MEN_CP_007_WAVE_04_PROTOTYPES } from "../../source-gap-wave-04/registry";
import {
  getMenCp007FrozenQl,
  MEN_CP_007_FROZEN_QLS,
  MEN_CP_007_REASSIGNMENTS,
} from "./registry";

const allPrototypeIds = [
  ...MEN_CP_007_PROTOTYPES.map((item) => item.prototypeId),
  ...MEN_CP_007_WAVE_01_PROTOTYPES.map((item) => item.prototypeId),
  ...MEN_CP_007_WAVE_02_PROTOTYPES.map((item) => item.prototypeId),
  ...MEN_CP_007_WAVE_03_PROTOTYPES.map((item) => item.prototypeId),
  ...MEN_CP_007_WAVE_04_PROTOTYPES.map((item) => item.prototypeId),
];

assert.equal(allPrototypeIds.length, 67, "CP-007 discovery must contain exactly the proven 67 temporary contracts.");
assert.equal(new Set(allPrototypeIds).size, 67, "Every temporary prototype identity must be unique.");
assert.equal(MEN_CP_007_FROZEN_QLS.length, 43, "Final compression must expose 43 need-based learner contracts.");
assert.equal(MEN_CP_007_REASSIGNMENTS.length, 4, "Four source contracts belong to later solid-mensuration CPs.");

const expectedQlIds = Array.from(
  { length: 43 },
  (_value, index) => `MEN-002-QL-${String(index + 1).padStart(3, "0")}`,
);
assert.deepEqual(MEN_CP_007_FROZEN_QLS.map((item) => item.qlId), expectedQlIds);
assert.equal(new Set(MEN_CP_007_FROZEN_QLS.map((item) => item.qlId)).size, 43);
assert.equal(new Set(MEN_CP_007_FROZEN_QLS.map((item) => item.templateId)).size, 43);
assert.equal(new Set(MEN_CP_007_FROZEN_QLS.map((item) => item.canonicalSolveMode)).size, 43);

for (const ql of MEN_CP_007_FROZEN_QLS) {
  assert.equal(getMenCp007FrozenQl(ql.qlId), ql);
  assert.ok(ql.title.length >= 12, `${ql.qlId} requires a clear learner-contract title.`);
  assert.ok(ql.mergeRule.length >= 12, `${ql.qlId} requires an explicit merge/split reason.`);
  assert.ok(ql.prototypeIds.length >= 1, `${ql.qlId} must preserve at least one executable ancestry.`);
}

const ownedPrototypeIds = MEN_CP_007_FROZEN_QLS.flatMap((item) => item.prototypeIds);
const reassignedPrototypeIds = MEN_CP_007_REASSIGNMENTS.map((item) => item.prototypeId);
assert.equal(ownedPrototypeIds.length, 63, "Exactly 63 prototypes remain owned by CP-007.");
assert.equal(new Set(ownedPrototypeIds).size, 63, "No prototype may map to more than one frozen CP-007 QL.");
assert.equal(new Set(reassignedPrototypeIds).size, 4, "No reassignment may be duplicated.");

const finalDispositionIds = [...ownedPrototypeIds, ...reassignedPrototypeIds];
assert.equal(finalDispositionIds.length, 67);
assert.equal(new Set(finalDispositionIds).size, 67, "Every prototype must receive exactly one final disposition.");
assert.deepEqual([...finalDispositionIds].sort(), [...allPrototypeIds].sort());

assert.equal(
  MEN_CP_007_REASSIGNMENTS.filter((item) => item.targetCanonicalProblemId === "MEN-CP-011").length,
  3,
  "Three open/thick/exposed surface contracts must move to CP-011.",
);
assert.equal(
  MEN_CP_007_REASSIGNMENTS.filter((item) => item.targetCanonicalProblemId === "MEN-CP-013").length,
  1,
  "The L-shaped composite-prism contract must move to CP-013.",
);

const targets = new Set(MEN_CP_007_FROZEN_QLS.map((item) => item.target));
for (const requiredTarget of ["VOLUME", "SURFACE_AREA", "LENGTH", "DIAGONAL", "RATIO", "PERCENT_CHANGE", "COUNT", "COST", "RATE"]) {
  assert.equal(targets.has(requiredTarget), true, `${requiredTarget} must remain represented after compression.`);
}

const multiPrototypeFamilies = MEN_CP_007_FROZEN_QLS.filter((item) => item.prototypeIds.length > 1);
assert.equal(multiPrototypeFamilies.length, 15, "Fifteen QL families must carry proven parameter or representation merges.");
assert.equal(
  multiPrototypeFamilies.reduce((total, item) => total + item.prototypeIds.length, 0),
  35,
  "Merged families must account for 35 prototype ancestries.",
);

console.log(
  "MEN-CP-007 final compression passed: 67 temporary contracts -> 43 frozen QL/solve-mode families + 4 explicit reassignments. " +
  "All prototype ancestry is unique, contiguous and publication-neutral.",
);
