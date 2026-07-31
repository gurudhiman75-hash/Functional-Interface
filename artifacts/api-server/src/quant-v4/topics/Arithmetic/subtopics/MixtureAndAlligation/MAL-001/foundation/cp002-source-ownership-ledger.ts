import type { MalCp002DiscoveryPrototypeId } from "./cp002-types";

export type MalCp002SourceClass =
  | "QUANT_V2_LEGACY_FAMILY"
  | "CP001_BOUNDARY_REFERRAL"
  | "ANALOGOUS_EXTERNAL_SOURCE"
  | "CHAPTER_BOUNDARY_EXCLUSION";

export type MalCp002OwnershipVerdict =
  | "MAL-CP-002"
  | "MAL-CP-002_CP003_BOUNDARY"
  | "MAL-CP-001_BOUNDARY"
  | "MAL-CP-004_BOUNDARY"
  | "RAP_BOUNDARY"
  | "MAL-CP-003_EXCLUDED"
  | "MAL-CP-004_EXCLUDED";

export interface MalCp002SourceOwnershipFinding {
  findingId: string;
  sourceClass: MalCp002SourceClass;
  sourceLabel: string;
  recoveredPattern: string;
  decisiveInvariant: string;
  ownershipVerdict: MalCp002OwnershipVerdict;
  candidatePrototypeId: MalCp002DiscoveryPrototypeId | null;
  disposition:
    | "EXECUTABLE_FRONTIER"
    | "BOUNDARY_AUDIT_REQUIRED"
    | "SOURCE_RECOVERED_PENDING_EXECUTION"
    | "EXCLUDED_FROM_CP002";
  rationale: string;
}

export const MAL_CP002_SOURCE_OWNERSHIP_FINDINGS:
  readonly MalCp002SourceOwnershipFinding[] = [
    {
      findingId: "CP002-LEGACY-MILK-WATER-BASIC-RATIO",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "mix_milk_water_basic_ratio",
      recoveredPattern:
        "A total mixture and its two-substance ratio determine the quantity of each component.",
      decisiveInvariant: "Total quantity is partitioned by ratio parts.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO",
      disposition: "EXECUTABLE_FRONTIER",
      rationale:
        "The mixture state and named component quantities make this more than context-free ratio simplification.",
    },
    {
      findingId: "CP002-LEGACY-WATER-ADDED",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "mix_milk_water_find_water_added",
      recoveredPattern:
        "One component is added while the other component remains unchanged until a target ratio is reached.",
      decisiveInvariant: "The unaltered component quantity is conserved.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
      disposition: "EXECUTABLE_FRONTIER",
      rationale:
        "This is the canonical one-step ratio-adjustment state, independent of whether the added component is water.",
    },
    {
      findingId: "CP002-LEGACY-MILK-ADDED",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "mix_milk_water_find_milk_added",
      recoveredPattern:
        "The first component is added while the second remains fixed until a target ratio is reached.",
      decisiveInvariant: "The unaltered component quantity is conserved.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
      disposition: "EXECUTABLE_FRONTIER",
      rationale:
        "Changing which named component is added is a parameter variant, not automatically a distinct permanent contract.",
    },
    {
      findingId: "CP002-LEGACY-TARGET-RATIO",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "mix_milk_water_target_ratio",
      recoveredPattern:
        "A one-step addition or removal changes a known initial composition to a stated target ratio.",
      decisiveInvariant: "Only one component changes.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
      disposition: "EXECUTABLE_FRONTIER",
      rationale:
        "The legacy label is broader than one contract and must be decomposed by operation and requested unknown.",
    },
    {
      findingId: "CP002-LEGACY-PURE-COMPONENT-REMOVAL",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "mix_milk_water_quantity_removed",
      recoveredPattern:
        "A stated pure component is removed while the counterpart remains unchanged.",
      decisiveInvariant: "The counterpart component is conserved.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO",
      disposition: "EXECUTABLE_FRONTIER",
      rationale:
        "The stem must explicitly say that a pure component is removed; removing homogeneous mixture is a different state.",
    },
    {
      findingId: "CP002-LEGACY-RATIO-AFTER-ADDITION",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "mix_ratio_change_after_addition",
      recoveredPattern:
        "A known quantity of one component is added and the resulting component ratio is requested.",
      decisiveInvariant: "The counterpart component is unchanged.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-ADDITION",
      disposition: "EXECUTABLE_FRONTIER",
      rationale: "This is the forward direction of one-step ratio adjustment.",
    },
    {
      findingId: "CP002-LEGACY-RATIO-AFTER-REMOVAL",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "mix_ratio_change_after_removal",
      recoveredPattern:
        "A known quantity of one pure component is removed and the resulting ratio is requested.",
      decisiveInvariant: "The other component is unchanged.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-REMOVAL",
      disposition: "EXECUTABLE_FRONTIER",
      rationale:
        "Forward removal remains CP-002 only when the removed material is a named pure component.",
    },
    {
      findingId: "CP002-LEGACY-SINGLE-REPLACEMENT",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "replacement_single_operation / mix_ratio_change_after_replacement",
      recoveredPattern:
        "One homogeneous sample is removed once and the vessel is refilled once with a pure component.",
      decisiveInvariant:
        "Both original components are retained in the same single-stage fraction before refill.",
      ownershipVerdict: "MAL-CP-002_CP003_BOUNDARY",
      candidatePrototypeId:
        "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO",
      disposition: "BOUNDARY_AUDIT_REQUIRED",
      rationale:
        "One operation has no geometric repetition, but the sample removed is mixture rather than a pure component. CP-003 retains all repeated-retention variants.",
    },
    {
      findingId: "CP002-LEGACY-ALLOY-ADJUSTMENT",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "alloy_metal_added_removed",
      recoveredPattern:
        "One metal is added or removed while the other metal quantity stays fixed.",
      decisiveInvariant: "The unchanged metal quantity is conserved.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
      disposition: "EXECUTABLE_FRONTIER",
      rationale:
        "Alloy wording is a scenario domain, not a new task identity by itself.",
    },
    {
      findingId: "CP002-CP001-REMOVE-HIGH-ADD-LOW",
      sourceClass: "QUANT_V2_LEGACY_FAMILY",
      sourceLabel: "alligation_remove_high_value_add_low_value",
      recoveredPattern:
        "A high-value source is replaced by a low-value source to reach a target mean.",
      decisiveInvariant:
        "The governing state may be a target weighted mean rather than a component ratio.",
      ownershipVerdict: "MAL-CP-001_BOUNDARY",
      candidatePrototypeId: null,
      disposition: "BOUNDARY_AUDIT_REQUIRED",
      rationale:
        "Price/value replacement stays with CP-001 when the target is a mean value; CP-002 owns composition-ratio adjustment.",
    },
    {
      findingId: "CP002-CP001-THREE-WAY-REFERRAL",
      sourceClass: "CP001_BOUNDARY_REFERRAL",
      sourceLabel: "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION",
      recoveredPattern:
        "Three component quantities obey an initial relation; stated additions create a new three-way ratio and one final component quantity is requested.",
      decisiveInvariant: "Coupled ratio relations before and after additions.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-THREE-COMPONENT-ADDITION-RATIO-ADJUSTMENT",
      disposition: "SOURCE_RECOVERED_PENDING_EXECUTION",
      rationale:
        "CP-001 rejected this as a weighted-mean contract. CP-002 records the referral but does not freeze it before an executable uniqueness and source audit.",
    },
    {
      findingId: "CP002-EXTERNAL-THREE-VARIETY-TEA",
      sourceClass: "ANALOGOUS_EXTERNAL_SOURCE",
      sourceLabel:
        "R.S. Aggarwal Quantitative Aptitude, three-variety tea worked example (P.C.S. 2006)",
      recoveredPattern:
        "Three varieties begin in one ratio; additions change the three-way ratio and the final third-variety quantity is reconstructed.",
      decisiveInvariant: "Coupled three-component ratio adjustment.",
      ownershipVerdict: "MAL-CP-002",
      candidatePrototypeId:
        "MAL-CP002-PROT-THREE-COMPONENT-ADDITION-RATIO-ADJUSTMENT",
      disposition: "SOURCE_RECOVERED_PENDING_EXECUTION",
      rationale:
        "This supports the task family as competitive-exam content but remains analogous evidence until the exact source fixture is encoded and audited.",
    },
    {
      findingId: "CP002-EXCLUDE-REPEATED-REPLACEMENT",
      sourceClass: "CHAPTER_BOUNDARY_EXCLUSION",
      sourceLabel:
        "replacement_repeated_operation and all retention-product inverses",
      recoveredPattern:
        "Two or more remove-refill operations create geometric or product-form retention.",
      decisiveInvariant: "Repeated fractional retention.",
      ownershipVerdict: "MAL-CP-003_EXCLUDED",
      candidatePrototypeId: null,
      disposition: "EXCLUDED_FROM_CP002",
      rationale:
        "CP-003 owns repeated operations, unknown operation counts and unequal multi-stage replacement fractions.",
    },
    {
      findingId: "CP002-EXCLUDE-CONCENTRATION-PERCENT",
      sourceClass: "CHAPTER_BOUNDARY_EXCLUSION",
      sourceLabel: "concentration and dilution percentage families",
      recoveredPattern:
        "A named solute or dry matter amount is conserved while percentage concentration changes.",
      decisiveInvariant: "Conserved solute or dry matter.",
      ownershipVerdict: "MAL-CP-004_EXCLUDED",
      candidatePrototypeId: null,
      disposition: "EXCLUDED_FROM_CP002",
      rationale:
        "CP-004 owns concentration semantics even when a two-term ratio can be written as an intermediate representation.",
    },
    {
      findingId: "CP002-EXCLUDE-CONTEXT-FREE-RATIO",
      sourceClass: "CHAPTER_BOUNDARY_EXCLUSION",
      sourceLabel: "pure ratio arithmetic without mixture state",
      recoveredPattern:
        "Numbers are divided in a ratio without a component-conservation or mixture adjustment state.",
      decisiveInvariant: "General ratio partition only.",
      ownershipVerdict: "RAP_BOUNDARY",
      candidatePrototypeId: null,
      disposition: "EXCLUDED_FROM_CP002",
      rationale:
        "A mixture noun alone cannot move ordinary ratio-and-proportion arithmetic into MAL.",
    },
  ] as const;
