export type ConjunctionRuleId =
  | "GR-CON-001"
  | "GR-CON-002"
  | "GR-CON-003"
  | "GR-CON-004"
  | "GR-CON-005"
  | "GR-CON-006"
  | "GR-CON-007"
  | "GR-CON-008"
  | "GR-CON-009"
  | "GR-CON-010";

export type ConjunctionMutationId =
  | "MUT-CON-COORDINATOR-001"
  | "MUT-CON-BOTH-AND-001"
  | "MUT-CON-EITHER-OR-001"
  | "MUT-CON-NEITHER-NOR-001"
  | "MUT-CON-NOT-ONLY-BUT-ALSO-001"
  | "MUT-CON-ALTHOUGH-BUT-001"
  | "MUT-CON-BECAUSE-BECAUSE-OF-001"
  | "MUT-CON-DESPITE-ALTHOUGH-001"
  | "MUT-CON-PARALLEL-LIST-001"
  | "MUT-CON-PARALLEL-CORRELATIVE-001";

export interface ConjunctionRuleV1 {
  ruleId: ConjunctionRuleId;
  name: string;
  principle: string;
  mutationId: ConjunctionMutationId;
  ambiguityGuard: string;
}

export const CONJUNCTION_RULES_V1: readonly ConjunctionRuleV1[] = [
  {
    ruleId: "GR-CON-001",
    name: "Choose the coordinating conjunction that matches the relation",
    principle: "Use a coordinating conjunction that matches the meaning between the two clauses, such as but or yet for contrast and so for result.",
    mutationId: "MUT-CON-COORDINATOR-001",
    ambiguityGuard: "The two clauses must make the intended contrast, addition, alternative, or result unmistakable from context.",
  },
  {
    ruleId: "GR-CON-002",
    name: "Both ... and",
    principle: "Use both with and to join two parallel words, phrases, or clauses.",
    mutationId: "MUT-CON-BOTH-AND-001",
    ambiguityGuard: "The paired elements must be grammatically parallel and the error must concern the correlative pair, not agreement.",
  },
  {
    ruleId: "GR-CON-003",
    name: "Either ... or",
    principle: "Use either with or when presenting two alternatives.",
    mutationId: "MUT-CON-EITHER-OR-001",
    ambiguityGuard: "Do not test subject-verb agreement after either/or; that remains CP001 ownership.",
  },
  {
    ruleId: "GR-CON-004",
    name: "Neither ... nor",
    principle: "Use neither with nor when rejecting both alternatives.",
    mutationId: "MUT-CON-NEITHER-NOR-001",
    ambiguityGuard: "Do not test proximity agreement; the keyed defect is only the correlative conjunction pair.",
  },
  {
    ruleId: "GR-CON-005",
    name: "Not only ... but also",
    principle: "Use not only with but also, keeping the joined elements in parallel grammatical form.",
    mutationId: "MUT-CON-NOT-ONLY-BUT-ALSO-001",
    ambiguityGuard: "The sentence must not depend on optional stylistic inversion; the defect is in pairing or parallel structure.",
  },
  {
    ruleId: "GR-CON-006",
    name: "Although / though without but",
    principle: "Do not normally use but in the same clause pair after although or though; the subordinating conjunction already marks contrast.",
    mutationId: "MUT-CON-ALTHOUGH-BUT-001",
    ambiguityGuard: "Use standard exam grammar and avoid discourse uses where but starts a new independent sentence.",
  },
  {
    ruleId: "GR-CON-007",
    name: "Because vs because of",
    principle: "Use because before a clause and because of before a noun phrase or gerund phrase.",
    mutationId: "MUT-CON-BECAUSE-BECAUSE-OF-001",
    ambiguityGuard: "The complement must clearly be either a finite clause or a noun phrase so the choice is unambiguous.",
  },
  {
    ruleId: "GR-CON-008",
    name: "Despite / in spite of vs although",
    principle: "Use despite or in spite of before a noun phrase or gerund phrase, and although before a finite clause.",
    mutationId: "MUT-CON-DESPITE-ALTHOUGH-001",
    ambiguityGuard: "Avoid compressed or elliptical clauses that could license more than one analysis.",
  },
  {
    ruleId: "GR-CON-009",
    name: "Parallel structure in coordinated lists",
    principle: "Items joined in a list should follow the same grammatical pattern, such as all gerunds, all infinitives, or all noun phrases.",
    mutationId: "MUT-CON-PARALLEL-LIST-001",
    ambiguityGuard: "The list must contain three clearly comparable items and only one item may break the pattern.",
  },
  {
    ruleId: "GR-CON-010",
    name: "Parallel structure after correlative conjunctions",
    principle: "The elements following each half of a correlative pair should have matching grammatical form.",
    mutationId: "MUT-CON-PARALLEL-CORRELATIVE-001",
    ambiguityGuard: "The keyed defect must be structural parallelism, not a vocabulary preference or agreement issue.",
  },
] as const;

export const CONJUNCTION_RULE_BY_ID: Readonly<Record<ConjunctionRuleId, ConjunctionRuleV1>> = Object.freeze(
  Object.fromEntries(CONJUNCTION_RULES_V1.map((rule) => [rule.ruleId, rule])) as Record<ConjunctionRuleId, ConjunctionRuleV1>,
);
