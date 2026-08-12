import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { auditSea001Corpus, assertSea001ProductionCandidateTargets } from "./saturation/residual-audit.ts";

const startedAt = Date.now();
// Eighty accepted caselets per provisional PBA yields 1,600 caselets and 6,400
// genuine four-child questions while preserving the V3 3–5-child governance rule.
const corpus = buildSea001SaturationCorpus(80);
const audit = auditSea001Corpus(
  corpus.caselets,
  corpus.rejectedExactDuplicateCandidates,
  corpus.rejectedNormalizedClueSetCandidates,
);
assertSea001ProductionCandidateTargets(audit);

let fallbackDistractorCount = 0;
for (const caselet of corpus.caselets) {
  for (const child of caselet.children) {
    const correctOption = child.options[child.answerIndex];
    if (!correctOption?.isCorrect) {
      throw new Error(`${caselet.caseletId}/${child.queryContractId} lost answer-index alignment`);
    }
    if (correctOption.explanation !== child.explanation) {
      throw new Error(`${caselet.caseletId}/${child.queryContractId} correct option does not carry the question-specific explanation`);
    }
    if (/^This matches\b/i.test(correctOption.explanation.trim())) {
      throw new Error(`${caselet.caseletId}/${child.queryContractId} still exposes a generic correct-option explanation`);
    }
    for (const option of child.options) {
      if (option.isCorrect) continue;
      const isFallback = Object.prototype.hasOwnProperty.call(option.recomputation, "fallbackVerifiedValue");
      if (!isFallback) continue;
      fallbackDistractorCount += 1;
      if (/(?:possible-looking|does not match (?:the )?(?:solved|uniquely solved))/i.test(option.explanation)) {
        throw new Error(`${caselet.caseletId}/${child.queryContractId} still exposes a generic fallback explanation`);
      }
    }
  }
}

const reviewCorpus = selectManualReviewCorpus(corpus.caselets, 5);
if (reviewCorpus.length !== 100) throw new Error(`Expected 100 review caselets, observed ${reviewCorpus.length}`);
for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const) {
  const count = reviewCorpus.filter((caselet) => caselet.checkpointId === checkpointId).length;
  if (count !== 20) throw new Error(`${checkpointId} review corpus must contain exactly 20 caselets, observed ${count}`);
}

console.log("PASS_SEA_001_PRODUCTION_SATURATION");
console.log("caselets", audit.caseletCount);
console.log("child questions", audit.childQuestionCount);
console.log("material variants", audit.materialVariantCount);
console.log("query-template surfaces", audit.querySurfaceCount);
console.log("manual-review candidates", reviewCorpus.length);
console.log("question-specific correct-option explanations", "ENFORCED");
console.log("fallback distractors with value-specific explanations", fallbackDistractorCount);
console.log("rejected exact duplicate candidates", audit.rejectedExactDuplicateCandidates);
console.log("rejected normalized clue-set candidates", audit.rejectedNormalizedClueSetCandidates);
console.log("residual blocker count", audit.blockerCount);
console.log("variant distribution", JSON.stringify(audit.materialVariantCountByBlueprint));
console.log("query distribution", JSON.stringify(audit.queryContractDistribution));
console.log("answer positions", JSON.stringify(audit.answerPositionDistribution));
console.log("answer positions by child index", JSON.stringify(audit.answerPositionByChildIndexDistribution));
console.log("elapsed milliseconds", Date.now() - startedAt);
console.log("permanent QLs", 0);
