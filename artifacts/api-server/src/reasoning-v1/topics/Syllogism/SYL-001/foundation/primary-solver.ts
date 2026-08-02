import type {
  CanonicalConclusion,
  ConclusionTruthProfile,
  PrimitiveConstraint,
  SatisfiabilityResult,
  TermId,
} from "./types";
import {
  allRegionMasks,
  canonicalModel,
  constraintProhibitsRegion,
  isExistentialObligation,
  regionSatisfiesObligation,
  validateTermOrder,
} from "./region-model";

function uniqueConstraintKey(constraint: PrimitiveConstraint): string {
  if (constraint.kind === "EXISTS" || constraint.kind === "EMPTY") {
    return `${constraint.kind}:${constraint.term}`;
  }
  return `${constraint.kind}:${constraint.subject}:${constraint.predicate}`;
}

function dedupeConstraints(
  constraints: readonly PrimitiveConstraint[],
): readonly PrimitiveConstraint[] {
  const seen = new Set<string>();
  const result: PrimitiveConstraint[] = [];
  for (const constraint of constraints) {
    const key = uniqueConstraintKey(constraint);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(constraint);
  }
  return result;
}

export function solveConstraintSatisfiability(
  constraints: readonly PrimitiveConstraint[],
  termOrder: readonly TermId[],
): SatisfiabilityResult {
  validateTermOrder(termOrder);
  const uniqueConstraints = dedupeConstraints(constraints);
  const allMasks = allRegionMasks(termOrder);
  const universalConstraints = uniqueConstraints.filter(
    (constraint) => !isExistentialObligation(constraint),
  );
  const obligations = uniqueConstraints.filter(isExistentialObligation);
  const allowedMasks = allMasks.filter((mask) =>
    universalConstraints.every(
      (constraint) => !constraintProhibitsRegion(constraint, termOrder, mask),
    ),
  );

  const occupiedMasks: number[] = [];
  for (const obligation of obligations) {
    const witnessMask = allowedMasks.find((mask) =>
      regionSatisfiesObligation(obligation, termOrder, mask),
    );
    if (witnessMask === undefined) {
      return {
        satisfiable: false,
        model: null,
        reason: `No legal witness region satisfies ${uniqueConstraintKey(obligation)}.`,
      };
    }
    occupiedMasks.push(witnessMask);
  }

  return {
    satisfiable: true,
    model: canonicalModel(termOrder, occupiedMasks),
  };
}

function trueScenarios(
  conclusion: CanonicalConclusion,
): readonly (readonly PrimitiveConstraint[])[] {
  const originId = conclusion.conclusionId;
  switch (conclusion.form) {
    case "ALL":
      return [[
        { kind: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, originId },
        { kind: "EXISTS", term: conclusion.subject, originId },
      ]];
    case "NO":
      return [[
        { kind: "NO", subject: conclusion.subject, predicate: conclusion.predicate, originId },
        { kind: "EXISTS", term: conclusion.subject, originId },
        { kind: "EXISTS", term: conclusion.predicate, originId },
      ]];
    case "SOME":
      return [[{ kind: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
    case "SOME_NOT":
      return [[{ kind: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
    default: {
      const exhaustive: never = conclusion.form;
      throw new Error(`Unsupported conclusion form: ${String(exhaustive)}.`);
    }
  }
}

function falseScenarios(
  conclusion: CanonicalConclusion,
): readonly (readonly PrimitiveConstraint[])[] {
  const originId = `${conclusion.conclusionId}:NEGATED`;
  switch (conclusion.form) {
    case "ALL":
      return [
        [{ kind: "EMPTY", term: conclusion.subject, originId }],
        [{ kind: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, originId }],
      ];
    case "NO":
      return [
        [{ kind: "EMPTY", term: conclusion.subject, originId }],
        [{ kind: "EMPTY", term: conclusion.predicate, originId }],
        [{ kind: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, originId }],
      ];
    case "SOME":
      return [[{ kind: "NO", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
    case "SOME_NOT":
      return [[{ kind: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
    default: {
      const exhaustive: never = conclusion.form;
      throw new Error(`Unsupported conclusion form: ${String(exhaustive)}.`);
    }
  }
}

function findSatisfiableScenario(
  premises: readonly PrimitiveConstraint[],
  scenarios: readonly (readonly PrimitiveConstraint[])[],
  termOrder: readonly TermId[],
): SatisfiabilityResult {
  for (const scenario of scenarios) {
    const result = solveConstraintSatisfiability([...premises, ...scenario], termOrder);
    if (result.satisfiable) return result;
  }
  return { satisfiable: false, model: null };
}

export function classifyConclusionPrimary(
  premises: readonly PrimitiveConstraint[],
  conclusion: CanonicalConclusion,
  termOrder: readonly TermId[],
): ConclusionTruthProfile {
  const premiseResult = solveConstraintSatisfiability(premises, termOrder);
  if (!premiseResult.satisfiable) {
    throw new Error("Cannot classify a conclusion from inconsistent premises.");
  }

  const trueResult = findSatisfiableScenario(premises, trueScenarios(conclusion), termOrder);
  const falseResult = findSatisfiableScenario(premises, falseScenarios(conclusion), termOrder);

  if (!trueResult.satisfiable && !falseResult.satisfiable) {
    throw new Error("Conclusion truth evaluation produced no admissible truth state.");
  }

  const classification = trueResult.satisfiable
    ? falseResult.satisfiable
      ? "UNDETERMINED"
      : "ENTAILED"
    : "CONTRADICTED";

  return {
    canBeTrue: trueResult.satisfiable,
    canBeFalse: falseResult.satisfiable,
    classification,
    witnessModel: trueResult.model,
    counterModel: falseResult.model,
  };
}
