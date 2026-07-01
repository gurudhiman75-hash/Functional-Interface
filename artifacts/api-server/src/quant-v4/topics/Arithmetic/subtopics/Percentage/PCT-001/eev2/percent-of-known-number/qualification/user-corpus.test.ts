import { strict as assert } from "node:assert";
import { USER_CORPUS, auditUserCorpus } from "./user-corpus";
import {
  USER_CORPUS_REPORT,
  produceUserCorpusReport,
} from "./user-corpus-report";
import { USER_CORPUS_SOURCE_INVENTORY } from "./user-review-notes";

assert.equal(
  new Set(USER_CORPUS.map((item) => item.corpusId)).size,
  USER_CORPUS.length,
);
assert.equal(
  new Set(USER_CORPUS.map((item) => item.questionText)).size,
  USER_CORPUS.length,
  "The strict corpus must not be padded with duplicate stems.",
);
assert.ok(USER_CORPUS.length > 0);
assert.ok(
  USER_CORPUS.every(
    (item) =>
      item.source.sha256.length === 64 &&
      item.source.physicalPage > 0 &&
      item.questionText.length > 0,
  ),
);

const records = auditUserCorpus();
assert.equal(records.length, USER_CORPUS.length);
records.forEach((record) => {
  assert.equal(record.item.locale, "en");
  assert.ok(record.reviewerNotes.length > 0);
  if (!record.pipelineFailure) {
    assert.ok(record.solverEvidence);
    assert.ok(record.trace);
    assert.ok(record.graph);
    assert.ok(record.plan);
    assert.ok(record.renderedRoles);
    assert.ok(record.blocks.length > 0);
    assert.ok(record.lines.length > 0);
  } else {
    assert.ok(
      record.findings.some(
        (finding) => finding.code === "REAL_QUESTION_PIPELINE_REJECTION",
      ),
      "Pipeline failures must remain visible and must not fall back.",
    );
  }
});

assert.deepEqual(
  USER_CORPUS_REPORT,
  produceUserCorpusReport(),
  "The user-PDF qualification report must be deterministic.",
);
assert.equal(
  USER_CORPUS_REPORT.verifiedStrictQuestionCount,
  USER_CORPUS.length,
);
assert.equal(USER_CORPUS_REPORT.sourceInventory, USER_CORPUS_SOURCE_INVENTORY);
assert.equal(
  USER_CORPUS_REPORT.sourceDistribution.reduce(
    (total, source) => total + source.questions,
    0,
  ),
  USER_CORPUS.length,
);
assert.equal(
  USER_CORPUS_REPORT.difficultyDistribution.reduce(
    (total, entry) => total + entry.questions,
    0,
  ),
  USER_CORPUS.length,
);
assert.equal(
  USER_CORPUS_REPORT.contextDistribution.reduce(
    (total, entry) => total + entry.questions,
    0,
  ),
  USER_CORPUS.length,
);
assert.equal(
  USER_CORPUS_REPORT.qualification.requestedCorpusSizeSatisfied,
  false,
  "A sub-100 strict corpus must be reported as a corpus-size qualification failure.",
);
assert.equal(
  USER_CORPUS_REPORT.qualification.productionChangesMade,
  false,
);
assert.equal(
  USER_CORPUS_REPORT.qualification.qualified,
  false,
  "REAL-WORLD-001 cannot pass while the requested corpus-size gate is unmet.",
);

console.log(
  `REAL-WORLD-001: ${USER_CORPUS_REPORT.approvedQuestions}/` +
    `${USER_CORPUS_REPORT.verifiedStrictQuestionCount} approved, ` +
    `${USER_CORPUS_REPORT.criticalFindings.length} critical, ` +
    `${USER_CORPUS_REPORT.majorFindings.length} major, ` +
    `${USER_CORPUS_REPORT.minorFindings.length} minor, ` +
    `corpus-size=${USER_CORPUS_REPORT.qualification.requestedCorpusSizeSatisfied}.`,
);
