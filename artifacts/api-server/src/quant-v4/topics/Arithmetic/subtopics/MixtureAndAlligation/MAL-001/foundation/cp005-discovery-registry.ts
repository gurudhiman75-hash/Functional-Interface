import { MAL_CP005_DISCOVERY_PROTOTYPE_IDS, MAL_CP005_ID, type MalCp005DiscoveryRegistryEntry } from "./cp005-types";

const COMMON_DIRECT_SOURCES = [
  "UPLOADED-DISHA-SSC-MATHEMATICS-ALLIGATIONS",
  "UPLOADED-ARUN-SHARMA-QUANTITATIVE-APTITUDE-ALLIGATION",
  "UPLOADED-RS-AGGARWAL-QUANTITATIVE-APTITUDE-DEALER-QUESTIONS",
] as const;
const flags = { permanentQlId:null, active:false, publiclyPublishable:false, questionStudioDiscoverable:false, questionBankWritable:false, testEligible:false } as const;
const sourceEvidenceStatus = "REFERENCE_AND_LEGACY_RECOVERED_PENDING_FIXTURE_NORMALIZATION" as const;

export const MAL_CP005_DISCOVERY_REGISTRY: readonly MalCp005DiscoveryRegistryEntry[] = [
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[0], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PROFIT_PERCENT", taskDirection:"FORWARD", method:"FREE_ADULTERANT_COST_BASE", legacyFamilyAuthorities:["mix_price_profit_basic","dealer_profit_by_mixing_water","dealer_sells_mixture_at_cost_price"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Easy", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[1], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PURE_TO_ADULTERANT_RATIO", taskDirection:"INVERSE", method:"FREE_ADULTERANT_COST_BASE", legacyFamilyAuthorities:["mix_price_profit_target_gain","dealer_target_profit_after_adulteration"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Easy", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[2], canonicalProblemId:MAL_CP005_ID, answerSemantic:"ADULTERANT_QUANTITY", taskDirection:"RECONSTRUCTION", method:"FREE_ADULTERANT_COST_BASE", legacyFamilyAuthorities:["dealer_profit_by_mixing_water","dealer_target_profit_after_adulteration"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Medium", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[3], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PURE_QUANTITY", taskDirection:"INVERSE", method:"FREE_ADULTERANT_COST_BASE", legacyFamilyAuthorities:["dealer_profit_by_mixing_water","dealer_target_profit_after_adulteration"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Medium", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[4], canonicalProblemId:MAL_CP005_ID, answerSemantic:"ADULTERANT_PERCENT_OF_MIXTURE", taskDirection:"INVERSE", method:"FREE_ADULTERANT_COST_BASE", legacyFamilyAuthorities:["dealer_dishonest_milk_water","dealer_sells_mixture_at_cost_price"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Medium", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[5], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PROFIT_PERCENT", taskDirection:"FORWARD", method:"FREE_ADULTERANT_COST_BASE", legacyFamilyAuthorities:["dealer_dishonest_milk_water","mix_price_profit_basic"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Medium", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[6], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PROFIT_PERCENT", taskDirection:"FORWARD", method:"COMMERCIAL_MULTIPLIER", legacyFamilyAuthorities:["mix_price_profit_basic","dealer_profit_with_impurity"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Medium", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[7], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PURE_TO_ADULTERANT_RATIO", taskDirection:"INVERSE", method:"COMMERCIAL_MULTIPLIER", legacyFamilyAuthorities:["mix_price_profit_target_gain","dealer_target_profit_after_adulteration"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Hard", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[8], canonicalProblemId:MAL_CP005_ID, answerSemantic:"SELLING_RATE", taskDirection:"RECONSTRUCTION", method:"COMMERCIAL_MULTIPLIER", legacyFamilyAuthorities:["mix_price_profit_target_gain","dealer_profit_by_mixing_water"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Hard", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[9], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PROFIT_PERCENT", taskDirection:"FORWARD", method:"WEIGHTED_MIXTURE_COST", legacyFamilyAuthorities:["dealer_profit_with_impurity","mix_price_profit_basic"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Medium", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[10], canonicalProblemId:MAL_CP005_ID, answerSemantic:"PURE_TO_CHEAPER_RATIO", taskDirection:"INVERSE", method:"WEIGHTED_MIXTURE_COST", legacyFamilyAuthorities:["dealer_profit_with_impurity","mix_price_profit_target_gain"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Hard", ...flags },
  { prototypeId:MAL_CP005_DISCOVERY_PROTOTYPE_IDS[11], canonicalProblemId:MAL_CP005_ID, answerSemantic:"SELLING_RATE", taskDirection:"RECONSTRUCTION", method:"WEIGHTED_MIXTURE_COST", legacyFamilyAuthorities:["dealer_profit_with_impurity","mix_price_profit_target_gain"], directReferenceAuthorities:COMMON_DIRECT_SOURCES, sourceEvidenceStatus, baseDifficulty:"Hard", ...flags },
];

export const MAL_CP005_BOUNDARY_LEDGER = [
  { legacyFamilyId:"dealer_false_weight_alligation", currentVerdict:"REASSIGN_PNL_CP005", reason:"False weight and short delivery change quantity delivered without changing mixture composition; PNL-CP-005 already owns this family." },
  { legacyFamilyId:"mix_price_profit_target_loss", currentVerdict:"MAL_CP005_PNL_BOUNDARY", reason:"Retain in MAL only when mixture composition is indispensable to the loss calculation." },
  { legacyFamilyId:"mix_cost_selling_price_alligation", currentVerdict:"MAL_CP001_CP005_BOUNDARY", reason:"A pure blend-value question belongs to CP-001; CP-005 requires an actual commercial profit or loss objective." },
  { legacyFamilyId:"dealer_profit_with_impurity_missing_component_cost", currentVerdict:"MAL_CP001_CP005_BOUNDARY", reason:"Recovering a missing source price may be CP-001 after the target average cost is derived; do not create a duplicate before equivalence audit." },
  { legacyFamilyId:"markup_discount_after_adulteration", currentVerdict:"MAL_CP005_PNL_BOUNDARY", reason:"Price-policy composition may be retained only when adulteration remains a necessary relation rather than decorative context." },
  { legacyFamilyId:"repeated_replacement_then_sale", currentVerdict:"MAL_CP003_CP005_BOUNDARY", reason:"Repeated sampling and refill remain CP-003 unless a distinct coupled commercial contract survives source and merge-split review." },
] as const;

if (MAL_CP005_DISCOVERY_REGISTRY.length!==MAL_CP005_DISCOVERY_PROTOTYPE_IDS.length) throw new Error("CP-005 discovery registry count does not match IDs.");
