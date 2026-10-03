export const SEA002_CP007_SOURCE_SATURATION_V1 = Object.freeze({
  checkpointId: "SEA-CP-007" as const,
  status: "ID_FREE_SOURCE_SATURATION_PROPOSAL" as const,
  sourceEvidence: Object.freeze([
    Object.freeze({
      family: "BANKING_MIXED_TWO_ROW",
      evidence: "Two parallel rows with some members facing north and some south in both rows; clues combine immediate/offset left-right, same/opposite facing and cross-row opposition.",
    }),
    Object.freeze({
      family: "BANKING_MIXED_DIAGONAL",
      evidence: "Mixed-facing double-row sets use diagonal-opposite references together with person-relative left/right and inferred facing direction.",
    }),
    Object.freeze({
      family: "SAME_DIRECTION_TWO_ROW",
      evidence: "Two-row teaching/source taxonomies explicitly recognize both rows facing the same direction as a distinct configuration, while left/right remains a facing-relative operator.",
    }),
  ]),
  temporaryPrototypes: Object.freeze([
    "SEA-CP007-PROT-001",
    "SEA-CP007-PROT-002",
    "SEA-CP007-PROT-003",
    "SEA-CP007-PROT-004",
    "SEA-CP007-PROT-005",
    "SEA-CP007-PROT-006",
    "SEA-CP007-PROT-007",
  ] as const),
  proposedAuthorities: Object.freeze([
    Object.freeze({
      authorityKey: "CP007-AUTH-01",
      label: "Facing-aware same-row relative position",
      prototypes: Object.freeze([
        "SEA-CP007-PROT-001",
        "SEA-CP007-PROT-002",
        "SEA-CP007-PROT-004",
      ] as const),
      rationale: "Same-direction rows, explicitly mixed facings and immediate/second/third offsets use the same parameterized operator: resolve the reference person's facing, then apply signed same-row distance.",
    }),
    Object.freeze({
      authorityKey: "CP007-AUTH-02",
      label: "Facing-direction relation and inference",
      prototypes: Object.freeze([
        "SEA-CP007-PROT-003",
        "SEA-CP007-PROT-005",
      ] as const),
      rationale: "Known same/opposite-facing relation plus one known direction determines the other direction; attaching the inferred direction to an identified neighbour is a representation, not a new solver.",
    }),
    Object.freeze({
      authorityKey: "CP007-AUTH-03",
      label: "Joint row and facing inference",
      prototypes: Object.freeze([
        "SEA-CP007-PROT-006",
      ] as const),
      rationale: "The learner must infer two state dimensions together: same-row membership from a relative-position clue and facing direction from a facing-relation clue.",
    }),
    Object.freeze({
      authorityKey: "CP007-AUTH-04",
      label: "Inferred-facing diagonal composition",
      prototypes: Object.freeze([
        "SEA-CP007-PROT-007",
      ] as const),
      rationale: "A facing direction must first be inferred, then used to select the correct physical diagonal in the opposite row; this composes two distinct relations and is retained pending production caselet proof.",
    }),
  ]),
  mergeDecisions: Object.freeze([
    "P001+P002+P004: merge as one distance-parameterized facing-aware relative-position authority",
    "P003+P005: merge as one same/opposite facing-direction inference authority",
  ]),
  retainedDistinct: Object.freeze([
    "P006: joint row+facing state inference",
    "P007: facing inference followed by diagonal composition",
  ]),
  heldRepresentations: Object.freeze([
    "third/fourth left-right offsets: parameter values under AUTH-01, not new authorities",
    "one/two persons between: distance representation under AUTH-01 when facing-relative; ordinary absolute gap remains a clue representation",
    "same-direction north vs same-direction south: state variants, not separate authorities",
    "row width 3+3 through 6+6: size variants only",
  ]),
  deferredOutsideAuthorityCount: Object.freeze([
    "statement/claim wrappers",
    "data sufficiency shells",
    "hypothetical exchange or rotation after arrangement",
    "attributes/professions layered on seating",
  ]),
  proposedPermanentRangeIfApproved: "SEA-QL-025..SEA-QL-028" as const,
  permanentQlAllocated: false as const,
  nextFreePermanentQlBeforeApproval: "SEA-QL-025" as const,
  nextGate: "PRODUCTION_CASELET_AND_INDEPENDENT_UNIQUENESS_PROOF_BEFORE_PERMANENT_ALLOCATION" as const,
});
