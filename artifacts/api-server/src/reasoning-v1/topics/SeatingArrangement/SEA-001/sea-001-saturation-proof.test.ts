import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { auditSea001Corpus, assertSea001ProductionCandidateTargets } from "./saturation/residual-audit.ts";

const startedAt = Date.now();
// CP-001 intentionally uses three children while CP-002..005 use four. Eighty accepted
// caselets per provisional PBA yields 1,600 caselets and at least 6,000 genuine children
// without padding a passage merely to satisfy a corpus counter.
const corpus = buildSea001SaturationCorpus(80);
const audit = auditSea001Corpus(
  corpus.caselets,
  corpus.rejectedExactDuplicateCandidates,
  corpus.rejectedNormalizedClueSetCandidates,
);
assertSea001ProductionCandidateTargets(audit);

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
console.log("rejected exact duplicate candidates", audit.rejectedExactDuplicateCandidates);
console.log("rejected normalized clue-set candidates", audit.rejectedNormalizedClueSetCandidates);
console.log("residual blocker count", audit.blockerCount);
console.log("variant distribution", JSON.stringify(audit.materialVariantCountByBlueprint));
console.log("query distribution", JSON.stringify(audit.queryContractDistribution));
console.log("answer positions", JSON.stringify(audit.answerPositionDistribution));
console.log("answer positions by child index", JSON.stringify(audit.answerPositionByChildIndexDistribution));
console.log("elapsed milliseconds", Date.now() - startedAt);
console.log("permanent QLs", 0);
