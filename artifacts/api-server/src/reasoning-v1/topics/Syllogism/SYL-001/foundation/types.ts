export type SylLocale = "en-IN" | "hi-IN" | "pa-IN";
export type SylDifficulty = "EASY" | "MEDIUM" | "HARD";
export type TermId = string;

export type CanonicalCategoricalForm = "ALL" | "NO" | "SOME" | "SOME_NOT";

export type SurfacePremiseForm =
  | CanonicalCategoricalForm
  | "ONLY"
  | "ARE_ONLY"
  | "A_FEW"
  | "FEW"
  | "ONLY_A_FEW"
  | "NOT_ALL"
  | "IDENTITY";

export interface SurfacePremise {
  premiseId: string;
  form: SurfacePremiseForm;
  subject: TermId;
  predicate: TermId;
}

export interface CanonicalConclusion {
  conclusionId: string;
  form: CanonicalCategoricalForm;
  subject: TermId;
  predicate: TermId;
}

export type PrimitiveConstraint =
  | { kind: "ALL"; subject: TermId; predicate: TermId; originId?: string }
  | { kind: "NO"; subject: TermId; predicate: TermId; originId?: string }
  | { kind: "SOME"; subject: TermId; predicate: TermId; originId?: string }
  | { kind: "SOME_NOT"; subject: TermId; predicate: TermId; originId?: string }
  | { kind: "EXISTS"; term: TermId; originId?: string }
  | { kind: "EMPTY"; term: TermId; originId?: string };

export interface NormalizedPremise {
  premiseId: string;
  surfaceForm: SurfacePremiseForm;
  canonicalConstraints: readonly PrimitiveConstraint[];
}

export interface RegionAssignment {
  mask: number;
  memberTerms: readonly TermId[];
}

export interface CanonicalModel {
  termOrder: readonly TermId[];
  occupiedRegions: readonly RegionAssignment[];
}

export interface SatisfiabilityResult {
  satisfiable: boolean;
  model: CanonicalModel | null;
  reason?: string;
}

export type InternalConclusionClass =
  | "ENTAILED"
  | "CONTRADICTED"
  | "UNDETERMINED";

export interface ConclusionTruthProfile {
  canBeTrue: boolean;
  canBeFalse: boolean;
  classification: InternalConclusionClass;
  witnessModel: CanonicalModel | null;
  counterModel: CanonicalModel | null;
}

export interface SolverAgreementResult {
  agreed: boolean;
  primary: ConclusionTruthProfile;
  independent: ConclusionTruthProfile;
}
