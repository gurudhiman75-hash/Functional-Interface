import { TSD_CP002_LEARNER_AUTHORITIES } from "./discovery-registry";
import { semanticCp002OptionKey } from "./editorial-remodel";
import { generateCp002Candidate, generateCp002ReviewRows, stableStringify } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerAuthority = 60;
const answerPositions = [0, 0, 0, 0];
let candidateCount = 0;

for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const positions = new Set<number>();

  for (let index = 0; index < seedsPerAuthority; index += 1) {
    const seed = `proof:${authority.provisionalId}:${index}`;
    const first = generateCp002Candidate(authority.provisionalId, seed);
    const second = generateCp002Candidate(authority.provisionalId, seed);
    assert(stableStringify(first) === stableStringify(second), `${authority.solveMode}:${index}: deterministic replay failed`);
    assert(first.validation.valid, `${authority.solveMode}:${index}: ${first.validation.errors.join("; ")}`);
    assert(first.validation.warnings.length === 0, `${authority.solveMode}:${index}: unexpected warning`);
    assert(first.options.length === 4 && new Set(first.options).size === 4, `${authority.solveMode}:${index}: string option uniqueness failed`);
    assert(new Set(first.options.map(semanticCp002OptionKey)).size === 4, `${authority.solveMode}:${index}: semantic option uniqueness failed`);
    assert(first.answerText === first.options[first.correctIndex], `${authority.solveMode}:${index}: answer key mismatch`);
    assert(first.explanation.stepByStepSolution.length >= 5, `${authority.solveMode}:${index}: explanation is incomplete`);
    assert(first.explanation.optionAnalysis.length === 4, `${authority.solveMode}:${index}: option analysis is incomplete`);
    assert(first.explanation.optionAnalysis.every((entry) => entry.reason.includes(entry.text)), `${authority.solveMode}:${index}: option reason is not value-specific`);

    assert(first.chapterId === "TSD-001" && first.checkpointId === "TSD-CP-002", `${authority.solveMode}:${index}: canonical IDs missing`);
    assert(first.questionLanguageId.length > 10, `${authority.solveMode}:${index}: questionLanguageId missing`);
    assert(first.difficulty.status === "EDITORIAL_CALIBRATION_REQUIRED", `${authority.solveMode}:${index}: difficulty not marked provisional`);
    assert(first.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED", `${authority.solveMode}:${index}: review not reopened`);
    assert(first.lifecycle.englishDecision === "NEEDS_REVISION", `${authority.solveMode}:${index}: English decision not reopened`);
    assert(first.lifecycle.englishFreezeStatus === "UNFROZEN", `${authority.solveMode}:${index}: stale frozen status remains`);
    assert(first.lifecycle.questionBankStatus === "NOT_STORED" && first.lifecycle.testEligibility === "INELIGIBLE", `${authority.solveMode}:${index}: delivery lock failed`);
    assert(!first.publiclyPublishable, `${authority.solveMode}:${index}: publication lock failed`);

    if (authority.solveMode === "unknownSegmentShareFromAverage" || authority.solveMode === "segmentAllocationFromTotalsAndSpeeds" || authority.solveMode === "segmentRatioFromAverageAndSpeeds") {
      assert(first.authoritySubmode !== "STANDARD", `${authority.solveMode}:${index}: mixed authority lacks formal submode`);
    }
    if (authority.solveMode === "segmentRatioFromAverageAndSpeeds") {
      const distanceItem = first.authoritySubmode === "DISTANCE_RATIO";
      assert(distanceItem ? /distance ratio/i.test(first.explanation.examSpeedShortcut) : /time ratio/i.test(first.explanation.examSpeedShortcut), `${authority.solveMode}:${index}: representation-specific shortcut mismatch`);
    }

    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    positions.add(first.correctIndex);
    answerPositions[first.correctIndex] += 1;
    candidateCount += 1;
  }

  assert(stems.size === 3, `${authority.solveMode}: expected three curated stems`);
  assert(fingerprints.size === 3, `${authority.solveMode}: expected three mathematical fingerprints`);
  assert(positions.size === 4, `${authority.solveMode}: all answer positions were not reached`);
}

assert(candidateCount === 840, "Unexpected CP-002 deterministic candidate count");
assert(answerPositions.every((count) => count === 210), `Answer positions are not balanced: ${answerPositions.join(", ")}`);

const review = generateCp002ReviewRows();
assert(review.length === 42, "CP-002 review must contain 42 P0-remodel rows");
assert(review.every((row) => row.validation.valid), "Invalid question entered CP-002 P0 review");
assert(review.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "A CP-002 review row remains frozen");
assert(review.every((row) => row.difficulty.status === "EDITORIAL_CALIBRATION_REQUIRED"), "A CP-002 review row lacks provisional difficulty");
assert(review.every((row) => row.questionLanguageId.length > 10), "A CP-002 review row lacks questionLanguageId");
assert(new Set(review.map((row) => stableStringify({ stem: row.stem, options: row.options, explanation: row.explanation }))).size === 42, "Duplicate complete learner narrative remains");

const reviewPositions = review.map((row) => row.correctIndex);
const reviewPositionCounts = [0, 1, 2, 3].map((position) => reviewPositions.filter((value) => value === position).length);
assert(new Set(reviewPositions).size === 4, "CP-002 review does not use all four answer positions");
assert(reviewPositionCounts.every((count) => count >= 8 && count <= 13), `CP-002 review position distribution is implausible: ${reviewPositionCounts.join(", ")}`);
assert(reviewPositions.join("") !== "012".repeat(14), "Exact ABC answer cycle remains");

const explanationText = (ql: string): string => review
  .filter((row) => row.permanentQlId === ql)
  .map((row) => row.explanation.stepByStepSolution.join(" "))
  .join(" ");

assert(/Total time = .*Total distance = .*Average pace =/i.test(explanationText("TSD-QL-025")), "QL-025 still skips total pace arithmetic");
assert(/Allowed total time = .*Unknown-leg time = .*Unknown speed =/i.test(explanationText("TSD-QL-026")), "QL-026 still skips remaining-time derivation");
assert(!/Solving gives/i.test(explanationText("TSD-QL-028")) && /Collecting terms gives/i.test(explanationText("TSD-QL-028")), "QL-028 still jumps over algebra");
assert(/distance fraction/i.test(explanationText("TSD-QL-029")) && /time fraction/i.test(explanationText("TSD-QL-029")), "QL-029 submode equations are incomplete");
assert(/= 2 × .* × x ÷ \(.* \+ x\)/i.test(explanationText("TSD-QL-030")), "QL-030 harmonic equation is missing");
assert(/t₁ \+ t₂ = .*Distances are/i.test(explanationText("TSD-QL-034")), "QL-034 simultaneous equations are not solved");
assert(/simplified distance ratio/i.test(explanationText("TSD-QL-035")) && /simplified time ratio/i.test(explanationText("TSD-QL-035")), "QL-035 representation-specific ratio derivations are incomplete");
assert(/Target total time = .*Remaining time = .*Required speed =/i.test(explanationText("TSD-QL-036")), "QL-036 time-budget derivation is incomplete");
assert(/Plan A:.*average.*Plan B:.*average/i.test(explanationText("TSD-QL-037")), "QL-037 does not calculate both plan averages");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P0_EDITORIAL_REMODEL",
  learnerAuthorities: TSD_CP002_LEARNER_AUTHORITIES.length,
  seedsPerAuthority,
  candidateCount,
  deterministicAnswerPositionDistribution: answerPositions,
  reviewRows: review.length,
  reviewAnswerPositionDistribution: reviewPositionCounts,
  authoritySubmodes: [...new Set(review.map((row) => row.authoritySubmode))],
  reviewStatus: "EDITORIAL_REVIEW_REQUIRED",
  englishFreezeStatus: "UNFROZEN",
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
