import { personsWithRelation } from "../foundation/family-analysis";
import { solveRelationFromGraph } from "../foundation/graph-closure";
import { relationLabel } from "../foundation/relation-ontology";
import type { BlrRelationId } from "../foundation/types";
import type {
  BlrCp002Anchor,
  BlrCp002AnswerId,
  BlrCp002Solution,
  BlrCp002StructuredPrompt,
  BlrEntityExpression,
  BlrRoleAssertion,
  BlrRoleStep,
  BlrCp002SolvedExpression,
} from "./cp002-types";

export function cp002AnswerLabel(answerId: BlrCp002AnswerId): string {
  return answerId === "SELF" ? "Self" : relationLabel(answerId);
}

export function cp002RoleDepth(expression: BlrEntityExpression): number {
  return expression.kind === "ROLE_CHAIN" ? expression.steps.length : 0;
}

export function cp002OnlyConstraintCount(expression: BlrEntityExpression): number {
  return expression.kind === "ROLE_CHAIN"
    ? expression.steps.filter((step) => step.quantifier === "ONLY").length
    : 0;
}

function anchorPersonId(
  prompt: BlrCp002StructuredPrompt,
  anchor: BlrCp002Anchor,
): string {
  if (anchor === "SPEAKER") return prompt.speakerId;
  if (anchor === "LISTENER") {
    if (!prompt.listenerId) throw new Error("LISTENER anchor used without a listener.");
    return prompt.listenerId;
  }
  if (!prompt.pointedPersonId) {
    throw new Error("POINTED_PERSON anchor used without a pointed person.");
  }
  return prompt.pointedPersonId;
}

function nameFor(prompt: BlrCp002StructuredPrompt, personId: string): string {
  return prompt.personNames[personId] ?? personId;
}

function nextCandidates(
  prompt: BlrCp002StructuredPrompt,
  currentIds: readonly string[],
  step: BlrRoleStep,
): string[] {
  const next = new Set<string>();
  for (const currentId of currentIds) {
    const matches = personsWithRelation(
      prompt.familyGraph,
      currentId,
      step.relationId,
    );
    if (step.quantifier === "ONLY" && matches.length !== 1) {
      throw new Error(
        `${nameFor(prompt, currentId)} does not have exactly one ${relationLabel(step.relationId).toLocaleLowerCase("en-IN")} in the active scope.`,
      );
    }
    for (const match of matches) next.add(match);
  }
  if (next.size === 0) {
    throw new Error(
      `Role step ${step.relationId} produced no candidate from ${currentIds.join(", ")}.`,
    );
  }
  return [...next];
}

export function resolveBlrCp002Expression(
  prompt: BlrCp002StructuredPrompt,
  expression: BlrEntityExpression,
): BlrCp002SolvedExpression {
  const anchorId = anchorPersonId(prompt, expression.anchor);
  if (expression.kind === "ANCHOR") {
    return {
      expression,
      candidateIds: [anchorId],
      resolvedPersonId: anchorId,
      trace: [`${expression.anchor} = ${nameFor(prompt, anchorId)}`],
      onlyConstraintCount: 0,
    };
  }

  let candidates: readonly string[] = [anchorId];
  const trace = [`${expression.anchor} = ${nameFor(prompt, anchorId)}`];
  for (const step of expression.steps) {
    candidates = nextCandidates(prompt, candidates, step);
    trace.push(
      `${step.quantifier === "ONLY" ? "only " : ""}${relationLabel(step.relationId).toLocaleLowerCase("en-IN")} -> ${candidates.map((id) => nameFor(prompt, id)).join(" / ")}`,
    );
  }

  if (candidates.length !== 1) {
    throw new Error(
      `Role chain remained ambiguous: ${candidates.map((id) => nameFor(prompt, id)).join(", ")}.`,
    );
  }

  return {
    expression,
    candidateIds: candidates,
    resolvedPersonId: candidates[0]!,
    trace,
    onlyConstraintCount: cp002OnlyConstraintCount(expression),
  };
}

function verifyAssertion(
  prompt: BlrCp002StructuredPrompt,
  assertion: BlrRoleAssertion,
): void {
  const subject = resolveBlrCp002Expression(prompt, assertion.subject);
  const reference = resolveBlrCp002Expression(prompt, assertion.reference);

  if (assertion.relation.kind === "SAME_PERSON") {
    if (subject.resolvedPersonId !== reference.resolvedPersonId) {
      throw new Error("The CP-002 SAME_PERSON assertion does not resolve to one identity.");
    }
    return;
  }

  const solved = solveRelationFromGraph(
    prompt.familyGraph,
    subject.resolvedPersonId,
    reference.resolvedPersonId,
  );
  if (solved.relationId !== assertion.relation.relationId) {
    throw new Error(
      `Assertion expected ${assertion.relation.relationId} but graph proves ${solved.relationId}.`,
    );
  }

  if (assertion.relation.quantifier === "ONLY") {
    const matches = personsWithRelation(
      prompt.familyGraph,
      reference.resolvedPersonId,
      assertion.relation.relationId,
    );
    if (matches.length !== 1 || matches[0] !== subject.resolvedPersonId) {
      throw new Error("The displayed ONLY assertion is not true in the active family scope.");
    }
  }
}

export function solveBlrCp002Prompt(
  prompt: BlrCp002StructuredPrompt,
): BlrCp002Solution {
  verifyAssertion(prompt, prompt.assertion);
  const subjectExpression = resolveBlrCp002Expression(prompt, prompt.query.subject);
  const referenceExpression = resolveBlrCp002Expression(prompt, prompt.query.reference);
  const querySubjectId = subjectExpression.resolvedPersonId;
  const queryReferenceId = referenceExpression.resolvedPersonId;

  if (querySubjectId === queryReferenceId) {
    return {
      answerId: "SELF",
      querySubjectId,
      queryReferenceId,
      pathPersonIds: [querySubjectId],
      pathLength: 0,
      assertionVerified: true,
      subjectExpression,
      referenceExpression,
    };
  }

  const relation = solveRelationFromGraph(
    prompt.familyGraph,
    querySubjectId,
    queryReferenceId,
  );
  return {
    answerId: relation.relationId,
    querySubjectId,
    queryReferenceId,
    pathPersonIds: relation.path.personIds,
    pathLength: relation.path.steps.length,
    assertionVerified: true,
    subjectExpression,
    referenceExpression,
  };
}

export function cp002AssertionOnlyConstraintCount(
  assertion: BlrRoleAssertion,
): number {
  const relationOnly =
    assertion.relation.kind === "KINSHIP" && assertion.relation.quantifier === "ONLY"
      ? 1
      : 0;
  return (
    cp002OnlyConstraintCount(assertion.subject) +
    cp002OnlyConstraintCount(assertion.reference) +
    relationOnly
  );
}

export function relationAnswerId(value: string): BlrRelationId {
  return value as BlrRelationId;
}
