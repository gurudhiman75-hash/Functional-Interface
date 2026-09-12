import { LP_001_REVIEW_PACKAGE } from "./index.ts";
import { LP_002_REVIEW_PACKAGE } from "./lp-002.ts";
import { LP_003_REVIEW_PACKAGE } from "./lp-003.ts";
import { LP_004_REVIEW_PACKAGE } from "./lp-004.ts";
import { LP_005_REVIEW_PACKAGE } from "./lp-005.ts";
import { LP_006_REVIEW_PACKAGE } from "./lp-006.ts";
import { LP_007_REVIEW_PACKAGE } from "./lp-007.ts";
import { LP_008_REVIEW_PACKAGE } from "./lp-008.ts";
import { LP_001_008_ENGLISH_APPROVAL_V4_2 } from "./lp-001-008-english-approval-v4-2.ts";

export const LP_001_008_PERMANENT_QL_ALLOCATIONS = Object.freeze([
  Object.freeze({ qlId: "LP-QL-001" as const, packageId: "LP-001" as const, authorityId: "PERSON_TO_UNIT_LOOKUP" as const, task: "Identify the unit assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-002" as const, packageId: "LP-001" as const, authorityId: "SAME_UNIT_PAIR" as const, task: "Identify a pair assigned to the same unit." }),
  Object.freeze({ qlId: "LP-QL-003" as const, packageId: "LP-001" as const, authorityId: "UNIT_TO_MEMBERS_LOOKUP" as const, task: "Identify the two members assigned to a named unit." }),
  Object.freeze({ qlId: "LP-QL-004" as const, packageId: "LP-001" as const, authorityId: "DIFFERENT_UNIT_PAIR" as const, task: "Identify a pair assigned to different units." }),

  Object.freeze({ qlId: "LP-QL-005" as const, packageId: "LP-002" as const, authorityId: "PERSON_TO_DAY_LOOKUP" as const, task: "Identify the day assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-006" as const, packageId: "LP-002" as const, authorityId: "PERSON_TO_LOCATION_LOOKUP" as const, task: "Identify the location assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-007" as const, packageId: "LP-002" as const, authorityId: "DAY_TO_PERSON_LOOKUP" as const, task: "Identify the person assigned to a named day." }),
  Object.freeze({ qlId: "LP-QL-008" as const, packageId: "LP-002" as const, authorityId: "PERSON_DAY_LOCATION_MATCH" as const, task: "Identify the correct person-day-location match." }),

  Object.freeze({ qlId: "LP-QL-009" as const, packageId: "LP-003" as const, authorityId: "POSITION_TO_BOX_LOOKUP" as const, task: "Identify the box or object at a named position." }),
  Object.freeze({ qlId: "LP-QL-010" as const, packageId: "LP-003" as const, authorityId: "BOX_TO_POSITION_LOOKUP" as const, task: "Identify the position of a named box or object." }),
  Object.freeze({ qlId: "LP-QL-011" as const, packageId: "LP-003" as const, authorityId: "BETWEEN_BOX_COUNT" as const, task: "Count the boxes or objects between two named items." }),
  Object.freeze({ qlId: "LP-QL-012" as const, packageId: "LP-003" as const, authorityId: "IMMEDIATE_ABOVE_BOX_LOOKUP" as const, task: "Identify the box or object immediately above a named item." }),

  Object.freeze({ qlId: "LP-QL-013" as const, packageId: "LP-004" as const, authorityId: "BOTH_SELECTED_PAIR" as const, task: "Identify a pair whose two members are selected." }),
  Object.freeze({ qlId: "LP-QL-014" as const, packageId: "LP-004" as const, authorityId: "EXACTLY_ONE_SELECTED_PAIR" as const, task: "Identify a pair containing exactly one selected member." }),
  Object.freeze({ qlId: "LP-QL-015" as const, packageId: "LP-004" as const, authorityId: "THREE_PERSON_SELECTION_PATTERN" as const, task: "Identify the correct selection pattern across three named candidates." }),
  Object.freeze({ qlId: "LP-QL-016" as const, packageId: "LP-004" as const, authorityId: "THREE_PERSON_SELECTED_COUNT" as const, task: "Count selected members in a named three-person subset." }),

  Object.freeze({ qlId: "LP-QL-017" as const, packageId: "LP-005" as const, authorityId: "PERSON_TO_DUTY_LOOKUP" as const, task: "Identify the duty assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-018" as const, packageId: "LP-005" as const, authorityId: "PERSON_TO_LOCATION_LOOKUP" as const, task: "Identify the location assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-019" as const, packageId: "LP-005" as const, authorityId: "DUTY_TO_PERSON_LOOKUP" as const, task: "Identify the person assigned to a named duty." }),
  Object.freeze({ qlId: "LP-QL-020" as const, packageId: "LP-005" as const, authorityId: "PERSON_DUTY_LOCATION_MATCH" as const, task: "Identify the correct person-duty-location match." }),

  Object.freeze({ qlId: "LP-QL-021" as const, packageId: "LP-006" as const, authorityId: "PERSON_TO_DAY_LOOKUP" as const, task: "Identify the day assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-022" as const, packageId: "LP-006" as const, authorityId: "PERSON_TO_STUDY_AREA_LOOKUP" as const, task: "Identify the study area assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-023" as const, packageId: "LP-006" as const, authorityId: "PERSON_TO_CITY_LOOKUP" as const, task: "Identify the city assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-024" as const, packageId: "LP-006" as const, authorityId: "PERSON_DAY_STUDY_AREA_CITY_MATCH" as const, task: "Identify the correct person-day-study-area-city match." }),

  Object.freeze({ qlId: "LP-QL-025" as const, packageId: "LP-007" as const, authorityId: "PERSON_TO_VALUE_LOOKUP" as const, task: "Identify the value or choice assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-026" as const, packageId: "LP-007" as const, authorityId: "VALUE_TO_PERSON_LOOKUP" as const, task: "Identify the person assigned to a named value or choice." }),
  Object.freeze({ qlId: "LP-QL-027" as const, packageId: "LP-007" as const, authorityId: "TWO_PERSON_VALUE_MATCH" as const, task: "Identify the correct values or choices for two named people." }),
  Object.freeze({ qlId: "LP-QL-028" as const, packageId: "LP-007" as const, authorityId: "THREE_PERSON_VALUE_MATCH" as const, task: "Identify the correct values or choices for three named people." }),

  Object.freeze({ qlId: "LP-QL-029" as const, packageId: "LP-008" as const, authorityId: "DATE_MONTH_TO_PERSON_LOOKUP" as const, task: "Identify the person assigned to a stated date and month." }),
  Object.freeze({ qlId: "LP-QL-030" as const, packageId: "LP-008" as const, authorityId: "PERSON_TO_DATE_MONTH_LOOKUP" as const, task: "Identify the date and month assigned to a named person." }),
  Object.freeze({ qlId: "LP-QL-031" as const, packageId: "LP-008" as const, authorityId: "TWO_PERSON_DATE_MONTH_MATCH" as const, task: "Identify the correct date-and-month assignments for two named people." }),
  Object.freeze({ qlId: "LP-QL-032" as const, packageId: "LP-008" as const, authorityId: "THREE_PERSON_DATE_MONTH_MATCH" as const, task: "Identify the correct date-and-month assignments for three named people." }),
] as const);

const PACKAGE_FREEZES = [
  LP_001_REVIEW_PACKAGE,
  LP_002_REVIEW_PACKAGE,
  LP_003_REVIEW_PACKAGE,
  LP_004_REVIEW_PACKAGE,
  LP_005_REVIEW_PACKAGE,
  LP_006_REVIEW_PACKAGE,
  LP_007_REVIEW_PACKAGE,
  LP_008_REVIEW_PACKAGE,
].map((pkg) => Object.freeze({
  packageId: pkg.packageId,
  checkpointId: pkg.checkpointId,
  permanentQlIds: Object.freeze([...pkg.qlIds]),
  permanentQlCount: pkg.qlIds.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  englishFreezeStatus: "FROZEN" as const,
}));

export const LP_001_008_ENGLISH_FREEZE_V1 = Object.freeze({
  authorityId: "LP_001_008_ENGLISH_FREEZE_V1" as const,
  approvedEditorialAuthority: LP_001_008_ENGLISH_APPROVAL_V4_2.authorityId,
  approvedSourceAuthority: LP_001_008_ENGLISH_APPROVAL_V4_2.approvedSourceAuthority,
  approvedCommit: LP_001_008_ENGLISH_APPROVAL_V4_2.approvedCommit,
  packages: Object.freeze(PACKAGE_FREEZES),
  permanentQlIds: Object.freeze(LP_001_008_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId)),
  permanentQlCount: LP_001_008_PERMANENT_QL_ALLOCATIONS.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  englishFreezeStatus: "FROZEN" as const,
  learnerLanguage: "en" as const,
  nextAvailableQlId: "LP-QL-041" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationStatus: "READY_TO_START" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  freezeGuardScope: Object.freeze([
    "PERMANENT_QL_SET_001_032",
    "V4_2_LEARNER_FACING_CLUE_CONTRACT",
    "COMPLETE_VARIABLE_DOMAINS",
    "DEPENDENCY_DRIVEN_EXPLANATIONS",
    "PROGRESSIVE_PLACEHOLDER_TABLES",
    "GENUINE_CASE_TABLES",
    "V2_OPTION_INTEGRITY",
    "REVIEW_ONLY_LIFECYCLE_UNTIL_LOCALIZATION_APPROVAL",
  ] as const),
});
