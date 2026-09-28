export type Di013ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Di013Difficulty = "Easy" | "Medium" | "Hard";
export type Di013TaskKind =
  | "DIRECT_SERIES_VALUE"
  | "HIGHEST_VALUE_FOR_SERIES"
  | "SAME_CATEGORY_DIFFERENCE"
  | "SAME_CATEGORY_COMBINED_TOTAL"
  | "WITHIN_SERIES_RATIO"
  | "THREE_CATEGORY_SERIES_TOTAL"
  | "SERIES_TOTAL_DIFFERENCE"
  | "TWO_CATEGORY_GROUP_RATIO"
  | "TOTAL_SERIES_RATIO"
  | "FOUR_VALUE_CROSS_TOTAL";

export type Di013Point = Readonly<{ category:string; seriesA:number; seriesB:number }>;
export type Di013Stimulus = Readonly<{
  kind:"RADAR";
  contextId:string;
  title:string;
  instruction:string;
  seriesALabel:string;
  seriesBLabel:string;
  unit:string;
  points:readonly Di013Point[];
  radialTicks:readonly number[];
}>;
export type Di013Question = Readonly<{
  questionId:string;
  kind:Di013TaskKind;
  difficulty:Di013Difficulty;
  stem:string;
  options:readonly string[];
  correctIndex:number;
  answer:string;
  explanation:Readonly<{keyIdea:string;steps:readonly string[]}>;
}>;
export type Di013Set = Readonly<{
  packageId:"DI-013";
  seed:string;
  examProfile:Di013ExamProfile;
  stimulus:Di013Stimulus;
  questions:readonly Di013Question[];
}>;
