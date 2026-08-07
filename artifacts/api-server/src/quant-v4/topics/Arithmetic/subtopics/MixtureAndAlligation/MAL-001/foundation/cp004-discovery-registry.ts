import type { MalCp004DiscoveryRegistryEntry } from "./cp004-types";
import {
  MAL_CP004_DISCOVERY_PROTOTYPE_IDS,
  MAL_CP004_ID,
} from "./cp004-types";

export const MAL_CP004_DISCOVERY_REGISTRY:
  readonly MalCp004DiscoveryRegistryEntry[] = [
    {
      prototypeId:
        "MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION",
      canonicalProblemId: MAL_CP004_ID,
      answerSemantic: "COMPONENT_QUANTITY",
      taskDirection: "FORWARD",
      invariant: "SOLUTE_AMOUNT",
      legacyFamilyAuthorities: [
        "concentration_basic_percent",
        "mix_pure_component_extraction",
        "mix_final_component_quantity",
      ],
      sourceEvidenceStatus:
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      baseDifficulty: "Easy",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT",
      canonicalProblemId: MAL_CP004_ID,
      answerSemantic: "CONCENTRATION_PERCENT",
      taskDirection: "FORWARD",
      invariant: "SOLUTE_AMOUNT",
      legacyFamilyAuthorities: ["concentration_basic_percent"],
      sourceEvidenceStatus:
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      baseDifficulty: "Easy",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId: "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET",
      canonicalProblemId: MAL_CP004_ID,
      answerSemantic: "SOLVENT_QUANTITY_ADDED",
      taskDirection: "RECONSTRUCTION",
      invariant: "SOLUTE_AMOUNT",
      legacyFamilyAuthorities: [
        "dilution_water_added_to_solution",
        "concentration_target_percent_by_adding_water",
      ],
      sourceEvidenceStatus:
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      baseDifficulty: "Medium",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
      canonicalProblemId: MAL_CP004_ID,
      answerSemantic: "PURE_SOLUTE_QUANTITY_ADDED",
      taskDirection: "RECONSTRUCTION",
      invariant: "SOLVENT_AMOUNT",
      legacyFamilyAuthorities: [
        "concentration_target_percent_by_adding_pure_substance",
      ],
      sourceEvidenceStatus:
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      baseDifficulty: "Medium",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET",
      canonicalProblemId: MAL_CP004_ID,
      answerSemantic: "SOLVENT_QUANTITY_EVAPORATED",
      taskDirection: "RECONSTRUCTION",
      invariant: "SOLUTE_AMOUNT",
      legacyFamilyAuthorities: [
        "concentration_evaporation_increase_percent",
        "concentration_water_evaporation",
      ],
      sourceEvidenceStatus:
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      baseDifficulty: "Medium",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
      canonicalProblemId: MAL_CP004_ID,
      answerSemantic: "FINAL_MASS",
      taskDirection: "FORWARD",
      invariant: "DRY_MATTER_AMOUNT",
      legacyFamilyAuthorities: [
        "concentration_fresh_dry_weight_shift",
      ],
      sourceEvidenceStatus:
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      baseDifficulty: "Medium",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT",
      canonicalProblemId: MAL_CP004_ID,
      answerSemantic: "INITIAL_MASS",
      taskDirection: "INVERSE",
      invariant: "DRY_MATTER_AMOUNT",
      legacyFamilyAuthorities: [
        "concentration_fresh_dry_weight_shift",
      ],
      sourceEvidenceStatus:
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      baseDifficulty: "Hard",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
  ];

export const MAL_CP004_BOUNDARY_LEDGER = [
  {
    legacyFamilyId: "dilution_solution_removed_water_added",
    currentVerdict: "MAL-CP-003_CP004_BOUNDARY",
    reason:
      "Removal and refill create a sampling transition; concentration wording alone must not move geometric replacement into CP-004.",
  },
  {
    legacyFamilyId: "dilution_successive_replacement",
    currentVerdict: "MAL-CP-003",
    reason:
      "Repeated fractional retention is already owned by CP-003.",
  },
  {
    legacyFamilyId: "dilution_find_number_of_operations",
    currentVerdict: "MAL-CP-003",
    reason:
      "The unknown is the repeated-operation count, so the geometric-retention contract controls ownership.",
  },
  {
    legacyFamilyId: "concentration_mixing_two_solutions",
    currentVerdict: "MAL-CP-001_CP004_BOUNDARY",
    reason:
      "Direct solution blending may be ordinary weighted conservation; duplicate QLs are prohibited.",
  },
  {
    legacyFamilyId: "concentration_mixing_three_solutions",
    currentVerdict: "MAL-CP-001_CP004_BOUNDARY",
    reason:
      "Three-solution blending requires an ownership audit against CP-001 weighted blending.",
  },
  {
    legacyFamilyId: "vessel_chemical_concentration_equilibrium",
    currentVerdict: "MAL-CP-004_CP006_BOUNDARY",
    reason:
      "A vessel-by-vessel transfer ledger belongs to CP-006 unless no transfer state survives.",
  },
] as const;

if (
  MAL_CP004_DISCOVERY_REGISTRY.length !==
  MAL_CP004_DISCOVERY_PROTOTYPE_IDS.length
) {
  throw new Error("CP-004 discovery registry count does not match its IDs.");
}
