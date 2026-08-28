import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { SRI_PERMANENT_ALLOCATION_V1 } from "../permanent-allocation-v1";
import { SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1, buildSriPermanentEnglishReviewCorpusV1 } from "../permanent-english-review-v1";
import { generateSriPermanentEnglishQuestionV1 } from "../permanent-runtime-v1";
import {
  generateSriPermanentLocalizedQuestionV1,
  localizeSriDiscoveryQuestionV1,
  type SriLocalizedLocaleV1,
} from "../permanent-localization-v1";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly SriLocalizedLocaleV1[];
const SEEDS_PER_QL = 24;
const EXPECTED_QLS = 58;
const EXPECTED_REVIEW_MEMBERS = 92;
const EXPECTED_REVIEW_ROWS = 184;

const NATIVE_SCRIPT: Record<SriLocalizedLocaleV1, RegExp> = {
  "hi-IN": /\p{Script=Devanagari}/u,
  "pa-IN": /\p{Script=Gurmukhi}/u,
};

const FOREIGN_SCRIPT: Record<SriLocalizedLocaleV1, RegExp> = {
  "hi-IN": /\p{Script=Gurmukhi}/u,
  "pa-IN": /\p{Script=Devanagari}/u,
};

const BANNED_ENGLISH = /\b(?:simplify|evaluate|find|determine|which|what|write|reduce|expand|multiply|divide|compare|arrange|classify|choose|extract|given|using|from|when|value|values|expression|expressions|exponent|exponents|base|bases|root|roots|radical|radicals|surd|surds|rational|irrational|conjugate|coefficient|coefficients|radicand|equation|statement|statements|result|results|factor|factors|power|powers|positive|negative|real|true|false|defined|undefined|common|same|greater|smaller|larger|equal|exact|exactly|first|second|therefore|hence|thus|since|because|canonical|form|term|terms|law|laws|condition|conditions|solution|solutions|denominator|numerator|reciprocal|integer|increasing|order|requested|supplied|known|normalize|rewrite|convert|substitute|apply|add|subtract|combined|total|net|method|quantity|quantities|classification|match|denest|rationalise|rationalize|bound|bounds|bounded|take|then|without|decimal|decimals|truth|number|numbers|zero|nonzero|indicated|corresponding|requires|required|require|supply|supplies|contributes|contribution|collect|parts|pair|pairs|surrounding|consecutive|perfect|square|squares|cube|cubes|visible|reverse|recover|involved|transferring|operation|operations|composite|prime|signed|odd|even|inside|outside|before|after|both|each|only|not|all)\b/giu;

const INTERNAL_LEAK = /SRI-(?:00[12]-)?(?:QL|SM|RG)-|PROVISIONAL_DISCOVERY|canonicalSolverKey|independentVerifierKey|solverVerifierAgree|proofEvents/iu;

assert.equal(SRI_PERMANENT_ALLOCATION_V1.length, EXPECTED_QLS);
assert.equal(SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.length, EXPECTED_REVIEW_MEMBERS);
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, EXPECTED_QLS);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, EXPECTED_QLS);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen, true);
assertSriReleaseLocks();

let generated = 0;
let parityChecks = 0;
let deepFrozenObjects = 0;
let nativeScriptChecks = 0;
let mathSkeletonChecks = 0;
const nativeScriptFailures = new Set<string>();
const foreignScriptFailures = new Set<string>();
const residualFailures = new Set<string>();
const sourceCandidatesSeen = new Set<string>();

for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
  for (let seedIndex = 0; seedIndex < SEEDS_PER_QL; seedIndex += 1) {
    const externalSeed = `phase9-localization:${seedIndex}`;
    const english = generateSriPermanentEnglishQuestionV1(allocation.qlId, externalSeed);
    for (const locale of LOCALES) {
      const localized = generateSriPermanentLocalizedQuestionV1(allocation.qlId, externalSeed, locale);
      const repeat = generateSriPermanentLocalizedQuestionV1(allocation.qlId, externalSeed, locale);
      generated += 1;
      sourceCandidatesSeen.add(localized.sourceCandidateId);

      assert.deepEqual(repeat, localized, `${allocation.qlId}/${externalSeed}/${locale}: non-deterministic localization`);
      assert.equal(localized.permanentQlId, english.permanentQlId);
      assert.equal(localized.permanentSolveModeId, english.permanentSolveModeId);
      assert.equal(localized.packageId, english.packageId);
      assert.equal(localized.checkpointId, english.checkpointId);
      assert.equal(localized.retainedGroupId, english.retainedGroupId);
      assert.equal(localized.sourceCandidateId, english.sourceCandidateId);
      assert.equal(localized.sourceCheckpointId, english.sourceCheckpointId);
      assert.equal(localized.sourceSeed, english.sourceSeed);
      assert.equal(localized.englishFingerprint, english.englishFingerprint);
      parityChecks += 9;

      const enQ = english.question;
      const q = localized.question;
      assert.equal(q.packageId, enQ.packageId);
      assert.equal(q.checkpointId, enQ.checkpointId);
      assert.equal(q.candidateId, enQ.candidateId);
      assert.equal(q.seed, enQ.seed);
      assert.deepEqual(q.state, enQ.state);
      assert.equal(q.answer.canonicalKey, enQ.answer.canonicalKey);
      assert.deepEqual(q.options.map((item) => item.canonicalKey), enQ.options.map((item) => item.canonicalKey));
      assert.deepEqual(q.options.map((item) => item.misconceptionId), enQ.options.map((item) => item.misconceptionId));
      assert.equal(q.correctIndex, enQ.correctIndex);
      assert.deepEqual(q.proofEvents, enQ.proofEvents);
      assert.deepEqual(q.verification, enQ.verification);
      parityChecks += 11;

      assert.equal(q.options[q.correctIndex]?.canonicalKey, q.answer.canonicalKey);
      assert.equal(q.verification.solverVerifierAgree, true);
      assert.equal(q.verification.exactlyOneCorrectOption, true);
      assert.equal(q.verification.domainValid, true);

      const pairs = [
        [enQ.stem, q.stem],
        [enQ.answer.text, q.answer.text],
        [enQ.explanation.given, q.explanation.given],
        [enQ.explanation.asked, q.explanation.asked],
        [enQ.explanation.method, q.explanation.method],
        [enQ.explanation.answer, q.explanation.answer],
        ...enQ.options.map((option, index) => [option.text, q.options[index]!.text] as const),
        ...enQ.explanation.working.map((line, index) => [line, q.explanation.working[index]!] as const),
      ] as const;
      for (const [sourceText, localizedText] of pairs) {
        assert.deepEqual(mathSkeleton(localizedText), mathSkeleton(sourceText), `${allocation.qlId}/${locale}: visible math skeleton drifted\nEN: ${sourceText}\nLO: ${localizedText}`);
        mathSkeletonChecks += 1;
      }

      for (const text of [q.stem, q.explanation.asked, q.explanation.method]) {
        if (!NATIVE_SCRIPT[locale].test(text) && nativeScriptFailures.size < 160) {
          nativeScriptFailures.add(`${allocation.qlId}/${q.candidateId}/${locale}: expected native script :: ${text}`);
        }
        nativeScriptChecks += 1;
      }

      const learnerText = [
        q.stem,
        ...q.options.map((option) => option.text),
        q.explanation.given,
        q.explanation.asked,
        q.explanation.method,
        ...q.explanation.working,
        q.explanation.answer,
      ].join("\n");
      assert.equal(INTERNAL_LEAK.test(learnerText), false, `${allocation.qlId}/${locale}: internal metadata leaked`);
      INTERNAL_LEAK.lastIndex = 0;
      if (FOREIGN_SCRIPT[locale].test(learnerText) && foreignScriptFailures.size < 160) {
        foreignScriptFailures.add(`${allocation.qlId}/${q.candidateId}/${locale}: foreign native script leaked :: ${learnerText.replaceAll("\n", " | ")}`);
      }
      FOREIGN_SCRIPT[locale].lastIndex = 0;
      const residues = [...learnerText.matchAll(BANNED_ENGLISH)].map((match) => match[0].toLowerCase());
      BANNED_ENGLISH.lastIndex = 0;
      if (residues.length > 0 && residualFailures.size < 160) {
        residualFailures.add(`${allocation.qlId}/${q.candidateId}/${locale}: ${[...new Set(residues)].join(", ")} :: ${learnerText.replaceAll("\n", " | ")}`);
      }

      // The approved localization generator remains the immutable review source.
      // Frozen product authority is provided by permanent-multilingual-freeze-v1.ts.
      assert.equal(localized.lifecycle.reviewStatus, "LOCALIZATION_REVIEW_READY");
      assert.equal(localized.lifecycle.localizationStatus, "REVIEW_READY");
      assert.equal(localized.lifecycle.active, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);

      deepFrozenObjects += assertDeepFrozen(localized);
    }
  }
}

assert.equal(generated, EXPECTED_QLS * SEEDS_PER_QL * LOCALES.length);

const reviewCorpus = buildSriPermanentEnglishReviewCorpusV1(2);
assert.equal(reviewCorpus.length, EXPECTED_REVIEW_ROWS);
assert.equal(new Set(reviewCorpus.map((row) => row.memberCandidateId)).size, EXPECTED_REVIEW_MEMBERS);
let localizedReviewRows = 0;
for (const row of reviewCorpus) {
  for (const locale of LOCALES) {
    const q = localizeSriDiscoveryQuestionV1(row.question, locale);
    localizedReviewRows += 1;
    assert.equal(q.candidateId, row.memberCandidateId);
    assert.deepEqual(q.state, row.question.state);
    assert.equal(q.answer.canonicalKey, row.question.answer.canonicalKey);
    assert.equal(q.correctIndex, row.question.correctIndex);
    assert.deepEqual(q.verification, row.question.verification);

    const reviewPairs = [
      [row.question.stem, q.stem],
      [row.question.answer.text, q.answer.text],
      [row.question.explanation.given, q.explanation.given],
      [row.question.explanation.asked, q.explanation.asked],
      [row.question.explanation.method, q.explanation.method],
      [row.question.explanation.answer, q.explanation.answer],
      ...row.question.options.map((option, index) => [option.text, q.options[index]!.text] as const),
      ...row.question.explanation.working.map((line, index) => [line, q.explanation.working[index]!] as const),
    ] as const;
    for (const [sourceText, localizedText] of reviewPairs) {
      assert.deepEqual(mathSkeleton(localizedText), mathSkeleton(sourceText), `${row.qlId}/${row.memberCandidateId}/${locale}: review-corpus math skeleton drifted\nEN: ${sourceText}\nLO: ${localizedText}`);
      mathSkeletonChecks += 1;
    }

    for (const text of [q.stem, q.explanation.asked, q.explanation.method]) {
      if (!NATIVE_SCRIPT[locale].test(text) && nativeScriptFailures.size < 160) {
        nativeScriptFailures.add(`${row.qlId}/${row.memberCandidateId}/${locale}: review corpus expected native script :: ${text}`);
      }
      nativeScriptChecks += 1;
    }

    const reviewLearnerText = [
      q.stem,
      ...q.options.map((option) => option.text),
      q.explanation.given,
      q.explanation.asked,
      q.explanation.method,
      ...q.explanation.working,
      q.explanation.answer,
    ].join("\n");
    assert.equal(INTERNAL_LEAK.test(reviewLearnerText), false, `${row.qlId}/${row.memberCandidateId}/${locale}: review corpus internal metadata leaked`);
    INTERNAL_LEAK.lastIndex = 0;
    if (FOREIGN_SCRIPT[locale].test(reviewLearnerText) && foreignScriptFailures.size < 160) {
      foreignScriptFailures.add(`${row.qlId}/${row.memberCandidateId}/${locale}: review corpus foreign native script leaked :: ${reviewLearnerText.replaceAll("\n", " | ")}`);
    }
    FOREIGN_SCRIPT[locale].lastIndex = 0;
    const reviewResidues = [...reviewLearnerText.matchAll(BANNED_ENGLISH)].map((match) => match[0].toLowerCase());
    BANNED_ENGLISH.lastIndex = 0;
    if (reviewResidues.length > 0 && residualFailures.size < 160) {
      residualFailures.add(`${row.qlId}/${row.memberCandidateId}/${locale}: review corpus ${[...new Set(reviewResidues)].join(", ")} :: ${reviewLearnerText.replaceAll("\n", " | ")}`);
    }
  }
}
assert.equal(localizedReviewRows, EXPECTED_REVIEW_ROWS * LOCALES.length);

const localizationQualityFailures = [...nativeScriptFailures, ...foreignScriptFailures, ...residualFailures];
assert.deepEqual(localizationQualityFailures, [], `Localized learner text failed language-quality gates:\n${localizationQualityFailures.join("\n")}`);

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_LOCALIZATION_V1",
  permanentQls: EXPECTED_QLS,
  locales: LOCALES,
  runtimeSeedsPerQl: SEEDS_PER_QL,
  localizedRuntimeQuestions: generated,
  englishReviewRows: EXPECTED_REVIEW_ROWS,
  localizedReviewRows,
  prototypeAncestryMembers: EXPECTED_REVIEW_MEMBERS,
  sourceCandidatesSeenInRuntimeWindow: sourceCandidatesSeen.size,
  parityChecks,
  mathSkeletonChecks,
  nativeScriptChecks,
  deepFrozenObjects,
  multilingualFrozen: SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen,
  downstreamReleaseEnabled: false,
}, null, 2));

function mathSkeleton(text: string): readonly string[] {
  // A hyphen joining two language words (for example Hindi “कौन-सा”) is prose,
  // not subtraction. Strip only letter-letter hyphens; mathematical negatives and
  // subtraction such as -2, x-3 and (a-b) remain visible to the parity audit.
  const withoutLinguisticHyphens = text.replace(/(?<=[\p{L}\p{M}])-(?=[\p{L}\p{M}])/gu, "");
  return withoutLinguisticHyphens.match(/\\[A-Za-z]+|\d+(?:\.\d+)?|[=+\-−×÷*/^<>≤≥≠(){}\[\]]/gu) ?? [];
}

function assertDeepFrozen(value: unknown, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  const objectValue = value as object;
  if (seen.has(objectValue)) return 0;
  seen.add(objectValue);
  assert.equal(Object.isFrozen(objectValue), true, "localized runtime returned a mutable object");
  let count = 1;
  for (const key of Reflect.ownKeys(objectValue)) {
    count += assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return count;
}
