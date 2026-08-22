import assert from "node:assert/strict";
import {
  generateStaExamFormatQuestion,
  getStaExamProfileEligibleScenarioCount,
  STA_EXAM_PROFILES,
  type StaExamLocale,
  type StaExamProfileId,
} from "./exam-format-extension.ts";

const CASES_PER_PROFILE_LOCALE = Number(process.env.STA_EXAM_FORMAT_CASES_PER_PROFILE_LOCALE ?? 512);
const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly StaExamLocale[];
const PROFILE_IDS = Object.keys(STA_EXAM_PROFILES) as StaExamProfileId[];

const reachedQls = new Set<string>();
const reachedSourceProfiles = new Set<string>();
const reachedDifficulties = new Set<string>();
const reachedCandidateCounts = new Set<number>();
const reachedOptionCounts = new Set<number>();
const reachedPolarities = new Set<string>();
const reachedAnswerCardinalities = new Set<number>();
const bank4ReachedQls = new Set<string>();
const eligibleScenarioCounts: Record<string, number> = {};
const scenarioCoverage: Record<string, number> = {};
const answerPositionCounts: Record<string, number[]> = {};
let deterministicReplayChecks = 0;
let generatedQuestions = 0;
let fourAssumptionQuestions = 0;
let bankFourthOverlayOracleChecks = 0;
let fiveOptionQuestions = 0;
let negativeQueryQuestions = 0;
let noneOfTheseMetaOptionChecks = 0;

function complement(values: readonly number[], candidateCount: number): number[] {
  const existing = new Set(values);
  return Array.from({ length: candidateCount }, (_, index) => index).filter((index) => !existing.has(index));
}

for (const profileId of PROFILE_IDS) {
  const profile = STA_EXAM_PROFILES[profileId];
  for (const locale of LOCALES) {
    const matrixKey = `${profileId}/${locale}`;
    const eligibleCount = getStaExamProfileEligibleScenarioCount(profileId, locale);
    eligibleScenarioCounts[matrixKey] = eligibleCount;
    assert.ok(eligibleCount > 0, `${matrixKey}: no eligible scenarios; exam profile is declarative only`);

    const reachedScenarios = new Set<string>();
    const positionCounts = Array.from({ length: profile.optionCount }, () => 0);
    let sawCandidateIV = false;
    let sawFifthOption = false;
    let sawLocalizedInstruction = locale === "en-IN";

    for (let index = 0; index < CASES_PER_PROFILE_LOCALE; index += 1) {
      const seed = `sta-exam-format:${profileId}:${locale}:${index}`;
      const question = generateStaExamFormatQuestion(seed, locale, profileId);
      const replay = generateStaExamFormatQuestion(seed, locale, profileId);
      assert.deepEqual(replay, question, `${matrixKey}/${seed}: deterministic replay drift`);
      deterministicReplayChecks += 1;

      assert.equal(question.presentationProfile, profileId);
      assert.equal(question.locale, locale);
      assert.equal(question.candidateCount, profile.candidateCount);
      assert.equal(question.optionCount, profile.optionCount);
      assert.equal(question.queryPolarity, profile.queryPolarity);
      assert.ok(profile.sourceProfiles.includes(question.sourceProfile), `${matrixKey}/${seed}: source-profile mismatch`);
      assert.equal(question.options.length, profile.optionCount);
      assert.equal(question.candidates.length, profile.candidateCount);
      assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
      assert.ok(question.options[question.answerIndex]?.isCorrect, `${matrixKey}/${seed}: answer index is not correct`);
      assert.equal(question.oracleParity, true);
      assert.equal(question.lifecycle.semanticQls, "FROZEN");
      assert.equal(question.lifecycle.englishCorpus, "FROZEN_V2");
      assert.equal(question.lifecycle.ql001HindiPunjabi, "FROZEN_V2");
      assert.equal(question.lifecycle.ql002HindiPunjabi, "FROZEN_V2");
      assert.equal(question.lifecycle.ql003HindiPunjabi, "FROZEN_V2");
      assert.equal(question.lifecycle.ql004HindiPunjabi, "REVIEW_CANDIDATE_V3");
      assert.equal(question.lifecycle.examFormatStatus, "REVIEW_CANDIDATE_V1");
      assert.equal(question.lifecycle.multilingualChapterFrozen, false);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.lifecycle.questionBankWritable, false);
      assert.equal(question.lifecycle.testEligible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.explanation.includes(question.statement), false, `${matrixKey}/${seed}: explanation repeats full stem`);
      assert.equal(/STA-|BREAKS_|REQUIRED_HIDDEN_DEPENDENCY|NO_REQUIRED_DEPENDENCY/.test(question.explanation), false, `${matrixKey}/${seed}: internal authority leak`);

      const visibleOptions = new Set(question.options.map((option) => option.display));
      assert.equal(visibleOptions.size, profile.optionCount, `${matrixKey}/${seed}: duplicate visible options`);
      const semanticOptions = question.options.filter((option) => option.kind === "ANSWER_SET");
      assert.equal(new Set(semanticOptions.map((option) => option.semanticAnswerSet.join(","))).size, semanticOptions.length, `${matrixKey}/${seed}: duplicate semantic answer options`);

      if (profile.queryPolarity === "NOT_IMPLICIT") {
        assert.deepEqual(question.answerSet, complement(question.implicitAnswerSet, question.candidateCount), `${matrixKey}/${seed}: negative query is not the complement of implicit assumptions`);
        negativeQueryQuestions += 1;
      } else {
        assert.deepEqual(question.answerSet, question.implicitAnswerSet, `${matrixKey}/${seed}: positive query answer differs from implicit assumptions`);
      }

      if (question.candidateCount === 4) {
        assert.equal(question.candidates[3]?.label, "IV", `${matrixKey}/${seed}: four-assumption rendering does not expose IV`);
        const overlay = question.candidates.find((candidate) => candidate.candidateId === "FMT-C4");
        assert.ok(overlay, `${matrixKey}/${seed}: curated banking fourth-assumption overlay is missing`);
        assert.equal(overlay.oracle.classification, "NOT_IMPLICIT", `${matrixKey}/${seed}: presentation overlay became implicit`);
        assert.equal(overlay.oracle.evidenceCode, "NO_REQUIRED_DEPENDENCY", `${matrixKey}/${seed}: overlay was not independently rejected by the oracle`);
        assert.equal(question.sourceProfile, "BANKING");
        assert.equal(question.presentationProfile, "BANK_4X5");
        sawCandidateIV = true;
        fourAssumptionQuestions += 1;
        bankFourthOverlayOracleChecks += 1;
        bank4ReachedQls.add(question.qlId);
      }
      if (question.optionCount === 5) {
        assert.equal(question.options.length, 5);
        sawFifthOption = true;
        fiveOptionQuestions += 1;
      }
      if (profileId === "BANK_2X5") {
        const meta = question.options.filter((option) => option.kind === "NONE_OF_THE_ABOVE");
        assert.equal(meta.length, 1, `${matrixKey}/${seed}: BANK_2X5 lacks its fifth meta distractor`);
        assert.equal(meta[0]!.isCorrect, false);
        noneOfTheseMetaOptionChecks += 1;
      }
      if (locale !== "en-IN") {
        assert.notEqual(question.instruction, "Consider the statement and decide which of the given assumptions is implicit.");
        sawLocalizedInstruction = true;
      }

      positionCounts[question.answerIndex] += 1;
      reachedScenarios.add(question.scenarioId);
      reachedQls.add(question.qlId);
      reachedSourceProfiles.add(question.sourceProfile);
      reachedDifficulties.add(question.difficulty);
      reachedCandidateCounts.add(question.candidateCount);
      reachedOptionCounts.add(question.optionCount);
      reachedPolarities.add(question.queryPolarity);
      reachedAnswerCardinalities.add(question.answerSet.length);
      generatedQuestions += 1;
    }

    assert.ok(reachedScenarios.size >= Math.min(eligibleCount, 2), `${matrixKey}: insufficient scenario variety under stress generation`);
    if (profile.candidateCount === 4) assert.equal(sawCandidateIV, true, `${matrixKey}: IV was never rendered`);
    if (profile.optionCount === 5) assert.equal(sawFifthOption, true, `${matrixKey}: fifth option was never rendered`);
    assert.equal(sawLocalizedInstruction, true, `${matrixKey}: localized instruction missing`);
    for (let position = 0; position < positionCounts.length; position += 1) {
      assert.ok(positionCounts[position]! > 0, `${matrixKey}: answer position ${position + 1} was never exercised`);
    }
    answerPositionCounts[matrixKey] = positionCounts;
    scenarioCoverage[matrixKey] = reachedScenarios.size;
  }
}

assert.deepEqual([...reachedCandidateCounts].sort(), [2, 3, 4], "Exam-format stress did not exercise source-backed 2/3/4 assumption counts");
assert.deepEqual([...reachedOptionCounts].sort(), [4, 5], "Exam-format stress did not exercise 4/5 options");
assert.deepEqual([...reachedPolarities].sort(), ["IMPLICIT", "NOT_IMPLICIT"], "Exam-format stress did not exercise positive and negative query polarity");
assert.deepEqual([...reachedSourceProfiles].sort(), ["BANKING", "PUNJAB_STATE", "SSC"], "Exam-format stress missed an intended source profile");
assert.deepEqual([...reachedDifficulties].sort(), ["Easy", "Hard", "Medium"], "Exam-format stress missed a difficulty band");
assert.deepEqual([...reachedQls].sort(), ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"], "Exam-format stress did not exercise all four frozen semantic QLs");
assert.deepEqual([...bank4ReachedQls].sort(), ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"], "BANK_4X5 overlay coverage did not span all four frozen QLs");
assert.ok(reachedAnswerCardinalities.has(0), "Exam-format stress never produced a zero-assumption answer set");
assert.ok(reachedAnswerCardinalities.has(1), "Exam-format stress never produced a single-assumption answer set");
assert.ok(reachedAnswerCardinalities.has(2), "Exam-format stress never produced a two-assumption answer set");
assert.ok(fourAssumptionQuestions > 0, "No four-assumption banking questions were generated");
assert.ok(bankFourthOverlayOracleChecks > 0, "The banking fourth-assumption overlays were never independently oracle-checked");
assert.ok(fiveOptionQuestions > 0, "No five-option banking questions were generated");
assert.ok(negativeQueryQuestions > 0, "No negative-query banking questions were generated");
assert.ok(noneOfTheseMetaOptionChecks > 0, "BANK_2X5 fifth-option checks were never exercised");

console.log("PASS_STA_001_EXAM_FORMAT_EXTENSION_V1");
console.log(JSON.stringify({
  casesPerProfileLocale: CASES_PER_PROFILE_LOCALE,
  profileCount: PROFILE_IDS.length,
  localeCount: LOCALES.length,
  generatedQuestions,
  deterministicReplayChecks,
  fourAssumptionQuestions,
  bankFourthOverlayOracleChecks,
  fiveOptionQuestions,
  negativeQueryQuestions,
  noneOfTheseMetaOptionChecks,
  reachedQls: [...reachedQls].sort(),
  bank4ReachedQls: [...bank4ReachedQls].sort(),
  reachedSourceProfiles: [...reachedSourceProfiles].sort(),
  reachedDifficulties: [...reachedDifficulties].sort(),
  reachedCandidateCounts: [...reachedCandidateCounts].sort(),
  reachedOptionCounts: [...reachedOptionCounts].sort(),
  reachedPolarities: [...reachedPolarities].sort(),
  reachedAnswerCardinalities: [...reachedAnswerCardinalities].sort(),
  eligibleScenarioCounts,
  scenarioCoverage,
  answerPositionCounts,
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));
