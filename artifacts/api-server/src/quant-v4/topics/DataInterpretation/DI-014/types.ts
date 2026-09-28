import type { Di005V2Stimulus } from "../DI-005/pie-v2-types";

export type Di014Difficulty = "Easy" | "Medium" | "Hard";
export type Di014Task =
  | "DIRECT_APPLICATIONS"
  | "APPROVED_COUNT_FROM_PIE"
  | "CATEGORY_GAP"
  | "CATEGORY_APPROVAL_RATE"
  | "APPLICATION_TO_APPROVAL_RATIO"
  | "TWO_CATEGORY_APPROVED_TOTAL"
  | "TWO_CATEGORY_APPLICATION_TOTAL"
  | "GROUP_APPLICATION_TO_APPROVAL_RATIO"
  | "TOTAL_APPLICATION_TO_APPROVAL_RATIO"
  | "CROSS_CATEGORY_APPLICATION_APPROVAL_RATIO"
  | "REJECTED_TO_APPROVED_RATIO"
  | "TWO_CATEGORY_REJECTED_TOTAL"
  | "APPROVAL_RATE_DIFFERENCE"
  | "HIGHEST_APPROVAL_RATE";

export type Di014RadarStimulus = Readonly<{
  kind:"RADAR_SINGLE";
  title:string;
  instruction:string;
  unit:string;
  points:readonly Readonly<{category:string;applications:number}>[];
  radialTicks:readonly number[];
}>;

export type Di014Set = Readonly<{
  packageId:"DI-014";
  seed:string;
  examProfile:"BANKING_MAINS";
  radar:Di014RadarStimulus;
  pie:Di005V2Stimulus;
  approvedCounts:readonly number[];
  questions:readonly Readonly<{
    questionId:string;
    kind:Di014Task;
    difficulty:Di014Difficulty;
    stem:string;
    options:readonly string[];
    correctIndex:number;
    answer:string;
    explanation:Readonly<{keyIdea:string;steps:readonly string[]}>;
  }>[];
}>;
