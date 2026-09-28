export type Di006AdvancedExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Di006AdvancedDifficulty = "Easy" | "Medium" | "Hard";
export type Di006AdvancedTopology =
  | "PERCENT_DISTRIBUTION"
  | "RATIO_NETWORK"
  | "TWO_STAGE_ALLOCATION"
  | "TWO_GROUP_COMPARISON"
  | "CONDITIONAL_DERIVED";

export type Di006AdvancedTask =
  | "RECOVER_SINGLE_CATEGORY"
  | "COMBINED_TWO_CATEGORIES"
  | "CATEGORY_DIFFERENCE"
  | "CATEGORY_RATIO"
  | "CATEGORY_SHARE_OF_TOTAL"
  | "GROUP_TOTAL"
  | "GROUP_RATIO"
  | "DERIVED_PERCENT_EXCESS"
  | "THREE_CATEGORY_TOTAL"
  | "REMAINDER_AFTER_GROUP";

export type Di006AdvancedStimulus = Readonly<{
  kind: "ADVANCED_CASELET";
  topology: Di006AdvancedTopology;
  title: string;
  instruction: string;
  learnerText: string;
  categories: readonly string[];
  totalValue: number;
  unit: string;
}>;

export type Di006AdvancedQuestion = Readonly<{
  questionId: string;
  kind: Di006AdvancedTask;
  difficulty: Di006AdvancedDifficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Readonly<{ keyIdea: string; steps: readonly string[] }>;
}>;

export type Di006AdvancedSet = Readonly<{
  packageId: "DI-006";
  mode: "ADVANCED_CASELET_TOPOLOGIES_V1";
  seed: string;
  examProfile: Di006AdvancedExamProfile;
  stimulus: Di006AdvancedStimulus;
  resolvedValues: readonly number[];
  questions: readonly Di006AdvancedQuestion[];
}>;
