const assert = {
  equal(actual: unknown, expected: unknown, message?: string): void {
    if (actual !== expected) throw new Error(message ?? `Expected ${String(expected)}, received ${String(actual)}.`);
  },
  deepEqual(actual: unknown, expected: unknown, message?: string): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message ?? `Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
    }
  },
  throws(callback: () => unknown, pattern: RegExp): void {
    try {
      callback();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!pattern.test(message)) throw error;
      return;
    }
    throw new Error(`Expected callback to throw ${pattern}.`);
  },
};

import { collectTerms, normalizePremise, normalizePremises } from "./normalization";
import { classifyConclusionPrimary, solveConstraintSatisfiability } from "./primary-solver";
import { modelSatisfiesConstraints } from "./region-model";
import { verifySolverAgreement } from "./solver-agreement";
import type { CanonicalConclusion, SurfacePremise } from "./types";

function conclusion(
  conclusionId: string,
  form: CanonicalConclusion["form"],
  subject: string,
  predicate: string,
): CanonicalConclusion {
  return { conclusionId, form, subject, predicate };
}

function evaluate(
  premises: readonly SurfacePremise[],
  candidate: CanonicalConclusion,
) {
  const normalized = normalizePremises(premises);
  const terms = collectTerms(normalized, [candidate]);
  const agreement = verifySolverAgreement(normalized, candidate, terms);
  assert.equal(agreement.agreed, true, `Solver disagreement for ${candidate.conclusionId}`);
  return { normalized, terms, result: agreement.primary };
}

{
  const { result } = evaluate(
    [{ premiseId: "P1", form: "ALL", subject: "A", predicate: "B" }],
    conclusion("C1", "SOME", "A", "B"),
  );
  assert.equal(result.classification, "ENTAILED");
}

{
  const { result } = evaluate(
    [{ premiseId: "P1", form: "ALL", subject: "A", predicate: "B" }],
    conclusion("C1", "ALL", "B", "A"),
  );
  assert.equal(result.classification, "UNDETERMINED");
}

{
  const { result } = evaluate(
    [{ premiseId: "P1", form: "NO", subject: "A", predicate: "B" }],
    conclusion("C1", "SOME_NOT", "A", "B"),
  );
  assert.equal(result.classification, "ENTAILED");
}

{
  const { result } = evaluate(
    [{ premiseId: "P1", form: "NO", subject: "A", predicate: "B" }],
    conclusion("C1", "SOME_NOT", "B", "A"),
  );
  assert.equal(result.classification, "UNDETERMINED");
}

{
  const normalized = normalizePremise({
    premiseId: "ONLY-1",
    form: "ONLY",
    subject: "DOCTORS",
    predicate: "SURGEONS",
  });
  assert.deepEqual(
    normalized.canonicalConstraints.map((entry) =>
      entry.kind === "EXISTS" || entry.kind === "EMPTY"
        ? `${entry.kind}:${entry.term}`
        : `${entry.kind}:${entry.subject}:${entry.predicate}`,
    ),
    ["ALL:SURGEONS:DOCTORS", "EXISTS:SURGEONS"],
  );

  const { result } = evaluate(
    [{ premiseId: "ONLY-1", form: "ONLY", subject: "DOCTORS", predicate: "SURGEONS" }],
    conclusion("C1", "ALL", "DOCTORS", "SURGEONS"),
  );
  assert.equal(result.classification, "UNDETERMINED");
}

{
  const premises: readonly SurfacePremise[] = [
    { premiseId: "P1", form: "ONLY_A_FEW", subject: "A", predicate: "B" },
  ];
  assert.equal(evaluate(premises, conclusion("C1", "SOME", "A", "B")).result.classification, "ENTAILED");
  assert.equal(evaluate(premises, conclusion("C2", "SOME_NOT", "A", "B")).result.classification, "ENTAILED");
  assert.equal(evaluate(premises, conclusion("C3", "ALL", "A", "B")).result.classification, "CONTRADICTED");
}

{
  const constraints = normalizePremises([
    { premiseId: "P1", form: "ALL", subject: "A", predicate: "B" },
    { premiseId: "P2", form: "NO", subject: "A", predicate: "B" },
  ]);
  const terms = collectTerms(constraints);
  assert.equal(solveConstraintSatisfiability(constraints, terms).satisfiable, false);
}

{
  const constraints = normalizePremises([
    { premiseId: "P1", form: "SOME", subject: "A", predicate: "B" },
    { premiseId: "P2", form: "SOME_NOT", subject: "A", predicate: "B" },
  ]);
  const terms = collectTerms(constraints);
  const solved = solveConstraintSatisfiability(constraints, terms);
  assert.equal(solved.satisfiable, true);
  if (!solved.model) throw new Error("Expected a satisfiable witness model.");
  assert.equal(solved.model.occupiedRegions.length, 2, "Independent existential witnesses must remain separable.");
  assert.equal(modelSatisfiesConstraints(solved.model, constraints), true);
}

{
  const { result } = evaluate(
    [
      { premiseId: "P1", form: "ALL", subject: "A", predicate: "B" },
      { premiseId: "P2", form: "SOME", subject: "C", predicate: "A" },
    ],
    conclusion("C1", "SOME", "C", "B"),
  );
  assert.equal(result.classification, "ENTAILED");
}

{
  const normalized = normalizePremises([]);
  const candidate = conclusion("C1", "SOME", "A", "B");
  const terms = collectTerms(normalized, [candidate]);
  const result = classifyConclusionPrimary(normalized, candidate, terms);
  assert.equal(result.classification, "UNDETERMINED");
}

{
  assert.throws(
    () => normalizePremise({ premiseId: "P1", form: "FEW", subject: "A", predicate: "B" }),
    /source-profile governed/,
  );
}

{
  const { result } = evaluate(
    [{ premiseId: "P1", form: "IDENTITY", subject: "A", predicate: "B" }],
    conclusion("C1", "ALL", "B", "A"),
  );
  assert.equal(result.classification, "ENTAILED");
}

console.log("SYL-001 foundation adversarial proof passed.");
