import {
  ALG_ENGLISH_REVIEW_V2_ID,
  ALG_ENGLISH_REVIEW_V2_REMEDIATION,
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishCandidate,
  generateAlgPermanentEnglishReviewV2,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

const forbiddenPresentationPatterns: Array<[RegExp, string]> = [
  [/(^|\W)-?1x²\b/, "raw ±1x² coefficient"],
  [/(^|\W)-?1x\b/, "raw ±1x coefficient"],
  [/\+\s*-/, "plus followed by negative sign"],
  [/\(x - -[0-9]/, "double-negative factor"],
  [/-?[0-9]+\/1 [+-] √/, "integer surd rendered as n/1"],
  [/Hence k = ([^.,;]+), giving k = \1\./, "duplicated k result"],
  [/Therefore k = ([^.,;]+), giving k = \1\./, "duplicated k result"],
  [/hence x = ([^ .]+) and x = \1\. Therefore x = \1\./, "duplicated absolute-value root"],
  [/≥ ([+-]?[0-9]+\/[0-9]+) = \1\./, "duplicated rational bound"],
  [/≤ ([+-]?[0-9]+\/[0-9]+) = \1\./, "duplicated rational bound"],
];

assert(ALG_ENGLISH_REVIEW_V2_REMEDIATION.learnerEnglishFreezeReopened, "V2 must explicitly reopen learner English review");
assert(!ALG_ENGLISH_REVIEW_V2_REMEDIATION.semanticQlFreezeReopened, "V2 must not reopen semantic QLs");
assert(!ALG_ENGLISH_REVIEW_V2_REMEDIATION.solverAuthorityReopened, "V2 must not reopen solver authority");
assert(ALG_ENGLISH_REVIEW_V2_REMEDIATION.downstreamLocked, "V2 must keep downstream lifecycle locked");

let stressSamples = 0;
let reviewSamples = 0;
let presentationChanges = 0;
let dsSamples = 0;

for (let allocationIndex = 0; allocationIndex < ALG_PERMANENT_ALLOCATION.length; allocationIndex += 1) {
  const allocation = ALG_PERMANENT_ALLOCATION[allocationIndex]!;
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);

  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    const seeds = [...Array.from({ length: 12 }, (_, index) => index + 1), 101 + allocationIndex * 17 + variantIndex * 7];
    for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 1) {
      const seed = seeds[seedIndex]!;
      const source = generateAlgPermanentEnglishCandidate(allocation.qlId, seed, variantIndex);
      const review = generateAlgPermanentEnglishReviewV2(allocation.qlId, seed, variantIndex);
      const prefix = `${allocation.qlId}/${source.prototypeId}/seed-${seed}`;

      if (seedIndex < 12) stressSamples += 1;
      else reviewSamples += 1;

      assert(review.reviewCandidateId === ALG_ENGLISH_REVIEW_V2_ID, `${prefix}: wrong review candidate ID`);
      assert(review.qlId === source.qlId && review.prototypeId === source.prototypeId, `${prefix}: identity changed`);
      assert(review.freezeKey === source.freezeKey && review.prototypeSolveMode === source.prototypeSolveMode, `${prefix}: authority provenance changed`);
      assert(review.seed === source.seed && review.variantIndex === source.variantIndex, `${prefix}: generation coordinates changed`);
      assert(stable(review.canonicalAnswer) === stable(source.canonicalAnswer), `${prefix}: canonical answer changed`);
      assert(stable(review.rawDiscoveryItem) === stable(source.rawDiscoveryItem), `${prefix}: solver/raw discovery state changed`);
      assert(review.maturity === "ENGLISH_REVIEW_CANDIDATE_V2", `${prefix}: wrong V2 maturity`);
      assert(review.reviewStatus === "POST_FREEZE_REMEDIATION_REVIEW", `${prefix}: wrong V2 review status`);
      assert(!review.englishImplementationFrozen && !review.active && !review.questionStudioDiscoverable, `${prefix}: downstream lifecycle leaked`);

      if (review.question !== source.question || review.explanation !== source.explanation) presentationChanges += 1;

      const combined = `${review.question}\n${review.explanation}`;
      for (const [pattern, label] of forbiddenPresentationPatterns) {
        assert(!pattern.test(combined), `${prefix}: ${label}`);
      }

      if (["ALG-CP014-CAND-004", "ALG-CP014-CAND-005", "ALG-CP014-CAND-006", "ALG-CP014-CAND-007", "ALG-CP014-CAND-008"].includes(source.prototypeId)) {
        dsSamples += 1;
        assert(review.question.includes("I. "), `${prefix}: Statement I missing from learner question`);
        assert(review.question.includes("II. "), `${prefix}: Statement II missing from learner question`);
      }
    }
  }
}

assert(stressSamples === 1308, `Expected 1,308 V2 stress samples, got ${stressSamples}`);
assert(reviewSamples === 109, `Expected 109 all-variant review-coordinate samples, got ${reviewSamples}`);
assert(dsSamples === 65, `Expected 65 DS statement-presence checks, got ${dsSamples}`);
assert(presentationChanges > 0, "V2 remediation must change at least one learner presentation");

console.log(`Algebra English V2 remediation proof passed: ${stressSamples} stress samples + ${reviewSamples} all-variant review samples; semantic/solver authority unchanged`);
