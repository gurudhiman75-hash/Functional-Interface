import type { QuadraticSurd, Rational } from "../../../../../../shared/algebra";

export type AlgebraRuntimePackageId = "ALG-001" | "ALG-002";

export type AlgebraCheckpointId =
  | "ALG-CP-001"
  | "ALG-CP-002"
  | "ALG-CP-003"
  | "ALG-CP-004"
  | "ALG-CP-005"
  | "ALG-CP-006"
  | "ALG-CP-007"
  | "ALG-CP-008"
  | "ALG-CP-009"
  | "ALG-CP-010"
  | "ALG-CP-011"
  | "ALG-CP-012"
  | "ALG-CP-013"
  | "ALG-CP-014"
  | "ALG-CP-015";

export type AlgebraDomain =
  | "INTEGER"
  | "RATIONAL"
  | "REAL"
  | "POSITIVE_REAL"
  | "NONZERO_REAL"
  | "BOUNDED_INTEGER";

export type AlgebraAnswer =
  | { kind: "INTEGER"; value: bigint }
  | { kind: "RATIONAL"; value: Rational }
  | { kind: "QUADRATIC_SURD"; value: QuadraticSurd }
  | { kind: "ROOT_SET"; values: Array<Rational | QuadraticSurd> }
  | { kind: "ORDERED_PAIR"; x: Rational; y: Rational }
  | { kind: "BOOLEAN"; value: boolean }
  | { kind: "TEXT_CLASS"; value: string };

export interface AlgebraQuestionProvenance {
  designVersion: string;
  generatorVersion: string;
  seed: string;
  sourceFamilyIds: string[];
}

export interface AlgebraQuestionState {
  chapter: "Algebra";
  runtimePackageId: AlgebraRuntimePackageId;
  cpId: AlgebraCheckpointId;
  qlId: string;
  solveMode: string;
  domain: AlgebraDomain;
  restrictions: string[];
  canonicalAnswer: AlgebraAnswer;
  canonicalMethod: string;
  independentVerificationMethod: string;
  misconceptionIds: string[];
  provenance: AlgebraQuestionProvenance;
}

export const ALGEBRA_CHECKPOINT_PACKAGE: Record<AlgebraCheckpointId, AlgebraRuntimePackageId> = {
  "ALG-CP-001": "ALG-001",
  "ALG-CP-002": "ALG-001",
  "ALG-CP-003": "ALG-001",
  "ALG-CP-004": "ALG-001",
  "ALG-CP-005": "ALG-001",
  "ALG-CP-006": "ALG-002",
  "ALG-CP-007": "ALG-002",
  "ALG-CP-008": "ALG-002",
  "ALG-CP-009": "ALG-002",
  "ALG-CP-010": "ALG-002",
  "ALG-CP-011": "ALG-002",
  "ALG-CP-012": "ALG-002",
  "ALG-CP-013": "ALG-002",
  "ALG-CP-014": "ALG-002",
  "ALG-CP-015": "ALG-002",
};
