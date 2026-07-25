export const PNC_002_PACKAGE_ID = "PNC-002" as const;
export type Pnc002QlId = `PNC-QL-${number}`;
export type Pnc002Difficulty = "Easy" | "Medium" | "Hard";
export type Pnc002SolveMode =
  | "countSingleBlockTogether"
  | "countMultipleBlocksTogether"
  | "countSpecifiedGroupNotAllTogether"
  | "countTwoSpecifiedApart"
  | "countExactlyOnePairTogether"
  | "recoverTotalObjectsFromBlockCount";
export interface Pnc002QuestionEntry { qlId:Pnc002QlId; cpId:"PNC-CP-007"; difficulty:Pnc002Difficulty; template:string; solveMode:Pnc002SolveMode; }
export interface Pnc002Parameters { qlId:Pnc002QlId; seed:string; totalObjects:number; blockSize:number; secondBlockSize:number; target:number; }
export interface Pnc002SolverEvidence { outerUnits:number; unrestricted:number; forbidden:number; firstForced?:number; bothForced?:number; recoveredN?:number; }
export interface Pnc002Package { packageId:"PNC-002"; canonicalProblemId:"PNC-CP-007"; qlId:Pnc002QlId; seed:string; difficulty:Pnc002Difficulty; solveMode:Pnc002SolveMode; stem:string; options:string[]; correctIndex:number; answer:string; equation:string; explanation:string[]; evidence:Pnc002SolverEvidence; verifierAnswer:number; valid:boolean; publiclyPublishable:false; }
