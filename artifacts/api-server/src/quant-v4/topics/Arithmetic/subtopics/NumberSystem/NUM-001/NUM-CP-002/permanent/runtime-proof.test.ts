import assert from "node:assert/strict";
import {
  NUM_CP002_PERMANENT_ALLOCATION,
  NUM_CP002_PERMANENT_QL_IDS,
} from "./allocation";
import {
  getNumCp002PermanentDifficultyBands,
  independentlyVerifyNumCp002TemporaryAuthority,
  runNumCp002PermanentPipeline,
} from "./runtime";

const expectedInScopePrototypes = new Set(
  NUM_CP002_PERMANENT_ALLOCATION.flatMap((entry) => [
    ...entry.corePrototypeIds,
    ...entry.adapterPrototypeIds,
  ]),
);
assert.equal(expectedInScopePrototypes.size, 30, "CP002 in-scope prototype count");
assert.equal(expectedInScopePrototypes.has("NUM-CP002-PROT-027"), false, "delegated P027 must not be permanent");
assert.equal(expectedInScopePrototypes.has("NUM-CP002-PROT-028"), false, "delegated P028 must not be permanent");

const answerPositions = new Map<string, Set<number>>();
const difficultyReach = new Map<string, Set<string>>();
const prototypeReach = new Set<string>();
const fingerprints = new Set<string>();
let generated = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let editorialChecks = 0;

const bannedLearnerLanguage = /\b(?:In this question|admissible|topology|candidate-set|residue condition|universal guarantee|sharpness check|rational decimal)\b/iu;
const rawSlashFraction = /(?<!\\frac\{)\b\d+\/\d+\b/u;
const unicodeMath = /[√²³]/u;
const internalIdentityLeak = /NUM-(?:CP|QL)|PROT-|solveMode|authorityId|qlTemplateId/iu;

for (const qlId of NUM_CP002_PERMANENT_QL_IDS) {
  answerPositions.set(qlId, new Set());
  difficultyReach.set(qlId, new Set());
  const allowedBands = new Set(getNumCp002PermanentDifficultyBands(qlId));

  for (let seed = 1; seed <= 120; seed += 1) {
    const q = runNumCp002PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" });
    const replay = runNumCp002PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" });
    generated += 1;

    assert.deepEqual(q, replay, `${qlId}/${seed}: deterministic replay`);
    replayChecks += 1;

    const independentlyVerified = independentlyVerifyNumCp002TemporaryAuthority(q.temporaryPrototypeId, q.hiddenState);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${qlId}/${seed}: canonical/verifier mismatch`);
    assert.equal(q.canonicalAnswer, independentlyVerified, `${qlId}/${seed}: independent verifier mismatch`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${qlId}/${seed}: option count`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${qlId}/${seed}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${qlId}/${seed}: correct option count`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${qlId}/${seed}: correct index mismatch`);
    for (const [index, option] of q.options.entries()) {
      if (index !== q.correctIndex) assert.ok(option.misconceptionId, `${qlId}/${seed}: missing distractor misconception ID`);
    }
    optionChecks += 1;

    assert.equal(q.permanentQlId, qlId, `${qlId}/${seed}: permanent identity`);
    assert.equal(q.questionLanguageId, qlId, `${qlId}/${seed}: question-language identity`);
    assert.equal(q.language, "en", `${qlId}/${seed}: language`);
    assert.equal(q.locale, "en-IN", `${qlId}/${seed}: locale`);
    assert.equal(q.permanentIdentityFrozen, true, `${qlId}/${seed}: identity freeze`);
    assert.equal(q.solveModeFrozen, true, `${qlId}/${seed}: solve-mode freeze`);
    assert.equal(q.englishImplementationFrozen, true, `${qlId}/${seed}: English freeze`);
    assert.equal(q.maturity, "ENGLISH_IMPLEMENTATION_FROZEN", `${qlId}/${seed}: maturity`);
    assert.equal(q.reviewStatus, "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW", `${qlId}/${seed}: review status`);
    assert.equal(q.lifecycle.active, false, `${qlId}/${seed}: active leak`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${qlId}/${seed}: Question Studio leak`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${qlId}/${seed}: Question Bank leak`);
    assert.equal(q.lifecycle.testEligible, false, `${qlId}/${seed}: test leak`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${qlId}/${seed}: public leak`);
    lifecycleChecks += 1;

    assert.ok(allowedBands.has(q.difficulty), `${qlId}/${seed}: difficulty outside editorial band`);
    difficultyReach.get(qlId)!.add(q.difficulty);
    answerPositions.get(qlId)!.add(q.correctIndex);
    prototypeReach.add(q.temporaryPrototypeId);
    fingerprints.add(q.mathematicalFingerprint);

    const learnerSurface = [
      q.stem,
      ...q.options.map((option) => option.value),
      q.explanation.concept ?? "",
      ...q.explanation.solution,
      q.explanation.finalAnswer,
    ].join("\n");
    assert.equal(bannedLearnerLanguage.test(learnerSurface), false, `${qlId}/${seed}: banned learner wording`);
    assert.equal(rawSlashFraction.test(learnerSurface), false, `${qlId}/${seed}: raw slash fraction`);
    assert.equal(unicodeMath.test(learnerSurface), false, `${qlId}/${seed}: unicode math`);
    assert.equal(internalIdentityLeak.test(learnerSurface), false, `${qlId}/${seed}: internal identity leak`);
    assert.ok(q.explanation.solution.length >= 1 && q.explanation.solution.length <= 3, `${qlId}/${seed}: explanation line count`);
    assert.ok((q.explanation.concept?.length ?? 0) <= 220, `${qlId}/${seed}: concept too long`);
    assert.ok(q.stem.length <= 520, `${qlId}/${seed}: stem too long`);
    const explanationLength = [q.explanation.concept ?? "", ...q.explanation.solution, q.explanation.finalAnswer].join(" ").length;
    assert.ok(explanationLength <= 900, `${qlId}/${seed}: explanation too long`);
    editorialChecks += 1;
  }

  assert.deepEqual([...answerPositions.get(qlId)!].sort(), [0, 1, 2, 3], `${qlId}: answer-position reach`);
  assert.deepEqual(
    [...difficultyReach.get(qlId)!].sort(),
    [...allowedBands].sort(),
    `${qlId}: configured difficulty-band reach`,
  );
}

assert.equal(generated, 21 * 120, "generated permanent question count");
assert.equal(replayChecks, generated, "replay proof count");
assert.equal(verifierChecks, generated, "verifier proof count");
assert.equal(optionChecks, generated, "option proof count");
assert.equal(lifecycleChecks, generated, "lifecycle proof count");
assert.equal(editorialChecks, generated, "editorial proof count");
assert.deepEqual([...prototypeReach].sort(), [...expectedInScopePrototypes].sort(), "all in-scope prototypes must be reachable");
assert.ok(fingerprints.size >= 250, `permanent mathematical diversity too low: ${fingerprints.size}`);

assert.throws(
  () => runNumCp002PermanentPipeline({ questionLanguageId: "NUM-QL-145", seed: 1, language: "hi" as never }),
  /only supports English/,
  "unsupported language must be rejected before localization freeze",
);
assert.throws(
  () => runNumCp002PermanentPipeline({ questionLanguageId: "NUM-QL-145", seed: 0 }),
  /positive integer/,
  "non-positive seed must be rejected",
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP002_PERMANENT_ENGLISH_RUNTIME",
  permanentQlCount: NUM_CP002_PERMANENT_QL_IDS.length,
  generated,
  replayChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  editorialChecks,
  reachablePrototypeCount: prototypeReach.size,
  uniqueMathematicalFingerprints: fingerprints.size,
  answerPositions: Object.fromEntries([...answerPositions].map(([qlId, values]) => [qlId, [...values].sort()])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([qlId, values]) => [qlId, [...values].sort()])),
  permanentQlRange: "NUM-QL-145..NUM-QL-165",
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
