import type { MalCp004DiscoveryPrototypeId } from "./cp004-types";
import type { MalCp004Wave02SourceGapId } from "./cp004-source-authority-wave02";

export const MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS = [
  "MAL-CP004-EFF-COMPONENT-AMOUNT",
  "MAL-CP004-EFF-CONCENTRATION",
  "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE",
  "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET",
  "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET",
  "MAL-CP004-EFF-EVAPORATION-TARGET",
  "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE",
  "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION",
  "MAL-CP004-EFF-MOISTURE-FORWARD",
  "MAL-CP004-EFF-MOISTURE-INVERSE",
] as const;

export type MalCp004Wave03EffectiveContractId =
  (typeof MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS)[number];

export type MalCp004Wave03AuthorityId =
  | MalCp004DiscoveryPrototypeId
  | MalCp004Wave02SourceGapId
  | `PCT-007/${"PCT-CP-005" | "PCT-CP-006"}/${string}`;

export type MalCp004Wave03Disposition =
  | "KEEP_OPEN_CONTRACT"
  | "MERGE_AS_REPRESENTATION_VARIANT"
  | "REFERENCE_EXISTING_CONTRACT"
  | "ADD_OPEN_CONTRACT_FROM_COLLISION";

export interface MalCp004Wave03EquivalenceEntry {
  authorityId: MalCp004Wave03AuthorityId;
  ownerBeforeClosure: "MAL-CP-004" | "PCT-007";
  effectiveContractId: MalCp004Wave03EffectiveContractId;
  disposition: MalCp004Wave03Disposition;
  outputVariant: string;
  invariant:
    | "SOLUTE_AMOUNT"
    | "SOLVENT_AMOUNT"
    | "DRY_MATTER_AMOUNT";
  note: string;
}

export const MAL_CP004_WAVE03_EQUIVALENCE_MATRIX:
  readonly MalCp004Wave03EquivalenceEntry[] = [
    {
      authorityId: "MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-COMPONENT-AMOUNT",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "TRACKED_COMPONENT_AMOUNT",
      invariant: "SOLUTE_AMOUNT",
      note: "Direct forward component projection.",
    },
    {
      authorityId: "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-CONCENTRATION",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "TRACKED_COMPONENT_PERCENT",
      invariant: "SOLUTE_AMOUNT",
      note: "Direct component-to-total concentration projection.",
    },
    {
      authorityId: "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "SOLVENT_ADDED",
      invariant: "SOLUTE_AMOUNT",
      note: "Solute remains fixed while total quantity increases.",
    },
    {
      authorityId: "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "PURE_SOLUTE_ADDED",
      invariant: "SOLVENT_AMOUNT",
      note: "Solvent remains fixed; this must not merge with solvent-only transformations.",
    },
    {
      authorityId: "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-EVAPORATION-TARGET",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "EVAPORATED_AMOUNT",
      invariant: "SOLUTE_AMOUNT",
      note: "Solute remains fixed while solvent and total quantity decrease.",
    },
    {
      authorityId: "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-MOISTURE-FORWARD",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "FINAL_MASS",
      invariant: "DRY_MATTER_AMOUNT",
      note: "Forward wet-to-dry mass projection.",
    },
    {
      authorityId: "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-MOISTURE-INVERSE",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "INITIAL_MASS",
      invariant: "DRY_MATTER_AMOUNT",
      note: "Inverse dry-to-wet mass reconstruction.",
    },
    {
      authorityId: "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATED-QUANTITY",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId: "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION",
      disposition: "KEEP_OPEN_CONTRACT",
      outputVariant: "INITIAL_TOTAL",
      invariant: "SOLUTE_AMOUNT",
      note: "A separate inverse because the unknown is the original total quantity.",
    },
    {
      authorityId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-EVAPORATION",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId:
        "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE",
      disposition: "MERGE_AS_REPRESENTATION_VARIANT",
      outputVariant: "SOLVENT_EVAPORATED",
      invariant: "SOLUTE_AMOUNT",
      note: "Shares one final-concentration contract with known solvent addition.",
    },
    {
      authorityId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-SOLVENT-ADDITION",
      ownerBeforeClosure: "MAL-CP-004",
      effectiveContractId:
        "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE",
      disposition: "MERGE_AS_REPRESENTATION_VARIANT",
      outputVariant: "SOLVENT_ADDED",
      invariant: "SOLUTE_AMOUNT",
      note: "Shares one final-concentration contract with known evaporation.",
    },
    {
      authorityId: "PCT-007/PCT-CP-005/findComponentFromTotalAndRate",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-COMPONENT-AMOUNT",
      disposition: "REFERENCE_EXISTING_CONTRACT",
      outputVariant: "TRACKED_COMPONENT_AMOUNT",
      invariant: "SOLUTE_AMOUNT",
      note: "Exact duplicate equation: total multiplied by component rate.",
    },
    {
      authorityId: "PCT-007/PCT-CP-005/findOtherComponentFromTotalAndRate",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-COMPONENT-AMOUNT",
      disposition: "MERGE_AS_REPRESENTATION_VARIANT",
      outputVariant: "OTHER_COMPONENT_AMOUNT",
      invariant: "SOLUTE_AMOUNT",
      note: "Complement output of the same component-amount state.",
    },
    {
      authorityId: "PCT-007/PCT-CP-005/findTotalFromComponentAndRate",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE",
      disposition: "ADD_OPEN_CONTRACT_FROM_COLLISION",
      outputVariant: "TRACKED_COMPONENT_GIVEN",
      invariant: "SOLUTE_AMOUNT",
      note: "A legitimate inverse missing from Wave 01 and Wave 02 source gaps.",
    },
    {
      authorityId: "PCT-007/PCT-CP-005/findRateFromComponentAndTotal",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-CONCENTRATION",
      disposition: "REFERENCE_EXISTING_CONTRACT",
      outputVariant: "TRACKED_COMPONENT_PERCENT",
      invariant: "SOLUTE_AMOUNT",
      note: "Exact duplicate equation: component divided by total.",
    },
    {
      authorityId: "PCT-007/PCT-CP-005/findTotalFromOtherComponentAndRate",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE",
      disposition: "MERGE_AS_REPRESENTATION_VARIANT",
      outputVariant: "OTHER_COMPONENT_GIVEN",
      invariant: "SOLUTE_AMOUNT",
      note: "Complement-given variant of total reconstruction.",
    },
    {
      authorityId: "PCT-007/PCT-CP-006/findFinalDryWeight",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-MOISTURE-FORWARD",
      disposition: "REFERENCE_EXISTING_CONTRACT",
      outputVariant: "FINAL_MASS",
      invariant: "DRY_MATTER_AMOUNT",
      note: "Exact duplicate of Wave 01 forward moisture shift.",
    },
    {
      authorityId: "PCT-007/PCT-CP-006/findWaterLostAfterDrying",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-MOISTURE-FORWARD",
      disposition: "MERGE_AS_REPRESENTATION_VARIANT",
      outputVariant: "MOISTURE_LOST",
      invariant: "DRY_MATTER_AMOUNT",
      note: "Initial mass minus final mass; not an independent QL.",
    },
    {
      authorityId: "PCT-007/PCT-CP-006/findFinalVolumeAfterEvaporation",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-EVAPORATION-TARGET",
      disposition: "MERGE_AS_REPRESENTATION_VARIANT",
      outputVariant: "FINAL_TOTAL",
      invariant: "SOLUTE_AMOUNT",
      note: "Final total is the complement output of evaporated amount.",
    },
    {
      authorityId: "PCT-007/PCT-CP-006/findEvaporatedAmount",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-EVAPORATION-TARGET",
      disposition: "REFERENCE_EXISTING_CONTRACT",
      outputVariant: "EVAPORATED_AMOUNT",
      invariant: "SOLUTE_AMOUNT",
      note: "Exact duplicate of the Wave 01 evaporation target contract.",
    },
    {
      authorityId: "PCT-007/PCT-CP-006/findInitialWeightFromFinalDryWeight",
      ownerBeforeClosure: "PCT-007",
      effectiveContractId: "MAL-CP004-EFF-MOISTURE-INVERSE",
      disposition: "REFERENCE_EXISTING_CONTRACT",
      outputVariant: "INITIAL_MASS",
      invariant: "DRY_MATTER_AMOUNT",
      note: "Exact duplicate of the Wave 01 inverse moisture shift.",
    },
  ] as const;

export const MAL_CP004_WAVE03_SEPARATION_PROOFS = [
  {
    left: "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET",
    right: "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET",
    reason:
      "Solvent addition conserves solute; pure-solute addition conserves solvent and changes both tracked solute and total quantity.",
  },
  {
    left: "MAL-CP004-EFF-EVAPORATION-TARGET",
    right: "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE",
    reason:
      "The first solves for an unknown solvent change to reach a target; the second receives the solvent change and solves for final concentration.",
  },
  {
    left: "MAL-CP004-EFF-MOISTURE-FORWARD",
    right: "MAL-CP004-EFF-MOISTURE-INVERSE",
    reason:
      "Forward and inverse tasks expose different unknown totals and require different learner reconstruction directions.",
  },
  {
    left: "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE",
    right: "MAL-CP004-EFF-CONCENTRATION",
    reason:
      "One reconstructs total quantity from a component and rate; the other computes the rate from component and total.",
  },
] as const;

export const MAL_CP004_WAVE03_CANONICAL_OWNER_VERDICT = {
  canonicalOwner: "MAL-CP-004",
  percentageReferencePolicy:
    "PCT-007 may retain syllabus navigation aliases, but mathematically duplicate permanent QLs must not be released independently under both chapters.",
  percentageMutationInThisWave: false,
  permanentQlAllocationInThisWave: false,
} as const;
