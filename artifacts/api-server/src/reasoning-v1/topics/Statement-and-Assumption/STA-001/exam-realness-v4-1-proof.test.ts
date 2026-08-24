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
} from "./exam-realness-v4-1-runtime.ts";
import {
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSta001QuestionStudioReview,
} from "./question-studio-review-v4-1.ts";

const LOCALE_BY_LANGUAGE: Record<StaV4Language, StaV4Locale> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };

assert.equal(STA_V4_SCENARIOS.length, 108, "V4.1 must expose 108 genuine scenario authorities");
assert.equal(new Set(STA_V4_SCENARIOS.map((item) => item.scenarioId)).size, 108, "V4.1 scenario IDs must be unique");
for (const qlId of STA_V4_QL_IDS) {
  const pool = STA_V4_SCENARIOS_BY_QL[qlId];
  assert.equal(pool.length, 18, `${qlId}: expected 18 V4.1 authorities`);
  assert.equal(new Set(pool.map((item) => item.domain)).size, 18, `${qlId}: contexts are being inflated by wording rotation rather than distinct domains`);
}
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, STA_V4_QL_IDS);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, false);
for (const flag of [
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication,
]) assert.equal(flag, false);

const seenDifficulties = new Set<string>();
const cueStats = Object.fromEntries(STA_V4_LANGUAGES.map((language) => [language, {
  implicit: 0,
  notImplicit: 0,
  implicitCue: 0,
  notImplicitCue: 0,
  heuristicCovered: 0,
  heuristicCorrect: 0,
}])) as Record<StaV4Language, { implicit: number; notImplicit: number; implicitCue: number; notImplicitCue: number; heuristicCovered: number; heuristicCorrect: number }>;

function shortcutGuess(text: string, language: StaV4Language): "IMPLICIT" | "NOT_IMPLICIT" | null {
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
  assert.equal(scenario.statementVariants.length, 3, `${scenario.scenarioId}: expected three authored statement surfaces`);
  assert.equal(scenario.candidates.length, 7, `${scenario.scenarioId}: expected seven candidate authorities`);
  assert.equal(scenario.candidates.filter((candidate) => candidate.classification === "IMPLICIT").length, 3, `${scenario.scenarioId}: expected three genuine dependencies`);
  assert.equal(scenario.candidates.filter((candidate) => candidate.classification === "NOT_IMPLICIT").length, 4, `${scenario.scenarioId}: expected four subtle distractors`);
  assert.equal(new Set(scenario.candidates.map((candidate) => candidate.candidateId)).size, 7, `${scenario.scenarioId}: duplicate candidate authority`);
  seenDifficulties.add(scenario.difficulty);
  for (const language of STA_V4_LANGUAGES) {
    for (const candidate of scenario.candidates) {
      for (const wording of candidate.textVariants) {
        const text = wording[language];
        const stats = cueStats[language];
        if (candidate.classification === "IMPLICIT") stats.implicit += 1;
        else stats.notImplicit += 1;
        const cue = staV4CueSignalCount(text, language) > 0;
        if (candidate.classification === "IMPLICIT" && cue) stats.implicitCue += 1;
        if (candidate.classification === "NOT_IMPLICIT" && cue) stats.notImplicitCue += 1;
        const guess = shortcutGuess(text, language);
        if (guess) {
          stats.heuristicCovered += 1;
          if (guess === candidate.classification) stats.heuristicCorrect += 1;
        }
      }
    }
  }
}
assert.deepEqual([...seenDifficulties].sort(), [...STA_V4_DIFFICULTIES].sort());

for (const language of STA_V4_LANGUAGES) {
  const stats = cueStats[language];
  const total = stats.implicit + stats.notImplicit;
  const coverage = stats.heuristicCovered / total;
  const implicitCueRate = stats.implicitCue / stats.implicit;
  const notImplicitCueRate = stats.notImplicitCue / stats.notImplicit;
  const cueGap = Math.abs(implicitCueRate - notImplicitCueRate);
  assert.ok(coverage <= 0.12, `${language}: legacy lexical shortcut covers ${(coverage * 100).toFixed(2)}% of V4.1 candidate surfaces`);
  assert.ok(cueGap <= 0.06, `${language}: correctness/cue gap is ${(cueGap * 100).toFixed(2)} percentage points`);
}

const profileById = Object.fromEntries(STA_V4_PRESENTATION_PROFILES.map((profile) => [profile.profileId, profile])) as Record<StaV4ProfileId, (typeof STA_V4_PRESENTATION_PROFILES)[number]>;
const answerPositions = Object.fromEntries(STA_V4_PROFILE_IDS.map((profileId) => [profileId, Array(profileById[profileId].optionCount).fill(0)])) as Record<StaV4ProfileId, number[]>;
const cardinalities = Object.fromEntries(STA_V4_PROFILE_IDS.map((profileId) => [profileId, new Map<number, number>()])) as Record<StaV4ProfileId, Map<number, number>>;
const reached = new Set<string>();
let generated = 0;
let parityChecks = 0;
let deterministicChecks = 0;

for (const qlId of STA_V4_QL_IDS) {
  for (const profileId of STA_V4_PROFILE_IDS) {
    for (let index = 0; index < 256; index += 1) {
      const seed = `sta-v4-1:${qlId}:${profileId}:${index}`;
      const en = generateStaV4Question({ seed, locale: "en-IN", profileId, qlId });
      const hi = generateStaV4Question({ seed, locale: "hi-IN", profileId, qlId });
      const pa = generateStaV4Question({ seed, locale: "pa-IN", profileId, qlId });
      for (const question of [en, hi, pa]) {
        assertStaV4QuestionIntegrity(question);
        assert.equal(question.candidateCount, profileById[profileId].candidateCount);
        assert.equal(question.optionCount, profileById[profileId].optionCount);
        assert.ok(question.explanation.trim().split(/\s+/u).length <= 190, `${question.questionId}: explanation too long`);
        reached.add(question.scenarioId);
        generated += 1;
      }
      for (const translated of [hi, pa]) {
        assert.equal(translated.qlId, en.qlId, `${seed}: QL drift across locale`);
        assert.equal(translated.checkpointId, en.checkpointId, `${seed}: checkpoint drift across locale`);
        assert.equal(translated.presentationProfile, en.presentationProfile, `${seed}: profile drift across locale`);
        assert.equal(translated.scenarioId, en.scenarioId, `${seed}: scenario drift across locale`);
        assert.equal(translated.canonicalItemId, en.canonicalItemId, `${seed}: canonical identity drift across locale`);
        assert.equal(translated.contentFingerprint, en.contentFingerprint, `${seed}: content fingerprint drift across locale`);
        assert.equal(translated.questionId, en.questionId, `${seed}: question identity drift across locale`);
        assert.deepEqual(translated.candidates.map((candidate) => candidate.candidateId), en.candidates.map((candidate) => candidate.candidateId), `${seed}: candidate identity drift across locale`);
        assert.deepEqual(translated.candidates.map((candidate) => candidate.classification), en.candidates.map((candidate) => candidate.classification), `${seed}: candidate truth drift across locale`);
        assert.deepEqual(translated.answerSet, en.answerSet, `${seed}: answer drift across locale`);
        assert.deepEqual(translated.options.map((option) => option.semanticAnswerSet), en.options.map((option) => option.semanticAnswerSet), `${seed}: option-semantic drift across locale`);
        parityChecks += 1;
      }
      assert.deepEqual(en, generateStaV4Question({ seed, locale: "en-IN", profileId, qlId }), `${seed}: deterministic replay drift`);
      deterministicChecks += 1;
      answerPositions[profileId][en.answerIndex] += 1;
      const map = cardinalities[profileId];
      map.set(en.answerSet.length, (map.get(en.answerSet.length) ?? 0) + 1);
    }
  }
}

assert.equal(reached.size, 108, "stress generation failed to reach all 108 V4.1 authorities");
for (const profileId of STA_V4_PROFILE_IDS) {
  const positions = answerPositions[profileId];
  const total = positions.reduce((sum, count) => sum + count, 0);
  for (const count of positions) {
    const share = count / total;
    assert.ok(share >= 0.08 && share <= 0.42, `${profileId}: answer-position share ${(share * 100).toFixed(2)}% outside V4.1 envelope`);
  }
  const counts = cardinalities[profileId];
  assert.ok(counts.size >= 2, `${profileId}: answer cardinality is shortcut-learnable (${[...counts.keys()].join(",")})`);
  const maxShare = Math.max(...counts.values()) / [...counts.values()].reduce((sum, count) => sum + count, 0);
  assert.ok(maxShare <= 0.70, `${profileId}: one answer cardinality dominates at ${(maxShare * 100).toFixed(2)}%`);
}
assert.deepEqual([...cardinalities.BANK_5X5.keys()].sort(), [1, 2, 3], "BANK_5X5 must naturally reach one-, two- and three-implicit states");

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
  theoreticalSurfaceLowerBoundPerLanguage += 108 * 3 * permutations(7, profile.candidateCount) * (2 ** profile.candidateCount) * factorial(profile.optionCount);
}
assert.ok(theoreticalSurfaceLowerBoundPerLanguage > 100_000_000, `V4.1 conservative surface lower bound too small: ${theoreticalSurfaceLowerBoundPerLanguage}`);

for (const qlId of STA_V4_QL_IDS) {
  const seed = `sta-v4-1-studio-parity:${qlId}`;
  const previews = Object.fromEntries(STA_V4_LANGUAGES.map((language) => [language, previewSta001QuestionStudioReview({ language, qlId, profileId: "BANK_3X5", seed, count: 8 }).questions])) as Record<StaV4Language, ReturnType<typeof previewSta001QuestionStudioReview>["questions"]>;
  for (let index = 0; index < 8; index += 1) {
    const en = previews.en[index]!;
    for (const language of ["hi", "pa"] as const) {
      const translated = previews[language][index]!;
      assert.equal(translated.canonicalItemId, en.canonicalItemId, `${qlId}/${index}: Studio canonical identity drift in ${language}`);
      assert.equal(translated.contentFingerprint, en.contentFingerprint, `${qlId}/${index}: Studio fingerprint drift in ${language}`);
      assert.deepEqual(translated.candidates.map((candidate) => candidate.candidateId), en.candidates.map((candidate) => candidate.candidateId), `${qlId}/${index}: Studio candidate identity drift in ${language}`);
      assert.deepEqual(translated.answerSet, en.answerSet, `${qlId}/${index}: Studio answer drift in ${language}`);
    }
  }
}

console.log("PASS_STA_001_EXAM_REALNESS_V4_1");
console.log(JSON.stringify({
  runtime: "EXAM_REALNESS_V4_1",
  semanticAuthorities: STA_V4_SCENARIOS.length,
  authoritiesPerQl: Object.fromEntries(STA_V4_QL_IDS.map((qlId: StaV4QlId) => [qlId, STA_V4_SCENARIOS_BY_QL[qlId].length])),
  candidateAuthoritiesPerScenario: 7,
  requiredDependenciesPerScenario: 3,
  subtleDistractorsPerScenario: 4,
  qlCount: STA_V4_QL_IDS.length,
  profiles: STA_V4_PROFILE_IDS.length,
  languages: STA_V4_LANGUAGES.length,
  generated,
  parityChecks,
  deterministicChecks,
  reachedScenarioCount: reached.size,
  theoreticalSurfaceLowerBoundPerLanguage,
  cueStats,
  cardinalities: Object.fromEntries(STA_V4_PROFILE_IDS.map((profileId) => [profileId, Object.fromEntries(cardinalities[profileId])])),
  answerPositions,
  lifecycle: { reviewOnly: true, multilingualChapterFrozen: false, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false },
}, null, 2));
