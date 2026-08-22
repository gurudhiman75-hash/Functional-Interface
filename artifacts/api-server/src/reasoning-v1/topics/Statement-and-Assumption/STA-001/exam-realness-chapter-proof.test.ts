import assert from "node:assert/strict";
import { generateStaQl001LocalizedQuestionV2 } from "./localization-ql001-editorial-v2.ts";
import { generateStaQl002LocalizedQuestionV2 } from "./localization-ql002-editorial-v2.ts";
import { generateStaQl003LocalizedQuestionV2 } from "./localization-ql003-editorial-v2.ts";
import { generateStaQl004LocalizedQuestionV3 } from "./localization-ql004-editorial-v3.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";
import type { StaQlId } from "./types.ts";

const CASES_PER_QL_LOCALE = Number(process.env.STA_CHAPTER_EXAM_REALNESS_CASES_PER_QL_LOCALE ?? 4096);
const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly StaLocalizedLocale[];
const QLS = ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"] as const satisfies readonly StaQlId[];

type GeneratedQuestion = ReturnType<typeof generateStaQl001LocalizedQuestionV2>
  | ReturnType<typeof generateStaQl002LocalizedQuestionV2>
  | ReturnType<typeof generateStaQl003LocalizedQuestionV2>
  | ReturnType<typeof generateStaQl004LocalizedQuestionV3>;

function generate(qlId: StaQlId, seed: string, locale: StaLocalizedLocale): GeneratedQuestion {
  if (qlId === "STA-QL-001") return generateStaQl001LocalizedQuestionV2(seed, locale);
  if (qlId === "STA-QL-002") return generateStaQl002LocalizedQuestionV2(seed, locale);
  if (qlId === "STA-QL-003") return generateStaQl003LocalizedQuestionV2(seed, locale);
  return generateStaQl004LocalizedQuestionV3(seed, locale);
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

const scenarioCoverage: Record<string, number> = {};
const uniqueStemCoverage: Record<string, number> = {};
const answerPositionCounts: Record<string, number[]> = {};
const candidateCountCoverage: Record<string, number[]> = {};
const maxExplanationWords: Record<string, number> = {};
const reachedSourceProfiles = new Set<string>();
const reachedDifficulties = new Set<string>();
const reachedAnswerCardinalities = new Set<number>();
const globalStemSets = new Map<StaLocalizedLocale, Set<string>>([
  ["hi-IN", new Set<string>()],
  ["pa-IN", new Set<string>()],
]);
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let oracleCandidateChecks = 0;
let threeAssumptionQuestions = 0;
let twoAssumptionQuestions = 0;

for (const locale of LOCALES) {
  for (const qlId of QLS) {
    const key = `${qlId}/${locale}`;
    const scenarios = new Set<string>();
    const stems = new Set<string>();
    const candidateCounts = new Set<number>();
    const positions = [0, 0, 0, 0];
    let maxWords = 0;

    for (let index = 0; index < CASES_PER_QL_LOCALE; index += 1) {
      const seed = `sta-chapter-exam-realness:${qlId}:${locale}:${index}`;
      const question = generate(qlId, seed, locale);
      const replay = generate(qlId, seed, locale);
      assert.deepEqual(replay, question, `${key}/${seed}: deterministic replay drift`);
      deterministicReplayChecks += 1;

      assert.equal(question.qlId, qlId, `${key}/${seed}: QL identity drift`);
      assert.equal(question.proposedQlId, qlId, `${key}/${seed}: proposed QL identity drift`);
      assert.equal(question.locale, locale, `${key}/${seed}: locale drift`);
      assert.equal(question.oracleParity, true, `${key}/${seed}: oracle parity false`);
      assert.equal(question.candidates.length === 2 || question.candidates.length === 3, true, `${key}/${seed}: standard frozen surface must remain 2/3 assumptions`);
      assert.equal(question.options.length, 4, `${key}/${seed}: standard frozen surface must remain four options`);
      assert.equal(question.options.filter((option) => option.isCorrect).length, 1, `${key}/${seed}: non-unique correct option`);
      assert.ok(question.options[question.answerIndex]?.isCorrect, `${key}/${seed}: answer-index mismatch`);
      assert.deepEqual(question.options[question.answerIndex]!.semanticAnswerSet, question.answerSet, `${key}/${seed}: semantic answer-set mismatch`);
      assert.equal(question.explanation.includes(question.statement), false, `${key}/${seed}: explanation repeats full stem`);
      assert.equal(/STA-|BREAKS_|REQUIRED_HIDDEN_DEPENDENCY|NO_REQUIRED_DEPENDENCY/.test(question.explanation), false, `${key}/${seed}: internal authority leaked into explanation`);

      const explanationWords = wordCount(question.explanation);
      assert.ok(explanationWords <= 105, `${key}/${seed}: explanation exceeds learner-realness envelope (${explanationWords} words)`);
      maxWords = Math.max(maxWords, explanationWords);

      for (const candidate of question.candidates) {
        assert.notEqual(candidate.oracle.evidenceCode, "MISSING_SEMANTIC_NEGATION", `${key}/${seed}/${candidate.candidateId}: missing semantic negation`);
        oracleCandidateChecks += 1;
      }

      if (question.candidates.length === 2) twoAssumptionQuestions += 1;
      else threeAssumptionQuestions += 1;
      positions[question.answerIndex] += 1;
      scenarios.add(question.scenarioId);
      stems.add(question.statement);
      globalStemSets.get(locale)!.add(question.statement);
      candidateCounts.add(question.candidates.length);
      reachedSourceProfiles.add(question.sourceProfile);
      reachedDifficulties.add(question.difficulty);
      reachedAnswerCardinalities.add(question.answerSet.length);
      generatedQuestions += 1;
    }

    assert.equal(scenarios.size, 16, `${key}: stress generation did not reach all 16 frozen authorities`);
    assert.equal(stems.size, 32, `${key}: expected 32 distinct learner stems across 16 authorities`);
    assert.deepEqual([...candidateCounts].sort(), [2, 3], `${key}: both 2- and 3-assumption standard formats were not exercised`);
    for (let position = 0; position < positions.length; position += 1) {
      const share = positions[position]! / CASES_PER_QL_LOCALE;
      assert.ok(share >= 0.18 && share <= 0.32, `${key}: answer position ${position + 1} is imbalanced at ${share.toFixed(3)}`);
    }

    if (qlId === "STA-QL-004") {
      const joined = [...stems].join("\n");
      assert.equal((joined.match(/उम्मीद/gu) ?? []).length, 0, `${key}: old Hindi prediction skeleton remains`);
      assert.equal((joined.match(/ਉਮੀਦ/gu) ?? []).length, 0, `${key}: old Punjabi prediction skeleton remains`);
    }

    scenarioCoverage[key] = scenarios.size;
    uniqueStemCoverage[key] = stems.size;
    answerPositionCounts[key] = positions;
    candidateCountCoverage[key] = [...candidateCounts].sort();
    maxExplanationWords[key] = maxWords;
  }

  assert.equal(globalStemSets.get(locale)!.size, 128, `${locale}: chapter canonical learner pool is not 128 distinct stems`);
}

assert.ok(twoAssumptionQuestions > 0 && threeAssumptionQuestions > 0, "Chapter stress missed a standard assumption-count format");
assert.deepEqual([...reachedSourceProfiles].sort(), ["BANKING", "CROSS_EXAM_DISCOVERY", "PUNJAB_STATE", "SSC"], "Chapter stress missed a frozen source profile");
assert.deepEqual([...reachedDifficulties].sort(), ["Easy", "Hard", "Medium"], "Chapter stress missed a difficulty band");
assert.ok(reachedAnswerCardinalities.has(0), "Chapter stress never produced a neither/none answer");
assert.ok(reachedAnswerCardinalities.has(1), "Chapter stress never produced an only-one answer");
assert.ok(reachedAnswerCardinalities.has(2), "Chapter stress never produced a multi-assumption answer");
assert.ok(reachedAnswerCardinalities.has(3), "Chapter stress never produced an all-three answer");

console.log("PASS_STA_001_CHAPTER_EXAM_REALNESS_V1");
console.log(JSON.stringify({
  casesPerQlLocale: CASES_PER_QL_LOCALE,
  generatedQuestions,
  deterministicReplayChecks,
  oracleCandidateChecks,
  twoAssumptionQuestions,
  threeAssumptionQuestions,
  reachedSourceProfiles: [...reachedSourceProfiles].sort(),
  reachedDifficulties: [...reachedDifficulties].sort(),
  reachedAnswerCardinalities: [...reachedAnswerCardinalities].sort(),
  scenarioCoverage,
  uniqueStemCoverage,
  answerPositionCounts,
  candidateCountCoverage,
  maxExplanationWords,
  uniqueHindiChapterStems: globalStemSets.get("hi-IN")!.size,
  uniquePunjabiChapterStems: globalStemSets.get("pa-IN")!.size,
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));