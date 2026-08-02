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

function independentProhibited(
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

function independentObligationMatch(
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

function independentSatisfiability(
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
    universal.every((constraint) => !independentProhibited(constraint, termOrder, mask)),
  );

  const selected: number[] = [];
  const search = (obligationIndex: number): boolean => {
    if (obligationIndex >= obligations.length) return true;
    const obligation = obligations[obligationIndex];

    for (const mask of selected) {
      if (!independentObligationMatch(obligation, termOrder, mask)) continue;
      if (search(obligationIndex + 1)) return true;
    }

    for (const mask of legalRegions) {
      if (!independentObligationMatch(obligation, termOrder, mask)) continue;
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
    if (conclusion.form === "ALL") {
      return [[
        { kind: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, originId },
        { kind: "EXISTS", term: conclusion.subject, originId },
      ]];
    }
    if (conclusion.form === "NO") {
      return [[
        { kind: "NO", subject: conclusion.subject, predicate: conclusion.predicate, originId },
        { kind: "EXISTS", term: conclusion.subject, originId },
      ]];
    }
    if (conclusion.form === "SOME") {
      return [[{ kind: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
    }
    return [[{ kind: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
  }

  if (conclusion.form === "ALL") {
    return [
      [{ kind: "EMPTY", term: conclusion.subject, originId }],
      [{ kind: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, originId }],
    ];
  }
  if (conclusion.form === "NO") {
    return [
      [{ kind: "EMPTY", term: conclusion.subject, originId }],
      [{ kind: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, originId }],
    ];
  }
  if (conclusion.form === "SOME") {
    return [[{ kind: "NO", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
  }
  return [[{ kind: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
}

function independentFindScenario(
  premises: readonly PrimitiveConstraint[],
  scenarios: readonly (readonly PrimitiveConstraint[])[],
  termOrder: readonly TermId[],
): SatisfiabilityResult {
  for (const scenario of scenarios) {
    const result = independentSatisfiability([...premises, ...scenario], termOrder);
    if (result.satisfiable) return result;
  }
  return { satisfiable: false, model: null };
}

export function classifyConclusionIndependent(
  premises: readonly PrimitiveConstraint[],
  conclusion: CanonicalConclusion,
  termOrder: readonly TermId[],
): ConclusionTruthProfile {
  const premiseResult = independentSatisfiability(premises, termOrder);
  if (!premiseResult.satisfiable) {
    throw new Error("Cannot independently classify a conclusion from inconsistent premises.");
  }

  const trueResult = independentFindScenario(
    premises,
    independentTruthScenarios(conclusion, true),
    termOrder,
  );
  const falseResult = independentFindScenario(
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
