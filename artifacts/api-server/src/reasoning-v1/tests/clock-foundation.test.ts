import assert from "node:assert/strict";
import {
  addClockSecondsExact,
  clockTimeToHandAnglesByCycleExact,
  clockTimeToHandAnglesExact,
  clockTimeToHandAnglesNumbers,
  clockTimeToTotalSecondsExact,
  compareRationals,
  exactClockHandAnglesEqual,
  exactRational,
  hourMinuteAngleSnapshotExact,
  moduloRational,
  rationalToFractionString,
  rationalsEqual,
  totalSecondsToClockTimeExact,
  validateClockKinematicsCrossCheck,
  type ExactRationalInput,
} from "../foundation/temporal";
import {
  clockTimeToHandAngles as spatialClockTimeToHandAngles,
  validateMirrorClockCrossCheck,
} from "../foundation/spatial";

function assertRational(
  actual: ExactRationalInput,
  expectedNumerator: bigint | number,
  expectedDenominator: bigint | number = 1,
): void {
  const expected = exactRational(expectedNumerator, expectedDenominator);
  assert.equal(
    rationalsEqual(actual, expected),
    true,
    `Expected ${rationalToFractionString(expected)}, received ${rationalToFractionString(actual)}`,
  );
}

assertRational(exactRational(6, -8), -3, 4);
assertRational(moduloRational(-1, 360), 359);
assert.throws(() => exactRational(1, 0), /denominator/i);

const tenFifteen = hourMinuteAngleSnapshotExact({ hour: 10, minute: 15 });
assertRational(tenFifteen.handAngles.hourAngleDeg, 615, 2);
assertRational(tenFifteen.handAngles.minuteAngleDeg, 90);
assertRational(tenFifteen.smallerAngleDeg, 285, 2);
assertRational(tenFifteen.reflexAngleDeg, 435, 2);

const threeThirty = hourMinuteAngleSnapshotExact({ hour: 3, minute: 30 });
assertRational(threeThirty.smallerAngleDeg, 75);

const threeOClock = hourMinuteAngleSnapshotExact({ hour: 3, minute: 0 });
assertRational(threeOClock.clockwiseMinuteFromHourDeg, 270);
assertRational(threeOClock.clockwiseHourFromMinuteDeg, 90);
assertRational(threeOClock.smallerAngleDeg, 90);
assertRational(threeOClock.reflexAngleDeg, 270);

const coincidence = hourMinuteAngleSnapshotExact({ hour: 12, minute: 0 });
assertRational(coincidence.smallerAngleDeg, 0);
assertRational(coincidence.reflexAngleDeg, 0);

const withSeconds = clockTimeToHandAnglesExact({
  hour: 12,
  minute: 0,
  second: 30,
});
assertRational(withSeconds.hourAngleDeg, 1, 4);
assertRational(withSeconds.minuteAngleDeg, 3);
assertRational(withSeconds.secondAngleDeg, 180);

const fractionalSecondCheck = validateClockKinematicsCrossCheck({
  hour: 5,
  minute: 17,
  second: exactRational(3, 11),
});
assert.equal(fractionalSecondCheck.ok, true);

const rolledForward = addClockSecondsExact(
  { hour: 11, minute: 59, second: 30 },
  90,
);
assert.equal(rolledForward.hour, 12);
assert.equal(rolledForward.minute, 1);
assertRational(rolledForward.second, 0);

const oneSecondBeforeTwelve = totalSecondsToClockTimeExact(-1);
assert.equal(oneSecondBeforeTwelve.hour, 11);
assert.equal(oneSecondBeforeTwelve.minute, 59);
assertRational(oneSecondBeforeTwelve.second, 59);

assert.throws(
  () => clockTimeToHandAnglesExact({ hour: 0, minute: 0 }),
  /hour/i,
);
assert.throws(
  () => clockTimeToHandAnglesExact({ hour: 12, minute: 60 }),
  /minute/i,
);
assert.throws(
  () => clockTimeToHandAnglesExact({ hour: 12, minute: 0, second: 60 }),
  /second/i,
);

let exactSecondChecks = 0;
for (let elapsedSecond = 0; elapsedSecond < 43_200; elapsedSecond += 1) {
  const time = totalSecondsToClockTimeExact(elapsedSecond);
  const direct = clockTimeToHandAnglesExact(time);
  const cycleDerived = clockTimeToHandAnglesByCycleExact(time);
  assert.equal(exactClockHandAnglesEqual(direct, cycleDerived), true);
  assert.equal(
    rationalsEqual(clockTimeToTotalSecondsExact(time), elapsedSecond),
    true,
  );

  const snapshot = hourMinuteAngleSnapshotExact(time);
  assert(compareRationals(snapshot.smallerAngleDeg, 0) >= 0);
  assert(compareRationals(snapshot.smallerAngleDeg, 180) <= 0);
  if (rationalsEqual(snapshot.smallerAngleDeg, 0)) {
    assertRational(snapshot.reflexAngleDeg, 0);
  } else {
    assert(compareRationals(snapshot.reflexAngleDeg, 180) >= 0);
    assert(compareRationals(snapshot.reflexAngleDeg, 360) < 0);
  }
  exactSecondChecks += 1;
}

let spatialMinuteChecks = 0;
let mirrorMinuteChecks = 0;
for (let totalMinute = 0; totalMinute < 720; totalMinute += 1) {
  const hourIndex = Math.floor(totalMinute / 60);
  const time = {
    hour: hourIndex === 0 ? 12 : hourIndex,
    minute: totalMinute % 60,
  };
  const exactNumbers = clockTimeToHandAnglesNumbers(time);
  const spatialAngles = spatialClockTimeToHandAngles(time);
  assert.equal(spatialAngles.hourAngleDeg, exactNumbers.hourAngleDeg);
  assert.equal(spatialAngles.minuteAngleDeg, exactNumbers.minuteAngleDeg);
  assert.equal(validateMirrorClockCrossCheck(time).ok, true);
  spatialMinuteChecks += 1;
  mirrorMinuteChecks += 1;
}

console.log(
  JSON.stringify(
    {
      status: "PASS_CLK_001_EXACT_KINEMATICS_FOUNDATION",
      checks: {
        exactRationalNormalization: true,
        exactKnownAngleCases: true,
        fractionalSecondSupport: true,
        twelveHourWraparound: true,
        directVsCycleSecondGrid: exactSecondChecks,
        exactTimeRoundTripSecondGrid: exactSecondChecks,
        sharedSpatialAdapterMinuteGrid: spatialMinuteChecks,
        mirrorRegressionMinuteGrid: mirrorMinuteChecks,
        continuousHourHand: true,
        smallerAndReflexContracts: true,
      },
      lifecycle: {
        permanentQlCount: 0,
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      },
    },
    null,
    2,
  ),
);
