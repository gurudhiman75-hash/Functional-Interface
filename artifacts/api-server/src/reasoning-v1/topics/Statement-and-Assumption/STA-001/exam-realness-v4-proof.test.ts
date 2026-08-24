import assert from "node:assert/strict";
import {
  STA_V4_DIFFICULTIES,
  STA_V4_LANGUAGES,
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_PROFILE_IDS,
  STA_V4_QL_IDS,
  STA_V4_SCENARIOS,
  STA_V4_SCENARIOS_BY_QL,
  assertStaV4QuestionIntegrity,
  generateStaV4Question,
  staV4CueSignalCount,
  type StaV4Language,
  type StaV4Locale,
  type StaV4ProfileId,
  type StaV4QlId,
} from "./exam-realness-v4-runtime.ts";
import {
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSta001QuestionStudioReview,
} from "./question-studio-review-v4.ts";

const LOCALE_BY_LANGUAGE: Record<StaV4Language, StaV4Locale> = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
};

assert.equal(STA_V4_SCENARIOS.length, 108, "V4 must expose 108 controlled semantic authorities");
for (const qlId of STA_V4_QL_IDS) {
  assert.equal(STA_V4_SCENARIOS_BY_QL[qlId].length, 18, `${qlId}: expected 18 V4 authorities`);
}
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, STA_V4_QL_IDS);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

const seenScenarioIds = new Set<string>();
const seenDifficulties = new Set<string>();
const cueStats = Object.fromEntries(STA_V4_LANGUAGES.map((language) => [language, {
  implicit: 0,
  notImplicit: 0,
  implicitCue: 0,
  notImplicitCue: 0,
  heuristicCovered: 0,
  heuristicCorrect: 0,
}])) as Record<StaV4Language, {
  implicit: number;
  notImplicit: number;
  implicitCue: number;
  notImplicitCue: number;
  heuristicCovered: number;
  heuristicCorrect: number;
}>;

function legacyShortcutGuess(text: string, language: StaV4Language): "IMPLICIT" | "NOT_IMPLICIT" | null {
  if (language === "en") {
    if (/\b(all|every|never|always|only|best|most|none|unable|impossible)\b/iu.test(text)) return "NOT_IMPLICIT";
    if (/\b(can|may|some|at least|able)\b/iu.test(text)) return "IMPLICIT";
    return null;
  }
  if (language === "hi") {
    if (/(सभी|हर|कभी नहीं|हमेशा|केवल|सबसे|कोई नहीं|असंभव)/u.test(text)) return "NOT_IMPLICIT";
    if (/(सक|कुछ|समर्थ)/u.test(text)) return "IMPLICIT";
    return null;
  }
  if (/(ਸਾਰੇ|ਹਰ|ਕਦੇ ਨਹੀਂ|ਹਮੇਸ਼ਾ|ਕੇਵਲ|ਸਭ ਤੋਂ|ਕੋਈ ਨਹੀਂ|ਅਸੰਭਵ)/u.test(text)) return "NOT_IMPLICIT";
  if (/(ਸਕ|ਕੁਝ|ਸਮਰਥ)/u.test(text)) return "IMPLICIT";
  return null;
}

for (const scenario of STA_V4_SCENARIOS) {
  assert.equal(scenario.statementVariants.length, 3, `${scenario.scenarioId}: expected three authored stems`);
  assert.equal(scenario.candidates.length, 5, `${scenario.scenarioId}: expected five candidate authorities`);
  assert.equal(scenario.candidates.filter((candidate) => candidate.implicit).length, 2, `${scenario.scenarioId}: expected two required dependencies`);
  assert.equal(scenario.candidates.filter((candidate) => !candidate.implicit).length, 3, `${scenario.scenarioId}: expected three subtle distractors`);
  assert.equal(new Set(scenario.candidates.map((candidate) => candidate.id)).size, 5, `${scenario.scenarioId}: candidate IDs must be unique`);
  seenScenarioIds.add(scenario.scenarioId);
  seenDifficulties.add(scenario.difficulty);

  for (const language of STA_V4_LANGUAGES) {
    for (const candidate of scenario.candidates) {
      for (const wording of candidate.textVariants) {
        const text = wording[language];
        const stats = cueStats[language];
        if (candidate.implicit) stats.implicit += 1;
        else stats.notImplicit += 1;
        const cue = staV4CueSignalCount(text, language) > 0;
        if (candidate.implicit && cue) stats.implicitCue += 1;
        if (!candidate.implicit && cue) stats.notImplicitCue += 1;
        const guess = legacyShortcutGuess(text, language);
        if (guess) {
          stats.heuristicCovered += 1;
          const truth = candidate.implicit ? "IMPLICIT" : "NOT_IMPLICIT";
          if (guess === truth) stats.heuristicCorrect += 1;
        }
      }
    }
  }
}

assert.equal(seenScenarioIds.size, 108);
assert.deepEqual([...seenDifficulties].sort(), [...STA_V4_DIFFICULTIES].sort());

for (const language of STA_V4_LANGUAGES) {
  const stats = cueStats[language];
  const total = stats.implicit + stats.notImplicit;
  const coverage = stats.heuristicCovered / total;
  const implicitCueRate = stats.implicitCue / stats.implicit;
  const notImplicitCueRate = stats.notImplicitCue / stats.notImplicit;
  const cueGap = Math.abs(implicitCueRate - notImplicitCueRate);
  assert.ok(coverage <= 0.15, `${language}: legacy wording shortcut still covers ${(coverage * 100).toFixed(1)}% of candidate surfaces`);
  assert.ok(cueGap <= 0.08, `${language}: cue-rate gap remains ${(cueGap * 100).toFixed(1)} percentage points`);
}

const profileMeta = Object.fromEntries(STA_V4_PRESENTATION_PROFILES.map((profile) => [profile.profileId, profile]));
let generated = 0;
let parityChecks = 0;
let deterministicChecks = 0;
const reached = new Set<string>();
const answerPositions: Record<StaV4ProfileId, number[]> = Object.fromEntries(
  STA_V4_PROFILE_IDS.map((profileId) => [profileId, Array(profileMeta[profileId]!.optionCount).fill(0)]),
) as Record<StaV4ProfileId, number[]>;

for (const qlId of STA_V4_QL_IDS) {
  for (const profileId of STA_V4_PROFILE_IDS) {
    for (let index = 0; index < 256; index += 1) {
      const seed = `sta-v4:${qlId}:${profileId}:${index}`;
      const english = generateStaV4Question({ seed, locale: "en-IN", profileId, qlId });
      const hindi = generateStaV4Question({ seed, locale: "hi-IN", profileId, qlId });
      const punjabi = generateStaV4Question({ seed, locale: "pa-IN", profileId, qlId });
      for (const question of [english, hindi, punjabi]) {
        assertStaV4QuestionIntegrity(question);
        assert.equal(question.candidateCount, profileMeta[profileId]!.candidateCount);
        assert.equal(question.optionCount, profileMeta[profileId]!.optionCount);
        assert.equal(question.explanation.includes(question.statement), false, `${question.questionId}: explanation repeats full stem`);
        assert.ok(question.explanation.trim().split(/\s+/u).length <= 180, `${question.questionId}: explanation too long`);
        reached.add(question.scenarioId);
        generated += 1;
      }
      for (const translated of [hindi, punjabi]) {
        assert.equal(translated.qlId, english.qlId, `${seed}: QL changed across locale`);
        assert.equal(translated.checkpointId, english.checkpointId, `${seed}: checkpoint changed across locale`);
        assert.equal(translated.presentationProfile, english.presentationProfile, `${seed}: profile changed across locale`);
        assert.equal(translated.scenarioId, english.scenarioId, `${seed}: scenario changed across locale`);
        assert.equal(translated.canonicalItemId, english.canonicalItemId, `${seed}: canonical identity changed across locale`);
        assert.equal(translated.contentFingerprint, english.contentFingerprint, `${seed}: fingerprint changed across locale`);
        assert.deepEqual(translated.candidates.map((candidate) => candidate.candidateId), english.candidates.map((candidate) => candidate.candidateId), `${seed}: candidate identities changed across locale`);
        assert.deepEqual(translated.candidates.map((candidate) => candidate.classification), english.candidates.map((candidate) => candidate.classification), `${seed}: candidate truth changed across locale`);
        assert.deepEqual(translated.answerSet, english.answerSet, `${seed}: answer set changed across locale`);
        assert.deepEqual(translated.options.map((option) => option.semanticAnswerSet), english.options.map((option) => option.semanticAnswerSet), `${seed}: coded options changed across locale`);
        parityChecks += 1;
      }
      assert.deepEqual(
        english,
        generateStaV4Question({ seed, locale: "en-IN", profileId, qlId }),
        `${seed}: deterministic replay drift`,
      );
      deterministicChecks += 1;
      answerPositions[profileId]![english.answerIndex] += 1;
    }
  }
}

assert.equal(reached.size, 108, "stress generation did not reach the complete V4 semantic authority pool");
for (const profileId of STA_V4_PROFILE_IDS) {
  const counts = answerPositions[profileId]!;
  const total = counts.reduce((sum, value) => sum + value, 0);
  for (const count of counts) {
    const share = count / total;
    assert.ok(share >= 0.08 && share <= 0.42, `${profileId}: answer-position share ${(share * 100).toFixed(1)}% outside V4 envelope`);
  }
}

// Surface-space lower bound ignores statement paraphrase order beyond three stems,
// yet still requires a genuinely large pool from candidate identity + wording + option order.
function permutations(n: number, k: number): number {
  let value = 1;
  for (let index = 0; index < k; index += 1) value *= n - index;
  return value;
}
function factorial(n: number): number {
  let value = 1;
  for (let index = 2; index <= n; index += 1) value *= index;
  return value;
}
let theoreticalSurfaceLowerBoundPerLanguage = 0;
for (const profile of STA_V4_PRESENTATION_PROFILES) {
  theoreticalSurfaceLowerBoundPerLanguage += 108
    * 3
    * permutations(5, profile.candidateCount)
    * (2 ** profile.candidateCount)
    * factorial(profile.optionCount);
}
assert.ok(theoreticalSurfaceLowerBoundPerLanguage > 10_000_000, `V4 surface lower bound too small: ${theoreticalSurfaceLowerBoundPerLanguage}`);

for (const qlId of STA_V4_QL_IDS) {
  const seed = `sta-v4-studio-parity:${qlId}`;
  const previews = Object.fromEntries(STA_V4_LANGUAGES.map((language) => [language, previewSta001QuestionStudioReview({
    language,
    qlId,
    profileId: "BANK_3X5",
    seed,
    count: 8,
  }).questions]));
  for (let index = 0; index < 8; index += 1) {
    const en = previews.en![index]!;
    for (const language of ["hi", "pa"] as const) {
      const translated = previews[language]![index]!;
      assert.equal(translated.canonicalItemId, en.canonicalItemId, `${qlId}/${index}: Studio canonical item changed in ${language}`);
      assert.equal(translated.contentFingerprint, en.contentFingerprint, `${qlId}/${index}: Studio fingerprint changed in ${language}`);
      assert.deepEqual(translated.candidates.map((candidate) => candidate.candidateId), en.candidates.map((candidate) => candidate.candidateId), `${qlId}/${index}: Studio candidate identities changed in ${language}`);
      assert.deepEqual(translated.answerSet, en.answerSet, `${qlId}/${index}: Studio answer changed in ${language}`);
    }
  }
}

console.log("PASS_STA_001_EXAM_REALNESS_V4");
console.log(JSON.stringify({
  semanticAuthorities: STA_V4_SCENARIOS.length,
  authoritiesPerQl: Object.fromEntries(STA_V4_QL_IDS.map((qlId) => [qlId, STA_V4_SCENARIOS_BY_QL[qlId].length])),
  qlCount: STA_V4_QL_IDS.length,
  profiles: STA_V4_PROFILE_IDS.length,
  languages: STA_V4_LANGUAGES.length,
  generated,
  parityChecks,
  deterministicChecks,
  reachedScenarioCount: reached.size,
  theoreticalSurfaceLowerBoundPerLanguage,
  cueStats,
  answerPositions,
  lifecycle: {
    reviewOnly: true,
    multilingualChapterFrozen: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  },
}, null, 2));
