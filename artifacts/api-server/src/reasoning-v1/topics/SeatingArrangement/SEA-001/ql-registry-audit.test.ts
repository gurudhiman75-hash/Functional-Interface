import assert from "node:assert/strict";
import { SEA_001_BLUEPRINTS } from "./manifest.ts";
import { generateSeaCp001Caselet } from "./generation/caselet-assembler.ts";
import { SEA_CP002_BLUEPRINTS, generateMixedFacingCaselet } from "./cp002/generator.ts";
import { SEA_CP003_BLUEPRINTS, generateCircularCaselet } from "./cp003/generator.ts";
import { SEA_CP004_BLUEPRINTS, generateOutwardCaselet } from "./cp004/generator.ts";
import { SEA_CP005_BLUEPRINTS, generateMixedCircleCaselet } from "./cp005/generator.ts";
import {
  buildCircularRelativeDescriptionExtensionV1,
  buildExtremeEndPairExtensionV1,
} from "./query-extensions-v1.ts";
import {
  buildMixedFacingCountExtensionV2,
  buildMixedFacingEndAndFacingExtensionV2,
} from "./query-extensions-v2.ts";
import {
  SEA_001_QLS,
  SEA_001_QL_REGISTRY,
  sea001DeliveryRoleForRuntimeQuery,
  sea001QlForReviewExtension,
  sea001QlForRuntimeQuery,
} from "./ql-registry.ts";

assert.equal(SEA_001_QLS.length, 9);
assert.equal(SEA_001_QL_REGISTRY.permanentQlCount, 9);
assert.equal(SEA_001_QL_REGISTRY.permanentQlRange, "SEA-QL-001..SEA-QL-009");
assert.equal(SEA_001_QL_REGISTRY.activationPermitted, false);

const observed = new Set<string>();
let runtimeQuestions = 0;

function checkChildren(children: readonly { queryContractId: string }[]) {
  for (const child of children) {
    const qlId = sea001QlForRuntimeQuery(child.queryContractId);
    assert.ok(/^SEA-QL-00[1-9]$/.test(qlId));
    observed.add(qlId);
    runtimeQuestions += 1;
    if (child.queryContractId === "SEA-QC-022") {
      assert.equal(sea001DeliveryRoleForRuntimeQuery(child.queryContractId), "PRACTICE_VARIANT_WITHIN_QL");
      assert.equal(qlId, "SEA-QL-002");
    } else {
      assert.equal(sea001DeliveryRoleForRuntimeQuery(child.queryContractId), "MOCK_AUTHENTIC_BASELINE");
    }
  }
}

for (const blueprint of SEA_001_BLUEPRINTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    checkChildren(generateSeaCp001Caselet({ blueprintId: blueprint, seed: `QLMAP-CP1-${blueprint}-${seed}` }).children);
  }
}
for (const blueprint of SEA_CP002_BLUEPRINTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    checkChildren(generateMixedFacingCaselet(`QLMAP-CP2-${blueprint}-${seed}`, blueprint).children);
  }
}
for (const blueprint of SEA_CP003_BLUEPRINTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    const caselet = generateCircularCaselet(`QLMAP-CP3-${blueprint}-${seed}`, blueprint);
    checkChildren(caselet.children);
    for (const ext of buildCircularRelativeDescriptionExtensionV1(caselet)) {
      observed.add(sea001QlForReviewExtension(ext.kind));
    }
  }
}
for (const blueprint of SEA_CP004_BLUEPRINTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    checkChildren(generateOutwardCaselet(`QLMAP-CP4-${blueprint}-${seed}`, blueprint).children);
  }
}
for (const blueprint of SEA_CP005_BLUEPRINTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    checkChildren(generateMixedCircleCaselet(`QLMAP-CP5-${blueprint}-${seed}`, blueprint).children);
  }
}

const linear = generateSeaCp001Caselet({ blueprintId: SEA_001_BLUEPRINTS[0]!, seed: "QLMAP-EXT-LINEAR" });
observed.add(sea001QlForReviewExtension(buildExtremeEndPairExtensionV1(linear).kind));

const mixed = generateMixedFacingCaselet("QLMAP-EXT-FACING", SEA_CP002_BLUEPRINTS[0]!);
observed.add(sea001QlForReviewExtension(buildMixedFacingCountExtensionV2(mixed).kind));
observed.add(sea001QlForReviewExtension(buildMixedFacingEndAndFacingExtensionV2(mixed).kind));

assert.deepEqual([...observed].sort(), SEA_001_QLS.map((entry) => entry.qlId).sort());

for (const unused of SEA_001_QL_REGISTRY.planningOnlyQueryIdsNotAllocated) {
  assert.throws(() => sea001QlForRuntimeQuery(unused), /No permanent SEA-001 QL owns/);
}

console.log(JSON.stringify({
  status: "PASS_SEA_001_PERMANENT_QL_MAPPING_V1",
  permanentQlCount: SEA_001_QLS.length,
  runtimeQuestions,
  observedQlIds: [...observed].sort(),
  activationPermitted: false,
}, null, 2));
