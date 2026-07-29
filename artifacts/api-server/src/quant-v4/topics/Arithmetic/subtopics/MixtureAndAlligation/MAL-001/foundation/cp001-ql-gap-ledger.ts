export const MAL_CP001_QL_GAP_IDS = [
  "MAL-CP001-GAP-REVERSE-RATIO-ORDER",
  "MAL-CP001-GAP-UNKNOWN-SOURCE-SIDE",
  "MAL-CP001-GAP-KNOWN-COUNTERPART-SHORTCUT",
  "MAL-CP001-GAP-EQUAL-QUANTITY-SHORTCUT",
  "MAL-CP001-GAP-COMPACT-TABLE-INPUT",
  "MAL-CP001-GAP-ALLIGATION-DIAGRAM",
  "MAL-CP001-GAP-DATA-SUFFICIENCY",
  "MAL-CP001-GAP-SCENARIO-NOUN-ONLY",
  "MAL-CP001-GAP-UNIT-OR-CONCENTRATION-SKIN",
  "MAL-CP001-GAP-STATIC-CONCENTRATION-OWNERSHIP",
  "MAL-CP001-GAP-VESSEL-COMBINATION-OWNERSHIP",
  "MAL-CP001-GAP-SELLING-PRICE-PROFIT-OUTPUT",
  "MAL-CP001-GAP-FINAL-TOTAL-QUANTITY",
  "MAL-CP001-GAP-QUANTITY-DIFFERENCE-OUTPUT",
  "MAL-CP001-GAP-IMPOSSIBLE-OR-INDETERMINATE",
  "MAL-CP001-GAP-PURE-COMPONENT-AMOUNT",
  "MAL-CP001-GAP-DIFFERENCE-AS-SCALE-INPUT",
  "MAL-CP001-GAP-TWO-STAGE-INVERSE",
  "MAL-CP001-GAP-THREE-WAY-COUPLED-RELATION",
] as const;

export type MalCp001QlGapId = (typeof MAL_CP001_QL_GAP_IDS)[number];

export type MalCp001QlGapDisposition =
  | "MERGE_PARAMETER_VARIANT"
  | "MERGE_INSTANCE_VARIANT"
  | "MERGE_SCENARIO_VARIANT"
  | "RENDERER_VARIANT"
  | "PRESENTATION_LAYER"
  | "OWNERSHIP_BOUNDARY_CP004"
  | "OWNERSHIP_BOUNDARY_CP006"
  | "OWNERSHIP_BOUNDARY_CP002_CP004"
  | "REASSIGN_PNL_OR_CP005"
  | "SOURCE_EVIDENCE_REQUIRED"
  | "DEFERRED_BY_APPROVAL"
  | "HELD_BY_APPROVAL"
  | "REFERRED_TO_CP002_BY_APPROVAL";

export type MalCp001QlGapSourceStatus =
  | "DIRECTLY_RECONCILED"
  | "LEGACY_FAMILY_RECONCILED"
  | "OWNERSHIP_LEDGER_RECONCILED"
  | "NO_DIRECT_FIXTURE_RECOVERED";

export interface MalCp001QlGapLedgerEntry {
  gapId: MalCp001QlGapId;
  candidateDirection: string;
  sourceStatus: MalCp001QlGapSourceStatus;
  legacyFamilies: readonly string[];
  disposition: MalCp001QlGapDisposition;
  candidateOwner: string;
  representedBy: string | null;
  newQlTemplateAdmitted: false;
  openEvidenceGap: boolean;
  requiresDirectSourceEvidence: boolean;
  rationale: string;
}

/**
 * Gap decisions are non-admitting by design. A row can only create a future QL
 * template after source, ownership and executable proof are added separately.
 */
export const MAL_CP001_QL_GAP_LEDGER:
  readonly MalCp001QlGapLedgerEntry[] = [
    {
      gapId: "MAL-CP001-GAP-REVERSE-RATIO-ORDER",
      candidateDirection: "Ask the same target-ratio question in higher-to-lower rather than lower-to-higher order.",
      sourceStatus: "DIRECTLY_RECONCILED",
      legacyFamilies: ["mix_two_price_blend_ratio", "alligation_cheaper_dearer_ratio"],
      disposition: "MERGE_PARAMETER_VARIANT",
      candidateOwner: "MAL-CP-001",
      representedBy: "MAL-CP001-QLC-TARGET-RATIO",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "Answer order must be explicit, but reversing the requested orientation does not change evidence, equation, misconception family or ratio validator.",
    },
    {
      gapId: "MAL-CP001-GAP-UNKNOWN-SOURCE-SIDE",
      candidateDirection: "Recover either the lower-valued or higher-valued unknown source.",
      sourceStatus: "DIRECTLY_RECONCILED",
      legacyFamilies: ["mix_two_items_find_missing_price", "alligation_find_cost_price", "mix_reverse_alligation"],
      disposition: "MERGE_PARAMETER_VARIANT",
      candidateOwner: "MAL-CP-001",
      representedBy: "MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE / MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "The unknown side changes parameter ordering, not the answer semantic or canonical inverse balance.",
    },
    {
      gapId: "MAL-CP001-GAP-KNOWN-COUNTERPART-SHORTCUT",
      candidateDirection: "Use a derived alligation ratio and one known component quantity to find the counterpart quantity.",
      sourceStatus: "DIRECTLY_RECONCILED",
      legacyFamilies: ["mix_two_items_find_quantity", "alligation_target_mean_quantity_added"],
      disposition: "MERGE_PARAMETER_VARIANT",
      candidateOwner: "MAL-CP-001",
      representedBy: "MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "Alligation is an optional shortcut; the learner-facing unknown, scalar validator and target-balance state already exist in the one-known quantity template.",
    },
    {
      gapId: "MAL-CP001-GAP-EQUAL-QUANTITY-SHORTCUT",
      candidateDirection: "Use the simple-average shortcut when source quantities are equal.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["alligation_equal_quantity_average"],
      disposition: "MERGE_INSTANCE_VARIANT",
      candidateOwner: "Average unless mixture composition is essential; otherwise MAL-CP-001 final mean",
      representedBy: "MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "Equal quantities are a parameter subcase and shortcut, not a new unknown, validator or question-language contract.",
    },
    {
      gapId: "MAL-CP001-GAP-COMPACT-TABLE-INPUT",
      candidateDirection: "Present component values and quantities in a compact table.",
      sourceStatus: "DIRECTLY_RECONCILED",
      legacyFamilies: ["mix_average_value_quantity_given", "mix_three_items_weighted_average"],
      disposition: "RENDERER_VARIANT",
      candidateOwner: "MAL-CP-001 presentation",
      representedBy: "Existing explicit-quantity and multi-component templates",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "A table changes rendering only; the same typed component evidence reaches the same solver, distractors and validator.",
    },
    {
      gapId: "MAL-CP001-GAP-ALLIGATION-DIAGRAM",
      candidateDirection: "Show or omit the alligation cross diagram.",
      sourceStatus: "DIRECTLY_RECONCILED",
      legacyFamilies: ["alligation_cheaper_dearer_ratio", "mix_two_price_blend_ratio"],
      disposition: "RENDERER_VARIANT",
      candidateOwner: "MAL-CP-001 presentation",
      representedBy: "MAL-CP001-QLC-TARGET-RATIO and ratio-scale templates",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "The diagram is an explanation aid and cannot create a separate learner contract.",
    },
    {
      gapId: "MAL-CP001-GAP-DATA-SUFFICIENCY",
      candidateDirection: "Wrap the arithmetic state in statement-I/statement-II sufficiency presentation.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: [],
      disposition: "PRESENTATION_LAYER",
      candidateOwner: "Data Sufficiency presentation layer",
      representedBy: "Underlying MAL-CP-001 template selected by the arithmetic state",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "Statement sufficiency changes the outer task and option semantics; it should reuse an arithmetic contract rather than duplicate it as a MAL QL.",
    },
    {
      gapId: "MAL-CP001-GAP-SCENARIO-NOUN-ONLY",
      candidateDirection: "Create separate rice, wheat, tea, fuel or alloy QLs with identical mathematics.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["mix_two_grades_of_rice", "mix_two_grades_of_wheat", "mix_tea_blend_average_price", "mix_fuel_blend_average_price", "alloy_mean_price_blend"],
      disposition: "MERGE_SCENARIO_VARIANT",
      candidateOwner: "MAL-CP-001 context pools",
      representedBy: "All relevant QL templates",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "Commodity nouns do not alter the hidden weighted state, answer shape or validator.",
    },
    {
      gapId: "MAL-CP001-GAP-UNIT-OR-CONCENTRATION-SKIN",
      candidateDirection: "Express a static blend in price, percentage, purity or concentration units.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["concentration_mixing_two_solutions", "concentration_mixing_three_solutions"],
      disposition: "MERGE_PARAMETER_VARIANT",
      candidateOwner: "MAL-CP-001 only when the state is a complete static source blend; otherwise MAL-CP-004",
      representedBy: "Final-mean, target-ratio and quantity templates after ownership resolution",
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "Changing the value unit does not itself create a QL; conserved-solute transformations remain CP-004.",
    },
    {
      gapId: "MAL-CP001-GAP-STATIC-CONCENTRATION-OWNERSHIP",
      candidateDirection: "Admit static two- or three-solution concentration blending directly into CP-001.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["concentration_mixing_two_solutions", "concentration_mixing_three_solutions"],
      disposition: "OWNERSHIP_BOUNDARY_CP004",
      candidateOwner: "MAL-CP-001 or MAL-CP-004, but never both",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: true,
      requiresDirectSourceEvidence: false,
      rationale: "The mathematics matches weighted blending, but chapter-level concentration ownership must be resolved before any language/template reuse is admitted.",
    },
    {
      gapId: "MAL-CP001-GAP-VESSEL-COMBINATION-OWNERSHIP",
      candidateDirection: "Combine contents of two or three vessels without or before transfer bookkeeping.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["vessel_two_vessels_different_ratio", "vessel_three_vessel_mixing"],
      disposition: "OWNERSHIP_BOUNDARY_CP006",
      candidateOwner: "MAL-CP-001 for a direct static blend; MAL-CP-006 when vessel state or transfer ledger matters",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: true,
      requiresDirectSourceEvidence: false,
      rationale: "A vessel noun is not sufficient; the exact state transition and bookkeeping burden must decide ownership.",
    },
    {
      gapId: "MAL-CP001-GAP-SELLING-PRICE-PROFIT-OUTPUT",
      candidateDirection: "Find a selling price or profit/loss result after forming a blend.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["alligation_find_selling_price", "mix_cost_selling_price_alligation", "mix_price_profit_basic", "mix_price_profit_target_gain", "mix_price_profit_target_loss"],
      disposition: "REASSIGN_PNL_OR_CP005",
      candidateOwner: "MAL-CP-005 or Profit & Loss when transaction arithmetic drives the answer",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "A commercial answer semantic is not a CP-001 blend-value contract even when alligation is used internally.",
    },
    {
      gapId: "MAL-CP001-GAP-FINAL-TOTAL-QUANTITY",
      candidateDirection: "After solving a missing component quantity, ask for the final total mixture quantity instead.",
      sourceStatus: "NO_DIRECT_FIXTURE_RECOVERED",
      legacyFamilies: [],
      disposition: "SOURCE_EVIDENCE_REQUIRED",
      candidateOwner: "Potential MAL-CP-001 output projection",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: true,
      requiresDirectSourceEvidence: true,
      rationale: "The value is mechanically derivable, but a distinct answer semantic and distractor contract must not be created without direct target-exam evidence.",
    },
    {
      gapId: "MAL-CP001-GAP-QUANTITY-DIFFERENCE-OUTPUT",
      candidateDirection: "Given total and target mean, ask for the difference between the two component quantities.",
      sourceStatus: "NO_DIRECT_FIXTURE_RECOVERED",
      legacyFamilies: [],
      disposition: "SOURCE_EVIDENCE_REQUIRED",
      candidateOwner: "Potential MAL-CP-001 ratio-scale output projection",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: true,
      requiresDirectSourceEvidence: true,
      rationale: "This scalar projection differs from both labelled pair and requested-share validators; it needs direct source evidence before becoming a template.",
    },
    {
      gapId: "MAL-CP001-GAP-IMPOSSIBLE-OR-INDETERMINATE",
      candidateDirection: "Ask whether a target blend is impossible or whether the data are insufficient.",
      sourceStatus: "NO_DIRECT_FIXTURE_RECOVERED",
      legacyFamilies: ["mix_clonable_boundary_edge_alligation"],
      disposition: "SOURCE_EVIDENCE_REQUIRED",
      candidateOwner: "Potential determinacy contract or internal validation only",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: true,
      requiresDirectSourceEvidence: true,
      rationale: "Boundary-state validation is useful internally, but a student-facing logical answer contract requires direct exam evidence and dedicated option semantics.",
    },
    {
      gapId: "MAL-CP001-GAP-PURE-COMPONENT-AMOUNT",
      candidateDirection: "Find the amount of a named substance contained in the final mixture.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["mix_pure_component_extraction", "mix_final_component_quantity", "concentration_basic_percent"],
      disposition: "OWNERSHIP_BOUNDARY_CP002_CP004",
      candidateOwner: "MAL-CP-002 for ratio state or MAL-CP-004 for conserved-solute/concentration state",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: false,
      rationale: "Component-content output is not a source-value weighted-mean answer and belongs to the composition/concentration owners.",
    },
    {
      gapId: "MAL-CP001-GAP-DIFFERENCE-AS-SCALE-INPUT",
      candidateDirection: "Use a stated difference between component quantities to fix the alligation scale.",
      sourceStatus: "LEGACY_FAMILY_RECONCILED",
      legacyFamilies: ["mix_difference_based_quantity"],
      disposition: "DEFERRED_BY_APPROVAL",
      candidateOwner: "MAL-CP-001 ratio-scale contract",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: true,
      rationale: "The product-approved scope explicitly defers this executable representation until direct evidence or a later decision admits it.",
    },
    {
      gapId: "MAL-CP001-GAP-TWO-STAGE-INVERSE",
      candidateDirection: "Derive a first-stage mean and then find an unknown second-stage quantity.",
      sourceStatus: "LEGACY_FAMILY_RECONCILED",
      legacyFamilies: ["mix_compound_alligation_two_steps", "vessel_two_vessels_different_ratio"],
      disposition: "HELD_BY_APPROVAL",
      candidateOwner: "Potential MAL-CP-001 inverse two-stage contract",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: true,
      rationale: "The topology remains held because external evidence is analogous rather than a direct match.",
    },
    {
      gapId: "MAL-CP001-GAP-THREE-WAY-COUPLED-RELATION",
      candidateDirection: "Solve a three-source target blend with a total and a relation between two source quantities.",
      sourceStatus: "OWNERSHIP_LEDGER_RECONCILED",
      legacyFamilies: ["mix_alligation_three_way_blend", "mix_high_difficulty_constraint_system"],
      disposition: "REFERRED_TO_CP002_BY_APPROVAL",
      candidateOwner: "MAL-CP-002 boundary evidence",
      representedBy: null,
      newQlTemplateAdmitted: false,
      openEvidenceGap: false,
      requiresDirectSourceEvidence: true,
      rationale: "The approved recommendation excludes this candidate from CP-001 and refers the recovered coupled-relation pattern to CP-002.",
    },
  ] as const;
