import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CLOCK_CHECKPOINTS,
  CLOCK_SOURCE_CANDIDATE_POLICY,
  CLOCK_TASK_CATALOG,
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

assert.equal(CLOCK_SOURCE_CANDIDATE_POLICY.status, "SOURCE_AUDIT_CANDIDATES_NOT_AUTHORITIES");
assert.equal(CLOCK_SOURCE_CANDIDATE_POLICY.rowCountHasProductMeaning, false);
assert.equal(CLOCK_SOURCE_CANDIDATE_POLICY.permanentQlAllocationAllowed, false);
assert(CLOCK_TASK_CATALOG.length > 0);
assert.equal(CLOCK_CHECKPOINTS.length, 14);

assert.throws(
  () => generateClockQuestion({
    taskId: CLOCK_TASK_CATALOG[0]![0],
    seed: "LOCALISATION-BLOCK-PROOF",
    locale: "hi-IN",
  }),
  /localisation is blocked/i,
);
assert.throws(
  () => buildClockEndToEndReview({ locales: ["pa-IN"] }),
  /blocked until the corrected English/i,
);

const remediatedCheckpoints = new Set([
  "CLK-CP-001",
  "CLK-CP-002",
  "CLK-CP-003",
  "CLK-CP-004",
  "CLK-CP-005",
  "CLK-CP-006",
  "CLK-CP-007",
  "CLK-CP-008",
  "CLK-CP-009",
  "CLK-CP-010",
  "CLK-CP-011",
  "CLK-CP-012",
  "CLK-CP-013",
  "CLK-CP-014",
]);
const answerPositions = [0, 0, 0, 0];
const fingerprints = new Set<string>();
const taskCoverage = new Set<string>();
const checkpointCoverage = new Set<string>();
let generatedQuestions = 0;
let dualAnswerOracleQuestions = 0;
let structuralDiscoveryQuestions = 0;
let questionsWithPromptMedia = 0;
let questionsWithOptionMedia = 0;

for (let taskIndex = 0; taskIndex < CLOCK_TASK_CATALOG.length; taskIndex += 1) {
  const [taskId, expectedCheckpoint] = CLOCK_TASK_CATALOG[taskIndex]!;
  for (let seedIndex = 0; seedIndex < 10; seedIndex += 1) {
    const correctOptionIndex = (generatedQuestions % 4) as 0 | 1 | 2 | 3;
    const input = {
      taskId,
      seed: `CLK-V2-REMEDIATION-${taskIndex}-${seedIndex}`,
      locale: "en-IN" as const,
      correctOptionIndex,
    };
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
    assert.equal(question.lifecycle.localeStatus, "ENGLISH_DISCOVERY__LOCALISATION_BLOCKED_UNTIL_ENGLISH_FREEZE");
    assert(question.options.every((option) => option.reasonCode.length > 0 && option.reason.length > 0));
    assert.doesNotMatch(question.stem, /<svg|<script|foreignObject|javascript:/i);

    if (question.media?.prompt) {
      assert.equal(question.media.prompt.role, "PROMPT_DIAGRAM");
      assert.equal(question.media.prompt.mimeType, "image/svg+xml");
      assert.match(question.media.prompt.svg, /^<svg /);
      assert.doesNotMatch(question.media.prompt.svg, /<script|foreignObject|javascript:|on\w+\s*=/i);
      assert(question.media.prompt.ariaLabel.length > 0);
      assert.doesNotMatch(question.media.prompt.ariaLabel, /correct answer|shows \d{1,2}:\d{2}/i);
      questionsWithPromptMedia += 1;
    }
    if (question.media?.options) {
      assert.equal(question.media.options.length, 4);
      assert.equal(new Set(question.media.options.map((entry) => entry.semanticKey)).size, 4);
      for (const entry of question.media.options) {
        assert.equal(entry.asset.role, "OPTION_DIAGRAM");
        assert.equal(entry.asset.semanticKey, entry.semanticKey);
        assert.match(entry.asset.svg, /^<svg /);
        assert.doesNotMatch(entry.asset.svg, /<script|foreignObject|javascript:|on\w+\s*=/i);
        assert.doesNotMatch(entry.asset.ariaLabel, /correct answer|shows \d{1,2}:\d{2}/i);
      }
      questionsWithOptionMedia += 1;
    }

    if (remediatedCheckpoints.has(question.checkpointCode)) {
      assert.equal(question.solveTrace.proofLevel, "DUAL_ANSWER_ORACLE");
      assert.equal(question.lifecycle.solverProofStatus, "DUAL_ANSWER_ORACLE_PASSED");
      assert.equal(question.solveTrace.stemScenarioParity, true);
      assert.equal(question.solveTrace.answerContractVerified, true);
      assert(question.solveTrace.contractOracle && question.solveTrace.contractOracle.length > 0);
      assert.doesNotMatch(question.stem, /^Solve this clock question about/i);
      dualAnswerOracleQuestions += 1;
    } else {
      assert.equal(question.solveTrace.proofLevel, "STRUCTURAL_DISCOVERY_ONLY");
      assert.equal(question.lifecycle.solverProofStatus, "STRUCTURAL_DISCOVERY_ONLY__REMEDIATION_REQUIRED");
      structuralDiscoveryQuestions += 1;
    }

    answerPositions[question.correctOptionIndex] += 1;
    fingerprints.add(question.fingerprint);
    taskCoverage.add(question.taskId);
    checkpointCoverage.add(question.checkpointCode);
    generatedQuestions += 1;
  }
}

assert.equal(generatedQuestions, CLOCK_TASK_CATALOG.length * 10);
assert.deepEqual(answerPositions, [generatedQuestions / 4, generatedQuestions / 4, generatedQuestions / 4, generatedQuestions / 4]);
assert.equal(fingerprints.size, generatedQuestions);
assert.equal(taskCoverage.size, CLOCK_TASK_CATALOG.length);
assert.equal(checkpointCoverage.size, CLOCK_CHECKPOINTS.length);
assert(dualAnswerOracleQuestions > 0);
assert.equal(structuralDiscoveryQuestions, 0);
assert.equal(dualAnswerOracleQuestions, generatedQuestions);
assert(questionsWithPromptMedia > 0);
assert(questionsWithOptionMedia > 0);

const englishReview = buildClockEndToEndReview({
  seedPrefix: "CLK-V2-REMEDIATION-ENGLISH-REVIEW",
  locales: ["en-IN"],
});
assert.equal(englishReview.questionCount, CLOCK_TASK_CATALOG.length);
assert.equal(englishReview.sourceCandidateCount, CLOCK_TASK_CATALOG.length);
assert.equal(englishReview.localeCounts["en-IN"], CLOCK_TASK_CATALOG.length);
assert.equal(englishReview.localeCounts["hi-IN"], 0);
assert.equal(englishReview.localeCounts["pa-IN"], 0);
assert.equal(englishReview.candidatePolicy.rowCountHasProductMeaning, false);

const englishHtml = renderClockReviewHtml(englishReview);
assert.equal((englishHtml.match(/class="question"/g) ?? []).length, CLOCK_TASK_CATALOG.length);
assert.doesNotMatch(englishHtml, /<script|javascript:/i);
assert.match(englishHtml, /source-audit candidate rows/i);
assert.match(englishHtml, /Hindi and Punjabi generation is blocked/i);

const outputDirectory = "dist/reasoning-v1/clock-v2";
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(
  `${outputDirectory}/clk-001-v2-remediation-english-review.json`,
  `${JSON.stringify(englishReview, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  `${outputDirectory}/clk-001-v2-remediation-english-review.html`,
  englishHtml,
  "utf8",
);

const summary = {
  status: "PASS_CLK_001_ALL_14_CHECKPOINTS_DUAL_ORACLE_OPEN_DISCOVERY",
  soleAuthority: "CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md",
  authoritySha256: "db7fcb55498201427706416ba36622718f667ee88500c8c1572f59473cff4bcc",
  candidatePolicy: CLOCK_SOURCE_CANDIDATE_POLICY,
  checkpointCount: CLOCK_CHECKPOINTS.length,
  sourceCandidateRows: CLOCK_TASK_CATALOG.length,
  generatedEnglishQuestions: generatedQuestions,
  answerPositions,
  distinctFingerprints: fingerprints.size,
  remediatedCheckpoints: [...remediatedCheckpoints],
  dualAnswerOracleQuestions,
  structuralDiscoveryQuestions,
  questionsWithPromptMedia,
  questionsWithOptionMedia,
  standardCounts,
  kinematicsPositions,
  faultyRoundTrips,
  strikeProofs,
  mirrorPositions,
  exactInterchangePairs: interchangePairs.length,
  reviewQuestions: { english: englishReview.questionCount, hindi: 0, punjabi: 0 },
  lifecycle: {
    permanentQlCount: 0,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};
writeFileSync(
  `${outputDirectory}/clk-001-v2-remediation-proof-summary.json`,
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(summary, null, 2));
