export type AnaCp009ConditionalSourceVerdict =
  | "NO_CONDITIONAL_ANALOGY_EVIDENCE"
  | "DELEGATE_CODING_DECODING"
  | "DELEGATE_SYMBOLIC_OPERATIONS"
  | "DESIGN_LABEL_ONLY";

export interface AnaCp009ConditionalSourceFinding {
  findingId: string;
  sourceClass: "UPLOADED_BOOK" | "EXAM_PREP_SOURCE" | "LEGACY_DESIGN";
  sourceLabel: string;
  observedScope: string;
  verdict: AnaCp009ConditionalSourceVerdict;
  notes: string;
  permanentQlIds: readonly [];
}

export const ANA_CP009_CONDITIONAL_SOURCE_FINDINGS: readonly AnaCp009ConditionalSourceFinding[] = [
  {
    findingId: "ANA-CP009-CB-SF-001",
    sourceClass: "UPLOADED_BOOK",
    sourceLabel: "Radian Reasoning for Competitions — Analogy chapter",
    observedScope: "Word, number, alphabet and figure analogy families use one relation transferred from source to target.",
    verdict: "NO_CONDITIONAL_ANALOGY_EVIDENCE",
    notes: "The analogy chapter supplies ordinary relation-transfer examples and exercises, but no recurring prompt in which an explicit visible predicate chooses between two pair-local analogy rules.",
    permanentQlIds: [],
  },
  {
    findingId: "ANA-CP009-CB-SF-002",
    sourceClass: "UPLOADED_BOOK",
    sourceLabel: "Radian Reasoning for Competitions — Conditional Coding section",
    observedScope: "Conditions select codes or transformations in Coding-Decoding tasks.",
    verdict: "DELEGATE_CODING_DECODING",
    notes: "Conditional instructions are source-backed in Coding-Decoding, where the student applies stated coding conditions. That task is not analogy rule transfer and must not be imported into CP-009.",
    permanentQlIds: [],
  },
  {
    findingId: "ANA-CP009-CB-SF-003",
    sourceClass: "EXAM_PREP_SOURCE",
    sourceLabel: "Oliveboard railway and SSC analogy practice inventories reviewed July 2026",
    observedScope: "Current practice inventories cover word, number, letter, mixed and figure analogy through stable source-target relations.",
    verdict: "NO_CONDITIONAL_ANALOGY_EVIDENCE",
    notes: "The reviewed analogy inventories provide fixed sum, product, position, shift and semantic relations. They do not establish a recurring conditional branch that derives which relation applies to each pair.",
    permanentQlIds: [],
  },
  {
    findingId: "ANA-CP009-CB-SF-004",
    sourceClass: "EXAM_PREP_SOURCE",
    sourceLabel: "Oliveboard symbolic-operation and coding-decoding guidance reviewed July 2026",
    observedScope: "Explicit symbol meanings and conditions govern equation evaluation or coding tasks.",
    verdict: "DELEGATE_SYMBOLIC_OPERATIONS",
    notes: "Where a condition chooses an arithmetic symbol or code, the tested skill is symbolic operation or coding-decoding. It is not evidence for an advanced analogy authority.",
    permanentQlIds: [],
  },
  {
    findingId: "ANA-CP009-CB-SF-005",
    sourceClass: "LEGACY_DESIGN",
    sourceLabel: "Original ANA-001 ADV_CONDITIONAL_BRANCH placeholder",
    observedScope: "A generic direct-completion and pair-selection family name with no attached exam fixture or branch grammar.",
    verdict: "DESIGN_LABEL_ONLY",
    notes: "The historical label is a design hypothesis, not source evidence. It cannot receive shifted QL IDs until a recurring exam pattern and a uniquely solvable formal contract are established.",
    permanentQlIds: [],
  },
] as const;

export const ANA_CP009_CONDITIONAL_ADMISSION_REQUIREMENTS = [
  "At least two independent readable exam fixtures must show the same branch grammar.",
  "The branch predicate must be visible in the question rather than inferred from answer options alone.",
  "The predicate must select from a bounded whitelist of named pair-local rules.",
  "Every displayed source pair must identify the same predicate and branch semantics.",
  "An independent solver must derive both the selected branch and the resulting answer.",
  "The complete earlier-checkpoint rule pool must reject an equal-or-simpler non-branch explanation.",
  "Four-option construction must remain single-correct without relying on undocumented conditions.",
  "The task must remain analogy; coding, symbol substitution, series and data-sufficiency framings are delegated.",
  "English, Hindi and Punjabi instructions must preserve the predicate and branch meaning exactly.",
  "No QL count or IDs may be assigned before all admission requirements pass together.",
] as const;

export const ANA_CP009_CONDITIONAL_BRANCH_STATUS = {
  candidateFamily: "ADV_CONDITIONAL_BRANCH",
  status: "SOURCE_GAP" as const,
  recurringFixturesFound: 0,
  formalRuleContractsAdmitted: 0,
  permanentQlIds: [] as const,
  publiclyPublishable: false as const,
};
