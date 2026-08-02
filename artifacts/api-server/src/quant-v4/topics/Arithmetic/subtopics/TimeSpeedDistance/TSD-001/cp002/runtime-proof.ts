import { TSD_CP002_LEARNER_AUTHORITIES } from "./discovery-registry";
import { generateCp002Candidate, generateCp002ReviewRows, stableStringify } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerAuthority = 60;
const answerPositions = [0, 0, 0, 0];
let candidateCount = 0;
let distinctStemCount = 0;
let distinctFingerprintCount = 0;

for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const positions = new Set<number>();
  for (let index = 0; index < seedsPerAuthority; index += 1) {
    const seed = `proof:${authority.provisionalId}:${index}`;
    const first = generateCp002Candidate(authority.provisionalId, seed);
    const second = generateCp002Candidate(authority.provisionalId, seed);
    assert(stableStringify(first) === stableStringify(second), `${authority.solveMode}:${index}: deterministic replay failed`);
    assert(first.validation.valid, `${authority.solveMode}:${index}: invalid candidate: ${first.validation.errors.join("; ")}`);
    assert(first.options.length === 4 && new Set(first.options).size === 4, `${authority.solveMode}:${index}: invalid options`);
    assert(first.answerText === first.options[first.correctIndex], `${authority.solveMode}:${index}: answer key mismatch`);
    assert(first.explanation.stepByStepSolution.length >= 6, `${authority.solveMode}:${index}: explanation is compressed`);
    assert(first.explanation.optionAnalysis.length === 4, `${authority.solveMode}:${index}: incomplete option analysis`);
    assert(first.explanation.optionAnalysis.every((entry) => entry.reason.includes(entry.text)), `${authority.solveMode}:${index}: option reason is not value-specific`);
    const learnerText = `${first.stem} ${first.answerText} ${first.options.join(" ")} ${first.explanation.stepByStepSolution.join(" ")} ${first.explanation.optionAnalysis.map((entry) => entry.reason).join(" ")}`;
    assert(!/\b1 (hours|minutes|kilometres)\b|km\/h kilometres|minutes\/km minutes/i.test(learnerText), `${authority.solveMode}:${index}: singular or duplicated-unit defect`);
    assert(!/\b(required answer|compatible units|continuous timeline|provisional authority)\b/i.test(learnerText), `${authority.solveMode}:${index}: engine language leaked`);
    assert((first.stemMathJax.match(/\\\(/g) ?? []).length === (first.stemMathJax.match(/\\\)/g) ?? []).length, `${authority.solveMode}:${index}: unbalanced MathJax delimiters`);
    assert(!/\\text\{[^}]*\\text\{|\\timesimes|\\diviv/.test(first.stemMathJax), `${authority.solveMode}:${index}: corrupted MathJax token`);
    assert(!/TSD-CP002-DISC-01[56]|TODO|PLACEHOLDER/.test(`${first.stem} ${first.options.join(" ")} ${first.explanation.stepByStepSolution.join(" ")}`), `${authority.solveMode}:${index}: internal text leaked`);
    assert(first.lifecycle.englishFreezeStatus === "FROZEN", `${authority.solveMode}:${index}: English freeze status failed`);
    assert(first.lifecycle.questionBankStatus === "NOT_STORED" && first.lifecycle.testEligibility === "INELIGIBLE" && !first.publiclyPublishable, `${authority.solveMode}:${index}: delivery lock failed`);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    positions.add(first.correctIndex);
    answerPositions[first.correctIndex] += 1;
    candidateCount += 1;
  }
  assert(stems.size === 3, `${authority.solveMode}: expected three curated stem states`);
  assert(fingerprints.size === 3, `${authority.solveMode}: expected three mathematical fingerprints`);
  assert(positions.size === 4, `${authority.solveMode}: all answer positions were not reached`);
  distinctStemCount += stems.size;
  distinctFingerprintCount += fingerprints.size;
}

assert(candidateCount === 840, "Unexpected deterministic candidate count");
assert(answerPositions.every((count) => count === 210), `Answer positions are not balanced: ${answerPositions.join(", ")}`);

const review = generateCp002ReviewRows();
assert(review.length === 42, "CP-002 review must contain 42 rows");
assert(review.every((row) => row.validation.valid), "Invalid question entered CP-002 review");
assert(new Set(review.map((row) => row.permanentQlId)).size === 14, "Unexpected CP-002 permanent QL count in review");
for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  const rows = review.filter((row) => row.provisionalAuthorityId === authority.provisionalId);
  assert(rows.length === 3, `${authority.solveMode}: expected three review states`);
  assert(new Set(rows.map((row) => row.stem)).size === 3, `${authority.solveMode}: review stems are not distinct`);
  assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 3, `${authority.solveMode}: review fingerprints are not distinct`);
  assert(new Set(rows.map((row) => row.explanation.stepByStepSolution[0])).size === 3, `${authority.solveMode}: teaching openings are not distinct`);
}

const completeNarratives = review.map((row) => stableStringify({
  stem: row.stem,
  options: row.options,
  explanation: row.explanation,
}));
assert(new Set(completeNarratives).size === review.length, "Duplicate complete learner narrative in CP-002 review");

const generalAverageRows = review.filter((row) => row.solveMode === "averageSpeedFromSegments");
assert(generalAverageRows.some((row) => row.representation === "EQUAL_DISTANCE"), "Equal-distance representation is missing");
assert(generalAverageRows.some((row) => row.representation === "MULTI_SEGMENT"), "Multi-segment representation is missing");
assert(generalAverageRows.some((row) => row.representation === "MIXED_UNIT_LOG"), "Mixed-unit representation is missing");
assert(review.some((row) => row.solveMode === "unknownSegmentShareFromAverage" && row.representation === "DISTANCE_SHARE"), "Distance-share inverse is missing");
assert(review.some((row) => row.solveMode === "unknownSegmentShareFromAverage" && row.representation === "TIME_SHARE"), "Time-share inverse is missing");
assert(review.some((row) => row.solveMode === "segmentAllocationFromTotalsAndSpeeds" && row.solution.answerKind === "TIME"), "Time-allocation inverse is missing");
assert(review.some((row) => row.solveMode === "segmentAllocationFromTotalsAndSpeeds" && row.solution.answerKind === "DISTANCE"), "Distance-allocation inverse is missing");
assert(review.some((row) => row.solveMode === "segmentRatioFromAverageAndSpeeds" && row.representation === "TIME_RATIO"), "Time-ratio representation is missing");
assert(review.some((row) => row.solveMode === "segmentRatioFromAverageAndSpeeds" && row.representation === "DISTANCE_RATIO"), "Distance-ratio representation is missing");
const comparisons = review.filter((row) => row.solveMode === "compareSegmentedJourneyPlans").map((row) => row.answerText);
assert(comparisons.includes("Plan A") && comparisons.includes("Plan B") && comparisons.includes("Both plans have the same average speed"), "Plan A/Plan B/tie comparison coverage is incomplete");

console.log(JSON.stringify({
  status: "PASS",
  canonicalProblemId: "TSD-CP-002",
  learnerAuthorities: TSD_CP002_LEARNER_AUTHORITIES.length,
  seedsPerAuthority,
  candidateCount,
  answerPositionDistribution: answerPositions,
  distinctStemCount,
  distinctFingerprintCount,
  reviewRows: review.length,
  uniqueCompleteNarratives: new Set(completeNarratives).size,
  singularUnitDefects: 0,
  duplicatedUnitNounLeaks: 0,
  malformedMathJaxRows: 0,
  engineLanguageLeaks: 0,
  publiclyPublishable: 0,
}, null, 2));
