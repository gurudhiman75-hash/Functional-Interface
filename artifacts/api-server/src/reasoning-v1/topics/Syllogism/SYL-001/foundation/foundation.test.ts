import { collectTerms, normalizePremise, normalizePremises } from "./normalization";
import { classifyConclusionPrimary, solveConstraintSatisfiability } from "./primary-solver";
import { modelSatisfiesConstraints } from "./region-model";
import { verifySolverAgreement } from "./solver-agreement";
import type { CanonicalConclusion, SurfacePremise } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
  }
}

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
  assert(agreement.agreed, `Solver disagreement for ${candidate.conclusionId}`);
  return { normalized, terms, result: agreement.primary };
}

equal(
  evaluate(
    [{ premiseId: "P1", form: "ALL", subject: "A", predicate: "B" }],
    conclusion("C1", "SOME", "A", "B"),
  ).result.classification,
  "ENTAILED",
  "A subalternation",
);

equal(
  evaluate(
    [{ premiseId: "P1", form: "ALL", subject: "A", predicate: "B" }],
    conclusion("C1", "ALL", "B", "A"),
  ).result.classification,
  "UNDETERMINED",
  "All conversion",
);

equal(
  evaluate(
    [{ premiseId: "P1", form: "NO", subject: "A", predicate: "B" }],
    conclusion("C1", "SOME_NOT", "A", "B"),
  ).result.classification,
  "ENTAILED",
  "E subject subalternation",
);

equal(
  evaluate(
    [{ premiseId: "P1", form: "NO", subject: "A", predicate: "B" }],
    conclusion("C1", "SOME_NOT", "B", "A"),
  ).result.classification,
  "ENTAILED",
  "E conversion plus subalternation",
);

equal(
  evaluate(
    [{ premiseId: "P1", form: "NO", subject: "A", predicate: "B" }],
    conclusion("C1", "NO", "B", "A"),
  ).result.classification,
  "ENTAILED",
  "E conversion",
);

const only = normalizePremise({
  premiseId: "ONLY-1",
  form: "ONLY",
  subject: "DOCTORS",
  predicate: "SURGEONS",
});
assert(
  only.canonicalConstraints.some(
    (entry) => entry.kind === "ALL"
      && entry.subject === "SURGEONS"
      && entry.predicate === "DOCTORS",
  ),
  "Only direction reversed incorrectly",
);
equal(
  evaluate(
    [{ premiseId: "ONLY-1", form: "ONLY", subject: "DOCTORS", predicate: "SURGEONS" }],
    conclusion("C1", "ALL", "DOCTORS", "SURGEONS"),
  ).result.classification,
  "UNDETERMINED",
  "Only treated as identity",
);

const onlyFew: readonly SurfacePremise[] = [
  { premiseId: "P1", form: "ONLY_A_FEW", subject: "A", predicate: "B" },
];
equal(
  evaluate(onlyFew, conclusion("C1", "SOME", "A", "B")).result.classification,
  "ENTAILED",
  "Only few overlap",
);
equal(
  evaluate(onlyFew, conclusion("C2", "SOME_NOT", "A", "B")).result.classification,
  "ENTAILED",
  "Only few outside witness",
);
equal(
  evaluate(onlyFew, conclusion("C3", "ALL", "A", "B")).result.classification,
  "CONTRADICTED",
  "Only few all contradiction",
);
equal(
  evaluate(
    [{ premiseId: "P1", form: "NOT_ALL", subject: "A", predicate: "B" }],
    conclusion("C4", "SOME_NOT", "A", "B"),
  ).result.classification,
  "ENTAILED",
  "Not-all normalization",
);

const inconsistent = normalizePremises([
  { premiseId: "P1", form: "ALL", subject: "A", predicate: "B" },
  { premiseId: "P2", form: "NO", subject: "A", predicate: "B" },
]);
equal(
  solveConstraintSatisfiability(inconsistent, collectTerms(inconsistent)).satisfiable,
  false,
  "Inconsistent chain",
);

const separate = normalizePremises([
  { premiseId: "P1", form: "SOME", subject: "A", predicate: "B" },
  { premiseId: "P2", form: "SOME_NOT", subject: "A", predicate: "B" },
]);
const solved = solveConstraintSatisfiability(separate, collectTerms(separate));
assert(solved.satisfiable && solved.model !== null, "Expected witness model");
equal(solved.model.occupiedRegions.length, 2, "Independent witnesses merged");
assert(modelSatisfiesConstraints(solved.model, separate), "Invalid witness model");

equal(
  evaluate(
    [
      { premiseId: "P1", form: "ALL", subject: "A", predicate: "B" },
      { premiseId: "P2", form: "SOME", subject: "C", predicate: "A" },
    ],
    conclusion("C1", "SOME", "C", "B"),
  ).result.classification,
  "ENTAILED",
  "Transitive existential conclusion",
);

equal(
  classifyConclusionPrimary(
    [],
    conclusion("C1", "SOME", "A", "B"),
    ["A", "B"],
  ).classification,
  "UNDETERMINED",
  "Unconstrained possibility",
);

let fewRejected = false;
try {
  normalizePremise({ premiseId: "P1", form: "FEW", subject: "A", predicate: "B" });
} catch {
  fewRejected = true;
}
assert(fewRejected, "Plain FEW must remain rejected");

equal(
  evaluate(
    [{ premiseId: "P1", form: "IDENTITY", subject: "A", predicate: "B" }],
    conclusion("C1", "ALL", "B", "A"),
  ).result.classification,
  "ENTAILED",
  "Identity",
);

console.log("SYL-001 foundation adversarial proof passed.");
