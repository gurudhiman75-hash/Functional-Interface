import type { MalCp001QlGapId } from "./cp001-ql-gap-ledger";

export const MAL_CP001_OWNERSHIP_RESOLUTION_IDS = [
  "MAL-CP001-OWNERSHIP-STATIC-CONCENTRATION",
  "MAL-CP001-OWNERSHIP-DIRECT-VESSEL-COMBINATION",
] as const;

export type MalCp001OwnershipResolutionId =
  (typeof MAL_CP001_OWNERSHIP_RESOLUTION_IDS)[number];

export interface MalCp001OwnershipResolutionEntry {
  resolutionId: MalCp001OwnershipResolutionId;
  supersededGapId: MalCp001QlGapId;
  cp001OwnedState: string;
  boundaryOwner: "MAL-CP-004" | "MAL-CP-006";
  boundaryState: string;
  representedBy: string;
  sourceBasis: readonly string[];
  newQlTemplateAdmitted: false;
  openOwnershipGap: false;
  rationale: string;
}

/**
 * These decisions supersede the two ownership rows that were deliberately left
 * open in the first nineteen-direction gap pass. They do not admit another QL
 * template; they define which existing CP-001 templates may render the state.
 */
export const MAL_CP001_OWNERSHIP_RESOLUTIONS:
  readonly MalCp001OwnershipResolutionEntry[] = [
    {
      resolutionId: "MAL-CP001-OWNERSHIP-STATIC-CONCENTRATION",
      supersededGapId: "MAL-CP001-GAP-STATIC-CONCENTRATION-OWNERSHIP",
      cp001OwnedState:
        "A complete one-stage weighted blend of two or more source concentrations, where every source concentration and quantity or source ratio is already known and no component is separately conserved through a transformation.",
      boundaryOwner: "MAL-CP-004",
      boundaryState:
        "Any dilution, strengthening, evaporation, wet/dry conversion or nested component-content reconstruction whose decisive invariant is a conserved solute, solvent, dry matter or named component amount.",
      representedBy:
        "Existing CP-001 target-ratio, final-mean, unknown-source and unknown-quantity templates with concentration as the value-unit parameter.",
      sourceBasis: [
        "MAL-001 end-to-end design: CP-001 owns direct weighted blending; CP-004 owns conserved-solute transformations.",
        "XAT 2015 Product M problem recovered through Arun Sharma: raw-material B is reconstructed inside nested source mixtures and conserved while water is added to reach 50% concentration.",
        "Legacy families concentration_mixing_two_solutions and concentration_mixing_three_solutions are weighted-blend aliases unless a transformation invariant is introduced.",
      ],
      newQlTemplateAdmitted: false,
      openOwnershipGap: false,
      rationale:
        "The value unit does not determine ownership. A static complete source blend uses the same weighted state, answer contracts and validators already represented in CP-001. CP-004 begins only when the learner must preserve or reconstruct a named component across a before/after transformation. The recovered XAT fixture is therefore direct CP-004 boundary evidence, not a new CP-001 final-total QL.",
    },
    {
      resolutionId: "MAL-CP001-OWNERSHIP-DIRECT-VESSEL-COMBINATION",
      supersededGapId: "MAL-CP001-GAP-VESSEL-COMBINATION-OWNERSHIP",
      cp001OwnedState:
        "The contents of two or more vessels are poured together once and the question can be solved from the complete source quantities and per-unit values without preserving separate vessel identities after combination.",
      boundaryOwner: "MAL-CP-006",
      boundaryState:
        "Any transfer, return, equalisation or chained movement that requires the current composition of each named vessel to be tracked stage by stage.",
      representedBy:
        "Existing CP-001 explicit two-source, multi-component final-mean, target-ratio and unknown-quantity templates; vessel names are context parameters only.",
      sourceBasis: [
        "MAL-001 end-to-end design: simple combination may collapse to CP-001; CP-006 requires an explicit vessel-by-vessel transfer ledger.",
        "Legacy families vessel_two_vessels_different_ratio and vessel_three_vessel_mixing collapse to weighted blending when there is no intermediate transfer state.",
        "The CP-006 solver/verifier contract is reserved for stage simulation and mass-balance reconciliation across named vessels.",
      ],
      newQlTemplateAdmitted: false,
      openOwnershipGap: false,
      rationale:
        "A vessel noun does not create a vessel-transfer contract. One direct combination erases the source containers and leaves an ordinary weighted blend, so CP-001 owns it through existing templates. CP-006 begins only when source-vessel composition at an intermediate instant affects a later transfer or target state.",
    },
  ] as const;
