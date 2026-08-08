import assert from "node:assert/strict";
import {
  CLOCK_CHECKPOINTS,
  CLOCK_DESIGN_AUTHORITY,
  CLOCK_OWNERSHIP_BOUNDARY,
  actualIntervalBetweenDisplayedCoincidences,
  actualTimeFromDisplayed,
  actualTimeOfDisplayedEvent,
  angleOnFaultyClockAtActualTime,
  anglesAtAbsoluteSeconds,
  assertClockLifecycleLocked,
  classifyHourMinuteRelation,
  createFaultyClockModel,
  displayedTimeFromActual,
  durationForHandMovement,
  durationForStrikes,
  gapFromStrikeDuration,
  handMovementDegrees,
  handTipDistance,
  hourMinuteAngle,
  inferClockRateFromActualDisplayedEventInterval,
  mirrorTimeSeconds,
  nextCorrectActualTimeOnTwelveHourDial,
  nthSpecialEventAfter,
  readClockDiagramFromAngles,
  revolutionsForHand,
  solveHandInterchange,
  specialEventRoots,
  strikeTimeline,
  totalHourlyStrikesInTwelveHours,
  totalHourlyStrikesInclusive,
  transferStrikeDuration,
  verifyEventSolvers,
  verifyMirrorTimeGeometry,
} from "../topics/Clocks/CLK-001/runtime";
import {
  addRationals,
  compareRationals,
  divideRationals,
  exactRational,
  rationalsEqual,
  rationalToFractionString,
} from "../foundation/temporal";

assert.equal(CLOCK_DESIGN_AUTHORITY.file, "CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md");
assert.equal(CLOCK_CHECKPOINTS.length, 14);
assert.deepEqual(CLOCK_CHECKPOINTS.map((cp) => cp.id), Array.from({ length: 14 }, (_, index) => `CLK-CP-${String(index + 1).padStart(3, "0")}`));
assert.equal(CLOCK_OWNERSHIP_BOUNDARY.numericMirrorTime, "CLK-001");
assert.equal(CLOCK_OWNERSHIP_BOUNDARY.verticalReflectionDiagramSelection, "MIR-001");
assert.equal(CLOCK_OWNERSHIP_BOUNDARY.numericWaterImageTime, "EXCLUDED_CONTINUOUS_CLOCK_MODEL");
assertClockLifecycleLocked();

assert(rationalsEqual(handMovementDegrees("HOUR", 3_600), 30));
assert(rationalsEqual(handMovementDegrees("MINUTE", 60), 6));
assert(rationalsEqual(handMovementDegrees("SECOND", 10), 60));
assert(rationalsEqual(durationForHandMovement("MINUTE", 180), 1_800));
assert(rationalsEqual(revolutionsForHand("SECOND", 180), 3));
assert(rationalsEqual(handTipDistance(7, 180).coefficientOfPi, 7));

const atThreeThirty = anglesAtAbsoluteSeconds(3 * 3_600 + 30 * 60);
assert(rationalsEqual(atThreeThirty.hour, 105));
assert(rationalsEqual(atThreeThirty.minute, 180));
assert(rationalsEqual(hourMinuteAngle(3 * 3_600 + 30 * 60, "SMALLER"), 75));
assert(rationalsEqual(hourMinuteAngle(3 * 3_600 + 30 * 60, "REFLEX"), 285));
assert.equal(classifyHourMinuteRelation(3 * 3_600), "RIGHT");
assert(rationalsEqual(hourMinuteAngle(15, "SMALLER"), exactRational(11, 8)));

const halfOpenTwelveHours = {
  startSeconds: exactRational(0),
  endSeconds: exactRational(43_200),
  includeStart: true,
  includeEnd: false,
} as const;
for (const target of [0, 30, 60, 90, 120, 150, 180]) {
  assert.equal(verifyEventSolvers(target, halfOpenTwelveHours).agreement, true);
}
assert.equal(specialEventRoots("COINCIDENCE", halfOpenTwelveHours).length, 11);
assert.equal(specialEventRoots("OPPOSITION", halfOpenTwelveHours).length, 11);
assert.equal(specialEventRoots("RIGHT_ANGLE", halfOpenTwelveHours).length, 22);
assert.equal(specialEventRoots("STRAIGHT_LINE", halfOpenTwelveHours).length, 22);
const firstCoincidenceAfterTwelve = nthSpecialEventAfter("COINCIDENCE", 0, 1);
assert(rationalsEqual(firstCoincidenceAfterTwelve.seconds, divideRationals(43_200, 11)));

const openThreeToFour = {
  startSeconds: exactRational(3 * 3_600),
  endSeconds: exactRational(4 * 3_600),
  includeStart: false,
  includeEnd: false,
} as const;
assert.equal(verifyEventSolvers(90, openThreeToFour).agreement, true);

const gainingClock = createFaultyClockModel({
  actualAnchorSeconds: 0,
  displayedAnchorSeconds: 0,
  gainOrLossPerActualPeriod: 5 * 60,
  actualPeriodSeconds: 24 * 3_600,
});
const actualDay = exactRational(24 * 3_600);
assert(rationalsEqual(displayedTimeFromActual(gainingClock, actualDay), addRationals(actualDay, 5 * 60)));
assert(rationalsEqual(actualTimeFromDisplayed(gainingClock, displayedTimeFromActual(gainingClock, actualDay)), actualDay));

const offsetSlowClock = createFaultyClockModel({
  actualAnchorSeconds: 0,
  displayedAnchorSeconds: 10 * 60,
  gainOrLossPerActualPeriod: -60,
  actualPeriodSeconds: 3_600,
});
const nextCorrect = nextCorrectActualTimeOnTwelveHourDial(offsetSlowClock);
assert(nextCorrect !== null);
assert(compareRationals(nextCorrect!, 0) > 0);
assert(rationalsEqual(actualTimeFromDisplayed(offsetSlowClock, displayedTimeFromActual(offsetSlowClock, 100_000)), 100_000));

const displayedCoincidenceInterval = divideRationals(43_200, 11);
const actualCoincidenceInterval = actualIntervalBetweenDisplayedCoincidences(gainingClock);
assert(rationalsEqual(inferClockRateFromActualDisplayedEventInterval(displayedCoincidenceInterval, actualCoincidenceInterval), gainingClock.rate));
const displayedEvent = nthSpecialEventAfter("COINCIDENCE", 0, 3).seconds;
assert(rationalsEqual(actualTimeOfDisplayedEvent(gainingClock, displayedEvent), actualTimeFromDisplayed(gainingClock, displayedEvent)));

assert.equal(strikeTimeline(5, 2).length, 5);
assert(rationalsEqual(durationForStrikes(5, 2), 8));
assert(rationalsEqual(gapFromStrikeDuration(5, 8), 2));
assert(rationalsEqual(transferStrikeDuration(5, 8, 9), 16));
assert.equal(totalHourlyStrikesInTwelveHours(), 78);
assert.equal(totalHourlyStrikesInclusive(10, 2), 10 + 11 + 12 + 1 + 2);

for (let minute = 0; minute < 720; minute += 1) {
  const seconds = minute * 60;
  assert.equal(verifyMirrorTimeGeometry(seconds), true);
  assert(rationalsEqual(mirrorTimeSeconds(mirrorTimeSeconds(seconds)), seconds % 43_200));
}

const physical = anglesAtAbsoluteSeconds(2 * 3_600 + 20 * 60);
assert(rationalsEqual(readClockDiagramFromAngles({ hourAngle: physical.hour, minuteAngle: physical.minute })!, 2 * 3_600 + 20 * 60));
assert.equal(readClockDiagramFromAngles({ hourAngle: 120, minuteAngle: 180 }), null);

for (let minute = 0; minute < 720; minute += 5) {
  const originalSeconds = minute * 60;
  const originalAngles = anglesAtAbsoluteSeconds(originalSeconds);
  for (const swappedSeconds of solveHandInterchange(originalSeconds)) {
    const swappedAngles = anglesAtAbsoluteSeconds(swappedSeconds);
    assert(rationalsEqual(swappedAngles.hour, originalAngles.minute));
    assert(rationalsEqual(swappedAngles.minute, originalAngles.hour));
  }
}

const mixedAngle = angleOnFaultyClockAtActualTime(gainingClock, actualDay, "SMALLER");
assert(rationalsEqual(mixedAngle, hourMinuteAngle(displayedTimeFromActual(gainingClock, actualDay), "SMALLER")));

console.log(JSON.stringify({
  status: "PASS_CLK_001_END_TO_END_OPEN_DISCOVERY",
  designAuthority: CLOCK_DESIGN_AUTHORITY.file,
  checkpoints: CLOCK_CHECKPOINTS.length,
  standardCounts: {
    coincidence: specialEventRoots("COINCIDENCE", halfOpenTwelveHours).length,
    opposition: specialEventRoots("OPPOSITION", halfOpenTwelveHours).length,
    rightAngle: specialEventRoots("RIGHT_ANGLE", halfOpenTwelveHours).length,
    straightLine: specialEventRoots("STRAIGHT_LINE", halfOpenTwelveHours).length,
  },
  coincidenceIntervalSeconds: rationalToFractionString(firstCoincidenceAfterTwelve.seconds),
  faultyClockRate: rationalToFractionString(gainingClock.rate),
  hourlyStrikes12h: totalHourlyStrikesInTwelveHours(),
  mirrorMinuteGrid: 720,
  lifecycle: CLOCK_DESIGN_AUTHORITY,
}, null, 2));
