export const STAT004_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Stat004Difficulty = (typeof STAT004_DIFFICULTIES)[number];
export type Stat004ExamProfile = "SSC_CGL_TIER_II" | "SSC_CGL_JSO";

export const STAT004_CONTRACT_IDS = [
  "PRIMARY_VS_SECONDARY_SOURCE",
  "CENSUS_VS_SAMPLE_ENUMERATION",
  "DIRECT_PERSONAL_INVESTIGATION",
  "INDIRECT_ORAL_INVESTIGATION",
  "SCHEDULE_VS_QUESTIONNAIRE",
  "OBSERVATION_METHOD",
  "SECONDARY_DATA_FITNESS",
  "QUALITATIVE_CLASSIFICATION",
  "DISCRETE_VS_CONTINUOUS_VARIABLE",
  "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION",
  "ONE_WAY_VS_TWO_WAY_CLASSIFICATION",
  "TABLE_COMPONENTS",
  "FREQUENCY_TABLE_CHECK",
  "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS",
  "BUILD_A_BASIC_FREQUENCY_TABLE",
] as const;

export type Stat004ContractId = (typeof STAT004_CONTRACT_IDS)[number];
export type Stat004Question = Readonly<{
  packageId: "STAT-004";
  questionId: string;
  contractId: Stat004ContractId;
  qlId: string;
  seed: string;
  examProfile: Stat004ExamProfile;
  difficulty: Stat004Difficulty;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  answer: string;
  explanation: string;
  language: "en";
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  productionReleaseAuthorized: false;
}>;
