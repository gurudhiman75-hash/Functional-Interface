import { strict as assert } from "node:assert";
import {
  REAL_QUESTION_PILOT_CORPUS,
  REAL_QUESTION_REVIEW_NOTES,
} from "./real-question-review-notes";
import {
  REAL_QUESTION_PILOT_REPORT,
  produceRealQuestionPilotReport,
} from "./real-question-pilot-report";
import { runRealQuestionPilot } from "./real-question-pilot";

assert.equal(REAL_QUESTION_PILOT_CORPUS.length, 50);
assert.equal(
  new Set(REAL_QUESTION_PILOT_CORPUS.map((item) => item.pilotId)).size,
  50,
);
assert.equal(
  new Set(REAL_QUESTION_PILOT_CORPUS.map((item) => item.questionText)).size,
  50,
);
assert.equal(
  new Set(REAL_QUESTION_PILOT_CORPUS.map((item) => item.source.url)).size,
  50,
);

const records = runRealQuestionPilot(REAL_QUESTION_PILOT_CORPUS);
assert.equal(records.length, 50);
records.forEach((record, index) => {
  const source = REAL_QUESTION_PILOT_CORPUS[index]!;
  assert.equal(record.questionText, source.questionText);
  assert.equal(record.source.url, source.source.url);
  assert.ok(record.solverEvidence);
  assert.ok(record.trace.ideas.length > 0);
  assert.ok(record.graph.nodes.length > 0);
  assert.ok(record.plan.roles.length > 0);
  assert.ok(record.blocks.length > 0);
  assert.ok(record.lines.length > 0);
  assert.ok(record.reviewerNotes.length >= 4);
});

assert.deepEqual(
  REAL_QUESTION_PILOT_REPORT,
  produceRealQuestionPilotReport(),
  "The real-question pilot report must be deterministic.",
);
assert.equal(REAL_QUESTION_PILOT_REPORT.totalQuestions, 50);
assert.equal(
  REAL_QUESTION_PILOT_REPORT.sourceDistribution.reduce(
    (total, entry) => total + entry.questions,
    0,
  ),
  50,
);
assert.equal(
  REAL_QUESTION_PILOT_REPORT.difficultyDistribution.reduce(
    (total, entry) => total + entry.questions,
    0,
  ),
  50,
);
assert.equal(REAL_QUESTION_PILOT_REPORT.dimensionSummaries.length, 8);
assert.equal(REAL_QUESTION_PILOT_REPORT.sourceLevelFindings.length, 3);
assert.equal(
  REAL_QUESTION_PILOT_REPORT.reviewerNotes,
  REAL_QUESTION_REVIEW_NOTES,
);
assert.equal(
  REAL_QUESTION_PILOT_REPORT.successTarget.genuineExamCorpusSatisfied,
  false,
  "Trusted-platform items must not be misrepresented as official PYQs.",
);
assert.equal(
  REAL_QUESTION_PILOT_REPORT.successTarget.requestedContextCoverageSatisfied,
  false,
  "Missing context categories must remain visible as a qualification gap.",
);

console.log(
  `QUAL-001 Phase E0 pilot: ` +
    `${REAL_QUESTION_PILOT_REPORT.approvedQuestions}/50 approved, ` +
    `${REAL_QUESTION_PILOT_REPORT.criticalFindings.length} critical, ` +
    `${REAL_QUESTION_PILOT_REPORT.majorFindings.length} major, ` +
    `${REAL_QUESTION_PILOT_REPORT.minorFindings.length} minor; ` +
    `official-corpus=${REAL_QUESTION_PILOT_REPORT.successTarget.genuineExamCorpusSatisfied}, ` +
    `context-coverage=${REAL_QUESTION_PILOT_REPORT.successTarget.requestedContextCoverageSatisfied}.`,
);
