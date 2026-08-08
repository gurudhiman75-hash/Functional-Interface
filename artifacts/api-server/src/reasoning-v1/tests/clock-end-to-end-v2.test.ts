import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CLOCK_TASK_CATALOG,
  CLOCK_CHECKPOINTS,
  buildClockEndToEndReview,
  generateClockQuestion,
  renderClockReviewHtml,
} from "../topics/Clocks/CLK-001/runtime";
import {
  affineFaultyClockModel,
  clockRateFromGainLoss,
  clockTimeToHandAnglesByCycleExact,
  clockTimeToHandAnglesExact,
  durationForStrikesExact,
  eventCountExact,
  exactRational,
  exactTimeInterval,
  findHandInterchangePairsExact,
  gapFromStrikeDurationExact,
  rationalToFractionString,
  totalStrikesInTwelveHours,
  totalStrikesInTwentyFourHours,
  validateMirrorTimeGeometryExact,
  verifyFaultyClockMappingExact,
  verifyHourMinuteAngleEventsExact,
} from "../foundation/temporal";

function exactKey(value: { numerator: bigint; denominator: bigint }): string {
  return rationalToFractionString(value);
}

const standardInterval = exactTimeInterval({
  startSeconds: 0,
  endSeconds: 43_200,
  includeStart: false,
  includeEnd: true,
});

const standardCounts = {
  coincidence: eventCountExact({ eventType: "COINCIDENCE", interval: standardInterval }),
  opposition: eventCountExact({ eventType: "OPPOSITION", interval: standardInterval }),
  rightAngle: eventCountExact({ eventType: "RIGHT_ANGLE", interval: standardInterval }),
  straightLine: eventCountExact({ eventType: "STRAIGHT_LINE", interval: standardInterval }),
};
assert.deepEqual(standardCounts, {
  coincidence: 11,
  opposition: 11,
  rightAngle: 22,
  straightLine: 22,
});

for (const targetAngleDeg of [0, 30, 45, 60, 90, 120, 150, 180]) {
  const proof = verifyHourMinuteAngleEventsExact({
    targetAngleDeg,
    angleMode: "SMALLER",
    interval: standardInterval,
  });
  assert.equal(proof.agreement, true, `Angle-event engines disagree for ${targetAngleDeg}°.`);
}

let kinematicsPositions = 0;
for (let hour = 1; hour <= 12; hour += 1) {
  for (let minute = 0; minute < 60; minute += 1) {
    for (const second of [0, 15, 30, 45]) {
      const direct = clockTimeToHandAnglesExact({ hour, minute, second });
      const cycle = clockTimeToHandAnglesByCycleExact({ hour, minute, second });
      assert.equal(exactKey(direct.hourAngleDeg), exactKey(cycle.hourAngleDeg));
      assert.equal(exactKey(direct.minuteAngleDeg), exactKey(cycle.minuteAngleDeg));
      assert.equal(exactKey(direct.secondAngleDeg), exactKey(cycle.secondAngleDeg));
      kinematicsPositions += 1;
    }
  }
}

let faultyRoundTrips = 0;
for (const direction of ["GAIN", "LOSS"] as const) {
  for (const errorMinutes of [1, 5, 10, 15, 30, 60]) {
    const rate = clockRateFromGainLoss({
      direction,
      errorUnits: errorMinutes * 60,
      actualPeriodUnits: 86_400,
    });
    const model = affineFaultyClockModel({
      actualAnchorSeconds: 1_234,
      displayedAnchorSeconds: 2_345,
      rateDisplayedPerActual: rate,
    });
    for (const actualSeconds of [1_234, 43_200, 86_400, 172_800]) {
      assert.equal(verifyFaultyClockMappingExact(model, actualSeconds).agreement, true);
      faultyRoundTrips += 1;
    }
  }
}

let strikeProofs = 0;
for (let strikes = 1; strikes <= 20; strikes += 1) {
  const gap = exactRational(7, 3);
  const duration = durationForStrikesExact({ strikes, gapSeconds: gap });
  const recovered = gapFromStrikeDurationExact({
    strikes,
    firstToLastDurationSeconds: duration,
  });
  assert.equal(exactKey(recovered), exactKey(strikes === 1 ? exactRational(0) : gap));
  strikeProofs += 1;
}
assert.equal(totalStrikesInTwelveHours(), 78);
assert.equal(totalStrikesInTwentyFourHours(), 156);

let mirrorPositions = 0;
for (let totalMinutes = 0; totalMinutes < 720; totalMinutes += 1) {
  assert.equal(validateMirrorTimeGeometryExact(totalMinutes * 60).agreement, true);
  mirrorPositions += 1;
}

const interchangePairs = findHandInterchangePairsExact();
assert(interchangePairs.length > 0);
assert(interchangePairs.every((pair) => pair.possible));

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
const answerPositions = [0, 0, 0, 0];
const fingerprints = new Set<string>();
const taskCoverage = new Set<string>();
const checkpointCoverage = new Set<string>();
const localeCoverage = new Set<string>();
let generatedQuestions = 0;

for (let taskIndex = 0; taskIndex < CLOCK_TASK_CATALOG.length; taskIndex += 1) {
  const [taskId, expectedCheckpoint] = CLOCK_TASK_CATALOG[taskIndex]!;
  for (const locale of locales) {
    for (let seedIndex = 0; seedIndex < 20; seedIndex += 1) {
      const correctOptionIndex = (generatedQuestions % 4) as 0 | 1 | 2 | 3;
      const input = {
        taskId,
        seed: `CLK-V2-PROOF-${taskIndex}-${locale}-${seedIndex}`,
        locale,
        correctOptionIndex,
      } as const;
      const question = generateClockQuestion(input);
      assert.deepEqual(generateClockQuestion(input), question);
      assert.equal(question.checkpointCode, expectedCheckpoint);
      assert.equal(question.designAuthority.policy, "SOLE_AUTHORITY");
      assert.equal(question.designAuthority.sha256, "db7fcb55498201427706416ba36622718f667ee88500c8c1572f59473cff4bcc");
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option) => option.semanticKey)).size, 4);
      assert.equal(new Set(question.options.map((option) => option.display)).size, 4);
      assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(question.options[question.correctOptionIndex]!.semanticKey, question.answer.semanticKey);
      assert.equal(question.solveTrace.canonicalAnswerKey, question.solveTrace.verifierAnswerKey);
      assert.equal(question.solveTrace.agreement, true);
      assert(question.explanation.given.length > 0);
      assert(question.explanation.rule.length > 0);
      assert(question.explanation.working.length > 0);
      assert(question.explanation.validityCheck.length > 0);
      assert(question.explanation.closestTrap.length > 0);
      assert(question.explanation.answer.length > 0);
      assert.doesNotMatch(question.stem, /prototype|solver|metadata|generator/i);
      assert.equal(question.lifecycle.permanentQlId, null);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.lifecycle.questionBankWritable, false);
      assert.equal(question.lifecycle.testEligible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert(question.options.every((option) => option.reasonCode.length > 0 && option.reason.length > 0));
      if (locale === "hi-IN") assert.match(question.stem, /[\u0900-\u097F]/);
      if (locale === "pa-IN") assert.match(question.stem, /[\u0A00-\u0A7F]/);
      answerPositions[question.correctOptionIndex] += 1;
      fingerprints.add(question.fingerprint);
      taskCoverage.add(question.taskId);
      checkpointCoverage.add(question.checkpointCode);
      localeCoverage.add(question.locale);
      generatedQuestions += 1;
    }
  }
}

assert.equal(generatedQuestions, 6_000);
assert.deepEqual(answerPositions, [1_500, 1_500, 1_500, 1_500]);
assert.equal(fingerprints.size, generatedQuestions);
assert.equal(taskCoverage.size, 100);
assert.equal(checkpointCoverage.size, 14);
assert.equal(localeCoverage.size, 3);
assert.equal(CLOCK_TASK_CATALOG.length, 100);
assert.equal(CLOCK_CHECKPOINTS.length, 14);

const englishReview = buildClockEndToEndReview({ seedPrefix: "CLK-V2-ENGLISH-REVIEW", locales: ["en-IN"] });
const multilingualReview = buildClockEndToEndReview({ seedPrefix: "CLK-V2-MULTILINGUAL-REVIEW", locales });
assert.equal(englishReview.questionCount, 100);
assert.equal(multilingualReview.questionCount, 300);
assert.equal(englishReview.taskCount, 100);
assert.equal(multilingualReview.localeCounts["en-IN"], 100);
assert.equal(multilingualReview.localeCounts["hi-IN"], 100);
assert.equal(multilingualReview.localeCounts["pa-IN"], 100);

const englishHtml = renderClockReviewHtml(englishReview);
const multilingualHtml = renderClockReviewHtml(multilingualReview);
assert.equal((englishHtml.match(/class="question"/g) ?? []).length, 100);
assert.equal((multilingualHtml.match(/class="question"/g) ?? []).length, 300);
assert.doesNotMatch(englishHtml, /<script|javascript:/i);
assert.doesNotMatch(multilingualHtml, /<script|javascript:/i);

const outputDirectory = "dist/reasoning-v1/clock-v2";
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(`${outputDirectory}/clk-001-v2-english-100-review.json`, `${JSON.stringify(englishReview, null, 2)}\n`, "utf8");
writeFileSync(`${outputDirectory}/clk-001-v2-english-100-review.html`, englishHtml, "utf8");
writeFileSync(`${outputDirectory}/clk-001-v2-multilingual-300-review.json`, `${JSON.stringify(multilingualReview, null, 2)}\n`, "utf8");
writeFileSync(`${outputDirectory}/clk-001-v2-multilingual-300-review.html`, multilingualHtml, "utf8");

const summary = {
  status: "PASS_CLK_001_END_TO_END_OPEN_DISCOVERY_V2",
  soleAuthority: "CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md",
  authoritySha256: "db7fcb55498201427706416ba36622718f667ee88500c8c1572f59473cff4bcc",
  checkpointCount: CLOCK_CHECKPOINTS.length,
  provisionalTaskContracts: CLOCK_TASK_CATALOG.length,
  generatedQuestions,
  localeCounts: { "en-IN": 2_000, "hi-IN": 2_000, "pa-IN": 2_000 },
  answerPositions,
  distinctFingerprints: fingerprints.size,
  standardCounts,
  kinematicsPositions,
  faultyRoundTrips,
  strikeProofs,
  mirrorPositions,
  exactInterchangePairs: interchangePairs.length,
  reviewQuestions: { english: englishReview.questionCount, multilingual: multilingualReview.questionCount },
  lifecycle: {
    permanentQlCount: 0,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};
writeFileSync(`${outputDirectory}/clk-001-v2-proof-summary.json`, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
