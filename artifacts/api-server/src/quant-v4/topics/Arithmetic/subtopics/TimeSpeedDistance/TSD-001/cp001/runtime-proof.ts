import { examDifficultyLabel } from "../difficulty-calibration";
import { TSD_CP001_DISCOVERY_AUTHORITIES } from "./discovery-registry";
import {
  TSD_CP001_LEARNER_AUTHORITIES,
  TSD_CP001_NON_LEARNER_MODES,
  generateCp001Candidate,
  generateCp001ReviewRows,
  stableStringify,
} from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerAuthority = 60;
const answerPositionDistribution = [0, 0, 0, 0];
let candidateCount = 0;
const optionLabels = ["A", "B", "C", "D"] as const;

for (const authority of TSD_CP001_DISCOVERY_AUTHORITIES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const positions = new Set<number>();

  for (let index = 0; index < seedsPerAuthority; index += 1) {
    const seed = `proof:${authority.provisionalId}:${index}`;
    const first = generateCp001Candidate(authority.provisionalId, seed);
    const second = generateCp001Candidate(authority.provisionalId, seed);
    assert(stableStringify(first) === stableStringify(second), `${authority.solveMode}:${index}: deterministic replay failed`);
    assert(first.validation.valid, `${authority.solveMode}:${index}: ${first.validation.errors.join("; ")}`);
    assert(first.validation.warnings.length === 0, `${authority.solveMode}:${index}: unexpected validation warning`);
    assert(first.options.length === 4 && new Set(first.options).size === 4, `${authority.solveMode}:${index}: option uniqueness failed`);
    assert(first.answerText === first.options[first.correctIndex], `${authority.solveMode}:${index}: answer key mismatch`);
    assert(first.optionAudit.filter((option) => option.isCorrect).length === 1, `${authority.solveMode}:${index}: correct-option count failed`);
    assert(first.explanation.stepByStepSolution.length >= 5, `${authority.solveMode}:${index}: explanation is compressed`);
    assert(first.explanation.optionAnalysis.length === 4, `${authority.solveMode}:${index}: option analysis is incomplete`);
    for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
      const analysis = first.explanation.optionAnalysis[optionIndex];
      assert(analysis.option === optionLabels[optionIndex], `${authority.solveMode}:${index}: option label mismatch`);
      assert(analysis.text === first.options[optionIndex], `${authority.solveMode}:${index}: option-analysis text mismatch`);
      assert(analysis.reason.includes(analysis.text), `${authority.solveMode}:${index}: option reason is not value-specific`);
    }

    assert(first.chapterId === "TSD-001" && first.checkpointId === "TSD-CP-001", `${authority.solveMode}:${index}: canonical IDs missing`);
    assert(first.questionLanguageId.length > 10, `${authority.solveMode}:${index}: questionLanguageId missing`);
    assert(first.difficulty.status === "EDITORIALLY_CALIBRATED", `${authority.solveMode}:${index}: difficulty is not calibrated`);
    assert(first.difficulty.label === examDifficultyLabel(first.solveMode, first.input), `${authority.solveMode}:${index}: difficulty label conflicts with exam-family rubric`);
    assert(first.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED", `${authority.solveMode}:${index}: review source lifecycle changed`);
    assert(first.lifecycle.englishDecision === "NEEDS_REVISION", `${authority.solveMode}:${index}: source English decision changed`);
    assert(first.lifecycle.englishFreezeStatus === "UNFROZEN", `${authority.solveMode}:${index}: source runtime was mutated instead of wrapped by English freeze`);
    assert(first.lifecycle.questionBankStatus === "NOT_STORED" && first.lifecycle.testEligibility === "INELIGIBLE", `${authority.solveMode}:${index}: delivery lock failed`);
    assert(!first.publiclyPublishable, `${authority.solveMode}:${index}: publication lock failed`);

    if (authority.solveMode === "paceFromSpeed") {
      assert(/pace in (seconds|minutes) per kilometre/i.test(first.stem), `${authority.solveMode}:${index}: stem does not ask for pace`);
    }
    if (authority.solveMode === "distanceFromSpeedAndTime" && /\b(45|54|72|90) km\/h/i.test(first.stem)) {
      assert(!/\b(runner|cyclist|rider)\b/i.test(first.stem), `${authority.solveMode}:${index}: implausible human high-speed context`);
    }
    if (authority.solveMode === "speedFromDistanceAndTime") {
      assert(!/\b(rider|cyclist|runner)[^?]*What is its speed/i.test(first.stem), `${authority.solveMode}:${index}: awkward human pronoun remains`);
    }

    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    positions.add(first.correctIndex);
    answerPositionDistribution[first.correctIndex] += 1;
    candidateCount += 1;
  }

  assert(stems.size >= 3, `${authority.solveMode}: fewer than three stems`);
  assert(fingerprints.size >= 3, `${authority.solveMode}: fewer than three mathematical states`);
  assert(positions.size === 4, `${authority.solveMode}: not all answer positions were reached`);
}

const reviewRows = generateCp001ReviewRows(3);
assert(candidateCount === TSD_CP001_DISCOVERY_AUTHORITIES.length * seedsPerAuthority, "Unexpected CP-001 candidate count");
assert(TSD_CP001_LEARNER_AUTHORITIES.length === 23, "Unexpected CP-001 learner authority count during P0 remodel");
assert(TSD_CP001_NON_LEARNER_MODES.size === 2, "Unexpected CP-001 internal authority count");
assert(reviewRows.length === 69, "Unexpected CP-001 review-row count");
assert(reviewRows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "A CP-001 source review row was mutated instead of frozen through the wrapper");
assert(reviewRows.every((row) => row.difficulty.status === "EDITORIALLY_CALIBRATED"), "A CP-001 review row lacks calibrated difficulty");
assert(reviewRows.every((row) => row.difficulty.label === examDifficultyLabel(row.solveMode, row.input)), "A CP-001 review-row difficulty label conflicts with the exam-family rubric");
assert(reviewRows.every((row) => row.questionLanguageId.length > 10), "A CP-001 review row lacks questionLanguageId");

const nextDayArrivalRows = reviewRows.filter((row) => row.solveMode === "arrivalClockTime" && row.answerText.includes(" next day"));
assert(nextDayArrivalRows.length > 0, "No next-day arrival row reached the P0 review");
assert(nextDayArrivalRows.every((row) => !row.options.includes(row.answerText.replace(" next day", ""))), "Ambiguous next-day clock option remains");
const paceRows = reviewRows.filter((row) => row.solveMode === "paceFromSpeed");
assert(paceRows.every((row) => /pace in (seconds|minutes) per kilometre/i.test(row.stem)), "Pace stem/unit mismatch remains");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P0_EDITORIAL_REMODEL_COMPATIBILITY",
  provisionalAuthorityCount: TSD_CP001_DISCOVERY_AUTHORITIES.length,
  learnerAuthorityCount: TSD_CP001_LEARNER_AUTHORITIES.length,
  internalQaAuthorityCount: TSD_CP001_NON_LEARNER_MODES.size,
  seedsPerAuthority,
  candidateCount,
  answerPositionDistribution,
  reviewRows: reviewRows.length,
  nextDayArrivalRows: nextDayArrivalRows.length,
  difficultyStatus: "EDITORIALLY_CALIBRATED",
  sourceReviewStatus: "EDITORIAL_REVIEW_REQUIRED",
  sourceEnglishFreezeStatus: "UNFROZEN",
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
