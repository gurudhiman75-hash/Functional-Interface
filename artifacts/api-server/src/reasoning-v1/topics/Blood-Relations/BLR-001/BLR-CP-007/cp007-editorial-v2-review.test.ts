import { strict as assert } from "node:assert";
import { BLR_CP007_CONTRACTS } from "./cp007-model";
import {
  buildBlrCp007EditorialV2ReviewTelemetry,
  generateBlrCp007EditorialV2ReviewBank,
  generateBlrCp007EditorialV2ReviewQuestion,
} from "./cp007-editorial-v2-review";
import {
  BLR_CP007_EDITORIAL_V2_REVIEW_VERSION,
  BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION,
} from "./cp007-editorial-v2-model";

const bank = generateBlrCp007EditorialV2ReviewBank();
const telemetry = buildBlrCp007EditorialV2ReviewTelemetry(bank);

assert.equal(bank.length, 168);
assert.equal(telemetry.recordCount, 168);
assert.equal(telemetry.prototypeCount, 21);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.equal(telemetry.reviewVersion, BLR_CP007_EDITORIAL_V2_REVIEW_VERSION);
assert.deepEqual(telemetry.answerPositions, [41, 45, 42, 40]);
assert.deepEqual(telemetry.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.equal(telemetry.optionAnalysisCount, 672);
assert.equal(telemetry.uniqueQuestionSignatureCount, 168);
assert.equal(telemetry.invalidStatementQuestionCount, 16);
assert.deepEqual(telemetry.missingPersonCorrectLabelCounts, {
  P: 8,
  Q: 8,
  R: 8,
  S: 8,
});
assert(telemetry.semicolonCorrectCount > 0);
assert(telemetry.semicolonWrongCount > 0);
assert(telemetry.codedDiagramEdgeCount > 0);
assert(telemetry.inferredDiagramEdgeCount > 0);
assert.equal(telemetry.humanReviewRequired, true);

const fingerprints = new Set<string>();
const itemIds = new Set<string>();
const prototypeSequences = new Map<string, string[]>();
let invalidSelectedCount = 0;
let validUnselectedInInvalidTasks = 0;
let optionAnalyses = 0;
let graphValidMissingPersonOptions = 0;
let missingPersonCandidateRosterEdges = 0;

for (const question of bank) {
  assert(!itemIds.has(question.itemId), `${question.itemId}: duplicate item ID`);
  assert(!fingerprints.has(question.metadata.semanticFingerprint), `${question.itemId}: duplicate fingerprint`);
  itemIds.add(question.itemId);
  fingerprints.add(question.metadata.semanticFingerprint);

  assert.equal(question.metadata.runtimeVersion, BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION);
  assert.equal(question.metadata.reviewVersion, BLR_CP007_EDITORIAL_V2_REVIEW_VERSION);
  assert.equal(question.metadata.editorialStatus, "REMEDIATED_REVIEW_CANDIDATE");
  assert.equal(question.metadata.optionOrderAlgorithm, "SEEDED_FISHER_YATES_V2");
  assert.equal(question.metadata.siblingPolicy, "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED");
  assert.equal(question.metadata.nameBasedGenderAssumptions, 0);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);

  const contract = BLR_CP007_CONTRACTS.find((entry) => entry.qlId === question.qlId);
  assert(contract, `${question.itemId}: missing permanent contract`);
  assert.equal(question.solveAuthority, contract.solveAuthority);
  assert.equal(question.answerType, contract.answerType);

  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.reviewProof.uniqueCorrectOptionCount, 1);
  assert.equal(question.reviewProof.independentSolverStatus, "AGREED");
  assert.equal(question.reviewProof.graphValidityStatus, "VALID");
  assert.equal(question.reviewProof.rendererValidationStatus, "VALID");
  assert.equal(question.reviewProof.reviewStatus, "HUMAN_REVIEW_REQUIRED");
  assert.equal(question.reviewProof.semanticFingerprint, question.metadata.semanticFingerprint);
  assert.equal(question.reviewProof.questionId, question.itemId);
  assert(question.reviewProof.reviewerNote.length > 20);

  const replay = generateBlrCp007EditorialV2ReviewQuestion(question.sourcePrototypeId, question.seed);
  assert.deepEqual(replay, question, `${question.itemId}: deterministic replay`);

  const sequence = prototypeSequences.get(question.sourcePrototypeId) ?? [];
  sequence.push("ABCD"[question.correctIndex]!);
  prototypeSequences.set(question.sourcePrototypeId, sequence);

  assert(question.explanation.steps.length >= 1);
  assert(question.explanation.conclusion.length >= 25);
  assert.equal(question.explanation.optionAnalysis.length, 4);
  assert.equal(question.explanation.familyTree.kind, "blood-relation-family-tree");
  assert(question.explanation.familyTree.accessibleSummary.length >= 35);
  assert(!/1 family links\b/i.test(question.explanation.familyTree.accessibleSummary));
  assert.equal(question.explanation.diagramProof.siblingPolicy, "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED");
  assert(question.explanation.diagramProof.legend.some((entry) => /directly coded/i.test(entry)));
  assert(question.explanation.diagramProof.legend.some((entry) => /inferred/i.test(entry)));
  assert.equal(question.explanation.diagramProof.edges.length, question.explanation.familyTree.edges.length);
  question.explanation.diagramProof.edges.forEach((edge) => {
    assert(edge.label.length > 0);
    assert(["CODED", "INFERRED"].includes(edge.evidence));
  });

  const visibleExplanation = [
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    question.explanation.commonTrap ?? "",
  ].join(" ");
  assert(!/construction audit|completed graph audit|exact construction/i.test(visibleExplanation));
  assert(!/prototype|runtime|semantic fingerprint|solver metadata/i.test(visibleExplanation));
  assert(!/For two blanks/.test(visibleExplanation) || question.query.kind === "MISSING_TOKEN_PAIR");

  question.explanation.optionAnalysis.forEach((analysis, index) => {
    const option = question.options[index]!;
    assert.equal(analysis.optionText, option.text);
    assert.equal(analysis.statementValidity, option.statementValidity);
    assert.equal(analysis.isCorrectAnswerForTask, option.isCorrectAnswerForTask);
    assert.equal(analysis.failureCode, option.failureCode);
    assert.equal(analysis.explanation, option.studentExplanation);
    assert(analysis.explanation.length >= 25);
    assert(!/changes a relation, reverses a link, breaks the path or misstates validity/i.test(analysis.explanation));
    optionAnalyses += 1;
  });

  if (question.query.kind === "SELECT_VALIDITY" && question.query.desiredStatus === "INVALID") {
    const selected = question.options[question.correctIndex]!;
    assert.equal(selected.statementValidity, "INVALID");
    assert(/statement is therefore incorrect|statement is incorrect/i.test(selected.studentExplanation));
    assert(/correct choice/i.test(selected.studentExplanation));
    invalidSelectedCount += 1;
    question.options.forEach((option, index) => {
      if (index === question.correctIndex) return;
      assert.equal(option.statementValidity, "VALID");
      assert.equal(option.failureCode, "VALID_STATEMENT_NOT_REQUESTED");
      assert(/not the answer/i.test(option.studentExplanation));
      validUnselectedInInvalidTasks += 1;
    });
  }

  if (question.qlId === "BLR-QL-034") {
    assert.equal(question.query.kind, "MISSING_PERSON");
    if (question.query.kind !== "MISSING_PERSON") throw new Error("QL-034 query mismatch");
    assert.deepEqual(question.query.candidatePersonIds, ["P", "Q", "R", "S"]);
    const visiblePeople = new Set(question.query.completeStatements.flatMap((entry) => [entry.leftId, entry.rightId]));
    question.query.candidatePersonIds.forEach((candidateId) => {
      assert(visiblePeople.has(candidateId), `${question.itemId}: absent candidate ${candidateId}`);
      const rosterEdge = question.query.completeStatements.find((entry) =>
        entry.leftId === candidateId && /^V[1-4]$/.test(entry.rightId),
      );
      assert(rosterEdge, `${question.itemId}: candidate ${candidateId} lacks isolated roster evidence`);
      missingPersonCandidateRosterEdges += 1;
    });
    assert(!question.query.completeStatements.some((entry) =>
      entry.leftId === "U" && question.query.candidatePersonIds.includes(entry.rightId as "P" | "Q" | "R" | "S"),
    ), `${question.itemId}: shared-parent roster survived`);
    question.options.forEach((option) => {
      assert.equal(option.graphValidity, "VALID", `${question.itemId}: invalid QL-034 option ${option.text}`);
      graphValidMissingPersonOptions += 1;
    });
  }
}

assert.equal(optionAnalyses, 672);
assert.equal(invalidSelectedCount, 16);
assert.equal(validUnselectedInInvalidTasks, 48);
assert.equal(graphValidMissingPersonOptions, 128);
assert.equal(missingPersonCandidateRosterEdges, 128);

const legacyCycles = new Set(["ADCBADCB", "CBADCBAD", "DCBADCBA", "BADCBADC"]);
for (const [prototypeId, letters] of prototypeSequences) {
  const sequence = letters.join("");
  assert.equal(sequence.length, 8);
  assert(!legacyCycles.has(sequence), `${prototypeId}: legacy answer cycle survived`);
  assert.notEqual(sequence.slice(0, 4), sequence.slice(4), `${prototypeId}: repeated four-answer cycle`);
  assert(!/(A{4}|B{4}|C{4}|D{4})/.test(sequence), `${prototypeId}: four-answer run`);
}

console.log(JSON.stringify({
  runtimeVersion: BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION,
  reviewVersion: BLR_CP007_EDITORIAL_V2_REVIEW_VERSION,
  ...telemetry,
  invalidSelectedExplanationsCorrected: invalidSelectedCount,
  validUnselectedStatementsCorrectlyDescribed: validUnselectedInInvalidTasks,
  graphValidMissingPersonOptions,
  missingPersonCandidateRosterEdges,
  answerSequenceLeakage: 0,
  genericWrongOptionExplanations: 0,
  humanReviewStatus: "REQUIRED",
  verdict: "BLR-CP-007 EDITORIAL V2 HARDENED REVIEW BANK PASSED; V1 FINAL FREEZE REMAINS SUPERSEDED",
}, null, 2));
