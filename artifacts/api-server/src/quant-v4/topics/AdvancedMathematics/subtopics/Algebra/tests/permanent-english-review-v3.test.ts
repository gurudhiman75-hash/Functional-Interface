import {
  ALG_ENGLISH_REVIEW_V3_AUTHORITY,
  ALG_ENGLISH_REVIEW_V3_ID,
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishCandidate,
  generateAlgPermanentEnglishReviewV3,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function needsFormulaReason(prototypeId: string): boolean {
  return prototypeId.startsWith("ALG-CP002-")
    || ["ALG-CP003-CAND-001", "ALG-CP003-CAND-002", "ALG-CP003-CAND-003", "ALG-CP003-CAND-004", "ALG-CP003-CAND-005"].includes(prototypeId)
    || ["ALG-CP004-CAND-002", "ALG-CP004-CAND-003"].includes(prototypeId)
    || prototypeId.startsWith("ALG-CP005-")
    || (prototypeId.startsWith("ALG-CP008-") && prototypeId !== "ALG-CP008-CAND-001")
    || prototypeId.startsWith("ALG-CP009-")
    || prototypeId.startsWith("ALG-CP010-")
    || ["ALG-CP012-CAND-004", "ALG-CP012-CAND-005", "ALG-CP012-CAND-006", "ALG-CP012-CAND-007", "ALG-CP012-CAND-008", "ALG-CP012-CAND-009", "ALG-CP012-CAND-010", "ALG-CP012-CAND-011", "ALG-CP012-CAND-012"].includes(prototypeId)
    || prototypeId.startsWith("ALG-CP013-")
    || prototypeId === "ALG-CP007-CAND-008";
}

const forbidden: Array<[RegExp, string]> = [
  [/^If /, "unnecessary If stem opening"],
  [/^Given /, "unnecessary Given stem opening"],
  [/^When P\(x\)/, "unnecessary When theorem stem opening"],
  [/^For P\(x\)/, "unnecessary For theorem stem opening"],
  [/\bLet u\b|\bLet v\b/, "u/v temporary substitution"],
  [/\bLet S\s*=|\bLet P\s*=/, "S/P temporary root alias"],
  [/(^|\W)-?1x²\b/, "raw ±1x² coefficient"],
  [/(^|\W)-?1x\b/, "raw ±1x coefficient"],
  [/\+\s*-/, "plus followed by negative sign"],
  [/\(x - -[0-9]/, "double-negative factor"],
  [/(?<![0-9])-?[0-9]+\/1\b/, "rational integer rendered as n/1"],
  [/\(-?[0-9]+\)\/\(1\)/, "parenthesized rational integer rendered over 1"],
  [/[<>][A-Za-z][^>]*>/, "raw HTML in learner text"],
  [/\bundefined\b|\bNaN\b/, "invalid rendered value"],
];

assert(!ALG_ENGLISH_REVIEW_V3_AUTHORITY.semanticQlFreezeReopened, "V3 must not reopen semantic QLs");
assert(!ALG_ENGLISH_REVIEW_V3_AUTHORITY.solverAuthorityReopened, "V3 must not reopen solver authority");
assert(ALG_ENGLISH_REVIEW_V3_AUTHORITY.learnerEnglishFreezeReopened, "V3 must remain an unfrozen learner review candidate");
assert(ALG_ENGLISH_REVIEW_V3_AUTHORITY.downstreamLocked, "V3 must keep downstream surfaces locked");

let stressSamples = 0;
let reviewSamples = 0;
let formulaSamples = 0;
let dsSamples = 0;
const reviewQuestions = new Set<string>();
const reviewExplanations = new Set<string>();

for (let allocationIndex = 0; allocationIndex < ALG_PERMANENT_ALLOCATION.length; allocationIndex += 1) {
  const allocation = ALG_PERMANENT_ALLOCATION[allocationIndex]!;
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);

  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    const reviewSeed = 101 + allocationIndex * 17 + variantIndex * 7;
    const seeds = [...Array.from({ length: 12 }, (_, index) => index + 1), reviewSeed];

    for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 1) {
      const seed = seeds[seedIndex]!;
      const source = generateAlgPermanentEnglishCandidate(allocation.qlId, seed, variantIndex);
      const review = generateAlgPermanentEnglishReviewV3(allocation.qlId, seed, variantIndex);
      const prefix = `${allocation.qlId}/${source.prototypeId}/seed-${seed}`;

      if (seedIndex < 12) stressSamples += 1;
      else {
        reviewSamples += 1;
        assert(!reviewQuestions.has(review.question), `${prefix}: duplicate all-variant review question`);
        assert(!reviewExplanations.has(review.explanation), `${prefix}: duplicate all-variant review explanation`);
        reviewQuestions.add(review.question);
        reviewExplanations.add(review.explanation);
      }

      assert(review.reviewCandidateId === ALG_ENGLISH_REVIEW_V3_ID, `${prefix}: wrong V3 review ID`);
      assert(review.maturity === "ENGLISH_REVIEW_CANDIDATE_V3", `${prefix}: wrong V3 maturity`);
      assert(review.reviewStatus === "STEPWISE_HUMAN_EDITORIAL_REVIEW", `${prefix}: wrong V3 review status`);
      assert(!review.englishImplementationFrozen && !review.active && !review.questionStudioDiscoverable, `${prefix}: downstream lifecycle leaked`);

      assert(review.qlId === source.qlId && review.prototypeId === source.prototypeId, `${prefix}: identity changed`);
      assert(review.freezeKey === source.freezeKey && review.prototypeSolveMode === source.prototypeSolveMode, `${prefix}: authority provenance changed`);
      assert(review.seed === source.seed && review.variantIndex === source.variantIndex, `${prefix}: generation coordinates changed`);
      assert(stable(review.canonicalAnswer) === stable(source.canonicalAnswer), `${prefix}: canonical answer changed`);
      assert(stable(review.rawDiscoveryItem) === stable(source.rawDiscoveryItem), `${prefix}: solver state changed`);

      assert(review.question.trim().length >= 10, `${prefix}: question too short`);
      assert(review.explanation.trim().length >= 35, `${prefix}: explanation too short`);
      assert(review.explanation.split(/\n+/).every((line) => line.trim().length > 0), `${prefix}: blank solution step`);

      const combined = `${review.question}\n${review.explanation}`;
      for (const [pattern, label] of forbidden) {
        assert(!pattern.test(combined), `${prefix}: ${label}`);
      }

      if (needsFormulaReason(source.prototypeId)) {
        formulaSamples += 1;
        const steps = review.explanation.split(/\n+/);
        assert(review.explanation.includes("Why this method:"), `${prefix}: formula solution does not explain why the method applies`);
        assert(steps.length >= 3, `${prefix}: formula solution has fewer than three visible steps`);
        if (review.question.includes(". Find ") || review.question.includes(". Form ")) {
          assert(review.explanation.includes("Given:"), `${prefix}: formula question does not restate the given values`);
          assert(review.explanation.includes("Required:"), `${prefix}: formula question does not state what must be found`);
        }
      }

      if (["ALG-CP014-CAND-004", "ALG-CP014-CAND-005", "ALG-CP014-CAND-006", "ALG-CP014-CAND-007", "ALG-CP014-CAND-008"].includes(source.prototypeId)) {
        dsSamples += 1;
        assert(review.question.includes("I. ") && review.question.includes("II. "), `${prefix}: DS statements missing from learner stem`);
      }
    }
  }
}

assert(stressSamples === 1308, `Expected 1,308 V3 stress samples, got ${stressSamples}`);
assert(reviewSamples === 109, `Expected 109 V3 review samples, got ${reviewSamples}`);
assert(reviewQuestions.size === 109, `Expected 109 unique V3 review questions, got ${reviewQuestions.size}`);
assert(reviewExplanations.size === 109, `Expected 109 unique V3 review explanations, got ${reviewExplanations.size}`);
assert(dsSamples === 65, `Expected 65 DS statement checks, got ${dsSamples}`);
assert(formulaSamples > 500, `Expected broad formula/method coverage, checked only ${formulaSamples}`);

console.log(`Algebra English V3 audit passed: ${stressSamples} stress + ${reviewSamples} all-variant samples; ${formulaSamples} formula/method explanations explicitly justify the method and render stepwise; semantic/solver authority unchanged`);
