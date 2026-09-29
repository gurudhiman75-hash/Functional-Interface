import assert from "node:assert/strict";
import { generateSeaCp001Caselet } from "./generation/caselet-assembler.ts";
import { SEA_001_BLUEPRINTS } from "./manifest.ts";
import { generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "./cp003/generator.ts";
import {
  buildCircularRelativeDescriptionExtensionV1,
  buildExtremeEndPairExtensionV1,
} from "./query-extensions-v1.ts";

const positions = new Map<number, number>([[0,0],[1,0],[2,0],[3,0]]);
let linearRecords = 0;
let circularRecords = 0;

for (const blueprint of SEA_001_BLUEPRINTS) {
  for (let seed = 0; seed < 30; seed += 1) {
    const caselet = generateSeaCp001Caselet({
      blueprintId: blueprint,
      seed: `SEA-EXT-LIN-${blueprint}-${seed}`,
    });
    const first = buildExtremeEndPairExtensionV1(caselet);
    const second = buildExtremeEndPairExtensionV1(caselet);
    assert.deepEqual(first, second);
    assert.equal(first.kind, "EXTREME_END_PAIR");
    assert.equal(first.reviewOnly, true);
    assert.equal(first.permanentQlAllocated, false);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], (first.answer as readonly string[]).join(" and "));
    positions.set(first.correctIndex, (positions.get(first.correctIndex) ?? 0) + 1);
    linearRecords += 1;
  }
}

for (const blueprint of SEA_CP003_BLUEPRINTS) {
  for (let seed = 0; seed < 30; seed += 1) {
    const caselet = generateCircularCaselet(
      `SEA-EXT-CIR-${blueprint}-${seed}`,
      blueprint,
    );
    const first = buildCircularRelativeDescriptionExtensionV1(caselet);
    const second = buildCircularRelativeDescriptionExtensionV1(caselet);
    assert.deepEqual(first, second);
    assert.equal(first.length, 2);
    for (const item of first) {
      assert.equal(item.reviewOnly, true);
      assert.equal(item.permanentQlAllocated, false);
      assert.equal(new Set(item.options).size, 4);
      const expected = Array.isArray(item.answer) ? item.answer.join(" and ") : String(item.answer);
      assert.equal(item.options[item.correctIndex], expected);
      positions.set(item.correctIndex, (positions.get(item.correctIndex) ?? 0) + 1);
      circularRecords += 1;
    }
    assert.equal(first[0]!.kind, "RELATIVE_POSITION_DESCRIPTION");
    assert.equal(first[1]!.kind, "DEFINITELY_TRUE_RELATION_STATEMENT");
  }
}

assert.equal(linearRecords, SEA_001_BLUEPRINTS.length * 30);
assert.equal(circularRecords, SEA_CP003_BLUEPRINTS.length * 30 * 2);
for (const index of [0,1,2,3]) {
  assert.ok((positions.get(index) ?? 0) > 0, `answer position ${index} was never reached`);
}

console.log(JSON.stringify({
  status: "PASS_SEA_001_QUERY_EXTENSION_V1",
  linearRecords,
  circularRecords,
  answerPositions: Object.fromEntries(positions),
  permanentQlAllocated: false,
  activationPermitted: false,
}, null, 2));
