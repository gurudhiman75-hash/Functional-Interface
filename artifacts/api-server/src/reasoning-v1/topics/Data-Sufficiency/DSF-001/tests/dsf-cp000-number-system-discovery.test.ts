import assert from "node:assert/strict";
import {
  DSF_NUM_PROTOTYPE_IDS,
  buildNumberSystemDsDiscoveryCorpus,
} from "../adapters/quant/number-system/prototype-adapter.ts";
import {
  DSF_COVERAGE_MATRIX,
  dsfCoverageSummary,
} from "../discovery/coverage-matrix.ts";
import {
  EXISTING_DSF_RUNTIME_AUDIT,
  existingRuntimeAuditSummary,
} from "../discovery/existing-runtime-audit.ts";

const corpus = buildNumberSystemDsDiscoveryCorpus();
assert.equal(corpus.length, DSF_NUM_PROTOTYPE_IDS.length);
assert.deepEqual(corpus.map((entry) => entry.prototypeId), DSF_NUM_PROTOTYPE_IDS);
assert(corpus.every((entry) => entry.permanentQlId === null));
assert(corpus.every((entry) => entry.sourceChapter === "Number System"));
assert(corpus.every((entry) => entry.sourceCapability === "NUM-001/foundation/divisibility"));

const canonicalFive = corpus.slice(0, 5).map((entry) => entry.evaluation.classification);
assert.deepEqual(new Set(canonicalFive), new Set([
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
  "EACH_STATEMENT_ALONE",
  "BOTH_TOGETHER_ONLY",
  "INSUFFICIENT_EVEN_TOGETHER",
]));

const iOnly = corpus.find((entry) => entry.prototypeId === "DSF-NUM-PROT-I-ONLY")!;
assert.deepEqual(iOnly.evaluation.statementI.normalizedTargetAnswers, ["3"]);
assert.deepEqual(iOnly.evaluation.statementII.normalizedTargetAnswers, ["2", "3", "5", "7"]);
assert.equal(iOnly.evaluation.classification, "STATEMENT_I_ONLY");

const iiOnly = corpus.find((entry) => entry.prototypeId === "DSF-NUM-PROT-II-ONLY")!;
assert.deepEqual(iiOnly.evaluation.statementI.normalizedTargetAnswers, ["0", "2", "4", "6", "8"]);
assert.deepEqual(iiOnly.evaluation.statementII.normalizedTargetAnswers, ["4"]);
assert.equal(iiOnly.evaluation.classification, "STATEMENT_II_ONLY");

const each = corpus.find((entry) => entry.prototypeId === "DSF-NUM-PROT-EACH-ALONE")!;
assert.deepEqual(each.evaluation.statementI.normalizedTargetAnswers, ["3"]);
assert.deepEqual(each.evaluation.statementII.normalizedTargetAnswers, ["3"]);
assert.deepEqual(each.evaluation.minimalSufficientSets, [["I"], ["II"]]);

const both = corpus.find((entry) => entry.prototypeId === "DSF-NUM-PROT-BOTH-ONLY")!;
assert.deepEqual(both.evaluation.statementI.normalizedTargetAnswers, ["0", "3", "6", "9"]);
assert.deepEqual(both.evaluation.statementII.normalizedTargetAnswers, ["2", "3", "5", "7"]);
assert.deepEqual(both.evaluation.together.normalizedTargetAnswers, ["3"]);
assert.deepEqual(both.evaluation.minimalSufficientSets, [["I", "II"]]);

const neither = corpus.find((entry) => entry.prototypeId === "DSF-NUM-PROT-NEITHER")!;
assert.deepEqual(neither.evaluation.together.normalizedTargetAnswers, ["0", "6"]);
assert.equal(neither.evaluation.classification, "INSUFFICIENT_EVEN_TOGETHER");

const projection = corpus.find((entry) => entry.prototypeId === "DSF-NUM-PROT-TARGET-PROJECTION")!;
assert.equal(projection.problem.targetKind, "DIGIT_PARITY");
assert.equal(projection.evaluation.statementI.worldCount, 5);
assert.deepEqual(projection.evaluation.statementI.normalizedTargetAnswers, ["EVEN"]);
assert.equal(projection.evaluation.statementI.sufficient, true);
assert.equal(projection.evaluation.statementII.sufficient, false);
assert.equal(projection.evaluation.classification, "STATEMENT_I_ONLY");

const auditSummary = existingRuntimeAuditSummary();
assert.equal(EXISTING_DSF_RUNTIME_AUDIT.length, 3);
assert.deepEqual(auditSummary, {
  ADAPT_TO_SHARED_DSF: 1,
  MIGRATE_PROOF_MODEL: 1,
  DO_NOT_REUSE_ANSWER_CONTRACT: 1,
});
const sapAudit = EXISTING_DSF_RUNTIME_AUDIT.find((entry) => entry.sourceChapter.includes("SAP-001"))!;
assert.equal(sapAudit.currentClassCount, 4);
assert.match(sapAudit.defectOrGap, /EACH_STATEMENT_ALONE/);
const tmwAudit = EXISTING_DSF_RUNTIME_AUDIT.find((entry) => entry.sourceChapter.includes("TMW-001"))!;
assert.match(tmwAudit.currentProofModel, /iUnique/);

const coverage = dsfCoverageSummary();
assert.deepEqual(coverage, {
  total: 12,
  quant: 6,
  reasoning: 6,
  byReadiness: {
    EXECUTABLE_PROTOTYPE: 3,
    EXISTING_RUNTIME_AUDIT: 2,
    PROTOTYPE_REQUIRED: 5,
    DEFERRED: 2,
  },
});
assert(DSF_COVERAGE_MATRIX.every((row) => row.ownership !== "TO_BE_RESOLVED"));
assert(DSF_COVERAGE_MATRIX.some((row) => row.domainFamily === "REASONING" && row.sourceChapter === "Ranking and Order" && row.readiness === "EXECUTABLE_PROTOTYPE"));
assert(DSF_COVERAGE_MATRIX.some((row) => row.domainFamily === "QUANT" && row.sourceChapter === "Algebra" && row.readiness === "EXECUTABLE_PROTOTYPE"));
assert(DSF_COVERAGE_MATRIX.some((row) => row.domainFamily === "REASONING" && row.sourceChapter === "Seating Arrangement" && row.readiness === "DEFERRED"));

console.log(JSON.stringify({
  status: "PASS_DSF_CP_000_NUMBER_SYSTEM_DISCOVERY",
  numberSystem: {
    prototypes: corpus.length,
    canonicalFiveCovered: canonicalFive.length,
    targetProjectionWorlds: projection.evaluation.statementI.worldCount,
    targetProjectionAnswer: projection.evaluation.statementI.normalizedTargetAnswers[0],
  },
  existingRuntimeAudit: auditSummary,
  coverage,
  lifecycle: {
    permanentQlAllocation: "LOCKED",
    questionStudioPublication: "LOCKED",
  },
}, null, 2));
