import assert from "node:assert/strict";
import { generateNumCp001Wave01Package } from "../wave01/runtime";
import { generateNumCp001Wave02 } from "../wave02/runtime";
import { generateNumCp001Wave03 } from "../wave03/runtime";

const SEEDS = 60;
let numberLineOrderChecks = 0;
let numberLineDistanceChecks = 0;
let inverseDistanceChecks = 0;
let intervalNotationChecks = 0;
let exactTableChecks = 0;

for (let seed = 1; seed <= SEEDS; seed += 1) {
  const order = generateNumCp001Wave01Package("NUM-CP001-PROT-003", seed);
  const orderState = order.hiddenState as { shown: number[] };
  const numberLineOrder = [...orderState.shown].sort((a, b) => a - b).join(" < ");
  assert.equal(numberLineOrder, order.canonicalAnswer);
  assert.equal(order.canonicalAnswer, order.verifierAnswer);
  numberLineOrderChecks += 1;

  const distance = generateNumCp001Wave01Package("NUM-CP001-PROT-004", seed);
  const distanceState = distance.hiddenState as { first: number; second: number };
  const plottedDistance = Math.abs(distanceState.second - distanceState.first);
  assert.equal(String(plottedDistance), distance.canonicalAnswer);
  assert.equal(distance.canonicalAnswer, distance.verifierAnswer);
  numberLineDistanceChecks += 1;

  const inverse = generateNumCp001Wave02("NUM-CP001-PROT-014", seed);
  const inverseState = inverse.hiddenState as { centre: number; dist: number; a: number; b: number };
  const plottedPair = [inverseState.centre - inverseState.dist, inverseState.centre + inverseState.dist];
  assert.deepEqual(plottedPair, [inverseState.a, inverseState.b]);
  assert.equal(`(${plottedPair.join(", ")})`, inverse.canonicalAnswer);
  assert.equal(inverse.canonicalAnswer, inverse.verifierAnswer);
  inverseDistanceChecks += 1;

  const interval = generateNumCp001Wave01Package("NUM-CP001-PROT-005", seed);
  const intervalState = interval.hiddenState as {
    lower: number;
    upper: number;
    includeLower: boolean;
    includeUpper: boolean;
  };
  const intervalMembers = Array.from(
    { length: intervalState.upper - intervalState.lower + 1 },
    (_, i) => intervalState.lower + i,
  ).filter((value) =>
    (intervalState.includeLower || value !== intervalState.lower)
    && (intervalState.includeUpper || value !== intervalState.upper));
  assert.equal(String(intervalMembers.length), interval.canonicalAnswer);
  assert.equal(interval.canonicalAnswer, interval.verifierAnswer);
  intervalNotationChecks += 1;

  const table = generateNumCp001Wave03("NUM-CP001-PROT-018", seed);
  const tableState = table.hiddenState as {
    assigned: Array<{ label: string; num: number }>;
  };
  const tableOrder = [...tableState.assigned]
    .sort((a, b) => a.num - b.num)
    .map((row) => row.label)
    .join(" < ");
  assert.equal(tableOrder, table.canonicalAnswer);
  assert.equal(table.canonicalAnswer, table.verifierAnswer);
  exactTableChecks += 1;
}

assert.equal(numberLineOrderChecks, SEEDS);
assert.equal(numberLineDistanceChecks, SEEDS);
assert.equal(inverseDistanceChecks, SEEDS);
assert.equal(intervalNotationChecks, SEEDS);
assert.equal(exactTableChecks, SEEDS);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE04_REPRESENTATION_EQUIVALENCE",
  seedsPerAdapter: SEEDS,
  totalChecks: numberLineOrderChecks + numberLineDistanceChecks + inverseDistanceChecks + intervalNotationChecks + exactTableChecks,
  numberLineOrderChecks,
  numberLineDistanceChecks,
  inverseDistanceChecks,
  intervalNotationChecks,
  exactTableChecks,
  newPrototypeIdsCreatedForRepresentations: 0,
}, null, 2));