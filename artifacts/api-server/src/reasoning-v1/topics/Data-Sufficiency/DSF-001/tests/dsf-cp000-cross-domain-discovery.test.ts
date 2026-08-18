import assert from "node:assert/strict";
import { runAlgebraTargetFunctionPrototype } from "../adapters/quant/algebra/target-function-prototype.ts";
import {
  DSF_RNK_PROTOTYPE_IDS,
  buildRankingDsDiscoveryCorpus,
} from "../adapters/reasoning/ranking-order/prototype-adapter.ts";

const algebra = runAlgebraTargetFunctionPrototype();
assert.equal(algebra.permanentQlId, null);
assert.equal(algebra.evaluation.classification, "BOTH_TOGETHER_ONLY");
assert(algebra.evaluation.statementI.normalizedTargetAnswers.length > 1);
assert(algebra.evaluation.statementII.normalizedTargetAnswers.length > 1);
assert.equal(algebra.evaluation.together.worldCount, 2);
assert.deepEqual(algebra.evaluation.together.normalizedTargetAnswers, ["10"]);
assert.equal(algebra.evaluation.together.sufficient, true);
assert.deepEqual(algebra.evaluation.minimalSufficientSets, [["I", "II"]]);

// Algebra discovery proves a target function can be unique while the ordered pair is not.
// Here the surviving complete worlds are (4,6) and (6,4), but x+y is 10 in both.

const ranking = buildRankingDsDiscoveryCorpus();
assert.equal(ranking.length, DSF_RNK_PROTOTYPE_IDS.length);
assert.deepEqual(ranking.map((entry) => entry.prototypeId), DSF_RNK_PROTOTYPE_IDS);
assert(ranking.every((entry) => entry.permanentQlId === null));
assert(ranking.every((entry) => entry.sourceCapability === "RNK-CP-007/exactRankSet"));
assert.deepEqual(new Set(ranking.map((entry) => entry.evaluation.classification)), new Set([
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
  "EACH_STATEMENT_ALONE",
  "BOTH_TOGETHER_ONLY",
  "INSUFFICIENT_EVEN_TOGETHER",
]));

const rankingProjection = ranking.find((entry) => entry.prototypeId === "DSF-RNK-PROT-I-ONLY")!;
assert.equal(rankingProjection.evaluation.statementI.worldCount, 6);
assert.deepEqual(rankingProjection.evaluation.statementI.normalizedTargetAnswers, ["1"]);
assert.equal(rankingProjection.evaluation.statementI.sufficient, true);
assert.equal(rankingProjection.evaluation.classification, "STATEMENT_I_ONLY");

const rankingBoth = ranking.find((entry) => entry.prototypeId === "DSF-RNK-PROT-BOTH-ONLY")!;
assert(rankingBoth.evaluation.statementI.normalizedTargetAnswers.length > 1);
assert(rankingBoth.evaluation.statementII.normalizedTargetAnswers.length > 1);
assert.equal(rankingBoth.evaluation.together.worldCount, 6);
assert.deepEqual(rankingBoth.evaluation.together.normalizedTargetAnswers, ["1"]);
assert.equal(rankingBoth.evaluation.classification, "BOTH_TOGETHER_ONLY");

const rankingEach = ranking.find((entry) => entry.prototypeId === "DSF-RNK-PROT-EACH-ALONE")!;
assert(rankingEach.evaluation.statementI.worldCount > 1);
assert(rankingEach.evaluation.statementII.worldCount > 1);
assert.deepEqual(rankingEach.evaluation.statementI.normalizedTargetAnswers, ["1"]);
assert.deepEqual(rankingEach.evaluation.statementII.normalizedTargetAnswers, ["1"]);
assert.deepEqual(rankingEach.evaluation.minimalSufficientSets, [["I"], ["II"]]);

console.log(JSON.stringify({
  status: "PASS_DSF_CP_000_CROSS_DOMAIN_DISCOVERY",
  algebra: {
    classification: algebra.evaluation.classification,
    survivingCompleteWorldsTogether: algebra.evaluation.together.worldCount,
    uniqueTarget: algebra.evaluation.together.normalizedTargetAnswers[0],
    sourceIntegration: algebra.productionSourceIntegration,
  },
  ranking: {
    prototypes: ranking.length,
    sourceCapability: ranking[0]!.sourceCapability,
    multiWorldSufficientExample: {
      survivingOrders: rankingProjection.evaluation.statementI.worldCount,
      uniqueRank: rankingProjection.evaluation.statementI.normalizedTargetAnswers[0],
    },
  },
  lifecycle: {
    permanentQlAllocation: "LOCKED",
    questionStudioPublication: "LOCKED",
  },
}, null, 2));
