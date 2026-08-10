import { buildBlrCp005Telemetry, generateBlrCp005FrozenBank } from "./cp005-bank";
import {
  BLR_CP005_APPROVAL_DATE,
  BLR_CP005_FREEZE_VERSION,
  BLR_CP005_OWNER_DIRECTIVE,
  BLR_CP005_PERMANENT_CONTRACTS,
  BLR_CP005_RUNTIME_VERSION,
  type BlrCp005Authority,
  type BlrCp005PrototypeId,
  type BlrCp005QlId,
} from "./cp005-model";
import { BLR_CP005_PROTOTYPE_CASES } from "./cp005-scenarios";

export interface BlrCp005SourceAuditEntry {
  sourceFamily: string;
  evidence: string;
  cp005Decision: string;
}

export const BLR_CP005_SOURCE_AUDIT: readonly BlrCp005SourceAuditEntry[] = [
  {
    sourceFamily: "Incomplete family-set relation questions",
    evidence: "Competitive-exam sources use missing spouse, gender and lineage facts to produce one-of-two or cannot-be-determined answers.",
    cp005Decision: "Retain only when the complete bounded model space is explicitly constructed and exhausted.",
  },
  {
    sourceFamily: "Pointer and photograph uncertainty",
    evidence: "A pointer statement can admit structurally different routes such as mother versus mother-in-law.",
    cp005Decision: "Presentation remains a CP-002 instance property; uncertainty semantics and model proof belong to CP-005.",
  },
  {
    sourceFamily: "Definite, possible and impossible relation claims",
    evidence: "Sources ask which claim must follow, can follow or cannot follow from incomplete family information.",
    cp005Decision: "Merge claim polarities into one model-status authority parameterized by the requested truth class.",
  },
  {
    sourceFamily: "Possible person and uncertain identity",
    evidence: "Several named people may remain eligible for a role, or one candidate may be possible/definite/impossible.",
    cp005Decision: "Separate one-person status selection from set/indeterminate identity answers because the answer contracts differ.",
  },
  {
    sourceFamily: "Minimum, maximum, possible and indeterminate counts",
    evidence: "Incomplete family composition can bound a count without fixing one exact value.",
    cp005Decision: "Use the same explicit count universe as CP-004 but enumerate every admissible completed family model.",
  },
] as const;

export interface BlrCp005AuthorityDecision {
  qlId: BlrCp005QlId;
  authority: BlrCp005Authority;
  decision: string;
}

export const BLR_CP005_AUTHORITY_DECISIONS: readonly BlrCp005AuthorityDecision[] = [
  {
    qlId: "BLR-QL-018",
    authority: "RESOLVE_INVARIANT_RELATION",
    decision: "Exact, gender-neutral, broad-lineage and alternative-route relations merge because all ask for the single relation invariant across every model.",
  },
  {
    qlId: "BLR-QL-019",
    authority: "RESOLVE_RELATION_UNCERTAINTY",
    decision: "One-of-two and materially indeterminate relation answers share model-outcome enumeration but remain separate from invariant scalar relations.",
  },
  {
    qlId: "BLR-QL-020",
    authority: "SELECT_CLAIM_BY_MODEL_STATUS",
    decision: "Definite, possible and impossible claim selection are one solve contract with requested status as an instance parameter.",
  },
  {
    qlId: "BLR-QL-021",
    authority: "IDENTIFY_PERSON_BY_MODEL_STATUS",
    decision: "Candidate-person classification is separate from claim text because option identity and explanation ownership are person-based.",
  },
  {
    qlId: "BLR-QL-022",
    authority: "RESOLVE_PERSON_IDENTITY_UNCERTAINTY",
    decision: "A formal person set or indeterminate identity requires a different answer contract from selecting one possible/definite/impossible person.",
  },
  {
    qlId: "BLR-QL-023",
    authority: "DETERMINE_COUNT_BOUND",
    decision: "Minimum and maximum counts merge as opposite boundary parameters over the same attainable count set.",
  },
  {
    qlId: "BLR-QL-024",
    authority: "SELECT_COUNT_BY_MODEL_STATUS",
    decision: "Possible and impossible count selection merge as truth-status parameters over a fixed count universe.",
  },
  {
    qlId: "BLR-QL-025",
    authority: "RESOLVE_COUNT_DETERMINACY",
    decision: "Exact invariant count and cannot-determine count share the same all-model agreement test and one number-or-indeterminate answer contract.",
  },
] as const;

export const BLR_CP005_BOUNDARY_AUDIT = [
  "Fully determined direct, pointer and shared-passage relations remain owned by BLR-QL-001..012.",
  "Definite closed-world counts remain owned by BLR-QL-013..017.",
  "CP-005 owns model-space semantics, not a new prose renderer; pointer/photo/shared-passage forms remain instance properties.",
  "Data Sufficiency wrappers remain excluded even when the underlying relation is uncertain.",
  "Profession, city, colour, floor, schedule and seating attributes remain outside Blood Relations.",
  "Coded relations and coded-expression uncertainty remain deferred to CP-006 and CP-007.",
  "No random or sampled family completion is admissible: every retained variable domain is exhaustively enumerated.",
] as const;

export const BLR_CP005_INVERSE_AND_EDGE_AUDIT = [
  "subject/reference direction is explicit for every relation predicate",
  "male/female variants collapse to a gender-neutral relation only when both models support the same structural family",
  "maternal/paternal variants collapse to a broad relation only when both sides are valid",
  "one-of-two is retained only when exactly two complete outcomes survive",
  "cannot be determined requires at least three material relation/person outcomes or at least two count outcomes",
  "definite/possible/impossible options are independently classified in every valid model",
  "minimum and maximum are read from the full attainable count set",
  "zero or unattainable count options are tested rather than assumed",
  "irrelevant uncertainty is included to prove that a separate fact can remain definite",
  "all model diagrams preserve the same displayed names and vary only the declared open variables",
] as const;

export const BLR_CP005_PROTOTYPE_OWNERSHIP: Readonly<Record<BlrCp005PrototypeId, BlrCp005QlId>> = Object.fromEntries(
  BLR_CP005_PERMANENT_CONTRACTS.flatMap((contract) =>
    contract.sourcePrototypeIds.map((prototypeId) => [prototypeId, contract.qlId] as const),
  ),
) as Readonly<Record<BlrCp005PrototypeId, BlrCp005QlId>>;

export function buildBlrCp005FinalFreeze() {
  const bank = generateBlrCp005FrozenBank();
  const telemetry = buildBlrCp005Telemetry(bank);
  return {
    packageId: "BLR-001" as const,
    checkpointId: "BLR-CP-005" as const,
    title: "Determinacy, Possibility and Uncertainty" as const,
    runtimeVersion: BLR_CP005_RUNTIME_VERSION,
    freezeVersion: BLR_CP005_FREEZE_VERSION,
    approvalDate: BLR_CP005_APPROVAL_DATE,
    ownerDirective: BLR_CP005_OWNER_DIRECTIVE,
    structuralSaturationApproved: true as const,
    finalDiscoveryFreezeApproved: true as const,
    completeBoundedEnumerationRequired: true as const,
    permanentQlRange: "BLR-QL-018..BLR-QL-025" as const,
    nextAvailableChapterQlId: "BLR-QL-026" as const,
    sourceAudit: BLR_CP005_SOURCE_AUDIT,
    authorityDecisions: BLR_CP005_AUTHORITY_DECISIONS,
    boundaryAudit: BLR_CP005_BOUNDARY_AUDIT,
    inverseAndEdgeAudit: BLR_CP005_INVERSE_AND_EDGE_AUDIT,
    prototypeIds: BLR_CP005_PROTOTYPE_CASES.map((entry) => entry.prototypeId),
    contracts: BLR_CP005_PERMANENT_CONTRACTS,
    telemetry,
    releaseBoundary: {
      englishReviewOnly: true as const,
      questionStudio: "DISABLED" as const,
      questionBank: "DISABLED" as const,
      mockTests: "DISABLED" as const,
      hindiPunjabi: "NOT_STARTED" as const,
      publicPublication: "DISABLED" as const,
      productionStaging: "DISABLED" as const,
      merge: "NOT_AUTHORISED" as const,
    },
  };
}

export const BLR_CP005_FINAL_FREEZE_MARKDOWN = `# BLR-CP-005 — Final English Discovery Freeze

Status: **structurally saturated and frozen for English review runtime only**.

## Scope

BLR-CP-005 formalizes incomplete family information through complete bounded model enumeration. A fact is definite only when true in every valid model, possible when true in some but not all models, and impossible when true in none.

## Frozen inventory

\`\`\`text
approved English review questions          184
shared model-space groups                    80
source scenarios                             10
model-space topologies                       10
source prototypes                            23
frozen solve authorities                      8
permanent QLs                                 8
enumerated model instances                  432
full learner-item signatures unique     184 / 184
\`\`\`

Prototype and question counts were discovered through source, boundary, inverse, edge and overlap audits. They were not established as quotas.

## Permanent allocation

\`\`\`text
BLR-QL-018  RESOLVE_INVARIANT_RELATION
BLR-QL-019  RESOLVE_RELATION_UNCERTAINTY
BLR-QL-020  SELECT_CLAIM_BY_MODEL_STATUS
BLR-QL-021  IDENTIFY_PERSON_BY_MODEL_STATUS
BLR-QL-022  RESOLVE_PERSON_IDENTITY_UNCERTAINTY
BLR-QL-023  DETERMINE_COUNT_BOUND
BLR-QL-024  SELECT_COUNT_BY_MODEL_STATUS
BLR-QL-025  RESOLVE_COUNT_DETERMINACY
\`\`\`

Next available chapter identity: \`BLR-QL-026\`.

## Model-space proof

Every question contains two or three valid completed family models. The runtime exhaustively enumerates the declared finite variable domains, rejects invalid or duplicate graphs, solves each model, classifies every offered claim/person/count and constructs the answer only after the complete model set is known.

An independent verifier reconstructs all 432 family graphs from the exported model diagrams and recomputes relation paths, broad relation reduction, lineage side, person eligibility, truth status and count outcomes without calling the production CP-005 solver.

## Merge and split decisions

- exact, broad and gender-neutral invariant relations merge under \`RESOLVE_INVARIANT_RELATION\`;
- one-of-two and indeterminate relation outcomes merge under \`RESOLVE_RELATION_UNCERTAINTY\`;
- definite, possible and impossible claims are parameters of one claim-status authority;
- person status and person-set uncertainty remain separate because their answer contracts differ;
- minimum and maximum counts are opposite parameters of one bound authority;
- possible and impossible counts are status parameters of one selection authority;
- invariant and indeterminate exact counts merge under one all-model agreement authority.

## Boundaries

- fully determined relations remain in CP-001 through CP-003;
- definite closed-world counts remain in CP-004;
- coded relation decoding and coded construction remain CP-006 and CP-007;
- Data Sufficiency and multi-attribute family puzzles remain excluded.

## Release boundary

\`\`\`text
English permanent review runtime          available
Question Studio                          disabled
Question Bank                            disabled
mock tests                               disabled
Hindi/Punjabi localisation               not started
public publication                       disabled
production staging                       disabled
merge                                    not authorised
\`\`\`
`;
