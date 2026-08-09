export type ConstraintVerdict = "SATISFIED" | "VIOLATED" | "UNDECIDED";

export interface FiniteConstraint<TState> {
  readonly id: string;
  readonly family: string;
  evaluate(state: TState): ConstraintVerdict;
}

export interface ProofEvent {
  readonly id: string;
  readonly sourceConstraintIds: readonly string[];
  readonly inferenceKind:
    | "SYMMETRY_ANCHOR"
    | "DIRECT_PLACEMENT"
    | "FACING_RESOLUTION"
    | "BLOCK_FORMATION"
    | "RELATIVE_PLACEMENT"
    | "DOMAIN_REDUCTION"
    | "CHAIN_COMBINATION"
    | "ONLY_REMAINING_SEAT";
  readonly affectedEntities: readonly string[];
  readonly beforeDomains: Readonly<Record<string, readonly string[]>>;
  readonly afterDomains: Readonly<Record<string, readonly string[]>>;
}

export interface EnumerationResult<TModel> {
  readonly models: readonly TModel[];
  readonly truncated: boolean;
  readonly exploredNodes: number;
}
