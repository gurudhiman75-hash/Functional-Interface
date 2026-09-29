import assert from "node:assert/strict";
import { generateMixedFacingCaselet, SEA_CP002_BLUEPRINTS } from "./cp002/generator.ts";
import {
  buildMixedFacingCountExtensionV2,
  buildMixedFacingEndAndFacingExtensionV2,
} from "./query-extensions-v2.ts";

const positions = new Map<number, number>([[0,0],[1,0],[2,0],[3,0]]);
let countQueries = 0;
let endFacingQueries = 0;

for (const blueprint of SEA_CP002_BLUEPRINTS) {
  for (let seed = 0; seed < 40; seed += 1) {
    const caselet = generateMixedFacingCaselet(
      `SEA-FACING-EXT-${blueprint}-${seed}`,
      blueprint,
    );

    const countFirst = buildMixedFacingCountExtensionV2(caselet);
    const countSecond = buildMixedFacingCountExtensionV2(caselet);
    assert.deepEqual(countFirst, countSecond);
    assert.equal(countFirst.kind, "FACING_DIRECTION_COUNT");
    assert.equal(countFirst.answerType, "COUNT");
    assert.equal(countFirst.reviewOnly, true);
    assert.equal(countFirst.permanentQlAllocated, false);
    assert.equal(new Set(countFirst.options).size, 4);
    assert.equal(countFirst.options[countFirst.correctIndex], String(countFirst.answer));
    positions.set(countFirst.correctIndex, (positions.get(countFirst.correctIndex) ?? 0) + 1);
    countQueries += 1;

    const endFirst = buildMixedFacingEndAndFacingExtensionV2(caselet);
    const endSecond = buildMixedFacingEndAndFacingExtensionV2(caselet);
    assert.deepEqual(endFirst, endSecond);
    assert.equal(endFirst.kind, "END_PERSON_AND_FACING");
    assert.equal(endFirst.answerType, "RELATION");
    assert.equal(endFirst.reviewOnly, true);
    assert.equal(endFirst.permanentQlAllocated, false);
    assert.equal(new Set(endFirst.options).size, 4);
    assert.equal(endFirst.options[endFirst.correctIndex], String(endFirst.answer));
    positions.set(endFirst.correctIndex, (positions.get(endFirst.correctIndex) ?? 0) + 1);
    endFacingQueries += 1;
  }
}

assert.equal(countQueries, SEA_CP002_BLUEPRINTS.length * 40);
assert.equal(endFacingQueries, SEA_CP002_BLUEPRINTS.length * 40);
for (const index of [0,1,2,3]) {
  assert.ok((positions.get(index) ?? 0) > 0, `answer position ${index} was never reached`);
}

console.log(JSON.stringify({
  status: "PASS_SEA_001_QUERY_EXTENSION_V2",
  countQueries,
  endFacingQueries,
  answerPositions: Object.fromEntries(positions),
  permanentQlAllocated: false,
  activationPermitted: false,
}, null, 2));
