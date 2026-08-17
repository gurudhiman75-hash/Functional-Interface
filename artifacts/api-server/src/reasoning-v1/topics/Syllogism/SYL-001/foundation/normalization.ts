import { SYL_001_SEMANTICS_PROFILE } from "./semantics-profile";
import type {
  CanonicalConclusion,
  NormalizedPremise,
  PrimitiveConstraint,
  SurfacePremise,
  TermId,
} from "./types";

function assertTerm(term: TermId, field: string): void {
  if (term.trim().length === 0) throw new Error(`${field} must be a non-empty term ID.`);
}

function withOrigin(
  constraint: PrimitiveConstraint,
  originId: string,
): PrimitiveConstraint {
  return { ...constraint, originId };
}

export function normalizePremise(premise: SurfacePremise): NormalizedPremise {
  assertTerm(premise.subject, "subject");
  assertTerm(premise.predicate, "predicate");
  if (premise.subject === premise.predicate && premise.form !== "IDENTITY") {
    throw new Error(`Premise ${premise.premiseId} uses the same subject and predicate.`);
  }

  const originId = premise.premiseId;
  let canonicalConstraints: readonly PrimitiveConstraint[];

  switch (premise.form) {
    case "ALL":
      canonicalConstraints = [
        withOrigin({ kind: "ALL", subject: premise.subject, predicate: premise.predicate }, originId),
        withOrigin({ kind: "EXISTS", term: premise.subject }, originId),
      ];
      break;
    case "NO":
      canonicalConstraints = [
        withOrigin({ kind: "NO", subject: premise.subject, predicate: premise.predicate }, originId),
        withOrigin({ kind: "EXISTS", term: premise.subject }, originId),
        withOrigin({ kind: "EXISTS", term: premise.predicate }, originId),
      ];
      break;
    case "SOME":
    case "A_FEW":
      canonicalConstraints = [
        withOrigin({ kind: "SOME", subject: premise.subject, predicate: premise.predicate }, originId),
      ];
      break;
    case "SOME_NOT":
    case "NOT_ALL":
      canonicalConstraints = [
        withOrigin({ kind: "SOME_NOT", subject: premise.subject, predicate: premise.predicate }, originId),
      ];
      break;
    case "ONLY":
      canonicalConstraints = [
        withOrigin({ kind: "ALL", subject: premise.predicate, predicate: premise.subject }, originId),
        withOrigin({ kind: "EXISTS", term: premise.predicate }, originId),
      ];
      break;
    case "ARE_ONLY":
      canonicalConstraints = [
        withOrigin({ kind: "ALL", subject: premise.subject, predicate: premise.predicate }, originId),
        withOrigin({ kind: "EXISTS", term: premise.subject }, originId),
      ];
      break;
    case "ONLY_A_FEW":
      canonicalConstraints = [
        withOrigin({ kind: "SOME", subject: premise.subject, predicate: premise.predicate }, originId),
        withOrigin({ kind: "SOME_NOT", subject: premise.subject, predicate: premise.predicate }, originId),
      ];
      break;
    case "IDENTITY":
      canonicalConstraints = [
        withOrigin({ kind: "ALL", subject: premise.subject, predicate: premise.predicate }, originId),
        withOrigin({ kind: "ALL", subject: premise.predicate, predicate: premise.subject }, originId),
        withOrigin({ kind: "EXISTS", term: premise.subject }, originId),
        withOrigin({ kind: "EXISTS", term: premise.predicate }, originId),
      ];
      break;
    case "FEW":
      if (SYL_001_SEMANTICS_PROFILE.fewNormalization === "SOURCE_PROFILE_REQUIRED") {
        throw new Error(
          `Premise ${premise.premiseId} uses FEW, whose semantics remain source-profile governed.`,
        );
      }
      canonicalConstraints = [];
      break;
    default: {
      const exhaustive: never = premise.form;
      throw new Error(`Unsupported premise form: ${String(exhaustive)}.`);
    }
  }

  return {
    premiseId: premise.premiseId,
    surfaceForm: premise.form,
    canonicalConstraints,
  };
}

export function normalizePremises(
  premises: readonly SurfacePremise[],
): readonly PrimitiveConstraint[] {
  const premiseIds = new Set<string>();
  const normalized: PrimitiveConstraint[] = [];
  for (const premise of premises) {
    if (premiseIds.has(premise.premiseId)) {
      throw new Error(`Duplicate premise ID: ${premise.premiseId}.`);
    }
    premiseIds.add(premise.premiseId);
    normalized.push(...normalizePremise(premise).canonicalConstraints);
  }
  return normalized;
}

export function collectTerms(
  constraints: readonly PrimitiveConstraint[],
  conclusions: readonly CanonicalConclusion[] = [],
): readonly TermId[] {
  const terms = new Set<TermId>();
  for (const constraint of constraints) {
    if (constraint.kind === "EXISTS" || constraint.kind === "EMPTY") {
      terms.add(constraint.term);
    } else {
      terms.add(constraint.subject);
      terms.add(constraint.predicate);
    }
  }
  for (const conclusion of conclusions) {
    terms.add(conclusion.subject);
    terms.add(conclusion.predicate);
  }
  return [...terms].sort();
}
