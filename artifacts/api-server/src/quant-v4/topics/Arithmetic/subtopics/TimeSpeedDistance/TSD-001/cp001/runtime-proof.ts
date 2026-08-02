import { TSD_CP001_DISCOVERY_AUTHORITIES } from "./discovery-registry";
import { TSD_CP001_LEARNER_AUTHORITIES, TSD_CP001_NON_LEARNER_MODES, generateCp001Candidate, generateCp001ReviewRows, stableStringify } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerAuthority = 60;
let candidateCount = 0;
let distinctStemCount = 0;
let distinctFingerprintCount = 0;
const answerPositionDistribution = [0, 0, 0, 0];
const normalizedStemOwners = new Map<string, string>();
let crossAuthorityNormalizedStemCollisions = 0;
const technicalLearnerLanguage = /\b(uniform motion|exact identity|physical value|continuous timeline|compatible units|motion state|state be classified|provisional authority|required answer)\b/i;
const mixedNumberPattern = /\b\d+\s+\d+\/\d+\b/;
const languageDefectPattern = /\.\.|(?<![\d.])\b1 (hours|minutes|seconds|days)\b/;
const optionLabels = ["A", "B", "C", "D"] as const;

function normalizeStem(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

for (const authority of TSD_CP001_DISCOVERY_AUTHORITIES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answerPositions = new Set<number>();
  for (let index = 0; index < seedsPerAuthority; index += 1) {
    const seed = `proof:${authority.provisionalId}:${index}`;
    const first = generateCp001Candidate(authority.provisionalId, seed);
    const second = generateCp001Candidate(authority.provisionalId, seed);
    const serialized = stableStringify(first);
    assert(serialized === stableStringify(second), `${authority.solveMode}: deterministic replay failed at seed ${index}`);
    assert(first.validation.valid, `${authority.solveMode}: invalid candidate at seed ${index}: ${first.validation.errors.join("; ")}`);
    assert(first.options.length === 4, `${authority.solveMode}: option count failed`);
    assert(new Set(first.options).size === 4, `${authority.solveMode}: duplicate options`);
    assert(first.optionAudit[first.correctIndex].isCorrect, `${authority.solveMode}: wrong keyed option`);
    assert(first.answerText === first.options[first.correctIndex], `${authority.solveMode}: answer text mismatch`);
    const wrongMisconceptions = first.optionAudit.filter((option) => !option.isCorrect).map((option) => option.misconceptionId);
    assert(!wrongMisconceptions.some((id) => id === "DOUBLE_COUNT_A_FACTOR" || id === "HALVE_A_REQUIRED_FACTOR" || id === "ARITHMETIC_OFFSET"), `${authority.solveMode}: generic fallback distractor leaked`);
    if (first.solution.answerKind !== "CLASSIFICATION" && first.solution.answerKind !== "BOOLEAN") {
      assert(new Set(wrongMisconceptions).size >= 2, `${authority.solveMode}: distractor misconception diversity is too low`);
    }

    assert(first.explanation.working.length >= 2, `${authority.solveMode}: insufficient compact working`);
    if (first.solution.answerKind !== "CLASSIFICATION" && first.solution.answerKind !== "BOOLEAN") {
      assert(first.explanation.working.some((line) => line.includes("=") && /\d/.test(line)), `${authority.solveMode}: arithmetic is missing`);
    }
    assert(new Set(first.explanation.working.map((line) => line.trim().toLowerCase())).size === first.explanation.working.length, `${authority.solveMode}: repeated compact working line leaked`);
    assert(first.explanation.trap.startsWith("Common mistake:"), `${authority.solveMode}: compact common-mistake note missing`);
    assert(!first.explanation.trap.includes("Option "), `${authority.solveMode}: option-letter narration leaked into compact explanation`);

    assert(first.explanation.keyRule.startsWith("📌 Main Rule:"), `${authority.solveMode}: main-rule badge missing`);
    assert(first.explanation.stepByStepSolution.length >= 2, `${authority.solveMode}: four-tier solution is too brief`);
    assert(first.explanation.examSpeedShortcut.startsWith("⚡ Exam Speed Trick:"), `${authority.solveMode}: speed-trick badge missing`);
    assert(first.explanation.optionAnalysis.length === 4, `${authority.solveMode}: four-option analysis missing`);
    assert(first.explanation.optionAnalysis.filter((option) => option.isCorrect).length === 1, `${authority.solveMode}: option analysis has an invalid correct count`);
    for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
      const analysis = first.explanation.optionAnalysis[optionIndex];
      assert(analysis.option === optionLabels[optionIndex], `${authority.solveMode}: option-analysis label mismatch`);
      assert(analysis.text === first.options[optionIndex], `${authority.solveMode}: option-analysis text mismatch`);
      assert(analysis.isCorrect === (optionIndex === first.correctIndex), `${authority.solveMode}: option-analysis key mismatch`);
      assert(analysis.reason.startsWith(analysis.isCorrect ? "✅" : "⚠️"), `${authority.solveMode}: option-analysis badge missing`);
      assert(!/[A-Z]{2,}(?:_[A-Z]{2,})+/.test(analysis.reason), `${authority.solveMode}: internal misconception code leaked into learner reason`);
    }

    assert(/^[A-Z]/.test(first.stem), `${authority.solveMode}: stem must begin with a capital letter`);
    const languageDefect = serialized.match(languageDefectPattern);
    assert(!languageDefect, `${authority.solveMode}: learner-language defect at seed ${index}: ${languageDefect?.[0] ?? "unknown"}; ${serialized}`);
    if (!TSD_CP001_NON_LEARNER_MODES.has(authority.solveMode)) {
      const learnerVisible = `${first.stem} ${first.stemMathJax} ${first.options.join(" ")} ${first.explanation.keyRule} ${first.explanation.stepByStepSolution.join(" ")} ${first.explanation.examSpeedShortcut} ${first.explanation.optionAnalysis.map((option) => option.reason).join(" ")} ${first.explanation.conclusion}`;
      assert(first.stemMathJax.includes("\\("), `${authority.solveMode}: MathJax quantity missing from learner stem`);
      assert(first.explanation.stepByStepSolution.some((line) => line.includes("\\(")), `${authority.solveMode}: MathJax step missing`);
      assert(first.explanation.stepByStepSolution.filter((line) => /[=×÷]/.test(line)).every((line) => line.includes("\\(")), `${authority.solveMode}: raw equation leaked outside MathJax`);
      assert(!technicalLearnerLanguage.test(learnerVisible), `${authority.solveMode}: technical learner language leaked`);
      assert(!mixedNumberPattern.test(learnerVisible), `${authority.solveMode}: mixed-number notation leaked into learner text`);
      assert(first.explanation.conclusion === `Answer: ${first.answerText}.`, `${authority.solveMode}: exam-style conclusion failed`);
    }
    if (authority.solveMode === "distanceByProportion" || authority.solveMode === "timeByProportion") {
      assert(!/ at \d+(?:\.\d+)? km\/h/i.test(first.stem), `${authority.solveMode}: hidden derived speed leaked as a redundant given`);
    }
    if (authority.solveMode === "speedByProportion") {
      assert(/same distance/i.test(first.stem), "speedByProportion: same-distance condition is not explicit");
    }

    const normalizedStem = normalizeStem(first.stem);
    const previousOwner = normalizedStemOwners.get(normalizedStem);
    if (previousOwner && previousOwner !== authority.solveMode) crossAuthorityNormalizedStemCollisions += 1;
    else normalizedStemOwners.set(normalizedStem, authority.solveMode);
    assert(!first.publiclyPublishable, `${authority.solveMode}: publication lock failed`);
    assert(first.lifecycle.reviewStatus === "UNREVIEWED", `${authority.solveMode}: review lock failed`);
    assert(first.lifecycle.questionBankStatus === "NOT_STORED", `${authority.solveMode}: Question Bank lock failed`);
    assert(first.lifecycle.testEligibility === "INELIGIBLE", `${authority.solveMode}: test lock failed`);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    answerPositions.add(first.correctIndex);
    answerPositionDistribution[first.correctIndex] += 1;
    candidateCount += 1;
  }
  assert(stems.size >= 3, `${authority.solveMode}: fewer than three distinct rendered stems`);
  assert(fingerprints.size >= 3, `${authority.solveMode}: fewer than three distinct mathematical states`);
  assert(answerPositions.size === 4, `${authority.solveMode}: all four correct-answer positions were not reached`);
  distinctStemCount += stems.size;
  distinctFingerprintCount += fingerprints.size;
}

assert(candidateCount === TSD_CP001_DISCOVERY_AUTHORITIES.length * seedsPerAuthority, "Unexpected candidate count");
assert(crossAuthorityNormalizedStemCollisions === 0, "Cross-authority normalized stem collision detected");

const reviewRows = generateCp001ReviewRows(3);
assert(TSD_CP001_LEARNER_AUTHORITIES.length === 23, "Unexpected learner-facing authority count");
assert(TSD_CP001_NON_LEARNER_MODES.size === 2, "Unexpected non-learner authority count");
assert(reviewRows.length === 69, "Unexpected learner review-row count");
assert(reviewRows.every((row) => !TSD_CP001_NON_LEARNER_MODES.has(row.solveMode)), "Non-learner mode leaked into learner review");
for (const authority of TSD_CP001_LEARNER_AUTHORITIES) {
  const authorityRows = reviewRows.filter((row) => row.provisionalAuthorityId === authority.provisionalId);
  assert(authorityRows.length === 3, `${authority.solveMode}: review row count failed`);
  assert(new Set(authorityRows.map((row) => row.mathematicalFingerprint)).size === 3, `${authority.solveMode}: review fingerprints are not distinct`);
  assert(new Set(authorityRows.map((row) => row.stem)).size === 3, `${authority.solveMode}: review stems are not distinct`);
}

console.log(JSON.stringify({
  status: "PASS",
  permanentQlCount: 0,
  provisionalAuthorityCount: TSD_CP001_DISCOVERY_AUTHORITIES.length,
  learnerFacingAuthorityCount: TSD_CP001_LEARNER_AUTHORITIES.length,
  nonLearnerAuthorityCount: TSD_CP001_NON_LEARNER_MODES.size,
  seedsPerAuthority,
  candidateCount,
  distinctStemCount,
  distinctFingerprintCount,
  answerPositionDistribution,
  crossAuthorityNormalizedStemCollisions,
  reviewRowCount: reviewRows.length,
  reviewStatesPerLearnerAuthority: 3,
  fourTierExplanationRows: reviewRows.length,
  optionAnalysesPerRow: 4,
  publiclyPublishableCandidates: 0,
}, null, 2));