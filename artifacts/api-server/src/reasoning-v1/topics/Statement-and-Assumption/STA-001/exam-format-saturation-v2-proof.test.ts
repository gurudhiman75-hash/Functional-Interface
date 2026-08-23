import assert from "node:assert/strict";
import { STA_EXAM_PROFILES, type StaExamLocale, type StaExamProfileId } from "./exam-format-extension.ts";
import {
  STA_EXAM_PROFILE_IDS_V2,
  generateStaExamFormatQuestionV2,
  getStaBank5x5EligibleScenarioCount,
  type StaExamProfileIdV2,
} from "./exam-format-extension-v2.ts";

const CASES_PER_PROFILE_LOCALE = Number(process.env.STA_EXAM_FORMAT_SATURATION_V2_CASES_PER_PROFILE_LOCALE ?? 2048);
const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly StaExamLocale[];
const PROFILE_IDS = STA_EXAM_PROFILE_IDS_V2;
if (!Number.isInteger(CASES_PER_PROFILE_LOCALE) || CASES_PER_PROFILE_LOCALE < 512) throw new Error("STA_EXAM_FORMAT_SATURATION_V2_CASES_PER_PROFILE_LOCALE must be an integer >= 512");
if (PROFILE_IDS.length !== 9) throw new Error(`Expected 9 exam profiles, found ${PROFILE_IDS.length}`);

interface ProfileShape {
  readonly candidateCount: 2 | 3 | 4 | 5;
  readonly optionCount: 4 | 5;
  readonly queryPolarity: "IMPLICIT" | "NOT_IMPLICIT";
}

function shape(profileId: StaExamProfileIdV2): ProfileShape {
  if (profileId === "BANK_5X5") return { candidateCount: 5, optionCount: 5, queryPolarity: "IMPLICIT" };
  const profile = STA_EXAM_PROFILES[profileId as StaExamProfileId];
  return profile;
}

let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let bank5Questions = 0;
let bank5VImplicit = 0;
let bank5VNotImplicit = 0;
const candidateCounts = new Set<number>();
const optionCounts = new Set<number>();
const sourceProfiles = new Set<string>();
const qls = new Set<string>();
const difficulties = new Set<string>();
const summary: Record<string, unknown> = {};

for (const profileId of PROFILE_IDS) {
  const profile = shape(profileId);
  for (const locale of LOCALES) {
    const key = `${profileId}/${locale}`;
    const scenarioCounts = new Map<string, number>();
    const answerSetCounts = new Map<string, number>();
    const answerCardinalities = new Set<number>();
    const answerPositions = Array.from({ length: profile.optionCount }, () => 0);

    for (let index = 0; index < CASES_PER_PROFILE_LOCALE; index += 1) {
      const seed = `sta-exam-format-saturation-v2:${profileId}:${locale}:${index}`;
      const question = generateStaExamFormatQuestionV2(seed, locale, profileId);
      const replay = generateStaExamFormatQuestionV2(seed, locale, profileId);
      assert.deepEqual(replay, question, `${key}/${index}: deterministic replay drift`);
      deterministicReplayChecks += 1;
      assert.equal(question.presentationProfile, profileId);
      assert.equal(question.locale, locale);
      assert.equal(question.candidateCount, profile.candidateCount);
      assert.equal(question.optionCount, profile.optionCount);
      assert.equal(question.queryPolarity, profile.queryPolarity);
      assert.ok(question.options[question.answerIndex]?.isCorrect, `${key}/${index}: answer-index mismatch`);
      assert.equal(question.oracleParity, true);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.lifecycle.questionBankWritable, false);
      assert.equal(question.lifecycle.testEligible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);

      scenarioCounts.set(question.scenarioId, (scenarioCounts.get(question.scenarioId) ?? 0) + 1);
      const answerKey = question.answerSet.join(",");
      answerSetCounts.set(answerKey, (answerSetCounts.get(answerKey) ?? 0) + 1);
      answerCardinalities.add(question.answerSet.length);
      answerPositions[question.answerIndex] = (answerPositions[question.answerIndex] ?? 0) + 1;
      candidateCounts.add(question.candidateCount);
      optionCounts.add(question.optionCount);
      sourceProfiles.add(question.sourceProfile);
      qls.add(question.qlId);
      difficulties.add(question.difficulty);
      generatedQuestions += 1;

      if (profileId === "BANK_5X5") {
        bank5Questions += 1;
        const fifth = question.candidates[4];
        if (!fifth || fifth.label !== "V") throw new Error(`${key}/${index}: BANK_5X5 fifth assumption missing`);
        if (fifth.oracle.classification === "IMPLICIT") bank5VImplicit += 1;
        else bank5VNotImplicit += 1;
      }
    }

    const uniqueAnswerSets = answerSetCounts.size;
    const largestAnswerSetShare = Math.max(...answerSetCounts.values()) / CASES_PER_PROFILE_LOCALE;
    const largestScenarioShare = Math.max(...scenarioCounts.values()) / CASES_PER_PROFILE_LOCALE;
    assert.ok(scenarioCounts.size >= 2, `${key}: scenario pool collapsed`);
    assert.ok(uniqueAnswerSets >= (profile.candidateCount === 2 ? 3 : 4), `${key}: correct answer-set diversity too thin (${uniqueAnswerSets})`);
    assert.ok(answerCardinalities.size >= 2, `${key}: answer cardinality collapsed`);
    assert.ok(largestAnswerSetShare <= 0.70, `${key}: one answer set dominates ${(largestAnswerSetShare * 100).toFixed(1)}%`);
    assert.ok(largestScenarioShare <= 0.70, `${key}: one scenario dominates ${(largestScenarioShare * 100).toFixed(1)}%`);
    for (let position = 0; position < answerPositions.length; position += 1) {
      const share = answerPositions[position]! / CASES_PER_PROFILE_LOCALE;
      assert.ok(share >= 0.08 && share <= 0.40, `${key}: answer position ${position + 1} is exploitable at ${(share * 100).toFixed(1)}%`);
    }
    summary[key] = {
      reachedScenarios: scenarioCounts.size,
      uniqueAnswerSets,
      answerCardinalities: [...answerCardinalities].sort((a, b) => a - b),
      largestAnswerSetShare: Number(largestAnswerSetShare.toFixed(4)),
      largestScenarioShare: Number(largestScenarioShare.toFixed(4)),
      answerPositions,
    };
  }
}

assert.deepEqual([...candidateCounts].sort((a, b) => a - b), [2, 3, 4, 5]);
assert.deepEqual([...optionCounts].sort((a, b) => a - b), [4, 5]);
assert.equal(bank5Questions, CASES_PER_PROFILE_LOCALE * LOCALES.length);
assert.ok(bank5VImplicit > 0 && bank5VNotImplicit > 0, "BANK_5X5 must exercise both V-correct and V-incorrect outcomes");
assert.equal(getStaBank5x5EligibleScenarioCount(), 8);
assert.equal(qls.size, 4, `Expected all four QLs, found ${[...qls].join(",")}`);
assert.ok(sourceProfiles.has("SSC") && sourceProfiles.has("BANKING") && sourceProfiles.has("PUNJAB_STATE"), "Target exam-family coverage incomplete");
assert.ok(difficulties.has("Easy") && difficulties.has("Medium") && difficulties.has("Hard"), "Difficulty coverage incomplete");
assert.ok(PROFILE_IDS.includes("BANK_3X5_NEGATIVE"), "Negative-query Banking profile missing");

console.log("PASS_STA_001_EXAM_FORMAT_SATURATION_V2_2_TO_5_ASSUMPTIONS");
console.log(JSON.stringify({
  profileCount: PROFILE_IDS.length,
  localeCount: LOCALES.length,
  casesPerProfileLocale: CASES_PER_PROFILE_LOCALE,
  generatedQuestions,
  deterministicReplayChecks,
  candidateCounts: [...candidateCounts].sort((a, b) => a - b),
  optionCounts: [...optionCounts].sort((a, b) => a - b),
  bank5Questions,
  bank5VImplicit,
  bank5VNotImplicit,
  sourceProfiles: [...sourceProfiles].sort(),
  qls: [...qls].sort(),
  difficulties: [...difficulties].sort(),
  summary,
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));
