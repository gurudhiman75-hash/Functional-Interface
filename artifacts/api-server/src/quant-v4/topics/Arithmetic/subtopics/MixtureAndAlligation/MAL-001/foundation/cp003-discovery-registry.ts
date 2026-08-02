import {
  MAL_CP003_DISCOVERY_PROTOTYPE_IDS,
  type MalCp003DiscoveryPrototypeId,
  type MalCp003DiscoveryRegistryEntry,
  type MalCp003ExecutablePrototypeId,
} from "./cp003-types";

export const MAL_CP003_DISCOVERY_REGISTRY:
  readonly MalCp003DiscoveryRegistryEntry[] = [
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      cpId: "MAL-CP-003",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORIGINAL_COMPONENT_QUANTITY",
      topology: "EQUAL_REPEATED_REMOVE_REFILL",
      decisiveInvariant: "GEOMETRIC_RETENTION",
      baseDifficulty: "Medium",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["LEGACY_V2_DIRECT_EXECUTABLE_RECOVERY"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS",
      cpId: "MAL-CP-003",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORIGINAL_COMPONENT_FRACTION",
      topology: "EQUAL_REPEATED_REMOVE_REFILL",
      decisiveInvariant: "GEOMETRIC_RETENTION",
      baseDifficulty: "Easy",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "REPRESENTATION_CLOSURE"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS",
      cpId: "MAL-CP-003",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_REFILL_COMPONENT_QUANTITY",
      topology: "EQUAL_REPEATED_REMOVE_REFILL",
      decisiveInvariant: "GEOMETRIC_RETENTION",
      baseDifficulty: "Medium",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["REPRESENTATION_CLOSURE"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      cpId: "MAL-CP-003",
      taskDirection: "INVERSE",
      answerSemantic: "INITIAL_ORIGINAL_COMPONENT_QUANTITY",
      topology: "INVERSE_EQUAL_REPEATED_REMOVE_REFILL",
      decisiveInvariant: "GEOMETRIC_RETENTION",
      baseDifficulty: "Hard",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "INVERSE_CLOSURE"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId: "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
      cpId: "MAL-CP-003",
      taskDirection: "INVERSE",
      answerSemantic: "REMOVAL_QUANTITY_PER_OPERATION",
      topology: "INVERSE_EQUAL_REPEATED_REMOVE_REFILL",
      decisiveInvariant: "GEOMETRIC_RETENTION",
      baseDifficulty: "Hard",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "INVERSE_CLOSURE"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId: "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
      cpId: "MAL-CP-003",
      taskDirection: "INVERSE",
      answerSemantic: "NUMBER_OF_OPERATIONS",
      topology: "INVERSE_EQUAL_REPEATED_REMOVE_REFILL",
      decisiveInvariant: "GEOMETRIC_RETENTION",
      baseDifficulty: "Hard",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "INVERSE_CLOSURE"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      cpId: "MAL-CP-003",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORIGINAL_COMPONENT_QUANTITY",
      topology: "UNEQUAL_REPEATED_REMOVE_REFILL",
      decisiveInvariant: "PRODUCT_OF_STAGE_RETENTIONS",
      baseDifficulty: "Hard",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "BOUNDARY_CONSTRUCTION"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId: "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      cpId: "MAL-CP-003",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_THREE_COMPONENT_COMPOSITION",
      topology: "THREE_COMPONENT_SEQUENTIAL_REFILL",
      decisiveInvariant: "FULL_COMPONENT_STAGE_LEDGER",
      baseDifficulty: "Hard",
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      sourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "BOUNDARY_CONSTRUCTION"],
      currentOwnerVerdict: "MAL-CP-003",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      prototypeId:
        "MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY",
      cpId: "MAL-CP-003",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORIGINAL_COMPONENT_FRACTION",
      topology: "CONCENTRATION_SEMANTIC_BOUNDARY",
      decisiveInvariant: "CONSERVATION_WITH_CONCENTRATION_SEMANTICS",
      baseDifficulty: "Medium",
      discoveryStatus: "SOURCE_RECOVERED_BOUNDARY_PENDING_EXECUTION",
      sourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "BOUNDARY_CONSTRUCTION"],
      currentOwnerVerdict: "MAL-CP-003_CP004_BOUNDARY",
      permanentQlId: null,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
  ] as const;

if (
  MAL_CP003_DISCOVERY_REGISTRY.length !==
  MAL_CP003_DISCOVERY_PROTOTYPE_IDS.length
) {
  throw new Error("MAL-CP-003 discovery registry does not cover every prototype ID.");
}

export function getMalCp003DiscoveryRegistryEntry(
  prototypeId: MalCp003DiscoveryPrototypeId,
): MalCp003DiscoveryRegistryEntry {
  const entry = MAL_CP003_DISCOVERY_REGISTRY.find(
    (candidate) => candidate.prototypeId === prototypeId,
  );
  if (!entry) {
    throw new Error(`Unknown MAL-CP-003 discovery prototype: ${prototypeId}.`);
  }
  return entry;
}

export const MAL_CP003_EXECUTABLE_PROTOTYPE_IDS =
  MAL_CP003_DISCOVERY_REGISTRY.filter(
    (entry): entry is MalCp003DiscoveryRegistryEntry & {
      prototypeId: MalCp003ExecutablePrototypeId;
      discoveryStatus: "EXECUTABLE_DISCOVERY";
    } => entry.discoveryStatus === "EXECUTABLE_DISCOVERY",
  ).map((entry) => entry.prototypeId);
