import type { Stat004ContractId, Stat004Difficulty, Stat004ExamProfile } from "./types";

export const STAT004_PERMANENT_RELEASE_ID = "STAT-004-PERMANENT-ENGLISH-REVIEW-P0" as const;

export type Stat004PermanentQlDescriptor = Readonly<{
  qlId: `STAT-QL-${string}`;
  contractId: Stat004ContractId;
  label: string;
  semanticContract: string;
  difficulty: Stat004Difficulty;
  supportedProfiles: readonly Stat004ExamProfile[];
  sourceStatus: "PHASE0_CERTIFIED";
  editorialStatus: "ENGLISH_REVIEW_APPROVED";
  localizationStatus: "NOT_STARTED";
}>;

const PROFILES = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"] as const;
const row = (qlId: `STAT-QL-${string}`, contractId: Stat004ContractId, label: string, semanticContract: string, difficulty: Stat004Difficulty): Stat004PermanentQlDescriptor => ({
  qlId, contractId, label, semanticContract, difficulty, supportedProfiles: PROFILES,
  sourceStatus: "PHASE0_CERTIFIED", editorialStatus: "ENGLISH_REVIEW_APPROVED", localizationStatus: "NOT_STARTED",
});

// STAT-001..003 own STAT-QL-001..020. These next IDs are reserved here once;
// generation and routing resolve IDs through this registry instead of deriving them.
export const STAT004_PERMANENT_QLS: readonly Stat004PermanentQlDescriptor[] = Object.freeze([
  row("STAT-QL-021", "PRIMARY_VS_SECONDARY_SOURCE", "Primary versus secondary data", "Identify whether information was collected first-hand for the current investigation or reused from an existing source.", "Easy"),
  row("STAT-QL-022", "CENSUS_VS_SAMPLE_ENUMERATION", "Complete enumeration versus sample survey", "Distinguish collecting data from every unit of a stated population from collecting data from only a selected part.", "Easy"),
  row("STAT-QL-023", "DIRECT_PERSONAL_INVESTIGATION", "Direct personal investigation", "Recognize first-hand collection by the investigator directly from the units concerned.", "Medium"),
  row("STAT-QL-024", "INDIRECT_ORAL_INVESTIGATION", "Indirect oral investigation", "Identify collection of information from informed witnesses when the units concerned are not directly approached.", "Medium"),
  row("STAT-QL-025", "SCHEDULE_VS_QUESTIONNAIRE", "Schedules and questionnaires", "Distinguish enumerator-recorded schedules from forms completed by respondents themselves.", "Medium"),
  row("STAT-QL-026", "OBSERVATION_METHOD", "Observation method", "Identify systematic recording of events or behaviour without asking respondents to report them.", "Easy"),
  row("STAT-QL-027", "SECONDARY_DATA_FITNESS", "Assess fitness of secondary data", "Check whether an existing source matches a study's definitions, units, population and reference period.", "Hard"),
  row("STAT-QL-028", "QUALITATIVE_CLASSIFICATION", "Qualitative classification", "Classify data expressed as categories or attributes rather than numerical magnitudes.", "Easy"),
  row("STAT-QL-029", "DISCRETE_VS_CONTINUOUS_VARIABLE", "Discrete and continuous variables", "Distinguish countable numerical values from measurements that may take values across an interval.", "Easy"),
  row("STAT-QL-030", "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION", "Chronological and geographical classification", "Identify organization by time period or by place from the stated table structure.", "Easy"),
  row("STAT-QL-031", "ONE_WAY_VS_TWO_WAY_CLASSIFICATION", "One-way and two-way classification", "Determine whether observations are grouped by one characteristic or jointly by two characteristics.", "Medium"),
  row("STAT-QL-032", "TABLE_COMPONENTS", "Parts of a statistical table", "Identify the function of a stub, caption, title, body or source note in a statistical table.", "Medium"),
  row("STAT-QL-033", "FREQUENCY_TABLE_CHECK", "Check a frequency distribution", "Verify that class/category frequencies reconcile with the stated number of observations.", "Medium"),
  row("STAT-QL-034", "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS", "Class-interval boundary convention", "Assign a boundary observation to exactly one class using the convention stated in the question.", "Hard"),
  row("STAT-QL-035", "BUILD_A_BASIC_FREQUENCY_TABLE", "Construct a basic frequency table", "Tally a small raw data set into stated non-overlapping intervals and verify the frequency total.", "Hard"),
] as const);

const BY_QL = new Map(STAT004_PERMANENT_QLS.map((item) => [item.qlId, item] as const));
const BY_CONTRACT = new Map(STAT004_PERMANENT_QLS.map((item) => [item.contractId, item] as const));
export function getStat004PermanentQl(qlId: string) { return BY_QL.get(qlId as `STAT-QL-${string}`); }
export function getStat004PermanentQlForContract(contractId: Stat004ContractId) {
  const item = BY_CONTRACT.get(contractId);
  if (!item) throw new Error(`STAT-004 permanent ownership is missing for ${contractId}.`);
  return item;
}
export const STAT004_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "STAT-004" as const,
  releaseId: STAT004_PERMANENT_RELEASE_ID,
  qlCount: STAT004_PERMANENT_QLS.length,
  lifecycle: Object.freeze({ questionStudioDiscoverable: true, questionStudioMode: "CONTROLLED_REVIEW" as const,
    questionBankStatus: "NOT_STORED" as const, questionBankWritable: false as const, testEligibility: "INELIGIBLE" as const,
    testEligible: false as const, mockTestEligible: false as const, publiclyPublishable: false as const,
    automaticStudentPublication: false as const, productionReleaseAuthorized: false as const }),
});
