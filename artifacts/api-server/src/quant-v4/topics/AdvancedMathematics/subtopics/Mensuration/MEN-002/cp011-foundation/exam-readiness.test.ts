import assert from "node:assert/strict";
import {
  generateMenCp011ReviewBatch,
} from "./exam-readiness-batch";

const { records, audit } = generateMenCp011ReviewBatch(
  "men-cp011-exam-readiness-proof-v1",
  12,
);

assert.equal(records.length, 48);
assert.equal(audit.exactStemCount, 48);
assert.equal(audit.exactQuestionOptionCount, 48);
assert.ok(audit.normalizedStemGroupCount >= 16);
assert.ok(audit.maximumNormalizedStemRepetition <= 3);
assert.deepEqual(audit.answerPositionCounts, {
  A: 12,
  B: 12,
  C: 12,
  D: 12,
});
assert.equal(new Set(Object.values(audit.answerPositionSequences)).size, 4);
assert.equal(audit.publicationEligible, false);
assert.ok(audit.blockers.includes("INSUFFICIENT_PHYSICAL_STATE_DIVERSITY"));
assert.ok(audit.blockers.includes("CHAPTER_COVERAGE_INCOMPLETE"));
assert.ok(audit.blockers.includes("PERMANENT_QLS_UNALLOCATED"));

for (const question of records) {
  assert.equal(
    question.validation.valid,
    true,
    `${question.prototypeId} failed exam-readiness validation for ${question.seed}.`,
  );
  assert.match(
    question.optionPermutationSeed,
    /^MEN-CP011-OPTION-PERMUTATION-V2\|/,
  );
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.display)).size, 4);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.equal(question.answer, question.options[question.correctIndex]?.display);

  assert.match(
    question.diagram.svg,
    /data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"/,
  );
  assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
  assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
  assert.match(question.diagram.svg, /data-responsive="true"/);
  assert.match(question.solutionDiagram.svg, /data-responsive="true"/);
  assert.match(question.diagram.svg, /data-label-placement="detached"/);
  assert.match(question.solutionDiagram.svg, /data-label-placement="detached"/);
  assert.match(question.diagram.svg, /data-region="top-outer-ellipse"/);
  assert.match(question.diagram.svg, /data-region="top-inner-ellipse"/);
  assert.match(question.diagram.svg, /data-region="bottom-outer-ellipse"/);
  assert.match(question.diagram.svg, /data-region="bottom-inner-hidden-ellipse"/);
  assert.match(question.diagram.svg, /data-position="outside-right"/);
  assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
  assert.equal(question.renderSurfaces.responsiveDiagramPolicy.minWidthPx, 0);

  if (question.state.representation !== "DIAMETERS") {
    assert.match(question.diagram.svg, /data-scope="centre-connected"/);
    assert.match(question.diagram.svg, /data-role="top-centre"/);
    assert.match(question.diagram.svg, /data-role="centre-label"/);
    assert.match(
      question.diagram.svg,
      /data-dimension="outer-radius" data-orientation="centre-connected"/,
    );
    assert.match(
      question.diagram.svg,
      /data-dimension="inner-radius" data-orientation="centre-connected"/,
    );
  }

  if (
    question.state.representation === "OUTER_RADIUS_AND_THICKNESS" ||
    question.state.representation === "INVERSE_INNER_RADIUS"
  ) {
    assert.match(question.diagram.svg, />r = \?</);
    assert.doesNotMatch(
      question.diagram.svg,
      new RegExp(`r = ${question.state.innerRadius} cm`),
    );
    assert.match(
      question.solutionDiagram.svg,
      new RegExp(`r = ${question.state.innerRadius} cm`),
    );
  }

  if (question.state.representation === "OUTER_RADIUS_AND_THICKNESS") {
    assert.match(
      question.diagram.svg,
      /data-dimension="wall-thickness" data-orientation="radial" data-alignment="top-rim"/,
    );
  }

  assert.equal(question.renderSurfaces.attempt.diagram, null);
  assert.equal(
    question.renderSurfaces.attempt.diagramPolicy,
    "HIDDEN_FOR_TEXT_COMPLETE_ITEM",
  );
  assert.equal(question.renderSurfaces.practice.diagram, question.diagram);
  assert.equal(question.renderSurfaces.solution.diagram, question.solutionDiagram);
  assert.equal(question.renderSurfaces.solution.exposesInternalCodes, false);
  assert.equal(question.renderSurfaces.admin.exposesInternalCodes, true);
  assert.equal(question.renderSurfaces.admin.trapCodes.length, 3);

  const learnerText = [
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
  assert.doesNotMatch(learnerText, /\[[A-Z0-9_]+\]/);
  assert.doesNotMatch(learnerText, /\b[PR]:-?\d/);
  assert.doesNotMatch(learnerText, /\\pih/);

  const allVisibleTex = [
    question.stem,
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [
      step.title,
      step.body,
      step.equation ?? "",
    ]),
    question.explanation.shortcut,
    learnerText,
  ].join("\n");
  assert.doesNotMatch(allVisibleTex, /\\pih/);

  assert.equal(question.permanentQlId, null);
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioDiscoverable, false);
}

console.log(
  "MEN-CP-011 Wave 01 exam-readiness proof passed for 48 duplicate-safe records with prompt-safe diagrams, balanced independent option placement, TeX linting and separated learner/admin render surfaces.",
);
