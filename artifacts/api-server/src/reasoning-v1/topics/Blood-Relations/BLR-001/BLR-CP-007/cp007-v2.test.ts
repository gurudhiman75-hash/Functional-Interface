import assert from "node:assert/strict";
import {
  certifyBlrCp007V2Question,
  verifyBlrCp007V2Question,
} from "./cp007-v2-independent-verifier";
import {
  BLR_CP007_V2_ANSWER_POSITION_PATTERNS,
  type BlrCp007V2Question,
} from "./cp007-v2-model";
import {
  buildBlrCp007V2Telemetry,
  generateBlrCp007V2Bank,
  generateBlrCp007V2Question,
} from "./cp007-v2-runtime";

function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function visibleExplanation(question: BlrCp007V2Question): string {
  return [
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    ...question.explanation.optionAnalysis.map((entry) => entry.explanation),
  ].join(" ");
}

const bank = generateBlrCp007V2Bank();
const telemetry = buildBlrCp007V2Telemetry(bank);
assert.equal(bank.length, 168);
assert.equal(telemetry.prototypeCount, 21);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.equal(telemetry.uniqueQuestionSignatureCount, 168);
assert.deepEqual(telemetry.answerPositions, [42, 42, 42, 42]);
assert.deepEqual(telemetry.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.ok(telemetry.semicolonCorrectOptionCount > 0);
assert.ok(telemetry.semicolonWrongOptionCount > 0);

const oldCycles = new Set(["03010301", "21032103", "32103210", "10321032"]);
const answerPatterns = new Set<string>();
for (const [prototypeId, pattern] of BLR_CP007_V2_ANSWER_POSITION_PATTERNS) {
  const encoded = pattern.join("");
  assert.equal(pattern.length, 8, `${prototypeId}: answer-pattern length`);
  assert.deepEqual(
    [0, 1, 2, 3].map((index) => pattern.filter((value) => value === index).length),
    [2, 2, 2, 2],
    `${prototypeId}: local answer balance`,
  );
  assert.ok(!oldCycles.has(encoded), `${prototypeId}: legacy answer cycle survived`);
  assert.ok(encoded.slice(0, 4) !== encoded.slice(4), `${prototypeId}: repeated four-answer cycle`);
  answerPatterns.add(encoded);
}
assert.equal(answerPatterns.size, 21, "Every prototype requires a distinct answer sequence.");

const certified = bank.map((question) => {
  assert.deepEqual(verifyBlrCp007V2Question(question), []);
  return certifyBlrCp007V2Question(question);
});
assert.equal(certified.length, 168);
assert.equal(
  certified.reduce((total, question) => total + question.options.length, 0),
  672,
);
assert.ok(
  certified.every((question) =>
    question.options.every((option) => option.graphValidity === "VALID"),
  ),
  "Every displayed option must create a valid family graph.",
);

const genericWrong =
  "Incorrect: this completion changes a relation, reverses a link, breaks the path or misstates validity.";
const genericCorrect =
  "Correct: every token, direction and required family link agrees with the completed graph.";
for (const question of certified) {
  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.answer, question.options[question.correctIndex]!.text);
  assert.equal(question.explanation.optionAnalysis.length, 4);
  assert.equal(question.adminProof.independentSolverStatus, "AGREED");
  assert.equal(question.adminProof.rendererValidationStatus, "PASSED");
  assert.equal(question.adminProof.uniqueCorrectOptionCount, 1);
  assert.equal(question.adminProof.allOptionGraphsValid, true);
  assert.equal(question.adminProof.reviewStatus, "HUMAN_REVIEW_REQUIRED");
  assert.equal(
    question.adminProof.siblingPolicy,
    "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
  );
  assert.equal(question.adminProof.halfRelationsInScope, false);
  assert.ok(question.adminProof.questionId);
  assert.ok(question.adminProof.semanticFingerprint.length >= 24);
  assert.ok(question.adminProof.tokenMapId.length >= 12);
  assert.ok(question.adminProof.familyTopologyId);
  assert.ok(question.explanation.steps.length >= 2);
  assert.ok(question.explanation.steps.length <= 8);
  assert.ok(question.explanation.conclusion.length > 20);
  assert.ok(wordCount(visibleExplanation(question)) <= 300);
  assert.ok(
    !/construction audit|graph audit|exact construction/iu.test(
      visibleExplanation(question),
    ),
  );
  question.explanation.optionAnalysis.forEach((analysis, index) => {
    assert.equal(analysis.optionText, question.options[index]!.text);
    assert.equal(analysis.isCorrect, question.options[index]!.isCorrect);
    assert.notEqual(analysis.explanation, genericWrong);
    assert.notEqual(analysis.explanation, genericCorrect);
    assert.ok(analysis.explanation.length > 25);
    if (!analysis.isCorrect) assert.ok(analysis.failureCode);
  });
  assert.equal(
    question.explanation.familyTree.nodes.length,
    question.graph.persons.length,
  );
  assert.equal(
    question.explanation.familyTree.edges.length,
    question.graph.parents.length +
      question.graph.spouses.length +
      question.graph.siblings.length,
  );
  assert.ok(question.explanation.familyTree.legend.length >= 5);
  assert.ok(question.explanation.familyTree.accessibleSummary.length > 20);
  assert.ok(
    question.explanation.familyTree.edges.every(
      (edge) => edge.type !== "parent-child" || edge.directed,
    ),
  );
  assert.ok(
    question.explanation.familyTree.edges.every(
      (edge) => edge.relationLabel.length > 2,
    ),
  );
}

const invalidStatementQuestions = certified.filter(
  (question) =>
    question.query.kind === "SELECT_VALIDITY" &&
    question.query.desiredStatus === "INVALID",
);
assert.equal(invalidStatementQuestions.length, 16);
for (const question of invalidStatementQuestions) {
  const selected = question.options[question.correctIndex]!;
  assert.equal(selected.statementValidity, "INVALID");
  assert.match(
    question.explanation.optionAnalysis[question.correctIndex]!.explanation,
    /correct choice: the statement is invalid/iu,
  );
  const validUnselected = question.options.filter(
    (option) => !option.isCorrect && option.statementValidity === "VALID",
  );
  assert.equal(validUnselected.length, 3);
  for (const option of validUnselected) {
    const analysis = question.explanation.optionAnalysis.find(
      (entry) => entry.optionText === option.text,
    )!;
    assert.match(analysis.explanation, /not the answer: this statement is valid/iu);
  }
}

const ql034 = certified.filter((question) => question.qlId === "BLR-QL-034");
assert.equal(ql034.length, 32);
const correctPersonCounts = Object.fromEntries(
  ["A", "B", "C", "D"].map((personId) => [
    personId,
    ql034.filter((question) => question.answer === personId).length,
  ]),
);
assert.deepEqual(correctPersonCounts, { A: 8, B: 8, C: 8, D: 8 });
for (const question of ql034) {
  assert.deepEqual(
    [...question.options.map((option) => option.text)].sort(),
    ["A", "B", "C", "D"],
  );
  assert.ok(question.completedStatements.length >= 5);
}

const inferredEdges = certified.flatMap(
  (question) => question.explanation.familyTree.edges,
).filter((edge) => edge.evidence === "INFERRED");
assert.ok(inferredEdges.length > 0, "Inferred edges must be explicitly marked.");
assert.ok(
  certified.some((question) =>
    question.explanation.familyTree.edges.some((edge) => edge.isOnDecisivePath),
  ),
  "At least one diagram must highlight a decisive path.",
);

for (const question of bank.slice(0, 32)) {
  assert.deepEqual(
    generateBlrCp007V2Question(question.sourcePrototypeId, question.seed),
    question,
    `${question.itemId}: deterministic replay`,
  );
}

console.log(
  JSON.stringify(
    {
      status: "CP007_V2_REMEDIATION_REVIEW_REQUIRED",
      recordCount: telemetry.recordCount,
      optionCount: telemetry.optionCount,
      prototypeCount: telemetry.prototypeCount,
      authorityCount: telemetry.authorityCount,
      answerPositions: telemetry.answerPositions,
      uniqueAnswerPatterns: answerPatterns.size,
      semicolonCorrectOptionCount: telemetry.semicolonCorrectOptionCount,
      semicolonWrongOptionCount: telemetry.semicolonWrongOptionCount,
      invalidStatementQuestions: invalidStatementQuestions.length,
      correctPersonCounts,
      inferredEdgesMarked: inferredEdges.length,
      independentVerifierDisagreements: 0,
      invalidOptionGraphs: 0,
      humanReviewRequired: true,
    },
    null,
    2,
  ),
);
