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
  exactRational,
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
  multiplyRationals,
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

// CP-001: rates, movement, duration, revolutions, minute spaces and hand-tip distance.
assert(rationalsEqual(handMovementDegrees("HOUR", 3_600), 30));
assert(rationalsEqual(handMovementDegrees("MINUTE", 60), 6));
assert(rationalsEqual(handMovementDegrees("SECOND", 10), 60));
assert(rationalsEqual(durationForHandMovement("MINUTE", 180), 1_800));
assert(rationalsEqual(revolutionsForHand("SECOND", 180), 3));
assert(rationalsEqual(handTipDistance(7, 180).coefficientOfPi, 7));

// CP-002: stated-time angle and classification, including seconds.
const atThreeThirty = anglesAtAbsoluteSeconds(3 * 3_600 + 30 * 60);
assert(rationalsEqual(atThreeThirty.hour, 105));
assert(rationalsEqual(atThreeThirty.minute, 180));
assert(rationalsEqual(hourMinuteAngle(3 * 3_600 + 30 * 60, "SMALLER"), 75));
assert(rationalsEqual(hourMinuteAngle(3 * 3_600 + 30 * 60, "REFLEX"), 285));
assert.equal(classifyHourMinuteRelation(3 * 3_600), "RIGHT");
assert(rationalsEqual(hourMinuteAngle(15, "SMALLER"), exactRational(11, 8)));

// CP-003 to CP-005: exact roots, independent enumeration, endpoint semantics and standard counts.
const halfOpenTwelveHours = {
  startSeconds: exactRational(0),
  endSeconds: exactRational(43_200),
  includeStart: true,
  includeEnd: false,
} as const;
for (const target of [0, 30, 60, 90, 120, 150, 180]) {
  const proof = verifyEventSolvers(target, halfOpenTwelveHours);
  assert.equal(proof.agreement, true, `Angle-event solvers disagreed for ${target} degrees.`);
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

// CP-006 and CP-007: affine actual/displayed mapping and exact inverse.
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

// CP-008: infer faulty rate from displayed event frequency.
const displayedCoincidenceInterval = divideRationals(43_200, 11);
const actualCoincidenceInterval = actualIntervalBetweenDisplayedCoincidences(gainingClock);
assert(rationalsEqual(inferClockRateFromActualDisplayedEventInterval(displayedCoincidenceInterval, actualCoincidenceInterval), gainingClock.rate));
const displayedEvent = nthSpecialEventAfter("COINCIDENCE", 0, 3).seconds;
assert(rationalsEqual(actualTimeOfDisplayedEvent(gainingClock, displayedEvent), actualTimeFromDisplayed(gainingClock, displayedEvent)));

// CP-009 and CP-010: n strikes means n-1 intervals and schedule enumeration.
assert.equal(strikeTimeline(5, 2).length, 5);
assert(rationalsEqual(durationForStrikes(5, 2), 8));
assert(rationalsEqual(gapFromStrikeDuration(5, 8), 2));
assert(rationalsEqual(transferStrikeDuration(5, 8, 9), 16));
assert.equal(totalHourlyStrikesInTwelveHours(), 78);
assert.equal(totalHourlyStrikesInclusive(10, 2), 10 + 11 + 12 + 1 + 2);

// CP-011: valid vertical mirror arithmetic and geometry agreement.
for (let minute = 0; minute < 720; minute += 1) {
  const seconds = minute * 60;
  assert.equal(verifyMirrorTimeGeometry(seconds), true, `Mirror geometry failed at minute ${minute}.`);
  assert(rationalsEqual(mirrorTimeSeconds(mirrorTimeSeconds(seconds)), seconds % 43_200));
}

// CP-012: diagram positions are accepted only when they correspond to a physical real time.
const physical = anglesAtAbsoluteSeconds(2 * 3_600 + 20 * 60);
assert(rationalsEqual(readClockDiagramFromAngles({ hourAngle: physical.hour, minuteAngle: physical.minute })!, 2 * 3_600 + 20 * 60));
assert.equal(readClockDiagramFromAngles({ hourAngle: 120, minuteAngle: 180 }), null);

// CP-013: all returned swaps satisfy both exact hand equations.
for (let minute = 0; minute < 720; minute += 5) {
  const originalSeconds = minute * 60;
  const originalAngles = anglesAtAbsoluteSeconds(originalSeconds);
  for (const swappedSeconds of solveHandInterchange(originalSeconds)) {
    const swappedAngles = anglesAtAbsoluteSeconds(swappedSeconds);
    assert(rationalsEqual(swappedAngles.hour, originalAngles.minute));
    assert(rationalsEqual(swappedAngles.minute, originalAngles.hour));
  }
}

// CP-014: mixed faulty-clock angle and actual event composition.
const mixedAngle = angleOnFaultyClockAtActualTime(gainingClock, actualDay, "SMALLER");
assert(rationalsEqual(mixedAngle, hourMinuteAngle(displayedTimeFromActual(gainingClock, actualDay), "SMALLER")));

const summary = {
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
  lifecycle: {
    permanentQlCount: CLOCK_DESIGN_AUTHORITY.permanentQlCount,
    questionStudioDiscoverable: CLOCK_DESIGN_AUTHORITY.questionStudioDiscoverable,
    questionBankWritable: CLOCK_DESIGN_AUTHORITY.questionBankWritable,
    testEligible: CLOCK_DESIGN_AUTHORITY.testEligible,
    publiclyPublishable: CLOCK_DESIGN_AUTHORITY.publiclyPublishable,
  },
};

console.log(JSON.stringify(summary, null, 2));
