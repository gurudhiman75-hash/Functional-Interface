import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import type {
  BlrCp006CodedStatement,
  BlrCp006Graph,
  BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007V2Question } from "./cp007-v2-model";

function line(statement: BlrCp006CodedStatement): string {
  return `${statement.leftId} ${statement.token} ${statement.rightId}`;
}

function decodeOption(
  question: BlrCp007V2Question,
  statements: readonly BlrCp006CodedStatement[],
  optionIndex: number,
): BlrCp006Graph {
  const first = statements[0]!;
  const scenario: BlrCp006Scenario = {
    scenarioId: `${question.itemId}::INDEPENDENT::${optionIndex}`,
    topologyId: question.topologyId,
    keyStyle: question.keyStyle,
    codeKey: question.codeKey,
    statements,
    expressionLines: statements.map(line),
    query: {
      kind: "RELATION",
      subjectId: first.leftId,
      referenceId: first.rightId,
    },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "Independent CP-007 V2 verification",
  };
  return decodeScenario(scenario).graph;
}

function relationMatches(
  graph: BlrCp006Graph,
  subjectId: string,
  referenceId: string,
  expected: string,
): boolean {
  try {
    return relationOf(graph, subjectId, referenceId) === expected;
  } catch {
    return false;
  }
}

function optionShouldBeCorrect(
  question: BlrCp007V2Question,
  optionIndex: number,
): boolean {
  const option = question.options[optionIndex]!;
  const graph = decodeOption(question, option.statements, optionIndex);
  const query = question.query;

  if (query.kind === "SELECT_EXPRESSION") {
    return relationMatches(
      graph,
      query.target.subjectId,
      query.target.referenceId,
      query.target.relationId,
    );
  }
  if (query.kind === "MISSING_TOKEN") {
    if (option.completionValue.kind !== "TOKEN") return false;
    return (
      option.completionValue.token ===
      query.completeStatements[query.blankStatementIndex]!.token
    );
  }
  if (query.kind === "MISSING_TOKEN_PAIR") {
    if (option.completionValue.kind !== "TOKEN_PAIR") return false;
    const expected = [
      query.completeStatements[query.blankStatementIndices[0]]!.token,
      query.completeStatements[query.blankStatementIndices[1]]!.token,
    ];
    return (
      option.completionValue.tokens[0] === expected[0] &&
      option.completionValue.tokens[1] === expected[1]
    );
  }
  if (query.kind === "MISSING_PERSON") {
    return relationMatches(
      graph,
      query.target.subjectId,
      query.target.referenceId,
      query.target.relationId,
    );
  }

  if (!option.claim) return false;
  const statementIsValid = relationMatches(
    graph,
    option.claim.subjectId,
    option.claim.referenceId,
    option.claim.relationId,
  );
  return query.desiredStatus === "VALID" ? statementIsValid : !statementIsValid;
}

function graphEdgeCount(graph: BlrCp006Graph): number {
  return graph.parents.length + graph.spouses.length + graph.siblings.length;
}

export function verifyBlrCp007V2Question(
  question: BlrCp007V2Question,
): readonly string[] {
  const issues: string[] = [];
  const independentlyCorrect = question.options.map((_, optionIndex) =>
    optionShouldBeCorrect(question, optionIndex),
  );
  if (independentlyCorrect.filter(Boolean).length !== 1) {
    issues.push(`${question.itemId}: independent verifier did not find one answer.`);
  }
  independentlyCorrect.forEach((isCorrect, optionIndex) => {
    if (isCorrect !== question.options[optionIndex]!.isCorrect) {
      issues.push(`${question.itemId}: option ${optionIndex} correctness mismatch.`);
    }
  });
  const correctIndex = independentlyCorrect.findIndex(Boolean);
  if (correctIndex !== question.correctIndex) {
    issues.push(`${question.itemId}: correct-index mismatch.`);
  }
  if (question.answer !== question.options[question.correctIndex]!.text) {
    issues.push(`${question.itemId}: answer text is not bound to the keyed option.`);
  }
  if (question.options.some((option) => option.graphValidity !== "VALID")) {
    issues.push(`${question.itemId}: option graph is not marked valid.`);
  }
  if (
    new Set(question.options.map((option) => option.text)).size !==
    question.options.length
  ) {
    issues.push(`${question.itemId}: duplicate option text.`);
  }
  if (
    question.explanation.optionAnalysis.length !== question.options.length ||
    question.explanation.optionAnalysis.some(
      (analysis, index) =>
        analysis.optionText !== question.options[index]!.text ||
        analysis.isCorrect !== question.options[index]!.isCorrect,
    )
  ) {
    issues.push(`${question.itemId}: option analysis is not synchronized.`);
  }
  if (
    question.explanation.familyTree.nodes.length !== question.graph.persons.length ||
    question.explanation.familyTree.edges.length !== graphEdgeCount(question.graph)
  ) {
    issues.push(`${question.itemId}: family-tree graph count mismatch.`);
  }
  if (
    question.explanation.familyTree.edges.some(
      (edge) => edge.type === "parent-child" && !edge.directed,
    )
  ) {
    issues.push(`${question.itemId}: parent-child edge lacks direction.`);
  }
  if (!question.explanation.familyTree.accessibleSummary.trim()) {
    issues.push(`${question.itemId}: empty accessibility summary.`);
  }
  if (question.adminProof.reviewStatus !== "HUMAN_REVIEW_REQUIRED") {
    issues.push(`${question.itemId}: remediation cannot self-approve human review.`);
  }
  return issues;
}

export type CertifiedBlrCp007V2Question = BlrCp007V2Question & {
  adminProof: BlrCp007V2Question["adminProof"] & {
    independentSolverStatus: "AGREED";
    rendererValidationStatus: "PASSED";
  };
};

export function certifyBlrCp007V2Question(
  question: BlrCp007V2Question,
): CertifiedBlrCp007V2Question {
  const issues = verifyBlrCp007V2Question(question);
  if (issues.length) throw new Error(issues.join("\n"));
  return {
    ...question,
    adminProof: {
      ...question.adminProof,
      independentSolverStatus: "AGREED",
      rendererValidationStatus: "PASSED",
    },
  };
}
