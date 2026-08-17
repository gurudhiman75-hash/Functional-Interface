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
  modelSatisfiesConstraints,
  regionHas,
  validateTermOrder,
} from "./region-model";

function independentlyProhibited(
  constraint: PrimitiveConstraint,
  termOrder: readonly TermId[],
  mask: number,
): boolean {
  if (constraint.kind === "ALL") {
    return regionHas(termOrder, mask, constraint.subject)
      && !regionHas(termOrder, mask, constraint.predicate);
  }
  if (constraint.kind === "NO") {
    return regionHas(termOrder, mask, constraint.subject)
      && regionHas(termOrder, mask, constraint.predicate);
  }
  if (constraint.kind === "EMPTY") {
    return regionHas(termOrder, mask, constraint.term);
  }
  return false;
}

function independentlyMatchesObligation(
  constraint: PrimitiveConstraint,
  termOrder: readonly TermId[],
  mask: number,
): boolean {
  if (constraint.kind === "EXISTS") return regionHas(termOrder, mask, constraint.term);
  if (constraint.kind === "SOME") {
    return regionHas(termOrder, mask, constraint.subject)
      && regionHas(termOrder, mask, constraint.predicate);
  }
  if (constraint.kind === "SOME_NOT") {
    return regionHas(termOrder, mask, constraint.subject)
      && !regionHas(termOrder, mask, constraint.predicate);
  }
  return false;
}

function independentlySolveSatisfiability(
  constraints: readonly PrimitiveConstraint[],
  termOrder: readonly TermId[],
): SatisfiabilityResult {
  validateTermOrder(termOrder);
  const universal = constraints.filter(
    (constraint) => constraint.kind === "ALL"
      || constraint.kind === "NO"
      || constraint.kind === "EMPTY",
  );
  const obligations = constraints.filter(
    (constraint) => constraint.kind === "EXISTS"
      || constraint.kind === "SOME"
      || constraint.kind === "SOME_NOT",
  );
  const legalRegions = allRegionMasks(termOrder).filter((mask) =>
    universal.every((constraint) => !independentlyProhibited(constraint, termOrder, mask)),
  );

  const selected: number[] = [];
  const search = (obligationIndex: number): boolean => {
    if (obligationIndex >= obligations.length) return true;
    const obligation = obligations[obligationIndex];

    for (const mask of selected) {
      if (!independentlyMatchesObligation(obligation, termOrder, mask)) continue;
      if (search(obligationIndex + 1)) return true;
    }

    for (const mask of legalRegions) {
      if (!independentlyMatchesObligation(obligation, termOrder, mask)) continue;
      selected.push(mask);
      if (search(obligationIndex + 1)) return true;
      selected.pop();
    }
    return false;
  };

  if (!search(0)) return { satisfiable: false, model: null };
  const model = canonicalModel(termOrder, selected);
  if (!modelSatisfiesConstraints(model, constraints)) {
    throw new Error("Independent verifier constructed an invalid witness model.");
  }
  return { satisfiable: true, model };
}

function independentTruthScenarios(
  conclusion: CanonicalConclusion,
  desiredTruth: boolean,
): readonly (readonly PrimitiveConstraint[])[] {
  const originId = desiredTruth
    ? conclusion.conclusionId
    : `${conclusion.conclusionId}:INDEPENDENT_NEGATION`;

  if (desiredTruth) {
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
    }
  }

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
  }
}

function independentlyFindScenario(
  premises: readonly PrimitiveConstraint[],
  scenarios: readonly (readonly PrimitiveConstraint[])[],
  termOrder: readonly TermId[],
): SatisfiabilityResult {
  for (const scenario of scenarios) {
    const result = independentlySolveSatisfiability([...premises, ...scenario], termOrder);
    if (result.satisfiable) return result;
  }
  return { satisfiable: false, model: null };
}

export function classifyConclusionIndependent(
  premises: readonly PrimitiveConstraint[],
  conclusion: CanonicalConclusion,
  termOrder: readonly TermId[],
): ConclusionTruthProfile {
  const premiseResult = independentlySolveSatisfiability(premises, termOrder);
  if (!premiseResult.satisfiable) {
    throw new Error("Cannot independently classify a conclusion from inconsistent premises.");
  }

  const trueResult = independentlyFindScenario(
    premises,
    independentTruthScenarios(conclusion, true),
    termOrder,
  );
  const falseResult = independentlyFindScenario(
    premises,
    independentTruthScenarios(conclusion, false),
    termOrder,
  );

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
