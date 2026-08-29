import assert from "node:assert/strict";
import {
  generateStaExamFormatQuestion,
  getStaExamProfileEligibleScenarioCount,
  STA_EXAM_PROFILES,
  type StaExamLocale,
  type StaExamProfileId,
} from "./exam-format-extension.ts";

const CASES_PER_PROFILE_LOCALE = Number(process.env.STA_EXAM_FORMAT_SATURATION_CASES_PER_PROFILE_LOCALE ?? 2048);
const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly StaExamLocale[];
const PROFILE_IDS = Object.keys(STA_EXAM_PROFILES) as StaExamProfileId[];

interface SaturationSummary {
  readonly eligibleScenarios: number;
  readonly reachedScenarios: number;
  readonly uniqueCorrectAnswerSets: number;
  readonly answerCardinalities: readonly number[];
  readonly largestAnswerSetShare: number;
  readonly largestScenarioShare: number;
  readonly answerPositions: readonly number[];
  readonly allAssumptionsCorrectCount: number;
}

const summaries: Record<string, SaturationSummary> = {};
let generatedQuestions = 0;
let deterministicReplayChecks = 0;

function answerSetKey(values: readonly number[]): string {
  return values.join(",");
}

for (const profileId of PROFILE_IDS) {
  const profile = STA_EXAM_PROFILES[profileId];
  for (const locale of LOCALES) {
    const key = `${profileId}/${locale}`;
    const eligibleScenarios = getStaExamProfileEligibleScenarioCount(profileId, locale);
    assert.ok(eligibleScenarios > 0, `${key}: no eligible scenarios`);

    const scenarioCounts = new Map<string, number>();
    const answerSetCounts = new Map<string, number>();
    const answerCardinalities = new Set<number>();
    const answerPositions = Array.from({ length: profile.optionCount }, () => 0);
    let allAssumptionsCorrectCount = 0;

    for (let index = 0; index < CASES_PER_PROFILE_LOCALE; index += 1) {
      const seed = `sta-exam-format-saturation:${profileId}:${locale}:${index}`;
      const question = generateStaExamFormatQuestion(seed, locale, profileId);
      const replay = generateStaExamFormatQuestion(seed, locale, profileId);
      assert.deepEqual(replay, question, `${key}/${index}: deterministic replay drift`);
      deterministicReplayChecks += 1;

      assert.equal(question.presentationProfile, profileId);
      assert.equal(question.locale, locale);
      assert.equal(question.candidateCount, profile.candidateCount);
      assert.equal(question.optionCount, profile.optionCount);
      assert.equal(question.queryPolarity, profile.queryPolarity);
      assert.ok(question.options[question.answerIndex]?.isCorrect, `${key}/${index}: answer-index mismatch`);
      assert.equal(question.oracleParity, true, `${key}/${index}: oracle parity false`);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.lifecycle.questionBankWritable, false);
      assert.equal(question.lifecycle.testEligible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);

      scenarioCounts.set(question.scenarioId, (scenarioCounts.get(question.scenarioId) ?? 0) + 1);
      const semanticKey = answerSetKey(question.answerSet);
      answerSetCounts.set(semanticKey, (answerSetCounts.get(semanticKey) ?? 0) + 1);
      answerCardinalities.add(question.answerSet.length);
      answerPositions[question.answerIndex] += 1;
      if (question.answerSet.length === question.candidateCount) allAssumptionsCorrectCount += 1;
      generatedQuestions += 1;
    }

    const reachedScenarios = scenarioCounts.size;
    const uniqueCorrectAnswerSets = answerSetCounts.size;
    const largestAnswerSetShare = Math.max(...answerSetCounts.values()) / CASES_PER_PROFILE_LOCALE;
    const largestScenarioShare = Math.max(...scenarioCounts.values()) / CASES_PER_PROFILE_LOCALE;

    // Anti-gaming invariants. These are intentionally profile-local rather than
    // chapter-global: a learner should not be able to infer a correct pattern simply
    // from seeing an SSC 2x4, Banking 3x5, etc. surface.
    assert.ok(reachedScenarios >= Math.min(eligibleScenarios, 2), `${key}: scenario pool collapsed under saturation`);
    assert.ok(uniqueCorrectAnswerSets >= (profile.candidateCount === 2 ? 3 : 4), `${key}: correct answer-set diversity is too thin (${uniqueCorrectAnswerSets})`);
    assert.ok(answerCardinalities.size >= 2, `${key}: only one correct-answer cardinality is reachable`);
    assert.ok(largestAnswerSetShare <= 0.70, `${key}: one correct answer set dominates ${(largestAnswerSetShare * 100).toFixed(1)}% of questions`);
    assert.ok(largestScenarioShare <= 0.70, `${key}: one scenario dominates ${(largestScenarioShare * 100).toFixed(1)}% of questions`);
    for (let position = 0; position < answerPositions.length; position += 1) {
      const share = answerPositions[position]! / CASES_PER_PROFILE_LOCALE;
      assert.ok(share >= 0.08 && share <= 0.40, `${key}: correct option position ${position + 1} is exploitable at ${(share * 100).toFixed(1)}%`);
    }

    // BANK_4X5 deliberately uses a source-backed, independently rejected fourth
    // overlay. Do not pretend this creates an all-four-implicit semantic authority.
    // Instead, require substantial subset diversity and record the all-four count
    // explicitly so a future source-supported expansion cannot happen silently.
    if (profileId === "BANK_4X5") {
      assert.ok(uniqueCorrectAnswerSets >= 4, `${key}: BANK_4X5 subset diversity is too thin`);
      assert.equal(allAssumptionsCorrectCount, 0, `${key}: all-four became correct without a source-supported four-implicit authority`);
    }

    summaries[key] = {
      eligibleScenarios,
      reachedScenarios,
      uniqueCorrectAnswerSets,
      answerCardinalities: [...answerCardinalities].sort((a, b) => a - b),
      largestAnswerSetShare: Number(largestAnswerSetShare.toFixed(4)),
      largestScenarioShare: Number(largestScenarioShare.toFixed(4)),
      answerPositions,
      allAssumptionsCorrectCount,
    };
  }
}

console.log("PASS_STA_001_EXAM_FORMAT_SATURATION_V1");
console.log(JSON.stringify({
  casesPerProfileLocale: CASES_PER_PROFILE_LOCALE,
  profileCount: PROFILE_IDS.length,
  localeCount: LOCALES.length,
  generatedQuestions,
  deterministicReplayChecks,
  summaries,
  note: "BANK_4X5 all-four-correct remains intentionally unsupported until a source-backed four-implicit semantic authority is added.",
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));
