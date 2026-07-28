import { personsWithRelation } from "../foundation/family-analysis";
import { solveRelationFromGraph } from "../foundation/graph-closure";
import { relationLabel } from "../foundation/relation-ontology";
import type {
  BlrRelationId,
  BlrRoleId,
  PrimitivePathStep,
} from "../foundation/types";
import type {
  BlrCp002Anchor,
  BlrCp002AnswerId,
  BlrCp002Solution,
  BlrCp002SolvedExpression,
  BlrCp002StructuredPrompt,
  BlrEntityExpression,
  BlrRoleAssertion,
  BlrRoleCardinalityConstraint,
  BlrRoleStep,
} from "./cp002-types";

const BROAD_ROLE_RELATIONS: Readonly<
  Record<PrimitivePathStep, readonly BlrRelationId[]>
> = {
  PARENT: ["FATHER", "MOTHER"],
  CHILD: ["SON", "DAUGHTER"],
  SIBLING: ["BROTHER", "SISTER"],
  SPOUSE: ["HUSBAND", "WIFE"],
};

function isBroadRole(roleId: BlrRoleId): roleId is PrimitivePathStep {
  return roleId in BROAD_ROLE_RELATIONS;
}

function roleSetPhrase(roleId: BlrRoleId): string {
  if (roleId === "SIBLING") return "brother or sister";
  if (roleId === "CHILD") return "son or daughter";
  if (roleId === "PARENT") return "father or mother";
  if (roleId === "SPOUSE") return "husband or wife";
  return relationLabel(roleId).toLocaleLowerCase("en-IN");
}

function personsForRole(
  prompt: BlrCp002StructuredPrompt,
  referenceId: string,
  roleId: BlrRoleId,
): string[] {
  const relationIds = isBroadRole(roleId)
    ? BROAD_ROLE_RELATIONS[roleId]
    : [roleId];
  const matches = new Set<string>();
  for (const relationId of relationIds) {
    for (const personId of personsWithRelation(
      prompt.familyGraph,
      referenceId,
      relationId,
    )) {
      matches.add(personId);
    }
  }
  return [...matches];
}

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

export function cp002NegativeConstraintCount(
  prompt: BlrCp002StructuredPrompt,
): number {
  return (prompt.constraints ?? []).filter(
    (constraint) => constraint.cardinality === "NONE",
  ).length;
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
    const matches = personsForRole(prompt, currentId, step.relationId);
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

function verifyConstraint(
  prompt: BlrCp002StructuredPrompt,
  constraint: BlrRoleCardinalityConstraint,
): string {
  const reference = resolveBlrCp002Expression(prompt, constraint.reference);
  const matches = personsForRole(
    prompt,
    reference.resolvedPersonId,
    constraint.relationId,
  );

  if (constraint.cardinality === "NONE" && matches.length !== 0) {
    throw new Error(
      `${nameFor(prompt, reference.resolvedPersonId)} was required to have no ${roleSetPhrase(constraint.relationId)}, but the active family contains ${matches.map((id) => nameFor(prompt, id)).join(", ")}.`,
    );
  }

  return `${nameFor(prompt, reference.resolvedPersonId)} has no ${roleSetPhrase(constraint.relationId)} in the displayed family.`;
}

function verifyConstraints(prompt: BlrCp002StructuredPrompt): readonly string[] {
  return (prompt.constraints ?? []).map((constraint) =>
    verifyConstraint(prompt, constraint),
  );
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

  const matches = personsForRole(
    prompt,
    reference.resolvedPersonId,
    assertion.relation.relationId,
  );
  if (!matches.includes(subject.resolvedPersonId)) {
    throw new Error(
      `Assertion does not prove ${nameFor(prompt, subject.resolvedPersonId)} as the ${relationLabel(assertion.relation.relationId).toLocaleLowerCase("en-IN")} of ${nameFor(prompt, reference.resolvedPersonId)}.`,
    );
  }

  if (
    assertion.relation.quantifier === "ONLY" &&
    (matches.length !== 1 || matches[0] !== subject.resolvedPersonId)
  ) {
    throw new Error("The displayed ONLY assertion is not true in the active family scope.");
  }
}

export function solveBlrCp002Prompt(
  prompt: BlrCp002StructuredPrompt,
): BlrCp002Solution {
  const constraintTrace = verifyConstraints(prompt);
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
      constraintsVerified: true,
      constraintTrace,
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
    constraintsVerified: true,
    constraintTrace,
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
